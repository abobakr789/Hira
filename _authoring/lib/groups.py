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
# يطابق الكتلةَ الأصليةَ أو الكتلةَ المرفوعةَ، فتُعادُ الصياغةُ دونَ إعادةِ بناءِ العرض
BLOCK = re.compile(
    r'(<div style="position:absolute;right:120px;top:(?:104px;width:1400px|96px;width:1680px).*?)'
    r'(?=<div style="position:absolute;left:120px;bottom:44px")', re.S)


def _fit(text, big, small, cap):
    """Shrink a line once it runs long, the way the decks size their text."""
    n = len(text.strip())
    if n <= cap:
        return big
    return max(small, round(big - (n - cap) * 0.28))


ROLES = [('🔍', 'الْباحِثُ', '#2F6A9A'),
         ('✍️', 'الْكاتِبُ', '#6B5BA8'),
         ('🗣️', 'الْمُقَدِّمُ', '#2E8B6B')]


def block(g, idx):
    """g: dict(head, crit, steps[3], stretch, product, support) -> slide markup."""
    head_sz = _fit(g['head'], 44, 32, 46)
    step_sz = _fit(' '.join(g['steps']), 29, 23, 150)
    str_sz = _fit(g['stretch'], 30, 23, 90)
    rows = []
    for i, st in enumerate(g['steps']):
        emo, role, col = ROLES[i % 3]
        sep = ('border-bottom:1px solid #EEF1F5;padding-bottom:15px;margin-bottom:15px'
               if i < len(g['steps']) - 1 else '')
        rows.append(
            f'<div style="display:flex;gap:16px;align-items:flex-start;{sep}">'
            f'<span style="flex:none;width:40px;height:40px;border-radius:50%;background:{DASH_BG};'
            f'color:{DASH_CHIP};font-size:23px;display:flex;align-items:center;'
            f'justify-content:center;font-weight:700">{i + 1}</span>'
            f'<p style="flex:1;font-size:{step_sz}px;line-height:1.68;text-align:start">{st}</p>'
            f'<span style="flex:none;font-size:20px;color:{col};background:#fff;'
            f'border:1.5px solid {col}44;border-radius:16px;padding:3px 13px;'
            f'white-space:nowrap;margin-top:4px">{emo} {role}</span></div>')
    steps = ''.join(rows)
    return (
        # ── الشارات ومعيار النجاح ────────────────────────────────────────
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
        # ── عنوان المهمّة ───────────────────────────────────────────────
        f'<div style="display:flex;align-items:stretch;gap:14px">'
        f'<div style="width:12px;background:{GOLD};border-radius:6px"></div>'
        f'<div style="flex:1;background:#fff;border-radius:22px;padding:14px 30px;'
        f'box-shadow:{SHADOW};display:flex;align-items:center">'
        f'<h2 style="font-family:{DISPLAY};font-size:{head_sz}px;line-height:1.4;'
        f'color:{INK}">{g["head"]}</h2></div></div></div>'
        # ── المهمّة الأساسيّة + التحدّي ─────────────────────────────────
        f'<div style="position:absolute;right:120px;top:292px;width:1680px;'
        f'height:466px;display:flex;gap:26px;align-items:stretch">'
        f'<div style="flex:1.38;background:#fff;border-radius:28px;padding:24px 32px;'
        f'box-shadow:{SHADOW};display:flex;flex-direction:column;gap:14px">'
        f'<p style="font-size:25px;color:{DASH_CHIP};background:#FBEBD6;'
        f'padding:5px 20px;border-radius:20px;align-self:flex-start">'
        f'الْمُهِمَّةُ الْأَساسِيَّةُ · لِلْجَميعِ</p>'
        f'<div style="flex:1;display:flex;flex-direction:column;justify-content:center">'
        f'{steps}</div></div>'
        f'<div style="width:620px;background:{DASH_BG};border:4px dashed {DASH_BD};'
        f'border-radius:28px;padding:24px 30px;display:flex;flex-direction:column;gap:16px">'
        f'<p style="font-size:25px;color:#fff;background:{DASH_CHIP};padding:5px 20px;'
        f'border-radius:20px;align-self:flex-start">★ التَّحَدّي الْأَكْبَرُ</p>'
        f'<p style="flex:1;display:flex;align-items:center;font-size:{str_sz}px;'
        f'line-height:1.7;text-align:start;color:{INK}">{g["stretch"]}</p></div></div>'
        # ── المنتَج + الدعم ─────────────────────────────────────────────
        f'<div style="position:absolute;right:120px;bottom:140px;width:1680px;'
        f'display:flex;gap:26px;align-items:stretch">'
        f'<div style="flex:1.38;background:#fff;border-radius:22px;padding:16px 30px;'
        f'box-shadow:{SHADOW};display:flex;align-items:center">'
        f'<p style="font-size:27px;color:{INK}">'
        f'<b style="color:{GOLD}">الْمُنْتَجُ:</b> {g["product"]}</p></div>'
        f'<div style="width:620px;background:#F1F6FB;border-radius:22px;padding:16px 30px">'
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
