# Hira v2 deck (native, Grade 6+). Each slide shows ONLY its own routine stage, centred at the top.
import sys; sys.path.insert(0,'/tmp/px'); sys.path.insert(0,'/tmp/g2b'); sys.path.insert(0,'/tmp/gen')
from spec import Deck,T,R,I,BG,CARD,DK,TE,SUN,MU,SOFT,PEACH
STAGES=["استرجاع التعلّم السابق","التهيئة وربط الدرس بالمعرفة السابقة","توضيح ناتج التعلّم ومعايير النجاح","تهيئة المفردات والمعرفة اللازمة","تقديم النص","التعليم الصريح والنمذجة: «أنا أطبّق»","الممارسة الموجّهة: «نطبّق معًا»","تحقّق قبل العمل المستقل","التطبيق المستقل والأنشطة المتمايزة: «أطبّق بنفسي»","التغذية الراجعة وتحسين العمل","بطاقة الخروج الفردية","غلق الدرس والتأمل في التعلّم","التكليف المنزلي"]
X0=0.3; W=9.4
def slide(D,cur,title,goal,mins=None,notes='',bg=BG):
    sl=D.new(bg,notes)
    T(sl,f'المرحلة {cur+1} من 13 · {STAGES[cur]}',2.0,0.1,6.0,0.36,12,'FFFFFF',True,'center',fill=TE,rad=True)
    if mins: T(sl,'⏱ %s دقائق'%mins if mins>2 else '⏱ %s دقيقة'%mins,X0,0.58,1.35,0.42,13,DK,True,'center',fill=SUN,rad=True)
    T(sl,title,1.8,0.52,7.9,0.55,23,DK,True,'right')
    T(sl,'🎯 '+goal,X0,5.17,W,0.36,12,TE,True,'center',fill=SOFT,rad=True)
    return sl
def box(sl,x,y,w,h,title,lines,col=TE,size=14,fill=CARD,rv=0):
    R(sl,x,y,w,h,fill,line=col,rv=rv,lw=2)
    T(sl,title,x+0.12,y+0.06,w-0.24,0.4,15,col,True,'right',rv=rv)
    T(sl,'\n'.join(lines),x+0.12,y+0.48,w-0.24,h-0.56,size,DK,False,'right',rv=rv,valign='top')
def cols(n,gap=0.15,x0=X0,w=W):
    cw=(w-gap*(n-1))/n
    return [(x0+w-cw-i*(cw+gap),cw) for i in range(n)]   # right-to-left order
def cover(D,title,unit,pg,emo,goal):
    sl=D.new(DK,'')
    T(sl,'اللغة العربية · '+__import__('os').environ.get('GRADE_AR','الصف السادس')+' · '+unit,0.5,0.7,9.0,0.45,15,SUN,True,'right')
    T(sl,title,3.0,1.25,6.5,1.1,42 if len(title)<=16 else (32 if len(title)<=26 else 26),'FFFFFF',True,'right')
    T(sl,'كتاب الطالب '+pg,3.0,2.4,6.5,0.45,15,'CFE3E1',False,'right')
    I(sl,emo,0.8,1.2,1.5)
    R(sl,0.5,3.35,9.0,1.5,'27474D',rad=True)
    T(sl,'🎯 هدف الحصة: '+goal,0.7,3.45,8.6,1.3,16,'FFFFFF',False,'right',valign='top')
    return sl
def check(D):
    """Fail if any two text boxes overlap, or an emoji overlaps a text box."""
    bad=[]
    for si,s in enumerate(D.slides):
        tx=[e for e in s['els'] if e['k']=='text']; im=[e for e in s['els'] if e['k']=='img']
        def ov(a,b): return min(a['x']+a['w'],b['x']+b['w'])-max(a['x'],b['x'])>0.02 and min(a['y']+a['h'],b['y']+b['h'])-max(a['y'],b['y'])>0.02
        for i in range(len(tx)):
            for j in range(i+1,len(tx)):
                if ov(tx[i],tx[j]): bad.append((si,'text',tx[i]['text'][:25],tx[j]['text'][:25]))
            for m in im:
                if ov(tx[i],m): bad.append((si,'emoji',tx[i]['text'][:25],m['emo']))
    return bad
