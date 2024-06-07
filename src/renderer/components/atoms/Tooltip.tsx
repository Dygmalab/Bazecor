import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@Renderer/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const tooltipVariants = cva(
  "z-[1500] overflow-hidden rounded-md bg-gray-25 dark:bg-gray-900 text-gray-600 tracking-tight dark:text-gray-25 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      size: {
        sm: "px-[16px] py-[8px] text-ssm [&_p]:text-ssm",
        md: "px-3 py-3 text-sm [&_p]:text-sm",
        lg: "px-3 py-3 text-sm",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

interface TooltipProps extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  children: React.ReactNode;
}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipProps & VariantProps<typeof tooltipVariants>
>(({ className, size, sideOffset = 4, children, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content ref={ref} sideOffset={sideOffset} className={cn(tooltipVariants({ size, className }))} {...props}>
      {children}
      <TooltipPrimitive.Arrow width={11} height={5} className=" [&_*]:fill-gray-25 [&_*]:dark:fill-gray-900" />
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
