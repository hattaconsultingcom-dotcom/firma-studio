import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import {
  ChevronLeft, Eye, Save, MoreHorizontal, Trash2, Send, Archive, RotateCcw,
  Bold, Italic, Heading1, Heading2, List, ListOrdered, Quote, Code,
  Image as ImageIcon, Link2, Table as TableIcon, Upload, Loader2, AlertCircle, X,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { supabase, slugify, calculateReadingTime, type ArticleStatus, type AuthorRow, type CategoryRow, type TagRow } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { StatusBadge } from "@/components/studio/StatusBadge";
import {
  AlertDialog,
  AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription,
  AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/blog/$id")({
  head: () => ({
    meta: [
      { title: "Edit article · FIRMA Studio" },
      { name: "description", content: "Edit article in FIRMA Studio." },
    ],
  }),
  component: Editor,
});

type Tab = "general" | "seo" | "social";
type FormState = {
  headline: string;
  slug: string;
  excerpt: string;
  body: string;
  featured_image_url: string;
  featured_image_alt: string;
  author_id: string;
  category_id: string;
  status: ArticleStatus;
  publish_date: string;
  reading_time: number;
  meta_title: string;
  meta_description: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image_url: string;
  no_index: boolean;
  no_follow: boolean;
};

const EMPTY_FORM: FormState = {
  headline: "",
  slug: "",
  excerpt: "",
  body: "",
  featured_image_url: "",
  featured_image_alt: "",
  author_id: "",
  category_id: "",
  status: "draft",
  publish_date: "",
  reading_time: 0,
  meta_title: "",
  meta_description: "",
  canonical_url: "",
  og_title: "",
  og_description: "",
  og_image_url: "",
  no_index: false,
  no_follow: false,
};

