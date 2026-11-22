import sys, os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen_older as G, ids_c3, c3_meta as M
a = sys.argv[1:]; ys = list(M.YEARS)
if a and a[0] == '--y': ys = [int(a[1])]; a = a[2:]
for sp in M.LES:
    if a and sp['stem'] not in a: continue
    for y in ys: G.run(sp, y, ids_c3.IDS)
