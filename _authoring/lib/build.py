# -*- coding: utf-8 -*-
"""بانِي دُروسِ الدِّراساتِ الِاجْتِماعِيَّةِ: مِنْ قاموسِ الدَّرْسِ إِلى سِتَّةِ مِلَفّاتٍ.

أُعيدَ بِناؤُهُ مِنَ الْعُروضِ الْمَنْشورَةِ نَفْسِها بَعْدَ فَقْدِ النُّسْخَةِ الْأولى:
خَريطَةُ الْخاناتِ مُسْتَخْرَجَةٌ مِنْ مُقارَنَةِ الدُّروسِ الْمَبْنِيَّةِ بِقَواميسِها.
"""
import os, re, shutil, sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'lib'))
import deck, gen

SUBJ = 'الدِّراساتُ الِاجْتِماعِيَّةُ'
GRADE = 'الصَّفُّ السّابِعُ'
TPL_GRADE = 'الصَّفُّ الْخامِسُ'
LEM = ['👑', '📜', '🛡️', '⭐']


def set_grade(g):
    global GRADE
    GRADE = g


# ── خاناتُ الْمِلَفّاتِ الْمُرافِقَةِ (الْقالَبُ الْأَصْلِيُّ، قَبْلَ الرَّفْعِ) ──
# القيمة: اسم الحقل المحسوب في F2
WS = {0: 'hd', 3: 'ws_t', 4: 'foot2', 8: 'src', 11: 'q0s', 12: 'q0o0', 13: 'q0o1',
      14: 'q0o2', 15: 'q1s', 16: 'q1o0', 17: 'q1o1', 18: 'q1o2', 19: 'q2s',
      20: 'q2o0', 21: 'q2o1', 22: 'q2o2', 25: 'word0', 26: 'word1', 27: 'word2',
      28: 'word3', 29: 'mean1', 30: 'mean2', 31: 'mean3', 32: 'mean0',
      37: 'ws_t', 38: 'foot2', 42: 'src', 46: 'bank0', 47: 'bank1', 48: 'bank2',
      49: 'cloze0', 51: 'cloze1', 53: 'cloze2', 56: 'explain',
      61: 'ws_t', 62: 'foot2', 66: 'src', 68: 'thinkq', 71: 'situation',
      76: 'ws_t', 77: 'foot2', 81: 'src', 83: 'thinkd'}

SRC = {0: 'title', 3: 'sc_t', 4: 'foot2', 6: 'src', 8: 'bt', 9: 'bookref',
       11: 'word0', 12: 'mean0', 13: 'word1', 14: 'mean1', 15: 'word2',
       16: 'mean2', 17: 'word3', 18: 'mean3',
       20: 'ic0', 21: 'learn0', 22: 'ic1', 23: 'learn1', 24: 'ic2',
       25: 'learn2', 26: 'ic3', 27: 'learn3',
       30: 'do0', 32: 'do1', 34: 'idn', 35: 'badge'}

KEY = {0: 'hd', 3: 'ak_t', 4: 'foot2', 7: 'kbronze', 9: 'ksilver',
       11: 'kgold', 13: 'kdiamond', 15: 'kpod', 17: 'kgroups'}

POD = {0: 'hd', 3: 'pd_t', 4: 'foot2', 8: 'ic01', 9: 'pod0', 12: 'pod0',
       13: 'ic0', 14: 'ic1', 15: 'ic2', 16: 'pod1', 17: 'ic2', 18: 'ic1',
       19: 'ic3', 22: 'tf0', 25: 'tf1'}

GRP = {0: 'hd', 3: 'gw_t', 4: 'foot2', 8: 'grp0', 10: 'challenge',
       11: 'gw_t', 12: 'foot2', 16: 'grp1', 18: 'challenge',
       19: 'gw_t', 20: 'foot2', 24: 'grp2', 26: 'challenge',
       27: 'gw_t', 28: 'foot2', 32: 'grp3', 34: 'challenge'}

