const { test, expect } = require('@playwright/test');
const APP_URL = process.env.APP_URL;

const CUSTOM = {
  id: 'custom-verifier-school',
  name: 'Verifier Technical University',
  short: 'VTU',
  state: 'CA',
  type: 'private',
  ivy: false,
  tuition: 32000,
  enrollment: 9000,
  acceptanceRate: 42,
  studentFacultyRatio: 11,
  location: 'Test City, CA',
  color: '#52B883',
  graduationRate: 91,
  avgSalary: 88000,
  isCustom: true,
};

async function boot(page) {
  await page.goto(APP_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(250);
}

async function cleanBoot(page) {
  await page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('.uni-item[data-uni-id="mit"]').waitFor({ timeout: 15000 });
}

async function seed(page, comparisonIds, customSchools = []) {
  await page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.evaluate(({ comparisonIds, customSchools }) => {
    localStorage.clear();
    localStorage.setItem('uni-compare-v2', JSON.stringify({ comparisonIds, viewMode: 'cards' }));
    localStorage.setItem('uni-compare-custom', JSON.stringify(customSchools));
  }, { comparisonIds, customSchools });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(250);
}

async function deleteCustom(page) {
  await page.locator(`[data-delete-custom="${CUSTOM.id}"]`).click();
  await page.locator('#delete-confirm').click();
  await page.waitForTimeout(150);
}

test('[P2P] app boots and renders the university browser', async ({ page }) => {
  await cleanBoot(page);
  await expect(page.locator('.uni-item[data-uni-id="mit"]')).toBeVisible();
  await expect(page.locator('#comparison-count')).toHaveText('0');
});

test('[P2P] preset universities can still be added and removed normally', async ({ page }) => {
  await cleanBoot(page);
  await page.locator('.uni-item[data-uni-id="mit"]').click();
  await expect(page.locator('#comparison-count')).toHaveText('1');
  await page.locator('.uni-item[data-uni-id="mit"]').click();
  await expect(page.locator('#comparison-count')).toHaveText('0');
});

test('[F2P] a refused fifth selection does not become an undo history entry', async ({ page }) => {
  await cleanBoot(page);
  for (const id of ['mit', 'stanford', 'harvard', 'yale']) {
    await page.locator(`.uni-item[data-uni-id="${id}"]`).click();
  }
  await page.locator('.uni-item[data-uni-id="columbia"]').click();
  await expect(page.locator('#comparison-count')).toHaveText('4');
  await page.locator('#btn-undo').click();
  await expect(page.locator('#comparison-count')).toHaveText('3');
});

test('[F2P] reset reports the comparison reset without claiming nonexistent custom-school deletion', async ({ page }) => {
  await cleanBoot(page);
  await page.locator('.uni-item[data-uni-id="mit"]').click();
  await page.locator('#btn-reset').click();
  await expect(page.locator('#toast-container .toast:last-child')).toContainText('Comparison reset');
  await expect(page.locator('#toast-container .toast:last-child')).not.toContainText('custom schools removed');
});

test('[F2P] undoing deletion restores a compared custom school and its comparison slot', async ({ page }) => {
  await seed(page, ['mit', CUSTOM.id], [CUSTOM]);
  await expect(page.locator(`.uni-item[data-uni-id="${CUSTOM.id}"]`)).toBeVisible();
  await expect(page.locator(`.comp-card[data-uni-id="${CUSTOM.id}"]`)).toBeVisible();
  await deleteCustom(page);
  await expect(page.locator(`[data-uni-id="${CUSTOM.id}"]`)).toHaveCount(0);
  await page.locator('#btn-undo').click();
  await expect(page.locator(`.uni-item[data-uni-id="${CUSTOM.id}"]`)).toBeVisible();
  await expect(page.locator(`.comp-card[data-uni-id="${CUSTOM.id}"]`)).toBeVisible();
  await expect(page.locator('#comparison-count')).toHaveText('2');
});

test('[F2P] redo after restoring a deleted custom school removes the same school again', async ({ page }) => {
  await seed(page, ['mit', CUSTOM.id], [CUSTOM]);
  await deleteCustom(page);
  await page.locator('#btn-undo').click();
  await expect(page.locator(`.uni-item[data-uni-id="${CUSTOM.id}"]`)).toBeVisible();
  await expect(page.locator(`.comp-card[data-uni-id="${CUSTOM.id}"]`)).toBeVisible();
  await expect(page.locator('#comparison-count')).toHaveText('2');
  await page.locator('#btn-redo').click();
  await expect(page.locator(`[data-uni-id="${CUSTOM.id}"]`)).toHaveCount(0);
  await expect(page.locator('#comparison-count')).toHaveText('1');
});

test('[F2P] undoing reset restores custom schools together with the comparison they belonged to', async ({ page }) => {
  await seed(page, ['stanford', CUSTOM.id], [CUSTOM]);
  await page.locator('#btn-reset').click();
  await expect(page.locator('#comparison-count')).toHaveText('0');
  await expect(page.locator(`[data-uni-id="${CUSTOM.id}"]`)).toHaveCount(0);
  await page.locator('#btn-undo').click();
  await expect(page.locator(`.uni-item[data-uni-id="${CUSTOM.id}"]`)).toBeVisible();
  await expect(page.locator(`.comp-card[data-uni-id="${CUSTOM.id}"]`)).toBeVisible();
  await expect(page.locator('#comparison-count')).toHaveText('2');
});

test('[F2P] reset undo redo preserves the custom-school lifecycle in both directions', async ({ page }) => {
  await seed(page, ['harvard', CUSTOM.id], [CUSTOM]);
  await page.locator('#btn-reset').click();
  await page.locator('#btn-undo').click();
  await expect(page.locator(`.uni-item[data-uni-id="${CUSTOM.id}"]`)).toBeVisible();
  await expect(page.locator(`.comp-card[data-uni-id="${CUSTOM.id}"]`)).toBeVisible();
  await page.locator('#btn-redo').click();
  await expect(page.locator(`[data-uni-id="${CUSTOM.id}"]`)).toHaveCount(0);
  await expect(page.locator('#comparison-count')).toHaveText('0');
});

test('[F2P] stale persisted comparison ids are discarded on reload instead of occupying hidden slots', async ({ page }) => {
  await seed(page, ['mit', 'custom-does-not-exist'], []);
  await expect(page.locator('#comparison-count')).toHaveText('1');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('uni-compare-v2')).comparisonIds);
  expect(stored).toEqual(['mit']);
});

test('[F2P] duplicate persisted ids are normalized so one university occupies one comparison slot', async ({ page }) => {
  await seed(page, ['mit', 'mit', 'stanford'], []);
  await expect(page.locator('#comparison-count')).toHaveText('2');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('uni-compare-v2')).comparisonIds);
  expect(stored).toEqual(['mit', 'stanford']);
});
