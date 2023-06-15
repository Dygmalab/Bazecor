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

import { IconWarning } from "../../component/Icon";

const Style = Styled.div`
.defySidesUpdatingStatus {
  display: flex;
  grid-gap: 8px;
}
.defySides {
  position: relative;
  color: ${({ theme }) => theme.colors.gray500};

}
`;
const FirmwareDefyUpdatingStatus = ({ countdown, status, deviceProduct, keyboardType, icon }) => {
  return (
    <Style>
      <div className={`defySidesUpdatingStatus defySidesUpdatingStatus-${countdown}`}>
        <div className="defySides defySidesUpdatingStatus--left">
          <div className="sideIndicator sideIndicator--success">
            <IconWarning />
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
        <div className="defySides defySidesUpdatingStatus--right">
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
      </div>

      <ul>
        <li>countdown {countdown}</li>
        <li>status {status}</li>
        <li>deviceProduct {deviceProduct}</li>
        <li>keyboardType {keyboardType}</li>
        <li>icon {icon}</li>
      </ul>
    </Style>
  );
};

export default FirmwareDefyUpdatingStatus;
