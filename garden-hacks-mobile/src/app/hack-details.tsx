import { Link, useLocalSearchParams } from "expo-router";
import Head from "expo-router/head";
import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { getApiBaseUrl, useAuth } from "../lib/auth";

type HackComment = {
  id: number;
  text: string;
  createdAt: string | null;
  updatedAt: string | null;
  author: {
    id: number;
    name: string;
    photoUrl: string | null;
  };
  canEdit?: boolean;
  canDelete?: boolean;
};

type HackDetail = {
  id: number;
  title: string;
  content: string;
  excerpt: string | null;
  difficulty: "easy" | "medium" | "hard";
  isOrganic: boolean;
  isChemicalFree: boolean;
  likesCount: number;
  commentsCount: number;
  sweetTomatoesCount: number;
  bitterCucumbersCount: number;
  ratingScore: number;
  userVote: VoteType | null;
  author: {
    name: string;
  };
  group: {
    title: string;
  };
  category: {
    title: string;
  };
};

type CommentViewer = {
  id: number;
  role: "user" | "admin";
} | null;

type VoteType = "sweet_tomato" | "bitter_cucumber";

export default function HackDetailsScreen() {
  return (
    <>
      <Head>
        <title>Garden Hacks | Hack Details</title>
      </Head>

      <HackDetailsContent />
    </>
  );
}

