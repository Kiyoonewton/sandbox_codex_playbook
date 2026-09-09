// ═══════════════════════════════════════════════════════════════
// REALITY CHECK — Purchasing Power Calculator
// ═══════════════════════════════════════════════════════════════

// ── Historical CPI-U Annual Average Data ──
// Source: U.S. Bureau of Labor Statistics
var CPI_DATA = {
  1913: 9.9, 1914: 10.0, 1915: 10.1, 1916: 10.9, 1917: 12.8,
  1918: 15.1, 1919: 17.3, 1920: 20.0, 1921: 17.9, 1922: 16.8,
  1923: 17.1, 1924: 17.1, 1925: 17.5, 1926: 17.7, 1927: 17.4,
  1928: 17.1, 1929: 17.1, 1930: 16.7, 1931: 15.2, 1932: 13.7,
  1933: 13.0, 1934: 13.4, 1935: 13.7, 1936: 13.9, 1937: 14.4,
  1938: 14.1, 1939: 13.9, 1940: 14.0, 1941: 14.7, 1942: 16.3,
  1943: 17.3, 1944: 17.6, 1945: 18.0, 1946: 19.5, 1947: 22.3,
  1948: 24.1, 1949: 23.8, 1950: 24.1, 1951: 26.0, 1952: 26.5,
  1953: 26.7, 1954: 26.9, 1955: 26.8, 1956: 27.2, 1957: 28.1,
  1958: 28.9, 1959: 29.1, 1960: 29.6, 1961: 29.9, 1962: 30.2,
  1963: 30.6, 1964: 31.0, 1965: 31.5, 1966: 32.4, 1967: 33.4,
  1968: 34.8, 1969: 36.7, 1970: 38.8, 1971: 40.5, 1972: 41.8,
  1973: 44.4, 1974: 49.3, 1975: 53.8, 1976: 56.9, 1977: 60.6,
  1978: 65.2, 1979: 72.6, 1980: 82.4, 1981: 90.9, 1982: 96.5,
  1983: 99.6, 1984: 103.9, 1985: 107.6, 1986: 109.6, 1987: 113.6,
  1988: 118.3, 1989: 124.0, 1990: 130.7, 1991: 136.2, 1992: 140.3,
  1993: 144.5, 1994: 148.2, 1995: 152.4, 1996: 156.9, 1997: 160.5,
  1998: 163.0, 1999: 166.6, 2000: 172.2, 2001: 177.1, 2002: 179.9,
  2003: 184.0, 2004: 188.9, 2005: 195.3, 2006: 201.6, 2007: 207.3,
  2008: 215.3, 2009: 214.5, 2010: 218.1, 2011: 224.9, 2012: 229.6,
  2013: 233.0, 2014: 236.7, 2015: 237.0, 2016: 240.0, 2017: 245.1,
  2018: 251.1, 2019: 255.7, 2020: 258.8, 2021: 271.0, 2022: 292.7,
  2023: 304.7, 2024: 314.2
};

var YEARS = Object.keys(CPI_DATA).map(Number).sort(function(a, b) { return a - b; });
var MIN_YEAR = YEARS[0];
var MAX_YEAR = YEARS[YEARS.length - 1];

// ── DOM References ──
var salaryForm, startYearSel, endYearSel, startSalaryInput, endSalaryInput;
var formErrorEl, submitBtnEl, clearBtnEl, resultsPanelEl;
var verdictBannerEl, verdictIconEl, verdictTitleEl, verdictSubtitleEl;
var totalInflationEl, inflationDetailEl, realValueEl, realDetailEl;
var gapValueEl, gapDetailEl, neededSalaryEl, deficitCardEl;
var negotiationBodyEl, copyBriefBtn, saveBtnEl, savedScenariosEl;
var chart = null;
var currentScenario = null;

// ── Currency Formatting ──
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function parseSalaryInput(value) {
  return parseInt(String(value).replace(/[^0-9]/g, ''), 10) || 0;
}

function formatSalaryDisplay(value) {
  if (!value) return '';
  return value.toLocaleString('en-US');
}

