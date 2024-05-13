import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LabelModifier from "../atoms/LabelModifier";

interface ListModifiersProps {
  keyCode: number;
  size?: "xs" | "sm" | "md";
}
type Modifier = 0 | 1 | 2 | 3 | 4;

const ListModifier = ({ keyCode, size = "md" }: ListModifiersProps) => {
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
    <div className="listModifiersTags flex flex-wrap my-0 gap-1">
      {isHyper ? (
        <AnimatePresence mode="popLayout">
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
            <LabelModifier label="Hyper" size={size} />
          </motion.div>
        </AnimatePresence>
      ) : (
        ""
      )}
      {isMeh ? (
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
          {parseModifs(keyCode).includes(0) === true && !isMeh && !isHyper ? (
            <AnimatePresence mode="popLayout">
              <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
                <LabelModifier label={size === "xs" ? "S" : "Shift"} size={size} />
              </motion.div>
            </AnimatePresence>
          ) : (
            ""
          )}
          {parseModifs(keyCode).includes(1) === true && !isMeh && !isHyper ? (
            <AnimatePresence mode="popLayout">
              <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
                <LabelModifier label={size === "xs" ? "C" : "Ctrl"} size={size} />
              </motion.div>
            </AnimatePresence>
          ) : (
            ""
          )}
          {parseModifs(keyCode).includes(2) === true && !isMeh && !isHyper ? (
            <AnimatePresence mode="popLayout">
              <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
                <LabelModifier label={size === "xs" ? "A" : "Alt"} size={size} />
              </motion.div>
            </AnimatePresence>
          ) : (
            ""
          )}
          {parseModifs(keyCode).includes(3) === true ? (
            <AnimatePresence mode="popLayout">
              <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
                <LabelModifier label={size === "xs" ? "Agr" : "Alt Gr."} size={size} />
              </motion.div>
            </AnimatePresence>
          ) : (
            ""
          )}
          {parseModifs(keyCode).includes(4) === true && !isMeh && !isHyper ? (
            <AnimatePresence mode="popLayout">
              <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
                <LabelModifier label="OS" size={size} />
              </motion.div>
            </AnimatePresence>
          ) : (
            ""
          )}
        </>
      ) : (
        ""
      )}

      {/* this is for a Control */}
      {/* {this.parseModifs(keyCode).includes(1) == true ? <div>Control</div> : "Nope"} */}
      {/* this is for a ALt */}
      {/* {this.parseModifs(keyCode).includes(2) == true ? <div>ALt</div> : "Nope"} */}
      {/* this is for a AltGr */}
      {/* {this.parseModifs(keyCode).includes(3) == true ? <div>AltGr</div> : "Nope"} */}
      {/* this is for a Gui */}
      {/* {this.parseModifs(keyCode).includes(4) == true ? <div>Gui</div> : "Nope"} */}
    </div>
  );
};

export default ListModifier;
