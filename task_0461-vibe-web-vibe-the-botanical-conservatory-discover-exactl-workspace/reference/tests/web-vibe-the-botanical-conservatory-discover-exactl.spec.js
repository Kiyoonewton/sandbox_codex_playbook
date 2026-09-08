const { test, expect } = require('@playwright/test');
const APP_URL = process.env.APP_URL;
async function boot(page) {
  await page.goto(APP_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(600);
}
test('[P2P] app boots and renders content', async ({ page }) => {
  await boot(page);
  const has = await page.evaluate(() => !!document.body && document.body.children.length > 0);
  expect(has).toBe(true);
});
test('[P2P] no layout overflow (UI fits the viewport)', async ({ page }) => {
  await boot(page);
  const o = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(o).toBeLessThanOrEqual(2);
});
test('[F2P] Opening a plant\'s detail panel shows care information spilling past the edge of the panel.', async ({ page }) => {
  await boot(page);
  await page.locator(".plant-card").first().waitFor({ timeout: 15000 });
  await page.locator(".plant-card").first().click({ timeout: 15000 });
  await page.locator("#detail-content").first().waitFor({ timeout: 15000 });
  await page.waitForTimeout(400);
  const v = await page.evaluate((a) => {
    const el = document.querySelector(a.sel); if (!el) return 'MISSING';
    const c = a.cont ? document.querySelector(a.cont) : document.documentElement;
    if (!c) return 'NOCONTAINER';
    const r = el.getBoundingClientRect(), cr = c.getBoundingClientRect();
    return (r.left>=cr.left-1 && r.right<=cr.right+1 && r.top>=cr.top-1 && r.bottom<=cr.bottom+1 && r.width>0 && r.height>0) ? 'OK' : 'CLIPPED';
  }, { sel: "#detail-content", cont: "#detail-panel" });
  expect(v).toEqual('OK');
});
