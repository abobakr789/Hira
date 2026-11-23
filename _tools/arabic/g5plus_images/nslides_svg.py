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
    out=box(1040,150,570,240,'#2563EB','الحاضر','رائحة الزعتر')
    out+=box(90,150,570,240,'#7C3AED','الماضي','ذكرى الجدّة')
    out+='<path d="M1010 270H700" fill="none" stroke="#7C3AED" stroke-width="8"/><path d="M720 250L686 270L720 290Z" fill="#7C3AED"/>'
    out+=f'<text x="850" y="220" text-anchor="middle" font-size="36" fill="#7C3AED" {F}>استرجاع</text>'
    out+=f'<text x="850" y="520" text-anchor="middle" font-size="34" fill="#334155" {F}>مثير حسي في الحاضر يستدعي ذكرى في الماضي</text>'
    return out,'الاسترجاع','الاسترجاع في زعتر وزنجبيل','هذا هو المثال المذكور في الشريحة السابقة: رائحة الزعتر في الحاضر تستدعي ذكرى الجدّة في الماضي. ما أثر هذه العودة في فهم الشخصية؟','1700 620'
def iceberg():
    out='<rect x="80" y="220" width="730" height="350" rx="20" fill="#E0F2FE"/>'
    out+='<path d="M220 220L445 50L650 220L720 360L600 520L360 550L170 395Z" fill="#fff" stroke="#2563EB" stroke-width="5"/>'
    out+='<path d="M80 220H810" stroke="#0284C7" stroke-width="6"/>'
    out+=box(930,40,680,140,'#2563EB','الظاهر في الكلمات','حوار قصير عن الحيوانات')
    out+=box(930,330,680,180,'#7C3AED','ما يستنتجه القارئ','وحدة العجوز وقسوة الحرب')
    out+='<path d="M650 130H900 M710 420H900" stroke="#64748B" stroke-width="5" stroke-dasharray="12 8"/>'
    out+=f'<text x="850" y="610" text-anchor="middle" font-size="28" fill="#64748B" {F}>رسم مجازي، لا يمثّل نسبًا مقاسة</text>'
    return out,'نظرية جبل الجليد','قليل يقال، وكثير يفهم','ميّزوا بين الكلمات الظاهرة والمعنى الذي يستنتجه القارئ. الرسم نموذج لأسلوب همنغواي، وليس وصفًا لحدث في القصة أو قياسًا علميًّا لجبل جليدي.','1700 640'
def holography():
    out='<rect x="80" y="240" width="170" height="80" rx="14" fill="#DC2626"/>'
    out+=f'<text x="165" y="220" text-anchor="middle" font-size="34" fill="#334155" {F}>ليزر</text>'
    out+='<path d="M250 280H420 M420 280H1130" stroke="#DC2626" stroke-width="9" fill="none"/>'
    out+='<path d="M385 245L455 315" stroke="#2563EB" stroke-width="15"/>'
    out+=f'<text x="425" y="180" text-anchor="middle" font-size="32" fill="#2563EB" {F}>مقسّم الحزمة</text>'
    out+='<circle cx="1210" cy="280" r="75" fill="#FDE68A" stroke="#D97706" stroke-width="5"/>'
    out+=f'<text x="1210" y="292" text-anchor="middle" font-size="36" fill="#334155" {F}>الجسم</text>'
    out+='<rect x="610" y="530" width="570" height="22" rx="8" fill="#102A4C"/>'
    out+='<path d="M420 290L740 530L1000 530Z" fill="#DC2626" opacity=".12"/><path d="M1190 355L740 530L1000 530Z" fill="#16A34A" opacity=".12"/>'
    out+='<path d="M420 290L870 522" fill="none" stroke="#DC2626" stroke-width="7"/>'
    out+='<path d="M1190 355L870 522" fill="none" stroke="#16A34A" stroke-width="7"/>'
    out+=f'<text x="460" y="430" text-anchor="middle" font-size="32" fill="#DC2626" {F}>ضوء مرجعي</text>'
    out+=f'<text x="1310" y="440" text-anchor="middle" font-size="32" fill="#16A34A" {F}>ضوء منعكس عن الجسم</text>'
    out+=f'<text x="900" y="600" text-anchor="middle" font-size="34" fill="#102A4C" {F}>لوح التسجيل: يسجّل نمط تداخل الضوءين</text>'
    out+=f'<text x="850" y="70" text-anchor="middle" font-size="32" fill="#64748B" {F}>مخطط مبسّط للتسجيل الهولوغرافي، حُذفت منه العدسات</text>'
    return out,'تسجيل الهولوجرام','كيف يسجّل الهولوجرام؟','تلتقي الإضاءة المرجعية والضوء المنعكس عن الجسم على مادة التسجيل، فيُسجّل نمط التداخل. هذا مخطط مبدأ مبسّط، لا صورة لعرض عائم. المصدر العلمي: HyperPhysics، جامعة ولاية جورجيا.','1700 640'
def opposites():
    out=f'<text x="850" y="75" text-anchor="middle" font-size="40" fill="#102A4C" {F}>معنيان يقابلهما ضدّان بالترتيب</text>'
    out+=box(1030,150,530,150,'#2563EB','فليضحكوا','')
    out+=box(140,150,530,150,'#2563EB','وليبكوا','')
    out+=box(1030,390,530,150,'#7C3AED','قليلًا','')
    out+=box(140,390,530,150,'#7C3AED','كثيرًا','')
    out+='<path d="M1000 225H700 M1000 465H700" fill="none" stroke="#64748B" stroke-width="5"/>'
    out+=f'<text x="850" y="210" text-anchor="middle" font-size="32" fill="#2563EB" {F}>ضحك / بكاء</text>'
    out+=f'<text x="850" y="450" text-anchor="middle" font-size="32" fill="#7C3AED" {F}>قلّة / كثرة</text>'
    return out,'المقابلة','المقابلة: زوجان من المعاني المتضادّة','هذه كلمات المثال القرآني المذكور في الشريحة السابقة، موزّعة للتحليل وليست نصّ الآية كاملًا. نصل كل معنى بضدّه، ثم نميّز المقابلة من طباق يقوم على زوج واحد.','1700 620'
def instrument():
    out=f'<text x="850" y="70" text-anchor="middle" font-size="36" fill="#334155" {F}>اسم الآلة يدلّ على الأداة، لا على الحدث</text>'
    # Literal key: bow, shaft and two teeth.
    out+='<circle cx="310" cy="230" r="65" fill="none" stroke="#D97706" stroke-width="20"/><path d="M375 230H660 M580 230V280 M640 230V280" stroke="#D97706" stroke-width="20" fill="none" stroke-linejoin="round"/>'
    out+=box(130,380,620,160,'#D97706','مِفْتاح','على وزن مِفْعال')
    # Literal washing machine, not a generic computer proxy.
    out+='<rect x="1110" y="120" width="280" height="240" rx="18" fill="#fff" stroke="#2563EB" stroke-width="8"/><circle cx="1250" cy="255" r="70" fill="#DBEAFE" stroke="#2563EB" stroke-width="7"/><path d="M1110 172H1390" stroke="#2563EB" stroke-width="6"/><circle cx="1348" cy="147" r="9" fill="#2563EB"/>'
    out+=box(950,380,620,160,'#2563EB','غَسّالة','على وزن فَعّالة')
    return out,'اسم الآلة','أداتان، ووزنان لاسم الآلة','قارنوا الرسم بالاسم والوزن. المفتاح أداة للفتح، والغسالة آلة للغسل. كلا الاسمين ورد في الشريحة السابقة.','1700 620'
def partwhole():
    out=f'<text x="850" y="80" text-anchor="middle" font-size="54" fill="#102A4C" {F}>قرأتُ الكتابَ نصفَه</text>'
    out+='<rect x="180" y="200" width="650" height="300" rx="16" fill="#E2E8F0" stroke="#64748B" stroke-width="6"/><rect x="505" y="200" width="325" height="300" fill="#86EFAC"/><path d="M505 200V500" stroke="#16A34A" stroke-width="6"/>'
    out+=f'<text x="670" y="365" text-anchor="middle" font-size="44" fill="#14532D" {F}>نصفه</text>'
    out+=f'<text x="505" y="555" text-anchor="middle" font-size="32" fill="#64748B" {F}>نموذج للكلّ والجزء، لا صورة لكتاب بعينه</text>'
    out+=box(970,190,650,150,'#2563EB','الكتابَ','المبدل منه: الكلّ')
    out+=box(970,380,650,150,'#16A34A','نصفَه','بدل بعض من كلّ، منصوب')
    return out,'البدل','الكلّ والجزء في بدل بعض من كلّ','المساحة الملوّنة نصف المستطيل. اربطوا الجزء بكلمة نصفه، ثم انتبهوا إلى الهاء التي تعود على الكتاب، وإلى تبعية البدل في النصب.','1700 620'
def homonym():
    out=f'<text x="850" y="85" text-anchor="middle" font-size="50" fill="#102A4C" {F}>صلّيتُ المغربَ في المغرب</text>'
    out+=box(550,150,600,110,'#7C3AED','لفظ واحد: المغرب','')
    out+='<path d="M850 270V310 M440 310H1260 M440 310V350 M1260 310V350" stroke="#64748B" stroke-width="6" fill="none"/>'
    out+=box(1000,365,590,170,'#2563EB','المعنى الأوّل','صلاة المغرب')
    out+=box(110,365,590,170,'#16A34A','المعنى الثاني','بلد المغرب')
    out+=f'<text x="850" y="605" text-anchor="middle" font-size="34" fill="#7C3AED" {F}>تشابه في اللفظ، واختلاف في المعنى</text>'
    return out,'الجناس','الجناس التامّ: لفظ واحد ومعنيان','حلّلوا المثال المذكور في الشريحة السابقة: اللفظ متطابق، لكن السياق يجعل الأولى اسم صلاة والثانية اسم بلد.','1700 640'