// ── Core Calculation ──
function calculateRealSalary(startYr, startSal, endYr, endSal) {
  var startCPI = CPI_DATA[startYr];
  var endCPI = CPI_DATA[endYr];
  
  if (!startCPI || !endCPI) {
    throw new Error('CPI data not available for the selected years.');
  }
  
  var inflationRate = ((endCPI - startCPI) / startCPI) * 100;
  var realEndSalary = startSal * (endCPI / startCPI);
  var purchasingPowerChange = ((endSal - realEndSalary) / realEndSalary) * 100;
  var gap = endSal - realEndSalary;
  var yearsBetween = endYr - startYr;
  var annualInflationAvg = inflationRate / yearsBetween;
  
  // Build year-by-year data for chart
  var yearData = [];
  for (var y = startYr; y <= endYr; y++) {
    var cpi = CPI_DATA[y];
    var nominal = y === startYr ? startSal : 
      startSal + ((endSal - startSal) * ((y - startYr) / yearsBetween));
    var real = startSal * (cpi / startCPI);
    yearData.push({
      year: y,
      nominal: Math.round(nominal),
      real: Math.round(real),
      cpi: cpi
    });
  }
  
  return {
    startYr: startYr,
    startYrSalary: startSal,
    endYr: endYr,
    endYrSalary: endSal,
    startCPI: startCPI,
    endCPI: endCPI,
    inflationRate: inflationRate,
    realEndSalary: realEndSalary,
    purchasingPowerChange: purchasingPowerChange,
    gap: gap,
    yearsBetween: yearsBetween,
    annualInflationAvg: annualInflationAvg,
    yearData: yearData
  };
}

// ── Render Results ──
function renderResults(data) {
  resultsPanelEl.hidden = false;
  resultsPanelEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  
  var isLoss = data.gap < 0;
  var isGain = data.gap > 0;
  
  verdictBannerEl.className = 'verdict-banner';
  
  if (isLoss) {
    verdictBannerEl.classList.add('verdict-loss');
    verdictIconEl.textContent = '\uD83D\uDCC9';
    verdictTitleEl.textContent = "You're making " + formatCurrency(Math.abs(data.gap)) + " less than you think.";
    verdictSubtitleEl.textContent = "Inflation ate " + Math.abs(data.purchasingPowerChange).toFixed(1) + "% of your raise over " + data.yearsBetween + " year" + (data.yearsBetween !== 1 ? 's' : '') + ".";
    deficitCardEl.className = 'metric-card danger';
  } else if (isGain) {
    verdictBannerEl.classList.add('verdict-gain');
    verdictIconEl.textContent = '\uD83D\uDCC8';
    verdictTitleEl.textContent = "You're actually getting richer!";
    verdictSubtitleEl.textContent = "Your salary beat inflation by " + data.purchasingPowerChange.toFixed(1) + "%. Nice work.";
    deficitCardEl.className = 'metric-card success-card';
  } else {
    verdictBannerEl.classList.add('verdict-even');
    verdictIconEl.textContent = '\u2696\uFE0F';
    verdictTitleEl.textContent = "You're exactly keeping pace.";
    verdictSubtitleEl.textContent = "Your salary matched inflation perfectly. Not losing, not gaining.";
    deficitCardEl.className = 'metric-card';
  }
  
  // Metrics
  totalInflationEl.textContent = data.inflationRate.toFixed(1) + '%';
  inflationDetailEl.textContent = formatCurrency(data.startCPI) + ' \u2192 ' + formatCurrency(data.endCPI) + ' CPI';
  
  realValueEl.textContent = formatCurrency(Math.round(data.realEndSalary));
  realDetailEl.textContent = "Starting salary in today's dollars";
  
  gapValueEl.textContent = isLoss ? '-' + formatCurrency(Math.abs(data.gap)) : '+' + formatCurrency(data.gap);
  gapValueEl.style.color = isLoss ? 'var(--danger)' : isGain ? 'var(--success)' : 'var(--ink)';
  gapDetailEl.textContent = isLoss ? 'Purchasing power deficit' : isGain ? 'Real purchasing power gain' : 'Breaking even';
  
  neededSalaryEl.textContent = formatCurrency(Math.round(data.realEndSalary));
  
  renderChart(data);
  renderNegotiationBrief(data);
  
  currentScenario = data;
}

