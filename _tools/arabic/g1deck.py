# Grade 1–3 Arabic lesson deck builder (the approved «المحبة في رمضان» model).
# python3 g1deck.py spec.json out.json  — [[word]] = key word; every question carries a model answer revealed on click.
import json, re, sys
def T(x,y,w,h,text,size=30,color="1E3A3F",bold=True,align="center",fill=None,rad=False,rv=None,ff="naskh"):
    e={"k":"text","x":x,"y":y,"w":w,"h":h,"text":text,"size":size,"color":color,"bold":bold,"align":align,"fill":fill,"rad":rad,"va":"middle"}
    if rv: e["rv"]=rv
    if ff: e["ff"]=ff
    return e
def SH(x,y,w,h,fill,line=None,rv=None,oval=False):
    e={"k":"shape","x":x,"y":y,"w":w,"h":h,"fill":fill,"rad":True}
    if line: e["line"]=line; e["lw"]=1.5
    if rv: e["rv"]=rv
    if oval: e["oval"]=True
    return e
def IM(x,y,w,h,emo,rv=None):
    e={"k":"img","x":x,"y":y,"w":w,"h":h,"emo":emo}
    if rv: e["rv"]=rv
    return e
ANS="F2FAF4"
def ans(x,y,w,h,t,rv,size=24): return T(x,y,w,h,"✅ "+t,size,"0B5D3B",True,"right",ANS,True,rv=rv)
def frame(stage,label,mins,head):
    xs=[1179,1157,1135,1114,1092]; out=[]
    for i,x in enumerate(xs):
        out.append(SH(x,42,15,15,"0F6E72") if i<stage else SH(x-22,42,37,15,"0F6E72") if i==stage else SH(x-22,42,15,15,"CFE3E1"))
    return out+[T(461,28,614,44,label,22,"0F6E72",ff=None),T(86,26,145,46,"⏱ %s د"%mins,20,"1E3A3F",True,"center","FFFFFF",True,ff=None),T(86,92,1108,77,head,34,"1E3A3F",True,"right")]
