import React from "react";
import LogoLoader from "./LogoLoader";

const FirmwareLoader = ({ width, warning, error, paused }) => {
  return (
    <div className="firmware-wrapper">
      <div className="firmware-row">
        <div className="loading marginCenter text-center">
          <LogoLoader width={width} warning={warning} error={error} paused={paused} />
        </div>
      </div>
    </div>
  );
};

export default FirmwareLoader;