def categories():
    out=f'<text x="850" y="55" text-anchor="middle" font-size="32" fill="#64748B" {F}>نقرأ الصفّ والعمود معًا لتحديد كلّ قسم</text>'
    for x,txt in [(1090,'مع مال'),(430,'بلا مال')]:
        out+=f'<text x="{x}" y="125" text-anchor="middle" font-size="40" fill="#102A4C" {F}>{txt}</text>'
    out+=f'<text x="1580" y="280" text-anchor="middle" font-size="34" fill="#102A4C" {F}>مع علم</text>'
    out+=f'<text x="1580" y="490" text-anchor="middle" font-size="34" fill="#102A4C" {F}>بلا علم</text>'
    for x,y,c,a,b in [(810,170,'#2563EB','علم ومال','يعمل بعلمه'),(150,170,'#16A34A','علم بلا مال','نيّة صادقة'),(810,380,'#D97706','مال بلا علم','يخبط فيه'),(150,380,'#7C3AED','لا علم ولا مال','نيّة سيّئة')]:
        out+=box(x,y,560,165,c,a,b)
    return out,'أقسام الحديث','العلم والمال: قراءة التقسيم في جدول','هذا تصنيف للأقسام الواردة في الحديث كما يشرحها الدرس، لا حكم على كل شخص من العلم والمال وحدهما. ارجعوا إلى النص لتفسير أثر العمل والنية.','1700 620'
def composite():
    out='<rect x="910" y="100" width="700" height="400" rx="28" fill="#4B3F3A"/><rect x="90" y="100" width="700" height="400" rx="28" fill="#102A4C"/>'
    # Dust in the first complete scene.
    for x,y,r in [(1000,220,45),(1150,340,55),(1430,200,60),(1500,400,60),(1250,190,48)]:
        out+=f'<circle cx="{x}" cy="{y}" r="{r}" fill="#BFAE98" opacity=".25"/>'
    for x,y in [(1030,150),(1240,280),(1450,145)]:
        out+=f'<path d="M{x} {y}L{x+90} {y+140}L{x+108} {y+132}L{x+15} {y-5}Z" fill="#F8FAFC"/><path d="M{x+64} {y+118}L{x+115} {y+88}" stroke="#C4943A" stroke-width="11"/>'
    for x,y in [(190,180),(430,300),(630,175)]:
        out+=f'<path d="M{x} {y}l8 20 22 2-17 14 5 22-18-12-19 12 6-22-17-14 22-2Z" fill="#FDE68A"/><path d="M{x-50} {y-60}L{x-10} {y-10}" stroke="#FDE68A" stroke-width="5" opacity=".6"/>'
    out+=f'<text x="1260" y="560" text-anchor="middle" font-size="34" fill="#334155" {F}>غبار وسيوف لامعة متحرّكة</text>'
    out+=f'<text x="440" y="560" text-anchor="middle" font-size="34" fill="#334155" {F}>ليل ونجوم تتهاوى</text>'
    out+=f'<text x="850" y="635" text-anchor="middle" font-size="32" fill="#7C3AED" {F}>الهيئة المشتركة: ظلام تتخلّله أجسام لامعة متحرّكة</text>'
    return out,'التشبيه التمثيلي','تشبيه هيئة كاملة بهيئة كاملة','الرسم تخطيطي للمثال المذكور في الدرس، لا تصوير لموقعة تاريخية. نقارن ترتيب العناصر والحركة واللمعان في الصورتين، لا سيفًا واحدًا بنجمة واحدة.','1700 680'
def temporal():
    out=box(650,200,400,170,'#102A4C','الحاضر','لحظة السرد')
    out+=box(1200,200,400,170,'#7C3AED','الماضي','ذكريات')
    out+=box(100,200,400,170,'#16A34A','المستقبل','أمانٍ')
    out+='<path d="M1080 285H1160" stroke="#7C3AED" stroke-width="7"/><path d="M1145 270L1170 285L1145 300Z" fill="#7C3AED"/>'
    out+='<path d="M620 285H540" stroke="#16A34A" stroke-width="7"/><path d="M555 270L530 285L555 300Z" fill="#16A34A"/>'
    out+=f'<text x="850" y="100" text-anchor="middle" font-size="38" fill="#334155" {F}>من لحظة السرد: أتذكّر ما مضى، وأتمنّى ما سيأتي</text>'
    out+=f'<text x="850" y="505" text-anchor="middle" font-size="34" fill="#64748B" {F}>خريطة للاتجاهين، لا ترتيب لأحداث النص</text>'
    return out,'الزمن','الذكرى والأمنية حول لحظة السرد','نموذج للمفاهيم الزمنية الواردة في الدرس، وليس خطًا زمنيًا لأحداث القصة. اطلبوا دليلًا من النص لكل انتقال، ثم ناقشوا تغير الشعور.','1700 620'
def doublemeaning():
    out=box(550,60,600,130,'#102A4C','القصور','لفظ المثال في الدرس')
    out+='<path d="M850 205V265 M450 265H1250 M450 265V315 M1250 265V315" stroke="#64748B" stroke-width="6" fill="none"/>'
    out+=box(950,335,640,200,'#2563EB','المعنى القريب الظاهر','المباني الفخمة')
    out+=box(110,335,640,200,'#7C3AED','المعنى البعيد المراد','العجز والنقص')
    return out,'التورية','التورية: قريب ظاهر وبعيد مراد','هذه دلالتا اللفظ في المثال الذي تشرحه الشريحة السابقة. لا نختار المعنى المراد من القاموس وحده؛ نرجع إلى سياق البيت ودليله.','1700 620'
def poeticform():
    out=f'<text x="1260" y="80" text-anchor="middle" font-size="42" fill="#2563EB" {F}>الشعر العمودي</text>'
    out+=f'<text x="440" y="80" text-anchor="middle" font-size="42" fill="#7C3AED" {F}>شعر التفعيلة</text>'
    for y in [150,240,330,420]:
        out+=f'<rect x="940" y="{y}" width="280" height="30" rx="8" fill="#93C5FD"/><rect x="1280" y="{y}" width="280" height="30" rx="8" fill="#93C5FD"/>'
    for y,w in [(150,540),(240,350),(330,460),(420,270)]:
        out+=f'<rect x="{710-w}" y="{y}" width="{w}" height="30" rx="8" fill="#C4B5FD"/>'
    out+=f'<text x="1250" y="540" text-anchor="middle" font-size="34" fill="#334155" {F}>بيت ذو شطرين</text>'
    out+=f'<text x="440" y="540" text-anchor="middle" font-size="34" fill="#334155" {F}>أسطر تختلف في الطول</text>'
    out+=f'<text x="850" y="620" text-anchor="middle" font-size="28" fill="#64748B" {F}>المستطيلات تمثّل شكل الكتابة فقط، لا كلمات ولا تفعيلات موزونة</text>'
    return out,'الشكل الشعري','مقارنة الشكل: بيت وسطر','مخطط لشكل الكتابة، لا نموذج لوزن أو قصيدة. اعرضوا بعده مثالين حقيقيين كما يطلب الدرس، ثم قارنوا الإيقاع واللغة والفكرة أيضًا.','1700 670'
def muwashshah():
    out=f'<text x="850" y="50" text-anchor="middle" font-size="34" fill="#334155" {F}>تتابع بنية المثال: نقرأ من أعلى إلى أسفل</text>'
    for n,(y,c,txt) in enumerate([(90,'#2563EB','المطلع'),(195,'#7C3AED','دور: قافية تتغيّر'),(300,'#2563EB','قفل: يعود إلى قافية المطلع'),(405,'#D97706','دور آخر: قافية أخرى'),(510,'#2563EB','قفل: تتكرّر القافية')],1):
        out+=box(360,y,980,80,c,txt,'')
        out+=f'<text x="1430" y="{y+52}" text-anchor="middle" font-size="38" fill="{c}" {F}>{n}</text>'
        if n<5: out+=f'<path d="M850 {y+84}v12 m-9 -5 9 10 9 -10" fill="none" stroke="#64748B" stroke-width="4"/>'
    out+=f'<text x="850" y="650" text-anchor="middle" font-size="28" fill="#64748B" {F}>الأزرق للقافية المتكرّرة؛ الرسم ليس تقطيعًا عروضيًّا</text>'
    return out,'الموشح','الموشّح: قافية تعود وقوافٍ تتغيّر','نموذج للبناء كما يشرحه الدرس. ارجعوا إلى النص للتحقق من المطلع والأدوار والأقفال وقوافيها.','1700 690'
def falaj():
    out=box(1110,230,500,160,'#2563EB','قناة الفلج','تنقل الماء')
    out=out+box(560,230,390,160,'#0891B2','حوض توزيع','')
    for y,txt in [(80,'مزرعة'),(270,'مزرعة'),(460,'مزرعة')]:
        out+=box(90,y,330,120,'#16A34A',txt,'')
        out+=f'<path d="M550 310H490V{y+60}H435" fill="none" stroke="#0891B2" stroke-width="7"/>'
    out+='<path d="M1100 310H970 m20 -12 -20 12 20 12" fill="none" stroke="#0891B2" stroke-width="7"/>'
    out+=f'<text x="850" y="630" text-anchor="middle" font-size="29" fill="#64748B" {F}>مخطط مبسّط للتوزيع، لا مقادير حصص ولا تصوير للموقف الروائي</text>'
    return out,'الأفلاج','من قناة الماء إلى شبكة توزيع','تعريف عام بنظام الأفلاج، وفق وصف اليونسكو للقنوات السطحية وتوزيع الماء على المزارع. لا تمثل سماكة الخطوط حصصًا متساوية؛ يستدل الطلاب من النص على العدل والحكمة في الموقف الروائي.','1700 680'
def morphology():
    out=f'<text x="850" y="70" text-anchor="middle" font-size="36" fill="#334155" {F}>نحاذي الأصول مع فاء الميزان وعينه ولامه</text>'
    for row,(y,letters) in enumerate([(155,['ا','س','ت','خ','ر','ج']),(365,['ا','س','ت','ف','ع','ل'])]):
        for i,ch in enumerate(letters):
            x=1470-i*245;c='#2563EB' if i<3 else '#7C3AED'
            out+=f'<rect x="{x-90}" y="{y}" width="180" height="125" rx="18" fill="white" stroke="{c}" stroke-width="5"/><text x="{x}" y="{y+84}" text-anchor="middle" font-size="64" fill="{c}" {F}>{ch}</text>'
            if row==0:out+=f'<path d="M{x} 290V345" stroke="{c}" stroke-width="4"/>'
    out+=f'<text x="1220" y="580" text-anchor="middle" font-size="34" fill="#2563EB" {F}>الزوائد تبقى كما هي</text>'
    out+=f'<text x="480" y="580" text-anchor="middle" font-size="34" fill="#7C3AED" {F}>الأصول: خ ر ج ← ف ع ل</text>'
    return out,'الميزان الصرفي','استخرج: الأصول والزوائد في مكانها','الحروف مفصولة للمحاذاة، لا لتمثيل طريقة كتابة الكلمة. أعيدوا وصلها واقرؤوا: استخرج على وزن استفعل، مع ضبطهما كما في المثال السابق.','1700 650'
