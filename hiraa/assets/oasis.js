/* واحة الطالب — تقدّمه في صورة واحة تنمو (نخلة لكل درس أكمله، نجمة لكل وسام، ماء العين من مراجعاته).
   لا بشر ولا أنبياء ولا صحابة في الرسم، ولا مقارنة بين الطلاب. المسار: #/oasis. القراءة فقط من جداول الطالب نفسه. */
(function () {
  const TX = {
    title: ["واحتي", "My oasis"], sub: ["كل درس تُكمله يُنبت نخلة، وكل وسام يُضيء نجمة، وكل مراجعة تزيد ماء العين.", "Each finished lesson grows a palm, each medal lights a star, each review fills the spring."],
    lessons: ["درسًا مكتملًا", "lessons finished"], medals: ["وسامًا", "medals"], reviews: ["مراجعة", "reviews"], mocks: ["اختبارًا تجريبيًا", "mock exams"],
    next: ["الهدف القادم", "Next goal"], more: (n) => [`أكمل ${n} دروس لتُنبت نخلة جديدة في زاوية أخرى`, `Finish ${n} more lessons for a new palm grove`],
    start: ["ابدأ أول درس لتُنبت أول نخلة", "Finish your first lesson to grow your first palm"], login: ["سجّل الدخول لترى واحتك.", "Sign in to see your oasis."],
    err: ["تعذّر تحميل تقدّمك.", "Could not load your progress."], loading: ["جارٍ التحميل…", "Loading…"], staff: ["الواحة للطلاب؛ سجّل بحساب طالب لتراها.", "The oasis is for students; sign in as a student to see it."]
  };
  let C, en;
  const t = (k, a) => { const v = TX[k]; const x = typeof v === "function" ? v(a) : v; return x[en ? 1 : 0]; };
  const ar = (n) => String(n);   // أرقام غربية (0–9) في حراء كلها

  function rnd(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

  function palm(x, y, s, r) {
    const lean = (r() - 0.5) * 18, h = 70 * s, tx = x + lean * s, ty = y - h;
    let f = "";
    for (let i = 0; i < 7; i++) {
      const a = -160 + i * 50 + (r() - 0.5) * 12;
      f += `<ellipse cx="${tx}" cy="${ty}" rx="${26 * s}" ry="${6 * s}" transform="rotate(${a} ${tx} ${ty}) translate(${24 * s} 0)" fill="${i % 2 ? "#3F8F4F" : "#2E7A3F"}"/>`;
    }
    return `<path d="M${x} ${y} Q ${x + lean * 0.2 * s} ${y - h * 0.5} ${tx} ${ty}" stroke="#7A5233" stroke-width="${5 * s}" fill="none" stroke-linecap="round"/>${f}<circle cx="${tx}" cy="${ty}" r="${3 * s}" fill="#8B5E34"/>`;
  }
  function sprout(x, y, s) { return `<path d="M${x} ${y} v${-10 * s}" stroke="#6AAE5C" stroke-width="2.5" stroke-linecap="round"/><ellipse cx="${x - 5 * s}" cy="${y - 11 * s}" rx="${6 * s}" ry="${3 * s}" fill="#6AAE5C" transform="rotate(-30 ${x - 5 * s} ${y - 11 * s})"/><ellipse cx="${x + 5 * s}" cy="${y - 11 * s}" rx="${6 * s}" ry="${3 * s}" fill="#7DC06C" transform="rotate(30 ${x + 5 * s} ${y - 11 * s})"/>`; }

  function scene(st) {
    const r = rnd(7), W = 720, H = 420, nP = Math.min(st.lessons, 24), nStar = Math.min(st.medals, 40);
    const wr = 46 + Math.min(st.reviews, 300) / 300 * 64;
    let stars = ""; for (let i = 0; i < nStar; i++) stars += `<circle cx="${20 + r() * (W - 40)}" cy="${12 + r() * 120}" r="${1 + r() * 2}" fill="#FFF3C4" opacity="${0.6 + r() * 0.4}"/>`;
    let items = [];
    for (let i = 0; i < 24; i++) {
      const ang = (((i * 7) % 24) / 24) * Math.PI * 2 + r() * 0.3, rx = wr + 44 + (i % 3) * 38 + r() * 20, ry = (wr * 0.38) + 14 + (i % 3) * 16;
      items.push({ x: W / 2 + Math.cos(ang) * rx, y: 292 + Math.sin(ang) * ry, i });
    }
    items.sort((a, b) => a.y - b.y);
    const trees = items.map((p) => p.i < nP ? palm(p.x, p.y, 0.8 + (p.y - 250) / 220, r) : (p.i < nP + 4 ? sprout(p.x, p.y, 1) : "")).join("");
    return `<svg viewBox="0 0 ${W} ${H}" class="os-svg" role="img" aria-label="${t("title")}"><defs><linearGradient id="osSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16324A"/><stop offset="0.55" stop-color="#E8A96A"/><stop offset="1" stop-color="#F6D9A0"/></linearGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#osSky)"/>${stars}
      <path d="M0 250 Q 140 215 280 250 T 560 245 T 720 240 V ${H} H0Z" fill="#E2B877"/>
      <path d="M0 300 Q 180 262 360 296 T 720 286 V ${H} H0Z" fill="#EBC689"/>
      <ellipse cx="${W / 2}" cy="292" rx="${wr}" ry="${wr * 0.36}" fill="#3C95B8"/><ellipse cx="${W / 2 - wr * 0.25}" cy="${292 - wr * 0.08}" rx="${wr * 0.5}" ry="${wr * 0.12}" fill="#7CC7DD" opacity=".7"/>
      ${trees}</svg>`;
  }

  async function load() {
    const { data: u } = await C.sb.auth.getUser(); const id = u && u.user && u.user.id; if (!id) return null;
    const [j, m, p] = await Promise.all([
      C.sb.from("journey_progress").select("finished_at,medals").eq("student_id", id),
      C.sb.from("memo_progress").select("reviews").eq("user_id", id),
      C.sb.from("prep_runs").select("id").eq("student_id", id)
    ]);
    if (j.error || m.error) throw j.error || m.error;
    const J = j.data || [];
    return { lessons: J.filter((x) => x.finished_at).length, medals: J.reduce((a, x) => a + (x.medals || 0), 0), reviews: (m.data || []).reduce((a, x) => a + (x.reviews || 0), 0), mocks: (p.data || []).length };
  }

  window.HiraaOasis = async function (ctx) {
    C = ctx; en = ctx.lang() === "en";
    const out = ctx.h(`<section class="section"><div class="wrap os-wrap"><h1 class="os-h">${t("title")}</h1><p class="os-sub">${t("sub")}</p><div id="osApp"><p class="os-note">${t("loading")}</p></div></div></section>`);
    const box = document.getElementById("osApp");
    if (!ctx.state.session) { box.innerHTML = `<p class="os-note">${t("login")}</p>`; return out; }
    if (typeof ctx.isStaff === "function" ? ctx.isStaff() : ctx.isStaff) { box.innerHTML = `<p class="os-note">${t("staff")}</p>`; return out; }
    try {
      const st = await load(); if (!st) { box.innerHTML = `<p class="os-note">${t("login")}</p>`; return out; }
      const left = 5 - (st.lessons % 5);
      box.innerHTML = `${scene(st)}<div class="os-stats">
        <div><b>${ar(st.lessons)}</b><span>${t("lessons")}</span></div><div><b>${ar(st.medals)}</b><span>${t("medals")}</span></div>
        <div><b>${ar(st.reviews)}</b><span>${t("reviews")}</span></div><div><b>${ar(st.mocks)}</b><span>${t("mocks")}</span></div></div>
        <p class="os-next"><b>${t("next")}:</b> ${st.lessons ? t("more", ar(left)) : t("start")}</p>`;
    } catch (e) { box.innerHTML = `<p class="os-note">${t("err")}</p>`; }
    return out;
  };
})();
