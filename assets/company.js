async function loadCompany(){
  const res=await fetch("data/public/company/polycab.json",{cache:"no-store"});
  if(!res.ok) throw new Error("company record unavailable");
  const d=await res.json(), s=d.sections;
  const card=(title,value,meta="")=>`<article class="card"><span class="eyebrow">${title}</span><h3>${value}</h3><p class="fine">${meta}</p></article>`;
  document.querySelector("#company-snapshot").innerHTML=[
    card("AS OF",d.snapshot.as_of,"Point-in-time record"),
    card("STATUS",d.snapshot.status.toUpperCase(),"Evidence status"),
    card("EVIDENCE","Tier 1 sources","Company / exchange-originated sources")
  ].join("");
  document.querySelector("#financials").innerHTML=s.financials.map(x=>card(x.metric,x.value,x.period+" · "+x.source_ids.join(", "))).join("");
  document.querySelector("#valuation").innerHTML=s.valuation.map(x=>card(x.metric,x.status)).join("");
  document.querySelector("#ownership").innerHTML=s.ownership.map(x=>card(x.metric,x.status)).join("");
  document.querySelector("#risks").innerHTML=s.risks.map(x=>card("MONITOR",x.risk,x.status)).join("");
  document.querySelector("#timeline").innerHTML=s.timeline.map(x=>`<article class="card"><span class="eyebrow">${x.date}</span><h3>${x.title}</h3><p class="fine">${x.type} · ${x.source_ids.join(", ")}</p></article>`).join("");
  document.querySelector("#evidence").innerHTML=s.evidence.map(x=>`<article class="card"><h3>${x.source_id}</h3><p>Tier ${x.tier} · ${x.status}</p></article>`).join("");
}
loadCompany().catch(e=>{document.querySelector("main").insertAdjacentHTML("beforeend",`<p class="fine">Company record temporarily unavailable.</p>`)});
