const { test, expect } = require('@playwright/test');
const APP_URL = process.env.APP_URL;

async function prepare(page, { slowAAPL = false } = {}) {
  await page.addInitScript(() => {
    window.Chart = class { constructor(_ctx, config) { this.config = config; } destroy() {} };
  });
  await page.route(/financialmodelingprep\.com|gnews\.io/, async route => {
    const url = decodeURIComponent(route.request().url());
    if (slowAAPL && (url.includes('AAPL') || url.includes('Apple Inc.'))) {
      await new Promise(resolve => setTimeout(resolve, 900));
    }
    await route.abort();
  });
}

async function boot(page, options) {
  await prepare(page, options);
  await page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#hero')).toBeVisible();
}

async function searchCompany(page, ticker, expectedName) {
  const input = page.locator('#searchInput');
  await input.fill(ticker);
  await input.press('Enter');
  await expect(page.locator('#chN')).toHaveText(expectedName, { timeout: 15000 });
  await expect(page.locator('#dash')).toHaveClass(/visible/);
}

async function addComparison(page, ticker) {
  await page.locator('#compareBtn').click();
  await page.locator('#cmpInput').fill(ticker);
  await page.locator(`#cmpAc .ac-i[data-t="${ticker}"]`).click();
  await expect(page.locator('#toastContainer .toast').last()).toBeVisible();
}

async function openCompare(page) {
  await page.locator('#tabCompare').click();
  await expect(page.locator('#pCompare')).toHaveClass(/active/);
}

async function comparisonNames(page) {
  return page.locator('#cmpTbl tbody tr td:first-child').allTextContents();
}

test('[P2P] app boots and company autocomplete still works', async ({ page }) => {
  await boot(page);
  await page.locator('#searchInput').fill('micro');
  await expect(page.locator('#ac .ac-i')).toHaveCount(1);
  await expect(page.locator('#ac .ac-i')).toContainText('Microsoft Corporation');
});

test('[P2P] dashboard fits the viewport', async ({ page }) => {
  await boot(page);
  await searchCompany(page, 'AAPL', 'Apple Inc.');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
});

test('[F2P] estimated company data remains identical after refresh', async ({ page }) => {
  await boot(page);
  await searchCompany(page, 'AAPL', 'Apple Inc.');
  await page.waitForTimeout(1300);
  const before = await page.locator('#ringS, #gvsE, #gvsS, #gvsG, #chM, #subsE .sub-v, #subsS .sub-v, #subsG .sub-v').allTextContents();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#chN')).toHaveText('Apple Inc.', { timeout: 15000 });
  await page.waitForTimeout(1300);
  const after = await page.locator('#ringS, #gvsE, #gvsS, #gvsG, #chM, #subsE .sub-v, #subsS .sub-v, #subsG .sub-v').allTextContents();
  expect(after).toEqual(before);
});

test('[F2P] every pillar insight uses its real sector benchmark', async ({ page }) => {
  await boot(page);
  await searchCompany(page, 'AAPL', 'Apple Inc.');
  await expect(page.locator('#ginsE')).toContainText('Technology avg (62)');
  await expect(page.locator('#ginsS')).toContainText('avg 71');
  await expect(page.locator('#ginsG')).toContainText('avg 68');
  const insights = await page.locator('#ginsE, #ginsS, #ginsG').allTextContents();
  expect(insights.join(' ')).not.toMatch(/undefined|NaN/);
});

test('[F2P] pillar detail uses the matching benchmark and finite comparison', async ({ page }) => {
  await boot(page);
  await searchCompany(page, 'AAPL', 'Apple Inc.');
  await page.locator('.gcol.e .gwrap').click();
  await expect(page.locator('#detailBody')).toContainText('Industry avg: 62');
  await expect(page.locator('#detailBody')).not.toContainText(/undefined|NaN/);
  await expect(page.locator('#detailBody')).toContainText(/Above|Below/);
});

