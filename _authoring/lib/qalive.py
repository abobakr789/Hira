# -*- coding: utf-8 -*-
"""فَحْصٌ آلِيٌّ في مُتَصَفِّحٍ: الشَّرائِحُ وَالتَّفاعُلُ وَالصُّوَرُ وَأَخْطاءُ الْجافاسْكْريبْت."""
import sys, glob, os, json
from playwright.sync_api import sync_playwright

REPO = 'https://abobakr789.github.io/Hira/resources/ssd'


def goto(page, sid):
    """يَنْتَقِلُ إِلَى الشَّريحَةِ بِآلِيَّةِ الْعَرْضِ نَفْسِها."""
    page.evaluate(
        "sid => { const a=[...document.querySelectorAll('section.sl')];"
        " show(a.findIndex(s => s.id === sid)); }", sid)
    page.wait_for_timeout(400)


def check(page, code):
    errs, out = [], {}
    page.on('pageerror', lambda e: errs.append(str(e)))
    page.goto(f'{REPO}/{code}/teacher-deck.html')
    page.wait_for_timeout(700)
    out['slides'] = page.eval_on_selector_all('section.sl', 'n => n.length')
    out['broken_img'] = page.evaluate(
        "[...document.images].filter(i => !i.complete || i.naturalWidth === 0).length")
    # النقد: نقرُ «صحيح» لا يَنْقُلُ الشَّريحَةَ، وَيُعَلِّمُ الْبِطاقَةَ
    goto(page, 'critique')
    idx0 = page.evaluate("[...document.querySelectorAll('section.sl')].findIndex(s=>s.classList.contains('on'))")
    btn = page.query_selector('#critique .cbtn')
    btn.click()
    page.wait_for_timeout(350)
    out['cq_marked'] = page.evaluate(
        "document.querySelectorAll('#critique .cq.ok, #critique .cq.no').length")
    out['slide_moved'] = page.evaluate("[...document.querySelectorAll('section.sl')].findIndex(s=>s.classList.contains('on'))") != idx0
    # «علِّلْ»: اللَّوْحَةُ تَظْهَرُ بِالْمُرورِ وَتَبْقى
    chip = page.query_selector('#critique .why')
    chip.hover()
    page.wait_for_timeout(350)
    out['why_on'] = page.evaluate(
        "document.querySelectorAll('#critique .cq.why-on').length")
    out['why_visible'] = page.evaluate(
        "(()=>{const p=document.querySelector('#critique .cq.why-on .whyb');"
        "return p ? getComputedStyle(p).opacity : '0'})()")
    # بِطاقَةُ الْمَفاتيحِ تَنْقَلِبُ
    goto(page, 'vocab')
    page.query_selector('#vocab .flipw').click()
    page.wait_for_timeout(800)
    out['flipped'] = page.evaluate(
        "document.querySelectorAll('#vocab .flipc.flipped').length")
    out['rotated'] = page.evaluate(
        "(()=>{const c=document.querySelector('#vocab .flipc.flipped');"
        "return c ? getComputedStyle(c).transform.slice(0,20) : 'none'})()")
    out['js_errors'] = errs
    return out


def main(pat):
    codes = [f'SS-Y7-T3-L{n}' for n in range(22, 28)]
    bad = 0
    with sync_playwright() as pw:
        b = pw.chromium.launch()
        for c in codes:
            pg = b.new_page(viewport={'width': 1440, 'height': 900})
            r = check(pg, c)
            ok = (r['slides'] == 32 and r['broken_img'] == 0 and r['cq_marked'] == 1
                  and not r['slide_moved'] and r['why_on'] == 1
                  and float(r['why_visible']) > 0.9 and r['flipped'] == 1
                  and 'matrix' in r['rotated'] and not r['js_errors'])
            print(('✅ ' if ok else '❌ ') + c, json.dumps(r, ensure_ascii=False))
            bad += not ok
            pg.close()
        b.close()
    print('PASS' if not bad else f'{bad} FAILED')
    return bad


if __name__ == '__main__':
    sys.exit(1 if main(sys.argv[1] if len(sys.argv) > 1 else 'SS-Y7-T3-*') else 0)
