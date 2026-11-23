"""Scoped lesson pictures for native (N) and non-native (NN) Arabic, grades 5-12.
Run from anywhere: python3 _tools/arabic/g5plus_images/images.py [lesson codes]
Reads manifest.json: {code: {"slide": "s4", "items": [[asset, caption], ...]}}.
Only the named teaching slide and one scoped <style> block change. Other markup, scripts and media are untouched.
Run as the final step after any rebuild of a deck. Idempotent.
"""
from pathlib import Path
import re,json,html,sys
HERE=Path(__file__).resolve().parent
MAN=json.loads((HERE/'manifest.json').read_text())
CSS='''<style id="hira-g5p-images">
.hpics{position:absolute;left:8px;top:40px;width:350px;height:520px;box-sizing:border-box;background:#fff;border-radius:170px 170px 35px 35px;box-shadow:0 18px 40px rgba(31,42,60,.10);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;padding:35px 20px}
.hpics figure{margin:0;display:flex;flex-direction:column;align-items:center;gap:12px;width:100%}
.hpics img{width:125px;height:125px;object-fit:contain;padding:0;background:none;border-radius:0;box-shadow:none}
.hpics figcaption{font:700 28px/1.4 "Thmanyah Display",Tahoma,sans-serif;color:var(--a,#1E7A5A);text-align:center;max-width:310px}
.hpics.n1 img{width:240px;height:240px}.hpics.n1 figcaption{font-size:32px}
.hpics.n3{gap:14px}.hpics.n3 img{width:86px;height:86px}.hpics.n3 figcaption{font-size:26px}
.hstrip{position:absolute;left:260px;top:640px;width:1400px;height:300px;display:flex;justify-content:center;align-items:center;gap:90px;background:#fff;border-radius:40px;box-shadow:0 18px 40px rgba(31,42,60,.10)}
.hstrip figure{margin:0;display:flex;flex-direction:column;align-items:center;gap:10px}
.hstrip img{width:170px;height:170px;object-fit:contain}
.hstrip figcaption{font:700 34px/1.4 "Thmanyah Display",Tahoma,sans-serif;color:var(--a,#1E7A5A);text-align:center}
</style>'''
def panel(items):
 return '<div class="hpics n%d" data-added="g5plus-literal-pictures">%s</div>'%(len(items),''.join('<figure><img src="../../../art/emoji/%s.svg" alt=""><figcaption>%s</figcaption></figure>'%(n,html.escape(c)) for n,c in items))
def apply_html(code,text):
 e=MAN.get(code)
 if not e or 'id="hira-g5p-images"' in text:return text
 sid=e['slide'];items=e['items']
 m=re.search(r'<section class="sl" id="'+sid+r'"[^>]*>.*?</section>',text,re.S)
 if not m:raise ValueError(code+' slide '+sid+' not found')
 sec=m.group();fam=e.get('family','rows')
 if fam=='rows':   # emoji rows, 17/1666 and 48/1468
  if 'left:17px;top:' not in sec or 'width:1666px;' not in sec:raise ValueError(code+' rows geometry differs')
  sec=sec.replace('left:17px;top:','left:397px;top:').replace('width:1666px;','width:1286px;')
  sec=sec.replace('left:48px;top:','left:428px;top:').replace('width:1468px;','width:1088px;')
 elif fam=='text': # plain sentence rows, 0/1700
  if 'left:0px;top:' not in sec or 'width:1700px;' not in sec:raise ValueError(code+' text geometry differs')
  sec=sec.replace('left:0px;top:','left:390px;top:').replace('width:1700px;','width:1310px;')
  if e.get('fs'):sec=sec.replace('font-size:53px;','font-size:%dpx;'%e['fs'])
 elif fam=='strip': # sparse book slide: picture strip in the empty lower area
  sec=sec.replace('<aside>','<div class="hstrip n%d" data-added="g5plus-literal-pictures">%s</div><aside>'%(len(items),''.join('<figure><img src="../../../art/emoji/%s.svg" alt=""><figcaption>%s</figcaption></figure>'%(n,html.escape(c)) for n,c in items)),1)
  if 'hstrip' not in sec:raise ValueError(code+' no aside')
 else:raise ValueError('family '+fam)
 if fam!='strip':sec=sec.replace('<div class="bd cvb2">','<div class="bd cvb2">'+panel(items),1)
 text=text[:m.start()]+sec+text[m.end():]
 return text.replace('</head>',CSS+'</head>',1)
if __name__=='__main__':
 root=HERE.parents[2]
 for c in sys.argv[1:] or sorted(MAN):
  p=root/'resources/ar'/c/'teacher-deck.html';old=p.read_text();new=apply_html(c,old)
  if new!=old:p.write_text(new)
  print(c,'changed' if new!=old else 'same')
