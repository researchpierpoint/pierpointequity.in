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
["Research Compare","Compare two research workspaces using the same evidence-first framework.","research-compare.html","research compare companies thesis evidence quality valuation"],
["Company Intelligence","A source-first company research surface for business quality valuation risk and evidence.","intelligence.html","company intelligence research business valuation risk evidence"],
["Question Library","Find answers by the question in your head—not the financial term you already know.","questions.html","question how do i start what should i check risk scam etf global market valuation"],["PirePoint Academy","Connected learning: foundations, practice, global markets, research missions and independent thinking.","academy.html","academy learning course curriculum practice case school research mission skill map"],
  ["Mastery Engine","Diagnose misconceptions, retrieve concepts, transfer knowledge and practise source literacy.","academy.html#mastery","mastery retrieval practice misconception source evidence fraud scam teach back"],
  ["Learning Labs","Interactive fictional cases for valuation, cash conversion and leverage.","labs.html","learning labs valuation cash flow profit debt leverage practice simulator"],
["ETF Guide","Understand ETF structure, NAV, premiums, discounts, costs, liquidity and risks.","guides/etf.html","etf exchange traded fund nav premium discount liquidity"],
["Position Sizing","Learn how exposure, concentration and uncertainty interact.","guides/position-sizing.html","position sizing concentration risk portfolio"],
["Fraud & Scams","Learn verification habits and common investment-fraud warning signs.","guides/fraud-and-scams.html","fraud scam fake tip guarantee return fomo safety"],
["Global Investing","Learn the framework for researching markets across borders.","guides/global-investing.html","global international countries currency regulation tax markets"]
];
function search(q){
 const aliases={"cheap":["p/e","valuation"],"expensive":["p/e","valuation"],"profitability":["roce","roe"],"buy":["how to buy stocks","limit order"],"order":["settlement"],"ipo":["primary market"],"etf":["funds"],"tax":["capital gains tax"],"scam":["stock market scams & fraud"],"price":["valuation"],"chart":["candlestick charts","moving averages"],"trend":["moving averages"],"earnings":["earnings call"],"cash":["cash flow statement"],"debt":["balance sheet"]}; const low=q.toLowerCase(); const expanded=[low,...Object.keys(aliases).filter(k=>low.includes(k)).flatMap(k=>aliases[k])].join(" "); const terms=expanded.split(/\s+/).filter(Boolean);
 return index.map(x=>({x,score:terms.reduce((n,t)=>n+((x[0]+" "+x[1]+" "+x[3]).toLowerCase().includes(t)?1:0),0)})).filter(x=>x.score).sort((a,b)=>b.score-a.score).slice(0,8);
}
if(form&&input&&out){form.addEventListener("submit",e=>{e.preventDefault();const q=input.value.trim();if(!q)return;const m=search(q);out.hidden=false;out.innerHTML=m.length?'<strong>Best matches</strong>'+m.map(z=>'<div class="search-item"><a href="'+esc(z.x[2])+'"><b>'+esc(z.x[0])+'</b></a><br><span>'+esc(z.x[1])+'</span></div>').join(""):'<strong>No close match yet.</strong><br>Try “P/E”, “ROCE”, “India”, “how to buy stocks”, “IPO”, “dividend” or “risk”.';history.replaceState(null,"","?q="+encodeURIComponent(q));});}
document.querySelectorAll(".nav-search").forEach(a=>a.addEventListener("click",e=>{const i=document.getElementById("searchInput");if(i){e.preventDefault();i.scrollIntoView({behavior:"smooth",block:"center"});setTimeout(()=>i.focus(),250);}else if(!document.querySelector(".pp-command-palette")){e.preventDefault();location.href=(location.pathname.includes("/guides/")?"../":"")+"index.html#searchInput";}}));
const primaryLinks=[["Learn","learn.html","learn"],["Markets","countries.html","countries"],["Intelligence","intelligence.html","intelligence"],["Research","research-hub.html","research"],["Tools","tools.html","tools"],["Academy","academy.html","academy"]];
const navRoot=document.querySelector(".nav");
if(navRoot){const navEl=navRoot.querySelector("nav");if(navEl){const depth=location.pathname.split("/").filter(Boolean).length;const root=depth>1?"../":"./";const current=location.pathname.split("/").pop().replace(/\.html$/,"")||"index";navEl.setAttribute("aria-label","Primary navigation");navEl.innerHTML=primaryLinks.map(([label,file,key])=>'<a href="'+root+file+'"'+(current===key?' class="active" aria-current="page"':'')+'>'+label+'</a>').join("")}}
const nav=document.querySelector(".nav nav"); if(nav){let b=document.querySelector(".mobile-menu-button");if(!b){b=document.createElement("button");b.className="mobile-menu-button";b.type="button";b.setAttribute("aria-controls","primary-nav");b.textContent="Menu";nav.parentElement?.insertBefore(b,nav)}nav.id="primary-nav";b.setAttribute("aria-expanded","false");b.setAttribute("aria-label","Open navigation");const closeNav=()=>{nav.classList.remove("open");b.setAttribute("aria-expanded","false");b.setAttribute("aria-label","Open navigation")};b.onclick=()=>{const open=nav.classList.toggle("open");b.setAttribute("aria-expanded",String(open));b.setAttribute("aria-label",open?"Close navigation":"Open navigation");if(open)setTimeout(()=>nav.querySelector("a")?.focus(),0)};nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",closeNav));document.addEventListener("click",e=>{if(nav.classList.contains("open")&&!nav.contains(e.target)&&e.target!==b)closeNav()});addEventListener("keydown",e=>{if(e.key==="Escape"&&nav.classList.contains("open")){closeNav();b.focus()}});}
addEventListener("keydown",e=>{const tag=document.activeElement?.tagName?.toLowerCase();if((e.key==="/"||((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"))&&tag!=="input"&&tag!=="textarea"&&tag!=="select"){const i=document.getElementById("searchInput");if(i){e.preventDefault();i.focus();i.select()}}});
const path=location.pathname; const siteRoot=(location.pathname.split("/").filter(Boolean).length>1) ? "../" : "./"; if(path.endsWith("index.html")||path.endsWith("/")){const last=localStorage.getItem("pirepoint:last-guide");const holder=document.getElementById("continueLearning");if(holder&&last){holder.innerHTML='<span class="tag">CONTINUE LEARNING</span><h3>Pick up where you left off</h3><p>You were exploring a guide. Continue without starting over.</p><a href="'+esc(last)+'">Continue →</a>';holder.hidden=false;}}
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
    const b=document.createElement("div");b.className="pp-breadcrumb";b.innerHTML='<a href="'+siteRoot+'index.html">PirePoint</a><span>›</span><span>'+document.title.split("—")[0].trim()+'</span>';
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
(function(){const nav=document.querySelector(".site-header nav");if(!nav||nav.querySelector('a[href="research-hub.html"]'))return;const a=document.createElement("a");a.href="research-hub.html";a.textContent="Research";const tools=nav.querySelector('a[href="tools.html"]');tools?nav.insertBefore(a,tools):nav.appendChild(a)})();

/* Global command palette: one fast way through a very large knowledge system. */
(function(){
 if(document.querySelector('.pp-command-palette'))return;
 const wrap=document.createElement('div');wrap.className='pp-command-palette';wrap.hidden=true;
 wrap.innerHTML='<div class="pp-command-backdrop" data-close></div><section class="pp-command-dialog" role="dialog" aria-modal="true" aria-labelledby="ppCommandTitle"><div class="pp-command-head"><div><span class="tag">PirePoint command</span><h2 id="ppCommandTitle">Where do you want to go?</h2></div><button type="button" class="pp-command-close" data-close aria-label="Close">Esc</button></div><input id="ppCommandInput" class="pp-command-input" autocomplete="off" placeholder="Ask for a concept, market, guide or research task…"><div class="pp-command-hint">Press <kbd>Enter</kbd> to open the first match · <kbd>Esc</kbd> to close</div><div id="ppCommandResults" class="pp-command-results"></div></section></div>';
 document.body.appendChild(wrap);
 const input=wrap.querySelector('#ppCommandInput'),results=wrap.querySelector('#ppCommandResults');
 const data=[["Learn Investing","Start from zero or choose an advanced learning route.","learn.html","learn investing basics advanced"],["Question Library","Find answers by the question in your head.","questions.html","question answer start"],["Markets","Explore country-by-country market structure and global bridges.","countries.html","markets global countries"],["Company Intelligence","Research business quality, financials, valuation, risk and evidence.","intelligence.html","company research business valuation risk evidence"],["Research Hub","Return to your saved research workspaces and thesis history.","research-hub.html","research workspace thesis"],["Research Studio","Model assumptions and test scenarios.","tools.html#research-studio","model stress test scenarios"],["Tools","Use calculators and research tools.","tools.html","tools calculator"],["Fundamental Analysis","Understand business, financial statements and valuation.","guides/fundamental-analysis.html","fundamental analysis"],["Stock Market Basics","Build the market mental model from first principles.","guides/stock-market-basics.html","stocks shares exchange beginner"],["China Market Guide","Learn China's market structure and investor mechanics.","countries/china.html","china"],["United States Market Guide","Learn US market structure and investor mechanics.","countries/united-states.html","usa united states"],["India Market Guide","Learn India's market structure and investor mechanics.","countries/india.html","india"],["Learning & Research System","Build a personal route, practise cases, test mastery and review weak concepts.","system.html","learning research mastery cases evidence review"],["Market University","Study the complete market curriculum: structure, accounting, valuation, macro, portfolios, derivatives, behaviour, data, ethics and global markets.","market-university.html","market university curriculum accounting macro options portfolio derivatives global behaviour data"]];
 const clean=s=>String(s||"").toLowerCase(); const run=q=>{const low=clean(q).trim();const items=(low?data.filter(x=>clean(x[0]+" "+x[1]+" "+x[3]).split(/\\s+/).some(t=>t&&low.includes(t)||low.split(/\\s+/).some(qt=>qt&&clean(x[0]+" "+x[1]+" "+x[3]).includes(qt)))):data).slice(0,7);results.innerHTML=items.length?items.map((x,i)=>'<a class="pp-command-item" href="'+x[2]+'"><span>'+String(i+1).padStart(2,'0')+'</span><div><b>'+esc(x[0])+'</b><small>'+esc(x[1])+'</small></div><i>↗</i></a>').join(''):'<div class="pp-command-empty">No close match. Try “learn China”, “research a company”, “valuation”, “risk” or “how do I start?”.</div>'};
 const open=()=>{wrap.hidden=false;document.body.classList.add('pp-command-open');input.value='';run('');setTimeout(()=>input.focus(),30)};
 const close=()=>{wrap.hidden=true;document.body.classList.remove('pp-command-open')};
 input.addEventListener('input',()=>run(input.value));input.addEventListener('keydown',e=>{if(e.key==='Escape')close();if(e.key==='Enter'){const a=results.querySelector('a');if(a)location.href=a.href}});wrap.querySelectorAll('[data-close]').forEach(x=>x.addEventListener('click',close));
 document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();open()}else if(e.key==='/'&&document.activeElement?.tagName!=='INPUT'&&document.activeElement?.tagName!=='TEXTAREA'){e.preventDefault();open()}else if(e.key==='Escape'&&!wrap.hidden)close()});
 document.querySelectorAll('.nav-search').forEach(a=>a.addEventListener('click',e=>{if(!document.getElementById('searchInput')){e.preventDefault();open()}}));
})();

/* Small accessibility and reading-comfort upgrades. */
(function(){
 if(!document.querySelector('.pp-skip-link')){const a=document.createElement('a');a.className='pp-skip-link';a.href='#main-content';a.textContent='Skip to content';document.body.prepend(a);const m=document.querySelector('main');if(m){m.id='main-content'}}
 document.querySelectorAll('a,button,input,select,textarea').forEach(el=>{if(!el.hasAttribute('aria-label')&&el.textContent.trim()===''&&el.tagName==='BUTTON')el.setAttribute('aria-label','Action')});
})();

// PirePoint Academy interaction layer
(function(){
  const dial=document.querySelectorAll(".depth-dial button");
  if(dial.length){
    dial.forEach(b=>b.addEventListener("click",()=>{
      dial.forEach(x=>x.classList.remove("active")); b.classList.add("active");
      const mode=b.textContent.trim();
      const note=document.querySelector(".academy-command>div:last-child p");
      if(note) note.textContent = mode==="5 MIN" ? "Get the mental model and one practical example." :
        mode==="30 MIN" ? "Understand the mechanics, limitations and a worked example." :
        mode==="2 HOURS" ? "Connect the concept to financials, valuation, risk and research." :
        "Follow the full concept chain, practise it and challenge the assumptions.";
    }));
  }
  const quiz=[...document.querySelectorAll("[data-retrieval-question]")];
  quiz.forEach(q=>{
    const buttons=q.querySelectorAll("button[data-answer]");
    const feedback=q.querySelector("[data-feedback]");
    buttons.forEach(b=>b.addEventListener("click",()=>{
      buttons.forEach(x=>x.disabled=true);
      const correct=b.dataset.answer==="correct";
      if(feedback){feedback.hidden=false;feedback.textContent=correct?"Correct. Now explain why in your own words.":"Not quite. Read the explanation, then try to state the rule without looking.";feedback.classList.toggle("is-correct",correct);}
    }));
  });
})();


/* PirePoint Experience OS — contextual continuity layer */
(function(){
  if(document.body.dataset.ppExperienceOs)return;
  document.body.dataset.ppExperienceOs="1";
  const q=(s,r=document)=>r.querySelector(s);
  const path=location.pathname.replace(/^\//,"");
  const home=!path||path==="index.html";
  const routine=path==="routine.html";
  const learn=path==="learn.html";
  const intelligence=path==="intelligence.html";
  const research=/research/.test(path);
  const add=(tag,cls,html)=>{const e=document.createElement(tag);e.className=cls;if(html!=null)e.innerHTML=html;return e};

  /* Header changes weight after the reader has actually moved. */
  const header=q(".site-header");
  if(header)addEventListener("scroll",()=>header.classList.toggle("pp-scrolled",scrollY>20),{passive:true});

  /* Make the journey explicit without adding another giant navigation system. */
  const main=q("main");
  if(main && home && !q(".pp-journey")){
    const hero=q(".hero-home");
    if(hero){
      const journey=add("nav","pp-journey",[
        ["01","ORIENT","Tell us what you need","Choose a question, market, learning route or research task."],
        ["02","EXPLORE","Follow the useful path","PirePoint progressively reveals the depth you need."],
        ["03","PROVE","Test your understanding","Cases, labs and research work turn reading into evidence."],
        ["04","CONTINUE","Never start over","Your next useful step follows what you actually did."]
      ].map(x=>'<a href="'+(x[1]==="ORIENT"?"#start":x[1]==="EXPLORE"?"#start":x[1]==="PROVE"?"learn.html#advanced":"routine.html")+'"><span>'+x[0]+" · "+x[1]+'</span><b>'+x[2]+'</b><small>'+x[3]+'</small></a>').join(""));
      hero.appendChild(journey);
    }
  }

  /* A page should answer “what do I do next?” without spraying recommendations everywhere. */
  if(main && !home && !q(".pp-focus-strip") && !/countries\//.test(path)){
    const h=q("h1");
    if(h){
      const strip=add("div","pp-focus-strip",'<span><b>'+(
        routine?"Build my route":learn?"Learning system":intelligence?"Company intelligence":research?"Research mode":"PirePoint"
      )+'</b> · stay oriented</span><a href="index.html">Home</a><a href="routine.html">Build my routine</a><a href="intelligence.html">Research</a>');
      const firstSection=main.querySelector("section");
      if(firstSection)firstSection.insertBefore(strip,firstSection.firstChild);
    }
  }

  /* Contextual “next step” is deliberately singular: one strong continuation beats a recommendation wall. */
  if(main && !home && !routine){
    const existing=main.querySelector(".pp-next-action");
    if(!existing){
      let href="routine.html",label="Build your personal route";
      if(learn){href="case-school.html";label="Prove the framework in Case School";}
      else if(intelligence){href="research-hub.html";label="Carry the intelligence view into a research workspace";}
      else if(research){href="case-school.html";label="Challenge the reasoning in Case School";}
      const anchor=main.querySelector("section:last-of-type")||main.lastElementChild;
      if(anchor){
        const next=add("aside","pp-next-action",'<div><span class="tag">ONE USEFUL NEXT STEP</span><h3>'+label+'</h3><p>Continue from the work you just did. You should never have to decide what to do next from a blank page.</p></div><a class="button" href="'+href+'">Continue →</a>');
        anchor.parentNode.insertBefore(next,anchor);
      }
    }
  }

  /* Routine gets a calm “why” context before the diagnostic rather than another instruction block. */
  if(routine){
    const first=q("main section");
    if(first&&!q(".pp-context"))first.insertBefore(add("div","pp-context","PirePoint is not trying to measure how much you remember. It is trying to discover what you can actually use."),first.firstChild);
  }

  /* Intelligence pages gain a stronger scan hierarchy: one primary question per evidence block. */
  if(intelligence){
    q(".intel-grid")?.querySelectorAll(".intel-card").forEach((card,i)=>{
      card.style.setProperty("--intel-order",i+1);
      card.setAttribute("tabindex","0");
    });
  }

  /* Gentle keyboard shortcut hint on the search control. */
  const search=q("#searchInput");
  if(search&&!q(".pp-search-hint")){
    const wrap=search.closest("form");
    if(wrap&&!wrap.querySelector(".pp-search-hint")){
      const hint=add("span","pp-search-hint","Press <kbd>/</kbd> to search anywhere");
      wrap.insertAdjacentElement("afterend",hint);
    }
  }
})();

/* Learn Before You Invest: surface the 300-lesson route on every market page. */
(function(){
 const m=location.pathname.match(/countries\/([^/]+)\.html$/); if(!m)return;
 const slug=m[1]; const labels={"united-states":"United States",china:"China",india:"India",japan:"Japan","hong-kong":"Hong Kong",united-kingdom:"United Kingdom",australia:"Australia",canada:"Canada",south-korea:"South Korea",germany:"Germany",singapore:"Singapore",uae:"United Arab Emirates"};
 if(!labels[slug]||document.querySelector(".pp-learn-market"))return;
 const main=document.querySelector("main"); if(!main)return;
 const box=document.createElement("section"); box.className="pp-learn-market card"; box.style.cssText="margin:22px auto;max-width:1100px;padding:24px;border:1px solid var(--line);border-radius:18px;background:#f7f9ef;display:flex;justify-content:space-between;gap:18px;align-items:center";
 box.innerHTML='<div><span class="tag">LEARN BEFORE YOU INVEST</span><h2 style="margin:6px 0">300 things to know before investing in '+labels[slug]+'</h2><p style="margin:0;color:var(--muted);line-height:1.55">240 destination-market lessons + 60 lessons for the investor\'s home-country context. Learn, prove, verify and track progress.</p></div><a class="button" href="../learn-before-invest.html?target='+encodeURIComponent(labels[slug])+'">Open the 300-lesson route →</a>';
 const first=main.firstElementChild; main.insertBefore(box,first||null);
})();

/* Shared world-class UX loader */
(function(){if(document.querySelector('script[src*="world-class.js"]'))return;var s=document.createElement("script");s.src=(location.pathname.split("/").filter(Boolean).length>1?"../":"./")+"assets/world-class.js?v=20261001";s.defer=true;document.body.appendChild(s)})();


/* PirePoint human-first interaction layer */
(function(){
  "use strict";
  const qs=s=>document.querySelector(s);
  const qsa=s=>Array.from(document.querySelectorAll(s));

  /* Mobile navigation: conventional, reversible, keyboard-safe. */
  const nav=qs(".nav nav"), navWrap=qs(".nav");
  if(nav && navWrap && !qs(".mobile-menu-button")){
    const b=document.createElement("button");
    b.type="button"; b.className="mobile-menu-button";
    b.setAttribute("aria-expanded","false"); b.setAttribute("aria-controls","primary-nav");
    b.textContent="Menu";
    nav.id="primary-nav";
    navWrap.insertBefore(b,nav);
    const close=()=>{nav.classList.remove("open");b.setAttribute("aria-expanded","false")};
    b.addEventListener("click",()=>{const open=!nav.classList.contains("open");nav.classList.toggle("open",open);b.setAttribute("aria-expanded",String(open))});
    nav.addEventListener("click",e=>{if(e.target.closest("a"))close()});
    document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});
  }

  /* Long-page orientation. Only add it when a page genuinely needs it. */
  const main=qs("main");
  if(main && document.body.scrollHeight>1800 && !qs(".reading-progress")){
    const bar=document.createElement("div");
    bar.className="reading-progress";
    bar.setAttribute("aria-hidden","true");
    bar.innerHTML="<span></span>";
    document.body.prepend(bar);
    const fill=bar.firstElementChild;
    const update=()=>{
      const max=document.documentElement.scrollHeight-window.innerHeight;
      fill.style.width=(max>0?Math.min(100,Math.max(0,window.scrollY/max*100)):0)+"%";
    };
    window.addEventListener("scroll",update,{passive:true}); update();
  }

  /* Make external links explicit without changing existing wording. */
  qsa('a[target="_blank"]').forEach(a=>{
    if(!a.getAttribute("rel")) a.setAttribute("rel","noopener noreferrer");
  });

  /* Prevent accidental double-submit while preserving normal forms. */
  qsa("form").forEach(form=>{
    form.addEventListener("submit",()=>{
      const submit=form.querySelector('button[type="submit"],button:not([type])');
      if(submit && !submit.dataset.once){
        submit.dataset.once="1";
        window.setTimeout(()=>delete submit.dataset.once,1200);
      }
    });
  });
})();


/* Global information architecture: the same mental map everywhere. */
(function(){
  "use strict";
  const nav=document.querySelector(".nav nav");
  if(nav){
    const path=location.pathname.replace(/^\//,"");
    const root=path.startsWith("countries/")||path.startsWith("guides/")?"../":"";
    const items=[
      ["Learn",root+"learn.html",["learn.html","guides.html","lesson.html","academy.html"]],
      ["Markets",root+"countries.html",["countries.html","compare.html","countries/"]],
      ["Research",root+"intelligence.html",["intelligence.html","research-hub.html","research.html","research-compare.html","research/"]],
      ["Tools",root+"tools.html",["tools.html","labs.html"]],
      ["Academy",root+"academy.html",["academy.html","routine.html","system.html"]]
    ];
    nav.innerHTML=items.map(([label,href,matches])=>{
      const active=matches.some(x=>path===x||path.startsWith(x))?" aria-current=\"page\"":"";
      return '<a href="'+href+'"'+active+'>'+label+'</a>';
    }).join("");
  }

  /* Breadcrumbs only on genuinely deep pages; never on the homepage. */
  const main=document.querySelector("main");
  if(main && !document.querySelector(".site-breadcrumb") && location.pathname!="/" && !location.pathname.endsWith("/index.html")){
    const parts=location.pathname.split("/").filter(Boolean);
    if(parts.length){
      const last=(parts[parts.length-1]||"").replace(/\.html$/,"").replace(/[-_]+/g," ");
      const section=parts[0]==="countries"?"Markets":parts[0]==="guides"?"Guides":parts[0]==="research"?"Research":"";
      const crumb=document.createElement("nav");
      crumb.className="site-breadcrumb";
      crumb.setAttribute("aria-label","Breadcrumb");
      const label=last?last.charAt(0).toUpperCase()+last.slice(1):"Current page";
      crumb.innerHTML='<a href="'+(parts.length>1?"../":"./")+'index.html">Home</a><span aria-hidden="true">/</span>'+(section?'<a href="'+(parts[0]==="countries"?"../countries.html":parts[0]==="guides"?"../guides.html":"../research-hub.html")+'">'+section+'</a><span aria-hidden="true">/</span>':'')+'<span aria-current="page">'+label+'</span>';
      const first=main.firstElementChild;
      if(first) main.insertBefore(crumb,first);
    }
  }

  /* Tell assistive technology that page title content has a clear main landmark. */
  if(main && !main.id) main.id="main-content";
})();
