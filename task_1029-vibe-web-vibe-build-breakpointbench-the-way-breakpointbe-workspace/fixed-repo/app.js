/**
 * BreakpointBench — Responsive Preview Studio
 * Main Application Logic
 */

// ═══════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════
const state = {
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
  bgTheme: '#FFFFFF',
  history: [],
};

// ═══════════════════════════════════════════
// DOM REFS
// ═══════════════════════════════════════════
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const urlInput = $('#urlInput');
const urlSubmit = $('#urlSubmit');
const viewportGrid = $('#viewportGrid');
const emptyState = $('#emptyState');
const loadingOverlay = $('#loadingOverlay');
const breakpointList = $('#breakpointList');
const addBpBtn = $('#addBpBtn');
const historyList = $('#historyList');
const toast = $('#toast');
const modalOverlay = $('#modalOverlay');
const modalInput = $('#modalInput');
const modalLabelInput = $('#modalLabel');
const modalConfirm = $('#modalConfirm');
const modalCancel = $('#modalCancel');
const modalCloseBtn = $('#modalClose');
const btnSync = $('#btnSync');
const btnZoom = $('#btnZoom');
const btnExport = $('#btnExport');
const zoomInBtn = $('#zoomIn');
const zoomOutBtn = $('#zoomOut');
const zoomValueEl = $('#zoomValue');
const gapSlider = $('#gapSlider');
const gapValueEl = $('#gapValue');
const statusUrl = $('#statusUrl');
const statusViewports = $('#statusViewports');
const statusSync = $('#statusSync');
const statusZoom = $('#statusZoom');
const statusTime = $('#statusTime');

// ═══════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════
function init() {
  renderBreakpointList();
  updateLayout();
  updateStatus();
  startClock();
  loadFromStorage();
  setupEventListeners();
}

// ═══════════════════════════════════════════
// EVENT LISTENERS
// ═══════════════════════════════════════════
function setupEventListeners() {
  // URL input
  urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      loadUrl(urlInput.value.trim());
    }
  });
  urlSubmit.addEventListener('click', () => {
    loadUrl(urlInput.value.trim());
  });

  // Sync scroll
  btnSync.addEventListener('click', toggleSync);

  // Fit mode
  btnZoom.addEventListener('click', toggleFitMode);

  // Export
  btnExport.addEventListener('click', exportScreenshot);

  // Zoom
  zoomInBtn.addEventListener('click', () => adjustZoom(0.05));
  zoomOutBtn.addEventListener('click', () => adjustZoom(-0.05));

  // Gap slider
  gapSlider.addEventListener('input', (e) => {
    state.gap = parseInt(e.target.value);
    gapValueEl.textContent = state.gap;
    viewportGrid.style.gap = `${state.gap}px`;
    saveToStorage();
  });

  // Layout segmented
  $$('.seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.seg-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.layout = btn.dataset.layout;
      updateLayout();
      saveToStorage();
    });
  });

  // Theme dots
  $$('.theme-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      $$('.theme-dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      state.bgTheme = dot.dataset.bg;
      // Update all viewport frame backgrounds
      $$('.viewport-frame-wrap').forEach(wrap => {
        wrap.style.background = state.bgTheme;
      });
      saveToStorage();
    });
  });

  // Add breakpoint modal
  addBpBtn.addEventListener('click', openModal);
  modalCancel.addEventListener('click', closeModal);
  modalCloseBtn.addEventListener('click', closeModal);
  modalConfirm.addEventListener('click', addCustomBreakpoint);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  modalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomBreakpoint();
    }
  });

  modalLabelInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomBreakpoint();
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyboard);
}

