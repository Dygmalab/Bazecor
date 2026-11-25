/* Superkey action slots, by index: 0 = Tap, 1 = Hold, 2 = Tap & hold, 3 = 2Tap, 4 = 2Tap & hold. */
const SUPERKEY_HOLD_SLOTS = [1, 2, 4];

/** Highest layer a superkey's hold action can use until the firmware handles layers 9 and 10 there. */
export const SUPERKEY_HOLD_MAX_LAYER = 8;

/**
 * Whether the key being picked is limited to layers 1-8 because it goes in a
 * hold slot of a superkey. Tap slots, and every key outside a superkey, keep
 * all ten layers.
 */
const isSuperkeyHoldLimited = (activeTab?: string, action?: number): boolean =>
  activeTab === "super" && SUPERKEY_HOLD_SLOTS.includes(action);

export default isSuperkeyHoldLimited;
