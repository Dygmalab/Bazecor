// -*- mode: js-jsx -*-
/* Bazecor
 * Copyright (C) 2024  Dygmalab, Inc.
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
import { Button } from "@Renderer/components/atoms/Button";
import Heading from "@Renderer/components/atoms/Heading";

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

interface ToasMessageProps {
  title: string;
  content?: string;
  icon?: React.ReactNode;
  onClickAction?: (...args: any[]) => any;
  clickActionText?: string;
  onClickDismiss?: (...args: any[]) => any;
  clickDismissText?: string;
}

const ToastMessage: React.FC<ToasMessageProps> = ({
  title,
  content,
  icon,
  onClickAction,
  clickActionText,
  onClickDismiss,
  clickDismissText,
}) => (
  <div className="toastContentWrapper">
    <div
      className={`toastBody flex flex-nowrap py-6 px-8 ${onClickAction ? "yeah" : "meh"} ${icon ? "hasIcon pl-[1rem]" : "noIcon"}`}
    >
      {icon && <div className="toastIcon w-[32px] [&_svg]:mt-[-6px]">{icon}</div>}
      <div className={`toastBodyInner ${icon ? "pl-[8px]" : ""}`}>
        {title && (
          <Heading text={title} headingLevel={4} renderAs="h4" className="mb-1 -mt-1">
            {title}
          </Heading>
        )}
        <div className="toastContent text-2ssm font-medium leading-snug" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
    {onClickAction || onClickDismiss ? (
      <div className="toastFooter flex flex-nowrap justify-end pt-0 px-[32px] pb-[24px] gap-2">
        <Button variant="outline" onClick={onClickDismiss} size="sm">
          {clickDismissText}
        </Button>
        <Button variant="primary" onClick={onClickAction} size="sm">
          {clickActionText}
        </Button>
      </div>
    ) : (
      ""
    )}
  </div>
);

export default ToastMessage;
