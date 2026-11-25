// اختبار محاكاة للواحة، ويكتب SVG لمعاينته: node _tools/test_oasis.js . [out.svg]
const fs = require("fs"), path = require("path"), root = path.resolve(process.argv[2] || ".");
const src = fs.readFileSync(path.join(root, "hiraa/assets/oasis.js"), "utf8");
const els = {}; global.window = {}; global.document = { getElementById: (id) => (els[id] = els[id] || { innerHTML: "" }) };
const tbl = { journey_progress: [{ finished_at: "x", medals: 3 }, { finished_at: "y", medals: 2 }, { finished_at: null, medals: 1 }], memo_progress: [{ reviews: 40 }, { reviews: 25 }], prep_runs: [{ id: 1 }] };
const sb = { auth: { getUser: async () => ({ data: { user: { id: "u1" } } }) }, from: (t) => { const o = { select: () => o, eq: () => Promise.resolve({ data: tbl[t] }) }; return o; } };
eval(src);
(async () => {
  const mk = (over) => Object.assign({ sb, state: { session: {} }, isStaff: false, lang: () => "ar", h: (x) => { els.main = x; document.getElementById("osApp"); return x; } }, over);
  // h يحقن الحاوية فعليًا
  const ctx = mk({}); ctx.h = () => { document.getElementById("osApp").innerHTML = "…"; return 1; };
  await window.HiraaOasis(ctx);
  const h = els.osApp.innerHTML;
  if (!h.includes("<svg") || !h.includes("os-stats")) throw new Error("scene missing: " + h.slice(0, 120));
  if (!h.includes("٢") ) throw new Error("lessons count (2) not shown");
  if ((h.match(/#7A5233/g) || []).length !== 2) throw new Error("expected 2 palms, got " + (h.match(/#7A5233/g) || []).length);
  if (process.argv[3]) fs.writeFileSync(process.argv[3], h.match(/<svg[\s\S]*<\/svg>/)[0].replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" '));
  await window.HiraaOasis(Object.assign(ctx, { state: { session: null } }));
  if (!els.osApp.innerHTML.includes("سجّل")) throw new Error("login prompt missing");
  console.log("ALL PASS");
})().catch((e) => { console.error("FAIL", e.message); process.exit(1); });
