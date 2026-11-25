#!/usr/bin/env python3
"""يولّد «رحلة القنديل» (مصادر الطالب في البيت) لكل درس من بيانات العرض المعتمدة.

المدخلات: _tools/arabic/g1/<CODE>.json و <CODE>.deck.json
القالب: صفحة درس «المحبة في رمضان» (النموذج المعتمد) + generic-data.js + generic-render.js
المخرجات: resources/ar/<CODE>/student-journey.html

الاستعمال: python3 _tools/journey/build_journeys.py [CODE ...]
"""
import json, glob, os, re, random, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.join(ROOT, 'resources/ar/AR-Y1-N-T3-L08/student-journey.html')
SRC = os.path.join(ROOT, '_tools/arabic/g1')
IMGDIR = os.path.join(ROOT, 'resources/slides/img')
SKIP = {'AR-Y1-N-T3-L08'}  # النموذج اليدوي يبقى كما هو

DIAC = re.compile('[ً-ْٰـ]')
EMOJI = re.compile('[\U0001F000-\U0001FAFF☀-➿←-⇿⬀-⯿️‍⃣]')


def strip_d(t):
    return DIAC.sub('', t)


def strip_emoji(t):
    return re.sub(r'\s+', ' ', EMOJI.sub('', t)).strip()


def norm(w):
    w = strip_d(w).translate(str.maketrans('أإآ', 'ااا'))
    w = re.sub(r'[^ء-ي ]', '', w).strip()
    for p in ('وال', 'بال', 'فال', 'لل', 'ال'):
        if w.startswith(p) and len(w) - len(p) >= 2:
            w = w[len(p):]
            break
    return w.rstrip('اةى') if len(w) > 3 else w


def skel(w):
    """هيكل تقريبي للكلمة لمطابقة صيغها في النص (يخدم/تخدم، مصورًا/مصورة، بهدوء/هدوء)."""
    w = strip_d(w).translate(str.maketrans('أإآ', 'ااا'))
    w = re.sub(r'[^\u0621-\u064A]', '', w.split()[0] if w.split() else w)
    if len(w) >= 4 and w[0] in 'وبفل':
        w = w[1:]
    if w.startswith('ال') and len(w) >= 4:
        w = w[2:]
    if len(w) >= 4 and w[0] in 'اتين':
        w = w[1:]
    for suf in ('ات', 'ين', 'ون', 'ان'):
        if w.endswith(suf) and len(w) - 2 >= 3:
            w = w[:-2]
            break
    return w.rstrip('اةهى') if len(w) > 3 else w


def letter_index(model):
    m = re.search(r'\(([ء-ي])[ً-ْ]*\)', model)
    if not m:
        raise ValueError('no answer letter in: ' + model)
    return 'أبجد'.index(m.group(1).replace('ا', 'أ'))


def opt_clean(o):
    return re.sub(r'^\([ء-ي][ً-ْ]*\)\s*', '', o).strip()


def img_ok(code, name):
    return bool(name) and os.path.exists(os.path.join(IMGDIR, f'{code}-{name}.webp'))


def load_pool():
    """كل معاني الكلمات في دروس الصف، ثم معاني المعجم المضافة (glossary.json)."""
    pool = {}
    for f in sorted(glob.glob(os.path.join(SRC, '*.json'))):
        for w in json.load(open(f, encoding='utf-8')).get('words', []):
            pool.setdefault(norm(w[0]), [w[0], w[1], w[2] if len(w) > 2 else '✨'])
    for w in json.load(open(os.path.join(HERE, 'glossary.json'), encoding='utf-8'))['words']:
        pool.setdefault(norm(w[0]), list(w))
    return pool


POOL = None
HIGHLIGHTS = json.load(open(os.path.join(HERE, 'book_highlights.json'), encoding='utf-8'))['lessons']


def find_word(form, entries):
    """يطابق الكلمة الملوّنة في النص بمدخل في قائمة (مع إزالة واو العطف وال وصيغ الإعراب)."""
    tries = [form]
    f0 = strip_d(form)
    if f0[:1] in 'وفب' and len(f0) > 3:
        tries.append(re.sub(r'^[\u0648\u0641\u0628][\u064B-\u0652]*', '', form))
    for t in tries:
        for e in entries:
            if norm(e[0]) == norm(t):
                return e
    for t in tries:
        if len(t.split()) == 1:
            c = [e for e in entries if len(e[0].split()) == 1 and len(skel(t)) >= 3 and skel(e[0]) == skel(t)]
            if len(c) == 1:
                return c[0]
    return None


