# -*- coding: utf-8 -*-
"""ضبطُ مقاسِ لوحةِ «نتعلَّم 1» على مقاسِ لوحاتِ «نتعلَّم 2–4»."""
import glob, os, re, sys
sys.path.insert(0, '/home/claude/g7/lib')
import deck
REPO = '/home/claude/hira/resources/ssd'
SIZE = 'width:470px;height:350px;flex:none;'
n = 0
for p in sorted(glob.glob(f'{REPO}/SS-Y[567]-*/teacher-deck.html')):
    h = open(p, encoding='utf-8').read()
    s = dict(deck.split_sections(h)[1]).get('learn1', '')
    if 'class="scn"' not in s or SIZE in s:
        continue
    ns = s.replace('<div class="scn" style="', '<div class="scn" style="' + SIZE, 1)
    if ns != s:
        open(p, 'w', encoding='utf-8').write(h.replace(s, ns, 1))
        n += 1
print('resized:', n)
