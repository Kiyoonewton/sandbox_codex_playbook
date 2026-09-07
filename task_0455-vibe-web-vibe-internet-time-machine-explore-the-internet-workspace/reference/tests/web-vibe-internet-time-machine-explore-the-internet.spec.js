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

test('[P2P] app boots and renders all year navigation', async ({ page }) => {
  await boot(page);
  await expect(page.locator('.hero-year')).toHaveText(/20\d\d/);
  await expect(page.locator('.tab-btn')).toHaveCount(26);
});

test('[P2P] normal tab navigation keeps visible and persisted year state synchronized', async ({ page }) => {
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

test('[F2P] changing the URL hash while already open navigates immediately and stays synchronized', async ({ page }) => {
  await boot(page);
  await page.evaluate(() => { location.hash = '#2008'; });
  await expectYearSynced(page, 2008);
});

test('[F2P] favoriting updates the favorites bar immediately and favorite navigation participates in undo', async ({ page }) => {
  await boot(page);
  await selectTab(page, 2005);
  await page.locator('#fav-btn').click();
  await expect(page.locator('.fav-year-btn', { hasText: '2005' })).toBeVisible();
  await selectTab(page, 2010);
  await page.locator('.fav-year-btn', { hasText: '2005' }).click();
  await expectYearSynced(page, 2005);
  await page.locator('#undo-btn').click();
  await expectYearSynced(page, 2010);
});

test('[F2P] a long scrubber drag is one history action so one undo returns to the drag start', async ({ page }) => {
  await boot(page);
  await selectTab(page, 2005);

  await page.exposeFunction('__scrubberDebug', (entry) => console.log('SCRUBBER_DEBUG', JSON.stringify(entry)));
  await page.evaluate(() => {
    ['mousedown', 'mousemove', 'mouseup'].forEach((type) => {
      document.addEventListener(type, (e) => {
        if (type === 'mousemove' && e.buttons !== 1) return;
        const track = document.getElementById('scrubber-track');
        const thumb = document.getElementById('scrubber-thumb');
        const rect = track?.getBoundingClientRect();
        window.__scrubberDebug({
          type,
          target: e.target?.id || e.target?.className || e.target?.tagName,
          clientX: e.clientX,
          buttons: e.buttons,
          trackLeft: rect?.left,
          trackWidth: rect?.width,
          ariaYear: thumb?.getAttribute('aria-valuenow'),
          heroYear: document.querySelector('.hero-year')?.textContent,
        });
      }, true);
    });
  });

  const box = await page.locator('#scrubber-track').boundingBox();
  expect(box).not.toBeNull();
  console.log('SCRUBBER_BOX', JSON.stringify(box));
  const y = box.y + box.height / 2;
  await page.mouse.move(box.x + box.width * (5 / 25), y);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * (20 / 25), y, { steps: 14 });
  await page.mouse.up();
  console.log('SCRUBBER_AFTER', await page.evaluate(() => ({
    heroYear: document.querySelector('.hero-year')?.textContent,
    ariaYear: document.getElementById('scrubber-thumb')?.getAttribute('aria-valuenow'),
    hash: location.hash,
    savedYear: localStorage.getItem('itm-year'),
  })));
  await expectYearSynced(page, 2020);
  await page.locator('#undo-btn').click();
  await expectYearSynced(page, 2005);
});

test('[F2P] clicking the scrubber on the current year does not create a no-op history entry', async ({ page }) => {
  await boot(page);
  await selectTab(page, 2010);
  const box = await page.locator('#scrubber-track').boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.click(box.x + box.width * (10 / 25), box.y + box.height / 2);
  await expectYearSynced(page, 2010);
  await page.locator('#undo-btn').click();
  await expectYearSynced(page, 2000);
});

test('[F2P] the default 2000 view includes its welcome message', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.removeItem('itm-year');
    localStorage.removeItem('itm-favorites');
  });
  await boot(page, `${APP_URL}#2000`);
  await expect(page.locator('.welcome-state h2')).toHaveText('Welcome to the Internet Time Machine.');
});
