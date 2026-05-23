"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
      }),
    });

    const result = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    setIsSubmitting(false);

    if (!response.ok) {
      setError(result?.error ?? "Unable to register. Please try again.");
      return;
    }

    router.push("/login?registered=1");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 text-left">
      {error ? (
        <p className="rounded-md border border-[#efb5a8] bg-[#fff0eb] px-4 py-3 text-sm font-semibold text-[#8a2d1c]">
          {error}
        </p>
      ) : null}
      <label className="grid gap-2 text-sm font-semibold text-[#405046]">
        Name
        <input
          name="name"
          type="text"
          required
          autoComplete="name"
          className="h-11 rounded-md border border-[#cbd9c2] bg-[#f8faf7] px-3 text-[#18231c]"
        />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-[#405046]">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="h-11 rounded-md border border-[#cbd9c2] bg-[#f8faf7] px-3 text-[#18231c]"
        />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-[#405046]">
        Password
        <input
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="h-11 rounded-md border border-[#cbd9c2] bg-[#f8faf7] px-3 text-[#18231c]"
        />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-[#405046]">
        Confirm password
        <input
          name="confirmPassword"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="h-11 rounded-md border border-[#cbd9c2] bg-[#f8faf7] px-3 text-[#18231c]"
        />
      </label>
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#2f6f3e] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#285d35] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
