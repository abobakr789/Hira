/* حراء · شريط العرض (Hiraa presenter bar)
   يُحقن في عروض المعلم HTML عند فتحها من المنصة، فيستبدل الشريط القديم بشريطين:
   الأول للهوية وأدوات الحصة، والثاني للتنقّل والتكبير والكتابة على الشريحة.
   لا يعدّل ملف العرض نفسه: يستدعي أزراره القديمة ودوالّه (show، next، prev) كما هي. */
(function () {
  "use strict";
  var D = document, W = window, SELF = (D.currentScript && D.currentScript.src) || "";
  if (W.__hbar) return; W.__hbar = 1;
  var $ = function (id) { return D.getElementById(id); };
  var tb = $("tb"), stage = $("stage"), wrap = $("wrap");
  if (!tb || !stage || !wrap) return;
  var EN = (D.documentElement.lang || "").toLowerCase() === "en";
  var T = function (a, e) { return EN ? e : a; };
  var ev = function (s) { try { return W.eval(s); } catch (e) { return undefined; } };
  var LS = { get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } }, set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  var SS = { get: function (k) { try { return JSON.parse(sessionStorage.getItem(k) || "null"); } catch (e) { return null; } }, set: function (k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  var DECK = location.pathname;
  var nStu = function (n) { return EN ? n + " student" + (n === 1 ? "" : "s") : n === 1 ? "طالب واحد" : n === 2 ? "طالبَين" : n + (n >= 3 && n <= 10 ? " طلاب" : " طالبًا"); };
  var SL = [].slice.call(stage.querySelectorAll(":scope > .sl"));
  var N = SL.length;
  var HX = W.__hiraa, LIVE = !!(HX && HX.sb && HX.staff && HX.uid);

  /* ---------- الأيقونات ---------- */
  var P = {
    close: "M18 6 6 18M6 6l12 12",
    panel: "M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 3v18",
    search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-4.6-4.6",
    first: "M17 18l-6-6 6-6M7 6v12",
    prev: "M15 18l-6-6 6-6",
    next: "M9 18l6-6-6-6",
    last: "M7 18l6-6-6-6M17 6v12",
    zin: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-4.6-4.6M11 8v6M8 11h6",
    zout: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-4.6-4.6M8 11h6",
    full: "M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3",
    pan: "M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20",
    laser: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1",
    pen: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z",
    hl: "M9 11l-6 6v3h9l3-3M22 12l-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4",
    text: "M4 7V4h16v3M9 20h6M12 4v16",
    eraser: "M20 20H8.5L4 15.5a2 2 0 0 1 0-2.8L13.2 3.5a2 2 0 0 1 2.8 0l4.5 4.5a2 2 0 0 1 0 2.8L11 20M9 9.5l6.5 6.5",
    undo: "M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11",
    trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6",
    spot: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    curtain: "M3 3h18M5 3v15c2 0 3-6 3-15M19 3v15c-2 0-3-6-3-15M12 21v-7M9 17l3-3 3 3",
    board: "M3 4h18v12H3zM12 16v4M8 20h8M7 9l3-2 3 3 4-3",
    paper: "M5 3h14v18H5zM5 8h14M5 13h14M5 18h14",
    moon: "M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z",
    film: "M4 4h16v16H4zM4 9h16M4 15h16M9 4v5M15 4v5M9 15v5M15 15v5",
    chart: "M3 3v18h18M7 15l4-4 3 3 5-6",
    timer: "M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 9v4l2.5 2M9 2h6",
    bell: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0",
    bolt: "M13 2L4 14h7l-1 8 9-12h-7z",
    chat: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2zM8 9h8M8 13h5",
    game: "M6 12h4M8 10v4M15 13h.01M18 11h.01M17.3 5H6.7a4 4 0 0 0-3.9 3.3l-1.2 6.5A3 3 0 0 0 4.5 18c.8 0 1.5-.4 2-1l1.5-2h8l1.5 2c.5.6 1.2 1 2 1a3 3 0 0 0 2.9-3.2l-1.2-6.5A4 4 0 0 0 17.3 5z",
    clip: "M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1zM8 6H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2M8 12h8M8 16h5",
    ice: "M3 11h9v9H3zM12 4h9v9h-9zM3 11l3-3h9M12 20l3-3M6 14h2M15 7h2",
    dice: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8 8h.01M16 8h.01M12 12h.01M8 16h.01M16 16h.01",
    notes: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h6",
    edit: "M11 4H4v16h16v-7M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z",
    save: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8",
    keys: "M3 6h18v12H3zM7 10h.01M11 10h.01M15 10h.01M7 14h10",
    users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
    rec: "M12 19a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    cup: "M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3",
    sup: "M12 6.5a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5zM5 8.5l7 1.5 7-1.5M12 10v4.5M8.5 21l3.5-6.5 3.5 6.5",
    dock: "M3 15h18v5H3zM7 17.5h.01M12 17.5h.01M17 17.5h.01M12 4v7M9 8l3 3 3-3",
    pdf: "M12 3v12M7 10l5 5 5-5M5 21h14",
    pv: "M2 4h13v10H2zM17 7h5v8h-5zM5 18h7M8.5 14v4",
    phone: "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2",
    ask: "M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 1 1 16.1-3.8zM9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"
  };
  var ic = function (k, flip) { return '<svg viewBox="0 0 24 24" aria-hidden="true"' + (flip ? ' class="hb-flip"' : "") + '><path d="' + P[k] + '"/></svg>'; };
  var RTL = !EN;

  /* ---------- الأنماط ---------- */
  var css = D.createElement("style"); css.id = "hb-css";
  css.textContent = [
    ":root{--hb-h:104px;--hb-lay:104px;--hb-navy:#0F2340;--hb-navy2:#17325A;--hb-gold:#D4AA55;--hb-ink:#E9EEF5}",
    "#tb.hb{position:fixed;left:0;right:0;top:0;height:auto!important;display:block!important;padding:0!important;background:none!important;box-shadow:0 6px 24px rgba(8,16,30,.35)!important;z-index:20;transition:transform .35s cubic-bezier(.2,.8,.2,1);font-family:'Thmanyah Text','Cairo',Tahoma,sans-serif}",
    "#tb.hb>:not(.hb-r){display:none!important}",
    "#tb.hb.hb-away{transform:translateY(-100%)}",
    "#wrap{top:var(--hb-lay)!important;transition:top .3s}",
    ".pop{top:calc(var(--hb-h) + 8px);z-index:40!important}",
    "#notes{top:calc(var(--hb-lay) + 12px)!important}",
    "#att{top:var(--hb-lay)!important}",
    "#tb.hb .hb-r{display:flex;align-items:center;gap:6px;padding:0 12px;box-sizing:border-box;color:var(--hb-ink)}",
    "#tb.hb .hb-r1{height:54px;background:var(--hb-navy)}",
    "#tb.hb .hb-r2{height:46px;background:var(--hb-navy2);border-top:1px solid rgba(255,255,255,.06);overflow-x:auto;overflow-y:hidden;scrollbar-width:none;position:relative}",
    "#tb.hb .hb-r2::-webkit-scrollbar{display:none}",
    "#tb.hb .hb-prog{position:absolute;inset-inline-start:0;bottom:0;height:3px;background:linear-gradient(90deg,var(--hb-gold),#F0C977);transition:width .45s cubic-bezier(.2,.8,.2,1);border-radius:0 3px 3px 0}",
    "#tb.hb .hb-pbar{position:absolute;left:0;right:0;bottom:0;height:3px;background:rgba(255,255,255,.08);pointer-events:none}",
    "#tb.hb .hb-brand{display:flex;align-items:center;gap:10px;min-width:0;flex:1 1 auto;overflow:hidden}",
    "#tb.hb .hb-logo{flex:none;display:flex;align-items:center;gap:6px;padding-inline-end:12px;border-inline-end:1px solid rgba(255,255,255,.14)}",
    "#tb.hb .hb-logo svg{width:22px;height:30px}",
    "#tb.hb .hb-logo span{font-family:'Thmanyah Display','Thmanyah Text',Tahoma,sans-serif;font-weight:700;font-size:21px;color:#fff;letter-spacing:0}",
    "#tb.hb .hb-ttl{font-family:'Thmanyah Display','Thmanyah Text',Tahoma,sans-serif;font-size:17px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#fff;opacity:.95;min-width:0}",
    "#tb.hb .hb-sub{font-size:13px;opacity:.6;white-space:nowrap}",
    "#tb.hb .hb-sp{flex:1 1 auto;min-width:8px}",
    "#tb.hb .hb-g{display:flex;align-items:center;gap:2px;flex:none}",
    "#tb.hb .hb-sep{width:1px;height:24px;background:rgba(255,255,255,.16);margin:0 6px;flex:none}",
    "#tb.hb button.hb-b{all:unset;box-sizing:border-box;position:relative;display:inline-flex;align-items:center;justify-content:center;gap:6px;height:36px;min-width:36px;padding:0 9px;border-radius:10px;color:var(--hb-ink);cursor:pointer;font:500 15px 'Thmanyah Text','Cairo',Tahoma,sans-serif;white-space:nowrap;flex:none;transition:background .15s,color .15s,transform .12s}",
    "#tb.hb .hb-r2 button.hb-b{height:34px;min-width:34px;padding:0 7px}",
    "#tb.hb button.hb-b:hover{background:rgba(255,255,255,.1)}",
    "#tb.hb button.hb-b:active{transform:scale(.94)}",
    "#tb.hb button.hb-b:focus-visible{outline:2px solid var(--hb-gold);outline-offset:1px}",
    "#tb.hb button.hb-b.on{background:var(--hb-gold);color:#1B1405}",
    "#tb.hb button.hb-b.on svg{stroke:#1B1405}",
    "#tb.hb button.hb-b.gold{background:var(--hb-gold);color:#1B1405;font-weight:700}",
    "#tb.hb button.hb-b.gold svg{stroke:#1B1405}",
    "#tb.hb button.hb-b.x{border:1px solid rgba(255,255,255,.28)}",
    "#tb.hb button.hb-b.x:hover{background:#B4532A;border-color:#B4532A}",
    "#tb.hb button.hb-b[disabled]{opacity:.35;pointer-events:none}",
    "#tb.hb .hb-b svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round;flex:none}",
    "#tb.hb .hb-flip{transform:scaleX(-1)}",
    "#hbTip{position:fixed;z-index:50;background:#0A1628;color:#fff;font:500 13px 'Thmanyah Text',Tahoma,sans-serif;padding:5px 10px;border-radius:8px;white-space:nowrap;pointer-events:none;box-shadow:0 6px 18px rgba(0,0,0,.35);opacity:0;transition:opacity .12s}",
    "#hbTip.on{opacity:1}",
    "#tb.hb .hb-pg{display:inline-flex;align-items:center;gap:6px;font-size:15px;color:var(--hb-ink);white-space:nowrap;flex:none;margin:0 2px}",
    "#tb.hb .hb-pg input{all:unset;box-sizing:border-box;width:46px;height:30px;text-align:center;background:rgba(0,0,0,.25);border:1px solid rgba(255,255,255,.18);border-radius:8px;color:#fff;font:600 15px 'Thmanyah Text',Tahoma,sans-serif}",
    "#tb.hb .hb-pg input:focus{border-color:var(--hb-gold)}",
    "#tb.hb select.hb-sel{all:unset;box-sizing:border-box;height:30px;padding:0 26px 0 10px;border:1px solid rgba(255,255,255,.18);border-radius:8px;background:rgba(0,0,0,.25) url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='%23E9EEF5' stroke-width='1.6'/%3E%3C/svg%3E\") no-repeat right 9px center;color:#fff;font:500 14px 'Thmanyah Text',Tahoma,sans-serif;cursor:pointer;flex:none}",
    "#tb.hb select.hb-sel option{color:#1F2A3C;background:#fff}",
    "#tb.hb [dir=rtl] select.hb-sel{padding:0 10px 0 26px;background-position:left 9px center}",
    "@media (max-width:1180px){#tb.hb #hbZ,#tb.hb #hbKeys{display:none}#tb.hb .hb-sep{margin:0 2px}#tb.hb .hb-r{gap:3px;padding:0 6px}}",
    "@media (max-width:900px){#tb.hb .hb-r2 button.hb-b{min-width:30px;padding:0 4px}#tb.hb .hb-r2 .hb-b svg{width:18px;height:18px}}",
    "#tb.hb .hb-sw{width:18px;height:18px;border-radius:50%;box-shadow:0 0 0 2px rgba(255,255,255,.85);flex:none}",
    "#tb.hb .hb-lbl{display:inline}#tb.hb .hb-r1 .hb-lbl{display:none}#tb.hb .hb-r1 button.hb-b{padding:0 8px}",
    "@media (max-width:1280px){#tb.hb .hb-r1 .hb-lbl{display:none}#tb.hb .hb-r1 button.hb-b{padding:0 8px}}",
    "@media (max-width:760px){#tb.hb .hb-logo span,#tb.hb .hb-sub{display:none}}",
    /* لوحات منبثقة خاصة بالشريط */
    ".pop.hb-pop{min-width:280px;max-width:min(92vw,440px)}",
    ".hb-pop .hb-h{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;font-family:'Thmanyah Display',Tahoma,sans-serif;font-size:18px;font-weight:700}",
    ".hb-pop input[type=text],.hb-pop input[type=number],.hb-pop textarea{box-sizing:border-box;width:100%;font:16px 'Thmanyah Text',Tahoma,sans-serif;border:1.5px solid #E5DCC8;border-radius:12px;padding:8px 12px;background:#FBF7EF;color:#1F2A3C;outline:none}",
    ".hb-pop input:focus,.hb-pop textarea:focus{border-color:#D4AA55}",
    ".hb-pop .hb-res{max-height:52vh;overflow:auto;margin-top:10px;display:flex;flex-direction:column;gap:6px}",
    ".hb-pop .hb-hit{display:flex;gap:10px;align-items:flex-start;text-align:start;width:100%;border:1.5px solid #EFE6D4;background:#fff;border-radius:12px;padding:8px 10px;cursor:pointer;font:15px/1.6 'Thmanyah Text',Tahoma,sans-serif;color:#1F2A3C}",
    ".hb-pop .hb-hit:hover{border-color:#D4AA55;background:#FFF9EC}",
    ".hb-pop .hb-hit i{font-style:normal;flex:none;min-width:30px;height:30px;border-radius:9px;background:#102A4C;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-weight:700}",
    ".hb-pop mark{background:#FFE9A8;color:inherit;border-radius:4px;padding:0 2px}",
    ".hb-pop .hb-sws{display:flex;flex-wrap:wrap;gap:8px;margin:4px 0 12px}",
    ".hb-pop .hb-sws button{width:32px;height:32px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 1.5px #D9CDB4;cursor:pointer;padding:0}",
    ".hb-pop .hb-sws button.on{box-shadow:0 0 0 3px #102A4C}",
    ".hb-pop .hb-szs{display:flex;gap:8px}",
    ".hb-pop .hb-szs button{flex:1;height:38px;border-radius:12px;border:1.5px solid #E5DCC8;background:#FBF7EF;cursor:pointer;display:flex;align-items:center;justify-content:center}",
    ".hb-pop .hb-szs button.on{border-color:#102A4C;background:#EEF2F8}",
    ".hb-pop .hb-szs span{display:block;border-radius:99px;background:#1F2A3C}",
    ".hb-pop .hb-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:10px}",
    ".hb-pop .hb-btn{font:600 15px 'Thmanyah Text',Tahoma,sans-serif;border:1.5px solid #E5DCC8;background:#FBF7EF;border-radius:12px;padding:7px 14px;cursor:pointer;color:#1F2A3C}",
    ".hb-pop .hb-btn.pri{background:#102A4C;border-color:#102A4C;color:#fff}",
    ".hb-pop .hb-muted{font-size:13px;color:#6B7280}",
    ".hb-pop .hb-ck{display:flex;align-items:center;gap:8px;margin:7px 0;font-size:14.5px;cursor:pointer}.hb-pop .hb-ck input{width:17px;height:17px;accent-color:#102A4C}",
    "#hbIceOv{position:fixed;left:50%;top:calc(var(--hb-lay) + 50%);transform:translate(-50%,-50%);width:min(1100px,96vw);max-height:calc(100vh - var(--hb-lay) - 30px);overflow:auto;z-index:31;display:none;background:#fff;color:#102A4C;border-radius:22px;box-shadow:0 30px 80px rgba(5,12,25,.5);font-family:'Thmanyah Text',Tahoma,sans-serif}#hbIceOv.on{display:block}",
    "#hbIceOv .ice-h{display:flex;align-items:center;gap:10px;padding:14px 20px;border-bottom:1px solid #E6EBF2;position:sticky;top:0;background:#fff;z-index:2}#hbIceOv .ice-h b{font:800 24px 'Thmanyah Display','Thmanyah Text',Tahoma,sans-serif}",
    "#hbIceOv .ice-x{margin-inline-start:auto;border:0;background:#F1F4F9;border-radius:50%;width:40px;height:40px;font-size:18px;cursor:pointer}#hbIceOv .ice-back{border:0;background:#F1F4F9;color:#102A4C;border-radius:999px;padding:9px 16px;font-weight:700;font-size:15px;font-family:inherit;cursor:pointer}",
    "#hbIceOv .ice-b{padding:18px 24px 14px;text-align:center}#hbIceOv .ice-lead{font-size:22px;margin:4px 0 16px;line-height:1.7}",
    "#hbIceOv .ice-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:14px;text-align:start}",
    "#hbIceOv .ice-card{display:flex;flex-direction:column;gap:6px;border:2px solid #D8E1EE;background:linear-gradient(180deg,#F7FAFF,#EAF2FB);border-radius:18px;padding:16px;cursor:pointer;font-family:inherit;color:#102A4C;text-align:start;transition:transform .15s,border-color .15s}#hbIceOv .ice-card:hover{transform:translateY(-3px);border-color:#D4AA55}",
    "#hbIceOv .ice-card .ice-ic{font-size:34px}#hbIceOv .ice-card b{font-size:20px}#hbIceOv .ice-card small{font-size:14px;color:#51607A;line-height:1.6}",
    "#hbIceOv .ice-kw{margin-top:18px;text-align:start;background:#F6F8FC;border-radius:16px;padding:14px}#hbIceOv .ice-kw textarea{width:100%;margin:8px 0;font-weight:600;font-size:17px;line-height:1.6;font-family:inherit;font-family:inherit;border:1px solid #CBD5E1;border-radius:12px;padding:8px 10px;box-sizing:border-box;resize:vertical}#hbIceOv .ice-kw small{color:#51607A}",
    "#hbIceOv .ice-row{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:10px;margin:14px 0}",
    "#hbIceOv .ice-sm{font-weight:700;font-size:17px;font-family:inherit;font-family:inherit;border:1px solid #CBD5E1;background:#fff;color:#102A4C;border-radius:12px;padding:10px 18px;cursor:pointer}#hbIceOv .ice-sm.on{background:#102A4C;color:#fff}#hbIceOv .ice-sm.go{background:#D4AA55;border-color:#D4AA55;color:#1B1405}#hbIceOv .ice-sm:disabled{opacity:.4;cursor:default}",
    "#hbIceOv .ice-boxes{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin:14px 0;direction:rtl}",
    "#hbIceOv .ice-bx{min-width:64px;height:78px;padding:0 6px;display:inline-flex;align-items:center;justify-content:center;font:800 46px 'Thmanyah Display','Thmanyah Text',Tahoma,sans-serif;background:#102A4C;color:#FFF0C2;border-radius:14px;border-bottom:5px solid #D4AA55;box-sizing:border-box}#hbIceOv .ice-bx.hid{background:#E4EAF3;color:transparent;border-bottom-color:#B7C3D6}",
    "#hbIceOv .ice-prize{font-size:22px;margin:6px 0}#hbIceOv .ice-prize b{display:inline-block;min-width:44px;background:#D4AA55;color:#1B1405;border-radius:999px;padding:2px 14px;font-size:28px}",
    "#hbIceOv .ice-secret{font:800 44px 'Thmanyah Display',Tahoma,sans-serif;letter-spacing:6px;margin:12px 0;min-height:64px}",
    "#hbIceOv .ice-q{display:flex;justify-content:center;align-items:center;gap:14px;font-size:22px}#hbIceOv .ice-q b{font-size:34px}",
    "#hbIceOv .ice-cd{font:800 30px 'Thmanyah Display',Tahoma,sans-serif;min-width:80px}#hbIceOv .ice-cd.low{color:#D64545}",
    "#hbIceOv .ice-cdbig{font:800 76px 'Thmanyah Display',Tahoma,sans-serif;min-height:92px;color:#102A4C}#hbIceOv .ice-cdbig.low{color:#D64545}",
    "#hbIceOv .ice-cnt{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-top:8px}#hbIceOv .ice-ct{display:flex;align-items:center;gap:8px;border-radius:16px;padding:10px 12px;color:#fff}#hbIceOv .ice-ct span{flex:1;font-weight:800;font-size:18px}#hbIceOv .ice-ct b{font:800 34px 'Thmanyah Display',Tahoma,sans-serif;min-width:44px}#hbIceOv .ice-ct button{width:46px;height:46px;border:0;border-radius:12px;background:rgba(255,255,255,.28);color:#fff;font-size:24px;font-weight:800;cursor:pointer}",
    "#hbIceOv .ice-win{margin:16px 0 4px;font-size:24px;font-weight:800;display:flex;gap:14px;justify-content:center;align-items:center;flex-wrap:wrap}#hbIceOv .ice-note{font-size:14px;color:#51607A}",
    "#hbIceOv .ice-words{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin:12px 0}#hbIceOv .ice-wd{background:#102A4C;color:#FFF0C2;border-radius:16px;padding:18px 10px;font:800 30px 'Thmanyah Display',Tahoma,sans-serif}#hbIceOv .ice-wd.hid{background:#E4EAF3;color:#8A99B2}",
    "#hbIceOv .ice-sec{margin:20px 0 10px;text-align:start;font-size:18px;color:#51607A}#hbIceOv .ice-in{width:120px;font:800 30px 'Thmanyah Display',Tahoma,sans-serif;text-align:center;border:2px solid #CBD5E1;border-radius:12px;padding:6px}",
    "#hbIceOv .ice-hist{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;font-size:20px;font-weight:700}#hbIceOv .ice-hist span{background:#EEF2F8;border-radius:999px;padding:4px 14px}",
    "#hbIceOv .ice-ta{width:100%;box-sizing:border-box;font-weight:600;font-size:18px;line-height:1.7;font-family:inherit;border:1px solid #CBD5E1;border-radius:12px;padding:10px}#hbIceOv .ice-stmt{font:800 36px/1.6 'Thmanyah Display','Thmanyah Text',Tahoma,sans-serif;margin:10px 0;padding:18px;background:#F6F8FC;border-radius:18px}",
    "#hbIceOv .ice-corn{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:10px 0}#hbIceOv .ice-cr{border-radius:20px;color:#fff;padding:22px 8px;display:flex;flex-direction:column;gap:8px;align-items:center}#hbIceOv .ice-cr span{font-size:56px}#hbIceOv .ice-cr b{font-size:24px}@media(max-width:700px){#hbIceOv .ice-corn{grid-template-columns:repeat(2,1fr)}}",
    "#hbIceOv .ice-bzs{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;margin:12px 0}#hbIceOv .ice-bz{display:flex;flex-direction:column;align-items:center;gap:4px;border:0;border-radius:22px;padding:26px 10px;color:#fff;font-family:inherit;cursor:pointer}#hbIceOv .ice-bz span{font-size:54px}#hbIceOv .ice-bz b{font-size:26px}#hbIceOv .ice-bz small{font-size:16px;opacity:.85}#hbIceOv .ice-bz:disabled{opacity:.35;cursor:default}",
    "#hbIceOv .ice-first{display:inline-block;color:#fff;font:800 44px 'Thmanyah Display',Tahoma,sans-serif;border-radius:24px;padding:22px 40px;margin:12px 0;animation:hbTmP 1s 3}",
    "#hbIceOv .ice-steps{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0}#hbIceOv .ice-steps span{display:flex;flex-direction:column;gap:2px;border:2px solid #D8E1EE;border-radius:16px;padding:10px 18px;font-weight:800;font-size:19px;background:#F6F8FC;opacity:.65}#hbIceOv .ice-steps span.on{opacity:1;border-color:#D4AA55;background:#FFF6DC}#hbIceOv .ice-steps span.dn{opacity:.4}#hbIceOv .ice-steps small{font-size:13px;font-weight:600;color:#51607A}",
    "#hbIceOv .ice-zones{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:12px 0}#hbIceOv .ice-zones div{border-radius:18px;color:#fff;font-weight:800;font-size:26px;padding:34px 8px}",
    "#hbIceOv .ice-fbcard{margin:10px auto;max-width:760px;background:linear-gradient(180deg,#FFFDF5,#FFF3CF);border:3px solid #D4AA55;border-radius:24px;padding:22px 28px;text-align:start;font-size:26px;line-height:1.8}#hbIceOv .ice-fbcard p{margin:8px 0;font-weight:700}#hbIceOv .ice-fbto{font-size:20px;color:#51607A}",
    "#hbIceOv .ice-fld{display:flex;align-items:flex-start;gap:10px;margin:10px 0;text-align:start}#hbIceOv .ice-fld>label{font-size:32px;width:44px}#hbIceOv .ice-fld>div:first-of-type{flex:1}#hbIceOv .ice-txt{width:100%;box-sizing:border-box;font-size:19px;font-family:inherit;border:1px solid #CBD5E1;border-radius:12px;padding:10px}#hbIceOv .ice-stems{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}#hbIceOv .ice-chip{border:1px solid #D4AA55;background:#FFF9E6;color:#6B4E00;border-radius:999px;padding:4px 12px;font-family:inherit;font-size:15px;cursor:pointer}",
    "#hbIceOv .ice-sel{font-size:18px;font-family:inherit;padding:10px 14px;border:1px solid #CBD5E1;border-radius:12px;min-width:260px}",
    "#hbIceOv .ice-rules{display:flex;gap:12px;justify-content:center;margin:10px 0}#hbIceOv .ice-rules span{background:#E8F4EE;color:#0B5F3A;border-radius:999px;padding:8px 20px;font-weight:800;font-size:20px}#hbIceOv .ice-fbstems p{font-size:22px;font-weight:700;margin:6px 0}",
    "#hbIceOv .ice-crits{display:flex;flex-direction:column;gap:10px;margin:10px 0;text-align:start}#hbIceOv .ice-cr2{display:flex;align-items:center;gap:8px;background:#F6F8FC;border-radius:16px;padding:10px 14px}#hbIceOv .ice-cr2>span:first-child{flex:1;font-weight:800;font-size:19px}",
    "#hbIceOv .ice-lv{display:flex;flex-direction:column;align-items:center;border:2px solid #D8E1EE;background:#fff;border-radius:14px;padding:6px 14px;font-size:26px;font-family:inherit;cursor:pointer}#hbIceOv .ice-lv small{font-size:12px;color:#51607A}#hbIceOv .ice-lv.on{border-color:#D4AA55;background:#FFF1C2}",
    "#hbIceOv .ice-sum{margin:8px 0;font-size:22px;background:#FFF6DC;border-radius:14px;padding:12px}#hbIceOv .ice-cnt3{display:flex;align-items:center;gap:6px;border-radius:14px;color:#fff;padding:6px 10px;font-weight:700}#hbIceOv .ice-cnt3 b{font:800 26px 'Thmanyah Display',Tahoma,sans-serif;min-width:30px;text-align:center}#hbIceOv .ice-cnt3 button{width:34px;height:34px;border:0;border-radius:10px;background:rgba(255,255,255,.3);color:#fff;font-size:20px;cursor:pointer}#hbIceOv .ice-cnt3 small{font-size:13px}",
    "#hbIceOv .ice-stack{display:flex;height:14px;border-radius:999px;overflow:hidden}#hbIceOv .ice-stack i{display:block}#hbIceOv .ice-grow{font-weight:800;color:#0B5F3A}",
    "#hbIceOv .ice-goal{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:10px 18px;background:#FFF6DD;border-bottom:1px solid #E8D9A8;color:#5A4410;font-size:17px;text-align:start}#hbIceOv .ice-goal .ice-gt{flex:1 1 280px}#hbIceOv .ice-goal b{color:#102A4C}#hbIceOv .ice-gb{border:1px solid #C4943A;background:#fff;color:#5A4410;border-radius:999px;padding:6px 14px;font-weight:800;font-size:15px;cursor:pointer;font-family:inherit}#hbIceOv .ice-gb.go{background:#C4943A;color:#102A4C}#hbIceOv .ice-gc{display:flex;gap:6px;align-items:center}#hbIceOv .ice-gc button{border:0;border-radius:12px;padding:6px 12px;font-weight:800;font-size:15px;cursor:pointer;font-family:inherit;color:#fff}#hbIceOv .ice-hint{display:block;font-size:14px;color:#B45309;min-height:18px;margin-top:2px}#hbIceOv .ice-mdl{display:flex;gap:8px;justify-content:center;margin:6px 0}#hbIceOv .ice-hist{margin-top:14px;border-top:1px dashed #cfd6e2;padding-top:10px;text-align:start}#hbIceOv .ice-hist h4{margin:0 0 6px;font-size:18px;color:#102A4C}#hbIceOv .ice-hr{display:flex;gap:10px;align-items:center;font-size:15px;padding:4px 0;border-bottom:1px solid #eef1f6}#hbIceOv .ice-hr>span:first-child{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#hbIceOv .ice-hr b{color:#0B5F3A}",
    "#hbIceOv .ice-pil{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:0 0 14px}#hbIceOv .ice-pil span{border:2px solid #d5dbe6;border-radius:999px;padding:6px 14px;font-weight:800;font-size:16px;color:#7b8798;background:#fff}#hbIceOv .ice-pil span.dn{border-color:#15803D;background:#E8F6EE;color:#0B5F3A}#hbIceOv .ice-pilh{font-size:15px;color:#5a6577;margin:0 0 10px}",
    "#hbWsOv{position:fixed;left:50%;top:calc(var(--hb-lay) + 50%);transform:translate(-50%,-50%);width:min(1200px,97vw);height:calc(100vh - var(--hb-lay) - 24px);z-index:31;display:none;flex-direction:column;background:#fff;color:#102A4C;border-radius:22px;box-shadow:0 30px 80px rgba(5,12,25,.5);overflow:hidden;font-family:'Thmanyah Text',Tahoma,sans-serif}#hbWsOv.on{display:flex}#hbWsOv .ws-h{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:10px 16px;border-bottom:1px solid #E6EBF2;background:#fff}#hbWsOv .ws-h b{font:800 22px 'Thmanyah Display','Thmanyah Text',Tahoma,sans-serif;margin-inline-end:6px}#hbWsOv .ws-h button{border:1px solid #cfd6e2;background:#fff;color:#102A4C;border-radius:999px;padding:8px 14px;font-weight:700;font-size:15px;font-family:inherit;cursor:pointer}#hbWsOv .ws-h button.on{background:#102A4C;color:#fff;border-color:#102A4C}#hbWsOv .ws-sp{flex:1}#hbWsOv .ws-x{border:0!important;background:#F1F4F9!important;border-radius:50%!important;width:40px;height:40px;padding:0!important;font-size:18px!important}#hbWsOv .ws-fr{flex:1;border:0;width:100%;background:#fff}#hbWsOv .ws-wn{background:#FFF1F0;color:#B3261E;padding:6px 16px;font-weight:800;font-size:15px}#hbWsOv .ws-none{padding:60px 24px;text-align:center;font-size:22px;color:#5a6577}#hbWsOv .ws-qrbox{position:absolute;top:68px;inset-inline-start:16px;background:#fff;padding:14px;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.35);z-index:3;text-align:center;font-weight:700;font-size:15px;width:210px}#hbWsOv #wsQr{width:180px;height:180px;margin:0 auto 8px;display:flex;align-items:center;justify-content:center;color:#7b8798}",
    "#hbIceOv .ice-lvg{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;text-align:start}#hbIceOv .ice-lvc{border:3px solid;border-radius:16px;overflow:hidden;background:#fff}#hbIceOv .ice-lvh{color:#fff;font-weight:800;font-size:20px;padding:8px 12px}#hbIceOv .ice-lvs{display:flex;flex-wrap:wrap;gap:6px;padding:8px}#hbIceOv .ice-lvs button{border:1px solid #cfd6e2;background:#fff;color:#102A4C;border-radius:999px;padding:5px 10px;font-weight:700;font-size:14px;font-family:inherit;cursor:pointer}#hbIceOv .ice-lvt{margin:4px 10px;font-size:16px;line-height:1.6}#hbIceOv .ice-lvt span{color:#5A4410;font-weight:800}#hbIceOv .ice-lvr{list-style:none;margin:6px 10px 10px;padding:0;font-size:15px}#hbIceOv .ice-lvr li{padding:3px 0;border-top:1px solid #eef1f6}#hbIceOv .ice-lvr small{float:inline-end;color:#5a6577;font-weight:700}#hbIceOv .ice-lvl{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:0 0 12px}#hbIceOv .ice-lvl span{border-radius:12px;color:#fff;padding:6px 12px;font-weight:700;font-size:15px}",
    "#hbIceOv .ice-bar{position:sticky;bottom:0;display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:center;padding:12px 16px;background:#F6F8FC;border-top:1px solid #E6EBF2;border-radius:0 0 22px 22px}#hbIceOv .ice-bl{font-weight:800;font-size:16px}",
    "#hbIceOv .ice-tm{display:inline-flex;align-items:center;gap:8px;border:0;border-radius:14px;padding:8px 14px;color:#fff;font-weight:700;font-size:16px;font-family:inherit;font-family:inherit;cursor:pointer}#hbIceOv .ice-tm b{font:800 24px 'Thmanyah Display',Tahoma,sans-serif}#hbIceOv .ice-tm i{font-style:normal;background:rgba(255,255,255,.3);border-radius:999px;padding:2px 10px;font-weight:800}#hbIceOv .ice-tm:disabled{opacity:.4}",
    "#hbClassOv{position:fixed;left:50%;top:calc(var(--hb-lay) + 50%);transform:translate(-50%,-50%);width:min(1000px,94vw);max-height:calc(100vh - var(--hb-lay) - 40px);overflow:auto;z-index:30;display:none;background:#fff;color:#102A4C;border-radius:22px;box-shadow:0 30px 80px rgba(5,12,25,.45);font-family:'Thmanyah Text',Tahoma,sans-serif}",
    "#hbClassOv.on{display:block}#hbClassOv .ct-h{display:flex;align-items:center;gap:8px;padding:14px 18px;border-bottom:1px solid #E6EBF2;position:sticky;top:0;background:#fff;z-index:1}",
    "#hbClassOv .ct-tab{font-weight:700;font-size:16px;font-family:inherit;border:0;background:#F1F4F9;color:#102A4C;border-radius:999px;padding:9px 18px;cursor:pointer}#hbClassOv .ct-tab.on{background:#102A4C;color:#fff}",
    "#hbClassOv .ct-x{margin-inline-start:auto;border:0;background:#F1F4F9;border-radius:50%;width:38px;height:38px;font-size:18px;cursor:pointer}",
    "#hbClassOv .ct-b{padding:18px 22px 22px}#hbClassOv .ct-row{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-bottom:14px;font-size:15px}",
    "#hbClassOv .ct-row input[type=number]{width:70px;font-weight:700;font-size:16px;font-family:inherit;padding:6px 8px;border:1px solid #CBD5E1;border-radius:10px;text-align:center}",
    "#hbClassOv .ct-btn{font-weight:700;font-size:15px;font-family:inherit;border:1px solid #CBD5E1;background:#fff;color:#102A4C;border-radius:12px;padding:9px 16px;cursor:pointer}#hbClassOv .ct-btn.pri{background:#102A4C;color:#fff;border-color:#102A4C}#hbClassOv .ct-btn.gold{background:#D4AA55;border-color:#D4AA55;color:#1B1405}",
    ".ct-groups{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px}",
    ".ct-g{border-radius:16px;padding:14px 16px;color:#fff;animation:hbPopIn .45s cubic-bezier(.2,1.4,.4,1) both}.ct-g h4{margin:0 0 8px;font:800 20px 'Thmanyah Display','Thmanyah Text',Tahoma,sans-serif}.ct-g ul{margin:0;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:6px}.ct-g li{background:rgba(255,255,255,.22);border-radius:999px;padding:3px 11px;font-weight:600}",
    "@keyframes hbPopIn{from{opacity:0;transform:scale(.6) translateY(20px)}}",
    ".ct-teams{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px}.ct-t{border-radius:18px;padding:14px;color:#fff;text-align:center;position:relative}.ct-t .hbc-nm{font:800 18px 'Thmanyah Display','Thmanyah Text',Tahoma,sans-serif;background:transparent;border:0;color:#fff;text-align:center;width:100%}",
    ".ct-t .hbc-sc{font:900 64px/1.1 ui-rounded,'Thmanyah Display',Tahoma,sans-serif;font-variant-numeric:tabular-nums;transition:transform .25s}.ct-t .hbc-sc.hbc-bump{transform:scale(1.3)}.ct-t .hbc-crown{position:absolute;top:-14px;inset-inline-end:10px;font-size:28px}",
    ".ct-t .hbc-pm{display:flex;gap:8px;justify-content:center}.ct-t .hbc-pm button{width:52px;height:42px;border-radius:12px;border:0;font-weight:800;font-size:22px;font-family:inherit;cursor:pointer;background:rgba(255,255,255,.95);color:#102A4C}.ct-t .hbc-pm button.hbc-m{background:rgba(255,255,255,.3);color:#fff}",
    "#hbScore{position:fixed;inset-inline-end:20px;bottom:20px;z-index:12;display:none;gap:8px;padding:8px;background:rgba(11,22,40,.88);border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.35);cursor:grab;touch-action:none;font-family:'Thmanyah Text',Tahoma,sans-serif}#hbScore.on{display:flex}",
    "#hbScore .hbc-ms{height:auto;line-height:1.2;min-width:74px;border-radius:12px;padding:6px 10px;color:#fff;text-align:center;cursor:pointer;user-select:none}#hbScore .hbc-ms b{display:block!important;margin:0;font:900 26px/1 ui-rounded,Tahoma,sans-serif}#hbScore .hbc-ms span{display:block;font-size:12px;font-weight:700;opacity:.95;white-space:nowrap}",
    ".ct-noise{display:grid;grid-template-columns:1fr 240px;gap:22px;align-items:center}.ct-meter{height:64px;border-radius:999px;background:#EEF2F7;overflow:hidden;position:relative}.ct-meter i{position:absolute;inset-block:0;inset-inline-start:0;width:0;border-radius:999px;background:#2E9E5B;transition:width .12s,background .3s}.ct-meter u{position:absolute;inset-block:-6px;width:4px;background:#102A4C;border-radius:2px}",
    ".ct-face{font-size:120px;text-align:center;line-height:1}.ct-msg{font:800 26px 'Thmanyah Display','Thmanyah Text',Tahoma,sans-serif;text-align:center;margin-top:6px}",
    "#hbClassOv.loud{animation:hbLoud .5s 3}@keyframes hbLoud{50%{box-shadow:0 0 0 14px rgba(214,69,69,.55),0 30px 80px rgba(5,12,25,.45)}}",
    "#hbNoise{position:fixed;inset-inline-start:20px;bottom:20px;z-index:12;display:none;align-items:center;gap:10px;padding:8px 14px;background:rgba(11,22,40,.88);border-radius:999px;color:#fff;font:700 14px 'Thmanyah Text',Tahoma,sans-serif;cursor:pointer}#hbNoise.on{display:flex}#hbNoise .ct-meter{width:160px;height:14px;background:rgba(255,255,255,.15)}#hbNoise .hbc-f{font-size:26px}",
    "#hbSavePop{width:340px}#hbRecPop{width:360px}",
    "#tb.hb #hbRec.rec{background:#C62828;color:#fff;border-color:#C62828}#tb.hb #hbRec.rec svg{animation:hbPulse 1.2s infinite}#tb.hb #hbRec.paused{background:#8A5A00;color:#fff}",
    "@keyframes hbPulse{50%{opacity:.35}}#tb.hb #hbRecL{font-variant-numeric:tabular-nums;direction:ltr}",
    "#hbCam{position:fixed;inset-inline-start:24px;bottom:24px;width:190px;height:190px;border-radius:50%;overflow:hidden;z-index:9;border:4px solid #D4AA55;box-shadow:0 10px 30px rgba(0,0,0,.35);cursor:grab;touch-action:none;background:#0B1628}#hbCam video{width:100%;height:100%;object-fit:cover;transform:scaleX(-1)}#hbCam.sm{width:120px;height:120px}",
    "#hbRecDone video{width:100%;border-radius:10px;background:#000;max-height:46vh}",
    ".hb-pop .hb-pick{margin-top:12px;min-height:96px;border-radius:18px;background:linear-gradient(135deg,#102A4C,#1E4E86);color:#FFF0C2;display:flex;align-items:center;justify-content:center;text-align:center;font:700 46px/1.2 'Thmanyah Display',Tahoma,sans-serif;padding:10px;transition:transform .25s}",
    ".hb-pop .hb-pick.done{transform:scale(1.05);background:linear-gradient(135deg,#D4AA55,#F0C977);color:#1B1405}",
    ".hb-pop .hb-keys{display:grid;grid-template-columns:auto 1fr;gap:6px 14px;font-size:15px}",
    ".hb-pop kbd{font:600 13px ui-monospace,monospace;background:#F2EEE6;border:1px solid #DCD2BF;border-bottom-width:2px;border-radius:6px;padding:2px 7px;color:#1F2A3C;white-space:nowrap}",
    /* لوحة الشرائح */
    "#hbDrawer{position:fixed;top:var(--hb-lay);bottom:0;width:248px;background:#0E1D33;z-index:15;overflow-y:auto;padding:14px 12px 30px;box-sizing:border-box;display:flex;flex-direction:column;gap:12px;transform:translateX(" + (RTL ? "100%" : "-100%") + ");transition:transform .32s cubic-bezier(.2,.8,.2,1),top .3s;" + (RTL ? "right:0;" : "left:0;") + "scrollbar-width:thin;scrollbar-color:#2E4A70 transparent;font-family:'Thmanyah Text',Tahoma,sans-serif}",
    "#hbDrawer.open{transform:none}",
    "#hbDrawer .hb-th{position:relative;display:block;width:100%;border:0;padding:0;background:none;cursor:pointer;text-align:start;color:#C9D4E3;font:13px 'Thmanyah Text',Tahoma,sans-serif}",
    "#hbDrawer .hb-thb{position:relative;width:224px;height:126px;border-radius:10px;overflow:hidden;background:#fff;box-shadow:0 0 0 2px rgba(255,255,255,.08);transition:box-shadow .15s,transform .15s}",
    "#hbDrawer .hb-th:hover .hb-thb{box-shadow:0 0 0 2px rgba(212,170,85,.6);transform:translateY(-1px)}",
    "#hbDrawer .hb-th.cur .hb-thb{box-shadow:0 0 0 3px #D4AA55}",
    "#hbDrawer .hb-thi{position:absolute;left:0;top:0;width:1920px;height:1080px;transform:scale(" + (224 / 1920) + ");transform-origin:0 0;pointer-events:none}",
    "#hbDrawer .hb-thi .sl{opacity:1!important;transform:none!important;pointer-events:none!important}",
    "#hbDrawer .hb-thi *{animation:none!important;transition:none!important;view-transition-name:none!important}",
    "#hbDrawer .hb-thi .hid{opacity:1!important;transform:none!important}",
    "#hbDrawer .hb-thi aside{display:none!important}",
    "#hbDrawer .hb-thn{position:absolute;top:6px;" + (RTL ? "right" : "left") + ":6px;min-width:24px;height:24px;padding:0 6px;border-radius:7px;background:rgba(15,35,64,.85);color:#fff;font:700 13px 'Thmanyah Text',Tahoma,sans-serif;display:flex;align-items:center;justify-content:center;z-index:2}",
    "#hbDrawer .hb-th.cur .hb-thn{background:#D4AA55;color:#1B1405}",
    "#hbDrawer .hb-tht{display:block;margin-top:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    /* طبقات العرض */
    "#hbInk,#hbLaser{position:fixed;left:0;right:0;top:var(--hb-lay);bottom:0;width:100%;height:calc(100% - var(--hb-lay));z-index:8;pointer-events:none;touch-action:none}",
    "#hbLaser{z-index:9}",
    "#hbInk.live{pointer-events:auto}",
    "#hbInk.t-pen{cursor:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22'%3E%3Ccircle cx='11' cy='11' r='4' fill='%23102A4C' stroke='white' stroke-width='2'/%3E%3C/svg%3E\") 11 11,crosshair}",
    "#hbInk.t-hl{cursor:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26' height='26'%3E%3Crect x='7' y='4' width='12' height='18' rx='3' fill='%23FFE14D' fill-opacity='.8' stroke='%23102A4C' stroke-width='1.5'/%3E%3C/svg%3E\") 13 13,crosshair}",
    "#hbInk.t-eraser{cursor:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30'%3E%3Ccircle cx='15' cy='15' r='12' fill='white' fill-opacity='.5' stroke='%23102A4C' stroke-width='2'/%3E%3C/svg%3E\") 15 15,cell}",
    "#hbInk.t-text{cursor:text}",
    "#hbInk.t-pan{cursor:grab}#hbInk.t-pan.drag{cursor:grabbing}",
    "#hbTxt{position:fixed;z-index:30;min-width:120px;font:700 28px 'Thmanyah Text',Tahoma,sans-serif;background:rgba(255,255,255,.92);border:2px dashed #D4AA55;border-radius:10px;padding:4px 10px;outline:none;color:#102A4C}",
    "#hbRuler{position:fixed;left:0;right:0;top:var(--hb-lay);bottom:0;z-index:9;pointer-events:none;display:none}#hbRuler.on{display:block}#hbRuler i{position:absolute;left:0;right:0;background:rgba(8,14,26,.62)}#hbRuler i:first-child{top:0}#hbRuler i:last-child{bottom:0}#hbRuler b{position:absolute;left:0;right:0;border-block:3px solid #D4AA55;box-sizing:border-box}",
    ".hb-reading #wrap,.hb-reading #wrap *{cursor:help!important}.hb-say{outline:4px solid #D4AA55!important;outline-offset:6px;border-radius:6px;background:rgba(212,170,85,.14)!important}",
    "#hbSupPop{width:380px}#hbSupPop .hb-sec{border-top:1px solid #E6EBF2;padding-top:10px;margin-top:10px}#hbSupPop .hb-sec:first-of-type{border:0;margin:0;padding:0}#hbSupPop .hb-st{font-weight:800;margin-bottom:6px}",
    "#hbLSpot{position:fixed;left:0;right:0;top:var(--hb-lay);bottom:0;z-index:10;pointer-events:none;display:none}",
    "#hbLSpot.on{display:block}",
    "#hbLBlack{position:fixed;left:0;right:0;top:var(--hb-lay);bottom:0;z-index:11;display:none;background:#05080E;align-items:center;justify-content:center;color:rgba(255,255,255,.25);font:600 18px 'Thmanyah Text',Tahoma,sans-serif;cursor:pointer}",
    "#hbLBlack.on{display:flex}",
    "#hbLBoard{position:fixed;z-index:7;display:none;background:#FFFEFA;background-image:linear-gradient(rgba(16,42,76,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(16,42,76,.07) 1px,transparent 1px);box-shadow:0 0 0 9999px rgba(14,22,33,.35)}",
    "#hbLBoard.on{display:block}",
    "#hbPickPop .hb-wheelbox{text-align:center;margin:8px 0 2px}#hbPickPop .hb-wheelbox canvas{width:min(300px,100%);height:auto;display:inline-block}",
    ".hbBurst{position:fixed;inset:0;z-index:40;pointer-events:none;overflow:hidden}.hbBurst i{position:absolute;top:-30px;width:11px;height:17px;border-radius:2px;font-style:normal;font-size:28px;line-height:1;width:auto;height:auto;animation:hbFall 2s linear both}.hbBurst i:not(:empty){background:none}.hbBurst i:empty{width:11px;height:17px}@keyframes hbFall{to{transform:translateY(112vh) rotate(540deg);opacity:.85}}",
    "#hbPaperPop .hb-papers{display:grid;grid-template-columns:1fr;gap:6px;min-width:230px}#hbPaperPop .hb-papers .hb-btn{text-align:start;justify-content:flex-start}",
    "#hbLBoard b{position:absolute;top:12px;" + (RTL ? "right" : "left") + ":16px;font:700 18px 'Thmanyah Display',Tahoma,sans-serif;color:rgba(16,42,76,.45)}",
    "#hbLCurt{position:fixed;z-index:9;display:none;overflow:hidden}",
    "#hbLCurt.on{display:block}",
    "#hbLCurt .hb-cv{position:absolute;left:0;right:0;bottom:0;background:#102A4C;background-image:repeating-linear-gradient(90deg,rgba(255,255,255,.05) 0 2px,transparent 2px 26px),linear-gradient(180deg,#17325A,#0B1C33);box-shadow:0 -10px 30px rgba(0,0,0,.35)}",
    "#hbLCurt .hb-ch{position:absolute;left:50%;top:14px;transform:translateX(-50%);height:44px;padding:0 18px;border-radius:22px;background:#D4AA55;color:#1B1405;display:flex;align-items:center;gap:8px;font:700 16px 'Thmanyah Text',Tahoma,sans-serif;cursor:ns-resize;box-shadow:0 6px 18px rgba(0,0,0,.35);user-select:none;touch-action:none;white-space:nowrap}",
    "#hbDock{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:13;display:none;align-items:center;gap:6px;padding:6px;background:rgba(15,35,64,.92);border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.35);touch-action:none}#hbDock.on{display:flex}",
    "#hbDock button{width:58px;height:58px;border-radius:50%;border:0;background:rgba(255,255,255,.08);color:#E9EEF5;display:grid;place-items:center;cursor:pointer}#hbDock button svg{width:28px;height:28px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}#hbDock button.on{background:#D4AA55;color:#1B1405}#hbDock .hbd-nav{background:#D4AA55;color:#1B1405;width:66px;height:66px}#hbDock .hbd-nav svg{width:34px;height:34px}#hbDock i{width:1px;height:34px;background:rgba(255,255,255,.18)}#hbDock .hb-flip svg,#hbDock svg.hb-flip{transform:scaleX(-1)}",
    "@media (pointer:coarse){#tb.hb .hb-r1{height:62px}#tb.hb .hb-r2{height:56px}#tb.hb button.hb-b{min-width:46px;min-height:44px}#tb.hb button.hb-b svg{width:24px;height:24px}.hb-pop button,.hb-pop .hb-btn{min-height:44px}}",
    ".hb-dockon #hbHint{bottom:104px}.hb-dockon #hbScore,.hb-dockon #hbNoise{bottom:100px}",
    ".hb-sr{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}",
    "#hbHint{position:fixed;left:50%;bottom:22px;transform:translateX(-50%) translateY(20px);opacity:0;background:#0F2340;color:#fff;font:15px 'Thmanyah Text',Tahoma,sans-serif;padding:8px 16px;border-radius:12px;z-index:45;pointer-events:none;transition:opacity .25s,transform .25s;box-shadow:0 8px 24px rgba(0,0,0,.35)}",
    "#hbHint.on{opacity:1;transform:translateX(-50%)}",
    "#hbZone{position:fixed;left:0;right:0;top:0;height:14px;z-index:19;display:none}",
    /* مؤقّت الصف والتنبيه (يتحكّم فيهما الجوال) */
    "#hbTm{position:fixed;bottom:22px;left:18px;z-index:46;display:none;width:200px;height:200px;pointer-events:none;font-family:'Thmanyah Display','Thmanyah Text',Tahoma,sans-serif;direction:ltr}",
    ".hb-dockon #hbTm{bottom:104px}#hbTm.on{display:block}",
    "#hbTm svg{width:100%;height:100%;overflow:visible;filter:drop-shadow(0 10px 22px rgba(0,0,0,.45))}",
    "#hbTm .tm-bg{fill:#0F2340;stroke:#D4AA55;stroke-width:2}#hbTm .tm-in{fill:none;stroke:rgba(212,170,85,.35);stroke-width:1.5}#hbTm .tm-tr{fill:none;stroke:rgba(255,255,255,.12);stroke-width:12}",
    "#hbTm .tm-pr{fill:none;stroke:#D4AA55;stroke-width:12;stroke-linecap:round;transform:rotate(-90deg);transform-origin:100px 100px;transition:stroke-dashoffset .25s linear,stroke .3s}",
    "#hbTm .tm-dot{fill:#D4AA55;opacity:.75}#hbTm .tm-t{fill:#FFF0C2;font-weight:800;font-size:46px;text-anchor:middle}#hbTm .tm-s{fill:#D4AA55;font-weight:700;font-size:15px;text-anchor:middle}",
    "#hbTm.mid .tm-pr{stroke:#E8833A}#hbTm.low .tm-pr{stroke:#E5484D}#hbTm.low .tm-bg{fill:#3A1015}#hbTm.low{animation:hbTmP 1s infinite}",
    "#hbTm.end .tm-bg{fill:#D4AA55}#hbTm.end .tm-t,#hbTm.end .tm-s{fill:#1B1405}#hbTm.end .tm-pr{stroke:#1B1405}#hbTm.end .tm-in{stroke:rgba(27,20,5,.35)}#hbTm.end{animation:hbTmF .5s 6}",
    "#hbTm.q .tm-bg{fill:#0E3B3A;stroke:#7FC8C0}#hbTm.q .tm-pr{stroke:#7FC8C0}#hbTm.q .tm-in{stroke:rgba(127,200,192,.35)}#hbTm.q .tm-dot{fill:#7FC8C0}#hbTm.q .tm-t{fill:#E6FAF6}#hbTm.q .tm-s{fill:#7FC8C0}#hbTm.q.end .tm-bg{fill:#0E3B3A}#hbTm.q.end .tm-t,#hbTm.q.end .tm-s{fill:#E6FAF6}#hbTm.q.end .tm-pr{stroke:#7FC8C0}#hbTm.q.end{animation:none}",
    "@keyframes hbTmP{50%{transform:scale(1.05)}}@keyframes hbTmF{50%{opacity:.4}}",
    "#hbBell{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(.8);z-index:47;opacity:0;pointer-events:none;background:#D4AA55;color:#1B1405;font:800 64px 'Thmanyah Display','Thmanyah Text',Tahoma,sans-serif;padding:18px 44px;border-radius:32px;box-shadow:0 20px 60px rgba(0,0,0,.45);transition:opacity .25s,transform .25s;white-space:nowrap;direction:rtl}",
    "#hbBell.on{opacity:1;transform:translate(-50%,-50%) scale(1)}",
    "@media (prefers-reduced-motion:reduce){#tb.hb,#hbDrawer,#wrap{transition:none!important}#hbTm.low,#hbTm.end{animation:none!important}}"
  ].join("\n");
  D.head.appendChild(css);

  /* ---------- العنوان ---------- */
  var oldTitle = (tb.querySelector("b") || {}).textContent || D.title || "";
  var title = oldTitle.replace(/^\s*(عرض المعلم|Teacher presentation)\s*·\s*/, "").replace(/\s*·\s*حراء\s*$/, "").trim();
  var LOGO = '<svg viewBox="0 0 40 56" aria-hidden="true"><path d="M20 3a2 2 0 0 1 2 2v3h-4V5a2 2 0 0 1 2-2z" fill="#E9EEF5"/><path d="M11 14c0-4 4-6 9-6s9 2 9 6z" fill="#E9EEF5"/><rect x="9" y="14" width="22" height="3" rx="1.5" fill="#E9EEF5"/><path d="M10 19h20l2 22c-6 4-18 4-24 0z" fill="none" stroke="#E9EEF5" stroke-width="2.4" stroke-linejoin="round"/><circle cx="20" cy="30" r="8" fill="#D4AA55" opacity=".25"/><path d="M20 23l5 9c1 2.5-.5 5-3 5h-4c-2.5 0-4-2.5-3-5z" fill="#D4AA55"/><path d="M16 46h8l-4 6z" fill="#E9EEF5"/></svg><span>' + (EN ? "Hira" : "حِرَاء") + "</span>";

  /* ---------- بناء الشريط ---------- */
  var B = function (id, icon, tip, label, cls, flip) {
    return '<button type="button" class="hb-b' + (cls ? " " + cls : "") + '" id="' + id + '" data-tip="' + tip + '" aria-label="' + tip + '">' + ic(icon, flip) + (label ? '<span class="hb-lbl">' + label + "</span>" : "") + "</button>";
  };
  var fxOld = $("fx");
  var fxOpts = fxOld ? [].slice.call(fxOld.options).map(function (o) { return '<option value="' + o.value + '">' + o.textContent.replace(/^[^\p{L}]+/u, "") + "</option>"; }).join("") : "";
  var r1 = D.createElement("div"); r1.className = "hb-r hb-r1"; r1.dir = RTL ? "rtl" : "ltr";
  r1.innerHTML =
    '<div class="hb-brand"><div class="hb-logo">' + LOGO + '</div><div style="min-width:0;display:flex;flex-direction:column;line-height:1.25"><span class="hb-ttl" title="' + title.replace(/"/g, "&quot;") + '">' + title + '</span><span class="hb-sub">' + T("عرض المعلم", "Teacher presentation") + '</span></div></div>' +
    '<div class="hb-g">' +
    (LIVE ? '<button type="button" class="hb-b hb-livebtn" id="hbLive" data-tip="' + T("شارك الطلاب من أجهزتهم", "Students join from their devices") + '" aria-label="' + T("شارك الطلاب", "Students join") + '">' + ic("users") + '<span class="hb-lbl">' + T("شارك الطلاب", "Students join") + '</span><span class="hb-badge" id="hbLiveN" hidden></span></button>' +
      '<button type="button" class="hb-b hb-askbtn" id="hbAsk" hidden data-tip="' + T("اسأل الصف: يجيب الطلاب من أجهزتهم", "Ask the class") + '" aria-label="' + T("اسأل الصف", "Ask the class") + '">' + ic("ask") + '<span class="hb-lbl">' + T("اسأل الصف", "Ask") + '</span></button><span class="hb-sep"></span>' : "") +
    (fxOld ? '<span data-tip="' + T("الانتقال بين الشرائح", "Slide transition") + '" style="display:inline-flex;align-items:center;gap:6px;color:#E9EEF5;margin-inline-end:4px"><svg viewBox="0 0 24 24" width="20" height="20" style="fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round"><path d="' + P.film + '"/></svg><select class="hb-sel" id="hbFx" aria-label="' + T("الانتقال بين الشرائح", "Slide transition") + '">' + fxOpts + "</select></span>" : "") +
    ($("bPg") ? B("hbPg", "chart", T("قياس التقدّم", "Progress check"), T("قياس التقدّم", "Progress")) : "") +
    ($("bT") ? B("hbT", "timer", T("المؤقت (T)", "Timer (T)"), T("المؤقت", "Timer")) : "") +
    ($("bS") ? B("hbS", "bell", T("لفت الانتباه", "Get attention"), T("الانتباه", "Attention")) : "") +
    B("hbPick", "dice", T("اختيار طالب عشوائيًّا", "Pick a student"), T("القرعة", "Pick")) +
    B("hbIce", "ice", T("كسر الجليد: أنشطة تنافسية من كلمات الدرس", "Ice-breakers: competitive activities from the lesson"), T("الجليد", "Ice")) +
    B("hbAct", "bolt", T("التعلّم النشط: أنشطة تفاعلية من الدرس", "Active learning: interactive lesson activities"), T("نشط", "Active")) +
    B("hbFb", "chat", T("الفيدباك: من المعلم ومن الأقران وتقييم ذاتي", "Feedback: teacher, peers and self-assessment"), T("فيدباك", "Feedback")) +
      B("hbGm", "game", T("ألعاب وتقويم: مسابقة الصف وبطاقة الخروج وأركان الدرس", "Games & assessment: class quiz, exit ticket, lesson checklist"), T("ألعاب", "Games")) +
      B("hbWs", "clip", T("أوراق العمل: ورقة الطالب والمجموعات ومفتاح الإجابة", "Worksheets: student, group, answer key"), T("أوراق", "Worksheets")) +
    B("hbClass", "cup", T("إدارة الصف: المجموعات والنقاط ومقياس الهدوء", "Class tools: groups, points, noise meter"), T("الصف", "Class")) +
    ($("bNo") ? B("hbNo", "notes", T("ملاحظات المعلم (N)", "Teacher notes (N)"), T("الملاحظات", "Notes")) : "") +
    ($("bE") ? B("hbE", "edit", T("تعديل نصوص الشريحة", "Edit slide text"), T("تعديل", "Edit")) : "") +
    "</div>" +
    '<span class="hb-sep"></span>' +
    B("hbPV", "pv", T("شاشة المعلم: الملاحظات والشريحة التالية على حاسوبك", "Presenter view: notes and next slide on your laptop")) +
    ((navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia && W.MediaRecorder) ? '<button type="button" class="hb-b" id="hbRec" data-tip="' + T("سجّل شرحك فيديو: الشرائح وكتابتك وصوتك", "Record your explanation: slides, ink and voice") + '" aria-label="' + T("تسجيل الشرح", "Record") + '">' + ic("rec") + '<span class="hb-lbl" id="hbRecL">' + T("تسجيل", "Record") + '</span></button><button type="button" class="hb-b" id="hbRecP" hidden data-tip="' + T("إيقاف مؤقت / متابعة", "Pause / resume") + '" aria-label="' + T("إيقاف مؤقت", "Pause") + '">⏸</button><button type="button" class="hb-b" id="hbRecS" hidden data-tip="' + T("إنهاء التسجيل", "Stop recording") + '" aria-label="' + T("إنهاء التسجيل", "Stop") + '">⏹</button>' : "") +
    (LIVE ? B("hbRemote", "phone", T("تحكّم بالعرض من جوالك", "Control from your phone")) : "") +
    B("hbF", "full", T("ملء الشاشة (F)", "Full screen (F)"), T("ملء الشاشة", "Full screen"), "gold") +
    B("hbX", "close", T("إغلاق العرض", "Close"), T("إغلاق", "Close"), "x");
  var r2 = D.createElement("div"); r2.className = "hb-r hb-r2"; r2.dir = RTL ? "rtl" : "ltr";
  r2.innerHTML =
    '<div class="hb-g">' + B("hbSide", "panel", T("الشرائح", "Slides")) + B("hbFind", "search", T("بحث في الشرائح", "Search slides")) + "</div>" +
    '<span class="hb-sep"></span>' +
    '<div class="hb-g">' + B("hbFirst", "first", T("الشريحة الأولى (Home)", "First slide (Home)"), "", "", RTL) + B("hbPrev", "prev", T("السابق", "Previous"), "", "", RTL) +
    '<span class="hb-pg"><input id="hbNum" inputmode="numeric" aria-label="' + T("رقم الشريحة", "Slide number") + '"><span>' + T("من", "of") + ' <span id="hbTot" style="font-weight:700">' + N + "</span></span></span>" +
    B("hbNext", "next", T("التالي", "Next"), "", "", RTL) + B("hbLast", "last", T("الشريحة الأخيرة (End)", "Last slide (End)"), "", "", RTL) + "</div>" +
    '<span class="hb-sp"></span>' +
    '<div class="hb-g">' + B("hbZo", "zout", T("تصغير", "Zoom out")) + B("hbZi", "zin", T("تكبير (Ctrl + عجلة الفأرة)", "Zoom in (Ctrl + wheel)")) +
    '<select class="hb-sel" id="hbZ" aria-label="' + T("التكبير", "Zoom") + '"><option value="1">' + T("ملاءمة الشاشة", "Fit to screen") + '</option><option value="1.25">125%</option><option value="1.5">150%</option><option value="2">200%</option><option value="3">300%</option></select></div>' +
    '<span class="hb-sp"></span>' +
    '<div class="hb-g">' + B("hbTpan", "pan", T("تحريك الشريحة المكبَّرة", "Pan (when zoomed)")) + B("hbTlaser", "laser", T("مؤشر الليزر (L)", "Laser pointer (L)")) +
    B("hbTpen", "pen", T("قلم (P)", "Pen (P)")) + B("hbThl", "hl", T("قلم تظليل (H)", "Highlighter (H)")) + B("hbTtext", "text", T("كتابة نص", "Text")) +
    B("hbTeraser", "eraser", T("ممحاة", "Eraser")) +
    '<button type="button" class="hb-b" id="hbCol" data-tip="' + T("اللون والسُّمك", "Colour & size") + '" aria-label="' + T("اللون والسُّمك", "Colour & size") + '"><span class="hb-sw" id="hbSw"></span></button>' +
    B("hbUndo", "undo", T("تراجع (Ctrl+Z)", "Undo (Ctrl+Z)")) + B("hbClr", "trash", T("مسح كتابة الشريحة", "Clear this slide's ink")) + B("hbSave", "pdf", T("حفظ الشرح: كتابتك على الشرائح PDF", "Save your annotated slides as PDF")) + "</div>" +
    '<span class="hb-sep"></span>' +
    '<div class="hb-g">' + B("hbSup", "sup", T("دعم القراءة: اقرأ لي، والتشكيل، ومسطرة القراءة", "Reading support: read aloud, vowel marks, reading ruler")) + B("hbSpot", "spot", T("الكشّاف: يُظلم كل شيء إلا ما تشير إليه (S)", "Spotlight (S)")) + B("hbCurt", "curtain", T("الستارة: اكشف الشريحة تدريجيًّا", "Curtain reveal")) +
    B("hbBoard", "board", T("سبورة بيضاء (W)", "Whiteboard (W)")) + B("hbPaper", "paper", T("ورق السبورة: أربعة خطوط وسطور ومربعات", "Board paper: four lines, ruled, grid")) + B("hbBlack", "moon", T("شاشة سوداء (B)", "Black screen (B)")) + B("hbDockT", "dock", T("شريط السبورة السفلي: للسبورة الذكية واللمس", "Bottom board bar: for smart boards and touch")) + B("hbKeys", "keys", T("اختصارات لوحة المفاتيح", "Keyboard shortcuts")) + "</div>" +
    '<div class="hb-pbar"><div class="hb-prog" id="hbProg"></div></div>';
  tb.classList.add("hb"); tb.appendChild(r1); tb.appendChild(r2);
  r2.querySelector(".hb-pbar").style.display = "block";
  r2.querySelector(".hb-prog").style.cssText = "position:absolute;display:block;top:0;bottom:0;" + (RTL ? "right:0" : "left:0") + ";width:0";

  var mk = function (tag, id, html) { var e = D.createElement(tag); if (id) e.id = id; if (html) e.innerHTML = html; D.body.appendChild(e); return e; };
  var ink = mk("canvas", "hbInk"), laser = mk("canvas", "hbLaser"), spot = mk("div", "hbLSpot"), black = mk("div", "hbLBlack", T("شاشة سوداء · اضغط هنا أو B للعودة", "Black screen · click or press B to return"));
  var board = mk("div", "hbLBoard", "<b>" + T("السبورة", "Whiteboard") + "</b>"), curt = mk("div", "hbLCurt", '<div class="hb-cv"><div class="hb-ch">⇕ ' + T("اسحب لكشف الشريحة", "Drag to reveal") + "</div></div>");
  var hint = mk("div", "hbHint"), drawer = mk("div", "hbDrawer"), zone = mk("div", "hbZone");
  drawer.setAttribute("aria-label", T("الشرائح", "Slides")); drawer.setAttribute("role", "navigation");
  /* احتفال خفيف فوق الشريحة: نجوم وأوراق ملوّنة تتساقط ثم تزول (يحترم «تقليل الحركة») */
  var burst = function (emo) {
    if (W.matchMedia && W.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var box = D.createElement("div"); box.className = "hbBurst"; box.setAttribute("aria-hidden", "true");
    var cols = ["#D4AA55", "#14A37F", "#E8833A", "#3B82F6", "#E5484D", "#8B5CF6"], em = emo || ["⭐", "🌟", "🎉"];
    for (var i = 0; i < 46; i++) {
      var it = D.createElement("i"), star = i % 5 === 0;
      it.style.cssText = "left:" + (Math.random() * 100).toFixed(1) + "%;animation-delay:" + (Math.random() * 0.5).toFixed(2) + "s;animation-duration:" + (1.6 + Math.random() * 1.1).toFixed(2) + "s;" + (star ? "" : "background:" + cols[i % cols.length]);
      if (star) it.textContent = em[(i / 5) % em.length | 0];
      box.appendChild(it);
    }
    D.body.appendChild(box); setTimeout(function () { box.remove(); }, 3200);
  };
  W.__hbBurst = burst;
  var hintT; var say = function (t) { hint.textContent = t; hint.classList.add("on"); clearTimeout(hintT); hintT = setTimeout(function () { hint.classList.remove("on"); }, 1800); };
  var stop = function (el) { ["keydown", "keyup", "keypress", "click"].forEach(function (k) { el.addEventListener(k, function (e) { e.stopPropagation(); }); }); };

  /* ---------- الهندسة: موضع الشريحة والتكبير ---------- */
  var Z = 1, px = 0, py = 0, G = { x: 0, y: 0, k: 1, w: 0, h: 0, ox: 0 };
  var BARH = function () { return r1.offsetHeight + r2.offsetHeight; };
  var fs = function () { return !!D.fullscreenElement; };
  var layH = function () { return fs() ? 0 : BARH(); };
  var drawerW = function () { return drawer.classList.contains("open") ? 248 : 0; };
  function geom() {
    var top = layH(), w = innerWidth - drawerW(), h = innerHeight - top;
    var k0 = Math.min(w / 1920, h / 1080), k = k0 * Z;
    var ox = RTL ? 0 : drawerW();
    var x = ox + (w - 1920 * k) / 2 + px, y = (h - 1080 * k) / 2 + py;
    G = { x: x, y: y, k: k, w: w, h: h, top: top, ox: ox, k0: k0 };
    return G;
  }
  function fit() {
    D.documentElement.style.setProperty("--hb-h", BARH() + "px");
    D.documentElement.style.setProperty("--hb-lay", layH() + "px");
    var g = geom();
    stage.style.transform = "translate(" + g.x + "px," + g.y + "px) scale(" + g.k + ")";
    sizeCanvas(); place(); redraw();
  }
  function clampPan() {
    var g0 = geom(); var ew = 1920 * g0.k, eh = 1080 * g0.k;
    var mx = Math.max(0, (ew - g0.w) / 2 + 40), my = Math.max(0, (eh - g0.h) / 2 + 40);
    px = Math.max(-mx, Math.min(mx, px)); py = Math.max(-my, Math.min(my, py));
  }
  function setZoom(z, cx, cy) {
    z = Math.max(1, Math.min(4, Math.round(z * 100) / 100));
    var g0 = geom();
    if (cx == null) { cx = g0.ox + g0.w / 2; cy = g0.h / 2; } else cy -= g0.top;
    var sx = (cx - g0.x) / g0.k, sy = (cy - g0.y) / g0.k;
    Z = z; if (Z === 1) { px = 0; py = 0; } else { px = 0; py = 0; var g1 = geom(); px = cx - sx * g1.k - g1.x; py = cy - sy * g1.k - g1.y; clampPan(); }
    var sel = $("hbZ"), v = String(Z), has = [].some.call(sel.options, function (o) { return o.value === v; });
    if (!has) { var o = sel.querySelector("option.cust") || D.createElement("option"); o.className = "cust"; o.value = v; o.textContent = Math.round(Z * 100) + "%"; if (!o.parentNode) sel.appendChild(o); }
    sel.value = v; $("hbZo").disabled = Z <= 1; fit();
  }
  W.fit = fit;
  var toStage = function (cx, cy) { return { x: (cx - G.x) / G.k, y: (cy - G.top - G.y) / G.k }; };

  /* ---------- الشريحة الحالية ---------- */
  var cur = 0;
  var readCur = function () { var m = ($("pg") ? $("pg").textContent : "").match(/(\d+)\s*\/\s*(\d+)/); if (m) return +m[1] - 1; var k = SL.findIndex(function (s) { return s.classList.contains("on"); }); return k < 0 ? 0 : k; };
  var go = function (k, end) { k = Math.max(0, Math.min(N - 1, k)); if (typeof W.show === "function") W.show(k, end); else ev("show(" + k + (end ? ",true" : "") + ")"); };
  var slideFx = [];
  function onSlide() {
    var k = readCur(); var changed = k !== cur; cur = k;
    var num = $("hbNum"); if (D.activeElement !== num) num.value = k + 1;
    $("hbProg").style.width = (N > 1 ? (k / (N - 1)) * 100 : 100) + "%";
    $("hbFirst").disabled = $("hbPrev").disabled = k === 0; $("hbLast").disabled = k === N - 1;
    drawer.querySelectorAll(".hb-th").forEach(function (t, i) { t.classList.toggle("cur", i === k); });
    if (changed) { var c = drawer.querySelector(".hb-th.cur"); if (c && drawer.classList.contains("open")) c.scrollIntoView({ block: "nearest", behavior: "smooth" }); if (curt.classList.contains("on")) { curtY = 0; place(); } }
    redraw(); slideFx.forEach(function (f) { try { f(k, changed); } catch (e) {} }); if (W.__hbOnSlide) W.__hbOnSlide(k, changed);
  }
  if ($("pg")) new MutationObserver(onSlide).observe($("pg"), { childList: true, characterData: true, subtree: true });

  /* ---------- أزرار الشريط ---------- */
  var on = function (id, fn) { var e = $(id); if (e) e.addEventListener("click", function (ev2) { ev2.stopPropagation(); fn(ev2, e); }); };
  var pops = function () { return [].slice.call(D.querySelectorAll(".pop")); };
  var closePops = function (except) { pops().forEach(function (p) { if (p !== except) p.style.display = "none"; }); };
  var anchor = function (p, btn) {
    var r = btn.getBoundingClientRect(); p.style.top = (BARH() + 8) + "px"; p.style.bottom = "auto";
    var w = Math.min(p.offsetWidth || 320, innerWidth - 16);
    var left = RTL ? r.right - w : r.left; left = Math.max(8, Math.min(innerWidth - w - 8, left));
    p.style.left = left + "px"; p.style.right = "auto";
  };
  var oldPop = function (oldId, popId, btn) {
    var p = $(popId), open = p && p.style.display === "block";
    closePops(); if (open) return;
    $(oldId).click(); p = $(popId); if (p) { p.style.display = "block"; anchor(p, btn); }
  };
  on("hbPg", function (e, b) { oldPop("bPg", "pP", b); });
  on("hbT", function (e, b) { oldPop("bT", "pT", b); });
  on("hbS", function (e, b) { oldPop("bS", "pS", b); });
  on("hbNo", function (e, b) { $("bNo").click(); b.classList.toggle("on", $("bNo").classList.contains("on")); });
  on("hbE", function (e, b) {
    $("bE").click(); var ed = $("bE").classList.contains("on"); b.classList.toggle("on", ed);
    b.querySelector(".hb-lbl").textContent = ed ? T("حفظ التعديلات", "Save edits") : T("تعديل", "Edit");
    b.querySelector("path").setAttribute("d", ed ? P.save : P.edit);
    if (ed) setTool(null); say(ed ? T("انقر أي نص في الشريحة لتعديله", "Click any text on the slide to edit it") : T("حُفظت تعديلاتك على هذا الجهاز", "Your edits are saved on this device"));
  });
  on("hbF", function () { if (fs()) D.exitFullscreen().catch(function () {}); else D.documentElement.requestFullscreen().catch(function () {}); });
  on("hbX", function () { $("bX").click(); });
  if ($("hbFx")) { $("hbFx").value = fxOld.value; $("hbFx").addEventListener("change", function () { fxOld.value = this.value; fxOld.dispatchEvent(new Event("change", { bubbles: true })); fxOld.dispatchEvent(new Event("input", { bubbles: true })); say(T("تغيّر الانتقال بين الشرائح", "Transition changed")); }); stop($("hbFx")); }
  on("hbFirst", function () { go(0); });
  on("hbLast", function () { go(N - 1, true); });
  on("hbPrev", function () { var b = $("nP"); if (b) b.click(); else go(cur - 1); });
  on("hbNext", function () { var b = $("nN"); if (b) b.click(); else go(cur + 1); });
  var num = $("hbNum"); stop(num);
  num.addEventListener("keydown", function (e) { if (e.key === "Enter") { var v = parseInt(String(num.value).replace(/[٠-٩]/g, function (d) { return "٠١٢٣٤٥٦٧٨٩".indexOf(d); }), 10); if (v >= 1 && v <= N) go(v - 1); num.blur(); } if (e.key === "Escape") num.blur(); });
  num.addEventListener("focus", function () { num.select(); });
  num.addEventListener("blur", function () { num.value = cur + 1; });
  on("hbZi", function () { setZoom(Z < 1.25 ? 1.25 : Z < 1.5 ? 1.5 : Z < 2 ? 2 : Z < 3 ? 3 : 4); });
  on("hbZo", function () { setZoom(Z > 3 ? 3 : Z > 2 ? 2 : Z > 1.5 ? 1.5 : Z > 1.25 ? 1.25 : 1); });
  $("hbZ").addEventListener("change", function () { setZoom(parseFloat(this.value)); }); stop($("hbZ"));
  W.addEventListener("wheel", function (e) {
    if (e.ctrlKey || e.metaKey) { e.preventDefault(); setZoom(Z * (e.deltaY < 0 ? 1.15 : 1 / 1.15), e.clientX, e.clientY); return; }
    if (tool === "spot") { e.preventDefault(); spotR = Math.max(70, Math.min(520, spotR - e.deltaY * 0.4)); paintSpot(); }
  }, { passive: false });

  /* ---------- لوحة الشرائح ---------- */
  var built = false;
  function buildThumbs() {
    if (built) return; built = true;
    var frag = D.createDocumentFragment();
    SL.forEach(function (s, i) {
      var b = D.createElement("button"); b.type = "button"; b.className = "hb-th";
      var h = (s.querySelector("h1,h2,h3") || {}).textContent || "";
      b.innerHTML = '<div class="hb-thb"><span class="hb-thn">' + (i + 1) + '</span><div class="hb-thi"></div></div><span class="hb-tht"></span>';
      b.querySelector(".hb-tht").textContent = h.replace(/\s+/g, " ").trim() || T("شريحة ", "Slide ") + (i + 1);
      b.setAttribute("aria-label", T("اذهب إلى الشريحة ", "Go to slide ") + (i + 1));
      b.addEventListener("click", function (e) { e.stopPropagation(); go(i); });
      frag.appendChild(b);
      (function (box) {
        var io = new IntersectionObserver(function (es) { if (!es[0].isIntersecting) return; io.disconnect();
          var c = s.cloneNode(true); c.classList.add("on");
          c.querySelectorAll("script,video,audio,iframe,aside").forEach(function (x) { x.remove(); });
          c.querySelectorAll("[contenteditable]").forEach(function (x) { x.removeAttribute("contenteditable"); });
          [c].concat([].slice.call(c.querySelectorAll("[style]"))).forEach(function (x) { if (x.style) x.style.viewTransitionName = ""; });
          c.setAttribute("inert", ""); box.appendChild(c); }, { root: drawer, rootMargin: "200px" });
        io.observe(box);
      })(b.querySelector(".hb-thi"));
    });
    drawer.appendChild(frag); onSlide();
  }
  on("hbSide", function (e, b) {
    buildThumbs(); var o = !drawer.classList.contains("open"); drawer.classList.toggle("open", o); b.classList.toggle("on", o);
    setTimeout(fit, 10); if (o) setTimeout(function () { var c = drawer.querySelector(".hb-th.cur"); if (c) c.scrollIntoView({ block: "center" }); }, 340);
  });

  /* ---------- البحث ---------- */
  /* نصّ كل شريحة دون ما يتكرّر في أغلب الشرائح (التذييل والشعار)، مع خريطة تُعيد موضع الكلمة بعد حذف التشكيل */
  var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var nch = function (c) { if (/[\u064B-\u065F\u0670\u0640]/.test(c)) return ""; if (/[إأآٱ]/.test(c)) return "ا"; if (c === "ى") return "ي"; if (c === "ة") return "ه"; return c.toLowerCase(); };
  var nmap = function (t) { var o = "", m = []; for (var i = 0; i < t.length; i++) { var c = nch(t[i]); for (var j = 0; j < c.length; j++) { o += c[j]; m.push(i); } } return { s: o, m: m }; };
  var nodesOf = function (s) { var out = [], w = D.createTreeWalker(s, NodeFilter.SHOW_TEXT, { acceptNode: function (n) { return n.parentElement && n.parentElement.closest("aside,script,style,svg") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; } }), n;
    while ((n = w.nextNode())) { var v = n.nodeValue.replace(/\s+/g, " ").trim(); if (v) out.push(v); } return out; };
  var perSlide = SL.map(nodesOf), freq = {};
  perSlide.forEach(function (L) { L.filter(function (v, i, a) { return a.indexOf(v) === i; }).forEach(function (v) { freq[v] = (freq[v] || 0) + 1; }); });
  var texts = perSlide.map(function (L) { return L.filter(function (v) { return N < 4 || freq[v] <= N / 2; }).join(" "); });
  var ntexts = texts.map(nmap);
  var findPop = mk("div", "hbFindPop"); findPop.className = "pop hb-pop"; findPop.dir = RTL ? "rtl" : "ltr";
  findPop.innerHTML = '<div class="hb-h">' + T("بحث في شرائح الدرس", "Search the slides") + '</div><input type="text" id="hbQ" placeholder="' + T("اكتب كلمة…", "Type a word…") + '" autocomplete="off"><div class="hb-res" id="hbRes"></div>';
  stop(findPop);
  var q = $("hbQ");
  q.addEventListener("input", function () {
    var v = nmap(q.value.trim()).s, out = "", n = 0;
    if (v.length >= 2) {
      texts.forEach(function (t, i) {
        var nt = ntexts[i], at = nt.s.indexOf(v); if (at < 0) return; n++;
        var o0 = nt.m[at], o1 = nt.m[at + v.length - 1] + 1, a = Math.max(0, o0 - 40), z = Math.min(t.length, o1 + 60);
        out += '<button type="button" class="hb-hit" data-i="' + i + '"><i>' + (i + 1) + "</i><span>" + (a ? "…" : "") + esc(t.slice(a, o0)) + "<mark>" + esc(t.slice(o0, o1)) + "</mark>" + esc(t.slice(o1, z)) + (z < t.length ? "…" : "") + "</span></button>";
      });
      out = out ? '<p class="hb-muted">' + T("الشرائح التي فيها الكلمة: ", "Slides with this word: ") + n + "</p>" + out : '<p class="hb-muted">' + T("لا نتائج. جرّب كلمة أخرى.", "No results. Try another word.") + "</p>";
    }
    $("hbRes").innerHTML = out;
  });
  findPop.addEventListener("click", function (e) { var h = e.target.closest(".hb-hit"); if (h) { go(+h.dataset.i); findPop.style.display = "none"; } });
  q.addEventListener("keydown", function (e) { if (e.key === "Enter") { var h = findPop.querySelector(".hb-hit"); if (h) h.click(); } if (e.key === "Escape") findPop.style.display = "none"; });
  var togglePop = function (p, btn, focusEl) { var o = p.style.display === "block"; closePops(); if (o) return; p.style.display = "block"; anchor(p, btn); if (focusEl) setTimeout(function () { focusEl.focus(); }, 30); };
  on("hbFind", function (e, b) { togglePop(findPop, b, q); });

  /* ---------- القرعة ---------- */
  var pickPop = mk("div", "hbPickPop"); pickPop.className = "pop hb-pop"; pickPop.dir = RTL ? "rtl" : "ltr";
  pickPop.innerHTML = '<div class="hb-h">🎲 ' + T("القرعة: من سيجيب؟", "Who answers?") + '</div>' +
    '<textarea id="hbNames" rows="4" placeholder="' + T("اكتب أسماء الطلاب، اسمًا في كل سطر… أو اتركها فارغة واختر رقمًا", "Type student names, one per line… or leave empty to pick a number") + '"></textarea>' +
    '<div class="hb-row"><label class="hb-muted">' + T("أو عدد الطلاب:", "Or number of students:") + ' <input type="number" id="hbCount" min="2" max="60" style="width:80px;display:inline-block"></label>' +
    '<label class="hb-muted" style="display:inline-flex;gap:6px;align-items:center"><input type="checkbox" id="hbNoRep" checked> ' + T("بلا تكرار", "No repeats") + "</label>" +
    '<label class="hb-muted" style="display:inline-flex;gap:6px;align-items:center"><input type="checkbox" id="hbWheelOn" checked> 🎡 ' + T("عجلة", "Wheel") + "</label></div>" +
    '<div class="hb-wheelbox" id="hbWheelBox"><canvas id="hbWheel" width="340" height="340" aria-hidden="true"></canvas></div>' +
    '<div class="hb-pick" id="hbPickOut">?</div><div class="hb-row"><button type="button" class="hb-btn pri" id="hbGo">🎲 ' + T("اختر الآن", "Pick now") + '</button><button type="button" class="hb-btn" id="hbReset">' + T("ابدأ من جديد", "Start over") + '</button><span class="hb-muted" id="hbLeft"></span></div>';
  stop(pickPop);
  var names = $("hbNames"), cnt = $("hbCount");
  names.value = LS.get("hb-names", ""); cnt.value = LS.get("hb-count", "25");
  names.addEventListener("input", function () { LS.set("hb-names", names.value); used = []; left(); });
  cnt.addEventListener("input", function () { LS.set("hb-count", cnt.value); used = []; left(); });
  var used = SS.get("hb-used-" + DECK) || [];
  var pool = function () { var L = names.value.split(/\n|،|,/).map(function (x) { return x.trim(); }).filter(Boolean); if (!L.length) { var n = Math.max(2, Math.min(60, parseInt(cnt.value, 10) || 25)); for (var i = 1; i <= n; i++) L.push(String(i)); } return L; };
  var left = function () { var L = pool(), r = $("hbNoRep").checked ? L.filter(function (x) { return used.indexOf(x) < 0; }) : L; $("hbLeft").textContent = $("hbNoRep").checked ? T("بقي ", "Left: ") + r.length + T(" من ", " of ") + L.length : ""; return r; };
  var spinning = false, wRot = 0, WCOL = ["#1E6BC2", "#C2410C", "#0B7A75", "#7C3AED", "#B8860B", "#BE185D", "#15803D", "#475569"];
  /* العجلة: مقاطع بعدد الأسماء، والمؤشر في الأعلى */
  function drawWheel(rot) {
    var cv = $("hbWheel"); if (!cv) return; var c = cv.getContext("2d"), L = pool(), n = L.length, a = Math.PI * 2 / n, cx = 170, cy = 178, r = 156;
    c.clearRect(0, 0, 340, 340); c.save(); c.translate(cx, cy); c.rotate(rot);
    for (var i = 0; i < n; i++) {
      c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, r, i * a, (i + 1) * a); c.closePath(); c.fillStyle = WCOL[i % WCOL.length]; c.fill(); c.strokeStyle = "#fff"; c.lineWidth = 2; c.stroke();
      var mid = i * a + a / 2, flip = Math.cos(mid + rot) < 0;
      c.save(); c.rotate(mid + (flip ? Math.PI : 0)); c.fillStyle = "#fff"; c.textAlign = flip ? "left" : "right"; c.textBaseline = "middle";
      var fs = n <= 8 ? 20 : n <= 16 ? 16 : n <= 30 ? 12 : 9; c.font = "700 " + fs + "px Tahoma,'Thmanyah Text',sans-serif";
      var tx = String(L[i]); if (tx.length > 12) tx = tx.slice(0, 11) + "…"; c.fillText(tx, flip ? -(r - 12) : r - 12, 0); c.restore();
    }
    c.beginPath(); c.arc(0, 0, 20, 0, Math.PI * 2); c.fillStyle = "#fff"; c.fill(); c.restore();
    c.beginPath(); c.moveTo(cx - 14, 4); c.lineTo(cx + 14, 4); c.lineTo(cx, 34); c.closePath(); c.fillStyle = "#D4AA55"; c.fill(); c.strokeStyle = "#102A4C"; c.lineWidth = 2; c.stroke();
  }
  function wheelShow() { var on = $("hbWheelOn").checked; $("hbWheelBox").style.display = on ? "block" : "none"; if (on) drawWheel(wRot); }
  $("hbWheelOn").addEventListener("change", wheelShow);
  names.addEventListener("input", function () { wRot = 0; if ($("hbWheelOn").checked) drawWheel(wRot); }); cnt.addEventListener("input", function () { wRot = 0; if ($("hbWheelOn").checked) drawWheel(wRot); });
  function spinWheel(L, win, done) {
    var n = L.length, a = Math.PI * 2 / n, wi = L.indexOf(win), target = -Math.PI / 2 - (wi + 0.5) * a, r0 = wRot % (Math.PI * 2), delta = ((target - r0) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) + Math.PI * 2 * (5 + Math.floor(Math.random() * 2)), t0 = performance.now(), dur = 4200, lastTick = -1;
    (function f() {
      var p = Math.min(1, (performance.now() - t0) / dur), e = 1 - Math.pow(1 - p, 3.2), rot = r0 + delta * e; drawWheel(rot);
      var seg = Math.floor((((-Math.PI / 2 - rot) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) / a); if (seg !== lastTick) { lastTick = seg; if (p < 0.92) ev("snd&&snd('chime')"); }
      if (p < 1) requestAnimationFrame(f); else { wRot = rot; done(); }
    })();
  }
  on("hbGo", function () {
    if (spinning) return; var L = pool(), R = left(); if (!R.length) { used = []; R = left(); }
    var out = $("hbPickOut"), win = R[Math.floor(Math.random() * R.length)], t0 = performance.now(), dur = 1700;
    if ($("hbWheelOn").checked) {
      spinning = true; out.classList.remove("done"); out.textContent = "…";
      spinWheel(L, win, function () { out.textContent = win; out.classList.add("done"); spinning = false; if ($("hbNoRep").checked) { used.push(win); SS.set("hb-used-" + DECK, used); } left(); ev("snd&&snd('correct')"); burst(["🎉", "⭐"]); });
      return;
    }
    spinning = true; out.classList.remove("done"); ev("snd&&snd('drum')");
    (function tick() { var p = (performance.now() - t0) / dur; if (p >= 1) { out.textContent = win; out.classList.add("done"); spinning = false; if ($("hbNoRep").checked) { used.push(win); SS.set("hb-used-" + DECK, used); } left(); ev("snd&&snd('correct')"); return; }
      out.textContent = L[Math.floor(Math.random() * L.length)]; setTimeout(tick, 40 + 260 * p * p); })();
  });
  on("hbReset", function () { used = []; SS.set("hb-used-" + DECK, used); $("hbPickOut").textContent = "?"; $("hbPickOut").classList.remove("done"); left(); });
  $("hbNoRep").addEventListener("change", left);
  on("hbPick", function (e, b) { left(); wheelShow(); togglePop(pickPop, b); });

  /* ---------- اختصارات ---------- */
  var keysPop = mk("div", "hbKeysPop"); keysPop.className = "pop hb-pop"; keysPop.dir = RTL ? "rtl" : "ltr";
  var K = [["→ ← / Space", T("الشريحة التالية والسابقة", "Next / previous")], ["Home / End", T("الأولى والأخيرة", "First / last")], ["F", T("ملء الشاشة", "Full screen")], ["N", T("ملاحظات المعلم", "Notes")], ["T", T("المؤقت", "Timer")],
    ["P / H", T("القلم وقلم التظليل", "Pen / highlighter")], ["L", T("مؤشر الليزر", "Laser")], ["S", T("الكشّاف", "Spotlight")], ["W", T("السبورة البيضاء", "Whiteboard")], ["B", T("شاشة سوداء", "Black screen")], ["Ctrl + Z", T("تراجع عن آخر كتابة", "Undo ink")], ["Ctrl + " + T("عجلة الفأرة", "wheel"), T("تكبير وتصغير", "Zoom")], ["Esc", T("إنهاء الأداة", "Exit the tool")]];
  keysPop.innerHTML = '<div class="hb-h">⌨️ ' + T("اختصارات لوحة المفاتيح", "Keyboard shortcuts") + '</div><div class="hb-keys">' + K.map(function (k) { return "<kbd>" + k[0] + "</kbd><span>" + k[1] + "</span>"; }).join("") + "</div>";
  on("hbKeys", function (e, b) { togglePop(keysPop, b); });

  /* ---------- الكتابة على الشريحة ---------- */
  var ctx = ink.getContext("2d"), lctx = laser.getContext("2d"), dpr = 1;
  var COLORS = { pen: ["#E53935", "#1E6BC2", "#0B7A75", "#102A4C", "#F0962E", "#8A3FFC", "#FFFFFF"], hl: ["#FFE14D", "#7CF29C", "#FF8AD8", "#7FD6FF", "#FFB561"] };
  var st = { pen: { c: LS.get("hb-pen-c", "#E53935"), w: +LS.get("hb-pen-w", "6") }, hl: { c: LS.get("hb-hl-c", "#FFE14D"), w: +LS.get("hb-hl-w", "34") }, text: { c: LS.get("hb-tx-c", "#102A4C"), w: 44 } };
  var KEEP = LS.get("hb-keep-" + DECK, "") === "1";
  var INK = (KEEP ? (function () { try { return JSON.parse(localStorage.getItem("hb-ink-" + DECK) || "null"); } catch (e) { return null; } })() : SS.get("hb-ink-" + DECK)) || {};
  var keyNow = function () { return board.classList.contains("on") ? "wb" : String(cur); };
  var items = function () { return INK[keyNow()] || (INK[keyNow()] = []); };
  var saveInk = function () { SS.set("hb-ink-" + DECK, INK); if (KEEP) LS.set("hb-ink-" + DECK, JSON.stringify(INK)); };
  function sizeCanvas() {
    dpr = Math.min(2, W.devicePixelRatio || 1);
    var w = innerWidth, h = innerHeight - G.top;
    [ink, laser].forEach(function (c) { if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); } });
  }
  function drawItem(it, c) {
    c = c || ctx;
    if (it.t === "x") { c.globalAlpha = 1; c.fillStyle = it.c; c.font = "700 " + it.w + "px 'Thmanyah Text',Tahoma,sans-serif"; c.direction = /[؀-ۿ]/.test(it.s) ? "rtl" : "ltr"; c.textBaseline = "middle"; c.fillText(it.s, it.x, it.y); return; }
    var p = it.p; if (!p.length) return;
    c.globalAlpha = it.t === "h" ? 0.38 : 1; c.strokeStyle = it.c; c.lineWidth = it.w; c.lineCap = it.t === "h" ? "butt" : "round"; c.lineJoin = "round";
    c.beginPath(); c.moveTo(p[0][0], p[0][1]);
    if (p.length < 3) { c.lineTo(p[p.length - 1][0] + 0.1, p[p.length - 1][1]); }
    else { for (var i = 1; i < p.length - 1; i++) { var mx = (p[i][0] + p[i + 1][0]) / 2, my = (p[i][1] + p[i + 1][1]) / 2; c.quadraticCurveTo(p[i][0], p[i][1], mx, my); } c.lineTo(p[p.length - 1][0], p[p.length - 1][1]); }
    c.stroke(); c.globalAlpha = 1;
  }
  function redraw() {
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, ink.width, ink.height);
    ctx.setTransform(dpr * G.k, 0, 0, dpr * G.k, dpr * G.x, dpr * G.y);
    (INK[keyNow()] || []).forEach(function (it) { drawItem(it); });
    if (live) drawItem(live);
    var has = (INK[keyNow()] || []).length > 0; $("hbUndo").disabled = $("hbClr").disabled = !has;
  }
  var tool = null, live = null, panning = null;
  var toolBtns = { pan: "hbTpan", laser: "hbTlaser", pen: "hbTpen", hl: "hbThl", text: "hbTtext", eraser: "hbTeraser", spot: "hbSpot" };
  function setTool(t) {
    if (t === tool) t = null;
    if (tool === "spot") spot.classList.remove("on");
    tool = t;
    Object.keys(toolBtns).forEach(function (k) { var b = $(toolBtns[k]); if (b) b.classList.toggle("on", k === t); });
    ink.className = ""; if (t && t !== "laser" && t !== "spot") ink.classList.add("live", "t-" + t);
    if (t === "spot") { spot.classList.add("on"); paintSpot(); say(T("الكشّاف: حرّك المؤشر · العجلة تغيّر حجم الدائرة", "Spotlight: move the pointer · wheel resizes")); }
    if (t === "laser") say(T("مؤشر الليزر: حرّك الفأرة على الشريحة", "Laser: move over the slide"));
    if (t === "pan" && Z === 1) say(T("كبّر الشريحة أولًا ثم اسحبها", "Zoom in first, then drag"));
    if ((t === "pen" || t === "hl" || t === "text") && $("bE") && $("bE").classList.contains("on")) $("hbE").click();
    updSw();
  }
  function updSw() { var k = tool === "hl" ? "hl" : tool === "text" ? "text" : "pen"; $("hbSw").style.background = st[k].c; }
  Object.keys(toolBtns).forEach(function (k) { on(toolBtns[k], function () { setTool(k); }); });
  var hitErase = function (s) {
    var L = items(), R = Math.max(18, Math.min(60, 26 / G.k));
    var before = L.length;
    INK[keyNow()] = L.filter(function (it) {
      if (it.t === "x") { var w = it.s.length * it.w * 0.55; return !(Math.abs(s.y - it.y) < it.w * 0.7 && s.x > it.x - w - 10 && s.x < it.x + w + 10); }
      return !it.p.some(function (q2) { return Math.hypot(q2[0] - s.x, q2[1] - s.y) < R + it.w / 2; });
    });
    if (INK[keyNow()].length !== before) { saveInk(); redraw(); }
  };
  ink.addEventListener("pointerdown", function (e) {
    if (!tool) return; e.preventDefault(); e.stopPropagation(); closePops();
    var s = toStage(e.clientX, e.clientY);
    if (tool === "pan") { if (Z > 1) { panning = { x: e.clientX, y: e.clientY, px: px, py: py }; ink.classList.add("drag"); ink.setPointerCapture(e.pointerId); } return; }
    if (tool === "eraser") { ink.setPointerCapture(e.pointerId); live = { t: "e" }; hitErase(s); return; }
    if (tool === "text") { openText(e.clientX, e.clientY, s); return; }
    ink.setPointerCapture(e.pointerId);
    live = { t: tool === "hl" ? "h" : "p", c: st[tool].c, w: st[tool].w, p: [[s.x, s.y]] };
    redraw();
  });
  ink.addEventListener("pointermove", function (e) {
    if (panning) { px = panning.px + (e.clientX - panning.x); py = panning.py + (e.clientY - panning.y); clampPan(); fit(); return; }
    if (!live) return; var s = toStage(e.clientX, e.clientY);
    if (live.t === "e") { hitErase(s); return; }
    var ev3 = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    ev3.forEach(function (ce) { var q2 = toStage(ce.clientX, ce.clientY); var l = live.p[live.p.length - 1]; if (Math.hypot(q2.x - l[0], q2.y - l[1]) > 1.5) live.p.push([Math.round(q2.x * 10) / 10, Math.round(q2.y * 10) / 10]); });
    if (live.t === "h" && live.p.length > 1 && e.shiftKey) live.p = [live.p[0], [live.p[live.p.length - 1][0], live.p[0][1]]];
    redraw();
  });
  var endStroke = function () {
    if (panning) { panning = null; ink.classList.remove("drag"); return; }
    if (!live) return; if (live.t !== "e") { items().push(live); saveInk(); } live = null; redraw();
  };
  ink.addEventListener("pointerup", endStroke); ink.addEventListener("pointercancel", endStroke);
  ink.addEventListener("click", function (e) { e.stopPropagation(); });
  function openText(cx, cy, s) {
    var old = $("hbTxt"); if (old) old.blur();
    var t = D.createElement("div"); t.id = "hbTxt"; t.contentEditable = "true"; t.dir = "auto";
    t.style.left = cx + "px"; t.style.top = (cy - 22) + "px"; t.style.color = st.text.c; t.style.fontSize = Math.max(16, st.text.w * G.k) + "px";
    if (RTL) { t.style.left = "auto"; t.style.right = (innerWidth - cx) + "px"; }
    D.body.appendChild(t); stop(t); setTimeout(function () { t.focus(); }, 0);
    var done = false;
    var commit = function () { if (done) return; done = true; var v = (t.innerText || "").trim(); t.remove();
      if (v) { items().push({ t: "x", c: st.text.c, w: st.text.w, s: v, x: s.x, y: s.y }); saveInk(); redraw(); } };
    t.addEventListener("blur", commit);
    t.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); t.blur(); } if (e.key === "Escape") { t.innerText = ""; t.blur(); } });
  }
  on("hbUndo", function () { var L = items(); if (L.length) { L.pop(); saveInk(); redraw(); } });
  on("hbClr", function () { if (!items().length) return; INK[keyNow()] = []; saveInk(); redraw(); say(T("مُسحت كتابة هذه الشريحة", "Ink cleared")); });

  /* ---------- حفظ الشرح وتصديره PDF ---------- */
  var stTitle = function (k) { var s = SL[k]; if (!s) return ""; return ((s.querySelector("h1,h2,h3") || {}).textContent || "").replace(/\s+/g, " ").trim(); };
  var notesOf = function (k) { var s = SL[k]; if (!s) return ""; return [].map.call(s.querySelectorAll("aside"), function (a) { return a.textContent.trim(); }).join("\n\n"); };
  var deckCss = function () { return [].map.call(D.querySelectorAll("style"), function (s) { return s.id === "hb-css" || s.textContent.indexOf("#hbResP") >= 0 ? "" : s.textContent; }).join("\n"); };
  var savePop = mk("div", "hbSavePop"); savePop.className = "pop hb-pop"; savePop.dir = RTL ? "rtl" : "ltr"; stop(savePop);
  var inkedKeys = function () { return Object.keys(INK).filter(function (k) { return (INK[k] || []).length; }); };
  function paintSave() {
    var ks = inkedKeys(), nS = ks.filter(function (k) { return k !== "wb"; }).length, hasWb = ks.indexOf("wb") >= 0;
    savePop.innerHTML = '<div class="hb-h">' + T("حفظ الشرح", "Save your explanation") + '</div>' +
      '<p class="hb-muted" style="margin:0 0 10px">' + (ks.length ? T("كتبت على ", "You annotated ") + nS + T(" شريحة", " slide(s)") + (hasWb ? T(" وعلى السبورة", " and the whiteboard") : "") : T("لم تكتب على أي شريحة بعد. يمكنك مع ذلك حفظ العرض كاملًا.", "No annotations yet. You can still save the whole deck.")) + "</p>" +
      '<label class="hb-ck"><input type="radio" name="hbSv" value="ink"' + (ks.length ? " checked" : " disabled") + "> " + T("الشرائح التي كتبت عليها فقط", "Only the slides I annotated") + "</label>" +
      '<label class="hb-ck"><input type="radio" name="hbSv" value="all"' + (ks.length ? "" : " checked") + "> " + T("كل الشرائح مع كتابتي", "All slides with my annotations") + "</label>" +
      '<label class="hb-ck"><input type="checkbox" id="hbSvN"> ' + T("أضف ملاحظات المعلم تحت كل شريحة", "Add teacher notes under each slide") + "</label>" +
      '<button type="button" class="hb-btn pri" id="hbSvGo" style="width:100%;margin:10px 0 12px">' + T("📄 حفظ PDF", "📄 Save PDF") + "</button>" +
      (LIVE ? '<div style="border-top:1px solid rgba(16,42,76,.12);padding:10px 0"><div style="font-weight:800;margin-bottom:4px">📤 ' + T("شارك ملخص الحصة مع طلابك", "Share the lesson summary with your students") + '</div><p class="hb-muted" style="margin:0 0 6px;font-size:12.5px">' + T("تصل الشرائح بما كتبته عليها إلى طلاب الفصل في المنصة، فيراجعونها ويطبعونها.", "Your annotated slides reach the class in the platform to review and print.") + '</p><select id="hbSumC" class="hb-sel2"><option value="">' + T("اختر الفصل…", "Choose the class…") + '</option></select><div class="hb-row" style="margin-top:6px"><button type="button" class="hb-btn" id="hbSumGo" disabled>📤 ' + T("أرسل الملخص", "Send the summary") + '</button><span class="hb-muted" id="hbSumM" style="font-size:12.5px"></span></div></div>' : "") +
      '<div style="border-top:1px solid rgba(16,42,76,.12);padding:10px 0"><div style="font-weight:800;margin-bottom:4px">📴 ' + T("العمل دون إنترنت", "Work offline") + '</div><p class="hb-muted" style="margin:0 0 8px;font-size:12.5px" id="hbOffS">' + offState() + '</p><div class="hb-row"><button type="button" class="hb-btn" id="hbOff">' + (offSaved() ? "↻ " + T("حدّث النسخة المحفوظة", "Update the saved copy") : "⬇ " + T("احفظ هذا العرض على الجهاز", "Save this deck on this device")) + '</button>' + (W.top !== W ? '<button type="button" class="hb-btn" id="hbOffL">📂 ' + T("عروضي المحفوظة", "My saved decks") + "</button>" : "") + "</div></div>" +
      '<div style="border-top:1px solid rgba(16,42,76,.12);padding-top:10px"><label class="hb-ck"><input type="checkbox" id="hbKeep"' + (KEEP ? " checked" : "") + "> " + T("احتفظ بكتابتي على هذا الجهاز للحصة القادمة", "Keep my annotations on this device for next time") + "</label>" +
      '<p class="hb-muted" style="margin:4px 0 0;font-size:12.5px">' + T("دون هذا الخيار تُمحى الكتابة حين تغلق المتصفح، فيبدأ كل صف بعرض نظيف.", "Without it, annotations clear when the browser closes, so each class starts clean.") + "</p>" +
      (ks.length ? '<button type="button" class="hb-btn" id="hbClrAll" style="margin-top:8px;color:#B42318">🗑 ' + T("امسح كتابتي من كل الشرائح", "Clear annotations on all slides") + "</button>" : "") + "</div>";
    $("hbSvGo").onclick = function () { var m = (savePop.querySelector("[name=hbSv]:checked") || {}).value || "all"; exportPdf(m, $("hbSvN").checked); closePops(); };
    $("hbOff").onclick = saveOffline;
    if (LIVE && $("hbSumC")) {
      var sc = $("hbSumC"), sg = $("hbSumGo");
      HX.sb.rpc("dl_my_classes").then(function (r) { var C = r.data || []; if (!C.length) { sc.closest("div").hidden = true; return; } var last = LS.get("hb-class-" + DECK, LS.get("hb-class-last", "")); sc.innerHTML = '<option value="">' + T("اختر الفصل…", "Choose the class…") + "</option>" + C.map(function (c) { return '<option value="' + c.id + '"' + (c.id === last ? " selected" : "") + ">" + esc(c.name) + " · " + T("الصف ", "Year ") + c.year + "</option>"; }).join(""); sg.disabled = !sc.value; });
      sc.onchange = function () { sg.disabled = !sc.value; };
      sg.onclick = function () {
        var mode = (savePop.querySelector("[name=hbSv]:checked") || {}).value || "all", ks = inkedKeys().filter(function (k) { return k !== "wb"; });
        var slides = mode === "ink" && ks.length ? ks.map(Number).sort(function (a, b) { return a - b; }) : SL.map(function (_, i) { return i; });
        var ink = {}; slides.forEach(function (k) { if ((INK[k] || []).length) ink[k] = INK[k].map(function (it) { var o = { t: it.t, c: it.c, w: it.w }; if (it.t === "x") { o.s = it.s; o.x = Math.round(it.x); o.y = Math.round(it.y); } else o.p = it.p.map(function (q) { return [Math.round(q[0]), Math.round(q[1])]; }); return o; }); });
        sg.disabled = true; $("hbSumM").textContent = "…";
        HX.sb.rpc("ds_publish", { p_class: sc.value, p_deck: HX.deck, p_lesson: HX.lesson, p_title: title, p_slides: slides, p_ink: ink, p_note: null }).then(function (r) {
          sg.disabled = false; $("hbSumM").textContent = r.error ? "⚠️ " + (/too big/.test(r.error.message) ? T("الكتابة كثيرة جدًّا؛ أرسل الشرائح التي كتبت عليها فقط", "Too much ink; send only the annotated slides") : r.error.message) : "✅ " + T("وصل الملخص إلى ", "Sent to ") + nStu(r.data.sent);
        });
      };
    }
    var ol = $("hbOffL"); if (ol) ol.onclick = function () { try { W.top.location.hash = "#/offline"; } catch (e) {} };
    $("hbKeep").onchange = function () { KEEP = this.checked; LS.set("hb-keep-" + DECK, KEEP ? "1" : ""); if (KEEP) LS.set("hb-ink-" + DECK, JSON.stringify(INK)); else try { localStorage.removeItem("hb-ink-" + DECK); } catch (e) {}
      say(KEEP ? T("ستبقى كتابتك محفوظة على هذا الجهاز", "Annotations will be kept on this device") : T("ستُمحى الكتابة عند إغلاق المتصفح", "Annotations clear when the browser closes")); };
    var ca = $("hbClrAll"); if (ca) ca.onclick = function () { if (!confirm(T("مسح كل ما كتبته على الشرائح والسبورة؟", "Clear all annotations?"))) return; INK = {}; saveInk(); redraw(); paintSave(); say(T("مُسحت الكتابة كلها", "All annotations cleared")); };
  }
  /* حفظ العرض للعمل دون إنترنت: الملف وصوره وخطوطه وأنماطه في ذاكرة المتصفح الدائمة */
  var DECK_URL = location.href.split("#")[0].split("?")[0];
  var offList = function () { try { return JSON.parse(localStorage.getItem("hira-offline-decks") || "[]") || []; } catch (e) { return []; } };
  var offSaved = function () { return offList().filter(function (d) { return d.url === DECK_URL; })[0] || null; };
  var offState = function () { var d = offSaved(); if (!W.caches) return T("المتصفح لا يدعم الحفظ دون إنترنت.", "This browser can't save for offline use."); return d ? "✅ " + T("محفوظ على هذا الجهاز", "Saved on this device") + " · " + new Date(d.at).toLocaleDateString(EN ? "en-GB" : "ar-AE") + " · " + (d.size / 1048576).toFixed(1) + " MB" : T("احفظه قبل الحصة، فيُفتح ويعمل بأدواته حتى لو انقطع الإنترنت في الصف.", "Save it before class and it opens with all its tools even if the internet drops."); };
  function offUrls() {
    var U = {}, add = function (u) { if (!u || /^(data|blob|javascript):/i.test(u)) return; try { var a = new URL(u, location.href); if (/\.(mp4|webm|mov|pdf)$/i.test(a.pathname)) return; if (a.origin !== location.origin && !/fonts\.(googleapis|gstatic)\.com$|cdnjs\.cloudflare\.com$|cdn\.jsdelivr\.net$/.test(a.hostname)) return; a.hash = ""; U[a.href] = 1; } catch (e) {} };
    add(DECK_URL); add(SELF);
    D.querySelectorAll("img[src],source[src],audio[src],script[src],link[rel~=stylesheet][href],link[rel~=icon][href],video[poster]").forEach(function (e) { add(e.getAttribute("src") || e.getAttribute("href") || e.getAttribute("poster")); });
    D.querySelectorAll("[srcset]").forEach(function (e) { e.getAttribute("srcset").split(",").forEach(function (x) { add(x.trim().split(/\s+/)[0]); }); });
    var css = [].map.call(D.querySelectorAll("style"), function (x) { return x.textContent; }).join("\n") + [].map.call(D.querySelectorAll("[style]"), function (x) { return x.getAttribute("style"); }).join("\n");
    (css.match(/url\(\s*['"]?[^'")]+/g) || []).forEach(function (m) { add(m.replace(/^url\(\s*['"]?/, "")); });
    return Object.keys(U);
  }
  function saveOffline() {
    if (!W.caches) return;
    var b = $("hbOff"), st = $("hbOffS"), L = offUrls(), done = 0, size = 0, fail = 0;
    b.disabled = true;
    caches.open("hira-decks").then(function (c) {
      var q = L.slice(), worker = function () {
        var u = q.shift(); if (!u) return Promise.resolve();
        var same = u.indexOf(location.origin) === 0;
        return fetch(u, same ? { cache: "no-cache" } : { mode: "no-cors" }).then(function (r) {
          if (!(r.ok || r.type === "opaque")) { fail++; return; }
          return r.clone().blob().then(function (bl) { size += bl.size; return c.put(same ? u.split("?")[0] : u, r); });
        }).catch(function () { fail++; }).then(function () { done++; st.textContent = "⏳ " + T("جارٍ الحفظ… ", "Saving… ") + done + " / " + L.length; return worker(); });
      };
      return Promise.all([worker(), worker(), worker(), worker()]);
    }).then(function () {
      var list = offList().filter(function (d) { return d.url !== DECK_URL; });
      var src = DECK_URL.replace(location.origin, "").replace(/^\/[^/]+\/(?=resources\/)/, "");
      list.unshift({ url: DECK_URL, src: src, title: title, at: Date.now(), size: size, n: L.length, lang: EN ? "en" : "ar" });
      try { localStorage.setItem("hira-offline-decks", JSON.stringify(list.slice(0, 60))); } catch (e) {}
      b.disabled = false; paintSave();
      say(fail ? T("حُفظ العرض، وتعذّر ", "Saved; ") + fail + T(" ملفًّا", " file(s) failed") : T("✅ حُفظ العرض على هذا الجهاز", "✅ Deck saved on this device"));
    });
  }
  function inkPng(k) {
    var L = INK[k] || []; if (!L.length) return "";
    var c = D.createElement("canvas"); c.width = 1920; c.height = 1080; var x = c.getContext("2d");
    L.forEach(function (it) { drawItem(it, x); });
    return c.toDataURL("image/png");
  }
  function exportPdf(mode, withNotes) {
    var ks = inkedKeys();
    var list = mode === "ink" && ks.length ? ks.filter(function (k) { return k !== "wb"; }).map(Number).sort(function (a, b) { return a - b; }) : SL.map(function (_, i) { return i; });
    var wb = ks.indexOf("wb") >= 0;
    var pw2 = W.open("", "_blank");
    if (!pw2) { say(T("اسمح للمتصفح بفتح نافذة جديدة لحفظ PDF", "Allow pop-ups to save the PDF")); return; }
    var pd = pw2.document, day = new Date().toLocaleDateString(EN ? "en-GB" : "ar-AE", { year: "numeric", month: "long", day: "numeric" });
    var page = function (inner, cap, note) {
      return '<section class="pg"><header><b>' + esc(title) + "</b><span>" + cap + '</span></header><div class="box">' + inner + "</div>" +
        (note ? '<div class="nt">' + esc(note) + "</div>" : "") + "<footer><span>🏮 " + T("منصة حراء", "Hiraa") + "</span><span>" + day + "</span></footer></section>";
    };
    var html = list.map(function (k) {
      var im = inkPng(String(k));
      return page('<div class="in" data-k="' + k + '"></div>' + (im ? '<img class="ink" src="' + im + '">' : ""), T("الشريحة ", "Slide ") + (k + 1) + " / " + N + (stTitle(k) && stTitle(k) !== title ? " · " + esc(stTitle(k)) : ""), withNotes ? notesOf(k) : "");
    }).join("");
    if (wb) { var pc = paperCss(paper, 1); html += page('<div class="wbg" style="background-image:' + pc.img + ';background-size:' + pc.size + '"></div><img class="ink" src="' + inkPng("wb") + '">', T("السبورة", "Whiteboard"), ""); }
    pd.open();
    pd.write('<!doctype html><html lang="' + (EN ? "en" : "ar") + '" dir="' + (RTL ? "rtl" : "ltr") + '"><head><meta charset="utf-8"><base href="' + location.href.replace(/#.*$/, "") + '"><title>' + esc(title) + " · " + T("شرح الحصة", "Lesson notes") + "</title><style>" + deckCss() + "</style><style>" +
      "@page{size:A4 landscape;margin:0}html,body{margin:0;background:#E9EDF3;font-family:'Thmanyah Text','Cairo',Tahoma,sans-serif;overflow:auto!important;height:auto!important}" +
      ".bar{position:sticky;top:0;z-index:5;display:flex;align-items:center;gap:12px;padding:12px 20px;background:#102A4C;color:#fff;font-weight:700}.bar span{flex:1}.bar button{font-weight:700;font-size:15px;font-family:inherit;border:0;border-radius:10px;padding:9px 18px;background:#D4AA55;color:#1B1405;cursor:pointer}" +
      ".pg{position:relative;width:297mm;height:210mm;margin:16px auto;background:#fff;box-shadow:0 6px 24px rgba(16,42,76,.18);display:flex;flex-direction:column;align-items:center;padding:9mm 12mm 7mm;box-sizing:border-box;page-break-after:always;break-after:page;overflow:hidden}" +
      ".pg header,.pg footer{width:100%;display:flex;justify-content:space-between;gap:16px;color:#102A4C;font-size:13px}.pg header{border-bottom:2px solid #D4AA55;padding-bottom:5px;margin-bottom:6mm}.pg header b{font-size:15px}.pg footer{margin-top:auto;color:#7A8698;font-size:11px}" +
      ".box{position:relative;width:256mm;aspect-ratio:16/9;border:1px solid #DCE3EC;border-radius:6px;overflow:hidden;flex:none}.pg:has(.nt) .box{width:214mm}" +
      ".box .in{position:absolute;left:0;top:0;width:1920px;height:1080px;transform-origin:0 0}.box .ink{position:absolute;inset:0;width:100%;height:100%}.wbg{position:absolute;inset:0;background:#fff}" +
      ".in .sl{opacity:1!important;transform:none!important;visibility:visible!important;display:block}.in *{animation:none!important;transition:none!important;view-transition-name:none!important}.in .hid{opacity:1!important;transform:none!important;visibility:visible!important}.in aside{display:none!important}" +
      ".nt{width:100%;margin-top:4mm;padding:3mm 4mm;border-inline-start:3px solid #D4AA55;background:#FBF7EE;color:#2A3548;font-size:12.5px;line-height:1.7;white-space:pre-wrap;max-height:38mm;overflow:hidden}" +
      "@media print{html,body{background:#fff}.bar{display:none}.pg{margin:0;box-shadow:none}}" +
      '</style></head><body><div class="bar"><span>📄 ' + list.length + (wb ? " + 1" : "") + T(" صفحة · اختر «حفظ بصيغة PDF» في نافذة الطباعة", " page(s) · choose “Save as PDF” in the print dialog") + '</span><button id="go">' + T("حفظ PDF / طباعة", "Save PDF / Print") + "</button></div>" + html + "</body></html>");
    pd.close();
    pd.querySelectorAll(".in").forEach(function (box) {
      var k = +box.dataset.k, c = pd.importNode(SL[k], true); c.classList.add("on");
      c.querySelectorAll("video,audio,iframe,script").forEach(function (x) { x.remove(); });
      c.querySelectorAll(".hid").forEach(function (x) { x.classList.remove("hid"); });
      box.appendChild(c);
      var w = box.parentNode.getBoundingClientRect().width || 968; box.style.transform = "scale(" + w / 1920 + ")";
    });
    var pr = function () { try { pw2.focus(); pw2.print(); } catch (e) {} };
    pd.getElementById("go").onclick = pr;
    var imgs = [].slice.call(pd.images).map(function (i) { return i.complete ? 0 : new Promise(function (r) { i.onload = i.onerror = r; }); });
    Promise.race([Promise.all(imgs.concat([pd.fonts ? pd.fonts.ready : 0])), new Promise(function (r) { setTimeout(r, 4000); })]).then(function () { setTimeout(pr, 300); });
  }
  on("hbSave", function (e, b) { paintSave(); togglePop(savePop, b); });

  /* ---------- تسجيل الشرح فيديو ---------- */
  (function () {
    var rb = $("hbRec"); if (!rb) return;
    var recPop = mk("div", "hbRecPop"); recPop.className = "pop hb-pop"; recPop.dir = RTL ? "rtl" : "ltr"; stop(recPop);
    var donePop = mk("div", "hbRecDone"); donePop.className = "pop hb-pop"; donePop.dir = RTL ? "rtl" : "ltr"; donePop.style.width = "min(560px,92vw)"; stop(donePop);
    var rec = null, streams = [], chunks = [], t0 = 0, acc = 0, tick = 0, cam = null, camS = null, url = null, mime = "";
    var useMic = LS.get("hb-rec-mic", "1") === "1", useCam = LS.get("hb-rec-cam", "") === "1";
    var mm = function (ms) { var s2 = Math.floor(ms / 1000); return String(Math.floor(s2 / 60)).padStart(2, "0") + ":" + String(s2 % 60).padStart(2, "0"); };
    var running = false, elapsed = function () { return acc + (running ? Date.now() - t0 : 0); };
    function paintPop() {
      recPop.innerHTML = '<div class="hb-h">🎬 ' + T("سجّل شرحك فيديو", "Record your explanation") + '</div><p class="hb-muted" style="margin:0 0 8px">' + T("يُسجَّل العرض بما تكتبه عليه وصوتك، لتشاركه مع طلابك الغائبين أو للمراجعة.", "Records the slides, your ink and your voice, to share with absent students or for revision.") + "</p>" +
        '<label class="hb-ck"><input type="checkbox" id="hbRecMic"' + (useMic ? " checked" : "") + "> 🎙️ " + T("صوتي من الميكروفون", "My voice (microphone)") + "</label>" +
        '<label class="hb-ck"><input type="checkbox" id="hbRecCam"' + (useCam ? " checked" : "") + "> 🙂 " + T("أظهر وجهي في دائرة صغيرة", "Show my face in a small circle") + "</label>" +
        '<p class="hb-muted" style="font-size:12.5px;margin:6px 0 10px">' + T("سيسألك المتصفح عمّا تشاركه: اختر «علامة التبويب هذه».", "Your browser will ask what to share: choose “This tab”.") + "</p>" +
        '<button type="button" class="hb-btn pri" id="hbRecGo" style="width:100%">● ' + T("ابدأ التسجيل", "Start recording") + "</button>";
      $("hbRecMic").onchange = function () { useMic = this.checked; LS.set("hb-rec-mic", useMic ? "1" : ""); };
      $("hbRecCam").onchange = function () { useCam = this.checked; LS.set("hb-rec-cam", useCam ? "1" : ""); };
      $("hbRecGo").onclick = start;
    }
    function camOn() {
      if (cam) return Promise.resolve();
      return navigator.mediaDevices.getUserMedia({ video: { width: 360, height: 360, facingMode: "user" }, audio: false }).then(function (s2) {
        camS = s2; cam = mk("div", "hbCam"); var v = D.createElement("video"); v.muted = true; v.playsInline = true; v.autoplay = true; v.srcObject = s2; cam.appendChild(v); stop(cam);
        var dr = null;
        cam.addEventListener("pointerdown", function (e) { var r = cam.getBoundingClientRect(); dr = { dx: e.clientX - r.left, dy: e.clientY - r.top }; cam.setPointerCapture(e.pointerId); cam.style.cursor = "grabbing"; });
        cam.addEventListener("pointermove", function (e) { if (!dr) return; cam.style.insetInlineStart = "auto"; cam.style.bottom = "auto"; cam.style.left = Math.max(0, Math.min(innerWidth - cam.offsetWidth, e.clientX - dr.dx)) + "px"; cam.style.top = Math.max(0, Math.min(innerHeight - cam.offsetHeight, e.clientY - dr.dy)) + "px"; });
        cam.addEventListener("pointerup", function () { dr = null; cam.style.cursor = "grab"; });
        cam.addEventListener("dblclick", function () { cam.classList.toggle("sm"); });
      }).catch(function () { say(T("تعذّر تشغيل الكاميرا · سيستمر التسجيل بدونها", "Camera unavailable · recording without it")); });
    }
    function camOff() { if (camS) camS.getTracks().forEach(function (t) { t.stop(); }); camS = null; if (cam) cam.remove(); cam = null; }
    function start() {
      closePops();
      var md = navigator.mediaDevices, disp;
      (useCam ? camOn() : Promise.resolve()).then(function () {
        return md.getDisplayMedia({ video: { frameRate: 30, displaySurface: "browser" }, audio: false, preferCurrentTab: true, selfBrowserSurface: "include", surfaceSwitching: "exclude" });
      }).then(function (d) {
        disp = d; streams.push(d);
        var vt = d.getVideoTracks()[0];
        var crop = (W.CropTarget && CropTarget.fromElement && vt.cropTo && $("wrap")) ? CropTarget.fromElement($("wrap")).then(function (ct) { return vt.cropTo(ct); }).catch(function () {}) : Promise.resolve();
        var mic = useMic ? md.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }).catch(function () { say(T("لم يُسمح بالميكروفون · سيُسجَّل بلا صوت", "No microphone · recording without sound")); return null; }) : Promise.resolve(null);
        return Promise.all([crop, mic]);
      }).then(function (r) {
        var mic = r[1]; if (mic) streams.push(mic);
        var tracks = disp.getVideoTracks().concat(mic ? mic.getAudioTracks() : []);
        var ms = new MediaStream(tracks);
        mime = ["video/mp4;codecs=avc1,mp4a.40.2", "video/mp4", "video/webm;codecs=vp9,opus", "video/webm"].filter(function (m) { return MediaRecorder.isTypeSupported(m); })[0] || "";
        rec = new MediaRecorder(ms, mime ? { mimeType: mime, videoBitsPerSecond: 2500000 } : undefined);
        chunks = []; acc = 0; t0 = Date.now();
        rec.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
        rec.onstop = finish;
        disp.getVideoTracks()[0].addEventListener("ended", function () { if (rec && rec.state !== "inactive") rec.stop(); });
        rec.start(1000); running = true;
        rb.classList.add("rec"); $("hbRecP").hidden = $("hbRecS").hidden = false;
        tick = setInterval(function () { $("hbRecL").textContent = mm(elapsed()); }, 500); $("hbRecL").textContent = "00:00";
        say(T("● بدأ التسجيل · اضغط ⏹ للإنهاء", "● Recording · press ⏹ to stop"));
      }).catch(function (e) {
        streams.forEach(function (s2) { s2.getTracks().forEach(function (t) { t.stop(); }); }); streams = []; camOff();
        if (e && e.name !== "NotAllowedError" && e.name !== "AbortError") say(T("تعذّر بدء التسجيل في هذا المتصفح", "Could not start recording in this browser"));
      });
    }
    function finish() {
      clearInterval(tick); var dur = elapsed(); running = false;
      streams.forEach(function (s2) { s2.getTracks().forEach(function (t) { t.stop(); }); }); streams = []; camOff();
      rb.classList.remove("rec", "paused"); $("hbRecP").hidden = $("hbRecS").hidden = true; $("hbRecL").textContent = T("تسجيل", "Record");
      var type = (mime || "video/webm").split(";")[0], blob = new Blob(chunks, { type: type }); rec = null;
      if (url) URL.revokeObjectURL(url); url = URL.createObjectURL(blob);
      var ext = type.indexOf("mp4") >= 0 ? "mp4" : "webm", d2 = new Date();
      var fname = (title.replace(/[\\/:*?"<>|]+/g, " ").trim() || "hiraa") + " - " + d2.getFullYear() + "-" + String(d2.getMonth() + 1).padStart(2, "0") + "-" + String(d2.getDate()).padStart(2, "0") + "." + ext;
      donePop.innerHTML = '<div class="hb-h">✅ ' + T("سُجّل شرحك", "Your explanation is recorded") + '</div><video controls playsinline src="' + url + '"></video>' +
        '<p class="hb-muted" style="margin:8px 0">' + T("المدة ", "Length ") + "<bdi>" + mm(dur) + "</bdi> · <bdi>" + (blob.size / 1048576).toFixed(1) + " MB</bdi> · <bdi>" + ext.toUpperCase() + "</bdi></p>" +
        '<div class="hb-row"><a class="hb-btn pri" id="hbRecDl" download="' + esc(fname) + '" href="' + url + '">⬇ ' + T("تنزيل الفيديو", "Download video") + '</a><button type="button" class="hb-btn" id="hbRecAgain">● ' + T("تسجيل جديد", "Record again") + '</button><button type="button" class="hb-btn" id="hbRecX">' + T("إغلاق", "Close") + "</button></div>" +
        '<p class="hb-muted" style="font-size:12.5px;margin-top:8px">' + T("💡 ارفعه إلى Teams أو Classroom لطلابك. الفيديو على جهازك فقط ولا يُرفع إلى المنصة.", "💡 Upload it to Teams or Classroom for your students. The video stays on your device only.") + "</p>";
      $("hbRecAgain").onclick = function () { closePops(); paintPop(); togglePop(recPop, rb); };
      $("hbRecX").onclick = function () { closePops(); };
      closePops(); donePop.style.display = "block"; anchor(donePop, rb);
    }
    on("hbRec", function (e, b) { if (rec) return; paintPop(); togglePop(recPop, b); });
    on("hbRecP", function () { if (!rec) return; if (rec.state === "recording") { rec.pause(); acc += Date.now() - t0; running = false; rb.classList.add("paused"); say(T("⏸ التسجيل متوقف مؤقتًا", "⏸ Paused")); } else { rec.resume(); t0 = Date.now(); running = true; rb.classList.remove("paused"); say(T("● عاد التسجيل", "● Recording")); } });
    on("hbRecS", function () { if (rec && rec.state !== "inactive") rec.stop(); });
    W.addEventListener("pagehide", function () { if (rec && rec.state !== "inactive") try { rec.stop(); } catch (e) {} });
  })();

  /* ---------- إدارة الصف: المجموعات والنقاط ومقياس الهدوء ---------- */
  (function () {
    var GC = ["#1E6BC2", "#C2410C", "#0B7A75", "#7C3AED", "#B8860B", "#BE185D", "#15803D", "#475569"];
    var GN = EN ? ["Honesty", "Trust", "Excellence", "Mercy", "Patience", "Justice", "Gratitude", "Kindness"] : ["الصدق", "الأمانة", "الإتقان", "الرحمة", "الصبر", "العدل", "الشكر", "الإحسان"];
    var ov = mk("div", "hbClassOv"); ov.dir = RTL ? "rtl" : "ltr"; stop(ov);
    var mini = mk("div", "hbScore"); mini.dir = RTL ? "rtl" : "ltr"; stop(mini);
    var nz = mk("div", "hbNoise"); nz.dir = RTL ? "rtl" : "ltr"; stop(nz);
    var tab = "groups", G2 = SS.get("hb-groups-" + DECK) || null;
    var teams = SS.get("hb-teams-" + DECK) || GN.slice(0, 4).map(function (n, i) { return { n: n, s: 0, c: GC[i] }; });
    var saveT = function () { SS.set("hb-teams-" + DECK, teams); };
    var studentList = function () { return LS.get("hb-names", "").split(/\n|،|,/).map(function (x) { return x.trim(); }).filter(Boolean); };
    function shell(body) {
      ov.innerHTML = '<div class="ct-h"><button class="ct-tab' + (tab === "groups" ? " on" : "") + '" data-t="groups">👥 ' + T("المجموعات", "Groups") + '</button><button class="ct-tab' + (tab === "points" ? " on" : "") + '" data-t="points">🏆 ' + T("نقاط المجموعات", "Team points") + '</button><button class="ct-tab' + (tab === "noise" ? " on" : "") + '" data-t="noise">🔊 ' + T("مقياس الهدوء", "Noise meter") + '</button><button class="ct-x" aria-label="' + T("إغلاق", "Close") + '">✕</button></div><div class="ct-b">' + body + "</div>";
      ov.querySelectorAll(".ct-tab").forEach(function (b) { b.onclick = function () { tab = b.dataset.t; paint(); }; });
      ov.querySelector(".ct-x").onclick = closeOv;
    }
    function closeOv() { ov.classList.remove("on"); $("hbClass").classList.remove("on"); }
    function paint() { if (tab === "groups") paintGroups(); else if (tab === "points") paintPoints(); else paintNoise(); }
    /* المجموعات */
    function paintGroups() {
      var L = studentList();
      shell('<div class="ct-row"><label>' + T("عدد المجموعات", "Number of groups") + ' <input type="number" id="ctN" min="2" max="8" value="' + (G2 ? G2.length : 4) + '"></label>' +
        '<span class="hb-muted">' + (L.length ? T("من أسماء القرعة: ", "From the pick list: ") + L.length + T(" طالبًا", " students") : T("لا أسماء في القرعة بعد، فاكتب عدد الطلاب:", "No names in the pick list yet, so enter the class size:") + ' <input type="number" id="ctC" min="4" max="60" value="' + LS.get("hb-count", "24") + '">') + "</span>" +
        '<button class="ct-btn pri" id="ctGo">🎲 ' + (G2 ? T("وزّع من جديد", "Shuffle again") : T("وزّع الطلاب", "Make groups")) + "</button>" + (G2 ? '<button class="ct-btn gold" id="ctUse">🏆 ' + T("اجعلها فرق النقاط", "Use for team points") + "</button>" : "") + "</div>" +
        '<div class="ct-groups">' + (G2 || []).map(function (g, i) { return '<div class="ct-g" style="background:' + GC[i % 8] + ";animation-delay:" + i * 0.08 + 's"><h4>' + esc(GN[i % 8]) + " <small style=\"opacity:.75;font-size:14px\">(" + g.length + ")</small></h4><ul>" + g.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>"; }).join("") + "</div>" +
        (L.length ? "" : '<p class="hb-muted" style="margin-top:12px">' + T("💡 لتوزيع الأسماء: اكتبها مرة واحدة في «القرعة» فتُحفظ على جهازك.", "💡 To use names, type them once in “Pick”; they stay on your device.") + "</p>"));
      $("ctGo").onclick = function () {
        var n = Math.max(2, Math.min(8, parseInt($("ctN").value, 10) || 4)), P = studentList();
        if (!P.length) { var c = Math.max(4, Math.min(60, parseInt(($("ctC") || {}).value, 10) || 24)); LS.set("hb-count", c); for (var i = 1; i <= c; i++) P.push(T("طالب ", "Student ") + i); }
        for (var j = P.length - 1; j > 0; j--) { var r = Math.floor(Math.random() * (j + 1)), t = P[j]; P[j] = P[r]; P[r] = t; }
        G2 = []; for (var k = 0; k < n; k++) G2.push([]); P.forEach(function (x, i2) { G2[i2 % n].push(x); });
        SS.set("hb-groups-" + DECK, G2); ev("snd&&snd('correct')"); paintGroups();
      };
      var u = $("ctUse"); if (u) u.onclick = function () { teams = G2.map(function (_, i) { return { n: GN[i % 8], s: 0, c: GC[i % 8] }; }); saveT(); paintMini(); tab = "points"; paint(); say(T("صارت المجموعات فرقًا للنقاط", "Groups are now the teams")); };
    }
    /* النقاط */
    function add(i, d) {
      teams[i].s = Math.max(0, teams[i].s + d); saveT(); paintMini();
      if (d > 0) ev("snd&&snd('correct')");
      var el = ov.querySelector('.ct-t[data-i="' + i + '"]');
      if (el && ov.classList.contains("on")) { el.querySelector(".hbc-sc").textContent = teams[i].s; el.querySelector(".hbc-sc").classList.add("hbc-bump"); setTimeout(function () { el.querySelector(".hbc-sc").classList.remove("hbc-bump"); }, 250); crowns(); }
    }
    function crowns() { var mx = Math.max.apply(null, teams.map(function (t) { return t.s; })); ov.querySelectorAll(".ct-t").forEach(function (el) { var t = teams[+el.dataset.i]; el.querySelector(".hbc-crown").hidden = !(mx > 0 && t.s === mx); }); }
    function paintPoints() {
      shell('<div class="ct-row"><button class="ct-btn" id="ctAdd">＋ ' + T("فريق", "Team") + '</button><button class="ct-btn" id="ctDel">－ ' + T("فريق", "Team") + '</button><button class="ct-btn" id="ctZero">↺ ' + T("صفّر النقاط", "Reset scores") + '</button><span style="flex:1"></span><button class="ct-btn gold" id="ctMini">' + (mini.classList.contains("on") ? T("أخفِ اللوحة الصغيرة", "Hide mini board") : "📌 " + T("اعرضها على الشريحة", "Pin on the slide")) + "</button></div>" +
        '<div class="ct-teams">' + teams.map(function (t, i) { return '<div class="ct-t" data-i="' + i + '" style="background:' + t.c + '"><span class="hbc-crown" hidden>👑</span><input class="hbc-nm" value="' + esc(t.n) + '" aria-label="' + T("اسم الفريق", "Team name") + '"><div class="hbc-sc">' + t.s + '</div><div class="hbc-pm"><button class="hbc-m" data-d="-1" aria-label="-1">−</button><button data-d="1" dir="ltr" aria-label="+1">+1</button></div></div>'; }).join("") + "</div>" +
        '<p class="hb-muted" style="margin-top:12px">' + T("💡 في اللوحة الصغيرة على الشريحة: انقر الفريق لتضيف نقطة، وانقر بالزر الأيمن لتنقص نقطة.", "💡 On the mini board: click a team to add a point, right-click to remove one.") + "</p>");
      ov.querySelectorAll(".ct-t").forEach(function (el) { var i = +el.dataset.i;
        el.querySelectorAll("[data-d]").forEach(function (b) { b.onclick = function () { add(i, +b.dataset.d); }; });
        el.querySelector(".hbc-nm").oninput = function () { teams[i].n = this.value; saveT(); paintMini(); }; });
      crowns();
      $("ctAdd").onclick = function () { if (teams.length >= 8) return; var i = teams.length; teams.push({ n: GN[i], s: 0, c: GC[i] }); saveT(); paintMini(); paintPoints(); };
      $("ctDel").onclick = function () { if (teams.length <= 2) return; teams.pop(); saveT(); paintMini(); paintPoints(); };
      $("ctZero").onclick = function () { if (!confirm(T("تصفير نقاط كل الفرق؟", "Reset all scores?"))) return; teams.forEach(function (t) { t.s = 0; }); saveT(); paintMini(); paintPoints(); };
      $("ctMini").onclick = function () { mini.classList.toggle("on"); paintMini(); paintPoints(); if (mini.classList.contains("on")) closeOv(); };
    }
    function paintMini() {
      mini.innerHTML = teams.map(function (t, i) { return '<div class="hbc-ms" data-i="' + i + '" style="background:' + t.c + '"><b>' + t.s + "</b><span>" + esc(t.n) + "</span></div>"; }).join("");
    }
    var md = null, moved = false;
    mini.addEventListener("pointerdown", function (e) { var r = mini.getBoundingClientRect(); md = { dx: e.clientX - r.left, dy: e.clientY - r.top, x: e.clientX, y: e.clientY }; moved = false; mini.setPointerCapture(e.pointerId); });
    mini.addEventListener("pointermove", function (e) { if (!md) return; if (Math.hypot(e.clientX - md.x, e.clientY - md.y) > 5) moved = true; if (!moved) return; mini.style.insetInlineEnd = "auto"; mini.style.bottom = "auto"; mini.style.left = Math.max(0, Math.min(innerWidth - mini.offsetWidth, e.clientX - md.dx)) + "px"; mini.style.top = Math.max(0, Math.min(innerHeight - mini.offsetHeight, e.clientY - md.dy)) + "px"; });
    mini.addEventListener("pointerup", function (e) { var was = md && !moved; md = null; if (!was) return; var t = D.elementFromPoint(e.clientX, e.clientY), m = t && t.closest(".hbc-ms"); if (m && e.button === 0) add(+m.dataset.i, 1); });
    mini.addEventListener("contextmenu", function (e) { e.preventDefault(); var m = e.target.closest(".hbc-ms"); if (m) add(+m.dataset.i, -1); });
    W.__hbTeams = { get: function () { return teams.map(function (t) { return { n: t.n, s: t.s, c: t.c }; }); }, add: function (i, d) { if (!teams[i]) return; paintMini(); mini.classList.add("on"); add(i, d); } };
    /* مقياس الهدوء */
    var au = null, lvl = 0, thr = +LS.get("hb-noise-thr", "60"), over = 0, hits = 0, nraf = 0;
    function micOn() {
      if (au) return Promise.resolve();
      return navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } }).then(function (s2) {
        var A = new (W.AudioContext || W.webkitAudioContext)(), src = A.createMediaStreamSource(s2), an = A.createAnalyser(); an.fftSize = 1024; src.connect(an);
        au = { A: A, s: s2, an: an, buf: new Float32Array(an.fftSize) }; loop();
      });
    }
    function micOff() { if (!au) return; cancelAnimationFrame(nraf); au.s.getTracks().forEach(function (t) { t.stop(); }); try { au.A.close(); } catch (e) {} au = null; lvl = 0; nz.classList.remove("on"); }
    var last = 0;
    function loop() {
      nraf = requestAnimationFrame(loop); if (!au) return;
      au.an.getFloatTimeDomainData(au.buf); var sum = 0; for (var i = 0; i < au.buf.length; i++) sum += au.buf[i] * au.buf[i];
      var db = 20 * Math.log10(Math.sqrt(sum / au.buf.length) + 1e-6), v = Math.max(0, Math.min(100, (db + 60) * 1.9));
      lvl = lvl * 0.85 + v * 0.15;
      var now = performance.now(); if (now - last < 100) return; last = now;
      if (lvl > thr) { over += 100; if (over >= 1500) { over = -2500; hits++; ov.classList.remove("loud"); void ov.offsetWidth; ov.classList.add("loud"); ev("snd&&snd('wrong')"); } } else if (over > 0) over = Math.max(0, over - 50); else if (over < 0) over += 100;
      var face = lvl > thr ? "😣" : lvl > thr * 0.7 ? "😐" : "😊", msg = lvl > thr ? T("صوتنا عالٍ… لنهدأ", "Too loud… let's calm down") : lvl > thr * 0.7 ? T("انتبهوا للصوت", "Watch the volume") : T("رائع! صفّ هادئ", "Great! A calm class");
      var col = lvl > thr ? "#D64545" : lvl > thr * 0.7 ? "#E6B325" : "#2E9E5B";
      var bar = ov.querySelector(".ct-meter i"); if (bar) { bar.style.width = lvl + "%"; bar.style.background = col; ov.querySelector(".ct-face").textContent = face; ov.querySelector(".ct-msg").textContent = msg; ov.querySelector("#ctHits").textContent = hits; }
      var nb = nz.querySelector(".ct-meter i"); if (nb) { nb.style.width = lvl + "%"; nb.style.background = col; nz.querySelector(".hbc-f").textContent = face; }
    }
    function paintNoise() {
      shell('<div class="ct-noise"><div><div class="ct-meter"><i></i><u style="inset-inline-start:calc(' + thr + '% - 2px)"></u></div>' +
        '<div class="ct-row" style="margin-top:16px"><label>' + T("الحدّ المسموح", "Allowed level") + ' <input type="range" id="ctThr" min="20" max="95" value="' + thr + '" style="width:220px;vertical-align:middle"></label><span class="hb-muted">' + T("تجاوز الحدّ: ", "Times too loud: ") + '<b id="ctHits">' + hits + "</b></span></div>" +
        '<div class="ct-row">' + (au ? '<button class="ct-btn" id="ctStop">⏹ ' + T("أوقف المقياس", "Stop") + '</button><button class="ct-btn gold" id="ctPin">📌 ' + T("اعرضه صغيرًا على الشريحة", "Pin small on the slide") + "</button>" : '<button class="ct-btn pri" id="ctStart">🎙️ ' + T("شغّل المقياس", "Start the meter") + "</button>") + "</div>" +
        '<p class="hb-muted">' + T("يستمع إلى صوت الصف من ميكروفون الحاسوب ولا يسجّل شيئًا. إن بقي الصوت فوق الحدّ ثانيةً ونصفًا نبّه الصف.", "Listens through the laptop microphone and records nothing. If it stays above the line for 1.5 s, it alerts the class.") + "</p></div>" +
        '<div><div class="ct-face">😊</div><div class="ct-msg">' + (au ? "" : T("اضغط «شغّل المقياس»", "Press “Start the meter”")) + "</div></div></div>");
      $("ctThr").oninput = function () { thr = +this.value; LS.set("hb-noise-thr", thr); ov.querySelector(".ct-meter u").style.insetInlineStart = "calc(" + thr + "% - 2px)"; nz.querySelector("u") && (nz.querySelector("u").style.insetInlineStart = "calc(" + thr + "% - 2px)"); };
      var b1 = $("ctStart"); if (b1) b1.onclick = function () { micOn().then(paintNoise).catch(function () { say(T("لم يُسمح بالميكروفون", "Microphone not allowed")); }); };
      var b2 = $("ctStop"); if (b2) b2.onclick = function () { micOff(); paintNoise(); };
      var b3 = $("ctPin"); if (b3) b3.onclick = function () { nz.innerHTML = '<span class="hbc-f">😊</span><div class="ct-meter"><i></i><u style="inset-inline-start:calc(' + thr + '% - 2px)"></u></div>'; nz.classList.add("on"); closeOv(); };
    }
    nz.addEventListener("click", function () { tab = "noise"; ov.classList.add("on"); $("hbClass").classList.add("on"); paint(); });
    paintMini();
    on("hbClass", function () { closePops(); if (ov.classList.contains("on")) { closeOv(); return; } ov.classList.add("on"); $("hbClass").classList.add("on"); paint(); });
    W.addEventListener("pagehide", micOff);
  })();

  /* ---------- كسر الجليد: أنشطة تنافسية في أول الحصة، مبنية على كلمات الدرس نفسه ---------- */
  (function () {
    var ov = mk("div", "hbIceOv"); ov.dir = RTL ? "rtl" : "ltr"; stop(ov);
    var KEY = "hb-ice-kw-" + DECK, mode = "menu", st = {}, tIv = 0, hub = "ice";
    var HARK = /[ً-ٰٟۖ-ۭـ]/g;
    var norm = function (w) { return w.replace(HARK, "").replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه"); };
    var STOP = {};
    ("في من على الي عن ان كان كانت كانوا هذا هذه ذلك تلك التي الذي الذين ما لا لم لن قد كل بعد قبل عند مع هل ثم او اي كيف لماذا ماذا متي حيث بين حول خلال هو هي هم نحن انت انا ايضا بعض غير فقط عليه عليها منه منها فيه فيها له لها لهم به بها كما لكن حتي اذا يكون تكون يمكن نفس هناك الدرس الشريحة اكتب اختر اجب سؤال الاسئله اسئله نشاط النشاط الهدف اهداف معيار النجاح الان اليوم نريد اكثر اقل مثل خلاله ومن وفي وعلي والي وهو وهي وما ولا ولم وقد انه انها اني فهو فهي فقد لقد مجموعه مفردات الكتاب الكريمه معني معاني شرح الطلاب الطالب المعلم ورقه تقييم تمرين تدريب انهم عليهم عنه عنها منهم فيهم بهم لنا لكم لك بك عنك منك الله").split(" ").forEach(function (w) { STOP[w] = 1; });
    function suggest() {
      var cnt = {}, shown = {}, order = [];
      var add = function (w, bonus) {
        var n = norm(w); if (n.length < 4 || n.length > 10 || STOP[n]) return; var k = n.replace(/^ال/, ""); if (k.length < 3 || STOP[k]) return;
        if (!cnt[k]) { cnt[k] = 0; shown[k] = w.replace(HARK, ""); order.push(k); } cnt[k] += bonus || 1;
      };
      (title.match(/[ء-ي]+/g) || []).forEach(function (w) { add(w, 3); });
      SL.forEach(function (s, i) {
        var c = s.cloneNode(true); [].forEach.call(c.querySelectorAll("aside,script,style,.mabox,button"), function (e) { e.remove(); });
        ((c.textContent || "").replace(HARK, "").match(/[ء-ي]+/g) || []).forEach(function (w) { add(w, 1); });
        (stTitle(i).match(/[ء-ي]+/g) || []).forEach(function (w) { add(w, 2); });
      });
      order.sort(function (a, b) { return cnt[b] - cnt[a]; });
      return order.slice(0, 12).map(function (k) { return shown[k]; });
    }
    var kws = function () { var s = LS.get(KEY, ""); var L = s.split(/\n|،|,/).map(function (x) { return x.trim(); }).filter(Boolean); if (!L.length) { L = suggest(); } return L; };
    var shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
    var letters = function (w) { return Array.from(w.replace(HARK, "").replace(/\s+/g, "")); };
    var snd = function (k) { ev("snd&&snd('" + k + "')"); };
    var tms = function () { return W.__hbTeams ? W.__hbTeams.get() : []; };
    var fmt = function (s) { s = Math.max(0, Math.ceil(s)); return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); };
    var boxes = function (arr, hid) { return '<div class="ice-boxes">' + arr.map(function (c, i) { return '<span class="ice-bx' + (hid && hid[i] ? " hid" : "") + '">' + (hid && hid[i] ? "" : esc(c)) + "</span>"; }).join("") + "</div>"; };
    var pickWord = function (key) { var L = kws(); if (!L.length) return ""; var u = st.used = st.used || []; var R = L.filter(function (x) { return u.indexOf(x) < 0; }); if (!R.length) { u.length = 0; R = L; } var w = R[Math.floor(Math.random() * R.length)]; u.push(w); return w; };
    function stopT() { clearInterval(tIv); tIv = 0; }
    function shell(ttl, inner, prize) {
      ov.innerHTML = '<div class="ice-h">' + (mode !== "menu" ? '<button class="ice-back" id="iceBk">→ ' + T("الأنشطة", "Activities") + "</button>" : "") + "<b>" + HIC[hub] + " " + ttl + '</b><button class="ice-x" id="iceX" aria-label="' + T("إغلاق", "Close") + '">✕</button></div>' + (hub !== "ice" ? '<div class="ice-goal" id="iceGl"></div>' : "") + '<div class="ice-b">' + inner + "</div>" + (prize != null ? '<div class="ice-bar" id="iceBar"></div>' : "");
      $("iceX").onclick = closeIce; var bk = $("iceBk"); if (bk) bk.onclick = function () { stopT(); mode = "menu"; st = {}; paint(); };
      if (prize != null) paintBar(prize);
      if (hub !== "ice" && W.__hbPaintGoal) W.__hbPaintGoal();
    }
    function paintBar(prize) {
      var bar = $("iceBar"); if (!bar) return; st.prize = prize;
      bar.innerHTML = '<span class="ice-bl">🏆 ' + T("امنح النقاط:", "Award points:") + "</span>" + tms().map(function (t, i) { return '<button class="ice-tm" data-i="' + i + '" style="background:' + t.c + '"' + (prize > 0 ? "" : " disabled") + "><b>" + t.s + "</b><span>" + esc(t.n) + "</span><i>+" + prize + "</i></button>"; }).join("");
      bar.querySelectorAll(".ice-tm").forEach(function (b) { b.onclick = function () { if (W.__hbTeams && st.prize > 0) { W.__hbTeams.add(+b.dataset.i, st.prize); snd("correct"); burst(["⭐", "🎉"]); paintBar(st.prize); } }; });
    }
    function closeIce() { stopT(); gedit = false; gchk = false; ov.classList.remove("on"); ["hbIce", "hbAct", "hbFb", "hbGm"].forEach(function (id) { var b = $(id); if (b) b.classList.remove("on"); }); if (W.__hbPush) W.__hbPush(); }
    W.__hbCloseIce = closeIce;
    var ACT = [
      ["scr", "🔤", T("الكلمة المبعثرة", "Scrambled word"), T("حروف كلمة من الدرس مخلوطة، وأسرع فريق يرتّبها", "Letters of a lesson word are mixed; the fastest team unscrambles it")],
      ["mys", "🕵️", T("الكلمة الغامضة", "Mystery word"), T("تُكشف الحروف تدريجيًّا، وكلما خمّنتَ مبكرًا زادت الجائزة", "Letters are revealed one by one; the earlier the guess, the bigger the prize")],
      ["twq", "❓", T("كم سؤالًا تحتاج؟", "How many questions?"), T("كلمة سرّية، والفرق تسأل أسئلة (نعم/لا). أقل أسئلة = جائزة أكبر", "A secret word; teams ask yes/no questions. Fewer questions = bigger prize")],
      ["brn", "⚡", T("سباق العصف الذهني", "Brainstorm race"), T("كل فريق يكتب أكثر ما يعرفه عن موضوع الدرس قبل انتهاء الوقت", "Each team writes as much as it knows about the topic before time runs out")],
      ["mem", "🧠", T("ذاكرة الكلمات", "Word memory"), T("تُعرض كلمات الدرس لثوانٍ ثم تختفي، والفرق تكتب ما تذكّرته", "Lesson words flash for a few seconds, then teams write what they remember")]
    ];
    var UNI = [
      ["let", "🔠", T("حرف وفئة", "Letter & category"), T("حرف وفئة عشوائيان، وكل فريق يذكر أكبر عدد من الكلمات قبل انتهاء الوقت", "A random letter and category; each team lists as many words as it can")],
      ["lin", "🧍", T("اصطفّوا بصمت", "Silent line-up"), T("الفرق تصطفّ دون كلام حسب معيار مفاجئ، والأسرع يفوز", "Teams line up without speaking by a surprise rule; the fastest wins")],
      ["num", "🔢", T("خمّن الرقم", "Guess the number"), T("تخمين رقم سرّي بتلميح أكبر/أصغر، وأقل محاولات تنال جائزة أكبر", "Guess a secret number with higher/lower hints; fewer tries, bigger prize")],
      ["tf", "✅", T("صواب أم خطأ", "True or false"), T("عبارات تكتبها من الدرس، والفرق تقف يمينًا أو يسارًا", "Statements you write from the lesson; teams stand left or right")],
      ["buz", "🔔", T("الجرس الأسرع", "Fastest buzzer"), T("أول فريق يضغط جرسه يجيب، وتسجّل الضغط من الشاشة أو من جوالك", "The first team to buzz answers; register it on screen or from your phone")],
      ["prd", "🤔", T("توقّع قبل أن نبدأ", "Predict first"), T("كل فريق يقدّر رقمًا عن الدرس، ويُكشف الجواب لاحقًا والأقرب يفوز", "Each team estimates a number; the closest wins when revealed")],
      ["hot", "🎭", T("مَن أنا؟", "Who am I?"), T("كلمة سرّية تصل جوالك فقط، والصف يسألك نعم/لا ليكتشفها", "A secret word reaches only your phone; the class asks yes/no to find it")],
      ["cor", "🧭", T("الأركان الأربعة", "Four corners"), T("سؤال بأربعة اختيارات، يتحرّك الطلاب إلى ركنهم ويحكون لماذا", "A question with four options; students move to a corner and share why")]
    ];
    function paintMenu() {
      mode = "menu"; if (hub !== "ice") return paintHub(); var L = kws();
      shell(T("كسر الجليد", "Ice-breakers"),
        '<p class="ice-lead">' + T("تنافس بين فرق الصف، وكل الكلمات من درس «", "Team competition; every word comes from the lesson «") + esc(title) + T("»", "»") + "</p>" +
        '<h4 class="ice-sec">📚 ' + T("من كلمات الدرس", "From the lesson's words") + '</h4><div class="ice-grid">' + ACT.map(function (a) { return '<button class="ice-card" data-a="' + a[0] + '"><span class="ice-ic">' + a[1] + "</span><b>" + a[2] + "</b><small>" + a[3] + "</small></button>"; }).join("") + "</div>" +
        '<h4 class="ice-sec">🌍 ' + T("أنشطة عالمية تصلح لأي درس", "Universal activities for any lesson") + '</h4><div class="ice-grid">' + UNI.map(function (a) { return '<button class="ice-card" data-a="' + a[0] + '"><span class="ice-ic">' + a[1] + "</span><b>" + a[2] + "</b><small>" + a[3] + "</small></button>"; }).join("") + "</div>" +
        '<div class="ice-kw"><b>📚 ' + T("كلمات الدرس (يمكنك تعديلها: كلمة في كل سطر)", "Lesson words (edit freely: one per line)") + '</b><textarea id="iceKw" rows="4" spellcheck="false">' + esc(L.join("\n")) + '</textarea><div class="ice-row"><button class="ice-sm" id="iceSave">💾 ' + T("احفظ", "Save") + '</button><button class="ice-sm" id="iceSug">🔄 ' + T("اقترح من الدرس", "Suggest from the lesson") + '</button></div><small>' + T("اختيرت تلقائيًّا من نص الشرائح نفسها. راجعها وأبقِ المناسب منها فقط. النقاط تُضاف إلى فرق «الصف» 🏆.", "Picked automatically from the slides' own text. Review them. Points go to the class teams 🏆.") + "</small></div>");
      ov.querySelectorAll(".ice-card").forEach(function (b) { b.onclick = function () { start(b.dataset.a); }; });
      $("iceSave").onclick = function () { LS.set(KEY, $("iceKw").value); say(T("حُفظت كلمات الدرس", "Saved")); };
      $("iceSug").onclick = function () { LS.set(KEY, ""); $("iceKw").value = suggest().join("\n"); };
    }
    function start(a) { stopT(); if (HBTN[hub] && hub !== "gm") W.__hbMark(hub); mode = a; st = { used: [] }; if (/^(scr|mys|twq|mem|hot|cmp)$/.test(a) && !kws().length) { say(T("أضف كلمة واحدة على الأقل", "Add at least one word")); mode = "menu"; return; } paint(); }
    function paintScr() {
      var w = st.w || (st.w = pickWord()), arr = letters(w), sc = st.sc;
      if (!sc) { var t = 0; do { sc = shuffle(arr); t++; } while (sc.join("") === arr.join("") && t < 12 && arr.length > 1); st.sc = sc; }
      shell(T("الكلمة المبعثرة", "Scrambled word"),
        '<p class="ice-lead">' + T("رتّبوا الحروف لتكوّنوا كلمة من درس اليوم", "Arrange the letters into a word from today's lesson") + "</p>" + boxes(st.show ? arr : sc) +
        '<div class="ice-row"><button class="ice-sm" id="iceSh">' + (st.show ? "🙈 " + T("أخفِ الإجابة", "Hide") : "👁 " + T("اكشف الإجابة", "Reveal")) + '</button><button class="ice-sm" id="iceNx">🔄 ' + T("كلمة جديدة", "New word") + '</button><button class="ice-sm" id="iceT">⏱ 30 ' + T("ث", "s") + '</button><b class="ice-cd" id="iceCd"></b></div>', 1);
      $("iceSh").onclick = function () { st.show = !st.show; paintScr(); };
      $("iceNx").onclick = function () { st.w = st.sc = null; st.show = false; stopT(); paintScr(); };
      $("iceT").onclick = function () { countdown(30, function () { snd("chime"); st.show = true; paintScr(); }); };
    }
    function countdown(sec, done, quiet) {
      stopT(); var end = Date.now() + sec * 1000, el = $("iceCd");
      var tick = function () { var l = (end - Date.now()) / 1000; el = $("iceCd"); if (!el) { stopT(); return; } if (l <= 0) { stopT(); el.textContent = "00:00"; if (done) done(); return; } el.textContent = fmt(l); el.classList.toggle("low", l <= 5 && !quiet); };
      tick(); tIv = setInterval(tick, 250);
    }
    function paintMys() {
      var w = st.w || (st.w = pickWord()), arr = letters(w), hid = st.hid || (st.hid = arr.map(function () { return true; })), left = hid.filter(Boolean).length;
      shell(T("الكلمة الغامضة", "Mystery word"),
        '<p class="ice-lead">' + T("كلمة من درس اليوم… خمّنوها بأقل عدد من الحروف المكشوفة", "A word from today's lesson… guess it with the fewest letters revealed") + "</p>" + boxes(arr, hid) +
        '<p class="ice-prize">' + T("الجائزة الآن: ", "Prize now: ") + "<b>" + left + "</b></p>" +
        '<div class="ice-row"><button class="ice-sm" id="iceRv"' + (left <= 1 ? " disabled" : "") + '>🔍 ' + T("اكشف حرفًا", "Reveal a letter") + '</button><button class="ice-sm" id="iceAll">👁 ' + T("اكشف الكلمة", "Reveal the word") + '</button><button class="ice-sm" id="iceNx">🔄 ' + T("كلمة جديدة", "New word") + "</button></div>", st.done ? 0 : left);
      $("iceRv").onclick = function () { var ix = []; hid.forEach(function (h, i) { if (h) ix.push(i); }); if (ix.length > 1) { hid[ix[Math.floor(Math.random() * ix.length)]] = false; snd("chime"); paintMys(); } };
      $("iceAll").onclick = function () { st.done = true; for (var i = 0; i < hid.length; i++) hid[i] = false; paintMys(); };
      $("iceNx").onclick = function () { st = { used: st.used }; paintMys(); };
    }
    function paintTwq() {
      var w = st.w || (st.w = pickWord()), q = st.q || 0, arr = letters(w), prize = st.show ? 0 : Math.max(1, 6 - q);
      shell(T("كم سؤالًا تحتاج؟", "How many questions?"),
        '<p class="ice-lead">' + T("فكّرتُ في كلمة من درس «", "I'm thinking of a word from the lesson «") + esc(title) + T("». اسألوا أسئلة إجابتها نعم أو لا.", "». Ask yes/no questions.") + "</p>" +
        '<div class="ice-secret">' + (st.show ? esc(arr.join("")) : "❔ ".repeat(Math.min(arr.length, 10)).trim()) + "</div>" +
        '<div class="ice-q"><button class="ice-sm" id="iceQm">−</button><span>' + T("الأسئلة المطروحة: ", "Questions asked: ") + "<b>" + q + '</b></span><button class="ice-sm" id="iceQp">＋</button></div><p class="ice-prize">' + T("الجائزة الآن: ", "Prize now: ") + "<b>" + prize + "</b></p>" +
        '<div class="ice-row"><button class="ice-sm" id="iceHn">💡 ' + T("تلميح: عدد الحروف ", "Hint: letters ") + arr.length + '</button><button class="ice-sm" id="iceSh">👁 ' + T("اكشف الكلمة", "Reveal") + '</button><button class="ice-sm" id="iceNx">🔄 ' + T("كلمة جديدة", "New word") + "</button></div>", prize);
      $("iceQp").onclick = function () { st.q = q + 1; paintTwq(); }; $("iceQm").onclick = function () { st.q = Math.max(0, q - 1); paintTwq(); };
      $("iceHn").onclick = function () { say(T("عدد حروف الكلمة: ", "Letters: ") + arr.length); };
      $("iceSh").onclick = function () { st.show = true; paintTwq(); };
      $("iceNx").onclick = function () { st = { used: st.used }; paintTwq(); };
    }
    function paintBrn() {
      var T0 = tms(), LM = mode === "let", D0 = LM ? 45 : 60; st.c = st.c || T0.map(function () { return 0; }); if (LM && !st.L) letPick();
      var run = !!st.run, over = st.over;
      shell(LM ? T("حرف وفئة", "Letter & category") : T("سباق العصف الذهني", "Brainstorm race"),
        (LM ? '<p class="ice-lead">' + T("اذكروا ", "Name ") + "<b>" + esc(st.cat) + "</b>" + T(" يبدأ بحرف", " starting with") + '</p><div class="ice-secret" style="font-size:90px;letter-spacing:0;min-height:110px">' + esc(st.L) + "</div>" : '<p class="ice-lead">' + T("اكتبوا كل ما تعرفونه عن: ", "Write everything you know about: ") + "<b>«" + esc(title) + "»</b></p>") +
        '<div class="ice-cdbig" id="iceCd">' + (run ? "" : fmt(st.dur || D0)) + "</div>" +
        '<div class="ice-row">' + (run ? "" : (LM ? [30, 45, 60] : [60, 90, 120]).map(function (s) { return '<button class="ice-sm' + ((st.dur || D0) === s ? " on" : "") + '" data-d="' + s + '">' + s + " " + T("ث", "s") + "</button>"; }).join("") + '<button class="ice-sm go" id="iceGo">▶ ' + T("ابدأ", "Start") + "</button>" + (LM ? '<button class="ice-sm" id="iceCh">🔄 ' + T("حرف آخر", "Another") + "</button>" : "")) + '</div>' +
        '<div class="ice-cnt">' + T0.map(function (t, i) { return '<div class="ice-ct" style="background:' + t.c + '"><button data-i="' + i + '" data-d="-1">−</button><span>' + esc(t.n) + "</span><b>" + st.c[i] + '</b><button data-i="' + i + '" data-d="1">＋</button></div>'; }).join("") + "</div>" +
        (over ? '<div class="ice-win" id="iceWin"></div>' : "") + '<p class="ice-note">' + T("اضغط ＋ لفريقٍ كلما ذكر فكرة أو كلمة صحيحة جديدة.", "Press ＋ for a team each time it gives a new correct idea or word.") + "</p>");
      ov.querySelectorAll(".ice-ct button").forEach(function (b) { b.onclick = function () { var i = +b.dataset.i; st.c[i] = Math.max(0, st.c[i] + +b.dataset.d); b.parentNode.querySelector("b").textContent = st.c[i]; if (+b.dataset.d > 0) snd("chime"); }; });
      ov.querySelectorAll("[data-d]").forEach(function (b) { if (b.closest(".ice-ct")) return; b.onclick = function () { st.dur = +b.dataset.d; paintBrn(); }; });
      var go = $("iceGo"); if (go) go.onclick = function () { st.run = true; st.over = false; st.c = T0.map(function () { return 0; }); paintBrn(); countdown(st.dur || D0, function () { st.run = false; st.over = true; snd("correct"); paintBrn(); }); };
      var ch = $("iceCh"); if (ch) ch.onclick = function () { letPick(); paintBrn(); };
      if (over) {
        var mx = Math.max.apply(null, st.c), wn = []; st.c.forEach(function (v, i) { if (v === mx && mx > 0) wn.push(i); });
        var w = $("iceWin"); w.innerHTML = wn.length ? "🏆 " + T("الفائز: ", "Winner: ") + wn.map(function (i) { return esc(T0[i].n) + " (" + mx + ")"; }).join(T("، ", ", ")) + '<button class="ice-sm go" id="iceAw">' + T("امنح الفائز 3 نقاط", "Give the winner 3 points") + "</button>" : T("لا أفكار مسجّلة", "No ideas recorded");
        var aw = $("iceAw"); if (aw) aw.onclick = function () { wn.forEach(function (i) { W.__hbTeams.add(i, 3); }); burst(["🏆", "🎉", "⭐"]); aw.disabled = true; aw.textContent = "✓"; };
      }
    }
    function paintMem() {
      var L = kws(); if (!st.set) st.set = shuffle(L).slice(0, 6); var ph = st.ph || "idle";
      shell(T("ذاكرة الكلمات", "Word memory"),
        '<p class="ice-lead">' + (ph === "idle" ? T("ستظهر كلمات من الدرس لثوانٍ. احفظوها، ثم اكتبوا ما تذكرتم.", "Words from the lesson will flash. Memorise, then write what you recall.") : ph === "show" ? T("احفظوا الكلمات الآن!", "Memorise the words now!") : ph === "hide" ? T("اكتبوا ما تذكرتم في فرقكم", "Write what you remember in your teams") : T("هذه هي الكلمات. امنحوا نقطة لكل كلمة صحيحة", "Here are the words. Give a point for each correct word")) + "</p>" +
        '<div class="ice-cdbig" id="iceCd">' + (ph === "show" ? "" : "") + '</div><div class="ice-words">' + st.set.map(function (w) { return '<span class="ice-wd' + (ph === "hide" || ph === "idle" ? " hid" : "") + '">' + (ph === "show" || ph === "rev" ? esc(w) : "؟") + "</span>"; }).join("") + "</div>" +
        '<div class="ice-row">' + (ph === "idle" ? [8, 12, 20].map(function (s) { return '<button class="ice-sm' + ((st.dur || 12) === s ? " on" : "") + '" data-d="' + s + '">' + s + " " + T("ث", "s") + "</button>"; }).join("") + '<button class="ice-sm go" id="iceGo">▶ ' + T("اعرض الكلمات", "Show the words") + "</button>" : "") + (ph === "hide" ? '<button class="ice-sm go" id="iceRv">👁 ' + T("اكشف الكلمات", "Reveal") + "</button>" : "") + (ph === "rev" ? '<button class="ice-sm" id="iceNx">🔄 ' + T("جولة جديدة", "New round") + "</button>" : "") + "</div>", ph === "hide" || ph === "rev" ? 1 : null);
      ov.querySelectorAll("[data-d]").forEach(function (b) { b.onclick = function () { st.dur = +b.dataset.d; paintMem(); }; });
      var go = $("iceGo"); if (go) go.onclick = function () { st.ph = "show"; paintMem(); countdown(st.dur || 12, function () { st.ph = "hide"; snd("chime"); paintMem(); }, 1); };
      var rv = $("iceRv"); if (rv) rv.onclick = function () { st.ph = "rev"; paintMem(); };
      var nx = $("iceNx"); if (nx) nx.onclick = function () { st = { used: [] }; paintMem(); };
    }
    /* ----- أنشطة عالمية: لا تعتمد على مادة بعينها، وتصلح لأي درس ----- */
    var LETS = EN ? "A B C D E F G H I K L M N O P R S T W".split(" ") : "ا ب ت ج ح د ر س ش ص ع ف ق ك ل م ن ه و ي".split(" ");
    var CATS = EN ? ["An animal", "A fruit or vegetable", "A country or city", "A job", "Something in school", "A boy's or girl's name", "Something in the kitchen", "Something that moves"] :
      ["حيوان", "فاكهة أو خضار", "دولة أو مدينة", "مهنة", "شيء في المدرسة", "اسم ولد أو بنت", "شيء في المطبخ", "شيء يتحرّك"];
    var LINES = [T("تاريخ ميلادكم (من الأصغر إلى الأكبر)", "Birthday (earliest in the year first)"), T("الطول (من الأقصر إلى الأطول)", "Height (shortest to tallest)"), T("الحرف الأول من أسمائكم (أبجديًّا)", "First letter of your names (alphabetical)"), T("عدد الإخوة والأخوات", "Number of brothers and sisters"), T("أول رقم في رقم هاتفكم", "First digit of your phone number"), T("عدد حروف أسمائكم", "Number of letters in your name")];
    var CORN = [
      [T("أيّ مكان تفضّل لرحلة؟", "Which trip would you pick?"), [["🏖", T("البحر", "Beach")], ["⛰", T("الجبل", "Mountain")], ["🏜", T("الصحراء", "Desert")], ["🌳", T("الغابة", "Forest")]]],
      [T("أيّ مهارة تتمنّى أن تتقنها؟", "Which skill would you master?"), [["🏊", T("السباحة", "Swimming")], ["🎨", T("الرسم", "Drawing")], ["💻", T("البرمجة", "Coding")], ["🍳", T("الطبخ", "Cooking")]]],
      [T("أيّ فصل من السنة تحبّ؟", "Your favourite season?"), [["🌸", T("الربيع", "Spring")], ["☀️", T("الصيف", "Summer")], ["🍂", T("الخريف", "Autumn")], ["❄️", T("الشتاء", "Winter")]]],
      [T("أيّ وسيلة تنقّل تفضّل؟", "Which ride would you pick?"), [["🚀", T("صاروخ", "Rocket")], ["🚁", T("مروحية", "Helicopter")], ["🚢", T("سفينة", "Ship")], ["🚲", T("دراجة", "Bike")]]],
      [T("أيّ رياضة تحبّ؟", "Which sport do you like?"), [["⚽", T("كرة القدم", "Football")], ["🏀", T("كرة السلة", "Basketball")], ["🏐", T("الكرة الطائرة", "Volleyball")], ["🎾", T("التنس", "Tennis")]]],
      [T("أيّ وقت من اليوم تفضّل؟", "Which time of day?"), [["🌅", T("الفجر", "Dawn")], ["☀️", T("الضحى", "Morning")], ["🌇", T("العصر", "Afternoon")], ["🌙", T("الليل", "Night")]]],
      [T("أيّ حيوان أليف تتمنّى؟", "Which pet would you want?"), [["🐱", T("قطة", "Cat")], ["🐦", T("طائر", "Bird")], ["🐢", T("سلحفاة", "Turtle")], ["🐠", T("سمكة", "Fish")]]],
      [T("أيّ قدرة خارقة تختار؟", "Which superpower?"), [["⚡", T("السرعة", "Speed")], ["🧠", T("الذكاء", "Genius")], ["🦅", T("الطيران", "Flying")], ["🔍", T("قراءة الأفكار", "Mind-reading")]]]
    ];
    var CCOL = ["#1E6BC2", "#C2410C", "#0B7A75", "#7C3AED"];
    function paintLine() {
      var i = st.i == null ? (st.i = Math.floor(Math.random() * LINES.length)) : st.i, dur = st.dur || 45;
      shell(T("اصطفّوا بصمت", "Silent line-up"),
        '<p class="ice-lead">' + T("تحدٍّ للفرق: اصطفّوا في صفٍّ واحد دون كلام، حسب:", "Team challenge: line up in silence, by:") + '</p><div class="ice-secret" style="font-size:36px;letter-spacing:0">' + esc(LINES[i]) + '</div><div class="ice-cdbig" id="iceCd">' + fmt(dur) + "</div>" +
        '<div class="ice-row">' + [30, 45, 60].map(function (s) { return '<button class="ice-sm' + (dur === s ? " on" : "") + '" data-d="' + s + '">' + s + " " + T("ث", "s") + "</button>"; }).join("") + '<button class="ice-sm go" id="iceGo">▶ ' + T("ابدأوا", "Go") + '</button><button class="ice-sm" id="iceNx">🔄 ' + T("تحدٍّ آخر", "Another") + '</button></div><p class="ice-note">' + T("الفريق الذي يكمل الصفّ أولًا وبصورة صحيحة يأخذ الجائزة.", "The first team to finish correctly wins the prize.") + "</p>", 3);
      ov.querySelectorAll("[data-d]").forEach(function (b) { b.onclick = function () { st.dur = +b.dataset.d; paintLine(); }; });
      $("iceNx").onclick = function () { st.i = (i + 1 + Math.floor(Math.random() * (LINES.length - 1))) % LINES.length; paintLine(); };
      $("iceGo").onclick = function () { snd("drum"); countdown(dur, function () { snd("chime"); }); };
    }
    function paintNum() {
      var mx = 50; if (!st.n) { st.n = 1 + Math.floor(Math.random() * mx); st.g = []; st.found = false; }
      var g = st.g, last = g.length ? g[g.length - 1] : null, prize = st.found ? Math.max(1, 7 - g.length) : 0;
      shell(T("خمّن الرقم", "Guess the number"),
        '<p class="ice-lead">' + T("فكّرتُ في رقم من 1 إلى ", "I'm thinking of a number from 1 to ") + mx + T("… تتناوب الفرق في التخمين، وأقل محاولات = جائزة أكبر", ". Teams take turns; fewer tries = bigger prize") + "</p>" +
        (st.found ? '<div class="ice-secret">🎉 ' + st.n + "</div>" : '<div class="ice-secret">' + (last == null ? "❔" : last < st.n ? "⬆️ " + T("أكبر", "Higher") : "⬇️ " + T("أصغر", "Lower")) + "</div>") +
        (st.found ? "" : '<div class="ice-row"><input id="iceN" type="number" min="1" max="' + mx + '" class="ice-in" placeholder="?"><button class="ice-sm go" id="iceG">' + T("خمّن", "Guess") + "</button></div>") +
        '<p class="ice-prize">' + T("المحاولات: ", "Tries: ") + "<b>" + g.length + "</b>" + (st.found ? " &nbsp; " + T("الجائزة: ", "Prize: ") + "<b>" + prize + "</b>" : "") + "</p>" +
        (g.length ? '<div class="ice-hist">' + g.map(function (v) { return "<span>" + v + (v < st.n ? " ⬆️" : v > st.n ? " ⬇️" : " ✓") + "</span>"; }).join("") + "</div>" : "") +
        '<div class="ice-row"><button class="ice-sm" id="iceNx">🔄 ' + T("رقم جديد", "New number") + "</button></div>", prize);
      var gb = $("iceG"); if (gb) { var go = function () { var v = parseInt($("iceN").value, 10); if (!(v >= 1 && v <= mx)) return; g.push(v); if (v === st.n) { st.found = true; snd("correct"); burst(["🎉", "⭐"]); } else snd("wrong"); paintNum(); var n2 = $("iceN"); if (n2) n2.focus(); }; gb.onclick = go; $("iceN").onkeydown = function (e) { if (e.key === "Enter") go(); }; $("iceN").focus(); }
      $("iceNx").onclick = function () { st = { used: [] }; paintNum(); };
    }
    function paintCor() {
      var i = st.i == null ? (st.i = Math.floor(Math.random() * CORN.length)) : st.i, q = CORN[i];
      shell(T("الأركان الأربعة", "Four corners"),
        '<p class="ice-lead">' + q[0] + "<br><small>" + T("اختر ركنًا وقف عنده، ثم احكِ لزميلك لماذا اخترته", "Pick a corner and stand there, then tell a classmate why") + '</small></p><div class="ice-corn">' + q[1].map(function (o, k) { return '<div class="ice-cr" style="background:' + CCOL[k] + '"><span>' + o[0] + "</span><b>" + o[1] + "</b></div>"; }).join("") + '</div><div class="ice-row"><button class="ice-sm go" id="iceNx">➡ ' + T("سؤال آخر", "Next question") + "</button></div>");
      $("iceNx").onclick = function () { st.i = (i + 1) % CORN.length; paintCor(); };
    }
    function paintTf() {
      var key = "hb-ice-tf-" + DECK, raw = LS.get(key, ""), L = raw.split(/\n/).map(function (x) { return x.trim(); }).filter(Boolean).map(function (x) { var p = x.lastIndexOf("|"); if (p < 0) return null; return { q: x.slice(0, p).trim(), a: /^\s*(ص|صح|صواب|t|true|✓)/i.test(x.slice(p + 1)) }; }).filter(Boolean);
      if (st.edit || !L.length) {
        shell(T("صواب أم خطأ", "True or false"),
          '<p class="ice-lead">' + T("اكتب عبارات من الدرس، عبارة في كل سطر، وفي آخرها | ثم ص أو خ", "Write statements from the lesson, one per line, ending with | then T or F") + '</p><textarea id="iceTf" rows="6" class="ice-ta" spellcheck="false" placeholder="' + T("مثال: الصلاة ركن من أركان الإسلام | ص", "Example: The sun is a star | T") + '">' + esc(raw) + '</textarea><div class="ice-row"><button class="ice-sm go" id="iceTs">💾 ' + T("احفظ وابدأ", "Save and start") + "</button></div>");
        $("iceTs").onclick = function () { LS.set(key, $("iceTf").value); st = { used: [] }; paintTf(); };
        return;
      }
      var i = st.i || 0; if (i >= L.length) i = st.i = 0; var it = L[i], sh = !!st.show;
      shell(T("صواب أم خطأ", "True or false"),
        '<p class="ice-lead">' + (i + 1) + " / " + L.length + '</p><div class="ice-stmt">' + esc(it.q) + '</div><p class="ice-note">' + T("تقف الفرق يمين الفصل إن رأت العبارة صحيحة، ويسارَه إن رأتها خاطئة", "Teams stand on the right if true, on the left if false") + "</p>" +
        (sh ? '<div class="ice-secret" style="color:' + (it.a ? "#15803D" : "#B3261E") + '">' + (it.a ? "✅ " + T("صواب", "True") : "❌ " + T("خطأ", "False")) + "</div>" : "") +
        '<div class="ice-row"><button class="ice-sm go" id="iceSh">' + (sh ? "🙈 " + T("أخفِ", "Hide") : "👁 " + T("اكشف الإجابة", "Reveal")) + '</button><button class="ice-sm" id="iceNx">➡ ' + T("التالية", "Next") + '</button><button class="ice-sm" id="iceEd">✏️ ' + T("عدّل العبارات", "Edit") + "</button></div>", sh ? 1 : 0);
      $("iceSh").onclick = function () { st.show = !st.show; if (st.show) snd(it.a ? "correct" : "wrong"); paintTf(); };
      $("iceNx").onclick = function () { st.i = (i + 1) % L.length; st.show = false; paintTf(); };
      $("iceEd").onclick = function () { st.edit = true; paintTf(); };
    }
    /* ----- الجرس الأسرع: يُسجَّل الفريق الذي ضغط أولًا من الشاشة أو من الجوال ----- */
    var BZ = { f: -1, lock: [] };
    var kick = function () { if (W.__hbPush) W.__hbPush(); };
    var bzDo = function (a, i) {
      var n = tms().length; i = +i;
      if (a === "buzz") { if (mode !== "buz" || BZ.f >= 0 || BZ.lock.indexOf(i) >= 0 || !(i >= 0 && i < n)) return; BZ.f = i; snd("drum"); }
      else if (a === "ok") { if (BZ.f < 0) return; if (W.__hbTeams) W.__hbTeams.add(BZ.f, 1); snd("correct"); burst(["⭐", "🎉"]); BZ.f = -1; BZ.lock = []; }
      else if (a === "no") { if (BZ.f < 0) return; BZ.lock.push(BZ.f); BZ.f = -1; snd("wrong"); if (BZ.lock.length >= n) BZ.lock = []; }
      else if (a === "reset") { BZ.f = -1; BZ.lock = []; }
      if (mode === "buz" && ov.classList.contains("on")) paintBuz(); kick();
    };
    W.__hbBuzz = { on: function () { return mode === "buz" && ov.classList.contains("on"); }, get: function () { return { f: BZ.f, l: BZ.lock.slice() }; }, do: bzDo };
    function paintBuz() {
      var Tm = tms(), f = BZ.f;
      shell(T("الجرس الأسرع", "Fastest buzzer"),
        '<p class="ice-lead">' + T("اطرح سؤالك، وأول فريق يضغط جرسه يجيب. يمكنك تسجيل الضغط من هنا أو من جوالك.", "Ask your question; the first team to buzz answers. Register the buzz here or from your phone.") + "</p>" +
        (f >= 0 ? '<div class="ice-first" style="background:' + Tm[f].c + '">🔔 ' + esc(Tm[f].n) + " " + T("أولًا!", "first!") + '</div><div class="ice-row"><button class="ice-sm go" id="iceOk">✓ ' + T("إجابة صحيحة (+1)", "Correct (+1)") + '</button><button class="ice-sm" id="iceNo">✗ ' + T("خاطئة، افتح للآخرين", "Wrong, open to others") + "</button></div>" :
          '<div class="ice-bzs">' + Tm.map(function (t, i) { var lk = BZ.lock.indexOf(i) >= 0; return '<button class="ice-bz" data-i="' + i + '" style="background:' + t.c + '"' + (lk ? " disabled" : "") + "><span>🔔</span><b>" + esc(t.n) + "</b>" + (lk ? "<small>" + T("أخطأ", "out") + "</small>" : "<small>" + t.s + "</small>") + "</button>"; }).join("") + "</div>") +
        '<div class="ice-row"><button class="ice-sm" id="iceRs">↺ ' + T("سؤال جديد", "New question") + "</button></div>");
      ov.querySelectorAll(".ice-bz").forEach(function (b) { b.onclick = function () { bzDo("buzz", +b.dataset.i); }; });
      var ok = $("iceOk"); if (ok) ok.onclick = function () { bzDo("ok"); }; var no = $("iceNo"); if (no) no.onclick = function () { bzDo("no"); };
      $("iceRs").onclick = function () { bzDo("reset"); };
    }
    /* ----- توقّع قبل أن نبدأ: كل فريق يقدّر رقمًا، ويُكشف الجواب لاحقًا والأقرب يفوز ----- */
    function paintPrd() {
      var key = "hb-ice-pr-" + DECK, gkey = "hb-ice-pg-" + DECK, raw = LS.get(key, ""), G = {}; try { G = JSON.parse(LS.get(gkey, "{}")) || {}; } catch (e) {}
      var L = raw.split(/\n/).map(function (x) { return x.trim(); }).filter(Boolean).map(function (x) { var p = x.lastIndexOf("|"); if (p < 0) return null; var v = parseFloat(x.slice(p + 1).replace(/[٠-٩]/g, function (d) { return "٠١٢٣٤٥٦٧٨٩".indexOf(d); })); return isNaN(v) ? null : { q: x.slice(0, p).trim(), a: v }; }).filter(Boolean);
      if (st.edit || !L.length) {
        shell(T("توقّع قبل أن نبدأ", "Predict before we start"),
          '<p class="ice-lead">' + T("اكتب أسئلة جوابها رقم من الدرس، سؤال في كل سطر وفي آخره | ثم الرقم", "Write questions whose answer is a number, one per line, ending with | then the number") + '</p><textarea id="icePt" rows="5" class="ice-ta" spellcheck="false" placeholder="' + T("مثال: كم عدد آيات السورة؟ | 29", "Example: How many planets are there? | 8") + '">' + esc(raw) + '</textarea><div class="ice-row"><button class="ice-sm go" id="icePs">💾 ' + T("احفظ وابدأ", "Save and start") + "</button></div>" +
          '<p class="ice-note">' + T("تأكّد من صحة الرقم من مصدرك قبل الحفظ.", "Check the number against your source before saving.") + "</p>");
        $("icePs").onclick = function () { LS.set(key, $("icePt").value); st = { used: [] }; paintPrd(); }; return;
      }
      var i = st.i || 0; if (i >= L.length) i = st.i = 0; var it = L[i], Tm = tms(), g = G[i] || [], rv = !!st.rv, best = null;
      if (rv) { Tm.forEach(function (t, k) { var v = parseFloat(g[k]); if (!isNaN(v)) { var d = Math.abs(v - it.a); if (best == null || d < best) best = d; } }); }
      shell(T("توقّع قبل أن نبدأ", "Predict before we start"),
        '<p class="ice-lead">' + (i + 1) + " / " + L.length + '</p><div class="ice-stmt">' + esc(it.q) + "</div>" +
        '<div class="ice-cnt">' + Tm.map(function (t, k) { var v = parseFloat(g[k]), win = rv && !isNaN(v) && Math.abs(v - it.a) === best; return '<div class="ice-ct" style="background:' + t.c + (win ? ";outline:5px solid #FFD25C" : "") + '"><span>' + esc(t.n) + (win ? " 🏆" : "") + '</span><input class="ice-in" data-k="' + k + '" type="number" value="' + (g[k] == null ? "" : esc(String(g[k]))) + '"' + (rv ? " disabled" : "") + ">" + (rv && !isNaN(v) ? "<small>±" + Math.abs(v - it.a) + "</small>" : "") + "</div>"; }).join("") + "</div>" +
        (rv ? '<div class="ice-secret">✅ ' + it.a + "</div>" : "") +
        '<div class="ice-row"><button class="ice-sm go" id="iceRv">' + (rv ? "🙈 " + T("أخفِ", "Hide") : "👁 " + T("اكشف الجواب", "Reveal")) + '</button><button class="ice-sm" id="iceNx">➡ ' + T("سؤال آخر", "Next") + '</button><button class="ice-sm" id="iceEd">✏️ ' + T("عدّل", "Edit") + "</button></div>" +
        '<p class="ice-note">' + T("سجّل تقدير كل فريق، ويمكنك إغلاق اللوحة والعودة لكشف الجواب في آخر الحصة (التقديرات محفوظة).", "Enter each team's estimate. You can close this and come back at the end to reveal (estimates are saved).") + "</p>", rv ? 2 : null);
      ov.querySelectorAll(".ice-in").forEach(function (inp) { inp.oninput = function () { var a = G[i] || []; a[+inp.dataset.k] = inp.value; G[i] = a; LS.set(gkey, JSON.stringify(G)); }; });
      $("iceRv").onclick = function () { st.rv = !st.rv; if (st.rv) snd("chime"); paintPrd(); };
      $("iceNx").onclick = function () { st.i = (i + 1) % L.length; st.rv = false; paintPrd(); };
      $("iceEd").onclick = function () { st.edit = true; paintPrd(); };
    }
    /* ----- مَن أنا؟ الكرسي الساخن: الكلمة تصل جوال المعلم فقط، والصف يسأل نعم/لا ----- */
    function paintHot() {
      var q = st.q || 0, prize = st.show ? 0 : Math.max(1, 6 - q), sent = !!st.sent;
      shell(T("مَن أنا؟", "Who am I?"),
        '<p class="ice-lead">' + T("كلمة سرّية من درس اليوم، وأنا أعرفها وحدي. اسألوني أسئلة إجابتها نعم أو لا.", "A secret word from today's lesson that only I know. Ask yes/no questions.") + '</p><div class="ice-secret">' + (st.show ? esc(st.w || "") : "❔ ❔ ❔") + "</div>" +
        (sent ? "" : '<div class="ice-row"><button class="ice-sm go" id="iceSend">📲 ' + T("أرسل الكلمة إلى جوالي", "Send the word to my phone") + "</button></div>") +
        (sent ? '<p class="ice-note">✓ ' + T("أُرسلت الكلمة إلى جوالك، ولا تظهر هنا.", "The word was sent to your phone; it is not shown here.") + "</p>" : "") +
        '<div class="ice-q"><button class="ice-sm" id="iceQm">−</button><span>' + T("الأسئلة المطروحة: ", "Questions asked: ") + "<b>" + q + '</b></span><button class="ice-sm" id="iceQp">＋</button></div><p class="ice-prize">' + T("الجائزة الآن: ", "Prize now: ") + "<b>" + prize + "</b></p>" +
        '<div class="ice-row"><button class="ice-sm" id="iceSh">👁 ' + T("اكشف الكلمة", "Reveal") + '</button><button class="ice-sm" id="iceNx">🔄 ' + T("كلمة جديدة", "New word") + "</button></div>", prize);
      $("iceQp").onclick = function () { st.q = q + 1; paintHot(); }; $("iceQm").onclick = function () { st.q = Math.max(0, q - 1); paintHot(); };
      $("iceSh").onclick = function () { if (!st.w) st.w = pickWord(); st.show = true; paintHot(); };
      $("iceNx").onclick = function () { st = { used: st.used }; paintHot(); };
      var sd = $("iceSend"); if (sd) sd.onclick = function () {
        var w = st.w || (st.w = pickWord()); if (!w) { say(T("أضف كلمات الدرس أولًا", "Add lesson words first")); return; }
        if (W.__hbSend && W.__hbSend("hot", { w: w })) { st.sent = true; paintHot(); } else { st.w = null; say(T("اربط جوالك أولًا من زر «تحكّم بالعرض من جوالك»", "Connect your phone first from the phone-control button")); }
      };
    }
    /* ================= التعلّم النشط والفيدباك (يشاركان لوحة الجليد ونقاط الفرق) ================= */
    var HIC = { ice: "🧊", act: "🙌", fb: "💬", gm: "🎮" };
    var STU = function () { return LS.get("hb-names", "").split(/\n|،|,/).map(function (x) { return x.trim(); }).filter(Boolean); };
    var saveNote = function (g, x) {
      var k = "hb-notes-" + DECK, a = []; try { a = JSON.parse(LS.get(k, "[]")) || []; } catch (e) {}
      a.push({ t: Date.now(), s: cur + 1, g: String(g).slice(0, 60), x: String(x).slice(0, 300), l: (W.__hbLiveId && W.__hbLiveId()) || 0 }); LS.set(k, JSON.stringify(a.slice(-300)));
      say(T("حُفظت في ملاحظاتك (وتدخل تقرير الحصة المباشرة)", "Saved to your notes (included in the live lesson report)"));
    };
    var lines = function (k, def) { var L = LS.get(k, "").split(/\n/).map(function (x) { return x.trim(); }).filter(Boolean); return L.length ? L : def; };
    var jget = function (k) { try { return JSON.parse(LS.get(k, "{}")) || {}; } catch (e) { return {}; } };
    var curTitle = function () { return stTitle(cur) || title; };
    /* هدف الدرس وسجلّ النمو */
    var PILK = "hb-pil-" + DECK;
    var pilGet = function () { try { return JSON.parse(sessionStorage.getItem(PILK) || "{}") || {}; } catch (e) { return {}; } };
    W.__hbMark = function (k) { try { var o = pilGet(); if (!o[k]) { o[k] = 1; sessionStorage.setItem(PILK, JSON.stringify(o)); } } catch (e) {} };
    var PILS = [["ice", "🧊", T("كسر الجليد", "Ice-breaker")], ["act", "🙌", T("تعلّم نشط", "Active learning")], ["fb", "💬", T("فيدباك", "Feedback")], ["ws", "📄", T("أوراق عمل", "Worksheets")], ["qz", "🏆", T("مسابقة الصف", "Class quiz")], ["ex", "🎟", T("بطاقة الخروج", "Exit ticket")], ["gc", "🎯", T("تحقّق الهدف", "Goal check")]];
    var pilHtml = function () { var o = pilGet(), n = PILS.filter(function (x) { return o[x[0]]; }).length; return '<p class="ice-pilh">' + T("أركان هذه الحصة: ", "This lesson's pillars: ") + "<b>" + n + "/" + PILS.length + '</b></p><div class="ice-pil">' + PILS.map(function (x) { return '<span class="' + (o[x[0]] ? "dn" : "") + '">' + (o[x[0]] ? "✅" : x[1]) + " " + x[2] + "</span>"; }).join("") + "</div>"; };
    W.__hbFindSlide = function (re) { for (var k = 0; k < SL.length; k++) if (re.test(norm(stTitle(k)))) return k; return -1; };
    var GK = "hb-goal-" + DECK, GRK = "hb-growth", gedit = false, gchk = false;
    var gget = function () { try { return JSON.parse(LS.get(GRK, "[]")) || []; } catch (e) { return []; } };
    var gpush = function (o) { var a = gget(); a.push(Object.assign({ t: Date.now(), d: DECK, n: title, l: (W.__hbLiveId && W.__hbLiveId()) || 0 }, o)); LS.set(GRK, JSON.stringify(a.slice(-400))); };
    var goalAuto = function () {
      var r = "";
      for (var k = 0; k < SL.length && !r; k++) {
        if (!/هدف الدرس|اهداف الدرس|نواتج/.test(norm(stTitle(k)))) continue;
        var els = SL[k].querySelectorAll("p");
        for (var i = 0; i < els.length; i++) {
          var t = (els[i].textContent || "").replace(/\s+/g, " ").trim();
          if (/^[^\u0621-\u064A]*(ال)?هدف( الدرس)?\s*[:：]/.test(norm(t))) { var c = t.search(/[:：]/); r = t.slice(c + 1).trim(); break; }
        }
      }
      return r;
    };
    var goalTxt = function () { return LS.get(GK, "") || goalAuto(); };
    var GLV = [["🌱", T("لم نحقّقه بعد", "Not yet"), "#B3261E"], ["🌿", T("حقّقناه جزئيًّا", "Partly"), "#B7791F"], ["🌳", T("حقّقناه", "Achieved"), "#15803D"]];
    W.__hbPaintGoal = function () {
      var g = $("iceGl"); if (!g) return; var txt = goalTxt();
      if (gedit) {
        g.innerHTML = "<span>🎯</span>" + '<input id="iceGi" class="ice-txt" style="flex:1 1 260px;width:auto" value="' + esc(txt) + '" placeholder="' + T("اكتب هدف الدرس (من شريحة الأهداف)", "Write the lesson goal (from the objectives slide)") + '"><button class="ice-gb go" id="iceGs">💾 ' + T("احفظ", "Save") + '</button><button class="ice-gb" id="iceGa">↺ ' + T("من العرض", "From the deck") + "</button>";
        $("iceGs").onclick = function () { LS.set(GK, $("iceGi").value.trim()); gedit = false; W.__hbPaintGoal(); };
        $("iceGa").onclick = function () { LS.set(GK, ""); gedit = false; W.__hbPaintGoal(); }; return;
      }
      g.innerHTML = '<span class="ice-gt">🎯 ' + T("هدف الدرس: ", "Lesson goal: ") + "<b>" + (txt ? esc(txt) : T("لم يُحدَّد بعد — اضغط ✏️", "not set yet — tap ✏️")) + '</b></span><button class="ice-gb" id="iceGe" aria-label="' + T("عدّل الهدف", "Edit goal") + '">✏️</button>' +
        (gchk ? '<span class="ice-gc">' + GLV.map(function (l, i) { return '<button data-v="' + i + '" style="background:' + l[2] + '">' + l[0] + " " + l[1] + "</button>"; }).join("") + '<button style="background:#6b7280" id="iceGx">✕</button></span>' : '<button class="ice-gb go" id="iceGc">✅ ' + T("هل حقّقنا الهدف؟", "Did we meet the goal?") + "</button>");
      $("iceGe").onclick = function () { gedit = true; W.__hbPaintGoal(); };
      var c = $("iceGc"); if (c) c.onclick = function () { gchk = true; W.__hbPaintGoal(); };
      var x = $("iceGx"); if (x) x.onclick = function () { gchk = false; W.__hbPaintGoal(); };
      g.querySelectorAll(".ice-gc button[data-v]").forEach(function (b) { b.onclick = function () { gpush({ k: "goal", g: +b.dataset.v, m: mode, o: txt.slice(0, 120) }); W.__hbMark("gc"); gchk = false; snd("chime"); say(T("سُجّلت في سجلّ النمو", "Logged in the growth record")); W.__hbPaintGoal(); }; });
    };
    var growHtml = function () {
      var a = gget().slice(-6).reverse(); if (!a.length) return "";
      return '<div class="ice-hist"><h4>📈 ' + T("سجلّ النمو (آخر السجلات)", "Growth record (latest)") + "</h4>" + a.map(function (e) {
        var dt = new Date(e.t).toLocaleDateString(EN ? "en-GB" : "ar-AE-u-nu-latn", { day: "numeric", month: "numeric" });
        return '<div class="ice-hr"><span>' + dt + " · " + esc((e.n || "").slice(0, 40)) + "</span><b>" + (e.k === "goal" ? "🎯 " + GLV[e.g][0] + " " + GLV[e.g][1] : "🪞 " + e.b + "% → " + e.a + "% (" + (e.a - e.b >= 0 ? "+" : "") + (e.a - e.b) + ")" + (e.lv ? " " + Object.keys(e.lv).map(function (k) { return LV[k][0] + e.lv[k][0] + "→" + e.lv[k][1]; }).join(" ") : "")) + "</b></div>";
      }).join("") + "</div>";
    };
    var STRUCT = /قبل ان نبدا|قياس التقدم|خريطه العمل|نماذج الاجابه|اهداف|معايير النجاح|الخروج|الختام|الواجب|التقويم|شكرا|المراجعه|قبل الدرس|بعد الدرس|مفردات|الاستراتيجي|ملخص|عنوان|^المجموعه \d|نجمتان|تحدي حراء|الدرس والهويه/;
    var slideTitles = function () { var o = []; SL.forEach(function (s, i) { var t = stTitle(i); if (t && o.indexOf(t) < 0 && i > 0 && i < SL.length - 1 && t.length >= 6 && t.length < 70 && !STRUCT.test(norm(t))) o.push(t); }); return o; };
    var spread = function (arr, n) { if (arr.length <= n) return arr.slice(); var o = []; for (var k = 0; k < n; k++) o.push(arr[Math.floor(k * arr.length / n)]); return o; };
    var LVK = "hb-lvl-" + DECK;
    var LV = [["🥉", T("برونزي", "Bronze"), "#B8733B", T("أذكر وأسمّي…", "I recall and name…")], ["🥈", T("فضي", "Silver"), "#6B7785", T("أشرح بكلماتي وأعطي مثالًا من الدرس…", "I explain in my own words with an example from the lesson…")], ["🥇", T("ذهبي", "Gold"), "#B7791F", T("أحلّل وأستنتج السبب…", "I analyse and infer the reason…")], ["💎", T("تحدٍّ", "Challenge"), "#5B3FA8", T("أقيّم وأقترح تطبيقًا في حياتي…", "I evaluate and propose an application in my life…")]];
    var lvOf = function (tn) { var v = jget(LVK)[tn]; return v >= 0 && v <= 3 ? v : null; };
    var lvLine = function (tn) { var v = lvOf(tn); return v == null ? "" : '<small style="font-size:14px;line-height:1.5">' + LV[v][0] + " " + esc(LV[v][3]) + "</small>"; };
    var lvList = function () { var h = tms().map(function (t) { var v = lvOf(t.n); return v == null ? "" : '<span style="background:' + t.c + '">' + esc(t.n) + " · " + LV[v][0] + " " + esc(LV[v][3]) + "</span>"; }).join(""); return h ? '<div class="ice-lvl">' + h + "</div>" : ""; };
    var ROLES = [["🧭", T("ميسّر", "Facilitator"), T("يدير الحوار ويوزّع الفرص", "Leads the talk and shares turns")], ["✍️", T("مسجّل", "Recorder"), T("يكتب إجابة الفريق", "Writes the team's answer")], ["📣", T("متحدّث", "Speaker"), T("يعرض أمام الصف", "Presents to the class")], ["⏱", T("ضابط الوقت", "Timekeeper"), T("يراقب الوقت والهدوء", "Watches time and noise")]];
    var ACTV = [
      ["tps", "🤔", T("فكّر – زاوج – شارك", "Think – Pair – Share"), T("سؤال من الدرس: دقيقة تفكير هادئ، ثم نقاش مع زميل، ثم مشاركة مع الصف", "A lesson question: quiet thinking, then a partner talk, then sharing")],
      ["jig", "🧩", T("المحاور المتقاطعة (جيغسو)", "Jigsaw"), T("كل فريق يتخصّص في جزء من الدرس ثم يعلّمه لزملائه", "Each team masters one part of the lesson then teaches it")],
      ["sqs", "❓", T("اصنعوا الأسئلة", "Student-made questions"), T("الفرق تكتب أسئلة عن الدرس وتتبادلها للإجابة", "Teams write questions about the lesson and swap them")],
      ["cmp", "🕸", T("خريطة المفاهيم", "Concept map"), T("تربط الفرق كلمات الدرس بأسهم وعلاقات في وقت محدّد", "Teams link lesson words with arrows and relations against the clock")],
      ["deb", "⚖️", T("أوافق أم لا أوافق", "Agree or disagree"), T("عبارة من الدرس والطلاب يتحرّكون لموقفهم ويدافعون عنه", "A statement; students move to their stance and defend it")],
      ["omp", "📝", T("ورقة الدقيقة", "One-minute paper"), T("أهم فكرة تعلّمتها وأصعب نقطة بقيت، في دقيقة", "The key idea learned and the muddiest point, in one minute")],
      ["lvl", "🎚", T("مستويات الفرق وأدوارها", "Team levels & roles"), T("لكل فريق مستوى (برونزي إلى تحدٍّ) ومهمة تناسبه، وأدوار تتبدّل كل جولة", "A level per team (Bronze to Challenge) with a matching task, and roles that rotate each round")]
    ];
    var FBK = [
      ["tfb", "🌟", T("فيدباك المعلم للطالب", "Teacher → student feedback"), T("نجمة وأمنية وخطوة تالية بعبارات مساعدة، تُعرض على الشاشة أو تُحفظ", "A star, a wish and a next step with sentence stems; show or save it")],
      ["pfb", "🤝", T("فيدباك الأقران في مجموعات", "Peer feedback in groups"), T("دوران منظّم داخل المجموعة: كل عضو يعطي زميله فيدباك بوقت محدّد", "A timed rotation: each member gives the next one feedback")],
      ["pas", "📋", T("تقييم الأقران", "Peer assessment"), T("فريق يقيّم عمل فريق آخر على معايير، ويخرج بخطوة تطوير", "A team rates another team's work on criteria, ending with a next step")],
      ["sas", "🪞", T("التقييم الذاتي", "Self-assessment"), T("إشارة المرور قبل الدرس وبعده لقياس نموّ الصف", "Traffic lights before and after the lesson to see the class's growth")]
    ];
    var lessonUrl = function () { var dir = location.pathname.split("/").slice(-2)[0] || "", code = dir.replace(/^IE-/, ""), pre = location.pathname.split("/resources/")[0]; return location.origin + pre + "/#/lesson/" + code; };
    var GMK = [
      ["qz", "🏆", T("مسابقة الصف كله", "Whole-class quiz"), T("أسئلة العرض نفسها بمؤقت ونقاط وترتيب، والطلاب يجيبون من أجهزتهم (تحتاج حصة مباشرة)", "The deck's own questions with a timer, points and a leaderboard; students answer on their devices (needs a live lesson)")],
      ["ex", "🎟", T("بطاقة الخروج", "Exit ticket"), T("تُرسل لأجهزة الطلاب، أو تنتقل إلى شريحتها إن لم تكن الحصة مباشرة", "Sent to student devices, or jumps to its slide when not live")],
      ["qk", "🔔", T("تحدّي حراء السريع", "Quick Hiraa challenge"), T("ينقلك إلى شريحة الأسئلة السريعة في العرض", "Jumps to the quick-questions slide")],
      ["lg", "🎮", T("ألعاب الدرس على المنصة", "Lesson games on the platform"), T("تفتح صفحة الدرس في تبويب جديد (اختر «ألعاب الدرس»)، ويبقى العرض مفتوحًا", "Opens the lesson page in a new tab (pick “Lesson games”); the deck stays open")],
      ["ic", "🧊", T("ألعاب كسر الجليد", "Ice-breaker games"), T("ألعاب سريعة تصلح للبداية أو لإعادة النشاط", "Quick games for starting or re-energising")]
    ];
    var GMF = {
      qz: function () { if (W.__hbQuiz) W.__hbQuiz(); },
      ex: function () { if (W.__hbExit) W.__hbExit(); },
      qk: function () { var k = W.__hbFindSlide(/تحدي حراء/); if (k < 0) { say(T("لا توجد شريحة تحدّي في هذا العرض", "No challenge slide in this deck")); return; } closeIce(); go(k); },
      lg: function () { window.open(lessonUrl(), "_blank", "noopener"); },
      ic: function () { openHub("ice"); }
    };
    function paintHub() {
      var L = hub === "act" ? ACTV : hub === "fb" ? FBK : GMK;
      shell(hub === "act" ? T("التعلّم النشط", "Active learning") : hub === "fb" ? T("الفيدباك", "Feedback") : T("ألعاب وتقويم", "Games & assessment"),
        (hub === "gm" ? pilHtml() : "") + '<p class="ice-lead">' + (hub === "act" ? T("أنشطة يتحرّك فيها الطلاب ويفكّرون ويتعاونون، مرتبطة بدرس «", "Activities where students think, move and collaborate, linked to the lesson «") + esc(title) + "»" : hub === "fb" ? T("فيدباك من المعلم، ومن الطلاب لبعضهم، ومن الطالب لنفسه", "Feedback from teacher, from peers, and from the learner himself") : T("اختم الحصة بتقويم يُظهر ما تعلّمه الصف فعلًا", "Close the lesson with an assessment that shows what the class really learned")) + '</p><div class="ice-grid">' +
        L.map(function (a) { return '<button class="ice-card" data-a="' + a[0] + '"><span class="ice-ic">' + a[1] + "</span><b>" + a[2] + "</b><small>" + a[3] + "</small></button>"; }).join("") + "</div>" +
        (hub === "act" ? '<p class="ice-note" style="margin-top:14px">' + T("«خريطة المفاهيم» تأخذ كلماتها من لوحة «الجليد» (كلمات الدرس) ويمكنك تعديلها هناك.", "“Concept map” uses the lesson words from the Ice panel; edit them there.") + "</p>" : ""));
      ov.querySelectorAll(".ice-card").forEach(function (b) { b.onclick = function () { if (hub === "gm") GMF[b.dataset.a](); else start(b.dataset.a); }; });
    }
    /* --- التعلّم النشط --- */
    var TPS_S = [["🤔", T("فكّر وحدك", "Think alone"), 30, 1], ["👥", T("زاوج مع زميل", "Pair up"), 60, 0], ["📣", T("شارك الصف", "Share")  , 90, 0]];
    function tpsRun() { var s = TPS_S[st.ph - 1]; countdown(s[2], function () { snd("chime"); if (st.ph < 3) { st.ph++; paintTps(); tpsRun(); } else { st.ph = 4; paintTps(); } }, s[3]); }
    function paintTps() {
      var ph = st.ph || 0, q = st.q != null ? st.q : T("ما رأيك في: «", "What do you think about: «") + curTitle() + T("»؟", "»?");
      shell(T("فكّر – زاوج – شارك", "Think – Pair – Share"),
        (ph === 0 ? '<p class="ice-lead">' + T("اكتب السؤال أو عدّله:", "Write or edit the question:") + '</p><textarea id="iceTq" class="ice-ta" rows="2">' + esc(q) + '</textarea><div class="ice-row"><button class="ice-sm" id="iceTt">📑 ' + T("استخدم عنوان الشريحة الحالية", "Use the current slide title") + "</button></div>" : '<div class="ice-stmt">' + esc(q) + "</div>") +
        '<div class="ice-steps">' + TPS_S.map(function (s, i) { return '<span class="' + (ph === i + 1 ? "on" : ph > i + 1 || ph === 4 ? "dn" : "") + '">' + s[0] + " " + s[1] + "<small>" + s[2] + " " + T("ث", "s") + "</small></span>"; }).join("") + "</div>" +
        (ph >= 1 && ph <= 3 ? '<div class="ice-cdbig" id="iceCd"></div>' : "") +
        '<div class="ice-row">' + (ph === 0 ? '<button class="ice-sm go" id="iceGo">▶ ' + T("ابدأ", "Start") + "</button>" : ph === 4 ? '<button class="ice-sm go" id="iceNx">🔄 ' + T("جولة جديدة", "New round") + "</button>" : '<button class="ice-sm" id="iceSk">⏭ ' + T("الخطوة التالية", "Next step") + "</button>") + "</div>" +
        '<p class="ice-note">' + T("خطوة «فكّر» هادئة بلا كلام، ثم يتحدّث كل طالب مع زميله القريب.", "“Think” is silent; then each student talks to a neighbour.") + "</p>", ph === 4 ? 1 : null);
      var tt = $("iceTt"); if (tt) tt.onclick = function () { $("iceTq").value = T("ما رأيك في: «", "What do you think about: «") + curTitle() + T("»؟", "»?"); };
      var go = $("iceGo"); if (go) go.onclick = function () { st.q = $("iceTq").value; st.ph = 1; paintTps(); tpsRun(); };
      var sk = $("iceSk"); if (sk) sk.onclick = function () { stopT(); st.ph++; paintTps(); if (st.ph <= 3) tpsRun(); };
      var nx = $("iceNx"); if (nx) nx.onclick = function () { st = { used: [] }; paintTps(); };
      if (ph >= 1 && ph <= 3) { var c = $("iceCd"); if (c && !tIv) tpsRun(); }
    }
    function paintJig() {
      var n = tms().length, topics = lines("hb-act-jig-" + DECK, spread(slideTitles(), n)), Tm = tms();
      if (st.edit) {
        shell(T("المحاور المتقاطعة", "Jigsaw"), '<p class="ice-lead">' + T("اكتب محورًا في كل سطر (بعدد الفرق):", "One topic per line (one per team):") + '</p><textarea id="iceJt" class="ice-ta" rows="5">' + esc(topics.join("\n")) + '</textarea><div class="ice-row"><button class="ice-sm go" id="iceJs">💾 ' + T("احفظ", "Save") + '</button><button class="ice-sm" id="iceJr">🔄 ' + T("اقترح من الدرس", "Suggest from the lesson") + "</button></div>");
        $("iceJs").onclick = function () { LS.set("hb-act-jig-" + DECK, $("iceJt").value); st.edit = false; paintJig(); };
        $("iceJr").onclick = function () { LS.set("hb-act-jig-" + DECK, ""); st.edit = false; paintJig(); }; return;
      }
      shell(T("المحاور المتقاطعة", "Jigsaw"),
        '<p class="ice-lead">' + T("لكل فريق محور من الدرس. أولًا تصيرون خبراء فيه، ثم تعلّمون زملاءكم.", "Each team gets one part of the lesson: first become experts, then teach the others.") + '</p><div class="ice-cnt">' + Tm.map(function (t, i) { return '<div class="ice-ct" style="background:' + t.c + ';min-height:88px"><span>' + esc(t.n) + "</span><b style=\"font-size:20px;flex:2;text-align:center\">" + esc(topics.length ? topics[i % topics.length] : "—") + "</b>" + lvLine(t.n) + "</div>"; }).join("") + "</div>" +
        '<div class="ice-cdbig" id="iceCd">' + fmt(st.dur || 300) + '</div><div class="ice-row"><button class="ice-sm go" id="iceE">🔎 ' + T("مرحلة الخبراء ٥ د", "Expert phase 5 min") + '</button><button class="ice-sm go" id="iceT">🎓 ' + T("مرحلة التعليم ٥ د", "Teaching phase 5 min") + '</button><button class="ice-sm" id="iceEd">✏️ ' + T("عدّل المحاور", "Edit topics") + "</button></div>", 2);
      $("iceE").onclick = function () { snd("drum"); countdown(300, function () { snd("chime"); }); }; $("iceT").onclick = function () { snd("drum"); countdown(300, function () { snd("chime"); }); };
      $("iceEd").onclick = function () { st.edit = true; paintJig(); };
    }
    function paintSqs() {
      var Tm = tms(), n = Tm.length, ph = st.ph || 0, k = st.k || 0;
      shell(T("اصنعوا الأسئلة", "Student-made questions"),
        (ph === 0 ? '<p class="ice-lead">' + T("كل فريق يكتب سؤالًا واحدًا جيّدًا عن الدرس، وإجابته النموذجية.", "Each team writes one good question about the lesson, with its model answer.") + '</p>' + lvList() + '<div class="ice-cdbig" id="iceCd">' + fmt(120) + '</div><div class="ice-row"><button class="ice-sm go" id="iceGo">▶ ' + T("ابدأوا (دقيقتان)", "Start (2 min)") + '</button><button class="ice-sm" id="iceSk">⏭ ' + T("انتقل للتبادل", "Go to the swap") + "</button></div>" :
          '<p class="ice-lead">' + T("تبادل الأسئلة: الفريق الأول يسأل، والفريق المجاور يجيب.", "Swap time: one team asks, the next answers.") + '</p><div class="ice-cnt">' + Tm.map(function (t, i) { var b = Tm[(i + 1) % n]; return '<div class="ice-ct" style="background:' + t.c + (i === k ? ";outline:5px solid #FFD25C" : ";opacity:.7") + '"><span>' + esc(t.n) + "</span><b style=\"font-size:18px\">→</b><span>" + esc(b.n) + "</span></div>"; }).join("") + '</div><div class="ice-row"><button class="ice-sm go" id="iceNx">➡ ' + T("الدور التالي", "Next pair") + '</button><button class="ice-sm" id="iceCh">⏱ 60 ' + T("ث للإجابة", "s to answer") + '</button><b class="ice-cd" id="iceCd"></b></div><p class="ice-note">' + T("امنح نقطة لجودة السؤال ونقطة لدقة الإجابة.", "Give a point for a good question and one for an accurate answer.") + "</p>"), ph === 1 ? 1 : null);
      var go = $("iceGo"); if (go) go.onclick = function () { snd("drum"); countdown(120, function () { snd("chime"); st.ph = 1; st.k = 0; paintSqs(); }); };
      var sk = $("iceSk"); if (sk) sk.onclick = function () { stopT(); st.ph = 1; st.k = 0; paintSqs(); };
      var nx = $("iceNx"); if (nx) nx.onclick = function () { st.k = (k + 1) % n; stopT(); paintSqs(); };
      var ch = $("iceCh"); if (ch) ch.onclick = function () { countdown(60, function () { snd("chime"); }); };
    }
    function paintCmp() {
      if (!st.set) st.set = shuffle(kws()).slice(0, 8);
      shell(T("خريطة المفاهيم", "Concept map"),
        '<p class="ice-lead">' + T("ارسموا خريطة تربط هذه الكلمات بأسهم، واكتبوا على كل سهم العلاقة بين الكلمتين.", "Draw a map linking these words with arrows; label each arrow with the relation.") + '</p><div class="ice-words">' + st.set.map(function (w) { return '<span class="ice-wd">' + esc(w) + "</span>"; }).join("") + '</div><div class="ice-cdbig" id="iceCd">' + fmt(180) + '</div><div class="ice-row"><button class="ice-sm go" id="iceGo">▶ ' + T("ابدأوا (٣ دقائق)", "Start (3 min)") + '</button><button class="ice-sm" id="iceNx">🔄 ' + T("كلمات أخرى", "Other words") + "</button></div>", 3);
      $("iceGo").onclick = function () { snd("drum"); countdown(180, function () { snd("chime"); }); };
      $("iceNx").onclick = function () { st.set = null; stopT(); paintCmp(); };
    }
    function paintDeb() {
      var s = st.s != null ? st.s : T("هل توافق على: «", "Do you agree with: «") + curTitle() + T("»؟", "»?");
      shell(T("أوافق أم لا أوافق", "Agree or disagree"),
        '<p class="ice-lead">' + T("اقرأوا العبارة، ثم تحرّكوا إلى جهة موقفكم.", "Read the statement, then move to your stance.") + '</p><textarea id="iceDs" class="ice-ta" rows="2">' + esc(s) + '</textarea><div class="ice-zones"><div style="background:#15803D">✅ ' + T("أوافق", "Agree") + '</div><div style="background:#B7791F">🤔 ' + T("متردّد", "Unsure") + '</div><div style="background:#B3261E">❌ ' + T("لا أوافق", "Disagree") + '</div></div><div class="ice-cdbig" id="iceCd"></div>' +
        '<div class="ice-row"><button class="ice-sm" data-t="20">⏱ 20 ' + T("ث: اختاروا موقفكم", "s: pick a side") + '</button><button class="ice-sm go" data-t="90">⏱ 90 ' + T("ث: دافعوا بدليل", "s: defend with evidence") + '</button><button class="ice-sm" data-t="30">⏱ 30 ' + T("ث: هل غيّرتم رأيكم؟", "s: changed your mind?") + "</button></div>");
      $("iceDs").oninput = function () { st.s = this.value; };
      ov.querySelectorAll("[data-t]").forEach(function (b) { b.onclick = function () { snd("drum"); countdown(+b.dataset.t, function () { snd("chime"); }); }; });
    }
    function paintLvl() {
      var Tm = tms(), D = jget(LVK), r = st.r || 0, tops = lines("hb-act-jig-" + DECK, spread(slideTitles(), Tm.length));
      shell(T("مستويات الفرق وأدوارها", "Team levels & roles"),
        '<p class="ice-lead">' + T("اختر مستوى كل فريق فتظهر له مهمة بمستوى التفكير المناسب، وتتبدّل الأدوار كل جولة.", "Pick each team's level to get a task at the right thinking level; roles rotate every round.") + '</p><div class="ice-lvg">' + Tm.map(function (t, i) {
          var v = D[t.n], topic = tops.length ? tops[i % tops.length] : curTitle();
          return '<div class="ice-lvc" style="border-color:' + t.c + '"><div class="ice-lvh" style="background:' + t.c + '">' + esc(t.n) + '</div><div class="ice-lvs">' + LV.map(function (l, k) { return '<button data-t="' + i + '" data-l="' + k + '" style="' + (v === k ? "background:" + l[2] + ";color:#fff;border-color:" + l[2] : "") + '">' + l[0] + " " + l[1] + "</button>"; }).join("") + "</div>" +
            (v != null && v >= 0 ? '<p class="ice-lvt"><b>' + LV[v][0] + "</b> " + esc(LV[v][3]) + " <span>«" + esc(topic) + "»</span></p>" : '<p class="ice-lvt" style="color:#8a94a6">' + T("اختر مستوى الفريق", "Pick the team's level") + "</p>") +
            '<ul class="ice-lvr">' + ROLES.map(function (ro, m) { return "<li>" + ro[0] + " <b>" + ro[1] + "</b> <small>" + T("العضو ", "Member ") + ((m + r) % 4 + 1) + "</small></li>"; }).join("") + "</ul></div>";
        }).join("") + '</div><div class="ice-row"><button class="ice-sm go" id="iceRn">🔄 ' + T("جولة جديدة: بدّلوا الأدوار", "New round: swap the roles") + " (" + (r + 1) + ')</button></div><p class="ice-note">' + T("صيغ المهام عامة بحسب مستويات التفكير، والموضوع من محاور الدرس (عدّلها من «المحاور المتقاطعة»). الأدوار لفريق من أربعة.", "Task stems follow thinking levels; the topic comes from the lesson's parts (edit them in Jigsaw). Roles assume a team of four.") + "</p>");
      ov.querySelectorAll(".ice-lvs button").forEach(function (b) { b.onclick = function () { var t = tms()[+b.dataset.t]; if (!t) return; D[t.n] = +b.dataset.l; LS.set(LVK, JSON.stringify(D)); paintLvl(); }; });
      $("iceRn").onclick = function () { st.r = r + 1; snd("chime"); paintLvl(); };
    }
    function paintOmp() {
      shell(T("ورقة الدقيقة", "One-minute paper"),
        '<p class="ice-lead">' + T("في ورقة صغيرة اكتبوا:", "On a small paper write:") + '</p><div class="ice-cnt" style="grid-template-columns:1fr 1fr"><div class="ice-ct" style="background:#0B7A75;min-height:110px;font-size:22px;font-weight:800;justify-content:center;text-align:center">💡 ' + T("أهم فكرة تعلّمتها اليوم", "The key idea I learned today") + '</div><div class="ice-ct" style="background:#C2410C;min-height:110px;font-size:22px;font-weight:800;justify-content:center;text-align:center">❓ ' + T("أصعب نقطة أو سؤال بقي عندي", "My muddiest point or question") + '</div></div><div class="ice-cdbig" id="iceCd">' + fmt(60) + '</div><div class="ice-row"><button class="ice-sm go" id="iceGo">▶ ' + T("ابدأوا (دقيقة)", "Start (1 min)") + "</button></div>" +
        '<p class="ice-note">' + T("اجمع الأوراق عند الخروج، وابدأ الحصة القادمة بأكثر نقطة صعبة تكرّرت.", "Collect them at the door; start next lesson with the most repeated difficulty.") + "</p>");
      $("iceGo").onclick = function () { snd("drum"); countdown(60, function () { snd("chime"); }); };
    }
    /* --- الفيدباك --- */
    var STEM0 = {
      a: [T("أعجبني أنك… لأن…", "I liked that you… because…"), T("استخدمتَ ما تعلّمناه (…) وظهر ذلك حين…", "You used what we learned (…) and it showed when…"), T("أحسنتَ حين… وأثر ذلك في…", "You did well when… and it helped…")],
      b: [T("ستتطوّر أكثر لو… لأن…", "You'll improve if you… because…"), T("حاول أن تضيف… ليصبح عملك…", "Try adding… so your work becomes…"), T("ما رأيك أن تربط… بـ…؟", "What if you link… with…?")],
      c: [T("في المرة القادمة ابدأ بـ… ثم…", "Next time start with… then…"), T("تدرّب على… قبل الدرس القادم", "Practise… before the next lesson"), T("راجع… ثم أعد المحاولة", "Review… then try again")]
    };
    var STK = "hb-fb-stems-" + DECK;
    var bank = function (k) { var d = jget(STK); return d[k] && d[k].length ? d[k] : STEM0[k]; };
    var fbHint = function (v) { v = (v || "").trim(); if (!v) return ""; if (/…/.test(v)) return T("🔎 أكمل الجملة بما فعله الطالب فعلًا", "🔎 Finish the sentence with what the student actually did"); var w = v.split(/\s+/).length; if (w < 4 || /^(احسنت|أحسنت|ممتاز|جيد|رائع|برافو|شكرا|شكرًا)[\s!.،]*$/.test(norm(v).replace(/أ/g, "ا"))) return T("🔎 اجعله محدّدًا: ماذا فعل؟ ولماذا أفاد؟", "🔎 Be specific: what did they do, and why did it help?"); return ""; };
    function paintTfb() {
      var Stu = STU(), Tm = tms(), M2 = (st.mdl || "2s1w") === "2s1w", ks = M2 ? ["a", "a2", "b"] : ["a", "b", "c"];
      if (st.bankEd) {
        shell(T("جمل الفيدباك", "Feedback stems"), '<p class="ice-lead">' + T("اكتب جملة في كل سطر؛ تظهر كأزرار بنقرة واحدة. اتركها فارغة للعودة للافتراضي.", "One stem per line; they appear as one-tap buttons. Leave empty for the defaults.") + "</p>" + ["a", "b", "c"].map(function (k) { return '<div class="ice-fld"><label>' + ({ a: "⭐", b: "🎯", c: "➡" })[k] + '</label><div><textarea class="ice-ta" data-bk="' + k + '" rows="3">' + esc(bank(k).join("\n")) + "</textarea></div></div>"; }).join("") + '<div class="ice-row"><button class="ice-sm go" id="iceBs">💾 ' + T("احفظ", "Save") + '</button><button class="ice-sm" id="iceBr">↺ ' + T("الافتراضي", "Defaults") + "</button></div>");
        $("iceBs").onclick = function () { var o = {}; ov.querySelectorAll("[data-bk]").forEach(function (t) { var L = t.value.split(/\n/).map(function (x) { return x.trim(); }).filter(Boolean); if (L.length) o[t.dataset.bk] = L; }); LS.set(STK, JSON.stringify(o)); st.bankEd = false; paintTfb(); };
        $("iceBr").onclick = function () { LS.set(STK, "{}"); st.bankEd = false; paintTfb(); }; return;
      }
      if (st.show) {
        var parts = M2 ? [st.a && "⭐ " + st.a, st.a2 && "⭐ " + st.a2, st.b && "🎯 " + st.b] : [st.a && "⭐ " + st.a, st.b && "🎯 " + st.b, st.c && "➡ " + st.c];
        shell(T("رسالة تقدير", "A message for you"),
          '<div class="ice-fbcard"><div class="ice-fbto">' + T("إلى: ", "To: ") + "<b>" + esc(st.to || T("الصف", "the class")) + "</b></div>" + parts.filter(Boolean).map(function (x) { return "<p>" + esc(x) + "</p>"; }).join("") + '</div><div class="ice-row"><button class="ice-sm" id="iceBk2">✏️ ' + T("عدّل", "Edit") + '</button><button class="ice-sm go" id="iceSv">💾 ' + T("احفظ في ملاحظاتي", "Save to my notes") + '</button><button class="ice-sm" id="iceNw">🆕 ' + T("فيدباك جديد", "New feedback") + "</button></div>");
        $("iceBk2").onclick = function () { st.show = false; paintTfb(); }; $("iceNw").onclick = function () { st = { used: [], mdl: st.mdl }; paintTfb(); };
        $("iceSv").onclick = function () { saveNote("💬 " + T("فيدباك إلى ", "Feedback to ") + (st.to || T("الصف", "class")), parts.filter(Boolean).join(" | ")); }; return;
      }
      var opt = '<option value="">' + T("اختر المستلم…", "Choose a recipient…") + "</option>" + Stu.map(function (x) { return "<option" + (st.to === x ? " selected" : "") + ">" + esc(x) + "</option>"; }).join("") + Tm.map(function (t) { var v = T("الفريق ", "Team ") + t.n; return "<option" + (st.to === v ? " selected" : "") + ">" + esc(v) + "</option>"; }).join("") + "<option" + (st.to === T("الصف كله", "The whole class") ? " selected" : "") + ">" + T("الصف كله", "The whole class") + "</option>";
      var ICO = { a: "⭐", a2: "⭐", b: "🎯", c: "➡" }, PH = { a: T("نجمة: ما أحسن فيه ولماذا…", "Star: what went well and why…"), a2: T("نجمة ثانية…", "A second star…"), b: T("أمنية: ما يطوّره وكيف…", "Wish: what to improve and how…"), c: T("خطوته التالية…", "The next step…") };
      var fld = function (k) { var bk = k === "a2" ? "a" : k; return '<div class="ice-fld"><label>' + ICO[k] + '</label><div style="flex:1"><input class="ice-txt" data-k="' + k + '" value="' + esc(st[k] || "") + '" placeholder="' + PH[k] + '"><span class="ice-hint" data-h="' + k + '">' + fbHint(st[k]) + '</span><div class="ice-stems">' + bank(bk).map(function (x) { return '<button class="ice-chip" data-k="' + k + '" data-s="' + esc(x) + '">' + esc(x) + "</button>"; }).join("") + "</div></div></div>"; };
      shell(T("فيدباك المعلم للطالب", "Teacher → student feedback"),
        '<p class="ice-lead">' + T("فيدباك محدّد يحرّك التعلّم: اذكر ما فعله الطالب فعلًا ولماذا أفاد.", "Specific feedback that moves learning: say what the student actually did and why it helped.") + '</p><div class="ice-mdl"><button class="ice-sm' + (M2 ? " on" : "") + '" data-m="2s1w">⭐⭐🎯 ' + T("نجمتان وأمنية", "Two stars & a wish") + '</button><button class="ice-sm' + (!M2 ? " on" : "") + '" data-m="1s1w1n">⭐🎯➡ ' + T("نجمة وأمنية وخطوة", "Star, wish & next step") + '</button></div><div class="ice-row"><select id="iceTo" class="ice-sel">' + opt + "</select></div>" +
        ks.map(fld).join("") + '<div class="ice-row"><button class="ice-sm go" id="iceSh">📺 ' + T("اعرضها على الشاشة", "Show on screen") + '</button><button class="ice-sm" id="iceBe">✏️ ' + T("عدّل بنوك الجمل", "Edit stems") + "</button></div>");
      $("iceTo").onchange = function () { st.to = this.value; };
      ov.querySelectorAll("[data-m]").forEach(function (b) { b.onclick = function () { st.mdl = b.dataset.m; paintTfb(); }; });
      ov.querySelectorAll(".ice-txt").forEach(function (i) { i.oninput = function () { st[i.dataset.k] = i.value; var h = ov.querySelector('[data-h="' + i.dataset.k + '"]'); if (h) h.textContent = fbHint(i.value); }; });
      ov.querySelectorAll(".ice-chip").forEach(function (b) { b.onclick = function () { var inp = ov.querySelector('.ice-txt[data-k="' + b.dataset.k + '"]'); inp.value = b.dataset.s; st[b.dataset.k] = inp.value; var h = ov.querySelector('[data-h="' + b.dataset.k + '"]'); if (h) h.textContent = fbHint(inp.value); inp.focus(); var n = inp.value.indexOf("…"); if (n >= 0) inp.setSelectionRange(n, n + 1); }; });
      $("iceBe").onclick = function () { st.bankEd = true; paintTfb(); };
      $("iceSh").onclick = function () { if (!ks.some(function (k) { return st[k]; })) { say(T("اكتب جملة واحدة على الأقل", "Write at least one line")); return; } st.show = true; snd("correct"); paintTfb(); };
    }
    function pfbRun() { countdown(60, function () { snd("chime"); if (st.k < (st.n || 4)) { st.k++; paintPfb(); pfbRun(); } else { st.k = 0; st.run = false; paintPfb(); } }, 1); }
    function paintPfb() {
      var n = st.n || 4, k = st.k || 0, run = !!st.run;
      shell(T("فيدباك الأقران في مجموعات", "Peer feedback in groups"),
        '<p class="ice-lead">' + T("كل عضو في المجموعة يعطي زميله التالي فيدباك لمدة دقيقة. الجميع يأخذ ويعطي.", "Each member gives the next one a minute of feedback. Everyone gives and receives.") + '</p><div class="ice-q"><button class="ice-sm" id="iceNm"' + (run ? " disabled" : "") + '>−</button><span>' + T("عدد أعضاء المجموعة: ", "Group size: ") + "<b>" + n + '</b></span><button class="ice-sm" id="iceNp"' + (run ? " disabled" : "") + ">＋</button></div>" +
        (run ? '<div class="ice-first" style="background:#102A4C">' + T("الدور ", "Turn ") + k + ": " + T("العضو ", "Member ") + k + " → " + T("العضو ", "Member ") + (k % n + 1) + '</div><div class="ice-cdbig" id="iceCd"></div>' : "") +
        '<div class="ice-rules"><span>🌸 ' + T("لطيف", "Kind") + "</span><span>🎯 " + T("محدّد", "Specific") + "</span><span>🧭 " + T("مفيد", "Helpful") + '</span></div><div class="ice-fbstems"><p>⭐ ' + esc(bank("a")[0]) + " " + T("(نجمتان)", "(two stars)") + "</p><p>🎯 " + esc(bank("b")[0]) + " " + T("(أمنية)", "(one wish)") + "</p><p>🤝 " + esc(bank("c")[0]) + '</p></div><div class="ice-row">' + (run ? '<button class="ice-sm" id="iceSt">■ ' + T("أوقف", "Stop") + "</button>" : '<button class="ice-sm go" id="iceGo">▶ ' + T("ابدأ الدوران", "Start rotation") + "</button>") + "</div>");
      var np = $("iceNp"), nm = $("iceNm"); if (np) np.onclick = function () { st.n = Math.min(6, n + 1); paintPfb(); }; if (nm) nm.onclick = function () { st.n = Math.max(2, n - 1); paintPfb(); };
      var go = $("iceGo"); if (go) go.onclick = function () { st.run = true; st.k = 1; paintPfb(); pfbRun(); };
      var sp = $("iceSt"); if (sp) sp.onclick = function () { stopT(); st.run = false; st.k = 0; paintPfb(); };
      if (run && !tIv) pfbRun();
    }
    var LVL = [["🌱", T("أبدأ", "Starting")], ["🌿", T("أنمو", "Growing")], ["🌳", T("متمكّن", "Secure")]];
    function paintPas() {
      var Tm = tms(), ck = "hb-fb-pc-" + DECK, crit = lines(ck, [T("وضوح الفكرة", "Clarity of the idea"), T("استخدام ما تعلّمناه من الدرس", "Using what we learned in the lesson"), T("تعاون أعضاء الفريق", "Teamwork")]), D = jget("hb-fb-peer-" + DECK);
      if (st.edit) {
        shell(T("تقييم الأقران", "Peer assessment"), '<p class="ice-lead">' + T("معيار في كل سطر:", "One criterion per line:") + '</p><textarea id="iceCt" class="ice-ta" rows="5">' + esc(crit.join("\n")) + '</textarea><div class="ice-row"><button class="ice-sm go" id="iceCs">💾 ' + T("احفظ", "Save") + "</button></div>");
        $("iceCs").onclick = function () { LS.set(ck, $("iceCt").value); st.edit = false; paintPas(); }; return;
      }
      var ti = st.t || 0; if (ti >= Tm.length) ti = st.t = 0; var tn = Tm[ti].n, R = D[tn] || [], done = crit.map(function (_, i) { return R[i]; });
      var got = done.filter(function (x) { return x != null; }), avg = got.length ? got.reduce(function (a, b) { return a + b; }, 0) / got.length : 0, low = -1; done.forEach(function (v, i) { if (v != null && (low < 0 || v < done[low])) low = i; });
      var trees = done.filter(function (x) { return x === 2; }).length;
      shell(T("تقييم الأقران", "Peer assessment"),
        '<p class="ice-lead">' + T("الفرق المشاهِدة تقيّم الفريق: ", "The watching teams rate: ") + "<b>" + esc(tn) + "</b></p>" +
        '<div class="ice-row">' + Tm.map(function (t, i) { return '<button class="ice-sm' + (i === ti ? " on" : "") + '" data-t="' + i + '" style="' + (i === ti ? "" : "border-color:" + t.c) + '">' + esc(t.n) + "</button>"; }).join("") + "</div>" +
        '<div class="ice-crits">' + crit.map(function (c, i) { return '<div class="ice-cr2"><span>' + esc(c) + "</span>" + LVL.map(function (l, v) { return '<button class="ice-lv' + (done[i] === v ? " on" : "") + '" data-i="' + i + '" data-v="' + v + '">' + l[0] + "<small>" + l[1] + "</small></button>"; }).join("") + "</div>"; }).join("") + "</div>" +
        (got.length ? '<div class="ice-sum">' + (low >= 0 && done[low] < 2 ? "🧭 " + T("خطوة التطوير: ", "Next step: ") + "<b>" + esc(crit[low]) + "</b>" : "🌟 " + T("عملٌ متمكّن في كل المعايير", "Secure on every criterion")) + "</div>" : "") +
        '<div class="ice-row"><button class="ice-sm" id="iceEd">✏️ ' + T("عدّل المعايير", "Edit criteria") + '</button><button class="ice-sm" id="iceSv">💾 ' + T("احفظ في ملاحظاتي", "Save to my notes") + "</button></div>", got.length ? Math.max(1, trees) : 0);
      ov.querySelectorAll("[data-t]").forEach(function (b) { b.onclick = function () { st.t = +b.dataset.t; paintPas(); }; });
      ov.querySelectorAll(".ice-lv").forEach(function (b) { b.onclick = function () { var r = (D[tn] = D[tn] || []); r[+b.dataset.i] = +b.dataset.v; LS.set("hb-fb-peer-" + DECK, JSON.stringify(D)); snd("chime"); paintPas(); }; });
      $("iceEd").onclick = function () { st.edit = true; paintPas(); };
      $("iceSv").onclick = function () { if (!got.length) return; saveNote("📋 " + T("تقييم أقران: ", "Peer assessment: ") + tn, crit.map(function (c, i) { return done[i] != null ? c + " " + LVL[done[i]][0] : ""; }).filter(Boolean).join(" | ") + (low >= 0 && done[low] < 2 ? " | " + T("خطوة التطوير: ", "Next: ") + crit[low] : "")); };
    }
    function paintSas() {
      var ck = "hb-fb-sc-" + DECK, sug = spread(slideTitles(), 3).map(function (t) { return T("أستطيع أن أشرح: ", "I can explain: ") + t; }), crit = lines(ck, sug.length ? sug : [T("أستطيع أن أشرح فكرة الدرس الرئيسية", "I can explain the main idea of the lesson")]), D = jget("hb-fb-self-" + DECK), ph = st.ph || "before";
      if (st.edit) {
        shell(T("التقييم الذاتي", "Self-assessment"), '<p class="ice-lead">' + T("اكتب عبارات «أستطيع أن…» (عبارة في كل سطر):", "Write “I can…” statements, one per line:") + '</p><textarea id="iceSc" class="ice-ta" rows="5">' + esc(crit.join("\n")) + '</textarea><div class="ice-row"><button class="ice-sm go" id="iceSs">💾 ' + T("احفظ", "Save") + "</button></div>");
        $("iceSs").onclick = function () { LS.set(ck, $("iceSc").value); st.edit = false; paintSas(); }; return;
      }
      var lvs = st.lv == null ? "all" : st.lv, K = function (q) { return q + (lvs === "all" ? "" : "@" + lvs); }, P = D[K(ph)] = D[K(ph)] || {}, COL = ["#D64545", "#E6B325", "#2E9E5B"], NM = [T("لم أفهم", "Not yet"), T("جزئيًّا", "Partly"), T("أتقن", "Got it")];
      var pct = function (arr) { var t = (arr || [0, 0, 0]).reduce(function (a, b) { return a + b; }, 0); return t ? Math.round((arr[2] || 0) * 100 / t) : null; };
      shell(T("التقييم الذاتي", "Self-assessment"),
        '<p class="ice-lead">' + T("ارفعوا أصابعكم: ١ لم أفهم، ٢ جزئيًّا، ٣ أتقن. سجّل العدد لكل عبارة.", "Raise fingers: 1 not yet, 2 partly, 3 got it. Tap the counts for each statement.") + '</p><div class="ice-row"><button class="ice-sm' + (ph === "before" ? " on" : "") + '" data-p="before">▶ ' + T("قبل الدرس", "Before") + '</button><button class="ice-sm' + (ph === "after" ? " on" : "") + '" data-p="after">🏁 ' + T("بعد الدرس", "After") + '</button></div><div class="ice-row">' + [["all", "👥 " + T("الكل", "All")]].concat(LV.map(function (l, k) { return [k, l[0] + " " + l[1]]; })).map(function (x) { return '<button class="ice-sm' + (lvs === x[0] ? " on" : "") + '" data-lv="' + x[0] + '">' + x[1] + "</button>"; }).join("") + "</div>" +
        '<div class="ice-crits">' + crit.map(function (c, i) { var a = P[i] || [0, 0, 0], tot = a[0] + a[1] + a[2], b = D[K("before")] && D[K("before")][i], af = D[K("after")] && D[K("after")][i], pb = pct(b), pa = pct(af);
          return '<div class="ice-cr2" style="flex-wrap:wrap"><span style="flex:1 1 100%">' + esc(c) + "</span>" + [0, 1, 2].map(function (v) { return '<span class="ice-cnt3" style="background:' + COL[v] + '"><button data-i="' + i + '" data-v="' + v + '" data-d="-1">−</button><b>' + a[v] + "</b><small>" + NM[v] + '</small><button data-i="' + i + '" data-v="' + v + '" data-d="1">＋</button></span>'; }).join("") +
            (tot ? '<div class="ice-stack" style="flex:1 1 100%">' + [0, 1, 2].map(function (v) { return a[v] ? '<i style="flex:' + a[v] + ";background:" + COL[v] + '"></i>' : ""; }).join("") + "</div>" : "") +
            (pb != null && pa != null ? '<span class="ice-grow" style="flex:1 1 100%">📈 ' + T("المتقنون: ", "Secure: ") + pb + "% → " + pa + "% (" + (pa - pb >= 0 ? "+" : "") + (pa - pb) + ")</span>" : "") + "</div>"; }).join("") + "</div>" +
        '<div class="ice-row"><button class="ice-sm" id="iceEd">✏️ ' + T("عدّل العبارات", "Edit statements") + '</button><button class="ice-sm" id="iceSv">💾 ' + T("احفظ الملخص في ملاحظاتي", "Save summary to my notes") + '</button><button class="ice-sm go" id="iceLg">🏁 ' + T("سجّل نموّ هذه الحصة", "Log this lesson's growth") + "</button></div>" + growHtml());
      ov.querySelectorAll("[data-p]").forEach(function (b) { b.onclick = function () { st.ph = b.dataset.p; paintSas(); }; });
      ov.querySelectorAll("[data-lv]").forEach(function (b) { b.onclick = function () { st.lv = b.dataset.lv === "all" ? "all" : +b.dataset.lv; paintSas(); }; });
      ov.querySelectorAll(".ice-cnt3 button").forEach(function (b) { b.onclick = function () { var i = +b.dataset.i, v = +b.dataset.v, a = (P[i] = P[i] || [0, 0, 0]); a[v] = Math.max(0, a[v] + +b.dataset.d); LS.set("hb-fb-self-" + DECK, JSON.stringify(D)); paintSas(); }; });
      $("iceEd").onclick = function () { st.edit = true; paintSas(); };
      $("iceLg").onclick = function () {
        var tp = function (ph2, lv2) { var a = 0, t = 0; Object.keys(D).filter(function (k) { return lv2 == null ? (k === ph2 || k.indexOf(ph2 + "@") === 0) : k === ph2 + "@" + lv2; }).forEach(function (k) { Object.keys(D[k]).forEach(function (i) { var r = D[k][i]; a += r[2] || 0; t += (r[0] || 0) + (r[1] || 0) + (r[2] || 0); }); }); return t ? Math.round(a * 100 / t) : null; };
        var b0 = tp("before"), a0 = tp("after"); if (b0 == null || a0 == null) { say(T("سجّل «قبل» و«بعد» أولًا", "Record both Before and After first")); return; }
        var lvx = {}; [0, 1, 2, 3].forEach(function (k) { var x = tp("before", k), y = tp("after", k); if (x != null && y != null) lvx[k] = [x, y]; }); gpush({ k: "sas", b: b0, a: a0, lv: lvx }); LS.set("hb-fb-self-" + DECK, "{}"); st.ph = "before"; snd("correct"); burst(["📈", "🌟"]); say(T("سُجّل النموّ: ", "Growth logged: ") + b0 + "% → " + a0 + "%"); paintSas();
      };
      $("iceSv").onclick = function () { saveNote("🪞 " + T("تقييم ذاتي ", "Self-assessment ") + (ph === "before" ? T("(قبل)", "(before)") : T("(بعد)", "(after)")), crit.map(function (c, i) { var a = P[i]; return a ? c.slice(0, 40) + ": 🔴" + a[0] + " 🟡" + a[1] + " 🟢" + a[2] : ""; }).filter(Boolean).join(" | ")); };
    }
    var letPick = function () { st.L = LETS[Math.floor(Math.random() * LETS.length)]; st.cat = CATS[Math.floor(Math.random() * CATS.length)]; };
    function paint() { stopT(); if (mode === "menu") paintMenu(); else if (mode === "scr") paintScr(); else if (mode === "mys") paintMys(); else if (mode === "twq") paintTwq(); else if (mode === "brn") paintBrn(); else if (mode === "mem") paintMem(); else if (mode === "let") paintBrn(); else if (mode === "lin") paintLine(); else if (mode === "num") paintNum(); else if (mode === "cor") paintCor(); else if (mode === "tf") paintTf(); else if (mode === "buz") paintBuz(); else if (mode === "prd") paintPrd(); else if (mode === "hot") paintHot(); else if (mode === "tps") paintTps(); else if (mode === "jig") paintJig(); else if (mode === "sqs") paintSqs(); else if (mode === "cmp") paintCmp(); else if (mode === "deb") paintDeb(); else if (mode === "omp") paintOmp(); else if (mode === "lvl") paintLvl(); else if (mode === "tfb") paintTfb(); else if (mode === "pfb") paintPfb(); else if (mode === "pas") paintPas(); else if (mode === "sas") paintSas(); kick(); }
    var HBTN = { ice: "hbIce", act: "hbAct", fb: "hbFb", gm: "hbGm" };
    var openHub = function (h) { closePops(); var co = $("hbClassOv"); if (co) co.classList.remove("on"); $("hbClass").classList.remove("on"); if (ov.classList.contains("on") && hub === h) { closeIce(); return; } stopT(); if (W.__hbWsClose) W.__hbWsClose(); hub = h; mode = "menu"; st = {}; ov.classList.add("on"); ["hbIce", "hbAct", "hbFb", "hbGm"].forEach(function (id) { var b = $(id); if (b) b.classList.toggle("on", id === HBTN[h]); }); paint(); };
    on("hbIce", function () { openHub("ice"); }); on("hbAct", function () { openHub("act"); }); on("hbFb", function () { openHub("fb"); }); on("hbGm", function () { openHub("gm"); });
    /* ---------- أوراق العمل: ملفات الدرس نفسها فوق العرض ---------- */
    var wsOv = mk("div", "hbWsOv"); wsOv.dir = RTL ? "rtl" : "ltr"; stop(wsOv);
    var WSF = [["worksheets-A4.html", "📝", T("ورقة الطالب", "Student worksheet")], ["group-work.html", "👥", T("عمل المجموعات", "Group work")], ["pod-sheet.html", "🧩", T("ورقة الفريق", "Team sheet")], ["answer-key.html", "🔑", T("مفتاح الإجابة", "Answer key")]];
    var wsBase = location.href.split("#")[0].split("?")[0].replace(/[^/]*$/, ""), wsAvail = null, wsCur = "";
    var wsLoad = function (cb) { if (wsAvail) return cb(); wsAvail = {}; var n = WSF.length; WSF.forEach(function (f) { fetch(wsBase + f[0], { method: "HEAD" }).then(function (r) { wsAvail[f[0]] = r.ok; }).catch(function () { wsAvail[f[0]] = false; }).then(function () { if (!--n) cb(); }); }); };
    var wsClose = function () { wsOv.classList.remove("on"); var b = $("hbWs"); if (b) b.classList.remove("on"); };
    W.__hbWsClose = wsClose; var wsQrOn = false;
    function wsPaint() {
      var have = WSF.filter(function (f) { return wsAvail[f[0]]; });
      if (!have.some(function (f) { return f[0] === wsCur; })) wsCur = have.length ? have[0][0] : "";
      wsOv.innerHTML = '<div class="ws-h"><b>📄 ' + T("أوراق العمل", "Worksheets") + "</b>" + have.map(function (f) { return '<button data-f="' + f[0] + '" class="' + (f[0] === wsCur ? "on" : "") + '">' + f[1] + " " + f[2] + "</button>"; }).join("") + '<span class="ws-sp"></span>' + (have.length ? '<button id="wsQb" class="' + (wsQrOn ? "on" : "") + '">📱 QR</button><button id="wsPr">🖨 ' + T("اطبع", "Print") + '</button><button id="wsNt">↗ ' + T("تبويب جديد", "New tab") + "</button>" : "") + '<button class="ws-x" id="wsX" aria-label="' + T("إغلاق", "Close") + '">✕</button></div>' +
        (wsCur === "answer-key.html" ? '<div class="ws-wn">🔒 ' + T("للمعلم فقط — لا تعرضه على الطلاب قبل انتهاء العمل", "Teacher only — don't show it to students before the work is done") + "</div>" : "") +
        (have.length ? '<iframe class="ws-fr" id="wsFr" src="' + wsBase + wsCur + '"></iframe>' : '<p class="ws-none">' + T("لا توجد أوراق عمل مرفوعة لهذا الدرس بعد.", "No worksheets have been uploaded for this lesson yet.") + "</p>");
      $("wsX").onclick = wsClose;
      var qb = $("wsQb"); if (qb) qb.onclick = function () { wsQrOn = !wsQrOn; wsPaint(); };
      if (wsQrOn && have.length) { var bx = D.createElement("div"); bx.className = "ws-qrbox"; bx.innerHTML = '<div id="wsQr">…</div>' + T("امسح الرمز لفتح صفحة الدرس على جهازك", "Scan to open the lesson page on your device"); wsOv.appendChild(bx); if (W.__hbQr) W.__hbQr($("wsQr"), 180, lessonUrl()); }
      wsOv.querySelectorAll("[data-f]").forEach(function (b) { b.onclick = function () { wsCur = b.dataset.f; wsPaint(); }; });
      var pr = $("wsPr"); if (pr) pr.onclick = function () { try { var fr = $("wsFr"); fr.contentWindow.focus(); fr.contentWindow.print(); } catch (e) { window.open(wsBase + wsCur, "_blank", "noopener"); } };
      var nt = $("wsNt"); if (nt) nt.onclick = function () { window.open(wsBase + wsCur, "_blank", "noopener"); };
    }
    on("hbWs", function () {
      if (wsOv.classList.contains("on")) { wsClose(); return; }
      closePops(); closeIce(); var co = $("hbClassOv"); if (co) co.classList.remove("on"); var cb = $("hbClass"); if (cb) cb.classList.remove("on");
      wsLoad(function () { wsPaint(); wsOv.classList.add("on"); $("hbWs").classList.add("on"); W.__hbMark("ws"); });
    });
  })();

  /* ---------- دعم القراءة والتمايز ---------- */
  (function () {
    var pop = mk("div", "hbSupPop"); pop.className = "pop hb-pop"; pop.dir = RTL ? "rtl" : "ltr"; stop(pop);
    var QRE = /[﴾﴿ٱۖ-ۜ۟-۪ۨ-ۭ]/;
    var isQuran = function (el) { for (var e = el; e && e !== stage; e = e.parentElement) { if (/hafs|quran|uthman/i.test(e.style.fontFamily || "") || /\b(ayah|aya|quran|verse)\b/i.test(e.className || "")) return true; } return QRE.test(el.textContent || ""); };
    var HAR = /[ً-ٰٟ]/g;
    /* التشكيل */
    var orig = new Map(), noTash = false;
    function setTash(off) {
      noTash = off; LS.set("hb-notash-" + DECK, off ? "1" : "");
      if (off) {
        var w = D.createTreeWalker(stage, NodeFilter.SHOW_TEXT), n;
        while ((n = w.nextNode())) { if (!HAR.test(n.nodeValue)) { HAR.lastIndex = 0; continue; } HAR.lastIndex = 0; var pe = n.parentElement; if (!pe || pe.closest("aside,script,style") || isQuran(pe)) continue; var v = n.nodeValue.replace(HAR, ""); orig.set(n, [n.nodeValue, v]); n.nodeValue = v; }
      } else { orig.forEach(function (o, n) { if (n.nodeValue === o[1]) n.nodeValue = o[0]; }); orig.clear(); }
    }
    /* مسطرة القراءة */
    var rl = mk("div", "hbRuler", "<i></i><b></b><i></i>"), rH = +LS.get("hb-ruler-h", "110"), rY = innerHeight / 2;
    function paintRuler() { var top = parseFloat(getComputedStyle(rl).top) || 0, y = rY - top, a = Math.max(0, y - rH / 2); rl.children[0].style.height = a + "px"; rl.children[1].style.top = a + "px"; rl.children[1].style.height = rH + "px"; rl.children[2].style.top = (a + rH) + "px"; }
    W.addEventListener("pointermove", function (e) { if (!rl.classList.contains("on")) return; rY = e.clientY; paintRuler(); }, { passive: true });
    /* اقرأ لي */
    var SY = W.speechSynthesis, rate = +LS.get("hb-tts-rate", "0.9"), reading = false, sayEl = null;
    var voice = function (ar) { var V = SY ? SY.getVoices() : []; var pref = ar ? /^ar/i : /^en/i; var L = V.filter(function (v) { return pref.test(v.lang); }); return L.filter(function (v) { return /natural|online|neural|google/i.test(v.name); })[0] || L[0] || null; };
    var unmark = function () { if (sayEl) sayEl.classList.remove("hb-say"); sayEl = null; };
    var cleanT = function (t) { return String(t || "").replace(/[\u{1F300}-\u{1FAFF}☀-➿️]/gu, "").replace(/\s+/g, " ").trim(); };
    var fullText = function (el) { if (!orig.size) return el.textContent; var w = D.createTreeWalker(el, NodeFilter.SHOW_TEXT), n, o = ""; while ((n = w.nextNode())) { var x = orig.get(n); o += x && n.nodeValue === x[1] ? x[0] : n.nodeValue; } return o; };
    function speak(list, i) {
      i = i || 0; unmark(); if (!SY || i >= list.length) return;
      var el = list[i], t = cleanT(fullText(el)); if (!t) return speak(list, i + 1);
      var ar = /[؀-ۿ]/.test(t.replace(/[ﷺﷻ]/g, "")), v = voice(ar);
      t = t.replace(/ﷺ/g, ar ? " صلى الله عليه وسلم " : " (peace be upon him) ").replace(/ﷻ/g, ar ? " جل جلاله " : " ");
      if (!v) { say(ar ? T("لا يوجد صوت عربي في هذا المتصفح · جرّب Edge أو Chrome", "No Arabic voice in this browser · try Edge or Chrome") : T("لا يوجد صوت إنجليزي في هذا المتصفح", "No English voice in this browser")); return; }
      var u = new SpeechSynthesisUtterance(t); u.voice = v; u.lang = v.lang; u.rate = rate;
      sayEl = el; el.classList.add("hb-say");
      u.onend = function () { if (sayEl === el) { unmark(); if (list.length > 1) speak(list, i + 1); } };
      u.onerror = function () { unmark(); };
      SY.speak(u);
    }
    function stopSpeak() { if (SY) SY.cancel(); unmark(); }
    var BLOCK = "h1,h2,h3,h4,p,li,td,th,figcaption,blockquote,.q,.qo,.cd";
    function slideBlocks() {
      var out = [];
      SL[cur].querySelectorAll(BLOCK).forEach(function (e) {
        if (e.closest("aside,.ft,.hid,script,style") || e.offsetParent === null) return;
        if (out.some(function (o) { return o.contains(e); })) return;
        if (isQuran(e)) return;
        if (cleanT(e.textContent)) out.push(e);
      });
      return out;
    }
    D.addEventListener("click", function (e) {
      if (!reading || !SL[cur].contains(e.target)) return;
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
      var el = e.target.closest(BLOCK) || e.target; if (!SL[cur].contains(el)) return;
      if (isQuran(el)) { stopSpeak(); say(T("الآيات الكريمة تُتلى بصوت قارئ، لا بالقراءة الآلية", "Qur'anic verses are recited by a reciter, not read by a machine voice")); return; }
      SY.cancel(); speak([el]);
    }, true);
    function setReading(on) { reading = on; D.documentElement.classList.toggle("hb-reading", on); if (!on) stopSpeak(); else say(T("انقر أي جملة على الشريحة لتسمعها", "Click any sentence on the slide to hear it")); }
    function paint() {
      var ok = !!(SY && W.SpeechSynthesisUtterance);
      pop.innerHTML = '<div class="hb-h">' + T("دعم القراءة والتمايز", "Reading support") + "</div>" +
        '<div class="hb-sec"><div class="hb-st">🔊 ' + T("اقرأ لي", "Read aloud") + "</div>" + (ok ?
          '<div class="hb-row"><button type="button" class="hb-btn' + (reading ? " pri" : "") + '" id="hsR">' + (reading ? "✓ " : "") + T("انقر جملة لتسمعها", "Click a sentence to hear it") + '</button><button type="button" class="hb-btn" id="hsAll">▶ ' + T("اقرأ الشريحة", "Read the slide") + '</button><button type="button" class="hb-btn" id="hsStop">⏹</button></div>' +
          '<label class="hb-muted" style="display:flex;align-items:center;gap:8px">' + T("السرعة", "Speed") + ' <input type="range" id="hsRate" min="0.5" max="1.3" step="0.1" value="' + rate + '" style="flex:1"></label>' +
          '<p class="hb-muted" style="font-size:12.5px;margin:4px 0 0">' + T("الآيات القرآنية لا تُقرأ آليًّا احترامًا لتلاوتها.", "Qur'anic verses are skipped out of respect for their recitation.") + "</p>"
          : '<p class="hb-muted">' + T("القراءة الصوتية غير متاحة في هذا المتصفح.", "Read aloud isn't available in this browser.") + "</p>") + "</div>" +
        '<div class="hb-sec"><div class="hb-st">ـَ ' + T("التشكيل", "Vowel marks (tashkeel)") + '</div><label class="hb-ck"><input type="checkbox" id="hsT"' + (noTash ? " checked" : "") + "> " + T("أخفِ التشكيل لتدريب القراءة دونه", "Hide vowel marks for unvowelled reading practice") + '</label><p class="hb-muted" style="font-size:12.5px;margin:0">' + T("تبقى الآيات القرآنية مشكولة دائمًا.", "Qur'anic verses always keep their marks.") + "</p></div>" +
        '<div class="hb-sec"><div class="hb-st">📏 ' + T("مسطرة القراءة", "Reading ruler") + '</div><label class="hb-ck"><input type="checkbox" id="hsRl"' + (rl.classList.contains("on") ? " checked" : "") + "> " + T("أظهر شريطًا يتبع المؤشر ويُعتم ما حوله", "A band that follows the pointer and dims the rest") + '</label><div class="hb-seg" style="margin-top:4px">' + [[70, T("سطر", "Line")], [110, T("سطران", "Two lines")], [180, T("فقرة", "Paragraph")]].map(function (o) { return '<button type="button" data-rh="' + o[0] + '" class="' + (rH === o[0] ? "on" : "") + '">' + o[1] + "</button>"; }).join("") + "</div></div>";
      if (ok) {
        $("hsR").onclick = function () { setReading(!reading); paint(); if (reading) closePops(); };
        $("hsAll").onclick = function () { stopSpeak(); var L = slideBlocks(); if (!L.length) say(T("لا نص للقراءة على هذه الشريحة", "No text to read on this slide")); else speak(L); };
        $("hsStop").onclick = stopSpeak;
        $("hsRate").oninput = function () { rate = +this.value; LS.set("hb-tts-rate", rate); };
      }
      $("hsT").onchange = function () { setTash(this.checked); };
      $("hsRl").onchange = function () { rl.classList.toggle("on", this.checked); paintRuler(); $("hbSup").classList.toggle("on", rl.classList.contains("on") || reading || noTash); };
      pop.querySelectorAll("[data-rh]").forEach(function (b) { b.onclick = function () { rH = +b.dataset.rh; LS.set("hb-ruler-h", rH); paintRuler(); paint(); }; });
      $("hbSup").classList.toggle("on", rl.classList.contains("on") || reading || noTash);
    }
    if (SY) { SY.getVoices(); SY.onvoiceschanged = function () {}; }
    on("hbSup", function (e, b) { paint(); togglePop(pop, b); });
    slideFx.push(function (k, ch) { if (ch) stopSpeak(); });
    if (LS.get("hb-notash-" + DECK, "") === "1") setTash(true);
    W.addEventListener("pagehide", stopSpeak);
  })();

  /* لوحة اللون والسُّمك */
  var colPop = mk("div", "hbColPop"); colPop.className = "pop hb-pop"; colPop.dir = RTL ? "rtl" : "ltr"; stop(colPop);
  function paintColPop() {
    var k = tool === "hl" ? "hl" : tool === "text" ? "text" : "pen", list = k === "hl" ? COLORS.hl : COLORS.pen;
    var sizes = k === "hl" ? [20, 34, 52] : k === "text" ? [32, 44, 64] : [3, 6, 11];
    colPop.innerHTML = '<div class="hb-h">' + (k === "hl" ? T("لون قلم التظليل", "Highlighter colour") : k === "text" ? T("لون النص وحجمه", "Text colour & size") : T("لون القلم وسُمكه", "Pen colour & width")) + '</div><div class="hb-sws">' +
      list.map(function (c) { return '<button type="button" data-c="' + c + '" class="' + (c === st[k].c ? "on" : "") + '" style="background:' + c + '" aria-label="' + c + '"></button>'; }).join("") + '</div><div class="hb-szs">' +
      sizes.map(function (w, i) { var d = k === "text" ? 6 + i * 5 : Math.min(22, Math.max(3, w / (k === "hl" ? 2.4 : 1))); return '<button type="button" data-w="' + w + '" class="' + (w === st[k].w ? "on" : "") + '"><span style="width:' + (k === "text" ? 24 : 36) + "px;height:" + d + "px;background:" + st[k].c + (k === "hl" ? ";opacity:.6" : "") + '"></span></button>'; }).join("") + "</div>";
    colPop.querySelectorAll("[data-c]").forEach(function (b) { b.addEventListener("click", function (e) { e.stopPropagation(); st[k].c = b.dataset.c; LS.set("hb-" + (k === "text" ? "tx" : k) + "-c", st[k].c); paintColPop(); updSw(); }); });
    colPop.querySelectorAll("[data-w]").forEach(function (b) { b.addEventListener("click", function (e) { e.stopPropagation(); st[k].w = +b.dataset.w; LS.set("hb-" + (k === "text" ? "tx" : k) + "-w", st[k].w); paintColPop(); }); });
  }
  on("hbCol", function (e, b) { if (!tool || ["pen", "hl", "text"].indexOf(tool) < 0) setTool("pen"); paintColPop(); togglePop(colPop, b); });

  /* مؤشر الليزر */
  var trail = [], raf = 0;
  function laserFrame() {
    raf = 0; lctx.setTransform(1, 0, 0, 1, 0, 0); lctx.clearRect(0, 0, laser.width, laser.height);
    var now = performance.now(); trail = trail.filter(function (p2) { return now - p2.t < 420; });
    if (trail.length) {
      lctx.setTransform(dpr, 0, 0, dpr, 0, 0); lctx.lineCap = "round"; lctx.lineJoin = "round";
      for (var i = 1; i < trail.length; i++) { var a = 1 - (now - trail[i].t) / 420; lctx.strokeStyle = "rgba(255,40,40," + (a * 0.55) + ")"; lctx.lineWidth = 2 + 8 * a; lctx.beginPath(); lctx.moveTo(trail[i - 1].x, trail[i - 1].y); lctx.lineTo(trail[i].x, trail[i].y); lctx.stroke(); }
      var h = trail[trail.length - 1], g = lctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, 18);
      g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.25, "rgba(255,60,60,1)"); g.addColorStop(1, "rgba(255,0,0,0)");
      lctx.fillStyle = g; lctx.beginPath(); lctx.arc(h.x, h.y, 18, 0, 7); lctx.fill();
      raf = requestAnimationFrame(laserFrame);
    }
  }
  /* الكشّاف */
  var spotR = 170, sx0 = innerWidth / 2, sy0 = innerHeight / 2;
  function paintSpot() { spot.style.background = "radial-gradient(circle " + spotR + "px at " + sx0 + "px " + (sy0 - G.top) + "px, rgba(0,0,0,0) 0, rgba(0,0,0,0) " + (spotR - 3) + "px, rgba(5,10,20,.82) " + (spotR + 2) + "px)"; }
  W.addEventListener("pointermove", function (e) {
    if (tool === "laser" && e.clientY > G.top) { trail.push({ x: e.clientX, y: e.clientY - G.top, t: performance.now() }); if (!raf) raf = requestAnimationFrame(laserFrame); }
    if (tool === "spot") { sx0 = e.clientX; sy0 = e.clientY; paintSpot(); }
    if (fs()) { if (e.clientY < 16) showBar(); else if (e.clientY > BARH() + 30) hideBarSoon(); }
  });
  W.addEventListener("pointerleave", function () { trail = []; });

  /* الستارة والسبورة والشاشة السوداء: تُوضع فوق مساحة الشريحة تمامًا */
  var curtY = 0;
  function place() {
    var r = { left: G.x, top: G.top + G.y, width: 1920 * G.k, height: 1080 * G.k };
    var vis = { left: Math.max(r.left, G.ox), top: Math.max(r.top, G.top), right: Math.min(r.left + r.width, G.ox + G.w), bottom: Math.min(r.top + r.height, innerHeight) };
    [board, curt].forEach(function (el) { el.style.left = vis.left + "px"; el.style.top = vis.top + "px"; el.style.width = Math.max(0, vis.right - vis.left) + "px"; el.style.height = Math.max(0, vis.bottom - vis.top) + "px"; });
    var cv = curt.querySelector(".hb-cv"); cv.style.top = (curtY * (vis.bottom - vis.top)) + "px";
    applyPaper(vis);
    if (tool === "spot") paintSpot();
  }
  var ch = curt.querySelector(".hb-ch"), drag = null;
  ch.addEventListener("pointerdown", function (e) { e.preventDefault(); e.stopPropagation(); drag = { y: e.clientY, v: curtY }; ch.setPointerCapture(e.pointerId); });
  ch.addEventListener("pointermove", function (e) { if (!drag) return; var h = curt.offsetHeight || 1; curtY = Math.max(0, Math.min(1, drag.v + (e.clientY - drag.y) / h)); place(); });
  ch.addEventListener("pointerup", function () { drag = null; if (curtY > 0.97) { curt.classList.remove("on"); $("hbCurt").classList.remove("on"); } });
  curt.addEventListener("click", function (e) { e.stopPropagation(); });
  curt.querySelector(".hb-cv").addEventListener("dblclick", function () { curtY = Math.min(1, curtY + 0.2); place(); });
  on("hbCurt", function (e, b) { var o = !curt.classList.contains("on"); curtY = 0; curt.classList.toggle("on", o); b.classList.toggle("on", o); place(); if (o) say(T("اسحب المقبض الذهبي إلى الأسفل لكشف الشريحة", "Drag the gold handle down to reveal")); });
  var toggleBoard = function () { var o = !board.classList.contains("on"); board.classList.toggle("on", o); $("hbBoard").classList.toggle("on", o); if (o && tool !== "pen" && tool !== "hl" && tool !== "text") setTool("pen"); place(); redraw(); say(o ? T("السبورة البيضاء: اكتب بالقلم · كتابتها محفوظة حتى تغلق العرض", "Whiteboard: write with the pen") : T("عدت إلى الشريحة", "Back to the slide")); };
  on("hbBoard", toggleBoard);
  /* ---------- ورق السبورة: يُرسم بوحدات الشريحة (1920×1080) فيتبع التكبير ويطابق التصدير ---------- */
  var PAPERS = [["grid", "▦", T("مربعات", "Grid")], ["plain", "▢", T("أبيض", "Plain")], ["ar4", "☰", T("أربعة خطوط (للكتابة العربية)", "Four lines (Arabic writing)")], ["ruled", "≡", T("سطور", "Ruled")], ["big", "▩", T("مربعات كبيرة", "Large squares")], ["graph", "▥", T("ورق بياني", "Graph paper")]];
  var paper = LS.get("hb-paper", "grid"); if (!PAPERS.some(function (p) { return p[0] === paper; })) paper = "grid";
  function paperCss(id, u) {
    var L = "rgba(16,42,76,.11)", M = "rgba(16,42,76,.26)", R = "rgba(200,60,60,.6)", s = function (n) { return Math.max(1, n * u).toFixed(2); };
    var g1 = function (c, w) { return "linear-gradient(" + c + " " + w + "px,transparent " + w + "px)"; }, g2 = function (c, w) { return "linear-gradient(90deg," + c + " " + w + "px,transparent " + w + "px)"; };
    if (id === "plain") return { img: "none", size: "auto" };
    if (id === "grid") return { img: g1(L, 1) + "," + g2(L, 1), size: s(40) + "px " + s(40) + "px" };
    if (id === "big") return { img: g1(M, 1.5) + "," + g2(M, 1.5), size: s(90) + "px " + s(90) + "px" };
    if (id === "graph") return { img: g1(M, 1.5) + "," + g2(M, 1.5) + "," + g1(L, 1) + "," + g2(L, 1), size: s(100) + "px " + s(100) + "px," + s(100) + "px " + s(100) + "px," + s(20) + "px " + s(20) + "px," + s(20) + "px " + s(20) + "px" };
    if (id === "ruled") { var h = 72 * u; return { img: "linear-gradient(to bottom,transparent " + (h - 2) + "px," + M + " " + (h - 2) + "px," + M + " " + h + "px)", size: "100% " + h + "px" }; }
    /* أربعة خطوط: ثلاثة خطوط رمادية وخط أساس أحمر في الثالث */
    var n = function (v) { return (v * u).toFixed(2) + "px"; };
    return { img: "linear-gradient(to bottom,transparent " + n(38) + "," + L + " " + n(38) + "," + L + " " + n(40) + ",transparent " + n(40) + ",transparent " + n(78) + "," + L + " " + n(78) + "," + L + " " + n(80) + ",transparent " + n(80) + ",transparent " + n(118) + "," + R + " " + n(118) + "," + R + " " + n(121) + ",transparent " + n(121) + ",transparent " + n(158) + "," + L + " " + n(158) + "," + L + " " + n(160) + ",transparent " + n(160) + ",transparent " + n(220) + ")", size: "100% " + n(220) };
  }
  function applyPaper(vis) {
    if (!PAPERS) return;
    var c = paperCss(paper, G.k), bx = (G.x - vis.left), by = (G.top + G.y - vis.top);
    board.style.backgroundImage = c.img; board.style.backgroundSize = c.size; board.style.backgroundPosition = bx + "px " + by + "px";
  }
  var paperPop = mk("div", "hbPaperPop"); paperPop.className = "pop hb-pop"; paperPop.dir = RTL ? "rtl" : "ltr"; stop(paperPop);
  function paintPaperPop() {
    paperPop.innerHTML = '<div class="hb-h">📄 ' + T("ورق السبورة", "Board paper") + '</div><div class="hb-papers">' + PAPERS.map(function (p) { return '<button type="button" class="hb-btn' + (p[0] === paper ? " pri" : "") + '" data-p="' + p[0] + '"><span aria-hidden="true">' + p[1] + "</span> " + p[2] + "</button>"; }).join("") + "</div>";
  }
  paperPop.addEventListener("click", function (e) {
    var b = e.target.closest("[data-p]"); if (!b) return;
    paper = b.dataset.p; LS.set("hb-paper", paper); paintPaperPop(); place(); say(T("تغيّر الورق", "Paper changed"));
  });
  on("hbPaper", function (e, b) { paintPaperPop(); if (!board.classList.contains("on")) toggleBoard(); togglePop(paperPop, b); });
  var toggleBlack = function () { var o = !black.classList.contains("on"); black.classList.toggle("on", o); $("hbBlack").classList.toggle("on", o); };
  on("hbBlack", toggleBlack); black.addEventListener("click", function (e) { e.stopPropagation(); toggleBlack(); });

  /* ---------- لوحة المفاتيح ---------- */
  W.addEventListener("keydown", function (e) {
    var tag = (e.target && e.target.tagName) || ""; if (/INPUT|TEXTAREA|SELECT/.test(tag) || (e.target && e.target.isContentEditable)) return;
    if ($("bE") && $("bE").classList.contains("on")) return;
    var k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && k === "z") { e.preventDefault(); $("hbUndo").click(); return; }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (k === "p") setTool("pen"); else if (k === "h") setTool("hl"); else if (k === "l") setTool("laser"); else if (k === "s") setTool("spot");
    else if (k === "w") toggleBoard(); else if (k === "b" || k === ".") toggleBlack();
    else if (k === "escape") { if (black.classList.contains("on")) toggleBlack(); else if (board.classList.contains("on")) toggleBoard(); else if (tool) setTool(null); closePops(); }
    else if ((k === "+" || k === "=")) setZoom(Z * 1.25); else if (k === "-") setZoom(Z / 1.25); else if (k === "0") setZoom(1);
  });

  /* ---------- ملء الشاشة: يختفي الشريط ويظهر عند الاقتراب من أعلى الشاشة ---------- */
  var awayT;
  function showBar() { tb.classList.remove("hb-away"); clearTimeout(awayT); }
  function hideBarSoon() { clearTimeout(awayT); if (!fs() || tb.matches(":hover") || pops().some(function (p) { return p.style.display === "block"; })) return; awayT = setTimeout(function () { if (fs() && !tb.matches(":hover")) tb.classList.add("hb-away"); }, 1600); }
  D.addEventListener("fullscreenchange", function () {
    var f = fs(); $("hbF").querySelector(".hb-lbl").textContent = f ? T("إنهاء ملء الشاشة", "Exit full screen") : T("ملء الشاشة", "Full screen");
    zone.style.display = f ? "block" : "none"; if (f) { hideBarSoon(); say(T("حرّك المؤشر إلى أعلى الشاشة لإظهار الشريط", "Move to the top edge to show the toolbar")); } else showBar();
    setTimeout(fit, 60);
  });
  zone.addEventListener("pointerenter", showBar);
  tb.addEventListener("pointerleave", function () { if (fs()) hideBarSoon(); });

  /* ======================================================================
     المشاركة المباشرة: الطلاب يدخلون برمز ويجيبون من أجهزتهم، وتظهر الإجابات فورًا،
     ويُحفظ تقييمهم لمعايير النجاح قبل الدرس وبعده في «تقرير الحصة».
     ====================================================================== */
  if (LIVE) (function () {
    var sb = HX.sb, S = null, players = [], answers = [], chans = [], pollT = 0, refT = 0, minimized = false, big = false, pick = null;
    var KEY = "hb-live-" + DECK;
    var FACES = [["😟", T("لم أتعلّمه بعد", "Not yet"), "#F28B82"], ["😐", T("أعرف قليلًا", "A little"), "#FFD25C"], ["😊", T("أستطيع وحدي", "I can do it"), "#7BCB8A"]];
    var COLS = ["#E53B3B", "#1F6FD1", "#E0A100", "#2E9E6A", "#8A3FFC", "#F0962E"], SH = ["▲", "◆", "●", "■", "★", "⬟"];
    var TYPES = { mc: T("اختيار من متعدد", "Multiple choice"), tf: T("صح أم خطأ", "True or false"), word: T("كلمة واحدة", "One word"), scale: T("مدى الفهم", "Understanding check"), rate: T("قياس التقدّم", "Progress check"), draw: T("ارسم إجابتك", "Draw your answer"), exit: T("بطاقة الخروج", "Exit ticket") };
    /* رسم الطالب: خطوط مختصرة [لون، سُمك، "x,y x,y"] على لوحة 400×300 — يُتحقّق من كل قيمة قبل عرضها */
    var DCOL = ["#1F2A3C", "#E53B3B", "#1F6FD1", "#2E9E6A", "#E0A100", "#8A3FFC"];
    var drawSvg = function (d, cls) { var L = Array.isArray(d) ? d : []; return '<svg class="' + (cls || "") + '" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#fff"/>' + L.slice(0, 400).map(function (st) { if (!Array.isArray(st) || typeof st[2] !== "string" || !/^[\d ,]*$/.test(st[2])) return ""; var c = DCOL[(st[0] | 0) % 6] || DCOL[0], w = Math.max(1, Math.min(24, st[1] | 0)); var pts = st[2].trim(); if (pts && pts.indexOf(" ") < 0) pts += " " + pts; return '<polyline points="' + pts + '" fill="none" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>'; }).join("") + "</svg>"; };
    var showNames = false, bigDraw = mk("div", "hbDrawBig"); stop(bigDraw);
    function openDraw(a) {
      bigDraw.innerHTML = '<div class="hb-dbx">' + drawSvg(a.answer && a.answer.d) + '<div class="hb-dbf"><b>' + (showNames ? esc(nickOf(a.player_id)) : T("رسم أحد الطلاب", "A student's drawing")) + '</b><button type="button" id="hbDbN">' + (showNames ? T("أخفِ الاسم", "Hide name") : T("أظهر الاسم", "Show name")) + '</button><button type="button" id="hbDbX">✕ ' + T("إغلاق", "Close") + "</button></div></div>";
      bigDraw.classList.add("on");
      $("hbDbX").onclick = function () { bigDraw.classList.remove("on"); };
      $("hbDbN").onclick = function () { showNames = !showNames; openDraw(a); paintRes(); };
    }
    bigDraw.addEventListener("click", function (e) { if (e.target === bigDraw) bigDraw.classList.remove("on"); });
    var btnLive = $("hbLive"), btnAsk = $("hbAsk"), badge = $("hbLiveN");
    W.__hbLiveId = function () { return S && S.state !== "done" ? S.id : null; };
    W.__hbLiveInfo = function () { return { on: !!(S && S.state !== "done"), players: players.length, answered: answers.length, q: !!(S && S.q && S.state === "open") }; };
    /* شرائح «قياس التقدّم» في العرض: أولاها قبل الدرس وثانيتها بعده */
    var PR = SL.map(function (s, i) { return { i: i, rows: [].slice.call(s.querySelectorAll(".pr")).map(function (r) { return { v: ((r.querySelector(".vb") || {}).textContent || "").trim(), p: ((r.querySelector("p") || {}).textContent || "").trim() }; }) }; }).filter(function (x) { return x.rows.length; });
    var css2 = D.createElement("style");
    css2.textContent = [
      "#tb.hb .hb-badge{min-width:20px;height:20px;padding:0 6px;border-radius:99px;background:#2E9E5B;color:#fff;font:700 12px 'Thmanyah Text',Tahoma,sans-serif;display:inline-flex;align-items:center;justify-content:center}",
      "#tb.hb .hb-badge[hidden],#tb.hb [hidden]{display:none!important}",
      "#tb.hb .hb-livebtn.act{background:rgba(46,158,91,.22);box-shadow:inset 0 0 0 1.5px #49C27A}",
      "#tb.hb .hb-askbtn{background:#2E9E5B;color:#fff;font-weight:700}",
      "#tb.hb .hb-askbtn:hover{background:#38B26A}",
      ".pop.hb-pop.hb-wide{min-width:min(92vw,460px);max-width:min(94vw,520px)}",
      ".hb-pop p{margin:0 0 10px;line-height:1.7;font-size:15px}",
      ".hb-join{display:flex;gap:16px;align-items:center;margin:6px 0 10px}",
      ".hb-qr{flex:none;width:150px;height:150px;border-radius:14px;background:#fff;padding:8px;box-shadow:0 0 0 1.5px #E5DCC8;display:flex;align-items:center;justify-content:center}",
      ".hb-qr img,.hb-qr canvas{width:100%!important;height:100%!important}",
      ".hb-code{font:800 40px/1.1 ui-monospace,'SF Mono',Menlo,monospace;letter-spacing:.08em;color:#102A4C;direction:ltr;text-align:start}",
      ".hb-url{font:600 14px 'Thmanyah Text',Tahoma,sans-serif;color:#1E6BC2;direction:ltr;unicode-bidi:isolate}",
      ".hb-names{display:flex;flex-wrap:wrap;gap:6px;max-height:120px;overflow:auto;margin:6px 0}",
      ".hb-cls{background:#F4F7FB;border-radius:12px;padding:10px 12px;margin:8px 0}.hb-cls label{font-weight:800;display:block;margin-bottom:6px}.hb-cls[hidden]{display:none}.hb-sel2{width:100%;font:inherit;font-size:14.5px;padding:8px 10px;border:1px solid #CBD5E1;border-radius:10px;background:#fff;color:#102A4C}",
      ".hb-ros{background:#F4F7FB;border-radius:12px;padding:10px 12px;margin:6px 0}.hb-rosh{font-weight:700}.hb-link{display:flex;align-items:center;gap:8px;margin-top:6px}.hb-link span{flex:1;font-weight:600}.hb-link select{font:inherit;font-size:13px;padding:4px 8px;border-radius:8px;border:1px solid #CBD5E1}",
      ".hb-names span{background:#EEF6F1;color:#1B6B3A;border-radius:99px;padding:3px 10px;font:600 13px 'Thmanyah Text',Tahoma,sans-serif;animation:hbPop .35s ease}",
      "@keyframes hbPop{from{transform:scale(.6);opacity:0}}",
      ".hb-tiles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:10px 0}",
      ".hb-tiles button{all:unset;box-sizing:border-box;cursor:pointer;border:1.5px solid #E5DCC8;border-radius:14px;padding:10px 12px;background:#FBF7EF;display:flex;flex-direction:column;gap:2px;font:700 15px 'Thmanyah Text',Tahoma,sans-serif;color:#1F2A3C}",
      ".hb-tiles button small{font-weight:500;font-size:12.5px;color:#6B7280}",
      ".hb-tiles button:hover{border-color:#2E9E5B;background:#F1FAF4}",
      ".hb-tiles button.wide{grid-column:1/-1}",
      ".hb-mced{display:flex;flex-direction:column;gap:6px;margin-top:6px}",
      ".hb-mced div{display:flex;gap:6px;align-items:center}",
      ".hb-mced i{font-style:normal;flex:none;width:30px;height:30px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;color:#fff;font-weight:700}",
      ".hb-seg{display:inline-flex;border:1.5px solid #E5DCC8;border-radius:12px;overflow:hidden}",
      ".hb-seg button{all:unset;cursor:pointer;padding:6px 12px;font:600 14px 'Thmanyah Text',Tahoma,sans-serif;color:#1F2A3C}",
      ".hb-seg button.on{background:#102A4C;color:#fff}",
      /* لوحة النتائج المباشرة */
      "#hbResP{position:fixed;top:calc(var(--hb-lay) + 12px);" + (RTL ? "left" : "right") + ":14px;width:min(430px,44vw);max-height:calc(100% - var(--hb-lay) - 24px);z-index:13;background:#fff;border-radius:20px;box-shadow:0 18px 50px rgba(8,16,30,.35);display:none;flex-direction:column;overflow:hidden;font-family:'Thmanyah Text',Tahoma,sans-serif;color:#1F2A3C;direction:" + (RTL ? "rtl" : "ltr") + "}",
      "#hbResP.on{display:flex}",
      "#hbResP.big{top:calc(var(--hb-lay) + 3vh);left:50%;right:auto;transform:translateX(-50%);width:min(1100px,90vw);max-height:calc(100% - var(--hb-lay) - 6vh)}",
      "#hbResP.mini .hb-rb,#hbResP.mini .hb-ra,#hbResP.mini .hb-rq{display:none}",
      "#hbResP .hb-rh{display:flex;align-items:center;gap:8px;padding:12px 14px;background:#102A4C;color:#fff}",
      "#hbResP .hb-rh b{font-size:16px;flex:1 1 auto;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
      "#hbResP .hb-rh .dot{width:9px;height:9px;border-radius:50%;background:#49C27A;box-shadow:0 0 0 0 rgba(73,194,122,.6);animation:hbBeat 1.4s infinite;flex:none}",
      "#hbResP.closed .hb-rh .dot{background:#F0962E;animation:none}",
      "@keyframes hbBeat{70%{box-shadow:0 0 0 8px rgba(73,194,122,0)}}",
      "#hbResP .hb-rh .cnt{font-size:14px;background:rgba(255,255,255,.14);border-radius:99px;padding:3px 10px;white-space:nowrap}",
      "#hbResP .hb-rh button{all:unset;cursor:pointer;width:30px;height:30px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;font-size:16px}",
      "#hbResP .hb-rh button:hover{background:rgba(255,255,255,.14)}",
      "#hbResP .hb-rq{padding:12px 16px 0;font-weight:700;font-size:17px;line-height:1.6}",
      "#hbResP.big .hb-rq{font-size:26px}",
      "#hbResP .hb-rb{padding:14px 16px;overflow:auto;display:flex;flex-direction:column;gap:10px}",
      "#hbResP .hb-ra{display:flex;flex-wrap:wrap;gap:8px;padding:12px 16px;border-top:1px solid #EFE6D4;background:#FBF7EF}",
      "#hbResP .hb-ra button{font:600 14px 'Thmanyah Text',Tahoma,sans-serif;border:1.5px solid #E5DCC8;background:#fff;border-radius:12px;padding:7px 12px;cursor:pointer;color:#1F2A3C}",
      "#hbResP .hb-ra button.pri{background:#2E9E5B;border-color:#2E9E5B;color:#fff}",
      "#hbResP .hb-ra button[disabled]{opacity:.4;pointer-events:none}",
      "#hbResP .hb-bar{all:unset;box-sizing:border-box;cursor:pointer;display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1.6fr) 40px;align-items:center;gap:10px;padding:6px 8px;border-radius:12px;border:2px solid transparent}",
      "#hbResP .hb-bar:hover{background:#F7F4EC}",
      "#hbResP .hb-bar.ok{border-color:#2E9E5B;background:#EAF7EF}",
      ".hb-qzb{display:block;width:100%;margin-top:10px;font-weight:800;font-size:15px;font-family:inherit;padding:11px;border:0;border-radius:12px;background:linear-gradient(90deg,#D4AA55,#F0C977);color:#1B1405;cursor:pointer}.hb-qzb small{font-weight:600}",
      ".hb-qzs{margin-top:10px}.hb-qzl{max-height:200px;overflow:auto;margin:8px 0;border:1px solid #E6EBF2;border-radius:10px;padding:4px 10px}.hb-qzl .hb-ck{font-size:13.5px;align-items:flex-start}.hb-qzl span{line-height:1.5}",
      "#hbQuiz{position:fixed;left:0;right:0;top:var(--hb-lay);bottom:0;z-index:32;display:none;flex-direction:column;padding:2.2vh 3vw;box-sizing:border-box;background:radial-gradient(1200px 600px at 80% -10%,#2A4F86,transparent 60%),linear-gradient(160deg,#0F2340,#1B1240);color:#fff;font-family:'Thmanyah Text',Tahoma,sans-serif;overflow:hidden}#hbQuiz.on{display:flex}",
      ".qz-top{display:flex;align-items:center;gap:12px}.qz-n{font-weight:800;font-size:clamp(16px,1.6vw,24px);font-family:inherit;background:rgba(255,255,255,.12);padding:6px 16px;border-radius:99px}.qz-sp{flex:1}.qz-x{font-weight:600;font-size:14px;font-family:inherit;background:transparent;color:rgba(255,255,255,.7);border:1px solid rgba(255,255,255,.3);border-radius:10px;padding:6px 12px;cursor:pointer}",
      ".qz-q{margin:2.5vh auto 1vh;max-width:1400px;text-align:center;font:800 clamp(26px,3.4vw,58px)/1.35 'Thmanyah Display','Thmanyah Text',Tahoma,sans-serif;background:#fff;color:#102A4C;border-radius:22px;padding:2.2vh 3vw;box-shadow:0 20px 50px rgba(0,0,0,.35)}.qz-q.sm{font-size:clamp(20px,2.2vw,36px)}",
      ".qz-mid{display:flex;align-items:center;justify-content:center;gap:6vw;margin:1.5vh 0}.qz-ring{--p:1;width:clamp(90px,10vw,150px);aspect-ratio:1;border-radius:50%;display:grid;place-items:center;background:conic-gradient(#F0C977 calc(var(--p)*360deg),rgba(255,255,255,.14) 0);transition:--p .2s}.qz-ring b{width:78%;aspect-ratio:1;border-radius:50%;background:#14284A;display:grid;place-items:center;font:900 clamp(32px,3.6vw,60px) ui-rounded,Tahoma,sans-serif}",
      ".qz-cnt{text-align:center}.qz-cnt b{display:block;font:900 clamp(40px,4.4vw,72px)/1 ui-rounded,Tahoma,sans-serif}.qz-cnt span{opacity:.8;font-size:clamp(14px,1.3vw,20px)}",
      ".qz-opts{display:grid;grid-template-columns:1fr 1fr;gap:1.6vh 1.4vw;margin-top:auto}.qz-o{display:flex;align-items:center;gap:1vw;background:var(--c);border-radius:16px;padding:2.2vh 1.6vw;font:800 clamp(20px,2.2vw,38px) 'Thmanyah Text',Tahoma,sans-serif;box-shadow:0 6px 0 rgba(0,0,0,.25)}.qz-o i{font-style:normal;width:1.6em;height:1.6em;border-radius:12px;background:rgba(0,0,0,.18);display:grid;place-items:center;flex:none}",
      ".qz-row{display:flex;justify-content:center;gap:12px;margin-top:2vh}.qz-btn{font-weight:800;font-size:clamp(16px,1.4vw,22px);font-family:inherit;border:0;border-radius:14px;padding:1.4vh 2.4vw;cursor:pointer;background:rgba(255,255,255,.14);color:#fff}.qz-btn.pri{background:#D4AA55;color:#1B1405;box-shadow:0 5px 0 #9C7A2E}",
      ".qz-bars{flex:1;display:flex;align-items:flex-end;justify-content:center;gap:2.4vw;min-height:0;margin-top:2vh}.qz-bar{flex:0 1 220px;height:100%;display:flex;flex-direction:column;align-items:center}.qz-col{flex:1;width:100%;display:flex;flex-direction:column;justify-content:flex-end;align-items:center}.qz-col span{font:900 clamp(24px,2.6vw,44px) ui-rounded,Tahoma,sans-serif;margin-bottom:6px}.qz-col i{display:block;width:100%;background:var(--c);border-radius:12px 12px 0 0;animation:qzGrow .7s ease both}.qz-bar.no{opacity:.45}.qz-bar p{margin:8px 0 0;text-align:center;font-weight:700;font-size:clamp(15px,1.5vw,24px);font-family:inherit;}",
      "@keyframes qzGrow{from{height:0!important}}.qz-fast{text-align:center;font-size:clamp(16px,1.6vw,26px);margin:1.5vh 0 0}",
      ".qz-h{text-align:center;font:900 clamp(28px,3vw,50px) 'Thmanyah Display',Tahoma,sans-serif;margin:3vh 0 2vh}.qz-lb{display:flex;flex-direction:column;gap:1.2vh;max-width:1000px;width:100%;margin:0 auto}.qz-li{position:relative;display:flex;align-items:center;gap:1.4vw;padding:1.6vh 1.6vw;border-radius:16px;background:rgba(255,255,255,.08);overflow:hidden;font-size:clamp(18px,2vw,32px);animation:hbPopIn .5s both}.qz-li::before{content:'';position:absolute;inset-block:0;inset-inline-start:0;width:var(--w);background:linear-gradient(90deg,rgba(212,170,85,.45),rgba(212,170,85,.15));z-index:0}.qz-li>*{position:relative}.qz-li b{width:1.8em;height:1.8em;border-radius:50%;background:#D4AA55;color:#1B1405;display:grid;place-items:center}.qz-li span{flex:1;font-weight:800}.qz-li em{font-style:normal;font-weight:900;font-variant-numeric:tabular-nums}.qz-li small.up{color:#7CF29C}.qz-li small.dn{color:#FF9A9A}.qz-empty{text-align:center;opacity:.8;font-size:22px}",
      ".qz-pod{flex:1;display:flex;align-items:flex-end;justify-content:center;gap:1.5vw;margin-top:3vh}.qz-p{display:flex;flex-direction:column;align-items:center;width:min(22vw,300px)}.qz-p b{font-weight:900;font-size:clamp(20px,2.4vw,40px);font-family:inherit;margin:6px 0 2px;text-align:center}.qz-p em{font-style:normal;opacity:.85;font-size:clamp(16px,1.6vw,26px);margin-bottom:10px}.qz-medal{font-size:clamp(46px,5vw,90px);animation:hbPopIn .6s both}.qz-step{width:100%;border-radius:16px 16px 0 0;background:linear-gradient(#D4AA55,#9C7A2E);display:grid;place-items:center;font:900 clamp(40px,5vw,90px) ui-rounded,Tahoma,sans-serif;color:#1B1405;animation:qzGrow .9s ease both}.p1 .qz-step{height:34vh}.p2 .qz-step{height:24vh;background:linear-gradient(#DCE3EC,#8E9AAD)}.p3 .qz-step{height:17vh;background:linear-gradient(#E8A87C,#A0612F)}.qz-p.none{visibility:hidden}.qz-rest{text-align:center;opacity:.85;font-size:clamp(14px,1.3vw,20px)}",
      ".qz-conf{position:absolute;inset:0;pointer-events:none;overflow:hidden}.qz-conf i{position:absolute;top:-20px;left:var(--x);width:10px;height:16px;background:var(--c);border-radius:2px;animation:qzFall var(--d) linear var(--dl) infinite}@keyframes qzFall{to{transform:translateY(110vh) rotate(720deg)}}",
      ".hb-exit h4{margin:10px 0 4px;font-size:14px;color:#102A4C}.hb-eq{margin:0;padding-inline-start:18px;max-height:150px;overflow:auto;font-size:14px;line-height:1.7}",
      ".hb-dtop{display:flex;align-items:center;gap:10px;margin-bottom:8px}.hb-dgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px;max-height:52vh;overflow:auto}#hbResP.big .hb-dgrid{grid-template-columns:repeat(auto-fill,minmax(220px,1fr));max-height:none}",
      ".hb-dcard{padding:0;border:2px solid #E6EBF2;border-radius:12px;background:#fff;overflow:hidden;cursor:zoom-in;display:flex;flex-direction:column}.hb-dcard:hover{border-color:#D4AA55}.hb-dcard svg{display:block;width:100%;height:auto}.hb-dcard span{font-size:12.5px;font-weight:700;padding:3px;color:#102A4C}",
      "#hbDrawBig{position:fixed;inset:0;z-index:60;display:none;align-items:center;justify-content:center;background:rgba(5,10,20,.82)}#hbDrawBig.on{display:flex}.hb-dbx{width:min(88vw,calc(78vh * 4 / 3));background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.5)}.hb-dbx svg{display:block;width:100%;height:auto}.hb-dbf{display:flex;align-items:center;gap:10px;padding:10px 16px;background:#0F2340;color:#fff;font-family:'Thmanyah Text',Tahoma,sans-serif}.hb-dbf b{flex:1;font-size:20px}.hb-dbf button{font-family:inherit;font-size:14px;border:1px solid rgba(255,255,255,.3);background:transparent;color:#fff;border-radius:10px;padding:6px 12px;cursor:pointer}",
      "#hbAskPop{max-height:calc(100vh - var(--hb-h) - 24px);overflow:auto}",
      ".hb-sq{margin-top:10px;border:1px solid #E7D9B8;background:#FFFBF2;border-radius:14px;padding:10px 12px}.hb-sqh{font-weight:800;color:#102A4C;margin-bottom:6px}.hb-sqh small{font-weight:500;color:#7A8698;margin-inline-start:6px}",
      ".hb-sqi{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:8px 0;border-top:1px dashed #E7D9B8}.hb-sqi:first-of-type{border-top:0}.hb-sqt{flex:1 1 220px;cursor:text;font-weight:600;line-height:1.6}.hb-sqt small{display:block;font-weight:500;color:#6B7280;font-size:12.5px}",
      ".hb-sqb{display:flex;gap:6px;flex-wrap:wrap}.hb-sqb .hb-btn{padding:6px 10px;font-size:13px}.hb-sqi.sent .hb-sqt{color:#1B6B3A}",
      "#hbResP .hb-bar .lab{display:flex;align-items:center;gap:8px;font-weight:700;font-size:15px;min-width:0}",
      "#hbResP .hb-bar .lab i{font-style:normal;flex:none;width:28px;height:28px;border-radius:8px;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:14px}",
      "#hbResP .hb-bar .lab span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      "#hbResP .hb-bar .trk{height:22px;border-radius:99px;background:#F1EDE4;overflow:hidden}",
      "#hbResP .hb-bar .fil{height:100%;border-radius:99px;transition:width .5s cubic-bezier(.2,.8,.2,1);min-width:2px}",
      "#hbResP .hb-bar b{font-size:18px;text-align:center}",
      "#hbResP.big .hb-bar{padding:10px}#hbResP.big .hb-bar .lab{font-size:22px}#hbResP.big .hb-bar .trk{height:34px}#hbResP.big .hb-bar b{font-size:26px}",
      "#hbResP .hb-cloud{display:flex;flex-wrap:wrap;gap:6px 16px;justify-content:center;align-items:center;padding:10px 4px;min-height:120px}",
      "#hbResP .hb-cloud span{font-weight:800;line-height:1.15;animation:hbPop .4s ease}",
      "#hbResP .hb-scale{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;align-items:end;height:220px}",
      "#hbResP.big .hb-scale{height:46vh}",
      "#hbResP .hb-scale div{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;gap:6px}",
      "#hbResP .hb-scale i{display:block;width:70%;border-radius:12px 12px 4px 4px;transition:height .5s cubic-bezier(.2,.8,.2,1);min-height:4px}",
      "#hbResP .hb-scale b{font-size:20px}#hbResP .hb-scale span{font-size:30px}#hbResP .hb-scale small{font-size:13px;color:#6B7280;text-align:center}",
      "#hbResP .hb-rr{display:flex;flex-direction:column;gap:5px}",
      "#hbResP .hb-rr p{margin:0;font-size:14px;font-weight:700;line-height:1.5}",
      "#hbResP.big .hb-rr p{font-size:20px}",
      "#hbResP .hb-stk{display:flex;height:22px;border-radius:99px;overflow:hidden;background:#F1EDE4}",
      "#hbResP.big .hb-stk{height:32px}",
      "#hbResP .hb-stk i{display:flex;align-items:center;justify-content:center;font:700 12px 'Thmanyah Text',Tahoma,sans-serif;color:#1F2A3C;transition:width .5s;overflow:hidden;white-space:nowrap}",
      "#hbResP .hb-delta{font-size:12.5px;color:#1B6B3A;font-weight:700}",
      "#hbResP .hb-hint{font-size:13px;color:#6B7280;margin:0}",
      "#hbResP .hb-wait{padding:16px;text-align:center;color:#6B7280}",
      /* رمز الدخول على الشاشة كلها */
      "#hbJoinBig{position:fixed;left:0;right:0;top:var(--hb-lay);bottom:0;z-index:14;display:none;align-items:center;justify-content:center;gap:6vw;background:radial-gradient(900px 500px at 80% 0%,#1E4E86,transparent 70%),#0F2340;color:#fff;font-family:'Thmanyah Text',Tahoma,sans-serif;direction:" + (RTL ? "rtl" : "ltr") + ";padding:4vh 5vw;box-sizing:border-box}",
      "#hbJoinBig.on{display:flex}",
      "#hbJoinBig .q{flex:none;width:min(34vw,52vh);aspect-ratio:1;background:#fff;border-radius:28px;padding:18px;box-sizing:border-box}",
      "#hbJoinBig .q img,#hbJoinBig .q canvas{width:100%!important;height:100%!important}",
      "#hbJoinBig h2{font:700 clamp(24px,3vw,44px) 'Thmanyah Display','Thmanyah Text',Tahoma,sans-serif;margin:0 0 2vh}",
      "#hbJoinBig .u{font:700 clamp(18px,2vw,30px) 'Thmanyah Text',Tahoma,sans-serif;color:#F0C977;direction:ltr;unicode-bidi:isolate}",
      "#hbJoinBig .c{font:800 clamp(56px,9vw,150px)/1 ui-monospace,Menlo,monospace;letter-spacing:.06em;margin:2vh 0;direction:ltr;text-align:start}",
      "#hbJoinBig .n{font:600 clamp(16px,1.6vw,24px) 'Thmanyah Text',Tahoma,sans-serif;opacity:.9}",
      "#hbJoinBig .nm{display:flex;flex-wrap:wrap;gap:8px;margin-top:2vh;max-height:22vh;overflow:hidden}",
      "#hbJoinBig .nm span{background:rgba(255,255,255,.12);border-radius:99px;padding:5px 14px;font:600 clamp(14px,1.3vw,20px) 'Thmanyah Text',Tahoma,sans-serif;animation:hbPop .4s ease}",
      "#hbJoinBig button{margin-top:3vh;font:700 20px 'Thmanyah Text',Tahoma,sans-serif;background:#D4AA55;color:#1B1405;border:0;border-radius:16px;padding:12px 28px;cursor:pointer}",
      "#hbChip{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:13;display:none;align-items:center;gap:10px;background:#2E9E5B;color:#fff;border:0;border-radius:99px;padding:11px 20px;font:700 16px 'Thmanyah Text',Tahoma,sans-serif;cursor:pointer;box-shadow:0 10px 30px rgba(46,158,91,.45);animation:hbPop .4s ease}",
      "#hbChip.on{display:inline-flex}"
    ].join("\n");
    D.head.appendChild(css2);

    var joinUrl = function () { return HX.joinUrl + "?code=" + (S ? S.code : ""); };
    var shortUrl = function () { return String(HX.joinUrl).replace(/^https?:\/\//, "").replace(/\/?#\/live$/, ""); };
    var code3 = function (c) { return String(c).slice(0, 3) + " " + String(c).slice(3); };
    var loadQr = function () { return W.QRCode ? Promise.resolve(W.QRCode) : new Promise(function (res, rej) { var sc = D.createElement("script"); sc.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"; sc.onload = function () { res(W.QRCode); }; sc.onerror = rej; D.head.appendChild(sc); }); };
    W.__hbQr = function (el, size, text) { loadQr().then(function (Q) { el.innerHTML = ""; new Q(el, { text: text, width: size, height: size, colorDark: "#0A1D36", colorLight: "#ffffff", correctLevel: Q.CorrectLevel.M }); }).catch(function () { el.textContent = T("تعذّر تحميل الرمز", "QR unavailable"); }); };
    var qrInto = function (el, size) { loadQr().then(function (Q) { el.innerHTML = ""; new Q(el, { text: joinUrl(), width: size, height: size, colorDark: "#0A1D36", colorLight: "#ffffff", correctLevel: Q.CorrectLevel.M }); }).catch(function () { el.innerHTML = '<small style="color:#6B7280">QR</small>'; }); };

    /* ---------- الجلسة ---------- */
    var sharePop = mk("div", "hbSharePop"); sharePop.className = "pop hb-pop hb-wide"; sharePop.dir = RTL ? "rtl" : "ltr"; stop(sharePop);
    var askPop = mk("div", "hbAskPop"); askPop.className = "pop hb-pop hb-wide"; askPop.dir = RTL ? "rtl" : "ltr"; stop(askPop);
    var resP = mk("div", "hbResP"), joinBig = mk("div", "hbJoinBig"), chip = mk("button", "hbChip");
    chip.type = "button"; resP.addEventListener("click", function (e) { e.stopPropagation(); }); joinBig.addEventListener("click", function (e) { e.stopPropagation(); });
    function setActive() {
      var on = !!(S && S.state !== "done");
      btnLive.classList.toggle("act", on); btnAsk.hidden = !on; badge.hidden = !on; badge.textContent = players.length;
      if (!on) { resP.classList.remove("on"); chip.classList.remove("on"); joinBig.classList.remove("on"); }
    }
    function names(max) { return players.slice(-(max || 200)).map(function (p) { return "<span>" + esc(p.nick) + "</span>"; }).join(""); }
    function paintShare() {
      if (!S || S.state === "done") {
        sharePop.innerHTML = '<div class="hb-h">📲 ' + T("شارك الطلاب في العرض", "Let students join the presentation") + '</div><p>' + T("يدخل الطلاب من الجوال أو الآيباد برمز من 6 أرقام. تسأل الصف من الشريط فيجيبون من أجهزتهم، وتظهر الإجابات هنا فورًا. وتقييمهم لمعايير النجاح قبل الدرس وبعده يُحفظ في «تقرير الحصة».", "Students join from a phone or iPad with a 6-digit code. Ask the class from the toolbar and their answers appear here instantly. Their success-criteria ratings before and after the lesson are kept in the lesson report.") +
          '</p><div class="hb-cls"><label for="hbCls">🏫 ' + T("فصل الحصة", "Class") + '</label><select id="hbCls" class="hb-sel2"><option value="">' + T("بلا فصل: يدخل الطلاب بأسماء حرة", "No class: students type any name") + "</option></select>" +
          '<p class="hb-muted" id="hbClsN" style="margin:4px 0 0;font-size:12.5px">' + T("اختر فصلك ليُحسب حضور كل طالب وإجاباته عبر الحصص. يدخل الطلاب بحساباتهم فيُعرفون تلقائيًّا.", "Pick your class to track each student's attendance and answers across lessons. Signed-in students are recognised automatically.") + "</p></div>" +
          '<div class="hb-row"><button type="button" class="hb-btn pri" id="hbStart">▶ ' + T("ابدأ حصة مباشرة", "Start a live lesson") + '</button><button type="button" class="hb-btn" id="hbClsProg" hidden>📊 ' + T("تقدّم الفصل عبر الحصص", "Class progress across lessons") + '</button></div><div id="hbPast"></div>';
        $("hbStart").onclick = start; past(); loadClasses(); return;
      }
      sharePop.innerHTML = '<div class="hb-h">📲 ' + T("الحصة المباشرة", "Live lesson") + '</div><div class="hb-join"><div class="hb-qr" id="hbQr"></div><div><p style="margin:0">' + T("ادخلوا من", "Go to") + ' <span class="hb-url">' + esc(shortUrl()) + '</span> ' + T("ثم «تحدٍّ مباشر»، واكتبوا:", "→ “Live challenge”, then type:") + '</p><div class="hb-code">' + code3(S.code) + '</div><p class="hb-muted" style="margin:0">' + T("أو امسحوا الرمز بكاميرا الجوال", "or scan the QR code") + '</p></div></div>' +
        '<div class="hb-row" style="margin:0"><b id="hbJn">' + players.length + '</b> ' + T("طالبًا دخلوا الحصة", "students joined") + '</div><div class="hb-names" id="hbNm">' + names() + '</div><div id="hbRos"></div>' +
        '<label class="hb-ck" style="margin:8px 0 2px"><input type="checkbox" id="hbFollow"' + (follow ? " checked" : "") + "> 📺 " + T("اعرض الشرائح على أجهزة الطلاب (تتبع تنقّلك)", "Show the slides on students' devices (they follow you)") + "</label>" +
        '<div class="hb-row"><button type="button" class="hb-btn pri" id="hbBigBtn">' + ic("full") + ' ' + T("اعرض الرمز على الشاشة", "Show the code full screen") + '</button><button type="button" class="hb-btn" id="hbRepBtn">📊 ' + T("تقرير الحصة", "Lesson report") + '</button><button type="button" class="hb-btn" id="hbEndBtn">■ ' + T("أنهِ الحصة", "End") + "</button></div>";
      qrInto($("hbQr"), 134);
      $("hbBigBtn").onclick = function () { closePops(); showBig(); };
      $("hbFollow").onchange = function () { follow = this.checked; LS.set("hb-follow", follow ? "1" : ""); sendPos(true); say(follow ? T("📺 تظهر الشرائح الآن على أجهزة الطلاب", "📺 Slides now show on students' devices") : T("أُخفيت الشرائح عن أجهزة الطلاب", "Slides hidden from students' devices")); };
      loadRoster();
      $("hbRepBtn").onclick = function () { report(S); };
      $("hbEndBtn").onclick = function () { if (!confirm(T("إنهاء الحصة المباشرة؟ ستبقى نتائجها في تقرير الحصة.", "End the live lesson? Its results stay in the report."))) return; step("end").then(function () { var s0 = S; stopSubs(); try { sessionStorage.removeItem(KEY); } catch (e) {} S = null; setActive(); paintShare(); say(T("انتهت الحصة · التقرير محفوظ", "Lesson ended · report saved")); report(s0); }); };
    }
    /* الشرائح على أجهزة الطلاب: نرسل موضع العرض (الشريحة وعدد العناصر الظاهرة والشاشة السوداء) */
    var follow = LS.get("hb-follow", "1") === "1", posT = 0, lastPos = "";
    function sendPos(force) {
      if (!S || S.state === "done") return;
      clearTimeout(posT); posT = setTimeout(function () {
        if (!S) return; var sl = SL[cur]; if (!sl) return;
        var p = { k: cur, b: sl.querySelectorAll("[data-build-in]").length - sl.querySelectorAll("[data-build-in].hid").length, on: follow, black: black.classList.contains("on") };
        var x = W.__hbPosX && W.__hbPosX(); if (x) { p.tm = x.tm; p.bl = x.bl; p.ak = x.ak; }
        var j = JSON.stringify(p); if (j === lastPos && !force) return; lastPos = j;
        sb.rpc("dl_step", { p_live: S.id, p_action: "pos", p_q: p }).then(function (r) { if (r && r.error) lastPos = ""; });
      }, 250);
    }
    W.__hbPosKick = function () { sendPos(true); };
    new MutationObserver(function () { sendPos(); }).observe(stage, { subtree: true, attributes: true, attributeFilter: ["class"] });
    new MutationObserver(function () { sendPos(); }).observe(black, { attributes: true, attributeFilter: ["class"] });
    var roster = [];
    function loadRoster() {
      var box = $("hbRos"); if (!box || !S || !S.class_id) return;
      sb.rpc("dl_roster", { p_live: S.id }).then(function (r) {
        roster = r.data || []; box = $("hbRos"); if (!box) return;
        var inn = roster.filter(function (x) { return x.player; }), out = roster.filter(function (x) { return !x.player; });
        var linked = {}; inn.forEach(function (x) { linked[x.player] = 1; });
        var guests = players.filter(function (p) { return !linked[p.id]; });
        box.innerHTML = '<div class="hb-ros"><div class="hb-rosh">🏫 ' + esc(S.cname || T("الفصل", "Class")) + " · " + T("حضر ", "Present ") + "<b>" + inn.length + "</b>" + T(" من ", " of ") + roster.length + "</div>" +
          (out.length ? '<div class="hb-muted" style="font-size:12.5px;margin:4px 0">' + T("لم يدخلوا بعد: ", "Not in yet: ") + out.map(function (x) { return esc(x.name); }).join("، ") + "</div>" : '<div class="hb-muted" style="font-size:12.5px">✅ ' + T("حضر الفصل كله", "The whole class is here") + "</div>") +
          (guests.length && out.length ? '<div class="hb-muted" style="font-size:12.5px;margin-top:6px">' + T("دخلوا بلا حساب؛ اربط كل اسم بطالبه ليُحسب له:", "Joined without an account; link each name to its student:") + "</div>" + guests.map(function (g) { return '<div class="hb-link"><span>' + esc(g.nick) + '</span><select data-pl="' + g.id + '"><option value="">' + T("— اربط بـ —", "— link to —") + "</option>" + out.map(function (x) { return '<option value="' + x.id + '">' + esc(x.name) + "</option>"; }).join("") + "</select></div>"; }).join("") : "") + "</div>";
        box.querySelectorAll("[data-pl]").forEach(function (sl) { sl.onchange = function () { if (!sl.value) return; sb.rpc("dl_link_player", { p_player: sl.dataset.pl, p_student: sl.value }).then(function (r2) { if (r2.error) say(r2.error.message); else { say(T("رُبط الاسم بالطالب", "Linked")); loadRoster(); } }); }; });
      });
    }
    function classProgress(c) {
      var w = W.open("", "_blank"); if (!w) { say(T("اسمح للمتصفح بفتح نافذة جديدة", "Allow pop-ups")); return; }
      w.document.write('<!doctype html><meta charset="utf-8"><body style="font-family:Tahoma,sans-serif;padding:40px;color:#102A4C">' + T("جارٍ إعداد التقرير…", "Preparing…") + "</body>");
      sb.rpc("dl_class_progress", { p_class: c.id, p_days: 180 }).then(function (r) {
        if (r.error) { w.document.body.textContent = r.error.message; return; }
        var D1 = r.data || { sessions: [], students: [] }, ls = (D1.sessions || [])[0] || {};
        w.document.open(); w.document.write(progressHtml(c, D1)); w.document.close(); wireSupport(w.document, c.id, ls.lesson, ls.title);
      });
    }
    function progressHtml(c, D0) {
      var SS0 = D0.sessions || [], ST = D0.students || [], nS = SS0.length;
      var fmt = function (v) { return v == null ? "—" : (Math.round(v * 10) / 10).toFixed(1); };
      var dt = function (x) { return new Date(x).toLocaleDateString(EN ? "en-GB" : "ar-AE-u-nu-latn", { day: "numeric", month: "short" }); };
      var rows = ST.map(function (s0) {
        var att = nS ? pct(s0.present, nS) : 0, cor = s0.graded ? pct(s0.correct, s0.graded) : null, rb = s0.rate && s0.rate.before, ra = s0.rate && s0.rate.after;
        var flag = (nS && att < 60) || (cor != null && s0.graded >= 3 && cor < 50) || (ra != null && ra < 2);
        return { s: s0, att: att, cor: cor, rb: rb, ra: ra, flag: flag };
      });
      var avgAtt = rows.length ? Math.round(rows.reduce(function (a, x) { return a + x.att; }, 0) / rows.length) : 0;
      var g = rows.filter(function (x) { return x.cor != null; }), avgCor = g.length ? Math.round(g.reduce(function (a, x) { return a + x.cor; }, 0) / g.length) : null;
      var css = "body{font-family:'Thmanyah Text','Cairo',Tahoma,sans-serif;color:#102A4C;margin:0;background:#F4F6FA}main{max-width:1050px;margin:0 auto;padding:28px 24px 60px}h1{margin:0;font-size:26px}h2{margin:28px 0 10px;font-size:19px}.sub{color:#5B6B82;margin:4px 0 18px}" +
        ".cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px}.cards div{background:#fff;border-radius:14px;padding:14px 16px;box-shadow:0 2px 10px rgba(16,42,76,.06)}.cards b{display:block;font-size:28px}.cards span{color:#5B6B82;font-size:13px}" +
        "table{width:100%;border-collapse:collapse;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 2px 10px rgba(16,42,76,.06)}th,td{padding:9px 12px;text-align:start;border-bottom:1px solid #EDF0F5;font-size:14px}th{background:#102A4C;color:#fff;font-weight:700}td.num{font-variant-numeric:tabular-nums;white-space:nowrap}tr.flag td{background:#FFF6EC}" +
        ".bar{display:inline-block;width:70px;height:8px;border-radius:9px;background:#E6EAF0;vertical-align:middle;margin-inline-end:6px;overflow:hidden}.bar i{display:block;height:100%;background:#2E9E5B}.lo .bar i{background:#E0892B}" +
        ".up{color:#1B6B3A;font-weight:700}.dn{color:#B42318;font-weight:700}.note{color:#5B6B82;font-size:13px}.need{background:#FFF6EC;border-inline-start:4px solid #E0892B;padding:10px 14px;border-radius:10px;margin-top:14px}" +
        ".sup{border:1.5px solid #F5C98A;background:#FFFBF3;border-radius:14px;padding:12px 16px}.supl{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:4px 14px;margin:8px 0}.supl label{display:flex;gap:6px;cursor:pointer}.sup textarea{width:100%;font:inherit;border:1px solid #DDD3BF;border-radius:10px;padding:8px 10px;margin:6px 0;box-sizing:border-box}.sup button{font-size:15px;font-weight:600;font-family:inherit;border:0;border-radius:12px;padding:9px 18px;cursor:pointer;background:#102A4C;color:#fff}" +
        ".ses span{display:inline-block;background:#fff;border-radius:99px;padding:4px 12px;margin:3px;font-size:13px;box-shadow:0 1px 4px rgba(16,42,76,.08)}@media print{body{background:#fff}.np{display:none}table,.cards div{box-shadow:none;border:1px solid #DDE3EC}}";
      var h = '<!doctype html><html lang="' + (EN ? "en" : "ar") + '" dir="' + (RTL ? "rtl" : "ltr") + '"><head><meta charset="utf-8"><title>' + T("تقدّم الفصل", "Class progress") + " · " + esc(c.name) + "</title><style>" + fontCss() + css + "</style></head><body><main>" +
        '<p class="np" style="text-align:end"><button onclick="print()" style="font:inherit;padding:8px 16px;border-radius:10px;border:0;background:#D4AA55;cursor:pointer">🖨 ' + T("طباعة / PDF", "Print / PDF") + "</button></p>" +
        "<h1>📊 " + T("تقدّم الفصل عبر الحصص المباشرة", "Class progress across live lessons") + '</h1><p class="sub">' + esc(c.name) + " · " + T("الصف ", "Year ") + c.year + " · " + T("آخر 180 يومًا", "last 180 days") + "</p>" +
        '<div class="cards"><div><b>' + nS + "</b><span>" + T("حصة مباشرة", "live lessons") + "</span></div><div><b>" + ST.length + "</b><span>" + T("طالبًا في الفصل", "students") + "</span></div><div><b>" + avgAtt + "%</b><span>" + T("متوسط الحضور", "average attendance") + "</span></div>" + (avgCor != null ? "<div><b>" + avgCor + "%</b><span>" + T("متوسط الإجابات الصحيحة", "average correct") + "</span></div>" : "") + "</div>";
      if (!nS) h += '<p class="note" style="margin-top:20px">' + T("لا حصص مباشرة مرتبطة بهذا الفصل بعد. اختر الفصل عند «ابدأ حصة مباشرة».", "No live lessons linked to this class yet. Choose the class when you start a live lesson.") + "</p>";
      h += "<h2>👥 " + T("كل طالب", "Each student") + "</h2><table><thead><tr><th>" + T("الطالب", "Student") + "</th><th>" + T("الحضور", "Attendance") + "</th><th>" + T("الإجابات", "Answers") + "</th><th>" + T("الصحيحة", "Correct") + "</th><th>" + T("الفهم 😊", "Understanding 😊") + "</th><th>" + T("معايير النجاح: قبل ← بعد", "Criteria: before → after") + "</th><th>" + T("آخر حضور", "Last seen") + "</th></tr></thead><tbody>" +
        rows.map(function (x) { var dd = x.ra != null && x.rb != null ? x.ra - x.rb : null;
          return "<tr" + (x.flag ? ' class="flag"' : "") + "><td>" + (x.flag ? "🤝 " : "") + esc(x.s.name) + '</td><td class="num' + (x.att < 60 ? " lo" : "") + '"><span class="bar"><i style="width:' + x.att + '%"></i></span>' + x.s.present + "/" + nS + '</td><td class="num">' + x.s.answers + '</td><td class="num' + (x.cor != null && x.cor < 50 ? " lo" : "") + '">' + (x.cor == null ? "—" : '<span class="bar"><i style="width:' + x.cor + '%"></i></span>' + x.cor + "% <small>(" + x.s.correct + "/" + x.s.graded + ")</small>") + '</td><td class="num">' + fmt(x.s.scale) + '/3</td><td class="num">' + fmt(x.rb) + " ← " + fmt(x.ra) + (dd != null ? (dd > 0 ? ' <span class="up">▲' + fmt(dd) + "</span>" : dd < 0 ? ' <span class="dn">▼' + fmt(-dd) + "</span>" : "") : "") + '</td><td class="num">' + (x.s.last ? dt(x.s.last) : "—") + "</td></tr>"; }).join("") + "</tbody></table>" +
        '<p class="note">' + T("الصحيحة تُحسب من أسئلة الاختيار وصح أم خطأ التي كشفتَ إجابتها. الفهم ومعايير النجاح من 3. 🤝 = يحتاج متابعة: حضور أقل من 60% أو صحيحة أقل من 50% أو تقييم ذاتي بعد الدرس أقل من 2.", "Correct counts reveal-marked multiple-choice and true/false questions. Understanding and criteria are out of 3. 🤝 = needs follow-up: attendance under 60%, correct under 50%, or after-lesson self-rating under 2.") + "</p>";
      var need = rows.filter(function (x) { return x.flag; }).map(function (x) { return esc(x.s.name); });
      if (need.length) h += '<div class="need"><b>🤝 ' + T("طلاب يحتاجون متابعة", "Students to follow up") + ":</b> " + need.join("، ") + "</div>";
      if (ST.length) {
        var lastS = SS0[0] || {};
        h += '<h2 class="np">🤝 ' + T("أرسل نشاط دعم", "Send a support activity") + '</h2><div class="np sup"><p class="note">' + T("يصل إلى كل طالب تختاره إشعارٌ في المنصة يفتح صفحة آخر درس عُرض", "Each chosen student gets a notification opening the last lesson shown") + (lastS.title ? " («" + esc(lastS.title) + "»)" : "") + '.</p><div class="supl">' +
          rows.map(function (x) { return '<label><input type="checkbox" data-su="' + x.s.id + '"' + (x.flag ? " checked" : "") + "> " + esc(x.s.name) + "</label>"; }).join("") +
          '</div><textarea id="supNote" rows="3">' + esc(T("أريدك أن تراجع الدرس الأخير وتحلّ تدريبات «أتدرّب»، وسأتابع تقدّمك 🌟", "Please review the last lesson and do its practice; I'll follow your progress 🌟")) + '</textarea><div><button id="supGo">📨 ' + T("أرسل للطلاب المختارين", "Send to the selected students") + '</button> <span id="supMsg" class="note"></span></div></div>';
      }
      if (nS) h += "<h2>🗓 " + T("الحصص", "Lessons") + '</h2><div class="ses">' + SS0.map(function (x) { return "<span>" + dt(x.at) + " · " + esc(x.title || "") + " · " + T("حضر ", "present ") + x.present + (x.guests ? " + " + x.guests + T(" بلا حساب", " guests") : "") + "</span>"; }).join("") + "</div>";
      return h + "</main></body></html>";
    }
    function showBig() {
      joinBig.innerHTML = '<div class="q" id="hbBigQr"></div><div><h2>📲 ' + T("ادخلوا الحصة من أجهزتكم", "Join the lesson on your device") + '</h2><div class="u">' + esc(shortUrl()) + '</div><div class="n">' + T("ثم «تحدٍّ مباشر»، واكتبوا الرمز:", "→ “Live challenge”, then type the code:") + '</div><div class="c">' + code3(S.code) + '</div><div class="n">👥 <b id="hbBigN">' + players.length + '</b> ' + T("طالبًا دخلوا", "joined") + '</div><div class="nm" id="hbBigNm">' + names(40) + '</div><button type="button" id="hbBigGo">' + T("لنبدأ ▶", "Let's start ▶") + "</button></div>";
      joinBig.classList.add("on"); var q0 = $("hbBigQr"); qrInto(q0, Math.round(Math.min(innerWidth * 0.34, innerHeight * 0.52)) - 36);
      $("hbBigGo").onclick = function () { joinBig.classList.remove("on"); };
    }
    function past() {
      sb.from("deck_live").select("id, code, created_at, state, q_seq, title").eq("host", HX.uid).eq("deck", HX.deck).order("created_at", { ascending: false }).limit(6).then(function (r) {
        var L = (r.data || []).filter(function (x) { return x.q_seq > 0; }), box = $("hbPast"); if (!box || !L.length) return;
        box.innerHTML = '<p class="hb-muted" style="margin:12px 0 6px">' + T("تقارير حصصك السابقة لهذا الدرس:", "Your earlier reports for this lesson:") + "</p>" + L.map(function (x) { var d = new Date(x.created_at); return '<button type="button" class="hb-hit" data-id="' + x.id + '"><i>📊</i><span>' + d.toLocaleDateString(EN ? "en-GB" : "ar-AE-u-nu-latn", { weekday: "long", day: "numeric", month: "long" }) + " · " + d.toLocaleTimeString(EN ? "en-GB" : "ar-AE-u-nu-latn", { hour: "2-digit", minute: "2-digit" }) + " · " + x.q_seq + " " + T("أسئلة", "questions") + "</span></button>"; }).join("");
        box.querySelectorAll("[data-id]").forEach(function (b) { b.onclick = function () { report(L.find(function (x) { return x.id === b.dataset.id; })); }; });
      });
    }
    var CLS = null;
    function loadClasses() {
      var sel = $("hbCls"); if (!sel) return;
      var fill = function () {
        var last = LS.get("hb-class-" + DECK, LS.get("hb-class-last", ""));
        sel.innerHTML = '<option value="">' + T("بلا فصل: يدخل الطلاب بأسماء حرة", "No class: students type any name") + "</option>" + CLS.map(function (c) { return '<option value="' + c.id + '"' + (c.id === last ? " selected" : "") + ">" + esc(c.name) + " · " + T("الصف ", "Year ") + c.year + " (" + c.n + T(c.n >= 3 && c.n <= 10 ? " طلاب" : " طالبًا", " students") + ")</option>"; }).join("");
        var upd = function () { var v = sel.value; $("hbClsProg").hidden = !v; LS.set("hb-class-" + DECK, v); if (v) LS.set("hb-class-last", v); };
        sel.onchange = upd; upd();
        $("hbClsProg").onclick = function () { var c = CLS.find(function (x) { return x.id === sel.value; }); if (c) classProgress(c); };
      };
      if (CLS) return fill();
      sb.rpc("dl_my_classes").then(function (r) { CLS = r.data || []; if (!CLS.length) { var b = sel.closest(".hb-cls"); if (b) b.hidden = true; return; } fill(); });
    }
    function start() {
      var t = $("hbStart"); t.disabled = true; t.textContent = "…";
      var cid = ($("hbCls") || {}).value || null, cobj = cid && CLS ? CLS.find(function (x) { return x.id === cid; }) : null;
      sb.rpc("dl_create", { p_deck: HX.deck, p_title: title, p_lesson: HX.lesson, p_class: cid }).then(function (r) {
        if (r.error) { t.disabled = false; t.textContent = T("ابدأ حصة مباشرة", "Start a live lesson"); say(T("تعذّر بدء الحصة: ", "Could not start: ") + r.error.message); return; }
        S = { id: r.data.id, code: r.data.code, q_seq: 0, state: "idle", q: null, class_id: cid, cname: cobj ? cobj.name : "" }; players = []; answers = []; roster = [];
        try { sessionStorage.setItem(KEY, S.id); } catch (e) {}
        subscribe(); setActive(); paintShare(); closePops(); showBig(); sendPos(true);
      });
    }
    function step(action, q) { return sb.rpc("dl_step", { p_live: S.id, p_action: action, p_q: q || null }).then(function (r) { if (r.error) { say(r.error.message); throw r.error; } S.q_seq = r.data.q_seq; S.state = r.data.state; return r.data; }); }

    /* ---------- الاشتراك في التحديثات ---------- */
    function stopSubs() { chans.forEach(function (c) { try { sb.removeChannel(c); } catch (e) {} }); chans = []; clearInterval(pollT); pollT = 0; }
    function subscribe() {
      stopSubs();
      var c = sb.channel("hbl-" + S.id + "-" + Math.random().toString(36).slice(2, 7))
        .on("postgres_changes", { event: "*", schema: "public", table: "deck_live_answers", filter: "live_id=eq." + S.id }, function () { schedule(); })
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "deck_live_players", filter: "live_id=eq." + S.id }, function () { loadPlayers(); })
        .subscribe();
      chans.push(c);
      pollT = setInterval(function () { loadPlayers(); if (S && S.q_seq) loadAnswers(); }, 4000);
      loadPlayers();
    }
    function schedule() { clearTimeout(refT); refT = setTimeout(loadAnswers, 250); }
    function loadPlayers() {
      if (!S) return Promise.resolve();
      return sb.from("deck_live_players").select("id, nick, joined_at").eq("live_id", S.id).order("joined_at").then(function (r) {
        var L = r.data || []; if (L.length === players.length) return; players = L; badge.textContent = players.length;
        if ($("hbJn")) { $("hbJn").textContent = players.length; $("hbNm").innerHTML = names(); loadRoster(); }
        if ($("hbBigN")) { $("hbBigN").textContent = players.length; $("hbBigNm").innerHTML = names(40); }
        if (resP.classList.contains("on")) paintRes();
      });
    }
    function loadAnswers() {
      if (!S || !S.q_seq) return;
      sb.from("deck_live_answers").select("player_id, answer, at").eq("live_id", S.id).eq("q_seq", S.q_seq).then(function (r) { if (QZ && QZ.phase !== "q") return; answers = r.data || []; if (QZ) { var c = $("hbQzCnt"); if (c) c.textContent = answers.length; return; } paintRes(); });
    }

    /* ---------- اسأل الصف ---------- */
    var ABC = RTL ? ["أ", "ب", "ج", "د", "هـ", "و"] : ["A", "B", "C", "D", "E", "F"];
    function prNow() { var k = -1; PR.forEach(function (x, j) { if (x.i === cur) k = j; }); return k; }
    function phaseGuess() { var k = prNow(); if (k >= 0) return k === 0 ? "before" : "after"; var first = PR.length ? PR[0].i : -1; return cur <= first ? "before" : "after"; }
    /* أسئلة الشريحة الحالية: تُقرأ من الشريحة نفسها مع خياراتها وإجابتها إن وُجدت */
    var sentQ = {};
    var clean = function (t) { return String(t || "").replace(/\s+/g, " ").replace(/^[\s\d٠-٩.)\-–•]+/, "").replace(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF\uFE0F]/gu, "").trim(); };
    var num = function (t) { var m = String(t || "").replace(/[٠-٩]/g, function (d) { return "٠١٢٣٤٥٦٧٨٩".indexOf(d); }).match(/\d+/); return m ? +m[0] : 0; };
    var YN = /^(هل|أ(?=[^ل]))|^(is|are|do|does|did|can|could|will|would|should|was|were|have|has)\b/i;
    function slideQs(k) {
      var sl = SL[k]; if (!sl) return [];
      var out = [], seen = {};
      var push = function (q) { q.text = clean(q.text); if (q.text.length < 6 || seen[q.text]) return; seen[q.text] = 1; out.push(q); };
      sl.querySelectorAll(".qr").forEach(function (r) {
        var qt = r.querySelector(".q"), os = [].map.call(r.querySelectorAll(".qo"), function (o) { var b = o.querySelector("bdi"); return clean((b || o).textContent); }).filter(Boolean);
        if (!qt) return; var a = num((r.querySelector(".qa") || {}).textContent) - 1;
        push(os.length >= 2 ? { kind: "mc", text: qt.textContent, opts: os.slice(0, 6), ans: a >= 0 && a < os.length ? a : null } : { kind: "open", text: qt.textContent });
      });
      sl.querySelectorAll(".tfr").forEach(function (r) {
        var qt = r.querySelector(".tfq p") || r.querySelector(".tfq"); if (!qt) return; var a = r.querySelector(".tfa");
        push({ kind: "tf", text: qt.textContent, opts: [T("صح", "True"), T("خطأ", "False")], ans: a ? (a.classList.contains("y") ? 0 : a.classList.contains("x") ? 1 : null) : null });
      });
      if (out.length) return out.slice(0, 8);
      var hasQ = function (e) { return /[؟?]/.test(e.textContent); };
      sl.querySelectorAll("p,li,h1,h2,h3,h4,h5,td,div,span,b").forEach(function (e) {
        if (e.closest("aside,.qr,.tfr,.ans,.qa,.tip,.inst,.ft,.hrow,script,style")) return;
        if (!hasQ(e) || [].some.call(e.children, hasQ)) return;
        (e.textContent.replace(/\s+/g, " ").match(/[^؟?.!:]*[؟?]/g) || []).forEach(function (x) { var t = clean(x); if (t.length >= 6) push({ kind: YN.test(t) ? "yn" : "open", text: t }); });
      });
      return out.slice(0, 8);
    }
    function sendSlideQ(q, as) {
      sentQ[q.text] = 1;
      if (as === "mc" || as === "tf") ask({ t: as, text: q.text, opts: q.opts }, q.ans);
      else if (as === "yn") ask({ t: "tf", text: q.text, opts: [T("نعم", "Yes"), T("لا", "No")] });
      else ask({ t: "word", text: q.text });
    }
    function slideQsHtml() {
      var L = slideQs(cur); if (!L.length) return "";
      var KN = { mc: "🔤 " + TYPES.mc, tf: "✓✗ " + TYPES.tf, yn: "👍 " + T("نعم أم لا", "Yes / No"), open: "☁️ " + T("إجابة قصيرة", "Short answer") };
      return '<div class="hb-sq"><div class="hb-sqh">📌 ' + T("أسئلة هذه الشريحة", "Questions on this slide") + " <small>" + T("أرسل أيًّا منها بنقرة", "Send any of them in one tap") + "</small></div>" +
        L.map(function (q, i) {
          var btns = q.kind === "mc" ? [["mc", KN.mc]] : q.kind === "tf" ? [["tf", KN.tf]] : q.kind === "yn" ? [["yn", KN.yn], ["word", KN.open]] : [["word", KN.open], ["yn", KN.yn]];
          return '<div class="hb-sqi' + (sentQ[q.text] ? " sent" : "") + '"><div class="hb-sqt" data-qi="' + i + '" title="' + T("انقر لتعديل النص قبل الإرسال", "Click to edit before sending") + '">' + (sentQ[q.text] ? "✓ " : "") + esc(q.text) +
            (q.opts && q.kind === "mc" ? '<small>' + q.opts.map(function (o, j) { return ABC[j] + ") " + esc(o); }).join(" · ") + (q.ans != null ? " · " + T("الإجابة: ", "Answer: ") + ABC[q.ans] : "") + "</small>" : q.kind === "tf" && q.ans != null ? "<small>" + T("الإجابة: ", "Answer: ") + q.opts[q.ans] + "</small>" : "") +
            '</div><div class="hb-sqb">' + btns.map(function (b, j) { return '<button type="button" class="hb-btn' + (j ? "" : " pri") + '" data-qs="' + i + '" data-as="' + b[0] + '">📲 ' + b[1] + "</button>"; }).join("") + "</div></div>";
        }).join("") + "</div>";
    }
    function paintAsk() {
      var k = prNow(), SQ = slideQs(cur);
      askPop.innerHTML = '<div class="hb-h">❓ ' + T("اسأل الصف", "Ask the class") + '</div><input type="text" id="hbQt" maxlength="200" placeholder="' + T("نص السؤال (اختياري: إن كان السؤال على الشريحة فاتركه فارغًا)", "Question text (optional if it is on the slide)") + '">' + slideQsHtml() +
        (quizQs().length >= 2 ? '<button type="button" class="hb-qzb" id="hbQzOpen">🏆 ' + T("مسابقة سريعة من أسئلة العرض", "Quick quiz from the deck's questions") + " <small>(" + quizQs().length + ")</small></button>" : "") +
        (SQ.length ? '<div class="hb-sqh" style="margin-top:12px">✏️ ' + T("أو سؤال من عندك", "Or your own question") + "</div>" : "") +
        '<div class="hb-tiles">' +
        (PR.length ? '<button type="button" class="wide" data-t="rate">📈 ' + TYPES.rate + "<small>" + T("يقيّم كل طالب نفسه في معايير النجاح", "Each student rates the success criteria") + " (" + PR[0].rows.length + ") · " + (phaseGuess() === "before" ? T("قبل الدرس", "before the lesson") : T("بعد الدرس", "after the lesson")) + "</small></button>" : "") +
        '<button type="button" data-t="mc">🔤 ' + TYPES.mc + "<small>" + T("خيارات بالألوان، وتكشف الصحيحة", "Coloured options, reveal the answer") + '</small></button><button type="button" data-t="tf">✓✗ ' + TYPES.tf + "<small>" + T("أسرع سؤال تشخيصي", "The quickest check") + "</small></button>" +
        '<button type="button" data-t="word">☁️ ' + TYPES.word + "<small>" + T("سحابة كلمات من إجاباتهم", "A word cloud of answers") + '</small></button><button type="button" data-t="scale">😊 ' + TYPES.scale + "<small>" + T("هل فهمتم؟ بثلاثة وجوه", "Did you get it? Three faces") + '</small></button><button type="button" class="wide" data-t="draw">✏️ ' + TYPES.draw + "<small>" + T("يرسم الطالب أو يكتب بخطّه على جهازه، فتعرض أفضل الرسوم", "Students draw or handwrite on their device; show the best ones") + '</small></button><button type="button" class="wide" data-t="exit">🎟 ' + TYPES.exit + "<small>" + T("في آخر الحصة: ماذا تعلّمت؟ وكيف فهمك؟ وما سؤالك الباقي؟", "End of lesson: what did you learn, how well, and what's still unclear?") + "</small></button></div><div id=\"hbAskX\"></div>";
      var qo = $("hbQzOpen"); if (qo) qo.onclick = quizSetup;
      askPop.querySelectorAll("[data-qs]").forEach(function (b) { b.onclick = function () { var q = SQ[+b.dataset.qs], tx = $("hbQt"), v = tx.value.trim(); if (v && tx.dataset.qi === b.dataset.qs) q = Object.assign({}, q, { text: v }); tx.value = ""; sendSlideQ(q, b.dataset.as); }; });
      askPop.querySelectorAll("[data-qi]").forEach(function (b) { b.onclick = function () { var tx = $("hbQt"); tx.value = SQ[+b.dataset.qi].text; tx.dataset.qi = b.dataset.qi; tx.focus(); }; });
      askPop.querySelectorAll("[data-t]").forEach(function (b) { b.onclick = function () { var t = b.dataset.t; if (t === "mc") return mcEditor(); if (t === "rate") return rateEditor(); ask({ t: t, opts: t === "tf" ? [T("صح", "True"), T("خطأ", "False")] : undefined }); }; });
    }
    function mcEditor() {
      var n = 4, box = $("hbAskX");
      var draw = function () {
        box.innerHTML = '<div class="hb-row" style="justify-content:space-between"><b>' + T("الخيارات", "Options") + '</b><span class="hb-seg">' + [2, 3, 4, 5, 6].map(function (k) { return '<button type="button" data-n="' + k + '" class="' + (k === n ? "on" : "") + '">' + k + "</button>"; }).join("") + '</span></div><div class="hb-mced">' +
          Array.from({ length: n }, function (_, i) { return '<div><i style="background:' + COLS[i] + '">' + SH[i] + '</i><input type="text" data-o="' + i + '" maxlength="80" placeholder="' + ABC[i] + " " + T("(اكتب الخيار أو اتركه حرفًا)", "(type the option or keep the letter)") + '"></div>'; }).join("") +
          '</div><div class="hb-row"><button type="button" class="hb-btn pri" id="hbSendMc">📲 ' + T("أرسل للطلاب", "Send to students") + "</button></div>";
        box.querySelectorAll("[data-n]").forEach(function (b) { b.onclick = function () { var v = [].map.call(box.querySelectorAll("[data-o]"), function (x) { return x.value; }); n = +b.dataset.n; draw(); box.querySelectorAll("[data-o]").forEach(function (x, i) { x.value = v[i] || ""; }); }; });
        $("hbSendMc").onclick = function () { ask({ t: "mc", opts: [].map.call(box.querySelectorAll("[data-o]"), function (x, i) { return x.value.trim() || ABC[i]; }) }); };
        var f = box.querySelector("[data-o]"); if (f) f.focus();
      };
      draw();
    }
    function rateEditor() {
      var ph = phaseGuess(), box = $("hbAskX");
      var draw = function () {
        box.innerHTML = '<div class="hb-row" style="justify-content:space-between"><b>' + T("متى؟", "When?") + '</b><span class="hb-seg"><button type="button" data-p="before" class="' + (ph === "before" ? "on" : "") + '">' + T("قبل الدرس", "Before") + '</button><button type="button" data-p="after" class="' + (ph === "after" ? "on" : "") + '">' + T("بعد الدرس", "After") + "</button></span></div>" +
          '<p class="hb-muted">' + PR[0].rows.map(function (r, i) { return (i + 1) + ". " + esc(r.v ? r.v + ": " : "") + esc(r.p); }).join("<br>") + '</p><div class="hb-row"><button type="button" class="hb-btn pri" id="hbSendR">📲 ' + T("أرسل للطلاب", "Send to students") + "</button></div>";
        box.querySelectorAll("[data-p]").forEach(function (b) { b.onclick = function () { ph = b.dataset.p; draw(); }; });
        $("hbSendR").onclick = function () { sendRate(ph); };
      };
      draw();
    }
    function sendRate(ph) {
      var k = prNow(), src = k >= 0 ? PR[k] : (ph === "after" && PR[1] ? PR[1] : PR[0]);
      ask({ t: "rate", phase: ph, rows: src.rows, slide: src.i, text: ph === "before" ? T("قبل الدرس: أين أنا من معايير النجاح؟", "Before the lesson: where am I?") : T("بعد الدرس: أين أصبحت من معايير النجاح؟", "After the lesson: where am I now?") });
    }
    var exitAsked = false;
    function ask(q, known, quiet) {
      if (q.t === "exit") { exitAsked = true; if (W.__hbMark) W.__hbMark("ex"); }
      var tx = $("hbQt"); if (tx && tx.value.trim() && !q.text) q.text = tx.value.trim();
      q.slide = q.slide != null ? q.slide : cur; q.at = Date.now();
      return step("ask", q).then(function () { S.q = q; answers = []; pick = known != null ? known : null; closePops(); chip.classList.remove("on"); if (quiet) return; minimized = false; resP.classList.remove("mini"); resP.classList.add("on"); paintRes(); say(T("وصل السؤال إلى أجهزة الطلاب", "Question sent to students")); });
    }

    var liveOn = function () { return !!(S && S.state !== "done"); };
    W.__hbQuiz = function () {
      if (W.__hbCloseIce) W.__hbCloseIce();
      if (!liveOn()) { say(T("ابدأ الحصة المباشرة أولًا ليدخل الطلاب بالرمز", "Start the live lesson first so students can join")); paintShare(); togglePop(sharePop, btnLive); return; }
      paintAsk(); if (!askPop.classList.contains("on")) togglePop(askPop, btnAsk); var q = $("hbQzOpen"); if (q) q.click();
    };
    W.__hbExit = function () {
      if (W.__hbCloseIce) W.__hbCloseIce();
      if (liveOn()) { ask({ t: "exit", text: TYPES.exit }); return; }
      var k = W.__hbFindSlide ? W.__hbFindSlide(/بطاقه الخروج/) : -1;
      if (k < 0) { say(T("لا توجد شريحة بطاقة خروج في هذا العرض", "No exit-ticket slide in this deck")); return; }
      go(k); if (W.__hbMark) W.__hbMark("ex");
    };
    /* ---------- وضع المسابقة: أسئلة العرض نفسها بمؤقت ونقاط وترتيب ---------- */
    var QZ = null, quizOv = mk("div", "hbQuiz"); quizOv.dir = RTL ? "rtl" : "ltr"; stop(quizOv);
    function quizQs() { var out = []; SL.forEach(function (_, k) { slideQs(k).forEach(function (q) { if ((q.kind === "mc" || q.kind === "tf") && q.ans != null) out.push(Object.assign({ slide: k }, q)); }); }); return out; }
    var nickOf = function (id) { var p = players.find(function (x) { return x.id === id; }); return p ? p.nick : "—"; };
    function quizSetup() {
      var L = quizQs(), box = $("hbAskX"); if (!box) return;
      box.innerHTML = '<div class="hb-qzs"><b>🏆 ' + T("مسابقة من أسئلة العرض", "Quiz from the deck's questions") + "</b> <small>" + L.length + T(" سؤالًا لها إجابة على الشرائح", " questions with answers on the slides") + '</small><div class="hb-qzl">' +
        L.map(function (q, i) { return '<label class="hb-ck"><input type="checkbox" data-qz="' + i + '"' + (i < 12 ? " checked" : "") + "> <span>" + T("ش", "S") + (q.slide + 1) + " · " + esc(q.text) + "</span></label>"; }).join("") +
        '</div><div class="hb-row"><label class="hb-muted">⏱ ' + T("وقت السؤال", "Time per question") + ' <select id="hbQzT" class="hb-sel2" style="width:auto">' + [10, 20, 30, 45].map(function (t) { return '<option value="' + t + '"' + (t === +LS.get("hb-qz-t", "20") ? " selected" : "") + ">" + t + T(" ثانية", " s") + "</option>"; }).join("") + '</select></label><button type="button" class="hb-btn pri" id="hbQzGo">🏁 ' + T("ابدأ المسابقة", "Start the quiz") + "</button></div></div>";
      $("hbQzGo").onclick = function () { var pickL = L.filter(function (_, i) { var c = box.querySelector('[data-qz="' + i + '"]'); return c && c.checked; }); if (!pickL.length) return say(T("اختر سؤالًا واحدًا على الأقل", "Pick at least one question")); var sec = +$("hbQzT").value; LS.set("hb-qz-t", sec); startQuiz(pickL, sec); };
    }
    function startQuiz(list, sec) { if (W.__hbMark) W.__hbMark("qz"); closePops(); resP.classList.remove("on"); QZ = { list: list, i: -1, sec: sec, sc: {}, st: {}, prev: {}, phase: "", tick: 0 }; quizOv.classList.add("on"); nextQ(); }
    function nextQ() {
      clearInterval(QZ.tick); QZ.i++; var q = QZ.list[QZ.i]; QZ.phase = "q"; QZ.prev = Object.assign({}, QZ.sc);
      paintQuiz();
      ask({ t: q.kind, text: q.text, opts: q.opts, timer: QZ.sec, quiz: { i: QZ.i + 1, n: QZ.list.length } }, q.ans, true).then(function () {
        QZ.t0 = Date.now(); paintQuiz();
        QZ.tick = setInterval(function () { if (!QZ || QZ.phase !== "q") return; var left = QZ.sec - (Date.now() - QZ.t0) / 1000; var el = $("hbQzLeft"); if (el) el.textContent = Math.max(0, Math.ceil(left)); var ring = $("hbQzRing"); if (ring) ring.style.setProperty("--p", Math.max(0, left / QZ.sec));
          if (left <= 0 || (players.length && answers.length >= players.length)) finishQ(); }, 200);
      });
    }
    function finishQ() {
      if (!QZ || QZ.phase !== "q") return; QZ.phase = "wait"; clearInterval(QZ.tick);
      var q = QZ.list[QZ.i];
      step("close").then(function () { return sb.from("deck_live_answers").select("player_id, answer, at").eq("live_id", S.id).eq("q_seq", S.q_seq); }).then(function (r) {
        answers = r.data || [];
        var ok = answers.filter(function (a) { return a.answer && +a.answer.o === +q.ans; }).sort(function (a, b) { return new Date(a.at) - new Date(b.at); });
        var stepP = ok.length > 1 ? 500 / (ok.length - 1) : 0, okIds = {};
        ok.forEach(function (a, rk) { okIds[a.player_id] = 1; QZ.st[a.player_id] = (QZ.st[a.player_id] || 0) + 1; QZ.sc[a.player_id] = (QZ.sc[a.player_id] || 0) + Math.round(1000 - rk * stepP) + Math.min(300, (QZ.st[a.player_id] - 1) * 100); });
        answers.forEach(function (a) { if (!okIds[a.player_id]) QZ.st[a.player_id] = 0; });
        QZ.fast = ok[0] ? ok[0].player_id : null;
        return step("reveal", { correct: q.ans });
      }).then(function () { S.q.correct = q.ans; QZ.phase = "res"; paintQuiz(); if (W.snd) try { W.snd("correct"); } catch (e) {} if (answers.length && QZ.fast) burst(); });
    }
    function board(n) { return Object.keys(QZ.sc).map(function (id) { return { id: id, n: nickOf(id), s: QZ.sc[id] }; }).sort(function (a, b) { return b.s - a.s; }).slice(0, n || 5); }
    function paintQuiz() {
      if (!QZ) { quizOv.classList.remove("on"); return; }
      var q = QZ.list[QZ.i], head = '<div class="qz-top"><span class="qz-n">' + T("السؤال ", "Question ") + (QZ.i + 1) + T(" من ", " of ") + QZ.list.length + '</span><span class="qz-sp"></span><button type="button" class="qz-x" id="hbQzEnd">' + T("أنهِ المسابقة", "End quiz") + "</button></div>", h = "";
      if (QZ.phase === "q" || QZ.phase === "wait") {
        h = head + '<div class="qz-q">' + esc(q.text) + '</div><div class="qz-mid"><div class="qz-ring" id="hbQzRing" style="--p:1"><b id="hbQzLeft">' + QZ.sec + '</b></div><div class="qz-cnt"><b id="hbQzCnt">' + answers.length + "</b><span>" + T("أجابوا", "answered") + " / " + players.length + "</span></div></div>" +
          '<div class="qz-opts">' + q.opts.map(function (o, i) { return '<div class="qz-o" style="--c:' + COLS[i % 6] + '"><i>' + (q.kind === "tf" ? (i ? "✗" : "✓") : SH[i % 6]) + "</i>" + esc(o) + "</div>"; }).join("") + '</div><div class="qz-row"><button type="button" class="qz-btn" id="hbQzStop">⏭ ' + T("أوقف الوقت الآن", "Stop the clock") + "</button></div>";
      } else if (QZ.phase === "res") {
        var c = q.opts.map(function () { return 0; }); answers.forEach(function (a) { if (a.answer && c[a.answer.o] != null) c[a.answer.o]++; }); var mx = Math.max.apply(null, c.concat([1]));
        h = head + '<div class="qz-q sm">' + esc(q.text) + '</div><div class="qz-bars">' + q.opts.map(function (o, i) { return '<div class="qz-bar' + (i === +q.ans ? " ok" : " no") + '" style="--c:' + COLS[i % 6] + '"><div class="qz-col"><span>' + c[i] + '</span><i style="height:' + Math.max(4, c[i] / mx * 100) + '%"></i></div><p>' + (i === +q.ans ? "✅ " : "") + esc(o) + "</p></div>"; }).join("") + "</div>" +
          (QZ.fast ? '<p class="qz-fast">⚡ ' + T("الأسرع إجابة صحيحة: ", "Fastest correct answer: ") + "<b>" + esc(nickOf(QZ.fast)) + "</b></p>" : "") +
          '<div class="qz-row"><button type="button" class="qz-btn pri" id="hbQzBoard">🏆 ' + T("الترتيب", "Leaderboard") + "</button></div>";
      } else if (QZ.phase === "board") {
        var B0 = board(5), last = QZ.i >= QZ.list.length - 1, mxs = B0.length ? B0[0].s : 1;
        var prevRank = {}; Object.keys(QZ.prev).sort(function (a, b) { return QZ.prev[b] - QZ.prev[a]; }).forEach(function (id, k) { prevRank[id] = k; });
        h = head + '<h2 class="qz-h">🏆 ' + T("الأوائل حتى الآن", "Top players so far") + '</h2><div class="qz-lb">' + (B0.length ? B0.map(function (x, k) { var pr = prevRank[x.id], mv = pr == null ? "🆕" : pr > k ? "▲" : pr < k ? "▼" : ""; return '<div class="qz-li" style="--w:' + Math.max(8, x.s / mxs * 100) + '%"><b>' + (k + 1) + "</b><span>" + esc(x.n) + ' <small class="' + (mv === "▲" ? "up" : mv === "▼" ? "dn" : "") + '">' + mv + "</small></span><em>" + x.s + "</em></div>"; }).join("") : '<p class="qz-empty">' + T("لم يُجب أحد إجابة صحيحة بعد", "No correct answers yet") + "</p>") + "</div>" +
          '<div class="qz-row"><button type="button" class="qz-btn pri" id="hbQzNext">' + (last ? "🎉 " + T("النتيجة النهائية", "Final results") : (RTL ? "السؤال التالي ◀" : "Next question ▶")) + "</button></div>";
      } else if (QZ.phase === "end") {
        var B3 = board(10), pod = [B3[1], B3[0], B3[2]];
        h = '<div class="qz-top"><span class="qz-n">🎉 ' + T("انتهت المسابقة", "Quiz over") + '</span><span class="qz-sp"></span><button type="button" class="qz-x" id="hbQzClose">' + T("إغلاق", "Close") + "</button></div>" +
          '<div class="qz-pod">' + pod.map(function (x, j) { var place = [2, 1, 3][j]; return x ? '<div class="qz-p p' + place + '"><span class="qz-medal">' + ["🥇", "🥈", "🥉"][place - 1] + "</span><b>" + esc(x.n) + "</b><em>" + x.s + '</em><div class="qz-step">' + place + "</div></div>" : '<div class="qz-p p' + place + ' none"></div>'; }).join("") + "</div>" +
          (B3.length > 3 ? '<p class="qz-rest">' + B3.slice(3).map(function (x, k) { return (k + 4) + ". " + esc(x.n) + " (" + x.s + ")"; }).join(" · ") + "</p>" : "") + '<div class="qz-conf">' + Array.from({ length: 40 }, function (_, k) { return '<i style="--x:' + Math.random() * 100 + "%;--d:" + (Math.random() * 2 + 2) + "s;--dl:" + Math.random() * 1.5 + "s;--c:" + COLS[k % 6] + '"></i>'; }).join("") + "</div>";
      }
      quizOv.innerHTML = h;
      var bind = function (id, f) { var e = $(id); if (e) e.onclick = f; };
      bind("hbQzStop", finishQ);
      bind("hbQzBoard", function () { QZ.phase = "board"; paintQuiz(); });
      bind("hbQzNext", function () { if (QZ.i >= QZ.list.length - 1) { QZ.phase = "end"; step("idle"); paintQuiz(); if (W.snd) try { W.snd("win"); } catch (e) {} } else nextQ(); });
      bind("hbQzEnd", function () { if (!confirm(T("إنهاء المسابقة الآن؟", "End the quiz now?"))) return; clearInterval(QZ.tick); QZ.phase = "end"; step("idle"); paintQuiz(); });
      bind("hbQzClose", function () { QZ = null; quizOv.classList.remove("on"); });
    }

    /* ---------- لوحة النتائج ---------- */
    var normW = function (t) { return String(t || "").replace(/[ً-ٰٟـ]/g, "").replace(/[إأآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/^ال(?=..)/, "").replace(/[.,،!؟?]/g, "").trim().toLowerCase(); };
    function pct(n, d) { return d ? Math.round((n / d) * 100) : 0; }
    function paintRes() {
      if (!S || !S.q) return;
      var q = S.q, n = answers.length, tot = Math.max(players.length, n), body = "", acts = "";
      resP.classList.toggle("closed", S.state !== "open"); resP.classList.toggle("big", big); resP.classList.toggle("mini", minimized);
      if (!n) body = '<div class="hb-wait">⏳ ' + T("بانتظار إجابات الطلاب…", "Waiting for answers…") + "</div>";
      else if (q.t === "mc" || q.t === "tf") {
        var cnt = q.opts.map(function () { return 0; }); answers.forEach(function (a) { var o = a.answer && a.answer.o; if (cnt[o] != null) cnt[o]++; });
        var mx = Math.max.apply(null, cnt.concat([1]));
        body = q.opts.map(function (o, i) { var col = q.t === "tf" ? (i ? "#E53B3B" : "#2E9E6A") : COLS[i]; return '<button type="button" class="hb-bar' + (pick === i ? " ok" : "") + '" data-o="' + i + '"><span class="lab"><i style="background:' + col + '">' + (q.t === "tf" ? (i ? "✗" : "✓") : SH[i]) + "</i><span>" + esc(o) + '</span></span><span class="trk"><span class="fil" style="display:block;width:' + (cnt[i] / mx) * 100 + "%;background:" + col + '"></span></span><b>' + cnt[i] + "</b></button>"; }).join("") +
          '<p class="hb-hint">' + (S.state === "reveal" ? "✅ " + T("نسبة الإجابة الصحيحة: ", "Correct: ") + pct(cnt[pick] || 0, n) + "%" : T("انقر الإجابة الصحيحة، ثم «اكشف الإجابة» لتصل النتيجة إلى كل طالب.", "Click the correct option, then “Reveal”.")) + "</p>";
      } else if (q.t === "word") {
        var g = {}; answers.forEach(function (a) { var w = (a.answer && a.answer.w || "").trim(); if (!w) return; var k = normW(w) || w; (g[k] = g[k] || { w: w, n: 0 }).n++; });
        var L = Object.keys(g).map(function (k) { return g[k]; }).sort(function (a, b) { return b.n - a.n; }).slice(0, 40), top = L.length ? L[0].n : 1, CC = ["#102A4C", "#1E6BC2", "#0B7A75", "#C2452A", "#6A45C2", "#A85F0C"];
        L.sort(function () { return Math.random() - 0.5; });
        body = '<div class="hb-cloud">' + L.map(function (x, i) { var f = big ? 26 + 70 * (x.n / top) : 16 + 30 * (x.n / top); return '<span style="font-size:' + Math.round(f) + "px;color:" + CC[i % CC.length] + '" title="' + x.n + '">' + esc(x.w) + "</span>"; }).join("") + "</div>";
      } else if (q.t === "exit") {
        var e3 = [0, 0, 0], eg = {}, eq = []; answers.forEach(function (a) { var x = a.answer || {}; if (x.v >= 1 && x.v <= 3) e3[x.v - 1]++; var w = (x.w || "").trim(); if (w) { var k = normW(w) || w; (eg[k] = eg[k] || { w: w, n: 0 }).n++; } if ((x.k || "").trim()) eq.push(x.k.trim()); });
        var em = Math.max.apply(null, e3.concat([1])), EL = Object.keys(eg).map(function (k) { return eg[k]; }).sort(function (a, b) { return b.n - a.n; }).slice(0, 24), etop = EL.length ? EL[0].n : 1;
        body = '<div class="hb-exit"><div class="hb-scale">' + FACES.map(function (f, i) { return "<div><b>" + e3[i] + '</b><i style="height:' + Math.max(2, (e3[i] / em) * 80) + "%;background:" + f[2] + '"></i><span>' + f[0] + "</span><small>" + f[1] + "</small></div>"; }).join("") + "</div>" +
          '<h4>💡 ' + T("أهم ما تعلّموه", "What they learned") + '</h4><div class="hb-cloud">' + EL.map(function (x, i) { return '<span style="font-size:' + Math.round((big ? 22 : 15) + (big ? 40 : 18) * (x.n / etop)) + "px;color:" + ["#102A4C", "#1E6BC2", "#0B7A75", "#C2452A", "#6A45C2"][i % 5] + '">' + esc(x.w) + "</span>"; }).join("") + "</div>" +
          (eq.length ? '<h4>❓ ' + T("أسئلة ما زالت في أذهانهم", "Questions still on their minds") + " (" + eq.length + ')</h4><ul class="hb-eq">' + eq.slice(0, 30).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" : "") + "</div>";
      } else if (q.t === "draw") {
        body = '<div class="hb-dtop"><button type="button" class="hb-btn" id="hbNames">' + (showNames ? "🙈 " + T("أخفِ الأسماء", "Hide names") : "👤 " + T("أظهر الأسماء", "Show names")) + '</button><span class="hb-muted">' + T("انقر رسمًا لتعرضه كبيرًا على الشاشة", "Click a drawing to show it big") + '</span></div><div class="hb-dgrid">' +
          answers.map(function (a, i) { return '<button type="button" class="hb-dcard" data-dr="' + i + '">' + drawSvg(a.answer && a.answer.d) + (showNames ? "<span>" + esc(nickOf(a.player_id)) + "</span>" : "") + "</button>"; }).join("") + "</div>";
      } else if (q.t === "scale") {
        var c3 = [0, 0, 0]; answers.forEach(function (a) { var v = a.answer && a.answer.v; if (v >= 1 && v <= 3) c3[v - 1]++; }); var m3 = Math.max.apply(null, c3.concat([1]));
        body = '<div class="hb-scale">' + FACES.map(function (f, i) { return "<div><b>" + c3[i] + '</b><i style="height:' + Math.max(2, (c3[i] / m3) * 80) + "%;background:" + f[2] + '"></i><span>' + f[0] + "</span><small>" + f[1] + "</small></div>"; }).join("") + "</div>";
      } else if (q.t === "rate") {
        var rows = q.rows || [], cc = rows.map(function () { return [0, 0, 0]; });
        answers.forEach(function (a) { (a.answer && a.answer.r || []).forEach(function (v, i) { if (cc[i] && v >= 1 && v <= 3) cc[i][v - 1]++; }); });
        body = rows.map(function (r, i) { var t = cc[i][0] + cc[i][1] + cc[i][2] || 1; return '<div class="hb-rr"><p>' + (i + 1) + ". " + esc(r.v ? r.v + ": " : "") + esc(r.p) + '</p><div class="hb-stk">' + [2, 1, 0].map(function (j) { var w = (cc[i][j] / t) * 100; return '<i style="width:' + w + "%;background:" + FACES[j][2] + '">' + (cc[i][j] ? FACES[j][0] + " " + cc[i][j] : "") + "</i>"; }).join("") + "</div></div>"; }).join("") +
          '<p class="hb-hint">' + FACES.map(function (f) { return f[0] + " " + f[1]; }).join(" · ") + "</p>";
        /* تُكتب الأعداد على شريحة «قياس التقدّم» نفسها */
        var sl = SL[q.slide]; if (sl) [].forEach.call(sl.querySelectorAll(".pr"), function (row, i) { var fc = row.querySelectorAll(".fc i"); if (cc[i] && fc.length === 3) for (var j = 0; j < 3; j++) fc[j].textContent = cc[i][j]; });
      }
      var openB = S.state === "open";
      acts = '<button type="button" data-a="' + (openB ? "close" : "reopen") + '">' + (openB ? "🔒 " + T("أغلق السؤال", "Close") : "🔓 " + T("أعد فتحه", "Reopen")) + "</button>" +
        ((q.t === "mc" || q.t === "tf") ? '<button type="button" class="pri" data-a="reveal" ' + (pick == null || S.state === "reveal" ? "disabled" : "") + ">✅ " + T("اكشف الإجابة", "Reveal") + "</button>" : "") +
        '<button type="button" data-a="new">➕ ' + T("سؤال جديد", "New question") + "</button>";
      resP.innerHTML = '<div class="hb-rh"><span class="dot"></span><b>' + TYPES[q.t] + (q.t === "rate" ? " · " + (q.phase === "after" ? T("بعد الدرس", "after") : T("قبل الدرس", "before")) : "") + '</b><span class="cnt">' + n + " / " + tot + " " + T("أجابوا", "answered") + '</span><button type="button" data-a="min" title="' + T("تصغير", "Minimise") + '">' + (minimized ? "▢" : "—") + '</button><button type="button" data-a="big" title="' + T("على الشاشة كلها", "Full screen") + '">⤢</button><button type="button" data-a="x" title="' + T("إخفاء", "Hide") + '">✕</button></div>' +
        (q.text ? '<div class="hb-rq">' + esc(q.text) + "</div>" : "") + '<div class="hb-rb">' + body + '</div><div class="hb-ra">' + acts + "</div>";
      resP.querySelectorAll("[data-o]").forEach(function (b) { b.onclick = function () { if (S.state === "reveal") return; pick = +b.dataset.o; paintRes(); }; });
      resP.querySelectorAll("[data-dr]").forEach(function (b) { b.onclick = function () { var a = answers[+b.dataset.dr]; if (a) openDraw(a); }; });
      var nb = $("hbNames"); if (nb) nb.onclick = function () { showNames = !showNames; paintRes(); };
      resP.querySelectorAll("[data-a]").forEach(function (b) { b.onclick = function () {
        var a = b.dataset.a;
        if (a === "min") { minimized = !minimized; if (minimized) big = false; paintRes(); }
        else if (a === "big") { big = !big; minimized = false; paintRes(); }
        else if (a === "x") { resP.classList.remove("on"); say(T("النتائج مخفية · تظهر من «اسأل الصف»", "Results hidden · reopen from “Ask”")); }
        else if (a === "close" || a === "reopen") step(a).then(paintRes);
        else if (a === "reveal") step("reveal", { correct: pick }).then(function () { S.q.correct = pick; paintRes(); if (W.snd) try { W.snd("correct"); } catch (e) {}
          var okN = answers.filter(function (a) { return a.answer && +a.answer.o === +pick; }).length; if (answers.length && okN / answers.length >= 0.6) burst(); });
        else if (a === "new") { paintAsk(); askPop.style.display = "block"; anchor(askPop, btnAsk); }
      }; });
    }

    /* ---------- الشريحة الحالية: اقتراح تقييم المعايير على شريحة «قياس التقدّم» ---------- */
    var askedPhase = {};
    W.__hbOnSlide = function (k) {
      var j = -1; PR.forEach(function (x, i) { if (x.i === k) j = i; });
      var ph = j === 0 ? "before" : "after";
      if (S && S.state !== "done" && j >= 0 && !askedPhase[ph]) { chip.innerHTML = "📲 " + (ph === "before" ? T("اطلب من الطلاب تقييم أنفسهم قبل الدرس على أجهزتهم", "Ask students to self-rate before the lesson") : T("اطلب من الطلاب تقييم أنفسهم بعد الدرس على أجهزتهم", "Ask students to self-rate after the lesson")); chip.classList.add("on"); chip.onclick = function (e) { e.stopPropagation(); askedPhase[ph] = 1; chip.classList.remove("on"); sendRate(ph); }; }
      else if (S && S.state !== "done" && S.state !== "open" && k >= N - 2 && !exitAsked) {
        chip.innerHTML = "🎟 " + T("اختم الحصة ببطاقة الخروج على أجهزة الطلاب", "Close the lesson with an exit ticket on students' devices"); chip.classList.add("on");
        chip.onclick = function (e) { e.stopPropagation(); chip.classList.remove("on"); ask({ t: "exit", text: TYPES.exit }); };
      }
      else if (S && S.state !== "done" && S.state !== "open" && slideQs(k).some(function (q) { return !sentQ[q.text]; })) {
        var nq = slideQs(k).length;
        chip.innerHTML = "📲 " + T("اسأل الصف أسئلة هذه الشريحة على أجهزتهم", "Ask the class this slide's questions on their devices") + " (" + nq + ")"; chip.classList.add("on");
        chip.onclick = function (e) { e.stopPropagation(); chip.classList.remove("on"); paintAsk(); closePops(); askPop.style.display = "block"; anchor(askPop, btnAsk); };
      }
      else chip.classList.remove("on");
    };

    /* ---------- تقرير الحصة ---------- */
    function report(row) {
      if (!row) return;
      var w = W.open("", "_blank"); if (!w) { say(T("اسمح للمتصفح بفتح نافذة جديدة لعرض التقرير", "Allow pop-ups to open the report")); return; }
      w.document.write('<!doctype html><meta charset="utf-8"><title>' + T("تقرير الحصة", "Lesson report") + '</title><body style="font-family:Tahoma,sans-serif;padding:40px;color:#102A4C">' + T("جارٍ إعداد التقرير…", "Preparing the report…") + "</body>");
      Promise.all([
        sb.from("deck_live").select("*").eq("id", row.id).maybeSingle(),
        sb.from("deck_live_players").select("id, nick, joined_at, user_id").eq("live_id", row.id).order("joined_at"),
        sb.from("deck_live_answers").select("player_id, q_seq, q, answer, at").eq("live_id", row.id).order("q_seq"),
        sb.rpc("dl_roster", { p_live: row.id })
      ]).then(function (R) { var L0 = R[0].data || row; w.document.open(); w.document.write(reportHtml(L0, R[1].data || [], R[2].data || [], R[3].data || [])); w.document.close(); wireSupport(w.document, L0.class_id, L0.lesson_code, L0.title); })
        .catch(function (e) { w.document.body.textContent = String(e && e.message || e); });
    }
    function wireSupport(d, cls, lesson, ttl) {
      var go = d.getElementById("supGo"); if (!go || !cls) return;
      go.onclick = function () {
        var ids = [].map.call(d.querySelectorAll("[data-su]:checked"), function (c) { return c.dataset.su; }), msg = d.getElementById("supMsg");
        if (!ids.length) { msg.textContent = T("اختر طالبًا واحدًا على الأقل", "Pick at least one student"); return; }
        go.disabled = true; msg.textContent = "…";
        sb.rpc("dl_send_support", { p_class: cls, p_students: ids, p_title: T("🤝 نشاط دعم من معلمك: ", "🤝 Support activity: ") + (ttl || ""), p_note: d.getElementById("supNote").value, p_link: lesson ? "#/lesson/" + encodeURIComponent(lesson) : null }).then(function (r) {
          go.disabled = false; msg.textContent = r.error ? "⚠️ " + r.error.message : "✅ " + T("وصل النشاط إلى ", "Sent to ") + nStu(r.data.sent);
        });
      };
    }
    function fontCss() {
      var out = ""; [].forEach.call(D.styleSheets, function (ss) { try { [].forEach.call(ss.cssRules || [], function (r) { if (r.type === 5) out += r.cssText.replace(/url\((['"]?)([^'")]+)\1\)/g, function (m0, q, u) { try { return "url(" + q + new URL(u, ss.href || location.href).href + q + ")"; } catch (e) { return m0; } }) + "\n"; }); } catch (e) {} }); return out;
    }
    function reportHtml(L, P, A, RO) {
      var nick = {}; P.forEach(function (p) { nick[p.id] = p.nick; });
      var bySeq = {}; A.forEach(function (a) { (bySeq[a.q_seq] = bySeq[a.q_seq] || { q: a.q || {}, a: [] }).a.push(a); if (a.q && a.q.correct != null) bySeq[a.q_seq].q = a.q; });
      var seqs = Object.keys(bySeq).map(Number).sort(function (a, b) { return a - b; });
      var rateB = null, rateA = null; seqs.forEach(function (s) { var q = bySeq[s].q; if (q.t === "rate") { if (q.phase === "after") rateA = bySeq[s]; else rateB = bySeq[s]; } });
      var d = new Date(L.created_at), dateS = d.toLocaleDateString(EN ? "en-GB" : "ar-AE-u-nu-latn", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) + " · " + d.toLocaleTimeString(EN ? "en-GB" : "ar-AE-u-nu-latn", { hour: "2-digit", minute: "2-digit" });
      var avg = function (r) { var v = (r || []).filter(function (x) { return x; }); return v.length ? v.reduce(function (s, x) { return s + x; }, 0) / v.length : null; };
      var rows = (rateB || rateA) ? ((rateA || rateB).q.rows || []) : [];
      var dist = function (set, i) { var c = [0, 0, 0], n = 0; (set ? set.a : []).forEach(function (a) { var v = a.answer && a.answer.r && a.answer.r[i]; if (v >= 1 && v <= 3) { c[v - 1]++; n++; } }); return { c: c, n: n, p3: pct(c[2], n), p23: pct(c[1] + c[2], n) }; };
      var allP3 = function (set) { var c = 0, n = 0; rows.forEach(function (_, i) { var x = dist(set, i); c += x.c[2]; n += x.n; }); return pct(c, n); };
      var bar = function (x) { if (!x.n) return '<div class="stk empty">—</div>'; return '<div class="stk">' + [2, 1, 0].map(function (j) { return x.c[j] ? '<i style="width:' + (x.c[j] / x.n) * 100 + "%;background:" + FACES[j][2] + '">' + x.c[j] + "</i>" : ""; }).join("") + "</div>"; };
      var h = "";
      /* البطاقات */
      var qN = seqs.length, mcs = seqs.filter(function (s) { var q = bySeq[s].q; return (q.t === "mc" || q.t === "tf") && q.correct != null; });
      var corr = 0, tot = 0; mcs.forEach(function (s) { bySeq[s].a.forEach(function (a) { tot++; if (a.answer && +a.answer.o === +bySeq[s].q.correct) corr++; }); });
      h += '<div class="cards"><div><b>' + P.length + "</b><span>" + T("طالبًا شاركوا", "students took part") + "</span></div><div><b>" + qN + "</b><span>" + T("سؤالًا طُرح", "questions asked") + "</span></div>" +
        (tot ? "<div><b>" + pct(corr, tot) + "%</b><span>" + T("متوسط الإجابات الصحيحة", "average correct") + "</span></div>" : "") +
        (rateB && rateA ? '<div class="g"><b>' + allP3(rateB) + "% ← " + allP3(rateA) + "%</b><span>" + T("«أستطيع وحدي» قبل الدرس وبعده", "“I can do it” before → after") + "</span></div>" : "") + "</div>";
      /* الحضور من قائمة الفصل */
      if (RO && RO.length) {
        var inR = RO.filter(function (x) { return x.player; }), outR = RO.filter(function (x) { return !x.player; });
        h += "<h2>🏫 " + T("الحضور", "Attendance") + '</h2><p class="note" style="font-size:15px">' + T("حضر ", "Present: ") + "<b>" + inR.length + "</b>" + T(" من ", " of ") + RO.length + T(" طالبًا", " students") + (outR.length ? " · " + T("غاب: ", "Absent: ") + outR.map(function (x) { return esc(x.name); }).join("، ") : " · ✅ " + T("حضر الفصل كله", "whole class present")) + "</p>";
      }
      /* قياس التقدّم */
      if (rows.length) {
        h += "<h2>📈 " + T("قياس التقدّم في معايير النجاح", "Progress on the success criteria") + "</h2><table class=\"crit\"><thead><tr><th>" + T("معيار النجاح", "Success criterion") + "</th><th>" + T("قبل الدرس", "Before") + "</th><th>" + T("بعد الدرس", "After") + "</th><th>" + T("أستطيع وحدي", "I can do it") + "</th></tr></thead><tbody>" +
          rows.map(function (r, i) { var b = dist(rateB, i), a = dist(rateA, i), dlt = a.p3 - b.p3; return "<tr><td><b>" + (i + 1) + ". " + esc(r.v ? r.v + ": " : "") + "</b>" + esc(r.p) + "</td><td>" + bar(b) + "</td><td>" + bar(a) + '</td><td class="num">' + (rateB ? b.p3 + "%" : "—") + " ← " + (rateA ? a.p3 + "%" : "—") + (rateB && rateA ? ' <span class="' + (dlt > 0 ? "up" : dlt < 0 ? "dn" : "eq") + '">' + (dlt > 0 ? "▲ " + dlt : dlt < 0 ? "▼ " + -dlt : "=") + "</span>" : "") + "</td></tr>"; }).join("") +
          '</tbody></table><p class="leg">' + FACES.map(function (f) { return '<i style="background:' + f[2] + '"></i>' + f[1]; }).join(" &nbsp; ") + "</p>";
        /* كل طالب */
        var mineB = {}, mineA = {}; (rateB ? rateB.a : []).forEach(function (a) { mineB[a.player_id] = a.answer.r; }); (rateA ? rateA.a : []).forEach(function (a) { mineA[a.player_id] = a.answer.r; });
        var need = [], list = P.map(function (p) { var b = avg(mineB[p.id]), a = avg(mineA[p.id]), low = mineA[p.id] ? mineA[p.id].some(function (v) { return v === 1; }) : false; if (low || (a != null && a < 2)) need.push(p.nick); return { n: p.nick, b: b, a: a, low: low, r: mineA[p.id] || mineB[p.id] }; });
        var fmt = function (v) { return v == null ? "—" : (Math.round(v * 10) / 10).toFixed(1); };
        h += "<h2>👥 " + T("تقدّم كل طالب", "Each student's progress") + '</h2><table class="st"><thead><tr><th>' + T("الطالب", "Student") + "</th><th>" + T("قبل", "Before") + "</th><th>" + T("بعد", "After") + "</th><th>" + T("التغيّر", "Change") + "</th><th>" + T("تقييمه بعد الدرس لكل معيار", "After-lesson rating per criterion") + "</th></tr></thead><tbody>" +
          list.map(function (x) { var dd = x.a != null && x.b != null ? x.a - x.b : null; return "<tr" + (x.low ? ' class="low"' : "") + "><td>" + esc(x.n) + '</td><td class="num">' + fmt(x.b) + '</td><td class="num">' + fmt(x.a) + '</td><td class="num">' + (dd == null ? "—" : dd > 0 ? '<span class="up">▲ ' + fmt(dd) + "</span>" : dd < 0 ? '<span class="dn">▼ ' + fmt(-dd) + "</span>" : "=") + "</td><td>" + ((x.r || []).map(function (v) { return v ? FACES[v - 1][0] : "·"; }).join(" ")) + "</td></tr>"; }).join("") + "</tbody></table>" +
          '<p class="note">' + T("المتوسط من 3: (1) لم أتعلّمه بعد، (2) أعرف قليلًا، (3) أستطيع وحدي.", "Average out of 3: (1) not yet, (2) a little, (3) I can do it.") + "</p>";
        if (need.length) h += '<div class="need"><b>🤝 ' + T("طلاب يحتاجون دعمًا في الحصة القادمة", "Students who need support next lesson") + ":</b> " + need.map(esc).join("، ") + "</div>";
        var missing = rateB && rateA ? P.filter(function (p) { return mineB[p.id] && !mineA[p.id]; }).map(function (p) { return p.nick; }) : [];
        if (missing.length) h += '<p class="note">' + T("قيّموا أنفسهم قبل الدرس ولم يقيّموا بعده: ", "Rated before but not after: ") + missing.map(esc).join("، ") + "</p>";
      }
      /* بقية الأسئلة */
      var others = seqs.filter(function (s) { return bySeq[s].q.t !== "rate"; });
      if (others.length) {
        h += "<h2>❓ " + T("أسئلة الحصة", "The lesson's questions") + "</h2>";
        others.forEach(function (s, k) {
          var x = bySeq[s], q = x.q, n = x.a.length, inner = "";
          if (q.t === "mc" || q.t === "tf") { var c = (q.opts || []).map(function () { return 0; }); x.a.forEach(function (a) { if (c[a.answer.o] != null) c[a.answer.o]++; }); inner = (q.opts || []).map(function (o, i) { return '<div class="ob' + (+q.correct === i ? " ok" : "") + '"><span>' + (+q.correct === i ? "✅ " : "") + esc(o) + '</span><i style="width:' + pct(c[i], n) + '%"></i><b>' + c[i] + " (" + pct(c[i], n) + "%)</b></div>"; }).join("") + (q.correct != null ? '<p class="note">' + T("أجاب إجابة صحيحة: ", "Correct: ") + pct(c[q.correct] || 0, n) + "%" + (c[q.correct] < n ? " · " + T("أخطأ: ", "Wrong: ") + x.a.filter(function (a) { return +a.answer.o !== +q.correct; }).map(function (a) { return esc(nick[a.player_id] || "؟"); }).join("، ") : "") + "</p>" : ""); }
          else if (q.t === "word") { var g = {}; x.a.forEach(function (a) { var w0 = (a.answer.w || "").trim(), kk = normW(w0) || w0; (g[kk] = g[kk] || { w: w0, n: 0 }).n++; }); inner = '<p class="words">' + Object.keys(g).map(function (kk) { return g[kk]; }).sort(function (a, b) { return b.n - a.n; }).map(function (z) { return "<span>" + esc(z.w) + (z.n > 1 ? " <b>×" + z.n + "</b>" : "") + "</span>"; }).join("") + "</p>"; }
          else if (q.t === "exit") { var r3 = [0, 0, 0]; x.a.forEach(function (a) { var v = a.answer && a.answer.v; if (v >= 1 && v <= 3) r3[v - 1]++; });
            inner = '<p class="sc">' + FACES.map(function (f, i) { return f[0] + " " + f[1] + ": <b>" + r3[i] + "</b>"; }).join(" &nbsp; · &nbsp; ") + '</p><table class="st"><thead><tr><th>' + T("الطالب", "Student") + "</th><th>" + T("الفهم", "Understanding") + "</th><th>" + T("أهم ما تعلّمه", "Learned") + "</th><th>" + T("سؤاله الباقي", "Still wondering") + "</th></tr></thead><tbody>" +
              x.a.map(function (a) { var y = a.answer || {}; return "<tr" + (y.v === 1 ? ' class="low"' : "") + "><td>" + esc(nick[a.player_id] || "") + '</td><td class="num">' + (FACES[(y.v || 0) - 1] || ["—"])[0] + "</td><td>" + esc(y.w || "") + "</td><td>" + esc(y.k || "") + "</td></tr>"; }).join("") + "</tbody></table>"; }
          else if (q.t === "draw") { inner = '<div class="drw">' + x.a.map(function (a) { return "<figure>" + drawSvg(a.answer && a.answer.d) + "<figcaption>" + esc(nick[a.player_id] || "") + "</figcaption></figure>"; }).join("") + "</div>"; }
          else if (q.t === "scale") { var c3 = [0, 0, 0]; x.a.forEach(function (a) { if (a.answer.v >= 1 && a.answer.v <= 3) c3[a.answer.v - 1]++; }); inner = '<p class="sc">' + FACES.map(function (f, i) { return f[0] + " " + f[1] + ": <b>" + c3[i] + "</b> (" + pct(c3[i], n) + "%)"; }).join(" &nbsp; · &nbsp; ") + "</p>" + (c3[0] ? '<p class="note">' + T("لم يفهموا بعد: ", "Not yet: ") + x.a.filter(function (a) { return a.answer.v === 1; }).map(function (a) { return esc(nick[a.player_id] || "؟"); }).join("، ") + "</p>" : ""); }
          h += '<div class="qq"><div class="qh"><span>' + (k + 1) + "</span><b>" + TYPES[q.t] + (q.text ? ": " + esc(q.text) : "") + "</b><small>" + T("الشريحة ", "Slide ") + ((q.slide || 0) + 1) + " · " + n + " " + T("إجابة", "answers") + "</small></div>" + inner + "</div>";
        });
      }
      /* نشاط دعم للطلاب الذين يحتاجونه (يصل إشعارًا يفتح صفحة الدرس) */
      if (L.class_id && seqs.length) {
        var flag = {}, why = {};
        var mark = function (pid, r) { flag[pid] = 1; (why[pid] = why[pid] || []).push(r); };
        seqs.forEach(function (s0) { var x = bySeq[s0], q = x.q;
          if (q.t === "rate" && q.phase === "after") x.a.forEach(function (a) { var r = a.answer && a.answer.r || []; if (r.length && (r.some(function (v) { return v === 1; }) || avg(r) < 2)) mark(a.player_id, T("تقييم ذاتي منخفض", "low self-rating")); });
          if (q.t === "exit" || q.t === "scale") x.a.forEach(function (a) { if (a.answer && a.answer.v === 1) mark(a.player_id, q.t === "exit" ? T("بطاقة الخروج: لم يفهم بعد", "exit ticket: not yet") : T("لم يفهم بعد", "not yet")); });
        });
        var gr = {}; seqs.forEach(function (s0) { var q = bySeq[s0].q; if ((q.t === "mc" || q.t === "tf") && q.correct != null) bySeq[s0].a.forEach(function (a) { var g = gr[a.player_id] = gr[a.player_id] || [0, 0]; g[1]++; if (a.answer && +a.answer.o === +q.correct) g[0]++; }); });
        Object.keys(gr).forEach(function (pid) { if (gr[pid][1] >= 2 && gr[pid][0] / gr[pid][1] < 0.5) mark(pid, T("إجابات صحيحة أقل من النصف", "under half correct")); });
        var linked = P.filter(function (p) { return p.user_id; });
        h += '<h2 class="np">🤝 ' + T("أرسل نشاط دعم", "Send a support activity") + '</h2><div class="np sup"><p class="note">' + T("يصل إلى كل طالب تختاره إشعارٌ في المنصة يفتح صفحة الدرس للمراجعة والتدرّب. اخترنا لك من يحتاج الدعم بحسب إجاباته؛ عدّل الاختيار كما تشاء.", "Each student you choose gets a notification that opens the lesson page to review and practise. We've pre-selected students by their answers; adjust as you like.") + "</p>" +
          (linked.length ? '<div class="supl">' + linked.map(function (p) { return '<label><input type="checkbox" data-su="' + p.user_id + '"' + (flag[p.id] ? " checked" : "") + "> " + esc(p.nick) + (why[p.id] ? ' <small>(' + why[p.id].filter(function (v, i, a0) { return a0.indexOf(v) === i; }).join("، ") + ")</small>" : "") + "</label>"; }).join("") + "</div>" +
            '<textarea id="supNote" rows="3">' + esc(T("راجع درس «", "Review the lesson “") + (L.title || "") + T("»، ثم حلّ تدريبات «أتدرّب» في صفحة الدرس. أنا معك 🌟", "”, then do the practice in the lesson page. You've got this 🌟")) + '</textarea><div><button id="supGo">📨 ' + T("أرسل للطلاب المختارين", "Send to the selected students") + '</button> <span id="supMsg" class="note"></span></div>'
            : '<p class="note">' + T("لا يوجد طلاب دخلوا بحساباتهم أو رُبطت أسماؤهم بالفصل في هذه الحصة.", "No students joined with their accounts or were linked to the class in this lesson.") + "</p>") + "</div>";
      }
      var NT = []; try { NT = JSON.parse(LS.get("hb-notes-" + DECK, "[]")).filter(function (n) { return n.l && n.l === L.id; }); } catch (e) {}
      if (NT.length) h += "<h2>📝 " + T("ملاحظات المعلم أثناء الحصة", "Teacher's notes during the lesson") + '</h2><table><thead><tr><th style="width:70px">' + T("الوقت", "Time") + '</th><th style="width:80px">' + T("الشريحة", "Slide") + "</th><th>" + T("الملاحظة", "Note") + "</th></tr></thead><tbody>" + NT.map(function (n) { return "<tr><td>" + new Date(n.t).toLocaleTimeString(EN ? "en-GB" : "ar-AE-u-nu-latn", { hour: "2-digit", minute: "2-digit" }) + "</td><td>" + n.s + "</td><td>" + (n.g ? "<b>" + esc(n.g) + "</b> " : "") + esc(n.x || "") + "</td></tr>"; }).join("") + "</tbody></table>";
      var GR = []; try { GR = JSON.parse(LS.get("hb-growth", "[]")) || []; } catch (e) {}
      var GM = GR.filter(function (e) { return e.l && e.l === L.id; }), GH = GR.filter(function (e) { return !(e.l && e.l === L.id); }).slice(-6);
      if (GM.length || GH.length) {
        var GLB = ["🌱 " + T("لم نحقّقه بعد", "Not yet"), "🌿 " + T("جزئيًّا", "Partly"), "🌳 " + T("حقّقناه", "Achieved")], grow = function (e) { return "<tr><td>" + new Date(e.t).toLocaleDateString(EN ? "en-GB" : "ar-AE-u-nu-latn", { day: "numeric", month: "numeric" }) + "</td><td>" + esc((e.n || "").slice(0, 50)) + "</td><td>" + (e.k === "goal" ? "🎯 " + T("تحقّق الهدف", "Goal check") : "🪞 " + T("تقييم ذاتي", "Self-assessment")) + "</td><td>" + (e.k === "goal" ? GLB[e.g] : "<b>" + e.b + "% → " + e.a + "%</b> (" + (e.a - e.b >= 0 ? "+" : "") + (e.a - e.b) + ")" + (e.lv && Object.keys(e.lv).length ? "<br><small>" + Object.keys(e.lv).map(function (k) { return ["🥉", "🥈", "🥇", "💎"][k] + " " + e.lv[k][0] + "% → " + e.lv[k][1] + "%"; }).join(" · ") + "</small>" : "")) + "</td></tr>"; };
        h += "<h2>📈 " + T("نموّ التعلّم", "Learning growth") + "</h2>" + (GM.length ? "<p><b>" + T("هذه الحصة", "This lesson") + '</b></p><table><thead><tr><th style="width:70px">' + T("التاريخ", "Date") + "</th><th>" + T("الدرس", "Lesson") + "</th><th>" + T("النوع", "Type") + "</th><th>" + T("النتيجة", "Result") + "</th></tr></thead><tbody>" + GM.map(grow).join("") + "</tbody></table>" : "") + (GH.length ? "<p><b>" + T("حصص سابقة (للمقارنة)", "Earlier lessons (for comparison)") + '</b></p><table><thead><tr><th style="width:70px">' + T("التاريخ", "Date") + "</th><th>" + T("الدرس", "Lesson") + "</th><th>" + T("النوع", "Type") + "</th><th>" + T("النتيجة", "Result") + "</th></tr></thead><tbody>" + GH.map(grow).join("") + "</tbody></table>" : "");
      }
      if (!seqs.length) h += '<p class="note" style="font-size:16px">' + T("لم يُطرح أي سؤال في هذه الحصة بعد.", "No questions were asked in this lesson yet.") + "</p>";
      var LOGO2 = '<svg viewBox="0 0 40 56" width="26" height="36"><path d="M11 14c0-4 4-6 9-6s9 2 9 6z" fill="#102A4C"/><rect x="9" y="14" width="22" height="3" rx="1.5" fill="#102A4C"/><path d="M10 19h20l2 22c-6 4-18 4-24 0z" fill="none" stroke="#102A4C" stroke-width="2.4"/><path d="M20 23l5 9c1 2.5-.5 5-3 5h-4c-2.5 0-4-2.5-3-5z" fill="#C4943A"/><path d="M16 46h8l-4 6z" fill="#102A4C"/></svg>';
      return '<!doctype html><html lang="' + (EN ? "en" : "ar") + '" dir="' + (RTL ? "rtl" : "ltr") + '"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + T("تقرير الحصة", "Lesson report") + " · " + esc(L.title || title) + "</title><style>" + fontCss() +
        "*{box-sizing:border-box}body{margin:0;background:#F4F1EA;color:#1F2A3C;font-family:'Thmanyah Text','Cairo',Tahoma,sans-serif;font-size:14px;line-height:1.65}" +
        ".page{max-width:1000px;margin:24px auto;background:#fff;border-radius:18px;box-shadow:0 10px 40px rgba(16,42,76,.1);padding:36px 40px}" +
        "header{display:flex;align-items:center;gap:14px;border-bottom:3px solid #102A4C;padding-bottom:14px;margin-bottom:18px}header .t{flex:1}header h1{margin:0;font:700 24px 'Thmanyah Display','Thmanyah Text',Tahoma,sans-serif;color:#102A4C}header p{margin:2px 0 0;color:#5A6475}" +
        ".brand{display:flex;align-items:center;gap:6px;font:700 20px 'Thmanyah Display',Tahoma,sans-serif;color:#102A4C}" +
        ".cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin:8px 0 20px}.cards div{border:1.5px solid #E8E1D2;border-radius:14px;padding:12px 14px;background:#FBF8F1}.cards b{display:block;font-size:26px;color:#102A4C}.cards .g{background:#EAF7EF;border-color:#9CD7B1}.cards .g b{color:#1B6B3A}.cards span{color:#5A6475;font-size:13px}" +
        "h2{font:700 18px 'Thmanyah Display','Thmanyah Text',Tahoma,sans-serif;color:#102A4C;margin:26px 0 10px;padding-bottom:6px;border-bottom:1.5px solid #EFE6D4}" +
        "table{width:100%;border-collapse:collapse}th{background:#102A4C;color:#fff;font-weight:600;padding:8px 10px;text-align:start;font-size:13px}td{border-bottom:1px solid #EFE6D4;padding:8px 10px;vertical-align:middle}" +
        ".crit td:nth-child(2),.crit td:nth-child(3){width:21%}.num{white-space:nowrap;font-weight:700;text-align:center}" +
        ".stk{display:flex;height:20px;border-radius:99px;overflow:hidden;background:#F1EDE4}.stk i{display:flex;align-items:center;justify-content:center;font:700 11px Tahoma,sans-serif;color:#1F2A3C;font-style:normal}.stk.empty{background:none;color:#9AA3AF;justify-content:center}" +
        ".up{color:#1B6B3A}.dn{color:#B23A1F}.eq{color:#6B7280}.leg{font-size:12.5px;color:#5A6475}.leg i{display:inline-block;width:12px;height:12px;border-radius:3px;margin-inline-end:5px;vertical-align:-1px}" +
        ".st tr.low td{background:#FFF5E8}.note{color:#5A6475;font-size:13px;margin:8px 0}.need{margin:12px 0;padding:12px 14px;border-radius:12px;background:#FFF5E8;border:1.5px solid #F5C98A}" +
        ".qq{border:1.5px solid #EFE6D4;border-radius:14px;padding:12px 14px;margin:10px 0;break-inside:avoid}.qh{display:flex;align-items:center;gap:10px;margin-bottom:8px}.qh span{flex:none;width:26px;height:26px;border-radius:8px;background:#102A4C;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700}.qh b{flex:1}.qh small{color:#6B7280}" +
        ".ob{display:grid;grid-template-columns:minmax(0,1.2fr) 2fr 90px;gap:10px;align-items:center;margin:4px 0}.ob i{display:block;height:14px;border-radius:99px;background:#9AA9BE;min-width:2px}.ob.ok i{background:#2E9E5B}.ob.ok span{font-weight:700;color:#1B6B3A}.ob b{text-align:end;font-size:13px}" +
        ".drw{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}.drw figure{margin:0;border:1px solid #DDE3EC;border-radius:10px;overflow:hidden;background:#fff}.drw svg{display:block;width:100%;height:auto}.drw figcaption{font-size:12px;text-align:center;padding:3px;color:#5B6B82}" +
        ".sup{border:1.5px solid #F5C98A;background:#FFFBF3;border-radius:14px;padding:12px 16px}.supl{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:4px 14px;margin:8px 0}.supl label{display:flex;gap:6px;align-items:baseline;cursor:pointer}.supl small{color:#A0612F}.sup textarea{width:100%;font:inherit;border:1px solid #DDD3BF;border-radius:10px;padding:8px 10px;margin:6px 0}.sup button{font:600 15px 'Thmanyah Text',Tahoma,sans-serif;border:0;border-radius:12px;padding:9px 18px;cursor:pointer;background:#102A4C;color:#fff}@media print{.np{display:none}}" +
        ".words span{display:inline-block;background:#EEF2F8;border-radius:99px;padding:3px 10px;margin:3px}.sc{font-size:15px}" +
        "footer{margin-top:28px;padding-top:12px;border-top:1px solid #EFE6D4;color:#6B7280;font-size:12px;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}" +
        ".bar{max-width:1000px;margin:18px auto 0;display:flex;gap:10px;justify-content:flex-end}.bar button{font:600 15px 'Thmanyah Text',Tahoma,sans-serif;border:0;border-radius:12px;padding:10px 18px;cursor:pointer;background:#102A4C;color:#fff}" +
        "@media print{body{background:#fff}.page{box-shadow:none;margin:0;max-width:none;padding:0}.bar{display:none}@page{size:A4;margin:14mm}th{-webkit-print-color-adjust:exact;print-color-adjust:exact}.stk i,.cards div,.need,.ob i,.st tr.low td{-webkit-print-color-adjust:exact;print-color-adjust:exact}}" +
        '</style></head><body><div class="bar"><button onclick="print()">🖨 ' + T("طباعة / حفظ PDF", "Print / save PDF") + '</button></div><div class="page"><header><div class="brand">' + LOGO2 + (EN ? "Hira" : "حِرَاء") + '</div><div class="t"><h1>' + T("تقرير الحصة", "Lesson report") + "</h1><p>" + esc(L.title || title) + (L.lesson_code ? " · " + esc(L.lesson_code) : "") + "</p><p>" + dateS + "</p></div></header>" + h +
        "<footer><span>" + T("أُعدّ تلقائيًّا من إجابات الطلاب في الحصة المباشرة على منصة حراء.", "Generated automatically from students' answers in the live lesson on Hira.") + "</span><span>" + T("رمز الحصة", "Session code") + " " + esc(L.code) + "</span></footer></div></body></html>";
    }

    /* ---------- الأزرار والاستئناف ---------- */
    on("hbLive", function (e, b) { paintShare(); togglePop(sharePop, b); });
    on("hbAsk", function (e, b) { paintAsk(); togglePop(askPop, b, $("hbQt")); });
    W.addEventListener("pagehide", stopSubs);
    var keep = null; try { keep = sessionStorage.getItem(KEY); } catch (e) {}
    if (keep) sb.from("deck_live").select("id, code, q, q_seq, state, class_id").eq("id", keep).maybeSingle().then(function (r) {
      if (r.data && r.data.state !== "done") { S = r.data; subscribe(); setActive(); sendPos(true); if (S.q && S.q_seq) { loadAnswers(); resP.classList.add("on"); } }
    });
  })();

  /* ======================================================================
     شاشة المعلم (نافذة ثانية على حاسوب المعلم) والتحكم من الجوال
     ====================================================================== */
  (function () {
    var nextB = function () { var b = $("nN"); if (b) b.click(); else go(cur + 1); };
    var prevB = function () { var b = $("nP"); if (b) b.click(); else go(cur - 1); };
    var stTitle = function (k) { var s = SL[k]; if (!s) return ""; return ((s.querySelector("h1,h2,h3") || {}).textContent || "").replace(/\s+/g, " ").trim(); };
    var notesOf = function (k) { var s = SL[k]; if (!s) return ""; return [].map.call(s.querySelectorAll("aside"), function (a) { return a.textContent.trim(); }).join("\n\n"); };
    var liveInfo = function () { return W.__hbLiveInfo ? W.__hbLiveInfo() : null; };
    W.__hb = { next: nextB, prev: prevB, go: go, cur: function () { return cur; }, N: N, title: title, stTitle: stTitle, notes: notesOf, black: function () { toggleBlack(); return black.classList.contains("on"); }, isBlack: function () { return black.classList.contains("on"); }, live: liveInfo };
    var subs = [];
    var prevHook = W.__hbOnSlide;
    W.__hbOnSlide = function (k, ch) { if (prevHook) prevHook(k, ch); subs.forEach(function (f) { try { f(k); } catch (e) {} }); };

    /* ---------- شاشة المعلم ---------- */
    var pw = null;
    function deckCss() { return [].map.call(D.querySelectorAll("style"), function (s) { return s.id === "hb-css" || s.textContent.indexOf("#hbResP") >= 0 ? "" : s.textContent; }).join("\n"); }
    function openPV() {
      if (pw && !pw.closed) { pw.focus(); return; }
      pw = W.open("", "hiraaPresenter", "width=1280,height=800");
      if (!pw) { say(T("اسمح للمتصفح بفتح نافذة جديدة لشاشة المعلم", "Allow pop-ups to open the presenter view")); return; }
      var pd = pw.document;
      pd.open();
      pd.write('<!doctype html><html lang="' + (EN ? "en" : "ar") + '" dir="' + (RTL ? "rtl" : "ltr") + '"><head><meta charset="utf-8"><base href="' + location.href.replace(/#.*$/, "") + '"><title>' + T("شاشة المعلم", "Presenter view") + " · " + esc(title) + "</title><style>" + deckCss() + "</style><style>" +
        "html,body{margin:0;height:100%;background:#0B1628;color:#E9EEF5;font-family:'Thmanyah Text','Cairo',Tahoma,sans-serif;overflow:hidden}" +
        ".pv{display:grid;grid-template-rows:56px 1fr 84px;height:100%}" +
        ".pv-top{display:flex;align-items:center;gap:14px;padding:0 18px;background:#0F2340;border-bottom:1px solid rgba(255,255,255,.08)}" +
        ".pv-top .t{flex:1;min-width:0;font:700 17px 'Thmanyah Display','Thmanyah Text',Tahoma,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
        ".pv-top .clk{display:flex;align-items:center;gap:8px;font:700 22px ui-monospace,Menlo,monospace;direction:ltr}" +
        ".pv-top .now{opacity:.6;font:600 15px ui-monospace,Menlo,monospace;direction:ltr}" +
        ".pv-top button,.pv-bot button{font:600 14px 'Thmanyah Text',Tahoma,sans-serif;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.06);color:#E9EEF5;border-radius:10px;padding:6px 12px;cursor:pointer}" +
        ".pv-top button:hover,.pv-bot button:hover{background:rgba(255,255,255,.14)}" +
        ".pv-main{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(0,1fr);gap:16px;padding:16px;min-height:0}" +
        ".pv-col{display:flex;flex-direction:column;gap:12px;min-height:0}" +
        ".pv-lab{font-size:13px;opacity:.65;display:flex;justify-content:space-between;gap:8px}" +
        ".pv-box{position:relative;width:100%;aspect-ratio:16/9;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.4)}" +
        ".pv-box.cur{box-shadow:0 0 0 3px #D4AA55,0 10px 30px rgba(0,0,0,.4)}" +
        ".pv-in{position:absolute;left:0;top:0;width:1920px;height:1080px;transform-origin:0 0;pointer-events:none}" +
        ".pv-in .sl{opacity:1!important;transform:none!important;visibility:visible!important}.pv-in *{animation:none!important;transition:none!important;view-transition-name:none!important}.pv-in .hid{opacity:1!important;transform:none!important}.pv-in aside{display:none!important}" +
        ".pv-end{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#0F2340;color:#9FB0C8;font-size:20px}" +
        ".pv-notes{flex:1;min-height:0;overflow:auto;background:#FFFDF7;color:#1F2A3C;border-radius:14px;padding:16px 18px;line-height:1.85;white-space:pre-wrap}" +
        ".pv-notes:empty::before{content:attr(data-empty);color:#9AA3AF}" +
        ".pv-live{background:rgba(46,158,91,.16);border:1px solid rgba(73,194,122,.5);border-radius:12px;padding:8px 12px;font-size:15px;display:none}" +
        ".pv-bot{display:flex;align-items:center;gap:12px;padding:0 18px;background:#0F2340;border-top:1px solid rgba(255,255,255,.08)}" +
        ".pv-bot .pvnav{font:800 22px 'Thmanyah Text',Tahoma,sans-serif;padding:12px 30px;border-radius:14px}" +
        ".pv-bot .pvnx{background:#D4AA55;color:#1B1405;border-color:#D4AA55}" +
        ".pv-bot .ct{font:800 26px ui-monospace,Menlo,monospace;direction:ltr;min-width:110px;text-align:center}" +
        ".pv-bot .sp{flex:1}.pv-bot button.on{background:#D4AA55;color:#1B1405}" +
        "@media (max-width:900px){.pv-main{grid-template-columns:1fr}}" +
        '</style></head><body><div class="pv"><div class="pv-top"><span>🏮</span><div class="t">' + esc(title) + '</div><div class="clk"><span id="el">00:00</span><button id="tp" title="' + T("إيقاف/تشغيل", "Pause/resume") + '">⏸</button><button id="tr" title="' + T("من البداية", "Reset") + '">↺</button></div><span class="now" id="now"></span><button id="fs"><svg viewBox="0 0 24 24" width="16" height="16" style="vertical-align:-3px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg> ' + T("ملء الشاشة", "Full screen") + "</button></div>" +
        '<div class="pv-main"><div class="pv-col"><div class="pv-lab"><span>' + T("الشريحة الآن على شاشة الصف", "Now on the class screen") + '</span><span id="ctT"></span></div><div class="pv-box cur" id="bc"></div></div>' +
        '<div class="pv-col"><div class="pv-lab"><span>' + T("التالية", "Next") + '</span><span id="nxT"></span></div><div class="pv-box" id="bn"></div><div class="pv-live" id="lv"></div><div class="pv-lab"><span>' + T("ملاحظات المعلم", "Teacher notes") + '</span><span><button id="a1" style="padding:0 8px">A−</button> <button id="a2" style="padding:0 8px">A+</button></span></div><div class="pv-notes" id="nt" data-empty="' + T("لا ملاحظات لهذه الشريحة.", "No notes for this slide.") + '"></div></div></div>' +
        '<div class="pv-bot"><button class="pvnav" id="pv">' + (RTL ? "→ " : "← ") + T("السابق", "Previous") + '</button><div class="ct" id="ct"></div><button class="pvnav pvnx" id="nx">' + T("التالي", "Next") + (RTL ? " ←" : " →") + '</button><span class="sp"></span><button id="bk">🌑 ' + T("شاشة سوداء", "Black screen") + '</button><button id="pk">🎲 ' + T("القرعة", "Pick") + "</button></div></div></body></html>");
      pd.close();
      var $p = function (id) { return pd.getElementById(id); };
      var fit2 = function (box) { var w = box.clientWidth; var i = box.querySelector(".pv-in"); if (i) i.style.transform = "scale(" + w / 1920 + ")"; };
      var put = function (box, k) {
        box.innerHTML = "";
        if (k >= N) { box.innerHTML = '<div class="pv-end">' + T("نهاية العرض", "End of the presentation") + "</div>"; return; }
        var c = pd.importNode(SL[k], true); c.classList.add("on"); c.querySelectorAll("video,audio,iframe,script").forEach(function (x) { x.remove(); });
        c.querySelectorAll(".hid").forEach(function (x) { x.classList.remove("hid"); }); c.querySelectorAll("[style]").forEach(function (x) { x.style.viewTransitionName = ""; });
        var w = pd.createElement("div"); w.className = "pv-in"; w.appendChild(c); box.appendChild(w); fit2(box);
      };
      var fsz = +LS.get("hb-pv-fs", "19");
      var sync = function (k) {
        if (pw.closed) return;
        put($p("bc"), k); put($p("bn"), k + 1);
        $p("ct").textContent = (k + 1) + " / " + N; $p("ctT").textContent = stTitle(k); $p("nxT").textContent = k + 1 < N ? stTitle(k + 1) : "";
        $p("nt").textContent = notesOf(k); $p("nt").style.fontSize = fsz + "px";
        $p("bk").classList.toggle("on", black.classList.contains("on"));
      };
      pw.__pvSync = sync; subs.push(function (k) { if (pw && !pw.closed) sync(k); });
      $p("nx").onclick = nextB; $p("pv").onclick = prevB;
      $p("bk").onclick = function () { toggleBlack(); $p("bk").classList.toggle("on", black.classList.contains("on")); };
      $p("pk").onclick = function () { W.focus(); $("hbPick").click(); setTimeout(function () { var g = $("hbGo"); if (g) g.click(); }, 120); };
      $p("a1").onclick = function () { fsz = Math.max(14, fsz - 2); LS.set("hb-pv-fs", fsz); $p("nt").style.fontSize = fsz + "px"; };
      $p("a2").onclick = function () { fsz = Math.min(36, fsz + 2); LS.set("hb-pv-fs", fsz); $p("nt").style.fontSize = fsz + "px"; };
      $p("fs").onclick = function () { if (pd.fullscreenElement) pd.exitFullscreen(); else pd.documentElement.requestFullscreen().catch(function () {}); };
      var t0 = Date.now(), paused = 0, pAt = 0;
      var tick = function () { if (pw.closed) return clearInterval(iv); var ms = (pAt || Date.now()) - t0 - paused, s = Math.floor(ms / 1000); $p("el").textContent = String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); $p("now").textContent = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
        var L = liveInfo(), lv = $p("lv"); if (L && L.on) { lv.style.display = "block"; lv.textContent = "📲 " + L.players + " " + T("طالبًا في الحصة", "students in") + (L.q ? " · " + T("أجاب ", "answered ") + L.answered + " / " + L.players : ""); } else lv.style.display = "none"; };
      var iv = setInterval(tick, 1000); tick();
      $p("tp").onclick = function () { if (pAt) { paused += Date.now() - pAt; pAt = 0; $p("tp").textContent = "⏸"; } else { pAt = Date.now(); $p("tp").textContent = "▶"; } tick(); };
      $p("tr").onclick = function () { t0 = Date.now(); paused = 0; pAt = 0; $p("tp").textContent = "⏸"; tick(); };
      pw.addEventListener("keydown", function (e) {
        var k = e.key;
        if ([" ", "PageDown", "ArrowDown", "Enter"].indexOf(k) >= 0 || k === (RTL ? "ArrowLeft" : "ArrowRight")) { e.preventDefault(); nextB(); }
        else if (["PageUp", "ArrowUp", "Backspace"].indexOf(k) >= 0 || k === (RTL ? "ArrowRight" : "ArrowLeft")) { e.preventDefault(); prevB(); }
        else if (k === "b" || k === "B" || k === ".") $p("bk").click(); else if (k === "Home") go(0); else if (k === "End") go(N - 1, true);
      });
      pw.addEventListener("resize", function () { fit2($p("bc")); fit2($p("bn")); });
      sync(cur); $("hbPV").classList.add("on");
      var watch = setInterval(function () { if (!pw || pw.closed) { clearInterval(watch); var b = $("hbPV"); if (b) b.classList.remove("on"); } }, 1000);
      say(T("اسحب «شاشة المعلم» إلى حاسوبك، واجعل العرض بملء الشاشة على شاشة الصف (F)", "Drag the presenter view to your laptop and make the deck full screen on the class display (F)"));
    }
    on("hbPV", openPV);
    W.addEventListener("pagehide", function () { try { if (pw && !pw.closed) pw.close(); } catch (e) {} });

    /* ---------- مؤقّت الصف والتنبيه: يُشغَّلان من الجوال، ويظهران على شاشة الصف وأجهزة الطلاب ---------- */
    var TM = { t: 0, end: 0, rem: 0, run: false, done: false }, tmBox = mk("div", "hbTm"), bellBox = mk("div", "hbBell"), tmIv = 0, bellT = 0, doneT = 0, bellN = 0, ac = null;
    var sndOn = LS.get("hb-snd", "1") !== "0", tmHook = function () {};
    tmBox.setAttribute("role", "timer"); bellBox.setAttribute("aria-live", "assertive");
    var fmtT = function (s) { s = Math.max(0, Math.ceil(s)); return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); };
    var tmLeft = function () { return TM.run ? Math.max(0, TM.end - Date.now()) / 1000 : TM.rem; };
    var tmActive = function () { return TM.t > 0 && (TM.run || TM.rem > 0 || TM.done); };
    var audio = function () { try { if (!ac) ac = new (W.AudioContext || W.webkitAudioContext)(); if (ac.state === "suspended") ac.resume(); } catch (e) {} return ac; };
    ["pointerdown", "keydown"].forEach(function (k) { D.addEventListener(k, function () { if (sndOn) audio(); }, true); });
    var tone = function (seq) {
      if (!sndOn) return; var A = audio(); if (!A) return; var t0 = A.currentTime + 0.02;
      seq.forEach(function (n) { try { var o = A.createOscillator(), g = A.createGain(), a = t0 + n[1]; o.type = "sine"; o.frequency.value = n[0]; g.gain.setValueAtTime(0.0001, a); g.gain.exponentialRampToValueAtTime(0.35, a + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, a + n[2]); o.connect(g); g.connect(A.destination); o.start(a); o.stop(a + n[2] + 0.05); } catch (e) {} });
    };
    var CIRC = 527.79, tmP, tmT, tmS;
    (function () {
      var dots = ""; for (var i = 0; i < 12; i++) { var an = i * Math.PI / 6; dots += '<circle class="tm-dot" cx="' + (100 + 92 * Math.sin(an)).toFixed(1) + '" cy="' + (100 - 92 * Math.cos(an)).toFixed(1) + '" r="' + (i % 3 === 0 ? 2.6 : 1.6) + '"/>'; }
      var lantern = '<g transform="translate(86,-20)"><path d="M14 0v5" stroke="#D4AA55" stroke-width="1.8" fill="none"/><path d="M6 11h16l-3-6H9z" fill="#D4AA55"/><rect x="5" y="11" width="18" height="22" rx="6" fill="#102A4C" stroke="#D4AA55" stroke-width="2"/><ellipse cx="14" cy="22" rx="3.4" ry="6" fill="#FFD25C"/><path d="M8 35h12l-1.5 4h-9z" fill="#D4AA55"/></g>';
      tmBox.innerHTML = '<svg viewBox="0 0 200 200" aria-hidden="true"><circle class="tm-bg" cx="100" cy="100" r="96"/>' + dots + '<circle class="tm-in" cx="100" cy="100" r="68"/><circle class="tm-tr" cx="100" cy="100" r="84"/><circle class="tm-pr" cx="100" cy="100" r="84" stroke-dasharray="' + CIRC + '" stroke-dashoffset="0"/>' + lantern + '<text class="tm-t" x="100" y="114">00:00</text><text class="tm-s" x="100" y="142">' + T("حراء", "Hiraa") + "</text></svg>";
      tmP = tmBox.querySelector(".tm-pr"); tmT = tmBox.querySelector(".tm-t"); tmS = tmBox.querySelector(".tm-s");
    })();
    var paintTm = function () {
      var s = tmLeft(), vis = tmActive(), frac = TM.t > 0 ? Math.max(0, Math.min(1, s / TM.t)) : 0;
      tmBox.classList.toggle("on", vis); tmBox.classList.toggle("q", !!TM.q); tmBox.classList.toggle("low", !TM.q && TM.run && s <= 10); tmBox.classList.toggle("mid", !TM.q && TM.run && s > 10 && frac <= 0.3); tmBox.classList.toggle("end", TM.done);
      tmP.setAttribute("stroke-dashoffset", (CIRC * (1 - frac)).toFixed(1));
      var t = TM.done ? (TM.q ? "✓" : "⏰") : fmtT(s); if (tmT.textContent !== t) tmT.textContent = t;
      var l = TM.done ? (TM.q ? T("انتهى وقت التفكير", "Thinking time is over") : T("انتهى الوقت", "Time is up")) : TM.run ? (TM.q ? T("وقت التفكير", "Thinking time") : T("حراء", "Hiraa")) : "⏸ " + T("متوقّف", "Paused"); if (tmS.textContent !== l) tmS.textContent = l;
    };
    var tmFinish = function () {
      clearInterval(tmIv); TM.run = false; TM.rem = 0; TM.done = true; paintTm();
      if (!TM.q) tone([[880, 0, 0.5], [1175, 0.35, 0.5], [1568, 0.7, 1.0]]); else tone([[523, 0, 0.5]]); tmHook();
      clearTimeout(doneT); doneT = setTimeout(function () { TM.done = false; TM.t = 0; paintTm(); tmHook(); }, 8000);
    };
    var tmDo = function (a, s, q) {
      s = Math.round(+s) || 0; clearTimeout(doneT); if (a === "start" && s > 0) TM.q = !!+q;
      if (a === "start") {
        if (s > 0) { TM.t = Math.min(s, 5999); TM.end = Date.now() + TM.t * 1000; TM.run = true; TM.done = false; }
        else if (!TM.run && TM.rem > 0) { TM.end = Date.now() + TM.rem * 1000; TM.run = true; TM.done = false; }
      } else if (a === "pause") { if (TM.run) { TM.rem = tmLeft(); TM.run = false; } }
      else if (a === "add") {
        if (TM.run) { TM.end = Math.max(Date.now() + 1000, TM.end + s * 1000); TM.t = Math.max(TM.t, Math.ceil(tmLeft())); }
        else if (TM.rem > 0) { TM.rem = Math.min(5999, Math.max(5, TM.rem + s)); TM.t = Math.max(TM.t, TM.rem); }
      } else if (a === "reset") { TM.t = 0; TM.rem = 0; TM.run = false; TM.done = false; }
      if (a === "start" && s > 0) TM.half = false;
      clearInterval(tmIv); if (TM.run) tmIv = setInterval(function () {
        var l = tmLeft();
        if (l <= 0) return tmFinish();
        if (!TM.q && !TM.half && TM.t >= 60 && l <= TM.t / 2) { TM.half = true; tone([[660, 0, 0.25], [660, 0.3, 0.25]]); say("⏱ " + T("مضى نصف الوقت", "Half the time has passed")); tmHook(); }
        paintTm();
      }, 250);
      paintTm(); tmHook();
    };
    /* جدول التنبيهات: [رمز، عربي، إنجليزي، لون، لون الخط، نغمة، تشجيع؟] — يتكرّر في app.js لأجهزة الطلاب */
    var AL = [
      ["🔔", "انتباه", "Attention", "#D4AA55", "#1B1405", [[784, 0, 0.35], [1047, 0.25, 0.6]]],
      ["🤫", "هدوءًا من فضلكم", "Quiet please", "#5B7FA6", "#fff", [[392, 0, 0.6], [330, 0.45, 0.9]]],
      ["📝", "استعدّوا", "Get ready", "#14A37F", "#fff", [[523, 0, 0.2], [659, 0.25, 0.2], [784, 0.5, 0.45]]],
      ["🚀", "ابدأوا الآن", "Start now", "#3B82F6", "#fff", [[523, 0, 0.15], [659, 0.15, 0.15], [784, 0.3, 0.15], [1047, 0.45, 0.55]]],
      ["✋", "توقّفوا لحظة", "Pause for a moment", "#E8833A", "#fff", [[880, 0, 0.18], [880, 0.25, 0.18], [659, 0.5, 0.55]]],
      ["⏳", "تبقّت دقيقة", "One minute left", "#B3261E", "#fff", [[659, 0, 0.3], [523, 0.4, 0.6]]],
      ["🧹", "رتّبوا أدواتكم", "Tidy up", "#8B5CF6", "#fff", [[587, 0, 0.25], [784, 0.3, 0.25], [587, 0.6, 0.5]]],
      ["🔄", "بدّلوا الأدوار", "Switch roles", "#0E9AA7", "#fff", [[698, 0, 0.2], [880, 0.25, 0.2], [698, 0.5, 0.2], [880, 0.75, 0.45]]],
      ["🌟", "أحسنتم", "Well done", "#D4AA55", "#1B1405", [[784, 0, 0.2], [988, 0.18, 0.2], [1175, 0.36, 0.2], [1568, 0.54, 0.8]]],
      ["🤲", "جزاكم الله خيرًا", "Jazakum Allahu khayran", "#14A37F", "#fff", [[523, 0, 0.3], [659, 0.3, 0.3], [784, 0.6, 0.8]]],
      ["🌙", "بارك الله فيكم", "Barakallahu feekum", "#102A4C", "#FFF0C2", [[440, 0, 0.3], [554, 0.3, 0.3], [659, 0.6, 0.8]]],
      ["✨", "ما شاء الله", "Masha'Allah", "#E5B83A", "#1B1405", [[988, 0, 0.2], [1319, 0.2, 0.2], [1568, 0.4, 0.7]]],
      ["💛", "شكرًا لكم", "Thank you", "#F0962E", "#1B1405", [[659, 0, 0.25], [784, 0.25, 0.25], [988, 0.5, 0.6]]],
      ["🏅", "ممتاز", "Excellent", "#2E9E6A", "#fff", [[698, 0, 0.2], [880, 0.2, 0.2], [1047, 0.4, 0.2], [1397, 0.6, 0.8]]]
    ], lastAk = 0;
    var alertDo = function (i) {
      i = +i; if (!(i >= 0 && i < AL.length)) i = 0; var a = AL[i], praise = i >= 8;
      bellN++; lastAk = i; tone(a[5]);
      bellBox.textContent = a[0] + " " + T(a[1], a[2]); bellBox.style.background = a[3]; bellBox.style.color = a[4]; bellBox.classList.add("on");
      if (praise) burst(["⭐", "🌟", "✨"]);
      clearTimeout(bellT); bellT = setTimeout(function () { bellBox.classList.remove("on"); }, praise ? 3200 : 2600); tmHook();
    };
    var bell = function () { alertDo(0); };
    /* ما يُضاف إلى موضع العرض المحفوظ ليصل أجهزة الطلاب: المؤقّت (وقت الانتهاء المطلق) وعدّاد التنبيه */
    W.__hbPosX = function () { return { ak: lastAk, tm: tmActive() ? (TM.run ? { e: TM.end, t: Math.round(TM.t), q: TM.q ? 1 : 0 } : TM.done ? { d: 1, t: Math.round(TM.t), q: TM.q ? 1 : 0 } : { r: Math.round(TM.rem), t: Math.round(TM.t), q: TM.q ? 1 : 0 }) : 0, bl: bellN }; };
    W.__hbTimer = { do: tmDo, bell: bell, alert: alertDo };

    /* ---------- التحكم من الجوال ---------- */
    if (!LIVE) { var rb = $("hbRemote"); if (rb) rb.remove(); return; }
    var sb = HX.sb, rch = null, rkey = null, lastSeen = 0, remPop = mk("div", "hbRemPop");
    remPop.className = "pop hb-pop"; remPop.dir = RTL ? "rtl" : "ltr"; stop(remPop);
    var rUrl = function () { return String(HX.joinUrl).replace(/#\/live$/, "") + "#/remote/" + rkey; };
    var withTl = false, state = function () { var L = liveInfo(); return { cur: cur, n: N, title: title, st: stTitle(cur), nx: cur + 1 < N ? stTitle(cur + 1) : "", nt: notesOf(cur).slice(0, 2500), black: black.classList.contains("on"), live: L && L.on ? { p: L.players, a: L.answered, q: !!L.q } : null, rtl: RTL, bt: SL[cur] ? SL[cur].querySelectorAll("[data-build-in]").length : 0, bl: SL[cur] ? SL[cur].querySelectorAll("[data-build-in].hid").length : 0, id: cmdId, tm: tmActive() ? { r: Math.round(tmLeft()), run: TM.run ? 1 : 0, t: Math.round(TM.t), d: TM.done ? 1 : 0, h: TM.half ? 1 : 0, q: TM.q ? 1 : 0 } : null, md: mediaState(), ma: maState(), cu: curState(), hp: hpList(), snd: sndOn ? 1 : 0, bz: W.__hbBuzz && W.__hbBuzz.on() ? W.__hbBuzz.get() : null, tp: W.__hbTeams ? W.__hbTeams.get() : [], nn: notesGet().length, nl: notesGet().slice(-4).reverse().map(function (x) { return { g: x.g, x: x.x, s: x.s }; }), tl: withTl ? SL.map(function (x, i) { return stTitle(i).slice(0, 48); }) : undefined }; };
    /* ملاحظات سريعة من الجوال: تُحفظ على جهاز المعلم وتدخل تقرير الحصة، ولا تظهر على شاشة الفصل */
    var notesKey = "hb-notes-" + DECK;
    var notesGet = function () { try { var a = JSON.parse(LS.get(notesKey, "[]")); return Array.isArray(a) ? a : []; } catch (e) { return []; } };
    var noteAdd = function (g, x) {
      g = String(g || "").slice(0, 40); x = String(x || "").slice(0, 300); if (!g && !x) return;
      var a = notesGet(), lid = W.__hbLiveId ? W.__hbLiveId() : null; a.push({ t: Date.now(), s: cur + 1, g: g, x: x, l: lid || 0 }); LS.set(notesKey, JSON.stringify(a.slice(-300)));
    };
    var cmdId = 0, pushT = 0, pushSoon = function () { clearTimeout(pushT); pushT = setTimeout(push, 120); };
    /* الفيديو والصوت داخل الشريحة: رفع وخفض وكتم وتشغيل وتقديم من الجوال */
    var mediaEls = function () { var s = SL[cur], l = s ? [].slice.call(s.querySelectorAll("video,audio")) : []; [].forEach.call(D.querySelectorAll("video,audio"), function (m) { if (!m.paused && l.indexOf(m) < 0) l.push(m); }); return l; };
    var mediaMain = function (l) { return l.filter(function (x) { return !x.paused; })[0] || l[0]; };
    var mediaState = function () { var l = mediaEls(); if (!l.length) return null; var m = mediaMain(l); return { v: Math.round(m.volume * 100), mu: m.muted ? 1 : 0, p: m.paused ? 1 : 0 }; };
    var mediaDo = function (a, x) {
      var l = mediaEls(); if (!l.length) return; var m = mediaMain(l);
      if (a === "vol") { var v = Math.max(0, Math.min(1, Math.round((m.volume + (+x || 0) / 100) * 100) / 100)); l.forEach(function (e) { e.volume = v; if (v > 0 && +x > 0) e.muted = false; }); }
      else if (a === "mute") { var mu = !m.muted; l.forEach(function (e) { e.muted = mu; }); }
      else if (a === "play") { if (m.paused) { var pr = m.play(); if (pr && pr.catch) pr.catch(function () {}); } else m.pause(); }
      else if (a === "seek") { try { m.currentTime = Math.max(0, Math.min(m.duration || 1e9, m.currentTime + (+x || 0))); } catch (e) {} }
    };
    ["volumechange", "play", "pause", "ended"].forEach(function (t) { D.addEventListener(t, function () { if (rch) pushSoon(); }, true); });
    /* زر «الإجابة النموذجية» في الشريحة الحالية (يُلتقط بعنوانه) */
    var maBoxes = function () { var s = SL[cur]; return s ? [].slice.call(s.querySelectorAll(".mabox")) : []; };
    var maState = function () { var b = maBoxes(); if (b.length) return b.some(function (e) { return e.classList.contains("on"); }) ? 2 : 1; return ansEl() ? 1 : 0; };
    var curState = function () { return curt.classList.contains("on") ? Math.round(curtY * 100) : -1; };
    var curDo = function (a, x) {
      var o = curt.classList.contains("on");
      if (a === "cover") { if (!o) $("hbCurt").click(); else { curtY = 0; place(); } }
      else if (a === "step") { if (!o) $("hbCurt").click(); curtY = Math.max(0, Math.min(1, curtY + (+x || 0) / 100)); place(); if (curtY > 0.97) { curt.classList.remove("on"); $("hbCurt").classList.remove("on"); } }
      else if (a === "off") { if (o) $("hbCurt").click(); }
    };
    var ansEl = function () { var s = SL[cur]; if (!s) return null; return [].slice.call(s.querySelectorAll("button,[role=button],summary,.btn,[onclick],[data-ans]")).filter(function (e) { return e.hasAttribute("data-ans") || /الإجابة النموذجية|إجابة نموذجية|model answer/i.test(e.textContent || ""); })[0] || null; };
    /* طلبات المساعدة من الطلاب (قناة بث باسم الحصة، بلا قاعدة بيانات) */
    var hp = {}, hch = null, hid = null;
    var hpList = function () { var now = Date.now(); return Object.keys(hp).filter(function (n) { return now - hp[n] < 300000; }).sort(function (a, b) { return hp[a] - hp[b]; }).slice(0, 8); };
    setInterval(function () {
      var id = W.__hbLiveId ? W.__hbLiveId() : null; if (id === hid) return;
      if (hch) try { sb.removeChannel(hch); } catch (e) {} hch = null; hid = id; hp = {}; if (!id) return;
      hch = sb.channel("hlp-" + id, { config: { broadcast: { self: false } } }).on("broadcast", { event: "help" }, function (m) {
        var n = String((m.payload || {}).n || "").replace(/[<>&]/g, "").slice(0, 30); if (!n) return;
        var isNew = !hp[n] || Date.now() - hp[n] > 300000; hp[n] = Date.now();
        if (isNew) { say("✋ " + n + " " + T("يحتاج مساعدة", "needs help")); tone([[523, 0, 0.2]]); }
        push();
      }).subscribe();
    }, 2000);
    new MutationObserver(function () { if (rch) pushSoon(); }).observe(stage, { subtree: true, attributes: true, attributeFilter: ["class"] });
    var push = function () { if (rch) rch.send({ type: "broadcast", event: "state", payload: state() }); };
    W.__hbPush = function () { pushSoon(); };
    W.__hbSend = function (ev, p) { if (!rch || !lastSeen) return false; rch.send({ type: "broadcast", event: ev, payload: p }); return true; };
    var pushTl = function () { withTl = true; push(); withTl = false; };
    tmHook = function () { push(); if (W.__hbPosKick) W.__hbPosKick(); };
    subs.push(function () { push(); });
    function connect() {
      rkey = (crypto.randomUUID ? crypto.randomUUID().replace(/-/g, "") : String(Math.random()).slice(2) + Date.now()).slice(0, 14);
      try { sessionStorage.setItem("hb-remote-" + DECK, rkey); } catch (e) {}
      listen();
    }
    function listen() {
      if (rch) try { sb.removeChannel(rch); } catch (e) {}
      rch = sb.channel("hbr-" + rkey, { config: { broadcast: { self: false } } })
        .on("broadcast", { event: "cmd" }, function (m) {
          var c = (m.payload || {}).c; lastSeen = Date.now(); paintRem(); if (m.payload.id) cmdId = m.payload.id;
          if (black.classList.contains("on") && (c === "next" || c === "prev" || c === "skip")) toggleBlack();
          if (c === "next") nextB(); else if (c === "prev") prevB(); else if (c === "first") go(0);
          else if (c === "skip") go(Math.min(N - 1, cur + 1));
          else if (c === "go") go(+m.payload.k || 0);
          else if (c === "black") { toggleBlack(); push(); }
          else if (c === "pick") { $("hbPick").click(); setTimeout(function () { var g = $("hbGo"); if (g) g.click(); setTimeout(function () { rch.send({ type: "broadcast", event: "pick", payload: { name: ($("hbPickOut") || {}).textContent || "" } }); }, 1900); }, 150); }
          else if (c === "hello") pushTl();
          else if (c === "tm") tmDo(m.payload.a, m.payload.s, m.payload.q);
          else if (c === "bz") { if (W.__hbBuzz) W.__hbBuzz.do(m.payload.a, m.payload.i); }
          else if (c === "tp") { if (W.__hbTeams) W.__hbTeams.add(+m.payload.i, +m.payload.d > 0 ? 1 : -1); }
          else if (c === "note") noteAdd(m.payload.g, m.payload.x);
          else if (c === "pickp") { var Rp = left(); if (!Rp.length) { used = []; Rp = left(); } var wn = Rp[Math.floor(Math.random() * Rp.length)]; if ($("hbNoRep").checked) { used.push(wn); SS.set("hb-used-" + DECK, used); } var lf = left() && $("hbNoRep").checked ? Rp.length - 1 : 0; rch.send({ type: "broadcast", event: "pick", payload: { name: wn, priv: 1, left: lf } }); }
          else if (c === "bell") bell();
          else if (c === "md") mediaDo(m.payload.a, m.payload.x);
          else if (c === "ans") { var bx = maBoxes(); if (bx.length) { var shown = bx.some(function (e) { return e.classList.contains("on"); }), want = m.payload.a === "show" ? true : m.payload.a === "hide" ? false : !shown; bx.forEach(function (e) { e.classList.toggle("on", want); }); } else { var ae = ansEl(); if (ae) ae.click(); } }
          else if (c === "al") alertDo(m.payload.i);
          else if (c === "cur") curDo(m.payload.a, m.payload.x);
          else if (c === "hpclr") hp = {};
          else if (c === "snd") { sndOn = !!+m.payload.on; LS.set("hb-snd", sndOn ? "1" : "0"); if (sndOn) { audio(); tone([[660, 0, 0.18]]); } }
          pushSoon(); setTimeout(push, 500);
        }).subscribe(function (s) { if (s === "SUBSCRIBED") pushTl(); });
    }
    function qrRem(el) { (W.QRCode ? Promise.resolve(W.QRCode) : new Promise(function (res, rej) { var sc = D.createElement("script"); sc.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"; sc.onload = function () { res(W.QRCode); }; sc.onerror = rej; D.head.appendChild(sc); }))
      .then(function (Q) { el.innerHTML = ""; new Q(el, { text: rUrl(), width: 170, height: 170, colorDark: "#0A1D36", colorLight: "#ffffff", correctLevel: Q.CorrectLevel.M }); }).catch(function () {}); }
    function paintRem() {
      var ok = Date.now() - lastSeen < 15000;
      remPop.innerHTML = '<div class="hb-h">📱 ' + T("تحكّم بالعرض من جوالك", "Control the slides from your phone") + '</div><div class="hb-join"><div class="hb-qr" id="hbRQr" style="width:170px;height:170px"></div><div><p>' + T("امسح الرمز بكاميرا جوالك، وادخل بحساب المعلم نفسه. فتتنقّل بين الشرائح وترى ملاحظاتك وأنت تتجوّل بين الطلاب.", "Scan with your phone camera and sign in with the same teacher account. Move through the slides and read your notes while you walk around the class.") +
        '</p><p style="font-weight:700;color:' + (ok ? "#1B6B3A" : "#A85F0C") + '">' + (ok ? "✓ " + T("الجوال متصل", "Phone connected") : "⏳ " + T("بانتظار الجوال…", "Waiting for the phone…")) + '</p></div></div><p class="hb-muted">' + T("💡 يعمل أيضًا مؤشّر العروض اللاسلكي (Clicker) مباشرة دون إعداد.", "💡 A wireless presentation clicker also works with no setup.") + "</p>";
      qrRem($("hbRQr"));
    }
    on("hbRemote", function (e, b) { if (!rkey) connect(); paintRem(); togglePop(remPop, b); b.classList.add("on"); });
    var old = null; try { old = sessionStorage.getItem("hb-remote-" + DECK); } catch (e) {}
    if (old) { rkey = old; listen(); $("hbRemote").classList.add("on"); }
    W.addEventListener("pagehide", function () { if (rch) try { sb.removeChannel(rch); } catch (e) {} });
  })();

  /* تلميحات الأزرار */
  var tip = mk("div", "hbTip");
  tb.addEventListener("pointerover", function (e) { var t = e.target.closest("[data-tip]"); if (!t || !tb.contains(t)) return; tip.textContent = t.dataset.tip; tip.classList.add("on");
    var r = t.getBoundingClientRect(), w = tip.offsetWidth; tip.style.top = (r.bottom + 8) + "px"; tip.style.left = Math.max(6, Math.min(innerWidth - w - 6, r.left + r.width / 2 - w / 2)) + "px"; });
  tb.addEventListener("pointerout", function (e) { var t = e.target.closest("[data-tip]"); if (t && e.relatedTarget && t.contains(e.relatedTarget)) return; tip.classList.remove("on"); });
  tb.addEventListener("click", function () { tip.classList.remove("on"); }, true);
  /* لوحات العرض القديمة حين تُفتح من لوحة المفاتيح: تُثبَّت تحت زرّها الجديد */
  [["pP", "hbPg"], ["pT", "hbT"], ["pS", "hbS"]].forEach(function (m) { var p = $(m[0]); if (!p || !$(m[1])) return;
    new MutationObserver(function () { if (p.style.display !== "block" || p._hbA) return; p._hbA = 1; anchor(p, $(m[1])); setTimeout(function () { p._hbA = 0; }, 0); }).observe(p, { attributes: true, attributeFilter: ["style"] }); });
  $("hbZo").disabled = true;

  /* ---------- السبورة الذكية واللمس: شريط سفلي قريب من يد المعلم، والسحب للتنقّل، والقلم الرقمي ---------- */
  (function () {
    var dock = mk("div", "hbDock"); dock.setAttribute("role", "toolbar"); dock.setAttribute("aria-label", T("أدوات السبورة", "Board tools")); stop(dock);
    var DB = function (id, icon, tip, cls, flip) { return '<button type="button" id="' + id + '" class="' + (cls || "") + '" aria-label="' + tip + '" title="' + tip + '">' + ic(icon, flip) + "</button>"; };
    dock.innerHTML = DB("hdPrev", "prev", T("السابق", "Previous"), "hbd-nav", RTL) + "<i></i>" + DB("hdPen", "pen", T("قلم", "Pen")) + DB("hdHl", "hl", T("قلم تظليل", "Highlighter")) + DB("hdEr", "eraser", T("ممحاة", "Eraser")) + DB("hdUndo", "undo", T("تراجع", "Undo")) + DB("hdOff", "close", T("إنهاء الكتابة", "Stop drawing")) + "<i></i>" + DB("hdNext", "next", T("التالي", "Next"), "hbd-nav", RTL);
    var sync = function () { [["hdPen", "hbTpen"], ["hdHl", "hbThl"], ["hdEr", "hbTeraser"]].forEach(function (m) { $(m[0]).classList.toggle("on", $(m[1]).classList.contains("on")); }); };
    $("hdPrev").onclick = function () { $("hbPrev").click(); }; $("hdNext").onclick = function () { $("hbNext").click(); };
    $("hdPen").onclick = function () { $("hbTpen").click(); sync(); }; $("hdHl").onclick = function () { $("hbThl").click(); sync(); }; $("hdEr").onclick = function () { $("hbTeraser").click(); sync(); };
    $("hdUndo").onclick = function () { $("hbUndo").click(); }; $("hdOff").onclick = function () { ["hbTpen", "hbThl", "hbTeraser", "hbTtext", "hbTlaser", "hbTpan", "hbSpot"].forEach(function (id) { var b = $(id); if (b && b.classList.contains("on")) b.click(); }); sync(); };
    new MutationObserver(sync).observe(tb, { subtree: true, attributes: true, attributeFilter: ["class"] });
    var coarse = W.matchMedia && W.matchMedia("(pointer: coarse)").matches;
    var want = LS.get("hb-dock", coarse ? "1" : "") === "1";
    var setDock = function (on) { want = on; LS.set("hb-dock", on ? "1" : ""); dock.classList.toggle("on", on); D.documentElement.classList.toggle("hb-dockon", on); var b = $("hbDockT"); if (b) b.classList.toggle("on", on); };
    setDock(want);
    W.__hbDock = setDock; W.__hbDockOn = function () { return want; };
    /* السحب بالإصبع على الشريحة للتنقّل (حين لا تكون أداة كتابة مفعّلة) */
    var sx = null;
    wrap.addEventListener("pointerdown", function (e) { if (e.pointerType === "mouse") return; if (e.pointerType === "pen" && !$("hbTpen").classList.contains("on") && !$("hbThl").classList.contains("on") && !$("hbTeraser").classList.contains("on")) { $("hbTpen").click(); say(T("✏️ القلم جاهز: اكتب على الشريحة", "✏️ Pen ready: write on the slide")); return; } sx = { x: e.clientX, y: e.clientY, t: Date.now() }; }, true);
    wrap.addEventListener("pointerup", function (e) {
      if (!sx) return; var dx = e.clientX - sx.x, dy = e.clientY - sx.y, dt = Date.now() - sx.t; sx = null;
      if (dt > 700 || Math.abs(dx) < 70 || Math.abs(dy) > Math.abs(dx) * 0.6) return;
      var fwd = RTL ? dx > 0 : dx < 0; swallow = Date.now(); (fwd ? $("hbNext") : $("hbPrev")).click();
    }, true);
    var swallow = 0;
    wrap.addEventListener("click", function (e) { if (e.isTrusted && Date.now() - swallow < 400) { e.stopPropagation(); e.stopImmediatePropagation(); e.preventDefault(); } }, true);
    on("hbDockT", function () { setDock(!want); say(want ? T("ظهر شريط السبورة أسفل الشاشة", "Board bar shown at the bottom") : T("أُخفي شريط السبورة", "Board bar hidden")); });
  })();

  /* ---------- إمكانية الوصول: إعلان الشريحة، والحالة المضغوطة للأزرار، وأدوار اللوحات ---------- */
  (function () {
    tb.setAttribute("role", "toolbar"); tb.setAttribute("aria-label", T("شريط العرض", "Presenter toolbar"));
    hint.setAttribute("role", "status"); hint.setAttribute("aria-live", "polite");
    var ann = mk("div", "hbAnn"); ann.className = "hb-sr"; ann.setAttribute("aria-live", "polite");
    var stt = function (k) { var s2 = SL[k]; return s2 ? ((s2.querySelector("h1,h2,h3") || {}).textContent || "").replace(/\s+/g, " ").trim() : ""; };
    slideFx.push(function (k, ch) { if (ch) ann.textContent = T("الشريحة ", "Slide ") + (k + 1) + T(" من ", " of ") + N + (stt(k) ? ": " + stt(k) : ""); });
    var TOG = ["hbTpan", "hbTlaser", "hbTpen", "hbThl", "hbTtext", "hbTeraser", "hbSpot", "hbCurt", "hbBoard", "hbBlack", "hbSup", "hbClass", "hbNo", "hbE"];
    var aria = function () { TOG.forEach(function (id) { var b = $(id); if (b) b.setAttribute("aria-pressed", b.classList.contains("on") ? "true" : "false"); }); };
    aria(); new MutationObserver(aria).observe(tb, { subtree: true, attributes: true, attributeFilter: ["class"] });
    var dlg = function () { D.querySelectorAll(".hb-pop,#hbClassOv,#hbResP").forEach(function (p) { if (!p.getAttribute("role")) { p.setAttribute("role", "dialog"); var h = p.querySelector(".hb-h,.ct-h"); p.setAttribute("aria-label", h ? h.textContent.trim().slice(0, 60) : T("لوحة", "Panel")); } }); };
    dlg(); setTimeout(dlg, 1500);
  })();

  /* ---------- البدء ---------- */
  W.addEventListener("resize", function () { requestAnimationFrame(fit); });
  setTimeout(fit, 30); onSlide(); updSw(); fit();
  if (D.fonts && D.fonts.ready) D.fonts.ready.then(fit);
  ["bNo", "bE"].forEach(function (id) { var o = $(id); if (o) new MutationObserver(function () { var m = { bNo: "hbNo", bE: "hbE" }[id]; if ($(m)) $(m).classList.toggle("on", o.classList.contains("on")); }).observe(o, { attributes: true, attributeFilter: ["class"] }); });
})();
