const { test, expect } = require('@playwright/test');

const APP_URL = process.env.APP_URL;
const STORAGE_KEY = 'bowling-spare-matrix-v1';

async function boot(page) {
  await page.goto(APP_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.locator('#pin-1').waitFor();
}

async function setHeavyLeft(page) {
  await page.locator('#btnLeft').click();
  await page.locator('#oilSlider').fill('100');
  await expect(page.locator('#oilIndicator')).toHaveText('HEAVY');
}

async function standingPins(page) {
  return page.locator('.pin.standing').evaluateAll(nodes =>
    nodes.map(node => Number(node.dataset.pin)).sort((a, b) => a - b)
  );
}

test('[P2P] app boots with the bowling workspace controls', async ({ page }) => {
  await boot(page);
  await expect(page.locator('#pinContainer')).toBeVisible();
  await expect(page.locator('#oilSlider')).toBeVisible();
  await expect(page.locator('#undoBtn')).toBeDisabled();
});

test('[P2P] the bowling workspace fits the viewport', async ({ page }) => {
  await boot(page);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
});

test('[F2P] a Heavy oil selection agrees with the slider endpoint', async ({ page }) => {
  await boot(page);
  await page.locator('#oilSlider').fill('100');
  await expect(page.locator('#oilIndicator')).toHaveText('HEAVY');
});

test('[F2P] loading a pin preset preserves the selected hand and oil condition', async ({ page }) => {
  await boot(page);
  await setHeavyLeft(page);
  await page.locator('[data-preset="split710"]').click();
  await expect(page.locator('#btnLeft')).toHaveClass(/active/);
  await expect(page.locator('#oilIndicator')).toHaveText('HEAVY');
  await expect.poll(() => standingPins(page)).toEqual([7, 10]);
});

test('[F2P] undoing a preset after refresh returns to the exact earlier setup', async ({ page }) => {
  await boot(page);
  await setHeavyLeft(page);
  await page.locator('#pin-1').click();
  await page.locator('[data-preset="single10"]').click();
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('#undoBtn').click();
  await expect(page.locator('#btnLeft')).toHaveClass(/active/);
  await expect(page.locator('#oilIndicator')).toHaveText('HEAVY');
  await expect.poll(() => standingPins(page)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10]);
});

test('[F2P] redo remains available after refresh and restores the preset', async ({ page }) => {
  await boot(page);
  await page.locator('[data-preset="split710"]').click();
  await page.locator('#undoBtn').click();
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('#redoBtn').click();
  await expect.poll(() => standingPins(page)).toEqual([7, 10]);
});

test('[F2P] changing the oil condition is one undoable and redoable setup action', async ({ page }) => {
  await boot(page);
  await page.locator('#oilSlider').fill('100');
  await page.locator('#undoBtn').click();
  await expect(page.locator('#oilIndicator')).toHaveText('MEDIUM');
  await page.locator('#redoBtn').click();
  await expect(page.locator('#oilIndicator')).toHaveText('HEAVY');
});

test('[F2P] reset returns every setup control to defaults and undo restores it after refresh', async ({ page }) => {
  await boot(page);
  await setHeavyLeft(page);
  await page.locator('[data-preset="split710"]').click();
  await page.locator('#resetBtn').click();
  await expect(page.locator('#btnRight')).toHaveClass(/active/);
  await expect(page.locator('#oilIndicator')).toHaveText('MEDIUM');
  await expect.poll(() => standingPins(page)).toEqual([1,2,3,4,5,6,7,8,9,10]);
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('#undoBtn').click();
  await expect(page.locator('#btnLeft')).toHaveClass(/active/);
  await expect(page.locator('#oilIndicator')).toHaveText('HEAVY');
  await expect.poll(() => standingPins(page)).toEqual([7, 10]);
});

test('[F2P] invalid saved setup data is ignored instead of producing impossible controls', async ({ page }) => {
  await page.addInitScript(([key, value]) => localStorage.setItem(key, value), [
    STORAGE_KEY,
    JSON.stringify({ pins: { 1: 'standing' }, hand: 'upside-down', oilValue: 500 }),
  ]);
  await boot(page);
  await expect(page.locator('#btnRight')).toHaveClass(/active/);
  await expect(page.locator('#oilIndicator')).toHaveText('MEDIUM');
  await expect.poll(() => standingPins(page)).toEqual([1,2,3,4,5,6,7,8,9,10]);
});
