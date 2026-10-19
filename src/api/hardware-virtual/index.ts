import { VirtualType } from "@Renderer/types/virtual";
import RaiseANSI from "./RaiseANSI";
import RaiseISO from "./RaiseISO";
import DefyWired from "./DefyWired";
import DefyWireless from "./DefyWireless";
import Raise2ANSI from "./Raise2ANSI";
import Raise2ISO from "./Raise2ISO";
import SonseiWireless from "./SonseiWireless";

const enumerator = [RaiseANSI, RaiseISO, DefyWireless, Raise2ANSI, Raise2ISO, SonseiWireless];

const templates = [...enumerator, DefyWired];

/**
 * A virtual keyboard file keeps the commands its template had when it was
 * created, so one saved before a feature existed (e.g. Combos) answers that
 * feature's commands with nothing, and the editors take that as "this firmware
 * does not support it". Adds whatever the board's current template has and the
 * file lacks, with the template's default values; nothing already in the file
 * is changed, and `help` lists the added commands too. The additions reach disk
 * with the next save, like any other edit. Returns the commands added.
 */
const addMissingVirtualCommands = (vk: VirtualType): string[] => {
  const info = vk?.device?.info;
  // Filled in place: this is the object the virtual Device reads and saves.
  const virtual = vk?.virtual;
  if (!virtual || !info) return [];
  const template = templates.find(
    t => t.device.info.product === info.product && t.device.info.keyboardType === info.keyboardType,
  );
  if (!template) return [];

  const added = Object.keys(template.virtual).filter(command => virtual[command] === undefined);
  added.forEach(command => {
    virtual[command] = { ...template.virtual[command] };
  });

  const { help } = virtual;
  if (added.length > 0 && help && typeof help.data === "string") {
    const listed = help.data.split(/\r?\n/);
    const missing = added.filter(command => command !== "help" && !listed.includes(command));
    if (missing.length > 0) help.data = [help.data, ...missing].join("\r\n");
  }
  return added;
};

export {
  RaiseISO,
  RaiseANSI,
  DefyWired,
  DefyWireless,
  Raise2ANSI,
  Raise2ISO,
  SonseiWireless,
  enumerator,
  addMissingVirtualCommands,
};
