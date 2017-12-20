import os
import os.path as path
import sys
import requests
import time
import json
import re
from functions_server import article_from_url, fonction_principale
import nltk
import json


# Configuration
config = {}
config_path = path.abspath(path.join(path.dirname(__file__), './config/default.json'))
with open(config_path, 'r') as config_file:
    config = json.loads(config_file.read())
config['url'] = 'http://' + config['host'] + ':' + str(config['port'])


def summarize(response):
    #print('START summarization')
    t0=time.time()
    nbre_words_input=len(response['payload']['article'].encode('utf-8').split())
    nbre_words_input=nbre_words_input+int(nbre_words_input*0.1)
    ratio=float(response["payload"]['ratio'])
    #print(ratio)
    nbre_words_output=int(nbre_words_input*ratio)
    model = str(response['payload']['model'])
    #print(nbre_words_input,nbre_words_output)
    if nbre_words_input>400:
        with open("finished_files/original.source", "w") as output:
            output.write(str(response['payload']['article'].encode('utf-8')))
        resultat=fonction_principale(nbre_words_input,nbre_words_output, model)
        t1=time.time()
        Nc=len(resultat.split())
        gain=(60*(nbre_words_input-Nc)/300)-(t1-t0)
        content={
            'id': response['id'],
            'uid': response['uid'],
            'type': 'plain',
            'response': {
                'status':'sucess',
                'summary':resultat,
                'chrono': t1-t0,
                'gain':gain
            }
        }
        #print(t1-t0,gain)
        response_body = json.dumps(content)
    else:
        t1=time.time()
        content={
            'id': response['id'],
            'uid': response['uid'],
            'type': 'plain',
            'error': True,
            'response': {
                'summary':'',
                'chrono': t1-t0,
            }
        }
    requests.delete(config['url'] + '/api/queue/task', json=content, auth=(config['auth']['name'], config['auth']['password']))
    #print('FINISH summarization')

def summarize_site(response):
    #print("START TRANSFORM SITE")
    t0=time.time()
    compteur=0
    (art, titre,authors, publish_date,keywords, images)=article_from_url(str(response['payload']['url']))
    nbre_words_input=len(art.encode('utf-8').split())
    nbre_words_input=nbre_words_input+int(nbre_words_input*0.1)
    ratio=float(response["payload"]['ratio'])
    nbre_words_output=int(nbre_words_input*ratio)
    model = str(response['payload']['model'])
    #print(nbre_words_input,nbre_words_output)
    if nbre_words_input>400:
        with open("finished_files/original.source", "w") as output:
            output.write(str(art.encode('utf-8')))
        resultat=fonction_principale(nbre_words_input,nbre_words_output, model)
        t1=time.time()
        Nc=len(resultat.split())
        gain=(60*(nbre_words_input-Nc)/300)-(t1-t0)
        content={
            'id': response['id'],
            'uid': response['uid'],
            'type': 'url',
            'response': {
                'status':'sucess',
                'summary':resultat,
                'fullText':art,
                'titre':titre,
                'authors':authors,
                #'publish_date':publish_date.strftime('%Y-%m-%d'),
                'keywords':keywords,
                'image':images,
                'chrono': t1-t0
            }
        }
        #print(content)
        #print(t1-t0, gain)
    else:
        t1=time.time()
        content={
            'id': response['id'],
            'uid': response['uid'],
            'type': 'plain',
            'error': True,
            'response': {
                'summary':'',
                'chrono': t1-t0,
            }
        }
    requests.delete(config['url'] + '/api/queue/task', json=content, auth=(config['auth']['name'], config['auth']['password']))
    #print("END TRANSFORM SITE")

def main():
    response = requests.get(config['url'] + '/api/queue/task', auth=(config['auth']['name'], config['auth']['password']))
    if response.status_code == 200:
        response = response.json()
        response['payload'] = json.loads(response['payload'])
        #print('Something in the queue...')
        if 'type' in response['payload'].keys() and response['payload']['type'] == 'url':
            summarize_site(response)
        else:
            summarize(response)
        #print('Awaiting for something to sum up...')
        return True
    else:
        sys.exit('nothing to sum up')

if __name__ == '__main__':
    # Add a new worker
    #print('Awaiting for something to sum up...')
    main()
            
