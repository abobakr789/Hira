import re, base64, sys, json
import art
from art import N
ROOT="/home/claude/Hira/"
IE=open(ROOT+"resources/ie/IE-Y9-N-T1-L08/teacher-deck.html",encoding="utf8").read()
LOGO=re.findall(r'<svg aria-label="شعار حراء".*?</svg>',IE,re.S)[1]
LOGO=re.sub(r'style="width:\d+px;height:\d+px"','style="width:{w}px;height:{h}px"',LOGO,1)
def logo(w=196): return LOGO.replace("{w}",str(w)).replace("{h}",str(round(w*260/653)))
MODE=sys.argv[1] if len(sys.argv)>1 else "site"   # site | preview
def A(p):
    if MODE=="site": return "../../../"+p
    mime={"webp":"image/webp","woff2":"font/woff2","png":"image/png"}[p.rsplit(".",1)[1]]
    return f"data:{mime};base64,"+base64.b64encode(open(ROOT+p,"rb").read()).decode()
LESSON_ID="cea166f0-e76b-4c10-bf14-785905df1832"
TITLE="أوشي الْأَرْنَبُ الْأَكولُ (أ)"
STRIP="أَتَعَلَّمُ حَرْفَ (أ) وَأَقْرَأُ قِصَّتَهُ"
LV=[("بُرونْزِيٌّ","#A0612F","#F6E7DA"),("فِضِّيٌّ","#5F6C78","#E9EDF1"),("ذَهَبِيٌّ","#B8860B","#FBF0D2"),("تَحَدٍّ","#6B46A8","#EEE7FA")]
def hl(t):  # colour every initial hamza-alef (with its marks)
    return re.sub(r'(^|[\s«(:\-—"])([أإآ][\u064B-\u0652\u0670]*)', r'\1<span class="L">\2</span>', t)
def B(n,k="up"): return f' data-build-in="{k} {n}"'
SL=[]
BGS={"cream":("#FBF7EF","#B4532A","#FBE6D8"),"mint":("#EEF6F1","#1E7A5A","#D7EEE2"),"sky":("#EEF4FB","#2F64A8","#DCE8F7"),
     "peach":("#FDF1EA","#C2571A","#FBE0CF"),"lilac":("#F4F0FB","#6B46A8","#E6DDF7"),"butter":("#FFF8E6","#B07A12","#FBEBC2"),"rose":("#FCF1F3","#B0395F","#F8DCE3")}
def deco(kind,a):
    if kind=="blobs": return f'<i class="dc" style="left:-140px;top:-160px;width:460px;height:460px;border-radius:50%;background:{a};opacity:.08"></i><i class="dc" style="right:-120px;bottom:-200px;width:520px;height:520px;border-radius:50%;background:{a};opacity:.07"></i>'
    if kind=="ring": return f'<i class="dc" style="right:-160px;top:-170px;width:440px;height:440px;border-radius:50%;border:26px solid {a};opacity:.10"></i><i class="dc" style="left:-110px;bottom:-150px;width:360px;height:360px;border-radius:50%;background:{a};opacity:.07"></i>'
    if kind=="dots":
        d="".join(f'<b style="width:12px;height:12px;border-radius:50%;background:{a};opacity:{.45 if k%3==0 else .18}"></b>' for k in range(24))
        return f'<i class="dc" style="left:60px;top:300px;display:grid;grid-template-columns:repeat(4,12px);gap:26px">{d}</i><i class="dc" style="right:-120px;bottom:-160px;width:420px;height:420px;border-radius:50%;background:{a};opacity:.07"></i>'
    if kind=="wave": return f'<svg class="dc" style="left:0;bottom:0;width:1920px;height:220px" viewBox="0 0 1920 220" preserveAspectRatio="none"><path d="M0 120 Q480 40 960 110 T1920 90 V220 H0Z" fill="{a}" opacity=".08"/><path d="M0 170 Q520 110 1040 160 T1920 150 V220 H0Z" fill="{a}" opacity=".07"/></svg>'
    if kind=="stars": return "".join(f'<i class="dc" style="left:{x}px;top:{y}px;opacity:{o}">{art.star(s,s,a)}</i>' for x,y,s,o in [(40,310,46,.25),(1840,520,38,.22),(150,880,30,.2),(1760,250,28,.2),(980,980,26,.16)])
    if kind=="letter": return f'<i class="dc bigL" style="left:40px;bottom:-170px;color:{a}">أ</i><i class="dc" style="right:-140px;top:-150px;width:400px;height:400px;border-radius:50%;background:{a};opacity:.07"></i>'
    return ""
def slide(sid,bg,dk,title,pill,body,note,mins=None,strat=None,crit=None,foot=True):
    bgc,a,a2=BGS[bg]
    chips=f'<span class="pill">{pill}</span>' if pill else ""
    if crit: chips+=f'<span class="pill cr">{crit}</span>'
    if mins: chips+=f'<span class="pill tm">⏱ {mins} دَقائِقَ</span>' if mins>2 else f'<span class="pill tm">⏱ {"دَقيقَتانِ" if mins==2 else "دَقيقَةٌ"}</span>'
    if strat: chips+=f'<span class="pill st">🧭 {strat}</span>'
    hd=f'<div class="hlogo">{logo(196)}</div>'+(f'<h2 class="ht">{title}</h2><div class="hrow">{chips}</div>' if title else "")
    ft=(f'<div class="ft"><div class="ftr"><span class="ftl">{logo(92)}</span><span>{TITLE}</span></div><div class="goal">🎯 {STRIP}</div><div class="dots"><b style="background:#E2574C"></b><b style="background:#F2A93B"></b><b style="background:#1E7A5A"></b><b style="background:#2F64A8"></b></div></div>' if foot else "")
    SL.append(f'<section class="sl" id="{sid}" style="--bg:{bgc};--a:{a};--a2:{a2};background:{bgc}">{deco(dk,a)}{hd}<div class="bd">{body}</div>{ft}<aside>{note}</aside></section>')

