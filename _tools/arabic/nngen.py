# Non-native (Grade 6+) generator: ten-stage lesson model, ★/★★/★★★ differentiation by support, hidden English support (l2)
import sys,os,json; sys.path.insert(0,'/tmp/g6v2')
from v2deck import T,R,I,Deck,BG,CARD,DK,TE,SUN,MU,SOFT,PEACH,check,X0,W,cols
import build_g2 as B
from playwright.sync_api import sync_playwright
ST=["التهيئة واستدعاء التعلّم السابق","مسار التعلّم وناتج اليوم","المفردات البصرية","نمذجة المعلّم: «أنا أفعل»","الممارسة الموجّهة: «نحن نفعل معًا»","الممارسة التكيفية: «نحن نفعل»","التقييم السريع للجاهزية","العمل المستقل: «أنت تفعل»","الجسر إلى الكتابة","التأمل الذاتي والتقويم الختامي"]
LV=[("★ دعم أكبر",'A35E24'),("★★ دعم متوسط",'5F6C78'),("★★★ استقلالية أكثر",'6B46A8')]
def L2(sl,text,x,y,w,h,size=11):
    sl['els'].append({'k':'text','text':text,'x':x,'y':y,'w':w,'h':h,'size':size,'color':'5B6B6E','bold':False,'align':'left','fill':None,'font':'Arial','rv':0,'rad':False,'line':None,'valign':'middle','l2':1})
def sld(D,i,title,goal,mins=None,notes=''):
    sl=D.new(BG,notes)
    T(sl,f'المرحلة {i+1} من 10 · {ST[i]}',2.0,0.1,6.0,0.36,12,'FFFFFF',True,'center',fill=TE,rad=True)
    if mins: T(sl,'⏱ %s دقائق'%mins if mins>2 else '⏱ %s دقيقة'%mins,X0,0.58,1.35,0.42,13,DK,True,'center',fill=SUN,rad=True)
    T(sl,title,1.8,0.52,7.9,0.55,23,DK,True,'right')
    T(sl,'🎯 '+goal,X0,5.17,W,0.36,12,TE,True,'center',fill=SOFT,rad=True)
    return sl
def bx(sl,x,y,w,h,title,lines,col=TE,size=14,rv=0):
    R(sl,x,y,w,h,CARD,line=col,rv=rv,lw=2)
    T(sl,title,x+0.12,y+0.06,w-0.24,0.4,15,col,True,'right',rv=rv)
    T(sl,'\n'.join(lines),x+0.12,y+0.48,w-0.24,h-0.56,size,DK,False,'right',rv=rv,valign='top')
