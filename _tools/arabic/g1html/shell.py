import re, base64
ROOT="/home/claude/Hira/"
IE=open(ROOT+"resources/ie/IE-Y9-N-T1-L08/teacher-deck.html",encoding="utf8").read()
LOGO=re.findall(r'<svg aria-label="شعار حراء".*?</svg>',IE,re.S)[1]
LOGO=re.sub(r'style="width:\d+px;height:\d+px"','style="width:{w}px;height:{h}px"',LOGO,1)
def logo(w=196): return LOGO.replace("{w}",str(w)).replace("{h}",str(round(w*260/653)))
MODE={"m":"site"}
def A(p):
    if MODE["m"]=="site": return "../../../"+p
    mime={"webp":"image/webp","woff2":"font/woff2","png":"image/png","jpg":"image/jpeg"}[p.rsplit(".",1)[1]]
    return f"data:{mime};base64,"+base64.b64encode(open(ROOT+p,"rb").read()).decode()
def page(title,slides,lesson_id,code,deep=False):
    css0=re.findall(r'<style[^>]*>(.*?)</style>',IE,re.S)[0]
    css0=re.sub(r'@font-face\{[^}]*\}\n?','',css0).replace('.sl div:not([style*="display"]){display:flex;flex-direction:column}\n','').replace('.sl p,.sl h1,.sl h2,.sl h3{margin:0}',':where(.sl) :where(p,h1,h2,h3){margin:0}').replace('.sl p{line-height:1.4}.sl h1{line-height:1.1;font-weight:600}.sl h2{line-height:1.15;font-weight:600}.sl h3{line-height:1.2;font-weight:600}',':where(.sl) :where(h1,h2,h3){font-weight:600}')
    fonts=f'''@font-face{{font-family:"Thmanyah Display";src:url("{A('art/fonts/thmanyahserifdisplay-Bold.woff2')}") format("woff2");font-weight:100 900}}
@font-face{{font-family:"Thmanyah Text";src:url("{A('art/fonts/thmanyahseriftext-Medium.woff2')}") format("woff2");font-weight:100 900}}
'''
    CSS=fonts+css0+open(__import__("os").path.join(__import__("os").path.dirname(__file__),"extra.css")).read()
    tb_start=IE.find('<body>')+6; tb_end=IE.find('<div id="wrap">')
    TB=IE[tb_start:tb_end].replace('عرض المعلم · حديث: الدين النصيحة','عرض المعلم · '+title).replace('lesson=e0ea43be-0356-481f-a72d-0885b6d4d80f',('lesson='+lesson_id) if lesson_id else ('code='+code))
    JS=re.findall(r'<script[^>]*>(.*?)</script>',IE,re.S)[0]
    JS=JS.replace("const KEY='hiraa-deck-'+location.pathname;",f"const KEY='hiraa-deck-'+(location.pathname.length>1?location.pathname:'{code}');")
    JS=JS.replace("$('wrap').addEventListener('click',e=>{if(!editing&&!e.target.closest('.nav'))next();});",
     "$('wrap').addEventListener('click',e=>{if(!editing&&!e.target.closest('.nav,[data-ia],video,button'))next();});")
    JS=JS.replace("function show(n,end){","function show(n,end){document.querySelectorAll('video').forEach(v=>v.pause());")
    JS+=r'''
function snd(k){try{SND[k]()}catch(e){}}
function cnt(b){const i=b.querySelector('i');i.textContent=(+i.textContent||0)+1;snd('chime');}
function rst(b){b.closest('.sl').querySelectorAll('.fc i').forEach(i=>i.textContent='0');}
function fb(b,d){const s=b.closest('.sl'),P=[...s.querySelectorAll('.fbk .fsp')];let k=P.findIndex(p=>p.classList.contains('on'));k=Math.max(0,Math.min(P.length-1,k+d));P.forEach((p,j)=>p.classList.toggle('on',j===k));s.querySelector('.fbc2').textContent=(k+1)+' / '+P.length;}
function redraw(box){box.classList.remove('go');void box.offsetWidth;box.classList.add('go');}
function boom(el){snd('clap');const r=el.getBoundingClientRect();for(let k=0;k<26;k++){const s=document.createElement('span');s.className='boom';s.textContent=['🎉','⭐','✨','🌟','💫'][k%5];s.style.left=(r.left+r.width/2)+'px';s.style.top=(r.top+r.height/2)+'px';s.style.setProperty('--x',(Math.random()*900-450)+'px');s.style.setProperty('--y',(Math.random()*-600+100)+'px');document.body.appendChild(s);setTimeout(()=>s.remove(),1500);}}
function fitTx(sl){sl.querySelectorAll('.cv-tx').forEach(d=>{let f=parseFloat(d.style.fontSize)||24,k=0;while(d.scrollHeight>d.clientHeight+2&&f>14&&k<40){f-=1;d.style.fontSize=f+'px';k++;}});}
const _show=show;show=function(n,end){_show(n,end);if(!S[i].dataset.fit){const hid=[...S[i].querySelectorAll('.hid')];hid.forEach(e=>e.classList.remove('hid'));fitTx(S[i]);hid.forEach(e=>e.classList.add('hid'));S[i].dataset.fit=1;}const w=S[i].querySelector('.wbox');if(w)setTimeout(()=>redraw(w),300);};
show((parseInt(location.hash.slice(1))||1)-1);
'''
    dp=(f'<script>window.HIRAA_CODE="{code}";</script><script src="../deepen.js"></script>' if deep else "")
    return f'''<!doctype html><html lang="ar"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>عرض المعلم · {title} · حراء</title>
<style>{CSS}</style></head><body>{TB}<div id="wrap"><div id="stage">{slides}
</div><button class="nav" id="nP" title="السابق">›</button><button class="nav" id="nN" title="التالي">‹</button></div>
<div id="notes"></div><div id="timer"></div><div id="att">👀 انْتَبِهوا</div><div id="toast"></div>
{dp}<script>window.__boot=function(){{{JS}
Object.assign(window,{{show,next,prev,snd,cnt,rst,redraw,boom,fb}});window.S=S;}};if(!window.HIRAA_DEEP||window.__bootWanted){{window.__booted=1;window.__boot();}}</script></body></html>'''
