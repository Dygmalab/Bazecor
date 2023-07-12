import { _electron as electron, test } from "@playwright/test";

test("save screenshot", async () => {
  const electronApp = await electron.launch({ args: [".webpack/main/index.js"], timeout: 300000 });
  const window = await electronApp.firstWindow();
  await window.screenshot({ path: "landing.png" });
  await electronApp.close();
});
