#!/usr/bin/env python3
# Module quiz (10 objective questions + key) per unit per grade, Y5-12. Questions are drawn from the lesson specs of the unit.
import sys, os, collections
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen_older as G
from gen_older import esc, sw, mc, doc, page, q, row, lines, NM
import c2_a, c2_b, c2_c, c3_meta as M
C2 = c2_a.T1 + c2_b.T2 + c2_c.T3
def units_of(specs):
    d = collections.OrderedDict()
    for s in specs: d.setdefault((s['stem'][1], s['unit']), []).append(s)
    return d
def pick(specs, y):
    sp = [G._shuf(dict(s)) for s in specs]
    mc_, tf_ = [], []
    for j in range(3):
        for k in range(len(sp)):
            s = sp[(k + y) % len(sp)]
            mc_.append((s['title'], s['mcq'][(j + y) % 3]))
    for j in range(6):
        for k in range(len(sp)):
            s = sp[(k + y) % len(sp)]
            tf_.append((s['title'], s['tf'][(j + y) % 6]))
    nm = min(6, len(mc_)); nt = min(10 - nm, len(tf_))
    # de-duplicate by question text
    seen = set(); A = []
    for t, x in mc_:
        if x[0] not in seen: seen.add(x[0]); A.append(x)
    seen = set(); B = []
    for t, x in tf_:
        if x[0] not in seen: seen.add(x[0]); B.append(x)
    return A[:nm], B[:nt]
def quiz(unit, y, A, B):
    c = ('#2F6A9A', '#DDEBF7'); s0 = {'title': unit, 'pages': 'عشرة أسئلة'}
    h = sw(s0, y, 'اختبار المحور', c[1], 'أختبر نفسي', c[0])
    b1 = h + NM + q(1, c[0], 'أختار الإجابة الصحيحة:', ''.join(mc(i + 1, x[0], x[1]) for i, x in enumerate(A)))
    b2 = sw(s0, y, 'اختبار المحور', c[1], 'أختبر نفسي', c[0]) + q(2, c[0], 'أضع ( ✓ ) أمام العبارة الصحيحة و( ✗ ) أمام الخاطئة:', ''.join(row('%d. %s  ( &nbsp;&nbsp; )' % (len(A) + i + 1, esc(t[0]))) for i, t in enumerate(B)))
    b2 += "<div style='margin-top:10px;font-size:12pt'>درجتي: ( &nbsp;&nbsp;&nbsp; ) من %d</div>" % (len(A) + len(B))
    return doc('اختبار المحور · ' + unit, page(b1) + page(b2))
def key(unit, y, A, B):
    c = ('#3F6E5B', '#DCEAE4'); s0 = {'title': unit, 'pages': 'للمعلم'}
    h = sw(s0, y, 'مفتاح اختبار المحور', c[1], 'للمعلم', c[0])
    ab = 'أبج'
    r = ''.join("<div class='row'><span class='s'><b>%d.</b> %s</span></div>" % (i + 1, esc('(%s) %s' % (ab[x[2]], x[1][x[2]]))) for i, x in enumerate(A))
    r += ''.join("<div class='row'><span class='s'><b>%d.</b> %s%s</span></div>" % (len(A) + i + 1, 'صحيحة' if t[1] else 'خاطئة', '' if t[1] else ' — ' + esc(t[2])) for i, t in enumerate(B))
    return doc('مفتاح اختبار المحور · ' + unit, page(h + r))
def run(specs_by_year, ids_fn, rows):
    for y, specs in specs_by_year:
        for (t, unit), L in units_of(specs).items():
            A, B = pick(L, y)
            last = L[-1]['stem']; code = 'SN-Y%d-%s' % (y, last)
            out = '/home/claude/hira/resources/ssd/%s/' % code
            open(out + 'unit-quiz.html', 'w', encoding='utf8').write(G.noemoji(quiz(unit, y, A, B)))
            open(out + 'unit-quiz-key.html', 'w', encoding='utf8').write(G.noemoji(key(unit, y, A, B)))
            rows.append((code, unit, len(A) + len(B)))
if __name__ == '__main__':
    rows = []
    run([(y, C2) for y in (5, 6, 7, 8)] + [(y, M.LES) for y in (9, 10, 11, 12)], None, rows)
    for r in rows[:3]: print(r)
    print(len(rows), set(r[2] for r in rows))
    open('/tmp/quiz_rows.txt', 'w', encoding='utf8').write('\n'.join('%s|%s' % (r[0], r[1]) for r in rows))
