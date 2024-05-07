import * as React from "react";

interface IconProps {
  size?: "md" | "sm";
}

function IconMediaSoundLess({ size = "md" }: IconProps) {
  return (
    <>
      {size === "md" ? (
        <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12.84 5.257L9.596 8.5H5.875A.875.875 0 005 9.375v5.25c0 .483.392.875.875.875h3.72l3.245 3.243c.548.548 1.493.163 1.493-.619V5.876c0-.783-.946-1.166-1.493-.62zm4.491 3.94a.876.876 0 00-.844 1.533c.47.26.763.746.763 1.27s-.292 1.01-.763 1.27a.876.876 0 00.845 1.533A3.206 3.206 0 0019 12c0-1.163-.64-2.236-1.669-2.803z"
            fill="currentColor"
          />
        </svg>
      ) : (
        ""
      )}
      {size === "sm" ? (
        <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.7 4.38L7.995 7.083h-3.1a.729.729 0 00-.73.73v4.375c0 .402.326.729.73.729h3.1l2.703 2.702c.457.457 1.245.136 1.245-.515V4.896c0-.652-.789-.971-1.245-.516zm3.742 3.284a.73.73 0 00-.704 1.278c.393.216.636.621.636 1.058 0 .437-.243.842-.635 1.058a.73.73 0 00.704 1.277A2.672 2.672 0 0015.833 10c0-.969-.533-1.863-1.39-2.336z"
            fill="currentColor"
          />
        </svg>
      ) : (
        ""
      )}
    </>
  );
}

export default IconMediaSoundLess;
