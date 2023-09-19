import { useState, useEffect } from "react";
import useKeyboardStore from "./useKeyboardStore";
import useKeyboardOnline from "./useKeyboardOnline";
import { createUniqueKeyboards } from "../utils/createUniqueKeyboards";

const useKeyboardAvailability = () => {
  const { storedKeyboards } = useKeyboardStore();
  const { onlineKeyboards } = useKeyboardOnline();
  const [availableKeyboards, setAvailableKeyboards] = useState(new Set(Array.from(storedKeyboards)));

  useEffect(() => {
    const mergedDevices = createUniqueKeyboards(Array.from(storedKeyboards), onlineKeyboards);
    setAvailableKeyboards(mergedDevices);
  }, [storedKeyboards, onlineKeyboards]);

  return {
    availableKeyboards,
  };
};

export default useKeyboardAvailability;