def deck(S):
    D=Deck(False); G=S['gs']
    sl=D.new(DK,'')
    T(sl,'اللغة العربية للناطقين بغيرها · '+os.environ.get('GRADE_AR','الصف السادس')+' · '+S['unit'],0.5,0.7,9.0,0.45,15,SUN,True,'right')
    T(sl,S['title'],3.0,1.25,6.5,1.1,40 if len(S['title'])<=18 else 30,'FFFFFF',True,'right')
    T(sl,'كتاب الطالب '+S['pg']+' · '+S['skill'],3.0,2.4,6.5,0.45,15,'CFE3E1',False,'right')
    I(sl,S['emo'],0.8,1.2,1.5)
    R(sl,0.5,3.35,9.0,1.5,'27474D',rad=True); T(sl,'🎯 ناتج اليوم: '+S['goal'],0.7,3.45,8.6,1.3,16,'FFFFFF',False,'right',valign='top')
    # 1 starter
    sl=sld(D,0,"لغز اليوم",G,4,"أسئلة تهيئة متدرّجة حسب المستوى.")
    T(sl,"🧩 "+S['hook'],X0,1.2,W,0.8,18,DK,True,'center',fill=PEACH,rad=True)
    for i,((x,w),(lv,col),q) in enumerate(zip(cols(3),LV,S['warm'])): bx(sl,x,2.15,w,2.8,lv,[q],col=col,size=15,rv=i+1)
    # 2 journey
    sl=sld(D,1,"مسار التعلّم",G,2)
    for i,((x,w),(t,b)) in enumerate(zip(cols(3),[("١. التعلّم السابق",S['prev']),("٢. ناتج اليوم",S['goal']),("٣. التعلّم القادم",S['next'])])): bx(sl,x,1.2,w,2.6,t,[b],size=14,rv=i+1)
    T(sl,"❓ لماذا نتعلّم هذا؟ "+S['why'],X0,3.95,W,0.95,15,TE,True,'right',fill=SOFT,rad=True,rv=4)
    # 3 vocab (8 words, two slides of 4)
    for part in (0,1):
        sl=sld(D,2,"المفردات البصرية"+(" (١)" if part==0 else " (٢)"),G,4 if part==0 else 3,"الصورة ← العربية ← المعنى ← الاستخدام. زرّ «عون لغوي» يُظهر الإنجليزية لمن يحتاجها.")
        for i,((x,w),(wd,mn,em,en)) in enumerate(zip(cols(4),S['vocab'][part*4:part*4+4])):
            R(sl,x,1.2,w,3.75,CARD,line=TE,rv=i+1,lw=2); I(sl,em,x+(w-1.0)/2,1.3,1.0,rv=i+1)
            T(sl,wd,x+0.05,2.4,w-0.1,0.55,21 if len(wd)<=12 else 15,TE,True,'center',rv=i+1)
            T(sl,mn,x+0.08,2.95,w-0.16,1.2,13,DK,False,'center',rv=i+1,valign='top')
            L2(sl,en,x+0.08,4.4,w-0.16,0.4,12)
    TX=S.get('text'); h=sum(map(ord,S['code']))
    if TX:
        kindlbl="🎵 القصيدة" if TX['kind']=='شعر' else "📖 نصّ القراءة"
        sl=sld(D,3,kindlbl+": "+TX['title'],G,5,"يقرأ المعلّم النص قراءة نموذجية، ثم يقرأ الطلاب سطرًا سطرًا. ابحثوا عن كلمات الدرس الملوّنة.")
        body=TX['body']; n=len(body); fs=19 if n<=5 else 17 if n<=7 else 15
        hgt=min(0.62,3.7/max(n,1))
        for i,ln_ in enumerate(body):
            T(sl,ln_,X0+(1.2 if TX['kind']=='شعر' else 0),1.25+i*hgt,W-(2.4 if TX['kind']=='شعر' else 0),hgt-0.04,fs,DK,TX['kind']=='شعر','center' if TX['kind']=='شعر' else 'right',fill=CARD if i%2==0 else None,rad=True,rv=i+1)
        sl=sld(D,4,"أسئلة النص",G,5,"اسأل، انتظر، ثم اضغط لإظهار الإجابة.")
        for i,(q,a) in enumerate(TX['qs'][:2]):
            T(sl,"❓ "+q,X0,1.2+i*1.3,W,0.55,16,DK,True,'right',fill=PEACH,rad=True,rv=2*i+1)
            T(sl,"✅ "+a,X0,1.78+i*1.3,W,0.55,15,'FFFFFF',False,'right',fill=TE,rad=True,rv=2*i+2)
        for i,(st,ok) in enumerate(TX['tf'][:2]):
            T(sl,"صح أم خطأ؟ "+st,X0,3.85+i*0.6,W-1.3,0.52,14,DK,False,'right',fill=CARD,rad=True,rv=5+i)
            T(sl,"✓ صح" if ok else "✗ خطأ",X0+W-1.2,3.85+i*0.6,1.2,0.52,14,'FFFFFF',True,'center',fill='16A34A' if ok else 'C2410C',rad=True,rv=7+i)
    acts=[("🎲 تحدّي صح أم خطأ","يقف الطالب إن كانت العبارة صحيحة، ويجلس إن كانت خاطئة، ثم يصحّح الخطأ بجملة."),
          ("🧩 رتّب الجمل","توزَّع جمل النص مقطّعة على المجموعات، وتتسابق لترتيبها ثم قراءتها."),
          ("🔍 صيّاد الكلمات","يبحث الطلاب في النص عن كلمات الدرس، ويستخدم كل منهم كلمة في جملة جديدة."),
          ("🎭 لعب الأدوار","يمثّل كل ثنائي الموقف الواقعي بالحوار، ثم يغيّران الأدوار."),
          ("⚡ بطاقات السرعة","يعرض المعلّم الصورة، ويقول الطالب الكلمة في ٣ ثوانٍ، ثم يستخدمها في جملة."),
          ("🗣️ من أنا؟","يصف طالب كلمة من الدرس دون ذكرها، ويخمّنها زملاؤه.")]
    a1,a2=acts[h%6],acts[(h+3)%6]
    sl=sld(D,4,"نشاط اليوم",G,6,"نشاطان متنوّعان يتغيّران من درس لآخر.")
    (xa,wa),(xb,wb)=cols(2)
    bx(sl,xa,1.25,wa,3.6,a1[0],[a1[1]],col='2563EB',size=15,rv=1)
    bx(sl,xb,1.25,wb,3.6,a2[0],[a2[1]],col='16A34A',size=15,rv=2)
    # 4 I do
    sl=sld(D,3,"أنا أفعل: أرى ← أفهم ← أختار ← أبني",G,5,"يفكّر المعلّم بصوت عالٍ ويبني الجملة أمام الطلاب.")
    for (x,w),(c,t,d) in zip(cols(4),[('2563EB',"أرى","أنظر إلى الصورة/النص"),('16A34A',"أفهم","أحدّد المطلوب"),('EA580C',"أختار","أختار الكلمات"),('7C3AED',"أبني","أصوغ الجملة")]):
        R(sl,x,1.2,w,0.9,c,rad=True,rv=1); T(sl,t,x,1.2,w,0.4,16,'FFFFFF',True,'center',rv=1); T(sl,d,x,1.62,w,0.42,12,'FFFFFF',False,'center',rv=1)
    bx(sl,X0,2.2,W,1.62,"🧱 التراكيب المستهدفة",S['frames'],size=14,rv=2)
    bx(sl,X0,3.92,W,1.1,"👩‍🏫 نموذج المعلّم",[' '.join(S['model'])],col='6B46A8',size=13,rv=3)
    # 5 we do together
    sl=sld(D,4,"نحن نفعل معًا",G,7,"صندوق الأسئلة: يسحب الطالب سؤالًا، يجيب، ثم يستوضح زميله أو يعقّب.")
    (a,wa),(b2,wb)=cols(2)
    bx(sl,a,1.2,wa,2.2,"🗳️ صندوق الأسئلة (١)",S['qbox'][:3],size=13)
    bx(sl,b2,1.2,wb,2.2,"🗳️ صندوق الأسئلة (٢)",S['qbox'][3:],size=13)
    bx(sl,X0,3.5,W,1.05,"💬 عبارات التفاعل",["الاستيضاح: عفوًا، هل يمكن أن تعيد؟ · يعني …؟   التعقيب: أتّفق معك لأنّ … · أحترم رأيك، لكنّ …"],col='6B46A8',size=13,rv=1)
    T(sl,"✅ تحقّق: "+S['cfu'],X0,4.6,W,0.5,14,'FFFFFF',True,'right',fill=TE,rad=True,rv=2)
    # 6 adaptive
    sl=sld(D,5,"المهمة المشتركة: هدف واحد ودعم مرن",G,8,"الهدف واحد، والاختلاف في كمية الدعم.")
    T(sl,"🎯 "+S['task'],X0,1.2,W,0.85,16,DK,True,'right',fill=PEACH,rad=True)
    for i,((x,w),(lv,col),t) in enumerate(zip(cols(3),LV,S['tiers'])): bx(sl,x,2.2,w,2.8,lv,[t],col=col,size=14,rv=i+1)
    # 7 quick check
    c=S['chk']; sl=sld(D,6,"مهمة الدقيقة الواحدة",G,2,"بطاقات الألوان: 🟥 أحتاج شرحًا · 🟨 أحتاج مساعدة قليلة · 🟩 جاهز.")
    T(sl,c[0],X0,1.2,W,0.55,18,DK,True,'right')
    for i,o in enumerate(c[1]): T(sl,'(%s) %s'%('أبج'[i],o),X0,1.85+i*0.62,W,0.55,16,DK,False,'right',fill=CARD,rad=True,rv=1)
    T(sl,"✅ الإجابة (%s)"%'أبج'[c[2]],X0,3.8,W,0.5,16,'FFFFFF',True,'right',fill=TE,rad=True,rv=2)
    T(sl,"🟥 أحتاج شرحًا     🟨 أحتاج مساعدة قليلة     🟩 جاهز",X0,4.45,W,0.5,15,DK,True,'center',rv=3)
    # 8 you do + rubric
    sl=sld(D,7,"أنت تفعل: ماذا أقول في مستواي؟",G,10,"أوراق العمل حسب المستوى + بطاقات الأدوار.")
    for i,((x,w),(lv,col),t) in enumerate(zip(cols(3),LV,S['say'])): bx(sl,x,1.2,w,2.15,lv,[t],col=col,size=13,rv=i+1)
    bx(sl,X0,3.45,W,1.6,"⭐ معايير النجاح",S['sc'],col='A35E24',size=13,rv=4)
    sl=sld(D,7,"تقييم الأداء (٣ مستويات)",G,None,"يقيّم الطالب زميله بالدوائر: ١ يحتاج تطويرًا · ٢ يحقّق · ٣ يتجاوز.")
    for i,cr in enumerate(S['rubric']): T(sl,"◯ ١   ◯ ٢   ◯ ٣      "+cr,X0,1.2+i*0.75,W,0.62,16,DK,False,'right',fill=CARD,rad=True,rv=1)
    # 9 bridge
    sl=sld(D,8,"الجسر إلى الكتابة: أسأل ← أسمع ← أسجّل ← أكتب",G,5,"موقف واقعي ينتهي بجملتين مكتوبتين.")
    T(sl,"🏪 الموقف الواقعي: "+S['real'],X0,1.2,W,0.8,16,DK,True,'right',fill=PEACH,rad=True)
    for (x,w),(c2,t,d) in zip(cols(4),[('2563EB',"١ أسأل",S['bridge'][0]),('16A34A',"٢ أسمع","أستمع لإجابة زميلي"),('EA580C',"٣ أسجّل","أكتب كلمة مفتاحية"),('7C3AED',"٤ أكتب",S['bridge'][1])]):
        R(sl,x,2.15,w,2.8,CARD,line=c2,lw=2,rv=1); T(sl,t,x+0.05,2.22,w-0.1,0.45,16,c2,True,'center',rv=1); T(sl,d,x+0.08,2.72,w-0.16,2.1,13,DK,False,'center',rv=1,valign='top')
    # 10 reflection
    sl=sld(D,9,"التأمل والتقويم الختامي",G,3)
    for i,((x,w),(t,b)) in enumerate(zip(cols(3),[("١. ماذا أستطيع الآن؟",S['can']),("٢. ما الذي ساعدني؟","الصور · لوحة المفردات · العمل مع زميلي · أسئلة المعلّم"),("٣. ما خطوتي القادمة؟",S['next'])])): bx(sl,x,1.2,w,2.5,t,[b],size=14,rv=i+1)
    T(sl,"🎟️ تذكرة الخروج: "+S['exit'],X0,3.85,W,1.1,16,'FFFFFF',True,'right',fill=TE,rad=True,valign='top',rv=4)
    bad=check(D)
    bad=[b for b in bad if not (b[1]=='text' and ('l2' in str(b)))]
    if bad: raise SystemExit('OVERLAP %s %s'%(S['code'],bad))
    B.export(S['code'],D); return len(D.slides)
