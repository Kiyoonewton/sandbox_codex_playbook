/**
 * BreakpointBench — Viewport Renderer
 * Creates and manages viewport cards with iframes and simulated previews
 */

import { state } from '../state.js';
import { $, $$, esc, getFrameHeight, getDeviceIcon, getDomain } from '../utils.js';

/** Render all viewport cards for the given URL */
export function renderViewports(url) {
  const activeBps = state.breakpoints.filter(bp => bp.active);
  const grid = $('#viewportGrid');
  grid.innerHTML = '';

  activeBps.forEach((bp, i) => {
    const card = document.createElement('div');
    card.className = 'viewport-card';
    card.dataset.width = bp.width;
    card.dataset.device = bp.device;
    card.style.opacity = '0';
    card.style.transform = 'translateY(8px)';

    const fh = getFrameHeight(bp.width);

    card.innerHTML = `
      <div class="viewport-header">
        <div class="viewport-device-icon">${getDeviceIcon(bp.device)}</div>
        <div class="viewport-info">
          <span class="viewport-width-display">${bp.width}</span>
          <span class="viewport-unit">px</span>
          <span class="viewport-device-label">${esc(bp.label)}</span>
        </div>
        <div class="viewport-actions">
          <button class="vp-action-btn" title="Open in new tab" data-action="open">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M5 1H2.5A1.5 1.5 0 001 2.5v7A1.5 1.5 0 002.5 11h7a1.5 1.5 0 001.5-1.5V7M7 1h4v4M11 1L5.5 6.5" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button class="vp-action-btn" title="Copy embed code" data-action="copy">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="3.5" y="3.5" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1"/><path d="M8.5 3.5V2A1 1 0 007.5 1h-5A1 1 0 001.5 2v5a1 1 0 001 1H3" stroke="currentColor" stroke-width="1"/></svg>
          </button>
          <button class="vp-action-btn vp-action-btn-download" title="Download this size" data-action="download">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1.5v6M4 5.5l2 2 2-2M2 8.5v1.5a1 1 0 001 1h6a1 1 0 001-1V8.5" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </div>
      <div class="viewport-frame-wrap" style="background:${state.bgTheme}">
        <iframe class="viewport-frame" src="${url}" style="height:${fh}px;max-width:${bp.width}px;" sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals" loading="lazy" title="Preview at ${bp.width}px — ${esc(bp.label)}"></iframe>
        <div class="viewport-scroll-indicator"></div>
      </div>
      <div class="viewport-resize-handle"></div>`;

    // Staggered fade-in animation
    setTimeout(() => {
      card.style.transition = 'opacity 0.4s var(--ease), transform 0.4s var(--ease)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 50 * i);

    // Action buttons
    card.querySelector('[data-action="open"]')?.addEventListener('click', () => openViewportPreview(url, bp));
    card.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
      const code = `<iframe src="${url}" width="${bp.width}" height="600" frameborder="0"></iframe>`;
      navigator.clipboard.writeText(code)
        .then(() => showToast_msg('Embed code copied', 'success'))
        .catch(() => showToast_msg('Copy failed', 'error'));
    });
    card.querySelector('[data-action="download"]')?.addEventListener('click', () => {
      downloadViewportCard(card, bp, url);
    });

    // Iframe loading
    const iframe = card.querySelector('.viewport-frame');
    const frameWrap = card.querySelector('.viewport-frame-wrap');
    const scrollInd = card.querySelector('.viewport-scroll-indicator');

    let loadTimer;
    iframe.addEventListener('load', () => {
      clearTimeout(loadTimer);
      if (i === 0) $('#loadingOverlay').style.display = 'none';
      setupScrollSync(iframe, frameWrap, scrollInd);
      // Check if content rendered
      setTimeout(() => {
        try {
          const doc = iframe.contentDocument || iframe.contentWindow?.document;
          if (!doc?.body || doc.body.innerHTML.trim().length < 20) {
            showSimulatedPreview(frameWrap, bp, url);
          }
        } catch (e) {
          showSimulatedPreview(frameWrap, bp, url);
        }
      }, 2000);
    });

    loadTimer = setTimeout(() => {
      if (i === 0) $('#loadingOverlay').style.display = 'none';
    }, 5000);

    iframe.addEventListener('error', () => showSimulatedPreview(frameWrap, bp, url));
    setupResizeHandle(card.querySelector('.viewport-resize-handle'), iframe);
    grid.appendChild(card);
  });

  setTimeout(() => {
    const lo = $('#loadingOverlay');
    if (lo) lo.style.display = 'none';
  }, 6000);

  $('#statusViewports').textContent = activeBps.length;
}

