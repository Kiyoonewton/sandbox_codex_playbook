const { test, expect } = require('@playwright/test');
const APP_URL = process.env.APP_URL;

async function boot(page) {
  await page.goto(APP_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForFunction(() => window.__KR && window.__KR.G, null, { timeout: 15000 });
}

async function scenario(page, body) {
  return page.evaluate(body);
}

const commonSetup = () => {
  const K = window.__KR;
  const G = K.G;
  K.startGame();
  G.tickets.length = 0;
  G.spawnTimer = 9999;

  const make = (name, comps, time = 60) => ({
    id: ++G.ticketSeq,
    recipe: { name, comps: comps.slice(), tier: 0 },
    timeTotal: time,
    timeLeft: time,
    warned: false,
    beeped: 999,
  });

  const serve = (comps) => {
    K.chef.carrying = { kind: 'plate', comps: comps.slice() };
    K.setCarriedVisual();
    K.chef.pos.set(K.serveSt.x, 0, K.serveSt.z);
    K.chef.actionCd = 0;
    K.chef.chopping = null;
    K.tryAction();
  };

  return { K, G, make, serve };
};

test('[P2P] game boots with the kitchen runtime available', async ({ page }) => {
  await boot(page);
  expect(await page.evaluate(() => !!window.__KR && !!window.__KR.G)).toBe(true);
});

test('[P2P] a valid first hand-in is still accepted normally', async ({ page }) => {
  await boot(page);
  const result = await scenario(page, () => {
    const { G, make, serve } = commonSetup();
    G.tickets.push(make('SALAD', ['L', 'T']));
    serve(['T', 'L']);
    return { served: G.served, lives: G.lives, left: G.tickets.length };
  });
  expect(result).toEqual({ served: 1, lives: 3, left: 0 });
});

test('[F2P] replacement ticket is serveable when queue length returns to its previous value', async ({ page }) => {
  await boot(page);
  const result = await scenario(page, () => {
    const { G, make, serve } = commonSetup();
    G.tickets.push(make('SALAD', ['L', 'T']), make('BLT', ['B', 'L', 'T']));
    serve(['L', 'T']);
    const burger = make('BURGER', ['B', 'P']);
    G.tickets.push(burger);
    const before = { served: G.served, lives: G.lives };
    serve(['P', 'B']);
    return { before, served: G.served, lives: G.lives, remains: G.tickets.some(t => t.id === burger.id) };
  });
  expect(result.served).toBe(result.before.served + 1);
  expect(result.lives).toBe(result.before.lives);
  expect(result.remains).toBe(false);
});

test('[F2P] replacing a queued ticket in place does not leave serving bound to the removed ticket', async ({ page }) => {
  await boot(page);
  const result = await scenario(page, () => {
    const { G, make, serve } = commonSetup();
    const old = make('SALAD', ['L', 'T']);
    const other = make('BLT', ['B', 'L', 'T']);
    G.tickets.push(old, other);
    serve(['B', 'L', 'T']); // prime serving state, queue now has one
    const burger = make('BURGER', ['B', 'P']);
    G.tickets.splice(0, 1, burger); // same queue length, different identity
    const lives = G.lives;
    serve(['B', 'P']);
    return { lives, now: G.lives, served: G.served, ids: G.tickets.map(t => t.id), burger: burger.id };
  });
  expect(result.now).toBe(result.lives);
  expect(result.served).toBe(2);
  expect(result.ids).not.toContain(result.burger);
});

test('[F2P] a ticket inserted at the front is recognized even when the active count is unchanged', async ({ page }) => {
  await boot(page);
  const result = await scenario(page, () => {
    const { G, make, serve } = commonSetup();
    const a = make('SALAD', ['L', 'T']);
    const b = make('BLT', ['B', 'L', 'T']);
    G.tickets.push(a, b);
    serve(['L', 'T']);
    const fresh = make('BURGER', ['B', 'P']);
    G.tickets.unshift(fresh);
    const lives = G.lives;
    serve(['P', 'B']);
    return { lives, afterLives: G.lives, served: G.served, freshExists: G.tickets.includes(fresh) };
  });
  expect(result.afterLives).toBe(result.lives);
  expect(result.served).toBe(2);
  expect(result.freshExists).toBe(false);
});

test('[F2P] changing the recipe of an existing ticket is reflected by the next hand-in', async ({ page }) => {
  await boot(page);
  const result = await scenario(page, () => {
    const { G, make, serve } = commonSetup();
    const ticket = make('SALAD', ['L', 'T']);
    G.tickets.push(ticket);
    // Prime the lookup with a wrong dish without ending the run.
    serve(['B']);
    ticket.recipe = { name: 'BURGER', comps: ['B', 'P'], tier: 0 };
    const lives = G.lives;
    serve(['P', 'B']);
    return { lives, afterLives: G.lives, served: G.served, exists: G.tickets.includes(ticket) };
  });
  expect(result.afterLives).toBe(result.lives);
  expect(result.served).toBe(1);
  expect(result.exists).toBe(false);
});

test('[F2P] two same-recipe customers remain independently serveable across a queue refill', async ({ page }) => {
  await boot(page);
  const result = await scenario(page, () => {
    const { G, make, serve } = commonSetup();
    const first = make('SALAD A', ['L', 'T']);
    const second = make('SALAD B', ['L', 'T']);
    G.tickets.push(first, second);
    serve(['L', 'T']);
    G.tickets.push(make('BURGER', ['B', 'P'])); // restore prior count
    const lives = G.lives;
    serve(['T', 'L']);
    return { lives, afterLives: G.lives, served: G.served, salads: G.tickets.filter(t => t.recipe.comps.slice().sort().join('') === 'LT').length };
  });
  expect(result.afterLives).toBe(result.lives);
  expect(result.served).toBe(2);
  expect(result.salads).toBe(0);
});

test('[F2P] removing a waiting ticket and appending a different one cannot make the removed order serveable', async ({ page }) => {
  await boot(page);
  const result = await scenario(page, () => {
    const { G, make, serve } = commonSetup();
    const salad = make('SALAD', ['L', 'T']);
    const blt = make('BLT', ['B', 'L', 'T']);
    G.tickets.push(salad, blt);
    serve(['X']); // prime without changing queue length
    G.tickets.shift();
    const burger = make('BURGER', ['B', 'P']);
    G.tickets.push(burger);
    const lives = G.lives;
    serve(['B', 'P']);
    return { lives, afterLives: G.lives, burgerExists: G.tickets.includes(burger), saladExists: G.tickets.includes(salad) };
  });
  expect(result.afterLives).toBe(result.lives);
  expect(result.burgerExists).toBe(false);
  expect(result.saladExists).toBe(false);
});

test('[F2P] several same-size queue rotations keep every newly arriving recipe serveable', async ({ page }) => {
  await boot(page);
  const result = await scenario(page, () => {
    const { G, make, serve } = commonSetup();
    G.tickets.push(make('SALAD', ['L', 'T']), make('BLT', ['B', 'L', 'T']));
    serve(['L', 'T']);
    const recipes = [['B', 'P'], ['P', 'C', 'L'], ['B', 'P', 'C', 'T']];
    let ok = true;
    for (const comps of recipes) {
      const fresh = make('NEW', comps);
      G.tickets.push(fresh);
      const beforeLives = G.lives;
      const beforeServed = G.served;
      serve(comps.slice().reverse());
      if (G.lives !== beforeLives || G.served !== beforeServed + 1 || G.tickets.includes(fresh)) ok = false;
    }
    return { ok, lives: G.lives, served: G.served };
  });
  expect(result.ok).toBe(true);
  expect(result.lives).toBe(3);
  expect(result.served).toBe(4);
});

test('[F2P] valid hand-ins after queue mutation never consume a life as WRONG DISH', async ({ page }) => {
  await boot(page);
  const result = await scenario(page, () => {
    const { G, make, serve } = commonSetup();
    G.tickets.push(make('SALAD', ['L', 'T']), make('BLT', ['B', 'L', 'T']));
    serve(['L', 'T']);
    G.tickets.push(make('BURGER', ['B', 'P']));
    const before = { lives: G.lives, mistakes: G.mistakes };
    serve(['B', 'P']);
    return { before, lives: G.lives, mistakes: G.mistakes };
  });
  expect(result.lives).toBe(result.before.lives);
  expect(result.mistakes).toBe(result.before.mistakes);
});

test('[F2P] successful hand-in after queue mutation clears the carried plate and advances score', async ({ page }) => {
  await boot(page);
  const result = await scenario(page, () => {
    const { K, G, make, serve } = commonSetup();
    G.tickets.push(make('SALAD', ['L', 'T']), make('BLT', ['B', 'L', 'T']));
    serve(['L', 'T']);
    G.tickets.push(make('BURGER', ['B', 'P']));
    const score = G.score;
    serve(['B', 'P']);
    return { score, afterScore: G.score, carrying: K.chef.carrying, served: G.served };
  });
  expect(result.afterScore).toBeGreaterThan(result.score);
  expect(result.carrying).toBeNull();
  expect(result.served).toBe(2);
});