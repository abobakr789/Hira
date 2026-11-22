import sys, os, importlib
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
LES = []
for m in 'abcdefghijk': LES += importlib.import_module('c3_' + m).C3
YEARS = (9, 10, 11, 12)
def term(stem): return int(stem[1])
def code(y, stem): return 'SN-Y%d-%s' % (y, stem)
def units():
    seen = []; 
    for s in LES:
        k = (term(s['stem']), s['unit'])
        if k not in seen: seen.append(k)
    out = []; cnt = {}
    for t, u in seen:
        cnt[t] = cnt.get(t, 0) + 1; out.append((t, cnt[t], u))
    return out
