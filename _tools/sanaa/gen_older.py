#!/usr/bin/env python3
# Sanaa for older students (Y5+): lean generator — 6 files per lesson from a compact spec. Unvocalised text (as in the books).
import os, sys, re
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import deckkit as K
from deckkit import frame, abs_, card, P, esc
ROOT = '/home/claude/hira'
_src = open(os.path.join(HERE, 'sheets_y1_t1_l01.py'), encoding='utf8').read().split('# ---------- worksheets')[0]
G = {}; exec(_src, G)
doc, q, row, page, NM = G['doc'], G['q'], G['row'], G['page'], G['NM']
LEVELS = [('برونزي', '#9A5A26', '#F7E9DC'), ('فضي', '#5E6672', '#EDEFF2'), ('ذهبي', '#A87A0C', '#FBF1D3'), ('ماسي', '#5546A3', '#EEEAFB')]
GN = {5: 'الخامس', 6: 'السادس', 7: 'السابع', 8: 'الثامن', 9: 'التاسع', 10: 'العاشر', 11: 'الحادي عشر', 12: 'الثاني عشر'}
LOGO = G['LOGO']
GC = [('#C9822B', '#FBEBD6'), ('#2F6A9A', '#DDEBF7'), ('#3E9E5B', '#E3F3E8'), ('#5546A3', '#EEEAFB')]
# per-grade depth layer (same book text, higher demand)
DEPTH = {5: ('بجملة كاملة.', 'وأذكر مثالًا من حياتي.', 'وأقترح سلوكًا بديلًا.'),
         6: ('بجملتين.', 'وأذكر مثالًا وأعلل.', 'وأقترح مبادرة مدرسية.'),
         7: ('وأستشهد بعبارة من الكتاب.', 'وأقارن بين موقفين.', 'وأضع خطة قصيرة للتنفيذ.'),
         8: ('وأستشهد بالكتاب وأعلل.', 'وأحلل الموقف وأقيّم السلوك.', 'وأصمم مبادرة وأحدد مؤشر نجاحها.'),
         9: ('وأستشهد بالكتاب وأعلل.', 'وأحلل الموقف وأربطه بقيمة.', 'وأصمم مبادرة وأحدد مؤشر نجاحها.'),
         10: ('وأستشهد بنص من الكتاب وأعلل.', 'وأقارن بين موقفين وأحكم.', 'وأصمم مبادرة وأقيس أثرها.'),
         11: ('وأوثّق رأيي بالكتاب.', 'وأنقد الموقف بحجة.', 'وأصمم مشروعًا مجتمعيًّا بمؤشرات.'),
         12: ('وأوثّق وأناقش البدائل.', 'وأقيّم الموقف وأقترح معالجة.', 'وأقود مشروعًا وأقيّم أثره.')}

def sw(sp, y, title_kind, bg, pill, pc):
    sub = 'السنع الإماراتي · الصف %s · %s' % (GN[y], sp['pages'])
    return (f"<div class='hd' style='background:{bg}'><div><div class='t'>{title_kind}: {esc(sp['title'])}</div><div class='m'>{sub}</div></div>"
            f"<div style='display:flex;align-items:center;gap:10px'><span class='pill' style='background:{pc}'>{pill}</span>{LOGO}</div></div>")

def lines(n, h=9):
    return ''.join(f"<div class='ln' style='height:{h}mm'></div>" for _ in range(n))

def mc(i, qq, opts):
    ab = 'أبجد'
    return (f"<div style='margin:6px 0'><div class='s' style='font-size:13pt'><b>{i}.</b> {esc(qq)}</div><div class='opts'>"
            + ''.join(f"<span>( {ab[j]} ) {esc(o)}</span>" for j, o in enumerate(opts)) + "</div></div>")

