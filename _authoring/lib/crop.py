# -*- coding: utf-8 -*-
"""قَصُّ صورَتَيْنِ مُخْتارَتَيْنِ لِكُلِّ دَرْسٍ مِنْ صَفَحاتِ الْكِتابِ."""
import os, subprocess, sys
from PIL import Image

PDF = '/home/claude/g7/t2.pdf'
OUT = '/home/claude/g7/fin'
DPI = 220


def page(n):
    p = f'/home/claude/g7/hi/pg-{n:03d}.png'
    if not os.path.exists(p):
        os.makedirs('/home/claude/g7/hi', exist_ok=True)
        subprocess.run(['pdftoppm', '-r', str(DPI), '-png', '-f', str(n), '-l', str(n),
                        PDF, '/home/claude/g7/hi/pg'], check=True)
    return Image.open(p)


def cut(name, n, box, w=1100):
    """box بِنِسَبٍ (left, top, right, bottom) مِنْ أَبْعادِ الصَّفْحَةِ."""
    im = page(n)
    W, H = im.size
    c = im.crop((int(box[0] * W), int(box[1] * H), int(box[2] * W), int(box[3] * H)))
    if c.width > w:
        c = c.resize((w, int(c.height * w / c.width)), Image.LANCZOS)
    os.makedirs(OUT, exist_ok=True)
    c.convert('RGB').save(f'{OUT}/{name}', 'WEBP', quality=86, method=6)
    print(name, c.size, os.path.getsize(f'{OUT}/{name}'))


if __name__ == '__main__':
    for a in sys.argv[1:]:
        name, n, l, t, r, b = a.split(',')
        cut(name, int(n), (float(l), float(t), float(r), float(b)))
