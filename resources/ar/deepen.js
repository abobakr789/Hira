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
const bare=s=>String(s||"").replace(/[\u064B-\u0652\u0670\u0640]/g,"");
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
  const GLX0=p=>KW(p).replace(/(^|[\s«(\[–—"])([\u0621-\u0652\u0670\u0640]{2,})(?=$|[\s،.؛:!؟?»)\],"–—])/g,(a,pre,w)=>{ if(/<mark/.test(w)) return a; const m=look(w); return m?`${pre}<mark class="kw" data-ia data-m="${E(m)}" onclick="hxGl(this,event)">${w}</mark>`:a; });
  const GLX=p=>String(p).split(/(﴿[^﴾]*﴾)/).map(x=>/^﴿/.test(x)?`<span class="qf">${String(x).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}</span>`:(x?GLX0(x):"")).join("");
  D.bt.forEach((t,ti)=>{ const raw=String(t.body||"").split(/\n+/).map(x=>x.trim()).filter(Boolean), paras=[];
    raw.forEach(x=>{ const pv=paras[paras.length-1]; if(t.kind!=="poem"&&pv&&bare(pv).length>120&&!/[.!؟?:»"”)\]…]\s*$/.test(pv)) paras[paras.length-1]=pv+" "+x; else paras.push(x); });
    const pages=[];let cur=[],n=0;
    paras.forEach(p=>{ if(n+bare(p).length>520&&cur.length){pages.push(cur);cur=[];n=0;} cur.push(p); n+=bare(p).length; }); if(cur.length) pages.push(cur);
    const shown=pages.slice(0,3), rest=pages.slice(3), tot=shown.length;
    if(rest.length){ (window.HX_REST=window.HX_REST||{})["t"+ti]={title:E(t.title||"نَصُّ الْكِتابِ"),poem:t.kind==="poem",html:rest.map(pg=>pg.map(p=>`<p>${GLX(p)}</p>`).join("")).join('<hr>'),pages:E(t.pages||"")}; }
    shown.forEach((pg,pi)=>{ const len=pg.reduce((a,p)=>a+bare(p).length,0), fs=len<200?52:len<320?44:len<440?38:34, last=pi===tot-1&&rest.length;
      pre.push(slide(`d-text${ti}-${pi}`,E(t.title||"نَصُّ الْكِتابِ")+(tot>1?` (${pi+1}/${tot})`:""),"📖 نَصُّ الْكِتابِ",`<div class="story${t.kind==="poem"?" poem":""}" style="--fs:${fs}px"><div class="stx">`+pg.map((p,k)=>`<p${B(k+1)}>${GLX(p)}</p>`).join("")+`</div></div><div class="sbar"><span>📖 كِتابُ الطّالِبِ ${E(t.pages?("ص "+t.pages):"")}</span>`+(last?`<button class="hxmore" data-ia onclick="hxMore('t${ti}')">📖 أَكْمِلْ قِراءَةَ النَّصِّ ←</button>`:"")+(GM.size?`<span class="hxtip">✨ اُنْقُرِ الْكَلِمَةَ الْمُظَلَّلَةَ لِمَعْناها</span>`:"")+`</div>`,"[القراءة] قراءة نموذجية ثم قراءة الطلاب، مع النقر على الكلمات المظلّلة لعرض معانيها."+(last?" بقية النص في زر «أكمل قراءة النص».":""),8)); }); });
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
}

(function(){ if(window.hxGl) return;
  const QFU=(()=>{try{const sc=document.currentScript||[...document.scripts].find(x=>/deepen\.js/.test(x.src)); return new URL('../../art/fonts/amiri-quran.woff2',sc.src).href;}catch(e){return '../../../art/fonts/amiri-quran.woff2';}})();
  const css=`@font-face{font-family:'Amiri Quran';src:url('${QFU}') format('woff2');font-display:swap}.qf{font-family:'Amiri Quran','Amiri',serif;font-size:1.08em;line-height:2.1;color:#0F5132}
  mark.kw{background:#FFE58A;border-radius:10px;padding:0 6px;cursor:pointer;box-shadow:inset 0 -4px 0 #E8B90C;color:inherit;transition:background .2s}mark.kw:hover,mark.kw.on{background:#FFD23F}
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
    const f=document.querySelector(".sl"); if(f){pop.style.fontFamily=ov.style.fontFamily=getComputedStyle(f).fontFamily;} pop.innerHTML=`<b>${el.textContent}</b>${el.dataset.m}`; pop.style.display="block"; const r=el.getBoundingClientRect(), w=pop.offsetWidth, h=pop.offsetHeight;
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
