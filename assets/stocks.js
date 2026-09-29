const esc=s=>String(s).replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
let universe=[];
const state={q:"",page:1,pageSize:50};
async function loadUniverse(){
  const r=await fetch("data/generated/nse-equity-universe.json",{cache:"no-store"});
  if(!r.ok) throw new Error("universe unavailable");
  const d=await r.json(); universe=d.companies||[];
  document.querySelector("#universeMeta").textContent=`${universe.length.toLocaleString()} NSE listed-equity records · snapshot ${d.as_of}`;
  render();
}
function render(){
  const q=state.q.toLowerCase().trim();
  const filtered=!q?universe:universe.filter(x=>[x.nse_symbol,x.legal_name,x.isin].join(" ").toLowerCase().includes(q));
  const totalPages=Math.max(1,Math.ceil(filtered.length/state.pageSize));
  state.page=Math.min(state.page,totalPages);
  const start=(state.page-1)*state.pageSize;
  const rows=filtered.slice(start,start+state.pageSize);
  document.querySelector("#companyCount").textContent=q?`${filtered.length.toLocaleString()} matches`:`${universe.length.toLocaleString()} companies`;
  document.querySelector("#companyRows").innerHTML=rows.map(x=>`<tr><td><a href="company.html?symbol=${encodeURIComponent(x.nse_symbol)}">${esc(x.nse_symbol)}</a></td><td>${esc(x.legal_name)}</td><td>${esc(x.isin)}</td><td><span class="tag">UNIVERSE</span></td></tr>`).join("")||'<tr><td colspan="4">No matching company found.</td></tr>';
  document.querySelector("#pageMeta").textContent=`Page ${state.page} of ${totalPages}`;
  document.querySelector("#prevPage").disabled=state.page<=1;
  document.querySelector("#nextPage").disabled=state.page>=totalPages;
}
const input=document.querySelector("#stockSearch");
if(input) input.addEventListener("input",()=>{state.q=input.value;state.page=1;render()});
document.querySelector("#prevPage")?.addEventListener("click",()=>{state.page--;render()});
document.querySelector("#nextPage")?.addEventListener("click",()=>{state.page++;render()});
loadUniverse().catch(()=>{document.querySelector("#companyRows").innerHTML='<tr><td colspan="4">The NSE universe is temporarily unavailable.</td></tr>'});
