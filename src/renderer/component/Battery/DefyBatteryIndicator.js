import React, { useState, useEffect } from "react";
import Styled from "styled-components";
const Style = Styled.div`
.levelIndicator {
    transform-origin: bottom left;
    transform: rotate(180deg);
}
.batterySide {
    position: relative;
}
.batterySide--percentage {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    width: 100%;
    font-weight: 700;
    letter-spacing: -0.025em;
    text-align: center;
    font-size: 1.25rem;
    color: ${({ theme }) => theme.styles.batteryIndicator.largeIndicatorPercentageColor};
    text-align: center;
}
.shapeStroke {
  stroke: ${({ theme }) => theme.styles.batteryIndicator.largeIndicatorStrokeColor};
}
.shapeFill {
  fill: ${({ theme }) => theme.styles.batteryIndicator.largeIndicatorFillColor};
}
`;

const DefyBatteryIndicator = ({ side, batteryLevel, isCharging }) => {
  const [batteryHeight, setBatteryHeight] = useState(0);

  useEffect(() => {
    if (!isCharging) {
      if (batteryLevel < 5) {
        setBatteryHeight(1);
      } else {
        setBatteryHeight((115 * batteryLevel) / 100);
      }
    }
  }, [batteryLevel, isCharging]);

  return (
    <Style>
      <div className="batterySide">
        {side == "left" ? (
          <svg
            className="defy-battery-indicator"
            width="99"
            height="127"
            viewBox="0 0 99 127"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M96.4585 72.1L91.6585 55.5C91.1585 53.9 90.9585 52.3 90.9585 50.7V16.2C90.9585 14.9 90.4585 13.7 89.5585 12.9C88.6585 12 87.4585 11.5 86.1585 11.5H82.0585C81.8585 11.5 81.7585 11.4 81.5585 11.3L77.0585 6.9C76.4585 6.3 75.7585 6 74.9585 6H61.9585C61.4585 6 61.0585 5.8 60.7585 5.6L56.9585 2.7C56.3585 2.2 55.6585 2 54.8585 2H44.9585C44.1585 2 43.3585 2.3 42.7585 2.8L39.5585 5.6C39.1585 5.9 38.7585 6.1 38.2585 6.1H32.5585C31.7585 6.1 30.9585 6.4 30.3585 6.9L27.0585 9.5C26.6585 9.8 26.2585 10 25.7585 10H11.7585C10.3585 10 9.05849 10.6 8.05849 11.5C7.05849 12.5 6.55849 13.8 6.55849 15.2V44.4L3.15849 55.2C2.15849 58.3 1.85849 61.6 2.05849 64.8L6.15849 119.3C6.25849 120.8 6.95849 122.2 8.05849 123.3C9.15849 124.3 10.6585 124.9 12.1585 124.9H69.5585C70.9585 124.9 72.2585 124.5 73.3585 123.6C74.4585 122.8 75.1585 121.6 75.4585 120.3L81.0585 97.4C81.8585 94.3 83.6585 91.6 86.2585 89.7L92.0585 85.5C94.0585 84 95.6585 81.9 96.4585 79.5C97.1585 77.1 97.1585 74.5 96.4585 72.1Z"
              className="shapeStroke"
              strokeWidth="3"
              strokeMiterlimit="10"
              strokeLinecap="round"
            />
            <path
              opacity="0.5"
              d="M14.7522 121.001C12.1522 121.001 9.95219 119.001 9.75219 116.301L6.05219 64.6006C5.85219 61.8006 6.15219 59.1006 6.95219 56.5006L10.3522 45.5006C10.4522 45.2006 10.4522 44.9006 10.4522 44.6006V16.9006C10.4522 15.3006 11.7522 14.0006 13.3522 14.0006H25.3522C26.9522 14.0006 28.5522 13.4006 29.8522 12.4006L31.8522 10.8006C32.4522 10.3006 33.0522 10.1006 33.8522 10.1006H37.0522C39.2522 10.1006 41.3522 9.30059 42.9522 7.90059L44.2522 6.80059C44.8522 6.30059 45.5522 6.10059 46.2522 6.10059H53.5522C54.2522 6.10059 54.8522 6.30059 55.4522 6.70059L58.2522 8.90059C59.3522 9.70059 60.6522 10.2006 61.9522 10.2006H73.2522C74.0522 10.2006 74.8522 10.5006 75.4522 11.1006L78.7522 14.3006C79.6522 15.1006 80.7522 15.6006 81.9522 15.6006H84.0522C85.6522 15.6006 86.9522 16.9006 86.9522 18.5006V50.8006C86.9522 52.8006 87.2522 54.8006 87.7522 56.7006L92.5522 73.3006C93.0522 74.9006 92.9522 76.7006 92.4522 78.3006C91.8522 79.9006 90.8522 81.3006 89.4522 82.4006L83.7522 86.6006C80.4522 89.1006 78.0522 92.6006 77.0522 96.6006L72.3522 117.201C71.8522 119.501 69.8522 121.101 67.4522 121.101H14.7522V121.001Z"
              className="shapeFill"
            />
            <mask
              id="mask0_4143_258857"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="5"
              y="6"
              width="88"
              height="116"
            >
              <path
                d="M14.7522 121.001C12.1522 121.001 9.95219 119.001 9.75219 116.301L6.05219 64.6006C5.85219 61.8006 6.15219 59.1006 6.95219 56.5006L10.3522 45.5006C10.4522 45.2006 10.4522 44.9006 10.4522 44.6006V16.9006C10.4522 15.3006 11.7522 14.0006 13.3522 14.0006H25.3522C26.9522 14.0006 28.5522 13.4006 29.8522 12.4006L31.8522 10.8006C32.4522 10.3006 33.0522 10.1006 33.8522 10.1006H37.0522C39.2522 10.1006 41.3522 9.30059 42.9522 7.90059L44.2522 6.80059C44.8522 6.30059 45.5522 6.10059 46.2522 6.10059H53.5522C54.2522 6.10059 54.8522 6.30059 55.4522 6.70059L58.2522 8.90059C59.3522 9.70059 60.6522 10.2006 61.9522 10.2006H73.2522C74.0522 10.2006 74.8522 10.5006 75.4522 11.1006L78.7522 14.3006C79.6522 15.1006 80.7522 15.6006 81.9522 15.6006H84.0522C85.6522 15.6006 86.9522 16.9006 86.9522 18.5006V50.8006C86.9522 52.8006 87.2522 54.8006 87.7522 56.7006L92.5522 73.3006C93.0522 74.9006 92.9522 76.7006 92.4522 78.3006C91.8522 79.9006 90.8522 81.3006 89.4522 82.4006L83.7522 86.6006C80.4522 89.1006 78.0522 92.6006 77.0522 96.6006L72.3522 117.201C71.8522 119.501 69.8522 121.101 67.4522 121.101H14.7522V121.001Z"
                fill="#57617E"
              />
            </mask>
            <g mask="url(#mask0_4143_258857)">
              <rect x="-94" y="132" width="89" height={batteryHeight} fill="#6C5CE7" className="levelIndicator" />
            </g>
          </svg>
        ) : (
          ""
        )}
        {side == "right" ? (
          <svg
            className="defy-battery-indicator"
            width="99"
            height="127"
            viewBox="0 0 99 127"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.63672 79.6C3.43672 82 4.93671 84.1 7.03671 85.6L12.8367 89.8C15.4367 91.7 17.2367 94.4 18.0367 97.5L23.5367 120.5C23.8367 121.8 24.6367 123 25.6367 123.8C26.7367 124.6 28.0367 125.1 29.4367 125.1H86.8367C88.3367 125.1 89.8367 124.5 90.9367 123.5C92.0367 122.5 92.7367 121 92.8367 119.5L96.9367 65C97.1367 61.8 96.8367 58.5 95.8367 55.4L92.4367 44.5V15.3C92.4367 13.9 91.8367 12.6 90.9367 11.6C89.9367 10.6 88.6367 10.1 87.2367 10.1H73.2367C72.7367 10.1 72.3367 9.9 71.9367 9.6L68.6367 6.9C68.0367 6.4 67.2367 6.1 66.4367 6.1H60.7367C60.2367 6.1 59.7367 5.9 59.4367 5.6L56.2367 2.8C55.6367 2.3 54.8367 2 54.0367 2H44.1367C43.3367 2 42.6367 2.3 42.0367 2.7L38.2367 5.6C37.8367 5.9 37.4367 6 37.0367 6H24.1367C23.3367 6 22.5367 6.3 22.0367 6.9L17.5367 11.3C17.4367 11.4 17.2367 11.5 17.0367 11.5H12.8367C11.5367 11.5 10.3367 12 9.4367 12.9C8.5367 13.8 8.03671 15 8.03671 16.2V50.6C8.03671 52.2 7.83671 53.9 7.33671 55.4L2.53671 72C1.73671 74.6 1.83672 77.2 2.63672 79.6Z"
              className="shapeStroke"
              strokeWidth="3"
              strokeMiterlimit="10"
              strokeLinecap="round"
            />
            <path
              opacity="0.5"
              d="M84.1365 121.1C86.7365 121.1 88.9365 119.1 89.1365 116.4L92.8365 64.5996C93.0365 61.7996 92.7365 59.0996 91.9365 56.4996L88.5365 45.4996C88.4365 45.1996 88.4365 44.8996 88.4365 44.5996V16.8996C88.4365 15.2996 87.1365 13.9996 85.5365 13.9996H73.5365C71.9365 13.9996 70.3365 13.3996 69.0365 12.3996L67.0365 10.7996C66.4365 10.2996 65.8365 10.0996 65.0365 10.0996H61.8365C59.6365 10.0996 57.5365 9.29961 55.9365 7.89961L54.6365 6.79961C54.0365 6.29961 53.3365 6.09961 52.6365 6.09961H45.3365C44.6365 6.09961 44.0365 6.29961 43.4365 6.69961L40.6365 8.89961C39.5365 9.69961 38.2365 10.1996 36.9365 10.1996H25.6365C24.8365 10.1996 24.0365 10.4996 23.4365 11.0996L20.1365 14.2996C19.2365 15.0996 18.1365 15.5996 16.9365 15.5996H14.8365C13.2365 15.5996 11.9365 16.8996 11.9365 18.4996V50.7996C11.9365 52.7996 11.6365 54.7996 11.1365 56.6996L6.33654 73.2996C5.83654 74.8996 5.93653 76.6996 6.43653 78.2996C7.03653 79.8996 8.03653 81.2996 9.43653 82.3996L15.1365 86.5996C18.4365 89.0996 20.8365 92.5996 21.8365 96.5996L26.5365 117.2C27.0365 119.5 29.0365 121.1 31.4365 121.1H84.1365Z"
              className="shapeFill"
            />
            <mask
              id="mask0_4143_258864"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="6"
              y="6"
              width="87"
              height="116"
            >
              <path
                d="M84.1365 121.1C86.7365 121.1 88.9365 119.1 89.1365 116.4L92.8365 64.5996C93.0365 61.7996 92.7365 59.0996 91.9365 56.4996L88.5365 45.4996C88.4365 45.1996 88.4365 44.8996 88.4365 44.5996V16.8996C88.4365 15.2996 87.1365 13.9996 85.5365 13.9996H73.5365C71.9365 13.9996 70.3365 13.3996 69.0365 12.3996L67.0365 10.7996C66.4365 10.2996 65.8365 10.0996 65.0365 10.0996H61.8365C59.6365 10.0996 57.5365 9.29961 55.9365 7.89961L54.6365 6.79961C54.0365 6.29961 53.3365 6.09961 52.6365 6.09961H45.3365C44.6365 6.09961 44.0365 6.29961 43.4365 6.69961L40.6365 8.89961C39.5365 9.69961 38.2365 10.1996 36.9365 10.1996H25.6365C24.8365 10.1996 24.0365 10.4996 23.4365 11.0996L20.1365 14.2996C19.2365 15.0996 18.1365 15.5996 16.9365 15.5996H14.8365C13.2365 15.5996 11.9365 16.8996 11.9365 18.4996V50.7996C11.9365 52.7996 11.6365 54.7996 11.1365 56.6996L6.33654 73.2996C5.83654 74.8996 5.93653 76.6996 6.43653 78.2996C7.03653 79.8996 8.03653 81.2996 9.43653 82.3996L15.1365 86.5996C18.4365 89.0996 20.8365 92.5996 21.8365 96.5996L26.5365 117.2C27.0365 119.5 29.0365 121.1 31.4365 121.1H84.1365Z"
                fill="#25273B"
              />
            </mask>
            <g mask="url(#mask0_4143_258864)">
              <rect x="-94" y="132" width="89" height={batteryHeight} fill="#6C5CE7" className="levelIndicator" />
            </g>
          </svg>
        ) : (
          ""
        )}
        <div className="batterySide--percentage">{batteryLevel}%</div>
      </div>
    </Style>
  );
};

export default DefyBatteryIndicator;
