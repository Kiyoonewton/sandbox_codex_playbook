const { test, expect } = require('@playwright/test');

const APP_URL = process.env.APP_URL;

async function boot(page) {
  await page.addInitScript(() => localStorage.clear());
  await page.goto(APP_URL, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /play/i }).click();
  await page.waitForTimeout(200);
}

async function interruptPunchWithPause(page, { punchT = 0.3, corruptState = false } = {}) {
  await page.evaluate(({ punchT, corruptState }) => {
    GameState.t = 0;
    GameState.rawPath = [{ x: 100, y: 100 }, { x: 200, y: 100 }, { x: 400, y: 100 }];
    GameState.smoothPath = PathSys.smooth(GameState.rawPath);
    GameState.state = ST.PUNCH;
    GameState.punchT = punchT;
    if (corruptState) {
      if (GameState.planks[0]) { GameState.planks[0].x = 0.99; GameState.planks[0].y = 0.99; }
      if (GameState.redB) GameState.redB.x = 0.01;
      if (GameState.blueB) GameState.blueB.y = 0.99;
    }
  }, { punchT, corruptState });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
}

test('[P2P] the drawing game starts with its normal canvas and controls', async ({ page }) => {
  await boot(page);
  await expect(page.locator('#c')).toBeVisible();
  await expect(page.getByRole('button', { name: /retry/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /pause/i })).toBeVisible();
});

test('[P2P] pausing and resuming from ordinary drawing, with no punch in flight, does not reset the level', async ({ page }) => {
  await boot(page);
  const lvlBefore = await page.evaluate(() => GameState.lvl);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
  const lvlAfter = await page.evaluate(() => GameState.lvl);
  const state = await page.evaluate(() => GameState.state);
  expect(lvlAfter).toBe(lvlBefore);
  expect(state).toBe('draw');
});

test('[P2P] resuming from any pause always lands back in a visible drawing state, never stuck paused', async ({ page }) => {
  await boot(page);
  await interruptPunchWithPause(page);
  await expect(page.locator('#pauseOverlay')).toHaveClass(/hidden/);
  const state = await page.evaluate(() => GameState.state);
  const isDrawing = await page.evaluate(() => GameState.isDrawing);
  expect(state).toBe('draw');
  expect(isDrawing).toBe(false);
});

test('[F2P] resuming from a pause that interrupted a punch leaves no punch progress behind', async ({ page }) => {
  await boot(page);
  await interruptPunchWithPause(page, { punchT: 0.3 });
  const punchT = await page.evaluate(() => GameState.punchT);
  expect(punchT).toBe(0);
});

test('[F2P] resuming from a pause interrupted late in the punch still resets progress, not just early interruptions', async ({ page }) => {
  await boot(page);
  await interruptPunchWithPause(page, { punchT: 0.85 });
  const punchT = await page.evaluate(() => GameState.punchT);
  expect(punchT).toBe(0);
});

test('[F2P] resuming from a pause interrupted right at the start of the punch still resets progress', async ({ page }) => {
  await boot(page);
  await interruptPunchWithPause(page, { punchT: 0.01 });
  const punchT = await page.evaluate(() => GameState.punchT);
  expect(punchT).toBe(0);
});

test('[F2P] resuming from an interrupted punch clears the old drawn line completely', async ({ page }) => {
  await boot(page);
  await interruptPunchWithPause(page);
  const rawPathLen = await page.evaluate(() => GameState.rawPath.length);
  const smoothPathLen = await page.evaluate(() => GameState.smoothPath.length);
  expect(rawPathLen).toBe(0);
  expect(smoothPathLen).toBe(0);
});

test('[F2P] resuming from an interrupted punch regenerates the planks instead of keeping their in-flight positions', async ({ page }) => {
  await boot(page);
  await interruptPunchWithPause(page, { corruptState: true });
  const plankPositions = await page.evaluate(() => GameState.planks.map(p => ({ x: p.x, y: p.y })));
  const stillCorrupted = plankPositions.some(p => Math.abs(p.x - 0.99) < 0.001 && Math.abs(p.y - 0.99) < 0.001);
  expect(stillCorrupted).toBe(false);
});

test('[F2P] resuming from an interrupted punch restores both boxers to their level-start positions', async ({ page }) => {
  await boot(page);
  await interruptPunchWithPause(page, { corruptState: true });
  const redX = await page.evaluate(() => GameState.redB.x);
  const blueY = await page.evaluate(() => GameState.blueB.y);
  expect(redX).toBeCloseTo(0.88, 2);
  expect(Math.abs(blueY - 0.99)).toBeGreaterThan(0.05);
});

test('[F2P] pausing and resuming twice in a row after an interrupted punch stays clean, not just on the first resume', async ({ page }) => {
  await boot(page);
  await interruptPunchWithPause(page, { punchT: 0.5 });
  // Interrupt again with a fresh fake punch, then resume a second time.
  await interruptPunchWithPause(page, { punchT: 0.6 });
  const punchT = await page.evaluate(() => GameState.punchT);
  const rawPathLen = await page.evaluate(() => GameState.rawPath.length);
  expect(punchT).toBe(0);
  expect(rawPathLen).toBe(0);
});
