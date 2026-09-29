let rows=[],page=1;const size=50;const esc=s=>String(s??"").replace(/[<>&"]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;"}[c]));
async function load(){
 const u=await (await fetch("data/generated/nse-equity-universe.json",{cache:"no-store"})).json();
 let e={records:{},count:0,as_of:"—"};try{e=await (await fetch("data/generated/nse-etf-snapshot.json",{cache:"no-store"})).json()}catch{}
 const em=e.records||{};
 rows=u.companies.filter(x=>em[x.nse_symbol]||/ETF|BEES|NIFTY|SENSEX|GOLD|SILVER|LIQUID|JUNIOR|CPSEETF|MON100|MAFANG|HNGSNGBEES|MAHKTECH/i.test((x.nse_symbol||"")+" "+(x.legal_name||""))).map(x=>({...x,market:em[x.nse_symbol]}));
 document.querySelector("#etfMeta").textContent=rows.length.toLocaleString()+" NSE ETF/ETF-like records · ETF snapshot "+(e.as_of||"—");render();
}
function render(){
 const q=document.querySelector("#etfSearch").value.toLowerCase().trim();const f=rows.filter(x=>!q||[x.legal_name,x.nse_symbol,x.isin,x.market?.underlying].join(" ").toLowerCase().includes(q));
 const pages=Math.max(1,Math.ceil(f.length/size));page=Math.min(page,pages);const r=f.slice((page-1)*size,page*size);
 document.querySelector("#etfRows").innerHTML=r.map(x=>{const m=x.market||{};return `<tr><td><a href="etf.html?symbol=${encodeURIComponent(x.nse_symbol)}">${esc(x.nse_symbol)}</a></td><td>${esc(x.legal_name)}</td><td>${esc(m.underlying||x.isin)}</td><td>${m.close==null?"—":"₹"+Number(m.close).toLocaleString("en-IN")}</td><td>${m.inav==null?"—":Number(m.inav).toLocaleString("en-IN",{maximumFractionDigits:4})}</td><td>${m.premium_discount_pct==null?"—":m.premium_discount_pct.toFixed(2)+"%"}</td><td>${m.volume==null?"—":Number(m.volume).toLocaleString("en-IN")}</td></tr>`}).join("")||'<tr><td colspan="7">No matching ETF.</td></tr>';
 document.querySelector("#etfCount").textContent=f.length.toLocaleString()+" matches";document.querySelector("#etfPage").textContent=`Page ${page} of ${pages}`;document.querySelector("#etfPrev").disabled=page<=1;document.querySelector("#etfNext").disabled=page>=pages;
}
document.querySelector("#etfSearch")?.addEventListener("input",()=>{page=1;render()});document.querySelector("#etfPrev")?.addEventListener("click",()=>{page--;render()});document.querySelector("#etfNext")?.addEventListener("click",()=>{page++;render()});load().catch(()=>document.querySelector("#etfRows").innerHTML='<tr><td colspan="7">NSE ETF snapshot unavailable.</td></tr>');