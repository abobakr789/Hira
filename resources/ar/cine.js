/* حراء · انتقالات سينمائية ذكية + حركة (للعروض التي لا تحمّل deepen.js) */
/* ---- smart transitions (View Transitions) ---- */
(function(){
  const rtl=true;
  const cat=id=>{ id=id||""; if(id==="cover") return "cover"; if(/^d-text|^d-story/.test(id)) return "text"; if(/^d-g\d|^d-groups/.test(id)) return "group"; if(/^progress/.test(id)) return "measure"; if(/^(d-tf|d-quick|d-exit|s8|d-kwl2)/.test(id)) return "check"; if(/^(d-goal|d-kwl$)/.test(id)) return "plan"; if(/^(d-vocab|d-guess|d-vpics)/.test(id)) return "words"; if(/^(d-chart|d-real|d-apply)/.test(id)) return "life"; if(/^d-f/.test(id)) return "feedback"; return "content"; };
  const stem=id=>(id||"").replace(/\d+$/,"");
  function pick(a,b,dir){ const ca=cat(a.id), cb=cat(b.id), fwd=dir>0;
    if(ca==="cover"||cb==="cover") return "zoom";
    if(stem(a.id)===stem(b.id)&&stem(a.id)!==a.id) return fwd===rtl?"push-r":"push-l";
    if(ca===cb&&(ca==="group"||ca==="words"||ca==="text")) return fwd===rtl?"push-r":"push-l";
    if(cb==="measure") return fwd?"flip-r":"flip";
    if(cb==="text") return "focus";
    if(cb==="group"||cb==="plan") return "mask";
    if(cb==="check") return fwd===rtl?"wipe-r":"wipe-l";
    if(cb==="life"||cb==="words") return "zoomin";
    if(ca===cb) return fwd===rtl?"push-r":"push-l";
    return "focus"; }
  const nm=(s,on)=>{ if(!s) return; s.style.viewTransitionName=on?"slide":""; const h=s.querySelector(".ht,h2,h1"); if(h) h.style.viewTransitionName=on?"ttl":""; const l=s.querySelector(".hlogo"); if(l) l.style.viewTransitionName=on?"logo":""; };
  window.__hxShow=function(orig,n,end){
    if(!window.__hxOpt){ window.__hxOpt=1; addOpt(); const sel=document.getElementById("fx"); try{ if(sel&&localStorage.getItem("hiraa-deck-fx")==="smart"&&sel.value!=="smart"){ sel.value="smart"; sel.dispatchEvent(new Event("change")); } }catch(e){} }
    const S=[...document.querySelectorAll("#stage .sl")]; const fx=(document.body.className.match(/fx-(\S+)/)||[])[1]||"smart";
    const cur=S.find(s=>s.classList.contains("on")), nx=S[Math.max(0,Math.min(S.length-1,n))];
    if(fx!=="smart"||!document.startViewTransition||!cur||cur===nx||matchMedia("(prefers-reduced-motion: reduce)").matches){ document.body.classList.remove("vt"); return orig(n,end); }
    document.body.classList.add("vt"); const dir=S.indexOf(nx)>S.indexOf(cur)?1:-1; document.documentElement.dataset.tr=pick(cur,nx,dir);
    nm(cur,true); const t=document.startViewTransition(()=>{ nm(cur,false); orig(n,end); nm(nx,true); });
    t.finished.catch(()=>{}).then(()=>nm(nx,false));
  };
  const addOpt=()=>{ const sel=document.getElementById("fx"); if(!sel||sel.querySelector('option[value="smart"]')) return; const o=document.createElement("option"); o.value="smart"; o.textContent="✨ ذَكِيٌّ سينَمائِيٌّ"; sel.prepend(o); try{ if(!localStorage.getItem("hiraa-deck-fx-v2")){ localStorage.setItem("hiraa-deck-fx","smart"); localStorage.setItem("hiraa-deck-fx-v2","1"); } }catch(e){} };
  document.readyState==="loading"?document.addEventListener("DOMContentLoaded",addOpt):addOpt();
  addEventListener("pointerdown",e=>{ const st=document.getElementById("stage"); if(!st) return; const r=st.getBoundingClientRect(); document.documentElement.style.setProperty("--mx",((e.clientX-r.left)/r.width*100).toFixed(1)+"%"); document.documentElement.style.setProperty("--my",((e.clientY-r.top)/r.height*100).toFixed(1)+"%"); },true);
  const css=`body.fx-smart:not(.vt) .sl{transition:opacity .9s cubic-bezier(.2,.7,.2,1),transform 1.1s cubic-bezier(.2,.7,.2,1),filter .9s}
body.fx-smart:not(.vt) .sl:not(.on){transform:scale(1.05);filter:blur(10px)}
body.fx-smart.vt .sl{transition:none}
::view-transition-group(*){animation-duration:.75s;animation-timing-function:cubic-bezier(.22,.8,.2,1)}
::view-transition-old(root),::view-transition-new(root){animation:none}
::view-transition-image-pair(slide){isolation:isolate;perspective:1800px}
@keyframes vt-fade-out{to{opacity:0}}
@keyframes vt-fade-in{from{opacity:0}}
@keyframes vt-push-out-l{to{transform:translateX(-14%);opacity:0;filter:blur(4px)}}
@keyframes vt-push-in-r{from{transform:translateX(14%);opacity:0;filter:blur(4px)}}
@keyframes vt-push-out-r{to{transform:translateX(14%);opacity:0;filter:blur(4px)}}
@keyframes vt-push-in-l{from{transform:translateX(-14%);opacity:0;filter:blur(4px)}}
@keyframes vt-zoom-out{to{transform:scale(1.35);opacity:0;filter:blur(12px)}}
@keyframes vt-zoom-in{from{transform:scale(.88);opacity:0}}
@keyframes vt-focus-old{to{transform:scale(.96);opacity:0;filter:blur(14px)}}
@keyframes vt-focus-new{from{transform:scale(1.06);opacity:0;filter:blur(14px)}}
@keyframes vt-mask-circle{from{clip-path:circle(0% at var(--mx,50%) var(--my,50%))}to{clip-path:circle(150% at var(--mx,50%) var(--my,50%))}}
@keyframes vt-mask-wipe-r{from{clip-path:inset(0 0 0 100%)}to{clip-path:inset(0 0 0 0)}}
@keyframes vt-mask-wipe-l{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes vt-dim{to{opacity:.35;transform:scale(.98)}}
@keyframes vt-flip-out{to{transform:rotateY(-70deg) translateZ(-200px);opacity:0}}
@keyframes vt-flip-in{from{transform:rotateY(70deg) translateZ(-200px);opacity:0}}
@keyframes vt-flip-out-r{to{transform:rotateY(70deg) translateZ(-200px);opacity:0}}
@keyframes vt-flip-in-r{from{transform:rotateY(-70deg) translateZ(-200px);opacity:0}}
html[data-tr=fade]::view-transition-old(slide){animation:vt-fade-out .6s both}
html[data-tr=fade]::view-transition-new(slide){animation:vt-fade-in .6s both}
html[data-tr=push-l]::view-transition-old(slide){animation:vt-push-out-l .7s both}
html[data-tr=push-l]::view-transition-new(slide){animation:vt-push-in-r .7s both}
html[data-tr=push-r]::view-transition-old(slide){animation:vt-push-out-r .7s both}
html[data-tr=push-r]::view-transition-new(slide){animation:vt-push-in-l .7s both}
html[data-tr=zoom]::view-transition-old(slide){animation:vt-zoom-out .9s both}
html[data-tr=zoom]::view-transition-new(slide){animation:vt-zoom-in .9s .1s both}
html[data-tr=focus]::view-transition-old(slide){animation:vt-focus-old .8s both}
html[data-tr=focus]::view-transition-new(slide){animation:vt-focus-new .8s .05s both}
html[data-tr=mask]::view-transition-old(slide){animation:vt-dim .9s both}
html[data-tr=mask]::view-transition-new(slide){animation:vt-mask-circle .9s cubic-bezier(.6,0,.2,1) both}
html[data-tr=wipe-r]::view-transition-old(slide){animation:vt-dim .8s both}
html[data-tr=wipe-r]::view-transition-new(slide){animation:vt-mask-wipe-r .8s cubic-bezier(.6,0,.2,1) both}
html[data-tr=wipe-l]::view-transition-old(slide){animation:vt-dim .8s both}
html[data-tr=wipe-l]::view-transition-new(slide){animation:vt-mask-wipe-l .8s cubic-bezier(.6,0,.2,1) both}
html[data-tr=flip]::view-transition-old(slide){animation:vt-flip-out .8s both;transform-origin:center}
html[data-tr=flip]::view-transition-new(slide){animation:vt-flip-in .8s .15s both;transform-origin:center}
html[data-tr=flip-r]::view-transition-old(slide){animation:vt-flip-out-r .8s both}
html[data-tr=flip-r]::view-transition-new(slide){animation:vt-flip-in-r .8s .15s both}
::view-transition-group(ttl){animation-duration:.8s}
::view-transition-group(logo),::view-transition-group(foot),::view-transition-group(dots){animation-duration:.6s}
@media (prefers-reduced-motion:reduce){::view-transition-group(*),::view-transition-old(*),::view-transition-new(*){animation:none!important}}
  @keyframes vt-zi-old{to{opacity:0;transform:scale(.92);filter:blur(6px)}}@keyframes vt-zi-new{from{opacity:0;transform:perspective(1600px) translateZ(-260px) rotateX(8deg)}}
  html[data-tr=zoomin]::view-transition-old(slide){animation:vt-zi-old .7s both}html[data-tr=zoomin]::view-transition-new(slide){animation:vt-zi-new .9s .05s cubic-bezier(.2,.8,.2,1) both}
  body.vt .sl{transition:none!important}
  /* motion graphics */
  @keyframes hx-drift{0%{transform:translate(0,0) rotate(0)}100%{transform:translate(40px,-30px) rotate(25deg)}}
  @keyframes hx-kb{0%{transform:scale(1) translate(0,0)}100%{transform:scale(1.12) translate(-2%,-2%)}}
  @keyframes hx-rise{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:none}}
  @keyframes hx-pulse{0%,100%{box-shadow:0 0 0 0 rgba(255,210,63,.55)}50%{box-shadow:0 0 0 26px rgba(255,210,63,0)}}
  .sl.on i.dc{animation:hx-drift 16s ease-in-out infinite alternate}
  .sl.on img.kb{animation:hx-kb 22s ease-in-out infinite alternate}
  .limg{position:absolute;border-radius:36px;box-shadow:0 24px 50px rgba(0,0,0,.18);object-fit:cover;z-index:1}
  .mabtn{position:absolute;left:60px;bottom:70px;z-index:6;font:inherit;font-size:28px;font-weight:700;background:#FFD23F;color:#3A2A00;border:0;border-radius:999px;padding:12px 28px;cursor:pointer;box-shadow:0 10px 24px rgba(0,0,0,.18);animation:hx-pulse 2.6s infinite}
  .mabox{position:absolute;left:60px;right:60px;bottom:150px;z-index:7;background:#FFFDF3;border:3px solid #FFD23F;border-radius:30px;padding:26px 36px;font-size:32px;line-height:1.75;box-shadow:0 26px 60px rgba(0,0,0,.22);opacity:0;transform:translateY(30px) scale(.97);pointer-events:none;transition:.5s cubic-bezier(.2,.8,.2,1);max-height:640px;overflow:auto}
  .mabox.on{opacity:1;transform:none;pointer-events:auto}.mabox b{display:block;color:#8A6400;margin-bottom:6px}.mabox ul{margin:0;padding-inline-start:1.2em}.mabox p{margin:.2em 0}
  .kw3{display:grid;grid-template-columns:repeat(3,1fr);gap:26px;width:100%;height:600px}
  .kwc{background:var(--c2);border-radius:30px;padding:20px 22px;display:flex;flex-direction:column;border-top:10px solid var(--c);box-shadow:0 14px 30px rgba(0,0,0,.08)}
  .kwh{display:flex;align-items:center;gap:12px;font-size:36px;color:var(--c)}.kwi{font-size:46px}
  .kwe{flex:1;margin-top:12px;background:#fff;border-radius:20px;padding:14px 18px;font-size:30px;line-height:1.6;outline:none;overflow:auto;border:2px dashed rgba(0,0,0,.12)}
  .kwe:empty:before{content:attr(data-ph);color:#9AA3AD}
  .kwlock{flex:1;margin-top:12px;display:flex;align-items:center;justify-content:center;font-size:30px;color:var(--c);background:rgba(255,255,255,.6);border-radius:20px}
  .kwt{font-size:24px;color:#7A5A2A;margin:8px 0 0}
  .rl,.ap,.sty{display:grid;grid-template-columns:44% 1fr;gap:40px;width:100%;align-items:center}
  .rlp,.app,.styp{position:relative;height:620px;border-radius:40px;overflow:hidden;box-shadow:0 26px 50px rgba(0,0,0,.16);background:#fff}
  .rlp img,.styp img{width:100%;height:100%;object-fit:cover}.app img{width:100%;height:100%;object-fit:contain;padding:30px;box-sizing:border-box}
  .rlc,.apc{display:flex;flex-direction:column;gap:22px;font-size:34px;line-height:1.7}.rlq{border-inline-start:10px solid var(--a)}
  .apq{font-size:40px;font-weight:700}.aps{display:flex;gap:14px;flex-wrap:wrap}.aps span{background:var(--a2);color:var(--a);border-radius:999px;padding:10px 24px;font-size:30px;font-weight:700}
  .stys{display:flex;flex-direction:column;gap:14px}.stp{display:flex;gap:16px;align-items:flex-start;background:#fff;border-radius:24px;padding:12px 20px;box-shadow:0 10px 22px rgba(0,0,0,.07);border-inline-start:8px solid var(--a)}
  .stp .t{font-size:32px;font-weight:700;margin:0;color:var(--a)}.stp .d{font-size:26px;margin:2px 0 0;line-height:1.5}
  .spot{position:absolute;inset:0;background:radial-gradient(circle at var(--sx,50%) var(--sy,50%),transparent 0 18%,rgba(15,25,40,.28) 34%);pointer-events:none;transition:.8s}
  .ch{width:100%;display:flex;flex-direction:column;gap:22px}.chb{display:flex;align-items:flex-end;justify-content:center;gap:60px;height:470px;padding:0 40px;border-bottom:4px solid #C9B98F}
  .bar{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;width:200px}
  .bar i{display:block;width:100%;height:0;border-radius:22px 22px 0 0;background:linear-gradient(180deg,var(--c),color-mix(in srgb,var(--c) 65%,#fff));transition:height 1.4s cubic-bezier(.2,.8,.2,1) var(--d)}
  .sl.on .bar:not(.hid) i{height:calc(var(--h) - 60px)}
  .bv{font-size:40px;font-weight:800;color:var(--c);margin-bottom:6px}.bl{position:absolute;transform:translateY(54px);font-size:28px;font-weight:700;color:#444;text-align:center;width:240px}
  .bar{position:relative}.chq{margin-top:50px}
  .f4{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;width:100%}
  .f4c{background:var(--c2);border-radius:30px;padding:28px 22px;text-align:center;border-bottom:10px solid var(--c);box-shadow:0 14px 30px rgba(0,0,0,.08);min-height:420px}
  .f4c .wi{font-size:80px;display:block}.f4c b{font-size:36px;color:var(--c);display:block;margin:10px 0}.f4c p{font-size:29px;line-height:1.6;margin:0}
  .vimg{width:200px;height:200px;object-fit:cover;border-radius:28px;box-shadow:0 10px 24px rgba(0,0,0,.15)}.vimg.sm{width:120px;height:120px;float:left;margin-inline-end:14px}
  .vpg{display:grid;grid-template-columns:repeat(4,1fr);gap:26px;width:100%}
  .vpc{perspective:1400px;height:600px;cursor:pointer;position:relative}
  .vpf,.vpb{position:absolute;inset:0;border-radius:30px;backface-visibility:hidden;transition:transform .8s cubic-bezier(.2,.8,.2,1);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;box-shadow:0 18px 36px rgba(0,0,0,.12)}
  .vpf{background:#fff}.vpf img{width:100%;height:330px;object-fit:cover;border-radius:22px}.vpf .vw{font-size:44px;font-weight:800;color:var(--a);margin:16px 0 4px}.vpf small{font-size:22px;color:#7A5A2A}
  .vpb{background:var(--a2);transform:rotateY(180deg)}.vpb .vw{font-size:42px;color:var(--a);margin:0 0 10px}.vpb .vm{font-size:32px;line-height:1.6;text-align:center;margin:0}.vpb .vx{font-size:26px;color:#7A5A2A;text-align:center}
  .vpc.fl .vpf{transform:rotateY(-180deg)}.vpc.fl .vpb{transform:rotateY(0)}`;
  const st=document.createElement("style"); st.textContent=css; document.head.appendChild(st);
})();