// ── Chart ──
function renderChart(data) {
  var ctx = document.getElementById('salaryChart').getContext('2d');
  
  if (chart) {
    chart.destroy();
  }
  
  var labels = data.yearData.map(function(d) { return d.year; });
  var nominalData = data.yearData.map(function(d) { return d.nominal; });
  var realData = data.yearData.map(function(d) { return d.real; });
  
  var gradientNominal = ctx.createLinearGradient(0, 0, 0, 300);
  gradientNominal.addColorStop(0, 'rgba(225, 29, 72, 0.15)');
  gradientNominal.addColorStop(1, 'rgba(225, 29, 72, 0.01)');
  
  var gradientReal = ctx.createLinearGradient(0, 0, 0, 300);
  gradientReal.addColorStop(0, 'rgba(8, 145, 178, 0.12)');
  gradientReal.addColorStop(1, 'rgba(8, 145, 178, 0.01)');
  
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Nominal Salary',
          data: nominalData,
          borderColor: '#E11D48',
          backgroundColor: gradientNominal,
          borderWidth: 2.5,
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#E11D48',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
        },
        {
          label: 'Real Salary',
          data: realData,
          borderColor: '#0891B2',
          backgroundColor: gradientReal,
          borderWidth: 2.5,
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#0891B2',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
          borderDash: [6, 3],
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0F172A',
          titleFont: { family: "'Space Grotesk', sans-serif", size: 13, weight: '600' },
          bodyFont: { family: "'JetBrains Mono', monospace", size: 12 },
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
          boxWidth: 8,
          boxHeight: 8,
          boxPadding: 4,
          callbacks: {
            title: function(items) { return 'Year ' + items[0].label; },
            label: function(ctx) {
              var label = ctx.dataset.label === 'Nominal Salary' ? 'Paycheck' : 'Real Value';
              return ' ' + label + ': ' + formatCurrency(ctx.parsed.y);
            },
            afterBody: function(items) {
              if (items.length >= 2) {
                var nominal = items[0].parsed.y;
                var real = items[1].parsed.y;
                var diff = nominal - real;
                if (diff !== 0) {
                  return '\n  Gap: ' + (diff > 0 ? '+' : '') + formatCurrency(diff);
                }
              }
              return '';
            }
          }
        },
      },
      scales: {
        x: {
          grid: { display: false },
          border: { color: '#CBD5E1' },
          ticks: {
            font: { family: "'JetBrains Mono', monospace", size: 10 },
            color: '#64748B',
            maxTicksLimit: 8,
          },
        },
        y: {
          grid: { color: 'rgba(203, 213, 225, 0.5)', drawBorder: false },
          border: { display: false },
          ticks: {
            font: { family: "'JetBrains Mono', monospace", size: 10 },
            color: '#64748B',
            callback: function(val) { return '$' + (val / 1000).toFixed(0) + 'k'; },
            padding: 8,
          },
          beginAtZero: false,
        },
      },
      animation: {
        duration: 800,
        easing: 'easeOutQuart',
      },
    },
  });
}

