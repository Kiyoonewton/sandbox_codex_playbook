// =============================================
// University Comparison Studio — Application Logic
// =============================================

// ---- University Data ----
const UNIVERSITIES = [
  { id: 'mit', name: 'Massachusetts Institute of Technology', short: 'MIT', state: 'MA', type: 'private', ivy: false, tuition: 59750, enrollment: 11520, acceptanceRate: 3.9, studentFacultyRatio: 3, location: 'Cambridge, MA', color: '#A31F34', graduationRate: 96, avgSalary: 107000 },
  { id: 'stanford', name: 'Stanford University', short: 'Stanford', state: 'CA', type: 'private', ivy: false, tuition: 62484, enrollment: 9759, acceptanceRate: 3.6, studentFacultyRatio: 5, location: 'Stanford, CA', color: '#8C1515', graduationRate: 94, avgSalary: 105000 },
  { id: 'harvard', name: 'Harvard University', short: 'Harvard', state: 'MA', type: 'private', ivy: true, tuition: 59076, enrollment: 7153, acceptanceRate: 3.2, studentFacultyRatio: 5, location: 'Cambridge, MA', color: '#A51C30', graduationRate: 98, avgSalary: 95000 },
  { id: 'yale', name: 'Yale University', short: 'Yale', state: 'CT', type: 'private', ivy: true, tuition: 64700, enrollment: 6448, acceptanceRate: 4.4, studentFacultyRatio: 5, location: 'New Haven, CT', color: '#00356B', graduationRate: 97, avgSalary: 93000 },
  { id: 'columbia', name: 'Columbia University', short: 'Columbia', state: 'NY', type: 'private', ivy: true, tuition: 65524, enrollment: 8902, acceptanceRate: 3.7, studentFacultyRatio: 6, location: 'New York, NY', color: '#003B73', graduationRate: 95, avgSalary: 97000 },
  { id: 'princeton', name: 'Princeton University', short: 'Princeton', state: 'NJ', type: 'private', ivy: true, tuition: 59710, enrollment: 5548, acceptanceRate: 4.0, studentFacultyRatio: 5, location: 'Princeton, NJ', color: '#E77500', graduationRate: 98, avgSalary: 92000 },
  { id: 'caltech', name: 'California Institute of Technology', short: 'Caltech', state: 'CA', type: 'private', ivy: false, tuition: 63402, enrollment: 987, acceptanceRate: 2.7, studentFacultyRatio: 3, location: 'Pasadena, CA', color: '#FF6C0C', graduationRate: 93, avgSalary: 112000 },
  { id: 'duke', name: 'Duke University', short: 'Duke', state: 'NC', type: 'private', ivy: false, tuition: 63054, enrollment: 6883, acceptanceRate: 5.0, studentFacultyRatio: 5, location: 'Durham, NC', color: '#003087', graduationRate: 95, avgSalary: 88000 },
  { id: 'uchicago', name: 'University of Chicago', short: 'UChicago', state: 'IL', type: 'private', ivy: false, tuition: 62940, enrollment: 7526, acceptanceRate: 5.3, studentFacultyRatio: 5, location: 'Chicago, IL', color: '#800000', graduationRate: 94, avgSalary: 91000 },
  { id: 'upenn', name: 'University of Pennsylvania', short: 'UPenn', state: 'PA', type: 'private', ivy: true, tuition: 63452, enrollment: 10764, acceptanceRate: 5.5, studentFacultyRatio: 6, location: 'Philadelphia, PA', color: '#011F5B', graduationRate: 96, avgSalary: 95000 },
  { id: 'berkeley', name: 'UC Berkeley', short: 'UC Berkeley', state: 'CA', type: 'public', ivy: false, tuition: 14312, enrollment: 32143, acceptanceRate: 11.6, studentFacultyRatio: 20, location: 'Berkeley, CA', color: '#003262', graduationRate: 93, avgSalary: 85000 },
  { id: 'ucla', name: 'UCLA', short: 'UCLA', state: 'CA', type: 'public', ivy: false, tuition: 13804, enrollment: 32423, acceptanceRate: 8.7, studentFacultyRatio: 18, location: 'Los Angeles, CA', color: '#2774AE', graduationRate: 91, avgSalary: 80000 },
  { id: 'michigan', name: 'University of Michigan', short: 'Michigan', state: 'MI', type: 'public', ivy: false, tuition: 16736, enrollment: 33088, acceptanceRate: 17.7, studentFacultyRatio: 15, location: 'Ann Arbor, MI', color: '#00274C', graduationRate: 92, avgSalary: 76000 },
  { id: 'uva', name: 'University of Virginia', short: 'UVA', state: 'VA', type: 'public', ivy: false, tuition: 19814, enrollment: 17299, acceptanceRate: 18.7, studentFacultyRatio: 14, location: 'Charlottesville, VA', color: '#232D4B', graduationRate: 94, avgSalary: 78000 },
  { id: 'gatech', name: 'Georgia Institute of Technology', short: 'Georgia Tech', state: 'GA', type: 'public', ivy: false, tuition: 12682, enrollment: 18831, acceptanceRate: 16.4, studentFacultyRatio: 18, location: 'Atlanta, GA', color: '#B3A369', graduationRate: 90, avgSalary: 82000 },
  { id: 'utexas', name: 'University of Texas at Austin', short: 'UT Austin', state: 'TX', type: 'public', ivy: false, tuition: 11448, enrollment: 40916, acceptanceRate: 29.1, studentFacultyRatio: 17, location: 'Austin, TX', color: '#BF5700', graduationRate: 88, avgSalary: 74000 },
  { id: 'cornell', name: 'Cornell University', short: 'Cornell', state: 'NY', type: 'private', ivy: true, tuition: 63200, enrollment: 15735, acceptanceRate: 7.5, studentFacultyRatio: 9, location: 'Ithaca, NY', color: '#B31B1B', graduationRate: 94, avgSalary: 87000 },
  { id: 'dartmouth', name: 'Dartmouth College', short: 'Dartmouth', state: 'NH', type: 'private', ivy: true, tuition: 62430, enrollment: 4556, acceptanceRate: 6.2, studentFacultyRatio: 7, location: 'Hanover, NH', color: '#00693E', graduationRate: 96, avgSalary: 85000 },
  { id: 'brown', name: 'Brown University', short: 'Brown', state: 'RI', type: 'private', ivy: true, tuition: 65146, enrollment: 7160, acceptanceRate: 5.1, studentFacultyRatio: 6, location: 'Providence, RI', color: '#4E3629', graduationRate: 95, avgSalary: 82000 },
  { id: 'nyu', name: 'New York University', short: 'NYU', state: 'NY', type: 'private', ivy: false, tuition: 58168, enrollment: 29401, acceptanceRate: 12.2, studentFacultyRatio: 8, location: 'New York, NY', color: '#57068C', graduationRate: 85, avgSalary: 84000 },
];

