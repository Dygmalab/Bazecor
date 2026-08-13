let quitting = false;

/**
 * True once the app is actually quitting (user quit, tray Quit, updater
 * install), so window close handlers stop hiding-to-tray and let windows close.
 */
export function isAppQuitting(): boolean {
  return quitting;
}

export function markAppQuitting(): void {
  quitting = true;
}
