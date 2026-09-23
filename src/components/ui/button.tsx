import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" };
export function Button({ className, variant = "primary", ...props }: Props) {
  return <button className={cn("inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50", variant === "primary" && "bg-moss text-white hover:bg-ink", variant === "secondary" && "border border-moss/20 bg-white text-ink hover:bg-mist", variant === "ghost" && "text-ink hover:bg-mist", className)} {...props} />;
}
