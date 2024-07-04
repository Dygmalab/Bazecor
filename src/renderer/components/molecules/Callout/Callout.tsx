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

import React, { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@Renderer/components/atoms/Alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@Renderer/components/atoms/Dialog";

interface CalloutProps {
  children: React.ReactNode;
  title?: string;
  media?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  hasVideo?: boolean;
  videoDuration?: string;
  videoTitle?: string;
}

const Callout = ({
  children,
  title,
  media,
  size = "md",
  className,
  hasVideo = false,
  videoDuration,
  videoTitle,
}: CalloutProps) => {
  const [modalCallOut, setModalCallOut] = useState(false);

  return (
    <>
      <Alert size={size} behaviour="callout" className={`${hasVideo && "pr-11"} ${className}`}>
        <svg className="callOutIcon" width="36" height="37" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle
            cx="19"
            cy="20"
            r="17"
            fill="currentColor"
            className="infoShadow fill-gray-800/10 dark:fill-gray-800/20 mix-blend-multiply"
          />
          <circle
            cx="17"
            cy="17"
            r="16.5"
            fill="currentColor"
            stroke="currentColor"
            className="infoCircle fill-gray-100 stroke-gray-200 dark:fill-gray-700 dark:stroke-gray-500"
          />
          <path
            d="M17.186 10.688C17.21 10.172 17.396 9.776 17.744 9.5C18.104 9.224 18.53 9.086 19.022 9.086C19.466 9.086 19.802 9.194 20.03 9.41C20.27 9.614 20.378 9.902 20.354 10.274C20.33 10.742 20.138 11.126 19.778 11.426C19.418 11.714 18.986 11.858 18.482 11.858C18.062 11.858 17.732 11.756 17.492 11.552C17.264 11.336 17.162 11.048 17.186 10.688ZM16.502 15.224C16.706 14.624 16.64 14.324 16.304 14.324C16.088 14.324 15.89 14.432 15.71 14.648C15.53 14.864 15.344 15.23 15.152 15.746L14.792 16.664H14.45L14.954 15.296C15.122 14.816 15.332 14.444 15.584 14.18C15.848 13.916 16.136 13.73 16.448 13.622C16.772 13.502 17.108 13.442 17.456 13.442C17.876 13.442 18.206 13.52 18.446 13.676C18.686 13.832 18.848 14.036 18.932 14.288C19.016 14.528 19.046 14.798 19.022 15.098C18.998 15.386 18.938 15.674 18.842 15.962L16.952 21.47C16.844 21.794 16.814 22.028 16.862 22.172C16.922 22.304 17.036 22.37 17.204 22.37C17.36 22.37 17.528 22.28 17.708 22.1C17.9 21.92 18.11 21.536 18.338 20.948L18.662 20.084H19.004L18.536 21.398C18.368 21.89 18.152 22.268 17.888 22.532C17.624 22.796 17.336 22.982 17.024 23.09C16.724 23.198 16.418 23.252 16.106 23.252C15.59 23.252 15.194 23.138 14.918 22.91C14.654 22.682 14.51 22.352 14.486 21.92C14.462 21.488 14.546 20.978 14.738 20.39L16.502 15.224Z"
            fill="currentColor"
            className="iconInfo fill-white"
          />
        </svg>
        {title && <AlertTitle>{title}</AlertTitle>}
        <AlertDescription>{children}</AlertDescription>
        {hasVideo && (
          <div className="playCounter absolute right-[-18px] top-4" onClick={() => setModalCallOut(true)} aria-hidden="true">
            <div className="playCounterInner flex relative items-center gap-1 p-0.5 rounded-sm backdrop-blur-sm overflow-hidden bg-gray-400/50 before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-linear before:bg-[length:300%] before:transition-all before:duration-300 before:opacity-0 hover:before:opacity-100 hover:cursor-pointer">
              <div className="playCounterIcon relative self-center pt-0 pr-[3px] pb-0.5 pl-[6px] leading-none">
                <svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8.47434 5.4674C8.95355 5.78359 8.95355 6.48668 8.47434 6.80288L1.36206 11.4958C0.83017 11.8467 0.121463 11.4653 0.121463 10.828L0.121464 1.44224C0.121464 0.805008 0.830172 0.423553 1.36206 0.774506L8.47434 5.4674Z"
                    fill="white"
                  />
                </svg>
              </div>
              <div className="playCounterTimer bg-gray-400/30 text-gray-25 font-semibold backdrop-blur-sm rounded-[3px] leading-[1.5em] py-0.5 px-1 text-[10px]">
                {videoDuration}
              </div>
            </div>
          </div>
        )}
      </Alert>

      {hasVideo && (
        <Dialog open={modalCallOut} onOpenChange={() => setModalCallOut(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{videoTitle}</DialogTitle>
            </DialogHeader>
            <div className="px-6 pb-4 mt-2">
              <div className="modalContent">
                <div className="embed-responsive embed-responsive-16by9 w-full aspect-video">
                  <iframe
                    className="embed-responsive-item w-full h-full"
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${media}`}
                    title={videoTitle}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default Callout;