def build_data(code, L, K, all_learned):
    rnd = random.Random(code)
    words = [[w[0], w[1], w[2] if len(w) > 2 else '✨'] for w in K['words']]
    # كلمات إضافية من بطاقة الدرس إن لم تكن في العرض
    have = {norm(w[0]) for w in words}
    for w in L.get('words', []):
        if norm(w[0]) not in have:
            words.append([w[0], w[1], '✨'])
            have.add(norm(w[0]))
    # الكلمات الملوّنة في نص الكتاب: من الدرس، ثم من بقية دروس الصف، ثم من المعجم المضاف
    global POOL
    POOL = POOL or load_pool()
    hl = {}
    for form in HIGHLIGHTS.get(code, []):
        e = find_word(form, words) or find_word(form, list(POOL.values()))
        if e:
            if e[0] not in [w[0] for w in words]:
                words.append(list(e))
            hl[form] = e[0]
        else:
            print('  !', code, 'no meaning for', form)
    canon = {norm(w[0]): w[0] for w in words}
    meanings = [w[1] for w in words]

    def other_meanings(m, n=2):
        pool = [x for x in meanings if x != m]
        rnd.shuffle(pool)
        return pool[:n]

    key = []
    for i, t in enumerate(L['key']):
        first = None

        def sub(mo):
            nonlocal first
            x = mo.group(1)
            c = canon.get(norm(x))
            if not c and len(x.split()) == 1:
                cands = [w for w in canon.values() if len(w.split()) == 1 and skel(w) == skel(x) and len(skel(x)) >= 3]
                c = cands[0] if len(cands) == 1 else None
            if c and first is None:
                first = (x, c)
            return f'[[{x}|{c}]]' if c else f'[[{x}]]'
        t2 = re.sub(r'\[\[(.+?)\]\]', sub, t)
        sc = {'t': t2}
        if first:
            m = next(w[1] for w in words if w[0] == first[1])
            shown = first[0] if norm(first[0]) == norm(first[1]) else first[1]
            sc['q'] = {'q': f'ما مَعْنى «{shown}»؟', 'o': [m] + other_meanings(m), 'a': 0}
            sc['e'] = next(w[2] for w in words if w[0] == first[1])
        else:
            sc['e'] = '📖'
        if i == 0 and img_ok(code, K['hook'].get('img')):
            sc['img'] = K['hook']['img']
        key.append(sc)

    # الترتيب
    order_items = K['order']
    if all(it[1].strip().startswith('(') for it in order_items):
        items = []
        for it in order_items:
            tiles = [x.strip() for x in it[1].strip().strip('()').split('–')]
            ans = it[2]
            pos = [ans.find(tl) for tl in tiles]
            if min(pos) < 0:
                raise ValueError(f'{code}: tile not in answer: {tiles} / {ans}')
            seq = sorted(range(len(tiles)), key=lambda i: pos[i])
            right = ' '.join(tiles[i] for i in seq)
            wrongs = []
            for perm in ([seq[-1]] + seq[:-1], seq[::-1], seq[1:] + seq[:1]):
                s = ' '.join(tiles[i] for i in perm)
                if s != right and s not in wrongs:
                    wrongs.append(s)
            items.append({'tiles': tiles, 'seq': seq, 'answer': ans, 'opts': [ans] + [w + '.' for w in wrongs[:2]]})
        order = {'type': 'words', 'items': items}
    else:
        order = {'type': 'events', 'items': [{'e': '📖', 'label': strip_emoji(it[1]), 't': it[2]} for it in order_items]}
    order['head'] = strip_emoji(K.get('order_head') or ('أُكَوِّنُ جُمْلَةً مُفيدَةً' if order['type'] == 'words' else 'أُرَتِّبُ الْأَحْداثَ'))
    order['title'] = order['head']

    mp = {'head': strip_emoji(K.get('map_head') or 'خَريطَةُ النَّصِّ'), 'rows': [[r[0], r[1], r[2]] for r in K['map']]}
    mp['title'] = mp['head']
    mt = {'head': strip_emoji(K['match']['head']), 'rows': [[r[0], r[1]] for r in K['match']['rows']]}
    mt['title'] = mt['head']

    wj = K['wordj']
    wordj = {'head': strip_emoji(wj['head']), 'sent': wj['sent'], 'q': wj['q'],
             'o': [opt_clean(o) for o in wj['opts']], 'a': letter_index(wj['model']), 'model': wj['model']}
    ck = K['check']
    check = {'q': strip_emoji(ck['q']), 'o': [opt_clean(o) for o in ck['opts']], 'a': letter_index(ck['model'])}

    others = [x for c, x in all_learned if c != code and x != K['learned']]
    rnd.shuffle(others)
    learned = {'o': [K['learned']] + others[:2], 'a': 0}

    V = K['value']
    value = {'head': V['head'], 'img': V.get('img') if img_ok(code, V.get('img')) else None,
             'sana': V.get('sana', ''), 'fact': V.get('fact', ''), 'dilemma': V.get('dilemma', ''), 'model': V.get('model', '')}
    H = K['home']
    home = {'img': H.get('img') if img_ok(code, H.get('img')) else None, 'family': H.get('family', ''), 'task': H.get('task', '')}
    sp = K['speak']
    speak = {'head': strip_emoji(sp['head']), 'frame': sp['frame']}

    # التحقق النهائي: أسئلة تُصحَّح آليًّا من بيانات معتمدة
    quiz = [{'q': check['q'], 'o': check['o'], 'a': check['a'], 'h': 'ارْجِعْ إِلى النَّصِّ وَتَذَكَّرْ ما جاءَ فيهِ.'}]
    if len(words) > 1:
        w = words[1]
        quiz.append({'q': f'ما مَعْنى «{w[0]}»؟', 'o': [w[1]] + other_meanings(w[1]), 'a': 0, 'h': 'تَذَكَّرْ لُعْبَةَ الذّاكِرَةِ وَبِطاقاتِ الْكَلِماتِ.'})
    r = mp['rows'][1 if len(mp['rows']) > 1 else 0]
    quiz.append({'q': f'«{r[1]}» في النَّصِّ:', 'o': [r[2]] + [x[2] for x in mp['rows'] if x[2] != r[2]][:2], 'a': 0, 'h': 'تَذَكَّرْ خَريطَةَ النَّصِّ.'})
    if order['type'] == 'events':
        quiz.append({'q': f'ماذا جاءَ في «{order["items"][0]["label"]}»؟', 'o': [x['t'] for x in order['items']], 'a': 0, 'h': 'رَتِّبِ الْأَحْداثَ في ذِهْنِكَ مِنَ الْبِدايَةِ.'})
    else:
        it = order['items'][-1]
        quiz.append({'q': 'أَيُّ جُمْلَةٍ صَحيحَةٌ مُفيدَةٌ؟', 'o': it['opts'], 'a': 0, 'h': 'اقْرَأْ كُلَّ جُمْلَةٍ بِصَوْتٍ عالٍ: أَيُّها تَبْدو صَحيحَةً؟'})
    r0 = mt['rows'][0]
    quiz.append({'q': f'{mt["head"]}: «{r0[0]}»', 'o': [r0[1]] + [x[1] for x in mt['rows'][1:3]], 'a': 0, 'h': 'تَذَكَّرْ مَحَطَّةَ التَّوْصيلِ.'})

    talk = [strip_d(q[0]) for q in K.get('exit', [])][:2]
    if len(K.get('reflect', [])) > 1:
        talk.append(strip_d(K['reflect'][1]))

    cover = 'cover' if img_ok(code, 'cover') else (K['hook'].get('img') if img_ok(code, K['hook'].get('img')) else None)
    title = re.sub(r'^مراجعة\s*', 'مُراجَعَةُ ', K['title'])
    return {
        'code': code, 'title': title, 'titlePlain': strip_d(title), 'cover': cover,
        'objective': K['objective'], 'crit': K['criteria'], 'readhead': L.get('readhead', ''),
        'words': words, 'hl': hl, 'hookImg': K['hook'].get('img') if img_ok(code, K['hook'].get('img')) else None, 'match': mt, 'map': mp, 'wordj': wordj, 'order': order,
        'learned': learned, 'value': value, 'speak': speak, 'home': home, 'quiz': quiz, 'talk': talk,
    }


