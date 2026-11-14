# -*- coding: utf-8 -*-
"""Rebuild the four group-work slides (g1–g4) at the raised challenge level
used from Grade 5 upwards: a criterion-linked heading, a three-step core
mission for everyone, a stretch challenge, and a named product + scaffold.
"""
import re

GOLD, INK, MUTED = '#C9822B', '#1F2A3C', '#5B6472'
DASH_BG, DASH_BD, DASH_CHIP = '#FFF6E0', '#D7A33B', '#A8741F'
DISPLAY = "'Thmanyah Display','Cairo',Tahoma,sans-serif"
SHADOW = '0 12px 32px rgba(31,42,60,.10)'

# the content block of a g-slide sits between the logo and the footer
BLOCK = re.compile(
    r'(<div style="position:absolute;right:120px;top:104px;width:1400px.*?)'
    r'(?=<div style="position:absolute;left:120px;bottom:44px")', re.S)


def _fit(text, big, small, cap):
    """Shrink a line once it runs long, the way the decks size their text."""
    n = len(text.strip())
    if n <= cap:
        return big
    return max(small, round(big - (n - cap) * 0.28))


def block(g, idx):
    """g: dict(head, crit, steps[3], stretch, product, support) -> slide markup."""
    head_sz = _fit(g['head'], 44, 32, 46)
    step_sz = _fit(' '.join(g['steps']), 31, 24, 150)
    str_sz = _fit(g['stretch'], 31, 24, 90)
    steps = ''.join(
        f'<p style="font-size:{step_sz}px;line-height:1.72;text-align:start">'
        f'<b style="color:{GOLD}">{i + 1}.</b> {s}</p>'
        for i, s in enumerate(g['steps']))
    return (
        # ── eyebrow chips + criterion badge ──────────────────────────────
        f'<div style="position:absolute;right:120px;top:96px;width:1680px;'
        f'display:flex;flex-direction:column;gap:16px">'
        f'<div style="display:flex;gap:12px;align-items:center">'
        f'<p style="font-size:24px;color:{GOLD};background:#fff;border:2px solid {GOLD};'
        f'padding:4px 18px;border-radius:24px">👥 الْمَجْموعَةُ {idx}</p>'
        f'<p style="font-size:24px;color:{MUTED};background:#fff;padding:4px 16px;'
        f'border-radius:24px">⏱ 12 دَقيقَةً</p>'
        f'<div style="flex:1"></div>'
        f'<p style="font-size:24px;color:{DASH_CHIP};background:#FBEBD6;'
        f'padding:4px 18px;border-radius:24px">📝 مِعْيارُ النَّجاحِ {g["crit"]}</p>'
        f'</div>'
        # ── heading band ────────────────────────────────────────────────
        f'<div style="display:flex;align-items:stretch;gap:14px">'
        f'<div style="width:12px;background:{GOLD};border-radius:6px"></div>'
        f'<div style="flex:1;background:#fff;border-radius:22px;padding:16px 30px;'
        f'box-shadow:{SHADOW};display:flex;align-items:center">'
        f'<h2 style="font-family:{DISPLAY};font-size:{head_sz}px;line-height:1.45;'
        f'color:{INK}">{g["head"]}</h2></div></div></div>'
        # ── core mission + stretch ──────────────────────────────────────
        f'<div style="position:absolute;right:120px;top:296px;width:1680px;'
        f'min-height:508px;display:flex;gap:26px;align-items:stretch">'
        f'<div style="flex:1.3;background:#fff;border-radius:28px;padding:26px 32px;'
        f'box-shadow:{SHADOW};display:flex;flex-direction:column;gap:14px;justify-content:center">'
        f'<p style="font-size:26px;color:{DASH_CHIP};background:#FBEBD6;'
        f'padding:5px 20px;border-radius:20px;align-self:flex-start">'
        f'الْمُهِمَّةُ الْأَساسِيَّةُ · لِلْجَميعِ</p>{steps}</div>'
        f'<div style="width:640px;background:{DASH_BG};border:4px dashed {DASH_BD};'
        f'border-radius:28px;padding:26px 30px;display:flex;flex-direction:column;gap:16px;justify-content:center">'
        f'<p style="font-size:26px;color:#fff;background:{DASH_CHIP};padding:5px 20px;'
        f'border-radius:20px;align-self:flex-start">★ التَّحَدّي الْأَكْبَرُ</p>'
        f'<p style="font-size:{str_sz}px;line-height:1.7;text-align:start;color:{INK}">'
        f'{g["stretch"]}</p></div></div>'
        # ── product + scaffold ──────────────────────────────────────────
        f'<div style="position:absolute;right:120px;bottom:140px;width:1680px;'
        f'display:flex;gap:26px">'
        f'<div style="flex:1.3;background:#fff;border-radius:22px;padding:16px 30px;'
        f'box-shadow:{SHADOW}"><p style="font-size:27px;color:{INK}">'
        f'<b style="color:{GOLD}">الْمُنْتَجُ:</b> {g["product"]}</p></div>'
        f'<div style="width:640px;background:#F1F6FB;border-radius:22px;padding:16px 30px">'
        f'<p style="font-size:27px;color:{MUTED}">'
        f'<b style="color:#2F6A9A">دَعْمٌ:</b> {g["support"]}</p></div></div>')


