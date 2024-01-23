import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@Renderer/utils";

const HeadingVariants = cva("font-semibold tracking-tight decoration-none heading", {
  variants: {
    variant: {
      default: "align-center gap-2 text-gray-500 dark:text-gray-25 tracking-tight font-semibold",
    },
    renderAs: {
      h1: "text-xl",
      h2: "text-lg",
      h3: "text-md",
      h4: "text-sm",
      h5: "text-xs uppercase",
    },
  },
  defaultVariants: {
    variant: "default",
    renderAs: "h3",
  },
});

export interface HeadingVariantsProps extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof HeadingVariants> {
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
}

const Heading: React.FC<HeadingVariantsProps> = ({ className, variant, renderAs, headingLevel = 3, children, ...props }) => {
  const Tag = `h${headingLevel}` as keyof JSX.IntrinsicElements;
  return React.createElement(Tag, { className: cn(HeadingVariants({ variant, renderAs, className })) }, children);
};

export default Heading;