# ---------- 1 cover ----------
verbs=[("أَنْطِقُ","#A0612F"),("أَقْرَأُ","#5F6C78"),("أَفْهَمُ","#B8860B"),("أَكْتُبُ","#6B46A8")]
SL.append(f'''<section class="sl" id="cover" style="--a:#B4532A;--a2:#FBE6D8;background:linear-gradient(135deg,#FDF0DC 0%,#FBF7EF 48%,#E4F1EA 100%)">
<img class="dc" src="{A('art/lanterns.webp')}" style="left:560px;top:0;width:250px" alt="">
<i class="dc" style="left:-200px;bottom:-260px;width:760px;height:760px;border-radius:50%;background:#F2A93B;opacity:.10"></i>
<div class="hlogo cvlogo">{logo(380)}</div>
<div class="cvpic"><div class="cvsun"></div>{art.rabbit(470)}<div class="cvL"><span>أ</span></div></div>
<div class="cvtx">
<p class="cvk">اللُّغَةُ الْعَرَبِيَّةُ · الصَّفُّ الْأَوَّلُ · الدَّرْسُ 1</p>
<h1 class="cvt">أوشي الْأَرْنَبُ الْأَكولُ</h1>
<p class="cvs">نَتَعَرَّفُ صَوْتَ حَرْفِ (أ) وَشَكْلَهُ، وَنَقْرَأُ قِصَّةَ أوشي.</p>
<div class="cvv">{''.join(f'<span style="--c:{c}">{v}</span>' for v,c in verbs)}</div>
</div>
<p class="cvb">{hl("حَرْفُ الْهَمْزَةِ عَلى الْأَلِفِ")} · الْعَرَبِيَّةُ تَجْمَعُنا</p>
<aside>اعرض الغلاف: من هذه الشخصية؟ ما الحرف الكبير بجانبه؟ ننطقه معًا: أَ. الأفعال الأربعة الملوّنة هي معايير النجاح اليوم.</aside></section>''')

# ---------- 2 retrieval ----------
cards=[("📌","اسْمُ لُغَتِنا الْجَميلَةِ؟","الْعَرَبِيَّةُ"),("🔢","كَمْ حَرْفًا في لُغَتِنا؟","28 حَرْفًا"),("🎵","ما الْحَرَكاتُ الْقَصيرَةُ؟","الْفَتْحَةُ، الضَّمَّةُ، الْكَسْرَةُ")]
body='<div class="row3">'+"".join(f'<div class="cd rc"{B(k*2+1)}><div class="rcI">{e}</div><p class="rcQ">{q}</p><p class="ans"{B(k*2+2,"pop")}>✓ {a}</p></div>' for k,(e,q,a) in enumerate(cards))+'</div>'
body+=f'<div class="cd link"{B(7)}><p>🔗 وَالْيَوْمَ نَبْدَأُ رِحْلَةَ الْحُروفِ بِأَوَّلِ حَرْفٍ: <b class="L">أ</b> مَعَ قِصَّةِ «أوشي الْأَرْنَبُ الْأَكولُ».</p></div><img class="side" src="{A("art/boywave.webp")}" alt="" style="left:30px;top:-40px;width:150px">'
slide("retrieve","mint","ring","قَبْلَ أَنْ نَبْدَأَ..","نَتَذَكَّرُ وَنَرْبِطُ",body,"[استرجاع] اقرأ كل سؤال، ودع الطلاب يجيبون جماعيًّا، ثم اكشف الإجابة بالنقر.",mins=3)

# ---------- 3 guess the letter ----------
clues=[("أَنا أَوَّلُ حُروفِ لُغَتِنا الْعَرَبِيَّةِ.","4 نِقاطٍ"),("شَكْلي خَطٌّ طَويلٌ واقِفٌ.","3 نِقاطٍ"),("تَجْلِسُ فَوْقي أَوْ تَحْتي هَمْزَةٌ صَغيرَةٌ (ء).","نُقْطَتانِ"),("بي تَبْدَأُ كَلِمَةُ: أَرْنَبٌ 🐰","نُقْطَةٌ")]
cols=["#A0612F","#2F64A8","#1E7A5A","#C2571A"]
body='<div class="clues">'+"".join(f'<div class="clue" style="--c:{cols[k]}"{B(k+1,"left")}><b class="n">{k+1}</b><p>{q}</p><span class="pts">{pt}</span></div>' for k,(q,pt) in enumerate(clues))
body+=f'<div class="who"{B(5,"pop")} data-ia onclick="boom(this)"><p>مَنْ أَنا؟</p><b class="bigA">أ</b><p>أَنا حَرْفُ الْأَلِفِ مَعَ الْهَمْزَةِ 🎉</p></div></div>'
body+=f'<div class="detect"><img src="{A("art/lensboy.webp")}" alt=""><p>كُلَّما خَمَّنْتُمْ أَبْكَرَ، رَبِحْتُمْ نِقاطًا أَكْثَرَ!</p></div>'
slide("guess","butter","stars","خَمِّنِ الْحَرْفَ!","تَحَدّي الْمُحَقِّقينَ",body,"[التهيئة: تحدّي المحققين] اكشف التلميحات واحدًا واحدًا. أول مجموعة تخمّن الحرف تأخذ نقاط التلميح الذي وصلتم إليه. انقر على بطاقة الإجابة للاحتفال.",mins=3)

# ---------- 4 listen ----------
items=[("أَسَدٌ",art.lion,True),("سَمَكَةٌ",art.fish,False),("أُذُنٌ",art.ear,True),("جَزَرَةٌ",art.carrotpic,False),("إِبْريقٌ",art.ibriq,True),("شَمْسٌ",art.sun,False),("أَرْنَبٌ",lambda w=None,h=None: art.rabbit(w,h),True)]
body='<p class="inst">أُسَمّي الصّورَةَ، فَإِذا بَدَأَتْ بِصَوْتِ (أ) أَقِفُ وَأَرْفَعُ يَدي ✋ — ثُمَّ نَنْقُرُ لِنَتَأَكَّدَ.</p><div class="snd">'+"".join(f'<div class="sc {"yes" if y else "no"}" data-ia onclick="this.classList.add(\'shown\');snd(\'{"correct" if y else "wrong"}\')"><div class="pic">{f(None,200)}</div><p class="nm">{hl(n) if y else n}</p><b class="mk">{"✓" if y else "✗"}</b></div>' for n,f,y in items)+'</div>'
slide("listen","sky","wave","أَسْمَعُ صَوْتَ (أ) 👂","لَحْظَةُ فُضولٍ",body,"[التهيئة السمعية] سمِّ كل صورة بصوت واضح. يقف الطلاب إذا بدأ الاسم بصوت (أ)، ثم انقر على البطاقة للتحقق (صوت صحيح أو خطأ).",mins=4,strat="أَسْمَعُ وَأَتَحَرَّكُ")

