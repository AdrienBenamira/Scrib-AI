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

def fonction_principale(nbre_words_input,nbre_words_output, model="google"):
    #os.system("python2 run_summarization.py --mode=decode  --data_path=finished_files/intermediaire.bin --vocab_path=finished_files/vocab --log_root= --exp_name=pretrained_model_tf1.2.1/ "+"--max_enc_steps="+str(nbre_words_input)+" --max_dec_steps="+str(nbre_words_output))
    if model=="google":
        print("model google lance")
        print('START make data')
        os.system("python2 make_datafiles.py")
        print('END make data')
        print('')
        print('START run_summarization')
        os.system("python2 run_summarization.py --mode=decode  --data_path=finished_files/intermediaire.bin --vocab_path=finished_files/vocab --log_root= --exp_name=pretrained_model_tf1.2.1/ ")
    if model=="ours_1layer":
        print("model ours_1layer lance")
        print('START run_summarization')
        os.system("python3.6 translate.py -batch_size 1 -model logs/train1/train1_acc_54.41_ppl_11.03_e15.pt -src finished_files/original.source -output finished_files/resume.txt -beam_size 1 -replace_unk")
    if model=="ours_4layers":
        print("model ours_4layers lance")
        print('START run_summarization')
        os.system("python3.6 translate.py -batch_size 1 -model logs/train2/train2_acc_54.33_ppl_10.97_e16.pt -src finished_files/original.source -output finished_files/resume.txt -beam_size 1 -replace_unk")
    print('End run_summarization')
    with open("finished_files/resume.txt", "r") as output:
        resultat=output.read()
    resultat=resultat.replace('\\n','')
    resultat=resultat.replace('</s>','')
    resultat=resultat.replace('<s>','')
    resultat=capitalize(resultat)
    return resultat


def article_from_url(url):
    #url as string
    texte=''
    article = Article(url, keep_article_html=True)
    article.download()
    article.parse()
    texte=article.text
    image=article.top_image
    return(texte, article.title,article.authors,article.publish_date,article.keywords,image)
