import React from "react";
import ReactDom from "react-dom";

export default function MacroKeyModal(props: any) {
  const { children } = props;
  return ReactDom.createPortal(<>{children}</>, document.getElementById("portalMacro"));
}
