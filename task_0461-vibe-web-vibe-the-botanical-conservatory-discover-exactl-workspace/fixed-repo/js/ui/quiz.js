// ============================================================
// Plant Match Quiz
// ============================================================

import { state } from '../state.js';
import { $, $$ } from '../utils.js';
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

function showQuizResults() {
  $$('.quiz-step').forEach(s => s.classList.remove('active'));
  $('#quiz-progress').style.display = 'none';
  const results = $('#quiz-results');
  results.style.display = 'block';

  const { travel, experience, lighting, pets } = state.quizAnswers;
  const scored = PLANTS.map(p => {
    let score = 0;
    let reasons = [];

    if (travel === 'often' || travel === 'sometimes') {
      if (['Beginner-Friendly', 'Easy to Moderate'].includes(p.difficulty)) { score += 3; reasons.push('Low maintenance'); }
      if (p.water.includes('2–3 Weeks') || p.water.includes('3–4')) { score += 2; reasons.push('Infrequent watering'); }
    } else {
      score += 1;
    }

    if (experience === 'beginner') {
      if (p.difficulty.includes('Beginner') || p.difficulty.includes('Easy')) { score += 4; reasons.push('Great for beginners'); }
    } else if (experience === 'intermediate') {
      if (!p.difficulty.includes('Expert')) { score += 3; reasons.push('Fits your skill level'); }
    } else {
      score += 2;
      if (p.difficulty.includes('Expert') || p.difficulty.includes('Moderate')) { score += 2; reasons.push('Rewarding challenge'); }
    }

    if (lighting === 'low' && (p.light.includes('Low') || p.light.includes('Medium'))) { score += 3; reasons.push('Tolerates low light'); }
    if (lighting === 'medium' && !p.light.includes('Direct')) { score += 2; reasons.push('Matches your light'); }
    if (lighting === 'bright' && p.light.includes('Bright')) { score += 3; reasons.push('Loves your bright space'); }
    if (lighting === 'direct' && p.light.includes('Direct')) { score += 4; reasons.push('Thrives in direct sun'); }

    if (pets === 'yes') {
      if (p.petSafe) { score += 5; reasons.push('Pet safe!'); }
      else { score -= 3; }
    } else if (pets === 'sometimes') {
      if (p.petSafe) { score += 2; reasons.push('Pet safe'); }
    }

    return { plant: p, score, reasons: reasons.slice(0, 2) };
  });

  const top = scored.sort((a, b) => b.score - a.score).slice(0, 6);

  $('#quiz-results-grid').innerHTML = top.map((m, i) => `
    <div class="quiz-match-card" data-plant-id="${m.plant.id}" style="animation-delay: ${i * 0.1}s">
      <div class="quiz-match-emoji">${getPlantSVG(m.plant.id, 48)}</div>
      <div class="quiz-match-name">${m.plant.name}</div>
      <div class="quiz-match-reason">${m.reasons.join(' · ') || 'Great match'}</div>
      <div class="quiz-match-meta">${m.plant.difficulty} · ${m.plant.light}</div>
    </div>
  `).join('');

  $$('.quiz-match-card').forEach(card => {
    card.addEventListener('click', () => handlePlantClick(card.dataset.plantId));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handlePlantClick(card.dataset.plantId); }
    });
  });
}

function updateQuizUI() {
  $$('.quiz-step').forEach(s => {
    const step = parseInt(s.dataset.step);
    s.classList.toggle('active', step === state.quizStep);
  });
  $('#quiz-progress-fill').style.width = `${(state.quizStep / 4) * 100}%`;
  $('#quiz-progress-text').textContent = `Question ${state.quizStep} of 4`;
}

function resetQuiz() {
  state.quizAnswers = {};
  state.quizStep = 1;
  $('#quiz-results').style.display = 'none';
  $('#quiz-progress').style.display = '';
  $$('.quiz-opt').forEach(b => { b.style.borderColor = ''; b.style.background = ''; });
  updateQuizUI();
}

export function initQuiz() {
  $$('.quiz-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.dataset.q;
      const v = btn.dataset.v;
      state.quizAnswers[q] = v;

      btn.parentElement.querySelectorAll('.quiz-opt').forEach(b => {
        b.style.borderColor = '';
        b.style.background = '';
      });
      btn.style.borderColor = 'var(--copper)';
      btn.style.background = 'rgba(200, 135, 95, 0.1)';

      setTimeout(() => {
        if (state.quizStep < 4) {
          state.quizStep++;
          updateQuizUI();
        } else {
          showQuizResults();
        }
      }, 400);
    });
  });

  $('#quiz-restart').addEventListener('click', resetQuiz);
  updateQuizUI();
}
