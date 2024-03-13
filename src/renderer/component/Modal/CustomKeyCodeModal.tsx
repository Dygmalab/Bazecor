import React, { useState, useRef, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "@Renderer/component/Button";
import { IconCloseXs } from "../Icon";

interface CustomKeyCodeModalProps {
  modalTitle: string;
  modalMessage: string;
  show: boolean;
  name: string;
  toggleShow: () => void;
  handleSave: (name: string) => void;
  labelInput: string;
}

const CustomKeyCodeModal = ({
  modalTitle,
  modalMessage,
  show,
  toggleShow,
  name,
  handleSave,
  labelInput,
}: CustomKeyCodeModalProps) => {
  const [internalName, setInternalName] = useState(name);
  const inputRef = useRef(null);

  useEffect(() => {
    setInternalName(name);
  }, [name]);

  function parseNewValue(value: string) {
    const newValue = parseInt(value, 16).toString(16);
    // console.log("new value: ", value, newValue);
    if (!Number.isNaN(parseInt(value, 16))) setInternalName(newValue);
    else setInternalName("0");
  }

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
              <Dialog.Description className="px-4 py-4 items-center justify-between">
                <span className="font-md tracking-tight font-semibold text-gray-400 dark:text-gray-25">
                  {modalMessage}
                  <a href="https://usb.org/sites/default/files/hut1_21.pdf">Link.</a> Use a hex calculator to add 0x4800 to the
                  0x0C page (Consumer Page, section 15) code of your preference.
                </span>
                <br />
                <br />
                <span className="font-md tracking-tight font-semibold text-gray-400 dark:text-gray-25">
                  For example for Media Play key which is code B0 on the aforementioned consumer page, 0x4800 + 0x00B0 = 0x48B0
                </span>
              </Dialog.Description>
              <div className="px-4 pb-3">
                <form
                  className="flex flex-col"
                  onSubmit={e => {
                    e.preventDefault();
                    handleSave(typeof internalName === "string" ? internalName : "");
                  }}
                >
                  <label htmlFor="changeKeyCode" className="font-xs tracking-tight font-semibold text-gray-400 dark:text-gray-25">
                    {labelInput}
                  </label>
                  <div className="grid grid-flow-col grid-cols-12">
                    <div className="self-center col-start-1 col-span-1 row-start-1 z-10 !p-4 form-input-xl text-gray-300 select-none border-r border-gray-500">
                      0x
                    </div>
                    <input
                      id="changeKeyCode"
                      type="text"
                      ref={inputRef}
                      value={typeof internalName === "string" ? internalName : ""}
                      onChange={event => parseNewValue(event.target.value)}
                      className="!pl-20 form-input form-input-xl col-start-1 col-span-12 row-start-1"
                    />
                  </div>
                </form>
              </div>
              <div className="px-3 py-4 flex gap-3 justify-end bg-gray-100/10 dark:bg-gray-900/10">
                <Button variant="outline" className="self-center" size="sm" onClick={toggleShow}>
                  Discard changes
                </Button>
                <Button
                  variant="secondary"
                  className="self-center"
                  size="sm"
                  onClick={() => handleSave(typeof internalName === "string" ? internalName : "")}
                >
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

export default CustomKeyCodeModal;
