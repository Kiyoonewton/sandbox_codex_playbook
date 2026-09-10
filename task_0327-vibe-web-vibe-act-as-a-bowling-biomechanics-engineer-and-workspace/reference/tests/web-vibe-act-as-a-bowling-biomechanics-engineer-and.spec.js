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
test('[F2P] The Ball Trajectory Angle readout shows the degree sign twice, e.g. "0.1° °", with a stray floating degree symbol after ', async ({ page }) => {
  await boot(page);
  await page.goto(APP_URL.replace(/\/$/, '') + "/", { waitUntil: 'networkidle', timeout: 30000 });
  await page.locator("#dpAngle").first().waitFor({ timeout: 15000 });
  await page.locator(".preset-btn[data-preset=\"single10\"]").first().click({ timeout: 15000 });
  await page.waitForTimeout(400);
  const v = (await page.locator("#dpAngle").first().innerText({ timeout: 10000 })).trim();
  expect(v).toEqual("0.1\u00b0");
});
test('[F2P] Dragging the oil slider fully to the end labeled "Heavy" makes the status readout say "WET" instead of "HEAVY".', async ({ page }) => {
  await boot(page);
  await page.goto(APP_URL.replace(/\/$/, '') + "/", { waitUntil: 'networkidle', timeout: 30000 });
  await page.locator("#oilSlider").first().waitFor({ timeout: 15000 });
  await page.locator("#oilSlider").first().fill("100", { timeout: 15000 });
  await page.waitForTimeout(400);
  const v = (await page.locator("#oilIndicator").first().innerText({ timeout: 10000 })).trim();
  expect(v).toEqual("HEAVY");
});
