import { useEffect, useRef } from "react";

/**
 * A custom React hook that returns the previous value of a given value.
 * @template T - The type of the value.
 * @param {T} value - The value whose previous value is to be tracked.
 * @returns {T | undefined} The previous value, or undefined on the first render.
 */
export default function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
