/* PirePoint Learn Before You Invest — reusable 300-node engine */
(function(){
"use strict";
const TARGET_DOMAINS=[
["basics","Market purpose","Understand what the market is for, what ownership means and what an investor is actually buying."],
["structure","Market structure","Map exchanges, venues, listing segments and the institutions that make the market function."],
["regulation","Regulation","Know the regulator, investor protections, enforcement structure and rules that can affect an investor."],
["access","Investor access","Understand accounts, brokers, eligibility, foreign access, custody and practical friction."],
["instruments","Instruments","Learn shares, share classes, ETFs, funds, ADRs/GDRs where relevant and market-specific securities."],
["trading","Trading mechanics","Learn sessions, auctions, order types, price formation, liquidity and trading constraints."],
["settlement","Clearing & settlement","Follow an order from execution through clearing, custody and final settlement."],
["participants","Market participants","Understand retail, institutions, foreign investors, market makers and other important actors."],
["reporting","Reporting cadence","Learn fiscal years, filing cadence, earnings releases and reporting conventions."],
["accounting","Accounting context","Understand local accounting standards, presentation differences and comparability traps."],
["ownership","Ownership","Learn free float, founder/state/institutional ownership, voting rights and beneficial ownership."],
["governance","Corporate governance","Understand boards, related parties, shareholder rights, controls and governance signals."],
["corporate-actions","Corporate actions","Learn dividends, splits, rights, buybacks, mergers, delistings and how ownership changes."],
["tax","Market tax basics","Understand market-specific transaction, dividend and capital-gain tax concepts at a learning level."],
["currency","Currency","Understand the local currency, FX conversion, translation and how currency reaches company economics."],
["macro","Macro transmission","Trace rates, inflation, growth, policy and currency from macro data into sectors and earnings."],
["sectors","Sector map","Learn the market's important industries, business models and sector-specific drivers."],
["business","Business analysis","Apply customer, pricing, moat, unit economics, competition and growth-quality thinking locally."],
["financials","Financial statement analysis","Read income statement, balance sheet and cash flow in the market's reporting context."],
["cash","Cash & capital intensity","Understand working capital, capex, free cash flow, cash conversion and funding needs."],
["returns","Returns & quality","Use ROE, ROCE, margins, incremental returns and growth quality without mechanical comparison."],
["valuation","Valuation","Understand multiples, DCF logic, expectations, cyclicality, rates and local valuation conventions."],
["risk","Market-specific risk","Identify regulatory, liquidity, governance, currency, accounting and business failure modes."],
["research","Research & evidence","Find primary sources, test claims, build a thesis, red-team it and decide what remains unknown."]
];
const HOME_DOMAINS=[
["cross-border-access","Cross-border access","Understand how an investor in the home country can legally and practically access the destination market."],
["fx-transfer","Currency & money movement","Understand conversion, transfer costs, settlement currency, FX risk and the path of money."],
["home-tax","Home-country tax","Learn the home-country concepts that may apply to foreign dividends, gains, income and assets."],
["withholding","Foreign withholding & treaties","Understand that the destination may withhold tax and that treaties/account status can affect treatment."],
["reporting-compliance","Reporting & compliance","Learn what records, declarations, account reports or disclosures may matter for the home investor."],
["cross-border-risk","Cross-border risk","Understand time zones, custody, legal jurisdiction, broker failure, information gaps and operational friction."]
];
const STAGES=[
["foundation","Foundation","Know the concept in plain language."],
["local-rules","Local rules","Identify what is specific to this market or home country."],
["how-it-works","How it works","Trace the mechanism from investor action to outcome."],
["investor-view","Investor view","Understand why the concept changes an actual investing decision."],
["company-impact","Company impact","See how it affects businesses, earnings, cash or valuation."],
["research-method","Research method","Know where to verify it and how to reproduce the conclusion."],
["common-trap","Common trap","Recognise a plausible mistake or misleading assumption."],
["real-example","Real example","Apply the idea to a realistic market/company situation."],
["practice","Practice","Perform a small task that demonstrates understanding."],
["mastery","Mastery","Explain, verify and transfer the concept without prompts."]
];
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const slug=s=>String(s||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
function profileName(key,profiles){return profiles.markets[key]?.name||key}
function makeTargetNodes(p){
 return TARGET_DOMAINS.flatMap((d,di)=>STAGES.map((st,si)=>{
  const n=di*10+si+1;
  const diff=si<3?"beginner":si<7?"intermediate":"advanced";
  const proof=si<5?"Explain in your own words":si<7?"Find and verify a primary source":si===7?"Solve a market example":si===8?"Complete the practice task":"Teach it back and transfer it to a new case";
  return {id:"t-"+n,number:n,source:"target",domain:d[0],category:d[1],title:st[1]+": "+d[1],difficulty:diff,objective:st[2],explanation:"In "+p.name+", "+d[2]+" "+p.focus+" This lesson isolates the "+st[1].toLowerCase()+" layer so a familiar investing concept is not mistaken for a local rule.",proof,sourceRefs:p.sources};
 }));
}
function makeHomeNodes(p,start){
 return HOME_DOMAINS.flatMap((d,di)=>STAGES.map((st,si)=>{
  const n=start+di*10+si+1; const diff=si<3?"beginner":si<7?"intermediate":"advanced";
  const proof=si<6?"Explain the home-country implication":si===7?"Apply it to a destination-market example":si===8?"Complete the cross-border task":"Verify the rule from an authoritative source and teach it back";
  return {id:"h-"+n,number:n,source:"home",domain:d[0],category:d[1],title:st[1]+": "+d[1],difficulty:diff,objective:st[2],explanation:p.context+" "+d[2]+" The point is not to memorise a rule that may change; it is to know what to check, where to check it and how it changes the destination-market decision.",proof,sourceRefs:[]};
 }));
}
function stateKey(h,t){return "ppLearn300:"+slug(h)+"->"+slug(t)}
function render(app,profiles){
 const qs=new URLSearchParams(location.search), names=Object.values(profiles.markets);
 const find=(v)=>{const x=names.find(m=>m.name===v||m.slug===slug(v));return x?.slug||""};
 let home=find(qs.get("home"))||localStorage.getItem("ppHomeCountry")||"india";
 let target=find(qs.get("target"))||"united-states";
 const homeSel=app.querySelector("#lbHome"),targetSel=app.querySelector("#lbTarget");
 homeSel.innerHTML=names.map(m=>'<option value="'+esc(m.slug)+'">'+esc(m.name)+'</option>').join("");
 targetSel.innerHTML=names.map(m=>'<option value="'+esc(m.slug)+'">'+esc(m.name)+'</option>').join("");
 homeSel.value=home;targetSel.value=target;
 let nodes=[], done=new Set(), current=null;
 function rebuild(){
  home=homeSel.value;target=targetSel.value;localStorage.setItem("ppHomeCountry",home);
  const tp=profiles.markets[target],hp=profiles.homes[home];
  const same=home===target;
  const t=makeTargetNodes(tp), h=makeHomeNodes(hp,240);
  /* Every pair is exactly 300 lessons. Same-market routes use 240 core lessons + 60 local application/mastery lessons, not fake cross-border friction. */
  nodes=same?t.concat(makeHomeNodes({context:"Because your home and destination market are the same, there is no foreign-market overlay. Use this final 60-lesson block to prove local application, verification, traps, research and mastery.",name:tp.name},240).map(n=>({...n,source:"target",category:"Local application & mastery",id:"a-"+n.id}))):t.concat(h);
  const raw=JSON.parse(localStorage.getItem(stateKey(home,target))||"[]");done=new Set(raw);
  history.replaceState(null,"","?home="+encodeURIComponent(hp.name)+"&target="+encodeURIComponent(tp.name));
  renderList();renderProgress();openNext();
 }
 function renderProgress(){
  const pct=Math.round(done.size/nodes.length*100);app.querySelector("#lbProgress").style.width=pct+"%";
  app.querySelector("#lbPct").textContent=pct+"%";app.querySelector("#lbCount").textContent=done.size+" / "+nodes.length+" learned";
 }
 function renderList(){
  const q=(app.querySelector("#lbSearch").value||"").toLowerCase().trim(), f=app.querySelector("#lbFilter").value;
  const list=nodes.filter(n=>(!q||(n.title+" "+n.category+" "+n.explanation).toLowerCase().includes(q))&&(f==="all"||n.difficulty===f||n.source===f));
  app.querySelector("#lbList").innerHTML=list.map(n=>'<button class="lb-item '+(done.has(n.id)?"is-done ":"")+(current?.id===n.id?"is-open":"")+'" data-id="'+n.id+'"><span class="lb-no">'+String(n.number).padStart(3,"0")+'</span><span><b>'+esc(n.title)+'</b><small>'+esc(n.category)+' · '+esc(n.difficulty)+' · '+(n.source==="home"?"HOME OVERLAY":"TARGET MARKET")+'</small></span><i>'+(done.has(n.id)?"✓":"")+'</i></button>').join("");
  app.querySelectorAll(".lb-item").forEach(b=>b.onclick=()=>open(b.dataset.id));
 }
 function persist(){localStorage.setItem(stateKey(home,target),JSON.stringify([...done]));renderProgress()}
 function open(id){
  current=nodes.find(n=>n.id===id)||nodes.find(n=>!done.has(n.id))||nodes[0]; if(!current)return;
  const next=nodes.find(n=>n.number===current.number+1);
  app.querySelector("#lbLesson").innerHTML='<div class="lb-kicker">'+(current.source==="home"?"HOME-COUNTRY OVERLAY":"TARGET-MARKET CORE")+' · '+esc(current.category)+'</div><h2>'+esc(current.title)+'</h2><div class="lb-meta"><span>'+esc(current.difficulty)+'</span><span>Lesson '+current.number+' / 300</span><span>'+esc(current.domain)+'</span></div><p class="lb-objective"><b>What you should be able to do</b>'+esc(current.objective)+'</p><p>'+esc(current.explanation)+'</p><div class="lb-proof"><b>Proof of learning</b><p>'+esc(current.proof)+'</p><button id="lbComplete">'+(done.has(current.id)?"✓ Learned — mark as not learned":"Mark learned")+'</button>'+(next?'<button id="lbNext" class="secondary">Next lesson →</button>':"")+'</div><div class="lb-sourcebox"><b>Verify before relying on it</b><p>PirePoint teaches the mental model; current rules, tax treatment, access requirements and market facts should be checked against the relevant primary source.</p>'+(current.sourceRefs||[]).map(x=>'<a href="'+esc(x.startsWith("http")?x:"#")+'" target="_blank" rel="noopener">'+esc(x.replace(/^https?:\/\//,""))+' ↗</a>').join(" ")+'</div>';
  app.querySelector("#lbComplete").onclick=()=>{done.has(current.id)?done.delete(current.id):done.add(current.id);persist();renderList();open(current.id)};
  const nx=app.querySelector("#lbNext");if(nx)nx.onclick=()=>open(next.id);
  app.querySelector("#lbLesson").scrollIntoView({behavior:"smooth",block:"nearest"});
  renderList();
 }
 function openNext(){open(nodes.find(n=>!done.has(n.id))?.id||nodes[0]?.id)}
 homeSel.onchange=rebuild;targetSel.onchange=rebuild;
 app.querySelector("#lbSearch").oninput=renderList;app.querySelector("#lbFilter").onchange=renderList;
 app.querySelector("#lbReset").onclick=()=>{if(confirm("Reset this 300-lesson route?")){done.clear();persist();renderList();openNext()}};
 rebuild();
}
fetch("data/learn-before-invest.json").then(r=>r.json()).then(p=>render(document.querySelector("#learnBeforeInvest"),p)).catch(e=>{document.querySelector("#learnBeforeInvest").innerHTML="<p>Learning system could not load. Please refresh.</p>";console.error(e)});
})();