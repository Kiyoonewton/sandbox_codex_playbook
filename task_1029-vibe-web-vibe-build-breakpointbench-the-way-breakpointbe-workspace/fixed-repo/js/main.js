/**
 * BreakpointBench — Main Entry Point
 * Wires state, keyboard, and UI together
 */

import {
  state,
  pushUndo,
  undo,
  redo,
  saveToStorage,
  loadFromStorage,
} from "./state.js";
import { $, $$, showToast, startClock, getDomain } from "./utils.js";
import { handleKeyboard, registerHandlers } from "./keyboard.js";
import { renderViewports } from "./ui/viewports.js";
import {
  renderBreakpointList,
  updateLayout,
  adjustZoom,
  updateZoomDisplay,
  renderHistory,
  addToHistory,
  updateStatus,
  initControls,
} from "./ui/sidebar.js";
import { initModal, closeModal, openModal } from "./ui/modal.js";

/** Load a URL and render viewports */
function loadUrl(url) {
  if (!url) return;
  if (!url.startsWith("http://") && !url.startsWith("https://"))
    url = "https://" + url;
  try {
    new URL(url);
  } catch {
    showToast("Invalid URL format", "error");
    return;
  }

  pushUndo();
  state.url = url;
  state.zoom = 1;
  updateZoomDisplay();
  const input = $("#urlInput");
  if (input) input.value = url;
  const emptyState = $("#emptyState");
  if (emptyState) emptyState.style.display = "none";
  const loading = $("#loadingOverlay");
  if (loading) loading.style.display = "flex";

  addToHistory(url);
  renderViewports(url);
  updateStatus();
  saveToStorage();
  showToast("Loading " + getDomain(url));
}

/** Toggle sync scroll */
function toggleSync() {
  state.syncScroll = !state.syncScroll;
  const btn = $("#btnSync");
  if (btn) btn.classList.toggle("active", state.syncScroll);
  const sv = $("#statusSync");
  if (sv) {
    sv.textContent = state.syncScroll ? "ON" : "OFF";
    sv.classList.toggle("active", state.syncScroll);
  }
  showToast(state.syncScroll ? "Scroll sync enabled" : "Scroll sync disabled");
}

/** Toggle fit mode */
function toggleFitMode() {
  if (!state.url) {
    showToast("Load a URL first to fit", "error");
    return;
  }
  state.fitMode = !state.fitMode;
  const btn = $("#btnZoom");
  if (btn) btn.classList.toggle("active", state.fitMode);

  if (state.fitMode) {
    const cw = $("#viewportGrid")?.clientWidth - 40 || 800;
    const ab = state.breakpoints.filter((b) => b.active);
    const tw =
      ab.reduce((s, b) => s + b.width, 0) + (ab.length - 1) * state.gap;
    state.zoom = Math.max(0.3, Math.round(Math.min(1, cw / tw) * 100) / 100);
    updateZoomDisplay();
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
  }
  showToast(state.fitMode ? "Fit mode enabled" : "Fit mode disabled");
}

/** Reset zoom to 100% */
function zoomReset() {
  state.zoom = 1;
  updateZoomDisplay();
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
      iframe.style.height = fh + "px";
    }
  });
  saveToStorage();
}

