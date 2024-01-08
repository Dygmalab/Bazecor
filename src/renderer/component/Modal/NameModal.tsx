import React, { useState, useEffect, useRef, useCallback, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "@Renderer/component/Button";
import i18n from "../../i18n";
import { IconCloseXs } from "../Icon";

interface NameModalProps {
  modalTitle: string;
  show: boolean;
  name: string;
  toggleShow: () => void;
  handleSave: (name: string) => void;
  labelInput: string;
}

const NameModal = ({ modalTitle, show, toggleShow, name, handleSave, labelInput }: NameModalProps) => {
  const [internalName, setInternalName] = useState(name);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (inputRef.current && isFocused) {
          handleSave(internalName);
          toggleShow();
        }
      }
    },
    [isFocused, internalName, toggleShow, handleSave],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown]);

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
          <div className="fixed inset-0 bg-gray-50/85 dark:bg-gray-700/85" aria-hidden="true" />
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
            <Dialog.Panel className="mx-auto max-w-3xl w-full rounded-xl bg-gray-25 dark:bg-gray-800">
              <div className="px-4 py-4 flex items-center justify-between">
                <Dialog.Title className="text-2xl tracking-tight font-semibold text-gray-400 dark:text-gray-25">
                  {modalTitle}
                </Dialog.Title>
                <button type="button" className="flex mt-0 pt-2 mr-[-24px] text-gray-400 dark:text-gray-25" onClick={toggleShow}>
                  <IconCloseXs />
                </button>
              </div>
              <div className="px-4 pb-3">
                <form className="flex flex-col">
                  <label htmlFor="changeName" className="font-xs tracking-tight font-semibold text-gray-400 dark:text-gray-25">
                    {labelInput}
                  </label>
                  <input
                    id="changeName"
                    type="text"
                    ref={inputRef}
                    value={internalName}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={event => setInternalName(event.target.value)}
                    className="form-input form-input-xl"
                  />
                </form>
              </div>
              <div className="px-3 py-4 flex gap-4 justify-end bg-gray-100/10 dark:bg-gray-900/10">
                <Button variant="outline" size="sm" onClick={toggleShow}>
                  Discard changes
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleSave(internalName)}>
                  Save changes
                </Button>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default NameModal;
