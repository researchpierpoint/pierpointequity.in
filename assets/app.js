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
["Research Workspace","Build a company thesis with business, financials, valuation, risks and an evidence ledger.","research.html","research workspace company analysis thesis evidence valuation risks"],
["Research Compare","Compare two research workspaces using the same evidence-first framework.","research-compare.html","research compare companies thesis evidence quality valuation"]
];
function search(q){
 const aliases={"cheap":["p/e","valuation"],"expensive":["p/e","valuation"],"profitability":["roce","roe"],"buy":["how to buy stocks","limit order"],"order":["settlement"],"ipo":["primary market"],"etf":["funds"],"tax":["capital gains tax"],"scam":["stock market scams & fraud"],"price":["valuation"],"chart":["candlestick charts","moving averages"],"trend":["moving averages"],"earnings":["earnings call"],"cash":["cash flow statement"],"debt":["balance sheet"]}; const low=q.toLowerCase(); const expanded=[low,...Object.keys(aliases).filter(k=>low.includes(k)).flatMap(k=>aliases[k])].join(" "); const terms=expanded.split(/\s+/).filter(Boolean);
 return index.map(x=>({x,score:terms.reduce((n,t)=>n+((x[0]+" "+x[1]+" "+x[3]).toLowerCase().includes(t)?1:0),0)})).filter(x=>x.score).sort((a,b)=>b.score-a.score).slice(0,8);
}
if(form&&input&&out){form.addEventListener("submit",e=>{e.preventDefault();const q=input.value.trim();if(!q)return;const m=search(q);out.hidden=false;out.innerHTML=m.length?'<strong>Best matches</strong>'+m.map(z=>'<div class="search-item"><a href="'+esc(z.x[2])+'"><b>'+esc(z.x[0])+'</b></a><br><span>'+esc(z.x[1])+'</span></div>').join(""):'<strong>No close match yet.</strong><br>Try “P/E”, “ROCE”, “India”, “how to buy stocks”, “IPO”, “dividend” or “risk”.';history.replaceState(null,"","?q="+encodeURIComponent(q));});}
document.querySelectorAll(".nav-search").forEach(a=>a.addEventListener("click",e=>{const i=document.getElementById("searchInput");if(i){e.preventDefault();i.scrollIntoView({behavior:"smooth",block:"center"});setTimeout(()=>i.focus(),250);}}));
const nav=document.querySelector(".nav nav"); if(nav&&!nav.querySelector('a[href*="tools.html#research-studio"]')){const a=document.createElement("a");a.href=(location.pathname.includes("/guides/")?"../":"")+"tools.html#research-studio";a.textContent="Research Studio";nav.appendChild(a)} if(nav&&!document.querySelector(".mobile-menu-button")){const b=document.createElement("button");b.className="mobile-menu-button";b.setAttribute("aria-label","Open navigation");b.textContent="Menu";b.onclick=()=>nav.classList.toggle("open");nav.parentElement?.insertBefore(b,nav);}
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
/* Discovery layer: contextual, local-first and privacy-light. */
(function(){
  const p=location.pathname;
  const q=document.getElementById("guideSearch");
  if(q){
    const cards=[...document.querySelectorAll(".guide-card")];
    const filter=()=>{const v=q.value.trim().toLowerCase();let n=0;cards.forEach(c=>{const hit=!v||(c.dataset.text||c.textContent).toLowerCase().includes(v);c.hidden=!hit;if(hit)n++});const old=document.getElementById("guideSearchCount");if(old)old.textContent=n+" guide"+(n===1?"":"s")+" shown";};
    const meta=document.createElement("div");meta.id="guideSearchCount";meta.className="section-note";meta.textContent=cards.length+" guides";q.insertAdjacentElement("afterend",meta);q.addEventListener("input",filter);
  }
  document.querySelectorAll(".guide-filters button").forEach(b=>b.addEventListener("click",()=>{
    document.querySelectorAll(".guide-filters button").forEach(x=>x.classList.remove("active"));b.classList.add("active");
    const path=b.dataset.path||"all";const cards=[...document.querySelectorAll(".guide-card")];
    cards.forEach(c=>{const t=(c.dataset.text||"").toLowerCase();let hit=path==="all";if(path==="beginner")hit=/basic|buy|broker|market|order|settlement|dividend/.test(t);if(path==="investor")hit=/analysis|fundamental|valuation|roce|roe|eps|cash|balance|portfolio/.test(t);if(path==="trader")hit=/trading|technical|volume|candlestick|moving|macd|stop-loss|risk-reward/.test(t);if(path==="global")hit=/country|global|market/.test(t);c.hidden=!hit});
  }));
  /* Add a compact breadcrumb to interior pages when absent. */
  if(!/^\/$/.test(p) && !document.querySelector(".pp-breadcrumb") && document.querySelector("main.page")){
    const b=document.createElement("div");b.className="pp-breadcrumb";b.innerHTML='<a href="index.html">PirePoint</a><span>›</span><span>'+document.title.split("—")[0].trim()+'</span>';
    document.querySelector("main.page").prepend(b);
  }
})();
/* Guide reading experience: orient the reader before asking for attention. */
(function(){
  const main=document.querySelector("main.page");
  const article=main?.querySelector("article.card");
  if(!main||!article)return;
  if(!main.querySelector(".guide-context")){
    const lead=main.querySelector(".lead");
    const box=document.createElement("aside");
    box.className="guide-context";
    box.innerHTML='<div><b>What this helps you answer</b><span>Build a clear mental model, know what to check, and understand which questions deserve deeper research.</span></div><div><b>Keep this distinction</b><span>This page explains the concept. Current prices, rules and company-specific facts should be verified from the relevant primary source.</span></div>';
    (lead||article).insertAdjacentElement("afterend",box);
  }
  const headings=[...article.querySelectorAll("h2")];
  if(headings.length>=3&&!main.querySelector(".guide-rail")){
    const rail=document.createElement("nav");
    rail.className="guide-rail";rail.setAttribute("aria-label","On this page");
    const title=document.createElement("b");title.textContent="On this page";rail.appendChild(title);
    headings.forEach((h,n)=>{
      if(!h.id)h.id="section-"+(n+1);
      const a=document.createElement("a");a.href="#"+h.id;
      const label=h.textContent.replace(/§/g,"").trim();
      a.innerHTML='<span>'+String(n+1).padStart(2,"0")+'</span>'+label;
      rail.appendChild(a);
    });
    main.classList.add("guide-reading-layout");main.insertBefore(rail,article);
    if("IntersectionObserver" in window){
      const links=[...rail.querySelectorAll("a")];
      const map=new Map(headings.map((h,i)=>[h,links[i]]));
      const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(x=>x.classList.remove("active"));map.get(e.target)?.classList.add("active")}}),{rootMargin:"-18% 0px -68% 0px",threshold:0});
      headings.forEach(h=>io.observe(h));
    }
  }
  if(!main.querySelector(".guide-trust")){
    const meta=document.querySelector('meta[property="og:updated_time"],meta[name="dateModified"]');
    const date=meta?.content||document.querySelector('script[type="application/ld+json"]')?.textContent.match(/"dateModified":"([^\"]+)"/)?.[1];
    const trust=document.createElement("div");trust.className="guide-trust";
    trust.innerHTML='<span class="guide-trust-dot" aria-hidden="true"></span><div><b>Editorial guide</b><span>Educational, source-aware content. '+(date?"Reviewed "+date+".":"Check the page context and primary sources before acting.")+'</span></div>';
    article.insertAdjacentElement("afterend",trust);
  }
})();

