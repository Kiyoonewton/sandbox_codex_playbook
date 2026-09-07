// =============================================
// University Browser Rendering
// =============================================

import { $, highlightMatch } from '../utils.js';
import { getAllUniversities, removeCustomSchool, getState, getComparisonUnis } from '../state.js';

export function renderResults() {
  const list = $('#results-list');
  const empty = $('#browser-empty');
  const state = getState();
  const query = state.searchQuery.toLowerCase().trim();
  const filter = state.filterType;

  const allUnis = getAllUniversities();

  let filtered = allUnis.filter(uni => {
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
    const isCustom = uni.isCustom;
    return `
    <button class="uni-item ${isSelected ? 'selected' : ''}" data-uni-id="${uni.id}" role="listitem" aria-pressed="${isSelected}" style="animation: cardIn 0.25s ${i * 20}ms both" tabindex="0">
      <div class="uni-item__emblem" style="background:${uni.color}">${uni.short.slice(0, 2).toUpperCase()}</div>
      <div class="uni-item__info">
        <div class="uni-item__name">${highlightMatch(uni.short, query)}${isCustom ? ' <span class="uni-item__custom-badge">Custom</span>' : ''}</div>
        <div class="uni-item__meta">${uni.type === 'public' ? 'Public' : 'Private'}${uni.ivy ? ' · Ivy League' : ''}${uni.state ? ' · ' + uni.state : ''}</div>
      </div>
      <div class="uni-item__action">
        ${isCustom ? `<span class="uni-item__delete-btn" data-delete-custom="${uni.id}" title="Delete custom school" aria-label="Delete ${uni.short}" role="button" tabindex="0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </span>` : ''}
        <div class="uni-item__check">
          ${isSelected ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
        </div>
      </div>
      <span class="uni-item__add-label ${isSelected ? 'uni-item__add-label--remove' : ''}">${isSelected ? 'Remove' : 'Add'}</span>
    </button>`;
  }).join('');
}

export function updateComparisonCount() {
  const el = $('#comparison-count');
  if (el) el.textContent = getState().comparisonIds.length;
}
