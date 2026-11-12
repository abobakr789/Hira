const fs=require('fs');const d=JSON.parse(fs.readFileSync('resources/slides/'+(process.env.DECK||'AR-Y1-N-T3-L08')+'.json','utf8'));
const X=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;');const base='file:///home/claude/hira/';
const FX=e=>`${e.grad?`background:linear-gradient(${+e.gdir||135}deg,#${e.fill},#${e.grad});`:''}${e.shadow?`box-shadow:${e.shadow==='hard'?`7px 7px 0 #${e.sc||'1E3A3F'}`:'0 12px 30px rgba(20,30,40,.16)'};`:''}${e.rot?`transform:rotate(${+e.rot}deg);`:''}${e.radius?`border-radius:${+e.radius}px;`:''}${e.op!=null?`opacity:${+e.op};`:''}`;
const THEME={'1E3A3F':{a:'#0F6E72',g1:'#FFFFFF',g2:'#F2FAF4',sh:'rgba(15,110,114,.18)'},'FDF1DC':{a:'#C4873A',g1:'#FFFFFF',g2:'#FFF6E4',sh:'rgba(196,135,58,.20)'},'EAF5F4':{a:'#0F6E72',g1:'#FFFFFF',g2:'#F2FAF4',sh:'rgba(15,110,114,.18)'},'F3E9FB':{a:'#6B46A8',g1:'#FFFFFF',g2:'#F7F1FD',sh:'rgba(107,70,168,.18)'},'FBF6EC':{a:'#B4532A',g1:'#FFFFFF',g2:'#FDF1EA',sh:'rgba(180,83,42,.16)'},'E9F3E6':{a:'#2F8F57',g1:'#FFFFFF',g2:'#EFFAF1',sh:'rgba(47,143,87,.18)'},'FCE8E4':{a:'#C9553A',g1:'#FFFFFF',g2:'#FFF0ED',sh:'rgba(201,85,58,.18)'}};
const DEF={a:'#0F6E72',g1:'#FFFFFF',g2:'#F6F3EC',sh:'rgba(20,30,40,.14)'};
const DECOR=['blobs','ring','dots','blobs2'];
function decorHtml(si,th){const v=DECOR[si%4];const a=th.a;
 if(v==='blobs')return `<div class="e" style="left:-90px;top:-90px;width:260px;height:260px;border-radius:50%;background:${a};opacity:.10"></div><div class="e" style="right:-70px;bottom:-110px;width:300px;height:300px;border-radius:50%;background:${a};opacity:.08"></div>`;
 if(v==='ring')return `<div class="e" style="right:-110px;top:-110px;width:260px;height:260px;border-radius:50%;border:14px solid ${a};opacity:.14"></div><div class="e" style="left:-80px;bottom:-100px;width:220px;height:220px;border-radius:50%;background:${a};opacity:.08"></div>`;
 if(v==='dots'){let dots='';for(let i=0;i<15;i++)dots+=`<span style="width:7px;height:7px;border-radius:50%;background:${a};opacity:${i%3===0?.5:.22};display:block"></span>`;
  return `<div class="e" style="left:1150px;top:470px;display:grid;grid-template-columns:repeat(5,1fr);gap:14px">${dots}</div><div class="e" style="left:-100px;bottom:-130px;width:280px;height:280px;border-radius:50%;background:${a};opacity:.09"></div>`;}
 return `<div class="e" style="right:-60px;top:260px;width:170px;height:170px;border-radius:50%;background:${a};opacity:.10"></div><div class="e" style="left:-110px;top:-80px;width:230px;height:230px;border-radius:50%;background:${a};opacity:.08"></div>`;}
let h=`<html><head><meta charset="utf-8"><style>
@font-face{font-family:'ThmanyahDisplay';font-weight:800;src:url('${base}art/fonts/thmanyahserifdisplay-Black.woff2') format('woff2')}
@font-face{font-family:'ThmanyahDisplay';font-weight:700;src:url('${base}art/fonts/thmanyahserifdisplay-Bold.woff2') format('woff2')}
@font-face{font-family:'ThmanyahText';font-weight:400;src:url('${base}art/fonts/thmanyahseriftext-Regular.woff2') format('woff2')}
@font-face{font-family:'ThmanyahText';font-weight:600;src:url('${base}art/fonts/thmanyahseriftext-Medium.woff2') format('woff2')}
body{margin:0;background:#777}.s{position:relative;width:1280px;height:720px;margin:8px;overflow:hidden;border-radius:22px}
.e{position:absolute;box-sizing:border-box}.tx{display:flex;padding:4px 10px;line-height:1.55;white-space:pre-wrap;overflow:hidden;font-family:'ThmanyahText',"Readex Pro",sans-serif}
</style></head><body>`;
d.slides.forEach((s,si)=>{const bgHex=String(s.bg||'FFFFFF');
const lum=(hx=>{hx=String(hx||'FFFFFF');return .299*parseInt(hx.slice(0,2),16)+.587*parseInt(hx.slice(2,4),16)+.114*parseInt(hx.slice(4,6),16)})(bgHex);
const th=THEME[bgHex]||DEF;
const els=s.els.concat([{k:'pic',x:24,y:672,w:132,h:36,src:lum<110?'art/brand/hiraa-lockup-on-dark.svg':'art/brand/hiraa-lockup-light.svg'}]);
h+=`<div class="s" style="background:${s.bg2?`linear-gradient(160deg,#${s.bg},#${s.bg2})`:'#'+bgHex}">`+decorHtml(si,th)+els.map(e=>{const pos=`left:${e.x}px;top:${e.y}px;width:${e.w}px;height:${e.h}px;`;
if(e.k==='shape'){
 if(e.fill==='FFFDF8'&&e.line)return `<div class="e" style="${pos}background:linear-gradient(160deg,${th.g1},${th.g2});border:2.5px solid #${e.line}aa;border-radius:20px;box-shadow:0 14px 28px ${th.sh};${FX(e)}"></div>`;
 if((e.fill==='EAF5F4'||e.fill==='F2FAF4'||e.fill==='FFFDF8')&&!e.line)return `<div class="e" style="${pos}background:linear-gradient(160deg,${th.g1},${th.g2});border-radius:${e.oval?'50%':e.rad?'18px':'0'};box-shadow:0 8px 18px ${th.sh};${FX(e)}"></div>`;
 return `<div class="e" style="${pos}background:#${e.fill};${e.line?`border:${Math.max(2,Math.round((e.lw||1.5)*1.8))}px solid #${e.line};`:''}border-radius:${e.oval?'50%':e.rad?'16px':'0'};${FX(e)}"></div>`;}
if(e.k==='pic')return `<img class="e" src="${base+e.src}" style="${pos}object-fit:${e.cover?'cover':'contain'};${e.rad?'border-radius:18px;':''}${e.frame?`background:#fff;padding:${e.frame}px;`:''}${FX(e)}">`;
if(e.k==='img')return `<div class="e" style="${pos}font-size:${Math.round(e.h*.82)}px;text-align:center;line-height:1">${e.emo}</div>`;
const rtl=/[\u0600-\u06FF]/.test(e.text||'');const jc=e.align==='center'?'center':((e.align==='left')===rtl?'flex-end':'flex-start');
const isHeading=(e.size||0)>=32;const ff=isHeading?"'ThmanyahDisplay',serif":"'ThmanyahText',sans-serif";
const weight=(e.bold&&e.size>=40)?800:(e.bold?700:400);
let fillCss=e.fill?`background:#${e.fill};`:'';
if(e.fill==='F2FAF4')fillCss=`background:linear-gradient(160deg,#F2FAF4,#E3F6E8);box-shadow:0 6px 14px rgba(47,143,87,.15);`;
return `<div class="e tx" dir="${rtl?'rtl':'ltr'}" style="${pos}font-size:${e.size}px;color:#${e.color};font-weight:${weight};font-family:${ff};line-height:${isHeading?1.35:1.55};justify-content:${jc};text-align:${e.align||'start'};align-items:${e.va==='top'?'flex-start':'center'};${fillCss}${e.rad?'border-radius:14px;':''}${FX(e)}">${X(e.text)}</div>`}).join('');
const headEl=s.els.find(e=>e.k==='text'&&e.size===34&&e.bold);
if(headEl)h+=`<div class="e" style="left:${headEl.x}px;top:${headEl.y+headEl.h-6}px;width:120px;height:8px;background:${th.a};border-radius:6px"></div>`;
h+=`</div>`;});
fs.writeFileSync('/tmp/deck.html',h+'</body></html>');
