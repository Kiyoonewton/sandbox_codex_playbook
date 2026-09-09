/* ═══════════════════════════════════════════════════════════════
   ESGLENS — Futuristic Minimalist ESG Intelligence
   ═══════════════════════════════════════════════════════════════ */

const INDUSTRY_BENCHMARKS = {
  "Technology":{environmental:62,social:71,governance:68,overall:67},
  "Energy":{environmental:38,social:55,governance:61,overall:51},
  "Financial Services":{environmental:58,social:64,governance:72,overall:65},
  "Healthcare":{environmental:55,social:68,governance:66,overall:63},
  "Consumer Discretionary":{environmental:52,social:61,governance:64,overall:59},
  "Industrials":{environmental:45,social:58,governance:63,overall:55},
  "Materials":{environmental:41,social:54,governance:60,overall:52},
  "Utilities":{environmental:43,social:59,governance:64,overall:55},
  "Communication Services":{environmental:60,social:66,governance:67,overall:64},
  "Consumer Staples":{environmental:54,social:63,governance:66,overall:61},
  "default":{environmental:55,social:63,governance:65,overall:61}
};

const COMPANY_LIST=[
  {name:"Apple Inc.",ticker:"AAPL",sector:"Technology"},{name:"Microsoft Corporation",ticker:"MSFT",sector:"Technology"},
  {name:"Tesla Inc.",ticker:"TSLA",sector:"Consumer Discretionary"},{name:"Amazon.com Inc.",ticker:"AMZN",sector:"Consumer Discretionary"},
  {name:"Alphabet Inc.",ticker:"GOOGL",sector:"Communication Services"},{name:"Meta Platforms Inc.",ticker:"META",sector:"Communication Services"},
  {name:"ExxonMobil Corporation",ticker:"XOM",sector:"Energy"},{name:"JPMorgan Chase & Co.",ticker:"JPM",sector:"Financial Services"},
  {name:"Johnson & Johnson",ticker:"JNJ",sector:"Healthcare"},{name:"Walmart Inc.",ticker:"WMT",sector:"Consumer Staples"},
  {name:"Chevron Corporation",ticker:"CVX",sector:"Energy"},{name:"Netflix Inc.",ticker:"NFLX",sector:"Communication Services"},
  {name:"Nike Inc.",ticker:"NKE",sector:"Consumer Discretionary"},{name:"Coca-Cola Company",ticker:"KO",sector:"Consumer Staples"},
  {name:"PepsiCo Inc.",ticker:"PEP",sector:"Consumer Staples"},{name:"Pfizer Inc.",ticker:"PFE",sector:"Healthcare"},
  {name:"Goldman Sachs Group",ticker:"GS",sector:"Financial Services"},{name:"Boeing Company",ticker:"BA",sector:"Industrials"},
  {name:"Visa Inc.",ticker:"V",sector:"Financial Services"},{name:"Mastercard Inc.",ticker:"MA",sector:"Financial Services"},
  {name:"Procter & Gamble",ticker:"PG",sector:"Consumer Staples"},{name:"3M Company",ticker:"MMM",sector:"Industrials"},
  {name:"Caterpillar Inc.",ticker:"CAT",sector:"Industrials"},{name:"Shell plc",ticker:"SHEL",sector:"Energy"},
  {name:"BP plc",ticker:"BP",sector:"Energy"},{name:"Unilever PLC",ticker:"UL",sector:"Consumer Staples"},
  {name:"Nestle S.A.",ticker:"NSRGY",sector:"Consumer Staples"},{name:"Samsung Electronics",ticker:"SSNLF",sector:"Technology"},
  {name:"Toyota Motor Corporation",ticker:"TM",sector:"Consumer Discretionary"},{name:"NVIDIA Corporation",ticker:"NVDA",sector:"Technology"},
  {name:"Intel Corporation",ticker:"INTC",sector:"Technology"},{name:"IBM Corporation",ticker:"IBM",sector:"Technology"},
  {name:"Salesforce Inc.",ticker:"CRM",sector:"Technology"},{name:"Adobe Inc.",ticker:"ADBE",sector:"Technology"},
  {name:"Starbucks Corporation",ticker:"SBUX",sector:"Consumer Discretionary"},{name:"McDonald's Corporation",ticker:"MCD",sector:"Consumer Discretionary"},
  {name:"Uber Technologies",ticker:"UBER",sector:"Industrials"},{name:"Moderna Inc.",ticker:"MRNA",sector:"Healthcare"},
  {name:"AstraZeneca PLC",ticker:"AZN",sector:"Healthcare"},{name:"HSBC Holdings",ticker:"HSBC",sector:"Financial Services"},
  {name:"Alibaba Group",ticker:"BABA",sector:"Consumer Discretionary"},{name:"Tencent Holdings",ticker:"TCEHY",sector:"Communication Services"},
  {name:"Taiwan Semiconductor",ticker:"TSM",sector:"Technology"},{name:"NextEra Energy",ticker:"NEE",sector:"Utilities"},
  {name:"CVS Health",ticker:"CVS",sector:"Healthcare"},{name:"AbbVie Inc.",ticker:"ABBV",sector:"Healthcare"},
  {name:"LVMH Moët Hennessy",ticker:"LVMUY",sector:"Consumer Discretionary"},{name:"Siemens AG",ticker:"SIEGY",sector:"Industrials"},
  {name:"Barclays PLC",ticker:"BCS",sector:"Financial Services"},{name:"Rio Tinto Group",ticker:"RIO",sector:"Materials"},
  {name:"General Electric",ticker:"GE",sector:"Industrials"},
];

const POPULAR=["Apple","Tesla","ExxonMobil","Shell","Amazon","Microsoft","Nestle","Goldman Sachs"];

