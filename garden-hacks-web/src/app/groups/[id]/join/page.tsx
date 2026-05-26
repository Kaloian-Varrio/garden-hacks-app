import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { acceptGroupInvite } from "@/lib/group-invitations/accept";

export const metadata: Metadata = {
  title: "Join Group",
};

type JoinGroupPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    code?: string | string[];
  }>;
};

export default async function JoinGroupPage({
  params,
  searchParams,
}: JoinGroupPageProps) {
  const { id } = await params;
  const groupId = Number(id);

  if (!Number.isInteger(groupId) || groupId <= 0) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;
  const code = readSearchParam(resolvedSearchParams?.code);
  const currentPath = `/groups/${groupId}/join${code ? `?code=${encodeURIComponent(code)}` : ""}`;
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent(currentPath)}`);
  }

  const result = await acceptGroupInvite({
    groupId,
    inviteCode: code ?? null,
    user,
  });

  if (result.status === "success") {
    return (
      <JoinMessage
        title={`Welcome to ${result.group.title}`}
        message="You have joined this group."
        actionHref={`/groups/${result.group.id}`}
        actionLabel="Open group"
        tone="success"
      />
    );
  }

  return (
    <JoinMessage
      title={result.title}
      message={result.message}
      actionHref="/groups"
      actionLabel="Back to groups"
      tone="error"
    />
  );
}

function JoinMessage({
  actionHref,
  actionLabel,
  message,
  title,
  tone,
}: {
  actionHref: string;
  actionLabel: string;
  message: string;
  title: string;
  tone: "success" | "error";
}) {
  const borderColor = tone === "success" ? "border-[#b8d6ad]" : "border-[#efb5a8]";

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className={`mx-auto max-w-2xl rounded-lg border ${borderColor} bg-white p-6 shadow-sm sm:p-8`}>
        <h1 className="text-3xl font-black tracking-normal text-[#18231c]">
          {title}
        </h1>
        <p className="mt-4 leading-7 text-[#59655c]">{message}</p>
        <Link
          href={actionHref}
          className="mt-7 inline-flex min-h-11 items-center justify-center rounded-md bg-[#2f6f3e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#285d35]"
        >
          {actionLabel}
        </Link>
      </div>
    </div>
  );
}

function readSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
