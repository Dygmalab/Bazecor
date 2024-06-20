/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@Renderer/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[3px] border-[1px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:focus:ring-slate-300",
  {
    variants: {
      variant: {
        default:
          "border-gray-500 border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/80",
        secondary:
          "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
        destructive:
          "border-transparent bg-red-500 text-slate-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/80",
        outline:
          "border-[1px] border-solid text-gray-400 border-gray-200/50 bg-transparent dark:text-gray-100 dark:border-gray-100/50",
        danger:
          "border-[1px] border-solid bg-primary/15 border-primary/15 text-primary/75 dark:bg-primary/30 dark:text-gray-50 dark:text-gray-25",
        success: "border-[1px] border-solid text-green-200 border-green-200 bg-green-200/15",
        subtle:
          "border-[1px] border-solid border-gray-50 bg-gray-50 text-gray-400 dark:text-gray-100 dark:border-gray-700 dark:bg-gray-700",
        warning:
          "border-[1px] border-solid text-orange-200 border-orange-200/35 bg-orange-200/15 dark:border-orange-200/35 dark:bg-orange-200/35",
      },
      size: {
        xs: "text-xs px-2 py-0.5",
        sm: "text-sm px-2.5 py-0.5",
        md: "text-base px-2.5 py-0.5",
        lg: "text-lg px-2.5 py-0.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
