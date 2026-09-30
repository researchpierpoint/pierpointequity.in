(function(){
const article=document.querySelector("main article");if(!article)return;
const title=document.querySelector("main h1")?.textContent?.trim()||"Guide";
document.body.classList.add("guide-reading");
const bar=document.createElement("div");bar.className="reading-progress";bar.innerHTML="<span></span>";document.body.prepend(bar);
const nav=document.querySelector(".nav nav");if(nav&&!document.querySelector(".mobile-menu-button")){const b=document.createElement("button");b.className="mobile-menu-button";b.setAttribute("aria-label","Open navigation");b.textContent="Menu";b.onclick=()=>nav.classList.toggle("open");nav.parentElement?.insertBefore(b,nav);}const page=document.querySelector("main.page");
const rail=document.createElement("aside");rail.className="guide-rail";rail.innerHTML='<div class="rail-inner"><b>ON THIS PAGE</b><div id="guideToc"></div><a class="rail-back" href="../guides.html">All guides →</a></div>';
if(page)page.insertBefore(rail,article);
const toc=document.getElementById("guideToc");
article.querySelectorAll("h2").forEach((h,i)=>{if(!h.id)h.id="section-"+(i+1);const a=document.createElement("a");a.href="#"+h.id;a.textContent=h.textContent;toc?.appendChild(a);});
const glance=document.createElement("div");glance.className="guide-at-a-glance";glance.innerHTML='<span class="tag">IN 30 SECONDS</span><strong>'+title+'</strong><p>Get the core idea first. Go deeper only where you need it.</p>';article.prepend(glance);
const mistakes={P/E:"A low multiple does not automatically mean a stock is cheap.",ROE:"A high ROE can be helped by leverage; check the balance sheet.",ROCE:"A strong ROCE still needs to be compared with growth, valuation and capital intensity.",EPS:"EPS can change because of both earnings and the number of shares outstanding.",Dividend:"A high yield can be caused by a falling share price; check sustainability.","Market Capitalisation":"Share price alone does not tell you how large a company is.",Liquidity:"High recent volume does not guarantee you can exit easily at the same price.",Debt:"Debt can amplify returns and also amplify problems when cash flows weaken.","Stock Market Basics":"Owning a share is not the same thing as knowing what price is reasonable.",default:"A definition is the beginning, not the investment conclusion. Always ask what the number does and does not tell you."};
const key=Object.keys(mistakes).find(k=>title.toLowerCase().includes(k.toLowerCase()))||"default";
const mistake=document.createElement("div");mistake.className="guide-mistake";mistake.innerHTML='<span class="tag">COMMON MISTAKE</span><strong>Do not stop at the headline.</strong><p>'+mistakes[key]+'</p>';article.appendChild(mistake);
const quiz=document.createElement("div");quiz.className="guide-quiz";quiz.innerHTML='<span class="tag">QUICK CHECK</span><h3>Can you explain this guide in one sentence?</h3><p>If you can explain the core idea without jargon, you probably understand it. If not, revisit the highlighted sections above.</p><button type="button" id="quizReveal">Show the next question</button><div id="quizNext" hidden><b>What should you learn next?</b><p>Pick the concept that sits one step deeper rather than opening ten tabs at once.</p><a href="../guides.html">Find your next guide →</a></div>';article.appendChild(quiz);
quiz.querySelector("#quizReveal").onclick=()=>{quiz.querySelector("#quizNext").hidden=false;quiz.querySelector("#quizReveal").hidden=true;};
const complete=document.createElement("div");complete.className="guide-complete";complete.innerHTML='<span>Finished this guide?</span><a href="../guides.html">Choose your next question →</a>';article.appendChild(complete);
try{localStorage.setItem("pirepoint:last-guide",location.pathname)}catch(e){}
function scroll(){const d=document.documentElement,max=d.scrollHeight-innerHeight,pct=max>0?(scrollY/max)*100:0;bar.firstElementChild.style.width=pct+"%";let cur="";article.querySelectorAll("h2").forEach(h=>{if(h.getBoundingClientRect().top<180)cur=h.id});toc?.querySelectorAll("a").forEach(a=>a.classList.toggle("current",a.getAttribute("href")==="#"+cur));}
addEventListener("scroll",scroll,{passive:true});scroll();
})();
/* Guide depth layer */
(function(){
  const article=document.querySelector("main article"); if(!article)return;
  const links=[
    ["How to Analyse a Stock","how-to-analyse-a-stock.html"],
    ["P/E Ratio Explained","pe-ratio.html"],
    ["ROCE Explained","roce.html"],
    ["How to Read an Earnings Call","earnings-call.html"],
    ["Balance Sheet","balance-sheet.html"],
    ["Cash Flow Statement","cash-flow-statement.html"],
    ["DCF Valuation","dcf-valuation.html"],
    ["Investor Behaviour & Biases","behavioural-biases.html"]
  ];
  const here=location.pathname.split("/").pop();
  const next=links.find(x=>x[1]!==here);
  if(next){
    const existing=article.querySelector(".guide-complete");
    if(existing){
      existing.innerHTML='<span>One idea deeper</span><a href="'+next[1]+'">'+next[0]+' →</a>';
    }
  }
  const share=document.createElement("button");
  share.type="button";share.className="guide-share";share.textContent="Copy guide link";
  share.onclick=async()=>{try{await navigator.clipboard.writeText(location.href);share.textContent="Link copied ✓";setTimeout(()=>share.textContent="Copy guide link",1600)}catch(e){share.textContent="Copy unavailable"}};
  const complete=article.querySelector(".guide-complete"); if(complete)complete.appendChild(share);const depth=document.createElement("section");
depth.className="guide-depth";
depth.innerHTML='<span class="tag">MASTER THE CONCEPT</span><h3>Do not stop at the definition.</h3><div class="depth-modes"><button type="button" data-mode="5">5 MIN</button><button type="button" data-mode="30">30 MIN</button><button type="button" data-mode="deep">DEEP DIVE</button></div><div class="depth-panel" id="depthPanel"><b>5 MIN</b><p>State what '+title+' means, what it measures, and one thing it does not tell you.</p></div><div class="depth-grid"><div><b>MENTAL MODEL</b><p>What is the economic or market mechanism underneath '+title+'?</p></div><div><b>RESEARCH QUESTION</b><p>What evidence would you need before using '+title+' in a real analysis?</p></div><div><b>FAILURE MODE</b><p>What could make the headline interpretation wrong?</p></div><div><b>CONNECTION</b><p>Which financial, valuation, risk or market concept changes how '+title+' should be interpreted?</p></div></div><div class="teach-back"><b>TEACH BACK</b><p>Explain '+title+' to an intelligent beginner in three sentences, without copying the guide.</p></div>';
article.insertBefore(depth,article.querySelector(".guide-complete"));const mastery=document.createElement("section");
mastery.className="guide-mastery";
const slug=(location.pathname.split("/").pop()||"").replace(".html","");
const map={};
map["pe-ratio"]={before:["stock-market-basics","financial-statements"],next:["historical-pe","peg-ratio","dcf"],mistake:"A low multiple is not automatically a low valuation.",check:"What would have to be true about growth, risk and cash generation for a low multiple to be justified?"};
map["roe"]={before:["balance-sheet","profit-growth"],next:["roce","roic","du-pont-analysis"],mistake:"A high return on equity can be produced by leverage.",check:"What happens to the interpretation of ROE when equity is very small?"};
map["dcf"]={before:["financial-statements","free-cash-flow","pe-ratio"],next:["sensitivity-analysis","scenario-analysis","terminal-value"],mistake:"A DCF is not a prediction of one precise future.",check:"Which assumptions contribute most to the valuation range?"};
map["balance-sheet"]={before:["stock-market-basics","financial-statements"],next:["working-capital","debt-to-equity","cash-flow-statement"],mistake:"A balance sheet is a snapshot, not a complete description of economic health.",check:"Which assets are actually liquid, and which may not realise their stated value?"};
map["cash-flow-statement"]={before:["financial-statements","balance-sheet"],next:["free-cash-flow","cash-conversion","working-capital"],mistake:"Positive cash flow does not automatically mean durable economics.",check:"Where did the cash come from, and is that source repeatable?"};
const meta=map[slug]||{before:["stock-market-basics"],next:["financial-statements","valuation","risk"],mistake:"A single metric rarely answers the whole research question.",check:"What evidence would you combine with this guide before reaching a conclusion?"};
mastery.innerHTML='<span class="tag">LEARNING ROUTE</span><h3>Know this before. Learn this next.</h3><div class="route-columns"><div><b>PREREQUISITES</b>'+meta.before.map(x=>'<a href="guides/'+x+'.html">'+x.replaceAll("-"," ")+' →</a>').join("")+'</div><div><b>THIS UNLOCKS</b>'+meta.next.map(x=>'<a href="guides/'+x+'.html">'+x.replaceAll("-"," ")+' →</a>').join("")+'</div></div><div class="route-warning"><b>COMMON MISREAD</b><p>'+meta.mistake+'</p><b>CHECK YOURSELF</b><p>'+meta.check+'</p></div>';
article.insertBefore(mastery,depth);
depth.querySelectorAll("[data-mode]").forEach(btn=>btn.onclick=()=>{
 depth.querySelectorAll("[data-mode]").forEach(x=>x.classList.remove("active"));btn.classList.add("active");
 const p=depth.querySelector("#depthPanel");
 p.innerHTML=btn.dataset.mode==="5"?"<b>5 MIN</b><p>Definition → mechanism → one limitation. Then explain it in one sentence.</p>":btn.dataset.mode==="30"?"<b>30 MIN</b><p>Definition → mechanism → fictional example → calculation → limitations → connections. Then answer the quick check without looking back.</p>":"<b>DEEP DIVE</b><p>Build a model, vary assumptions, compare explanations, find contradictory evidence, record sources and write what would change your mind.</p>";
});
depth.querySelector("[data-mode=30]").classList.add("active");
/* Contextual mini-lab: immediately manipulate the concept just learned. */
const labs=[{m:/DCF/i,k:"dcf",t:"Try the DCF yourself",d:"Change growth and discount rate to see why a precise-looking DCF can move dramatically.",f:[["Cash flow today","100"],["Growth %","8"],["Discount rate %","12"]]},{m:/P\/E/i,k:"pe",t:"See the P/E mechanics",d:"Change earnings growth or the future multiple and watch the implied price change.",f:[["EPS today","50"],["Growth %","15"],["Future P/E","18"]]},{m:/ROCE/i,k:"roce",t:"Make ROCE concrete",d:"Change operating profit and capital employed. The ratio is simple; the interpretation is not.",f:[["EBIT","120"],["Capital employed","600"]]},{m:/ROE/i,k:"roe",t:"Make ROE concrete",d:"Change profit and equity to see the return on shareholders' capital.",f:[["Net profit","100"],["Equity","500"]]}];const spec=labs.find(x=>x.m.test(title));if(spec){const box=document.createElement("section");box.className="guide-mini-lab";let h='<span class="tag">INTERACTIVE CHECK</span><h3>'+spec.t+'</h3><p>'+spec.d+'</p><div class="mini-lab-fields">';spec.f.forEach((f,i)=>h+='<label>'+f[0]+'<input type="number" step="0.1" value="'+f[1]+'" data-mini="'+i+'"></label>');h+='</div><div class="studio-result" id="guideLabResult"></div><p class="tool-note">Change one input at a time. The point is to understand sensitivity, not produce a prediction.</p>';box.innerHTML=h;article.insertBefore(box,article.querySelector(".guide-complete"));const calc=()=>{const v=[...box.querySelectorAll("input")].map(x=>Number(x.value));let out="";if(spec.k==="dcf"&&v[2]>v[1]){const tv=v[0]*(1+v[1]/100)/((v[2]-v[1])/100);out="Illustrative terminal value: ₹"+tv.toLocaleString("en-IN",{maximumFractionDigits:0})+" crore"}if(spec.k==="pe"){const eps=v[0]*Math.pow(1+v[1]/100,3),price=eps*v[2];out="Illustrative year-3 EPS: ₹"+eps.toFixed(2)+" · At "+v[2]+"×: ₹"+price.toFixed(2)+" per share"}if(spec.k==="roce"&&v[1]>0)out="ROCE: "+(v[0]/v[1]*100).toFixed(1)+"%";if(spec.k==="roe"&&v[1]>0)out="ROE: "+(v[0]/v[1]*100).toFixed(1)+"%";box.querySelector("#guideLabResult").textContent=out||"Use a discount rate above growth."};box.querySelectorAll("input").forEach(x=>x.addEventListener("input",calc));calc()}
})();