// ── Negotiation Brief ──
function renderNegotiationBrief(data) {
  var isLoss = data.gap < 0;
  var isGain = data.gap > 0;
  var nomGrowth = ((data.endYrSalary - data.startYrSalary) / data.startYrSalary * 100).toFixed(1);
  var brief = '';
  
  if (isLoss) {
    brief = '<p><strong>The Math:</strong> Between ' + data.startYr + ' and ' + data.endYr + ', cumulative inflation was <span class="highlight">' + data.inflationRate.toFixed(1) + '%</span>. Your salary went from ' + formatCurrency(data.startYrSalary) + ' to ' + formatCurrency(data.endYrSalary) + ' \u2014 a nominal increase of ' + nomGrowth + '%.</p>' +
      '<p><strong>The Reality:</strong> Your starting salary\'s purchasing power equals <span class="highlight">' + formatCurrency(Math.round(data.realEndSalary)) + '</span> in ' + data.endYr + ' dollars. You\'re actually making <strong>' + formatCurrency(Math.abs(Math.round(data.gap))) + ' less</strong> than when you started.</p>' +
      '<p><strong>Your Ask:</strong> Request a salary of at least <span class="highlight">' + formatCurrency(Math.round(data.realEndSalary)) + '</span> just to break even. For a real raise, aim for <span class="highlight">' + formatCurrency(Math.round(data.realEndSalary * 1.05)) + '</span> (5% above) or <span class="highlight">' + formatCurrency(Math.round(data.realEndSalary * 1.10)) + '</span> (10% above).</p>' +
      '<p><strong>The Line:</strong> "Over ' + data.yearsBetween + ' years, inflation has increased costs by ' + data.inflationRate.toFixed(1) + '%. My current salary of ' + formatCurrency(data.endYrSalary) + ' has the purchasing power of ' + formatCurrency(Math.round(data.startYrSalary)) + ' in ' + data.startYr + ' dollars \u2014 that\'s effectively a ' + Math.abs(data.purchasingPowerChange).toFixed(1) + '% pay cut. I\'d like to discuss bringing my compensation in line with the actual cost of living."</p>';
  } else if (isGain) {
    brief = '<p><strong>The Good News:</strong> You\'re beating inflation. Your salary grew faster than the cost of living.</p>' +
      '<p><strong>The Math:</strong> Inflation was <span class="highlight">' + data.inflationRate.toFixed(1) + '%</span>. Your salary grew ' + nomGrowth + '% nominally, gaining <span class="highlight">' + formatCurrency(Math.round(data.gap)) + '</span> in real purchasing power.</p>' +
      '<p><strong>Your Leverage:</strong> You\'re at <span class="highlight">' + formatCurrency(Math.round(data.endYrSalary)) + '</span> in real terms. Ask for a <span class="highlight">' + Math.max(5, Math.round(data.annualInflationAvg + 5)) + '%</span> raise to maintain your trajectory.</p>';
  } else {
    brief = '<p><strong>The Verdict:</strong> You\'re exactly keeping pace. Your ' + data.yearsBetween + '-year increase of ' + nomGrowth + '% matches the ' + data.inflationRate.toFixed(1) + '% inflation rate.</p>' +
      '<p><strong>Your Ask:</strong> Ask for <span class="highlight">' + formatCurrency(Math.round(data.realEndSalary * 1.05)) + '</span> to start building real gains.</p>';
  }
  
  negotiationBodyEl.innerHTML = brief;
}

// ── Save/Load Scenarios ──
function loadSavedScenarios() {
  try {
    return JSON.parse(localStorage.getItem('realityCheckScenarios') || '[]');
  } catch (e) {
    return [];
  }
}

function saveScenariosToStorage(scenarios) {
  localStorage.setItem('realityCheckScenarios', JSON.stringify(scenarios));
}

function renderSavedScenarios() {
  var scenarios = loadSavedScenarios();
  
  if (scenarios.length === 0) {
    savedScenariosEl.innerHTML = '<p class="empty-state">No saved scenarios yet. Run a calculation and save it to compare later.</p>';
    return;
  }
  
  var html = '';
  scenarios.forEach(function(s, i) {
    var verdictClass = s.gap < 0 ? 'loss' : 'gain';
    var verdictText = s.gap < 0 ? '\uD83D\uDCC9 \u2212' + formatCurrency(Math.abs(Math.round(s.gap))) : s.gap > 0 ? '\uD83D\uDCC8 +' + formatCurrency(Math.round(s.gap)) : '\u2696\uFE0F Even';
    html += '<div class="scenario-card" data-index="' + i + '">' +
      '<div class="scenario-info">' +
      '<span class="scenario-label">' + formatCurrency(s.startYrSalary) + ' \u2192 ' + formatCurrency(s.endYrSalary) + '</span>' +
      '<span class="scenario-dates">' + s.startYr + ' \u2013 ' + s.endYr + '</span>' +
      '<span class="scenario-verdict ' + verdictClass + '">' + verdictText + '</span>' +
      '</div>' +
      '<div class="scenario-actions">' +
      '<button class="btn-scenario load-btn" data-index="' + i + '" title="Load this scenario">Load</button>' +
      '<button class="btn-scenario delete delete-btn" data-index="' + i + '" title="Delete this scenario">\u2715</button>' +
      '</div></div>';
  });
  
  savedScenariosEl.innerHTML = html;
  
  // Bind load buttons
  savedScenariosEl.querySelectorAll('.load-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      var idx = parseInt(e.target.dataset.index);
      var s = scenarios[idx];
      startYearSel.value = s.startYr;
      endYearSel.value = s.endYr;
      startSalaryInput.value = s.startYrSalary.toLocaleString('en-US');
      endSalaryInput.value = s.endYrSalary.toLocaleString('en-US');
      doSubmit();
    });
  });
  
  // Bind delete buttons
  savedScenariosEl.querySelectorAll('.delete-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      var idx = parseInt(e.target.dataset.index);
      var scenarios = loadSavedScenarios();
      scenarios.splice(idx, 1);
      saveScenariosToStorage(scenarios);
      renderSavedScenarios();
    });
  });
}

