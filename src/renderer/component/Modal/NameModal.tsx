import React, { useState, useRef } from "react";
import { Dialog } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import i18n from "../../i18n";

const NameModal = ({ modalTitle, show, toggleShow, name, handleSave, label }) => {
  const [internalName, setInternalName] = useState(name);
  const inputRef = useRef(null);

  return (
    // Use the `Transition` component + show prop to add transitions.
    <AnimatePresence>
      {open && (
        <Dialog static as={motion.div} open={show} onClose={toggleShow} initialFocus={inputRef} className="relative z-50">
          {/* The backdrop, rendered as a fixed sibling to the panel container */}
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          {/* Full-screen container to center the panel */}
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            {/* The actual dialog panel  */}
            <Dialog.Panel className="mx-auto max-w-sm rounded bg-white">
              <Dialog.Title>{modalTitle}</Dialog.Title>
              <form>
                <label htmlFor="changeName">{label}</label>
                <input
                  id="changeName"
                  type="text"
                  ref={inputRef}
                  value={internalName}
                  onChange={event => setInternalName(event.target.value)}
                />
                <button onClick={toggleShow} className="btn btn-outline" type="button">
                  {i18n.app.cancelPending.button}
                </button>
                <button onClick={event => handleSave(internalName)} className="btn btn-primary" type="button">
                  {i18n.components.save.button}
                </button>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default NameModal;
