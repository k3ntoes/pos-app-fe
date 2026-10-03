import { cn } from "@/lib/utils";
import * as React from "react";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
}

export function Avatar({ className, src, alt, fallback = "U", ...props }: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  return (
    <div
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200 items-center justify-center text-gray-700 font-medium text-sm",
        className,
      )}
      {...props}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt || "Avatar"}
          className="aspect-square h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span>{fallback}</span>
      )}
    </div>
  );
}
