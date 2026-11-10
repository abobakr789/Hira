# Grade 1–3 Arabic worksheets (four levels) built from the lesson's own book text.
# Usage: python3 g1ws.py <spec.json> <out.pdf>   ·   [[word]] in any text = highlighted key word
import json, re, sys, html
from playwright.sync_api import sync_playwright
LV = {"bronze": ("برونزي", "#9A5B2E"), "silver": ("فضي", "#5F6C78"), "gold": ("ذهبي", "#B8860B"), "challenge": ("تحدٍّ", "#6B46A8")}
def hl(t): return re.sub(r"\[\[(.+?)\]\]", r'<mark>\1</mark>', html.escape(t))
CSS = """@page{size:A4;margin:0}*{box-sizing:border-box}body{margin:0;font-family:'Readex Pro','Noto Naskh Arabic',sans-serif;color:#1E2B33}
.pg{width:210mm;height:297mm;padding:11mm 12mm;page-break-after:always;display:flex;flex-direction:column;gap:3.2mm;overflow:hidden}
.hd{display:flex;justify-content:space-between;align-items:center;border-radius:5mm;color:#fff;padding:3mm 5mm}
.hd .t{font-size:15pt;font-weight:700}.hd .lv{background:#fff;border-radius:20mm;padding:1.5mm 5mm;font-weight:700;font-size:12pt}
.meta{display:flex;justify-content:space-between;font-size:11pt;color:#555}.meta span{border-bottom:1px dotted #999;min-width:70mm;padding-bottom:1mm}
.goal{background:#F4ECE2;border-radius:3mm;padding:2.5mm 4mm;font-weight:600;font-size:12pt}
.rd{border:1.6px solid #0F6E72;border-radius:4mm;padding:3mm 5mm;background:#FFFDF7}
.rd h3,.box h3{margin:0 0 1.5mm;font-size:12.5pt;color:#0F6E72}
.tx{font-family:'Noto Naskh Arabic','Amiri',serif;font-size:15.5pt;line-height:2}
.tx p{margin:0}mark{background:#FFE38A;color:#9A2F0B;font-weight:700;border-radius:2mm;padding:0 1mm}
.voc{display:flex;flex-wrap:wrap;gap:2mm;margin-top:2mm}.voc span{background:#FFF6DA;border-radius:2mm;padding:1mm 3mm;font-size:11pt}
.voc b{font-family:'Noto Naskh Arabic',serif;color:#9A2F0B}
.box{border:1.4px solid #D9CFC2;border-radius:4mm;padding:3mm 5mm}
.q{font-weight:700;font-size:13pt;margin-bottom:2mm}.q i{display:inline-block;width:7mm;height:7mm;border-radius:50%;color:#fff;text-align:center;font-style:normal;line-height:7mm;margin-left:2mm;font-size:11pt}
.ln{border-bottom:1.3px solid #B9B0A3;height:10.5mm}
.grid{display:grid;gap:3mm}.cell{border:1.3px dashed #BDB3A5;border-radius:3mm;padding:2mm 3mm;min-height:24mm;font-size:12pt;font-weight:600}
.match{display:grid;grid-template-columns:1fr 18mm 1fr;row-gap:4mm;align-items:center;font-family:'Noto Naskh Arabic',serif;font-size:14pt}
.match div{border:1.3px solid #D9CFC2;border-radius:3mm;padding:1.5mm 3mm;text-align:center}.match .dot{border:none;text-align:center;color:#999}
.opts{display:flex;gap:4mm;flex-wrap:wrap;font-family:'Noto Naskh Arabic',serif;font-size:14pt}.opts span{border:1.3px solid #D9CFC2;border-radius:3mm;padding:1mm 4mm}
.ord{display:grid;grid-template-columns:12mm 1fr;row-gap:3mm;align-items:center;font-family:'Noto Naskh Arabic',serif;font-size:14pt}.ord b{border:1.5px solid #999;border-radius:2mm;height:10mm}
.draw{flex:1;border:1.3px dashed #BDB3A5;border-radius:4mm;min-height:30mm;position:relative}.draw small{position:absolute;top:2mm;right:4mm;color:#999}
.feel{margin-top:auto;display:flex;gap:3mm;justify-content:center;font-size:11pt}.feel span{border:1.3px solid #D9CFC2;border-radius:20mm;padding:1.5mm 5mm}
"""
def task(t, col, n):
    h = f'<div class="box"><div class="q"><i style="background:{col}">{n}</i>{hl(t["q"])}</div>'
    k = t["type"]
    if k == "lines": h += "".join('<div class="ln"></div>' for _ in range(t.get("n", 2)))
    elif k == "match": h += '<div class="match">' + "".join(f'<div>{hl(a)}</div><div class="dot">• · · · •</div><div>{hl(b)}</div>' for a, b in zip(t["a"], t["b"])) + "</div>"
    elif k == "choose": h += "".join(f'<div style="margin:1mm 0 2mm;font-family:Noto Naskh Arabic,serif;font-size:14pt">{hl(s)}</div><div class="opts">' + "".join(f"<span>◯ {hl(o)}</span>" for o in opts) + "</div>" for s, opts in t["items"])
    elif k == "cells": h += f'<div class="grid" style="grid-template-columns:repeat({t.get("cols", 2)},1fr)">' + "".join(f'<div class="cell">{hl(c)}</div>' for c in t["cells"]) + "</div>"
    elif k == "order": h += '<div class="ord">' + "".join(f"<b></b><div>{hl(e)}</div>" for e in t["items"]) + "</div>"
    elif k == "draw": return h + "</div>" + f'<div class="draw"><small>{hl(t.get("label", "رسمي:"))}</small></div>'
    return h + "</div>"