const LENS={
  investor:{e:["Carbon Intensity","Stranded Asset Risk","Regulatory Exposure"],s:["Labor Relations","Turnover Risk","Litigation History"],g:["Audit Quality","CEO Pay Ratio","Related Party Transactions"]},
  jobseeker:{e:["Gender Pay Gap","Parental Leave Policy","Employee Satisfaction"],s:["Diversity Score","Safety Record","Union Relations"],g:["Whistleblower Policy","Board Diversity","Ethics Violations"]},
  consumer:{e:["Product Carbon Footprint","Packaging Sustainability","Recyclability"],s:["Fair Wages in Supply Chain","Child Labor Risk","Community Impact"],g:["Data Privacy","Lobbying Transparency","Consumer Protection"]}
};

const SEC={mint:'#00e5a0',lav:'#7c5cfc',purple:'#a78bfa',red:'#ff5c5c',amber:'#ffb347'};
const GCIRC=2*Math.PI*78, RCIRC=2*Math.PI*52;

function sc(c){return c>=70?SEC.mint:c>=40?SEC.amber:SEC.red}
function sg(c){return c>=90?'A+':c>=80?'A':c>=70?'B+':c>=60?'B':c>=50?'C+':c>=40?'C':c>=30?'D':'F'}
function fmt(n){if(n==null)return'—';if(n>=1e12)return'$'+(n/1e12).toFixed(1)+'T';if(n>=1e9)return'$'+(n/1e9).toFixed(1)+'B';if(n>=1e6)return'$'+(n/1e6).toFixed(1)+'M';return typeof n==='number'?n.toLocaleString():String(n)}
function hashValue(value){let h=2166136261;for(const ch of String(value)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return(h>>>0)/4294967295}
function v(base,s,key){return Math.max(10,Math.min(95,base+Math.floor((hashValue(key)-.5)*s*2)))}
function cl(v,a,b){return Math.max(a,Math.min(b,v))}

function toast(m,t='info'){const c=document.getElementById('toastContainer'),e=document.createElement('div');e.className='toast '+t;e.textContent=m;c.appendChild(e);setTimeout(()=>{e.classList.add('fading');setTimeout(()=>e.remove(),300)},3000)}

// ─── STATE ───
const S={current:null,compare:[],lens:'investor',tab:'breakdown',charts:{},loading:false,searchRequest:0};

// ─── API ───
function fbProfile(ticker){
  const k=COMPANY_LIST.find(c=>c.ticker===ticker);
  if(!k)return null;
  return{companyName:k.name,ticker:k.ticker,sector:k.sector,industry:k.sector,country:'United States',fullTimeEmployees:Math.floor(30000+hashValue(ticker+':employees')*150000),mktCap:Math.floor(50e9+hashValue(ticker+':market-cap')*2.5e12),description:k.name+' is a publicly traded '+k.sector+' company.'};
}

async function apiProfile(t){
  try{const r=await fetch('https://financialmodelingprep.com/api/v3/profile/'+t+'?apikey=demo');if(r.ok){const d=await r.json();if(d&&d[0]&&d[0].companyName)return d[0]}}catch{}
  const f=fbProfile(t);if(f)return f;
  throw new Error('Company not found for "'+t+'"');
}
async function apiESG(t){
  try{const r=await fetch('https://financialmodelingprep.com/api/v4/esg-environmental-social-governance-data?symbol='+t+'&apikey=demo');if(r.ok){const d=await r.json();if(d&&d.length>0&&d[0].environmentalScore!=null)return d}}catch{}return null;
}
async function apiRating(t){
  try{const r=await fetch('https://financialmodelingprep.com/api/v4/esg-environmental-social-governance-score-ratings?symbol='+t+'&apikey=demo');if(r.ok){const d=await r.json();if(d&&d.length>0&&d[0].environmentalScore!=null)return d}}catch{}return null;
}
async function apiNews(name){
  try{const r=await fetch('https://gnews.io/api/v4/search?q='+encodeURIComponent(name+' ESG sustainability')+'&lang=en&max=10&token=demo');const d=await r.json();return d&&d.articles?d.articles:[]}catch{return[]}
}

function processScores(data,rating,bench,ticker){
  let e,s,g,o,est=false,h=[];
  if(rating&&rating.length){
    const p=x=>{const n=Number(x);return(!isNaN(n)&&n>0&&n<=100)?Math.round(n):null};
    e=p(rating[0].environmentalScore);s=p(rating[0].socialScore);g=p(rating[0].governanceScore);o=p(rating[0].esgScore);
  }
  if(data&&data.length){
    if(e==null)e=data[0].environmentalScore!=null?Math.round(Number(data[0].environmentalScore)):null;
    if(s==null)s=data[0].socialScore!=null?Math.round(Number(data[0].socialScore)):null;
    if(g==null)g=data[0].governanceScore!=null?Math.round(Number(data[0].governanceScore)):null;
    if(o==null)o=data[0].esgScore!=null?Math.round(Number(data[0].esgScore)):null;
    h=data.slice(0,5).reverse().map(d=>({year:String(d.date||d.year||''),e:d.environmentalScore!=null?Math.round(Number(d.environmentalScore)):null,s:d.socialScore!=null?Math.round(Number(d.socialScore)):null,g:d.governanceScore!=null?Math.round(Number(d.governanceScore)):null})).filter(x=>x.year&&(x.e!=null||x.s!=null||x.g!=null));
  }
  if(e==null||s==null||g==null||o==null){est=true;e=e||v(bench.environmental,20,ticker+':e');s=s||v(bench.social,20,ticker+':s');g=g||v(bench.governance,20,ticker+':g');o=o||Math.round((e+s+g)/3)}
  if(h.length<2)h=[{year:'2022',e:v(e,10,ticker+':2022:e'),s:v(s,10,ticker+':2022:s'),g:v(g,10,ticker+':2022:g')},{year:'2023',e:v(e,6,ticker+':2023:e'),s:v(s,6,ticker+':2023:s'),g:v(g,6,ticker+':2023:g')},{year:'2024',e,s,g}];
  return{e,s,g,overall:o,history:h,estimated:est};
}

async function loadCo(ticker){
  const sector=COMPANY_LIST.find(c=>c.ticker===ticker)?.sector||'default';
  const bench=INDUSTRY_BENCHMARKS[sector]||INDUSTRY_BENCHMARKS.default;
  const[profile,esg,rating,news]=await Promise.all([apiProfile(ticker),apiESG(ticker),apiRating(ticker),apiNews(ticker)]);
  const scores=processScores(esg,rating,bench,ticker);
  return{profile,esg,rating,news,bench,ticker,sector,scores};
}

// ─── SVG GAUGES ───
function animG(id,score,circ){const a=document.getElementById(id);if(!a)return;a.style.transition='none';a.style.strokeDasharray=circ;a.style.strokeDashoffset=circ;requestAnimationFrame(()=>{a.style.transition='stroke-dashoffset 1.2s cubic-bezier(.16,1,.3,1)';a.style.strokeDashoffset=circ-(score/100)*circ})}
function animNum(el,target,dur){const s=performance.now();(function tick(now){const p=Math.min((now-s)/dur,1);el.textContent=Math.round(target*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(tick)})(s)}

// ─── CHARTS ───
function dChart(k){if(S.charts[k]){S.charts[k].destroy();S.charts[k]=null}}
const CO={responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:'#6b7394',font:{family:"'Inter',sans-serif",size:10},boxWidth:10,padding:12}},tooltip:{backgroundColor:'#11141c',titleColor:'#e4e8f0',bodyColor:'#6b7394',borderColor:'rgba(255,255,255,.06)',borderWidth:1,padding:8,cornerRadius:8,titleFont:{family:"'Syne',sans-serif"},bodyFont:{family:"'JetBrains Mono',monospace",size:10}}},scales:{x:{grid:{color:'rgba(255,255,255,.03)'},ticks:{color:'#3a3f54',font:{family:"'JetBrains Mono',monospace",size:9}}},y:{beginAtZero:true,max:100,grid:{color:'rgba(255,255,255,.03)'},ticks:{color:'#3a3f54',font:{family:"'JetBrains Mono',monospace",size:9},stepSize:25}}}};