// ---- State Management ----
const STORAGE_KEY = 'uni-compare-v2';
let state = loadState();

// Undo/Redo stacks
let undoStack = [];
let redoStack = [];

function pushUndo() {
  undoStack.push([...state.comparisonIds]);
  redoStack = []; // clear redo on new action
  if (undoStack.length > 30) undoStack.shift();
  updateUndoRedoButtons();
}

function undo() {
  if (undoStack.length === 0) return;
  redoStack.push([...state.comparisonIds]);
  state.comparisonIds = undoStack.pop();
  render();
  updateUndoRedoButtons();
  showToast('Undo', 'info');
}

function redo() {
  if (redoStack.length === 0) return;
  undoStack.push([...state.comparisonIds]);
  state.comparisonIds = redoStack.pop();
  render();
  updateUndoRedoButtons();
  showToast('Redo', 'info');
}

function updateUndoRedoButtons() {
  const undoBtn = $('#btn-undo');
  const redoBtn = $('#btn-redo');
  if (undoBtn) undoBtn.disabled = undoStack.length === 0;
  if (redoBtn) redoBtn.disabled = redoStack.length === 0;
}

function getDefaultState() {
  return {
    comparisonIds: [],
    searchQuery: '',
    filterType: 'all',
    viewMode: 'cards',
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Validate that stored IDs still exist
      parsed.comparisonIds = (parsed.comparisonIds || []).filter(id =>
        UNIVERSITIES.some(u => u.id === id)
      );
      return { ...getDefaultState(), ...parsed };
    }
  } catch (e) { /* ignore */ }
  return getDefaultState();
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      comparisonIds: state.comparisonIds,
      viewMode: state.viewMode,
    }));
  } catch (e) { /* ignore */ }
}

