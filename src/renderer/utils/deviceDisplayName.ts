/**
 * The name to show for a keyboard model, without its "wired" / "wireless"
 * suffix ("Dygma Defy wireless" -> "Dygma Defy").
 *
 * The suffix comes from the hardware definition the board matched, not from
 * how it is connected right now, so a wireless Defy plugged in by cable -- or
 * a virtual keyboard file saved from either model -- would otherwise be
 * labelled with a connection it is not using. The layout suffixes (ANSI, ISO)
 * do describe the board and are kept.
 */
const deviceDisplayName = (name?: string): string => (name ?? "").replace(/\s+(wireless|wired)\s*$/i, "").trim();

export default deviceDisplayName;