# ---------- 5 goal & criteria ----------
CR=[("أَنْطِقُ صَوْتَ حَرْفِ (أ) وَأُمَيِّزُهُ في أَوَّلِ الْكَلِماتِ.","الْمَجْموعَةُ 1"),("أَقْرَأُ حَرْفَ (أ) بِالْحَرَكاتِ الْقَصيرَةِ وَالْمُدودِ.","الْمَجْموعَتانِ 2 وَ 3"),("أَقْرَأُ قِصَّةَ الدَّرْسِ وَأُجيبُ عَنْ أَسْئِلَتِها.","الْمَجْموعَةُ 4"),("أَكْتُبُ حَرْفَ (أ) وَكَلِماتٍ فيها هذا الْحَرْفُ.","الصَّفُّ كُلُّهُ · بِطاقَةُ الْخُروجِ")]
body='<div class="goalbox"><p>🎯 <b>هَدَفُ الدَّرْسِ:</b> أَنْ أَتَعَرَّفَ حَرْفَ (أ) صَوْتًا وَشَكْلًا مِنْ قِصَّةِ «أوشي الْأَرْنَبُ الْأَكولُ»، وَأَقْرَأَهُ بِالْحَرَكاتِ وَالْمُدودِ، وَأَكْتُبَهُ.</p></div><div class="crs">'
body+="".join(f'<div class="crit" style="--c:{LV[k][1]};--c2:{LV[k][2]}"{B(k+1)}><b class="n">{k+1}</b><span class="vb">{verbs[k][0]}</span><p>{t}</p><span class="tag">{lv[0]} · {g}</span></div>' for k,((t,g),lv) in enumerate(zip(CR,LV)))+'</div>'
slide("goal","lilac","dots","هَدَفُ الدَّرْسِ وَمَعاييرُ النَّجاحِ","إِلى أَيْنَ نَمْضي؟",body,"[ناتج التعلّم ومعايير النجاح] اقرأ الهدف، ثم اكشف المعايير واحدًا واحدًا. لون كل معيار هو لون ورقة المستوى والمجموعة التي تعمل عليه.",mins=2)

# ---------- 6/26 progress ----------
def prog(sid,title,pill,inst,bg):
    rows="".join(f'<div class="pr" style="--c:{LV[k][1]}"><b class="n">{k+1}</b><span class="vb">{verbs[k][0]}</span><p>{t}</p><div class="fs">'+"".join(f'<button class="fc" data-ia onclick="cnt(this)">{art.face(f,None,70)}<i>0</i></button>' for f in ("sad","mid","happy"))+'</div></div>' for k,(t,g) in enumerate(CR))
    leg='<div class="leg"><span>'+art.face("sad",None,40)+' لَمْ أَتَعَلَّمْهُ بَعْدُ</span><span>'+art.face("mid",None,40)+' أَعْرِفُ قَليلًا</span><span>'+art.face("happy",None,40)+' أَسْتَطيعُ وَحْدي</span><button data-ia onclick="rst(this)">↺ تَصْفيرُ الْعَدِّ</button></div>'
    slide(sid,bg,"blobs",title,pill,f'<p class="inst">{inst}</p><div class="prs">{rows}</div>{leg}',"[قياس التقدّم] يرفع الطلاب أيديهم عند الوجه الذي يشبههم في كل معيار، وانقر على الوجه لتسجيل العدد. القياس المباشر على المنصة من زر «📈 قياس التقدّم».",mins=2)
prog("progress","قِياسُ التَّقَدُّمِ: قَبْلَ الدَّرْسِ","أَيْنَ أَنا الْآنَ؟","أَرْفَعُ يَدي عِنْدَ الْوَجْهِ الَّذي يُشْبِهُني في كُلِّ مِعْيارٍ.","sky")

# ---------- 7 vocab ----------
V=[("أَسَدٌ",art.lion,"حَيَوانٌ قَوِيٌّ، يُسَمّى مَلِكَ الْغابَةِ.","أَ","فَتْحَةٌ"),("أُذُنٌ",art.ear,"عُضْوٌ في رَأْسي، أَسْمَعُ بِهِ الْأَصْواتَ.","أُ","ضَمَّةٌ"),("إِبْريقٌ",art.ibriq,"إِناءٌ لَهُ يَدٌ وَفَمٌ، نَصُبُّ مِنْهُ الْماءَ.","إِ","كَسْرَةٌ"),("أَرْنَبٌ",lambda w=None,h=None: art.rabbit(w,h),"حَيَوانٌ صَغيرٌ، أُذُناهُ طَويلَتانِ، يُحِبُّ الْجَزَرَ.","أَ","فَتْحَةٌ")]
body='<div class="vg">'+"".join(f'<div class="vc" data-ia onclick="this.classList.toggle(\'fl\')"{B(k+1,"pop")}><div class="vf"><div class="vp">{f(None,190)}</div><p class="vw">{hl(w)}</p><span class="vh">{s} ← {h}</span><small>اُنْقُرْ لِلْمَعْنى</small></div><div class="vb2"><p class="vw s">{hl(w)}</p><p class="vm">{m}</p></div></div>' for k,(w,f,m,s,h) in enumerate(V))+'</div>'
slide("vocab","peach","letter","كَنْزُ الْكَلِماتِ","كَلِماتٌ جَديدَةٌ",body,"[المفردات بالصور] اعرض الصورة، ودع الطلاب يسمّونها، ثم انقر على البطاقة لقلبها وقراءة المعنى. لاحظوا حركة (أ) في أول كل كلمة.",mins=5,strat="الصّورَةُ وَالْكَلِمَةُ")

