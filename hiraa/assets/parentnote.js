/* ملاحظة ولي الأمر — يولّد المعلم رسالة قصيرة عن تقدّم طالب، من بياناته الفعلية على حراء فقط، يراجعها ويعدّلها ثم ينسخها.
   المسار: #/parent-note (للمعلمين). لا يرسل شيئًا ولا يكتب في القاعدة. قواعد الصياغة (بحسب تفضيل المعلم):
   لا رابط للعبة الدرس ولا لأي موقع آخر، ولا أرقام صفحات، ولا مقارنة بين الطلاب، ولا تصنيفات سلبية، وأرقام غربية. */
(function () {
  const TX = {
    title: ["ملاحظة ولي الأمر", "Parent note"], staffOnly: ["هذه الصفحة للمعلمين.", "This page is for teachers."],
    cls: ["الفصل", "Class"], stu: ["الطالب", "Student"], pick: ["اختر…", "Choose…"], make: ["أنشئ الملاحظة", "Create the note"],
    copy: ["نسخ النص", "Copy text"], copied: ["تم النسخ", "Copied"], lang: ["لغة الملاحظة", "Note language"],
    review: ["راجع النص وعدّله قبل إرساله بنفسك. لا يُرسل شيء من هنا.", "Review and edit before sending it yourself. Nothing is sent from here."],
    loading: ["جارٍ التحميل…", "Loading…"], err: ["تعذّر تحميل البيانات.", "Could not load the data."], noClasses: ["لا فصول متاحة لك.", "No classes available."]
  };
  let C, en, S = {};
  const t = (k) => TX[k][en ? 1 : 0];
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const $ = (id) => document.getElementById(id);
  const short = (x, n) => { x = String(x || "").replace(/\s+/g, " ").trim(); if (x.length <= n) return x; const c = x.slice(0, n), i = c.lastIndexOf(" "); return (i > n * 0.6 ? c.slice(0, i) : c) + "…"; };
  const DAY = 864e5;
  // تمييز العدد في العربية: 1 مفرد، 2 مثنى، 3–10 جمع، 11+ مفرد منصوب
  const cnt = (n, one, two, many, tens) => (n === 1 ? one : n === 2 ? two : n <= 10 ? many : tens);

  /* ---------- الحقائق (من بيانات الطالب فقط) ---------- */
  async function facts(sid) {
    const [j, m, p, d] = await Promise.all([
      C.sb.from("journey_progress").select("finished_at,medals").eq("student_id", sid),
      C.sb.from("memo_progress").select("reviews").eq("user_id", sid),
      C.sb.from("prep_runs").select("score,max_score,created_at").eq("student_id", sid).order("created_at", { ascending: false }).limit(1),
      C.sb.from("diag_runs").select("results,created_at").eq("student_id", sid).order("created_at", { ascending: false }).limit(6)
    ]);
    const J = j.data || [], now = Date.now();
    const done = J.filter((x) => x.finished_at);
    const mock = (p.data || [])[0], pct = mock && mock.max_score ? Math.round((mock.score / mock.max_score) * 100) : null;
    const seen = {}; (d.data || []).forEach((r) => Object.keys(r.results || {}).forEach((c) => { if (!seen[c]) seen[c] = r.results[c].st; }));
    const roots = Object.keys(seen).filter((c) => seen[c] === "root").sort((a, b) => (+a.split(".G")[1] || 0) - (+b.split(".G")[1] || 0)).slice(0, 3);
    const tested = Object.keys(seen).filter((c) => seen[c] !== "na");
    return {
      lessons: done.length, recent: done.filter((x) => now - new Date(x.finished_at) < 30 * DAY).length,
      medals: J.reduce((a, x) => a + (x.medals || 0), 0), reviews: (m.data || []).reduce((a, x) => a + (x.reviews || 0), 0),
      mockPct: pct, roots, diagOk: tested.length > 0 && !roots.length
    };
  }
  async function rootTitles(codes) {
    if (!codes.length) return [];
    try {
      const { data } = await C.sb.from("learning_outcomes").select("code,statement_ar,statement_en").in("code", codes);
      const by = {}; (data || []).forEach((o) => { by[o.code] = o; });
      return codes.map((c) => short(en ? (by[c] && (by[c].statement_en || by[c].statement_ar)) : by[c] && by[c].statement_ar, 90)).filter(Boolean);
    } catch (e) { return []; }
  }

  /* ---------- الصياغة ---------- */
  function noteAr(name, g, f, roots, teacher) {
    const w = (m, fe) => (g === "m" ? m : g === "f" ? fe : m + "/" + fe.replace(m, ""));
    const noun = w("الطالب", "الطالبة"), L = [];
    L.push(`السلام عليكم ورحمة الله وبركاته، ولي أمر ${noun} ${name}،`, "");
    const none = !f.lessons && !f.reviews && f.mockPct == null;
    if (none) {
      L.push(`يسعدني أن أشارككم أن حساب ${name} على منصة حراء جاهز، ولم يبدأ التعلّم عليها بعد. نرجو تشجيعه على البدء بدرس واحد قصير هذا الأسبوع.`);
    } else {
      const parts = [];
      if (f.lessons) parts.push(`${w("أنجز", "أنجزت")} ${cnt(f.lessons, "درسًا واحدًا", "درسين", f.lessons + " دروس", f.lessons + " درسًا")} على المنصة` + (f.recent ? ` (منها ${f.recent} خلال آخر 30 يومًا)` : ""));
      if (f.medals) parts.push(`${w("ونال", "ونالت")} ${cnt(f.medals, "وسامًا", "وسامين", f.medals + " أوسمة", f.medals + " وسامًا")}`);
      if (f.reviews) parts.push(`${w("وراجع", "وراجعت")} ${cnt(f.reviews, "بطاقة", "بطاقتي", f.reviews + " بطاقات", f.reviews + " بطاقة")} مراجعة`);
      if (parts.length) L.push(`أحببت أن أشارككم تقدّم ${name}: ${parts.join("، ")}.`);
      if (f.mockPct != null) L.push(f.mockPct >= 75 ? `وقد ${w("حقّق", "حقّقت")} ${f.mockPct}% في آخر اختبار تجريبي، وهذا مستوى مشجّع.` : `وكانت نتيجته في آخر اختبار تجريبي ${f.mockPct}%، وهو مؤشر يساعدنا على تحديد ما نراجعه معًا.`);
      if (f.diagOk) L.push(`وأظهر التشخيص تمكّنه مما اختُبر فيه.`);
    }
    if (roots.length) {
      L.push("", `لدعمه أكثر، أقترح البدء بمراجعة الموضوعات الآتية بالترتيب:`);
      roots.forEach((r, i) => L.push(`${i + 1}. ${r}`));
      L.push(`وتكفي 10 دقائق يوميًّا على المنصة، فالمراجعة القصيرة المنتظمة أنفع من الطويلة المتباعدة.`);
    }
    L.push("", `شاكرًا لكم تعاونكم ودعمكم.`, `${teacher || "معلّم المادة"}`);
    return L.join("\n");
  }
  function noteEn(name, f, roots, teacher) {
    const L = [`Dear parent of ${name},`, ""];
    const none = !f.lessons && !f.reviews && f.mockPct == null;
    if (none) L.push(`${name}'s Hiraa account is ready, but learning on the platform has not started yet. Please encourage one short lesson this week.`);
    else {
      const parts = [];
      if (f.lessons) parts.push(`completed ${f.lessons} lesson${f.lessons === 1 ? "" : "s"}` + (f.recent ? ` (${f.recent} in the last 30 days)` : ""));
      if (f.medals) parts.push(`earned ${f.medals} medal${f.medals === 1 ? "" : "s"}`);
      if (f.reviews) parts.push(`done ${f.reviews} review card${f.reviews === 1 ? "" : "s"}`);
      if (parts.length) L.push(`I would like to share ${name}'s progress: ${name} has ${parts.join(", ")}.`);
      if (f.mockPct != null) L.push(f.mockPct >= 75 ? `${name} scored ${f.mockPct}% in the latest mock exam, which is an encouraging level.` : `${name}'s latest mock exam result was ${f.mockPct}%, which helps us decide what to revise together.`);
      if (f.diagOk) L.push(`The diagnostic check showed secure understanding of everything tested.`);
    }
    if (roots.length) {
      L.push("", `To support ${name} further, I suggest reviewing these topics in order:`);
      roots.forEach((r, i) => L.push(`${i + 1}. ${r}`));
      L.push(`Ten minutes a day on the platform is enough: short, regular review works better than long, spaced-out sessions.`);
    }
    L.push("", `Thank you for your support.`, `${teacher || "Subject teacher"}`);
    return L.join("\n");
  }

  /* ---------- الواجهة ---------- */
  async function loadClasses() {
    const { data, error } = await C.sb.from("classes").select("id,name,year_group").order("year_group").order("name");
    if (error) throw error; return data || [];
  }
  async function loadStudents(cid) {
    const { data: cs, error } = await C.sb.from("class_students").select("student_id").eq("class_id", cid);
    if (error) throw error;
    const ids = (cs || []).map((x) => x.student_id); if (!ids.length) return [];
    const { data: ps } = await C.sb.from("profiles").select("id,full_name_ar,full_name_en,gender").in("id", ids);
    return (ps || []).sort((a, b) => String(a.full_name_ar).localeCompare(String(b.full_name_ar), "ar"));
  }
  const gOf = (x) => { x = String(x || "").toLowerCase(); return /^(f|female|أنثى|انثى|بنت)/.test(x) ? "f" : /^(m|male|ذكر|ولد)/.test(x) ? "m" : "n"; };

  async function generate(stu, lang) {
    $("pnOut").innerHTML = `<p class="pn-note">${t("loading")}</p>`;
    try {
      const f = await facts(stu.id), roots = await rootTitles(f.roots);
      const teacher = (C.state.profile && (en ? C.state.profile.full_name_en : C.state.profile.full_name_ar)) || "";
      const name = (lang === "en" ? stu.full_name_en : stu.full_name_ar) || stu.full_name_ar || stu.full_name_en || "";
      const text = lang === "en" ? noteEn(name, f, roots, teacher) : noteAr(name, gOf(stu.gender), f, roots, teacher);
      $("pnOut").innerHTML = `<textarea id="pnTxt" class="pn-ta" rows="14" dir="${lang === "en" ? "ltr" : "rtl"}">${esc(text)}</textarea>
        <div class="pn-row"><button class="btn btn-primary" id="pnCopy">${t("copy")}</button></div><p class="pn-note">${t("review")}</p>`;
      $("pnCopy").onclick = async () => { try { await navigator.clipboard.writeText($("pnTxt").value); $("pnCopy").textContent = t("copied"); } catch (e) { $("pnTxt").select(); } };
    } catch (e) { $("pnOut").innerHTML = `<p class="pn-note">${t("err")}</p>`; }
  }

  window.HiraaParentNote = async function (ctx) {
    C = ctx; en = ctx.lang() === "en";
    const out = ctx.h(`<section class="section"><div class="wrap pn-wrap" dir="${en ? "ltr" : "rtl"}"><h1 class="pn-h">${t("title")}</h1><div id="pnApp"><p class="pn-note">${t("loading")}</p></div></div></section>`);
    const app = $("pnApp"), staff = typeof ctx.isStaff === "function" ? ctx.isStaff() : ctx.isStaff;
    if (!ctx.state.session || !staff) { app.innerHTML = `<p class="pn-note">${t("staffOnly")}</p>`; return out; }
    try {
      const cls = await loadClasses();
      if (!cls.length) { app.innerHTML = `<p class="pn-note">${t("noClasses")}</p>`; return out; }
      app.innerHTML = `<label class="pn-lab">${t("cls")}<select id="pnCls"><option value="">${t("pick")}</option>${cls.map((c) => `<option value="${esc(c.id)}">${esc(c.name)}</option>`).join("")}</select></label>
        <label class="pn-lab">${t("stu")}<select id="pnStu" disabled><option value="">${t("pick")}</option></select></label>
        <label class="pn-lab">${t("lang")}<select id="pnLang"><option value="ar">العربية</option><option value="en">English</option></select></label>
        <div class="pn-row"><button class="btn btn-primary" id="pnGo" disabled>${t("make")}</button></div><div id="pnOut"></div>`;
      $("pnCls").onchange = async () => {
        const s = $("pnStu"); S.stu = []; s.disabled = true; $("pnGo").disabled = true; s.innerHTML = `<option value="">${t("pick")}</option>`;
        if (!$("pnCls").value) return;
        try { S.stu = await loadStudents($("pnCls").value); } catch (e) { $("pnOut").innerHTML = `<p class="pn-note">${t("err")}</p>`; return; }
        s.innerHTML = `<option value="">${t("pick")}</option>` + S.stu.map((p) => `<option value="${esc(p.id)}">${esc(p.full_name_ar || p.full_name_en)}</option>`).join("");
        s.disabled = false;
      };
      $("pnStu").onchange = () => { $("pnGo").disabled = !$("pnStu").value; };
      $("pnGo").onclick = () => { const stu = S.stu.find((p) => p.id === $("pnStu").value); if (stu) generate(stu, $("pnLang").value); };
    } catch (e) { app.innerHTML = `<p class="pn-note">${t("err")}</p>`; }
    return out;
  };
  window.__pnTest = { noteAr, noteEn };   // للاختبار فقط
})();
