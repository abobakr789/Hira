/* «سالم» رفيق الدراسة — حراء
   ملف مستقل يحمّله التطبيق عند الحاجة: window.HiraaSalem.mount(lesson, nn, deps) و report(params, deps)
   deps = { sb, cfg, esc, h, loading, state } من التطبيق نفسه */
(function () {
  "use strict";
  let ART = "art/salem/";
  const FACES = ["head", "wink", "think", "listen", "idea", "cheer", "great"];
  let preloaded = false;

  async function mount(l, nn, d) {
    const { sb, cfg, esc } = d;
    ["buddyFab", "buddyBox"].forEach((id) => { const x = document.getElementById(id); if (x) x.remove(); });
    if (!location.hash.startsWith("#/lesson/")) return;
    // المعلم أوقفه لهذا الفصل، أو عند الطالب اختبار مفتوح: لا يظهر
    try { const { data: st } = await sb.rpc("buddy_status", { p_lesson: l.id }); if (st && st !== "ok") return; } catch (e) { /* عند الخطأ يُعتمد على فحص الخادم */ }
    let ch = "salem";
    try { const { data: c } = await sb.rpc("buddy_character", { p_lesson: l.id }); if (c === "salama") ch = "salama"; } catch (e) { /* الافتراضي سالم */ }
    if (!location.hash.startsWith("#/lesson/")) return;
    const F = ch === "salama", NM = F ? "سلامة" : "سالم", NE = F ? "Salama" : "Salem";
    if (ART !== "art/" + ch + "/") { ART = "art/" + ch + "/"; preloaded = false; }
    if (!preloaded) { FACES.forEach((k) => { const i = new Image(); i.src = ART + k + ".webp"; }); preloaded = true; }
    const T2 = (a, e) => (nn ? e : a);
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const canSpeak = "speechSynthesis" in window;
    const fig = document.createElement("button"); fig.id = "buddyFab"; fig.className = "salem" + (F ? " is-salama" : ""); fig.type = "button";
    fig.setAttribute("aria-label", T2("افتح " + NM + "، " + (F ? "رفيقة" : "رفيق") + " المذاكرة", "Open " + NE + ", your study buddy"));
    fig.innerHTML = `<img class="salem-img" src="${ART}full.webp" alt="" draggable="false"><span class="salem-face" aria-hidden="true"><img alt="" src="${ART}think.webp"></span><span class="salem-tip">${T2("اسألني عن الدرس!", "Ask me about the lesson!")}</span>`;
    const box = document.createElement("div"); box.id = "buddyBox"; box.className = "buddy-box"; box.hidden = true; box.dir = nn ? "ltr" : "rtl";
    box.setAttribute("role", "dialog"); box.setAttribute("aria-label", NM);
    box.innerHTML = `<div class="bd-head"><span class="bd-av"><img alt="" src="${ART}head.webp"></span><div><b>${NM}</b><small class="bd-state">${T2(F ? "زميلتك في المذاكرة" : "زميلك في المذاكرة", "Your study buddy")}</small></div><button class="bd-x" type="button" aria-label="إغلاق">✕</button></div>
      <div class="bd-log" aria-live="polite"></div>
      <div class="bd-chips"></div>
      <form class="bd-form">${SR ? `<button type="button" class="bd-mic" aria-label="${T2("اسأل بصوتك", "Ask by voice")}" title="${T2("اسأل بصوتك", "Ask by voice")}">🎙️</button>` : ""}<input maxlength="400" dir="auto" placeholder="${T2(F ? "اكتبي سؤالك أو اضغطي الميكروفون…" : "اكتب سؤالك أو اضغط الميكروفون…", "Type or tap the mic… / اكتب سؤالك")}" aria-label="سؤالك"><button class="bd-send" aria-label="${T2("أرسل", "Send")}">➤</button></form>
      <p class="bd-note">${T2((F ? "تجيب سلامة من الدرس ومصادره المعتمدة فقط. للأحكام والمسائل الخلافية اسألي معلمتك." : "يجيب سالم من الدرس ومصادره المعتمدة فقط. للأحكام والمسائل الخلافية اسأل معلمك."), NE + " answers only from this lesson and approved sources. Ask your teacher about rulings.")}</p>`;
    document.body.append(fig, box);
    const log = box.querySelector(".bd-log"), form = box.querySelector("form"), inp = form.querySelector("input"), send = form.querySelector(".bd-send"), mic = form.querySelector(".bd-mic"), hist = [];
    const av = box.querySelector(".bd-av img"), faceImg = fig.querySelector(".salem-face img"), stateTxt = box.querySelector(".bd-state");
    const STATE = { think: T2(F ? "تفكّر…" : "يفكّر…", "Thinking…"), listen: T2(F ? "تستمع إليكِ…" : "يستمع إليك…", "Listening…") };
    let faceTimer = 0;
    const face = (k, ms) => {
      clearTimeout(faceTimer); av.src = ART + (k || "head") + ".webp";
      fig.dataset.face = k || ""; if (k) faceImg.src = ART + k + ".webp";
      stateTxt.textContent = STATE[k] || T2(F ? "زميلتك في المذاكرة" : "زميلك في المذاكرة", "Your study buddy");
      if (ms) faceTimer = setTimeout(() => face(null), ms);
    };
    const mood = (m, ms) => { fig.classList.add(m); if (ms) setTimeout(() => fig.classList.remove(m), ms); };
    const calm = (m) => fig.classList.remove(m);
    const speak = (text) => {
      if (!canSpeak || !text) return; speechSynthesis.cancel();
      const ar = /[؀-ۿ]/.test(text); const u = new SpeechSynthesisUtterance(text.replace(/\*\*/g, "").replace(/[\u{1F300}-\u{1FAFF}☀-➿]/gu, ""));
      u.lang = ar ? "ar-SA" : "en-US"; const v = speechSynthesis.getVoices().find((x) => x.lang && x.lang.toLowerCase().startsWith(ar ? "ar" : "en")); if (v) u.voice = v;
      u.rate = ar ? 0.92 : 0.98; u.onstart = () => { fig.classList.add("talk"); face("idea"); }; u.onend = u.onerror = () => { calm("talk"); face(null); }; speechSynthesis.speak(u);
    };
    const say = (who, html, plain) => {
      const d = document.createElement("div"); d.className = "bd-msg " + who; d.dir = "auto"; d.innerHTML = html;
      if (who === "bot" && plain && canSpeak) { const s = document.createElement("button"); s.type = "button"; s.className = "bd-say"; s.textContent = "🔊"; s.title = T2("استمع", "Listen"); s.onclick = () => speak(plain); d.appendChild(s); }
      log.appendChild(d); log.scrollTop = log.scrollHeight; return d;
    };
    const fmt = (t) => esc(t).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\n/g, "<br>");
    const hello = T2(F ? "أهلًا يا صديقتي! أنا سلامة 👋 اكتبي سؤالك عن درس «" + l.title_ar + "» أو اسأليني بصوتك." : "أهلًا يا صديقي! أنا سالم 👋 اكتب سؤالك عن درس «" + l.title_ar + "» أو اسألني بصوتك.", "Hi! I'm " + NE + " 👋 Type or say your question about this lesson, in English or Arabic.");
    say("bot", esc(hello), hello);

    // محتوى الدرس المعتمد، للإجابات البديلة حين يتعذّر الاتصال بالنموذج
    let offData = null;
    const loadOff = async () => {
      if (offData) return offData;
      const [s1, s2, s3] = await Promise.all([
        sb.from("lesson_summaries").select("content").eq("lesson_id", l.id).maybeSingle(),
        sb.from("lesson_sources").select("title_ar,citation_ar").eq("lesson_id", l.id).order("sort_order"),
        sb.rpc("buddy_prepared_get", { p_lesson: l.id }).then((r) => r, () => ({ data: null })),
      ]);
      let c = s1.data && s1.data.content; if (typeof c === "string") { try { c = JSON.parse(c); } catch (e) { c = null; } }
      offData = { sum: c || {}, srcs: s2.data || [], prep: s3.data || null }; return offData;
    };
    // الشرح الجاهز لهذا الدرس (يُجهَّز مسبقًا ويعمل بلا اتصال بالنموذج)
    const P = (k) => { const p = offData && offData.prep; if (!p) return null; const en = nn && p[k + "_en"] && (k !== "faq" || p.faq_en.length); return p[k + (en ? "_en" : "_ar")] || null; };
    const nrm = (t) => String(t || "").replace(/[\u064B-\u065F\u0670\u0640]/g, "").replace(/[إأآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
    const faqMatch = (q) => {
      const p = offData && offData.prep; if (!p) return null;
      const list = [...(p.faq_ar || []), ...(p.faq_en || [])]; const qw = new Set(nrm(q).split(" ").filter((w) => w.length > 2));
      if (qw.size < 2) return null; let best = null, sc = 0;
      for (const f of list) { const fw = nrm(f.q).split(" ").filter((w) => w.length > 2); const hit = fw.filter((w) => qw.has(w)).length; const v = hit / Math.max(3, Math.min(fw.length, qw.size)); if (v > sc) { sc = v; best = f; } }
      return sc >= 0.6 ? best : null;
    };
    loadOff().then(() => addFaqChips()).catch(() => {});
    const offline = async (k) => {
      const { sum, srcs } = await loadOff().catch(() => ({ sum: {}, srcs: [] }));
      if ((k === "explain" || k === "example") && P(k)) return fmt(P(k));
      if (k === "explain" && (sum.idea || (sum.learn || []).length))
        return `${sum.idea ? `<b>${esc(sum.idea)}</b>` : ""}${(sum.learn || []).length ? `<ul class="bd-list">${sum.learn.map((x) => `<li>${esc(Array.isArray(x) ? x.join(" ") : x)}</li>`).join("")}</ul>` : ""}`;
      if (k === "example" && sum.scene) return esc(sum.scene);
      if (k === "sources") return srcs.length ? `${T2("المصادر المعتمدة لهذا الدرس:", "Approved sources for this lesson:")}<ul class="bd-src">${srcs.map((s) => `<li>📚 ${esc(s.citation_ar || s.title_ar)}</li>`).join("")}</ul>` : esc(T2(F ? "ستُضاف مصادر إضافية لهذا الدرس قريبًا. وإلى ذلك الحين راجعي تبويبات الدرس: نص الكتاب والمصادر والفيديو." : "سيضيف معلمك مصادر إضافية لهذا الدرس قريبًا. وإلى ذلك الحين راجع تبويبات الدرس: نص الكتاب والمصادر والفيديو.", "Your teacher will add extra sources soon. Meanwhile, check the lesson tabs."));
      return null;
    };

    const chipDefs = [
      { k: "explain", t: T2(F ? "اشرحي لي الفكرة الرئيسة ببساطة" : "اشرح لي الفكرة الرئيسة ببساطة", "Explain the main idea simply") },
      { k: "quiz", t: T2(F ? "اختبريني بسؤال واحد" : "اختبرني بسؤال واحد", "Quiz me with one question") },
      { k: "example", t: T2(F ? "أعطيني مثالًا من حياتي" : "أعطني مثالًا من حياتي", "Give me an example from my life") },
      { k: "sources", t: T2("أريد مصادر إضافية", "Any extra sources?") },
    ];
    const chipBox = box.querySelector(".bd-chips");
    function addFaqChips() {
      const fq = P("faq"); if (!fq || !fq.length || chipBox.querySelector(".bd-faq")) return;
      const lab = document.createElement("small"); lab.className = "bd-faq"; lab.textContent = T2("أسئلة يسألها الزملاء:", "Questions classmates ask:"); chipBox.appendChild(lab);
      fq.slice(0, 3).forEach((f) => { const x = document.createElement("button"); x.type = "button"; x.dir = "auto"; x.className = "bd-faq-q"; x.textContent = f.q; x.onclick = () => ask(f.q, false, f); chipBox.appendChild(x); });
    }
    chipDefs.forEach((c) => { const x = document.createElement("button"); x.type = "button"; x.dir = "auto"; x.textContent = c.t; x.onclick = () => (c.k === "quiz" ? quiz(c.t) : ask(c.t, false, c.k)); chipBox.appendChild(x); });
    const open = (v) => { box.hidden = !v; fig.classList.toggle("open", v); if (v) { mood("wave", 1400); face("wink", 2200); inp.focus(); } else if (canSpeak) speechSynthesis.cancel(); };
    fig.onclick = () => open(box.hidden);
    box.querySelector(".bd-x").onclick = () => open(false);
    document.addEventListener("keydown", function esck(e) { if (!document.body.contains(box)) return document.removeEventListener("keydown", esck); if (e.key === "Escape" && !box.hidden) open(false); });
    setTimeout(() => { if (document.body.contains(fig) && box.hidden) mood("hint", 5000); }, 1200);
    const off = () => { if (!location.hash.startsWith("#/lesson/")) { if (canSpeak) speechSynthesis.cancel(); fig.remove(); box.remove(); window.removeEventListener("hashchange", off); } }; window.addEventListener("hashchange", off);
    const ERR = {
      rate_limited: T2(F ? "بلغتِ الحدّ: 20 سؤالًا في الساعة. عودي بعد قليل 🙂 ويمكنكِ الآن أن تجرّبي «اختبريني بسؤال واحد»." : "بلغتَ الحدّ: 20 سؤالًا في الساعة. عُد بعد قليل 🙂 ويمكنك الآن أن تجرّب «اختبرني بسؤال واحد».", "Limit reached: 20 questions per hour. You can still try «Quiz me»."),
      no_access: T2("هذا الدرس غير مفتوح لك.", "This lesson isn't open for you."),
      disabled: T2(F ? "أوقفت معلمتك سلامة لهذا الفصل الآن." : "أوقف معلمك سالم لهذا الفصل الآن.", "Your teacher has paused " + NE + " for this class."),
      test_open: T2(F ? "عندكِ اختبار مفتوح الآن. أكمليه أولًا، ثم أكون معكِ 🙂" : "عندك اختبار مفتوح الآن. أكمله أولًا، ثم أكون معك 🙂", "You have a test open. Finish it first, then I'm here."),
    };
    const RESTING = T2(F ? "سلامة تأخذ استراحة قصيرة ☕ جرّبي «اختبريني بسؤال واحد»، أو راجعي تبويبات الدرس، أو اسأليني لاحقًا." : "سالم يأخذ استراحة قصيرة ☕ جرّب «اختبرني بسؤال واحد»، أو راجع تبويبات الدرس، أو اسألني لاحقًا.", NE + " is taking a short break ☕ Try «Quiz me», or check the lesson tabs.");
    let busy = false;
    const showChips = () => { chipBox.hidden = false; log.scrollTop = log.scrollHeight; };

    async function ask(q, byVoice, chipKey) {
      q = String(q || "").trim(); if (!q || busy) return; busy = true;
      chipBox.hidden = true; inp.value = ""; say("me", esc(q)); const wait = say("bot", '<span class="bd-dots"><i></i><i></i><i></i></span>'); send.disabled = true; face("think");
      const local = (html, plain) => { wait.remove(); say("bot", html, plain); hist.push({ role: "user", text: q }, { role: "assistant", text: plain || "" }); if (byVoice) speak(plain); else { face("idea", 3000); mood("talk", 1200); } showChips(); };
      // ما جُهّز مسبقًا يُعرض فورًا دون استهلاك الرصيد
      if (chipKey && typeof chipKey === "object") { local(fmt(chipKey.a), chipKey.a); busy = false; send.disabled = false; return; }
      if (chipKey === "sources" || ((chipKey === "explain" || chipKey === "example") && (await loadOff().catch(() => null), P(chipKey)))) {
        const html = await offline(chipKey); if (html) { local(html, chipKey === "sources" ? "" : P(chipKey)); busy = false; send.disabled = false; return; }
      }
      try {
        const tok = (await sb.auth.getSession()).data.session?.access_token;
        const r = await fetch(cfg.supabaseUrl + "/functions/v1/lesson-buddy", { method: "POST", headers: { "Content-Type": "application/json", apikey: cfg.supabaseKey, Authorization: "Bearer " + tok }, body: JSON.stringify({ lesson_id: l.id, question: q, history: hist.slice(-6) }) });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) {
          if (ERR[j.error]) { wait.textContent = ERR[j.error]; face(null); if (j.error === "rate_limited") showChips(); return; }
          // نفاد الرصيد أو تعذّر الخدمة: إجابة جاهزة من محتوى الدرس المعتمد إن وُجدت
          await loadOff().catch(() => null);
          const fm = chipKey ? null : faqMatch(q);
          const alt = chipKey ? await offline(chipKey) : fm ? fmt(fm.a) : null;
          wait.remove();
          if (alt) say("bot", alt + `<p class="bd-off">${esc(T2("من شرح الدرس الجاهز في حراء", "From Hiraa's lesson notes"))}</p>`, fm ? fm.a : "");
          else say("bot", esc(RESTING));
          face(null); showChips(); return;
        }
        const src = (j.sources || []).map((s) => `<li>📚 ${esc(s.citation_ar || s.title_ar)}</li>`).join("");
        wait.remove(); say("bot", fmt(j.answer) + (src ? `<ul class="bd-src">${src}</ul>` : ""), j.answer);
        hist.push({ role: "user", text: q }, { role: "assistant", text: j.answer || "" });
        if (byVoice) speak(j.answer); else { face(/أحسنت|ممتاز|رائع|well done|great job|excellent/i.test(j.answer || "") ? "cheer" : "idea", 4000); mood("talk", 1500); }
        showChips();
      } catch (e) { wait.textContent = T2("تعذّر الاتصال.", "Connection failed."); face(null); }
      finally { busy = false; send.disabled = false; inp.focus(); }
    }

    // «اختبرني»: سؤال حقيقي من بنك أسئلة الدرس، ويُصحَّح بمفتاحه في قاعدة البيانات
    async function quiz(label) {
      if (busy) return; busy = true; chipBox.hidden = true;
      say("me", esc(label)); const wait = say("bot", '<span class="bd-dots"><i></i><i></i><i></i></span>'); face("think");
      let q = null;
      try { const { data } = await sb.rpc("buddy_quiz_pick", { p_lesson: l.id }); q = data; } catch (e) { q = null; }
      wait.remove(); busy = false;
      if (!q) { return ask(T2("اكتب لي سؤال اختيار من متعدد واحدًا من هذا الدرس، ولا تذكر الإجابة حتى أجيب.", "Give me one multiple-choice question from this lesson, and don't reveal the answer until I reply."), false, "quiz"); }
      face("idea", 2500);
      const stem = nn && q.stem_en ? q.stem_en : q.stem_ar;
      const card = say("bot", `<div class="bd-q"><b>${esc(stem)}</b><div class="bd-opts">${(q.options || []).map((o) => `<button type="button" data-o="${esc(o.id)}" dir="auto">${esc(o.text)}</button>`).join("")}</div></div>`);
      card.querySelectorAll(".bd-opts button").forEach((b) => b.onclick = async () => {
        card.querySelectorAll(".bd-opts button").forEach((x) => x.disabled = true); b.classList.add("picked");
        let res = null; try { const { data } = await sb.rpc("buddy_quiz_check", { p_question: q.id, p_answer: b.dataset.o }); res = data; } catch (e) { res = null; }
        if (!res) { say("bot", esc(T2("تعذّر تصحيح الإجابة الآن.", "Couldn't check the answer now."))); showChips(); return; }
        card.querySelectorAll(".bd-opts button").forEach((x) => { if (x.dataset.o === res.answer_id) x.classList.add("right"); else if (x === b) x.classList.add("wrong"); });
        const msg = res.correct ? T2(F ? "أحسنتِ يا بطلة! إجابة صحيحة ✅" : "أحسنت يا بطل! إجابة صحيحة ✅", "Well done! Correct ✅") : T2("قريب! الإجابة الصحيحة: ", "Close! The right answer is: ") + (res.correct ? "" : (res.answer_text || ""));
        const more = `<div class="bd-more"><button type="button" class="bd-again">${esc(T2("سؤال آخر", "Another question"))}</button></div>`;
        const fb = say("bot", esc(msg) + (res.explanation ? `<br><small>${esc(res.explanation)}</small>` : "") + more, msg);
        face(res.correct ? "cheer" : "think", 3000);
        fb.querySelector(".bd-again").onclick = () => quiz(label);
        showChips();
      });
    }

    form.onsubmit = (e) => { e.preventDefault(); ask(inp.value, false); };
    if (mic) {
      let rec = null;
      mic.onclick = () => {
        if (rec) { rec.stop(); return; }
        if (canSpeak) speechSynthesis.cancel();
        rec = new SR(); rec.lang = nn ? "en-US" : "ar-AE"; rec.interimResults = true; rec.maxAlternatives = 1;
        let finalText = ""; mic.classList.add("on"); face("listen"); inp.placeholder = T2(F ? "أستمع إليكِ…" : "أستمع إليك…", "Listening…");
        rec.onresult = (ev) => { let t = ""; for (const r of ev.results) { t += r[0].transcript; if (r.isFinal) finalText = t; } inp.value = t; };
        rec.onerror = () => {};
        rec.onend = () => { mic.classList.remove("on"); face(null); inp.placeholder = T2(F ? "اكتبي سؤالك أو اضغطي الميكروفون…" : "اكتب سؤالك أو اضغط الميكروفون…", "Type or tap the mic… / اكتب سؤالك"); const q = (finalText || inp.value).trim(); rec = null; if (q) ask(q, true); };
        try { rec.start(); } catch (e) { rec = null; mic.classList.remove("on"); face(null); }
      };
    }
  }

  // صفحة المعلم: «ماذا يسأل طلابي؟»
  async function report(params, d) {
    const { sb, esc, h, loading, state } = d;
    if (!state.session) { location.hash = "#/login"; return; }
    const role = state.profile && state.profile.role;
    if (!["teacher", "school_admin", "super_admin"].includes(role)) { h('<div class="wrap loading">هذه الصفحة للمعلمين.</div>'); return; }
    const clsId = params.get("class"); const days = Math.max(1, Math.min(365, +params.get("days") || 30));
    loading();
    const { data: cls } = await sb.from("classes").select("id, name, year_group, buddy_enabled, buddy_char").eq("id", clsId).maybeSingle();
    if (!cls) { h('<div class="wrap loading">اختر فصلًا من <a href="#/teacher">صفحة المعلم</a>.</div>'); return; }
    const { data: rows, error } = await sb.rpc("teacher_buddy_report", { p_class: clsId, p_days: days });
    if (error) { h(`<div class="wrap loading">تعذّر تحميل التقرير: ${esc(error.message)}</div>`); return; }
    const R = rows || [];
    const BN = cls.buddy_char === "salama" ? "سلامة" : cls.buddy_char === "salem" ? "سالم" : "سالم وسلامة";
    const students = new Set(R.map((r) => r.student_id)).size;
    const flagged = R.filter((r) => r.flagged);
    const byLesson = new Map();
    R.forEach((r) => { const k = r.lesson_id; if (!byLesson.has(k)) byLesson.set(k, { code: r.lesson_code, title: r.lesson_title, items: [], who: new Set() }); const g = byLesson.get(k); g.items.push(r); g.who.add(r.student_id); });
    const lessons = [...byLesson.values()].sort((a, b) => b.items.length - a.items.length);
    const fmtD = (t) => new Date(t).toLocaleString("ar-AE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
    const qItem = (r, showName) => `<li><div class="br-q">«${esc(r.question)}»</div><div class="muted br-meta">${showName ? esc(r.student_name || "طالب") + " · " : ""}${fmtD(r.created_at)}</div>${r.answer ? `<details><summary>الجواب</summary><p>${esc(r.answer)}</p></details>` : ""}</li>`;
    h(`<section class="page-head"><div class="wrap"><div class="crumbs"><a href="#/teacher?class=${esc(cls.id)}">صفحة المعلم</a> / ${esc(cls.name)}</div>
      <h1>ماذا يسأل طلابي؟</h1><p class="muted">أسئلة طلاب ${esc(cls.name)} لرفيق الدراسة (${BN}). استعملها لمعرفة ما لم يتضح لهم في الدرس.</p></div></section>
      <section class="section"><div class="wrap br-wrap">
        <div class="br-days">${[[7, "آخر أسبوع"], [30, "آخر 30 يومًا"], [90, "آخر 90 يومًا"]].map(([n, t]) => `<a class="term-tab" style="text-decoration:none" href="#/buddy-report?class=${esc(cls.id)}&days=${n}" aria-selected="${n === days}">${t}</a>`).join("")}</div>
        <div class="br-stats"><div><b>${R.length}</b><span>سؤالًا</span></div><div><b>${students}</b><span>طالبًا سأل</span></div><div><b>${lessons.length}</b><span>درسًا</span></div><div class="${flagged.length ? "warn" : ""}"><b>${flagged.length}</b><span>يحتاج متابعة</span></div></div>
        ${cls.buddy_enabled ? "" : `<p class="br-off">رفيق الدراسة متوقف الآن لهذا الفصل. يمكنك تشغيله من <a href="#/teacher?class=${esc(cls.id)}">صفحة الفصل</a>.</p>`}
        ${flagged.length ? `<div class="br-flag"><h2>⚠️ أسئلة تحتاج متابعتك</h2><p class="muted">نبّه رفيق الدراسة إلى أن في هذه الرسائل ضيقًا أو أمرًا لا يناسب عمر الطالب، وطلب منه أن يكلّم معلمه أو أهله.</p><ul class="br-list">${flagged.map((r) => qItem(r, true)).join("")}</ul></div>` : ""}
        <h2>الدروس الأكثر أسئلة</h2>
        ${lessons.length ? lessons.map((g) => `<details class="br-lesson"><summary><span class="br-n">${g.items.length}</span> <a href="#/lesson/${esc(g.code)}">${esc(g.title)}</a> <span class="muted">· عدد الطلاب: ${g.who.size}</span></summary><ul class="br-list">${g.items.map((r) => qItem(r, true)).join("")}</ul></details>`).join("")
          : `<p class="muted">لم يسأل طلاب هذا الفصل رفيق الدراسة بعد في هذه المدة.</p>`}
      </div></section>`);
  }

  window.HiraaSalem = { mount, report };
})();
