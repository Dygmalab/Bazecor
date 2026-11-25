/**
 * Whole minutes to show for a time the keyboard stores in seconds. Any time
 * above zero counts as at least a minute: zero is how these settings say "off".
 */
const secondsToMinutes = (seconds: number): number => (seconds > 0 ? Math.max(1, Math.round(seconds / 60)) : 0);

export default secondsToMinutes;
