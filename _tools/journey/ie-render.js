/* ================= محطات التربية الإسلامية (من الكتاب المدرسي وعرض المعلم) ================= */
window.__ownBook=true;BOOK=D.book||null;
const pimg=n=>`<img src="${IMG}${n}.webp" alt="" loading="lazy">`;
/* بطاقات صور تُكشف: كل بطاقة سؤال من الكتاب، ولمسها يكشف الجواب */
function revealCards(el,cards,onAll){
 const g=h(`<div class="rv-grid">${cards.map((c,i)=>`<button class="rv" data-i="${i}"><div class="rv-pic">${pimg(c.img)}</div><div class="rv-q">${c.q}</div><div class="rv-a">${c.a}</div></button>`).join("")}</div>`);el.appendChild(g);
 let n=0;g.querySelectorAll(".rv").forEach(b=>b.onclick=()=>{if(b.classList.contains("open"))return;b.classList.add("open");tone(true);n++;if(n===cards.length)onAll&&onAll()});
}
/* اختيار عدّة صور صحيحة */
function pickMany(el,{id,st,q,items,onDone}){
 const g=h(`<div class="pk"><div class="pk-grid">${items.map((it,i)=>`<button class="pk-i" data-i="${i}">${pimg(it.img)}<span class="pk-m"></span></button>`).join("")}</div><div class="center" style="margin-top:16px"><button class="btn gold pk-go">تَحَقَّقْ ✓</button></div></div>`);el.appendChild(g);
 const sel=new Set();let tries=0,done=false;
 g.querySelectorAll(".pk-i").forEach(b=>b.onclick=()=>{if(done)return;const i=+b.dataset.i;sel.has(i)?sel.delete(i):sel.add(i);b.classList.toggle("sel");b.classList.remove("no")});
 g.querySelector(".pk-go").onclick=()=>{if(done)return;tries++;let ok=true;
  g.querySelectorAll(".pk-i").forEach(b=>{const i=+b.dataset.i,should=!!items[i].ok,has=sel.has(i);b.classList.remove("ok","no");
   if(should&&has)b.classList.add("ok");else if(has&&!should){b.classList.add("no");ok=false}else if(should&&!has)ok=false});
  if(ok){done=true;firstTry(id,tries===1);tone(true);say(praise(),"cheer",2500);g.querySelectorAll(".pk-i").forEach(b=>{if(items[+b.dataset.i].ok)b.classList.add("ok")});g.querySelector(".pk-go").remove();onDone&&onDone()}
  else{tone(false);if(tries===1){const bad=items.filter(x=>!x.ok)[0],good=items.filter(x=>x.ok).slice(0,2);if(bad)addMistake(st,"أَيُّها لا يُناسِبُ؟ ("+q.replace(/^[^:]*:\s*/,"")+")",[bad.t].concat(good.map(x=>x.t)),0,"")}say("انْظُرْ إِلى الصُّوَرِ مَرَّةً أُخْرى: بَعْضُها لَمْ تَخْتَرْهُ، أَوِ اخْتَرْتَ ما لا يُناسِبُ.","think",4200)}};
}
const IE={
 observe(el){const X=D.observe;
  el.appendChild(h(`<div class="inst"><span class="ic">🔎</span>${X.head}: أَلْمِسُ كُلَّ صورَةٍ لِأَكْشِفَ الْجَوابَ.</div>`));
  revealCards(el,X.cards,()=>{say("أَحْسَنْتَ! فَمَنْ رَبُّ هذا كُلِّهِ؟","idea",3000);
   const c=h(`<div class="card reveal" style="margin-top:22px"><h3 style="font-size:28px;color:var(--navy)">${X.q.q}</h3></div>`);el.appendChild(c);c.scrollIntoView({behavior:"smooth",block:"center"});
   mcq(c,{id:"observe",q:X.q.q,o:X.q.o,a:X.q.a,st:"observe",hint:"انْظُرْ إِلى الصُّوَرِ كُلِّها: النَّباتاتُ وَالْحَيَواناتُ وَالنّاسُ وَالشَّمْسُ وَالْجِبالُ.",onDone:()=>{c.appendChild(h(`<div class="concl reveal">${X.concl}</div>`));award("bronze");setTimeout(()=>complete("observe","عَرَفْتَ أَنَّ اللهَ رَبُّ الْعالَمينَ."),1700)}});
  });
  say("لاحِظِ الصُّوَرَ، وَفَكِّرْ في كُلِّ سُؤالٍ قَبْلَ أَنْ تَلْمِسَ.","listen",4500);
 },
 reflect(el){const X=D.reflect;
  el.appendChild(h(`<div class="inst"><span class="ic">🤔</span>${X.head}</div>`));
  el.appendChild(h(`<div class="rv-grid four">${X.imgs.map(n=>`<div class="rv open still"><div class="rv-pic">${pimg(n)}</div></div>`).join("")}</div>`));
  el.appendChild(h(`<div class="card" style="margin-top:18px;background:#F4FAFF"><ul class="bq">${X.qs.map(q=>`<li>${q}</li>`).join("")}</ul></div>`));
  let k=0;const next=()=>{if(k>=X.mcq.length){c0.appendChild(h(`<div class="concl reveal">${X.concl}</div>`));award("silver");setTimeout(()=>complete("reflect","اسْتَنْتَجْتَ أَنَّ اللهَ رَبُّ هذا الْكَوْنِ."),1700);return}
   const q=X.mcq[k];const c=h(`<div class="card reveal" style="margin-top:16px"><h3 style="font-size:26px;color:var(--navy)">${q.q}</h3></div>`);c0.appendChild(c);c.scrollIntoView({behavior:"smooth",block:"center"});
   mcq(c,{id:"reflect"+k,q:q.q,o:q.o,a:q.a,st:"reflect",hint:q.h||"تَأَمَّلِ الصُّوَرَ مَرَّةً أُخْرى.",onDone:()=>{k++;setTimeout(next,700)}})};
  const c0=h(`<div></div>`);el.appendChild(c0);next();
  say("تَأَمَّلِ الصُّوَرَ الْأَرْبَعَ، ثُمَّ أَجِبْ.","think",4000);
 },
 command(el){const X=D.command;
  el.appendChild(h(`<div class="inst"><span class="ic">🌍</span>${X.head}: أَلْمِسُ كُلَّ صورَةٍ لِأَكْشِفَ الْجَوابَ.</div>`));
  revealCards(el,X.cards,()=>{
   const c=h(`<div class="card reveal" style="margin-top:22px"><h3 style="font-size:28px;color:var(--navy)">${X.q.q}</h3></div>`);el.appendChild(c);c.scrollIntoView({behavior:"smooth",block:"center"});
   mcq(c,{id:"command",q:X.q.q,o:X.q.o,a:X.q.a,st:"command",hint:"تَذَكَّرْ ما قالَهُ الْأَبُ لِراشِدٍ.",onDone:()=>setTimeout(mapIt,700)});
  });
  function mapIt(){const M=D.cmap;
   const w=h(`<div class="reveal" style="margin-top:26px"><div class="inst"><span class="ic">🗺️</span>أُنَظِّمُ مَفاهيمي: أَلْمِسُ ما يَصِحُّ أَنْ نَقولَهُ عَنِ اللهِ رَبّي.</div>
    <div class="cmap"><div class="cm-root">${M.root}</div><div class="cm-slots">${M.ok.map((_,i)=>`<div class="cm-slot" id="cms${i}"></div>`).join("")}</div></div>
    <div class="chips" style="margin-top:16px">${shuffle(M.ok.map(t=>({t,ok:1})).concat(M.no.map(t=>({t,ok:0})))).map(x=>`<button class="chip" data-ok="${x.ok}">${x.t}</button>`).join("")}</div></div>`);
   el.appendChild(w);w.scrollIntoView({behavior:"smooth",block:"start"});let n=0,miss=0;
   w.querySelectorAll(".chips .chip").forEach(b=>b.onclick=()=>{if(b.dataset.ok==="1"){const s=w.querySelector("#cms"+n);s.textContent=b.textContent;s.classList.add("on");b.remove();n++;tone(true);
     if(n===M.ok.length){firstTry("cmap",miss===0);w.querySelector(".chips").style.display="none";award("gold");setTimeout(()=>complete("command","اللهُ رَبّي، وَهُوَ الْمُدَبِّرُ لِكُلِّ شَيْءٍ."),1700)}}
    else{miss++;b.classList.add("shake");setTimeout(()=>b.classList.remove("shake"),500);tone(false);if(miss===1)addMistake("command","ما الَّذي يَصِحُّ أَنْ نَقولَهُ عَنِ اللهِ رَبّي؟",M.ok.concat([b.textContent]),0,b.textContent);say(M.why,"think",4500)}});
   say("اللهُ رَبّي… ماذا نَعْرِفُ عَنْهُ؟","idea",3500);
  }
 },
 blessings(el){const X=D.blessings;
  el.appendChild(h(`<div class="inst"><span class="ic">🤲</span>${X.head}</div>`));
  const g=h(`<div class="rv-grid four">${X.cards.map((c,i)=>`<button class="rv emo" data-i="${i}"><div class="rv-pic"><span style="font-size:76px">${c.e}</span></div><div class="rv-q">${c.q}</div><div class="rv-a">${c.a}</div></button>`).join("")}</div>`);el.appendChild(g);
  let n=0;g.querySelectorAll(".rv").forEach(b=>b.onclick=()=>{if(b.classList.contains("open"))return;b.classList.add("open");tone(true);n++;if(n===X.cards.length)share()});
  function share(){
   const c=h(`<div class="card reveal" style="margin-top:22px;background:linear-gradient(135deg,#FFF8EC,#fff)"><div class="inst" style="margin-top:0"><span class="ic">💬</span>${X.shareHead}</div>${X.share.map(s=>`<p class="say">${s}</p>`).join("")}</div>`);el.appendChild(c);c.scrollIntoView({behavior:"smooth",block:"center"});
   retellBox(el,"أَقولُ الْجُمْلَتَيْنِ بِصَوْتي.","أَقْرَأُهُما بِصَوْتٍ واضِحٍ، كَأَنّي أُكَلِّمُ رَبّي.",()=>{
    const a=h(`<div class="card reveal ayah-card" style="margin-top:22px"><div class="inst" style="margin-top:0"><span class="ic">📖</span>${X.ayahHead}</div><p class="ayah">${X.ayah}</p><p class="ref">${X.ayahRef}</p><p style="font-size:21px;margin:6px 0 0;color:#6b5a35">${X.ayahNote}</p><div class="center" style="margin-top:12px"><button class="btn gold" id="ayOk">تَلَوْتُها ✓</button></div></div>`);
    el.appendChild(a);a.scrollIntoView({behavior:"smooth",block:"center"});
    a.querySelector("#ayOk").onclick=()=>{a.querySelector("#ayOk").remove();complete("blessings","شَكَرْتَ رَبَّكَ عَلى نِعَمِهِ.")};
   });
  }
  say("تَخَيَّلْ: ماذا لَوْ؟ الْمِسْ كُلَّ بِطاقَةٍ.","wink",4000);
 },
 letters(el){const L=D.letters;
  el.appendChild(h(`<div class="inst"><span class="ic">🔤</span>${L.head}: أَنْطِقُ كُلَّ حَرْفٍ، وَأَلْمِسُ الْحُروفَ بِتَرْتيبِها.</div>`));
  const bar=h(`<div class="lt-row"></div>`);el.appendChild(bar);
  const g=h(`<div class="lt-grid">${shuffle(L.list.map((t,i)=>({t,i}))).map(x=>`<button class="lt" data-i="${x.i}">${x.t}</button>`).join("")}</div>`);el.appendChild(g);
  let k=0,miss=0;g.querySelectorAll(".lt").forEach(b=>b.onclick=()=>{const i=+b.dataset.i;
   if(i===k){b.classList.add("used");bar.insertAdjacentHTML("beforeend",`<span class="lt-on reveal">${L.list[i]}</span>`);k++;tone(true);
    if(k===L.list.length){firstTry("letters",miss<=1);say("أَحْسَنْتَ! رَتَّبْتَ الْحُروفَ كُلَّها.","great",3000);setTimeout(()=>complete("letters","أَتْقَنْتَ تَرْتيبَ الْحُروفِ."),900)}}
   else{miss++;b.classList.add("shake");setTimeout(()=>b.classList.remove("shake"),500);tone(false);say(`الْحَرْفُ التّالي بَعْدَ «${L.list[k-1]||"البداية"}»… أَيُّ حَرْفٍ هُوَ؟`,"think",3200)}});
  say("حُروفُ الْهِجاءِ تُساعِدُنا عَلى تِلاوَةِ الْقُرْآنِ. ابْدَأْ بِالْأَلِفِ!","cheer",4500);
 },
 stamp(el){const X=D.stamp;
  el.appendChild(h(`<div class="inst"><span class="ic">🎨</span>${X.colorHead}</div>`));
  const cols=["#3BA55C","#E2473B","#B44FC0","#2D8BD8","#F28C28","#5B3FC4"];
  const cw=h(`<div class="card center"><div class="pal">${cols.map((c,i)=>`<button class="dot2${i===0?" sel":""}" data-c="${c}" style="background:${c}"></button>`).join("")}</div><div class="clr">${X.colorWords.map((w,i)=>`<button class="cw" data-i="${i}">${w}</button>`).join("")}</div></div>`);el.appendChild(cw);
  let cur=cols[0],colored=0;cw.querySelectorAll(".dot2").forEach(d=>d.onclick=()=>{cw.querySelectorAll(".dot2").forEach(x=>x.classList.remove("sel"));d.classList.add("sel");cur=d.dataset.c});
  cw.querySelectorAll(".cw").forEach(b=>b.onclick=()=>{if(!b.dataset.done){colored++;b.dataset.done=1}b.style.color=cur;b.style.webkitTextStroke="0";tone(true);if(colored===X.colorWords.length&&!cw.dataset.next){cw.dataset.next=1;setTimeout(a2,500)}});
  function a2(){
   el.appendChild(h(`<div class="inst reveal" style="margin-top:26px"><span class="ic">⭕</span>${X.a2.q}</div>`));
   pickMany(el,{id:"stamp2",st:"stamp",q:X.a2.q,items:X.a2.items,onDone:()=>setTimeout(a3,700)});
  }
  function a3(){
   el.appendChild(h(`<div class="inst reveal" style="margin-top:26px"><span class="ic">✅</span>${X.a3.q}</div>`));
   pickMany(el,{id:"stamp3",st:"stamp",q:X.a3.q,items:X.a3.items,onDone:()=>setTimeout(pledge,700)});
  }
  function pledge(){
   const p=h(`<div class="card reveal" style="margin-top:24px;text-align:center"><div class="inst" style="justify-content:center;margin-top:0"><span class="ic">🖐️</span>${X.head}</div><div class="pl-row">${X.pledges.map(p=>`<div class="pl">${pimg(p.img)}<p>${p.t}</p></div>`).join("")}</div><button class="btn gold" id="pl">أَعِدُ أَنْ أَفْعَلَ ذلِكَ ✓</button><div id="cardOut"></div></div>`);
   el.appendChild(p);p.scrollIntoView({behavior:"smooth",block:"center"});
   p.querySelector("#pl").onclick=()=>{S.card={pledge:X.pledges.map(x=>x.t).join(" "),head:X.head};save();p.querySelector("#pl").remove();
    p.querySelector("#cardOut").innerHTML=`<div class="mycard reveal"><div class="top">بَصْمَتي · حِراءٌ</div><h3>${X.head}</h3><div class="big">🖐️</div>${X.pledges.map(x=>`<p>${x.t}</p>`).join("")}<div class="sig">تَظْهَرُ بَصْمَتُكَ لِأَهْلِكَ في تَقْريرِ وَلِيِّ الْأَمْرِ</div></div>`;
    if(!S.done.stamp){award("challenge");setTimeout(()=>complete("stamp","وَضَعْتَ بَصْمَتَكَ!"),1700)}};
  }
  say("لَوِّنْ كَلِمَةَ «اللهُ»: اخْتَرْ لَوْنًا، ثُمَّ الْمِسِ الْكَلِمَةَ.","cheer",4500);
 },
 family(el){const H=D.home;
  el.appendChild(h(`<div class="card reveal" style="background:linear-gradient(135deg,#EFF9F3,#fff)"><h3 style="font-size:30px;color:var(--navy)">مُهِمَّةُ الْبَيْتِ 🏠</h3><p style="font-size:24px;line-height:1.9;margin:6px 0 0"><b>${H.task}</b></p></div>`));
  el.appendChild(h(`<div class="inst" style="margin-top:22px"><span class="ic">👨‍👩‍👧</span>مَنْ ساعَدَني مِنْ أُسْرَتي؟</div>`));
  const F=[["👨","أَبي"],["👩","أُمّي"],["👴","جَدّي"],["👵","جَدَّتي"],["👦","أَخي"],["👧","أُخْتي"]];
  const fam=h(`<div class="fam">${F.map((f,i)=>`<button class="fm ${S.fam.asked.includes(i)?"sel":""}" data-i="${i}"><span class="e">${f[0]}</span>${f[1]}</button>`).join("")}</div>`);el.appendChild(fam);
  fam.querySelectorAll(".fm").forEach(b=>b.onclick=()=>{const i=+b.dataset.i;const k=S.fam.asked.indexOf(i);if(k<0)S.fam.asked.push(i);else S.fam.asked.splice(k,1);b.classList.toggle("sel");save();tone(true)});
  el.appendChild(h(`<div class="inst" style="margin-top:26px"><span class="ic">🏮</span>${H.weekHead}</div>`));
  el.appendChild(h(`<div class="card" style="background:#FFF9EC"><ol class="bq">${H.behaviors.map(b=>`<li>${b}</li>`).join("")}</ol></div>`));
  const Dd=["السَّبْتُ","الْأَحَدُ","الْإِثْنَيْنِ","الثُّلاثاءُ","الْأَرْبِعاءُ","الْخَميسُ","الْجُمُعَةُ"];
  const lampSvg='<svg viewBox="0 0 100 120"><path d="M32 34 Q32 20 50 14 Q68 20 68 34Z" fill="#102A4C"/><rect x="26" y="34" width="48" height="7" rx="3.5" fill="#102A4C"/><path d="M29 44 L71 44 L78 100 Q50 114 22 100Z" fill="#FFF8E6" stroke="#102A4C" stroke-width="5"/><path class="fl" d="M50 56 L62 80 Q65 88 58 94 L42 94 Q35 88 38 80Z" fill="#D9CDB3"/></svg>';
  const wk=h(`<div class="week">${Dd.map((d,i)=>`<button class="day ${S.fam.week[i]!=null?"lit":""}" data-i="${i}">${d}${lampSvg}<div class="act">${S.fam.week[i]!=null?"⭐":""}</div></button>`).join("")}</div>`);el.appendChild(wk);
  wk.querySelectorAll(".day").forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(S.fam.week[i]!=null)return;S.fam.week[i]=1;save();b.classList.add("lit");b.querySelector(".act").textContent="⭐";tone(true);const n=Object.keys(S.fam.week).length;say(n>=7?"أَضاءَ أُسْبوعُكَ كُلُّهُ! سُلوكُكَ جَميلٌ.":`أَضاءَ ${n} مِنْ 7 قَناديلَ. الْتَزِمْ سُلوكَكَ غَدًا لِتُضيءَ قِنْديلًا جَديدًا!`,"great",4000);if(n>=7)burst()});
  const fin=h(`<div class="center" style="margin-top:24px"><button class="btn gold" id="famDone">أَنْهَيْتُ مُهِمَّةَ الْبَيْتِ ✓</button></div>`);el.appendChild(fin);
  fin.querySelector("#famDone").onclick=()=>{if(!S.fam.asked.length){say("الْمِسْ صورَةَ مَنْ ساعَدَكَ مِنْ أُسْرَتِكَ.","think",4000);fam.classList.add("shake");setTimeout(()=>fam.classList.remove("shake"),500);return}fin.remove();complete("family","أَنْجَزْتَ مُهِمَّةَ الْبَيْتِ. قَناديلُ الْأُسْبوعِ تَبْقى مَفْتوحَةً كُلَّ يَوْمٍ.")};
  say("أَضِئْ قِنْديلًا كُلَّ يَوْمٍ تَلْتَزِمُ فيهِ السُّلوكاتِ الثَّلاثَةَ.","wink",5000);
 }
};
Object.keys(RENDER).forEach(k=>{if(!["ready","check"].includes(k))delete RENDER[k]});
Object.assign(RENDER,IE,{read(el){readBook(el)}});
