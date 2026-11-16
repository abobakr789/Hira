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
      if (ids.length) { const { data } = await sb.from("lesson_reading").select("lesson_id, score, max_score, quiz_at, expr_at, wpm, wcpm, accuracy, skills, act").eq("student_id", state.session.user.id).in("lesson_id", ids); (data || []).forEach((r) => { mine[r.lesson_id] = r; }); }
    }
    const target = await mdrTarget(year);
    const done = all.filter((x) => x.lesson && mine[x.lesson.id] && mine[x.lesson.id].quiz_at);
    const sk = { ret: [0, 0], inf: [0, 0], int: [0, 0], eva: [0, 0] };
    done.forEach((x) => { const s = mine[x.lesson.id].skills || {}; Object.keys(sk).forEach((k) => { if (s[k]) { sk[k][0] += s[k][0]; sk[k][1] += s[k][1]; } }); });
    const wpms = done.map((x) => { const r = mine[x.lesson.id]; return r.wcpm != null ? r.wcpm : r.wpm; }).filter(Boolean);
    const passport = isStudent() && state.session ? `<div class="mdr-pass"><div class="mdr-pass-h"><span>📗</span><div><b>جَوازُ الْقِراءَةِ</b><small>الصَّفُّ ${MDR_GN[year]} · ${all.length} نَصًّا مِنْ كِتابِ «مَدارِجِ الْقِراءَةِ»</small></div></div>
        <div class="mdr-pass-s"><div><b><bdi dir="ltr">${done.length}/${all.length}</bdi></b><small>نُصوصٌ أَنْجَزْتُها</small>${mdrBar(done.length, all.length)}</div>
          <div><b>${wpms.length ? wpms[wpms.length - 1] : "—"}</b><small>كَلِمَةً في الدَّقيقَةِ (آخِرُ قِياسٍ)</small></div>
          ${Object.keys(sk).map((k) => `<div><b>${sk[k][1] ? Math.round(sk[k][0] * 100 / sk[k][1]) + "%" : "—"}</b><small>${MDR_SK[k][0]} ${MDR_SK[k][1]}</small>${mdrBar(sk[k][0], sk[k][1])}</div>`).join("")}</div>
        ${mdrCurve(all.map((x, i) => { const r = x.lesson && mine[x.lesson.id]; return [i + 1, r && (r.wcpm != null ? r.wcpm : r.wpm), x.t, r && r.wcpm != null]; }).filter((p) => p[1]), target, all.length)}
        ${mdrLeague(all, mine, year, term)}
        <div id="mdrCB"></div>
        <a class="mdr-rlog-link" href="#/readlog"><span>📚</span><div><b>سِجِلُّ الْقِراءَةِ الْحُرَّةِ</b><small>اقْرَأْ كُتُبًا مِنِ اخْتِيارِكَ وَلَخِّصْها، وَامْلَأْ جَوازاتِ التَّحَدّي الْخَمْسَةَ (50 كِتابًا)</small></div><i>←</i></a>
        <a class="mdr-rlog-link rb-link" href="#/rbench"><span>📏</span><div><b>قِياسُ الْقِراءَةِ (${MDR_RND[mdrRound()][1]})</b><small>اقْرَأْ نَصَّ الْقِياسِ بِصَوْتٍ مَسْموعٍ، وَأَجِبْ عَنْ أَسْئِلَتِهِ؛ لِتَرى نُمُوَّكَ خِلالَ السَّنَةِ</small></div><i>←</i></a></div>` : "";
    const staffBox = isStaff() && state.session ? `<div class="mdr-staff" id="mdrStaff"><div class="loading">جارٍ تحميل خريطة الفصل…</div></div>` : "";
    if (staffBox) mdrDefer("mdrStaff", (el) => mdrStaffPanel(el, year, all, target));
    if (passport) mdrDefer("mdrCB", (el) => mdrClassBoard(el, year));
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

  // منافسة الفصول: متوسط نقاط الطالب في كل فصل من الصف نفسه في المدرسة (مجاميع فقط بلا أسماء)
  async function mdrClassBoard(el, year) {
    if (!el) return; const { data, error } = await sb.rpc("reading_class_board", { p_year: +year });
    if (error || !data || data.length < 2) { el.innerHTML = ""; return; }
    const top = Math.max(...data.map((c) => +c.avg_points || 0), 1), md = ["🥇", "🥈", "🥉"];
    el.innerHTML = `<div class="mdr-cb"><h4>🏆 مُنافَسَةُ الْفُصولِ · الصَّفُّ ${MDR_GN[year]}</h4>
      <p class="muted">الترتيب بمتوسط نقاط الطالب في كل فصل (نصوص مدارج + 15 نقطة لكل كتاب حر معتمد)، فيتساوى الفصل الصغير والكبير.</p>
      ${data.map((c, i) => `<div class="mdr-cb-r ${c.mine ? "me" : ""}"><span class="mdr-cb-n">${md[i] || i + 1}</span><b>${esc(c.class_name)}${c.mine ? " <small>(فصلك)</small>" : ""}</b>
        <div class="mdr-cb-bar"><i style="width:${Math.round((+c.avg_points || 0) * 100 / top)}%"></i></div><span class="mdr-cb-v"><b>${(+c.avg_points || 0).toFixed(1)}</b> <small>نقطة/طالب · ${c.texts} نصًّا · ${c.books} كتابًا · نشط ${c.active}/${c.students}</small></span></div>`).join("")}</div>`;
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
        <path d="${line}" class="ln"/>${pts.map((p) => `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="${p[3] ? 6 : 5}" class="pt${p[3] ? " v" : ""}"><title>النص ${p[0]} «${esc(p[2])}»: ${p[1]} ${p[3] ? "كلمة صحيحة/دقيقة (قاسها المعلم)" : "كلمة/دقيقة (قياسي)"}</title></circle>`).join("")}
      </svg>${pts.some((p) => p[3]) ? `<small class="muted">● النقطة الممتلئة: قياس المعلم من تسجيلك · ○ الفارغة: قياسك أنت</small>` : ""}
      <p class="muted">${pts.length > 1 ? (last >= first ? `تَقَدَّمْتَ مِنْ <b>${first}</b> إِلى <b>${last}</b> كَلِمَةً في الدَّقيقَةِ. ` : `آخِرُ قِياسٍ <b>${last}</b> (كانَ <b>${first}</b>)؛ اقْرَأْ بِتَأَنٍّ وَفَهْمٍ، فَالسُّرْعَةُ وَحْدَها لَيْسَتْ هَدَفًا. `) : ""}${target ? (last >= target ? "🎯 بَلَغْتَ هَدَفَ مَدْرَسَتِكَ." : `بَقِيَ <b>${target - last}</b> كَلِمَةً لِتَبْلُغَ هَدَفَ مَدْرَسَتِكَ (${target}).`) : ""}</p></div>`;
  }
  // دوري القراءة: نقاط وأوسمة وشهادة الفصل
  const MDR_BD = [["🌱", "قارِئٌ ناشِئٌ"], ["📘", "قارِئٌ نَشيطٌ"], ["⭐", "قارِئٌ مُتَمَكِّنٌ"], ["🏅", "قارِئٌ مُتَمَيِّزٌ"], ["🏆", "سَفيرُ الْقِراءَةِ"], ["👑", "فارِسُ الْقِراءَةِ"]];
  const mdrPts = (r) => !r || !r.quiz_at ? 0 : 10 + (r.score === r.max_score && r.max_score ? 5 : 0) + (r.expr_at ? 5 : 0) + (r.wpm ? 2 : 0) + (r.act && r.act.rrN ? 3 : 0);
  function mdrLeague(all, mine, year, term) {
    const rs = all.map((x) => x.lesson && mine[x.lesson.id]).filter((r) => r && r.quiz_at);
    const pts = rs.reduce((a, r) => a + mdrPts(r), 0), nb = Math.min(Math.floor(rs.length / 5), MDR_BD.length);
    const tt = all.filter((x) => x.term === term), td = tt.filter((x) => x.lesson && mine[x.lesson.id] && mine[x.lesson.id].quiz_at).length;
    const nx = nb < MDR_BD.length ? 5 * (nb + 1) - rs.length : 0;
    return `<div class="mdr-league"><div class="mdr-lg-h"><h4>🏁 دَوْري الْقِراءَةِ</h4><b class="mdr-pts">${pts} <small>نُقْطَةً</small></b></div>
      <p class="muted">كُلُّ نَصٍّ تُنْجِزُهُ: 10 نِقاطٍ · الْعَلامَةُ الْكامِلَةُ +5 · إِرْسالُ التَّعْبيرِ +5 · قِياسُ الطَّلاقَةِ +2 · جَوْلَةُ الْقِراءَةِ الْمُتَكَرِّرَةِ +3. وِسامٌ جَديدٌ كُلَّ 5 نُصوصٍ.</p>
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
      const { data: rr } = SS.length && ids.length ? await sb.from("lesson_reading").select("student_id, lesson_id, score, max_score, quiz_at, expr_at, wpm, wcpm, accuracy, skills, act").in("lesson_id", ids).in("student_id", SS.map((s) => s.id)) : { data: [] };
      const B = {}; (rr || []).forEach((r) => { (B[r.student_id] = B[r.student_id] || []).push(r); });
      const KS = Object.keys(MDR_SK), groups = {}; KS.forEach((k) => { groups[k] = []; });
      const rows = SS.map((s) => { const rs = (B[s.id] || []).filter((r) => r.quiz_at); const sk = {}; KS.forEach((k) => { sk[k] = [0, 0]; });
        rs.forEach((r) => KS.forEach((k) => { const v = (r.skills || {})[k]; if (v) { sk[k][0] += v[0]; sk[k][1] += v[1]; } }));
        const sc = rs.reduce((a, r) => [a[0] + r.score, a[1] + r.max_score], [0, 0]); const pc = (a) => a[1] ? Math.round(a[0] * 100 / a[1]) : null;
        const wps = (B[s.id] || []).map((r) => r.wcpm != null ? r.wcpm : r.wpm).filter(Boolean);
        const accs = (B[s.id] || []).map((r) => r.accuracy).filter((v) => v != null); const acc = accs.length ? Math.round(accs.reduce((a, b) => a + b, 0) / accs.length) : null; const wpm = wps.length ? Math.round(wps.reduce((a, b) => a + b, 0) / wps.length) : null;
        const weak = KS.filter((k) => sk[k][1] >= 2).sort((a, b) => pc(sk[a]) - pc(sk[b]))[0]; if (weak && pc(sk[weak]) < 70) groups[weak].push(s.name);
        return { s, n: rs.length, c: pc(sc), sk: KS.map((k) => pc(sk[k])), wpm, acc, weak: weak && pc(sk[weak]) < 70 ? weak : null, pts: rs.reduce((a, r) => a + mdrPts(r), 0) }; });
      const avgW = rows.map((r) => r.wpm).filter(Boolean);
      el.innerHTML = `<div class="mdr-card"><div class="mdr-lg-h"><h3>🗺️ خَريطَةُ الْفَصْلِ الْقِرائِيَّةُ</h3><span><a class="btn btn-ghost btn-small" href="#/rbench">📏 قياس القراءة (بداية/منتصف/نهاية السنة)</a> <a class="btn btn-ghost btn-small" href="#/readlog">📚 سجل القراءة الحرة واعتماد الكتب</a></span></div>${tgtH()}
        ${cls.length > 1 ? `<div class="rd-cls">${cls.map((c) => `<button class="btn btn-small ${c.id === cur ? "btn-primary" : "btn-ghost"}" data-cls="${c.id}">${esc(c.name)}</button>`).join("")}</div>` : ""}
        <div class="lp-stats"><div><b>${SS.length}</b><small>طالبًا</small></div><div><b>${rows.length ? Math.round(rows.reduce((a, r) => a + r.n, 0) / rows.length * 10) / 10 : "—"}</b><small>متوسط النصوص المنجزة من ${all.length}</small></div><div><b>${avgW.length ? Math.round(avgW.reduce((a, b) => a + b, 0) / avgW.length) : "—"}</b><small>متوسط الطلاقة${target ? ` · الهدف ${target}` : ""}</small></div>${target ? `<div><b><bdi dir="ltr">${rows.filter((r) => r.wpm && r.wpm >= target).length}/${SS.length}</bdi></b><small>بلغوا الهدف</small></div>` : ""}</div>
        <div class="lp-tw"><table class="lp-tbl mdr-heat"><thead><tr><th>الطالب</th><th>النصوص</th><th>الفهم</th>${KS.map((k) => `<th title="${MDR_SK[k][1]}">${MDR_SK[k][0]} ${{ ret: "الاسترجاع", inf: "الاستنتاج", int: "التفسير", eva: "التقويم" }[k]}</th>`).join("")}<th>الطلاقة</th><th>دقة القراءة</th><th>النقاط</th><th>يحتاج دعمًا في</th></tr></thead><tbody>
        ${rows.map((r) => `<tr><td><a href="#/readreport/${r.s.id}" title="تقرير الطالب">${esc(r.s.name)}</a></td><td><bdi dir="ltr">${r.n}/${all.length}</bdi></td><td ${col(r.c)}>${r.c == null ? "—" : r.c + "%"}</td>${r.sk.map((p) => `<td ${col(p)}>${p == null ? "—" : p + "%"}</td>`).join("")}<td ${target && r.wpm ? col(Math.min(100, r.wpm * 100 / target)) : ""}>${r.wpm || "—"}</td><td ${r.acc != null ? col(Math.max(0, (r.acc - 85) * 100 / 15)) : ""} title="${r.acc != null ? mdrLvl(r.acc)[1] : ""}">${r.acc != null ? r.acc + "%" : "—"}</td><td>${r.pts}</td><td>${r.weak ? MDR_SK[r.weak][0] + " " + MDR_SK[r.weak][1] : "—"}</td></tr>`).join("") || `<tr><td colspan="${KS.length + 7}">لا يوجد طلاب في هذا الفصل</td></tr>`}
        </tbody></table></div>
        <h4>👥 مَجْموعاتُ الدَّعْمِ الْمُقْتَرَحَةُ</h4><p class="muted">الطالب في مجموعة أضعف مستوى له (أقل من 70% بعد سؤالين على الأقل).</p>
        <div class="mdr-groups">${KS.map((k) => `<div><b>${MDR_SK[k][0]} ${MDR_SK[k][1]} <small>(${groups[k].length})</small></b><span>${groups[k].length ? groups[k].map(esc).join("، ") : "—"}</span></div>`).join("")}</div><div id="mdrCBs"></div></div>`;
      mdrClassBoard(el.querySelector("#mdrCBs"), year);
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
      ${acc === "ok" ? `<div class="mdr-tools">${isStaff() && state.session ? `<button class="btn btn-primary btn-small" id="mdrHw">📌 كلِّف الفصل بهذا النص واجبًا</button><button class="btn btn-ghost btn-small" id="mdrBd">📺 اعرض على السبورة</button>` : ""}<button class="btn btn-ghost btn-small" id="mdrPrint">🖨️ حزمة الطباعة</button></div>` : ""}
    </div></section>
    <section class="wrap panel" id="panel"><div id="rdgBox"></div>
      <div class="mdr-pn">${nav(idx[pos - 1], "→")}${nav(idx[pos + 1], "←")}</div></section>`);
    const box = document.getElementById("rdgBox");
    if (acc !== "ok") { box.innerHTML = `<div class="paywall-box form-card"><strong>${lockIcon} ${state.session ? "هذا النص مقفل الآن" : "اشترك أولًا"}</strong><p>${state.session ? "يفتحه معلمك مع درسه، أو عند تفعيل اشتراك الصف." : "النص الأول من كل صف مجاني للتجربة، وبقية النصوص للمشتركين."}</p><a class="btn btn-primary" href="${listHref}">العودة إلى قائمة النصوص</a></div>`; return; }
    const hw = document.getElementById("mdrHw"); if (hw) hw.onclick = () => hwDialog(l, u, false, false, true, it.t);
    const bd = document.getElementById("mdrBd"); if (bd) bd.onclick = async () => { const X = await mdrGet(id); try { const FX = await mdrTagFix(id); X.qs.forEach((q, j) => { if (FX[j]) q.pk = FX[j]; }); } catch (e) {} mdrBoard(X); };
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
    const auds = await mdrAudList(); const audName = [...auds].find((n) => n.replace(/\.[^.]+$/, "") === X.id && !/\.json$/.test(n)) || null;
    let TIM = null; if (audName && auds.has(X.id + ".json")) { try { TIM = await (await fetch(mdrAudUrl(X.id + ".json") + "?v=" + Date.now())).json(); } catch (e) {} }
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
            <div class="mdr-rec"><button class="btn btn-dawn" id="fluB">▶️ أَبْدَأُ الْقِراءَةَ</button><span id="fluT" class="mdr-big">0:00</span><span id="fluR"></span></div>
            <div class="mdr-rr" id="rrBox"></div>
            ${mine && mine.wcpm != null ? `<p class="mdr-fb ok">🧑‍🏫 قاسَ مُعَلِّمُكَ قِراءَتَكَ الْمُسَجَّلَةَ: <b>${mine.wcpm}</b> كَلِمَةً صَحيحَةً في الدَّقيقَةِ، بِدِقَّةِ <b>${mine.accuracy}%</b>. ${mdrLvl(mine.accuracy)[0]}</p>` : `<p class="muted">💡 سَجِّلْ قِراءَتَكَ الْجَهْرِيَّةَ في الْأَسْفَلِ، فَيَقيسُها مُعَلِّمُكَ بِدِقَّةٍ: كَمْ كَلِمَةً صَحيحَةً تَقْرَأُ في الدَّقيقَةِ.</p>`}</div>
          ${audName || isSuper() ? `<div class="mdr-card mdr-model-r"><h3>🎧 الْقِراءَةُ النَّموذَجِيَّةُ</h3>${audName ? `<p class="muted">اسْتَمِعْ وَتابِعِ الْكَلِماتِ الْمُضاءَةَ بِعَيْنِكَ، ثُمَّ اقْرَأْ أَنْتَ بِالطَّريقَةِ نَفْسِها.</p><div class="mdr-rec"><button class="btn btn-primary" id="audB">▶️ اسْتَمِعْ</button><button class="btn btn-ghost btn-small" id="audR" hidden>↻ مِنَ الْبِدايَةِ</button><select id="audS" class="mdr-speed"><option value="0.8">0.8×</option><option value="1" selected>1×</option><option value="1.2">1.2×</option></select></div>` : `<p class="muted">لَمْ يُرْفَعْ تَسْجيلُ هذا النَّصِّ بَعْدُ.</p>`}
            ${isSuper() ? `<div class="mdr-up"><button class="btn btn-primary btn-small" id="audStu">🎙️ أستوديو التسجيل</button><label class="btn btn-ghost btn-small">⬆️ ${audName ? "اسْتَبْدِلِ" : "ارْفَعِ"} ملفًّا (mp3/m4a)<input type="file" accept="audio/*" id="audF" hidden></label><span class="muted" id="audSt">${audName ? (TIM ? "⏱️ التظليل بتوقيت دقيق" : "⏱️ التظليل تقريبي: زامِنه من الأستوديو") : ""}</span></div>` : ""}</div>` : ""}
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
            <div><b>${(mine && mine.wpm) || a.wpm || "—"}</b><small>كَلِمَةً في الدَّقيقَةِ (قِياسي)</small></div>
            ${mine && mine.wcpm != null ? `<div><b>✔ ${mine.wcpm}</b><small>كَلِمَةً صَحيحَةً في الدَّقيقَةِ (قاسَها مُعَلِّمي) · الدِّقَّةُ ${mine.accuracy}%</small></div>` : ""}
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
          ACT.wpm = wpm; if (stu) { save({ p_wpm: wpm }); mine = Object.assign(mine || {}, { wpm }); }
          const rr = (ACT.rr || []).length >= 3 ? [] : (ACT.rr || []).slice(); rr.push(wpm); const o = { rr };
          if (rr.length === 3) { o.rrN = (ACT.rrN || 0) + 1; o.rrG = rr[2] - rr[0]; } putAct(o); rrDraw(); };
        // القراءة المتكررة: ثلاث قراءات للنص نفسه، وفي كل مرة أوضح وأسلس
        const rrDraw = () => { const el = box.querySelector("#rrBox"); if (!el) return; const rr = ACT.rr || [], mx = Math.max(...rr, 1);
          const gain = rr.length >= 2 && rr[0] ? Math.round((rr[rr.length - 1] - rr[0]) * 100 / rr[0]) : null;
          el.innerHTML = `<h4>🔁 الْقِراءَةُ الْمُتَكَرِّرَةُ ${ACT.rrN ? `<small class="muted">· أَتْمَمْتَ ${ACT.rrN} ${ACT.rrN === 1 ? "جَوْلَةً" : "جَوْلاتٍ"}</small>` : ""}</h4>
            <p class="muted">اقْرَأِ النَّصَّ ثَلاثَ مَرّاتٍ، وَقِسْ كُلَّ مَرَّةٍ؛ وَفي كُلِّ قِراءَةٍ اجْعَلْ صَوْتَكَ أَوْضَحَ، وَوَقَفاتِكَ أَدَقَّ.</p>
            <div class="mdr-rr-bars">${[0, 1, 2].map((i) => `<div class="${rr[i] ? "on" : ""}"><i style="height:${rr[i] ? Math.max(10, Math.round(rr[i] * 80 / mx)) : 6}px"></i><b>${rr[i] || "—"}</b><small>الْقِراءَةُ ${["الْأولى", "الثّانِيَةُ", "الثّالِثَةُ"][i]}</small></div>`).join("")}</div>
            ${rr.length === 3 ? `<p class="mdr-fb ${gain > 0 ? "ok" : ""}">${gain > 0 ? `🎉 تَحَسَّنَتْ طَلاقَتُكَ بِنِسْبَةِ <b>${gain}%</b> مِنَ الْقِراءَةِ الْأولى إِلى الثّالِثَةِ.` : "أَحْسَنْتَ الْمُثابَرَةَ. رَكِّزْ في الْجَوْلَةِ الْقادِمَةِ عَلى الْكَلِماتِ الَّتي تَتَوَقَّفُ عِنْدَها."} الْقِياسُ التّالي يَبْدَأُ جَوْلَةً جَديدَةً.</p>`
              : rr.length ? `<p class="muted">بَقِيَتْ ${3 - rr.length === 1 ? "قِراءَةٌ واحِدَةٌ" : "قِراءَتانِ"}${gain != null ? ` · ${gain >= 0 ? "+" : ""}${gain}% حَتّى الْآنَ` : ""}.</p>` : ""}`; };
        rrDraw();
        // القراءة النموذجية: تظليل تقريبي يتبع تقدّم الصوت بحسب أطوال الكلمات ووقفات الترقيم
        const ab = box.querySelector("#audB");
        if (ab && audName) { const au = new Audio(mdrAudUrl(audName)); au.preload = "metadata"; const ws = [...box.querySelectorAll(".mdr-text .mdr-w")]; const tot = WW.reduce((a, b) => a + b, 0); const cum = []; WW.reduce((a, b, i) => (cum[i] = a + b), 0);
          let cur = -1; const lit = (i) => { if (i === cur) return; if (cur >= 0 && ws[cur]) ws[cur].classList.remove("lit"); cur = i; if (ws[i]) { ws[i].classList.add("lit"); ws.slice(0, i).forEach((w) => w.classList.add("past")); } };
          const WT = TIM ? mdrWordTimes(TIM, WW) : null;
          au.ontimeupdate = () => { if (!au.duration) return; if (WT) { const t = au.currentTime; let i = 0; while (i < WT.length - 1 && WT[i + 1] <= t) i++; lit(i); return; } const x = au.currentTime / au.duration * tot; let i = cum.findIndex((c) => c >= x); lit(i < 0 ? ws.length - 1 : i); };
          au.onplay = () => { ab.textContent = "⏸ أَوْقِفْ"; box.querySelector("#audR").hidden = false; }; au.onpause = () => { ab.textContent = "▶️ أَكْمِلْ"; };
          au.onended = () => { ab.textContent = "▶️ اسْتَمِعْ مَرَّةً أُخْرى"; ws.forEach((w) => w.classList.remove("lit", "past")); cur = -1; };
          au.onerror = () => { ab.disabled = true; ab.textContent = "⚠️ تَعَذَّرَ تَشْغيلُ الصَّوْتِ"; };
          ab.onclick = () => { if (au.paused) au.play(); else au.pause(); };
          box.querySelector("#audR").onclick = () => { au.currentTime = 0; ws.forEach((w) => w.classList.remove("lit", "past")); cur = -1; au.play(); };
          box.querySelector("#audS").onchange = (e) => { au.playbackRate = +e.target.value; };
          const stopA = () => { try { au.pause(); } catch (e) {} }; box.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", stopA)); }
        const asb = box.querySelector("#audStu"); if (asb) asb.onclick = () => mdrStudio(X, WW, audName, () => { MDR_AUD = null; mdrRun(box, l, u, id); });
        const af = box.querySelector("#audF"); if (af) af.onchange = async () => { const f = af.files[0]; if (!f) return; const st = box.querySelector("#audSt"); st.textContent = "جارٍ الرفع…";
          const ext = (f.name.match(/\.([a-z0-9]+)$/i) || [, "mp3"])[1].toLowerCase();
          if (audName) await sb.storage.from("reader-audio").remove(["madarij/" + audName, "madarij/" + X.id + ".json"]);
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
        const { data: recs } = SS.length ? await sb.from("recitations").select("id, student_id, audio_path, duration_sec, created_at").eq("lesson_id", l.id).in("student_id", SS.map((s) => s.id)).order("created_at", { ascending: false }) : { data: [] };
        const REC = {}; (recs || []).forEach((x) => { if (!REC[x.student_id]) REC[x.student_id] = x; });
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
            return `<tr><td>${esc(s.name)}</td><td>${r && r.quiz_at ? `${g} <bdi dir="ltr">${r.score}/${r.max_score}</bdi>` : "—"}</td><td>${r && r.wcpm != null ? `<b title="كلمات صحيحة في الدقيقة، قاسها المعلم">✔ ${r.wcpm}</b> <small>(${r.accuracy}%)</small>` : r && r.wpm ? `${r.wpm} <small class="muted">ذاتي</small>` : "—"}${REC[s.id] ? `<br><button class="btn btn-ghost btn-small mdr-flu-b" data-st="${s.id}">🎧 ${r && r.wcpm != null ? "أعِد القياس" : "قِس من التسجيل"}</button>` : ""}</td><td>${r && r.pre ? esc(r.pre).slice(0, 120) : "—"}</td><td>${r && r.expression ? `<details class="mdr-grade" data-st="${s.id}"><summary>${(r.expression.match(/\S+/g) || []).length} كلمة ${r.expr_graded_at ? "· ✅ قُيِّم" : "· ✍️ للتقييم"}</summary><p style="white-space:pre-wrap">${esc(r.expression)}</p>${r.strat_note ? `<p class="muted">بعد القراءة: ${esc(r.strat_note)}</p>` : ""}
              <div class="mdr-rbg">${MDR_RB.map((c, i) => `<label>${c[0]} ${c[1]}<select data-rb="${i}"><option value="0">—</option>${[1, 2, 3, 4].map((k) => `<option value="${k}" ${r.expr_rubric && +r.expr_rubric[i] === k ? "selected" : ""}>${k} · ${MDR_LV[k]}</option>`).join("")}</select></label>`).join("")}</div>
              <textarea class="mdr-ta" rows="2" placeholder="ملاحظتك للطالب…">${esc(r.expr_feedback || "")}</textarea><button class="btn btn-primary btn-small mdr-gsave">💾 حفظ التقييم وإرساله للطالب</button></details>` : "—"}</td></tr>`; }).join("") || `<tr><td colspan="5">لا يوجد طلاب في هذا الفصل</td></tr>`}
          </tbody></table></div><p class="muted">القراءات الجهرية تصلك في صفحة «التسميع» بعنوان «قراءة جهرية».</p></div>`;
        rep.querySelectorAll("[data-cls]").forEach((b) => b.onclick = () => { cur = b.dataset.cls; drawR(); });
        rep.querySelectorAll(".mdr-flu-b").forEach((b) => b.onclick = () => { const s = SS.find((x) => x.id === b.dataset.st); mdrFluDlg(X, l, s, REC[s.id], R[s.id], drawR); });
        rep.querySelectorAll(".mdr-grade").forEach((d) => { const b = d.querySelector(".mdr-gsave"); if (b) b.onclick = async () => {
          const rb = [...d.querySelectorAll("select[data-rb]")].map((x) => +x.value); if (rb.some((v) => !v)) { toast("اختر مستوى لكل معيار"); return; }
          b.disabled = true; const { error } = await sb.rpc("reading_grade", { p_lesson: l.id, p_student: d.dataset.st, p_rubric: rb, p_note: d.querySelector("textarea").value.trim() || null }); b.disabled = false;
          if (error) toast("تعذّر الحفظ: " + error.message); else { toast("حُفظ التقييم ووصل للطالب"); d.querySelector("summary").innerHTML = d.querySelector("summary").innerHTML.replace("✍️ للتقييم", "✅ قُيِّم"); } }; });
      };
      drawR();
    };
    draw();
  }

  // ---------- ورشة الامتحان لمؤهّلات العربية (IGCSE/GCSE/A Level): أين في الامتحان ← المهارة ← مثال محلول ← تدريب ← سؤال بوقت ← أخطاء شائعة ----------
  let EWS_IDX = null; const EWS = {};
  async function ewsIdx() { if (EWS_IDX) return EWS_IDX; try { EWS_IDX = await (await fetch("art/exam/index.json")).json(); } catch (e) { EWS_IDX = []; } return EWS_IDX; }
  async function ewsGet(code) { if (!EWS[code]) EWS[code] = await (await fetch("art/exam/" + code + ".json")).json(); return EWS[code]; }
  const ewsWc = (s) => (String(s || "").trim().match(/\S+/g) || []).length;
  // فقرة تبدأ بـ«§ » عنوانُ نصٍّ داخل السؤال (مثل س9: نصّان)
  // تمييز العدد: 1 درجة، 2 درجتان، 3–10 درجات، 11 فما فوق درجة
  function ewsDeg(n) { return n === 1 ? "درجة واحدة" : n === 2 ? "درجتان" : `${n} ${n >= 3 && n <= 10 ? "درجات" : "درجة"}`; }
  // جدولان لسؤال واحد (الكتابة: المحتوى والتواصل + اللغة): D.grids = [{t, max, bands}]
  function ewsGrSum(D, gb, gs) { return D.grids.map((g, i) => `${g.t} ${gs && gs[i] != null ? gs[i] : "?"}/${g.max}`).join(" · "); }
  function ewsP(p, e) { return p.startsWith("§ ") ? `<h5 class="ews-th">${e(p.slice(2))}</h5>` : `<p>${e(p)}</p>`; }
  async function ewsRun(box, l, u) {
    const D = await ewsGet(l.code); const W = D.where; const LV = D.type === "levels", GR = LV && !!D.grids, IT = D.type === "items", WL = D.wlim || (LV || IT ? null : [100, 150]);
    const ansArr = (a) => { try { const v = JSON.parse(a || "[]"); return Array.isArray(v) ? v : [a]; } catch (e) { return [a || ""]; } };
    const stu = isStudent() && state.session && !state.viewAs, me = stu ? state.session.user.id : null;
    let mine = null; if (stu) { const { data } = await sb.from("exam_ws").select("*").eq("lesson_id", l.id).eq("student_id", me).maybeSingle(); mine = data; }
    const save = async (o) => { if (!stu) return null; const { error } = await sb.rpc("ews_save", Object.assign({ p_lesson: l.id, p_answer: null, p_words: null, p_seconds: null, p_drills: null, p_self: null, p_self_score: null, p_max: null }, o)); if (error) toast("تعذّر الحفظ: " + error.message); return error; };
    const P = [["📍", "أين في الامتحان؟"], ["🧠", "المهارة"], ["📝", "مثال محلول"], ["🏋️", "تدريب موجَّه"], ["⏱️", "سؤال الامتحان"], ["⚠️", "أخطاء شائعة"]];
    let part = mine && mine.submitted_at ? 4 : 0;
    const para = (arr) => arr.map((p) => ewsP(p, esc)).join("");
    const draw = () => {
      let b = "";
      if (part === 0) b = `<div class="ews-where"><div><b>${esc(W.paper)}</b><span>${esc(W.q)}</span></div><div><b>${ewsDeg(W.marks)}</b><span>${esc(W.split)}</span></div><div><b>${esc(W.words)}</b><span>طول الإجابة</span></div><div><b>⏱️</b><span>${esc(W.time)}</span></div></div>
        <div class="mdr-card"><h4>نص التعليمات في ورقة الامتحان</h4><p class="ews-instr">«${esc(W.instr)}»</p></div>
        <div class="mdr-card"><h4>معيار جودة الكتابة (درجتان)</h4><table class="lp-tbl ews-q">${D.quality.map((q) => `<tr><td><b>${q[0]}</b></td><td>${esc(q[1])}</td></tr>`).join("")}</table><p class="muted">ونقاط المحتوى: درجة لكل نقطة رئيسة يذكرها الطالب.</p></div>`;
      if (part === 1) b = `<div class="ews-skill">${D.skill.map((s, i) => `<div><span>${s[0]}</span><b>${i + 1}. ${esc(s[1])}</b><p>${esc(s[2])}</p></div>`).join("")}</div>
        <div class="mdr-card"><h4>🔗 أدوات ربط تحتاجها</h4><div class="ews-links">${D.links.map((x) => `<span>${esc(x)}</span>`).join("")}</div></div>`;
      if (part === 2 && IT) { const E = D.example;
        b = `<div class="mdr-card"><h4>${D.grids ? "المهمة" : "النص"}: «${esc(E.title)}»</h4><div class="mdr-text sm">${para(E.text)}</div></div>
          <h4>الأسئلة، وإجابة كاملة وإجابة ناقصة لكل سؤال</h4>${E.qs.map((q) => `<div class="mdr-card ews-iq"><b>${esc(q.n)} (${q.marks > 1 ? "درجتان" : "درجة"}): ${esc(q.q)}</b>
            <div class="ews-ia ok"><span>✔ ${q.marks}/${q.marks}</span><p>${esc(q.full.a)}</p><small>${esc(q.full.note)}</small></div>
            ${q.part ? `<div class="ews-ia no"><span>${q.part.score}/${q.marks}</span><p>${esc(q.part.a)}</p><small>${esc(q.part.note)}</small></div>` : ""}</div>`).join("")}`; }
      else if (part === 2) { const E = D.example;
        b = `<div class="mdr-card"><h4>${D.grids ? "المهمة" : "النص"}: «${esc(E.title)}»</h4><div class="mdr-text sm">${para(E.text)}</div><p class="ews-instr">${esc(W.instr)} (${ewsDeg(W.marks)})</p></div>
        <details class="mdr-card"><summary>🔑 ${esc(E.pointsT || "النقاط الرئيسة الأربع")} (حاول أن تجدها قبل أن تفتح)</summary><ol>${E.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ol></details>
        <h4>ثلاث إجابات وكيف صُحّحت</h4>${E.models.map((m) => `<div class="mdr-card ews-model ${m.cls}"><div class="mdr-lg-h"><b class="ews-badge">${m.lvl}</b><small class="muted">${m.words} كلمة · ${m.marks ? `النقاط ${m.marks.reduce((a, b) => a + b, 0)}/4 · الجودة ${m.q}/2` : (m.gs ? esc(ewsGrSum(D, m.gb, m.gs)) : `المستوى <bdi dir="ltr">${esc(D.bands[m.band][0])}–${esc(D.bands[m.band][1])}</bdi>`)}</small></div>
          <p class="ews-ans">${esc(m.text)}</p>${m.marks ? `<div class="ews-pts">${E.points.map((p, i) => `<span class="${m.marks[i] ? "ok" : "no"}">${m.marks[i] ? "✔" : "✘"} ${esc(p.split(":")[0].split("،")[0])}</span>`).join("")}</div>` : (m.gs ? D.grids.map((g, i) => `<p class="ews-band">📊 ${esc(g.t)} (${m.gs[i]}/${g.max}): ${esc(g.bands[m.gb[i]][2])}</p>`).join("") : `<p class="ews-band">📊 ${esc(D.bands[m.band][2])}</p>`)}
          <ul class="ews-notes">${m.notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul></div>`).join("")}`; }
      if (part === 3) { const S = D.drills.sort, Pp = D.drills.para, SL = D.drills.sortL || { main: "فكرة رئيسة", detail: "تفصيل أو مثال" };
        b = `<div class="mdr-card"><h4>1) ${esc((D.drills.sortT) || "فكرة رئيسة أم تفصيل؟")}</h4><p class="muted">${esc(D.drills.sortH || `صنّف كل جملة من نص «${D.example.title}».`)}</p>
          ${S.map((s, i) => `<div class="ews-srt" data-i="${i}"><p>${esc(s[0])}</p><div><button class="btn btn-ghost btn-small" data-v="main">${esc(SL.main)}</button><button class="btn btn-ghost btn-small" data-v="detail">${esc(SL.detail)}</button></div></div>`).join("")}
          <button class="btn btn-primary btn-small" id="ewsSrtC">تحقّق</button><span class="mdr-fb" id="ewsSrtR"></span></div>
          <div class="mdr-card"><h4>2) ${esc(D.drills.paraT || "اختر أفضل إعادة صياغة")}</h4>${Pp.map((q, j) => `<div class="mdr-q" data-j="${j}"><p class="ews-src">«${esc(q.src)}»</p><div class="mdr-opts">${q.o.map((o, k) => `<label class="mdr-opt"><input type="radio" name="ewp${j}" value="${k}"> ${esc(o)}</label>`).join("")}</div><div class="mdr-fb" id="ewpF${j}"></div></div>`).join("")}
          <button class="btn btn-primary btn-small" id="ewsParC">تحقّق</button><span class="mdr-fb" id="ewsParR"></span></div>`; }
      if (part === 4) { const X = D.exam, done = mine && mine.submitted_at;
        b = `<div class="mdr-card"><h4>${D.grids ? "المهمة" : "النص"}: «${esc(X.title)}»</h4><div class="mdr-text sm">${para(X.text)}</div><p class="ews-instr">${esc(X.instr2 || W.instr)} (${ewsDeg(W.marks)})</p></div>
          ${stu || !isStaff() ? `<div class="mdr-card"><div class="rb-top"><span class="mdr-big" id="ewsT">${done ? "✅" : "0:00"}</span><span class="muted">الوقت المقترح ${X.minutes} دقيقة</span><span id="ewsWc" class="pill"></span></div>
            ${IT ? D.exam.qs.map((q, j) => { const prev = ansArr(mine && mine.answer)[j] || ""; return `<div class="ews-qi"><b>${esc(q.n)} (${q.marks}): ${esc(q.q)}</b>${q.o ? `<span class="ews-qo">${q.o.map((o) => `<label class="mdr-opt"><input type="radio" name="ewq${j}" value="${esc(o)}" ${prev === o ? "checked" : ""} ${mine && mine.graded_at ? "disabled" : ""}> ${esc(o)}</label>`).join("")}</span><input type="hidden" class="ews-qa" data-j="${j}" value="${esc(prev)}">` : `<textarea class="mdr-ta ews-qa" data-j="${j}" rows="2" ${mine && mine.graded_at ? "disabled" : ""}>${esc(prev)}</textarea>`}</div>`; }).join("") + `<textarea id="ewsA" hidden></textarea>` : ""}
            <textarea class="mdr-ta ews-ta" ${IT ? "hidden" : ""} id="${IT ? "ewsA0" : "ewsA"}" rows="9" ${mine && mine.graded_at ? "disabled" : ""} placeholder="${esc(D.exam.ph || "اكتب تلخيصك هنا بأسلوبك…")}">${esc((mine && mine.answer) || "")}</textarea>
            <p class="form-error" id="ewsE"></p><button class="btn btn-primary" id="ewsSub" ${mine && mine.graded_at ? "disabled" : ""}>📤 ${done ? "عدّل وأعد التصحيح" : "سلّم وصحّح نفسك"}</button>
            ${!stu ? `<p class="muted">جرّب الكتابة هنا؛ لا تُحفظ إجابتك إلا بحساب طالب.</p>` : ""}</div><div id="ewsSelf"></div>` : ""}
          ${isStaff() && state.session ? `<div id="ewsT2"></div>` : ""}`; }
      if (part === 5) b = `<div class="ews-mist">${D.mistakes.map((m) => `<div><span>${m[0]}</span><b>${esc(m[1])}</b><p>${esc(m[2])}</p>${m[3] ? `<small>${m[3] === "ms" ? "📄 من معيار التصحيح" : m[3] === "rep" ? "📄 من تقرير الممتحنين" : "📄 من تعليمات السؤال"}</small>` : ""}</div>`).join("")}</div>
        <div class="mdr-card"><h4>📚 المصادر الرسمية</h4><ul>${D.sources.map((s) => `<li><a href="${s[1]}" target="_blank" rel="noopener">${esc(s[0])}</a></li>`).join("")}</ul><p class="muted">النصوص والإجابات النموذجية في هذه الورشة من تأليف حراء، على شكل أسئلة Pearson ومعايير تصحيحها.</p></div>`;
      box.innerHTML = `<div class="ews"><div class="ews-hd"><b>🎯 ورشة الامتحان</b><span dir="ltr">Pearson Edexcel ${esc(D.qual)}</span>${mine && mine.graded_at ? `<span class="pill ok">درجة معلمك: ${mine.t_score}/${mine.max_score}</span>` : mine && mine.submitted_at ? `<span class="pill">تصحيحك الذاتي: ${mine.self_score}/${mine.max_score}</span>` : ""}</div>
        <div class="mdr-steps">${P.map((p, k) => `<button class="mdr-sp ${k === part ? "on" : ""}" data-ep="${k}"><span>${p[0]}</span>${p[1]}</button>`).join("")}</div><div class="ews-body">${b}</div>
        <div class="mdr-nav">${part ? `<button class="btn btn-ghost" data-ep="${part - 1}">→ ${P[part - 1][1]}</button>` : "<span></span>"}${part < P.length - 1 ? `<button class="btn btn-primary" data-ep="${part + 1}">${P[part + 1][1]} ←</button>` : ""}</div></div>`;
      box.querySelectorAll("[data-ep]").forEach((x) => x.onclick = () => { part = +x.dataset.ep; draw(); box.scrollIntoView({ behavior: "smooth", block: "start" }); });
      wire();
    };
    const wire = () => {
      if (part === 3) { const S = D.drills.sort, Pp = D.drills.para, pick = {};
        box.querySelectorAll(".ews-srt").forEach((r) => r.querySelectorAll("[data-v]").forEach((b) => b.onclick = () => { pick[r.dataset.i] = b.dataset.v; r.querySelectorAll("[data-v]").forEach((x) => { x.classList.toggle("btn-primary", x === b); x.classList.toggle("btn-ghost", x !== b); }); }));
        box.querySelector("#ewsSrtC").onclick = () => { let ok = 0; S.forEach((s, i) => { const r = box.querySelector(`.ews-srt[data-i="${i}"]`); const g = pick[i] === s[1]; if (g) ok++; r.classList.toggle("ok", g); r.classList.toggle("no", !g); });
          box.querySelector("#ewsSrtR").textContent = `${ok}/${S.length}${ok === S.length ? " · ممتاز!" : " · الأخضر صحيح والأحمر راجعه." + (D.drills.sortTip ? " " + D.drills.sortTip : " التفصيل مثال أو قول أو اسم، والفكرة الرئيسة معنى عام.")}`; save({ p_drills: { sort: [ok, S.length] } }); };
        box.querySelector("#ewsParC").onclick = () => { let ok = 0; Pp.forEach((q, j) => { const v = box.querySelector(`input[name="ewp${j}"]:checked`); const g = v && +v.value === q.c; if (g) ok++; const f = box.querySelector("#ewpF" + j); f.className = "mdr-fb " + (g ? "ok" : "no"); f.textContent = (g ? "✔ " : "✘ ") + q.why; });
          box.querySelector("#ewsParR").textContent = `${ok}/${Pp.length}`; save({ p_drills: { para: [ok, Pp.length] } }); };
      }
      if (part === 4) {
        const ta = box.querySelector("#ewsA"); if (ta) { const wcE = box.querySelector("#ewsWc"); const t0 = Date.now(); let tm = null;
          const qas = [...box.querySelectorAll(".ews-qa")], getA = () => qas.map((x) => x.value.trim()), wcAll = () => IT ? getA().reduce((a, v) => a + ewsWc(v), 0) : ewsWc(ta.value);
          const up = () => { const n = wcAll(); wcE.textContent = `${n} كلمة`; wcE.className = "pill " + (!WL ? "" : n >= WL[0] && n <= WL[1] ? "ok" : n ? "warn" : ""); }; ta.oninput = () => { up(); if (!tm && !(mine && mine.submitted_at)) tm = setInterval(() => { const s = Math.floor((Date.now() - t0) / 1000), el = box.querySelector("#ewsT"); if (!el) { clearInterval(tm); return; } el.textContent = Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); el.classList.toggle("late", s > D.exam.minutes * 60); }, 500); }; up(); if (IT) { qas.forEach((x) => x.oninput = () => ta.oninput()); box.querySelectorAll('.ews-qo input[type=radio]').forEach((r) => r.onchange = () => { const h = r.closest(".ews-qi").querySelector(".ews-qa"); h.value = r.value; ta.oninput(); }); }
          box.querySelector("#ewsSub").onclick = () => { const n = wcAll(), e = box.querySelector("#ewsE"); if (IT) { if (getA().some((v) => !v)) { e.textContent = "أجب عن كل الأسئلة."; return; } e.textContent = ""; clearInterval(tm); selfCheck(JSON.stringify(getA()), n, Math.round((Date.now() - t0) / 1000)); return; } if (n < (D.exam.minWords || 40)) { e.textContent = "اكتب إجابة كاملة أولًا."; return; } e.textContent = ""; clearInterval(tm); selfCheck(ta.value, n, Math.round((Date.now() - t0) / 1000)); };
          if (mine && mine.submitted_at) showResult(); }
        if (isStaff() && state.session) ewsTeacher(box.querySelector("#ewsT2"), D, l, u);
      }
    };
    const selfCheck = (ans, n, sec) => { const X = D.exam, el = box.querySelector("#ewsSelf");
      if (IT) { const A = ansArr(ans);
        el.innerHTML = `<div class="mdr-card ews-self"><h4>✅ صحّح نفسك: قارن إجابتك بالإجابة النموذجية</h4><p class="muted">في الأسئلة ذات الدرجتين: درجة للإجابة ودرجة للعبارة الداعمة بين علامتي تنصيص.</p>
          ${X.qs.map((q, j) => `<div class="ews-iq"><b>${esc(q.n)} (${q.marks}): ${esc(q.q)}</b><div class="ews-ia"><span>إجابتك</span><p>${esc(A[j] || "")}</p></div><div class="ews-ia ok"><span>النموذج</span><p>${esc(q.model)}</p></div>
            ${q.o ? `<p class="mdr-fb ${A[j] === q.o[q.c] ? "ok" : "no"}">${A[j] === q.o[q.c] ? "✔ صحيح" : "✘ الصحيح: " + esc(q.o[q.c])} (تصحيح آلي)</p><select data-it="${j}" hidden><option>${A[j] === q.o[q.c] ? q.marks : 0}</option></select>` : `<label class="ews-chk">درجتي: <select data-it="${j}">${Array.from({ length: q.marks + 1 }, (_, k) => `<option>${k}</option>`).join("")}</select> / ${q.marks}</label>`}</div>`).join("")}
          <button class="btn btn-primary" id="ewsOk">احفظ درجتي</button></div>`;
        el.scrollIntoView({ behavior: "smooth" });
        el.querySelector("#ewsOk").onclick = async () => { const it = [...el.querySelectorAll("[data-it]")].map((x) => +x.value), sc = it.reduce((a, b) => a + b, 0), sm = { it };
          const err = await save({ p_answer: ans, p_words: n, p_seconds: sec, p_self: sm, p_self_score: sc, p_max: D.where.marks }); if (err) return;
          mine = Object.assign(mine || {}, { answer: ans, words: n, self_marks: sm, self_score: sc, max_score: D.where.marks, submitted_at: new Date().toISOString() }); draw(); };
        return; }
      if (GR) { el.innerHTML = `<div class="mdr-card ews-self"><h4>✅ صحّح نفسك بجدولَي الدرجات الرسميين</h4><p class="muted">راجع ما كتبته: أيّ هذه العناصر حقّقتها؟</p>
          ${X.points.map((p, i) => `<label class="ews-chk"><input type="checkbox" data-pt="${i}"> ${esc(p)}</label>`).join("")}
          ${D.grids.map((g, gi) => `<h4>${esc(g.t)} (${ewsDeg(g.max)}): اختر المستوى</h4>${g.bands.map((b, k) => `<label class="ews-chk"><input type="radio" name="ewsB${gi}" value="${k}"> <b><bdi dir="ltr">${b[0]}–${b[1]}</bdi></b>: ${esc(b[2])}</label>`).join("")}<div id="ewsMk${gi}"></div>`).join("")}
          <p class="form-error" id="ewsE2"></p><button class="btn btn-primary" id="ewsOk">احفظ درجتي</button></div>`;
        el.scrollIntoView({ behavior: "smooth" });
        D.grids.forEach((g, gi) => el.querySelectorAll(`input[name="ewsB${gi}"]`).forEach((r) => r.onchange = () => { const b = g.bands[+r.value]; el.querySelector("#ewsMk" + gi).innerHTML = `<label class="ews-chk">الدرجة داخل المستوى: <select id="ewsMv${gi}">${Array.from({ length: b[1] - b[0] + 1 }, (_, k) => `<option>${b[0] + k}</option>`).join("")}</select></label>`; }));
        el.querySelector("#ewsOk").onclick = async () => { const gb = [], gs = [];
          for (let gi = 0; gi < D.grids.length; gi++) { const r = el.querySelector(`input[name="ewsB${gi}"]:checked`), mv = el.querySelector("#ewsMv" + gi); if (!r || !mv) { el.querySelector("#ewsE2").textContent = `اختر المستوى والدرجة في «${D.grids[gi].t}».`; return; } gb.push(+r.value); gs.push(+mv.value); }
          const pts = [...el.querySelectorAll("[data-pt]")].map((c) => c.checked ? 1 : 0), sc = gs.reduce((a, b) => a + b, 0), sm = { gb, gs, pts };
          const err = await save({ p_answer: ans, p_words: n, p_seconds: sec, p_self: sm, p_self_score: sc, p_max: D.where.marks }); if (err) return;
          mine = Object.assign(mine || {}, { answer: ans, words: n, self_marks: sm, self_score: sc, max_score: D.where.marks, submitted_at: new Date().toISOString() }); draw(); };
        return; }
      if (LV) { el.innerHTML = `<div class="mdr-card ews-self"><h4>✅ صحّح نفسك بجدول الدرجات الرسمي</h4><p class="muted">راجع ما كتبته: أيّ هذه العناصر حلّلته مع شاهد من النص؟</p>
          ${X.points.map((p, i) => `<label class="ews-chk"><input type="checkbox" data-pt="${i}"> ${esc(p)}</label>`).join("")}
          <h4>اختر المستوى الذي يصف إجابتك</h4>${D.bands.map((b, k) => `<label class="ews-chk"><input type="radio" name="ewsB" value="${k}"> <b><bdi dir="ltr">${b[0]}–${b[1]}</bdi></b>: ${esc(b[2])}${b[3] ? ` <small class="muted">الشاهد: ${esc(b[3])}</small>` : ""}</label>`).join("")}
          <div id="ewsMk"></div><p class="form-error" id="ewsE2"></p><button class="btn btn-primary" id="ewsOk">احفظ درجتي</button></div>`;
        el.scrollIntoView({ behavior: "smooth" });
        el.querySelectorAll('input[name="ewsB"]').forEach((r) => r.onchange = () => { const b = D.bands[+r.value]; el.querySelector("#ewsMk").innerHTML = `<label class="ews-chk">الدرجة داخل المستوى: <select id="ewsMv">${Array.from({ length: b[1] - b[0] + 1 }, (_, k) => `<option>${b[0] + k}</option>`).join("")}</select></label>`; });
        el.querySelector("#ewsOk").onclick = async () => { const r = el.querySelector('input[name="ewsB"]:checked'), mv = el.querySelector("#ewsMv"); if (!r || !mv) { el.querySelector("#ewsE2").textContent = "اختر المستوى والدرجة."; return; }
          const pts = [...el.querySelectorAll("[data-pt]")].map((c) => c.checked ? 1 : 0), sc = +mv.value, sm = { band: +r.value, mark: sc, pts };
          const err = await save({ p_answer: ans, p_words: n, p_seconds: sec, p_self: sm, p_self_score: sc, p_max: D.where.marks }); if (err) return;
          mine = Object.assign(mine || {}, { answer: ans, words: n, self_marks: sm, self_score: sc, max_score: D.where.marks, submitted_at: new Date().toISOString() }); draw(); };
        return; }
      el.innerHTML = `<div class="mdr-card ews-self"><h4>✅ صحّح نفسك بمعيار الامتحان</h4><p class="muted">ضع علامة على كل نقطة ذكرتها <b>بأسلوبك</b> (لا تحسبها إن نقلتها حرفيًّا أو نسيتها).</p>
        ${X.points.map((p, i) => `<label class="ews-chk"><input type="checkbox" data-pt="${i}"> ${esc(p)}</label>`).join("")}
        <h4>جودة الكتابة</h4>${D.quality.map((q) => `<label class="ews-chk"><input type="radio" name="ewsQ" value="${q[0]}"> <b>${q[0]}</b>: ${esc(q[1])}</label>`).join("")}
        ${WL && (n < WL[0] || n > WL[1]) ? `<p class="mdr-fb no">⚠️ عدد كلماتك ${n}، والمطلوب بين ${WL[0]} و${WL[1]}.</p>` : ""}
        <p class="form-error" id="ewsE2"></p><button class="btn btn-primary" id="ewsOk">احسب درجتي</button></div>`;
      el.scrollIntoView({ behavior: "smooth" });
      el.querySelector("#ewsOk").onclick = async () => { const q = el.querySelector('input[name="ewsQ"]:checked'); if (!q) { el.querySelector("#ewsE2").textContent = "اختر مستوى جودة الكتابة."; return; }
        const pts = [...el.querySelectorAll("[data-pt]")].map((c) => c.checked ? 1 : 0), sc = pts.reduce((a, b) => a + b, 0) + +q.value;
        const err = await save({ p_answer: ans, p_words: n, p_seconds: sec, p_self: { pts, q: +q.value }, p_self_score: sc, p_max: D.where.marks }); if (err) return;
        mine = Object.assign(mine || {}, { answer: ans, words: n, self_marks: { pts, q: +q.value }, self_score: sc, max_score: D.where.marks, submitted_at: new Date().toISOString() }); draw(); };
    };
    const showResult = () => { const X = D.exam, el = box.querySelector("#ewsSelf"), sm = mine.self_marks || { pts: [], q: 0 }, tm = mine.t_marks;
      if (IT) { const A = ansArr(mine.answer), M = (tm || sm).it || [];
        el.innerHTML = `<div class="mdr-card ews-res"><h4>نتيجتك</h4><div class="lp-stats"><div><b>${mine.self_score}/${mine.max_score}</b><small>تصحيحك الذاتي</small></div>${mine.graded_at ? `<div><b>${mine.t_score}/${mine.max_score}</b><small>درجة معلمك</small></div>` : `<div><b>⏳</b><small>بانتظار تصحيح معلمك</small></div>`}</div>
          ${X.qs.map((q, j) => `<div class="ews-iq"><b>${esc(q.n)}: ${esc(q.q)} <span class="pill ${M[j] === q.marks ? "ok" : "warn"}">${M[j] != null ? M[j] : "—"}/${q.marks}</span></b><div class="ews-ia"><span>إجابتك</span><p>${esc(A[j] || "")}</p></div><div class="ews-ia ok"><span>النموذج</span><p>${esc(q.model)}</p></div></div>`).join("")}
          ${mine.t_note ? `<p class="mdr-task">🧑‍🏫 ${esc(mine.t_note)}</p>` : ""}</div>`; return; }
      el.innerHTML = `<div class="mdr-card ews-res"><h4>نتيجتك</h4><div class="lp-stats"><div><b>${mine.self_score}/${mine.max_score}</b><small>تصحيحك الذاتي</small></div>${mine.graded_at ? `<div><b>${mine.t_score}/${mine.max_score}</b><small>درجة معلمك</small></div>` : `<div><b>⏳</b><small>بانتظار تصحيح معلمك</small></div>`}<div><b>${mine.words}</b><small>كلمة</small></div></div>
        ${GR ? (() => { const M = tm || sm; return D.grids.map((g, i) => `<p class="ews-band">📊 ${esc(g.t)}: <b>${M.gs ? M.gs[i] : "?"}/${g.max}</b> · ${esc((g.bands[(M.gb || [])[i]] || [, , ""])[2])}</p>`).join(""); })() : LV ? `<p class="ews-band">📊 ${esc((D.bands[(tm || sm).band] || [, , ""])[2])}</p>` : `<div class="ews-pts">${X.points.map((p, i) => { const v = tm ? (tm.pts || [])[i] : (sm.pts || [])[i]; return `<span class="${v ? "ok" : "no"}">${v ? "✔" : "✘"} ${esc(p.split(":")[0])}</span>`; }).join("")}</div>`}
        ${mine.t_note ? `<p class="mdr-task">🧑‍🏫 ${esc(mine.t_note)}</p>` : ""}
        <details open><summary>📝 إجابة نموذجية (${X.model_words} كلمة)${LV ? " · من النقاط المقبولة: " + esc(X.points.map((p) => p.split(":")[0]).join("، ")) : ""}</summary><p class="ews-ans">${esc(X.model)}</p></details></div>`; };
    draw();
  }
  // ---------- شرائح ورشة الامتحان: تُبنى من ملف الورشة نفسه، مركّزة على المهارة والنماذج ----------
  function tdBuildEws(ctx) {
    const D = ctx.ews, W = D.where, E = D.example, X = D.exam, S = [];
    const tf = []; (ctx.ewsPrev || []).forEach((c) => (c.quiz || []).forEach((q) => { if (q && q[0]) tf.push({ s: q[0], ok: !!q[1] }); }));
    S.push({ t: "title", d: { title: ctx.l.title_ar, sub: `Pearson Edexcel ${D.qual} · ${W.paper} · ${W.q}` }, n: "" });
    S.push({ t: "ex", d: { k: "where", title: "أين هذا في الامتحان؟", W }, n: "دقيقة واحدة: اقرأ تعليمات السؤال بصوت مسموع، واسأل: كم نقطة رئيسة نحتاج؟ وما الذي يُفقدنا درجة الجودة؟" });
    S.push({ t: "sc", d: { title: "هدف الدرس ومعايير النجاح", obj: D.obj, items: D.sc.map((t) => ({ t })) }, n: "اقرأ المعايير، واطلب من كل طالب أن يحدّد المعيار الذي يراه الأصعب عليه." });
    if (tf.length >= 2) S.push({ t: "starter", d: { title: "استرجاع سريع", sub: "صح أم خطأ؟ صحّح الخاطئة في دفترك", cards: tf.slice(0, 6) }, n: "3 دقائق: من الدروس السابقة في المؤهّل. انقر البطاقة لكشف الحكم." });
    S.push({ t: "strategy", d: { title: "المهارة في ست خطوات", steps: D.skill.map((x) => `${x[0]} ${x[1]}: ${x[2]}`) }, n: "اكشف الخطوات واحدة واحدة، ومثّل لكل خطوة بجملة من النص القادم." });
    if (D.type === "items") {
      S.push({ t: "ex", d: { k: "text", title: `أنا أطبّق أمامكم: «${E.title}»`, text: E.text, instr: "اقرأ النص، ثم أجب عن الأسئلة." }, n: "اقرأ النص، وظلّل بالقلم الكلمات المفتاحية التي يسأل عنها كل سؤال." });
      E.qs.forEach((q) => S.push({ t: "ex", d: { k: "itemq", title: `${q.n} (${q.marks})`, q }, n: "اقرأ السؤال، وحدّد الكلمة المفتاحية، وابحث عنها في النص بصوت مسموع. ثم اكشف الإجابة الكاملة والناقصة وناقش الفرق." }));
      S.push({ t: "ex", d: { k: "sort", title: "نطبّق معًا: " + (D.drills.sortT || "فكرة رئيسة أم تفصيل؟"), items: D.drills.sort, L: D.drills.sortL }, n: "يرفع الطلاب يدًا للخيار الأول وقبضة للثاني، ثم اكشف الإجابة." });
      D.drills.para.forEach((q, j) => S.push({ t: "ex", d: { k: "para", title: `${D.drills.paraT || "اختر الأفضل"} (${j + 1}/${D.drills.para.length})`, q }, n: "يكتب الطلاب رقم الخيار على السبورات الصغيرة، ثم اكشف الصحيح وسببه." }));
      S.push({ t: "ex", d: { k: "task", title: `أنت تطبّق: «${X.title}»`, text: X.text, instr: "أجب عن الأسئلة في الشريحة التالية", min: X.minutes }, n: `${X.minutes} دقائق: شغّل المؤقت، واترك الشريحة التالية ظاهرة.` });
      S.push({ t: "ex", d: { k: "qlist", title: "الأسئلة", qs: X.qs }, n: "" });
      S.push({ t: "ex", d: { k: "qans", title: "الإجابات النموذجية: صحّح إجابة زميلك", qs: X.qs }, n: "يتبادل الطلاب الدفاتر، ويصحّحون: في سؤالي الدرجتين، درجة للإجابة ودرجة للعبارة بين علامتي تنصيص." });
      S.push({ t: "ex", d: { k: "mist", title: "أخطاء شائعة", items: D.mistakes }, n: "اسأل: أيّ هذه الأخطاء وقعتَ فيه اليوم؟" });
      S.push({ t: "exit", d: { title: "بطاقة الخروج", sub: "امسح الرمز: ورشة الامتحان وأسئلتها على حراء", url: appUrl() + "#/lesson/" + ctx.l.code }, n: "" });
      return S; }
    S.push({ t: "ex", d: { k: "text", title: `أنا أطبّق أمامكم: «${E.title}»`, text: E.text, instr: W.instr + ` (${ewsDeg(W.marks)})` }, n: "فكّر بصوت مسموع: اقرأ الفقرة، وقل: «ما الفكرة الرئيسة هنا؟ وما المثال الذي سأحذفه؟». ظلّل بالقلم الأفكار الرئيسة." });
    if (D.grids) D.grids.forEach((g) => S.push({ t: "ex", d: { k: "bands", title: `جدول «${g.t}» (${ewsDeg(g.max)})`, bands: g.bands.map((b) => [b[0], b[1], b[2]]) }, n: "اقرأ المستويات من الأدنى إلى الأعلى، واسأل: ما الذي ينقل الكتابة من مستوى إلى الذي يليه؟" }));
    else if (D.type === "levels") S.push({ t: "ex", d: { k: "bands", title: "جدول الدرجات الرسمي", bands: D.bands }, n: "اقرأ المستويات من الأدنى إلى الأعلى، واسأل: ما الفرق بين «شرح واضح» و«شرح مفصّل»؟ وما الذي يرفع الشاهد إلى «دعم تام»؟" });
    S.push({ t: "ex", d: { k: "points", title: E.pointsT || "النقاط الرئيسة الأربع", items: E.points, note: D.type === "levels" ? "كل عنصر يحتاج: التسمية + الشاهد + الأثر" : "درجة لكل نقطة · والأمثلة والأقوال لا درجة لها" }, n: "اكشف النقاط واحدة واحدة، وقارن بما ظلّله الطلاب." });
    const top = E.models.reduce((a, m) => (m.score > a.score ? m : a), E.models[0]);
    if (D.grids) { E.models.forEach((m) => { const isTop = m === top;
        S.push({ t: "ex", d: { k: "essay", title: isTop ? `إجابة نموذجية (${top.lvl})` : "صحّح كممتحن", m, grids: D.grids, hide: !isTop }, n: isTop ? "اقرأ الإجابة مع الطلاب: أين المقدمة؟ وكيف تترابط الفقرات؟ وما المفردات التي ترفع درجة اللغة؟" : "ثلاث دقائق: يقرأ الطلاب في أزواج، ويقدّرون الدرجة بالجدولين، ثم اكشف درجة الممتحن." });
        S.push({ t: "ex", d: { k: "points", title: `لماذا ${m.lvl}؟`, items: m.notes, note: ewsGrSum(D, m.gb, m.gs) }, n: "اكشف التعليقات واحدًا واحدًا، واربط كل تعليق بوصف في أحد الجدولين." }); }); }
    else { S.push({ t: "ex", d: { k: "model", title: `إجابة نموذجية (${top.lvl})`, m: top, points: E.points, max: W.marks }, n: "اقرأ الإجابة، ثم اكشف علامات النقاط والتعليقات: كيف أعاد الصياغة؟ وأين أدوات الربط؟" });
    E.models.filter((m) => m !== top).forEach((m) => S.push({ t: "ex", d: { k: D.type === "levels" ? "markb" : "mark", title: "صحّح كممتحن", m, points: E.points, quality: D.quality, bands: D.bands, max: W.marks },
      n: "دقيقتان: يصحّح الطلاب في أزواج بالمعيار (نقطة = درجة، والجودة 0–2) ويكتبون الدرجة، ثم اكشف درجة الممتحن وتعليقاته وناقش الفرق." })); }
    S.push({ t: "ex", d: { k: "sort", title: "نطبّق معًا: " + (D.drills.sortT || "فكرة رئيسة أم تفصيل؟"), items: D.drills.sort, L: D.drills.sortL }, n: "يرفع الطلاب يدًا للفكرة الرئيسة وقبضة للتفصيل، ثم اكشف الإجابة." });
    D.drills.para.forEach((q, j) => S.push({ t: "ex", d: { k: "para", title: `${D.drills.paraT || "أفضل إعادة صياغة"} (${j + 1}/${D.drills.para.length})`, q }, n: "يكتب الطلاب رقم الخيار على السبورات الصغيرة، ثم اكشف الصحيح وسببه." }));
    S.push({ t: "ex", d: { k: "task", title: `أنت تطبّق: «${X.title}»`, text: X.text, instr: (X.instr2 || W.instr) + ` (${ewsDeg(W.marks)})`, min: X.minutes }, n: `${X.minutes} دقيقة: شغّل المؤقت. الكتابة فردية وبصمت، مع عدّ الكلمات في النهاية.` });
    if (D.grids) S.push({ t: "ex", d: { k: "peerg", title: "تقييم الزميل بجدولَي الامتحان", points: X.points, grids: D.grids, max: W.marks }, n: "يتبادل الطلاب الدفاتر، ويضعون ✔ لكل عنصر حقّقه الزميل، ويقدّرون درجة كل جدول، ثم يكتبون نصيحة واحدة." });
    else S.push({ t: "ex", d: { k: D.type === "levels" ? "peerb" : "peer", title: "تقييم الزميل بمعيار الامتحان", points: X.points, quality: D.quality, bands: D.bands, max: W.marks }, n: "يتبادل الطلاب الدفاتر، ويضعون ✔ لكل نقطة مكتوبة بأسلوب الزميل، ويختارون مستوى الجودة، ثم يكتبون نصيحة واحدة." });
    if (D.grids) S.push({ t: "ex", d: { k: "essay", title: "إجابة نموذجية للمهمة", m: { text: X.model, words: X.model_words }, grids: null }, n: "اكشفها بعد تقييم الزميل، واطلب من كل طالب تحسين فقرة واحدة في موضوعه." });
    else S.push({ t: "ex", d: { k: "answer", title: "إجابة نموذجية للمقارنة", text: X.model, words: X.model_words }, n: "اكشفها بعد تقييم الزميل، واطلب من كل طالب تحسين جملة واحدة في تلخيصه." });
    S.push({ t: "ex", d: { k: "mist", title: "أخطاء شائعة", items: D.mistakes }, n: "اسأل: أيّ هذه الأخطاء وقعتَ فيه اليوم؟" });
    S.push({ t: "exit", d: { title: "بطاقة الخروج", sub: "امسح الرمز: ورشة الامتحان وسؤالها على حراء", url: appUrl() + "#/lesson/" + ctx.l.code }, n: "دقيقتان: يسلّم الطلاب تلخيصهم على المنصة ويصحّحون أنفسهم بالمعيار." });
    return S;
  }
  function tdExHtml(d, X) {
    const src = { ms: "معيار التصحيح", rep: "تقرير الممتحنين", q: "تعليمات السؤال" };
    switch (d.k) {
      case "where": { const W = d.W; return `<div class="tdx-where"><div><b>${X(W.q)}</b><span>${X(W.paper)}</span></div><div><b>${ewsDeg(W.marks)}</b><span>${X(W.split)}</span></div><div><b>${X(W.words)}</b><span>طول الإجابة</span></div></div><div class="tdx-instr rv">«${X(W.instr)}»</div>`; }
      case "text": return `<div class="tdx-tx">${d.text.map((p) => ewsP(p, X)).join("")}</div><div class="tdx-instr">${X(d.instr)}</div>`;
      case "points": return `<ol class="tdx-pts${d.items.length > 4 ? " many" : ""}">${d.items.map((p, j) => `<li class="rv"><span>${j + 1}</span><p>${X(p)}</p></li>`).join("")}</ol>${d.note ? `<div class="tdx-note">${X(d.note)}</div>` : ""}`;
      case "bands": return `<div class="tdx-grid bands">${d.bands.map((b) => `<div class="rv"><em><bdi dir="ltr">${b[0]}–${b[1]}</bdi></em><span>${X(b[2])}${b[3] ? `<small> · الشاهد: ${X(b[3])}</small>` : ""}</span></div>`).join("")}</div>`;
      case "markb": return `<div class="tdx-two"><div class="tdx-ans${(d.m.words || 0) > 125 ? " long" : ""}">${X(d.m.text)}<small>${d.m.words} كلمة</small></div><div class="tdx-side"><div class="tdx-grid bands sm">${d.bands.map((b) => `<div><em><bdi dir="ltr">${b[0]}–${b[1]}</bdi></em><span>${X(b[2])}</span></div>`).join("")}</div><div class="tdx-score rv">المستوى <bdi dir="ltr">${d.bands[d.m.band][0]}–${d.bands[d.m.band][1]}</bdi> · درجة الممتحن: <b>${d.m.score}/${d.max}</b></div><ul class="tdx-notes sm">${d.m.notes.slice(0, 2).map((n) => `<li class="rv">${X(n)}</li>`).join("")}</ul></div></div>`;
      case "essay": return `<div class="tdx-essay${(d.m.words || 0) > 330 || String(d.m.text).split("\n").length > 8 ? " xl" : ""}">${String(d.m.text).split("\n").map((p) => `<p>${X(p)}</p>`).join("")}</div><div class="tdx-escore">${d.grids && d.m.gs ? d.grids.map((g, i) => `<span class="${d.hide ? "rv" : ""}">${X(g.t)}: <b>${d.m.gs[i]}/${g.max}</b></span>`).join("") : ""}<small>${d.m.words} كلمة</small></div>`;
      case "peerg": return `<div class="tdx-three"><div class="tdx-grid"><b>✔ ماذا حقّق زميلي؟</b>${d.points.map((p) => `<div><span>${X(p.split(":")[0])}</span><em>☐</em></div>`).join("")}</div>${d.grids.map((g) => `<div class="tdx-grid bands sm"><b>${X(g.t)}</b>${g.bands.map((b) => `<div><em><bdi dir="ltr">${b[0]}–${b[1]}</bdi></em><span>${X(b[3] || b[2])}</span></div>`).join("")}<div class="tdx-score">...... / ${g.max}</div></div>`).join("")}</div>`;
      case "peerb": return `<div class="tdx-two"><div class="tdx-grid"><b>✔ ماذا حلّل زميلي؟</b>${d.points.map((p) => `<div><span>${X(p.split(":")[0])}</span><em>☐</em></div>`).join("")}</div><div class="tdx-grid bands sm"><b>المستوى</b>${d.bands.map((b) => `<div><em><bdi dir="ltr">${b[0]}–${b[1]}</bdi></em><span>${X(b[2])}</span></div>`).join("")}<div class="tdx-score">الدرجة: ...... / ${d.max}</div></div></div>`;
      case "model": if (!d.m.marks) return `<div class="tdx-two"><div class="tdx-ans${(d.m.words || 0) > 125 ? " long" : ""}">${X(d.m.text)}<small>${d.m.words} كلمة</small></div><div class="tdx-side"><div class="tdx-score rv">المستوى ${d.m.score}/${d.max || 10}</div><ul class="tdx-notes sm">${d.m.notes.slice(0, 4).map((n) => `<li class="rv">${X(n)}</li>`).join("")}</ul></div></div>`;
        return `<div class="tdx-two"><div class="tdx-ans${(d.m.words || 0) > 125 ? " long" : ""}">${X(d.m.text)}<small>${d.m.words} كلمة</small></div><div class="tdx-side"><div class="tdx-chips">${d.points.map((p, j) => `<span class="rv ${d.m.marks[j] ? "ok" : "no"}">${d.m.marks[j] ? "✔" : "✘"} ${X(p.split(":")[0].split("،")[0])}</span>`).join("")}</div><ul class="tdx-notes">${d.m.notes.map((n) => `<li class="rv">${X(n)}</li>`).join("")}</ul></div></div>`;
      case "mark": return `<div class="tdx-two"><div class="tdx-ans${(d.m.words || 0) > 125 ? " long" : ""}">${X(d.m.text)}<small>${d.m.words} كلمة</small></div><div class="tdx-side"><div class="tdx-grid"><b>النقاط (درجة لكل نقطة)</b>${d.points.map((p, j) => `<div><span>${X(p.split(":")[0].split("،")[0])}</span><em class="rv ${d.m.marks[j] ? "ok" : "no"}">${d.m.marks[j] ? "1" : "0"}</em></div>`).join("")}
        <b>جودة الكتابة (0–2)</b><div><span>${X((d.quality.find((q) => q[0] === d.m.q) || [, ""])[1])}</span><em class="rv">${d.m.q}</em></div></div><div class="tdx-score rv">درجة الممتحن: <b>${d.m.score}/${d.max}</b></div><ul class="tdx-notes sm">${d.m.notes.slice(0, 2).map((n) => `<li class="rv">${X(n)}</li>`).join("")}</ul></div></div>`;
      case "sort": return `<div class="tdx-sort">${d.items.map((s) => `<div><p>${X(s[0])}</p><em class="rv ${s[1]}">${X((d.L || {})[s[1]] || (s[1] === "main" ? "فكرة رئيسة" : "تفصيل أو مثال"))}</em></div>`).join("")}</div>`;
      case "para": return `<div class="tdx-src">«${X(d.q.src)}»</div><div class="tdx-opts">${d.q.o.map((o, k) => `<div class="${k === d.q.c ? "c" : ""}"><span>${k + 1}</span>${X(o)}</div>`).join("")}</div><div class="tdx-why rv">✔ الخيار ${d.q.c + 1}: ${X(d.q.why)}</div>`;
      case "task": return `<div class="tdx-tx sm">${d.text.map((p) => ewsP(p, X)).join("")}</div><div class="tdx-instr">${X(d.instr)} · ⏱️ ${d.min} دقيقة</div>`;
      case "peer": return `<div class="tdx-two"><div class="tdx-grid"><b>✔ النقاط الرئيسة (درجة لكل نقطة)</b>${d.points.map((p) => `<div><span>${X(p)}</span><em>☐</em></div>`).join("")}</div><div class="tdx-grid"><b>جودة الكتابة</b>${d.quality.map((q) => `<div><span>${X(q[1])}</span><em>${q[0]}</em></div>`).join("")}<div class="tdx-score">المجموع: ...... / ${d.max}</div><div class="tdx-note">نصيحة واحدة لزميلي: ......................</div></div></div>`;
      case "itemq": return `<div class="tdx-src">${X(d.q.q)}</div><div class="tdx-ia ok rv"><span>✔ ${d.q.marks}/${d.q.marks}</span><p>${X(d.q.full.a)}</p><small>${X(d.q.full.note)}</small></div>${d.q.part ? `<div class="tdx-ia no rv"><span>${d.q.part.score}/${d.q.marks}</span><p>${X(d.q.part.a)}</p><small>${X(d.q.part.note)}</small></div>` : ""}`;
      case "qlist": return `<ol class="tdx-pts many">${d.qs.map((q) => `<li><span>${X(q.n)}</span><p>${X(q.q)} <small>(${q.marks})</small>${q.o ? `<em class="tdx-qo">${q.o.map((o, k) => `<i>${"أبجد"[k] || k + 1}) ${X(o)}</i>`).join("")}</em>` : ""}</p></li>`).join("")}</ol>`;
      case "qans": return `<div class="tdx-qans">${d.qs.map((q) => `<div class="rv"><b>${X(q.n)}</b><p>${X(q.model)}</p></div>`).join("")}</div>`;
      case "answer": return `<div class="tdx-ans big rv">${X(d.text)}<small>${d.words} كلمة</small></div>`;
      case "mist": return `<div class="tdx-mist">${d.items.map((m) => `<div class="rv"><span>${m[0]}</span><b>${X(m[1])}</b><p>${X(m[2])}</p>${m[3] ? `<small>📄 ${src[m[3]]}</small>` : ""}</div>`).join("")}</div>`;
    }
    return "";
  }
  async function ewsTeacher(el, D, l, u) {
    if (!el) return; const { data: tc } = await sb.from("class_teachers").select("classes(id, name, year_group, track, subject_id)").eq("teacher_id", state.session.user.id);
    let cls = (tc || []).map((x) => x.classes).filter((c) => c && c.year_group === u.year_group && c.track === u.track && c.subject_id === u.subject_id);
    if (!cls.length && (isSchoolAdmin() || isSuper())) { const { data } = await sb.from("classes").select("id, name").eq("year_group", u.year_group).eq("track", u.track).eq("subject_id", u.subject_id).limit(20); cls = data || []; }
    if (!cls.length) { el.innerHTML = `<div class="mdr-card muted">لا توجد فصول مرتبطة بك في هذا المسار، فلا توجد إجابات لتصحيحها.</div>`; return; }
    let cur = cls[0].id;
    const draw = async () => {
      const { data: ro } = await sb.from("class_students").select("student_id, profiles(full_name_ar)").eq("class_id", cur);
      const SS = (ro || []).map((r) => ({ id: r.student_id, name: (r.profiles && r.profiles.full_name_ar) || "—" }));
      const { data } = SS.length ? await sb.from("exam_ws").select("*").eq("lesson_id", l.id).in("student_id", SS.map((s) => s.id)) : { data: [] };
      const R = {}; (data || []).forEach((r) => { R[r.student_id] = r; }); const subs = SS.filter((s) => R[s.id] && R[s.id].submitted_at);
      el.innerHTML = `<div class="mdr-card"><h3>🧑‍🏫 إجابات الفصل وتصحيحها</h3>${cls.length > 1 ? `<div class="rd-cls">${cls.map((c) => `<button class="btn btn-small ${c.id === cur ? "btn-primary" : "btn-ghost"}" data-cls="${c.id}">${esc(c.name)}</button>`).join("")}</div>` : ""}
        <p class="muted">سلّم ${subs.length} من ${SS.length}. ${D.type === "items" ? "التصحيح سؤالًا سؤالًا بمقارنة الإجابة بالنموذج." : D.grids ? "التصحيح بجدولَي الدرجات الرسميين: لكل جدول مستوى ثم درجة داخله." : D.type === "levels" ? "التصحيح بجدول الدرجات الرسمي: اختر المستوى ثم الدرجة داخله." : "التصحيح بمعيار الامتحان: درجة لكل نقطة، ودرجتان للجودة."}</p>
        ${subs.map((s) => { const r = R[s.id], tm = r.t_marks || r.self_marks || { pts: [], q: 0 }; return `<div class="ews-g" data-st="${s.id}"><div class="mdr-lg-h"><b>${esc(s.name)}</b><small class="muted">${r.words} كلمة · ${Math.round((r.seconds || 0) / 60)} د · ذاتي ${r.self_score}/${r.max_score}${r.graded_at ? ` · ✔ ${r.t_score}/${r.max_score}` : ""}</small></div>
          ${D.type === "items" ? D.exam.qs.map((q, j) => { const A = (() => { try { return JSON.parse(r.answer); } catch (e) { return [r.answer]; } })(); const cur = ((r.t_marks || r.self_marks || {}).it || [])[j];
            return `<div class="ews-iq"><b>${esc(q.n)} (${q.marks}): ${esc(q.q)}</b><div class="ews-ia"><span>الطالب</span><p>${esc(A[j] || "")}</p></div><div class="ews-ia ok"><span>النموذج</span><p>${esc(q.model)}</p></div>
              <label>الدرجة: <select class="ews-gi" data-j="${j}">${Array.from({ length: q.marks + 1 }, (_, k) => `<option ${cur === k ? "selected" : ""}>${k}</option>`).join("")}</select> / ${q.marks}</label></div>`; }).join("") : `<p class="ews-ans">${esc(r.answer)}</p>`}${D.type === "items" ? "" : D.grids ? D.grids.map((G, gi) => `<div class="ews-gl"><b>${esc(G.t)} (${ewsDeg(G.max)})</b>${G.bands.map((b, k) => `<label><input type="radio" name="gb${gi}_${s.id}" value="${k}" ${(tm.gb || [])[gi] === k ? "checked" : ""}> <b><bdi dir="ltr">${b[0]}–${b[1]}</bdi></b> ${esc(b[2])}</label>`).join("")}</div>
          <div class="ews-gp">الدرجة: <input type="number" class="ews-gm" data-g="${gi}" min="0" max="${G.max}" value="${(tm.gs || [])[gi] != null ? tm.gs[gi] : ""}"> / ${G.max}</div>`).join("") : D.type === "levels" ? `<div class="ews-gl">${D.bands.map((b, k) => `<label><input type="radio" name="gb${s.id}" value="${k}" ${tm.band === k ? "checked" : ""}> <b><bdi dir="ltr">${b[0]}–${b[1]}</bdi></b> ${esc(b[2])}</label>`).join("")}</div>
          <div class="ews-gp">الدرجة: <input type="number" class="ews-gm" min="0" max="${D.where.marks}" value="${r.t_score != null ? r.t_score : r.self_score}"> / ${D.where.marks}</div>`
          : `<div class="ews-gp">${D.exam.points.map((p, i) => `<label><input type="checkbox" data-pt="${i}" ${(tm.pts || [])[i] ? "checked" : ""}> ${esc(p.split(":")[0])}</label>`).join("")}</div>
          <div class="ews-gp">الجودة: ${D.quality.map((q) => `<label><input type="radio" name="gq${s.id}" value="${q[0]}" ${tm.q === q[0] ? "checked" : ""}> ${q[0]}</label>`).join("")}</div>`}
          <textarea class="mdr-ta" rows="2" placeholder="ملاحظة للطالب">${esc(r.t_note || "")}</textarea><button class="btn btn-primary btn-small ews-gs">💾 حفظ الدرجة</button></div>`; }).join("") || `<p class="muted">لم يسلّم أحد بعد.</p>`}</div>`;
      el.querySelectorAll("[data-cls]").forEach((b) => b.onclick = () => { cur = b.dataset.cls; draw(); });
      el.querySelectorAll(".ews-g").forEach((g) => g.querySelector(".ews-gs").onclick = async () => { if (D.type === "items") { const it = [...g.querySelectorAll(".ews-gi")].map((x) => +x.value), mk = it.reduce((a, b) => a + b, 0);
          const { error } = await sb.rpc("ews_grade", { p_lesson: l.id, p_student: g.dataset.st, p_marks: { it }, p_score: mk, p_note: g.querySelector("textarea").value.trim() || null });
          if (error) toast("تعذّر الحفظ: " + error.message); else { toast(`حُفظت الدرجة ${mk}/${D.where.marks}`); draw(); } return; }
        if (D.grids) { const gb = [], gs = [];
          for (let gi = 0; gi < D.grids.length; gi++) { const G = D.grids[gi], b = g.querySelector(`input[name="gb${gi}_${g.dataset.st}"]:checked`), mk = +g.querySelector(`.ews-gm[data-g="${gi}"]`).value;
            if (!b) { toast(`اختر المستوى في «${G.t}»`); return; } const B = G.bands[+b.value]; if (!(mk >= B[0] && mk <= B[1])) { toast(`«${G.t}»: الدرجة في هذا المستوى بين ${B[0]} و${B[1]}`); return; } gb.push(+b.value); gs.push(mk); }
          const mk = gs.reduce((a, b) => a + b, 0);
          const { error } = await sb.rpc("ews_grade", { p_lesson: l.id, p_student: g.dataset.st, p_marks: { gb, gs }, p_score: mk, p_note: g.querySelector("textarea").value.trim() || null });
          if (error) toast("تعذّر الحفظ: " + error.message); else { toast(`حُفظت الدرجة ${mk}/${D.where.marks}`); draw(); } return; }
        if (D.type === "levels") { const b = g.querySelector(`input[name="gb${g.dataset.st}"]:checked`), mk = +g.querySelector(".ews-gm").value;
          if (!b) { toast("اختر المستوى"); return; } const B = D.bands[+b.value]; if (!(mk >= B[0] && mk <= B[1])) { toast(`الدرجة في هذا المستوى بين ${B[0]} و${B[1]}`); return; }
          const { error } = await sb.rpc("ews_grade", { p_lesson: l.id, p_student: g.dataset.st, p_marks: { band: +b.value, mark: mk }, p_score: mk, p_note: g.querySelector("textarea").value.trim() || null });
          if (error) toast("تعذّر الحفظ: " + error.message); else { toast(`حُفظت الدرجة ${mk}/${D.where.marks}`); draw(); } return; }
        const pts = [...g.querySelectorAll("[data-pt]")].map((c) => c.checked ? 1 : 0), q = g.querySelector(`input[name="gq${g.dataset.st}"]:checked`);
        if (!q) { toast("اختر مستوى الجودة"); return; } const sc = pts.reduce((a, b) => a + b, 0) + +q.value;
        const { error } = await sb.rpc("ews_grade", { p_lesson: l.id, p_student: g.dataset.st, p_marks: { pts, q: +q.value }, p_score: sc, p_note: g.querySelector("textarea").value.trim() || null });
        if (error) toast("تعذّر الحفظ: " + error.message); else { toast(`حُفظت الدرجة ${sc}/${D.where.marks}`); draw(); } });
    };
    draw();
  }

  // ---------- قياس القراءة في بداية السنة ووسطها ونهايتها (نص ثابت لكل صف) ----------
  // نص القياس: من قائمة الصف التالي (يدرسه الطالب في السنة القادمة)، والتاسع من قائمة الثامن؛ فيه 3 أسئلة اختيار على الأقل، وطوله مناسب للمستوى
  const MDR_RND = { boy: ["🌱", "بداية السنة"], moy: ["🌿", "منتصف السنة"], eoy: ["🌳", "نهاية السنة"] };
  const mdrRound = (d = new Date()) => { const m = d.getMonth(); return m >= 7 && m <= 10 ? "boy" : m >= 3 && m <= 6 ? "eoy" : "moy"; };
  const MDR_BENCH = { 4: "Bn18", 5: "Mi03", 6: "Mi01", 7: "Ai13", 8: "An05", 9: "An02" };
  async function mdrBenchText(year) { return MDR_BENCH[year] || null; }
  async function pageReadBench() {
    loading(); state.pageSubject = "arabic"; setTheme();
    const head = `<section class="page-head"><div class="wrap"><div class="crumbs"><a href="#/">الرئيسية</a> / <a href="#/grades?subject=arabic">اللغة العربية</a> / 📏 قياس القراءة</div>
      <h1>📏 قِياسُ الْقِراءَةِ</h1><p class="muted">ثلاث مرات في السنة (البداية والمنتصف والنهاية) يقرأ الطالب النص نفسه بصوت مسموع ويُسجَّل صوته، ثم يجيب عن أسئلته؛ فيقيس المعلم من التسجيل الكلماتِ الصحيحة في الدقيقة، ويظهر نموّ الطالب خلال السنة.</p></div></section>`;
    if (!state.session) { h(head + `<section class="wrap panel"><div class="form-card empty"><strong>سجّل الدخول لتبدأ القياس</strong></div></section>`); return; }
    h(head + `<section class="wrap panel" id="rbBox"><div class="loading">جارٍ التحميل…</div></section>`);
    const box = document.getElementById("rbBox");
    if (isStudent() && !state.viewAs) return rbStudent(box);
    if (isStaff()) return rbStaff(box);
    box.innerHTML = `<div class="form-card empty"><strong>هذه الصفحة للطلاب ومعلميهم</strong></div>`;
  }
  async function rbStudent(box) {
    const me = state.session.user.id, year = +(state.profile && state.profile.year_group);
    if (!(year >= 4 && year <= 9)) { box.innerHTML = `<div class="form-card empty"><strong>القياس متاح للصفوف 4–9</strong></div>`; return; }
    const tid = await mdrBenchText(year), X = await mdrGet(tid), rnd = mdrRound();
    const { data } = await sb.from("reading_bench").select("*").eq("student_id", me).eq("year_group", year);
    const B = {}; (data || []).forEach((r) => { B[r.round] = r; });
    const cards = Object.keys(MDR_RND).map((k) => { const r = B[k]; return `<div class="rb-card ${k === rnd ? "cur" : ""} ${r ? "done" : ""}"><b>${MDR_RND[k][0]} ${MDR_RND[k][1]}</b>
      ${r ? `<span>⏱️ ${r.wpm || "—"} كلمة/دقيقة</span><span>❓ الفهم <bdi dir="ltr">${r.comp_score}/${r.comp_max}</bdi></span>${r.wcpm != null ? `<span class="ok">✔ ${r.wcpm} كلمة صحيحة/دقيقة · دقة ${r.accuracy}%</span>` : `<small class="muted">${r.rec_path ? "⏳ ينتظر قياس معلمك" : ""}</small>`}` : k === rnd ? `<small>متاح الآن</small>` : `<small class="muted">${k === "boy" ? "أغسطس–نوفمبر" : k === "moy" ? "ديسمبر–مارس" : "أبريل–يوليو"}</small>`}</div>`; }).join("");
    const canRun = !(B[rnd] && B[rnd].wcpm != null);
    box.innerHTML = `<div class="mdr-card"><h3>نتائجي في الصف ${MDR_GN[year]}</h3><div class="rb-cards">${cards}</div></div>
      <div class="mdr-card" id="rbRun">${canRun ? `<h3>${MDR_RND[rnd][0]} قياس ${MDR_RND[rnd][1]}${B[rnd] ? " (إعادة)" : ""}</h3>
        <ol class="rb-steps"><li>اجلس في مكان هادئ، واسمح للموقع باستخدام الميكروفون.</li><li>اضغط «ابدأ»، واقرأ النص كله بصوت مسموع وبسرعتك الطبيعية، دون تعجّل.</li><li>اضغط «انتهيت»، ثم أجب عن الأسئلة دون الرجوع إلى النص.</li></ol>
        <button class="btn btn-primary" id="rbGo">🎙️ ابدأ</button>` : `<p class="muted">✅ أتممت قياس ${MDR_RND[rnd][1]}، وقاسه معلمك.</p>`}</div>`;
    const go = box.querySelector("#rbGo"); if (!go) return;
    go.onclick = async () => {
      const run = box.querySelector("#rbRun"); let stream = null, rec = null, ch = [], blob = null;
      try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); const mt = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/aac"].find((t) => window.MediaRecorder && MediaRecorder.isTypeSupported(t)) || "";
        rec = new MediaRecorder(stream, mt ? { mimeType: mt } : undefined); rec.ondataavailable = (e) => { if (e.data.size) ch.push(e.data); }; rec.start(); } catch (e) { toast("لم يُسمح بالميكروفون؛ سيُقاس الوقت فقط"); }
      const t0 = Date.now();
      run.innerHTML = `<div class="rb-top"><span class="stu-dot ${rec ? "on" : ""}"></span><span class="mdr-big" id="rbT">0:00</span><button class="btn btn-primary" id="rbEnd">✅ انتهيت</button></div>
        <h2 class="rb-title">«${esc(X.t)}»</h2><div class="mdr-text rb-tx">${X.text.map((p) => `<p>${esc(p)}</p>`).join("")}</div>`;
      const tmr = setInterval(() => { const s = Math.floor((Date.now() - t0) / 1000); const el = run.querySelector("#rbT"); if (el) el.textContent = Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); if (s >= 900) run.querySelector("#rbEnd").click(); }, 250);
      run.querySelector("#rbEnd").onclick = async () => { clearInterval(tmr); const sec = Math.max(1, Math.round((Date.now() - t0) / 1000));
        if (rec) { await new Promise((ok) => { rec.onstop = ok; rec.stop(); }); blob = new Blob(ch, { type: (rec.mimeType || "audio/webm").split(";")[0] }); try { stream.getTracks().forEach((t) => t.stop()); } catch (e) {} }
        const Q = X.qs.map((q, j) => [q, j]).filter(([q]) => q.k === "m").slice(0, 5);
        run.innerHTML = `<h3>❓ أجب دون الرجوع إلى النص</h3>${Q.map(([q, j]) => `<div class="mdr-q"><b>${esc(q.q)}</b><div class="mdr-opts">${q.o.map((o, k) => `<label class="mdr-opt"><input type="radio" name="rb${j}" value="${k}"> ${esc(o)}</label>`).join("")}</div></div>`).join("")}
          <p class="form-error" id="rbErr"></p><button class="btn btn-primary" id="rbSend">📤 أرسل النتيجة</button>`;
        run.querySelector("#rbSend").onclick = async () => { const ans = {}; let sc = 0; for (const [q, j] of Q) { const v = run.querySelector(`input[name="rb${j}"]:checked`); if (!v) { run.querySelector("#rbErr").textContent = "أجب عن كل الأسئلة."; return; } ans[j] = +v.value; if (+v.value === q.c) sc++; }
          const b = run.querySelector("#rbSend"); b.disabled = true; let path = null;
          if (blob && blob.size) { path = `${me}/bench-${rnd}-${Date.now()}.${/mp4|aac/.test(blob.type) ? "m4a" : "webm"}`; const up = await sb.storage.from("recitations").upload(path, blob, { contentType: blob.type });
            if (up.error) { path = null; toast("تعذّر رفع التسجيل؛ حُفظت النتيجة دونه"); } }
          const { error } = await sb.rpc("bench_save", { p_year: year, p_round: rnd, p_text: X.id, p_seconds: sec, p_wpm: Math.round(X.w * 60 / sec) <= 250 ? Math.round(X.w * 60 / sec) : null, p_score: sc, p_max: Q.length, p_answers: ans, p_rec: path, p_rec_sec: path ? sec : null });
          if (error) { b.disabled = false; run.querySelector("#rbErr").textContent = "تعذّر الحفظ: " + error.message; return; }
          toast("أُرسل القياس إلى معلمك"); rbStudent(box); };
      };
    };
  }
  async function rbStaff(box) {
    const { data: tc } = await sb.from("class_teachers").select("classes(id, name, year_group, track, subject_id)").eq("teacher_id", state.session.user.id);
    let cls = (tc || []).map((x) => x.classes).filter((c) => c && c.track === "native" && c.subject_id === 2 && c.year_group >= 4 && c.year_group <= 9);
    if (!cls.length && (isSchoolAdmin() || isSuper()) && state.profile && state.profile.school_id) { const { data } = await sb.from("classes").select("id, name, year_group").eq("school_id", state.profile.school_id).eq("track", "native").eq("subject_id", 2).gte("year_group", 4).lte("year_group", 9).order("year_group"); cls = data || []; }
    if (!cls.length) { box.innerHTML = `<div class="form-card empty"><strong>لا توجد فصول عربية (ناطقين، 4–9) مرتبطة بك</strong></div>`; return; }
    let cur = cls[0];
    const draw = async () => {
      const { data: roster } = await sb.from("class_students").select("student_id, profiles(full_name_ar)").eq("class_id", cur.id);
      const SS = (roster || []).map((r) => ({ id: r.student_id, name: (r.profiles && r.profiles.full_name_ar) || "—" })).sort((a, b) => a.name.localeCompare(b.name, "ar"));
      const { data } = SS.length ? await sb.from("reading_bench").select("*").eq("year_group", cur.year_group).in("student_id", SS.map((s) => s.id)) : { data: [] };
      const B = {}; (data || []).forEach((r) => { (B[r.student_id] = B[r.student_id] || {})[r.round] = r; });
      const X = await mdrGet(await mdrBenchText(cur.year_group)); const RK = Object.keys(MDR_RND); const val = (r) => r ? (r.wcpm != null ? r.wcpm : r.wpm) : null;
      const avg = (k) => { const v = SS.map((s) => val((B[s.id] || {})[k])).filter((x) => x != null); return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : "—"; };
      box.innerHTML = `<div class="rd-cls">${cls.map((c) => `<button class="btn btn-small ${c.id === cur.id ? "btn-primary" : "btn-ghost"}" data-cls="${c.id}">${esc(c.name)}</button>`).join("")}</div>
        <div class="mdr-card"><h3>📏 قياس القراءة · ${esc(cur.name)}</h3><p class="muted">نص القياس للصف ${MDR_GN[cur.year_group]}: «${esc(X.t)}» (${X.w} كلمة). الرقم بعلامة ✔ قياسك من التسجيل، وبدونها قياس الطالب الذاتي. القياس المفتوح الآن: ${MDR_RND[mdrRound()][1]}.</p>
        <div class="lp-stats">${RK.map((k) => `<div><b>${avg(k)}</b><small>متوسط ${MDR_RND[k][1]}</small></div>`).join("")}</div>
        <div class="lp-tw"><table class="lp-tbl rb-tbl"><thead><tr><th>الطالب</th>${RK.map((k) => `<th>${MDR_RND[k][0]} ${MDR_RND[k][1]}</th>`).join("")}<th>النمو</th></tr></thead><tbody>
        ${SS.map((s) => { const R = B[s.id] || {}; const L2 = R.eoy || R.moy, both = R.boy && L2 && R.boy.wcpm != null && L2.wcpm != null; const f = R.boy ? (both ? R.boy.wcpm : R.boy.wpm) : null, l2 = L2 ? (both ? L2.wcpm : L2.wpm) : null;
          return `<tr><td><a href="#/readreport/${s.id}">${esc(s.name)}</a></td>${RK.map((k) => { const r = R[k]; return `<td>${r ? `${r.wcpm != null ? `<b>✔ ${r.wcpm}</b> <small>(${r.accuracy}%)</small>` : `${r.wpm || "—"} <small class="muted">ذاتي</small>`}<br><small>فهم <bdi dir="ltr">${r.comp_score}/${r.comp_max}</bdi></small>${r.rec_path ? `<br><button class="btn btn-ghost btn-small rb-m" data-id="${r.id}">🎧 ${r.wcpm != null ? "أعِد" : "قِس"}</button>` : ""}` : "—"}</td>`; }).join("")}
          <td>${f != null && l2 != null ? `<b class="${l2 >= f ? "rb-up" : "rb-dn"}">${l2 >= f ? "+" : ""}${l2 - f}</b>` : "—"}</td></tr>`; }).join("") || `<tr><td colspan="5">لا يوجد طلاب</td></tr>`}</tbody></table></div></div>`;
      box.querySelectorAll("[data-cls]").forEach((b) => b.onclick = () => { cur = cls.find((c) => c.id === b.dataset.cls); draw(); });
      box.querySelectorAll(".rb-m").forEach((b) => b.onclick = () => { const r = (data || []).find((x) => x.id === b.dataset.id); const s = SS.find((x) => x.id === r.student_id);
        mdrFluDlg(X, null, s, { id: r.id, audio_path: r.rec_path, duration_sec: r.rec_sec }, r, draw, (c, mk) => sb.rpc("bench_measure", { p_id: r.id, p_wcpm: c.wcpm, p_acc: c.acc, p_marks: mk })); });
    };
    draw();
  }

  // ---------- أستوديو التسجيل: تسجيل القراءة النموذجية من المتصفح ومزامنة توقيت الجمل ----------
  // ملف التوقيت madarij/<id>.json = { v:1, w:[أول كلمة في كل جملة], s:[بداية كل جملة بالثواني], d:المدة }
  function mdrSentStarts(X) { const st = [0]; let i = 0;
    X.text.forEach((p, pi) => { if (pi && st[st.length - 1] !== i) st.push(i); p.split(" ").forEach((w) => { i++; if (/[.؟!?:؛]$/.test(w)) st.push(i); }); });
    return st.filter((v, k, a) => v < i && a.indexOf(v) === k); }
  function mdrWordTimes(T, WW) { const out = new Array(WW.length).fill(0), w = T.w, s = T.s;
    for (let k = 0; k < w.length; k++) { const a = w[k], b = k + 1 < w.length ? w[k + 1] : WW.length, t0 = s[k], t1 = k + 1 < s.length ? s[k + 1] : T.d;
      const tot = WW.slice(a, b).reduce((x, y) => x + y, 0) || 1; let acc = 0; for (let i = a; i < b; i++) { out[i] = t0 + (acc / tot) * (t1 - t0); acc += WW[i]; } }
    return out; }
  function mdrStudio(X, WW, audName, done) {
    const words = []; X.text.forEach((p) => p.split(" ").forEach((w) => words.push(w)));
    const ST = mdrSentStarts(X), N = ST.length;
    let d = document.getElementById("mdrStu"); if (!d) { d = document.createElement("dialog"); d.id = "mdrStu"; d.className = "wide-dlg mdr-stu"; document.body.appendChild(d); }
    let mode = null, k = -1, marks = [], blob = null, url = audName ? mdrAudUrl(audName) : null, dur = 0, rec = null, stream = null, t0 = 0, au = null, prev = null;
    const sentHtml = () => ST.map((a, j) => { const b = j + 1 < N ? ST[j + 1] : words.length; return `<span class="stu-s" data-k="${j}">${words.slice(a, b).map(esc).join(" ")}</span>`; }).join(" ");
    const stopAll = () => { try { if (rec && rec.state !== "inactive") rec.stop(); } catch (e) {} try { stream && stream.getTracks().forEach((t) => t.stop()); } catch (e) {} try { au && au.pause(); } catch (e) {} try { prev && prev.pause(); } catch (e) {} document.removeEventListener("keydown", key); };
    const now = () => mode === "rec" ? (performance.now() - t0) / 1000 : au ? au.currentTime : 0;
    const paint = () => { d.querySelectorAll(".stu-s").forEach((e) => { const j = +e.dataset.k; e.className = "stu-s" + (j === k ? " cur" : j < k ? " done" : ""); });
      const c = d.querySelector(".stu-s.cur"); if (c) c.scrollIntoView({ block: "center", behavior: "smooth" });
      const nb = d.querySelector("#stuN"); if (nb) nb.textContent = k < N - 1 ? `⏭️ الجملة التالية (${k + 2} من ${N})` : "⏹️ إنهاء"; };
    const finish = () => { dur = now(); k = -1; if (mode === "rec") { mode = "done"; try { rec.stop(); } catch (e) { draw(); } return; } try { au.pause(); } catch (e) {} mode = "done"; draw(); };
    const next = () => { if (mode !== "rec" && mode !== "sync") return; if (k < N - 1) { k++; marks[k] = k === 0 ? 0 : +now().toFixed(2); paint(); } else finish(); };
    const key = (e) => { if ((e.key === " " || e.key === "Enter") && (mode === "rec" || mode === "sync")) { e.preventDefault(); next(); } };
    const draw = () => {
      d.innerHTML = `<h2 style="font-size:1.2rem">🎙️ أستوديو التسجيل · «${esc(X.t)}»</h2>
        <p class="muted">${mode === "rec" || mode === "sync" ? "اضغط «الجملة التالية» أو مفتاح المسافة لحظةَ بدئك كل جملة، فيتزامن تظليل الكلمات مع صوتك." : mode === "done" ? "استمع إلى المعاينة وتابع التظليل، ثم احفظ أو أعِد." : `قسّمنا النص إلى ${N} جملة. سجّل بصوتك من المتصفح، أو زامِن تسجيلًا مرفوعًا: في الحالتين تنقر عند بداية كل جملة.`}</p>
        <div class="stu-tx mdr-text sm">${sentHtml()}</div>
        <div class="stu-bar">${!mode ? `<button class="btn btn-primary" id="stuRec">⏺️ ابدأ التسجيل</button>${url ? `<button class="btn btn-ghost" id="stuSync">⏱️ زامِن التسجيل الحالي</button>` : ""}`
          : mode === "rec" || mode === "sync" ? `<span class="stu-dot ${mode === "rec" ? "on" : ""}"></span><span id="stuT" class="mdr-big">0:00</span><button class="btn btn-primary stu-next" id="stuN"></button><button class="btn btn-ghost btn-small" id="stuX0">إلغاء</button>`
          : `<button class="btn btn-ghost" id="stuP">▶️ معاينة</button><button class="btn btn-primary" id="stuSave">💾 حفظ</button><button class="btn btn-ghost" id="stuAgain">↺ أعِد</button><span class="muted">المدة ${Math.round(dur)} ثانية · ${N} جملة</span>`}</div>
        <p class="form-error" id="stuErr"></p><div class="dialog-actions"><button class="btn btn-ghost" id="stuX">إغلاق</button></div>`;
      const $ = (q) => d.querySelector(q);
      $("#stuX").onclick = () => { stopAll(); d.close(); };
      if ($("#stuRec")) $("#stuRec").onclick = async () => { try { stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }); } catch (e) { $("#stuErr").textContent = "لم يُسمح باستخدام الميكروفون."; return; }
        const mt = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"].find((t) => window.MediaRecorder && MediaRecorder.isTypeSupported(t)) || "";
        const ch = []; rec = new MediaRecorder(stream, mt ? { mimeType: mt } : undefined); rec.ondataavailable = (e) => { if (e.data.size) ch.push(e.data); };
        rec.onstop = () => { blob = new Blob(ch, { type: (rec.mimeType || mt || "audio/webm").split(";")[0] }); url = URL.createObjectURL(blob); try { stream.getTracks().forEach((t) => t.stop()); } catch (e) {} if (mode === "done") draw(); };
        rec.start(); t0 = performance.now(); mode = "rec"; marks = []; k = -1; draw(); next(); tick(); };
      if ($("#stuSync")) $("#stuSync").onclick = () => { blob = null; au = new Audio(url); au.onended = () => { if (mode === "sync") finish(); }; au.play(); mode = "sync"; marks = []; k = -1; draw(); next(); tick(); };
      if ($("#stuN")) { $("#stuN").onclick = next; paint(); }
      if ($("#stuX0")) $("#stuX0").onclick = () => { stopAll(); mode = null; blob = null; url = audName ? mdrAudUrl(audName) : null; draw(); };
      if ($("#stuAgain")) $("#stuAgain").onclick = () => { try { prev && prev.pause(); } catch (e) {} mode = null; draw(); };
      if ($("#stuP")) $("#stuP").onclick = () => { const T = { w: ST, s: marks, d: dur }, wt = mdrWordTimes(T, WW); const ss = [...d.querySelectorAll(".stu-s")];
        if (prev) { prev.pause(); prev = null; ss.forEach((e) => e.className = "stu-s"); $("#stuP").textContent = "▶️ معاينة"; return; }
        const pa = new Audio(url); prev = pa; $("#stuP").textContent = "⏸ إيقاف"; pa.ontimeupdate = () => { if (prev !== pa) return; const t = pa.currentTime; let j = 0; while (j < N - 1 && marks[j + 1] <= t) j++; ss.forEach((e, q) => e.className = "stu-s" + (q === j ? " cur" : q < j ? " done" : "")); };
        pa.onended = () => { prev = null; $("#stuP").textContent = "▶️ معاينة"; }; pa.play(); };
      if ($("#stuSave")) $("#stuSave").onclick = async () => { const b = $("#stuSave"), er = $("#stuErr"); b.disabled = true; er.textContent = "";
        try { if (prev) prev.pause();
          if (blob) { if (blob.size > 10 * 1024 * 1024) throw new Error("التسجيل أكبر من 10 ميجابايت؛ سجّل النص على مقطعين أو ارفع ملف mp3."); const ext = /mp4/.test(blob.type) ? "m4a" : /ogg/.test(blob.type) ? "ogg" : "webm";
            if (audName) await sb.storage.from("reader-audio").remove(["madarij/" + audName]);
            const up = await sb.storage.from("reader-audio").upload("madarij/" + X.id + "." + ext, blob, { contentType: ext === "m4a" ? "audio/mp4" : blob.type, upsert: true }); if (up.error) throw up.error; }
          const tj = new Blob([JSON.stringify({ v: 1, w: ST, s: marks, d: +dur.toFixed(2) })], { type: "application/json" });
          const up2 = await sb.storage.from("reader-audio").upload("madarij/" + X.id + ".json", tj, { contentType: "application/json", upsert: true }); if (up2.error) throw up2.error;
          toast(blob ? "حُفظ التسجيل والتوقيت" : "حُفظ التوقيت"); stopAll(); d.close(); done(); }
        catch (e) { b.disabled = false; er.textContent = "تعذّر الحفظ: " + (e.message || e); } };
    };
    const tick = () => { if (mode !== "rec" && mode !== "sync") return; const el = d.querySelector("#stuT"); if (el) { const s = Math.floor(now()); el.textContent = Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); } setTimeout(tick, 250); };
    document.addEventListener("keydown", key); d.onclose = stopAll; draw(); d.showModal();
  }

  // ---------- وضع العرض على السبورة ----------
  function mdrBoard(X) {
    const S = X.strat, slides = [];
    slides.push(() => `<div class="bd-c"><div class="bd-kick">📗 مدارج القراءة · ${X.kind === "i" ? "نص معلوماتي" : "نص سردي"}</div><h1>«${esc(X.t)}»</h1>${X.img ? `<img class="bd-img" src="${X.img}" alt="">` : ""}
      <div class="bd-strat">${S.ic} أسلوب القراءة: <b>${esc(S.n)}</b></div><p class="bd-q">✏️ ${esc(S.p)}</p></div>`);
    const GL = {}; (X.gl || []).forEach((g) => { GL[mdrStem(g[0])] = g; });
    X.text.forEach((p, i) => slides.push(() => `<div class="bd-tx"><div class="bd-kick">الفقرة ${i + 1} من ${X.text.length} · ${S.ic} ${esc(S.d[0] || "")}</div>
      <p>${p.split(" ").map((w) => { const g = GL[mdrStem(w)]; return g ? `<span class="bd-gw" title="${esc(g[1])}">${esc(w)}</span>` : esc(w); }).join(" ")}</p><div class="bd-mean" hidden></div></div>`));
    X.qs.forEach((q, j) => slides.push(() => `<div class="bd-c bd-qs"><div class="bd-kick">سؤال ${j + 1} من ${X.qs.length} · ${MDR_SK[q.pk || "ret"][0]} ${MDR_SK[q.pk || "ret"][1]}</div><h2>${esc(q.q)}</h2>
      ${q.k === "m" ? `<div class="bd-opts">${q.o.map((o, k) => `<div class="bd-opt" data-ok="${k === q.c ? 1 : 0}"><span>${"أبجد"[k] || k + 1}</span>${esc(o)}</div>`).join("")}</div>${q.why ? `<p class="bd-why" hidden>💡 ${esc(q.why)}</p>` : ""}`
        : q.k === "o" ? `<p class="bd-why" hidden>💡 ${esc(q.a || "")}</p>` : q.k === "r" ? `<ol class="bd-why" hidden>${q.seq.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>` : q.items ? `<div class="bd-why" hidden>${q.items.map((it) => `<div>${esc(it[0])} ← <b>${esc(q.bins[it[1]])}</b></div>`).join("")}</div>` : ""}
      <button class="bd-btn bd-rev">👁️ اكشف الإجابة</button></div>`));
    slides.push(() => `<div class="bd-c"><div class="bd-kick">✍️ التعبير</div><h2>${esc(X.expr.w)}</h2><div class="bd-strat">🗣️ ${esc(X.expr.o)}</div></div>`);
    let i = 0, fs = 0, ruler = 0;
    const ov = document.createElement("div"); ov.className = "mdr-board"; ov.setAttribute("dir", "rtl"); document.body.appendChild(ov);
    const close = () => { document.removeEventListener("keydown", key); try { if (document.fullscreenElement) document.exitFullscreen(); } catch (e) {} ov.remove(); };
    const draw = () => { ov.innerHTML = `<div class="bd-top"><button class="bd-btn" data-a="x">✕ إغلاق</button><span>${i + 1} / ${slides.length}</span>
        <span class="bd-tools"><button class="bd-btn" data-a="f-">أ−</button><button class="bd-btn" data-a="f+">أ+</button><button class="bd-btn ${ruler ? "on" : ""}" data-a="r">📏</button><button class="bd-btn" data-a="fs">⛶</button></span></div>
      <div class="bd-main" style="font-size:${(1 + fs * 0.12).toFixed(2)}em">${slides[i]()}</div>
      <div class="bd-nav"><button class="bd-btn" data-a="p" ${i ? "" : "disabled"}>→ السابق</button><div class="bd-dots">${slides.map((_, k) => `<i class="${k === i ? "on" : ""}"></i>`).join("")}</div><button class="bd-btn" data-a="n" ${i < slides.length - 1 ? "" : "disabled"}>التالي ←</button></div>`;
      ov.querySelectorAll("[data-a]").forEach((b) => b.onclick = () => act(b.dataset.a));
      const rv = ov.querySelector(".bd-rev"); if (rv) rv.onclick = () => { ov.querySelectorAll(".bd-opt").forEach((o) => o.classList.add(o.dataset.ok === "1" ? "ok" : "dim")); ov.querySelectorAll(".bd-why").forEach((w) => { w.hidden = false; }); rv.remove(); };
      ov.querySelectorAll(".bd-opt").forEach((o) => o.onclick = () => o.classList.toggle("pick"));
      ov.querySelectorAll(".bd-gw").forEach((g) => g.onclick = () => { const m = ov.querySelector(".bd-mean"); m.hidden = false; m.innerHTML = `<b>${esc(g.textContent)}</b>: ${esc(g.title)}`; });
      const tx = ov.querySelector(".bd-tx p"); if (tx && ruler) { tx.style.position = "relative"; const r = document.createElement("div"); r.className = "mdr-ruler"; tx.appendChild(r); const lh = () => parseFloat(getComputedStyle(tx).lineHeight) || 60;
        const mv = (y) => { const b = tx.getBoundingClientRect(), h2 = lh(); const ln = Math.max(0, Math.floor((y - b.top) / h2)); r.style.height = h2 + "px"; r.style.top = Math.min(tx.scrollHeight - h2, ln * h2) + "px"; };
        tx.onpointermove = (e) => mv(e.clientY); tx.onpointerdown = (e) => mv(e.clientY); mv(tx.getBoundingClientRect().top + 2); } };
    const act = (a) => { if (a === "x") return close(); if (a === "n" && i < slides.length - 1) i++; if (a === "p" && i > 0) i--; if (a === "f+") fs = Math.min(5, fs + 1); if (a === "f-") fs = Math.max(-2, fs - 1); if (a === "r") ruler = ruler ? 0 : 1;
      if (a === "fs") { try { if (document.fullscreenElement) document.exitFullscreen(); else ov.requestFullscreen(); } catch (e) {} } draw(); };
    const key = (e) => { if (e.key === "Escape" && !document.fullscreenElement) close(); else if (e.key === "ArrowLeft" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); act("n"); } else if (e.key === "ArrowRight" || e.key === "PageUp") act("p"); };
    document.addEventListener("keydown", key); draw();
  }

  // ---------- تقرير القراءة لوليّ الأمر (بطاقة في صفحة وليّ الأمر + صفحة كاملة للطباعة) ----------
  const MDR_HOME = {
    ret: "بعد القراءة اسأله: مَن؟ ماذا؟ أين؟ متى؟ واطلب منه أن يشير إلى الجملة التي فيها الجواب.",
    inf: "اسأله: لماذا فعلت الشخصية ذلك؟ كيف عرفت؟ وشجّعه أن يذكر الدليل من النص.",
    int: "اطلب منه أن يلخّص ما قرأه في ثلاث جمل، وأن يربط فكرته بموقف من حياته.",
    eva: "اسأله: هل أعجبك أسلوب الكاتب؟ ما رأيك في تصرّف الشخصية؟ ولماذا؟",
    flu: "اقرأ معه فقرة بصوت مسموع عشر دقائق يوميًّا: تقرأ أنت أولًا، ثم يعيدها هو بالطريقة نفسها."
  };
  async function mdrKidData(kid, year) {
    const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString();
    const [{ data: rows }, { data: logs }, { data: pr }, { data: exw }] = await Promise.all([
      sb.from("lesson_reading").select("lesson_id, text_id, score, max_score, quiz_at, expr_at, wpm, wcpm, accuracy, skills, act, expr_rubric, expr_feedback, updated_at").eq("student_id", kid),
      sb.from("reading_log").select("id, title, author, status, reviewed_at, created_at").eq("student_id", kid).order("created_at", { ascending: false }),
      sb.from("profiles").select("school_id, year_group").eq("id", kid).maybeSingle(),
      sb.from("exam_ws").select("lesson_id, self_score, t_score, max_score, submitted_at, graded_at, lessons(title_ar, code)").eq("student_id", kid).not("submitted_at", "is", null).order("submitted_at", { ascending: false }).limit(5)]);
    const R = (rows || []).filter((r) => r.quiz_at), L = logs || [];
    let target = null; if (pr && pr.school_id) { const { data: t } = await sb.from("reading_targets").select("wpm").eq("school_id", pr.school_id).eq("year_group", +(year || pr.year_group)).maybeSingle(); target = t ? t.wpm : null; }
    const sk = { ret: [0, 0], inf: [0, 0], int: [0, 0], eva: [0, 0] }; R.forEach((r) => Object.keys(sk).forEach((k) => { const v = (r.skills || {})[k]; if (v) { sk[k][0] += v[0]; sk[k][1] += v[1]; } }));
    const pc = (a) => a[1] ? Math.round(a[0] * 100 / a[1]) : null;
    const weak = Object.keys(sk).filter((k) => sk[k][1] >= 2 && pc(sk[k]) < 80).sort((a, b) => pc(sk[a]) - pc(sk[b]))[0] || null;
    const fl = R.concat((rows || []).filter((r) => !r.quiz_at)).filter((r) => r.wcpm != null || r.wpm).sort((a, b) => a.updated_at < b.updated_at ? -1 : 1);
    const lastF = fl.length ? fl[fl.length - 1] : null, flv = lastF ? (lastF.wcpm != null ? lastF.wcpm : lastF.wpm) : null;
    return { R, L, E: exw || [], all: rows || [], target, sk, pc, weak, flv, flm: lastF && lastF.wcpm != null, acc: lastF && lastF.accuracy,
      wkTexts: R.filter((r) => r.updated_at >= weekAgo).length, wkBooks: L.filter((x) => x.status === "approved" && x.reviewed_at >= weekAgo).length,
      books: L.filter((x) => x.status === "approved").length, pts: R.reduce((a, r) => a + mdrPts(r), 0) };
  }
  function mdrKidHtml(D, name, total) {
    const tips = []; if (D.weak) tips.push([MDR_SK[D.weak][0] + " " + MDR_SK[D.weak][1], MDR_HOME[D.weak]]);
    if (D.target && D.flv && D.flv < D.target) tips.push(["⏱️ الطلاقة", MDR_HOME.flu]);
    return `<div class="week-card mdr-kid"><h3>📗 القراءة العربية</h3>
      <div class="week-nums"><div><b>${D.wkTexts}</b><span>نصوص هذا الأسبوع</span></div><div><b>${D.R.length}${total ? "/" + total : ""}</b><span>نصوص السنة</span></div>
        <div><b>${D.books}/50</b><span>كتبًا حرة معتمدة${D.wkBooks ? ` (+${D.wkBooks} هذا الأسبوع)` : ""}</span></div>
        <div><b>${D.flv || "—"}${D.flm ? " ✔" : ""}</b><span>كلمة في الدقيقة${D.target ? ` · الهدف ${D.target}` : ""}${D.flm && D.acc != null ? ` · دقة ${D.acc}%` : ""}</span></div></div>
      ${D.E && D.E.length ? `<div class="mdr-kid-ex"><b>🎯 أسئلة الامتحان (IGCSE/GCSE/A Level)</b>${D.E.slice(0, 3).map((e) => `<div><span>${esc((e.lessons && e.lessons.title_ar) || "")}</span><b>${e.graded_at ? `✔ ${e.t_score}/${e.max_score} <small>درجة المعلم</small>` : `${e.self_score}/${e.max_score} <small>تصحيح ذاتي</small>`}</b></div>`).join("")}</div>` : ""}
      ${tips.length ? tips.map((t) => `<p class="week-help">💡 <b>ساعده في ${t[0]}:</b> ${esc(t[1])}</p>`).join("") : D.R.length ? `<p class="muted">مستواه في الفهم جيد؛ شجّعه على الاستمرار وعلى قراءة كتاب حر من اختياره.</p>` : `<p class="muted">لم يبدأ نصوص القراءة بعد. شجّعه على قراءة نص الأسبوع.</p>`}
      ${name != null ? `<div class="week-acts"><a class="btn btn-ghost btn-small" href="#/readreport/${D.kid}">📄 التقرير الكامل</a><a class="btn btn-ghost btn-small" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent([`قراءة ${name} على حراء هذا الأسبوع:`, `📗 ${D.wkTexts} نصوص قراءة (${D.R.length} في السنة)`, `📚 ${D.books} كتب حرة معتمدة من 50`, D.flv ? `⏱️ ${D.flv} كلمة في الدقيقة${D.target ? " (الهدف " + D.target + ")" : ""}` : "", ...tips.map((t) => `💡 ${t[1]}`)].filter(Boolean).join("\n"))}">شاركه على واتساب</a></div>` : ""}</div>`;
  }
  async function mdrKidRead(el, kid, name, year, track) {
    try { const D = await mdrKidData(kid, year); D.kid = kid; const on = track === "native" && year >= 4 && year <= 9;
      if (!on && !D.L.length && !D.R.length && !D.E.length) return; const total = on ? ((await mdrIdxGet())[String(year)] || []).length : 0;
      el.innerHTML = mdrKidHtml(D, name, total); } catch (e) {}
  }
  async function pageReadReport(kid) {
    loading();
    const { data: p } = await sb.from("profiles").select("full_name_ar, year_group, track").eq("id", kid).maybeSingle();
    if (!p) { h(`<div class="wrap"><div class="form-card empty"><strong>لا يمكن عرض هذا التقرير</strong></div></div>`); return; }
    state.pageSubject = "arabic"; setTheme();
    const D = await mdrKidData(kid, p.year_group); D.kid = kid; const idx = (await mdrIdxGet())[String(p.year_group)] || []; const T = {}; idx.forEach((x) => { T[x.id] = x; });
    const d = new Date();
    h(`<section class="page-head"><div class="wrap"><div class="crumbs"><a href="#/">الرئيسية</a> / تقرير القراءة</div>
      <h1>📗 تقرير القراءة: ${esc(p.full_name_ar)}</h1><p class="muted">Grade ${p.year_group} · ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}</p>
      <div class="mdr-tools no-print"><button class="btn btn-ghost btn-small" onclick="print()">🖨️ طباعة</button></div></div></section>
      <section class="wrap panel mdr-rep">${mdrKidHtml(D, null, idx.length)}
      <div class="mdr-card"><h3>مستويات الفهم</h3><div class="mdr-skills">${Object.keys(D.sk).map((k) => `<div><span>${MDR_SK[k][0]} ${MDR_SK[k][1]}</span>${mdrBar(D.sk[k][0], D.sk[k][1])}<b>${D.pc(D.sk[k]) == null ? "—" : D.pc(D.sk[k]) + "%"}</b></div>`).join("")}</div></div>
      <div class="mdr-card"><h3>🛂 جوازات القراءة الحرة</h3>${rlogPassports(D.books)}</div>
      <div class="mdr-card"><h3>📖 نصوص «مدارج القراءة»</h3>${D.all.length ? `<div class="lp-tw"><table class="lp-tbl"><thead><tr><th>النص</th><th>الفهم</th><th>الطلاقة</th><th>التعبير</th><th>التاريخ</th></tr></thead><tbody>
        ${D.all.slice().sort((a, b) => a.updated_at < b.updated_at ? 1 : -1).map((r) => `<tr><td>${T[r.text_id] ? esc(T[r.text_id].t) : esc(r.text_id)}</td><td>${r.quiz_at ? `<bdi dir="ltr">${r.score}/${r.max_score}</bdi>` : "—"}</td><td>${r.wcpm != null ? `✔ ${r.wcpm} (${r.accuracy}%)` : r.wpm || "—"}${r.act && r.act.rr && r.act.rr.length > 1 ? ` <small>🔁 ${r.act.rr.join("←")}</small>` : ""}</td><td>${r.expr_rubric ? r.expr_rubric.map((v) => MDR_LV[v] || "—").join("، ") : r.expr_at ? "أُرسل" : "—"}</td><td>${new Date(r.updated_at).toLocaleDateString("en-GB")}</td></tr>`).join("")}</tbody></table></div>` : `<p class="muted">لا توجد نصوص بعد.</p>`}</div>
      <div class="mdr-card"><h3>📚 الكتب الحرة</h3>${D.L.length ? `<ul class="kid-list">${D.L.map((x) => `<li>${RLOG_ST[x.status][0]} ${esc(x.title)}${x.author ? " · " + esc(x.author) : ""}</li>`).join("")}</ul>` : `<p class="muted">لم يضف كتبًا بعد.</p>`}</div></section>`);
  }

  // ---------- سجل القراءة الحرة (على نظام «تحدي القراءة العربي»: 5 مراحل × 10 كتب) ----------
  const RLOG_ST = { pending: ["⏳", "بانتظار المعلم"], approved: ["✅", "معتمد"], returned: ["↩️", "أعاده المعلم للتعديل"] };
  const rlogWords = (s) => (String(s || "").trim().match(/\S+/g) || []).length;
  function rlogPassports(n) { // n = عدد الكتب المعتمدة
    return `<div class="rlog-pp">${[1, 2, 3, 4, 5].map((k) => { const got = Math.max(0, Math.min(10, n - (k - 1) * 10));
      return `<div class="rlog-p ${got === 10 ? "full" : got ? "on" : ""}"><b>الجواز ${["", "الأول", "الثاني", "الثالث", "الرابع", "الخامس"][k]}</b><div class="rlog-slots">${Array.from({ length: 10 }, (_, i) => `<i class="${i < got ? "on" : ""}"></i>`).join("")}</div><small><bdi dir="ltr">${got}/10</bdi>${got === 10 ? " · مكتمل ✅" : ""}</small></div>`; }).join("")}</div>`;
  }
  async function pageReadLog() {
    loading(); state.pageSubject = "arabic"; setTheme();
    const head = `<section class="page-head"><div class="wrap"><div class="crumbs"><a href="#/">الرئيسية</a> / <a href="#/grades?subject=arabic">اللغة العربية</a> / 📚 سجل القراءة الحرة</div>
      <h1>📚 سِجِلُّ الْقِراءَةِ الْحُرَّةِ</h1><p class="muted">اقرأ كتبًا من اختيارك خارج المنصة، ولخّص كل كتاب هنا، فيعتمده معلمك. على نظام «تحدي القراءة العربي»: خمسة جوازات، في كل جواز عشرة كتب، فالمجموع 50 كتابًا في السنة.</p></div></section>`;
    if (!state.session) { h(head + `<section class="wrap panel"><div class="form-card empty"><strong>سجّل الدخول بحساب الطالب لتبدأ سجلّ قراءتك</strong></div></section>`); return; }
    h(head + `<section class="wrap panel" id="rlogBox"><div class="loading">جارٍ التحميل…</div></section>`);
    const box = document.getElementById("rlogBox");
    if (isStudent() && !state.viewAs) return rlogStudent(box);
    if (isStaff()) return rlogStaff(box);
    box.innerHTML = `<div class="form-card empty"><strong>هذه الصفحة للطلاب ومعلميهم</strong></div>`;
  }
  async function rlogStudent(box) {
    const me = state.session.user.id;
    const { data } = await sb.from("reading_log").select("*").eq("student_id", me).order("created_at", { ascending: false });
    const L = data || []; const ap = L.filter((x) => x.status === "approved").length; let edit = null;
    const draw = () => {
      const e = edit ? L.find((x) => x.id === edit) : null;
      box.innerHTML = `<div class="mdr-card"><div class="mdr-lg-h"><h3>🛂 جَوازاتُ التَّحَدّي</h3><b class="mdr-pts">${ap} <small>كِتابًا مُعْتَمَدًا من 50</small></b></div>${rlogPassports(ap)}
          ${L.some((x) => x.status === "pending") ? `<p class="muted">⏳ ${L.filter((x) => x.status === "pending").length} بانتظار اعتماد معلمك.</p>` : ""}</div>
        <div class="mdr-card rlog-form" id="rlogF"><h3>${e ? "✏️ تعديل التلخيص" : "➕ أضفْ كتابًا قرأتَه"}</h3>
          <div class="rlog-grid"><label>عنوان الكتاب<input id="rlT" maxlength="200" value="${esc(e ? e.title : "")}"></label><label>المؤلف<input id="rlA" maxlength="120" value="${esc(e ? e.author || "" : "")}"></label><label>عدد الصفحات<input id="rlP" type="number" min="1" max="3000" value="${e && e.pages ? e.pages : ""}"></label></div>
          <label>تلخيص الكتاب بأسلوبك: الشخصيات أو الأفكار، وأهم الأحداث أو المعلومات، والخاتمة<textarea class="mdr-ta" id="rlS" rows="6" placeholder="اكتب 40 كلمة على الأقل بلغة عربية سليمة…">${esc(e ? e.summary : "")}</textarea></label><p class="muted" id="rlWc"></p>
          <label>ماذا تعلّمت منه؟ وماذا أعجبك؟<textarea class="mdr-ta" id="rlL" rows="2">${esc(e ? e.liked || "" : "")}</textarea></label>
          <p class="form-error" id="rlErr"></p><div class="mdr-nav">${e ? `<button class="btn btn-ghost" id="rlC">إلغاء</button>` : "<span></span>"}<button class="btn btn-primary" id="rlSave">📤 ${e ? "حفظ وإرسال لمعلمي" : "أرسل لمعلمي"}</button></div></div>
        <div class="mdr-card"><h3>📖 كتبي</h3>${L.length ? `<div class="rlog-list">${L.map((x) => `<div class="rlog-it st-${x.status}"><div><b>${esc(x.title)}</b>${x.author ? ` <span class="muted">· ${esc(x.author)}</span>` : ""}${x.pages ? ` <span class="muted">· ${x.pages} صفحة</span>` : ""}
            <small>${RLOG_ST[x.status][0]} ${RLOG_ST[x.status][1]} · ${new Date(x.created_at).toLocaleDateString("en-GB")}</small>${x.teacher_note ? `<p class="mdr-task">🧑‍🏫 ${esc(x.teacher_note)}</p>` : ""}
            <details><summary>التلخيص</summary><p style="white-space:pre-wrap">${esc(x.summary)}</p>${x.liked ? `<p class="muted">${esc(x.liked)}</p>` : ""}</details></div>
            ${x.status !== "approved" ? `<div class="rlog-act"><button class="btn btn-ghost btn-small" data-ed="${x.id}">✏️ تعديل</button><button class="btn btn-ghost btn-small" data-del="${x.id}">🗑️</button></div>` : ""}</div>`).join("")}</div>` : `<p class="muted">لم تضف كتبًا بعد. ابدأ بأول كتاب!</p>`}</div>`;
      const s = box.querySelector("#rlS"), wc = box.querySelector("#rlWc"); const upd = () => { const n = rlogWords(s.value); wc.textContent = n ? `عدد الكلمات: ${n}${n < 40 ? " (40 على الأقل)" : " ✅"}` : ""; }; s.oninput = upd; upd();
      const c = box.querySelector("#rlC"); if (c) c.onclick = () => { edit = null; draw(); };
      box.querySelectorAll("[data-ed]").forEach((b) => b.onclick = () => { edit = b.dataset.ed; draw(); box.querySelector("#rlogF").scrollIntoView({ behavior: "smooth" }); });
      box.querySelectorAll("[data-del]").forEach((b) => b.onclick = async () => { if (!confirm("حذف هذا الكتاب من سجلك؟")) return; const { error } = await sb.rpc("rlog_delete", { p_id: b.dataset.del }); if (error) toast(error.message); else rlogStudent(box); });
      box.querySelector("#rlSave").onclick = async () => { const t = box.querySelector("#rlT").value.trim(), err = box.querySelector("#rlErr"), pg = +box.querySelector("#rlP").value || null;
        if (t.length < 2) { err.textContent = "اكتب عنوان الكتاب."; return; } if (rlogWords(s.value) < 40) { err.textContent = "التلخيص 40 كلمة على الأقل."; return; }
        const b = box.querySelector("#rlSave"); b.disabled = true;
        const { error } = await sb.rpc("rlog_save", { p_id: edit, p_title: t, p_author: box.querySelector("#rlA").value, p_pages: pg, p_summary: s.value, p_liked: box.querySelector("#rlL").value }); b.disabled = false;
        if (error) { err.textContent = "تعذّر الحفظ: " + error.message; return; } toast("أُرسل الكتاب إلى معلمك"); rlogStudent(box); };
    };
    draw();
  }
  async function rlogStaff(box) {
    const { data: tc } = await sb.from("class_teachers").select("classes(id, name, year_group)").eq("teacher_id", state.session.user.id);
    let cls = (tc || []).map((x) => x.classes).filter(Boolean);
    if (!cls.length && (isSchoolAdmin() || isSuper()) && state.profile && state.profile.school_id) { const { data } = await sb.from("classes").select("id, name, year_group").eq("school_id", state.profile.school_id).order("year_group").limit(60); cls = data || []; }
    cls = cls.filter((c, i, a) => a.findIndex((x) => x.id === c.id) === i).sort((a, b) => a.year_group - b.year_group || a.name.localeCompare(b.name, "ar"));
    if (!cls.length) { box.innerHTML = `<div class="form-card empty"><strong>لا توجد فصول مرتبطة بك</strong></div>`; return; }
    let cur = cls[0].id, tab = "q";
    const draw = async () => {
      const { data: roster } = await sb.from("class_students").select("student_id, profiles(full_name_ar)").eq("class_id", cur);
      const SS = (roster || []).map((r) => ({ id: r.student_id, name: (r.profiles && r.profiles.full_name_ar) || "—" })); const NM = {}; SS.forEach((s) => { NM[s.id] = s.name; });
      const { data } = SS.length ? await sb.from("reading_log").select("*").in("student_id", SS.map((s) => s.id)).order("created_at", { ascending: true }) : { data: [] };
      const L = data || []; const pend = L.filter((x) => x.status === "pending");
      const cnt = (id) => L.filter((x) => x.student_id === id && x.status === "approved").length;
      box.innerHTML = `<div class="rd-cls">${cls.map((c) => `<button class="btn btn-small ${c.id === cur ? "btn-primary" : "btn-ghost"}" data-cls="${c.id}">${esc(c.name)}</button>`).join("")}</div>
        <div class="rd-cls"><button class="btn btn-small ${tab === "q" ? "btn-primary" : "btn-ghost"}" data-tab="q">⏳ للاعتماد (${pend.length})</button><button class="btn btn-small ${tab === "b" ? "btn-primary" : "btn-ghost"}" data-tab="b">🏆 لوحة الفصل</button></div>
        ${tab === "q" ? (pend.length ? pend.map((x) => `<div class="mdr-card rlog-rev" data-id="${x.id}"><div class="mdr-lg-h"><h3>📖 ${esc(x.title)}${x.author ? ` <small class="muted">· ${esc(x.author)}</small>` : ""}</h3><span class="pill">${esc(NM[x.student_id] || "")}</span></div>
            <p class="muted">${x.pages ? x.pages + " صفحة · " : ""}${rlogWords(x.summary)} كلمة · ${new Date(x.created_at).toLocaleDateString("en-GB")}</p><p style="white-space:pre-wrap">${esc(x.summary)}</p>${x.liked ? `<p class="muted">💬 ${esc(x.liked)}</p>` : ""}
            <textarea class="mdr-ta" rows="2" placeholder="ملاحظتك للطالب (اختياري، ومطلوبة عند الإعادة)"></textarea>
            <div class="mdr-nav"><button class="btn btn-ghost btn-small" data-rv="returned">↩️ أعِده للتعديل</button><button class="btn btn-primary btn-small" data-rv="approved">✅ اعتمد</button></div></div>`).join("") : `<div class="mdr-card muted">لا توجد كتب بانتظار الاعتماد في هذا الفصل.</div>`)
        : `<div class="mdr-card"><div class="lp-tw"><table class="lp-tbl"><thead><tr><th>#</th><th>الطالب</th><th>الكتب المعتمدة</th><th>الجوازات المكتملة</th><th>بانتظار الاعتماد</th></tr></thead><tbody>
            ${SS.map((s) => ({ s, n: cnt(s.id) })).sort((a, b) => b.n - a.n).map((r, i) => `<tr><td>${i + 1}</td><td>${esc(r.s.name)}</td><td>${r.n}/50 ${mdrBar(r.n, 50)}</td><td>${Math.floor(r.n / 10)}/5</td><td>${L.filter((x) => x.student_id === r.s.id && x.status === "pending").length}</td></tr>`).join("") || `<tr><td colspan="5">لا يوجد طلاب</td></tr>`}</tbody></table></div></div>`}`;
      box.querySelectorAll("[data-cls]").forEach((b) => b.onclick = () => { cur = b.dataset.cls; draw(); });
      box.querySelectorAll("[data-tab]").forEach((b) => b.onclick = () => { tab = b.dataset.tab; draw(); });
      box.querySelectorAll(".rlog-rev").forEach((c) => c.querySelectorAll("[data-rv]").forEach((b) => b.onclick = async () => { const note = c.querySelector("textarea").value.trim();
        if (b.dataset.rv === "returned" && note.length < 3) { toast("اكتب للطالب ما يحتاج إلى تعديل"); return; }
        b.disabled = true; const { error } = await sb.rpc("rlog_review", { p_id: c.dataset.id, p_status: b.dataset.rv, p_note: note || null });
        if (error) { b.disabled = false; toast("تعذّر الحفظ: " + error.message); return; } toast(b.dataset.rv === "approved" ? "اعتُمد الكتاب" : "أُعيد للطالب"); c.remove(); }));
    };
    draw();
  }

  // ---------- قياس الطلاقة من تسجيل الطالب: الكلمات الصحيحة في الدقيقة ----------
  const MDR_ET = { 1: ["إبدال أو خطأ نطق", "e1"], 2: ["حذف", "e2"], 3: ["تردّد طويل (+3 ثوانٍ)", "e3"] };
  const mdrLvl = (acc) => acc >= 97 ? ["🟢", "مستوى مستقل: يقرأ النص وحده"] : acc >= 90 ? ["🟡", "مستوى تعليمي: يقرأ بدعم المعلم"] : ["🔴", "مستوى صعب: يحتاج نصًّا أيسر أو تدريبًا مكثفًا"];
  async function mdrFluDlg(X, l, s, rec, r, done, saver) {
    let d = document.getElementById("mdrFluDlg"); if (!d) { d = document.createElement("dialog"); d.id = "mdrFluDlg"; d.className = "wide-dlg mdr-flu-dlg"; document.body.appendChild(d); }
    const words = []; X.text.forEach((p, pi) => p.split(" ").forEach((w) => words.push([w, pi])));
    const old = (r && r.fl_marks) || {}; const E = Object.assign({}, old.e || {}); let last = old.last != null ? old.last : words.length - 1, sec = old.sec || rec.duration_sec || 60, mode = "err";
    const { data: su } = await sb.storage.from("recitations").createSignedUrl(rec.audio_path, 3600);
    d.innerHTML = `<h2 style="font-size:1.2rem">🎧 قياس طلاقة ${esc(s.name)} · «${esc(X.t)}»</h2>
      <audio controls src="${su ? su.signedUrl : ""}" style="width:100%"></audio>
      <p class="muted">استمع وتابع النص: انقر الكلمة التي أخطأ فيها (النقرة الأولى إبدال، والثانية حذف، والثالثة تردد طويل، والرابعة تمسح). ثم حدّد آخر كلمة قرأها.</p>
      <div class="mdr-flu-tools"><button class="btn btn-small btn-primary" data-m="err">✏️ تحديد الأخطاء</button><button class="btn btn-small btn-ghost" data-m="last">📍 آخر كلمة قرأها</button>
        <label>مدة القراءة (ثانية) <input type="number" id="fluSec" min="5" max="600" value="${sec}"></label>
        <span class="mdr-flu-leg">${Object.keys(MDR_ET).map((k) => `<i class="${MDR_ET[k][1]}">${MDR_ET[k][0]}</i>`).join("")}</span></div>
      <div class="mdr-text sm mdr-flu-tx">${X.text.map((p, pi) => `<p>${words.map((w, i) => [w, i]).filter(([w]) => w[1] === pi).map(([w, i]) => `<span class="mdr-fw" data-i="${i}">${esc(w[0])}</span>`).join(" ")}</p>`).join("")}</div>
      <div class="mdr-flu-res" id="fluRes"></div>
      <p class="form-error" id="fluErr"></p>
      <div class="dialog-actions"><button class="btn btn-primary" id="fluSave">💾 حفظ القياس</button><button class="btn btn-ghost" id="fluX">إغلاق</button></div>`;
    const calc = () => { const att = last + 1, er = Object.keys(E).filter((i) => +i <= last).length, cor = Math.max(0, att - er); sec = +d.querySelector("#fluSec").value || 0;
      return { att, er, cor, wcpm: sec ? Math.round(cor * 60 / sec) : 0, acc: att ? Math.round(cor * 100 / att) : 0 }; };
    const paint = () => { d.querySelectorAll(".mdr-fw").forEach((w) => { const i = +w.dataset.i; w.className = "mdr-fw" + (E[i] ? " " + MDR_ET[E[i]][1] : "") + (i > last ? " after" : "") + (i === last ? " last" : ""); });
      const c = calc(), lv = mdrLvl(c.acc);
      d.querySelector("#fluRes").innerHTML = `<div class="lp-stats"><div><b>${c.att}</b><small>كلمة قرأها</small></div><div><b>${c.er}</b><small>خطأ</small></div><div><b>${c.wcpm}</b><small>كلمة صحيحة في الدقيقة</small></div><div><b>${c.acc}%</b><small>الدقة</small></div></div><p>${lv[0]} ${lv[1]}</p>`; };
    d.querySelectorAll("[data-m]").forEach((b) => b.onclick = () => { mode = b.dataset.m; d.querySelectorAll("[data-m]").forEach((x) => { x.classList.toggle("btn-primary", x === b); x.classList.toggle("btn-ghost", x !== b); }); });
    d.querySelectorAll(".mdr-fw").forEach((w) => w.onclick = () => { const i = +w.dataset.i; if (mode === "last") last = i; else { E[i] = ((E[i] || 0) + 1) % 4; if (!E[i]) delete E[i]; } paint(); });
    d.querySelector("#fluSec").oninput = paint;
    d.querySelector("#fluX").onclick = () => { const a = d.querySelector("audio"); if (a) a.pause(); d.close(); };
    d.querySelector("#fluSave").onclick = async () => { const c = calc(), err = d.querySelector("#fluErr"); if (!(sec >= 5)) { err.textContent = "اكتب مدة القراءة بالثواني."; return; }
      if (c.wcpm > 300) { err.textContent = "الناتج أعلى من المعقول؛ راجع المدة وآخر كلمة."; return; }
      const b = d.querySelector("#fluSave"); b.disabled = true;
      const mk = { e: E, last, sec, att: c.att, rec: rec.id }; const { error } = saver ? await saver(c, mk) : await sb.rpc("reading_fluency", { p_lesson: l.id, p_student: s.id, p_text: X.id, p_wcpm: c.wcpm, p_acc: c.acc, p_marks: mk }); b.disabled = false;
      if (error) { err.textContent = "تعذّر الحفظ: " + error.message; return; } const a = d.querySelector("audio"); if (a) a.pause(); d.close(); toast("حُفظ قياس الطلاقة ووصل للطالب"); done(); };
    paint(); d.showModal();
  }

  // ---------- بطاقة داخل الدرس تدلّ على نص الأسبوع ----------
  async function mdrCard(box, l, u, id) {
    const idx = (await mdrIdxGet())[String(u.year_group)] || []; const pos = idx.findIndex((x) => x.id === id), it = idx[pos]; if (!it) { box.innerHTML = ""; return; }
    box.innerHTML = `<div class="mdr-lcard"><div class="mdr-lcard-i">📗</div><div><span class="pill">كتاب «مدارج القراءة» · النص ${pos + 1} من ${idx.length}</span>
      <h3>«${esc(it.t)}»</h3><p class="muted">${it.kind === "i" ? "نص معلوماتي" : "نص سردي"} · ${it.si} أسلوب القراءة: ${esc(it.sn)} · ${it.w} كلمة</p>
      <p>نص القراءة المقترح مع هذا الدرس: قبل القراءة، وقياس الطلاقة والقراءة الجهرية، وأنشطة المفردات والتسلسل، وأسئلة الفهم في مستويات بيرلز، والتعبير.</p>
      <a class="btn btn-primary" href="#/reading/${it.id}">📖 افتح النص</a> <a class="btn btn-ghost" href="#/year/${u.year_group}?subject=arabic&track=native&term=${u.term}&mdr=1">كل نصوص الصف</a></div></div>`;
  }