/** Toast helper local reference */
function showToast_msg(msg, type) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg; t.className = 'toast'; if (type) t.classList.add(type);
  void t.offsetWidth; t.classList.add('visible');
  clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('visible'), 2500);
}

/** Setup synchronized scrolling between viewports */
function setupScrollSync(iframe, frameWrap, scrollInd) {
  try {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.addEventListener('scroll', () => {
      if (!state.syncScroll) return;
      const st = doc.documentElement.scrollTop || doc.body.scrollTop;
      const sh = doc.documentElement.scrollHeight - doc.clientHeight;

      if (st > 5) {
        scrollInd.classList.add('visible');
        const r = sh > 0 ? st / sh : 0;
        scrollInd.style.height = Math.max(20, r * frameWrap.clientHeight) + 'px';
        scrollInd.style.top = st + 'px';
      } else {
        scrollInd.classList.remove('visible');
      }

      $$('.viewport-frame').forEach(f => {
        if (f === iframe) return;
        try {
          const d = f.contentDocument || f.contentWindow.document;
          const ts = d.documentElement.scrollHeight - d.clientHeight;
          d.documentElement.scrollTop = (sh > 0 ? st / sh : 0) * ts;
          d.body.scrollTop = d.documentElement.scrollTop;
        } catch (e) { /* cross-origin */ }
      });
    });
  } catch (e) { /* cross-origin */ }
}

