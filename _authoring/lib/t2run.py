# -*- coding: utf-8 -*-
"""خطّ إنتاج الفصل الثاني للصف الخامس: بناء ← عمل جماعي ← شرائح مقتبسة ← أوراق ← تقدّم وتغذية.

كل خطوة تُحسب أولًا ثم تُكتب، والمدخلات محصورة في أكواد الفصل الثاني وحدها،
حتى لا يُعاد تطبيق شيء على دروس الفصل الأول.
"""
import sys, os, json, importlib
sys.path.insert(0, '/tmp/g5'); sys.path.insert(0, '/tmp/g5/lib')
import deck, adv, groups, sheets, gen
import build as B

REPO = '/tmp/hpush/resources/ssd'
AUTH = '/tmp/hpush/_authoring'
LEM = ['👑', '📜', '🛡️', '⭐']


def _badge(exit_sec):
    import re
    m = re.search(r'🏅[^<]*', exit_sec)
    return m.group(0).strip() if m else '🏅'


def adv_slides(code, G, A):
    p = f'{REPO}/{code}/teacher-deck.html'
    h = open(p, encoding='utf-8').read()
    secs = dict(deck.split_sections(h)[1])
    donor = secs['think']
    b = A['bridge']
    critique = adv.with_model(
        adv.build(donor, 'critique', '#F6F2FF', adv.critique(A['claims']),
                  'صوّتوا أولًا، ثم علّلوا، ثم اكشف الحكم وصوّبوا الخطأ.'),
        adv.critique_model(A['claims']))
    bridge = adv.with_model(
        adv.build(donor, 'bridge', '#EEF5FB',
                  adv.bridge(b['question'], b['prompt'], b['frames'], b['criteria']),
                  'النقاش مادة الكتابة؛ لا يكتب الطالب قبل أن يستخرج دليليه.'),
        b['model'], label='💡 نَموذَجُ الْفِقْرَةِ')
    out = adv.insert(h, [
        ('groups', adv.build(donor, 'groupmap', '#F7F2E8', adv.groupmap(G),
                             'وزّع الأدوار قبل الانطلاق، واضبط المؤقّت على مسار الوقت.')),
        ('watani', adv.build(donor, 'enrich', '#F1F8F3', adv.enrich(A['enrich']),
                             'إثراء سريع: اقرأ بطاقةً واحدة واترك البقية للفضول.')),
    ], {
        'truefalse': critique,
        'exit': adv.build(secs['exit'], 'exit', '#FFF8EA',
                          adv.exitcard(A['apply'], _badge(secs['exit'])),
                          'بطاقة الخروج تُجمع، وتُسجَّل القراءة البعدية في تبويب التقدّم.'),
    })
    out = adv.insert(out, [('models', bridge)])
    for i, (t1, t2, t3) in enumerate(A['tiers'], 1):
        pre, ss, post = deck.split_sections(out)
        d = dict(ss)
        sid = f'g{i}'
        if sid in d:
            out = out.replace(d[sid], adv.tiers(d[sid], t1, t2, t3), 1)
    open(p, 'w', encoding='utf-8').write(out)
    return len(deck.split_sections(out)[1])


def prog_feedback(code):
    p = f'{REPO}/{code}/teacher-deck.html'
    h = open(p, encoding='utf-8').read()
    secs = dict(deck.split_sections(h)[1])
    gt = deck.texts(secs['goal'])
    levs = [gt[i] for i in (6, 9, 12) if i < len(gt)]
    out = adv.insert(h, [], {
        'progress': adv.build(secs['progress'], 'progress', '#EEF5FB',
                              adv.progress(levs), 'قياس قبلي بسلّم من 1 إلى 5؛ يحتفظ به الطالب.'),
        'progress2': adv.build(secs['progress2'], 'progress2', '#EEF5FB',
                               adv.progress(levs, after=True),
                               'قياس بعدي؛ قارن بالقبلي واسأل: ما الذي تغيّر؟'),
        'feedback': adv.build(secs['feedback'], 'feedback', '#FFFBF2',
                              adv.feedback(), 'نجمتان وأمنية بعد كل عرض؛ ذكّر بمعايير الحكم.'),
    })
    open(p, 'w', encoding='utf-8').write(out)
    return len(levs)


def run(mod_c, mod_g, mod_a, unit_json, idea, emoji):
    """mod_c/mod_g/mod_a: module names for content, groups, advanced."""
    C = importlib.import_module(mod_c)
    G = importlib.import_module(mod_g).G
    A = importlib.import_module(mod_a).A
    for code, c in sorted(C.L.items()):
        B.build(code, c, C.UNIT, imgsrc='/tmp/g5/fin', tdir='/tmp/g5/tpl/SS-Y5-T1-L08')
    # العمل الجماعي
    for code, g in sorted(G.items()):
        d = f'{REPO}/{code}'
        p = f'{d}/teacher-deck.html'
        out = groups.apply(open(p, encoding='utf-8').read(), g)      # احسب أولًا
        open(p, 'w', encoding='utf-8').write(out)                     # ثم اكتب
        p2 = f'{d}/group-work.html'
        out2 = groups.apply_cards(open(p2, encoding='utf-8').read(), g)
        open(p2, 'w', encoding='utf-8').write(out2)
    # الشرائح المقتبسة
    for code in sorted(A):
        n = adv_slides(code, G[code], A[code])
        print(f'  {code}: {n} شريحة')
    # أوراق العمل وبطاقة المصادر
    for code, g in sorted(G.items()):
        c = C.L[code]
        topic = c['title'].split(':')[-1].strip()
        q3, task = g[1]['stretch'], g[2]['stretch']
        p = f'{REPO}/{code}/worksheets-A4.html'
        out = sheets.raise_worksheet(open(p, encoding='utf-8').read(), c['idn'], topic, q3, task)
        open(p, 'w', encoding='utf-8').write(out)
        p2 = f'{REPO}/{code}/sources-concept-card.html'
        out2 = sheets.raise_sources(open(p2, encoding='utf-8').read(), c['idn'], topic)
        open(p2, 'w', encoding='utf-8').write(out2)
    # قياس التقدّم والتغذية الراجعة
    for code in sorted(C.L):
        prog_feedback(code)
    # ملف الوحدة لقاعدة البيانات
    out = []
    for code, c in sorted(C.L.items()):
        bt, marks = c['booktext']
        out.append({
            'code': code, 'title': c['title'], 'obj': c['obj'],
            'pages': c['pages'], 'sort': c['sort'],
            'sm': {'lang': 'ar', 'emoji': emoji[code], 'idea': idea[code],
                   'hook': c['hook'], 'scene': c['scene'], 'think': c['think'],
                   'words': [list(w) for w in c['words']],
                   'learn': [[LEM[i], t] for i, t in enumerate(c['learn'])],
                   'quiz': [[t, v] for t, v in c['tf']],
                   'do': list(c['do']), 'badge': c['badge'],
                   'study': {'guide': list(c['guide'])}},
            'lev': list(c['lev']), 'bt': bt, 'idn': c['idn'],
            'qs': [[st, list(op), 0] for st, op in c['qs']],
        })
    json.dump(out, open(f'{AUTH}/{unit_json}', 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)
    print(f'  كُتِب {unit_json}: {len(out)} درسًا')
    return sorted(C.L)
