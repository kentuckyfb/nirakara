export type ProductCategory = "ring" | "chain" | "bracelet" | "ear-cuff";

export interface Product {
  id: string;
  slug: string;
  name: string;
  unitCode?: string;
  category: ProductCategory;
  priceLKR: number;
  shortDescription: string;
  description: string;
  images: string[];
  highlights: string[];
  isFeatured: boolean;
  finish?: "polished" | "brushed" | "distressed";
  weight?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}