PAGE_RX = re.compile(r'\s*[(（]?\s*(?:كِتابي|كتابي|كِتابُ الطّالِبِ)?[\s،,]*ص\s*[0-9٠-٩]+(?:\s*[–-]\s*[0-9٠-٩]+)?\s*[)）]?')


def drop_pages(o):
    """لا تُذكر أرقام صفحات الكتاب في دروس العربية."""
    if isinstance(o, str):
        return PAGE_RX.sub('', o)
    if isinstance(o, list):
        return [drop_pages(x) for x in o]
    if isinstance(o, dict):
        return {k: drop_pages(v) for k, v in o.items()}
    return o


def make_template():
    b = open(BASE, encoding='utf-8').read()
    i_data = b.index('/* ================= بيانات الدرس')
    i_state = b.index('/* ================= الحالة والحفظ')
    i_st = b.index('/* ===== محطة القراءة') if '/* ===== محطة القراءة' in b else b.index('/* ================= المحطات')
    i_fin = b.index('/* ================= الخاتمة')
    gdata = open(os.path.join(HERE, 'generic-data.js'), encoding='utf-8').read()
    grender = open(os.path.join(HERE, 'book-read.js'), encoding='utf-8').read() + '\n' + open(os.path.join(HERE, 'generic-render.js'), encoding='utf-8').read()
    tail = b[i_fin:]
    rep = [
        ('قِصَّةُ «الْمَحَبَّةُ في رَمَضانَ» · ', '«${D.title}» · '),
        ('رحلة «المحبة في رمضان»', 'رحلة «${esc(D.titlePlain)}»'),
        ('''${S.card?`<div class="sec" style="background:#FFF9EC"><h3>💛 بطاقة طفلكم</h3><p style="font-size:20px">${S.card.icon} أكثر شيء أحبه في رمضان: <b>${S.card.love.replace(/[ًٌٍَُِّْ]/g,"")}</b>، ${S.card.why.replace(/[ًٌٍَُِّْ]/g,"")}.</p></div>`:""}''',
         '''${S.card?`<div class="sec" style="background:#FFF9EC"><h3>💛 بطاقة قيمة طفلكم: ${S.card.head.replace(/[ًٌٍَُِّْ]/g,"")}</h3><p style="font-size:19px">وعد طفلكم: <b>${S.card.pledge.replace(/[ًٌٍَُِّْ]/g,"")}</b></p></div>`:""}'''),
        ('<h3>🎙️ طفلكم يحكي القصة</h3>', '<h3>🎙️ صوت طفلكم</h3>'),
        ('<h3>🎙️ حكاية القصة</h3><p>حكى طفلكم القصة بصوته؛ اطلبوا منه أن يحكيها لكم مرة أخرى.</p>', '<h3>🎙️ القراءة بصوت عالٍ</h3><p>قرأ طفلكم بصوته؛ اطلبوا منه أن يقرأ لكم مرة أخرى.</p>'),
        ('أسبوع العطاء: أضاء', 'أسبوع القراءة: أضاء'),
        ('<ul><li>ماذا تحب هناء أن تسمع في ليالي رمضان؟</li><li>من يحكي القصة؟ وكيف عرفت؟</li><li>ما العمل الذي تحب أن تسعد به غيرك في رمضان؟ ولماذا؟</li></ul>',
         '<ul>${D.talk.map(t=>`<li>${esc(t)}</li>`).join("")}</ul>'),
        ('const stLabel={who:"الشخصيات",map:"عناصر القصة",order:"ترتيب الأحداث",message:"الرسالة",check:"التحقق النهائي",read:"القراءة",words:"المفردات"};\n', ''),
    ]
    for a, c in rep:
        if a not in tail:
            raise SystemExit('template patch not found: ' + a[:60])
        tail = tail.replace(a, c)
    head = b[:i_data]
    head = head.replace('<title>رحلة القنديل · المحبة في رمضان · حراء</title>', '<title>رحلة القنديل · __TITLEPLAIN__ · حراء</title>')
    head = head.replace('<b>رِحْلَةُ الْقِنْديلِ: الْمَحَبَّةُ في رَمَضانَ</b>', '<b>رِحْلَةُ الْقِنْديلِ: __TITLE__</b>')
    assert '__TITLE__' in head and '__TITLEPLAIN__' in head
    head = head.replace('</style>', open(os.path.join(HERE, 'words.css'), encoding='utf-8').read() + '\n</style>', 1)
    return head + gdata + '\n' + b[i_state:i_st] + grender + '\n' + tail


