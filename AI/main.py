import os
import os.path as path
import requests
import time
import falcon
import json
import re
#from functions_server import article_from_url, fonction_principale
import nltk
#from bson import json_util
import json

config = {}
config_path = path.abspath(path.join(path.dirname(__file__), './config/default.json'))
with open(config_path, 'r') as config_file:
    config = json.loads(config_file.read())


def summarize():
    print('START summarization')
    t0=time.time()
    response = response.json()['payload']
    nbre_words_input=len(response['article'].encode('utf-8').split())
    nbre_words_input=nbre_words_input+int(nbre_words_input*0.1)
    ratio=float(response['ratio'])
    print(ratio)
    nbre_words_output=int(nbre_words_input*ratio)
    print(nbre_words_input,nbre_words_output)
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
    response_body = json.dumps(content)
    requests.delete(config['host'] + '/api/queue/task', json=content)
    print('FINISH summarization')

    def sumarize_site(response):
        print("START TRANSFORM SITE")
        t0=time.time()
        compteur=0
        (art, titre,authors,publish_date,keywords, images)=article_from_url(str(response['url']), req, resp)
        nbre_words_input=len(art.encode('utf-8').split())
        nbre_words_input=nbre_words_input+int(nbre_words_input*0.1)
        ratio=0.30
        nbre_words_output=int(nbre_words_input*ratio)
        print(nbre_words_input,nbre_words_output)
        with open("finished_files/original.source", "w") as output:
            output.write(str(art.encode('utf-8')))
        resultat=fonction_principale(nbre_words_input,nbre_words_output)
        t1=time.time()
        Nc=len(resultat.split())
        gain=(60*(nbre_words_input-Nc)/300)-(t1-t0)
        content={
            'status':'sucess',
            'resp_resume':resultat,
            'texte_original':art,
            'titre':titre,
            'authors':authors,
            'publish_date':publish_date,
            'keywords':keywords,
            'images':images,
            'chrono': t1-t0
        }
        print(t1-t0, gain)
        requests.delete(config['host'] + '/api/queue/task', json=content)
        print("END TRANSFORM SITE")
        
def main():
    print('Get last file in queue')
    response = requests.get(config['host'] + '/api/queue/task')
    if response.status_code == 200:
        response = response.json()['payload']
        if response['type'] == 'url':
            summarize_site(response)
        else:
            summarize(response)
        return True
    else:
        print("Nothing in queue...")
        return False

if __name__ == '__main__':
    while True:
        if not main():
            time.sleep(2)
