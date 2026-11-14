# -*- coding: utf-8 -*-
"""Headless QA for a Hiraa teacher deck: per-slide overflow, broken images, JS errors."""
import sys, json, asyncio
from playwright.async_api import async_playwright

W, H = 1920, 1080

async def check(path):
    rep = {'file': path, 'errors': [], 'overflow': [], 'broken': [], 'slides': 0}
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': W, 'height': H})
        pg.on('pageerror', lambda e: rep['errors'].append(str(e)[:200]))
        await pg.goto('file://' + path)
        await pg.wait_for_timeout(1200)
        rep['slides'] = await pg.evaluate("document.querySelectorAll('section.sl').length")
        rep['overflow'] = await pg.evaluate("""() => {
          const out=[];
          document.querySelectorAll('section.sl').forEach(s=>{
            const prev=s.style.display; s.style.display='block';
            const sb=s.getBoundingClientRect(); let maxB=0,maxR=0;
            s.querySelectorAll('*').forEach(e=>{
              const txt=(e.textContent||'').trim();
              if(!txt) return;                       // decoration: not a content risk
              if(e.children.length && [...e.children].some(c=>(c.textContent||'').trim())) return;
              const r=e.getBoundingClientRect();
              if(r.height===0&&r.width===0) return;
              maxB=Math.max(maxB,r.bottom-sb.top); maxR=Math.max(maxR,r.right-sb.left);
            });
            s.style.display=prev;
            if(maxB>1040||maxR>1930) out.push({id:s.id,bottom:Math.round(maxB),right:Math.round(maxR)});
          });
          return out;}""")
        rep['broken'] = await pg.evaluate("""() => [...document.images]
            .filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.getAttribute('src'))""")
        await b.close()
    return rep

if __name__ == '__main__':
    for f in sys.argv[1:]:
        r = asyncio.run(check(f))
        bad = r['errors'] or r['overflow'] or r['broken'] or r['slides'] != 30
        print(('FAIL ' if bad else 'PASS ') + f.split('/')[-2] + f"  slides={r['slides']}"
              + (f" overflow={r['overflow']}" if r['overflow'] else '')
              + (f" broken={r['broken']}" if r['broken'] else '')
              + (f" js={r['errors']}" if r['errors'] else ''))