function Editor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const isNew = id === "new";

  const [tab, setTab] = useState<Tab>("general");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [authors, setAuthors] = useState<AuthorRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [tags, setTags] = useState<TagRow[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [articleId, setArticleId] = useState<string | null>(isNew ? null : id);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const loadArticle = useCallback(async () => {
    if (isNew) return;
    setLoading(true);
    const { data, error: queryError } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (queryError || !data) {
      setError(queryError?.message ?? "Article not found");
      setLoading(false);
      return;
    }

    const a = data as FormState & { id: string };
    setForm({
      headline: a.headline,
      slug: a.slug,
      excerpt: a.excerpt ?? "",
      body: a.body ?? "",
      featured_image_url: a.featured_image_url ?? "",
      featured_image_alt: a.featured_image_alt ?? "",
      author_id: a.author_id ?? "",
      category_id: a.category_id ?? "",
      status: a.status,
      publish_date: a.publish_date ? new Date(a.publish_date).toISOString().slice(0, 16) : "",
      reading_time: a.reading_time,
      meta_title: a.meta_title ?? "",
      meta_description: a.meta_description ?? "",
      canonical_url: a.canonical_url ?? "",
      og_title: a.og_title ?? "",
      og_description: a.og_description ?? "",
      og_image_url: a.og_image_url ?? "",
      no_index: a.no_index,
      no_follow: a.no_follow,
    });

    const { data: tagLinks } = await supabase
      .from("article_tags")
      .select("tag_id")
      .eq("article_id", id);
    if (tagLinks) {
      setSelectedTags(tagLinks.map((t: { tag_id: string }) => t.tag_id));
    }
    setArticleId(id);
    setLoading(false);
  }, [id, isNew]);

  useEffect(() => {
    async function loadTaxonomy() {
      const [{ data: a }, { data: c }, { data: t }] = await Promise.all([
        supabase.from("authors").select("*").order("name"),
        supabase.from("categories").select("*").order("name"),
        supabase.from("tags").select("*").order("name"),
      ]);
      if (a) setAuthors(a as AuthorRow[]);
      if (c) setCategories(c as CategoryRow[]);
      if (t) setTags(t as TagRow[]);
    }
    loadTaxonomy();
    loadArticle();
  }, [loadArticle]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onHeadlineChange(val: string) {
    update("headline", val);
    if (!slugEdited) {
      update("slug", slugify(val));
    }
  }

  async function checkSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
    let query = supabase.from("articles").select("id").eq("slug", slug);
    if (excludeId) {
      query = query.neq("id", excludeId);
    }
    const { data } = await query.maybeSingle();
    return !data;
  }

  async function handleSave(targetStatus?: ArticleStatus) {
    setError(null);
    setSlugError(null);

    if (!form.headline.trim()) {
      setError("Headline is required.");
      return;
    }
    if (!form.slug.trim()) {
      setSlugError("Slug is required.");
      return;
    }

    const isUnique = await checkSlugUnique(form.slug, articleId ?? undefined);
    if (!isUnique) {
      setSlugError("This slug is already in use by another article. Choose a different one.");
      return;
    }

    setSaving(true);
    const status = targetStatus ?? form.status;
    const publishDate = status === "published" && !form.publish_date
      ? new Date().toISOString()
      : form.publish_date
        ? new Date(form.publish_date).toISOString()
        : null;

    const payload = {
      headline: form.headline,
      slug: form.slug,
      excerpt: form.excerpt || null,
      body: form.body || null,
      featured_image_url: form.featured_image_url || null,
      featured_image_alt: form.featured_image_alt || null,
      author_id: form.author_id || null,
      category_id: form.category_id || null,
      status,
      publish_date: publishDate,
      reading_time: calculateReadingTime(form.body || ""),
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      canonical_url: form.canonical_url || null,
      og_title: form.og_title || null,
      og_description: form.og_description || null,
      og_image_url: form.og_image_url || null,
      no_index: form.no_index,
      no_follow: form.no_follow,
    };

    let resultId = articleId;

    if (resultId) {
      const { error: updateError } = await supabase
        .from("articles")
        .update(payload)
        .eq("id", resultId);
      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
    } else {
      const { data, error: insertError } = await supabase
        .from("articles")
        .insert(payload)
        .select("id")
        .single();
      if (insertError || !data) {
        setError(insertError?.message ?? "Failed to create article.");
        setSaving(false);
        return;
      }
      resultId = data.id;
      setArticleId(data.id);
    }

    // Sync tags
    await supabase.from("article_tags").delete().eq("article_id", resultId);
    if (selectedTags.length > 0) {
      const tagRows = selectedTags.map((tagId) => ({ article_id: resultId, tag_id: tagId }));
      await supabase.from("article_tags").insert(tagRows);
    }

    update("status", status);
    setSaving(false);
    showToast(
      status === "published" ? "Article published." :
      status === "archived" ? "Article archived." :
      "Draft saved.",
    );

    if (isNew && resultId) {
      navigate({ to: "/blog/$id", params: { id: resultId }, replace: true });
    }
  }

  async function handleDelete() {
    if (!articleId) return;
    setSaving(true);
    const { error: deleteError } = await supabase.from("articles").delete().eq("id", articleId);
    setSaving(false);
    setDeleteOpen(false);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    navigate({ to: "/blog" });
  }

  async function handleUpload(file: File) {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      setError("Only JPEG, PNG, WebP and GIF images are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5 MB.");
      return;
    }

    setUploading(true);
    setError(null);
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = `featured/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("article-images")
      .upload(filePath, file);

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("article-images")
      .getPublicUrl(filePath);

    update("featured_image_url", urlData.publicUrl);
    if (!form.og_image_url) {
      update("og_image_url", urlData.publicUrl);
    }
    setUploading(false);
    showToast("Image uploaded.");
  }

  async function createAuthor(name: string) {
    const slug = slugify(name);
    const { data, error: insertError } = await supabase
      .from("authors")
      .insert({ name, slug })
      .select()
      .single();
    if (insertError) {
      setError(insertError.message);
      return;
    }
    if (data) {
      setAuthors((prev) => [...prev, data as AuthorRow]);
      update("author_id", data.id);
    }
  }

  async function createCategory(name: string) {
    const slug = slugify(name);
    const { data, error: insertError } = await supabase
      .from("categories")
      .insert({ name, slug })
      .select()
      .single();
    if (insertError) {
      setError(insertError.message);
      return;
    }
    if (data) {
      setCategories((prev) => [...prev, data as CategoryRow]);
      update("category_id", data.id);
    }
  }

  async function createTag(name: string) {
    const slug = slugify(name);
    const { data, error: insertError } = await supabase
      .from("tags")
      .insert({ name, slug })
      .select()
      .single();
    if (insertError) {
      setError(insertError.message);
      return;
    }
    if (data) {
      setTags((prev) => [...prev, data as TagRow]);
      setSelectedTags((prev) => [...prev, data.id]);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="ml-3 text-sm text-muted-foreground">Loading article…</span>
      </div>
    );
  }

  if (error && !form.headline && !isNew) {
    return (
      <div className="surface-card mx-auto max-w-lg p-8 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
        <h2 className="h-display mt-3 text-xl">Article not found</h2>
        <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        <Link to="/blog" className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-4 py-2 text-sm hover:bg-muted">
          <ChevronLeft className="h-4 w-4" /> Back to blog
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col">
      {/* Editor top bar */}
      <div className="sticky top-14 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto grid max-w-[1400px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-2.5 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <Link to="/blog" className="rounded-md p-1.5 hover:bg-muted">
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{form.headline || "Untitled"}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <StatusBadge status={form.status} />
                <span className="inline-flex items-center gap-1"><Save className="h-3 w-3" /> Auto-save off</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {form.status === "published" && (
              <a
                href={`/journal/articles/${form.slug}`}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm hover:bg-muted"
              >
                <Eye className="h-4 w-4" /> Preview
              </a>
            )}
            {form.status === "archived" ? (
              <button
                onClick={() => handleSave("draft")}
                disabled={saving}
                className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm hover:bg-muted"
              >
                <RotateCcw className="h-4 w-4" /> Restore to Draft
              </button>
            ) : form.status === "published" ? (
              <button
                onClick={() => handleSave("draft")}
                disabled={saving}
                className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm hover:bg-muted"
              >
                <RotateCcw className="h-4 w-4" /> Unpublish
              </button>
            ) : null}
            <button
              onClick={() => handleSave("draft")}
              disabled={saving}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm hover:bg-muted"
            >
              <Save className="h-4 w-4" /> Save Draft
            </button>
            {form.status !== "published" ? (
              <button
                onClick={() => handleSave("published")}
                disabled={saving}
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-95"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Publish
              </button>
            ) : (
              <button
                onClick={() => handleSave("archived")}
                disabled={saving}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm hover:bg-muted"
              >
                <Archive className="h-4 w-4" /> Archive
              </button>
            )}
            <button
              onClick={() => setDeleteOpen(true)}
              className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm shadow-lg">
          {toast}
        </div>
      )}

      {/* Error banner */}
      {(error || slugError) && (
        <div className="mx-auto mt-3 flex w-full max-w-[1400px] items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error || slugError}</span>
          <button onClick={() => { setError(null); setSlugError(null); }} className="ml-auto">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_380px] sm:px-6">
        {/* Main editor */}
        <div className="min-w-0">
          <div className="surface-card">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-2 py-1.5">
              {[Bold, Italic, Heading1, Heading2, List, ListOrdered, Quote, Code, ImageIcon, Link2, TableIcon].map((I, i) => (
                <button key={i} className="grid h-8 w-8 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-foreground">
                  <I className="h-4 w-4" />
                </button>
              ))}
              <div className="ml-auto pr-1 text-xs text-muted-foreground">
                {calculateReadingTime(form.body || "")} min read · {(form.body || "").trim().split(/\s+/).filter(Boolean).length} words
              </div>
            </div>

            {/* Cover */}
            {form.featured_image_url ? (
              <div className="relative">
                <img src={form.featured_image_url} alt={form.featured_image_alt ?? ""} className="h-52 w-full object-cover" />
                <button
                  onClick={() => update("featured_image_url", "")}
                  className="absolute right-3 top-3 rounded-md border border-border bg-card/95 px-2.5 py-1 text-xs hover:bg-card"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex h-52 cursor-pointer items-center justify-center border-b border-border bg-muted/30 hover:bg-muted/50">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                  }}
                />
                {uploading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Uploading…
                  </div>
                ) : (
                  <div className="text-center text-sm text-muted-foreground">
                    <Upload className="mx-auto h-6 w-6" />
                    <div className="mt-2">Upload featured image</div>
                  </div>
                )}
              </label>
            )}

            {/* Content */}
            <div className="px-6 py-8 sm:px-10">
              <input
                value={form.headline}
                onChange={(e) => onHeadlineChange(e.target.value)}
                placeholder="Article headline"
                className="w-full border-0 bg-transparent text-3xl font-display font-normal tracking-[-0.028em] leading-tight text-foreground focus:outline-none sm:text-4xl"
              />
              <textarea
                value={form.excerpt}
                onChange={(e) => update("excerpt", e.target.value)}
                placeholder="Excerpt — a short summary shown in listings and search results"
                rows={2}
                className="mt-4 w-full resize-none border-0 bg-transparent text-lg leading-relaxed text-muted-foreground focus:outline-none"
              />
              <hr className="my-6 border-border" />
              <textarea
                value={form.body}
                onChange={(e) => update("body", e.target.value)}
                placeholder="Write your article body…"
                rows={20}
                className="w-full resize-y border-0 bg-transparent text-[15px] leading-7 text-foreground focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right panel */}
        <aside className="min-w-0">
          <div className="surface-card sticky top-32">
            <div className="flex flex-wrap items-center gap-0.5 border-b border-border p-1.5">
              {(["general", "seo", "social"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-md px-2.5 py-1.5 text-xs capitalize transition ${
                    tab === t ? "bg-primary-soft font-medium text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="p-4">
              {tab === "general" && (
                <GeneralPanel
                  form={form}
                  authors={authors}
                  categories={categories}
                  tags={tags}
                  selectedTags={selectedTags}
                  slugError={slugError}
                  slugEdited={slugEdited}
                  onUpdate={update}
                  onSlugEdit={(v) => { setSlugEdited(true); update("slug", v); }}
                  onToggleTag={(tagId) => {
                    setSelectedTags((prev) =>
                      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId],
                    );
                  }}
                  onCreateAuthor={createAuthor}
                  onCreateCategory={createCategory}
                  onCreateTag={createTag}
                />
              )}
              {tab === "seo" && <SeoPanel form={form} onUpdate={update} />}
              {tab === "social" && <SocialPanel form={form} onUpdate={update} />}
            </div>
          </div>
        </aside>
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this article?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The article and all its data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

const inputCls = "w-full h-9 rounded-md border border-border bg-card px-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30";

function Field({ label, children, hint, error }: { label: string; children: React.ReactNode; hint?: string; error?: string }) {
  return (
    <label className="block space-y-1.5">
      <div className="mono-label">{label}</div>
      {children}
      {error ? (
        <div className="text-[11px] text-destructive">{error}</div>
      ) : hint ? (
        <div className="text-[11px] text-muted-foreground">{hint}</div>
      ) : null}
    </label>
  );
}

function GeneralPanel({
  form, authors, categories, tags, selectedTags, slugError, slugEdited,
  onUpdate, onSlugEdit, onToggleTag, onCreateAuthor, onCreateCategory, onCreateTag,
}: {
  form: FormState;
  authors: AuthorRow[];
  categories: CategoryRow[];
  tags: TagRow[];
  selectedTags: string[];
  slugError: string | null;
  slugEdited: boolean;
  onUpdate: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  onSlugEdit: (v: string) => void;
  onToggleTag: (tagId: string) => void;
  onCreateAuthor: (name: string) => void;
  onCreateCategory: (name: string) => void;
  onCreateTag: (name: string) => void;
}) {
  const [newAuthor, setNewAuthor] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newTag, setNewTag] = useState("");

  return (
    <div className="space-y-4">
      <Field label="Slug" error={slugError ?? undefined} hint={slugEdited ? "Manually edited" : "Auto-generated from headline"}>
        <input
          value={form.slug}
          onChange={(e) => onSlugEdit(slugify(e.target.value))}
          className={inputCls}
          placeholder="article-slug"
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Author">
          <div className="space-y-1.5">
            <select
              className={inputCls}
              value={form.author_id}
              onChange={(e) => onUpdate("author_id", e.target.value)}
            >
              <option value="">—</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            <div className="flex gap-1">
              <input
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder="New author…"
                className="h-7 flex-1 rounded border border-border bg-card px-2 text-xs"
              />
              <button
                onClick={() => { if (newAuthor.trim()) { onCreateAuthor(newAuthor.trim()); setNewAuthor(""); } }}
                className="rounded border border-border bg-card px-2 text-xs hover:bg-muted"
              >
                Add
              </button>
            </div>
          </div>
        </Field>
        <Field label="Category">
          <div className="space-y-1.5">
            <select
              className={inputCls}
              value={form.category_id}
              onChange={(e) => onUpdate("category_id", e.target.value)}
            >
              <option value="">—</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <div className="flex gap-1">
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New category…"
                className="h-7 flex-1 rounded border border-border bg-card px-2 text-xs"
              />
              <button
                onClick={() => { if (newCategory.trim()) { onCreateCategory(newCategory.trim()); setNewCategory(""); } }}
                className="rounded border border-border bg-card px-2 text-xs hover:bg-muted"
              >
                Add
              </button>
            </div>
          </div>
        </Field>
      </div>
      <Field label="Tags">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <button
                key={t.id}
                onClick={() => onToggleTag(t.id)}
                className={`rounded-full border px-2.5 py-1 text-xs transition ${
                  selectedTags.includes(t.id)
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.name}
              </button>
            ))}
            {tags.length === 0 && <span className="text-xs text-muted-foreground">No tags yet.</span>}
          </div>
          <div className="flex gap-1">
            <input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="New tag…"
              className="h-7 flex-1 rounded border border-border bg-card px-2 text-xs"
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (newTag.trim()) { onCreateTag(newTag.trim()); setNewTag(""); } } }}
            />
            <button
              onClick={() => { if (newTag.trim()) { onCreateTag(newTag.trim()); setNewTag(""); } }}
              className="rounded border border-border bg-card px-2 text-xs hover:bg-muted"
            >
              Add
            </button>
          </div>
        </div>
      </Field>
      <Field label="Publish date">
        <input
          type="datetime-local"
          className={inputCls}
          value={form.publish_date}
          onChange={(e) => onUpdate("publish_date", e.target.value)}
        />
      </Field>
      <Field label="Featured image alt text">
        <input
          className={inputCls}
          value={form.featured_image_alt}
          onChange={(e) => onUpdate("featured_image_alt", e.target.value)}
          placeholder="Describe the image for accessibility"
        />
      </Field>
    </div>
  );
}