# ---------- 8 predict ----------
body=f'''<div class="pd"><div class="pdp">{art.rabbit(None,430)}<div class="pdq">؟</div></div><div class="pdc">
<div class="cd"{B(1)}><p class="q">👀 أَنْظُرُ إِلى الْعُنْوانِ وَالصّورَةِ: عَمَّنْ تَتَحَدَّثُ الْقِصَّةُ؟</p><p class="ans"{B(2,"pop")}>✓ عَنْ أَرْنَبٍ أَبْيَضَ اسْمُهُ أوشي.</p></div>
<div class="cd"{B(3)}><p class="q">🥕 لِماذا نُسَمّيهِ «الْأَكولَ»؟</p><p class="ans"{B(4,"pop")}>✓ رُبَّما لِأَنَّهُ يُحِبُّ الْأَكْلَ كَثيرًا!</p></div>
<p class="tip"{B(5)}>💬 أُفَكِّرُ · أُشارِكُ زَميلي · نُخْبِرُ الصَّفَّ</p></div></div>'''
slide("predict","rose","ring","أَتَوَقَّعُ قَبْلَ الْقِراءَةِ","قَبْلَ الْقِراءَةِ",body,"اكتب ثلاثة توقعات على السبورة، وارجع إليها بعد قراءة القصة: هل صدقت توقعاتنا؟",mins=3,strat="فَكِّرْ · زاوِجْ · شارِكْ")

# ---------- 9 story ----------
lines=["أوشي [[أَرْنَبٌ]] أَبْيَضُ، ذَيْلُهُ أَسْوَدُ.","قالَ أوشي: أُريدُ أَنْ أَذْهَبَ إِلى الْحَديقَةِ،","أَلْعَبُ ثُمَّ أَنامُ."]
def kw(t): return re.sub(r"\[\[(.+?)\]\]",r'<mark>\1</mark>',t)
body=f'''<div class="story"><div class="sp">{art.rabbit(None,330)}</div><div class="stx">'''+"".join(f'<p{B(k+1)}>{kw(hl(l))}</p>' for k,l in enumerate(lines))+f'''</div></div>
<div class="sbar"><button data-ia onclick="document.getElementById('story').classList.toggle('hunt')">🔍 أَيْنَ حَرْفُ (أ)؟ أُلَوِّنُهُ!</button><span>📖 مِنْ كِتابِ «الْعَرَبِيَّةُ تَجْمَعُنا»</span></div>'''
slide("story","cream","wave","قِصَّتُنا: أوشي الْأَرْنَبُ الْأَكولُ","نَقْرَأُ مَعًا",body,"[القراءة النموذجية] اقرأ القصة قراءة معبّرة، ثم يقرأ الطلاب معك سطرًا سطرًا. بعدها اضغط «أين حرف (أ)؟» لتلوين كل (أ) في القصة، وعدّوها معًا: 10 كلمات تبدأ بحرف (أ).",mins=6,strat="الْقِراءَةُ الْمُشْتَرَكَةُ",crit="مِعْيارُ النَّجاحِ 3")

# ---------- 10 video ----------
if MODE=="site":
    vid='<video class="vid" controls preload="metadata" src="../../g1/AR-Y1-N-T1-L01/video.mp4"></video>'
else:
    vid=f'<div class="vid ph">{art.rabbit(None,260)}<p>▶ فيديو الدَّرْسِ «حَرْفُ الْأَلِفِ» يَعْمَلُ هُنا عِنْدَ فَتْحِ الْعَرْضِ مِنَ الْمَنَصَّةِ</p></div>'
body=f'<div class="vw2" data-ia>{vid}</div><div class="vtip"><p>👀 نُشاهِدُ، ثُمَّ نَكْتُبُ الْحَرْفَ في الْهَواءِ مَعَ الْفيديو.</p></div>'
slide("video","sky","dots","نُشاهِدُ وَنَتَعَلَّمُ","فيديو الدَّرْسِ",body,"شغّل فيديو حرف الألف (دقيقة ونصف تقريبًا). بعد الحصة يجيب الطلاب عن أسئلة الفيديو على المنصة.",mins=2)

# ---------- 11 harakat ----------
H=[("الْفَتْحَةُ","أَ","فَمي مَفْتوحٌ","أَسَدٌ","#2F64A8"),("الضَّمَّةُ","أُ","شَفَتايَ مَضْمومَتانِ","أُذُنٌ","#1E7A5A"),("الْكَسْرَةُ","إِ","فَمي مُبْتَسِمٌ","إِبْريقٌ","#C2571A")]
body='<div class="hk">'+"".join(f'<div class="hc" style="--c:{c}"{B(k+1,"pop")}><p class="hn">{n}</p><b class="hg">{g}</b><p class="hm">👄 {m}</p><p class="he">مِثْلُ: {hl(e)}</p></div>' for k,(n,g,m,e,c) in enumerate(H))+'</div>'
body+=f'<p class="tip c"{B(4)}>🔊 نَقْرَأُ مَعًا بِسُرْعَةٍ: أَ · أُ · إِ … إِ · أَ · أُ</p>'
slide("harakat","mint","blobs","حَرْفُ (أ) بِحَرَكاتِهِ","الصَّوْتُ وَالرَّمْزُ",body,"[الصوت والرمز] انطق كل حركة مع إشارة اليد والفم، ويردد الطلاب. ثم غيّر الترتيب بسرعة كلعبة.",mins=5,crit="مِعْيارُ النَّجاحِ 2")

