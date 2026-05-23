import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/register-form";
import { Button } from "@/components/ui/button";
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
      <div className="mx-auto max-w-xl rounded-lg border border-[#dfe8d8] bg-white p-8">
        <h1 className="text-3xl font-black tracking-normal text-[#18231c]">
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
        <div className="mt-5 text-center">
          <Button href="/groups" variant="ghost">
            Explore groups first
          </Button>
        </div>
      </div>
    </div>
  );
}
