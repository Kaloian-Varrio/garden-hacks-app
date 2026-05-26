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
import {
  CommentIcon,
  GardenBadge,
  GardenButton,
  GardenCard,
  HackVisual,
  SectionHeader,
  StateNotice,
  VoteButton,
  gardenTheme,
} from "../components/garden-ui";
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
  imageUrl?: string | null;
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
        <GardenButton variant="secondary">Back to Hacks</GardenButton>
      </Link>

      {isLoading ? <StateNotice tone="loading" title="Loading hack..." /> : null}
      {error ? <StateNotice tone="error" title={error} /> : null}

      {hack ? (
        <View style={styles.content}>
          <HackVisual imageUrl={hack.imageUrl} size="hero" title={hack.title} />
          <View style={styles.badges}>
            <GardenBadge tone="mint">{hack.category.title}</GardenBadge>
            <GardenBadge tone="sky">{hack.group.title}</GardenBadge>
            <GardenBadge tone="cream">{hack.difficulty}</GardenBadge>
            {hack.isOrganic ? <GardenBadge tone="mint">Organic</GardenBadge> : null}
            {hack.isChemicalFree ? (
              <GardenBadge tone="tomato">Chemical-free</GardenBadge>
            ) : null}
          </View>
          <Text style={styles.title}>{hack.title}</Text>
          {hack.excerpt ? <Text style={styles.excerpt}>{hack.excerpt}</Text> : null}
          <Text style={styles.meta}>By {hack.author.name}</Text>

          <GardenCard style={styles.stats}>
            <Stat label="Rating" value={hack.ratingScore} />
            <Stat label="Likes" value={hack.likesCount} />
            <Stat label="Comments" value={hack.commentsCount} />
          </GardenCard>

          <GardenCard style={styles.votePanel}>
            <SectionHeader
              copy={!token ? "Log in to vote on this hack." : undefined}
              title="Vote for this hack"
            />
            <View style={styles.voteActions}>
              <VoteButton
                canVote={Boolean(token)}
                count={hack.sweetTomatoesCount}
                isActive={hack.userVote === "sweet_tomato"}
                isPending={pendingVote === "sweet_tomato"}
                label="Sweet Tomatoes"
                onPress={() => handleVote("sweet_tomato")}
                type="positive"
              />
              <VoteButton
                canVote={Boolean(token)}
                count={hack.bitterCucumbersCount}
                isActive={hack.userVote === "bitter_cucumber"}
                isPending={pendingVote === "bitter_cucumber"}
                label="Bitter Cucumbers"
                onPress={() => handleVote("bitter_cucumber")}
                type="negative"
              />
            </View>
            {voteError ? <StateNotice tone="error" title={voteError} /> : null}
          </GardenCard>

          <GardenCard style={styles.article}>
            <SectionHeader title="How it works" />
            <Text style={styles.body}>{hack.content}</Text>
          </GardenCard>

          <GardenCard style={styles.commentsSection}>
            <View style={styles.commentsHeader}>
              <View style={styles.commentsTitleRow}>
                <CommentIcon />
                <View>
                  <Text style={styles.commentsTitle}>Comments</Text>
                  <Text style={styles.commentsCount}>
                    {comments.length} {comments.length === 1 ? "comment" : "comments"}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.commentList}>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <View style={styles.commentCard} key={comment.id}>
                    <View style={styles.commentHeader}>
                      <View style={styles.commentAvatar}>
                        <Text style={styles.commentAvatarText}>
                          {getInitials(comment.author.name)}
                        </Text>
                      </View>
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
                          <StateNotice tone="error" title={commentError} />
                        ) : null}
                        <View style={styles.commentActions}>
                          <GardenButton
                            disabled={commentAction === "edit"}
                            onPress={handleSaveComment}
                          >
                            {commentAction === "edit" ? "Saving..." : "Save"}
                          </GardenButton>
                          <GardenButton
                            disabled={commentAction === "edit"}
                            onPress={cancelEditingComment}
                            variant="secondary"
                          >
                            Cancel
                          </GardenButton>
                        </View>
                      </View>
                    ) : (
                      <Text style={styles.commentText}>{comment.text}</Text>
                    )}
                  </View>
                ))
              ) : (
                <StateNotice
                  copy="Start the conversation with a practical note or question."
                  title="No comments yet"
                />
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
                <StateNotice tone="error" title={commentError} />
              ) : null}
              <GardenButton
                disabled={commentAction === "create"}
                onPress={handleCreateComment}
              >
                {commentAction === "create" ? "Posting..." : "Post Comment"}
              </GardenButton>
            </View>
          </GardenCard>
        </View>
      ) : null}
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
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

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?"
  );
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
    borderTopColor: gardenTheme.colors.border,
    borderTopWidth: 1,
    gap: 10,
    paddingTop: 16,
  },
  article: {
    gap: 12,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  body: {
    color: "#263c2b",
    fontSize: 16,
    lineHeight: 25,
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
    color: gardenTheme.colors.text,
    fontSize: 15,
    fontWeight: "900",
  },
  commentAuthorBlock: {
    flex: 1,
    gap: 4,
  },
  commentAvatar: {
    alignItems: "center",
    backgroundColor: gardenTheme.colors.mint,
    borderColor: "#b7e7d1",
    borderRadius: 15,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  commentAvatarText: {
    color: gardenTheme.colors.leaf,
    fontSize: 13,
    fontWeight: "900",
  },
  commentCard: {
    backgroundColor: "#fbfffd",
    borderColor: gardenTheme.colors.border,
    borderRadius: 22,
    borderWidth: 1,
    gap: 12,
    padding: 14,
  },
  commentDate: {
    color: gardenTheme.colors.muted,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  commentHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
  },
  commentInput: {
    backgroundColor: "#ffffff",
    borderColor: "#b7e7d1",
    borderRadius: 18,
    borderWidth: 1,
    color: gardenTheme.colors.text,
    fontSize: 15,
    minHeight: 98,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  commentList: {
    gap: 12,
  },
  commentText: {
    color: "#405046",
    fontSize: 15,
    lineHeight: 23,
  },
  commentsCount: {
    color: gardenTheme.colors.muted,
    fontSize: 13,
    fontWeight: "800",
  },
  commentsHeader: {
    gap: 3,
  },
  commentsSection: {
    gap: 16,
  },
  commentsTitle: {
    color: gardenTheme.colors.text,
    fontSize: 22,
    fontWeight: "900",
  },
  commentsTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  container: {
    gap: 16,
    padding: 20,
  },
  content: {
    gap: 14,
  },
  editForm: {
    gap: 10,
  },
  excerpt: {
    color: gardenTheme.colors.muted,
    fontSize: 17,
    lineHeight: 25,
  },
  formLabel: {
    color: gardenTheme.colors.text,
    fontSize: 14,
    fontWeight: "900",
  },
  meta: {
    color: gardenTheme.colors.primaryDark,
    fontSize: 14,
    fontWeight: "900",
  },
  smallButton: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#b7e7d1",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  smallButtonText: {
    color: gardenTheme.colors.primaryDark,
    fontSize: 13,
    fontWeight: "900",
  },
  statItem: {
    backgroundColor: "#fbfffd",
    borderColor: gardenTheme.colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    minWidth: 92,
    padding: 12,
  },
  statLabel: {
    color: gardenTheme.colors.muted,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  statValue: {
    color: gardenTheme.colors.text,
    fontSize: 24,
    fontWeight: "900",
  },
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  title: {
    color: gardenTheme.colors.text,
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 38,
  },
  voteActions: {
    gap: 10,
  },
  votePanel: {
    gap: 14,
  },
});
