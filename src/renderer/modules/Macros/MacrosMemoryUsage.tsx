// -*- mode: js-jsx -*-
/* Bazecor
 * Copyright (C) 2022  Dygmalab, Inc.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React from "react";
import Styled from "styled-components";

import { toast } from "react-toastify";
import { i18n } from "@Renderer/i18n";

import { IconFloppyDisk } from "@Renderer/components/atoms/icons";
import Heading from "@Renderer/components/atoms/Heading";
import ToastMessage from "@Renderer/components/atoms/ToastMessage";
import DotsProgressBar from "./DotsProgressBar";

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

interface MacrosMemoryUsageProps {
  mem: number;
  tMem: number;
}

const MacrosMemoryUsage = ({ mem, tMem }: MacrosMemoryUsageProps) => {
  const [memoryUsage, setMemoryUsage] = React.useState(mem);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (mem < 1 || tMem < 1) return;
    // setMemoryUsage(macros.map(m => m.actions).flat().length);
    setMemoryUsage(Number(((mem / tMem) * 100).toFixed(1)));
    setIsLoading(false);
    if (mem > tMem * 0.95 && mem < tMem - 20) {
      toast.warn(
        <ToastMessage
          title={i18n.editor.macros.memoryUsage.alertTitle}
          content={i18n.editor.macros.memoryUsage.alertBody}
          icon={<IconFloppyDisk />}
        />,
        { icon: "" },
      );
    }
    if (mem > tMem - 20) {
      toast.error(
        <ToastMessage
          title={i18n.editor.macros.memoryUsage.errorTitle}
          content={i18n.editor.macros.memoryUsage.alertBody}
          icon={<IconFloppyDisk />}
        />,
        {
          position: "top-right",
          autoClose: false,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          icon: "",
        },
      );
    }
  }, [mem, tMem]);
  if (isLoading) return null;
  return (
    <Styles
      className={`${memoryUsage > 95 && memoryUsage < 98 ? "memoryWarning" : ""} ${memoryUsage > 99 ? "memoryError" : ""} `}
    >
      <Heading headingLevel={4} renderAs="h4" className="m-0 leading-3">
        {i18n.editor.macros.memoryUsage.title}
      </Heading>
      <div className="progressIndicator">
        <div className="progressIndicatorBar">
          <DotsProgressBar progressWidth={memoryUsage} />
        </div>
        <div className="progressIndicatorPercentage">{memoryUsage >= 100 ? "100" : memoryUsage}%</div>
      </div>
    </Styles>
  );
};

export default MacrosMemoryUsage;