function handleKeyboard(e) {
  const isInput = document.activeElement === urlInput || document.activeElement === modalInput || document.activeElement === modalLabelInput;
  
  // Cmd/Ctrl + K → focus URL
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    urlInput.focus();
    urlInput.select();
    return;
  }
  
  // Don't capture shortcuts when typing in inputs
  if (isInput) return;

  // S → toggle sync
  if (e.key === 's' && !e.metaKey && !e.ctrlKey) {
    e.preventDefault();
    toggleSync();
    return;
  }
  // F → toggle fit
  if (e.key === 'f' && !e.metaKey && !e.ctrlKey) {
    e.preventDefault();
    toggleFitMode();
    return;
  }
  // E → export
  if (e.key === 'e' && !e.metaKey && !e.ctrlKey) {
    e.preventDefault();
    exportScreenshot();
    return;
  }
  // +/- → zoom
  if (e.key === '=' || e.key === '+') {
    e.preventDefault();
    adjustZoom(0.05);
    return;
  }
  if (e.key === '-') {
    e.preventDefault();
    adjustZoom(-0.05);
    return;
  }
  // Escape → close modal
  if (e.key === 'Escape') {
    closeModal();
  }
}

// ═══════════════════════════════════════════
// URL LOADING
// ═══════════════════════════════════════════
function loadUrl(url) {
  if (!url) return;

  // Validate URL
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  try {
    new URL(url);
  } catch {
    showToast('Invalid URL format', 'error');
    return;
  }

  state.url = url;
  urlInput.value = url;
  emptyState.style.display = 'none';
  loadingOverlay.style.display = 'flex';

  // Add to history
  addToHistory(url);

  // Render viewports
  renderViewports(url);

  // Update status
  updateStatus();
  saveToStorage();
}

