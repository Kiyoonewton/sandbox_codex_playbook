// ============================================================
// Light Simulator (Sunlight dome)
// ============================================================

import { state } from '../state.js';
import { $, $$, LIGHT_ICONS } from '../utils.js';
import { getPlantSVG } from '../plant-svgs.js';
import { PLANTS } from '../plants.js';

let _openDetail = null;

async function handlePlantClick(plantId) {
  if (!_openDetail) {
    const mod = await import('./detail-panel.js');
    _openDetail = mod.openDetail;
  }
  _openDetail(plantId);
}

const LIGHT_DATA = {
  low: {
    icon: LIGHT_ICONS['low'], label: 'Low Light', class: 'active-low',
    match: p => p.light.includes('Low') || p.light.toLowerCase().includes('low')
  },
  medium: {
    icon: LIGHT_ICONS['medium'], label: 'Medium / Indirect Light', class: 'active-medium',
    match: p => p.light.includes('Medium') || p.light.includes('Bright') || p.light.includes('Indirect') || p.light.includes('Average')
  },
  bright: {
    icon: LIGHT_ICONS['bright'], label: 'Bright Indirect Light', class: 'active-bright',
    match: p => p.light.includes('Bright') || p.light.includes('Direct')
  },
  direct: {
    icon: LIGHT_ICONS['direct'], label: 'Direct Sunlight', class: 'active-direct',
    match: p => p.light.includes('Direct')
  }
};

export function initLight() {
  $$('.light-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const level = btn.dataset.level;
      state.lightLevel = level;
      $$('.light-btn').forEach(b => b.classList.toggle('active', b === btn));

      const data = LIGHT_DATA[level];
      const sphere = $('#light-sphere');
      sphere.className = 'light-sphere';
      if (data.class) sphere.classList.add(data.class);

      $('#light-icon').innerHTML = data.icon;
      $('#light-label').textContent = data.label;

      const matches = PLANTS.filter(data.match);
      const container = $('#light-results');

      if (matches.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:var(--ink-dim);padding:20px;">No plants match this light level exactly.</p>';
      } else {
        container.innerHTML = `
          <div class="light-result-title">${matches.length} plants will thrive in ${data.label.toLowerCase()}</div>
          <div class="light-plants-grid">
            ${matches.map(p => `
              <div class="light-plant-card" data-plant-id="${p.id}" tabindex="0" role="button" aria-label="View ${p.name}">
                <div class="light-plant-emoji">${getPlantSVG(p.id, 40)}</div>
                <div class="light-plant-name">${p.name}</div>
                <div class="light-plant-meta">${p.difficulty} · ${p.water}</div>
              </div>
            `).join('')}
          </div>
        `;

        $$('.light-plant-card').forEach(card => {
          card.addEventListener('click', () => handlePlantClick(card.dataset.plantId));
          card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handlePlantClick(card.dataset.plantId); }
          });
        });
      }
    });
  });
}
