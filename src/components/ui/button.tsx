import { cn } from "@/lib/utils";
import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 min-h-11 min-w-[44px]";

    const variants = {
      default: "bg-blue-600 text-white hover:bg-blue-700 shadow",
      destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
      outline: "border border-gray-300 bg-white hover:bg-gray-100 text-gray-900 shadow-sm",
      secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 shadow-sm",
      ghost: "hover:bg-gray-100 hover:text-gray-900",
      link: "text-blue-600 underline-offset-4 hover:underline",
    };

    const sizes = {
      default: "h-11 px-4 py-2",
      sm: "h-9 rounded-md px-3 text-xs",
      lg: "h-12 rounded-md px-8 text-base",
      icon: "h-11 w-11",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
