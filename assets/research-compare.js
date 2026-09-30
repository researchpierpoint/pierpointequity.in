(function(){
"use strict";
const KEY="pp-research-workspaces-v2";
const qs=s=>document.querySelector(s);
const fields=[
 ["Business model","business","Can you explain how it makes money?"],
 ["Customers","customers","Who pays and why?"],
 ["Revenue driver","revenue-driver","What actually drives growth?"],
 ["Capital efficiency","roce","What does the return on capital say?"],
 ["Balance sheet","debt","How much financial risk is present?"],
 ["Cash conversion","cash-conversion","Does accounting profit turn into cash?"],
 ["Competitive advantage","moat","What could protect economics?"],
 ["Valuation risk","risk-valuation","What expectations are already embedded?"],
 ["Business risk","risk-business","What could structurally break the thesis?"],
 ["Governance risk","risk-governance","What could change trust in management?"],
 ["Thesis","thesis","Why might value differ from price?"],
 ["What must go right","must-go-right","Which assumptions need to hold?"],
 ["What changes my mind","change-mind","What evidence would falsify the thesis?"]
];
function all(){try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch(e){return[]}}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",""":"&quot;","'":"&#39;"}[c]))}
function fill(){
 const data=all(),a=qs("#compareA"),b=qs("#compareB");
 [a,b].forEach(select=>{data.forEach(w=>{const o=document.createElement("option");o.value=w.id;o.textContent=w.company||w.id;select.appendChild(o)})});
 const empty=qs("#compareEmpty");if(empty)empty.hidden=data.length>=2;
 if(data.length>=2){a.value=data[0].id;b.value=data[1].id}
 qs("#compareRun").disabled=data.length<2;
}
function value(w,key){return String(w?.fields?.[key]||"").trim()}
function evidence(w){return w?.evidence||[]}
function render(){
 const data=all(),a=data.find(x=>x.id===qs("#compareA").value),b=data.find(x=>x.id===qs("#compareB").value);
 if(!a||!b||a.id===b.id)return;
 qs("#compareResult").hidden=false;
 qs("#compareTitle").textContent=(a.company||"A")+"  ×  "+(b.company||"B");
 const ea=evidence(a),eb=evidence(b),va=ea.filter(x=>x.state==="Verified").length,vb=eb.filter(x=>x.state==="Verified").length;
 qs("#countA").textContent=ea.length;qs("#countB").textContent=eb.length;qs("#verifiedA").textContent=va;qs("#verifiedB").textContent=vb;
 qs("#compareSummaryText").textContent="Same framework, different evidence. Read the differences before drawing a conclusion.";
 const rows=fields.map(([label,key,q])=>{
   const av=value(a,key),bv=value(b,key),state=av&&bv?"Both entered":av?"A only":bv?"B only":"Neither entered";
   return '<div class="compare-row"><div class="compare-question"><b>'+esc(label)+'</b><span>'+esc(q)+'</span></div><div class="compare-side '+(!av?"is-empty":"")+'">'+(av?esc(av):"Not entered")+'</div><div class="compare-side '+(!bv?"is-empty":"")+'">'+(bv?esc(bv):"Not entered")+'</div><div class="compare-state">'+esc(state)+'</div></div>';
 }).join("");
 qs("#compareTable").innerHTML='<div class="compare-row compare-head"><div>QUESTION</div><div>'+esc(a.company||"A")+'</div><div>'+esc(b.company||"B")+'</div><div>STATE</div></div>'+rows;
 const shared=[],different=[],unknown=[];
 fields.forEach(([label,key])=>{const av=value(a,key),bv=value(b,key);if(av&&bv&&av.toLowerCase()===bv.toLowerCase())shared.push(label);else if(av&&bv)different.push(label);else unknown.push(label)});
 qs("#sharedList").innerHTML=shared.length?shared.map(x=>'<p>• '+esc(x)+'</p>').join(""):"<p>No identical entered fields yet.</p>";
 qs("#differentList").innerHTML=different.length?different.map(x=>'<p>• '+esc(x)+'</p>').join(""):"<p>No direct differences entered yet.</p>";
 qs("#unknownList").innerHTML=unknown.map(x=>'<p>• '+esc(x)+'</p>').join("");
}
document.addEventListener("DOMContentLoaded",()=>{fill();qs("#compareRun")?.addEventListener("click",render)});
})();