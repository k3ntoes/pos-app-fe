import { cn } from "@/lib/utils";
import * as React from "react";

interface DialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange?.(false);
      }
    };
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click to close dialog */}
      <div
        role="presentation"
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => {
          onOpenChange?.(false);
        }}
      />
      <div className="relative z-50 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl ring-1 ring-black/5 animate-in fade-in-90 zoom-in-95">
        {children}
      </div>
    </div>
  );
}

export function DialogContent({
  children,
  className,
}: { children: React.ReactNode; className?: string }) {
  return <div className={cn("space-y-4", className)}>{children}</div>;
}

export function DialogHeader({
  children,
  className,
}: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}>
      {children}
    </div>
  );
}

export function DialogTitle({
  children,
  className,
}: { children: React.ReactNode; className?: string }) {
  return (
    <h2
      className={cn("text-lg font-semibold leading-none tracking-tight text-gray-900", className)}
    >
      {children}
    </h2>
  );
}

export function DialogDescription({
  children,
  className,
}: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-sm text-gray-500", className)}>{children}</p>;
}

export function DialogFooter({
  children,
  className,
}: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
