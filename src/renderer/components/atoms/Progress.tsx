import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@Renderer/utils";

const progressVariants = cva("relative h-[6px] w-full overflow-hidden rounded-full", {
  variants: {
    variant: {
      default: "bg-slate-100 dark:bg-slate-800",
      animated: "[&_div]:animate-[stripes_1s_linear_infinite] [&_div]:bg-repeat",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root> & VariantProps<typeof progressVariants>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, variant, value, ...props }, ref) => (
  <ProgressPrimitive.Root ref={ref} className={cn(progressVariants({ variant, className }))} {...props}>
    <ProgressPrimitive.Indicator
      className={`h-full w-full flex-1   transition-all ${variant === "animated" ? "custom-progress-striped" : ""} bg-gray-600/50 dark:bg-gray-500/50`}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
