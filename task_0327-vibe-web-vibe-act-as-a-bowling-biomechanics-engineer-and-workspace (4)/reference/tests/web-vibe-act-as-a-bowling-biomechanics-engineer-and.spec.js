const { test, expect } = require('@playwright/test');

const APP_URL = process.env.APP_URL;

async function boot(page) {
  await page.goto(APP_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.locator('#pin-1').waitFor();
}

async function isolatePin1(page) {
  for (const pin of [2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    await page.locator(`#pin-${pin}`).click();
  }
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

test('[P2P] toggling a pin down is undoable', async ({ page }) => {
  await boot(page);
  await page.locator('#pin-7').click();
  await expect(page.locator('#pin-7')).toHaveClass(/down/);
  await expect(page.locator('#undoBtn')).toBeEnabled();
  await page.locator('#undoBtn').click();
  await expect(page.locator('#pin-7')).toHaveClass(/standing/);
});

test('[P2P] a right-handed center-pin spare follows the Medium/Dry/Heavy oil curve', async ({ page }) => {
  await boot(page);
  await isolatePin1(page);
  await expect(page.locator('#btnRight')).toHaveClass(/active/);
  await expect.poll(() => board(page)).toBe('17.0');
  await page.locator('#oilSlider').fill('0');
  await expect.poll(() => board(page)).toBe('19.5');
  await page.locator('#oilSlider').fill('100');
  await expect.poll(() => board(page)).toBe('14.5');
  await page.locator('#oilSlider').fill('50');
  await expect.poll(() => board(page)).toBe('17.0');
});

test('[F2P] switching to left-handed mirrors the center-pin board on Dry', async ({ page }) => {
  await boot(page);
  await isolatePin1(page);
  await page.locator('#btnLeft').click();
  await expect.poll(() => board(page)).toBe('17.0');
  await page.locator('#oilSlider').fill('0');
  await expect.poll(() => board(page)).toBe('14.5');
});

test('[F2P] switching to left-handed mirrors the center-pin board on Heavy', async ({ page }) => {
  await boot(page);
  await isolatePin1(page);
  await page.locator('#btnLeft').click();
  await page.locator('#oilSlider').fill('100');
  await expect.poll(() => board(page)).toBe('19.5');
});

test('[F2P] a Heavy oil selection agrees with the slider endpoint', async ({ page }) => {
  await boot(page);
  await page.locator('#oilSlider').fill('100');
  await expect(page.locator('#oilIndicator')).toHaveText('HEAVY');
});

test('[F2P] the oil offset readout text agrees with the selected condition', async ({ page }) => {
  await boot(page);
  await isolatePin1(page);
  await page.locator('#oilSlider').fill('100');
  await expect(page.locator('#oilIndicator')).toHaveText('HEAVY');
  await expect(page.locator('#oilOffset')).toContainText('-2.5');

  await page.locator('#oilSlider').fill('0');
  await expect(page.locator('#oilIndicator')).toHaveText('DRY');
  await expect(page.locator('#oilOffset')).toContainText('+2.5');
});

test('[F2P] the trajectory angle shows exactly one degree symbol', async ({ page }) => {
  await boot(page);
  await page.locator('.preset-btn[data-preset="single10"]').click();
  const text = (await page.locator('#dpAngle').innerText()).trim();
  expect(text.match(/°/g).length).toBe(1);
});

test('[F2P] the active recommendation and adjustment reference stay readable together', async ({ page }) => {
  await boot(page);
  await page.locator('.preset-btn[data-preset="single10"]').click();
  await expect(page.locator('#dpBoard')).not.toHaveText('—');

  const tableFitsBesidePlan = await page.locator('#adj-row-10').evaluate(row => {
    const panel = document.getElementById('rightPanel').getBoundingClientRect();
    const rowBox = row.getBoundingClientRect();
    return rowBox.top >= panel.top && rowBox.bottom <= panel.bottom + 2;
  });
  expect(tableFitsBesidePlan).toBe(true);
});

test('[F2P] the Greek Church preset loads the actual Greek Church split', async ({ page }) => {
  await boot(page);
  await page.locator('.preset-btn[data-preset="GreekChurch"]').click();
  const standing = await page.locator('.pin.standing').evaluateAll(nodes =>
    nodes.map(node => Number(node.dataset.pin)).sort((a, b) => a - b)
  );
  expect(standing).toEqual([4, 6, 7, 9, 10]);
});

test('[P2P] clearing every pin removes the previous board, arrow, and angle advice', async ({ page }) => {
  await boot(page);
  await page.locator('.preset-btn[data-preset="single7"]').click();
  await expect(page.locator('#dpBoard')).not.toHaveText('—');
  await page.locator('.preset-btn[data-preset="allClear"]').click();
  await expect(page.locator('#dpBoard')).toHaveText('—');
  await expect(page.locator('#dpArrow')).toHaveText('—');
  await expect(page.locator('#dpAngle')).toHaveText('—');
});
