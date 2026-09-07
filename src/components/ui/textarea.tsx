import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[120px] w-full rounded-md border-[1.5px] border-border bg-white px-4 py-3 text-[.9rem] font-medium",
        "placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:border-forest",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
export { Textarea };
