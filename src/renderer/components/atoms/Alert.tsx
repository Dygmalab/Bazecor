import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@Renderer/utils";

const alertVariants = cva("relative w-full rounded-lg", {
  variants: {
    variant: {
      default:
        "bg-[#ffffff]/10 dark:bg-transparent text-gray-400 dark:text-gray-25 rounded font-normal leading-2 border-[1px] border-solid border-gray-100/70 dark:border-gray-600/70",
      destructive:
        "border-red-500/50 text-red-500 dark:border-red-500 [&>svg]:text-red-500 dark:border-red-900/50 dark:text-red-900 dark:dark:border-red-900 dark:[&>svg]:text-red-900",
    },
    behaviour: {
      default:
        "[&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:text-slate-950 dark:border-slate-800 dark:[&>svg]:text-slate-50",
      callout: "flex [&>svg]:absolute [&_svg]:left-[-18px] [&_svg]:top-4",
    },
    size: {
      sm: "text-xs px-[24px] py-[8px]",
      md: "text-sm",
      lg: "text-base",
    },
  },
  compoundVariants: [
    // Applied via:
    //   `button({ intent: "primary", size: "medium" })`
    {
      variant: "default",
      behaviour: "callout",
      size: "sm",
      className: "[&_svg]:top-[10px] [&_p]:text-ssm",
    },
  ],
  defaultVariants: {
    variant: "default",
    behaviour: "default",
    size: "md",
  },
});

const Alert = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>>(
  ({ className, variant, size, behaviour, ...props }, ref) => (
    <div ref={ref} role="alert" className={cn(alertVariants({ variant, size, behaviour, className }))} {...props} />
  ),
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
    <div ref={ref} className={cn("[&_p]:leading-snug [&_p:last-of-type]:mb-0", className)} {...props} />
  ),
);
AlertDescription.displayName = "AlertDescription";

const AlertModal = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("text-sm [&_p]:leading-snug", className)} {...props} />,
);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
