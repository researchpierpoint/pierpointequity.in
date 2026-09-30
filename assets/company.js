const esc=s=>String(s??"").replace(/[<>&"]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;"}[c]));
const card=(t,v,m="")=>`<article class="card"><span class="eyebrow">${esc(t)}</span><h3>${esc(v)}</h3><p class="fine">${esc(m)}</p></article>`;
const sourceLink=(label,url)=>`<a class="button secondary" href="${url}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`;
const empty=(t,p,url)=>`<article class="card"><h3>${esc(t)}</h3><p>${esc(p)}</p>${url?sourceLink("Open official source",url):""}</article>`;
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
    :`<h2>Business profile</h2><p>Identity is verified. Detailed PirePoint research coverage is not yet available for this company.</p>`;

  document.querySelector("#company-snapshot").innerHTML=[
    card("AS OF",snap.as_of||u.as_of||"—","Generated evidence snapshot"),
    card("STATUS",snap.status||"identity-only","Coverage status"),
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
    : empty("Financial results not yet available","PirePoint does not yet have a validated parsed result row for this company. The official exchange filing remains available.","https://www.nseindia.com/companies-listing/corporate-filings-financial-results");

  document.querySelector("#filings").innerHTML=s.filing_history?.length
    ? s.filing_history.map(x=>card(x.metric,x.value??x.status??"—",x.period||"NSE integrated filing")).join("")
    : empty("No verified filing record","PirePoint has not yet normalised a usable integrated filing for this company.","https://www.nseindia.com/companies-listing/corporate-integrated-filing");

  document.querySelector("#valuation").innerHTML=s.valuation?.length
    ? s.valuation.map(x=>card(x.metric,x.value??x.status??"—",x.period||"")).join("")
    : empty("Valuation not computable","Required validated earnings/share-count evidence is not currently available. We will not manufacture a valuation.","https://www.nseindia.com/companies-listing/corporate-filings-financial-results");

  document.querySelector("#ownership").innerHTML=s.ownership?.length
    ? s.ownership.map(x=>card(x.metric,x.value??x.status??"—",x.period||"NSE shareholding")).join("")
    : empty("Ownership not currently available","No usable current shareholding filing has been normalised yet.","https://www.nseindia.com/companies-listing/corporate-filings-application");

  document.querySelector("#risks").innerHTML=s.risks?.length
    ? s.risks.map(x=>card("MONITOR",x.risk,x.status||"")).join("")
    : empty("No risk event returned","No matching risk-monitoring announcement was returned in the current source window.","https://www.nseindia.com/companies-listing/corporate-filings-announcements");

  const alertRoot=document.querySelector("#alerts")||(()=>{const h=document.createElement("h2");h.textContent="Monitoring alerts";const x=document.createElement("div");x.id="alerts";document.querySelector("#risks").after(h,x);return x;})();
  alertRoot.innerHTML=s.alerts?.length
    ? s.alerts.map(x=>card((x.type||"ALERT").toUpperCase(),x.message,"Automated monitoring")).join("")
    : empty("No active monitoring alert","No alert condition was detected in the current source set.","https://www.nseindia.com/companies-listing/corporate-filings-announcements");

  document.querySelector("#timeline").innerHTML=s.timeline?.length
    ? s.timeline.map(x=>`<article class="card"><span class="eyebrow">${esc(x.date||"—")}</span><h3>${esc(x.title||x.event||"Update")}</h3><p class="fine">${esc(x.type||"evidence")} · ${esc((x.source_ids||[]).join(", "))}</p></article>`).join("")
    : empty("No material event in current feed","No validated event was returned for this symbol.","https://www.nseindia.com/companies-listing/corporate-filings-announcements");

  const orderRoot=document.querySelector("#order-evidence")||(()=>{const h=document.createElement("h2");h.textContent="Recent order / contract evidence";const x=document.createElement("div");x.id="order-evidence";document.querySelector("#alerts").after(h,x);return x;})();
  orderRoot.innerHTML=s.order_book_events?.length
    ? s.order_book_events.map(x=>card("ORDER / CONTRACT",x.value?x.value+" · "+x.event:x.event,x.date||"NSE announcement")).join("")
    : empty("No recent order evidence","No order, contract, award or bagging announcement was returned in the current source window.","https://www.nseindia.com/companies-listing/corporate-filings-announcements");

  document.querySelector("#evidence").innerHTML=s.evidence?.length
    ? s.evidence.map(x=>card(x.source_id,"Tier "+x.tier,x.status||"")).join("")
    : empty("No additional evidence record","Only the verified source records shown above are available.","https://www.nseindia.com/companies-listing/corporate-filings-annual-reports");

  document.querySelector("#coverage").innerHTML=Object.entries(s.coverage||{}).map(([k,v])=>card(k.replace(/_/g," ").toUpperCase(),v?"VERIFIED":"NOT AVAILABLE",v?"Required source evidence is present.":"Required source evidence is not currently available.")).join("")
    ||empty("Coverage not available","No coverage audit record was generated.","https://www.nseindia.com/companies-listing/corporate-filings-application");
 }catch(e){
  if(main)main.insertAdjacentHTML("beforeend",`<div class="notice"><b>Company data is temporarily unavailable.</b><br>The site could not load the required public dataset. The automated pipeline will retry.</div>`);
  console.error(e);
 }
}
loadCompany();