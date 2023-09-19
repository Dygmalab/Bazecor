import { useState, useEffect } from "react";
import { SelectableKeyboard } from "../types/selectableKeyboard";

const useVirtualKeyboards = () => {
  const [virtualKeyboards, setVirtualKeyboards] = useState<SelectableKeyboard[]>([]);
  const virtualDeviceController: any = undefined;

  useEffect(() => {
    const listOfVirtualDevices = virtualDeviceController.getDevices();
    setVirtualKeyboards(listOfVirtualDevices);
  }, [virtualDeviceController]);

  return {
    virtualKeyboards,
  };
};

export default useVirtualKeyboards;
