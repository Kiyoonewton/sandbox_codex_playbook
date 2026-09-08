// ============================================================
// THE BOTANICAL CONSERVATORY — Main Entry Point
// ============================================================

import { $, $$ } from './utils.js';
import { state } from './state.js';
import { initFilters, renderPlantGrid, renderRecentlyViewed } from './ui/plant-grid.js';
import { initDetail, setDetailCloseCallback } from './ui/detail-panel.js';
import { initDoctor } from './ui/doctor.js';
import { initLight } from './ui/light.js';
import { initWater } from './ui/water.js';
import { initQuiz } from './ui/quiz.js';
import { initKeyboard } from './keyboard.js';
import { initParticles, initRain } from './environment.js';

function switchSection(name) {
  state.currentSection = name;
  $$('.nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.section === name);
    if (b.dataset.section === name) b.setAttribute('aria-current', 'page');
    else b.removeAttribute('aria-current');
  });
  $$('.section').forEach(s => s.classList.remove('active'));
  const target = $(`#section-${name}`);
  if (target) {
    target.classList.add('active');
    target.style.animation = 'none';
    target.offsetHeight;
    target.style.animation = '';
  }
  // Scroll to top on section switch
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (name === 'plants') {
    renderRecentlyViewed();
  }
}

function initNav() {
  $$('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.dataset.section;
      switchSection(section);
    });
  });
}

function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  // Keyboard shortcut T for back to top
  document.addEventListener('keydown', (e) => {
    if (e.key === 't' || e.key === 'T') {
      if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'SELECT') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  });
}

// Screen reader announcements
export function announce(message) {
  const el = document.getElementById('sr-announcements');
  if (el) {
    el.textContent = '';
    requestAnimationFrame(() => { el.textContent = message; });
  }
}

function init() {
  initNav();
  initFilters();
  initDetail();
  initDoctor();
  initLight();
  initWater();
  initQuiz();
  initKeyboard();
  initParticles();
  initRain();
  initBackToTop();
  renderPlantGrid();

  // Wire up detail panel close callback to refresh recently viewed
  setDetailCloseCallback(() => {
    if (state.currentSection === 'plants') {
      renderRecentlyViewed();
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
