import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { HackForm } from "@/components/dashboard/hack-form";
import { getCurrentUser } from "@/lib/auth/session";
import {
  getHackFormInitialValues,
  getHackFormOptions,
} from "@/lib/dashboard/queries";

type EditHackPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: "Edit Hack",
};

export default async function EditHackPage({ params }: EditHackPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const hackId = Number(id);

  if (!Number.isInteger(hackId) || hackId <= 0) {
    notFound();
  }

  const [hack, options] = await Promise.all([
    getHackFormInitialValues(user.id, hackId),
    getHackFormOptions(),
  ]);

  if (!hack) {
    notFound();
  }

  return (
    <div className="rounded-lg border border-[#dfe8d8] bg-white p-6 shadow-sm">
      <h1 className="text-3xl font-black tracking-normal text-[#18231c]">
        Edit Hack
      </h1>
      <p className="mt-2 text-sm text-[#59655c]">
        Update your hack details, change status, or move it to another group.
      </p>
      <div className="mt-6">
        <HackForm
          mode="edit"
          hackId={hack.id}
          groups={options.groups}
          categories={options.categories}
          initialValues={hack}
        />
      </div>
    </div>
  );
}
