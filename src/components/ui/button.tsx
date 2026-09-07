import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold tracking-[-.012em] transition-all duration-200 ease-swift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 active:scale-[.98]",
  {
    variants: {
      variant: {
        default: "bg-forest text-white hover:bg-forest-light",
        gold: "bg-gold text-white hover:bg-gold-light",
        outline: "border-[1.5px] border-border bg-transparent hover:bg-shell hover:border-transparent",
        white: "bg-white text-foreground hover:bg-shell",
        ghost: "hover:bg-shell",
        link: "text-gold underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 text-[.92rem]",
        sm: "h-10 px-[18px] text-[.84rem]",
        lg: "h-[54px] px-[30px] text-[.96rem]",
        icon: "h-[38px] w-[38px] rounded-full",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