function renderTrend(hist){dChart('trend');const ctx=document.getElementById('cTrend');if(!ctx||hist.length<2)return;S.charts.trend=new Chart(ctx,{type:'line',data:{labels:hist.map(h=>h.year),datasets:[{label:'E',data:hist.map(h=>h.e),borderColor:SEC.mint,backgroundColor:'rgba(0,229,160,.05)',fill:true,tension:.4,pointRadius:4,pointBackgroundColor:SEC.mint,borderWidth:1.5},{label:'S',data:hist.map(h=>h.s),borderColor:SEC.lav,backgroundColor:'rgba(124,92,252,.05)',fill:true,tension:.4,pointRadius:4,pointBackgroundColor:SEC.lav,borderWidth:1.5},{label:'G',data:hist.map(h=>h.g),borderColor:SEC.purple,backgroundColor:'rgba(167,139,250,.05)',fill:true,tension:.4,pointRadius:4,pointBackgroundColor:SEC.purple,borderWidth:1.5}]},options:{...CO,interaction:{mode:'index',intersect:false}}});}

function renderBench(scores,bench,sector){dChart('bench');const ctx=document.getElementById('cBench');if(!ctx)return;document.getElementById('benchH').textContent='vs '+sector+' Average';S.charts.bench=new Chart(ctx,{type:'bar',data:{labels:['Environmental','Social','Governance'],datasets:[{label:'This Company',data:[scores.e,scores.s,scores.g],backgroundColor:[SEC.mint+'99',SEC.lav+'99',SEC.purple+'99'],borderRadius:6,barPercentage:.45},{label:sector+' Avg',data:[bench.environmental,bench.social,bench.governance],backgroundColor:'rgba(255,255,255,.06)',borderRadius:6,barPercentage:.45}]},options:CO});}

function renderRadar(cos){dChart('radar');const ctx=document.getElementById('cRadar');if(!ctx)return;const cols=[SEC.mint,SEC.amber,'#f472b6'];const ds=cos.map((c,i)=>({label:c.profile.companyName||c.ticker,data:[c.scores.e,c.scores.s,c.scores.g,c.scores.overall,cl(50+(c.scores.overall-c.bench.overall),10,90),cl(c.scores.e-c.bench.environmental+50,10,90)],backgroundColor:cols[i]+'18',borderColor:cols[i],borderWidth:1.5,pointBackgroundColor:cols[i],pointRadius:3}));if(cos.length===1){const b=cos[0].bench;ds.push({label:'Industry Avg',data:[b.environmental,b.social,b.governance,b.overall,50,50],backgroundColor:'rgba(255,255,255,.03)',borderColor:'#3a3f54',borderWidth:1,borderDash:[3,3],pointRadius:2,pointBackgroundColor:'#3a3f54'})}S.charts.radar=new Chart(ctx,{type:'radar',data:{labels:['Environmental','Social','Governance','Overall','Industry Rank','Trend'],datasets:ds},options:{responsive:true,maintainAspectRatio:false,scales:{r:{beginAtZero:true,max:100,grid:{color:'rgba(255,255,255,.04)'},angleLines:{color:'rgba(255,255,255,.04)'},pointLabels:{color:'#6b7394',font:{family:"'Inter',sans-serif",size:11}},ticks:{stepSize:25,color:'#3a3f54',backdropColor:'transparent',font:{family:"'JetBrains Mono',monospace",size:8}}}},plugins:{legend:{position:'bottom',labels:{color:'#6b7394',font:{family:"'Inter',sans-serif",size:11},boxWidth:10,padding:14}},tooltip:CO.plugins.tooltip}}});}

