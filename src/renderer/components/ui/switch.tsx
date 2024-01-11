// @ts-nocheck

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@Renderer/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-[32px] w-[60px] px-[4px] py-[4px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-purple-300 data-[state=unchecked]:bg-gray-50 dark:focus-visible:ring-slate-300 dark:focus-visible:ring-offset-slate-950 dark:data-[state=checked]:bg-purple-300 dark:data-[state=unchecked]:bg-gray-600",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-[24px] w-[24px] rounded-full bg-gray-100 dark:bg-gray-300 border shadow-lg ring-0 transition-transform data-[state=checked]:bg-gray-25 data-[state=checked]:translate-x-[28px] data-[state=unchecked]:translate-x-0 data-[state=unchecked]:border-gray-300 data-[state=checked]:border-purple-100 dark:data-[state=unchecked]:border-gray-700 dark:data-[state=checked]:border-purple-100",
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