/* PirePoint Guide Depth Engine — turns a definition into a complete learning path. */
(function(){
  const article=document.querySelector("main article"); if(!article)return;
  const slug=(location.pathname.split("/").pop()||"").replace(".html","");
  const count=article.querySelectorAll("h2").length;
  const packs={
    "etf":{
      why:"You probably already know that an ETF is a basket traded on an exchange. The useful question is what happens between the basket's value and the price you actually pay.",
      model:"Think of an ETF as two things at once: a portfolio of assets and a security that trades on an exchange. The portfolio has a NAV; the security has a market price. Creation/redemption mechanisms and market makers usually help keep the two close, but they do not make the difference impossible.",
      mechanics:["The fund owns the underlying securities or follows its stated replication method.","NAV is calculated from the underlying portfolio; the exchange price moves continuously with buyers and sellers.","The spread, liquidity, tracking difference, costs, taxes and market structure all affect the return an investor actually experiences."],
      example:"Suppose an ETF's NAV is ₹100 and it trades at ₹101.50. You are paying a 1.5% premium to the stated NAV at that moment. That premium can disappear even if the underlying portfolio does not fall. For an international ETF, also consider the timing of overseas markets, currency moves and the quality of the intraday NAV reference.",
      advanced:"Do not judge an ETF only by headline expense ratio. Compare tracking difference over time, bid-ask spread, average trading quality, fund size, replication method, securities lending where relevant, cash drag and whether the quoted price is stale relative to the underlying market.",
      traps:["Confusing NAV with an executable price.","Using daily volume alone as a liquidity test; the spread and depth matter.","Assuming a low expense ratio guarantees low tracking difference.","Ignoring currency and market-hours effects in overseas ETFs."],
      checklist:["Underlying index/asset understood","NAV and market price checked","Premium/discount considered","Spread and depth checked","Tracking difference reviewed","Costs and tax treatment understood","Currency/market-hours risk considered"]
    },
    "rsi":{
      why:"The interesting part of RSI is not memorising 70 and 30. It is understanding what momentum is doing inside the trend you are already looking at.",
      model:"RSI compresses recent upward and downward price changes into a bounded momentum measure. A high reading means recent gains have been strong relative to recent losses; it does not mean price must fall.",
      mechanics:["RSI is commonly calculated over 14 periods, although other settings are possible.","Readings near the upper end indicate strong recent momentum; readings near the lower end indicate weak recent momentum.","In a strong trend, RSI can remain elevated or depressed for a long time. Divergence can be informative but is not a reversal guarantee."],
      example:"A stock can rise from ₹100 to ₹130 while RSI remains above 70 for several weeks. Calling it 'overbought, therefore sell' ignores trend strength. A more useful question is whether price structure, volume, earnings/news and RSI are telling a consistent story.",
      advanced:"Study RSI relative to regime. In persistent uptrends, pullbacks that hold a higher RSI floor can indicate stronger momentum than a one-off 70 reading. Compare divergence across meaningful swing highs/lows rather than tiny fluctuations.",
      traps:["Treating 70/30 as automatic buy/sell signals.","Ignoring the timeframe.","Calling every divergence a reversal.","Using RSI without a defined invalidation or position-size rule."],
      checklist:["Timeframe defined","Trend identified","Swing points selected","RSI setting known","Price structure checked","Volume/context checked","Invalidation defined"]
    },
    "sip":{
      why:"The part most people miss is that SIP describes the contribution method, not the quality of the investment. The fund, asset allocation and valuation still determine what you own.",
      model:"A SIP converts a lump-sum investment decision into a sequence of purchases. When the NAV is lower, a fixed rupee contribution buys more units; when it is higher, it buys fewer. This changes the path of purchases, not the underlying risk of the asset.",
      mechanics:["A fixed amount is scheduled at a chosen interval.","The contribution buys units at the applicable NAV and charges.","Your final result depends on the underlying investment return, contribution timing, costs, taxes and the time period."],
      example:"If ₹10,000 buys 100 units at ₹100 and the next ₹10,000 buys 125 units at ₹80, you own 225 units for ₹20,000. Your average purchase price is ₹88.89 per unit—not simply the arithmetic average of ₹100 and ₹80.",
      advanced:"Compare SIP with the alternative you actually face. If cash is already available, spreading a lump sum over time is a different decision from investing new monthly income. Evaluate expected opportunity cost, risk tolerance, valuation and asset allocation rather than treating SIP as a risk-control guarantee.",
      traps:["Believing SIP guarantees profit.","Thinking rupee-cost averaging makes an unsuitable fund suitable.","Ignoring total portfolio allocation.","Ignoring exit taxes, costs or the time horizon."],
      checklist:["Goal defined","Asset/fund understood","Risk level appropriate","Contribution amount sustainable","Time horizon defined","Portfolio allocation checked","Exit/tax implications understood"]
    },
    "esop":{
      why:"ESOP analysis matters because employee options can change the number of shares, the economics of compensation and the true per-share value you are buying.",
      model:"An option is a right to acquire shares under specified terms. Vesting controls when rights become available; exercise converts an option into shares when conditions are met. For investors, the key issue is the economic dilution and the cost of employee equity.",
      mechanics:["Read the grant/option pool, vesting schedule, exercise price and expiry.","Separate options outstanding from options actually exercised and shares already issued.","Consider diluted share count and the accounting treatment of share-based compensation when assessing earnings quality."],
      example:"If a company has 100 million shares and another 5 million potentially issuable options, a simple 100 million-share EPS calculation can overstate per-share economics if the options become dilutive. The exact diluted EPS calculation follows accounting rules and the option terms.",
      advanced:"Look at option grants as a recurring economic cost, not just a legal footnote. Compare dilution over several years, grant intensity relative to revenue/profit, exercise prices and whether buybacks merely offset employee issuance.",
      traps:["Looking only at current promoter/public shareholding.","Ignoring diluted shares.","Treating stock-based compensation as economically free.","Assuming every option will definitely dilute shares."],
      checklist:["Options outstanding reviewed","Vesting understood","Exercise price known","Diluted share count checked","SBC accounting reviewed","Historical dilution checked","Capital allocation considered"]
    },
    "macd":{
      why:"MACD becomes useful when you stop treating a crossover as a signal in isolation and start asking what it says about the relationship between short- and longer-term momentum.",
      model:"MACD is built from moving averages. The MACD line measures the gap between two exponential moving averages; the signal line smooths that gap; the histogram shows their difference.",
      mechanics:["A faster EMA reacts more quickly than a slower EMA.","MACD line = fast EMA minus slow EMA.","Signal line = EMA of the MACD line; histogram = MACD minus signal line.","Crossovers describe momentum changes, not guaranteed price reversals."],
      example:"If the faster EMA rises above the slower EMA, the MACD line moves higher. If the MACD line then crosses its signal line, short-term momentum relative to the smoothed MACD has changed. The meaning is different in a strong trend versus a range.",
      advanced:"Use MACD as a regime/context tool. Compare zero-line position, slope, price structure and volume. Repeated crossovers in a range can create noise; a crossover aligned with a structural breakout is a different setup.",
      traps:["Trading every crossover.","Ignoring the zero line and trend.","Assuming divergence guarantees reversal.","Stacking MACD with several other lagging indicators and mistaking redundancy for confirmation."],
      checklist:["Timeframe defined","Trend/regime identified","MACD settings known","Zero-line context checked","Price structure checked","Volume considered","Risk/invalidation defined"]
    },
    "moat":{
      why:"Knowing the phrase 'economic moat' is easy. The difficult part is proving that a supposed advantage actually produces durable economics and survives competition.",
      model:"A moat is not a brand slogan. It is a mechanism that makes it difficult for competitors to reproduce attractive returns. Common mechanisms include cost advantage, switching costs, network effects, intangible assets and efficient scale.",
      mechanics:["Identify the claimed advantage.","Explain why customers behave differently because of it.","Test whether the advantage appears in observable economics such as retention, pricing, margins, returns on capital or market position.","Test how a competitor, technology change or regulation could weaken it."],
      example:"A company may claim strong brand power, but if competitors can raise capacity and customers switch for small price differences, the brand may not protect economics. Evidence must connect the claimed moat to customer behaviour and financial outcomes.",
      advanced:"Ask whether the moat is widening, stable or eroding. A high ROCE today is evidence of historical economics, not proof of future protection. Examine reinvestment requirements and whether growth itself attracts competition.",
      traps:["Equating a famous brand with a moat.","Using high ROCE as proof rather than evidence.","Ignoring disruption.","Confusing market share with pricing power."],
      checklist:["Moat mechanism named","Customer behaviour evidence found","Financial evidence found","Competitor response considered","Erosion path identified","Reinvestment needs understood","Valuation kept separate"]
    },
    "futures-basics":{
      why:"The important part of futures is not the definition of a contract. It is understanding notional exposure, margin, daily cash flows and what happens when the market moves against you.",
      model:"A futures position gives exposure to an underlying with only a fraction of the notional value posted as margin. That leverage changes the percentage return on your capital—and the speed at which losses can consume it.",
      mechanics:["Contract size determines notional exposure.","Initial/maintenance margin requirements support the position.","Profit and loss is marked to market under the applicable exchange process.","Expiry, rollover, basis and settlement rules determine how the position ends."],
      example:"If a contract represents ₹5,00,000 of exposure and your margin is ₹1,00,000, a 2% adverse move in the underlying is roughly ₹10,000 before other effects—10% of the margin capital. The leverage is the point; the margin is not the maximum possible loss.",
      advanced:"Study basis, calendar spreads, rollover costs, liquidity, open interest and settlement mechanics. A futures price can differ from spot because of financing, dividends, carrying costs and market expectations.",
      traps:["Treating margin as the amount at risk.","Ignoring expiry and rollover.","Ignoring gap risk.","Sizing from contract count instead of rupee risk."],
      checklist:["Notional exposure known","Margin requirements known","Maximum planned loss defined","Expiry/settlement understood","Liquidity checked","Rollover/basis considered","Position size tied to risk"]
    },
    "options-basics":{
      why:"Options are not simply leveraged versions of shares. Their value depends on direction, strike, time, volatility and the interaction between them.",
      model:"A call gives the buyer a right to buy under the contract; a put gives a right to sell. The buyer pays a premium for that right. The seller receives the premium but takes on the contractual obligation if exercised/assigned under the applicable rules.",
      mechanics:["Strike price defines the contractual reference level.","Premium is the option's market price.","Intrinsic value reflects immediate exercise value; time value is the remaining premium above intrinsic value.","Expiry, implied volatility, time decay and changes in the underlying all affect option value."],
      example:"A ₹100 call bought for ₹8 has a ₹108 break-even at expiry, ignoring transaction costs and contract details. If the underlying is ₹103 at expiry, the call's intrinsic value is ₹3, so the buyer has lost ₹5 relative to the ₹8 premium.",
      advanced:"Learn delta, gamma, theta and vega as sensitivity measures. Then study implied volatility versus realised volatility, skew, open interest, liquidity and assignment/settlement mechanics. A correct directional view can still lose money if timing or volatility is wrong.",
      traps:["Looking only at direction.","Ignoring time decay.","Assuming option premium is cheap because the share price is far away.","Ignoring spread/liquidity.","Selling options without understanding tail risk and margin."],
      checklist:["Call/put role understood","Strike and expiry known","Premium known","Break-even calculated","Time decay considered","Volatility considered","Maximum loss/risk defined"]
    },
    "technical-analysis":{
      why:"The useful skill is not memorising patterns. It is learning how price structure, trend, volume, volatility and risk fit together—and where the method stops being informative.",
      model:"Technical analysis is a framework for describing market behaviour. A chart is evidence about price and volume, not a guarantee about the future.",
      mechanics:["Start with timeframe and market structure.","Mark meaningful highs, lows, ranges and support/resistance zones.","Use volume and volatility to judge participation and movement quality.","Use indicators as transformations of price/volume rather than independent facts.","Define invalidation and position size before entry."],
      example:"A breakout above ₹500 means more when price closes decisively above a well-tested range and participation expands than when price briefly trades at ₹501 and immediately returns inside the range. The distinction is structure plus context, not a magic candle.",
      advanced:"Separate signal generation from risk management. Test rules over historical data, include transaction costs/slippage, avoid look-ahead bias and distinguish a visually convincing chart from a statistically tested edge.",
      traps:["Treating patterns as certainties.","Changing rules after seeing the outcome.","Ignoring costs and liquidity.","Using too many indicators.","Confusing correlation with causation."],
      checklist:["Timeframe defined","Structure mapped","Levels identified","Volume considered","Volatility considered","Entry rule explicit","Invalidation explicit","Position size calculated","Rules tested"]
    }
  };

  function genericPack(){
    const t=document.querySelector("main h1")?.textContent?.replace(/—.*$/,"").trim()||"this topic";
    const d=document.querySelector('meta[name="description"]')?.content||"";
    return {
      why:"If you already know the definition, the useful part is what the definition lets you do—and what it still cannot tell you.",
      model:"Build a mental model before memorising formulas: identify the inputs, the mechanism that connects them, the output, and the decisions the output can inform.",
      mechanics:["Define the concept in one sentence and identify its inputs.","Trace how a change in each important input changes the result.","Separate the measured/calculated fact from the interpretation placed on it.","Connect the concept to the next decision rather than treating it as an isolated number."],
      example:"Create a small example with round numbers, calculate it yourself, then change one assumption at a time. If the conclusion changes easily, the concept is sensitive and should not be treated as a single-point answer.",
      advanced:"Ask which assumptions are hidden, which alternative explanations fit the same evidence, how the measure behaves in different business or market regimes, and what additional evidence would change your interpretation.",
      traps:["Memorising a threshold without understanding the mechanism.","Using one metric without its denominator or context.","Confusing correlation with causation.","Treating a historical relationship as a guarantee.","Ignoring the time period and source of the data."],
      checklist:["Definition understood","Formula/inputs understood","Worked example completed","Context identified","Limitations understood","Alternative interpretation considered","Source/date checked","Next question identified"]
    };
  }
  const pack=packs[slug]||genericPack();
  const advanced=count<8;
  const box=document.createElement("section");
  box.className="guide-depth";
  box.innerHTML='<div class="guide-depth-head"><span class="tag">'+(advanced?"GO BEYOND THE DEFINITION":"EXPERT LAYER")+'</span><h2 id="go-deeper">The part most people miss</h2><p>'+pack.why+'</p></div>'+
    '<div class="guide-depth-grid">'+
    '<section><span class="depth-label">MENTAL MODEL</span><h3>How to think about it</h3><p>'+pack.model+'</p></section>'+
    '<section><span class="depth-label">MECHANICS</span><h3>How it actually works</h3><ol>'+pack.mechanics.map(x=>'<li>'+x+'</li>').join("")+'</ol></section>'+
    '<section><span class="depth-label">WORKED EXAMPLE</span><h3>Put it into numbers</h3><p>'+pack.example+'</p></section>'+
    '<section><span class="depth-label">ADVANCED INTERPRETATION</span><h3>Where experts look next</h3><p>'+pack.advanced+'</p></section>'+
    '</div>'+
    '<section class="depth-traps"><span class="depth-label">FAILURE MODES</span><h3>What can fool you</h3><ul>'+pack.traps.map(x=>'<li>'+x+'</li>').join("")+'</ul></section>'+
    '<section class="depth-check"><span class="depth-label">LEAVE WITH THIS</span><h3>Practical checklist</h3><div class="depth-checklist">'+pack.checklist.map(x=>'<label><input type="checkbox"> '+x+'</label>').join("")+'</div></section>';
  const complete=article.querySelector(".guide-complete");
  if(complete) article.insertBefore(box,complete); else article.appendChild(box);

  // Remove a generator artefact that previously appeared as a literal "undefined".
  [...article.querySelectorAll("p")].forEach(p=>{if(p.textContent.trim()==="undefined")p.remove()});
})();
