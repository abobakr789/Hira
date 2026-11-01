/* حراء — تطبيق صفحة واحدة يقرأ محتواه من Supabase */
(function () {
  "use strict";

  const cfg = window.HIRAA_CONFIG;
  if (!window.supabase) {
    document.getElementById("main").innerHTML = '<div class="wrap loading">تعذّر الاتصال بخدمة المحتوى. تحقق من اتصالك بالإنترنت ثم حدّث الصفحة.</div>';
    return;
  }
  const sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseKey, {
    auth: { persistSession: true, autoRefreshToken: true }
  });

  const main = document.getElementById("main");
  const state = { session: null, profile: null, axes: [] };

  /* ---------- helpers ---------- */
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const h = (html) => { main.innerHTML = html; main.focus({ preventScroll: true }); window.scrollTo(0, 0); };
  const toast = (msg) => {
    const t = document.getElementById("toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2600);
  };
  const loading = () => h('<div class="wrap loading">جارٍ التحميل…</div>');
  const isSuper = () => state.profile && state.profile.role === "super_admin";
  const TRACKS = { native: "الناطقون بالعربية", non_native: "غير الناطقين" };
  const TRACK_SHORT = { native: "عربي", non_native: "Non-native" };
  const TERMS = { 1: "الفصل الأول", 2: "الفصل الثاني", 3: "الفصل الثالث" };
  const ORD = ["", "الأولى", "الثانية", "الثالثة", "الرابعة", "الخامسة", "السادسة", "السابعة", "الثامنة", "التاسعة", "العاشرة"];
  const KIND = {
    slides: "الشرائح", worksheet: "ورقة عمل", group_pack: "حزمة عمل المجموعات", video: "فيديو",
    audio: "صوت", interactive: "نشاط تفاعلي", link: "رابط", file: "ملف"
  };
  const PILLAR = { culture: "الثقافة", values: "القيم", citizenship: "المواطنة" };

  const icon = {
    slides: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M12 16v4M8 20h8"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/></svg>',
    video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9l5 3-5 3z" fill="currentColor"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
    path: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h5a3 3 0 0 0 0-6h-2a3 3 0 0 1 0-6h5"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/></svg>',
    flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12l5 5L20 6"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 11l9-7 9 7v9H3z"/><path d="M9 20v-6h6v6"/></svg>',
    school: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9l9-5 9 5-9 5z"/><path d="M7 11v5c3 2 7 2 10 0v-5"/></svg>'
  };

  const parseHash = () => {
    const raw = location.hash.replace(/^#\/?/, "");
    const [path, query] = raw.split("?");
    const parts = path.split("/").filter(Boolean);
    const params = new URLSearchParams(query || "");
    return { parts, params };
  };
  const setNav = (key) => document.querySelectorAll("[data-nav]").forEach((a) => a.classList.toggle("active", a.dataset.nav === key));

  const youtubeEmbed = (url) => {
    try {
      const u = new URL(url);
      let id = null;
      if (u.hostname.includes("youtu.be")) id = u.pathname.slice(1);
      else if (u.hostname.includes("youtube.com")) id = u.searchParams.get("v") || (u.pathname.startsWith("/shorts/") ? u.pathname.split("/")[2] : null);
      return id ? "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) : null;
    } catch (e) { return null; }
  };

  /* ---------- auth ---------- */
  async function loadProfile() {
    const { data } = await sb.auth.getSession();
    state.session = data.session;
    state.profile = null;
    if (state.session) {
      const { data: p } = await sb.from("profiles").select("id, role, full_name_ar, school_id, track").eq("id", state.session.user.id).maybeSingle();
      state.profile = p || null;
    }
    renderAuthSlot();
  }
  function renderAuthSlot() {
    const slot = document.getElementById("authSlot");
    document.querySelector(".admin-link").hidden = !isSuper();
    if (state.session) {
      const name = state.profile ? state.profile.full_name_ar : state.session.user.email;
      slot.innerHTML = `<span class="user-chip">${esc(name)}</span><button class="btn btn-ghost btn-small" id="logoutBtn">خروج</button>`;
      document.getElementById("logoutBtn").onclick = async () => { await sb.auth.signOut(); await loadProfile(); location.hash = "#/"; toast("تم تسجيل الخروج"); };
    } else {
      slot.innerHTML = '<a class="btn btn-ghost" href="#/login">تسجيل الدخول</a>';
    }
  }

  /* ---------- shared blocks ---------- */
  function stageGroups() {
    return [
      { title: "الحلقة الأولى", sub: "Year 1 – Year 4", years: [1, 2, 3, 4] },
      { title: "الحلقة الثانية", sub: "Year 5 – Year 8", years: [5, 6, 7, 8] },
      { title: "الحلقة الثالثة", sub: "Year 9 – Year 13", years: [9, 10, 11, 12, 13] }
    ];
  }
  async function readyYears() {
    const { data } = await sb.from("units").select("year_group, track").eq("subject_id", 1);
    const map = {};
    (data || []).forEach((u) => { (map[u.year_group] = map[u.year_group] || new Set()).add(u.track); });
    return map;
  }
  function gradeLadder(ready) {
    return stageGroups().map((s) => `
      <div class="stage">
        <div class="stage-title"><h3>${s.title}</h3><span dir="ltr">${s.sub}</span></div>
        <div class="grade-row">
          ${s.years.map((y) => {
            const tr = ready[y];
            const ok = !!tr;
            const g = y <= 12 ? `الصف ${y}` : "الصف 12";
            const status = ok ? "المحتوى متاح" : "قيد الإعداد";
            return `<a class="grade-tile ${ok ? "ready" : "soon"}" href="#/year/${y}">
              <span class="y" dir="ltr">Year ${y}</span>
              <span class="g">كتاب ${g}</span>
              <span class="status">${status}</span></a>`;
          }).join("")}
        </div>
      </div>`).join("");
  }

  /* ---------- pages ---------- */
  async function pageHome() {
    setNav("");
    h(`
    <section class="hero">
      <div class="wrap hero-grid">
        <div class="hero-copy">
          <p class="hero-word" aria-hidden="true">اقرأ</p>
          <h1>منهج التربية الإسلامية كاملًا، درسًا درسًا، من Year 1 إلى Year 13</h1>
          <p>شرائح وأوراق عمل وأدلة من القرآن والسنة لكل درس، واختبار تشخيصي في كل فصل يُظهر ما أتقنه كل طالب وأين يحتاج إلى علاج.</p>
          <div class="hero-actions">
            <a class="btn btn-dawn" href="#/grades">تصفّح الصفوف</a>
            <a class="btn btn-ghost" href="#/about">كيف تعمل حراء</a>
          </div>
        </div>
        <div class="hero-art" aria-hidden="true">
          <svg viewBox="0 0 600 460" role="presentation">
            <defs>
              <radialGradient id="cg" cx="50%" cy="80%" r="60%">
                <stop offset="0" stop-color="#FFE3A3"/><stop offset=".45" stop-color="#E2A93B"/><stop offset="1" stop-color="#E2A93B" stop-opacity="0"/>
              </radialGradient>
              <linearGradient id="beam" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0" stop-color="#E2A93B" stop-opacity=".7"/><stop offset="1" stop-color="#E2A93B" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <g fill="#F3F1EA" opacity=".55">
              <circle cx="80" cy="60" r="1.6"/><circle cx="170" cy="120" r="1.2"/><circle cx="260" cy="40" r="1.8"/>
              <circle cx="470" cy="70" r="1.4"/><circle cx="540" cy="150" r="1.1"/><circle cx="380" cy="30" r="1.2"/>
            </g>
            <polygon class="light-beam" points="300,270 230,0 370,0" fill="url(#beam)"/>
            <path d="M0 460 L120 300 L190 330 L300 150 L360 230 L410 190 L600 460 Z" fill="#1E3550"/>
            <path d="M0 460 L150 360 L240 390 L330 250 L420 320 L470 290 L600 460 Z" fill="#0E5A4E"/>
            <ellipse class="cave-glow" cx="300" cy="300" rx="80" ry="70" fill="url(#cg)"/>
            <path d="M276 330 Q276 280 300 278 Q324 280 324 330 Z" fill="#FFE3A3"/>
          </svg>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <h2>منصة واحدة لكل من يشارك في تعلّم الطالب</h2>
        </div>
        <div class="aud-tabs" role="tablist" aria-label="الفئات">
          <button class="aud-tab" role="tab" aria-selected="true" data-aud="student">الطالب</button>
          <button class="aud-tab" role="tab" aria-selected="false" data-aud="teacher">المعلم</button>
          <button class="aud-tab" role="tab" aria-selected="false" data-aud="school">المدرسة</button>
          <button class="aud-tab" role="tab" aria-selected="false" data-aud="parent">ولي الأمر</button>
        </div>
        <div id="audPanel" role="tabpanel"></div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="wrap">
        <div class="section-head">
          <h2>الصفوف</h2>
          <p>لكل صف مساران: للناطقين بالعربية، ولغير الناطقين بها.</p>
        </div>
        <div id="ladder" class="loading">جارٍ التحميل…</div>
      </div>
    </section>`);

    const AUD = {
      student: [
        ["book", "الدرس كاملًا في مكان واحد", "الشرائح وورقة العمل والفيديو والأدلة، مرتبة كما في كتابك."],
        ["chart", "تعرف ما أتقنته", "بعد الاختبار التشخيصي ترى خريطة لكل نواتج التعلم: ما أتقنته، وما تقترب منه، وما تحتاج إلى مراجعته."],
        ["path", "مراجعة على قدر حاجتك", "تقودك المنصة إلى دروس النواتج التي لم تتقنها فقط، فلا تعيد ما تعرفه."]
      ],
      teacher: [
        ["users", "خريطة إتقان لكل فصل", "ترى النواتج التي يتعثر فيها أكثر طلابك، فتخطط درسك القادم على أساسها."],
        ["doc", "واجبات تصل إلى الطالب مباشرة", "ترسل الواجب أو الاختبار لفصل كامل، وتتابع التسليم والدرجات."],
        ["flag", "نواتج الوزارة بأرقامها", "كل درس مربوط بنواتج الإطار الوطني، وكل سؤال مربوط بناتج."]
      ],
      school: [
        ["school", "نتائج المدرسة كلها", "يرى مدير المدرسة نتائج كل الصفوف والواجبات التي يرسلها المعلمون."],
        ["chart", "تقدّم يمكن إثباته", "مقارنة نتائج الاختبار التشخيصي بنتائج آخر الفصل لكل ناتج، دليل جاهز لفرق التفتيش."],
        ["users", "مساران في منصة واحدة", "قسم الناطقين بالعربية وقسم غير الناطقين يقاسان على المعايير نفسها."]
      ],
      parent: [
        ["home", "متابعة من البيت", "يرى ولي الأمر واجبات ابنه ونتائجه أولًا بأول."],
        ["path", "يعرف أين يساعد", "ملخص واضح لما يحتاج ابنه إلى مراجعته، مع الدرس المرتبط به."],
        ["book", "القرآن والسنة بين يديه", "الآيات والأحاديث المقررة لكل درس، ليراجعها مع ابنه."]
      ]
    };
    const panel = document.getElementById("audPanel");
    const showAud = (k) => {
      panel.innerHTML = `<div class="aud-panel">${AUD[k].map(([ic, t, d]) =>
        `<div class="aud-point"><h3>${icon[ic]}${esc(t)}</h3><p>${esc(d)}</p></div>`).join("")}</div>`;
      document.querySelectorAll(".aud-tab").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.aud === k)));
    };
    document.querySelectorAll(".aud-tab").forEach((b) => b.addEventListener("click", () => showAud(b.dataset.aud)));
    showAud("student");

    const ready = await readyYears();
    const lad = document.getElementById("ladder");
    lad.classList.remove("loading");
    lad.innerHTML = gradeLadder(ready);
  }

  async function pageGrades() {
    setNav("grades");
    h(`<section class="page-head"><div class="wrap" style="padding-bottom:34px">
        <div class="crumbs"><a href="#/">الرئيسية</a></div>
        <h1>الصفوف</h1>
        <p class="muted">اختر الصف، ثم المسار: الناطقون بالعربية أو غير الناطقين.</p>
      </div></section>
      <section class="section"><div class="wrap" id="ladder"><div class="loading">جارٍ التحميل…</div></div></section>`);
    const ready = await readyYears();
    document.getElementById("ladder").innerHTML = gradeLadder(ready);
  }

  async function pageYear(year, params) {
    setNav("grades");
    const track = params.get("track") === "non_native" ? "non_native" : "native";
    const term = ["1", "2", "3"].includes(params.get("term")) ? Number(params.get("term")) : 1;
    loading();

    const [unitsRes, outRes, axesRes] = await Promise.all([
      sb.from("units")
        .select("id, term, sort_order, title_ar, title_en, lessons(id, code, sort_order, title_ar, title_en, axis_code, book_pages, lesson_resources(kind))")
        .eq("year_group", year).eq("track", track).eq("subject_id", 1).order("term").order("sort_order"),
      sb.from("learning_outcomes").select("code, statement_ar, sort_order, fw_standards(axis_code)").eq("year_group", year).order("sort_order"),
      state.axes.length ? Promise.resolve({ data: state.axes }) : sb.from("fw_axes").select("code, name_ar, domain_id, fw_domains(name_ar)")
    ]);
    if (unitsRes.error) { h(`<div class="wrap loading">تعذّر تحميل المنهج: ${esc(unitsRes.error.message)}</div>`); return; }
    state.axes = axesRes.data || [];
    const axisName = (c) => (state.axes.find((a) => a.code === c) || {}).name_ar || "";

    const units = unitsRes.data || [];
    const termUnits = units.filter((u) => u.term === term);
    const counts = { 1: 0, 2: 0, 3: 0 };
    units.forEach((u) => { counts[u.term] += (u.lessons || []).length; });
    const nn = track === "non_native";
    const href = (t, tr) => `#/year/${year}?track=${tr}&term=${t}`;

    let unitNo = units.filter((u) => u.term < term).length;
    const unitsHtml = termUnits.length ? termUnits.map((u) => {
      unitNo += 1;
      const lessons = (u.lessons || []).sort((a, b) => a.sort_order - b.sort_order);
      return `<div class="unit">
        <div class="unit-head"><span class="n">${unitNo}</span><h2>${esc(nn && u.title_en ? u.title_en : u.title_ar)}</h2>
          <span class="en">${esc(nn ? u.title_ar : (u.title_en || ""))}</span></div>
        ${lessons.map((l, i) => {
          const kinds = new Set((l.lesson_resources || []).map((r) => r.kind));
          const dot = (k) => `<span class="res-dot ${kinds.has(k) ? "on" : ""}" title="${KIND[k]}"></span>`;
          return `<a class="lesson-row" href="#/lesson/${esc(l.code)}">
            <span class="idx">${i + 1}</span>
            <span><span class="t" ${nn ? 'dir="ltr" style="text-align:right"' : ""}>${esc(nn && l.title_en ? l.title_en : l.title_ar)}</span>
              ${nn ? `<span class="muted" style="font-size:.85rem">${esc(l.title_ar)}</span>` : ""}</span>
            <span class="meta"><span class="pill axis">${esc(axisName(l.axis_code))}</span>
              <span class="res-dots" aria-label="المواد المتاحة">${dot("slides")}${dot("worksheet")}${dot("video")}</span></span>
          </a>`;
        }).join("")}
      </div>`;
    }).join("") : `<div class="empty"><strong>لم يُضف منهج ${TERMS[term]} لهذا المسار بعد</strong>سيظهر هنا فور إدخاله.</div>`;

    const outcomes = outRes.data || [];
    const byAxis = {};
    outcomes.forEach((o) => { const a = o.fw_standards ? o.fw_standards.axis_code : "-"; (byAxis[a] = byAxis[a] || []).push(o); });
    const outcomesHtml = outcomes.length ? Object.keys(byAxis).map((a) => `
      <div class="outcome-group"><h4>${esc(axisName(a))}</h4>
      ${byAxis[a].map((o) => `<p class="outcome">${esc(o.statement_ar)} <code>${esc(o.code)}</code></p>`).join("")}</div>`).join("")
      : '<p class="muted">لم تُدخل نواتج هذا الصف بعد.</p>';

    h(`
    <section class="page-head"><div class="wrap">
      <div class="crumbs"><a href="#/">الرئيسية</a> / <a href="#/grades">الصفوف</a></div>
      <h1><span dir="ltr">Year ${year}</span> · التربية الإسلامية</h1>
      <p class="muted">كتاب الصف ${year <= 12 ? year : 12} · ${outcomes.length} ناتج تعلم من الإطار الوطني</p>
      <div class="controls">
        <div class="seg" role="group" aria-label="المسار">
          <a href="${href(term, "native")}" aria-current="${!nn}">${TRACKS.native}</a>
          <a href="${href(term, "non_native")}" aria-current="${nn}">${TRACKS.non_native}</a>
        </div>
        <div class="term-tabs" role="tablist">
          ${[1, 2, 3].map((t) => `<a class="term-tab" role="tab" href="${href(t, track)}" aria-selected="${t === term}" style="text-decoration:none">${TERMS[t]} <span class="muted">(${counts[t]})</span></a>`).join("")}
        </div>
      </div>
    </div></section>
    <section class="section" style="padding-top:44px"><div class="wrap layout-2">
      <div>${unitsHtml}</div>
      <aside class="side-card"><h3>نواتج التعلم للصف</h3>${outcomesHtml}</aside>
    </div></section>`);
  }

  async function pageLesson(code) {
    setNav("grades");
    loading();
    const { data: l, error } = await sb.from("lessons")
      .select(`id, code, title_ar, title_en, axis_code, book_pages, overview_ar,
        units(term, title_ar, title_en, year_group, track),
        lesson_resources(id, kind, part, title_ar, url, sort_order),
        evidences(kind, text_ar, translation_en, surah_no, ayah_from, ayah_to, source, hadith_grade, is_verified, sort_order),
        lesson_identity_links(connection_ar, connection_en, identity_tags(name_ar, pillar)),
        lesson_outcomes(learning_outcomes(code, statement_ar, sort_order)),
        success_criteria(part, statement_ar, statement_en, sort_order)`)
      .eq("code", code).maybeSingle();
    if (error || !l) { h(`<div class="wrap loading">لم يُعثر على هذا الدرس.</div>`); return; }
    if (!state.axes.length) { const r = await sb.from("fw_axes").select("code, name_ar, domain_id"); state.axes = r.data || []; }
    const axisName = (state.axes.find((a) => a.code === l.axis_code) || {}).name_ar || "";
    const u = l.units || {};
    const nn = u.track === "non_native";
    const res = (l.lesson_resources || []).sort((a, b) => (a.part || 0) - (b.part || 0) || a.sort_order - b.sort_order);

    const resList = (kinds, emptyMsg) => {
      const items = res.filter((r) => kinds.includes(r.kind));
      if (!items.length) return `<div class="empty"><strong>${emptyMsg}</strong>${state.session ? "" : "بعض المواد تظهر بعد تسجيل الدخول."}</div>`;
      return `<div class="res-list">${items.map((r) => {
        const ic = r.kind === "slides" ? icon.slides : r.kind === "video" ? icon.video : r.kind === "link" ? icon.link : icon.doc;
        return `<a class="res-item" href="${esc(r.url)}" target="_blank" rel="noopener">${ic}
          <span><strong>${esc(r.title_ar)}</strong><span class="kind">${KIND[r.kind]}${r.part ? ` · الجزء ${r.part}` : ""}</span></span></a>`;
      }).join("")}</div>`;
    };
    const videos = res.filter((r) => r.kind === "video");
    const videoHtml = videos.length ? videos.map((v) => {
      const e = youtubeEmbed(v.url);
      return `<h3>${esc(v.title_ar)}</h3>` + (e
        ? `<iframe class="video-frame" src="${e}" title="${esc(v.title_ar)}" allowfullscreen loading="lazy"></iframe>`
        : `<a class="res-item" href="${esc(v.url)}" target="_blank" rel="noopener">${icon.video}<strong>شاهد الفيديو</strong></a>`);
    }).join('<div style="height:24px"></div>') : `<div class="empty"><strong>لم يُضف فيديو لهذا الدرس بعد</strong></div>`;

    const ev = (l.evidences || []).sort((a, b) => a.sort_order - b.sort_order);
    const evHtml = ev.length ? ev.map((e) => e.kind === "quran"
      ? `<div class="evidence"><p class="quran-ref">${esc(e.text_ar)}</p>
          <div class="src"><span>الآيات ${e.ayah_from}–${e.ayah_to}</span>${e.is_verified ? '<span class="pill axis">موثّق</span>' : ""}
          <a href="https://quran.com/${e.surah_no}" target="_blank" rel="noopener">اقرأ السورة واستمع إليها</a></div></div>`
      : `<div class="evidence"><p class="txt">${esc(e.text_ar)}</p>
          ${e.translation_en ? `<p dir="ltr" class="muted">${esc(e.translation_en)}</p>` : ""}
          <div class="src"><span>${esc(e.source || "")}</span>${e.hadith_grade ? `<span>· ${esc(e.hadith_grade)}</span>` : ""}
          ${e.is_verified ? '<span class="pill axis">موثّق</span>' : '<span class="pill warn">قيد التوثيق</span>'}</div></div>`).join("")
      : `<div class="empty"><strong>لم تُضف أدلة لهذا الدرس بعد</strong></div>`;

    const idHtml = (l.lesson_identity_links || []).length ? l.lesson_identity_links.map((x) => `
      <div class="identity-card"><span class="pillar">${esc(PILLAR[x.identity_tags.pillar] || "")} · ${esc(x.identity_tags.name_ar)}</span>
        <p>${esc(x.connection_ar)}</p>${nn && x.connection_en ? `<p class="en">${esc(x.connection_en)}</p>` : ""}</div>`).join("")
      : `<div class="empty"><strong>لم يُضف ربط بالهوية الوطنية لهذا الدرس بعد</strong></div>`;

    const outs = (l.lesson_outcomes || []).map((x) => x.learning_outcomes).filter(Boolean).sort((a, b) => a.sort_order - b.sort_order);
    const sc = (l.success_criteria || []).sort((a, b) => (a.part || 0) - (b.part || 0) || a.sort_order - b.sort_order);
    const outHtml = `
      <h3>نواتج التعلم من الإطار الوطني</h3>
      ${outs.length ? outs.map((o) => `<p class="outcome">${esc(o.statement_ar)} <code>${esc(o.code)}</code></p>`).join("") : '<p class="muted">لا توجد نواتج مرتبطة.</p>'}
      <h3 style="margin-top:28px">معايير النجاح</h3>
      ${sc.length ? `<ol>${sc.map((s) => `<li>${esc(s.statement_ar)}${s.statement_en ? `<br><span dir="ltr" class="muted">${esc(s.statement_en)}</span>` : ""}</li>`).join("")}</ol>`
        : '<div class="empty"><strong>لم تُكتب معايير النجاح بعد</strong>تُضاف مع شرائح الدرس.</div>'}`;

    const quizHtml = state.session
      ? `<div class="empty"><strong>لا يوجد اختبار منشور لهذا الدرس بعد</strong>سيظهر هنا عند إضافته.</div>`
      : `<div class="empty"><strong>الاختبارات للطلاب المسجلين</strong><a class="btn btn-primary" style="margin-top:12px" href="#/login">تسجيل الدخول</a></div>`;

    const TABS = [
      ["slides", "الشرائح", resList(["slides"], "لم تُضف شرائح هذا الدرس بعد")],
      ["work", "أوراق العمل", resList(["worksheet", "group_pack", "file", "interactive", "link"], "لم تُضف أوراق عمل لهذا الدرس بعد")],
      ["video", "الفيديو", videoHtml],
      ["evidence", "الأدلة من القرآن والسنة", evHtml],
      ["identity", "الهوية الوطنية", idHtml],
      ["outcomes", "نواتج التعلم", outHtml],
      ["quiz", "الاختبار", quizHtml]
    ];

    h(`
    <section class="page-head"><div class="wrap">
      <div class="crumbs"><a href="#/">الرئيسية</a> / <a href="#/year/${u.year_group}?track=${u.track}&term=${u.term}"><span dir="ltr">Year ${u.year_group}</span> · ${TRACKS[u.track]}</a> / ${TERMS[u.term]}</div>
      ${nn && l.title_en ? `<h1 dir="ltr" style="text-align:right">${esc(l.title_en)}</h1><p class="muted" style="font-size:1.15rem">${esc(l.title_ar)}</p>`
        : `<h1>${esc(l.title_ar)}</h1>${l.title_en ? `<p class="muted" dir="ltr" style="text-align:right">${esc(l.title_en)}</p>` : ""}`}
      <div class="head-meta">
        <span class="pill axis">${esc(axisName)}</span>
        <span class="pill">وحدة: ${esc(nn && u.title_en ? u.title_en : u.title_ar)}</span>
        ${l.book_pages ? `<span class="pill">الكتاب: ص ${esc(l.book_pages)}</span>` : ""}
        <span class="pill">${TRACK_SHORT[u.track]}</span>
      </div>
      <div class="lesson-tabs" role="tablist" aria-label="أقسام الدرس">
        ${TABS.map(([k, t], i) => `<button class="lesson-tab" role="tab" id="tab-${k}" aria-controls="panel" aria-selected="${i === 0}" data-k="${k}">${t}</button>`).join("")}
      </div>
    </div></section>
    <section class="wrap panel" id="panel" role="tabpanel"></section>`);

    const panel = document.getElementById("panel");
    const show = (k) => {
      const tab = TABS.find((t) => t[0] === k) || TABS[0];
      panel.innerHTML = tab[2];
      panel.setAttribute("aria-labelledby", "tab-" + tab[0]);
      document.querySelectorAll(".lesson-tab").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.k === tab[0])));
    };
    document.querySelectorAll(".lesson-tab").forEach((b) => b.addEventListener("click", () => show(b.dataset.k)));
    show("slides");
  }

  function pageLogin() {
    setNav("");
    if (state.session) { location.hash = isSuper() ? "#/admin" : "#/"; return; }
    h(`<div class="wrap"><div class="form-card">
      <h1 style="font-size:1.6rem">تسجيل الدخول</h1>
      <p class="muted">للمعلمين وإدارات المدارس والمشرفين. يدخل الطلاب من رابط مدرستهم.</p>
      <form id="loginForm" novalidate>
        <div class="field"><label for="em">البريد الإلكتروني</label><input id="em" type="email" dir="ltr" autocomplete="email" required></div>
        <div class="field"><label for="pw">كلمة المرور</label><input id="pw" type="password" dir="ltr" autocomplete="current-password" required minlength="8"></div>
        <p class="form-error" id="err"></p>
        <button class="btn btn-primary" type="submit" style="width:100%" id="submitBtn">دخول</button>
      </form>
      <p style="margin-top:18px;font-size:.92rem" class="muted">أول مرة؟ <a href="#" id="toggleMode">أنشئ حسابك</a></p>
    </div></div>`);
    let mode = "in";
    const btn = document.getElementById("submitBtn"), err = document.getElementById("err");
    document.getElementById("toggleMode").onclick = (e) => {
      e.preventDefault();
      mode = mode === "in" ? "up" : "in";
      btn.textContent = mode === "in" ? "دخول" : "إنشاء الحساب";
      e.target.textContent = mode === "in" ? "أنشئ حسابك" : "لديّ حساب";
      document.getElementById("pw").autocomplete = mode === "in" ? "current-password" : "new-password";
      err.textContent = "";
    };
    document.getElementById("loginForm").onsubmit = async (e) => {
      e.preventDefault();
      const email = document.getElementById("em").value.trim(), password = document.getElementById("pw").value;
      if (!email || password.length < 8) { err.textContent = "أدخل البريد الإلكتروني وكلمة مرور من 8 أحرف على الأقل."; return; }
      btn.disabled = true; err.textContent = "";
      const r = mode === "in" ? await sb.auth.signInWithPassword({ email, password }) : await sb.auth.signUp({ email, password, options: { emailRedirectTo: location.origin + location.pathname + "#/login" } });
      btn.disabled = false;
      if (r.error) {
        err.textContent = /Invalid login/i.test(r.error.message) ? "البريد الإلكتروني أو كلمة المرور غير صحيحة." : r.error.message;
        return;
      }
      if (mode === "up" && !r.data.session) { err.textContent = ""; toast("أرسلنا رابط التفعيل إلى بريدك. افتحه ثم سجّل الدخول."); return; }
      await loadProfile();
      toast("تم تسجيل الدخول");
      location.hash = isSuper() ? "#/admin" : "#/";
    };
  }

  async function pageAdmin(params) {
    setNav("admin");
    if (!state.session) { location.hash = "#/login"; return; }
    if (!isSuper()) { h('<div class="wrap loading">لوحة التحكم متاحة للمشرف العام فقط.</div>'); return; }
    const year = Number(params.get("year") || 1);
    const track = params.get("track") === "non_native" ? "non_native" : "native";
    loading();
    const { data: units, error } = await sb.from("units")
      .select("id, term, sort_order, title_ar, is_published, lessons(id, code, sort_order, title_ar, title_en, is_published, lesson_resources(id, kind, part, title_ar, url, is_public))")
      .eq("year_group", year).eq("track", track).order("term").order("sort_order");
    if (error) { h(`<div class="wrap loading">${esc(error.message)}</div>`); return; }

    const rows = (units || []).flatMap((u) => (u.lessons || []).sort((a, b) => a.sort_order - b.sort_order).map((l) => ({ u, l })));
    h(`
    <section class="page-head"><div class="wrap" style="padding-bottom:30px">
      <div class="crumbs">لوحة التحكم</div>
      <h1>إدارة المحتوى</h1>
      <p class="muted">أضف شرائح الدروس وأوراق العمل والفيديوهات بروابطها (Google Drive أو OneDrive أو YouTube)، وتحكّم في نشر الدروس.</p>
    </div></section>
    <section class="section" style="padding-top:34px"><div class="wrap">
      <form class="admin-filters" id="filters">
        <div class="field"><label for="fy">الصف</label><select id="fy">${Array.from({ length: 13 }, (_, i) => `<option value="${i + 1}" ${i + 1 === year ? "selected" : ""}>Year ${i + 1}</option>`).join("")}</select></div>
        <div class="field"><label for="ft">المسار</label><select id="ft"><option value="native" ${track === "native" ? "selected" : ""}>${TRACKS.native}</option><option value="non_native" ${track === "non_native" ? "selected" : ""}>${TRACKS.non_native}</option></select></div>
        <button class="btn btn-ghost" type="submit">عرض</button>
      </form>
      ${rows.length ? `<div class="table-wrap"><table class="admin-table">
        <thead><tr><th>الفصل</th><th>الدرس</th><th>المواد</th><th>منشور</th><th></th></tr></thead>
        <tbody>${rows.map(({ u, l }) => `
          <tr>
            <td>${u.term}</td>
            <td><a href="#/lesson/${esc(l.code)}">${esc(l.title_ar)}</a><br><span class="code">${esc(l.code)}</span></td>
            <td>${(l.lesson_resources || []).map((r) => `<div>${KIND[r.kind]}${r.part ? " ج" + r.part : ""}: <a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.title_ar)}</a>${r.is_public ? "" : ' <span class="muted">(للمسجلين)</span>'} <button class="btn btn-ghost btn-small" data-del="${r.id}">حذف</button></div>`).join("") || '<span class="muted">لا شيء بعد</span>'}</td>
            <td><label class="check"><input type="checkbox" data-pub="${l.id}" ${l.is_published ? "checked" : ""}> منشور</label></td>
            <td><button class="btn btn-primary btn-small" data-add="${l.id}" data-title="${esc(l.title_ar)}">إضافة مادة</button></td>
          </tr>`).join("")}</tbody></table></div>`
        : '<div class="empty"><strong>لا توجد دروس لهذا الصف والمسار بعد</strong>أرسل الكتاب ليُوزَّع منهجه.</div>'}
    </div></section>
    <dialog id="resDialog">
      <form id="resForm" method="dialog">
        <h2 style="font-size:1.3rem" id="resTitle">إضافة مادة</h2>
        <div class="field"><label for="rk">النوع</label><select id="rk">
          ${Object.keys(KIND).map((k) => `<option value="${k}">${KIND[k]}</option>`).join("")}</select></div>
        <div class="field"><label for="rp">الجزء</label><select id="rp"><option value="">الدرس كله</option><option value="1">الجزء الأول</option><option value="2">الجزء الثاني</option></select></div>
        <div class="field"><label for="rt">العنوان</label><input id="rt" required></div>
        <div class="field"><label for="ru">الرابط</label><input id="ru" type="url" dir="ltr" required placeholder="https://"></div>
        <label class="check" style="margin-bottom:16px"><input type="checkbox" id="rpub"> متاحة للزوار دون تسجيل دخول</label>
        <p class="form-error" id="rerr"></p>
        <div class="dialog-actions"><button class="btn btn-primary" id="rsave" value="save">حفظ المادة</button><button class="btn btn-ghost" value="cancel" formnovalidate>إلغاء</button></div>
      </form>
    </dialog>`);

    document.getElementById("filters").onsubmit = (e) => {
      e.preventDefault();
      location.hash = `#/admin?year=${document.getElementById("fy").value}&track=${document.getElementById("ft").value}`;
    };
    main.querySelectorAll("[data-pub]").forEach((cb) => cb.addEventListener("change", async () => {
      const { error: e } = await sb.from("lessons").update({ is_published: cb.checked }).eq("id", cb.dataset.pub);
      if (e) { cb.checked = !cb.checked; toast("تعذّر الحفظ: " + e.message); } else toast(cb.checked ? "نُشر الدرس" : "أُخفي الدرس");
    }));
    main.querySelectorAll("[data-del]").forEach((b) => b.addEventListener("click", async () => {
      if (!confirm("حذف هذه المادة من الدرس؟")) return;
      const { error: e } = await sb.from("lesson_resources").delete().eq("id", b.dataset.del);
      if (e) toast("تعذّر الحذف: " + e.message); else { toast("حُذفت المادة"); pageAdmin(params); }
    }));
    const dlg = document.getElementById("resDialog");
    let current = null;
    main.querySelectorAll("[data-add]").forEach((b) => b.addEventListener("click", () => {
      current = b.dataset.add;
      document.getElementById("resTitle").textContent = "إضافة مادة: " + b.dataset.title;
      document.getElementById("resForm").reset();
      document.getElementById("rerr").textContent = "";
      dlg.showModal();
    }));
    document.getElementById("rsave").addEventListener("click", async (e) => {
      e.preventDefault();
      const title = document.getElementById("rt").value.trim(), url = document.getElementById("ru").value.trim();
      if (!title || !/^https:\/\//.test(url)) { document.getElementById("rerr").textContent = "أدخل عنوانًا ورابطًا يبدأ بـ https://"; return; }
      const part = document.getElementById("rp").value;
      const { error: e2 } = await sb.from("lesson_resources").insert({
        lesson_id: current, kind: document.getElementById("rk").value, part: part ? Number(part) : null,
        title_ar: title, url, is_public: document.getElementById("rpub").checked
      });
      if (e2) { document.getElementById("rerr").textContent = "تعذّر الحفظ: " + e2.message; return; }
      dlg.close(); toast("حُفظت المادة"); pageAdmin(params);
    });
  }

  function pageAbout() {
    setNav("about");
    h(`<section class="page-head"><div class="wrap" style="padding-bottom:34px">
        <div class="crumbs"><a href="#/">الرئيسية</a></div><h1>عن حراء</h1></div></section>
      <section class="section"><div class="wrap prose">
        <p>في غار حراء نزلت أول كلمة من الوحي: «اقرأ». ومن هنا جاء اسم المنصة: مكان يبدأ منه الطالب القراءة والفهم، ثم يصعد درجة بعد درجة.</p>
        <h2>كيف تعمل</h2>
        <p>كل صف مقسّم على الفصول الدراسية الثلاثة كما في كتاب وزارة التربية والتعليم، وكل درس مربوط بنواتج التعلم في الإطار الوطني لمعايير التربية الإسلامية بأرقامها.</p>
        <p>في بداية كل فصل يؤدي الطالب اختبارًا تشخيصيًا، كل سؤال فيه يقيس ناتجًا محددًا. فتظهر خريطة إتقانه: ما أتقنه، وما يقترب منه، وما يحتاج إلى علاج، مع الدرس الذي يعالجه. وفي نهاية الفصل يقاس التقدم بالمقارنة مع نتيجته الأولى.</p>
        <h2>مساران</h2>
        <p>للناطقين بالعربية مسار بكتاب الوزارة العربي، ولغير الناطقين مسار بالكتاب الإنجليزي. والمساران يقاسان على نواتج التعلم نفسها.</p>
        <h2>القرآن والسنة</h2>
        <p>الآيات والأحاديث المقررة تُعرض مع مصدرها. ولا يُوسم الحديث بأنه «موثّق» إلا بعد مراجعة لفظه وتخريجه في مصادره.</p>
      </div></section>`);
  }

  /* ---------- router ---------- */
  async function route() {
    const { parts, params } = parseHash();
    const p0 = parts[0] || "";
    try {
      if (p0 === "") return pageHome();
      if (p0 === "grades") return pageGrades();
      if (p0 === "year" && /^\d+$/.test(parts[1] || "")) {
        const y = Number(parts[1]);
        if (y >= 1 && y <= 13) return pageYear(y, params);
      }
      if (p0 === "lesson" && parts[1]) return pageLesson(decodeURIComponent(parts[1]));
      if (p0 === "login") return pageLogin();
      if (p0 === "admin") return pageAdmin(params);
      if (p0 === "about") return pageAbout();
      h('<div class="wrap loading">هذه الصفحة غير موجودة. <a href="#/">العودة إلى الرئيسية</a></div>');
    } catch (e) {
      console.error(e);
      h(`<div class="wrap loading">حدث خطأ أثناء التحميل. حدّث الصفحة وحاول مرة أخرى.</div>`);
    }
  }

  window.addEventListener("hashchange", route);
  sb.auth.onAuthStateChange((evt) => { if (evt === "SIGNED_IN" || evt === "SIGNED_OUT") loadProfile(); });
  loadProfile().finally(route);
})();
