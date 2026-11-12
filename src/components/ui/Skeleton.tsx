import React from "react";

interface SkeletonProps {
  width?: string;
  height?: string;
  variant?: "text" | "circular" | "rectangular";
  className?: string;
}

export function Skeleton({
  width = "100%",
  height = "1rem",
  variant = "text",
  className = "",
}: SkeletonProps) {
  const variantClass =
    variant === "circular"
      ? "skeleton-circular"
      : variant === "rectangular"
        ? "skeleton-rectangular"
        : "skeleton-text";

  return (
    <div
      className={`skeleton ${variantClass} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}