CSS=open('/tmp/g6v2/ws.py').read().split('CSS="""')[1].split('"""')[0]+".en{font-size:11px;color:#5B6B6E;direction:ltr;text-align:left;display:block}"
def head(S,lv,col,tag):
    return f"""<div class='hd'><div><div class='t'>ورقة عمل: {S['title']}</div><div class='sm'>العربية للناطقين بغيرها · {os.environ.get('GRADE_AR','الصف السادس')} · {S['unit']} · {S['pg']}</div></div><div class='lv' style='background:{col}'>{lv}</div></div>
<div class='meta'><span>الاسم: ....................................</span><span>الصف: ..........</span><span>التاريخ: ..........</span></div>
<div class='box'><span class='q'>🎯 ناتج التعلّم:</span> {S['goal']}<br><span class='q'>معايير النجاح:</span> {' · '.join('☐ '+x for x in S['sc'])}</div>"""
def ln(n): return "".join("<div class='ln'></div>" for _ in range(n))
def sheets(S,pg,lv1=True):
    d=f"/tmp/dep/resources/g{os.environ.get('GNUM','6')}/{S['code']}"; os.makedirs(d,exist_ok=True)
    def pdf(name,body):
        open('/tmp/g6v2/t.html','w').write(f"<html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{body}</body></html>")
        pg.goto('file:///tmp/g6v2/t.html'); pg.wait_for_timeout(120); pg.pdf(path=f'{d}/{name}.pdf',format='A4',print_background=True)
    v=S['vocab']
    vt="<table><tr><th>الصورة</th><th>الكلمة</th><th>المعنى</th></tr>"+"".join(f"<tr><td style='font-size:24px'>{e}</td><td><b>{w}</b></td><td>{m}</td></tr>" for w,m,e,en in v[:4])+"</table>"
    gloss="<div class='box'><span class='q'>📘 مسرد مساعد</span> "+" · ".join(f"{w} = <span dir='ltr'>{en}</span>" for w,m,e,en in v)+"</div>"
    TX=S.get('text'); h=sum(map(ord,S['code']))
    tbox=(f"<div class='box' style='background:#FFF8EC'><span class='q'>{'🎵 القصيدة' if TX['kind']=='شعر' else '📖 النص'}: {TX['title']}</span><div style='font-size:16px;line-height:2;{'text-align:center' if TX['kind']=='شعر' else ''}'>{'<br>'.join(TX['body'])}</div></div>") if TX else ""
    def act(k,full):
        if not TX: return ""
        if k==0: return "<div class='box'><span class='q'>أضع ✓ أو ✗:</span>"+"".join(f"<div>☐ {st}</div>" for st,ok in TX['tf'])+"</div>"
        if k==1:
            qs=TX['qs'] if full else TX['qs'][:1]
            return "<div class='box'><span class='q'>أجيب من النص:</span>"+"".join(f"<div>{i+1}. {q}</div>{ln(1)}" for i,(q,a) in enumerate(qs))+"</div>"
        if k==2:
            import re as _re; _n=lambda s:_re.sub('[\u064B-\u0652\u0670]','',s); _b=_n(' '.join(TX['body'])); found=[w for w,_,_,_ in S['vocab'] if _n(w).replace('ال','',1) in _b or _n(w) in _b][:4] or [S['vocab'][0][0]]
            return "<div class='box'><span class='q'>أبحث في النص عن هذه الكلمات وأضع تحتها خطًّا، ثم أكتب جملة بكلمة منها:</span> "+" · ".join(found)+ln(1)+"</div>"
        if k==3:
            sents=TX['body'][:4]; import random; r=random.Random(h); sh=sents[:]; r.shuffle(sh)
            return "<div class='box'><span class='q'>أرتّب الجمل كما في النص (١، ٢، ٣…):</span>"+"".join(f"<div>( &nbsp; ) {x}</div>" for x in sh)+"</div>"
        return ""
    order=[(h+i)%4 for i in range(4)]
    b1=head(S,"★ دعم أكبر","#A35E24","")+tbox+act(order[0],False)+vt+f"<div class='box'><span class='q'>١) {S['ws_q'][0]}</span><div style='line-height:2.3'>{S['frame_fill']}</div></div><div class='box'><span class='q'>٢) أختار الكلمة المناسبة:</span>"+"".join(f"<div>• {a} <span class='ch'>"+" ".join(f"<span>{o}</span>" for o in ops)+"</span></div>" for a,ops in S['ws_choose'])+"</div>"+f"<div class='box'><span class='q'>٣) {S['ws_q'][1]}</span>{ln(2)}</div>"+gloss
    b2=head(S,"★★ دعم متوسط","#5F6C78","")+tbox+act(order[1],True)+f"<div class='box'><span class='q'>١) {S['ws_q'][0]}</span><div class='sm'>كلمات تساعدك: {' · '.join(w for w,_,_,_ in v)}</div>{ln(4)}</div><div class='box'><span class='q'>٢) أجيب بجمل كاملة:</span>"+"".join(f"<div>{i+1}. {q}</div>{ln(1)}" for i,q in enumerate(S['qbox'][:4]))+f"</div><div class='box'><span class='q'>٣) {S['ws_q'][1]}</span>{ln(3)}</div>"
    b3=head(S,"★★★ استقلالية أكثر","#6B46A8","")+tbox+act(order[2],True)+f"<div class='box'><span class='q'>١) {S['ws_q'][2]}</span>{ln(7)}</div><div class='box'><span class='q'>٢) أجيب بجمل مترابطة (أستخدم: لأنّ، لكنّ، كما أنّ، لذلك):</span>"+"".join(f"<div>{i+1}. {q}</div>{ln(1)}" for i,q in enumerate(S['qbox']))+f"</div><div class='box'><span class='q'>٣) تحدٍّ:</span> {S['challenge']}{ln(3)}</div>"
    pdf('worksheets-A4',b1+"<div class='pb'></div>"+b2+"<div class='pb'></div>"+b3)
    pod=head(S,"أصحاب الهمم 💚","#0F6E72","")+tbox+"<div class='box'><span class='q'>١) أصل الصورة بالكلمة:</span><table>"+"".join(f"<tr><td style='font-size:30px'>{e}</td><td>{w}</td></tr>" for w,m,e,en in v[:4])+"</table></div>"+f"<div class='box'><span class='q'>٢) أكمل بكلمة:</span><div style='line-height:2.3'>{S['pod_frame']}</div></div><div class='box'><span class='q'>٣) أقول لزميلي جملة واحدة عن الموضوع.</span> ☐ قلتُها</div>"+gloss
    pdf('pod-sheet',pod)
    roles="<div class='hd'><div class='t'>بطاقات الأدوار ومعيار الأداء: "+S['title']+"</div><div class='lv' style='background:#0F6E72'>للمجموعات</div></div>"+"".join(f"<div class='box'><span class='q'>{lv}</span> {t}</div>" for (lv,_),t in zip(LV,S['roles']))+"<table><tr><th>المعيار</th><th>١</th><th>٢</th><th>٣</th></tr>"+"".join(f"<tr><td>{r}</td><td>◯</td><td>◯</td><td>◯</td></tr>" for r in S['rubric'])+"</table><div class='box'><span class='q'>عبارات التفاعل:</span> عفوًا، هل يمكن أن تعيد؟ · يعني …؟ · أتّفق معك لأنّ … · أحترم رأيك، لكنّ …</div>"
    pdf('concept-card',roles)
    pdf('answer-key',f"<div class='hd'><div class='t'>مفتاح الإجابة: {S['title']}</div><div class='lv' style='background:#1E3A3F'>للمعلّم</div></div>"+"".join(f"<div class='box'><b>{a}:</b> {b}</div>" for a,b in S['key'])+(("<div class='box'><b>أسئلة النص:</b> "+' · '.join(f'{q} ← {a}' for q,a in S['text']['qs'])+"<br><b>صح/خطأ:</b> "+' · '.join(f"{st} ← {'✓' if ok else '✗'}" for st,ok in S['text']['tf'])+"</div>") if S.get('text') else '')+f"<div class='box'><b>نموذج المعلّم:</b> {' '.join(S['model'])}</div>")
