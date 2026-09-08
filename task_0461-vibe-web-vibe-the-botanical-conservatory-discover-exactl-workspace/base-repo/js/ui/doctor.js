// ============================================================
// Plant Doctor (Symptom Diagnosis)
// ============================================================

import { state } from '../state.js';
import { SYMPTOM_ICONS } from '../utils.js';
import { PLANTS, SYMPTOMS } from '../plants.js';
import { $, $$ } from '../utils.js';

function updateDoctorResults() {
  const container = $('#doctor-results-inner');
  if (state.selectedSymptoms.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--ink-dim);padding:32px;">Select symptoms above to get a diagnosis.</p>';
    return;
  }

  const matches = [];
  PLANTS.forEach(plant => {
    plant.problems.forEach(prob => {
      if (state.selectedSymptoms.includes(prob.symptom)) {
        matches.push({ plant, ...prob });
      }
    });
  });

  if (matches.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--ink-dim);padding:32px;">No specific matches found for these symptoms. Try selecting different symptoms or consult a local plant expert.</p>';
    return;
  }

  container.innerHTML = matches.map((m, i) => `
    <div class="doctor-result-card" style="animation-delay: ${i * 0.08}s">
      <div class="doctor-result-plant">${m.plant.name}</div>
      <div class="doctor-result-symptom">Symptom: ${m.symptom}</div>
      <div class="doctor-result-detail">
        <div>
          <div class="detail-label">Likely Cause</div>
          <div class="detail-value">${m.cause}</div>
        </div>
        <div>
          <div class="detail-label">Recommended Fix</div>
          <div class="detail-value solution">→ ${m.solution}</div>
        </div>
      </div>
    </div>
  `).join('');
}

export function initDoctor() {
  const grid = $('#symptom-grid');
  grid.innerHTML = SYMPTOMS.map(s => `
    <button class="symptom-btn" data-symptom="${s}">
      <span class="symptom-icon">${SYMPTOM_ICONS[s] || '!'}</span>
      ${s}
    </button>
  `).join('');

  $$('.symptom-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const symptom = btn.dataset.symptom;
      if (state.selectedSymptoms.includes(symptom)) {
        state.selectedSymptoms = state.selectedSymptoms.filter(s => s !== symptom);
        btn.classList.remove('selected');
      } else {
        state.selectedSymptoms.push(symptom);
        btn.classList.add('selected');
      }
      updateDoctorResults();
    });
  });

  updateDoctorResults();
}
