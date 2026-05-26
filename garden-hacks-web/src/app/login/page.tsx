import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
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
      <div className="mx-auto max-w-xl rounded-lg border border-[#dfe8d8] bg-white p-8">
        <h1 className="text-3xl font-black tracking-normal text-[#18231c]">
          Login
        </h1>
        <p className="mt-4 text-base leading-7 text-[#59655c]">
          Welcome back. Login to reach your Garden Hacks dashboard.
        </p>
        {registered === "1" ? (
          <p className="mt-5 rounded-md border border-[#b8d6ad] bg-[#ecf7e8] px-4 py-3 text-sm font-semibold text-[#285d35]">
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
