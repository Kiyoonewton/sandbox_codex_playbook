const { test, expect } = require('@playwright/test');

const APP_URL = process.env.APP_URL;

async function boot(page) {
  await page.addInitScript(() => localStorage.clear());
  await page.goto(APP_URL, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /play/i }).click();
  await expect(page.locator('#routeCheck')).toBeVisible();
}

async function installSingleCrate(page) {
  await page.evaluate(() => {
    GameState.t = 0;
    GameState.planks = [{ x: 0.5, y: 0.5, baseX: 0.5, baseY: 0.5, w: 0.14, h: 0.18 }];
  });
}

async function drawRoute(page, points, release = false) {
  const box = await page.locator('#c').boundingBox();
  const toCanvas = ([x, y]) => ({ x: box.x + box.width * x, y: box.y + box.height * y });
  await page.mouse.move(...Object.values(toCanvas(points[0])));
  await page.mouse.down();
  for (const point of points.slice(1)) {
    const position = toCanvas(point);
    await page.mouse.move(position.x, position.y);
  }
  if (release) await page.mouse.up();
}

const clearRoute = [[0.10, 0.24], [0.25, 0.24], [0.38, 0.24], [0.44, 0.28]];
const crossingRoute = [[0.10, 0.50], [0.40, 0.50], [0.62, 0.50], [0.80, 0.30]];
const endingInCrate = [[0.10, 0.50], [0.30, 0.50], [0.50, 0.50]];

test('[P2P] the drawing game starts with its normal canvas, controls, and route card', async ({ page }) => {
  await boot(page);
  await expect(page.locator('#c')).toBeVisible();
  await expect(page.getByRole('button', { name: /retry/i })).toBeVisible();
  await expect(page.locator('#routeMessage')).toHaveText('DRAW A ROUTE');
});

test('[P2P] the route card remains inside the game window after retrying', async ({ page }) => {
  await boot(page);
  await page.getByRole('button', { name: /retry/i }).click();
  const inside = await page.locator('#routeCheck').evaluate((node) => {
    const r = node.getBoundingClientRect();
    return r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight;
  });
  expect(inside).toBe(true);
});

test('[F2P] a route that stays clear is confirmed before the player releases it', async ({ page }) => {
  await boot(page);
  await installSingleCrate(page);
  await drawRoute(page, clearRoute);
  await expect(page.locator('#routeMessage')).toHaveText('CLEAR ROUTE');
  await expect(page.locator('#routeCheck')).toHaveAttribute('data-state', 'clear');
});

test('[F2P] a route crossing an early crate stays blocked even when its final segment is clear', async ({ page }) => {
  await boot(page);
  await installSingleCrate(page);
  await drawRoute(page, crossingRoute);
  await expect(page.locator('#routeMessage')).toHaveText('BLOCKED ROUTE');
  await expect(page.locator('#routeCheck')).toHaveAttribute('data-state', 'blocked');
});

test('[F2P] releasing a blocked route keeps the player drawing instead of starting a failed punch', async ({ page }) => {
  await boot(page);
  await installSingleCrate(page);
  await drawRoute(page, crossingRoute, true);
  await page.waitForTimeout(700);
  await expect(page.locator('#routeMessage')).toHaveText('BLOCKED ROUTE');
  await expect(page.locator('#failOverlay')).toHaveClass(/hidden/);
  await expect(page.locator('#c')).toBeVisible();
});

test('[F2P] retrying clears an earlier blocked-route warning', async ({ page }) => {
  await boot(page);
  await installSingleCrate(page);
  await drawRoute(page, endingInCrate, true);
  await expect(page.locator('#routeMessage')).toHaveText('BLOCKED ROUTE');
  await page.getByRole('button', { name: /retry/i }).click();
  await expect(page.locator('#routeMessage')).toHaveText('DRAW A ROUTE');
  await expect(page.locator('#routeCheck')).toHaveAttribute('data-state', 'idle');
});

test('[F2P] a new round clears the warning from the previous route', async ({ page }) => {
  await boot(page);
  await installSingleCrate(page);
  await drawRoute(page, endingInCrate, true);
  await expect(page.locator('#routeMessage')).toHaveText('BLOCKED ROUTE');
  await page.evaluate(() => GameState.next());
  await expect(page.locator('#routeMessage')).toHaveText('DRAW A ROUTE');
  await expect(page.locator('#routeCheck')).toHaveAttribute('data-state', 'idle');
});

test('[F2P] beginning another route replaces the previous clear result with a drawing state', async ({ page }) => {
  await boot(page);
  await installSingleCrate(page);
  await drawRoute(page, clearRoute, true);
  await expect(page.locator('#routeMessage')).toHaveText('CLEAR ROUTE');
  await page.getByRole('button', { name: /retry/i }).click();
  const box = await page.locator('#c').boundingBox();
  await page.mouse.move(box.x + 60, box.y + 120);
  await page.mouse.down();
  await expect(page.locator('#routeMessage')).toHaveText('DRAWING ROUTE');
  await expect(page.locator('#routeCheck')).toHaveAttribute('data-state', 'drawing');
  await page.mouse.up();
});
