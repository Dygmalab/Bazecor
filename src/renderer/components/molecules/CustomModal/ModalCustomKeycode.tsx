import React, { useState, useRef, useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@Renderer/components/atoms/Dialog";

import { Button } from "@Renderer/components/atoms/Button";
import Heading from "@Renderer/components/atoms/Heading";

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
    <Dialog open={show} onOpenChange={toggleShow}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-2 mt-2">
          <Heading headingLevel={3} renderAs="paragraph" className="mb-6">
            {modalMessage}
            <a className="text-purple-300 dark:text-purple-200" href="https://usb.org/sites/default/files/hut1_21.pdf">
              HID Usage Tables
            </a>
            .
          </Heading>
          <Heading headingLevel={3} renderAs="h4" className="mb-1">
            Available pages:
          </Heading>
          <ul className="text-sm text-gray-500 dark:text-gray-200">
            <li>Keyboard Page, section 10: 0x0000</li>
            <li>Consumer Page, section 15: 0x4800</li>
          </ul>
          <Heading headingLevel={3} renderAs="paragraph-sm" className="text-gray-500 dark:text-gray-200 mt-2">
            For example, for the Media Play/Pause key, which is code CD on the Consumer Page, do the following: 0x4800 + 0x00CD =
            0x48CD
          </Heading>
          <form
            className="flex flex-col mt-4"
            onSubmit={e => {
              e.preventDefault();
              handleSave(typeof internalName === "string" ? internalName : "");
            }}
          >
            <label htmlFor="changeKeyCode" className="flex mt-1 mb-2 text-sm font-semibold tracking-tight">
              {labelInput}
            </label>
            <div className="grid grid-flow-col grid-cols-12">
              <div className="self-center col-start-1 col-span-1 row-start-1 z-10 !p-4 text-gray-300 select-none border-r border-gray-500">
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
        <DialogFooter>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomKeyCodeModal;
