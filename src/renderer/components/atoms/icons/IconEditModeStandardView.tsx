import * as React from "react";

interface IconProps {
  size?: "md" | "sm";
}

function IconEditModeStandardView({ size = "md" }: IconProps) {
  return (
    <>
      {size === "md" ? (
        <svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask
            id="prefix__IconEditModeStandardView"
            style={{
              maskType: "alpha",
            }}
            maskUnits="userSpaceOnUse"
            x={1}
            y={4}
            width={11}
            height={11}
          >
            <path
              d="M1 13.556h1.444V15H1v-1.444zM3.889 13.556h1.444V15H3.89v-1.444zM6.778 13.556h1.444V15H6.778v-1.444zM9.667 13.556h1.444V15H9.667v-1.444zM1 10.667h1.444v1.444H1v-1.444zM1 7.778h1.444v1.444H1V7.778zM1 4.889h1.444v1.444H1V4.89z"
              fill="#fff"
            />
          </mask>
          <g mask="url(#prefix__IconEditModeStandardView)">
            <mask
              id="prefix_b_IconEditModeStandardView"
              style={{
                maskType: "alpha",
              }}
              maskUnits="userSpaceOnUse"
              x={1}
              y={4}
              width={11}
              height={11}
            >
              <path d="M1 15V4.889h1.452v8.66h8.66v1.45H1z" fill="#fff" />
            </mask>
            <g mask="url(#prefix_b_IconEditModeStandardView)">
              <rect x={1.6} y={5.489} width={8.911} height={8.911} rx={1.4} stroke="currentColor" strokeWidth={1.2} />
            </g>
          </g>
          <rect x={4.6} y={2.6} width={8.8} height={8.8} rx={1.4} stroke="currentColor" strokeWidth={1.2} />
        </svg>
      ) : (
        ""
      )}
      {size === "sm" ? (
        <svg width={14} height={14} fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#prefix__clipStandardViewMode)">
            <mask
              id="prefix_StandardViewModeSm_a"
              style={{
                maskType: "alpha",
              }}
              maskUnits="userSpaceOnUse"
              x={0}
              y={4}
              width={10}
              height={10}
            >
              <path
                d="M.875 11.861h1.264v1.264H.875v-1.264zM3.403 11.861h1.264v1.264H3.403v-1.264zM5.93 11.861h1.264v1.264H5.931v-1.264zM8.458 11.861h1.264v1.264H8.458v-1.264zM.875 9.333h1.264v1.264H.875V9.333zM.875 6.806h1.264v1.263H.875V6.806zM.875 4.278h1.264v1.264H.875V4.278z"
                fill="#fff"
              />
            </mask>
            <g mask="url(#prefix_StandardViewModeSm_a)">
              <mask
                id="prefix_StandardViewModeSm_b"
                style={{
                  maskType: "alpha",
                }}
                maskUnits="userSpaceOnUse"
                x={0}
                y={4}
                width={10}
                height={10}
              >
                <path d="M.875 13.125V4.278h1.27v7.577h7.577v1.27H.875z" fill="#fff" />
              </mask>
              <g mask="url(#prefix_StandardViewModeSm_b)">
                <rect x={1.4} y={4.803} width={7.797} height={7.797} rx={1.225} stroke="currentColor" strokeWidth={1.05} />
              </g>
            </g>
            <rect x={4.025} y={2.275} width={7.7} height={7.7} rx={1.225} stroke="currentColor" strokeWidth={1.05} />
          </g>
          <defs>
            <clipPath id="prefix__clipStandardViewMode">
              <path fill="currentColor" d="M0 0h14v14H0z" />
            </clipPath>
          </defs>
        </svg>
      ) : (
        ""
      )}
    </>
  );
}

export default IconEditModeStandardView;
