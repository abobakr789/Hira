"""Sanaa decks v5 (2026-11-23): redesign 4 slide types in place, keeping slide count/order.
  1. Progress before/after -> rows with clickable vote buttons (1-5 for Y5-12, faces for Y1-4), saved per device.
  2. Hiraa quick challenge -> numbered rows, options under the question, «الإجابة» chip reveals the answer per question.
  3. Group slides -> IE style: task bar, core task (everyone), bigger challenge, product/roles/support; boxes build in one by one.
  4. Levels -> Arabic-deck style level cards with right accent border + bottom bar.
Replaced slides get id suffix 'n' so stale saved teacher edits for the old layout are not applied to the new one
(edits on every other slide are untouched). Idempotent: skips decks already marked v5.
Usage: python3 -I upgrade_decks5.py [filter ...]"""
import re, glob, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sn5_lib import sections, split, ps, plain, norm

ROOT = '/home/claude/hira/resources/ssd/'
MARK = '<!--sn-v5-->'
FT = "font-family:'Thmanyah Text','Cairo',Tahoma,sans-serif;"
FD = "font-family:'Thmanyah Display','Cairo',Tahoma,sans-serif;"
LV = [('#9A5A26', '#F7E9DC'), ('#5E6672', '#EDEFF2'), ('#A87A0C', '#FBF1D3'), ('#6B46A8', '#EEE7FA')]
QC = ['#9A5A26', '#2F6A9A', '#2E7D5B', '#B4483F', '#6B46A8']
LET = ['أ', 'ب', 'ج', 'د']

CSS = ('<style>' + MARK +
       '.pv{border:0;border-radius:18px;font-weight:800;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1;cursor:pointer;' + FT + '}'
       '.pv .pc{font-size:22px;color:#1F2A3C;margin-top:6px}'
       '.pr{' + FT + 'font-size:24px;border:2px solid #C9D2DD;background:#fff;border-radius:22px;padding:6px 22px;cursor:pointer}'
       '.qa{' + FT + 'flex:none;border:0;border-radius:20px;padding:12px 26px;font-size:28px;font-weight:800;background:#DDF2E6;color:#1E6B47;cursor:pointer;min-width:150px}'
       '.qa .q1{display:none}.qrow.on .qa .q0{display:none}.qrow.on .qa .q1{display:inline}'
       '.qrow.on .qok{background:#DDF2E6!important;outline:3px solid #2E7D5B}'
       '.qopen{display:none!important}.qrow.on .qopen{display:block!important}'
       '</style>')
JS = ('<script>(function(){document.querySelectorAll(".sl").forEach(function(sl){var bs=sl.querySelectorAll(".pv");if(!bs.length)return;'
      'var KK="hiraa-prog-"+location.pathname+"-"+sl.id,sv={};try{sv=JSON.parse(localStorage.getItem(KK)||"{}")}catch(e){}'
      'function paint(){bs.forEach(function(b){var k=b.dataset.q+"_"+b.dataset.v;b.querySelector(".pc").textContent=sv[k]||0;b.style.outline=sv[k]?"3px solid rgba(31,42,60,.25)":"none"})}'
      'function save(){try{localStorage.setItem(KK,JSON.stringify(sv))}catch(e){}}'
      'bs.forEach(function(b){b.addEventListener("click",function(e){e.stopPropagation();var k=b.dataset.q+"_"+b.dataset.v;sv[k]=(sv[k]||0)+1;save();paint();})});'
      'var r=sl.querySelector(".pr");if(r)r.addEventListener("click",function(e){e.stopPropagation();sv={};save();paint();});paint();});})();</script>')


def box(top, inner, gap=18):
    return ('<div style="position:absolute;right:120px;top:%dpx;width:1680px;display:flex;flex-direction:column;gap:%dpx">%s</div>' % (top, gap, inner))


def accent(head):
    m = re.search(r'class="hbar" style="[^"]*background:(#[0-9A-Fa-f]{3,6})', head)
    return m.group(1) if m else '#5546A3'


