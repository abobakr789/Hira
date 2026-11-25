// اختبار محاكاة للبحث الشامل: node _tools/test_search.js .
const fs = require("fs"), path = require("path"), root = path.resolve(process.argv[2] || ".");
const src = fs.readFileSync(path.join(root, "hiraa/assets/search.js"), "utf8");
const els = {}, listeners = {};
const el = (id) => (els[id] = els[id] || { id, innerHTML: "", value: "", addEventListener(ev, f) { listeners[id + ev] = f; } });
global.window = {}; global.document = { getElementById: el };
let calls = [];
const sb = { rpc: async (fn, a) => { calls.push([fn, a]); return { data: { lessons: [{ code: "L-1", title_ar: "درس الصلاة", year_group: 5 }], evidences: [{ kind: "quran", lesson_code: "L-1", title_ar: "درس الصلاة", surah_no: 2, ayah_from: 43, ayah_to: 43, text_ar: "وَأَقِيمُوا الصَّلَاةَ" }, { kind: "hadith", lesson_code: "L-2", title_ar: "درس٢", text_ar: "<b>x</b>" }] }, error: null }; } };
eval(src);
(async () => {
  const ctx = { sb, state: { session: {} }, lang: () => "ar", params: new URLSearchParams("q=الصلاة"), h: () => { el("srQ"); el("srOut"); return 1; } };
  await window.HiraaSearch(ctx);
  await new Promise((r) => setTimeout(r, 20));
  const h = els.srOut.innerHTML;
  if (!calls.length || calls[0][0] !== "search_site" || calls[0][1].p_q !== "الصلاة") throw new Error("rpc not called: " + JSON.stringify(calls));
  if (!h.includes("#/lesson/L-1") || !h.includes("#/ayah/L-1")) throw new Error("links missing: " + h.slice(0, 200));
  if (h.includes("<b>x</b>")) throw new Error("html not escaped");
  if (h.includes("#/ayah/L-2")) throw new Error("hadith should not link verse card");
  // أقل من ٣ أحرف: لا استدعاء
  calls = []; el("srQ").value = "اب"; listeners.srQinput(); await new Promise((r) => setTimeout(r, 500));
  if (calls.length) throw new Error("short query must not call rpc");
  // دون تسجيل دخول
  await window.HiraaSearch(Object.assign(ctx, { state: { session: null } }));
  if (!els.srOut.innerHTML.includes("سجّل")) throw new Error("login prompt missing");
  console.log("ALL PASS");
})().catch((e) => { console.error("FAIL", e.message); process.exit(1); });
