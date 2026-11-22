#!/usr/bin/env python3
# «المصدر المساند» per lesson for Y5-8 (verbatim excerpts from the supporting source in the Y5 book, p74+) + reading tasks.
import sys, os
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import gen_older as G
from gen_older import esc, sw, doc, page, q, lines, NM, DEPTH
import orig_ss, c2_a, c2_b, c2_c
C2 = {s['stem']: s for s in c2_a.T1 + c2_b.T2 + c2_c.T3}
BR = ('#8A5A1E', '#F6EBD7')
def para(t):
    st = "font-size:13pt;line-height:1.85;margin:4px 0;text-align:justify"
    if t.startswith('- '):
        return "<p style='%s;padding-right:14px'>&bull; %s</p>" % (st, esc(t[2:]))
    return "<p style='%s'>%s</p>" % (st, esc(t))
def blocks(ex):
    out = []
    for ref, ps in ex:
        out.append(("<div style='display:inline-block;background:#F6EBD7;color:#8A5A1E;border-radius:12px;padding:2px 12px;font-weight:700;font-size:11pt;margin:8px 0 2px'>%s</div>" % esc(ref),
                    sum(len(p) for p in ps), ''.join(para(p) for p in ps)))
    return out
def build(stem, y):
    sp = dict(C2[stem]); note, ex = orig_ss.SS[stem]
    sp['pages'] = 'المصدر المساند ' + ' · '.join(r for r, _ in ex)
    B = blocks(ex); pages = [[]]; n = 0
    for b in B:
        if n + b[1] > 2300 and pages[-1]: pages.append([]); n = 0
        pages[-1].append(b); n += b[1]
    html = []
    for i, pg in enumerate(pages):
        h = sw(sp, y, 'المصدر المساند', BR[1], 'أقرأ', BR[0])
        if i == 0:
            h += NM + "<p style='font-size:11.5pt;color:#5B6472;margin:2px 8px 4px'>مقتطفات من «السنع في الإمارات: هوية وطنية وقيم أصيلة»، كتاب الطالب (ص 74 وما بعدها)، منقولة كما وردت.</p>"
            if note: h += "<p style='font-size:11.5pt;color:#8A5A1E;margin:2px 8px 6px'>%s</p>" % esc(note)
        html.append(page(h + ''.join(a + c for a, _, c in pg)))
    d = DEPTH[y]; t = esc(sp['title'].split(': ', 1)[-1])
    b = q(1, BR[0], 'أقرأ المصدر ثم أكتب فكرتين وردتا فيه عن «%s» %s' % (t, d[0]), lines(3))
    b += q(2, BR[0], 'أقارن بين ما درسته في الكتاب (%s) وما قرأته هنا: أذكر معلومة جديدة وجدتها في المصدر المساند %s' % (esc(C2[stem]['pages']), d[1]), lines(3))
    b += q(3, BR[0], 'أختار عبارة أو مثلًا أو قولًا ورد في المصدر وأشرح معناه بكلماتي، ثم أذكر موقفًا يُقال فيه:', lines(3))
    b += q(4, BR[0], 'أطبّق ما قرأت: ' + d[2].lstrip('و'), lines(3))
    html.append(page(sw(sp, y, 'أقرأ وأحلل', BR[1], 'أقرأ وأحلل', BR[0]) + NM + b))
    return doc('المصدر المساند · ' + sp['title'], ''.join(html))
if __name__ == '__main__':
    ys = [int(a) for a in sys.argv[1:]] or [5, 6, 7, 8]
    n = 0
    for y in ys:
        for stem in C2:
            d = '/home/claude/hira/resources/ssd/SN-Y%d-%s/' % (y, stem)
            open(d + 'supporting-source.html', 'w', encoding='utf8').write(G.noemoji(build(stem, y))); n += 1
    print(n, 'files')
