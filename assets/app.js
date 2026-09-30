(function(){
const esc=s=>String(s??"").replace(/[<>&"]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;"}[c]));
const form=document.getElementById("searchForm"),input=document.getElementById("searchInput"),out=document.getElementById("searchResult");
const index=[
["How to Analyse a Stock","Business, growth, ROCE, financial statements, cash flow, valuation and risk.","guides/how-to-analyse-a-stock.html","stock analysis fundamental research company"],
["Stock Market Basics","Learn how shares, exchanges, brokers, orders and settlement fit together.","guides/stock-market-basics.html","beginner basics shares stocks exchange"],
["P/E Ratio Explained","Understand price-to-earnings, earnings and valuation context.","guides/pe-ratio.html","pe p/e valuation price earnings"],
["ROE Explained","Understand return on equity and the effect of leverage.","guides/roe.html","roe return equity quality"],
["ROCE Explained","Understand return on capital employed and capital efficiency.","guides/roce.html","roce return capital employed quality"],
["EPS Explained","Understand earnings per share, growth and dilution.","guides/eps.html","eps earnings per share"],
["How to Buy Stocks","Understand the journey from account to order to settlement.","guides/how-to-buy-stocks.html","buy stocks broker order beginner"],
["Dividends Explained","Understand dividend dates, yield and sustainability.","guides/dividend-explained.html","dividend yield income"],
["How to Read an Earnings Call","Learn how to separate results, commentary and guidance.","guides/earnings-call.html","earnings results management guidance"],
["Stock Market Scams & Fraud","Learn practical red flags and account-security basics.","guides/fraud-and-scams.html","scam fraud safety"],
["India","SEBI, NSE, BSE, demat, IPOs and Indian market mechanics.","countries/india.html","india indian nse bse sebi"],
["United States","SEC, NYSE, Nasdaq and US market structure.","countries/united-states.html","us usa america sec nasdaq nyse"],
["China","Mainland exchanges, share classes and market access.","countries/china.html","china shanghai shenzhen hong kong"],
["Japan","JPX, TSE and Japanese market structure.","countries/japan.html","japan tokyo jpx"],
["United Kingdom","LSE, FCA and UK market structure.","countries/united-kingdom.html","uk britain london fca"],
["Glossary","Plain-English definitions of stock-market language.","glossary.html","glossary terms definition"],
["Compare Markets","Compare exchanges, regulators, currencies and market structures.","compare.html","compare markets countries"],
["Tools","Transparent calculators supporting market education.","tools.html","calculator cagr sip compound"]
];
function search(q){
 const terms=q.toLowerCase().split(/\s+/).filter(Boolean);
 return index.map(x=>({x,score:terms.reduce((n,t)=>n+((x[0]+" "+x[1]+" "+x[3]).toLowerCase().includes(t)?1:0),0)})).filter(x=>x.score).sort((a,b)=>b.score-a.score).slice(0,8);
}
if(form&&input&&out){form.addEventListener("submit",e=>{e.preventDefault();const q=input.value.trim();if(!q)return;const m=search(q);out.hidden=false;out.innerHTML=m.length?'<strong>Best matches</strong>'+m.map(z=>'<div class="search-item"><a href="'+esc(z.x[2])+'"><b>'+esc(z.x[0])+'</b></a><br><span>'+esc(z.x[1])+'</span></div>').join(""):'<strong>No close match yet.</strong><br>Try “P/E”, “ROCE”, “India”, “how to buy stocks”, “IPO”, “dividend” or “risk”.';history.replaceState(null,"","?q="+encodeURIComponent(q));});}
document.querySelectorAll(".nav-search").forEach(a=>a.addEventListener("click",e=>{const i=document.getElementById("searchInput");if(i){e.preventDefault();i.scrollIntoView({behavior:"smooth",block:"center"});setTimeout(()=>i.focus(),250);}}));
const nav=document.querySelector(".nav nav"); if(nav&&!document.querySelector(".mobile-menu-button")){const b=document.createElement("button");b.className="mobile-menu-button";b.setAttribute("aria-label","Open navigation");b.textContent="Menu";b.onclick=()=>nav.classList.toggle("open");nav.parentElement?.insertBefore(b,nav);}
const path=location.pathname; if(path.endsWith("index.html")||path.endsWith("/")){const last=localStorage.getItem("pirepoint:last-guide");const holder=document.getElementById("continueLearning");if(holder&&last){holder.innerHTML='<span class="tag">CONTINUE LEARNING</span><h3>Pick up where you left off</h3><p>You were exploring a guide. Continue without starting over.</p><a href="'+esc(last)+'">Continue →</a>';holder.hidden=false;}}
})();
const daily=[["Why can a low P/E still be expensive?","Learn how earnings quality, growth and valuation interact.","guides/pe-ratio.html"],["What does ROCE actually tell you?","Understand capital efficiency before comparing companies.","guides/roce.html"],["How does a stock order become a completed trade?","Follow the path from broker to settlement.","guides/settlement-explained.html"],["What should you check before buying a stock?","Use a repeatable company-research framework.","guides/how-to-analyse-a-stock.html"],["How do Indian and US markets differ?","Compare the rules that change across countries.","compare.html"],["How can you spot an investment scam?","Learn the red flags before money leaves your account.","guides/fraud-and-scams.html"]];const dq=document.getElementById("dailyQuestion"),dd=document.getElementById("dailyDescription"),dl=document.getElementById("dailyLink");if(dq&&dd&&dl){const d=new Date();const x=daily[Math.floor((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/86400000))%daily.length];dq.textContent=x[0];dd.textContent=x[1];dl.href=x[2];}

