const { test, expect } = require('@playwright/test');
const APP_URL = process.env.APP_URL;

async function boot(page) {
  await page.goto(APP_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForFunction(() => window.__KR && window.__KR.G, null, { timeout: 15000 });
  await page.evaluate(() => {
    window.__queueTest = () => {
      const K = window.__KR, G = K.G;
      K.startGame(); G.tickets.length = 0; G.spawnTimer = 9999;
      const make = (name, comps, time = 60) => ({ id: ++G.ticketSeq, recipe: { name, comps: comps.slice(), tier: 0 }, timeTotal: time, timeLeft: time, warned: false, beeped: 999 });
      const serve = (comps) => { K.chef.carrying = { kind: 'plate', comps: comps.slice() }; K.setCarriedVisual(); K.chef.pos.set(K.serveSt.x, 0, K.serveSt.z); K.chef.actionCd = 0; K.chef.chopping = null; K.tryAction(); };
      return { K, G, make, serve };
    };
  });
}

test('[P2P] game boots with the kitchen runtime available', async ({ page }) => {
  await boot(page); expect(await page.evaluate(() => !!window.__KR && !!window.__KR.G)).toBe(true);
});

test('[P2P] a valid first hand-in is accepted normally', async ({ page }) => {
  await boot(page);
  const r = await page.evaluate(() => { const {G,make,serve}=__queueTest(); G.tickets.push(make('SALAD',['L','T'])); serve(['T','L']); return {served:G.served,lives:G.lives,left:G.tickets.length}; });
  expect(r).toEqual({served:1,lives:3,left:0});
});

test('[F2P] replacement ticket is serveable when queue length returns to its previous value', async ({ page }) => {
  await boot(page);
  const r=await page.evaluate(()=>{const{G,make,serve}=__queueTest();G.tickets.push(make('SALAD',['L','T']),make('BLT',['B','L','T']));serve(['L','T']);const fresh=make('BURGER',['B','P']);G.tickets.push(fresh);const b={s:G.served,l:G.lives};serve(['P','B']);return{b,s:G.served,l:G.lives,exists:G.tickets.includes(fresh)}});
  expect(r.s).toBe(r.b.s+1); expect(r.l).toBe(r.b.l); expect(r.exists).toBe(false);
});

test('[F2P] replacing a queued ticket in place cannot leave serving bound to the removed identity', async ({ page }) => {
  await boot(page);
  const r=await page.evaluate(()=>{const{G,make,serve}=__queueTest();const old=make('SALAD',['L','T']);G.tickets.push(old,make('BLT',['B','L','T']));serve(['B','L','T']);const fresh=make('BURGER',['B','P']);G.tickets.splice(0,1,fresh);const l=G.lives;serve(['B','P']);return{l,after:G.lives,served:G.served,exists:G.tickets.includes(fresh)}});
  expect(r.after).toBe(r.l); expect(r.served).toBe(2); expect(r.exists).toBe(false);
});

test('[F2P] a newly inserted front ticket is recognized with an unchanged active count', async ({ page }) => {
  await boot(page);
  const r=await page.evaluate(()=>{const{G,make,serve}=__queueTest();G.tickets.push(make('SALAD',['L','T']),make('BLT',['B','L','T']));serve(['L','T']);const fresh=make('BURGER',['B','P']);G.tickets.unshift(fresh);const l=G.lives;serve(['P','B']);return{l,after:G.lives,served:G.served,exists:G.tickets.includes(fresh)}});
  expect(r.after).toBe(r.l); expect(r.served).toBe(2); expect(r.exists).toBe(false);
});

test('[F2P] changing an existing ticket recipe is reflected by the next hand-in', async ({ page }) => {
  await boot(page);
  const r=await page.evaluate(()=>{const{G,make,serve}=__queueTest();const t=make('SALAD',['L','T']);G.tickets.push(t);serve(['B']);t.recipe={name:'BURGER',comps:['B','P'],tier:0};const l=G.lives;serve(['P','B']);return{l,after:G.lives,served:G.served,exists:G.tickets.includes(t)}});
  expect(r.after).toBe(r.l); expect(r.served).toBe(1); expect(r.exists).toBe(false);
});

test('[F2P] same-recipe customers remain independently serveable across a queue refill', async ({ page }) => {
  await boot(page);
  const r=await page.evaluate(()=>{const{G,make,serve}=__queueTest();G.tickets.push(make('A',['L','T']),make('B',['L','T']));serve(['L','T']);G.tickets.push(make('BURGER',['B','P']));const l=G.lives;serve(['T','L']);return{l,after:G.lives,served:G.served,salads:G.tickets.filter(t=>t.recipe.comps.slice().sort().join('')==='LT').length}});
  expect(r.after).toBe(r.l); expect(r.served).toBe(2); expect(r.salads).toBe(0);
});

test('[F2P] removed ticket state cannot mask a different replacement recipe', async ({ page }) => {
  await boot(page);
  const r=await page.evaluate(()=>{const{G,make,serve}=__queueTest();const old=make('SALAD',['L','T']);G.tickets.push(old,make('BLT',['B','L','T']));serve(['B']);G.tickets.shift();const fresh=make('BURGER',['B','P']);G.tickets.push(fresh);const l=G.lives;serve(['B','P']);return{l,after:G.lives,fresh:G.tickets.includes(fresh),old:G.tickets.includes(old)}});
  expect(r.after).toBe(r.l); expect(r.fresh).toBe(false); expect(r.old).toBe(false);
});

test('[F2P] several same-size queue rotations keep newly arriving recipes serveable', async ({ page }) => {
  await boot(page);
  const r=await page.evaluate(()=>{const{G,make,serve}=__queueTest();G.tickets.push(make('SALAD',['L','T']),make('BLT',['B','L','T']));serve(['L','T']);let ok=true;for(const comps of [['B','P'],['P','C','L'],['B','P','C','T']]){const f=make('NEW',comps);G.tickets.push(f);const l=G.lives,s=G.served;serve(comps.slice().reverse());if(G.lives!==l||G.served!==s+1||G.tickets.includes(f))ok=false;}return{ok,lives:G.lives,served:G.served}});
  expect(r.ok).toBe(true); expect(r.lives).toBe(3); expect(r.served).toBe(4);
});

test('[F2P] a valid post-mutation hand-in does not increment mistakes', async ({ page }) => {
  await boot(page);
  const r=await page.evaluate(()=>{const{G,make,serve}=__queueTest();G.tickets.push(make('SALAD',['L','T']),make('BLT',['B','L','T']));serve(['L','T']);G.tickets.push(make('BURGER',['B','P']));const b={l:G.lives,m:G.mistakes};serve(['B','P']);return{b,l:G.lives,m:G.mistakes}});
  expect(r.l).toBe(r.b.l); expect(r.m).toBe(r.b.m);
});

test('[F2P] successful post-mutation hand-in clears the plate and advances score', async ({ page }) => {
  await boot(page);
  const r=await page.evaluate(()=>{const{K,G,make,serve}=__queueTest();G.tickets.push(make('SALAD',['L','T']),make('BLT',['B','L','T']));serve(['L','T']);G.tickets.push(make('BURGER',['B','P']));const score=G.score;serve(['B','P']);return{score,after:G.score,carrying:K.chef.carrying,served:G.served}});
  expect(r.after).toBeGreaterThan(r.score); expect(r.carrying).toBeNull(); expect(r.served).toBe(2);
});