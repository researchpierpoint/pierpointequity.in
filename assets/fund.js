const card=(t,v,m="")=>`<article class="card"><span class="eyebrow">${t}</span><h3>${v}</h3><p class="fine">${m}</p></article>`;
async function load(){
 const code=new URLSearchParams(location.search).get("code");const d=await (await fetch("data/generated/amfi-nav.json",{cache:"no-store"})).json();const f=(d.funds||[]).find(x=>String(x.scheme_code)===String(code));if(!f)throw Error("fund not found");
 document.querySelector("#name").textContent=f.name;document.querySelector("#meta").textContent=`Scheme code ${f.scheme_code} · ${f.isin||"ISIN unavailable"} · NAV date ${f.date}`;
 const h=(await (await fetch("data/generated/amfi-nav-history.json",{cache:"no-store"})).json()).dates||{},ds=Object.keys(h).sort(),last=ds.at(-1);
 const info=(await (await fetch("data/generated/mf-intelligence.json",{cache:"no-store"})).json()).schemes?.[String(code)]||{};
 const cards=[card("LATEST NAV",f.nav,f.date)];
 if(info.amc)cards.push(card("AMC",info.amc,"Secondary enrichment source"));
 if(info.category)cards.push(card("CATEGORY",info.category,"Secondary enrichment source"));
 if(info.aum_cr!=null)cards.push(card("AUM",Number(info.aum_cr).toLocaleString("en-IN")+" Cr","Secondary enrichment source"));
 if(info.expense_ratio!=null)cards.push(card("EXPENSE RATIO",info.expense_ratio+"%","TER · secondary enrichment source"));
 const ret=info.returns||{};for(const k of ["1m","3m","6m","1y","3y","5y"]){if(ret[k]?.value!=null)cards.push(card(k.toUpperCase(),ret[k].value+"%", "CAGR / reported return · secondary enrichment source"))}
 const ratios=info.ratios||{};for(const k of ["pe","pb","sharpe","beta","alpha","std_dev"]){if(ratios[k]!=null)cards.push(card(k.toUpperCase(),ratios[k],"Fund ratio · secondary enrichment source"))}
 document.querySelector("#facts").innerHTML=cards.join("");
 document.querySelector("#history").innerHTML=ds.slice(-20).reverse().map(x=>card(x,h[x][f.scheme_code]??"—","AMFI NAV")).join("");
 document.querySelector("#note").textContent="AMFI is the primary NAV source. Additional category, AMC, AUM, TER, return and ratio fields are secondary enrichment and are shown only when the enrichment source has a current record.";
}
load().catch(()=>document.querySelector("#name").textContent="Fund data unavailable.");