function renderViewports(url) {
  const activeBps = state.breakpoints.filter(bp => bp.active);

  viewportGrid.innerHTML = '';

  activeBps.forEach((bp, index) => {
    const card = document.createElement('div');
    card.className = 'viewport-card';
    card.dataset.width = bp.width;
    card.dataset.device = bp.device;
    card.style.opacity = '0';
    card.style.transform = 'translateY(8px)';

    // Calculate frame height based on viewport width
    const frameHeight = getFrameHeight(bp.width);

    card.innerHTML = `
      <div class="viewport-header">
        <div class="viewport-device-icon">${getDeviceIcon(bp.device)}</div>
        <div class="viewport-info">
          <span class="viewport-width-display">${bp.width}</span>
          <span class="viewport-unit">px</span>
          <span class="viewport-device-label">${bp.label}</span>
        </div>
        <div class="viewport-actions">
          <button class="vp-action-btn" title="Open in new tab" data-action="open">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M5 1H2.5A1.5 1.5 0 001 2.5v7A1.5 1.5 0 002.5 11h7a1.5 1.5 0 001.5-1.5V7M7 1h4v4M11 1L5.5 6.5" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="vp-action-btn" title="Copy embed code" data-action="copy">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="3.5" y="3.5" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1"/>
              <path d="M8.5 3.5V2A1 1 0 007.5 1h-5A1 1 0 001.5 2v5a1 1 0 001 1H3" stroke="currentColor" stroke-width="1"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="viewport-frame-wrap" style="background:${state.bgTheme}">
        <iframe
          class="viewport-frame"
          src="${url}"
          style="height:${frameHeight}px; max-width:${bp.width}px;"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
          loading="lazy"
          title="Preview at ${bp.width}px — ${bp.label}"
        ></iframe>
        <div class="viewport-scroll-indicator"></div>
      </div>
      <div class="viewport-resize-handle" data-width="${bp.width}"></div>
    `;

    // Staggered fade-in animation
    setTimeout(() => {
      card.style.transition = `opacity 0.4s var(--ease), transform 0.4s var(--ease)`;
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 50 * index);

    // Action buttons
    card.querySelector('[data-action="open"]').addEventListener('click', () => {
      window.open(url, '_blank');
    });

    card.querySelector('[data-action="copy"]').addEventListener('click', () => {
      const embedCode = `<iframe src="${url}" width="${bp.width}" height="600" frameborder="0" title="Preview at ${bp.width}px"></iframe>`;
      navigator.clipboard.writeText(embedCode).then(() => {
        showToast('Embed code copied to clipboard', 'success');
      }).catch(() => {
        showToast('Failed to copy', 'error');
      });
    });

    // Scroll sync setup
    const frameWrap = card.querySelector('.viewport-frame-wrap');
    const iframe = card.querySelector('.viewport-frame');
    const scrollIndicator = card.querySelector('.viewport-scroll-indicator');

    let loadTimeout;
    
    iframe.addEventListener('load', () => {
      clearTimeout(loadTimeout);
      
      // First iframe loaded → hide loading
      if (index === 0) {
        loadingOverlay.style.display = 'none';
      }
      
      // Setup scroll sync on iframe content
      setupScrollSync(iframe, frameWrap, scrollIndicator);
    });

    // After iframe loads, check if content actually rendered
    let contentCheckTimeout;
    iframe.addEventListener('load', () => {
      clearTimeout(contentCheckTimeout);
      contentCheckTimeout = setTimeout(() => {
        try {
          const doc = iframe.contentDocument || iframe.contentWindow.document;
          const hasContent = doc.body && doc.body.innerHTML.trim().length > 20;
          if (!hasContent) {
            showSimulatedPreview(frameWrap, bp, url);
          }
        } catch(e) {
          // Cross-origin, assume loaded fine
        }
      }, 1500);
    });

    // Safety timeout: hide loading after max wait
    loadTimeout = setTimeout(() => {
      if (index === 0) {
        loadingOverlay.style.display = 'none';
      }
    }, 4000);

    // Handle iframe load errors (show fallback)
    iframe.addEventListener('error', () => {
      showSimulatedPreview(frameWrap, bp, url);
    });

    // Resize handle
    const resizeHandle = card.querySelector('.viewport-resize-handle');
    setupResizeHandle(resizeHandle, iframe);

    viewportGrid.appendChild(card);
  });

  // Hide loading overlay if it's still showing
  setTimeout(() => {
    if (loadingOverlay) loadingOverlay.style.display = 'none';
  }, 5000);

  statusViewports.textContent = activeBps.length;
}

function getFrameHeight(width) {
  // Scale frame height proportionally to breakpoint width
  // Smaller viewports get proportionally taller frames for better visibility
  if (width <= 320) return 400;
  if (width <= 390) return 450;
  if (width <= 768) return 500;
  if (width <= 1024) return 520;
  if (width <= 1280) return 540;
  return 560;
}

function setupScrollSync(iframe, frameWrap, scrollIndicator) {
  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.addEventListener('scroll', () => {
      if (!state.syncScroll) return;
      const scrollTop = iframeDoc.documentElement.scrollTop || iframeDoc.body.scrollTop;
      const scrollHeight = iframeDoc.documentElement.scrollHeight - iframeDoc.clientHeight;
      
      // Update scroll indicator
      if (scrollTop > 5) {
        scrollIndicator.classList.add('visible');
        const ratio = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
        scrollIndicator.style.height = `${Math.max(20, ratio * frameWrap.clientHeight)}px`;
        scrollIndicator.style.top = `${scrollTop}px`;
      } else {
        scrollIndicator.classList.remove('visible');
      }

      // Sync to other viewports
      syncScrollFrom(iframe, scrollTop, scrollHeight);
    });
  } catch(e) {
    // Cross-origin - scroll sync not available
  }
}

function syncScrollFrom(sourceIframe, scrollTop, scrollHeight) {
  if (!state.syncScroll) return;
  
  const cards = $$('.viewport-card');
  cards.forEach(card => {
    const iframe = card.querySelector('.viewport-frame');
    if (iframe === sourceIframe) return;
    
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      const targetScrollHeight = doc.documentElement.scrollHeight - doc.clientHeight;
      const ratio = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
      const targetScroll = ratio * targetScrollHeight;
      
      doc.documentElement.scrollTop = targetScroll;
      doc.body.scrollTop = targetScroll;
    } catch(e) {
      // Cross-origin
    }
  });
}

