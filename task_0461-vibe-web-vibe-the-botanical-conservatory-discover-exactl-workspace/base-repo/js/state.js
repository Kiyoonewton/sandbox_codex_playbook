// ============================================================
// State Management & Persistence
// ============================================================

const STORAGE_KEYS = {
  favorites: 'botanica_favorites',
  recent: 'botanica_recent'
};

function loadFromStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable
  }
}

export const state = {
  currentSection: 'plants',
  activeCategory: 'all',
  filters: { light: '', petSafe: false, search: '' },
  selectedPlant: null,
  favorites: loadFromStorage(STORAGE_KEYS.favorites, []),
  recent: loadFromStorage(STORAGE_KEYS.recent, []),
  selectedSymptoms: [],
  quizAnswers: {},
  quizStep: 1,
  lightLevel: null,
  waterConfig: { pot: 'medium', climate: 'average', type: 'tropical' }
};

export function saveFavorites() {
  saveToStorage(STORAGE_KEYS.favorites, state.favorites);
}

export function saveRecent() {
  saveToStorage(STORAGE_KEYS.recent, state.recent.slice(0, 20));
}

export function addRecent(plantId) {
  state.recent = state.recent.filter(id => id !== plantId);
  state.recent.unshift(plantId);
  saveRecent();
}

export function toggleFavorite(plantId) {
  if (state.favorites.includes(plantId)) {
    state.favorites = state.favorites.filter(id => id !== plantId);
  } else {
    state.favorites.push(plantId);
  }
  saveFavorites();
  return state.favorites.includes(plantId);
}
