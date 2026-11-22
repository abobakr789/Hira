#!/usr/bin/env python3
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import genlesson as G, lessons_t2t3 as L
specs = L.build()
a = sys.argv[1:]; y = 1
if a and a[0] == '--y': y = int(a[1]); a = a[2:]
for k in (a or list(specs)): G.run(specs[k], y)