function showSimulatedPreview(frameWrap, bp, url) {
  // Don't add if already present
  if (frameWrap.querySelector('.simulated-preview')) return;
  
  // Remove old iframe
  const oldIframe = frameWrap.querySelector('.viewport-frame');
  if (oldIframe) oldIframe.style.display = 'none';

  const domain = (() => { try { return new URL(url).hostname; } catch { return url; }})();
  const isDark = state.bgTheme !== '#F5F0EB' && state.bgTheme !== '#E8E0D8';
  
  // Generate a simulated responsive page preview
  const sim = document.createElement('div');
  sim.className = 'simulated-preview';
  sim.style.cssText = `
    position: absolute; inset: 0; display: flex; flex-direction: column;
    background: ${isDark ? '#1a1a2e' : '#ffffff'}; overflow: hidden;
  `;
  
  // Simulated nav bar
  const navHeight = bp.width < 500 ? 40 : 48;
  const navBg = isDark ? '#16162a' : '#f8f8f8';
  const textColor = isDark ? 'rgba(255,255,255,0.8)' : '#333';
  const subtextColor = isDark ? 'rgba(255,255,255,0.35)' : '#999';
  const lineColor = isDark ? 'rgba(255,255,255,0.06)' : '#e5e5e5';
  const blockColor = isDark ? 'rgba(255,255,255,0.04)' : '#f0f0f0';
  
  const showHamburger = bp.width < 768;
  const navLinks = bp.width < 500 ? 0 : bp.width < 768 ? 2 : 4;
  
  let navHTML = `
    <div style="height:${navHeight}px; background:${navBg}; border-bottom:1px solid ${lineColor}; display:flex; align-items:center; padding:0 ${bp.width < 500 ? '12' : '20'}px; gap:12px; flex-shrink:0;">
      <div style="font-family:Inter,sans-serif; font-size:${bp.width < 500 ? 12 : 14}px; font-weight:600; color:${textColor}; letter-spacing:-0.02em;">${domain.split('.')[0]}</div>
      <div style="flex:1"></div>
  `;
  
  if (showHamburger) {
    navHTML += `
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 5h12M3 9h12M3 13h12" stroke="${subtextColor}" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    `;
  } else {
    for (let i = 0; i < navLinks; i++) {
      navHTML += `<div style="width:${32 + i * 8}px; height:6px; border-radius:3px; background:${blockColor};"></div>`;
    }
  }
  navHTML += '</div>';
  
  // Hero section
  const heroHeight = bp.width < 500 ? 120 : 160;
  const heroHTML = `
    <div style="padding: ${bp.width < 500 ? '20px 16px' : '32px 24px'}; flex-shrink:0;">
      <div style="width:${bp.width < 500 ? 60 : 80}px; height:${bp.width < 500 ? 6 : 8}px; border-radius:4px; background: var(--accent); opacity:0.7; margin-bottom:12px;"></div>
      <div style="width: ${bp.width < 500 ? '70%' : '50%'}; height: ${bp.width < 500 ? 14 : 18}px; border-radius:4px; background: ${blockColor}; margin-bottom:8px;"></div>
      <div style="width: ${bp.width < 500 ? '90%' : '65%'}; height: ${bp.width < 500 ? 10 : 12}px; border-radius:3px; background: ${blockColor}; margin-bottom:16px;"></div>
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <div style="width:${bp.width < 500 ? 90 : 110}px; height:32px; border-radius:6px; background: var(--accent); opacity:0.85;"></div>
        <div style="width:${bp.width < 500 ? 80 : 100}px; height:32px; border-radius:6px; border:1px solid ${lineColor};"></div>
      </div>
    </div>
  `;
  
  // Content blocks
  const cols = bp.width < 500 ? 1 : bp.width < 768 ? 2 : 3;
  const cardWidth = `calc((100% - ${(cols) * 16}px) / ${cols})`;
  
  let cardsHTML = '<div style="display:flex; flex-wrap:wrap; gap:16px; padding: 0 ' + (bp.width < 500 ? '16px' : '24px') + ' 16px;">';
  for (let i = 0; i < cols * 2; i++) {
    const h = 60 + (i % 3) * 20;
    cardsHTML += `
      <div style="width:${cardWidth}; min-width:0; border-radius:8px; border:1px solid ${lineColor}; overflow:hidden;">
        <div style="height:${h}px; background: ${blockColor};"></div>
        <div style="padding:10px;">
          <div style="width:60%; height:8px; border-radius:3px; background: ${blockColor}; margin-bottom:6px;"></div>
          <div style="width:90%; height:6px; border-radius:2px; background: ${blockColor}; margin-bottom:4px;"></div>
          <div style="width:70%; height:6px; border-radius:2px; background: ${blockColor};"></div>
        </div>
      </div>
    `;
  }
  cardsHTML += '</div>';
  
  // Footer hint
  const footerHTML = `
    <div style="margin-top:auto; padding:12px ${bp.width < 500 ? '16px' : '24px'}; border-top:1px solid ${lineColor}; display:flex; justify-content:center;">
      <span style="font-family:'IBM Plex Mono',monospace; font-size:9px; color:var(--text-dim); letter-spacing:0.06em; text-transform:uppercase;">
        Simulated · ${bp.width}px · ${bp.label}
      </span>
    </div>
  `;
  
  sim.innerHTML = navHTML + heroHTML + cardsHTML + footerHTML;
  frameWrap.appendChild(sim);
}

