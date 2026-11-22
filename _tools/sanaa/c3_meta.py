import sys, os, importlib
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
LES = []
for m in 'abcdefghijkl': LES += importlib.import_module('c3_' + m).C3
YEARS = (9, 10, 11, 12)
import re
LES_SORT = lambda L: sorted(L, key=lambda s: (int(s['stem'][1]), int(s['stem'][4:])))
def term(stem): return int(stem[1])
def code(y, stem): return 'SN-Y%d-%s' % (y, stem)
LES[:] = LES_SORT(LES)
def units():
    seen = []; 
    for s in LES:
        k = (term(s['stem']), s['unit'])
        if k not in seen: seen.append(k)
    out = []; cnt = {}
    for t, u in seen:
        cnt[t] = cnt.get(t, 0) + 1; out.append((t, cnt[t], u))
    return out
