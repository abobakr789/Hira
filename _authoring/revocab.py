# -*- coding: utf-8 -*-
"""إعادةُ بناءِ شريحةِ المفاتيحِ بالأيقوناتِ المُحدَّثةِ، مِنْ كلماتِ الدرسِ نفسِه."""
import json, glob, os, sys
sys.path.insert(0, '/home/claude/g7/lib'); sys.path.insert(0, '/home/claude/g7')
import deck, fx
REPO = '/home/claude/hira/resources/ssd'
PAT = sys.argv[1] if len(sys.argv) > 1 else 'SS-Y[567]-*'
JPAT = sys.argv[2] if len(sys.argv) > 2 else 'ss-y*.json'
W = {}
for f in glob.glob(f'/home/claude/hira/_authoring/{JPAT}'):
    for L in json.load(open(f, encoding='utf-8')):
        W[L['code']] = [tuple(w) for w in L['sm']['words']]
n = 0
for p in sorted(glob.glob(f'{REPO}/{PAT}/teacher-deck.html')):
    code = os.path.basename(os.path.dirname(p))
    if code not in W:
        continue
    h = open(p, encoding='utf-8').read()
    v = dict(deck.split_sections(h)[1]).get('vocab', '')
    if 'flipc' not in v:
        continue
    nv = fx.replace_stag(v, fx.stag_wrap(fx.flip_cards(W[code]), top=246, gap=26))
    if nv != v:
        open(p, 'w', encoding='utf-8').write(h.replace(v, nv, 1))
        n += 1
print('vocab rebuilt:', n)
