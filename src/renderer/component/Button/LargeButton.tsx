import React from "react";

import Styled from "styled-components";

const LargeButtonWrapper = Styled.button`
  // display: flex;
  // padding: 16px 24px;
  // border-radius: 8px;
  // border: 1px solid ${({ theme }) => theme.styles.button.buttonLarge.borderColor};
  // background-color: ${({ theme }) => theme.styles.button.buttonLarge.backgroundColor};
  // color: ${({ theme }) => theme.styles.button.buttonLarge.titleColor};
  // grid-gap: 16px;
  // align-items: center;
  // text-align: left;
  // min-width: 162px;
  // transition: 300ms ease-in-out background-color, 300ms ease-in-out border-color;
  // &:hover {
  //   border-color: ${({ theme }) => theme.styles.button.buttonLarge.borderHoverColor};
  //   background-color: ${({ theme }) => theme.styles.button.buttonLarge.backgroundHoverColor};
  // }
  p {
    color: ${({ theme }) => theme.styles.button.buttonLarge.contentColor};
    margin-bottom: 0;
    font-size: 0.8em;
    line-height: 1.25em;
  }
  .button-icon {
    flex: 0 0 32px;
    svg {
      max-width: 100%;
    }
  }
  h4 {
    font-size: 1.125em;
    color: ${({ theme }) => theme.styles.button.buttonLarge.titleColor};
    margin-bottom: 0;
  }
`;

interface LargeButtonProps {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

const LargeButton = ({ icon, children, onClick, disabled = false }: LargeButtonProps) => (
  <LargeButtonWrapper
    type="button"
    className="large-button flex items-center gap-4 rounded-md py-4 px-6 border-[1px] border-solid border-gray-100 hover:border-gray-200/50 dark:border-gray-600 dark:hover:border-gray-400 bg-gray-100/25 hover:bg-gray-50/80 dark:bg-gray-600/50 hover:dark:bg-gray-600/80 transition-all text-left min-w-36 [&_p]:"
    onClick={disabled ? () => {} : onClick}
    disabled={disabled}
    tabIndex={0}
  >
    {icon ? <div className="button-icon">{icon}</div> : null}
    <div className="button-content">{children}</div>
  </LargeButtonWrapper>
);

export default LargeButton;
