import {
  COMBO_FLAG_ENABLED,
  COMBO_POSITION_UNUSED,
  DEFAULT_COMBO_IDLE_TIME,
  DEFAULT_COMBO_WINDOW,
  MAX_COMBO_MEMBERS,
  MAX_COMBOS,
} from "@Renderer/types/combos";
import { VirtualType } from "@Renderer/types/virtual";

/* Commands of the features the current Defy, Sonsei and Raise 2 firmware has
 * and the Raise 1 does not, with the values a freshly flashed keyboard replies
 * with (checked against real backups). A virtual keyboard must answer them the
 * same way, or the editors take the empty reply as "this firmware does not
 * support it". */

/* An empty record, exactly as a keyboard with Combos reports one: no keys,
 * layer 0, enabled flag, no action. */
const EMPTY_COMBO = [...new Array<number>(MAX_COMBO_MEMBERS).fill(COMBO_POSITION_UNUSED), 0, COMBO_FLAG_ENABLED, 0];

const setting = (data: string) => ({ data, eraseable: true });

export const virtualFeatures: VirtualType["virtual"] = {
  // Combos: none yet, default match window and idle time.
  "combos.map": setting([0, ...Array.from({ length: MAX_COMBOS }, () => EMPTY_COMBO).flat()].join(" ")),
  "combos.window": setting(String(DEFAULT_COMBO_WINDOW)),
  "combos.idleTime": setting(String(DEFAULT_COMBO_IDLE_TIME)),
  // Autoshift: on, 175 ms hold.
  "autoshift.enabled": setting("1"),
  "autoshift.timeout": setting("175"),
  // CapsWord: on, 5 s idle timeout, firmware's default continuation set.
  "capsword.enabled": setting("1"),
  "capsword.timeout": setting("5000"),
  "capsword.continuation": setting("7"),
};