L08_PQ = {
    0: {'q': 'ما أَكْثَرُ شَيْءٍ تُحِبُّهُ هَناءُ؟', 'o': ['سَماعُ صَوْتِ الْمُؤَذِّنِ', 'مُطالَعَةُ النُّجومِ', 'قِيادَةُ الدَّرّاجَةِ'], 'a': 0},
    2: {'q': 'مِنْ أَيْنَ تَقْطِفُ جَدَّتي لَيْلى الرُّطَبَ؟', 'o': ['مِنْ أَعْذاقِ النَّخْلَةِ', 'مِنَ السّوقِ', 'مِنَ الْبُحَيْرَةِ'], 'a': 0},
    3: {'q': 'ما أَكْثَرُ شَيْءٍ يُحِبُّهُ جَدّي سالِمٌ؟', 'o': ['الْجُلوسُ مُسْتَقْبِلًا الْقِبْلَةَ لِتِلاوَةِ الْقُرْآنِ', 'رُكوبُ الْقارِبِ في الْبُحَيْرَةِ', 'رَسْمُ وُجوهِ النّاسِ'], 'a': 0},
    5: {'q': 'ما أَكْثَرُ شَيْءٍ تُحِبُّهُ أُمّي سارَةُ؟', 'o': ['تَوْزيعُ الطَّعامِ عَلى الْأَهْلِ وَالْجيرانِ', 'مُمارَسَةُ الرِّياضَةِ', 'زِراعَةُ النَّخيلِ'], 'a': 0},
    7: {'q': 'بِماذا يُحِبُّ الطِّفْلُ أَنْ يُساعِدَ؟', 'o': ['في فَرْشِ سُفْرَةِ الْإِفْطارِ وَتَوْزيعِ الطَّعامِ', 'في غَسْلِ السَّيّارَةِ', 'في قِيادَةِ الْقارِبِ'], 'a': 0},
}
L08_IMG = {0: 'hanaa', 3: 'grandpa', 5: 'mom', 6: 'father', 7: 'iftar'}


