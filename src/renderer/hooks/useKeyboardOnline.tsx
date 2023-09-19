import { useState, useEffect } from "react";
import { SelectableKeyboard } from "../types/selectableKeyboard";

const useKeyboardOnline = () => {
  const [onlineKeyboards, setOnlineKeyboards] = useState<SelectableKeyboard[]>([]);
  const deviceController: any = undefined;

  useEffect(() => {
    const listOfOnlineDevices = deviceController.getDevices();
    setOnlineKeyboards(listOfOnlineDevices);
  }, [deviceController]);

  return {
    onlineKeyboards,
  };
};

export default useKeyboardOnline;