// ---- Helpers ----
function $(sel, parent = document) { return parent.querySelector(sel); }
function $$(sel, parent = document) { return [...parent.querySelectorAll(sel)]; }

function formatCurrency(n) {
  return '$' + n.toLocaleString('en-US');
}

function formatNumber(n) {
  return n.toLocaleString('en-US');
}

function formatPercent(n) {
  return n.toFixed(1) + '%';
}

function getUni(id) {
  return UNIVERSITIES.find(u => u.id === id);
}

function getComparisonUnis() {
  return state.comparisonIds.map(getUni).filter(Boolean);
}

// ---- Best Value Calculation ----
// "Best value" = lower tuition + higher acceptance rate + lower student-faculty ratio
// We'll use a simple weighted score
function calculateValueScore(uni) {
  // Normalize: lower tuition is better, higher acceptance rate is better
  const tuitionScore = 1 - (uni.tuition / 70000);
  const acceptScore = uni.acceptanceRate / 30;
  const ratioScore = 1 - (uni.studentFacultyRatio / 25);
  const salaryScore = uni.avgSalary / 120000;
  return (tuitionScore * 0.35) + (acceptScore * 0.2) + (ratioScore * 0.2) + (salaryScore * 0.25);
}

function getBestInMetric(comparisons, metric) {
  if (comparisons.length < 2) return null;
  const values = comparisons.map(u => {
    switch (metric) {
      case 'tuition': return u.tuition;
      case 'acceptanceRate': return u.acceptanceRate;
      case 'enrollment': return u.enrollment;
      case 'studentFacultyRatio': return u.studentFacultyRatio;
      case 'graduationRate': return u.graduationRate;
      case 'avgSalary': return u.avgSalary;
      case 'value': return calculateValueScore(u);
      default: return 0;
    }
  });
  const bestIdx = metric === 'tuition' || metric === 'studentFacultyRatio'
    ? values.indexOf(Math.min(...values))
    : values.indexOf(Math.max(...values));
  return comparisons[bestIdx].id;
}

// ---- Rendering ----
function render() {
  renderComparisonGrid();
  renderComparisonTable();
  renderSummary();
  renderResults();
  renderSelectedPills();
  updateComparisonCount();
  updateViewToggle();
  saveState();
}

function updateComparisonCount() {
  const el = $('#comparison-count');
  if (el) el.textContent = state.comparisonIds.length;
}