function SeoPanel({ form, onUpdate }: { form: FormState; onUpdate: <K extends keyof FormState>(key: K, value: FormState[K]) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Meta title" hint={`${form.meta_title.length} / 60`}>
        <input
          className={inputCls}
          value={form.meta_title}
          onChange={(e) => onUpdate("meta_title", e.target.value)}
          placeholder={`${form.headline} · FIRMA`}
        />
      </Field>
      <Field label="Meta description" hint={`${form.meta_description.length} / 160`}>
        <textarea
          className="w-full min-h-[80px] rounded-md border border-border bg-card p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
          value={form.meta_description}
          onChange={(e) => onUpdate("meta_description", e.target.value)}
          placeholder={form.excerpt}
        />
      </Field>
      <Field label="Canonical URL">
        <input
          className={inputCls}
          value={form.canonical_url}
          onChange={(e) => onUpdate("canonical_url", e.target.value)}
          placeholder={`https://firma.farm/journal/articles/${form.slug}`}
        />
      </Field>
      <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2 text-sm">
        <span>NoIndex</span>
        <input
          type="checkbox"
          checked={form.no_index}
          onChange={(e) => onUpdate("no_index", e.target.checked)}
          className="h-4 w-4 accent-[var(--primary)]"
        />
      </div>
      <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2 text-sm">
        <span>NoFollow</span>
        <input
          type="checkbox"
          checked={form.no_follow}
          onChange={(e) => onUpdate("no_follow", e.target.checked)}
          className="h-4 w-4 accent-[var(--primary)]"
        />
      </div>
      <div className="rounded-md border border-warn/30 bg-warn/10 p-2.5 text-xs text-muted-foreground">
        Advanced SEO audit, structured data and FAQ schema are Coming Soon.
      </div>
    </div>
  );
}

