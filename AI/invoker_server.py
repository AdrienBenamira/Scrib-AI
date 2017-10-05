import os
import time
import falcon
import json
import re
from functions_server import article_from_url, fonction_principale
import nltk


#
#Commande a executer : gunicorn invoker_server:api -t 200 --worker-connections 10
#

print('Ready')


class LetsSummarize:
    def on_post(self, req, resp):
        print('START summarization')
        t0=time.time()
        response=json.loads(req.stream.read())
        nbre_words_input=len(response['article'].encode('utf-8').split())
        nbre_words_input=nbre_words_input+int(nbre_words_input*0.1)
        ratio=0.30
        nbre_words_output=int(nbre_words_input*ratio)
        print(nbre_words_input,nbre_words_output)
        #try:
        #    ratio=response['ratio']
        #except ValueError:
        #    print("Ratio par default 0.2")
        with open("finished_files/original.source", "w") as output:
            output.write(str(response['article'].encode('utf-8')))
        resultat=fonction_principale(nbre_words_input,nbre_words_output)
        t1=time.time()
        Nc=len(resultat.split())
        gain=(60*(nbre_words_input-Nc)/300)-(t1-t0)
        content={
            'status':'sucess',
            'resp_resume':resultat,
            'chrono': t1-t0,
            'gain':gain
        }
        print(t1-t0,gain)
        resp.body = json.dumps(content)
        print('FINISH summarization')




class LetsSummarizeSite:
    def on_post(self, req,resp):
        print("START TRANSFORM SITE")
        t0=time.time()
        compteur=0
        response=req.stream.read()
        #print(response)
        response=json.loads(response)
        (art, titre,authors,publish_date,keywords)=article_from_url(str(response['url']), req, resp)
        nbre_words_input=len(art.encode('utf-8').split())
        nbre_words_input=nbre_words_input+int(nbre_words_input*0.1)
        ratio=0.30
        nbre_words_output=int(nbre_words_input*ratio)
        print(nbre_words_input,nbre_words_output)
        #try:
        #    ratio=response['ratio']
        #except ValueError:
        #    print("Ratio par default 0.2")
        with open("finished_files/original.source", "w") as output:
            output.write(str(art.encode('utf-8')))
        resultat=fonction_principale(nbre_words_input,nbre_words_output)
        t1=time.time()
        content={
            'status':'sucess',
            'resp_resume':resultat,
            'texte_original':art,
            'titre':titre,
            'authors':authors,
            'publish_date':publish_date,
            'keywords':keywords,
            'chrono': t1-t0
        }
        print(t1-t0)
        print("END TRANSFORM SITE")
        resp.body = json.dumps(content)



api=falcon.API()
api.add_route('/summary',LetsSummarize())
api.add_route('/summarize_site',LetsSummarizeSite())
