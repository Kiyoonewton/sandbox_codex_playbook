// ---------------- ingredient icon SVGs (tickets / chips) ----------------
const ICONS={
  tomato:`<svg viewBox="0 0 28 28"><circle cx="14" cy="15" r="9" fill="#E8354A" stroke="#B92338" stroke-width="2"/><circle cx="11" cy="12" r="2.2" fill="#FF8B97"/><path d="M14 6 l2 3 h-4 z M14 6 q4 -3 6 -1" stroke="#239152" stroke-width="2" fill="#38B96A"/></svg>`,
  lettuce:`<svg viewBox="0 0 28 28"><circle cx="14" cy="14" r="9" fill="#38B96A" stroke="#239152" stroke-width="2"/><path d="M8 14 q3 -4 6 0 q3 -4 6 0 M9 18 q5 -3 10 0" stroke="#9FE3BC" stroke-width="1.6" fill="none"/></svg>`,
  patty:`<svg viewBox="0 0 28 28"><ellipse cx="14" cy="14" rx="10" ry="7" fill="#9A5B32" stroke="#6E3B1B" stroke-width="2"/><circle cx="10" cy="12" r="1.3" fill="#6E3B1B"/><circle cx="17" cy="15" r="1.3" fill="#6E3B1B"/><circle cx="13" cy="16" r="1" fill="#6E3B1B"/></svg>`,
  patty_cooked:`<svg viewBox="0 0 28 28"><ellipse cx="14" cy="14" rx="10" ry="7" fill="#5E3317" stroke="#3E2110" stroke-width="2"/><path d="M7 12 l4 2 M13 11 l4 2 M11 16 l4 2" stroke="#2C150A" stroke-width="1.6"/></svg>`,
  bun:`<svg viewBox="0 0 28 28"><path d="M4 15 a10 8 0 0 1 20 0 z" fill="#F2A93B" stroke="#C77E1B" stroke-width="2"/><rect x="4" y="15" width="20" height="4" rx="2" fill="#E8930F" stroke="#C77E1B" stroke-width="1.5"/><circle cx="10" cy="10" r="1" fill="#FFF3CF"/><circle cx="15" cy="8" r="1" fill="#FFF3CF"/><circle cx="19" cy="11" r="1" fill="#FFF3CF"/></svg>`,
  cheese:`<svg viewBox="0 0 28 28"><path d="M5 18 L14 6 L23 18 Z" fill="#FFC93A" stroke="#E8A90C" stroke-width="2"/><circle cx="13" cy="14" r="1.6" fill="#E8A90C"/><circle cx="17" cy="16" r="1.2" fill="#E8A90C"/></svg>`,
  plate:`<svg viewBox="0 0 28 28"><circle cx="14" cy="14" r="11" fill="#FFFDF4" stroke="#8FA6E8" stroke-width="2.5"/><circle cx="14" cy="14" r="6.5" fill="none" stroke="#DCE4FA" stroke-width="2"/></svg>`
};
const NICE={tomato:'Tomato',lettuce:'Lettuce',patty:'Patty',patty_cooked:'Cooked Patty',bun:'Bun',cheese:'Cheese'};

// ---------------- recipes ----------------
// process: component requirements. T=tomato L=lettuce P=patty B=bun C=cheese
// chopped needed: T,L ; cooked: P ; bun & cheese used as-is (cheese needs chop? keep cheese chop for variety -> cheese block chopped)
const RECIPES=[
  {name:'Salad',     comps:['L','T'],           tier:0},
  {name:'B.L.T.',    comps:['B','L','T'],       tier:0},
  {name:'Burger',    comps:['B','P'],           tier:1},
  {name:'Cheeseburger',comps:['B','P','C'],     tier:2},
  {name:'Tower Burger',comps:['B','P','C','T'], tier:3},
  {name:'Garden Melt', comps:['P','C','L'],     tier:2},
  {name:'The Works', comps:['B','P','C','L','T'],tier:4},
];
const COMP_INFO={ // how each comp is prepared
  T:{base:'tomato', need:'chop', label:'Tomato'},
  L:{base:'lettuce',need:'chop', label:'Lettuce'},
  P:{base:'patty',  need:'cook', label:'Patty'},
  B:{base:'bun',    need:null,   label:'Bun'},
  C:{base:'cheese', need:'chop', label:'Cheese'},
};
function recipeIconHTML(recipe){
  return recipe.comps.map(c=>{
    const b=COMP_INFO[c].base;
    const key=(c==='P')?'patty_cooked':b;
    return ICONS[key];
  }).join('<span class="t-plus">+</span>');
}