function setupResizeHandle(handle, iframe) {
  let startY, startHeight;
  
  handle.addEventListener('mousedown', (e) => {
    e.preventDefault();
    startY = e.clientY;
    startHeight = iframe.offsetHeight;
    
    const onMouseMove = (e) => {
      const delta = e.clientY - startY;
      const newHeight = Math.max(150, startHeight + delta);
      iframe.style.height = `${newHeight}px`;
    };
    
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.body.style.cursor = 'ns-resize';
  });
}

// ═══════════════════════════════════════════
// BREAKPOINT LIST
// ═══════════════════════════════════════════
function renderBreakpointList() {
  breakpointList.innerHTML = '';

  state.breakpoints.forEach((bp, index) => {
    const item = document.createElement('div');
    item.className = `bp-item${bp.active ? ' active' : ''}`;
    item.innerHTML = `
      <div class="bp-indicator"></div>
      <div class="bp-info">
        <div class="bp-width">
          <span class="bp-width-num">${bp.width}</span>
          <span class="bp-width-unit">px</span>
        </div>
        <div class="bp-label">${bp.label}</div>
      </div>
      <button class="bp-remove" title="Remove breakpoint" data-index="${index}">
        <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
      </button>
    `;

    // Toggle active
    item.addEventListener('click', (e) => {
      if (e.target.closest('.bp-remove')) return;
      bp.active = !bp.active;
      renderBreakpointList();
      if (state.url) {
        renderViewports(state.url);
      }
      saveToStorage();
    });

    // Remove
    item.querySelector('.bp-remove').addEventListener('click', (e) => {
      e.stopPropagation();
      state.breakpoints.splice(index, 1);
      renderBreakpointList();
      if (state.url) {
        renderViewports(state.url);
      }
      updateStatus();
      saveToStorage();
    });

    breakpointList.appendChild(item);
  });
}

// ═══════════════════════════════════════════
// LAYOUT
// ═══════════════════════════════════════════
function updateLayout() {
  viewportGrid.className = 'viewport-grid';
  viewportGrid.classList.add(`layout-${state.layout}`);
  viewportGrid.style.gap = `${state.gap}px`;
}

