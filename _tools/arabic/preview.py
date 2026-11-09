import json,sys,html,re
from playwright.sync_api import sync_playwright
code=sys.argv[1]; idx=sys.argv[2]
S=json.load(open(f'/tmp/dep/resources/slides/{code}.json'))['slides']
idx=range(len(S)) if idx=='all' else [int(x) for x in idx.split(',')]
CSS=".tdf{position:relative;width:1280px;height:720px;overflow:hidden;font-family:'Noto Naskh Arabic',Arial}.el{position:absolute;box-sizing:border-box}.tx{display:flex;padding:4px 10px;line-height:1.45;white-space:pre-wrap;overflow:hidden}.emo{display:flex;align-items:center;justify-content:center;line-height:1}"
def el(e):
    pos=f"left:{e['x']}px;top:{e['y']}px;width:{e['w']}px;height:{e['h']}px;"
    if e['k']=='shape': return f"<div class='el' style='{pos}background:#{e['fill']};{'border:%spx solid #%s;'%(max(2,round(e.get('lw',1.5)*1.8)),e['line']) if e.get('line') else ''}border-radius:{'16px' if e.get('rad') else '0'}'></div>"
    if e['k']=='img': return f"<div class='el emo' style='{pos}font-size:{round(e['h']*0.82)}px'>{e['emo']}</div>"
    rtl=bool(re.search('[\u0600-\u06FF]',e['text'])); al=e.get('align')
    jc='center' if al=='center' else ('flex-end' if (al=='left')==rtl else 'flex-start')
    return f"<div class='el tx' dir='{'rtl' if rtl else 'ltr'}' style='{pos}font-size:{e['size']}px;color:#{e['color']};font-weight:{800 if e['bold'] else 400};justify-content:{jc};text-align:{al or 'start'};align-items:{'flex-start' if e.get('va')=='top' else 'center'};{'background:#'+e['fill']+';' if e.get('fill') else ''}{'border-radius:14px;' if e.get('rad') else ''}'>{html.escape(e['text'])}</div>"
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1280,'height':720}); clip=[]
    for i in idx:
        s=S[i]; pg.set_content(f"<html><head><style>{CSS}</style></head><body style='margin:0'><div class='tdf' style='background:#{s['bg']}'>{''.join(el(e) for e in s['els'])}</div></body></html>")
        c=pg.evaluate("()=>[...document.querySelectorAll('.tx')].filter(d=>d.scrollHeight>d.clientHeight+2||d.scrollWidth>d.clientWidth+2).map(d=>d.textContent.slice(0,40))")
        if c: clip.append((i,c))
        pg.screenshot(path=f'/tmp/g6v2/p{i}.png')
    b.close(); print('clipped:',clip)
