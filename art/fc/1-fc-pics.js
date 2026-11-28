/* صور البطاقات التعليمية: الصف الأول فقط (Y1-*).
   لا يغيّر نص البطاقات ولا تفاعلها: يضيف صورة داعمة فوق نص الوجه الأمامي،
   ويضيفها كذلك للوجه الخلفي في بطاقات المفردات فقط. */
(function () {
  "use strict";
  if (window.__fcPics) return; window.__fcPics = true;
  const BASE = location.href.split("#")[0].replace(/[^/]*$/, "") + "art/fc/";
  let man = null, loading = null;
  const norm = (s) => String(s || "").normalize("NFKD").replace(/[\u064B-\u065F\u0670\u0640]/g, "").replace(/[^\p{L}\p{N}]/gu, "").toLowerCase();
  const code = () => { const m = location.hash.match(/#\/lesson\/(Y1-[A-Z]+-T\d+-L\d+)/); return m ? m[1] : null; };
  const css = document.createElement("style");
  css.textContent = ".fc-card.has-pic{height:440px}.fc-pic{display:block;width:min(100%,300px);aspect-ratio:4/3;object-fit:cover;border-radius:18px;margin:0 auto 10px;box-shadow:0 4px 14px rgba(16,42,76,.15)}.fc-b .fc-pic{width:min(100%,200px);margin:0 auto 12px}@media(max-width:560px){.fc-card.has-pic{height:400px}.fc-pic{width:min(100%,240px)}}";
  document.head.appendChild(css);
  const load = () => loading || (loading = fetch(BASE + "g1.json").then((r) => r.ok ? r.json() : {}).then((j) => (man = j)).catch(() => (man = {})));
  const mk = (k) => { const i = document.createElement("img"); i.className = "fc-pic"; i.alt = ""; i.decoding = "async"; i.src = BASE + k + ".webp"; return i; };
  function apply() {
    const c = code(); if (!c) return;
    const card = document.getElementById("fcCard"); if (!card || card.dataset.pic) return;
    card.dataset.pic = "1";
    load().then(() => {
      const m = man && man[c]; if (!m) return;
      const f = card.querySelector(".fc-f"); if (!f) return;
      const t = f.cloneNode(true); t.querySelectorAll("small").forEach((x) => x.remove());
      const hit = m[norm(t.textContent)]; if (!hit) return;
      f.insertBefore(mk(hit[0]), f.firstChild); card.classList.add("has-pic");
      if (hit[1] === "w") { const b = card.querySelector(".fc-b"); if (b) b.insertBefore(mk(hit[0]), b.firstChild); }
    });
  }
  let q = false;
  new MutationObserver(() => { if (q) return; q = true; requestAnimationFrame(() => { q = false; apply(); }); }).observe(document.body, { childList: true, subtree: true });
})();
