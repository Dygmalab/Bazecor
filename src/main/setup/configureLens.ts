import { migrateLegacyLens } from "../../lens/main/migrate-legacy-lens";
import { registerLensIpc } from "../../lens/main/lens-ipc";
import { getLensSettings } from "../../lens/main/lens-settings";
import { overlayController } from "../../lens/main/overlay-controller";
import { applyRunInBackground } from "./configureTray";

/**
 * Boots the Lens overlay subsystem. Must run once from app "ready" — NOT from
 * createWindow(), which re-runs on macOS activate.
 */
const configureLens = () => {
  migrateLegacyLens();
  registerLensIpc(v => applyRunInBackground(v));
  if (getLensSettings().enabled) overlayController.enable();
};

export default configureLens;
