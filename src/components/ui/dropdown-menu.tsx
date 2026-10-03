import { cn } from "@/lib/utils";
import * as React from "react";

interface DropdownMenuProps {
  children: React.ReactNode;
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(
            child as React.ReactElement<{
              isOpen?: boolean;
              setIsOpen?: (open: boolean) => void;
            }>,
            {
              isOpen,
              setIsOpen,
            },
          );
        }
        return child;
      })}
    </div>
  );
}

export function DropdownMenuTrigger({
  children,
  isOpen,
  setIsOpen,
  className,
}: {
  children: React.ReactNode;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => setIsOpen?.(!isOpen)}
      className={cn("inline-flex items-center justify-center min-h-[44px] min-w-[44px]", className)}
      aria-expanded={isOpen}
    >
      {children}
    </button>
  );
}

export function DropdownMenuContent({
  children,
  isOpen,
  align = "right",
  className,
}: {
  children: React.ReactNode;
  isOpen?: boolean;
  align?: "left" | "right";
  className?: string;
}) {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "absolute z-50 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-1",
        align === "right" ? "right-0" : "left-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 min-h-[44px]",
        className,
      )}
    >
      {children}
    </button>
  );
}