def chip(t): return {"k":"text","x":86,"y":104,"w":420,"h":52,"text":"🧭 الِاسْتِراتيجِيَّةُ: "+t,"size":18,"color":"6B46A8","bold":True,"align":"center","fill":"F4EFFB","rad":True,"va":"middle"}
LV=[("برونزي","9A5B2E"),("فضي","5F6C78"),("ذهبي","B8860B"),("تحدٍّ","6B46A8")]
def build(S):
    img=lambda k: S["imgbase"]+k+".webp"
    PIC=lambda x,y,w,h,k: {"k":"pic","x":x,"y":y,"w":w,"h":h,"src":img(k),"rad":True}
    out=[]; add=lambda els,n,**kw: out.append(dict({"bg":"FBF6EC","els":els,"n":n},**kw))
    # 0 title
    out.append({"bg":"1E3A3F","els":[T(499,150,691,51,S["kicker"],25,"F2A93B",True,"right",ff=None),T(499,206,691,166,S["title"],56 if len(re.sub("[\u064B-\u0652\u0670]","",S["title"]))<=24 else 40,"FBF6EC",True,"right"),
      T(499,380,691,52,S["byline"],24,"A9C4C3",False,"right"),T(499,440,691,58,S.get("tagline","يُرَافِقُنَا دَنْدُون صَدِيقُ الْحُرُوف 👋"),24,"A9C4C3",False,"right"),SH(96,70,360,560,"FFFFFF"),PIC(110,84,332,532,"cover")],"n":S["title_note"]})
    R=S["retrieval"]
    els=frame(0,"🔁 نَتَذَكَّرُ مَعًا",3,R["head"])+[PIC(96,180,300,340,R["img"])]
    for i,(q,a) in enumerate(R["qa"]): els+=[T(420,180+i*82,500,66,q,24,"1E3A3F",True,"right","FFFDF8",True),ans(930,180+i*82,222,66,a,i+1,22)]
    els.append(T(420,436,732,100,R["link"],22,"0F6E72",True,"right","EAF5F4",True,rv=4)); add(els,R["note"])
    H=S["hook"]; add(frame(0,"✨ لَحْظَةُ فُضولٍ",3,H["head"])+[SH(500,180,652,140,"FFFDF8"),T(515,190,622,120,H["q"],24,"1E3A3F",False,"right"),T(500,340,652,60,"💬 أُفَكِّرُ · أُشارِكُ زَميلي · نُخْبِرُ الصَّفَّ",22,"0F6E72",True,"center",ff=None),ans(500,420,652,130,H["model"],1,21),PIC(96,180,380,330,H["img"])],H["note"])
    # goal & criteria
    els=frame(0,"🎯 وِجْهَتُنا الْيَوْمَ",2,"")[:-1]+[SH(380,86,520,64,"FFFFFF","1E3A3F"),T(380,86,520,64,"هدف الدرس ومعايير النجاح",28,"0B7A55",True,"center",ff="brand"),SH(70,165,1140,80,"F6EEDC","D4AA55"),T(85,168,1110,74,"🎯 هَدَفُ الدَّرْسِ: "+S["objective"],22,"1E3A3F",True,"right")]
    for i,t in enumerate(S["criteria"]):
        y=262+i*88; nm,col=LV[i]
        els+=[SH(70,y,1140,76,"FFFFFF","E1E8E6"),SH(1150,y+16,44,44,col,rv=i+1,oval=True),T(1150,y+16,44,44,str(i+1),20,"FFFFFF",True,"center",ff=None,rv=i+1),T(230,y+4,910,68,"أَسْتَطيعُ أَنْ "+t,22,"1E3A3F",True,"right",rv=i+1),T(80,y+16,140,44,nm+"  "+"|"*(i+1),18,col,True,"center",ff=None,rv=i+1)]
    add(els,"[ناتج التعلّم ومعايير النجاح] اقرأ الهدف، ثم اكشف المعايير واحدًا واحدًا، ووضّح أن كل معيار يقابل مستوى ورقة العمل.")
    # words
    els=frame(1,"🔑 مَفاتيحُ الدَّرْسِ",5,S.get("words_head","كَلِماتٌ مِنَ الْقِصَّةِ 🆕"))
    for i,wd in enumerate(S["words"][:4]):
        w,m,e=wd[:3]; ph=wd[3] if len(wd)>3 else None
        x=[650,90][i%2]; y=[185,385][i//2]
        if ph: els+=[SH(x,y,540,180,"FFFDF8","E8DCC8"),{"k":"pic","x":x+372,"y":y+12,"w":156,"h":156,"src":ph,"cover":True,"radius":20,"shadow":True},{"k":"img","x":x+352,"y":y+4,"w":44,"h":44,"emo":e},T(x+16,y+15,340,78,w,32,"9A2F0B",True,"right"),T(x+16,y+95,340,70,"= "+m,22,"0B5D3B",True,"right","F2FAF4",True,rv=i+1)]
        else: els+=[SH(x,y,540,180,"FFFDF8","E8DCC8"),IM(x+430,y+40,90,90,e),T(x+20,y+15,400,78,w,34,"9A2F0B",True,"right"),T(x+20,y+95,400,70,"= "+m,24,"0B5D3B",True,"right","F2FAF4",True,rv=i+1)]
    add(els,"اقرأ الكلمة، واطلب من الطلاب تخمين معناها من الصورة، ثم اكشف المعنى بالنقر.")
    P=S["predict"]; add(frame(1,"🔮 قَبْلَ الْقِراءَةِ",3,"أَتَوَقَّعُ 🔮")+[SH(128,180,1024,230,"FFFDF8"),T(150,190,980,90,P["q"],28,"1E3A3F",True,"right"),T(150,290,980,100,"ثُمَّ أَسْتَمِعُ إِلى مُعَلِّمي، وَأَتابِعُ في كِتَابِي (ص %s)."%S["page"],26,"1E3A3F",False,"right"),ans(128,440,1024,110,P["model"],1,25)],"اكتب ثلاثة توقعات على السبورة لمقارنتها بعد القراءة.")
    # story map
    els=frame(2,"🗺️ نَكْتَشِفُ مَعًا",6,S.get("map_head","خَريطَةُ الْقِصَّةِ 🗺️"))
    for i,(x,(e,t,a)) in enumerate(zip([845,474,102],S["map"])): els+=[SH(x,175,333,420,"FFFDF8","E8DCC8"),IM(x+120,185,90,90,e),T(x,280,333,64,t,28,"0F6E72"),T(x+12,350,309,230,a,S.get("map_size",22),"0B5D3B",True,"center",ANS,True,rv=i+1)]
    els.append(chip(S.get("map_strategy","خَريطَةُ الْقِصَّةِ"))); add(els,"[استراتيجية خريطة القصة] نملأ العناصر معًا: من؟ أين؟ متى؟ من يحكي؟ ثم اكشف الإجابة النموذجية.")
    # match slide
    M=S["match"]; els=frame(2,"🤝 نُطَبِّقُ مَعًا",5,M["head"])
    for i,row in enumerate(M["rows"]):
        c,a=row[0],row[1]; ic=row[2] if len(row)>2 else None; y=180+i*100
        els+=[T(900,y,290,84,c,26,"1E3A3F",True,"center","FFFDF8",True),T(810,y,80,84,"←",30,"0F6E72",True,"center",ff=None)]
        if ic and str(ic).startswith("resources/"): els+=[T(196,y,604,84,a,24,"0B5D3B",True,"right",ANS,True,rv=i+1),{"k":"pic","x":90,"y":y-4,"w":96,"h":92,"src":ic,"cover":True,"radius":18,"shadow":True,"rv":i+1}]
        elif ic: els+=[T(196,y,604,84,a,24,"0B5D3B",True,"right",ANS,True,rv=i+1),SH(96,y+2,84,80,"FFFFFF","E8DCC8",rv=i+1,oval=True),IM(106,y+10,64,64,ic,rv=i+1)]
        else: els+=[T(90,y,710,84,a,24,"0B5D3B",True,"right",ANS,True,rv=i+1)]
    els.append(chip("فَكِّرْ · زاوِجْ · شارِكْ")); add(els,"[فكّر – زاوج – شارك] دقيقة تفكير فردي، ثم يتبادل كل زميلين الإجابة، ثم يشارك ثلاثة أزواج قبل كشف الإجابة.")
    # order
    els=frame(2,"🔢 نُطَبِّقُ مَعًا",5,S.get("order_head","أُرَتِّبُ الْأَحْداثَ 🔢"))
    for i,(x,(e,t,a)) in enumerate(zip([845,474,102],S["order"])): els+=[SH(x,175,333,420,"FFFDF8","E8DCC8"),IM(x+120,185,90,90,e),T(x,280,333,64,t,28,"0F6E72"),T(x+12,350,309,230,a,22,"0B5D3B",True,"center",ANS,True,rv=i+1)]
    els.append(chip(S.get("order_strategy","إِعادَةُ السَّرْدِ بِالتَّسَلْسُلِ"))); add(els,"[إعادة السرد بالتسلسل] كل طالب يمسك بطاقة حدث ويقف في مكانه بحسب ترتيب القصة، ثم يسرد حدثه.")
    WJ=S["wordj"]; add(frame(2,"✂️ رِحْلَتي مَعَ كَلِمَةٍ",3,WJ["head"])+[T(128,180,1024,80,WJ["sent"],30,"1E3A3F",True,"center","FFFDF8",True),T(128,280,1024,60,WJ["q"],26,"1E3A3F",True,"right")]+
        [T(x,350,w,70,o,24,"1E3A3F",False,"center","FFFFFF",True) for (x,w),o in zip([(800,352),(464,320),(128,320)],WJ["opts"])]+[ans(128,450,1024,100,WJ["model"],1,23)],"صوّت الطلاب بالأصابع (أ، ب، ج)، ثم اكشف الإجابة.")
    SP=S["speak"]; add(frame(2,"👩‍🏫 شاهِدْني أَتَحَدَّثُ",4,SP["head"])+[SH(128,180,1024,170,"FFFDF8"),T(150,190,980,150,SP["frame"],32,"1E3A3F",True,"center"),T(128,370,1024,50,"أَقِفُ أَمامَ زُمَلائي، وَأَنْظُرُ إِلَيْهِمْ، وَأَتَحَدَّثُ بِصَوْتٍ واضِحٍ.",22,"0F6E72",True,"center",ff=None),ans(128,440,1024,110,SP["model"],1,24)],"نمذج الإجابة أولًا، ثم يتحدث الطلاب في أزواج.")
    C=S["check"]; add(frame(4,"🚦 إِشارَةُ الِانْطِلاقِ",2,C["q"])+[T(x,200,w,80,o,26,"1E3A3F",False,"center","FFFFFF",True) for (x,w),o in zip([(800,352),(464,320),(128,320)],C["opts"])]+
        [ans(128,320,1024,140,C["model"],1,24),T(128,490,1024,60,"🟥 أَحْتاجُ مُساعَدَةً     🟨 أَحْتاجُ قَليلًا     🟩 جاهِزٌ",24,"1E3A3F",True,"center",ff=None),
         T(128,555,1024,44,"📲 أَمْسَحُ الرَّمْزَ، وَأُقَيِّمُ نَفْسي عَلى مَعاييرِ النَّجاحِ",20,"0F6E72",True,"center","EAF5F4",True,ff=None)],"سؤال تحقق قبل المستويات. ثم «📲 قياس مباشر» من الشريط: يقيّم الطلاب أنفسهم على المعايير.",live=True)
    els=frame(3,"🚀 تَحَدّي الْمُسْتَوَياتِ",10,"كُلُّ مَجْموعَةٍ في مُسْتَواها")
    for i,((nm,col),t) in enumerate(zip(LV,S["groups"])):
        x=[946,692,438,184][i]; els+=[SH(x-6,190,250,400,col),T(x,200,238,60,nm,30,"FFFFFF",True,"right",ff=None),T(x,270,238,300,t,21,"FFFFFF",False,"right")]
    els.append(T(264,610,1015,40,"أوراق المستويات وبطاقات العمل الجماعي في تبويبات الدرس",18,"6B6B6B",False,"center",ff=None)); add(els,"[الأنشطة المتمايزة] وزّع أوراق المستويات الأربعة وورقة أصحاب الهمم.")
    V=S["value"]; add(frame(3,"🌱 قيمَةٌ نَعيشُها",4,V["head"])+[PIC(90,175,300,400,V["img"]),SH(410,175,360,180,"FFFDF8","E8DCC8"),T(425,180,330,46,"🇦🇪 مِنْ سَنْعِ بِلادي",20,"0F6E72"),T(425,228,330,120,V["sana"],20,"1E3A3F",False,"center"),
        SH(790,175,362,180,"FFFDF8","E8DCC8"),T(805,180,332,46,"🏠 حَقيقَةٌ وَطَنِيَّةٌ",20,"0F6E72"),T(805,228,332,120,V["fact"],20,"1E3A3F",False,"center"),SH(410,370,742,90,"FFF6DA","E8DCC8"),T(425,375,712,80,"🤔 "+V["dilemma"],22,"1E3A3F",True,"right"),ans(410,475,742,110,V["model"],1,20)],"[القيمة والسلوك والهوية] ناقش المعضلة، ثم اكشف الإجابة واربطها بالقصة.")
    add(frame(4,"💡 الدَّرْسُ الْمُسْتَفادُ",3,"ماذا تَعَلَّمْتُ مِنَ الْقِصَّةِ؟ 💡")+[SH(128,180,1024,150,"1E3A3F"),T(150,190,980,130,"أَتَعَلَّمُ مِنَ الْقِصَّةِ أَنَّ …",36,"FBF6EC"),ans(128,360,1024,150,S["learned"],1,25)],"اطلب من ثلاثة طلاب إكمال الجملة شفويًا، ثم اكشف النموذج.")
    E=S["exit"]; els=frame(4,"🎟️ تَذْكِرَةُ الْخُروجِ",3,"تَذْكِرَةُ الْخُروجِ 🎟️")
    for i,(x,(q,a)) in enumerate(zip([845,474],E)): els+=[SH(x,175,333,250,"FFFDF8","E8DCC8"),T(x+10,185,313,130,q,22,"1E3A3F"),T(x+10,330,313,85,"✅ "+a,18,"0B5D3B",True,"center",ANS,True,rv=i+1)]
    els+=[T(102,175,333,60,"🟢 أَسْتَطيعُ وَحْدي",20,"1E3A3F",True,"right",ff=None),T(102,240,333,60,"🟡 أَحْتاجُ مُساعَدَةً",20,"1E3A3F",True,"right",ff=None),T(102,305,333,60,"🔴 لَمْ أَفْهَمْ بَعْدُ",20,"1E3A3F",True,"right",ff=None)]
    add(els,"[بطاقة الخروج] يجيب كل طالب وحده، ثم يحلّ بطاقة الخروج على المنصة (10 أسئلة).")
    RF=S["reflect"]; add(frame(4,"🪞 مِرْآةُ التَّعَلُّمِ",2,"ماذا تَعَلَّمْتُ؟")+[T(128,180,1024,100,"🪞 تَعَلَّمْتُ الْيَوْمَ: "+RF[0],22,"1E3A3F",True,"right","FFFDF8",True,rv=1),T(128,295,1024,80,"❓ أَتَساءَلُ: "+RF[1],23,"6B46A8",True,"right","F4EFFB",True,rv=2),T(128,390,1024,110,"🔗 "+RF[2],22,"0F6E72",True,"right","EAF5F4",True,rv=3)],"[غلق الدرس والتأمل] اطلب من ثلاثة طلاب إكمال الجمل قبل كشف كل بطاقة.")
    HM=S["home"]; add(frame(4,"🏠 رِسالَتي إِلى الْبَيْتِ",1,"أَتَعَلَّمُ مَعَ أُسْرَتي")+[PIC(90,175,400,300,HM["img"]),SH(510,175,642,170,"FFFDF8","E8DCC8"),T(525,180,612,46,"🏠 مَعَ أُسْرَتي",20,"0F6E72"),T(525,228,612,110,HM["family"],20,"1E3A3F",False,"center"),
        SH(510,360,642,170,"FFF6DA","E8DCC8"),T(525,365,612,46,"🎯 مُهِمَّةُ أَداءٍ صَغيرَةٌ",20,"9A5B2E"),T(525,413,612,110,HM["task"],20,"1E3A3F",False,"center")],"[التكليف ومهمة الأداء] ذكّر الطلاب بالمهمة، وحدّد موعد العرض.")
    GOAL="🎯 "+S["strip"]
    for s in out[1:]:
        lab=next((e["text"] for e in s["els"] if e["k"]=="text" and e["x"]==461 and e["y"]==28),"")
        if not any(k in lab for k in ["وِجْهَتُنا","تَحَدّي","تَذْكِرَةُ","مِرْآةُ","رِسالَتي"]): s["els"].append(T(330,612,620,44,GOAL,18,"0F6E72",True,"center","EAF5F4",True))
    for s in out:
        for e in s["els"]:
            if e["k"]=="text" and e.get("ff")=="naskh":
                bare=re.sub("[\u064B-\u0652\u0670]","",e["text"])
                if e["h"]<e["size"]*2+8 and len(bare)<45: e["size"]=int((e["h"]-8)//2)
    return {"code":S["code"],"en":False,"slides":out}
# ---- visual themes: same structure, different look per lesson (avoid monotony) ----
THEMES=[
 {"bg":"FBF6EC","acc":"0F6E72","dark":"1E3A3F","card":"FFFDF8","line":"E8DCC8","soft":"EAF5F4","acc2":"F2A93B","flip":False},
 {"bg":"F1F6FB","acc":"1F5FA8","dark":"14325C","card":"FFFFFF","line":"D6E2F0","soft":"E6EFFA","acc2":"F2A93B","flip":True},
 {"bg":"FCF3F5","acc":"B0395F","dark":"4A1D2C","card":"FFFFFF","line":"F0D5DC","soft":"FBE6EC","acc2":"E9A23B","flip":False},
 {"bg":"F3F8EF","acc":"2F7D32","dark":"1F3D20","card":"FFFFFF","line":"D8E8CF","soft":"E7F3E1","acc2":"E3A21A","flip":True},
 {"bg":"FFF6EC","acc":"C2571A","dark":"4A2410","card":"FFFFFF","line":"F2DCC6","soft":"FDEBDC","acc2":"2F7D7A","flip":False},
 {"bg":"F6F3FB","acc":"5B3FA0","dark":"2C2150","card":"FFFFFF","line":"E1D9F2","soft":"EEE8FA","acc2":"E6A23C","flip":True}]
BASE={"bg":"FBF6EC","acc":"0F6E72","dark":"1E3A3F","card":"FFFDF8","line":"E8DCC8","soft":"EAF5F4","acc2":"F2A93B"}
def theme(deck,t):
    th=THEMES[t%len(THEMES)]; m={}
    for k,v in BASE.items(): m[v]=th[k]
    m["FFFDF7"]=th["card"]; m["CFE3E1"]=th["soft"]; m["A9C4C3"]="D9D2C5" if t%len(THEMES) else "A9C4C3"
    for sl in deck["slides"]:
        if sl.get("bg") in m: sl["bg"]=m[sl["bg"]]
        for e in sl["els"]:
            for key in ("fill","line","color"):
                if e.get(key) in m: e[key]=m[e[key]]
    lv=deck.get("layout_v", t%3)
    layout(deck,lv,th) if lv<3 else layout2(deck,lv,th)
    if th["flip"] and lv==0:  # title slide mirrored: picture on the right, text on the left
        t0=deck["slides"][0]
        for e in t0["els"]:
            if e["k"]=="text": e["x"]=86
            elif e["k"]=="shape": e["x"]=824
            elif e["k"]=="pic": e["x"]=838
    return deck
# ---- layout templates: same content, different composition (A classic · B pills & bold columns · C header band) ----
def _is(e,k,**kw): return e["k"]==k and all(e.get(a)==b for a,b in kw.items())
def layout(deck,v,th):
    if v==0: return
    acc,acc2,dark,soft=th["acc"],th["acc2"],th["dark"],th["soft"]
    cols=[acc,acc2,dark]
    for si,sl in enumerate(deck["slides"]):
        els=sl["els"]
        if si==0:
            if v==2:  # centered title: framed picture on top, text below
                for e in els:
                    if e["k"]=="shape": e.update(x=440,y=36,w=400,h=330)
                    elif e["k"]=="pic": e.update(x=454,y=50,w=372,h=302)
                    elif e["k"]=="text":
                        e.update(x=140,w=1000,align="center")
                        if e["y"]==150: e.update(y=384,h=44)
                        elif e["y"]==206: e.update(y=426,h=110,size=min(e["size"],48))
                        elif e["y"]==380: e.update(y=534,h=56,size=min(e["size"],22))
                        elif e["y"]==440: e.update(y=588,h=56,size=min(e["size"],22))
                els.insert(0,{"k":"shape","x":-120,"y":420,"w":420,"h":420,"fill":acc,"rad":True,"oval":True})
                els.insert(0,{"k":"shape","x":1000,"y":-160,"w":420,"h":420,"fill":acc2,"rad":True,"oval":True})
            continue
        label=next((e for e in els if _is(e,"text",x=461,y=28)),None)
        if not label: continue
        timer=next((e for e in els if _is(e,"text",x=86,y=26)),None)
        head=next((e for e in els if _is(e,"text",x=86,y=92)),None)
        els[:]=[e for e in els if not (e["k"]=="shape" and e["y"]==42 and e["h"]==15)]
        goal=any(e.get("text")=="هدف الدرس ومعايير النجاح" for e in els)
        colcards=[e for e in els if e["k"]=="shape" and e["y"]==175 and e["h"]==420 and e["w"]==333]
        cards=[e for e in els if e["k"]=="shape" and e.get("line") and e not in colcards]
        if v==1:
            label.update(x=466,y=16,w=548,h=58,fill=acc,color="FFFFFF",rad=True,size=24)
            timer.update(x=50,y=16,w=210,h=58,fill=acc2,color="1E1E1E",rad=True,size=22,text=timer["text"].replace(" د"," دَقائِقَ"))
            if head: head.update(y=92)
            for i,c in enumerate(colcards):
                c.update(fill=cols[i%3]); c.pop("line",None)
                for e in els:
                    if e["k"]=="text" and e["y"]==280 and c["x"]<=e["x"]<c["x"]+50: e["color"]="FFFFFF"
            for c in cards: c.update(fill="FFFFFF",line=acc,lw=3)
            els.insert(0,{"k":"shape","x":-90,"y":-90,"w":240,"h":240,"fill":soft,"rad":True,"oval":True})
            els.insert(0,{"k":"shape","x":1130,"y":560,"w":260,"h":260,"fill":soft,"rad":True,"oval":True})
        else:
            band={"k":"shape","x":0,"y":0,"w":1280,"h":140,"fill":acc,"rad":False}
            label.update(x=640,y=14,w=600,h=34,color="FFFFFF",fill=None,align="right",size=18)
            if goal:
                els[:]=[e for e in els if not ((e["k"]=="shape" and e["x"]==380 and e["y"]==86) or e.get("text")=="هدف الدرس ومعايير النجاح")]
                cards=[c for c in cards if c in els]
                if not head:
                    head={"k":"text","x":300,"y":48,"w":940,"h":80,"text":"هَدَفُ الدَّرْسِ وَمَعاييرُ النَّجاحِ","size":34,"color":"FFFFFF","bold":True,"align":"right","fill":None,"rad":False,"va":"middle","ff":"naskh"}; els.append(head)
            if head: head.update(y=48,h=80,color="FFFFFF",size=34)
            mins=timer["text"].replace("⏱","").strip()
            els[:]=[e for e in els if e is not timer]
            badge=[{"k":"shape","x":40,"y":22,"w":96,"h":96,"fill":"FFFFFF","rad":True,"oval":True},{"k":"text","x":40,"y":22,"w":96,"h":96,"text":"⏱\n"+mins,"size":18,"color":acc,"bold":True,"align":"center","fill":None,"rad":False,"va":"middle"}]
            for e in els:
                if e["k"]=="text" and e.get("text","").startswith("🧭 الِاسْتِراتيجِيَّةُ"): e.update(x=150,y=92,w=420,h=40,size=16)
            for c in colcards:
                c.update(fill="FFFFFF",line=soft,lw=2)
            extra=[]
            for c in cards+colcards:
                extra.append({"k":"shape","x":c["x"]+16,"y":c["y"]-5,"w":c["w"]-32,"h":10,"fill":acc2,"rad":True})
            for c in cards: c.update(fill=soft); c.pop("line",None)
            els[:]=[band]+badge+els+extra
            els.insert(0,{"k":"shape","x":1150,"y":590,"w":200,"h":200,"fill":soft,"rad":True,"oval":True})
# ---- layouts D/E/F (rich effects: gradients, shadows, tilt, frames) ----
def layout2(deck,v,th):
    acc,acc2,dark,soft,bg=th["acc"],th["acc2"],th["dark"],th["soft"],th["bg"]
    for si,sl in enumerate(deck["slides"]):
        els=sl["els"]
        if si==0:
            pic=next((e for e in els if e["k"]=="pic"),None); frame=next((e for e in els if e["k"]=="shape"),None)
            if frame in els: els.remove(frame)
            texts=[e for e in els if e["k"]=="text"]
            if v==3:   # polaroid tilt on gradient
                sl["bg"]=dark; sl["bg2"]=acc
                if pic: pic.update(x=820,y=110,w=360,h=420,frame=14,shadow=True,rot=-4,cover=False)
                for e in texts: e.update(x=96,w=690)
                els.insert(0,{"k":"shape","x":760,"y":80,"w":440,"h":500,"fill":acc2,"rad":True,"radius":30,"rot":5,"op":0.55})
            elif v==4: # sticker
                sl["bg"]=soft
                if pic: pic.update(x=830,y=120,w=340,h=400,frame=10,shadow="hard",sc=dark,rot=3)
                els.insert(0,{"k":"shape","x":800,"y":96,"w":400,"h":450,"fill":acc2,"radius":26,"rot":-6,"shadow":"hard","sc":dark})
                for e in texts: e.update(x=86,w=700,color=(dark if e.get("color") in ("FBF6EC","FFFFFF") else acc))
                els.insert(0,{"k":"shape","x":60,"y":560,"w":70,"h":70,"fill":acc,"radius":18,"rot":20})
                els.insert(0,{"k":"shape","x":700,"y":40,"w":46,"h":46,"fill":acc2,"oval":True,"rad":True})
            else:      # glass gradient + round photo
                sl["bg"]=acc; sl["bg2"]=dark
                if pic: pic.update(x=820,y=150,w=360,h=360,cover=True,radius=180,frame=10,shadow=True)
                for e in texts: e.update(x=96,w=690)
                els.insert(0,{"k":"shape","x":-160,"y":-160,"w":520,"h":520,"fill":"FFFFFF","oval":True,"rad":True,"op":0.08})
                els.insert(0,{"k":"shape","x":1000,"y":470,"w":420,"h":420,"fill":"FFFFFF","oval":True,"rad":True,"op":0.08})
            continue
        label=next((e for e in els if _is(e,"text",x=461,y=28)),None)
        if not label: continue
        timer=next((e for e in els if _is(e,"text",x=86,y=26)),None)
        head=next((e for e in els if _is(e,"text",x=86,y=92)),None)
        els[:]=[e for e in els if not (e["k"]=="shape" and e["y"]==42 and e["h"]==15)]
        colcards=[e for e in els if e["k"]=="shape" and e["y"]==175 and e["h"]==420 and e["w"]==333]
        cards=[e for e in els if e["k"]=="shape" and e.get("line") and e not in colcards]
        if v==3:
            sl["bg2"]=soft
            rib={"k":"shape","x":1214,"y":0,"w":66,"h":720,"fill":acc,"grad":dark,"gdir":180}
            label.update(x=86,y=24,w=440,h=44,fill=acc,color="FFFFFF",rad=True,size=20,radius=22,shadow=True)
            if timer: timer.update(x=1218,y=630,w=58,h=58,fill="FFFFFF",color=acc,size=13,radius=29,text=timer["text"].replace("⏱","").strip())
            if head: head.update(x=86,y=82,w=1110,color=dark)
            for c in cards: c.pop("line",None); c.update(fill="FFFFFF",shadow=True,radius=22)
            bands=[]
            for c in colcards:
                c.pop("line",None); c.update(fill="FFFFFF",shadow=True,radius=24)
                bands.append((c,{"k":"shape","x":c["x"],"y":c["y"],"w":c["w"],"h":100,"fill":acc,"grad":acc2,"radius":24}))
            for c,b in bands: els.insert(els.index(c)+1,b)
            els.insert(0,rib)
        elif v==4:
            label.update(x=470,y=20,w=360,h=50,fill=acc2,color=dark,rad=True,size=22,rot=-3,shadow="hard",sc=dark)
            if timer: timer.update(x=60,y=22,w=190,h=50,fill=acc,color="FFFFFF",rad=True,size=20,rot=3,shadow="hard",sc=dark)
            if head: head.update(color=dark)
            for c in cards+colcards: c.update(fill="FFFFFF",line=dark,lw=1.6,radius=20,shadow="hard",sc=acc)
            els.insert(0,{"k":"shape","x":1190,"y":610,"w":60,"h":60,"fill":acc2,"radius":14,"rot":25})
            els.insert(0,{"k":"shape","x":20,"y":590,"w":34,"h":34,"fill":acc,"oval":True,"rad":True})
            els.insert(0,{"k":"shape","x":1230,"y":120,"w":28,"h":28,"fill":acc,"radius":8,"rot":45})
        else:
            sl["bg2"]=soft
            if any(e.get("text")=="هدف الدرس ومعايير النجاح" for e in els):
                els[:]=[e for e in els if not ((e["k"]=="shape" and e["x"]==380 and e["y"]==86) or e.get("text")=="هدف الدرس ومعايير النجاح")]
                cards=[c for c in cards if c in els]
                if not head:
                    head={"k":"text","x":240,"y":62,"w":970,"h":80,"text":"هَدَفُ الدَّرْسِ وَمَعاييرُ النَّجاحِ","size":34,"color":"FFFFFF","bold":True,"align":"right","fill":None,"rad":False,"va":"middle","ff":"naskh"}; els.append(head)
            hdr={"k":"shape","x":40,"y":14,"w":1200,"h":140,"fill":acc,"grad":dark,"radius":32,"shadow":True}
            label.update(x=640,y=26,w=570,h=34,color="FFFFFF",fill=None,align="right",size=18,op=0.9)
            if timer: timer.update(x=64,y=50,w=150,h=46,fill="FFFFFF",color=acc,rad=True,size=18,radius=23)
            if head: head.update(x=240,y=62,w=970,h=80,color="FFFFFF",size=34)
            for e in els:
                if e["k"]=="text" and e.get("text","").startswith("🧭 الِاسْتِراتيجِيَّةُ"): e.update(y=112 if e["y"]<170 else e["y"],x=240 if e["y"]<170 else e["x"],w=420,h=34,size=15)
            for c in cards+colcards: c.pop("line",None); c.update(fill="FFFFFF",shadow=True,radius=26)
            els.insert(0,hdr)
            els.insert(0,{"k":"shape","x":980,"y":420,"w":420,"h":420,"fill":acc2,"oval":True,"rad":True,"op":0.12})
            els.insert(0,{"k":"shape","x":-140,"y":380,"w":320,"h":320,"fill":acc,"oval":True,"rad":True,"op":0.10})
if __name__=="__main__":
    S=json.load(open(sys.argv[1],encoding="utf-8")); D_=build(S); D_["layout_v"]=S.get("layout",S.get("theme",0)%3); json.dump(theme(D_,S.get("theme",0)),open(sys.argv[2],"w",encoding="utf-8"),ensure_ascii=False)
