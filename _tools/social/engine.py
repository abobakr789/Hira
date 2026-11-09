# Hiraa slide engine (self-contained). Writes the exact JSON the published viewer reads:
# resources/slides/<code>.json = {code, en, slides:[{bg, n, els:[text|shape|img]}]} on a 1280x720 canvas.
# Geometry is authored in inches (10 x 5.625) and font sizes in points, like the Arabic decks.
import json, os, re
PX = 128.0                      # px per inch
PT = 128.0 / 72.0               # px per point
BG, CARD, DK, TE, SUN, MU, SOFT, PEACH = 'FBF6EC', 'FFFDF8', '1E3A3F', '0F6E72', 'F2A93B', '6B7B7E', 'E2F0EF', 'FCE9DA'
X0, W = 0.3, 9.4

class Deck:
    def __init__(self, en=False): self.en = en; self.slides = []
    def new(self, bg=BG, notes=''):
        s = {'bg': bg, 'els': [], 'n': notes}; self.slides.append(s); return s

def _p(v): return int(round(v * PX))

def T(sl, text, x, y, w, h, size, color, bold=False, align='right', fill=None, rad=False, rv=0, valign='middle'):
    e = {'k': 'text', 'x': _p(x), 'y': _p(y), 'w': _p(w), 'h': _p(h)}
    if rv: e['rv'] = rv
    e.update({'text': text, 'size': int(round(size * PT)), 'color': color, 'bold': bold, 'align': align,
              'fill': fill, 'rad': rad, 'va': valign})
    sl['els'].append(e); return e

def R(sl, x, y, w, h, fill, line=None, rad=True, rv=0, lw=1.5, oval=False):
    e = {'k': 'shape', 'x': _p(x), 'y': _p(y), 'w': _p(w), 'h': _p(h)}
    if rv: e['rv'] = rv
    e.update({'fill': fill, 'line': line, 'rad': rad, 'oval': oval, 'lw': lw})
    sl['els'].append(e); return e

def I(sl, emo, x, y, size, rv=0):
    e = {'k': 'img', 'x': _p(x), 'y': _p(y), 'w': _p(size), 'h': _p(size), 'emo': emo}
    if rv: e['rv'] = rv
    sl['els'].append(e); return e

def PIC(sl, src, x, y, w, h, rv=0, rad=True):
    e = {'k': 'pic', 'x': _p(x), 'y': _p(y), 'w': _p(w), 'h': _p(h)}
    if rv: e['rv'] = rv
    e.update({'src': src, 'rad': rad}); sl['els'].append(e); return e

def cols(n, gap=0.15, x0=X0, w=W):
    cw = (w - gap * (n - 1)) / n
    return [(x0 + w - cw - i * (cw + gap), cw) for i in range(n)]   # right-to-left order

def box(sl, x, y, w, h, title, lines, col=TE, size=14, fill=CARD, rv=0):
    R(sl, x, y, w, h, fill, line=col, rv=rv, lw=2)
    T(sl, title, x + 0.12, y + 0.06, w - 0.24, 0.4, 15, col, True, 'right', rv=rv)
    T(sl, '\n'.join(lines), x + 0.12, y + 0.48, w - 0.24, h - 0.56, size, DK, False, 'right', rv=rv, valign='top')

def overlaps(D):
    """Text boxes must not overlap each other; emoji must not sit on text."""
    bad = []
    def ov(a, b):
        return min(a['x'] + a['w'], b['x'] + b['w']) - max(a['x'], b['x']) > 2 and \
               min(a['y'] + a['h'], b['y'] + b['h']) - max(a['y'], b['y']) > 2
    for si, s in enumerate(D.slides):
        tx = [e for e in s['els'] if e['k'] == 'text']; im = [e for e in s['els'] if e['k'] in ('img', 'pic')]
        for i in range(len(tx)):
            for j in range(i + 1, len(tx)):
                if ov(tx[i], tx[j]): bad.append((si, 'text', tx[i]['text'][:25], tx[j]['text'][:25]))
            for m in im:
                if ov(tx[i], m): bad.append((si, 'emoji', tx[i]['text'][:25], m.get('emo', m.get('src'))))
    return bad

def export(code, D, root):
    os.makedirs(f'{root}/resources/slides', exist_ok=True)
    json.dump({'code': code, 'en': D.en, 'slides': D.slides},
              open(f'{root}/resources/slides/{code}.json', 'w', encoding='utf-8'), ensure_ascii=False)

# ---- browser check: renders each slide like the viewer, reports clipped text, saves PNGs ----
CSS = (".tdf{position:relative;width:1280px;height:720px;overflow:hidden;font-family:'Noto Naskh Arabic','Noto Sans Arabic',Arial}"
       ".el{position:absolute;box-sizing:border-box}.tx{display:flex;padding:4px 10px;line-height:1.45;white-space:pre-wrap;overflow:hidden}"
       ".emo{display:flex;align-items:center;justify-content:center;line-height:1}")
PIC_ROOT = '/home/claude/Hira'
def _el(e):
    import html
    pos = f"left:{e['x']}px;top:{e['y']}px;width:{e['w']}px;height:{e['h']}px;"
    if e['k'] == 'shape':
        bd = 'border:%spx solid #%s;' % (max(2, round(e.get('lw', 1.5) * 1.8)), e['line']) if e.get('line') else ''
        return f"<div class='el' style='{pos}background:#{e['fill']};{bd}border-radius:{'16px' if e.get('rad') else '0'}'></div>"
    if e['k'] == 'pic':
        return f"<img class='el' src='file://{PIC_ROOT}/{e['src']}' style='{pos}object-fit:contain;border-radius:16px'>"
    if e['k'] == 'img':
        return f"<div class='el emo' style='{pos}font-size:{round(e['h']*0.82)}px'>{e['emo']}</div>"
    rtl = bool(re.search('[\u0600-\u06FF]', e['text'])); al = e.get('align')
    jc = 'center' if al == 'center' else ('flex-end' if (al == 'left') == rtl else 'flex-start')
    return (f"<div class='el tx' dir='{'rtl' if rtl else 'ltr'}' style='{pos}font-size:{e['size']}px;color:#{e['color']};"
            f"font-weight:{800 if e['bold'] else 400};justify-content:{jc};text-align:{al or 'start'};"
            f"align-items:{'flex-start' if e.get('va')=='top' else 'center'};{'background:#'+e['fill']+';' if e.get('fill') else ''}"
            f"{'border-radius:14px;' if e.get('rad') else ''}'>{html.escape(e['text'])}</div>")
def render_check(page, D, png_prefix=None):
    clip = []
    for i, s in enumerate(D.slides):
        open('/tmp/_slide.html', 'w').write(f"<html><head><meta charset='utf-8'><style>{CSS}</style></head><body style='margin:0'><div class='tdf' style='background:#{s['bg']}'>{''.join(_el(e) for e in s['els'])}</div></body></html>")
        page.goto('file:///tmp/_slide.html'); page.wait_for_timeout(60)
        c = page.evaluate("()=>[...document.querySelectorAll('.tx')].filter(d=>d.scrollHeight>d.clientHeight+2||d.scrollWidth>d.clientWidth+2).map(d=>d.textContent.slice(0,40))")
        if c: clip.append((i, c))
        if png_prefix: page.screenshot(path=f'{png_prefix}{i:02d}.png')
    return clip
