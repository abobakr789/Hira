// اختبار بنك «أكمل الناقص» (منطق بلا DOM): node _tools/test_arcade_cloze.js
global.window = { matchMedia: () => ({ matches: false }) }; global.localStorage = { getItem() { return null; }, setItem() {} };
global.document = { createElement: () => ({}), addEventListener() {} };
require('../hiraa/assets/arcade.js');
const A = window.HiraArcade; let bad = 0; const ok = (c, m) => { if (!c) { bad++; console.log('FAIL', m); } };
const words = ['الصلاة', 'الزكاة', 'الصيام', 'الحج', 'الوضوء', 'الطهارة'];
const P = { pairs: words.map((w, i) => ({ k: w.replace(/^ال/, ''), a: w, b: 'معنى' + i, icon: '', lid: 'L1' })),
  stmts: [
    { text: 'الصلاة عماد الدين وهي أعظم أركان الإسلام', words: 'الصلاة عماد الدين وهي أعظم أركان الإسلام'.split(' '), lid: 'L1' },
    { text: 'نبدأ يومنا بذكر الله وبالحج والصيام', words: 'نبدأ يومنا بذكر الله وبالحج والصيام'.split(' '), lid: 'L1' },
    { text: 'قصيرة جدا', words: ['قصيرة', 'جدا'], lid: 'L1' }
  ] };
const B = A.clozeBank(P);
ok(B.length >= 1, 'bank not empty');
B.forEach((r) => {
  ok(r.opts.length === 4 && new Set(r.opts).size === 4, 'four distinct options');
  ok(r.opts.includes(r.orig), 'correct option present');
  ok(r.at > 0, 'first word never blanked');
  ok(r.words[r.at] === r.orig, 'index points to original');
  const others = r.opts.filter((o) => o !== r.orig);
  ok(others.every((o) => !r.words.some((w) => w.replace(/[^\p{L}]/gu, '') === o.replace(/[^\p{L}]/gu, ''))), 'distractors not already in sentence');
});
ok(A.clozeBank({ pairs: P.pairs.slice(0, 3), stmts: P.stmts }).length === 0, 'too few distractors → none');
ok(A.clozeBank({ pairs: P.pairs, stmts: [] }).length === 0, 'no statements → none');
console.log(bad ? 'FAILED ' + bad : 'ALL PASS ' + B.length);
process.exit(bad ? 1 : 0);
