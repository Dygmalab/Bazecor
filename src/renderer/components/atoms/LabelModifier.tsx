import React from "react";

interface LabelModifierProps {
  label?: string;
  size?: "xs" | "sm" | "md";
}

const LabelModifier = ({ label, size = "md" }: LabelModifierProps) => (
  <div
    className={`font-semibold tracking-tight rounded-xl backdrop-blur-sm ${
      size === "md"
        ? "border-[1px] border-solid border-gray-800/10 dark:border-gray-800/50 text-gray-25 dark:text-gray-50 bg-gray-400/50 px-[4px] py-[8px] text-[11px]"
        : ""
    } 
    ${size === "sm" ? "text-gray-200 bg-gray-600/60 px-[3px] py-[6px] text-[10px]" : ""}`}
  >
    {label}
  </div>
);

export default LabelModifier;
