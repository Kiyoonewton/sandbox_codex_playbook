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
    if (raw) return JSON.parse(raw);
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
      parsed.comparisonIds = (parsed.comparisonIds || []);
      return { ...getDefaultState(), ...parsed };
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

export function pushUndo() {
  undoStack.push([..._state.comparisonIds]);
  redoStack = [];
  if (undoStack.length > 30) undoStack.shift();
}

export function undo() {
  if (undoStack.length === 0) return false;
  redoStack.push([..._state.comparisonIds]);
  _state.comparisonIds = undoStack.pop();
  saveState();
  return true;
}

export function redo() {
  if (redoStack.length === 0) return false;
  undoStack.push([..._state.comparisonIds]);
  _state.comparisonIds = redoStack.pop();
  saveState();
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