# ---------- 12 madd ----------
M=[("أَ","آ","مَدٌّ بِالْأَلِفِ","#2F64A8"),("أُ","أُو","مَدٌّ بِالْواوِ","#1E7A5A"),("إِ","إِي","مَدٌّ بِالْياءِ","#C2571A")]
body='<div class="md">'+"".join(f'<div class="mr" style="--c:{c}"{B(k+1,"left")}><b class="ms">{s}</b><div class="mbar"><i></i></div><b class="ml">{l}</b><span class="mt">{t}</span></div>' for k,(s,l,t,c) in enumerate(M))+'</div>'
body+=f'<p class="tip c"{B(4)}>🙌 نَمُدُّ الصَّوْتَ وَنَمُدُّ أَيْدِيَنا مَعَهُ: آآآ · أُووو · إِييي</p>'
slide("madd","lilac","wave","مِنَ الْحَرَكَةِ الْقَصيرَةِ إِلى الْمَدِّ","نَمُدُّ أَصْواتَنا",body,"[المدود] الحركة صوت قصير، والمدّ صوت طويل. اقرأ القصير ثم الطويل، ومدّ يدك مع الصوت.",mins=5,crit="مِعْيارُ النَّجاحِ 2")

# ---------- 13 write ----------
trace=f'''<svg class="trace" viewBox="0 0 400 520"><g stroke="#C9D6E6" stroke-width="3"><line x1="20" y1="120" x2="380" y2="120"/><line x1="20" y1="440" x2="380" y2="440"/></g><line x1="20" y1="280" x2="380" y2="280" stroke="#E3EAF3" stroke-width="3" stroke-dasharray="12 12"/>
<path d="M200 140 L200 440" stroke="#E7ECF2" stroke-width="40" stroke-linecap="round"/>
<path class="t1" d="M200 140 L200 440" stroke="#102A4C" stroke-width="40" stroke-linecap="round" fill="none"/>
<text class="t2" x="200" y="112" text-anchor="middle" font-size="150" fill="#E2574C" font-family="Thmanyah Display, serif">ء</text>
<g class="t3" fill="#F2A93B"><circle cx="250" cy="150" r="20"/><text x="250" y="160" text-anchor="middle" font-size="26" fill="#fff" font-family="sans-serif" font-weight="700">1</text></g>
<path class="t3" d="M260 200 v120 l-14 -14 m14 14 l14 -14" stroke="#F2A93B" stroke-width="7" fill="none" stroke-linecap="round"/></svg>'''
steps=[("1","أَبْدَأُ مِنْ أَعْلى، وَأَنْزِلُ بِخَطٍّ مُسْتَقيمٍ إِلى أَسْفَلَ ⬇"),("2","أَضَعُ الْهَمْزَةَ (ء) فَوْقَ الْأَلِفِ: أ"),("3","مَعَ الْكَسْرَةِ أَضَعُ الْهَمْزَةَ تَحْتَهُ: إ")]
body=f'<div class="wr"><div class="wbox" data-ia onclick="redraw(this)">{trace}<span class="rp">▶ أُعيدُ الرَّسْمَ</span></div><div class="wst">'+"".join(f'<div class="cd ws"{B(k+1)}><b class="n">{n}</b><p>{t}</p></div>' for k,(n,t) in enumerate(steps))+f'<p class="tip"{B(4)}>✍️ نَكْتُبُ في الْهَواءِ، ثُمَّ عَلى ظَهْرِ زَميلِنا، ثُمَّ في الدَّفْتَرِ.</p></div></div>'
slide("write","butter","letter","أَكْتُبُ حَرْفَ (أ)","أُشاهِدُ ثُمَّ أَكْتُبُ",body,"[النمذجة: أنا أفعل، نحن نفعل، أنت تفعل] انقر على اللوح ليُرسم الحرف أمام الطلاب، وكرّر. ثم يكتبون في الهواء وعلى ظهر الزميل وفي الدفتر.",mins=6,crit="مِعْيارُ النَّجاحِ 4 · الصَّفُّ كُلُّهُ")

# ---------- 14 where ----------
words=["أوشي","أَرْنَبٌ","أَبْيَضُ","أَسْوَدُ","أُريدُ","أَنْ","أَذْهَبَ","إِلى","أَلْعَبُ","أَنامُ"]
body=f'''<div class="wh"><div class="cd whq"><p class="q">في كَلِمَةِ «{hl("أَسَدٌ")}» جاءَ حَرْفُ (أ):</p><div class="opts"><span{B(1,"pop")} class="ok">1. في أَوَّلِها ✓</span><span>2. في وَسَطِها</span><span>3. في آخِرِها</span></div></div>
<p class="inst"{B(2)}>🔍 أَبْحَثُ في الْقِصَّةِ عَنْ كَلِماتٍ تَبْدَأُ بِحَرْفِ (أ):</p><div class="chips">'''+"".join(f'<span{B(k+3,"pop")}>{hl(w)}</span>' for k,w in enumerate(words))+f'</div><p class="count"{B(13,"pop")}>🎉 وَجَدْنا 10 كَلِماتٍ!</p></div>'
slide("where","rose","dots","أَيْنَ حَرْفُ (أ)؟","مُحَقِّقُ الْحُروفِ",body,"اكشف الإجابة الأولى، ثم اطلب من الطلاب البحث في الكتاب عن كلمات القصة التي تبدأ بحرف (أ). اكشف كل كلمة بعد أن يذكرها طالب.",mins=4,crit="مِعْيارُ النَّجاحِ 1")

# ---------- 15 order ----------
ev=[(2,"قالَ أوشي: أُريدُ أَنْ أَذْهَبَ إِلى الْحَديقَةِ.",art.garden(None,200)),(3,"أَلْعَبُ ثُمَّ أَنامُ.",art.night(None,200)),(1,"أوشي أَرْنَبٌ أَبْيَضُ، ذَيْلُهُ أَسْوَدُ.",art.rabbit(None,200))]
body='<p class="inst">الْأَحْداثُ مَخْلوطَةٌ! نُرَتِّبُها: ماذا حَدَثَ أَوَّلًا؟</p><div class="ord">'+"".join(f'<div class="oc"><div class="op">{p}</div><p>{hl(t)}</p><b class="onum"{B({1:1,2:2,3:3}[n],"pop")}>{n}</b></div>' for n,t,p in ev)+'</div>'
slide("order","sky","stars","أُرَتِّبُ أَحْداثَ الْقِصَّةِ","إِعادَةُ السَّرْدِ",body,"[إعادة السرد بالتسلسل] يرتّب الطلاب الأحداث شفويًّا، ثم اكشف الأرقام: 1 ثم 2 ثم 3. يمسك ثلاثة طلاب البطاقات ويقفون بالترتيب ويسرد كل منهم حدثه.",mins=5,crit="مِعْيارُ النَّجاحِ 3")

