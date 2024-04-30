import React from "react";
import ReactDom from "react-dom";

import { i18n } from "@Renderer/i18n";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@Renderer/components/ui/dialog";
import { Button } from "@Renderer/components/ui/button";
import { IconEye } from "@Renderer/components/icons";

export default function PreviewMacroModal(props: any) {
  const { children, hookref } = props;
  const [show, setShow] = React.useState(false);

  const toggleShow = () => {
    setShow(!show);
  };

  // console.log("Testing waters", children, hookref);

  return ReactDom.createPortal(
    <>
      <Button variant="outline" size="sm" iconDirection="right" onClick={() => setShow(!show)}>
        <IconEye /> Preview macro
      </Button>
      <Dialog open={show} onOpenChange={toggleShow}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{i18n.editor.macros.previewMacro}</DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-2 mt-2">{children}</div>
        </DialogContent>
      </Dialog>
    </>,
    hookref.current,
  );
}
