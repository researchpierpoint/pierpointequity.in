async function loadCompany(){
 const params=new URLSearchParams(location.search);const symbol=(params.get("symbol")||"POLYCAB").toUpperCase();
 const card=(title,value,meta="")=>`<article class="card"><span class="eyebrow">${title}</span><h3>${value}</h3><p class="fine">${meta}</p></article>`;
 try{
  const ur=await fetch("data/generated/nse-equity-universe.json",{cache:"no-store"});const u=await ur.json();
  const row=(u.companies||[]).find(x=>x.nse_symbol===symbol);if(!row)throw new Error("company not found");
  document.querySelector("#company-name").textContent=row.legal_name;
  const sub=document.querySelector("#company-subtitle");if(sub)sub.textContent=`${row.nse_symbol} · ${row.isin} · NSE listed equity`;
  if(symbol!=="POLYCAB"){
   document.querySelector("#company-snapshot").innerHTML=[card("SYMBOL",row.nse_symbol,"NSE equity master"),card("ISIN",row.isin,"NSE equity master"),card("STATUS","UNIVERSE","Identity verified; deeper intelligence pending")].join("");
   document.querySelector("#financials").innerHTML='<article class="card"><h3>Financial intelligence not published yet</h3><p>Revenue, earnings, margins, ROCE, balance sheet, valuation and ownership will appear only after evidence is collected and validated.</p></article>';
   ["valuation","ownership","risks","timeline","evidence"].forEach(id=>{document.querySelector("#"+id).innerHTML='<p class="fine">No verified public record for this section yet.</p>';});return;
  }
  const d=await (await fetch("data/public/company/polycab.json",{cache:"no-store"})).json(),s=d.sections;
  document.querySelector("#company-snapshot").innerHTML=[card("AS OF",d.snapshot.as_of,"Point-in-time record"),card("STATUS",d.snapshot.status.toUpperCase(),"Evidence status"),card("EVIDENCE","Tier 1 sources","Company / exchange-originated sources")].join("");
  document.querySelector("#financials").innerHTML=s.financials.map(x=>card(x.metric,x.value,x.period+" · "+x.source_ids.join(", "))).join("");
  document.querySelector("#valuation").innerHTML=s.valuation.map(x=>card(x.metric,x.status)).join("");
  document.querySelector("#ownership").innerHTML=s.ownership.map(x=>card(x.metric,x.status)).join("");
  document.querySelector("#risks").innerHTML=s.risks.map(x=>card("MONITOR",x.risk,x.status)).join("");
  document.querySelector("#timeline").innerHTML=s.timeline.map(x=>`<article class="card"><span class="eyebrow">${x.date}</span><h3>${x.title}</h3><p class="fine">${x.type} · ${x.source_ids.join(", ")}</p></article>`).join("");
  document.querySelector("#evidence").innerHTML=s.evidence.map(x=>`<article class="card"><h3>${x.source_id}</h3><p>Tier ${x.tier} · ${x.status}</p></article>`).join("");
 }catch(e){document.querySelector("main").insertAdjacentHTML("beforeend",'<p class="fine">Company record temporarily unavailable.</p>');}
}
loadCompany();