/** Show simulated responsive preview when iframe content can't load */
export function showSimulatedPreview(frameWrap, bp, url) {
  if (frameWrap.querySelector('.simulated-preview') || frameWrap.querySelector('.viewport-error')) return;
  const old = frameWrap.querySelector('.viewport-frame');
  if (old) old.style.display = 'none';

  const domain = (() => { try { return new URL(url).hostname; } catch { return url; }})();
  const isLight = !['#1a1a2e', '#0A0A0A'].includes(state.bgTheme);
  const tc = isLight ? '#333' : 'rgba(255,255,255,0.8)';
  const sc = isLight ? '#999' : 'rgba(255,255,255,0.35)';
  const lc = isLight ? '#e5e5e5' : 'rgba(255,255,255,0.06)';
  const bc = isLight ? '#f0f0f0' : 'rgba(255,255,255,0.04)';
  const nb = isLight ? '#f8f8f8' : '#16162a';
  const showH = bp.width < 768;
  const nl = bp.width < 500 ? 0 : bp.width < 768 ? 2 : 4;

  let nav = `<div style="height:${bp.width < 500 ? 40 : 48}px;background:${nb};border-bottom:1px solid ${lc};display:flex;align-items:center;padding:0 ${bp.width < 500 ? 12 : 20}px;gap:12px;flex-shrink:0;"><div style="font-family:Inter,sans-serif;font-size:${bp.width < 500 ? 12 : 14}px;font-weight:600;color:${tc};letter-spacing:-0.02em;">${domain.split('.')[0]}</div><div style="flex:1"></div>`;
  if (showH) {
    nav += `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 5h12M3 9h12M3 13h12" stroke="${sc}" stroke-width="1.5" stroke-linecap="round"/></svg>`;
  } else {
    for (let i = 0; i < nl; i++) nav += `<div style="width:${32 + i * 8}px;height:6px;border-radius:3px;background:${bc};"></div>`;
  }
  nav += '</div>';

  const hero = `<div style="padding:${bp.width < 500 ? '20px 16px' : '32px 24px'};flex-shrink:0;"><div style="width:${bp.width < 500 ? 60 : 80}px;height:${bp.width < 500 ? 6 : 8}px;border-radius:4px;background:#D4A45A;opacity:0.7;margin-bottom:12px;"></div><div style="width:${bp.width < 500 ? '70%' : '50%'};height:${bp.width < 500 ? 14 : 18}px;border-radius:4px;background:${bc};margin-bottom:8px;"></div><div style="width:${bp.width < 500 ? '90%' : '65%'};height:${bp.width < 500 ? 10 : 12}px;border-radius:3px;background:${bc};margin-bottom:16px;"></div><div style="display:flex;gap:8px;flex-wrap:wrap;"><div style="width:${bp.width < 500 ? 90 : 110}px;height:32px;border-radius:6px;background:#D4A45A;opacity:0.85;"></div><div style="width:${bp.width < 500 ? 80 : 100}px;height:32px;border-radius:6px;border:1px solid ${lc};"></div></div></div>`;

  const cols = bp.width < 500 ? 1 : bp.width < 768 ? 2 : 3;
  const cw = `calc((100% - ${cols * 16}px) / ${cols})`;
  let cards = `<div style="display:flex;flex-wrap:wrap;gap:16px;padding:0 ${bp.width < 500 ? '16px' : '24px'} 16px;">`;
  for (let i = 0; i < cols * 2; i++) {
    const h = 60 + (i % 3) * 20;
    cards += `<div style="width:${cw};min-width:0;border-radius:8px;border:1px solid ${lc};overflow:hidden;"><div style="height:${h}px;background:${bc};"></div><div style="padding:10px;"><div style="width:60%;height:8px;border-radius:3px;background:${bc};margin-bottom:6px;"></div><div style="width:90%;height:6px;border-radius:2px;background:${bc};margin-bottom:4px;"></div><div style="width:70%;height:6px;border-radius:2px;background:${bc};"></div></div></div>`;
  }
  cards += '</div>';

  const foot = `<div style="margin-top:auto;padding:12px ${bp.width < 500 ? '16px' : '24px'};border-top:1px solid ${lc};display:flex;justify-content:center;"><span style="font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--text-dim);letter-spacing:0.06em;text-transform:uppercase;">Simulated · ${bp.width}px · ${bp.label}</span></div>`;

  const sim = document.createElement('div');
  sim.className = 'simulated-preview';
  sim.style.cssText = 'position:absolute;inset:0;display:flex;flex-direction:column;overflow:hidden;';
  sim.innerHTML = nav + hero + cards + foot;
  frameWrap.appendChild(sim);
}

/** Setup drag-to-resize on viewport cards */
function setupResizeHandle(handle, iframe) {
  handle.addEventListener('mousedown', e => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = iframe.offsetHeight;
    const move = ev => { iframe.style.height = Math.max(150, startHeight + (ev.clientY - startY)) + 'px'; };
    const up = () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); document.body.style.cursor = ''; };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
    document.body.style.cursor = 'ns-resize';
  });
}

/**
 * Opens a full viewport preview modal showing the URL at the exact breakpoint width
 */
