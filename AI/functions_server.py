 # -*- coding: utf-8 -*-
import requests
import justext
from newspaper import Article
import json
import os
import time
import falcon
import re




def uppercase(matchobj):
    return matchobj.group(0).upper()

def capitalize(s):
    return re.sub('^([a-z])|[\.|\?|\!]\s*([a-z])|\s+([a-z])(?=\.)', uppercase, s)

def fonction_principale(nbre_words_input,nbre_words_output):
    print('START make data')
    os.system("python2 make_datafiles.py")
    print('END make data')
    print('')
    print('START run_summarization')
    os.system("python2 run_summarization.py --mode=decode  --data_path=finished_files/intermediaire.bin --vocab_path=finished_files/vocab --log_root= --exp_name=pretrained_model_tf1.2.1/ "+"--max_enc_steps="+str(nbre_words_input)+" --max_dec_steps="+str(nbre_words_output))
    print('End run_summarization')
    with open("finished_files/resume.txt", "r") as output:
        resultat=output.read()
    resultat=resultat.replace('\\n','')
    resultat=capitalize(resultat)
    return resultat


def article_from_url(url, req, resp):
    #url as string
    texte=''
    article = Article(url, keep_article_html=True)
    article.download()
    article.parse()
    texte=article.text
    image=article.top_image
    return(texte, article.title,article.authors,article.publish_date,article.keywords,image)