# ------------------------------------------------------------------ 1. progress
def progress(head, body, y, after):
    pp = ps(body)
    if y >= 5:
        stm = [re.sub(r'^\d+\.\s*', '', re.sub(r'\s+لا أعرف\s+أعرف قليلًا\s+أعرف جيدًا\s*$', '', plain(x))).strip() for fs, x in pp]
        badges = [str(k + 1) for k in range(len(stm))]
        scale = ['1', '2', '3', '4', '5']
        intro = ('أعيد تقييم نفسي، وأقارن ببداية الحصة: في أي معيار تقدّمت أكثر؟' if after else 'أقيّم نفسي في كل معيار: أنقر رقمًا، وكل نقرة صوت واحد.')
        legend = '1 = لم أتعلمه بعد · 3 = أعرفه جزئيًا · 5 = أتقنه وأستطيع شرحه'
    else:
        intro_old = plain(pp[0][1]) if pp else ''
        stm = [plain(x) for fs, x in pp[1:] if fs < 40]
        badges = [plain(x) for fs, x in pp[1:] if fs >= 40]
        scale = ['😟', '🙂', '😀']
        intro = ('أَخْتارُ الْوَجْهَ مَرَّةً أُخْرى، وَأُقارِنُ بِبِدايَةِ الْحِصَّةِ.' if after else 'أَنْقُرُ الْوَجْهَ الَّذي يُشْبِهُني، وَكُلُّ نَقْرَةٍ صَوْتٌ واحِدٌ.')
        legend = '😟 لا أَعْرِفُ بَعْدُ · 🙂 أَعْرِفُ قَليلًا · 😀 أَعْرِفُ جَيِّدًا'
    rows = ''
    for k, s in enumerate(stm):
        c, bg = LV[k % 4]
        btns = ''.join('<button class="pv" data-ia data-q="%d" data-v="%d" style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:%dpx;height:100px;background:%s;color:%s;font-size:%dpx"><span>%s</span><span class="pc">0</span></button>'
                       % (k, v, 86 if y >= 5 else 104, bg, c, 38 if y >= 5 else 44, lab) for v, lab in enumerate(scale))
        bd = badges[k] if k < len(badges) else str(k + 1)
        bstyle = ('width:62px;height:62px;border-radius:31px;background:%s;color:#fff;font-size:32px' % c) if y >= 5 else ('min-width:62px;font-size:34px;color:%s' % c)
        rows += ('<div data-build-in="pop %d" style="display:flex;flex-direction:row;align-items:center;gap:22px;background:#fff;border-radius:26px;border-right:10px solid %s;padding:20px 28px;box-shadow:0 8px 22px rgba(31,42,60,.07)">'
                 '<div style="%s;font-weight:800;display:flex;align-items:center;justify-content:center;flex:none">%s</div>'
                 '<p style="%sflex:1;font-size:37px;color:#1F2A3C;text-align:right">%s</p><div style="display:flex;flex-direction:row;gap:12px;flex:none;direction:rtl">%s</div></div>'
                 ) % (k + 1, c, bstyle, bd, FT, s, btns)
    foot = ('<div style="display:flex;flex-direction:row;align-items:center;justify-content:center;gap:28px"><p style="%sfont-size:28px;color:#6B7585">%s</p>'
            '<button class="pr" data-ia>↺ تصفير العدّ</button></div>') % (FT, legend)
    top = '<p style="%sfont-size:34px;color:#5B6472;text-align:right">%s</p>' % (FT, intro)
    return box(275, top + rows + foot, 22)


