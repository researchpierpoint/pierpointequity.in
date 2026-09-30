(()=>{"use strict";
const root=document.querySelector(".country-curriculum[data-market]"); if(!root)return;
const market=root.dataset.market;
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const slug=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const key="pirepoint:market-curriculum:"+slug(market);
let state={}; try{state=JSON.parse(localStorage.getItem(key)||"{}")}catch(e){}
const done=new Set(Array.isArray(state.done)?state.done:[]);
const PROFILES={
"United States":{regulator:"SEC",venues:"NYSE and Nasdaq",currency:"USD",terms:["10-K","10-Q","8-K","EDGAR","ETF","ADR","market maker","S&P 500"]},
"India":{regulator:"SEBI",venues:"NSE and BSE",currency:"INR",terms:["demat","T+1","promoter","F&O","circuit limits","Nifty 50","BSE"]},
"China":{regulator:"CSRC",venues:"Shanghai and Shenzhen",currency:"CNY",terms:["A-shares","STAR Market","SSE","SZSE","Stock Connect","Northbound","CSI 300"]},
"Hong Kong":{regulator:"SFC",venues:"HKEX",currency:"HKD",terms:["H-shares","Stock Connect","lot size","HKEX","Hang Seng","CCASS","Main Board"]},
"Japan":{regulator:"FSA / JPX",venues:"Tokyo Stock Exchange",currency:"JPY",terms:["TOPIX","Nikkei","Prime Market","kabushiki","corporate governance","TSE","shareholder return"]},
"United Kingdom":{regulator:"FCA",venues:"London Stock Exchange",currency:"GBP",terms:["AIM","FTSE","UK Listing Rules","stamp duty","ISA","LSE","premium segment"]},
"Australia":{regulator:"ASIC",venues:"ASX",currency:"AUD",terms:["CHESS","ASX 200","franking credits","superannuation","CDI","ASX","issuer-sponsored"]},
"Canada":{regulator:"CSA and provincial regulators",venues:"TSX and TSXV",currency:"CAD",terms:["TSX","TSXV","REIT","resource stocks","SEDAR+","mining","NI 43-101"]},
"South Korea":{regulator:"FSC / FSS",venues:"KRX",currency:"KRW",terms:["KOSPI","KOSDAQ","chaebol","KRX","foreign ownership","K-IFRS","Korea Exchange"]},
"Germany":{regulator:"BaFin",venues:"Frankfurt and Xetra",currency:"EUR",terms:["Xetra","DAX","BaFin","German GAAP","dual listing","SDAX","MDAX"]},
"Singapore":{regulator:"MAS",venues:"SGX",currency:"SGD",terms:["SGX","REIT","CPF","S-REIT","CDL","Mainboard","Catalist"]},
"United Arab Emirates":{regulator:"SCA",venues:"ADX and DFM",currency:"AED",terms:["ADX","DFM","GCC","free float","regional exposure","IPO","Sharia-compliant investing"]}
};
const domains=[
["orientation","Market orientation"],["access","Investor access"],["structure","Market structure"],["instruments","Instruments"],["corporate-actions","Corporate actions"],["trading","Trading mechanics"],["clearing","Clearing and settlement"],["regulation","Regulation"],["reporting","Reporting"],["accounting","Accounting"],["ownership","Ownership"],["governance","Governance"],["tax","Market taxation"],["currency","Currency"],["macro","Macro economics"],["sectors","Sectors"],["business","Business models"],["financials","Financial statements"],["cash","Cash flow"],["returns","Returns and quality"],["capital","Capital allocation"],["valuation","Valuation"],["risk","Risk"],["research","Company research"],["sources","Primary sources"],["disclosure","Disclosure"],["information","Information quality"],["behaviour","Investor behaviour"],["comparison","Market comparison"],["application","Real-world application"]
];
const stages=["Foundation","Local rules","How it works","Investor view","Company impact","Research method","Common traps","Real example","Practice","Mastery"];
function fallbackNodes(){
 const p=PROFILES[market]||{regulator:"the local regulator",venues:"the local exchanges",currency:"the local currency",terms:[market]};
 return domains.flatMap(([domain,label],di)=>stages.map((stage,si)=>{
  const number=di*10+si+1, level=si<3?"beginner":si<7?"intermediate":"advanced";
  const term=p.terms[(di+si)%p.terms.length];
  const focus=domain==="regulation"?p.regulator:domain==="trading"||domain==="structure"?p.venues:domain==="currency"?p.currency:term;
  const titles={
   orientation:["What this market is","Why this market matters","What investors actually buy","Who participates","Where securities trade","What makes this market different","A common beginner mistake","Read one real market example","Explain the market in plain English","Prove you understand the market"],
   access:["How an investor gets access","Accounts and eligibility","Foreign-investor access","Broker and custody roles","Costs before the first trade","Access restrictions to check","An access assumption that can fail","Trace one real investor journey","Map your own access route","Verify current access rules"],
   structure:["The market's architecture","Regulator and venue roles","Listed vs traded venues","Primary and secondary markets","How structure affects companies","Research the local structure","A structure trap","Follow one security through the system","Explain the market structure","Verify the structure from primary sources"],
   instruments:["Shares and ownership","Share classes","ETFs and funds","Indices","Depositary instruments","Derivatives overview","Instrument-selection traps","Compare two real instruments","Choose the right instrument for a scenario","Explain instrument risks"],
   "corporate-actions":["Dividends and distributions","Splits and consolidations","Rights and offerings","Buybacks","Mergers and acquisitions","Spin-offs and special events","Corporate-action traps","Read one real announcement","Calculate investor impact","Verify an action from the issuer"],
   trading:["Market sessions","Order types","Quotes and spreads","Auctions","Liquidity","Short selling","Trading halts","Read one real trading event","Explain an order lifecycle","Verify local trading rules"],
   "clearing":["Clearing roles","Settlement cycle","Custody","Depositories","Failed settlement","Collateral and margin","Settlement traps","Trace one real trade","Explain ownership after settlement","Verify the current cycle"],
   regulation:["Who regulates the market","Investor protection","Listing rules","Conduct rules","Market-abuse rules","Foreign-investor rules","Regulatory traps","Read one regulator notice","Find the rule behind a claim","Verify a current requirement"],
   reporting:["Annual reporting","Quarterly reporting","Material-event reporting","Fiscal calendars","Earnings releases","Management commentary","Reporting traps","Read one real filing","Extract decision-useful facts","Verify reporting requirements"],
   accounting:["Accounting standards","Balance-sheet presentation","Income statement","Cash-flow statement","Segment reporting","Non-GAAP measures","Accounting traps","Read one real report","Reconcile accounting to economics","Verify a reported figure"],
   ownership:["Share ownership","Free float","Insiders","Institutions","Foreign ownership","Beneficial ownership","Ownership traps","Map one real company","Interpret an ownership change","Verify ownership data"],
   governance:["Boards","Shareholder rights","Voting","Related parties","Executive incentives","Minority protection","Governance traps","Read one proxy or governance report","Assess one governance mechanism","Verify governance disclosures"],
   tax:["Investor tax framework","Capital gains","Dividend taxation","Withholding","Transaction taxes","Tax reporting","Tax traps","Work one real tax scenario","Separate tax from investment return","Verify current tax rules"],
   currency:["The market currency","FX conversion","FX gains and losses","Translation effects","Currency and company earnings","Hedging","FX traps","Follow one cross-border investment","Calculate currency impact","Verify current FX mechanics"],
   macro:["Interest rates","Inflation","Growth","Employment","Credit conditions","Policy transmission","Macro traps","Map one macro event","Trace macro to earnings","Build a market macro map"],
   sectors:["Major sectors","Sector weights","Cyclicals vs defensives","Local sector economics","Sector regulation","Sector valuation","Sector traps","Compare two local sectors","Research one sector","Explain sector sensitivity"],
   business:["Business models","Customers","Pricing","Margins","Moats","Competition","Capital intensity","Analyse one real company","Write a business thesis","Red-team the thesis"],
   financials:["Revenue","Margins","Operating profit","Balance sheet","Debt","Working capital","Quality of earnings","Analyse one real filing","Rebuild key metrics","Test financial resilience"],
   cash:["Operating cash flow","Free cash flow","Working capital","Capex","Cash conversion","Cash needs","Cash traps","Analyse one real company","Reconcile profit to cash","Test cash durability"],
   returns:["ROE","ROCE","ROIC","Incremental returns","Growth quality","Return durability","Return traps","Compare two companies","Calculate return metrics","Explain what drives returns"],
   capital:["Reinvestment","Dividends","Buybacks","M&A","Debt allocation","Management incentives","Capital-allocation traps","Read one capital decision","Judge the mechanism without guessing motives","Red-team capital allocation"],
   valuation:["P/E","EV/EBITDA","Price/book","FCF yield","Growth and multiples","Expectations in price","Valuation traps","Value one real company","Build a simple scenario","Explain what price assumes"],
   risk:["Business risk","Balance-sheet risk","Liquidity risk","Regulatory risk","Currency risk","Valuation risk","Risk traps","Build one risk register","Stress-test a thesis","Define what would falsify it"],
   research:["Start with a question","Find primary evidence","Build a thesis","Test assumptions","Compare evidence","Red-team the thesis","Research traps","Complete one company investigation","Write an evidence-backed conclusion","Know when research is sufficient"],
   sources:["Exchange sources","Regulator sources","Issuer filings","Investor-relations sources","Official statistics","Secondary research","Source traps","Trace one claim to origin","Reproduce one figure","Build a primary-source habit"],
   disclosure:["What must be disclosed","Material information","Ownership disclosure","Related-party disclosure","Risk disclosure","Voluntary disclosure","Disclosure traps","Read one disclosure","Separate fact from promotion","Verify a material claim"],
   information:["Primary vs secondary information","Source hierarchy","Data freshness","Conflicting sources","Estimates vs facts","Unknowns","Information traps","Resolve one contradiction","Build an evidence ledger","State what you do not know"],
   behaviour:["Narratives","FOMO","Crowding","Anchoring","Confirmation bias","Incentives","Behaviour traps","Analyse one market narrative","Red-team your own view","Separate story from evidence"],
   comparison:["Compare market structures","Compare regulation","Compare trading","Compare settlement","Compare accounting","Compare valuation context","Comparison traps","Compare two real markets","Explain one transferable skill","Identify one dangerous assumption"],
   application:["Research workflow","Company screen","Primary-source check","Financial analysis","Valuation case","Risk case","Thesis construction","Full mini-research case","Defend and attack the thesis","Independent market research"]
  };
  const title=(titles[domain]||[])[si]||stage;
  return {id:slug(market)+"-"+number,number,domain,title:market+" — "+title,objective:"Learn "+title.toLowerCase()+" in the context of "+market+", including "+focus+".",learn:"Understand the mechanism, explain why it matters to an investor, and verify the current rule or evidence before relying on it.",difficulty:level,proof:"Apply this to a real "+market+" company, security, rule or market event.",primarySources:[]};
 }));
}
function save(){localStorage.setItem(key,JSON.stringify({done:[...done],updatedAt:new Date().toISOString()}));}
function render(nodes){
 const total=nodes.length,completed=nodes.filter(n=>done.has(String(n.id||n.number))).length,pct=Math.round(completed/total*100);
 const by={}; nodes.forEach(n=>(by[n.domain]??=[]).push(n));
 const order=[...domains.map(x=>x[0]),...Object.keys(by)].filter((x,i,a)=>a.indexOf(x)===i&&by[x]);
 root.innerHTML='<div class="market-curriculum-shell"><div class="market-curriculum-top"><div><span class="eyebrow">300-NODE MARKET CURRICULUM</span><h2>Learn '+esc(market)+' properly.</h2><p class="muted">A complete, structured learning map for '+esc(market)+'. Each lesson is designed to be understood, applied, verified and used in real research.</p></div><div class="market-curriculum-score"><strong id="mccCount">'+completed+' / '+total+'</strong><span>learned</span><div class="market-progress"><i id="mccBar" style="width:'+pct+'%"></i></div><b id="mccPct">'+pct+'%</b></div></div><div class="market-curriculum-actions"><input id="mccSearch" type="search" placeholder="Search the 300 lessons…" aria-label="Search '+esc(market)+' curriculum"><select id="mccLevel" aria-label="Filter by difficulty"><option value="">All levels</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select><button type="button" class="button secondary" id="mccReset">Reset progress</button></div><div class="market-curriculum-principle"><b>Learning standard</b><span>Understand → Explain → Apply → Verify → Research → Red-team → Master</span></div><div class="country-curriculum-groups" id="mccGroups">'+order.map(d=>'<details class="country-curriculum-group" open><summary>'+esc((domains.find(x=>x[0]===d)||[d,d])[1])+'<span>'+by[d].length+' nodes</span></summary><div class="country-node-grid">'+by[d].map(n=>{const id=String(n.id||n.number),is=done.has(id),level=n.difficulty||"intermediate";return '<article class="card country-node '+(is?"is-learned":"")+'" data-search="'+esc([n.title,n.objective,n.learn,n.domain].join(" "))+'" data-level="'+esc(level)+'"><div class="mcc-node-head"><small>'+String(n.number).padStart(3,"0")+' · '+esc(level)+'</small><label><input type="checkbox" '+(is?"checked":"")+' data-node="'+esc(id)+'"><span>Learned</span></label></div><h3>'+esc(n.title)+'</h3><p>'+esc(n.objective)+'</p><div class="mcc-node-meta"><span>'+esc(n.proof)+'</span></div></article>'}).join("")+'</div></details>').join("")+'</div><div class="market-curriculum-footer"><a class="button" href="../routine.html">Build my personalised market route →</a><span>Already know another market? PirePoint can preserve what transfers and isolate what changes.</span></div></div>';
 root.querySelectorAll("[data-node]").forEach(cb=>cb.addEventListener("change",()=>{const id=cb.dataset.node;cb.checked?done.add(id):done.delete(id);save();render(nodes);}));
 const search=root.querySelector("#mccSearch"),level=root.querySelector("#mccLevel");
 const filter=()=>{const q=(search.value||"").toLowerCase().trim(),lv=level.value;root.querySelectorAll(".country-node").forEach(c=>c.hidden=!!(q&&!c.dataset.search.toLowerCase().includes(q))||!!(lv&&c.dataset.level!==lv));root.querySelectorAll(".country-curriculum-group").forEach(g=>g.hidden=!g.querySelector(".country-node:not([hidden])"));};
 search.oninput=filter;level.onchange=filter;root.querySelector("#mccReset").onclick=()=>{if(confirm("Reset your "+market+" curriculum progress?")){done.clear();save();render(nodes)}};
}
const fallback=fallbackNodes(); render(fallback);
fetch("../data/market-catalog.json",{cache:"no-store"}).then(r=>r.ok?r.text():Promise.reject()).then(t=>{if(!t.trim())return null;return JSON.parse(t)}).then(c=>{const m=c?.markets?.[market]||Object.entries(c?.markets||{}).find(([k])=>slug(k)===slug(market))?.[1];const n=m?.learningPath?.nodes||m?.nodes||[];if(n.length>=300)render(n.slice(0,300));}).catch(()=>{});
})();