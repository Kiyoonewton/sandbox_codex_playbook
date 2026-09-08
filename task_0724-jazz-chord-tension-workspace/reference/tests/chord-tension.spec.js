const { test, expect } = require('@playwright/test');
const APP_URL = process.env.APP_URL;

async function boot(page) {
  await page.goto(APP_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.locator('.chord-col').first().waitFor({ timeout: 15000 });
}

async function activeCard(page) {
  return (await page.locator('.chord-col.active .chord-name').innerText()).trim();
}

async function expectSelection(page, index) {
  await expect(page.locator('.chord-col').nth(index)).toHaveClass(/active/);
  await expect(page.locator('.chord-col').nth(index)).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.breakdown-cell').nth(index)).toHaveClass(/active/);
  await expect(page.locator('#interval-tbody tr').nth(index)).toHaveClass(/active/);
  await expect(page.locator('#interval-tbody tr').nth(index)).toHaveAttribute('aria-pressed', 'true');
}

test('[P2P] chord analysis views render all seven voicings', async ({ page }) => {
  await boot(page);
  await expect(page.locator('.chord-col')).toHaveCount(7);
  await expect(page.locator('#interval-tbody tr')).toHaveCount(7);
  await expect(page.locator('.breakdown-cell')).toHaveCount(7);
});

test('[P2P] custom chord builder remains interactive and resettable', async ({ page }) => {
  await boot(page);
  const first = page.locator('.builder-note-btn').first();
  await first.focus();
  await page.keyboard.press('ArrowUp');
  await expect(first).toHaveAttribute('aria-valuenow', '1');
  await page.locator('#builder-reset').click();
  await expect(first).toHaveAttribute('aria-valuenow', '0');
});

test('[F2P] selecting a chord card carries the same selection into interval anatomy', async ({ page }) => {
  await boot(page);
  await page.locator('.chord-col').nth(3).click();
  await expectSelection(page, 3);
});

test('[F2P] a later chord-card selection replaces an interval-row selection everywhere', async ({ page }) => {
  await boot(page);
  await page.locator('#interval-tbody tr').nth(1).click();
  await page.locator('.chord-col').nth(5).click();
  await expectSelection(page, 5);
  await expect(page.locator('#interval-tbody tr.active')).toHaveCount(1);
});

test('[F2P] selecting a tension-composition cell updates every view of the selected chord', async ({ page }) => {
  await boot(page);
  await page.locator('.breakdown-cell').nth(4).click();
  await expectSelection(page, 4);
});

test('[F2P] arrow navigation continues from the chord most recently chosen in tension composition', async ({ page }) => {
  await boot(page);
  await page.locator('.chord-col').nth(1).click();
  await page.locator('.breakdown-cell').nth(4).click();
  await page.keyboard.press('ArrowRight');
  expect(await activeCard(page)).toBe('C7alt');
  await expectSelection(page, 5);
});

test('[F2P] mixed interval and composition handoffs keep ArrowLeft anchored to the latest selection', async ({ page }) => {
  await boot(page);
  await page.locator('#interval-tbody tr').nth(2).click();
  await page.locator('.breakdown-cell').nth(5).click();
  await page.keyboard.press('ArrowLeft');
  expect(await activeCard(page)).toBe('C°7');
  await expectSelection(page, 4);
});

test('[F2P] keyboard activation of a composition cell becomes the source for subsequent arrow navigation', async ({ page }) => {
  await boot(page);
  const cell = page.locator('.breakdown-cell').nth(3);
  await cell.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowRight');
  expect(await activeCard(page)).toBe('C°7');
  await expectSelection(page, 4);
});
