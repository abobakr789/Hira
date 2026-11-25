/* ===== محطة القراءة: نص الكتاب الأصلي كاملًا (يصل من المنصة حسب صلاحية الطالب) ===== */
let BOOK=null;
const kwBook=t=>t.replace(/\[\[(.+?)\]\]/g,(_,w)=>{const c=HL[w];return c&&WORDS[c]?`<span class="kw" data-w="${c}" tabindex="0">${w}</span>`:`<span class="kw nk">${w}</span>`});
function bookBlocks(B){
 const body=String(B.body||"").replace(/\r/g,"").trim();
 if(B.kind==="poem"){const L=body.split("\n").map(s=>s.trim()).filter(Boolean);const out=[];for(let i=0;i<L.length;i+=2)out.push({poem:true,lines:L.slice(i,i+2)});return out}
 const parts=/\n\s*\n/.test(body)?body.split(/\n\s*\n/):body.split("\n");
 return parts.map(s=>s.trim()).filter(Boolean).map(s=>({lines:s.split("\n").map(x=>x.trim()).filter(Boolean)}));
}
function readBook(el){
 if(!BOOK||!BOOK.body){
  el.appendChild(h(`<div class="card center reveal"><div style="font-size:70px">📖</div><h3 style="font-size:28px;color:var(--navy)">نَصُّ الْكِتابِ</h3><p style="font-size:22px;line-height:1.9">يَظْهَرُ نَصُّ الْكِتابِ كامِلًا حينَ تَفْتَحُ الرِّحْلَةَ مِنْ صَفْحَةِ الدَّرْسِ في مِنَصَّةِ حِراءٍ.<br>اقْرَأِ النَّصَّ مِنْ كِتابِكَ الْآنَ، ثُمَّ الْمِسِ الزِّرَّ.</p><button class="btn gold" id="rdOk">قَرَأْتُ النَّصَّ ✓</button></div>`));
  el.querySelector("#rdOk").onclick=()=>{el.querySelector("#rdOk").remove();if(!S.done.read)complete("read","قَرَأْتَ النَّصَّ!")};return}
 const blocks=bookBlocks(BOOK),N=blocks.length;
 el.appendChild(h(`<div class="inst"><span class="ic">📖</span>${READHEAD||"أَقْرَأُ النَّصَّ"}: أَقْرَأُ النَّصَّ كُلَّهُ جُزْءًا جُزْءًا، وَأَلْمِسُ الْكَلِمَةَ الْمُلَوَّنَةَ لِأَعْرِفَ مَعْناها.</div>`));
 if(BOOK.audioUrl)el.appendChild(h(`<div class="card reveal" style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:18px;background:linear-gradient(135deg,#EEF6FF,#fff)"><span style="font-size:40px">🎧</span><b style="font-family:'Thmanyah Display';font-size:22px;color:var(--navy)">أَسْتَمِعُ إِلى النَّصِّ</b><audio controls preload="none" src="${esc(BOOK.audioUrl)}" style="flex:1;min-width:220px"></audio></div>`));
 const story=h(`<div class="story"></div>`);el.appendChild(story);
 const meanings=Object.keys(WORDS).map(k=>WORDS[k].m);
 const next=i=>{if(i+1<N&&story.children.length===i+1){setTimeout(()=>{addScene(i+1);story.lastChild.scrollIntoView({behavior:"smooth",block:"center"})},600)}
  else if(i+1===N&&!S.done.read){setTimeout(()=>complete("read","قَرَأْتَ نَصَّ الْكِتابِ كُلَّهُ!"),700)}};
 function addScene(i){const b=blocks[i];
  const raw=b.lines.join("\n");const kws=[...raw.matchAll(/\[\[(.+?)\]\]/g)].map(m=>m[1]).filter(w=>HL[w]&&WORDS[HL[w]]);
  let q=PQ&&PQ[i];
  if(!q&&kws.length){const w=kws[0],m=WORDS[HL[w]].m;const o=[m,...shuffle(meanings.filter(x=>x!==m)).slice(0,2)];q={q:`ما مَعْنى «${w}»؟`,o,a:0}}
  (window.__RQ=window.__RQ||[])[i]=q||null;
  const img=SCENE_IMG&&SCENE_IMG[i];const em=kws.length&&WORDS[HL[kws[0]]].e?WORDS[HL[kws[0]]].e:"📖";
  const pv=img?`<img src="${IMG}${img}.webp" alt="">`:`<div style="display:grid;place-items:center;width:100%;height:100%"><span style="font-size:90px;line-height:1">${em}</span></div>`;
  const len=raw.length,fs=b.poem?30:len>420?23:len>240?26:30;
  const txt=b.lines.map(l=>kwBook(l)).join(b.poem?"<br>":"<br>");
  const n=h(`<div class="scene reveal${b.poem?" verse":""}" style="--tint:${["#EEF0FA","#E8F5EC","#FDEEE8","#FFF3DD","#F1ECFA"][i%5]}"><span class="n">${i+1} / ${N}</span><div class="pic">${pv}</div><div><div class="txt" style="font-size:${fs}px${b.poem?";text-align:center":""}">${txt}</div>${q?`<div class="think"><h4>🤔 أَتَوَقَّفُ وَأُفَكِّرُ: ${q.q}</h4><div class="tq"></div></div>`:`<div class="tq2" style="margin-top:10px"></div>`}</div></div>`);
  story.appendChild(n);
  n.querySelectorAll(".kw[data-w]").forEach(k=>k.onclick=()=>showWord(k));
  if(q)mcq(n.querySelector(".tq"),{id:"read"+i,q:q.q,o:q.o,a:q.a,st:"read",hint:q.hint||"ارْجِعْ إِلى هذا الْجُزْءِ مِنَ النَّصِّ، وَالْمِسِ الْكَلِمَةَ الْمُلَوَّنَةَ.",onDone:()=>next(i)});
  else{const bt=h(`<button class="btn ghost">قَرَأْتُهُ ✓</button>`);n.querySelector(".tq2").appendChild(bt);bt.onclick=()=>{bt.disabled=true;tone(true);next(i)}}
 }
 if(S.done.read)blocks.forEach((_,i)=>addScene(i));else addScene(0);
 say("اقْرَأْ بِصَوْتٍ واضِحٍ، ثُمَّ أَجِبْ لِيَنْفَتِحَ الْجُزْءُ التّالي.","listen",5500);
}