# ---------- 16 group map ----------
G=[("الْمَجْموعَةُ 1","نُمَيِّزُ صَوْتَ (أ)","مِعْيارُ النَّجاحِ 1",["أَسَدٌ · أُذُنٌ · إِبْريقٌ · أَرْنَبٌ"],["نَنْطِقُ الْكَلِماتِ مَعًا.","يَرْسُمُ كُلٌّ مِنّا صورَةَ كَلِمَةٍ.","نُلَوِّنُ حَرْفَ (أ) في كُلِّ كَلِمَةٍ."],"لَوْحَةُ حَرْفِ (أ)","نَبْحَثُ في الصَّفِّ عَنْ شَيْئَيْنِ يَبْدَآنِ بِصَوْتِ (أ)، وَنَرْسُمُهُما في لَوْحَتِنا.","بِطاقاتُ الصّوَرِ في «كَنْزِ الْكَلِماتِ»."),
   ("الْمَجْموعَةُ 2","نَقْرَأُ الْحَرَكاتِ","مِعْيارُ النَّجاحِ 2",["أَ · أُ · إِ"],["نَقْرَأُ الْحَرْفَ بِالْحَرَكاتِ الثَّلاثِ.","نَبْحَثُ عَنْهُ في الْقِصَّةِ.","نَكْتُبُ الْكَلِماتِ الَّتي وَجَدْناها."],"بِطاقاتُ الْحَرَكاتِ","نَجِدُ في الْقِصَّةِ كَلِمَةً تَبْدَأُ بِـ (أُ) الْمَضْمومَةِ، وَأُخْرى بِـ (إِ) الْمَكْسورَةِ.","شَريحَةُ «حَرْفُ (أ) بِحَرَكاتِهِ»."),
   ("الْمَجْموعَةُ 3","نَقْرَأُ الْمُدودَ","مِعْيارُ النَّجاحِ 2",["آ · أُو · إِي"],["نَقْرَأُ الْمُدودَ الثَّلاثَةَ.","نَمُدُّ أَصْواتَنا مَعَ حَرَكَةِ الْيَدِ.","نَكْتُبُ كَلِمَةً لِكُلِّ مَدٍّ."],"شَريطُ الْمُدودِ","في الْقِصَّةِ اسْمٌ يَبْدَأُ بِمَدِّ الْواوِ (أُو). ما هُوَ؟ نَقْرَؤُهُ مَمْدودًا.","شَريحَةُ «مِنَ الْحَرَكَةِ إِلى الْمَدِّ»."),
   ("الْمَجْموعَةُ 4","نُعيدُ سَرْدَ الْقِصَّةِ","مِعْيارُ النَّجاحِ 3",["أوشي أَرْنَبٌ أَبْيَضُ، ذَيْلُهُ أَسْوَدُ."],["نَتَّفِقُ عَلى أَحْداثِ الْقِصَّةِ.","يَسْرُدُ كُلٌّ مِنّا جُزْءًا.","نَسْرُدُ الْقِصَّةَ أَمامَ الصَّفِّ."],"عَرْضُ سَرْدِ الْقِصَّةِ","نَخْتَرِعُ نِهايَةً جَديدَةً: ماذا فَعَلَ أوشي بَعْدَ أَنْ صَحا؟ في جُمْلَةٍ فيها كَلِمَةٌ تَبْدَأُ بِحَرْفِ (أ).","صُوَرُ شَريحَةِ «أُرَتِّبُ الْأَحْداثَ».")]
roles=[("📖","الْقارِئُ"),("✏️","الْكاتِبُ"),("⏱","حارِسُ الْوَقْتِ"),("🎤","الْمُتَحَدِّثُ")]
body='<div class="gm">'+"".join(f'<div class="gmc" style="--c:{LV[k][1]};--c2:{LV[k][2]}"{B(k+1)}><span class="lvt">{g[0]} · {LV[k][0]}</span><b>{g[1]}</b><small>{g[2]}</small></div>' for k,g in enumerate(G))+'</div>'
body+=f'<div class="roles"{B(5)}>'+"".join(f'<span><i>{e}</i>{r}</span>' for e,r in roles)+'</div>'
body+=f'<div class="flow"{B(6)}><span>⏱ 10 دَقائِقَ عَمَلٌ</span><b>←</b><span>🎤 نَعْرِضُ</span><b>←</b><span>⭐ نَجْمَتانِ وَأُمْنِيَةٌ</span><b>←</b><span>✅ نَماذِجُ الْإِجابَةِ</span></div>'
slide("groups","cream","ring","خَريطَةُ الْعَمَلِ الْجَماعِيِّ","كُلُّ مَجْموعَةٍ = مِعْيارُ نَجاحٍ",body,"[التعلّم التعاوني] وزّع بطاقات المجموعات وأوراق المستويات (في تبويبات الدرس) وورقة أصحاب الهمم. لكل طالب دور. المجموعة التي تنهي مهمتها تنتقل إلى «تحدّي الأبطال».",mins=2)
for k,g in enumerate(G):
    nm,c,c2=LV[k]
    body=f'''<div class="gw" style="--c:{c};--c2:{c2}"><div class="gwm"><div class="cd gread"><span class="lb">📖 نَقْرَأُ مَعًا</span><p class="gt">{hl(g[3][0])}</p></div>
<div class="cd gsteps"><span class="lb">🧩 مُهِمَّتُنا · لِلْجَميعِ</span>'''+"".join(f'<p{B(j+1)}><b>{j+1}</b>{s}</p>' for j,s in enumerate(g[4]))+f'''</div></div>
<div class="gws"><div class="gch"{B(4,"pop")}>{art.star(None,70)}<span class="lb">⭐ تَحَدّي الْأَبْطالِ</span><p>{g[6]}</p></div>
<div class="gmeta"><p>🏆 الْمُنْتَجُ: {g[5]}</p><p>🤝 دَعْمٌ: {g[7]}</p></div></div></div>'''
    slide(f"g{k+1}",["peach","mint","butter","lilac"][k],["blobs","dots","ring","stars"][k],f"{g[0]}: {g[1]}",f"{nm}",body,f"المجموعة {k+1} تعمل على {g[2]}. المهمة للجميع أولًا، ثم «تحدّي الأبطال». ذكّرهم بالأدوار والوقت (10 دقائق).",mins=10,crit=g[2])