function renderComparisonGrid() {
  const grid = $('#comparison-grid');
  const empty = $('#comparison-empty');
  const comparisons = getComparisonUnis();

  if (comparisons.length === 0) {
    grid.innerHTML = '';
    grid.hidden = true;
    empty.hidden = false;
    return;
  }

  empty.hidden = true;
  
  // If table view, hide grid
  if (state.viewMode === 'table') {
    grid.hidden = true;
    return;
  }
  
  grid.hidden = false;

  const bestTuition = getBestInMetric(comparisons, 'tuition');
  const bestAccept = getBestInMetric(comparisons, 'acceptanceRate');
  const bestSalary = getBestInMetric(comparisons, 'avgSalary');
  const bestValue = getBestInMetric(comparisons, 'value');

  grid.innerHTML = comparisons.map((uni, i) => {
    const isBestValue = bestValue === uni.id;
    return `
    <article class="comp-card" style="animation-delay: ${i * 60}ms" data-uni-id="${uni.id}">
      <button class="comp-card__remove" data-remove="${uni.id}" title="Remove from comparison" aria-label="Remove ${uni.short} from comparison">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div class="comp-card__emblem" style="background:${uni.color}">${uni.short.slice(0, 2).toUpperCase()}</div>
      <h3 class="comp-card__name">${uni.short}</h3>
      <p class="comp-card__location">${uni.location}</p>
      <div class="comp-card__metrics">
        <div class="comp-card__metric">
          <span class="comp-card__metric-label">Tuition</span>
          <span class="comp-card__metric-value" style="${bestTuition === uni.id ? 'color:var(--success)' : ''}">${formatCurrency(uni.tuition)}${bestTuition === uni.id ? ' ★' : ''}</span>
        </div>
        <div class="comp-card__metric">
          <span class="comp-card__metric-label">Enrollment</span>
          <span class="comp-card__metric-value">${formatNumber(uni.enrollment)}</span>
        </div>
        <div class="comp-card__metric">
          <span class="comp-card__metric-label">Acceptance</span>
          <span class="comp-card__metric-value" style="${bestAccept === uni.id ? 'color:var(--success)' : ''}">${formatPercent(uni.acceptanceRate)}${bestAccept === uni.id ? ' ★' : ''}</span>
        </div>
        <div class="comp-card__metric">
          <span class="comp-card__metric-label">Student:Faculty</span>
          <span class="comp-card__metric-value">${uni.studentFacultyRatio}:1</span>
        </div>
        <div class="comp-card__metric">
          <span class="comp-card__metric-label">Grad Rate</span>
          <span class="comp-card__metric-value">${formatPercent(uni.graduationRate)}</span>
        </div>
        <div class="comp-card__metric">
          <span class="comp-card__metric-label">Avg Salary</span>
          <span class="comp-card__metric-value" style="${bestSalary === uni.id ? 'color:var(--success)' : ''}">${formatCurrency(uni.avgSalary)}${bestSalary === uni.id ? ' ★' : ''}</span>
        </div>
      </div>
      ${isBestValue ? `
      <span class="comp-card__badge comp-card__badge--best">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        Best Value
      </span>` : ''}
    </article>`;
  }).join('');
}