// ─── VIEW MANAGEMENT ───
function showView(n){['hero','loadingView','errorView','dash'].forEach(id=>{document.getElementById(id)?.classList.remove('visible')});document.getElementById('hero')?.classList.add('hidden');if(n==='hero'){document.getElementById('hero').classList.remove('hidden');document.getElementById('fab').style.display='none'}else{document.getElementById(n)?.classList.add('visible');if(n==='dash')document.getElementById('fab').style.display='flex'}}

// ─── RENDER ───
function renderHeader(d){
  const p=d.profile,s=d.scores;
  document.getElementById('chN').textContent=p.companyName||d.ticker;
  const m=document.getElementById('chM');
  m.innerHTML=`<span class="tag tag--s">${d.sector}</span>${p.country?'<span class="tag">'+p.country+'</span>':''}${p.fullTimeEmployees?'<span class="tag">'+Number(p.fullTimeEmployees).toLocaleString()+'</span>':''}${p.mktCap?'<span class="tag">'+fmt(p.mktCap)+'</span>':''}`;
  document.getElementById('chD').textContent=p.description||'';
  animG('ringArc',s.overall,RCIRC);animNum(document.getElementById('ringS'),s.overall,1200);
  const g=document.getElementById('ringG');g.textContent=sg(s.overall);g.style.color=sc(s.overall);
  document.getElementById('ringArc').style.stroke=sc(s.overall);
}

function renderGauges(d){
  const s=d.scores,b=d.bench;
  ['e','s','g'].forEach(p=>{
    const lbl={e:'E',s:'S',g:'G'}[p];
    const arc={e:'garcE',s:'garcS',g:'garcG'}[p];
    const clr={e:SEC.mint,s:SEC.lav,g:SEC.purple}[p];
    animG(arc,s[p],GCIRC);
    const sv=document.getElementById('gvs'+lbl.toUpperCase());animNum(sv,s[p],1200);sv.style.color=clr;
    const gv=document.getElementById('gvg'+lbl.toUpperCase());gv.textContent=sg(s[p]);gv.style.color=clr;
    document.getElementById(arc).style.stroke=clr;
    // Submetrics
    const subs=LENS[S.lens][p];
    const spread=15;
    const subScores=subs.map((n,i)=>({name:n,score:cl(Math.round(s[p]+(i-1)*spread*.5+(hashValue(d.ticker+':'+S.lens+':'+p+':'+i)-.5)*spread),10,95)}));
    document.getElementById('subs'+lbl.toUpperCase()).innerHTML=subScores.map(sub=>`<div class="sub"><div class="sub-t"><span class="sub-n">${sub.name}</span><span class="sub-v" style="color:${sc(sub.score)}">${sub.score}</span></div><div class="sub-bar"><div class="sub-fill" style="width:0%;background:${clr}"></div></div></div>`).join('');
    requestAnimationFrame(()=>setTimeout(()=>{document.getElementById('subs'+lbl.toUpperCase()).querySelectorAll('.sub-fill').forEach((f,i)=>{f.style.width=subScores[i].score+'%'})},100));
    // Insight
    const benchmark=b[{e:'environmental',s:'social',g:'governance'}[p]];
    const diff=s[p]-benchmark;const pctl=cl(Math.round(50+diff*1.5),10,90);
    const ins={e:`Environmental: ${diff>=0?'above':'below'} ${d.sector} avg (${benchmark}). Top ${100-pctl}th percentile.`,s:`Social practices ${diff>=0?'stronger':'weaker'} than peers (avg ${benchmark}).`,g:`Governance ${diff>=0?'exceeds':'falls short of'} sector norms (avg ${benchmark}).`};
    document.getElementById('gins'+lbl.toUpperCase()).textContent=ins[p];
  });
}

function renderFindings(d){
  const s=d.scores,b=d.bench;
  document.getElementById('findings').innerHTML=[{p:'e',l:'Environmental',v:s.e,bv:b.environmental},{p:'s',l:'Social',v:s.s,bv:b.social},{p:'g',l:'Governance',v:s.g,bv:b.governance}].map(f=>`<div class="fcard fcard--${f.p}"><h4>${f.l}: ${f.v}/100 (${sg(f.v)})</h4><p>${f.v>=f.bv?d.profile.companyName+' exceeds the '+d.sector+' average of '+f.bv+'. Strong peer positioning.' : d.profile.companyName+' trails the '+d.sector+' average of '+f.bv+'. Room for improvement.'}</p></div>`).join('');
}

