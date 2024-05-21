import * as React from "react";

interface IconArrowsSmallSeparatingProps {
  size?: "sm" | "md";
}

const IconArrowsSmallSeparating = ({ size = "sm" }: IconArrowsSmallSeparatingProps) => (
  <>
    {size === "md" ? (
      <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 8L12 4L16 8M8 16L12 20L16 16" stroke="currentColor" strokeWidth={1.2} />
      </svg>
    ) : (
      <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 7.19235L9.5 4.09619L13 7.19235M6 13.3847L9.5 16.4808L13 13.3847" stroke="currentColor" strokeWidth={1.2} />
      </svg>
    )}
  </>
);

export default IconArrowsSmallSeparating;
