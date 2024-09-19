// @ts-nocheck

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@Renderer/utils";

const tabsTriggerVariants = cva("flex flex-col", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
      tab: "tab-item tab-item--active w-full flex flex-row text-left justify-start relative items-center gap-2 font-semibold mt-0 transition-all before:absolute before:w-[32px] before:h-[68px] before:content-[''] before:bg-lightAccent before:opacity-0 before:transition-opacity before:duration-200 before:z-[1] dark:text-gray-100 after:content-[''] after:h-[24px] after:w-[3px] after:absolute after:rounded-tr-[3px] after:rounded-br-[3px] after:opacity-0 after:transition-opacity after:duration-200 after:bg-gradient-to-t after:from-secondary after:to-primary after:top-[50%] after:translate-y-[-50%] after:z-[1] hover:dark:text-gray-25 text-gray-400 dark:text-gray-100 data-[state=active]:before:opacity-50 data-[state=active]:dark:before:opacity-100 data-[state=active]:after:opacity-100 data-[state=active]:text-purple-200 data-[state=active]:dark:text-gray-25 data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
      "tab-horizontal":
        "tab-item tab-item--active w-full flex flex-row text-left justify-start relative items-center gap-2 font-semibold mt-0 transition-all dark:text-gray-100 after:content-[''] after:w-[24px] after:h-[3px] after:absolute after:rounded-br-[3px] after:rounded-bl-[3px] after:opacity-0 after:transition-opacity after:duration-200 after:bg-gradient-to-t after:from-secondary after:to-primary after:bottom-[-3px] after:translate-x-[-50%] after:left-1/2 after:z-[1] hover:dark:text-gray-25 text-gray-400 dark:text-gray-100 data-[state=active]:after:opacity-100 data-[state=active]:text-purple-200 data-[state=active]:dark:text-gray-25",
    },
    size: {
      default: "px-2 py-2.5 rounded text-sm",
      sm: "px-1 py-2 rounded-md text-xs",
      lg: "px-3 py-3 rounded text-base",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {
  asChild?: boolean;
}

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => <TabsPrimitive.List ref={ref} className={cn("justify-start", className)} {...props} />);
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(
  ({ className, variant, size, ...props }, ref) => (
    <TabsPrimitive.Trigger
      ref={ref}
      // className={cn(
      //   "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-sm dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 dark:data-[state=active]:bg-slate-950 dark:data-[state=active]:text-slate-50",
      //   className,
      // )}
      className={cn(tabsTriggerVariants({ variant, size, className }))}
      {...props}
    />
  ),
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
