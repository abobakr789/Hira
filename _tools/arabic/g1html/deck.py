import re, json, sys, os, random, unicodedata, glob
import art, content
from shell import A, logo, page, MODE, ROOT
from content import MEAN, SHAPE, ORDER, NAME
T="/home/claude/Hira/_tools/arabic/"
LV=[("بُرونْزِيٌّ","#A0612F","#F6E7DA"),("فِضِّيٌّ","#5F6C78","#E9EDF1"),("ذَهَبِيٌّ","#B8860B","#FBF0D2"),("تَحَدٍّ","#6B46A8","#EEE7FA")]
BGS={"cream":("#FBF7EF","#B4532A","#FBE6D8"),"mint":("#EEF6F1","#1E7A5A","#D7EEE2"),"sky":("#EEF4FB","#2F64A8","#DCE8F7"),
     "peach":("#FDF1EA","#C2571A","#FBE0CF"),"lilac":("#F4F0FB","#6B46A8","#E6DDF7"),"butter":("#FFF8E6","#B07A12","#FBEBC2"),"rose":("#FCF1F3","#B0395F","#F8DCE3")}
TH=list(BGS)
DK=["blobs","ring","dots","wave","stars","letter"]
HAR="\u064B-\u0652\u0670"
def bare(t): return re.sub(f"[{HAR}\u0640]","",t)
def B(n,k="up"): return f' data-build-in="{k} {n}"'
def kw(t): return re.sub(r"\[\[(.+?)\]\]",r'<mark>\1</mark>',t)
def strip_br(t): return t.replace("[[","").replace("]]","")
def clean_emoji_lead(t): return re.sub(r"^[^\u0600-\u06FF«(]+","",t).strip()
def deco(kind,a,big=""):
    if kind=="blobs": return f'<i class="dc" style="left:-140px;top:-160px;width:460px;height:460px;border-radius:50%;background:{a};opacity:.08"></i><i class="dc" style="right:-120px;bottom:-200px;width:520px;height:520px;border-radius:50%;background:{a};opacity:.07"></i>'
    if kind=="ring": return f'<i class="dc" style="right:-160px;top:-170px;width:440px;height:440px;border-radius:50%;border:26px solid {a};opacity:.10"></i><i class="dc" style="left:-110px;bottom:-150px;width:360px;height:360px;border-radius:50%;background:{a};opacity:.07"></i>'
    if kind=="dots":
        d="".join(f'<b style="width:12px;height:12px;border-radius:50%;background:{a};opacity:{.45 if k%3==0 else .18}"></b>' for k in range(24))
        return f'<i class="dc" style="left:60px;top:300px;display:grid;grid-template-columns:repeat(4,12px);gap:26px">{d}</i><i class="dc" style="right:-120px;bottom:-160px;width:420px;height:420px;border-radius:50%;background:{a};opacity:.07"></i>'
    if kind=="wave": return f'<svg class="dc" style="left:0;bottom:0;width:1920px;height:220px" viewBox="0 0 1920 220" preserveAspectRatio="none"><path d="M0 120 Q480 40 960 110 T1920 90 V220 H0Z" fill="{a}" opacity=".08"/><path d="M0 170 Q520 110 1040 160 T1920 150 V220 H0Z" fill="{a}" opacity=".07"/></svg>'
    if kind=="stars": return "".join(f'<i class="dc" style="left:{x}px;top:{y}px;opacity:{o}">{art.star(s,s,a)}</i>' for x,y,s,o in [(40,310,46,.25),(1840,520,38,.22),(150,880,30,.2),(1760,250,28,.2),(980,980,26,.16)])
    if kind=="letter" and big: return f'<i class="dc bigL" style="left:40px;bottom:-170px;color:{a}">{big}</i><i class="dc" style="right:-140px;top:-150px;width:400px;height:400px;border-radius:50%;background:{a};opacity:.07"></i>'
    return deco("blobs",a)
class Deck:
    def __init__(s,title,strip,big=""): s.SL=[]; s.title=title; s.strip=strip; s.big=big; s.k=0
    def slide(s,sid,title,pill,body,note,mins=None,strat=None,crit=None,bg=None,dk=None):
        en=getattr(s,"en",{}).get(sid)
        if en: pill=(pill+" · " if pill else "")+f'<span dir="ltr">{en}</span>'
        s.k+=1; bg=bg or TH[s.k%len(TH)]; dk=dk or DK[(s.k*5)%len(DK)]
        bgc,a,a2=BGS[bg]
        chips=f'<span class="pill">{pill}</span>' if pill else ""
        if crit: chips+=f'<span class="pill cr">{crit}</span>'
        if mins: chips+=f'<span class="pill tm">⏱ {mins} دَقائِقَ</span>' if mins>2 else f'<span class="pill tm">⏱ {"دَقيقَتانِ" if mins==2 else "دَقيقَةٌ"}</span>'
        if strat: chips+=f'<span class="pill st">🧭 {strat}</span>'
        hd=f'<div class="hlogo">{logo(196)}</div><h2 class="ht{" s" if len(bare(re.sub("<[^>]+>","",title)))>32 else ""}">{title}</h2><div class="hrow">{chips}</div>'
        ft=f'<div class="ft"><div class="ftr"><span class="ftl">{logo(92)}</span><span>{s.title}</span></div><div class="goal">🎯 {s.strip}</div><div class="dots"><b style="background:#E2574C"></b><b style="background:#F2A93B"></b><b style="background:#1E7A5A"></b><b style="background:#2F64A8"></b></div></div>'
        s.SL.append(f'<section class="sl" id="{sid}" style="--bg:{bgc};--a:{a};--a2:{a2};background:{bgc}">{deco(dk,a,s.big)}{hd}<div class="bd">{body}</div>{ft}<aside>{note}</aside></section>')
FILL={"Meaning: …","Meaning: ...","Do you know it?","هَلْ تَعْرِفُ مَعْناها؟"}
def rq(c):
    a=c[1] or ""; b=c[2] or ""
    if b in FILL or not b.strip(): return a
    if bare(a).startswith("سؤال من"): return b
    return (a+" "+b).strip()
LAT=re.compile(r"\(?[A-Za-z](?:[A-Za-z0-9 ,'’/&\-\.:;]*[A-Za-z0-9])?[\?!\.]*\)?")
def bidify(html):
    out=[]; svg=0
    for part in re.split(r"(<[^>]+>)",html):
        if part.startswith("<"):
            t=part.lower()
            if t.startswith("<svg"): svg+=1
            elif t.startswith("</svg"): svg-=1
            out.append(part); continue
        if svg or not re.search(r"[A-Za-z]",part): out.append(part); continue
        if not re.search(r"[\u0600-\u06FF]",part): out.append(f'<bdi dir="ltr">{part}</bdi>' if part.strip() else part); continue
        out.append(LAT.sub(lambda m:f'<bdi dir="ltr">{m.group(0)}</bdi>',part))
    return "".join(out)
def emo_disc(e,size=190,bg="#FFF"): return f'<div class="emd" style="width:{size}px;height:{size}px;font-size:{int(size*.58)}px;background:{bg}">{e}</div>'
def opt_idx(model):
    m=re.search(r"\((أ|ب|ج)\)",model or ""); return {"أ":0,"ب":1,"ج":2}.get(m.group(1),0) if m else 0
def strip_lab(o): return re.sub(r"^\s*\((أ|ب|ج)\)\s*","",o)
def first_harakah(w):
    b=w[1:3]
    for ch,n in (("\u064E","فَتْحَةٌ"),("\u064F","ضَمَّةٌ"),("\u0650","كَسْرَةٌ"),("\u0652","سُكونٌ")):
        if ch in b: return n
    return ""
