import json, sys, importlib, re
ROOT="/home/claude/hira"
GR={"ar":"الصف الثاني"}
def sub(t): return t.replace("[[","").replace("]]","")
KIND={"nn":"العربية تجمعنا","vocab":"المفردات والمهارة","story":"القصة","act":"دورك الآن والمحادثة","info":"النص المعلوماتي","gram":"اعرف لغتك","write":"الكتابة","poem":"النشيد","listen":"الاستماع"}
def subj(s):  # indicative criterion -> subjunctive after «أستطيع أن»
    w=s.split(" ",1); v=w[0]
    if v.endswith("ُ"): v=v[:-1]+"َ"
    elif v.endswith("ي"): v=v+"َ"
    rest=w[1] if len(w)>1 else ""
    rest=re.sub(r"(\s|،\s)(وَ?)(أُ|أَ)(\S+?)ُ(\s|\.|،)", lambda m:m.group(1)+m.group(2)+m.group(3)+m.group(4)+"َ"+m.group(5), rest)
    return v+" "+rest
import re as _re
def _st(t): 
    t=_re.sub(r"[\u064B-\u0652\u0670\[\]«»]","",t); t=t.replace("أ","ا").replace("إ","ا").replace("آ","ا").replace("ة","ه").replace("ى","ي")
    return t.strip()
EMO={"مطر":"🌧️","غيث":"🌧️","ريح":"🌬️","رعد":"⛈️","برق":"⚡","ثلج":"❄️","رمل":"🏜️","شمس":"☀️","قمر":"🌙","نجم":"⭐","بحر":"🌊","نهر":"🏞️","شجر":"🌳","زهر":"🌸","ورد":"🌹","عصفور":"🐦","فرخ":"🐣","اوز":"🦢","سلحف":"🐢","خلد":"🐀","بطاطا":"🥔","خس":"🥬","جزر":"🥕","طماطم":"🍅","تفاح":"🍎","كتاب":"📖","قلم":"✏️","مدرس":"🏫","بيت":"🏠","طفل":"🧒","صوت":"🔊","خوف":"😨","فرح":"😄","حزن":"😢","سعاد":"😊","جناح":"🪽","عش":"🪺","بيض":"🥚","هاتف":"📱","رسال":"✉️","سؤال":"❓","حرف":"🔤","فعل":"🏃","اسم":"🏷️","مكان":"📍","انسان":"🧑","حيوان":"🐾","نبات":"🌿","جماد":"📦","ماض":"⏪","مضارع":"▶️"}
def _icon(text, d, vimg, left=True):
    t=_st(text)
    if left:
        for k,v in vimg.items():
            if _st(k) and _st(k) in t: return v
    for wd in d["words"]:
        w,e=_st(wd[0]),wd[2]
        if len(w)>=3 and (w in t or (left and t in w and len(t)>=3)): return e
    for k,v in EMO.items():
        if len(k)>2 and k in t: return v
    return None
def _short(t):
    t=sub(t); return t.split(": ",1)[-1].split("«")[-1].split("»")[0].strip()
def recall(d, prev):
    if prev:
        pw=prev["words"]; pt=_short(prev["title"])
        used=[_st(x[0]) for x in pw[:2]]+[_st(x[1]) for x in pw[:2]]
        cand=[q for q in prev["qs"] if not any(u and (u in _st(q[0]) or u==_st(q[1][0])) for u in used)]
        cand.sort(key=lambda q:len(q[0])); pq=[(cand or prev["qs"])[0][0],(cand or prev["qs"])[0][1][0]]
        mn=("Meaning: …" if prev.get("nn") else "مَعْناها: …")
        cards=[[pw[0][2],"«"+pw[0][0]+"»",mn,pw[0][1]],
               ["❓","سُؤالٌ مِنَ الدَّرْسِ",*pq]]
        if len(pw)>1: cards.insert(1,[pw[1][2],"«"+pw[1][0]+"»",mn,pw[1][1]])
        head="مِنْ دَرْسِ «"+pt[:30]+"»"
    else:
        w=d["words"]; cards=[[x[2],"«"+x[0]+"»",("Do you know it?" if d.get("nn") else "هَلْ تَعْرِفُ مَعْناها؟"),x[1]] for x in w[:3]]; head="ماذا نَعْرِفُ؟"
    return dict(head=head,img="alt",cards=cards,link="🔗 وَالْيَوْمَ: "+(d["hook"][1] if len(d["hook"][1])<=95 else d["hook"][0]),note="[استرجاع] اسأل عن كل بطاقة شفويًا، ثم اكشف الإجابة بالنقر، ثم اقرأ جسر الربط بدرس اليوم.")
