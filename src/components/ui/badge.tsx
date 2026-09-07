import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type * as React from "react";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-bold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-forest text-white",
        gold: "bg-gold/10 text-gold",
        soft: "bg-shell text-muted-foreground",
        outline: "border-[1.5px] border-border text-muted-foreground",
      },
      size: { default: "px-3 py-1 text-[.75rem]", sm: "px-2 py-0.5 text-[.68rem]" },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}
export { badgeVariants };
