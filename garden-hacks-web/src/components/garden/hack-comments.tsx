"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

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
    <section className="rounded-lg border border-[#dfe8d8] bg-white p-6 sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-normal text-[#18231c]">
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
              className="rounded-lg border border-[#edf2e8] bg-[#f8faf7] p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-bold text-[#203525]">
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
                        className="inline-flex min-h-9 items-center justify-center rounded-md border border-[#b7c8ad] bg-white px-3 py-1.5 text-sm font-semibold text-[#203525] hover:bg-[#f1f7ed]"
                      >
                        Edit
                      </button>
                    )}
                    {comment.canDelete && (
                      <button
                        type="button"
                        disabled={pendingAction === `delete-${comment.id}`}
                        onClick={() => handleDelete(comment.id)}
                        className="inline-flex min-h-9 items-center justify-center rounded-md border border-[#efb5a8] bg-white px-3 py-1.5 text-sm font-semibold text-[#8a2d1c] hover:bg-[#fff0eb] disabled:cursor-not-allowed disabled:opacity-70"
                      >
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
                    className="min-h-28 rounded-md border border-[#b7c8ad] bg-white p-3 text-sm leading-6 text-[#203525] outline-none focus:border-[#2f6f3e] focus:ring-2 focus:ring-[#cfe4c5]"
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
                      className="inline-flex min-h-10 items-center justify-center rounded-md bg-[#2f6f3e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#285d35] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {pendingAction === `edit-${comment.id}`
                        ? "Saving..."
                        : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#b7c8ad] bg-white px-4 py-2 text-sm font-semibold text-[#203525] hover:bg-[#f1f7ed]"
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
          <p className="rounded-lg border border-dashed border-[#cbdac3] bg-[#f8faf7] p-4 text-sm leading-6 text-[#59655c]">
            No comments yet.
          </p>
        )}
      </div>

      <div className="mt-6 border-t border-[#edf2e8] pt-6">
        {isLoggedIn ? (
          <form onSubmit={handleCreate} className="grid gap-3">
            <label
              htmlFor="comment-text"
              className="text-sm font-bold text-[#203525]"
            >
              Add a comment
            </label>
            <textarea
              id="comment-text"
              value={newText}
              onChange={(event) => setNewText(event.target.value)}
              className="min-h-32 rounded-md border border-[#b7c8ad] bg-white p-3 text-sm leading-6 text-[#203525] outline-none focus:border-[#2f6f3e] focus:ring-2 focus:ring-[#cfe4c5]"
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
              className="inline-flex min-h-11 w-fit items-center justify-center rounded-md bg-[#2f6f3e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#285d35] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {pendingAction === "create" ? "Posting..." : "Post comment"}
            </button>
          </form>
        ) : (
          <div className="rounded-lg border border-[#dfe8d8] bg-[#f8faf7] p-4">
            <p className="text-sm font-semibold text-[#203525]">
              Log in to add a comment.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/login"
                className="inline-flex min-h-10 items-center justify-center rounded-md bg-[#2f6f3e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#285d35]"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#b7c8ad] bg-white px-4 py-2 text-sm font-semibold text-[#203525] hover:bg-[#f1f7ed]"
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
