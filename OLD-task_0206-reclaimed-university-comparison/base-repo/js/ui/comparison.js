// =============================================
// Comparison Grid & Table Rendering
// =============================================

import { $, formatCurrency, formatNumber, formatPercent } from '../utils.js';
import { getState, getComparisonUnis, getBestInMetric, calculateValueScore } from '../state.js';

export function renderComparisonGrid() {
  const grid = $('#comparison-grid');
  const empty = $('#comparison-empty');
  const comparisons = getComparisonUnis();
  const state = getState();

  if (comparisons.length === 0) {
    grid.innerHTML = '';
    grid.hidden = true;
    empty.hidden = false;
    return;
  }

  empty.hidden = true;

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

export function renderComparisonTable() {
  const wrap = $('#comparison-table-wrap');
  const table = $('#comparison-table');
  const comparisons = getComparisonUnis();
  const state = getState();

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

export function updateViewToggle() {
  const state = getState();
  const count = state.comparisonIds.length;
  const viewToggle = $('#view-toggle');
  if (viewToggle) viewToggle.hidden = count < 2;

  document.querySelectorAll('.view-btn').forEach(btn => {
    const isActive = btn.dataset.view === state.viewMode;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive);
  });

  const grid = $('#comparison-grid');
  const tableWrap = $('#comparison-table-wrap');
  if (grid && state.viewMode === 'table' && getComparisonUnis().length >= 2) {
    grid.hidden = true;
  }
  if (tableWrap && getComparisonUnis().length < 2) {
    tableWrap.hidden = true;
  }
}
