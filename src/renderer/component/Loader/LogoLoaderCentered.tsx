import React from "react";
import Styled from "styled-components";
import LogoLoader from "./LogoLoader";

const Style = Styled.div`
&.centererd-wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
`;

interface LogoLoaderProps {
  width?: number;
  warning?: boolean;
  error?: boolean;
  paused?: boolean;
}

function LogoLoaderCentered({ width = 52, warning = false, error = false, paused = false }: LogoLoaderProps) {
  return (
    <Style className="centererd-wrapper">
      <div className="centererd-inner">
        <div className="loading marginCenter text-center">
          <LogoLoader width={width} warning={warning} error={error} paused={paused} />
        </div>
      </div>
    </Style>
  );
}

export default LogoLoaderCentered;
