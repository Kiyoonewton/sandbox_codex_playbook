const { test, expect } = require('@playwright/test');
const APP_URL = process.env.APP_URL;

async function boot(page) {
  await page.goto(APP_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('#root-grid .root-btn').first().waitFor();
}

async function selectPreset(page, name = 'Pop Classic') {
  await page.locator('.prog-item').filter({ hasText: name }).first().click();
}

async function saveCurrent(page) {
  await page.locator('#btn-save').click();
  await expect(page.locator('#saved-list .saved-item')).not.toHaveCount(0);
}

async function buildCustom(page, root, indices) {
  await page.locator(`.root-btn[data-note="${root}"]`).click();
  await page.locator('#btn-custom-mode').click();
  for (const index of indices) await page.locator('.chord-palette-btn').nth(index).click();
}

async function importJson(page, value, name = 'progressions.json') {
  await page.locator('#import-file').setInputFiles({
    name,
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(value)),
  });
}

async function expectSequence(page, symbols) {
  await expect(page.locator('#progression-sequence .seq-name')).toHaveText(symbols);
}

const validPreset = {
  id: 7,
  root: 'C',
  scale: 'Major',
  progression: { type: 'preset', name: 'Pop Classic' },
  label: 'Untrusted label',
  date: '2026-08-01T12:00:00.000Z',
};

test('[P2P] app boots and renders the chord workspace', async ({ page }) => {
  await boot(page);
  await expect(page.locator('#chord-display .chord-name')).toHaveText('C');
  await expect(page.locator('#root-grid .root-btn')).toHaveCount(12);
});

test('[P2P] the sidebar and main chord workspace remain available', async ({ page }) => {
  await boot(page);
  await expect(page.locator('.sidebar')).toBeVisible();
  await expect(page.locator('.main-content')).toBeVisible();
  await expect(page.locator('#progression-list')).toBeVisible();
  await expect(page.locator('#fretboard-container')).toBeVisible();
});

test('[F2P] editing a loaded custom progression does not mutate its saved copy', async ({ page }) => {
  await boot(page);
  await buildCustom(page, 'C', [0, 4, 5, 3]);
  await saveCurrent(page);
  await page.locator('#saved-list .btn-load').click();
  await page.locator('#btn-custom-mode').click();
  await page.locator('#sidebar-custom-chips .chip-remove').first().click();
  await expectSequence(page, ['G', 'Am', 'F']);

  await page.locator('#saved-list .btn-load').click();
  await expectSequence(page, ['C', 'G', 'Am', 'F']);
  await expect(page.locator('#chord-display .chord-name')).toHaveText('C');
});

test('[P2P] a saved custom progression restores key, order and first chord after refresh', async ({ page }) => {
  await boot(page);
  await buildCustom(page, 'G', [4, 1, 0]);
  await saveCurrent(page);
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('#saved-list .btn-load').click();

  await expect(page.locator('#current-key')).toHaveText('G Major');
  await expectSequence(page, ['D', 'Am', 'G']);
  await expect(page.locator('#chord-display .chord-name')).toHaveText('D');
  await expect(page.locator('#progression-sequence .seq-chord').first()).toHaveClass(/active/);
});

test('[F2P] import remains available for an empty saved library', async ({ page }) => {
  await boot(page);
  await expect(page.locator('#saved-empty')).toBeVisible();
  await expect(page.locator('#btn-import')).toBeVisible();
});

test('[F2P] an invalid entry rejects the entire import without changing the library', async ({ page }) => {
  await boot(page);
  await selectPreset(page);
  await saveCurrent(page);

  const invalidEntries = [
    { ...validPreset, root: 'H' },
    { ...validPreset, scale: 'Mystery Mode' },
    { ...validPreset, progression: { type: 'preset', name: 'Unknown Song' } },
    { ...validPreset, progression: { type: 'mystery', indices: [0] } },
    { ...validPreset, date: 'not-a-date' },
    { ...validPreset, progression: { type: 'custom', indices: [0, 7] } },
  ];

  for (let index = 0; index < invalidEntries.length; index++) {
    await importJson(page, [validPreset, invalidEntries[index]], `invalid-${index}.json`);
    await expect(page.locator('.toast')).toHaveText('Invalid file format');
    await expect(page.locator('#saved-list .saved-item')).toHaveCount(1);
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('chordforge_saved')).length)).toBe(1);
  }
});

test('[F2P] valid imports get unique IDs, persist, and load correctly', async ({ page }) => {
  await boot(page);
  const custom = {
    ...validPreset,
    root: 'G',
    progression: { type: 'custom', indices: [4, 1, 0] },
    date: '2026-08-02T12:00:00.000Z',
  };
  await importJson(page, [validPreset, custom]);
  await expect(page.locator('.toast')).toHaveText('Imported 2 progressions');
  await expect(page.locator('#saved-list .saved-item')).toHaveCount(2);

  const ids = await page.evaluate(() => JSON.parse(localStorage.getItem('chordforge_saved')).map(entry => entry.id));
  expect(new Set(ids).size).toBe(2);
  expect(ids).not.toContain(7);

  await page.reload({ waitUntil: 'networkidle' });
  await expect(page.locator('#saved-list .saved-item')).toHaveCount(2);
  await page.locator('#saved-list .saved-item').nth(1).locator('.btn-load').click();
  await expect(page.locator('#current-key')).toHaveText('G Major');
  await expectSequence(page, ['D', 'Am', 'G']);
  await expect(page.locator('#chord-display .chord-name')).toHaveText('D');

  await importJson(page, [validPreset, custom], 'same-progressions.json');
  await expect(page.locator('.toast')).toHaveText('No new progressions to import');
  await expect(page.locator('#saved-list .saved-item')).toHaveCount(2);
});

test('[F2P] Save reports failure when there is no active progression', async ({ page }) => {
  await boot(page);
  await selectPreset(page);
  await saveCurrent(page);
  await page.locator('#scale-select').selectOption('Natural Minor');
  await page.locator('#btn-save').click();

  await expect(page.locator('.toast')).toHaveText('Select a progression first');
  await expect(page.locator('#saved-list .saved-item')).toHaveCount(1);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('chordforge_saved')).length)).toBe(1);
});
