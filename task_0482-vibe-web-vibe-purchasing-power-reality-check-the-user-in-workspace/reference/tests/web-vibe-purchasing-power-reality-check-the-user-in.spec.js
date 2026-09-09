const { test, expect } = require('@playwright/test');
const APP_URL = process.env.APP_URL;

async function boot(page) {
  await page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(300);
}

async function calculate(page, { startYear = '2000', startSalary = '50000', endYear = '2024', endSalary = '75000' } = {}) {
  await page.locator('#startYear').selectOption(startYear);
  await page.locator('#startSalary').fill(startSalary);
  await page.locator('#endYear').selectOption(endYear);
  await page.locator('#endSalary').fill(endSalary);
  await page.locator('#salaryForm').evaluate(form => form.requestSubmit());
  await expect(page.locator('#resultsPanel')).toBeVisible();
}

test('[P2P] app boots and renders the calculator', async ({ page }) => {
  await boot(page);
  await expect(page.locator('#salaryForm')).toBeVisible();
  await expect(page.locator('#submitBtn')).toContainText('Run the Numbers');
});

test('[P2P] calculator fits the viewport', async ({ page }) => {
  await boot(page);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
});

test('[F2P] CPI detail is an index rather than currency', async ({ page }) => {
  await boot(page);
  await calculate(page);
  await expect(page.locator('#inflationDetail')).toHaveText('172.2 → 314.2 CPI');
});

test('[F2P] loss brief converts current pay into starting-year dollars', async ({ page }) => {
  await boot(page);
  await calculate(page);
  await expect(page.locator('#negotiationBody p').last()).toContainText('$75,000 has the purchasing power of $41,104 in 2000 dollars');
});

test('[F2P] gain brief reports the same real-dollar basis and compounded recommendation', async ({ page }) => {
  await boot(page);
  await calculate(page, { startYear: '1913', startSalary: '10000', endYear: '2024', endSalary: '500000' });
  await expect(page.locator('#negotiationBody')).toContainText('worth $15,754 in 1913 dollars');
  await expect(page.locator('#negotiationBody')).toContainText('8% raise');
});

test('[F2P] a calculation uses the values that were submitted', async ({ page }) => {
  await boot(page);
  await page.locator('#startSalary').fill('50000');
  await page.locator('#endSalary').fill('75000');
  await page.locator('#salaryForm').evaluate(form => form.requestSubmit());
  await page.locator('#startSalary').fill('60000');
  await page.locator('#endSalary').fill('100000');
  await expect(page.locator('#resultsPanel')).toBeVisible();
  await expect(page.locator('#negotiationBody')).toContainText('Your salary went from $50,000 to $75,000');
});

test('[F2P] clearing while a calculation is pending cancels it', async ({ page }) => {
  await boot(page);
  await page.locator('#startSalary').fill('50000');
  await page.locator('#endSalary').fill('75000');
  await page.locator('#salaryForm').evaluate(form => form.requestSubmit());
  await page.locator('#clearBtn').click();
  await page.waitForTimeout(650);
  await expect(page.locator('#resultsPanel')).toBeHidden();
  await expect(page.locator('#submitBtn')).toBeEnabled();
  await expect(page.locator('#formError')).not.toHaveClass(/visible/);
});

test('[F2P] the newest rapid submission is the only result committed', async ({ page }) => {
  await boot(page);
  await page.locator('#startSalary').fill('50000');
  await page.locator('#endSalary').fill('75000');
  await page.locator('#salaryForm').evaluate(form => form.requestSubmit());
  await page.locator('#startSalary').fill('60000');
  await page.locator('#endSalary').fill('100000');
  await page.locator('#salaryForm').evaluate(form => form.requestSubmit());
  await page.locator('#startSalary').fill('70000');
  await page.locator('#endSalary').fill('120000');
  await expect(page.locator('#resultsPanel')).toBeVisible();
  await expect(page.locator('#negotiationBody')).toContainText('Your salary went from $60,000 to $100,000');
});

test('[F2P] salary inputs preserve cents instead of multiplying the value', async ({ page }) => {
  await boot(page);
  await calculate(page, { startSalary: '$50,000.50', endSalary: '$75,000.75' });
  const saved = await page.evaluate(() => ({ start: currentScenario.startYrSalary, end: currentScenario.endYrSalary }));
  expect(saved).toEqual({ start: 50000.5, end: 75000.75 });
});

test('[F2P] saving the same inputs updates one scenario instead of duplicating it', async ({ page }) => {
  await boot(page);
  await calculate(page);
  await page.locator('#saveBtn').click();
  await page.locator('#saveBtn').click();
  await expect(page.locator('.scenario-card')).toHaveCount(1);
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('realityCheckScenarios')));
  expect(stored).toHaveLength(1);
});

test('[F2P] malformed and stale saved data cannot corrupt the library', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('realityCheckScenarios', JSON.stringify([
      null,
      { startYr: 2000, startYrSalary: 50000, endYr: 2024, endYrSalary: 75000, gap: 999999, timestamp: 'bad' },
      { startYr: 2030, startYrSalary: -1, endYr: 2024, endYrSalary: 0 }
    ]));
  });
  await boot(page);
  await calculate(page);
  await expect(page.locator('.scenario-card')).toHaveCount(1);
  await expect(page.locator('.scenario-verdict')).toContainText('−$16,231');
});

test('[F2P] saved scenarios and deletions synchronize between tabs', async ({ context, page }) => {
  const other = await context.newPage();
  await boot(page);
  await boot(other);
  await calculate(page);
  await calculate(other, { startSalary: '60000', endSalary: '100000' });
  await page.locator('#saveBtn').click();
  await expect(other.locator('.scenario-card')).toHaveCount(1);
  await other.locator('.delete-btn').click();
  await expect(page.locator('.scenario-card')).toHaveCount(0);
});
