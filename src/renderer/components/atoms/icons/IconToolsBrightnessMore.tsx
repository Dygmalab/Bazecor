import * as React from "react";

interface IconProps {
  size?: "md" | "sm";
}

function IconBrightnessMore({ size = "md" }: IconProps) {
  return (
    <>
      {size === "md" ? (
        <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8.727 14.345a4.364 4.364 0 014.364-4.364v0a4.364 4.364 0 014.364 4.364v.565c0 .17-.138.308-.308.308H9.034a.308.308 0 01-.308-.308v-.565z"
            stroke="currentColor"
            strokeWidth={1.2}
            strokeLinejoin="round"
          />
          <path d="M13.09 6.927V2.999M18.327 9.267l2.777-2.777" stroke="currentColor" strokeWidth={1.5} />
          <path d="M20.073 14.345H24" stroke="currentColor" strokeWidth={1.2} />
          <path d="M7.418 9.267L4.641 6.49" stroke="currentColor" strokeWidth={1.5} />
          <path fill="currentColor" d="M4.8 13.036v7.855H3.055v-7.855z" />
          <path fill="currentColor" d="M0 16.09h7.855v1.745H0z" />
        </svg>
      ) : (
        ""
      )}
      {size === "sm" ? (
        <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M7.273 11.954a3.636 3.636 0 013.636-3.636v0a3.636 3.636 0 013.636 3.636v.471a.257.257 0 01-.256.257h-6.76a.257.257 0 01-.256-.257v-.47z"
            stroke="currentColor"
            strokeLinejoin="round"
          />
          <path d="M10.909 5.773V2.5M15.273 7.723l2.314-2.314" stroke="currentColor" strokeWidth={1.25} />
          <path d="M16.727 11.954H20" stroke="currentColor" />
          <path d="M6.182 7.723L3.868 5.409" stroke="currentColor" strokeWidth={1.25} />
          <path fill="currentColor" d="M4 10.864v6.545H2.545v-6.545z" />
          <path fill="currentColor" d="M0 13.409h6.545v1.455H0z" />
        </svg>
      ) : (
        ""
      )}
    </>
  );
}

export default IconBrightnessMore;
