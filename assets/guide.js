(function(){
const path=location.pathname.split("/").pop().replace(".html","");
const title=document.querySelector("main h1")?.textContent?.trim()||"Guide";
const article=document.querySelector("main article");
if(!article)return;
document.body.classList.add("guide-reading");
const bar=document.createElement("div");bar.className="reading-progress";bar.innerHTML="<span></span>";document.body.prepend(bar);
const rail=document.createElement("aside");rail.className="guide-rail";
rail.innerHTML='<div class="rail-inner"><b>ON THIS PAGE</b><div id="guideToc"></div><a class="rail-back" href="../guides.html">All guides →</a></div>';
const page=document.querySelector("main.page"); if(page){page.classList.add("guide-page"); page.insertBefore(rail,article);}
const toc=document.getElementById("guideToc");
article.querySelectorAll("h2").forEach((h,i)=>{if(!h.id)h.id="section-"+(i+1);const a=document.createElement("a");a.href="#"+h.id;a.textContent=h.textContent;toc?.appendChild(a);});
const intro=document.createElement("div");intro.className="guide-at-a-glance";
intro.innerHTML='<span class="tag">IN 30 SECONDS</span><strong>'+title+'</strong><p>Start with the highlighted sections. You can go deeper only where you need it.</p>';
article.prepend(intro);
const complete=document.createElement("div");complete.className="guide-complete";
complete.innerHTML='<span>Finished this guide?</span><a href="../guides.html">Choose your next question →</a>';
article.appendChild(complete);
const key="pirepoint:last-guide"; try{localStorage.setItem(key,location.pathname)}catch(e){}
function scroll(){const d=document.documentElement;const max=d.scrollHeight-innerHeight;const pct=max>0?(scrollY/max)*100:0;bar.firstElementChild.style.width=pct+"%";const hs=[...article.querySelectorAll("h2")];let current="";hs.forEach(h=>{if(h.getBoundingClientRect().top<180)current=h.id});toc?.querySelectorAll("a").forEach(a=>a.classList.toggle("current",a.getAttribute("href")==="#"+current));}
addEventListener("scroll",scroll,{passive:true});scroll();
})();