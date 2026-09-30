const card=(t,v,m="")=>`<article class="card"><span class="eyebrow">${String(t)}</span><h3>${String(v)}</h3><p class="fine">${String(m)}</p></article>`;
async function getJSON(path,fallback){try{const r=await fetch(path,{cache:"no-store"});if(!r.ok)throw 0;return await r.json();}catch{return fallback;}}
async function load(){
 const code=new URLSearchParams(location.search).get("code");
 const d=await getJSON("data/generated/amfi-nav.json",null);
 if(!d)throw Error("AMFI NAV unavailable");
 const f=(d.funds||[]).find(x=>String(x.scheme_code)===String(code));
 if(!f)throw Error("fund not found");
 document.querySelector("#name").textContent=f.name;
 document.querySelector("#meta").textContent=`Scheme code ${f.scheme_code} · ${f.isin||"ISIN unavailable"} · NAV date ${f.date||"—"}`;

 const hist=await getJSON("data/generated/amfi-nav-history.json",null);
 const snapshots=Array.isArray(hist?.snapshots)?hist.snapshots:[];
 let info={};
 try{info=(await getJSON("data/generated/mf-intelligence.json",{schemes:{}})).schemes?.[String(code)]||{};}catch{}
 const cards=[card("LATEST NAV",f.nav,f.date||"AMFI")];
 if(info.amc)cards.push(card("AMC",info.amc,"Enrichment source"));
 if(info.category)cards.push(card("CATEGORY",info.category,"Enrichment source"));
 if(info.aum_cr!=null)cards.push(card("AUM",Number(info.aum_cr).toLocaleString("en-IN")+" Cr","Enrichment source"));
 if(info.expense_ratio!=null)cards.push(card("EXPENSE RATIO",info.expense_ratio+"%","Enrichment source"));
 const ret=info.returns||{};for(const k of ["1m","3m","6m","1y","3y","5y"])if(ret[k]?.value!=null)cards.push(card(k.toUpperCase(),ret[k].value+"%","Reported/enriched return"));
 const ratios=info.ratios||{};for(const k of ["pe","pb","sharpe","beta","alpha","std_dev"])if(ratios[k]!=null)cards.push(card(k.toUpperCase(),ratios[k],"Fund ratio"));
 document.querySelector("#facts").innerHTML=cards.join("");

 const historyCards=[];
 for(const snap of snapshots.slice(-20).reverse()){
   const found=(snap.funds||[]).find(x=>String(x.scheme_code)===String(code));
   if(found)historyCards.push(card(snap.as_of||"NAV",found.nav??"—","AMFI NAV"));
 }
 document.querySelector("#history").innerHTML=historyCards.join("")||emptyHistory();
 document.querySelector("#note").innerHTML="AMFI is the primary NAV source. Fields are shown only when validated data exists. "+sourceLink("Open official AMFI NAV","https://www.amfiindia.com/net-asset-value");
}
function sourceLink(label,url){return `<a class="button secondary" href="${url}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;} function emptyHistory(){return `<article class="card"><h3>NAV history not yet available</h3><p>Current NAV is available from PirePoint’s AMFI feed. Historical snapshots will appear as the automated history store accumulates them.</p>${sourceLink("Open AMFI NAV history","https://www.amfiindia.com/net-asset-value/nav-download")}</article>`;}
load().catch(e=>{document.querySelector("#name").textContent="Fund data temporarily unavailable.";document.querySelector("#meta").innerHTML="Please retry shortly. "+sourceLink("Open official AMFI NAV","https://www.amfiindia.com/net-asset-value");console.error(e);});