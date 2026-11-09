import sys,json; sys.path.insert(0,'/tmp/g6v2')
from nngen import *
import importlib
_m=(sys.argv[1] if len(sys.argv)>1 else 'nn6')
try: importlib.import_module('texts'+_m[2:])
except ModuleNotFoundError: pass
SP=__import__(sys.argv[1] if len(sys.argv)>1 else 'nn6').SP; out={}
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page()
    for S in SP: n=deck(S); sheets(S,pg); out[S['code']]=payload(S); print(S['code'],n)
    b.close()
json.dump(out,open('/tmp/g6v2/'+(sys.argv[1] if len(sys.argv)>1 else 'nn6')+'.json','w'),ensure_ascii=False)
