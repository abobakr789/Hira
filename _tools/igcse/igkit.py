# IGCSE Islamic Studies (Pearson Edexcel 4IS1) teacher-deck kit.
# Reuses the head/toolbar/scripts of a published English (LTR) Hiraa Islamic Education deck, so the presenter behaves
# identically (transitions, timer, notes, edit mode, progress button), and builds only the slides (1920x1080, flow layout).
import re, json, html as _h, os
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
TEMPLATE = os.path.join(ROOT, "resources/ie/IE-Y10-NN-T1-L01/teacher-deck.html")
DISP = "font-family:'Thmanyah Display','Cairo',Tahoma,sans-serif"
QF = "font-family:'Hafs','Amiri Quran',serif"
PAL = {  # bg, accent, tint
    'sand': ('#FFF8EA', '#A8741F', '#F3E4C2'), 'mint': ('#F2F8F4', '#3F6E5B', '#DCEAE4'), 'blue': ('#EEF5FB', '#2F6A9A', '#DDEBF7'),
    'rose': ('#FDF3F1', '#A8425E', '#F6DCE2'), 'lav': ('#F4F1FB', '#5546A3', '#E4DEF6'), 'peach': ('#FFF3EA', '#B0582F', '#F6DCCB'),
    'sky': ('#EEF8FB', '#1B7F9E', '#D3ECF5'), 'gold': ('#FFF8E2', '#8A5A1E', '#FBE9B5')}
COLS = ['#A8741F', '#3F6E5B', '#2F6A9A', '#B0582F', '#5546A3', '#A8425E']
TINTS = ['#F3E4C2', '#DCEAE4', '#DDEBF7', '#F6DCCB', '#E4DEF6', '#F6DCE2']

def e(t): return _h.escape(str(t), quote=False)
def md(t):  # **bold**, and Qur'an quotes ﴿…﴾ in the mushaf font
    t = e(t)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    return t
def P(t, size=30, color='#1F2A3C', bold=False, align='left', extra=''):
    return f'<p style="font-size:{size}px;color:{color};text-align:{align};line-height:1.5;{"font-weight:700;" if bold else ""}{extra}">{md(t)}</p>'
def B(n): return f' data-build-in="fade {n}"' if n else ''

class Deck:
    def __init__(s, code, title, footer):
        s.code, s.title, s.footer, s.sl = code, title, footer, []
    def slide(s, sid, pal, title, pill, body, notes, mins=None):
        bg, ac, tint = PAL[pal]
        pills = f'<p style="font-size:26px;color:{ac};background:{tint};padding:8px 24px;border-radius:28px;white-space:nowrap">{e(pill)}</p>'
        if mins: pills += f'<p style="font-size:24px;color:#5B6472;background:#fff;padding:8px 20px;border-radius:28px;white-space:nowrap">⏱ {e(mins)}</p>'
        orbs = ''.join(f'<div class="orb" style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{w}px;border-radius:50%;background:{c};opacity:.10;animation-delay:{d}s"></div>'
                       for x, y, w, c, d in [(1500, 620, 360, ac, 0), (80, 760, 260, '#6FB59A', 2), (900, -120, 300, '#6FA3D6', 4)])
        logo = '<div style="position:absolute;right:52px;top:30px;display:flex"><img src="../../../art/brand/hiraa-lockup-light.svg" alt="حراء" style="width:196px;height:78px;object-fit:contain"></div>'
        head = (f'<div style="display:flex;flex-direction:row;justify-content:space-between;align-items:center;gap:24px;padding-right:220px">'
                f'<h2 style="{DISP};font-size:54px;text-align:left;line-height:1.25">{md(title)}</h2>'
                f'<div style="display:flex;flex-direction:row;align-items:center;gap:14px;flex:none">{pills}</div></div>')
        foot = (f'<div style="position:absolute;left:128px;bottom:60px;display:flex;flex-direction:row;align-items:center;gap:12px">'
                f'<p style="font-size:22px;color:#8A8475;white-space:nowrap">{e(s.footer)}</p></div>')
        s.sl.append(f'<section class="sl" id="{sid}" style="background:{bg};color:#1F2A3C;font-family:\'Thmanyah Text\',\'Cairo\',Tahoma,sans-serif;'
                    f'padding:118px 128px 150px;display:flex;flex-direction:column;gap:22px;direction:ltr">{logo}{orbs}{head}{body}{foot}<aside>{e(notes)}</aside></section>')
    def save(s, out, label='Teacher presentation', drop=()):
        h = open(TEMPLATE, encoding='utf-8').read()
        i = h.find('<div id="wrap"><div id="stage">'); j = h.rfind('</section>')
        pre, post = h[:i], h[j + 10:]
        pre = re.sub(r'<title>.*?</title>', f'<title>{label} · {e(s.title)} · Hiraa</title>', pre, count=1, flags=re.S)
        pre = re.sub(r'<b>Teacher presentation · [^<]*</b>', f'<b>{label} · {e(s.title)}</b>', pre, count=1)
        # The template's fill-zoom and shrink passes run before the web fonts load, so with the real (wider) fonts
        # zoomed content could overflow the footer. Run them once the fonts are ready instead.
        a = post.find("<script>(function(){document.querySelectorAll('.sl').forEach(function(s){if(s.id=='cover')return;")
        z = post.find("const S=[...document.querySelectorAll('.sl')]", a)
        if a >= 0 and z > a:
            blk = post[a + 8:z]
            post = (post[:a + 8] + "function __igfit(){" + blk + "}\n(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(()=>requestAnimationFrame(__igfit));\n" + post[z:])
        pre = pre.replace('</style>', '@font-face{font-family:"Hafs";src:url("../../../art/fonts/uthmanic-hafs.woff2") format("woff2")}</style>', 1)
        os.makedirs(os.path.dirname(out), exist_ok=True)
        sl = [x for x in s.sl if not any(f'id="{d}"' in x[:60] for d in drop)]
        if drop: sl = [re.sub(r'<aside>.*?</aside>', '<aside></aside>', x, flags=re.S) for x in sl]
        open(out, 'w', encoding='utf-8').write(pre + '<div id="wrap"><div id="stage">' + ''.join(sl) + post)
        return len(sl)