# ---------- 21 model answers ----------
MA=["أَسَدٌ، أُذُنٌ، إِبْريقٌ، أَرْنَبٌ: كُلُّها تَبْدَأُ بِصَوْتِ (أ). وَمِنَ الصَّفِّ: أَقْلامٌ، أَوْراقٌ.","أَ · أُ · إِ — في الْقِصَّةِ: أُريدُ (أُ)، إِلى (إِ).","آ · أُو · إِي — الِاسْمُ: أوشي، نَقْرَؤُهُ: أُوو…شي.","أوشي أَرْنَبٌ أَبْيَضُ، ذَيْلُهُ أَسْوَدُ. ذَهَبَ إِلى الْحَديقَةِ، لَعِبَ ثُمَّ نامَ. ✨ صَحا أوشي، وَأَكَلَ جَزَرَةً كَبيرَةً."]
body='<div class="mg">'+"".join(f'<div class="cd mac" style="--c:{LV[k][1]};--c2:{LV[k][2]}"{B(k+1)}><span class="lvt">{G[k][0]} · {G[k][1]}</span><p>{hl(a)}</p></div>' for k,a in enumerate(MA))+'</div>'
slide("models","mint","blobs","نَماذِجُ الْإِجابَةِ","نَتَحَقَّقُ مِنْ فَهْمِنا",body,"بعد عرض كل مجموعة، اكشف نموذج إجابتها وقارنوا: ماذا أضافت المجموعة؟ ماذا ينقصها؟",mins=4)

# ---------- 22 true/false ----------
TF=[("كَلِمَةُ «أَرْنَبٌ» تَبْدَأُ بِحَرْفِ (أ).",True,"صَحيحٌ: أَرْنَبٌ."),("كَلِمَةُ «جَزَرَةٌ» تَبْدَأُ بِحَرْفِ (أ).",False,"خَطَأٌ: تَبْدَأُ بِحَرْفِ (ج)."),("أوشي أَرْنَبٌ أَسْوَدُ.",False,"خَطَأٌ: أوشي أَبْيَضُ، وَذَيْلُهُ أَسْوَدُ."),("«إِي» مَدٌّ بِالْياءِ.",True,"صَحيحٌ: إِ ← إِي.")]
body='<p class="inst">👍 صَحيحٌ أَمْ 👎 خَطَأٌ؟ نُشيرُ بِالْإِبْهامِ، ثُمَّ نُصَحِّحُ.</p><div class="tf">'+"".join(f'<div class="tfr"><div class="cd tfq"><b class="n">{k+1}</b><p>{hl(q)}</p></div><div class="tfa {"y" if ok else "x"}"{B(k+1,"pop")}><b>{"👍" if ok else "👎"}</b><p>{hl(a)}</p></div></div>' for k,(q,ok,a) in enumerate(TF))+'</div>'
slide("truefalse","peach","dots","صَحيحٌ أَمْ خَطَأٌ؟","أُفَكِّرُ وَأُصَحِّحُ",body,"[التفكير الناقد] اقرأ العبارة، يشير الطلاب بالإبهام، ثم اكشف الإجابة واطلب من طالب تصحيح الخطأ بجملة كاملة.",mins=3)

# ---------- 23 feedback ----------
body=f'''<div class="cd fbi"><p>💛 أَقولُ رَأْيي بِلُطْفٍ؛ لِيَفْرَحَ زَميلي وَيَتَحَسَّنَ.</p></div><div class="fb">
<div class="fbc"{B(1,"pop")}>{art.star(None,90)}<b>النَّجْمَةُ الْأولى</b><p>«أَعْجَبَني …»</p></div>
<div class="fbc"{B(2,"pop")}>{art.star(None,90)}<b>النَّجْمَةُ الثّانِيَةُ</b><p>«أَحْسَنْتُمْ في …»</p></div>
<div class="fbc w"{B(3,"pop")}><span class="wi">🌱</span><b>الْأُمْنِيَةُ</b><p>«أَتَمَنّى لَوْ …»</p></div></div>
<div class="chips sm"{B(4)}><span>🗣️ نُطْقٌ واضِحٌ</span><span>🔊 صَوْتٌ مَسْموعٌ</span><span>✨ عَمَلٌ مُرَتَّبٌ</span><span>🤝 تَعاوُنٌ</span></div>'''
slide("feedback","sky","stars","نَجْمَتانِ وَأُمْنِيَةٌ","نُشَجِّعُ زُمَلاءَنا",body,"[تقييم الأقران] بعد عرض كل مجموعة، يقول طالبان نجمتين وطالب أمنية باستخدام البدايات الجاهزة.",mins=3)

# ---------- 24 value ----------
body=f'''<div class="val"><div class="vlp"><img src="{A("art/flagboy.webp")}" alt=""></div><div class="vlc">
<div class="row2"><div class="cd"{B(1)}><span class="lb">🇦🇪 مِنْ سَنْعِ بِلادي</span><p>أَلْعَبُ في وَقْتِ اللَّعِبِ، وَأَنامُ مُبَكِّرًا.</p></div>
<div class="cd"{B(2)}><span class="lb">🏠 حَقيقَةٌ وَطَنِيَّةٌ</span><p>في الْإِماراتِ نَعْتَزُّ بِاللُّغَةِ الْعَرَبِيَّةِ، لُغَةِ الْقُرْآنِ الْكَريمِ.</p></div></div>
<div class="cd dil"{B(3)}><div class="clk">{art.clock(None,120)}</div><p>🤔 أُريدُ أَنْ أَلْعَبَ مِثْلَ أوشي، وَقَدْ حانَ وَقْتُ النَّوْمِ… ماذا أَفْعَلُ؟</p></div>
<p class="ans big"{B(4,"pop")}>✓ أَنامُ في وَقْتي؛ فَالنَّوْمُ يُريحُ جِسْمي، وَأَلْعَبُ غَدًا بِنَشاطٍ.</p></div></div>'''
slide("value","butter","wave","أُنَظِّمُ وَقْتي","قيمَةٌ نَعيشُها · هُوِيَّتي",body,"[القيم والهوية الوطنية] أوشي يلعب ثم ينام: نربط القصة بتنظيم الوقت. ناقش الموقف، واستمع لثلاث إجابات قبل كشف النموذج.",mins=4)

