import React from "react";

const DefyBatteryIndicatorRight = ({ batteryStatus, batteryHeight }) => {
  const maskHash = `${Date.now()}-${(Math.random() + 1).toString(36).substring(7)}-right`;
  return (
    <svg
      className="defy-battery-indicator"
      width="99"
      height="127"
      viewBox="0 0 99 127"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {batteryStatus == 4 ? (
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
              d="M2.65234 79.6C3.45234 82 4.95233 84.1 7.05233 85.6L12.8523 89.8C15.4523 91.7 17.2523 94.4 18.0523 97.5L23.5523 120.5C23.8523 121.8 24.6523 123 25.6523 123.8C26.7523 124.6 28.0523 125.1 29.4523 125.1H86.8523C88.3523 125.1 89.8523 124.5 90.9523 123.5C92.0523 122.5 92.7523 121 92.8523 119.5L96.9523 65C97.1523 61.8 96.8523 58.5 95.8523 55.4L92.4523 44.5V15.3C92.4523 13.9 91.8523 12.6 90.9523 11.6C89.9523 10.6 88.6523 10.1 87.2523 10.1H73.2523C72.7523 10.1 72.3523 9.9 71.9523 9.6L68.6523 6.9C68.0523 6.4 67.2523 6.1 66.4523 6.1H60.7523C60.2523 6.1 59.7523 5.9 59.4523 5.6L56.2523 2.8C55.6523 2.3 54.8523 2 54.0523 2H44.1523C43.3523 2 42.6523 2.3 42.0523 2.7L38.2523 5.6C37.8523 5.9 37.4523 6 37.0523 6H24.1523C23.3523 6 22.5523 6.3 22.0523 6.9L17.5523 11.3C17.4523 11.4 17.2523 11.5 17.0523 11.5H12.8523C11.5523 11.5 10.3523 12 9.45233 12.9C8.55233 13.8 8.05233 15 8.05233 16.2V50.6C8.05233 52.2 7.85234 53.9 7.35234 55.4L2.55233 72C1.75233 74.6 1.85234 77.2 2.65234 79.6Z"
              stroke="#3F425A"
              strokeWidth="3"
              strokeMiterlimit="10"
              strokeLinecap="round"
            />
            <path
              opacity="0.5"
              d="M84.1522 121.1C86.7522 121.1 88.9522 119.1 89.1522 116.4L92.8522 64.5996C93.0522 61.7996 92.7522 59.0996 91.9522 56.4996L88.5522 45.4996C88.4522 45.1996 88.4522 44.8996 88.4522 44.5996V16.8996C88.4522 15.2996 87.1522 13.9996 85.5522 13.9996H73.5522C71.9522 13.9996 70.3522 13.3996 69.0522 12.3996L67.0522 10.7996C66.4522 10.2996 65.8522 10.0996 65.0522 10.0996H61.8522C59.6522 10.0996 57.5522 9.29961 55.9522 7.89961L54.6522 6.79961C54.0522 6.29961 53.3522 6.09961 52.6522 6.09961H45.3522C44.6522 6.09961 44.0522 6.29961 43.4522 6.69961L40.6522 8.89961C39.5522 9.69961 38.2522 10.1996 36.9522 10.1996H25.6522C24.8522 10.1996 24.0522 10.4996 23.4522 11.0996L20.1522 14.2996C19.2522 15.0996 18.1522 15.5996 16.9522 15.5996H14.8522C13.2522 15.5996 11.9522 16.8996 11.9522 18.4996V50.7996C11.9522 52.7996 11.6522 54.7996 11.1522 56.6996L6.35217 73.2996C5.85217 74.8996 5.95216 76.6996 6.45216 78.2996C7.05216 79.8996 8.05216 81.2996 9.45216 82.3996L15.1522 86.5996C18.4522 89.0996 20.8522 92.5996 21.8522 96.5996L26.5522 117.2C27.0522 119.5 29.0522 121.1 31.4522 121.1H84.1522Z"
              fill="#3F425A"
            />
          </mask>
          <g mask={`url(#mask-disconnected-${maskHash}`}>
            <path d="M-0.5 -1.5L108.5 133V-1.5H-0.5Z" className="fillBaseDisconnected" fill="currentColor" />
            <path d="M101.5 133L-0.5 5.5V133H101.5Z" className="fillBaseDisconnected" fill="currentColor" />
          </g>
        </>
      ) : (
        <>
          <path
            d="M2.63672 79.6C3.43672 82 4.93671 84.1 7.03671 85.6L12.8367 89.8C15.4367 91.7 17.2367 94.4 18.0367 97.5L23.5367 120.5C23.8367 121.8 24.6367 123 25.6367 123.8C26.7367 124.6 28.0367 125.1 29.4367 125.1H86.8367C88.3367 125.1 89.8367 124.5 90.9367 123.5C92.0367 122.5 92.7367 121 92.8367 119.5L96.9367 65C97.1367 61.8 96.8367 58.5 95.8367 55.4L92.4367 44.5V15.3C92.4367 13.9 91.8367 12.6 90.9367 11.6C89.9367 10.6 88.6367 10.1 87.2367 10.1H73.2367C72.7367 10.1 72.3367 9.9 71.9367 9.6L68.6367 6.9C68.0367 6.4 67.2367 6.1 66.4367 6.1H60.7367C60.2367 6.1 59.7367 5.9 59.4367 5.6L56.2367 2.8C55.6367 2.3 54.8367 2 54.0367 2H44.1367C43.3367 2 42.6367 2.3 42.0367 2.7L38.2367 5.6C37.8367 5.9 37.4367 6 37.0367 6H24.1367C23.3367 6 22.5367 6.3 22.0367 6.9L17.5367 11.3C17.4367 11.4 17.2367 11.5 17.0367 11.5H12.8367C11.5367 11.5 10.3367 12 9.4367 12.9C8.5367 13.8 8.03671 15 8.03671 16.2V50.6C8.03671 52.2 7.83671 53.9 7.33671 55.4L2.53671 72C1.73671 74.6 1.83672 77.2 2.63672 79.6Z"
            className="shapeStroke"
            strokeWidth="3"
            strokeMiterlimit="10"
            strokeLinecap="round"
          />
          <path
            d="M84.1365 121.1C86.7365 121.1 88.9365 119.1 89.1365 116.4L92.8365 64.5996C93.0365 61.7996 92.7365 59.0996 91.9365 56.4996L88.5365 45.4996C88.4365 45.1996 88.4365 44.8996 88.4365 44.5996V16.8996C88.4365 15.2996 87.1365 13.9996 85.5365 13.9996H73.5365C71.9365 13.9996 70.3365 13.3996 69.0365 12.3996L67.0365 10.7996C66.4365 10.2996 65.8365 10.0996 65.0365 10.0996H61.8365C59.6365 10.0996 57.5365 9.29961 55.9365 7.89961L54.6365 6.79961C54.0365 6.29961 53.3365 6.09961 52.6365 6.09961H45.3365C44.6365 6.09961 44.0365 6.29961 43.4365 6.69961L40.6365 8.89961C39.5365 9.69961 38.2365 10.1996 36.9365 10.1996H25.6365C24.8365 10.1996 24.0365 10.4996 23.4365 11.0996L20.1365 14.2996C19.2365 15.0996 18.1365 15.5996 16.9365 15.5996H14.8365C13.2365 15.5996 11.9365 16.8996 11.9365 18.4996V50.7996C11.9365 52.7996 11.6365 54.7996 11.1365 56.6996L6.33654 73.2996C5.83654 74.8996 5.93653 76.6996 6.43653 78.2996C7.03653 79.8996 8.03653 81.2996 9.43653 82.3996L15.1365 86.5996C18.4365 89.0996 20.8365 92.5996 21.8365 96.5996L26.5365 117.2C27.0365 119.5 29.0365 121.1 31.4365 121.1H84.1365Z"
            className="shapeFill"
          />
          <path
            d="M84.1365 121.1C86.7365 121.1 88.9365 119.1 89.1365 116.4L92.8365 64.5996C93.0365 61.7996 92.7365 59.0996 91.9365 56.4996L88.5365 45.4996C88.4365 45.1996 88.4365 44.8996 88.4365 44.5996V16.8996C88.4365 15.2996 87.1365 13.9996 85.5365 13.9996H73.5365C71.9365 13.9996 70.3365 13.3996 69.0365 12.3996L67.0365 10.7996C66.4365 10.2996 65.8365 10.0996 65.0365 10.0996H61.8365C59.6365 10.0996 57.5365 9.29961 55.9365 7.89961L54.6365 6.79961C54.0365 6.29961 53.3365 6.09961 52.6365 6.09961H45.3365C44.6365 6.09961 44.0365 6.29961 43.4365 6.69961L40.6365 8.89961C39.5365 9.69961 38.2365 10.1996 36.9365 10.1996H25.6365C24.8365 10.1996 24.0365 10.4996 23.4365 11.0996L20.1365 14.2996C19.2365 15.0996 18.1365 15.5996 16.9365 15.5996H14.8365C13.2365 15.5996 11.9365 16.8996 11.9365 18.4996V50.7996C11.9365 52.7996 11.6365 54.7996 11.1365 56.6996L6.33654 73.2996C5.83654 74.8996 5.93653 76.6996 6.43653 78.2996C7.03653 79.8996 8.03653 81.2996 9.43653 82.3996L15.1365 86.5996C18.4365 89.0996 20.8365 92.5996 21.8365 96.5996L26.5365 117.2C27.0365 119.5 29.0365 121.1 31.4365 121.1H84.1365Z"
            className="shapeIndicator"
          />
        </>
      )}

      <mask
        id={`mask0_4143_258864${maskHash}`}
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

      {batteryStatus == 0 || batteryStatus == 2 ? (
        <g mask={`url(#mask0_4143_258864${maskHash})`}>
          <rect x="-94" y="132" width="89" height={batteryStatus == 0 ? batteryHeight : 115} className="levelIndicator" />
        </g>
      ) : (
        ""
      )}
      {batteryStatus == 1 ? (
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
      {batteryStatus == 3 ? (
        <path
          d="M54.4267 68.496C54.4267 68.832 54.2347 69 53.8507 69H51.4027C51.2267 69 51.1067 68.968 51.0427 68.904C50.9787 68.824 50.9467 68.712 50.9467 68.568V65.904C50.9467 65.648 51.0587 65.52 51.2827 65.52H54.1147C54.3227 65.52 54.4267 65.632 54.4267 65.856V68.496ZM47.2747 54.912C47.1627 54.88 47.0987 54.816 47.0827 54.72C47.0667 54.624 47.0747 54.536 47.1067 54.456C47.6187 53.352 48.3867 52.496 49.4107 51.888C50.4507 51.264 51.6667 50.952 53.0587 50.952C54.2267 50.952 55.2347 51.144 56.0827 51.528C56.9307 51.896 57.5867 52.4 58.0507 53.04C58.5307 53.664 58.7707 54.376 58.7707 55.176C58.7707 55.96 58.6027 56.632 58.2667 57.192C57.9467 57.736 57.5547 58.232 57.0907 58.68C56.6267 59.128 56.1547 59.576 55.6747 60.024C55.1947 60.456 54.7867 60.936 54.4507 61.464C54.1307 61.992 53.9707 62.632 53.9707 63.384C53.9707 63.496 53.9307 63.592 53.8507 63.672C53.7867 63.752 53.6907 63.792 53.5627 63.792H51.8587C51.5707 63.792 51.4267 63.632 51.4267 63.312C51.4267 62.448 51.5707 61.704 51.8587 61.08C52.1467 60.44 52.4987 59.88 52.9147 59.4C53.3307 58.92 53.7467 58.472 54.1627 58.056C54.5787 57.624 54.9307 57.2 55.2187 56.784C55.5067 56.352 55.6507 55.872 55.6507 55.344C55.6507 54.672 55.4027 54.136 54.9067 53.736C54.4267 53.336 53.8027 53.136 53.0347 53.136C52.5867 53.136 52.1387 53.224 51.6907 53.4C51.2587 53.576 50.8667 53.824 50.5147 54.144C50.1787 54.464 49.9227 54.832 49.7467 55.248C49.6987 55.344 49.6427 55.408 49.5787 55.44C49.5307 55.456 49.4427 55.456 49.3147 55.44L47.2747 54.912Z"
          fill="#FF6B6B"
        />
      ) : (
        ""
      )}
      {batteryStatus == 4 ? <path d="M106 130L2 1" stroke="currentColor" className="lineDisconnected" strokeWidth="3" /> : ""}
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

export default DefyBatteryIndicatorRight;