def patch_l08():
    """درس «المحبة في رمضان» اليدوي: يقرأ نص الكتاب الأصلي كاملًا بدل المقتطف، مع معاني كل الكلمات الملوّنة."""
    global POOL
    POOL = POOL or load_pool()
    b = open(BASE, encoding='utf-8').read()
    code = 'AR-Y1-N-T3-L08'
    have = {'يَشُقُّ': 'يَشُقُّ', 'أَعْذاقِ النَّخْلَةِ': 'أَعْذاقِ النَّخْلَةِ', 'خُشوعٍ': 'خُشوعٍ'}
    extra, hl = {}, {}
    for form in HIGHLIGHTS[code]:
        if form in have:
            hl[form] = have[form]
            continue
        e = find_word(form, list(POOL.values()))
        if not e:
            raise SystemExit('L08: no meaning for ' + form)
        hl[form] = e[0]
        extra[e[0]] = {'w': e[0], 'm': e[1], 'e': e[2] if len(e) > 2 else '✨'}
    block = ('/*L08-BOOK*/\nObject.entries(' + json.dumps(extra, ensure_ascii=False) +
             ').forEach(([k,v])=>{WORDS[k]=Object.assign(v,{pic:`<div style="display:grid;place-items:center;width:100%;height:100%"><span style="font-size:110px;line-height:1">${v.e}</span></div>`})});\n'
             'const HL=' + json.dumps(hl, ensure_ascii=False) + ',READHEAD="أَقْرَأُ الْقِصَّةَ",PQ=' + json.dumps(L08_PQ, ensure_ascii=False) +
             ',SCENE_IMG=' + json.dumps(L08_IMG) + ';\n/*/L08-BOOK*/\n')
    if '/*L08-BOOK*/' in b:
        b = re.sub(r'/\*L08-BOOK\*/.*?/\*/L08-BOOK\*/\n', lambda m: block, b, flags=re.S)
    else:
        i = b.index('/* ================= الحالة والحفظ')
        b = b[:i] + block + b[i:]
    # حذف المقتطف المعاد صياغته
    b = re.sub(r'const SCENES=\[.*?\n\];\n', '', b, flags=re.S)
    # محطة القراءة
    br = open(os.path.join(HERE, 'book-read.js'), encoding='utf-8').read()
    if '/* ===== محطة القراءة' in b:
        b = re.sub(r'/\* ===== محطة القراءة.*?(?=/\* ================= المحطات)', lambda m: br, b, flags=re.S)
    else:
        b = b.replace('/* ================= المحطات', br + '/* ================= المحطات', 1)
    i, j = b.index('\n read(el){'), b.index('\n words(el){')
    b = b[:i] + '\n read(el){readBook(el)},' + b[j:]
    if 'BOOK=d.book;' not in b:
        b = b.replace('const d=e.data;ROLE=d.role||"guest";NAME=d.name||"";', 'const d=e.data;ROLE=d.role||"guest";NAME=d.name||"";if(d.book&&d.book.body)BOOK=d.book;', 1)
    if '.kw.nk{' not in b:
        b = b.replace('.kw.seen::after{content:"✓";background:var(--green)}', '.kw.seen::after{content:"✓";background:var(--green)}\n.kw.nk{cursor:default}.kw.nk::after{display:none}\n.scene.verse .txt{line-height:2.3;font-family:"Thmanyah Display",serif}', 1)
    b = b.replace('if(d.book&&d.book.body)BOOK=d.book;', 'if(d.book&&d.book.body&&!window.__ownBook)BOOK=d.book;')
    if 'total:STATIONS.length' not in b:
        b = b.replace('S.meta={crit:CRIT.map(c=>c.t.replace(/[\\u064B-\\u0652]/g,""))};', 'S.meta={crit:CRIT.map(c=>c.t.replace(/[\\u064B-\\u0652]/g,"")),total:STATIONS.length};', 1)
    if '.scene>div{position:relative;z-index:1}' not in b:
        b = b.replace('.scene .txt{', '.scene>div{position:relative;z-index:1}\n.scene .txt{', 1)
    open(BASE, 'w', encoding='utf-8').write(b)


