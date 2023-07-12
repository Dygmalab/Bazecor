import { _electron as electron, ElectronApplication, test, Page } from "@playwright/test";
import { findLatestBuild, parseElectronApp, clickMenuItemById } from "electron-playwright-helpers";

let electronApp: ElectronApplication;
let page: Page;

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
  await page.screenshot({ path: "landing.png" });
});

test.afterAll(async () => {
  await electronApp.close();
});
