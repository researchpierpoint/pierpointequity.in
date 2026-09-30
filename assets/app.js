(function(){
const esc=s=>String(s??"").replace(/[<>&"]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;"}[c]));
const form=document.getElementById("searchForm"),input=document.getElementById("searchInput"),out=document.getElementById("searchResult");
const index=[
["How to Analyse a Stock","Business, growth, ROCE, financial statements, cash flow, valuation and risk.","guides/how-to-analyse-a-stock.html","stock analysis fundamental research company"],
["Stock Market Basics","Learn how shares, exchanges, brokers, orders and settlement fit together.","guides/stock-market-basics.html","beginner basics shares stocks exchange"],
["P/E Ratio Explained","Understand price-to-earnings, earnings and valuation context.","guides/pe-ratio.html","pe p/e valuation price earnings"],
["ROE Explained","Understand return on equity and the effect of leverage.","guides/roe.html","roe return equity quality"],
["ROCE Explained","Understand return on capital employed and capital efficiency.","guides/roce.html","roce return capital employed quality"],
["EPS Explained","Understand earnings per share, growth and dilution.","guides/eps.html","eps earnings per share"],
["How to Buy Stocks","Understand the journey from account to order to settlement.","guides/how-to-buy-stocks.html","buy stocks broker order beginner"],
["Dividends Explained","Understand dividend dates, yield and sustainability.","guides/dividend-explained.html","dividend yield income"],
["How to Read an Earnings Call","Learn how to separate results, commentary and guidance.","guides/earnings-call.html","earnings results management guidance"],
["Stock Market Scams & Fraud","Learn practical red flags and account-security basics.","guides/fraud-and-scams.html","scam fraud safety"],
["India","SEBI, NSE, BSE, demat, IPOs and Indian market mechanics.","countries/india.html","india indian nse bse sebi"],
["United States","SEC, NYSE, Nasdaq and US market structure.","countries/united-states.html","us usa america sec nasdaq nyse"],
["China","Mainland exchanges, share classes and market access.","countries/china.html","china shanghai shenzhen hong kong"],
["Japan","JPX, TSE and Japanese market structure.","countries/japan.html","japan tokyo jpx"],
["United Kingdom","LSE, FCA and UK market structure.","countries/united-kingdom.html","uk britain london fca"],
["Glossary","Plain-English definitions of stock-market language.","glossary.html","glossary terms definition"],
["Compare Markets","Compare exchanges, regulators, currencies and market structures.","compare.html","compare markets countries"],
["Tools","Transparent calculators supporting market education.","tools.html","calculator cagr sip compound"]
];
function search(q){
 const terms=q.toLowerCase().split(/\s+/).filter(Boolean);
 return index.map(x=>({x,score:terms.reduce((n,t)=>n+((x[0]+" "+x[1]+" "+x[3]).toLowerCase().includes(t)?1:0),0)})).filter(x=>x.score).sort((a,b)=>b.score-a.score).slice(0,8);
}
if(form&&input&&out){form.addEventListener("submit",e=>{e.preventDefault();const q=input.value.trim();if(!q)return;const m=search(q);out.hidden=false;out.innerHTML=m.length?'<strong>Best matches</strong>'+m.map(z=>'<div class="search-item"><a href="'+esc(z.x[2])+'"><b>'+esc(z.x[0])+'</b></a><br><span>'+esc(z.x[1])+'</span></div>').join(""):'<strong>No close match yet.</strong><br>Try “P/E”, “ROCE”, “India”, “how to buy stocks”, “IPO”, “dividend” or “risk”.';history.replaceState(null,"","?q="+encodeURIComponent(q));});}
document.querySelectorAll(".nav-search").forEach(a=>a.addEventListener("click",e=>{const i=document.getElementById("searchInput");if(i){e.preventDefault();i.scrollIntoView({behavior:"smooth",block:"center"});setTimeout(()=>i.focus(),250);}}));
const nav=document.querySelector(".nav nav"); if(nav&&!document.querySelector(".mobile-menu-button")){const b=document.createElement("button");b.className="mobile-menu-button";b.setAttribute("aria-label","Open navigation");b.textContent="Menu";b.onclick=()=>nav.classList.toggle("open");nav.parentElement?.insertBefore(b,nav);}
const path=location.pathname; if(path.endsWith("index.html")||path.endsWith("/")){const last=localStorage.getItem("pirepoint:last-guide");const holder=document.getElementById("continueLearning");if(holder&&last){holder.innerHTML='<span class="tag">CONTINUE LEARNING</span><h3>Pick up where you left off</h3><p>You were exploring a guide. Continue without starting over.</p><a href="'+esc(last)+'">Continue →</a>';holder.hidden=false;}}
})();