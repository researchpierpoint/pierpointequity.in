(function(){
const article=document.querySelector("main article");if(!article)return;
const title=document.querySelector("main h1")?.textContent?.trim()||"Guide";
document.body.classList.add("guide-reading");
const bar=document.createElement("div");bar.className="reading-progress";bar.innerHTML="<span></span>";document.body.prepend(bar);
const nav=document.querySelector(".nav nav");if(nav&&!document.querySelector(".mobile-menu-button")){const b=document.createElement("button");b.className="mobile-menu-button";b.setAttribute("aria-label","Open navigation");b.textContent="Menu";b.onclick=()=>nav.classList.toggle("open");nav.parentElement?.insertBefore(b,nav);}const page=document.querySelector("main.page");
const rail=document.createElement("aside");rail.className="guide-rail";rail.innerHTML='<div class="rail-inner"><b>ON THIS PAGE</b><div id="guideToc"></div><a class="rail-back" href="../guides.html">All guides →</a></div>';
if(page)page.insertBefore(rail,article);
const toc=document.getElementById("guideToc");
article.querySelectorAll("h2").forEach((h,i)=>{if(!h.id)h.id="section-"+(i+1);const a=document.createElement("a");a.href="#"+h.id;a.textContent=h.textContent;toc?.appendChild(a);});
const glance=document.createElement("div");glance.className="guide-at-a-glance";glance.innerHTML='<span class="tag">IN 30 SECONDS</span><strong>'+title+'</strong><p>Get the core idea first. Go deeper only where you need it.</p>';article.prepend(glance);
const mistakes={P/E:"A low multiple does not automatically mean a stock is cheap.",ROE:"A high ROE can be helped by leverage; check the balance sheet.",ROCE:"A strong ROCE still needs to be compared with growth, valuation and capital intensity.",EPS:"EPS can change because of both earnings and the number of shares outstanding.",Dividend:"A high yield can be caused by a falling share price; check sustainability.","Market Capitalisation":"Share price alone does not tell you how large a company is.",Liquidity:"High recent volume does not guarantee you can exit easily at the same price.",Debt:"Debt can amplify returns and also amplify problems when cash flows weaken.","Stock Market Basics":"Owning a share is not the same thing as knowing what price is reasonable.",default:"A definition is the beginning, not the investment conclusion. Always ask what the number does and does not tell you."};
const key=Object.keys(mistakes).find(k=>title.toLowerCase().includes(k.toLowerCase()))||"default";
const mistake=document.createElement("div");mistake.className="guide-mistake";mistake.innerHTML='<span class="tag">COMMON MISTAKE</span><strong>Do not stop at the headline.</strong><p>'+mistakes[key]+'</p>';article.appendChild(mistake);
const quiz=document.createElement("div");quiz.className="guide-quiz";quiz.innerHTML='<span class="tag">QUICK CHECK</span><h3>Can you explain this guide in one sentence?</h3><p>If you can explain the core idea without jargon, you probably understand it. If not, revisit the highlighted sections above.</p><button type="button" id="quizReveal">Show the next question</button><div id="quizNext" hidden><b>What should you learn next?</b><p>Pick the concept that sits one step deeper rather than opening ten tabs at once.</p><a href="../guides.html">Find your next guide →</a></div>';article.appendChild(quiz);
quiz.querySelector("#quizReveal").onclick=()=>{quiz.querySelector("#quizNext").hidden=false;quiz.querySelector("#quizReveal").hidden=true;};
const complete=document.createElement("div");complete.className="guide-complete";complete.innerHTML='<span>Finished this guide?</span><a href="../guides.html">Choose your next question →</a>';article.appendChild(complete);
try{localStorage.setItem("pirepoint:last-guide",location.pathname)}catch(e){}
function scroll(){const d=document.documentElement,max=d.scrollHeight-innerHeight,pct=max>0?(scrollY/max)*100:0;bar.firstElementChild.style.width=pct+"%";let cur="";article.querySelectorAll("h2").forEach(h=>{if(h.getBoundingClientRect().top<180)cur=h.id});toc?.querySelectorAll("a").forEach(a=>a.classList.toggle("current",a.getAttribute("href")==="#"+cur));}
addEventListener("scroll",scroll,{passive:true});scroll();
})();
/* Guide depth layer */
(function(){
  const article=document.querySelector("main article"); if(!article)return;
  const links=[
    ["How to Analyse a Stock","how-to-analyse-a-stock.html"],
    ["P/E Ratio Explained","pe-ratio.html"],
    ["ROCE Explained","roce.html"],
    ["How to Read an Earnings Call","earnings-call.html"],
    ["Balance Sheet","balance-sheet.html"],
    ["Cash Flow Statement","cash-flow-statement.html"],
    ["DCF Valuation","dcf-valuation.html"],
    ["Investor Behaviour & Biases","behavioural-biases.html"]
  ];
  const here=location.pathname.split("/").pop();
  const next=links.find(x=>x[1]!==here);
  if(next){
    const existing=article.querySelector(".guide-complete");
    if(existing){
      existing.innerHTML='<span>One idea deeper</span><a href="'+next[1]+'">'+next[0]+' →</a>';
    }
  }
  const share=document.createElement("button");
  share.type="button";share.className="guide-share";share.textContent="Copy guide link";
  share.onclick=async()=>{try{await navigator.clipboard.writeText(location.href);share.textContent="Link copied ✓";setTimeout(()=>share.textContent="Copy guide link",1600)}catch(e){share.textContent="Copy unavailable"}};
  const complete=article.querySelector(".guide-complete"); if(complete)complete.appendChild(share);
/* Contextual mini-lab: immediately manipulate the concept just learned. */
const labs=[{m:/DCF/i,k:"dcf",t:"Try the DCF yourself",d:"Change growth and discount rate to see why a precise-looking DCF can move dramatically.",f:[["Cash flow today","100"],["Growth %","8"],["Discount rate %","12"]]},{m:/P\/E/i,k:"pe",t:"See the P/E mechanics",d:"Change earnings growth or the future multiple and watch the implied price change.",f:[["EPS today","50"],["Growth %","15"],["Future P/E","18"]]},{m:/ROCE/i,k:"roce",t:"Make ROCE concrete",d:"Change operating profit and capital employed. The ratio is simple; the interpretation is not.",f:[["EBIT","120"],["Capital employed","600"]]},{m:/ROE/i,k:"roe",t:"Make ROE concrete",d:"Change profit and equity to see the return on shareholders' capital.",f:[["Net profit","100"],["Equity","500"]]}];const spec=labs.find(x=>x.m.test(title));if(spec){const box=document.createElement("section");box.className="guide-mini-lab";let h='<span class="tag">INTERACTIVE CHECK</span><h3>'+spec.t+'</h3><p>'+spec.d+'</p><div class="mini-lab-fields">';spec.f.forEach((f,i)=>h+='<label>'+f[0]+'<input type="number" step="0.1" value="'+f[1]+'" data-mini="'+i+'"></label>');h+='</div><div class="studio-result" id="guideLabResult"></div><p class="tool-note">Change one input at a time. The point is to understand sensitivity, not produce a prediction.</p>';box.innerHTML=h;article.insertBefore(box,article.querySelector(".guide-complete"));const calc=()=>{const v=[...box.querySelectorAll("input")].map(x=>Number(x.value));let out="";if(spec.k==="dcf"&&v[2]>v[1]){const tv=v[0]*(1+v[1]/100)/((v[2]-v[1])/100);out="Illustrative terminal value: ₹"+tv.toLocaleString("en-IN",{maximumFractionDigits:0})+" crore"}if(spec.k==="pe"){const eps=v[0]*Math.pow(1+v[1]/100,3),price=eps*v[2];out="Illustrative year-3 EPS: ₹"+eps.toFixed(2)+" · At "+v[2]+"×: ₹"+price.toFixed(2)+" per share"}if(spec.k==="roce"&&v[1]>0)out="ROCE: "+(v[0]/v[1]*100).toFixed(1)+"%";if(spec.k==="roe"&&v[1]>0)out="ROE: "+(v[0]/v[1]*100).toFixed(1)+"%";box.querySelector("#guideLabResult").textContent=out||"Use a discount rate above growth."};box.querySelectorAll("input").forEach(x=>x.addEventListener("input",calc));calc()}
})();