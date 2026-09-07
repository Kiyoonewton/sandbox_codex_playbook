// Internet Time Machine - Main Application
(function() {
  'use strict';

  let currentYear = 2000;
  let currentEra = null;
  let historyStack = [];
  let historyIndex = -1;
  const MAX_HISTORY = 50;

  // === INIT ===
  function init() {
    buildTabs();
    setupScrollTop();
    setupKeyboardNav();
    setupSearch();
    setupYearScrubber();
    
    // Restore saved year or default to 2000
    const savedYear = localStorage.getItem('itm-year');
    const year = savedYear && window.YEAR_DATA[parseInt(savedYear)] ? parseInt(savedYear) : 2000;
    selectYear(year, false);
  }

  // === BUILD YEAR TABS ===
  function buildTabs() {
    const tabScroll = document.getElementById('tab-scroll');
    const eraLabel = document.getElementById('era-label');
    let lastEra = '';

    for (let y = 2000; y <= 2025; y++) {
      const data = window.YEAR_DATA[y];
      if (!data) continue;

      const btn = document.createElement('button');
      btn.className = 'tab-btn';
      btn.dataset.year = y;
      btn.innerHTML = `<span class="tab-year-text">${y}</span>`;

      if (data.era !== lastEra) {
        const separator = document.createElement('span');
        separator.style.cssText = 'width:1px;height:24px;background:var(--border);margin:0 4px;flex-shrink:0;align-self:center;transition:background 0.5s';
        tabScroll.appendChild(separator);
        lastEra = data.era;
      }

      btn.addEventListener('click', () => selectYear(y, true));
      tabScroll.appendChild(btn);
    }
  }

  // === SELECT YEAR ===
  function selectYear(year, animate, skipHistory) {
    if (year === currentYear && animate) return;
    const data = window.YEAR_DATA[year];
    if (!data) return;

    const oldEra = currentEra;
    currentYear = year;
    currentEra = data.era;

    // Track history for undo/redo
    if (!skipHistory) {
      historyStack = historyStack.slice(0, historyIndex + 1);
      historyStack.push(year);
      if (historyStack.length > MAX_HISTORY) historyStack.shift();
      historyIndex = historyStack.length - 1;
      updateUndoRedoButtons();
    }

    // Show loading bar
    if (animate) {
      const loadingBar = document.getElementById('loading-bar');
      loadingBar.classList.add('active');
      setTimeout(() => loadingBar.classList.remove('active'), 400);
    }

    // Update tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.year) === year);
    });

    // Scroll active tab into view
    const activeTab = document.querySelector(`.tab-btn[data-year="${year}"]`);
    if (activeTab) {
      activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    // Apply theme
    applyTheme(data.era);

    // Update era label
    const theme = window.ERA_THEMES[data.era];
    document.getElementById('era-label').textContent = theme.name;

    // Apply transition animation
    const content = document.getElementById('main-content');
    if (animate && oldEra !== data.era) {
      content.className = 'main-content';
      // Force reflow
      void content.offsetWidth;
      
      const transition = theme.transition;
      const transitionClass = {
        glitch: 'glitch-text',
        star: 'star-wipe',
        fade: 'smooth-fade',
        slide: 'slide-in',
        crossfade: 'crossfade-in',
        snap: 'vertical-snap'
      }[transition] || 'content-fade-enter';
      
      content.classList.add(transitionClass);
    } else if (animate) {
      content.className = 'main-content content-fade-enter';
    }

    // Render content
    renderContent(data, animate);

    // Scroll to top
    if (animate) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Persist selection
    try { localStorage.setItem('itm-year', year); } catch(e) {}
    
    // Update URL hash
    try { window.history.replaceState(null, '', '#' + year); } catch(e) {}
    
    // Update favorite button
    updateFavButton();
    
    // Screen reader announcement
    const announcer = document.getElementById('sr-announcer');
    if (announcer) {
      announcer.textContent = `Now viewing year ${year}. ${data.tagline}`;
    }
  }

  // === APPLY THEME ===
  function applyTheme(era) {
    const theme = window.ERA_THEMES[era];
    if (!theme) return;

    const root = document.documentElement;
    const c = theme.colors;
    const e = theme.effects;

    root.style.setProperty('--bg', c.bg);
    root.style.setProperty('--surface', c.surface);
    root.style.setProperty('--surface-alt', c.surfaceAlt);
    root.style.setProperty('--ink', c.ink);
    root.style.setProperty('--accent', c.accent);
    root.style.setProperty('--accent2', c.accent2);
    root.style.setProperty('--accent3', c.accent3);
    root.style.setProperty('--success', c.success);
    root.style.setProperty('--danger', c.danger);
    root.style.setProperty('--muted', c.muted);
    root.style.setProperty('--border', c.border);
    root.style.setProperty('--hero-bg', c.hero);
    root.style.setProperty('--card-bg', c.cardBg);
    root.style.setProperty('--card-border', c.cardBorder);
    root.style.setProperty('--tab-bg', c.tabBg);
    root.style.setProperty('--tab-active', c.tabActive);
    root.style.setProperty('--tab-text', c.tabText);
    root.style.setProperty('--tab-active-text', c.tabActiveText);
    root.style.setProperty('--card-shadow', e.cardShadow);
    root.style.setProperty('--card-hover-shadow', e.cardHoverShadow || e.cardShadow);
    root.style.setProperty('--card-radius', e.cardBorderRadius);
    root.style.setProperty('--card-border-width', e.cardBorderWidth);
    root.style.setProperty('--hero-text-shadow', e.heroTextShadow);
    root.style.setProperty('--font-display', theme.fonts.display);
    root.style.setProperty('--font-body', theme.fonts.body);
    root.style.setProperty('--font-accent', theme.fonts.accent);
    root.style.setProperty('--letter-spacing', e.letterSpacing);
    root.style.setProperty('--text-transform', e.textTransform);

    // Scanline effect
    document.body.classList.toggle('scanline-active', !!e.scanline);

    // Glitter overlay
    const glitter = document.getElementById('glitter-overlay');
    glitter.classList.toggle('active', !!e.glitterOverlay);
  }

  // === RENDER CONTENT ===
  function renderContent(data, animate) {
    const container = document.getElementById('main-content');

    // Build category cards HTML
    let categoriesHTML = '';
    const categoryOrder = ['music', 'games', 'technology', 'memes', 'fashion', 'movies', 'events', 'culture'];
    
    categoryOrder.forEach((key, catIdx) => {
      const cat = data[key];
      if (!cat) return;
      const itemsHTML = cat.items.map(item => `
        <div class="item-row">
          <span class="item-name">${item.name}</span>
          <span class="item-detail">${item.artist || item.developer || item.detail || ''}</span>
        </div>
      `).join('');

      categoriesHTML += `
        <div class="category-card" onclick="toggleCategory(this)" tabindex="0" role="button" aria-expanded="false">
          <span class="category-number">${catIdx + 1}</span>
          <div class="category-header">
            <span class="category-icon">${cat.icon}</span>
            <span class="category-title">${cat.title}</span>
            <span class="category-toggle">▸</span>
          </div>
          <div class="category-items">${itemsHTML}</div>
        </div>
      `;
    });

    // Viral meter
    let viralHTML = '';
    if (data.viralMeter) {
      viralHTML = data.viralMeter.map(v => `
        <div class="viral-item">
          <span class="viral-rank">#${v.rank}</span>
          <span class="viral-name">${v.name}</span>
          <div class="viral-bar-wrapper">
            <div class="viral-bar" style="width: 0%;" data-width="${v.heat}%"></div>
          </div>
        </div>
      `).join('');
    }

    // What's new
    let whatsNewHTML = '';
    if (data.whatsNew) {
      whatsNewHTML = data.whatsNew.map(w => `
        <div class="whats-new-item">
          <div class="whats-new-type">${w.type}</div>
          <div class="whats-new-name">${w.name}</div>
          <div class="whats-new-detail">${w.detail}</div>
        </div>
      `).join('');
    }

    // Then vs Now
    let thenNowHTML = '';
    if (data.thenVsNow) {
      const t = data.thenVsNow;
      thenNowHTML = `
        <div class="then-now">
          <div class="then-now-card">
            <div class="then-now-icon">${t.then.icon}</div>
            <div class="then-now-label">${t.then.label}</div>
            <div class="then-now-desc">${t.then.desc}</div>
          </div>
          <div class="then-now-vs">VS</div>
          <div class="then-now-card">
            <div class="then-now-icon">${t.now.icon}</div>
            <div class="then-now-label">${t.now.label}</div>
            <div class="then-now-desc">${t.now.desc}</div>
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <section class="hero">
        <div class="hero-badge">Internet Time Machine</div>
        <h1 class="hero-year">${data.year || currentYear}</h1>
        <p class="hero-tagline">${data.tagline}</p>
        <div class="hero-divider"></div>
        <div class="hero-year-counter">Year ${currentYear - 2000 + 1} of 26 — ${Math.round(((currentYear - 2000) / 25) * 100)}% through internet history</div>
        ${renderFavoritesBar()}
      </section>

      <div class="year-progress">
        <span class="year-progress-text">2000</span>
        <div class="year-progress-bar">
          <div class="year-progress-fill" style="width: ${((currentYear - 2000) / 25) * 100}%"></div>
        </div>
        <span class="year-progress-text">2025</span>
      </div>

      <div class="era-timeline">
        ${renderTimeline()}
      </div>

      <div class="year-scrubber">
        <div class="scrubber-track" id="scrubber-track">
          <div class="scrubber-fill" style="width: ${((currentYear - 2000) / 25) * 100}%"></div>
          <div class="scrubber-thumb" id="scrubber-thumb" style="left: ${((currentYear - 2000) / 25) * 100}%" tabindex="0" role="slider" aria-label="Year scrubber" aria-valuemin="2000" aria-valuemax="2025" aria-valuenow="${currentYear}"></div>
        </div>
        <div class="scrubber-labels">
          <span>◀ 2000</span>
          <span>2025 ▶</span>
        </div>
      </div>

      <section class="search-section">
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input type="text" placeholder="${data.popularSearch}" readonly />
        </div>
        <p class="search-label">What people were searching for in ${currentYear}</p>
      </section>

      <section class="features-section">
        <div class="feature-panel">
          <h3 class="feature-title">
            <span class="feature-title-icon">📊</span>
            Viral Meter — What's Trending
          </h3>
          <div class="viral-list">${viralHTML}</div>
        </div>

        <div class="feature-panel compare-panel">
          <h3 class="feature-title">
            <span class="feature-title-icon">🔄</span>
            Compare Years
          </h3>
          <div class="compare-controls">
            <select id="compare-year" class="compare-select" onchange="compareYear(this.value)">
              <option value="">Select a year to compare...</option>
            </select>
          </div>
          <div id="compare-result" class="compare-result"></div>
        </div>
      </section>

      <section>
        <h2 style="font-family:var(--font-accent);font-size:1.3rem;margin-bottom:16px;color:var(--ink)">
          Explore ${currentYear}
        </h2>
        <div class="categories-grid">${categoriesHTML}</div>
      </section>

      <section class="features-section">
        <div class="feature-panel">
          <h3 class="feature-title">
            <span class="feature-title-icon">🆕</span>
            What Was New in ${currentYear}?
          </h3>
          <div class="whats-new-grid">${whatsNewHTML}</div>
        </div>

        <div class="feature-panel">
          <h3 class="feature-title">
            <span class="feature-title-icon">⏳</span>
            Then vs Now
          </h3>
          ${thenNowHTML}
        </div>
      </section>

      <footer class="footer">
        Internet Time Machine — Travel through internet culture, one year at a time.
      </footer>
    `;

    // Animate viral bars after render
    requestAnimationFrame(() => {
      setTimeout(() => {
        document.querySelectorAll('.viral-bar').forEach(bar => {
          bar.style.width = bar.dataset.width;
        });
        // Populate compare select
        populateCompareSelect();
        // Scrubber is set up once at init; just update visual position
        refreshScrubberVisual();
      }, 100);
    });
  }

  // === TOGGLE CATEGORY ===
  window.toggleCategory = function(card) {
    const wasExpanded = card.classList.contains('expanded');
    // Close all others
    document.querySelectorAll('.category-card.expanded').forEach(c => {
      c.classList.remove('expanded');
      const toggle = c.querySelector('.category-toggle');
      if (toggle) toggle.textContent = '▸';
    });
    if (!wasExpanded) {
      card.classList.add('expanded');
      const toggle = card.querySelector('.category-toggle');
      if (toggle) toggle.textContent = '▾';
      // Smooth scroll to card
      setTimeout(() => {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  };

  // === RANDOM YEAR ===
  window.randomYear = function() {
    const years = Object.keys(window.YEAR_DATA).map(Number);
    let newYear;
    do {
      newYear = years[Math.floor(Math.random() * years.length)];
    } while (newYear === currentYear && years.length > 1);
    selectYear(newYear, true);
  };

  // === TOGGLE SHORTCUTS ===
  window.toggleShortcuts = function() {
    const panel = document.getElementById('shortcuts-panel');
    panel.classList.toggle('visible');
  };

  // === SHARE YEAR ===
  window.shareYear = function() {
    const url = window.location.origin + window.location.pathname + '#' + currentYear;
    const text = `Check out internet culture in ${currentYear}! 🌐`;
    
    if (navigator.share) {
      navigator.share({ title: 'Internet Time Machine', text, url }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        showToast('Link copied to clipboard!');
      }).catch(() => {
        showToast('Could not copy link');
      });
    } else {
      showToast('Share: ' + url);
    }
  };

  // === UNDO/REDO ===
  window.undoYear = function() {
    if (historyIndex > 0) {
      historyIndex--;
      selectYear(history[historyIndex], true, true);
      updateUndoRedoButtons();
    }
  };

  window.redoYear = function() {
    if (historyIndex < historyStack.length - 1) {
      historyIndex++;
      selectYear(history[historyIndex], true, true);
      updateUndoRedoButtons();
    }
  };

  function updateUndoRedoButtons() {
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');
    if (undoBtn) undoBtn.style.opacity = historyIndex > 0 ? '1' : '0.3';
    if (redoBtn) redoBtn.style.opacity = historyIndex < historyStack.length - 1 ? '1' : '0.3';
  }

  // === TOAST NOTIFICATION ===
  function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.style.cssText = `
        position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
        background: var(--ink); color: var(--bg); padding: 10px 20px;
        border-radius: 8px; font-size: 0.85rem; z-index: 10002;
        font-family: var(--font-body); box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transition: opacity 0.3s ease; opacity: 0;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    setTimeout(() => { toast.style.opacity = '0'; }, 2000);
  }

  // === FAVORITES ===
  function getFavorites() {
    try { return JSON.parse(localStorage.getItem('itm-favorites') || '[]'); } catch(e) { return []; }
  }

  function renderFavoritesBar() {
    const favs = getFavorites();
    if (favs.length === 0) return '';
    return `
      <div class="favorites-bar">
        <span class="favorites-label">★ Favorites:</span>
        ${favs.map(y => `
          <button class="fav-year-btn ${y === currentYear ? 'active' : ''}" onclick="document.querySelector('.tab-btn[data-year=\\'${y}\\']').click()">
            ${y}
          </button>
        `).join('')}
      </div>
    `;
  }

  function updateFavButton() {
    const btn = document.getElementById('fav-btn');
    if (!btn) return;
    const favs = getFavorites();
    const isFav = favs.includes(currentYear);
    btn.textContent = isFav ? '★' : '☆';
    btn.title = isFav ? 'Remove from favorites' : 'Favorite this year';
  }

  window.toggleFavorite = function() {
    let favs = getFavorites();
    if (favs.includes(currentYear)) {
      favs = favs.filter(y => y !== currentYear);
      showToast('Removed from favorites');
    } else {
      favs.push(currentYear);
      favs.sort((a, b) => a - b);
      showToast('Added to favorites ★');
    }
    try { localStorage.setItem('itm-favorites', JSON.stringify(favs)); } catch(e) {}
    updateFavButton();
  };

  // Close shortcuts on outside click
  document.addEventListener('click', (e) => {
    const panel = document.getElementById('shortcuts-panel');
    if (panel.classList.contains('visible') && 
        !panel.contains(e.target) && 
        !e.target.closest('.info-btn')) {
      panel.classList.remove('visible');
    }
  });

  // === COMPARE YEARS ===
  function renderTimeline() {
    const eras = [
      { name: 'Early', start: 2000, end: 2003, color: '#FF00FF' },
      { name: 'MySpace', start: 2004, end: 2008, color: '#FF1493' },
      { name: 'Facebook', start: 2009, end: 2012, color: '#1877F2' },
      { name: 'Tumblr', start: 2013, end: 2015, color: '#FF6B9D' },
      { name: 'Instagram', start: 2016, end: 2019, color: '#E1306C' },
      { name: 'TikTok', start: 2020, end: 2025, color: '#FF0050' }
    ];
    
    return eras.map(era => {
      const isActive = currentYear >= era.start && currentYear <= era.end;
      const width = ((era.end - era.start + 1) / 26) * 100;
      return `
        <div class="timeline-era ${isActive ? 'active' : ''}" style="flex: ${era.end - era.start + 1}">
          <div class="timeline-era-bar" style="background: ${era.color}"></div>
          <div class="timeline-era-label">${era.name}</div>
        </div>
      `;
    }).join('');
  }

  function populateCompareSelect() {
    const select = document.getElementById('compare-year');
    if (!select) return;
    select.innerHTML = '<option value="">Select a year to compare...</option>';
    for (let y = 2000; y <= 2025; y++) {
      if (y === currentYear) continue;
      const opt = document.createElement('option');
      opt.value = y;
      opt.textContent = y;
      select.appendChild(opt);
    }
  }

  window.compareYear = function(year) {
    const result = document.getElementById('compare-result');
    if (!year) { result.innerHTML = ''; return; }
    
    const otherData = window.YEAR_DATA[parseInt(year)];
    const currentData = window.YEAR_DATA[currentYear];
    if (!otherData) return;

    // Compare viral meter
    let compareHTML = '<div class="compare-grid">';
    compareHTML += `
      <div class="compare-card">
        <div class="compare-year-label">${currentYear}</div>
        <div class="compare-tagline">${currentData.tagline}</div>
        <div class="compare-search">🔍 ${currentData.popularSearch}</div>
      </div>
      <div class="compare-card">
        <div class="compare-year-label">${year}</div>
        <div class="compare-tagline">${otherData.tagline}</div>
        <div class="compare-search">🔍 ${otherData.popularSearch}</div>
      </div>
    `;
    compareHTML += '</div>';

    // Compare top memes
    if (currentData.memes && otherData.memes) {
      compareHTML += `
        <div class="compare-section">
          <h4>😂 Memes Comparison</h4>
          <div class="compare-grid">
            <div class="compare-list">
              <strong>${currentYear}:</strong> ${currentData.memes.items.slice(0, 3).map(m => m.name).join(', ')}
            </div>
            <div class="compare-list">
              <strong>${year}:</strong> ${otherData.memes.items.slice(0, 3).map(m => m.name).join(', ')}
            </div>
          </div>
        </div>
      `;
    }

    // Compare technology
    if (currentData.technology && otherData.technology) {
      compareHTML += `
        <div class="compare-section">
          <h4>📱 Technology Comparison</h4>
          <div class="compare-grid">
            <div class="compare-list">
              <strong>${currentYear}:</strong> ${currentData.technology.items.slice(0, 3).map(t => t.name).join(', ')}
            </div>
            <div class="compare-list">
              <strong>${year}:</strong> ${otherData.technology.items.slice(0, 3).map(t => t.name).join(', ')}
            </div>
          </div>
        </div>
      `;
    }

    result.innerHTML = compareHTML;
  };

  // === SCROLL TO TOP ===
  function setupScrollTop() {
    const btn = document.getElementById('scroll-top');
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // === KEYBOARD NAVIGATION ===
  function setupKeyboardNav() {
    document.addEventListener('keydown', (e) => {
      // Don't interfere with input fields
      if (e.target.tagName === 'INPUT') return;
      
      if (e.key === 'ArrowLeft' && currentYear > 2000) {
        e.preventDefault();
        selectYear(currentYear - 1, true);
      } else if (e.key === 'ArrowRight' && currentYear < 2025) {
        e.preventDefault();
        selectYear(currentYear + 1, true);
      } else if (e.key === 'Home') {
        e.preventDefault();
        selectYear(2000, true);
      } else if (e.key === 'End') {
        e.preventDefault();
        selectYear(2025, true);
      } else if (e.key === 'Escape') {
        // Collapse any expanded category
        document.querySelectorAll('.category-card.expanded').forEach(c => {
          c.classList.remove('expanded');
          const toggle = c.querySelector('.category-toggle');
          if (toggle) toggle.textContent = '▸';
        });
      } else if (e.key >= '1' && e.key <= '8') {
        // Number keys expand category cards
        const idx = parseInt(e.key) - 1;
        const cards = document.querySelectorAll('.category-card');
        if (cards[idx]) {
          toggleCategory(cards[idx]);
          cards[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } else if (e.key === 'r' || e.key === 'R') {
        window.randomYear();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        window.undoYear();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        window.redoYear();
      }
    });
  }

  // === SEARCH ===
  function setupSearch() {
    // The search bar is read-only but we can make it interactive
    // by showing trending topics when clicked
  }

  // === YEAR SCRUBBER (mini-map) ===
  // Public helper to refresh scrubber visual after re-renders
  function refreshScrubberVisual() {
    const track = document.getElementById('scrubber-track');
    const thumb = document.getElementById('scrubber-thumb');
    if (!track || !thumb) return;
    const pct = ((currentYear - 2000) / 25) * 100;
    thumb.style.left = pct + '%';
    const fill = track.querySelector('.scrubber-fill');
    if (fill) fill.style.width = pct + '%';
    thumb.setAttribute('aria-valuenow', currentYear);
  }

  // Setup is done ONCE at init. Event handlers always query current DOM elements
  // to avoid stale references after re-renders.
  let scrubberIsDragging = false;

  function setupYearScrubber() {
    // URL hash navigation
    const hash = window.location.hash.replace('#', '');
    if (hash && window.YEAR_DATA[parseInt(hash)]) {
      currentYear = parseInt(hash);
    }

    // --- Scrubber helpers (always fetch fresh DOM elements) ---
    function getScrubberEls() {
      return {
        track: document.getElementById('scrubber-track'),
        thumb: document.getElementById('scrubber-thumb')
      };
    }

    function yearFromPosition(clientX) {
      const { track } = getScrubberEls();
      if (!track) return currentYear;
      const rect = track.getBoundingClientRect();
      if (rect.width === 0) return currentYear; // detached element guard
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return Math.round(pct * 25 + 2000);
    }

    function updateScrubberVisual(year) {
      const { track, thumb } = getScrubberEls();
      if (!track || !thumb) return;
      const pct = ((year - 2000) / 25) * 100;
      thumb.style.left = pct + '%';
      const fill = track.querySelector('.scrubber-fill');
      if (fill) fill.style.width = pct + '%';
      thumb.setAttribute('aria-valuenow', year);
    }

    // --- Track click/touch via event delegation on main-content ---
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.addEventListener('mousedown', (e) => {
        const track = e.target.closest('#scrubber-track');
        if (!track) return;
        scrubberIsDragging = true;
        const year = yearFromPosition(e.clientX);
        selectYear(year, false);
        updateScrubberVisual(year);
      });

      mainContent.addEventListener('touchstart', (e) => {
        const track = e.target.closest('#scrubber-track');
        if (!track) return;
        scrubberIsDragging = true;
        const year = yearFromPosition(e.touches[0].clientX);
        selectYear(year, false);
        updateScrubberVisual(year);
      }, { passive: true });

      // Keyboard on thumb via delegation
      mainContent.addEventListener('keydown', (e) => {
        if (e.target.id !== 'scrubber-thumb') return;
        if (e.key === 'ArrowLeft' && currentYear > 2000) {
          e.preventDefault();
          selectYear(currentYear - 1, true);
          updateScrubberVisual(currentYear);
        } else if (e.key === 'ArrowRight' && currentYear < 2025) {
          e.preventDefault();
          selectYear(currentYear + 1, true);
          updateScrubberVisual(currentYear);
        }
      });
    }

    // --- Document-level drag handlers (registered ONCE) ---
    document.addEventListener('mousemove', (e) => {
      if (!scrubberIsDragging) return;
      e.preventDefault();
      const year = yearFromPosition(e.clientX);
      if (year !== currentYear) {
        selectYear(year, false);
        updateScrubberVisual(year);
      }
    });

    document.addEventListener('mouseup', () => { scrubberIsDragging = false; });

    document.addEventListener('touchmove', (e) => {
      if (!scrubberIsDragging) return;
      const year = yearFromPosition(e.touches[0].clientX);
      if (year !== currentYear) {
        selectYear(year, false);
        updateScrubberVisual(year);
      }
    }, { passive: true });

    document.addEventListener('touchend', () => { scrubberIsDragging = false; });
  }

  // === START ===
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