function HackDetailsContent() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { token, user } = useAuth();
  const [hack, setHack] = useState<HackDetail | null>(null);
  const [comments, setComments] = useState<HackComment[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [newCommentText, setNewCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [commentError, setCommentError] = useState("");
  const [commentAction, setCommentAction] = useState<"create" | "edit" | null>(
    null,
  );
  const [voteError, setVoteError] = useState("");
  const [pendingVote, setPendingVote] = useState<VoteType | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadHack() {
      if (!id) {
        setError("Select a hack from the Hacks screen.");
        setIsLoading(false);
        return;
      }

      setError("");
      setIsLoading(true);

      try {
        const headers = token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined;
        const [hackResponse, commentsResponse] = await Promise.all([
          fetch(`${getApiBaseUrl()}/hacks/${id}`, {
            headers,
          }),
          fetch(`${getApiBaseUrl()}/hacks/${id}/comments?commentsOrder=oldest`, {
            headers,
          }),
        ]);

        if (!hackResponse.ok) {
          throw new Error("Unable to load hack details.");
        }

        if (!commentsResponse.ok) {
          throw new Error("Unable to load hack comments.");
        }

        const hackData = (await hackResponse.json()) as { hack: HackDetail };
        const commentsData = (await commentsResponse.json()) as {
          comments: HackComment[];
        };

        if (isActive) {
          setHack(hackData.hack);
          setComments(
            commentsData.comments.map((comment) =>
              withCommentPermissions(comment, user),
            ),
          );
        }
      } catch {
        if (isActive) {
          setError(
            "Unable to load hack details. Make sure the Garden Hacks API is running.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadHack();

    return () => {
      isActive = false;
    };
  }, [id, token, user]);

  async function handleCreateComment() {
    const text = newCommentText.trim();

    if (!id || !token) {
      setCommentError("Login is required to add a comment.");
      return;
    }

    if (!text) {
      setCommentError("Comment text is required.");
      return;
    }

    setCommentError("");
    setCommentAction("create");

    try {
      const response = await fetch(`${getApiBaseUrl()}/hacks/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      const data = (await response.json()) as { comment: HackComment };
      const nextComment = withCommentPermissions(data.comment, user);

      setComments((currentComments) => [...currentComments, nextComment]);
      setHack((currentHack) =>
        currentHack
          ? {
              ...currentHack,
              commentsCount: currentHack.commentsCount + 1,
            }
          : currentHack,
      );
      setNewCommentText("");
    } catch (createError) {
      setCommentError(
        createError instanceof Error
          ? createError.message
          : "Unable to add this comment.",
      );
    } finally {
      setCommentAction(null);
    }
  }

  async function handleVote(voteType: VoteType) {
    if (!id || !token) {
      setVoteError("Log in to vote.");
      return;
    }

    setVoteError("");
    setPendingVote(voteType);

    try {
      const response = await fetch(`${getApiBaseUrl()}/hacks/${id}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ voteType }),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      const data = (await response.json()) as {
        userVote: VoteType;
        sweetTomatoesCount: number;
        bitterCucumbersCount: number;
        ratingScore: number;
      };

      setHack((currentHack) =>
        currentHack
          ? {
              ...currentHack,
              userVote: data.userVote,
              sweetTomatoesCount: data.sweetTomatoesCount,
              bitterCucumbersCount: data.bitterCucumbersCount,
              ratingScore: data.ratingScore,
            }
          : currentHack,
      );
    } catch (voteSubmitError) {
      setVoteError(
        voteSubmitError instanceof Error
          ? voteSubmitError.message
          : "Unable to save your vote.",
      );
    } finally {
      setPendingVote(null);
    }
  }

  async function handleSaveComment() {
    const text = editingCommentText.trim();

    if (!id || !token || editingCommentId === null) {
      setCommentError("Unable to edit this comment.");
      return;
    }

    if (!text) {
      setCommentError("Comment text is required.");
      return;
    }

    setCommentError("");
    setCommentAction("edit");

    try {
      const response = await fetch(
        `${getApiBaseUrl()}/hacks/${id}/comments/${editingCommentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text }),
        },
      );

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      const data = (await response.json()) as {
        comment: {
          id: number;
          text: string;
          updatedAt: string | null;
        };
      };

      setComments((currentComments) =>
        currentComments.map((comment) =>
          comment.id === data.comment.id
            ? {
                ...comment,
                text: data.comment.text,
                updatedAt: data.comment.updatedAt,
              }
            : comment,
        ),
      );
      setEditingCommentId(null);
      setEditingCommentText("");
    } catch (editError) {
      setCommentError(
        editError instanceof Error
          ? editError.message
          : "Unable to save this comment.",
      );
    } finally {
      setCommentAction(null);
    }
  }

  function startEditingComment(comment: HackComment) {
    setCommentError("");
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.text);
  }

  function cancelEditingComment() {
    setCommentError("");
    setEditingCommentId(null);
    setEditingCommentText("");
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Link href="/hacks" asChild>
        <Pressable style={styles.backLink}>
          <Text style={styles.backLinkText}>Back to Hacks</Text>
        </Pressable>
      </Link>

      {isLoading ? <Text style={styles.message}>Loading hack...</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {hack ? (
        <View style={styles.content}>
          <Text style={styles.title}>{hack.title}</Text>
          <Text style={styles.meta}>
            {hack.group.title} | {hack.category.title} | {hack.difficulty}
          </Text>
          {hack.excerpt ? <Text style={styles.excerpt}>{hack.excerpt}</Text> : null}
          <Text style={styles.body}>{hack.content}</Text>
          <Text style={styles.meta}>By {hack.author.name}</Text>
          <View style={styles.stats}>
            <Text style={styles.stat}>Rating {hack.ratingScore}</Text>
            <Text style={styles.stat}>{hack.likesCount} likes</Text>
            <Text style={styles.stat}>{hack.commentsCount} comments</Text>
            <Text style={styles.stat}>
              {hack.sweetTomatoesCount} Sweet Tomatoes
            </Text>
            <Text style={styles.stat}>
              {hack.bitterCucumbersCount} Bitter Cucumbers
            </Text>
          </View>

          <View style={styles.votePanel}>
            <View style={styles.voteHeader}>
              <Text style={styles.voteTitle}>Vote for this hack</Text>
              <Text style={styles.voteScore}>Rating: {hack.ratingScore}</Text>
            </View>
            <View style={styles.voteActions}>
              <VoteButton
                canVote={Boolean(token)}
                count={hack.sweetTomatoesCount}
                isActive={hack.userVote === "sweet_tomato"}
                isPending={pendingVote === "sweet_tomato"}
                label="Sweet Tomatoes"
                onPress={() => handleVote("sweet_tomato")}
              />
              <VoteButton
                canVote={Boolean(token)}
                count={hack.bitterCucumbersCount}
                isActive={hack.userVote === "bitter_cucumber"}
                isPending={pendingVote === "bitter_cucumber"}
                label="Bitter Cucumbers"
                onPress={() => handleVote("bitter_cucumber")}
              />
            </View>
            {!token ? (
              <Text style={styles.loginPrompt}>
                Log in to vote.
              </Text>
            ) : null}
            {voteError ? <Text style={styles.error}>{voteError}</Text> : null}
          </View>

          <View style={styles.commentsSection}>
            <View style={styles.commentsHeader}>
              <Text style={styles.commentsTitle}>Comments</Text>
              <Text style={styles.commentsCount}>
                {comments.length} {comments.length === 1 ? "comment" : "comments"}
              </Text>
            </View>

            <View style={styles.commentList}>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <View style={styles.commentCard} key={comment.id}>
                    <View style={styles.commentHeader}>
                      <View style={styles.commentAuthorBlock}>
                        <Text style={styles.commentAuthor}>
                          {comment.author.name}
                        </Text>
                        <Text style={styles.commentDate}>
                          {formatDate(comment.createdAt)}
                        </Text>
                      </View>

                      {comment.canEdit ? (
                        <Pressable
                          disabled={commentAction !== null}
                          onPress={() => startEditingComment(comment)}
                          style={({ pressed }) => [
                            styles.smallButton,
                            (pressed || commentAction !== null) &&
                              styles.buttonPressed,
                          ]}
                        >
                          <Text style={styles.smallButtonText}>Edit</Text>
                        </Pressable>
                      ) : null}
                    </View>

                    {editingCommentId === comment.id ? (
                      <View style={styles.editForm}>
                        <TextInput
                          editable={commentAction !== "edit"}
                          multiline
                          onChangeText={setEditingCommentText}
                          placeholder="Write your comment"
                          placeholderTextColor="#7a897d"
                          style={styles.commentInput}
                          textAlignVertical="top"
                          value={editingCommentText}
                        />
                        {commentError ? (
                          <Text style={styles.error}>{commentError}</Text>
                        ) : null}
                        <View style={styles.commentActions}>
                          <Pressable
                            disabled={commentAction === "edit"}
                            onPress={handleSaveComment}
                            style={({ pressed }) => [
                              styles.primaryButton,
                              (pressed || commentAction === "edit") &&
                                styles.buttonPressed,
                            ]}
                          >
                            <Text style={styles.primaryButtonText}>
                              {commentAction === "edit" ? "Saving..." : "Save"}
                            </Text>
                          </Pressable>
                          <Pressable
                            disabled={commentAction === "edit"}
                            onPress={cancelEditingComment}
                            style={({ pressed }) => [
                              styles.secondaryButton,
                              pressed && styles.buttonPressed,
                            ]}
                          >
                            <Text style={styles.secondaryButtonText}>Cancel</Text>
                          </Pressable>
                        </View>
                      </View>
                    ) : (
                      <Text style={styles.commentText}>{comment.text}</Text>
                    )}
                  </View>
                ))
              ) : (
                <Text style={styles.emptyComments}>No comments yet.</Text>
              )}
            </View>

            <View style={styles.addCommentForm}>
              <Text style={styles.formLabel}>Add a comment</Text>
              <TextInput
                editable={commentAction !== "create"}
                multiline
                onChangeText={setNewCommentText}
                placeholder="Share a note or question"
                placeholderTextColor="#7a897d"
                style={styles.commentInput}
                textAlignVertical="top"
                value={newCommentText}
              />
              {commentError && editingCommentId === null ? (
                <Text style={styles.error}>{commentError}</Text>
              ) : null}
              <Pressable
                disabled={commentAction === "create"}
                onPress={handleCreateComment}
                style={({ pressed }) => [
                  styles.primaryButton,
                  (pressed || commentAction === "create") &&
                    styles.buttonPressed,
                ]}
              >
                <Text style={styles.primaryButtonText}>
                  {commentAction === "create" ? "Posting..." : "Post Comment"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

function VoteButton({
  canVote,
  count,
  isActive,
  isPending,
  label,
  onPress,
}: {
  canVote: boolean;
  count: number;
  isActive: boolean;
  isPending: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      disabled={!canVote || isPending}
      onPress={onPress}
      style={({ pressed }) => [
        styles.voteButton,
        isActive && styles.voteButtonActive,
        (pressed || isPending) && styles.buttonPressed,
      ]}
    >
      <View style={styles.voteButtonText}>
        <Text style={styles.voteButtonLabel}>{label}</Text>
        <Text style={styles.voteButtonStatus}>
          {isActive ? "Your vote" : "Vote"}
        </Text>
      </View>
      <Text style={styles.voteButtonCount}>{isPending ? "..." : count}</Text>
    </Pressable>
  );
}

async function readApiError(response: Response) {
  const data = (await response.json().catch(() => null)) as {
    error?: string;
    details?: Record<string, string>;
  } | null;

  return data?.details?.text ?? data?.error ?? "Something went wrong.";
}

function withCommentPermissions(comment: HackComment, user: CommentViewer) {
  return {
    ...comment,
    canEdit:
      comment.canEdit ??
      Boolean(user && (user.role === "admin" || user.id === comment.author.id)),
  };
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

const styles = StyleSheet.create({
  addCommentForm: {
    borderTopColor: "#edf2e8",
    borderTopWidth: 1,
    gap: 10,
    paddingTop: 16,
  },
  backLink: {
    alignSelf: "flex-start",
    borderColor: "#1f6b3a",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backLinkText: {
    color: "#1f6b3a",
    fontSize: 15,
    fontWeight: "700",
  },
  body: {
    color: "#263c2b",
    fontSize: 16,
    lineHeight: 24,
  },
  buttonPressed: {
    opacity: 0.72,
  },
  commentActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  commentAuthor: {
    color: "#203525",
    fontSize: 15,
    fontWeight: "800",
  },
  commentAuthorBlock: {
    flex: 1,
    gap: 4,
  },
  commentCard: {
    backgroundColor: "#f8faf7",
    borderColor: "#edf2e8",
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 14,
  },
  commentDate: {
    color: "#6c786f",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  commentHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  commentInput: {
    backgroundColor: "#ffffff",
    borderColor: "#c9d8c8",
    borderRadius: 8,
    borderWidth: 1,
    color: "#16351f",
    fontSize: 15,
    minHeight: 92,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  commentList: {
    gap: 12,
  },
  commentText: {
    color: "#405046",
    fontSize: 15,
    lineHeight: 22,
  },
  commentsCount: {
    color: "#59655c",
    fontSize: 13,
    fontWeight: "700",
  },
  commentsHeader: {
    gap: 3,
  },
  commentsSection: {
    backgroundColor: "#ffffff",
    borderColor: "#dfe8d8",
    borderRadius: 8,
    borderWidth: 1,
    gap: 16,
    marginTop: 8,
    padding: 16,
  },
  commentsTitle: {
    color: "#18231c",
    fontSize: 22,
    fontWeight: "900",
  },
  container: {
    gap: 18,
    padding: 24,
  },
  content: {
    gap: 14,
  },
  editForm: {
    gap: 10,
  },
  emptyComments: {
    backgroundColor: "#f8faf7",
    borderColor: "#cbdac3",
    borderRadius: 8,
    borderStyle: "dashed",
    borderWidth: 1,
    color: "#59655c",
    fontSize: 14,
    lineHeight: 20,
    padding: 14,
  },
  error: {
    color: "#a32626",
    fontSize: 15,
    fontWeight: "700",
  },
  excerpt: {
    color: "#3f5142",
    fontSize: 17,
    lineHeight: 24,
  },
  formLabel: {
    color: "#203525",
    fontSize: 14,
    fontWeight: "800",
  },
  loginPrompt: {
    color: "#59655c",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
  },
  message: {
    color: "#3f5142",
    fontSize: 16,
  },
  meta: {
    color: "#526356",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  primaryButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#1f6b3a",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
  secondaryButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderColor: "#1f6b3a",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  secondaryButtonText: {
    color: "#1f6b3a",
    fontSize: 15,
    fontWeight: "800",
  },
  smallButton: {
    alignItems: "center",
    borderColor: "#b7c8ad",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  smallButtonText: {
    color: "#203525",
    fontSize: 13,
    fontWeight: "800",
  },
  stat: {
    color: "#1f4d2e",
    fontSize: 14,
    fontWeight: "700",
  },
  stats: {
    gap: 7,
  },
  title: {
    color: "#16351f",
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 34,
  },
  voteActions: {
    gap: 10,
  },
  voteButton: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#c9d8c8",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 68,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  voteButtonActive: {
    backgroundColor: "#e7f2df",
    borderColor: "#2f6f3e",
  },
  voteButtonCount: {
    color: "#18231c",
    fontSize: 24,
    fontWeight: "900",
  },
  voteButtonLabel: {
    color: "#203525",
    fontSize: 15,
    fontWeight: "900",
  },
  voteButtonStatus: {
    color: "#59655c",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  voteButtonText: {
    flex: 1,
    gap: 4,
  },
  voteHeader: {
    gap: 4,
  },
  votePanel: {
    backgroundColor: "#f8faf7",
    borderColor: "#dfe8d8",
    borderRadius: 8,
    borderWidth: 1,
    gap: 14,
    padding: 16,
  },
  voteScore: {
    color: "#203525",
    fontSize: 14,
    fontWeight: "800",
  },
  voteTitle: {
    color: "#18231c",
    fontSize: 20,
    fontWeight: "900",
  },
});