// ═══════════════════════════════════════════
// ZOOM
// ═══════════════════════════════════════════
function adjustZoom(delta) {
  state.zoom = Math.max(0.3, Math.min(2.0, state.zoom + delta));
  state.zoom = Math.round(state.zoom * 100) / 100;
  
  const display = Math.round(state.zoom * 100) + '%';
  zoomValueEl.textContent = display;
  statusZoom.textContent = display;

  // Update all iframe heights proportionally
  $$('.viewport-card').forEach(card => {
    const bpWidth = parseInt(card.dataset.width);
    const baseHeight = getFrameHeight(bpWidth);
    const scaledHeight = Math.round(baseHeight * state.zoom);
    const iframe = card.querySelector('.viewport-frame');
    if (iframe) {
      iframe.style.height = `${scaledHeight}px`;
    }
  });

  saveToStorage();
}

// ═══════════════════════════════════════════
// SYNC SCROLL
// ═══════════════════════════════════════════
function toggleSync() {
  state.syncScroll = !state.syncScroll;
  btnSync.classList.toggle('active', state.syncScroll);
  statusSync.textContent = state.syncScroll ? 'ON' : 'OFF';
  statusSync.classList.toggle('active', state.syncScroll);
  showToast(state.syncScroll ? 'Scroll sync enabled — scrolls track together' : 'Scroll sync disabled');
}

// ═══════════════════════════════════════════
// FIT MODE
// ═══════════════════════════════════════════
function toggleFitMode() {
  state.fitMode = !state.fitMode;
  btnZoom.classList.toggle('active', state.fitMode);
  
  if (state.fitMode) {
    // Calculate optimal zoom to fit all viewports
    const canvasWidth = viewportGrid.clientWidth - 40;
    const activeBps = state.breakpoints.filter(bp => bp.active);
    const totalWidth = activeBps.reduce((sum, bp) => sum + bp.width, 0) + (activeBps.length - 1) * state.gap;
    const fitZoom = Math.min(1, canvasWidth / totalWidth);
    state.zoom = Math.max(0.3, Math.round(fitZoom * 100) / 100);
    
    const display = Math.round(state.zoom * 100) + '%';
    zoomValueEl.textContent = display;
    statusZoom.textContent = display;
    
    // Apply to iframes
    $$('.viewport-card').forEach(card => {
      const bpWidth = parseInt(card.dataset.width);
      const baseHeight = getFrameHeight(bpWidth);
      const scaledHeight = Math.round(baseHeight * state.zoom);
      const iframe = card.querySelector('.viewport-frame');
      if (iframe) {
        iframe.style.height = `${scaledHeight}px`;
      }
    });
  }
  
  showToast(state.fitMode ? 'Fit mode — scaled to fit canvas' : 'Fit mode disabled');
}

// ═══════════════════════════════════════════
// MODAL
// ═══════════════════════════════════════════
function openModal() {
  modalOverlay.style.display = 'flex';
  modalInput.value = '';
  modalLabelInput.value = '';
  setTimeout(() => modalInput.focus(), 100);
}

function closeModal() {
  modalOverlay.style.display = 'none';
}

function addCustomBreakpoint() {
  const width = parseInt(modalInput.value);
  const label = modalLabelInput.value.trim() || `Custom ${width}px`;

  if (!width || width < 240 || width > 3840) {
    showToast('Enter a width between 240 and 3840', 'error');
    return;
  }

  // Check for duplicate
  if (state.breakpoints.some(bp => bp.width === width)) {
    showToast('This breakpoint already exists', 'error');
    return;
  }

  const device = width < 600 ? 'phone' : width < 1024 ? 'tablet' : 'desktop';
  state.breakpoints.push({ width, label, active: true, device });
  state.breakpoints.sort((a, b) => a.width - b.width);

  renderBreakpointList();
  updateStatus();
  closeModal();

  if (state.url) {
    renderViewports(state.url);
  }

  saveToStorage();
  showToast(`Added ${width}px — ${label}`);
}

