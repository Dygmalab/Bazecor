import React, { useState, useEffect, useRef } from "react";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@Renderer/components/ui/dialog";
import { Button } from "@Renderer/components/ui/button";

interface NameModalProps {
  modalTitle: string;
  show: boolean;
  name: string | boolean;
  toggleShow: () => void;
  handleSave: (name: string) => void;
  labelInput: string;
}

const NameModal = ({ modalTitle, show, toggleShow, name, handleSave, labelInput }: NameModalProps) => {
  const [internalName, setInternalName] = useState(name);
  const inputRef = useRef(null);

  useEffect(() => {
    setInternalName(name);
  }, [name]);
  return (
    <Dialog open={show} onOpenChange={toggleShow}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
        </DialogHeader>
        <div className="px-4 pb-3">
          <form
            className="flex flex-col"
            onSubmit={e => {
              e.preventDefault();
              handleSave(typeof internalName === "string" ? internalName : "");
            }}
          >
            <label htmlFor="changeName" className="font-xs tracking-tight font-semibold text-gray-400 dark:text-gray-25">
              {labelInput}
            </label>
            <input
              id="changeName"
              type="text"
              ref={inputRef}
              value={typeof internalName === "string" ? internalName : ""}
              onChange={event => setInternalName(event.target.value)}
              className="form-input form-input-xl"
            />
          </form>
        </div>
        <DialogFooter>
          <Button variant="outline" size="md" onClick={toggleShow}>
            Discard changes
          </Button>

          <Button variant="secondary" size="md" onClick={() => handleSave(typeof internalName === "string" ? internalName : "")}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NameModal;
