export type ProductCategory = "ring" | "chain" | "bracelet" | "ear-cuff";

export interface Product {
  id: string;
  slug: string;
  name: string;
  unitCode?: string;
  category: ProductCategory;
  priceLKR: number;
  image?: string;
  shortDescription: string;
  description: string;
  images: string[];
  highlights: string[];
  isFeatured: boolean;
  isVisible: boolean; // Controls whether product is shown on website
  finish?: "polished" | "brushed" | "distressed";
  weight?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}
