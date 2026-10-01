import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { api } from "../../lib/api";
import type { AdminProduct, Category } from "../../types";

interface FormState {
  name: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
  ageRange: string;
  material: string;
  imageUrl: string | null;
  images: string[];
  featured: boolean;
  isNew: boolean;
  active: boolean;
}

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  price: "",
  stock: "20",
  categoryId: "",
  ageRange: "",
  material: "",
  imageUrl: null,
  images: [],
  featured: false,
  isNew: true,
  active: true,
};

function toForm(product: AdminProduct): FormState {
  return {
    name: product.name,
    description: product.description,
    price: (product.priceCents / 100).toFixed(2).replace(".", ","),
    stock: String(product.stock),
    categoryId: product.categoryId,
    ageRange: product.ageRange ?? "",
    material: product.material ?? "",
    imageUrl: product.imageUrl ?? null,
    images: product.images,
    featured: product.featured,
    isNew: product.isNew,
    active: product.active,
  };
}

async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);
  const res = await api.upload<{ url: string }>("/admin/uploads", formData);
  return res.url;
}

export function AdminProductFormPage() {
  const { id = "nouveau" } = useParams<{ id: string }>();
  // La clé remonte le formulaire à chaque changement de produit (states remis à zéro)
  return <ProductForm key={id} id={id} />;
}

