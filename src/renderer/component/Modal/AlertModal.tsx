import React from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@Renderer/components/atoms/Dialog";
import { Button } from "@Renderer/components/atoms/Button";

interface AlertModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  description: string;
}

const AlertModal = ({ showModal, setShowModal, title, description }: AlertModalProps) => (
  <Dialog open={showModal} onOpenChange={() => setShowModal(false)}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div className="px-6 pb-2 mt-2">
        <div dangerouslySetInnerHTML={{ __html: description }} />
      </div>
      <DialogFooter>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Go Back
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default AlertModal;
