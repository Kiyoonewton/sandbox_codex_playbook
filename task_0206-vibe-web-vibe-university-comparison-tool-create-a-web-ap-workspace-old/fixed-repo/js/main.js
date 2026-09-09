// =============================================
// University Comparison Studio — Main Entry
// =============================================

import { $, $$ } from './utils.js';
import { getState, setState, pushUndo, undo, redo, canUndo, canRedo, getUni, getComparisonUnis, saveState, addCustomSchool, removeCustomSchool, clearCustomSchools } from './state.js';
import { renderComparisonGrid, renderComparisonTable, updateViewToggle } from './ui/comparison.js';
import { renderSummary } from './ui/summary.js';
import { renderResults, updateComparisonCount } from './ui/browser.js';
import { initKeyboard } from './keyboard.js';
import { trapFocus, releaseFocusTrap } from './focus-trap.js';

// ---- Toast System ----
function showToast(message, type = 'info') {
  const container = $('#toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  const icon = type === 'success'
    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>'
    : type === 'error'
    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
    : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
  toast.innerHTML = icon + message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('leaving');
    toast.addEventListener('animationend', () => toast.remove());
  }, 2500);
}

// ---- Actions ----
function toggleComparison(id) {
  const state = getState();
  const idx = state.comparisonIds.indexOf(id);
  if (idx >= 0) {
    pushUndo();
    state.comparisonIds.splice(idx, 1);
    showToast(`Removed ${getUni(id)?.short} from comparison`, 'info');
  } else {
    if (state.comparisonIds.length >= 4) {
      showToast('Maximum 4 universities at a time', 'error');
      return;
    }
    pushUndo();
    state.comparisonIds.push(id);
    showToast(`Added ${getUni(id)?.short} to comparison`, 'success');
  }
  render();
}

function undoAction() {
  if (undo()) {
    render();
    updateUndoRedoButtons();
    showToast('Undo', 'info');
  }
}

function redoAction() {
  if (redo()) {
    render();
    updateUndoRedoButtons();
    showToast('Redo', 'info');
  }
}

function resetComparison() {
  pushUndo();
  getState().comparisonIds = [];
  clearCustomSchools();
  render();
  updateUndoRedoButtons();
  showToast('Comparison reset', 'info');
}