IE_TAIL_PATCHES = [
    ('قِصَّةُ «الْمَحَبَّةُ في رَمَضانَ» · ', '«${D.title}» · '),
    ('رحلة «المحبة في رمضان»', 'رحلة «${esc(D.titlePlain)}»'),
    ('<h3>🎙️ طفلكم يحكي القصة</h3>', '<h3>🎙️ صوت طفلكم</h3>'),
    ('<h3>🎙️ حكاية القصة</h3><p>حكى طفلكم القصة بصوته؛ اطلبوا منه أن يحكيها لكم مرة أخرى.</p>',
     '<h3>🎙️ بصوت طفلكم</h3><p>عبّر طفلكم بصوته عن حبه لربه وشكره؛ اطلبوا منه أن يقولها لكم.</p>'),
    ('<ul><li>ماذا تحب هناء أن تسمع في ليالي رمضان؟</li><li>من يحكي القصة؟ وكيف عرفت؟</li><li>ما العمل الذي تحب أن تسعد به غيرك في رمضان؟ ولماذا؟</li></ul>',
     '<ul>${D.talk.map(t=>`<li>${esc(t)}</li>`).join("")}</ul>'),
]
CARD_OLD = '${S.card?`<div class="sec" style="background:#FFF9EC"><h3>💛 بطاقة طفلكم</h3><p style="font-size:20px">${S.card.icon} أكثر شيء أحبه في رمضان: <b>${S.card.love.replace(/[ًٌٍَُِّْ]/g,"")}</b>، ${S.card.why.replace(/[ًٌٍَُِّْ]/g,"")}.</p></div>`:""}'
CARD_NEW = '${S.card?`<div class="sec" style="background:#FFF9EC"><h3>💛 ${S.card.head.replace(/[ًٌٍَُِّْ]/g,"")}</h3><p style="font-size:19px">وعد طفلكم: <b>${S.card.pledge.replace(/[ًٌٍَُِّْ]/g,"")}</b></p></div>`:""}'


