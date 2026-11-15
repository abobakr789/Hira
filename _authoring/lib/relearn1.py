# -*- coding: utf-8 -*-
"""لوحةٌ مصمَّمةٌ لشريحةِ «نتعلَّم 1» بدلَ رسمِ القالبِ العامِّ."""
import glob, os, sys
sys.path.insert(0, '/home/claude/g7/lib')
import deck, fx
REPO = '/home/claude/hira/resources/ssd'
n = 0
for p in sorted(glob.glob(f'{REPO}/SS-Y[567]-*/teacher-deck.html')):
    h = open(p, encoding='utf-8').read()
    s = dict(deck.split_sections(h)[1]).get('learn1', '')
    if not s or 'class="scn"' in s or '<svg class="mg"' not in s:
        continue
    icon = fx.icon_for_text(' '.join(deck.texts(s)))
    ns = fx.set_scene(s, icon, '', 'sand')
    if ns != s:
        open(p, 'w', encoding='utf-8').write(h.replace(s, ns, 1))
        n += 1
print('learn1 scenes:', n)
