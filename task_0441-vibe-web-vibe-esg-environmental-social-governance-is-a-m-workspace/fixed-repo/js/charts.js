/* charts.js — Chart.js rendering */
window.CH = {};
CH.defaults = { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#8899bb', font: { family: 'Inter', size: 11 }, boxWidth: 12, padding: 14 } }, tooltip: { backgroundColor: '#0d1628', titleColor: '#e8eef8', bodyColor: '#8899bb', borderColor: '#1a2e48', borderWidth: 1, padding: 10, cornerRadius: 6 } }, scales: { x: { grid: { color: 'rgba(26,46,72,.4)' }, ticks: { color: '#445566', font: { family: 'JetBrains Mono', size: 10 } } }, y: { beginAtZero: true, max: 100, grid: { color: 'rgba(26,46,72,.4)' }, ticks: { color: '#445566', font: { family: 'JetBrains Mono', size: 10 }, stepSize: 25 } } } };
CH.destroy = function(key) { if (S.charts[key]) { S.charts[key].destroy(); S.charts[key] = null; } };
CH.renderTrend = function(history) {
  CH.destroy('trend');
  var ctx = document.getElementById('trendChart'); if (!ctx || history.length < 2) return;
  S.charts.trend = new Chart(ctx, { type: 'line', data: { labels: history.map(function(h) { return h.yr; }), datasets: [
    { label: 'Environmental', data: history.map(function(h) { return h.e; }), borderColor: '#00c875', backgroundColor: 'rgba(0,200,117,.08)', fill: true, tension: .4, pointRadius: 5, pointBackgroundColor: '#00c875', borderWidth: 2 },
    { label: 'Social', data: history.map(function(h) { return h.s; }), borderColor: '#4d9fff', backgroundColor: 'rgba(77,159,255,.08)', fill: true, tension: .4, pointRadius: 5, pointBackgroundColor: '#4d9fff', borderWidth: 2 },
    { label: 'Governance', data: history.map(function(h) { return h.g; }), borderColor: '#a855f7', backgroundColor: 'rgba(168,85,247,.08)', fill: true, tension: .4, pointRadius: 5, pointBackgroundColor: '#a855f7', borderWidth: 2 }
  ] }, options: Object.assign({}, CH.defaults, { interaction: { mode: 'index', intersect: false } }) });
};
CH.renderBench = function(scores, bench, sector) {
  CH.destroy('bench');
  var ctx = document.getElementById('benchChart'); if (!ctx) return;
  document.getElementById('benchTitle').textContent = 'vs ' + sector + ' Average';
  S.charts.bench = new Chart(ctx, { type: 'bar', data: { labels: ['Environmental', 'Social', 'Governance'], datasets: [
    { label: 'This Company', data: [scores.e, scores.s, scores.g], backgroundColor: ['rgba(0,200,117,.7)', 'rgba(77,159,255,.7)', 'rgba(168,85,247,.7)'], borderRadius: 6, barPercentage: .5 },
    { label: sector + ' Avg', data: [bench.e, bench.s, bench.g], backgroundColor: 'rgba(255,255,255,.08)', borderRadius: 6, barPercentage: .5 }
  ] }, options: CH.defaults });
};
CH.renderRadar = function(companies) {
  CH.destroy('radar');
  var ctx = document.getElementById('radarChart'); if (!ctx) return;
  var colors = ['#00c875', '#f5a623', '#ff6b9d'];
  var datasets = companies.map(function(c, i) {
    var bench = c.bench || D.BENCHMARKS['default'];
    return { label: (c.profile || {}).companyName || c.ticker, data: [c.scores.e, c.scores.s, c.scores.g, c.scores.o, U.clamp(50 + (c.scores.o - bench.o), 10, 90), U.clamp(c.scores.e - bench.e + 50, 10, 90)], backgroundColor: colors[i] + '20', borderColor: colors[i], borderWidth: 2, pointBackgroundColor: colors[i], pointRadius: 4 };
  });
  if (companies.length === 1) {
    var bench = companies[0].bench || D.BENCHMARKS['default'];
    datasets.push({ label: companies[0].sector + ' Avg', data: [bench.e, bench.s, bench.g, bench.o, 50, 50], backgroundColor: 'rgba(68,85,102,.1)', borderColor: '#445566', borderWidth: 1, borderDash: [4, 4], pointRadius: 3, pointBackgroundColor: '#445566' });
  }
  S.charts.radar = new Chart(ctx, { type: 'radar', data: { labels: ['Environmental', 'Social', 'Governance', 'Overall', 'Industry Rank', 'Trend'], datasets: datasets }, options: { responsive: true, maintainAspectRatio: false, scales: { r: { beginAtZero: true, max: 100, grid: { color: 'rgba(26,46,72,.3)' }, angleLines: { color: 'rgba(26,46,72,.3)' }, pointLabels: { color: '#8899bb', font: { family: 'Inter', size: 11 } }, ticks: { stepSize: 25, color: '#445566', backdropColor: 'transparent', font: { family: 'JetBrains Mono', size: 9 } } } }, plugins: { legend: { position: 'bottom', labels: { color: '#8899bb', font: { family: 'Inter', size: 12 }, boxWidth: 12, padding: 16 } }, tooltip: { backgroundColor: '#0d1628', titleColor: '#e8eef8', bodyColor: '#8899bb', borderColor: '#1a2e48', borderWidth: 1, padding: 10, cornerRadius: 6 } } } });
};