/* PirePoint attention architecture: help the visitor orient, not manipulate. */
(function(){
  const path=location.pathname;
  const isGuide=/\/guides\//.test(path);
  const main=document.querySelector("main");
  if(!main)return;

  // Reading progress: gives orientation on long research pages without creating urgency.
  if(isGuide && !document.querySelector(".pp-reading-progress")){
    const bar=document.createElement("div");bar.className="pp-reading-progress";bar.innerHTML='<span></span>';document.body.prepend(bar);
    const fill=bar.firstElementChild;
    const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;fill.style.width=(max>0?Math.min(100,Math.max(0,scrollY/max*100)):0)+"%"};
    addEventListener("scroll",update,{passive:true});addEventListener("resize",update);update();
  }

  // Persistent orientation strip: tells the reader what the page is for and where to go next.
  if(isGuide && !document.querySelector(".pp-focus-strip")){
    const article=main.querySelector("article");
    if(article){
      const title=(article.querySelector("h1")||document.querySelector("h1"))?.textContent?.trim();
      const strip=document.createElement("div");strip.className="pp-focus-strip";
      strip.innerHTML='<span><b>Research mode</b> · '+(title||"Deep guide")+'</span><a href="../guides.html">All guides</a><a href="../tools.html#research-studio">Research Studio</a>';
      main.prepend(strip);
    }
  }

  // End-of-page continuation: one useful next action, not a wall of recommendations.
  if(isGuide && !document.querySelector(".pp-next-action")){
    const complete=main.querySelector(".guide-complete")||main.querySelector("article");
    if(complete){
      const next=document.createElement("aside");next.className="pp-next-action";
      const text=(document.title+" "+location.pathname).toLowerCase();
      let href="../guides/fundamental-analysis.html",label="Go deeper: Fundamental Analysis";
      if(/dcf|valuation|pe-ratio|peg|historical-pe/.test(text)){href="../guides/how-to-analyse-a-stock.html";label="Next: Put valuation into a full stock analysis";}
      else if(/balance|cash-flow|income|eps|revenue|profit|roe|roce|ebitda|margin|debt/.test(text)){href="../guides/how-to-analyse-a-stock.html";label="Next: Connect the numbers into a company thesis";}
      else if(/technical|moving|rsi|macd|candlestick|support|volume/.test(text)){href="../guides/risk-reward.html";label="Next: Turn a chart view into a risk framework";}
      next.innerHTML='<div><span class="tag">NEXT USEFUL STEP</span><h3>'+label+'</h3><p>Keep the context. Continue from what you just learned rather than starting over.</p></div><a class="button" href="'+href+'">Continue →</a>';
      complete.parentNode.insertBefore(next,complete.nextSibling);
    }
  }
})();

/* Global Research navigation */
(function(){const nav=document.querySelector(".site-header nav");if(!nav||nav.querySelector('a[href="research.html"]'))return;const a=document.createElement("a");a.href="research-hub.html";a.textContent="Research";const tools=nav.querySelector('a[href="tools.html"]');tools?nav.insertBefore(a,tools):nav.appendChild(a)})();
