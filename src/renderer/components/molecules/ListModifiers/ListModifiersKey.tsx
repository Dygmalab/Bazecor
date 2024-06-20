import React from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ListModifiersKeyProps {
  altApplied: boolean;
  altGrApplied: boolean;
  osApplied: boolean;
  shiftApplied: boolean;
  ctrlApplied: boolean;
  mehApplied: boolean;
  hyperApplied: boolean;
}
const ListModifiersKey = ({
  altApplied,
  altGrApplied,
  osApplied,
  shiftApplied,
  ctrlApplied,
  mehApplied,
  hyperApplied,
}: ListModifiersKeyProps) => (
  // console.log("test");
  <div xmlns="http://www.w3.org/1999/xhtml" className="keyContentModifiers">
    <ul
      className={`flex flex-wrap gap-[1px] list-none absolute mr-[-1px] ${
        (altApplied && altGrApplied && osApplied && shiftApplied) ||
        (ctrlApplied && altGrApplied && osApplied && shiftApplied) ||
        (ctrlApplied && altApplied && altGrApplied && osApplied)
          ? "ml-[1px] bottom-[2px]"
          : "ml-[6px] bottom-[6px]"
      }`}
    >
      {mehApplied ? (
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
      {hyperApplied ? (
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
      {altApplied ? (
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
      {altGrApplied ? (
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
      {ctrlApplied ? (
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
      {shiftApplied ? (
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
      {osApplied ? (
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
    </ul>
  </div>
);
export default ListModifiersKey;
