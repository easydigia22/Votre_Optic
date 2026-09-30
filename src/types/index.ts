export type Gender = 'femme' | 'homme' | 'enfant' | 'mixte';
export type EyewearType = 'vue' | 'soleil';
export type ProductStatus = 'active' | 'archived' | 'draft';
export type AdminRole = 'ROLE_ADMIN' | 'ROLE_MANAGER' | 'ROLE_VENDEUR';
export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  order: number;
  isActive: boolean;
  itemCount?: number;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  country: string;
  description: string;
  isFeatured: boolean;
}

export interface Product {
  id: string;
  slug: string;
  reference: string; // SKU
  name: string;
  brandId: string;
  categoryId: string;
  gender: Gender;
  type: EyewearType;
  description: string;
  price: number; // in MAD (Dirhams)
  oldPrice?: number;
  inPromo: boolean;
  discountPercentage?: number;
  stockQuantity: number;
  lowStockThreshold: number; // Default 3
  images: string[];
  colors: string[];
  frameType: string; // e.g., 'Pantoscopique', 'Papillon', 'Aviateur', 'Ronde', 'Carrée', 'Rectangulaire'
  material: string; // e.g., 'Acétate Italien Mazzucchelli', 'Titane Pur Japonais', 'Métal Plaqué Or 18K'
  lensType: string; // e.g., 'Anti-lumière bleue & UV400', 'Polarisé Catégorie 3', 'Progressif Haute Précision'
  isNew: boolean;
  isFeatured: boolean;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  productRef: string;
  previousQuantity: number;
  newQuantity: number;
  change: number;
  type: 'reassort' | 'vente' | 'ajustement' | 'retour';
  comment: string;
  createdAt: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  code?: string;
  bannerUrl: string;
  ctaText: string;
  ctaLink: string;
  discountPercentage: number;
  targetCategoryId?: string;
  targetProductIds?: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  position: 'hero' | 'collection' | 'promo' | 'seasonal';
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

export interface CustomerMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  productId?: string;
  productName?: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export interface SocialLinks {
  instagram: string;
  facebook: string;
  tiktok: string;
  whatsapp: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  subtitle: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  country: string;
  mapsUrl: string;
  hours: string;
  socialLinks: SocialLinks;
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
  legal?: LegalInfo;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  token?: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  productName: string;
  productRef: string;
  authorName: string;
  city: string;
  rating: number;
  title: string;
  comment: string;
  status: ReviewStatus;
  verifiedPurchase: boolean;
  createdAt: string;
}

// ---- Clients & Facturation ----
export interface Client {
  id: string;
  clientCode: string; // CLI-YYYY-NNNN
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  birthDate: string | null; // ISO yyyy-mm-dd
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface EyePrescription {
  sphere: number | null;
  cylinder: number | null;
  axis: number | null;      // 0..180
  addition: number | null;
}

export interface Prescription {
  id: string;
  clientId: string;
  prescriptionDate: string; // ISO yyyy-mm-dd
  prescriber: string;
  right: EyePrescription;   // OD
  left: EyePrescription;    // OG
  pd: number | null;        // écart pupillaire total (mm)
  pdRight: number | null;
  pdLeft: number | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  label: string;
  qty: number;
  unitPriceHt: number;
}

export type InvoiceDocType = 'devis' | 'facture';
// devis: brouillon | accepte | refuse ; facture: impayee | payee | annulee
export type InvoiceStatus =
  | 'brouillon' | 'accepte' | 'refuse'
  | 'impayee' | 'payee' | 'annulee';

export interface Invoice {
  id: string;
  clientId: string;
  docType: InvoiceDocType;
  number: string; // DEV-YYYY-NNNN | FAC-YYYY-NNNN
  docDate: string; // ISO yyyy-mm-dd
  status: InvoiceStatus;
  items: InvoiceItem[];
  totalHt: number;
  tvaRate: number;
  tvaAmount: number;
  totalTtc: number;
  notes: string;
  sourceDevisId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LegalInfo {
  ice?: string;
  if?: string;
  rc?: string;
  patente?: string;
  capital?: string;
}

export interface FilterState {
  search: string;
  gender: string; // 'all' | 'femme' | 'homme' | 'enfant'
  type: string; // 'all' | 'vue' | 'soleil'
  categoryId: string; // 'all' | string
  brandId: string; // 'all' | string
  inStockOnly: boolean;
  promoOnly: boolean;
  newOnly: boolean;
  minPrice: number;
  maxPrice: number;
  color: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest';
}
