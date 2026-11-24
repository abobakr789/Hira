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
    keys: "M3 6h18v12H3zM7 10h.01M11 10h.01M15 10h.01M7 14h10"
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
    (fxOld ? '<span data-tip="' + T("الانتقال بين الشرائح", "Slide transition") + '" style="display:inline-flex;align-items:center;gap:6px;color:#E9EEF5;margin-inline-end:4px"><svg viewBox="0 0 24 24" width="20" height="20" style="fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round"><path d="' + P.film + '"/></svg><select class="hb-sel" id="hbFx" aria-label="' + T("الانتقال بين الشرائح", "Slide transition") + '">' + fxOpts + "</select></span>" : "") +
    ($("bPg") ? B("hbPg", "chart", T("قياس التقدّم", "Progress check"), T("قياس التقدّم", "Progress")) : "") +
    ($("bT") ? B("hbT", "timer", T("المؤقت (T)", "Timer (T)"), T("المؤقت", "Timer")) : "") +
    ($("bS") ? B("hbS", "bell", T("لفت الانتباه", "Get attention"), T("الانتباه", "Attention")) : "") +
    B("hbPick", "dice", T("اختيار طالب عشوائيًّا", "Pick a student"), T("القرعة", "Pick")) +
    ($("bNo") ? B("hbNo", "notes", T("ملاحظات المعلم (N)", "Teacher notes (N)"), T("الملاحظات", "Notes")) : "") +
    ($("bE") ? B("hbE", "edit", T("تعديل نصوص الشريحة", "Edit slide text"), T("تعديل", "Edit")) : "") +
    "</div>" +
    '<span class="hb-sep"></span>' +
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
    B("hbUndo", "undo", T("تراجع (Ctrl+Z)", "Undo (Ctrl+Z)")) + B("hbClr", "trash", T("مسح كتابة الشريحة", "Clear this slide's ink")) + "</div>" +
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
  var stop = function (el) { ["keydown", "keyup", "keypress"].forEach(function (k) { el.addEventListener(k, function (e) { e.stopPropagation(); }); }); };

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
    redraw();
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
  var INK = SS.get("hb-ink-" + DECK) || {};
  var keyNow = function () { return board.classList.contains("on") ? "wb" : String(cur); };
  var items = function () { return INK[keyNow()] || (INK[keyNow()] = []); };
  var saveInk = function () { SS.set("hb-ink-" + DECK, INK); };
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
