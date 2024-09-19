/* eslint-disable react/jsx-props-no-spreading */
// @ts-nocheck

import * as React from "react";
import type { ElementRef, ComponentPropsWithoutRef } from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@Renderer/utils";

const CheckboxWrapper = cva("flex flex-col", {
  variants: {
    variant: {
      default:
        "p-[2px] m-0 w-[18px] h-[18px] self-center relative rounded-sm bg-transparent border-2 border-solid border-gray-100 dark:border-gray-500 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:text-gray-600 data-[state=checked]:before:bg-green-200 dark:data-[state=checked]:before:bg-green-200 data-[state=checked]:text-gray-25 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 data-[state=checked]:border-green-200 dark:data-[state=checked]:border-green-200 [&_span]:w-full [&_span]:h-full before:content-[''] before:rounded-sm before:bg-gray-100 dark:before:bg-gray-500 before:absolute before:top-[2px] before:left-[2px] before:w-[10px] before:h-[10px]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface CheckboxWrapperProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof CheckboxWrapper> {
  asChild?: boolean;
}

const Checkbox = React.forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
  CheckboxWrapperProps
>(({ className, variant, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    // className={cn(
    //   "peer h-4 w-4 shrink-0 rounded-sm border border-slate-200 border-slate-900",
    //   className,
    // )}
    className={cn(CheckboxWrapper({ variant, className }))}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center")}>
      <Check className="h-4 w-4 relative" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
