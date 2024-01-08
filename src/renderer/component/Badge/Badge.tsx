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

const Style = Styled.div`
.badge {
	border-radius: 3px;
	font-size: 13px;
	font-weight: 600;
	padding: 8px 12px;
	border: 1px solid ${({ theme }) => theme.colors.gray500};
  color: ${({ theme }) => theme.styles.badge.textColor};
  &.success {
    color: ${({ theme }) => theme.colors.brandSuccess};
    border: 1px solid ${({ theme }) => theme.colors.brandSuccess};
  }
  &.danger-low {
    border: 1px solid ${({ theme }) => theme.styles.badge.dangerLowBG};
    background-color: ${({ theme }) => theme.styles.badge.dangerLowBG};
    color: ${({ theme }) => theme.styles.badge.dangerLowText};
  }
  &.warning {
    border: 1px solid ${({ theme }) => theme.styles.badge.warningBG};
    background-color: ${({ theme }) => theme.styles.badge.warningBG};
    color: ${({ theme }) => theme.styles.badge.dangerLowText};
  }
  &.subtle {
    border:1px solid ${({ theme }) => theme.styles.badge.subtleBGColor};
    background-color: ${({ theme }) => theme.styles.badge.subtleBGColor};
    color: ${({ theme }) => theme.styles.badge.subtleColor};
  }
  &.sm {
    font-size: 0.6875rem;
    padding: 0.25rem 0.5rem;
  }
}
`;
interface BadgeProps {
  content?: string;
  icon?: any;
  size?: "sm" | "md" | "lg";
  variation?: "primary" | "secondary" | "tertiary" | "info" | "warning" | "success" | "danger" | "danger-low" | "subtle";
  className?: string;
}

function Badge({ content, icon, size, variation, className }: BadgeProps) {
  return (
    <Style className={className}>
      <div className={`badge ${size || ""} ${variation || ""} ${icon ? "hasIcon" : ""} `}>
        {icon && icon}
        {content && <span dangerouslySetInnerHTML={{ __html: content }} />}
      </div>
    </Style>
  );
}

export default Badge;
