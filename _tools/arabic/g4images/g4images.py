"""Scoped imagery for grade4 native Arabic. Run at repo root with optional lesson codes.
Uses no third-party parsing dependency. Other markup, scripts and media stay byte-identical.
"""
from pathlib import Path
import re,json,html,sys
HERE=Path(__file__).resolve().parent
MAN=json.loads((HERE/'slide_images.json').read_text())
CSS='''<style id="hira-g4-images">
.g4pictures{width:360px;height:520px;box-sizing:border-box;background:#fff;border-radius:170px 170px 35px 35px;box-shadow:0 18px 40px rgba(31,42,60,.10);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;padding:35px 20px}
.g4pictures figure{margin:0;display:flex;flex-direction:column;align-items:center;gap:12px;width:100%}
.g4pictures img{width:125px;height:125px;object-fit:contain;padding:0;background:none;border-radius:0;box-shadow:none}
.g4pictures figcaption{font:700 28px/1.4 "Thmanyah Display",Tahoma,sans-serif;color:var(--a,#1E7A5A);text-align:center;max-width:310px}
.g4pictures.n1 img{width:240px;height:240px}.g4pictures.n1 figcaption{font-size:32px}
.g4pictures.n3{gap:14px}.g4pictures.n3 img{width:86px;height:86px}.g4pictures.n3 figcaption{font-size:26px}
#s4 .g4pictures{position:absolute;left:8px;top:40px;width:350px}
</style>'''
def panel(items):
 return '<div class="g4pictures n%d" data-added="grade4-literal-pictures">%s</div>'%(len(items),''.join('<figure><img src="../../../art/emoji/%s.svg" alt=""><figcaption>%s</figcaption></figure>'%(n,html.escape(c)) for n,c in items))
def apply_html(code,text):
 if code not in MAN:return text
 if 'id="hira-g4-images"' in text:return text
 applied=False
 for sid,items in MAN[code].items():
  if sid.startswith('d-'):
   pat=re.compile(r'(<section class="sl" id="'+re.escape(sid)+r'"[^>]*>.*?<div class="vlp">)(.*?)(</div><div class="vlc">)',re.S)
   m=pat.search(text)
   # Rich slides are added by the enrichment stage, not the generic builder.
   # Leave that earlier stage unchanged; run this helper after enrichment.
   if not m:continue
   text=text[:m.start(2)]+panel(items)+text[m.end(2):]
   applied=True
  else:
   pat=re.compile(r'<section class="sl" id="s4"[^>]*>.*?</section>',re.S);m=pat.search(text)
   if not m:raise ValueError(code+' teaching slide not found')
   sec=m.group()
   # Free left-hand picture column. Retain original content, reveal order and font.
   sec=sec.replace('left:17px;top:','left:397px;top:').replace('width:1666px;','width:1286px;')
   sec=sec.replace('left:48px;top:','left:428px;top:').replace('width:1468px;','width:1088px;')
   sec=sec.replace('<div class="bd cvb2">','<div class="bd cvb2">'+panel(items),1)
   text=text[:m.start()]+sec+text[m.end():]
   applied=True
 return text.replace('</head>',CSS+'</head>',1) if applied else text
if __name__=='__main__':
 root=HERE.parents[2]
 for c in sys.argv[1:] or sorted(MAN):
  p=root/'resources/ar'/c/'teacher-deck.html';old=p.read_text();new=apply_html(c,old)
  if new!=old:p.write_text(new)
  print(c,'changed' if new!=old else 'same')
