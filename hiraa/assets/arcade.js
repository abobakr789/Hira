/* =================== ساحة ألعاب حراء (HiraArcade) ===================
   محرّك واحد يعمل مع أيّ درس في أيّ مادّة. لا يحتاج محتوى جديدًا:
   يقرأ عناصر لعبة الدرس (game_items) وكلمات الملخّص وأسئلته (lesson_summaries)
   وكلمات «كتاب حراء» (lesson_readers)، ويجمعها من الدرس أو من الوحدة كلّها.
   الألعاب: ذاكرة الكلمات · برج المعرفة · سلّم التحدّي.
   القرآن الكريم لا يدخل هذه الألعاب (لا ترتيب آيات، ولا نصّ فيه ﴿ ﴾).
   الاستعمال: HiraArcade.mount(el, { lessons, focusId, en, onFinish, classic }) */
window.HiraArcade = (function () {
  "use strict";
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const norm = (s) => String(s || "").replace(/[ً-ٰٟۖ-ۭـ]/g, "").replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه")
    .replace(/^ال/, "").replace(/[^\p{L}\p{N}\s]/gu, "").replace(/\s+/g, " ").trim().toLowerCase();
  const ICON = /(?:\p{Extended_Pictographic}|\d️?⃣)(?:[️‍\u{1F3FB}-\u{1F3FF}]|\p{Extended_Pictographic})*/u;
  const splitIcon = (t) => { t = String(t || "").trim(); const m = t.match(ICON); if (!m) return { text: t, icon: "" }; return { text: t.replace(m[0], "").replace(/\s+/g, " ").trim(), icon: m[0] }; };
  const QURANIC = (t) => /[﴿﴾]/.test(String(t || ""));
  const reduced = () => window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- الأصوات: تُولَّد في المتصفّح، بلا موسيقى ولا طبول ---------- */
  const SND = (() => {
    let ctx = null, on = true;
    try { on = localStorage.getItem("hiraArcSnd") !== "0"; } catch (e) { /* */ }
    const ac = () => { if (!ctx) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; ctx = new C(); } if (ctx.state === "suspended") ctx.resume(); return ctx; };
    const tone = (f, t0, dur, type, vol, f2) => { const c = ac(); if (!c) return; const o = c.createOscillator(), g = c.createGain(), t = c.currentTime + t0;
      o.type = type || "sine"; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.08, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur + 0.02); };
    const clap = (t0) => { const c = ac(); if (!c) return; const n = Math.floor(c.sampleRate * 0.03), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.5);
      const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); s.buffer = b; f.type = "bandpass"; f.frequency.value = 1100 + Math.random() * 900; f.Q.value = 0.9;
      g.gain.value = 0.18; s.connect(f).connect(g).connect(c.destination); s.start(c.currentTime + t0); };
    const play = {
      tick: () => tone(1250, 0, 0.04, "triangle", 0.035),
      flip: () => tone(700, 0, 0.07, "sine", 0.05, 950),
      ok: () => { tone(784, 0, 0.12, "sine", 0.09); tone(1046, 0.09, 0.18, "sine", 0.09); },
      coin: () => { tone(988, 0, 0.08, "square", 0.035); tone(1319, 0.07, 0.22, "square", 0.035); },
      combo: () => [784, 988, 1175, 1568].forEach((f, i) => tone(f, i * 0.07, 0.16, "sine", 0.08)),
      no: () => tone(220, 0, 0.22, "triangle", 0.07, 170),
      drop: () => tone(150, 0, 0.16, "sine", 0.14, 85),
      win: () => { [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.11, 0.3, "sine", 0.08)); for (let k = 0; k < 34; k++) clap(0.35 + Math.random() * 1.5); },
      cheer: () => { for (let k = 0; k < 14; k++) clap(Math.random() * 0.7); }
    };
    return { get on() { return on; }, toggle() { on = !on; try { localStorage.setItem("hiraArcSnd", on ? "1" : "0"); } catch (e) { /* */ } return on; },
      p(k) { if (on && play[k]) try { play[k](); } catch (e) { /* */ } } };
  })();

  /* ---------- جمع المادّة من بيانات الدرس أو الوحدة ---------- */
  // lessons: [{ id, title, items:[{game,source,payload}], words:[[a,b]], quiz:[[text,bool]], rw:[[a,b]] }]
  function buildPool(lessons) {
    const pairs = [], tf = [], mcq = [], sents = [], sorts = [], seqs = [], seenP = new Set(), seenT = new Set(), seenQ = new Set(), seenS = new Set();
    // جملة للترتيب: من 3 إلى 12 كلمة، بلا نصّ قرآنيّ
    const addSent = (text, prompt, lid, kind) => { const w = String(text || "").trim().split(/\s+/).filter(Boolean); if (w.length < 3 || w.length > 12 || QURANIC(text)) return;
      const k = norm(text); if (seenS.has(k)) return; seenS.add(k); sents.push({ k, words: w, prompt: prompt || "", lid, kind: kind || "sent" }); };
    const addPair = (a, b, lid) => {
      if (!a || !b || QURANIC(a) || QURANIC(b)) return;
      const A = splitIcon(a), B = splitIcon(b); const term = A.text || a; if (!term) return;
      const k = norm(term); if (!k || seenP.has(k)) return; seenP.add(k);
      pairs.push({ k, a: term, b: B.text, icon: B.icon || A.icon, lid });
    };
    const addTF = (text, answer, lid) => { if (!text || QURANIC(text) || typeof answer !== "boolean") return; const k = norm(text); if (seenT.has(k)) return; seenT.add(k); tf.push({ k, text, answer, lid }); };
    (lessons || []).forEach((L) => {
      (L.items || []).forEach((it) => {
        const p = it.payload || {}; if (it.source === "quran" || it.source === "hadith") return;
        if (it.game === "match") (p.pairs || []).forEach((x) => addPair(x[0], x[1], L.id));
        else if (it.game === "tf") { addTF(p.text, p.answer, L.id); if (p.answer === true) addSent(p.text, "", L.id); }
        else if (it.game === "order" && it.source === "lesson") addSent(p.text, /^رتّب$|^رَتِّبِ الْكَلِمَاتِ$/.test(p.ref || "") ? "" : p.ref, L.id, "order");
        else if (it.game === "sort" && Array.isArray(p.cats) && p.cats.length >= 2) sorts.push({ title: p.title || "", cats: p.cats.filter((c) => c && c.name && Array.isArray(c.items) && c.items.length), lid: L.id });
        else if (it.game === "seq" && Array.isArray(p.steps) && p.steps.length >= 3) seqs.push({ title: p.title || "", steps: p.steps.filter(Boolean), lid: L.id });
        else if (it.game === "mcq") {
          const m = String(p.q || "").match(/^ما معنى «(.+)»؟$/);
          if (m) addPair(m[1], p.answer, L.id); // نعيد توليد البدائل من كلمات الوحدة نفسها
          else if (p.q && p.answer && Array.isArray(p.options) && p.options.includes(p.answer) && !QURANIC(p.q) && !p.options.some(QURANIC)) {
            const k = norm(p.q); if (!seenQ.has(k)) { seenQ.add(k); mcq.push({ k, q: p.q, answer: p.answer, options: [...new Set(p.options)], lid: L.id }); }
          }
        }
      });
      (L.words || []).forEach((w) => Array.isArray(w) && addPair(w[0], w[1], L.id));
      (L.rw || []).forEach((w) => Array.isArray(w) && addPair(w[0], w[1], L.id));
      (L.quiz || []).forEach((q) => { if (Array.isArray(q)) { addTF(q[0], q[1], L.id); if (q[1] === true) addSent(q[0], "", L.id); } });
    });
    // معنى واحد مكرّر لعدّة كلمات (مثل «تبدأ بحرف أ») لا يميّز بينها: نكتفي بالصورة، أو نُبقي أوّلها
    const cnt = {}; pairs.forEach((p) => { if (p.b) cnt[norm(p.b)] = (cnt[norm(p.b)] || 0) + 1; });
    const seenB = new Set();
    const clean = pairs.filter((p) => {
      if (!p.b || cnt[norm(p.b)] < 2) return true;
      if (p.icon) { p.b = ""; return true; }
      if (seenB.has(norm(p.b))) return false; seenB.add(norm(p.b)); return true;
    });
    return { pairs: clean, tf, mcq, sents, sorts, seqs };
  }

  /* ---------- صناعة الأسئلة ---------- */
  const labelOf = (p) => p.b || p.icon;
  const labelKey = (p) => (p.b ? norm(p.b) : p.icon); // الصورة وحدها مفتاحها رمزها
  // نوع الزوج: كلمة/معنى، أو كلمة/صورة، أو تقطيع (أ + سد). البدائل تُؤخذ من النوع نفسه فقط
  const kindOf = (p) => (p.b ? "t" : "i") + (/\s[+=]\s|\+/.test(p.a + " " + p.b) ? "s" : "");
  function pairQ(pool, p, dir, n, T) {
    const kd = kindOf(p);
    const others = shuffle(pool.pairs.filter((x) => x !== p && kindOf(x) === kd)).sort((x, y) => (y.lid === p.lid) - (x.lid === p.lid));
    if (dir === "ab") {
      if (!labelOf(p)) return null;
      const used = new Set([labelKey(p)]), opts = [{ t: p.b, icon: p.icon, ok: true }];
      for (const o of others) { if (opts.length >= n) break; const K = labelKey(o); if (!K || used.has(K) || (!p.b && !o.icon) || (p.b && !o.b)) continue; used.add(K); opts.push({ t: o.b, icon: o.icon, ok: false }); }
      if (opts.length < Math.min(n, 3)) return null;
      return { type: "mcq", key: "p:" + p.k, lid: p.lid, diff: n >= 4 ? 3 : 2, prompt: p.b ? T(`ما معنى «${p.a}»؟`, `What does “${p.a}” mean?`) : T(`اختر الصورة المناسبة: «${p.a}»`, `Choose the picture: “${p.a}”`), options: shuffle(opts), solution: p.b ? `${p.a}: ${p.b}` : `${p.a} ${p.icon}` };
    }
    const used = new Set([p.k]), opts = [{ t: p.a, ok: true }];
    for (const o of others) { if (opts.length >= n) break; if (used.has(o.k) || labelKey(o) === labelKey(p)) continue; used.add(o.k); opts.push({ t: o.a, ok: false }); }
    if (opts.length < Math.min(n, 3)) return null;
    return { type: "mcq", key: "p:" + p.k, lid: p.lid, diff: 3, big: p.b ? "" : p.icon,
      prompt: p.b ? T(`أيّ كلمة تعني: ${p.icon ? p.icon + " " : ""}«${p.b}»؟`, `Which word means: “${p.b}”?`) : T("ما اسم هذه الصورة؟", "What is this picture called?"), options: shuffle(opts), solution: `${p.a}: ${p.b || p.icon}` };
  }
  const tfQ = (t, T) => ({ type: "tf", key: "t:" + t.k, lid: t.lid, diff: 1, prompt: t.text, answer: t.answer, solution: T(t.answer ? "العبارة صحيحة." : "العبارة خطأ.", t.answer ? "The statement is true." : "The statement is false.") + " " + t.text });
  const mcqQ = (m) => ({ type: "mcq", key: "m:" + m.k, lid: m.lid, diff: 3, prompt: m.q, options: shuffle(m.options.map((o) => ({ t: o, ok: o === m.answer }))), solution: m.answer });

  // كل الأسئلة الممكنة، سؤال واحد لكل كلمة في الجولة
  function bank(pool, T, focusId) {
    const out = [];
    pool.tf.forEach((t) => out.push(tfQ(t, T)));
    pool.mcq.forEach((m) => out.push(mcqQ(m)));
    pool.pairs.forEach((p) => {
      const dirs = shuffle(["ab", "ba"]); let q = null;
      for (const d of dirs) { q = pairQ(pool, p, d, d === "ab" ? 3 : 4, T); if (q) break; }
      if (q) out.push(q);
    });
    // أسئلة الدرس الحالي أولًا، ثم بقيّة الوحدة
    return shuffle(out).sort((a, b) => (b.lid === focusId) - (a.lid === focusId));
  }
  // يُرتّب الجولة بحيث لا يتتابع نوع واحد كثيرًا
  function interleave(qs) {
    const tf = qs.filter((q) => q.type === "tf"), mc = qs.filter((q) => q.type !== "tf"), out = [];
    while (tf.length || mc.length) { if (mc.length) out.push(mc.shift()); if (mc.length && Math.random() < 0.5) out.push(mc.shift()); if (tf.length) out.push(tf.shift()); }
    return out;
  }

  /* ---------- الرسوم الصغيرة على بطاقات القائمة ---------- */
  const ART = {
    memory: `<svg viewBox="0 0 120 84" aria-hidden="true"><g transform="rotate(-8 40 44)"><rect x="18" y="14" width="40" height="56" rx="8" fill="#102A4C"/><path d="M38 30l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" fill="#D4AA55"/></g><g transform="rotate(7 80 44)"><rect x="60" y="12" width="40" height="56" rx="8" fill="#FFF7E6" stroke="#D4AA55" stroke-width="3"/><circle cx="80" cy="34" r="9" fill="#14A37F"/><rect x="68" y="50" width="24" height="5" rx="2.5" fill="#102A4C"/></g></svg>`,
    tower: `<svg viewBox="0 0 120 84" aria-hidden="true"><rect x="20" y="76" width="80" height="6" rx="3" fill="#C9D2DE"/><rect x="38" y="60" width="44" height="14" rx="4" fill="#102A4C"/><rect x="40" y="45" width="40" height="14" rx="4" fill="#14A37F"/><rect x="36" y="30" width="48" height="14" rx="4" fill="#E8833A"/><rect x="40" y="15" width="40" height="14" rx="4" fill="#D4AA55"/><path d="M60 2l3 6 7 1-5 4 1 7-6-3-6 3 1-7-5-4 7-1z" fill="#D4AA55"/></svg>`,
    ladder: `<svg viewBox="0 0 120 84" aria-hidden="true"><path d="M42 80L52 6M78 80L68 6" stroke="#102A4C" stroke-width="5" stroke-linecap="round"/>${[68, 54, 40, 26, 12].map((y, i) => `<path d="M${45 + i * 1.4} ${y}H${75 - i * 1.4}" stroke="${i === 4 ? "#D4AA55" : "#7C8DA6"}" stroke-width="4" stroke-linecap="round"/>`).join("")}<circle cx="96" cy="16" r="9" fill="#D4AA55"/><path d="M92 16l3 3 6-6" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,
    classic: `<svg viewBox="0 0 120 84" aria-hidden="true"><rect x="22" y="14" width="76" height="56" rx="12" fill="#E7ECF4"/><rect x="34" y="28" width="52" height="8" rx="4" fill="#102A4C"/><rect x="34" y="44" width="22" height="12" rx="6" fill="#14A37F"/><rect x="64" y="44" width="22" height="12" rx="6" fill="#E8833A"/></svg>`,
    blitz: `<svg viewBox="0 0 120 84" aria-hidden="true"><rect x="54" y="4" width="12" height="7" rx="2" fill="#102A4C"/><circle cx="60" cy="46" r="31" fill="#fff" stroke="#102A4C" stroke-width="5"/><path d="M60 46V24A22 22 0 0 1 81 52z" fill="#E8833A"/><circle cx="60" cy="46" r="4" fill="#102A4C"/><path d="M60 46L72 34" stroke="#102A4C" stroke-width="4" stroke-linecap="round"/></svg>`,
    sentence: `<svg viewBox="0 0 120 84" aria-hidden="true"><rect x="10" y="16" width="46" height="18" rx="9" fill="#14A37F"/><rect x="62" y="16" width="48" height="18" rx="9" fill="#102A4C"/><rect x="24" y="50" width="34" height="18" rx="9" fill="#fff" stroke="#D4AA55" stroke-width="3"/><rect x="64" y="50" width="32" height="18" rx="9" fill="#D4AA55"/><path d="M40 40l4 6 4-6" stroke="#7C8DA6" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
    sort: `<svg viewBox="0 0 120 84" aria-hidden="true"><rect x="44" y="4" width="32" height="20" rx="6" fill="#D4AA55"/><path d="M14 46h38l-5 32H19z" fill="#14A37F"/><path d="M68 46h38l-5 32H73z" fill="#102A4C"/><rect x="10" y="40" width="46" height="8" rx="4" fill="#0E8A6A"/><rect x="64" y="40" width="46" height="8" rx="4" fill="#0A1D36"/><path d="M60 26v8M54 32l6 6 6-6" stroke="#7C8DA6" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
    seq: `<svg viewBox="0 0 120 84" aria-hidden="true">${[0, 1, 2, 3].map((i) => `<rect x="${30 + i * 4}" y="${8 + i * 19}" width="${70 - i * 8}" height="14" rx="5" fill="${["#102A4C", "#14A37F", "#E8833A", "#D4AA55"][i]}"/><circle cx="18" cy="${15 + i * 19}" r="7" fill="#fff" stroke="#102A4C" stroke-width="2"/><text x="18" y="${19 + i * 19}" font-size="10" font-weight="700" text-anchor="middle" fill="#102A4C">${i + 1}</text>`).join("")}</svg>`
  };

  /* ---------- المحرّك ---------- */
  function mount(root, cfg) {
    const en = !!cfg.en, T = (a, b) => (en ? b : a);
    const all = cfg.lessons || [], focus = all.find((x) => x.id === cfg.focusId) || all[0] || { id: null };
    const poolL = buildPool([focus]), poolU = buildPool(all);
    const sizeOf = (p) => p.tf.length + p.mcq.length + p.pairs.length + p.sents.length + 3 * (p.sorts.length + p.seqs.length);
    const GAMES = () => ({ memory, tower, ladder, blitz, sentence, sorter, seq });
    // هل تكفي المادّة لكلّ لعبة؟
    const okFor = (P) => { const qn = bank(P, T, focus.id).length;
      return { memory: new Set(P.pairs.map(labelKey).filter(Boolean)).size >= 3, tower: qn >= 4, ladder: qn >= 5, blitz: P.tf.length + P.pairs.length >= 6, sentence: P.sents.length >= 2, sort: P.sorts.length >= 1, seq: P.seqs.length >= 1, classic: true }; };
    const run = (g) => GAMES()[g]();
    let scope = sizeOf(poolL) >= 8 || all.length < 2 ? "lesson" : "unit";
    const pool = () => (scope === "lesson" ? poolL : poolU);
    const unitExtra = all.length > 1 && sizeOf(poolU) > sizeOf(poolL);

    root.classList.add("arc"); root.setAttribute("dir", en ? "ltr" : "rtl");
    const hud = (title, extra) => `<div class="arc-hud"><button class="arc-back" type="button">${T("→ الألعاب", "← Games")}</button><b class="arc-title">${title}</b>${extra || ""}<button class="arc-snd" type="button" aria-label="${T("الصوت", "Sound")}">${SND.on ? "🔊" : "🔇"}</button></div>`;
    const bindHud = () => {
      const b = root.querySelector(".arc-back"); if (b) b.onclick = () => { SND.p("tick"); menu(); };
      const s = root.querySelector(".arc-snd"); if (s) s.onclick = () => { s.textContent = SND.toggle() ? "🔊" : "🔇"; SND.p("tick"); };
    };

    function menu() {
      stopTimer();
      const P = pool(), qn = bank(P, T, focus.id).length, pn = new Set(P.pairs.map(labelKey).filter(Boolean)).size;
      const card = (k, title, desc, tag, ok, n) => `<button class="arc-card arc-c-${k}" type="button" data-g="${k}" ${ok ? "" : "disabled"}>
          <span class="arc-art">${ART[k]}</span><span class="arc-ct"><b>${title}</b><span>${desc}</span><em>${ok ? tag : T("لا تكفي مادّة هذا الدرس لهذه اللعبة", "Not enough material in this lesson")}</em></span>${ok && n ? `<i class="arc-n">${n}</i>` : ""}</button>`
        // لا تكفي مادّة الدرس وحده، وتكفي مادّة الوحدة: تُفتح اللعبة من الوحدة مباشرة
        .replace(/^<button([^>]*) disabled>/, (m, a) => (scope === "lesson" && unitExtra && okFor(poolU)[k] ? `<button${a} data-unit="1">` : m))
        .replace(T("لا تكفي مادّة هذا الدرس لهذه اللعبة", "Not enough material in this lesson"), (m) => (scope === "lesson" && unitExtra && okFor(poolU)[k] ? T("تُلعب من دروس الوحدة كلّها", "Plays from the whole unit") : m));
      root.innerHTML = `<div class="arc-menu">
        <div class="arc-head"><div><h2>${T("ساحة الألعاب", "Game arena")}</h2><p>${T("اختر لعبتك. كلّ إجابة صحيحة ترفع رصيدك، والجولة الكاملة تضاعف الفرحة.", "Pick a game. Every right answer adds to your points.")}</p></div>
          ${unitExtra ? `<div class="arc-scope" role="group" aria-label="${T("مصدر الأسئلة", "Question source")}"><button type="button" data-s="lesson" aria-pressed="${scope === "lesson"}">${T("هذا الدرس", "This lesson")}</button><button type="button" data-s="unit" aria-pressed="${scope === "unit"}">${T("الوحدة كلّها", "Whole unit")}</button></div>` : ""}</div>
        <div class="arc-grid">
          ${card("memory", T("ذاكرة الكلمات", "Word memory"), T("اقلب بطاقتين، وطابق الكلمة بمعناها بأقلّ عدد من المحاولات.", "Flip two cards and match each word with its meaning."), T("المفردات · كلّ الأعمار", "Vocabulary · all ages"), pn >= 3, Math.min(6, pn) ? `${Math.min(6, pn)} ${T("أزواج", "pairs")}` : "")}
          ${card("tower", T("برج المعرفة", "Knowledge tower"), T("كلّ إجابة صحيحة تضع حجرًا، وثلاث متتالية تمنحك حجرًا ذهبيًّا بنقاط مضاعفة.", "Each right answer adds a block; three in a row earns a golden block."), T("الاسترجاع · كلّ الأعمار", "Recall · all ages"), qn >= 4, `${Math.min(10, qn)} ${T("أسئلة", "questions")}`)}
          ${card("ladder", T("سلّم التحدّي", "Challenge ladder"), T("أسئلة تصعد درجة درجة، ومعك ثلاث وسائل مساعدة. هل تبلغ القمّة؟", "Questions get harder rung by rung, with three lifelines. Can you reach the top?"), T("التحدّي · الصفّ الثالث فما فوق", "Challenge · Grade 3+"), qn >= 5, `${Math.min(10, qn)} ${T("درجات", "rungs")}`)}
          ${card("blitz", T("سباق الستّين ثانية", "60-second race"), T("عبارات سريعة: صح أم خطأ؟ كلّ صواب نقطة، وكلّ خطأ يُنقص نقطة. حطّم رقمك.", "Quick statements: true or false? Each right answer +1, each wrong −1. Beat your record."), T("السرعة والدقّة · كلّ الأعمار", "Speed and accuracy · all ages"), blitzBank().length >= 6, best("blitz") ? `${T("رقمك", "Best")} ${best("blitz")}` : "")}
          ${card("sentence", T("رتّب الجملة", "Build the sentence"), T("كلمات مبعثرة من الدرس، أعدها إلى مكانها لتكوّن جملة صحيحة.", "Scrambled words from the lesson: put them back in order."), T("الفهم والتراكيب · كلّ الأعمار", "Meaning and structure · all ages"), P.sents.length >= 2, `${Math.min(5, P.sents.length)} ${T("جمل", "sentences")}`)}
          ${card("sort", T("السلال", "Baskets"), T("ضع كلّ بطاقة في سلّتها الصحيحة، واكتشف ما يجمع بينها.", "Drop each card into the right basket."), T("التصنيف والتمييز", "Classifying"), P.sorts.length >= 1, P.sorts.length ? `${P.sorts.reduce((n, s) => n + s.cats.reduce((m, c) => m + c.items.length, 0), 0)} ${T("بطاقة", "cards")}` : "")}
          ${card("seq", T("رتّب الخطوات", "Order the steps"), T("خطوات أو أحداث مبعثرة، رتّبها من الأوّل إلى الأخير.", "Scrambled steps or events: put them in order."), T("التسلسل والبناء", "Sequencing"), P.seqs.length >= 1, P.seqs.length ? `${P.seqs.length} ${T("سلسلة", "sets")}` : "")}
          ${cfg.classic ? card("classic", T("الجولة الكلاسيكية", "Classic round"), T("صح أو خطأ، واختر، وصِل، ورتّب الآية أو الحديث أو الجملة.", "True/false, choose, match and order."), T("لعبة الدرس الأصلية", "The original lesson game"), true, "") : ""}
        </div></div>`;
      root.querySelectorAll("[data-s]").forEach((b) => b.onclick = () => { scope = b.dataset.s; SND.p("tick"); menu(); });
      root.querySelectorAll("[data-g]").forEach((b) => b.onclick = () => { SND.p("tick"); const g = b.dataset.g; if (b.dataset.unit) scope = "unit"; if (g === "classic") { root.innerHTML = ""; cfg.classic(); } else run(g === "sort" ? "sorter" : g); });
    }

    /* ----- شاشة النهاية ----- */
    function finish(mode, score, max, opts) {
      const r = max ? score / max : 0, stars = opts.stars != null ? opts.stars : (r === 1 ? 3 : r >= 0.6 ? 2 : r > 0 ? 1 : 0);
      const msg = stars === 3 ? T("ممتاز! جولة كاملة", "Perfect round!") : stars === 2 ? T("أحسنت! أنت قريب من القمّة", "Well done! Almost perfect") : T("بداية طيّبة، جرّب مرّة أخرى", "Good start, try again");
      root.innerHTML = `${hud(opts.title)}<div class="arc-end">
          <div class="arc-medal">${opts.medal || "🏅"}</div>
          <div class="arc-stars" aria-label="${stars} / 3">${[0, 1, 2].map((i) => `<i class="${i < stars ? "on" : ""}" style="--d:${i * 0.18}s">★</i>`).join("")}</div>
          <h3>${msg}</h3><p class="arc-big">${opts.big || `${score} / ${max}`}</p>${opts.sub ? `<p class="arc-sub">${opts.sub}</p>` : ""}
          <p class="arc-pts" aria-live="polite">${T("جارٍ حفظ نقاطك…", "Saving your points…")}</p>
          ${opts.missed && opts.missed.length ? `<details class="arc-review" open><summary>${T("راجع ما فاتك", "Review what you missed")} (${opts.missed.length})</summary><ul>${opts.missed.map((q) => `<li><span dir="auto">${esc(q.prompt)}</span><b dir="auto">${esc(q.solution)}</b></li>`).join("")}</ul></details>` : ""}
          <div class="arc-acts"><button class="arc-btn gold" type="button" data-again>${T("🔁 العب مرّة أخرى", "🔁 Play again")}</button><button class="arc-btn" type="button" data-menu>${T("🎮 لعبة أخرى", "🎮 Another game")}</button></div></div>`;
      bindHud();
      root.querySelector("[data-again]").onclick = () => { SND.p("tick"); run(mode === "sort" ? "sorter" : mode); };
      root.querySelector("[data-menu]").onclick = () => { SND.p("tick"); menu(); };
      if (stars === 3) { SND.p("win"); burst(); } else if (stars >= 1) SND.p("cheer");
      const el = root.querySelector(".arc-pts");
      // ما يصل إلى تقرير المعلم: نصّ السؤال الذي أخطأ فيه الطالب (أو الكلمة التي خلط فيها)
      const report = opts.report || (opts.missed || []).map((q) => q.prompt);
      Promise.resolve(cfg.onFinish ? cfg.onFinish(mode, score, max, report) : "").then((h) => { el.innerHTML = h || ""; }).catch(() => { el.textContent = ""; });
    }
    function burst() {
      if (reduced()) return;
      const box = document.createElement("div"); box.className = "arc-confetti";
      box.innerHTML = Array.from({ length: 46 }, (_, k) => `<i style="left:${Math.random() * 100}%;animation-delay:${Math.random() * 0.7}s;background:${["#102A4C", "#D4AA55", "#14A37F", "#E8833A", "#5B7FD1"][k % 5]}"></i>`).join("");
      document.body.appendChild(box); setTimeout(() => box.remove(), 2800);
    }

    /* ----- لوحة السؤال المشتركة (البرج والسلّم) ----- */
    function qHtml(q) {
      const opts = q.type === "tf"
        ? `<div class="arc-opts tf"><button class="arc-opt" type="button" data-v="1"><i>✓</i> ${T("صح", "True")}</button><button class="arc-opt" type="button" data-v="0"><i>✗</i> ${T("خطأ", "False")}</button></div>`
        : `<div class="arc-opts${q.options.every((o) => !o.t && o.icon) ? " pics" : ""}">${q.options.map((o, i) => `<button class="arc-opt" type="button" data-i="${i}" dir="auto">${o.icon ? `<span class="arc-ic">${o.icon}</span>` : ""}${o.t ? `<span>${esc(o.t)}</span>` : ""}</button>`).join("")}</div>`;
      return `<div class="arc-q"><p class="arc-kind">${q.type === "tf" ? T("صح أم خطأ؟", "True or false?") : T("اختر الإجابة", "Choose the answer")}</p>
        ${q.big ? `<div class="arc-bigic">${q.big}</div>` : ""}<p class="arc-prompt" dir="auto">${esc(q.prompt)}</p>${opts}<div class="arc-fb" aria-live="polite"></div></div>`;
    }
    // يربط الأزرار، ويستدعي done(ok) مرّة واحدة
    function bindQ(box, q, done, opts) {
      let locked = false;
      const pick = (btn, ok) => {
        if (locked) return; if (!ok && opts && opts.second && opts.second()) { btn.classList.add("no"); btn.disabled = true; SND.p("no"); box.querySelector(".arc-fb").innerHTML = `<b class="warn">${T("🛟 فرصة ثانية، حاول مرّة أخرى", "🛟 Second chance, try again")}</b>`; return; }
        locked = true; box.querySelectorAll(".arc-opt").forEach((b) => { b.disabled = true; });
        btn.classList.add(ok ? "ok" : "no");
        if (!ok) { const right = q.type === "tf" ? box.querySelector(`[data-v="${q.answer ? 1 : 0}"]`) : box.querySelector(`[data-i="${q.options.findIndex((o) => o.ok)}"]`); if (right) right.classList.add("ok"); }
        const fb = box.querySelector(".arc-fb");
        fb.innerHTML = ok ? `<b class="good">${en ? "Excellent!" : ["أحسنت!", "ممتاز!", "رائع!", "بارك الله فيك!"][Math.floor(Math.random() * 4)]}</b>`
          : `<b class="bad">${T("الصواب:", "Correct answer:")}</b> <span dir="auto">${esc(q.solution)}</span>`;
        done(ok);
      };
      if (q.type === "tf") box.querySelectorAll("[data-v]").forEach((b) => b.onclick = () => pick(b, (b.dataset.v === "1") === q.answer));
      else box.querySelectorAll("[data-i]").forEach((b) => b.onclick = () => pick(b, !!q.options[Number(b.dataset.i)].ok));
    }
    const nextBtn = (box, label, fn, auto) => {
      const fb = box.querySelector(".arc-fb"), b = document.createElement("button");
      b.type = "button"; b.className = "arc-btn arc-next"; b.textContent = label; b.onclick = () => { clearTimeout(t); fn(); }; fb.appendChild(b);
      const t = auto ? setTimeout(fn, auto) : 0; if (!auto) b.focus({ preventScroll: true });
    };

    /* ========== 1) ذاكرة الكلمات ========== */
    function memory() {
      const P = pool();
      // أزواج لا يتكرّر فيها معنى ولا صورة، حتى لا تحتمل البطاقة أكثر من شريك
      // ونوع واحد في الجولة (كلمة/معنى، أو كلمة/صورة، أو تقطيع)، ولا يتشابه نصّ بطاقتين
      const order = shuffle(P.pairs).sort((a, b) => (b.lid === focus.id) - (a.lid === focus.id));
      const kc = {}; order.forEach((p) => { kc[kindOf(p)] = (kc[kindOf(p)] || 0) + 1; });
      const kind = Object.keys(kc).sort((a, b) => kc[b] - kc[a])[0];
      const sq = (x) => norm(x).replace(/\s/g, "");
      const pick = (strict) => { const seenL = new Set(), seenT = new Set(), out = [];
        for (const p of order) {
          if (out.length >= 6) break; if (strict && kindOf(p) !== kind) continue;
          const K = labelKey(p), ta = sq(p.a), tb = p.b ? sq(p.b) : "";
          if (!K || seenL.has(K) || seenT.has(ta) || (tb && seenT.has(tb))) continue;
          seenL.add(K); seenT.add(ta); if (tb) seenT.add(tb); out.push(p);
        } return out; };
      let chosen = pick(true); if (chosen.length < 3) chosen = pick(false);
      const N = chosen.length;
      const cards = shuffle(chosen.flatMap((p, i) => [{ i, side: "a", text: p.a, icon: "" }, { i, side: "b", text: p.b, icon: p.icon }]));
      let open = [], moves = 0, found = 0, busy = false; const seen = new Set(), confused = new Set();
      root.innerHTML = `${hud(T("ذاكرة الكلمات", "Word memory"), `<span class="arc-pill">${T("المحاولات", "Moves")} <b data-moves>0</b></span><span class="arc-pill">${T("الأزواج", "Pairs")} <b data-found>0</b>/${N}</span>`)}
        <p class="arc-tip">${(() => { const k = kindOf(chosen[0] || {}); return /s/.test(k) ? T("طابق الكلمة المقطّعة بالكلمة كاملة.", "Match each split word with the whole word.")
          : k === "i" ? T("طابق كلّ كلمة (الشريط الذهبيّ) بصورتها (الشريط الأخضر).", "Match each word (gold) with its picture (green).")
          : T("طابق كلّ كلمة (الشريط الذهبيّ) بمعناها (الشريط الأخضر).", "Match each word (gold) with its meaning (green)."); })()}</p>
        <div class="arc-mem n${cards.length}">${cards.map((c, k) => `<button class="arc-mc" type="button" data-k="${k}" aria-label="${T("بطاقة", "Card")} ${k + 1}">
          <span class="arc-mc-in"><span class="arc-mc-back"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 4l4.5 9.5 10.5 1.5-7.5 7.3 1.8 10.4L20 27.8l-9.3 4.9 1.8-10.4L5 15l10.5-1.5z" fill="none" stroke="#D4AA55" stroke-width="2"/></svg></span>
          <span class="arc-mc-face ${c.side}"><small>${c.side === "a" ? T("كلمة", "Word") : T("معنى", "Meaning")}</small>${c.icon ? `<span class="arc-ic">${c.icon}</span>` : ""}${c.text ? `<span class="arc-mc-t" dir="auto">${esc(c.text)}</span>` : ""}</span></span></button>`).join("")}</div>`;
      bindHud();
      const el = root.querySelectorAll(".arc-mc");
      el.forEach((b) => b.onclick = () => {
        const k = Number(b.dataset.k); if (busy || b.classList.contains("up") || b.classList.contains("done")) return;
        b.classList.add("up"); SND.p("flip"); open.push(k);
        if (open.length < 2) return;
        moves++; root.querySelector("[data-moves]").textContent = moves;
        const [x, y] = open; open = [];
        const wasSeen = seen.has(x) && seen.has(y); seen.add(x); seen.add(y);
        if (cards[x].i !== cards[y].i && wasSeen) confused.add(chosen[cards[x].side === "a" ? cards[x].i : cards[y].i].a); // رأى البطاقتين قبلُ وأخطأ: خلط حقيقيّ
        if (cards[x].i === cards[y].i && cards[x].side !== cards[y].side) {
          found++; root.querySelector("[data-found]").textContent = found;
          setTimeout(() => { el[x].classList.add("done"); el[y].classList.add("done"); SND.p(found === N ? "combo" : "ok"); }, 260);
          if (found === N) setTimeout(() => {
            const extra = moves - N, stars = extra <= 1 ? 3 : extra <= N ? 2 : 1, score = Math.max(1, N - Math.floor(extra / 2));
            finish("memory", score, N, { title: T("ذاكرة الكلمات", "Word memory"), stars, medal: "🧠", big: `${moves} ${T("محاولة", "moves")}`, sub: T(`طابقت ${N} أزواج. أقلّ عدد ممكن: ${N} محاولات.`, `You matched ${N} pairs. Fewest possible: ${N} moves.`), report: [...confused] });
          }, 1100);
        } else { busy = true; setTimeout(() => { el[x].classList.remove("up"); el[y].classList.remove("up"); el[x].classList.add("shake"); el[y].classList.add("shake"); SND.p("no"); setTimeout(() => { el[x].classList.remove("shake"); el[y].classList.remove("shake"); busy = false; }, 380); }, 850); }
      });
    }

    /* ========== 2) برج المعرفة ========== */
    function tower() {
      const qs = interleave(bank(pool(), T, focus.id).slice(0, 10)), n = qs.length;
      let i = 0, right = 0, streak = 0, pts = 0; const missed = [];
      const COLORS = ["#102A4C", "#14A37F", "#E8833A", "#5B7FD1", "#C2477F", "#2E8CA8"];
      root.innerHTML = `${hud(T("برج المعرفة", "Knowledge tower"), `<span class="arc-pill">⭐ <b data-pts>0</b></span><span class="arc-pill arc-flame" hidden>🔥 <b data-st>0</b></span>`)}
        <div class="arc-play"><div class="arc-tower" aria-label="${T("البرج", "Tower")}"><div class="arc-sky"><span class="arc-crown" hidden>👑</span><div class="arc-stack"></div></div><div class="arc-base"></div><p class="arc-h"><b data-h>0</b> / ${n}</p></div><div class="arc-qbox"></div></div>`;
      bindHud();
      const stack = root.querySelector(".arc-stack"), qbox = root.querySelector(".arc-qbox"), towerEl = root.querySelector(".arc-tower");
      const draw = () => {
        const q = qs[i]; qbox.innerHTML = `<div class="arc-prog">${qs.map((_, k) => `<i class="${k < i ? "d" : k === i ? "c" : ""}"></i>`).join("")}</div>` + qHtml(q);
        bindQ(qbox, q, (ok) => {
          if (ok) {
            right++; streak++; const gold = streak >= 3, add = gold ? 200 : 100; pts += add;
            const blk = document.createElement("div"); blk.className = "arc-blk" + (gold ? " gold" : "");
            blk.style.background = gold ? "" : COLORS[(right - 1) % COLORS.length]; blk.innerHTML = gold ? "★" : String(right);
            blk.style.width = (78 + ((right * 37) % 16)) + "%"; stack.appendChild(blk);
            SND.p("drop"); setTimeout(() => SND.p(gold ? "combo" : "coin"), 140);
            const flo = document.createElement("span"); flo.className = "arc-float"; flo.dir = "ltr"; flo.textContent = `+${add}${gold ? " ×2" : ""}`; qbox.querySelector(".arc-fb").prepend(flo);
          } else { streak = 0; missed.push(q); SND.p("no"); if (!reduced()) { towerEl.classList.add("wob"); setTimeout(() => towerEl.classList.remove("wob"), 600); } }
          root.querySelector("[data-pts]").textContent = pts; root.querySelector("[data-h]").textContent = right;
          const fl = root.querySelector(".arc-flame"); fl.hidden = streak < 2; root.querySelector("[data-st]").textContent = streak;
          const last = i === n - 1;
          nextBtn(qbox, last ? T("النتيجة ←", "Result →") : T("التالي ←", "Next →"), () => { i++; if (i < n) draw(); else end(); }, ok ? 1300 : 0);
        });
      };
      const end = () => { if (right === n) root.querySelector(".arc-crown").hidden = false;
        finish("tower", right, n, { title: T("برج المعرفة", "Knowledge tower"), medal: right === n ? "👑" : "🏰", sub: T(`ارتفاع برجك ${right} طوابق · ${pts} نجمة`, `Your tower is ${right} blocks high · ${pts} stars`), missed }); };
      draw();
    }

    /* ========== 3) سلّم التحدّي ========== */
    function ladder() {
      const B = bank(pool(), T, focus.id), P = pool();
      // نعيد بناء أسئلة الكلمات بأربعة خيارات لرفع الصعوبة في الدرجات العليا
      const hard = shuffle(P.pairs).map((p) => pairQ(P, p, Math.random() < 0.6 ? "ba" : "ab", 4, T)).filter(Boolean);
      const byD = { 1: shuffle(B.filter((q) => q.diff === 1)), 2: shuffle(B.filter((q) => q.diff === 2)), 3: shuffle(B.filter((q) => q.diff === 3).concat(hard)) };
      const used = new Set(), take = (d) => { for (const k of [d, d === 1 ? 2 : d - 1, d === 3 ? 2 : 3, 1, 2, 3]) { const L = byD[k]; while (L && L.length) { const q = L.shift(); if (!used.has(q.key)) { used.add(q.key); return q; } } } return null; };
      const plan = [1, 1, 2, 2, 2, 3, 3, 3, 3, 3], rungs = [];
      for (const d of plan) { const q = take(d); if (!q) break; rungs.push(q); }
      const n = rungs.length; let i = 0; const life = { cut: true, swap: true, second: true }; let secondArmed = false; const missed = [];
      root.innerHTML = `${hud(T("سلّم التحدّي", "Challenge ladder"))}
        <div class="arc-play"><div class="arc-lad">${rungs.map((_, k) => `<div class="arc-rung" data-r="${n - 1 - k}"><span>${n - k}</span></div>`).join("")}</div><div class="arc-qbox"></div></div>`;
      bindHud();
      const qbox = root.querySelector(".arc-qbox");
      const paintLad = () => root.querySelectorAll(".arc-rung").forEach((r) => { const k = Number(r.dataset.r); r.className = "arc-rung" + (k < i ? " done" : k === i ? " cur" : "") + (k === n - 1 ? " top" : ""); });
      const zone = (k) => (k < 3 ? T("تمهيد", "Warm-up") : k < 7 ? T("تحدٍّ", "Challenge") : T("القمّة", "Summit"));
      const draw = () => {
        paintLad(); const q = rungs[i]; secondArmed = false;
        qbox.innerHTML = `<div class="arc-life">
            <button type="button" data-l="cut" ${life.cut && q.type === "mcq" && q.options.length > 2 ? "" : "disabled"} title="${T("يحذف خيارين خاطئين", "Removes wrong options")}">✂️ <span>${T("حذف خيارين", "50 : 50")}</span></button>
            <button type="button" data-l="swap" ${life.swap && (byD[1].length + byD[2].length + byD[3].length) ? "" : "disabled"} title="${T("سؤال آخر بالصعوبة نفسها", "Another question")}">🔄 <span>${T("سؤال بديل", "Swap")}</span></button>
            <button type="button" data-l="second" ${life.second ? "" : "disabled"} title="${T("إن أخطأت تحاول مرّة أخرى", "Retry if wrong")}">🛟 <span>${T("فرصة ثانية", "Second chance")}</span></button></div>
          <p class="arc-zone">${T("الدرجة", "Rung")} <b>${i + 1}</b> ${T("من", "of")} ${n} · ${zone(i)}</p>` + qHtml(q);
        qbox.querySelector('[data-l="cut"]').onclick = (e) => { life.cut = false; e.currentTarget.disabled = true; SND.p("tick");
          const wrong = shuffle([...qbox.querySelectorAll("[data-i]")].filter((b) => !q.options[Number(b.dataset.i)].ok)); wrong.slice(0, q.options.length > 3 ? 2 : 1).forEach((b) => { b.disabled = true; b.classList.add("gone"); }); };
        qbox.querySelector('[data-l="swap"]').onclick = () => { const d = q.diff, nq = take(d); if (!nq) return; life.swap = false; rungs[i] = nq; SND.p("flip"); draw(); };
        qbox.querySelector('[data-l="second"]').onclick = (e) => { life.second = false; secondArmed = true; e.currentTarget.disabled = true; e.currentTarget.classList.add("armed"); SND.p("tick"); };
        bindQ(qbox, q, (ok) => {
          qbox.querySelectorAll("[data-l]").forEach((b) => { b.disabled = true; });
          if (ok) { SND.p(i === n - 1 ? "combo" : "ok"); i++; paintLad();
            nextBtn(qbox, i < n ? T("اصعد ←", "Climb →") : T("القمّة! ←", "Summit! →"), () => (i < n ? draw() : end(true)), 1200);
          } else { missed.push(q); SND.p("no"); nextBtn(qbox, T("النتيجة ←", "Result →"), () => end(false), 0); }
        }, { second: () => { if (!secondArmed) return false; secondArmed = false; return true; } });
      };
      const end = (top) => finish("ladder", i, n, { title: T("سلّم التحدّي", "Challenge ladder"), stars: top ? 3 : i >= n * 0.6 ? 2 : i > 0 ? 1 : 0, medal: top ? "🏆" : "🪜",
        big: `${i} / ${n}`, sub: top ? T("بلغت القمّة! ما شاء الله", "You reached the summit!") : T(`صعدت ${i} درجات. حاول أن تبلغ القمّة في الجولة القادمة.`, `You climbed ${i} rungs. Aim for the top next time.`), missed });
      draw();
    }

    /* ----- أدوات مشتركة للمرحلة الثانية ----- */
    let timer = null; const stopTimer = () => { if (timer) { clearInterval(timer); timer = null; } };
    const bestKey = (m) => `hiraArcBest:${focus.id}:${m}`;
    function best(m) { try { return Number(localStorage.getItem(bestKey(m))) || 0; } catch (e) { return 0; } }
    function setBest(m, v) { try { localStorage.setItem(bestKey(m), String(v)); } catch (e) { /* */ } }
    const isAr = (t) => /[؀-ۿ]/.test(t);
    const byFocus = (list) => shuffle(list).sort((a, b) => (b.lid === focus.id) - (a.lid === focus.id));

    // عبارات «صح أم خطأ» السريعة: أسئلة الدرس، ومعاني كلماته صادقةً أو مبدَّلة
    function blitzBank() {
      const P = pool(), out = P.tf.map((t) => ({ text: t.text, answer: t.answer }));
      P.pairs.forEach((p) => {
        const truth = Math.random() < 0.5, kd = kindOf(p);
        const other = shuffle(P.pairs.filter((o) => o !== p && kindOf(o) === kd && labelKey(o) !== labelKey(p)))[0];
        const show = (x) => (x.b ? `«${p.a}» ${T("معناها", "means")}: ${x.b}` : `«${p.a}» ${x.icon}`);
        if (truth || !other) out.push({ text: show(p), answer: true }); else out.push({ text: show(other), answer: false, fix: show(p) });
      });
      return shuffle(out);
    }

    /* ========== 4) سباق الستّين ثانية ========== */
    function blitz() {
      stopTimer();
      root.innerHTML = `${hud(T("سباق الستّين ثانية", "60-second race"))}<div class="arc-q arc-blitz-intro">
          <div class="arc-bigic">⏱️</div><p class="arc-prompt">${T("ستظهر عبارات من الدرس واحدة بعد أخرى. اضغط «صح» أو «خطأ» بأسرع ما تستطيع.", "Statements from the lesson appear one after another. Tap True or False as fast as you can.")}</p>
          <p class="arc-tip">${T("كلّ صواب نقطة، وكلّ خطأ يُنقص نقطة، فلا تخمّن.", "Right +1, wrong −1, so don't guess.")}${best("blitz") ? ` ${T("رقمك القياسيّ", "Your record")}: <b>${best("blitz")}</b>` : ""}</p>
          <div class="arc-acts"><button class="arc-btn gold" type="button" data-go="60">${T("ابدأ السباق · 60 ثانية", "Start · 60 seconds")}</button><button class="arc-btn" type="button" data-go="0">${T("وضع هادئ · 20 عبارة بلا وقت", "Calm mode · 20 statements, no timer")}</button></div></div>`;
      bindHud(); root.querySelector(".arc-back").addEventListener("click", stopTimer);
      root.querySelectorAll("[data-go]").forEach((b) => b.onclick = () => { SND.p("tick"); play(Number(b.dataset.go)); });
      function play(secs) {
        let bankQ = blitzBank(), k = 0, right = 0, wrong = 0, streak = 0, left = secs, done = false; const missed = [];
        root.innerHTML = `${hud(T("سباق الستّين ثانية", "60-second race"), `<span class="arc-pill">✓ <b data-r>0</b></span><span class="arc-pill">✗ <b data-w>0</b></span><span class="arc-pill arc-flame" hidden>🔥 <b data-st>0</b></span>`)}
          <div class="arc-clock" ${secs ? "" : "hidden"}><i style="--p:100%"></i><b data-t>${secs}</b></div>
          <div class="arc-q arc-bq"><p class="arc-kind" data-n></p><p class="arc-prompt" dir="auto" data-s></p>
          <div class="arc-opts tf"><button class="arc-opt" type="button" data-v="1"><i>✓</i> ${T("صح", "True")}</button><button class="arc-opt" type="button" data-v="0"><i>✗</i> ${T("خطأ", "False")}</button></div></div>`;
        bindHud(); root.querySelector(".arc-back").addEventListener("click", stopTimer);
        const card = root.querySelector(".arc-bq"), sEl = root.querySelector("[data-s]"), nEl = root.querySelector("[data-n]");
        const show = () => { if (k >= bankQ.length) { bankQ = blitzBank(); k = 0; } sEl.textContent = bankQ[k].text; nEl.textContent = secs ? `${T("العبارة", "Statement")} ${right + wrong + 1}` : `${right + wrong + 1} / 20`; };
        const end = () => {
          if (done) return; done = true; stopTimer();
          const net = Math.max(0, right - wrong), n = right + wrong, rec = net > best("blitz");
          if (rec) setBest("blitz", net);
          const max = Math.min(30, Math.max(1, n));
          finish("blitz", Math.min(max, net), max, { title: T("سباق الستّين ثانية", "60-second race"), medal: rec && net ? "🏁" : "⏱️",
            stars: n ? (wrong === 0 && right >= 10 ? 3 : right / n >= 0.75 ? 2 : right > 0 ? 1 : 0) : 0, big: `${net} ${T("نقطة", "pts")}`,
            sub: (rec && net ? T("رقم قياسيّ جديد! ", "New record! ") : "") + T(`أجبت عن ${n} عبارة: ${right} صوابًا و${wrong} خطأ.`, `You answered ${n}: ${right} right, ${wrong} wrong.`), missed });
        };
        root.querySelectorAll(".arc-bq [data-v]").forEach((b) => b.onclick = () => {
          if (done) return; const q = bankQ[k], ok = (b.dataset.v === "1") === q.answer;
          if (ok) { right++; streak++; SND.p(streak >= 5 && streak % 5 === 0 ? "combo" : "coin"); }
          else { wrong++; streak = 0; SND.p("no"); missed.push({ prompt: q.text, solution: q.answer ? T("صحيحة", "True") : T("خطأ", "False") + (q.fix ? ` · ${T("الصواب", "Correct")}: ${q.fix}` : "") }); }
          card.classList.remove("flash-ok", "flash-no"); void card.offsetWidth; card.classList.add(ok ? "flash-ok" : "flash-no");
          root.querySelector("[data-r]").textContent = right; root.querySelector("[data-w]").textContent = wrong;
          const fl = root.querySelector(".arc-flame"); fl.hidden = streak < 3; root.querySelector("[data-st]").textContent = streak;
          k++; if (!secs && right + wrong >= 20) end(); else show();
        });
        show();
        if (secs) {
          const bar = root.querySelector(".arc-clock i"), tEl = root.querySelector("[data-t]"), t0 = Date.now();
          timer = setInterval(() => {
            if (!document.body.contains(bar)) return stopTimer();
            left = Math.max(0, secs - (Date.now() - t0) / 1000); bar.style.setProperty("--p", (100 * left / secs) + "%"); tEl.textContent = Math.ceil(left);
            if (left <= 10) bar.parentElement.classList.add("low");
            if (left <= 0) end();
          }, 200);
        }
      }
    }

    /* ========== 5) رتّب الجملة ========== */
    function sentence() {
      const P = pool(), rounds = byFocus(P.sents).slice(0, 5), n = rounds.length, trap = (cfg.year || 0) >= 3;
      let i = 0, right = 0; const missed = [];
      root.innerHTML = `${hud(T("رتّب الجملة", "Build the sentence"), `<span class="arc-pill">${T("الجملة", "Sentence")} <b data-i>1</b> / ${n}</span>`)}<div class="arc-qbox"></div>`;
      bindHud();
      const box = root.querySelector(".arc-qbox");
      const draw = () => {
        const s = rounds[i], dir = isAr(s.words.join(" ")) ? "rtl" : "ltr";
        let extra = null;
        if (trap) { const others = shuffle(P.sents.filter((o) => o !== s).flatMap((o) => o.words)).filter((w) => !s.words.includes(w) && w.length > 1); extra = others[0] || null; }
        const chips = shuffle(s.words.map((w, k) => ({ w, k })).concat(extra ? [{ w: extra, k: -1 }] : []));
        root.querySelector("[data-i]").textContent = i + 1;
        box.innerHTML = `<div class="arc-q"><p class="arc-kind">${s.prompt ? esc(s.prompt) : T("رتّب الكلمات لتكوّن جملة صحيحة من الدرس", "Put the words in order to make a sentence from the lesson")}${extra ? ` · <span class="warn">${T("بينها كلمة زائدة", "one word does not belong")}</span>` : ""}</p>
          <div class="arc-line" dir="${dir}" aria-live="polite"></div><div class="arc-bank" dir="${dir}">${chips.map((c) => `<button type="button" class="arc-chip" data-k="${c.k}">${esc(c.w)}</button>`).join("")}</div>
          <div class="arc-acts start"><button class="arc-btn gold" type="button" data-check disabled>${T("تحقّق", "Check")}</button><button class="arc-btn" type="button" data-hint>${T("💡 أوّل كلمة", "💡 First word")}</button></div><div class="arc-fb" aria-live="polite"></div></div>`;
        const line = box.querySelector(".arc-line"), bank = box.querySelector(".arc-bank"), chk = box.querySelector("[data-check]");
        const upd = () => { chk.disabled = line.children.length !== s.words.length; };
        box.querySelectorAll(".arc-chip").forEach((c) => c.onclick = () => { if (c.disabled) return; (c.parentElement === bank ? line : bank).appendChild(c); SND.p("tick"); upd(); });
        box.querySelector("[data-hint]").onclick = (e) => { e.currentTarget.disabled = true; [...line.children].forEach((c) => bank.appendChild(c));
          const first = [...bank.children].find((c) => c.dataset.k === "0"); if (first) { line.appendChild(first); first.disabled = true; first.classList.add("lock"); } upd(); };
        chk.onclick = () => {
          const got = [...line.children].map((c) => c.textContent), ok = got.join(" ") === s.words.join(" ");
          box.querySelectorAll(".arc-chip, [data-hint]").forEach((c) => { c.disabled = true; }); chk.disabled = true;
          line.classList.add(ok ? "ok" : "no"); if (extra) { const x = bank.querySelector('[data-k="-1"]'); if (x) x.classList.add("trap"); }
          const fb = box.querySelector(".arc-fb");
          if (ok) { right++; SND.p("ok"); fb.innerHTML = `<b class="good">${T("أحسنت! جملة صحيحة", "Well done!")}</b>`; }
          else { SND.p("no"); missed.push({ prompt: s.prompt || T("رتّب الجملة", "Build the sentence"), solution: s.words.join(" ") }); fb.innerHTML = `<b class="bad">${T("الصواب:", "Correct:")}</b> <span dir="${dir}">${esc(s.words.join(" "))}</span>`; }
          nextBtn(box, i < n - 1 ? T("التالي ←", "Next →") : T("النتيجة ←", "Result →"), () => { i++; if (i < n) draw(); else end(); }, ok ? 1300 : 0);
        };
      };
      const end = () => finish("sentence", right, n, { title: T("رتّب الجملة", "Build the sentence"), medal: "🧩", sub: T(`رتّبت ${right} من ${n} جمل.`, `You built ${right} of ${n} sentences.`), missed });
      draw();
    }

    /* ========== 6) السلال ========== */
    function sorter() {
      const P = pool(), set = byFocus(P.sorts)[0]; if (!set) return menu();
      const cats = set.cats.slice(0, 4), items = shuffle(cats.flatMap((c, ci) => c.items.map((t) => ({ t, ci })))).slice(0, 12);
      let i = 0, right = 0; const missed = [];
      root.innerHTML = `${hud(T("السلال", "Baskets"), `<span class="arc-pill">${T("البطاقة", "Card")} <b data-i>1</b> / ${items.length}</span>`)}
        ${set.title ? `<p class="arc-tip">${esc(set.title)}</p>` : ""}
        <div class="arc-sortcard" aria-live="polite"></div>
        <div class="arc-baskets n${cats.length}">${cats.map((c, ci) => `<button type="button" class="arc-basket b${ci}" data-c="${ci}"><span class="arc-bh">${c.icon ? `<span class="arc-ic">${c.icon}</span>` : ""}<b dir="auto">${esc(c.name)}</b><i data-cn="${ci}">0</i></span><span class="arc-bin" data-bin="${ci}"></span></button>`).join("")}</div>`;
      bindHud();
      const cardEl = root.querySelector(".arc-sortcard");
      let lock = false;
      const show = () => { cardEl.innerHTML = `<span dir="auto">${esc(items[i].t)}</span>`; cardEl.classList.remove("fly"); root.querySelector("[data-i]").textContent = i + 1; lock = false; };
      root.querySelectorAll("[data-c]").forEach((b) => b.onclick = () => {
        if (lock) return; lock = true; const it = items[i], ci = Number(b.dataset.c), ok = ci === it.ci;
        const target = root.querySelector(`[data-c="${it.ci}"]`);
        if (ok) { right++; SND.p("coin"); b.classList.add("hit"); }
        else { SND.p("no"); b.classList.add("miss"); target.classList.add("hint"); missed.push({ prompt: it.t, solution: `${it.t} ← ${cats[it.ci].name}` }); }
        const chip = document.createElement("span"); chip.className = "arc-binchip" + (ok ? "" : " late"); chip.textContent = it.t; chip.dir = "auto";
        root.querySelector(`[data-bin="${it.ci}"]`).appendChild(chip);
        const cn = root.querySelector(`[data-cn="${it.ci}"]`); cn.textContent = Number(cn.textContent) + 1;
        cardEl.classList.add("fly");
        setTimeout(() => { b.classList.remove("hit", "miss"); target.classList.remove("hint"); i++; if (i < items.length) show(); else end(); }, ok ? 650 : 1400);
      });
      const end = () => finish("sort", right, items.length, { title: T("السلال", "Baskets"), medal: "🧺", sub: T(`صنّفت ${right} من ${items.length} بطاقة في سلّتها الصحيحة.`, `${right} of ${items.length} cards in the right basket.`), missed });
      show();
    }

    /* ========== 7) رتّب الخطوات ========== */
    function seq() {
      const P = pool(), sets = byFocus(P.seqs).slice(0, 3), n = sets.length; if (!n) return menu();
      let i = 0, got = 0, total = 0; const missed = [];
      root.innerHTML = `${hud(T("رتّب الخطوات", "Order the steps"), `<span class="arc-pill">${T("السلسلة", "Set")} <b data-i>1</b> / ${n}</span>`)}<div class="arc-qbox"></div>`;
      bindHud();
      const box = root.querySelector(".arc-qbox");
      const draw = () => {
        const s = sets[i], steps = s.steps.slice(0, 8), m = steps.length; root.querySelector("[data-i]").textContent = i + 1;
        box.innerHTML = `<div class="arc-q"><p class="arc-kind">${T("اضغط الخطوات بترتيبها من الأولى إلى الأخيرة", "Tap the steps in order, first to last")}</p>${s.title ? `<p class="arc-prompt" dir="auto">${esc(s.title)}</p>` : ""}
          <ol class="arc-slots">${steps.map((_, k) => `<li data-slot="${k}"><span class="arc-sn">${k + 1}</span><span class="arc-st"></span></li>`).join("")}</ol>
          <div class="arc-steps">${shuffle(steps.map((t, k) => ({ t, k }))).map((x) => `<button type="button" class="arc-step" data-k="${x.k}" dir="auto">${esc(x.t)}</button>`).join("")}</div>
          <div class="arc-acts start"><button class="arc-btn gold" type="button" data-check disabled>${T("تحقّق", "Check")}</button></div><div class="arc-fb" aria-live="polite"></div></div>`;
        const placed = new Array(m).fill(null), chk = box.querySelector("[data-check]");
        const paint = () => { box.querySelectorAll("[data-slot]").forEach((li, k) => { li.querySelector(".arc-st").textContent = placed[k] == null ? "" : steps[placed[k]]; li.classList.toggle("full", placed[k] != null); });
          box.querySelectorAll(".arc-step").forEach((b) => { b.hidden = placed.includes(Number(b.dataset.k)); }); chk.disabled = placed.includes(null); };
        box.querySelectorAll(".arc-step").forEach((b) => b.onclick = () => { const slot = placed.indexOf(null); if (slot < 0) return; placed[slot] = Number(b.dataset.k); SND.p("tick"); paint(); });
        box.querySelectorAll("[data-slot]").forEach((li) => li.onclick = () => { if (chk.dataset.done) return; const k = Number(li.dataset.slot); if (placed[k] == null) return; placed[k] = null; SND.p("flip"); paint(); });
        chk.onclick = () => {
          chk.dataset.done = "1"; chk.disabled = true; let ok = 0;
          box.querySelectorAll("[data-slot]").forEach((li, k) => { const good = placed[k] === k; if (good) ok++; li.classList.add(good ? "ok" : "no"); });
          got += ok; total += m; const all = ok === m;
          const fb = box.querySelector(".arc-fb");
          if (all) { SND.p("ok"); fb.innerHTML = `<b class="good">${T("ترتيب صحيح كامل!", "Perfect order!")}</b>`; }
          else { SND.p("no"); missed.push({ prompt: s.title || T("رتّب الخطوات", "Order the steps"), solution: steps.map((t, k) => `${k + 1}. ${t}`).join("  ") });
            fb.innerHTML = `<b class="bad">${T(`${ok} من ${m} في مكانها.`, `${ok} of ${m} in place.`)}</b><ol class="arc-right">${steps.map((t) => `<li dir="auto">${esc(t)}</li>`).join("")}</ol>`; }
          nextBtn(box, i < n - 1 ? T("التالي ←", "Next →") : T("النتيجة ←", "Result →"), () => { i++; if (i < n) draw(); else end(); }, all ? 1400 : 0);
        };
        paint();
      };
      const end = () => { const max = Math.min(30, total), sc = Math.round(got * max / Math.max(total, 1));
        finish("seq", sc, max, { title: T("رتّب الخطوات", "Order the steps"), medal: "🔢", big: `${got} / ${total}`, sub: T("عدد الخطوات التي وضعتها في مكانها الصحيح.", "Steps placed in the right position."), missed }); };
      draw();
    }

    menu();
    return { menu, pool: () => ({ lesson: poolL, unit: poolU }) };
  }

  return { mount, buildPool, sound: SND };
})();
