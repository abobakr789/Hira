/* حراء — تعميق عروض العربية (الصفوف 4–12): يقرأ بيانات الدرس من قاعدة البيانات ويضيف شرائح:
   خمّن الكلمة، الهدف والمعايير، قياس التقدّم (1–5) قبل الدرس وبعده، كنز الكلمات، أفكار الدرس، نص الكتاب،
   العمل الجماعي (خريطة + 4 مجموعات بتحدٍّ أكبر)، صح أم خطأ، تحدّي حراء السريع، نجمتان وأمنية، الهوية، بطاقة الخروج، رسالة البيت. */
(function(){
"use strict";
const CODE=window.HIRAA_CODE, CFG={url:"https://vsbktjbwjykgtkkqfblj.supabase.co",key:"sb_publishable_MQzKol3KQ5mQ0W0BeQc_Eg_dCyWhxV6"};
const boot=()=>{ if(window.__booted) return; if(!window.__boot){ window.__bootWanted=1; return; } window.__booted=1; window.__boot(); };
const E=s=>String(s==null?"":s).replace(/[٠-٩]/g,d=>"٠١٢٣٤٥٦٧٨٩".indexOf(d)).replace(/^\s*\d+\)\s*/,"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const KW=s=>E(s).replace(/\[\[(.+?)\]\]/g,'<mark>$1</mark>');
const LV=[["بُرونْزِيٌّ","#A0612F","#F6E7DA"],["فِضِّيٌّ","#5F6C78","#E9EDF1"],["ذَهَبِيٌّ","#B8860B","#FBF0D2"],["تَحَدٍّ","#6B46A8","#EEE7FA"]];
const BG=[["#FBF7EF","#B4532A","#FBE6D8"],["#EEF6F1","#1E7A5A","#D7EEE2"],["#EEF4FB","#2F64A8","#DCE8F7"],["#FDF1EA","#C2571A","#FBE0CF"],["#F4F0FB","#6B46A8","#E6DDF7"],["#FFF8E6","#B07A12","#FBEBC2"],["#FCF1F3","#B0395F","#F8DCE3"]];
const B=(n,k)=>` data-build-in="${k||"up"} ${n}"`;
const bare=s=>String(s||"").replace(/[\u064B-\u065F\u0670\u0640\u06D6-\u06ED]/g,"");
let LOGO="",FOOT="",K=0;
function slide(id,title,pill,body,note,mins,crit){
  const b=BG[(K++)%BG.length];
  const chips=(pill?`<span class="pill">${pill}</span>`:"")+(crit?`<span class="pill cr">${crit}</span>`:"")+(mins?`<span class="pill tm">⏱ ${mins} دَقائِقَ</span>`:"");
  return `<section class="sl" id="${id}" dir="rtl" style="--bg:${b[0]};--a:${b[1]};--a2:${b[2]};background:${b[0]}"><i class="dc" style="left:-140px;top:-160px;width:460px;height:460px;border-radius:50%;background:${b[1]};opacity:.08"></i><i class="dc" style="right:-120px;bottom:-200px;width:520px;height:520px;border-radius:50%;background:${b[1]};opacity:.07"></i><div class="hlogo">${LOGO}</div><h2 class="ht${bare(title).length>32?" s":""}">${title}</h2><div class="hrow">${chips}</div><div class="bd">${body}</div>${FOOT}<aside>${E(note||"")}</aside></section>`;
}
function shuffle(a,seed){let s=seed||7;a=a.slice();for(let i=a.length-1;i>0;i--){s=(s*9301+49297)%233280;const j=Math.floor(s/233280*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
async function load(){
  if(!window.supabase) throw new Error("no sb");
  const sb=window.supabase.createClient(CFG.url,CFG.key,{auth:{persistSession:true,autoRefreshToken:false,detectSessionInUrl:false}});
  const {data:l}=await sb.from("lessons").select("id,code,title_ar,objective_ar,book_pages").eq("code",CODE).maybeSingle();
  if(!l) throw new Error("no lesson");
  const yr=+CODE.split("-")[1].slice(1), track=/-NN-/.test(CODE)?"nonnative":"native";
  const [sc,sm,bt,idl,bank]=await Promise.all([
    sb.from("success_criteria").select("statement_ar,statement_en,solo,sort_order").eq("lesson_id",l.id).order("sort_order"),
    sb.from("lesson_summaries").select("content").eq("lesson_id",l.id).maybeSingle(),
    sb.from("lesson_book_texts").select("kind,title,body,pages,glossary").eq("lesson_id",l.id),
    sb.from("lesson_identity_links").select("connection_ar").eq("lesson_id",l.id),
    sb.rpc("teacher_bank",{p_year:yr,p_track:track,p_lessons:[l.id]}).then(r=>r,()=>({data:[]}))]);
  return {l,sc:sc.data||[],sm:(sm.data||{}).content||{},bt:bt.data||[],idl:idl.data||[],bank:(bank&&bank.data)||[]};
}
function build(D){
  const stage=document.getElementById("stage"), S=[...stage.querySelectorAll(".sl")];
  const ref=S.find(s=>s.querySelector(".hlogo"))||S[0]; LOGO=(S[1]||ref).querySelector(".hlogo")?(S[1]||ref).querySelector(".hlogo").innerHTML:""; const f=(S[1]||ref).querySelector(".ft"); FOOT=f?f.outerHTML:"";
  const sm=D.sm, crit=(D.sc.length?D.sc:[{statement_ar:D.l.objective_ar}]).slice(0,4).map(c=>c.statement_ar||c.statement_en);
  while(crit.length<4&&sm.do&&sm.do[crit.length-1]) crit.push(sm.do[crit.length-1]);
  const verb=c=>bare(c).split(/\s+/)[0]||"";
  const words=(sm.words||[]).slice(0,4).map(w=>{const p=String(w[1]||"").trim().split(/\s+/); let em="🔤"; if(p.length>1&&!/[\u0600-\u06FFA-Za-z0-9]/.test(p[p.length-1])) em=p.pop(); return [w[0],p.join(" "),em];});
  const pre=[],mid=[],post=[];
  // ---- goal & criteria ----
  const tag=k=>`الْمَجْموعَةُ ${k+1}`;
  pre.push(slide("d-goal","هَدَفُ الدَّرْسِ وَمَعاييرُ النَّجاحِ","إِلى أَيْنَ نَمْضي؟",`<div class="goalbox sm"><p>🎯 <b>هَدَفُ الدَّرْسِ:</b> ${E(D.l.objective_ar)}</p></div><div class="crs sm">`+crit.map((c,k)=>`<div class="crit" style="--c:${LV[k][1]};--c2:${LV[k][2]}"${B(k+1)}><b class="n">${k+1}</b><span class="vb">${E(verb(c))}</span><p>${E(c)}</p><span class="tag">${LV[k][0]} · ${tag(k)}</span></div>`).join("")+`</div>`,"[ناتج التعلّم ومعايير النجاح] اكشف المعايير واحدًا واحدًا، ووضّح أن كل مجموعة تعمل على معيار.",2));
  const prog=(id,t,p,inst)=>slide(id,t,p,`<p class="inst">${inst}</p><div class="prs">`+crit.map((c,k)=>`<div class="pr" style="--c:${LV[k][1]};--c2:${LV[k][2]}"><b class="n">${k+1}</b><p>${E(c)}</p><div class="fs p5">`+[1,2,3,4,5].map(v=>`<button class="fc n5" data-ia onclick="cnt(this)"><b>${v}</b><i>0</i></button>`).join("")+`</div></div>`).join("")+`</div><div class="leg"><span>1 = لَمْ أَتَعَلَّمْهُ بَعْدُ</span><span>3 = أَعْرِفُهُ جُزْئِيًّا</span><span>5 = أُتْقِنُهُ وَأَسْتَطيعُ شَرْحَهُ</span><button data-ia onclick="rst(this)">↺ تَصْفيرُ الْعَدِّ</button></div>`,"[قياس التقدّم] يقيّم كل طالب نفسه من 1 إلى 5 في كل معيار ويحتفظ بتقييمه. انقر على الرقم لتسجيل عدد الأيدي. القياس المباشر من زر «📈 قياس التقدّم».",2);
  pre.push(prog("progress","قِياسُ التَّقَدُّمِ: قَبْلَ الدَّرْسِ","أَيْنَ أَنا الْآنَ؟","قَيِّمْ نَفْسَكَ مِنْ 1 إِلى 5 في كُلِّ مِعْيارٍ قَبْلَ الدَّرْسِ، وَاحْتَفِظْ بِتَقْييمِكَ."));
  // ---- guess + vocab ----
  if(words.length){
    const cols=["#A0612F","#2F64A8","#1E7A5A","#C2571A"];
    pre.push(slide("d-guess","خَمِّنِ الْكَلِمَةَ!","تَحَدّي الْمُحَقِّقينَ",`<div class="clues" style="width:100%">`+words.map((w,k)=>`<div class="clue" style="--c:${cols[k]}"${B(k*2+1,"left")}><b class="n">${k+1}</b><p>مَعْناها: «${E(w[1])}» ${w[2]}</p><span class="wrv"${B(k*2+2,"pop")}>${E(w[0])}</span></div>`).join("")+`</div>`,"[تحدّي المحققين] اعرض المعنى، ويخمّن الطلاب الكلمة، ثم اكشفها.",3));
    pre.push(slide("d-vocab","كَنْزُ الْكَلِماتِ","الْمَعْنى وَالِاسْتِخْدامُ",`<div class="vg">`+words.map((w,k)=>`<div class="vc" data-ia onclick="this.classList.toggle('fl')"${B(k+1,"pop")}><div class="vf"><div class="vp"><div class="emd" style="width:200px;height:200px;font-size:116px;background:#FFF4E8">${w[2]}</div></div><p class="vw">${E(w[0])}</p><small>اُنْقُرْ لِلْمَعْنى</small></div><div class="vb2"><p class="vw s">${E(w[0])}</p><p class="vm">${E(w[1])}</p><p class="vm" style="font-size:28px;color:#7A5A2A">✍️ أُوَظِّفُها في جُمْلَةٍ مِنْ إِنْشائي.</p></div></div>`).join("")+`</div>`,"اعرض الكلمة، واطلب جملة من إنشاء الطلاب قبل قلب البطاقة.",6));
  }
  if((sm.learn||[]).length) pre.push(slide("d-learn","أَفْكارُ الدَّرْسِ","نَبْني الْفَهْمَ",`<div class="mg" style="--mfs:36px">`+sm.learn.slice(0,6).map((x,k)=>`<div class="cd mac" style="--c:${LV[k%4][1]};--c2:${LV[k%4][2]}"${B(k+1)}><p>${E(x[0]||"")} ${E(x[1]||"")}</p></div>`).join("")+`</div>`,"اشرح كل فكرة بمثال من الكتاب.",6));
  // ---- book texts: max 3 slides per text; the rest opens in a reader overlay; key words are highlighted with tap-to-meaning ----
  const GL=[]; (sm.words||[]).forEach(w=>GL.push([w[0],String(w[1]||"").replace(/\s*[^\u0600-\u06FFA-Za-z0-9\s()،.:؛-]+\s*$/u,"").trim()]));
  D.bt.forEach(t=>(Array.isArray(t.glossary)?t.glossary:[]).forEach(g=>{ if(g&&g[0]&&g[1]) GL.push([g[0],g[1]]); }));
  const core=w=>{let b=bare(w).replace(/[إأآٱ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه").replace(/[^\u0621-\u064A]/g,""); b=b.replace(/^(و|ف)?(ب|ل|ك)?(ال)/,"").replace(/^(و|ف)(?=..)/,""); return b;};
  const GM=new Map(); GL.forEach(([w,m])=>{ String(w).split(/[\/،,]| أو /).forEach(x=>{const c=core(x.trim()); if(c.length>=2&&!GM.has(c)) GM.set(c,m);}); });
  const look=tok=>{ const c0=core(tok); if(c0.length<2) return null; const cs=[c0]; if(/^[وفبلك]/.test(c0)&&c0.length>=4) cs.push(c0.slice(1)); if(/^[وف][بلك]/.test(c0)&&c0.length>=5) cs.push(c0.slice(2));
    for(const c of cs){ if(GM.has(c)) return GM.get(c); } for(const c of cs){ for(const [k,m] of GM){ if(k.length>=3&&c.startsWith(k)&&/^(ه|ها|هم|هما|ك|كم|ي|نا|ات|ون|ين|ان|وا|ت|تا)$/.test(c.slice(k.length))) return m; } } return null; };
  let SEEN=new Set(); const MK=(w,m)=>{ if(SEEN.has(m)) return null; SEEN.add(m); return `<mark class="kw" data-ia data-m="${E(m)}" onclick="hxGl(this,event)">${w}</mark>`; };
  const GLX0=p=>KW(p).replace(/(^|[\s«(\[–—"])([\u0621-\u0652\u0670\u0640]{2,})(?=$|[\s،.؛:!؟?»)\],"–—])/g,(a,pre,w)=>{ if(/<mark/.test(w)) return a; const m=look(w); const h=m&&MK(w,m); return h?`${pre}${h}`:a; });
  const GLX=p=>String(p).split(/(﴿[^﴾]*﴾)/).map(x=>/^﴿/.test(x)?`<span class="qf">${String(x).replace(/\u065E/g,"\u08F1").replace(/\u0656/g,"\u08F2").replace(/\u0657/g,"\u08F0").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])).split(/(\s+)/).map(w=>{ if(/^\s*$/.test(w)) return w; const m=look(w.replace(/[﴿﴾\u06DD٠-٩0-9]/g,"")); const h=m&&MK(w,m); return h||w; }).join("")}</span>`:(x?GLX0(x):"")).join("");
  D.bt.forEach((t,ti)=>{ const raw=String(t.body||"").split(/\n+/).map(x=>x.trim()).filter(Boolean), paras=[];
    raw.forEach(x=>{ const pv=paras[paras.length-1]; if(t.kind!=="poem"&&pv&&bare(pv).length>120&&!/[.!؟?:»"”)\]…]\s*$/.test(pv)) paras[paras.length-1]=pv+" "+x; else paras.push(x); });
    const pages=[];let cur=[],n=0;
    if(t.kind==="poem"){ const np=Math.ceil(paras.length/6), per=Math.ceil(paras.length/np); for(let i=0;i<paras.length;i+=per) pages.push(paras.slice(i,i+per)); }
    else { paras.forEach(p=>{ if(n+bare(p).length>480&&cur.length){pages.push(cur);cur=[];n=0;} cur.push(p); n+=bare(p).length; }); if(cur.length) pages.push(cur); }
    const tt=String(t.title||"نَصُّ الْكِتابِ").split(" — "), mainT=E(tt[0]), auth=tt.slice(1).join(" — ");
    const shown=pages.slice(0,3), rest=pages.slice(3), tot=shown.length;
    if(rest.length){ SEEN=new Set(); (window.HX_REST=window.HX_REST||{})["t"+ti]={title:mainT,poem:t.kind==="poem",html:rest.map(pg=>pg.map(p=>`<p>${GLX(p)}</p>`).join("")).join('<hr>'),pages:E(t.pages||"")}; }
    shown.forEach((pg,pi)=>{ SEEN=new Set(); const len=pg.reduce((a,p)=>a+bare(p).length,0), mx=Math.max(...pg.map(p=>bare(p).length)), fs=t.kind==="poem"?(pg.length<=4&&mx<60?46:pg.length<=5?42:38):(len<200?50:len<320?44:len<420?38:34), last=pi===tot-1&&rest.length;
      pre.push(slide(`d-text${ti}-${pi}`,mainT+(tot>1?` (${pi+1}/${tot})`:""),"📖 نَصُّ الْكِتابِ",`<div class="story${t.kind==="poem"?" poem":""}" style="--fs:${fs}px"><div class="stx">`+pg.map((p,k)=>`<p${B(k+1)}>${GLX(p)}</p>`).join("")+`</div></div><div class="sbar"><span>📖 كِتابُ الطّالِبِ ${E(t.pages?("ص "+t.pages):"")}${auth?` · ✍️ ${E(auth)}`:""}</span>`+(last?`<button class="hxmore" data-ia onclick="hxMore('t${ti}')">📖 أَكْمِلْ قِراءَةَ النَّصِّ ←</button>`:"")+(GM.size?`<span class="hxtip">✨ اُنْقُرِ الْكَلِمَةَ الْمُظَلَّلَةَ لِمَعْناها</span>`:"")+`</div>`,"[القراءة] قراءة نموذجية ثم قراءة الطلاب، مع النقر على الكلمات المظلّلة لعرض معانيها."+(last?" بقية النص في زر «أكمل قراءة النص».":""),8)); }); });
  if(sm.think) pre.push(slide("d-think","أُفَكِّرُ وَأَتَوَقَّعُ","فَكِّرْ · زاوِجْ · شارِكْ",`<div class="spk"><div class="cd spf"><p>${E(sm.think)}</p></div><p class="inst c">💬 أُفَكِّرُ وَحْدي ← أُناقِشُ زَميلي ← نُشارِكُ الصَّفَّ</p></div>`,"دقيقة تفكير فردي، ثم نقاش ثنائي، ثم مشاركة ثلاثة أزواج.",3));
  // ---- groups ----
  const roles=[["📖","الْقارِئُ"],["✏️","الْكاتِبُ"],["⏱","حارِسُ الْوَقْتِ"],["🎤","الْمُتَحَدِّثُ"]];
  post.push(slide("d-groups","خَريطَةُ الْعَمَلِ الْجَماعِيِّ","كُلُّ مَجْموعَةٍ = مِعْيارُ نَجاحٍ",`<div class="gm">`+crit.map((c,k)=>`<div class="gmc" style="--c:${LV[k][1]};--c2:${LV[k][2]}"${B(k+1)}><span class="lvt">${tag(k)} · ${LV[k][0]}</span><b style="font-size:40px">${E(verb(c))}</b><small>${E(c)}</small></div>`).join("")+`</div><div class="roles"${B(5)}>`+roles.map(r=>`<span><i>${r[0]}</i>${r[1]}</span>`).join("")+`</div><div class="flow"${B(6)}><span>⏱ 12 دَقيقَةً عَمَلٌ</span><b>←</b><span>🎤 نَعْرِضُ</span><b>←</b><span>⭐ نَجْمَتانِ وَأُمْنِيَةٌ</span><b>←</b><span>✅ نَتَحَقَّقُ</span></div>`,"[التعلّم التعاوني] لكل مجموعة معيار، ولكل طالب دور. المجموعة التي تنهي مهمتها تنتقل إلى «التحدّي الأكبر».",2));
  const CH=["نَصوغُ سُؤالًا تَحْليلِيًّا (لِماذا؟ كَيْفَ؟) عَنِ الدَّرْسِ، وَنُجيبُ عَنْهُ بِدَليلٍ.","نُقارِنُ بَيْنَ مِثالَيْنِ مِنَ الدَّرْسِ، وَنَسْتَنْتِجُ قاعِدَةً عامَّةً بِلُغَتِنا.","نُطَبِّقُ ما تَعَلَّمْناهُ في مَوْقِفٍ جَديدٍ مِنْ حَياتِنا، وَنُقَيِّمُ نَتيجَتَهُ.","نَبْتَكِرُ مُنْتَجًا قَصيرًا (فِقْرَةً، أَوْ حِوارًا، أَوْ مُخَطَّطًا) يُوَظِّفُ الْمِعْيارَ، وَنُبَرِّرُ اخْتِياراتِنا."];
  const DO=sm.do||[];
  crit.forEach((c,k)=>{
    const steps=[`نَقْرَأُ الْمِعْيارَ وَنَتَّفِقُ عَلى الْمَطْلوبِ.`,`نَعودُ إِلى الْكِتابِ وَالشَّرائِحِ وَنَجْمَعُ الْأَدِلَّةَ.`,`نُنْجِزُ الْمُهِمَّةَ: ${E(c)}`];
    post.push(slide(`d-g${k+1}`,`${tag(k)}: ${E(verb(c))}`,LV[k][0],`<div class="gw" style="--c:${LV[k][1]};--c2:${LV[k][2]}"><div class="gwm"><div class="cd gread"><span class="lb">🎯 مِعْيارُنا</span><p class="gt sm">${E(c)}</p></div><div class="cd gsteps"><span class="lb">🧩 الْمُهِمَّةُ الْأَساسِيَّةُ · لِلْجَميعِ</span>`+steps.map((s,j)=>`<p${B(j+1)}><b>${j+1}</b>${s}</p>`).join("")+`</div></div><div class="gws"><div class="gch"${B(steps.length+1,"pop")}><span class="lb">⭐ التَّحَدّي الْأَكْبَرُ</span><p>${CH[k]}</p></div><div class="gmeta"><p>🏆 الْمُنْتَجُ: عَرْضٌ قَصيرٌ (دَقيقَتانِ) بِالدَّليلِ.</p><p>🤝 دَعْمٌ: شَرائِحُ «كَنْزُ الْكَلِماتِ» وَ«أَفْكارُ الدَّرْسِ».</p></div></div></div>`,`المجموعة ${k+1}: المهمة الأساسية للجميع، ثم «التحدّي الأكبر» لمن ينهي.`,12,`مِعْيارُ النَّجاحِ ${k+1}`));
  });
  // ---- true/false ----
  const qz=(sm.quiz||[]).slice(0,4);
  if(qz.length) post.push(slide("d-tf","صَحيحٌ أَمْ خَطَأٌ؟","أُفَكِّرُ وَأُصَحِّحُ",`<p class="inst">👍 صَحيحٌ أَمْ 👎 خَطَأٌ؟ نُشيرُ بِالْإِبْهامِ، ثُمَّ نُعَلِّلُ.</p><div class="tf">`+qz.map((q,k)=>`<div class="tfr"><div class="cd tfq"><b class="n">${k+1}</b><p>${E(q[0])}</p></div><div class="tfa ${q[1]?"y":"x"}"${B(k+1,"pop")}><b>${q[1]?"👍":"👎"}</b><p>${q[1]?"صَحيحٌ.":"خَطَأٌ: نُصَحِّحُ الْعِبارَةَ بِجُمْلَةٍ كامِلَةٍ."}</p></div></div>`).join("")+`</div>`,"اقرأ العبارة، ثم اطلب تعليلًا لكل إجابة.",4));
  // ---- quick challenge from bank ----
  const mcq=shuffle((D.bank||[]).filter(q=>q.qtype==="mcq"&&Array.isArray(q.options)),CODE.length).slice(0,5);
  if(mcq.length) post.push(slide("d-quick","تَحَدّي حِراءَ السَّريعُ",`${mcq.length} أَسْئِلَةٍ`,`<div class="qq">`+mcq.map((q,k)=>{const o=q.options; const ci=o.findIndex(x=>x.id===q.correct); return `<div class="qr" style="--c:${["#A0612F","#2F64A8","#1E7A5A","#C2571A","#6B46A8"][k]}"><b class="n">${k+1}</b><div><p class="q">${E(q.stem_ar)}</p><p class="o">${o.map((x,j)=>`<span class="qo"><i class="ob">${j+1}</i><bdi>${E(x.text)}</bdi></span>`).join("")}</p></div><span class="qa"${B(k+1,"pop")}>الْإِجابَةُ: ${ci+1}</span></div>`;}).join("")+`</div>`,"يجيب الطلاب بالأصابع، ثم اكشف الإجابة واطلب التعليل.",5));
  post.push(slide("d-feedback","نَجْمَتانِ وَأُمْنِيَةٌ","التَّغْذِيَةُ الرّاجِعَةُ مِنَ الْأَقْرانِ",`<div class="cd fbi"><p>💛 تَعْليقُكَ عَلى عَرْضِ زُمَلائِكَ: دَقيقٌ، لَطيفٌ، مُفيدٌ.</p></div><div class="fb"><div class="fbc"${B(1,"pop")}><span class="wi">⭐</span><b>النَّجْمَةُ الْأولى</b><p>«أَعْجَبَني في عَرْضِكُمْ …»</p></div><div class="fbc"${B(2,"pop")}><span class="wi">⭐</span><b>النَّجْمَةُ الثّانِيَةُ</b><p>«كانَ دَليلُكُمْ مُقْنِعًا لِأَنَّ …»</p></div><div class="fbc w"${B(3,"pop")}><span class="wi">🌱</span><b>الْأُمْنِيَةُ</b><p>«أَقْتَرِحُ أَنْ …»</p></div></div><div class="chips sm"${B(4)}><span>✔️ دَليلٌ مِنَ النَّصِّ</span><span>✔️ مُصْطَلَحٌ صَحيحٌ</span><span>✔️ لُغَةٌ سَليمَةٌ</span><span>✔️ إِلْقاءٌ واضِحٌ</span></div>`,"بعد كل عرض: نجمتان وأمنية.",4));
  if(D.idl.length) post.push(slide("d-identity","الدَّرْسُ وَالْهُوِيَّةُ الْوَطَنِيَّةُ","قِيَمُنا وَوَطَنُنا",`<div class="val"><div class="vlp"><img src="../../../art/flagboy.webp" alt=""></div><div class="vlc">`+D.idl.slice(0,2).map((x,k)=>`<div class="cd"${B(k+1)}><span class="lb">🇦🇪 رَبْطٌ بِالْهُوِيَّةِ</span><p style="font-size:36px;font-weight:700">${E(x.connection_ar)}</p></div>`).join("")+`<p class="tip"${B(3)}>💡 كَيْفَ أُطَبِّقُ هذا في مَدْرَسَتي وَوَطَني هذا الْأُسْبوعَ؟</p></div></div>`,"اربط الدرس بقيم الهوية الوطنية، واطلب مثالًا من حياة الطلاب.",4));
  post.push(prog("progress2","قِياسُ التَّقَدُّمِ: بَعْدَ الدَّرْسِ","كَمْ تَقَدَّمْتُ؟","أَعِدْ تَقْييمَ نَفْسِكَ، وَقارِنْهُ بِبِدايَةِ الْحِصَّةِ: في أَيِّ مِعْيارٍ تَقَدَّمْتَ أَكْثَرَ؟"));
  const ex=(D.bank||[]).filter(q=>q.qtype==="mcq"&&!mcq.includes(q)).slice(0,2).concat(mcq.slice(3,5)).slice(0,2);
  post.push(slide("d-exit","بِطاقَةُ الْخُروجِ","أُغادِرُ الصَّفَّ بِبِطاقَةٍ",`<div class="ex">`+(ex.length?ex.map((q,k)=>`<div class="cd exq" style="--a:${["#6B46A8","#1E7A5A"][k]}"${B(k+1)}><span class="lb">${["✍️ أُجيبُ","🧠 أُعَلِّلُ"][k]}</span><p>${E(q.stem_ar)}</p><p style="font-size:28px;color:#556">ثُمَّ أَكْتُبُ سَبَبَ اخْتِياري.</p></div>`).join(""):`<div class="cd exq"><p>${E(crit[3])}</p></div>`)+`</div><div class="exb"${B(3)}><div class="eb g"><p>😄 ما أَتْقَنْتُهُ الْيَوْمَ …</p></div><div class="eb y"><p>🤔 ما أَحْتاجُ أَنْ أُراجِعَهُ …</p></div></div><p class="note"${B(4)}>📲 ثُمَّ نَحُلُّ بِطاقَةَ الْخُروجِ عَلى الْمَنَصَّةِ.</p>`,"[بطاقة الخروج] يجيب كل طالب وحده، ثم يحلّ بطاقة الخروج على المنصة.",3));
  if(DO.length) post.push(slide("d-home","رِسالَتي إِلى الْبَيْتِ","أَتَعَلَّمُ خارِجَ الصَّفِّ",`<div class="hmx"><div class="hmp"><img src="../../../art/family.webp" alt=""></div><div class="hmc">`+DO.slice(0,2).map((d,k)=>`<div class="cd${k?" hmt":""}"${B(k+1)}><span class="lb">${k?"🎯 مُهِمَّةُ أَداءٍ":"🏠 واجِبي"}</span><p>${E(d)}</p></div>`).join("")+`</div></div>`,"ذكّر الطلاب بالمهمة وموعد عرضها.",1));
  // ---- assemble: cover · (static before goal) · pre · static rest · post ----
  const isGoal=s=>/وجهتنا|هدف الحصة|أهداف درسنا|ناتج التعلّم|معايير النجاح|Goal/.test(bare(s.querySelector(".hrow,.ht")?.textContent+" "+s.querySelector(".ht")?.textContent));
  const isOut=s=>/تذكرة الخروج|بطاقة الخروج|رسالتي إلى البيت|واجبي في البيت/.test(bare((s.querySelector(".ht")||{}).textContent+" "+(s.querySelector(".hrow")||{}).textContent));
  const cover=S[0], rest=S.slice(1).filter(s=>!isOut(s)), gi=rest.findIndex(isGoal);
  const before=gi>=0?rest.slice(0,gi):rest.slice(0,Math.min(2,rest.length)), after=gi>=0?rest.slice(gi+1):rest.slice(Math.min(2,rest.length));
  const html=t=>{const d=document.createElement("div");d.innerHTML=t;return [...d.children];};
  stage.innerHTML=""; [cover,...before,...html(pre.join("")),...after,...html(post.join(""))].forEach(n=>stage.appendChild(n));
  try{cine(D,stage);}catch(e){console.warn("cine:",e);}
}

/* ===== حراء · السينما: انتقالات ذكية حسب علاقة الشرائح + حركة + KWL + من واقعنا + أطبّق + مخطّط متحرّك + أنواع التغذية الراجعة + الإجابات النموذجية + صور المعاني ===== */
function cine(D,stage){
  const sm=D.sm||{}, X=sm.x||{}, KEYK="hiraa-kwl-"+CODE;
  const html=t=>{const d=document.createElement("div");d.innerHTML=t;return [...d.children];};
  const S0=()=>[...stage.querySelectorAll(".sl")];
  const after=(id,nodes)=>{const ref=typeof id==="string"?document.getElementById(id):id; nodes.forEach(n=>{ if(ref&&ref.parentNode===stage){ ref.after(n); } else stage.appendChild(n); }); return nodes[nodes.length-1];};
  const before=(id,nodes)=>{const ref=document.getElementById(id); nodes.forEach(n=>{ if(ref&&ref.parentNode===stage) ref.before(n); else stage.appendChild(n); });};
  const MA=(h,lbl)=>`<button class="mabtn" data-ia onclick="this.nextElementSibling.classList.toggle('on')">💡 ${lbl||"الْإِجابَةُ النَّموذَجِيَّةُ"}</button><div class="mabox" data-ia onclick="this.classList.remove('on')"><b>💡 ${lbl||"الْإِجابَةُ النَّموذَجِيَّةُ"}</b>${h}</div>`;
  const learnL=(X.kwlL&&X.kwlL.length?X.kwlL:(sm.learn||[]).map(x=>(x[0]||"")+" "+(x[1]||""))).slice(0,5);
  // ---- KWL (before) ----
  const kcol=(k,t,ic,c,c2,body)=>`<div class="kwc" style="--c:${c};--c2:${c2}"${B(k)}><div class="kwh"><span class="kwi">${ic}</span><b>${t}</b></div>${body}</div>`;
  const ed=(f,ph)=>`<div class="kwe" contenteditable="true" data-ia data-kwl="${f}" data-ph="${ph}"></div>`;
  const kwl1=slide("d-kwl","ماذا أَعْرِفُ؟ وَماذا أُريدُ أَنْ أَعْرِفَ؟","جَدْوَلُ (K · W · L)",`<div class="kw3">`+
    kcol(1,"أَعْرِفُ (K)","🧠","#2F64A8","#DCE8F7",ed("k","نَكْتُبُ ما نَعْرِفُهُ عَنْ «"+E(D.l.title_ar)+"»…"))+
    kcol(2,"أُريدُ أَنْ أَعْرِفَ (W)","❓","#B07A12","#FBEBC2",ed("w","أَسْئِلَتُنا عَنِ الدَّرْسِ…"))+
    kcol(3,"تَعَلَّمْتُ (L)","🌱","#1E7A5A","#D7EEE2",`<div class="kwlock">🔒 نُكْمِلُهُ في آخِرِ الدَّرْسِ</div>`)+`</div>`,
    "[KWL] اكتب على الشريحة ما يعرفه الطلاب (K) وأسئلتهم (W). ما تكتبه يُحفظ ويظهر في جدول آخر الدرس.",4);
  // ---- KWL (after) ----
  const kwl2=slide("d-kwl2","ماذا تَعَلَّمْتُ؟","نُكْمِلُ جَدْوَلَ (K · W · L)",`<div class="kw3">`+
    kcol(1,"أَعْرِفُ (K)","🧠","#2F64A8","#DCE8F7",ed("k",""))+
    kcol(2,"أُريدُ أَنْ أَعْرِفَ (W)","❓","#B07A12","#FBEBC2",ed("w","")+`<p class="kwt">✔️ هَلْ أَجَبْنا عَنْ أَسْئِلَتِنا؟</p>`)+
    kcol(3,"تَعَلَّمْتُ (L)","🌱","#1E7A5A","#D7EEE2",ed("l","ما تَعَلَّمْناهُ الْيَوْمَ…"))+`</div>`+
    (learnL.length?MA(`<ul>${learnL.map(x=>`<li>${E(x)}</li>`).join("")}</ul>`,"إِجابَةٌ نَموذَجِيَّةٌ لِعَمودِ (L)"):""),
    "[KWL] راجعوا أسئلة (W): أيّها أجبنا عنه؟ ثم يكتب الطلاب ما تعلّموه (L). الإجابة النموذجية بعد مشاركاتهم.",4);
  // ---- real life ----
  let real=null; if(X.real) real=slide("d-real",X.real.title||"مِنْ واقِعِنا","🇦🇪 الدَّرْسُ في حَياتِنا",`<div class="rl">${X.real.img?`<div class="rlp"><img class="kb" src="${X.real.img}" alt=""></div>`:""}<div class="rlc"><div class="cd"${B(1)}><p>${E(X.real.text)}</p></div>${X.real.q?`<div class="cd rlq"${B(2)}><span class="lb">💬 نُناقِشُ</span><p>${E(X.real.q)}</p></div>`:""}${X.real.model?MA(`<p>${E(X.real.model)}</p>`):""}</div></div>`,"[من واقعنا] اربط الدرس بحياة الطلاب في الإمارات، واستمع إلى أمثلتهم قبل الإجابة النموذجية.",4);
  // ---- story (visual storytelling on a lesson image) ----
  let story=null; if(X.story) story=slide("d-story",X.story.title,X.story.pill||"قِصَّةٌ مُصَوَّرَةٌ",`<div class="sty"><div class="styp"><img class="kb" src="${X.story.img}" alt=""><i class="spot"></i></div><div class="stys${X.story.steps.length>5?" many":""}">`+X.story.steps.map((s,k)=>`<div class="stp" style="--k:${k}"${B(k+1,"left")}><b class="n">${k+1}</b><div><p class="t">${E(s[0])}</p><p class="d">${E(s[1])}</p></div></div>`).join("")+`</div></div>`,X.story.note||"اكشف المراحل واحدة واحدة، واطلب من الطلاب وصف ما يحدث في كل مرحلة.",5);
  // ---- animated chart ----
  let chart=null; if(X.chart){ const c=X.chart, mx=Math.max(...c.bars.map(b=>b[1]));
    chart=slide("d-chart",c.title,c.pill||"مُخَطَّطٌ مُتَحَرِّكٌ",`<div class="ch"><div class="chb">`+c.bars.map((b,k)=>`<div class="bar" style="--h:${Math.round(b[1]/mx*100)}%;--c:${b[2]||LV[k%4][1]};--d:${k*.25}s"${B(k+1,"up")}><span class="bv">${E(b[1])}${c.unit?" "+E(c.unit):""}</span><i></i><span class="bl">${E(b[0])}</span></div>`).join("")+`</div>${c.q?`<div class="cd chq"${B(c.bars.length+1)}><span class="lb">📊 نَقْرَأُ الْمُخَطَّطَ</span><p>${E(c.q)}</p></div>`:""}${c.model?MA(`<p>${E(c.model)}</p>`):""}</div>`,c.note||"اكشف الأعمدة واحدًا واحدًا، واطلب من الطلاب قراءة المخطّط والمقارنة.",4); }
  // ---- apply in my life ----
  let apply=null; if(X.apply) apply=slide("d-apply",X.apply.title||"أُطَبِّقُ في حَياتي","لَوْ أُتيحَتْ لي الْفُرْصَةُ…",`<div class="ap"><div class="app"><img src="${X.apply.img||"../../../art/bulb.webp"}" alt=""></div><div class="apc"><div class="cd"${B(1)}><p class="apq">${E(X.apply.q)}</p></div><div class="aps"${B(2)}>${(X.apply.scaffold||["أَخْتارُ…","لِأَنَّ…","وَسَأَبْدَأُ بِـ…"]).map(s=>`<span>${E(s)}</span>`).join("")}</div>${MA(`<p>${E(X.apply.model)}</p>`)}</div></div>`,"[التطبيق الشخصي] فكّر · زاوج · شارك، ثم اعرض الإجابة النموذجية بعد إجابات الطلاب.",5);
  // ---- four feedback types ----
  const fb4=slide("d-fb4","أَنْواعُ التَّغْذِيَةِ الرّاجِعَةِ","نَتَعَلَّمُ مِنْ بَعْضِنا",`<div class="f4">`+[["🎤","عَلى عَرْضِ الْمَجْموعَةِ","تُعَلِّقُ كُلُّ مَجْموعَةٍ عَلى عَرْضِ مَجْموعَةٍ أُخْرى بِدَليلٍ.","#2F64A8","#DCE8F7"],["🤝","مِنَ الْأَقْرانِ","نَجْمَتانِ وَأُمْنِيَةٌ لِزَميلي: دَقيقَةٌ، لَطيفَةٌ، مُفيدَةٌ.","#B0395F","#F8DCE3"],["🪞","التَّأَمُّلُ الذّاتِيُّ","ما الَّذي أَتْقَنْتُهُ؟ وَما الَّذي سَأُحَسِّنُهُ؟","#6B46A8","#E6DDF7"],["👩‍🏫","مِنَ الْمُعَلِّمِ","مُلاحَظَةٌ واحِدَةٌ تَدْفَعُني إِلى الْخُطْوَةِ التّالِيَةِ.","#1E7A5A","#D7EEE2"]].map((f,k)=>`<div class="f4c" style="--c:${f[3]};--c2:${f[4]}"${B(k+1,"pop")}><span class="wi">${f[0]}</span><b>${f[1]}</b><p>${f[2]}</p></div>`).join("")+`</div>`,"بعد العروض: تعليق المجموعات، ثم الأقران، ثم تأمل ذاتي قصير، ثم ملاحظة المعلم.",4);
  // ---- place ----
  const goal=document.getElementById("d-goal"); if(goal) after(goal,html(kwl1)); else { const s=S0(); if(s[1]) s[1].after(...html(kwl1)); }
  const texts=S0().filter(s=>/^d-text/.test(s.id)); let anchor=texts.length?texts[texts.length-1]:(document.getElementById("d-learn")||document.getElementById("d-vocab"));
  [story,chart,real].forEach(x=>{ if(x){ anchor=after(anchor,html(x)); } });
  if(apply) before(document.getElementById("d-tf")?"d-tf":(document.getElementById("d-quick")?"d-quick":"d-feedback"),html(apply));
  after(document.getElementById("d-feedback"),html(fb4));
  before("progress2",html(kwl2));
  // ---- model answers on existing slides ----
  Object.entries(X.ans||{}).forEach(([id,h])=>{ const s=document.getElementById(id); if(!s) return; const w=document.createElement("div"); w.className="mawrap"; w.innerHTML=MA(h); s.appendChild(w); });
  // ---- lesson images on existing slides ----
  Object.entries(X.img||{}).forEach(([id,o])=>{ const s=document.getElementById(id); if(!s) return; const im=document.createElement("img"); im.src=o.src; im.alt=""; im.className="limg kb"+(o.cls?" "+o.cls:""); if(o.style) im.setAttribute("style",o.style); s.appendChild(im); });
  // ---- pictures with word meanings ----
  const VI=X.vimg||{}; const vkey=w=>bare(w).replace(/[^\u0621-\u064A]/g,"");
  stage.querySelectorAll("#d-vocab .vc,#d-guess .clue").forEach(c=>{ const w=(c.querySelector(".vw,.wrv")||{}).textContent||""; const src=VI[vkey(w)]; if(!src) return; const em=c.querySelector(".emd"); if(em){ em.outerHTML=`<img class="vimg" src="${src}" alt="">`; } else { const i=document.createElement("img"); i.className="vimg sm"; i.src=src; i.alt=""; c.prepend(i);} });
  (X.vcards||[]).length&&(()=>{ const vc=slide("d-vpics","كَلِماتٌ وَصُوَرٌ","أَرى الْكَلِمَةَ وَأَفْهَمُها",`<div class="vpg">`+X.vcards.map((v,k)=>`<div class="vpc" data-ia onclick="this.classList.toggle('fl')"${B(k+1,"pop")}><div class="vpf"><img src="${v[2]}" alt=""><p class="vw">${E(v[0])}</p><small>اُنْقُرْ لِلْمَعْنى</small></div><div class="vpb"><p class="vw s">${E(v[0])}</p><p class="vm">${E(v[1])}</p>${v[3]?`<p class="vx">✍️ ${E(v[3])}</p>`:""}</div></div>`).join("")+`</div>`,"اعرض الصورة أولًا واطلب من الطلاب توقّع معنى الكلمة، ثم اقلب البطاقة."+(X.vcredit?" (الصور: Twemoji – CC-BY 4.0)":""),6); const v0=document.getElementById("d-vocab")||document.getElementById("d-guess")||document.getElementById("d-kwl"); after(v0,html(vc)); })();
  // ---- story spotlight follows the revealed step ----
  const ss=document.getElementById("d-story"); if(ss&&X.story&&X.story.spots){ const sp=ss.querySelector(".spot"), steps=[...ss.querySelectorAll(".stp")]; const upd=()=>{ const v=steps.filter(s=>!s.classList.contains("hid")); const k=v.length-1; if(k>=0&&X.story.spots[k]){ sp.style.setProperty("--sx",X.story.spots[k][0]+"%"); sp.style.setProperty("--sy",X.story.spots[k][1]+"%"); sp.style.opacity=1; } else sp.style.opacity=0; }; new MutationObserver(upd).observe(ss,{attributes:true,subtree:true,attributeFilter:["class"]}); upd(); }
  // ---- persist KWL ----
  let st={}; try{st=JSON.parse(localStorage.getItem(KEYK)||"{}");}catch(e){}
  stage.querySelectorAll("[data-kwl]").forEach(el=>{ const f=el.dataset.kwl; if(st[f]) el.innerHTML=st[f]; el.addEventListener("input",()=>{ st[f]=el.innerHTML; stage.querySelectorAll(`[data-kwl="${f}"]`).forEach(o=>{ if(o!==el) o.innerHTML=el.innerHTML; }); try{localStorage.setItem(KEYK,JSON.stringify(st));}catch(e){} }); ["click","keydown","keyup"].forEach(t=>el.addEventListener(t,e=>e.stopPropagation())); });
}
/* ---- smart transitions (View Transitions) ---- */
(function(){
  const rtl=true;
  const cat=id=>{ id=id||""; if(id==="cover") return "cover"; if(/^d-text|^d-story/.test(id)) return "text"; if(/^d-g\d|^d-groups/.test(id)) return "group"; if(/^progress/.test(id)) return "measure"; if(/^(d-tf|d-quick|d-exit|s8|d-kwl2)/.test(id)) return "check"; if(/^(d-goal|d-kwl$)/.test(id)) return "plan"; if(/^(d-vocab|d-guess|d-vpics)/.test(id)) return "words"; if(/^(d-chart|d-real|d-apply)/.test(id)) return "life"; if(/^d-f/.test(id)) return "feedback"; return "content"; };
  const stem=id=>(id||"").replace(/\d+$/,"");
  function pick(a,b,dir){ const ca=cat(a.id), cb=cat(b.id), fwd=dir>0;
    if(ca==="cover"||cb==="cover") return "zoom";
    if(stem(a.id)===stem(b.id)&&stem(a.id)!==a.id) return fwd===rtl?"push-r":"push-l";
    if(ca===cb&&(ca==="group"||ca==="words"||ca==="text")) return fwd===rtl?"push-r":"push-l";
    if(cb==="measure") return fwd?"flip-r":"flip";
    if(cb==="text") return "focus";
    if(cb==="group"||cb==="plan") return "mask";
    if(cb==="check") return fwd===rtl?"wipe-r":"wipe-l";
    if(cb==="life"||cb==="words") return "zoomin";
    if(ca===cb) return fwd===rtl?"push-r":"push-l";
    return "focus"; }
  const nm=(s,on)=>{ if(!s) return; s.style.viewTransitionName=on?"slide":""; const h=s.querySelector(".ht,h2,h1"); if(h) h.style.viewTransitionName=on?"ttl":""; const l=s.querySelector(".hlogo"); if(l) l.style.viewTransitionName=on?"logo":""; };
  window.__hxShow=function(orig,n,end){
    if(!window.__hxOpt){ window.__hxOpt=1; addOpt(); const sel=document.getElementById("fx"); try{ if(sel&&localStorage.getItem("hiraa-deck-fx")==="smart"&&sel.value!=="smart"){ sel.value="smart"; sel.dispatchEvent(new Event("change")); } }catch(e){} }
    const S=[...document.querySelectorAll("#stage .sl")]; const fx=(document.body.className.match(/fx-(\S+)/)||[])[1]||"smart";
    const cur=S.find(s=>s.classList.contains("on")), nx=S[Math.max(0,Math.min(S.length-1,n))];
    if(fx!=="smart"||!document.startViewTransition||!cur||cur===nx||matchMedia("(prefers-reduced-motion: reduce)").matches){ document.body.classList.remove("vt"); return orig(n,end); }
    document.body.classList.add("vt"); const dir=S.indexOf(nx)>S.indexOf(cur)?1:-1; document.documentElement.dataset.tr=pick(cur,nx,dir);
    nm(cur,true); const t=document.startViewTransition(()=>{ nm(cur,false); orig(n,end); nm(nx,true); });
    t.finished.catch(()=>{}).then(()=>nm(nx,false));
  };
  const addOpt=()=>{ const sel=document.getElementById("fx"); if(!sel||sel.querySelector('option[value="smart"]')) return; const o=document.createElement("option"); o.value="smart"; o.textContent="✨ ذَكِيٌّ سينَمائِيٌّ"; sel.prepend(o); try{ if(!localStorage.getItem("hiraa-deck-fx-v2")){ localStorage.setItem("hiraa-deck-fx","smart"); localStorage.setItem("hiraa-deck-fx-v2","1"); } }catch(e){} };
  document.readyState==="loading"?document.addEventListener("DOMContentLoaded",addOpt):addOpt();
  addEventListener("pointerdown",e=>{ const st=document.getElementById("stage"); if(!st) return; const r=st.getBoundingClientRect(); document.documentElement.style.setProperty("--mx",((e.clientX-r.left)/r.width*100).toFixed(1)+"%"); document.documentElement.style.setProperty("--my",((e.clientY-r.top)/r.height*100).toFixed(1)+"%"); },true);
  const css=`body.fx-smart:not(.vt) .sl{transition:opacity .9s cubic-bezier(.2,.7,.2,1),transform 1.1s cubic-bezier(.2,.7,.2,1),filter .9s}
body.fx-smart:not(.vt) .sl:not(.on){transform:scale(1.05);filter:blur(10px)}
body.fx-smart.vt .sl{transition:none}
::view-transition-group(*){animation-duration:.75s;animation-timing-function:cubic-bezier(.22,.8,.2,1)}
::view-transition-old(root),::view-transition-new(root){animation:none}
::view-transition-image-pair(slide){isolation:isolate;perspective:1800px}
@keyframes vt-fade-out{to{opacity:0}}
@keyframes vt-fade-in{from{opacity:0}}
@keyframes vt-push-out-l{to{transform:translateX(-14%);opacity:0;filter:blur(4px)}}
@keyframes vt-push-in-r{from{transform:translateX(14%);opacity:0;filter:blur(4px)}}
@keyframes vt-push-out-r{to{transform:translateX(14%);opacity:0;filter:blur(4px)}}
@keyframes vt-push-in-l{from{transform:translateX(-14%);opacity:0;filter:blur(4px)}}
@keyframes vt-zoom-out{to{transform:scale(1.35);opacity:0;filter:blur(12px)}}
@keyframes vt-zoom-in{from{transform:scale(.88);opacity:0}}
@keyframes vt-focus-old{to{transform:scale(.96);opacity:0;filter:blur(14px)}}
@keyframes vt-focus-new{from{transform:scale(1.06);opacity:0;filter:blur(14px)}}
@keyframes vt-mask-circle{from{clip-path:circle(0% at var(--mx,50%) var(--my,50%))}to{clip-path:circle(150% at var(--mx,50%) var(--my,50%))}}
@keyframes vt-mask-wipe-r{from{clip-path:inset(0 0 0 100%)}to{clip-path:inset(0 0 0 0)}}
@keyframes vt-mask-wipe-l{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes vt-dim{to{opacity:.35;transform:scale(.98)}}
@keyframes vt-flip-out{to{transform:rotateY(-70deg) translateZ(-200px);opacity:0}}
@keyframes vt-flip-in{from{transform:rotateY(70deg) translateZ(-200px);opacity:0}}
@keyframes vt-flip-out-r{to{transform:rotateY(70deg) translateZ(-200px);opacity:0}}
@keyframes vt-flip-in-r{from{transform:rotateY(-70deg) translateZ(-200px);opacity:0}}
html[data-tr=fade]::view-transition-old(slide){animation:vt-fade-out .6s both}
html[data-tr=fade]::view-transition-new(slide){animation:vt-fade-in .6s both}
html[data-tr=push-l]::view-transition-old(slide){animation:vt-push-out-l .7s both}
html[data-tr=push-l]::view-transition-new(slide){animation:vt-push-in-r .7s both}
html[data-tr=push-r]::view-transition-old(slide){animation:vt-push-out-r .7s both}
html[data-tr=push-r]::view-transition-new(slide){animation:vt-push-in-l .7s both}
html[data-tr=zoom]::view-transition-old(slide){animation:vt-zoom-out .9s both}
html[data-tr=zoom]::view-transition-new(slide){animation:vt-zoom-in .9s .1s both}
html[data-tr=focus]::view-transition-old(slide){animation:vt-focus-old .8s both}
html[data-tr=focus]::view-transition-new(slide){animation:vt-focus-new .8s .05s both}
html[data-tr=mask]::view-transition-old(slide){animation:vt-dim .9s both}
html[data-tr=mask]::view-transition-new(slide){animation:vt-mask-circle .9s cubic-bezier(.6,0,.2,1) both}
html[data-tr=wipe-r]::view-transition-old(slide){animation:vt-dim .8s both}
html[data-tr=wipe-r]::view-transition-new(slide){animation:vt-mask-wipe-r .8s cubic-bezier(.6,0,.2,1) both}
html[data-tr=wipe-l]::view-transition-old(slide){animation:vt-dim .8s both}
html[data-tr=wipe-l]::view-transition-new(slide){animation:vt-mask-wipe-l .8s cubic-bezier(.6,0,.2,1) both}
html[data-tr=flip]::view-transition-old(slide){animation:vt-flip-out .8s both;transform-origin:center}
html[data-tr=flip]::view-transition-new(slide){animation:vt-flip-in .8s .15s both;transform-origin:center}
html[data-tr=flip-r]::view-transition-old(slide){animation:vt-flip-out-r .8s both}
html[data-tr=flip-r]::view-transition-new(slide){animation:vt-flip-in-r .8s .15s both}
::view-transition-group(ttl){animation-duration:.8s}
::view-transition-group(logo),::view-transition-group(foot),::view-transition-group(dots){animation-duration:.6s}
@media (prefers-reduced-motion:reduce){::view-transition-group(*),::view-transition-old(*),::view-transition-new(*){animation:none!important}}
  @keyframes vt-zi-old{to{opacity:0;transform:scale(.92);filter:blur(6px)}}@keyframes vt-zi-new{from{opacity:0;transform:perspective(1600px) translateZ(-260px) rotateX(8deg)}}
  html[data-tr=zoomin]::view-transition-old(slide){animation:vt-zi-old .7s both}html[data-tr=zoomin]::view-transition-new(slide){animation:vt-zi-new .9s .05s cubic-bezier(.2,.8,.2,1) both}
  body.vt .sl{transition:none!important}
  /* motion graphics */
  @keyframes hx-drift{0%{transform:translate(0,0) rotate(0)}100%{transform:translate(40px,-30px) rotate(25deg)}}
  @keyframes hx-kb{0%{transform:scale(1) translate(0,0)}100%{transform:scale(1.12) translate(-2%,-2%)}}
  @keyframes hx-rise{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:none}}
  @keyframes hx-pulse{0%,100%{box-shadow:0 0 0 0 rgba(255,210,63,.55)}50%{box-shadow:0 0 0 26px rgba(255,210,63,0)}}
  .sl.on i.dc{animation:hx-drift 16s ease-in-out infinite alternate}
  .sl.on img.kb{animation:hx-kb 22s ease-in-out infinite alternate}
  .limg{position:absolute;border-radius:36px;box-shadow:0 24px 50px rgba(0,0,0,.18);object-fit:cover;z-index:1}
  .mabtn{position:absolute;left:60px;bottom:70px;z-index:6;font:inherit;font-size:28px;font-weight:700;background:#FFD23F;color:#3A2A00;border:0;border-radius:999px;padding:12px 28px;cursor:pointer;box-shadow:0 10px 24px rgba(0,0,0,.18);animation:hx-pulse 2.6s infinite}
  .mabox{position:absolute;left:60px;right:60px;bottom:150px;z-index:7;background:#FFFDF3;border:3px solid #FFD23F;border-radius:30px;padding:26px 36px;font-size:32px;line-height:1.75;box-shadow:0 26px 60px rgba(0,0,0,.22);opacity:0;transform:translateY(30px) scale(.97);pointer-events:none;transition:.5s cubic-bezier(.2,.8,.2,1);max-height:640px;overflow:auto}
  .mabox.on{opacity:1;transform:none;pointer-events:auto}.mabox b{display:block;color:#8A6400;margin-bottom:6px}.mabox ul{margin:0;padding-inline-start:1.2em}.mabox p{margin:.2em 0}
  .kw3{display:grid;grid-template-columns:repeat(3,1fr);gap:26px;width:100%;height:540px}
  .kwc{background:var(--c2);border-radius:30px;padding:20px 22px;display:flex;flex-direction:column;border-top:10px solid var(--c);box-shadow:0 14px 30px rgba(0,0,0,.08)}
  .kwh{display:flex;align-items:center;gap:12px;font-size:36px;color:var(--c)}.kwi{font-size:46px}
  .kwe{flex:1;margin-top:12px;background:#fff;border-radius:20px;padding:14px 18px;font-size:30px;line-height:1.6;outline:none;overflow:auto;border:2px dashed rgba(0,0,0,.12)}
  .kwe:empty:before{content:attr(data-ph);color:#9AA3AD}
  .kwlock{flex:1;margin-top:12px;display:flex;align-items:center;justify-content:center;font-size:30px;color:var(--c);background:rgba(255,255,255,.6);border-radius:20px}
  .kwt{font-size:24px;color:#7A5A2A;margin:8px 0 0}
  .rl,.ap,.sty{display:grid;grid-template-columns:44% 1fr;gap:40px;width:100%;align-items:center}
  .rlp,.app,.styp{position:relative;height:620px;border-radius:40px;overflow:hidden;box-shadow:0 26px 50px rgba(0,0,0,.16);background:#fff}
  .rlp img{width:100%;height:100%;object-fit:cover}.styp{background:#36B3EA}.styp img{width:100%;height:100%;object-fit:contain}.app img{width:100%;height:100%;object-fit:contain;padding:30px;box-sizing:border-box}
  .rlc,.apc{display:flex;flex-direction:column;gap:22px;font-size:34px;line-height:1.7}.rlq{border-inline-start:10px solid var(--a)}
  .apq{font-size:40px;font-weight:700}.aps{display:flex;gap:14px;flex-wrap:wrap}.aps span{background:var(--a2);color:var(--a);border-radius:999px;padding:10px 24px;font-size:30px;font-weight:700}
  .stys{display:flex;flex-direction:column;gap:14px}.stp{display:flex;gap:16px;align-items:flex-start;background:#fff;border-radius:24px;padding:12px 20px;box-shadow:0 10px 22px rgba(0,0,0,.07);border-inline-start:8px solid var(--a)}
  .stp .t{font-size:32px;font-weight:700;margin:0;color:var(--a)}.stp .d{font-size:26px;margin:2px 0 0;line-height:1.5}
  .spot{position:absolute;inset:0;background:radial-gradient(circle at var(--sx,50%) var(--sy,50%),transparent 0 18%,rgba(15,25,40,.28) 34%);pointer-events:none;transition:.8s}
  .ch{width:100%;display:flex;flex-direction:column;gap:22px}.chb{display:flex;align-items:flex-end;justify-content:center;gap:60px;height:470px;padding:0 40px;border-bottom:4px solid #C9B98F}
  .bar{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;width:200px}
  .bar i{display:block;width:100%;height:0;border-radius:22px 22px 0 0;background:linear-gradient(180deg,var(--c),color-mix(in srgb,var(--c) 65%,#fff));transition:height 1.4s cubic-bezier(.2,.8,.2,1) var(--d)}
  .sl.on .bar:not(.hid) i{height:max(14px,calc(var(--h) * .8))}
  .bv{font-size:40px;font-weight:800;color:var(--c);margin-bottom:6px}.bl{position:absolute;transform:translateY(54px);font-size:28px;font-weight:700;color:#444;text-align:center;width:240px}
  .bar{position:relative}.chq{margin-top:50px}
  .f4{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;width:100%}
  .f4c{background:var(--c2);border-radius:30px;padding:28px 22px;text-align:center;border-bottom:10px solid var(--c);box-shadow:0 14px 30px rgba(0,0,0,.08);min-height:420px}
  .f4c .wi{font-size:80px;display:block}.f4c b{font-size:36px;color:var(--c);display:block;margin:10px 0}.f4c p{font-size:29px;line-height:1.6;margin:0}
  .vimg{width:200px;height:200px;object-fit:cover;border-radius:28px;box-shadow:0 10px 24px rgba(0,0,0,.15)}.vimg.sm{width:120px;height:120px;float:left;margin-inline-end:14px}
  .vpg{display:grid;grid-template-columns:repeat(4,1fr);gap:26px;width:100%}
  .vpc{perspective:1400px;height:600px;cursor:pointer;position:relative}
  .vpf,.vpb{position:absolute;inset:0;border-radius:30px;backface-visibility:hidden;transition:transform .8s cubic-bezier(.2,.8,.2,1);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;box-shadow:0 18px 36px rgba(0,0,0,.12)}
  .vpf{background:#fff}.vpf img{width:100%;height:330px;object-fit:cover;border-radius:22px}.vpf .vw{font-size:44px;font-weight:800;color:var(--a);margin:16px 0 4px}.vpf small{font-size:22px;color:#7A5A2A}
  .vpb{background:var(--a2);transform:rotateY(180deg)}.vpb .vw{font-size:42px;color:var(--a);margin:0 0 10px}.vpb .vm{font-size:32px;line-height:1.6;text-align:center;margin:0}.vpb .vx{font-size:26px;color:#7A5A2A;text-align:center}
  .stys.many{gap:9px}.stys.many .stp{padding:7px 16px}.stys.many .stp .t{font-size:27px}.stys.many .stp .d{font-size:22px}.vcr{position:static;display:block;width:100%;text-align:left;margin:22px 0 0;font-size:18px;color:#8A8A8A;direction:ltr}.vpc.fl .vpf{transform:rotateY(-180deg)}.vpc.fl .vpb{transform:rotateY(0)}`;
  const st=document.createElement("style"); st.textContent=css; document.head.appendChild(st);
})();

(function(){ if(window.hxGl) return;
  const QFU=(()=>{try{const sc=document.currentScript||[...document.scripts].find(x=>/deepen\.js/.test(x.src)); return new URL('../../art/fonts/amiri-quran.woff2',sc.src).href;}catch(e){return '../../../art/fonts/amiri-quran.woff2';}})();
  const css=`@font-face{font-family:'Amiri Quran';src:url('${QFU}') format('woff2');font-display:swap}.qf{font-family:'Amiri Quran','Amiri',serif;font-size:1.08em;line-height:2.1;color:#0F5132}
  mark.kw{background:#FFE58A;border-radius:8px;padding:0 3px;cursor:pointer;box-shadow:inset 0 -3px 0 #E8B90C;color:inherit;transition:background .2s;-webkit-box-decoration-break:clone;box-decoration-break:clone}.story .stx{max-height:100%;overflow-y:auto;scrollbar-width:thin}.story.poem .stx p{margin:.15em 0;line-height:1.75}mark.kw:hover,mark.kw.on{background:#FFD23F}
  .hxmore{font:700 30px/1 inherit;font-family:inherit;background:var(--a,#B4532A);color:#fff;border:0;border-radius:999px;padding:14px 30px;cursor:pointer;box-shadow:0 8px 18px rgba(0,0,0,.15)}.hxtip{font-size:24px;color:#7A5A2A}
  #hx-pop{position:fixed;z-index:10001;max-width:min(560px,86vw);background:#1F2A44;color:#fff;font-family:inherit;font-size:clamp(17px,2vw,28px);line-height:1.7;padding:14px 22px;border-radius:18px;box-shadow:0 18px 40px rgba(0,0,0,.3);direction:rtl;display:none}
  #hx-pop b{color:#FFD23F;display:block;font-size:1.15em}
  #hx-ov{position:fixed;inset:0;z-index:10000;background:rgba(20,24,36,.6);display:none;align-items:center;justify-content:center;direction:rtl}
  #hx-ov .pn{background:#FFFDF8;width:min(1200px,94vw);max-height:90vh;overflow:auto;border-radius:28px;padding:clamp(18px,3vw,46px);box-shadow:0 30px 70px rgba(0,0,0,.35);font-size:clamp(18px,2.3vw,34px);line-height:2}
  #hx-ov .pn h3{margin:0 0 10px;font-size:1.2em;color:#B4532A}#hx-ov .pn hr{border:0;border-top:2px dashed #E9D9BC;margin:18px 0}#hx-ov .pn.poem p{text-align:center}
  #hx-ov .x{position:sticky;top:0;float:left;font-size:1.1em;background:#1F2A44;color:#fff;border:0;border-radius:50%;width:2em;height:2em;cursor:pointer}`;
  const st=document.createElement("style"); st.textContent=css; document.head.appendChild(st);
  const pop=document.createElement("div"); pop.id="hx-pop"; const ov=document.createElement("div"); ov.id="hx-ov"; ov.setAttribute("data-ia","");
  const add=()=>{document.body.appendChild(pop);document.body.appendChild(ov); const f=document.querySelector(".sl"); const ff=f?getComputedStyle(f).fontFamily:""; if(ff){pop.style.fontFamily=ff;ov.style.fontFamily=ff;}}; document.body?add():document.addEventListener("DOMContentLoaded",add);
  let on=null; const hide=()=>{pop.style.display="none"; if(on){on.classList.remove("on");on=null;}};
  window.hxGl=function(el,ev){ if(ev) ev.stopPropagation(); if(on===el){hide();return;} hide(); on=el; el.classList.add("on");
    const f=document.querySelector(".sl"); if(f){pop.style.fontFamily=ov.style.fontFamily=getComputedStyle(f).fontFamily;} pop.innerHTML=`<b${el.closest(".qf")?' style="font-family:\'Amiri Quran\',serif;font-weight:400"':""}>${el.textContent}</b>${el.dataset.m}`; pop.style.display="block"; const r=el.getBoundingClientRect(), w=pop.offsetWidth, h=pop.offsetHeight;
    pop.style.left=Math.max(8,Math.min(innerWidth-w-8,r.left+r.width/2-w/2))+"px"; pop.style.top=(r.top-h-12>8?r.top-h-12:r.bottom+12)+"px"; };
  window.hxMore=function(k){ const d=(window.HX_REST||{})[k]; if(!d) return; hide(); const f=document.querySelector(".sl"); if(f) ov.style.fontFamily=getComputedStyle(f).fontFamily;
    ov.innerHTML=`<div class="pn${d.poem?" poem":""}" data-ia><button class="x" data-ia onclick="hxClose()">✕</button><h3>📖 ${d.title} — بَقِيَّةُ النَّصِّ</h3>${d.html}${d.pages?`<p style="color:#7A5A2A;font-size:.75em">📖 كِتابُ الطّالِبِ ص ${d.pages}</p>`:""}</div>`; ov.style.display="flex"; };
  window.hxClose=function(){ ov.style.display="none"; hide(); };
  ov.addEventListener("click",e=>{ if(e.target===ov) hxClose(); e.stopPropagation(); });
  document.addEventListener("click",e=>{ if(!e.target.closest("mark.kw,#hx-pop")) hide(); },true);
  document.addEventListener("keydown",e=>{ if(ov.style.display==="flex"){ if(e.key==="Escape") hxClose(); if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"," ","PageDown","PageUp","Home","End","Enter"].includes(e.key)) e.stopPropagation(); } else if(e.key==="Escape") hide(); },true);
})();
window.HIRAA_DEEP=1;
const t=setTimeout(boot,9000);
(function go(){
  if(!window.supabase&&!window.HIRAA_MOCK){ const s=document.createElement("script"); s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js"; s.onload=go2; s.onerror=()=>{clearTimeout(t);boot();}; document.head.appendChild(s);} else go2();
  function go2(){ (window.HIRAA_MOCK?Promise.resolve(window.HIRAA_MOCK):load()).then(D=>{try{build(D);}catch(e){console.error(e);} clearTimeout(t); boot();}).catch(e=>{console.warn("deepen:",e); clearTimeout(t); boot();}); }
})();
})();
