(()=>{"use strict";
const K="ppSystemV1";const load=()=>{try{return JSON.parse(localStorage.getItem(K)||"{}")}catch{return{}}};let s=load();const save=()=>localStorage.setItem(K,JSON.stringify(s));
const $=(q,r=document)=>r.querySelector(q), $$=(q,r=document)=>[...r.querySelectorAll(q)];
const mastery=[["market","Market structure","Explain ownership, exchanges and price formation.","guides/stock-market-basics.html"],["mechanics","Mechanics","Explain orders, settlement, custody and access.","guides/how-to-buy-stocks.html"],["business","Business","Map how a business creates and captures value.","guides/fundamental-analysis.html"],["financials","Financials","Read profit, balance sheet and cash together.","guides/balance-sheet.html"],["valuation","Valuation","Explain what a price requires, not just a multiple.","guides/pe-ratio.html"],["risk","Risk","Identify what can permanently impair an idea.","guides/risk-reward.html"],["global","Global markets","Transfer a framework across borders and identify deltas.","countries.html"],["evidence","Evidence","Separate verified facts, calculations, assumptions and unknowns.","methodology.html"],["research","Research","Run a finite research process from question to thesis.","research.html"],["redteam","Independent thinking","Generate the strongest case against your own conclusion.","intelligence.html"]];
const profileDefaults={stage:null,goal:null,target:null,depth:null,markets:[],skills:[]};
s.profile=Object.assign(profileDefaults,s.profile||{});
const routeData={
starting:{
foundation:["Market mental model","Ownership, exchanges & price discovery","Orders, settlement & custody","Business models","Financial statements","Cash flow & working capital","Valuation basics","Risk, diversification & behaviour"],
market:["Market structure","Instruments & access","Local reporting & accounting","Currency & macro","Regulation & investor protection","How to research locally","Historical regimes & common traps"],
research:["How a business makes money","Financial quality","Cash conversion","Capital allocation","Valuation & expectations","Risk & red team","Evidence trail","Write a research note"],
valuation:["Profit & cash","Capital efficiency","P/E and multiples","EV-based valuation","DCF & terminal value","Sensitivity & scenarios","Reverse valuation","Valuation failure modes"],
portfolio:["Return & risk","Diversification & correlation","Position sizing","Drawdown & risk of ruin","Factor exposure","Rebalancing","Liquidity & execution","Portfolio review"],
trading:["Market structure","Orders & spreads","Liquidity & market impact","Price discovery","Volatility","Execution","Risk controls","Post-trade review"],
macro:["Inflation","Rates","Central-bank transmission","Fiscal policy","Credit cycle","Business cycle","Currencies & commodities","Regime analysis"],
judgement:["Evidence quality","Fact vs inference","Base rates","Alternative explanations","Scenario thinking","Contradiction testing","Red team","Decision journal"]
},
better:{
foundation:["Find the missing prerequisite","Accounting nuance","Business economics","Cash conversion","Valuation context","Risk & portfolio interaction"],
market:["Keep known concepts","Map the destination-market delta","Regulation & access","Reporting conventions","Currency & macro","Sector structure","Local research sources","Historical failure modes"],
research:["Research question","Evidence hierarchy","Financial engine","Incremental returns","Expectations","Variant perception","Red team","Post-mortem"],
valuation:["Denominator quality","Multiple selection","Cross-cycle comparison","DCF assumptions","Reverse DCF logic","Scenario ranges","Capital intensity","Valuation contradictions"],
portfolio:["Concentration","Correlation & hidden overlap","Factor exposure","Position sizing","Liquidity","Drawdowns","Rebalancing","Performance attribution"],
trading:["Execution costs","Liquidity","Market impact","Volatility regimes","Order selection","Gap/overnight risk","Sizing","Execution review"],
macro:["Transmission mechanisms","Leading vs lagging indicators","Credit conditions","Rates & valuation","FX & commodities","Cycle regimes","Cross-market links","Scenario trees"],
judgement:["Forecast calibration","Bayesian updating","Falsification","Contradictions","Selection bias","Survivorship bias","Narrative vs evidence","Decision review"]
},
understand:{
foundation:["Audit the fundamentals","Accounting edge cases","Capital allocation","Advanced valuation","Portfolio construction","Risk systems"],
market:["Identify what stays the same","Map what changes","Regulator & legal structure","Exchange & settlement","Investor access","Currency & tax","Reporting/accounting","Local valuation norms","Sector & macro drivers","Research sources","Market-specific traps","Historical regimes"],
research:["Research design","Primary-source evidence","Accounting quality","Industry structure","Management & capital allocation","Valuation expectations","Scenario analysis","Red team","Thesis & falsification","Research post-mortem"],
valuation:["Business economics","Normalization","Multiple architecture","DCF mechanics","Terminal value","Reverse valuation","Scenario/sensitivity","Market-implied expectations","Accounting distortions","Cross-market valuation context"],
portfolio:["Asset allocation","Correlation/covariance","Factor overlap","Risk contribution","Sizing","Liquidity stress","Performance attribution","Rebalancing","Behavioural risk","Portfolio post-mortem"],
trading:["Microstructure","Order book & liquidity","Execution benchmarks","Slippage & impact","Volatility","Derivatives interaction","Market regime","Operational controls"],
macro:["Monetary transmission","Fiscal impulse","Credit cycle","Inflation regime","Yield curve","FX regime","Commodity sensitivity","Global spillovers","Scenario trees","Historical regime comparison"],
judgement:["Hypothesis design","Base rates","Bayesian updating","Evidence grading","Contradiction logs","Model risk","Forecast intervals","Falsification","Pre-mortem","Decision journal"]
}
};
const marketDelta=["Structure & regulator","Exchange, clearing & settlement","Instruments & index ecosystem","Investor access & ownership limits","Reporting & accounting conventions","Currency, FX & tax","Sector and economic composition","Valuation conventions","Corporate actions & shareholder rights","Local primary sources & disclosures","Liquidity, shorting & derivatives","Historical regimes, crises & local traps"];
const links={foundation:"learn.html",market:"countries.html",research:"intelligence.html",valuation:"guides/dcf.html",portfolio:"market-university.html",trading:"guides/how-to-buy-stocks.html",macro:"market-university.html",judgement:"methodology.html"};
const esc=v=>String(v??"").replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
function selected(group,v){$$(`[data-profile="${group}"] button`).forEach(x=>x.classList.toggle("active",group==="markets"||group==="skills"?s.profile[group].includes(x.dataset.v):x.dataset.v===v))}
function buildRoutine(){
 const p=s.profile||profileDefaults,title=$("#osRouteTitle"),copy=$("#osRouteCopy"),steps=$("#osRouteSteps"),delta=$("#osRouteDelta"),actions=$("#osRouteActions"),primary=$("#osRoutePrimary");
 if(!title)return;
 const showTarget=p.goal==="market" || p.stage==="understand";
 $(".routine-target")?.toggleAttribute("hidden",!showTarget);
 if(!p.stage||!p.goal||!p.depth || (showTarget&&!p.target)){
  title.textContent=p.stage==="understand"?"Now tell me which market you want to understand next.":"Tell me where you are and what you want to become.";
  copy.textContent="The routine will not assume that a beginner and an experienced investor need the same lesson. It will remove known material and expose the missing layer.";
  steps.innerHTML="";delta.hidden=true;actions.hidden=true;return;
 }
 const route=(routeData[p.stage]||routeData.better)[p.goal]||routeData.better.foundation;
 const known=p.skills||[];
 const filtered=route.filter(x=>!known.some(k=>x.toLowerCase().includes(k)));
 const final=(filtered.length?filtered:route).slice(0,p.depth==="quick"?3:p.depth==="session"?6:12);
 const titleText=p.stage==="starting"?"Your starting routine":p.stage==="better"?"Your improvement routine":"Your advanced routine";
 title.textContent=titleText;
 copy.textContent=p.goal==="market"
  ?`You already know ${p.markets?.length?p.markets.join(", "):"a market"}. We will preserve transferable concepts and spend the study time on the destination-market delta.`
  :`This route is built around your goal, your existing skills and the depth you selected. Known areas are treated as checkpoints, not repeated lessons.`;
 steps.innerHTML=final.map((x,i)=>`<div><b>${String(i+1).padStart(2,"0")}</b><span>${esc(x)}</span></div>`).join("");
 if(p.goal==="market"){
   delta.hidden=false;
   delta.innerHTML=`<strong>THE MARKET DELTA</strong><p>For ${esc(p.target)}, study these separately instead of assuming your home-market rules transfer:</p><div class="routine-delta-grid">${marketDelta.map(x=>`<span>${esc(x)}</span>`).join("")}</div><small>Same: core economics, financial logic, valuation principles and research discipline. Different: the market's rules, access, reporting, currency, institutions, investor base and local evidence.</small>`;
 } else {delta.hidden=true;delta.innerHTML="";}
 actions.hidden=false;primary.href=links[p.goal]||"learn.html";
}
$$("[data-profile]").forEach(group=>{
 const key=group.dataset.profile;
 $$("button",group).forEach(btn=>btn.addEventListener("click",()=>{
   const v=btn.dataset.v;s.profile=s.profile||profileDefaults;
   if(key==="markets"||key==="skills"){
     let arr=s.profile[key]||[];
     if(v==="none") arr=["none"]; else {arr=arr.filter(x=>x!=="none");arr=arr.includes(v)?arr.filter(x=>x!==v):[...arr,v];}
     s.profile[key]=arr;
   } else s.profile[key]=v;
   save();selected(key,key==="markets"||key==="skills"?v:s.profile[key]);buildRoutine();
 }));
});
$("#resetProfile")?.addEventListener("click",()=>{s.profile=Object.assign({},profileDefaults,{markets:[],skills:[]});save();$$("[data-profile] button").forEach(x=>x.classList.remove("active"));buildRoutine()});
Object.keys(s.profile).forEach(k=>{if(k==="markets"||k==="skills")selected(k);else selected(k,s.profile[k])});
buildRoutine();
function renderMastery(){const g=$("#masteryGrid"),done=s.mastery||{};if(!g)return;g.innerHTML=mastery.map((m,i)=>'<button class="mastery-item '+(done[m[0]]?"is-done":"")+'" data-m="'+m[0]+'"><span>'+String(i+1).padStart(2,"0")+'</span><b>'+m[1]+'</b><small>'+m[2]+'</small><em>'+(done[m[0]]?"Mastery marked":"Open learning →")+'</em></button>').join("");$$(".mastery-item",g).forEach(b=>b.onclick=()=>{const k=b.dataset.m;s.mastery=s.mastery||{};s.mastery[k]=!s.mastery[k];if(!s.mastery[k]){s.reviews=s.reviews||{};s.reviews[k]=Date.now()+86400000}save();renderMastery();renderReviews()});const n=Object.values(done).filter(Boolean).length;$("#masteryScore").textContent=n+" / "+mastery.length}
renderMastery();
const cases={economics:{title:"Case 01 · The company that grows fast",prompt:"You have four years of revenue growth, but working capital consumes increasingly more cash and ROCE falls. What do you investigate before calling growth valuable?",choices:["Revenue growth alone","Cash conversion, incremental returns, reinvestment needs and why working capital changed","Only the latest P/E"],correct:1,why:"Growth creates value only when incremental economics justify the capital and risk required to produce it."},valuation:{title:"Case 02 · The stock that looks cheap",prompt:"A multiple is far below its history. What is the first research move?",choices:["Assume mean reversion","Ask what changed in earnings, cycle, business quality and expectations; then test the denominator","Buy because the chart is down"],correct:1,why:"A lower multiple can reflect changed fundamentals or expectations. The number is an output, not an explanation."},evidence:{title:"Case 03 · The perfect narrative",prompt:"A research note contains five impressive claims. Which evidence hierarchy should you build first?",choices:["Repeat the strongest claims","Trace each material claim to a primary source, label calculations and assumptions, and record unknowns","Ignore sources if the story sounds plausible"],correct:1,why:"Independent research depends on an auditable trail. Confidence should follow evidence, not presentation quality."}};
$$(".case-open").forEach(b=>b.onclick=()=>{const c=cases[b.closest(".case-card").dataset.case],r=$("#caseRoom");r.hidden=false;r.innerHTML='<div class="case-room-inner"><span class="tag">'+c.title+'</span><h3>'+c.prompt+'</h3><div class="case-choices">'+c.choices.map((x,i)=>'<button data-i="'+i+'">'+x+'</button>').join("")+'</div><p class="case-feedback" hidden></p></div>';$$(".case-choices button",r).forEach(x=>x.onclick=()=>{const ok=+x.dataset.i===c.correct;$$(".case-choices button",r).forEach(y=>y.disabled=true);const f=$(".case-feedback",r);f.hidden=false;f.textContent=(ok?"Correct. ":"Not quite. ")+c.why;f.classList.toggle("is-correct",ok)})});
const explain={pe:{name:"P/E",plain:"P/E asks how much price is being paid for one unit of earnings. It is not a complete definition of cheapness.",analyst:"Price ÷ earnings per share. Interpret the numerator, denominator, earnings quality, cyclicality and growth together.",exec:"The question is not 'Is P/E low?' but 'What business quality and future earnings does this price assume?'",visual:"PRICE → divided by → EARNINGS → produces → P/E → then ask what drives each side.",exam:"A low P/E may reflect low expectations, cyclical peak earnings, poor quality or temporary earnings. Compare context before concluding."},cash:{name:"Profit vs cash",plain:"A company can report profit without receiving all of that money yet.",analyst:"Net income is accrual-based; operating cash flow adjusts for working capital and other non-cash effects, while free cash flow also reflects capital expenditure.",exec:"Profit tells you accounting performance. Cash tells you what actually moved through the business after timing and investment needs.",visual:"PROFIT → working capital & non-cash items → OPERATING CASH → capex → FREE CASH FLOW.",exam:"Profit and cash can diverge because of receivables, inventory, payables, non-cash charges and investment spending."},roce:{name:"ROCE",plain:"ROCE asks how efficiently a business generates operating profit from the capital employed in it.",analyst:"A common form is operating profit ÷ capital employed; definitions vary, so consistency matters.",exec:"It connects business economics to the capital required to run the business.",visual:"OPERATING PROFIT ÷ CAPITAL EMPLOYED → ROCE → compare with the return required and with reinvestment.",exam:"A high ROCE can be meaningful, but check business cycle, accounting definitions, capital intensity and sustainability."},diversification:{name:"Diversification",plain:"Diversification means spreading exposure so one mistake does not determine the whole outcome.",analyst:"Correlation, concentration, position size and common-factor exposure matter more than simply counting holdings.",exec:"The purpose is resilience, not collecting names.",visual:"ONE RISK → MANY OUTCOMES; SHARED RISK → diversification may be weaker than it looks.",exam:"Diversification can reduce idiosyncratic risk but cannot eliminate market or systemic risk."}};
function renderExplain(k){const x=explain[k],box=$("#fiveExplain");if(!box)return;box.innerHTML=[["Plain English",x.plain],["Analyst",x.analyst],["Executive",x.exec],["Visual / sequence",x.visual],["Exam / teach-back",x.exam]].map(a=>'<article><span>'+a[0]+'</span><p>'+a[1]+'</p></article>').join("")}
$$(".explain-picker button").forEach(b=>b.onclick=()=>{$$(".explain-picker button").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderExplain(b.dataset.concept)});renderExplain("pe");
function renderReviews(){const g=$("#reviewGrid");if(!g)return;const r=s.reviews||{};const now=Date.now();const due=mastery.filter(m=>r[m[0]]&&r[m[0]]<=now);g.innerHTML=due.length?due.map(m=>'<a class="review-card" href="'+m[3]+'"><span>REVIEW DUE</span><b>'+m[1]+'</b><small>Re-explain it without looking, then test yourself.</small></a>').join(""):'<div class="empty-review">No weak concepts are due. Mark a mastery item incomplete to create a review.</div>'}
renderReviews();$("#clearReviews")?.addEventListener("click",()=>{s.reviews={};save();renderReviews()});
const add=$("#addEvidence");add?.addEventListener("click",()=>{const claim=$("#claim").value.trim(),source=$("#source").value.trim(),status=$("#status").value;if(!claim)return; s.evidence=s.evidence||[];s.evidence.unshift({claim,source:source||"Not supplied",status,date:new Date().toISOString().slice(0,10)});s.evidence=s.evidence.slice(0,20);save();$("#claim").value="";$("#source").value="";renderEvidence()});
function renderEvidence(){const g=$("#evidenceTrail");if(!g)return;g.innerHTML=(s.evidence||[]).map((e,i)=>'<article><div><b>'+e.claim.replace(/[&<>]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[m]))+'</b><span class="evidence-status '+e.status.toLowerCase()+'">'+e.status+'</span></div><small>'+e.source+' · '+e.date+'</small></article>').join("")||'<div class="empty-review">Your evidence trail is empty. Add one material claim to begin.</div>'}
renderEvidence();
})();