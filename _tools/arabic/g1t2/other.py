import json, os
ROOT="/home/claude/hira"
roles=["📖 القارِئُ","✏️ الْكاتِبُ","⏱ حارِسُ الْوَقْتِ","🎤 الْمُتَحَدِّثُ"]
exec(open('/home/claude/hira/_tools/arabic/g1t2/D.py',encoding='utf-8').read())
def mk(code,d):
    poem=d["kind"]=="poem"; sub=lambda t:t.replace("[[","").replace("]]","")
    W=d["words"]; Q=[]
    oc_c="AR-1.1.1.2.G1" if not poem else "AR-5.1.3.2.G1"
    for s,o in d["qs"]: Q.append(dict(oc=("AR-3.1.2.2.G1" if poem and ("تَعْني" in s or "يَعْني" in s) else ("AR-6.1.2.2.G1" if poem and "قافِيَةِ" in s else ("AR-1.2.2.1.G1" if not poem and "تَبْدَأُ" in s else ("AR-7.2.3.1.G1" if "أُرَكِّبُ" in s else oc_c)))),qt="mcq",d=2,stem=s,opts=o,ok="a",ex="من نص الدرس (ص "+d["page"]+")."))
    for s,ok in d["tfs"]: Q.append(dict(oc=("AR-2.3.1.5.G1" if poem and "أُنْشِدُ" in s else ("AR-6.1.2.2.G1" if poem and "قافِيَةِ" in s else ("AR-1.2.3.1.G1" if not poem and "الْحَرْفُ" in s else oc_c))),qt="true_false",d=1,stem=s,ok=ok,ex=("صحيح." if ok=="t" else "خطأ.")+" (ص "+d["page"]+")"))
    Q=[Q[0],Q[1],Q[2],Q[3],Q[6],Q[4],Q[5],Q[7],Q[8],Q[9]]
    if poem:
        crit_db=["أَذْكُرُ أَفْكارَ النَّشيدِ وَما يَدْعو إِلَيْهِ.","أُفَسِّرُ كَلِماتِ النَّشيدِ الْجَديدَةَ.","أَلْحَظُ الْقافِيَةَ وَأُكْمِلُ الْأَبْياتَ.","أَحْفَظُ النَّشيدَ وَأُنْشِدُهُ بِإيقاعٍ وَتَعْبيرٍ."]
        crit_dk=["أَذْكُرَ أَفْكارَ النَّشيدِ وَما يَدْعو إِلَيْهِ.","أُفَسِّرَ كَلِماتِ النَّشيدِ الْجَديدَةَ.","أَلْحَظَ الْقافِيَةَ وَأُكْمِلَ الْأَبْياتَ.","أَحْفَظَ النَّشيدَ وَأُنْشِدَهُ بِإيقاعٍ وَتَعْبيرٍ."]
        objective=f"أَنْ أَسْتَمِعَ إِلى «{d['title'].split(': ')[1]}» وَأَفْهَمَ مَعانِيَهُ، وَأَلْحَظَ قافِيَتَهُ، وَأَحْفَظَهُ وَأُنْشِدَهُ."
    else:
        crit_db=["أُجيبُ عَنْ أَسْئِلَةِ نَصِّ الْمُراجَعَةِ.",f"أُمَيِّزُ أَصْواتَ الْحُروفِ ({d['review']}) في أَوَّلِ الْكَلِماتِ.","أَقْرَأُ الْحُروفَ بِالْحَرَكاتِ وَالْمُدودِ، وَأُرَكِّبُ كَلِماتٍ.","أَكْتُبُ كَلِماتٍ وَجُمَلًا فيها الْحُروفُ الَّتي تَعَلَّمْتُها."]
        crit_dk=["أُجيبَ عَنْ أَسْئِلَةِ نَصِّ الْمُراجَعَةِ.",f"أُمَيِّزَ أَصْواتَ الْحُروفِ ({d['review']}) في أَوَّلِ الْكَلِماتِ.","أَقْرَأَ الْحُروفَ بِالْحَرَكاتِ وَالْمُدودِ، وَأُرَكِّبَ كَلِماتٍ.","أَكْتُبَ كَلِماتٍ وَجُمَلًا فيها الْحُروفُ الَّتي تَعَلَّمْتُها."]
        objective=f"أَنْ أُراجِعَ الْحُروفَ ({d['review']}): أَقْرَأُها بِالْحَرَكاتِ وَالْمُدودِ، وَأُمَيِّزُها في الْكَلِماتِ، وَأَقْرَأُ جُمَلًا وَأُجيبُ عَنْها."
    learned=(f"أَتَعَلَّمُ أَنْ أَفْهَمَ النَّشيدَ وَأَلْحَظَ قافِيَتَهُ: {d['value']['head']}." if poem else f"أُراجِعُ الْحُروفَ ({d['review']}): أَقْرَؤُها وَأُمَيِّزُها وَأَكْتُبُ كَلِماتِها.")
    pack=dict(code="AR-Y1-N-T2-"+code,book=dict(kind=d["kind"],title=d["title"]+(" — "+d["poet"] if poem else ""),pages=d["page"],body="\n".join(d["lines"])),objective=objective,criteria=crit_db,outcomes=["AR-1.1.1.2.G1"] if not poem else [],
      summary=dict(hook=("🎵 " if poem else "🔁 ")+d["value"]["head"],idea=(f"نَشيدٌ «{d['title'].split(': ')[1]}»: {sub(d['lines'][0])} …" if poem else f"نُراجِعُ الْحُروفَ ({d['review']}) بِجُمَلٍ مِنْ قِصَصِ الْحُروفِ وَتَدْريباتٍ عَلى الْأَصْواتِ وَالْكِتابَةِ."),key=d["lines"][:4],
        words=[[w,m+" "+e] for w,m,e in W],learn=[["🎵" if poem else "👂","أَسْتَمِعُ وَأُرَدِّدُ مَعَ مُعَلِّمي." if poem else "أَقْرَأُ الْجُمَلَ وَأُجيبُ عَنْها."],["🔤","أُفَسِّرُ الْكَلِماتِ الْجَديدَةَ." if poem else f"أُمَيِّزُ الْحُروفَ ({d['review']})."],["🎶" if poem else "🧩","أَلْحَظُ الْقافِيَةَ." if poem else "أُرَكِّبُ كَلِماتٍ مِنْ مَقاطِعَ."],["👏" if poem else "✍️","أَحْفَظُ وَأُنْشِدُ." if poem else "أَكْتُبُ الْكَلِماتِ بِخَطٍّ جَميلٍ."]],
        quiz=[[s,ok=="t"] for s,ok in d["tfs"][:2]],think=d["value"]["dilemma"],do=([f"أُنْشِدُ «{d['title'].split(': ')[1]}» لِأُسْرَتي."] if poem else [f"أَبْحَثُ في بَيْتي عَنْ أَشْياءَ تَبْدَأُ بِالْحُروفِ ({d['review']})."])+[d["value"]["sana"],"أَقْرَأُ لِأُسْرَتي ما تَعَلَّمْتُهُ."],badge=d["value"]["head"]+" ⭐"),questions=Q)
    S=dict(code="AR-Y1-N-T2-"+code,theme=d["theme"],imgbase=f"resources/slides/img/AR-Y1-N-T2-{code}-",page=d["page"],kicker="اللغة العربية · الصف الأول · "+("النشيد" if poem else "مراجعة"),title=d["title"],byline=(f"كَلِماتُ: {d['poet']} · كِتابي ص {d['page']}" if poem else f"الْحُروفُ: {d['review']} · كِتابي ص {d['page']}"),
      title_note="اعرض الصورة واطلب وصفها.",objective=objective,criteria=crit_dk,strip=("أَفْهَمُ النَّشيدَ وَأَحْفَظُهُ وَأُنْشِدُهُ" if poem else f"أُراجِعُ الْحُروفَ ({d['review']})"),
      retrieval=dict(head="ماذا تَعَلَّمْنا؟",img="words",qa=[["الْحَرَكاتُ الْقَصيرَةُ:","فَتْحَةٌ، ضَمَّةٌ، كَسْرَةٌ"],["الْمُدودُ:","ا، و، ي"],["كَلِمَةٌ فيها مَدٌّ:","توتٌ"]],link="🔗 أَرْبِطُ: بِالْحُروفِ وَالْحَرَكاتِ نَقْرَأُ الْقِصَصَ وَالْأَناشيدَ.",note="[استرجاع] راجع الحركات والمدود بأمثلة من الطلاب."),
      hook=dict(head=d["value"]["head"]+(" 🎵" if poem else " 🔁"),img="main",q=("أَنْظُرُ إِلى الصّورَةِ: عَمَّ سَيَتَحَدَّثُ النَّشيدُ؟" if poem else "أَنْظُرُ إِلى الصّورَةِ: مَنْ هذِهِ الشَّخْصِيّاتُ؟ وَما حُروفُها؟"),model=("نَموذَجٌ: "+sub(d["lines"][0])+" …"),note="[التهيئة] استمع إلى توقعات الطلاب."),
      words=[[w,m,e] for w,m,e in W],predict=dict(q="أَسْتَمِعُ إِلى الْعُنْوانِ، وَأَتَوَقَّعُ: عَمَّ يَتَحَدَّثُ؟",model=sub(d["lines"][0])),
      map_head=("أَفْكارُ النَّشيدِ 🗺️" if poem else "الْحُروفُ الَّتي نُراجِعُها 🗺️"),map_strategy=("الْخَريطَةُ الذِّهْنِيَّةُ" if poem else "الصَّوْتُ وَالرَّمْزُ"),
      map=([["1️⃣","الْبِدايَةُ",sub(d["lines"][0])+" "+sub(d["lines"][1])],["2️⃣","الْوَسَطُ",sub(d["lines"][2])+" "+sub(d["lines"][3])],["3️⃣","النِّهايَةُ",sub(d["lines"][-2])+" "+sub(d["lines"][-1])]] if poem else [[w[2],w[0],w[1]] for w in W[:3]]),
      match=dict(head=("أَصِلُ الْكَلِمَةَ بِقافِيَتِها 🎶" if poem and len([r for r in d["rhymes"] if r[1]!="—"])>=2 else "أَصِلُ الْكَلِمَةَ بِمَعْناها 🔤"),rows=([r for r in d["rhymes"] if r[1]!="—"][:4] if poem and len([r for r in d["rhymes"] if r[1]!="—"])>=2 else [[w,m] for w,m,_ in W])),
      order_head=("أُرَتِّبُ مَقاطِعَ النَّشيدِ 🔢" if poem else "أُرَتِّبُ الْجُمَلَ 🔢"),order_strategy=("الْحِفْظُ بِالْمَقاطِعِ" if poem else "إِعادَةُ السَّرْدِ"),
      order=[["1️⃣","أَوَّلًا",sub(d["lines"][0])],["2️⃣","ثانِيًا",sub(d["lines"][1])],["3️⃣","ثالِثًا",sub(d["lines"][2])]],
      wordj=dict(head=f"رِحْلَتي مَعَ كَلِمَةِ «{W[0][0]}» 🔤",sent="«"+sub(next((l for l in d["lines"] if W[0][0][:3] in sub(l)),d["lines"][0]))+"»",q=f"مَعْنى «{W[0][0]}»:",opts=[f"(أ) {W[0][1]}",f"(ب) {W[1][1]}",f"(ج) {W[2][1]}"],model=f"(أ): {W[0][1]}."),
      speak=dict(head=("أُنْشِدُ لِزُمَلائي 🎤" if poem else "أَقْرَأُ بِصَوْتٍ واضِحٍ 🗣️"),frame=sub(d["lines"][0])+" …",model=("نَموذَجٌ: أُنْشِدُ بِصَوْتٍ واضِحٍ وَإيقاعٍ جَميلٍ، وَأُعَبِّرُ بِيَدَيَّ." if poem else "نَموذَجٌ: أَقْرَأُ الْجُمْلَةَ كَلِمَةً كَلِمَةً، ثُمَّ أَقْرَؤُها كُلَّها بِسُرْعَةٍ مُناسِبَةٍ.")),
      check=dict(q=d["qs"][0][0]+" 🤔",opts=[f"(أ) {d['qs'][0][1][0]}",f"(ب) {d['qs'][0][1][1]}",f"(ج) {d['qs'][0][1][2]}"],model=f"الْإِجابَةُ (أ): {d['qs'][0][1][0]}."),
      groups=(["أَصِلُ الْكَلِماتِ بِمَعانيها، وَأَرْسُمُ.","أَخْتارُ مَعانِيَ الْكَلِماتِ.","أَصِلُ الْقَوافِيَ وَأُكْمِلُ الْأَبْياتَ.","أَكْتُبُ بَيْتَيْنِ مِنْ عِنْدي، وَأُنْشِدُهُما."] if poem else ["أَصِلُ الْكَلِمَةَ بِحَرْفِها الْأَوَّلِ.","أَقْرَأُ الْجُمَلَ وَأُجيبُ عَنْها.","أُرَكِّبُ كَلِماتٍ مِنْ مَقاطِعَ.","أَكْتُبُ جُمَلًا بِالْحُروفِ الَّتي تَعَلَّمْتُها."]),
      value=dict(d["value"],img="main",fact="في الْإِماراتِ نَعْتَزُّ بِلُغَتِنا الْعَرَبِيَّةِ، وَنَقْرَأُ بِها كُلَّ يَوْمٍ."),learned=learned,
      exit=[[d["qs"][1][0],d["qs"][1][1][0]],[d["qs"][2][0],d["qs"][2][1][0]]],
      reflect=[learned.replace("أَتَعَلَّمُ ","").replace("أُراجِعُ ",""),d["value"]["dilemma"],"أَرْبِطُ مَعَ التَّرْبِيَةِ الْإِسْلامِيَّةِ: الْعَرَبِيَّةُ لُغَةُ الْقُرْآنِ الْكَريمِ."],
      home=dict(img="cover",family=pack["summary"]["do"][0],task=("أَحْفَظُ النَّشيدَ، وَأُسَجِّلُهُ بِصَوْتي في تَبْويبِ «التَّسْميعِ»." if poem else "أَكْتُبُ ثَلاثَ كَلِماتٍ بِكُلِّ حَرْفٍ رَاجَعْتُهُ، وَأَقْرَؤُها لِأُسْرَتي.")))
    rh=[r for r in d.get("rhymes",[]) if r[1]!="—"]
    WS=dict(code="AR-Y1-N-T2-"+code,grade="الصف الأول",title=sub(d["title"]).replace("ْ","").replace("ُ","").replace("َ","").replace("ِ","").replace("ّ",""),pages=d["page"],readhead=("أَقْرَأُ النَّشيدَ" if poem else "أَقْرَأُ جُمَلَ الْمُراجَعَةِ"),key=d["lines"][:4],
      words=[[w,m] for w,m,_ in W],criteria=["أَذْكُرُ وَأُجيبُ.","أُفَسِّرُ الْكَلِماتِ." if poem else "أُمَيِّزُ الْحُروفَ.","أَلْحَظُ الْقافِيَةَ." if poem else "أُرَكِّبُ الْكَلِماتِ.","أَحْفَظُ وَأُنْشِدُ." if poem else "أَكْتُبُ الْجُمَلَ."],
      levels=dict(bronze=dict(goal="أَسْتَطيعُ أَنْ أُجيبَ عَنْ أَسْئِلَةِ النَّصِّ.",tasks=[dict(type="choose",q="أَخْتارُ الْإِجابَةَ:",items=[[s,o] for s,o in d["qs"][:2]]),dict(type="match",q="أَصِلُ الْكَلِمَةَ بِصورَتِها:",a=[w for w,_,_ in W[:3]],b=[W[1][2],W[2][2],W[0][2]])]),
        silver=dict(goal="أَسْتَطيعُ أَنْ أُفَسِّرَ الْكَلِماتِ." if poem else "أَسْتَطيعُ أَنْ أُمَيِّزَ الْحُروفَ.",tasks=[dict(type="choose",q="أَخْتارُ:",items=[[s,o] for s,o in d["qs"][3:5]]),dict(type="cells",q=("أَكْتُبُ كَلِمَتَيْنِ مِنَ النَّشيدِ عَنِ الْمَشاعِرِ أَوِ الْأَفْكارِ:" if poem else "أَكْتُبُ كَلِمَةً تَبْدَأُ بِكُلِّ حَرْفٍ:"),cols=3,cells=(["⭐","⭐","⭐"] if poem else [c+":" for c in d["review"].split("، ")][:3]))]),
        gold=dict(goal="أَسْتَطيعُ أَنْ أَلْحَظَ الْقافِيَةَ وَأُكْمِلَ." if poem else "أَسْتَطيعُ أَنْ أُرَكِّبَ كَلِماتٍ وَأُرَتِّبَ جُمَلًا.",tasks=([dict(type="match",q="أَصِلُ الْكَلِمَةَ بِقافِيَتِها:",a=[r[0] for r in rh[:3]],b=[r[1] for r in rh[1:3]]+[rh[0][1]])] if len(rh)>=3 else [dict(type="lines",q="أَكْتُبُ كَلِمَتَيْنِ عَلى قافِيَةٍ واحِدَةٍ مِنَ النَّشيدِ:",n=1)] if poem else [dict(type="choose",q="أُرَكِّبُ:",items=[[d["qs"][5][0],d["qs"][5][1]]])])+[dict(type="lines",q=("أُكْمِلُ: «"+sub(d["lines"][0])+" …»" if poem else "أُرَتِّبُ وَأَكْتُبُ: "+sub(d["lines"][0])),n=1)]),
        challenge=dict(goal="أَسْتَطيعُ أَنْ أَكْتُبَ وَأُعَبِّرَ.",tasks=[dict(type="lines",q=("أَكْتُبُ بَيْتَيْنِ مِنْ عِنْدي عَنْ "+d["value"]["head"]+":" if poem else "أَكْتُبُ جُمْلَتَيْنِ فيهِما الْحُروفُ الَّتي رَاجَعْتُها:"),n=2),dict(type="lines",q=d["value"]["dilemma"],n=2),dict(type="draw",q="أَرْسُمُ ما فَهِمْتُهُ.",label="رَسْمي:")])),
      pod=dict(goal="أَتَعَرَّفُ وَأُرَدِّدُ.",q1="أُشيرُ إِلى الصّورَةِ، وَأَقولُ كَلِمَةً عَنْها.",pics=[[f"resources/slides/img/AR-Y1-N-T2-{code}-cover.webp",W[0][0]],[f"resources/slides/img/AR-Y1-N-T2-{code}-main.webp",W[1][0]],[f"resources/slides/img/AR-Y1-N-T2-{code}-words.webp",W[2][0]]],q2="أَتَتَبَّعُ الْكَلِمَةَ بِقَلَمي:",trace=W[0][0],q3="أُلَوِّنُ الْقَلْبَ."),
      concept=dict(elements=[[w,m] for w,m,_ in W[:3]],message=learned),
      answers=dict(bronze=[" · ".join(o[0] for s,o in d["qs"][:2])],silver=[" · ".join(o[0] for s,o in d["qs"][3:5])],gold=([" · ".join(f"{a} ← {b}" for a,b in rh[:3])] if poem else [d["qs"][5][1][0]])+[sub(d["lines"][0])],challenge=["تُقْبَلُ كُلُّ إِجابَةٍ صَحيحَةٍ مُناسِبَةٍ.",d["value"]["model"]]),
      groups=dict(roles=roles,bronze=dict(goal="نَقْرَأُ وَنُجيبُ.",text=[sub(d["lines"][0])],steps=["نَقْرَأُ مَعًا.","يَسْأَلُ كُلٌّ مِنّا زَميلَهُ.","نَرْسُمُ ما فَهِمْناهُ."],product="لَوْحَةُ الْمَجْموعَةِ"),silver=dict(goal="نُفَسِّرُ الْكَلِماتِ.",text=[" · ".join(w for w,_,_ in W)],steps=["نَبْحَثُ عَنِ الْكَلِماتِ.","نَكْتُبُ مَعانِيَها.","نُمَثِّلُها بِحَرَكاتٍ."],product="بِطاقاتُ الْكَلِماتِ"),gold=dict(goal="نُرَتِّبُ.",text=[sub(l) for l in d["lines"][:2]],steps=["نَقُصُّ الْبِطاقاتِ.","نُرَتِّبُها.","نَقْرَؤُها أَمامَ الصَّفِّ."],product="شَريطُ الْمَجْموعَةِ"),challenge=dict(goal="نُعَبِّرُ.",text=[d["value"]["head"]],steps=["نَتَناقَشُ في الْقيمَةِ.","نَكْتُبُ جُمْلَتَيْنِ.","نَعْرِضُهُما."],product="بِطاقَةُ الْقيمَةِ")))
    return pack,S,WS
packs=[]
for c,d in D.items():
    p,S,WS=mk(c,d); packs.append(p)
    json.dump(S,open(f"{ROOT}/_tools/arabic/g1t2/{c}.deck.json","w",encoding="utf-8"),ensure_ascii=False)
    json.dump(WS,open(f"{ROOT}/_tools/arabic/g1t2/{c}.json","w",encoding="utf-8"),ensure_ascii=False)
json.dump(packs,open(f"{ROOT}/_tools/arabic/g1t2/packs2.json","w",encoding="utf-8"),ensure_ascii=False)
print(len(packs))
