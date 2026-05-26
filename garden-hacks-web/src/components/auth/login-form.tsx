"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({ redirectTo = "/dashboard" }: { redirectTo?: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    const result = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    setIsSubmitting(false);

    if (!response.ok) {
      setError(result?.error ?? "Unable to log in. Please try again.");
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 text-left">
      {error ? (
        <p className="rounded-2xl border border-[#ffc2ad] bg-[#fff0eb] px-4 py-3 text-sm font-bold text-[#a33a20]">
          {error}
        </p>
      ) : null}
      <label className="grid gap-2 text-sm font-bold text-[#405046]">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="h-12 rounded-2xl border border-[#b7e7d1] bg-white/90 px-4 text-[#10231c] outline-none transition focus:border-[#0f9f93] focus:ring-4 focus:ring-[#5bd8d0]/20"
        />
      </label>
      <label className="grid gap-2 text-sm font-bold text-[#405046]">
        Password
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="h-12 rounded-2xl border border-[#b7e7d1] bg-white/90 px-4 text-[#10231c] outline-none transition focus:border-[#0f9f93] focus:ring-4 focus:ring-[#5bd8d0]/20"
        />
      </label>
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-[#0f9f93] via-[#23a967] to-[#176b49] px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
