/* حراء · شريط العرض (Hiraa presenter bar)
   يُحقن في عروض المعلم HTML عند فتحها من المنصة، فيستبدل الشريط القديم بشريطين:
   الأول للهوية وأدوات الحصة، والثاني للتنقّل والتكبير والكتابة على الشريحة.
   لا يعدّل ملف العرض نفسه: يستدعي أزراره القديمة ودوالّه (show، next، prev) كما هي. */
(function () {
  "use strict";
  var D = document, W = window;
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
    moon: "M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z",
    film: "M4 4h16v16H4zM4 9h16M4 15h16M9 4v5M15 4v5M9 15v5M15 15v5",
    chart: "M3 3v18h18M7 15l4-4 3 3 5-6",
    timer: "M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 9v4l2.5 2M9 2h6",
    bell: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0",
    dice: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8 8h.01M16 8h.01M12 12h.01M8 16h.01M16 16h.01",
    notes: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h6",
    edit: "M11 4H4v16h16v-7M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z",
    save: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8",
    keys: "M3 6h18v12H3zM7 10h.01M11 10h.01M15 10h.01M7 14h10",
    users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
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
    "#tb.hb .hb-lbl{display:inline}",
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
    "#hbSavePop{width:340px}",
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
    "#hbLSpot{position:fixed;left:0;right:0;top:var(--hb-lay);bottom:0;z-index:10;pointer-events:none;display:none}",
    "#hbLSpot.on{display:block}",
    "#hbLBlack{position:fixed;left:0;right:0;top:var(--hb-lay);bottom:0;z-index:11;display:none;background:#05080E;align-items:center;justify-content:center;color:rgba(255,255,255,.25);font:600 18px 'Thmanyah Text',Tahoma,sans-serif;cursor:pointer}",
    "#hbLBlack.on{display:flex}",
    "#hbLBoard{position:fixed;z-index:7;display:none;background:#FFFEFA;background-image:linear-gradient(rgba(16,42,76,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(16,42,76,.07) 1px,transparent 1px);box-shadow:0 0 0 9999px rgba(14,22,33,.35)}",
    "#hbLBoard.on{display:block}",
    "#hbLBoard b{position:absolute;top:12px;" + (RTL ? "right" : "left") + ":16px;font:700 18px 'Thmanyah Display',Tahoma,sans-serif;color:rgba(16,42,76,.45)}",
    "#hbLCurt{position:fixed;z-index:9;display:none;overflow:hidden}",
    "#hbLCurt.on{display:block}",
    "#hbLCurt .hb-cv{position:absolute;left:0;right:0;bottom:0;background:#102A4C;background-image:repeating-linear-gradient(90deg,rgba(255,255,255,.05) 0 2px,transparent 2px 26px),linear-gradient(180deg,#17325A,#0B1C33);box-shadow:0 -10px 30px rgba(0,0,0,.35)}",
    "#hbLCurt .hb-ch{position:absolute;left:50%;top:14px;transform:translateX(-50%);height:44px;padding:0 18px;border-radius:22px;background:#D4AA55;color:#1B1405;display:flex;align-items:center;gap:8px;font:700 16px 'Thmanyah Text',Tahoma,sans-serif;cursor:ns-resize;box-shadow:0 6px 18px rgba(0,0,0,.35);user-select:none;touch-action:none;white-space:nowrap}",
    "#hbHint{position:fixed;left:50%;bottom:22px;transform:translateX(-50%) translateY(20px);opacity:0;background:#0F2340;color:#fff;font:15px 'Thmanyah Text',Tahoma,sans-serif;padding:8px 16px;border-radius:12px;z-index:45;pointer-events:none;transition:opacity .25s,transform .25s;box-shadow:0 8px 24px rgba(0,0,0,.35)}",
    "#hbHint.on{opacity:1;transform:translateX(-50%)}",
    "#hbZone{position:fixed;left:0;right:0;top:0;height:14px;z-index:19;display:none}",
    "@media (prefers-reduced-motion:reduce){#tb.hb,#hbDrawer,#wrap{transition:none!important}}"
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
    ($("bNo") ? B("hbNo", "notes", T("ملاحظات المعلم (N)", "Teacher notes (N)"), T("الملاحظات", "Notes")) : "") +
    ($("bE") ? B("hbE", "edit", T("تعديل نصوص الشريحة", "Edit slide text"), T("تعديل", "Edit")) : "") +
    "</div>" +
    '<span class="hb-sep"></span>' +
    B("hbPV", "pv", T("شاشة المعلم: الملاحظات والشريحة التالية على حاسوبك", "Presenter view: notes and next slide on your laptop")) +
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
    '<div class="hb-g">' + B("hbSpot", "spot", T("الكشّاف: يُظلم كل شيء إلا ما تشير إليه (S)", "Spotlight (S)")) + B("hbCurt", "curtain", T("الستارة: اكشف الشريحة تدريجيًّا", "Curtain reveal")) +
    B("hbBoard", "board", T("سبورة بيضاء (W)", "Whiteboard (W)")) + B("hbBlack", "moon", T("شاشة سوداء (B)", "Black screen (B)")) + B("hbKeys", "keys", T("اختصارات لوحة المفاتيح", "Keyboard shortcuts")) + "</div>" +
    '<div class="hb-pbar"><div class="hb-prog" id="hbProg"></div></div>';
  tb.classList.add("hb"); tb.appendChild(r1); tb.appendChild(r2);
  r2.querySelector(".hb-pbar").style.display = "block";
  r2.querySelector(".hb-prog").style.cssText = "position:absolute;display:block;top:0;bottom:0;" + (RTL ? "right:0" : "left:0") + ";width:0";

  var mk = function (tag, id, html) { var e = D.createElement(tag); if (id) e.id = id; if (html) e.innerHTML = html; D.body.appendChild(e); return e; };
  var ink = mk("canvas", "hbInk"), laser = mk("canvas", "hbLaser"), spot = mk("div", "hbLSpot"), black = mk("div", "hbLBlack", T("شاشة سوداء · اضغط هنا أو B للعودة", "Black screen · click or press B to return"));
  var board = mk("div", "hbLBoard", "<b>" + T("السبورة", "Whiteboard") + "</b>"), curt = mk("div", "hbLCurt", '<div class="hb-cv"><div class="hb-ch">⇕ ' + T("اسحب لكشف الشريحة", "Drag to reveal") + "</div></div>");
  var hint = mk("div", "hbHint"), drawer = mk("div", "hbDrawer"), zone = mk("div", "hbZone");
  drawer.setAttribute("aria-label", T("الشرائح", "Slides")); drawer.setAttribute("role", "navigation");
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
  function onSlide() {
    var k = readCur(); var changed = k !== cur; cur = k;
    var num = $("hbNum"); if (D.activeElement !== num) num.value = k + 1;
    $("hbProg").style.width = (N > 1 ? (k / (N - 1)) * 100 : 100) + "%";
    $("hbFirst").disabled = $("hbPrev").disabled = k === 0; $("hbLast").disabled = k === N - 1;
    drawer.querySelectorAll(".hb-th").forEach(function (t, i) { t.classList.toggle("cur", i === k); });
    if (changed) { var c = drawer.querySelector(".hb-th.cur"); if (c && drawer.classList.contains("open")) c.scrollIntoView({ block: "nearest", behavior: "smooth" }); if (curt.classList.contains("on")) { curtY = 0; place(); } }
    redraw(); if (W.__hbOnSlide) W.__hbOnSlide(k, changed);
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
    '<label class="hb-muted" style="display:inline-flex;gap:6px;align-items:center"><input type="checkbox" id="hbNoRep" checked> ' + T("بلا تكرار", "No repeats") + "</label></div>" +
    '<div class="hb-pick" id="hbPickOut">?</div><div class="hb-row"><button type="button" class="hb-btn pri" id="hbGo">🎲 ' + T("اختر الآن", "Pick now") + '</button><button type="button" class="hb-btn" id="hbReset">' + T("ابدأ من جديد", "Start over") + '</button><span class="hb-muted" id="hbLeft"></span></div>';
  stop(pickPop);
  var names = $("hbNames"), cnt = $("hbCount");
  names.value = LS.get("hb-names", ""); cnt.value = LS.get("hb-count", "25");
  names.addEventListener("input", function () { LS.set("hb-names", names.value); used = []; left(); });
  cnt.addEventListener("input", function () { LS.set("hb-count", cnt.value); used = []; left(); });
  var used = SS.get("hb-used-" + DECK) || [];
  var pool = function () { var L = names.value.split(/\n|،|,/).map(function (x) { return x.trim(); }).filter(Boolean); if (!L.length) { var n = Math.max(2, Math.min(60, parseInt(cnt.value, 10) || 25)); for (var i = 1; i <= n; i++) L.push(String(i)); } return L; };
  var left = function () { var L = pool(), r = $("hbNoRep").checked ? L.filter(function (x) { return used.indexOf(x) < 0; }) : L; $("hbLeft").textContent = $("hbNoRep").checked ? T("بقي ", "Left: ") + r.length + T(" من ", " of ") + L.length : ""; return r; };
  var spinning = false;
  on("hbGo", function () {
    if (spinning) return; var L = pool(), R = left(); if (!R.length) { used = []; R = left(); }
    var out = $("hbPickOut"), win = R[Math.floor(Math.random() * R.length)], t0 = performance.now(), dur = 1700;
    spinning = true; out.classList.remove("done"); ev("snd&&snd('drum')");
    (function tick() { var p = (performance.now() - t0) / dur; if (p >= 1) { out.textContent = win; out.classList.add("done"); spinning = false; if ($("hbNoRep").checked) { used.push(win); SS.set("hb-used-" + DECK, used); } left(); ev("snd&&snd('correct')"); return; }
      out.textContent = L[Math.floor(Math.random() * L.length)]; setTimeout(tick, 40 + 260 * p * p); })();
  });
  on("hbReset", function () { used = []; SS.set("hb-used-" + DECK, used); $("hbPickOut").textContent = "?"; $("hbPickOut").classList.remove("done"); left(); });
  $("hbNoRep").addEventListener("change", left);
  on("hbPick", function (e, b) { left(); togglePop(pickPop, b); });

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
      '<div style="border-top:1px solid rgba(16,42,76,.12);padding-top:10px"><label class="hb-ck"><input type="checkbox" id="hbKeep"' + (KEEP ? " checked" : "") + "> " + T("احتفظ بكتابتي على هذا الجهاز للحصة القادمة", "Keep my annotations on this device for next time") + "</label>" +
      '<p class="hb-muted" style="margin:4px 0 0;font-size:12.5px">' + T("دون هذا الخيار تُمحى الكتابة حين تغلق المتصفح، فيبدأ كل صف بعرض نظيف.", "Without it, annotations clear when the browser closes, so each class starts clean.") + "</p>" +
      (ks.length ? '<button type="button" class="hb-btn" id="hbClrAll" style="margin-top:8px;color:#B42318">🗑 ' + T("امسح كتابتي من كل الشرائح", "Clear annotations on all slides") + "</button>" : "") + "</div>";
    $("hbSvGo").onclick = function () { var m = (savePop.querySelector("[name=hbSv]:checked") || {}).value || "all"; exportPdf(m, $("hbSvN").checked); closePops(); };
    $("hbKeep").onchange = function () { KEEP = this.checked; LS.set("hb-keep-" + DECK, KEEP ? "1" : ""); if (KEEP) LS.set("hb-ink-" + DECK, JSON.stringify(INK)); else try { localStorage.removeItem("hb-ink-" + DECK); } catch (e) {}
      say(KEEP ? T("ستبقى كتابتك محفوظة على هذا الجهاز", "Annotations will be kept on this device") : T("ستُمحى الكتابة عند إغلاق المتصفح", "Annotations clear when the browser closes")); };
    var ca = $("hbClrAll"); if (ca) ca.onclick = function () { if (!confirm(T("مسح كل ما كتبته على الشرائح والسبورة؟", "Clear all annotations?"))) return; INK = {}; saveInk(); redraw(); paintSave(); say(T("مُسحت الكتابة كلها", "All annotations cleared")); };
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
    if (wb) html += page('<div class="wbg"></div><img class="ink" src="' + inkPng("wb") + '">', T("السبورة", "Whiteboard"), "");
    pd.open();
    pd.write('<!doctype html><html lang="' + (EN ? "en" : "ar") + '" dir="' + (RTL ? "rtl" : "ltr") + '"><head><meta charset="utf-8"><base href="' + location.href.replace(/#.*$/, "") + '"><title>' + esc(title) + " · " + T("شرح الحصة", "Lesson notes") + "</title><style>" + deckCss() + "</style><style>" +
      "@page{size:A4 landscape;margin:0}html,body{margin:0;background:#E9EDF3;font-family:'Thmanyah Text','Cairo',Tahoma,sans-serif;overflow:auto!important;height:auto!important}" +
      ".bar{position:sticky;top:0;z-index:5;display:flex;align-items:center;gap:12px;padding:12px 20px;background:#102A4C;color:#fff;font-weight:700}.bar span{flex:1}.bar button{font:700 15px inherit;font-family:inherit;border:0;border-radius:10px;padding:9px 18px;background:#D4AA55;color:#1B1405;cursor:pointer}" +
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
    var TYPES = { mc: T("اختيار من متعدد", "Multiple choice"), tf: T("صح أم خطأ", "True or false"), word: T("كلمة واحدة", "One word"), scale: T("مدى الفهم", "Understanding check"), rate: T("قياس التقدّم", "Progress check") };
    var btnLive = $("hbLive"), btnAsk = $("hbAsk"), badge = $("hbLiveN");
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
          '</p><div class="hb-row"><button type="button" class="hb-btn pri" id="hbStart">▶ ' + T("ابدأ حصة مباشرة", "Start a live lesson") + '</button></div><div id="hbPast"></div>';
        $("hbStart").onclick = start; past(); return;
      }
      sharePop.innerHTML = '<div class="hb-h">📲 ' + T("الحصة المباشرة", "Live lesson") + '</div><div class="hb-join"><div class="hb-qr" id="hbQr"></div><div><p style="margin:0">' + T("ادخلوا من", "Go to") + ' <span class="hb-url">' + esc(shortUrl()) + '</span> ' + T("ثم «تحدٍّ مباشر»، واكتبوا:", "→ “Live challenge”, then type:") + '</p><div class="hb-code">' + code3(S.code) + '</div><p class="hb-muted" style="margin:0">' + T("أو امسحوا الرمز بكاميرا الجوال", "or scan the QR code") + '</p></div></div>' +
        '<div class="hb-row" style="margin:0"><b id="hbJn">' + players.length + '</b> ' + T("طالبًا دخلوا الحصة", "students joined") + '</div><div class="hb-names" id="hbNm">' + names() + '</div>' +
        '<div class="hb-row"><button type="button" class="hb-btn pri" id="hbBigBtn">⛶ ' + T("اعرض الرمز على الشاشة", "Show the code full screen") + '</button><button type="button" class="hb-btn" id="hbRepBtn">📊 ' + T("تقرير الحصة", "Lesson report") + '</button><button type="button" class="hb-btn" id="hbEndBtn">■ ' + T("أنهِ الحصة", "End") + "</button></div>";
      qrInto($("hbQr"), 134);
      $("hbBigBtn").onclick = function () { closePops(); showBig(); };
      $("hbRepBtn").onclick = function () { report(S); };
      $("hbEndBtn").onclick = function () { if (!confirm(T("إنهاء الحصة المباشرة؟ ستبقى نتائجها في تقرير الحصة.", "End the live lesson? Its results stay in the report."))) return; step("end").then(function () { var s0 = S; stopSubs(); try { sessionStorage.removeItem(KEY); } catch (e) {} S = null; setActive(); paintShare(); say(T("انتهت الحصة · التقرير محفوظ", "Lesson ended · report saved")); report(s0); }); };
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
    function start() {
      var t = $("hbStart"); t.disabled = true; t.textContent = "…";
      sb.rpc("dl_create", { p_deck: HX.deck, p_title: title, p_lesson: HX.lesson }).then(function (r) {
        if (r.error) { t.disabled = false; t.textContent = T("ابدأ حصة مباشرة", "Start a live lesson"); say(T("تعذّر بدء الحصة: ", "Could not start: ") + r.error.message); return; }
        S = { id: r.data.id, code: r.data.code, q_seq: 0, state: "idle", q: null }; players = []; answers = [];
        try { sessionStorage.setItem(KEY, S.id); } catch (e) {}
        subscribe(); setActive(); paintShare(); closePops(); showBig();
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
        if ($("hbJn")) { $("hbJn").textContent = players.length; $("hbNm").innerHTML = names(); }
        if ($("hbBigN")) { $("hbBigN").textContent = players.length; $("hbBigNm").innerHTML = names(40); }
        if (resP.classList.contains("on")) paintRes();
      });
    }
    function loadAnswers() {
      if (!S || !S.q_seq) return;
      sb.from("deck_live_answers").select("player_id, answer").eq("live_id", S.id).eq("q_seq", S.q_seq).then(function (r) { answers = r.data || []; paintRes(); });
    }

    /* ---------- اسأل الصف ---------- */
    var ABC = RTL ? ["أ", "ب", "ج", "د", "هـ", "و"] : ["A", "B", "C", "D", "E", "F"];
    function prNow() { var k = -1; PR.forEach(function (x, j) { if (x.i === cur) k = j; }); return k; }
    function phaseGuess() { var k = prNow(); if (k >= 0) return k === 0 ? "before" : "after"; var first = PR.length ? PR[0].i : -1; return cur <= first ? "before" : "after"; }
    function paintAsk() {
      var k = prNow();
      askPop.innerHTML = '<div class="hb-h">❓ ' + T("اسأل الصف", "Ask the class") + '</div><input type="text" id="hbQt" maxlength="200" placeholder="' + T("نص السؤال (اختياري: إن كان السؤال على الشريحة فاتركه فارغًا)", "Question text (optional if it is on the slide)") + '">' +
        '<div class="hb-tiles">' +
        (PR.length ? '<button type="button" class="wide" data-t="rate">📈 ' + TYPES.rate + "<small>" + T("يقيّم كل طالب نفسه في معايير النجاح", "Each student rates the success criteria") + " (" + PR[0].rows.length + ") · " + (phaseGuess() === "before" ? T("قبل الدرس", "before the lesson") : T("بعد الدرس", "after the lesson")) + "</small></button>" : "") +
        '<button type="button" data-t="mc">🔤 ' + TYPES.mc + "<small>" + T("خيارات بالألوان، وتكشف الصحيحة", "Coloured options, reveal the answer") + '</small></button><button type="button" data-t="tf">✓✗ ' + TYPES.tf + "<small>" + T("أسرع سؤال تشخيصي", "The quickest check") + "</small></button>" +
        '<button type="button" data-t="word">☁️ ' + TYPES.word + "<small>" + T("سحابة كلمات من إجاباتهم", "A word cloud of answers") + '</small></button><button type="button" data-t="scale">😊 ' + TYPES.scale + "<small>" + T("هل فهمتم؟ بثلاثة وجوه", "Did you get it? Three faces") + "</small></button></div><div id=\"hbAskX\"></div>";
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
    function ask(q) {
      var tx = $("hbQt"); if (tx && tx.value.trim() && !q.text) q.text = tx.value.trim();
      q.slide = q.slide != null ? q.slide : cur; q.at = Date.now();
      step("ask", q).then(function () { S.q = q; answers = []; pick = null; closePops(); minimized = false; resP.classList.remove("mini"); resP.classList.add("on"); paintRes(); chip.classList.remove("on"); say(T("وصل السؤال إلى أجهزة الطلاب", "Question sent to students")); });
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
      resP.querySelectorAll("[data-a]").forEach(function (b) { b.onclick = function () {
        var a = b.dataset.a;
        if (a === "min") { minimized = !minimized; if (minimized) big = false; paintRes(); }
        else if (a === "big") { big = !big; minimized = false; paintRes(); }
        else if (a === "x") { resP.classList.remove("on"); say(T("النتائج مخفية · تظهر من «اسأل الصف»", "Results hidden · reopen from “Ask”")); }
        else if (a === "close" || a === "reopen") step(a).then(paintRes);
        else if (a === "reveal") step("reveal", { correct: pick }).then(function () { S.q.correct = pick; paintRes(); if (W.snd) try { W.snd("correct"); } catch (e) {} });
        else if (a === "new") { paintAsk(); askPop.style.display = "block"; anchor(askPop, btnAsk); }
      }; });
    }

    /* ---------- الشريحة الحالية: اقتراح تقييم المعايير على شريحة «قياس التقدّم» ---------- */
    var askedPhase = {};
    W.__hbOnSlide = function (k) {
      var j = -1; PR.forEach(function (x, i) { if (x.i === k) j = i; });
      var ph = j === 0 ? "before" : "after";
      if (S && S.state !== "done" && j >= 0 && !askedPhase[ph]) { chip.innerHTML = "📲 " + (ph === "before" ? T("اطلب من الطلاب تقييم أنفسهم قبل الدرس على أجهزتهم", "Ask students to self-rate before the lesson") : T("اطلب من الطلاب تقييم أنفسهم بعد الدرس على أجهزتهم", "Ask students to self-rate after the lesson")); chip.classList.add("on"); chip.onclick = function (e) { e.stopPropagation(); askedPhase[ph] = 1; chip.classList.remove("on"); sendRate(ph); }; }
      else chip.classList.remove("on");
    };

    /* ---------- تقرير الحصة ---------- */
    function report(row) {
      if (!row) return;
      var w = W.open("", "_blank"); if (!w) { say(T("اسمح للمتصفح بفتح نافذة جديدة لعرض التقرير", "Allow pop-ups to open the report")); return; }
      w.document.write('<!doctype html><meta charset="utf-8"><title>' + T("تقرير الحصة", "Lesson report") + '</title><body style="font-family:Tahoma,sans-serif;padding:40px;color:#102A4C">' + T("جارٍ إعداد التقرير…", "Preparing the report…") + "</body>");
      Promise.all([
        sb.from("deck_live").select("*").eq("id", row.id).maybeSingle(),
        sb.from("deck_live_players").select("id, nick, joined_at").eq("live_id", row.id).order("joined_at"),
        sb.from("deck_live_answers").select("player_id, q_seq, q, answer, at").eq("live_id", row.id).order("q_seq")
      ]).then(function (R) { w.document.open(); w.document.write(reportHtml(R[0].data || row, R[1].data || [], R[2].data || [])); w.document.close(); })
        .catch(function (e) { w.document.body.textContent = String(e && e.message || e); });
    }
    function fontCss() {
      var out = ""; [].forEach.call(D.styleSheets, function (ss) { try { [].forEach.call(ss.cssRules || [], function (r) { if (r.type === 5) out += r.cssText.replace(/url\((['"]?)([^'")]+)\1\)/g, function (m0, q, u) { try { return "url(" + q + new URL(u, ss.href || location.href).href + q + ")"; } catch (e) { return m0; } }) + "\n"; }); } catch (e) {} }); return out;
    }
    function reportHtml(L, P, A) {
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
          else if (q.t === "scale") { var c3 = [0, 0, 0]; x.a.forEach(function (a) { if (a.answer.v >= 1 && a.answer.v <= 3) c3[a.answer.v - 1]++; }); inner = '<p class="sc">' + FACES.map(function (f, i) { return f[0] + " " + f[1] + ": <b>" + c3[i] + "</b> (" + pct(c3[i], n) + "%)"; }).join(" &nbsp; · &nbsp; ") + "</p>" + (c3[0] ? '<p class="note">' + T("لم يفهموا بعد: ", "Not yet: ") + x.a.filter(function (a) { return a.answer.v === 1; }).map(function (a) { return esc(nick[a.player_id] || "؟"); }).join("، ") + "</p>" : ""); }
          h += '<div class="qq"><div class="qh"><span>' + (k + 1) + "</span><b>" + TYPES[q.t] + (q.text ? ": " + esc(q.text) : "") + "</b><small>" + T("الشريحة ", "Slide ") + ((q.slide || 0) + 1) + " · " + n + " " + T("إجابة", "answers") + "</small></div>" + inner + "</div>";
        });
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
    if (keep) sb.from("deck_live").select("id, code, q, q_seq, state").eq("id", keep).maybeSingle().then(function (r) {
      if (r.data && r.data.state !== "done") { S = r.data; subscribe(); setActive(); if (S.q && S.q_seq) { loadAnswers(); resP.classList.add("on"); } }
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
        '</style></head><body><div class="pv"><div class="pv-top"><span>🏮</span><div class="t">' + esc(title) + '</div><div class="clk"><span id="el">00:00</span><button id="tp" title="' + T("إيقاف/تشغيل", "Pause/resume") + '">⏸</button><button id="tr" title="' + T("من البداية", "Reset") + '">↺</button></div><span class="now" id="now"></span><button id="fs">⛶ ' + T("ملء الشاشة", "Full screen") + "</button></div>" +
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

    /* ---------- التحكم من الجوال ---------- */
    if (!LIVE) { var rb = $("hbRemote"); if (rb) rb.remove(); return; }
    var sb = HX.sb, rch = null, rkey = null, lastSeen = 0, remPop = mk("div", "hbRemPop");
    remPop.className = "pop hb-pop"; remPop.dir = RTL ? "rtl" : "ltr"; stop(remPop);
    var rUrl = function () { return String(HX.joinUrl).replace(/#\/live$/, "") + "#/remote/" + rkey; };
    var state = function () { var L = liveInfo(); return { cur: cur, n: N, title: title, st: stTitle(cur), nx: cur + 1 < N ? stTitle(cur + 1) : "", nt: notesOf(cur).slice(0, 2500), black: black.classList.contains("on"), live: L && L.on ? { p: L.players, a: L.answered, q: !!L.q } : null, rtl: RTL }; };
    var push = function () { if (rch) rch.send({ type: "broadcast", event: "state", payload: state() }); };
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
          var c = (m.payload || {}).c; lastSeen = Date.now(); paintRem();
          if (c === "next") nextB(); else if (c === "prev") prevB(); else if (c === "first") go(0);
          else if (c === "go") go(+m.payload.k || 0);
          else if (c === "black") { toggleBlack(); push(); }
          else if (c === "pick") { $("hbPick").click(); setTimeout(function () { var g = $("hbGo"); if (g) g.click(); setTimeout(function () { rch.send({ type: "broadcast", event: "pick", payload: { name: ($("hbPickOut") || {}).textContent || "" } }); }, 1900); }, 150); }
          else if (c === "hello") push();
        }).subscribe(function (s) { if (s === "SUBSCRIBED") push(); });
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

  /* ---------- البدء ---------- */
  W.addEventListener("resize", function () { requestAnimationFrame(fit); });
  setTimeout(fit, 30); onSlide(); updSw(); fit();
  if (D.fonts && D.fonts.ready) D.fonts.ready.then(fit);
  ["bNo", "bE"].forEach(function (id) { var o = $(id); if (o) new MutationObserver(function () { var m = { bNo: "hbNo", bE: "hbE" }[id]; if ($(m)) $(m).classList.toggle("on", o.classList.contains("on")); }).observe(o, { attributes: true, attributeFilter: ["class"] }); });
})();
