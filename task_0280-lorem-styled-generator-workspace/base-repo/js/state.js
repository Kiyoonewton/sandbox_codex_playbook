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
        undoStack.push({
          flavor: state.flavor,
          quantity: state.quantity,
          unit: state.unit,
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
        flavor: currentState.flavor,
        quantity: currentState.quantity,
        unit: currentState.unit,
        text: currentState.generatedText,
        paras: [...currentState.generatedParagraphs]
      });
      return undoStack.pop();
    },

    redo(currentState) {
      if (!redoStack.length) return null;
      undoStack.push({
        flavor: currentState.flavor,
        quantity: currentState.quantity,
        unit: currentState.unit,
        text: currentState.generatedText,
        paras: [...currentState.generatedParagraphs]
      });
      return redoStack.pop();
    }
  };
}

export function saveToLocalStorage(state) {
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
