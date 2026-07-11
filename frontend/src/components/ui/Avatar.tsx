import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const colorMap: Record<string, string> = {
  A: "bg-primary-600",
  B: "bg-cyber-600",
  C: "bg-warning-600",
  D: "bg-danger-600",
  E: "bg-primary-700",
  F: "bg-cyber-700",
};

function getColor(name: string): string {
  const firstChar = name.charAt(0).toLowerCase();
  return colorMap[firstChar] || "bg-surface-600";
}

export function Avatar({ src, alt, name = "", size = "md", className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={cn("rounded-full object-cover", sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-medium text-white",
        getColor(name),
        sizes[size],
        className,
      )}
    >
      {getInitials(name)}
    </div>
  );
}
