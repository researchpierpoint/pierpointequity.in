(function(){
const article=document.querySelector("main article");if(!article)return;
const title=document.querySelector("main h1")?.textContent?.trim()||"Guide";
document.body.classList.add("guide-reading");
const bar=document.createElement("div");bar.className="reading-progress";bar.innerHTML="<span></span>";document.body.prepend(bar);
const page=document.querySelector("main.page");
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