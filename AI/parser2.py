 # -*- coding: utf-8 -*-
import requests
import justext
from newspaper import Article
import json
import os
import time
import falcon
import re


print('Ready')

def HTML_from_url(url):
    #url as string
    texte=''
    article = Article(url, keep_article_html=True)
    article.download()
    article.parse()
    texte=article.text

    url_resume = "http://127.0.0.1:8000/summarize_site"
    headers = {}
    response = requests.post(url_resume, data=json.dumps({'article':texte}),headers=headers)
    article_resume=json.loads(response.text)['resp_resume']
    site = article.html
    html_article=article.article_html
    compteur=0
    sentences = justext.justext(html_article, justext.get_stoplist("English"))
    print(article_resume)
    print ''
    print site
    print ''
    L=[]
    for sentence in sentences:
          print('compteur='+str(compteur))
          if compteur==0:
              print(sentence.text)
              print(site.find(sentence.text))
              if site.find(sentence.text)>=0:
                  compteur=compteur+1
              else:
                  L.append(sentence.text)
              site=site.replace(sentence.text,article_resume)
          else:
              print(sentence.text)
              print(site.find(sentence.text))
              if site.find(sentence.text)==-1:
                  L.append(sentence.text)
              site=site.replace(sentence.text,' ')
    try:
        for sentence_bis in L:
            if len(sentence_bis.split(' '))>2:
                sentence_bis=sentence_bis.split(' ')
                mot1= sentence_bis[0]+' '+sentence_bis[1]
                fin1= sentence_bis[len(sentence_bis)-2]+' '+sentence_bis[len(sentence_bis)-1]
                print(mot1, fin1)
                site=re.sub(mot1+'.*'+fin1,'',site, flags=re.DOTALL)
                return(site)
    except ValueError:
        return(site)

def get_infos_article(url):
    article = Article(url)
    article.download()
    article.parse()
    return(article.title,article.authors,article.publish_date,article.keywords)


class LetsTransformeSite:
    def on_post(self, req,resp):
        print("START TRANSFORM SITE")
        t0=time.time()
        compteur=0
        try:
            response=req.stream.read()
            #print(response)
            response=json.loads(response)
            new_site=HTML_from_url(str(response['url']))
            t1=time.time()
            content={
                'status':'sucess',
                'site_resume':new_site,
                'chrono': t1-t0
            }
            print(t1-t0)
            print("END TRANSFORM SITE")
            resp.body = json.dumps(content)
        except IOError as e:
            print e

class Information:
    def on_post(self, req,resp):
        print("START get infos")
        t01=time.time()
        compteur=0
        try:
            response=req.stream.read()
            #print(response)
            response=json.loads(response)
            title,authors,publish_date,keywords=get_infos_article(str(response['url']))
            t11=time.time()
            content={
                'status':'sucess',
                'titre':title,
                'chrono': authors,
                'publish_date':publish_date,
                'keywords':keywords
            }
            print(t11-t01)
            print("END get infos")
            resp.body = json.dumps(content)
        except IOError as e:
            print e

api2=falcon.API()
api2.add_route('/newsite',LetsTransformeSite())
api2.add_route('/infos',Information())
