"use client";

import { useActionState, useState } from "react";
import type { GroupActionState } from "@/lib/groups/actions";
import type { GroupFormValues } from "@/lib/groups/types";

type GroupFormProps = {
  action: (
    previousState: GroupActionState,
    formData: FormData,
  ) => Promise<GroupActionState>;
  submitLabel: string;
  initialValues?: GroupFormValues;
};

const initialState: GroupActionState = {};

export function GroupForm({
  action,
  initialValues,
  submitLabel,
}: GroupFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const values = state.values ?? initialValues;
  const [imageSource, setImageSource] = useState<"url" | "upload" | "ai">("url");
  const [aiImageUrl, setAiImageUrl] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [base64Image, setBase64Image] = useState("");

  const [urlImage, setUrlImage] = useState(values?.imageUrl ?? "");

  async function handleAiGenerate() {
    const titleObj = document.querySelector<HTMLInputElement>('input[name="title"]');
    const titleVal = titleObj?.value || "garden";
    // TODO: Integrate actual AI image generation API here.
    const generatedUrl = `https://picsum.photos/seed/${encodeURIComponent(titleVal + Date.now())}/800/600`;
    setAiImageUrl(generatedUrl);
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUploadError("");
    setBase64Image("");
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        setUploadError("Image file must be up to 1 MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setBase64Image(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  function getFinalImageUrl() {
    if (imageSource === "url") return urlImage;
    if (imageSource === "ai") return aiImageUrl;
    if (imageSource === "upload") return base64Image;
    return "";
  }

  return (
    <form action={formAction} className="grid gap-5">
      {state.errors?.form ? (
        <div className="rounded-md border border-[#efb5a8] bg-[#fff0eb] p-3 text-sm font-semibold text-[#8a2d1c]">
          {state.errors.form}
        </div>
      ) : null}

      <FieldError message={state.errors?.title} />
      <label className="grid gap-2 text-sm font-bold text-[#203525]">
        Title
        <input
          name="title"
          defaultValue={values?.title ?? ""}
          required
          maxLength={160}
          className="h-11 rounded-md border border-[#cbd9c2] bg-[#f8faf7] px-3 text-sm font-semibold text-[#18231c] outline-none focus:border-[#2f6f3e] focus:ring-2 focus:ring-[#cfe4c5]"
        />
      </label>

      <FieldError message={state.errors?.slug} />
      <label className="grid gap-2 text-sm font-bold text-[#203525]">
        Slug
        <input
          name="slug"
          defaultValue={values?.slug ?? ""}
          maxLength={180}
          placeholder="auto-generated from title"
          className="h-11 rounded-md border border-[#cbd9c2] bg-[#f8faf7] px-3 text-sm font-semibold text-[#18231c] outline-none focus:border-[#2f6f3e] focus:ring-2 focus:ring-[#cfe4c5]"
        />
      </label>

      <label className="grid gap-2 text-sm font-bold text-[#203525]">
        Description
        <textarea
          name="description"
          defaultValue={values?.description ?? ""}
          className="min-h-36 rounded-md border border-[#cbd9c2] bg-[#f8faf7] p-3 text-sm leading-6 text-[#18231c] outline-none focus:border-[#2f6f3e] focus:ring-2 focus:ring-[#cfe4c5]"
        />
      </label>

      {/* Hidden input to hold the final resolved image url */}
      <input type="hidden" name="imageUrl" value={getFinalImageUrl()} />

      <div className="space-y-4 rounded-xl border border-[#cbd9c2] p-5 bg-[#f8faf7]">
        <h3 className="text-sm font-black text-[#176b49] uppercase tracking-wider">Group Image</h3>
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" value="url" checked={imageSource === "url"} onChange={() => setImageSource("url")} className="garden-radio" />
            <span className="text-sm font-semibold text-[#203525]">Image URL</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" value="upload" checked={imageSource === "upload"} onChange={() => setImageSource("upload")} className="garden-radio" />
            <span className="text-sm font-semibold text-[#203525]">Upload File</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" value="ai" checked={imageSource === "ai"} onChange={() => setImageSource("ai")} className="garden-radio" />
            <span className="text-sm font-semibold text-[#203525]">AI Generate</span>
          </label>
        </div>

        {imageSource === "url" && (
          <label className="grid gap-2 text-sm font-bold text-[#203525]">
            URL
            <input
              type="url"
              value={urlImage}
              onChange={(e) => setUrlImage(e.target.value)}
              className="h-11 rounded-md border border-[#cbd9c2] bg-white px-3 text-sm font-semibold text-[#18231c] outline-none focus:border-[#2f6f3e] focus:ring-2 focus:ring-[#cfe4c5]"
            />
          </label>
        )}

        {imageSource === "upload" && (
          <div className="grid gap-2 text-sm font-bold text-[#203525]">
            <label>Upload File (up to 1 MB)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="h-11 pt-2 rounded-md border border-[#cbd9c2] bg-white px-3 text-sm font-semibold text-[#18231c]"
            />
            {uploadError && <p className="text-xs text-[#8a2d1c]">{uploadError}</p>}
          </div>
        )}

        {imageSource === "ai" && (
          <div className="flex flex-col gap-3">
            <button type="button" onClick={handleAiGenerate} className="garden-btn garden-btn-primary w-fit min-h-10 px-4 py-2 text-sm">
              Generate AI Image
            </button>
            {aiImageUrl && (
              <div className="mt-2 text-sm font-bold text-[#203525]">
                <p className="mb-2">Preview:</p>
                <img src={aiImageUrl} alt="Generated preview" className="h-32 rounded-md object-cover" />
              </div>
            )}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-11 w-fit items-center justify-center rounded-md bg-[#2f6f3e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#285d35] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? (
    <p className="-mb-3 text-sm font-semibold text-[#8a2d1c]">{message}</p>
  ) : null;
}
