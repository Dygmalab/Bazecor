import * as React from "react";

interface IconPlusProps {
  size?: "xs" | "md";
}

const IconPlus = ({ size = "md" }: IconPlusProps) => (
  <>
    {size === "md" ? (
      <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth={1.2} />
      </svg>
    ) : (
      <svg width={13} height={13} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.968 6.237v-5.4h1.2v5.4h5.4v1.2h-5.4v5.4h-1.2v-5.4h-5.4v-1.2h5.4z"
          fill="currentColor"
        />
      </svg>
    )}
  </>
);

export default IconPlus;
