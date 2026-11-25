/* المسار التشخيصي — وحدة مستقلة تُدمج في index.html عبر build.py.
   تتتبّع تعثر الطالب في مخرج إلى أقدم متطلب سابق متعثر فيه (خريطة data/prereqs-islamic.json).
   الأسئلة من بنك حراء عبر الدالة public.diag_questions، والتصحيح عبر prep_grade دون حفظ. لا تكتب شيئًا في القاعدة. */
(function(){
"use strict";
const D=window.HIRAA_PREREQ||{nodes:[],edges:[]};
const NODE=Object.fromEntries(D.nodes.map(n=>[n.code,n]));
const PRE={},SUC={};D.edges.forEach(e=>{(PRE[e.to]=PRE[e.to]||[]).push(e.from);(SUC[e.from]=SUC[e.from]||[]).push(e.to)});
const T={
 title:['المسار التشخيصي','Diagnostic path'],
 intro:['اختبار قصير يبحث عن أصل التعثر، لا عن الدرس الذي ظهر فيه الخطأ فقط. إن أخطأتَ في مخرج، نختبرك فيما يحتاجه قبله حتى نصل إلى الجذر.','A short check that looks for the root of a difficulty, not only the lesson where the mistake showed. If you miss an outcome, we test what it needs before it.'],
 grade:['الصف','Year'],start:['ابدأ التشخيص','Start'],again:['أعد التشخيص','Retake'],
 signIn:['سجّل الدخول لتبدأ التشخيص.','Sign in to start.'],
 none:['لا توجد خريطة تشخيص لهذا الصف بعد.','No diagnostic map for this year yet.'],
 draft:['نسخة تجريبية: خريطة المتطلبات قيد مراجعة المعلم.','Preview: the prerequisite map is awaiting teacher review.'],
 loading:['جارٍ التحميل…','Loading…'],q:['سؤال','Question'],of:['من','of'],checking:['جارٍ التصحيح…','Checking…'],
 errRpc:['لم تُفعَّل بعد دالة الأسئلة في قاعدة البيانات. أبلغ المشرف.','The question function is not enabled in the database yet. Tell the administrator.'],
 err:['تعذّر إتمام التشخيص. حاول لاحقًا.','Could not complete the check. Try again later.'],
 sumOk:['أحسنت: أنت متمكّن من كل ما اختبرناه.','Well done: you are secure in everything we tested.'],
 sumRoot:n=>[`وجدنا ${n} ${n===1?'أصلًا':'أصول'} للتعثر. ابدأ علاجها بالترتيب.`,`We found ${n} root ${n===1?'gap':'gaps'}. Work on them in order.`],
 root:['أصل التعثر','Root gap'],affected:['متأثر بما قبله','Affected by an earlier gap'],ok:['متمكّن','Secure'],na:['لا أسئلة كافية','Not enough questions'],
 startHere:['ابدأ من هنا','Start here'],afterRoot:n=>['بعد معالجة: '+n,'After fixing: '+n],open:['افتح الدرس','Open lesson'],
 map:['خريطة المتطلبات','Prerequisite map'],needs:['يعتمد على','Needs'],yr:['ص','Y'],
 score:['صحيح','correct'],note:['النتيجة تُحفظ على هذا الجهاز فقط.','The result is kept on this device only.'],
 classView:['لوحة الفصل','Class view'],noRuns:['لا نتائج تشخيص من طلابك بعد.','No diagnostic results from your students yet.'],errRuns:['تعذّر تحميل النتائج. قد لا يكون جدول النتائج مُفعَّلًا بعد.','Could not load results. The results table may not be enabled yet.'],
 mastery:['نسبة التمكّن في كل مخرج','Mastery per outcome'],groups:['مجموعات علاج مقترحة حسب أصل التعثر','Suggested remediation groups by root gap'],students:['طالب','students'],noRoot:['دون أصل متعثر','No root gap'],latest:['آخر تشخيص لكل طالب','Latest run per student'],back:['رجوع','Back'],
 stage:['المرحلة','Stage'],why:['لماذا هذه الأسئلة؟ أخطأتَ في مخرج، فنختبر ما يسبقه.','Why these? You missed an outcome, so we test what comes before it.']
};
let C=null;
const L=()=>C&&C.lang&&C.lang()==='en'?1:0;
const t=k=>{const v=T[k];return Array.isArray(v)?v[L()]:v};
const tf=(k,n)=>T[k](n)[L()];
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const ntitle=c=>NODE[c].t[L()]||NODE[c].t[0];
const PASS=(r,a)=>a>=2&&r>=Math.ceil(a*2/3);
const ar=n=>L()?String(n):String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);

function targetsFor(g){
  let ts=D.nodes.filter(n=>n.year===g);
  if(!ts.length)ts=D.nodes.filter(n=>n.year<=g&&!(SUC[n.code]||[]).length);
  return ts.map(n=>n.code);
}
let R=null;

/* ---------- الأسئلة والتصحيح ---------- */
async function fetchQs(codes){
  const {data,error}=await C.sb.rpc('diag_questions',{p_codes:codes,p_n:3});
  if(error)throw Object.assign(new Error(error.message),{rpc:true});
  const by={};(data||[]).forEach(r=>{(by[r.oc]=by[r.oc]||[]).push(r)});return by;
}
async function gradeAll(ans){
  const {data,error}=await C.sb.rpc('prep_grade',{p_term:0,p_answers:ans,p_save:false});
  if(error)throw error;return (data&&data.items)||{};
}
function ask(qs,stageNo,total){
  return new Promise(resolve=>{
    const ans={};let i=0;
    const draw=()=>{
      if(i>=qs.length){resolve(ans);return}
      const q=qs[i],opts=shuffle(Array.isArray(q.options)?q.options:[]);
      $('dgApp').innerHTML=`<div class="dg-bar">${qs.map((_,k)=>`<i class="${k<i?'ok':k===i?'cur':''}"></i>`).join('')}</div>
       <p class="dg-hint">${t('stage')} ${ar(stageNo)} · ${t('q')} ${ar(i+1)} ${t('of')} ${ar(qs.length)}${stageNo>1?'<br>'+esc(t('why')):''}</p>
       <div class="dg-card"><div class="dg-k">${esc(ntitle(q.oc))}</div><p class="dg-q">${esc(L()&&q.stem_en?q.stem_en:q.stem_ar)}</p>
       <div class="dg-opts">${opts.map(o=>`<button class="dg-opt" data-id="${esc(o.id)}">${esc(o.text)}</button>`).join('')}</div></div>`;
      document.querySelectorAll('.dg-opt').forEach(b=>b.onclick=()=>{ans[q.qid]=b.dataset.id;i++;draw()});
    };
    draw();
  });
}
async function runStage(codes,stageNo){
  const by=await fetchQs(codes);
  const qs=[];
  codes.forEach(c=>{const g=by[c]||[];if(g.length<2){R.res[c]={na:true,asked:g.length,right:0,pass:false}}else g.forEach(q=>qs.push(q))});
  if(!qs.length)return;
  const ans=await ask(shuffle(qs),stageNo);
  $('dgApp').innerHTML=`<p class="dg-hint">${t('checking')}</p>`;
  const items=await gradeAll(ans);
  codes.forEach(c=>{if(R.res[c])return;const g=by[c];let r=0;g.forEach(q=>{if(items[q.qid]&&items[q.qid].ok)r++});R.res[c]={asked:g.length,right:r,pass:PASS(r,g.length)}});
}
async function run(g){
  R={g,res:{}};let stage=targetsFor(g),n=1;
  try{
    while(stage.length&&n<=6){
      await runStage(stage,n);
      const next=[];stage.forEach(c=>{const r=R.res[c];if(r&&!r.na&&!r.pass)(PRE[c]||[]).forEach(p=>{if(!R.res[p]&&!next.includes(p))next.push(p)})});
      stage=next;n++;
    }
  }catch(e){$('dgApp').innerHTML=`<div class="dg-card"><p>${esc(e&&e.rpc?t('errRpc'):t('err'))}</p><button class="dg-btn" id="dgBack">${t('again')}</button></div>`;$('dgBack').onclick=landing;return}
  result();
}

/* ---------- التحليل ---------- */
function analyse(){
  const st={};
  const failed=c=>R.res[c]&&!R.res[c].na&&!R.res[c].pass;
  Object.keys(R.res).forEach(c=>{
    const r=R.res[c];
    st[c]=r.na?'na':r.pass?'ok':((PRE[c]||[]).some(failed)?'affected':'root');
  });
  const roots=(c,seen=new Set())=>{if(seen.has(c))return[];seen.add(c);if(st[c]==='root')return[c];return (PRE[c]||[]).filter(failed).flatMap(p=>roots(p,seen))};
  return {st,roots};
}
async function lessonsFor(codes){
  const out={};
  try{
    const {data}=await C.sb.from('learning_outcomes').select('code,lesson_outcomes(lessons(code,title_ar,is_published))').in('code',codes);
    const nn=C.state.profile&&C.state.profile.track==='non_native';
    (data||[]).forEach(o=>{
      const ls=(o.lesson_outcomes||[]).map(x=>x.lessons).filter(l=>l&&l.is_published!==false);
      const pick=ls.filter(l=>nn?/-NN-/.test(l.code):/-N-/.test(l.code))[0]||ls[0];
      if(pick)out[o.code]=pick;
    });
  }catch(e){}
  return out;
}

/* ---------- الحفظ ولوحة المعلم (تحتاج جدول diag_runs؛ تفشل بصمت إن لم يوجد) ---------- */
async function saveRun(st){
  if(!C.state.session||(C.isStaff&&C.isStaff()))return;   // تجربة المعلم لا تُحتسب
  const results={};Object.keys(R.res).forEach(c=>{const r=R.res[c];results[c]={r:r.right,a:r.asked,st:st[c]}});
  try{await C.sb.from('diag_runs').insert({year_group:R.g,graph_version:D.version||1,results})}catch(e){}
}
async function teacher(){
  $('dgApp').innerHTML=`<p class="dg-hint">${t('loading')}</p>`;
  let rows;
  try{
    const {data,error}=await C.sb.from('diag_runs').select('student_id,year_group,results,created_at,profiles(full_name_ar)').order('created_at',{ascending:false}).limit(600);
    if(error)throw error;rows=data||[];
  }catch(e){$('dgApp').innerHTML=`<div class="dg-card"><p>${esc(t('errRuns'))}</p><button class="dg-btn" id="dgB">${t('back')}</button></div>`;$('dgB').onclick=landing;return}
  const seen=new Set(),latest=[];rows.forEach(r=>{if(!seen.has(r.student_id)){seen.add(r.student_id);latest.push(r)}});
  if(!latest.length){$('dgApp').innerHTML=`<div class="dg-card"><p>${esc(t('noRuns'))}</p><button class="dg-btn" id="dgB">${t('back')}</button></div>`;$('dgB').onclick=landing;return}
  const name=r=>esc((r.profiles&&r.profiles.full_name_ar)||'—');
  const codes=[...new Set(latest.flatMap(r=>Object.keys(r.results||{})))].filter(c=>NODE[c]).sort((a,b)=>NODE[a].year-NODE[b].year);
  const rowsM=codes.map(c=>{
    const tested=latest.filter(r=>r.results[c]&&r.results[c].st!=='na'),ok=tested.filter(r=>r.results[c].st==='ok').length;
    const pct=tested.length?Math.round(ok/tested.length*100):0,col=pct>=75?'var(--ok)':pct>=50?'var(--am)':'var(--no)';
    return `<div class="dg-trow"><span>${esc(ntitle(c))}<small> ${t('yr')} ${ar(NODE[c].year)} · ${ar(tested.length)} ${t('students')}</small></span><div class="dg-pb"><i style="width:${pct}%;background:${col}"></i></div><em>${ar(pct)}٪</em></div>`;
  }).join('');
  const groups=codes.map(c=>{
    const ss=latest.filter(r=>r.results[c]&&r.results[c].st==='root');
    return ss.length?`<div class="dg-grp"><b>${esc(ntitle(c))}</b> · ${ar(ss.length)} ${t('students')}<br>${ss.map(r=>`<span class="dg-pill">${name(r)}</span>`).join('')}</div>`:'';
  }).join('');
  const clear=latest.filter(r=>!Object.values(r.results).some(x=>x.st==='root'));
  $('dgApp').innerHTML=`<div class="dg-card"><p class="dg-sum">${t('latest')}: ${ar(latest.length)}</p><h3 class="dg-h3">${t('mastery')}</h3><div class="dg-tbl">${rowsM}</div></div>
    <h2 class="dg-h">${t('groups')}</h2>${groups}${clear.length?`<div class="dg-grp"><b style="color:var(--ok)">${t('noRoot')}</b> · ${clear.map(r=>`<span class="dg-pill">${name(r)}</span>`).join('')}</div>`:''}
    <div class="dg-row"><button class="dg-btn" id="dgB">${t('back')}</button></div>`;
  $('dgB').onclick=landing;
}

/* ---------- العرض ---------- */
async function result(){
  const {st,roots}=analyse();
  const codes=Object.keys(R.res);
  const rootList=codes.filter(c=>st[c]==='root').sort((a,b)=>NODE[a].year-NODE[b].year);
  const affList=codes.filter(c=>st[c]==='affected').sort((a,b)=>NODE[a].year-NODE[b].year);
  const lessons=await lessonsFor(rootList.concat(affList));
  try{localStorage.setItem('hiraa-diag-v1',JSON.stringify({g:R.g,at:Date.now(),st}))}catch(e){}
  saveRun(st);
  const sc=c=>R.res[c]&&!R.res[c].na?`${ar(R.res[c].right)}/${ar(R.res[c].asked)} ${t('score')}`:'';
  const step=(c,i)=>{
    const l=lessons[c],isRoot=st[c]==='root',rs=isRoot?[]:roots(c);
    return `<div class="dg-step ${st[c]}"><div class="dg-n">${ar(i+1)}</div><div class="dg-body"><b>${esc(ntitle(c))}</b>
      <span>${t('yr')} ${ar(NODE[c].year)} · ${sc(c)}</span>
      <span>${isRoot?esc(t('startHere')):esc(tf('afterRoot',rs.map(ntitle).join('، ')))}</span>
      ${l?`<a class="dg-link" href="#/lesson/${encodeURIComponent(l.code)}">${t('open')}: ${esc(l.title_ar)}</a>`:''}</div></div>`;
  };
  const plan=rootList.concat(affList);
  const strands=[...new Set(codes.map(c=>NODE[c].strand))];
  const mapNodes=D.nodes.filter(n=>strands.includes(n.strand)).sort((a,b)=>a.year-b.year);
  const card=n=>{const s=st[n.code]||'idle';
    return `<div class="dg-nd ${s}"><span class="dg-chip">${s==='idle'?'—':t(s)}</span><b>${esc(ntitle(n.code))}</b><small>${t('yr')} ${ar(n.year)}${(PRE[n.code]||[]).length?' · '+t('needs')+': '+esc((PRE[n.code]).map(ntitle).join('، ')):''}</small></div>`};
  $('dgApp').innerHTML=`<div class="dg-card"><p class="dg-sum">${plan.length?esc(tf('sumRoot',rootList.length)):esc(t('sumOk'))}</p>${plan.map(step).join('')}
    <div class="dg-row"><button class="dg-btn" id="dgAgain">${t('again')}</button></div></div>
    <h2 class="dg-h">${t('map')}</h2><div class="dg-map">${mapNodes.map(card).join('')}</div>
    <p class="dg-hint">${t('note')}</p>`;
  $('dgAgain').onclick=landing;
}
function landing(){
  const ses=C.state.session,prof=C.state.profile||{},staff=C.isStaff&&C.isStaff();
  if(!ses){$('dgApp').innerHTML=`<div class="dg-card"><p>${t('signIn')}</p><a class="dg-btn" href="#/login">${L()?'Sign in':'تسجيل الدخول'}</a></div>`;return}
  const years=[...new Set(D.nodes.map(n=>n.year))].sort((a,b)=>a-b),maxY=Math.max(...years)+2;
  const own=+prof.year_group||0;
  const sel=(staff||!own)?`<label class="dg-lab">${t('grade')} <select id="dgG">${Array.from({length:maxY-2},(_,i)=>i+3).map(y=>`<option value="${y}" ${y===(own||7)?'selected':''}>${ar(y)}</option>`).join('')}</select></label>`:'';
  $('dgApp').innerHTML=`<div class="dg-card"><p>${esc(t('intro'))}</p>${D.status==='draft'?`<p class="dg-warn">${esc(t('draft'))}</p>`:''}${sel}
    <div class="dg-row"><button class="dg-btn" id="dgGo">${t('start')}</button>${staff?`<button class="dg-btn dg-ghost" id="dgCls">${t('classView')}</button>`:''}</div></div>`;
  if(staff)$('dgCls').onclick=teacher;
  $('dgGo').onclick=()=>{const g=$('dgG')?+$('dgG').value:own;if(!targetsFor(g).length){$('dgApp').innerHTML=`<div class="dg-card"><p>${t('none')}</p><button class="dg-btn" id="dgB">${t('again')}</button></div>`;$('dgB').onclick=landing;return}run(g)};
}
window.HiraaDiagnose=async function(ctx){
  C=ctx;
  ctx.h(`<div class="dg" dir="${L()?'ltr':'rtl'}" lang="${L()?'en':'ar'}"><div class="wrap"><h1 class="dg-title">${t('title')}</h1><div id="dgApp">${t('loading')}</div></div></div>`);
  landing();
};
})();
