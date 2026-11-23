# Adds one explanatory SVG diagram slide (id s6d) after s6 of selected native grade 5+ decks. Pure and idempotent;
# called from g1html/shell.py after images.py so regeneration restores it. Content uses only what each deck's own text states.
import re,math
F='font-family="Thmanyah Display,Tahoma,sans-serif" font-weight="700"'
def box(x,y,w,h,c,t1,t2=''):
    s=f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="26" fill="#fff" stroke="{c}" stroke-width="6"/>'
    s+=f'<text x="{x+w/2}" y="{y+h/2-(6 if t2 else -14)}" text-anchor="middle" font-size="38" fill="{c}" {F}>{t1}</text>'
    if t2: s+=f'<text x="{x+w/2}" y="{y+h/2+38}" text-anchor="middle" font-size="30" fill="#334155" {F}>{t2}</text>'
    return s
def numbers():
    cols=['#2563EB','#16A34A','#D97706','#7C3AED','#DC2626']
    steps=[('العدّ البدائي','أصابع وحصى'),('الرموز','حضارات قديمة'),('النظام العشري',''),('الصفر','نقلة كبرى'),('الحساب الحديث','')]
    w,h,gap=270,150,60; x0=1700-30-w; out=''
    for i,(a,b) in enumerate(steps):
        x=x0-i*(w+gap); out+=box(x,40,w,h,cols[i],a,b)
        if i<4: out+=f'<path d="M{x-12} {40+h/2} L{x-gap+14} {40+h/2}" stroke="#64748B" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M{x-gap+10} {40+h/2-14} L{x-gap-6} {40+h/2} L{x-gap+10} {40+h/2+14} Z" fill="#64748B"/>'
    out+='<rect x="120" y="290" width="1460" height="150" rx="26" fill="#fff" stroke="#CBD5E1" stroke-width="4"/>'
    out+=f'<text x="850" y="338" text-anchor="middle" font-size="34" fill="#334155" {F}>الأرقام في الكتابة العربية</text>'
    out+=f'<text x="850" y="415" text-anchor="middle" font-size="66" fill="#102A4C" {F} direction="ltr" unicode-bidi="bidi-override" xml:space="preserve">٠   ١   ٢   ٣   ٤   ٥   ٦   ٧   ٨   ٩</text>'
    out+='<rect x="120" y="470" width="1460" height="150" rx="26" fill="#fff" stroke="#CBD5E1" stroke-width="4"/>'
    out+=f'<text x="850" y="518" text-anchor="middle" font-size="34" fill="#334155" {F}>الأرقام المستخدمة عالميًّا</text>'
    out+=f'<text x="850" y="595" text-anchor="middle" font-size="66" fill="#102A4C" {F} direction="ltr" unicode-bidi="bidi-override" xml:space="preserve">0   1   2   3   4   5   6   7   8   9</text>'
    return out,'أرقام نستخدمها كل يوم','الأرقام: من العدّ بالأصابع إلى النظام الحديث','مرحلة تبني على التي قبلها: اقرؤوا السلسلة من اليمين إلى اليسار، ثم قارنوا شكلَي الأرقام في الصفّين.','1700 620'
def graphene():
    r=34; dx=r*math.sqrt(3); out='<g>'
    pts=[];lines=''
    ox,oy=120,90
    for row in range(8):
        for col in range(8):
            cx=ox+col*dx+(dx/2 if row%2 else 0); cy=oy+row*r*1.5
            pts.append((cx,cy))
            for k in range(6):
                a1=math.radians(60*k-30);a2=math.radians(60*(k+1)-30)
                lines+=f'<line x1="{cx+r*math.cos(a1):.1f}" y1="{cy+r*math.sin(a1):.1f}" x2="{cx+r*math.cos(a2):.1f}" y2="{cy+r*math.sin(a2):.1f}" stroke="#334155" stroke-width="3"/>'
    dots=''.join(f'<circle cx="{x+r*math.cos(math.radians(60*k-30)):.1f}" cy="{y+r*math.sin(math.radians(60*k-30)):.1f}" r="8" fill="#0F172A"/>' for x,y in pts for k in range(6))
    out=lines+dots
    out+=f'<text x="{ox+4*dx}" y="560" text-anchor="middle" font-size="36" fill="#0F172A" {F}>طبقة من ذرّات الكربون (النقاط السوداء)</text>'
    # three chips right
    chips=[('التركيب','طبقة كربون','#2563EB'),('الخصائص','قوة وخفّة','#16A34A'),('التطبيقات','إلكترونيات / طاقة','#D97706')]
    for i,(a,b,c) in enumerate(chips):
        y=70+i*180
        out+=box(1000,y,640,140,c,a,b)
        if i<2: out+=f'<path d="M1320 {y+146} L1320 {y+176}" stroke="#64748B" stroke-width="7" stroke-linecap="round"/><path d="M1306 {y+170} L1320 {y+186} L1334 {y+170} Z" fill="#64748B"/>'
    return out,'الغرافين','الغرافين: من التركيب إلى التطبيق','ثلاث مراحل في تعريف المصطلح: التركيب، ثم الخصائص، ثم التطبيقات. الرسم يوضح شكل الطبقة: ذرّات كربون في خلايا سداسية.','1700 620'
SPECS={'AR-Y10-N-T3-L08':numbers,'AR-Y12-N-T3-L06':graphene}
def apply_html(code,t):
 fn=SPECS.get(code)
 if not fn or 'id="s6d"' in t: return t
 body,label,title,aside,vb=fn()
 m=re.search(r'<section class="sl" id="s6"[^>]*>.*?</section>',t,re.S).group()
 a=m.find('<div class="bd cvb2">'); f=m.find('<div class="ft">')
 head=m[:a].replace('id="s6"','id="s6d"')
 head=re.sub(r'(<h2 class="ht[^"]*">).*?(</h2>)',lambda x:x.group(1)+title+x.group(2),head,flags=re.S)
 head=re.sub(r'(<span class="pill">).*?(</span>)',lambda x:x.group(1)+'شاهدني'+x.group(2),head,count=1)
 head=re.sub(r'(<span class="pill tm">).*?(</span>)',lambda x:x.group(1)+'⏱ 2 دقيقتان'+x.group(2),head,count=1)
 foot=re.sub(r'<aside>.*?</aside>','<aside>'+aside+'</aside>',m[f:],flags=re.S)
 svg='<div class="bd" data-added="g5plus-diagram"><svg viewBox="0 0 %s" style="width:100%%;height:100%%" role="img" aria-label="%s">%s</svg></div>'%(vb,title,body)
 return t.replace(m,m+head+svg+foot,1)
