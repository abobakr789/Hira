# -*- coding: utf-8 -*-
"""إعادةُ صياغةِ شرائحِ العملِ الجماعيِّ بالتصميمِ المهذَّب، ثم إعادةُ الدعمِ المرن."""
import sys, os, glob, importlib
sys.path.insert(0, '/tmp/g5/lib'); sys.path.insert(0, '/tmp/g5'); sys.path.insert(0, '/tmp/g5/adv')
import deck, groups, adv

REPO = '/tmp/hpush/resources/ssd'
GMODS = ('gr_u1', 'gr_u2', 'gr_t2u1', 'gr_t2u2', 'gr_t2u3')
AMODS = ('adv_u1', 'adv_u2', 'adv_t2u1', 'adv_t2u2', 'adv_t2u3')


def _load(mods, attr):
    out = {}
    for m in mods:
        try:
            out.update(getattr(importlib.import_module(m), attr))
        except Exception as e:
            print('  (تخطّي', m, e, ')')
    return out


def main():
    G = _load(GMODS, 'G')
    try:
        from g_l10 import G as G10
        G['SS-Y5-T1-L10'] = G10
    except Exception:
        pass
    A = _load(AMODS, 'A')
    done = 0
    for p in sorted(glob.glob(f'{REPO}/SS-Y5-*/teacher-deck.html')):
        code = os.path.basename(os.path.dirname(p))
        if code not in G:
            continue
        h = open(p, encoding='utf-8').read()
        out = groups.apply(h, G[code])                 # احسب أوّلًا
        if code in A:                                   # ثم أعِدِ الدعمَ المرن
            for i, (t1, t2, t3) in enumerate(A[code]['tiers'], 1):
                d = dict(deck.split_sections(out)[1])
                sid = f'g{i}'
                if sid in d:
                    out = out.replace(d[sid], adv.tiers(d[sid], t1, t2, t3), 1)
        open(p, 'w', encoding='utf-8').write(out)
        # بطاقاتُ الطباعةِ محتواها هو هو، فلا تُعادُ صياغتُها
        done += 1
    print('أُعيدت صياغةُ', done, 'درسًا')


if __name__ == '__main__':
    main()
