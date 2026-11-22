"""Idempotent upgrade of resources/ssd/SN-*/teacher-deck.html:
 1) style + wire the model-answer button (mabtn/mabox) and add it to every slide whose aside carries answers
 2) Y5-12: add a «أنا مواطن إيجابي» slide (new id 'wt', existing ids untouched so saved teacher edits stay valid)
 3) staggered entrance (rs / stag) on content blocks
Run: python3 -I upgrade_decks.py [glob-substring ...]
"""
import re, glob, sys, html

ROOT = '/home/claude/hira/resources/ssd/'
CSS = """
.mabtn{position:absolute;right:120px;bottom:56px;z-index:6;font:inherit;font-size:28px;font-weight:700;background:#FFD23F;color:#3A2A00;border:0;border-radius:999px;padding:12px 28px;cursor:pointer;box-shadow:0 10px 24px rgba(0,0,0,.18);animation:ma-pulse 2.6s infinite}
@keyframes ma-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
.mabox{position:absolute;left:90px;right:90px;bottom:136px;z-index:7;background:#FFFDF3;border:3px solid #FFD23F;border-radius:30px;padding:26px 36px;font-size:32px;line-height:1.75;color:#1F2A3C;box-shadow:0 26px 60px rgba(0,0,0,.22);opacity:0 !important;visibility:hidden;transform:translateY(30px) scale(.97) !important;pointer-events:none;transition:opacity .45s cubic-bezier(.2,.8,.2,1),transform .45s cubic-bezier(.2,.8,.2,1),visibility .45s;max-height:620px;overflow:auto;text-align:start}
.mabox.on,.mabtn:hover + .mabox,.mabox:hover{opacity:1 !important;visibility:visible;transform:none !important;pointer-events:auto}
.mabox b{display:block;color:#8A6400;margin-bottom:6px}
.mabox p{margin:0 0 8px;font-size:32px;color:#1F2A3C}
.sl.on .rs{animation:rise .8s cubic-bezier(.2,.7,.2,1) both}
@media (prefers-reduced-motion:reduce){.sl.on .rs{animation:none}.mabtn{animation:none}}
/*upg1*/
"""

def sections(s):
    return list(re.finditer(r'<section class="sl".*?</section>', s, re.S))

def title(sec):
    m = re.search(r'<h2[^>]*>(.*?)</h2>', sec, re.S)
    return re.sub(r'<[^>]+>', '', m.group(1)).strip() if m else ''

def aside(sec):
    m = re.search(r'<aside>(.*?)</aside>', sec, re.S)
    return m.group(1) if m else ''

def answers_rows(sec_title, a):
    """turn the aside into answer rows; None when it carries no answers"""
    if not re.search(r'الإجابات|اكشف', a):
        return None
    t = a
    m = re.search(r'(?:الإجابات(?: بالترتيب[^:]*)?|اكشف)\s*:\s*(.*)$', t, re.S)
    if not m:
        return None
    body = m.group(1).strip().rstrip('.')
    if ' | ' in body:
        rows = body.split(' | ')
    elif ' · ' in body:
        rows = body.split(' · ')
    else:
        rows = [x for x in body.split(' ، ')]
    rows = [r.strip() for r in rows if r.strip()]
    if len(rows) == 1:
        rows = [x.strip() for x in re.split(r'\s+(?=\d\)\s)', rows[0]) if x.strip()]
    # un-numbered items from the guess/predict slides: number them
    if not any(re.match(r'\d', r) for r in rows) and '←' not in body and len(rows) > 1:
        rows = [f'{i+1}) {r}' for i, r in enumerate(rows)]
    return rows

def add_answers(sec):
    if 'mabtn' in sec:
        return sec, False
    t = title(sec)
    if 'نماذج الإجابة' in t or 'نَماذِجُ الْإِجابَةِ' in t:
        return sec, False
    rows = answers_rows(t, aside(sec))
    if not rows:
        return sec, False
    ans = ''.join('<p>%s</p>' % r for r in rows)
    btn = ('<button class="mabtn" data-ia onclick="this.nextElementSibling.classList.toggle(\'on\')">الإجابة النموذجية</button>'
           '<div class="mabox" data-ia onclick="this.classList.remove(\'on\')"><b>الإجابة النموذجية</b>' + ans + '</div>')
    i = sec.rfind('<aside>')
    sec = sec[:i] + btn + sec[i:]
    # the old guess slide printed the answers in small grey text «(للمعلم)» on the slide itself
    sec = re.sub(r'(<p style="[^"]*)("[^>]*>المصطلحات: [^<]*\(للمعلم\)</p>)', r'\1;display:none\2', sec)
    return sec, True

def stagger(sec):
    if ' rs' in sec or 'class="stag' in sec or ' stag' in sec.split('>', 1)[0]:
        return sec, False
    # direct-child absolute blocks (depth-aware scan)
    head_end = sec.find('>') + 1
    body = sec[head_end:-10]
    out, i, depth, idx, changed = [], 0, 0, 0, False
    blocks = []
    pos = 0
    for m in re.finditer(r'<(/?)(div|section|aside|button|svg)\b[^>]*?(/?)>', body):
        if m.group(1) == '':
            if depth == 0 and m.group(2) == 'div':
                blocks.append(m.start())
            depth += 1
        else:
            depth -= 1
    cands = []
    for st in blocks:
        tag = re.match(r'<div\b[^>]*>', body[st:]).group(0)
        sty = re.search(r'style="([^"]*)"', tag)
        sty = sty.group(1) if sty else ''
        if 'orb' in tag or 'position:absolute' not in sty:
            continue
        mt = re.search(r'top:(\d+(?:\.\d+)?)px', sty)
        if not mt or float(mt.group(1)) < 250 or 'bottom:' in sty or 'transform' in sty or 'data-build-in' in tag:
            continue
        cands.append((st, tag, sty))
    if not cands:
        return sec, False
    # apply from the end so offsets stay valid
    new = body
    n = len(cands)
    for k in range(n - 1, -1, -1):
        st, tag, sty = cands[k]
        if n == 1:
            t2 = tag.replace('<div ', '<div class="stag" ', 1)
        else:
            d = round(min(k, 6) * 0.12, 2)
            if 'class="' in tag:
                t2 = tag.replace('class="', 'class="rs ', 1)
            else:
                t2 = tag.replace('<div ', '<div class="rs" ', 1)
            t2 = t2.replace('style="', 'style="animation-delay:%ss;' % d, 1)
        new = new[:st] + t2 + new[st + len(tag):]
    return sec[:head_end] + new + sec[-10:], True

