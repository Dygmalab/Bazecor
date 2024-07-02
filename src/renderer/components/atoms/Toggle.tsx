import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@Renderer/utils";

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50  dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300",
  {
    variants: {
      variant: {
        default:
          "font-semibold bg-gradient-to-r text-gray-400 dark:text-gray-200 hover:text-gray-500 dark:hover:text-gray-25 from-gray-100/5 to-white/0 dark:from-white/5 dark:to-white/0 hover:from-purple-100/10 hover:to-purple-100/5 dark:hover:from-white/10 dark:hover:to-white/0 data-[state=on]:from-purple-100 data-[state=on]:to-purple-300 dark:data-[state=on]:from-[#6A7088] dark:data-[state=on]:to-[#57617E] data-[state=on]:text-gray-25 dark:data-[state=on]:text-gray-25 data-[state=on]:pointer-events-none dark:shadow-md",
        outline:
          "border border-slate-200 bg-transparent hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-50",
      },
      size: {
        default: "h-9 px-[16px] text-[13px] rounded-sm",
        sm: "h-8 px-2.5 text-[11px] rounded-2sm",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root ref={ref} className={cn(toggleVariants({ variant, size, className }))} {...props} />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
