const { test, expect } = require("@playwright/test");
const APP_URL = process.env.APP_URL;
async function boot(page) {
  await page.goto(APP_URL, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(600);
}
test("[P2P] app boots and renders content", async ({ page }) => {
  await boot(page);
  const has = await page.evaluate(
    () => !!document.body && document.body.children.length > 0,
  );
  expect(has).toBe(true);
});
test("[P2P] no layout overflow (UI fits the viewport)", async ({ page }) => {
  await boot(page);
  const o = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(o).toBeLessThanOrEqual(2);
});
test("[F2P] On the empty start screen, clicking the Fit button makes the Zoom readout jump to 30% even though no preview is loaded a", async ({
  page,
}) => {
  await boot(page);
  await page.locator("#btnZoom").first().click({ timeout: 15000 });
  await page.waitForTimeout(400);
  const v = (
    await page.locator("#zoomValue").first().innerText({ timeout: 10000 })
  ).trim();
  expect(v).toEqual("100%");
});
test("[F2P] Empty preview keeps its zoom unchanged when using the zoom controls", async ({
  page,
}) => {
  await boot(page);
  const zoom = page.locator("#zoomValue").first();
  await page.locator("#zoomIn").click();
  expect((await zoom.innerText()).trim()).toBe("100%");
  await page.locator("#zoomOut").click();
  expect((await zoom.innerText()).trim()).toBe("100%");
});
test("[F2P] Loading a URL after changing zoom on an empty screen restores the default zoom", async ({
  page,
}) => {
  await boot(page);

  await page.locator("#zoomIn").click();
  await page.locator("#urlInput").fill("https://example.com");
  await page.locator("#urlSubmit").click();

  await page.waitForTimeout(1000);

  const v = (await page.locator("#zoomValue").innerText()).trim();
  expect(v).toBe("100%");
});
test("[F2P] Empty-screen breakpoint toggle updates the status viewport count", async ({
  page,
}) => {
  await boot(page);

  const count = page.locator("#statusViewports");
  expect((await count.innerText()).trim()).toBe("7");
  await page.locator("#breakpointList .bp-item").first().click();
  expect((await count.innerText()).trim()).toBe("6");
});
test("[F2P] Empty-screen custom breakpoint persists in the visible configuration after reload", async ({
  page,
}) => {
  await boot(page);

  await page.locator("#addBpBtn").click();
  await page.locator("#modalInput").fill("1600");
  await page.locator("#modalConfirm").click();
  await expect(page.locator("#breakpointList .bp-item").filter({ hasText: "1600" })).toHaveCount(1);

  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  await expect(page.locator("#breakpointList .bp-item").filter({ hasText: "1600" })).toHaveCount(1);
  expect((await page.locator("#statusViewports").innerText()).trim()).toBe("8");
});
test("[F2P] Undoing a URL load clears the status URL with the preview", async ({
  page,
}) => {
  await boot(page);

  await page.locator("#urlInput").fill("https://example.com");
  await page.locator("#urlSubmit").click();
  await expect(page.locator("#statusUrl .status-value")).toHaveText("example.com");

  await page.keyboard.press("Control+z");

  await expect(page.locator("#emptyState")).toBeVisible();
  await expect(page.locator("#viewportGrid .viewport-card")).toHaveCount(0);
  await expect(page.locator("#statusUrl .status-value")).toHaveText("-");
});
