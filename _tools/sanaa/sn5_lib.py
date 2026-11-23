import re
FOOT = '<div style="position:absolute;left:120px;bottom:44px'
def sections(t):
    return list(re.finditer(r'<section class="sl"[^>]*id="([^"]+)".*?</section>', t, re.S))
def split(sec):
    h2 = sec.find('</h2>')
    hb = sec.find('class="hbar"', h2)
    he = sec.find('</div></div>', hb) + len('</div></div>')
    fe = sec.find(FOOT)
    return sec[:he], sec[he:fe], sec[fe:]
def ps(html):
    out = []
    for m in re.finditer(r'<p style="([^"]*)">(.*?)</p>', html, re.S):
        fs = re.search(r'font-size:(\d+)px', m.group(1))
        out.append((int(fs.group(1)) if fs else 0, m.group(2).strip()))
    return out
def plain(s): return re.sub(r'<[^>]+>', '', s).replace('\xa0', ' ').strip()
def norm(s): return re.sub(r'[ً-ْـ]', '', s)
