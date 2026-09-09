/**
 * Keyboard Shortcuts — Chord Forge
 */

export function initKeyboard(handlers) {
  document.addEventListener('keydown', (e) => {
    // Don't intercept input fields
    if (e.target && e.target.matches && e.target.matches('input, textarea, select')) return;

    switch (e.code) {
      case 'Space':
        e.preventDefault();
        handlers.playChord();
        break;
      case 'ArrowRight':
        e.preventDefault();
        handlers.nextChord();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        handlers.prevChord();
        break;
      case 'KeyR':
        // R for randomize (only if not in an input)
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          if (handlers.randomize) handlers.randomize();
        }
        break;
      case 'KeyS':
        // S for save
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          if (handlers.save) handlers.save();
        }
        break;
      case 'KeyM':
        // M for toggle mute / stop
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          if (handlers.stop) handlers.stop();
        }
        break;
    }

    // Number keys 1-9 to select chord from progression
    if (e.key >= '1' && e.key <= '9') {
      handlers.selectChord(parseInt(e.key) - 1);
    }
  });
}
