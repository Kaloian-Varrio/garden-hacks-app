import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

function IconBase({ children, size = 20, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width={size}
      {...props}
    >
      {children}
    </svg>
  );
}

export function SproutIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 22V12" />
      <path d="M12 12c-4 0-7-3-7-7 4 0 7 3 7 7Z" />
      <path d="M12 12c4 0 7-3 7-7-4 0-7 3-7 7Z" />
    </IconBase>
  );
}

export function TomatoIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 7c4.2 0 7 2.8 7 6.4S16 20 12 20s-7-3-7-6.6S7.8 7 12 7Z" />
      <path d="m12 7 1.4-3" />
      <path d="m12 7-1.4-3" />
      <path d="m12 7 3-1" />
      <path d="m12 7-3-1" />
    </IconBase>
  );
}

export function CucumberIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 15c2.2 4.5 8.8 5.1 12.6 1.3 3-3 2.4-7.7-.2-10.3" />
      <path d="M4.8 14.8c-.9-1.5-.5-3.4.8-4.6 1.6-1.5 4.3-1 5.8.5l2 2" />
      <path d="M8 13h.01" />
      <path d="M11 16h.01" />
      <path d="M15 15h.01" />
    </IconBase>
  );
}

export function LightbulbIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M8.5 14.5c-1.4-1.1-2.3-2.8-2.3-4.7A5.8 5.8 0 0 1 12 4a5.8 5.8 0 0 1 5.8 5.8c0 1.9-.9 3.6-2.3 4.7-.8.6-1.2 1.2-1.4 2H9.9c-.2-.8-.6-1.4-1.4-2Z" />
    </IconBase>
  );
}

export function CommentIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M21 12a8 8 0 0 1-8 8H7l-4 2 1.4-4A8 8 0 1 1 21 12Z" />
    </IconBase>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </IconBase>
  );
}

export function SparkIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m12 2 1.7 5.1L19 9l-5.3 1.9L12 16l-1.7-5.1L5 9l5.3-1.9L12 2Z" />
      <path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
    </IconBase>
  );
}

export function EditIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </IconBase>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6 18 21H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </IconBase>
  );
}
