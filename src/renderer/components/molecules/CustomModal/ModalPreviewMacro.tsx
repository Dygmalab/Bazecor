import React from "react";
import ReactDom from "react-dom";

import { i18n } from "@Renderer/i18n";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@Renderer/components/atoms/Dialog";
import { Button } from "@Renderer/components/atoms/Button";
import { IconEye } from "@Renderer/components/atoms/icons";

interface PreviewMacroModalProps {
  children: React.ReactNode;
  hookref: React.RefObject<HTMLDivElement>;
}

const PreviewMacroModal = ({ children, hookref }: PreviewMacroModalProps) => {
  // const { children, hookref } = props;
  const [show, setShow] = React.useState(false);

  const toggleShow = () => {
    setShow(!show);
  };

  // console.log("Testing waters", children, hookref);

  return ReactDom.createPortal(
    <>
      <Button
        variant="outline"
        size="sm"
        iconDirection="right"
        onClick={() => setShow(!show)}
        className="px-[12px] py-[2px] w-full justify-between"
      >
        <IconEye /> {i18n.editor.macros.previewMacro}
      </Button>
      <Dialog open={show} onOpenChange={toggleShow}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{i18n.editor.macros.previewMacro}</DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6 mt-2 previewMacro">{children}</div>
        </DialogContent>
      </Dialog>
    </>,
    hookref.current,
  );
};

export default PreviewMacroModal;
