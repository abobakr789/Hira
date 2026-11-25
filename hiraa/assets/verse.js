/* بطاقة الآية — آية اليوم وآيات كل درس، بنص المصحف من جدول quran_ayahs (لا نصوص من الذاكرة).
   المسارات: #/ayah (آية اليوم)  و  #/ayah/<رمز الدرس> (آيات الدرس). تنزيل البطاقة صورة PNG. */
(function () {
  const TX = {
    title: ["بطاقة الآية", "Verse card"], today: ["آية اليوم", "Verse of the day"], another: ["آية أخرى", "Another verse"],
    save: ["تنزيل البطاقة صورة", "Download card"], lesson: ["من درس", "From lesson"], open: ["افتح الدرس", "Open lesson"],
    none: ["لا توجد آيات لهذا الدرس.", "No verses for this lesson."], err: ["تعذّر تحميل الآيات.", "Could not load verses."],
    loading: ["جارٍ التحميل…", "Loading…"], ayah: ["آية", "Ayah"], pick: ["آيات هذا الدرس", "Verses of this lesson"]
  };
  const SEL = "surah_no,ayah_from,ayah_to,lesson_id,lessons!inner(code,title_ar,title_en,is_published)";
  let C, en, S = {};
  const t = (k) => TX[k][en ? 1 : 0];
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const ar = (n) => (en ? String(n) : String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]));
  const $ = (id) => document.getElementById(id);

  async function surahs() {
    if (S.names) return S.names;
    const { data } = await C.sb.from("quran_surahs").select("id,name_ar,name_en");
    S.names = {}; (data || []).forEach((r) => { S.names[r.id] = r; });
    return S.names;
  }
  async function textOf(v) {
    const to = v.ayah_to || v.ayah_from;
    const { data, error } = await C.sb.from("quran_ayahs").select("ayah,text_ar,text_en").eq("surah", v.surah_no).gte("ayah", v.ayah_from).lte("ayah", to).order("ayah");
    if (error || !data || !data.length) throw error || new Error("no text");
    return data;
  }
  async function shape(v) {
    const [names, rows] = await Promise.all([surahs(), textOf(v)]);
    const nm = names[v.surah_no] || {}, to = v.ayah_to || v.ayah_from;
    const body = en ? rows.map((r) => r.text_en).join(" ") : rows.map((r) => r.text_ar + " ﴿" + ar(r.ayah) + "﴾").join(" ");
    const ref = (en ? nm.name_en : "سورة " + nm.name_ar) + " · " + t("ayah") + " " + ar(v.ayah_from) + (to !== v.ayah_from ? "–" + ar(to) : "");
    const l = v.lessons || {};
    return { body, ref, lessonCode: l.code, lessonTitle: en && l.title_en ? l.title_en : l.title_ar };
  }

  function wrap(g, text, max) {
    const words = text.split(/\s+/), lines = []; let cur = "";
    words.forEach((w) => { const x = cur ? cur + " " + w : w; if (g.measureText(x).width > max && cur) { lines.push(cur); cur = w; } else cur = x; });
    if (cur) lines.push(cur); return lines;
  }
  async function png(card) {
    try { if (document.fonts && document.fonts.ready) await document.fonts.ready; } catch (e) {}
    const W = 1080, H = 1350, cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    const g = cv.getContext("2d"), grd = g.createLinearGradient(0, 0, 0, H);
    grd.addColorStop(0, "#0F2A3D"); grd.addColorStop(1, "#1C4A5E"); g.fillStyle = grd; g.fillRect(0, 0, W, H);
    g.strokeStyle = "#E7B659"; g.lineWidth = 4; g.strokeRect(40, 40, W - 80, H - 80);
    g.direction = en ? "ltr" : "rtl"; g.textAlign = "center"; g.fillStyle = "#FFF8E7";
    let size = 64, lines;
    do { g.font = size + "px " + (getComputedStyle(document.body).getPropertyValue("--font-brand").trim() || "serif"); lines = wrap(g, card.body, W - 220); size -= 4; } while (lines.length * size * 1.9 > H - 560 && size > 28);
    const lh = size * 1.9 + 8, y0 = (H - lines.length * lh) / 2 + lh * 0.4;
    lines.forEach((ln, i) => g.fillText(ln, W / 2, y0 + i * lh));
    g.fillStyle = "#E7B659"; g.font = "40px sans-serif"; g.fillText(card.ref, W / 2, H - 190);
    g.fillStyle = "#CFE3EA"; g.font = "32px sans-serif"; g.fillText(en ? "Hiraa" : "حراء", W / 2, H - 120);
    return new Promise((res) => cv.toBlob(res, "image/png"));
  }

  function draw(card, extra) {
    $("vcApp").innerHTML = `<div class="vc-card" dir="${en ? "ltr" : "rtl"}"><p class="vc-body">${esc(card.body)}</p><p class="vc-ref">${esc(card.ref)}</p></div>
      <div class="vc-meta">${card.lessonCode ? `${t("lesson")}: <a href="#/lesson/${esc(card.lessonCode)}">${esc(card.lessonTitle || "")}</a>` : ""}</div>
      <div class="vc-row"><button class="btn btn-primary" id="vcSave">${t("save")}</button>${extra || ""}</div>`;
    $("vcSave").onclick = async () => {
      const b = await png(card); if (!b) return;
      const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "hiraa-ayah.png";
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    };
  }

  async function daily(shift) {
    if (!S.pool) {
      const { data, error } = await C.sb.from("evidences").select(SEL).not("surah_no", "is", null).eq("is_verified", true).eq("lessons.is_published", true).limit(1000);
      if (error) throw error;
      S.pool = (data || []).filter((v) => (v.ayah_to || v.ayah_from) - v.ayah_from <= 3);
    }
    if (!S.pool.length) throw new Error("empty");
    const day = Math.floor((Date.now() + 4 * 3600e3) / 864e5);
    const v = S.pool[(day + shift * 7) % S.pool.length];
    draw(await shape(v), `<button class="btn btn-ghost" id="vcNext">${t("another")}</button>`);
    $("vcNext").onclick = () => { S.shift = (S.shift || 0) + 1; run(S.code, S.shift); };
  }

  async function ofLesson(code) {
    const { data, error } = await C.sb.from("evidences").select(SEL).not("surah_no", "is", null).eq("lessons.code", code).order("sort_order");
    if (error) throw error;
    if (!data || !data.length) { $("vcApp").innerHTML = `<p class="vc-note">${t("none")}</p>`; return; }
    const cards = await Promise.all(data.map(shape));
    const show = (i) => draw(cards[i], cards.length > 1 ? cards.map((c, k) => `<button class="btn ${k === i ? "btn-dawn" : "btn-ghost"}" data-k="${k}">${ar(k + 1)}</button>`).join("") : "");
    show(0);
    $("vcApp").addEventListener("click", (e) => { const k = e.target.dataset && e.target.dataset.k; if (k != null && e.target.tagName === "BUTTON") show(+k); });
  }

  async function run(code, shift) {
    S.code = code;
    $("vcApp").innerHTML = `<p class="vc-note">${t("loading")}</p>`;
    try { if (code) await ofLesson(code); else await daily(shift || 0); }
    catch (e) { $("vcApp").innerHTML = `<p class="vc-note">${t("err")}</p>`; }
  }

  window.HiraaVerse = async function (ctx) {
    C = ctx; en = ctx.lang() === "en";
    const code = ctx.parts && ctx.parts[1] ? decodeURIComponent(ctx.parts[1]) : null;
    const out = ctx.h(`<section class="section"><div class="wrap vc-wrap"><h1 class="vc-h">${code ? t("pick") : t("today")}</h1><div id="vcApp"></div></div></section>`);
    S.shift = 0; await run(code, 0);
    return out;
  };
})();
