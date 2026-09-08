/**
 * Small shared helpers
 */

export function $(id) {
  return document.getElementById(id);
}

export function esc(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

export function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}