def participles():
    out=f'<text x="850" y="70" text-anchor="middle" font-size="36" fill="#334155" {F}>الحروف واحدة، وحركة السين تغيّر الدلالة</text>'
    out+=box(950,160,620,180,'#2563EB','مُرْسِل','اسم فاعل: من يُرسل')
    out+=box(130,160,620,180,'#7C3AED','مُرْسَل','اسم مفعول: من يقع عليه الإرسال')
    out+=box(950,410,620,120,'#2563EB','سِ: كسرة','')
    out+=box(130,410,620,120,'#7C3AED','سَ: فتحة','')
    out+='<path d="M1260 355V395 M440 355V395" stroke="#64748B" stroke-width="5"/>'
    return out,'اسم الفاعل واسم المفعول','مُرْسِل ومُرْسَل: حركة واحدة','قارنوا حركة ما قبل الآخر في المثال نفسه: الكسر لاسم الفاعل والفتح لاسم المفعول، ثم كوّنوا جملتين توضحان المعنى.','1700 620'
def dam():
    out='<rect x="120" y="140" width="620" height="340" rx="20" fill="#DBEAFE"/>'
    for row in range(4):
        for col in range(5):
            x=740+col*150;y=140+row*85
            out+=f'<rect x="{x}" y="{y}" width="145" height="80" rx="9" fill="'+('#FBBF24' if row==2 and col==2 else '#CBD5E1')+'" stroke="#64748B" stroke-width="3"/>'
    out+=f'<text x="430" y="330" text-anchor="middle" font-size="46" fill="#2563EB" {F}>الماء</text>'
    out+=f'<text x="1120" y="540" text-anchor="middle" font-size="38" fill="#334155" {F}>حجر مميّز داخل كلّ مترابط</text>'
    out+=f'<text x="850" y="630" text-anchor="middle" font-size="28" fill="#64748B" {F}>رسم لتقريب الرمز الأدبي، لا مخطط هندسي ولا تصوير لنهاية القصيدة</text>'
    return out,'الحجر والسدّ','جزء صغير في بناء أكبر','اطلبوا ربط الحجر بالفرد والسد بالمجتمع كما يشرح النص. لا نستنتج من هذا الرسم مقدار الضرر الإنشائي لإزالة حجر، ولا نعرض نهاية الحكاية.','1700 680'
def letterform():
    out='<rect x="370" y="45" width="960" height="560" rx="15" fill="white" stroke="#CBD5E1" stroke-width="5"/>'
    for y,c,a,b in [(80,'#2563EB','الرأس','الجهة والتاريخ'),(210,'#7C3AED','المدخل','التحية والموضوع'),(340,'#16A34A','المتن','الطلب والمبرّرات'),(470,'#D97706','الذيل','الختام والتوقيع')]:
        out+=box(430,y,840,110,c,a,b)
    out+=f'<text x="850" y="660" text-anchor="middle" font-size="29" fill="#64748B" {F}>هيكل تعليمي لوثيقة، لا خطاب مكتمل ولا طلب مُرسل</text>'
    return out,'الوثيقة الرسمية','أجزاء الوثيقة في مواضعها','اربطوا الهيكل بمثال طلب إنشاء نادي المناظرات السابق، ثم يختار الطلاب مبرراتهم ويكتبون طلبهم. الألوان تميز الأجزاء، وليست ترتيبًا لإرسال خطاب.','1700 700'
def river():
    out='<rect x="920" y="100" width="680" height="360" rx="25" fill="#DCFCE7"/><rect x="100" y="100" width="680" height="360" rx="25" fill="#F1F5F9"/>'
    for x,c in [(1130,'#38BDF8'),(310,'#DBEAFE')]:
        out+=f'<path d="M{x} 105C{x+250} 240 {x-100} 320 {x+230} 455H{x+100}C{x-220} 300 {x+80} 240 {x-120} 105Z" fill="{c}" stroke="#0891B2" stroke-width="4"/>'
    out+='<defs><clipPath id="ice-river"><path d="M310 105C560 240 210 320 540 455H410C90 300 390 240 190 105Z"/></clipPath></defs><path d="M310 160l80 80-110 70 130 80 M440 245l-100 80" clip-path="url(#ice-river)" fill="none" stroke="#94A3B8" stroke-width="5"/>'
    out+=f'<text x="1260" y="535" text-anchor="middle" font-size="40" fill="#2563EB" {F}>نهر جارٍ</text><text x="440" y="535" text-anchor="middle" font-size="40" fill="#64748B" {F}>سطح متجمّد</text>'
    out+=f'<text x="850" y="625" text-anchor="middle" font-size="29" fill="#64748B" {F}>رسم توضيحي للحالتين، لا صورة لمكان أو فصل محدّد</text>'
    return out,'النهر المتجمد','الصورة الطبيعية قبل تفسير رمزها','قارنوا ما في الرسم بما في أبيات الأمس واليوم والربيع. لا نجعل الرسم دليلًا على قلب الشاعر؛ نستدل على التشخيص والحالة النفسية من ألفاظ القصيدة.','1700 680'
def glazing():
    out='<rect x="500" y="110" width="700" height="400" rx="15" fill="#F1F5F9" stroke="#64748B" stroke-width="6"/><rect x="600" y="110" width="35" height="400" fill="#7DD3FC"/><rect x="1065" y="110" width="35" height="400" fill="#7DD3FC"/>'
    for x,txt in [(610,'لوح زجاج'),(1090,'لوح زجاج')]:
        out+=f'<text x="{x}" y="65" text-anchor="middle" font-size="36" fill="#0369A1" {F}>{txt}</text>'
    out+=f'<text x="850" y="275" text-anchor="middle" font-size="42" fill="#334155" {F}>فجوة محكمة</text><text x="850" y="335" text-anchor="middle" font-size="32" fill="#334155" {F}>هواء أو غاز عازل</text>'
    out+=f'<text x="850" y="590" text-anchor="middle" font-size="36" fill="#2563EB" {F}>تقلّل انتقال الحرارة، ولا توقفه تمامًا</text>'
    return out,'الزجاج المزدوج','كيف تبدو النافذة المزدوجة من الداخل؟','مقطع تعليمي مبسّط، لا أبعاد تنفيذية ولا نسبة ثابتة للتوفير. وفق energy.gov.au: لوحان تفصل بينهما فجوة محكمة مملوءة بالهواء أو غاز عازل. نربطه بمثال الفكرة والتفصيل في النص.','1700 660'
def sandgrouse():
    out=box(1110,130,490,240,'#2563EB','عند الماء','يبتلّ ريش البطن')
    out+=box(605,130,490,240,'#7C3AED','في الطيران','يحتفظ الريش بالماء')
    out+=box(100,130,490,240,'#16A34A','عند الصغار','تشرب من الريش')
    out+='<path d="M1095 400H620 m20 -15 -20 15 20 15 M595 400H120 m20 -15 -20 15 20 15" stroke="#64748B" stroke-width="6" fill="none"/>'
    out+=f'<text x="850" y="490" text-anchor="middle" font-size="38" fill="#334155" {F}>ذكر القطا ينقل الماء في ريش بطنه المتكيّف</text>'
    out+=f'<text x="850" y="580" text-anchor="middle" font-size="28" fill="#64748B" {F}>مخطط للآلية، لا رسم لشكل الريش المجهري أو لمسافة الرحلة</text>'
    return out,'القطا','رحلة الماء: من ريش البطن إلى الصغار','الآلية موثقة في بحث Johns Hopkins وMIT المنشور2023: ريش بطن الذكر يحتفظ بالماء وينقله للصغار. لا نفترض أن المنقار وعاء للنقل، ولا نضيف زمنًا أو مسافة لم يذكرهما الدرس.','1700 660'
def ropeanalogy():
    out=''
    for y,pr,cr in [(120,95,38),(390,38,95)]:
        for x,r,txt in [(1200,pr,'سفينة والديك'),(480,cr,'سفينتك')]:
            out+=f'<path d="M{x-250} {y+50}H{x+250}L{x+190} {y+125}H{x-190}Z" fill="#CBD5E1" stroke="#64748B" stroke-width="4"/><ellipse cx="{x}" cy="{y}" rx="{r}" ry="{r*.4}" fill="none" stroke="#C4943A" stroke-width="18"/>'
            out+=f'<text x="{x}" y="{y+178}" text-anchor="middle" font-size="32" fill="#334155" {F}>{txt}</text>'
        out+=f'<path d="M{1200-pr} {y}Q850 {y-80} {480+cr} {y}" fill="none" stroke="#C4943A" stroke-width="10"/>'
    out+=f'<text x="850" y="70" text-anchor="middle" font-size="32" fill="#2563EB" {F}>١: مسؤولية أكبر عند الوالدين</text><text x="850" y="340" text-anchor="middle" font-size="32" fill="#7C3AED" {F}>٢: انتقال تدريجي للمسؤولية</text>'
    out+=f'<text x="850" y="650" text-anchor="middle" font-size="27" fill="#64748B" {F}>تمثيل لاستعارة النص، لا تعليمات ملاحة ولا مقادير للمسؤولية</text>'
    return out,'مع والدي','لفّة تكبر ولفّة تصغر','حجما اللفتين تمثيل بصري لتدرّج انتقال المسؤولية كما يشرحه النص، لا قياس للعلاقة الأسرية. لا نضيف حادثة بحرية أو نتيجة نفسية لا يثبتها المثال.','1700 700'
def textlayouts():
    out=''
    for x,y,c,txt in [(900,60,'#2563EB','ممتدّ'),(90,60,'#7C3AED','غير ممتدّ'),(900,365,'#16A34A','مركّب'),(90,365,'#D97706','متعدّد المصادر')]:
        out+=f'<rect x="{x}" y="{y}" width="710" height="250" rx="24" fill="white" stroke="{c}" stroke-width="5"/><text x="{x+355}" y="{y+52}" text-anchor="middle" font-size="36" fill="{c}" {F}>{txt}</text>'
    for y in range(155,275,26):out+=f'<rect x="970" y="{y}" width="570" height="10" rx="4" fill="#93C5FD"/>'
    for y in range(155,275,35):out+=f'<path d="M160 {y}H730 M160 {y}V{y+30} M430 {y}V{y+30} M730 {y}V{y+30}" stroke="#C4B5FD" stroke-width="6"/>'
    out+='<rect x="970" y="465" width="200" height="100" rx="12" fill="#BBF7D0"/>'
    for y in range(465,575,25):out+=f'<rect x="1210" y="{y}" width="330" height="10" rx="4" fill="#86EFAC"/>'
    for x,txt in [(160,'مصدر ١'),(360,'مصدر ٢'),(560,'مصدر ٣')]:
        out+=f'<rect x="{x}" y="465" width="150" height="110" rx="10" fill="#FEF3C7"/><text x="{x+75}" y="530" text-anchor="middle" font-size="25" fill="#92400E" {F}>{txt}</text>'
    out+=f'<text x="850" y="680" text-anchor="middle" font-size="28" fill="#64748B" {F}>عينات تنسيق فقط؛ الشرطات ليست نصوصًا، والمربّع يمثّل موضع رسم</text>'
    return out,'تنسيق النص','نرى الفارق في تنظيم الصفحة','هذه عينات شكلية للمقارنة وليست نصوصًا حقيقية. يتطلب تصنيف نص بعينه فحص محتواه وروابطه ومصادره، لا الحكم من لون البطاقة أو عدد المربعات.','1700 720'
