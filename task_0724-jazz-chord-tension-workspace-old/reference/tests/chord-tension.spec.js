const { test, expect } = require('@playwright/test');
const APP_URL = process.env.APP_URL;

async function boot(page) {
  await page.goto(APP_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.locator('.chord-col').first().waitFor({ timeout: 15000 });
}

async function activeCard(page) {
  return (await page.locator('.chord-col.active .chord-name').innerText()).trim();
}

function intervalRow(page, chordName) {
  return page.locator('#interval-tbody tr').filter({ hasText: chordName }).first();
}

async function expectSelection(page, cardIndex, chordName) {
  await expect(page.locator('.chord-col').nth(cardIndex)).toHaveClass(/active/);
  await expect(page.locator('.chord-col').nth(cardIndex)).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.breakdown-cell').nth(cardIndex)).toHaveClass(/active/);
  await expect(intervalRow(page, chordName)).toHaveClass(/active/);
  await expect(intervalRow(page, chordName)).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#interval-tbody tr.active')).toHaveCount(1);
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

test('[F2P] selecting a chord card carries the same chord into interval anatomy', async ({ page }) => {
  await boot(page);
  await page.locator('.chord-col').nth(3).click();
  await expectSelection(page, 3, 'Cø7');
});

test('[F2P] choosing an interval row follows the chord rather than the row position', async ({ page }) => {
  await boot(page);
  await intervalRow(page, 'C7alt').click();
  expect(await activeCard(page)).toBe('C7alt');
  await expectSelection(page, 5, 'C7alt');
});

test('[F2P] selecting a tension-composition cell updates every view of the selected chord', async ({ page }) => {
  await boot(page);
  await page.locator('.breakdown-cell').nth(4).click();
  await expectSelection(page, 4, 'C°7');
});

test('[F2P] arrow navigation continues from the chord most recently chosen in tension composition', async ({ page }) => {
  await boot(page);
  await page.locator('.chord-col').nth(1).click();
  await page.locator('.breakdown-cell').nth(4).click();
  await page.keyboard.press('ArrowRight');
  expect(await activeCard(page)).toBe('C7alt');
  await expectSelection(page, 5, 'C7alt');
});

test('[F2P] mixed interval and composition handoffs keep ArrowLeft anchored to the latest chord', async ({ page }) => {
  await boot(page);
  await intervalRow(page, 'Cm7').click();
  await page.locator('.breakdown-cell').nth(5).click();
  await page.keyboard.press('ArrowLeft');
  expect(await activeCard(page)).toBe('C°7');
  await expectSelection(page, 4, 'C°7');
});

test('[F2P] keyboard activation of a reordered interval row becomes the arrow-navigation source', async ({ page }) => {
  await boot(page);
  const row = intervalRow(page, 'Cø7');
  await row.focus();
  await page.keyboard.press('Enter');
  expect(await activeCard(page)).toBe('Cø7');
  await page.keyboard.press('ArrowRight');
  expect(await activeCard(page)).toBe('C°7');
  await expectSelection(page, 4, 'C°7');
});
