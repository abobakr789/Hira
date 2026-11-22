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
         8: ('وأستشهد بالكتاب وأعلل.', 'وأحلل الموقف وأقيّم السلوك.', 'وأصمم مبادرة وأحدد مؤشر نجاحها.')}

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
def deck(sp, y, lesson_id, out):
    S = []; foot = 'حراء · السنع الإماراتي · الصف %s' % GN[y]; n = [0]; T = sp['title']
    def sl(pal, badge, mins, title, body, notes):
        n[0] += 1; S.append(frame('s%d' % n[0], pal, badge, mins, title, body, notes, foot))
    d = DEPTH[y]
    # 1 cover
    sl('sand', sp['unit'], '', T, abs_(120, 380, 1680, card(P(esc(sp['obj']), 44, bold=True, display=True) + P('من كتاب الطالب ' + esc(sp['pages']) + ' · الصف ' + GN[y], 30, '#5B6472'), 1680, 360, ac='#B0782A'), 'justify-content:center'),
       'ترحيب. اعرض عنوان الدرس والهدف. الوقت الكلي: حصة واحدة.')
    # 2 warm-up
    sl('blue', 'تمهيد', '5 د', 'أبدأ بسؤال', abs_(120, 330, 1680, card(P(esc(sp['warm']), 42, align='right'), 1680, 300, ac='#2F6A9A', extra='align-items:flex-start')) +
       abs_(120, 680, 1680, card(P('أناقش مع زميلي دقيقة ثم نشارك الصف.', 32, '#5B6472', align='right'), 1680, 130, ac='#2F6A9A', border=False)),
       'اطلب إجابات حرة قبل فتح الكتاب. لا تصحح الآن.')
    # 3-4 points
    pts = sp['points']; per = 3 if len(pts) <= 6 else 4
    chunks = [pts[i:i + per] for i in range(0, len(pts), per)]
    for ci, ch in enumerate(chunks):
        body = ''
        for i, p in enumerate(ch):
            body += abs_(120, 300 + i * 190, 1680, card(P(esc(p), 36, align='right'), 1680, 160, ac=K.PAL[PALS[(ci + 1) % 8]][1], extra='align-items:flex-start'))
        sl(PALS[(ci + 2) % 8], 'من الكتاب', '10 د', 'ماذا يقول الكتاب؟ (%d/%d)' % (ci + 1, len(chunks)), body,
           'اقرأوا النص من الكتاب ' + sp['pages'] + ' ثم اربطوا كل نقطة بمثال.')
    # concepts
    cb = ''
    for i, (t, m) in enumerate(sp['concepts']):
        cb += abs_(120 + i * 560, 330, 520, card(P(esc(t), 48, K.PAL[PALS[i]][1], True, True) + P(esc(m), 32), 520, 420, ac=K.PAL[PALS[i]][1]))
    sl('mint', 'مفاهيم', '5 د', 'كلماتي ومفاهيمي', cb, 'اطلب من الطلاب إعادة صياغة كل مفهوم بكلماتهم.')
    # phrases/quote slide
    if sp.get('phrases'):
        bd = ''.join(abs_(120, 300 + i * 150, 1680, card(P('<b>%s</b> — %s' % (esc(a), esc(bb)), 34, align='right'), 1680, 125, ac='#1B7F9E', extra='align-items:flex-start')) for i, (a, bb) in enumerate(sp['phrases'][:5]))
        sl('sky', 'عبارات السنع', '5 د', 'من عبارات السنع في الكتاب', bd, 'العبارات بنصها من الكتاب. اطلب تمثيل موقف قصير تُقال فيه كل عبارة.')
    # case
    sl('rose', 'تطبيق', '8 د', 'دراسة حالة', abs_(120, 330, 1680, card(P(esc(sp['case'][0]), 38, align='right'), 1680, 330, ac='#B4483F', extra='align-items:flex-start')) +
       abs_(120, 700, 1680, card(P('❓ ' + esc(sp['case'][1]) + ' ' + esc(d[1]), 36, '#B4483F', True, align='right'), 1680, 190, ac='#B4483F', bg='#FDF1F0')), 'ناقشوا الحالة في أزواج ثم اعرضوا الحلول.')
    # group
    gb = ''
    gt = ['اقرأ واستخرج الأفكار الرئيسة', 'اشرح المفاهيم بأمثلة', 'حلّل دراسة الحالة', 'صمّم مشروعًا صغيرًا']
    for i, t in enumerate(gt):
        gb += abs_(120 + (i % 2) * 850, 320 + (i // 2) * 300, 820, card(P('المجموعة %d' % (i + 1), 34, GC[i][0], True, True) + P(t, 36), 820, 260, ac=GC[i][0]))
    sl('lav', 'عمل جماعي', '10 د', 'العمل الجماعي: أربع مجموعات', gb, 'وزّع بطاقات المجموعات (ملف group-work). لكل مجموعة قائد ومسجّل ومتحدث وحارس وقت.')
    # exit
    sl('gold', 'الختام', '5 د', 'تذكرة الخروج', abs_(120, 330, 1680, card(P('✍️ أكتب ثلاث نقاط تعلمتها اليوم، وسلوكًا واحدًا سأطبقه هذا الأسبوع.', 40, align='right'), 1680, 260, ac='#8A5A1E', extra='align-items:flex-start')) +
       abs_(120, 640, 1680, card(P('📌 مشروعي: ' + esc(sp['proj']), 34, '#8A5A1E', True, align='right'), 1680, 220, ac='#8A5A1E', bg='#FFF6DD')), 'اجمع التذاكر. المشروع واجب اختياري للمستوى الماسي.')
    return K.build(out, T, lesson_id, S)

def run(sp, y, ids):
    code = 'SN-Y%d-%s' % (y, sp['stem']); sp = dict(sp); sp['code'] = code
    out = ROOT + '/resources/ssd/%s/' % code; os.makedirs(out, exist_ok=True)
    W = lambda f, s: open(out + f, 'w', encoding='utf8').write(s)
    W('worksheets-A4.html', worksheets(sp, y)); W('pod-sheet.html', pod(sp, y)); W('sources-concept-card.html', sources(sp, y))
    W('group-work.html', group(sp, y)); W('answer-key.html', key(sp, y))
    k = deck(sp, y, ids[code], out + 'teacher-deck.html')
    print(code, 'slides', k)
