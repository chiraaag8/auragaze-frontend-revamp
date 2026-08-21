"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { ImagePlus, LoaderCircle, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary-url";
import {
  CAROUSEL_CATEGORY_SLUGS,
  type CarouselCategoryInput,
  type CarouselCategoryRecord,
} from "@/types/carousel-category";

const emptyForm: CarouselCategoryInput = {
  name: "",
  slug: CAROUSEL_CATEGORY_SLUGS[0].value,
  image: "",
  sortOrder: 0,
  isActive: true,
};

export default function AdminHomepagePage() {
  const [categories, setCategories] = useState<CarouselCategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CarouselCategoryInput>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/carousel-categories");
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error ?? "Unable to load homepage carousel.");
        setCategories([]);
        return;
      }
      setCategories(data);
    } catch {
      toast.error("Unable to load homepage carousel.");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  function startCreate() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      sortOrder: categories.length,
    });
    setShowForm(true);
  }

  function startEdit(category: CarouselCategoryRecord) {
    setEditingId(category.id);
    setForm({
      name: category.name,
      slug: category.slug,
      image: category.image,
      sortOrder: category.sortOrder,
      isActive: category.isActive,
    });
    setShowForm(true);
  }

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error ?? "Failed to upload image.");
        return;
      }
      setForm((current) => ({ ...current, image: data.url }));
      toast.success("Image uploaded.");
    } catch {
      toast.error("Unable to upload image.");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(
        editingId
          ? `/api/admin/carousel-categories/${editingId}`
          : "/api/admin/carousel-categories",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error ?? "Unable to save carousel category.");
        return;
      }
      toast.success(editingId ? "Category updated." : "Category created.");
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      await loadCategories();
    } catch {
      toast.error("Unable to save carousel category.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(category: CarouselCategoryRecord) {
    try {
      const response = await fetch(
        `/api/admin/carousel-categories/${category.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: !category.isActive }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error ?? "Unable to update category.");
        return;
      }
      setCategories((current) =>
        current.map((item) => (item.id === category.id ? data : item)),
      );
      toast.success(data.isActive ? "Category activated." : "Category hidden.");
    } catch {
      toast.error("Unable to update category.");
    }
  }

  async function removeCategory(category: CarouselCategoryRecord) {
    if (!window.confirm(`Delete "${category.name}" from the homepage carousel?`)) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/carousel-categories/${category.id}`,
        { method: "DELETE" },
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error ?? "Unable to delete category.");
        return;
      }
      toast.success("Category deleted.");
      await loadCategories();
    } catch {
      toast.error("Unable to delete category.");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-sm text-[var(--muted)]">
        <LoaderCircle size={16} className="animate-spin" />
        Loading homepage carousel…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--label-accent)]">
            Storefront
          </p>
          <h1 className="font-heading text-3xl font-black tracking-tight">
            Homepage Carousel
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--muted-strong)]">
            Manage the category cards shown below the hero on the homepage.
            Only active categories with matching products appear on the store.
          </p>
        </div>
        <button type="button" onClick={startCreate} className="admin-button-primary">
          <Plus size={16} />
          Add category
        </button>
      </div>

      {showForm ? (
        <form
          onSubmit={onSubmit}
          className="surface-card max-w-2xl space-y-4 rounded-2xl p-5"
        >
          <h2 className="font-heading text-lg font-bold">
            {editingId ? "Edit category" : "New category"}
          </h2>

          <label className="block space-y-1 text-sm">
            <span className="font-semibold">Display name</span>
            <input
              required
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              className="admin-input"
              placeholder="Oversized Tees"
            />
          </label>

          <label className="block space-y-1 text-sm">
            <span className="font-semibold">Shop category</span>
            <select
              required
              value={form.slug}
              onChange={(event) =>
                setForm((current) => ({ ...current, slug: event.target.value }))
              }
              className="admin-input"
            >
              {CAROUSEL_CATEGORY_SLUGS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="space-y-2">
            <span className="text-sm font-semibold">Card image</span>
            <div className="flex items-start gap-3">
              {form.image.trim() ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={optimizeCloudinaryUrl(form.image, { width: 120 })}
                  alt=""
                  className="h-24 w-16 shrink-0 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-24 w-16 shrink-0 items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-hover)] text-[var(--muted)]">
                  <ImagePlus size={18} />
                </div>
              )}
              <div className="flex-1 space-y-2">
                <input
                  required
                  value={form.image}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      image: event.target.value,
                    }))
                  }
                  className="admin-input"
                  placeholder="https://..."
                />
                <div className="flex flex-wrap gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void uploadImage(file);
                    }}
                  />
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="admin-button-secondary"
                  >
                    {uploading ? (
                      <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                      <ImagePlus size={16} />
                    )}
                    {uploading ? "Uploading…" : "Upload image"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <label className="block space-y-1 text-sm">
            <span className="font-semibold">Sort order</span>
            <input
              required
              type="number"
              min={0}
              step={1}
              value={form.sortOrder}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  sortOrder: Number(event.target.value),
                }))
              }
              className="admin-input"
            />
          </label>

          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={form.isActive ?? true}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  isActive: event.target.checked,
                }))
              }
            />
            Visible on homepage
          </label>

          <div className="flex flex-wrap gap-2 pt-1">
            <button type="submit" disabled={saving} className="admin-button-primary">
              {saving ? <LoaderCircle size={16} className="animate-spin" /> : null}
              {editingId ? "Save changes" : "Create category"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setForm(emptyForm);
              }}
              className="admin-button-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <div className="surface-card overflow-hidden rounded-2xl">
        {categories.length === 0 ? (
          <p className="p-6 text-sm text-[var(--muted)]">
            No carousel categories yet. Add one to replace the default
            hardcoded homepage cards.
          </p>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex flex-wrap items-center gap-4 p-4 lg:p-5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={optimizeCloudinaryUrl(category.image, { width: 96 })}
                  alt=""
                  className="h-20 w-14 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{category.name}</p>
                  <p className="text-sm text-[var(--muted)]">
                    Links to /shop?category={category.slug}
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    Order {category.sortOrder}
                    {!category.isActive ? " · Hidden" : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(category)}
                    className="admin-button-secondary"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => void toggleActive(category)}
                    className="admin-button-secondary"
                  >
                    {category.isActive ? "Hide" : "Show"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void removeCategory(category)}
                    className="admin-icon-button text-red-500"
                    aria-label={`Delete ${category.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
