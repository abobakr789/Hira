import sys, subprocess
mode=sys.argv[1] if len(sys.argv)>1 else "site"
subprocess.run(["python3","gen.py",mode],check=True)
import shell; shell.MODE["m"]=mode
html=shell.page("أوشي الأرنب الأكول (أ)",open("/home/claude/ar/slides.html").read(),"cea166f0-e76b-4c10-bf14-785905df1832","AR-Y1-N-T1-L01")
out={"site":"/home/claude/Hira/resources/ar/AR-Y1-N-T1-L01/teacher-deck.html","preview":"/mnt/user-data/outputs/hiraa-ar-g1-l01-deck.html"}[mode]
open(out,"w").write(html); print(out,len(html))
