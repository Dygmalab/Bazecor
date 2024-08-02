import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ListModifiersProps {
  keyCode: number;
  size?: "xs" | "sm" | "md";
}
type Modifier = 0 | 1 | 2 | 3 | 4;

const ListModifiersKey = ({ keyCode, size = "xs" }: ListModifiersProps) => {
  const [isMeh, setIsMeh] = useState(false);
  const [isHyper, setIsHyper] = useState(false);

  // Define a type for modifiers
  const parseModifs = (keycode: number): Modifier[] => {
    const modifs: Modifier[] = [];

    // eslint-disable-next-line
    if (keycode & 0b100000000) {
      // Ctrl Decoder
      modifs.push(1);
    }
    // eslint-disable-next-line
    if (keycode & 0b1000000000) {
      // Alt Decoder
      modifs.push(2);
    }
    // eslint-disable-next-line
    if (keycode & 0b10000000000) {
      // AltGr Decoder
      modifs.push(3);
    }
    // eslint-disable-next-line
    if (keycode & 0b100000000000) {
      // Shift Decoder
      modifs.push(0);
    }
    // eslint-disable-next-line
    if (keycode & 0b1000000000000) {
      // Win Decoder
      modifs.push(4);
    }
    return modifs;
  };

  useEffect(() => {
    if (
      parseModifs(keyCode).includes(0) === true &&
      parseModifs(keyCode).includes(1) === true &&
      parseModifs(keyCode).includes(2) === true &&
      parseModifs(keyCode).includes(4) === true
    ) {
      setIsHyper(true);
    } else {
      setIsHyper(false);
    }
    if (
      parseModifs(keyCode).includes(0) === true &&
      parseModifs(keyCode).includes(1) === true &&
      parseModifs(keyCode).includes(2) === true &&
      parseModifs(keyCode).includes(4) === false
    ) {
      setIsMeh(true);
    } else {
      setIsMeh(false);
    }
  }, [keyCode]);

  if (keyCode >= 8192) return null;
  return (
    <div xmlns="http://www.w3.org/1999/xhtml" className="keyContentModifiers">
      <ul
        className={`flex flex-wrap gap-[1px] list-none absolute mr-[-1px] ${
          true ? "ml-[1px] bottom-[2px]" : "ml-[6px] bottom-[6px]"
        }`}
      >
        {/* <ul
        className={`flex flex-wrap gap-[1px] list-none absolute mr-[-1px] ${
          (altApplied && altGrApplied && osApplied && shiftApplied) ||
          (ctrlApplied && altGrApplied && osApplied && shiftApplied) ||
          (ctrlApplied && altApplied && altGrApplied && osApplied)
            ? "ml-[1px] bottom-[2px]"
            : "ml-[6px] bottom-[6px]"
        }`}
      > */}
        {isMeh ? (
          <AnimatePresence mode="popLayout">
            <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
              <li className="inline-block font-semibold tracking-tight leading-4 py-0 px-[3px] m-0 text-[10px] text-gray-25 dark:text-gray-600 bg-gray-600/60 dark:bg-gray-25/60 shadow-sm rounded-[3px]">
                Meh
              </li>
            </motion.div>
          </AnimatePresence>
        ) : (
          ""
        )}
        {isHyper ? (
          <AnimatePresence mode="popLayout">
            <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
              <li className="inline-block font-semibold tracking-tight leading-4 py-0 px-[3px] m-0 text-[10px] text-gray-25 dark:text-gray-600 bg-gray-600/60 dark:bg-gray-25/60 shadow-sm rounded-[3px]">
                Hyper
              </li>
            </motion.div>
          </AnimatePresence>
        ) : (
          ""
        )}
        {parseModifs(keyCode).includes(2) === true && !isMeh && !isHyper ? (
          <AnimatePresence mode="popLayout">
            <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
              <li className="inline-block font-semibold tracking-tight leading-4 py-0 px-[3px] m-0 text-[10px] text-gray-25 dark:text-gray-600 bg-gray-600/60 dark:bg-gray-25/60 shadow-sm rounded-[3px]">
                a
              </li>
            </motion.div>
          </AnimatePresence>
        ) : (
          ""
        )}
        {typeof keyCode === "number" ? (
          <>
            {parseModifs(keyCode).includes(3) === true ? (
              <AnimatePresence mode="popLayout">
                <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
                  <li className="inline-block font-semibold tracking-tight leading-4 py-0 px-[3px] m-0 text-[10px] text-gray-25 dark:text-gray-600 bg-gray-600/60 dark:bg-gray-25/60 shadow-sm rounded-[3px]">
                    ag
                  </li>
                </motion.div>
              </AnimatePresence>
            ) : (
              ""
            )}
            {parseModifs(keyCode).includes(1) === true && !isMeh && !isHyper ? (
              <AnimatePresence mode="popLayout">
                <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
                  <li className="inline-block font-semibold tracking-tight leading-4 py-0 px-[3px] m-0 text-[10px] text-gray-25 dark:text-gray-600 bg-gray-600/60 dark:bg-gray-25/60 shadow-sm rounded-[3px]">
                    c
                  </li>
                </motion.div>
              </AnimatePresence>
            ) : (
              ""
            )}
            {parseModifs(keyCode).includes(0) === true && !isMeh && !isHyper ? (
              <AnimatePresence mode="popLayout">
                <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
                  <li className="inline-block font-semibold tracking-tight leading-4 py-0 px-[3px] m-0 text-[10px] text-gray-25 dark:text-gray-600 bg-gray-600/60 dark:bg-gray-25/60 shadow-sm rounded-[3px]">
                    s
                  </li>
                </motion.div>
              </AnimatePresence>
            ) : (
              ""
            )}
            {parseModifs(keyCode).includes(4) === true && !isMeh && !isHyper ? (
              <AnimatePresence mode="popLayout">
                <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
                  <li className="badge-modifier os inline-block font-semibold tracking-tight leading-4 py-0 px-[3px] m-0 text-[10px] text-gray-25 dark:text-gray-600 bg-gray-600/60 dark:bg-gray-25/60 shadow-sm rounded-[3px]">
                    os
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
