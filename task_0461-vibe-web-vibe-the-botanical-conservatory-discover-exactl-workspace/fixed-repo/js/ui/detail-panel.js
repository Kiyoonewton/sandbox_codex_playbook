// ============================================================
// Detail Panel (Slide-out plant care guide)
// ============================================================

import { state, addRecent, toggleFavorite } from '../state.js';
import { $, CATEGORY_COLORS, CATEGORY_GRADIENTS, PET_SAFE_ICON, PET_UNSAFE_ICON } from '../utils.js';
import { getPlantSVG } from '../plant-svgs.js';
import { PLANTS } from '../plants.js';

// Lazy reference to avoid circular dependency
let onDetailClose = null;

export function setDetailCloseCallback(fn) {
  onDetailClose = fn;
}

// Module-level overlay reference — created in initDetail() after DOM is ready
let overlay = null;

export function openDetail(plantId) {
  const plant = PLANTS.find(p => p.id === plantId);
  if (!plant) return;
  state.selectedPlant = plant;
  addRecent(plantId);

  const isFav = state.favorites.includes(plantId);
  const content = $('#detail-content');

  const petIconHtml = plant.petSafe
    ? `<span class="detail-hero-pet-icon">${PET_SAFE_ICON}</span> Pet Safe`
    : `<span class="detail-hero-pet-icon detail-hero-pet-icon--unsafe">${PET_UNSAFE_ICON}</span> Not Pet Safe`;

  // SVG heart icons for the favorite button
  const filledHeart = '<svg viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor" style="vertical-align:middle"><path d="M8 14s-5.5-3.5-5.5-7A3.5 3.5 0 0 1 8 4.5 3.5 3.5 0 0 1 13.5 7C13.5 10.5 8 14 8 14Z"/></svg>';
  const outlineHeart = '<svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.2" style="vertical-align:middle"><path d="M8 14s-5.5-3.5-5.5-7A3.5 3.5 0 0 1 8 4.5 3.5 3.5 0 0 1 13.5 7C13.5 10.5 8 14 8 14Z"/></svg>';

  content.innerHTML = `
    <div class="detail-hero" style="background: ${CATEGORY_GRADIENTS[plant.category] || ''}">
      <span class="detail-hero-category" style="color: ${CATEGORY_COLORS[plant.category]}">${plant.category}</span>
      <span class="detail-hero-pet">${petIconHtml}</span>
      <div class="detail-hero-leaf">${getPlantSVG(plant.id, 120)}</div>
    </div>
    <div class="detail-name">${plant.name}</div>
    <div class="detail-sci">${plant.scientific}</div>
    <div class="detail-desc">${plant.description}</div>
    <div class="detail-stats">
      <div class="stat-card">
        <div class="stat-label">Difficulty</div>
        <div class="stat-value">${plant.difficulty}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Light</div>
        <div class="stat-value">${plant.light}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Water</div>
        <div class="stat-value">${plant.water}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Humidity</div>
        <div class="stat-value">${plant.humidity}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Growth Rate</div>
        <div class="stat-value">${plant.growthRate}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Pet Safety</div>
        <div class="stat-value ${plant.petSafe ? 'safe' : 'unsafe'}">${plant.petSafe ? 'Safe for Pets' : 'Toxic to Pets'}</div>
      </div>
    </div>
    ${plant.problems.length > 0 ? `
      <div class="detail-problems-title">Common Problems</div>
      ${plant.problems.map(p => `
        <div class="problem-card">
          <div class="problem-symptom">${p.symptom}</div>
          <div class="problem-cause">Cause: ${p.cause}</div>
          <div class="problem-solution">→ ${p.solution}</div>
        </div>
      `).join('')}
    ` : ''}
    <button class="detail-fav ${isFav ? 'active' : ''}" id="detail-fav-btn">
      ${isFav ? `${filledHeart} In Your Collection` : `${outlineHeart} Add to Collection`}
    </button>
  `;

  $('#detail-fav-btn').addEventListener('click', () => {
    const nowFav = toggleFavorite(plantId);
    const btn = $('#detail-fav-btn');
    btn.classList.toggle('active', nowFav);
    btn.innerHTML = nowFav ? `${filledHeart} In Your Collection` : `${outlineHeart} Add to Collection`;
  });

  // Scroll the panel back to top
  const panel = $('#detail-panel');
  panel.scrollTop = 0;

  panel.classList.add('open');
  if (overlay) {
    overlay.style.pointerEvents = 'auto';
    overlay.classList.add('active');
  }
}

export function closeDetail() {
  $('#detail-panel').classList.remove('open');
  if (overlay) {
    overlay.classList.remove('active');
    overlay.style.pointerEvents = 'none';
  }
  state.selectedPlant = null;
  if (onDetailClose) onDetailClose();
}

export function initDetail() {
  // Create overlay after DOM is ready
  overlay = document.createElement('div');
  overlay.className = 'detail-overlay';
  overlay.style.pointerEvents = 'none';
  document.body.appendChild(overlay);

  $('#detail-close').addEventListener('click', closeDetail);
  overlay.addEventListener('click', closeDetail);
  // Escape key is handled by keyboard.js — no duplicate listener needed here
}
