import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { HackForm } from "@/components/dashboard/hack-form";
import { getCurrentUser } from "@/lib/auth/session";
import { getHackFormOptions } from "@/lib/dashboard/queries";

export const metadata: Metadata = {
  title: "Create Hack",
};

export default async function CreateHackPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const options = await getHackFormOptions();

  return (
    <div className="rounded-lg border border-[#dfe8d8] bg-white p-6 shadow-sm">
      <h1 className="text-3xl font-black tracking-normal text-[#18231c]">
        Create Hack
      </h1>
      <p className="mt-2 text-sm text-[#59655c]">
        Share a practical gardening idea as a draft or publish it now.
      </p>
      <div className="mt-6">
        <HackForm mode="create" groups={options.groups} categories={options.categories} />
      </div>
    </div>
  );
}
