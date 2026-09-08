// ============================================================
// Shared Utilities
// ============================================================

export function $(sel) { return document.querySelector(sel); }
export function $$(sel) { return document.querySelectorAll(sel); }

// Plant category metadata
export const CATEGORY_COLORS = {
  'Beginner': '#6B9F6B',
  'Tropical': '#1A8B6A',
  'Desert': '#C8875F',
  'Rare Collector': '#C4A0D4',
  'Pet-Friendly': '#5FA0C8'
};

export const CATEGORY_GRADIENTS = {
  'Beginner': 'linear-gradient(135deg, rgba(107, 159, 107, 0.15), rgba(26, 139, 106, 0.08))',
  'Tropical': 'linear-gradient(135deg, rgba(26, 139, 106, 0.15), rgba(11, 40, 20, 0.2))',
  'Desert': 'linear-gradient(135deg, rgba(200, 135, 95, 0.15), rgba(180, 120, 60, 0.08))',
  'Rare Collector': 'linear-gradient(135deg, rgba(196, 160, 212, 0.15), rgba(200, 135, 95, 0.08))',
  'Pet-Friendly': 'linear-gradient(135deg, rgba(95, 160, 200, 0.15), rgba(26, 139, 106, 0.08))'
};

// Plant mini SVG icons (replaces PLANT_EMOJIS)
// Each returns a small inline SVG string for use in cards, quiz results, etc.
function _svgLeaf(color1, color2, shape) {
  return `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="${shape}" fill="${color1}" opacity="0.9"/><path d="M12 20V14" stroke="${color2}" stroke-width="1" stroke-linecap="round"/></svg>`;
}

function _svgSucculent(c1, c2) {
  return `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="12" cy="12" rx="8" ry="9" fill="${c1}" opacity="0.85"/><ellipse cx="12" cy="10" rx="5" ry="6" fill="${c2}" opacity="0.5"/><path d="M12 21V16" stroke="${c1}" stroke-width="1.2" stroke-linecap="round"/></svg>`;
}

function _svgFlower(c1, c2) {
  return `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="10" r="3" fill="${c2}"/><ellipse cx="12" cy="5" rx="2" ry="3" fill="${c1}" opacity="0.8"/><ellipse cx="7" cy="9" rx="3" ry="2" fill="${c1}" opacity="0.7" transform="rotate(-30 7 9)"/><ellipse cx="17" cy="9" rx="3" ry="2" fill="${c1}" opacity="0.7" transform="rotate(30 17 9)"/><path d="M12 13V21" stroke="${c1}" stroke-width="1" stroke-linecap="round"/><path d="M9 17H15" stroke="${c1}" stroke-width="0.8" opacity="0.5"/></svg>`;
}

function _svgTropical(c1, c2) {
  return `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3C8 3 5 8 5 13C5 18 8 21 12 21C16 21 19 18 19 13C19 8 16 3 12 3Z" fill="${c1}" opacity="0.85"/><path d="M12 3C12 3 9 9 12 15" stroke="${c2}" stroke-width="0.8" opacity="0.4"/></svg>`;
}

function _svgCactus() {
  return `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4C10 4 9 6 9 9V20C9 21 10 21 11 21H13C14 21 15 21 15 20V9C15 6 14 4 12 4Z" fill="#4a9e5c" opacity="0.85"/><path d="M9 10C9 10 6 8 5 9C4 10 4 12 5 13C6 13 9 12 9 12" fill="#4a9e5c" opacity="0.75"/><path d="M15 8C15 8 18 6 19 7C20 8 20 10 19 11C18 11 15 10 15 10" fill="#4a9e5c" opacity="0.7"/><path d="M12 6V18" stroke="#3a7e4c" stroke-width="0.5" opacity="0.3"/></svg>`;
}

