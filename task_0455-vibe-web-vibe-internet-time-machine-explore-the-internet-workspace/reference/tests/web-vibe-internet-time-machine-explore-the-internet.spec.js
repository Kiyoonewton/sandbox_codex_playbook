const { test, expect } = require('@playwright/test');
const APP_URL = process.env.APP_URL;

async function boot(page) {
  await page.goto(APP_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await expect(page.locator('.hero-year')).toBeVisible();
  await expect(page.locator('.category-card')).toHaveCount(8);
}

function card(page, index) {
  return page.locator('.category-card').nth(index);
}

async function expectExpanded(item, expanded) {
  if (expanded) await expect(item).toHaveClass(/expanded/);
  else await expect(item).not.toHaveClass(/expanded/);
  await expect(item).toHaveAttribute('aria-expanded', expanded ? 'true' : 'false');
  await expect(item.locator('.category-toggle')).toHaveText(expanded ? '▾' : '▸');
}

test('[P2P] app still renders all eight Explore category cards', async ({ page }) => {
  await boot(page);
  await expect(page.locator('.category-card')).toHaveCount(8);
  await expect(page.locator('.category-card[role="button"]')).toHaveCount(8);
});

test('[P2P] mouse click still expands and collapses a category visually', async ({ page }) => {
  await boot(page);
  const first = card(page, 0);
  await first.click();
  await expect(first).toHaveClass(/expanded/);
  await first.click();
  await expect(first).not.toHaveClass(/expanded/);
});

test('[F2P] Enter activates a focused category and exposes its expanded state', async ({ page }) => {
  await boot(page);
  const first = card(page, 0);
  await first.focus();
  await page.keyboard.press('Enter');
  await expectExpanded(first, true);
});

test('[F2P] Enter toggles an already expanded focused category closed', async ({ page }) => {
  await boot(page);
  const first = card(page, 0);
  await first.focus();
  await page.keyboard.press('Enter');
  await expectExpanded(first, true);
  await page.keyboard.press('Enter');
  await expectExpanded(first, false);
});

test('[F2P] Space activates a focused category instead of scrolling the page', async ({ page }) => {
  await boot(page);
  const first = card(page, 0);
  await first.scrollIntoViewIfNeeded();
  await first.focus();
  const before = await page.evaluate(() => window.scrollY);
  await page.keyboard.press('Space');
  await expectExpanded(first, true);
  const after = await page.evaluate(() => window.scrollY);
  expect(Math.abs(after - before)).toBeLessThan(5);
});

test('[F2P] opening another category synchronizes the previously open card to collapsed', async ({ page }) => {
  await boot(page);
  const first = card(page, 0);
  const second = card(page, 1);
  await first.click();
  await expectExpanded(first, true);
  await second.click();
  await expectExpanded(first, false);
  await expectExpanded(second, true);
});

test('[F2P] Escape collapses the open category and synchronizes its accessibility state', async ({ page }) => {
  await boot(page);
  const first = card(page, 0);
  await first.click();
  await expectExpanded(first, true);
  await first.focus();
  await page.keyboard.press('Escape');
  await expectExpanded(first, false);
});

test('[F2P] numeric category shortcut exposes the same expanded state as direct activation', async ({ page }) => {
  await boot(page);
  const third = card(page, 2);
  await page.keyboard.press('3');
  await expectExpanded(third, true);
});

test('[F2P] switching numeric shortcuts leaves exactly one category expanded and synchronized', async ({ page }) => {
  await boot(page);
  const second = card(page, 1);
  const fifth = card(page, 4);
  await page.keyboard.press('2');
  await expectExpanded(second, true);
  await page.keyboard.press('5');
  await expectExpanded(second, false);
  await expectExpanded(fifth, true);
  await expect(page.locator('.category-card.expanded')).toHaveCount(1);
});

test('[F2P] keyboard activation does not change the selected year', async ({ page }) => {
  await boot(page);
  const year = await page.locator('.hero-year').textContent();
  const first = card(page, 0);
  await first.focus();
  await page.keyboard.press('Enter');
  await expectExpanded(first, true);
  await expect(page.locator('.hero-year')).toHaveText(year.trim());
});
