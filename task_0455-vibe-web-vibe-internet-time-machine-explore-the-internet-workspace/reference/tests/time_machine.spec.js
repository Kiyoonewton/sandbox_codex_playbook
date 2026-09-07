const { test, expect } = require('@playwright/test');

const APP_URL = process.env.APP_URL;

async function boot(page, url = APP_URL) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await expect(page.locator('.hero-year')).toBeVisible();
}

async function selectTab(page, year) {
  await page.locator(`.tab-btn[data-year="${year}"]`).click();
  await expect(page.locator('.hero-year')).toHaveText(String(year));
}

async function expectYearSynced(page, year) {
  await expect(page.locator('.hero-year')).toHaveText(String(year));
  await expect(page.locator(`.tab-btn[data-year="${year}"]`)).toHaveClass(/active/);
  await expect(page.locator('#scrubber-thumb')).toHaveAttribute('aria-valuenow', String(year));
  await expect.poll(() => page.evaluate(() => localStorage.getItem('itm-year'))).toBe(String(year));
  await expect.poll(() => page.evaluate(() => location.hash)).toBe(`#${year}`);
}

test('[P2P] app boots with a visible year and all 26 year tabs', async ({ page }) => {
  await boot(page);
  await expect(page.locator('.hero-year')).toHaveText(/20\d\d/);
  await expect(page.locator('.tab-btn')).toHaveCount(26);
});

test('[P2P] normal tab navigation keeps the visible year, tab, URL, storage and scrubber in sync', async ({ page }) => {
  await boot(page);
  await selectTab(page, 2007);
  await expectYearSynced(page, 2007);
});

test('[F2P] undo returns to the previous committed year and synchronizes every year surface', async ({ page }) => {
  await boot(page);
  await selectTab(page, 2005);
  await selectTab(page, 2010);
  await page.locator('#undo-btn').click();
  await expectYearSynced(page, 2005);
});

test('[F2P] redo restores the year that was just undone', async ({ page }) => {
  await boot(page);
  await selectTab(page, 2005);
  await selectTab(page, 2010);
  await page.locator('#undo-btn').click();
  await expectYearSynced(page, 2005);
  await page.locator('#redo-btn').click();
  await expectYearSynced(page, 2010);
});

test('[F2P] Ctrl+Shift+Z performs redo rather than another undo', async ({ page }) => {
  await boot(page);
  await selectTab(page, 2005);
  await selectTab(page, 2010);
  await page.keyboard.press('Control+Z');
  await expectYearSynced(page, 2005);
  await page.keyboard.press('Control+Shift+Z');
  await expectYearSynced(page, 2010);
});

test('[F2P] navigating to a new year after undo discards the abandoned redo branch', async ({ page }) => {
  await boot(page);
  await selectTab(page, 2005);
  await selectTab(page, 2010);
  await page.locator('#undo-btn').click();
  await expectYearSynced(page, 2005);
  await selectTab(page, 2015);
  await page.locator('#redo-btn').click();
  await expectYearSynced(page, 2015);
  await expect(page.locator('#redo-btn')).toHaveCSS('opacity', '0.3');
});

test('[F2P] a deep-link hash wins over an older persisted year on reload', async ({ page }) => {
  await boot(page);
  await selectTab(page, 2015);
  await page.goto(`${APP_URL}#2005`, { waitUntil: 'networkidle' });
  await expectYearSynced(page, 2005);
});

test('[F2P] changing the URL hash while the app is already open navigates the time machine immediately', async ({ page }) => {
  await boot(page);
  await page.evaluate(() => { location.hash = '#2008'; });
  await expectYearSynced(page, 2008);
});

test('[F2P] favoriting a year updates the favorites bar immediately and favorite navigation joins undo history', async ({ page }) => {
  await boot(page);
  await selectTab(page, 2005);
  await page.locator('#fav-btn').click();
  const favorite = page.locator('.fav-year-btn', { hasText: '2005' });
  await expect(favorite).toBeVisible();
  await selectTab(page, 2010);
  await favorite.click();
  await expectYearSynced(page, 2005);
  await page.locator('#undo-btn').click();
  await expectYearSynced(page, 2010);
});

test('[F2P] a long scrubber drag is one history action, so one undo returns to the drag start year', async ({ page }) => {
  await boot(page);
  await selectTab(page, 2005);

  const track = page.locator('#scrubber-track');
  const box = await track.boundingBox();
  expect(box).not.toBeNull();

  const startX = box.x + box.width * (5 / 25);
  const endX = box.x + box.width * (20 / 25);
  const y = box.y + box.height / 2;

  await page.mouse.move(startX, y);
  await page.mouse.down();
  await page.mouse.move(endX, y, { steps: 14 });
  await page.mouse.up();

  await expectYearSynced(page, 2020);
  await page.locator('#undo-btn').click();
  await expectYearSynced(page, 2005);
});

test('[F2P] clicking the scrubber on the current year does not create a duplicate history entry', async ({ page }) => {
  await boot(page);
  await selectTab(page, 2010);

  const track = page.locator('#scrubber-track');
  const box = await track.boundingBox();
  expect(box).not.toBeNull();

  const x = box.x + box.width * (10 / 25);
  const y = box.y + box.height / 2;
  await page.mouse.click(x, y);
  await expectYearSynced(page, 2010);

  await page.locator('#undo-btn').click();
  await expectYearSynced(page, 2000);
});
