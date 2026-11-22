# Hiraa teacher-deck kit (standalone HTML, 1920x1080 slides) for the Sanaa subject.
# Reuses the head/toolbar/scripts of a published SS deck so the presenter behaves identically
# (transitions, timer, notes, edit mode, progress button), and builds only the slides.
import re, html as _h

TEMPLATE = '/home/claude/hira/resources/ssd/SS-Y1-T1-L01/teacher-deck.html'
FONT = "font-family:'Thmanyah Display','Cairo',Tahoma,sans-serif"
TXT = "font-family:'Thmanyah Text','Cairo',Tahoma,sans-serif"
PAL = {  # name: (bg, accent, tint)
    'sand': ('#FFF8EA', '#B0782A', '#F5E6C8'), 'blue': ('#EEF5FB', '#2F6A9A', '#DDEBF7'),
    'mint': ('#EEF8F3', '#1F7A6D', '#DDF1EC'), 'rose': ('#FDF1F0', '#B4483F', '#F9DAD6'),
    'lav': ('#F3F0FB', '#5546A3', '#E4DEF6'), 'gold': ('#FFF6DD', '#8A5A1E', '#FFE9A8'),
    'sky': ('#EAF6FB', '#1B7F9E', '#D3ECF5'), 'peach': ('#FFF1E6', '#B0582F', '#FCDDC6'),
}

def esc(t): return _h.escape(t, quote=False)

def frame(sid, pal, badge, mins, title, body, notes, footer, dark=False):
    bg, ac, tint = PAL[pal]
    orbs = (f'<div class="orb" style="position:absolute;left:1500px;top:620px;width:360px;height:360px;border-radius:50%;background:{ac};opacity:.10;animation-delay:0s"></div>'
            f'<div class="orb" style="position:absolute;left:80px;top:760px;width:260px;height:260px;border-radius:50%;background:{ac};opacity:.10;animation-delay:2s"></div>'
            f'<div class="orb" style="position:absolute;left:900px;top:-120px;width:300px;height:300px;border-radius:50%;background:{ac};opacity:.10;animation-delay:4s"></div>')
    wave = (f'<svg viewBox="0 0 1920 200" preserveAspectRatio="none" style="position:absolute;left:0;bottom:0;width:1920px;height:170px;pointer-events:none" aria-hidden="true">'
            f'<path d="M0 120 C320 40 640 200 960 120 C1280 40 1600 180 1920 100 V200 H0z" fill="{ac}" opacity="0.12"/>'
            f'<path d="M0 160 C360 100 720 210 1080 150 C1440 90 1680 170 1920 140 V200 H0z" fill="{ac}" opacity="0.17"/></svg>')
    logo = '<div style="position:absolute;left:56px;top:34px;display:flex"><img src="../../../art/brand/hiraa-lockup-light.svg" alt="حراء" style="width:196px;height:78px;object-fit:contain"></div>'
    pills = f'<p style="font-size:24px;color:{ac};background:#fff;border:2px solid {ac};padding:4px 18px;border-radius:24px">{esc(badge)}</p>'
    if mins: pills += f'<p style="font-size:24px;color:#5B6472;background:#fff;padding:4px 16px;border-radius:24px">⏱ {esc(mins)}</p>'
    head = (f'<div style="position:absolute;right:120px;top:104px;width:1400px;display:flex;flex-direction:column;align-items:flex-start;gap:12px">'
            f'<div style="display:flex;flex-direction:row;gap:12px">{pills}</div>'
            f'<h2 style="{FONT};font-size:60px;line-height:1.45">{esc(title)}</h2><div class="hbar" style="width:140px;height:8px;border-radius:4px;background:{ac}"></div></div>')
    foot = f'<div style="position:absolute;left:120px;bottom:44px;display:flex;flex-direction:row;align-items:center;gap:12px"><p style="font-size:22px;color:#8A8475">{esc(footer)}</p></div>'
    return (f'<section class="sl" id="{sid}" style="background:{bg};color:#1F2A3C;{TXT};padding:0;direction:rtl;overflow:hidden">'
            f'{orbs}{wave}{logo}{head}{body}{foot}<aside>{esc(notes)}</aside></section>')

def abs_(x, y, w, inner, extra=''):  # absolutely positioned block, right-anchored like the published decks
    return f'<div style="position:absolute;right:{x}px;top:{y}px;width:{w}px;display:flex;{extra}">{inner}</div>'

def card(inner, w, h=None, bg='#fff', ac='#2F6A9A', border=True, pad=26, extra=''):
    b = f'border:3px solid {ac};' if border else ''
    hh = f'height:{h}px;' if h else ''
    return (f'<div style="width:{w}px;{hh}background:{bg};{b}border-radius:30px;padding:{pad}px;box-shadow:0 10px 28px rgba(31,42,60,.08);'
            f'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;flex:none;{extra}">{inner}</div>')

def P(t, size=36, color='#1F2A3C', bold=False, display=False, align='center', extra=''):
    f = FONT if display else TXT
    return f'<p style="{f};font-size:{size}px;color:{color};text-align:{align};{"font-weight:700;" if bold else ""}{extra}">{t}</p>'

def build(path_out, title, lesson_id, slides_html):
    h = open(TEMPLATE, encoding='utf-8').read()
    i = h.find('<div id="wrap"><div id="stage">'); j = h.rfind('</section>')
    pre, post = h[:i], h[j + 10:]
    pre = re.sub(r'<title>.*?</title>', f'<title>عرض المعلم · {esc(title)} · Hiraa</title>', pre, count=1, flags=re.S)
    pre = re.sub(r'<b>عرض المعلم · [^<]*</b>', f'<b>عرض المعلم · {esc(title)}</b>', pre, count=1)
    pre = pre.replace('cf344853-12eb-4b24-93f3-ba06ab02c7f3', lesson_id)
    out = pre + '<div id="wrap"><div id="stage">' + ''.join(slides_html) + post
    open(path_out, 'w', encoding='utf-8').write(out)
    return len(slides_html)
