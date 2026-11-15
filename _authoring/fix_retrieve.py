# -*- coding: utf-8 -*-
"""إصلاحُ شَريحَةِ التَّهْيِئَةِ: سؤالُ «مِنَ الدَّرْسِ السّابِقِ» يَخُصُّ الدَّرْسَ السّابِقَ فِعْلًا.

كانَتِ الشَّريحَةُ تَحْمِلُ في كُلِّ الدُّروسِ سؤالَ درسِ القالَبِ نفسِه،
فَصارَتِ الْآنَ تُبْنى مِنْ مَفاتيحِ الدَّرْسِ الَّذي قَبْلَهُ في التَّسَلْسُلِ.
"""
import json, glob, os, re, sys

sys.path.insert(0, '/home/claude/hira/_authoring/lib')
import deck

REPO = '/home/claude/hira/resources/ssd'
AUTH = '/home/claude/hira/_authoring'
Q_I, A_I, LBL_I, ASIDE_I = 4, 5, 3, 9


_TAIL = ('مِنْ', 'من', 'في', 'إِلى', 'إلى', 'عَلى', 'على', 'عَنْ', 'عن', 'أَوْ', 'أو',
         'مَعَ', 'مع', 'الَّتي', 'التي', 'الَّذي', 'الذي', 'بَيْنَ', 'بين', 'ثُمَّ', 'ثم',
         'وَهِيَ', 'وهي', 'وَهُوَ', 'وهو', 'كَما', 'كما', 'لِ', 'بِ', 'وَ')


def _short(m, n=52):
    """أَوَّلُ جُمْلَةٍ مِنَ الْمَعْنى، مَقْطوعَةً عِنْدَ كَلِمَةٍ تامَّةٍ لا عِنْدَ حَرْفِ جَرٍّ."""
    m = re.split(r'[؛\.]', m.strip())[0].strip()
    full = len(m) <= n
    if not full:
        cut = m.rfind(' ', 0, n)
        m = m[:cut if cut > 20 else n].strip()
    ws = m.rstrip('،').split()
    while ws and (ws[-1] in _TAIL or ws[-1].endswith('ِ') and len(ws[-1]) <= 2):
        ws.pop()
        full = False
    out = ' '.join(ws).rstrip('،').strip()
    return out if full else out + '…'


def load(grade):
    out = {}
    for f in glob.glob(f'{AUTH}/{grade}.json') + glob.glob(f'{AUTH}/ss-y{grade}-*.json'):
        for L in json.load(open(f, encoding='utf-8')):
            out[L['code']] = L
    def key(c):
        return (int(re.search(r'-T(\d)-', c).group(1)), out[c]['sort'])
    return [out[c] for c in sorted(out, key=key)]


def fix(grade, dry=False):
    seq = load(grade)
    n = 0
    for i, L in enumerate(seq):
        p = f"{REPO}/{L['code']}/teacher-deck.html"
        h = open(p, encoding='utf-8').read()
        pre, secs, post = deck.split_sections(h)
        d = dict(secs)
        sec = d['retrieve']
        t = deck.texts(sec)
        if i == 0:
            lbl = 'قَبْلَ أَنْ نَبْدَأَ'
            q = f"ماذا نَعْرِفُ عَنْ «{L['title']}»؟"
            a = 'نَجْمَعُ ما يَعْرِفُهُ الطُّلّابُ، ثُمَّ نَعودُ إِلَيْهِ في نِهايَةِ الدَّرْسِ.'
            aside = 'تهيئة: اجمع ما يعرفه الطلاب أولًا، ثم انتقل إلى سؤال اليوم.'
        else:
            P = seq[i - 1]
            w = P['sm']['words']
            lbl = 'مِنَ الدَّرْسِ السّابِقِ'
            q = f'ما {w[0][0]}؟ وَما {w[1][0]}؟'
            a = f'{_short(w[0][1])} · {_short(w[1][1])}'
            aside = f"تهيئة: اربط بالدرس السابق «{P['title']}» قبل الانتقال."
        new = list(t)
        new[LBL_I], new[Q_I], new[A_I], new[ASIDE_I] = lbl, q, a, aside
        if new == t:
            continue
        ns = deck.set_texts(sec, new)
        if not dry:
            open(p, 'w', encoding='utf-8').write(h.replace(sec, ns, 1))
        n += 1
        if dry and i < 3:
            print(' ', L['code'], '|', q, '||', a)
    return n, len(seq)


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    for g in (args or (5, 6, 7)):
        print(f'Y{g}:', fix(g, dry='--dry' in sys.argv))
