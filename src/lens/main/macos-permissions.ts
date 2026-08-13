import log from "electron-log/main";

/**
 * Thin wrapper around the darwin-only optional dependency node-mac-permissions.
 * It talks to TCC directly (IOHIDCheckAccess / IOHIDRequestAccess), which is the
 * reliable way to know whether Bazecor may open the keyboard's raw HID interface:
 * inferring it from a failed device open misses the case where the keyboard is
 * unplugged, and a failed open does not always register the app in the System
 * Settings → Input Monitoring list, while IOHIDRequestAccess always does.
 */

export type InputMonitoringStatus = "authorized" | "denied" | "not determined" | "restricted" | "unavailable";

type NodeMacPermissions = typeof import("node-mac-permissions");

let cached: NodeMacPermissions | null | undefined;

async function loadModule(): Promise<NodeMacPermissions | null> {
  if (process.platform !== "darwin") return null;
  if (cached !== undefined) return cached;
  try {
    cached = await import("node-mac-permissions");
  } catch (err) {
    log.warn("[Lens] node-mac-permissions not available:", err);
    cached = null;
  }
  return cached;
}

export async function getInputMonitoringStatus(): Promise<InputMonitoringStatus> {
  const perms = await loadModule();
  if (!perms) return "unavailable";
  try {
    return perms.getAuthStatus("input-monitoring");
  } catch (err) {
    log.warn("[Lens] getAuthStatus(input-monitoring) failed:", err);
    return "unavailable";
  }
}

/**
 * Triggers IOHIDRequestAccess: when the status is "not determined" macOS shows
 * its own prompt AND adds Bazecor to the Input Monitoring list; when already
 * denied it resolves silently (the user must flip the toggle manually).
 */
export async function requestInputMonitoringAccess(): Promise<InputMonitoringStatus> {
  const perms = await loadModule();
  if (!perms) return "unavailable";
  try {
    const result = await Promise.resolve(perms.askForInputMonitoringAccess());
    return result === "authorized" ? "authorized" : "denied";
  } catch (err) {
    log.warn("[Lens] askForInputMonitoringAccess failed:", err);
    return "unavailable";
  }
}
