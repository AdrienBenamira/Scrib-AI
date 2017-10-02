import os
import time
import falcon
import json
import re
#

print('Ready')

def uppercase(matchobj):
    return matchobj.group(0).upper()

def capitalize(s):
    return re.sub('^([a-z])|[\.|\?|\!]\s*([a-z])|\s+([a-z])(?=\.)', uppercase, s)


class LetsSummarize:
    def on_post(self, req,resp):
        t0=time.time()
        compteur=0
        try:
            compteur+=1
            if compteur==1:
                print('START summarization')
                response=json.loads(req.stream.read())
                with open("test.source", "w") as output:
                    output.write(str(response['article'].encode('utf-8')))
                    #print('ok')
                print('START make data')
                os.system("python2 make_datafiles.py")
                print('END make data')
                print('')
                print('START run_real')
                os.system("python2 run_summarization.py --mode=decode  --data_path=finished_files/test.bin --vocab_path=finished_files/vocab --log_root= --exp_name=pretrained_model_tf1.2.1/ ")
                print('End run_real')
                t1=time.time()
                with open("resume.txt", "r") as output:
                    resultat=output.read()

                resultat=resultat.replace('\\n','')
                resultat=capitalize(resultat)

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
        t0=time.time()
        compteur=0
        try:
            compteur+=1
            if compteur==1:
                print('START summarization')
                response=req.stream.read()
                print(response)
                response=json.loads(response)
                with open("test.source", "w") as output:
                    output.write(str(response['article'].encode('utf-8')))
                    #print('ok')
                print('START make data')
                os.system("python2 make_datafiles.py")
                print('END make data')
                print('')
                print('START run_real')
                os.system("python2 run_summarization.py --mode=decode  --data_path=finished_files/test.bin --vocab_path=finished_files/vocab --log_root= --exp_name=pretrained_model_tf1.2.1/ ")
                print('End run_real')
                t1=time.time()
                with open("resume.txt", "r") as output:
                    resultat=output.read()

                resultat=resultat.replace('\\n','')
                resultat=capitalize(resultat)

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

api=falcon.API()
api.add_route('/summary',LetsSummarize())
api.add_route('/summarize_site',LetsSummarizeSite())