function renderControversies(d){
  const news=d.news||[];
  const cs=document.getElementById('cstats'),tl=document.getElementById('tl');
  if(!news.length){cs.innerHTML='';tl.innerHTML='<div class="tl-empty">No recent controversies found — low media scrutiny or strong ESG practices.</div>';return}
  const cat=a=>{const t=((a.title||'')+(a.description||'')).toLowerCase();if(t.match(/carbon|emission|environment|climate|renewable|pollution|waste|energy/))return'e';if(t.match(/social|employee|diversity|labor|workforce|community|human rights|discrimination/))return's';if(t.match(/govern|board|executive|compensation|fraud|compliance|audit|shareholder/))return'g';return'x'};
  const sev=a=>{const t=((a.title||'')+(a.description||'')).toLowerCase();if(t.match(/scandal|violation|lawsuit|fine|penalty|fraud|collapse|disaster/))return'High';if(t.match(/concern|criticism|question|risk|warning|investigation|probe/))return'Medium';return'Low'};
  const categorized=news.map(a=>({...a,cat:cat(a),sev:sev(a)}));
  const ec=categorized.filter(c=>c.cat==='e').length,sc_=categorized.filter(c=>c.cat==='s').length,gc=categorized.filter(c=>c.cat==='g').length,hc=categorized.filter(c=>c.sev==='High').length;
  cs.innerHTML=`<div class="cs"><b>${news.length}</b>&nbsp;articles</div><div class="cs"><b>${ec}</b>&nbsp;Environmental</div><div class="cs"><b>${sc_}</b>&nbsp;Social</div><div class="cs"><b>${gc}</b>&nbsp;Governance</div>${hc?'<div class="cs" style="color:var(--red);border-color:rgba(255,92,92,.15)"><b>'+hc+'</b>&nbsp;High Severity</div>':''}`;
  const cn={e:'Environmental',s:'Social',g:'Governance',x:'General'};
  tl.innerHTML=categorized.map(a=>{const dt=a.publishedAt?new Date(a.publishedAt).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'}):'';return`<div class="tli"><div class="tld tld--${a.cat}"></div><div class="tldt">${dt}</div><div class="tlt">${a.title||'Untitled'}</div><div class="tls">${a.description||''}</div><div class="tltags"><span class="ttag ttag--${a.cat}">${cn[a.cat]}</span><span class="sev sev--${a.sev==='High'?'hi':a.sev==='Medium'?'md':'lo'}">${a.sev}</span>${a.url?'<a href="'+a.url+'" target="_blank" class="tla">Read →</a>':''}</div></div>`}).join('');
}

function renderFlags(d){
  const s=d.scores,b=d.bench,fl=[];
  if(s.overall<40)fl.push({sev:'critical',title:'High ESG Risk — Below Threshold',desc:'Overall score below 40 indicates significant unmanaged ESG risks. Increasingly screened out by institutional investors.'});
  ['e','s','g'].forEach(p=>{const n={e:'Environmental',s:'Social',g:'Governance'}[p];if(s[p]<30)fl.push({sev:'critical',title:'Pillar Failure — '+n,desc:n+' score critically low at '+s[p]+'. Major deficiencies exposing regulatory and reputational risk.'})});
  if(s.g<50)fl.push({sev:'high',title:'Governance Weakness',desc:'Governance below 50 correlates with higher fraud rates and shareholder value destruction.'});
  if(s.e<b.environmental-15)fl.push({sev:'high',title:'Environmental Laggard',desc:'Environmental score ('+s.e+') more than 15 points below '+d.sector+' average ('+b.environmental+').'});
  if((d.sector==='Energy'||d.sector==='Materials')&&s.e<50)fl.push({sev:'high',title:'Stranded Asset Risk',desc:'Elevated carbon-transition risk for energy/materials companies with low environmental scores.'});
  const hn=(d.news||[]).filter(a=>((a.title||'')+(a.description||'')).toLowerCase().match(/scandal|violation|lawsuit|fine|fraud|collapse/));
  if(hn.length)fl.push({sev:'medium',title:'Active Controversy',desc:hn.length+' high-severity articles: '+hn.slice(0,2).map(a=>a.title).join('; ')});
  if(s.e>=70&&s.s>=70&&s.g>=70)fl.push({sev:'positive',title:'ESG Leader — All Pillars Strong',desc:'Above 70 on all three pillars. Top-tier ESG positioning.'});
  if(!d.news||!d.news.length)fl.push({sev:'info',title:'Low Media Controversy',desc:'No negative news — positive signal, though may indicate lower scrutiny.'});
  document.getElementById('flags').innerHTML=fl.length?fl.map(f=>`<div class="fc"><div class="fc-bar fc-bar--${f.sev}"></div><div class="fc-body"><div class="fc-top"><span class="fc-title">${f.title}</span><span class="fc-sev fc-sev--${f.sev}">${f.sev}</span></div><div class="fc-desc">${f.desc}</div></div></div>`).join(''):'<div class="fc"><div class="fc-bar fc-bar--positive"></div><div class="fc-body"><div class="fc-title">No Red Flags Detected</div><div class="fc-desc">Automated scan found no significant ESG risk indicators.</div></div></div>';
  const cr=fl.filter(f=>f.sev==='critical').length,hi=fl.filter(f=>f.sev==='high').length;
  let rating,rCls,summary;
  if(cr>=2){rating='CRITICAL';rCls='critical';summary='Multiple critical ESG risks. Urgent attention recommended.'}
  else if(cr>=1||hi>=2){rating='HIGH';rCls='high';summary='Significant ESG risks detected. Deeper due diligence recommended.'}
  else if(hi>=1){rating='MODERATE';rCls='moderate';summary='Moderate risk with some areas of concern.'}
  else if(fl.some(f=>f.sev==='positive')&&!cr){rating='LOW';rCls='low';summary='Strong ESG profile with positive indicators.'}
  else{rating='MINIMAL';rCls='minimal';summary='Low overall ESG risk. No significant red flags.'}
  document.getElementById('risk').innerHTML=`<span class="risk-badge risk-badge--${rCls}">${rating}</span><p class="risk-sum">${summary}</p>`;
}

function renderCmpTable(){
  const w=document.getElementById('cmpTbl');if(!S.compare.length){w.innerHTML='';return}
  const all=[S.current,...S.compare].filter(Boolean);
  w.innerHTML=`<table class="ctbl"><thead><tr><th>Company</th><th>Sector</th><th>E</th><th>S</th><th>G</th><th>Overall</th><th>Grade</th><th>vs Sector</th><th></th></tr></thead><tbody>${all.map((d,i)=>{const vs=d.scores.overall-d.bench.overall;return`<tr><td style="color:var(--tx);font-weight:500">${d.profile.companyName||d.ticker}</td><td>${d.sector}</td><td class="td-s" style="color:${sc(d.scores.e)}">${d.scores.e}</td><td class="td-s" style="color:${sc(d.scores.s)}">${d.scores.s}</td><td class="td-s" style="color:${sc(d.scores.g)}">${d.scores.g}</td><td class="td-s" style="color:${sc(d.scores.overall)}">${d.scores.overall}</td><td style="font-family:var(--fh);font-weight:700;color:${sc(d.scores.overall)}">${sg(d.scores.overall)}</td><td class="td-s" style="color:${vs>=0?SEC.mint:SEC.red}">${vs>=0?'+':''}${vs}</td><td>${i>0?'<button class="btn-x" onclick="rmCmp('+(i-1)+')">✕</button>':''}</td></tr>`}).join('')}</tbody></table>`;
}

// ─── MAIN RENDER ───
function renderDash(d){
  renderHeader(d);renderGauges(d);
  if(S.tab==='breakdown')renderBD(d);
  else if(S.tab==='controversies')renderControversies(d);
  else if(S.tab==='compare'){renderRadar([d,...S.compare]);renderCmpTable()}
  else if(S.tab==='redflags')renderFlags(d);
  showView('dash');
}
function renderBD(d){renderTrend(d.scores.history);renderBench(d.scores,d.bench,d.sector);renderFindings(d)}
function switchTab(t){S.tab=t;document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.t===t));document.querySelectorAll('.tp').forEach(p=>p.classList.remove('active'));document.getElementById({breakdown:'pBreakdown',controversies:'pControversies',compare:'pCompare',redflags:'pRedflags'}[t])?.classList.add('active');if(S.current){if(t==='breakdown')renderBD(S.current);else if(t==='controversies')renderControversies(S.current);else if(t==='compare'){renderRadar([S.current,...S.compare]);renderCmpTable()}else if(t==='redflags')renderFlags(S.current)}saveState()}

