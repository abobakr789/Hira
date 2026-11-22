"""Y7-12: add «أنقد العبارة» after «أفكر وأصحح: صح أم خطأ؟» (id 'cr'); statement = last false item, answer = its correction."""
import re, glob, sys
ROOT = '/home/claude/hira/resources/ssd/'
def process(f):
    y = int(re.search(r'SN-Y(\d+)-', f).group(1))
    if y < 7: return 0
    s = open(f, encoding='utf-8').read()
    if 'id="cr"' in s: return 0
    i = s.find('أفكر وأصحح: صح أم خطأ؟')
    if i < 0: return 0
    st = s.rfind('<section', 0, i); en = s.find('</section>', i) + 10
    sec = s[st:en]
    items = re.findall(r'<p[^>]*>(\d+)\. (.*?)<span', sec, re.S)
    a = re.search(r'<aside>(.*?)</aside>', sec, re.S).group(1)
    fal = {}
    for m in re.finditer(r'(\d+) خطأ \(التصحيح: (.*?)\)(?: \||$)', a):
        fal[m.group(1)] = m.group(2)
    cand = [(n, re.sub('<[^>]+>', '', t).strip(), fal[n]) for n, t in items if n in fal]
    if not cand: return 0
    n, stmt, corr = cand[-1]
    k = re.search(r'<div[^>]*top:300px', sec).start()
    head = sec[:k]
    head = re.sub(r'id="\w+"', 'id="cr"', head, count=1)
    head = head.replace('أفكر وأصحح: صح أم خطأ؟', 'أنقد العبارة', 1)
    head = re.sub(r'(<p style="font-size:24px;color:#\w+;background:#fff;border:2px solid #\w+;padding:4px 18px;border-radius:24px">)[^<]*', r'\1نقد وتصويب', head, count=1)
    acc = re.search(r'border:3px solid (#[0-9A-Fa-f]{3,6})', sec).group(1)
    foot = re.search(r'<div style="position:absolute;left:120px;bottom:44px.*?</div>', sec, re.S).group(0)
    def card(top, h, txt, num=None, bold=False, bg='#fff', fs=36):
        nn = f'<b style="color:{acc}">{num}.</b> ' if num else ''
        w = 'font-weight:700;' if bold else ''
        return (f'<div class="rs" style="animation-delay:{(top-300)/1500:.2f}s;position:absolute;right:120px;top:{top}px;width:1680px;display:flex;">'
                f'<div style="width:1680px;height:{h}px;background:{bg};border:3px solid {acc};border-radius:30px;padding:26px;box-shadow:0 10px 28px rgba(31,42,60,.08);'
                f'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;flex:none;align-items:flex-start">'
                f'<p style="font-family:\'Thmanyah Text\',\'Cairo\',Tahoma,sans-serif;font-size:{fs}px;color:#1F2A3C;text-align:right;{w}">{nn}{txt}</p></div></div>')
    cards = (card(290, 170, 'العبارة: ' + stmt, bold=True, bg='#FFF0EE', fs=38) +
             card(500, 110, 'ما الخطأ في هذه العبارة؟', 1) +
             card(630, 110, 'أصوّبها بأسلوبي.', 2) +
             card(760, 110, 'أستشهد بفكرة من الكتاب تدعم تصويبي.', 3))
    btn = ('<button class="mabtn" data-ia onclick="this.nextElementSibling.classList.toggle(\'on\')">الإجابة النموذجية</button>'
           '<div class="mabox" data-ia onclick="this.classList.remove(\'on\')"><b>الإجابة النموذجية</b><p>العبارة خاطئة. التصحيح: %s</p></div>' % corr)
    new = head + cards + foot + btn + '<aside>اطلب من الطلاب نقد العبارة وتصويبها والاستشهاد بالكتاب، ثم اضغط «الإجابة النموذجية».</aside></section>'
    s = s[:en] + new + s[en:]
    open(f, 'w', encoding='utf-8').write(s)
    return 1
if __name__ == '__main__':
    flt = sys.argv[1:]; c = n = 0
    for f in sorted(glob.glob(ROOT + 'SN-*/teacher-deck.html')):
        if flt and not any(x in f for x in flt): continue
        n += 1; c += process(f)
    print(n, c)
