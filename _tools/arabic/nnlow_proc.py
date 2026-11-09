import json,copy,os,sys,random
sys.path.insert(0,'/tmp/nnlow'); from t15 import TX
R='/tmp/hira/resources/slides/'
ACTS=[("🎲 قِفْ أَوِ اجْلِسْ","يقف الطلاب إن كانت العبارة صحيحة، ويجلسون إن كانت خاطئة، ثم يصحّحون الخطأ."),
 ("🧩 رَتِّبِ الْجُمَلَ","توزَّع جمل النص مقطّعة على المجموعات، وتتسابق لترتيبها ثم قراءتها."),
 ("🔍 صَيَّادُ الْكَلِمَاتِ","يبحث الطلاب في النص عن كلمات الدرس، ويقول كل طالب جملة بكلمة منها."),
 ("🎭 مَثِّلِ الْمَوْقِفَ","يمثّل كل ثنائي النص بالحوار والحركة، ثم يتبادلان الأدوار."),
 ("⚡ بِطَاقَاتُ السُّرْعَةِ","يعرض المعلّم الصورة، ويقول الطالب الكلمة في ثلاث ثوانٍ."),
 ("🗣️ مَنْ أَنَا؟","يصف طالب كلمة من الدرس دون ذكرها، ويخمّنها زملاؤه.")]
def T(x,y,w,h,text,size,color="1E3A3F",bold=False,align="right",fill=None,rad=True,rv=None,va="middle"):
    e=dict(k="text",x=x,y=y,w=w,h=h,text=text,size=size,color=color,bold=bold,align=align,fill=fill,rad=rad,va=va)
    if rv: e["rv"]=rv
    return e
def process(code):
    p=R+code+'.json'; d=json.load(open(p)); s=[x for x in d['slides'] if not x.get('_xr')]
    tx=TX[code]; en=code.startswith('AR-Y1-')
    idx=next((i+1 for i,sl in enumerate(s) if any(('كتابي' in (e.get('text') or '') or 'My book' in (e.get('text') or '')) for e in [x for x in sl['els'] if x.get('k')=='text'][:1])),4)
    ref=s[idx-1]; tels=[e for e in ref['els'] if e.get('k')=='text']; bar=copy.deepcopy(tels[0]); tim=copy.deepcopy(tels[1]); bg=ref.get('bg','FBF6EC')
    lab=(lambda a,b: ("We do · "+b) if en else ("نَعْمَلُ مَعًا · "+a))
    out=[]
    # reading slide
    b=dict(bar,text=lab("قِرَاءَةٌ إِضَافِيَّةٌ","Extra reading")); t=dict(tim,text="⏱ 5 min" if en else "⏱ 5 د")
    n=len(tx['body']); hgt=min(92,int(470/max(n,1))); fs=40 if n<=3 else 36 if n<=4 else 32
    els=[b,t,T(230,67,1011,70,"📖 "+tx['title'],40,bold=True)]
    for i,l in enumerate(tx['body']): els.append(T(60,160+i*hgt,1160,hgt-10,l,fs,align="center" if n<=3 else "right",fill="FFFDF7" if i%2==0 else None,rv=i+1))
    out.append(dict(bg=bg,els=els,_xr=1))
    # questions slide
    els=[dict(bar,text=lab("أَسْئِلَةُ النَّصِّ","Questions")),dict(tim,text="⏱ 4 min" if en else "⏱ 4 د")]
    els.append(T(230,67,1011,70,"❓ أَسْئِلَةُ النَّصِّ",40,bold=True)); y=160
    for i,(q,a) in enumerate(tx['qs'][:2]):
        els.append(T(38,y,1203,62,"❓ "+q,30,bold=True,fill="F6E3D4",rv=2*i+1)); els.append(T(38,y+70,1203,58,"✅ "+a,28,color="FFFFFF",fill="0F6E72",rv=2*i+2)); y+=150
    for i,(st,ok) in enumerate(tx['tf'][:3]):
        if y>600: break
        els.append(T(250,y,991,56,st,26,fill="FFFDF7",rv=5+i)); els.append(T(38,y,200,56,"✓ صَحٌّ" if ok else "✗ خَطَأٌ",26,color="FFFFFF",bold=True,align="center",fill="16A34A" if ok else "C2410C",rv=8+i)); y+=66
    out.append(dict(bg=bg,els=els,_xr=1))
    # activity slide
    h=sum(map(ord,code)); a1,a2=ACTS[h%6],ACTS[(h+3)%6]
    els=[dict(bar,text=lab("نَشَاطُ الْيَوْمِ","Activity")),dict(tim,text="⏱ 6 min" if en else "⏱ 6 د"),T(230,67,1011,70,"🎲 نَشَاطُ الْيَوْمِ",40,bold=True)]
    for j,(t_,d_) in enumerate((a1,a2)):
        x=660 if j==0 else 38
        els.append(T(x,160,582,70,t_,34,color="FFFFFF",bold=True,align="center",fill="2563EB" if j==0 else "16A34A",rv=j+1))
        els.append(T(x,240,582,170,d_,28,fill="FFFDF7",va="top",rv=j+1))
    out.append(dict(bg=bg,els=els,_xr=1))
    d['slides']=s[:idx]+out+s[idx:]; json.dump(d,open(p,'w'),ensure_ascii=False)
    return len(d['slides'])
if __name__=='__main__':
    for c in sorted(TX): print(c,process(c))
