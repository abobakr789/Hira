# Adds one explanatory diagram slide (id s6d) after s6 of AR-Y7-N-T1-L21. Idempotent; run as the final step after any rebuild, after images.py.
import re,sys
code='AR-Y7-N-T1-L21'
p=f'/tmp/Hira/resources/ar/{code}/teacher-deck.html'
t=open(p).read()
if 'id="s6d"' in t: sys.exit('already')
m=re.search(r'<section class="sl" id="s6"[^>]*>.*?</section>',t,re.S).group()
a=m.find('<div class="bd cvb2">')
f=m.rfind('<div class',0,m.find('<span>الْبَرَاجِيلُ'))
# footer starts at div containing the label; find its opening by walking back to the footer div
foot_start=m.find('<div class="ft">')
# the label span sits inside a div; verify
head=m[:a]; foot=m[foot_start:]
head=head.replace('id="s6"','id="s6d"').replace('السبب والنتيجة في عمل البرجيل','كيف يعمل البرجيل؟').replace('شاهدني أطبّق','شاهدني').replace('⏱ 6 دقائق','⏱ 2 دقيقتان')
foot=re.sub(r'<aside>.*?</aside>','<aside>رسم توضيحي: تتبّع الأسهم من الرياح إلى النتيجة، وربط كل خطوة بلون البطاقة في الشريحة السابقة.</aside>',foot,flags=re.S)
F='font-family="Thmanyah Display,Tahoma,sans-serif" font-weight="700"'
def step(n,x,y,c): return f'<circle cx="{x}" cy="{y}" r="26" fill="{c}"/><text x="{x}" y="{y+11}" text-anchor="middle" font-size="32" fill="#fff" {F}>{n}</text>'
svg=f'''<div class="bd" data-added="g5plus-diagram"><svg viewBox="0 0 1700 700" style="width:100%;height:100%" role="img" aria-label="مقطع في بيت ببرجيل: الرياح تدخل من أعلى البرجيل فتنزل الهواء البارد إلى الغرف ويخرج الهواء الحار من الجهة الأخرى">
<defs><marker id="ab" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#2563EB"/></marker><marker id="ag" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#16A34A"/></marker><marker id="ao" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#EA580C"/></marker></defs>
<rect x="420" y="650" width="1000" height="14" rx="7" fill="#D9C7B0"/>
<rect x="640" y="400" width="560" height="250" fill="#fff" stroke="#102A4C" stroke-width="6"/>
<rect x="800" y="110" width="160" height="290" fill="#fff" stroke="#102A4C" stroke-width="6"/>
<line x1="880" y1="110" x2="880" y2="400" stroke="#102A4C" stroke-width="4" stroke-dasharray="10 8"/>
<rect x="794" y="170" width="12" height="90" fill="#FCF1F3"/><rect x="954" y="170" width="12" height="90" fill="#FCF1F3"/>
<path d="M420 215 L784 215" stroke="#2563EB" stroke-width="14" fill="none" marker-end="url(#ab)"/>
<path d="M840 190 L840 340 Q840 480 740 520" stroke="#16A34A" stroke-width="14" fill="none" marker-end="url(#ag)"/>
<path d="M1060 560 Q920 540 920 420 L920 160 Q920 90 1000 80 L1180 80" stroke="#EA580C" stroke-width="14" fill="none" marker-end="url(#ao)"/>
<text x="560" y="170" font-size="46" fill="#2563EB" text-anchor="middle" {F}>الرياح</text>
<text x="1360" y="150" font-size="42" fill="#EA580C" text-anchor="middle" {F}>الهواء الحار يخرج</text>
<text x="880" y="615" font-size="38" fill="#16A34A" text-anchor="middle" {F}>هواء أبرد في الغرفة</text>
<text x="470" y="500" font-size="40" fill="#7C3AED" text-anchor="middle" {F}>بيت أبرد</text><text x="470" y="550" font-size="40" fill="#7C3AED" text-anchor="middle" {F}>بلا كهرباء</text>
{step(1,520,275,"#2563EB")}{step(2,770,300,"#16A34A")}{step(3,1030,330,"#EA580C")}{step(4,470,440,"#7C3AED")}
</svg></div>'''
new=head+svg+foot
t=t.replace(m,m+new,1)
open(p,'w').write(t)
print('ok',foot_start>a)
