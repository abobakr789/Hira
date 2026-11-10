import json, sys, importlib, re
ROOT="/home/claude/hira"
def sub(t): return t.replace("[[","").replace("]]","")
KIND={"vocab":"المفردات والمهارة","story":"القصة","act":"دورك الآن والمحادثة","info":"النص المعلوماتي","gram":"اعرف لغتك","write":"الكتابة","poem":"النشيد","listen":"الاستماع"}
def subj(s):  # indicative criterion -> subjunctive after «أستطيع أن»
    w=s.split(" ",1); v=w[0]
    if v.endswith("ُ"): v=v[:-1]+"َ"
    elif v.endswith("ي"): v=v+"َ"
    rest=w[1] if len(w)>1 else ""
    rest=re.sub(r"(\s|،\s)(وَ?)(أُ|أَ)(\S+?)ُ(\s|\.|،)", lambda m:m.group(1)+m.group(2)+m.group(3)+m.group(4)+"َ"+m.group(5), rest)
    return v+" "+rest
def build(prefix, d, prev=None):
    code=prefix+d["code"]; poem=d["kind"]=="poem"; img=f"resources/slides/img/{code}-"
    body=d["book"]; lines=[l for l in body.split("\n") if l.strip()]
    key=lines[:4] if len(lines)>4 else lines
    Q=[]
    for s,o in d["qs"]: Q.append(dict(qt="mcq",d=2,stem=s,opts=o,ok="a",ex="من نص الدرس (ص "+d["page"]+")."))
    for s,ok in d["tfs"]: Q.append(dict(qt="true_false",d=1,stem=s,ok=ok,ex=("صحيح." if ok=="t" else "خطأ.")+" (ص "+d["page"]+")"))
    Q=[Q[0],Q[1],Q[2],Q[6],Q[3],Q[4],Q[5],Q[7],Q[8],Q[9]]
    title=d["title"]
    pack=dict(code=code,book=dict(kind=("poem" if poem else "prose"),title=sub(title),pages=d["page"],body=body),objective=d["objective"],criteria=d["sc"],
      summary=dict(hook=d["hook"][0],idea=d["objective"].replace("أَنْ أَ","").replace("أَنْ أُ",""),key=key,words=[[w,m+" "+e] for w,m,e in d["words"]],
        learn=[["🎯",s] for s in d["sc"]],quiz=[[s,ok=="t"] for s,ok in d["tfs"][:2]],think=d["value"]["dilemma"],do=[d["home"][0],d["home"][1],d["value"]["sana"]],badge=d["value"]["head"]+" ⭐"),questions=Q)
    m=d["map"]; o=d["order"]; wj=d["wordj"]
    S=dict(code=code,tagline="نَقْرَأُ · نَفْهَمُ · نُبْدِعُ 📚",theme=d["theme"],imgbase=img,page=d["page"],kicker="اللغة العربية · الصف الثاني · "+KIND[d["kind"]],title=title,
      byline=("تَأْليفُ: "+d["author"]+" · " if d.get("author") else "")+"كِتابي ص "+d["page"],title_note="اعرض الصورة واسأل: ماذا ترون؟ بماذا تذكّركم؟",
      objective=d["objective"],criteria=[subj(c) for c in d["sc"]],strip=d["value"]["head"] if False else sub(title).split(":")[-1].strip()[:40],
      retrieval=dict(head="ماذا نَتَذَكَّرُ؟",img="alt",qa=(prev or [["عَناصِرُ الْقِصَّةِ:","مَنْ؟ أَيْنَ؟ مَتى؟ ماذا؟"],["الِاسْمُ يَدُلُّ عَلى:","إِنْسانٍ وَحَيَوانٍ…"],["أَجْزاءُ الْفِقْرَةِ:","ثَلاثَةٌ"]]),link="🔗 أَرْبِطُ: ما تَعَلَّمْتُهُ مِنْ قَبْلُ يُساعِدُني في دَرْسِ الْيَوْمِ.",note="[استرجاع] اسأل شفويًا، ثم اكشف الإجابة."),
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
    WS=dict(code=code,grade="الصف الثاني",title=re.sub("[\u064B-\u0652]","",sub(title)),pages=d["page"],readhead="أَقْرَأُ مِنْ "+("النَّشيدِ" if poem else "الدَّرْسِ"),key=kws,
      words=[[w,m] for w,m,_ in W],criteria=[re.sub("[\u064B-\u0652]","",c)[:34] for c in d["sc"]],
      levels=dict(bronze=dict(goal="أَسْتَطيعُ أَنْ أُجيبَ عَنِ الْأَسْئِلَةِ الْمُباشِرَةِ.",tasks=[dict(type="choose",q="أَخْتارُ الْإِجابَةَ:",items=[[s,o] for s,o in d["qs"][:2]]),dict(type="match",q="أَصِلُ الْكَلِمَةَ بِمَعْناها:",a=[w for w,_,_ in W[:3]],b=[W[1][1],W[2][1],W[0][1]])]),
        silver=dict(goal="أَسْتَطيعُ أَنْ أُفَسِّرَ وَأُكْمِلَ الْمُخَطَّطَ.",tasks=[dict(type="choose",q="أَخْتارُ:",items=[[s,o] for s,o in d["qs"][2:4]]),dict(type="cells",q=m[0].split(" 🗺")[0].replace("🗺️","").strip()+":",cols=3,cells=[c[1]+":" for c in m[2]])]),
        gold=dict(goal="أَسْتَطيعُ أَنْ أُرَتِّبَ وَأُطَبِّقَ.",tasks=[dict(type="order",q="أُرَقِّمُ بِالتَّرْتيبِ (1، 2، 3):",items=[sub(o[2][2][2]),sub(o[2][0][2]),sub(o[2][1][2])]),dict(type="choose",q="أَخْتارُ:",items=[[s,o2] for s,o2 in d["qs"][4:6]])]),
        challenge=dict(goal="أَسْتَطيعُ أَنْ أَكْتُبَ وَأُبْدِيَ رَأْيي.",tasks=[dict(type="lines",q=d["value"]["dilemma"],n=2),dict(type="lines",q=d["home"][1],n=3)])),
      pod=dict(goal="أَتَعَرَّفُ كَلِماتِ الدَّرْسِ.",q1="أُشيرُ إِلى الصّورَةِ، وَأَقولُ كَلِمَةً عَنْها.",pics=[[img+"cover.webp",W[0][0]],[img+"main.webp",W[1][0]],[img+"alt.webp",W[2][0]]],q2="أَتَتَبَّعُ الْكَلِمَةَ بِقَلَمي:",trace=W[0][0],q3="أُلَوِّنُ الْقَلْبَ."),
      concept=dict(elements=[[c[1],c[2]] for c in m[2]],message=sub(d["sc"][2])),
      answers=dict(bronze=[" · ".join(o2[0] for s,o2 in d["qs"][:2])," · ".join(f"{w} ← {mm}" for w,mm,_ in W[:3])],silver=[" · ".join(o2[0] for s,o2 in d["qs"][2:4])]+[c[1]+": "+c[2] for c in m[2]],
        gold=["التَّرْتيبُ: (3) · (1) · (2)"," · ".join(o2[0] for s,o2 in d["qs"][4:6])],challenge=[d["value"]["model"],"تُقْبَلُ كُلُّ إِجابَةٍ صَحيحَةٍ مُرَتَّبَةٍ."]),
      groups=dict(roles=["📖 القارِئُ","✏️ الْكاتِبُ","⏱ حارِسُ الْوَقْتِ","🎤 الْمُتَحَدِّثُ"],
        bronze=dict(goal="نُجيبُ عَنِ الْأَسْئِلَةِ.",text=[sub(key[0])[:120]],steps=["نَقْرَأُ مَعًا.","يَسْأَلُ كُلٌّ مِنّا زَميلَهُ.","نَرْسُمُ ما فَهِمْناهُ."],product="لَوْحَةُ الْمَجْموعَةِ"),
        silver=dict(goal="نُفَسِّرُ الْكَلِماتِ.",text=[" · ".join(w for w,_,_ in W)],steps=["نَبْحَثُ عَنِ الْكَلِماتِ.","نَكْتُبُ مَعانِيَها.","نُكَوِّنُ جُمَلًا بِها."],product="بِطاقاتُ الْكَلِماتِ"),
        gold=dict(goal=m[0].replace("🗺️","").strip(),text=[c[1] for c in m[2]],steps=["نَرْسُمُ الْمُخَطَّطَ.","نَمْلَؤُهُ مِنَ الدَّرْسِ.","نَعْرِضُهُ عَلى الصَّفِّ."],product="مُخَطَّطُ الْمَجْموعَةِ"),
        challenge=dict(goal="نُعَبِّرُ وَنَعْرِضُ.",text=[d["value"]["head"]],steps=["نَتَناقَشُ في الْمَوْقِفِ.","نَكْتُبُ رَأْيَنا.","نَعْرِضُهُ أَمامَ الصَّفِّ."],product="بِطاقَةُ الرَّأْيِ")))
    return pack,S,WS
if __name__=="__main__":
    mod=sys.argv[1]; prefix=sys.argv[2]; outdir=sys.argv[3]
    sys.path.insert(0,f"{ROOT}/_tools/arabic/g2"); U=importlib.import_module(mod).U
    packs=[]
    for d in U:
        p,S,WS=build(prefix,d); packs.append(p)
        json.dump(S,open(f"{outdir}/{d['code']}.deck.json","w",encoding="utf-8"),ensure_ascii=False)
        json.dump(WS,open(f"{outdir}/{d['code']}.json","w",encoding="utf-8"),ensure_ascii=False)
    json.dump(packs,open(f"{outdir}/packs.json","w",encoding="utf-8"),ensure_ascii=False); print(len(packs))
