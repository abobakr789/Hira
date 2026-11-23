# Adds one explanatory photo slide (id s6p) after s6 of selected native grade 5+ decks. Pure and idempotent;
# called from g1html/shell.py after images.py so regeneration restores it. Photo credits: art/photos/credits.json.
import re
SPECS={
 'AR-Y6-N-T3-L02':dict(
  title='ألمانيا في أوروبا',time='⏱ 2 دقيقتان',
  img='germany-map.png',alt='خريطة موقع ألمانيا بالأحمر في أوروبا، مع خريطة عالم مصغّرة',
  cap='ألمانيا بالأحمر؛ الخريطة الصغيرة توضّح موقع المنطقة',
  credit='الخريطة: <bdi>TUBS</bdi> · <bdi>CC BY-SA 3.0</bdi> · ويكيميديا كومنز',
  aside='خريطة للموقع فقط، وليست خريطة مفاهيم أو مقارنة ثقافية. يضيف الطلاب معلومات موثقة عن المدن والثقافة والإنجازات، ثم يقارنونها بالإمارات.'),

 'AR-Y7-N-T2-L10':dict(
  title='الناي: الآلة قبل قراءة الرمز',time='⏱ 2 دقيقتان',
  img='ney.jpg',alt='ناي قصبي محفوظ في متحف المتروبوليتان، تظهر ثقوب الأصابع وجسمه الأنبوبي',
  cap='<span style="font-size:34px">مثال إيراني من أواخر القرن التاسع عشر<br>ليس آلة الشاعر بعينها</span>',
  credit='الصورة: <bdi>The Metropolitan Museum of Art</bdi> · ملكية عامة · <bdi>89.4.2452</bdi>',
  aside='مثال متحفي للتعرّف إلى هيئة الناي، لا تمثيل لكل أنواعه. وفق المتحف هو آلة نفخ طرفية من القصب. لا نستدل من الصورة وحدها على رمز الروح أو الفن؛ نرجع إلى ألفاظ القصيدة واللحن.'),

 'AR-Y8-N-T2-L12':dict(
  title='أين تقع الهند؟',time='⏱ 2 دقيقتان',
  img='india-map.png',alt='خريطة كروية تبين موقع الهند في جنوب آسيا بلونين أخضرين',
  cap='<span style="font-size:32px">مفتاح المصدر: أخضر داكن = مناطق تسيطر عليها الهند<br>أخضر فاتح = مناطق تطالب بها ولا تسيطر عليها</span>',
  credit='الخريطة: <bdi>Ssolbergj</bdi> · <bdi>CC BY-SA 3.0</bdi> · ويكيميديا كومنز',
  aside='خريطة موقع في جنوب آسيا، لا رسم لعدد السكان ولا حكم على النزاعات الحدودية. نستخدم الخريطة لتحديد المكان، والرسم البياني لمقارنة الأرقام، والنص لشرح الثقافة.'),

 'AR-Y9-N-T3-L02':dict(
  title='أين تقع إندونيسيا؟',time='⏱ 2 دقيقتان',
  img='indonesia-map.png',alt='خريطة تلوّن جزر إندونيسيا بالأحمر وتوضح موقعها في جنوب شرق آسيا',
  cap='إندونيسيا بالأحمر؛ مفتاح الموقع في الخريطة الصغيرة',
  credit='الخريطة: <bdi>TUBS</bdi> · <bdi>CC BY-SA 3.0</bdi> · ويكيميديا كومنز',
  aside='هذه خريطة موقع فقط، لا رسم لعدد السكان. ادمجوا معلومة الموقع مع النص والرسم السكاني في الدرس، واذكروا مصدر كل معلومة.'),

 'AR-Y12-N-T2-L06':dict(
  title='السماور: صورة لأداة يذكرها النص',time='⏱ 2 دقيقتان',
  img='samovar.jpg',alt='سماور معدني بصنبور وإبريق شاي فوقه',
  cap='مثال لسماور، وليس أداة القصة بعينها',
  credit='الصورة: <bdi>Sinikka Halme</bdi> · <bdi>CC BY-SA 4.0</bdi> · ويكيميديا كومنز',
  aside='هذه صورة مثال للسماور في متحف، وليست صورة الأداة الموصوفة في القصة. ما الذي تضيفه معرفة شكل الأداة إلى فهم الوصف؟ وما الدليل النصي على رمزيتها؟'),

 'AR-Y10-N-T1-L09':dict(
  title='حفظ البذور: مثال من سفالبارد',time='⏱ 2 دقيقتان',
  img='seed-vault.jpg',alt='عامل أمام رفوف من صناديق عينات البذور داخل قبو سفالبارد',
  cap='صناديق عينات البذور على رفوف قبو سفالبارد',
  credit='الصورة: <bdi>Dag Endresen / NordGen</bdi> · ملكية عامة · ويكيميديا كومنز',
  aside='مثال بصري إضافي، لا نفترض أنه الموقع المذكور في النص. ماذا تكشف الصناديق والملصقات والرفوف عن حفظ العينات وتنظيمها؟ وما الذي لا يمكن معرفته من الصورة وحدها؟'),

 'AR-Y8-N-T2-L05':dict(
  title='هكذا تبدو السفينة الخشبية',time='⏱ 2 دقيقتان',
  img='dhow.jpg',alt='سفينة خشبية تقليدية الشكل راسية عند رصيف على خور دبي',
  cap='سفينة خشبية تقليدية الشكل على خور دبي',
  credit='الصورة: <bdi>Gaurav Dhwaj Khadka</bdi> · <bdi>CC BY-SA 4.0</bdi> · ويكيميديا كومنز',
  aside='انظروا إلى الصورة: ما أجزاء السفينة التي تظهر؟ وما المادة التي صُنعت منها؟ ثم اربطوا ما ترونه بمصطلح «القلّاف».'),
}
def apply_html(code,t):
 s=SPECS.get(code)
 if not s or 'id="s6p"' in t: return t
 m=re.search(r'<section class="sl" id="s6"[^>]*>.*?</section>',t,re.S).group()
 a=m.find('<div class="bd cvb2">'); f=m.find('<div class="ft">')
 head=m[:a].replace('id="s6"','id="s6p"')
 head=re.sub(r'(<h2 class="ht[^"]*">).*?(</h2>)',lambda x:x.group(1)+s['title']+x.group(2),head,flags=re.S)
 head=re.sub(r'(<span class="pill">).*?(</span>)',lambda x:x.group(1)+'شاهدني'+x.group(2),head,count=1)
 head=re.sub(r'(<span class="pill tm">).*?(</span>)',lambda x:x.group(1)+s['time']+x.group(2),head,count=1)
 foot=re.sub(r'<aside>.*?</aside>','<aside>'+s['aside']+'</aside>',m[f:],flags=re.S)
 body=('<div class="bd" data-added="g5plus-photo" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px">'
  '<figure style="margin:0;display:flex;flex-direction:column;align-items:center;gap:12px">'
  '<img src="../../../art/photos/%s" alt="%s" style="height:560px;max-width:1200px;object-fit:cover;border-radius:28px;box-shadow:0 18px 40px rgba(31,42,60,.18);border:8px solid #fff">'
  '<figcaption style="font-size:44px;font-weight:700;color:#1F2A3C;font-family:inherit">%s</figcaption></figure>'
  '<div style="font-size:24px;color:#5B6678;font-family:Tahoma,sans-serif">%s</div></div>')%(s['img'],s['alt'],s['cap'],s['credit'])
 return t.replace(m,m+head+body+foot,1)
