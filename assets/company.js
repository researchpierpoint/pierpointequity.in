async function loadCompany(){
 const params=new URLSearchParams(location.search);const symbol=(params.get("symbol")||"POLYCAB").toUpperCase();
 const card=(title,value,meta="")=>`<article class="card"><span class="eyebrow">${title}</span><h3>${value}</h3><p class="fine">${meta}</p></article>`;
 try{
  const u=await (await fetch("data/generated/nse-equity-universe.json",{cache:"no-store"})).json();
  const row=(u.companies||[]).find(x=>x.nse_symbol===symbol);if(!row)throw new Error("company not found");
  document.querySelector("#company-name").textContent=row.legal_name;
  const sub=document.querySelector("#company-subtitle");if(sub)sub.textContent=`${row.nse_symbol} · ${row.isin} · NSE listed equity`;
  const md=await (await fetch("data/generated/nse-market-snapshot.json",{cache:"no-store"})).json();
  const m=md.records[symbol];
  document.querySelector("#market").innerHTML=m?[card("CLOSE","₹"+Number(m.close).toLocaleString("en-IN"),"NSE · "+md.as_of),card("DAY RANGE","₹"+Number(m.low).toLocaleString("en-IN")+" – ₹"+Number(m.high).toLocaleString("en-IN"),"Official end-of-day range"),card("VOLUME",Number(m.volume).toLocaleString("en-IN"),"Shares traded"),card("TURNOVER","₹"+Number(m.turnover_lakh).toLocaleString("en-IN")+" lakh","NSE reported turnover"),card("DELIVERY",m.delivery_pct==null?"Not reported":m.delivery_pct+"%","NSE delivery field")].join(""):'<article class="card"><h3>Market snapshot unavailable</h3><p>No validated NSE record was available for this symbol in the latest snapshot.</p></article>';
  if(symbol!=="POLYCAB"){
   document.querySelector("#company-snapshot").innerHTML=[card("SYMBOL",row.nse_symbol,"NSE equity master"),card("ISIN",row.isin,"NSE equity master"),card("STATUS","LISTED","Identity verified")].join("");
   document.querySelector("#financials").innerHTML='<article class="card"><h3>Fundamental coverage</h3><p>Financial statements are not yet present in PirePoint’s verified research record for this company. The page will not invent or estimate them.</p><p><a href="https://www.nseindia.com/companies-listing/corporate-filings-financial-results">View NSE financial-results source →</a></p></article>';
   ["valuation","ownership","risks","timeline","evidence"].forEach(id=>{document.querySelector("#"+id).innerHTML='<p class="fine">No PirePoint verified research record for this section yet.</p>';});
   return;
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