import requests
import justext
import json
import os
import time
import falcon
import re

print('Ready')

def HTML_from_url(url):
    #url as string
    texte=''
    response = requests.get(url)
    paragraphs = justext.justext(response.content, justext.get_stoplist("English"))
    for paragraph in paragraphs:
      if not paragraph.is_boilerplate:
          path=paragraph.dom_path.split('.')
          if path[len(path)-1]=='p':
              texte=texte+paragraph.text.encode('utf8')

    url_resume = "http://127.0.0.1:8000/summarize_site"
    headers = {}
    response = requests.post(url_resume, data=json.dumps({'article':str(texte)}),headers=headers)
    article_resume=json.loads(response.text)['resp_resume']

    site = requests.get(url)
    compteur=0
    paragraphs = justext.justext(site.content, justext.get_stoplist("English"))
    for paragraph in paragraphs:
      if not paragraph.is_boilerplate:
          path=paragraph.dom_path.split('.')
          if path[len(path)-1]=='p':
              compteur=compteur+1
              print('compteur='+str(compteur))
              if compteur==1:
                  print(paragraph.text)
                  site_final=site.content.replace(paragraph.text,article_resume)
              else:
                  print(paragraph.text)
                  site_final=site_final.replace(paragraph.text,'')
    return(site_final)


class LetsTransformeSite:
    def on_post(self, req,resp):
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
            resp.body = json.dumps(content)
        except IOError as e:
            print e

api2=falcon.API()
api2.add_route('/newsite',LetsTransformeSite())
