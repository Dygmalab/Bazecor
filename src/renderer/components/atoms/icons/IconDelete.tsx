import * as React from "react";

interface IconProps {
  size?: "md" | "sm";
  strokeWidth?: number;
}

function IconDelete({ size = "md", strokeWidth = 1.2 }: IconProps) {
  return (
    <>
      {size === "md" ? (
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M19.4 5V6.4H4.6V5C4.6 4.77909 4.77909 4.6 5 4.6H8H8.37082L8.53666 4.26833L8.98387 3.3739C9.22102 2.8996 9.70579 2.6 10.2361 2.6H13.7639C14.2942 2.6 14.779 2.8996 15.0161 3.3739L15.4633 4.26833L15.6292 4.6H16H19C19.2209 4.6 19.4 4.77909 19.4 5ZM5.6 20V8.6H18.4V20C18.4 20.7732 17.7732 21.4 17 21.4H7C6.2268 21.4 5.6 20.7732 5.6 20Z"
            stroke="currentColor"
            strokeWidth={strokeWidth}
          />
        </svg>
      ) : (
        ""
      )}
      {size === "sm" ? (
        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none">
          <path
            stroke="currentColor"
            strokeWidth={strokeWidth}
            d="M12.933 3.333v.934H3.067v-.934c0-.147.12-.266.266-.266h2.248l.11-.221.298-.597a.93.93 0 0 1 .835-.516h2.352c.354 0 .677.2.835.516l.298.597.11.22h2.248c.147 0 .266.12.266.267Zm-9.2 10v-7.6h8.534v7.6a.933.933 0 0 1-.934.934H4.667a.933.933 0 0 1-.934-.934Z"
          />
        </svg>
      ) : (
        ""
      )}
    </>
  );
}

export default IconDelete;
