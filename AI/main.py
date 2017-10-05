import os
import time
import falcon
import json
import re
from parser2 import HTML_from_url

#
#Commande a executer : gunicorn main:api -t 200 --worker-connections 10
#

print('Ready')

def uppercase(matchobj):
    return matchobj.group(0).upper()

def capitalize(s):
    return re.sub('^([a-z])|[\.|\?|\!]\s*([a-z])|\s+([a-z])(?=\.)', uppercase, s)

def fonction_principale():
    print('START make data')
    os.system("python2 make_datafiles.py")
    print('END make data')
    print('')
    print('START run_summarization')
    os.system("python2 run_summarization.py --mode=decode  --data_path=finished_files/intermediaire.bin --vocab_path=finished_files/vocab --log_root= --exp_name=pretrained_model_tf1.2.1/ ")
    print('End run_summarization')
    with open("finished_files/resume.txt", "r") as output:
        resultat=output.read()
    resultat=resultat.replace('\\n','')
    resultat=capitalize(resultat)
    return resultat



class LetsSummarize:
    def on_post(self, req, resp):
        print('START summarization')
        t0=time.time()
        response=json.loads(req.stream.read())
        with open("finished_files/original.source", "w") as output:
            output.write(str(response['article'].encode('utf-8')))
        fonction_principale()
        t1=time.time()
        content={
            'status':'sucess',
            'resp_resume':resultat,
            'chrono': t1-t0
        }
        print(t1-t0)
        resp.body = json.dumps(content)
        print('FINISH summarization')
        except IOError as e:
            print e



class LetsSummarizeSite:
    def on_post(self, req,resp):
        print("START TRANSFORM SITE")
        t0=time.time()
        compteur=0
        try:
            response=req.stream.read()
            #print(response)
            response=json.loads(response)

            (res, art, titre,authors,publish_date,keywords)=HTML_from_url(str(response['url']), req, resp)
            t1=time.time()
            content={
                'status':'sucess',
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
        except IOError as e:
            print e


api=falcon.API()
api.add_route('/summary',LetsSummarize())
api.add_route('/summarize_site',LetsSummarizeSite())
