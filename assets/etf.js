const sourceLink=(label,url)=>'<a class="button secondary" href="'+url+'" target="_blank" rel="noopener noreferrer">'+label+' ↗</a>';
async function load(){
 const symbol=(new URLSearchParams(location.search).get("symbol")||"").toUpperCase();
 const u=await (await fetch("data/generated/nse-equity-universe.json",{cache:"no-store"})).json();
 const row=(u.companies||[]).find(x=>x.nse_symbol===symbol);
 let d={records:{},as_of:"—"};
 try{d=await (await fetch("data/generated/nse-etf-snapshot.json",{cache:"no-store"})).json()}catch{}
 let m=d.records?.[symbol];
 if(!m){
  try{
   const md=await (await fetch("data/generated/nse-market-snapshot.json",{cache:"no-store"})).json();
   const q=md.records?.[symbol];
   if(q)m={symbol,close:q.close,volume:q.volume,week52_high:"—",week52_low:"—"};
  }catch{}
 }
 if(!row)throw Error("ETF not found");
 document.querySelector("#name").textContent=row.legal_name;
 document.querySelector("#meta").textContent=symbol+" · "+row.isin+" · NSE ETF";
 const card=(t,v,p="")=>'<article class="card"><span class="eyebrow">'+t+'</span><h3>'+v+'</h3><p class="fine">'+p+'</p></article>';
 if(!m){
  document.querySelector("#facts").innerHTML='<article class="card"><h3>Official ETF record</h3><p>PirePoint has not yet indexed a validated snapshot for this symbol. The official NSE ETF record remains directly accessible.</p>'+sourceLink("Open official NSE ETF information","https://www.nseindia.com/static/products-services/etfs-launched-on-nse")+'</article>';
  return;
 }
 const facts=[
  card("MARKET PRICE",m.close??"—","NSE ETF snapshot"),
  card("i-NAV",m.inav??"—","NSE indicative NAV"),
  card("NAV",m.nav??"—","NSE ETF feed when supplied"),
  card("PREMIUM / DISCOUNT",m.premium_discount_pct==null?"—":m.premium_discount_pct.toFixed(2)+"%","Market price versus i-NAV"),
  card("UNDERLYING",m.underlying??"—","NSE ETF feed"),
  card("VOLUME",m.volume??"—","NSE ETF snapshot"),
  card("52-WEEK HIGH",m.week52_high??"—","NSE ETF feed"),
  card("52-WEEK LOW",m.week52_low??"—","NSE ETF feed")
 ];
 document.querySelector("#facts").innerHTML=facts.join("");
 document.querySelector("#note").innerHTML="i-NAV and NAV are distinct measures. Premium/discount is a point-in-time trading measure, not a return forecast. "+sourceLink("Open official NSE ETF information","https://www.nseindia.com/static/products-services/etfs-launched-on-nse");
}
load().catch(()=>{
 document.querySelector("#name").textContent="ETF record";
 document.querySelector("#meta").innerHTML=sourceLink("Open official NSE ETF information","https://www.nseindia.com/static/products-services/etfs-launched-on-nse");
});