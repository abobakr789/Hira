# -*- coding: utf-8 -*-
"""Template engine for Hiraa teacher decks.

A published deck is the template. A section is a sequence of tag/text tokens;
content lives in text nodes OUTSIDE any <svg> (svg text is scene artwork, and
scenes are replaced wholesale). A word-animated run of <span class="tw"> spans
is collapsed to a single logical node and re-expanded on write.
"""
import re

TOK = re.compile(r'(<[^>]+>)')
SEC = re.compile(r'(?=<section class="sl)')
TWRUN = re.compile(
    r'<span class="tw" style="animation-delay:[0-9.]+s">[^<]*</span>'
    r'(?:\s*<span class="tw" style="animation-delay:[0-9.]+s">[^<]*</span>)*')
TW_START, TW_STEP = 0.25, 0.07


def split_sections(html):
    i = html.index('<section class="sl')
    j = html.rindex('</section>') + len('</section>')
    pre, post = html[:i], html[j:]
    secs = [s for s in SEC.split(html[i:j]) if s.strip()]
    ids = [re.search(r'id="([^"]+)"', s).group(1) for s in secs]
    return pre, list(zip(ids, secs)), post


def tw_build(words, start=TW_START, step=TW_STEP):
    """Rebuild a word-animated run from a list of words."""
    return ' '.join(
        f'<span class="tw" style="animation-delay:{start + step * i:.2f}s">{w}</span>'
        for i, w in enumerate(words))


def _collapse_tw(sec):
    """Replace each tw-span run with a plain text node holding the joined words."""
    return TWRUN.sub(
        lambda m: ''.join(re.findall(r'>([^<]*)</span>', m.group(0))) and
        '<i data-tw="1">' + ' '.join(re.findall(r'>([^<]*)</span>', m.group(0))) + '</i>',
        sec)


def _expand_tw(sec):
    return re.sub(r'<i data-tw="1">([^<]*)</i>',
                  lambda m: tw_build(m.group(1).split(' ')), sec)


def nodes(sec):
    """-> (parts, [(part_index, text)]) for content text nodes only."""
    parts = TOK.split(_collapse_tw(sec))
    out, depth = [], 0
    for k, p in enumerate(parts):
        if k % 2:                                  # a tag
            t = p.lower()
            if t.startswith('<svg'):
                depth += 1
            elif t.startswith('</svg'):
                depth -= 1
            continue
        if depth == 0 and p.strip():
            out.append((k, p))
    return parts, out


def texts(sec):
    return [t for _, t in nodes(sec)[1]]


def set_texts(sec, new):
    parts, ns = nodes(sec)
    if len(ns) != len(new):
        raise ValueError(f'{len(ns)} slots vs {len(new)} values')
    for (k, old), v in zip(ns, new):
        if v is None or v == old:
            continue
        lead = old[:len(old) - len(old.lstrip())]
        tail = old[len(old.rstrip()):]
        parts[k] = lead + v + tail if v.strip() else v
    return _expand_tw(''.join(parts))


def scene_of(sec):
    """The section's artwork SVGs, in order."""
    return re.findall(r'<svg\b.*?</svg>', sec, re.S)


def imgs(html):
    return re.findall(r'src="\.\./\.\./ssbook/([^/]+)/([^"]+)"', html)
