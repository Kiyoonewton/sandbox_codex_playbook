/**
 * BreakpointBench — Sidebar UI
 * Breakpoint list, controls, history
 */

import { state, pushUndo, saveToStorage } from "../state.js";
import { $, $$, esc, getFrameHeight, showToast } from "../utils.js";
import { renderViewports } from "./viewports.js";

/** Render the breakpoint list in the sidebar */
export function renderBreakpointList() {
  const list = $("#breakpointList");
  list.innerHTML = "";
  state.breakpoints.forEach((bp, i) => {
    const item = document.createElement("div");
    item.className = "bp-item" + (bp.active ? " active" : "");
    item.innerHTML = `
      <div class="bp-indicator"></div>
      <div class="bp-info">
        <div class="bp-width"><span class="bp-width-num">${bp.width}</span><span class="bp-width-unit">px</span></div>
        <div class="bp-label">${esc(bp.label)}</div>
      </div>
      <button class="bp-remove" title="Remove ${bp.width}px" aria-label="Remove ${bp.width}px breakpoint">
        <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
      </button>`;

    item.addEventListener("click", (e) => {
      if (e.target.closest(".bp-remove")) return;
      pushUndo();
      bp.active = !bp.active;
      renderBreakpointList();
      if (state.url) renderViewports(state.url);
      updateStatus();
      saveToStorage();
    });

    item.querySelector(".bp-remove").addEventListener("click", (e) => {
      e.stopPropagation();
      pushUndo();
      state.breakpoints.splice(i, 1);
      renderBreakpointList();
      if (state.url) renderViewports(state.url);
      updateStatus();
      saveToStorage();
    });

    list.appendChild(item);
  });
}

/** Update layout mode */
export function updateLayout() {
  const g = $("#viewportGrid");
  if (g) {
    g.className = "viewport-grid layout-" + state.layout;
    g.style.gap = state.gap + "px";
  }
}

/** Update zoom display */
export function updateZoomDisplay() {
  const disp = Math.round(state.zoom * 100) + "%";
  const zoomEl = $("#zoomValue");
  const statusZoom = $("#statusZoom");
  if (zoomEl) zoomEl.textContent = disp;
  if (statusZoom) statusZoom.textContent = disp;
}

/** Apply zoom to all viewport iframes */
export function applyZoom() {
  updateZoomDisplay();
  $$(".viewport-card").forEach((card) => {
    const bp = parseInt(card.dataset.width);
    const iframe = card.querySelector(".viewport-frame");
    if (iframe) {
      iframe.style.height = Math.round(getFrameHeight(bp) * state.zoom) + "px";
    }
  });
}

/** Adjust zoom by delta */
export function adjustZoom(delta) {
  state.zoom = Math.max(
    0.3,
    Math.min(2.0, Math.round((state.zoom + delta) * 100) / 100),
  );
  if (!state.url) state.zoom = 1;
  updateZoomDisplay();
  // Apply directly to iframes
  $$(".viewport-card").forEach((card) => {
    const bp = parseInt(card.dataset.width);
    const iframe = card.querySelector(".viewport-frame");
    if (iframe) {
      const fh =
        bp <= 320
          ? 400
          : bp <= 390
            ? 450
            : bp <= 768
              ? 500
              : bp <= 1024
                ? 520
                : bp <= 1280
                  ? 540
                  : 560;
      iframe.style.height = Math.round(fh * state.zoom) + "px";
    }
  });
  saveToStorage();
}

/** Render history list */
export function renderHistory() {
  const hl = $("#historyList");
  if (!state.history.length) {
    hl.innerHTML = '<div class="history-empty">No URLs loaded yet</div>';
    return;
  }
  hl.innerHTML = state.history
    .map((url) => {
      let d;
      try {
        d = new URL(url).hostname;
      } catch {
        d = url;
      }
      return `<div class="history-item" data-url="${esc(url)}"><div class="history-dot"></div><div class="history-url" title="${esc(url)}">${esc(d)}</div></div>`;
    })
    .join("");
  hl.querySelectorAll(".history-item").forEach((item) => {
    item.addEventListener("click", () => {
      $("#urlInput").value = item.dataset.url;
      // Trigger load via custom event
      document.dispatchEvent(
        new CustomEvent("bb:loadUrl", { detail: { url: item.dataset.url } }),
      );
    });
  });
}

/** Add URL to history */
export function addToHistory(url) {
  state.history = state.history.filter((h) => h !== url);
  state.history.unshift(url);
  if (state.history.length > 20) state.history.pop();
  renderHistory();
  saveToStorage();
}

/** Update status bar */
export function updateStatus() {
  const ab = state.breakpoints.filter((b) => b.active);
  const sv = $("#statusViewports");
  if (sv) sv.textContent = ab.length;
  const syncEl = $("#statusSync");
  if (syncEl) {
    syncEl.textContent = state.syncScroll ? "ON" : "OFF";
    syncEl.classList.toggle("active", state.syncScroll);
  }
  const zoomEl = $("#statusZoom");
  if (zoomEl) zoomEl.textContent = Math.round(state.zoom * 100) + "%";
  const urlEl = $("#statusUrl")?.querySelector(".status-value");
  if (urlEl) {
    if (state.url) {
      try {
        urlEl.textContent = new URL(state.url).hostname;
      } catch {
        urlEl.textContent = state.url;
      }
    } else {
      urlEl.textContent = "-";
    }
  }
}

/** Initialize sidebar controls */
export function initControls() {
  // Gap slider
  $("#gapSlider")?.addEventListener("input", (e) => {
    state.gap = parseInt(e.target.value);
    const gapVal = $("#gapValue");
    if (gapVal) gapVal.textContent = state.gap;
    const g = $("#viewportGrid");
    if (g) g.style.gap = state.gap + "px";
    saveToStorage();
  });

  // Layout buttons
  $$(".seg-btn").forEach((b) => {
    b.addEventListener("click", () => {
      $$(".seg-btn").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      state.layout = b.dataset.layout;
      updateLayout();
      saveToStorage();
    });
  });

  // Theme dots
  $$(".theme-dot").forEach((d) => {
    d.addEventListener("click", () => {
      $$(".theme-dot").forEach((x) => x.classList.remove("active"));
      d.classList.add("active");
      state.bgTheme = d.dataset.bg;
      $$(".viewport-frame-wrap").forEach(
        (w) => (w.style.background = state.bgTheme),
      );
      saveToStorage();
    });
  });

  // URL input validation
  $("#urlInput")?.addEventListener("input", () => {
    const v = $("#urlInput").value.trim();
    if (v) {
      try {
        new URL(v.startsWith("http") ? v : "https://" + v);
        $("#urlInput").style.borderColor = "";
      } catch {
        $("#urlInput").style.borderColor = "var(--red)";
      }
    } else {
      $("#urlInput").style.borderColor = "";
    }
  });

  // Restore UI state
  $("#zoomValue").textContent = Math.round(state.zoom * 100) + "%";
  const gs = $("#gapSlider");
  if (gs) gs.value = state.gap;
  const gv = $("#gapValue");
  if (gv) gv.textContent = state.gap;
  $$(".seg-btn").forEach((b) =>
    b.classList.toggle("active", b.dataset.layout === state.layout),
  );
  $$(".theme-dot").forEach((d) =>
    d.classList.toggle("active", d.dataset.bg === state.bgTheme),
  );
}
