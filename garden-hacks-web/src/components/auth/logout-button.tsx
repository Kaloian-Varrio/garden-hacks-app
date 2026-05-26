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
      className={`garden-btn garden-btn-secondary disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
    >
      {isSubmitting ? "Logging out..." : "Logout"}
    </button>
  );
}