export function openViewportPreview(url, bp) {
  const overlay = $('#vpPreviewOverlay');
  const modal = $('#vpPreviewModal');
  const frame = $('#vpPreviewFrame');
  const widthEl = $('#vpPreviewWidth');
  const labelEl = $('#vpPreviewLabel');
  const urlEl = $('#vpPreviewUrl');
  const rulerEl = $('#vpPreviewRuler');
  const closeBtn = $('#vpPreviewClose');
  const newTabBtn = $('#vpPreviewNewTab');
  const downloadBtn = $('#vpPreviewDownload');

  if (!overlay || !modal || !frame) return;

  // Set info
  widthEl.textContent = bp.width;
  labelEl.textContent = bp.label;
  urlEl.textContent = url;

  let currentWidth = bp.width;

  // Helper to set the iframe width and update UI
  function setPreviewWidth(w) {
    currentWidth = w;
    // Modal width = iframe width + some padding for the container
    const modalWidth = Math.max(340, w + 2); // +2 for border
    modal.style.width = Math.min(modalWidth, window.innerWidth * 0.92) + 'px';
    frame.style.width = w + 'px';
    widthEl.textContent = w;

    // Calculate frame height: reasonable for the content
    const fh = w <= 320 ? 500 : w <= 500 ? 550 : w <= 768 ? 600 : w <= 1024 ? 650 : 700;
    const maxFH = window.innerHeight * 0.78;
    frame.style.height = Math.min(fh, maxFH) + 'px';

    // Update width label inside the ruler
    const wLabel = rulerEl.querySelector('.vp-ruler-label');
    if (wLabel) wLabel.textContent = `${w}px — ${labelFromWidth(w)}`;
  }

  function labelFromWidth(w) {
    const match = state.breakpoints.find(b => b.width === w);
    if (match) return match.label;
    if (w < 600) return 'Phone';
    if (w < 1024) return 'Tablet';
    return 'Desktop';
  }

  // Build width presets bar
  const presets = [320, 375, 390, 414, 576, 768, 810, 1024, 1280, 1440, 1920];
  rulerEl.innerHTML = '';

  // Width label at top
  const wLabel = document.createElement('div');
  wLabel.className = 'vp-ruler-label';
  wLabel.style.cssText = "font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:600;color:rgba(255,255,255,0.7);letter-spacing:0.03em;margin-bottom:6px;";
  wLabel.textContent = `${bp.width}px — ${labelFromWidth(bp.width)}`;
  rulerEl.appendChild(wLabel);

  const presetContainer = document.createElement('div');
  presetContainer.className = 'vp-preview-presets';
  presetContainer.style.cssText = 'display:flex;gap:4px;align-items:center;flex-wrap:wrap;justify-content:center;';

  presets.forEach(pw => {
    const chip = document.createElement('button');
    chip.className = 'vp-preset-chip';
    chip.textContent = pw;
    chip.style.cssText = `
      font-family: 'IBM Plex Mono', monospace; font-size: 10px; font-weight: 500;
      padding: 3px 8px; border-radius: 4px; cursor: pointer;
      border: 1px solid rgba(255,255,255,0.08); background: transparent;
      color: rgba(255,255,255,0.35); letter-spacing: 0.03em;
      transition: all 0.15s cubic-bezier(0.25, 0.1, 0.25, 1);
    `;
    if (pw === bp.width) {
      chip.style.borderColor = 'rgba(212,164,90,0.35)';
      chip.style.color = '#D4A45A';
      chip.style.background = 'rgba(212,164,90,0.1)';
    }
    chip.addEventListener('mouseenter', () => {
      if (pw !== currentWidth) {
        chip.style.borderColor = 'rgba(255,255,255,0.14)';
        chip.style.color = 'rgba(255,255,255,0.55)';
      }
    });
    chip.addEventListener('mouseleave', () => {
      if (pw !== currentWidth) {
        chip.style.borderColor = 'rgba(255,255,255,0.08)';
        chip.style.color = 'rgba(255,255,255,0.35)';
      }
    });
    chip.addEventListener('click', () => {
      // Update active state on chips
      presetContainer.querySelectorAll('button').forEach(c => {
        c.style.borderColor = 'rgba(255,255,255,0.08)';
        c.style.color = 'rgba(255,255,255,0.35)';
        c.style.background = 'transparent';
      });
      chip.style.borderColor = 'rgba(212,164,90,0.35)';
      chip.style.color = '#D4A45A';
      chip.style.background = 'rgba(212,164,90,0.1)';
      setPreviewWidth(pw);
    });
    presetContainer.appendChild(chip);
  });

  rulerEl.appendChild(presetContainer);

  // Custom width input
  const customRow = document.createElement('div');
  customRow.style.cssText = 'display:flex;align-items:center;gap:6px;margin-top:6px;justify-content:center;';
  const customLabel = document.createElement('span');
  customLabel.textContent = 'Custom:';
  customLabel.style.cssText = "font-family:'IBM Plex Mono',monospace;font-size:9px;font-weight:500;color:rgba(255,255,255,0.3);letter-spacing:0.06em;text-transform:uppercase;";
  const customInput = document.createElement('input');
  customInput.type = 'number';
  customInput.placeholder = 'px';
  customInput.min = '240';
  customInput.max = '3840';
  customInput.style.cssText = `
    width: 72px; padding: 3px 8px; font-family: 'IBM Plex Mono', monospace;
    font-size: 11px; font-weight: 500; color: rgba(255,255,255,0.9);
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 4px; outline: none; text-align: center;
  `;
  customInput.addEventListener('focus', () => {
    customInput.style.borderColor = 'rgba(212,164,90,0.35)';
  });
  customInput.addEventListener('blur', () => {
    customInput.style.borderColor = 'rgba(255,255,255,0.08)';
  });
  const customUnit = document.createElement('span');
  customUnit.textContent = 'px';
  customUnit.style.cssText = "font-family:'IBM Plex Mono',monospace;font-size:9px;font-weight:500;color:rgba(255,255,255,0.25);letter-spacing:0.06em;";

  const applyCustom = () => {
    const w = parseInt(customInput.value);
    if (w && w >= 240 && w <= 3840) {
      // Deselect all presets
      presetContainer.querySelectorAll('button').forEach(c => {
        c.style.borderColor = 'rgba(255,255,255,0.08)';
        c.style.color = 'rgba(255,255,255,0.35)';
        c.style.background = 'transparent';
      });
      setPreviewWidth(w);
    }
  };
  customInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); applyCustom(); }
  });
  customInput.addEventListener('change', applyCustom);

  customRow.appendChild(customLabel);
  customRow.appendChild(customInput);
  customRow.appendChild(customUnit);
  rulerEl.appendChild(customRow);

  // Calculate modal size: width matches breakpoint, height fills available space
  const modalHeight = Math.max(400, Math.min(window.innerHeight * 0.85, 800));
  modal.style.height = modalHeight + 'px';

  // Set initial width
  setPreviewWidth(bp.width);

  // Load the URL
  frame.src = url;

  // Show
  overlay.style.display = 'flex';
  overlay.classList.remove('closing');
  document.body.style.overflow = 'hidden';

  // Focus the custom input after a beat
  setTimeout(() => customInput.focus(), 300);

  // Close handlers
  const closePreview = () => {
    overlay.classList.add('closing');
    setTimeout(() => {
      overlay.style.display = 'none';
      overlay.classList.remove('closing');
      frame.src = 'about:blank';
      document.body.style.overflow = '';
    }, 200);
  };

  closeBtn.onclick = closePreview;
  overlay.onclick = (e) => {
    if (e.target === overlay) closePreview();
  };

  newTabBtn.onclick = () => window.open(url, '_blank');

  // Download button - captures the current preview at the current width
  if (downloadBtn) {
    downloadBtn.onclick = () => {
      downloadPreviewModal(bp, url, currentWidth);
    };
  }

  // Escape to close + arrow keys for width
  const keyHandler = (e) => {
    if (e.key === 'Escape') {
      closePreview();
      document.removeEventListener('keydown', keyHandler);
    } else if (e.key === 'ArrowLeft' && !e.target.closest('input')) {
      // Find next smaller preset
      const idx = presets.indexOf(currentWidth);
      if (idx > 0) {
        setPreviewWidth(presets[idx - 1]);
        highlightPreset(presetContainer, presets[idx - 1]);
      }
    } else if (e.key === 'ArrowRight' && !e.target.closest('input')) {
      // Find next larger preset
      const idx = presets.indexOf(currentWidth);
      if (idx < presets.length - 1) {
        setPreviewWidth(presets[idx + 1]);
        highlightPreset(presetContainer, presets[idx + 1]);
      }
    }
  };
  document.addEventListener('keydown', keyHandler);
}