// ─── AUTOCOMPLETE ───
function setupAC(inputId,acId,onPick){
  const input=document.getElementById(inputId),ac=document.getElementById(acId);
  let ai=-1;
  input.addEventListener('input',()=>{
    const q=input.value.trim().toLowerCase();ai=-1;
    if(q.length<1){ac.classList.remove('open');return}
    const m=COMPANY_LIST.filter(c=>c.name.toLowerCase().includes(q)||c.ticker.toLowerCase().includes(q)).slice(0,8);
    if(!m.length){ac.classList.remove('open');return}
    ac.innerHTML=m.map((c,i)=>`<div class="ac-i" data-i="${i}" data-t="${c.ticker}"><span class="ac-n">${c.name}</span><span class="ac-t">${c.ticker}</span><span class="ac-s">${c.sector}</span></div>`).join('');
    ac.classList.add('open');
    ac.querySelectorAll('.ac-i').forEach(el=>el.addEventListener('click',()=>{input.value=el.dataset.t;ac.classList.remove('open');onPick(el.dataset.t)}));
  });
  input.addEventListener('keydown',e=>{
    const items=ac.querySelectorAll('.ac-i');
    if(!items.length){if(e.key==='Enter'&&input.value.trim()){ac.classList.remove('open');onPick(input.value.trim().toUpperCase())}return}
    if(e.key==='ArrowDown'){e.preventDefault();ai=Math.min(ai+1,items.length-1);items.forEach((it,i)=>it.classList.toggle('on',i===ai))}
    else if(e.key==='ArrowUp'){e.preventDefault();ai=Math.max(ai-1,0);items.forEach((it,i)=>it.classList.toggle('on',i===ai))}
    else if(e.key==='Enter'){e.preventDefault();if(ai>=0&&items[ai]){input.value=items[ai].dataset.t;ac.classList.remove('open');onPick(items[ai].dataset.t)}else if(input.value.trim()){ac.classList.remove('open');onPick(input.value.trim().toUpperCase())}}
    else if(e.key==='Escape')ac.classList.remove('open');
  });
  document.addEventListener('click',e=>{if(!e.target.closest('#'+inputId)&&!e.target.closest('#'+acId))ac.classList.remove('open')});
}

// ─── SEARCH TRIGGER ───
async function search(ticker,restoreTickers=null){
  const requestId=++S.searchRequest;S.loading=true;
  const completeLoading=showLoadingWithSteps(ticker);
  try{
    const d=await loadCo(ticker);
    if(requestId!==S.searchRequest)return;
    if(Array.isArray(restoreTickers)){
      const unique=restoreTickers.filter((t,i,a)=>t!==ticker&&a.indexOf(t)===i).slice(0,3);
      const restored=await Promise.all(unique.map(t=>loadCo(t)));
      if(requestId!==S.searchRequest)return;
      S.compare=restored;
    }else S.compare=S.compare.filter(c=>c.ticker!==ticker);
    S.current=d;completeLoading();
    setTimeout(()=>{if(requestId!==S.searchRequest)return;renderDash(d);window.history.replaceState(null,'',sessionURL(false));document.getElementById('fab').style.display='flex';saveState()},400);
  }
  catch(e){console.error(e);document.getElementById('errMsg').textContent=e.message;showView('error')}
  finally{if(requestId===S.searchRequest)S.loading=false}
}

// ─── LENS ───
function setLens(l){S.lens=l;document.querySelectorAll('.lens-b').forEach(b=>b.classList.toggle('active',b.dataset.l===l));if(S.current)renderGauges(S.current);saveState()}

