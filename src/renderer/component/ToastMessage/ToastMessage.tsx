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
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from "react";
import Styled, { ThemeProvider } from "styled-components";
import Title from "../Title";
import ButtonConfig from "../Button/ButtonConfig";

/**
 * This ToastMessage function returns a styled body of react-toastfy object
 * The object will accept the following parameters
 *
 * @param {string} title - The text to render the title fo the Toast
 * @param {string} content [Optional] - The content to render above the title
 * @param {function} icon [Optional] - A compontent/SVG
 * @param {function} onClickAction [Optional] - The function that act when a Primary button is clicked.
 * @param {string} clickActionText [Optional] - The text to render the primary button
 * @param {function} onClickDismiss [Optional] - The function that act when a Secondary button is clicked.
 * @param {string} clickDismissText [Optional] - The text to render the secondary button
 * @returns {<ToastMessage>} ToastMessage component.
 */

const Style = Styled.div`
.toastBody {
  padding: 24px 32px;
  display: flex;
  flex-wrap: nowrap;
  &.hasIcon {
    padding-left: 16px;
    .toastIcon {
      width: 32px;
      svg {
        margin-top: -6px;
      }
    }
    .toastBodyInner {
      width: calc(100% - 32px);
      padding-left: 8px;
    }
  }
}
.toastContent {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.35em;
}
.toastFooter {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-end;
  padding: 0 32px 24px 32px;
  .button-config + .button-config {
    margin-left: 8px;
  }
  .button-config {
    color: ${({ theme }) => theme.styles.button.config.color};
    &:hover {
      ${({ theme }) => theme.styles.button.config.colorHover};
    }
  }
}
`;

interface ToasMessageProps {
  title: string;
  content?: string;
  icon?: any;
  onClickAction?: (...args: any[]) => any;
  clickActionText?: string;
  onClickDismiss?: (...args: any[]) => any;
  clickDismissText?: string;
  theme: any;
}

const ToastMessage: React.FC<ToasMessageProps> = ({
  title,
  content,
  icon,
  onClickAction,
  clickActionText,
  onClickDismiss,
  clickDismissText,
  theme,
}) => {
  const jsx = (
    <ThemeProvider theme={theme}>
      <Style theme={theme} className="toastContentWrapper">
        <div className={`toastBody ${icon ? "hasIcon" : "noIcon"}`}>
          {icon && <div className="toastIcon">{icon}</div>}
          <div className="toastBodyInner">
            {title && <Title text={title} headingLevel={4} />}
            <div className="toastContent" dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>
        {onClickAction || onClickDismiss ? (
          <div className="toastFooter">
            <ButtonConfig onClick={onClickDismiss} buttonText={clickDismissText} variation="link" size="sm" />
            <ButtonConfig onClick={onClickAction} buttonText={clickActionText} size="sm" />
          </div>
        ) : (
          ""
        )}
      </Style>
    </ThemeProvider>
  );
  return jsx;
};

export default ToastMessage;
