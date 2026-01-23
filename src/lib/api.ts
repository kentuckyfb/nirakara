import { supabase } from "./supabase";
import type { Product } from "@/types/product";

const PRODUCTS_BUCKET = "products";

const mapProduct = (row: any): Product => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  unitCode: row.unit_code ?? undefined,
  category: row.category,
  priceLKR: Number(row.price_lkr ?? row.priceLKR ?? 0),
  image: row.image ?? undefined,
  shortDescription: row.short_description ?? "",
  description: row.description ?? "",
  images: Array.isArray(row.images) ? row.images : [],
  highlights: Array.isArray(row.highlights) ? row.highlights : [],
  isFeatured: Boolean(row.is_featured),
  isVisible: row.is_visible !== false,
  finish: row.finish ?? undefined,
  weight: row.weight ?? undefined,
});

const mapToDb = (product: Partial<Product>) => ({
  id: product.id,
  slug: product.slug,
  name: product.name,
  unit_code: product.unitCode ?? null,
  category: product.category ?? null,
  price_lkr: product.priceLKR ?? null,
  image: product.image ?? null,
  short_description: product.shortDescription ?? null,
  description: product.description ?? null,
  images: product.images ?? [],
  highlights: product.highlights ?? [],
  is_featured: product.isFeatured ?? false,
  is_visible: product.isVisible ?? true,
  finish: product.finish ?? null,
  weight: product.weight ?? null,
});

const parseCsv = (value?: string | null) =>
  value
    ? value
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean)
    : [];

const uploadImage = async (file: File) => {
  const filePath = `products/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from(PRODUCTS_BUCKET)
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from(PRODUCTS_BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
};

export const getProducts = async () => {
  const { data, error } = await supabase.from("products").select("*");
  if (error) {
    console.error("Supabase fetch failed", error);
    return [];
  }
  return data.map(mapProduct);
};

export const getProduct = async (slug: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Supabase fetch failed", error);
  }

  if (data) return mapProduct(data);

  const { data: byId, error: idError } = await supabase
    .from("products")
    .select("*")
    .eq("id", slug)
    .maybeSingle();

  if (idError) {
    console.error("Supabase fetch failed", idError);
    return null;
  }

  return byId ? mapProduct(byId) : null;
};

export const getConfig = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("category, finish");

  if (error) {
    console.error("Supabase config fetch failed", error);
    return null;
  }

  const categories = Array.from(
    new Set((data || []).map((row) => row.category).filter(Boolean))
  );
  const finishes = Array.from(
    new Set((data || []).map((row) => row.finish).filter(Boolean))
  );

  return {
    title: "The Archive",
    subtitle: "Explore our collection.",
    filters: {
      categories,
      materials: [],
      finishes,
    },
  };
};

export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login error", error);
    throw error;
  }

  return {
    token: data.session?.access_token ?? "",
    user: { email: data.user?.email ?? "", uid: data.user?.id ?? "" },
  };
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Logout error", error);
  }
};

export const createProduct = async (formData: FormData, _token: string) => {
  const productData: any = {};
  let imageFile: File | null = null;

  formData.forEach((value, key) => {
    if (key === "image" && value instanceof File) imageFile = value;
    else productData[key] = value;
  });

  if (imageFile) {
    productData.image = await uploadImage(imageFile);
  }

  if (productData.priceLKR) productData.priceLKR = Number(productData.priceLKR);
  productData.isFeatured =
    productData.isFeatured === "true" || productData.isFeatured === true;
  productData.isVisible =
    productData.isVisible === "true" || productData.isVisible === true;

  if (typeof productData.images === "string") {
    productData.images = parseCsv(productData.images);
  }
  if (typeof productData.highlights === "string") {
    productData.highlights = parseCsv(productData.highlights);
  }

  const docId = productData.slug || `product-${Date.now()}`;
  productData.id = docId;

  const { error } = await supabase
    .from("products")
    .upsert(mapToDb({ ...productData, id: docId }), { onConflict: "id" });

  if (error) {
    console.error("Error creating product:", error);
    throw error;
  }

  return { id: docId, ...productData };
};

export const updateProduct = async (id: string, formData: FormData, _token: string) => {
  const productData: any = {};
  let imageFile: File | null = null;

  formData.forEach((value, key) => {
    if (key === "image" && value instanceof File) imageFile = value;
    else productData[key] = value;
  });

  if (imageFile) {
    productData.image = await uploadImage(imageFile);
  }

  if (productData.priceLKR) productData.priceLKR = Number(productData.priceLKR);
  if (productData.isFeatured !== undefined) {
    productData.isFeatured =
      productData.isFeatured === "true" || productData.isFeatured === true;
  }
  if (productData.isVisible !== undefined) {
    productData.isVisible =
      productData.isVisible === "true" || productData.isVisible === true;
  }

  if (typeof productData.images === "string") {
    productData.images = parseCsv(productData.images);
  }
  if (typeof productData.highlights === "string") {
    productData.highlights = parseCsv(productData.highlights);
  }

  const { error } = await supabase
    .from("products")
    .update(mapToDb(productData))
    .eq("id", id);

  if (error) {
    console.error("Error updating product:", error);
    throw error;
  }

  return { id, ...productData };
};

export const deleteProduct = async (id: string, _token: string) => {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
  return { success: true };
};

export const bulkUpsertProducts = async (products: Product[]) => {
  const payload = products.map((product) => mapToDb(product));
  const { error } = await supabase
    .from("products")
    .upsert(payload, { onConflict: "id" });

  if (error) {
    console.error("Bulk upload failed:", error);
    throw error;
  }
};
