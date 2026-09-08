/**
 * Output panel — generated text display, copy button, stats, word cloud, error/empty states
 */

import { FLAVORS } from '../flavors.js';
import { $, esc } from '../utils.js';

export function initOutputView(state) {
  const $outputBox = $('outputBox');
  const $outputLabel = $('outputLabel');
  const $outputContent = $('outputContent');
  const $copyBtn = $('copyBtn');
  const $statsLine = $('statsLine');
  const $wordCloud = $('wordCloud');
  const $toast = $('toast');

  let copyTimer = null;
  let toastTimer = null;

  // Copy button
  $copyBtn.addEventListener('click', copyText);

  return {
    displayOutput,
    showEmpty,
    showError,
    renderWordCloud,
    updateAccentColor,
    showToast
  };

  function updateAccentColor() {
    const color = FLAVORS[state.flavor].color;
    document.documentElement.style.setProperty('--accent', color);
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    document.documentElement.style.setProperty('--accent-light',
      `rgb(${Math.min(255, r + 40)},${Math.min(255, g + 40)},${Math.min(255, b + 40)})`);
  }

  function displayOutput(text, animate = true) {
    state.generatedText = text;
    const f = FLAVORS[state.flavor];

    $outputLabel.textContent = f.label.toUpperCase();
    $outputLabel.style.color = f.color;

    const hasText = text && text.trim();
    $copyBtn.disabled = !hasText;
    $outputBox.classList.toggle('has-output', hasText);

    if (!hasText) { showEmpty(); return; }

    const paras = state.generatedParagraphs.length ? state.generatedParagraphs : [text];
    let html = '';
    paras.forEach(p => { html += `<p class="paragraph">${esc(p)}</p>`; });
    $outputContent.innerHTML = animate
      ? `<div class="animate-in">${html}</div>`
      : html;

    // Stats
    const wc = text.split(/\s+/).filter(w => w.length).length;
    const cc = text.length;
    const pc = paras.length;
    $statsLine.innerHTML =
      `<span><span class="stat-num">${pc}</span> ${pc === 1 ? 'para' : 'paras'}</span>` +
      `<span><span class="stat-num">${wc}</span> words</span>` +
      `<span><span class="stat-num">${cc.toLocaleString()}</span> chars</span>`;
  }

  function showEmpty() {
    $outputContent.innerHTML =
      '<div class="empty-state">' +
      '<div class="empty-icon">Fi</div>' +
      '<div class="empty-text">Select a flavor and click Generate to begin.</div>' +
      '<div class="empty-hint">Press Enter or click the button above.</div>' +
      '</div>';
    $statsLine.innerHTML = '';
  }

  function showError(msg) {
    $outputContent.innerHTML =
      `<div class="error-state">` +
      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">` +
      `<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>` +
      `</svg><span>${msg}</span></div>`;
    showToast(msg);
    setTimeout(() => {
      if (state.generatedText) displayOutput(state.generatedText, false);
    }, 3500);
  }

  function renderWordCloud(text) {
    if (!text.trim()) {
      $wordCloud.innerHTML = '<div class="word-cloud-empty">Generate text to see the word cloud.</div>';
      return;
    }
    const freqs = computeFreqs(text);
    if (!freqs.length) {
      $wordCloud.innerHTML = '<div class="word-cloud-empty">No words to display.</div>';
      return;
    }
    const maxF = freqs[0][1];
    const color = FLAVORS[state.flavor].color;
    $wordCloud.innerHTML = '';
    freqs.forEach(([word, count], i) => {
      const span = document.createElement('span');
      span.textContent = word;
      const ratio = count / maxF;
      span.style.fontSize = `${(0.7 + ratio * 1.2).toFixed(1)}rem`;
      span.style.opacity = (0.35 + ratio * 0.65).toFixed(2);
      span.style.color = color;
      span.style.fontWeight = ratio > 0.6 ? '900' : ratio > 0.3 ? '700' : '400';
      span.style.animation = `fadeSlideIn ${0.2 + i * 0.02}s ease-out both`;
      $wordCloud.appendChild(span);
    });
  }

  async function copyText() {
    if (!state.generatedText.trim()) return;
    try {
      await navigator.clipboard.writeText(state.generatedText);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = state.generatedText;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    const label = $copyBtn.querySelector('.copy-label');
    $copyBtn.classList.add('copied');
    label.textContent = 'Copied!';
    showToast('Copied to clipboard');
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      $copyBtn.classList.remove('copied');
      label.textContent = 'Copy';
    }, 1800);
  }

  function showToast(msg) {
    $toast.textContent = msg;
    $toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $toast.classList.remove('visible'), 1800);
  }

  function computeFreqs(text) {
    const freq = {};
    text.toLowerCase().replace(/[^a-z\s'-]/g, '').split(/\s+/).forEach(w => {
      if (w.length > 2) freq[w] = (freq[w] || 0) + 1;
    });
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 20);
  }
}
