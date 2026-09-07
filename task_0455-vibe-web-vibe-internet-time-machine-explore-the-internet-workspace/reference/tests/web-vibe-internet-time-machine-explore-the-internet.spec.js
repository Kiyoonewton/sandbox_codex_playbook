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
test('[F2P] After jumping 2000 → 2002 → 2007 and pressing the undo arrow, the page still shows 2007; the year never steps back.', async ({ page }) => {
  await boot(page);
  await page.goto(APP_URL.replace(/\/$/, '') + "/", { waitUntil: 'networkidle', timeout: 30000 });
  await page.locator(".tab-btn[data-year='2002']").first().waitFor({ timeout: 15000 });
  await page.locator(".tab-btn[data-year='2002']").first().click({ timeout: 15000 });
  await page.locator(".tab-btn[data-year='2007']").first().click({ timeout: 15000 });
  await page.locator("#undo-btn").first().click({ timeout: 15000 });
  await page.waitForTimeout(400);
  const v = (await page.locator(".hero-year").first().innerText({ timeout: 10000 })).trim();
  expect(v).toEqual("2002");
});
test('[F2P] On first load there is no welcome message anywhere on the page.', async ({ page }) => {
  await boot(page);
  await page.goto(APP_URL.replace(/\/$/, '') + "/", { waitUntil: 'networkidle', timeout: 30000 });
  await page.locator(".hero-year").first().waitFor({ timeout: 15000 });
  await page.waitForTimeout(400);
  const v = (await page.locator(".welcome-state h2").first().innerText({ timeout: 10000 })).trim();
  expect(v).toEqual("Welcome to the Internet Time Machine.");
});
