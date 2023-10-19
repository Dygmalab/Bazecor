import React from "react";

import Styled from "styled-components";

const LargeButtonWrapper = Styled.button`
  display: flex;
  padding: 24px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.styles.button.buttonLarge.borderColor};
  background-color: ${({ theme }) => theme.styles.button.buttonLarge.backgroundColor};
  color: ${({ theme }) => theme.styles.button.buttonLarge.titleColor};
  grid-gap: 16px;
  align-items: center;
  text-align: left;
  min-width: 162px;
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
    className="button large-button"
    onClick={disabled ? () => {} : onClick}
    disabled={disabled}
    tabIndex={0}
  >
    {icon ? <div className="button-icon">{icon}</div> : null}
    <div className="button-content">{children}</div>
  </LargeButtonWrapper>
);

export default LargeButton;
