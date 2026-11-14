# -*- coding: utf-8 -*-
"""يُعيدُ شريحةَ «أتوقّع» التالفةَ من آخرِ نسخةٍ سليمةٍ في المستودع."""
import sys, subprocess, glob, os
sys.path.insert(0, '/tmp/g5/lib')
import deck

REPO = '/tmp/hpush'
GOOD = '81ded2a3~1'          # آخرُ عهدٍ قبلَ الخللِ


def good_predict(code):
    path = f'resources/ssd/{code}/teacher-deck.html'
    try:
        blob = subprocess.run(['git', '-C', REPO, 'show', f'{GOOD}:{path}'],
                              capture_output=True, text=True, check=True).stdout
    except subprocess.CalledProcessError:
        return None
    return dict(deck.split_sections(blob)[1]).get('predict')


def main():
    done, missing = [], []
    for p in sorted(glob.glob(f'{REPO}/resources/ssd/SS-Y5-*/teacher-deck.html')):
        code = os.path.basename(os.path.dirname(p))
        h = open(p, encoding='utf-8').read()
        cur = dict(deck.split_sections(h)[1]).get('predict')
        if not cur or len(deck.texts(cur)) > 9:      # سليمةٌ أصلًا
            continue
        g = good_predict(code)
        if not g:
            missing.append(code); continue
        open(p, 'w', encoding='utf-8').write(h.replace(cur, g, 1))
        done.append(code)
    print('أُعيدت', len(done), 'شريحةً | بلا نسخةٍ سليمةٍ:', missing)


if __name__ == '__main__':
    main()
