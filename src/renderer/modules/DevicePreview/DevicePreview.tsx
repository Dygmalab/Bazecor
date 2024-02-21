import React from "react";

import Styled from "styled-components";

const DevicePreviewWrapper = Styled.div`
  canvas {
    max-width: 100%;
    display: block;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
    &.Defy {
      background-image: url(${({ theme }) => theme.styles.devicePreview.defyOff});
      &.on {
        background-image: url(${({ theme }) => theme.styles.devicePreview.defyOn});
      }
    }
    &.Raise {
      background-image: url(${({ theme }) => theme.styles.devicePreview.raiseOff});
      &.on {
        background-image: url(${({ theme }) => theme.styles.devicePreview.raiseOn});
      }
    }
  }
`;
interface DevicePreviewProps {
  deviceName: string;
  isConnected: boolean;
}
const DevicePreview = ({ deviceName, isConnected }: DevicePreviewProps) => (
  <DevicePreviewWrapper className="device-preview">
    <canvas className={`${deviceName} ${isConnected ? "on" : "off"}`} width="1140" height="720" />
  </DevicePreviewWrapper>
);

export default DevicePreview;
