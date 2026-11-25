// محاكاة بلا متصفح لمنطق المسار التشخيصي: node _tools/test_diagnostic.js .
const fs = require('fs');
const root = process.argv[2];
global.window = { HIRAA_PREREQ: JSON.parse(fs.readFileSync(root + '/data/prereqs-islamic.json', 'utf8')) };
window.HIRAA_PREREQS = { islamic: window.HIRAA_PREREQ, arabic: JSON.parse(fs.readFileSync(root + '/data/prereqs-arabic.json', 'utf8')), social: JSON.parse(fs.readFileSync(root + '/data/prereqs-social.json', 'utf8')) };
let PARTS = ['diagnose'], seenSubject = null;
const els = {};
const lastHtml = () => (els.dgApp || {}).innerHTML || '';
global.document = {
  getElementById: id => els[id] || (els[id] = { innerHTML: '', onclick: null, value: '7' }),
  querySelectorAll: sel => {
    if (sel !== '.dg-opt') return [];
    const ids = [...lastHtml().matchAll(/data-id="([^"]+)"/g)].map(m => m[1]);
    els.__last = ids.map(id => ({ dataset: { id }, onclick: null })); return els.__last;
  }
};
global.localStorage = { setItem() {}, getItem() { return null; } };
const fs2 = require('vm');
let weak = new Set();
let currentQs = {};
const sb = {
  rpc: async (fn, args) => {
    if (fn === 'diag_questions') {
      seenSubject = args.p_subject;
      const rows = [];
      args.p_codes.forEach(c => { for (let k = 0; k < 3; k++) { const qid = c + '|' + k; rows.push({ oc: c, qid, qtype: 'mcq', stem_ar: 'سؤال ' + qid, stem_en: null, options: [{ id: 'a', text: 'ا' }, { id: 'b', text: 'ب' }, { id: 'c', text: 'ج' }, { id: 'd', text: 'د' }], difficulty: 1 }); } });
      return { data: rows, error: null };
    }
    if (fn === 'prep_grade') {
      const items = {}; Object.entries(args.p_answers).forEach(([q, a]) => { items[q] = { ok: a === 'a', correct: 'a' }; });
      if (args.p_save !== false) throw new Error('prep_grade must not save');
      return { data: { items }, error: null };
    }
    return { data: null, error: { message: 'unknown' } };
  },
  from: () => ({ select: () => ({ in: async () => ({ data: [] }) }) })
};
eval(fs.readFileSync(root + '/hiraa/assets/diagnostic.js', 'utf8'));
async function sim(weakSet, grade) {
  weak = weakSet; for (const k in els) delete els[k];
  const ctx = { parts: PARTS, h: html => { els.dgApp = { innerHTML: '' }; }, sb, state: { session: { user: {} }, profile: { year_group: grade } }, isStaff: () => false, lang: () => 'ar' };
  await window.HiraaDiagnose(ctx);
  els.dgGo.onclick();
  // يجيب كل سؤال: خطأ إن كان مخرجه ضمن weak، وإلا صح
  for (let i = 0; i < 400; i++) {
    await new Promise(r => setTimeout(r, 0));
    const html = lastHtml();
    if (html.includes('dg-sum')) break;
    if (html.includes('dg-opt')) {
      const code = (html.match(/dg-k">([^<]+)</) || [])[1];
      const q = (html.match(/dg-q">سؤال ([^<]+)</) || [])[1] || '';
      const oc = q.split('|')[0];
      const btns = els.__last;
      const pick = weak.has(oc) ? btns.find(b => b.dataset.id !== 'a') : btns.find(b => b.dataset.id === 'a');
      pick.onclick();
    }
  }
  return lastHtml();
}
(async () => {
  const strip = h => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  // أ) تعثر في رخص الطهارة (ص7) وفي أعمال الصلاة (ص6) فقط: الأصل هو ص6، وص7 متأثر
  let out = await sim(new Set(['1.3.1.4.G7', '1.3.1.4.G6']), 7);
  console.log('A:', strip(out).slice(0, 380));
  const okA = /dg-step root[\s\S]*أركان الصلاة/.test(out) && /dg-step affected[\s\S]*رخص الطهارة/.test(out);
  // ب) لا تعثر
  out = await sim(new Set(), 7);
  console.log('B:', strip(out).slice(0, 120));
  const okB = out.includes('أنت متمكّن');
  // ج) تعثر في الجذر الأبعد: ص3 → ص6 → ص7
  out = await sim(new Set(['1.3.1.4.G7', '1.3.1.4.G6', '1.2.1.4.G3']), 7);
  const rootBlock = out.split('dg-step root')[1] || '';
  const okC = /شروط الصلاة/.test(rootBlock.split('dg-step')[0]) && !/dg-step root[\s\S]*dg-step root/.test(out);
  console.log('C root:', strip(rootBlock).slice(0, 140));
  // د) العربية: ص4 يتعثر فيه، وص3 يتعثر، وص2 ينجح → الأصل ص3 والمتأثر ص4
  PARTS = ['diagnose', 'arabic'];
  out = await sim(new Set(['AR-1.1.1.3.G4', 'AR-1.1.1.3.G3']), 4);
  const rb = out.split('dg-step root')[1] || '';
  const okD = seenSubject === 'arabic' && /AR-1\.1\.1\.3\.G3/.test(rb.split('dg-step')[0]) && /dg-step affected[\s\S]*AR-1\.1\.1\.3\.G4/.test(out) && !/AR-1\.1\.1\.3\.G2/.test(rb.split('dg-step')[0]);
  console.log('D root:', strip(rb).slice(0, 140));
  // هـ) الدراسات الاجتماعية: ص3 وص2 يتعثران وص1 ينجح → الأصل ص2 والمتأثر ص3
  PARTS = ['diagnose', 'social'];
  out = await sim(new Set(['SS-1.1.2.1.G3', 'SS-1.1.2.1.G2']), 3);
  const rs = out.split('dg-step root')[1] || '';
  const okE = seenSubject === 'social' && /SS-1\.1\.2\.1\.G2/.test(rs.split('dg-step')[0]) && /dg-step affected[\s\S]*SS-1\.1\.2\.1\.G3/.test(out);
  console.log('E root:', strip(rs).slice(0, 120));
  console.log(okA && okB && okC && okD && okE ? 'ALL PASS' : 'FAIL', { okA, okB, okC, okD, okE });
})().catch(e => { console.error('ERR', e); process.exit(1); });
