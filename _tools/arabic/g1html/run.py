import sys, os
sys.path.insert(0,"/home/claude/ar")
import deck
codes=sys.argv[2:]; mode=sys.argv[1]
for c in codes:
    html,n=deck.build(c,mode)
    out=(f"/home/claude/Hira/resources/ar/{c}/teacher-deck.html" if mode=="site" else f"/mnt/user-data/outputs/preview/{c}.html")
    os.makedirs(os.path.dirname(out),exist_ok=True); open(out,"w").write(html); print(c,n,len(html))
