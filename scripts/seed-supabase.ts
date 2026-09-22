import 'dotenv/config';
import { spawnSync } from 'node:child_process';

const url = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error('VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
}

const memory = new Map<string, string>();
Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: (key: string) => memory.get(key) ?? null,
    setItem: (key: string, value: string) => memory.set(key, value),
    removeItem: (key: string) => memory.delete(key),
    clear: () => memory.clear(),
  },
});

const {
  DEFAULT_BANNERS,
  DEFAULT_BRANDS,
  DEFAULT_CATEGORIES,
  DEFAULT_MESSAGES,
  DEFAULT_MOVEMENTS,
  DEFAULT_PRODUCTS,
  DEFAULT_PROMOTIONS,
  DEFAULT_REVIEWS,
  DEFAULT_SETTINGS,
} = await import('../src/services/storage');

async function upsert(table: string, rows: Record<string, unknown>[], onConflict = 'id') {
  const curl = process.platform === 'win32' ? 'curl.exe' : 'curl';
  const result = spawnSync(
    curl,
    [
      '--silent',
      '--show-error',
      '--fail-with-body',
      '--request',
      'POST',
      `${url}/rest/v1/${table}?on_conflict=${onConflict}`,
      '--header',
      `apikey: ${serviceRoleKey}`,
      '--header',
      `Authorization: Bearer ${serviceRoleKey}`,
      '--header',
      'Content-Type: application/json',
      '--header',
      'Prefer: resolution=merge-duplicates,return=minimal',
      '--data-binary',
      '@-',
    ],
    { input: JSON.stringify(rows), encoding: 'utf8' },
  );
  if (result.status !== 0) {
    throw new Error(`${table}: ${result.stderr || result.stdout || 'request failed'}`);
  }
  console.log(`${table}: ${rows.length} row(s)`);
}

const seedUuid = (group: number, index: number) =>
  `00000000-0000-4000-8${group.toString(16).padStart(3, '0')}-${(index + 1).toString().padStart(12, '0')}`;

await upsert('categories', DEFAULT_CATEGORIES.map((item) => ({
  id: item.id,
  slug: item.slug,
  name: item.name,
  description: item.description,
  image: item.image,
  sort_order: item.order,
  is_active: item.isActive,
})));

await upsert('brands', DEFAULT_BRANDS.map((item) => ({
  id: item.id,
  slug: item.slug,
  name: item.name,
  country: item.country,
  description: item.description,
  is_featured: item.isFeatured,
})));

await upsert('products', DEFAULT_PRODUCTS.map((item) => ({
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
})));

await upsert('promotions', DEFAULT_PROMOTIONS.map((item) => ({
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
})));

await upsert('banners', DEFAULT_BANNERS.map((item) => ({
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
})));

await upsert('store_settings', [{
  id: true,
  store_name: DEFAULT_SETTINGS.storeName,
  tagline: DEFAULT_SETTINGS.tagline,
  subtitle: DEFAULT_SETTINGS.subtitle,
  phone: DEFAULT_SETTINGS.phone,
  whatsapp: DEFAULT_SETTINGS.whatsapp,
  email: DEFAULT_SETTINGS.email,
  address: DEFAULT_SETTINGS.address,
  city: DEFAULT_SETTINGS.city,
  country: DEFAULT_SETTINGS.country,
  maps_url: DEFAULT_SETTINGS.mapsUrl,
  hours: DEFAULT_SETTINGS.hours,
  social_links: DEFAULT_SETTINGS.socialLinks,
  seo: DEFAULT_SETTINGS.seo,
}]);

await upsert('stock_movements', DEFAULT_MOVEMENTS.map((item, index) => ({
  id: seedUuid(1, index),
  product_id: item.productId,
  product_name: item.productName,
  product_ref: item.productRef,
  previous_quantity: item.previousQuantity,
  new_quantity: item.newQuantity,
  quantity_change: item.change,
  movement_type: item.type,
  comment: item.comment,
  created_at: item.createdAt,
})));

await upsert('customer_messages', DEFAULT_MESSAGES.map((item, index) => ({
  id: seedUuid(2, index),
  name: item.name,
  phone: item.phone,
  email: item.email,
  subject: item.subject,
  message: item.message,
  product_id: item.productId ?? null,
  product_name: item.productName ?? null,
  status: item.status,
  created_at: item.createdAt,
})));

await upsert('product_reviews', DEFAULT_REVIEWS.map((item, index) => ({
  id: seedUuid(3, index),
  product_id: item.productId,
  product_name: item.productName,
  product_ref: item.productRef,
  author_name: item.authorName,
  city: item.city,
  rating: item.rating,
  title: item.title,
  comment: item.comment,
  status: item.status,
  verified_purchase: item.verifiedPurchase,
  created_at: item.createdAt,
})));

console.log('Supabase seed completed.');
