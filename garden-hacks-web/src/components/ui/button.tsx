import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "destructive"
  | "vote-positive"
  | "vote-negative";

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  href: string;
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "garden-btn-primary",
  secondary: "garden-btn-secondary",
  ghost: "garden-btn-ghost",
  outline: "garden-btn-outline",
  destructive: "garden-btn-destructive",
  "vote-positive": "garden-btn-vote-positive",
  "vote-negative": "garden-btn-vote-negative",
};

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <Link
      className={`garden-btn garden-focus ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
