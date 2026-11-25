/* ================= محطات التربية الإسلامية: محرّك أجزاء (من الكتاب المدرسي وعرض المعلم) =================
   كل محطة قائمة أجزاء تُعرض بالترتيب؛ الجزء التفاعلي ينتظر حتى يُنجَز، ثم يظهر ما بعده.
   وفي آخر المحطة وسامها (crit) إن كان لها وسام، ثم «أضاء القنديل». */
window.__ownBook=true;BOOK=D.book||null;
const pimg=n=>`<img src="${IMG}${n}.webp" alt="" loading="lazy">`;
const vis=c=>c.img?pimg(c.img):`<span style="font-size:76px;line-height:1">${c.e||"✨"}</span>`;
const PART={
 inst(el,x,go){el.appendChild(h(`<div class="inst reveal"><span class="ic">${x.ic||"📌"}</span>${x.text}</div>`));go()},
 list(el,x,go){el.appendChild(h(`<div class="card reveal" style="background:#F4FAFF"><${x.ordered?"ol":"ul"} class="bq">${x.items.map(q=>`<li>${q}</li>`).join("")}</${x.ordered?"ol":"ul"}></div>`));go()},
 imgs(el,x,go){el.appendChild(h(`<div class="rv-grid ${x.imgs.length===4?"four":""} reveal">${x.imgs.map(n=>`<div class="rv open still"><div class="rv-pic">${pimg(n)}</div></div>`).join("")}</div>`));go()},
 text(el,x,go){el.appendChild(h(`<div class="card reveal txtcard"${x.tone?` style="background:${x.tone}"`:""}>${x.head?`<h4>${x.head}</h4>`:""}<p>${x.html}</p></div>`));go()},
 concl(el,x,go){el.appendChild(h(`<div class="concl reveal">${x.html}</div>`));go()},
 words(el,x,go){const g=h(`<div class="reveal"><div class="inst"><span class="ic">📘</span>${x.head||"مَعاني الْمُفْرَداتِ: أَلْمِسُ الْكَلِمَةَ لِأَعْرِفَ مَعْناها."}</div><div class="wd-grid">${x.items.map((w,i)=>`<button class="wd" data-i="${i}"><b>${w[0]}</b><span>${w[1]}</span></button>`).join("")}</div></div>`);el.appendChild(g);
  let n=0;g.querySelectorAll(".wd").forEach(b=>b.onclick=()=>{if(b.classList.contains("open"))return;b.classList.add("open");tone(true);const w=x.items[+b.dataset.i];if(!S.words.includes(w[0])){S.words.push(w[0]);save()}n++;if(n===x.items.length)go()})},
 build(el,x,go){buildWords(el,x.items,go)},
 reveal(el,x,go){if(x.head)el.appendChild(h(`<div class="inst reveal"><span class="ic">🔎</span>${x.head}</div>`));
  const g=h(`<div class="rv-grid ${x.cards.length===4?"four":""}">${x.cards.map((c,i)=>`<button class="rv${c.img?"":" emo"}" data-i="${i}"><div class="rv-pic">${vis(c)}</div><div class="rv-q">${c.q}</div><div class="rv-a">${c.a}</div></button>`).join("")}</div>`);el.appendChild(g);
  let n=0;g.querySelectorAll(".rv").forEach(b=>b.onclick=()=>{if(b.classList.contains("open"))return;b.classList.add("open");tone(true);n++;if(n===x.cards.length)go()})},
 mcq(el,x,go,ctx){const c=h(`<div class="card reveal" style="margin-top:16px">${x.img?`<div class="mq-img">${pimg(x.img)}</div>`:""}<h3 style="font-size:26px;color:var(--navy);line-height:1.7">${x.q}</h3></div>`);el.appendChild(c);c.scrollIntoView({behavior:"smooth",block:"center"});
  mcq(c,{id:ctx.id+"-"+ctx.k,q:x.q,o:x.o,a:x.a,st:ctx.id,hint:x.h||"ارْجِعْ إِلى ما تَعَلَّمْتَهُ في هذِهِ الْمَحَطَّةِ.",onDone:()=>{if(x.after)c.appendChild(h(`<div class="concl reveal">${x.after}</div>`));setTimeout(go,600)}})},
 tf(el,x,go,ctx){const c=h(`<div class="card reveal"><h3 style="font-size:24px;color:var(--navy)">${x.q||"أَضَعُ ✓ أَمامَ الْعِبارَةِ الصَّحيحَةِ، وَ✗ أَمامَ الْخَطَأِ."}</h3>${x.items.map((it,i)=>`<div class="tf-row" data-i="${i}"><span class="tf-t">${it.t}</span><button class="tf-b" data-v="1">✓</button><button class="tf-b" data-v="0">✗</button></div>`).join("")}</div>`);el.appendChild(c);c.scrollIntoView({behavior:"smooth",block:"center"});
  let n=0,miss=0;c.querySelectorAll(".tf-row").forEach(r=>{const it=x.items[+r.dataset.i];r.querySelectorAll(".tf-b").forEach(b=>b.onclick=()=>{if(r.dataset.done)return;
   if(+b.dataset.v===(it.ok?1:0)){r.dataset.done=1;r.classList.add("ok");b.classList.add("on");tone(true);if(!it.ok&&it.fix)r.insertAdjacentHTML("beforeend",`<div class="tf-fix">${it.fix}</div>`);n++;if(n===x.items.length){firstTry(ctx.id+"-tf",miss===0);say(praise(),"cheer",2200);setTimeout(go,700)}}
   else{miss++;r.classList.add("shake");setTimeout(()=>r.classList.remove("shake"),500);tone(false);if(miss<=2)addMistake(ctx.id,"صَوابٌ أَمْ خَطَأٌ؟ «"+it.t+"»",it.ok?["صَوابٌ","خَطَأٌ"]:["خَطَأٌ","صَوابٌ"],0,"");say("فَكِّرْ مَرَّةً أُخْرى في هذِهِ الْعِبارَةِ.","think",2600)}})})},
 cmap(el,x,go,ctx){const w=h(`<div class="reveal" style="margin-top:20px"><div class="inst"><span class="ic">🗺️</span>${x.head||"أُنَظِّمُ مَفاهيمي"}</div>
   <div class="cmap"><div class="cm-root">${x.root}</div><div class="cm-slots">${x.ok.map((_,i)=>`<div class="cm-slot" data-i="${i}"></div>`).join("")}</div></div>
   <div class="chips" style="margin-top:16px">${shuffle(x.ok.map(t=>({t,ok:1})).concat((x.no||[]).map(t=>({t,ok:0})))).map(y=>`<button class="chip" data-ok="${y.ok}">${y.t}</button>`).join("")}</div></div>`);
  el.appendChild(w);w.scrollIntoView({behavior:"smooth",block:"start"});let n=0,miss=0;
  w.querySelectorAll(".chips .chip").forEach(b=>b.onclick=()=>{if(b.dataset.ok==="1"){const s=w.querySelectorAll(".cm-slot")[n];s.textContent=b.textContent;s.classList.add("on");b.remove();n++;tone(true);
    if(n===x.ok.length){firstTry(ctx.id+"-map",miss===0);const ch=w.querySelector(".chips");if(ch)ch.style.display="none";setTimeout(go,600)}}
   else{miss++;b.classList.add("shake");setTimeout(()=>b.classList.remove("shake"),500);tone(false);if(miss===1)addMistake(ctx.id,"أَيُّها لا يُناسِبُ «"+x.root+"»؟",[b.textContent].concat(x.ok.slice(0,2)),0,b.textContent);say(x.why||"هذِهِ لا تُناسِبُ الْخَريطَةَ. فَكِّرْ مَرَّةً أُخْرى.","think",4200)}})},
 pick(el,x,go,ctx){el.appendChild(h(`<div class="inst reveal" style="margin-top:20px"><span class="ic">✅</span>${x.q}</div>`));
  const items=x.items,g=h(`<div class="pk"><div class="pk-grid">${items.map((it,i)=>`<button class="pk-i" data-i="${i}">${it.img?pimg(it.img):`<span class="pk-t">${it.t}</span>`}<span class="pk-m"></span></button>`).join("")}</div><div class="center" style="margin-top:16px"><button class="btn gold pk-go">تَحَقَّقْ ✓</button></div></div>`);el.appendChild(g);
  const sel=new Set();let tries=0,done=false;
  g.querySelectorAll(".pk-i").forEach(b=>b.onclick=()=>{if(done)return;const i=+b.dataset.i;sel.has(i)?sel.delete(i):sel.add(i);b.classList.toggle("sel");b.classList.remove("no")});
  g.querySelector(".pk-go").onclick=()=>{if(done)return;tries++;let ok=true;
   g.querySelectorAll(".pk-i").forEach(b=>{const i=+b.dataset.i,should=!!items[i].ok,has=sel.has(i);b.classList.remove("ok","no");if(should&&has)b.classList.add("ok");else if(has&&!should){b.classList.add("no");ok=false}else if(should&&!has)ok=false});
   if(ok){done=true;firstTry(ctx.id+"-pick"+ctx.k,tries===1);tone(true);say(praise(),"cheer",2500);g.querySelector(".pk-go").remove();setTimeout(go,700)}
   else{tone(false);if(tries===1){const bad=items.filter(y=>!y.ok)[0],good=items.filter(y=>y.ok).slice(0,2);if(bad)addMistake(ctx.id,"أَيُّها لا يُناسِبُ؟ ("+x.q.replace(/^[^:]*:\s*/,"")+")",[bad.t].concat(good.map(y=>y.t)),0,"")}say("انْظُرْ مَرَّةً أُخْرى: بَعْضُها لَمْ تَخْتَرْهُ، أَوِ اخْتَرْتَ ما لا يُناسِبُ.","think",4200)}}},
 share(el,x,go){el.appendChild(h(`<div class="card reveal" style="margin-top:20px;background:linear-gradient(135deg,#FFF8EC,#fff)"><div class="inst" style="margin-top:0"><span class="ic">💬</span>${x.head}</div>${x.lines.map(s=>`<p class="say">${s}</p>`).join("")}</div>`));go()},
 record(el,x,go){retellBox(el,x.title||"أَقولُها بِصَوْتي.",x.hint||"أَقْرَأُ بِصَوْتٍ واضِحٍ.",go)},
 ayah(el,x,go){const a=h(`<div class="card reveal ayah-card" style="margin-top:20px"><div class="inst" style="margin-top:0"><span class="ic">📖</span>${x.head}</div>${x.lines.map(l=>`<p class="ayah">${l}</p>`).join("")}${x.ref?`<p class="ref">${x.ref}</p>`:""}${x.note?`<p style="font-size:21px;margin:6px 0 0;color:#6b5a35">${x.note}</p>`:""}<div class="center" style="margin-top:12px"><button class="btn gold ay-ok">${x.btn||"تَلَوْتُها ✓"}</button></div></div>`);
  el.appendChild(a);a.scrollIntoView({behavior:"smooth",block:"center"});a.querySelector(".ay-ok").onclick=()=>{a.querySelector(".ay-ok").remove();tone(true);go()}},
 /* الحفظ والتسميع: تُخفى كلمات الآيات تدريجيًّا (ربع، نصف، ثلاثة أرباع، كلها)، والطالب يسمّع ثم يكشف */
 memorize(el,x,go,ctx){const lv=[0,.25,.5,.75,1],lvName=["أَقْرَأُ مَعَ التِّلاوَةِ","أُسَمِّعُ: رُبْعُ الْكَلِماتِ مَخْفِيٌّ","أُسَمِّعُ: نِصْفُ الْكَلِماتِ مَخْفِيٌّ","أُسَمِّعُ: ثَلاثَةُ أَرْباعٍ مَخْفِيَّةٌ","أُسَمِّعُ السّورَةَ كُلَّها"];
  const words=x.ayat.map(a=>a.split(/\s+/));const c=h(`<div class="card reveal mem"><div class="inst" style="margin-top:0"><span class="ic">🧠</span>${x.head}</div><div class="mem-lv"></div><div class="mem-txt"></div><div class="center mem-act"></div></div>`);el.appendChild(c);c.scrollIntoView({behavior:"smooth",block:"start"});
  S.memLevel=S.memLevel||{};let L=Math.min(S.memLevel[ctx.id]||0,4);
  const fr=(i,j)=>{const v=Math.sin(i*12.9898+j*78.233)*43758.5453;return v-Math.floor(v)};
  const cand=[];words.forEach((ws,i)=>ws.forEach((w,j)=>{if(!/^[﴿﴾\d٠-٩()]+$/.test(w))cand.push([i,j])}));
  cand.sort((a,b)=>fr(a[0],a[1])-fr(b[0],b[1]));const rank={};cand.forEach((c,r)=>rank[c[0]+"-"+c[1]]=r);
  const hidden=(i,j)=>{const r=rank[i+"-"+j];return r!=null&&r<Math.round(cand.length*lv[L])};
  const draw=()=>{c.querySelector(".mem-lv").innerHTML=lv.map((_,i)=>`<span class="${i<L?"done":i===L?"cur":""}">${i===0?"📖":i}</span>`).join("")+`<b>${lvName[L]}</b>`;
   c.querySelector(".mem-txt").innerHTML=words.map((ws,i)=>`<p class="ayah">${ws.map((w,j)=>!hidden(i,j)?`<span>${w}</span>`:`<span class="hid" tabindex="0">${w}</span>`).join(" ")}</p>`).join("");
   c.querySelectorAll(".hid").forEach(s=>s.onclick=()=>s.classList.add("peek"));
   c.querySelector(".mem-act").innerHTML=L===0?`<button class="btn gold m-go">قَرَأْتُها، أَبْدَأُ التَّسْميعَ ←</button>`:`<button class="btn ghost m-show">👁️ أَكْشِفُ الْكَلِماتِ</button> <button class="btn gold m-go">${L<4?"سَمَّعْتُها، الْمُسْتَوى التّالي ←":"سَمَّعْتُ السّورَةَ كُلَّها ✓"}</button>`;
   const sh=c.querySelector(".m-show");if(sh)sh.onclick=()=>c.querySelectorAll(".hid").forEach(s=>s.classList.add("peek"));
   c.querySelector(".m-go").onclick=()=>{tone(true);if(L<4){L++;S.memLevel[ctx.id]=L;save();draw();say(L===4?"الْمُسْتَوى الْأَخيرُ! سَمِّعِ السّورَةَ كُلَّها، ثُمَّ اكْشِفْ لِتَتَأَكَّدَ.":"أَحْسَنْتَ! أَخْفَيْتُ كَلِماتٍ أَكْثَرَ.","cheer",3200)}else{S.memLevel[ctx.id]=5;save();c.querySelector(".mem-act").innerHTML="";burst();go()}}};
  draw();say("اقْرَأِ الْآياتِ مَعَ التِّلاوَةِ، ثُمَّ سَمِّعْها مُسْتَوًى بَعْدَ مُسْتَوًى.","listen",5000)},
 order(el,x,go,ctx){el.appendChild(h(`<div class="inst reveal" style="margin-top:20px"><span class="ic">🔢</span>${x.head}</div>`));
  const bar=h(`<div class="lt-row ${x.small?"":"big"}"></div>`);el.appendChild(bar);
  const g=h(`<div class="${x.small?"lt-grid":"od-grid"}">${shuffle(x.list.map((t,i)=>({t,i}))).map(y=>`<button class="${x.small?"lt":"od"}${x.imgs?" odi":""}" data-i="${y.i}">${x.imgs?pimg(x.imgs[y.i]):""}<span>${y.t}</span></button>`).join("")}</div>`);el.appendChild(g);
  let k=0,miss=0;g.querySelectorAll("button").forEach(b=>b.onclick=()=>{const i=+b.dataset.i;
   if(x.list[i]===x.list[k]&&!b.classList.contains("used")){b.classList.add("used");bar.insertAdjacentHTML("beforeend",`<span class="${x.small?"lt-on":"od-on"} reveal">${x.small?"":`<i>${k+1}</i>`}${x.imgs?pimg(x.imgs[k]):""}${x.list[k]}</span>`);k++;tone(true);
    if(k===x.list.length){firstTry(ctx.id+"-order",miss<=1);if(x.after)bar.insertAdjacentHTML("afterend",`<div class="concl reveal">${x.after}</div>`);say(praise(),"great",2600);setTimeout(go,800)}}
   else{miss++;b.classList.add("shake");setTimeout(()=>b.classList.remove("shake"),500);tone(false);if(miss===1&&!x.small)addMistake(ctx.id,x.head+": ما الَّذي يَأْتي بَعْدَ «"+(x.list[k-1]||"الْبِدايَةِ")+"»؟",[x.list[k]].concat(x.list.filter((_,j)=>j!==k).slice(0,2)),0,b.textContent);say(x.hint||"فَكِّرْ: ما الَّذي يَأْتي الْآنَ؟","think",3200)}})},
 color(el,x,go){el.appendChild(h(`<div class="inst reveal" style="margin-top:20px"><span class="ic">🎨</span>${x.head}</div>`));
  const cols=["#3BA55C","#E2473B","#B44FC0","#2D8BD8","#F28C28","#5B3FC4"];
  const cw=h(`<div class="card center"><div class="pal">${cols.map((c,i)=>`<button class="dot2${i===0?" sel":""}" data-c="${c}" style="background:${c}"></button>`).join("")}</div><div class="clr">${x.words.map((w,i)=>`<button class="cw" data-i="${i}">${w}</button>`).join("")}</div></div>`);el.appendChild(cw);
  let cur=cols[0],n=0,sent=false;cw.querySelectorAll(".dot2").forEach(d=>d.onclick=()=>{cw.querySelectorAll(".dot2").forEach(y=>y.classList.remove("sel"));d.classList.add("sel");cur=d.dataset.c});
  cw.querySelectorAll(".cw").forEach(b=>b.onclick=()=>{if(!b.dataset.done){n++;b.dataset.done=1}b.style.color=cur;b.style.webkitTextStroke="0";tone(true);if(n===x.words.length&&!sent){sent=true;setTimeout(go,500)}})},
 pledge(el,x,go){const p=h(`<div class="card reveal" style="margin-top:24px;text-align:center"><div class="inst" style="justify-content:center;margin-top:0"><span class="ic">🖐️</span>${x.head||"أَضَعُ بَصْمَتي"}</div><div class="pl-row">${x.pledges.map(y=>`<div class="pl">${y.img?pimg(y.img):""}<p>${y.t}</p></div>`).join("")}</div><button class="btn gold pl-b">أَعِدُ أَنْ أَفْعَلَ ذلِكَ ✓</button><div class="pl-out"></div></div>`);
  el.appendChild(p);p.scrollIntoView({behavior:"smooth",block:"center"});
  p.querySelector(".pl-b").onclick=()=>{S.card={pledge:x.pledges.map(y=>y.t).join(" "),head:x.head||"أَضَعُ بَصْمَتي"};save();p.querySelector(".pl-b").remove();
   p.querySelector(".pl-out").innerHTML=`<div class="mycard reveal"><div class="top">بَصْمَتي · حِراءٌ</div><h3>${x.head||"أَضَعُ بَصْمَتي"}</h3><div class="big">🖐️</div>${x.pledges.map(y=>`<p>${y.t}</p>`).join("")}<div class="sig">تَظْهَرُ بَصْمَتُكَ لِأَهْلِكَ في تَقْريرِ وَلِيِّ الْأَمْرِ</div></div>`;go()}},
 /* موقف للتفكير (للصفوف الأعلى): أكتب جوابي، ثم أكشف الإجابة النموذجية وأقيّم نفسي */
 think(el,x,go,ctx){const c=h(`<div class="card reveal" style="margin-top:18px;background:var(--peach)"><h3 style="font-size:24px;color:#B76A12;line-height:1.7">🤔 ${x.q}</h3><textarea class="th-in" rows="3" placeholder="أَكْتُبُ جَوابي هُنا…"></textarea><div class="center"><button class="btn ghost th-rv">👁️ الْإِجابَةُ النَّموذَجِيَّةُ</button></div><div class="th-m" hidden><p class="say">${x.model}</p><div class="th-self">قارَنْتُ جَوابي: <button class="btn ghost" data-v="2">😄 مِثْلُها</button><button class="btn ghost" data-v="1">🙂 قَريبٌ</button><button class="btn ghost" data-v="0">😟 أَحْتاجُ مُراجَعَةً</button></div></div></div>`);
  el.appendChild(c);c.scrollIntoView({behavior:"smooth",block:"center"});
  c.querySelector(".th-rv").onclick=()=>{c.querySelector(".th-m").hidden=false;c.querySelector(".th-rv").remove();tone(true)};
  c.querySelectorAll(".th-self button").forEach(b=>b.onclick=()=>{S.think=S.think||{};S.think[ctx.id+"-"+ctx.k]={v:+b.dataset.v,a:c.querySelector(".th-in").value.slice(0,500)};firstTry(ctx.id+"-think"+ctx.k,+b.dataset.v>0);save();c.querySelector(".th-self").innerHTML="✓ شُكْرًا!";go()})},
};
{const _am=addMistake,tg=v=>typeof v==="string"?v.replace(/<[^>]+>/g,""):v;addMistake=function(st,q,o,a,g){return _am(st,tg(q),(o||[]).map(tg),a,tg(g))}}
/* النص القرآني داخل الأجزاء يُعرض بخط المصحف: ما بين ﴿﴾، أو عبارة برسم عثماني (ٱ، ۡ) */
const qrS=v=>typeof v!=="string"?v:v.includes("﴿")?v.replace(/﴿[^﴾]*﴾/g,m=>`<span class="qr">${m}</span>`):(/[ٱۡ]/.test(v)&&!v.includes("<")?`<span class="qr">${v}</span>`:v);
const qrX=v=>Array.isArray(v)?v.map(qrX):v&&typeof v==="object"?Object.fromEntries(Object.entries(v).map(([k,y])=>[k,k==="p"||k==="img"||k==="imgs"?y:qrX(y)])):qrS(v);
function runParts(el,st){const parts=(st.parts||[]).map(x=>["memorize","ayah","build"].includes(x.p)?x:qrX(x));let k=0;
 const next=()=>{if(k>=parts.length){if(st.crit!=null)award(CRIT[st.crit].k);setTimeout(()=>complete(st.id,st.done||"أَحْسَنْتَ!"),st.crit!=null?1600:300);return}
  const x=parts[k],ctx={id:st.id,k};k++;const f=PART[x.p];if(!f){next();return}f(el,x,next,ctx)};
 next();if(st.say)say(st.say,"listen",4500);
}
const IE={
 family(el){const H=D.home;
  el.appendChild(h(`<div class="card reveal" style="background:linear-gradient(135deg,#EFF9F3,#fff)"><h3 style="font-size:30px;color:var(--navy)">مُهِمَّةُ الْبَيْتِ 🏠</h3><p style="font-size:24px;line-height:1.9;margin:6px 0 0"><b>${H.task}</b></p></div>`));
  el.appendChild(h(`<div class="inst" style="margin-top:22px"><span class="ic">👨‍👩‍👧</span>مَنْ شارَكَني مِنْ أُسْرَتي؟</div>`));
  const F=[["👨","أَبي"],["👩","أُمّي"],["👴","جَدّي"],["👵","جَدَّتي"],["👦","أَخي"],["👧","أُخْتي"]];
  const fam=h(`<div class="fam">${F.map((f,i)=>`<button class="fm ${S.fam.asked.includes(i)?"sel":""}" data-i="${i}"><span class="e">${f[0]}</span>${f[1]}</button>`).join("")}</div>`);el.appendChild(fam);
  fam.querySelectorAll(".fm").forEach(b=>b.onclick=()=>{const i=+b.dataset.i;const k=S.fam.asked.indexOf(i);if(k<0)S.fam.asked.push(i);else S.fam.asked.splice(k,1);b.classList.toggle("sel");save();tone(true)});
  el.appendChild(h(`<div class="inst" style="margin-top:26px"><span class="ic">🏮</span>${H.weekHead}</div>`));
  el.appendChild(h(`<div class="card" style="background:#FFF9EC"><ol class="bq">${H.behaviors.map(b=>`<li>${b}</li>`).join("")}</ol></div>`));
  const Dd=["السَّبْتُ","الْأَحَدُ","الْإِثْنَيْنِ","الثُّلاثاءُ","الْأَرْبِعاءُ","الْخَميسُ","الْجُمُعَةُ"];
  const lampSvg='<svg viewBox="0 0 100 120"><path d="M32 34 Q32 20 50 14 Q68 20 68 34Z" fill="#102A4C"/><rect x="26" y="34" width="48" height="7" rx="3.5" fill="#102A4C"/><path d="M29 44 L71 44 L78 100 Q50 114 22 100Z" fill="#FFF8E6" stroke="#102A4C" stroke-width="5"/><path class="fl" d="M50 56 L62 80 Q65 88 58 94 L42 94 Q35 88 38 80Z" fill="#D9CDB3"/></svg>';
  const wk=h(`<div class="week">${Dd.map((d,i)=>`<button class="day ${S.fam.week[i]!=null?"lit":""}" data-i="${i}">${d}${lampSvg}<div class="act">${S.fam.week[i]!=null?"⭐":""}</div></button>`).join("")}</div>`);el.appendChild(wk);
  wk.querySelectorAll(".day").forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(S.fam.week[i]!=null)return;S.fam.week[i]=1;save();b.classList.add("lit");b.querySelector(".act").textContent="⭐";tone(true);const n=Object.keys(S.fam.week).length;say(n>=7?"أَضاءَ أُسْبوعُكَ كُلُّهُ! سُلوكُكَ جَميلٌ.":`أَضاءَ ${n} مِنْ 7 قَناديلَ. عُدْ غَدًا لِتُضيءَ قِنْديلًا جَديدًا!`,"great",4000);if(n>=7)burst()});
  const fin=h(`<div class="center" style="margin-top:24px"><button class="btn gold" id="famDone">أَنْهَيْتُ مُهِمَّةَ الْبَيْتِ ✓</button></div>`);el.appendChild(fin);
  fin.querySelector("#famDone").onclick=()=>{if(!S.fam.asked.length){say("الْمِسْ صورَةَ مَنْ شارَكَكَ مِنْ أُسْرَتِكَ.","think",4000);fam.classList.add("shake");setTimeout(()=>fam.classList.remove("shake"),500);return}fin.remove();complete("family","أَنْجَزْتَ مُهِمَّةَ الْبَيْتِ. قَناديلُ الْأُسْبوعِ تَبْقى مَفْتوحَةً كُلَّ يَوْمٍ.")};
  say("أَضِئْ قِنْديلًا كُلَّ يَوْمٍ تَلْتَزِمُ فيهِ ما تَعَلَّمْتَهُ.","wink",5000);
 }
};
Object.keys(RENDER).forEach(k=>{if(!["ready","check"].includes(k))delete RENDER[k]});
Object.assign(RENDER,IE,{read(el){const st=STATIONS.find(s=>s.id==="read");
 if(st&&(st.parts||st.crit!=null)){const box=h(`<div></div>`);window.__afterRead=()=>{box.innerHTML="";el.appendChild(box);runParts(box,st)}}readBook(el)}});
STATIONS.forEach(s=>{if(s.parts&&s.id!=="read")RENDER[s.id]=el=>runParts(el,s)});