# ------------------------------------------------------------------ 2. quick challenge
def quick(head, body, rest, y):
    pp = ps(body)
    qs = []
    if y >= 5:
        mb = re.search(r'<div class="mabox".*?</div>', rest, re.S)
        ans = [plain(x) for x in re.findall(r'<p>(.*?)</p>', mb.group(0), re.S)] if mb else []
        ansd = {}
        free = [a for a in ans if not re.match(r'^\d+\)', a)]
        for a in ans:
            m = re.match(r'^(\d+)\)\s*(.*)$', a)
            if m: ansd[int(m.group(1))] = m.group(2).strip()
        for fs, x in pp:
            t = plain(x)
            m = re.match(r'^(\d+)\.\s*(.*)$', t)
            n, t = (int(m.group(1)), m.group(2)) if m else (len(qs) + 1, t)
            parts = re.split(r'\s+(?=[أبجد]\)\s)', t)
            q = parts[0].strip()
            opts = [re.sub(r'^[أبجد]\)\s*', '', p).strip() for p in parts[1:]]
            if opts:
                a = ansd.get(n, '')
                idx = next((j for j, o in enumerate(opts) if norm(o) == norm(a)), None)
                if idx is None:
                    idx = next((j for j, o in enumerate(opts) if norm(a) and (norm(a) in norm(o) or norm(o) in norm(a))), None)
                qs.append((q, opts, idx, None))
            else:
                qs.append((q, [], None, free.pop(0) if free else None))
    else:
        mb = re.search(r'<div class="mabox".*?</div>', rest, re.S)
        letters = dict((int(a), b) for a, b in re.findall(r'(\d+)\s*:\s*([أبجد])', plain(mb.group(0)) if mb else ''))
        cur = None
        for fs, x in pp:
            t = plain(x)
            if fs >= 34 and re.match(r'^\d+$', t):
                cur = [int(t), '', []]; qs.append(cur)
            elif cur is not None and fs == 30:
                cur[1] = t
            elif cur is not None and fs == 24:
                cur[2].append(t)
        q2 = []
        for n, q, o in qs:
            tick = next((j for j, x in enumerate(o) if x.rstrip().endswith('✓')), None)
            o = [x.replace('✓', '').strip() for x in o]
            idx = tick if tick is not None else (LET.index(letters[n]) if n in letters and LET.index(letters[n]) < len(o) else None)
            if idx is None and 'دائمًا الخيار الأول' in rest and o:
                r = n % len(o)
                want = o[0]; o = o[-r:] + o[:-r] if r else o; idx = o.index(want)
            q2.append((q, o, idx, None))
        qs = q2
    rows = ''
    for k, (q, opts, idx, free) in enumerate(qs):
        c = QC[k % 5]
        ops = ''.join('<span class="%s" style="display:inline-flex;align-items:center;gap:8px;margin-left:18px;padding:4px 12px 4px 16px;border-radius:16px;background:#F6F2EC">'
                      '<span style="width:34px;height:34px;border-radius:17px;background:#FBE3D3;color:#B4483F;font-size:22px;font-weight:800;display:inline-flex;align-items:center;justify-content:center">%s</span>'
                      '<span style="%sfont-size:29px;color:#3E4A5C">%s</span></span>' % ('qok' if j == idx else '', LET[j], FT, o) for j, o in enumerate(opts))
        under = ('<div style="display:flex;flex-direction:row;flex-wrap:wrap;row-gap:8px">%s</div>' % ops) if opts else (
            '<p class="qopen" style="%sfont-size:29px;color:#1E6B47;background:#DDF2E6;border-radius:14px;padding:8px 16px;text-align:right">%s</p>' % (FT, free) if free else '')
        chip = LET[idx] if idx is not None else ('✓' if free else '')
        btn = ('<button class="qa" data-ia onclick="this.closest(\'.qrow\').classList.toggle(\'on\')"><span class="q0">الإجابة</span><span class="q1">%s</span></button>' % chip) if chip else ''
        rows += ('<div class="qrow" style="display:flex;flex-direction:row;align-items:center;gap:22px;background:#fff;border-radius:24px;border-right:9px solid %s;padding:18px 26px;box-shadow:0 8px 22px rgba(31,42,60,.07)">'
                 '<div style="width:62px;height:62px;border-radius:31px;background:%s;color:#fff;font-size:32px;font-weight:800;display:flex;align-items:center;justify-content:center;flex:none">%d</div>'
                 '<div style="flex:1;display:flex;flex-direction:column;gap:10px"><p style="%sfont-size:35px;font-weight:700;color:#1F2A3C;text-align:right">%s</p>%s</div>%s</div>'
                 ) % (c, c, k + 1, FT, q, under, btn)
    return box(275, rows, 18), len(qs), sum(1 for q in qs if q[2] is None and not q[3])


# ------------------------------------------------------------------ 3. groups
GA = {1: ('أرتّب الأفكار في خريطة ذهنية، وأحدد الفكرة التي يقوم عليها الدرس، وأعلل اختياري.', 'قائمة مرتّبة بالأفكار'),
      2: ('أذكر لكل مفهوم سلوكًا يخالفه، وأبيّن أثره في المجتمع.', 'بطاقات مفاهيم بأمثلة'),
      3: ('أقترح حلّين للحالة، وأوازن بينهما، وأختار الأفضل بدليل من الكتاب.', 'حلّ معلّل للحالة'),
      4: ('أتوقع عقبة قد تواجه المشروع، وأقترح طريقة لتجاوزها.', 'خطة مشروع قصيرة')}


