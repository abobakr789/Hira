// اختبار صياغة ملاحظة ولي الأمر: بلا روابط ولا أرقام صفحات ولا أرقام هندية، وسلوك الحالات الحدّية
global.window = {}; global.document = {};
require('../hiraa/assets/parentnote.js');
const { noteAr, noteEn } = window.__pnTest; let bad = 0;
const ok = (c, m) => { if (!c) { bad++; console.log('FAIL', m); } };
const F = { lessons: 12, recent: 3, medals: 5, reviews: 20, mockPct: 82, roots: [], diagOk: true };
const cases = [
  noteAr('سالم', 'm', F, ['الصلاة وأركانها'], 'أ. أبو بكر'),
  noteAr('مريم', 'f', { ...F, mockPct: 60 }, ['أ', 'ب', 'ج'], ''),
  noteAr('علي', 'n', { lessons: 0, recent: 0, medals: 0, reviews: 0, mockPct: null, roots: [], diagOk: false }, [], 'م'),
  noteEn('Salem', F, ['Prayer'], 'Mr A'),
  noteEn('Mona', { lessons: 1, recent: 1, medals: 1, reviews: 1, mockPct: 50, roots: [], diagOk: false }, [], '')
];
cases.forEach((t, i) => {
  ok(!/https?:|www\.|\.com|رابط|صفحة|ص\s?\d|page \d/i.test(t), 'no links/pages #' + i);
  ok(!/[٠-٩]/.test(t), 'western digits #' + i);
  ok(!/undefined|null|NaN/.test(t), 'no undefined #' + i);
});
ok(/12 درسًا/.test(cases[0]) && !/12 دروس/.test(cases[0]) && /وسامًا|أوسمة/.test(cases[0]), 'ar counts');
ok(/أنجزت/.test(cases[1]) && /الطالبة/.test(cases[1]), 'feminine');
ok(/لم يبدأ/.test(cases[2]), 'empty case');
ok(/1\. /.test(cases[1]) && /3\. /.test(cases[1]), 'roots listed');
console.log(bad ? 'FAILED ' + bad : 'ALL PASS');
process.exit(bad ? 1 : 0);