def hl_letter(t,L):
    """colour every occurrence of letter L (with its marks) — used in the hunt toggle"""
    if not L: return t
    ch="ه" if L=="هـ" else L
    chars={"أ":"أإآ"}.get(ch,ch)
    return re.sub(f"([{chars}][{HAR}]*)",r'<span class="L">\1</span>',t)
def crit_map(crit,groups):
    """map each group to its closest criterion by shared word stems"""
    def toks(t): return {w[:4] for w in bare(t).replace("الْ","ال").split() if len(w)>2}
    res=[]
    for g in groups:
        gt=toks(g["goal"]+" "+" ".join(g["steps"]))
        sc=[len(gt & toks(c)) for c in crit]; res.append(max(range(len(crit)),key=lambda k:(sc[k],-abs(k-len(res)))))
    return res
def build(code, mode="site"):
    MODE["m"]=mode
    term=code.split("-")[3]; n=code.split("-")[4]
    nn="-NN-" in code
    sp=SPEC.get(code) or f"{T}g1/{code}"
    P=json.load(open(sp+".json"))
    S=json.load(open(sp+".deck.json")) if os.path.exists(sp+".deck.json") else None
    meta=META.get(code,{"id":None})
    if S is None: S=json.load(open(f"{T}g1/AR-Y1-N-T3-L09.deck.json")); S=fallback(S,P)
    grade=int(code.split("-")[1][1:])
    title=S["title"]; m=re.search(r"\((.{1,2})\)\s*$",bare(title)); L=m.group(1) if (m and grade==1) else ""
    review=bare(title).startswith("مراجعة:"); poem="النشيد" in bare(title)
    if L=="ه": L="هـ"
    kind="letter" if L else ("poem" if poem else ("review" if review else "text"))
    if nn: kind="text"; L=""
    imgb=S["imgbase"]; IMG=lambda k: A(imgb+k+".webp") if os.path.exists(ROOT+imgb+k+".webp") else None
    D=Deck(re.sub(r"\s*\(.*\)\s*$","",title) if L else title, S["strip"], big=(L if L else ""))
    D.title=title
    rnd=random.Random(code)
    words=[]
    for w in S["words"][:4]:
        mean=w[1]
        if "بِـ (" in mean or "بِـ(" in mean: mean=MEAN.get(w[0],mean)
        words.append((w[0],mean,w[2] if len(w)>2 else "🔤",w[3] if len(w)>3 and os.path.exists(ROOT+w[3]) else None))
    crit=S["criteria"]; G=P["groups"]; LVK=["bronze","silver","gold","challenge"]
    gm=[0,1,1,2] if kind=="letter" else [0,1,2,3]
    verbs=[c.split()[0] for c in P["criteria"]]
    if nn: verbs=[v.strip() for v in re.sub(r"[^\u0600-\u06FF ·]","",S.get("tagline","أَسْمَعُ · أَتَحَدَّثُ · أَقْرَأُ · أَكْتُبُ")).split("·")][:4]
    EN={"retrieve":"Remember","guess":"Guess the word","hook":"Wonder","goal":"Goal & Success Criteria","progress":"Where am I now?","vocab":"New words","predict":"Predict","story":"Read together","map":"Explore","match":"Match","speak":"Speak","wordj":"Word journey","order":"Order","groups":"Group work","models":"Model answers","truefalse":"True or false?","feedback":"Two stars & a wish","value":"Our values","quick":"Quick challenge","progress2":"How far did I get?","exit":"Exit ticket","home":"Home task"} if nn else {}
    D.en=EN
    vcols=[l[1] for l in LV]
    # ---------- cover ----------
    cov=IMG("cover") or IMG("main")
    book=code in STORYBOOK
    if book: cov=A(BOOKP+"pg02.webp")
    ctitle=re.sub(r"\s*\([^)]*\)\s*$","",title) if kind=="letter" else title
    badge={"letter":L,"poem":"🎵","review":"🔁","text":"📖"}[kind]
    kick=bare(S["kicker"]).replace("اللغة العربية","اللُّغَةُ الْعَرَبِيَّةُ").replace("الصف الأول","الصَّفُّ الْأَوَّلُ")
    D.SL.append(f'''<section class="sl" id="cover" style="--a:#B4532A;--a2:#FBE6D8;background:linear-gradient(135deg,#FDF0DC 0%,#FBF7EF 48%,#E4F1EA 100%)">
<img class="dc" src="{A('art/lanterns.webp')}" style="left:560px;top:0;width:250px" alt="">
<i class="dc" style="left:-200px;bottom:-260px;width:760px;height:760px;border-radius:50%;background:#F2A93B;opacity:.10"></i>
<div class="hlogo cvlogo">{logo(380)}</div>
<div class="cvpic g"><div class="cvsun"></div>{f'<img class="cvimg" src="{cov}" alt="">' if cov else ''}<div class="cvL{' e' if kind!='letter' else ''}"><span>{badge}</span></div></div>
<div class="cvtx"><p class="cvk">{kick}</p><h1 class="cvt{' s' if len(bare(ctitle))>22 else ''}">{ctitle}</h1>{f'<p class="cvs" dir="ltr" style="text-align:right">{S["objective"]}</p>' if nn else f'<p class="cvs">{S["strip"] if bare(S["strip"]).strip(". ")!=bare(ctitle).split(":")[-1].strip() else re.sub("^أَنْ ","",S["objective"])}.</p>'}
<div class="cvv">{''.join(f'<span style="--c:{vcols[k]}">{v}</span>' for k,v in enumerate(verbs[:4]))}</div></div>
<p class="cvb">{S["byline"]}</p><aside>{S.get("title_note","")}</aside></section>''')
    # ---------- retrieval ----------
    R=S["retrieval"]
    cards=R.get("cards") or [[["📌","💡","🔁"][i%3],None,q.rstrip(":： "),a] for i,(q,a) in enumerate(R.get("qa",[]))]
    body='<div class="row3">'+"".join(f'<div class="cd rc"{B(k*2+1)}><div class="rcI">{c[0]}</div><p class="rcQ">{rq(c)}</p><p class="ans"{B(k*2+2,"pop")}>✓ {c[3]}</p></div>' for k,c in enumerate(cards[:3]))+'</div>'
    body+=f'<div class="cd link"{B(7)}><p>{R["link"]}</p></div><img class="side" src="{A("art/boywave.webp")}" alt="" style="left:30px;top:-40px;width:150px">'
    D.slide("retrieve","قَبْلَ أَنْ نَبْدَأَ..","نَتَذَكَّرُ وَنَرْبِطُ",body,R.get("note","[استرجاع]"),mins=3,bg="mint",dk="ring")
    # ---------- guess ----------
    if kind=="letter":
        idx=ORDER.index(L)+1 if L in ORDER else 0
        clues=[(f"أَنا الْحَرْفُ رَقْمُ {idx} في حُروفِ لُغَتِنا.","4 نِقاطٍ"),(SHAPE.get(L,""),"3 نِقاطٍ"),(f"بي تَبْدَأُ كَلِمَةُ: {words[0][0]} {words[0][2]}","نُقْطَتانِ"),(f"وَبي تَبْدَأُ: {words[1][0]} {words[1][2]}","نُقْطَةٌ")]
        reveal=f'<b class="bigA">{L}</b><p>أَنا حَرْفُ {NAME.get(L,"")} 🎉</p>'; gt="خَمِّنِ الْحَرْفَ!"
        cols=["#A0612F","#2F64A8","#1E7A5A","#C2571A"]
        body='<div class="clues">'+"".join(f'<div class="clue" style="--c:{cols[k]}"{B(k+1,"left")}><b class="n">{k+1}</b><p>{q}</p><span class="pts">{pt}</span></div>' for k,(q,pt) in enumerate(clues))
        body+=f'<div class="who"{B(5,"pop")} data-ia onclick="boom(this)"><p>مَنْ أَنا؟</p>{reveal}</div></div><div class="detect"><img src="{A("art/lensboy.webp")}" alt=""><p>كُلَّما خَمَّنْتُمْ أَبْكَرَ، رَبِحْتُمْ نِقاطًا أَكْثَرَ!</p></div>'
        D.slide("guess",gt,"تَحَدّي الْمُحَقِّقينَ",body,"[التهيئة: تحدّي المحققين] اكشف التلميحات واحدًا واحدًا. أول مجموعة تخمّن تأخذ نقاط التلميح الذي وصلتم إليه. انقر على بطاقة الإجابة للاحتفال.",mins=3,bg="butter",dk="stars")
    else:
        cols=["#A0612F","#2F64A8","#1E7A5A","#C2571A"]
        rows=[]
        for k,(w,m,e,ph) in enumerate(words):
            q=(f"تَبْدَأُ بِحَرْفِ ({bare(w)[0]})، وَصورَتُها: {e}") if "بِـ (" in m else (f'{e} <span dir="ltr">{m}</span>' if nn else f"مَعْناها: «{m}» {e}")
            rows.append(f'<div class="clue" style="--c:{cols[k]}"{B(k*2+1,"left")}><b class="n">{k+1}</b><p>{q}</p><span class="wrv"{B(k*2+2,"pop")}>{w}</span></div>')
        body='<div class="clues">'+"".join(rows)+f'</div><div class="detect"><img src="{A("art/lensboy.webp")}" alt=""><p>مَنْ يُخَمِّنُ الْكَلِمَةَ أَوَّلًا يَرْبَحُ نُقْطَةً!</p></div>'
        D.slide("guess","خَمِّنِ الْكَلِمَةَ!","تَحَدّي الْمُحَقِّقينَ",body,"[التهيئة: تحدّي المحققين] اعرض التلميح، ويخمّن الطلاب الكلمة من الدرس، ثم اكشفها بالنقر.",mins=3,bg="butter",dk="stars")
    # ---------- hook / listen ----------
    if kind=="letter":
        others=[(w,e) for w,e in POOL if bare(w)[0]!=bare(L)[0] and not (L=="أ" and bare(w)[0] in "اإآ")]
        dis=rnd.sample(others,3)
        items=[(w,e,True) for w,m,e,_ in words]+[(w,e,False) for w,e in dis]; rnd.shuffle(items)
        body=f'<p class="inst">أُسَمّي الصّورَةَ، فَإِذا بَدَأَتْ بِصَوْتِ ({L}) أَقِفُ وَأَرْفَعُ يَدي ✋ — ثُمَّ نَنْقُرُ لِنَتَأَكَّدَ.</p><div class="snd">'+"".join(f'<div class="sc {"yes" if y else "no"}" data-ia onclick="this.classList.add(\'shown\');snd(\'{"correct" if y else "wrong"}\')"><div class="pic">{emo_disc(e,180,"#F6F2EA")}</div><p class="nm">{hl_letter(w,L) if y else w}</p><b class="mk">{"✓" if y else "✗"}</b></div>' for w,e,y in items)+'</div>'
        D.slide("listen",f"أَسْمَعُ صَوْتَ ({L}) 👂","لَحْظَةُ فُضولٍ",body,"[التهيئة السمعية] سمِّ كل صورة بصوت واضح. يقف الطلاب إذا بدأ الاسم بصوت الحرف، ثم انقر على البطاقة للتحقق.",mins=4,strat="أَسْمَعُ وَأَتَحَرَّكُ",bg="sky",dk="wave")
    else:
        H=S["hook"]; im=IMG(H.get("img","main"))
        if code=="AR-Y1-N-T3-L08":
            H={"head":"أَتَأَمَّلُ الْغِلافَ 🖼️","q":"ماذا يَحْمِلُ الطِّفْلُ في الْغِلافِ؟ وَماذا يَعْني الْقَلْبُ الْأَحْمَرُ؟","model":"يَحْمِلُ قَلْبًا أَحْمَرَ؛ فَالْقِصَّةُ عَنِ الْمَحَبَّةِ في رَمَضانَ.","note":"[التهيئة] اعرض غلاف القصة، واستمع إلى ثلاث إجابات."}; im=A(BOOKP+"pg02.webp")
        body=f'<div class="pd">{f"<div class=pdp2><img src={chr(34)}{im}{chr(34)} alt=></div>" if im else ""}<div class="pdc"><div class="cd"{B(1)}><p class="q">{clean_emoji_lead(H["q"])}</p><p class="tip c" style="margin-top:14px">💬 أُفَكِّرُ · أُشارِكُ زَميلي · نُخْبِرُ الصَّفَّ</p><p class="ans"{B(2,"pop")}>✓ {H["model"]}</p></div></div></div>'
        D.slide("hook",H["head"],"لَحْظَةُ فُضولٍ",body,H.get("note",""),mins=3,bg="sky",dk="wave")
    # ---------- goal ----------
    tags=[]
    for k in range(4):
        gs=[j for j in range(4) if gm[j]==k]
        tags.append(("الْمَجْموعَةُ "+str(gs[0]+1)) if len(gs)==1 else ("الْمَجْموعَتانِ "+" وَ ".join(str(j+1) for j in gs)) if gs else "الصَّفُّ كُلُّهُ · بِطاقَةُ الْخُروجِ")
    cl=max(len(bare(c)) for c in crit[:4])+len(bare(S["objective"]))//4; gcls=" sm" if cl>75 else ""
    body=f'<div class="goalbox{gcls}">{f'<p dir="ltr" class="en">🎯 <b>Goal:</b> {S["objective"]}</p>' if nn else f'<p>🎯 <b>هَدَفُ الدَّرْسِ:</b> {S["objective"]}</p>'}</div><div class="crs{gcls}">'+"".join(f'<div class="crit" style="--c:{LV[k][1]};--c2:{LV[k][2]}"{B(k+1)}><b class="n">{k+1}</b><span class="vb">{verbs[k]}</span><p{' dir=ltr class=en' if nn else ''}>{c if nn else "أَسْتَطيعُ أَنْ "+c}</p><span class="tag">{tags[k]}</span></div>' for k,c in enumerate(crit[:4]))+'</div>'
    D.slide("goal","هَدَفُ الدَّرْسِ وَمَعاييرُ النَّجاحِ","إِلى أَيْنَ نَمْضي؟",body,"[ناتج التعلّم ومعايير النجاح] اقرأ الهدف، ثم اكشف المعايير واحدًا واحدًا، ووضّح مكان تنفيذ كل معيار.",mins=2,bg="lilac",dk="dots")
    def prog(sid,t,pill,inst,bg):
        rows="".join(f'<div class="pr" style="--c:{LV[k][1]};--c2:{LV[k][2]}"><b class="n">{k+1}</b><span class="vb">{verbs[k]}</span><p{' dir=ltr class=en' if nn else ''}>{P["criteria"][k]}</p><div class="fs">'+"".join(f'<button class="fc" data-ia onclick="cnt(this)">{art.face(f,None,70)}<i>0</i></button>' for f in ("sad","mid","happy"))+'</div></div>' for k in range(4))
        leg='<div class="leg"><span>'+art.face("sad",None,40)+' لَمْ أَتَعَلَّمْهُ بَعْدُ</span><span>'+art.face("mid",None,40)+' أَعْرِفُ قَليلًا</span><span>'+art.face("happy",None,40)+' أَسْتَطيعُ وَحْدي</span><button data-ia onclick="rst(this)">↺ تَصْفيرُ الْعَدِّ</button></div>'
        D.slide(sid,t,pill,f'<p class="inst">{inst}</p><div class="prs">{rows}</div>{leg}',"[قياس التقدّم] يرفع الطلاب أيديهم عند الوجه الذي يشبههم، وانقر على الوجه لتسجيل العدد. القياس المباشر من زر «📈 قياس التقدّم».",mins=2,bg=bg,dk="blobs")
    prog("progress","قِياسُ التَّقَدُّمِ: قَبْلَ الدَّرْسِ","أَيْنَ أَنا الْآنَ؟","أَرْفَعُ يَدي عِنْدَ الْوَجْهِ الَّذي يُشْبِهُني في كُلِّ مِعْيارٍ.","sky")
    # ---------- vocab ----------
    body='<div class="vg">'+"".join(f'<div class="vc" data-ia onclick="this.classList.toggle(\'fl\')"{B(k+1,"pop")}><div class="vf"><div class="vp">{(f'<img class="vph" src="{A(ph)}" alt="">') if ph else emo_disc(e,220,"#FFF4E8")}</div><p class="vw">{hl_letter(w,L) if kind=="letter" else w}</p>{f"<span class=vh>{first_harakah(w)}</span>" if kind=="letter" and first_harakah(w) else ""}<small>اُنْقُرْ لِلْمَعْنى</small></div><div class="vb2"><p class="vw s">{w}</p><p class="vm">{m}</p></div></div>' for k,(w,m,e,ph) in enumerate(words))+'</div>'
    D.slide("vocab","كَنْزُ الْكَلِماتِ","كَلِماتٌ جَديدَةٌ",body,"[المفردات بالصور] اعرض الصورة، ودع الطلاب يسمّون الكلمة، ثم انقر على البطاقة لقلبها وقراءة المعنى.",mins=5,strat="الصّورَةُ وَالْكَلِمَةُ",bg="peach",dk="letter" if kind=="letter" else "blobs")
    # ---------- predict ----------
    PR=S["predict"]; im=IMG("main") or cov
    if code=="AR-Y1-N-T3-L08":
        PR={"q":"أَقْرَأُ الْعُنْوانَ «الْمَحَبَّةُ في رَمَضانَ»: ماذا يُحِبُّ النّاسُ في رَمَضانَ؟","model":"يُحِبّونَ الصِّيامَ وَالصَّلاةَ وَالْإِفْطارَ مَعَ الْأُسْرَةِ، وَمُساعَدَةَ الْآخَرينَ."}; im=A(BOOKP+"pg03.webp")
    body=f'<div class="pd">{f"<div class=pdp2><img src={chr(34)}{im}{chr(34)} alt=></div>" if im else ""}<div class="pdc"><div class="cd"{B(1)}><p class="q">👀 {clean_emoji_lead(PR["q"])}</p><p class="ans"{B(2,"pop")}>✓ {PR["model"]}</p></div><p class="tip"{B(3)}>💬 أُفَكِّرُ · أُشارِكُ زَميلي · نُخْبِرُ الصَّفَّ</p></div></div>'
    D.slide("predict","أَتَوَقَّعُ قَبْلَ الْقِراءَةِ","قَبْلَ الْقِراءَةِ",body,"اكتب توقعات الطلاب على السبورة، وارجع إليها بعد القراءة.",mins=3,strat="فَكِّرْ · زاوِجْ · شارِكْ",bg="rose",dk="ring")
    # ---------- text ----------
    lines=P["key"]; long=sum(len(bare(strip_br(x))) for x in lines)>170
    lines=[re.sub(r"\s*\*{3}\s*","  ✦  ",l) for l in lines]
    txt="".join(f'<p{B(k+1)}>{kw(hl_letter(l,L) if kind=="letter" else l)}</p>' for k,l in enumerate(lines))
    hunt=f'<button data-ia onclick="this.closest(\'.sl\').classList.toggle(\'hunt\')">🔍 أَيْنَ حَرْفُ ({L})؟ أُلَوِّنُهُ!</button>' if kind=="letter" else ""
    full="📖 النَّصُّ كامِلًا في تَبْويبِ «نَصُّ الْكِتابِ»" if (long or kind in ("poem","text")) else "📖 مِنْ كِتابِ «الْعَرَبِيَّةُ تَجْمَعُنا»"
    im=IMG("main") or cov
    nch=sum(len(bare(strip_br(x))) for x in lines); fs=70 if nch<=95 else 58 if nch<=160 else 48 if nch<=230 else 40 if nch<=320 else 34
    body=f'<div class="story{" poem" if kind=="poem" else ""}" style="--fs:{fs}px">{f"<div class=sp2><img src={chr(34)}{im}{chr(34)} alt=></div>" if im else ""}<div class="stx">{txt}</div></div><div class="sbar">{hunt}<span>{full}</span></div>'
    st={"poem":"نُنْشِدُ مَعًا","text":"نَقْرَأُ مَعًا","review":"نَقْرَأُ مَعًا","letter":"نَقْرَأُ مَعًا"}[kind]
    D.slide("story",P.get("readhead",title),st,body,"[القراءة النموذجية] اقرأ قراءة معبّرة، ثم يقرأ الطلاب معك سطرًا سطرًا."+(" بعدها اضغط زر التلوين لنعدّ الحرف في النص." if kind=="letter" else ""),mins=6,strat="الْقِراءَةُ الْمُشْتَرَكَةُ",bg="cream",dk="wave")
    if book:
        spreads=[(k,k+1) for k in range(3,33,2)]
        fbh='<div class="fbk" data-ia>'+"".join(f'<div class="fsp{" on" if j==0 else ""}"><img src="{A(BOOKP+f"pg{a:02d}.webp")}" alt=""><img src="{A(BOOKP+f"pg{b:02d}.webp")}" alt=""></div>' for j,(a,b) in enumerate(spreads))+'</div>'
        nav=f'<div class="fbnav"><button data-ia onclick="fb(this,1)">→ السّابِقُ</button><span class="fbc2">1 / {len(spreads)}</span><button data-ia onclick="fb(this,-1)">التّالي ←</button></div>'
        D.slide("book","نَقْرَأُ الْقِصَّةَ الْمُصَوَّرَةَ","كِتابُ الْقِصَّةِ",fbh+nav,"[القراءة المصوّرة] اقلب صفحات القصة بالزرّين (لا تنتقل الشريحة). اقرأ كل صفحتين قراءة معبّرة، واسأل: من في الصورة؟ ماذا يحب؟",mins=15,strat="الْقِراءَةُ الْمُشْتَرَكَةُ",bg="cream",dk="wave")
        qs=["هَلْ عَبَّرَتِ الرُّسوماتُ عَنِ النَّصِّ تَعْبيرًا جَميلًا؟","ما اللَّوْحَةُ الَّتي أَعْجَبَتْكَ أَكْثَرَ؟ ارْفَعِ اللَّوْحَةَ لِيَراها زُمَلاؤُكَ.","هَلِ اتَّفَقْتُمْ أَمِ اخْتَلَفْتُمْ؟ عَمَّ تَتَحَدَّثُ هذِهِ اللَّوْحَةُ؟"]
        thumbs="".join(f'<img src="{A(BOOKP+f"pg{p:02d}.webp")}" alt="">' for p in (4,16,28))
        body=f'<div class="pw"><div class="pwc"><div class="cd"><span class="lb">🤝 الْمَهارَةُ: تَتَبُّعُ الْأَحْداثِ</span><p>تَبادَلْ مَعَ زَميلِكَ قِراءَةَ الْقِصَّةِ، وَانْظُرا إِلى رُسوماتِها:</p></div>'+"".join(f'<div class="cd ws"{B(k+1)}><b class="n">{k+1}</b><p>{q}</p></div>' for k,q in enumerate(qs))+f'</div><div class="pwt">{thumbs}</div></div>'
        D.slide("pair","أَعْمَلُ مَعَ زَميلي","اعْمَلْ مَعَ زَميلِكَ",body,"[العمل الثنائي] من نشاط «اعمل مع زميلك» في الكتاب: يتبادل الزميلان القراءة، ويختار كل منهما لوحة ويتحدث عنها.",mins=6,strat="فَكِّرْ · زاوِجْ · شارِكْ",bg="mint",dk="dots")
    # ---------- video ----------
    if meta.get("vid"):
        vid=f'<video class="vid" controls preload="metadata" src="../../../{meta["vid"]}"></video>' if mode=="site" else f'<div class="vid ph">{emo_disc("🎬",200,"#fff")}<p>▶ فيديو الدَّرْسِ يَعْمَلُ عِنْدَ فَتْحِ الْعَرْضِ مِنَ الْمَنَصَّةِ</p></div>'
        D.slide("video","نُشاهِدُ وَنَتَعَلَّمُ","فيديو الدَّرْسِ",f'<div class="vw2" data-ia>{vid}</div><div class="vtip"><p>👀 نُشاهِدُ، ثُمَّ نُجيبُ عَنْ أَسْئِلَةِ الْفيديو عَلى الْمَنَصَّةِ.</p></div>',"شغّل فيديو الدرس، ثم يجيب الطلاب عن أسئلته على المنصة.",mins=2,bg="sky",dk="dots")
    # ---------- map ----------
    MP=S["map"]; short=all(len(bare(x[2]))<=16 for x in MP)
    hc=["#2F64A8","#1E7A5A","#C2571A"]
    if short:
        body='<div class="hk">'+"".join(f'<div class="hc" style="--c:{hc[k]}"{B(k+1,"pop")}><p class="hn">{x[0]} {x[1]}</p><b class="hg s">{x[2]}</b></div>' for k,x in enumerate(MP))+'</div>'
    else:
        body='<div class="hk">'+"".join(f'<div class="hc tx" style="--c:{hc[k]}"><p class="hn">{x[0]} {x[1]}</p><p class="htx ans"{B(k+1,"pop")}>{x[2]}</p></div>' for k,x in enumerate(MP))+'</div>'
    D.slide("map",clean_emoji_lead(S.get("map_head","خَريطَةُ الْقِصَّةِ")) or "خَريطَةُ الْقِصَّةِ","نَكْتَشِفُ مَعًا",body,"نملأ العناصر معًا، ثم اكشف الإجابة النموذجية.",mins=6,strat=S.get("map_strategy","خَريطَةُ الْقِصَّةِ"),bg="mint",dk="blobs")
    # ---------- match ----------
    M=S["match"]; rows=[r for r in M["rows"] if not ("بِـ (" in r[1])]
    madd=kind=="letter" and all(len(bare(r[0]))<=2 for r in rows)
    mc=["#2F64A8","#1E7A5A","#C2571A","#6B46A8"]
    if madd:
        body='<div class="md">'+"".join(f'<div class="mr" style="--c:{mc[k%4]}"{B(k+1,"left")}><b class="ms">{r[0]}</b><div class="mbar"><i></i></div><b class="ml">{r[1]}</b></div>' for k,r in enumerate(rows[:3]))+'</div><p class="tip c"'+B(4)+'>🙌 نَمُدُّ الصَّوْتَ وَنَمُدُّ أَيْدِيَنا مَعَهُ</p>'
    else:
        body='<div class="mt2">'+"".join(f'<div class="mrow"><span class="ml2">{r[0]}</span><b>←</b><span class="mr2 ans"{B(k+1,"left")}>{r[1]}</span></div>' for k,r in enumerate(rows[:5]))+'</div>'
    D.slide("match",clean_emoji_lead(M["head"]),"نُطَبِّقُ مَعًا",body,"[فكّر – زاوج – شارك] دقيقة تفكير، ثم يتبادل الزملاء الإجابة، ثم اكشفها.",mins=5,strat="فَكِّرْ · زاوِجْ · شارِكْ",bg="lilac",dk="wave")
    # ---------- write (letters) ----------
    if kind=="letter":
        ch="ه" if L=="هـ" else L
        trace=f'''<svg class="trace" viewBox="0 0 400 520"><g stroke="#C9D6E6" stroke-width="3"><line x1="20" y1="150" x2="380" y2="150"/><line x1="20" y1="420" x2="380" y2="420"/></g><line x1="20" y1="300" x2="380" y2="300" stroke="#E3EAF3" stroke-width="3" stroke-dasharray="12 12"/>
<text x="200" y="360" text-anchor="middle" font-size="300" font-family="Thmanyah Display, serif" fill="#EEF1F5">{ch}</text>
<text class="tw" x="200" y="360" text-anchor="middle" font-size="300" font-family="Thmanyah Display, serif">{ch}</text></svg>'''
        steps=["أُشاهِدُ مُعَلِّمي وَهُوَ يَكْتُبُ الْحَرْفَ.","أَكْتُبُ الْحَرْفَ في الْهَواءِ، ثُمَّ عَلى ظَهْرِ زَميلي.","أَكْتُبُ الْحَرْفَ في دَفْتَري بِخَطٍّ واضِحٍ.",f"أَكْتُبُ كَلِمَةً تَبْدَأُ بِهِ: {words[0][0]}"]
        k4=[k for k in range(4) if "أَكْتُبَ" in crit[k] or "كْتُب" in crit[k]]
        body=f'<div class="wr"><div class="wbox" data-ia onclick="redraw(this)">{trace}<span class="rp">▶ أُعيدُ الرَّسْمَ</span></div><div class="wst">'+"".join(f'<div class="cd ws"{B(k+1)}><b class="n">{k+1}</b><p>{t}</p></div>' for k,t in enumerate(steps))+'</div></div>'
        D.slide("write",f"أَكْتُبُ حَرْفَ ({L})","أُشاهِدُ ثُمَّ أَكْتُبُ",body,"[النمذجة: أنا أفعل، نحن نفعل، أنت تفعل] انقر على اللوح ليُرسم الحرف، ثم يكتبه الطلاب في الهواء وفي الدفتر.",mins=6,crit=(f"مِعْيارُ النَّجاحِ {k4[0]+1}" if k4 else None),bg="butter",dk="letter")
    # ---------- speak ----------
    SP=S["speak"]
    body=f'<div class="spk"><div class="cd spf"><p>{SP["frame"]}</p></div><p class="inst c">🎤 أَقِفُ أَمامَ زُمَلائي، وَأَنْظُرُ إِلَيْهِمْ، وَأَتَحَدَّثُ بِصَوْتٍ واضِحٍ.</p><p class="ans big"{B(1,"pop")}>✓ {SP["model"]}</p></div>'
    D.slide("speak",clean_emoji_lead(SP["head"]),"شاهِدْني أَتَحَدَّثُ",body,"نمذج الإجابة أولًا، ثم يتحدث الطلاب في أزواج.",mins=4,bg="peach",dk="dots")
    # ---------- wordj ----------
    WJ=S["wordj"]; ci=opt_idx(WJ["model"])
    body=f'<div class="wh"><div class="cd whq"><p class="q">{WJ["sent"]}</p><p class="q2">{WJ["q"]}</p><div class="opts">'+"".join(f'<span{B(1,"pop") if j==ci else ""} class="{"ok" if j==ci else ""}"><i class="ob">{j+1}</i><bdi>{strip_lab(o)}</bdi>{" ✓" if j==ci else ""}</span>' for j,o in enumerate(WJ["opts"]))+f'</div><p class="ans"{B(2,"pop")}>✓ {re.sub(r"^\(.\):?\s*","",WJ["model"])}</p></div>'
    if kind=="letter":
        ch="ه" if L=="هـ" else L; chs={"أ":"أإآ"}.get(ch,ch)
        seen=[]
        for l in lines:
            for w in strip_br(l).replace("،"," ").replace("."," ").replace(":"," ").split():
                b=bare(w); b2=b[2:] if b.startswith("ال") and len(b)>3 else b
                if b[:1] and b[0] in chs:
                    if w not in seen: seen.append(w)
        if seen:
            body+=f'<p class="inst"{B(3)}>🔍 أَبْحَثُ في النَّصِّ عَنْ كَلِماتٍ تَبْدَأُ بِحَرْفِ ({L}):</p><div class="chips">'+"".join(f'<span{B(k+4,"pop")}>{w}</span>' for k,w in enumerate(seen[:10]))+'</div>'
    body+='</div>'
    D.slide("wordj",clean_emoji_lead(WJ["head"]),"رِحْلَتي مَعَ كَلِمَةٍ",body,"صوّت الطلاب بالأصابع (1، 2، 3)، ثم اكشف الإجابة.",mins=4,bg="rose",dk="dots")
    # ---------- order ----------
    OR=S["order"]; show=[1,2,0]
    body='<p class="inst">الْأَحْداثُ مَخْلوطَةٌ! نُرَتِّبُها: ماذا جاءَ أَوَّلًا؟</p><div class="ord">'+"".join(f'<div class="oc"><div class="op">{(f'<img class="opi" src="{A(BOOKP+["pg04.webp","pg16.webp","pg27.webp"][j])}" alt="">') if book else emo_disc(["🌅","🌤️","🌙"][j],150,"#F3F6FB")}</div><p>{OR[j][2]}</p><b class="onum"{B(j+1,"pop")}>{j+1}</b></div>' for j in show)+'</div>'
    D.slide("order",clean_emoji_lead(S.get("order_head","أُرَتِّبُ الْأَحْداثَ")),"إِعادَةُ السَّرْدِ",body,"يرتّب الطلاب شفويًّا، ثم اكشف الأرقام بالترتيب.",mins=5,strat=S.get("order_strategy","إِعادَةُ السَّرْدِ"),bg="sky",dk="stars")
    # ---------- groups ----------
    roles=[r.split(" ",1) for r in G.get("roles",["📖 الْقارِئُ","✏️ الْكاتِبُ","⏱ حارِسُ الْوَقْتِ","🎤 الْمُتَحَدِّثُ"])]
    gname=lambda k:f"الْمَجْموعَةُ {k+1}"
    body='<div class="gm">'+"".join(f'<div class="gmc" style="--c:{LV[k][1]};--c2:{LV[k][2]}"{B(k+1)}><span class="lvt">{gname(k)} · {LV[k][0]}</span><b>{G[LVK[k]]["goal"]}</b><small>مِعْيارُ النَّجاحِ {gm[k]+1}</small></div>' for k in range(4))+'</div>'
    body+=f'<div class="roles"{B(5)}>'+"".join(f'<span><i>{e}</i>{r}</span>' for e,r in roles)+'</div>'
    body+=f'<div class="flow"{B(6)}><span>⏱ 10 دَقائِقَ عَمَلٌ</span><b>←</b><span>🎤 نَعْرِضُ</span><b>←</b><span>⭐ نَجْمَتانِ وَأُمْنِيَةٌ</span><b>←</b><span>✅ نَماذِجُ الْإِجابَةِ</span></div>'
    D.slide("groups","خَريطَةُ الْعَمَلِ الْجَماعِيِّ","كُلُّ مَجْموعَةٍ = مِعْيارُ نَجاحٍ",body,"[التعلّم التعاوني] وزّع بطاقات المجموعات وأوراق المستويات وورقة أصحاب الهمم. لكل طالب دور، ومن ينهي مهمته ينتقل إلى «تحدّي الأبطال».",mins=2,bg="cream",dk="ring")
    LVL=P["levels"]
    def chal(k):
        ch="ه" if L=="هـ" else L
        if kind=="letter":
            return [f"نَبْحَثُ في الصَّفِّ عَنْ شَيْئَيْنِ يَبْدَآنِ بِصَوْتِ ({L})، وَنَرْسُمُهُما في لَوْحَتِنا.",
                    f"نَقْرَأُ ({ch}َ · {ch}ُ · {ch}ِ) بِتَرْتيبٍ يَخْتارُهُ زَميلٌ، مِنْ غَيْرِ خَطَأٍ وَبِسُرْعَةٍ!",
                    f"نَكْتُبُ كَلِمَةً تَبْدَأُ بِمَدٍّ: ({ch}ا) أَوْ ({ch}ُو) أَوْ ({ch}ِي)، وَنَقْرَؤُها مَمْدودَةً.",
                    f"نَخْتَرِعُ نِهايَةً جَديدَةً لِلْقِصَّةِ، في جُمْلَةٍ فيها كَلِمَةٌ تَبْدَأُ بِحَرْفِ ({L})."][k]
        G4={"poem":"نُنْشِدُ النَّشيدَ بِتَعْبيرٍ وَحَرَكاتٍ مُعَبِّرَةٍ، وَنُعَلِّمُهُ لِلصَّفِّ.","review":"نَكْتُبُ جُمْلَةً فيها كَلِماتٌ مِنْ أَكْثَرِ حُروفِ الْمُراجَعَةِ.","text":"نُضيفُ إِلى النَّصِّ حَدَثًا جَديدًا أَوْ نِهايَةً أُخْرى، وَنَرْويها لِلصَّفِّ."}[kind]
        return ["نَخْتارُ كَلِمَةً جَديدَةً مِنَ الدَّرْسِ، نَرْسُمُها وَنَكْتُبُ جُمْلَةً فيها.","نَكْتُبُ سُؤالًا عَنِ النَّصِّ، وَنَطْرَحُهُ عَلى مَجْموعَةٍ أُخْرى.","نَخْتارُ أَجْمَلَ جُمْلَةٍ في النَّصِّ، نَقْرَؤُها بِتَعْبيرٍ، وَنَقولُ لِماذا اخْتَرْناها.",G4][k]
    def _old_chal(k):
        order=[LVK[min(k+1,3)],"challenge"]
        for lv in order:
            for t in LVL[lv]["tasks"][::-1]:
                if t.get("type")!="draw" and t.get("q"): return t["q"].rstrip(":： ")+"."
        return "نَصْنَعُ سُؤالًا جَديدًا عَنِ الدَّرْسِ، وَنَطْرَحُهُ عَلى مَجْموعَةٍ أُخْرى."
    for k in range(4):
        g=G[LVK[k]]; nm,c,c2=LV[k]
        txt=" · ".join(g["text"]) if g.get("text") else ""
        body=f'''<div class="gw" style="--c:{c};--c2:{c2}"><div class="gwm">{f'<div class="cd gread"><span class="lb">📖 نَقْرَأُ مَعًا</span><p class="gt{" sm" if len(bare(txt))>40 else ""}">{kw(txt)}</p></div>' if txt else ''}
<div class="cd gsteps"><span class="lb">🧩 مُهِمَّتُنا · لِلْجَميعِ</span>'''+"".join(f'<p{B(j+1)}><b>{j+1}</b>{s_}</p>' for j,s_ in enumerate(g["steps"]))+f'''</div></div>
<div class="gws"><div class="gch"{B(4,"pop")}>{art.star(None,70)}<span class="lb">⭐ تَحَدّي الْأَبْطالِ</span><p>{chal(k)}</p></div>
<div class="gmeta"><p>🏆 الْمُنْتَجُ: {g["product"]}</p><p>🤝 دَعْمٌ: أَعودُ إِلى شَريحَةِ «كَنْزُ الْكَلِماتِ» وَالنَّصِّ.</p></div></div></div>'''
        D.slide(f"g{k+1}",f"{gname(k)}: {g['goal'].rstrip('.')}",nm,body,f"المجموعة {k+1}: المهمة للجميع أولًا، ثم «تحدّي الأبطال». ذكّرهم بالأدوار والوقت (10 دقائق).",mins=10,crit=f"مِعْيارُ النَّجاحِ {gm[k]+1}",bg=["peach","mint","butter","lilac"][k],dk=["blobs","dots","ring","stars"][k])
    ANS=P["answers"]
    tl=max(len(bare(" ".join(ANS.get(k_,[])))) for k_ in LVK); mfs=40 if tl<90 else 34 if tl<140 else 29 if tl<200 else 25
    body=f'<div class="mg" style="--mfs:{mfs}px">'+"".join(f'<div class="cd mac" style="--c:{LV[k][1]};--c2:{LV[k][2]}"{B(k+1)}><span class="lvt">{gname(k)} · {G[LVK[k]]["goal"]}</span><p>{"<br>".join(ANS.get(LVK[k],[]))}</p></div>' for k in range(4))+'</div>'
    D.slide("models","نَماذِجُ الْإِجابَةِ","نَتَحَقَّقُ مِنْ فَهْمِنا",body,"بعد عرض كل مجموعة، اكشف نموذج إجابتها وقارنوا.",mins=4,bg="mint",dk="blobs")
    # ---------- true / false ----------
    TF=[]
    if kind=="letter":
        ch="ه" if L=="هـ" else L
        TF.append((f"كَلِمَةُ «{words[0][0]}» تَبْدَأُ بِحَرْفِ ({L}).",True,f"صَحيحٌ: {words[0][0]}."))
        w2,e2=dis[0]; f2=bare(w2)[0]
        TF.append((f"كَلِمَةُ «{w2}» تَبْدَأُ بِحَرْفِ ({L}).",False,f"خَطَأٌ: تَبْدَأُ بِحَرْفِ ({f2})."))
        TF.append((f"«{ch}ُ» عَلَيْهِ فَتْحَةٌ.",False,"خَطَأٌ: عَلَيْهِ ضَمَّةٌ."))
        TF.append((f"«{ch}ِي» مَدٌّ بِالْياءِ.",True,f"صَحيحٌ: {ch}ِ ← {ch}ِي."))
    else:
        ws=list(words); rnd.shuffle(ws)
        for j,(w,m,e,_) in enumerate(ws[:4]):
            if "بِـ (" in m:
                f=bare(w)[0]; TF.append((f"كَلِمَةُ «{w}» تَبْدَأُ بِحَرْفِ ({f}).",True,"صَحيحٌ.")) if j%2==0 else TF.append((f"كَلِمَةُ «{w}» تَبْدَأُ بِحَرْفِ (م).",f=="م",f"{'صَحيحٌ' if f=='م' else 'خَطَأٌ'}: تَبْدَأُ بِحَرْفِ ({f})."))
            elif j%2==0: TF.append((f"«{w}» مَعْناها: {m}",True,"صَحيحٌ."))
            else:
                other=ws[(j+1)%len(ws)][1]; TF.append((f"«{w}» مَعْناها: {other}",False,f"خَطَأٌ: مَعْناها {m}"))
    body='<p class="inst">👍 صَحيحٌ أَمْ 👎 خَطَأٌ؟ نُشيرُ بِالْإِبْهامِ، ثُمَّ نُصَحِّحُ.</p><div class="tf">'+"".join(f'<div class="tfr"><div class="cd tfq"><b class="n">{k+1}</b><p>{q}</p></div><div class="tfa {"y" if ok else "x"}"{B(k+1,"pop")}><b>{"👍" if ok else "👎"}</b><p>{a}</p></div></div>' for k,(q,ok,a) in enumerate(TF))+'</div>'
    D.slide("truefalse","صَحيحٌ أَمْ خَطَأٌ؟","أُفَكِّرُ وَأُصَحِّحُ",body,"اقرأ العبارة، يشير الطلاب بالإبهام، ثم اكشف الإجابة ويصحّح طالب الخطأ بجملة كاملة.",mins=3,bg="peach",dk="dots")
    # ---------- feedback ----------
    body=f'''<div class="cd fbi"><p>💛 أَقولُ رَأْيي بِلُطْفٍ؛ لِيَفْرَحَ زَميلي وَيَتَحَسَّنَ.</p></div><div class="fb">
<div class="fbc"{B(1,"pop")}>{art.star(None,90)}<b>النَّجْمَةُ الْأولى</b><p>«أَعْجَبَني …»</p></div>
<div class="fbc"{B(2,"pop")}>{art.star(None,90)}<b>النَّجْمَةُ الثّانِيَةُ</b><p>«أَحْسَنْتُمْ في …»</p></div>
<div class="fbc w"{B(3,"pop")}><span class="wi">🌱</span><b>الْأُمْنِيَةُ</b><p>«أَتَمَنّى لَوْ …»</p></div></div>
<div class="chips sm"{B(4)}><span>🗣️ نُطْقٌ واضِحٌ</span><span>🔊 صَوْتٌ مَسْموعٌ</span><span>✨ عَمَلٌ مُرَتَّبٌ</span><span>🤝 تَعاوُنٌ</span></div>'''
    D.slide("feedback","نَجْمَتانِ وَأُمْنِيَةٌ","نُشَجِّعُ زُمَلاءَنا",body,"[تقييم الأقران] بعد عرض كل مجموعة، يقول طالبان نجمتين وطالب أمنية.",mins=3,bg="sky",dk="stars")
    # ---------- value ----------
    V=S["value"]
    body=f'''<div class="val"><div class="vlp"><img src="{A("art/flagboy.webp")}" alt=""></div><div class="vlc">
<div class="row2"><div class="cd"{B(1)}><span class="lb">🇦🇪 مِنْ سَنْعِ بِلادي</span><p>{V["sana"]}</p></div><div class="cd"{B(2)}><span class="lb">🏠 حَقيقَةٌ وَطَنِيَّةٌ</span><p>{V.get("fact","في الْإِماراتِ نَعْتَزُّ بِاللُّغَةِ الْعَرَبِيَّةِ، لُغَةِ الْقُرْآنِ الْكَريمِ.")}</p></div></div>
<div class="cd dil"{B(3)}><span class="dq">🤔</span><p>{V["dilemma"]}</p></div><p class="ans big"{B(4,"pop")}>✓ {V["model"]}</p></div></div>'''
    D.slide("value",V["head"],"قيمَةٌ نَعيشُها · هُوِيَّتي",body,"[القيم والهوية الوطنية] ناقش الموقف، واستمع لثلاث إجابات قبل كشف النموذج.",mins=4,bg="butter",dk="wave")
    # ---------- quick ----------
    Q=[]
    C=S["check"]; Q.append((clean_emoji_lead(C["q"]) or C["q"],[strip_lab(o) for o in C["opts"]],opt_idx(C["model"])))
    for t in LVL["silver"]["tasks"]+LVL["gold"]["tasks"]:
        if t.get("type")=="choose":
            for q,opts in t["items"]: Q.append((q,opts,0))
    for w,m,e,_ in words:
        if len(Q)>=5: break
        if "بِـ (" in m: continue
        oth=[x[1] for x in words if x[1]!=m][:2]
        othw=[x[0] for x in words if x[1]!=m][:2]
        if len(othw)==2: Q.append((f"أَيُّ كَلِمَةٍ مَعْناها: «{m}»",[w]+othw,0))
    if kind=="letter" and len(Q)<5:
        ch="ه" if L=="هـ" else L; Q.append((f"«{ch}ُو» مَدٌّ بِـ:",["الْأَلِفِ","الْواوِ","الْياءِ"],1))
    if len(Q)<5: Q.append(("كَمْ مَجالًا لِلنَّجاحِ في دَرْسِنا الْيَوْمَ؟",["2","4","6"],1))
    QQ=[]
    for q,opts,ci in Q[:5]:
        o=list(opts); right=o[ci]; rnd.shuffle(o); QQ.append((q,o,o.index(right)+1))
    qc=["#A0612F","#2F64A8","#1E7A5A","#C2571A","#6B46A8"]
    body='<div class="qq">'+"".join(f'<div class="qr" style="--c:{qc[k]}"><b class="n">{k+1}</b><div><p class="q">{q}</p><p class="o">{"".join(f'<span class="qo"><i class="ob">{j+1}</i><bdi>{x}</bdi></span>' for j,x in enumerate(o))}</p></div><span class="qa"{B(k+1,"pop")}>الْإِجابَةُ: {a}</span></div>' for k,(q,o,a) in enumerate(QQ))+'</div>'
    D.slide("quick","تَحَدّي حِراءَ السَّريعُ",f"{len(QQ)} أَسْئِلَةٍ · 5 دَقائِقَ",body,"يجيب الطلاب بالأصابع (1، 2، 3)، ثم اكشف الإجابة. سجّل نقاط المجموعات.",mins=5,bg="mint",dk="ring")
    prog("progress2","قِياسُ التَّقَدُّمِ: بَعْدَ الدَّرْسِ","كَمْ تَقَدَّمْتُ؟","أَرْفَعُ يَدي مَرَّةً أُخْرى، وَأُقارِنُ: في أَيِّ مِعْيارٍ تَقَدَّمْتُ؟","lilac")
    # ---------- exit ----------
    E=S["exit"]
    body='<div class="ex">'+"".join(f'<div class="cd exq" style="--a:{["#6B46A8","#1E7A5A"][k%2]}"{B(k*2+1)}><span class="lb">{["✍️ أُجيبُ","📖 أَفْهَمُ"][k%2]}</span><p>{q}</p><p class="ans"{B(k*2+2,"pop")}>✓ {a}</p></div>' for k,(q,a) in enumerate(E[:2]))+'</div>'
    body+=f'<div class="exb"{B(5)}><div class="eb g">{art.face("happy",None,64)}<p>ما أَحْسَنْتُهُ الْيَوْمَ …</p></div><div class="eb y">{art.face("mid",None,64)}<p>ما أَحْتاجُهُ لاحِقًا …</p></div></div><p class="note"{B(6)}>📲 ثُمَّ نَحُلُّ بِطاقَةَ الْخُروجِ عَلى مَنَصَّةِ {logo(80)} (10 أَسْئِلَةٍ).</p>'
    D.slide("exit","بِطاقَةُ الْخُروجِ","أُغادِرُ الصَّفَّ بِبِطاقَةٍ",body,"[بطاقة الخروج] يجيب كل طالب وحده، ثم يحلّ بطاقة الخروج على المنصة (10 أسئلة).",mins=3,bg="rose",dk="blobs")
    HM=S["home"]
    body=f'''<div class="hmx"><div class="hmp"><img src="{A("art/family.webp")}" alt=""></div><div class="hmc">
<div class="cd"{B(1)}><span class="lb">🏠 مَعَ أُسْرَتي</span><p>{HM["family"]}</p></div><div class="cd hmt"{B(2)}><span class="lb">🎯 مُهِمَّةُ أَداءٍ صَغيرَةٌ</span><p>{HM["task"]}</p></div>
<p class="bye"{B(3,"pop")}>أَحْسَنْتُمْ يا أَبْطالَ {logo(120)} 🌟</p></div></div>'''
    D.slide("home","رِسالَتي إِلى الْبَيْتِ","أَتَعَلَّمُ مَعَ أُسْرَتي",body,"[التكليف ومهمة الأداء] ذكّر الطلاب بالمهمة، وحدّد موعد عرضها.",mins=1,bg="peach",dk="stars")
    return page(bare(title),bidify("".join(D.SL)),meta["id"],code), len(D.SL)
