const esc=s=>String(s??"").replace(/[<>&"]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;"}[c]));
const form=document.getElementById('searchForm');const input=document.getElementById('searchInput');const out=document.getElementById('searchResult');
async function runSearch(q){
  const [guidesRes,countriesRes]=await Promise.all([
    fetch('guides.html',{cache:'no-store'}),
    fetch('countries.html',{cache:'no-store'})
  ]);
  const terms=q.toLowerCase().split(/\s+/).filter(Boolean);
  const parse=async(res)=>new DOMParser().parseFromString(await res.text(),'text/html');
  const [gd,cd]=await Promise.all([parse(guidesRes),parse(countriesRes)]);
  const guideMatches=[...gd.querySelectorAll('.guide-card')].map(card=>{
    const name=card.querySelector('h2')?.textContent?.trim()||'Guide';
    const description=card.querySelector('p')?.textContent?.trim()||'Stock-market guide';
    const url=card.querySelector('a')?.getAttribute('href')||'guides.html';
    const hay=[name,description,card.dataset.text||'guide investing stock market'].join(' ').toLowerCase();
    return {type:'guide',name,description,url,score:terms.reduce((n,t)=>n+(hay.includes(t)?1:0),0)};
  }).filter(x=>x.score>0);
  const countryMatches=[...cd.querySelectorAll('.country-card')].map(card=>{
    const name=card.querySelector('h2')?.textContent?.trim()||'Country market';
    const description=card.querySelector('p')?.textContent?.trim()||'Country stock-market guide';
    const url=card.getAttribute('href')||'countries.html';
    const hay=[name,description,'country stock market exchange regulator investing'].join(' ').toLowerCase();
    return {type:'country',name:name+' market guide',description,url,score:terms.reduce((n,t)=>n+(hay.includes(t)?1:0),0)};
  }).filter(x=>x.score>0);
  const matches=[...guideMatches,...countryMatches].sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name)).slice(0,12);
  out.hidden=false;
  out.innerHTML=matches.length?'<strong>Guide results</strong>'+matches.map(x=>'<div class="search-item"><a href="'+esc(x.url)+'"><b>'+esc(x.name)+'</b></a><br><span>'+esc(x.type)+' · '+esc(x.description)+'</span></div>').join(''):'<strong>No guide found.</strong><br>Try P/E, ROCE, IPO, India, US, China, dividend, options, risk or another market question.';
}
if(form){form.addEventListener('submit',e=>{e.preventDefault();const q=input.value.trim();if(q)runSearch(q).catch(()=>{out.hidden=false;out.textContent='Search is temporarily unavailable.';});});}