import * as React from "react";

interface IconProps {
  size?: "md" | "sm";
}

function IconLEDPreviousEffect({ size = "md" }: IconProps) {
  return (
    <>
      {size === "md" ? (
        <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.157 11.773L23.5 5.454v12.638l-6.343-6.319z" fill="currentColor" />
          <path d="M10.955 11.773l6.342-6.319v12.638l-6.342-6.319z" fill="currentColor" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.619 15.046a3.718 3.718 0 11.397-6.943l.895-.891a4.918 4.918 0 10-.363 8.76l-.93-.926zm6.678-2.946H20v-1.2h-1.703v1.2zM9.9 2v2.59h1.2V2H9.9zM6.039 6.19L4.207 4.358l-.849.848L5.19 7.038l.849-.848zM3.59 10.9H1v1.2h2.59v-1.2zm1.6 5.06l-1.833 1.833.849.848 1.832-1.832-.849-.848zM9.9 18.41v2.59h1.2v-2.59H9.9z"
            fill="currentColor"
          />
        </svg>
      ) : (
        ""
      )}
      {size === "sm" ? (
        <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.297 9.811l5.286-5.265v10.531l-5.285-5.266z" fill="currentColor" />
          <path d="M9.129 9.811l5.286-5.265v10.531L9.129 9.811z" fill="currentColor" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.682 12.539a3.098 3.098 0 11.331-5.786l.746-.743a4.098 4.098 0 10-.303 7.3l-.774-.771zm5.566-2.456h1.419v-1h-1.42v1zM8.25 1.667v2.159h1v-2.16h-1zM5.032 5.159L3.506 3.632l-.708.707 1.527 1.527.707-.707zm-2.04 3.924H.833v1h2.16v-1zm1.333 4.218l-1.527 1.527.708.707 1.526-1.527-.707-.707zm3.925 2.04V17.5h1v-2.16h-1z"
            fill="currentColor"
          />
        </svg>
      ) : (
        ""
      )}
    </>
  );
}

export default IconLEDPreviousEffect;