# ---- building blocks ----
def card(inner, col='#2F6A9A', bg='#fff', w=None, build=0, pad='22px 30px', extra=''):
    ww = f'width:{w};' if w else ''
    return f'<div style="{ww}background:{bg};border-left:10px solid {col};border-radius:20px;padding:{pad};display:flex;flex-direction:column;gap:8px;{extra}"{B(build)}>{inner}</div>'
def grid(items, n=2, gap=18):
    w = f'calc({100 / n:.4f}% - {gap * (n - 1) / n:.1f}px)'
    return f'<div style="display:flex;flex-direction:row;flex-wrap:wrap;gap:{gap}px">' + ''.join(x.replace('<div style="', f'<div style="width:{w};', 1) for x in items) + '</div>'
def chipcard(h, t, k, build=0, size=27):
    return card(P(h, size + 3, COLS[k % 6], True) + P(t, size), COLS[k % 6], TINTS[k % 6], build=build)
def qa(q, a, k, build, size=28):
    return card(P(q, size, '#1F2A3C', True) + f'<div{B(build)} style="background:{TINTS[k % 6]};border-radius:14px;padding:10px 18px"><p style="font-size:{size - 2}px;color:{COLS[k % 6]};line-height:1.45;text-align:left">✅ {md(a)}</p></div>', COLS[k % 6])
def quran(lines_ar, ref, size=46):
    t = ' '.join(f'{_h.escape(x.replace(chr(0x08F1), chr(0x065E)).replace(chr(0x0640), ""))} ﴿{n}﴾' for n, x in lines_ar)
    return (f'<div style="background:#fff;border:3px solid #F3E4C2;border-radius:26px;padding:28px 40px;display:flex;flex-direction:column;gap:8px">'
            f'<p style="{QF};direction:rtl;font-size:{size}px;line-height:2.05;text-align:justify">{t}</p><p style="font-size:24px;color:#A8741F;text-align:left">[{e(ref)}]</p></div>')
def table(heads, rows, cols=None, size=25, build_rows=False):
    cols = cols or COLS
    hd = ''.join(f'<div style="flex:{w};background:{cols[k % 6]};color:#fff;border-radius:12px;padding:10px 16px"><p style="font-size:{size}px;font-weight:700;text-align:left">{md(h)}</p></div>' for k, (h, w) in enumerate(heads))
    body = ''
    for r, row in enumerate(rows):
        cells = ''.join(f'<div style="flex:{heads[k][1]};background:#fff;border-radius:12px;padding:10px 16px"><p style="font-size:{size}px;text-align:left;line-height:1.4">{md(c)}</p></div>' for k, c in enumerate(row))
        body += f'<div style="display:flex;flex-direction:row;gap:10px"{B(r + 1) if build_rows else ""}>{cells}</div>'
    return f'<div style="display:flex;flex-direction:column;gap:10px"><div style="display:flex;flex-direction:row;gap:10px">{hd}</div>{body}</div>'
def tagline(t, col='#3F6E5B', tint='#DCEAE4', build=0, size=27):
    return f'<div style="background:{tint};border-radius:16px;padding:14px 26px"{B(build)}><p style="font-size:{size}px;color:{col};text-align:left;line-height:1.45">{md(t)}</p></div>'
def tagged(parts, build_from=1, size=26):
    """Model answer with exam-skill tags: list of (tag, colour index, text)."""
    out = ''
    for k, (tag, ci, t) in enumerate(parts):
        out += (f'<div style="display:flex;flex-direction:row;gap:14px;align-items:flex-start"{B(build_from + k)}>'
                f'<p style="flex:none;width:200px;font-size:20px;font-weight:700;color:#fff;background:{COLS[ci % 6]};border-radius:12px;padding:6px 10px;text-align:center">{e(tag)}</p>'
                f'<p style="flex:1;font-size:{size}px;line-height:1.5;text-align:left">{md(t)}</p></div>')
    return f'<div style="background:#fff;border-radius:22px;padding:22px 28px;display:flex;flex-direction:column;gap:12px">{out}</div>'
