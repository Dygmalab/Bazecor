// @ts-nocheck

import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@Renderer/utils";

const CardVariantsWrapper = cva("flex flex-col", {
  variants: {
    variant: {
      default: "rounded-xl bg-white/60 dark:bg-gray-800",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface CardVariantsWrapperProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof CardVariantsWrapper> {
  asChild?: boolean;
}
export interface CardVariantsTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof CardVariantsWrapper> {
  asChild?: boolean;
}

const CardVariantsTitle = cva("flex", {
  variants: {
    variant: {
      default: "align-center gap-2 text-gray-500 dark:text-gray-25 text-lg tracking-tight font-semibold",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const Card = React.forwardRef<HTMLDivElement, CardVariantsWrapperProps>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(CardVariantsWrapper({ variant, className }))} {...props} />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col px-4 pt-4 pb-3", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, CardVariantsTitleProps>(({ className, variant, ...props }, ref) => (
  <h3 ref={ref} className={cn(CardVariantsTitle({ variant, className }))} {...props} />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-slate-500 dark:text-slate-400", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
