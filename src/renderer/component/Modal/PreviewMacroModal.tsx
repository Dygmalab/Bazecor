import React from "react";
import ReactDom from "react-dom";

import Modal from "react-bootstrap/Modal";
import { i18n } from "@Renderer/i18n";
import { RegularButton } from "../Button";
import { IconEye } from "../Icon";

export default function PreviewMacroModal(props: any) {
  const { children, hookref } = props;
  const [show, setShow] = React.useState(false);

  const toggleShow = () => {
    setShow(!show);
  };

  // console.log("Testing waters", children, hookref);

  return ReactDom.createPortal(
    <>
      <RegularButton
        buttonText="Preview macro"
        size="sm"
        icoSVG={<IconEye />}
        styles="outline-sm transp-bg"
        icoPosition="right"
        onClick={() => setShow(!show)}
      />
      <Modal size="lg" show={show} onHide={toggleShow} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>{i18n.editor.macros.previewMacro}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modalInner previewMacro">{children}</div>
        </Modal.Body>
      </Modal>
    </>,
    hookref.current,
  );
}