def build(prefix, d, prev=None, vimg=None):
    vimg=vimg or {}
    d=dict(d); d["words"]=[list(w)+([p] if (p:=next((v for k,v in vimg.items() if _st(k) and (_st(k) in _st(w[0]) or (len(_st(w[0]))>=3 and _st(w[0]) in _st(k)))),None)) else []) for w in d["words"]]
    rows=[]
    for r in d["match"][1]:
        ic=_icon(r[0],d,vimg) or _icon(r[1],d,vimg,False)
        rows.append(list(r)+([ic] if ic else []))
    d["match"]=(d["match"][0],rows)
    code=prefix+d["code"]; poem=d["kind"]=="poem"; img=f"resources/slides/img/{code}-"
    body=d["book"]; lines=[l for l in body.split("\n") if l.strip()]
    key=lines[:4] if len(lines)>4 else lines
    Q=[]
    for s,o in d["qs"]: Q.append(dict(qt="mcq",d=2,stem=s,opts=o,ok="a",ex="من نص الدرس (ص "+d["page"]+")."))
    for s,ok in d["tfs"]: Q.append(dict(qt="true_false",d=1,stem=s,ok=ok,ex=("صحيح." if ok=="t" else "خطأ.")+" (ص "+d["page"]+")"))
    Q=[Q[0],Q[1],Q[2],Q[6],Q[3],Q[4],Q[5],Q[7],Q[8],Q[9]]
    title=d["title"]
    pack=dict(code=code,book=dict(kind=("poem" if poem else "prose"),title=sub(title),pages=d["page"],body=body),objective=d["objective"],criteria=d["sc"],
      summary=dict(hook=d["hook"][0],idea=d["objective"].replace("أَنْ أَ","").replace("أَنْ أُ",""),key=key,words=[[w[0],w[1]+" "+w[2]] for w in d["words"]],
        learn=[["🎯",s] for s in d["sc"]],quiz=[[s,ok=="t"] for s,ok in d["tfs"][:2]],think=d["value"]["dilemma"],do=[d["home"][0],d["home"][1],d["value"]["sana"]],badge=d["value"]["head"]+" ⭐"),questions=Q)
    m=d["map"]; o=d["order"]; wj=d["wordj"]
    S=dict(code=code,words_head=("كَلِماتٌ مِنَ الْقِصَّةِ 🆕" if d["kind"] in ("vocab","story","act") else "كَلِماتُ الدَّرْسِ 🆕"),layout=d.get("layout",d["theme"]%3),tagline="نَقْرَأُ · نَفْهَمُ · نُبْدِعُ 📚",theme=d["theme"],imgbase=img,page=d["page"],kicker="اللغة العربية · "+GR["ar"]+" · "+KIND[d["kind"]],title=title,
      byline=("تَأْليفُ: "+d["author"]+" · " if d.get("author") else "")+"كِتابي ص "+d["page"],title_note="اعرض الصورة واسأل: ماذا ترون؟ بماذا تذكّركم؟",
      objective=d["objective"],criteria=[subj(c) for c in d["sc"]],strip=d["value"]["head"] if False else sub(title).split(":")[-1].strip()[:40],
      retrieval=recall(d,prev),
      hook=dict(head=d["hook"][0],img="main",q=d["hook"][1],model=d["hook"][2],note="[التهيئة] فكّر – زاوج – شارك."),
      words=d["words"],predict=dict(q="أَقْرَأُ الْعُنْوانَ «"+sub(title).split(": ")[-1]+"»، وَأَتَوَقَّعُ: عَمَّ يَتَحَدَّثُ الدَّرْسُ؟",model=sub(key[0])[:140]),
      map_head=m[0],map_strategy=m[1],map=m[2],match=dict(head=d["match"][0],rows=d["match"][1]),order_head=o[0],order_strategy=o[1],order=o[2],
      wordj=dict(head=f"رِحْلَتي مَعَ كَلِمَةِ «{wj[0]}» 🔤",sent=wj[1],q=f"مَعْنى «{wj[0]}» هُنا:",opts=wj[2],model=wj[3]),
      speak=dict(head=d["speak"][0],frame=d["speak"][1],model=d["speak"][2]),check=dict(q=d["check"][0],opts=d["check"][1],model="الْإِجابَةُ "+d["check"][2]),
      groups=["أُجيبُ عَنِ الْأَسْئِلَةِ الْمُباشِرَةِ، وَأَصِلُ الْكَلِماتِ بِمَعانيها.","أُفَسِّرُ الْكَلِماتِ، وَأُكْمِلُ الْمُخَطَّطَ.","أُرَتِّبُ وَأُصَنِّفُ وَأُطَبِّقُ مَهارَةَ الدَّرْسِ.","أَكْتُبُ وَأُبْدي رَأْيي، وَأَعْرِضُ عَلى زُمَلائي."],
      value=dict(d["value"],img="main"),learned="أَتَعَلَّمُ: "+"، ".join(c.rstrip(".") for c in d["sc"][:2])+".",
      exit=[[d["qs"][0][0],d["qs"][0][1][0]],[d["qs"][1][0],d["qs"][1][1][0]]],
      reflect=[sub(d["sc"][2]),d["value"]["dilemma"],"أَرْبِطُ بِحَياتي: "+d["value"]["sana"]],
      home=dict(img="cover",family=d["home"][0],task=d["home"][1]))
    W=d["words"]
    kws=[]; tot=0
    for l in key:
        t=l if len(sub(l))<=150 else l[:l.rfind(" ",0,170)]+" …"
        if tot+len(sub(t))>330: break
        kws.append(t); tot+=len(sub(t))
    if not kws: kws=[key[0][:key[0].rfind(" ",0,170)]+" …"]
    WS=dict(code=code,grade=GR["ar"],title=re.sub("[\u064B-\u0652]","",sub(title)),pages=d["page"],readhead="أَقْرَأُ مِنْ "+("النَّشيدِ" if poem else "الدَّرْسِ"),key=kws,
      words=[[w[0],w[1]] for w in W],criteria=[re.sub("[\u064B-\u0652]","",c)[:34] for c in d["sc"]],
      levels=dict(bronze=dict(goal="أَسْتَطيعُ أَنْ أُجيبَ عَنِ الْأَسْئِلَةِ الْمُباشِرَةِ.",tasks=[dict(type="choose",q="أَخْتارُ الْإِجابَةَ:",items=[[s,o] for s,o in d["qs"][:2]]),dict(type="match",q="أَصِلُ الْكَلِمَةَ بِمَعْناها:",a=[w[0] for w in W[:3]],b=[W[1][1],W[2][1],W[0][1]])]),
        silver=dict(goal="أَسْتَطيعُ أَنْ أُفَسِّرَ وَأُكْمِلَ الْمُخَطَّطَ.",tasks=[dict(type="choose",q="أَخْتارُ:",items=[[s,o] for s,o in d["qs"][2:4]]),dict(type="cells",q=m[0].split(" 🗺")[0].replace("🗺️","").strip()+":",cols=3,cells=[c[1]+":" for c in m[2]])]),
        gold=dict(goal="أَسْتَطيعُ أَنْ أُرَتِّبَ وَأُطَبِّقَ.",tasks=[dict(type="order",q="أُرَقِّمُ بِالتَّرْتيبِ (1، 2، 3):",items=[sub(o[2][2][2]),sub(o[2][0][2]),sub(o[2][1][2])]),dict(type="choose",q="أَخْتارُ:",items=[[s,o2] for s,o2 in d["qs"][4:6]])]),
        challenge=dict(goal="أَسْتَطيعُ أَنْ أَكْتُبَ وَأُبْدِيَ رَأْيي.",tasks=[dict(type="lines",q=d["value"]["dilemma"],n=2),dict(type="lines",q=d["home"][1],n=3)])),
      pod=dict(goal="أَتَعَرَّفُ كَلِماتِ الدَّرْسِ.",q1="أُشيرُ إِلى الصّورَةِ، وَأَقولُ كَلِمَةً عَنْها.",pics=[[(W[0][3] if len(W[0])>3 else img+"cover.webp"),W[0][0]],[(W[1][3] if len(W[1])>3 else img+"main.webp"),W[1][0]],[(W[2][3] if len(W[2])>3 else img+"alt.webp"),W[2][0]]],q2="أَتَتَبَّعُ الْكَلِمَةَ بِقَلَمي:",trace=W[0][0],q3="أُلَوِّنُ الْقَلْبَ."),
      concept=dict(elements=[[c[1],c[2]] for c in m[2]],message=sub(d["sc"][2])),
      answers=dict(bronze=[" · ".join(o2[0] for s,o2 in d["qs"][:2])," · ".join(f"{w[0]} ← {w[1]}" for w in W[:3])],silver=[" · ".join(o2[0] for s,o2 in d["qs"][2:4])]+[c[1]+": "+c[2] for c in m[2]],
        gold=["التَّرْتيبُ: (3) · (1) · (2)"," · ".join(o2[0] for s,o2 in d["qs"][4:6])],challenge=[d["value"]["model"],"تُقْبَلُ كُلُّ إِجابَةٍ صَحيحَةٍ مُرَتَّبَةٍ."]),
      groups=dict(roles=["📖 القارِئُ","✏️ الْكاتِبُ","⏱ حارِسُ الْوَقْتِ","🎤 الْمُتَحَدِّثُ"],
        bronze=dict(goal="نُجيبُ عَنِ الْأَسْئِلَةِ.",text=[sub(key[0])[:120]],steps=["نَقْرَأُ مَعًا.","يَسْأَلُ كُلٌّ مِنّا زَميلَهُ.","نَرْسُمُ ما فَهِمْناهُ."],product="لَوْحَةُ الْمَجْموعَةِ"),
        silver=dict(goal="نُفَسِّرُ الْكَلِماتِ.",text=[" · ".join(w[0] for w in W)],steps=["نَبْحَثُ عَنِ الْكَلِماتِ.","نَكْتُبُ مَعانِيَها.","نُكَوِّنُ جُمَلًا بِها."],product="بِطاقاتُ الْكَلِماتِ"),
        gold=dict(goal=m[0].replace("🗺️","").strip(),text=[c[1] for c in m[2]],steps=["نَرْسُمُ الْمُخَطَّطَ.","نَمْلَؤُهُ مِنَ الدَّرْسِ.","نَعْرِضُهُ عَلى الصَّفِّ."],product="مُخَطَّطُ الْمَجْموعَةِ"),
        challenge=dict(goal="نُعَبِّرُ وَنَعْرِضُ.",text=[d["value"]["head"]],steps=["نَتَناقَشُ في الْمَوْقِفِ.","نَكْتُبُ رَأْيَنا.","نَعْرِضُهُ أَمامَ الصَّفِّ."],product="بِطاقَةُ الرَّأْيِ")))
    if d.get("nn"):
        S.update(nn=True,criteria=list(d["sc"]),tagline="أَسْمَعُ · أَتَحَدَّثُ · أَقْرَأُ · أَكْتُبُ 🌟",kicker="العربية تجمعنا · "+GR["ar"]+" · Arabic for non-native speakers",
                 words_head="كَلِماتُ الدَّرْسِ · New words 🆕",learned="I learned: "+"; ".join(c.replace("I can ","").rstrip(".") for c in d["sc"][:2])+".")
        WS.update(grade=GR["ar"]+" · لغير الناطقين بها",criteria=[c[:60] for c in d["sc"]])
        L=WS["levels"]; L["bronze"]["goal"]="I can answer simple questions."; L["silver"]["goal"]="I can explain words and complete the organiser."
        L["gold"]["goal"]="I can put things in order and use the language."; L["challenge"]["goal"]="I can write and give my opinion."
        tr={"أَخْتارُ الْإِجابَةَ:":"أَخْتارُ الْإِجابَةَ (Choose):","أَخْتارُ:":"أَخْتارُ (Choose):","أَصِلُ الْكَلِمَةَ بِمَعْناها:":"أَصِلُ الْكَلِمَةَ بِمَعْناها (Match):","أُرَقِّمُ بِالتَّرْتيبِ (1، 2، 3):":"أُرَقِّمُ بِالتَّرْتيبِ (Number 1–3):"}
        for lv in L.values():
            for t in lv["tasks"]: t["q"]=tr.get(t["q"],t["q"])
        WS["pod"]["goal"]="I know the lesson words. أَتَعَرَّفُ كَلِماتِ الدَّرْسِ."
        pack["summary"]["idea"]=d["objective"]
    return pack,S,WS
if __name__=="__main__":
    mod=sys.argv[1]; prefix=sys.argv[2]; outdir=sys.argv[3]
    sys.path.insert(0,f"{ROOT}/_tools/arabic/g2"); MOD=importlib.import_module(mod); U=MOD.U; GR["ar"]=getattr(MOD,"GRADE","الصف الثاني"); VI=getattr(MOD,"VOCAB_IMG",{})
    packs=[]; prev=None
    pm=getattr(MOD,"PREV_MOD",None)
    if pm: prev=importlib.import_module(pm).U[-1]
    for d in U:
        p,S,WS=build(prefix,d,prev=prev,vimg=VI); packs.append(p); prev=d
        json.dump(S,open(f"{outdir}/{d['code']}.deck.json","w",encoding="utf-8"),ensure_ascii=False)
        json.dump(WS,open(f"{outdir}/{d['code']}.json","w",encoding="utf-8"),ensure_ascii=False)
    json.dump(packs,open(f"{outdir}/packs.json","w",encoding="utf-8"),ensure_ascii=False); print(len(packs))
