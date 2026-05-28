import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/register-form";
import { BrandLogo } from "@/components/layout/brand-logo";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Register",
};

export default async function RegisterPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="garden-shell mx-auto max-w-xl rounded-[2rem] p-8">
        <div className="flex justify-center">
          <BrandLogo />
        </div>
        <h1 className="mt-7 text-3xl font-black tracking-tight text-[#10231c]">
          Join Garden Hacks
        </h1>
        <p className="mt-4 text-base leading-7 text-[#59655c]">
          Create a free account to publish hacks, join groups, save ideas, and
          earn community points.
        </p>
        <div className="mt-7">
          <RegisterForm />
        </div>
        <p className="mt-6 text-center text-sm text-[#59655c]">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-[#2f6f3e]">
            Login
          </Link>
        </p>
        <p className="mt-5 rounded-2xl bg-[#e9fbef] px-4 py-3 text-center text-sm font-semibold text-[#2f6f3e]">
          Welcome to the smart gardeners' community.
        </p>
      </div>
    </div>
  );
}