export const PLANT_ICONS = {
  'pothos': _svgLeaf('#3d9b5c', '#1a5530', 'M12 3C8 3 5 8 5 13C5 18 8 21 12 21C16 21 19 18 19 13C19 8 16 3 12 3Z'),
  'snake-plant': _svgTropical('#2d6b3f', '#c4a84a'),
  'zz-plant': _svgLeaf('#3a8b50', '#1a5530', 'M12 2C9 2 7 7 7 12C7 17 10 22 12 22C14 22 17 17 17 12C17 7 15 2 12 2Z'),
  'spider-plant': _svgLeaf('#5cb85c', '#2d7a44', 'M12 4C7 4 4 9 4 13C4 17 8 20 12 20C16 20 20 17 20 13C20 9 17 4 12 4Z'),
  'heartleaf-philodendron': _svgLeaf('#3d8b5c', '#1a4a2e', 'M12 4C8 4 5 8 5 12C5 17 9 21 12 21C15 21 19 17 19 12C19 8 16 4 12 4Z'),
  'monstera': _svgLeaf('#2d8b5a', '#1a5530', 'M12 3C7 3 4 8 4 13C4 18 7 22 12 22C17 22 20 18 20 13C20 8 17 3 12 3Z'),
  'bird-of-paradise': _svgTropical('#1a8b6a', '#3dc4a0'),
  'alocasia': _svgLeaf('#2d7a5a', '#1a4a2e', 'M12 2C7 2 4 7 4 12C4 18 8 22 12 22C16 22 20 18 20 12C20 7 17 2 12 2Z'),
  'anthurium': _svgFlower('#d94452', '#f0c040'),
  'cactus': _svgCactus(),
  'aloe-vera': _svgSucculent('#4a9e5c', '#6bc47a'),
  'echeveria': _svgSucculent('#7aae6c', '#a8d89c'),
  'jade-plant': _svgLeaf('#3d9b5c', '#1a5530', 'M12 3C8 3 5 7 5 12C5 17 9 21 12 21C15 21 19 17 19 12C19 7 16 3 12 3Z'),
  'variegated-monstera': _svgLeaf('#3d9b5c', '#e8e0d0', 'M12 3C7 3 4 8 4 13C4 18 7 22 12 22C17 22 20 18 20 13C20 8 17 3 12 3Z'),
  'pink-princess': _svgFlower('#d97ab8', '#e8b0d8'),
  'thai-constellation': _svgLeaf('#3d9b5c', '#f0e8a0', 'M12 3C7 3 4 8 4 13C4 18 7 22 12 22C17 22 20 18 20 13C20 8 17 3 12 3Z'),
  'calathea': _svgLeaf('#4a8b6c', '#8b4a6c', 'M12 2C8 2 5 7 5 12C5 17 8 22 12 22C16 22 19 17 19 12C19 7 16 2 12 2Z'),
  'prayer-plant': _svgLeaf('#5a9b6c', '#3a6b4c', 'M12 3C9 3 6 8 6 12C6 17 9 21 12 21C15 21 18 17 18 12C18 8 15 3 12 3Z'),
  'parlor-palm': _svgTropical('#3a9b5c', '#5ac47a'),
  'peperomia': _svgLeaf('#5a9b6c', '#2d6b3f', 'M12 3C8 3 5 7 5 12C5 17 9 21 12 21C15 21 19 17 19 12C19 7 16 3 12 3Z'),
  '_fallback': _svgLeaf('#5a9b6c', '#2d7a44', 'M12 3C8 3 5 8 5 13C5 18 8 21 12 21C16 21 19 18 19 13C19 8 16 3 12 3Z')
};

// Get SVG icon for a plant (by id)
export function getPlantIcon(plantId, size) {
  const icon = PLANT_ICONS[plantId] || PLANT_ICONS['_fallback'];
  if (size) {
    return icon.replace('width="1em" height="1em"', `width="${size}" height="${size}"`);
  }
  return icon;
}

