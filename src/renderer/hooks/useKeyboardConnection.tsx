import { useState } from "react";
import { SelectableKeyboard } from "@Renderer/types/selectableKeyboard";

const useKeyboardConnection = () => {
  const [connectedKeyboard, setConnectedKeyboard] = useState<SelectableKeyboard | undefined>(undefined);

  const disconnectKeyboard = () => {
    if (connectedKeyboard) {
      // disconnect current keyboard
      setConnectedKeyboard(undefined);
    }
  };

  const connectKeyboard = (selectedKeyboard: SelectableKeyboard) => {
    if (connectKeyboard) {
      disconnectKeyboard();
    }
    // connect new keyboard
    setConnectedKeyboard(selectedKeyboard);
  };

  return {
    connectedKeyboard,
    disconnectKeyboard,
    connectKeyboard,
  };
};

export default useKeyboardConnection;
