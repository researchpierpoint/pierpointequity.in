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
fetch("../data/market-catalog.json").then(r=>r.json()).then(data=>{window.__PirePointMarketCatalog=data;render();}).catch(()=>render());
})();