// ═══════════════════════════════════════════
// HISTORY
// ═══════════════════════════════════════════
function addToHistory(url) {
  // Remove duplicate
  state.history = state.history.filter(h => h !== url);
  // Add to front
  state.history.unshift(url);
  // Keep max 20
  if (state.history.length > 20) state.history.pop();
  
  renderHistory();
  saveToStorage();
}

function renderHistory() {
  if (state.history.length === 0) {
    historyList.innerHTML = '<div class="history-empty">No URLs loaded yet</div>';
    return;
  }

  historyList.innerHTML = state.history.map((url) => {
    let domain;
    try { domain = new URL(url).hostname; } catch { domain = url; }
    return `
      <div class="history-item" data-url="${escapeAttr(url)}">
        <div class="history-dot"></div>
        <div class="history-url" title="${escapeAttr(url)}">${escapeHtml(domain)}</div>
      </div>
    `;
  }).join('');

  // Click to load
  historyList.querySelectorAll('.history-item').forEach(item => {
    item.addEventListener('click', () => {
      const url = item.dataset.url;
      urlInput.value = url;
      loadUrl(url);
    });
  });
}

// ═══════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════
async function exportScreenshot() {
  if (!state.url) {
    showToast('Load a URL first to export', 'error');
    return;
  }

  showToast('Preparing export…');

  try {
    // Create a clean export container
    const exportDiv = document.createElement('div');
    exportDiv.style.cssText = `
      position: fixed; left: -9999px; top: 0;
      background: #0A0A0A; padding: 40px; z-index: -1;
      width: 1600px;
      font-family: Inter, -apple-system, sans-serif;
    `;

    const date = new Date().toISOString().split('T')[0];
    const domain = (() => { try { return new URL(state.url).hostname; } catch { return state.url; }})();
    const activeBps = state.breakpoints.filter(b => b.active);

    let html = `
      <div style="margin-bottom: 28px;">
        <div style="font-size: 22px; font-weight: 600; color: rgba(255,255,255,0.9); margin-bottom: 4px; letter-spacing: -0.02em;">BreakpointBench</div>
        <div style="font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: rgba(255,255,255,0.35); letter-spacing: 0.06em; text-transform: uppercase;">
          ${escapeHtml(domain)} — ${date} — ${activeBps.length} breakpoints
        </div>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 24px;">
    `;

    const cards = $$('.viewport-card');
    for (const card of cards) {
      const iframe = card.querySelector('.viewport-frame');
      const widthEl = card.querySelector('.viewport-width-display');
      const labelEl = card.querySelector('.viewport-device-label');
      const width = widthEl.textContent;
      const label = labelEl.textContent;

      html += `
        <div style="background: #111; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; overflow: hidden;">
          <div style="display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: #171717; border-bottom: 1px solid rgba(255,255,255,0.08);">
            <span style="font-family: 'IBM Plex Mono', monospace; font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.9);">${width}</span>
            <span style="font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: rgba(255,255,255,0.35); letter-spacing: 0.08em; text-transform: uppercase;">px</span>
            <span style="font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: rgba(255,255,255,0.25);">${escapeHtml(label)}</span>
          </div>
          <div style="padding: 0; background: #fff; min-height: 300px; display: flex; align-items: center; justify-content: center;">
            <span style="font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #999;">Preview — ${width}px</span>
          </div>
        </div>
      `;
    }

    html += '</div>';
    exportDiv.innerHTML = html;
    document.body.appendChild(exportDiv);

    const canvas = await html2canvas(exportDiv, {
      backgroundColor: '#0A0A0A',
      useCORS: true,
      allowTaint: true,
      logging: false,
      scale: 2,
    });

    // Download
    const link = document.createElement('a');
    link.download = `breakpoint-bench-${domain}-${date}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    showToast('Screenshot exported successfully', 'success');
  } catch(e) {
    console.error('Export error:', e);
    showToast('Export failed — try a different URL', 'error');
  }
}

// ═══════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════
function getDeviceIcon(type) {
  switch(type) {
    case 'phone':
      return `<svg width="12" height="16" viewBox="0 0 12 16" fill="none"><rect x="1" y="1" width="10" height="14" rx="2" stroke="currentColor" stroke-width="1.2"/><path d="M4 12.5h4" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg>`;
    case 'tablet':
      return `<svg width="14" height="16" viewBox="0 0 14 16" fill="none"><rect x="1" y="1" width="12" height="14" rx="2" stroke="currentColor" stroke-width="1.2"/><path d="M5 12.5h4" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg>`;
    case 'desktop':
      return `<svg width="16" height="14" viewBox="0 0 16 14" fill="none"><rect x="1" y="1" width="14" height="9" rx="1.5" stroke="currentColor" stroke-width="1.2"/><path d="M5 14h6M8 10v4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`;
    default:
      return `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.2"/></svg>`;
  }
}

