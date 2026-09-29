async function loadCompany(){
 const symbol=(new URLSearchParams(location.search).get("symbol")||"POLYCAB").toUpperCase();
 const card=(t,v,m="")=>`<article class="card"><span class="eyebrow">${t}</span><h3>${v}</h3><p class="fine">${m}</p></article>`;
 const empty=(t,p)=>`<article class="card"><h3>${t}</h3><p>${p}</p></article>`;
 try{
  const u=await (await fetch("data/generated/nse-equity-universe.json",{cache:"no-store"})).json();
  const row=(u.companies||[]).find(x=>x.nse_symbol===symbol); if(!row)throw Error("company not found");
  document.querySelector("#company-name").textContent=row.legal_name;
  const sub=document.querySelector("#company-subtitle"); if(sub)sub.textContent=`${row.nse_symbol} · ${row.isin} · NSE listed equity`;
  const d=(await (await fetch("data/generated/company-intelligence.json",{cache:"no-store"})).json()).records?.[symbol]; if(!d)throw Error("record unavailable");
  const s=d.sections||{};
  document.querySelector("#company-snapshot").innerHTML=[card("AS OF",d.snapshot.as_of||"—","Automated evidence snapshot"),card("STATUS",(d.snapshot.status||"review").toUpperCase(),"Coverage status"),card("SOURCE","NSE / PirePoint pipeline","Source-controlled record")].join("");
  const md=await (await fetch("data/generated/nse-market-snapshot.json",{cache:"no-store"})).json(),m=md.records?.[symbol];
  document.querySelector("#market").innerHTML=m?[card("CLOSE","₹"+Number(m.close).toLocaleString("en-IN"),"NSE · "+md.as_of),card("DAY RANGE","₹"+Number(m.low).toLocaleString("en-IN")+" – ₹"+Number(m.high).toLocaleString("en-IN"),"Official end-of-day range"),card("VOLUME",Number(m.volume).toLocaleString("en-IN"),"Shares traded"),card("TURNOVER","₹"+Number(m.turnover_lakh).toLocaleString("en-IN")+" lakh","NSE reported turnover")].join(""):empty("Market snapshot unavailable","No validated NSE record is available.");
  document.querySelector("#results").innerHTML=s.financials?.length?s.financials.map(x=>card(x.metric,x.value??x.status??"—",x.period||"NSE results")).join(""):empty("Financial result data pending","The automated NSE collector has not returned a usable record yet.");
  document.querySelector("#financials").innerHTML=s.financials?.length?s.financials.map(x=>card(x.metric,x.value??x.status??"—",x.period||"NSE results")).join(""):empty("Fundamental coverage pending","Financial statements require validated company filings.");
  document.querySelector("#filings").innerHTML=s.filing_history?.length?s.filing_history.map(x=>card(x.metric,x.value??x.status??"—",x.period||"NSE Integrated Filing")).join(""):empty("Filing coverage pending","No current NSE integrated filing record is attached.");
  document.querySelector("#valuation").innerHTML=s.valuation?.length?s.valuation.map(x=>card(x.metric,x.value??x.status??"—",x.period||"")).join(""):empty("Valuation coverage pending","Validated earnings, share count and historical valuation data are required.");
  document.querySelector("#ownership").innerHTML=s.ownership?.length?s.ownership.map(x=>card(x.metric,x.value??x.status??"—")).join(""):empty("Ownership coverage pending","A current exchange/company shareholding filing is required.");
  document.querySelector("#risks").innerHTML=s.risks?.length?s.risks.map(x=>card("MONITOR",x.risk,x.status||"")).join(""):empty("Risk coverage pending","Validated company-specific evidence is required.");
  document.querySelector("#timeline").innerHTML=s.timeline?.length?s.timeline.map(x=>`<article class="card"><span class="eyebrow">${x.date||"—"}</span><h3>${x.title||x.event||"Update"}</h3><p class="fine">${x.type||"evidence"} · ${(x.source_ids||[]).join(", ")}</p></article>`).join(""):empty("Timeline pending","No validated material event has been ingested.");
  document.querySelector("#evidence").innerHTML=s.evidence?.length?s.evidence.map(x=>card(x.source_id,"Tier "+x.tier,x.status||"")).join(""):empty("Evidence pending","No source record attached.");
 }catch(e){document.querySelector("main").insertAdjacentHTML("beforeend",'<p class="fine">Company record temporarily unavailable. The automated pipeline will retry.</p>');}
}
loadCompany();