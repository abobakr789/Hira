# -*- coding: utf-8 -*-
"""Slide pictures for Arabic grade 1 (native speakers), terms 1-3.

Replaces the side picture of the two slides "min waqi'ina" (d-real) and
"utabbiq fi hayati" (d-apply) with pictures of the things the slide talks about.
Icons: Microsoft Fluent Emoji (MIT), copied to art/emoji/ (license file there).

Idempotent and narrow: only AR-Y1-N-T1..T3 decks listed in g1_slide_images.json,
only those two slides, only the .vlp picture panel. Never touches video sections.

Build integration: every writer of resources/ar/<code>/teacher-deck.html in
_tools/arabic/g1html (run.py, build1.py, conv.py) passes its html through
apply_html(code, html) right before writing, so a rebuild keeps the pictures.
CLI (repo root):  python3 _tools/arabic/g1images/g1images.py [code ...]
"""
import json, os, re, sys, html as _h

HERE = os.path.dirname(os.path.abspath(__file__))
MAN = json.load(open(os.path.join(HERE, 'g1_slide_images.json'), encoding='utf8'))
CSS = ('<style id="hira-g1-images">'
 '.vlp .hx{width:360px;height:520px;box-sizing:border-box;background:#fff;border-radius:200px 200px 40px 40px;'
 'box-shadow:0 18px 40px rgba(31,42,60,.10);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:64px 16px 26px}'
 '.vlp .hx figure{margin:0;display:flex;flex-direction:column;align-items:center;gap:4px}'
 '.vlp .hx img{width:92px;height:92px;object-fit:contain;padding:0;background:none;border-radius:0;box-shadow:none}'
 '.vlp .hx figcaption{font:700 30px/1.2 "Thmanyah Display",Tahoma,sans-serif;color:var(--a,#1E7A5A);text-align:center}'
 '.vlp .hx.n4{display:grid;grid-template-columns:1fr 1fr;align-content:center;gap:18px 8px;padding:64px 14px 34px}'
 '.vlp .hx.n4 img{width:84px;height:84px}.vlp .hx.n4 figcaption{font-size:26px}'
 '.vlp .hx.n2 img{width:128px;height:128px}.vlp .hx.n1 img{width:168px;height:168px}.vlp .hx.n1 figcaption{font-size:36px}.vlp .hx.n2{gap:26px}'
 '</style>')

def panel(items):
    figs = ''.join('<figure><img src="../../../art/emoji/%s.svg" alt=""><figcaption>%s</figcaption></figure>'
                   % (s, _h.escape(c)) for s, c in items)
    return '<div class="hx n%d" data-added="img">%s</div>' % (len(items), figs)

def apply_html(code, html):
    m = MAN.get(code) or {}
    if not m and code != 'AR-Y1-N-T1-L01':
        return html
    for sid, items in m.items():
        if not items:
            continue
        pat = re.compile(r'(<section class="sl" id="%s"[^>]*>.*?<div class="vlp">)(.*?)(</div><div class="vlc">)' % re.escape(sid), re.S)
        mm = pat.search(html)
        if not mm:
            continue
        html = html[:mm.start(2)] + panel(items) + html[mm.end(2):]
    if 'id="hira-g1-images"' not in html:
        html = html.replace('</head>', CSS + '</head>', 1)
    if code == 'AR-Y1-N-T1-L01':
        try:
            from l01_extras import apply_l01
        except ImportError:
            from .l01_extras import apply_l01
        html = apply_l01(html)
    return html

def main(argv):
    root = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
    codes = argv or sorted(MAN)
    for c in codes:
        p = os.path.join(root, 'resources', 'ar', c, 'teacher-deck.html')
        old = open(p, encoding='utf8').read()
        new = apply_html(c, old)
        if new != old:
            open(p, 'w', encoding='utf8').write(new)
        print(c, 'changed' if new != old else 'same')

if __name__ == '__main__':
    main(sys.argv[1:])
