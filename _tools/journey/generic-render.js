/* ================= المحطات ================= */
const kwHTML2=t=>t.replace(/\[\[(.+?)(?:\|(.+?))?\]\]/g,(_,w,c)=>c&&WORDS[c]?`<span class="kw" data-w="${c}" tabindex="0">${w}</span>`:`<span class="kw nk">${w}</span>`);
const FACES=[["😟","أَحْتاجُ مُساعَدَةً"],["🙂","أَسْتَطيعُ قَليلًا"],["😄","أَسْتَطيعُ جَيِّدًا"]];
function rating(el,store,onAll){
 el.appendChild(h(`<div class="rate">${CRIT.map((c,i)=>`<div class="rrow reveal" style="--c:${c.c};animation-delay:${i*.12}s"><p>${c.t}</p><div class="faces">${FACES.map((f,j)=>`<button class="face ${store[c.k]===j?"sel":""}" data-c="${c.k}" data-v="${j}" title="${f[1]}" aria-label="${f[1]}">${f[0]}</button>`).join("")}</div></div>`).join("")}</div>`));
 el.querySelectorAll(".face").forEach(b=>b.onclick=()=>{store[b.dataset.c]=+b.dataset.v;save();
  b.parentNode.querySelectorAll(".face").forEach(x=>x.classList.toggle("sel",x===b));tone(true);
  if(CRIT.every(c=>c.k in store))onAll()});
}
/* توصيل زوجين: يمين ↔ يسار */
function pairMatch(el,{id,st,left,right,qOf,onDone}){
 const ord=shuffle(right.map((_,i)=>i));
 const m=h(`<div class="match"><div class="col">${left.map((x,i)=>`<button class="who" data-i="${i}">${x}</button>`).join("")}</div><div class="col">${ord.map(i=>`<button class="love" data-i="${i}"><span>${right[i]}</span></button>`).join("")}</div></div>`);el.appendChild(m);
 let sel=null,okN=0,miss=0;
 m.querySelectorAll(".who").forEach(b=>b.onclick=()=>{if(b.classList.contains("ok"))return;m.querySelectorAll(".who").forEach(x=>x.classList.remove("sel"));b.classList.add("sel");sel=b});
 m.querySelectorAll(".love").forEach(b=>b.onclick=()=>{if(b.classList.contains("ok"))return;if(!sel){say("الْمِسْ بِطاقَةً مِنَ الْعَمودِ الْأَيْمَنِ أَوَّلًا.","think",2500);return}
  const i=+sel.dataset.i;if(+b.dataset.i===i){b.classList.add("ok");b.insertAdjacentHTML("beforeend",`<span class="who-chip">✓</span>`);sel.classList.remove("sel");sel.classList.add("ok");sel=null;okN++;tone(true);say(praise(),"cheer",2000);
    if(okN===left.length){firstTry(id,miss===0);onDone&&onDone(miss)}}
  else{miss++;b.classList.add("shake");setTimeout(()=>b.classList.remove("shake"),500);tone(false);if(miss<=2)addMistake(st,qOf(i),right,i,right[+b.dataset.i]);say("فَكِّرْ مَرَّةً أُخْرى… ارْجِعْ إِلى النَّصِّ إِنِ احْتَجْتَ.","think",3200)}});
}
function retellBox(el,title,hint,onDone){
 const c=h(`<div class="card reveal" style="margin-top:24px;text-align:center"><div class="inst" style="justify-content:center;margin-top:0"><span class="ic">🎙️</span>${title}</div>
  <p style="font-size:21px;color:#6b5a35;margin:0">${hint}</p>
  <div class="rec"><button class="micbtn" aria-label="تسجيل">🎤</button><span class="timer">0:00</span><span class="play"></span></div>
  <button class="btn ghost nomic" style="margin-top:12px;font-size:18px">قُلْتُها لِأَهْلي بِصَوْتٍ عالٍ ✓</button></div>`);
 el.appendChild(c);c.scrollIntoView({behavior:"smooth",block:"center"});
 let rec,chunks=[],t0,iv,fin=false;const finish=()=>{if(fin)return;fin=true;S.retold=true;save();onDone()};
 c.querySelector(".nomic").onclick=finish;
 c.querySelector(".micbtn").onclick=async()=>{const b=c.querySelector(".micbtn");
  if(rec&&rec.state==="recording"){rec.stop();return}
  try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});rec=new MediaRecorder(stream);chunks=[];
   rec.ondataavailable=e=>chunks.push(e.data);
   rec.onstop=()=>{clearInterval(iv);b.classList.remove("on");b.textContent="🎤";stream.getTracks().forEach(t=>t.stop());const url=URL.createObjectURL(new Blob(chunks,{type:rec.mimeType}));window.__retell=url;
    c.querySelector(".play").innerHTML=`<audio controls src="${url}"></audio>`;say("ما أَجْمَلَ صَوْتَكَ! اسْتَمِعْ إِلى نَفْسِكَ.","listen",4500);finish()};
   rec.start();t0=Date.now();b.classList.add("on");b.textContent="⏹";iv=setInterval(()=>{const s=Math.floor((Date.now()-t0)/1000);c.querySelector(".timer").textContent=`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;if(s>=60)rec.stop()},250)}
  catch(e){say("لَمْ أَسْتَطِعْ فَتْحَ الْميكْروفونِ. قُلْها لِأَهْلِكَ، ثُمَّ الْمِسِ الزِّرَّ الْأَبْيَضَ.","think",6000)}};
}
const RENDER={
 ready(el){
  el.appendChild(h(`<div class="card reveal" style="display:grid;grid-template-columns:220px 1fr;gap:20px;align-items:center;background:linear-gradient(135deg,#fff,#F3F8FD)">${D.cover?`<img src="${IMG}${D.cover}.webp" alt="" style="width:220px;border-radius:22px">`:emo("📖",120)}<div><h3 style="font-size:32px;color:var(--navy)">هَدَفُ رِحْلَتي</h3><p style="font-size:26px;line-height:1.9;margin:8px 0 0">${D.objective}</p></div></div>`));
  el.appendChild(h(`<div class="inst" style="margin-top:26px"><span class="ic">🧭</span>كَيْفَ أَشْعُرُ الْآنَ؟ أَخْتارُ وَجْهًا لِكُلِّ جُمْلَةٍ.</div>`));
  rating(el,S.pre,()=>{if(!S.done.ready){say("شُكْرًا! سَنَعودُ إِلى هذِهِ الْوُجوهِ في آخِرِ الرِّحْلَةِ لِنَرى كَمْ تَقَدَّمْتَ.","wink",5000);complete("ready","الْآنَ نَبْدَأُ رِحْلَتَنا مَعَ النَّصِّ.")}});
  say("أَهْلًا يا بَطَلَ حِراءٍ! أَنا سالِمٌ، سَأُرافِقُكَ في رِحْلَةِ الْقَناديلِ.","cheer",5000);
 },
 read(el){readBook(el)},
 words(el){
  el.appendChild(h(`<div class="inst"><span class="ic">🃏</span>أَقْلِبُ بِطاقَتَيْنِ: أَجْمَعُ كُلَّ كَلِمَةٍ مَعَ مَعْناها.</div>`));
  const pairs=D.words.slice(0,4);
  const cards=shuffle(pairs.flatMap((p,i)=>[{i,type:"word",html:`<div style="font-size:44px;line-height:1.1">${p[2]||""}</div><div>${p[0]}</div>`},{i,type:"mean",html:p[1]}]));
  const back='<svg viewBox="0 0 100 120"><path d="M32 34 Q32 20 50 14 Q68 20 68 34Z" fill="#E9C77B"/><rect x="26" y="34" width="48" height="7" rx="3.5" fill="#E9C77B"/><path d="M29 44 L71 44 L78 100 Q50 114 22 100Z" fill="none" stroke="#E9C77B" stroke-width="5"/><path d="M50 56 L62 80 Q65 88 58 94 L42 94 Q35 88 38 80Z" fill="#F7B731"/></svg>';
  const g=h(`<div class="memory">${cards.map((c,k)=>`<button class="mc" data-k="${k}"><div class="f">${back}</div><div class="b ${c.type==="word"?"word":""}"><div>${c.html}</div></div></button>`).join("")}</div>`);el.appendChild(g);
  let open=[],found=0,moves=0,lock=false;
  g.querySelectorAll(".mc").forEach(b=>b.onclick=()=>{if(lock||b.classList.contains("flip")||b.classList.contains("matched"))return;b.classList.add("flip");open.push(b);
   if(open.length===2){moves++;lock=true;const [x,y]=open.map(o=>cards[+o.dataset.k]);
    if(x.i===y.i&&x.type!==y.type){setTimeout(()=>{open.forEach(o=>o.classList.add("matched"));open=[];lock=false;found++;tone(true);
      const w=pairs[x.i][0];if(!S.words.includes(w)){S.words.push(w);save()}
      say(`«${w}» = ${pairs[x.i][1]}`,"idea",3000);
      if(found===pairs.length){firstTry("words",moves<=pairs.length+3);setTimeout(()=>complete("words",`جَمَعْتَ الْكَلِماتِ كُلَّها في ${moves} مُحاوَلاتٍ!`),700)}},500)}
    else{setTimeout(()=>{open.forEach(o=>o.classList.remove("flip"));open=[];lock=false},1000)}}});
  say("تَذَكَّرْ مَكانَ كُلِّ بِطاقَةٍ… الذّاكِرَةُ الْقَوِيَّةُ تَصْنَعُ قارِئًا قَوِيًّا!","wink",4500);
 },
 match(el){
  el.appendChild(h(`<div class="inst"><span class="ic">👆</span>${D.match.head}: أَلْمِسُ بِطاقَةً، ثُمَّ أَلْمِسُ ما يُناسِبُها.</div>`));
  pairMatch(el,{id:"match",st:"match",left:D.match.rows.map(r=>`<b>${r[0]}</b>`),right:D.match.rows.map(r=>r[1]),qOf:i=>`${D.match.head}: «${D.match.rows[i][0]}» ← ؟`,
   onDone:()=>{award("bronze");setTimeout(()=>complete("match","أَحْسَنْتَ التَّوْصيلَ!"),1600)}});
 },
 map(el){
  el.appendChild(h(`<div class="inst"><span class="ic">🗺️</span>${D.map.head}: أَصِلُ كُلَّ سُؤالٍ بِجَوابِهِ مِنَ النَّصِّ.</div>`));
  pairMatch(el,{id:"map",st:"map",left:D.map.rows.map(r=>`<span style="font-size:40px">${r[0]}</span><b>${r[1]}</b>`),right:D.map.rows.map(r=>r[2]),qOf:i=>`${D.map.rows[i][1]}`,
   onDone:()=>{say("رائِعٌ! بَقِيَ سُؤالٌ عَنْ كَلِمَةٍ.","great",2500);
    const c=h(`<div class="card reveal" style="margin-top:24px"><div class="inst" style="margin:0 0 6px"><span class="ic">🔍</span>${D.wordj.head}</div><p style="font-size:26px;line-height:1.9;margin:0 0 4px">${D.wordj.sent}</p><h3 style="font-size:24px;color:var(--navy)">${D.wordj.q}</h3></div>`);el.appendChild(c);c.scrollIntoView({behavior:"smooth",block:"center"});
    mcq(c,{id:"wordj",q:D.wordj.q+" "+D.wordj.sent,o:D.wordj.o,a:D.wordj.a,st:"map",hint:"اقْرَأِ الْجُمْلَةَ كُلَّها، فَالْمَعْنى يَظْهَرُ مِنْها.",onDone:()=>{c.appendChild(h(`<p class="reveal" style="font-size:20px;color:#1F7A55;margin:12px 0 0">💡 ${D.wordj.model}</p>`));award("silver");setTimeout(()=>complete("map","فَهِمْتَ النَّصَّ وَكَلِماتِهِ."),1800)}});
   }});
 },
 order(el){
  const O=D.order;
  if(O.type==="words"){
   el.appendChild(h(`<div class="inst"><span class="ic">🧩</span>${O.head}: أَلْمِسُ الْكَلِماتِ بِالتَّرْتيبِ لِأُكَوِّنَ جُمْلَةً مُفيدَةً.</div>`));
   let k=0,miss=0;
   const one=()=>{const it=O.items[k];const box=h(`<div class="card reveal" style="margin-top:16px;text-align:center"><div style="font-family:'Thmanyah Sans';font-weight:700;color:var(--gold)">${k+1} / ${O.items.length}</div><div class="sent" style="min-height:70px;font-size:32px;line-height:2;border-bottom:3px dashed #E6D8B8;margin:6px 0 16px;color:var(--navy)"></div><div class="chips" style="box-shadow:none;background:#FFF9EC"></div></div>`);el.appendChild(box);box.scrollIntoView({behavior:"smooth",block:"center"});
    const tiles=shuffle(it.tiles.map((t,i)=>i));let pos=0;
    tiles.forEach(i=>{const b=h(`<button class="chip">${it.tiles[i]}</button>`);box.querySelector(".chips").appendChild(b);
     b.onclick=()=>{if(it.seq[pos]===i){b.style.visibility="hidden";box.querySelector(".sent").insertAdjacentHTML("beforeend",`<span class="reveal" style="display:inline-block;margin:0 6px">${it.tiles[i]}</span>`);pos++;tone(true);
       if(pos===it.seq.length){box.querySelector(".sent").innerHTML=it.answer;box.querySelector(".chips").remove();say(praise(),"cheer",2200);k++;if(k<O.items.length)setTimeout(one,900);else{firstTry("order",miss===0);setTimeout(()=>retellBox(el,"أَقْرَأُ جُمَلي بِصَوْتٍ عالٍ.","أَقْرَأُ الْجُمَلَ الثَّلاثَ قِراءَةً واضِحَةً.",()=>{award("gold");setTimeout(()=>complete("order","كَوَّنْتَ الْجُمَلَ وَقَرَأْتَها!"),1500)}),900)}}}
     else{miss++;b.classList.add("shake");setTimeout(()=>b.classList.remove("shake"),500);tone(false);if(miss===1)addMistake("order","أَيُّ جُمْلَةٍ صَحيحَةٌ؟",it.opts,0,"");say("فَكِّرْ: بِأَيِّ كَلِمَةٍ تَبْدَأُ الْجُمْلَةُ الْمُفيدَةُ؟","think",3500)}}});
   };one();return;
  }
  el.appendChild(h(`<div class="inst"><span class="ic">☀️</span>${O.head}: أَلْمِسُ الْأَحْداثَ بِالتَّرْتيبِ.</div>`));
  const E=O.items;const pos=[5,35,65];
  const sky=h(`<div class="sky"><svg viewBox="0 0 900 340" preserveAspectRatio="none"><path d="M60 170 Q450 -110 840 170" fill="none" stroke="#F0C27A" stroke-width="3" stroke-dasharray="8 10" vector-effect="non-scaling-stroke"/></svg><div class="sun" id="sun"></div>${E.map((e,i)=>`<div class="slot" style="right:${pos[i]}%;transform:none"><span>${e.label}</span><div class="s" id="slot${i}"></div></div>`).join("")}</div>`);el.appendChild(sky);
  const sun=sky.querySelector("#sun");
  const setSun=k=>{const p=[[84.7,35],[58.7,11],[37,13],[13.6,38]][k];sun.style.left=p[0]+"%";sun.style.top=p[1]+"%";sky.style.setProperty("--skyc",["#FDE3C8","#E7F3FD","#DDEFFC","#FCD9B8"][k])};setSun(0);
  const evs=h(`<div class="events">${shuffle(E.map((_,i)=>i)).map(i=>`<button class="ev" data-i="${i}"><div style="height:110px;display:grid;place-items:center;background:#FFF6E3">${emo(E[i].e,64)}</div><p>${E[i].t}</p></button>`).join("")}</div>`);el.appendChild(evs);
  let step=0,miss=0;
  evs.querySelectorAll(".ev").forEach(b=>b.onclick=()=>{const i=+b.dataset.i;
   if(i===step){b.classList.add("used");$("#slot"+i).innerHTML=`<div style="display:grid;place-items:center;height:100%;background:#fff">${emo(E[i].e,52)}</div>`;step++;setSun(step);tone(true);say(praise(),"cheer",2200);
    if(step===E.length){firstTry("order",miss===0);setTimeout(()=>retellBox(el,"أَحْكي بِصَوْتي في جُمْلَتَيْنِ.",`أَبْدَأُ هكَذا: «${E[0].label}…»`,()=>{award("gold");setTimeout(()=>complete("order","رَتَّبْتَ الْأَحْداثَ وَحَكَيْتَها بِصَوْتِكَ!"),1500)}),1000)}}
   else{miss++;b.classList.add("shake");setTimeout(()=>b.classList.remove("shake"),500);tone(false);if(miss===1)addMistake("order","ماذا جاءَ أَوَّلًا؟",E.map(e=>e.t),0,E[i].t);say(`انْظُرْ إِلى الْخانَةِ: «${E[step].label}»… أَيُّ حَدَثٍ يُناسِبُها؟`,"think",4000)}});
 },
 message(el){
  el.appendChild(h(`<div class="inst"><span class="ic">💡</span>ماذا تَعَلَّمْتُ مِنَ الدَّرْسِ؟</div>`));
  const c=h(`<div class="card"></div>`);el.appendChild(c);
  mcq(c,{id:"message",q:"ماذا تَعَلَّمْتُ مِنْ دَرْسِ «"+D.title+"»؟",o:D.learned.o,a:D.learned.a,st:"message",hint:"تَذَكَّرْ ما حَدَثَ في النَّصِّ… ما الْفِكْرَةُ الَّتي تَجْمَعُهُ؟",onDone:()=>setTimeout(value,800)});
  function value(){const V=D.value;
   const w=h(`<div class="reveal" style="margin-top:26px">
    <div class="card" style="display:grid;grid-template-columns:${V.img?"200px ":""}1fr;gap:18px;align-items:center;background:linear-gradient(135deg,#F7F2FF,#fff)">${V.img?`<img src="${IMG}${V.img}.webp" alt="" style="width:200px;border-radius:20px">`:""}<div><h3 style="font-size:28px;color:var(--navy)">${V.head}</h3>${V.fact?`<p style="font-size:21px;line-height:1.8;margin:6px 0 0">🇦🇪 ${V.fact}</p>`:""}</div></div>
    <div class="card" style="margin-top:16px;background:var(--peach)"><h3 style="font-size:25px;color:#B76A12">🤔 ${V.dilemma}</h3><p style="font-size:20px;margin:6px 0 12px">أُفَكِّرُ وَأَقولُ جَوابي بِصَوْتٍ عالٍ، ثُمَّ أَكْشِفُ الْجَوابَ النَّموذَجِيَّ.</p><button class="btn ghost" id="rv">👁️ الْإِجابَةُ النَّموذَجِيَّةُ</button><p id="rvT" style="display:none;font-size:23px;line-height:1.9;margin:12px 0 0">${V.model}</p></div>
    <div id="pledge"></div></div>`);
   el.appendChild(w);w.scrollIntoView({behavior:"smooth",block:"start"});say("مَوْقِفٌ مِنْ حَياتِكَ… ماذا تَفْعَلُ أَنْتَ؟","idea",4000);
   w.querySelector("#rv").onclick=()=>{w.querySelector("#rvT").style.display="block";w.querySelector("#rv").remove();tone(true);showPledge()};
   const showPledge=()=>{const P=w.querySelector("#pledge");
    P.innerHTML=`<div class="card reveal" style="margin-top:16px;text-align:center"><div class="inst" style="justify-content:center;margin-top:0"><span class="ic">💛</span>${D.speak.head}</div><p style="font-size:25px;line-height:1.9;margin:0">${D.speak.frame}</p><button class="btn gold" id="pl" style="margin-top:14px">قُلْتُها، وَأَعِدُ أَنْ أَعْمَلَ بِها ✓</button></div><div id="cardOut"></div>`;
    P.querySelector("#pl").onclick=()=>{S.card={pledge:V.sana,head:V.head};save();P.querySelector("#pl").remove();
     P.querySelector("#cardOut").innerHTML=`<div class="mycard reveal"><div class="top">بِطاقَةُ قِيمَتي · حِراءٌ</div><h3>${V.head}</h3><div class="big">🏮</div><p>${V.sana}</p><div class="sig">تَظْهَرُ بِطاقَتُكَ لِأَهْلِكَ في تَقْريرِ وَلِيِّ الْأَمْرِ</div></div>`;
     if(!S.done.message){award("challenge");setTimeout(()=>complete("message","رَبَطْتَ الدَّرْسَ بِحَياتِكَ."),1700)}}};
   if(S.card)showPledge();
  }
 },
 family(el){const H=D.home;
  el.appendChild(h(`<div class="card reveal" style="display:grid;grid-template-columns:${H.img?"180px ":""}1fr;gap:18px;align-items:center;background:linear-gradient(135deg,#EFF9F3,#fff)">${H.img?`<img src="${IMG}${H.img}.webp" alt="" style="width:180px;border-radius:20px">`:""}<div><h3 style="font-size:30px;color:var(--navy)">مُهِمَّةُ الْبَيْتِ 🏠</h3><p style="font-size:24px;line-height:1.9;margin:6px 0 0"><b>${H.family}</b></p></div></div>`));
  el.appendChild(h(`<div class="inst" style="margin-top:22px"><span class="ic">👨‍👩‍👧</span>مَنْ شارَكْتُ مِنْ أُسْرَتي؟</div>`));
  const F=[["👨","أَبي"],["👩","أُمّي"],["👴","جَدّي"],["👵","جَدَّتي"],["👦","أَخي"],["👧","أُخْتي"]];
  const fam=h(`<div class="fam">${F.map((f,i)=>`<button class="fm ${S.fam.asked.includes(i)?"sel":""}" data-i="${i}"><span class="e">${f[0]}</span>${f[1]}</button>`).join("")}</div>`);el.appendChild(fam);
  fam.querySelectorAll(".fm").forEach(b=>b.onclick=()=>{const i=+b.dataset.i;const k=S.fam.asked.indexOf(i);if(k<0)S.fam.asked.push(i);else S.fam.asked.splice(k,1);b.classList.toggle("sel");save();tone(true)});
  if(H.task)el.appendChild(h(`<div class="card" style="margin-top:18px;background:#FFF9EC"><h4 style="margin:0 0 4px;font-family:'Thmanyah Display';font-size:22px;color:#9A6F1E">✏️ مُهِمَّتي</h4><p style="font-size:23px;line-height:1.9;margin:0">${H.task}</p></div>`));
  el.appendChild(h(`<div class="inst" style="margin-top:26px"><span class="ic">🏮</span>أُسْبوعُ الْقِراءَةِ: أَقْرَأُ النَّصَّ لِأُسْرَتي كُلَّ يَوْمٍ، فَيُضيءُ قِنْديلٌ.</div>`));
  const Dd=["السَّبْتُ","الْأَحَدُ","الْإِثْنَيْنِ","الثُّلاثاءُ","الْأَرْبِعاءُ","الْخَميسُ","الْجُمُعَةُ"];
  const lampSvg='<svg viewBox="0 0 100 120"><path d="M32 34 Q32 20 50 14 Q68 20 68 34Z" fill="#102A4C"/><rect x="26" y="34" width="48" height="7" rx="3.5" fill="#102A4C"/><path d="M29 44 L71 44 L78 100 Q50 114 22 100Z" fill="#FFF8E6" stroke="#102A4C" stroke-width="5"/><path class="fl" d="M50 56 L62 80 Q65 88 58 94 L42 94 Q35 88 38 80Z" fill="#D9CDB3"/></svg>';
  const wk=h(`<div class="week">${Dd.map((d,i)=>`<button class="day ${S.fam.week[i]!=null?"lit":""}" data-i="${i}">${d}${lampSvg}<div class="act">${S.fam.week[i]!=null?"📖":""}</div></button>`).join("")}</div>`);el.appendChild(wk);
  wk.querySelectorAll(".day").forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(S.fam.week[i]!=null)return;S.fam.week[i]=1;save();b.classList.add("lit");b.querySelector(".act").textContent="📖";tone(true);const n=Object.keys(S.fam.week).length;say(n>=7?"أَضاءَ أُسْبوعُكَ كُلُّهُ! أَنْتَ بَطَلُ الْقِراءَةِ.":`أَضاءَ ${n} مِنْ 7 قَناديلَ. عُدْ غَدًا لِتُضيءَ قِنْديلًا جَديدًا!`,"great",4000);if(n>=7)burst()});
  const fin=h(`<div class="center" style="margin-top:24px"><button class="btn gold" id="famDone">أَنْهَيْتُ مُهِمَّةَ الْبَيْتِ ✓</button></div>`);el.appendChild(fin);
  fin.querySelector("#famDone").onclick=()=>{if(!S.fam.asked.length){say("شارِكْ فَرْدًا واحِدًا مِنْ أُسْرَتِكَ عَلى الْأَقَلِّ، ثُمَّ الْمِسْ صورَتَهُ.","think",4500);fam.classList.add("shake");setTimeout(()=>fam.classList.remove("shake"),500);return}fin.remove();complete("family","شارَكْتَ أُسْرَتَكَ الدَّرْسَ. أُسْبوعُ الْقِراءَةِ يَبْقى مَفْتوحًا كُلَّ يَوْمٍ.")};
  say("هذِهِ مُهِمَّةٌ تَعْمَلُها مَعَ أَهْلِكَ. وَقَناديلُ الْأُسْبوعِ تُضيئُها يَوْمًا بَعْدَ يَوْمٍ.","wink",5000);
 },
 check(el){
  const Q=D.quiz;let qi=0,res=[];
  const box=h(`<div class="qbox"><div class="qprog">${Q.map(()=>"<i></i>").join("")}</div><div id="qa"></div></div>`);el.appendChild(box);
  const prog=()=>box.querySelectorAll(".qprog i").forEach((x,i)=>{x.className=i<res.length?(res[i]?"ok":"no"):i===qi?"cur":""});
  function ask(){prog();const q=Q[qi];const a=box.querySelector("#qa");a.innerHTML="";
   const c=h(`<div class="card reveal"><h3>${q.q}</h3><div class="o"></div><div class="hint"><button class="btn ghost" style="font-size:18px;padding:8px 18px">💡 تَلْميحٌ مِنْ سالِمٍ</button></div></div>`);a.appendChild(c);
   c.querySelector(".hint button").onclick=()=>say(q.h,"idea",5000);
   mcq(c.querySelector(".o"),{id:"q"+qi,q:q.q,o:q.o,a:q.a,st:"check",hint:q.h,onDone:ok=>{res.push(ok);qi++;prog();setTimeout(()=>qi<Q.length?ask():post(),900)}});}
  function post(){const score=res.filter(Boolean).length;S.quiz={score,of:Q.length};save();
   const a=box.querySelector("#qa");a.innerHTML="";
   a.appendChild(h(`<div class="card center reveal"><h3>أَجَبْتَ ${score} مِنْ ${Q.length} مِنَ الْمُحاوَلَةِ الْأولى</h3><p style="font-size:22px;margin:6px 0 0">${score===Q.length?"عَلامَةٌ كامِلَةٌ! 🌟":"وَالْأَسْئِلَةُ الَّتي أَخْطَأْتَ فيها تَنْتَظِرُكَ في دَفْتَرِ أَخْطائي لِتُراجِعَها."}</p></div>`));
   a.appendChild(h(`<div class="inst" style="margin-top:24px"><span class="ic">🧭</span>وَالْآنَ… كَيْفَ أَشْعُرُ بَعْدَ الرِّحْلَةِ؟</div>`));
   const r=h("<div></div>");a.appendChild(r);
   rating(r,S.post,()=>{if(!S.done.check){S.done.check=true;save();setTimeout(()=>{closeStation();setTimeout(showFinale,800)},900)}});
   say("قارِنْ نَفْسَكَ بِبِدايَةِ الرِّحْلَةِ… كَمْ تَقَدَّمْتَ؟","think",5000);}
  ask();say("الْقِنْديلُ الْأَخيرُ! وَإِنِ احْتَجْتَ فَاطْلُبْ تَلْميحًا.","cheer",4500);
 }
};

/* ================= بطاقة الكلمة ================= */
function showWord(k){const w=k.dataset.w,d=WORDS[w];if(!d)return;$("#wpPic").innerHTML=d.pic;$("#wpW").textContent=w;$("#wpM").textContent=d.m;$("#wordPop").classList.add("show");k.classList.add("seen");
 if(!S.words.includes(w)){S.words.push(w);save()}}
$("#wpOk").onclick=()=>$("#wordPop").classList.remove("show");
$("#wordPop").onclick=e=>{if(e.target.id==="wordPop")$("#wordPop").classList.remove("show")};
