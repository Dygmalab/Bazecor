/* eslint-disable react/jsx-props-no-spreading */
// @ts-nocheck

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@Renderer/utils";

const switchVariants = cva("peer inline-flex", {
  variants: {
    variant: {
      default:
        "shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-purple-300 data-[state=unchecked]:bg-gray-50 dark:focus-visible:ring-slate-300 dark:focus-visible:ring-offset-slate-950 dark:data-[state=checked]:bg-purple-300 dark:data-[state=unchecked]:bg-gray-600 [&>*]:pointer-events-none [&>*]:block [&>*]:rounded-full [&>*]:bg-gray-100 [&>*]:dark:bg-gray-300 [&>*]:border [&>*]:shadow-lg [&>*]:ring-0 [&>*]:transition-transform [&>*]:data-[state=checked]:bg-gray-25 [&>*]:dark:data-[state=checked]:bg-gray-25 data-[state=unchecked]:translate-x-0 [&>*]:data-[state=checked]:translate-x-[28px] data-[state=unchecked]:border-gray-300 [&>*]:data-[state=checked]:border-purple-100 [&>*]:dark:data-[state=unchecked]:border-gray-700 [&>*]:dark:data-[state=checked]:border-purple-100 [&>*]:data-[state=checked]:shadown-lg",
    },
    size: {
      md: "h-[32px] w-[60px] px-[4px] py-[4px] [&>*]:h-[24px] [&>*]:w-[24px] [&>*]:data-[state=checked]:translate-x-[28px]",
      sm: "h-[28px] w-[50px] px-[4px] py-[4px] [&>*]:h-[20px] [&>*]:w-[20px] [&>*]:data-[state=checked]:translate-x-[21px]",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & VariantProps<typeof switchVariants>
>(({ className, variant, size, ...props }, ref) => (
  <SwitchPrimitives.Root className={cn(switchVariants({ variant, size, className }))} {...props} ref={ref}>
    <SwitchPrimitives.Thumb className={cn("")} />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