def worksheets(sp, y):
    d = DEPTH[y]; out = []
    SELF = G['SELF'] if 'SELF' in G else ''
    # bronze: MCQ + TF
    c = LEVELS[0]; h = sw(sp, y, 'ورقة عمل', c[2], 'المستوى: ' + c[0], c[1]) + NM
    b = q(1, c[1], 'أختار الإجابة الصحيحة:', ''.join(mc(i + 1, m[0], m[1]) for i, m in enumerate(sp['mcq'])))
    b += q(2, c[1], 'أضع ( ✓ ) أو ( ✗ ) وأصوّب الخطأ:', ''.join(row(f"{esc(t[0])}  ( &nbsp;&nbsp; )") for t in sp['tf'][:4]) + lines(2))
    out.append(page(h + b))
    # silver: match + concepts
    c = LEVELS[1]; h = sw(sp, y, 'ورقة عمل', c[2], 'المستوى: ' + c[0], c[1]) + NM
    A = [a for a, _ in sp['match']]; B = [bb for _, bb in sp['match']]
    import random; rnd = random.Random(sp['stem'] + str(y)); Bs = B[:]; rnd.shuffle(Bs)
    AB = "أبجد"
    mt = "".join(row(f"{i+1}. {esc(a)}  ( &nbsp;&nbsp;&nbsp; )") for i, a in enumerate(A))
    bank = "<div class='k' style='margin:4px 0'>" + " &nbsp;|&nbsp; ".join(f"<b>{AB[i]}</b>) {esc(bs)}" for i, bs in enumerate(Bs)) + "</div>"
    b = q(1, c[1], 'أكتب الحرف المناسب من الصندوق أمام كل رقم:', mt + bank)
    b += q(2, c[1], 'أشرح بأسلوبي ' + d[0].replace('وأ', 'وأ').rstrip('.') + ':', ''.join(row(f"<b>{esc(t)}</b>:") + lines(1) for t, _ in sp['concepts'][:2]))
    b += q(3, c[1], 'أذكر مثالين على تطبيق ما تعلمته في بيتي أو مدرستي:', lines(2, 10))
    out.append(page(h + b))
    # gold: short answers + justification
    c = LEVELS[2]; h = sw(sp, y, 'ورقة عمل', c[2], 'المستوى: ' + c[0], c[1]) + NM
    b = q(1, c[1], 'أجيب عن السؤالين ' + d[0].replace('بجملة كاملة', 'بجملة كاملة').strip(), ''.join(row(esc(s)) + lines(2) for s in sp['short'][:2]))
    b += q(2, c[1], 'أحكم على العبارة ( ✓ / ✗ ) وأعلل ' + d[1], ''.join(row(esc(t[0]) + '  ( &nbsp;&nbsp; )') + lines(1) for t in sp['tf'][4:6]))
    out.append(page(h + b))
    # diamond: case + project
    c = LEVELS[3]; h = sw(sp, y, 'ورقة عمل', c[2], 'المستوى: ' + c[0], c[1]) + NM
    b = q(1, c[1], 'دراسة حالة:', f"<div class='k'>{esc(sp['case'][0])}</div>" + row(esc(sp['case'][1]) + ' ' + d[1]) + lines(3))
    b += q(2, c[1], 'مشروعي:', row(esc(sp['proj']) + ' ' + d[2]) + "<div class='box' style='height:44mm'></div>")
    out.append(page(h + b))
    return doc('أوراق المستويات · ' + sp['title'], ''.join(out))

def pod(sp, y):
    c = ('#3F6E5B', '#DCEAE4'); h = sw(sp, y, 'نشاط أصحاب الهمم', c[1], 'أنا أستطيع!', c[0]) + NM
    b = q(1, c[0], 'أختار الإجابة الصحيحة:', mc(1, sp['mcq'][0][0], sp['mcq'][0][1]))
    b += q(2, c[0], 'أضع ( ✓ ) أو ( ✗ ):', ''.join(row(esc(t[0]) + '  ( &nbsp;&nbsp; )') for t in sp['tf'][:2]))
    b += q(3, c[0], 'أكمل: أتعلم من الدرس أن', lines(2, 11))
    return doc('نشاط أصحاب الهمم · ' + sp['title'], page(h + NM * 0 + b))