// id "nouveau" = création ; sinon on édite le produit correspondant
function ProductForm({ id }: { id: string }) {
  const isNew = id === "nouveau";
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState | null>(isNew ? EMPTY_FORM : null);
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api
      .get<{ categories: Category[] }>("/categories")
      .then((res) => {
        setCategories(res.categories);
        setForm((prev) => (prev && !prev.categoryId ? { ...prev, categoryId: res.categories[0]?.id ?? "" } : prev));
      })
      .catch((err) => console.error(err));

    if (!isNew) {
      api
        .get<{ products: AdminProduct[] }>("/admin/products")
        .then((res) => {
          const found = res.products.find((p) => p.id === id);
          if (!found) {
            setError("Produit introuvable");
            return;
          }
          setProduct(found);
          setForm(toForm(found));
        })
        .catch((err) => console.error(err));
    }
  }, [id, isNew]);

  if (!form) {
    return <p className="text-ink-light">{error ?? "Chargement..."}</p>;
  }

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  const handleUpload = async (files: FileList | null, target: "main" | "gallery") => {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    try {
      const urls = await Promise.all(Array.from(files).map(uploadImage));
      if (target === "main") update("imageUrl", urls[0]);
      else update("images", [...form.images, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Envoi de la photo impossible");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const priceCents = Math.round(Number(form.price.replace(",", ".")) * 100);
    if (!Number.isFinite(priceCents) || priceCents <= 0) {
      setError("Le prix doit être un nombre positif, par exemple 24,90");
      return;
    }
    setError(null);
    setIsSaving(true);
    const payload = {
      name: form.name,
      description: form.description,
      priceCents,
      stock: Number(form.stock),
      categoryId: form.categoryId,
      ageRange: form.ageRange.trim() || null,
      material: form.material.trim() || null,
      imageUrl: form.imageUrl,
      images: form.images,
      featured: form.featured,
      isNew: form.isNew,
      active: form.active,
    };
    try {
      if (isNew) await api.post("/admin/products", payload);
      else await api.patch(`/admin/products/${id}`, payload);
      navigate("/admin/produits");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enregistrement impossible");
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!product || !window.confirm(`Supprimer définitivement « ${product.name} » ?`)) return;
    try {
      await api.delete(`/admin/products/${product.id}`);
      navigate("/admin/produits");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Suppression impossible");
    }
  };

  return (
    <div>
      <Link to="/admin/produits" className="text-sm font-medium text-ink-light hover:text-ink">
        ← Tous les produits
      </Link>
      <h2 className="mb-6 mt-2 font-display text-2xl text-ink">
        {isNew ? "Nouveau produit" : `Modifier « ${product?.name} »`}
      </h2>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-4">
          <Input label="Nom" required value={form.name} onChange={(e) => update("name", e.target.value)} />
          <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
            Description
            <textarea
              required
              minLength={10}
              rows={5}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className="rounded-2xl border border-ink/15 bg-white/70 px-4 py-2.5 font-normal text-ink focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30"
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Prix (€)"
              required
              inputMode="decimal"
              placeholder="24,90"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
            />
            <Input
              label="Stock"
              type="number"
              min={0}
              required
              value={form.stock}
              onChange={(e) => update("stock", e.target.value)}
            />
          </div>
          <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
            Catégorie
            <select
              required
              value={form.categoryId}
              onChange={(e) => update("categoryId", e.target.value)}
              className="rounded-2xl border border-ink/15 bg-white/70 px-4 py-2.5 font-normal text-ink focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Âge conseillé"
              placeholder="18 mois et +"
              value={form.ageRange}
              onChange={(e) => update("ageRange", e.target.value)}
            />
            <Input
              label="Matériau"
              placeholder="Bois de hêtre"
              value={form.material}
              onChange={(e) => update("material", e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-6 pt-2 text-sm text-ink">
            <Checkbox checked={form.active} onChange={(v) => update("active", v)}>
              En ligne dans la boutique
            </Checkbox>
            <Checkbox checked={form.featured} onChange={(v) => update("featured", v)}>
              Coup de cœur (page d'accueil)
            </Checkbox>
            <Checkbox checked={form.isNew} onChange={(v) => update("isNew", v)}>
              Badge « Nouveauté »
            </Checkbox>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <p className="mb-2 text-sm font-medium text-ink">Photo principale</p>
            {form.imageUrl ? (
              <div className="relative">
                <img src={form.imageUrl} alt="" className="aspect-square w-full rounded-3xl object-cover" />
                <button
                  type="button"
                  onClick={() => update("imageUrl", null)}
                  className="absolute right-3 top-3 rounded-full bg-cream/90 px-3 py-1 text-xs font-medium shadow-sm"
                >
                  Retirer
                </button>
              </div>
            ) : (
              <FilePicker onFiles={(files) => handleUpload(files, "main")} disabled={uploading}>
                {uploading ? "Envoi en cours..." : "Choisir une photo"}
              </FilePicker>
            )}
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-ink">Galerie (photos supplémentaires)</p>
            <div className="grid grid-cols-3 gap-2">
              {form.images.map((url) => (
                <div key={url} className="relative">
                  <img src={url} alt="" className="aspect-square w-full rounded-2xl object-cover" />
                  <button
                    type="button"
                    onClick={() => update("images", form.images.filter((image) => image !== url))}
                    aria-label="Retirer cette photo"
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-cream/90 text-xs shadow-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {form.images.length < 8 && (
                <FilePicker multiple onFiles={(files) => handleUpload(files, "gallery")} disabled={uploading}>
                  +
                </FilePicker>
              )}
            </div>
            <p className="mt-2 text-xs text-ink-light">
              Les photos sont automatiquement redimensionnées et converties en WebP.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 lg:col-span-2">
          <Button type="submit" disabled={isSaving || uploading}>
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </Button>
          {!isNew && product && (
            <Button type="button" variant="ghost" onClick={handleDelete}>
              Supprimer
            </Button>
          )}
          {error && <p className="text-sm text-terracotta">{error}</p>}
        </div>
      </form>
    </div>
  );
}

function Checkbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-sage"
      />
      {children}
    </label>
  );
}

function FilePicker({
  onFiles,
  multiple = false,
  disabled,
  children,
}: {
  onFiles: (files: FileList | null) => void;
  multiple?: boolean;
  disabled: boolean;
  children: ReactNode;
}) {
  return (
    <label
      className={`flex aspect-square w-full cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-ink/20 text-sm font-medium text-ink-light transition hover:border-sage hover:text-ink ${
        disabled ? "pointer-events-none opacity-50" : ""
      }`}
    >
      {children}
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => {
          onFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </label>
  );
}
