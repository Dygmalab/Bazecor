import * as React from "react";

interface IconProps {
  size?: "md" | "sm";
}

function IconLEDNextEffect({ size = "md" }: IconProps) {
  return (
    <>
      {size === "md" ? (
        <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.343 11.773L1 5.454v12.638l6.343-6.319z" fill="currentColor" />
          <path d="M13.545 11.773L7.202 5.454v12.638l6.343-6.319z" fill="currentColor" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.88 15.046a3.718 3.718 0 10-.397-6.943l-.895-.891a4.918 4.918 0 11.363 8.76l.93-.926zM6.203 12.1H4.5v-1.2h1.702v1.2zM14.6 2v2.59h-1.2V2h1.2zm3.861 4.19l1.832-1.832.849.848-1.832 1.832-.849-.848zm2.448 4.71h2.59v1.2h-2.59v-1.2zm-1.6 5.06l1.832 1.833-.848.848-1.832-1.832.849-.848zM14.6 18.41v2.59h-1.2v-2.59h1.2z"
            fill="currentColor"
          />
        </svg>
      ) : (
        ""
      )}
      {size === "sm" ? (
        <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.119 9.811L.833 4.546v10.531L6.12 9.811z" fill="currentColor" />
          <path d="M11.288 9.811L6.002 4.546v10.531l5.286-5.266z" fill="currentColor" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.734 12.54a3.098 3.098 0 10-.331-5.786l-.746-.744a4.098 4.098 0 11.302 7.3l.775-.77zm-5.565-2.457h-1.42v-1h1.42v1zm6.997-8.416v2.159h-1v-2.16h1zm3.218 3.492l1.527-1.527.707.707-1.527 1.527-.707-.707zm2.04 3.924h2.159v1h-2.16v-1zm-1.333 4.218l1.527 1.527-.707.707-1.527-1.527.707-.707zm-3.925 2.04V17.5h-1v-2.16h1z"
            fill="currentColor"
          />
        </svg>
      ) : (
        ""
      )}
    </>
  );
}

export default IconLEDNextEffect;