function showToast(message, type = '') {
  toast.textContent = message;
  toast.className = 'toast';
  if (type) toast.classList.add(type);
  
  // Force reflow for animation restart
  void toast.offsetWidth;
  toast.classList.add('visible');

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('visible');
  }, 2500);
}

function updateStatus() {
  const activeBps = state.breakpoints.filter(b => b.active);
  statusViewports.textContent = activeBps.length;
  statusSync.textContent = state.syncScroll ? 'ON' : 'OFF';
  statusSync.classList.toggle('active', state.syncScroll);
  statusZoom.textContent = Math.round(state.zoom * 100) + '%';

  if (state.url) {
    try {
      const domain = new URL(state.url).hostname;
      statusUrl.querySelector('.status-value').textContent = domain;
    } catch {
      statusUrl.querySelector('.status-value').textContent = state.url;
    }
  }
}

function startClock() {
  function update() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    statusTime.textContent = `${h}:${m}`;
  }
  update();
  setInterval(update, 30000);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ═══════════════════════════════════════════
// PERSISTENCE
// ═══════════════════════════════════════════
function saveToStorage() {
  try {
    localStorage.setItem('breakpointbench', JSON.stringify({
      breakpoints: state.breakpoints,
      zoom: state.zoom,
      gap: state.gap,
      layout: state.layout,
      bgTheme: state.bgTheme,
      history: state.history,
      url: state.url,
    }));
  } catch(e) {}
}

function loadFromStorage() {
  try {
    const saved = JSON.parse(localStorage.getItem('breakpointbench'));
    if (saved) {
      if (saved.breakpoints) state.breakpoints = saved.breakpoints;
      if (saved.zoom != null) state.zoom = saved.zoom;
      if (saved.gap) state.gap = saved.gap;
      if (saved.layout) state.layout = saved.layout;
      if (saved.bgTheme) state.bgTheme = saved.bgTheme;
      if (saved.history) state.history = saved.history;
      
      // Restore UI state
      zoomValueEl.textContent = Math.round(state.zoom * 100) + '%';
      gapSlider.value = state.gap;
      gapValueEl.textContent = state.gap;
      
      $$('.seg-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.layout === state.layout);
      });
      
      $$('.theme-dot').forEach(d => {
        d.classList.toggle('active', d.dataset.bg === state.bgTheme);
      });

      renderBreakpointList();
      renderHistory();
      updateLayout();
      updateStatus();

      if (saved.url) {
        urlInput.value = saved.url;
        state.url = saved.url;
        // Auto-load the saved URL
        emptyState.style.display = 'none';
        loadingOverlay.style.display = 'flex';
        renderViewports(saved.url);
      }
    }
  } catch(e) {}
}

// ═══════════════════════════════════════════
// BOOT
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', init);
