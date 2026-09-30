const esc=s=>String(s??"").replace(/[<>&"]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;"}[c]));
const card=(t,v,m="")=>`<article class="card"><span class="eyebrow">${esc(t)}</span><h3>${esc(v)}</h3><p class="fine">${esc(m)}</p></article>`;
const sourceLink=(label,url)=>`<a class="source-link" href="${url}" target="_blank" rel="noopener noreferrer"><span>${esc(label)}</span><span>↗</span></a>`;
const empty=(t,p,url)=>`<article class="source-card"><div class="source-icon">↗</div><div><span class="eyebrow">SOURCE ACCESS</span><h3>${esc(t)}</h3><p>${esc(p)}</p>${url?sourceLink("Open official source",url):""}</div></article>`;
async function getJSON(path,fallback=null){
 const r=await fetch(path,{cache:"no-store"});
 if(!r.ok)throw new Error(path+" "+r.status);
 return await r.json();
}
async function loadCompany(){
 const symbol=(new URLSearchParams(location.search).get("symbol")||"POLYCAB").toUpperCase();
 const main=document.querySelector("main");
 try{
  const u=await getJSON("data/generated/nse-equity-universe.json",{companies:[]});
  const row=(u.companies||[]).find(x=>x.nse_symbol===symbol);
  if(!row)throw new Error("Company not found: "+symbol);
  document.querySelector("#company-name").textContent=row.legal_name||symbol;
  const sub=document.querySelector("#company-subtitle");
  if(sub)sub.textContent=`${symbol} · ${row.isin||"ISIN unavailable"} · NSE listed equity`;

  let d=null;
  try{d=(await getJSON("data/generated/company-intelligence.json",{records:{}})).records?.[symbol]||null;}catch{}
  const s=d?.sections||{};
  const snap=d?.snapshot||{};
  const business=document.querySelector("#business");
  if(business)business.innerHTML=s.business
    ?`<span class="eyebrow">BUSINESS</span><h2>Business profile</h2><p>${esc(s.business)}</p>`
    :`<h2>Business profile</h2><p>Identity is verified. Detailed company research is being added progressively.</p>`;

  document.querySelector("#company-snapshot").innerHTML=[
    card("AS OF",snap.as_of||u.as_of||"—","Generated evidence snapshot"),
    card("STATUS",snap.status||"INDEXED","Coverage status"),
    card("SOURCE","NSE / PirePoint pipeline","Source-controlled record")
  ].join("");

  let md={records:{},as_of:"—"};
  try{md=await getJSON("data/generated/nse-market-snapshot.json",md);}catch{}
  const m=md.records?.[symbol];
  document.querySelector("#market").innerHTML=m
    ? [card("CLOSE","₹"+Number(m.close).toLocaleString("en-IN"),"NSE · "+md.as_of),
       card("DAY RANGE","₹"+Number(m.low).toLocaleString("en-IN")+" – ₹"+Number(m.high).toLocaleString("en-IN"),"Official end-of-day range"),
       card("VOLUME",Number(m.volume||0).toLocaleString("en-IN"),"Shares traded"),
       card("TURNOVER","₹"+Number(m.turnover_lakh||0).toLocaleString("en-IN")+" lakh","NSE reported turnover")].join("")
    : empty("Market snapshot unavailable","No validated NSE market record is currently available.","https://www.nseindia.com/market-data/live-equity-market");

  document.querySelector("#results").innerHTML=s.financials?.length
    ? s.financials.map(x=>card(x.metric,x.value??x.status??"—",x.period||"NSE / XBRL")).join("")
    : empty("Official results","PirePoint has not indexed the parsed result yet. Read the latest exchange disclosure directly while the research record is being built.","https://www.nseindia.com/companies-listing/corporate-filings-financial-results");

  document.querySelector("#filings").innerHTML=s.filing_history?.length
    ? s.filing_history.map(x=>card(x.metric,x.value??x.status??"—",x.period||"NSE integrated filing")).join("")
    : empty("Official filings","The latest integrated filing is available at the exchange. PirePoint will surface the structured record when validated.","https://www.nseindia.com/companies-listing/corporate-integrated-filing");

  document.querySelector("#valuation").innerHTML=s.valuation?.length
    ? s.valuation.map(x=>card(x.metric,x.value??x.status??"—",x.period||"")).join("")
    : empty("Valuation inputs","PirePoint is waiting for enough validated inputs to calculate this safely. Use the official financial disclosures for the underlying figures.","https://www.nseindia.com/companies-listing/corporate-filings-financial-results");

  document.querySelector("#ownership").innerHTML=s.ownership?.length
    ? s.ownership.map(x=>card(x.metric,x.value??x.status??"—",x.period||"NSE shareholding")).join("")
    : empty("Official shareholding","The latest ownership disclosure is available from the exchange. PirePoint will surface the structured figures after validation.","https://www.nseindia.com/companies-listing/corporate-filings-application");

  document.querySelector("#risks").innerHTML=s.risks?.length
    ? s.risks.map(x=>card("MONITOR",x.risk,x.status||"")).join("")
    : empty("Monitor the source feed","No PirePoint risk item is currently surfaced here. Follow the official announcement feed for the latest company disclosures.","https://www.nseindia.com/companies-listing/corporate-filings-announcements");

  const alertRoot=document.querySelector("#alerts")||(()=>{const h=document.createElement("h2");h.textContent="Monitoring alerts";const x=document.createElement("div");x.id="alerts";document.querySelector("#risks").after(h,x);return x;})();
  alertRoot.innerHTML=s.alerts?.length
    ? s.alerts.map(x=>card((x.type||"ALERT").toUpperCase(),x.message,"Automated monitoring")).join("")
    : empty("Monitoring is quiet","No PirePoint alert is currently active. The official announcement feed remains the source of record.","https://www.nseindia.com/companies-listing/corporate-filings-announcements");

  document.querySelector("#timeline").innerHTML=s.timeline?.length
    ? s.timeline.map(x=>`<article class="card"><span class="eyebrow">${esc(x.date||"—")}</span><h3>${esc(x.title||x.event||"Update")}</h3><p class="fine">${esc(x.type||"evidence")} · ${esc((x.source_ids||[]).join(", "))}</p></article>`).join("")
    : empty("Follow official announcements","No validated event is currently surfaced in PirePoint. The exchange feed remains available directly.","https://www.nseindia.com/companies-listing/corporate-filings-announcements");

  const orderRoot=document.querySelector("#order-evidence")||(()=>{const h=document.createElement("h2");h.textContent="Recent order / contract evidence";const x=document.createElement("div");x.id="order-evidence";document.querySelector("#alerts").after(h,x);return x;})();
  orderRoot.innerHTML=s.order_book_events?.length
    ? s.order_book_events.map(x=>card("ORDER / CONTRACT",x.value?x.value+" · "+x.event:x.event,x.date||"NSE announcement")).join("")
    : empty("Order evidence feed","No PirePoint order event is currently surfaced. Check the official announcement feed for newly disclosed contracts and awards.","https://www.nseindia.com/companies-listing/corporate-filings-announcements");

  document.querySelector("#evidence").innerHTML=s.evidence?.length
    ? s.evidence.map(x=>card(x.source_id,"Tier "+x.tier,x.status||"")).join("")
    : empty("Source library","The structured evidence record is still being expanded. Use the official annual-report library in the meantime.","https://www.nseindia.com/companies-listing/corporate-filings-annual-reports");

  document.querySelector("#coverage").innerHTML=Object.entries(s.coverage||{}).map(([k,v])=>v?card(k.replace(/_/g," ").toUpperCase(),"VERIFIED","Required source evidence is present."):card(k.replace(/_/g," ").toUpperCase(),"BUILDING","This field is being added to the PirePoint evidence layer.")).join("")
    ||empty("Coverage audit","The coverage audit is still being built for this record.","https://www.nseindia.com/companies-listing/corporate-filings-application");
 }catch(e){
  if(main)main.insertAdjacentHTML("beforeend",`<div class="notice"><b>Company data is temporarily unavailable.</b><br>The site could not load the required public dataset. The automated pipeline will retry.</div>`);
  console.error(e);
 }
}
loadCompany();