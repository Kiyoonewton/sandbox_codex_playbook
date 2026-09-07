const { test, expect } = require('@playwright/test');
const APP_URL = process.env.APP_URL;
const PREAMBLE = "(() => {\n  // --- deterministic Math.random (mulberry32, fixed seed) ---\n  let _s = (1337) >>> 0;\n  Math.random = function () {\n    _s |= 0; _s = (_s + 0x6D2B79F5) | 0;\n    let t = Math.imul(_s ^ (_s >>> 15), 1 | _s);\n    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;\n    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;\n  };\n  // --- settle animations/transitions so a captured frame is stable & identical across builds ---\n  const css = '*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;'\n            + 'transition-duration:0s!important;transition-delay:0s!important;'\n            + 'caret-color:transparent!important;scroll-behavior:auto!important}';\n  const inject = () => {\n    const root = document.head || document.documentElement;\n    if (!root) return;\n    const st = document.createElement('style');\n    st.setAttribute('data-sand-determinism', '1');\n    st.textContent = css;\n    root.appendChild(st);\n  };\n  if (document.readyState === 'loading') {\n    document.addEventListener('DOMContentLoaded', inject);\n  } else {\n    inject();\n  }\n})();";
const READY_HOOKS = ["__FlatBoxGeo", "__KR"];
async function boot(page) {
  await page.addInitScript(PREAMBLE);
  await page.goto(APP_URL, { waitUntil: 'networkidle', timeout: 30000 });
  try { await page.waitForFunction((hs) => document.readyState === 'complete' && hs.every(h => typeof window[h] !== 'undefined'), READY_HOOKS, { timeout: 15000 }); } catch (e) {}
  await page.waitForTimeout(800);
}
test('[P2P] game boots and renders content', async ({ page }) => {
  await boot(page);
  const has = await page.evaluate(() => !!document.body && document.body.children.length > 0);
  expect(has).toBe(true);
});
test('[P2P] core game state is present', async ({ page }) => {
  await boot(page);
  const ok = await page.evaluate(() => typeof window.__FlatBoxGeo !== 'undefined');
  expect(ok).toBe(true);
});
test('[P2P] no layout overflow (UI fits the viewport)', async ({ page }) => {
  await boot(page);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
});
test('[F2P] The first order of the shift is accepted, but later hand-ins of exactly the dish an order asks for are slapped down as a', async ({ page }) => {
  await boot(page);
  const v = await page.evaluate(async () => { const K=window.__KR,G=K.G;K.startGame();const sets=[['L','T'],['B','P'],['B','P','C'],['B','P','C','T'],['B','P','C','T','L'],['P','C','L']];const n=2+(crypto.getRandomValues(new Uint32Array(1))[0]%4);let ok=true;for(let i=0;i<n;i++){const prev=G.tickets.slice();K.spawnTicket();const t=G.tickets.find(x=>prev.indexOf(x)<0);t.recipe={name:'W'+i,comps:sets[i%sets.length].slice(),tier:0};const before=G.score;K.chef.carrying={kind:'plate',comps:t.recipe.comps.slice()};K.setCarriedVisual();K.chef.pos.set(K.serveSt.x,0,K.serveSt.z);K.chef.actionCd=0;K.chef.chopping=null;K.tryAction();if(G.served!==i+1||G.score<=before||K.chef.carrying!==null)ok=false;}return ok&&G.lives===3&&G.tickets.length===0; });
  expect(v).toEqual(true);
});
test('[F2P] After parking a dish on the plate counter and taking it back a few times, the counter looks completely empty and still g', async ({ page }) => {
  await boot(page);
  const v = await page.evaluate(async () => { const K=window.__KR;K.startGame();const n=1+(crypto.getRandomValues(new Uint32Array(1))[0]%3);K.chef.pos.set(K.plateSt.x,0,K.plateSt.z);const act=()=>{K.chef.actionCd=0;K.chef.chopping=null;K.tryAction();};for(let i=0;i<n;i++){for(let k=0;k<2;k++){K.chef.carrying={kind:'plate',comps:['B','P']};K.setCarriedVisual();act();K.chef.carrying={kind:'plate',comps:[]};K.setCarriedVisual();act();}}const empty=K.plateSt.plates.every(p=>p===null);K.chef.carrying={kind:'plate',comps:['B','C']};K.setCarriedVisual();act();return empty&&K.chef.carrying===null&&K.plateSt.plates.filter(p=>p&&p.comps.length===2).length===1; });
  expect(v).toEqual(true);
});
test('[F2P] Once a few plates have been parked and taken back, a prepared ingredient can no longer be dropped on the visibly empty p', async ({ page }) => {
  await boot(page);
  const v = await page.evaluate(async () => { const K=window.__KR;K.startGame();const n=1+(crypto.getRandomValues(new Uint32Array(1))[0]%3);K.chef.pos.set(K.plateSt.x,0,K.plateSt.z);const act=()=>{K.chef.actionCd=0;K.chef.chopping=null;K.tryAction();};for(let i=0;i<n;i++){for(let k=0;k<2;k++){K.chef.carrying={kind:'plate',comps:['B','P']};K.setCarriedVisual();act();K.chef.carrying={kind:'plate',comps:[]};K.setCarriedVisual();act();}}K.chef.carrying={kind:'ing',type:'bun',state:'raw'};K.setCarriedVisual();act();return K.chef.carrying===null&&K.plateSt.plates.some(p=>p&&p.comps.join('')==='B'); });
  expect(v).toEqual(true);
});
test('[F2P] With several orders up on the rail, the little badge showing what the chef is carrying jumps sideways and runs off the e', async ({ page }) => {
  await boot(page);
  const v = await page.evaluate(async () => { const K=window.__KR;K.startGame();K.spawnTicket();K.spawnTicket();K.spawnTicket();K.chef.carrying={kind:'plate',comps:['B','P']};K.setCarriedVisual();const chip=document.getElementById('heldChip');const b=chip.getBoundingClientRect();return b.width>1&&b.left>=-1&&b.right<=window.innerWidth+1; });
  expect(v).toEqual(true);
});
