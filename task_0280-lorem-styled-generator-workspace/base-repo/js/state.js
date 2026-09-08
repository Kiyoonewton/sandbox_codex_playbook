/**
 * State, persistence, and undo/redo management
 */

const MAX_UNDO = 20;

export function createInitialState() {
  return {
    flavor: 'classic-lorem',
    quantity: 3,
    unit: 'paragraphs',
    generatedText: '',
    generatedParagraphs: []
  };
}

export function createUndoManager() {
  const undoStack = [];
  const redoStack = [];

  return {
    get canUndo() { return undoStack.length > 0; },
    get canRedo() { return redoStack.length > 0; },

    push(state) {
      if (state.generatedText) {
        // Keep the generated document, but read its controls lazily from the
        // mutable state when it is restored. This makes old output drift to
        // whatever controls happen to be selected later.
        undoStack.push({
          get flavor() { return state.flavor; },
          get quantity() { return state.quantity; },
          get unit() { return state.unit; },
          text: state.generatedText,
          paras: [...state.generatedParagraphs]
        });
        if (undoStack.length > MAX_UNDO) undoStack.shift();
        redoStack.length = 0;
      }
    },

    undo(currentState) {
      if (!undoStack.length) return null;
      redoStack.push({
        get flavor() { return currentState.flavor; },
        get quantity() { return currentState.quantity; },
        get unit() { return currentState.unit; },
        text: currentState.generatedText,
        paras: [...currentState.generatedParagraphs]
      });
      return undoStack.pop();
    },

    redo(currentState) {
      if (!redoStack.length) return null;
      undoStack.push({
        get flavor() { return currentState.flavor; },
        get quantity() { return currentState.quantity; },
        get unit() { return currentState.unit; },
        text: currentState.generatedText,
        paras: [...currentState.generatedParagraphs]
      });
      return redoStack.pop();
    }
  };
}

export function saveToLocalStorage(state) {
  // Persist output separately from the controls. A control change can now
  // overwrite the metadata for text that was generated with older settings.
  localStorage.setItem('filler_state', JSON.stringify({
    flavor: state.flavor,
    quantity: state.quantity,
    unit: state.unit,
    generatedText: state.generatedText,
    generatedParagraphs: state.generatedParagraphs
  }));
}

export function loadFromLocalStorage() {
  try {
    const d = JSON.parse(localStorage.getItem('filler_state'));
    if (d) {
      return {
        flavor: d.flavor || 'classic-lorem',
        quantity: d.quantity || 3,
        unit: d.unit || 'paragraphs',
        generatedText: d.generatedText || '',
        generatedParagraphs: d.generatedParagraphs || []
      };
    }
  } catch { /* ignore */ }
  return null;
}
