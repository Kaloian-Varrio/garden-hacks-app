import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  href: string;
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#2f6f3e] text-white shadow-sm hover:bg-[#285d35] focus-visible:outline-[#2f6f3e]",
  secondary:
    "border border-[#b7c8ad] bg-white text-[#203525] hover:border-[#7da06d] hover:bg-[#f1f7ed] focus-visible:outline-[#7da06d]",
  ghost:
    "text-[#28472f] hover:bg-[#eaf2e6] focus-visible:outline-[#7da06d]",
};

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <Link
      className={`inline-flex min-h-11 items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
