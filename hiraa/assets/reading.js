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
  const MDR_RB = [["💡", "الْفِكْرَةُ"], ["📎", "الدَّليلُ مِنَ النَّصِّ"], ["🔗", "التَّرابُطُ"], ["✒️", "الْإِمْلاءُ وَالتَّرْقيمُ"]];
  const MDR_LV = ["", "يَحْتاجُ دَعْمًا", "يَقْتَرِبُ", "يُحَقِّقُ", "يَتَفَوَّقُ"];
  const mdrNorm = (w) => String(w || "").replace(/[\u064B-\u0652\u0640]/g, "").replace(/[^\u0621-\u064A]/g, "").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي");
  const mdrStem = (w) => mdrNorm(w).replace(/^(وال|فال|بال|كال|لل|ال)/, "");
  let MDR_AUD = null;
  async function mdrAudList() { if (MDR_AUD) return MDR_AUD; MDR_AUD = new Set(); try { const { data } = await sb.storage.from("reader-audio").list("madarij", { limit: 500 }); (data || []).forEach((f) => MDR_AUD.add(f.name)); } catch (e) {} return MDR_AUD; }
  const mdrAudUrl = (name) => ((window.HIRAA_CONFIG && window.HIRAA_CONFIG.supabaseUrl) || "") + "/storage/v1/object/public/reader-audio/madarij/" + encodeURIComponent(name);
  const mdrBar = (v, max) => `<span class="mdr-bar"><i style="width:${max ? Math.round(v * 100 / max) : 0}%"></i></span>`;

  const rubricView = (r) => r ? `<div class="mdr-rbv">${MDR_RB.map((c, i) => { const v = +r[i] || 0; return `<div><span>${c[0]} ${c[1]}</span><span class="mdr-dots">${[1, 2, 3, 4].map((k) => `<i class="${k <= v ? "on" : ""}"></i>`).join("")}</span><b>${MDR_LV[v] || "—"}</b></div>`; }).join("")}</div>` : "";

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
    const target = await mdrTarget(year);
    const done = all.filter((x) => x.lesson && mine[x.lesson.id] && mine[x.lesson.id].quiz_at);
    const sk = { ret: [0, 0], inf: [0, 0], int: [0, 0], eva: [0, 0] };
    done.forEach((x) => { const s = mine[x.lesson.id].skills || {}; Object.keys(sk).forEach((k) => { if (s[k]) { sk[k][0] += s[k][0]; sk[k][1] += s[k][1]; } }); });
    const wpms = done.map((x) => mine[x.lesson.id].wpm).filter(Boolean);
    const passport = isStudent() && state.session ? `<div class="mdr-pass"><div class="mdr-pass-h"><span>📗</span><div><b>جَوازُ الْقِراءَةِ</b><small>الصَّفُّ ${MDR_GN[year]} · ${all.length} نَصًّا مِنْ كِتابِ «مَدارِجِ الْقِراءَةِ»</small></div></div>
        <div class="mdr-pass-s"><div><b><bdi dir="ltr">${done.length}/${all.length}</bdi></b><small>نُصوصٌ أَنْجَزْتُها</small>${mdrBar(done.length, all.length)}</div>
          <div><b>${wpms.length ? wpms[wpms.length - 1] : "—"}</b><small>كَلِمَةً في الدَّقيقَةِ (آخِرُ قِياسٍ)</small></div>
          ${Object.keys(sk).map((k) => `<div><b>${sk[k][1] ? Math.round(sk[k][0] * 100 / sk[k][1]) + "%" : "—"}</b><small>${MDR_SK[k][0]} ${MDR_SK[k][1]}</small>${mdrBar(sk[k][0], sk[k][1])}</div>`).join("")}</div>
        ${mdrCurve(all.map((x, i) => [i + 1, x.lesson && mine[x.lesson.id] && mine[x.lesson.id].wpm, x.t]).filter((p) => p[1]), target, all.length)}
        ${mdrLeague(all, mine, year, term)}</div>` : "";
    const staffBox = isStaff() && state.session ? `<div class="mdr-staff" id="mdrStaff"><div class="loading">جارٍ تحميل خريطة الفصل…</div></div>` : "";
    if (staffBox) mdrDefer("mdrStaff", (el) => mdrStaffPanel(el, year, all, target));
    if (passport) mdrDefer("mdrCert", (el) => { el.onclick = () => mdrCertPrint(year, term, all.filter((x) => x.term === term)); });
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
    return `<div class="mdr-list">${intro}${passport}${staffBox}<div class="unit">${list}</div></div>`;
  }

  // ينتظر ظهور العنصر بعد رسم الصفحة ثم يربطه
  function mdrDefer(id, fn) { let n = 0; const go = () => { const el = document.getElementById(id); if (el) { if (!el.dataset.w) { el.dataset.w = 1; fn(el); } } else if (n++ < 60) setTimeout(go, 50); }; setTimeout(go, 0); }
  async function mdrTarget(year) {
    const sid = state.profile && state.profile.school_id; if (!sid) return null;
    const { data } = await sb.from("reading_targets").select("wpm").eq("school_id", sid).eq("year_group", +year).maybeSingle();
    return data ? data.wpm : null;
  }
  // منحنى الطلاقة عبر نصوص السنة مع خط هدف المدرسة
  function mdrCurve(pts, target, total) {
    if (!pts.length) return `<div class="mdr-curve"><h4>📈 مُنْحَنى طَلاقَتي</h4><p class="muted">قِسْ طَلاقَتَكَ في خُطْوَةِ «أَقْرَأُ» لِيَظْهَرَ مُنْحَناكَ هُنا${target ? ` · هَدَفُ مَدْرَسَتِكَ: <b>${target}</b> كَلِمَةً في الدَّقيقَةِ` : ""}.</p></div>`;
    const W = 600, H = 170, px = 34, py = 18, mx = Math.max(total, 2), top = Math.max(...pts.map((p) => p[1]), target || 0) * 1.15 || 100;
    const X = (i) => px + (i - 1) * (W - px * 2) / (mx - 1), Y = (v) => H - py - v * (H - py * 2) / top;
    const line = pts.map((p, k) => `${k ? "L" : "M"}${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join(" ");
    const last = pts[pts.length - 1][1], first = pts[0][1];
    return `<div class="mdr-curve"><h4>📈 مُنْحَنى طَلاقَتي</h4>
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="منحنى الطلاقة" dir="ltr">
        ${[0.25, 0.5, 0.75, 1].map((f) => `<line x1="${px}" x2="${W - px}" y1="${Y(top * f / 1.15)}" y2="${Y(top * f / 1.15)}" class="g"/><text x="4" y="${Y(top * f / 1.15) + 4}" class="ax">${Math.round(top * f / 1.15)}</text>`).join("")}
        ${target ? `<line x1="${px}" x2="${W - px}" y1="${Y(target)}" y2="${Y(target)}" class="tg"/><text x="${W - px}" y="${Y(target) - 5}" text-anchor="end" class="tgl">الهدف ${target}</text>` : ""}
        <path d="${line}" class="ln"/>${pts.map((p) => `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="5" class="pt"><title>النص ${p[0]} «${esc(p[2])}»: ${p[1]} كلمة/دقيقة</title></circle>`).join("")}
      </svg>
      <p class="muted">${pts.length > 1 ? (last >= first ? `تَقَدَّمْتَ مِنْ <b>${first}</b> إِلى <b>${last}</b> كَلِمَةً في الدَّقيقَةِ. ` : `آخِرُ قِياسٍ <b>${last}</b> (كانَ <b>${first}</b>)؛ اقْرَأْ بِتَأَنٍّ وَفَهْمٍ، فَالسُّرْعَةُ وَحْدَها لَيْسَتْ هَدَفًا. `) : ""}${target ? (last >= target ? "🎯 بَلَغْتَ هَدَفَ مَدْرَسَتِكَ." : `بَقِيَ <b>${target - last}</b> كَلِمَةً لِتَبْلُغَ هَدَفَ مَدْرَسَتِكَ (${target}).`) : ""}</p></div>`;
  }
  // دوري القراءة: نقاط وأوسمة وشهادة الفصل
  const MDR_BD = [["🌱", "قارِئٌ ناشِئٌ"], ["📘", "قارِئٌ نَشيطٌ"], ["⭐", "قارِئٌ مُتَمَكِّنٌ"], ["🏅", "قارِئٌ مُتَمَيِّزٌ"], ["🏆", "سَفيرُ الْقِراءَةِ"], ["👑", "فارِسُ الْقِراءَةِ"]];
  const mdrPts = (r) => !r || !r.quiz_at ? 0 : 10 + (r.score === r.max_score && r.max_score ? 5 : 0) + (r.expr_at ? 5 : 0) + (r.wpm ? 2 : 0);
  function mdrLeague(all, mine, year, term) {
    const rs = all.map((x) => x.lesson && mine[x.lesson.id]).filter((r) => r && r.quiz_at);
    const pts = rs.reduce((a, r) => a + mdrPts(r), 0), nb = Math.min(Math.floor(rs.length / 5), MDR_BD.length);
    const tt = all.filter((x) => x.term === term), td = tt.filter((x) => x.lesson && mine[x.lesson.id] && mine[x.lesson.id].quiz_at).length;
    const nx = nb < MDR_BD.length ? 5 * (nb + 1) - rs.length : 0;
    return `<div class="mdr-league"><div class="mdr-lg-h"><h4>🏁 دَوْري الْقِراءَةِ</h4><b class="mdr-pts">${pts} <small>نُقْطَةً</small></b></div>
      <p class="muted">كُلُّ نَصٍّ تُنْجِزُهُ: 10 نِقاطٍ · الْعَلامَةُ الْكامِلَةُ +5 · إِرْسالُ التَّعْبيرِ +5 · قِياسُ الطَّلاقَةِ +2. وِسامٌ جَديدٌ كُلَّ 5 نُصوصٍ.</p>
      <div class="mdr-badges">${MDR_BD.map((b, i) => `<span class="mdr-bd ${i < nb ? "on" : ""}" title="${b[1]}: ${5 * (i + 1)} نُصوصٍ"><i>${b[0]}</i>${b[1]}<small>${5 * (i + 1)} نُصوصٍ</small></span>`).join("")}</div>
      ${nx ? `<p class="muted">بَقِيَ <b>${nx}</b> ${nx === 1 ? "نَصٌّ" : "نُصوصٍ"} لِلْوِسامِ التّالي «${MDR_BD[nb][1]}».</p>` : ""}
      <div class="mdr-cert-row"><span>🎓 شَهادَةُ «قارِئِ الْفَصْلِ»: أَنْجَزْتَ <bdi dir="ltr">${td}/${tt.length}</bdi> مِنْ نُصوصِ هذا الْفَصْلِ</span>${tt.length && td === tt.length ? `<button class="btn btn-primary btn-small" id="mdrCert">🖨️ اطْبَعْ شَهادَتي</button>` : mdrBar(td, tt.length)}</div></div>`;
  }
  function mdrCertPrint(year, term, tt) {
    const name = (state.profile && state.profile.full_name_ar) || "";
    const w = window.open("", "_blank"); if (!w) { toast("اسمح بالنوافذ المنبثقة للطباعة"); return; }
    const d = new Date(); const ds = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    w.document.write(`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>شهادة قارئ الفصل</title><link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet"><style>
      @page{size:A4 landscape;margin:12mm}body{font-family:Amiri,serif;margin:0;color:#1f2937}
      .c{border:10px double #2E6FBF;border-radius:18px;padding:40px 50px;text-align:center;min-height:150mm;display:flex;flex-direction:column;justify-content:center;gap:10px}
      h1{font-size:46px;color:#2E6FBF;margin:0}h2{font-size:40px;margin:6px 0;color:#0f5132}p{font-size:22px;margin:4px 0}.s{display:flex;justify-content:space-between;margin-top:30px;font-size:18px}
      .t{font-size:15px;color:#555;columns:2;text-align:right;margin:10px auto;max-width:80%}</style></head><body><div class="c">
      <div style="font-size:54px">📗</div><h1>شَهادَةُ قارِئِ الْفَصْلِ</h1><p>تَشْهَدُ مَنَصَّةُ حِراءٍ بِأَنَّ الطّالِبَ/الطّالِبَةَ</p><h2>${esc(name) || "...................."}</h2>
      <p>قَدْ أَتَمَّ قِراءَةَ نُصوصِ ${["", "الْفَصْلِ الدِّراسِيِّ الْأَوَّلِ", "الْفَصْلِ الدِّراسِيِّ الثّاني", "الْفَصْلِ الدِّراسِيِّ الثّالِثِ"][term]} مِنْ كِتابِ «مَدارِجِ الْقِراءَةِ» لِلصَّفِّ ${MDR_GN[year]}، وَعَدَدُها ${tt.length} نُصوصٍ، مَعَ أَسْئِلَةِ الْفَهْمِ.</p>
      <div class="t">${tt.map((x) => `<div>• ${esc(x.t)}</div>`).join("")}</div>
      <p>نَسْأَلُ اللهَ لَهُ التَّوْفيقَ وَالسَّدادَ.</p>
      <div class="s"><span>التّاريخُ: ${ds}</span><span>تَوْقيعُ الْمُعَلِّمِ: ....................</span></div></div>
      <script>setTimeout(function(){print()},700)<\/script></body></html>`);
    w.document.close();
  }
  // لوحة المعلم: هدف الطلاقة وخريطة الفصل الحرارية
  async function mdrStaffPanel(el, year, all, target) {
    const sid = state.profile && state.profile.school_id;
    const { data: tc } = await sb.from("class_teachers").select("classes(id, name, year_group, track, subject_id)").eq("teacher_id", state.session.user.id);
    let cls = (tc || []).map((x) => x.classes).filter((c) => c && c.year_group === +year && c.track === "native" && c.subject_id === 2);
    if (!cls.length && (isSchoolAdmin() || isSuper())) { const { data } = await sb.from("classes").select("id, name").eq("year_group", +year).eq("track", "native").eq("subject_id", 2).order("name").limit(30); cls = data || []; }
    const tgtH = () => sid ? `<div class="mdr-tgt"><label>🎯 هَدَفُ الطَّلاقَةِ لِلصَّفِّ ${MDR_GN[year]} في مَدْرَسَتِكَ (كَلِمَة/دَقيقَة):</label><input type="number" min="20" max="250" id="mdrTgtV" value="${target || ""}" placeholder="مثال: 90"><button class="btn btn-ghost btn-small" id="mdrTgtS">حفظ</button><small class="muted">يظهر خطًّا في منحنى كل طالب.</small></div>` : "";
    if (!cls.length) { el.innerHTML = `<div class="mdr-card">${tgtH()}<p class="muted">لا توجد فصول مرتبطة بك في هذا الصف، فلا تظهر خريطة الفصل.</p></div>`; wireT(); return; }
    let cur = cls[0].id;
    function wireT() { const b = el.querySelector("#mdrTgtS"); if (b) b.onclick = async () => { const v = +el.querySelector("#mdrTgtV").value; if (!(v >= 20 && v <= 250)) { toast("اكتب رقمًا بين 20 و250"); return; }
      b.disabled = true; const { error } = await sb.rpc("set_reading_target", { p_year: +year, p_wpm: v }); b.disabled = false; if (error) toast("تعذّر الحفظ: " + error.message); else { target = v; toast("حُفظ الهدف"); if (cls.length) draw(); } }; }
    const ids = all.map((x) => x.lesson && x.lesson.id).filter(Boolean);
    const col = (p) => p == null ? "" : `style="background:hsl(${Math.round(p * 1.2)},70%,${88 - p * 0.1}%)"`;
    async function draw() {
      const { data: roster } = await sb.from("class_students").select("student_id, profiles(full_name_ar)").eq("class_id", cur);
      const SS = (roster || []).map((r) => ({ id: r.student_id, name: (r.profiles && r.profiles.full_name_ar) || "—" })).sort((a, b) => a.name.localeCompare(b.name, "ar"));
      const { data: rr } = SS.length && ids.length ? await sb.from("lesson_reading").select("student_id, lesson_id, score, max_score, quiz_at, expr_at, wpm, skills").in("lesson_id", ids).in("student_id", SS.map((s) => s.id)) : { data: [] };
      const B = {}; (rr || []).forEach((r) => { (B[r.student_id] = B[r.student_id] || []).push(r); });
      const KS = Object.keys(MDR_SK), groups = {}; KS.forEach((k) => { groups[k] = []; });
      const rows = SS.map((s) => { const rs = (B[s.id] || []).filter((r) => r.quiz_at); const sk = {}; KS.forEach((k) => { sk[k] = [0, 0]; });
        rs.forEach((r) => KS.forEach((k) => { const v = (r.skills || {})[k]; if (v) { sk[k][0] += v[0]; sk[k][1] += v[1]; } }));
        const sc = rs.reduce((a, r) => [a[0] + r.score, a[1] + r.max_score], [0, 0]); const pc = (a) => a[1] ? Math.round(a[0] * 100 / a[1]) : null;
        const wps = (B[s.id] || []).map((r) => r.wpm).filter(Boolean); const wpm = wps.length ? Math.round(wps.reduce((a, b) => a + b, 0) / wps.length) : null;
        const weak = KS.filter((k) => sk[k][1] >= 2).sort((a, b) => pc(sk[a]) - pc(sk[b]))[0]; if (weak && pc(sk[weak]) < 70) groups[weak].push(s.name);
        return { s, n: rs.length, c: pc(sc), sk: KS.map((k) => pc(sk[k])), wpm, weak: weak && pc(sk[weak]) < 70 ? weak : null, pts: rs.reduce((a, r) => a + mdrPts(r), 0) }; });
      const avgW = rows.map((r) => r.wpm).filter(Boolean);
      el.innerHTML = `<div class="mdr-card"><h3>🗺️ خَريطَةُ الْفَصْلِ الْقِرائِيَّةُ</h3>${tgtH()}
        ${cls.length > 1 ? `<div class="rd-cls">${cls.map((c) => `<button class="btn btn-small ${c.id === cur ? "btn-primary" : "btn-ghost"}" data-cls="${c.id}">${esc(c.name)}</button>`).join("")}</div>` : ""}
        <div class="lp-stats"><div><b>${SS.length}</b><small>طالبًا</small></div><div><b>${rows.length ? Math.round(rows.reduce((a, r) => a + r.n, 0) / rows.length * 10) / 10 : "—"}</b><small>متوسط النصوص المنجزة من ${all.length}</small></div><div><b>${avgW.length ? Math.round(avgW.reduce((a, b) => a + b, 0) / avgW.length) : "—"}</b><small>متوسط الطلاقة${target ? ` · الهدف ${target}` : ""}</small></div>${target ? `<div><b><bdi dir="ltr">${rows.filter((r) => r.wpm && r.wpm >= target).length}/${SS.length}</bdi></b><small>بلغوا الهدف</small></div>` : ""}</div>
        <div class="lp-tw"><table class="lp-tbl mdr-heat"><thead><tr><th>الطالب</th><th>النصوص</th><th>الفهم</th>${KS.map((k) => `<th title="${MDR_SK[k][1]}">${MDR_SK[k][0]} ${{ ret: "الاسترجاع", inf: "الاستنتاج", int: "التفسير", eva: "التقويم" }[k]}</th>`).join("")}<th>الطلاقة</th><th>النقاط</th><th>يحتاج دعمًا في</th></tr></thead><tbody>
        ${rows.map((r) => `<tr><td>${esc(r.s.name)}</td><td><bdi dir="ltr">${r.n}/${all.length}</bdi></td><td ${col(r.c)}>${r.c == null ? "—" : r.c + "%"}</td>${r.sk.map((p) => `<td ${col(p)}>${p == null ? "—" : p + "%"}</td>`).join("")}<td ${target && r.wpm ? col(Math.min(100, r.wpm * 100 / target)) : ""}>${r.wpm || "—"}</td><td>${r.pts}</td><td>${r.weak ? MDR_SK[r.weak][0] + " " + MDR_SK[r.weak][1] : "—"}</td></tr>`).join("") || `<tr><td colspan="${KS.length + 6}">لا يوجد طلاب في هذا الفصل</td></tr>`}
        </tbody></table></div>
        <h4>👥 مَجْموعاتُ الدَّعْمِ الْمُقْتَرَحَةُ</h4><p class="muted">الطالب في مجموعة أضعف مستوى له (أقل من 70% بعد سؤالين على الأقل).</p>
        <div class="mdr-groups">${KS.map((k) => `<div><b>${MDR_SK[k][0]} ${MDR_SK[k][1]} <small>(${groups[k].length})</small></b><span>${groups[k].length ? groups[k].map(esc).join("، ") : "—"}</span></div>`).join("")}</div></div>`;
      el.querySelectorAll("[data-cls]").forEach((b) => b.onclick = () => { cur = b.dataset.cls; draw(); });
      wireT();
    }
    draw();
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
      ${acc === "ok" ? `<div class="mdr-tools">${isStaff() && state.session ? `<button class="btn btn-primary btn-small" id="mdrHw">📌 كلِّف الفصل بهذا النص واجبًا</button>` : ""}<button class="btn btn-ghost btn-small" id="mdrPrint">🖨️ حزمة الطباعة</button></div>` : ""}
    </div></section>
    <section class="wrap panel" id="panel"><div id="rdgBox"></div>
      <div class="mdr-pn">${nav(idx[pos - 1], "→")}${nav(idx[pos + 1], "←")}</div></section>`);
    const box = document.getElementById("rdgBox");
    if (acc !== "ok") { box.innerHTML = `<div class="paywall-box form-card"><strong>${lockIcon} ${state.session ? "هذا النص مقفل الآن" : "اشترك أولًا"}</strong><p>${state.session ? "يفتحه معلمك مع درسه، أو عند تفعيل اشتراك الصف." : "النص الأول من كل صف مجاني للتجربة، وبقية النصوص للمشتركين."}</p><a class="btn btn-primary" href="${listHref}">العودة إلى قائمة النصوص</a></div>`; return; }
    const hw = document.getElementById("mdrHw"); if (hw) hw.onclick = () => hwDialog(l, u, false, false, true, it.t);
    const pr = document.getElementById("mdrPrint"); if (pr) pr.onclick = async () => mdrPrintPack(await mdrGet(id), year);
    mdrRun(box, l, u, id);
  }

  // حزمة الطباعة: النص والأنشطة والأسئلة ومعايير التعبير في ورقة واحدة
  async function mdrPrintPack(X, year) {
    const fx = await mdrTagFix(X.id); const pk = (q, j) => fx[j] || q.pk || "ret";
    const w = window.open("", "_blank"); if (!w) { toast("اسمح بالنوافذ المنبثقة للطباعة"); return; }
    const lines = (n) => `<div class="ln">${"<i></i>".repeat(n)}</div>`;
    const core = (s) => s.replace(/[،؛:.!؟?»«"()\-…]+$/g, "");
    let cz = ""; if (X.cloze) { const toks = X.text[X.cloze.p].split(" "); cz = `<h2>🔤 أُكْمِلُ الْفَراغاتِ بِكَلِمَةٍ مِنَ الْبَنْكِ</h2><p class="bank">${X.cloze.w.map((k) => core(toks[k])).sort(() => Math.random() - 0.5).map(esc).join(" · ")}</p><p>${toks.map((t, k) => X.cloze.w.includes(k) ? "…………" + esc(t.slice(core(t).length)) : esc(t)).join(" ")}</p>`; }
    const sq = X.seq ? `<h2>🧵 أُرَتِّبُ الْأَحْداثَ (1، 2، 3…)</h2>${X.seq.map((s, k) => [s, k]).sort(() => Math.random() - 0.5).map(([s]) => `<p>(&nbsp;&nbsp;&nbsp;) ${esc(s)}…</p>`).join("")}` : "";
    const gm = (X.gl || []).map((g) => g[1]).sort(() => Math.random() - 0.5);
    const gl = (X.gl || []).length ? `<h2>🔗 أَصِلُ الْكَلِمَةَ بِمَعْناها</h2><table class="m">${X.gl.map((g, i) => `<tr><td>${esc(g[0])}</td><td class="sp"></td><td>${esc(gm[i])}</td></tr>`).join("")}</table>` : "";
    const qs = X.qs.map((q, j) => `<div class="q"><b>${j + 1}. ${esc(q.q)}</b> <small>[${MDR_SK[pk(q, j)][1]}]</small>${q.k === "m" ? `<ol type="أ">${q.o.map((o) => `<li>${esc(o)}</li>`).join("")}</ol>` : q.k === "r" ? q.seq.map((s) => [s]).sort(() => Math.random() - 0.5).map(([s]) => `<p>(&nbsp;&nbsp;&nbsp;) ${esc(s)}</p>`).join("") : q.items ?`<table class="m">${q.items.map((it) => `<tr><td>${esc(it[0])}</td><td>${q.bins.map(esc).join(" / ")}</td></tr>`).join("")}</table>` : lines(3)}</div>`).join("");
    const key = X.qs.map((q, j) => q.k === "m" ? `${j + 1}: ${esc(q.o[q.c])}` : q.k === "o" && q.a ? `${j + 1}: ${esc(q.a)}` : "").filter(Boolean).join(" · ");
    w.document.write(`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>${esc(X.t)} · حزمة الطباعة</title><link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet"><style>
      @page{size:A4;margin:14mm}body{font-family:Amiri,serif;font-size:17px;line-height:1.9;color:#111}h1{font-size:28px;margin:0;color:#2E6FBF}h2{font-size:20px;margin:18px 0 6px;border-bottom:2px solid #2E6FBF;color:#2E6FBF}
      .hd{display:flex;justify-content:space-between;border-bottom:3px double #2E6FBF;padding-bottom:6px;margin-bottom:10px}.hd small{font-size:14px}.tx p{text-indent:1.5em;margin:4px 0;font-size:19px;line-height:2.1}
      .bank{border:1.5px dashed #888;padding:4px 10px;border-radius:8px}.q{margin:10px 0;break-inside:avoid}.q small{color:#666}ol{margin:2px 30px 0 0}table.m{border-collapse:collapse;width:100%}table.m td{border:1px solid #bbb;padding:4px 8px}td.sp{width:20%}
      .ln i{display:block;border-bottom:1px dotted #777;height:32px}.rb{border-collapse:collapse;width:100%;font-size:14px}.rb td,.rb th{border:1px solid #999;padding:4px;text-align:center}.pb{break-before:page}.key{font-size:13px;color:#444;border-top:1px solid #ccc;margin-top:24px;padding-top:6px}
      img{max-width:45%;float:left;margin:0 12px 8px 0;border-radius:8px}</style></head><body>
      <div class="hd"><div><h1>«${esc(X.t)}»</h1><small>${X.kind === "i" ? "نَصٌّ مَعْلوماتِيٌّ" : "نَصٌّ سَرْدِيٌّ"} · أُسْلوبُ الْقِراءَةِ: ${esc(X.strat.n)} · ${X.w} كَلِمَةً · الصَّفُّ ${MDR_GN[year]}</small></div><small>الِاسْمُ: ....................<br>التّاريخُ: ............</small></div>
      <h2>${X.strat.ic} قَبْلَ الْقِراءَةِ</h2><p>${esc(X.strat.p)}</p>${lines(2)}
      <h2>📖 النَّصُّ</h2><div class="tx">${X.img ? `<img src="${X.img}" alt="">` : ""}${X.text.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
      <p><small>⏱️ زَمَنُ قِراءَتي الْجَهْرِيَّةِ: ...... دَقيقَةً ...... ثانِيَةً</small></p>
      <div class="pb"></div>${cz}${sq}${gl}<h2>❓ أَسْئِلَةُ الْفَهْمِ</h2>${qs}
      <h2>✍️ التَّعْبيرُ الْكِتابِيُّ</h2><p>${esc(X.expr.w)}</p>${lines(8)}
      <table class="rb"><tr><th>الْمِعْيارُ</th>${[1, 2, 3, 4].map((k) => `<th>${MDR_LV[k]}</th>`).join("")}</tr>${MDR_RB.map((c) => `<tr><td>${c[0]} ${c[1]}</td><td></td><td></td><td></td><td></td></tr>`).join("")}</table>
      <h2>🗣️ التَّعْبيرُ الشَّفَهِيُّ</h2><p>${esc(X.expr.o)}</p>
      <p><small>كتاب «مدارج القراءة»، وزارة التربية والتعليم · ص ${X.p} · منصة حراء</small></p>
      ${isStaff() ? `<div class="pb key"><b>🔑 مِفْتاحُ الْإِجابَةِ (لِلْمُعَلِّمِ، صَفْحَةٌ مُنْفَصِلَةٌ لا تُوَزَّعُ):</b><br>${key}</div>` : ""}
      <script>window.onload=function(){setTimeout(function(){print()},600)}<\/script></body></html>`);
    w.document.close();
  }
  async function mdrTagFix(tid) { const { data } = await sb.from("reading_tag_fix").select("q_index, pk").eq("text_id", tid); const o = {}; (data || []).forEach((r) => { o[r.q_index] = r.pk; }); return o; }
  const MDR_PREF_K = "hiraa.mdrPrefs";
  const mdrPrefGet = () => { try { return Object.assign({ fs: 0, sp: 0, rl: 0 }, JSON.parse(localStorage.getItem(MDR_PREF_K) || "{}")); } catch (e) { return { fs: 0, sp: 0, rl: 0 }; } };
  const mdrPrefSet = (p) => { try { localStorage.setItem(MDR_PREF_K, JSON.stringify(p)); } catch (e) {} };

  // ---------- مشغّل النص: ست خطوات ----------
  async function mdrRun(box, l, u, id) {
    box.innerHTML = `<div class="loading">جارٍ التحميل…</div>`;
    let X; try { X = await mdrGet(id); } catch (e) { box.innerHTML = `<div class="empty"><strong>تعذّر تحميل النص</strong></div>`; return; }
    thmFonts();
    try { const FX = await mdrTagFix(X.id); X.qs.forEach((q, j) => { if (FX[j]) q.pk = FX[j]; }); } catch (e) {}
    const PF = mdrPrefGet();
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
    const GL = {}; (X.gl || []).forEach((g, i) => { GL[mdrStem(g[0])] = i; });
    let WN = 0; const WW = [];
    const paras = (sm) => { if (sm) return X.text.map((p) => `<p>${esc(p)}</p>`).join(""); WN = 0; WW.length = 0;
      return X.text.map((p) => `<p>${p.split(" ").map((w) => { const i = WN++; WW.push(w.length + (/[.،؛:!؟?]$/.test(w) ? 6 : 1)); const g = GL[mdrStem(w)]; return `<span class="mdr-w${g != null ? " mdr-gw" : ""}" data-i="${i}"${g != null ? ` data-g="${g}"` : ""}>${esc(w)}</span>`; }).join(" ")}</p>`).join(""); };
    const textHtml = (sm) => `<div class="mdr-text${sm ? " sm" : ""}">${X.img ? `<img class="mdr-img" src="${X.img}" alt="" loading="lazy">` : ""}${paras()}${X.img2 ? `<img class="mdr-img2" src="${X.img2}" alt="" loading="lazy">` : ""}<div class="muted mdr-ref">كتاب «مدارج القراءة»، وزارة التربية والتعليم · ص ${X.p}</div></div>`;
    const S = X.strat;
    const auds = await mdrAudList(); const audName = [...auds].find((n) => n.replace(/\.[^.]+$/, "") === X.id) || null;
    const bank = () => (ACT.bank || []);
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
          ${audName || isSuper() ? `<div class="mdr-card mdr-model-r"><h3>🎧 الْقِراءَةُ النَّموذَجِيَّةُ</h3>${audName ? `<p class="muted">اسْتَمِعْ وَتابِعِ الْكَلِماتِ الْمُضاءَةَ بِعَيْنِكَ، ثُمَّ اقْرَأْ أَنْتَ بِالطَّريقَةِ نَفْسِها.</p><div class="mdr-rec"><button class="btn btn-primary" id="audB">▶️ اسْتَمِعْ</button><button class="btn btn-ghost btn-small" id="audR" hidden>↻ مِنَ الْبِدايَةِ</button><select id="audS" class="mdr-speed"><option value="0.8">0.8×</option><option value="1" selected>1×</option><option value="1.2">1.2×</option></select></div>` : `<p class="muted">لَمْ يُرْفَعْ تَسْجيلُ هذا النَّصِّ بَعْدُ.</p>`}
            ${isSuper() ? `<div class="mdr-up"><label class="btn btn-ghost btn-small">⬆️ ${audName ? "اسْتَبْدِلِ" : "ارْفَعِ"} التَّسْجيلَ (mp3/m4a)<input type="file" accept="audio/*" id="audF" hidden></label><span class="muted" id="audSt"></span></div>` : ""}</div>` : ""}
          <div class="mdr-rtool" role="toolbar" aria-label="وضع القراءة المريح"><span>👓 وَضْعُ الْقِراءَةِ:</span>
            <button class="btn btn-ghost btn-small" data-rt="fs-" aria-label="تصغير الخط">أ−</button><button class="btn btn-ghost btn-small" data-rt="fs+" aria-label="تكبير الخط">أ+</button>
            <button class="btn btn-small ${PF.sp ? "btn-primary" : "btn-ghost"}" data-rt="sp">↕️ تَباعُدٌ أَوْسَعُ</button><button class="btn btn-small ${PF.rl ? "btn-primary" : "btn-ghost"}" data-rt="rl">📏 مِسْطَرَةُ السَّطْرِ</button></div>
          <p class="muted mdr-taphint">👆 ${(X.gl || []).length ? "الْكَلِماتُ الْمُسَطَّرَةُ لَها مَعْنًى: اُنْقُرْها. وَ" : ""}اُنْقُرْ أَيَّ كَلِمَةٍ صَعْبَةٍ لِتُضيفَها إِلى «بَنْكِ كَلِماتي».</p>
          ${textHtml()}
          ${(X.gl || []).length ? `<div class="mdr-card"><h3>🔤 مَعاني الْكَلِماتِ${X.glh ? ` <small class="muted">(مِنْ إِعْدادِ حِراءٍ)</small>` : ""}</h3><div class="mdr-gl">${X.gl.map((g) => `<div><b>${esc(g[0])}</b><span>${esc(g[1])}</span></div>`).join("")}</div></div>` : ""}
          <div class="mdr-card mdr-loud"><h3>🎙️ أُسَجِّلُ قِراءَتي الْجَهْرِيَّةَ</h3><p class="muted">اقْرَأْ فِقْرَةً أَوْ فِقْرَتَيْنِ بِصَوْتٍ واضِحٍ، مُراعِيًا الْوَقْفَ عِنْدَ عَلاماتِ التَّرْقيمِ، وَتَلْوينَ صَوْتِكَ مَعَ الْأَسْئِلَةِ وَالتَّعَجُّبِ.</p>
          <div class="mdr-rubric"><span>🗣️ النُّطْقُ السَّليمُ</span><span>⏸️ الْوَقْفُ عِنْدَ عَلاماتِ التَّرْقيمِ</span><span>🎭 تَلْوينُ الصَّوْتِ</span><span>🚀 السُّرْعَةُ الْمُناسِبَةُ</span></div>
          ${stu ? `<div class="mdr-rec"><button class="btn btn-dawn" id="mdrRec">⏺ اِبْدَأِ التَّسْجيلَ</button><span id="mdrRecT" class="muted">0:00</span><audio id="mdrRecA" controls hidden></audio><button class="btn btn-primary btn-small" id="mdrRecS" hidden>📤 أُرْسِلُها لِمُعَلِّمي</button></div>` : `<p class="muted">${isStaff() ? "يُسَجِّلُ الطّالِبُ قِراءَتَهُ هُنا، وَتَصِلُكَ في صَفْحَةِ «التَّسْميعِ» لِتَقْييمِها." : "سَجِّلِ الدُّخولَ بِحِسابِ الطّالِبِ لِتُسَجِّلَ قِراءَتَكَ وَتُرْسِلَها لِمُعَلِّمِكَ."}</p>`}</div>` + nav(0, 2);
      if (part === 2) body = (clozeHtml() + seqHtml() + glHtml() || `<div class="mdr-card muted">لا أَنْشِطَةَ إِضافِيَّةً لِهذا النَّصِّ؛ انْتَقِلْ إِلى الْأَسْئِلَةِ.</div>`) + nav(1, 3);
      if (part === 3) body = `<details class="mdr-card"><summary>📖 اعْرِضِ النَّصَّ</summary>${textHtml(1)}</details>
          <p class="muted">لِكُلِّ سُؤالٍ مُسْتَواهُ مِنْ مُسْتَوَياتِ الْفَهْمِ الْأَرْبَعَةِ (بيرْلِز). أَجِبْ عَنْ أَسْئِلَةِ الِاخْتِيارِ، ثُمَّ اكْتُبْ إِجاباتِكَ لِلْمَفْتوحَةِ وَقارِنْها بِالْإِجابَةِ النَّموذَجِيَّةِ.</p>
          ${X.qs.map((q, j) => `<div class="mdr-q" id="mq${j}"><div class="mdr-qt"><span>${j + 1}</span><div>${esc(q.q)}<small class="mdr-pk pk-${q.pk || "ret"}">${MDR_SK[q.pk || "ret"][0]} ${MDR_SK[q.pk || "ret"][1]}</small></div></div>${
            (isSuper() ? `<div class="mdr-pkfix"><label>🛠️ مستوى السؤال: <select data-pkq="${j}">${Object.keys(MDR_SK).map((k) => `<option value="${k}" ${(q.pk || "ret") === k ? "selected" : ""}>${MDR_SK[k][1]}</option>`).join("")}</select></label></div>` : "") +
            (q.k === "m" ? `<div class="mdr-opts">${q.o.map((o, k) => `<button class="mdr-opt" data-q="${j}" data-o="${k}">${esc(o)}</button>`).join("")}</div><div class="mdr-fb" id="mf${j}"></div>`
            : q.k === "o" ? `${ta("mo" + j, "إِجابَتي…", A["o" + j], 2)}<details class="mdr-model"><summary>💡 الْإِجابَةُ النَّموذَجِيَّةُ</summary><p>${esc(q.a)}</p></details>`
            : q.k === "r" ? `<p class="muted">اُنْقُرِ الْعِباراتِ بِالتَّرْتيبِ الصَّحيحِ.</p><div class="mdr-ord" data-q="${j}">${q.seq.map((s, k) => [s, k]).sort(() => Math.random() - 0.5).map(([s, k]) => `<button class="mdr-tok" data-k="${k}">${esc(s)}</button>`).join("")}</div><ol class="mdr-ordo" id="mro${j}"></ol><div class="mdr-fb" id="mf${j}"></div>`
            : `<div class="mdr-sort">${q.items.map((it, k) => `<div><span>${esc(it[0])}</span><select data-q="${j}" data-i="${k}"><option value="">—</option>${q.bins.map((b, bi) => `<option value="${bi}">${esc(b)}</option>`).join("")}</select></div>`).join("")}</div><button class="btn btn-ghost btn-small mdr-chk" data-q="${j}">تَحَقَّقْ</button><div class="mdr-fb" id="mf${j}"></div>`)}</div>`).join("")}
          <div class="mdr-score" id="mdrScore"></div>
          ${stu ? `<div class="mdr-nav"><span></span><button class="btn btn-primary" id="mdrQS">💾 أَحْفَظُ إِجاباتي</button></div>` : ""}` + nav(2, 4);
      if (part === 4) body = `<div class="mdr-card"><h3>${S.ic} بَعْدَ الْقِراءَةِ</h3><label class="mdr-lbl">${S.a.map(esc).join(" ")}</label>${ta("mdrNote", "اكْتُبْ هُنا…", mine && mine.strat_note)}</div>
          ${mine && mine.expr_graded_at ? `<div class="mdr-card mdr-fbk"><h3>🧑‍🏫 تَقْييمُ مُعَلِّمي لِتَعْبيري</h3>${rubricView(mine.expr_rubric)}${mine.expr_feedback ? `<p class="mdr-task">${esc(mine.expr_feedback)}</p>` : ""}</div>` : ""}
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
          ${bank().length ? `<h4>🏦 بَنْكُ كَلِماتي</h4><div class="mdr-gl">${bank().map((b) => `<div><b>${esc(b[0])}</b>${b[1] ? `<span>${esc(b[1])}</span>` : `<span class="muted">ابْحَثْ عَنْ مَعْناها في الْمُعْجَمِ</span>`}</div>`).join("")}</div>` : ""}
          ${mine && mine.expr_graded_at ? `<h4>🧑‍🏫 تَقْييمُ التَّعْبيرِ</h4>${rubricView(mine.expr_rubric)}${mine.expr_feedback ? `<p>${esc(mine.expr_feedback)}</p>` : ""}` : ""}
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
    const wordCard = (w, mean) => { const others = (X.gl || []).map((g) => g[1]).filter((m) => m !== mean).sort(() => Math.random() - 0.5).slice(0, 3);
      if (others.length < 2) return { key: "rw:" + mdrStem(w), lid: l.id, q: { t: "tf", p: `«${w}» مَعْناها: ${mean}`, a: true, s: `${w}: ${mean}` } };
      return { key: "rw:" + mdrStem(w), lid: l.id, q: { t: "mcq", p: `ما مَعْنى «${w}»؟ (مِنْ نَصِّ «${X.t}»)`, big: "", o: [mean].concat(others).map((t) => ({ t, i: "", ok: t === mean })), s: `${w}: ${mean}` } }; };
    const qCard = (q, j) => ({ key: "rd:" + X.id + ":" + j, lid: l.id, q: { t: "mcq", p: `«${X.t}»: ${q.q}`, big: "", o: q.o.map((t, k) => ({ t, i: "", ok: k === q.c })), s: q.o[q.c] + (q.why ? " — " + q.why : "") } });
    const mark = (j) => { const q = X.qs[j], v = A["m" + j]; if (v == null) return; const b2 = box.querySelector("#mq" + j); if (!b2) return;
      b2.querySelectorAll(".mdr-opt").forEach((b) => { const k = +b.dataset.o; b.disabled = true; b.classList.toggle("ok", k === q.c); b.classList.toggle("no", k === v && k !== q.c); });
      const f = box.querySelector("#mf" + j); f.className = "mdr-fb " + (v === q.c ? "ok" : "no"); f.innerHTML = (v === q.c ? "✅ أَحْسَنْتَ. " : "❌ الْإِجابَةُ الصَّحيحَةُ: " + esc(String(q.o[q.c]).replace(/[.。]$/, "")) + ". ") + esc(q.why || ""); };
    const score = () => { const n = M.filter(([q, j]) => A["m" + j] === q.c).length, d = M.filter(([q, j]) => A["m" + j] != null).length; const el = box.querySelector("#mdrScore"); if (el && M.length) el.innerHTML = `أَسْئِلَةُ الِاخْتِيارِ: <b><bdi dir="ltr">${n}/${M.length}</bdi></b>${d < M.length ? ` · بَقِيَ ${M.length - d}` : ""}`; return n; };
    const ordWire = (wrap, ol, items, fb, done) => { const seq = []; wrap.querySelectorAll(".mdr-tok").forEach((b) => b.onclick = () => { if (b.disabled) return; b.disabled = true; seq.push(+b.dataset.k); ol.insertAdjacentHTML("beforeend", `<li>${esc(items[+b.dataset.k])}</li>`);
      if (seq.length === items.length) { const ok = seq.every((k, i) => k === i); fb.className = "mdr-fb " + (ok ? "ok" : "no"); fb.innerHTML = ok ? "✅ تَرْتيبٌ صَحيحٌ." : "❌ التَّرْتيبُ الصَّحيحُ: " + items.map(esc).join(" ← "); if (done) done(ok); } }); };
    const wire = () => {
      if (part === 1) {
        // وضع القراءة المريح: حجم الخط، والتباعد، ومسطرة تتبع السطر
        const tx = box.querySelector(".mdr-text"); let rul = null;
        const applyP = () => { tx.style.fontSize = (1.3 * (1 + PF.fs * 0.12)).toFixed(2) + "rem"; tx.classList.toggle("mdr-wide", !!PF.sp); tx.classList.toggle("mdr-ruled", !!PF.rl);
          if (PF.rl && !rul) { rul = document.createElement("div"); rul.className = "mdr-ruler"; tx.appendChild(rul); const lh = () => parseFloat(getComputedStyle(tx).lineHeight) || 40;
            const wsR = [...tx.querySelectorAll(".mdr-w")];
            const mv = (y) => { const r = tx.getBoundingClientRect(); const h2 = lh(); let best = null, bd = 1e9;
              for (const w of wsR) { const q = w.getBoundingClientRect(), c = q.top + q.height / 2, d = Math.abs(c - y); if (d < bd) { bd = d; best = c; } if (q.top > y + h2) break; }
              const cy = best == null ? y : best; rul.style.height = h2 + "px"; rul.style.top = Math.max(0, Math.min(tx.scrollHeight - h2, cy - r.top - h2 / 2)) + "px"; };
            tx.onpointermove = (e) => mv(e.clientY); tx.onpointerdown = (e) => mv(e.clientY); const fp = tx.querySelector("p"); if (fp) mv(fp.getBoundingClientRect().top + lh() / 2); }
          if (!PF.rl && rul) { rul.remove(); rul = null; tx.onpointermove = tx.onpointerdown = null; } };
        applyP();
        box.querySelectorAll("[data-rt]").forEach((b) => b.onclick = () => { const k = b.dataset.rt;
          if (k === "fs+") PF.fs = Math.min(4, PF.fs + 1); if (k === "fs-") PF.fs = Math.max(-2, PF.fs - 1); if (k === "sp") PF.sp = PF.sp ? 0 : 1; if (k === "rl") PF.rl = PF.rl ? 0 : 1;
          if (k === "sp" || k === "rl") { b.classList.toggle("btn-primary", !!PF[k]); b.classList.toggle("btn-ghost", !PF[k]); }
          mdrPrefSet(PF); applyP(); });
        const fb = box.querySelector("#fluB"), ft = box.querySelector("#fluT"), fr = box.querySelector("#fluR"); let fs = 0, ftm = null;
        fb.onclick = () => { if (!fs) { fs = Date.now(); fb.textContent = "⏹ انْتَهَيْتُ"; fr.textContent = ""; ftm = setInterval(() => { const s = Math.floor((Date.now() - fs) / 1000); ft.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; }, 250); return; }
          clearInterval(ftm); const s = (Date.now() - fs) / 1000; fs = 0; fb.textContent = "🔁 أُعيدُ الْقِياسَ";
          if (s < 5) { fr.textContent = "الْوَقْتُ قَصيرٌ جِدًّا، أَعِدِ الْقِياسَ."; return; }
          const wpm = Math.round(X.w * 60 / s); if (wpm > 250) { fr.textContent = "قَرَأْتَ بِسُرْعَةٍ لا تُناسِبُ الْقِراءَةَ الْجَهْرِيَّةَ الْمُتَأَنِّيَةَ؛ أَعِدِ الْقِراءَةَ كُلَّها بِصَوْتٍ مَسْموعٍ وَبِفَهْمٍ."; return; } fr.innerHTML = `سُرْعَتُكَ: <b>${wpm}</b> كَلِمَةً في الدَّقيقَةِ. ${mine && mine.wpm ? `(الْمَرَّةُ السّابِقَةُ ${mine.wpm})` : ""}`;
          ACT.wpm = wpm; if (stu) { save({ p_wpm: wpm }); mine = Object.assign(mine || {}, { wpm }); } };
        // القراءة النموذجية: تظليل تقريبي يتبع تقدّم الصوت بحسب أطوال الكلمات ووقفات الترقيم
        const ab = box.querySelector("#audB");
        if (ab && audName) { const au = new Audio(mdrAudUrl(audName)); au.preload = "metadata"; const ws = [...box.querySelectorAll(".mdr-text .mdr-w")]; const tot = WW.reduce((a, b) => a + b, 0); const cum = []; WW.reduce((a, b, i) => (cum[i] = a + b), 0);
          let cur = -1; const lit = (i) => { if (i === cur) return; if (cur >= 0 && ws[cur]) ws[cur].classList.remove("lit"); cur = i; if (ws[i]) { ws[i].classList.add("lit"); ws.slice(0, i).forEach((w) => w.classList.add("past")); } };
          au.ontimeupdate = () => { if (!au.duration) return; const x = au.currentTime / au.duration * tot; let i = cum.findIndex((c) => c >= x); lit(i < 0 ? ws.length - 1 : i); };
          au.onplay = () => { ab.textContent = "⏸ أَوْقِفْ"; box.querySelector("#audR").hidden = false; }; au.onpause = () => { ab.textContent = "▶️ أَكْمِلْ"; };
          au.onended = () => { ab.textContent = "▶️ اسْتَمِعْ مَرَّةً أُخْرى"; ws.forEach((w) => w.classList.remove("lit", "past")); cur = -1; };
          au.onerror = () => { ab.disabled = true; ab.textContent = "⚠️ تَعَذَّرَ تَشْغيلُ الصَّوْتِ"; };
          ab.onclick = () => { if (au.paused) au.play(); else au.pause(); };
          box.querySelector("#audR").onclick = () => { au.currentTime = 0; ws.forEach((w) => w.classList.remove("lit", "past")); cur = -1; au.play(); };
          box.querySelector("#audS").onchange = (e) => { au.playbackRate = +e.target.value; };
          const stopA = () => { try { au.pause(); } catch (e) {} }; box.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", stopA)); }
        const af = box.querySelector("#audF"); if (af) af.onchange = async () => { const f = af.files[0]; if (!f) return; const st = box.querySelector("#audSt"); st.textContent = "جارٍ الرفع…";
          const ext = (f.name.match(/\.([a-z0-9]+)$/i) || [, "mp3"])[1].toLowerCase();
          if (audName) await sb.storage.from("reader-audio").remove(["madarij/" + audName]);
          const up = await sb.storage.from("reader-audio").upload("madarij/" + X.id + "." + ext, f, { contentType: f.type || "audio/mpeg", upsert: true });
          if (up.error) { st.textContent = "تعذّر الرفع: " + up.error.message; return; } MDR_AUD = null; toast("رُفع التسجيل"); mdrRun(box, l, u, id); };
        // نقر الكلمة: معناها وإضافتها إلى بنك كلماتي
        box.querySelectorAll(".mdr-text .mdr-w").forEach((w) => w.onclick = (e) => {
          box.querySelectorAll(".mdr-pop").forEach((x) => x.remove());
          const word = w.textContent.replace(/[،؛:.!؟?»«"()\-…]+/g, ""), gi = w.dataset.g != null ? +w.dataset.g : null, mean = gi != null ? X.gl[gi][1] : "";
          const has = bank().some((b) => mdrStem(b[0]) === mdrStem(word));
          const pop = document.createElement("div"); pop.className = "mdr-pop";
          pop.innerHTML = `<b>${esc(gi != null ? X.gl[gi][0] : word)}</b>${mean ? `<span>${esc(mean)}</span>` : `<span class="muted">لا يوجد مَعْنًى مُسَجَّلٌ؛ أَضِفْها وَابْحَثْ عَنْ مَعْناها.</span>`}
            ${stu ? `<button class="btn btn-small ${has ? "btn-ghost" : "btn-primary"}" ${has ? "disabled" : ""}>${has ? "✅ في بَنْكِ كَلِماتي" : "➕ إِلى بَنْكِ كَلِماتي"}</button>` : ""}<button class="mdr-pop-x" aria-label="إغلاق">×</button>`;
          w.after(pop); { const cw = w.offsetParent ? w.offsetParent.clientWidth : 0; pop.style.top = (w.offsetTop + w.offsetHeight + 4) + "px"; pop.style.right = Math.max(0, Math.min(cw - 330, cw - w.offsetLeft - w.offsetWidth)) + "px"; pop.style.insetInlineStart = "auto"; } pop.querySelector(".mdr-pop-x").onclick = () => pop.remove();
          const add = pop.querySelector(".btn-primary"); if (add) add.onclick = () => { const nb = bank().concat([[gi != null ? X.gl[gi][0] : word, mean]]).slice(-60); putAct({ bank: nb });
            if (mean) rvSaveMissed([wordCard(gi != null ? X.gl[gi][0] : word, mean)], false); add.disabled = true; add.textContent = mean ? "✅ أُضيفَتْ، وَتَعودُ في وِرْدِ الْمُراجَعَةِ" : "✅ أُضيفَتْ"; };
        });
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
          const f = box.querySelector("#glFb"); f.className = "mdr-fb " + (ok === X.gl.length ? "ok" : "no"); f.textContent = ok === X.gl.length ? "✅ مُطابَقَةٌ صَحيحَةٌ." : `صَحَّ ${ok} مِنْ ${X.gl.length}.`; putAct({ gl: ok });
          const wrong = [...box.querySelectorAll("select[data-gl]")].filter((s2) => !(s2.value !== "" && +s2.value === +s2.dataset.gl)).map((s2) => X.gl[+s2.dataset.gl]);
          if (stu && wrong.length) { rvSaveMissed(wrong.map((g) => wordCard(g[0], g[1])), false); f.innerHTML += rvAddedNote(false); } };
      }
      if (part === 3) {
        M.forEach(([q, j]) => mark(j)); score();
        box.querySelectorAll("select[data-pkq]").forEach((s) => s.onchange = async () => { const j = +s.dataset.pkq, v = s.value;
          const { error } = await sb.from("reading_tag_fix").upsert({ text_id: X.id, q_index: j, pk: v, updated_by: state.session.user.id, updated_at: new Date().toISOString() }, { onConflict: "text_id,q_index" });
          if (error) { toast("تعذّر الحفظ: " + error.message); return; } X.qs[j].pk = v; keep(); toast("عُدِّل مستوى السؤال لكل الطلاب"); draw(); });
        box.querySelectorAll(".mdr-opt").forEach((b) => b.onclick = () => { const j = +b.dataset.q; if (A["m" + j] != null) return; A["m" + j] = +b.dataset.o; mark(j); score(); });
        box.querySelectorAll(".mdr-ord[data-q]").forEach((w) => { const j = +w.dataset.q; ordWire(w, box.querySelector("#mro" + j), X.qs[j].seq, box.querySelector("#mf" + j)); });
        box.querySelectorAll(".mdr-chk").forEach((b) => b.onclick = () => { const j = +b.dataset.q, q = X.qs[j]; let ok = 0; box.querySelectorAll(`select[data-q="${j}"]`).forEach((s) => { const it = q.items[+s.dataset.i]; const g = s.value === "" ? -1 : +s.value; s.classList.toggle("ok", g === it[1]); s.classList.toggle("no", g !== it[1]); if (g === it[1]) ok++; });
          const f = box.querySelector("#mf" + j); f.className = "mdr-fb " + (ok === q.items.length ? "ok" : "no"); f.textContent = ok === q.items.length ? "✅ تَصْنيفٌ صَحيحٌ." : `صَحَّ ${ok} مِنْ ${q.items.length}، راجِعِ الْمُلَوَّنَ بِالْأَحْمَرِ.`; });
        const qs = box.querySelector("#mdrQS"); if (qs) qs.onclick = async () => { keep(); if (M.some(([q, j]) => A["m" + j] == null)) { toast("أَجِبْ عَنْ كُلِّ أَسْئِلَةِ الِاخْتِيارِ أَوَّلًا"); return; }
          qs.disabled = true; const sk = skillScore(); const r = await save({ p_answers: A, p_score: score(), p_max: M.length, p_skills: sk }); qs.disabled = false;
          if (r && r.error) toast("تعذّر الحفظ: " + r.error.message); else { mine = Object.assign(mine || {}, { score: score(), max_score: M.length, quiz_at: new Date().toISOString(), skills: sk });
            const miss = M.filter(([q, j]) => A["m" + j] !== q.c).map(([q, j]) => qCard(q, j)); rvSaveMissed(miss, false);
            const el = box.querySelector("#mdrScore"); if (el) el.innerHTML += rvAddedNote(false);
            toast("حُفِظَتْ إِجاباتُكَ، وَتَصِلُ إِلى مُعَلِّمِكَ"); } };
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
            return `<tr><td>${esc(s.name)}</td><td>${r && r.quiz_at ? `${g} <bdi dir="ltr">${r.score}/${r.max_score}</bdi>` : "—"}</td><td>${r && r.wpm ? r.wpm : "—"}</td><td>${r && r.pre ? esc(r.pre).slice(0, 120) : "—"}</td><td>${r && r.expression ? `<details class="mdr-grade" data-st="${s.id}"><summary>${(r.expression.match(/\S+/g) || []).length} كلمة ${r.expr_graded_at ? "· ✅ قُيِّم" : "· ✍️ للتقييم"}</summary><p style="white-space:pre-wrap">${esc(r.expression)}</p>${r.strat_note ? `<p class="muted">بعد القراءة: ${esc(r.strat_note)}</p>` : ""}
              <div class="mdr-rbg">${MDR_RB.map((c, i) => `<label>${c[0]} ${c[1]}<select data-rb="${i}"><option value="0">—</option>${[1, 2, 3, 4].map((k) => `<option value="${k}" ${r.expr_rubric && +r.expr_rubric[i] === k ? "selected" : ""}>${k} · ${MDR_LV[k]}</option>`).join("")}</select></label>`).join("")}</div>
              <textarea class="mdr-ta" rows="2" placeholder="ملاحظتك للطالب…">${esc(r.expr_feedback || "")}</textarea><button class="btn btn-primary btn-small mdr-gsave">💾 حفظ التقييم وإرساله للطالب</button></details>` : "—"}</td></tr>`; }).join("") || `<tr><td colspan="5">لا يوجد طلاب في هذا الفصل</td></tr>`}
          </tbody></table></div><p class="muted">القراءات الجهرية تصلك في صفحة «التسميع» بعنوان «قراءة جهرية».</p></div>`;
        rep.querySelectorAll("[data-cls]").forEach((b) => b.onclick = () => { cur = b.dataset.cls; drawR(); });
        rep.querySelectorAll(".mdr-grade").forEach((d) => { const b = d.querySelector(".mdr-gsave"); if (b) b.onclick = async () => {
          const rb = [...d.querySelectorAll("select[data-rb]")].map((x) => +x.value); if (rb.some((v) => !v)) { toast("اختر مستوى لكل معيار"); return; }
          b.disabled = true; const { error } = await sb.rpc("reading_grade", { p_lesson: l.id, p_student: d.dataset.st, p_rubric: rb, p_note: d.querySelector("textarea").value.trim() || null }); b.disabled = false;
          if (error) toast("تعذّر الحفظ: " + error.message); else { toast("حُفظ التقييم ووصل للطالب"); d.querySelector("summary").innerHTML = d.querySelector("summary").innerHTML.replace("✍️ للتقييم", "✅ قُيِّم"); } }; });
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