function saveCurrentScenario() {
  if (!currentScenario) return;
  
  var scenarios = loadSavedScenarios();
  scenarios.unshift({
    startYr: currentScenario.startYr,
    startYrSalary: currentScenario.startYrSalary,
    endYr: currentScenario.endYr,
    endYrSalary: currentScenario.endYrSalary,
    gap: currentScenario.gap,
    inflationRate: currentScenario.inflationRate,
    realEndSalary: currentScenario.realEndSalary,
    timestamp: Date.now(),
  });
  
  if (scenarios.length > 10) scenarios.length = 10;
  
  saveScenariosToStorage(scenarios);
  renderSavedScenarios();
  
  saveBtnEl.innerHTML = '<span>\u2713</span> Saved!';
  saveBtnEl.style.color = 'var(--success)';
  saveBtnEl.style.borderColor = 'var(--success)';
  setTimeout(function() {
    saveBtnEl.innerHTML = '<span>\uD83D\uDCBE</span> Save This';
    saveBtnEl.style.color = '';
    saveBtnEl.style.borderColor = '';
  }, 1500);
}

// ── Validation ──
function validateForm() {
  var sy = startYearSel.value;
  var ey = endYearSel.value;
  var ss = parseSalaryInput(startSalaryInput.value);
  var es = parseSalaryInput(endSalaryInput.value);
  
  var errors = [];
  
  if (!sy) errors.push('Select a starting year.');
  if (!ey) errors.push('Select a current year.');
  if (sy && ey && parseInt(sy) >= parseInt(ey)) errors.push('Starting year must be before current year.');
  if (!ss || ss <= 0) errors.push('Enter a valid starting salary.');
  if (!es || es <= 0) errors.push('Enter a valid current salary.');
  if (ss > 10000000) errors.push('Starting salary seems too high \u2014 check your input.');
  if (es > 10000000) errors.push('Current salary seems too high \u2014 check your input.');
  
  return errors;
}

function showError(msg) {
  formErrorEl.textContent = msg;
  formErrorEl.classList.add('visible');
}

function clearError() {
  formErrorEl.textContent = '';
  formErrorEl.classList.remove('visible');
}

// ── Core Submit Logic ──
function doSubmit() {
  clearError();
  
  var errors = validateForm();
  if (errors.length > 0) {
    showError(errors.join(' '));
    return;
  }
  
  submitBtnEl.classList.add('loading');
  submitBtnEl.disabled = true;
  
  setTimeout(function() {
    try {
      var data = calculateRealSalary(
        parseInt(startYearSel.value),
        parseSalaryInput(startSalaryInput.value),
        parseInt(endYearSel.value),
        parseSalaryInput(endSalaryInput.value)
      );
      
      renderResults(data);
      renderSavedScenarios();
    } catch (err) {
      showError(err.message);
    } finally {
      submitBtnEl.classList.remove('loading');
      submitBtnEl.disabled = false;
    }
  }, 400);
}