AUX = [('worksheets-A4', WS), ('sources-concept-card', SRC),
       ('answer-key', KEY), ('pod-sheet', POD), ('group-work', GRP)]


def _last_word(s):
    """آخِرُ كَلِمَةٍ في الْجُمْلَةِ بِلا نُقْطَةٍ، وَبَقِيَّةُ الْجُمْلَةِ."""
    body = s.rstrip().rstrip('.').rstrip()
    i = body.rfind(' ')
    return (body[i + 1:], body[:i]) if i > 0 else (body, '')


def _head(s, n=8):
    return ' '.join(s.split()[:n])


def deck_fields(c, unit):
    """قاموسُ الدَّرْسِ ← خاناتُ الْعَرْضِ."""
    F = {'title': c['title'], 'obj': c['obj'], 'topic': c['topic'],
         'unitref': f"{unit} · كِتابي {c['pages']}",
         'foot': f"{c['title']} · {SUBJ} · {GRADE}",
         'hook': c['hook'], 'hook_ans': c['hook_ans'], 'scene': c['scene'],
         'guess_ans': c['guess_ans'], 'predict_q': c['predict_q'],
         'predict_ans': c['predict_ans'], 'match_ans': c['match_ans'],
         'jtitle': c['jtitle'], 'jmeaning': c['jmeaning'], 'jex0': c['jex0'],
         'jex1': c['jex1'], 'jnot': c['jnot'], 'think': c['think'],
         'think_ans': c['think_ans'], 'fact': c['fact'], 'idn': c['idn'],
         'badge': c['badge'], 'pagesref': f"كِتابُ الطّالِبِ {c['pages']}"}
    for i, x in enumerate(c['lev']):
        F[f'lev{i}'] = x
    for i, x in enumerate(c['guessc']):
        F[f'guessc{i}'] = x
    for i, (w, m) in enumerate(c['words']):
        F[f'word{i}'], F[f'mean{i}'] = w, m
    for i, x in enumerate(c['learn']):
        F[f'learn{i}'] = x
    for i, (t, _v) in enumerate(c['tf']):
        F[f'tf{i}'] = t
    for i, x in enumerate(c['grp']):
        F[f'grp{i}'] = x
    for i, x in enumerate(c['mdl']):
        F[f'mdl{i}'] = x
    for i, x in enumerate(c['guide']):
        F[f'guide{i}'] = x
    for i, x in enumerate(c['do']):
        F[f'do{i}'] = x
    for i, (st, ops) in enumerate(c['qs']):
        F[f'q{i}s'] = st
        for j, o in enumerate(ops):
            F[f'q{i}o{j}'] = o
    body, marks = c['booktext']
    F['booktext_html'] = gen.booktext_body(body, marks)
    return F


