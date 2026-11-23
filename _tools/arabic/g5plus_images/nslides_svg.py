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
SPECS={'AR-Y9-N-T1-L18':morphology,'AR-Y9-N-T1-L20':participles,'AR-Y9-N-T2-L04':poeticform,'AR-Y10-N-T3-L08':numbers,'AR-Y12-N-T3-L06':graphene,'AR-Y10-N-T3-L14':pronouns,'AR-Y10-N-T2-L05':flashback,'AR-Y10-N-T3-L05':iceberg,'AR-Y10-N-T1-L08':holography,'AR-Y10-N-T2-L21':opposites,'AR-Y11-N-T1-L23':instrument,'AR-Y11-N-T2-L19':partwhole,'AR-Y11-N-T3-L09':homonym,'AR-Y11-N-T2-L02':categories,'AR-Y11-N-T1-L25':composite,'AR-Y12-N-T1-L09':temporal,'AR-Y12-N-T1-L23':doublemeaning,'AR-Y12-N-T3-L02':poeticform,'AR-Y12-N-T2-L04':muwashshah,'AR-Y12-N-T3-L19':falaj}
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
