// اختبار تشغيل «أكمل الناقص» كاملًا داخل jsdom. المسار: NODE_PATH=/tmp/jd/node_modules node _tools/test_arcade_dom.js
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<div id="r"></div>', { pretendToBeVisual: true });
global.window = dom.window; global.document = dom.window.document; global.localStorage = { getItem() { return null; }, setItem() {} };
window.matchMedia = global.matchMedia = () => ({ matches: true }); // حركة مخفّضة: لا مؤقّتات تأخير
const AC = function () { return { createOscillator: () => ({ connect() {}, start() {}, stop() {}, frequency: { setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} }, type: '' }), createGain: () => ({ connect() {}, gain: { setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} } }), destination: {}, currentTime: 0, state: 'running', resume() {} }; };
window.AudioContext = AC; global.AudioContext = AC;
require('../hiraa/assets/arcade.js');
const W = ['الصلاة', 'الزكاة', 'الصيام', 'الحج', 'الوضوء', 'الطهارة'];
const L = { id: 'L1', items: [], words: W.map((w, i) => [w, 'معنى' + i]),
  quiz: [['نحافظ على الوضوء قبل كل صلاة دائما', true], ['من أركان الإسلام الزكاة والصيام لمن استطاع', true], ['يجب على المسلم أداء الحج مرة في العمر', true], ['تبدأ العبادات بالطهارة ثم الصلاة بخشوع', true]] };
const root = document.getElementById('r'); let bad = 0; const ok = (c, m) => { if (!c) { bad++; console.log('FAIL', m); } };
const ended = []; HiraArcadeRun();
function HiraArcadeRun() {
  const h = window.HiraArcade.mount(root, { lessons: [L], focusId: 'L1', onFinish: (m, s, x) => { ended.push([m, s, x]); return ''; } });
  const card = root.querySelector('[data-g="cloze"]');
  ok(card && !card.disabled, 'cloze card enabled');
  if (!card) return finish();
  card.click();
  let guard = 0;
  while (guard++ < 12 && !root.querySelector('.arc-end')) {
    const bl = root.querySelector('[data-blank]'); if (!bl) break;
    ok(/＿/.test(bl.textContent), 'blank shown');
    const opts = root.querySelectorAll('[data-o]'); ok(opts.length === 4, '4 options');
    opts[0].click();
    ok(!/＿/.test(root.querySelector('.arc-blank').textContent), 'blank filled after pick');
    const nx = root.querySelector('.arc-next'); ok(!!nx, 'next button'); if (nx) nx.click();
  }
  ok(!!root.querySelector('.arc-end'), 'end screen reached');
  ok(ended.length === 1 && ended[0][0] === 'cloze', 'onFinish called with cloze');
  finish();
}
function finish() { console.log(bad ? 'FAILED ' + bad : 'ALL PASS'); process.exit(bad ? 1 : 0); }
