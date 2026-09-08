/** Main entry — draft controls and generated-document history are separate state domains. */
import { FLAVORS } from './flavors.js';
import { rand } from './utils.js';
import { createInitialState,createUndoManager,saveToLocalStorage,loadFromLocalStorage } from './state.js';
import { initControlsView } from './ui/controlsView.js';
import { initOutputView } from './ui/outputView.js';
import { initHistoryView } from './ui/historyView.js';

const state=createInitialState(), undoManager=createUndoManager(), outputView=initOutputView(state);
const setGeneratedIdentity=(f,q,u)=>{state.generatedFlavor=f;state.generatedQuantity=q;state.generatedUnit=u;};

const historyView=initHistoryView(state,{onRestore(item){
  undoManager.push(state);
  state.flavor=item.flavor;state.quantity=item.quantity;state.unit=item.unit;
  state.generatedText=item.text;state.generatedParagraphs=Array.isArray(item.paras)&&item.paras.length?[...item.paras]:item.text.split('\n\n');
  setGeneratedIdentity(item.flavor,item.quantity,item.unit);
  controlsView.setQuantity(item.quantity);controlsView.updateFlavorTabs();controlsView.updateUnitTabs();outputView.updateAccentColor();outputView.displayOutput(item.text,false);outputView.renderWordCloud(item.text);controlsView.updateUndoRedo(undoManager.canUndo,undoManager.canRedo);saveToLocalStorage(state);
}});

const controlsView=initControlsView(state,{
  onFlavorChange(){outputView.updateAccentColor();outputView.refreshGeneratedPresentation();saveToLocalStorage(state);},
  onUnitChange(){saveToLocalStorage(state);},
  onGenerate(qty,errorMsg){if(errorMsg){outputView.showError(errorMsg);return;}undoManager.push(state);state.quantity=qty;const text=genText(state.flavor,state.unit,qty);setGeneratedIdentity(state.flavor,qty,state.unit);outputView.displayOutput(text);outputView.renderWordCloud(text);saveToLocalStorage(state);historyView.save({flavor:state.flavor,quantity:qty,unit:state.unit,text,paras:[...state.generatedParagraphs],timestamp:Date.now()});controlsView.updateUndoRedo(undoManager.canUndo,undoManager.canRedo);},
  onUndo(){const s=undoManager.undo(state);if(s){restoreDocument(s);outputView.showToast('Undone');}},
  onRedo(){const s=undoManager.redo(state);if(s){restoreDocument(s);outputView.showToast('Redone');}}
});

function restoreDocument(snap){
  state.generatedText=snap.text;state.generatedParagraphs=[...snap.paras];state.generatedFlavor=snap.generatedFlavor;state.generatedQuantity=snap.generatedQuantity;state.generatedUnit=snap.generatedUnit;
  outputView.displayOutput(snap.text,false);outputView.renderWordCloud(snap.text);controlsView.updateUndoRedo(undoManager.canUndo,undoManager.canRedo);saveToLocalStorage(state);
}

function genSentence(pool,avg){const len=avg+Math.floor(Math.random()*8)-4,w=[];for(let i=0;i<Math.max(4,len);i++)w.push(rand(pool));w[0]=w[0].charAt(0).toUpperCase()+w[0].slice(1);if(Math.random()<.4)w[Math.floor(w.length/2)]+=',';else if(Math.random()<.2)w[Math.floor(w.length/3)]+=',';return w.join(' ')+'.';}
function genParagraph(pool){const n=4+Math.floor(Math.random()*4),s=[];for(let i=0;i<n;i++)s.push(genSentence(pool,10+Math.floor(Math.random()*6)));return s.join(' ');}
function genText(flavor,unit,qty){const pool=FLAVORS[flavor].words;if(unit==='paragraphs'){const p=[];for(let i=0;i<qty;i++)p.push(genParagraph(pool));state.generatedParagraphs=p;return p.join('\n\n');}if(unit==='sentences'){const s=[];for(let i=0;i<qty;i++)s.push(genSentence(pool,10+Math.floor(Math.random()*6)));state.generatedParagraphs=[s.join(' ')];return s.join(' ');}const words=[];for(let i=0;i<qty;i++){let w=rand(pool);if(i===0||words[words.length-1].endsWith('.'))w=w.charAt(0).toUpperCase()+w.slice(1);words.push(w);}const paras=[];let cur=[],sentLen=0;for(let i=0;i<words.length;i++){sentLen++;cur.push(words[i]);if(sentLen>=6+Math.floor(Math.random()*8)){cur[cur.length-1]+='.';sentLen=0;}if((sentLen===0&&cur.length>5&&Math.random()<.2)||i===words.length-1){paras.push(cur.join(' '));cur=[];}}if(cur.length)paras.push(cur.join(' '));state.generatedParagraphs=paras;return paras.join(' ');}

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){const err=document.querySelector('.error-state');if(err&&state.generatedText)outputView.displayOutput(state.generatedText,false);}
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'&&!e.shiftKey){e.preventDefault();const s=undoManager.undo(state);if(s){restoreDocument(s);outputView.showToast('Undone');}}
  if((e.ctrlKey||e.metaKey)&&(e.key.toLowerCase()==='y'||(e.key.toLowerCase()==='z'&&e.shiftKey))){e.preventDefault();const s=undoManager.redo(state);if(s){restoreDocument(s);outputView.showToast('Redone');}}
});

(function init(){const saved=loadFromLocalStorage();if(saved)Object.assign(state,saved);controlsView.setQuantity(state.quantity);controlsView.updateFlavorTabs();controlsView.updateUnitTabs();controlsView.updateUndoRedo(false,false);outputView.updateAccentColor();historyView.render();if(state.generatedText){outputView.displayOutput(state.generatedText,false);outputView.renderWordCloud(state.generatedText);}})();
