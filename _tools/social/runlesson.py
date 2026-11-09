import sys, importlib
sys.path.insert(0, '.')
from young import deck
from engine import overlaps, export, render_check
from sheets import build, img
from playwright.sync_api import sync_playwright
M = importlib.import_module('lessons.' + sys.argv[1]); S = M.S
D = deck(S); print(S['code'], 'slides', len(D.slides), 'overlaps', overlaps(D))
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1280, 'height': 720})
    print('clipped', render_check(pg, D, f'/tmp/{S["code"]}_')); b.close()
export(S['code'], D, '/home/claude/Hira')
root = '/home/claude/Hira/'
P = {k: img(root + v) for k, v in S['pics'].items()}
build(M.SH, M.W, P, root + S['pics']['cover'].rsplit('/', 1)[0] + '/'); print('sheets ok')
