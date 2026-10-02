/* PirePoint World-Class Experience Layer */
(function(){
"use strict";
if(document.body.dataset.ppWorldClass)return;
const root=document.documentElement, body=document.body;
body.dataset.ppWorldClass="1"; body.classList.add("pp-world-class");
const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>[...r.querySelectorAll(s)];
const depth=location.pathname.split("/").filter(Boolean).length;
const rel=depth>1?"../":"./";
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Skip link: immediate access to the actual content. */
if(!q(".pp-skip")){
 const a=document.createElement("a");a.className="pp-skip";a.href="#main-content";a.textContent="Skip to main content";body.prepend(a);
 const main=q("main");if(main&&!main.id)main.id="main-content";
}

/* Make navigation truthful and contextual. */
const nav=q(".nav nav");
if(nav){
 nav.setAttribute("aria-label","Primary navigation");
 qa("a",nav).forEach(a=>{
   const href=a.getAttribute("href")||"";
   const target=href.split("/").pop().replace(".html","")||"index";
   const current=location.pathname.split("/").pop().replace(".html","")||"index";
   if(target===current){a.classList.add("active");a.setAttribute("aria-current","page")}
 });
}

/* Consistent global navigation + accessible mobile control. */
if(nav){
  const navLinks=[
    ["Learn","learn.html","learn"],
    ["Markets","countries.html","countries"],
    ["Questions","questions.html","questions"],
    ["Research","research-hub.html","research-hub"],
    ["Tools","tools.html","tools"],
    ["About","methodology.html","methodology"]
  ];
  const currentPath=location.pathname.split("/").pop().replace(/\\.html$/,"")||"index";
  nav.innerHTML=navLinks.map(x=>'<a href="'+rel+x[1]+'"'+(currentPath===x[2]?' class="active" aria-current="page"':'')+'>'+x[0]+'</a>').join("");
  let mobile=q(".mobile-menu-button");
  if(!mobile){
    mobile=document.createElement("button"); mobile.className="mobile-menu-button"; mobile.type="button";
    mobile.setAttribute("aria-label","Open navigation"); mobile.setAttribute("aria-expanded","false");
    mobile.innerHTML='<span></span><span></span><span></span>';
    nav.parentElement.appendChild(mobile);
  }
  mobile.onclick=()=>{
    const open=!nav.classList.contains("open");
    nav.classList.toggle("open",open); mobile.setAttribute("aria-expanded",String(open));
    mobile.setAttribute("aria-label",open?"Close navigation":"Open navigation");
  };
  qa("a",nav).forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");mobile.setAttribute("aria-expanded","false");mobile.setAttribute("aria-label","Open navigation")}));
}
/* Give every page a quiet orientation line and a useful next step. */
if(main && !q(".pp-context") && !/^(index|learn|countries|academy|routine|market-university)$/.test(currentPath)){
  const h=q("h1",main);
  if(h){
    const context=document.createElement("div"); context.className="pp-context";
    context.innerHTML="<b>You are here.</b> Read this page for the core answer, then use the next step below if you want to continue.";
    h.insertAdjacentElement("afterend",context);
  }
}

/* A concise page briefing for fast readers. Never blocks the content. */
const main=q("main");
if(main && !q(".pp-page-brief") && !/^(index|countries|learn|academy|routine|market-university)\.html?$/.test(location.pathname.split("/").pop()||"")){
 const h=q("h1",main), lead=q(".lead,.hero-copy,.intro",main);
 if(h){
   const b=document.createElement("div");b.className="pp-page-brief";
   b.innerHTML='<div class="pp-brief-main"><i class="pp-dot" aria-hidden="true"></i><div><strong>'+esc(h.textContent.trim())+'</strong><span>'+esc((lead?.textContent||"Start with the page overview, then go deeper when you need the detail.").trim().slice(0,150))+'</span></div></div><a class="pp-brief-action" href="#main-content">Read from the beginning ↓</a>';
   main.insertBefore(b,main.firstChild);
 }
}

/* On-page map for long content. Progressive disclosure: orientation first, detail second. */
if(main && !q(".pp-page-map")){
 const headings=qa("h2",main).filter(h=>h.textContent.trim().length>2 && h.offsetParent!==null).slice(0,8);
 if(headings.length>=4){
   const map=document.createElement("nav");map.className="pp-page-map";map.setAttribute("aria-label","On this page");
   headings.forEach((h,i)=>{if(!h.id)h.id="pp-section-"+(i+1);const a=document.createElement("a");a.href="#"+h.id;a.innerHTML='<i>'+String(i+1).padStart(2,"0")+'</i><span>'+esc(h.textContent.trim())+'</span>';map.appendChild(a)});
   const first=h1ish(main); if(first)first.insertAdjacentElement("afterend",map); else main.prepend(map);
 }
}

/* Calm reading progress on genuinely long pages. */
if(document.documentElement.scrollHeight>1800&&!q(".pp-reading-progress")){
 const bar=document.createElement("div");bar.className="pp-reading-progress";bar.innerHTML="<span></span>";body.prepend(bar);
 const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;bar.firstElementChild.style.width=(max>0?Math.min(100,Math.max(0,scrollY/max*100)):0)+"%"};
 addEventListener("scroll",update,{passive:true});addEventListener("resize",update);update();
}

/* Back to top only after meaningful travel. */
if(!q(".pp-top")){
 const b=document.createElement("button");b.className="pp-top";b.type="button";b.hidden=true;b.setAttribute("aria-label","Back to top");b.innerHTML="↑ <span>Top</span>";body.appendChild(b);
 const toggle=()=>b.hidden=scrollY<900;addEventListener("scroll",toggle,{passive:true});toggle();
 b.onclick=()=>scrollTo({top:0,behavior:reduce?"auto":"smooth"});
}

/* Global command palette. Ctrl/Cmd+K and /. */
if(!q(".pp-command-palette")){
 const overlay=document.createElement("div");overlay.className="pp-command-palette";overlay.innerHTML='<div class="pp-command-dialog" role="dialog" aria-modal="true" aria-label="PirePoint navigation"><header><input id="ppCommandInput" autocomplete="off" placeholder="Search guides, markets, research and tools…" aria-label="Search PirePoint"><kbd>Esc</kbd></header><div class="pp-command-results"></div></div>';body.appendChild(overlay);
 const input=q("#ppCommandInput",overlay),results=q(".pp-command-results",overlay);
 const items=[
  ["Build My Routine","Adapt what you learn to what you already know.","routine.html"],
  ["Learn","Foundations, concepts and connected learning.","learn.html"],
  ["Markets","Understand how markets differ across countries.","countries.html"],
  ["Company Intelligence","Source-first company research.","intelligence.html"],
  ["Research","Build and stress-test an evidence-led thesis.","research-hub.html"],
  ["Questions","Start with the question in your head.","questions.html"],
  ["Tools","Use calculators, labs and research tools.","tools.html"],
  ["Methodology","See how PirePoint handles evidence and uncertainty.","methodology.html"],
  ["Glossary","Find financial terms in plain English.","glossary.html"],
  ["System","Understand the PirePoint learning/research system.","system.html"]
 ];
 function render(v=""){const s=v.toLowerCase().trim();results.innerHTML=items.filter(x=>!s||(x[0]+" "+x[1]).toLowerCase().includes(s)).map((x,i)=>'<a class="pp-command-item" href="'+rel+x[2]+'" aria-current="'+(i===0?'true':'false')+'"><b>'+esc(x[0])+'</b><span>'+esc(x[1])+'</span></a>').join("")||'<div class="pp-section-note" style="padding:18px">No close match. Try a concept, market or tool.</div>'}
 const open=()=>{overlay.classList.add("open");render(input.value);setTimeout(()=>{input.focus();input.select()},0)};
 const close=()=>overlay.classList.remove("open");
 q(".nav-search")?.addEventListener("click",e=>{e.preventDefault();open()});
 input.addEventListener("input",()=>render(input.value));
 overlay.addEventListener("click",e=>{if(e.target===overlay)close()});
 addEventListener("keydown",e=>{if((e.key==="/"||((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"))&&!/input|textarea|select/i.test(document.activeElement?.tagName||"")){e.preventDefault();open()}if(e.key==="Escape"&&overlay.classList.contains("open")){close()}});
 render();
}

/* Reveal only secondary content; never hide essential information. */
if(!reduce&&"IntersectionObserver"in window){
 const els=qa(".section,.command-card,.question-feature,.market-preview,.guide-card,.tool-card,.country-card,.source-card").filter(e=>!e.classList.contains("pp-reveal"));
 els.slice(0,80).forEach((el,i)=>{el.classList.add("pp-reveal");el.style.setProperty("--pp-delay",Math.min(i%5,4)*35+"ms")});
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("pp-visible");io.unobserve(e.target)}}),{rootMargin:"0px 0px -6% 0px",threshold:.03});els.forEach(e=>io.observe(e));
}

/* External links remain in the user's current browsing context unless the page explicitly chooses otherwise. */
qa('a[href^="http"]').forEach(a=>{
  if(a.hostname!==location.hostname && !a.getAttribute("aria-label")){
    a.setAttribute("aria-label",(a.textContent.trim()||"External link")+" (external link)");
  }
});
function h1ish(r){return q("h1",r)||q(".lead,.hero-copy",r)}
function esc(s){return String(s??"").replace(/[<>&"]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;"}[c]))}
})();
 