/* eslint-disable no-bitwise */
import React, { useState, useEffect } from "react";
import log from "electron-log/renderer";
import { AnimatePresence, motion } from "framer-motion";
import { KeyType } from "@Renderer/types/layout";
import OSKey from "../KeyTags/OSKey";

interface ListModifiersProps {
  keyCode: number;
  size?: "xs" | "sm" | "md";
  selectedKey: KeyType;
}
type Modifier = number;

const ListModifiersKey = ({ keyCode, size = "xs", selectedKey }: ListModifiersProps) => {
  const [modifiersState, setModifiersState] = useState({ isMeh: false, isHyper: false, altVisual: false });

  // Define a type for modifiers
  const parseModifs = (keycode: number): Modifier[] => {
    const modifs: Modifier[] = [];

    if (keycode & 0b100000000) {
      // Ctrl Decoder
      modifs.push(1);
    }
    if (keycode & 0b1000000000) {
      // Alt Decoder
      modifs.push(2);
    }
    if (keycode & 0b10000000000) {
      // AltGr Decoder
      modifs.push(3);
    }
    if (keycode & 0b100000000000) {
      // Shift Decoder
      modifs.push(0);
    }
    if (keycode & 0b1000000000000) {
      // Win Decoder
      modifs.push(4);
    }
    return modifs;
  };

  const [modifiers, setModifiers] = useState(parseModifs(keyCode));

  useEffect(() => {
    if (keyCode >= 256 && keyCode < 8192) {
      log.info("New Data: ", selectedKey);
      const mods = parseModifs(keyCode);
      setModifiers(mods);
      const altVisual = selectedKey.alt;
      const isHyper = [0, 1, 2, 4].every(mod => mods.includes(mod));
      const isMeh = [0, 1, 2].every(mod => mods.includes(mod)) && !mods.includes(4);
      setModifiersState({ isMeh, isHyper, altVisual });
    }
  }, [keyCode, selectedKey]);

  if (keyCode >= 8192 || keyCode < 256) return null;
  return (
    <div xmlns="http://www.w3.org/1999/xhtml" className="keyContentModifiers">
      <ul
        className={`flex flex-wrap gap-[1px] list-none absolute mr-[-1px] leading-none ${
          (modifiers.includes(2) === true &&
            modifiers.includes(3) === true &&
            modifiers.includes(4) === true &&
            modifiers.includes(0) === true) ||
          (modifiers.includes(1) === true &&
            modifiers.includes(3) === true &&
            modifiers.includes(4) === true &&
            modifiers.includes(0) === true) ||
          (modifiers.includes(1) === true &&
            modifiers.includes(2) === true &&
            modifiers.includes(3) === true &&
            modifiers.includes(4) === true)
            ? "ml-[1px] bottom-[2px]"
            : "ml-[6px] bottom-[6px]"
        }`}
      >
        {/* <ul
        className={flex flex-wrap gap-[1px] list-none absolute mr-[-1px] ${
          (altApplied && altGrApplied && osApplied && shiftApplied) ||
          (ctrlApplied && altGrApplied && osApplied && shiftApplied) ||
          (ctrlApplied && altApplied && altGrApplied && osApplied)
            ? "ml-[1px] bottom-[2px]"
            : "ml-[6px] bottom-[6px]"
        }}
      > */}
        {modifiersState.isMeh ? (
          <AnimatePresence mode="popLayout">
            <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
              <li className="inline-flex items-center h-[12px] font-semibold tracking-tight leading-3 py-0 px-[3px] m-0 text-[10px] text-gray-25 dark:text-gray-600 bg-gray-600/60 dark:bg-gray-25/60 shadow-sm rounded-[3px] [&_>div]:!h-[12px] [&_>div]:!inline-table">
                Meh
              </li>
            </motion.div>
          </AnimatePresence>
        ) : (
          ""
        )}
        {modifiersState.isHyper ? (
          <AnimatePresence mode="popLayout">
            <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
              <li className="inline-flex items-center h-[12px] font-semibold tracking-tight leading-3 py-0 px-[3px] m-0 text-[10px] text-gray-25 dark:text-gray-600 bg-gray-600/60 dark:bg-gray-25/60 shadow-sm rounded-[3px] [&_>div]:!h-[12px] [&_>div]:!inline-table">
                Hyper
              </li>
            </motion.div>
          </AnimatePresence>
        ) : (
          ""
        )}
        {modifiers.includes(2) === true && !modifiersState.isMeh && !modifiersState.isHyper ? (
          <AnimatePresence mode="popLayout">
            <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
              <li className="inline-flex items-center h-[12px] font-semibold tracking-tight leading-3 py-0 px-[3px] m-0 text-[10px] text-gray-25 dark:text-gray-600 bg-gray-600/60 dark:bg-gray-25/60 shadow-sm rounded-[3px] [&_>div]:!h-[12px] [&_>div]:!inline-table ">
                <OSKey renderKey="alt" size={size} />
              </li>
            </motion.div>
          </AnimatePresence>
        ) : (
          ""
        )}
        {typeof keyCode === "number" ? (
          <>
            {modifiers.includes(3) === true && (!modifiersState.altVisual || modifiers.length > 1) ? (
              <AnimatePresence mode="popLayout">
                <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
                  <li className="inline-flex items-center h-[12px] font-semibold tracking-tight leading-3 py-0 px-[3px] m-0 text-[10px] text-gray-25 dark:text-gray-600 bg-gray-600/60 dark:bg-gray-25/60 shadow-sm rounded-[3px] [&_>div]:!h-[12px] [&_>div]:!inline-table">
                    <OSKey renderKey="altGr" size={size} />
                  </li>
                </motion.div>
              </AnimatePresence>
            ) : (
              ""
            )}
            {modifiers.includes(1) === true && !modifiersState.isMeh && !modifiersState.isHyper ? (
              <AnimatePresence mode="popLayout">
                <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
                  <li className="inline-flex items-center h-[12px] font-semibold tracking-tight leading-3 py-0 px-[3px] m-0 text-[10px] text-gray-25 dark:text-gray-600 bg-gray-600/60 dark:bg-gray-25/60 shadow-sm rounded-[3px] [&_>div]:!h-[12px] [&_>div]:!inline-table">
                    <OSKey renderKey="control" size={size} />
                  </li>
                </motion.div>
              </AnimatePresence>
            ) : (
              ""
            )}
            {modifiers.includes(0) === true &&
            !modifiersState.isMeh &&
            !modifiersState.isHyper &&
            (!modifiersState.altVisual || modifiers.length > 1) ? (
              <AnimatePresence mode="popLayout">
                <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
                  <li className="inline-flex items-center h-[12px] font-semibold tracking-tight leading-3 py-0 px-[3px] m-0 text-[10px] text-gray-25 dark:text-gray-600 bg-gray-600/60 dark:bg-gray-25/60 shadow-sm rounded-[3px] [&_>div]:!h-[12px] [&_>div]:!inline-table">
                    <OSKey renderKey="shift" size={size} />
                  </li>
                </motion.div>
              </AnimatePresence>
            ) : (
              ""
            )}
            {modifiers.includes(4) === true && !modifiersState.isMeh && !modifiersState.isHyper ? (
              <AnimatePresence mode="popLayout">
                <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
                  <li className="badge-modifier os inline-flex items-center h-[12px] font-semibold tracking-tight leading-3 py-0 px-[3px] m-0 text-[10px] text-gray-25 dark:text-gray-600 bg-gray-600/60 dark:bg-gray-25/60 shadow-sm rounded-[3px] [&_>div]:!h-[12px] [&_>div]:!inline-table">
                    <OSKey renderKey="os" size={size} />
                  </li>
                </motion.div>
              </AnimatePresence>
            ) : (
              ""
            )}
          </>
        ) : (
          ""
        )}
      </ul>
    </div>
  );
};

export default ListModifiersKey;