/* PirePoint interaction layer — calm, useful, never manipulative */
(function(){
  if(document.body.dataset.ppEnhanced)return; document.body.dataset.ppEnhanced="1";
  const qs=(s,r=document)=>r.querySelector(s);
  const make=(tag,cls,html)=>{const e=document.createElement(tag);e.className=cls||"";if(html!==undefined)e.innerHTML=html;return e};

  /* Keyboard-first search: "/" opens the existing search; Esc closes result states. */
  addEventListener("keydown",e=>{
    if(e.key==="/" && !/input|textarea|select/i.test(document.activeElement?.tagName||"")){
      const i=qs("#searchInput"); if(i){e.preventDefault();i.focus();i.select();}
    }
    if(e.key==="Escape"){const r=qs("#searchResult");if(r)r.hidden=true;qs("#searchInput")?.blur();}
  });

  /* Reveal content as it becomes relevant — no animation when motion is reduced. */
  if(!matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window){
    const els=[...document.querySelectorAll(".section,.card,.feature,.source-card,.notice,.tool-card,.country-card,.guide-card")];
    els.forEach((el,i)=>{el.classList.add("pp-reveal");el.style.setProperty("--pp-delay",Math.min(i%6,5)*45+"ms");});
    const io=new IntersectionObserver(entries=>{
      entries.forEach(x=>{if(x.isIntersecting){x.target.classList.add("pp-visible");io.unobserve(x.target);}});
    },{rootMargin:"0px 0px -8% 0px",threshold:.04});
    els.forEach(x=>io.observe(x));
  }

  /* A quiet back-to-top control appears only after the reader has travelled. */
  const top=make("button","pp-top","↑<span>Top</span>");
  top.type="button";top.setAttribute("aria-label","Back to top");top.hidden=true;
  document.body.appendChild(top);
  addEventListener("scroll",()=>{top.hidden=scrollY<900},{passive:true});
  top.onclick=()=>scrollTo({top:0,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});

  /* Copyable deep links for headings make research easier to share. */
  document.querySelectorAll("main article h2[id],main .prose h2[id]").forEach(h=>{
    if(h.querySelector(".pp-anchor"))return;
    const b=make("button","pp-anchor","§");b.type="button";b.title="Copy link to this section";b.setAttribute("aria-label","Copy link to this section");
    b.onclick=async()=>{try{await navigator.clipboard.writeText(location.origin+location.pathname+"#"+h.id);b.textContent="✓";setTimeout(()=>b.textContent="§",1200)}catch(e){}};
    h.appendChild(b);
  });
})();