def apply(html, groups):
    """Replace the content of g1..g4 in a built deck. groups: list of 4 dicts."""
    import deck
    pre, secs, post = deck.split_sections(html)
    out = []
    for sid, s in secs:
        if sid in ('g1', 'g2', 'g3', 'g4'):
            i = int(sid[1])
            new = block(groups[i - 1], i)
            s2, n = BLOCK.subn(lambda m: new, s, count=1)
            if n != 1:
                raise ValueError(f'{sid}: content block not found')
            s2 = re.sub(r'<aside>.*?</aside>',
                        f'<aside>{groups[i-1]["note"]}</aside>', s2, count=1, flags=re.S)
            s = s2
        out.append(s)
    return pre + ''.join(out) + post


CARD = re.compile(
    r"(<div class='k' style='([^']*)'>).*?</div>\s*"
    r"(<div class='box'[^>]*>\s*</div>)\s*"
    r"<div class='star'>.*?</div>", re.S)


def apply_cards(html, G):
    """Rebuild the four printable group cards to match the new slide design."""
    it = iter(G)

    def one(m):
        g = next(it)
        kstyle, inner = m.group(1), m.group(2)
        accent = re.search(r'border-color:(#[0-9A-Fa-f]{6})', inner)
        accent = accent.group(1) if accent else DASH_CHIP
        steps = ''.join(f'<li style="margin-bottom:3px">{s}</li>' for s in g['steps'])
        return (
            f"{kstyle}<b>مِعْيارُ النَّجاحِ {g['crit']}</b> · {g['head']}</div>"
            f"<div style='font-size:11pt;margin:7px 0 2px;color:{accent}'>"
            f"<b>الْمُهِمَّةُ الْأَساسِيَّةُ · لِلْجَميعِ</b></div>"
            f"<ol style='margin:0 18px 0 0;padding:0;font-size:11pt;line-height:1.65'>"
            f"{steps}</ol>"
            f"{m.group(3)}"
            f"<div class='star'><b>★ التَّحَدّي الْأَكْبَرُ:</b> {g['stretch']}</div>"
            f"<div style='font-size:10pt;margin-top:5px;color:#4A5160'>"
            f"<b>الْمُنْتَجُ:</b> {g['product']} &nbsp;·&nbsp; "
            f"<b>دَعْمٌ:</b> {g['support']}</div>")

    out, n = CARD.subn(one, html)
    if n != 4:
        raise ValueError(f'rebuilt {n} cards, expected 4')
    return out
