import React from "react";

import { IconWarning, IconCheckmark, IconRefresh } from "@Renderer/components/atoms/icons";

interface DefyLeftSideProps {
  updating?: boolean;
  warning?: boolean;
  success?: boolean;
  error?: boolean;
}

const DefyLeftSide = ({ updating = false, warning = false, success = false, error = false }: DefyLeftSideProps) => (
  <div
    className={`defySides defySidesUpdatingStatus--left ${updating ? "updating" : ""} ${success ? "success" : ""} ${
      warning ? "warning" : ""
    } ${error ? "error" : ""}`}
  >
    <div className="sideIndicator sideIndicator--warning">
      <IconWarning />
    </div>
    <div className="sideIndicator sideIndicator--success">
      <IconCheckmark size="sm" />
    </div>
    <div className="sideIndicator sideIndicator--updating">
      <IconRefresh />
    </div>
    <svg width="81" height="106" viewBox="0 0 81 106" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M74.0126 63.6703L70.3579 50.955C70.0121 49.755 69.8359 48.5125 69.8343 47.2637V20.8775C69.833 19.9149 69.45 18.9922 68.7693 18.3115C68.0886 17.6308 67.1659 17.2478 66.2033 17.2464H62.9858C62.8526 17.2466 62.7244 17.1949 62.6285 17.1025L59.1846 13.762C58.7486 13.3403 58.1653 13.1055 57.5588 13.1075H47.7416C47.3986 13.1066 47.0654 12.9925 46.7939 12.7829L43.9011 10.5432C43.4458 10.1919 42.8871 10.0009 42.312 10H34.7318C34.1124 9.9999 33.5135 10.2214 33.0432 10.6244L30.581 12.7331C30.3006 12.9741 29.9429 13.1065 29.5731 13.1062H25.2535C24.6531 13.1068 24.0714 13.3149 23.6069 13.6952L21.1277 15.732C20.8503 15.959 20.5031 16.0834 20.1446 16.0841H9.49357C8.42798 16.0851 7.40633 16.5088 6.65272 17.2621C5.89912 18.0155 5.47511 19.037 5.47373 20.1026L5.44755 42.4977L2.88852 50.7953C2.15137 53.1796 1.86896 55.6813 2.05601 58.17L5.16612 99.9405C5.25744 101.102 5.78233 102.188 6.6366 102.981C7.49088 103.773 8.61207 104.216 9.77761 104.221H53.4709C54.5085 104.223 55.5167 103.876 56.3323 103.234C57.148 102.593 57.7235 101.695 57.9659 100.687L62.2135 83.1333C62.7885 80.7579 64.1781 78.6592 66.1404 77.2024L70.5229 73.9575C72.079 72.7988 73.2461 71.1944 73.8693 69.3572C74.4926 67.5199 74.5425 65.5366 74.0126 63.6703Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

export default DefyLeftSide;
