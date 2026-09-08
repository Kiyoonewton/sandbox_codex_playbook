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
test('[F2P] After the app refuses a 5th university, pressing Undo shows an \'Undo\' toast but the comparison still shows 4 universit', async ({ page }) => {
  await boot(page);
  await page.goto(APP_URL.replace(/\/$/, '') + "/", { waitUntil: 'networkidle', timeout: 30000 });
  await page.locator(".uni-item[data-uni-id=\"mit\"]").first().waitFor({ timeout: 15000 });
  await page.locator(".uni-item[data-uni-id=\"mit\"]").first().click({ timeout: 15000 });
  await page.locator(".uni-item[data-uni-id=\"stanford\"]").first().click({ timeout: 15000 });
  await page.locator(".uni-item[data-uni-id=\"harvard\"]").first().click({ timeout: 15000 });
  await page.locator(".uni-item[data-uni-id=\"yale\"]").first().click({ timeout: 15000 });
  await page.locator(".uni-item[data-uni-id=\"columbia\"]").first().click({ timeout: 15000 });
  await page.locator("#btn-undo").first().click({ timeout: 15000 });
  await page.waitForTimeout(400);
  const v = (await page.locator("#comparison-count").first().innerText({ timeout: 10000 })).trim();
  expect(v).toEqual("3");
});
test('[F2P] Clicking Reset with only preset universities selected pops a toast claiming all custom schools were removed, which never', async ({ page }) => {
  await boot(page);
  await page.goto(APP_URL.replace(/\/$/, '') + "/", { waitUntil: 'networkidle', timeout: 30000 });
  await page.locator(".uni-item[data-uni-id=\"mit\"]").first().waitFor({ timeout: 15000 });
  await page.locator(".uni-item[data-uni-id=\"mit\"]").first().click({ timeout: 15000 });
  await page.locator("#btn-reset").first().click({ timeout: 15000 });
  await page.locator("#toast-container .toast").first().waitFor({ timeout: 15000 });
  await page.waitForTimeout(400);
  const v = (await page.locator("#toast-container .toast:last-child").first().innerText({ timeout: 10000 })).trim();
  expect(v).toEqual("Comparison reset");
});
