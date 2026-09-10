const { test, expect } = require('@playwright/test');

const APP_URL = process.env.APP_URL;
const STORAGE_KEY = 'bowling-spare-matrix-v1';

async function boot(page) {
  await page.goto(APP_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.locator('#pin-1').waitFor();
}

async function usePreset(page, name) {
  await page.locator(`[data-preset="${name}"]`).click();
}

async function board(page) {
  return (await page.locator('#dpBoard').innerText()).trim();
}

async function setHeavyLeft(page) {
  await page.locator('#btnLeft').click();
  await page.locator('#oilSlider').fill('100');
}

async function standingPins(page) {
  return page.locator('.pin.standing').evaluateAll(nodes => nodes.map(node => Number(node.dataset.pin)).sort((a, b) => a - b));
}

test('[P2P] app boots with the bowling workspace controls', async ({ page }) => {
  await boot(page);
  await expect(page.locator('#pinContainer')).toBeVisible();
  await expect(page.locator('#oilSlider')).toBeVisible();
  await expect(page.locator('#adjTableBody')).toBeVisible();
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

test('[F2P] a tied spare highlights the lower-numbered closest key pin', async ({ page }) => {
  await boot(page);
  await usePreset(page, 'split710');
  await expect(page.locator('#keypinValue')).toContainText('Pin 7');
  await expect(page.locator('#adj-row-7')).toHaveClass(/active/);
});

test('[F2P] handedness immediately refreshes the direction shown for the active pin', async ({ page }) => {
  await boot(page);
  await usePreset(page, 'single7');
  await expect(page.locator('#adj-row-7 td').nth(2)).toHaveText('Right');
  await page.locator('#btnLeft').click();
  await expect(page.locator('#adj-row-7 td').nth(2)).toHaveText('Left');
  await expect(page.locator('#adj-row-7')).toHaveClass(/active/);
});

test('[F2P] oil changes move a 7-pin recommendation predictably and return to its Medium board', async ({ page }) => {
  await boot(page);
  await usePreset(page, 'single7');
  await expect.poll(() => board(page)).toBe('26.0');
  await page.locator('#oilSlider').fill('0');
  await expect.poll(() => board(page)).toBe('28.5');
  await page.locator('#oilSlider').fill('100');
  await expect.poll(() => board(page)).toBe('23.5');
  await page.locator('#oilSlider').fill('50');
  await expect.poll(() => board(page)).toBe('26.0');
});

test('[F2P] manually changing a preset deck clears its stale preset highlight', async ({ page }) => {
  await boot(page);
  await usePreset(page, 'split710');
  await expect(page.locator('[data-preset="split710"]')).toHaveClass(/active/);
  await page.locator('#pin-1').click();
  await expect(page.locator('[data-preset="split710"]')).not.toHaveClass(/active/);
  await expect(page.locator('#scenarioName')).toContainText('Split');
});

test('[F2P] clearing every pin removes the previous board, arrow, and angle advice', async ({ page }) => {
  await boot(page);
  await usePreset(page, 'single7');
  await expect.poll(() => board(page)).toBe('26.0');
  await usePreset(page, 'allClear');
  await expect(page.locator('#dpBoard')).toHaveText('—');
  await expect(page.locator('#dpArrow')).toHaveText('—');
  await expect(page.locator('#dpAngle')).toHaveText('—');
});

test('[F2P] the active spare plan keeps its targets and adjustment reference readable together', async ({ page }) => {
  await boot(page);
  await usePreset(page, 'split710');
  await expect(page.locator('.shot-plan')).toBeVisible();
  await expect(page.locator('#dpBoard')).toHaveText('26.0');
  await expect(page.locator('#dpArrow')).toContainText('1st');
  await expect(page.locator('#dpAngle')).not.toHaveText('—');

  const tableFitsBesidePlan = await page.locator('#adj-row-10').evaluate(row => {
    const panel = document.getElementById('rightPanel').getBoundingClientRect();
    const rowBox = row.getBoundingClientRect();
    return rowBox.top >= panel.top && rowBox.bottom <= panel.bottom;
  });
  expect(tableFitsBesidePlan).toBe(true);
});

test('[F2P] the matching adjustment row is visually separated from reference rows', async ({ page }) => {
  await boot(page);
  await usePreset(page, 'single7');
  const colors = await page.locator('#adj-row-7 td').evaluateAll(cells => cells.map(cell => getComputedStyle(cell).backgroundColor));
  expect(colors.some(color => color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent')).toBe(true);
});

test('[F2P] applying a preset keeps the selected hand and oil condition', async ({ page }) => {
  await boot(page); await setHeavyLeft(page); await usePreset(page, 'split710');
  await expect(page.locator('#btnLeft')).toHaveClass(/active/);
  await expect(page.locator('#oilIndicator')).toHaveText('HEAVY');
});

test('[F2P] undoing a preset after refresh returns to the earlier full setup', async ({ page }) => {
  await boot(page); await setHeavyLeft(page); await page.locator('#pin-1').click(); await usePreset(page, 'single10');
  await page.reload({ waitUntil: 'networkidle' }); expect(await page.locator('#undoBtn').isEnabled()).toBe(true);
  await page.locator('#undoBtn').click(); await expect(page.locator('#btnLeft')).toHaveClass(/active/);
  await expect.poll(() => standingPins(page)).toEqual([2,3,4,5,6,7,8,9,10]);
});

test('[F2P] redo remains available after refresh', async ({ page }) => {
  await boot(page); await usePreset(page, 'split710'); await page.locator('#undoBtn').click();
  await page.reload({ waitUntil: 'networkidle' }); expect(await page.locator('#redoBtn').isEnabled()).toBe(true);
  await page.locator('#redoBtn').click(); await expect.poll(() => standingPins(page)).toEqual([7,10]);
});

test('[F2P] an oil change is undoable and redoable', async ({ page }) => {
  await boot(page); await page.locator('#oilSlider').fill('100'); expect(await page.locator('#undoBtn').isEnabled()).toBe(true);
  await page.locator('#undoBtn').click(); await expect(page.locator('#oilIndicator')).toHaveText('MEDIUM');
  await page.locator('#redoBtn').click(); await expect(page.locator('#oilIndicator')).toHaveText('HEAVY');
});

test('[F2P] reset restores defaults and Undo restores its earlier configuration after refresh', async ({ page }) => {
  await boot(page); await setHeavyLeft(page); await usePreset(page, 'split710'); await page.locator('#resetBtn').click();
  await expect(page.locator('#btnRight')).toHaveClass(/active/); await expect(page.locator('#oilIndicator')).toHaveText('MEDIUM');
  await page.reload({ waitUntil: 'networkidle' }); expect(await page.locator('#undoBtn').isEnabled()).toBe(true);
  await page.locator('#undoBtn').click(); await expect(page.locator('#btnLeft')).toHaveClass(/active/);
});

test('[F2P] invalid saved setup data leaves usable default controls', async ({ page }) => {
  await page.addInitScript(([key, value]) => localStorage.setItem(key, value), [STORAGE_KEY, JSON.stringify({ pins: {1:'standing'}, hand:'upside-down', oilValue:500 })]);
  await boot(page); await expect(page.locator('#btnRight')).toHaveClass(/active/); await expect(page.locator('#oilIndicator')).toHaveText('MEDIUM');
});
