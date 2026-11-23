import sys, os
import sys as _s, os as _o; _s.path.insert(0, _o.path.join(_o.path.dirname(_o.path.abspath(__file__)), "..", "g1images")); import g1images  # slide pictures (grade 1 native Arabic), see ../g1images
sys.path.insert(0,"/home/claude/ar")
import deck
codes=sys.argv[2:]; mode=sys.argv[1]
for c in codes:
    html,n=deck.build(c,mode)
    out=(f"/home/claude/Hira/resources/ar/{c}/teacher-deck.html" if mode=="site" else f"/mnt/user-data/outputs/preview/{c}.html")
    html=g1images.apply_html(c,html) if mode=="site" else html
    os.makedirs(os.path.dirname(out),exist_ok=True); open(out,"w").write(html); print(c,n,len(html))
