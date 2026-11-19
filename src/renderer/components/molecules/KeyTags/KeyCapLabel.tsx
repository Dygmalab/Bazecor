import React from "react";
import { KeyType } from "@Renderer/types/layout";

interface KeyCapLabelProps {
  keyData: KeyType | undefined;
}

/* A top label carrying "+" is a modifier prefix ("C+", "A+"): the keyboard
 * drawing leaves it out and the modifiers are shown as badges instead. */
const showsTop = (top: KeyType["extraLabel"]) =>
  React.isValidElement(top) || (typeof top === "string" && top !== "" && !top.includes("+"));

/**
 * A key's label as the keyboard drawing shows it, for places outside the
 * drawing that name a key, such as the Combo Editor's key and result slots.
 *
 * The keymap DB gives every key a `label` and an optional `extraLabel` (the
 * small tag above it), and either can be a React element: media keys are an
 * icon, layer keys are a layer tag with an empty label, dual-function and
 * one-shot keys are a tag over the key. Reading only `label` as a string turns
 * those into "[object Object]" or nothing, so both parts are rendered here.
 */
function KeyCapLabel({ keyData }: KeyCapLabelProps) {
  if (!keyData) return null;
  const { label, extraLabel, verbose } = keyData;
  const top = showsTop(extraLabel) ? extraLabel : null;
  const primary = label !== "" && label !== undefined && label !== null ? label : null;
  const title = typeof verbose === "string" ? verbose : undefined;

  return (
    <span className="keyCapLabel inline-flex flex-col items-center justify-center leading-tight" title={title}>
      {top && <span className="text-2xxs font-semibold opacity-70 inline-flex items-center">{top}</span>}
      {primary && <span className="inline-flex items-center">{primary}</span>}
    </span>
  );
}

export default KeyCapLabel;
