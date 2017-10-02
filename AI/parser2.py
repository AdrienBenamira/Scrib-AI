import requests
import justext
import requests
import json

def article_from_url(url):
    #url as string
    texte=''
    response = requests.get(url)
    paragraphs = justext.justext(response.content, justext.get_stoplist("English"))
    for paragraph in paragraphs:
      if not paragraph.is_boilerplate:
          path=paragraph.dom_path.split('.')
          if path[len(path)-1]=='p':
              texte=texte+paragraph.text.encode('utf8')
    return(texte)



url = "http://127.0.0.1:8000/parse"
texte=article_from_url("https://www.nytimes.com/2017/10/01/arts/television/snl-trump-puerto-rico.html")
headers = {}
response = requests.post(url, data=json.dumps({'article':str(texte)}),headers=headers)

print(response.text)
