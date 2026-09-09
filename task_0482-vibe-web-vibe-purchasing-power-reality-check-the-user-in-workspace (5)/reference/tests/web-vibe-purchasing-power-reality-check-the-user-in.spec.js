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
test('[F2P] Under \'Total Inflation\' the detail line reads \'$172 → $314 CPI\', showing CPI index numbers as dollar amounts.', async ({ page }) => {
  await boot(page);
  await page.locator("#startSalary").first().fill("50000", { timeout: 15000 });
  await page.locator("#endSalary").first().fill("75000", { timeout: 15000 });
  await page.locator("#submitBtn").first().click({ timeout: 15000 });
  await page.locator("#inflationDetail").first().waitFor({ timeout: 15000 });
  await page.waitForTimeout(400);
  const v = (await page.locator("#inflationDetail").first().innerText({ timeout: 10000 })).trim();
  expect(v).toEqual("172.2 \u2192 314.2 CPI");
});
test('[F2P] The negotiation brief claims a $75,000 salary \'has the purchasing power of $50,000 in 2000 dollars\', which is just the', async ({ page }) => {
  await boot(page);
  await page.locator("#startSalary").first().fill("50000", { timeout: 15000 });
  await page.locator("#endSalary").first().fill("75000", { timeout: 15000 });
  await page.locator("#submitBtn").first().click({ timeout: 15000 });
  await page.locator("#negotiationBody").first().waitFor({ timeout: 15000 });
  await page.waitForTimeout(400);
  const v = (await page.locator("#negotiationBody p:nth-of-type(4)").first().innerText({ timeout: 10000 })).trim();
  expect(v).toEqual("The Line: \"Over 24 years, inflation has increased costs by 82.5%. My current salary of $75,000 has the purchasing power of $41,104 in 2000 dollars \u2014 that's effectively a 17.8% pay cut. I'd like to discuss bringing my compensation in line with the actual cost of living.\"");
});
