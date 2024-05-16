import React from "react";

import { IconRefresh, IconWarning, IconCheckmark } from "@Renderer/components/atoms/icons";

interface DefyRightSideProps {
  updating?: boolean;
  warning?: boolean;
  success?: boolean;
  error?: boolean;
}

const DefyRightSide = ({ updating, warning, success, error }: DefyRightSideProps) => (
  <div
    className={`defySides defySidesUpdatingStatus--right ${updating ? "updating" : ""} ${success ? "success" : ""} ${
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
        d="M2.36244 63.6703L6.01707 50.955C6.36291 49.755 6.53914 48.5125 6.54066 47.2637V20.8775C6.54204 19.9149 6.92505 18.9922 7.60571 18.3115C8.28636 17.6308 9.20913 17.2478 10.1717 17.2464H13.3892C13.5224 17.2466 13.6506 17.1949 13.7465 17.1025L17.1904 13.762C17.6264 13.3403 18.2097 13.1055 18.8162 13.1075H28.6334C28.9764 13.1066 29.3096 12.9925 29.5811 12.7829L32.4739 10.5432C32.9292 10.1919 33.4879 10.0009 34.063 10H41.6432C42.2626 9.9999 42.8615 10.2214 43.3318 10.6244L45.794 12.7331C46.0744 12.9741 46.4321 13.1065 46.8019 13.1062H51.1215C51.7219 13.1068 52.3036 13.3149 52.7681 13.6952L55.2473 15.732C55.5247 15.959 55.8719 16.0834 56.2304 16.0841H66.8814C67.947 16.0851 68.9687 16.5088 69.7223 17.2621C70.4759 18.0155 70.8999 19.037 70.9013 20.1026L70.9275 42.4977L73.4865 50.7953C74.2236 53.1796 74.506 55.6813 74.319 58.17L71.2089 99.9405C71.1176 101.102 70.5927 102.188 69.7384 102.981C68.8841 103.773 67.7629 104.216 66.5974 104.221H22.9041C21.8665 104.223 20.8583 103.876 20.0427 103.234C19.227 102.593 18.6515 101.695 18.4091 100.687L14.1615 83.1333C13.5865 80.7579 12.1969 78.6592 10.2346 77.2024L5.85214 73.9575C4.29602 72.7988 3.12893 71.1944 2.50568 69.3572C1.88242 67.5199 1.83247 65.5366 2.36244 63.6703Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

export default DefyRightSide;