# ---------- 25 quick ----------
Q=[("أَيُّ كَلِمَةٍ تَبْدَأُ بِحَرْفِ (أ)؟","1) جَزَرٌ · 2) إِبْريقٌ · 3) شَمْسٌ","2"),("ما لَوْنُ أوشي؟","1) أَسْوَدُ · 2) أَبْيَضُ · 3) أَحْمَرُ","2"),("إِلى أَيْنَ أَرادَ أوشي أَنْ يَذْهَبَ؟","1) إِلى الْبَحْرِ · 2) إِلى السّوقِ · 3) إِلى الْحَديقَةِ","3"),("«أُو» مَدٌّ بِـ:","1) الْأَلِفِ · 2) الْواوِ · 3) الْياءِ","2"),("الْحَرْفُ «إِ» عَلَيْهِ:","1) فَتْحَةٌ · 2) ضَمَّةٌ · 3) كَسْرَةٌ","3")]
qc=["#A0612F","#2F64A8","#1E7A5A","#C2571A","#6B46A8"]
body='<div class="qq">'+"".join(f'<div class="qr" style="--c:{qc[k]}"><b class="n">{k+1}</b><div><p class="q">{q}</p><p class="o">{o}</p></div><span class="qa"{B(k+1,"pop")}>الْإِجابَةُ: {a}</span></div>' for k,(q,o,a) in enumerate(Q))+'</div>'
slide("quick","mint","ring","تَحَدّي حِراءَ السَّريعُ","5 أَسْئِلَةٍ · 5 دَقائِقَ",body,"يجيب الطلاب بالأصابع (1، 2، 3)، ثم اكشف الإجابة. سجّل نقاط المجموعات.",mins=5)

# ---------- 26 progress after ----------
prog("progress2","قِياسُ التَّقَدُّمِ: بَعْدَ الدَّرْسِ","كَمْ تَقَدَّمْتُ؟","أَرْفَعُ يَدي مَرَّةً أُخْرى، وَأُقارِنُ: في أَيِّ مِعْيارٍ تَقَدَّمْتُ؟","lilac")

# ---------- 27 exit ----------
body=f'''<div class="ex"><div class="cd exq" style="--a:#6B46A8"{B(1)}><span class="lb">✍️ أَكْتُبُ · مِعْيارُ النَّجاحِ 4</span><p>أَكْتُبُ حَرْفَ (أ) ثَلاثَ مَرّاتٍ، ثُمَّ كَلِمَتَيْنِ تَبْدَآنِ بِهِ.</p><p class="ans"{B(2,"pop")}>✓ أ  أ  أ — {hl("أَسَدٌ، أُذُنٌ")}</p></div>
<div class="cd exq" style="--a:#1E7A5A"{B(3)}><span class="lb">📖 أَفْهَمُ</span><p>ما لَوْنُ ذَيْلِ أوشي؟</p><p class="ans"{B(4,"pop")}>✓ ذَيْلُهُ أَسْوَدُ.</p></div></div>
<div class="exb"{B(5)}><div class="eb g">{art.face("happy",None,64)}<p>ما أَحْسَنْتُهُ الْيَوْمَ …</p></div><div class="eb y">{art.face("mid",None,64)}<p>ما أَحْتاجُهُ لاحِقًا …</p></div></div>
<p class="note"{B(6)}>📲 ثُمَّ نَحُلُّ بِطاقَةَ الْخُروجِ عَلى مَنَصَّةِ {logo(80)} (10 أَسْئِلَةٍ).</p>'''
slide("exit","rose","blobs","بِطاقَةُ الْخُروجِ","أُغادِرُ الصَّفَّ بِبِطاقَةٍ",body,"[بطاقة الخروج] يجيب كل طالب وحده في الدفتر، ثم يحلّ بطاقة الخروج على المنصة (10 أسئلة).",mins=3)

# ---------- 28 home ----------
body=f'''<div class="hmx"><div class="hmp"><img src="{A("art/family.webp")}" alt=""></div><div class="hmc">
<div class="cd"{B(1)}><span class="lb">🏠 مَعَ أُسْرَتي</span><p>أَبْحَثُ مَعَ أُسْرَتي عَنْ أَشْياءَ في الْبَيْتِ تَبْدَأُ بِحَرْفِ (أ).</p></div>
<div class="cd hmt"{B(2)}><span class="lb">🎯 مُهِمَّةُ أَداءٍ صَغيرَةٌ</span><p>أَكْتُبُ حَرْفَ (أ) بِخَطٍّ جَميلٍ، وَأَرْسُمُ شَيْئًا يَبْدَأُ بِهِ، وَأَعْرِضُهُ عَلى زُمَلائي.</p></div>
<p class="bye"{B(3,"pop")}>أَحْسَنْتُمْ يا أَبْطالَ {logo(120)} 🌟</p></div></div>'''
slide("home","peach","stars","رِسالَتي إِلى الْبَيْتِ","أَتَعَلَّمُ مَعَ أُسْرَتي",body,"[التكليف ومهمة الأداء] ذكّر الطلاب بالمهمة، وحدّد موعد عرضها. رسالة ولي الأمر في تبويب «ولي الأمر».",mins=1)
open("/home/claude/ar/slides.html","w").write("".join(SL))
print(len(SL))
