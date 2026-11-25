// اختبار محاكاة لبطاقة الآية: node _tools/test_verse.js .
const fs = require("fs"), path = require("path"), root = path.resolve(process.argv[2] || ".");
const src = fs.readFileSync(path.join(root, "hiraa/assets/verse.js"), "utf8");
const els = {}; const el = (id) => (els[id] = els[id] || { id, innerHTML: "", addEventListener() {}, set onclick(f) { this._c = f; }, get onclick() { return this._c; } });
global.window = {}; global.document = { getElementById: el, body: { getPropertyValue() { return ""; } }, fonts: null };
global.getComputedStyle = () => ({ getPropertyValue: () => "" });
const EV = [
  { surah_no: 49, ayah_from: 1, ayah_to: 3, lessons: { code: "L-1", title_ar: "درس", is_published: true } },
  { surah_no: 1, ayah_from: 1, ayah_to: 1, lessons: { code: "L-2", title_ar: "درس٢", is_published: true } },
  { surah_no: 2, ayah_from: 1, ayah_to: 200, lessons: { code: "L-3", title_ar: "طويل", is_published: true } }];
const q = (rows) => { const o = { select: () => o, not: () => o, eq: () => o, order: () => o, limit: () => Promise.resolve({ data: rows }), gte: () => o, lte: () => o, then: (f) => f({ data: rows }) }; return o; };
const sb = { from: (t) => t === "evidences" ? q(EV) : t === "quran_surahs" ? q([{ id: 49, name_ar: "الحجرات", name_en: "Al-Hujurat" }, { id: 1, name_ar: "الفاتحة", name_en: "Al-Fatihah" }]) : q([{ ayah: 1, text_ar: "نص١", text_en: "t1" }, { ayah: 2, text_ar: "نص٢", text_en: "t2" }]) };
eval(src.replace(/^[\s\S]*?\(function/, "(function")); // IIFE يسجّل window.HiraaVerse
(async () => {
  const mk = (parts) => ({ sb, parts, lang: () => "ar", h: (x) => x });
  await window.HiraaVerse(mk(["ayah"]));
  const a = els.vcApp.innerHTML;
  if (!a.includes("vc-card") || !a.includes("نص١") || !a.includes("﴿") ) throw new Error("daily card missing: " + a.slice(0, 200));
  if (a.includes("طويل")) throw new Error("long passage should be excluded from daily pool");
  await window.HiraaVerse(mk(["ayah", "L-1"]));
  if (!els.vcApp.innerHTML.includes("vc-card")) throw new Error("lesson card missing");
  console.log("ALL PASS");
})().catch((e) => { console.error("FAIL", e.message); process.exit(1); });