function renderSummary() {
  const section = $('#summary-section');
  const grid = $('#summary-grid');
  const comparisons = getComparisonUnis();

  if (comparisons.length < 2) {
    section.hidden = true;
    return;
  }

  section.hidden = false;

  const avgTuition = comparisons.reduce((s, u) => s + u.tuition, 0) / comparisons.length;
  const avgAccept = comparisons.reduce((s, u) => s + u.acceptanceRate, 0) / comparisons.length;
  const avgEnrollment = comparisons.reduce((s, u) => s + u.enrollment, 0) / comparisons.length;
  const avgGradRate = comparisons.reduce((s, u) => s + u.graduationRate, 0) / comparisons.length;
  const avgSalary = comparisons.reduce((s, u) => s + u.avgSalary, 0) / comparisons.length;
  const lowestTuition = comparisons.reduce((a, b) => a.tuition < b.tuition ? a : b);
  const highestSalary = comparisons.reduce((a, b) => a.avgSalary > b.avgSalary ? a : b);
  const bestValueUni = getUni(getBestInMetric(comparisons, 'value')) || comparisons[0];
  const bestAcceptUni = comparisons.reduce((a, b) => a.acceptanceRate > b.acceptanceRate ? a : b);

  // Value scores for bars
  const valueScores = comparisons.map(u => ({ id: u.id, short: u.short, score: calculateValueScore(u) }));
  const maxScore = Math.max(...valueScores.map(v => v.score));

  grid.innerHTML = `
    <div class="summary-card summary-card--accent">
      <span class="summary-card__label">Best Value</span>
      <span class="summary-card__value">${bestValueUni.short}</span>
      <span class="summary-card__detail">Highest value score: <span class="summary-card__highlight">${(calculateValueScore(bestValueUni) * 100).toFixed(0)}/100</span></span>
    </div>
    <div class="summary-card">
      <span class="summary-card__label">Avg Tuition</span>
      <span class="summary-card__value">${formatCurrency(Math.round(avgTuition))}</span>
      <span class="summary-card__detail">Across ${comparisons.length} universities</span>
    </div>
    <div class="summary-card">
      <span class="summary-card__label">Avg Acceptance Rate</span>
      <span class="summary-card__value">${formatPercent(avgAccept)}</span>
      <span class="summary-card__detail">Highest: <span class="summary-card__highlight">${bestAcceptUni.short} (${formatPercent(bestAcceptUni.acceptanceRate)})</span></span>
    </div>
    <div class="summary-card">
      <span class="summary-card__label">Lowest Tuition</span>
      <span class="summary-card__value">${formatCurrency(lowestTuition.tuition)}</span>
      <span class="summary-card__detail"><span class="summary-card__highlight">${lowestTuition.short}</span></span>
    </div>
    <div class="summary-card">
      <span class="summary-card__label">Avg Graduation Rate</span>
      <span class="summary-card__value">${formatPercent(avgGradRate)}</span>
      <span class="summary-card__detail">Avg enrollment: ${formatNumber(Math.round(avgEnrollment))}</span>
    </div>
    <div class="summary-card">
      <span class="summary-card__label">Value Score Ranking</span>
      <div class="summary-bars">
        ${valueScores.sort((a, b) => b.score - a.score).map((v, i) => `
          <div class="summary-bar">
            <span class="summary-bar__label">${v.short}</span>
            <div class="summary-bar__track">
              <div class="summary-bar__fill ${i === 0 ? 'summary-bar__fill--best' : i < valueScores.length / 2 ? 'summary-bar__fill--good' : 'summary-bar__fill--mid'}" style="width: ${(v.score / maxScore) * 100}%"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderResults() {
  const list = $('#results-list');
  const empty = $('#browser-empty');
  const query = state.searchQuery.toLowerCase().trim();
  const filter = state.filterType;

  let filtered = UNIVERSITIES.filter(uni => {
    if (filter === 'public' && uni.type !== 'public') return false;
    if (filter === 'private' && uni.type !== 'private') return false;
    if (filter === 'ivy' && !uni.ivy) return false;
    if (query) {
      const searchable = `${uni.name} ${uni.short} ${uni.state} ${uni.location} ${uni.type}`.toLowerCase();
      return searchable.includes(query);
    }
    return true;
  });

  if (filtered.length === 0) {
    list.innerHTML = '';
    empty.hidden = false;
    return;
  }

  empty.hidden = true;
  const compSet = new Set(state.comparisonIds);

  list.innerHTML = filtered.map((uni, i) => {
    const isSelected = compSet.has(uni.id);
    return `
    <button class="uni-item ${isSelected ? 'selected' : ''}" data-uni-id="${uni.id}" role="listitem" aria-pressed="${isSelected}" style="animation: cardIn 0.25s ${i * 20}ms both" tabindex="0">
      <div class="uni-item__emblem" style="background:${uni.color}">${uni.short.slice(0, 2).toUpperCase()}</div>
      <div class="uni-item__info">
        <div class="uni-item__name">${highlightMatch(uni.short, query)}</div>
        <div class="uni-item__meta">${uni.type === 'public' ? 'Public' : 'Private'}${uni.ivy ? ' · Ivy League' : ''} · ${uni.state}</div>
      </div>
      <div class="uni-item__action">
        <div class="uni-item__check">
          ${isSelected ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
        </div>
      </div>
      <span class="uni-item__add-label ${isSelected ? 'uni-item__add-label--remove' : ''}">${isSelected ? 'Remove' : 'Add'}</span>
    </button>`;
  }).join('');
}

function highlightMatch(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark style="background:var(--accent-light);color:var(--accent);border-radius:2px;padding:0 1px;">$1</mark>');
}

// ---- Table View Rendering ----
function renderComparisonTable() {
  const wrap = $('#comparison-table-wrap');
  const table = $('#comparison-table');
  const comparisons = getComparisonUnis();

  if (comparisons.length < 2 || state.viewMode !== 'table') {
    wrap.hidden = true;
    return;
  }

  wrap.hidden = false;

  const bestTuition = getBestInMetric(comparisons, 'tuition');
  const bestAccept = getBestInMetric(comparisons, 'acceptanceRate');
  const bestSalary = getBestInMetric(comparisons, 'avgSalary');
  const bestGrad = getBestInMetric(comparisons, 'graduationRate');
  const bestRatio = getBestInMetric(comparisons, 'studentFacultyRatio');
  const bestEnroll = getBestInMetric(comparisons, 'enrollment');
  const bestValue = getBestInMetric(comparisons, 'value');

  const metrics = [
    { key: 'tuition', label: 'Tuition', format: u => formatCurrency(u.tuition), best: bestTuition },
    { key: 'enrollment', label: 'Enrollment', format: u => formatNumber(u.enrollment), best: bestEnroll },
    { key: 'acceptanceRate', label: 'Acceptance Rate', format: u => formatPercent(u.acceptanceRate), best: bestAccept },
    { key: 'studentFacultyRatio', label: 'Student:Faculty', format: u => u.studentFacultyRatio + ':1', best: bestRatio },
    { key: 'graduationRate', label: 'Graduation Rate', format: u => formatPercent(u.graduationRate), best: bestGrad },
    { key: 'avgSalary', label: 'Avg Salary', format: u => formatCurrency(u.avgSalary), best: bestSalary },
    { key: 'location', label: 'Location', format: u => u.location, best: null },
    { key: 'type', label: 'Type', format: u => u.type.charAt(0).toUpperCase() + u.type.slice(1) + (u.ivy ? ' · Ivy League' : ''), best: null },
  ];

  table.innerHTML = `
    <thead>
      <tr>
        <th>Metric</th>
        ${comparisons.map(uni => `
          <th>
            <div class="comp-table__uni-header">
              <span class="comp-table__uni-emblem" style="background:${uni.color}">${uni.short.slice(0, 2)}</span>
              ${uni.short}
              <button class="comp-table__remove-btn" data-remove="${uni.id}" title="Remove ${uni.short}" aria-label="Remove ${uni.short}">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </th>
        `).join('')}
      </tr>
    </thead>
    <tbody>
      ${metrics.map(m => `
        <tr>
          <td>${m.label}</td>
          ${comparisons.map(uni => `
            <td class="${m.best === uni.id ? 'comp-table__best' : ''}">${m.format(uni)}</td>
          `).join('')}
        </tr>
      `).join('')}
      <tr>
        <td>Value Score</td>
        ${comparisons.map(uni => `
          <td class="${bestValue === uni.id ? 'comp-table__best' : ''}">${(calculateValueScore(uni) * 100).toFixed(0)}/100</td>
        `).join('')}
      </tr>
    </tbody>
  `;
}

// ---- Selected Pills Rendering ----
function renderSelectedPills() {
  const count = state.comparisonIds.length;
  const viewToggle = $('#view-toggle');
  if (viewToggle) viewToggle.hidden = count < 2;
}

function updateViewToggle() {
  $$('.view-btn').forEach(btn => {
    const isActive = btn.dataset.view === state.viewMode;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive);
  });
  // Show/hide grid vs table
  const grid = $('#comparison-grid');
  const tableWrap = $('#comparison-table-wrap');
  if (grid) grid.hidden = state.viewMode === 'table' && getComparisonUnis().length >= 2;
  if (tableWrap && getComparisonUnis().length < 2) tableWrap.hidden = true;
}

