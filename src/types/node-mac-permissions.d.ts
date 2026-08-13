// Minimal ambient types for the darwin-only optional dependency
// node-mac-permissions (not installed on Windows/Linux dev machines).
declare module "node-mac-permissions" {
  export type AuthStatus = "not determined" | "denied" | "authorized" | "restricted";

  export function getAuthStatus(type: string): AuthStatus;

  export function askForInputMonitoringAccess(type?: "listen" | "post"): Promise<"authorized" | "denied">;
}