def page(S, lv, P):
    name, col = LV[lv]
    words = "".join(f"<span><b>{hl(w)}</b>: {hl(m)}</span>" for w, m in S.get("words", [])[: P.get("nwords", 3)])
    body = f"""<div class="pg"><div class="hd" style="background:{col}"><div class="t">حِراء · اللغة العربية · {S['grade']} · {hl(S['title'])}</div><div class="lv" style="color:{col}">المستوى: {name}</div></div>
<div class="meta"><span>الاسم:</span><span>التاريخ:</span></div><div class="goal">🎯 {hl(P['goal'])}</div>
<div class="rd"><h3>📖 {hl(S.get('readhead', 'أقرأ من نص الدرس'))}{(' · ص ' + S['pages']) if S.get('pages') else ''}</h3><div class="tx">{''.join(f'<p>{hl(x)}</p>' for x in P.get('text', S['key']))}</div>{f'<div class="voc">{words}</div>' if words else ''}</div>"""
    body += "".join(task(t, col, i + 1) for i, t in enumerate(P["tasks"]))
    body += '<div class="feel"><span>كَيْفَ أَشْعُرُ؟</span><span>🟢 أَسْتَطيعُ وَحْدي</span><span>🟡 أَحْتاجُ مُساعَدَةً</span><span>🔴 لَمْ أَفْهَمْ بَعْدُ</span></div></div>'
    return body
def build(S, out):
    doc = f'<html dir="rtl"><head><meta charset="utf-8"><style>{CSS}</style></head><body>' + "".join(page(S, lv, S["levels"][lv]) for lv in ["bronze", "silver", "gold", "challenge"] if lv in S["levels"]) + "</body></html>"
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(); pg.set_content(doc); pg.wait_for_timeout(500)
        bad = pg.evaluate("Array.from(document.querySelectorAll('.pg')).map((e,i)=>e.scrollHeight>e.clientHeight+2?i:-1).filter(i=>i>=0)")
        if bad: raise SystemExit(f"OVERFLOW on page(s) {bad}")
        pg.pdf(path=out, format="A4", print_background=True); b.close()
if __name__ == "__main__":
    build(json.load(open(sys.argv[1], encoding="utf-8")), sys.argv[2])
