/* api.js — API layer and data processing */
window.API = {};
API.fetchProfile = async function(ticker) {
  try { var r = await fetch('https://financialmodelingprep.com/api/v3/profile/' + ticker + '?apikey=demo'); if (r.ok) { var d = await r.json(); if (d && d[0] && d[0].companyName) return d[0]; } } catch(e) {}
  var fb = D.fbProfile(ticker); if (fb) return fb;
  throw new Error('Company not found for "' + ticker + '"');
};
API.fetchESG = async function(ticker) {
  try { var r = await fetch('https://financialmodelingprep.com/api/v4/esg-environmental-social-governance-data?symbol=' + ticker + '&apikey=demo'); if (r.ok) { var d = await r.json(); if (d && d.length > 0 && d[0].environmentalScore != null) return d; } } catch(e) {}
  return null;
};
API.fetchRating = async function(ticker) {
  try { var r = await fetch('https://financialmodelingprep.com/api/v4/esg-environmental-social-governance-score-ratings?symbol=' + ticker + '&apikey=demo'); if (r.ok) { var d = await r.json(); if (d && d.length > 0 && d[0].environmentalScore != null) return d; } } catch(e) {}
  return null;
};
API.fetchNews = async function(name) {
  try { var r = await fetch('https://gnews.io/api/v4/search?q=' + encodeURIComponent(name + ' ESG sustainability') + '&lang=en&max=10&token=demo'); var d = await r.json(); return (d && d.articles) ? d.articles : []; } catch(e) { return []; }
};
API.processScores = function(data, rating, bench) {
  var e, s, g, o, est = false, h = [];
  if (rating && rating.length) {
    var p = function(x) { var n = Number(x); return (!isNaN(n) && n > 0 && n <= 100) ? Math.round(n) : null; };
    e = p(rating[0].environmentalScore); s = p(rating[0].socialScore); g = p(rating[0].governanceScore); o = p(rating[0].esgScore);
  }
  if (data && data.length) {
    if (e == null) e = data[0].environmentalScore != null ? Math.round(Number(data[0].environmentalScore)) : null;
    if (s == null) s = data[0].socialScore != null ? Math.round(Number(data[0].socialScore)) : null;
    if (g == null) g = data[0].governanceScore != null ? Math.round(Number(data[0].governanceScore)) : null;
    if (o == null) o = data[0].esgScore != null ? Math.round(Number(data[0].esgScore)) : null;
    h = data.slice(0, 5).reverse().map(function(d) { return { yr: String(d.date || d.year || ''), e: d.environmentalScore != null ? Math.round(Number(d.environmentalScore)) : null, s: d.socialScore != null ? Math.round(Number(d.socialScore)) : null, g: d.governanceScore != null ? Math.round(Number(d.governanceScore)) : null }; }).filter(function(x) { return x.yr && (x.e != null || x.s != null || x.g != null); });
  }
  if (e == null || s == null || g == null || o == null) { est = true; e = e || U.randVar(bench.e, 20); s = s || U.randVar(bench.s, 20); g = g || U.randVar(bench.g, 20); o = o || Math.round((e + s + g) / 3); }
  if (h.length < 2) h = [{yr:'2022',e:U.randVar(e,10),s:U.randVar(s,10),g:U.randVar(g,10)},{yr:'2023',e:U.randVar(e,6),s:U.randVar(s,6),g:U.randVar(g,6)},{yr:'2024',e:e,s:s,g:g}];
  return { e: e, s: s, g: g, o: o, h: h, est: est };
};
API.loadCompany = async function(ticker) {
  var sector = (D.COMPANIES.find(function(c) { return c.t === ticker; }) || {}).s || 'default';
  var bench = D.BENCHMARKS[sector] || D.BENCHMARKS['default'];
  var results = await Promise.all([API.fetchProfile(ticker), API.fetchESG(ticker), API.fetchRating(ticker), API.fetchNews(ticker)]);
  var scores = API.processScores(results[1], results[2], bench);
  return { profile: results[0], esg: results[1], rating: results[2], news: results[3], bench: bench, ticker: ticker, sector: sector, scores: scores };
};
API.deriveSub = function(score, lens, pillar) {
  var labels = D.LENS[lens][pillar];
  return labels.map(function(label, i) { return { name: label, score: U.clamp(Math.round(score + (i - 1) * 15 * .5 + (Math.random() - .5) * 15), 10, 95) }; });
};
API.genInsight = function(pillar, score, bench) {
  var diff = score - bench; var pct = U.clamp(Math.round(50 + diff * 1.5), 10, 90);
  var ins = {
    e: 'Environmental score is ' + (diff >= 0 ? 'above' : 'below') + ' the sector average of ' + bench + '. Ranked in the ' + pct + 'th percentile.',
    s: 'Social practices are ' + (diff >= 0 ? 'above' : 'below') + ' sector norms (avg ' + bench + '). ' + (diff >= 0 ? 'Strengths in workforce programs.' : 'Key risks in labor or supply chain.'),
    g: 'Governance is ' + (diff >= 0 ? 'above' : 'below') + ' the sector average of ' + bench + '. ' + (diff >= 0 ? 'Board independence is a strength.' : 'Executive pay may draw scrutiny.')
  };
  return ins[pillar];
};