def sources(sp, y):
    c = ('#3F6E5B', '#DCEAE4'); h = sw(sp, y, 'بطاقة المصادر والمفاهيم', c[1], 'للجميع', c[0])
    pts = '<br>'.join('• ' + esc(p) for p in sp['points'])
    b = f"<div class='k' style='background:#FFF8EA;border-color:#E3C07A'><b>📖 من كتابي {esc(sp['pages'])}</b><div style='font-size:13pt;line-height:1.9;margin-top:4px'>{pts}</div>"
    b += f"<div style='text-align:center;font-size:9.5pt;color:#5B6472'>{esc(sp['src_note'])}</div></div>"
    cs = ''.join(f"<div style='flex:1;min-width:30%;border-radius:14px;background:{LEVELS[i][2]};padding:6px 10px;text-align:center'><div style='font-family:TD;font-size:17pt;color:{LEVELS[i][1]}'>{esc(t)}</div><div style='font-size:11pt'>{esc(m)}</div></div>" for i, (t, m) in enumerate(sp['concepts']))
    b += f"<div class='k'><b>📘 كلماتي</b> <span style='font-size:9.5pt;color:#5B6472'>(الشرح المبسّط من إعداد حراء)</span><div style='display:flex;gap:8px;flex-wrap:wrap;margin-top:6px'>{cs}</div></div>"
    if sp.get('phrases'):
        ph = ''.join(f"<div class='row'><span class='s'><b>{esc(a)}</b> — {esc(bb)}</span></div>" for a, bb in sp['phrases'])
        b += f"<div class='k'><b>🗣️ من عبارات السنع في الكتاب</b>{ph}</div>"
    return doc('بطاقة المصادر · ' + sp['title'], page(h + b))

def group(sp, y):
    d = DEPTH[y]; tasks = [
        ('نقرأ الصفحات المقررة في الكتاب ونستخرج أهم أربع نقاط ونرتبها.', sp['short'][0]),
        ('نشرح مفهومين من الدرس بأسلوبنا ونذكر لكل منهما مثالًا.', 'نربط المفهوم بموقف من مدرستنا ' + d[2]),
        ('نحلل دراسة الحالة: ما الصواب وما الخطأ؟ ولماذا؟', sp['case'][1]),
        ('نصمم مشروعًا صغيرًا: ' + sp['proj'], 'نعرض مشروعنا على الصف في دقيقتين ' + d[2])]
    pgs = ''
    for i, (t, ch) in enumerate(tasks):
        ac, bg = GC[i]
        pgs += (f"<div class='gc' style='border-color:{ac}'><div class='hd' style='background:{bg}'><div><div class='t'>بطاقة مجموعة: {esc(sp['title'])}</div>"
                f"<div class='m'>السنع الإماراتي · الصف {GN[y]} · {sp['pages']}</div></div><div style='display:flex;align-items:center;gap:10px'><span class='pill' style='background:{ac}'>المجموعة {i+1}</span>{LOGO}</div></div>"
                f"<div style='font-size:11pt;margin:4px 0'>🧭 القائد · ✏️ المسجّل · 🗣️ المتحدث · ⏰ حارس الوقت</div>"
                f"<div class='k' style='background:{bg};border-color:{ac}'><b>⭐ المهمة:</b> {esc(t)}</div>" + lines(3, 10)
                + f"<div class='star'><b>★ تحدي الأبطال:</b> {esc(ch)}</div></div>")
    return doc('بطاقات المجموعات · ' + sp['title'], page(pgs))

def key(sp, y):
    ab = 'أبجد'; c = ('#3F6E5B', '#DCEAE4'); h = sw(sp, y, 'مفتاح الإجابة', c[1], '👩‍🏫', c[0])
    def kk(i, t): return f"<div class='k' style='border-color:{LEVELS[i][1]};background:{LEVELS[i][2]}'>{t}</div>"
    ok = ' · '.join('✓' if t[1] else '✗' for t in sp['tf'][:4])
    mcq = ' · '.join(f"{i+1}) ( {ab[m[2]]} )" for i, m in enumerate(sp['mcq']))
    cor = '<br>'.join(f"• {esc(t[0])} ← {'صحيحة' if t[1] else 'خاطئة: ' + esc(t[2])}" for t in sp['tf'])
    b = kk(0, f"<b>برونزي:</b> 1 - {mcq} &nbsp;|&nbsp; 2 - {ok}<br>{cor}")
    b += kk(1, '<b>فضي:</b> 1 - ' + ' · '.join(f"{esc(a)} ← {esc(bb)}" for a, bb in sp['match']) + ' &nbsp;|&nbsp; 2 - ' + ' · '.join(f"{esc(t)}: {esc(m)}" for t, m in sp['concepts'][:2]))
    b += kk(2, '<b>ذهبي:</b> ' + ' &nbsp;|&nbsp; '.join(esc(a) for a in sp['short_key'][:2]) + ' &nbsp;|&nbsp; التعليل: ' + ' · '.join(('✓' if t[1] else '✗ ' + esc(t[2])) for t in sp['tf'][4:6]))
    b += kk(3, '<b>ماسي:</b> ' + esc(sp['case_key']) + ' &nbsp;|&nbsp; المشروع: تُقبل كل إجابة تلتزم بنص الكتاب وتعلّل.')
    b += kk(2, '<b>الصفوف:</b> الصف %s يضيف: %s' % (GN[y], ' / '.join(DEPTH[y])))
    return doc('مفتاح الإجابة · ' + sp['title'], page(h + b))

