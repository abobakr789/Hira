"""Y1-4 Sanaa: the 'gold' worksheet page (choose a word + copy neatly) is easier than 'bronze'.
Reorder levels so difficulty rises: old gold -> bronze, old bronze -> silver, old silver -> gold, diamond stays.
Applies to worksheets-A4.html (page order, labels, colours), answer-key.html (blocks), and the deck's
«كلٌّ في مستواه» slide (levelsn). Also fixes the duplicated word «يُظْهِرُ يُظْهِرُ». Idempotent (marker)."""
import re, glob, sys
ROOT = '/home/claude/hira/resources/ssd/'
MARK = '<!--lv-fixed-->'
NAMES = ['بُرونْزِيٌّ', 'فِضِّيٌّ', 'ذَهَبِيٌّ', 'ماسِيٌّ']
COL = ['#9A5A26', '#5E6672', '#A87A0C', '#5546A3']
PALE_WS = ['#F7E9DC', '#EDEFF2', '#FBF1D3', '#EEEAFB']
NEW_OF_OLD = {2: 0, 0: 1, 1: 2, 3: 3}          # old tier -> new tier
ORDER = [2, 0, 1, 3]                         # new page order, by old tier


def recolor(s, o, n):
    if o == n: return s
    tok = '\x00%d\x00'
    s = s.replace(COL[o], tok % 1).replace(PALE_WS[o], tok % 2)
    s = s.replace('الْمُسْتَوى: ' + NAMES[o], 'الْمُسْتَوى: ' + NAMES[n]).replace('<b>' + NAMES[o] + ':</b>', '<b>' + NAMES[n] + ':</b>')
    return s.replace(tok % 1, COL[n]).replace(tok % 2, PALE_WS[n])


def fix_ws(t):
    parts = t.split("<div class='page'>")
    if len(parts) != 5: return None
    head, pages = parts[0], parts[1:]
    tiers = []
    for p in pages:
        m = re.search(r"الْمُسْتَوى: ([^<]+)</span>", p)
        tiers.append(NAMES.index(m.group(1).strip()))
    if tiers != [0, 1, 2, 3]: return None
    # last page carries the document tail; keep it at the end
    tail_i = pages[3].rfind('</body>')
    last_body = pages[3]
    out = [recolor(pages[o], o, NEW_OF_OLD[o]) for o in ORDER]
    return head + ''.join("<div class='page'>" + p for p in out)


def fix_key(t):
    blocks = list(re.finditer(r"<div class='k' style='border-color:(#\w+);background:#\w+'><b>([^<:]+):</b>.*?</div>", t, re.S))
    lv = [b for b in blocks if b.group(2).strip() in NAMES]
    if len(lv) != 4 or [NAMES.index(b.group(2).strip()) for b in lv] != [0, 1, 2, 3]: return None
    seg = [b.group(0) for b in lv]
    new = ''.join(recolor(seg[o], o, NEW_OF_OLD[o]) for o in ORDER)
    return t[:lv[0].start()] + new + t[lv[3].end():]


def fix_deck(t):
    m = re.search(r'<section class="sl"[^>]*id="levelsn".*?</section>', t, re.S)
    if not m: return None
    s = m.group(0)
    cards = list(re.finditer(r'(<div data-build-in="pop (\d)" style="flex:1;[^>]*border-right:8px[^>]*><p[^>]*>[^<]*</p>)(.*?)(</div>)', s, re.S))
    if len(cards) != 3: return None
    items = [c.group(3) for c in cards]
    new_items = [items[2], items[0], items[1]]
    out, pos = [], 0
    for c, it in zip(cards, new_items):
        out.append(s[pos:c.start()]); out.append(c.group(1) + it + c.group(4)); pos = c.end()
    out.append(s[pos:])
    return t[:m.start()] + ''.join(out) + t[m.end():]


def dup(t):
    return t.replace('يُظْهِرُ يُظْهِرُ', 'يُظْهِرُ').replace('يظهر يظهر', 'يظهر')


if __name__ == '__main__':
    flt = sys.argv[1:]; n = 0; bad = []
    for d in sorted(glob.glob(ROOT + 'SN-Y[1-4]-*')):
        if flt and not any(x in d for x in flt): continue
        ws, ak, dk = d + '/worksheets-A4.html', d + '/answer-key.html', d + '/teacher-deck.html'
        tw = open(ws, encoding='utf-8').read()
        if MARK in tw: continue
        a = fix_ws(tw); b = fix_key(open(ak, encoding='utf-8').read()); c = fix_deck(open(dk, encoding='utf-8').read())
        if a is None or b is None or c is None:
            bad.append((d.split('/')[-1], a is None, b is None, c is None)); continue
        a = a.replace('</head>', MARK + '</head>', 1)
        for f, s in ((ws, a), (ak, b), (dk, c)):
            open(f, 'w', encoding='utf-8').write(dup(s))
        n += 1
    print('fixed', n, 'bad', bad)