def nestforms():
    out='<path d="M1120 260Q1320 560 1520 260Z" fill="#D6B588" stroke="#92400E" stroke-width="9"/><ellipse cx="1320" cy="260" rx="200" ry="55" fill="#FEF3C7" stroke="#92400E" stroke-width="9"/>'
    out+='<circle cx="850" cy="310" r="150" fill="#D6B588" stroke="#92400E" stroke-width="9"/><circle cx="900" cy="300" r="55" fill="#78350F"/>'
    out+='<path d="M110 160H550V460H110Z" fill="#E7D3AE"/><path d="M110 300H330Q430 300 440 360Q450 420 370 420H300" fill="none" stroke="#78350F" stroke-width="65"/>'
    for x,txt in [(1320,'كوب: مفتوح من أعلى'),(850,'كرة: مدخل جانبي'),(330,'نفق: في الأرض')]:out+=f'<text x="{x}" y="545" text-anchor="middle" font-size="30" fill="#334155" {F}>{txt}</text>'
    out+=f'<text x="850" y="640" text-anchor="middle" font-size="27" fill="#64748B" {F}>أشكال مبسّطة، لا أحجام حقيقية ولا أعشاش لأنواع محدّدة</text>'
    return out,'أشكال الأعشاش','فتحة من أعلى، أو من الجانب، أو عبر نفق','أمثلة شكلية، وفق Cornell Bird Academy: كوب مفتوح، كرة مغلقة بمدخل، وعش في جحر أو نفق. تختلف المواد والمكان والحجم باختلاف النوع؛ لا ننسب شكلًا إلى نوع لم يذكره النص.','1700 700'
def ostrich():
    out='<path d="M230 525H1500" stroke="#C4943A" stroke-width="12"/><ellipse cx="610" cy="250" rx="220" ry="135" fill="#334155"/><path d="M525 320V510 M675 320V510" stroke="#64748B" stroke-width="22"/><path d="M525 510h-65 M675 510h65" stroke="#64748B" stroke-width="15"/>'
    out+='<path d="M785 220C900 220 940 340 1070 450" fill="none" stroke="#BFAE98" stroke-width="42" stroke-linecap="round"/><ellipse cx="1080" cy="450" rx="55" ry="32" fill="#BFAE98"/><circle cx="1085" cy="442" r="5" fill="#102A4C"/><path d="M1120 450l60 22-60 9Z" fill="#C4943A"/>'
    out+='<path d="M1070 520Q1230 555 1390 520" fill="none" stroke="#92400E" stroke-width="8"/>'
    for x in [1195,1260,1325]:out+=f'<ellipse cx="{x}" cy="495" rx="27" ry="35" fill="#FEF3C7" stroke="#C4943A" stroke-width="3"/>'
    out+=f'<text x="1200" y="190" text-anchor="middle" font-size="36" fill="#2563EB" {F}>تخفض رأسها عند تقليب البيض</text><path d="M1200 220V370" stroke="#2563EB" stroke-width="4"/>'
    out+=f'<text x="850" y="615" text-anchor="middle" font-size="32" fill="#334155" {F}>الرأس عند العش، وليس مدفونًا في الرمل</text>'
    out+=f'<text x="850" y="675" text-anchor="middle" font-size="26" fill="#64748B" {F}>رسم سلوكي مبسّط، لا نسب تشريحية دقيقة ولا مشهد من الرواية</text>'
    return out,'النعام','خفض الرأس ليس دفنه','وفق Smithsonian National Zoo تخفض النعامة رأسها عند تقليب البيض، وقد يسهم ذلك في نشأة الاعتقاد الشائع. الرسم لا يزعم أن هذا هو سبب كل وضع منخفض للرأس.','1700 720'
def simileparts():
    out=f'<text x="850" y="120" text-anchor="middle" font-size="58" fill="#102A4C" {F}>الابتسامة كالشمس في إشراقها</text>'
    for x,c,a,b in [(1300,'#2563EB','المشبّه','الابتسامة'),(925,'#7C3AED','الأداة','الكاف'),(550,'#16A34A','المشبّه به','الشمس'),(175,'#D97706','وجه الشبه','الإشراق')]:
        out+=box(x-145,250,290,200,c,a,b)
    out+=f'<text x="850" y="570" text-anchor="middle" font-size="32" fill="#64748B" {F}>نفكّك مثال الشريحة السابقة، ثم ننشئ تشبيهًا جديدًا</text>'
    return out,'أركان التشبيه','أربعة أجزاء في مثال واحد','تحليل المثال نفسه الوارد في الدرس، لا إجابة عن صورة الطالب الخاصة. رتّبت البطاقات وفق العبارة من اليمين إلى اليسار؛ الكاف أداة متصلة بكلمة الشمس وليست كلمة منفصلة في الكتابة.','1700 650'
def vennplay():
    out='<circle cx="1050" cy="310" r="290" fill="#DBEAFE" stroke="#2563EB" stroke-width="5"/><circle cx="650" cy="310" r="290" fill="#EDE9FE" fill-opacity=".75" stroke="#7C3AED" stroke-width="5"/>'
    out+=f'<text x="1200" y="285" text-anchor="middle" font-size="38" fill="#2563EB" {F}>ألعاب شعبية</text><text x="500" y="285" text-anchor="middle" font-size="38" fill="#7C3AED" {F}>ألعاب رقمية</text>'
    out+=f'<text x="850" y="315" text-anchor="middle" font-size="32" fill="#334155" {F}>المتعة</text>'
    out+=f'<text x="850" y="650" text-anchor="middle" font-size="29" fill="#64748B" {F}>نموذج محدود للتشابه؛ نحدّد الفروق من الألعاب والأدلة التي نختارها</text>'
    return out,'مقارنة الألعاب','مخطط فن: ما الذي يشترك فيه النوعان؟','المشترك المذكور في النموذج هو المتعة. لا نعمّم أن كل لعبة شعبية حركية أو كل لعبة رقمية فردية؛ يضيف الطلاب أمثلة موثقة وفروقها إلى مخططهم.','1700 710'
def echolocation():
    out=box(1100,200,450,170,'#2563EB','الدلفين','يرسل نقرات صوتية')
    out+=box(150,200,450,170,'#7C3AED','جسم في الماء','يرتدّ عنه الصوت')
    out+='<path d="M1080 215H620 m20 -15 -20 15 20 15" stroke="#2563EB" stroke-width="7" fill="none"/><path d="M620 420H1080 m-20 -15 20 15 -20 15" stroke="#16A34A" stroke-width="7" fill="none"/>'
    out+=f'<text x="850" y="165" text-anchor="middle" font-size="32" fill="#2563EB" {F}>الصوت الصادر</text><text x="850" y="490" text-anchor="middle" font-size="32" fill="#16A34A" {F}>الصدى العائد</text>'
    out+=f'<text x="850" y="610" text-anchor="middle" font-size="28" fill="#64748B" {F}>مخطط لمسار الإشارة، لا صورة لموجة أو مسافة مقيسة</text>'
    return out,'تحديد الموقع بالصدى','صوت يخرج وصدى يعود','العلاقة الأساسية وفق NOAA: نقرات تصدر من الدلفين وتنعكس عن الأجسام وتعود إليه. الصناديق بدائل تخطيطية، وليست مواضع الأعضاء الصوتية أو صورة تشريحية.','1700 680'
def offshoot():
    out='<path d="M1060 500l-20-300h80l20 300Z" fill="#A16207"/><path d="M1080 210Q850 50 730 200 M1080 210Q1260 20 1440 150 M1080 210Q1040 30 930 75 M1080 210Q1250 90 1460 280 M1080 210Q880 150 710 350" fill="none" stroke="#15803D" stroke-width="28"/>'
    out+='<path d="M940 480L1070 470" stroke="#A16207" stroke-width="35"/><path d="M905 500l-5-150h35l20 150Z" fill="#A16207"/><path d="M915 350Q800 250 720 340 M915 350Q1000 250 1040 315 M915 350Q880 230 830 255" fill="none" stroke="#22C55E" stroke-width="17"/><path d="M650 510H1500" stroke="#C4943A" stroke-width="8"/>'
    out+=f'<text x="400" y="360" text-anchor="middle" font-size="42" fill="#15803D" {F}>فسيلة</text><path d="M510 365H750" stroke="#15803D" stroke-width="5"/>'
    out+=f'<text x="850" y="620" text-anchor="middle" font-size="29" fill="#64748B" {F}>نموّ صغير متصل بالنخلة الأمّ؛ رسم تعريفي لا تعليمات فصل أو غرس</text>'
    return out,'الفسيلة','نتعرّف إلى الفسيلة','وفق FAO تنشأ الفسائل من براعم النخلة الأم. الرسم يعرّف الكلمة المادية، ولا يصور الحديث أو قيام الساعة أو شخصًا بعينه، ولا يشرح فصل الفسيلة أو شروط زراعتها.','1700 680'
