/**
 * BreakpointBench — Modal Dialog
 * Add custom breakpoint modal
 */

import { state, pushUndo, saveToStorage } from '../state.js';
import { $ } from '../utils.js';
import { renderBreakpointList, updateStatus } from './sidebar.js';
import { renderViewports } from './viewports.js';
import { showToast } from '../utils.js';

export function openModal() {
  const overlay = $('#modalOverlay');
  if (overlay) {
    overlay.style.display = 'flex';
    const input = $('#modalInput');
    const label = $('#modalLabel');
    if (input) input.value = '';
    if (label) label.value = '';
    setTimeout(() => input?.focus(), 100);
  }
}

export function closeModal() {
  const overlay = $('#modalOverlay');
  if (overlay) overlay.style.display = 'none';
}

export function addCustomBreakpoint() {
  const input = $('#modalInput');
  const labelInput = $('#modalLabel');
  const w = parseInt(input?.value);
  const l = labelInput?.value.trim() || `Custom ${w}px`;

  if (!w || w < 240 || w > 3840) {
    showToast('Enter width 240–3840', 'error');
    return;
  }

  if (state.breakpoints.some(b => b.width === w)) {
    showToast('Breakpoint exists', 'error');
    return;
  }

  pushUndo();
  state.breakpoints.push({
    width: w, label: l, active: true,
    device: w < 600 ? 'phone' : w < 1024 ? 'tablet' : 'desktop'
  });
  state.breakpoints.sort((a, b) => a.width - b.width);

  renderBreakpointList();
  updateStatus();
  closeModal();

  if (state.url) renderViewports(state.url);
  saveToStorage();
  showToast(`Added ${w}px — ${l}`);
}

export function initModal() {
  $('#addBpBtn')?.addEventListener('click', openModal);
  $('#modalCancel')?.addEventListener('click', closeModal);
  $('#modalClose')?.addEventListener('click', closeModal);
  $('#modalConfirm')?.addEventListener('click', addCustomBreakpoint);
  $('#modalOverlay')?.addEventListener('click', e => {
    if (e.target === $('#modalOverlay')) closeModal();
  });
  $('#modalInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); addCustomBreakpoint(); }
  });
  $('#modalLabel')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); addCustomBreakpoint(); }
  });
}
