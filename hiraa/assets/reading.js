  // ===== مدارج القراءة: كتاب القراءة للناطقين (الصفوف 4–9) =====
  // يُدمج داخل app.js عند البناء (build.py) فيشارك دواله: sb، state، esc، toast، h …
  // البيانات: art/madarij/index.json (قائمة كل صف)، map.json (رمز الدرس ← النص)، t/<id>.json (النص وأنشطته)
  let MDR_MAP = null, MDR_IDX = null; const MDR_T = {};
  async function mdrMapGet() { if (MDR_MAP) return MDR_MAP; try { MDR_MAP = await (await fetch("art/madarij/map.json")).json(); } catch (e) { MDR_MAP = {}; } return MDR_MAP; }
  async function mdrIdxGet() { if (MDR_IDX) return MDR_IDX; try { MDR_IDX = await (await fetch("art/madarij/index.json")).json(); } catch (e) { MDR_IDX = {}; } return MDR_IDX; }
  async function mdrGet(id) { if (!MDR_T[id]) MDR_T[id] = await (await fetch("art/madarij/t/" + id + ".json")).json(); return MDR_T[id]; }
  const MDR_SK = { ret: ["🎯", "التَّرْكيزُ عَلى الْمَعْلوماتِ وَاسْتِرْجاعُها"], inf: ["🔍", "الِاسْتِنْتاجُ الْمُباشِرُ"], int: ["🧩", "تَفْسيرُ الْأَفْكارِ وَدَمْجُها"], eva: ["⚖️", "تَقْويمُ النَّصِّ وَنَقْدُهُ"] };
  const MDR_GN = { 4: "الرّابِعُ", 5: "الْخامِسُ", 6: "السّادِسُ", 7: "السّابِعُ", 8: "الثّامِنُ", 9: "التّاسِعُ" };
  const mdrOn = (subject, track, year) => subject === "arabic" && track === "native" && year >= 4 && year <= 9;
  const mdrBar = (v, max) => `<span class="mdr-bar"><i style="width:${max ? Math.round(v * 100 / max) : 0}%"></i></span>`;

  // ---------- قائمة نصوص الصف (تظهر في صفحة الصف عند اختيار «مدارج القراءة») ----------
  async function mdrListHtml(year, term, units, opts) {
    const idx = (await mdrIdxGet())[String(year)] || [];
    const lessonByCode = {}; units.forEach((u) => (u.lessons || []).forEach((l) => { lessonByCode[l.code] = Object.assign({ term: u.term }, l); }));
    const all = idx.map((x) => Object.assign({}, x, { lesson: lessonByCode[x.code] }));
    const rows = all.filter((x) => x.term === term);
    let mine = {};
    if (isStudent() && state.session && !state.viewAs) {
      const ids = all.map((x) => x.lesson && x.lesson.id).filter(Boolean);
      if (ids.length) { const { data } = await sb.from("lesson_reading").select("lesson_id, score, max_score, quiz_at, expr_at, wpm, skills").eq("student_id", state.session.user.id).in("lesson_id", ids); (data || []).forEach((r) => { mine[r.lesson_id] = r; }); }
    }
    const done = all.filter((x) => x.lesson && mine[x.lesson.id] && mine[x.lesson.id].quiz_at);
    const sk = { ret: [0, 0], inf: [0, 0], int: [0, 0], eva: [0, 0] };
    done.forEach((x) => { const s = mine[x.lesson.id].skills || {}; Object.keys(sk).forEach((k) => { if (s[k]) { sk[k][0] += s[k][0]; sk[k][1] += s[k][1]; } }); });
    const wpms = done.map((x) => mine[x.lesson.id].wpm).filter(Boolean);
    const passport = isStudent() && state.session ? `<div class="mdr-pass"><div class="mdr-pass-h"><span>📗</span><div><b>جَوازُ الْقِراءَةِ</b><small>الصَّفُّ ${MDR_GN[year]} · ${all.length} نَصًّا مِنْ كِتابِ «مَدارِجِ الْقِراءَةِ»</small></div></div>
        <div class="mdr-pass-s"><div><b><bdi dir="ltr">${done.length}/${all.length}</bdi></b><small>نُصوصٌ أَنْجَزْتُها</small>${mdrBar(done.length, all.length)}</div>
          <div><b>${wpms.length ? wpms[wpms.length - 1] : "—"}</b><small>كَلِمَةً في الدَّقيقَةِ (آخِرُ قِياسٍ)</small></div>
          ${Object.keys(sk).map((k) => `<div><b>${sk[k][1] ? Math.round(sk[k][0] * 100 / sk[k][1]) + "%" : "—"}</b><small>${MDR_SK[k][0]} ${MDR_SK[k][1]}</small>${mdrBar(sk[k][0], sk[k][1])}</div>`).join("")}</div></div>` : "";
    const intro = `<div class="mdr-intro"><h2>📗 مَدارِجُ الْقِراءَةِ · ${["", "الْفَصْلُ الْأَوَّلُ", "الْفَصْلُ الثّاني", "الْفَصْلُ الثّالِثُ"][term]}</h2>
      <p>نُصوصٌ مِنْ كِتابِ «مَدارِجِ الْقِراءَةِ» لِوِزارَةِ التَّرْبِيَةِ وَالتَّعْليمِ. في كُلِّ نَصٍّ: أُسْلوبٌ قِرائِيٌّ، وَقِياسُ الطَّلاقَةِ وَالْقِراءَةُ الْجَهْرِيَّةُ، وَأَنْشِطَةٌ لِلْمُفْرَداتِ وَالتَّسَلْسُلِ، وَأَسْئِلَةُ فَهْمٍ في مُسْتَوَياتِ بيرْلِزَ الْأَرْبَعَةِ، وَتَعْبيرٌ كِتابِيٌّ وَشَفَهِيٌّ.</p>
      <div class="mdr-legend">${Object.keys(MDR_SK).map((k) => `<span>${MDR_SK[k][0]} ${MDR_SK[k][1]}</span>`).join("")}</div></div>`;
    const list = rows.length ? rows.map((x, i) => {
      const l = x.lesson, r = l && mine[l.id], first = all[0] && all[0].id === x.id;
      const locked = !state.session ? !first : (opts.gradeClosed || (l && opts.isLockedL(l)));
      const n = all.indexOf(x) + 1;
      return `<a class="lesson-row mdr-row ${locked ? "locked" : ""}" ${!state.session && locked ? "data-paywall" : ""} href="#/reading/${x.id}">
        <span class="idx">${n}</span>
        <span><span class="t">${esc(x.t)}</span><span class="muted mdr-sub">${x.kind === "i" ? "📘 نَصٌّ مَعْلوماتِيٌّ" : "📕 نَصٌّ سَرْدِيٌّ"} · ${x.si} ${esc(x.sn)} · ${x.w} كَلِمَةً${l ? ` · مَعَ دَرْسِ «${esc(String(l.title_ar || "").replace(/^[^:]*:\s*/, ""))}»` : ""}</span></span>
        <span class="meta">${r && r.quiz_at ? `<span class="pill mdr-done">✅ <bdi dir="ltr">${r.score}/${r.max_score}</bdi></span>` : ""}${locked ? `<span class="pill lock-pill">${lockIcon} ${!state.session ? CT("للمشتركين", "Subscribers") : "مقفل"}</span>` : first && !state.session ? `<span class="pill free-pill">${CT("مجاني", "Free")}</span>` : `<span class="pill mdr-go">اقْرَأْ ←</span>`}</span></a>`;
    }).join("") : `<div class="empty"><strong>لا توجد نصوص لهذا الفصل</strong></div>`;
    return `<div class="mdr-list">${intro}${passport}<div class="unit">${list}</div></div>`;
  }

  // ---------- صفحة النص ----------
  async function pageReading(id) {
    loading();
    const map = await mdrMapGet(); const code = Object.keys(map).find((c) => map[c] === id);
    if (!code) { h(`<div class="wrap"><div class="form-card empty"><strong>النص غير موجود</strong></div></div>`); return; }
    const { data: l } = await sb.from("lessons").select("id, code, title_ar, title_en, units(id, year_group, track, subject_id, term)").eq("code", code).maybeSingle();
    if (!l) { h(`<div class="wrap"><div class="form-card empty"><strong>تعذّر تحميل النص</strong></div></div>`); return; }
    const u = l.units || {}; const year = u.year_group;
    state.pageSubject = "arabic"; setTheme();
    const idx = (await mdrIdxGet())[String(year)] || []; const pos = idx.findIndex((x) => x.id === id), it = idx[pos] || {};
    const free = pos === 0;
    const acc = isStaff() ? "ok" : state.session ? ((await sb.rpc("lesson_access", { p_lesson: l.id })).data || "no_access") : (free ? "ok" : "no_access");
    const listHref = `#/year/${year}?subject=arabic&track=native&term=${u.term}&mdr=1`;
    const nav = (x, lbl) => x ? `<a class="btn btn-ghost btn-small" href="#/reading/${x.id}">${lbl} «${esc(x.t)}»</a>` : "";
    h(`<section class="page-head"><div class="wrap">
      <div class="crumbs"><a href="#/">الرئيسية</a> / <a href="#/grades?subject=arabic">اللغة العربية</a> / <a href="#/year/${year}?subject=arabic&track=native&term=${u.term}"><span dir="ltr">Grade ${year}</span> · الناطقون</a> / <a href="${listHref}">📗 مدارج القراءة</a></div>
      <h1>«${esc(it.t || "")}»</h1>
      <div class="head-meta"><span class="pill">📗 مدارج القراءة · النص ${pos + 1} من ${idx.length}</span><span class="pill">${it.kind === "i" ? "نص معلوماتي" : "نص سردي"}</span><span class="pill">${it.si || ""} ${esc(it.sn || "")}</span><span class="pill">${it.w || ""} كلمة</span>
        <a class="pill" href="#/lesson/${esc(l.code)}">🔗 درس الأسبوع: ${esc(String(l.title_ar || "").replace(/^[^:]*:\s*/, ""))}</a></div>
    </div></section>
    <section class="wrap panel" id="panel"><div id="rdgBox"></div>
      <div class="mdr-pn">${nav(idx[pos - 1], "→")}${nav(idx[pos + 1], "←")}</div></section>`);
    const box = document.getElementById("rdgBox");
    if (acc !== "ok") { box.innerHTML = `<div class="paywall-box form-card"><strong>${lockIcon} ${state.session ? "هذا النص مقفل الآن" : "اشترك أولًا"}</strong><p>${state.session ? "يفتحه معلمك مع درسه، أو عند تفعيل اشتراك الصف." : "النص الأول من كل صف مجاني للتجربة، وبقية النصوص للمشتركين."}</p><a class="btn btn-primary" href="${listHref}">العودة إلى قائمة النصوص</a></div>`; return; }
    mdrRun(box, l, u, id);
  }

  // ---------- مشغّل النص: ست خطوات ----------
  async function mdrRun(box, l, u, id) {
    box.innerHTML = `<div class="loading">جارٍ التحميل…</div>`;
    let X; try { X = await mdrGet(id); } catch (e) { box.innerHTML = `<div class="empty"><strong>تعذّر تحميل النص</strong></div>`; return; }
    thmFonts();
    const stu = isStudent() && state.session && !state.viewAs, me = stu ? state.session.user.id : null;
    let mine = null;
    if (stu) mine = (await sb.from("lesson_reading").select("*").eq("lesson_id", l.id).eq("student_id", me).maybeSingle()).data || null;
    const t0 = Date.now(); let part = 0;
    const A = {}; if (mine && mine.answers) Object.assign(A, mine.answers);
    const ACT = Object.assign({}, (mine && mine.act) || {});
    const PARTS = [["🧭", "قَبْلَ الْقِراءَةِ"], ["📖", "أَقْرَأُ"], ["🧩", "أَتَدَرَّبُ"], ["❓", "أَفْهَمُ"], ["✍️", "أُعَبِّرُ"], ["🏅", "إِنْجازي"]];
    const M = X.qs.map((q, j) => [q, j]).filter(([q]) => q.k === "m");
    const secs = () => Math.round((Date.now() - t0) / 1000);
    const save = (o) => stu ? sb.rpc("reading_save", Object.assign({ p_lesson: l.id, p_text: X.id, p_seconds: secs() }, o)) : Promise.resolve({});
    const ta = (tid, ph, val, rows) => `<textarea class="mdr-ta" id="${tid}" rows="${rows || 3}" placeholder="${esc(ph)}">${esc(val || "")}</textarea>`;
    const paras = (sm) => X.text.map((p) => `<p>${esc(p)}</p>`).join("");
    const textHtml = (sm) => `<div class="mdr-text${sm ? " sm" : ""}">${X.img ? `<img class="mdr-img" src="${X.img}" alt="" loading="lazy">` : ""}${paras()}${X.img2 ? `<img class="mdr-img2" src="${X.img2}" alt="" loading="lazy">` : ""}<div class="muted mdr-ref">كتاب «مدارج القراءة»، وزارة التربية والتعليم · ص ${X.p}</div></div>`;
    const S = X.strat;
    const head = () => `<div class="mdr-steps">${PARTS.map((p, k) => `<button class="mdr-sp ${k === part ? "on" : ""} ${k < part ? "ok" : ""}" data-p="${k}"><span>${p[0]}</span>${p[1]}</button>`).join("")}</div>`;
    const nav = (prev, next) => `<div class="mdr-nav">${prev != null ? `<button class="btn btn-ghost" data-p="${prev}">→ ${PARTS[prev][1]}</button>` : "<span></span>"}${next != null ? `<button class="btn btn-primary" data-p="${next}">${PARTS[next][1]} ←</button>` : ""}</div>`;
    const skillScore = () => { const s = { ret: [0, 0], inf: [0, 0], int: [0, 0], eva: [0, 0] }; M.forEach(([q, j]) => { const k = q.pk || "ret"; s[k][1]++; if (A["m" + j] === q.c) s[k][0]++; }); return s; };
    // نشاط 1: ملء الفراغات من نص الكتاب
    const clozeHtml = () => { const cz = X.cloze; if (!cz) return ""; const toks = X.text[cz.p].split(" ");
      const core = (w) => w.replace(/[،؛:.!؟?»«"()\-…]+$/g, ""), tail = (w) => w.slice(core(w).length);
      const bank = cz.w.map((k) => core(toks[k])).map((w, i) => [w, i]).sort(() => Math.random() - 0.5);
      return `<div class="mdr-card"><h3>🔤 نَشاطُ الْمُفْرَداتِ: أُكْمِلُ الْفَراغاتِ</h3><p class="muted">اُنْقُرِ الْفَراغَ، ثُمَّ اخْتَرِ الْكَلِمَةَ الْمُناسِبَةَ مِنَ الْبَنْكِ.</p>
        <div class="mdr-bank">${bank.map(([w, i]) => `<button class="mdr-chip" data-cw="${i}">${esc(w)}</button>`).join("")}</div>
        <p class="mdr-cz">${toks.map((w, k) => { const i = cz.w.indexOf(k); return i < 0 ? esc(w) : `<button class="mdr-gap" data-gi="${i}">……</button>${esc(tail(w))}`; }).join(" ")}</p>
        <div class="mdr-fb" id="czFb"></div><button class="btn btn-ghost btn-small" id="czChk">تَحَقَّقْ</button></div>`; };
    // نشاط 2: ترتيب أحداث القصة
    const seqHtml = () => !X.seq ? "" : `<div class="mdr-card"><h3>🧵 نَشاطُ التَّسَلْسُلِ: أُرَتِّبُ أَحْداثَ الْقِصَّةِ</h3><p class="muted">اُنْقُرْ بِداياتِ الْفِقْراتِ بِتَرْتيبِ وُرودِها في الْقِصَّةِ.</p>
        <div class="mdr-ord" id="sqW">${X.seq.map((s, k) => [s, k]).sort(() => Math.random() - 0.5).map(([s, k]) => `<button class="mdr-tok" data-k="${k}">${esc(s)}</button>`).join("")}</div><ol class="mdr-ordo" id="sqO"></ol><div class="mdr-fb" id="sqFb"></div></div>`;
    // نشاط 3: مطابقة الكلمة بمعناها
    const glHtml = () => !(X.gl || []).length ? "" : `<div class="mdr-card"><h3>🔗 أُطابِقُ الْكَلِمَةَ بِمَعْناها</h3><div class="mdr-match">${X.gl.map((g, i) => `<div><b>${esc(g[0])}</b><select data-gl="${i}"><option value="">—</option>${X.gl.map((x, k) => [x, k]).sort(() => Math.random() - 0.5).map(([x, k]) => `<option value="${k}">${esc(x[1])}</option>`).join("")}</select></div>`).join("")}</div><button class="btn btn-ghost btn-small" id="glChk">تَحَقَّقْ</button><div class="mdr-fb" id="glFb"></div></div>`;
    const draw = () => {
      let body = "";
      if (part === 0) body = `<div class="mdr-card mdr-strat"><h3>${S.ic} أُسْلوبُ الْقِراءَةِ: ${esc(S.n)}</h3>
          <div class="mdr-3"><div><b>قَبْلَ الْقِراءَةِ</b><ul>${S.b.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div><div><b>أَثْناءَ الْقِراءَةِ</b><ul>${S.d.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div><div><b>بَعْدَ الْقِراءَةِ</b><ul>${S.a.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div></div>
          <label class="mdr-lbl">✏️ ${esc(S.p)}</label>${ta("mdrPre", "اكْتُبْ هُنا قَبْلَ أَنْ تَقْرَأَ…", mine && mine.pre)}</div>
          ${X.img ? `<div class="mdr-peek"><img src="${X.img}" alt=""><p>تَأَمَّلِ الصّورَةَ وَالْعُنْوانَ: «${esc(X.t)}».</p></div>` : ""}` + nav(null, 1);
      if (part === 1) body = `<div class="mdr-card mdr-tip">${S.ic} <b>تَذَكَّرْ وَأَنْتَ تَقْرَأُ:</b> ${S.d.map(esc).join(" ")}</div>
          <div class="mdr-card mdr-flu"><h3>⏱️ أَقيسُ طَلاقَتي</h3><p class="muted">اضْغَطْ «أَبْدَأُ» وَاقْرَأِ النَّصَّ كُلَّهُ بِصَوْتٍ مَسْموعٍ وَبِفَهْمٍ، ثُمَّ اضْغَطْ «انْتَهَيْتُ». النَّصُّ ${X.w} كَلِمَةً.</p>
            <div class="mdr-rec"><button class="btn btn-dawn" id="fluB">▶️ أَبْدَأُ الْقِراءَةَ</button><span id="fluT" class="mdr-big">0:00</span><span id="fluR"></span></div></div>
          ${textHtml()}
          ${(X.gl || []).length ? `<div class="mdr-card"><h3>🔤 مَعاني الْكَلِماتِ</h3><div class="mdr-gl">${X.gl.map((g) => `<div><b>${esc(g[0])}</b><span>${esc(g[1])}</span></div>`).join("")}</div></div>` : ""}
          <div class="mdr-card mdr-loud"><h3>🎙️ أُسَجِّلُ قِراءَتي الْجَهْرِيَّةَ</h3><p class="muted">اقْرَأْ فِقْرَةً أَوْ فِقْرَتَيْنِ بِصَوْتٍ واضِحٍ، مُراعِيًا الْوَقْفَ عِنْدَ عَلاماتِ التَّرْقيمِ، وَتَلْوينَ صَوْتِكَ مَعَ الْأَسْئِلَةِ وَالتَّعَجُّبِ.</p>
          <div class="mdr-rubric"><span>🗣️ النُّطْقُ السَّليمُ</span><span>⏸️ الْوَقْفُ عِنْدَ عَلاماتِ التَّرْقيمِ</span><span>🎭 تَلْوينُ الصَّوْتِ</span><span>🚀 السُّرْعَةُ الْمُناسِبَةُ</span></div>
          ${stu ? `<div class="mdr-rec"><button class="btn btn-dawn" id="mdrRec">⏺ اِبْدَأِ التَّسْجيلَ</button><span id="mdrRecT" class="muted">0:00</span><audio id="mdrRecA" controls hidden></audio><button class="btn btn-primary btn-small" id="mdrRecS" hidden>📤 أُرْسِلُها لِمُعَلِّمي</button></div>` : `<p class="muted">${isStaff() ? "يُسَجِّلُ الطّالِبُ قِراءَتَهُ هُنا، وَتَصِلُكَ في صَفْحَةِ «التَّسْميعِ» لِتَقْييمِها." : "سَجِّلِ الدُّخولَ بِحِسابِ الطّالِبِ لِتُسَجِّلَ قِراءَتَكَ وَتُرْسِلَها لِمُعَلِّمِكَ."}</p>`}</div>` + nav(0, 2);
      if (part === 2) body = (clozeHtml() + seqHtml() + glHtml() || `<div class="mdr-card muted">لا أَنْشِطَةَ إِضافِيَّةً لِهذا النَّصِّ؛ انْتَقِلْ إِلى الْأَسْئِلَةِ.</div>`) + nav(1, 3);
      if (part === 3) body = `<details class="mdr-card"><summary>📖 اعْرِضِ النَّصَّ</summary>${textHtml(1)}</details>
          <p class="muted">لِكُلِّ سُؤالٍ مُسْتَواهُ مِنْ مُسْتَوَياتِ الْفَهْمِ الْأَرْبَعَةِ (بيرْلِز). أَجِبْ عَنْ أَسْئِلَةِ الِاخْتِيارِ، ثُمَّ اكْتُبْ إِجاباتِكَ لِلْمَفْتوحَةِ وَقارِنْها بِالْإِجابَةِ النَّموذَجِيَّةِ.</p>
          ${X.qs.map((q, j) => `<div class="mdr-q" id="mq${j}"><div class="mdr-qt"><span>${j + 1}</span><div>${esc(q.q)}<small class="mdr-pk pk-${q.pk || "ret"}">${MDR_SK[q.pk || "ret"][0]} ${MDR_SK[q.pk || "ret"][1]}</small></div></div>${
            q.k === "m" ? `<div class="mdr-opts">${q.o.map((o, k) => `<button class="mdr-opt" data-q="${j}" data-o="${k}">${esc(o)}</button>`).join("")}</div><div class="mdr-fb" id="mf${j}"></div>`
            : q.k === "o" ? `${ta("mo" + j, "إِجابَتي…", A["o" + j], 2)}<details class="mdr-model"><summary>💡 الْإِجابَةُ النَّموذَجِيَّةُ</summary><p>${esc(q.a)}</p></details>`
            : q.k === "r" ? `<p class="muted">اُنْقُرِ الْعِباراتِ بِالتَّرْتيبِ الصَّحيحِ.</p><div class="mdr-ord" data-q="${j}">${q.seq.map((s, k) => [s, k]).sort(() => Math.random() - 0.5).map(([s, k]) => `<button class="mdr-tok" data-k="${k}">${esc(s)}</button>`).join("")}</div><ol class="mdr-ordo" id="mro${j}"></ol><div class="mdr-fb" id="mf${j}"></div>`
            : `<div class="mdr-sort">${q.items.map((it, k) => `<div><span>${esc(it[0])}</span><select data-q="${j}" data-i="${k}"><option value="">—</option>${q.bins.map((b, bi) => `<option value="${bi}">${esc(b)}</option>`).join("")}</select></div>`).join("")}</div><button class="btn btn-ghost btn-small mdr-chk" data-q="${j}">تَحَقَّقْ</button><div class="mdr-fb" id="mf${j}"></div>`}</div>`).join("")}
          <div class="mdr-score" id="mdrScore"></div>
          ${stu ? `<div class="mdr-nav"><span></span><button class="btn btn-primary" id="mdrQS">💾 أَحْفَظُ إِجاباتي</button></div>` : ""}` + nav(2, 4);
      if (part === 4) body = `<div class="mdr-card"><h3>${S.ic} بَعْدَ الْقِراءَةِ</h3><label class="mdr-lbl">${S.a.map(esc).join(" ")}</label>${ta("mdrNote", "اكْتُبْ هُنا…", mine && mine.strat_note)}</div>
          <div class="mdr-card mdr-expr"><h3>✍️ التَّعْبيرُ الْكِتابِيُّ</h3><p class="mdr-task">${esc(X.expr.w)}</p>
            <div class="mdr-rubric"><span>💡 فِكْرَةٌ واضِحَةٌ</span><span>📎 دَليلٌ مِنَ النَّصِّ</span><span>🔗 أَدَواتُ رَبْطٍ</span><span>✒️ إِمْلاءٌ وَتَرْقيمٌ سَليمانِ</span></div>
            ${ta("mdrExpr", "اكْتُبْ نَصَّكَ هُنا بِلُغَةٍ عَرَبِيَّةٍ سَليمَةٍ…", mine && mine.expression, 8)}<p class="muted" id="mdrWc"></p></div>
          <div class="mdr-card"><h3>🗣️ التَّعْبيرُ الشَّفَهِيُّ</h3><p class="mdr-task">${esc(X.expr.o)}</p></div>
          ${stu ? `<div class="mdr-nav"><span></span><button class="btn btn-primary" id="mdrES">📤 أُرْسِلُ تَعْبيري لِمُعَلِّمي</button></div>` : ""}` + nav(3, 5);
      if (part === 5) { const s = skillScore(), n = M.filter(([q, j]) => A["m" + j] === q.c).length; const a = ACT;
        body = `<div class="mdr-card mdr-ach"><h3>🏅 إِنْجازي في «${esc(X.t)}»</h3>
          <div class="mdr-pass-s"><div><b><bdi dir="ltr">${n}/${M.length}</bdi></b><small>أَسْئِلَةُ الْفَهْمِ</small>${mdrBar(n, M.length)}</div>
            <div><b>${(mine && mine.wpm) || a.wpm || "—"}</b><small>كَلِمَةً في الدَّقيقَةِ</small></div>
            <div><b>${a.cz != null ? a.cz + "/" + (X.cloze ? X.cloze.w.length : 0) : "—"}</b><small>الْفَراغاتُ</small></div>
            <div><b>${a.sq != null ? (a.sq ? "✅" : "🔁") : "—"}</b><small>تَرْتيبُ الْأَحْداثِ</small></div>
            <div><b>${(mine && mine.expr_at) ? "✅" : "—"}</b><small>التَّعْبيرُ الْكِتابِيُّ</small></div></div>
          <h4>مُسْتَوَياتُ الْفَهْمِ</h4><div class="mdr-skills">${Object.keys(s).filter((k) => s[k][1]).map((k) => `<div><span>${MDR_SK[k][0]} ${MDR_SK[k][1]}</span>${mdrBar(s[k][0], s[k][1])}<b><bdi dir="ltr">${s[k][0]}/${s[k][1]}</bdi></b></div>`).join("")}</div>
          <p class="muted">${n === M.length && M.length ? "مُمْتازٌ! فَهْمٌ كامِلٌ لِلنَّصِّ." : "راجِعِ الْأَسْئِلَةَ الَّتي أَخْطَأْتَ فيها، وَعُدْ إِلى النَّصِّ لِتَجِدَ الدَّليلَ."}</p></div>` + nav(4, null); }
      box.innerHTML = `<div class="mdr" dir="rtl">${head()}${X.note && isStaff() ? `<div class="mdr-card mdr-note"><b>🧑‍🏫 مُلاحَظَةٌ لِلْمُعَلِّمِ:</b> ${esc(X.note)}</div>` : ""}<div class="mdr-body">${body}</div>${isStaff() ? `<div id="mdrRep"></div>` : ""}</div>`;
      box.querySelectorAll("[data-p]").forEach((b) => b.onclick = () => { keep(); part = +b.dataset.p; draw(); box.scrollIntoView({ behavior: "smooth", block: "start" }); });
      wire();
      if (isStaff()) report();
    };
    const keep = () => {
      const pre = box.querySelector("#mdrPre"); if (pre && stu && pre.value.trim() !== ((mine && mine.pre) || "")) { mine = Object.assign(mine || {}, { pre: pre.value.trim() }); save({ p_pre: pre.value.trim() }); }
      X.qs.forEach((q, j) => { const t = box.querySelector("#mo" + j); if (t) A["o" + j] = t.value; });
    };
    const putAct = (o) => { Object.assign(ACT, o); if (stu) save({ p_act: o }); };
    const mark = (j) => { const q = X.qs[j], v = A["m" + j]; if (v == null) return; const b2 = box.querySelector("#mq" + j); if (!b2) return;
      b2.querySelectorAll(".mdr-opt").forEach((b) => { const k = +b.dataset.o; b.disabled = true; b.classList.toggle("ok", k === q.c); b.classList.toggle("no", k === v && k !== q.c); });
      const f = box.querySelector("#mf" + j); f.className = "mdr-fb " + (v === q.c ? "ok" : "no"); f.innerHTML = (v === q.c ? "✅ أَحْسَنْتَ. " : "❌ الْإِجابَةُ الصَّحيحَةُ: " + esc(String(q.o[q.c]).replace(/[.。]$/, "")) + ". ") + esc(q.why || ""); };
    const score = () => { const n = M.filter(([q, j]) => A["m" + j] === q.c).length, d = M.filter(([q, j]) => A["m" + j] != null).length; const el = box.querySelector("#mdrScore"); if (el && M.length) el.innerHTML = `أَسْئِلَةُ الِاخْتِيارِ: <b><bdi dir="ltr">${n}/${M.length}</bdi></b>${d < M.length ? ` · بَقِيَ ${M.length - d}` : ""}`; return n; };
    const ordWire = (wrap, ol, items, fb, done) => { const seq = []; wrap.querySelectorAll(".mdr-tok").forEach((b) => b.onclick = () => { if (b.disabled) return; b.disabled = true; seq.push(+b.dataset.k); ol.insertAdjacentHTML("beforeend", `<li>${esc(items[+b.dataset.k])}</li>`);
      if (seq.length === items.length) { const ok = seq.every((k, i) => k === i); fb.className = "mdr-fb " + (ok ? "ok" : "no"); fb.innerHTML = ok ? "✅ تَرْتيبٌ صَحيحٌ." : "❌ التَّرْتيبُ الصَّحيحُ: " + items.map(esc).join(" ← "); if (done) done(ok); } }); };
    const wire = () => {
      if (part === 1) {
        const fb = box.querySelector("#fluB"), ft = box.querySelector("#fluT"), fr = box.querySelector("#fluR"); let fs = 0, ftm = null;
        fb.onclick = () => { if (!fs) { fs = Date.now(); fb.textContent = "⏹ انْتَهَيْتُ"; fr.textContent = ""; ftm = setInterval(() => { const s = Math.floor((Date.now() - fs) / 1000); ft.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; }, 250); return; }
          clearInterval(ftm); const s = (Date.now() - fs) / 1000; fs = 0; fb.textContent = "🔁 أُعيدُ الْقِياسَ";
          if (s < 5) { fr.textContent = "الْوَقْتُ قَصيرٌ جِدًّا، أَعِدِ الْقِياسَ."; return; }
          const wpm = Math.round(X.w * 60 / s); if (wpm > 250) { fr.textContent = "قَرَأْتَ بِسُرْعَةٍ لا تُناسِبُ الْقِراءَةَ الْجَهْرِيَّةَ الْمُتَأَنِّيَةَ؛ أَعِدِ الْقِراءَةَ كُلَّها بِصَوْتٍ مَسْموعٍ وَبِفَهْمٍ."; return; } fr.innerHTML = `سُرْعَتُكَ: <b>${wpm}</b> كَلِمَةً في الدَّقيقَةِ. ${mine && mine.wpm ? `(الْمَرَّةُ السّابِقَةُ ${mine.wpm})` : ""}`;
          ACT.wpm = wpm; if (stu) { save({ p_wpm: wpm }); mine = Object.assign(mine || {}, { wpm }); } };
      }
      if (part === 2) {
        const cz = X.cloze; if (cz && box.querySelector("#czChk")) { let sel = null; const fill = {};
          box.querySelectorAll(".mdr-gap").forEach((g) => g.onclick = () => { box.querySelectorAll(".mdr-gap").forEach((x) => x.classList.remove("sel")); g.classList.add("sel"); sel = +g.dataset.gi; });
          box.querySelectorAll(".mdr-chip").forEach((c) => c.onclick = () => { if (sel == null) { const fst = box.querySelector(".mdr-gap:not(.full)"); if (!fst) return; sel = +fst.dataset.gi; }
            const g = box.querySelector(`.mdr-gap[data-gi="${sel}"]`); if (fill[sel] != null) { const old = box.querySelector(`.mdr-chip[data-cw="${fill[sel]}"]`); if (old) old.disabled = false; }
            fill[sel] = +c.dataset.cw; g.textContent = c.textContent; g.classList.add("full"); g.classList.remove("sel", "ok", "no"); c.disabled = true; sel = null; });
          box.querySelector("#czChk").onclick = () => { let ok = 0; box.querySelectorAll(".mdr-gap").forEach((g) => { const i = +g.dataset.gi, r = fill[i] === i; g.classList.toggle("ok", r); g.classList.toggle("no", !r); if (r) ok++; });
            const f = box.querySelector("#czFb"); f.className = "mdr-fb " + (ok === cz.w.length ? "ok" : "no"); f.textContent = ok === cz.w.length ? "✅ أَحْسَنْتَ! أَكْمَلْتَ الْفِقْرَةَ كَما في النَّصِّ." : `صَحَّ ${ok} مِنْ ${cz.w.length}. أَعِدِ الْمُحاوَلَةَ في الْمُلَوَّنِ بِالْأَحْمَرِ.`; putAct({ cz: ok }); }; }
        const sw = box.querySelector("#sqW"); if (sw) ordWire(sw, box.querySelector("#sqO"), X.seq, box.querySelector("#sqFb"), (ok) => putAct({ sq: ok ? 1 : 0 }));
        const gc = box.querySelector("#glChk"); if (gc) gc.onclick = () => { let ok = 0; box.querySelectorAll("select[data-gl]").forEach((s) => { const r = s.value !== "" && +s.value === +s.dataset.gl; s.classList.toggle("ok", r); s.classList.toggle("no", !r); if (r) ok++; });
          const f = box.querySelector("#glFb"); f.className = "mdr-fb " + (ok === X.gl.length ? "ok" : "no"); f.textContent = ok === X.gl.length ? "✅ مُطابَقَةٌ صَحيحَةٌ." : `صَحَّ ${ok} مِنْ ${X.gl.length}.`; putAct({ gl: ok }); };
      }
      if (part === 3) {
        M.forEach(([q, j]) => mark(j)); score();
        box.querySelectorAll(".mdr-opt").forEach((b) => b.onclick = () => { const j = +b.dataset.q; if (A["m" + j] != null) return; A["m" + j] = +b.dataset.o; mark(j); score(); });
        box.querySelectorAll(".mdr-ord[data-q]").forEach((w) => { const j = +w.dataset.q; ordWire(w, box.querySelector("#mro" + j), X.qs[j].seq, box.querySelector("#mf" + j)); });
        box.querySelectorAll(".mdr-chk").forEach((b) => b.onclick = () => { const j = +b.dataset.q, q = X.qs[j]; let ok = 0; box.querySelectorAll(`select[data-q="${j}"]`).forEach((s) => { const it = q.items[+s.dataset.i]; const g = s.value === "" ? -1 : +s.value; s.classList.toggle("ok", g === it[1]); s.classList.toggle("no", g !== it[1]); if (g === it[1]) ok++; });
          const f = box.querySelector("#mf" + j); f.className = "mdr-fb " + (ok === q.items.length ? "ok" : "no"); f.textContent = ok === q.items.length ? "✅ تَصْنيفٌ صَحيحٌ." : `صَحَّ ${ok} مِنْ ${q.items.length}، راجِعِ الْمُلَوَّنَ بِالْأَحْمَرِ.`; });
        const qs = box.querySelector("#mdrQS"); if (qs) qs.onclick = async () => { keep(); if (M.some(([q, j]) => A["m" + j] == null)) { toast("أَجِبْ عَنْ كُلِّ أَسْئِلَةِ الِاخْتِيارِ أَوَّلًا"); return; }
          qs.disabled = true; const sk = skillScore(); const r = await save({ p_answers: A, p_score: score(), p_max: M.length, p_skills: sk }); qs.disabled = false;
          if (r && r.error) toast("تعذّر الحفظ: " + r.error.message); else { mine = Object.assign(mine || {}, { score: score(), max_score: M.length, quiz_at: new Date().toISOString(), skills: sk }); toast("حُفِظَتْ إِجاباتُكَ، وَتَصِلُ إِلى مُعَلِّمِكَ"); } };
      }
      if (part === 4) {
        const e = box.querySelector("#mdrExpr"), wc = box.querySelector("#mdrWc"); const upd = () => { const n = (e.value.trim().match(/\S+/g) || []).length; wc.textContent = n ? `عَدَدُ الْكَلِماتِ: ${n}` : ""; }; e.oninput = upd; upd();
        const es = box.querySelector("#mdrES"); if (es) es.onclick = async () => { const v = e.value.trim(); if ((v.match(/\S+/g) || []).length < 15) { toast("اكْتُبْ 15 كَلِمَةً عَلى الْأَقَلِّ"); return; }
          es.disabled = true; const nt = (box.querySelector("#mdrNote") || {}).value; const r = await save({ p_expr: v, p_note: nt ? nt.trim() : null }); es.disabled = false;
          if (r && r.error) toast("تعذّر الإرسال: " + r.error.message); else { mine = Object.assign(mine || {}, { expression: v, strat_note: nt, expr_at: new Date().toISOString() }); toast("أُرْسِلَ تَعْبيرُكَ إِلى مُعَلِّمِكَ"); } };
      }
      if (part === 1 && stu) {
        const btn = box.querySelector("#mdrRec"), tm = box.querySelector("#mdrRecT"), au = box.querySelector("#mdrRecA"), snd = box.querySelector("#mdrRecS");
        const mime = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/aac"].find((m) => window.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) || "";
        let rec = null, ch = [], blob = null, st0 = 0, tmr = null, stream = null, dur = 0;
        const stop = () => { if (rec && rec.state === "recording") rec.stop(); clearInterval(tmr); btn.textContent = "⏺ أُعيدُ التَّسْجيلَ"; if (stream) stream.getTracks().forEach((t) => t.stop()); };
        btn.onclick = async () => {
          if (rec && rec.state === "recording") { stop(); return; }
          if (!window.MediaRecorder) { toast("المتصفح لا يدعم التسجيل الصوتي"); return; }
          try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch (e) { toast("اسمح للموقع باستخدام الميكروفون"); return; }
          ch = []; rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
          rec.ondataavailable = (e) => { if (e.data.size) ch.push(e.data); };
          rec.onstop = () => { blob = new Blob(ch, { type: rec.mimeType || "audio/webm" }); au.src = URL.createObjectURL(blob); au.hidden = false; snd.hidden = false; dur = Math.round((Date.now() - st0) / 1000); };
          rec.start(); st0 = Date.now(); au.hidden = true; snd.hidden = true; btn.textContent = "⏹ أُنْهي التَّسْجيلَ";
          tmr = setInterval(() => { const s = Math.floor((Date.now() - st0) / 1000); tm.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; if (s >= 300) stop(); }, 250);
        };
        snd.onclick = async () => { if (!blob) return; snd.disabled = true;
          const path = `${me}/${Date.now()}.${(blob.type.includes("mp4") || blob.type.includes("aac")) ? "m4a" : "webm"}`;
          const up = await sb.storage.from("recitations").upload(path, blob, { contentType: blob.type.split(";")[0] });
          if (up.error) { toast("تعذّر الرفع: " + up.error.message); snd.disabled = false; return; }
          const ins = await sb.from("recitations").insert({ student_id: me, school_id: state.profile.school_id, lesson_id: l.id, title: "قِراءَةٌ جَهْرِيَّةٌ: " + X.t, audio_path: path, duration_sec: dur });
          snd.disabled = false; if (ins.error) { toast("تعذّر الحفظ: " + ins.error.message); return; }
          toast("أُرْسِلَتْ قِراءَتُكَ إِلى مُعَلِّمِكَ"); snd.hidden = true; blob = null; };
      }
    };
    const report = async () => {
      const rep = box.querySelector("#mdrRep"); if (!rep || !state.session) return;
      const { data: tc } = await sb.from("class_teachers").select("classes(id, name, year_group, track, subject_id)").eq("teacher_id", state.session.user.id);
      let cls = (tc || []).map((x) => x.classes).filter((c) => c && c.year_group === u.year_group && c.track === u.track && c.subject_id === u.subject_id);
      if (!cls.length && (isSchoolAdmin() || isSuper())) { const { data } = await sb.from("classes").select("id, name, year_group, track, subject_id").eq("year_group", u.year_group).eq("track", u.track).eq("subject_id", u.subject_id).limit(20); cls = data || []; }
      if (!cls.length) { rep.innerHTML = `<div class="mdr-card muted">لا توجد فصول مرتبطة بك في هذا الصف، فلا يوجد تقرير بعد.</div>`; return; }
      let cur = cls[0].id;
      const drawR = async () => {
        const { data: roster } = await sb.from("class_students").select("student_id, profiles(full_name_ar)").eq("class_id", cur);
        const SS = (roster || []).map((r) => ({ id: r.student_id, name: (r.profiles && r.profiles.full_name_ar) || "—" })).sort((a, b) => a.name.localeCompare(b.name, "ar"));
        const { data: rr } = SS.length ? await sb.from("lesson_reading").select("*").eq("lesson_id", l.id).in("student_id", SS.map((s) => s.id)) : { data: [] };
        const R = {}; (rr || []).forEach((r) => { R[r.student_id] = r; });
        const qd = SS.filter((s) => R[s.id] && R[s.id].quiz_at), ex = SS.filter((s) => R[s.id] && R[s.id].expression);
        const avg = qd.length ? Math.round(qd.reduce((a, s) => a + R[s.id].score / (R[s.id].max_score || 1), 0) * 100 / qd.length) : null;
        const sk = { ret: [0, 0], inf: [0, 0], int: [0, 0], eva: [0, 0] }; qd.forEach((s) => { const k2 = R[s.id].skills || {}; Object.keys(sk).forEach((k) => { if (k2[k]) { sk[k][0] += k2[k][0]; sk[k][1] += k2[k][1]; } }); });
        const wp = SS.map((s) => R[s.id] && R[s.id].wpm).filter(Boolean);
        rep.innerHTML = `<div class="mdr-card"><h3>📊 تَقْريرُ الْقِراءَةِ وَالتَّعْبيرِ</h3>
          ${cls.length > 1 ? `<div class="rd-cls">${cls.map((c) => `<button class="btn btn-small ${c.id === cur ? "btn-primary" : "btn-ghost"}" data-cls="${c.id}">${esc(c.name)}</button>`).join("")}</div>` : ""}
          <div class="lp-stats"><div><b><bdi dir="ltr">${qd.length}/${SS.length}</bdi></b><small>أَجابوا عَنِ الْأَسْئِلَةِ</small></div><div><b>${avg == null ? "—" : avg + "%"}</b><small>مُتَوَسِّطُ الْفَهْمِ</small></div><div><b>${wp.length ? Math.round(wp.reduce((a, b) => a + b, 0) / wp.length) : "—"}</b><small>مُتَوَسِّطُ الطَّلاقَةِ (كَلِمَة/دَقيقَة)</small></div><div><b><bdi dir="ltr">${ex.length}/${SS.length}</bdi></b><small>أَرْسَلوا التَّعْبيرَ</small></div></div>
          <div class="mdr-skills">${Object.keys(sk).filter((k) => sk[k][1]).map((k) => `<div><span>${MDR_SK[k][0]} ${MDR_SK[k][1]}</span>${mdrBar(sk[k][0], sk[k][1])}<b>${Math.round(sk[k][0] * 100 / sk[k][1])}%</b></div>`).join("") || `<p class="muted">تَظْهَرُ مُسْتَوَياتُ الْفَهْمِ عِنْدَما يُجيبُ الطُّلّابُ.</p>`}</div>
          <div class="lp-tw"><table class="lp-tbl"><thead><tr><th>الطالب</th><th>الفهم</th><th>الطلاقة</th><th>قبل القراءة</th><th>التعبير</th></tr></thead><tbody>
          ${SS.map((s) => { const r = R[s.id]; const g = r && r.quiz_at ? (r.score / (r.max_score || 1) >= 0.8 ? "🟢" : r.score / (r.max_score || 1) >= 0.6 ? "🟡" : "🔴") : "";
            return `<tr><td>${esc(s.name)}</td><td>${r && r.quiz_at ? `${g} <bdi dir="ltr">${r.score}/${r.max_score}</bdi>` : "—"}</td><td>${r && r.wpm ? r.wpm : "—"}</td><td>${r && r.pre ? esc(r.pre).slice(0, 120) : "—"}</td><td>${r && r.expression ? `<details><summary>${(r.expression.match(/\S+/g) || []).length} كلمة</summary><p style="white-space:pre-wrap">${esc(r.expression)}</p>${r.strat_note ? `<p class="muted">بعد القراءة: ${esc(r.strat_note)}</p>` : ""}</details>` : "—"}</td></tr>`; }).join("") || `<tr><td colspan="5">لا يوجد طلاب في هذا الفصل</td></tr>`}
          </tbody></table></div><p class="muted">القراءات الجهرية تصلك في صفحة «التسميع» بعنوان «قراءة جهرية».</p></div>`;
        rep.querySelectorAll("[data-cls]").forEach((b) => b.onclick = () => { cur = b.dataset.cls; drawR(); });
      };
      drawR();
    };
    draw();
  }

  // ---------- بطاقة داخل الدرس تدلّ على نص الأسبوع ----------
  async function mdrCard(box, l, u, id) {
    const idx = (await mdrIdxGet())[String(u.year_group)] || []; const pos = idx.findIndex((x) => x.id === id), it = idx[pos]; if (!it) { box.innerHTML = ""; return; }
    box.innerHTML = `<div class="mdr-lcard"><div class="mdr-lcard-i">📗</div><div><span class="pill">كتاب «مدارج القراءة» · النص ${pos + 1} من ${idx.length}</span>
      <h3>«${esc(it.t)}»</h3><p class="muted">${it.kind === "i" ? "نص معلوماتي" : "نص سردي"} · ${it.si} أسلوب القراءة: ${esc(it.sn)} · ${it.w} كلمة</p>
      <p>نص القراءة المقترح مع هذا الدرس: قبل القراءة، وقياس الطلاقة والقراءة الجهرية، وأنشطة المفردات والتسلسل، وأسئلة الفهم في مستويات بيرلز، والتعبير.</p>
      <a class="btn btn-primary" href="#/reading/${it.id}">📖 افتح النص</a> <a class="btn btn-ghost" href="#/year/${u.year_group}?subject=arabic&track=native&term=${u.term}&mdr=1">كل نصوص الصف</a></div></div>`;
  }
