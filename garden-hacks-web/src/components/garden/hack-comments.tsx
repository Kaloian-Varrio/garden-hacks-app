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
    <section className="garden-shell rounded-3xl p-5 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e9fbff] to-[#e7fbef] text-[#08747d] shadow-sm">
            <CommentIcon size={22} />
          </span>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-[#10231c]">
              Comments
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-6 text-[#59655c]">
              Share useful tweaks, ask questions, and keep the hack growing.
            </p>
          </div>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#cfe9dc] bg-white/80 px-4 py-2 text-sm font-black text-[#176b49] shadow-sm">
          <CommentIcon size={16} />
          {comments.length} {comments.length === 1 ? "comment" : "comments"}
        </span>
      </div>
      {commentError && editingId === null && (
        <div className="garden-error-state mt-5 flex items-start gap-3 p-4 text-sm font-semibold">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ffe4d6] text-[#a33a20]">
            !
          </span>
          <p>{commentError}</p>
        </div>
      )}

      <div className="mt-6 grid gap-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <article
              key={comment.id}
              className="garden-card-comment group p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#b7e7d1] hover:bg-white hover:shadow-md"
            >
              <div className="flex gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#dff7eb] to-[#dff7ff] text-sm font-black text-[#176b49] shadow-inner">
                  {getInitials(comment.authorName)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 truncate font-black text-[#203525]">
                        <UserIcon size={16} />
                        <span className="truncate">{comment.authorName}</span>
                      </p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[#6c786f]">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                    {(comment.canEdit || comment.canDelete) && (
                      <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
                        {comment.canEdit && (
                          <button
                            type="button"
                            onClick={() => startEditing(comment)}
                            className="garden-focus inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full border border-[#b7e7d1] bg-white px-3 py-1.5 text-sm font-bold text-[#134c40] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#e9fbef]"
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
                            className="garden-focus inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full border border-[#ffc2ad] bg-white px-3 py-1.5 text-sm font-bold text-[#a33a20] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#fff0eb] disabled:cursor-not-allowed disabled:opacity-70"
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
                    <form
                      onSubmit={handleEdit}
                      className="mt-4 rounded-2xl border border-[#d9eee4] bg-[#fbfffd] p-3"
                    >
                      <label
                        htmlFor={`comment-edit-${comment.id}`}
                        className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-[#176b49]"
                      >
                        Edit comment
                      </label>
                      <textarea
                        id={`comment-edit-${comment.id}`}
                        value={editingText}
                        onChange={(event) =>
                          setEditingText(event.target.value)
                        }
                        className="garden-textarea min-h-28"
                        required
                      />
                      {commentError && (
                        <p className="garden-form-error mt-2">
                          {commentError}
                        </p>
                      )}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="submit"
                          disabled={pendingAction === `edit-${comment.id}`}
                          className="garden-btn garden-btn-primary min-h-10 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {pendingAction === `edit-${comment.id}`
                            ? "Saving..."
                            : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="garden-btn garden-btn-secondary min-h-10 px-4 py-2 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <p className="mt-4 whitespace-pre-line rounded-2xl border border-[#edf2e8] bg-[#fbfffd] p-4 text-sm leading-7 text-[#405046]">
                      {comment.text}
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="garden-empty-state p-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e9fbff] text-[#08747d] shadow-sm">
              <CommentIcon />
            </div>
            <p className="mt-4 text-base font-black text-[#203525]">
              No comments yet
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#59655c]">
              Start the conversation with a practical tip, a result from your
              garden, or a question for the community.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 border-t border-[#edf2e8] pt-6">
        {isLoggedIn ? (
          <form
            onSubmit={handleCreate}
            className="rounded-3xl border border-[#d9eee4] bg-white/75 p-4 shadow-sm"
          >
            <label
              htmlFor="comment-text"
              className="flex items-center gap-2 text-sm font-black text-[#203525]"
            >
              <CommentIcon size={16} />
              Add a comment
            </label>
            <textarea
              id="comment-text"
              value={newText}
              onChange={(event) => setNewText(event.target.value)}
              className="garden-textarea mt-3 min-h-32"
              placeholder="Share a helpful note, question, or garden result..."
              required
            />
            {formError && (
              <p className="garden-form-error mt-2">{formError}</p>
            )}
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={pendingAction === "create"}
                className="garden-btn garden-btn-primary min-h-11 px-5 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-70"
              >
                {pendingAction === "create" ? "Posting..." : "Post comment"}
              </button>
            </div>
          </form>
        ) : (
          <div className="rounded-3xl border border-[#dfe8d8] bg-white/75 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#e7fbef] text-[#176b49]">
                <UserIcon size={18} />
              </span>
              <div>
                <p className="text-sm font-black text-[#203525]">
                  Log in to add a comment.
                </p>
                <p className="mt-1 text-sm leading-6 text-[#59655c]">
                  Everyone can read the discussion, but posting is reserved for
                  signed-in gardeners.
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/login"
                className="garden-btn garden-btn-primary min-h-10 px-4 py-2 text-sm"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="garden-btn garden-btn-secondary min-h-10 px-4 py-2 text-sm"
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

function getInitials(name: string) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "?";
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
