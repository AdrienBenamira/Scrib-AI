import requests
import json
url_resume = "http://127.0.0.1:8001/newsite"
headers = {}
response = requests.post(url_resume, data=json.dumps({'url':'https://gizmodo.com/us-homeland-security-will-start-collecting-social-media-1818777094'}),headers=headers)
print(response)
site_resume=json.loads(response.text)['site_resume']

with open("site.html", "w") as output:
    output.write(site_resume.encode('utf8'))
