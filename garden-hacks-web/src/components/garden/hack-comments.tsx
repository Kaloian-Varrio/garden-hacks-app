"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { CommentIcon, EditIcon, TrashIcon, UserIcon } from "@/components/ui/garden-icons";

type CommentItem = {
  id: number;
  text: string;
  authorName: string;
  createdAt: string | null;
  updatedAt: string | null;
  canEdit: boolean;
  canDelete: boolean;
};

type HackCommentsProps = {
  hackId: number;
  comments: CommentItem[];
  isLoggedIn: boolean;
};

export function HackComments({
  hackId,
  comments,
  isLoggedIn,
}: HackCommentsProps) {
  const router = useRouter();
  const [newText, setNewText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setPendingAction("create");

    try {
      await requestJson(`/api/hacks/${hackId}/comments`, {
        method: "POST",
        body: JSON.stringify({ text: newText }),
      });
      setNewText("");
      router.refresh();
    } catch (error) {
      setFormError(getErrorMessage(error));
    } finally {
      setPendingAction(null);
    }
  }

  async function handleEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingId) {
      return;
    }

    setCommentError(null);
    setPendingAction(`edit-${editingId}`);

    try {
      await requestJson(`/api/hacks/${hackId}/comments/${editingId}`, {
        method: "PATCH",
        body: JSON.stringify({ text: editingText }),
      });
      setEditingId(null);
      setEditingText("");
      router.refresh();
    } catch (error) {
      setCommentError(getErrorMessage(error));
    } finally {
      setPendingAction(null);
    }
  }

  async function handleDelete(commentId: number) {
    if (!window.confirm("Delete this comment? This cannot be undone.")) {
      return;
    }

    setCommentError(null);
    setPendingAction(`delete-${commentId}`);

    try {
      await requestJson(`/api/hacks/${hackId}/comments/${commentId}`, {
        method: "DELETE",
      });
      router.refresh();
    } catch (error) {
      setCommentError(getErrorMessage(error));
    } finally {
      setPendingAction(null);
    }
  }

  function startEditing(comment: CommentItem) {
    setCommentError(null);
    setEditingId(comment.id);
    setEditingText(comment.text);
  }

  return (
    <section className="garden-shell rounded-3xl p-6 sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight text-[#10231c]">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e9fbff] text-[#08747d]">
              <CommentIcon />
            </span>
            Comments
          </h2>
          <p className="mt-2 text-sm text-[#59655c]">
            {comments.length} {comments.length === 1 ? "comment" : "comments"}
          </p>
        </div>
      </div>
      {commentError && editingId === null && (
        <p className="mt-4 text-sm font-semibold text-[#8a2d1c]">
          {commentError}
        </p>
      )}

      <div className="mt-6 grid gap-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <article
              key={comment.id}
              className="rounded-2xl border border-[#d9eee4] bg-white/75 p-4 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="flex items-center gap-2 font-black text-[#203525]">
                    <UserIcon size={17} />
                    {comment.authorName}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#6c786f]">
                    {formatDate(comment.createdAt)}
                  </p>
                </div>
                {(comment.canEdit || comment.canDelete) && (
                  <div className="flex gap-2">
                    {comment.canEdit && (
                      <button
                        type="button"
                        onClick={() => startEditing(comment)}
                        className="inline-flex min-h-9 items-center justify-center gap-1 rounded-full border border-[#b7e7d1] bg-white px-3 py-1.5 text-sm font-bold text-[#134c40] transition hover:bg-[#e9fbef]"
                      >
                        <EditIcon size={14} />
                        Edit
                      </button>
                    )}
                    {comment.canDelete && (
                      <button
                        type="button"
                        disabled={pendingAction === `delete-${comment.id}`}
                        onClick={() => handleDelete(comment.id)}
                        className="inline-flex min-h-9 items-center justify-center gap-1 rounded-full border border-[#ffc2ad] bg-white px-3 py-1.5 text-sm font-bold text-[#a33a20] transition hover:bg-[#fff0eb] disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <TrashIcon size={14} />
                        {pendingAction === `delete-${comment.id}`
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {editingId === comment.id ? (
                <form onSubmit={handleEdit} className="mt-4 grid gap-3">
                  <textarea
                    value={editingText}
                    onChange={(event) => setEditingText(event.target.value)}
                    className="min-h-28 rounded-2xl border border-[#b7e7d1] bg-white p-4 text-sm leading-6 text-[#203525] outline-none focus:border-[#0f9f93] focus:ring-4 focus:ring-[#5bd8d0]/20"
                    required
                  />
                  {commentError && (
                    <p className="text-sm font-semibold text-[#8a2d1c]">
                      {commentError}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={pendingAction === `edit-${comment.id}`}
                      className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#0f9f93] px-4 py-2 text-sm font-bold text-white hover:bg-[#0f766e] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {pendingAction === `edit-${comment.id}`
                        ? "Saving..."
                        : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#b7e7d1] bg-white px-4 py-2 text-sm font-bold text-[#203525] hover:bg-[#e9fbef]"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#405046]">
                  {comment.text}
                </p>
              )}
            </article>
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-[#b7e7d1] bg-white/70 p-4 text-sm leading-6 text-[#59655c]">
            No comments yet.
          </p>
        )}
      </div>

      <div className="mt-6 border-t border-[#edf2e8] pt-6">
        {isLoggedIn ? (
          <form onSubmit={handleCreate} className="grid gap-3">
            <label
              htmlFor="comment-text"
              className="text-sm font-black text-[#203525]"
            >
              Add a comment
            </label>
            <textarea
              id="comment-text"
              value={newText}
              onChange={(event) => setNewText(event.target.value)}
              className="min-h-32 rounded-2xl border border-[#b7e7d1] bg-white p-4 text-sm leading-6 text-[#203525] outline-none focus:border-[#0f9f93] focus:ring-4 focus:ring-[#5bd8d0]/20"
              required
            />
            {formError && (
              <p className="text-sm font-semibold text-[#8a2d1c]">
                {formError}
              </p>
            )}
            <button
              type="submit"
              disabled={pendingAction === "create"}
              className="inline-flex min-h-11 w-fit items-center justify-center rounded-full bg-gradient-to-r from-[#0f9f93] to-[#176b49] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/15 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {pendingAction === "create" ? "Posting..." : "Post comment"}
            </button>
          </form>
        ) : (
          <div className="rounded-2xl border border-[#dfe8d8] bg-white/75 p-4">
            <p className="text-sm font-semibold text-[#203525]">
              Log in to add a comment.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/login"
                className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#0f9f93] px-4 py-2 text-sm font-bold text-white hover:bg-[#0f766e]"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#b7e7d1] bg-white px-4 py-2 text-sm font-bold text-[#203525] hover:bg-[#e9fbef]"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

async function requestJson(url: string, init: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.details?.text ?? data?.error ?? "Something went wrong.",
    );
  }

  return data;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function formatDate(value: string | null) {
  if (!value) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