// ---- Actions ----
function toggleComparison(id) {
  pushUndo();
  const idx = state.comparisonIds.indexOf(id);
  if (idx >= 0) {
    state.comparisonIds.splice(idx, 1);
    showToast(`Removed ${getUni(id)?.short} from comparison`, 'info');
  } else {
    if (state.comparisonIds.length >= 4) {
      showToast('Maximum 4 universities at a time', 'error');
      undoStack.pop(); // don't save this as undoable
      updateUndoRedoButtons();
      return;
    }
    state.comparisonIds.push(id);
    showToast(`Added ${getUni(id)?.short} to comparison`, 'success');
  }
  render();
}

function resetComparison() {
  pushUndo();
  state.comparisonIds = [];
  render();
  showToast('Comparison reset', 'info');
}

function exportComparison() {
  const comparisons = getComparisonUnis();
  if (comparisons.length === 0) {
    showToast('Nothing to export — add universities first', 'error');
    return;
  }

  const header = ['University', 'Location', 'Type', 'Tuition', 'Enrollment', 'Acceptance Rate', 'Student:Faculty', 'Graduation Rate', 'Avg Salary'];
  const rows = comparisons.map(u => [
    u.name, u.location, u.type, u.tuition, u.enrollment,
    u.acceptanceRate + '%', u.studentFacultyRatio + ':1',
    u.graduationRate + '%', '$' + u.avgSalary
  ]);

  const csv = [header.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `university-comparison-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Comparison exported as CSV', 'success');
}

// ---- Toast System ----
function showToast(message, type = 'info') {
  const container = $('#toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('leaving');
    toast.addEventListener('animationend', () => toast.remove());
  }, 2200);
}

// ---- Event Listeners ----
function init() {
  render();

  // Search input
  const searchInput = $('#search-input');
  searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderResults();
  });

  // Filter chips
  $$('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      $$('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.filterType = chip.dataset.filter;
      renderResults();
    });
  });

  // View toggle
  $$('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.viewMode = btn.dataset.view;
      render();
    });
  });

  // Results click delegation
  $('#results-list').addEventListener('click', (e) => {
    const item = e.target.closest('.uni-item');
    if (item) toggleComparison(item.dataset.uniId);
  });

  // Results keyboard support
  $('#results-list').addEventListener('keydown', (e) => {
    const item = e.target.closest('.uni-item');
    if (!item) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleComparison(item.dataset.uniId);
    }
    // Arrow key navigation
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const next = item.nextElementSibling;
      if (next) next.focus();
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = item.previousElementSibling;
      if (prev) prev.focus();
    }
  });

  // Comparison grid remove delegation
  $('#comparison-grid').addEventListener('click', (e) => {
    const removeBtn = e.target.closest('[data-remove]');
    if (removeBtn) {
      e.stopPropagation();
      toggleComparison(removeBtn.dataset.remove);
    }
  });

  // Table remove delegation
  $('#comparison-table').addEventListener('click', (e) => {
    const removeBtn = e.target.closest('[data-remove]');
    if (removeBtn) {
      e.stopPropagation();
      toggleComparison(removeBtn.dataset.remove);
    }
  });

  // Top bar actions
  $('#btn-reset').addEventListener('click', resetComparison);
  $('#btn-export').addEventListener('click', exportComparison);
  $('#btn-undo').addEventListener('click', undo);
  $('#btn-redo').addEventListener('click', redo);

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    const isInput = document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA';

    // "/" to focus search
    if (e.key === '/' && !isInput) {
      e.preventDefault();
      searchInput.focus();
    }
    // Esc to blur search / close modal
    if (e.key === 'Escape') {
      if ($('#shortcuts-modal').open) {
        $('#shortcuts-modal').close();
      } else if (document.activeElement === searchInput) {
        searchInput.value = '';
        state.searchQuery = '';
        searchInput.blur();
        renderResults();
      }
    }
    // ? to toggle shortcuts (not in input)
    if (e.key === '?' && !isInput) {
      const modal = $('#shortcuts-modal');
      modal.open ? modal.close() : modal.showModal();
    }
    // 1 for cards view (not in input)
    if (e.key === '1' && !isInput && !e.ctrlKey && !e.metaKey) {
      state.viewMode = 'cards';
      render();
    }
    // 2 for table view (not in input)
    if (e.key === '2' && !isInput && !e.ctrlKey && !e.metaKey) {
      state.viewMode = 'table';
      render();
    }
    // Ctrl+Z undo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      // Don't intercept if user is in search (might want browser undo)
      if (isInput && document.activeElement === searchInput) return;
      e.preventDefault();
      undo();
    }
    // Ctrl+Shift+Z redo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
      if (isInput && document.activeElement === searchInput) return;
      e.preventDefault();
      redo();
    }
    // Ctrl+Y redo (alternative)
    if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
      e.preventDefault();
      redo();
    }
    // Ctrl+E export
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
      e.preventDefault();
      exportComparison();
    }
    // Ctrl+R reset (prevent page reload)
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
      e.preventDefault();
      resetComparison();
    }
  });

  // Modal close button
  $('#modal-close')?.addEventListener('click', () => {
    $('#shortcuts-modal').close();
  });

  // Close modal on backdrop click
  $('#shortcuts-modal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) e.currentTarget.close();
  });

  // Update undo/redo button states
  updateUndoRedoButtons();
}

// Boot
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
