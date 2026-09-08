// =============================================
// State Management, Persistence, Undo/Redo
// =============================================

import { UNIVERSITIES } from './data.js';

const STORAGE_KEY = 'uni-compare-v2';
const CUSTOM_STORAGE_KEY = 'uni-compare-custom';

// ---- Custom Schools ----
let _customSchools = loadCustomSchools();

function loadCustomSchools() {
  try {
    const raw = localStorage.getItem(CUSTOM_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (e) { /* ignore */ }
  return [];
}

function saveCustomSchools() {
  try {
    localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(_customSchools));
  } catch (e) { /* ignore */ }
}

export function getCustomSchools() {
  return _customSchools;
}

export function addCustomSchool(school) {
  const id = 'custom-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
  const newSchool = {
    id,
    name: school.name,
    short: school.short || school.name,
    state: school.state || '',
    type: school.type || 'public',
    ivy: false,
    tuition: Number(school.tuition) || 0,
    enrollment: Number(school.enrollment) || 0,
    acceptanceRate: Number(school.acceptanceRate) || 0,
    studentFacultyRatio: Number(school.studentFacultyRatio) || 10,
    location: school.location || '',
    color: school.color || '#52B883',
    graduationRate: Number(school.graduationRate) || 0,
    avgSalary: Number(school.avgSalary) || 0,
    isCustom: true,
  };
  _customSchools.push(newSchool);
  saveCustomSchools();
  return newSchool;
}

export function removeCustomSchool(id) {
  _customSchools = _customSchools.filter(s => s.id !== id);
  saveCustomSchools();
}

export function clearCustomSchools() {
  _customSchools = [];
  saveCustomSchools();
}

// ---- All Universities (preset + custom) ----
export function getAllUniversities() {
  return [...UNIVERSITIES, ..._customSchools];
}

function validUniversityIds() {
  return new Set(getAllUniversities().map(u => u.id));
}

function normalizeComparisonIds(ids) {
  if (!Array.isArray(ids)) return [];
  const valid = validUniversityIds();
  const seen = new Set();
  return ids.filter(id => {
    if (typeof id !== 'string' || !valid.has(id) || seen.has(id) || seen.size >= 4) return false;
    seen.add(id);
    return true;
  });
}

// ---- Core State ----
let _state = loadState();

function getDefaultState() {
  return {
    comparisonIds: [],
    searchQuery: '',
    filterType: 'all',
    viewMode: 'cards',
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const state = { ...getDefaultState(), ...parsed };
      state.comparisonIds = normalizeComparisonIds(state.comparisonIds);
      state.viewMode = state.viewMode === 'table' ? 'table' : 'cards';
      return state;
    }
  } catch (e) { /* ignore */ }
  return getDefaultState();
}

export function getState() { return _state; }

export function setState(patch) {
  Object.assign(_state, patch);
  saveState();
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      comparisonIds: _state.comparisonIds,
      viewMode: _state.viewMode,
    }));
  } catch (e) { /* ignore */ }
}

export { saveState };

// ---- Undo/Redo ----
let undoStack = [];
let redoStack = [];

function snapshot() {
  return {
    comparisonIds: [..._state.comparisonIds],
    customSchools: _customSchools.map(s => ({ ...s })),
  };
}

function sameSnapshot(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function restoreSnapshot(entry) {
  _customSchools = entry.customSchools.map(s => ({ ...s }));
  _state.comparisonIds = [...entry.comparisonIds];
  saveCustomSchools();
  saveState();
}

export function pushUndo() {
  const current = snapshot();
  const previous = undoStack[undoStack.length - 1];
  if (!previous || !sameSnapshot(previous, current)) {
    undoStack.push(current);
    if (undoStack.length > 30) undoStack.shift();
  }
  redoStack = [];
}

export function undo() {
  if (undoStack.length === 0) return false;
  const current = snapshot();
  const previous = undoStack.pop();
  if (sameSnapshot(previous, current)) return undo();
  redoStack.push(current);
  restoreSnapshot(previous);
  return true;
}

export function redo() {
  if (redoStack.length === 0) return false;
  const current = snapshot();
  const next = redoStack.pop();
  if (sameSnapshot(next, current)) return redo();
  undoStack.push(current);
  if (undoStack.length > 30) undoStack.shift();
  restoreSnapshot(next);
  return true;
}

export function canUndo() { return undoStack.length > 0; }
export function canRedo() { return redoStack.length > 0; }

// ---- University Lookups ----
export function getUni(id) {
  return getAllUniversities().find(u => u.id === id);
}

export function getComparisonUnis() {
  return _state.comparisonIds.map(getUni).filter(Boolean);
}

// ---- Value Scoring ----
export function calculateValueScore(uni) {
  const tuitionScore = 1 - (uni.tuition / 70000);
  const acceptScore = uni.acceptanceRate / 30;
  const ratioScore = 1 - (uni.studentFacultyRatio / 25);
  const salaryScore = uni.avgSalary / 120000;
  return (tuitionScore * 0.35) + (acceptScore * 0.2) + (ratioScore * 0.2) + (salaryScore * 0.25);
}

export function getBestInMetric(comparisons, metric) {
  if (comparisons.length < 2) return null;
  const values = comparisons.map(u => {
    switch (metric) {
      case 'tuition': return u.tuition;
      case 'acceptanceRate': return u.acceptanceRate;
      case 'enrollment': return u.enrollment;
      case 'studentFacultyRatio': return u.studentFacultyRatio;
      case 'graduationRate': return u.graduationRate;
      case 'avgSalary': return u.avgSalary;
      case 'value': return calculateValueScore(u);
      default: return 0;
    }
  });
  const bestIdx = metric === 'tuition' || metric === 'studentFacultyRatio'
    ? values.indexOf(Math.min(...values))
    : values.indexOf(Math.max(...values));
  return comparisons[bestIdx].id;
}
