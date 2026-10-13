import { useEffect, useRef } from "react";

/**
 * A custom React hook that returns the previous value of a given variable.
 * On the initial render, it returns `undefined`.
 *
 * @template T The type of the value to track.
 * @param {T} value The current value of the variable.
 * @returns {T | undefined} The value of the variable from the previous render, or `undefined` on the first render.
 */
export default function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
