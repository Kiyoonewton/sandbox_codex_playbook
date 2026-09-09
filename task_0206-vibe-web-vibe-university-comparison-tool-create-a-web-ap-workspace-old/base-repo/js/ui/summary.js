// =============================================
// Summary Section Rendering
// =============================================

import { $, formatCurrency, formatNumber, formatPercent } from '../utils.js';
import { getComparisonUnis, calculateValueScore } from '../state.js';

export function renderSummary() {
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
  const lowestTuition = comparisons.reduce((a, b) => a.tuition < b.tuition ? a : b);
  const highestSalary = comparisons.reduce((a, b) => a.avgSalary > b.avgSalary ? a : b);
  const bestAcceptUni = comparisons.reduce((a, b) => a.acceptanceRate > b.acceptanceRate ? a : b);

  const valueScores = comparisons.map(u => ({ id: u.id, short: u.short, score: calculateValueScore(u) }));
  const maxScore = Math.max(...valueScores.map(v => v.score));

  grid.innerHTML = `
    <div class="summary-card summary-card--accent">
      <span class="summary-card__label">Best Value</span>
      <span class="summary-card__value">${highestSalary.short}</span>
      <span class="summary-card__detail">Highest avg starting salary: <span class="summary-card__highlight">${formatCurrency(highestSalary.avgSalary)}</span></span>
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
