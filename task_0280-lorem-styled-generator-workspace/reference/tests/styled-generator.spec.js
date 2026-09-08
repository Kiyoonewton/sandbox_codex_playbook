const { test, expect } = require('@playwright/test');
const APP_URL = process.env.APP_URL;

async function boot(page, clear = true) {
  if (clear) {
    await page.addInitScript(() => {
      localStorage.removeItem('filler_state');
      localStorage.removeItem('filler_history');
    });
  }
  await page.goto(APP_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.locator('#generateBtn').waitFor({ timeout: 15000 });
}

async function selectFlavor(page, flavor) {
  await page.locator(`.flavor-tab[data-flavor="${flavor}"]`).click();
}

async function selectUnit(page, unit) {
  await page.locator(`.unit-tab[data-unit="${unit}"]`).click();
}

async function setQty(page, qty) {
  const input = page.locator('#quantityInput');
  await input.fill(String(qty));
  await input.blur();
}

async function generate(page) {
  await page.locator('#generateBtn').click();
  await expect(page.locator('#outputBox')).toHaveClass(/has-output/);
}

async function outputText(page) {
  return (await page.locator('#outputContent').innerText()).trim();
}

async function outputLabel(page) {
  return (await page.locator('#outputLabel').innerText()).trim();
}

async function selectedFlavor(page) {
  return page.locator('.flavor-tab[aria-selected="true"]').getAttribute('data-flavor');
}

async function selectedUnit(page) {
  return page.locator('.unit-tab[aria-selected="true"]').getAttribute('data-unit');
}

async function firstCloudColor(page) {
  return page.locator('#wordCloud span').first().evaluate(el => getComputedStyle(el).color);
}

test('[P2P] app boots with generator controls available', async ({ page }) => {
  await boot(page);
  await expect(page.locator('#generateBtn')).toBeVisible();
  await expect(page.locator('#quantityInput')).toHaveValue('3');
});

test('[P2P] a normal generation produces text and a history entry', async ({ page }) => {
  await boot(page);
  await generate(page);
  await expect(page.locator('#outputContent')).not.toHaveText('');
  await expect(page.locator('.history-item')).toHaveCount(1);
});

test('[F2P] changing draft controls does not relabel an already generated document', async ({ page }) => {
  await boot(page);
  await selectFlavor(page, 'pirate-speak');
  await selectUnit(page, 'words');
  await setQty(page, 18);
  await generate(page);
  const before = await outputText(page);
  expect(await outputLabel(page)).toBe('PIRATE SPEAK');

  await selectFlavor(page, 'sci-fi');
  await selectUnit(page, 'sentences');
  await setQty(page, 4);

  expect(await selectedFlavor(page)).toBe('sci-fi');
  expect(await selectedUnit(page)).toBe('sentences');
  expect(await outputLabel(page)).toBe('PIRATE SPEAK');
  expect(await outputText(page)).toBe(before);
});

test('[F2P] reload preserves the generated document separately from newer draft controls', async ({ page }) => {
  await boot(page);
  await selectFlavor(page, 'cat-ipsum');
  await selectUnit(page, 'words');
  await setQty(page, 16);
  await generate(page);
  const text = await outputText(page);

  await selectFlavor(page, 'hipster-ipsum');
  await selectUnit(page, 'sentences');
  await setQty(page, 5);
  await page.reload({ waitUntil: 'networkidle' });

  expect(await selectedFlavor(page)).toBe('hipster-ipsum');
  expect(await selectedUnit(page)).toBe('sentences');
  await expect(page.locator('#quantityInput')).toHaveValue('5');
  expect(await outputLabel(page)).toBe('CAT IPSUM');
  expect(await outputText(page)).toBe(text);
});

test('[F2P] undo restores the previous document without borrowing the newer document identity', async ({ page }) => {
  await boot(page);
  await selectFlavor(page, 'classic-lorem');
  await selectUnit(page, 'words');
  await setQty(page, 12);
  await generate(page);
  const first = await outputText(page);

  await selectFlavor(page, 'pirate-speak');
  await setQty(page, 20);
  await generate(page);
  const second = await outputText(page);
  expect(second).not.toBe(first);

  await page.locator('#undoBtn').click();
  expect(await outputText(page)).toBe(first);
  expect(await outputLabel(page)).toBe('CLASSIC LOREM');
  expect(await selectedFlavor(page)).toBe('pirate-speak');
  await expect(page.locator('#quantityInput')).toHaveValue('20');
});

test('[F2P] redo restores the exact generated document after draft controls change during the undone state', async ({ page }) => {
  await boot(page);
  await selectFlavor(page, 'cat-ipsum');
  await selectUnit(page, 'words');
  await setQty(page, 14);
  await generate(page);
  await selectFlavor(page, 'sci-fi');
  await setQty(page, 22);
  await generate(page);
  const second = await outputText(page);

  await page.locator('#undoBtn').click();
  await selectFlavor(page, 'hipster-ipsum');
  await selectUnit(page, 'sentences');
  await setQty(page, 3);
  await page.locator('#redoBtn').click();

  expect(await outputText(page)).toBe(second);
  expect(await outputLabel(page)).toBe('SCI-FI');
  expect(await selectedFlavor(page)).toBe('sci-fi');
  expect(await selectedUnit(page)).toBe('words');
  await expect(page.locator('#quantityInput')).toHaveValue('22');
});

test('[F2P] generating a new branch after undo discards the abandoned redo document', async ({ page }) => {
  await boot(page);
  await selectFlavor(page, 'classic-lorem');
  await selectUnit(page, 'words');
  await setQty(page, 10);
  await generate(page);
  const first = await outputText(page);

  await selectFlavor(page, 'pirate-speak');
  await setQty(page, 11);
  await generate(page);
  await page.locator('#undoBtn').click();
  expect(await outputText(page)).toBe(first);

  await selectFlavor(page, 'cat-ipsum');
  await setQty(page, 13);
  await generate(page);
  const branch = await outputText(page);
  await expect(page.locator('#redoBtn')).toBeDisabled();

  await page.keyboard.press(process.platform === 'darwin' ? 'Meta+Shift+Z' : 'Control+Shift+Z');
  expect(await outputText(page)).toBe(branch);
  expect(await outputLabel(page)).toBe('CAT IPSUM');
});

test('[F2P] restoring history rehydrates text controls and provenance as one document snapshot', async ({ page }) => {
  await boot(page);
  await selectFlavor(page, 'classic-lorem');
  await selectUnit(page, 'words');
  await setQty(page, 9);
  await generate(page);
  const first = await outputText(page);

  await selectFlavor(page, 'pirate-speak');
  await selectUnit(page, 'sentences');
  await setQty(page, 2);
  await generate(page);
  const second = await outputText(page);
  expect(second).not.toBe(first);

  const history = page.locator('.history-item');
  await expect(history).toHaveCount(2);
  await history.nth(1).click();

  expect(await outputText(page)).toBe(first);
  expect(await outputLabel(page)).toBe('CLASSIC LOREM');
  expect(await selectedFlavor(page)).toBe('classic-lorem');
  expect(await selectedUnit(page)).toBe('words');
  await expect(page.locator('#quantityInput')).toHaveValue('9');

  await page.locator('#undoBtn').click();
  expect(await outputText(page)).toBe(second);
  expect(await outputLabel(page)).toBe('PIRATE SPEAK');
});

test('[F2P] keyboard undo and redo preserve document identity across mixed control changes', async ({ page }) => {
  await boot(page);
  await selectFlavor(page, 'cat-ipsum');
  await selectUnit(page, 'words');
  await setQty(page, 15);
  await generate(page);
  const first = await outputText(page);

  await selectFlavor(page, 'sci-fi');
  await setQty(page, 17);
  await generate(page);
  const second = await outputText(page);

  await page.keyboard.press(process.platform === 'darwin' ? 'Meta+Z' : 'Control+Z');
  expect(await outputText(page)).toBe(first);
  expect(await outputLabel(page)).toBe('CAT IPSUM');

  await selectFlavor(page, 'hipster-ipsum');
  await page.keyboard.press(process.platform === 'darwin' ? 'Meta+Shift+Z' : 'Control+Shift+Z');
  expect(await outputText(page)).toBe(second);
  expect(await outputLabel(page)).toBe('SCI-FI');
});

test('[F2P] word cloud stays styled for the generated flavor until a new document replaces it', async ({ page }) => {
  await boot(page);
  await selectFlavor(page, 'pirate-speak');
  await selectUnit(page, 'words');
  await setQty(page, 25);
  await generate(page);
  const pirateColor = await firstCloudColor(page);

  await selectFlavor(page, 'sci-fi');
  expect(await firstCloudColor(page)).toBe(pirateColor);
  expect(await outputLabel(page)).toBe('PIRATE SPEAK');

  await generate(page);
  expect(await outputLabel(page)).toBe('SCI-FI');
  expect(await firstCloudColor(page)).not.toBe(pirateColor);
});

test('[F2P] mixed history restore reload undo and redo keep one coherent generated-document timeline', async ({ page }) => {
  await boot(page);
  await selectFlavor(page, 'classic-lorem');
  await selectUnit(page, 'words');
  await setQty(page, 8);
  await generate(page);
  const classic = await outputText(page);

  await selectFlavor(page, 'pirate-speak');
  await setQty(page, 12);
  await generate(page);
  const pirate = await outputText(page);

  await selectFlavor(page, 'cat-ipsum');
  await setQty(page, 14);
  await generate(page);
  const cat = await outputText(page);

  await page.locator('.history-item').nth(2).click();
  expect(await outputText(page)).toBe(classic);
  expect(await outputLabel(page)).toBe('CLASSIC LOREM');

  await page.locator('#undoBtn').click();
  expect(await outputText(page)).toBe(cat);
  expect(await outputLabel(page)).toBe('CAT IPSUM');

  await page.locator('#redoBtn').click();
  expect(await outputText(page)).toBe(classic);
  expect(await outputLabel(page)).toBe('CLASSIC LOREM');

  await selectFlavor(page, 'sci-fi');
  await page.reload({ waitUntil: 'networkidle' });
  expect(await selectedFlavor(page)).toBe('sci-fi');
  expect(await outputText(page)).toBe(classic);
  expect(await outputLabel(page)).toBe('CLASSIC LOREM');

  expect(pirate).not.toBe(classic);
});
