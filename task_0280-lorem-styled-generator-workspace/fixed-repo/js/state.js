/** State, persistence, and undo/redo management */
const MAX_UNDO = 20;

export function createInitialState() {
  return { flavor:'classic-lorem', quantity:3, unit:'paragraphs', generatedText:'', generatedParagraphs:[], generatedFlavor:null, generatedQuantity:null, generatedUnit:null };
}

export function documentSnapshot(state) {
  return {
    text: state.generatedText,
    paras: [...state.generatedParagraphs],
    generatedFlavor: state.generatedFlavor,
    generatedQuantity: state.generatedQuantity,
    generatedUnit: state.generatedUnit
  };
}

export function createUndoManager() {
  const undoStack=[], redoStack=[];
  return {
    get canUndo(){return undoStack.length>0;}, get canRedo(){return redoStack.length>0;},
    push(state){if(!state.generatedText)return;undoStack.push(documentSnapshot(state));if(undoStack.length>MAX_UNDO)undoStack.shift();redoStack.length=0;},
    undo(state){if(!undoStack.length)return null;redoStack.push(documentSnapshot(state));return undoStack.pop();},
    redo(state){if(!redoStack.length)return null;undoStack.push(documentSnapshot(state));return redoStack.pop();}
  };
}

export function saveToLocalStorage(state) {
  localStorage.setItem('filler_state',JSON.stringify({
    flavor:state.flavor, quantity:state.quantity, unit:state.unit,
    generatedText:state.generatedText, generatedParagraphs:state.generatedParagraphs,
    generatedFlavor:state.generatedFlavor, generatedQuantity:state.generatedQuantity, generatedUnit:state.generatedUnit
  }));
}

export function loadFromLocalStorage(){
  try{
    const d=JSON.parse(localStorage.getItem('filler_state'));
    if(d){const text=d.generatedText||'';return {
      flavor:d.flavor||'classic-lorem', quantity:d.quantity??3, unit:d.unit||'paragraphs',
      generatedText:text, generatedParagraphs:Array.isArray(d.generatedParagraphs)?d.generatedParagraphs:[],
      generatedFlavor:text?(d.generatedFlavor||d.flavor||'classic-lorem'):null,
      generatedQuantity:text?(d.generatedQuantity??d.quantity??3):null,
      generatedUnit:text?(d.generatedUnit||d.unit||'paragraphs'):null
    };}
  }catch{}
  return null;
}
