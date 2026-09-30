(function(){
const KEY="pp-research-workspaces-v2";const old="pp-research-workspace-v1";const $=s=>document.querySelector(s);
function get(){try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch(e){return[]}}
function put(a){localStorage.setItem(KEY,JSON.stringify(a))}
function slug(n){return n.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,80)}
function create(n){n=n.trim();if(!n)return;const a=get();let id=slug(n),base=id,i=2;while(a.some(x=>x.id===id))id=base+"-"+i++;a.push({id,company:n,created:new Date().toISOString(),updated:new Date().toISOString(),fields:{},evidence:[],fin:{},scenario:{},journal:[]});put(a);location.href="research.html?workspace="+encodeURIComponent(id)}
window.createWorkspace=function(){create($("#hubCompany").value);};
window.deleteWorkspace=function(id){if(!confirm("Delete this local research workspace?"))return;put(get().filter(x=>x.id!==id));render()};
window.clearAllHub=function(){if(!confirm("Clear all local research workspaces?"))return;localStorage.removeItem(KEY);render()};
function migrate(){try{const oldData=JSON.parse(localStorage.getItem(old)||"null");if(oldData&&oldData.company&&!get().length){const a=[{id:slug(oldData.company),company:oldData.company,created:new Date().toISOString(),updated:new Date().toISOString(),fields:oldData.fields||{},evidence:oldData.evidence||[],fin:oldData.fin||{},scenario:oldData.scenario||{},journal:[]}];put(a)}}catch(e){}}
function render(){
 migrate();const all=get(),q=($("#hubFilter")?.value||"").toLowerCase();const shown=all.filter(x=>(x.company+" "+(x.fields?.thesis||"")).toLowerCase().includes(q));
 $("#hubCount").textContent=all.length;$("#hubAttention").textContent=all.filter(x=>!x.fields?.thesis||!(x.evidence||[]).some(e=>e.state==="Verified")).length;$("#hubThesis").textContent=all.filter(x=>x.fields?.thesis).length;$("#hubEvidence").textContent=all.reduce((n,x)=>n+(x.evidence||[]).length,0);
 $("#hubList").innerHTML=shown.length?shown.map(x=>{const e=x.evidence||[],verified=e.filter(z=>z.state==="Verified").length,fields=Object.values(x.fields||{}).filter(Boolean).length,p=Math.min(100,Math.round((fields+verified)/16*100));return '<article class="hub-card"><div class="hub-card-main"><span class="tag">RESEARCH WORKSPACE</span><h3>'+esc(x.company)+'</h3><p>'+esc(x.fields?.thesis||"No thesis yet. Start by explaining the business and the question you are trying to answer.")+'</p><div class="hub-progress"><span>'+p+'% research completeness</span><i><b style="width:'+p+'%"></b></i></div></div><div class="hub-card-side"><span>'+verified+' verified evidence item'+(verified===1?"":"s")+'</span><span>'+new Date(x.updated).toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"})+'</span><a class="button" href="research.html?workspace='+encodeURIComponent(x.id)">Open workspace →</a><button onclick="deleteWorkspace(\''+x.id+'\')" class="text-button">Delete</button></div></article>'}).join(""):'<div class="empty-state">No research workspaces yet. Create one above.</div>';
}
function esc(s){return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
$("#hubFilter")?.addEventListener("input",render);document.addEventListener("DOMContentLoaded",render);render();
})();