/* البحث الشامل — دروس + آيات وأحاديث الدروس، بلا تشكيل (RPC: public.search_site). المسار: #/search
   لا يبحث في بنك الأسئلة (حتى لا تُكشف الإجابات). */
(function () {
  const TX = {
    title: ["البحث", "Search"], ph: ["ابحث عن درس أو آية أو حديث…", "Search for a lesson, verse or hadith…"],
    lessons: ["الدروس", "Lessons"], texts: ["آيات وأحاديث الدروس", "Verses and hadith in lessons"], quran: ["قرآن", "Quran"], hadith: ["حديث", "Hadith"],
    none: ["لا نتائج. جرّب كلمة أخرى.", "No results. Try another word."], min: ["اكتب ثلاثة أحرف على الأقل.", "Type at least three letters."],
    err: ["تعذّر البحث الآن. حاول لاحقًا.", "Search is unavailable now. Try again later."], login: ["سجّل الدخول للبحث.", "Sign in to search."],
    loading: ["جارٍ البحث…", "Searching…"], card: ["بطاقة الآية", "Verse card"], yr: ["ص", "Y"], ayah: ["آية", "Ayah"]
  };
  let C, en;
  const t = (k) => TX[k][en ? 1 : 0];
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const ar = (n) => String(n);   // أرقام غربية (0–9) في حراء كلها
  const clip = (s, n) => { s = String(s || "").replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, n) + "…" : s; };
  let seq = 0, timer = null;

  function lessonRow(l) {
    return `<a class="sr-row" href="#/lesson/${encodeURIComponent(l.code)}"><b>${esc(en && l.title_en ? l.title_en : l.title_ar)}</b><small>${t("yr")} ${ar(l.year_group)}</small></a>`;
  }
  function evRow(e) {
    const isQ = e.kind === "quran", to = e.ayah_to && e.ayah_to !== e.ayah_from ? "–" + ar(e.ayah_to) : "";
    const ref = isQ && e.surah_no ? ` · ${t("ayah")} ${ar(e.ayah_from)}${to}` : "";
    return `<div class="sr-ev"><span class="sr-tag ${isQ ? "q" : "h"}">${isQ ? t("quran") : t("hadith")}${esc(ref)}</span>
      <p class="${isQ ? "qt" : ""}">${esc(clip(e.text_ar, 170))}</p>
      <a href="#/lesson/${encodeURIComponent(e.lesson_code)}">${esc(en && e.title_en ? e.title_en : e.title_ar)}</a>${isQ ? ` · <a href="#/ayah/${encodeURIComponent(e.lesson_code)}">${t("card")}</a>` : ""}</div>`;
  }
  function draw(box, data) {
    const L = (data && data.lessons) || [], E = (data && data.evidences) || [];
    if (!L.length && !E.length) { box.innerHTML = `<p class="sr-note">${t("none")}</p>`; return; }
    box.innerHTML = (L.length ? `<h2 class="sr-h">${t("lessons")}</h2>${L.map(lessonRow).join("")}` : "") +
      (E.length ? `<h2 class="sr-h">${t("texts")}</h2>${E.map(evRow).join("")}` : "");
  }
  async function go(box, q) {
    const mine = ++seq;
    q = q.trim();
    if (q.length < 3) { box.innerHTML = q ? `<p class="sr-note">${t("min")}</p>` : ""; return; }
    box.innerHTML = `<p class="sr-note">${t("loading")}</p>`;
    const { data, error } = await C.sb.rpc("search_site", { p_q: q, p_lim: 15 });
    if (mine !== seq) return;           // وصلت نتيجة أحدث
    if (error) { box.innerHTML = `<p class="sr-note">${t("err")}</p>`; return; }
    draw(box, data);
  }

  window.HiraaSearch = async function (ctx) {
    C = ctx; en = ctx.lang() === "en";
    const q0 = (ctx.params && ctx.params.get && ctx.params.get("q")) || "";
    const out = ctx.h(`<section class="section"><div class="wrap sr-wrap" dir="${en ? "ltr" : "rtl"}"><h1 class="sr-title">${t("title")}</h1>
      <input id="srQ" class="sr-in" type="search" autocomplete="off" placeholder="${esc(t("ph"))}" value="${esc(q0)}"><div id="srOut"></div></div></section>`);
    const inp = document.getElementById("srQ"), box = document.getElementById("srOut");
    if (!ctx.state.session) { box.innerHTML = `<p class="sr-note">${t("login")}</p>`; return out; }
    inp.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(() => go(box, inp.value), 350); });
    if (q0) go(box, q0);
    return out;
  };
})();
