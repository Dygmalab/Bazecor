import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@Renderer/utils";

import Modal from "react-bootstrap/Modal";

const alertVariants = cva(
  "relative w-full rounded pl-[32px] pt-3 pr-4 pb-3 border border-[1px] font-normal [&>svg]:absolute [&>svg]:left-[-1.15rem] [&>svg]:top-[0.45em]",
  {
    variants: {
      variant: {
        default: "border-gray-100/70 dark:border-gray-600/70 bg-white/10 dark:bg-gray-800/10 leading-snug",
        destructive:
          "border-red-500/50 text-red-500 dark:border-red-500 [&>svg]:text-red-500 dark:border-red-900/50 dark:text-red-900 dark:dark:border-red-900 dark:[&>svg]:text-red-900",
      },
      size: {
        sm: "[&_.alert-content_div]:text-[13px]",
        md: "[&_.alert-content_div]:text-sm",
        lg: "[&_.alert-content_div]:text-base",
        xl: "[&_.alert-content_div]:text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  },
);

export interface AlertCustomProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  hasVideo?: boolean;
  videoDuration?: string;
  videoTitle?: string;
  media?: string;
  children: React.ReactNode;
}

const Alert = React.forwardRef<HTMLDivElement, AlertCustomProps>(
  ({ className, variant, size, hasVideo, videoDuration, videoTitle, media, children, ...props }, ref) => {
    const [modalCallOut, setModalCallOut] = React.useState(false);
    return (
      <div ref={ref} role="alert" className={cn(alertVariants({ variant, size }), className, { "pr-14": hasVideo })} {...props}>
        <svg className="callOutIcon" width="36" height="37" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle
            cx="19"
            cy="20"
            r="17"
            fill="currentColor"
            className="fill-gray-800/10 dark:fill-gray-800/20 mix-blend-multiply"
          />
          <circle
            cx="17"
            cy="17"
            r="16.5"
            fill="currentColor"
            stroke="currentColor"
            className="fill-gray-100 dark:fill-gray-700 stroke-gray-200 dark:stroke-gray-500"
          />
          <path
            d="M17.186 10.688C17.21 10.172 17.396 9.776 17.744 9.5C18.104 9.224 18.53 9.086 19.022 9.086C19.466 9.086 19.802 9.194 20.03 9.41C20.27 9.614 20.378 9.902 20.354 10.274C20.33 10.742 20.138 11.126 19.778 11.426C19.418 11.714 18.986 11.858 18.482 11.858C18.062 11.858 17.732 11.756 17.492 11.552C17.264 11.336 17.162 11.048 17.186 10.688ZM16.502 15.224C16.706 14.624 16.64 14.324 16.304 14.324C16.088 14.324 15.89 14.432 15.71 14.648C15.53 14.864 15.344 15.23 15.152 15.746L14.792 16.664H14.45L14.954 15.296C15.122 14.816 15.332 14.444 15.584 14.18C15.848 13.916 16.136 13.73 16.448 13.622C16.772 13.502 17.108 13.442 17.456 13.442C17.876 13.442 18.206 13.52 18.446 13.676C18.686 13.832 18.848 14.036 18.932 14.288C19.016 14.528 19.046 14.798 19.022 15.098C18.998 15.386 18.938 15.674 18.842 15.962L16.952 21.47C16.844 21.794 16.814 22.028 16.862 22.172C16.922 22.304 17.036 22.37 17.204 22.37C17.36 22.37 17.528 22.28 17.708 22.1C17.9 21.92 18.11 21.536 18.338 20.948L18.662 20.084H19.004L18.536 21.398C18.368 21.89 18.152 22.268 17.888 22.532C17.624 22.796 17.336 22.982 17.024 23.09C16.724 23.198 16.418 23.252 16.106 23.252C15.59 23.252 15.194 23.138 14.918 22.91C14.654 22.682 14.51 22.352 14.486 21.92C14.462 21.488 14.546 20.978 14.738 20.39L16.502 15.224Z"
            fill="currentColor"
            className="fill-white"
          />
        </svg>
        <div className="alert-content">{children}</div>
        {hasVideo && media ? (
          <>
            <div className="playCounter absolute top-4 -right-4" onClick={() => setModalCallOut(true)} aria-hidden="true">
              <div className="playCounterInner rounded-[3px] flex relative overflow-hidden items-center gap-1 p-0.5 backdrop-blur-sm bg-gray-400/50 before:content-[''] before:absolute before:w-full before:h-full before:left-0 before:opacity-0 before:transition-opacity hover:before:opacity-100 before:bg-[300%] before:bg-linear hover:cursor-pointer">
                <div className="playCounterIcon self-center leading-none relative pt-0 pr-0.5 pb-0.5 pl-1.5">
                  <svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M8.47434 5.4674C8.95355 5.78359 8.95355 6.48668 8.47434 6.80288L1.36206 11.4958C0.83017 11.8467 0.121463 11.4653 0.121463 10.828L0.121464 1.44224C0.121464 0.805008 0.830172 0.423553 1.36206 0.774506L8.47434 5.4674Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <div className="playCounterTimer rounded-sm backdrop-blur-sm px-1 py-0.5 bg-gray-400/30 text-gray-25 text-[10.5px] font-semibold">
                  {videoDuration}
                </div>
              </div>
            </div>
            <Modal
              size="lg"
              show={modalCallOut}
              onHide={() => setModalCallOut(false)}
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>{videoTitle}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="modalContent">
                  <div className="embed-responsive embed-responsive-16by9">
                    <iframe
                      className="embed-responsive-item"
                      width="560"
                      height="315"
                      src={`https://www.youtube.com/embed/${media}`}
                      title={videoTitle}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </>
        ) : (
          ""
        )}
      </div>
    );
  },
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />
  ),
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("[&_p]:leading-snug text-gray-400 dark:text-gray-25 max-w-3xl", className)} {...props} />
  ),
);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
