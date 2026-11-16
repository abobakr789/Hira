/* معارج حراء — دورات المهارات (وحدة مستقلة تُدمج في index.html عبر build.py) */
(function(){
"use strict";

const T={
 demo:['نموذج تجريبي','Prototype'],lang:['English','العربية'],
 maarij:['معارج حراء','Hiraa Ma‘ārij'],heroP:['دورات مهارات تصعدها درجةً بعد درجة، من حيث أنت إلى حيث تريد.','Skills courses you climb step by step — from where you are to where you want to be.'],
 isl:['التربية الإسلامية','Islamic Education'],ar:['اللغة العربية','Arabic'],soc:['الدراسات الاجتماعية','Social Studies'],
 avail:['متاحة','Available'],soon:['قريبًا','Coming soon'],prep:['قيد الإعداد','In preparation'],ofSteps:['من 16 درجة','of 16 steps'],
 tajweed:['التجويد','Tajwīd'],tajSub:['برواية حفص عن عاصم، في ثلاثة مستويات و16 درجة، مع تلاوة الشيخ خليفة الطنيجي.','Ḥafṣ ‘an ‘Āṣim — three levels, 16 steps, with recitation by Sheikh Khalifa Al-Tunaiji.'],
 placeBtn:['اختبار تحديد المستوى','Placement test'],cont:['تابع من الدرجة','Continue at step'],
 refs:['المراجع: تحفة الأطفال والغلمان في تجويد القرآن (الجمزوري)، والمقدمة الجزرية (ابن الجزري)، وهداية القاري إلى تجويد كلام الباري (المرصفي).','Sources: Tuḥfat al-Aṭfāl (al-Jamzūrī), al-Muqaddimah al-Jazariyyah (Ibn al-Jazarī), Hidāyat al-Qārī (al-Marṣafī).'],
 progress:['تقدّمي','My progress'],doneSteps:['درجة مكتملة','steps done'],inCourse:['درجة في الدورة','steps in course'],ofCourse:['من الدورة','of course'],
 got:['حصلت عليه','Earned'],after:['بعد الدرجة','after step'],reset:['إعادة النموذج من البداية','Reset prototype'],
 teacher:['وضع المعلم: فتح كل الدرجات','Teacher mode: unlock all steps'],teacherOn:['وضع المعلم مفعّل','Teacher mode on'],
 passed:['اجتزتها','Passed'],start:['ابدأ هنا','Start here'],locked:['مقفلة','Locked'],open:['مفتوحة','Open'],
 rest:['استراحة','Checkpoint'],restSub:['اختبار قصير يفتح المستوى التالي، ويمنحك','A short test that opens the next level and earns you the'],
 summit:['قمة المعارج','The Summit'],summitSub:['الاختبار النهائي وشهادة إتمام الدورة','Final test and course certificate'],
 takeTest:['ابدأ الاختبار','Start test'],
 stepOf:['الدرجة','Step'],of16:['من 16','of 16'],back:['العودة إلى المعارج','Back to the ladder'],
 goal:['هدف الدرجة','Learning goal'],crit:['معايير النجاح','Success criteria'],
 parts:[['تعلّم','أمثلة','تدرّب','اختبر نفسك'],['Learn','Examples','Practise','Check yourself']],
 prev:['السابق','Back'],next:['التالي','Next'],toEx:['إلى الأمثلة','To examples'],backLearn:['العودة إلى الشرح','Back to learning'],toPr:['إلى التدريب','To practice'],
 backEx:['العودة إلى الأمثلة','Back to examples'],toQuiz:['إلى الاختبار','To the quiz'],
 reveal:['اكشف الجواب','Show the answer'],exTitle:['الأمثلة من القرآن الكريم','Examples from the Qur’an'],exHint:['الكلمة المظلّلة موضع الحكم. استمع، ثم ردّد بعد الشيخ.','The highlighted word shows the rule. Listen, then repeat after the Sheikh.'],
 rep:['التكرار:','Repeat:'],once:['مرة','Once'],times:['مرات','times'],slow:['أبطأ','Slower'],listen:['▶ استمع','▶ Listen'],stop:['■ إيقاف','■ Stop'],
 surah:['سورة','Sūrat'],ayah:['الآية','āyah'],
 prTitle:['تدرّب','Practise'],prHint:['أكمل الأنشطة، ثم انتقل إلى الاختبار.','Complete the activities, then go to the quiz.'],
 sortHint:['اضغط على البطاقة، ثم اضغط على السلة المناسبة.','Tap a card, then tap the right basket.'],pickFirst:['اختر بطاقة أولًا.','Choose a card first.'],
 right:['صحيح!','Correct!'],wrongTry:['ليست هنا. حاول مرة أخرى.','Not this one. Try again.'],allSorted:['أحسنت! صنّفتها كلها صحيحة.','Well done! All sorted correctly.'],
 tapHint:['اضغط على الموضع الصحيح في الآية.','Tap the right place in the āyah.'],tapOk:['أحسنت!','Well done!'],tapNo:['ليس هنا الحكم المطلوب. حاول مرة أخرى.','That is not the rule we want. Try again.'],tapAll:['وجدتها كلها!','You found them all!'],
 ordOk:['صحيح، تابع.','Correct, keep going.'],ordDone:['ممتاز! الترتيب صحيح.','Excellent! The order is right.'],ordNo:['ليس هذا التالي. حاول مرة أخرى.','Not the next one. Try again.'],redo:['أعد النشاط','Redo'],
 qTitle:['اختبر نفسك','Check yourself'],qOf:['السؤال','Question'],from:['من','of'],need:['تحتاج 4 إجابات صحيحة من 5 لتصعد.','You need 4 out of 5 to climb.'],
 nextQ:['السؤال التالي','Next question'],result:['النتيجة','Result'],okAns:['إجابة صحيحة. ','Correct. '],rightIs:['الإجابة الصحيحة: ','The right answer: '],
 climbed:['أحسنت! صعدتَ الدرجة','Well done! You climbed step'],almost:['قاربت! راجع ثم حاول مرة أخرى','Nearly! Review and try again'],
 opened:['فُتحت لك الدرجة التالية.','The next step is now open.'],needRest:['أكملت المستوى! بقي اختبار الاستراحة لفتح المستوى التالي.','Level complete! Take the checkpoint test to open the next level.'],
 allDone:['أكملت الدرجات كلها! بقي الاختبار النهائي.','All steps done! The final test is waiting.'],
 seeLadder:['انظر إلى المعارج','See the ladder'],nextStep:['الدرجة التالية','Next step'],review:['راجع الشرح','Review'],retry:['أعد الاختبار','Retry'],
 placeTitle:['اختبار تحديد المستوى','Placement test'],placeHint:['أجب بما تعرف، ولا بأس إن اخترت «لا أعرف بعد».','Answer what you know — “I don’t know yet” is fine.'],
 texts:['نصوص','texts'],myGrade:['ابدأ بنصوص صفّك:','Start with your grade:'],grConfirm:['سيُفتح لك أول نص في صفّك وما قبله. هل تريد المتابعة؟','This opens the first text of your grade and everything before it. Continue?'],
 suggested:['مكانك المقترح:','Suggested start:'],startAt:['ابدأ من الدرجة','Start at step'],
 testT:['اختبار','Test'],testNeed:['تحتاج 80% لتنجح.','You need 80% to pass.'],passedTest:['نجحت في الاختبار!','You passed!'],
 medalGot:['حصلت على','You earned the'],
 certT:['شهادة إتمام','Certificate of Completion'],certName:['اكتب اسمك كما تريده في الشهادة','Type your name for the certificate'],showCert:['اعرض الشهادة','Show certificate'],
 certBody:['أتمّ بحمد الله دورة التجويد برواية حفص عن عاصم في معارج حراء، بمستوياتها الثلاثة ودرجاتها الست عشرة.','has completed, by Allah’s grace, the Tajwīd course (Ḥafṣ ‘an ‘Āṣim) on Hiraa Ma‘ārij — all three levels and sixteen steps.'],
 date:['التاريخ','Date'],
 foot:['معارج حراء · نصوص الآيات من مصحف المنصة، والتلاوة للشيخ خليفة الطنيجي.','Hiraa Ma‘ārij · Qur’an text from the platform’s Muṣḥaf; recitation by Sheikh Khalifa Al-Tunaiji.'],foot2:['معارج حراء · كل نص في الدورة موثّق من مصدره المذكور تحته.','Hiraa Ma‘ārij · every text in this course is cited from its source.'],
 lv:['المستوى','Level'],foot3:['معارج حراء · النصوص والأسئلة من كتاب «مدارج القراءة» لوزارة التربية والتعليم، والإجابات النموذجية من إعداد حراء.','Hiraa Ma‘ārij · texts and questions from the MoE “Madārij al-Qirā’ah”; model answers by Hiraa.'],
 rparts:[['اقرأ','أجب'],['Read','Answer']],toQs:['إلى الأسئلة','To the questions'],showText:['اعرض النص','Show the text'],bookP:['كتاب مدارج القراءة، ص','Madārij al-Qirā’ah, p.'],
 model:['اكشف الإجابة النموذجية','Show the model answer'],myAns:['اكتب إجابتك هنا…','Write your answer here…'],finish:['أنهيت الأسئلة','I have finished'],
 rNeed:['أجب عن أسئلة الاختيار كلها؛ تصعد إذا أخطأت في سؤال واحد على الأكثر.','Answer all the multiple-choice questions; you climb with at most one mistake.'],rLeft:['بقي أسئلة اختيار لم تُجب عنها.','Some multiple-choice questions are still unanswered.'],tNote:['ملاحظة للمعلم','Teacher note'],ordHint:['اضغط على البطاقات بالترتيب الصحيح.','Tap the cards in the right order.']
};
const LBL={'آية':'Āyah','مثال':'Example','بيت':'Verse','شطر':'Half-verse','سؤال':'Question','موقف':'Case','قمرية':'Moon','شمسية':'Sun','فعل':'Verb','مثلان':'Mithlayn','متجانسان':'Mutajānisayn','متقاربان':'Mutaqāribayn','لين':'Līn','متصل':'Muttaṣil','منفصل':'Munfaṣil','عارض':'‘Āriḍ','بدل':'Badal','كلمي':'Word','حرفي':'Letter','طبيعي':'Natural','مخارج':'Makhārij','قلقلة':'Qalqalah','صفير':'Ṣafīr'};
const SUBJ=[
 {id:'isl',c:'var(--isl)',s:'var(--isl-s)',courses:[
   {t:['التجويد','Tajwīd'],d:['16 درجة · 3 مستويات','16 steps · 3 levels'],live:1,id:'tajweed',n:16,icon:'book'},
   {t:['أحكام الطهارة والصلاة','Purification & Prayer'],d:['12 درجة · على قول الجمهور','12 steps · the majority view'],live:1,id:'fiqh',n:12,icon:'drop'},
   {t:['الأربعون النووية','An-Nawawī’s Forty'],d:['حفظ وفهم وتطبيق','Memorise, understand, apply'],icon:'scroll'},
   {t:['أسماء الله الحسنى','The Beautiful Names'],d:['المعنى والأثر','Meaning and effect'],icon:'star'}]},
 {id:'ar',c:'var(--ar)',s:'var(--ar-s)',courses:[
   {t:['فن الإملاء','Spelling'],d:['12 درجة · الهمزات والتاء والألف والترقيم','12 steps · hamzah, tā’, alif, punctuation'],live:1,id:'imla',n:12,icon:'pen'},
   {t:['قل ولا تقل','Say it right'],d:['الأخطاء اللغوية الشائعة','Common language errors'],icon:'chat'},
   {t:['مفاتيح النحو','Keys of Grammar'],d:['12 درجة على متن الآجرومية','12 steps through al-Ājurrūmiyyah'],live:1,id:'nahw',n:12,icon:'key'},
   {t:['البلاغة الميسرة','Easy Rhetoric'],d:['التشبيه والاستعارة والكناية','Simile, metaphor, metonymy'],icon:'spark'},
   {t:['الشعر عبر العصور','Poetry Through the Ages'],d:['12 درجة · أبيات موثّقة من مصادرها','12 steps · every verse sourced'],live:1,id:'shiir',n:12,icon:'scroll'},
   {t:['الأمثال والحكم','Proverbs & Wisdom'],d:['قصة المثل ومعناه','Story and meaning'],icon:'chat'}]},
 {id:'soc',c:'var(--soc)',s:'var(--soc-s)',courses:[
   {t:['الآباء المؤسسون وقصة الاتحاد','The Founding Fathers'],d:['الهوية الوطنية','National identity'],icon:'star'},
   {t:['التراث الإماراتي','Emirati Heritage'],d:['السدو والصقارة والغوص','Sadu, falconry, pearl diving'],icon:'drop'},
   {t:['علماء الحضارة الإسلامية','Scholars of Islamic Civilisation'],d:['الطب والفلك والرياضيات','Medicine, astronomy, maths'],icon:'spark'},
   {t:['مهارة الخريطة','Map Skills'],d:['المقياس والاتجاهات','Scale and directions'],icon:'key'}]}
];
const ICONS={
 book:'<path d="M6 7c4-2 8-2 12 0v24c-4-2-8-2-12 0zM18 7c4-2 8-2 12 0v24c-4-2-8-2-12 0z" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/>',
 drop:'<path d="M18 5c6 8 10 13 10 18a10 10 0 0 1-20 0c0-5 4-10 10-18z" fill="none" stroke="currentColor" stroke-width="2.4"/>',
 scroll:'<rect x="8" y="6" width="20" height="24" rx="4" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M13 13h10M13 18h10M13 23h6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
 star:'<path d="M18 5l3.6 8 8.4.8-6.4 5.6 2 8.4L18 23.5 10.4 27.8l2-8.4L6 13.8l8.4-.8z" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/>',
 pen:'<path d="M9 27l3-9 12-12 6 6-12 12zM21 9l6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/>',
 chat:'<path d="M7 9h22v14H16l-6 5v-5H7z" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/>',
 key:'<circle cx="13" cy="18" r="6" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M19 18h11M26 18v5M30 18v4" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
 spark:'<path d="M18 5v8M18 23v8M5 18h8M23 18h8M9 9l5 5M22 22l5 5M27 9l-5 5M14 22l-5 5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>'
};


T.report=['تقرير الطلاب','Student report'];T.repT=['تقرير معارج حراء','Ma‘ārij report'];T.student=['الطالب','Student'];T.steps=['الدرجات','Steps'];T.curStep=['الدرجة الحالية','Current step'];T.medals=['الأوسمة','Medals'];T.updated=['آخر نشاط','Last active'];T.noData=['لا يوجد تقدم مسجل لطلابك بعد.','No progress recorded for your students yet.'];T.loading=['جارٍ التحميل…','Loading…'];T.signHint=['سجّل الدخول ليُحفظ تقدّمك ويراه معلمك.','Sign in to save your progress and share it with your teacher.'];
let SURAH,LEVELS,STEPS,PLACE,D=null,C=null,syncT=null,CID='tajweed',N=16;
const COURSES={tajweed:'art/maarij/tajweed.json',fiqh:'art/maarij/fiqh.json',shiir:'art/maarij/shiir.json',imla:'art/maarij/imla.json',nahw:'art/maarij/nahw.json'};const CACHE={},LOADED={};
const KEY=()=>'hiraa-maarij-'+CID;
let S={passed:[],tests:{},open:false,name:'',start:0};
let SUBJ_SEL='isl';try{SUBJ_SEL=localStorage.getItem('hiraa-maarij-subj')||'isl'}catch(e){}
function loadS(){S={passed:[],tests:{},open:false,name:'',start:0};try{const r=localStorage.getItem(KEY());if(r)S=Object.assign(S,JSON.parse(r))}catch(e){}}
function progOf(cid){try{const r=JSON.parse(localStorage.getItem('hiraa-maarij-'+cid)||'{}');return (r.passed||[]).length}catch(e){return 0}}
const ct=k=>tx(D.meta[k]);
const L=()=>C&&C.lang()==='en'?1:0;
const t=k=>T[k][L()];
const tx=a=>Array.isArray(a)?a[L()]:a;
const $=id=>document.getElementById(id);
const isStaffC=()=>!!(C&&C.isStaff());
const staffOpen=()=>S.open&&isStaffC();
function save(){
  try{localStorage.setItem(KEY(),JSON.stringify(S))}catch(e){}
  const ses=C&&C.state.session;if(!ses)return;
  clearTimeout(syncT);syncT=setTimeout(()=>{C.sb.from('maarij_progress').upsert({user_id:ses.user.id,course:CID,passed:S.passed,tests:S.tests,scores:{start:S.start||0},cert_name:S.name||null,updated_at:new Date().toISOString()}).then(()=>{},()=>{})},600);
}
async function loadRemote(){
  const ses=C.state.session;if(!ses||LOADED[CID])return;LOADED[CID]=true;
  try{const {data}=await C.sb.from('maarij_progress').select('*').eq('user_id',ses.user.id).eq('course',CID).maybeSingle();
    if(data){S.passed=[...new Set([...(S.passed||[]),...(data.passed||[])])].sort((a,b)=>a-b);S.tests=Object.assign({},data.tests||{},S.tests);S.start=Math.max(S.start||0,(data.scores&&data.scores.start)||0);if(!S.name&&data.cert_name)S.name=data.cert_name;}
    save();}catch(e){}
}
function isPassed(i){return S.passed.includes(i)}
function levelOf(i){return LEVELS.findIndex(l=>l.steps.includes(i))}
function unlocked(i){
  if(staffOpen()||i===1||i<=(S.start||0))return true;
  if(!isPassed(i-1))return false;
  if(i===LEVELS[1].steps[0]&&!S.tests.l1&&!staffOpen())return false;
  if(i===LEVELS[2].steps[0]&&!S.tests.l2&&!staffOpen())return false;
  return true;
}
function nextStep(){for(let i=1;i<=N;i++)if(!isPassed(i))return i;return N}
function levelDone(k){return LEVELS[k].steps.every(isPassed)}
function hashFor(v){if(v==='courses')return '#/maarij';if(v==='course')return '#/maarij/'+CID;return '#/maarij/'+CID+'/'+v}
function go(v){const h=hashFor(v);if(location.hash===h)route();else location.hash=h}
let SUB='courses';
function route(){
  stopAudio();
  let h=SUB,m;
  const app=$('mjApp');if(!app)return;
  const crumbs=[['courses',t('maarij')]];
  if(h!=='courses')crumbs.push(['course',ct('t')]);
  if(h==='course'){renderLadder(app)}
  else if(h==='placement'){crumbs.push(['',t('placeTitle')]);renderPlace(app)}
  else if((m=h.match(/^step-(\d+)$/))&&+m[1]>=1&&+m[1]<=N){const i=+m[1];crumbs.push(['',t('stepOf')+' '+i]);if(!unlocked(i)){go('course');return}renderStep(app,i)}
  else if((m=h.match(/^test-(l1|l2|final)$/))){crumbs.push(['',testName(m[1])]);renderTest(app,m[1])}
  else if(h==='certificate'){crumbs.push(['',t('certT')]);renderCert(app)}
  else if(h==='report'){crumbs.push(['',t('report')]);renderReport(app)}
  else {renderCourses(app)}
  const cr=$('mjCrumb');if(cr)cr.innerHTML=crumbs.map((c,i)=>i<crumbs.length-1||crumbs.length===1?`<a href="${hashFor(c[0])}">${c[1]}</a>`:`<span>${c[1]}</span>`).join('<span>›</span>');
  window.scrollTo({top:0});
}
/* ---------- courses ---------- */
function renderCourses(app){
  const sj=SUBJ.find(s=>s.id===SUBJ_SEL);
  app.innerHTML=`<div class="hero"><svg class="deco" width="260" height="200" viewBox="0 0 260 200" aria-hidden="true"><g fill="#F2E3C2"><rect x="20" y="160" width="60" height="40" rx="8"/><rect x="70" y="120" width="60" height="80" rx="8"/><rect x="120" y="80" width="60" height="120" rx="8"/><rect x="170" y="40" width="60" height="160" rx="8"/></g><circle cx="205" cy="24" r="12" fill="#D4AA55"/></svg>
   <h1>${t('maarij')}</h1><p>${t('heroP')}</p></div>
   <div class="tabs">${SUBJ.map(s=>`<button class="tab ${s.id===SUBJ_SEL?'on':''}" onclick="MJ.subj('${s.id}')">${t(s.id)}</button>`).join('')}</div>
   <div class="grid">${sj.courses.map(c=>{const n=c.live?progOf(c.id):0,pct=c.live?Math.round(n/c.n*100):0;
    return `<div class="cc ${c.live?'live':'soon'}" ${c.live?`onclick="MJ.openC('${c.id}')"`:''}><span class="tag">${c.live?t('avail'):t('soon')}</span>
     <div class="ic" style="background:${sj.s};color:${sj.c}"><svg width="34" height="34" viewBox="0 0 36 36">${ICONS[c.icon]}</svg></div>
     <h3>${tx(c.t)}</h3><div class="meta">${tx(c.d)}</div><div class="bar"><i style="width:${pct}%"></i></div>
     <div class="meta">${c.live?`${n} ${L()?'of':'من'} ${c.n} ${L()?'steps':'درجة'}`:t('prep')}</div></div>`}).join('')}</div>`;
}

/* ---------- ladder ---------- */
function renderLadder(app){
  const n=S.passed.length,ns=nextStep();
  const medals=[['l1',LEVELS[0].medal,LEVELS[0].steps.at(-1)],['l2',LEVELS[1].medal,LEVELS[1].steps.at(-1)],['final',LEVELS[2].medal,N]];
  let lad='';
  LEVELS.forEach((Lv,li)=>{
    let h=`<div class="lvl"><div class="lvlname">${tx(Lv.n)} · ${tx(Lv.sub)}</div>`;
    Lv.steps.forEach(i=>{const st=STEPS[i-1];
      const G=(D.meta.grades||[]).find(g=>g.first===i);if(G)h+=`<div class="grname" id="gr${G.g}">${tx(G.n)} · ${G.count} ${t('texts')}</div>`;
      const state=isPassed(i)?'done':unlocked(i)?(i===ns?'cur':'open'):'lock';
      const lab=state==='done'?t('passed'):state==='cur'?t('start'):state==='open'?t('open'):t('locked');
      h+=`<div class="stp ${state}" style="--i:${(1+(i-1)*Math.min(1,15/Math.max(1,N-1))).toFixed(2)}"><span class="rise"></span><div class="tread" ${state!=='lock'?`onclick="MJ.go('step-${i}')"`:''}><span class="num">${i}</span><span><div class="t">${tx(st.t)}</div><div class="s">${tx(st.sub)}</div></span><span class="st">${lab}</span></div></div>`;
    });
    const key=li<2?'l'+(li+1):'final';
    const ready=(li<2?levelDone(li):(levelDone(2)))||staffOpen();
    const ok=S.tests[key];
    const title=li<2?`${t('rest')} · ${tx(Lv.n)}`:t('summit');
    const sub=li<2?`${t('restSub')} ${tx(Lv.medal)}`:t('summitSub');
    h+=`<div class="landing ${ok?'ok':''} ${ready&&!ok?'go':''}" ${ready?`onclick="MJ.go('test-${key}')"`:''}><svg width="34" height="34" viewBox="0 0 36 36" style="color:var(--gold);flex:none">${ICONS.star}</svg><div><div class="ldt">${title}</div><small>${sub}</small></div>
      <span class="act-b">${ok?`<span class="pill">${t('got')}</span>`:ready?`<button class="btn" style="padding:6px 14px">${t('takeTest')}</button>`:`<span class="st pill" style="background:#F1EEE6;color:var(--muted)">${t('locked')}</span>`}</span></div>`;
    h+='</div>';lad+=h;
  });
  app.innerHTML=`<div class="chead"><div class="box">${(()=>{const sj=SUBJ.find(x=>x.courses.some(c=>c.id===CID))||SUBJ[0];return `<span class="pill" style="background:${sj.s};color:${sj.c}">${t(sj.id)}</span>`})()}
     <h1 style="margin-top:8px">${ct('t')}</h1><p class="sub">${ct('sub')}</p>
     <div class="row">${PLACE&&PLACE.length?`<button class="btn gold" onclick="MJ.go('placement')">${t('placeBtn')}</button>`:''}<button class="btn" onclick="MJ.go('${unlocked(ns)?'step-'+ns:(ns===LEVELS[1].steps[0]?'test-l1':ns===LEVELS[2].steps[0]?'test-l2':'step-'+ns)}')">${unlocked(ns)?t('cont')+' '+ns:t('takeTest')}</button>${S.tests.final?`<button class="btn ghost" onclick="MJ.go('certificate')">${t('certT')}</button>`:''}</div>
     ${D.meta.grades?`<div class="grpick"><span>${t('myGrade')}</span>${D.meta.grades.map(g=>`<button class="gchip" onclick="MJ.grade(${g.first},${g.g})">${tx(g.n)}</button>`).join('')}</div>`:''}
     <div class="refs">${ct('refs')}</div></div>
   <div class="box"><h3 style="font-size:20px">${t('progress')}</h3>
     <div class="stats"><div class="stat"><b>${n}</b><span>${t('doneSteps')}</span></div><div class="stat"><b>${N}</b><span>${t('inCourse')}</span></div><div class="stat"><b>${Math.round(n/N*100)}%</b><span>${t('ofCourse')}</span></div></div>
     <div class="medals">${medals.map(m=>`<div class="medal ${S.tests[m[0]]?'got':''}">${tx(m[1])}<br>${S.tests[m[0]]?t('got'):t('after')+' '+m[2]}</div>`).join('')}</div>
     <div class="row" style="margin-top:12px">${isStaffC()?`<button class="tlink" onclick="MJ.teacher()">${S.open?'✓ '+t('teacherOn'):t('teacher')}</button><button class="tlink" onclick="MJ.go('report')">${t('report')}</button>`:''}${!C.state.session?`<button class="tlink" onclick="MJ.reset()">${t('reset')}</button>`:''}</div></div></div>
   <div class="ladder">${lad}</div>`;
}

/* ---------- placement ---------- */
let P={i:0,score:0,ans:[]};
function renderPlace(app){P={i:0,score:0,ans:[]};app.innerHTML=`<div class="shead"><div><div class="k">${ct('t')}</div><h1>${t('placeTitle')}</h1></div></div><div class="panel" id="pp"></div>`;placeQ()}
function placeQ(){
  const el=$('pp');
  if(P.i>=PLACE.length){
    // first wrong answer decides start
    const w=P.ans.indexOf(false);const map=D.meta.placeMap||[1,4,7,10,13,16];
    const start=w<0?(D.meta.placeAll||N):map[w];
    const lv=levelOf(start);const PG=(D.meta.grades||[]).find(g=>start>=g.first&&start<=g.last);
    el.innerHTML=`<div class="result"><div class="big">${P.score} / ${PLACE.length}</div><h2>${t('suggested')} ${PG?tx(PG.n):tx(LEVELS[lv].n)}</h2>
     <p class="hint">${t('startAt')} ${start}: «${tx(STEPS[start-1].t)}»</p>
     <div class="row" style="justify-content:center;margin-top:14px"><button class="btn" onclick="MJ.startAt(${start})">${t('startAt')} ${start}</button><button class="btn ghost" onclick="MJ.go('course')">${t('seeLadder')}</button></div></div>`;
    return;
  }
  const q=PLACE[P.i];
  el.innerHTML=`<div class="qbar">${PLACE.map((_,k)=>`<i class="${k<P.i?'ok':k===P.i?'cur':''}"></i>`).join('')}</div><p class="hint">${t('qOf')} ${P.i+1} ${t('from')} ${PLACE.length} · ${t('placeHint')}</p>
   <div class="qq on"><div class="qt">${tx(q.q)}</div><div class="opts">${tx(q.o).map((o,k)=>`<button class="opt" onclick="MJ.pans(${k})">${o}</button>`).join('')}</div></div>`;
}

/* ---------- step ---------- */
let CUR=1,part=0,lc=0;
function renderStep(app,i){
  CUR=i;part=0;lc=0;const st=STEPS[i-1],lv=levelOf(i);
  if(st.kind==='read')return renderRead(app,i);
  app.innerHTML=`<div class="shead"><div><div class="k">${tx(LEVELS[lv].n)} · ${t('stepOf')} ${i} ${L()?'of':'من'} ${N}</div><h1>${tx(st.t)}</h1></div><span class="spacer"></span><button class="btn ghost" onclick="MJ.go('course')">${t('back')}</button></div>
   <div class="goal"><div><h3>${t('goal')}</h3><p>${tx(st.goal)}</p></div><div><h3>${t('crit')}</h3><ul>${tx(st.crit).map(c=>`<li>${c}</li>`).join('')}</ul></div></div>
   <div class="stepper" id="stepper"></div><div class="panel" id="sp"></div>`;
  showPart(0);
}
function renderStepper(){if(STEPS[CUR-1]&&STEPS[CUR-1].kind==='read')return;$('stepper').innerHTML=T.parts[L()].map((p,k)=>`<button class="sp ${k===part?'on':''} ${k<part?'ok':''}" onclick="MJ.showPart(${k})"><span class="n">${k+1}</span><b>${p}</b></button>`).join('')}
function showPart(k){stopAudio();if(STEPS[CUR-1]&&STEPS[CUR-1].kind==='read')return readPart(Math.min(k,1));part=k;renderStepper();[learn,examples,practice,quiz][k]($('sp'))}

function learn(el){
  const C=STEPS[CUR-1].learn;lc=Math.min(lc,C.length-1);
  el.innerHTML=C.map((h,k)=>`<div class="lc ${k===lc?'on':''}">${tx(h)}</div>`).join('')+
   `<div class="navrow"><button class="btn ghost" ${lc===0?'disabled':''} onclick="MJ.lstep(-1)">${t('prev')}</button><div class="dots">${C.map((_,k)=>`<i class="${k===lc?'on':''}"></i>`).join('')}</div><button class="btn" onclick="MJ.lstep(1)">${lc===C.length-1?t('toEx'):t('next')}</button></div>`;
}
function lstep(d){const C=STEPS[CUR-1].learn;lc+=d;if(lc>=C.length){lc=C.length-1;showPart(1);return}lc=Math.max(0,lc);learn($('sp'))}

/* audio */
let AU=null,cur=null,rep=1,left=0,slow=false;
function stopAudio(){if(AU){AU.pause();AU=null}document.querySelectorAll('.ex.playing').forEach(e=>e.classList.remove('playing'));document.querySelectorAll('.play').forEach(b=>b.textContent=t('listen'));cur=null}
function play(i){
  if(cur===i&&AU){stopAudio();return}
  stopAudio();const e=STEPS[CUR-1].ex[i];cur=i;left=rep;
  AU=new Audio(`art/maarij/audio/${e.s}-${e.a}.mp3`);AU.playbackRate=slow?0.75:1;
  const card=$('ex'+i);card.classList.add('playing');card.querySelector('.play').textContent=t('stop');
  AU.onended=()=>{left--;if(left>0&&cur===i){AU.currentTime=0;AU.play().catch(()=>{})}else stopAudio()};
  AU.play().catch(()=>stopAudio());
}
function setRep(n){rep=n;document.querySelectorAll('[data-rep]').forEach(b=>b.classList.toggle('on',+b.dataset.rep===n))}
function setSlow(){slow=!slow;if(AU)AU.playbackRate=slow?0.75:1;document.querySelectorAll('.slow').forEach(b=>b.classList.toggle('on',slow))}
function examples(el){
  const E=STEPS[CUR-1].ex;
  el.innerHTML=`<h2>${D.meta.exTitle?ct('exTitle'):t('exTitle')}</h2><p class="hint">${D.meta.exHint?ct('exHint'):t('exHint')}</p>
   ${E.some(e=>e.s)?`<div class="row" style="margin-top:6px"><span class="hint">${t('rep')}</span>${[1,3,5].map(n=>`<button class="btn ghost" style="padding:4px 14px" data-rep="${n}" onclick="MJ.setRep(${n})">${n===1?t('once'):n+' '+t('times')}</button>`).join('')}<button class="btn ghost slow" style="padding:4px 14px" onclick="MJ.setSlow()">${t('slow')}</button></div>`:''}
   <div class="exgrid">${E.map((e,i)=>e.v?`<div class="ex case verse" id="ex${i}"><span class="lt">${L()&&LBL[e.l]?LBL[e.l]:e.l}</span><div class="bv" dir="rtl" lang="ar"><span>${e.v[0]}</span>${e.v[1]?`<span>${e.v[1]}</span>`:''}</div><p class="ref">${tx(e.who)} · ${e.src}</p><button class="btn ghost" style="padding:4px 14px" onclick="this.nextElementSibling.hidden=false;this.hidden=true">${L()?'Show the explanation':'اكشف الشرح'}</button><p class="ca" hidden>${tx(e.a)}</p></div>`:e.s?`<div class="ex" id="ex${i}"><span class="lt">${L()&&LBL[e.l]?LBL[e.l]:e.l}</span>
     <div class="q">${e.h} <span class="an"><span class="br">﴿</span>${e.a}<span class="br">﴾</span></span></div><div class="why">${tx(e.w)}</div>
     <div class="pl"><button class="play" onclick="MJ.play(${i})">${t('listen')}</button><span class="ref">${t('surah')} ${tx(SURAH[e.s])} · ${t('ayah')} ${e.a}</span></div></div>`:`<div class="ex case" id="ex${i}"><span class="lt">${L()&&LBL[e.l]?LBL[e.l]:e.l}</span><p class="cq">${tx(e.c)}</p><button class="btn ghost" style="padding:4px 14px" onclick="this.nextElementSibling.hidden=false;this.hidden=true">${t('reveal')}</button><p class="ca" hidden>${tx(e.a)}</p></div>`).join('')}</div>
   <div class="navrow"><button class="btn ghost" onclick="MJ.backLearn()">${t('backLearn')}</button><button class="btn" onclick="MJ.showPart(2)">${t('toPr')}</button></div>`;
  setRep(rep);document.querySelectorAll('.slow').forEach(b=>b.classList.toggle('on',slow));
}

/* practice */
let PS={};
function practice(el){
  const A=STEPS[CUR-1].practice;PS={};
  el.innerHTML=`<h2>${t('prTitle')}</h2><p class="hint">${t('prHint')}</p>`+A.map((a,k)=>`<div class="act" id="act${k}"></div>`).join('')+
   `<div class="navrow"><button class="btn ghost" onclick="MJ.showPart(1)">${t('backEx')}</button><button class="btn gold" onclick="MJ.showPart(3)">${t('toQuiz')}</button></div>`;
  A.forEach((a,k)=>drawAct(k));
}
function head(k,a,hint){return `<h3><span class="num">${a.num||k+1}</span>${tx(a.t)}</h3><p class="hint">${hint}</p>`}
function drawAct(k){
  const a=STEPS[CUR-1].practice[k],box=$('act'+k);
  if(a.type==='sort'){
    PS[k]={sel:null,left:a.items.length};
    const order=a.items.map((_,i)=>i).sort(()=>Math.random()-.5);
    box.innerHTML=head(k,a,t('sortHint'))+`<div class="letters">${order.map(i=>`<button class="lb ${a.q?'w':a.items[i][0].length>2?'wt':''}" id="it${k}-${i}" onclick="MJ.pick(${k},${i})">${L()&&a.en?a.en[i]:a.items[i][0]}</button>`).join('')}</div>
     <div class="baskets" style="grid-template-columns:repeat(${Math.min(a.bins.length,4)},1fr)">${a.bins.map((b,bi)=>`<div class="basket ${bi===0?'a':''}" onclick="MJ.drop(${k},${bi})"><div class="bt">${tx(b)}</div><div class="in" id="bin${k}-${bi}"></div></div>`).join('')}</div><div class="fb" id="fb${k}"></div>`;
  }
  if(a.type==='tap'){
    PS[k]={need:a.lines.reduce((s,l)=>s+l.toks.filter(x=>x[1]===1).length,0),got:0};
    box.innerHTML=head(k,a,t('tapHint'))+a.lines.map((ln,li)=>`<div class="tokens">${ln.toks.map((tk,ti)=>`<button class="tok" onclick="MJ.tap(${k},${li},${ti},this)">${tk[0]}</button>`).join('')}</div><div class="ref hint">${t('surah')} ${tx(SURAH[ln.s])} · ${t('ayah')} ${ln.a}</div>`).join('')+`<div class="fb" id="fb${k}"></div>`;
  }
  if(a.type==='order'){
    PS[k]={n:0};
    const disp=i=>L()&&a.en?a.en[i]:a.seq[i];
    const order=a.seq.map((_,i)=>i).sort(()=>Math.random()-.5);
    const wide=a.seq.some(x=>x.length>2);
    box.innerHTML=head(k,a,tx(a.hint))+`<div class="order" id="slots${k}" dir="${wide&&L()?'ltr':'rtl'}">${a.seq.map(()=>`<span class="slot" style="${wide?'width:auto;min-width:96px;padding:0 10px;font-size:18px':''}"></span>`).join('')}</div>
     <div class="letters" dir="rtl">${order.map(i=>`<button class="lb" style="${wide?'width:auto;padding:0 14px;font-size:18px':''}" onclick="MJ.ord(${k},${i},this)">${disp(i)}</button>`).join('')}</div>
     <button class="btn ghost" style="padding:6px 14px" onclick="MJ.drawAct(${k})">${t('redo')}</button><div class="fb" id="fb${k}"></div>`;
  }
}
function fb(id,ok,msg){const f=$(id);if(!f)return;f.className='fb '+(ok?'ok':'no');f.textContent=msg}
function pick(k,i){const b=$(`it${k}-${i}`);$('act'+k).querySelectorAll('.lb').forEach(x=>x.classList.remove('sel'));PS[k].sel=i;b.classList.add('sel')}
function drop(k,bi){
  const a=STEPS[CUR-1].practice[k],p=PS[k];
  if(p.sel===null){fb('fb'+k,false,t('pickFirst'));return}
  const it=a.items[p.sel];
  if(it[1]===bi){$(`bin${k}-${bi}`).insertAdjacentHTML('beforeend',`<span class="${a.q?'w':it[0].length>2?'wt':''}">${L()&&a.en?a.en[p.sel]:it[0]}</span>`);$(`it${k}-${p.sel}`).classList.add('gone');p.left--;
    fb('fb'+k,true,p.left===0?t('allSorted'):t('right'))}
  else fb('fb'+k,false,t('wrongTry'));
  $(`it${k}-${p.sel}`).classList.remove('sel');p.sel=null;
}
function tap(k,li,ti,b){
  const a=STEPS[CUR-1].practice[k],tk=a.lines[li].toks[ti],p=PS[k];
  if(tk[1]===1){if(!b.classList.contains('ok')){b.classList.add('ok');p.got++}fb('fb'+k,true,p.got>=p.need?t('tapAll'):t('tapOk'))}
  else{b.classList.add('no');fb('fb'+k,false,tk[2]?tx(tk[2]):t('tapNo'));setTimeout(()=>b.classList.remove('no'),1400)}
}
function ord(k,i,b){
  const a=STEPS[CUR-1].practice[k],p=PS[k];if(p.n>=a.seq.length)return;
  if(a.seq[i]===a.seq[p.n]){const s=$('slots'+k).children[p.n];s.textContent=b.textContent;s.classList.add('f');b.classList.add('gone');p.n++;fb('fb'+k,true,p.n===a.seq.length?t('ordDone'):t('ordOk'))}
  else fb('fb'+k,false,t('ordNo'));
}

/* quiz (step) */
let QZ={};
function quiz(el){QZ={items:STEPS[CUR-1].quiz,i:0,ans:[],el,pass:4,onEnd:stepEnd};quizQ()}
function quizQ(){
  const el=QZ.el,Qs=QZ.items;
  if(QZ.i>=Qs.length)return QZ.onEnd();
  const q=Qs[QZ.i];
  el.innerHTML=`<h2>${QZ.title||t('qTitle')}</h2><div class="qbar">${Qs.map((_,k)=>`<i class="${k<QZ.i?(QZ.ans[k]?'ok':'no'):k===QZ.i?'cur':''}"></i>`).join('')}</div>
   <p class="hint">${t('qOf')} ${QZ.i+1} ${t('from')} ${Qs.length} · ${QZ.needTxt||t('need')}</p>
   <div class="qq on"><div class="qt">${tx(q.q)}</div><div class="opts" id="opts">${tx(q.o).map((o,k)=>`<button class="opt" onclick="MJ.answer(${k})">${o}</button>`).join('')}</div>
   <div class="fb" id="qfb"></div><div class="navrow" style="justify-content:flex-end"><button class="btn" id="qn" style="display:none" onclick="MJ.nextQ()">${QZ.i===Qs.length-1?t('result'):t('nextQ')}</button></div></div>`;
}
function answer(k){
  const q=QZ.items[QZ.i];if(QZ.ans.length>QZ.i)return;
  const ok=k===q.c;QZ.ans.push(ok);
  const bs=document.querySelectorAll('#opts .opt');bs[q.c].classList.add('ok');if(!ok)bs[k].classList.add('no');bs.forEach(b=>b.disabled=true);
  const f=$('qfb');f.className='fb '+(ok?'ok':'no');f.innerHTML=(ok?t('okAns'):t('rightIs')+tx(q.o)[q.c]+'. ')+tx(q.e);
  $('qn').style.display='';
}
function stairs(lit){return `<div class="stairs-anim">${Array.from({length:6},(_,k)=>`<i style="height:${30+k*15}px;animation-delay:${k*.12}s" class="${k<lit?'lit':''}"></i>`).join('')}</div>`}
function stepEnd(){
  const sc=QZ.ans.filter(Boolean).length,pass=sc>=QZ.pass,i=CUR;
  if(pass&&!isPassed(i)){S.passed.push(i);save()}
  const lv=levelOf(i),pos=LEVELS[lv].steps.indexOf(i)+1;
  let msg=t('opened'),btn=i<N&&unlocked(i+1)?`<button class="btn gold" onclick="MJ.go('step-${i+1}')">${t('nextStep')}</button>`:'';
  if(pass&&LEVELS[lv].steps[LEVELS[lv].steps.length-1]===i){msg=lv<2?t('needRest'):t('allDone');btn=`<button class="btn gold" onclick="MJ.go('test-${lv<2?'l'+(lv+1):'final'}')">${t('takeTest')}</button>`}
  QZ.el.innerHTML=`<div class="result">${stairs(pass?pos:pos-1)}<div class="big">${sc} / ${QZ.items.length}</div>
   <h2>${pass?t('climbed')+' '+i:t('almost')}</h2><p class="hint">${pass?msg:t('need')}</p>
   <div class="row" style="justify-content:center;margin-top:16px">${pass?btn+`<button class="btn ghost" onclick="MJ.go('course')">${t('seeLadder')}</button>`:`<button class="btn" onclick="MJ.review()">${t('review')}</button><button class="btn gold" onclick="MJ.showPart(3)">${t('retry')}</button>`}</div></div>`;
  renderStepper();
}

/* ---------- reading steps (مدارج القراءة) ---------- */
let RS={};
function textBlock(st,small){return `<div class="rd ${small?'sm':''}">${st.img?`<img class="rimg" src="${st.img}" alt="" loading="lazy">`:''}${st.text.map(p=>`<p>${p}</p>`).join('')}${st.img2?`<img class="rimg2" src="${st.img2}" alt="" loading="lazy">`:''}<div class="ref hint">${t('bookP')} ${st.p}</div></div>`}
function renderRead(app,i){
  const st=STEPS[i-1],lv=levelOf(i);
  if(!st.practice){st.practice=[];st.qs.forEach((q,j)=>{if(q.k==='r'){q.pi=st.practice.length;st.practice.push({num:j+1,type:'order',t:q.q,hint:t('ordHint'),seq:q.seq})}if(q.k==='s'){q.pi=st.practice.length;st.practice.push({num:j+1,type:'sort',t:q.q,bins:q.bins,items:q.items})}})}
  app.innerHTML=`<div class="shead"><div><div class="k">${tx(LEVELS[lv].n)} · ${t('stepOf')} ${i} ${L()?'of':'من'} ${N} · ${st.sub}</div><h1>«${st.t}»</h1></div><span class="spacer"></span><button class="btn ghost" onclick="MJ.go('course')">${t('back')}</button></div>
   <div class="stepper" id="stepper"></div><div class="panel" id="sp"></div>`;
  readPart(0);
}
function readPart(k){part=k;const st=STEPS[CUR-1];
  $('stepper').innerHTML=T.rparts[L()].map((p,j)=>`<button class="sp ${j===k?'on':''} ${j<k?'ok':''}" onclick="MJ.readPart(${j})"><span class="n">${j+1}</span><b>${p}</b></button>`).join('');
  const el=$('sp');
  if(k===0){el.innerHTML=textBlock(st)+(st.note&&isStaffC()?`<div class="defn"><b>${t('tNote')}:</b> ${st.note}</div>`:'')+`<div class="navrow" style="justify-content:flex-end"><button class="btn gold" onclick="MJ.readPart(1)">${t('toQs')}</button></div>`;return}
  RS={ans:{}};
  el.innerHTML=`<details class="rdt"><summary>${t('showText')}</summary>${textBlock(st,1)}</details><p class="hint">${t('rNeed')}</p>`+st.qs.map((q,j)=>{
    const h=`<h3><span class="num">${j+1}</span>${q.q}</h3>`;
    if(q.k==='m')return `<div class="act rq">${h}<div class="opts" id="ro${j}">${q.o.map((o,m)=>`<button class="opt" onclick="MJ.rans(${j},${m})">${o}</button>`).join('')}</div><div class="fb" id="rf${j}"></div></div>`;
    if(q.k==='o')return `<div class="act rq">${h}<textarea class="inp rta" rows="2" placeholder="${t('myAns')}"></textarea><button class="btn ghost" style="padding:4px 14px" onclick="this.nextElementSibling.hidden=false;this.hidden=true">${t('model')}</button><p class="ca" hidden>${q.a}</p></div>`;
    return `<div class="act" id="act${q.pi}"></div>`}).join('')+
   `<div class="fb" id="rfin"></div><div class="navrow"><button class="btn ghost" onclick="MJ.readPart(0)">${t('rparts')[0]}</button><button class="btn gold" onclick="MJ.rfin()">${t('finish')}</button></div>`;
  st.practice.forEach((a,j)=>drawAct(j));
}
function rans(j,m){const q=STEPS[CUR-1].qs[j];if(j in RS.ans)return;const ok=m===q.c;RS.ans[j]=ok;
  const bs=document.querySelectorAll('#ro'+j+' .opt');bs[q.c].classList.add('ok');if(!ok)bs[m].classList.add('no');bs.forEach(b=>b.disabled=true);
  const f=$('rf'+j);f.className='fb '+(ok?'ok':'no');f.innerHTML=(ok?t('okAns'):t('rightIs')+q.o[q.c]+' ')+(q.why||'')}
function rfin(){const st=STEPS[CUR-1],mi=st.qs.map((q,j)=>q.k==='m'?j:-1).filter(j=>j>=0);
  if(mi.some(j=>!(j in RS.ans))){fb('rfin',false,t('rLeft'));return}
  const sc=mi.filter(j=>RS.ans[j]).length;
  QZ={items:mi.length?mi:[0],ans:mi.length?mi.map(j=>RS.ans[j]):[true],el:$('sp'),pass:Math.max(0,(mi.length||1)-1)};
  stepEnd();$('stepper').innerHTML=T.rparts[L()].map((p,j)=>`<button class="sp ok" onclick="MJ.readPart(${j})"><span class="n">${j+1}</span><b>${p}</b></button>`).join('');
}

/* ---------- level & final tests ---------- */
function testName(key){return key==='final'?(L()?'Final test':'الاختبار النهائي'):`${t('testT')} ${tx(LEVELS[key==='l1'?0:1].n)}`}
function renderTest(app,key){
  let items=[];
  if(D.meta.kind==='read'){const pool=[],sts=key==='final'?STEPS:LEVELS[key==='l1'?0:1].steps.map(i=>STEPS[i-1]);
    sts.forEach(s=>{if(s.quiz&&s.quiz.length){const qq=s.quiz[Math.floor(Math.random()*s.quiz.length)];pool.push({q:'«'+s.t+'» — '+qq.q,o:[qq.o,qq.o],c:qq.c,e:qq.e||''})}});
    pool.sort(()=>Math.random()-.5);items=pool.slice(0,key==='final'?20:15)}
  else if(key==='final')STEPS.forEach(s=>items.push(s.quiz[1]));
  else LEVELS[key==='l1'?0:1].steps.forEach(i=>{const q=STEPS[i-1].quiz;items.push(q[0],q[2])});
  const need=Math.ceil(items.length*0.8);
  app.innerHTML=`<div class="shead"><div><div class="k">${ct('t')}</div><h1>${testName(key)}</h1></div><span class="spacer"></span><button class="btn ghost" onclick="MJ.go('course')">${t('back')}</button></div><div class="panel" id="tp"></div>`;
  QZ={items,i:0,ans:[],el:$('tp'),pass:need,title:testName(key),needTxt:t('testNeed'),onEnd:()=>{
    const sc=QZ.ans.filter(Boolean).length,pass=sc>=need;
    if(pass){S.tests[key]=true;save()}
    const medal=key==='final'?LEVELS[2].medal:LEVELS[key==='l1'?0:1].medal;
    QZ.el.innerHTML=`<div class="result">${stairs(pass?6:3)}<div class="big">${sc} / ${items.length}</div><h2>${pass?t('passedTest'):t('almost')}</h2>
     <p class="hint">${pass?`${t('medalGot')} «${tx(medal)}»`:t('testNeed')}</p>
     <div class="row" style="justify-content:center;margin-top:16px">${pass?(key==='final'?`<button class="btn gold" onclick="MJ.go('certificate')">${t('certT')}</button>`:`<button class="btn gold" onclick="MJ.go('step-${key==='l1'?LEVELS[1].steps[0]:LEVELS[2].steps[0]}')">${t('nextStep')}</button>`):`<button class="btn gold" onclick="MJ.go('test-${key}')">${t('retry')}</button>`}<button class="btn ghost" onclick="MJ.go('course')">${t('seeLadder')}</button></div></div>`;
  }};
  quizQ();
}

/* ---------- certificate ---------- */
function renderCert(app){
  if(!S.tests.final&&!staffOpen()){go('course');return}
  const d=new Date(),ds=`${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
  app.innerHTML=`<div class="shead"><div><div class="k">${ct('t')}</div><h1>${t('certT')}</h1></div><span class="spacer"></span><button class="btn ghost" onclick="MJ.go('course')">${t('back')}</button></div>
   <div class="row" style="justify-content:center"><input class="inp" id="nm" value="${(S.name||'').replace(/"/g,'&quot;')}" placeholder="${t('certName')}"><button class="btn" onclick="MJ.setName()">${t('showCert')}</button></div>
   <div class="cert"><img src="art/brand/hiraa-lockup-light.svg" alt="حراء"><h1>${t('certT')}</h1><p class="meta">${t('maarij')} · ${ct('t')}</p>
    <div class="nm">${S.name?S.name.replace(/</g,'&lt;'):'—'}</div><p>${ct('cert')}</p>
    <div class="medals" style="max-width:520px;margin:14px auto">${LEVELS.map(l=>`<div class="medal got">${tx(l.medal)}</div>`).join('')}</div>
    <p class="meta">${t('date')}: ${ds}</p></div>`;
}


/* ---------- teacher report ---------- */
async function renderReport(app){
  if(!isStaffC()){go('course');return}
  app.innerHTML=`<div class="shead"><div><div class="k">${ct('t')}</div><h1>${t('repT')}</h1></div><span class="spacer"></span><button class="btn ghost" onclick="MJ.go('course')">${t('back')}</button></div><div class="panel" id="rp">${t('loading')}</div>`;
  try{
    const {data}=await C.sb.from('maarij_progress').select('user_id,passed,tests,updated_at').eq('course',CID).order('updated_at',{ascending:false}).limit(500);
    const rows=(data||[]).filter(r=>r.user_id!==(C.state.session&&C.state.session.user.id));
    if(!rows.length){$('rp').innerHTML=`<p class="hint">${t('noData')}</p>`;return}
    const ids=rows.map(r=>r.user_id);
    const {data:ps}=await C.sb.from('profiles').select('id,full_name_ar,full_name_en,year_group').in('id',ids);
    const nm={};(ps||[]).forEach(p=>nm[p.id]=(L()?p.full_name_en||p.full_name_ar:p.full_name_ar||p.full_name_en)||'—');
    $('rp').innerHTML=`<table class="mjr"><tr><th>${t('student')}</th><th>${t('steps')}</th><th>${t('curStep')}</th><th>${t('medals')}</th><th>${t('updated')}</th></tr>${rows.map(r=>{const p=r.passed||[];let cur=N;for(let i=1;i<=N;i++)if(!p.includes(i)){cur=i;break}const ts=r.tests||{};const d=new Date(r.updated_at);
      return `<tr><td>${C.esc(nm[r.user_id]||'—')}</td><td>${p.length} / ${N}</td><td>${cur} · ${tx(STEPS[cur-1].t)}</td><td>${['l1','l2','final'].filter(k=>ts[k]).map(k=>tx(LEVELS[k==='l1'?0:k==='l2'?1:2].medal)).join('، ')||'—'}</td><td>${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}</td></tr>`}).join('')}</table>`;
  }catch(e){$('rp').textContent=String(e.message||e)}
}

window.MJ={go,showPart,readPart,rans,rfin,lstep,play,setRep,setSlow,drawAct,pick,drop,tap,ord,answer,
  subj:(s)=>{SUBJ_SEL=s;try{localStorage.setItem('hiraa-maarij-subj',s)}catch(e){}route()},openC:(c)=>{location.hash='#/maarij/'+c},teacher:()=>{if(!isStaffC())return;S.open=!S.open;save();route()},
  reset:()=>{S.passed=[];S.tests={};S.start=0;save();route()},
  pans:(k)=>{const q=PLACE[P.i];P.ans.push(k===q.c);P.score+=(k===q.c)?1:0;P.i++;placeQ()},
  startAt:(n)=>{S.start=Math.max(S.start||0,n);save();go('step-'+n)},
  grade:(n,g)=>{if(n>1&&!isPassed(n)&&!unlocked(n)&&!confirm(t('grConfirm')))return;if(n>1){S.start=Math.max(S.start||0,n);save()}go('step-'+n)},
  backLearn:()=>{lc=99;showPart(0)},review:()=>{lc=0;showPart(0)},nextQ:()=>{QZ.i++;quizQ()},
  setName:()=>{S.name=$('nm').value.trim();save();route()}};

window.HiraaMaarij=async function(ctx){
  C=ctx;
  const parts=ctx.parts||[];
  if(parts[1]&&!COURSES[parts[1]]){location.hash='#/maarij';return}
  SUB=!parts[1]?'courses':(parts[2]||'course');
  ctx.h(`<div class="mj" dir="${L()?'ltr':'rtl'}" lang="${L()?'en':'ar'}"><div class="wrap"><nav class="mj-crumb" id="mjCrumb"></nav><div id="mjApp">${t('loading')}</div><p class="note">${parts[1]==='madarij'?t('foot3'):(['shiir','imla','nahw'].includes(parts[1]))?t('foot2'):t('foot')}${ctx.state.session?'':' · '+t('signHint')}</p></div></div>`);
  if(parts[1]){
    const cid=parts[1];
    if(!CACHE[cid]){try{CACHE[cid]=await (await fetch(COURSES[cid],{cache:'no-cache'})).json()}catch(e){$('mjApp').textContent='تعذّر تحميل الدورة.';return}}
    if(cid!==CID||!D){CID=cid;D=CACHE[cid];({SURAH,LEVELS,STEPS,PLACE}=D);N=STEPS.length;loadS();}
    await loadRemote();
  }
  route();
};
})();