/** Highlight a preset chip by width value */
function highlightPreset(container, width) {
  container.querySelectorAll('button').forEach(c => {
    c.style.borderColor = 'rgba(255,255,255,0.08)';
    c.style.color = 'rgba(255,255,255,0.35)';
    c.style.background = 'transparent';
  });
  const chips = container.querySelectorAll('button');
  for (const chip of chips) {
    if (parseInt(chip.textContent) === width) {
      chip.style.borderColor = 'rgba(212,164,90,0.35)';
      chip.style.color = '#D4A45A';
      chip.style.background = 'rgba(212,164,90,0.1)';
      break;
    }
  }
}

/** Download a single viewport card as PNG */
async function downloadViewportCard(card, bp, url) {
  if (typeof html2canvas === 'undefined') {
    showToast_msg('Export library loading — try again in a moment', 'error');
    return;
  }
  showToast_msg(`Capturing ${bp.width}px…`);
  try {
    const canvas = await html2canvas(card, {
      backgroundColor: '#0A0A0A',
      useCORS: true,
      allowTaint: true,
      logging: false,
      scale: 2,
      width: card.offsetWidth,
      height: card.offsetHeight,
      scrollX: 0,
      scrollY: 0,
    });
    const domain = (() => { try { return getDomain(url); } catch { return 'preview'; } })();
    const label = bp.label ? '-' + bp.label.replace(/\s+/g, '_') : '';
    const link = document.createElement('a');
    link.download = `${domain.replace(/\./g, '_')}-${bp.width}px${label}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast_msg(`Downloaded ${bp.width}px`, 'success');
  } catch (err) {
    console.error(`Failed to capture ${bp.width}px:`, err);
    showToast_msg(`Failed to capture ${bp.width}px`, 'error');
  }
}

/** Download the viewport preview modal content at its current width */
export async function downloadPreviewModal(bp, url, currentWidth) {
  if (typeof html2canvas === 'undefined') {
    showToast_msg('Export library loading — try again in a moment', 'error');
    return;
  }
  showToast_msg(`Capturing ${currentWidth}px preview…`);
  try {
    const content = $('#vpPreviewContent');
    const frame = $('#vpPreviewFrame');
    if (!content || !frame) return;

    // Capture the preview content area
    const canvas = await html2canvas(content, {
      backgroundColor: '#0A0A0A',
      useCORS: true,
      allowTaint: true,
      logging: false,
      scale: 2,
      width: content.offsetWidth,
      height: content.offsetHeight,
      scrollX: 0,
      scrollY: 0,
    });
    const domain = (() => { try { return getDomain(url); } catch { return 'preview'; } })();
    const widthLabel = bp ? bp.label : (currentWidth < 600 ? 'Phone' : currentWidth < 1024 ? 'Tablet' : 'Desktop');
    const link = document.createElement('a');
    link.download = `${domain.replace(/\./g, '_')}-${currentWidth}px${widthLabel ? '-' + widthLabel.replace(/\s+/g, '_') : ''}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast_msg(`Downloaded ${currentWidth}px`, 'success');
  } catch (err) {
    console.error(`Failed to capture preview:`, err);
    showToast_msg('Failed to capture preview', 'error');
  }
}
