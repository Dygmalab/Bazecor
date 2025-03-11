import Heading from "@Renderer/components/atoms/Heading";
import { useDevice } from "@Renderer/DeviceContext";
import DotsProgressBar from "@Renderer/modules/Macros/DotsProgressBar";
import React from "react";
import Styled from "styled-components";

const Styles = Styled.div`
margin: 0 0 0 24px;
border: 1px solid ${({ theme }) => theme.styles.memoryUsage.borderColor};
border-radius: 4px;
padding: 6px 12px;
color: ${({ theme }) => theme.styles.memoryUsage.color};
height: 44px;
line-height: 1.15em;
h4 {
  font-weight: 600;
  font-size: 11px;
  letter-spacing: -0.03em;
  margin-bottom: 8px;
  color: inherit;
}
.progressIndicator {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}
.progressIndicatorPercentage {
  font-weight: 600;
  font-size: 11px;
  letter-spacing: -0.03em;
  padding: 0 2px 0 6px;
  color: ${({ theme }) => theme.styles.memoryUsage.percentageColor};
}
.progressBaseColor {
  fill: ${({ theme }) => theme.styles.memoryUsage.progressBaseColor};
}
.progressFill {
  fill: ${({ theme }) => theme.styles.memoryUsage.progressFill};
}
&.memoryWarning {
  h4 {
    color: ${({ theme }) => theme.styles.memoryUsage.colorWarning};
  }
  .progressFill {
    fill: ${({ theme }) => theme.styles.memoryUsage.colorWarning};
  }
}
&.memoryError {
  h4 {
    color: ${({ theme }) => theme.styles.memoryUsage.colorError};
  }
  .progressFill {
    fill: ${({ theme }) => theme.styles.memoryUsage.colorError};
  }
}
`;

function CurrentMacroLength({ macroLenght }: { macroLenght: number }) {
  const { state: deviceState } = useDevice();
  return deviceState.currentDevice.device.info.product === "Raise" ? (
    <></>
  ) : (
    <Styles
      className={`${macroLenght > 95 && macroLenght < 98 ? "memoryWarning" : ""} ${macroLenght > 99 ? "memoryError" : ""} `}
    >
      <Heading headingLevel={4} renderAs="h4" className="m-0 leading-3">
        Macro Length
      </Heading>
      <div className="progressIndicator">
        <div className="progressIndicatorBar">
          <DotsProgressBar progressWidth={macroLenght} />
        </div>
        <div className="progressIndicatorPercentage">{macroLenght >= 100 ? "100" : macroLenght}%</div>
      </div>
    </Styles>
  );
}

export default CurrentMacroLength;
