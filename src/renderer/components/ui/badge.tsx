import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@Renderer/utils";

const badgeVariants = cva(
  "badge inline-flex items-center border-[1px] rounded font-semibold transition-colors focus:outline-none whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "text-gray-400 dark:text-gray-100 border-gray-100/80 bg-gray-50 dark:border-gray-800/80 dark:bg-gray-700",
        success: "text-green-200 border-green-200 dark:text-green-200 dark:border-green-200",
        warning:
          "text-orange-100/75 dark:text-gray-50 border-orange-200/15 bg-orange-200/15 dark:border-orange-200/35 dark:bg-orange-200/35",
        "danger-low":
          "text-primary/75 dark:text-gray-50 border-primary/15 bg-primary/15 dark:border-primary/35 dark:bg-primary/35",
        subtle: "text-gray-400 dark:text-gray-100 border-transparent bg-gray-50 dark:border-transparent dark:bg-gray-700",
      },
      size: {
        sm: "text-[11px] px-2 py-0.5 leading-normal",
        md: "text-xs px-3 py-2 leading-normal",
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
