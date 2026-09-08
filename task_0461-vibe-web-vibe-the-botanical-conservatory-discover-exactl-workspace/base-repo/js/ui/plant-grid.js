// ============================================================
// Plant Grid View
// ============================================================

import { state, addRecent } from '../state.js';
import { $, $$, CATEGORY_COLORS, CATEGORY_GRADIENTS, PET_SAFE_ICON } from '../utils.js';
import { getPlantSVG } from '../plant-svgs.js';

import { PLANTS } from '../plants.js';

// Lazy-loaded to avoid circular dependency
let _openDetail = null;

async function handlePlantClick(plantId) {
  if (!_openDetail) {
    const mod = await import('./detail-panel.js');
    _openDetail = mod.openDetail;
  }
  _openDetail(plantId);
}

export function initFilters() {
  $$('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeCategory = btn.dataset.category;
      $$('.cat-btn').forEach(b => b.classList.toggle('active', b === btn));
      renderPlantGrid();
    });
  });

  $('#filter-light').addEventListener('change', (e) => {
    state.filters.light = e.target.value;
    renderPlantGrid();
  });

  $('#filter-pet').addEventListener('change', (e) => {
    state.filters.petSafe = e.target.checked;
    renderPlantGrid();
  });

  $('#filter-search').addEventListener('input', (e) => {
    state.filters.search = e.target.value;
    renderPlantGrid();
  });
}

export function filterPlants() {
  return PLANTS.filter(p => {
    if (state.activeCategory !== 'all' && p.category !== state.activeCategory) return false;
    if (state.filters.light) {
      const lightVal = state.filters.light.toLowerCase();
      const pLight = p.light.toLowerCase();
      if (lightVal === 'low' && !pLight.startsWith('low')) return false;
      if (lightVal === 'medium' && !pLight.includes('medium')) return false;
      if (lightVal === 'bright' && !pLight.includes('bright')) return false;
      if (lightVal === 'direct' && !(pLight.includes('direct sun') || pLight.includes('to direct'))) return false;
    }
    if (state.filters.petSafe && !p.petSafe) return false;
    if (state.filters.search) {
      const q = state.filters.search.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.scientific.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

export function renderPlantGrid() {
  const grid = $('#plant-grid');
  const empty = $('#empty-state');
  const filtered = filterPlants();

  if (filtered.length === 0) {
    grid.style.display = 'none';
    empty.style.display = 'block';
    return;
  }

  grid.style.display = '';
  empty.style.display = 'none';

  grid.innerHTML = filtered.map(plant => `
    <div class="plant-card" tabindex="0" role="button" aria-label="View ${plant.name} care guide" data-plant-id="${plant.id}">
      <div class="plant-card-visual" style="background: ${CATEGORY_GRADIENTS[plant.category] || ''}">
        <span class="plant-card-category" style="color: ${CATEGORY_COLORS[plant.category] || 'var(--copper)'}">${plant.category}</span>
        ${plant.petSafe ? `<span class="plant-card-pet">${PET_SAFE_ICON}</span>` : ''}
        <div class="plant-card-leaf">${getPlantSVG(plant.id)}</div>
      </div>
      <div class="plant-card-body">
        <div class="plant-card-name">${plant.name}</div>
        <div class="plant-card-sci">${plant.scientific}</div>
        <div class="plant-card-meta">
          <div class="meta-item"><span class="meta-dot light"></span>${plant.light.split(' ')[0]}</div>
          <div class="meta-item"><span class="meta-dot water"></span>${plant.water}</div>
          <div class="meta-item"><span class="meta-dot diff"></span>${plant.difficulty.split(' ')[0]}</div>
          <div class="meta-item"><span class="meta-dot pet"></span>${plant.petSafe ? 'Pet Safe' : 'Not Pet Safe'}</div>
        </div>
      </div>
    </div>
  `).join('');

  $$('.plant-card').forEach(card => {
    card.addEventListener('click', () => handlePlantClick(card.dataset.plantId));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handlePlantClick(card.dataset.plantId);
      }
    });
  });

  renderRecentlyViewed();
}

export function renderRecentlyViewed() {
  const container = document.getElementById('recently-viewed');
  const scroll = document.getElementById('recent-scroll');
  if (!container || !scroll || state.recent.length === 0) {
    if (container) container.style.display = 'none';
    return;
  }
  container.style.display = 'block';
  scroll.innerHTML = state.recent.slice(0, 10).map(id => {
    const plant = PLANTS.find(p => p.id === id);
    if (!plant) return '';
    return `<div class="recent-chip" data-plant-id="${plant.id}" tabindex="0" role="button" aria-label="Recently viewed: ${plant.name}">
      <span class="recent-chip-emoji">${getPlantSVG(plant.id, 16)}</span>
      ${plant.name}
    </div>`;
  }).join('');

  scroll.querySelectorAll('.recent-chip').forEach(chip => {
    chip.addEventListener('click', () => handlePlantClick(chip.dataset.plantId));
    chip.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handlePlantClick(chip.dataset.plantId); }
    });
  });
}