def group(head, body, y, num, title):
    pp = ps(body)
    c = accent(head)
    if y >= 5:
        tasks = [plain(x) for fs, x in pp if fs >= 34]
        roles = next((plain(x).split('|')[0].strip() for fs, x in pp if 'القائد' in x), 'القائد · المسجّل · المتحدث · حارس الوقت')
        chal, prod = GA.get(num, ('', ''))
        m = re.search(r'\(ص ([^)]+)\)', ' '.join(tasks))
        sup = ('نص الكتاب (ص %s) وشرائح «نتعلم»' % m.group(1)) if m else 'شرائح «نتعلم» ونص الكتاب'
        lab = ('مهمة الجميع', 'تحدٍّ أكبر', 'الناتج', 'الأدوار', 'الدعم')
    else:
        tasks, chal = [], ''
        k = 0
        while k < len(pp):
            fs, x = pp[k]
            t = plain(x)
            if 'تحدي' in norm(t) or 'تَحَدّي' in t:
                if k + 1 < len(pp): chal = plain(pp[k + 1][1])
                k += 2; continue
            tasks.append(t); k += 1
        roles = '🧭 الْقائِدُ · ✏️ الرَّسّامُ · 🗣️ الْمُتَحَدِّثُ · ⏰ حارِسُ الْوَقْتِ'
        prod, sup = '', 'كِتابي وَشَرائِحُ الدَّرْسِ'
        lab = ('مَهَمَّةُ الْجَميعِ', '★ تَحَدّي الْأَبْطالِ', 'النّاتِجُ', 'الْأَدْوارُ', 'الدَّعْمُ')
    bar = ''
    _unused = ('<div data-build-in="pop 1" style="background:#fff;border-right:10px solid %s;border-radius:18px;padding:18px 30px;display:flex"><p style="%sfont-size:32px;font-weight:700;text-align:right">%s</p></div>'
           % (c, FT, title))
    core = ('<div data-build-in="pop 2" style="flex:1;background:#fff;border-radius:22px;padding:22px 28px;display:flex;flex-direction:column;gap:12px;align-items:flex-start">'
            '<p style="%sfont-size:28px;color:%s;background:#F5EFE6;padding:4px 18px;border-radius:14px">%s</p>%s</div>'
            % (FT, c, lab[0], ''.join('<p style="%sfont-size:34px;color:#1F2A3C;text-align:right;line-height:1.55">%d. %s</p>' % (FT, n, t) for n, t in enumerate(tasks, 1))))
    big = ('<div data-build-in="pop 3" style="flex:1;background:#FFF0C2;border:3px dashed #D7A33B;border-radius:22px;padding:22px 28px;display:flex;flex-direction:column;gap:12px;align-items:flex-start">'
           '<p style="%sfont-size:28px;color:#fff;background:#A8741F;padding:4px 18px;border-radius:14px">%s</p><p style="%sfont-size:36px;color:#1F2A3C;text-align:right;line-height:1.55">%s</p></div>'
           % (FT, lab[1] if y < 5 else '★ ' + lab[1], FT, chal)) if chal else ''
    cells = []
    if prod: cells.append((lab[2], prod))
    cells += [(lab[3], roles), (lab[4], sup)]
    bottom = ''.join('<div data-build-in="pop %d" style="flex:1;background:#fff;border-radius:18px;padding:20px 26px;display:flex"><p style="%sfont-size:29px;color:#1F2A3C;text-align:right"><b style="color:%s">%s:</b> %s</p></div>'
                     % (4 + i, FT, c, a, b) for i, (a, b) in enumerate(cells))
    inner = ('<div style="display:flex;flex-direction:row;gap:24px;min-height:430px">%s%s</div>' % (core, big) +
             '<div style="display:flex;flex-direction:row;gap:22px">%s</div>' % bottom)
    return box(280, inner, 24)


# ------------------------------------------------------------------ 4. levels
SUBA = {'برونزي': 'أتذكّر وأتعرّف', 'فضي': 'أفهم وأربط', 'ذهبي': 'أشرح وأطبّق', 'ماسي': 'أحلّل وأقيّم'}


