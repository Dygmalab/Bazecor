import React from "react";
import ReactDom from "react-dom";

interface MacroPortalProps {
  children: React.ReactNode;
}

export default function MacroKeyPortal({ children }: MacroPortalProps) {
  return ReactDom.createPortal(<>{children}</>, document.getElementById("portalMacro"));
}
