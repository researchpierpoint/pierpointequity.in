(function(){
"use strict";
const KEY="pp-research-workspaces-v2", OLD="pp-research-workspace-v1";
const qs=s=>document.querySelector(s), qsa=s=>Array.from(document.querySelectorAll(s));
const company=qs("#researchCompany");
const params=new URLSearchParams(location.search);
let workspaceId=params.get("workspace")||"";

function all(){try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch(e){return[]}}
function slug(s){return String(s||"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}
function migrate(){
  try{
    const old=JSON.parse(localStorage.getItem(OLD)||"null");
    if(old?.company&&!all().length){
      const id=slug(old.company)||String(Date.now());
      localStorage.setItem(KEY,JSON.stringify([{id,company:old.company,created:new Date().toISOString(),updated:new Date().toISOString(),fields:old.fields||{},evidence:old.evidence||[],fin:old.fin||{},scenario:old.scenario||{},journal:old.journal||[]}]));
      workspaceId=id;
    }
  }catch(e){}
}
function blank(){return{company:"",fields:{},evidence:[],fin:{},scenario:{},journal:[]}}
function read(){migrate();const a=all();return a.find(x=>x.id===workspaceId)||blank()}
function write(x){
  migrate();const a=all();const i=a.findIndex(z=>z.id===workspaceId);
  const now=new Date().toISOString();
  if(i>=0)a[i]={...x,id:workspaceId,created:a[i].created||now,updated:now};
  else{workspaceId=workspaceId||String(Date.now());a.push({...x,id:workspaceId,created:now,updated:now})}
  localStorage.setItem(KEY,JSON.stringify(a));
}
function collect(){
  const x=read();
  x.company=company?.value||x.company||"";
  x.fields={...(x.fields||{})};
  qsa("[data-field]").forEach(e=>x.fields[e.dataset.field]=e.value);
  x.fin={...(x.fin||{})};qsa("[data-fin]").forEach(e=>x.fin[e.dataset.fin]=e.value);
  x.scenario={...(x.scenario||{})};qsa("[data-scenario]").forEach(e=>x.scenario[e.dataset.scenario]=e.value);
  x.price=qs("#scenarioPrice")?.value||"";x.eps=qs("#scenarioEps")?.value||"";
  return x;
}
function showState(name){
  const status=qs("#researchStatus");
  if(status)status.hidden=false;
  if(qs("#researchTitle"))qs("#researchTitle").textContent=name;
  if(qs("#researchStateText"))qs("#researchStateText").textContent="Local research workspace · evidence and assumptions are kept separate.";
}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",""":"&quot;","'":"&#39;"}[c]))}
function stateClass(s){return String(s||"").toLowerCase().replace(/[^a-z]+/g,"-")}
function renderEvidence(list){
  const out=qs("#evidenceList");if(!out)return;
  out.innerHTML=list.length?list.map(e=>'<article class="evidence-row"><div><strong>'+esc(e.claim)+'</strong><span>'+esc(e.type)+(e.date?' · '+esc(e.date):"")+'</span><small>'+esc(e.source||"Source not entered")+'</small></div><div class="evidence-actions"><b class="evidence-state '+stateClass(e.state)+'">'+esc(e.state)+'</b><button type="button" onclick="removeEvidence('+Number(e.id)+')">Remove</button></div></article>').join(""):'<div class="empty-state">No evidence logged yet. Add the claims that matter most to the thesis.</div>';
}
function updateCounts(){
  const x=read(),fields=Object.values(x.fields||{}).filter(Boolean),e=x.evidence||[];
  if(qs("#evidenceCount"))qs("#evidenceCount").textContent=e.filter(z=>z.state==="Verified").length;
  if(qs("#questionCount"))qs("#questionCount").textContent=fields.filter(v=>String(v).includes("?")).length;
  if(qs("#assumptionCount"))qs("#assumptionCount").textContent=e.filter(z=>z.state==="Calculated"||z.state==="Needs verification").length;
}
function restore(){
  const x=read();
  if(x.company&&company){company.value=x.company;showState(x.company)}
  Object.entries(x.fields||{}).forEach(([k,v])=>{const e=qs('[data-field="'+CSS.escape(k)+'"]');if(e)e.value=v});
  Object.entries(x.fin||{}).forEach(([k,v])=>{const e=qs('[data-fin="'+CSS.escape(k)+'"]');if(e)e.value=v});
  Object.entries(x.scenario||{}).forEach(([k,v])=>{const e=qs('[data-scenario="'+CSS.escape(k)+'"]');if(e)e.value=v});
  if(qs("#scenarioPrice"))qs("#scenarioPrice").value=x.price||"";
  if(qs("#scenarioEps"))qs("#scenarioEps").value=x.eps||"";
  renderEvidence(x.evidence||[]);updateCounts();
}
window.startResearch=function(){
  const n=company?.value.trim();if(!n){company?.focus();return}
  if(!workspaceId)workspaceId=slug(n)||String(Date.now());
  const x=read();x.company=n;write(x);showState(n);saveWorkspace("Workspace started locally.");location.hash="business";
};
window.saveWorkspace=function(msg){
  const x=collect();x.evidence=read().evidence||[];write(x);showState(x.company);
  if(qs("#workspaceStatus"))qs("#workspaceStatus").textContent=msg||"Saved on this device.";
  updateCounts();
};
window.clearWorkspace=function(){
  if(!confirm("Clear this research workspace from this browser?"))return;
  localStorage.setItem(KEY,JSON.stringify(all().filter(x=>x.id!==workspaceId)));location.href="research-hub.html";
};
window.addEvidence=function(){
  const x=collect(),claim=qs("#evClaim")?.value.trim();
  if(!claim){qs("#evClaim")?.focus();return}
  x.evidence=x.evidence||[];
  x.evidence.push({id:Date.now(),claim,type:qs("#evType")?.value||"",date:qs("#evDate")?.value||"",source:qs("#evSource")?.value.trim()||"",state:qs("#evState")?.value||"Needs verification"});
  write(x);
  ["#evClaim","#evDate","#evSource"].forEach(s=>{if(qs(s))qs(s).value=""});
  renderEvidence(x.evidence);updateCounts();refreshCockpit();
};
window.removeEvidence=function(id){const x=read();x.evidence=(x.evidence||[]).filter(e=>e.id!==id);write(x);renderEvidence(x.evidence);updateCounts();refreshCockpit()};
window.runScenario=function(){
  const eps=Number(qs("#scenarioEps")?.value),price=Number(qs("#scenarioPrice")?.value);
  const names=[["Bear","bear"],["Base","base"],["Bull","bull"]];
  const out=qs("#scenarioOut");if(!out)return;
  out.innerHTML=names.map(([label,k])=>{
    const g=Number(qs('[data-scenario="'+k+'-growth"]')?.value)/100;
    const m=Number(qs('[data-scenario="'+k+'-margin"]')?.value)/100;
    const pe=Number(qs('[data-scenario="'+k+'-pe"]')?.value);
    const future=eps>0?eps*Math.pow(1+g,3)*pe:null;
    return '<div><strong>'+label+'</strong><span>Growth '+(g*100).toFixed(1)+'% · Margin '+(m*100).toFixed(1)+'% · P/E '+pe.toFixed(1)+'×</span><b>'+(future?'Illustrative year-3 value: ₹'+future.toFixed(2):"Enter EPS to calculate illustrative value")+'</b>'+(price>0&&future?'<small>Scenario value vs entered price: '+((future/price-1)*100).toFixed(1)+'%</small>':"")+'</div>';
  }).join("");
};
function refreshCockpit(){
  const x=collect(),vals=Object.values(x.fields||{}),fin=Object.values(x.fin||{}),ev=x.evidence||[];
  const total=16,done=vals.filter(Boolean).length+fin.filter(Boolean).length+ev.filter(z=>z.state==="Verified").length;
  const pct=Math.min(100,Math.round(done/total*100));
  if(qs("#researchProgressText"))qs("#researchProgressText").textContent=pct+"%";
  if(qs("#researchProgressBar"))qs("#researchProgressBar").style.width=pct+"%";
  const q=qs("#nextQuestion");if(!q)return;
  const checks=[
    [!x.fields?.business,"Explain what the business sells and who pays."],
    [!x.fields?.["revenue-driver"],"Identify the real drivers of revenue growth."],
    [!x.fields?.roce,"Verify capital efficiency and its trend."],
    [!x.fields?.debt,"Check debt, cash and refinancing exposure."],
    [!ev.some(e=>e.state==="Verified"),"Add primary-source evidence for the most important claim."],
    [!x.fields?.["risk-valuation"],"Ask what expectations the current valuation already embeds."],
    [!x.fields?.thesis,"Write the thesis before adding more information."]
  ];
  const n=checks.find(z=>z[0]);q.textContent=n?n[1]:"The core research canvas is populated. Now challenge the thesis with contradictory evidence.";
}
window.focusNextQuestion=function(){
  const x=collect(),map=[["business","business"],["revenue-driver","business"],["roce","quality"],["debt","quality"],["risk-valuation","risks"],["thesis","thesis"]];
  const hit=map.find(([k])=>!x.fields?.[k]);location.hash=hit?hit[1]:"evidence";
};
window.copyResearchBrief=function(){
  const x=collect(),e=x.evidence||[];
  const brief=[
    x.company||"Company / asset","",
    "THESIS",x.fields?.thesis||"Not written","",
    "WHAT MUST GO RIGHT",x.fields?.["must-go-right"]||"Not written","",
    "WHAT COULD BREAK IT",x.fields?.["risk-business"]||"Not written","",
    "VALUATION LOGIC",x.fields?.["risk-valuation"]||"Not written","",
    "WHAT WOULD CHANGE MY MIND",x.fields?.["change-mind"]||"Not written","",
    "EVIDENCE",e.map(z=>"- "+z.claim+" ["+z.state+"] — "+(z.source||"source not entered")).join("\n")
  ].join("\n");
  navigator.clipboard?.writeText(brief).then(()=>{const s=qs("#workspaceStatus");if(s)s.textContent="Research brief copied."});
};
window.exportResearchJSON=function(){const x=collect();navigator.clipboard?.writeText(JSON.stringify(x,null,2)).then(()=>{const s=qs("#workspaceStatus");if(s)s.textContent="Workspace data copied as JSON."})};
document.addEventListener("input",()=>{
  clearTimeout(window.__ppSave);window.__ppSave=setTimeout(()=>{saveWorkspace("Saved locally.");refreshCockpit()},700);
});
document.addEventListener("DOMContentLoaded",()=>{
  migrate();const x=read();if(!workspaceId&&x.company)workspaceId=x.id;restore();
  const d=qs("#journalDate");if(d&&!d.value)d.value=new Date().toISOString().slice(0,10);
  refreshCockpit();
});
})();