def fallback(S,P):
    S=dict(S)
    S["title"]="قِصَّةُ: الْمَحَبَّةُ في رَمَضانَ"; S["strip"]="أَقْرَأُ الْقِصَّةَ وَأَفْهَمُها"
    S["objective"]="أَنْ أَقْرَأَ قِصَّةَ «الْمَحَبَّةُ في رَمَضانَ»، وَأَذْكُرَ شَخْصِيّاتِها وَعَناصِرَها، وَأُرَتِّبَ أَحْداثَها، وَأَسْتَنْتِجَ رِسالَتَها."
    S["criteria"]=["أَذْكُرَ الشَّخْصِيّاتِ وَما تُحِبُّهُ.","أُحَدِّدَ عَناصِرَ الْقِصَّةِ.","أُرَتِّبَ الْأَحْداثَ وَأُعيدَ السَّرْدَ.","أَسْتَنْتِجَ الرِّسالَةَ وَأَرْبِطَها بِحَياتي."]
    S["words"]=[[w,m,e] for (w,m),e in zip(P["words"],["🔊","🌴","🤲","😊"])]
    S["kicker"]="اللغة العربية · الصف الأول · قصة"; S["byline"]="ميثاء الخياط · كِتابي ص 51"
    return S
BOOKP="resources/slides/img/AR-Y1-N-T3-L08-"
STORYBOOK={"AR-Y1-N-T3-L08","AR-Y1-N-T3-L09"}
POOL=[]
for d in ["g1t1","g1t2"]:
    import glob
    for f in sorted(glob.glob(f"{T}{d}/L??.deck.json")):
        for w in json.load(open(f))["words"]:
            if len(w)>2 and w[0] in MEAN: POOL.append((w[0],w[2]))
POOL=list(dict.fromkeys(POOL))
META=json.load(open("/home/claude/ar/meta.json"))
SPEC={}
for f in glob.glob(T+"**/*.deck.json",recursive=True):
    try: c=json.load(open(f)).get("code")
    except Exception: continue
    if c and os.path.exists(f[:-10]+".json"): SPEC.setdefault(c,f[:-10])
SPEC["AR-Y1-N-T3-L08"]=T+"g1/AR-Y1-N-T3-L08"
