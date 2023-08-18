import React from "react";

interface DefyBatteryIndicatorLeftProps {
  batteryStatus: number;
  batteryHeight: number;
}

const DefyBatteryIndicatorLeft = ({ batteryStatus, batteryHeight }: DefyBatteryIndicatorLeftProps) => {
  const maskHash = `${Date.now()}-${(Math.random() + 1).toString(36).substring(7)}-left`;
  return (
    <svg
      className="defy-battery-indicator"
      width="99"
      height="127"
      viewBox="0 0 99 127"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {batteryStatus === 4 ? (
        <>
          <mask
            id={`mask-disconnected-${maskHash}`}
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="99"
            height="127"
          >
            <path
              opacity="0.8"
              d="M95.9585 72.1L91.1585 55.5C90.6585 53.9 90.4585 52.3 90.4585 50.7V16.2C90.4585 14.9 89.9585 13.7 89.0585 12.9C88.1585 12 86.9585 11.5 85.6585 11.5H81.5585C81.3585 11.5 81.2585 11.4 81.0585 11.3L76.5585 6.9C75.9585 6.3 75.2585 6 74.4585 6H61.4585C60.9585 6 60.5585 5.8 60.2585 5.6L56.4585 2.7C55.8585 2.2 55.1585 2 54.3585 2H44.4585C43.6585 2 42.8585 2.3 42.2585 2.8L39.0585 5.6C38.6585 5.9 38.2585 6.1 37.7585 6.1H32.0585C31.2585 6.1 30.4585 6.4 29.8585 6.9L26.5585 9.5C26.1585 9.8 25.7585 10 25.2585 10H11.2585C9.85849 10 8.55849 10.6 7.55849 11.5C6.55849 12.5 6.05849 13.8 6.05849 15.2V44.4L2.65849 55.2C1.65849 58.3 1.35849 61.6 1.55849 64.8L5.65849 119.3C5.75849 120.8 6.45849 122.2 7.55849 123.3C8.65849 124.3 10.1585 124.9 11.6585 124.9H69.0585C70.4585 124.9 71.7585 124.5 72.8585 123.6C73.9585 122.8 74.6585 121.6 74.9585 120.3L80.5585 97.4C81.3585 94.3 83.1585 91.6 85.7585 89.7L91.5585 85.5C93.5585 84 95.1585 81.9 95.9585 79.5C96.6585 77.1 96.6585 74.5 95.9585 72.1Z"
              stroke="#3F425A"
              strokeWidth="3"
              strokeMiterlimit="10"
              strokeLinecap="round"
            />
            <path
              opacity="0.5"
              d="M14.2522 121.001C11.6522 121.001 9.45219 119.001 9.25219 116.301L5.55219 64.6006C5.35219 61.8006 5.65219 59.1006 6.45219 56.5006L9.85219 45.5006C9.95219 45.2006 9.95219 44.9006 9.95219 44.6006V16.9006C9.95219 15.3006 11.2522 14.0006 12.8522 14.0006H24.8522C26.4522 14.0006 28.0522 13.4006 29.3522 12.4006L31.3522 10.8006C31.9522 10.3006 32.5522 10.1006 33.3522 10.1006H36.5522C38.7522 10.1006 40.8522 9.30059 42.4522 7.90059L43.7522 6.80059C44.3522 6.30059 45.0522 6.10059 45.7522 6.10059H53.0522C53.7522 6.10059 54.3522 6.30059 54.9522 6.70059L57.7522 8.90059C58.8522 9.70059 60.1522 10.2006 61.4522 10.2006H72.7522C73.5522 10.2006 74.3522 10.5006 74.9522 11.1006L78.2522 14.3006C79.1522 15.1006 80.2522 15.6006 81.4522 15.6006H83.5522C85.1522 15.6006 86.4522 16.9006 86.4522 18.5006V50.8006C86.4522 52.8006 86.7522 54.8006 87.2522 56.7006L92.0522 73.3006C92.5522 74.9006 92.4522 76.7006 91.9522 78.3006C91.3522 79.9006 90.3522 81.3006 88.9522 82.4006L83.2522 86.6006C79.9522 89.1006 77.5522 92.6006 76.5522 96.6006L71.8522 117.201C71.3522 119.501 69.3522 121.101 66.9522 121.101H14.2522V121.001Z"
              fill="#3F425A"
            />
          </mask>
          <g mask={`url(#mask-disconnected-${maskHash}`}>
            <path d="M-6 -2L103 132.5V-2H-6Z" className="fillBaseDisconnected" fill="currentColor" />
            <path d="M96 132.5L-6 5V132.5H96Z" className="fillBaseDisconnected" fill="currentColor" />
          </g>
        </>
      ) : (
        <>
          <path
            d="M96.4585 72.1L91.6585 55.5C91.1585 53.9 90.9585 52.3 90.9585 50.7V16.2C90.9585 14.9 90.4585 13.7 89.5585 12.9C88.6585 12 87.4585 11.5 86.1585 11.5H82.0585C81.8585 11.5 81.7585 11.4 81.5585 11.3L77.0585 6.9C76.4585 6.3 75.7585 6 74.9585 6H61.9585C61.4585 6 61.0585 5.8 60.7585 5.6L56.9585 2.7C56.3585 2.2 55.6585 2 54.8585 2H44.9585C44.1585 2 43.3585 2.3 42.7585 2.8L39.5585 5.6C39.1585 5.9 38.7585 6.1 38.2585 6.1H32.5585C31.7585 6.1 30.9585 6.4 30.3585 6.9L27.0585 9.5C26.6585 9.8 26.2585 10 25.7585 10H11.7585C10.3585 10 9.05849 10.6 8.05849 11.5C7.05849 12.5 6.55849 13.8 6.55849 15.2V44.4L3.15849 55.2C2.15849 58.3 1.85849 61.6 2.05849 64.8L6.15849 119.3C6.25849 120.8 6.95849 122.2 8.05849 123.3C9.15849 124.3 10.6585 124.9 12.1585 124.9H69.5585C70.9585 124.9 72.2585 124.5 73.3585 123.6C74.4585 122.8 75.1585 121.6 75.4585 120.3L81.0585 97.4C81.8585 94.3 83.6585 91.6 86.2585 89.7L92.0585 85.5C94.0585 84 95.6585 81.9 96.4585 79.5C97.1585 77.1 97.1585 74.5 96.4585 72.1Z"
            className="shapeStroke"
            strokeWidth="3"
            strokeMiterlimit="10"
            strokeLinecap="round"
          />
          <path
            d="M14.7522 121.001C12.1522 121.001 9.95219 119.001 9.75219 116.301L6.05219 64.6006C5.85219 61.8006 6.15219 59.1006 6.95219 56.5006L10.3522 45.5006C10.4522 45.2006 10.4522 44.9006 10.4522 44.6006V16.9006C10.4522 15.3006 11.7522 14.0006 13.3522 14.0006H25.3522C26.9522 14.0006 28.5522 13.4006 29.8522 12.4006L31.8522 10.8006C32.4522 10.3006 33.0522 10.1006 33.8522 10.1006H37.0522C39.2522 10.1006 41.3522 9.30059 42.9522 7.90059L44.2522 6.80059C44.8522 6.30059 45.5522 6.10059 46.2522 6.10059H53.5522C54.2522 6.10059 54.8522 6.30059 55.4522 6.70059L58.2522 8.90059C59.3522 9.70059 60.6522 10.2006 61.9522 10.2006H73.2522C74.0522 10.2006 74.8522 10.5006 75.4522 11.1006L78.7522 14.3006C79.6522 15.1006 80.7522 15.6006 81.9522 15.6006H84.0522C85.6522 15.6006 86.9522 16.9006 86.9522 18.5006V50.8006C86.9522 52.8006 87.2522 54.8006 87.7522 56.7006L92.5522 73.3006C93.0522 74.9006 92.9522 76.7006 92.4522 78.3006C91.8522 79.9006 90.8522 81.3006 89.4522 82.4006L83.7522 86.6006C80.4522 89.1006 78.0522 92.6006 77.0522 96.6006L72.3522 117.201C71.8522 119.501 69.8522 121.101 67.4522 121.101H14.7522V121.001Z"
            className="shapeFill"
          />
          <path
            d="M14.7522 121.001C12.1522 121.001 9.95219 119.001 9.75219 116.301L6.05219 64.6006C5.85219 61.8006 6.15219 59.1006 6.95219 56.5006L10.3522 45.5006C10.4522 45.2006 10.4522 44.9006 10.4522 44.6006V16.9006C10.4522 15.3006 11.7522 14.0006 13.3522 14.0006H25.3522C26.9522 14.0006 28.5522 13.4006 29.8522 12.4006L31.8522 10.8006C32.4522 10.3006 33.0522 10.1006 33.8522 10.1006H37.0522C39.2522 10.1006 41.3522 9.30059 42.9522 7.90059L44.2522 6.80059C44.8522 6.30059 45.5522 6.10059 46.2522 6.10059H53.5522C54.2522 6.10059 54.8522 6.30059 55.4522 6.70059L58.2522 8.90059C59.3522 9.70059 60.6522 10.2006 61.9522 10.2006H73.2522C74.0522 10.2006 74.8522 10.5006 75.4522 11.1006L78.7522 14.3006C79.6522 15.1006 80.7522 15.6006 81.9522 15.6006H84.0522C85.6522 15.6006 86.9522 16.9006 86.9522 18.5006V50.8006C86.9522 52.8006 87.2522 54.8006 87.7522 56.7006L92.5522 73.3006C93.0522 74.9006 92.9522 76.7006 92.4522 78.3006C91.8522 79.9006 90.8522 81.3006 89.4522 82.4006L83.7522 86.6006C80.4522 89.1006 78.0522 92.6006 77.0522 96.6006L72.3522 117.201C71.8522 119.501 69.8522 121.101 67.4522 121.101H14.7522V121.001Z"
            className="shapeIndicator"
          />
          <mask
            id={`mask0_4143_258857${maskHash}`}
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
        </>
      )}

      {batteryStatus === 0 || batteryStatus === 2 ? (
        <g mask={`url(#mask0_4143_258857${maskHash})`}>
          <rect x="-94" y="132" width="89" height={batteryStatus === 0 ? batteryHeight : 115} className="levelIndicator" />
        </g>
      ) : (
        ""
      )}
      {batteryStatus === 1 ? (
        <path
          className="lightningbattery"
          d="M40.9893 63.989L51.6559 48.1001V60.3223H56.9893L46.3226 77.4334V63.989H40.9893Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      ) : (
        ""
      )}
      {batteryStatus === 3 ? (
        <path
          d="M49.7782 67.6962C49.7782 68.0322 49.5862 68.2002 49.2022 68.2002H46.7542C46.5782 68.2002 46.4582 68.1682 46.3942 68.1042C46.3302 68.0242 46.2982 67.9122 46.2982 67.7682V65.1042C46.2982 64.8482 46.4102 64.7202 46.6342 64.7202H49.4662C49.6742 64.7202 49.7782 64.8322 49.7782 65.0562V67.6962ZM42.6262 54.1122C42.5142 54.0802 42.4502 54.0162 42.4342 53.9202C42.4182 53.8242 42.4262 53.7362 42.4582 53.6562C42.9702 52.5522 43.7382 51.6962 44.7622 51.0882C45.8022 50.4642 47.0182 50.1522 48.4102 50.1522C49.5782 50.1522 50.5862 50.3442 51.4342 50.7282C52.2822 51.0962 52.9382 51.6002 53.4022 52.2402C53.8822 52.8642 54.1222 53.5762 54.1222 54.3762C54.1222 55.1602 53.9542 55.8322 53.6182 56.3922C53.2982 56.9362 52.9062 57.4322 52.4422 57.8802C51.9782 58.3282 51.5062 58.7762 51.0262 59.2242C50.5462 59.6562 50.1382 60.1362 49.8022 60.6642C49.4822 61.1922 49.3222 61.8322 49.3222 62.5842C49.3222 62.6962 49.2822 62.7922 49.2022 62.8722C49.1382 62.9522 49.0422 62.9922 48.9142 62.9922H47.2102C46.9222 62.9922 46.7782 62.8322 46.7782 62.5122C46.7782 61.6482 46.9222 60.9042 47.2102 60.2802C47.4982 59.6402 47.8502 59.0802 48.2662 58.6002C48.6822 58.1202 49.0982 57.6722 49.5142 57.2562C49.9302 56.8242 50.2822 56.4002 50.5702 55.9842C50.8582 55.5522 51.0022 55.0722 51.0022 54.5442C51.0022 53.8722 50.7542 53.3362 50.2582 52.9362C49.7782 52.5362 49.1542 52.3362 48.3862 52.3362C47.9382 52.3362 47.4902 52.4242 47.0422 52.6002C46.6102 52.7762 46.2182 53.0242 45.8662 53.3442C45.5302 53.6642 45.2742 54.0322 45.0982 54.4482C45.0502 54.5442 44.9942 54.6082 44.9302 54.6402C44.8822 54.6562 44.7942 54.6562 44.6662 54.6402L42.6262 54.1122Z"
          fill="#FF6B6B"
        />
      ) : (
        ""
      )}
      {batteryStatus === 4 ? (
        <path
          d="M106 130L2 1"
          stroke="currentColor"
          className="lineDisconnected"
          strokeWidth="3"
          style={{ transform: "translate(-5px, 0px)" }}
        />
      ) : (
        ""
      )}
      {batteryStatus === 255 ? (
        <path
          d="M50.1789 67.6962C50.1789 68.0322 49.9869 68.2002 49.6029 68.2002H47.1549C46.8509 68.2002 46.6989 68.0562 46.6989 67.7682V65.1042C46.6989 64.8482 46.8029 64.7202 47.0109 64.7202H49.8669C50.0749 64.7202 50.1789 64.8322 50.1789 65.0562V67.6962ZM49.4829 62.5842C49.4829 62.7602 49.4349 62.8882 49.3389 62.9682C49.2589 63.0322 49.1229 63.0642 48.9309 63.0642H47.8749C47.6989 63.0642 47.5869 63.0322 47.5389 62.9682C47.4909 62.9042 47.4509 62.7922 47.4189 62.6322L46.6509 50.7762C46.6349 50.6482 46.6589 50.5522 46.7229 50.4882C46.7869 50.4242 46.8669 50.3922 46.9629 50.3922H49.9389C50.1629 50.3922 50.2669 50.5042 50.2509 50.7282L49.4829 62.5842Z"
          fill="#FF6B6B"
        />
      ) : (
        ""
      )}
    </svg>
  );
};

export default DefyBatteryIndicatorLeft;
