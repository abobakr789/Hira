import sys, importlib, json
sys.path.insert(0, '.')
from young import deck
from engine import overlaps, export, render_check
from playwright.sync_api import sync_playwright
S = importlib.import_module('lessons.' + sys.argv[1]).S
D = deck(S); print('slides', len(D.slides), 'overlaps', overlaps(D))
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1280, 'height': 720})
    print('clipped', render_check(pg, D, '/tmp/y_')); b.close()
export(S['code'], D, '/home/claude/Hira')