# ---------------- deck ----------------
PALS = ['sand', 'blue', 'mint', 'rose', 'lav', 'gold', 'sky', 'peach']
import math
def _fit(texts, base, w=1630, top=300, avail=660, gap=22, minfs=26):
    """return (fs, heights) so a vertical stack of texts fits in `avail` px."""
    fs = base
    while True:
        cpl = max(20, int(w / (fs * 0.50)))
        hs = [int(math.ceil(len(t) / cpl) * fs * 1.6 + 56) for t in texts]
        if sum(hs) + gap * (len(hs) - 1) <= avail or fs <= minfs: return fs, hs
        fs -= 2
def _stack(texts, ac, base=38, top=300, avail=660, gap=22, w=1680, bg='#fff', numbered=False, align='right'):
    fs, hs = _fit(texts, base, w - 50, top, avail, gap); body = ''; y = top
    for i, (t, h) in enumerate(zip(texts, hs)):
        tt = esc(t) if not numbered else '<b style="color:%s">%d.</b> %s' % (ac, i + 1, esc(t))
        body += abs_(120, y, w, card(P(tt, fs, align=align), w, h, ac=ac, bg=bg, extra='align-items:flex-start'))
        y += h + gap
    return body
def deck(sp, y, lesson_id, out):
    S = []; foot = 'حراء · السنع الإماراتي · الصف %s' % GN[y]; n = [0]; T = sp['title']
    def sl(pal, badge, mins, title, body, notes):
        n[0] += 1; S.append(frame('s%d' % n[0], pal, badge, mins, title, body, notes, foot))
    d = DEPTH[y]; pg = sp['pages']; A = lambda p: K.PAL[p][1]
    tfs, mc, mt, sh = sp['tf'], sp['mcq'], sp['match'], sp['short']
    # 1 cover
    sl('sand', sp['unit'], '', T, abs_(120, 380, 1680, card(P(esc(sp['obj']), 44, bold=True, display=True) + P('من كتاب الطالب ' + esc(pg) + ' · الصف ' + GN[y], 30, '#5B6472'), 1680, 360, ac='#B0782A'), 'justify-content:center'),
       'ترحيب. اعرض عنوان الدرس والهدف. الوقت الكلي: حصة واحدة (نحو 45 دقيقة).')
    # 2 warm-up
    sl('blue', 'تهيئة', '3 د', 'نتذكر معًا قبل أن نبدأ', abs_(120, 330, 1680, card(P(esc(sp['warm']), 44, align='right'), 1680, 300, ac='#2F6A9A', extra='align-items:flex-start')) +
       abs_(120, 680, 1680, card(P('أناقش مع زميلي دقيقة ثم نشارك الصف.', 32, '#5B6472', align='right'), 1680, 130, ac='#2F6A9A', border=False)),
       'اطلب إجابات حرة قبل فتح الكتاب. لا تصحح الآن.')
    # 3 curiosity
    sl('peach', 'نتساءل', '4 د', 'لحظة فضول', abs_(120, 320, 1680, card(P(esc(sp['case'][0]), 42, align='right'), 1680, 300, ac=A('peach'), extra='align-items:flex-start')) +
       abs_(120, 660, 1680, card(P('🤔 ما رأيك؟ اكتب توقعك في جملة، وسنعود إليه في نهاية الدرس.', 34, A('peach'), True, align='right'), 1680, 150, ac=A('peach'), bg='#FFF1E6')),
       'لا تجب عن السؤال الآن؛ اجمع توقعات الطلاب وارجع إليها في الختام.')
    # 4 detectives: guess the term
    ms = [m for _, m in sp['concepts']]
    sl('sky', 'تحدي المحققين', '3 د', 'خمّن المصطلح!', _stack(ms, A('sky'), 36, numbered=True, avail=560) +
       abs_(120, 880, 1680, P('المصطلحات: ' + ' · '.join(t for t, _ in sp['concepts']) + ' (للمعلم)', 22, '#8A8475', align='right')),
       'اعرض التعريفات واطلب من الطلاب تخمين المصطلح قبل كشفه من الدرس. الإجابات بالترتيب: ' + ' ، '.join(t for t, _ in sp['concepts']) + '.')
    # 5 predict
    pr = [s for s, _, _ in tfs[:3]]
    sl('lav', 'قبل الدرس', '3 د', 'أتوقع: صحيحة أم خاطئة؟', _stack(pr, A('lav'), 38, numbered=True, avail=560) +
       abs_(120, 880, 1680, P('نتحقق من توقعاتنا بعد القراءة.', 28, '#5B6472', align='right')),
       'اجمع التصويت بالأيدي. الإجابات: ' + ' ، '.join('صحيحة' if b else 'خاطئة' for _, b, _ in tfs[:3]) + '.')
    # 6 aim
    sl('gold', 'هدف الدرس', '2 د', 'وجهتنا اليوم', abs_(120, 330, 1680, card(P('🎯 ' + esc(sp['obj']), 44, A('gold'), True, align='right'), 1680, 220, ac=A('gold'), bg='#FFF6DD')) +
       abs_(120, 590, 1680, card(P('معيار نجاحي: ' + esc(d[0]), 34, align='right') + P('وأربط ما تعلمته بسلوك أطبقه.', 30, '#5B6472', align='right'), 1680, 220, ac=A('gold'), extra='align-items:flex-start')),
       'اقرأ الهدف مع الطلاب واطلب منهم إعادة صياغته.')
    # 7 map
    steps = ['نتذكر', 'مفاتيح الدرس', 'نقرأ من الكتاب', 'نطبق معًا', 'نعمل في مجموعات', 'نتحدى مستوياتنا', 'نختم']
    cb = ''.join(abs_(120 + (i % 4) * 430, 330 + (i // 4) * 260, 400, card(P('%d' % (i + 1), 44, A(PALS[i]), True, True) + P(t, 30), 400, 220, ac=A(PALS[i]))) for i, t in enumerate(steps))
    sl('sand', 'خريطة الحصة', '1 د', 'رحلة درسنا', cb, 'اعرض مراحل الحصة سريعًا.')
    # 8 pre-progress
    outs = [sp['obj'], 'أشرح: ' + sp['concepts'][0][0] + ' و' + sp['concepts'][1][0], 'أطبق ما تعلمته في موقف من حياتي']
    sl('mint', 'قياس التقدم', '2 د', 'أين أنا الآن؟ (قبل الدرس)', _stack([o + '   ☐ لا أعرف  ☐ أعرف قليلًا  ☐ أعرف جيدًا' for o in outs], A('mint'), 34, avail=560, numbered=True),
       'يقيّم الطالب نفسه قبل الدرس بوضع علامة. نعيد التقييم بعد الدرس.')
    # 9 concepts
    nc = len(sp['concepts']); cw = (1680 - 40 * (nc - 1)) // nc
    cb = ''.join(abs_(120 + i * (cw + 40), 330, cw, card(P(esc(t), 48 if nc < 4 else 42, A(PALS[i]), True, True) + P(esc(m), 32 if nc < 4 else 28), cw, 460, ac=A(PALS[i]))) for i, (t, m) in enumerate(sp['concepts']))
    sl('mint', 'مفاتيح الدرس', '5 د', 'كلمات جديدة ومفاهيم', cb, 'اطلب من الطلاب إعادة صياغة كل مفهوم بكلماتهم.')
    # 10 match
    colA = ''.join(abs_(120, 320 + i * 150, 780, card(P(esc(a), 34, A('blue'), True), 780, 125, ac=A('blue'))) for i, (a, _) in enumerate(mt))
    order = [2, 0, 3, 1] if len(mt) == 4 else list(range(len(mt)))
    colB = ''.join(abs_(1020, 320 + i * 150, 780, card(P(esc(mt[k][1]), 32), 780, 125, ac='#5B6472')) for i, k in enumerate(order))
    sl('blue', 'نطبق معًا', '4 د', 'أصل المفهوم بمعناه', colA + colB, 'اطلب الوصل شفهيًا ثم اكشف: ' + ' ، '.join('%s ← %s' % (a, b) for a, b in mt))
    # 11 word of the lesson
    t0, m0 = sp['concepts'][0]
    sl('rose', 'كلمة الدرس', '4 د', 'رحلتي مع «%s»' % t0, abs_(120, 320, 1680, card(P('المعنى: ' + esc(m0), 40, align='right'), 1680, 200, ac=A('rose'), extra='align-items:flex-start')) +
       abs_(120, 560, 820, card(P('✍️ أستعملها في جملة من عندي', 32, A('rose'), True), 820, 200, ac=A('rose'))) + abs_(980, 560, 820, card(P('🌍 مثال من حياتي أو مجتمعي', 32, A('rose'), True), 820, 200, ac=A('rose'))),
       'اطلب جملًا وأمثلة من الطلاب.')
    # knowledge slides
    pts = sp['points']; per = 2 if len(pts) > 4 else 2
    chunks = [pts[i:i + per] for i in range(0, len(pts), per)]
    for ci, ch in enumerate(chunks):
        sl(PALS[(ci + 2) % 8], 'بناء المعرفة', '4 د', 'نتعلم (%d/%d)' % (ci + 1, len(chunks)), _stack(ch, A(PALS[(ci + 1) % 8]), 38, avail=640),
           'اقرأوا النص من الكتاب ' + pg + ' ثم اربطوا كل نقطة بمثال.')
    # read from book
    sl('sky', 'من كتابي', '4 د', 'نقرأ النص من كتابي', abs_(120, 320, 1680, card(P('📘 أفتح كتابي: ' + esc(pg), 44, A('sky'), True, align='right'), 1680, 170, ac=A('sky'))) +
       _stack(['أضع خطًّا تحت أهم جملة في الفقرة.', 'أكتب بكلماتي فكرة رئيسة واحدة.', 'أحدد كلمة جديدة وأشرحها ' + d[0]], A('sky'), 34, top=520, avail=420, numbered=True),
       'دع الطلاب يقرؤون بصمت ثم يشاركون.')
    # think-pair-share
    sl('peach', 'فكر · زاوج · شارك', '3 د', 'أفكر مع زميلي', abs_(120, 330, 1680, card(P('❓ ' + esc(sp['case'][1]), 42, A('peach'), True, align='right'), 1680, 220, ac=A('peach'), bg='#FFF1E6')) +
       abs_(120, 580, 1680, card(P('١ أفكر وحدي ٣٠ ثانية  ·  ٢ أناقش زميلي  ·  ٣ نشارك الصف', 34, align='right'), 1680, 150, ac=A('peach'), border=False)),
       'استعمل استراتيجية فكر-زاوج-شارك.')
    # phrases
    if sp.get('phrases'):
        bd = ''.join(abs_(120, 320 + i * 150, 1680, card(P('<b>%s</b> — %s' % (esc(a), esc(bb)), 36, align='right'), 1680, 125, ac='#1B7F9E', extra='align-items:flex-start')) for i, (a, bb) in enumerate(sp['phrases'][:5]))
        sl('sky', 'عبارات السنع', '4 د', 'من عبارات السنع في الكتاب', bd, 'اطلب تمثيل موقف قصير تُقال فيه كل عبارة.')
    # true/false
    rows = ''.join(abs_(120, 300 + i * 118, 1680, card(P('%d. %s' % (i + 1, esc(s)) + '   <span style="color:#8A8475">☐ صح  ☐ خطأ</span>', 32, align='right'), 1680, 100, ac=A('rose'), pad=14, extra='align-items:flex-start')) for i, (s, _, _) in enumerate(tfs))
    sl('rose', 'نتحقق', '3 د', 'أفكر وأصحح: صح أم خطأ؟', rows, 'الإجابات: ' + ' | '.join('%d %s%s' % (i + 1, 'صح' if b else 'خطأ', ('' if b else ' (التصحيح: ' + c + ')')) for i, (_, b, c) in enumerate(tfs)))
    # group map
    gt = ['أقرأ وأستخرج الأفكار الرئيسة', 'أشرح المفاهيم بأمثلة', 'أحلل دراسة الحالة', 'أصمم مشروعًا صغيرًا']
    gb = ''.join(abs_(120 + (i % 2) * 850, 320 + (i // 2) * 300, 820, card(P('المجموعة %d' % (i + 1), 34, GC[i][0], True, True) + P(t, 36), 820, 260, ac=GC[i][0])) for i, t in enumerate(gt))
    sl('lav', 'عمل جماعي', '2 د', 'خريطة المجموعات', gb, 'وزّع بطاقات المجموعات (ملف group-work). لكل مجموعة قائد ومسجّل ومتحدث وحارس وقت.')
    # 4 group slides
    gdet = [
        ['أقرأ نقاط الكتاب (' + pg + ') وأستخرج ثلاث أفكار رئيسة.', 'أرتبها بحسب الأهمية.', 'أعرضها في جملتين ' + d[0]],
        ['أشرح مفهومين على الأقل: ' + ' · '.join(t for t, _ in sp['concepts'][:3]) + '.', 'أكتب مثالًا من الحياة لكل مفهوم.', 'أستعمل كلماتي لا نص الكتاب.'],
        ['أقرأ الحالة: ' + sp['case'][0], sp['case'][1], 'أصيغ الحل ' + d[1]],
        ['أصمم المشروع: ' + sp['proj'], 'أحدد خطوتين للتنفيذ.', 'أعرض الفكرة في دقيقة ' + d[2]]]
    for i in range(4):
        sl(PALS[(i + 4) % 8], 'عمل جماعي', '10 د', 'المجموعة %d: %s' % (i + 1, gt[i]), _stack(gdet[i], GC[i][0], 34, avail=430, top=300) +
           abs_(120, 780, 1680, card(P('👥 القائد · المسجّل · المتحدث · حارس الوقت   |   ⏱ 10 دقائق', 28, '#5B6472'), 1680, 100, ac=GC[i][0], border=False)),
           'تابع المجموعة %d وقدّم لها التغذية الراجعة.' % (i + 1))
    # verify
    sl('mint', 'نتحقق معًا', '4 د', 'نماذج الإجابة', _stack([sp['short'][0] + ' ← ' + sp['short_key'][0], sp['short'][1] + ' ← ' + sp['short_key'][1], 'الحالة ← ' + sp['case_key']], A('mint'), 34, avail=600),
       'قارن إجابات المجموعات بالنماذج وصحّح المفاهيم الخاطئة.')
    # peer feedback
    sl('gold', 'تغذية راجعة', '3 د', 'أشجّع زميلي', abs_(120, 330, 820, card(P('⭐⭐ نجمتان', 40, A('gold'), True, True) + P('أذكر شيئين أعجباني في عمل المجموعة الأخرى.', 30), 820, 330, ac=A('gold'))) +
       abs_(980, 330, 820, card(P('💭 أمنية', 40, A('gold'), True, True) + P('أقترح تحسينًا واحدًا بلطف.', 30), 820, 330, ac=A('gold'))), 'علّم الطلاب أدب النقد: نجمتان وأمنية.')
    # levels challenge
    lv = ['صحيحة أم خاطئة؟ ' + tfs[0][0], 'أصل: ' + mt[0][0] + ' بما يناسبه.', sh[0], 'ما الحل في الحالة؟ ' + sp['case'][1]]
    lb = ''.join(abs_(120 + (i % 2) * 850, 310 + (i // 2) * 320, 820, card(P('⭐ ' + LEVELS[i][0], 34, LEVELS[i][1], True, True) + P(esc(t), 28), 820, 290, ac=LEVELS[i][1], bg=LEVELS[i][2])) for i, t in enumerate(lv))
    sl('lav', 'تحدي المستويات', '10 د', 'كلٌّ في مستواه', lb, 'يختار الطالب مستواه ويحل من أوراق المستويات الأربعة (ملف worksheets).')
    # behaviour
    sl('mint', 'قيمة نعيشها', '3 د', 'من درسي إلى سلوكي', _stack(['أختار سلوكًا واحدًا من الدرس وألتزم به هذا الأسبوع.', 'أكتب متى وأين سأطبقه ' + d[2], 'أخبر أسرتي بما تعلمته.'], A('mint'), 36, avail=500, numbered=True), 'ربط الدرس بالسلوك العملي.')
    # enrichment
    sl('sand', 'إثراء', '3 د', 'هل تعلم؟', abs_(120, 330, 1680, card(P('💡 ' + esc(sp['points'][-1]), 38, align='right'), 1680, 420, ac=A('sand'), extra='align-items:flex-start')), 'من الكتاب: نقطة إثرائية للتوسع.')
    # quick quiz
    qz = []
    for q_, o, c_ in mc: qz.append('%s   أ) %s   ب) %s   ج) %s' % (q_, o[0], o[1], o[2]))
    qz.append(sh[1])
    sl('rose', 'تحدي حراء', '3 د', 'تحدي حراء السريع: 4 أسئلة', _stack(qz, A('rose'), 32, numbered=True, avail=620), 'الإجابات: ' + ' | '.join('%d) %s' % (i + 1, o[c_]) for i, (_, o, c_) in enumerate(mc)) + ' | ' + sp['short_key'][1])
    # post progress
    sl('mint', 'قياس التقدم', '2 د', 'كم تعلمت؟ (بعد الدرس)', _stack([o + '   ☐ لا أعرف  ☐ أعرف قليلًا  ☐ أعرف جيدًا' for o in outs], A('mint'), 34, avail=560, numbered=True), 'قارن مع القياس القبلي ووضّح التقدم.')
    # exit ticket
    sl('gold', 'الختام', '4 د', 'بطاقة الخروج', abs_(120, 330, 1680, card(P('✍️ أكتب ثلاث نقاط تعلمتها اليوم، وسلوكًا واحدًا سأطبقه هذا الأسبوع.', 40, align='right'), 1680, 260, ac='#8A5A1E', extra='align-items:flex-start')) +
       abs_(120, 640, 1680, card(P('📌 مشروعي: ' + esc(sp['proj']), 34, '#8A5A1E', True, align='right'), 1680, 220, ac='#8A5A1E', bg='#FFF6DD')), 'اجمع التذاكر. ارجع إلى توقعات لحظة الفضول. المشروع واجب اختياري للمستوى الماسي.')
    # mirror + home
    sl('lav', 'مرآة التعلم', '2 د', 'ماذا تعلمت؟', _stack(['تعلمت ...', 'أدهشني ...', 'أريد أن أعرف أكثر عن ...'], A('lav'), 38, avail=420) , 'يكمل الطلاب الجمل شفهيًا أو كتابيًا.')
    sl('sand', 'مع أسرتي', '', 'رسالتي إلى البيت', _stack(['أسأل أسرتي عن موقف من السنع مر بهم في موضوع الدرس.', 'أشاركهم ما تعلمته اليوم: ' + sp['title'], 'نتفق على سلوك واحد نطبقه معًا.'], A('sand'), 36, avail=520, numbered=True), 'رسالة أسرية قصيرة.')
    return K.build(out, T, lesson_id, S)

def run(sp, y, ids):
    code = 'SN-Y%d-%s' % (y, sp['stem']); sp = dict(sp); sp['code'] = code
    out = ROOT + '/resources/ssd/%s/' % code; os.makedirs(out, exist_ok=True)
    W = lambda f, s: open(out + f, 'w', encoding='utf8').write(s)
    W('worksheets-A4.html', worksheets(sp, y)); W('pod-sheet.html', pod(sp, y)); W('sources-concept-card.html', sources(sp, y))
    W('group-work.html', group(sp, y)); W('answer-key.html', key(sp, y))
    k = deck(sp, y, ids[code], out + 'teacher-deck.html')
    print(code, 'slides', k)
