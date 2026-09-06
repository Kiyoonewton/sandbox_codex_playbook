/**
 * BreakpointBench — State Management
 * Central state, persistence, undo/redo
 */

export const state = {
  url: '',
  breakpoints: [
    { width: 320,  label: 'iPhone SE',      active: true,  device: 'phone' },
    { width: 375,  label: 'iPhone 14',      active: true,  device: 'phone' },
    { width: 390,  label: 'iPhone 14 Pro',  active: true,  device: 'phone' },
    { width: 768,  label: 'iPad Mini',      active: true,  device: 'tablet' },
    { width: 1024, label: 'iPad Pro',       active: true,  device: 'tablet' },
    { width: 1280, label: 'Laptop',         active: true,  device: 'desktop' },
    { width: 1440, label: 'Desktop',        active: true,  device: 'desktop' },
  ],
  zoom: 1,
  gap: 16,
  layout: 'flow',
  syncScroll: false,
  fitMode: false,
  bgTheme: '#F5F0EB',
  history: [],
};

// Undo/Redo stack
const historyStack = [];
let historyIndex = -1;

export function pushUndo() {
  historyStack.splice(historyIndex + 1);
  historyStack.push(JSON.parse(JSON.stringify({
    breakpoints: state.breakpoints,
    url: state.url
  })));
  historyIndex = historyStack.length - 1;
  if (historyStack.length > 50) {
    historyStack.shift();
    historyIndex--;
  }
}

export function undo() {
  if (historyIndex <= 0) return false;
  historyIndex--;
  restoreFromHistory();
  return true;
}

export function redo() {
  if (historyIndex >= historyStack.length - 1) return false;
  historyIndex++;
  restoreFromHistory();
  return true;
}

function restoreFromHistory() {
  const snap = historyStack[historyIndex];
  state.breakpoints = JSON.parse(JSON.stringify(snap.breakpoints));
  state.url = snap.url;
}

export function getUndoStackSize() {
  return historyStack.length;
}

// Persistence
const STORAGE_KEY = 'breakpointbench';

export function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      breakpoints: state.breakpoints,
      zoom: state.zoom,
      gap: state.gap,
      layout: state.layout,
      bgTheme: state.bgTheme,
      history: state.history,
      url: state.url,
    }));
  } catch (e) { /* quota exceeded */ }
}

export function loadFromStorage() {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!s) return null;
    if (s.breakpoints) state.breakpoints = s.breakpoints;
    if (s.zoom != null) state.zoom = s.zoom;
    if (s.gap) state.gap = s.gap;
    if (s.layout) state.layout = s.layout;
    if (s.bgTheme) state.bgTheme = s.bgTheme;
    if (s.history) state.history = s.history;
    return s;
  } catch (e) {
    return null;
  }
}