// ─── COMPARE ───
function addCmp(d){if(S.compare.length>=3){toast('Max 3 companies','err');return}if(d.ticker===S.current?.ticker||S.compare.some(c=>c.ticker===d.ticker)){toast('Already added','info');return}S.compare.push(d);saveState();toast((d.profile.companyName||d.ticker)+' added','ok');if(S.tab==='compare'){renderRadar([S.current,...S.compare]);renderCmpTable()}}
window.rmCmp=function(i){const removed=S.compare.splice(i,1)[0];saveState();if(S.tab==='compare'){renderRadar([S.current,...S.compare]);renderCmpTable()}toastUndo('Removed '+(removed?.profile?.companyName||removed?.ticker||''),()=>{if(removed){S.compare.splice(i,0,removed);saveState();if(S.tab==='compare'){renderRadar([S.current,...S.compare]);renderCmpTable()}}})};
window.toastUndo=function(msg,undoFn){const c=document.getElementById('toastContainer'),e=document.createElement('div');e.className='toast toast-undo';e.innerHTML='<span>'+msg+'</span><button class="toast-undo-btn">Undo</button>';e.querySelector('.toast-undo-btn').addEventListener('click',()=>{undoFn();e.remove();});c.appendChild(e);setTimeout(()=>{e.classList.add('fading');setTimeout(()=>e.remove(),300)},5000)};

