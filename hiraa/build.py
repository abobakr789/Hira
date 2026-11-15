import os
src=os.path.dirname(os.path.abspath(__file__))+'/'
OUT=os.path.dirname(src.rstrip('/'))+'/index.html'
html=open(src+'index.html').read(); css=open(src+'assets/style.css').read(); app=open(src+'assets/app.js').read()
# ساحة الألعاب: محرّك مستقلّ يُدمج قبل التطبيق
css+='\n'+open(src+'assets/arcade.css').read(); app=open(src+'assets/arcade.js').read()+'\n'+app
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