def clocks():
    out=f'<text x="1250" y="65" text-anchor="middle" font-size="40" fill="#2563EB" {F}>المزولة: تغيّر موضع الظلّ</text><text x="450" y="65" text-anchor="middle" font-size="40" fill="#7C3AED" {F}>ساعة مائية: تغيّر مستوى الماء</text>'
    out+='<ellipse cx="1250" cy="390" rx="260" ry="115" fill="#FEF3C7" stroke="#C4943A" stroke-width="5"/><path d="M1250 385V190L1300 385Z" fill="#64748B"/><path d="M1250 385L1460 410L1300 385Z" fill="#334155" opacity=".6"/>'
    out+='<path d="M290 140V470H610V140" fill="#EDE9FE" stroke="#64748B" stroke-width="8"/><path d="M300 290H600V460H300Z" fill="#7DD3FC"/><path d="M450 475V535" stroke="#38BDF8" stroke-width="8" stroke-dasharray="9 12"/>'
    for y in [200,260,320,380,440]:out+=f'<path d="M570 {y}h35" stroke="#64748B" stroke-width="5"/>'
    out+=f'<text x="850" y="620" text-anchor="middle" font-size="28" fill="#64748B" {F}>آليتان مبسّطتان في توازٍ، لا خطّ زمني للاختراع ولا تدريج صالح للقياس</text>'
    return out,'حساب الوقت','علامة الظلّ وعلامة الماء','تؤكد NIST استخدام الظل المتحرك، وتغير مستوى الماء المتدفق لقراءة الوقت. الرسم يوضح المبدأ ولا يعمم أن اختراعًا واحدًا سبّب الآخر، ولا يقدم أبعادًا أو ساعات مقيسة.','1700 690'
def mirage():
    out='<defs><linearGradient id="warm-air" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#E0F2FE"/><stop offset=".55" stop-color="#E0F2FE"/><stop offset="1" stop-color="#FED7AA"/></linearGradient></defs><rect x="100" y="100" width="1500" height="380" fill="url(#warm-air)"/><path d="M100 485H1600" stroke="#C4943A" stroke-width="10"/>'
    out+='<path d="M260 140C530 260 800 500 1420 270" fill="none" stroke="#2563EB" stroke-width="7"/><path d="M1320 304l30-5-15 22" fill="none" stroke="#2563EB" stroke-width="5"/>'
    out+='<path d="M1420 270L1070 485" stroke="#64748B" stroke-width="5" stroke-dasharray="12 10"/><ellipse cx="1435" cy="270" rx="26" ry="17" fill="white" stroke="#334155" stroke-width="4"/><circle cx="1435" cy="270" r="8" fill="#334155"/>'
    out+=f'<text x="480" y="80" text-anchor="middle" font-size="32" fill="#2563EB" {F}>ضوء من السماء</text><text x="440" y="440" text-anchor="middle" font-size="30" fill="#9A3412" {F}>هواء أشدّ حرارة قرب السطح</text>'
    out+=f'<text x="1000" y="570" text-anchor="middle" font-size="29" fill="#64748B" {F}>المتقطّع: امتداد ظاهري لاتجاه الرؤية، لا مسار الضوء</text>'
    out+=f'<text x="850" y="650" text-anchor="middle" font-size="29" fill="#334155" {F}>الضوء ينحني عبر طبقات الهواء؛ لا ماء حقيقيًّا على الطريق</text>'
    return out,'السراب السفلي','لماذا تبدو السماء كأنها ماء عند السطح؟','وفق WMO تنحني الأشعة مع اختلاف معامل الانكسار بسبب تغير الحرارة والكثافة. الخط الأزرق مسار توضيحي من السماء إلى العين؛ المتقطع امتداد ظاهري فقط. الرسم ليس مقياسًا للزاوية أو الحرارة.','1700 720'
def barter():
    out='<rect x="160" y="120" width="520" height="310" rx="30" fill="#FEF3C7"/><rect x="1020" y="120" width="520" height="310" rx="30" fill="#DBEAFE"/>'
    for x,y in [(290,250),(380,210),(490,260),(390,320)]:out+=f'<ellipse cx="{x}" cy="{y}" rx="46" ry="27" fill="#92400E" transform="rotate(-25 {x} {y})"/><path d="M{x-20} {y+8}l40-16" stroke="#B7794F" stroke-width="3"/>'
    out+='<path d="M1130 210Q1210 170 1280 210T1430 210V350Q1350 310 1280 350T1130 350Z" fill="#60A5FA" stroke="#2563EB" stroke-width="7"/><path d="M720 230H980l-25-20m25 20-25 20M980 330H720l25-20m-25 20 25 20" fill="none" stroke="#64748B" stroke-width="9"/>'
    out+=f'<text x="420" y="490" text-anchor="middle" font-size="44" {F}>تمر</text><text x="1280" y="490" text-anchor="middle" font-size="44" {F}>قماش</text><text x="850" y="610" text-anchor="middle" font-size="32" {F}>سلعة مقابل سلعة، لا سعر أو كمية ثابتة</text>'
    return out,'المقايضة','المقايضة: تبادل السلع','رسم أصلي يوضح المثال المذكور في النص، لا صورة تاريخية ولا معدل تبادل معلوم.','1700 680'
def toylabel():
    out='<rect x="380" y="80" width="940" height="460" rx="35" fill="white" stroke="#64748B" stroke-width="6"/>'
    for y,t in [(160,'مثال تعليمي من النص، لا سياسة متجر'),(280,'العمر المناسب: ٥ سنوات فأكثر'),(380,'الضمان: سنة'),(480,'الإرجاع: خلال أسبوع')]:out+=f'<text x="850" y="{y}" text-anchor="middle" font-size="{32 if y==160 else 46}" {F}>{t}</text>'
    return out,'بيانات المنتج','كيف نقرأ بيانات اللعبة؟','بطاقة تمثيلية تُجمّع معلومات النص فقط. ليست شروط شراء أو توصية بمنتج فعلي.','1700 650'
def resident():
    out=''
    for x,hd,body in [(170,'أحمد: مقيم','يعمل ويعيش هنا'),(960,'توم: سائح','يزور المعالم أسبوعًا')]:
        out+=f'<rect x="{x}" y="90" width="570" height="300" rx="35" fill="white" stroke="#B07A12" stroke-width="6"/><text x="{x+285}" y="205" text-anchor="middle" font-size="48" {F}>{hd}</text><text x="{x+285}" y="305" text-anchor="middle" font-size="38" {F}>{body}</text>'
    out+=f'<path d="M455 390V450H1245V390M850 450V480" fill="none" stroke="#64748B" stroke-width="5"/><text x="850" y="560" text-anchor="middle" font-size="40" {F}>كلاهما يحترم القوانين والعادات</text>'
    return out,'مقيم وسائح','شخصان في النص: اختلاف ومشترك','المقارنة تخص أحمد وتوم كما يصفهما النص. ليست تعريفًا قانونيًا للإقامة أو التأشيرة.','1700 680'
def futurephone():
    out='<path d="M220 180L490 110L700 180V480L490 410L220 480Z" fill="#DBEAFE" stroke="#334155" stroke-width="9"/><circle cx="255" cy="207" r="9" fill="#334155"/><path d="M575 157l55 20" stroke="#334155" stroke-width="7"/><path d="M490 110V410" stroke="#64748B" stroke-width="6" stroke-dasharray="12 9"/><rect x="1180" y="80" width="130" height="500" rx="40" fill="#CBD5E1"/><rect x="1110" y="220" width="270" height="230" rx="50" fill="#334155"/><rect x="1140" y="250" width="210" height="170" rx="25" fill="#93C5FD"/>'
    out+=f'<text x="460" y="570" text-anchor="middle" font-size="40" {F}>هاتف قابل للطيّ</text><text x="1245" y="650" text-anchor="middle" font-size="40" {F}>ساعة ذكية في اليد</text><text x="850" y="55" text-anchor="middle" font-size="31" {F}>تصوّران وردا في النص، لا وعد بشكل المستقبل</text>'
    return out,'أشكال الأجهزة','تصوّرات النص لهاتف المستقبل','رسوم أصلية لأشكال الأجهزة المذكورة، وليست منتجًا بعينه ولا تنبؤًا مؤكدًا ولا تمثيلًا للذكاء الاصطناعي.','1700 720'

def txt(x,y,s,size=36,c='#334155'):
    return f'<text x="{x}" y="{y}" text-anchor="middle" font-size="{size}" fill="{c}" {F}>{s}</text>'
def goalsteps():
    out=txt(850,65,'هدف واضح، قابل للقياس، محدّد الوقت',42)
    for x,y,n in [(1170,340,'١'),(690,250,'٢'),(210,160,'٣')]:
        out+=box(x,y,330,150,'#2563EB','خطوة '+n)
    out+=txt(850,600,'جدول المتابعة: الخطوة | الموعد | ما أُنجز',38)
    return out,'تنظيم الهدف','من الهدف إلى خطوات صغيرة','سُلّم تنظيمي، لا قياس للنجاح. يكتب الطلاب خطواتهم ومواعيدهم وعقباتهم بأنفسهم.','1700 680'
def sentenceparts():
    out=txt(850,75,'نرى كيف تُبنى الجملة',44)
    for y,right,left,rrole,lrole in [(150,'الفضاءُ','واسعٌ','مبتدأ','خبر'),(390,'حلّقَ','المسبارُ','فعل','فاعل')]:
        out+=box(960,y,560,160,'#2563EB',right,rrole)+box(180,y,560,160,'#16A34A',left,lrole)
        out+=txt(850,y+95,'+',55)
    return out,'بناء الجملة','جملة اسمية وجملة فعلية','المثالان نفسهما في النموذج السابق، فُصلت مكوّناتهما لبيان البناء، لا لإعطاء إجابة عن تقييم لاحق.','1700 650'
def infopage():
    out='<rect x="400" y="30" width="900" height="580" rx="20" fill="white" stroke="#94A3B8" stroke-width="5"/>'
    for y,h,s,c in [(70,80,'مقدّمة','#DBEAFE'),(180,100,'فقرة: فكرة وتفاصيل','#DCFCE7'),(310,100,'فقرة: فكرة وتفاصيل','#DCFCE7'),(440,80,'خاتمة','#FEF3C7')]:
        out+=f'<rect x="450" y="{y}" width="800" height="{h}" rx="12" fill="{c}"/>'+txt(850,y+h/2+12,s)
    out+=txt(850,575,'المصادر: الكاتب، العنوان، السنة',28)
    return out,'تنظيم الصفحة','شكل النصّ المعلوماتي','قالب فارغ لتنظيم المعلومات، لا نص جاهز. تتصل الفقرات بأدوات ربط ويملأ الطلاب المصدر الحقيقي.','1700 650'
