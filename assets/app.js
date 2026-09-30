const esc=s=>String(s).replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
const form=document.getElementById('searchForm');const input=document.getElementById('searchInput');const out=document.getElementById('searchResult');
async function runSearch(q){
  const [indexRes,guidesRes]=await Promise.all([
    fetch('data/public/search-index.json',{cache:'no-store'}),
    fetch('guides.html',{cache:'no-store'})
  ]);
  const d=await indexRes.json();
  const terms=q.toLowerCase().split(/\s+/).filter(Boolean);
  const companyMatches=d.items.map(x=>{const hay=[x.name,x.symbol||'',x.isin||'',...(x.keywords||[]),x.description||''].join(' ').toLowerCase();const score=terms.reduce((n,t)=>n+(hay.includes(t)?1:0),0);return {...x,score};}).filter(x=>x.score>0);
  const guideHtml=await guidesRes.text();
  const doc=new DOMParser().parseFromString(guideHtml,'text/html');
  const guideMatches=[...doc.querySelectorAll('.guide-card')].map(card=>{
    const name=card.querySelector('h2')?.textContent?.trim()||'Guide';
    const description=card.querySelector('p')?.textContent?.trim()||'Indian stock-market guide';
    const url=card.querySelector('a')?.getAttribute('href')||'guides.html';
    const hay=[name,description,card.dataset.text||'guide indian stock market investing'].join(' ').toLowerCase();
    const score=terms.reduce((n,t)=>n+(hay.includes(t)?1:0),0);
    return {type:'guide',name,description,url,score};
  }).filter(x=>x.score>0);
  const matches=[...guideMatches,...companyMatches].sort((a,b)=>b.score-a.score||String(a.name).localeCompare(String(b.name))).slice(0,10);
  out.hidden=false;
  if(!matches.length){out.innerHTML='<strong>No indexed result yet.</strong><br>Try a company name, P/E, ROE, IPO, ETF, SIP, debt, valuation or another market question.';return;}
  out.innerHTML='<strong>Results</strong>'+matches.map(x=>'<div class="search-item"><a href="'+esc(x.url)+'"><b>'+esc(x.name)+'</b></a><br><span>'+esc(x.symbol||x.type||'')+' · '+esc(x.description||'')+'</span></div>').join('');
}
if(form){form.addEventListener('submit',e=>{e.preventDefault();const q=input.value.trim();if(q)runSearch(q).catch(()=>{out.hidden=false;out.textContent='Search is temporarily unavailable.';});});}