def payload(S):
    v=S['vocab']; c=S['chk']
    q=[["mcq",f"{e} ما هذه الكلمة؟",w,[v[(i+1)%8][0],v[(i+2)%8][0]],1,"unistructural"] for i,(w,m,e,en) in enumerate(v[:3])]
    q+=[["mcq",f"معنى «{v[3][0]}»:",v[3][1],[v[4][1],v[5][1]],2,"multistructural"],["mcq",c[0],c[1][c[2]],[o for i,o in enumerate(c[1]) if i!=c[2]],2,"multistructural"]]
    q+=S['q_extra']
    return {"track":"non_native","obj":S['goal'],"axis":"NN-S","periods":2,"emoji":S['emo'],"hook":S['hook'],"idea":S['idea'],
      "learn":([["📖" if S["text"]["kind"]!="شعر" else "🎵",S["text"]["title"]+": "+" ".join(S["text"]["body"])]] if S.get("text") else [])+[[e,f"{w}: {m}"] for w,m,e,en in v[:4]]+[["🧱",S['frames'][0]],["💬","عفوًا، هل يمكن أن تعيد؟ · أتّفق معك لأنّ …"]],
      "words":[[w,m] for w,m,e,en in v],"do":[S['bridge'][1],"أتحدّث مع أسرتي عن الموضوع بثلاث جمل."],"think":S['exit'],
      "quiz":[[S['frames'][0].split('…')[0].strip()+"… تركيب مفيد في هذا الموضوع.",True],["لا أحتاج إلى عبارات الاستيضاح في الحوار.",False]],
      "badge":"⭐ أَحْسَنْتَ","sc":[[1,S['sc'][0],2],[1,S['sc'][1],3],[2,S['sc'][2],3],[2,S['say'][2],4]],"q":q,
      "games":[["match",{"pairs":[[w,e] for w,m,e,en in v[:4]]}]]+([["tf",{"text":st,"answer":ok}] for st,ok in S["text"]["tf"]]+[["mcq",{"q":q,"options":[a]+[x for _,x in S["text"]["qs"] if x!=a][:1]+["لم يُذكر في النص"],"answer":a}] for q,a in S["text"]["qs"][:1]]+[["order",{"text":ln_,"ref":S["text"]["title"]}] for ln_ in S["text"]["body"][:2]] if S.get("text") else []),"id":S['id'],"outcomes":S['outs']}