test('[F2P] comparison companies and order restore immediately after reload', async ({ page }) => {
  await boot(page);
  await searchCompany(page, 'AAPL', 'Apple Inc.');
  await addComparison(page, 'MSFT');
  await addComparison(page, 'TSLA');
  await openCompare(page);
  await expect.poll(() => comparisonNames(page)).toEqual(['Apple Inc.', 'Microsoft Corporation', 'Tesla Inc.']);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#tabCompare')).toHaveClass(/active/, { timeout: 15000 });
  await expect.poll(() => comparisonNames(page)).toEqual(['Apple Inc.', 'Microsoft Corporation', 'Tesla Inc.']);
});

test('[F2P] comparison removal is saved without waiting for page unload', async ({ page }) => {
  await boot(page);
  await searchCompany(page, 'AAPL', 'Apple Inc.');
  await addComparison(page, 'MSFT');
  await addComparison(page, 'TSLA');
  await openCompare(page);
  await page.locator('#cmpTbl .btn-x').first().click();
  await expect.poll(() => comparisonNames(page)).toEqual(['Apple Inc.', 'Tesla Inc.']);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect.poll(() => comparisonNames(page)).toEqual(['Apple Inc.', 'Tesla Inc.']);
});

test('[F2P] an undone comparison removal remains restored after refresh', async ({ page }) => {
  await boot(page);
  await searchCompany(page, 'AAPL', 'Apple Inc.');
  await addComparison(page, 'MSFT');
  await addComparison(page, 'TSLA');
  await openCompare(page);
  await page.locator('#cmpTbl .btn-x').first().click();
  await page.locator('#toastContainer .toast-undo-btn').click();
  await expect.poll(() => comparisonNames(page)).toEqual(['Apple Inc.', 'Microsoft Corporation', 'Tesla Inc.']);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect.poll(() => comparisonNames(page)).toEqual(['Apple Inc.', 'Microsoft Corporation', 'Tesla Inc.']);
});

test('[F2P] Share URL restores the complete ordered session in clean storage', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await boot(page);
  await searchCompany(page, 'AAPL', 'Apple Inc.');
  await addComparison(page, 'MSFT');
  await addComparison(page, 'TSLA');
  await page.locator('.lens-b[data-l="consumer"]').click();
  await openCompare(page);
  await page.locator('#fabBtn').click();
  await page.locator('#exShare').click();
  const shared = await page.evaluate(() => navigator.clipboard.readText());
  expect(shared).toContain('company=AAPL');
  expect(shared).toContain('compare=MSFT%2CTSLA');
  expect(shared).toContain('lens=consumer');
  expect(shared).toContain('tab=compare');

  await page.evaluate(() => localStorage.clear());
  await page.goto(shared, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#chN')).toHaveText('Apple Inc.', { timeout: 15000 });
  await expect(page.locator('.lens-b[data-l="consumer"]')).toHaveClass(/active/);
  await expect(page.locator('#tabCompare')).toHaveClass(/active/);
  await expect.poll(() => comparisonNames(page)).toEqual(['Apple Inc.', 'Microsoft Corporation', 'Tesla Inc.']);
});

test('[F2P] the newest search wins when requests finish out of order', async ({ page }) => {
  await boot(page, { slowAAPL: true });
  const input = page.locator('#searchInput');
  await input.fill('AAPL');
  await input.press('Enter');
  await page.waitForTimeout(75);
  await input.fill('MSFT');
  await input.press('Enter');
  await expect(page.locator('#chN')).toHaveText('Microsoft Corporation', { timeout: 15000 });
  await page.waitForTimeout(1300);
  await expect(page.locator('#chN')).toHaveText('Microsoft Corporation');
  await expect(page).toHaveURL(/company=MSFT/);
});

test('[F2P] the main company cannot also be added as a comparison', async ({ page }) => {
  await boot(page);
  await searchCompany(page, 'AAPL', 'Apple Inc.');
  await addComparison(page, 'AAPL');
  await openCompare(page);
  await expect.poll(() => comparisonNames(page)).toEqual([]);
  await expect(page.locator('#toastContainer .toast').last()).toContainText('Already added');
});
