(function(){
const KEY="pp-research-workspace-v1";
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const company=$("#researchCompany");
function read(){try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){return {}}}
function write(x){localStorage.setItem(KEY,JSON.stringify(x))}
function collect(){
 const x=read(); x.company=company?.value||x.company||"";
 x.fields={...(x.fields||{})};
 $$("[data-field]").forEach(e=>x.fields[e.dataset.field]=e.value);
 x.fin={...(x.fin||{})}; $$("[data-fin]").forEach(e=>x.fin[e.dataset.fin]=e.value);
 x.scenario={...(x.scenario||{})}; $$("[data-scenario]").forEach(e=>x.scenario[e.dataset.scenario]=e.value);
 x.price=$("#scenarioPrice")?.value||""; x.eps=$("#scenarioEps")?.value||"";
 return x;
}
function restore(){
 const x=read(); if(x.company){company.value=x.company; showState(x.company)}
 Object.entries(x.fields||{}).forEach(([k,v])=>{const e=document.querySelector('[data-field="'+k+'"]');if(e)e.value=v});
 Object.entries(x.fin||{}).forEach(([k,v])=>{const e=document.querySelector('[data-fin="'+k+'"]');if(e)e.value=v});
 Object.entries(x.scenario||{}).forEach(([k,v])=>{const e=document.querySelector('[data-scenario="'+k+'"]');if(e)e.value=v});
 if($("#scenarioPrice"))$("#scenarioPrice").value=x.price||"";
 if($("#scenarioEps"))$("#scenarioEps").value=x.eps||"";
 renderEvidence(x.evidence||[]);
 updateCounts();
}
function showState(name){$("#researchStatus").hidden=false;$("#researchTitle").textContent=name;$("#researchStateText").textContent="Local research workspace · evidence and assumptions are kept separate."}
window.startResearch=function(){const n=company.value.trim();if(!n){company.focus();return}showState(n);saveWorkspace("Workspace started locally.");location.hash="business"};
window.saveWorkspace=function(msg){const x=collect();x.evidence=read().evidence||[];write(x);showState(x.company);$("#workspaceStatus").textContent=msg||"Saved on this device.";updateCounts()};
window.clearWorkspace=function(){if(!confirm("Clear this research workspace from this browser?"))return;localStorage.removeItem(KEY);location.reload()};
window.addEvidence=function(){
 const x=collect();x.evidence=x.evidence||[];const claim=$("#evClaim").value.trim();if(!claim){$("#evClaim").focus();return}
 x.evidence.push({id:Date.now(),claim,type:$("#evType").value,date:$("#evDate").value,source:$("#evSource").value.trim(),state:$("#evState").value});
 write(x);["#evClaim","#evDate","#evSource"].forEach(s=>$(s).value="");renderEvidence(x.evidence);updateCounts();
};
window.removeEvidence=function(id){const x=read();x.evidence=(x.evidence||[]).filter(e=>e.id!==id);write(x);renderEvidence(x.evidence);updateCounts()};
function renderEvidence(list){const out=$("#evidenceList");if(!out)return;out.innerHTML=list.length?list.map(e=>'<article class="evidence-row"><div><strong>'+esc(e.claim)+'</strong><span>'+esc(e.type)+(e.date?' · '+esc(e.date):'')+'</span><small>'+esc(e.source||"Source not entered")+'</small></div><div class="evidence-actions"><b class="evidence-state '+stateClass(e.state)+'">'+esc(e.state)+'</b><button type="button" onclick="removeEvidence('+e.id+')">Remove</button></div></article>').join(""):'<div class="empty-state">No evidence logged yet. Add the claims that matter most to the thesis.</div>'}
function stateClass(s){return s.toLowerCase().replace(/[^a-z]+/g,"-")}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function updateCounts(){const x=read(),fields=Object.values(x.fields||{}).filter(Boolean),e=x.evidence||[];$("#evidenceCount").textContent=e.filter(z=>z.state==="Verified").length;$("#questionCount").textContent=fields.filter(v=>v.includes("?")).length;$("#assumptionCount").textContent=e.filter(z=>z.state==="Calculated"||z.state==="Needs verification").length}
window.runScenario=function(){
 const eps=Number($("#scenarioEps").value),price=Number($("#scenarioPrice").value);
 const names=[["Bear","bear"],["Base","base"],["Bull","bull"]];
 $("#scenarioOut").innerHTML=names.map(([label,k])=>{const g=Number($('[data-scenario="'+k+'-growth"]').value)/100,m=Number($('[data-scenario="'+k+'-margin"]').value)/100,pe=Number($('[data-scenario="'+k+'-pe"]').value);const future=eps?eps*Math.pow(1+g,3)*pe:null;return '<div><strong>'+label+'</strong><span>Growth '+g*100+'% · Margin '+m*100+'% · P/E '+pe+'×</span><b>'+(future?'Illustrative year-3 value: ₹'+future.toFixed(2):'Enter EPS to calculate illustrative value')+'</b>'+(price&&future?'<small>Scenario value vs entered price: '+((future/price-1)*100).toFixed(1)+'%</small>':'')+'</div>'}).join("");
};
document.addEventListener("input",()=>{clearTimeout(window.__ppSave);window.__ppSave=setTimeout(()=>{saveWorkspace("Saved locally.");refreshCockpit()},700)});

function refreshCockpit(){
 const x=collect(), vals=Object.values(x.fields||{}), fin=Object.values(x.fin||{}), ev=x.evidence||[];
 const total=16, done=vals.filter(Boolean).length+fin.filter(Boolean).length+ev.filter(z=>z.state==="Verified").length;
 const pct=Math.min(100,Math.round(done/total*100));
 if($("#researchProgressText"))$("#researchProgressText").textContent=pct+"%";
 if($("#researchProgressBar"))$("#researchProgressBar").style.width=pct+"%";
 const q=$("#nextQuestion"); if(!q)return;
 const checks=[
  [!x.fields?.business,"Explain what the business sells and who pays."],
  [!x.fields?.revenue-driver,"Identify the real drivers of revenue growth."],
  [!x.fields?.roce,"Verify capital efficiency and its trend."],
  [!x.fields?.debt,"Check debt, cash and refinancing exposure."],
  [!(x.evidence||[]).some(e=>e.state==="Verified"),"Add primary-source evidence for the most important claim."],
  [!x.fields?.["risk-valuation"],"Ask what expectations the current valuation already embeds."],
  [!x.fields?.thesis,"Write the thesis before adding more information."]
 ];
 const n=checks.find(z=>z[0]); q.textContent=n?n[1]:"The core research canvas is populated. Now challenge the thesis with contradictory evidence.";
}
window.focusNextQuestion=function(){
 const x=collect();
 const map=[["business","business"],["revenue-driver","business"],["roce","quality"],["debt","quality"],["risk-valuation","risks"],["thesis","thesis"]];
 const hit=map.find(([k])=>!x.fields?.[k]); location.hash=hit?hit[1]:"evidence";
};
window.copyResearchBrief=function(){
 const x=collect(); const e=x.evidence||[];
 const brief=(x.company||"Company / asset")+"

THESIS
"+(x.fields?.thesis||"Not written")+
 "

WHAT MUST GO RIGHT
"+(x.fields?.["must-go-right"]||"Not written")+
 "

WHAT COULD BREAK IT
"+(x.fields?.["risk-business"]||"Not written")+
 "

VALUATION LOGIC
"+(x.fields?.["risk-valuation"]||"Not written")+
 "

WHAT WOULD CHANGE MY MIND
"+(x.fields?.["change-mind"]||"Not written")+
 "

EVIDENCE
"+e.map(z=>"- "+z.claim+" ["+z.state+"] — "+(z.source||"source not entered")).join("
");
 navigator.clipboard?.writeText(brief).then(()=>{const s=$("#workspaceStatus");if(s)s.textContent="Research brief copied."});
};
window.exportResearchJSON=function(){const x=collect();navigator.clipboard?.writeText(JSON.stringify(x,null,2)).then(()=>{const s=$("#workspaceStatus");if(s)s.textContent="Workspace data copied as JSON."})};
\ndocument.addEventListener("DOMContentLoaded",()=>{restore();const d=$("#journalDate");if(d&&!d.value)d.value=new Date().toISOString().slice(0,10);refreshCockpit()});
})();