def structures5():
    out=txt(1250,70,'المقارنة',44)+txt(440,70,'السبب والنتيجة',44)
    out+=box(910,150,320,210,'#2563EB','أ','بينما / أمّا')+box(1260,150,320,210,'#2563EB','ب','كذلك / على عكس')
    out+=box(120,150,620,150,'#7C3AED','سبب','لأنّ')+box(120,430,620,150,'#7C3AED','نتيجة','لذلك')
    out+='<path d="M430 310V410l-15-20m15 20 15-20" stroke="#64748B" stroke-width="6" fill="none"/>'
    out+=txt(1250,500,'جانبان في علاقة مقارنة',32)
    return out,'بنية النص','بنيتان مختلفتان لتنظيم المعلومات','الصناديق مواضع لبيانات الطلاب وليست أحداثًا. المقارنة لا تتطلب علاقة سببية.','1700 650'
def storyarc5():
    out='<path d="M160 480L1050 160L1500 460" fill="none" stroke="#2563EB" stroke-width="12"/>'
    out+=txt(290,550,'بناء الأحداث',40)+txt(1050,100,'نقطة التأزّم',40)+txt(1460,550,'الحلّ',40)
    out+=txt(850,640,'هيكل للكتابة، لا أحداث قصة جاهزة ولا قياس زمني',30)
    return out,'قالب سردي','من بناء الأحداث إلى الحلّ','خط تخطيطي لتنظيم مراحل الكتابة المذكورة في النموذج. لا يفرض عدد أحداث أو مدة، ولا يكشف حبكة نص القراءة.','1700 710'
def response5():
    out=''
    for x,y,w,h,s,c in [(500,20,700,100,'الرأي: ما الذي أثّر فيّ؟','#2563EB'),(500,155,700,130,'التحليل: التشبيه ومعناه وأثره','#16A34A'),(500,320,700,120,'«اقتباس من النص» (الصفحة: ...)','#D97706'),(500,485,700,100,'الخاتمة: المغزى وصلته بحياتي','#7C3AED')]:out+=box(x,y,w,h,c,s)
    return out,'الاستجابة الأدبية','صفحة تربط الرأي بالدليل','المحتوى بين علامتي التنصيص موضع فارغ وليس اقتباسًا حقيقيًا. يُدخل الطالب ألفاظ النص ورقم صفحته، ثم يفسّر الدليل بدل الاكتفاء بنقله.','1700 650'
def springcave():
    out='<path d="M130 420L450 100L770 420Z" fill="#D6D3D1"/><path d="M330 420V350Q450 180 570 350V420Z" fill="#44403C"/><path d="M960 420Q1050 250 1130 390Q1250 480 1510 490" fill="none" stroke="#0EA5E9" stroke-width="28"/><path d="M900 400Q1030 150 1180 370" fill="none" stroke="#A8A29E" stroke-width="25"/>'
    out+=txt(450,520,'كهف: تجويف في الجبل',38)+txt(1250,570,'نبع: مصدر ماء',38)+txt(850,660,'المعنى الحسي للكلمتين، لا تفسير لرمز القصة',30)
    return out,'معنى حسي','نرى النبع والكهف','رسمان تعريفيان لا موقعان حقيقيان. لا يعني رسم الكهف أن مغزى الأسرة في نص آخر هو كهف مادي.','1700 720'
def rights5():
    out=box(950,150,620,260,'#2563EB','لي حقّ التعلّم','في المدرسة')+box(130,150,620,260,'#16A34A','عليّ احترام النظام','والمعلّمين والزملاء')
    out+='<path d="M780 280H920" stroke="#64748B" stroke-width="7"/>'+txt(850,550,'الحقّ والواجب معًا',44)
    return out,'حقوق وواجبات','علاقتان في المدرسة','خريطة للعبارتين الواردتين بالنص، وليست شرطًا يجعل حق التعلم متوقفًا على أداء واجب.','1700 650'
def chores5():
    out='<rect x="140" y="180" width="560" height="180" rx="20" fill="#DBEAFE" stroke="#2563EB" stroke-width="7"/><rect x="160" y="150" width="130" height="60" rx="15" fill="white"/><path d="M140 350V440M700 350V440" stroke="#2563EB" stroke-width="12"/><path d="M1020 250H1540M1070 250V440M1490 250V440" stroke="#92400E" stroke-width="15"/><ellipse cx="1290" cy="220" rx="100" ry="35" fill="white" stroke="#64748B" stroke-width="6"/>'
    out+=txt(420,530,'أرتّب غرفتي',44)+txt(1280,530,'أرتّب المائدة',44)
    return out,'المساعدة في البيت','مهمّتان من النص','رسمان تمثيليان لأشياء العمل المنزلي، لا صورة لبيت الشخصية أو توزيع حصري لأدوار الأسرة.','1700 650'
def eclipse5():
    out=''
    for y,lunar in [(190,False),(470,True)]:
        out+=txt(1450,y-100,'خسوف القمر' if lunar else 'كسوف الشمس',40)
        out+='<circle cx="230" cy="%d" r="80" fill="#FBBF24"/>'%y
        ex,mx=(830,1300) if lunar else (1300,830)
        out+=f'<circle cx="{ex}" cy="{y}" r="65" fill="#60A5FA"/><circle cx="{mx}" cy="{y}" r="35" fill="#94A3B8"/>'
        if lunar:out+=f'<path d="M875 {y-50}L1390 {y-20}V{y+20}L875 {y+50}Z" fill="#334155" opacity=".28"/>'
        else:out+=f'<path d="M855 {y-28}L1345 {y-8}V{y+8}L855 {y+28}Z" fill="#334155" opacity=".28"/>'
        out+=txt(230,y+115,'الشمس',30)+txt(ex,y+115,'الأرض',30)+txt(mx,y+115,'القمر',30)
    out+=txt(850,680,'ترتيب الأجرام والظلّ فقط؛ الأحجام والمسافات غير متناسبة',29)
    return out,'محاذاة الأجرام','الكسوف والخسوف: من في الوسط؟','المصدر NASA: في الكسوف يقع القمر بين الشمس والأرض، وفي الخسوف تقع الأرض بين الشمس والقمر. التظليل مخطط مبسط لا حدود دقيقة للظل. لا تنظر إلى الشمس مباشرة.','1700 740'
def abilities5():
    out=box(950,100,620,130,'#2563EB','سارة: تكتب القصص')+box(130,100,620,130,'#16A34A','عمر: يحلّ المسائل')
    out+='<rect x="1040" y="280" width="440" height="260" rx="15" fill="white" stroke="#2563EB" stroke-width="5"/>'
    for y,w in [(330,280),(380,330),(430,240),(480,310)]:out+=f'<path d="M1120 {y}h{w}" stroke="#93C5FD" stroke-width="15"/>'
    out+=box(180,300,520,200,'#16A34A','٢ + ٣ = ٥','مثال مسألة')+txt(850,620,'مثالان من النص، لا اختبار لتصنيف الأشخاص',30)
    return out,'مثالان من النص','قصة مكتوبة ومسألة رياضية','خطوط الصفحة تمثل كتابة قصة ولا تقتبس نصًا حقيقيًا. المثال العددي توضيحي لا سؤال تقييم. لا تدل الرسوم على أن لكل إنسان نوعًا ثابتًا أو حصريًا.','1700 690'
def travel6():
    out=box(600,30,500,120,'#102A4C','أسباب السفر')+'<path d="M850 160V205 M230 205H1470 M230 205V260 M640 205V260 M1060 205V260 M1470 205V260" stroke="#64748B" stroke-width="5" fill="none"/>'
    for x,s in [(60,'السياحة'),(470,'الدراسة'),(890,'العلاج'),(1300,'زيارة الأقارب')]:out+=box(x,270,340,210,'#2563EB',s)
    out+=txt(850,600,'أسباب بديلة أو مجتمعة، لا خطوات رحلة',32)
    return out,'أغراض السفر','لماذا يسافر الناس؟','تنظيم لأسباب النص في فروع متساوية، لا تسلسل سببي بينها ولا افتراض أن كل رحلة لها سبب واحد فقط.','1700 680'
def nobel6():
    out=txt(850,65,'مثالان لجائزة نوبل من النص',42)
    out+=box(950,160,620,290,'#2563EB','نجيب محفوظ','الأدب · ١٩٨٨')+box(130,160,620,290,'#16A34A','أحمد زويل','الكيمياء · ١٩٩٩')
    out+=txt(850,585,'اسمان، مجالان، وسنتان؛ لا ميدالية أو صورة شخصية متخيّلة',29)
    return out,'قراءة بيانات','من فاز، وفي أي مجال وسنة؟','جدول بصري لربط اسم الفائز بمجاله وسنته. طابقت الحقائق صفحتي NobelPrize.org الرسميتين، ولا نستخدم صورة غير موثقة للشخصين.','1700 680'
def roleswap7():
    out=txt(1250,70,'الابن / الابنة',42)+txt(440,70,'الأمّ',42)
    out+=box(950,160,620,250,'#2563EB','طبخ الغداء','وترتيب البيت')+box(130,160,620,250,'#16A34A','الذهاب إلى المدرسة','وقراءة قصة للطلاب')
    out+='<path d="M930 235H770l20-15m-20 15 20 15 M770 340H930l-20-15m20 15-20 15" fill="none" stroke="#64748B" stroke-width="7"/>'
    out+=txt(850,565,'تبادل أدوار في هذا اليوم القصصي فقط',34)
    return out,'تبادل الأدوار','من قام بأي عمل في النص؟','تنظيم للأعمال المصرّح بها في القراءة، لا صورة لأسرة حقيقية ولا حكم عام على أدوار أفرادها.','1700 660'
def valley7():
    out='<path d="M80 490L400 100L750 440L940 440L1320 110L1620 490Z" fill="#A8A29E" stroke="#78716C" stroke-width="7"/><path d="M420 300L750 440L940 440L1280 300Z" fill="#E2E8F0"/>'
    for y in [330,370,410]:out+=f'<path d="M{500+(y-330)*2} {y}H{1200-(y-330)*2}" stroke="white" stroke-width="20" stroke-linecap="round"/>'
    out+=txt(850,560,'ضباب يملأ الوادي بين الجبال',42)+txt(850,650,'رسم عام للفكرة، لا صورة لموقع إماراتي معيّن أو لقهوة',30)
    return out,'ضباب الوادي','أين يتجمّع الضباب؟','التضاريس والضباب رسم تخطيطي لا موقع مصور. شرح عام وفق National Weather Service: الهواء البارد الرطب قد يتجمع في الوادي ويتشبع. لا نصور التشبيه بالقهوة كأنه مادة حقيقية.','1700 720'


