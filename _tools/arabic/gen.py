# Generic v2 lesson generator: deck + differentiated worksheets + DB payload, from one compact spec
import sys,os,json; sys.path.insert(0,'/tmp/g6v2')
from v2deck import *
import build_g2 as B
from playwright.sync_api import sync_playwright
LV=[("مبتدئ: أتعرّف وأحدّد",'A35E24'),("متطوّر: أفسّر وأحلّل",'5F6C78'),("متمكّن: أوازن وأقيّم وأبتكر",'6B46A8')]
ROLES=[("🎤","القارئ","يقرأ بصوت معبّر"),("🔦","صيّاد الأفكار","يلتقط الفكرة والدليل"),("🧠","المحلّل","يفسّر ويستنتج"),("📝","المقرّر","يدوّن رأي المجموعة")]
def deck(S):
    D=Deck(False); G=S['gs']
    cover(D,S['title'],S['unit'],S['pg'],S['emo'],S['goal'])
    sl=slide(D,0,"ماذا تتذكّر؟",G,3,"اسأل شفويًّا، ثم اكشف الإجابة.")
    (a,wa),(b,wb)=cols(2)
    box(sl,a,1.2,wa,2.1,S['ret'][0][0],S['ret'][0][1],rv=1); box(sl,b,1.2,wb,2.1,S['ret'][1][0],S['ret'][1][1],col='6B46A8',rv=2)
    T(sl,S['ret'][2],X0,3.5,W,1.2,15,TE,True,'right',fill=SOFT,rad=True,rv=3)
    h=S['hook']; sl=slide(D,1,"موقف مثير",G,4,"فكّر – زاوج – شارك.")
    I(sl,h[0],0.5,1.25,1.0); I(sl,h[1],8.5,1.25,1.0)
    T(sl,h[2],1.7,1.2,6.6,0.6,17,DK,True,'center'); T(sl,h[3],1.7,1.85,6.6,0.55,16,TE,True,'center',rv=1)
    box(sl,X0,2.65,W,2.3,"💬 فكّر · زاوج · شارك",h[4],rv=2)
    sl=slide(D,2,"ناتج التعلّم ومعايير النجاح",G,2)
    T(sl,"🎯 "+S['goal'],X0,1.2,W,0.9,15,DK,True,'right',fill=CARD,rad=True)
    for i,((x,w),(lv,col),txt) in enumerate(zip(cols(3),LV,S['lv'])): box(sl,x,2.3,w,2.65,lv,[txt],col=col,size=14,rv=i+1)
    sl=slide(D,3,"المفردات: المعنى والإيحاء والاستخدام",G,7,S.get('vnote',"المعجم في الكتاب. بعد المعنى المعجمي اسأل: بماذا توحي الكلمة؟ وكيف أستخدمها؟"))
    cs=cols(2)
    for i,(w_,m,e) in enumerate(S['vocab'][:4]):
        x,w=cs[i%2]; y=1.2+(i//2)*1.45
        R(sl,x,y,w,1.35,CARD,line=TE,rv=i+1,lw=2)
        T(sl,w_,x+0.1,y+0.05,w-0.2,0.45,20,TE,True,'right',rv=i+1)
        T(sl,"المعنى: "+m,x+0.1,y+0.5,w-0.2,0.38,14,DK,False,'right',rv=i+1)
        T(sl,e,x+0.1,y+0.88,w-0.2,0.38,14,'6B46A8',True,'right',rv=i+1)
    T(sl,"✍️ "+S['vtask'],X0,4.2,W,0.75,15,DK,True,'right',fill=PEACH,rad=True,rv=5)
    sl=slide(D,4,S.get('readtitle',"القراءة النموذجية وأدوار المجموعة"),G,6,S.get('readnote',"اقرأ النص قراءة نموذجية من الكتاب، ثم وزّع الأدوار."))
    box(sl,X0,1.2,W,1.25,S.get('readbox',"📖 القراءة"),S['read'],size=14)
    for i,((x,w),(e,r,d)) in enumerate(zip(cols(4),S.get('roles',ROLES))):
        R(sl,x,2.6,w,2.35,CARD,line=SUN,rv=i+1,lw=2); I(sl,e,x+(w-0.7)/2,2.68,0.7,rv=i+1)
        T(sl,r,x+0.05,3.42,w-0.1,0.42,16,TE,True,'center',rv=i+1); T(sl,d,x+0.08,3.86,w-0.16,1.0,13,DK,False,'center',rv=i+1,valign='top')
    k=S['skill']; sl=slide(D,5,k['title'],G,6,k.get('note','فكّر بصوت عالٍ أمام الطلاب، خطوة خطوة.'))
    y=1.2
    if k.get('chips'):
        for (x,w),(c,t,d) in zip(cols(len(k['chips'])),k['chips']):
            R(sl,x,1.2,w,1.05,c,rad=True,rv=1); T(sl,t,x,1.22,w,0.45,16,'FFFFFF',True,'center',rv=1); T(sl,d,x,1.7,w,0.45,13,'FFFFFF',False,'center',rv=1)
        y=2.4
    h1=2.95-(y-1.2) if not k.get('chips') else 1.3
    box(sl,X0,y,W,1.6 if not k.get('chips') else 1.3,k['model'][0],k['model'][1],size=13,rv=2)
    y2=y+(1.72 if not k.get('chips') else 1.42)
    box(sl,X0,y2,W,5.0-y2,k['second'][0],k['second'][1],col='6B46A8',size=13,rv=3)
    we=S['we']; sl=slide(D,6,we['title'],G,8,"توزّع على كل مجموعة بطاقة مهمة. يرجع الطلاب إلى النص في الكتاب.")
    box(sl,X0,1.2,W,1.6,"🔬 مهمة المجموعات (بالأدوار)",we['task'],size=14)
    (a,wa),(b,wb)=cols(2)
    box(sl,a,2.95,wa,2.05,"🧠 تفكير ناقد",we['crit'],col='6B46A8',size=13,rv=1)
    box(sl,b,2.95,wb,2.05,"⚖️ قيّم وتخيّل",we['eval'],col='A35E24',size=13,rv=2)
    c=S['chk']; sl=slide(D,7,"هل أنت جاهز؟",G,2,"بطاقات (أ) و(ب) و(ج). من يخطئ ينضمّ إلى مجموعة دعم قصيرة مع المعلّم.")
    T(sl,c[0],X0,1.2,W,0.5,17,DK,True,'right')
    for i,o in enumerate(c[1]): T(sl,'(%s) %s'%('أبج'[i],o),X0,1.8+i*0.68,W,0.6,15,DK,False,'right',fill=CARD,rad=True,rv=1)
    T(sl,"✅ الإجابة (%s)، %s"%('أبج'[c[2]],c[3]),X0,3.9,W,0.5,15,'FFFFFF',True,'right',fill=TE,rad=True,rv=2)
    T(sl,"🟥 أحتاج مساعدة     🟨 أحتاج قليلًا     🟩 جاهز",X0,4.5,W,0.5,15,DK,True,'center',rv=3)
    sl=slide(D,8,"أنشطة متمايزة",G,10,"وزّع الأوراق الثلاث وورقة أصحاب الهمم. الهدف واحد، والمهمة تختلف عمقًا.")
    for i,((x,w),(lv,col),lines) in enumerate(zip(cols(3),LV,S['ind'])): box(sl,x,1.2,w,2.45,lv,lines,col=col,size=13,rv=i+1)
    box(sl,X0,3.8,W,1.2,"🏆 تحدّي الكتابة",S['chal'],col='A35E24',size=13,rv=4)
    sl=slide(D,9,"بطاقة الناقد الصغير",G,5,"يتبادل الطلاب الأوراق، ثم يصحّح كل طالب عمله.")
    for i,cr in enumerate(S['peer'][:6]):
        x,w=cols(2)[i%2]; T(sl,"☐ "+cr,x,1.2+(i//2)*0.72,w,0.6,15,DK,False,'right',fill=CARD,rad=True,rv=1)
    T(sl,"💬 أعجبني … / أقترح أن …",X0,3.5,W,0.6,17,TE,True,'center',rv=2)
    sl=slide(D,10,"بطاقة الخروج",G,3)
    box(sl,X0,1.2,W,2.6,"🎟️ أجب في بطاقتك",S['exit'],size=16)
    T(sl,"تُجمع البطاقات لتبدأ بها الحصة القادمة.",X0,4.0,W,0.5,14,MU,False,'center')
    sl=slide(D,11,"ماذا تعلّمت؟",G,2)
    box(sl,X0,1.2,W,1.3,"🪞 تعلّمتُ اليوم",[S['learned']],size=15)
    box(sl,X0,2.62,W,1.1,"❓ وما زلتُ أتساءل",[S['wonder']],col='6B46A8',size=15,rv=1)
    box(sl,X0,3.85,W,1.15,"🤖 الذكاء الاصطناعي ناقدًا",[S.get('ai',"اطلب منه: «اقرأ ما كتبتُ بوصفك ناقدًا واسألني سؤالين، ولا تُعِد كتابته».")],col='A35E24',size=14,rv=2)
    sl=slide(D,12,"واجبي في البيت",G)
    box(sl,X0,1.2,W,2.6,"🏠 في البيت",S['home'],size=15)
    bad=check(D)
    if bad: raise SystemExit('OVERLAP %s %s'%(S['code'],bad))
    B.export(S['code'],D); return len(D.slides)
CSS=open('/tmp/g6v2/ws.py').read().split('CSS="""')[1].split('"""')[0]
def head(S,lv,col,title,tag):
    return f"""<div class='hd'><div><div class='t'>{title}</div><div class='sm'>اللغة العربية · {os.environ.get('GRADE_AR','الصف السادس')} · {S['unit']} · {S['pg']}</div></div><div class='lv' style='background:{col}'>{lv}</div></div>
<div class='meta'><span>الاسم: ....................................</span><span>الصف: ..........</span><span>التاريخ: ..........</span></div>
<div class='box'><span class='q'>🎯 ناتج التعلّم:</span> {S['goal']}<br><span class='q'>المهارة:</span> {tag}</div>"""
def ln(n): return "".join("<div class='ln'></div>" for _ in range(n))
def render(items):
    out=[]
    for it in items:
        k=it[0]
        if k=='mcq': out.append(f"<div class='box'><span class='q'>{it[1]}</span><div class='ch'>"+"".join(f"<span>{'أبجد'[i]}) {o}</span>" for i,o in enumerate(it[2]))+"</div></div>")
        elif k=='match': out.append(f"<div class='box'><span class='q'>{it[1]}</span><table><tr><th>أ</th><th>ب</th></tr>"+"".join(f"<tr><td>{a}</td><td>{b}</td></tr>" for a,b in it[2])+"</table></div>")
        elif k=='table': out.append(f"<div class='box'><span class='q'>{it[1]}</span><table><tr>"+"".join(f"<th>{h}</th>" for h in it[2])+"</tr>"+"".join("<tr>"+"".join(f"<td>{c}</td>" for c in r)+"</tr>" for r in it[3])+"</table></div>")
        elif k=='write': out.append(f"<div class='box'><span class='q'>{it[1]}</span>{ln(it[2])}</div>")
        elif k=='frame': out.append(f"<div class='box'><span class='q'>{it[1]}</span><div style='line-height:2.3'>{it[2]}</div></div>")
        elif k=='note': out.append(f"<div class='box ok'>{it[1]}</div>")
    return ''.join(out)
def sheets(S,pg):
    d=f"/tmp/dep/resources/g{os.environ.get('GNUM','6')}/{S['code']}"; os.makedirs(d,exist_ok=True); w=S['ws']
    def pdf(name,body):
        open('/tmp/g6v2/t.html','w').write(f"<html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{body}</body></html>")
        pg.goto('file:///tmp/g6v2/t.html'); pg.wait_for_timeout(120); pg.pdf(path=f'{d}/{name}.pdf',format='A4',print_background=True)
    t=f"ورقة نشاط متمايزة: {S['title']}"
    pdf('worksheets-A4',head(S,"مبتدئ ★",'#A35E24',t,"أتعرّف وأحدّد")+render(w['beg'])+"<div class='pb'></div>"+head(S,"متطوّر ★★",'#5F6C78',t,"أفسّر وأحلّل")+render(w['dev'])+"<div class='pb'></div>"+head(S,"متمكّن ★★★",'#6B46A8',t,"أوازن وأقيّم وأبتكر")+render(w['adv']))
    pdf('pod-sheet',head(S,"أصحاب الهمم 💚",'#0F6E72',f"نشاط مكيّف: {S['title']}","أقرأ وأفهم بمساعدة")+render(w['pod']))
    rows="".join(f"<tr><td>{c}</td><td style='height:66px'></td><td></td><td></td></tr>" for c in w['concepts'])
    pdf('concept-card',f"<div class='hd'><div class='t'>بطاقة المفاهيم: {S['title']}</div><div class='lv' style='background:#0F6E72'>للجميع</div></div><table><tr><th>المفهوم</th><th>تعريفه بلغتي</th><th>مثال من النص</th><th>مثال من إنشائي</th></tr>{rows}</table><div class='box'><span class='q'>✍️ بطاقة الناقد الصغير (لمراجعة الزميل):</span><br>"+" ".join('☐ '+c for c in S['peer'])+"<br>أعجبني: ................................ أقترح: ................................</div>")
    pdf('answer-key',f"<div class='hd'><div class='t'>مفتاح الإجابة ونموذج بطاقة المفاهيم: {S['title']}</div><div class='lv' style='background:#1E3A3F'>للمعلّم</div></div>"+"".join(f"<div class='box'><b>{a}:</b> {b}</div>" for a,b in w['key']))
def payload(S):
    db=S['db']; sc=[[1,S['lv'][0],2],[1,S['lv'][1],3],[2,S['lv'][2],4],[2,db.get('chal_sc',"أنتج عملًا أصيلًا وأقيّمه بمعيار (تحدٍّ)"),4]]
    q=[x if not (len(x)>4 and x[4]>3) else x[:4]+[3]+x[5:] for x in db['q']]
    return {"track":"native","obj":S['goal'],"axis":db.get('axis','AR-1.2'),"periods":db.get('periods',2),"emoji":S['emo'],"hook":S['hook'][2]+' '+S['hook'][3],"idea":db['idea'],
            "learn":db['learn'],"words":db['words'],"do":S['home'][:2],"think":S['wonder'],"quiz":db['quiz'],"badge":"⭐ أَحْسَنْتَ","sc":sc,"q":q,"games":db['games'],"id":db['id'],"outcomes":db['outcomes']}
