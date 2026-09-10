const { test, expect } = require('@playwright/test');

const APP_URL = process.env.APP_URL;

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
