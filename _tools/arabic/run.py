import sys,json; sys.path.insert(0,'/tmp/g6v2')
from gen import *
mod=sys.argv[1]; SP=__import__(mod).SP
out={}
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page()
    for S in SP:
        n=deck(S); sheets(S,pg); out[S['code']]=payload(S); print(S['code'],n)
    b.close()
json.dump(out,open(f'/tmp/g6v2/{mod}.json','w'),ensure_ascii=False)
