(function(){
"use strict";
const KEY="pp-research-workspaces-v2";
const form=document.getElementById("intelForm"),input=document.getElementById("intelInput");
const resume=document.getElementById("intelResume"),resumeTitle=document.getElementById("intelResumeTitle"),resumeMeta=document.getElementById("intelResumeMeta");
function all(){try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch(e){return[]}}
function slug(s){return String(s||"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}
function renderResume(){
 if(!resume||!resumeTitle||!resumeMeta)return;
 const ws=all().sort((a,b)=>String(b.updated||"").localeCompare(String(a.updated||"")));
 if(!ws.length){resume.hidden=true;return}
 const w=ws[0], evidence=(w.evidence||[]), verified=evidence.filter(x=>x.state==="Verified").length;
 resume.hidden=false;resumeTitle.textContent="Continue "+(w.company||"your research");
 resumeMeta.textContent=verified+" verified evidence item"+(verified===1?"":"s")+" · "+evidence.length+" total · "+(w.fields?.thesis?"thesis written":"thesis still open");
 const link=document.getElementById("intelResumeLink");
 if(link)link.href="research.html?workspace="+encodeURIComponent(w.id)+"&company="+encodeURIComponent(w.company||"");
}
form?.addEventListener("submit",e=>{
 e.preventDefault();
 const n=input.value.trim();if(!n){input.focus();return}
 const id=slug(n)||String(Date.now());
 location.href="research.html?workspace="+encodeURIComponent(id)+"&company="+encodeURIComponent(n);
});
document.addEventListener("DOMContentLoaded",renderResume);
})();