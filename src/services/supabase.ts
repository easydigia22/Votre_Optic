import { createClient } from '@supabase/supabase-js';
import type {
  Banner,
  AdminUser,
  Brand,
  Category,
  CustomerMessage,
  Product,
  ProductReview,
  Promotion,
  ReviewStatus,
  StockMovement,
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

const productToRow = (item: Product) => ({
  id: item.id,
  slug: item.slug,
  reference: item.reference,
  name: item.name,
  brand_id: item.brandId,
  category_id: item.categoryId,
  gender: item.gender,
  eyewear_type: item.type,
  description: item.description,
  price: item.price,
  old_price: item.oldPrice ?? null,
  in_promo: item.inPromo,
  discount_percentage: item.discountPercentage ?? null,
  stock_quantity: item.stockQuantity,
  low_stock_threshold: item.lowStockThreshold,
  images: item.images,
  colors: item.colors,
  frame_type: item.frameType,
  material: item.material,
  lens_type: item.lensType,
  is_new: item.isNew,
  is_featured: item.isFeatured,
  status: item.status,
  created_at: item.createdAt,
  updated_at: item.updatedAt,
});

async function adminFromUser(user: { id: string; email?: string; accessToken?: string }): Promise<AdminUser> {
  const { data, error } = await requireClient()
    .from('admin_profiles')
    .select('name, role')
    .eq('user_id', user.id)
    .single();
  if (error || !data) throw new Error('Ce compte ne possède pas de profil administrateur.');
  return {
    id: user.id,
    email: user.email ?? '',
    name: data.name,
    role: data.role,
    token: user.accessToken,
  };
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) return null;
  try {
    return await adminFromUser({
      id: data.session.user.id,
      email: data.session.user.email,
      accessToken: data.session.access_token,
    });
  } catch {
    return null;
  }
}

export async function signInAdmin(email: string, password: string): Promise<AdminUser> {
  const client = requireClient();
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error || !data.session || !data.user) {
    throw new Error(error?.message ?? 'Identifiants invalides.');
  }
  try {
    return await adminFromUser({
      id: data.user.id,
      email: data.user.email,
      accessToken: data.session.access_token,
    });
  } catch (error) {
    await client.auth.signOut();
    throw error;
  }
}

export async function signOutAdmin(): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function loadAdminPrivateData(): Promise<{
  messages: CustomerMessage[];
  stockMovements: StockMovement[];
}> {
  const client = requireClient();
  const [messages, movements] = await Promise.all([
    client.from('customer_messages').select('*').order('created_at', { ascending: false }),
    client.from('stock_movements').select('*').order('created_at', { ascending: false }),
  ]);
  if (messages.error) throw messages.error;
  if (movements.error) throw movements.error;
  return {
    messages: (messages.data ?? []).map((row: any) => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email,
      subject: row.subject,
      message: row.message,
      productId: row.product_id ?? undefined,
      productName: row.product_name ?? undefined,
      status: row.status,
      createdAt: row.created_at,
    })),
    stockMovements: (movements.data ?? []).map((row: any) => ({
      id: row.id,
      productId: row.product_id,
      productName: row.product_name,
      productRef: row.product_ref,
      previousQuantity: row.previous_quantity,
      newQuantity: row.new_quantity,
      change: row.quantity_change,
      type: row.movement_type,
      comment: row.comment,
      createdAt: row.created_at,
    })),
  };
}

async function upsertAdminRow(table: string, row: Record<string, unknown>): Promise<void> {
  const { error } = await requireClient().from(table).upsert(row);
  if (error) throw error;
}

async function deleteAdminRow(table: string, id: string): Promise<void> {
  const { error } = await requireClient().from(table).delete().eq('id', id);
  if (error) throw error;
}

export const saveAdminProduct = (item: Product) => upsertAdminRow('products', productToRow(item));
export const deleteAdminProduct = (id: string) => deleteAdminRow('products', id);

export const saveAdminCategory = (item: Category) => upsertAdminRow('categories', {
  id: item.id,
  slug: item.slug,
  name: item.name,
  description: item.description,
  image: item.image,
  sort_order: item.order,
  is_active: item.isActive,
});
export const deleteAdminCategory = (id: string) => deleteAdminRow('categories', id);

export const saveAdminBrand = (item: Brand) => upsertAdminRow('brands', {
  id: item.id,
  slug: item.slug,
  name: item.name,
  country: item.country,
  description: item.description,
  is_featured: item.isFeatured,
});
export const deleteAdminBrand = (id: string) => deleteAdminRow('brands', id);

export const saveAdminPromotion = (item: Promotion) => upsertAdminRow('promotions', {
  id: item.id,
  title: item.title,
  description: item.description,
  code: item.code ?? null,
  banner_url: item.bannerUrl,
  cta_text: item.ctaText,
  cta_link: item.ctaLink,
  discount_percentage: item.discountPercentage,
  target_category_id: item.targetCategoryId ?? null,
  target_product_ids: item.targetProductIds ?? [],
  start_date: item.startDate,
  end_date: item.endDate,
  is_active: item.isActive,
  created_at: item.createdAt,
});
export const deleteAdminPromotion = (id: string) => deleteAdminRow('promotions', id);

export const saveAdminBanner = (item: Banner) => upsertAdminRow('banners', {
  id: item.id,
  title: item.title,
  subtitle: item.subtitle,
  image: item.image,
  button_text: item.buttonText,
  button_link: item.buttonLink,
  position: item.position,
  start_date: item.startDate ?? null,
  end_date: item.endDate ?? null,
  is_active: item.isActive,
});
export const deleteAdminBanner = (id: string) => deleteAdminRow('banners', id);

export const saveAdminSettings = (item: StoreSettings) => upsertAdminRow('store_settings', {
  id: true,
  store_name: item.storeName,
  tagline: item.tagline,
  subtitle: item.subtitle,
  phone: item.phone,
  whatsapp: item.whatsapp,
  email: item.email,
  address: item.address,
  city: item.city,
  country: item.country,
  maps_url: item.mapsUrl,
  hours: item.hours,
  social_links: item.socialLinks,
  seo: item.seo,
});

export async function saveAdminStockMovement(item: StockMovement): Promise<void> {
  await upsertAdminRow('stock_movements', {
    id: item.id.startsWith('mov-') ? crypto.randomUUID() : item.id,
    product_id: item.productId,
    product_name: item.productName,
    product_ref: item.productRef,
    previous_quantity: item.previousQuantity,
    new_quantity: item.newQuantity,
    quantity_change: item.change,
    movement_type: item.type,
    comment: item.comment,
    created_at: item.createdAt,
  });
}

export async function updateAdminMessageStatus(
  id: string,
  status: CustomerMessage['status'],
): Promise<void> {
  const { error } = await requireClient().from('customer_messages').update({ status }).eq('id', id);
  if (error) throw error;
}
export const deleteAdminMessage = (id: string) => deleteAdminRow('customer_messages', id);

export async function updateAdminReviewStatus(id: string, status: ReviewStatus): Promise<void> {
  const { error } = await requireClient().from('product_reviews').update({ status }).eq('id', id);
  if (error) throw error;
}
export const deleteAdminReview = (id: string) => deleteAdminRow('product_reviews', id);
