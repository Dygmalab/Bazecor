import React, { useState, useEffect, useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import i18n from "../../i18n";

interface NameModalProps {
  modalTitle: string;
  show: boolean;
  name: string;
  toggleShow: () => void;
  handleSave: (event) => void;
  labelInput: string;
}

const NameModal = ({ modalTitle, show, toggleShow, name, handleSave, labelInput }: NameModalProps) => {
  const [internalName, setInternalName] = useState(name);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeydown = (event: any) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (inputRef.current && isFocused) {
          handleSave(internalName);
          toggleShow();
        }
      }
    };
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  return (
    // Use the `Transition` component + show prop to add transitions.
    <Transition show={show} as={Fragment}>
      <Dialog onClose={toggleShow} initialFocus={inputRef} className="relative z-50">
        {/* The backdrop, rendered as a fixed sibling to the panel container */}

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          {/* Full-screen container to center the panel */}
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            {/* The actual dialog panel  */}
            <Dialog.Panel className="mx-auto max-w-sm rounded bg-white">
              <Dialog.Title>{modalTitle}</Dialog.Title>
              <form>
                <label htmlFor="changeName">{labelInput}</label>
                <input
                  id="changeName"
                  type="text"
                  ref={inputRef}
                  value={internalName}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
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
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default NameModal;
