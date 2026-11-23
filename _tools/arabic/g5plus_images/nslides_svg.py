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
    out=f'<text x="850" y="115" text-anchor="middle" font-size="60" fill="#102A4C" {F}>أشكال مختلفة، قيمة واحدة</text>'
    out+=f'<text x="850" y="230" text-anchor="middle" font-size="80" fill="#2563EB" {F} direction="ltr" unicode-bidi="bidi-override">٢٠٥ = 205</text>'
    out+='<rect x="120" y="290" width="1460" height="150" rx="26" fill="#fff" stroke="#CBD5E1" stroke-width="4"/>'
    out+=f'<text x="850" y="338" text-anchor="middle" font-size="34" fill="#334155" {F}>الأرقام في الكتابة العربية</text>'
    out+=f'<text x="850" y="415" text-anchor="middle" font-size="66" fill="#102A4C" {F} direction="ltr" unicode-bidi="bidi-override" xml:space="preserve">٠   ١   ٢   ٣   ٤   ٥   ٦   ٧   ٨   ٩</text>'
    out+='<rect x="120" y="470" width="1460" height="150" rx="26" fill="#fff" stroke="#CBD5E1" stroke-width="4"/>'
    out+=f'<text x="850" y="518" text-anchor="middle" font-size="34" fill="#334155" {F}>الأرقام المستخدمة عالميًّا</text>'
    out+=f'<text x="850" y="595" text-anchor="middle" font-size="66" fill="#102A4C" {F} direction="ltr" unicode-bidi="bidi-override" xml:space="preserve">0   1   2   3   4   5   6   7   8   9</text>'
    return out,'أرقام نستخدمها كل يوم','مقارنة أشكال الأرقام','كل رقم في الصف العلوي يقابله رقم بالقيمة نفسها في الصف السفلي. اطلبوا من الطلاب كتابة عدد بالشكلين، ثم قراءة قيمته.','1700 620'
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
def pronouns():
    out=box(600,20,500,125,'#102A4C','كَتَبْتُهُ','')
    out+='<path d="M850 150V185 M310 185H1390 M310 185V220 M850 185V220 M1390 185V220" fill="none" stroke="#64748B" stroke-width="6"/>'
    for x,c,word,name,role in [(1180,'#2563EB','كَتَبْـ','الفعل','فعل ماضٍ'),(640,'#16A34A','ـتُـ','التاء: المتكلّم','في محلّ رفع فاعل'),(100,'#D97706','ـهُ','الهاء: الشيء المكتوب','في محلّ نصب مفعول به')]:
        out+=f'<rect x="{x}" y="230" width="420" height="300" rx="26" fill="#fff" stroke="{c}" stroke-width="6"/>'
        for y,txt,size,col in [(310,word,62,c),(405,name,33,'#334155'),(475,role,32,'#334155')]:
            out+=f'<text x="{x+210}" y="{y}" text-anchor="middle" font-size="{size}" fill="{col}" {F}>{txt}</text>'
    return out,'تفكيك الكلمة','كلمة واحدة: فعل وضميران','ابدؤوا بالكلمة كاملة، ثم تتبّعوا الفروع. من كتب؟ وما الشيء الذي كُتب؟ اربطوا المعنى بالمحلّ الإعرابي لكل ضمير.','1700 620'
def flashback():
    out=box(1120,50,500,160,'#2563EB','الحاضر','رائحة الزعتر')
    out+=box(100,50,500,160,'#2563EB','الحاضر','تستمرّ لحظة السرد')
    out+=box(610,365,500,160,'#7C3AED','الماضي','ذكرى الجدّة')
    out+='<path d="M1350 225 C1350 330 1210 430 1135 440" fill="none" stroke="#7C3AED" stroke-width="8"/><path d="M1143 421L1121 443L1153 452Z" fill="#7C3AED"/>'
    out+='<path d="M585 440 C420 400 340 320 340 235" fill="none" stroke="#2563EB" stroke-width="8"/><path d="M323 249L340 224L357 249Z" fill="#2563EB"/>'
    out+=f'<text x="1530" y="375" text-anchor="middle" font-size="36" fill="#7C3AED" {F}>استرجاع</text>'
    out+=f'<text x="200" y="370" text-anchor="middle" font-size="36" fill="#2563EB" {F}>عودة إلى الحاضر</text>'
    return out,'الاسترجاع','الزمن في زعتر وزنجبيل','الرسم يوضح تقنية الاسترجاع المذكورة في الدرس: مثير حسي في الحاضر يستدعي ذكرى. العودة إلى الحاضر جزء من نموذج التقنية، وليست تلخيصًا لتفاصيل القصة.','1700 620'
def iceberg():
    out='<rect x="80" y="220" width="730" height="350" rx="20" fill="#E0F2FE"/>'
    out+='<path d="M220 220L445 50L650 220L720 360L600 520L360 550L170 395Z" fill="#fff" stroke="#2563EB" stroke-width="5"/>'
    out+='<path d="M80 220H810" stroke="#0284C7" stroke-width="6"/>'
    out+=box(930,40,680,140,'#2563EB','الظاهر في الكلمات','حوار قصير عن الحيوانات')
    out+=box(930,330,680,180,'#7C3AED','ما يستنتجه القارئ','وحدة العجوز وقسوة الحرب')
    out+='<path d="M650 130H900 M710 420H900" stroke="#64748B" stroke-width="5" stroke-dasharray="12 8"/>'
    out+=f'<text x="850" y="610" text-anchor="middle" font-size="28" fill="#64748B" {F}>رسم مجازي، لا يمثّل نسبًا مقاسة</text>'
    return out,'نظرية جبل الجليد','قليل يقال، وكثير يفهم','ميّزوا بين الكلمات الظاهرة والمعنى الذي يستنتجه القارئ. الرسم نموذج لأسلوب همنغواي، وليس وصفًا لحدث في القصة أو قياسًا علميًّا لجبل جليدي.','1700 640'
SPECS={'AR-Y10-N-T3-L08':numbers,'AR-Y12-N-T3-L06':graphene,'AR-Y10-N-T3-L14':pronouns,'AR-Y10-N-T2-L05':flashback,'AR-Y10-N-T3-L05':iceberg}
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
