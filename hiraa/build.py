import os
src=os.path.dirname(os.path.abspath(__file__))+'/'
OUT=os.path.dirname(src.rstrip('/'))+'/index.html'
html=open(src+'index.html').read(); css=open(src+'assets/style.css').read(); app=open(src+'assets/app.js').read()
# ساحة الألعاب: محرّك مستقلّ يُدمج قبل التطبيق
css+='\n'+open(src+'assets/arcade.css').read(); app=open(src+'assets/arcade.js').read()+'\n'+app
# معارج حراء: وحدة دورات المهارات، تُدمج قبل التطبيق
css+='\n'+open(src+'assets/maarij.css').read(); app=open(src+'assets/maarij.js').read()+'\n'+app
# المسار التشخيصي: خريطة المتطلبات (data/prereqs-islamic.json) تُضمَّن قبل الوحدة
import json
_pre=json.load(open(os.path.dirname(src.rstrip('/'))+'/data/prereqs-islamic.json',encoding='utf-8'))
css+='\n'+open(src+'assets/diagnostic.css').read()
_pra=json.load(open(os.path.dirname(src.rstrip('/'))+'/data/prereqs-arabic.json',encoding='utf-8'))
_dump=lambda o:json.dumps(o,ensure_ascii=False,separators=(',',':'))
app='window.HIRAA_PREREQ='+_dump(_pre)+';window.HIRAA_PREREQS={islamic:window.HIRAA_PREREQ,arabic:'+_dump(_pra)+'};\n'+open(src+'assets/diagnostic.js').read()+'\n'+app
# بطاقة الآية: آية اليوم وآيات كل درس
css+='\n'+open(src+'assets/verse.css').read(); app=open(src+'assets/verse.js').read()+'\n'+app
# واحة الطالب: تقدّمه في مشهد واحة
css+='\n'+open(src+'assets/oasis.css').read(); app=open(src+'assets/oasis.js').read()+'\n'+app
# مدارج القراءة: تُحقن داخل app.js في موضع العلامة فتشارك دواله
assert '  //@@READING@@\n' in app; app=app.replace('  //@@READING@@\n', open(src+'assets/reading.js').read()+'\n')
anon="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzYmt0amJ3anlrZ3Rra3FmYmxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM1NDc2MTYsImV4cCI6MjEwOTEyMzYxNn0.ZR43uZNPdpnw8vhEf5Qr2ThHjRTZC2seCICDjiMfeW8"
config=f'''// المفتاح العام (anon) آمن للنشر؛ الصلاحيات مفروضة من قاعدة البيانات. لا تضع هنا مفتاح service_role.
window.HIRAA_CONFIG = {{ supabaseUrl: "https://vsbktjbwjykgtkkqfblj.supabase.co", supabaseKey: "{anon}" }};
window.addEventListener("error", function (e) {{
  var m = document.getElementById("main");
  if (m && !m.innerHTML.trim()) m.innerHTML = '<div class="wrap loading">حدث خطأ في تشغيل الصفحة: ' + String(e.message).replace(/[<>&]/g, "") + '</div>';
}});'''
html=html.replace('<link rel="stylesheet" href="assets/style.css">','<style>\n'+css+'\n</style>')
html=html.replace('<script src="assets/config.js"></script>','<script>\n'+config+'\n</script>')
html=html.replace('<script src="assets/app.js"></script>','<script>\n'+app+'\n</script>')
assert 'assets/' not in html
open(OUT,'w').write(html)
print('built', len(html))