function SocialPanel({ form, onUpdate }: { form: FormState; onUpdate: <K extends keyof FormState>(key: K, value: FormState[K]) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Open Graph title">
        <input
          className={inputCls}
          value={form.og_title}
          onChange={(e) => onUpdate("og_title", e.target.value)}
          placeholder={form.headline}
        />
      </Field>
      <Field label="Open Graph description">
        <textarea
          className="w-full min-h-[70px] rounded-md border border-border bg-card p-2.5 text-sm"
          value={form.og_description}
          onChange={(e) => onUpdate("og_description", e.target.value)}
          placeholder={form.excerpt}
        />
      </Field>
      <Field label="Open Graph image">
        <input
          className={inputCls}
          value={form.og_image_url}
          onChange={(e) => onUpdate("og_image_url", e.target.value)}
          placeholder={form.featured_image_url}
        />
      </Field>
      {form.og_image_url && (
        <div className="overflow-hidden rounded-md border border-border">
          <img src={form.og_image_url} alt="" className="h-32 w-full object-cover" />
        </div>
      )}
      <div className="rounded-md border border-border p-3">
        <div className="mono-label mb-2">Preview</div>
        <div className="overflow-hidden rounded-md border border-border">
          {form.og_image_url && <img src={form.og_image_url} alt="" className="h-24 w-full object-cover" />}
          <div className="bg-card p-2.5">
            <div className="text-[11px] text-muted-foreground">firma.farm</div>
            <div className="line-clamp-1 text-sm font-medium">{form.og_title || form.headline}</div>
            <div className="line-clamp-1 text-xs text-muted-foreground">{form.og_description || form.excerpt}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
