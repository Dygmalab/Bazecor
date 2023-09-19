import { useState, useEffect } from "react";
import useKeyboardStore from "./useKeyboardStore";
import useKeyboardOnline from "./useKeyboardOnline";
import useVirtualKeyboards from "./useVirtualKeyboards";
import { createUniqueKeyboards } from "../utils/createUniqueKeyboards";

const useKeyboardAvailability = () => {
  const { storedKeyboards } = useKeyboardStore();
  const { onlineKeyboards } = useKeyboardOnline();
  const { virtualKeyboards } = useVirtualKeyboards();
  const [availableKeyboards, setAvailableKeyboards] = useState(new Set(Array.from(storedKeyboards)));

  useEffect(() => {
    const mergedDevices = createUniqueKeyboards(Array.from(storedKeyboards), onlineKeyboards);
    setAvailableKeyboards(new Set([...mergedDevices, ...virtualKeyboards]));
  }, [storedKeyboards, onlineKeyboards, virtualKeyboards]);

  return {
    availableKeyboards,
  };
};

export default useKeyboardAvailability;
