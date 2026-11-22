"""Y5-8: slide «من المصدر المساند» (id 'ms') after «نقرأ النص من كتابي»: first paragraph of the book's supporting source, verbatim."""
import re, glob, sys, html
sys.path.insert(0, '/home/claude/hira/_tools/sanaa')
from orig_ss import SS
ROOT = '/home/claude/hira/resources/ssd/'
def excerpt(stem):
    note, pages = SS[stem]
    for ref, paras in pages:
        for p in paras:
            if p.startswith('- '): continue
            if len(p) < 60: continue
            if len(p) <= 340: return ref, p
            out = ''
            for sent in re.split(r'(?<=[.؟!])\s+', p):
                if out and len(out) + len(sent) > 340: break
                out += (' ' if out else '') + sent
            return ref, out
    return None, None
def process(f):
    m = re.search(r'SN-Y(\d+)-(T\d-L\d+)', f)
    y, stem = int(m.group(1)), m.group(2)
    if y not in (5, 6, 7, 8) or stem not in SS: return 0
    s = open(f, encoding='utf-8').read()
    if 'id="ms"' in s: return 0
    ref, ex = excerpt(stem)
    if not ex: return 0
    i = s.find('نقرأ النص من كتابي')
    j = s.find('من درسي إلى سلوكي')
    if i < 0 or j < 0: return 0
    st = s.rfind('<section', 0, j); en = s.find('</section>', j) + 10
    tpl = s[st:en]
    en2 = s.find('</section>', i) + 10
    k = re.search(r'<div[^>]*top:300px', tpl).start()
    head = re.sub(r'id="\w+"', 'id="ms"', tpl[:k], count=1)
    head = head.replace('قيمة نعيشها', 'أقرأ وأفكر', 1).replace('من درسي إلى سلوكي', 'من المصدر المساند', 1)
    acc = re.search(r'border:3px solid (#[0-9A-Fa-f]{3,6})', tpl).group(1)
    foot = re.search(r'<div style="position:absolute;left:120px;bottom:44px.*?</div>', tpl, re.S).group(0)
    def card(top, h, txt, bold=False, bg='#fff', fs=36, num=None):
        nn = f'<b style="color:{acc}">{num}.</b> ' if num else ''
        w = 'font-weight:700;' if bold else ''
        return (f'<div class="rs" style="animation-delay:{(top-300)/1500:.2f}s;position:absolute;right:120px;top:{top}px;width:1680px;display:flex;">'
                f'<div style="width:1680px;height:{h}px;background:{bg};border:3px solid {acc};border-radius:30px;padding:26px;box-shadow:0 10px 28px rgba(31,42,60,.08);'
                f'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;flex:none;align-items:flex-start">'
                f'<p style="font-family:\'Thmanyah Text\',\'Cairo\',Tahoma,sans-serif;font-size:{fs}px;color:#1F2A3C;text-align:right;line-height:1.7;{w}">{nn}{txt}</p></div></div>')
    cards = (card(290, 360, html.escape(ex), fs=34) +
             f'<div class="rs" style="animation-delay:.3s;position:absolute;right:120px;top:660px;width:1680px;display:flex;"><p style="font-size:24px;color:#5B6472;background:#fff;padding:4px 18px;border-radius:24px">من الكتاب: المصدر المساند · {ref}</p></div>' +
             card(730, 120, 'ما الفكرة الجديدة التي تضيفها هذه الفقرة إلى درسنا؟', bg='#FFF6DD', bold=True, fs=34))
    new = head + cards + foot + '<aside>نص حرفي من المصدر المساند في كتاب الطالب؛ اقرأه مع الطلاب ثم ناقش السؤال.</aside></section>'
    s = s[:en2] + new + s[en2:]
    open(f, 'w', encoding='utf-8').write(s)
    return 1
if __name__ == '__main__':
    flt = sys.argv[1:]; c = n = 0
    for f in sorted(glob.glob(ROOT + 'SN-*/teacher-deck.html')):
        if flt and not any(x in f for x in flt): continue
        n += 1; c += process(f)
    print(n, c)
