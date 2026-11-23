"""Narrow picture patches for Arabic native-speaker grades 2 and 3.
Run from repo root: python3 _tools/arabic/g23images/images.py [lesson-code ...]
Only captioned picture panels are changed. Text, videos and other slides stay byte-identical.
Fluent Emoji SVGs: Microsoft, MIT license in art/emoji. Composite scenes are original
arrangements of licensed icons, with simple original furniture/sign/diagram shapes.
"""
import json,re,html,sys
from pathlib import Path
HERE=Path(__file__).resolve().parent
MAN=json.loads((HERE/'slide_images.json').read_text())
CSS='''<style id="hira-g23-images">
.vlp .h23{width:360px;height:520px;box-sizing:border-box;background:#fff;border-radius:200px 200px 40px 40px;box-shadow:0 18px 40px rgba(31,42,60,.10);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;padding:56px 20px 30px}
.vlp .h23 figure{margin:0;display:flex;flex-direction:column;align-items:center;gap:8px;width:100%}
.vlp .h23 img{width:120px;height:120px;object-fit:contain;padding:0;background:none;border-radius:0;box-shadow:none}
.vlp .h23 figcaption{font:700 30px/1.35 "Thmanyah Display",Tahoma,sans-serif;color:var(--a,#1E7A5A);text-align:center;max-width:310px}
.vlp .h23.n1 img{width:245px;height:245px}.vlp .h23.n1 figcaption{font-size:34px}
.vlp .h23.n3{gap:8px;padding-top:60px}.vlp .h23.n3 img{width:90px;height:90px}.vlp .h23.n3 figcaption{font-size:27px}
</style>'''
def panel(items):
 return '<div class="h23 n%d" data-added="literal-pictures">%s</div>'%(len(items),''.join('<figure><img src="../../../art/emoji/%s.svg" alt=""><figcaption>%s</figcaption></figure>'%(n,html.escape(c)) for n,c in items))
def apply_html(code,text):
 if code not in MAN:return text
 for sid,items in MAN[code].items():
  pat=re.compile(r'(<section class="sl" id="'+re.escape(sid)+r'"[^>]*>.*?<div class="vlp">)(.*?)(</div><div class="vlc">)',re.S)
  m=pat.search(text)
  if not m:raise ValueError('Missing expected picture panel: '+code+' '+sid)
  text=text[:m.start(2)]+panel(items)+text[m.end(2):]
 if 'id="hira-g23-images"' not in text:text=text.replace('</head>',CSS+'</head>',1)
 return text
if __name__=='__main__':
 root=HERE.parents[2]
 for code in sys.argv[1:] or sorted(MAN):
  p=root/'resources/ar'/code/'teacher-deck.html';old=p.read_text();new=apply_html(code,old)
  if new!=old:p.write_text(new)
  print(code,'changed' if old!=new else 'same')