def work6():
    out=txt(1250,70,'المبرمج',44)+txt(440,70,'المهندس',44)
    out+='<rect x="960" y="150" width="600" height="300" rx="22" fill="#102A4C"/><path d="M1030 220l-35 30 35 30m440-60 35 30-35 30" fill="none" stroke="#86EFAC" stroke-width="9"/><path d="M1100 230h270m-250 60h180m-200 60h250" stroke="#93C5FD" stroke-width="14"/><rect x="140" y="150" width="600" height="300" rx="22" fill="#DBEAFE" stroke="#2563EB" stroke-width="6"/><path d="M230 380V250L400 180L640 280V380Z M400 180V380 M230 380H640" fill="none" stroke="#2563EB" stroke-width="6"/>'
    out+=txt(1250,520,'كتابة برامج',36)+txt(440,520,'تصميم هندسي',36)+txt(850,630,'مثالان للعمل، لا تعريف شامل لكل مهنة أو صورة للذكاء الاصطناعي',28)
    return out,'مجالا عمل','برامج وتصميمات','رسوم أصلية تمثل ناتج عملين مذكورين في النص، لا واجهات برامج حقيقية ولا قصر الهندسة على المباني.','1700 700'
def village6():
    out=box(550,25,600,115,'#102A4C','القرية العالمية: دبي')+box(550,230,600,115,'#2563EB','أجنحة دول مختلفة')
    out+='<path d="M850 145V225 M850 350V390 M290 390H1410 M290 390V430 M850 390V430 M1410 390V430" stroke="#64748B" stroke-width="6" fill="none"/>'
    for x,s in [(50,'بضائع'),(610,'طعام'),(1170,'عروض')]:out+=box(x,440,480,120,'#16A34A',s)
    out+=txt(850,650,'خريطة لتنظيم وصف النص، لا مخطّط الموقع أو أشكال الأجنحة',30)
    return out,'تنظيم الوصف','ماذا نجد في الأجنحة؟','هيكل وصفي من علاقات النص فقط. لا يدّعي شكل أي جناح ولا يعيد رسم معمار محمي، ولا يعرض أسعارًا أو مواعيد حالية.','1700 720'
def volunteer7():
    out=txt(1250,70,'تنظيف الشاطئ',44)+txt(440,70,'القراءة للمسنّين',44)
    out+='<path d="M950 440Q1100 390 1270 440T1570 440" fill="none" stroke="#0EA5E9" stroke-width="20"/><path d="M1160 360l-30-150h220l-30 150Z" fill="#DCFCE7" stroke="#16A34A" stroke-width="6"/><path d="M1170 210Q1240 140 1310 210" fill="none" stroke="#16A34A" stroke-width="8"/><path d="M180 220Q300 170 440 220Q580 170 700 220V410Q580 360 440 410Q300 360 180 410Z" fill="white" stroke="#2563EB" stroke-width="7"/><path d="M440 220V410" stroke="#2563EB" stroke-width="5"/>'
    out+=txt(1250,540,'جمع المخلفات',36)+txt(440,540,'قصص تُقرأ',36)+txt(850,650,'نشاطان مذكوران، لا صورة لأشخاص الحملة',30)
    return out,'عملان تطوعيان','كيف نخدم المجتمع في النص؟','أشياء تدل على الفعلين المحددين: كيس جمع المخلفات وكتاب قصص. لا نخترع وجوه المتطوعين أو كبار السن.','1700 710'
def occupations7():
    out=''
    for x,s,sub,c in [(1160,'الطبيب','رعاية المرضى','#2563EB'),(640,'المزارع','زراعة المحاصيل','#16A34A'),(120,'العامل','الإنتاج والعمل','#D97706')]:out+=box(x,170,420,300,c,s,sub)
    out+=txt(850,90,'مهن مختلفة، وخدمة للمجتمع',44)+txt(850,600,'أمثلة النص، لا ترتيب لقيمة المهن',32)
    return out,'مهن تخدم المجتمع','أعمال مختلفة نتكامل بها','منظم للمهن الواردة بالنص. لا تحدد الرسوم جنس العامل أو تختزل المهن في زي واحد.','1700 680'
def family7():
    out='<rect x="550" y="140" width="600" height="360" rx="20" fill="#DCFCE7" stroke="#16A34A" stroke-width="8"/>'
    for x,y,c in [(640,230,'#2563EB'),(1040,230,'#D97706'),(640,410,'#7C3AED'),(1040,410,'#DC2626')]:out+=f'<circle cx="{x}" cy="{y}" r="32" fill="{c}"/>'
    out+='<path d="M730 200H970V440H730Z" fill="none" stroke="#64748B" stroke-width="8" stroke-dasharray="20 14"/>'
    out+=txt(850,70,'اللعب معًا بلا شاشة',44)+txt(850,590,'مثال لعبة جماعية، لا اللعبة المحدّدة في القصة',32)
    return out,'نشاط عائلي','نرى معنى اللعب الجماعي','لوحة وأربع قطع مثال توضيحي لا ينسب لعبة مسماة إلى الأسرة. النص لا يحدد نوع اللعبة. ناقشوا كيف يشارك الجميع ويتحدثون.','1700 680'
def grandhome7():
    out='<rect x="200" y="200" width="750" height="230" rx="50" fill="#DBEAFE" stroke="#2563EB" stroke-width="7"/><path d="M250 210V360H900V210M260 430V480M890 430V480" fill="none" stroke="#2563EB" stroke-width="8"/><path d="M1110 240H1420V390Q1265 480 1110 390Z" fill="white" stroke="#92400E" stroke-width="7"/><path d="M1420 265Q1540 250 1520 330Q1500 390 1420 365" fill="none" stroke="#92400E" stroke-width="10"/>'
    out+=txt(575,570,'غرفة الجلوس',44)+txt(1280,570,'القهوة مع الجيران',40)+txt(850,670,'أشياء يذكرها النص، لا صورة لبيت الجدّة أو وعاء بعينه',29)
    return out,'مكان الاجتماع','أشياء من بيت الجدّة','رسم تمثيلي لأثاث الجلوس والقهوة، لا تصميم البيت الحقيقي ولا ملامح الشخصيات. الشعور بالأمان يحتاج دليلًا من الكلمات لا الأثاث وحده.','1700 730'
def hurricane7():
    out=txt(850,65,'متابعة التحذير، ثم اتّباع التعليمات',44)
    for y,s,sub,c in [(120,'مركز الأرصاد','يتابع التوقّعات ويحذّر','#2563EB'),(340,'الناس','يتبعون تعليمات الجهات الرسمية','#16A34A')]:out+=box(400,y,900,155,c,s,sub)
    out+='<path d="M850 285V330l-18-22m18 22 18-22" stroke="#64748B" stroke-width="7" fill="none"/>'
    out+=txt(850,610,'نموذج لغوي من النص؛ ليس نشرة طوارئ أو تعليمات لمكانك الآن',29)
    return out,'تحذير واستجابة','من يصدر التحذير؟ وكيف نستجيب؟','مخطط لطرفي علاقة التحذير والاستجابة في القراءة، لا توقع طقس حي. لا نعمم البقاء في البيت إذا أمرت الجهات بالإخلاء.','1700 690'


def youth8():
    out=box(580,20,540,120,'#102A4C','نادي الشباب')+'<path d="M850 145V200M230 200H1470M230 200V245M640 200V245M1060 200V245M1470 200V245" fill="none" stroke="#64748B" stroke-width="5"/>'
    for x,a,b in [(50,'التعليم','مساعدة الزملاء'),(460,'الثقافة','تعلّم التراث'),(880,'الطبيعة','زرع وتقليل نفايات'),(1290,'الصحة','مشي وماء وعناية')]:out+=box(x,255,350,260,'#2563EB',a,b)
    out+=txt(850,625,'أربعة مجالات متوازية في هذا النادي، لا مراحل متتابعة',30)
    return out,'تنظيم أفكار النص','أربعة مجالات للعمل','خريطة وصفية لأعمال النادي المذكورة. لا نربط تعليم التراث بصورة أثر بعينه، ولا نضيف نشاطًا غير مذكور.','1700 700'
def sensor8():
    out=box(1090,190,500,240,'#2563EB','شخص يقترب','من الروبوت')+box(110,190,650,240,'#16A34A','المستشعر يكتشف','اقتراب الشخص')
    out+='<path d="M1060 310H800l28-22m-28 22 28 22" fill="none" stroke="#64748B" stroke-width="9"/>'+txt(850,90,'علاقة مذكورة في وصف روبوت المدرسة',42)+txt(850,600,'مخطط للفكرة، لا شكل الروبوت أو نوع مستشعره',32)
    return out,'سبب واستجابة','ماذا يعرف المستشعر؟','النص يقول إن المستشعر يعرف اقتراب الشخص. لا نحدد نوعه أو مداه ولا نزعم أن كل روبوت يستخدم الذكاء الاصطناعي.','1700 690'
def friend8():
    out=''
    for x,a,b in [(1160,'البداية','غربة وقلة كلام'),(640,'مساندة الزميل','تعريف وكلمات عربية'),(120,'اليوم','صداقة وتعلّم ثقافة')]:out+=box(x,180,420,280,'#2563EB',a,b)
    out+='<path d="M1140 320H1080l22-18m-22 18 22 18 M620 320H560l22-18m-22 18 22 18" fill="none" stroke="#64748B" stroke-width="7"/>'+txt(850,90,'التغيّر في علاقة الراوي بكينجي',44)+txt(850,610,'ترتيب هذه القصة، لا مراحل إلزامية لكل صداقة',32)
    return out,'تغيّر الشخصية','من الغربة إلى الصداقة','الأحداث من القراءة. لا نرسم وجه كينجي أو نعمم سلوكًا على اليابانيين.','1700 690'
def dreamhouse9():
    out='<rect x="270" y="150" width="1160" height="380" rx="16" fill="white" stroke="#102A4C" stroke-width="7"/><path d="M270 340H1430M850 150V530" stroke="#64748B" stroke-width="6"/>'
    out+=txt(850,75,'توزيع الغرف في وصف الراوي',44)+txt(550,230,'الطابق الأول',36)+txt(1150,230,'غرفتي + مكتبة صغيرة',36)+txt(550,425,'الطابق الأرضي',36)+txt(1150,425,'مطبخ + غرفة جلوس',36)+txt(850,630,'منظم للطابقين، لا مخطط معماري أو صورة للمنزل الذكي',30)
    return out,'تنظيم المكان','أين تقع الغرف؟','تقسيم وصفي لا أبعاد أو اتجاهات أو تصميم هندسي. لا نمثل توفير الطاقة بمجرد شكل البيت.','1700 700'
