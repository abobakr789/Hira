import sys, os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen_older as G, ids_c2
LES = []
for m in ('c2_a', 'c2_b', 'c2_c'):
    try: LES += list(getattr(__import__(m), 'T1' if m == 'c2_a' else ('T2' if m == 'c2_b' else 'T3')))
    except ImportError: pass
a = sys.argv[1:]; ys = [5, 6, 7, 8]
if a and a[0] == '--y': ys = [int(a[1])]; a = a[2:]
for sp in LES:
    if a and sp['stem'] not in a: continue
    for y in ys: G.run(sp, y, ids_c2.IDS)
