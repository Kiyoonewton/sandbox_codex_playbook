// Keep a pointer scrub gesture as one committed navigation action.
// app.js owns canonical year state/history; this layer previews the thumb while
// dragging and commits the final year through the normal tab navigation path.
(function () {
  'use strict';

  let dragging = false;
  let rect = null;
  let previewYear = null;

  function yearAt(clientX) {
    if (!rect || rect.width === 0) return null;
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(pct * 25 + 2000);
  }

  function preview(year) {
    if (year == null) return;
    previewYear = year;
    const track = document.getElementById('scrubber-track');
    const thumb = document.getElementById('scrubber-thumb');
    if (!track || !thumb) return;
    const pct = ((year - 2000) / 25) * 100;
    thumb.style.left = pct + '%';
    thumb.setAttribute('aria-valuenow', String(year));
    const fill = track.querySelector('.scrubber-fill');
    if (fill) fill.style.width = pct + '%';
  }

  function begin(clientX) {
    const track = document.getElementById('scrubber-track');
    if (!track) return;
    rect = track.getBoundingClientRect();
    if (!rect.width) return;
    dragging = true;
    preview(yearAt(clientX));
  }

  function commit() {
    if (!dragging) return;
    dragging = false;
    const year = previewYear;
    rect = null;
    previewYear = null;
    if (year == null) return;

    const visibleYear = parseInt(document.querySelector('.hero-year')?.textContent, 10);
    if (year === visibleYear) return;

    const tab = document.querySelector(`.tab-btn[data-year="${year}"]`);
    if (tab) tab.click();
  }

  // Capture before app.js sees the pointer events. stopImmediatePropagation is
  // required here because app.js also has document-level drag handlers; stopping
  // only normal propagation still lets those listeners run on the same document.
  document.addEventListener('mousedown', (event) => {
    if (!event.target.closest('#scrubber-track')) return;
    begin(event.clientX);
    if (!dragging) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);

  document.addEventListener('mousemove', (event) => {
    if (!dragging) return;
    preview(yearAt(event.clientX));
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);

  document.addEventListener('mouseup', (event) => {
    if (!dragging) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    commit();
  }, true);
})();