def build_ie(want):
    """رحلات التربية الإسلامية: من بيانات ie_lessons.py (الكتاب المدرسي + عرض المعلم)."""
    import importlib.util
    spec = importlib.util.spec_from_file_location('ie_lessons', os.path.join(HERE, 'ie_lessons.py'))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    b = open(BASE, encoding='utf-8').read()
    i_data = b.index('/* ================= بيانات الدرس')
    i_state = b.index('/* ================= الحالة والحفظ')
    i_st = b.index('/* ===== محطة القراءة')
    i_fin = b.index('/* ================= الخاتمة')
    rd = lambda n: open(os.path.join(HERE, n), encoding='utf-8').read()
    done = []
    for code, L in mod.LESSONS.items():
        if want and code not in want:
            continue
        head = b[:i_data]
        head = head.replace('<title>رحلة القنديل · المحبة في رمضان · حراء</title>', '<title>رحلة القنديل · ' + L['titlePlain'] + ' · حراء</title>')
        head = head.replace('<b>رِحْلَةُ الْقِنْديلِ: الْمَحَبَّةُ في رَمَضانَ</b>', '<b>رِحْلَةُ الْقِنْديلِ: ' + L['title'] + '</b>')
        head = head.replace('<small>اللغة العربية · الصف الأول · رحلة المذاكرة في البيت</small>', '<small>' + L['subject'] + ' · رحلة المذاكرة في البيت</small>')
        head = head.replace('</style>', rd('ie.css') + '\n</style>', 1)
        assert L['title'] in head and L['subject'] in head
        D = {k: v for k, v in L.items() if k not in ('db_code', 'subject', 'weekLabel')}
        data = json.dumps(D, ensure_ascii=False).replace('</', '<\\/')
        tail = b[i_fin:]
        patches = IE_TAIL_PATCHES + [
            (CARD_OLD, CARD_NEW),
            ('اللغة العربية · الصف الأول · ${new Date()', strip_d(L['subject']) + ' · ${new Date()'),
            ('أسبوع العطاء: أضاء', L['weekLabel'] + ': أضاء'),
        ]
        for a2, c2 in patches:
            if a2 not in tail:
                raise SystemExit('IE tail patch not found: ' + a2[:60])
            tail = tail.replace(a2, c2)
        html = (head + rd('ie-data.js').replace('__DATA__', data) + '\n' + b[i_state:i_st] + rd('book-read.js') + '\n'
                + rd('generic-render.js') + '\n' + rd('ie-render.js') + '\n' + tail)
        out = os.path.join(ROOT, 'resources/ie', code, 'student-journey.html')
        open(out, 'w', encoding='utf-8').write(html)
        done.append(code)
    print('built', len(done), 'IE journeys:', ' '.join(done))


def main():
    patch_l08()
    build_ie(set(sys.argv[1:]))
    tpl = make_template()
    decks = sorted(glob.glob(os.path.join(SRC, '*.deck.json')))
    all_learned = [(json.load(open(f))['code'], json.load(open(f))['learned']) for f in decks]
    want = set(sys.argv[1:])
    done = []
    for f in decks:
        K = json.load(open(f, encoding='utf-8'))
        code = K['code']
        if code in SKIP or (want and code not in want):
            continue
        L = json.load(open(f.replace('.deck.json', '.json'), encoding='utf-8'))
        D = build_data(code, L, K, all_learned)
        D = drop_pages(D)
        data = json.dumps(D, ensure_ascii=False).replace('</', '<\\/')
        html = tpl.replace('__DATA__', data).replace('__TITLEPLAIN__', D['titlePlain']).replace('__TITLE__', D['title'])
        out = os.path.join(ROOT, 'resources/ar', code, 'student-journey.html')
        os.makedirs(os.path.dirname(out), exist_ok=True)
        open(out, 'w', encoding='utf-8').write(html)
        done.append(code)
    print('built', len(done), 'journeys:', ' '.join(c[-3:] for c in done))


if __name__ == '__main__':
    main()
