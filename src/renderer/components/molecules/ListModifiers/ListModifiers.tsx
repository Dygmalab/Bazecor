// -*- mode: js-jsx -*-
/* Bazecor
 * Copyright (C) 2024  Dygmalab, Inc.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import React, { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LabelModifier from "../../atoms/LabelModifier";

interface ListModifiersProps {
  keyCode: number;
  size?: "xs" | "sm" | "md";
}
type Modifier = number;

const ListModifier = ({ keyCode, size = "md" }: ListModifiersProps) => {
  const [modifiersState, setModifiersState] = useState({ isMeh: false, isHyper: false });

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

  const modifiers = useMemo(() => parseModifs(keyCode), [keyCode]);

  useEffect(() => {
    const isHyper = [0, 1, 2, 4].every(mod => modifiers.includes(mod));
    const isMeh = [0, 1, 2].every(mod => modifiers.includes(mod)) && !modifiers.includes(4);
    setModifiersState({ isMeh, isHyper });
  }, [modifiers]);

  // useEffect(() => {
  //   if (
  //     parseModifs(keyCode).includes(0) === true &&
  //     parseModifs(keyCode).includes(1) === true &&
  //     parseModifs(keyCode).includes(2) === true &&
  //     parseModifs(keyCode).includes(4) === true
  //   ) {
  //     setIsHyper(true);
  //   } else {
  //     setIsHyper(false);
  //   }
  //   if (
  //     parseModifs(keyCode).includes(0) === true &&
  //     parseModifs(keyCode).includes(1) === true &&
  //     parseModifs(keyCode).includes(2) === true &&
  //     parseModifs(keyCode).includes(4) === false
  //   ) {
  //     setIsMeh(true);
  //   } else {
  //     setIsMeh(false);
  //   }
  // }, [keyCode]);

  if (keyCode >= 8192) return null;
  return (
    <div className="listModifiersTags flex flex-wrap my-0 gap-0.5">
      {modifiersState.isHyper ? (
        <AnimatePresence mode="popLayout">
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
            <LabelModifier label="Hyper" size={size} />
          </motion.div>
        </AnimatePresence>
      ) : (
        ""
      )}
      {modifiersState.isMeh ? (
        <AnimatePresence mode="popLayout">
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
            <LabelModifier label="Meh" size={size} />
          </motion.div>
        </AnimatePresence>
      ) : (
        ""
      )}
      {/* this is for a shift */}
      {typeof keyCode === "number" ? (
        <>
          {parseModifs(keyCode).includes(0) === true && !modifiersState.isMeh && !modifiersState.isHyper ? (
            <AnimatePresence mode="popLayout">
              <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
                {/* <LabelModifier label={size === "xs" ? "S" : "Shift"} size={size} /> */}
                <LabelModifier label="shift" size={size} />
              </motion.div>
            </AnimatePresence>
          ) : (
            ""
          )}
          {parseModifs(keyCode).includes(1) === true && !modifiersState.isMeh && !modifiersState.isHyper ? (
            <AnimatePresence mode="popLayout">
              <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
                {/* <LabelModifier label={size === "xs" ? "C" : "Ctrl"} size={size} /> */}
                <LabelModifier label="control" size={size} />
              </motion.div>
            </AnimatePresence>
          ) : (
            ""
          )}
          {parseModifs(keyCode).includes(2) === true && !modifiersState.isMeh && !modifiersState.isHyper ? (
            <AnimatePresence mode="popLayout">
              <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
                {/* <LabelModifier label={size === "xs" ? "A" : "Alt"} size={size} /> */}
                <LabelModifier label="alt" size={size} />
              </motion.div>
            </AnimatePresence>
          ) : (
            ""
          )}
          {parseModifs(keyCode).includes(3) === true ? (
            <AnimatePresence mode="popLayout">
              <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
                {/* <LabelModifier label={size === "xs" ? "Agr" : "Alt Gr."} size={size} /> */}
                <LabelModifier label="altGr" size={size} />
              </motion.div>
            </AnimatePresence>
          ) : (
            ""
          )}
          {parseModifs(keyCode).includes(4) === true && !modifiersState.isMeh && !modifiersState.isHyper ? (
            <AnimatePresence mode="popLayout">
              <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
                <LabelModifier label="os" size={size} />
              </motion.div>
            </AnimatePresence>
          ) : (
            ""
          )}
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default ListModifier;