def aux_fields(c):
    """قاموسُ الدَّرْسِ ← خاناتُ الْمِلَفّاتِ الْمُرافِقَةِ."""
    body, marks = c['booktext']
    t, pages = c['title'], c['pages']
    ics = c.get('icons') or LEM
    banks, clozes = [], []
    for i in range(3):
        w, rest = _last_word(c['learn'][i])
        banks.append(w)
        clozes.append(rest)
    F = {'hd': f'{t} · Hiraa', 'title': t, 'foot2': f'{SUBJ} · {GRADE} · {pages}',
         'ws_t': f'وَرَقَةُ عَمَلٍ: {t}', 'sc_t': f'بِطاقَةُ الْمَصادِرِ وَالْمَفاهيمِ: {t}',
         'ak_t': f'مِفْتاحُ الْإِجابَةِ: {t}', 'pd_t': f'نَشاطُ أَصْحابِ الْهِمَمِ: {t}',
         'gw_t': f'بِطاقَةُ مَجْموعَةٍ: {t}',
         'src': body, 'bt': body, 'bookref': f'كِتابي {pages}',
         'explain': f'أَشْرَحُ بِكَلِماتي: «{_head(body)}»',
         'thinkq': f"أُفَكِّرُ وَأُجيبُ: {c['think']}",
         'thinkd': f"أُفَكِّرُ بِعُمْقٍ وَأُجيبُ: {c['think']}",
         'situation': f"🎬 {c['scene']}",
         'idn': c['idn'], 'badge': c['badge'],
         'challenge': 'اعْرِضوا عَمَلَكُمْ في دَقيقَةٍ واحِدَةٍ.',
         'ic01': ics[0] + ics[1],
         'kbronze': '1 - ' + ' · '.join(q[1][0] for q in c['qs'][:3]),
         'ksilver': '1 - ' + ' · '.join(banks) + ' &nbsp;|&nbsp; 2 - ' + clozes[0],
         'kgold': '1 - إِجابَةٌ مَفْتوحَةٌ: تُقْبَلُ إِذا وافَقَتِ الدَّرْسَ، مِثْلُ: ' + c['think_ans'],
         'kdiamond': '1 - إِجابَةٌ مَفْتوحَةٌ: تُقْبَلُ إِذا وافَقَتِ الدَّرْسَ، مِثْلُ: '
                     + c.get('diamond_ans', c['think_ans']),
         'kpod': f'1) {ics[0]} · {ics[1]} | 2) 👍 · 👎',
         'kgroups': ' | '.join(f'الْمَجْموعَةُ {i + 1}: {m}'
                               for i, m in enumerate(c['mdl']))}
    for i, x in enumerate(ics[:4]):
        F[f'ic{i}'] = x
    for i, (w, m) in enumerate(c['words']):
        F[f'word{i}'], F[f'mean{i}'] = w, m
    for i, x in enumerate(c['learn']):
        F[f'learn{i}'] = x
    for i, (st, ops) in enumerate(c['qs'][:3]):
        F[f'q{i}s'] = st
        for j, o in enumerate(ops):
            F[f'q{i}o{j}'] = o
    for i in range(3):
        F[f'bank{i}'], F[f'cloze{i}'] = banks[i], clozes[i]
    for i, (tx, _v) in enumerate(c['tf']):
        F[f'tf{i}'] = tx
    for i, x in enumerate(c['pod']):
        F[f'pod{i}'] = x
    for i, x in enumerate(c['grp']):
        F[f'grp{i}'] = x
    for i, x in enumerate(c['do']):
        F[f'do{i}'] = x
    return F


def write_aux(html, table, F):
    parts, ns = deck.nodes(html)
    for i, name in table.items():
        if i >= len(ns) or name not in F:
            continue
        k, old = ns[i]
        lead = old[:len(old) - len(old.lstrip())]
        tail = old[len(old.rstrip()):]
        parts[k] = lead + F[name] + tail
    return deck._expand_tw(''.join(parts))


def build(code, c, unit, tdir, outdir, imgsrc=None):
    """يَبْني مِلَفّاتِ الدَّرْسِ السِّتَّةَ مِنَ الْقالَبِ الْأَصْلِيِّ."""
    d = os.path.join(outdir, code)
    os.makedirs(d, exist_ok=True)
    # العرض
    tpl = open(f'{tdir}/teacher-deck.html', encoding='utf-8').read()
    tpl = tpl.replace(TPL_GRADE, GRADE)
    F = deck_fields(c, unit)
    html = gen.render(tpl, F, None, (code, list(c['imgs'])))
    open(f'{d}/teacher-deck.html', 'w', encoding='utf-8').write(html)
    # المرافقات
    F2 = aux_fields(c)
    for name, table in AUX:
        t = open(f'{tdir}/{name}.html', encoding='utf-8').read()
        out = write_aux(t, table, F2)
        open(f'{d}/{name}.html', 'w', encoding='utf-8').write(out)
    return len(deck.split_sections(html)[1])
