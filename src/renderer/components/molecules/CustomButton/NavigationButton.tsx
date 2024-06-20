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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@Renderer/components/atoms/Tooltip";
import { i18n } from "@Renderer/i18n";

interface NavigationButtonProps {
  selected: boolean;
  showNotif?: boolean;
  notifText?: string;
  buttonText: string;
  icoSVG: React.ReactNode;
  disabled?: boolean;
}

function NavigationButton({
  selected,
  showNotif = false,
  notifText = false,
  buttonText,
  icoSVG,
  disabled = false,
}: NavigationButtonProps) {
  return (
    <div className="w-full">
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="tooltip-menu">
              <div
                className={`group menuLink w-full flex aspect-square justify-center relative text-center text-gray-200 hover:text-gray-500 [&_svg]:text-gray-400 hover:[&_svg]:text-gray-600 dark:text-gray-300 dark:hover:text-gray-50 dark:[&_svg]:text-gray-50 dark:hover:[&_svg]:text-gray-50 transition-colors no-underline before:content-[' '] before:absolute before:right-[-15px] before:top-1/2 before:w-[3px] before:h-[42px] before:transition-all before:z-[2] before:transform-style-3d before:translate-y-[-50%] before:rounded-r-[3px] before:bg-gradient-to-b before:from-primary before:to-secondary before:opacity-0 after:content-[' '] after:absolute after:right-[-12px] after:top-1/2 after:transform-style-3d after:translate-y-[-50%] after:w-[32px] after:h-[96px] after:bg-lightAccentLg after:z-[1] after:transition-all after:opacity-0 ${selected ? "active group/enabled before:opacity-100 after:opacity-50 dark:after:opacity-100 [&_div]:before:opacity-100 text-purple-300 hover:text-purple-300 [&_svg]:text-secondary/100 hover:[&_svg]:text-secondary/100 dark:text-gray-50 dark:hover:text-gray-50 dark:[&_svg]:text-gray-50" : ""} ${disabled ? "disabled opacity-50 pointer-events-none text-gray-200 dark:text-gray-300 " : ""}`}
              >
                <div className="menuLinkInner relative w-full aspect-square flex justify-center items-center flex-wrap py-[8px] px-[6px] [&_svg]:relative [&_svg]:z-[2] [&_svg]:flex [&_svg]:grow-0 [&_svg]:shrink-0 [&_svg]:basis-full before:absolute before:content-[' '] before:opacity-0 before:transition-all before:rounded-[6px] before:w-full before:h-full before:aspect-ratio before:left-0 before:right-0 before:z-[1] before:bg-gradient-to-tl before:from-gray-25 before:to-gray-100/50 dark:before:from-gray-800/30 dark:before:to-gray-300/30 group-hover:before:opacity-100">
                  {icoSVG}
                  {showNotif ? (
                    <div className="badge badge-primary absolute font-bold z-[3] text-[9px] right-[2px] top-[2px] py-[4px] px-[6px] bg-primary/100 text-white rounded-2xl">
                      {notifText || i18n.app.menu.badgeNew}
                    </div>
                  ) : (
                    ""
                  )}

                  <div
                    dangerouslySetInnerHTML={{ __html: buttonText }}
                    className="menuLinkText whitespace-nowrap relative font-semibold text-3xxs grow-0 shrink-0 basis-full z-[2] mb-auto"
                  />
                </div>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent className="sm:flex md:flex lg:hidden xl:hidden whitespace-nowrap text-ssm" side="right">
            <div className="whitespace-nowrap [&_br]:hidden" dangerouslySetInnerHTML={{ __html: buttonText }} />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export default NavigationButton;
