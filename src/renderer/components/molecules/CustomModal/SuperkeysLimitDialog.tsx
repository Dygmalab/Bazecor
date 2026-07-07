import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@Renderer/components/atoms/Dialog";
import { Button } from "@Renderer/components/atoms/Button";

interface SuperkeysLimitDialogProps {
  open: boolean;
  onClose: () => void;
}

const SuperkeysLimitDialog = ({ open, onClose }: SuperkeysLimitDialogProps): JSX.Element => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="text-center items-center pt-12 space-y-3">
          <DialogTitle className="text-center">Maximum Superkeys Reached</DialogTitle>
          <DialogDescription className="text-center">
            You have reached the maximum limit of superkeys. Please delete an existing superkey before creating a new one.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-10 mt-2 flex justify-center">
          <Button variant="primary" onClick={onClose}>
            Understood
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuperkeysLimitDialog;
