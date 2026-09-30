(()=>{"use strict";
const root=document.querySelector(".country-curriculum[data-market]");
if(!root)return;
const market=root.dataset.market;
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const slug=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const key="pirepoint:market-curriculum:"+slug(market);
const state=JSON.parse(localStorage.getItem(key)||"{}");
const done=new Set(Array.isArray(state.done)?state.done:[]);
const domainLabel=d=>String(d||"").replace(/-/g," ").replace(/\b\w/g,x=>x.toUpperCase());
function save(){localStorage.setItem(key,JSON.stringify({done:[...done],updatedAt:new Date().toISOString()}));}
function mark(id,checked,node){checked?done.add(id):done.delete(id);save();if(window.PirePointLearner&&window.PirePointLearner.record){try{window.PirePointLearner.record(node.domain||"market", "market-curriculum", checked, null,{market,nodeId:id});}catch(e){}}render();}
function render(){
 const catalog=window.__PirePointMarketCatalog;
 const target=(catalog?.markets||{})[market]||Object.entries(catalog?.markets||{}).find(([k])=>slug(k)===slug(market))?.[1];
 const nodes=target?.learningPath?.nodes||target?.nodes||[];
 if(!nodes.length){root.innerHTML='<div class="card"><span class="eyebrow">300-NODE MARKET CURRICULUM</span><h2>Learn '+esc(market)+' properly.</h2><p>The market curriculum is loading. Refresh once if the source is temporarily unavailable.</p></div>';return;}
 const total=nodes.length, completed=nodes.filter(n=>done.has(String(n.id||n.number))).length, pct=Math.round(completed/total*100);
 const groups=[]; const by={}; nodes.forEach(n=>{const d=n.domain||"market";(by[d]??=[]).push(n);if(!groups.includes(d))groups.push(d);});
 root.innerHTML='<div class="market-curriculum-shell">'+
 '<div class="market-curriculum-top"><div><span class="eyebrow">300-NODE MARKET CURRICULUM</span><h2>Learn '+esc(market)+' properly.</h2><p class="muted">This is the complete market map. Each node is something you should be able to understand, explain, apply, verify and use in real research—not merely recognise.</p></div><div class="market-curriculum-score"><strong id="mccCount">'+completed+' / '+total+'</strong><span>learned</span><div class="market-progress"><i id="mccBar" style="width:'+pct+'%"></i></div><b id="mccPct">'+pct+'%</b></div></div>'+
 '<div class="market-curriculum-actions"><input id="mccSearch" type="search" placeholder="Search the 300 lessons…" aria-label="Search '+esc(market)+' curriculum"><select id="mccLevel" aria-label="Filter by difficulty"><option value="">All levels</option><option>beginner</option><option>intermediate</option><option>advanced</option></select><button type="button" class="button secondary" id="mccReset">Reset progress</button></div>'+
 '<div class="market-curriculum-principle"><b>How PirePoint treats learning</b><span>Understand → Explain → Apply → Verify → Research → Red-team → Master</span></div>'+
 '<div class="country-curriculum-groups" id="mccGroups">'+groups.map(d=>'<details class="country-curriculum-group" open><summary>'+esc(domainLabel(d))+'<span>'+by[d].length+' nodes</span></summary><div class="country-node-grid">'+by[d].map(n=>{const id=String(n.id||n.number),is=done.has(id),level=n.difficulty||n.level||"intermediate",source=(n.primarySources||[])[0], proof=n.proof||n.proofType||"Apply the idea to a real market example.";return '<article class="card country-node '+(is?"is-learned":"")+'" data-search="'+esc([n.title,n.objective,n.learn,n.domain].join(" "))+'" data-level="'+esc(level)+'"><div class="mcc-node-head"><small>'+String(n.number||"").padStart(3,"0")+' · '+esc(level)+'</small><label><input type="checkbox" '+(is?"checked":"")+' data-node="'+esc(id)+'"><span>Learned</span></label></div><h3>'+esc(n.title||"Market lesson")+'</h3><p>'+esc(n.objective||n.learn||"Build this market skill.")+'</p><div class="mcc-node-meta"><span>'+esc(proof)+'</span>'+(source?'<a href="'+esc(source[1]||source.url||"#")+'" target="_blank" rel="noopener">Verify source ↗</a>':"")+'</div></article>';}).join("")+'</div></details>').join("")+'</div>'+
 '<div class="market-curriculum-footer"><a class="button" href="../routine.html">Build my personalised market route →</a><span>Already know another market? PirePoint can preserve what transfers and isolate what changes.</span></div></div>';
 root.querySelectorAll("[data-node]").forEach(cb=>cb.addEventListener("change",()=>{const n=nodes.find(x=>String(x.id||x.number)===cb.dataset.node);mark(cb.dataset.node,cb.checked,n||{});}));
 const search=root.querySelector("#mccSearch"), level=root.querySelector("#mccLevel");
 function filter(){const q=(search.value||"").toLowerCase().trim(), lv=level.value;root.querySelectorAll(".country-node").forEach(card=>{const okq=!q||(card.dataset.search||"").toLowerCase().includes(q), okl=!lv||card.dataset.level===lv;card.hidden=!(okq&&okl);});root.querySelectorAll(".country-curriculum-group").forEach(g=>{const visible=[...g.querySelectorAll(".country-node")].some(x=>!x.hidden);g.hidden=!visible;});}
 search.addEventListener("input",filter);level.addEventListener("change",filter);
 root.querySelector("#mccReset").addEventListener("click",()=>{if(confirm("Reset your "+market+" curriculum progress?")){done.clear();save();render();}});
}
const MARKET_PROFILES={
"United States":{regulator:"SEC",venues:"NYSE / Nasdaq",currency:"USD",terms:["10-K","10-Q","8-K","ETF","ADR","market maker"]},
"India":{regulator:"SEBI",venues:"NSE / BSE",currency:"INR",terms:["demat","F&O","T+1","promoter","circuit limits"]},
"China":{regulator:"CSRC",venues:"Shanghai / Shenzhen",currency:"CNY",terms:["A-shares","Northbound","STAR Market","SSE","SZSE"]},
"Hong Kong":{regulator:"SFC",venues:"HKEX",currency:"HKD",terms:["H-shares","Stock Connect","lot size","HKEX","Hang Seng"]},
"Japan":{regulator:"FSA / JPX",venues:"Tokyo Stock Exchange",currency:"JPY",terms:["TOPIX","Nikkei","Prime Market","kabushiki","shareholder return"]},
"United Kingdom":{regulator:"FCA",venues:"London Stock Exchange",currency:"GBP",terms:["AIM","FTSE","UK Listing Rules","stamp duty","ISA"]},
"Australia":{regulator:"ASIC",venues:"ASX",currency:"AUD",terms:["CHESS","ASX 200","franking credits","superannuation","CDI"]},
"Canada":{regulator:"CSA / provincial regulators",venues:"TSX / TSXV",currency:"CAD",terms:["TSX","TSXV","REIT","resource stocks","SEDAR+"]},
"South Korea":{regulator:"FSC / FSS",venues:"KRX",currency:"KRW",terms:["KOSPI","KOSDAQ","chaebol","KRX","foreign ownership"]},
"Germany":{regulator:"BaFin",venues:"Frankfurt / Xetra",currency:"EUR",terms:["Xetra","DAX","BaFin","German GAAP","dual listing"]},
"Singapore":{regulator:"MAS",venues:"SGX",currency:"SGD",terms:["SGX","REIT","CPF","CDL","S-REIT"]},
"United Arab Emirates":{regulator:"SCA",venues:"ADX / DFM",currency:"AED",terms:["ADX","DFM","GCC","free float","regional exposure"]}
};
const DOMAINS=["orientation","access","structure","instruments","corporate-actions","trading","clearing","regulation","reporting","accounting","ownership","governance","tax","currency","macro","sectors","business","financials","cash","returns","capital","valuation","risk","research","sources","disclosure","information","behaviour","comparison","application"];
const STAGES=["foundation","local rules","how it works","investor view","company impact","research method","common traps","real example","practice","mastery"];
function fallbackNodes(market){
 const p=MARKET_PROFILES[market]||{regulator:"local regulator",venues:"local exchanges",currency:"local currency",terms:[]};
 return DOMAINS.flatMap((domain,di)=>STAGES.map((stage,si)=>{
   const number=di*10+si+1;
   const level=si<3?"beginner":si<7?"intermediate":"advanced";
   const local=domain==="regulation"?p.regulator:domain==="trading"?p.venues:domain==="currency"?p.currency:p.terms[(di+si)%Math.max(1,p.terms.length)]||market;
   return {id:market.toLowerCase().replace(/[^a-z0-9]+/g,"-")+"-"+number,number,domain,title:market+" "+domain.replace(/-/g," ")+" — "+stage,objective:"Understand how "+stage+" works for "+domain.replace(/-/g," ")+" in "+market+"; apply it to "+local+".",learn:"Study the local rule, mechanism and investor consequence, then explain it in your own words.",difficulty:level,proof:"Apply this to a real "+market+" company, instrument or market event.",primarySources:[]};
 }));
}
const originalRender=render;
render=function(){
 const catalog=window.__PirePointMarketCatalog;
 if(!catalog || !Object.keys(catalog.markets||{}).length){
   window.__PirePointMarketCatalog={markets:{}};
   window.__PirePointMarketCatalog.markets[market]={learningPath:{nodes:fallbackNodes(market)}};
 }
 return originalRender();
};
fetch("../data/market-catalog.json").then(r=>r.ok?r.json():{}).then(data=>{window.__PirePointMarketCatalog=data||{};render();}).catch(()=>render());
})();