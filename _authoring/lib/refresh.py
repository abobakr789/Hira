# -*- coding: utf-8 -*-
"""إعادةُ بناءِ شريحتَي المفاتيحِ والنقدِ ولوحاتِ الصورِ بالتصحيحاتِ الجديدة."""
import sys, re, glob, os, importlib
sys.path.insert(0, '/tmp/g5/lib'); sys.path.insert(0, '/tmp/g5'); sys.path.insert(0, '/tmp/hpush/_authoring/adv')
import deck, adv, fx

REPO = '/tmp/hpush/resources/ssd'
AMODS = ('adv_u1', 'adv_u2', 'adv_t2u1', 'adv_t2u2', 'adv_t2u3')
A = {}
for m in AMODS:
    try:
        A.update(importlib.import_module(m).A)
    except Exception as e:
        print('  (تخطّي', m, e, ')')

WORD = re.compile(r'font-size:\d+px;color:(#[0-9A-Fa-f]{6});text-align:center">([^<]+)</p>')
MEAN = re.compile(r'line-height:1\.6;color:#1F2A3C">([^<]+)</p>')
PLAN = {'predict': ('bulb', 'أَتَوَقَّعُ', 'plum'), 'learn2': (None, '', 'cool'),
        'learn3': (None, '', 'green'), 'learn4': (None, '', 'sand')}


def run(code):
    p = f'{REPO}/{code}/teacher-deck.html'
    h = fx.guard_nav(fx.add_style(open(p, encoding='utf-8').read()))
    d = dict(deck.split_sections(h)[1])

    # المفاتيح: أعِدْ بناءَها بالأيقوناتِ الصحيحةِ وبمنعِ انتقالِ الشريحة
    v = d.get('vocab', '')
    if 'flipc' in v:
        ws = [m.group(2) for m in WORD.finditer(v)]
        ms = MEAN.findall(v)
        if len(ws) == 4 and len(ms) == 4:
            nv = fx.replace_stag(v, fx.stag_wrap(fx.flip_cards(list(zip(ws, ms))), top=246, gap=26))
            h = h.replace(v, nv, 1); d = dict(deck.split_sections(h)[1])

    # النقد: أعِدْ بناءَه باللوحةِ الداخليّةِ وبمنعِ انتقالِ الشريحة
    if code in A and 'class="cq"' in d.get('critique', ''):
        nc = fx.replace_stag(d['critique'], fx.critique_ix(A[code]['claims']))
        h = h.replace(d['critique'], nc, 1)
        d = dict(deck.split_sections(h)[1])

    # اللوحاتُ المرسومة: أعِدْ اختيارَ الأيقونةِ من نصِّ الشريحة
    for sid, (ic, cap, tone) in PLAN.items():
        s = d.get(sid)
        if not s or 'class="scn"' not in s:
            continue
        icon = ic or fx.icon_for_text(' '.join(deck.texts(s)))
        ns = fx.set_scene(s, icon, cap, tone)
        h = h.replace(s, ns, 1); d = dict(deck.split_sections(h)[1])

    open(p, 'w', encoding='utf-8').write(h)
    return len(deck.split_sections(h)[1])


if __name__ == '__main__':
    pat = sys.argv[1] if len(sys.argv) > 1 else 'SS-Y5-*'
    n = 0
    for x in sorted(glob.glob(f'{REPO}/{pat}/teacher-deck.html')):
        run(os.path.basename(os.path.dirname(x))); n += 1
    print('حُدِّث', n, 'درسًا')