def screen9():
    out=box(960,170,620,280,'#2563EB','اختيار المحتوى','تصنيف عمري + برامج هادفة')+box(120,170,620,280,'#16A34A','تنظيم الوقت','لا يزيد على ساعتين عند الراوي')
    out+=txt(850,80,'جانبان للمشاهدة في النص',44)+txt(850,600,'وصف عادة الراوي، لا حدّ صحي عام لكل عمر',32)
    return out,'مقارنة جانبين','ماذا أختار؟ وكم أشاهد؟','الساعتان عادة الشخصية في القراءة وليستا توصية طبية. لا نخترع شارات تصنيف رسمية أو نحدد برنامجًا مناسبًا.','1700 690'
def remote9():
    out=box(960,170,620,260,'#2563EB','ميزة في التجربة','مرونة التعلّم')+box(120,170,620,260,'#D97706','تحدٍّ في التجربة','تفاعل أقلّ')
    out+=txt(850,80,'جانبان من تجربة التعلّم عن بُعد',44)+txt(850,570,'احتاج الطلاب إلى إنترنت جيّد وتنظيم الوقت',34)+txt(850,640,'وصف تجربة النص، لا حكم على كل منصة أو مدرسة',29)
    return out,'ميزة وتحدٍّ','مرونة أكثر، وتفاعل أقلّ في التجربة','المقارنة تخص تجربة القراءة فقط. لا نعرض حاسوبًا بوصفه صورة لمنصة بعينها.','1700 720'
def responsibility10():
    out=box(960,170,620,260,'#2563EB','قبل القرار','أفكّر في النتيجة')+box(120,170,620,260,'#16A34A','إذا أخطأت','أعترف وأصلح')
    out+=txt(850,80,'موقفان من المسؤولية في النص',44)+txt(850,600,'موقفان مختلفان، لا سلسلة تجعل كل قرار خطأ',32)
    return out,'قرار وتصحيح','كيف أتحمّل المسؤولية؟','رسم شرطي لا زمني بين الموقفين. لا يعني أن حق التعليم مشروط بالاجتهاد.','1700 690'
def jobs10():
    out=box(960,180,620,280,'#2563EB','مهارات رقمية','وتفكير ناقد')+box(120,180,620,280,'#16A34A','تدريب عملي','وفرص للتعلّم')
    out+='<path d="M790 320H910M850 260V380" stroke="#64748B" stroke-width="7"/>'+txt(850,80,'متطلبات واستعداد كما يصفها النص',44)+txt(850,610,'عناصر متكاملة، لا ضمان توظيف أو ترتيب للمهن',32)
    return out,'استعداد للعمل','مهارات وتدريب','لا نؤكد طلبًا حاليًا في سوق العمل ولا نختزل الذكاء الاصطناعي في روبوت. الخريطة تنظم أفكار النص.','1700 690'
def profile10():
    out=''
    for x,a,b in [(1160,'نقاط القوة','تنظيم وتعاون'),(640,'مهارة أطورها','التحدّث أمام الناس'),(120,'حلم للمستقبل','هندسة مدن مستدامة')]:out+=box(x,180,420,300,'#2563EB',a,b)
    out+=txt(850,80,'بطاقة يوسف كما يعرّف نفسه',44)+txt(850,610,'وصف الشخصية في القراءة، لا صورة حقيقية أو اختبار للقدرات',30)
    return out,'تنظيم التعريف بالذات','قوة وتطوير وحلم','ثلاثة جوانب مذكورة وليست مراحل إلزامية. لا نخترع ملامح يوسف أو مدينة مستقبلية وننسبها إليه.','1700 690'
def fair10():
    out=''
    for x,a,b in [(1160,'قدّمت نفسي','طالب يهتم بالتقنية'),(640,'سألت','عن التدريب الصيفي'),(120,'عدت','ببطاقات وعلاقات')]:out+=box(x,180,420,280,'#2563EB',a,b)
    out+='<path d="M1140 320H1080l22-18m-22 18 22 18 M620 320H560l22-18m-22 18 22 18" fill="none" stroke="#64748B" stroke-width="7"/>'+txt(850,80,'أحداث زيارة الراوي إلى معرض الوظائف',44)+txt(850,610,'تسلسل الزيارة في النص، لا وعد بتدريب أو وظيفة',32)
    return out,'تسلسل تجربة','تعريف، سؤال، ثم حصيلة الزيارة','لا ننشئ بطاقة اتصال حقيقية أو نفترض جهة عمل أو قبولًا في تدريب.','1700 690'
def tech10():
    out=txt(850,60,'نربط التقنية بوظيفتها في النص',44)
    for y,a,b in [(120,'الذكاء الاصطناعي','الترجمة والبحث'),(270,'الطباعة ثلاثية الأبعاد','صنع قطع ومجسّمات'),(420,'طائرات بدون طيار','توصيل الطلبات')]:out+=box(970,y,610,115,'#2563EB',a)+box(120,y,610,115,'#16A34A',b)+'<path d="M760 %dH940" stroke="#64748B" stroke-width="6"/>'%(y+58)
    out+=txt(850,635,'أمثلة النص، لا تعريف كامل أو تأكيد توافر خدمة في مكانك',30)
    return out,'تقنية ووظيفة','ما العمل الذي تؤديه التقنية؟','علاقات لغوية من القراءة لا حالة خدمات حية. نتجنب صورة سيارة عادية بوصفها ذاتية القيادة وصورة روبوت بوصفه الذكاء الاصطناعي كله.','1700 710'

SPECS={'AR-Y8-NN-T1-L03':friend8,'AR-Y8-NN-T1-L04':youth8,'AR-Y8-NN-T2-L05':sensor8,'AR-Y9-NN-T1-L01':dreamhouse9,'AR-Y9-NN-T2-L06':screen9,'AR-Y9-NN-T3-L06':remote9,'AR-Y10-NN-T1-L01':responsibility10,'AR-Y10-NN-T1-L07':jobs10,'AR-Y10-NN-T1-L10':profile10,'AR-Y10-NN-T3-L02':fair10,'AR-Y10-NN-T3-L05':tech10,'AR-Y6-NN-T1-L02':work6,'AR-Y6-NN-T1-L09':village6,'AR-Y7-NN-T1-L04':volunteer7,'AR-Y7-NN-T1-L05':occupations7,'AR-Y7-NN-T1-L10':family7,'AR-Y7-NN-T2-L02':grandhome7,'AR-Y7-NN-T3-L05':hurricane7,'AR-Y5-N-T1-L04':goalsteps,'AR-Y5-N-T1-L05':sentenceparts,'AR-Y5-N-T1-L06':infopage,'AR-Y5-N-T1-L14':structures5,'AR-Y5-N-T2-L06':storyarc5,'AR-Y5-N-T3-L15':response5,'AR-Y5-N-T3-L09':springcave,'AR-Y5-NN-T1-L06':rights5,'AR-Y5-NN-T1-L07':chores5,'AR-Y5-NN-T2-L05':eclipse5,'AR-Y5-NN-T3-L05':abilities5,'AR-Y6-NN-T2-L01':travel6,'AR-Y6-NN-T3-L04':nobel6,'AR-Y7-NN-T2-L03':roleswap7,'AR-Y7-NN-T3-L01':valley7,'AR-Y6-NN-T1-L04':barter,'AR-Y6-NN-T1-L10':toylabel,'AR-Y6-NN-T2-L04':resident,'AR-Y7-NN-T1-L08':futurephone,'AR-Y6-N-T1-L22':clocks,'AR-Y6-N-T2-L17':mirage,'AR-Y6-N-T2-L21':simileparts,'AR-Y6-N-T2-L24':vennplay,'AR-Y6-N-T2-L07':echolocation,'AR-Y6-N-T1-L19':offshoot,'AR-Y7-N-T3-L03':ostrich,'AR-Y7-N-T1-L04':glazing,'AR-Y7-N-T2-L06':sandgrouse,'AR-Y7-N-T2-L21':ropeanalogy,'AR-Y7-N-T3-L01':textlayouts,'AR-Y7-N-T2-L14':nestforms,'AR-Y8-N-T1-L14':dam,'AR-Y8-N-T2-L01':letterform,'AR-Y8-N-T2-L09':river,'AR-Y9-N-T1-L18':morphology,'AR-Y9-N-T1-L20':participles,'AR-Y9-N-T2-L04':poeticform,'AR-Y10-N-T3-L08':numbers,'AR-Y12-N-T3-L06':graphene,'AR-Y10-N-T3-L14':pronouns,'AR-Y10-N-T2-L05':flashback,'AR-Y10-N-T3-L05':iceberg,'AR-Y10-N-T1-L08':holography,'AR-Y10-N-T2-L21':opposites,'AR-Y11-N-T1-L23':instrument,'AR-Y11-N-T2-L19':partwhole,'AR-Y11-N-T3-L09':homonym,'AR-Y11-N-T2-L02':categories,'AR-Y11-N-T1-L25':composite,'AR-Y12-N-T1-L09':temporal,'AR-Y12-N-T1-L23':doublemeaning,'AR-Y12-N-T3-L02':poeticform,'AR-Y12-N-T2-L04':muwashshah,'AR-Y12-N-T3-L19':falaj}
def apply_html(code,t):
 fn=SPECS.get(code)
 sid='s4' if code.startswith('AR-Y5-') else ('s5' if '-NN-' in code else 's6')
 if not fn or ('id="'+sid+'d"') in t: return t
 body,label,title,aside,vb=fn()
 m=re.search(r'<section class="sl" id="'+sid+r'"[^>]*>.*?</section>',t,re.S).group()
 a=m.find('<div class="bd cvb2">'); f=m.find('<div class="ft">')
 head=m[:a].replace('id="'+sid+'"','id="'+sid+'d"')
 head=re.sub(r'(<h2 class="ht[^"]*">).*?(</h2>)',lambda x:x.group(1)+title+x.group(2),head,flags=re.S)
 head=re.sub(r'(<span class="pill">).*?(</span>)',lambda x:x.group(1)+'شاهدني'+x.group(2),head,count=1)
 head=re.sub(r'(<span class="pill tm">).*?(</span>)',lambda x:x.group(1)+'⏱ 2 دقيقتان'+x.group(2),head,count=1)
 foot=re.sub(r'<aside>.*?</aside>','<aside>'+aside+'</aside>',m[f:],flags=re.S)
 svg='<div class="bd" data-added="g5plus-diagram"><svg viewBox="0 0 %s" style="width:100%%;height:100%%" role="img" aria-label="%s">%s</svg></div>'%(vb,title,body)
 return t.replace(m,m+head+svg+foot,1)