/** Export screenshot — downloads individual images for each active breakpoint */
async function exportScreenshot() {
  if (!state.url) {
    showToast("Load a URL first", "error");
    return;
  }

  // Wait for html2canvas to load
  if (typeof html2canvas === "undefined") {
    showToast("Export library loading — try again in a moment", "error");
    return;
  }

  showToast("Preparing export…");

  try {
    const domain = getDomain(state.url);
    const cards = $$(".viewport-card");
    if (cards.length === 0) {
      showToast("No viewports to export", "error");
      return;
    }

    const ab = state.breakpoints.filter((b) => b.active);
    let exported = 0;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const width = card.dataset.width || ab[i]?.width || "unknown";
      const label =
        card.querySelector(".viewport-device-label")?.textContent || "";

      showToast(`Capturing ${width}px (${i + 1}/${cards.length})…`);

      try {
        const canvas = await html2canvas(card, {
          backgroundColor: "#0A0A0A",
          useCORS: true,
          allowTaint: true,
          logging: false,
          scale: 2,
          width: card.offsetWidth,
          height: card.offsetHeight,
          scrollX: 0,
          scrollY: 0,
        });

        // Trigger download for each individual image
        const link = document.createElement("a");
        link.download = `${domain.replace(/\./g, "_")}-${width}px${label ? "-" + label.replace(/\s+/g, "_") : ""}.png`;
        link.href = canvas.toDataURL("image/png");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        exported++;
      } catch (err) {
        console.warn(`Failed to capture ${width}px:`, err);
      }

      // Small delay between downloads to avoid browser blocking
      if (i < cards.length - 1) {
        await new Promise((r) => setTimeout(r, 300));
      }
    }

    if (exported > 0) {
      showToast(
        `Exported ${exported} image${exported > 1 ? "s" : ""}`,
        "success",
      );
    } else {
      showToast("Export failed — no images captured", "error");
    }
  } catch (e) {
    console.error("Export error:", e);
    showToast("Export failed", "error");
  }
}

/** Initialize the application */
function init() {
  loadFromStorage();
  pushUndo();
  renderBreakpointList();
  updateLayout();
  updateStatus();
  startClock();
  initControls();
  initModal();

  // Register keyboard handlers
  registerHandlers({
    toggleSync,
    toggleFitMode,
    export: exportScreenshot,
    zoomIn: () => adjustZoom(0.05),
    zoomOut: () => adjustZoom(-0.05),
    zoomReset,
    closeModal,
    undo: (shift) => {
      if (shift) {
        if (!redo()) showToast("Nothing to redo");
        else {
          renderBreakpointList();
          if (state.url) {
            $("#urlInput").value = state.url;
            renderViewports(state.url);
          } else {
            $("#urlInput").value = "";
            const es = $("#emptyState");
            if (es) es.style.display = "";
            $("#viewportGrid").innerHTML = "";
          }
          updateStatus();
          saveToStorage();
          showToast("Redone");
        }
      } else {
        if (!undo()) showToast("Nothing to undo");
        else {
          renderBreakpointList();
          if (state.url) {
            $("#urlInput").value = state.url;
            renderViewports(state.url);
          } else {
            $("#urlInput").value = "";
            const es = $("#emptyState");
            if (es) es.style.display = "";
            $("#viewportGrid").innerHTML = "";
          }
          updateStatus();
          saveToStorage();
          showToast("Undone");
        }
      }
    },
    redo: () => {
      if (!redo()) showToast("Nothing to redo");
      else {
        renderBreakpointList();
        if (state.url) {
          $("#urlInput").value = state.url;
          renderViewports(state.url);
        } else {
          $("#urlInput").value = "";
          const es = $("#emptyState");
          if (es) es.style.display = "";
          $("#viewportGrid").innerHTML = "";
        }
        updateStatus();
        saveToStorage();
        showToast("Redone");
      }
    },
  });

  document.addEventListener("keydown", handleKeyboard);

  // URL input
  $("#urlInput")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      loadUrl($("#urlInput").value.trim());
    }
  });
  $("#urlSubmit")?.addEventListener("click", () =>
    loadUrl($("#urlInput")?.value.trim()),
  );

  // Header buttons
  $("#btnSync")?.addEventListener("click", toggleSync);
  $("#btnZoom")?.addEventListener("click", toggleFitMode);
  $("#btnExport")?.addEventListener("click", exportScreenshot);
  $("#zoomIn")?.addEventListener("click", () => adjustZoom(0.05));
  $("#zoomOut")?.addEventListener("click", () => adjustZoom(-0.05));

  // Cross-module event for history clicks
  document.addEventListener("bb:loadUrl", (e) => loadUrl(e.detail.url));

  // Load saved URL
  if (state.url) {
    $("#urlInput").value = state.url;
    const es = $("#emptyState");
    if (es) es.style.display = "none";
    const lo = $("#loadingOverlay");
    if (lo) lo.style.display = "flex";
    renderViewports(state.url);
    updateStatus();
    pushUndo();
  }

  renderHistory();
}

document.addEventListener("DOMContentLoaded", init);