def build_wt(sec_src, obj):
    """clone the look of «من درسي إلى سلوكي» and write the national-citizen slide"""
    head = sec_src[:sec_src.find('<div style="position:absolute;right:120px;top:300px')]
    head = re.sub(r'id="s\d+"', 'id="wt"', head, count=1)
    head = head.replace('قيمة نعيشها', 'أنا مواطن إيجابي', 1).replace('من درسي إلى سلوكي', 'من درسي إلى وطني', 1)
    acc = re.search(r'border:3px solid (#[0-9A-Fa-f]{3,6})', sec_src).group(1)
    foot = re.search(r'<div style="position:absolute;left:120px;bottom:44px.*?</div>', sec_src, re.S).group(0)
    def card(top, h, txt, num=None, bold=False, bg='#fff', fs=36):
        n = f'<b style="color:{acc}">{num}.</b> ' if num else ''
        w = 'font-weight:700;' if bold else ''
        return (f'<div class="rs" style="animation-delay:{(top-300)/1500:.2f}s;position:absolute;right:120px;top:{top}px;width:1680px;display:flex;">'
                f'<div style="width:1680px;height:{h}px;background:{bg};border:3px solid {acc};border-radius:30px;padding:26px;box-shadow:0 10px 28px rgba(31,42,60,.08);'
                f'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;flex:none;align-items:flex-start">'
                f'<p style="font-family:\'Thmanyah Text\',\'Cairo\',Tahoma,sans-serif;font-size:{fs}px;color:#1F2A3C;text-align:right;{w}">{n}{txt}</p></div></div>')
    cards = (card(290, 170, 'درسنا اليوم: ' + obj, bold=True, bg='#FFF6DD', fs=34) +
             card(500, 110, 'أذكر موقفًا في مدرستي أو بيتي أطبّق فيه ما تعلمته اليوم.', 1) +
             card(630, 110, 'كيف يخدم هذا السلوك وطني ويعزز هويتي الإماراتية؟', 2) +
             card(760, 110, 'أُتمّ: أكون مواطنًا إيجابيًّا حين ...', 3))
    return head + cards + foot + '<aside>اربط الدرس بخدمة الوطن والهوية. الإجابات مفتوحة.</aside></section>'

def process(path):
    s = open(path, encoding='utf-8').read()
    o = s
    stat = {'ans': 0, 'wt': 0, 'rs': 0}
    # css
    if '/*upg1*/' not in s:
        s = s.replace('</style>', CSS + '</style>', 1)
    # click handling: answer button must not advance the slide; close the box on any other click / key
    s = s.replace("if(!editing&&!e.target.closest('.nav'))next();", "if(!editing&&!e.target.closest('.nav')&&!e.target.closest('[data-ia]'))next();")
    if '/*upg2*/' not in s:
        s = s.replace('</body>', '<script>/*upg2*/addEventListener("click",function(e){if(!e.target.closest("[data-ia]"))document.querySelectorAll(".mabox.on").forEach(function(b){b.classList.remove("on")})},true);addEventListener("keydown",function(){document.querySelectorAll(".mabox.on").forEach(function(b){b.classList.remove("on")})},true);</script></body>', 1)
    # slides, back to front so offsets stay valid
    secs = sections(s)
    older = any(title(x.group(0)) == 'من درسي إلى سلوكي' for x in secs)
    for m in reversed(secs):
        sec = m.group(0)
        sec2, a = add_answers(sec)
        stat['ans'] += a
        sec2, r = stagger(sec2)
        stat['rs'] += r
        if older and title(sec) == 'من درسي إلى سلوكي' and 'id="wt"' not in s:
            # objective from «وجهتنا اليوم»
            g = next((x for x in secs if title(x.group(0)) == 'وجهتنا اليوم'), None)
            ob = ''
            if g:
                ps = [re.sub(r'<[^>]+>', '', p).strip() for p in re.findall(r'<p[^>]*>(.*?)</p>', g.group(0), re.S)]
                ob = next((p for p in ps if len(p) > 30 and not p.startswith(('معيار', 'وأربط', 'حراء'))), '')
            if ob:
                wt = build_wt(sec, ob)
                sec2 = sec2 + wt
                stat['wt'] = 1
        s = s[:m.start()] + sec2 + s[m.end():]
    if s != o:
        open(path, 'w', encoding='utf-8').write(s)
    return stat

if __name__ == '__main__':
    flt = sys.argv[1:]
    tot = {'ans': 0, 'wt': 0, 'rs': 0}; n = 0
    for f in sorted(glob.glob(ROOT + 'SN-*/teacher-deck.html')):
        if flt and not any(x in f for x in flt):
            continue
        st = process(f); n += 1
        for k in tot: tot[k] += st[k]
    print(n, tot)
