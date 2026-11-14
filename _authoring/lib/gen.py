# -*- coding: utf-8 -*-
"""Hiraa SS teacher-deck generator: extract fields from a published deck,
and render a new deck from any deck used as a template.

  F, scenes, art = extract(published_html)      # read a deck back into fields
  html           = render(template_html, F, scenes, art)
"""
import re, os, sys, json, bisect
sys.path.insert(0, os.path.dirname(__file__))
import deck, slots

MARK = '<mark class="kw" data-ia data-m="{m}" onclick="hxGl(this,event)">{w}</mark>'
BT_P = re.compile(r'(<p style="font-size:26px;line-height:2;text-align:justify">)(.*?)(</p>)', re.S)
IMG = re.compile(r'(src="\.\./\.\./ssbook/)([^/]+)(/)([^"]+)(")')
HEAD = re.compile(r'(<title>عرض المعلم · )(.*?)((?: · Hiraa)?</title>)', re.S)
HEADB = re.compile(r'(<b>عرض المعلم · )(.*?)(</b>)', re.S)
FIT = json.load(open(os.path.join(os.path.dirname(__file__), 'fit.json'), encoding='utf-8'))


def autofit(slot, text):
    """Font size for this slot at this text length, from the learned curve."""
    pts = FIT.get(slot)
    if not pts:
        return None
    L = len(text.strip())
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    if L <= xs[0]:
        return ys[0]
    if L >= xs[-1]:
        return ys[-1]
    i = bisect.bisect_left(xs, L)
    if xs[i] == L:
        return ys[i]
    x0, x1, y0, y1 = xs[i - 1], xs[i], ys[i - 1], ys[i]
    return round(y0 + (y1 - y0) * (L - x0) / (x1 - x0))


def extract(html):
    """-> (fields, scenes, art). art = (lesson_code, [image filenames in order])."""
    pre, secs, post = deck.split_sections(html)
    F, scenes = {}, {}
    for sid, s in secs:
        t = deck.texts(s)
        for i, name in slots.T.get(sid, {}).items():
            j = i if i >= 0 else len(t) + i
            if 0 <= j < len(t):
                F[name] = t[j].strip()
        sc = deck.scene_of(s)
        if sc:
            scenes[sid] = sc
    m = BT_P.search(dict(secs)['booktext'])
    F['booktext_html'] = m.group(2) if m else ''
    hits = IMG.findall(html)
    code = hits[0][1] if hits else ''
    return F, scenes, (code, [h[3] for h in hits])


def booktext_body(body, marks):
    """Plain body + [(word, meaning)] -> the paragraph's inner html."""
    out = body
    for w, mn in marks:
        if w not in out:
            raise ValueError('highlight word not in body: ' + w)
        out = out.replace(w, MARK.format(m=mn, w=w), 1)
    return out


def _write_section(sid, s, F):
    tbl = slots.T.get(sid, {})
    if not tbl:
        return s
    parts, ns = deck.nodes(s)
    t = [x for _, x in ns]
    for i, name in tbl.items():
        j = i if i >= 0 else len(t) + i
        if not (0 <= j < len(t)):
            continue
        if name in slots.DERIVED:
            src, pfx = slots.DERIVED[name]
            if src not in F:
                continue
            val = pfx + F[src]
        elif name in F:
            val = F[name]
        else:
            continue
        k, old = ns[j]
        if val == old.strip():       # unchanged: keep the template's own sizing
            continue
        lead = old[:len(old) - len(old.lstrip())]
        tail = old[len(old.rstrip()):]
        parts[k] = lead + val + tail
        size = autofit(f'{sid}.{name}', val)
        if size and k > 0 and 'font-size:' in parts[k - 1]:
            parts[k - 1] = re.sub(r'font-size:\d+px', f'font-size:{size}px', parts[k - 1], count=1)
    return deck._expand_tw(''.join(parts))


def render(template_html, F, scenes=None, art=None):
    pre, secs, post = deck.split_sections(template_html)
    out = []
    for sid, s in secs:
        if scenes and sid in scenes:
            old, new = deck.scene_of(s), scenes[sid]
            if len(old) == len(new):
                for o, n in zip(old, new):
                    s = s.replace(o, n, 1)
        s = _write_section(sid, s, F)
        if sid == 'booktext' and F.get('booktext_html'):
            s = BT_P.sub(lambda m: m.group(1) + F['booktext_html'] + m.group(3), s, count=1)
        out.append(s)
    html = pre + ''.join(out) + post
    if F.get('title'):
        html = HEAD.sub(lambda m: m.group(1) + F['title'] + m.group(3), html, count=1)
        html = HEADB.sub(lambda m: m.group(1) + F['title'] + m.group(3), html, count=1)
    if art:
        code, names = art
        it = iter(names)
        html = IMG.sub(lambda m: m.group(1) + code + m.group(3) + next(it, m.group(4)) + m.group(5), html)
    return html
