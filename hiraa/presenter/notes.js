/* حراء · ملخص الحصة للطالب
   يُحقن في عرض المعلم داخل صفحة الطالب (#/notes/…): يعرض الشرائح المختارة واحدة تحت الأخرى
   بكل عناصرها، وفوقها ما كتبه المعلم، ويُخفي أدوات المعلم وملاحظاته. */
(function () {
  "use strict";
  var W = window, D = document;
  if (W.__notesOn) return; W.__notesOn = 1;
  var data = W.__notes || { slides: [], ink: {} };
  var css = D.createElement("style");
  css.textContent = "#tb,.pop,#notes,aside,#nP,#nN,#att,#pg{display:none!important}" +
    "html,body{overflow:auto!important;height:auto!important;background:#EEF1F6!important;margin:0}" +
    "#wrap{position:static!important;inset:auto!important;top:auto!important}#stage{position:static!important;transform:none!important;width:auto!important;height:auto!important}" +
    ".nt-box{position:relative;overflow:hidden;margin:0 auto 16px;border-radius:12px;background:#fff;box-shadow:0 6px 24px rgba(16,42,76,.12)}" +
    ".nt-in{position:absolute;left:0;top:0;width:1920px;height:1080px;transform-origin:0 0}" +
    ".nt-in .sl{display:block!important;opacity:1!important;visibility:visible!important;transform:none!important;position:absolute!important;inset:0!important}" +
    ".nt-in [data-build-in],.nt-in .hid{opacity:1!important;transform:none!important;visibility:visible!important}.nt-in *{animation:none!important;transition:none!important}" +
    ".nt-in canvas.nt-ink{position:absolute;inset:0;width:1920px;height:1080px;pointer-events:none;z-index:50}" +
    ".nt-n{position:absolute;top:10px;inset-inline-start:10px;z-index:60;background:rgba(16,42,76,.85);color:#fff;font:700 13px Tahoma,sans-serif;border-radius:99px;padding:3px 10px}" +
    "#ntList{padding:16px 12px 30px}@media print{html,body{background:#fff!important}.nt-box{box-shadow:none;break-inside:avoid;page-break-inside:avoid;border:1px solid #DDE3EC}}";
  D.head.appendChild(css);
  var SL = [].slice.call(D.querySelectorAll("#stage > .sl"));
  var list = D.createElement("div"); list.id = "ntList";
  var draw = function (c, it) {
    if (it.t === "x") { c.globalAlpha = 1; c.fillStyle = it.c; c.font = "700 " + (+it.w || 44) + "px 'Thmanyah Text',Tahoma,sans-serif"; c.direction = /[؀-ۿ]/.test(it.s || "") ? "rtl" : "ltr"; c.textBaseline = "middle"; c.fillText(String(it.s || ""), +it.x || 0, +it.y || 0); return; }
    var p = Array.isArray(it.p) ? it.p : []; if (!p.length) return;
    c.globalAlpha = it.t === "h" ? 0.38 : 1; c.strokeStyle = it.c || "#E53935"; c.lineWidth = +it.w || 6; c.lineCap = it.t === "h" ? "butt" : "round"; c.lineJoin = "round";
    c.beginPath(); c.moveTo(p[0][0], p[0][1]);
    if (p.length < 3) c.lineTo(p[p.length - 1][0] + 0.1, p[p.length - 1][1]);
    else { for (var i = 1; i < p.length - 1; i++) c.quadraticCurveTo(p[i][0], p[i][1], (p[i][0] + p[i + 1][0]) / 2, (p[i][1] + p[i + 1][1]) / 2); c.lineTo(p[p.length - 1][0], p[p.length - 1][1]); }
    c.stroke(); c.globalAlpha = 1;
  };
  var boxes = [];
  (data.slides || []).forEach(function (k) {
    var s = SL[k]; if (!s) return;
    var box = D.createElement("div"); box.className = "nt-box";
    var inn = D.createElement("div"); inn.className = "nt-in";
    s.querySelectorAll(".hid").forEach(function (e) { e.classList.remove("hid"); });
    s.querySelectorAll("video,audio").forEach(function (v) { try { v.pause(); } catch (e) {} });
    inn.appendChild(s);
    var L = (data.ink || {})[k];
    if (L && L.length) { var cv = D.createElement("canvas"); cv.className = "nt-ink"; cv.width = 1920; cv.height = 1080; var c = cv.getContext("2d"); L.forEach(function (it) { try { draw(c, it); } catch (e) {} }); inn.appendChild(cv); }
    var n = D.createElement("span"); n.className = "nt-n"; n.textContent = (k + 1) + (L && L.length ? " ✍️" : ""); box.appendChild(n);
    box.appendChild(inn); list.appendChild(box); boxes.push(box);
  });
  D.body.appendChild(list);
  var wrap = D.getElementById("wrap"); if (wrap) wrap.style.display = "none";
  var fit = function () { var w = Math.min(1100, D.documentElement.clientWidth - 24); boxes.forEach(function (b) { b.style.width = w + "px"; b.style.height = (w * 9 / 16) + "px"; b.querySelector(".nt-in").style.transform = "scale(" + (w / 1920) + ")"; }); };
  fit(); W.addEventListener("resize", fit);
  /* منع التنقّل بلوحة المفاتيح والنقر داخل العرض */
  ["keydown", "keyup"].forEach(function (t) { W.addEventListener(t, function (e) { e.stopImmediatePropagation(); }, true); });
  D.addEventListener("click", function (e) { if (e.target.closest && e.target.closest("a[href^='http'],video,audio")) return; e.stopImmediatePropagation(); }, true);
  W.__notesHeight = function () { return list.scrollHeight + 20; };
})();
