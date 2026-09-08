// ============================================================
// Watering Station (Irrigation assistant)
// ============================================================

import { state } from '../state.js';
import { $, $$ } from '../utils.js';

const WATER_DATA = {
  tropical: {
    base: { small: 100, medium: 250, large: 400, xlarge: 600 },
    freq: { dry: 5, average: 7, humid: 10 },
    tip: {
      dry: 'Tropical plants need more frequent watering in arid climates. Consider a humidity tray.',
      average: 'Water when the top inch of soil feels dry. Ensure good drainage.',
      humid: 'In humid climates, tropical plants need less frequent watering. Watch for overwatering.'
    }
  },
  succulent: {
    base: { small: 50, medium: 120, large: 200, xlarge: 350 },
    freq: { dry: 14, average: 10, humid: 14 },
    tip: {
      dry: 'Even in dry climates, succulents prefer infrequent deep watering.',
      average: 'Let soil dry completely between waterings. Less is more.',
      humid: 'Be very careful not to overwater in humid conditions. Double the interval if soil stays wet.'
    }
  },
  fern: {
    base: { small: 150, medium: 300, large: 500, xlarge: 750 },
    freq: { dry: 3, average: 5, humid: 7 },
    tip: {
      dry: 'Ferns struggle in dry air. Mist daily and keep soil consistently moist.',
      average: 'Keep soil evenly moist but not waterlogged. Ferns prefer consistency.',
      humid: 'Your humid environment is perfect for ferns. Keep soil slightly moist.'
    }
  },
  flowering: {
    base: { small: 120, medium: 280, large: 450, xlarge: 650 },
    freq: { dry: 5, average: 7, humid: 9 },
    tip: {
      dry: 'Flowering plants in dry climates need careful watering. Avoid wetting blooms.',
      average: 'Water at the base to keep flowers healthy. Feed monthly during bloom.',
      humid: 'Good humidity helps blooms last longer. Ensure no standing water on petals.'
    }
  }
};

function updateWaterResult() {
  const { pot, climate, type } = state.waterConfig;
  const data = WATER_DATA[type];
  if (!data) return;

  const amount = data.base[pot] || 250;
  const days = data.freq[climate] || 7;
  const tip = data.tip[climate] || '';

  $('#water-amount').textContent = `${amount}ml`;
  $('#water-frequency').textContent = `Every ${days}–${days + 3} days`;
  $('#water-tips').textContent = tip;

  const stream = $('#water-stream');
  stream.classList.add('active');
  setTimeout(() => stream.classList.remove('active'), 2000);
}

export function initWater() {
  $$('#water-pot .water-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      state.waterConfig.pot = btn.dataset.value;
      $$('#water-pot .water-opt').forEach(b => b.classList.toggle('active', b === btn));
      updateWaterResult();
    });
  });

  $$('#water-climate .water-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      state.waterConfig.climate = btn.dataset.value;
      $$('#water-climate .water-opt').forEach(b => b.classList.toggle('active', b === btn));
      updateWaterResult();
    });
  });

  $$('#water-type .water-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      state.waterConfig.type = btn.dataset.value;
      $$('#water-type .water-opt').forEach(b => b.classList.toggle('active', b === btn));
      updateWaterResult();
    });
  });

  updateWaterResult();
}