// ── Initialize ──
function init() {
  salaryForm = document.getElementById('salaryForm');
  startYearSel = document.getElementById('startYear');
  endYearSel = document.getElementById('endYear');
  startSalaryInput = document.getElementById('startSalary');
  endSalaryInput = document.getElementById('endSalary');
  formErrorEl = document.getElementById('formError');
  submitBtnEl = document.getElementById('submitBtn');
  clearBtnEl = document.getElementById('clearBtn');
  resultsPanelEl = document.getElementById('resultsPanel');
  verdictBannerEl = document.getElementById('verdictBanner');
  verdictIconEl = document.getElementById('verdictIcon');
  verdictTitleEl = document.getElementById('verdictTitle');
  verdictSubtitleEl = document.getElementById('verdictSubtitle');
  totalInflationEl = document.getElementById('totalInflation');
  inflationDetailEl = document.getElementById('inflationDetail');
  realValueEl = document.getElementById('realValue');
  realDetailEl = document.getElementById('realDetail');
  gapValueEl = document.getElementById('gapValue');
  gapDetailEl = document.getElementById('gapDetail');
  neededSalaryEl = document.getElementById('neededSalary');
  deficitCardEl = document.getElementById('deficitCard');
  negotiationBodyEl = document.getElementById('negotiationBody');
  copyBriefBtn = document.getElementById('copyBrief');
  saveBtnEl = document.getElementById('saveBtn');
  savedScenariosEl = document.getElementById('savedScenarios');

  // Populate year selectors
  for (var y = MIN_YEAR; y <= MAX_YEAR; y++) {
    var opt1 = document.createElement('option');
    opt1.value = y;
    opt1.textContent = y;
    startYearSel.appendChild(opt1);
    
    var opt2 = document.createElement('option');
    opt2.value = y;
    opt2.textContent = y;
    endYearSel.appendChild(opt2);
  }
  
  // Set defaults
  startYearSel.value = '2000';
  endYearSel.value = '2024';
  
  // Salary input formatting (only on user typing)
  startSalaryInput.addEventListener('input', function(e) {
    var raw = e.target.value.replace(/[^0-9]/g, '');
    if (raw) {
      e.target.value = parseInt(raw, 10).toLocaleString('en-US');
    } else {
      e.target.value = '';
    }
  });
  
  endSalaryInput.addEventListener('input', function(e) {
    var raw = e.target.value.replace(/[^0-9]/g, '');
    if (raw) {
      e.target.value = parseInt(raw, 10).toLocaleString('en-US');
    } else {
      e.target.value = '';
    }
  });
  
  // Focus select on click
  startSalaryInput.addEventListener('focus', function(e) { e.target.select(); });
  endSalaryInput.addEventListener('focus', function(e) { e.target.select(); });
  
  // Form submission
  salaryForm.addEventListener('submit', function(e) {
    e.preventDefault();
    doSubmit();
  });
  
  // Clear
  clearBtnEl.addEventListener('click', function() {
    startYearSel.value = '';
    endYearSel.value = '';
    startSalaryInput.value = '';
    endSalaryInput.value = '';
    clearError();
    resultsPanelEl.hidden = true;
    currentScenario = null;
    if (chart) {
      chart.destroy();
      chart = null;
    }
    startYearSel.focus();
  });
  
  // Save
  saveBtnEl.addEventListener('click', saveCurrentScenario);
  
  // Copy
  copyBriefBtn.addEventListener('click', function() {
    var text = negotiationBodyEl.innerText;
    navigator.clipboard.writeText(text).then(function() {
      copyBriefBtn.classList.add('copied');
      copyBriefBtn.innerHTML = '<span class="copy-icon">\u2713</span> Copied!';
      setTimeout(function() {
        copyBriefBtn.classList.remove('copied');
        copyBriefBtn.innerHTML = '<span class="copy-icon">\uD83D\uDCCB</span> Copy to Clipboard';
      }, 2000);
    }).catch(function() {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      copyBriefBtn.classList.add('copied');
      copyBriefBtn.innerHTML = '<span class="copy-icon">\u2713</span> Copied!';
      setTimeout(function() {
        copyBriefBtn.classList.remove('copied');
        copyBriefBtn.innerHTML = '<span class="copy-icon">\uD83D\uDCCB</span> Copy to Clipboard';
      }, 2000);
    });
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      salaryForm.requestSubmit();
    }
  });
  
  // Render saved scenarios
  renderSavedScenarios();
  
  // Test helper for debugging
  window.testSubmit = function() {
    startYearSel.value = '2000';
    endYearSel.value = '2024';
    startSalaryInput.value = '50,000';
    endSalaryInput.value = '75,000';
    doSubmit();
  };
  
  // Focus first field
  startYearSel.focus();
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