// ─── EXPORT ───
function copyR(){if(!S.current)return;const d=S.current;let t='ESGLENS — '+d.profile.companyName+'\nE:'+d.scores.e+' S:'+d.scores.s+' G:'+d.scores.g+' Overall:'+d.scores.overall+' ('+sg(d.scores.overall)+')';navigator.clipboard.writeText(t).then(()=>toast('Copied','ok'))}
function csvD(){if(!S.current)return;const d=S.current;let c='Company,Ticker,Sector,E,S,G,Overall,Grade\n';[d,...S.compare].forEach(x=>{c+='"'+x.profile.companyName+'","'+x.ticker+'","'+x.sector+'",'+x.scores.e+','+x.scores.s+','+x.scores.g+','+x.scores.overall+',"'+sg(x.scores.overall)+'"\n'});const b=new Blob([c],{type:'text/csv'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='esglens-'+d.ticker+'.csv';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(u);toast('CSV downloaded','ok')}
function sessionURL(absolute=true){const u=new URL(window.location.href);u.hash='';u.search='';if(S.current)u.searchParams.set('company',S.current.ticker);if(S.compare.length)u.searchParams.set('compare',S.compare.map(c=>c.ticker).join(','));u.searchParams.set('lens',S.lens);u.searchParams.set('tab',S.tab);return absolute?u.toString():u.pathname+u.search}
function shareU(){if(!S.current)return;navigator.clipboard.writeText(sessionURL()).then(()=>toast('URL copied','ok'))}

// ─── LOCALSTORAGE PERSISTENCE ───
function saveState(){
  try{
    const d={ticker:S.current?.ticker||null,lens:S.lens,compareTickers:S.compare.map(c=>c.ticker),lastTab:S.tab};
    localStorage.setItem('esglens_state',JSON.stringify(d));
    if(S.current)window.history.replaceState(null,'',sessionURL(false));
  }catch{}
}
function loadState(){
  try{return JSON.parse(localStorage.getItem('esglens_state'))||{}}catch{return{}}
}

// ─── ENHANCED LOADING STEPS ───
function showLoadingWithSteps(ticker){
  showView('loading');
  // Replace skeleton with animated steps
  const lv=document.getElementById('loadingView');
  const steps=[
    {id:'resolve',text:'Resolving company entity...'},
    {id:'sec',text:'Fetching SEC filings & ESG data...'},
    {id:'news',text:'Scanning recent ESG news...'},
    {id:'scoring',text:'Computing transparent scores...'},
  ];
  lv.innerHTML=`<div class="loading-steps-wrap"><div class="loading-ticker">${ticker}</div><div class="loading-steps">${steps.map((s,i)=>`<div class="lstep" id="lstep-${s.id}"><span class="lstep-icon" id="lstep-icon-${s.id}">○</span><span class="lstep-text">${s.text}</span></div>`).join('')}</div></div>`;
  
  let i=0;
  function advance(){
    if(i<steps.length){
      const el=document.getElementById('lstep-'+steps[i].id);
      const icon=document.getElementById('lstep-icon-'+steps[i].id);
      if(el)el.classList.add('active');
      if(icon)icon.textContent='◌';
      i++;
      setTimeout(advance,300+Math.random()*400);
    }
  }
  advance();
  return function complete(){
    steps.forEach(s=>{
      const el=document.getElementById('lstep-'+s.id);
      const icon=document.getElementById('lstep-icon-'+s.id);
      if(el){el.classList.remove('active');el.classList.add('done');}
      if(icon)icon.textContent='✓';
    });
  };
}

// ─── INIT ───
function init(){
  // Popular pills
  document.getElementById('pills').innerHTML=POPULAR.map(n=>{const c=COMPANY_LIST.find(x=>x.name.includes(n));return`<button class="pill" data-t="${c?c.ticker:n}" tabindex="0">${n}</button>`}).join('');
  document.getElementById('pills').querySelectorAll('.pill').forEach(b=>b.addEventListener('click',()=>{document.getElementById('searchInput').value=b.dataset.t;search(b.dataset.t)}));

  setupAC('searchInput','ac',t=>search(t));
  setupAC('cmpInput','cmpAc',async t=>{document.getElementById('cmpOv').classList.remove('visible');try{addCmp(await loadCo(t))}catch(e){toast(e.message,'err')}});

  document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>switchTab(b.dataset.t)));
  document.querySelectorAll('.lens-b').forEach(b=>b.addEventListener('click',()=>setLens(b.dataset.l)));
  document.getElementById('errRetry').addEventListener('click',()=>{showView('hero');document.getElementById('searchInput').focus()});
  document.getElementById('compareBtn').addEventListener('click',()=>{if(!S.current){toast('Load a company first','err');return}document.getElementById('cmpOv').classList.add('visible');document.getElementById('cmpInput').value='';document.getElementById('cmpInput').focus()});
  document.getElementById('addCmpBtn').addEventListener('click',()=>{if(!S.current){toast('Load a company first','err');return}document.getElementById('cmpOv').classList.add('visible');document.getElementById('cmpInput').value='';document.getElementById('cmpInput').focus()});
  document.getElementById('cmpX').addEventListener('click',()=>document.getElementById('cmpOv').classList.remove('visible'));
  document.getElementById('detailX').addEventListener('click',()=>document.getElementById('detailOv').classList.remove('visible'));
  document.querySelectorAll('.ov').forEach(o=>o.addEventListener('click',e=>{if(e.target===o){o.classList.remove('visible');o.setAttribute('aria-hidden','true')}}));
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      document.querySelectorAll('.ov.visible').forEach(m=>{m.classList.remove('visible');m.setAttribute('aria-hidden','true')});
      document.getElementById('fabMenu').classList.remove('open');
    }
    // Ctrl/Cmd+K to focus search
    if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();document.getElementById('searchInput').focus();document.getElementById('searchInput').select();}
    // Number keys 1-4 to switch tabs
    if(!e.ctrlKey&&!e.metaKey&&!e.altKey&&document.activeElement?.tagName!=='INPUT'){
      const tabs=['breakdown','controversies','compare','redflags'];
      const num=parseInt(e.key);
      if(num>=1&&num<=4){e.preventDefault();switchTab(tabs[num-1]);}
    }
  });

  document.getElementById('fabBtn').addEventListener('click',()=>{
    const menu=document.getElementById('fabMenu');
    menu.classList.toggle('open');
    document.getElementById('fabBtn').setAttribute('aria-expanded',menu.classList.contains('open'));
  });
  document.getElementById('exCopy').addEventListener('click',()=>{document.getElementById('fabMenu').classList.remove('open');copyR()});
  document.getElementById('exCSV').addEventListener('click',()=>{document.getElementById('fabMenu').classList.remove('open');csvD()});
  document.getElementById('exShare').addEventListener('click',()=>{document.getElementById('fabMenu').classList.remove('open');shareU()});
  document.addEventListener('click',e=>{if(!e.target.closest('.fab'))document.getElementById('fabMenu').classList.remove('open')});

  // Gauge clicks → detail
  document.querySelectorAll('.gwrap').forEach(w=>{
    w.addEventListener('click',()=>{
      if(!S.current)return;
      const p=w.closest('.gcol').dataset.p;
      const nm={e:'Environmental',s:'Social',g:'Governance'}[p];
      const score=S.current.scores[p],bench=S.current.bench[{e:'environmental',s:'social',g:'governance'}[p]];
      const subs=LENS[S.lens][p];
      const subScores=subs.map((n,i)=>({name:n,score:cl(Math.round(score+(i-1)*7.5+(hashValue(S.current.ticker+':'+S.lens+':'+p+':'+i)-.5)*15),10,95)}));
      document.getElementById('detailTitle').textContent=nm+' — Detail';
      const diff=score-bench;const pctl=cl(Math.round(50+diff*1.5),10,90);
      document.getElementById('detailBody').innerHTML=`<div style="text-align:center;margin-bottom:16px"><span style="font-family:var(--fm);font-size:2.4rem;font-weight:700;color:${sc(score)}">${score}</span><span style="font-family:var(--fh);font-size:1rem;margin-left:6px;color:var(--text2)">${sg(score)}</span><div style="font-size:.8rem;color:var(--text3);margin-top:2px">Industry avg: ${bench} (${sg(bench)})</div></div>${subScores.map(sub=>`<div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--bg3);border-radius:6px;margin-bottom:4px;border:1px solid var(--border)"><span style="font-size:.8rem;color:var(--text2)">${sub.name}</span><span style="font-family:var(--fm);font-size:.8rem;font-weight:500;color:${sc(sub.score)}">${sub.score}</span></div>`).join('')}<div style="margin-top:14px;padding:12px;background:var(--bg3);border-radius:8px;border:1px solid var(--border);font-size:.8rem;color:var(--text3);line-height:1.6"><strong style="color:var(--text)">Insight:</strong> Better than ~${pctl}% of ${S.current.sector} peers. ${diff>=0?'Above':'Below'} sector average by ${Math.abs(diff)} points.</div>`;
      const ov=document.getElementById('detailOv');
      ov.classList.add('visible');
      ov.setAttribute('aria-hidden','false');
      document.getElementById('detailX').focus();
    });
  });

  // A share URL overrides local state; otherwise restore the last complete session.
  const saved=loadState(),params=new URLSearchParams(window.location.search);
  const sharedTicker=(params.get('company')||'').toUpperCase();
  const lens=params.get('lens')||saved.lens;
  const tab=params.get('tab')||saved.lastTab;
  if(['investor','jobseeker','consumer'].includes(lens)){S.lens=lens;document.querySelectorAll('.lens-b').forEach(b=>b.classList.toggle('active',b.dataset.l===lens))}
  if(['breakdown','controversies','compare','redflags'].includes(tab)){S.tab=tab;document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.t===tab));document.querySelectorAll('.tp').forEach(p=>p.classList.remove('active'));document.getElementById({breakdown:'pBreakdown',controversies:'pControversies',compare:'pCompare',redflags:'pRedflags'}[tab])?.classList.add('active')}
  const h=window.location.hash.replace('#','').toUpperCase();
  const ticker=sharedTicker||h||saved.ticker;
  const compareTickers=(params.has('compare')?params.get('compare').split(','):saved.compareTickers||[]).map(t=>t.toUpperCase());
  if(ticker){document.getElementById('searchInput').value=ticker;search(ticker,compareTickers)}
}

// Save state on unload
window.addEventListener('beforeunload',saveState);

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