// SVG icons for symptoms (replaces SYMPTOM_ICONS)
export const SYMPTOM_ICONS = {
  'Yellow Leaves': `<svg viewBox="0 0 16 16" width="16" height="16" fill="none"><circle cx="8" cy="8" r="7" fill="#e8c84a" opacity="0.85"/><path d="M8 4V10M8 12V13" stroke="#a08820" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  'Brown Tips': `<svg viewBox="0 0 16 16" width="16" height="16" fill="none"><path d="M4 14L8 2L12 14" fill="#8b6830" opacity="0.3"/><path d="M6 9H10" stroke="#8b6830" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  'Brown Spots': `<svg viewBox="0 0 16 16" width="16" height="16" fill="none"><circle cx="8" cy="8" r="6" fill="#6b4e2a" opacity="0.7"/><circle cx="8" cy="8" r="3" fill="#8b6830" opacity="0.9"/></svg>`,
  'Drooping': `<svg viewBox="0 0 16 16" width="16" height="16" fill="none"><path d="M8 3C8 3 5 6 5 9C5 11 6 12 8 12C10 12 11 11 11 9C11 6 8 3 8 3Z" fill="#5a9b6c" opacity="0.7"/><path d="M8 6V11" stroke="#3a6b4c" stroke-width="0.8"/><path d="M6 14H10" stroke="#3a6b4c" stroke-width="1.2" stroke-linecap="round"/></svg>`,
  'Root Rot': `<svg viewBox="0 0 16 16" width="16" height="16" fill="none"><circle cx="8" cy="8" r="7" fill="#5a3a2a" opacity="0.6"/><path d="M6 6L10 10M10 6L6 10" stroke="#8b4a3a" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  'Pests': `<svg viewBox="0 0 16 16" width="16" height="16" fill="none"><circle cx="8" cy="7" r="4" fill="#6b8b3a" opacity="0.7"/><circle cx="8" cy="7" r="2" fill="#4a6b2a" opacity="0.9"/><path d="M5 5L3 3M11 5L13 3M5 9L3 11M11 9L13 11" stroke="#4a6b2a" stroke-width="1" stroke-linecap="round"/></svg>`,
  'Slow Growth': `<svg viewBox="0 0 16 16" width="16" height="16" fill="none"><path d="M5 14V10" stroke="#6b8b3a" stroke-width="1.2" stroke-linecap="round"/><path d="M5 10C5 8 6 6 8 5" stroke="#8ba85a" stroke-width="1" stroke-linecap="round" stroke-dasharray="2 1.5"/><circle cx="5" cy="14" r="1.5" fill="#6b8b3a" opacity="0.6"/></svg>`,
  'Leaf Drop': `<svg viewBox="0 0 16 16" width="16" height="16" fill="none"><path d="M4 3C4 3 3 7 5 10C7 13 10 13 12 10C14 7 13 3 13 3" fill="#b8943a" opacity="0.5"/><path d="M8 8V14" stroke="#a08420" stroke-width="1" stroke-linecap="round"/><path d="M8 14L6 13M8 14L10 13" stroke="#a08420" stroke-width="0.8" stroke-linecap="round"/></svg>`,
  'Crispy Edges': `<svg viewBox="0 0 16 16" width="16" height="16" fill="none"><rect x="3" y="3" width="10" height="10" rx="2" fill="#c8875f" opacity="0.3"/><path d="M4 4L6 6M12 4L10 6M4 12L6 10M12 12L10 10" stroke="#c8875f" stroke-width="1.2" stroke-linecap="round"/></svg>`,
  'Fading Color': `<svg viewBox="0 0 16 16" width="16" height="16" fill="none"><circle cx="8" cy="8" r="6" fill="#8baa7c" opacity="0.4"/><circle cx="8" cy="8" r="3" fill="#8baa7c" opacity="0.7"/></svg>`
};

// SVG icons for light levels
export const LIGHT_ICONS = {
  'low': `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none"><circle cx="12" cy="12" r="10" fill="#2a3a4a" opacity="0.7"/><circle cx="12" cy="12" r="6" fill="#4a5a6a" opacity="0.5"/></svg>`,
  'medium': `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none"><circle cx="12" cy="12" r="10" fill="#5a7a9a" opacity="0.4"/><circle cx="9" cy="10" r="6" fill="#e8c84a" opacity="0.7"/><path d="M14 8C16 10 16 14 14 16" stroke="#b0c8d8" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  'bright': `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none"><circle cx="12" cy="12" r="5" fill="#f0d040" opacity="0.9"/><g stroke="#f0d040" stroke-width="1.2" stroke-linecap="round"><path d="M12 2V5M12 19V22M2 12H5M19 12H22M5.6 5.6L7.8 7.8M16.2 16.2L18.4 18.4M18.4 5.6L16.2 7.8M7.8 16.2L5.6 18.4"/></g></svg>`,
  'direct': `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none"><circle cx="12" cy="12" r="5" fill="#f08030" opacity="0.9"/><g stroke="#f08030" stroke-width="1.5" stroke-linecap="round"><path d="M12 1V4M12 20V23M1 12H4M20 12H23M4.9 4.9L7.1 7.1M16.9 16.9L19.1 19.1M19.1 4.9L16.9 7.1M7.1 16.9L4.9 19.1"/><path d="M12 8L14 14H10L12 8Z" fill="#f0a040" opacity="0.6"/></g></svg>`
};

// Water droplet icon
export const WATER_DROP_ICON = `<svg viewBox="0 0 24 24" width="1.2em" height="1.2em" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5C12 2.5 6 9.5 6 14a6 6 0 1 0 12 0c0-4.5-6-11.5-6-11.5Z"/><path d="M10 15.5a3 3 0 0 0 4 0" opacity="0.5"/></svg>`;

// Pet safety icons
export const PET_SAFE_ICON = `<svg viewBox="0 0 16 16" width="1em" height="1em" fill="none"><circle cx="5" cy="5" r="2.5" fill="currentColor" opacity="0.7"/><circle cx="11" cy="5" r="2.5" fill="currentColor" opacity="0.7"/><circle cx="3" cy="10" r="2" fill="currentColor" opacity="0.6"/><circle cx="13" cy="10" r="2" fill="currentColor" opacity="0.6"/><ellipse cx="8" cy="11" rx="3.5" ry="3" fill="currentColor" opacity="0.8"/></svg>`;

export const PET_UNSAFE_ICON = `<svg viewBox="0 0 16 16" width="1em" height="1em" fill="none"><path d="M8 2L2 14H14L8 2Z" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M8 7V10" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><circle cx="8" cy="12" r="0.8" fill="currentColor"/></svg>`;
