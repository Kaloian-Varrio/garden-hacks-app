import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { BrandLogo } from "@/components/layout/brand-logo";
import { Button } from "@/components/ui/button";
import { getSafeInternalRedirect } from "@/lib/auth/redirect";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Login",
};

type LoginPageProps = {
  searchParams: Promise<{
    registered?: string;
    redirect?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getCurrentUser();

  const { registered, redirect: redirectParam } = await searchParams;
  const redirectTo = getSafeInternalRedirect(redirectParam);

  if (user) {
    redirect(redirectTo ?? "/dashboard");
  }

  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="garden-shell mx-auto max-w-xl rounded-[2rem] p-8">
        <div className="flex justify-center">
          <BrandLogo />
        </div>
        <h1 className="mt-7 text-3xl font-black tracking-tight text-[#10231c]">
          Login
        </h1>
        <p className="mt-4 text-base leading-7 text-[#59655c]">
          Welcome back. Login to reach your Garden Hacks dashboard.
        </p>
        {registered === "1" ? (
          <p className="mt-5 rounded-2xl border border-[#aee7c3] bg-[#e9fbef] px-4 py-3 text-sm font-bold text-[#176b49]">
            Account created. You can log in now.
          </p>
        ) : null}
        <div className="mt-7">
          <LoginForm redirectTo={redirectTo ?? undefined} />
        </div>
        <p className="mt-6 text-center text-sm text-[#59655c]">
          New here?{" "}
          <Link href="/register" className="font-bold text-[#2f6f3e]">
            Create an account
          </Link>
        </p>
        <div className="mt-5 text-center">
          <Button href="/hacks" variant="ghost">
            Browse public hacks
          </Button>
        </div>
      </div>
    </div>
  );
}
