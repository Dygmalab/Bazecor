import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from "@Renderer/components/atoms/AlertDialog";
import { Button } from "@Renderer/components/atoms/Button";

interface UdevPolkitErrorDialogProps {
  open: boolean;
  errorMessage: string;
  command: string;
  onClose: () => void;
}

const UdevPolkitErrorDialog = ({ open, errorMessage, command, onClose }: UdevPolkitErrorDialogProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={isOpen => !isOpen && onClose()}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-200">Error when launching sudo prompt</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3 text-sm text-gray-400 dark:text-gray-200">
              <p className="font-semibold">An error happened when launching a sudo prompt window</p>
              <pre className="rounded-md bg-gray-900 p-3 font-mono text-xs text-red-200">{errorMessage}</pre>
              <p>
                Please install the udev rules manually by copying and pasting the following commands into a terminal and entering
                your password when prompted:
              </p>
              <textarea
                readOnly
                value={command}
                onClick={e => (e.target as HTMLTextAreaElement).select()}
                className="w-full resize-none rounded-md border border-gray-500 bg-gray-900 p-3 font-mono text-xs text-green-300 min-h-[400px]"
              />
              <p>
                After running the commands, <strong>restart Bazecor</strong> and try scanning for keyboards again. If you are
                still encountering issues, please reach out to support at{" "}
                <a href="https://dygma.com/pages/support" className="text-blue-500 underline">
                  https://dygma.com/pages/support
                </a>
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={handleCopy}>
            {copied ? "Copied!" : "Copy to Clipboard"}
          </Button>
          <AlertDialogAction buttonVariant="primary" onClick={onClose}>
            Close
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UdevPolkitErrorDialog;