function exportComparison() {
  const comparisons = getComparisonUnis();
  if (comparisons.length === 0) {
    showToast('Nothing to export — add universities first', 'error');
    return;
  }

  const header = ['University', 'Location', 'Type', 'Tuition', 'Enrollment', 'Acceptance Rate', 'Student:Faculty', 'Graduation Rate', 'Avg Salary'];
  const rows = comparisons.map(u => [
    u.name, u.location, u.type, u.tuition, u.enrollment,
    u.acceptanceRate + '%', u.studentFacultyRatio + ':1',
    u.graduationRate + '%', '$' + u.avgSalary
  ]);

  const csv = [header.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `university-comparison-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Comparison exported as CSV', 'success');
}

function updateUndoRedoButtons() {
  const undoBtn = $('#btn-undo');
  const redoBtn = $('#btn-redo');
  if (undoBtn) undoBtn.disabled = !canUndo();
  if (redoBtn) redoBtn.disabled = !canRedo();
}

// ---- Form Validation Helpers ----
function clearFormErrors() {
  document.querySelectorAll('.form-error').forEach(el => { el.textContent = ''; });
  document.querySelectorAll('.form-input').forEach(el => { el.classList.remove('input-error', 'input-valid'); });
}

function setFieldError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const err = document.getElementById(errorId);
  if (input) input.classList.add('input-error');
  if (err) err.textContent = message;
}

function validateField(input, errorId, opts = {}) {
  const val = input.value.trim();
  if (opts.required && !val) {
    input.classList.add('input-error');
    document.getElementById(errorId).textContent = 'Required';
    return false;
  }
  if (opts.min !== undefined && Number(val) < opts.min) {
    input.classList.add('input-error');
    document.getElementById(errorId).textContent = `Min: ${opts.min}`;
    return false;
  }
  if (opts.max !== undefined && Number(val) > opts.max) {
    input.classList.add('input-error');
    document.getElementById(errorId).textContent = `Max: ${opts.max}`;
    return false;
  }
  input.classList.add('input-valid');
  return true;
}

// ---- Custom School Form ----
function initAddSchoolForm() {
  const modal = $('#add-school-modal');
  const form = $('#add-school-form');
  const addBtn = $('#btn-add-school');
  const cancelBtn = $('#add-school-cancel');
  const colorInput = $('#school-color');
  const colorPreview = $('#color-preview');

  if (!modal || !form || !addBtn) return;

  addBtn.addEventListener('click', () => {
    clearFormErrors();
    form.reset();
    colorInput.value = '#52B883';
    if (colorPreview) { colorPreview.textContent = '#52B883'; colorPreview.style.color = '#52B883'; }
    modal.showModal();
    trapFocus(modal);
    // Focus first field after animation
    requestAnimationFrame(() => {
      $('#school-name')?.focus();
    });
  });

  cancelBtn?.addEventListener('click', () => {
    releaseFocusTrap(modal);
    modal.close();
  });

  // Close on backdrop
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      releaseFocusTrap(modal);
      modal.close();
    }
  });

  // Color preview sync
  colorInput?.addEventListener('input', () => {
    if (colorPreview) colorPreview.textContent = colorInput.value;
    if (colorPreview) colorPreview.style.color = colorInput.value;
  });

  // Inline validation on blur
  const validators = [
    { id: 'school-name', errId: 'school-name-err', opts: { required: true } },
    { id: 'school-short', errId: 'school-short-err', opts: { required: true } },
    { id: 'school-tuition', errId: 'school-tuition-err', opts: { required: true, min: 1 } },
    { id: 'school-enrollment', errId: 'school-enrollment-err', opts: { required: true, min: 1 } },
    { id: 'school-acceptance', errId: 'school-acceptance-err', opts: { required: true, min: 0.1, max: 100 } },
  ];

  validators.forEach(v => {
    const input = document.getElementById(v.id);
    if (!input) return;
    input.addEventListener('blur', () => {
      const errEl = document.getElementById(v.errId);
      if (errEl) errEl.textContent = '';
      input.classList.remove('input-error', 'input-valid');
      validateField(input, v.errId, v.opts);
    });
    // Clear error on input
    input.addEventListener('input', () => {
      const errEl = document.getElementById(v.errId);
      if (errEl) errEl.textContent = '';
      input.classList.remove('input-error');
    });
  });

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearFormErrors();

    let hasError = false;
    validators.forEach(v => {
      const input = document.getElementById(v.id);
      if (input && !validateField(input, v.errId, v.opts)) hasError = true;
    });

    if (hasError) {
      showToast('Please fix the highlighted fields', 'error');
      // Focus first error field
      const firstError = form.querySelector('.input-error');
      if (firstError) firstError.focus();
      return;
    }

    const name = $('#school-name').value.trim();
    const short = $('#school-short').value.trim();
    const location = $('#school-location').value.trim();
    const state = $('#school-state').value.trim().toUpperCase();
    const type = $('#school-type').value;
    const color = colorInput.value;
    const tuition = Number($('#school-tuition').value) || 0;
    const enrollment = Number($('#school-enrollment').value) || 0;
    const acceptance = Number($('#school-acceptance').value) || 0;
    const ratio = Number($('#school-ratio').value) || 15;
    const gradrate = Number($('#school-gradrate').value) || 0;
    const salary = Number($('#school-salary').value) || 0;

    const newSchool = addCustomSchool({
      name, short, state, type, color,
      tuition, enrollment,
      acceptanceRate: acceptance,
      studentFacultyRatio: ratio,
      graduationRate: gradrate,
      avgSalary: salary,
      location: location || (state ? `${state}` : ''),
    });

    showToast(`Added "${newSchool.short}" to your schools`, 'success');
    form.reset();
    colorInput.value = '#52B883';
    if (colorPreview) { colorPreview.textContent = '#52B883'; colorPreview.style.color = '#52B883'; }
    releaseFocusTrap(modal);
    modal.close();
    render();
  });

  // Escape key handling for modal
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.open) {
      modal.close();
    }
  });
}

// ---- Delete Confirmation Dialog ----
let _pendingDeleteId = null;

function showDeleteConfirm(id) {
  const modal = $('#delete-confirm-modal');
  const nameEl = $('#delete-school-name');
  const uni = getUni(id);
  if (!modal || !uni) return;
  
  _pendingDeleteId = id;
  nameEl.textContent = uni.short;
  modal.showModal();
  trapFocus(modal);
  requestAnimationFrame(() => {
    $('#delete-cancel')?.focus();
  });
}

function initDeleteConfirm() {
  const modal = $('#delete-confirm-modal');
  const confirmBtn = $('#delete-confirm');
  const cancelBtn = $('#delete-cancel');

  if (!modal) return;

  confirmBtn?.addEventListener('click', () => {
    if (_pendingDeleteId) {
      pushUndo();
      const state = getState();
      const idx = state.comparisonIds.indexOf(_pendingDeleteId);
      if (idx >= 0) state.comparisonIds.splice(idx, 1);
      const uni = getUni(_pendingDeleteId);
      removeCustomSchool(_pendingDeleteId);
      showToast(`Deleted "${uni?.short}"`, 'info');
      _pendingDeleteId = null;
      render();
    }
    releaseFocusTrap(modal);
    modal.close();
  });

  cancelBtn?.addEventListener('click', () => {
    _pendingDeleteId = null;
    releaseFocusTrap(modal);
    modal.close();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      _pendingDeleteId = null;
      releaseFocusTrap(modal);
      modal.close();
    }
  });
}

// ---- Render All ----
function render() {
  renderComparisonGrid();
  renderComparisonTable();
  renderSummary();
  renderResults();
  updateComparisonCount();
  updateViewToggle();
  updateUndoRedoButtons();
  saveState();
}

// ---- Event Wiring ----
function init() {
  render();

  // Add School Form & Delete Confirm
  initAddSchoolForm();
  initDeleteConfirm();

  // Search
  const searchInput = $('#search-input');
  searchInput?.addEventListener('input', (e) => {
    setState({ searchQuery: e.target.value });
    renderResults();
  });

  // Filter chips
  $$('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      $$('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      setState({ filterType: chip.dataset.filter });
      renderResults();
    });
  });

  // View toggle
  $$('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setState({ viewMode: btn.dataset.view });
      render();
    });
  });

  // Results click delegation
  $('#results-list')?.addEventListener('click', (e) => {
    // Handle delete custom school button
    const deleteBtn = e.target.closest('[data-delete-custom]');
    if (deleteBtn) {
      e.stopPropagation();
      e.preventDefault();
      showDeleteConfirm(deleteBtn.dataset.deleteCustom);
      return;
    }
    const item = e.target.closest('.uni-item');
    if (item) toggleComparison(item.dataset.uniId);
  });

  // Results keyboard support
  $('#results-list')?.addEventListener('keydown', (e) => {
    const item = e.target.closest('.uni-item');
    if (!item) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleComparison(item.dataset.uniId);
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      item.nextElementSibling?.focus();
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      item.previousElementSibling?.focus();
    }
    if (e.key === 'Delete' || e.key === 'Backspace') {
      // Delete custom school via keyboard
      const deleteBtn = item.querySelector('[data-delete-custom]');
      if (deleteBtn) {
        e.preventDefault();
        showDeleteConfirm(deleteBtn.dataset.deleteCustom);
      }
    }
  });

  // Comparison grid remove delegation
  $('#comparison-grid')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-remove]');
    if (btn) { e.stopPropagation(); toggleComparison(btn.dataset.remove); }
  });

  // Table remove delegation
  $('#comparison-table')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-remove]');
    if (btn) { e.stopPropagation(); toggleComparison(btn.dataset.remove); }
  });

  // Top bar actions
  $('#btn-reset')?.addEventListener('click', resetComparison);
  $('#btn-export')?.addEventListener('click', exportComparison);
  $('#btn-undo')?.addEventListener('click', undoAction);
  $('#btn-redo')?.addEventListener('click', redoAction);

  // Shortcuts modal
  $('#modal-close')?.addEventListener('click', () => {
    releaseFocusTrap($('#shortcuts-modal'));
    $('#shortcuts-modal')?.close();
  });
  $('#shortcuts-modal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      releaseFocusTrap(e.currentTarget);
      e.currentTarget.close();
    }
  });

  // Keyboard shortcuts
  initKeyboard({
    onSearch: (q) => { setState({ searchQuery: q }); renderResults(); },
    onFilter: (f) => { setState({ filterType: f }); renderResults(); },
    onUndo: undoAction,
    onRedo: redoAction,
    onReset: resetComparison,
    onExport: exportComparison,
    onViewChange: (v) => { setState({ viewMode: v }); render(); },
    onAddSchool: () => {
      $('#btn-add-school')?.click();
    },
  });

  updateUndoRedoButtons();
}

// Boot
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
