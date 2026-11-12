# Convert existing Hiraa free-slide decks (resources/slides/<code>.json) into the standalone HTML teacher-deck design.
import re, json, os, sys, html as H
import art
from shell import A, logo, page, MODE, ROOT
from deck import BGS, TH, DK, deco, bare, bidify
EMO=re.compile(r"^[^\u0600-\u06FFA-Za-z0-9«(\"']+")
def esc(t): return H.escape(str(t or ""),quote=False)
def kw(t): return re.sub(r"\[\[(.+?)\]\]",r'<mark>\1</mark>',t)
def hexc(c,d="1F2A3C"): return "#"+(c or d)
LIGHT={"FFFDF8","FFFFFF","F2FAF4","EAF5F4","FFFDF7","F6EEDC","FFF6DA","F4EFFB","EEF4FB","FBF6EC","E2F0EF"}
def conv(code, mode="site"):
    MODE["m"]=mode
    D=json.load(open(f"{ROOT}resources/slides/{code}.json")); SL=D["slides"]; en=D.get("en")
    # ---------- cover ----------
    s0=SL[0]; tx=[e for e in s0["els"] if e["k"]=="text"]
    title_el=max(tx,key=lambda e:e.get("size",0)) if tx else {"text":code}
    title=title_el["text"].strip()
    rest=[e for e in tx if e is not title_el]
    kick=next((e["text"] for e in sorted(rest,key=lambda e:e["y"]) if e["y"]<title_el["y"]),"")
    goal0=next((e["text"] for e in rest if e["text"].strip().startswith("🎯")),"")
    byl=" · ".join(e["text"] for e in rest if e["text"] not in (kick,goal0) and len(e["text"])<70)
    pic=next((e for e in s0["els"] if e["k"]=="pic"),None); em=next((e for e in s0["els"] if e["k"]=="img"),None)
    picsrc=A(pic["src"]) if pic and os.path.exists(ROOT+pic["src"]) else None
    out=[]
    out.append(f'''<section class="sl" id="cover" dir="{'ltr' if en else 'rtl'}" style="--a:#B4532A;--a2:#FBE6D8;background:linear-gradient(135deg,#FDF0DC 0%,#FBF7EF 48%,#E4F1EA 100%)">
<img class="dc" src="{A('art/lanterns.webp')}" style="left:560px;top:0;width:250px" alt="">
<i class="dc" style="left:-200px;bottom:-260px;width:760px;height:760px;border-radius:50%;background:#F2A93B;opacity:.10"></i>
<div class="hlogo cvlogo">{logo(380)}</div>
<div class="cvpic g"><div class="cvsun"></div>{f'<img class="cvimg" src="{picsrc}" alt="">' if picsrc else ''}<div class="cvL e"><span>{esc(em["emo"]) if em else "📖"}</span></div></div>
<div class="cvtx"><p class="cvk">{esc(kick)}</p><h1 class="cvt{' s' if len(bare(title))>22 else ''}">{esc(title)}</h1><p class="cvs">{esc(goal0)}</p></div>
<p class="cvb">{esc(byl)}</p><aside>{esc(s0.get("n",""))}</aside></section>''')
    strip=""
    for si,s in enumerate(SL[1:],1):
        els=[e for e in s["els"] if not (e["k"]=="shape" and e["h"]<=16 and e["w"]<=40)]
        txt=[e for e in els if e["k"]=="text"]
        timer=next((e for e in txt if "⏱" in e.get("text","")),None)
        label=next((e for e in txt if e is not timer and e["y"]<60 and e.get("size",0)<=26),None)
        cands=[e for e in txt if e not in (timer,label) and e["y"]<180 and e.get("size",0)>=30]
        head=max(cands,key=lambda e:e["size"]) if cands else None
        goal=next((e for e in txt if e["text"].strip().startswith("🎯") and e["y"]>=590 and e["h"]<=60),None)
        if goal: strip=EMO.sub("",goal["text"]).strip()
        body=[e for e in els if e not in (timer,label,head,goal) and not (e["k"]=="shape" and e["w"]>=1200 and e["y"]<20)]
        if not body and not head: continue
        # bbox of body
        if body:
            x0=min(e["x"] for e in body); y0=min(e["y"] for e in body); x1=max(e["x"]+e["w"] for e in body); y1=max(e["y"]+e["h"] for e in body)
        else: x0,y0,x1,y1=0,0,1,1
        sc=min(1700/max(1,x1-x0),690/max(1,y1-y0),1.55); ox=(1700-(x1-x0)*sc)/2
        bg=TH[si%len(TH)]; bgc,a,a2=BGS[bg]
        parts=[]
        for j,e in enumerate(body):
            x=ox+(e["x"]-x0)*sc; y=(e["y"]-y0)*sc; w=e["w"]*sc; h=e["h"]*sc
            pos=f"left:{x:.0f}px;top:{y:.0f}px;width:{w:.0f}px;height:{h:.0f}px;"
            rv=f' data-build-in="up {e["rv"]}"' if e.get("rv") else ""
            if e["k"]=="shape":
                f=e.get("fill") or "FFFFFF"
                if f.upper() in LIGHT or f.upper()=="FFFDF8":
                    st=f"background:#fff;border-radius:{'50%' if e.get('oval') else '26px'};box-shadow:0 14px 30px rgba(31,42,60,.10);"+("border-right:9px solid var(--a);" if w>160 and h>80 and not e.get("oval") else "")
                else: st=f"background:#{f};border-radius:{'50%' if e.get('oval') else '22px'};"
                parts.append(f'<div class="cv-el"{rv} style="{pos}{st}"></div>')
            elif e["k"]=="pic":
                src=e["src"]
                if not os.path.exists(ROOT+src.split("?")[0]): continue
                parts.append(f'<img class="cv-el"{rv} src="{A(src)}" alt="" style="{pos}object-fit:{"cover" if e.get("cover") else "contain"};border-radius:22px;background:#fff;box-shadow:0 10px 24px rgba(31,42,60,.12)">')
            elif e["k"]=="img":
                parts.append(f'<div class="cv-el cv-emo"{rv} style="{pos}font-size:{h*.8:.0f}px">{esc(e.get("emo",""))}</div>')
            elif e["k"]=="text":
                t=e.get("text","")
                if not t.strip(): continue
                f=(e.get("fill") or "")
                isans=t.strip().startswith("✅") or f.upper()=="F2FAF4"
                fill=("background:linear-gradient(160deg,#EAF7EE,#DDF2E3);color:#0B5D3B;" if isans else (f"background:#{f};" if f and f.upper()!="FFFDF8" else ""))
                if f.upper() in ("1E3A3F","0F6E72","27474D") : fill=f"background:#{f};"
                col=hexc(e.get("color")); 
                if f.upper() in ("1E3A3F","27474D") and col.upper() in ("#1E3A3F","#1F2A3C"): col="#FFFFFF"
                al=e.get("align") or "right"; rtl=bool(re.search(r"[\u0600-\u06FF]",t))
                jc="center" if al=="center" else ("flex-end" if (al=="left")==rtl else "flex-start")
                fs=e.get("size",24)*sc*1.0
                parts.append(f'<div class="cv-el cv-tx" dir="{"rtl" if rtl else "ltr"}"{rv} style="{pos}font-size:{fs:.0f}px;color:{col};font-weight:{700 if e.get("bold") else 500};justify-content:{jc};text-align:{al};{fill}{"border-radius:18px;" if (fill or e.get("rad")) else ""}"><span>{kw(esc(t))}</span></div>')
        chips=""
        if label:
            lt=re.sub(r"المرحلة\s*\d+\s*من\s*\d+\s*[·:\-]?\s*","",EMO.sub("",label["text"]).strip()).strip() or label["text"]
            chips+=f'<span class="pill">{esc(lt)}</span>'
        if timer: chips+=f'<span class="pill tm">{esc(timer["text"])}</span>'
        ht=esc(head["text"]) if head else esc(EMO.sub("",label["text"]) if label else "")
        hd=f'<div class="hlogo">{logo(196)}</div><h2 class="ht{" s" if len(bare(ht))>32 else ""}">{ht}</h2><div class="hrow">{chips}</div>'
        ft=f'<div class="ft"><div class="ftr"><span class="ftl">{logo(92)}</span><span>{esc(title)}</span></div>{f"<div class=goal>🎯 {esc(strip)}</div>" if strip else "<div></div>"}<div class="dots"><b style="background:#E2574C"></b><b style="background:#F2A93B"></b><b style="background:#1E7A5A"></b><b style="background:#2F64A8"></b></div></div>'
        out.append(f'<section class="sl" id="s{si}" dir="{"ltr" if en else "rtl"}" style="--bg:{bgc};--a:{a};--a2:{a2};background:{bgc}">{deco(DK[(si*5)%len(DK)],a)}{hd}<div class="bd cvb2">{"".join(parts)}</div>{ft}<aside>{esc(s.get("n",""))}</aside></section>')
    return page(bare(title),bidify("".join(out)),None,code,deep=True), len(out)
if __name__=="__main__":
    mode=sys.argv[1]
    for c in sys.argv[2:]:
        h,n=conv(c,mode)
        o=f"{ROOT}resources/ar/{c}/teacher-deck.html" if mode=="site" else f"/mnt/user-data/outputs/preview/{c}.html"
        os.makedirs(os.path.dirname(o),exist_ok=True); open(o,"w").write(h); print(c,n,len(h))
