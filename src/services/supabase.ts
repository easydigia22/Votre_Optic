import { createClient } from '@supabase/supabase-js';
import type {
  Banner,
  Brand,
  Category,
  CustomerMessage,
  Product,
  ProductReview,
  Promotion,
  StoreSettings,
} from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;

const requireClient = () => {
  if (!supabase) throw new Error('Supabase is not configured');
  return supabase;
};

const categoryFromRow = (row: any): Category => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  description: row.description,
  image: row.image,
  order: row.sort_order,
  isActive: row.is_active,
});

const brandFromRow = (row: any): Brand => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  country: row.country,
  description: row.description,
  isFeatured: row.is_featured,
});

const productFromRow = (row: any): Product => ({
  id: row.id,
  slug: row.slug,
  reference: row.reference,
  name: row.name,
  brandId: row.brand_id,
  categoryId: row.category_id,
  gender: row.gender,
  type: row.eyewear_type,
  description: row.description,
  price: Number(row.price),
  oldPrice: row.old_price == null ? undefined : Number(row.old_price),
  inPromo: row.in_promo,
  discountPercentage: row.discount_percentage ?? undefined,
  stockQuantity: row.stock_quantity,
  lowStockThreshold: row.low_stock_threshold,
  images: row.images ?? [],
  colors: row.colors ?? [],
  frameType: row.frame_type,
  material: row.material,
  lensType: row.lens_type,
  isNew: row.is_new,
  isFeatured: row.is_featured,
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const promotionFromRow = (row: any): Promotion => ({
  id: row.id,
  title: row.title,
  description: row.description,
  code: row.code ?? undefined,
  bannerUrl: row.banner_url,
  ctaText: row.cta_text,
  ctaLink: row.cta_link,
  discountPercentage: row.discount_percentage,
  targetCategoryId: row.target_category_id ?? undefined,
  targetProductIds: row.target_product_ids ?? [],
  startDate: row.start_date,
  endDate: row.end_date,
  isActive: row.is_active,
  createdAt: row.created_at,
});

const bannerFromRow = (row: any): Banner => ({
  id: row.id,
  title: row.title,
  subtitle: row.subtitle,
  image: row.image,
  buttonText: row.button_text,
  buttonLink: row.button_link,
  position: row.position,
  startDate: row.start_date ?? undefined,
  endDate: row.end_date ?? undefined,
  isActive: row.is_active,
});

const reviewFromRow = (row: any): ProductReview => ({
  id: row.id,
  productId: row.product_id,
  productName: row.product_name,
  productRef: row.product_ref,
  authorName: row.author_name,
  city: row.city,
  rating: row.rating,
  title: row.title,
  comment: row.comment,
  status: row.status,
  verifiedPurchase: row.verified_purchase,
  createdAt: row.created_at,
});

const settingsFromRow = (row: any): StoreSettings => ({
  storeName: row.store_name,
  tagline: row.tagline,
  subtitle: row.subtitle,
  phone: row.phone,
  whatsapp: row.whatsapp,
  email: row.email,
  address: row.address,
  city: row.city,
  country: row.country,
  mapsUrl: row.maps_url,
  hours: row.hours,
  socialLinks: row.social_links,
  seo: row.seo,
});

export interface PublicStoreData {
  categories: Category[];
  brands: Brand[];
  products: Product[];
  promotions: Promotion[];
  banners: Banner[];
  reviews: ProductReview[];
  settings?: StoreSettings;
}

export async function loadPublicStoreData(): Promise<PublicStoreData> {
  const client = requireClient();
  const [categories, brands, products, promotions, banners, reviews, settings] = await Promise.all([
    client.from('categories').select('*').order('sort_order'),
    client.from('brands').select('*').order('name'),
    client.from('products').select('*').order('created_at', { ascending: false }),
    client.from('promotions').select('*').order('created_at', { ascending: false }),
    client.from('banners').select('*').order('created_at', { ascending: false }),
    client.from('product_reviews').select('*').order('created_at', { ascending: false }),
    client.from('store_settings').select('*').limit(1).maybeSingle(),
  ]);

  const firstError = [categories, brands, products, promotions, banners, reviews, settings]
    .map((result) => result.error)
    .find(Boolean);
  if (firstError) throw firstError;

  return {
    categories: (categories.data ?? []).map(categoryFromRow),
    brands: (brands.data ?? []).map(brandFromRow),
    products: (products.data ?? []).map(productFromRow),
    promotions: (promotions.data ?? []).map(promotionFromRow),
    banners: (banners.data ?? []).map(bannerFromRow),
    reviews: (reviews.data ?? []).map(reviewFromRow),
    settings: settings.data ? settingsFromRow(settings.data) : undefined,
  };
}

export async function submitCustomerMessage(
  message: Omit<CustomerMessage, 'id' | 'status' | 'createdAt'>,
): Promise<void> {
  const { error } = await requireClient().from('customer_messages').insert({
    name: message.name,
    phone: message.phone,
    email: message.email,
    subject: message.subject,
    message: message.message,
    product_id: message.productId ?? null,
    product_name: message.productName ?? null,
    status: 'unread',
  });
  if (error) throw error;
}

export async function submitProductReview(
  review: Omit<ProductReview, 'id' | 'createdAt' | 'status'>,
): Promise<void> {
  const { error } = await requireClient().from('product_reviews').insert({
    product_id: review.productId,
    product_name: review.productName,
    product_ref: review.productRef,
    author_name: review.authorName,
    city: review.city,
    rating: review.rating,
    title: review.title,
    comment: review.comment,
    status: 'pending',
    verified_purchase: false,
  });
  if (error) throw error;
}
