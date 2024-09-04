/* eslint-disable no-bitwise */
import React, { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { KeymapDB } from "../../../../api/keymap";
import OSKey from "../KeyTags/OSKey";

interface ListModifiersProps {
  keyCode: number;
  size?: "xs" | "sm" | "md";
}
type Modifier = number;

const ListModifiersKey = ({ keyCode, size = "xs" }: ListModifiersProps) => {
  const [modifiersState, setModifiersState] = useState({ isMeh: false, isHyper: false });
  const [db] = useState(new KeymapDB());
  // const [isMeh, setIsMeh] = useState(false);
  // const [isHyper, setIsHyper] = useState(false);

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

  const modifiers = useMemo(() => parseModifs(keyCode), [keyCode]);

  useEffect(() => {
    const isHyper = [0, 1, 2, 4].every(mod => modifiers.includes(mod));
    const isMeh = [0, 1, 2].every(mod => modifiers.includes(mod)) && !modifiers.includes(4);
    setModifiersState({ isMeh, isHyper });
  }, [modifiers]);

  const altVisual = db.parse(keyCode).label !== db.parse(keyCode & 0b11111111).label;

  if (keyCode >= 8192) return null;
  return (
    <div xmlns="http://www.w3.org/1999/xhtml" className="keyContentModifiers">
      <ul
        className={`flex flex-wrap gap-[1px] list-none absolute mr-[-1px] leading-none ${
          (parseModifs(keyCode).includes(2) === true &&
            parseModifs(keyCode).includes(3) === true &&
            parseModifs(keyCode).includes(4) === true &&
            parseModifs(keyCode).includes(0) === true) ||
          (parseModifs(keyCode).includes(1) === true &&
            parseModifs(keyCode).includes(3) === true &&
            parseModifs(keyCode).includes(4) === true &&
            parseModifs(keyCode).includes(0) === true) ||
          (parseModifs(keyCode).includes(1) === true &&
            parseModifs(keyCode).includes(2) === true &&
            parseModifs(keyCode).includes(3) === true &&
            parseModifs(keyCode).includes(4) === true)
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
        {parseModifs(keyCode).includes(2) === true && !modifiersState.isMeh && !modifiersState.isHyper ? (
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
            {parseModifs(keyCode).includes(3) === true && (!altVisual || parseModifs(keyCode).length > 1) ? (
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
            {parseModifs(keyCode).includes(1) === true && !modifiersState.isMeh && !modifiersState.isHyper ? (
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
            {parseModifs(keyCode).includes(0) === true &&
            !modifiersState.isMeh &&
            !modifiersState.isHyper &&
            (!altVisual || parseModifs(keyCode).length > 1) ? (
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
            {parseModifs(keyCode).includes(4) === true && !modifiersState.isMeh && !modifiersState.isHyper ? (
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
