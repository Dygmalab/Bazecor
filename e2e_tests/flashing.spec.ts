import { _electron as electron, ElectronApplication, test, Page, expect } from "@playwright/test";
import { findLatestBuild, parseElectronApp } from "electron-playwright-helpers";

// this test does not work yet because we need to do something in firmware to avoid having to hold ESC key
test.describe("Testing Bazecor E2E", async () => {
  let electronApp: ElectronApplication;
  let page: Page;
  const outputFolder = "test-results";

  test.beforeAll(async () => {
    const latestBuild = findLatestBuild();
    const appInfo = parseElectronApp(latestBuild);

    electronApp = await electron.launch({
      args: [appInfo.main],
      executablePath: appInfo.executable,
    });

    electronApp.on("window", async initialPage => {
      const filename = initialPage.url()?.split("/").pop();
      console.log(`Window opened: ${filename}`);

      initialPage.on("pageerror", error => {
        console.error(error);
      });

      initialPage.on("console", msg => {
        console.log(msg.text());
      });
    });
  });

  test("renders landing page", async () => {
    page = await electronApp.firstWindow();
    await page.screenshot({ path: `${outputFolder}/landing.png` });
  });

  test("flashing keyboard", async () => {
    page = await electronApp.firstWindow();
    const connectButton = page.getByRole("button", { name: "Connect" });

    expect(connectButton).not.toBe(undefined);
    if (connectButton) {
      console.log(connectButton);
      await connectButton.click();
      await page.screenshot({ path: `${outputFolder}/connected.png` });
    }

    const firmwareMenuButton = page.getByRole("link", { name: "Firmware Update" });
    expect(firmwareMenuButton).not.toBe(undefined);
    if (firmwareMenuButton) {
      console.log(firmwareMenuButton);
      await firmwareMenuButton.click();
      await page.screenshot({ path: `${outputFolder}/firmwareUpdateSection.png` });
    }

    const updateButton = page.getByRole("button", { name: "Update now" });
    expect(updateButton).not.toBe(undefined);
    if (updateButton) {
      console.log(updateButton);
      await updateButton.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${outputFolder}/updateStart.png` });
    }

    // we start flashing procedure
    await page.waitForSelector("text=/Press and hold/");
    await page.keyboard.down("Escape");
    await page.waitForSelector("text=/Updating/");
    await page.keyboard.up("Escape");
    await page.screenshot({ path: `${outputFolder}/flashing.png` });
    await page.waitForSelector("text=/Firmware update!/");
    await page.screenshot({ path: `${outputFolder}/flashCompleted.png` });
  });

  test.afterAll(async () => {
    await electronApp.close();
  });
});
