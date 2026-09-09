const { test, expect } = require('@playwright/test');
const APP_URL = process.env.APP_URL;

async function boot(page) {
  await page.goto(APP_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('.uni-item[data-uni-id="mit"]').waitFor();
}

async function addPreset(page, id) {
  await page.locator(`.uni-item[data-uni-id="${id}"]`).click();
}

async function createCustom(page, name = 'Kiyoo University', short = 'Kiyoo') {
  await page.locator('#btn-add-school').click();
  await page.locator('#school-name').fill(name);
  await page.locator('#school-short').fill(short);
  await page.locator('#school-tuition').fill('24000');
  await page.locator('#school-enrollment').fill('8000');
  await page.locator('#school-acceptance').fill('42');
  await page.locator('#add-school-form button[type="submit"]').click();
  const item = page.locator('.uni-item').filter({ hasText: short });
  await expect(item).toBeVisible();
  return item;
}

async function expectCompared(page, names) {
  await expect(page.locator('#comparison-count')).toHaveText(String(names.length));
  for (const name of names) await expect(page.locator('#comparison-grid').getByText(name, { exact: true })).toBeVisible();
}

async function expectComparisonOrder(page, names) {
  await expect(page.locator('#comparison-grid .comp-card__name')).toHaveText(names);
}

async function historyShortcut(page, action) {
  const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
  await page.keyboard.press(action === 'undo' ? `${modifier}+z` : `${modifier}+Shift+z`);
}

test('[P2P] search and type filters continue to narrow the university browser', async ({ page }) => {
  await boot(page);
  await page.locator('#search-input').fill('California');
  await expect(page.locator('.uni-item')).toHaveCount(1);
  await expect(page.locator('.uni-item')).toContainText('Caltech');
  await page.locator('#search-input').fill('');
  await page.locator('.filter-chip[data-filter="ivy"]').click();
  await expect(page.locator('.uni-item[data-uni-id="harvard"]')).toBeVisible();
  await expect(page.locator('.uni-item[data-uni-id="mit"]')).toHaveCount(0);
});
test('[P2P] card and table views show the same preset comparison', async ({ page }) => {
  await boot(page);
  await addPreset(page, 'mit');
  await addPreset(page, 'stanford');
  await expectCompared(page, ['MIT', 'Stanford']);
  await page.locator('.view-btn[data-view="table"]').click();
  await expect(page.locator('#comparison-table')).toContainText('MIT');
  await expect(page.locator('#comparison-table')).toContainText('Stanford');
  await expect(page.locator('#comparison-count')).toHaveText('2');
});

test('[F2P] history skips refused changes', async ({ page }) => {
  await boot(page);
  for (const id of ['mit', 'stanford', 'harvard', 'yale']) await addPreset(page, id);
  await addPreset(page, 'columbia');
  await page.locator('#btn-undo').click();
  await expectCompared(page, ['MIT', 'Stanford', 'Harvard']);
  await expect(page.locator('.uni-item[data-uni-id="yale"]')).toHaveAttribute('aria-pressed', 'false');
});

test('[F2P] history restores deleted custom entries', async ({ page }) => {
  await boot(page);
  const custom = await createCustom(page);
  await custom.click();
  await expectCompared(page, ['Kiyoo']);
  await custom.locator('[data-delete-custom]').click();
  await page.locator('#delete-confirm').click();
  await expect(page.locator('.uni-item').filter({ hasText: 'Kiyoo' })).toHaveCount(0);
  await page.locator('#btn-undo').click();
  await expectCompared(page, ['Kiyoo']);
  await expect(page.locator('.uni-item').filter({ hasText: 'Kiyoo' })).toBeVisible();
  await expect(page.locator('#comparison-grid .comp-card')).toContainText(['$24,000']);
  await expect(page.locator('#comparison-grid .comp-card')).toContainText(['8,000']);
  await expect(page.locator('#comparison-grid .comp-card')).toContainText(['42.0%']);
});

test('[F2P] redo follows restored custom entries', async ({ page }) => {
  await boot(page);
  const custom = await createCustom(page);
  await custom.click();
  await custom.locator('[data-delete-custom]').click();
  await page.locator('#delete-confirm').click();
  await page.locator('#btn-undo').click();
  await expectCompared(page, ['Kiyoo']);
  await page.locator('#btn-redo').click();
  await expect(page.locator('#comparison-count')).toHaveText('0');
  await expect(page.locator('.uni-item').filter({ hasText: 'Kiyoo' })).toHaveCount(0);
});

test('[F2P] reset participates in complete history', async ({ page }) => {
  await boot(page);
  await addPreset(page, 'mit');
  const custom = await createCustom(page);
  await custom.click();
  await addPreset(page, 'stanford');
  await expectCompared(page, ['MIT', 'Kiyoo', 'Stanford']);
  await page.locator('#btn-reset').click();
  await expect(page.locator('#comparison-count')).toHaveText('0');
  await expect(page.locator('#toast-container .toast').last()).toHaveText('Comparison reset');
  await page.locator('#btn-undo').click();
  await expectCompared(page, ['MIT', 'Kiyoo', 'Stanford']);
  await expectComparisonOrder(page, ['MIT', 'Kiyoo', 'Stanford']);
  await expect(page.locator('.uni-item').filter({ hasText: 'Kiyoo' })).toBeVisible();
});

test('[F2P] a new edit replaces an abandoned branch', async ({ page }) => {
  await boot(page);
  await addPreset(page, 'mit');
  const custom = await createCustom(page);
  await custom.click();
  await page.locator('#btn-reset').click();
  await page.locator('#btn-undo').click();
  await expectCompared(page, ['MIT', 'Kiyoo']);
  await addPreset(page, 'stanford');
  await expect(page.locator('#btn-redo')).toBeDisabled();
  await expectCompared(page, ['MIT', 'Kiyoo', 'Stanford']);
});

test('[F2P] keyboard history matches button history', async ({ page }) => {
  await boot(page);
  await addPreset(page, 'mit');
  const custom = await createCustom(page);
  await custom.click();
  await page.locator('#btn-reset').click();
  await historyShortcut(page, 'undo');
  await expectCompared(page, ['MIT', 'Kiyoo']);
  await historyShortcut(page, 'redo');
  await expect(page.locator('#comparison-count')).toHaveText('0');
  await expect(page.locator('.uni-item').filter({ hasText: 'Kiyoo' })).toHaveCount(0);
});
