/* data.js — Company list, benchmarks, lens definitions */
window.D = {};
D.BENCHMARKS = { "Technology":{e:62,s:71,g:68,o:67},"Energy":{e:38,s:55,g:61,o:51},"Financial Services":{e:58,s:64,g:72,o:65},"Healthcare":{e:55,s:68,g:66,o:63},"Consumer Discretionary":{e:52,s:61,g:64,o:59},"Industrials":{e:45,s:58,g:63,o:55},"Materials":{e:41,s:54,g:60,o:52},"Utilities":{e:43,s:59,g:64,o:55},"Communication Services":{e:60,s:66,g:67,o:64},"Consumer Staples":{e:54,s:63,g:66,o:61},"default":{e:55,s:63,g:65,o:61} };
D.COMPANIES = [
  {n:"Apple Inc.",t:"AAPL",s:"Technology"},{n:"Microsoft Corporation",t:"MSFT",s:"Technology"},
  {n:"Tesla Inc.",t:"TSLA",s:"Consumer Discretionary"},{n:"Amazon.com Inc.",t:"AMZN",s:"Consumer Discretionary"},
  {n:"Alphabet Inc.",t:"GOOGL",s:"Communication Services"},{n:"Meta Platforms Inc.",t:"META",s:"Communication Services"},
  {n:"ExxonMobil Corporation",t:"XOM",s:"Energy"},{n:"JPMorgan Chase & Co.",t:"JPM",s:"Financial Services"},
  {n:"Johnson & Johnson",t:"JNJ",s:"Healthcare"},{n:"Walmart Inc.",t:"WMT",s:"Consumer Staples"},
  {n:"Chevron Corporation",t:"CVX",s:"Energy"},{n:"Netflix Inc.",t:"NFLX",s:"Communication Services"},
  {n:"Nike Inc.",t:"NKE",s:"Consumer Discretionary"},{n:"Coca-Cola Company",t:"KO",s:"Consumer Staples"},
  {n:"PepsiCo Inc.",t:"PEP",s:"Consumer Staples"},{n:"Pfizer Inc.",t:"PFE",s:"Healthcare"},
  {n:"Goldman Sachs Group",t:"GS",s:"Financial Services"},{n:"Boeing Company",t:"BA",s:"Industrials"},
  {n:"Visa Inc.",t:"V",s:"Financial Services"},{n:"Mastercard Inc.",t:"MA",s:"Financial Services"},
  {n:"Procter & Gamble",t:"PG",s:"Consumer Staples"},{n:"3M Company",t:"MMM",s:"Industrials"},
  {n:"Caterpillar Inc.",t:"CAT",s:"Industrials"},{n:"Shell plc",t:"SHEL",s:"Energy"},
  {n:"BP plc",t:"BP",s:"Energy"},{n:"Unilever PLC",t:"UL",s:"Consumer Staples"},
  {n:"Nestle S.A.",t:"NSRGY",s:"Consumer Staples"},{n:"Samsung Electronics",t:"SSNLF",s:"Technology"},
  {n:"Toyota Motor Corporation",t:"TM",s:"Consumer Discretionary"},{n:"NVIDIA Corporation",t:"NVDA",s:"Technology"},
  {n:"Intel Corporation",t:"INTC",s:"Technology"},{n:"IBM Corporation",t:"IBM",s:"Technology"},
  {n:"Salesforce Inc.",t:"CRM",s:"Technology"},{n:"Adobe Inc.",t:"ADBE",s:"Technology"},
  {n:"Starbucks Corporation",t:"SBUX",s:"Consumer Discretionary"},{n:"McDonald's Corporation",t:"MCD",s:"Consumer Discretionary"},
  {n:"Uber Technologies",t:"UBER",s:"Industrials"},{n:"Moderna Inc.",t:"MRNA",s:"Healthcare"},
  {n:"AstraZeneca PLC",t:"AZN",s:"Healthcare"},{n:"HSBC Holdings",t:"HSBC",s:"Financial Services"},
  {n:"Alibaba Group",t:"BABA",s:"Consumer Discretionary"},{n:"Tencent Holdings",t:"TCEHY",s:"Communication Services"},
  {n:"Taiwan Semiconductor",t:"TSM",s:"Technology"},{n:"NextEra Energy",t:"NEE",s:"Utilities"},
  {n:"CVS Health",t:"CVS",s:"Healthcare"},{n:"AbbVie Inc.",t:"ABBV",s:"Healthcare"},
  {n:"LVMH Moët Hennessy",t:"LVMUY",s:"Consumer Discretionary"},{n:"Siemens AG",t:"SIEGY",s:"Industrials"},
  {n:"Barclays PLC",t:"BCS",s:"Financial Services"},{n:"Rio Tinto Group",t:"RIO",s:"Materials"},
  {n:"General Electric",t:"GE",s:"Industrials"}
];
D.POPULAR = ["Apple","Tesla","ExxonMobil","Shell","Amazon","Microsoft","Nestle","Goldman Sachs"];
D.LENS = {
  investor:{e:["Carbon Intensity","Stranded Asset Risk","Regulatory Exposure"],s:["Labor Relations","Turnover Risk","Litigation History"],g:["Audit Quality","CEO Pay Ratio","Related Party Transactions"]},
  jobseeker:{e:["Gender Pay Gap","Parental Leave Policy","Employee Satisfaction"],s:["Diversity Score","Safety Record","Union Relations"],g:["Whistleblower Policy","Board Diversity","Ethics Violations"]},
  consumer:{e:["Product Carbon Footprint","Packaging Sustainability","Recyclability"],s:["Fair Wages in Supply Chain","Child Labor Risk","Community Impact"],g:["Data Privacy","Lobbying Transparency","Consumer Protection"]}
};
D.fbProfile = function(ticker) {
  var k = D.COMPANIES.find(function(c) { return c.t === ticker; });
  if (!k) return null;
  return { companyName: k.n, ticker: k.t, sector: k.s, industry: k.s, country: 'United States', fullTimeEmployees: Math.floor(30000 + Math.random() * 150000), mktCap: Math.floor(50e9 + Math.random() * 2.5e12), description: k.n + ' is a publicly traded ' + k.s + ' company.' };
};
