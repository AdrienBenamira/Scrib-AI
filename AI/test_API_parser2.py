import requests
import json
url_resume = "http://127.0.0.1:8000/newsite"
headers = {}
response = requests.post(url_resume, data=json.dumps({'url':'http://www.bbc.com/news/world-us-canada-41466116'}),headers=headers)
print(response)
article_resume=json.loads(response.text)['site_resume']
