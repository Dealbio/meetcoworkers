import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn("min-h-12 w-full rounded-xl border border-ink/15 bg-white px-4 text-base text-ink outline-none placeholder:text-ink/40 focus:border-moss focus:ring-2 focus:ring-moss/10", className)} {...props} />
));
Input.displayName = "Input";
