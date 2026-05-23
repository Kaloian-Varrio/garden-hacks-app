"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    setIsSubmitting(true);
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      disabled={isSubmitting}
      onClick={handleLogout}
      className={`inline-flex min-h-11 items-center justify-center rounded-md border border-[#b7c8ad] bg-white px-5 py-2.5 text-sm font-semibold text-[#203525] transition hover:border-[#7da06d] hover:bg-[#f1f7ed] disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
    >
      {isSubmitting ? "Logging out..." : "Logout"}
    </button>
  );
}