def levels(head, body, y):
    pp = ps(body)
    cards, extra = [], ''
    if y >= 5:
        k = 0
        while k < len(pp):
            name = plain(pp[k][1]); items = []
            k += 1
            while k < len(pp) and pp[k][0] < 34:
                items.append(plain(pp[k][1])); k += 1
            cards.append((name, SUBA.get(norm(name).strip(), ''), items))
        extra = 'أختار مستواي وأحلّ من ورقة العمل، ومن ينتهي ينتقل إلى المستوى التالي.'
    else:
        k = 0
        while k < len(pp):
            fs, x = pp[k]; t = plain(x)
            if fs >= 44:
                stars = t; name = plain(pp[k + 1][1]) if k + 1 < len(pp) else ''
                items = []; k += 2
                while k < len(pp) and pp[k][0] == 28:
                    items.append(plain(pp[k][1]).replace('✏️', '').strip()); k += 1
                cards.append((stars + ' ' + name, '', items))
            else:
                extra = t; k += 1
    n = len(cards)
    out = ''
    for i, (name, sub, items) in enumerate(cards):
        c, bg = LV[i % 4]
        out += ('<div data-build-in="pop %d" style="flex:1;background:#fff;border-radius:26px;border-right:8px solid %s;padding:24px 26px;display:flex;flex-direction:column;gap:12px;box-shadow:0 8px 22px rgba(31,42,60,.07);min-height:%dpx">'
                '<p style="%sfont-size:40px;font-weight:800;color:%s;text-align:right">%s</p>%s%s</div>'
                ) % (i + 1, c, 460, FD, c, name,
                     ('<p style="%sfont-size:27px;color:#6B7585;text-align:right">%s</p>' % (FT, sub)) if sub else '',
                     ''.join('<p style="%sfont-size:%dpx;color:#1F2A3C;text-align:right;line-height:1.5">%s</p>' % (FT, 34 if n <= 3 else 33, t) for t in items))
    ex = ('<div data-build-in="pop %d" style="background:#fff;border-right:8px solid #2F6A9A;border-radius:26px;padding:20px 28px;display:flex;box-shadow:0 8px 22px rgba(31,42,60,.07)">'
          '<p style="%sfont-size:33px;color:#9A5A26;font-weight:700;text-align:right">%s</p></div>' % (n + 1, FT, ('🏆 ' if y >= 5 else '') + extra)) if extra else ''
    return box(285, '<div style="display:flex;flex-direction:row;gap:24px">%s</div>%s' % (out, ex), 26)


# ------------------------------------------------------------------ driver
def process(f):
    y = int(re.search(r'SN-Y(\d+)-', f).group(1))
    t = open(f, encoding='utf-8').read()
    if MARK in t:
        return 0, []
    warn = []
    out, pos = [], 0
    for m in sections(t):
        sec = m.group(0)
        h2m = re.search(r'<h2[^>]*>(.*?)</h2>', sec, re.S)
        if not h2m:
            continue
        h = norm(plain(h2m.group(1)))
        kind = None
        if 'أين أنا الآن' in h or 'قياس التقدم: قبل' in h: kind = 'p1'
        elif 'كم تعلمت' in h or 'قياس التقدم: بعد' in h: kind = 'p2'
        elif re.match(r'المجموعة \d', h): kind = 'g'
        elif 'في مستواه' in h: kind = 'lv'
        elif 'تحدي حراء السريع' in h: kind = 'qk'
        if not kind:
            continue
        head, body, rest = split(sec)
        if kind in ('p1', 'p2'):
            nb = progress(head, body, y, kind == 'p2')
        elif kind == 'qk':
            nb, nq, miss = quick(head, body, rest, y)
            rest = re.sub(r'(<aside>)[^<]*دائمًا الخيار الأول[^<]*(</aside>)', r'\1اقرأ السؤال ودع الطلاب يجيبون على ألواحهم، ثم انقر «الإجابة» عند كل سؤال لكشفها.\2', rest)
            if miss: warn.append('quick: %d unanswered of %d' % (miss, nq))
        elif kind == 'g':
            num = int(re.search(r'المجموعة (\d)', h).group(1))
            title = plain(h2m.group(1)).split(':', 1)[-1].strip()
            nb = group(head, body, y, num, title)
        else:
            nb = levels(head, body, y)
        head = re.sub(r'id="([^"]+)"', lambda mm: 'id="%sn"' % mm.group(1), head, count=1)
        out.append(t[pos:m.start()]); out.append(head + nb + rest); pos = m.end()
    out.append(t[pos:])
    t = ''.join(out)
    t = t.replace('</head>', CSS + '</head>', 1) if '</head>' in t else CSS + t
    i = t.rfind('</body>')
    t = t[:i] + JS + t[i:]
    open(f, 'w', encoding='utf-8').write(t)
    return 1, warn


if __name__ == '__main__':
    flt = sys.argv[1:]; n = c = 0
    for f in sorted(glob.glob(ROOT + 'SN-*/teacher-deck.html')):
        if flt and not any(x in f for x in flt): continue
        n += 1
        k, w = process(f); c += k
        if w: print(f.split('/')[-2], w)
    print(n, c)
