/* حراء · متابعة العرض على جهاز الطالب
   يُحقن في عرض المعلم حين يُفتح داخل صفحة الطالب في الحصة المباشرة:
   يُخفي أدوات المعلم وملاحظاته، ويمنع التنقّل، ويتبع شريحة المعلم وعناصرها الظاهرة. */
(function () {
  "use strict";
  var W = window, D = document;
  if (W.__follow) return;
  var ev = function (s) { try { return W.eval(s); } catch (e) { return undefined; } };
  var css = D.createElement("style");
  css.textContent = "#tb,.pop,#notes,aside,#nP,#nN,#att,#pg,#hbTip{display:none!important}#wrap{top:0!important;bottom:0!important}" +
    "#fwBlack{position:fixed;inset:0;z-index:50;display:none;align-items:center;justify-content:center;background:#05080E;color:rgba(255,255,255,.55);font:700 28px 'Thmanyah Text',Tahoma,sans-serif;text-align:center;padding:20px}#fwBlack.on{display:flex}";
  D.head.appendChild(css);
  var black = D.createElement("div"); black.id = "fwBlack"; black.textContent = (D.documentElement.lang || "").indexOf("en") === 0 ? "👀 Look at your teacher" : "👀 انظر إلى معلمك"; D.body.appendChild(black);
  var block = function (e) { e.stopPropagation(); e.stopImmediatePropagation(); if (e.cancelable) e.preventDefault(); };
  ["keydown", "keyup", "keypress", "wheel"].forEach(function (t) { W.addEventListener(t, block, { capture: true, passive: false }); });
  D.addEventListener("click", function (e) { if (e.target.closest && e.target.closest("a[href^='http'],video,audio")) return; block(e); }, true);
  /* ملء إطار الطالب كله بالشريحة (دالة العرض الأصلية تحجز مكان شريط المعلم) */
  var fit2 = function () { var st = D.getElementById("stage"); if (!st) return; var w = innerWidth, h = innerHeight, k = Math.min(w / 1920, h / 1080); st.style.transform = "translate(" + (w - 1920 * k) / 2 + "px," + (h - 1080 * k) / 2 + "px) scale(" + k + ")"; };
  W.addEventListener("resize", function () { setTimeout(fit2, 0); }); fit2();
  var SL = [].slice.call(D.querySelectorAll("#stage > .sl"));
  var cur = function () { var m = ((D.getElementById("pg") || {}).textContent || "").match(/(\d+)\s*\/\s*(\d+)/); if (m) return +m[1] - 1; var k = SL.findIndex(function (s) { return s.classList.contains("on"); }); return k < 0 ? 0 : k; };
  var builds = function (s) { return [].slice.call(s.querySelectorAll("[data-build-in]")).sort(function (a, c) { return (parseInt((a.dataset.buildIn || "").split(" ")[1], 10) || 0) - (parseInt((c.dataset.buildIn || "").split(" ")[1], 10) || 0); }); };
  W.__follow = function (p) {
    if (!p) return;
    black.classList.toggle("on", !!p.black);
    var k = Math.max(0, Math.min(SL.length - 1, +p.k || 0));
    if (cur() !== k) { if (typeof W.show === "function") W.show(k); else ev("show(" + k + ")"); }
    var bl = builds(SL[k]), b = Math.max(0, Math.min(bl.length, +p.b || 0));
    bl.forEach(function (e, j) { e.classList.toggle("hid", j >= b); });
    ev("b=" + b); fit2();
  };
  if (W.__followPending) W.__follow(W.__followPending);
})();
