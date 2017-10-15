import os
import os.path as path
import sys
import signal
import requests
import time
import falcon
import json
import re
from functions_server import article_from_url, fonction_principale
import nltk
import json


def exit_handler(signal, frame):
    # Remove a worker
    requests.delete(config['host'] + '/api/worker', auth=(config['name'], config['password']))
    print('Exciting...')
    sys.exit(0)


# Signal when exiting the program
signal.signal(signal.SIGINT, exit_handler)


config = {}
config_path = path.abspath(path.join(path.dirname(__file__), './config/default.json'))
with open(config_path, 'r') as config_file:
    config = json.loads(config_file.read())


def summarize(response):
    print('START summarization')
    t0=time.time()
    nbre_words_input=len(response['payload']['article'].encode('utf-8').split())
    nbre_words_input=nbre_words_input+int(nbre_words_input*0.1)
    ratio=float(response["payload"]['ratio'])
    #print(ratio)
    nbre_words_output=int(nbre_words_input*ratio)
    print(nbre_words_input,nbre_words_output)
    if nbre_words_input>400:
        with open("finished_files/original.source", "w") as output:
            output.write(str(response['payload']['article'].encode('utf-8')))
        resultat=fonction_principale(nbre_words_input,nbre_words_output)
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
        print(t1-t0,gain)
        response_body = json.dumps(content)
    else:
        t1=time.time()
        content={
            'id': response['id'],
            'uid': response['uid'],
            'type': 'plain',
            'response': {
                'status':'failed',
                'summary':'',
                'chrono': t1-t0,
            }
        }
    requests.delete(config['host'] + '/api/queue/task', json=content, auth=(config['name'], config['password']))
    print('FINISH summarization')

def summarize_site(response):
    print("START TRANSFORM SITE")
    t0=time.time()
    compteur=0
    (art, titre,authors,publish_date,keywords, images)=article_from_url(str(response['payload']['url']))
    nbre_words_input=len(art.encode('utf-8').split())
    nbre_words_input=nbre_words_input+int(nbre_words_input*0.1)
    ratio=float(response["payload"]['ratio'])
    nbre_words_output=int(nbre_words_input*ratio)
    print(nbre_words_input,nbre_words_output)
    if nbre_words_input>400:
        with open("finished_files/original.source", "w") as output:
            output.write(str(art.encode('utf-8')))
        resultat=fonction_principale(nbre_words_input,nbre_words_output)
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
        print(content)
        print(t1-t0, gain)
    else:
        t1=time.time()
        content={
            'id': response['id'],
            'uid': response['uid'],
            'type': 'plain',
            'response': {
                'status':'failed',
                'summary':'',
                'chrono': t1-t0,
            }
        }
    requests.delete(config['host'] + '/api/queue/task', json=content, auth=(config['name'], config['password']))
    print("END TRANSFORM SITE")

def main():
    response = requests.get(config['host'] + '/api/queue/task', auth=(config['name'], config['password']))
    if response.status_code == 200:
        response = response.json()
        response['payload'] = json.loads(response['payload'])
        print('Something in the queue...')
        if 'type' in response['payload'].keys() and response['payload']['type'] == 'url':
            summarize_site(response)
        else:
            summarize(response)
        return True
    else:
        return False

if __name__ == '__main__':
    # Add a new worker
    response = requests.post(config['host'] + '/api/worker', auth=(config['name'], config['password']))
    print('Connected')
    while True:
        res = False
        try:
            res = main()
        except requests.exceptions.ConnectionError:
            sys.exit(0)
        except:
            print("An error has occured")
        if not res:
            time.sleep(2)
