import React from "react";

import Styled from "styled-components";

interface BannerProps {
  variant?: "warning" | "danger" | "success" | "info";
  children: React.ReactNode;
  icon?: React.ReactNode;
}
const BannerWrapper = Styled.div`
  border-radius: 8px;
  padding: 24px;
  color: ${({ theme }) => theme.styles.banner.textWarning};
  .banner-inner {
    display: flex;
    grid-gap: 24px;
  }
  p {
    font-weight: 401;
    font-size: 0.85em;
  }
  p:last-of-type {
    margin-bottom: 0;
  }
  &.warning {
    background: ${({ theme }) => theme.styles.banner.backgroundWarning};
    border: 1px solid rgba(255, 159, 67,0.25);
    .banner-icon {
      background: ${({ theme }) => theme.styles.banner.svgBackgroundWarning};
    }
  }
  .banner-icon {
    display: flex;
    flex: 0 0 42px;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    justify-content: center;
    align-items: center;
  }
`;

const Banner = ({ variant = "info", icon, children }: BannerProps) => (
  <BannerWrapper className={`${variant}`}>
    <div className="banner-inner">
      {icon && <div className="banner-icon">{icon}</div>}
      <div className="banner-content">{children}</div>
    </div>
  </BannerWrapper>
);

export default Banner;
