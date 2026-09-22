-- Votre Optic - initial Supabase schema
-- Apply with Supabase migrations or paste into the Supabase SQL Editor.

begin;

create extension if not exists pgcrypto;

create table if not exists public.categories (
  id text primary key,
  slug text not null unique,
  name text not null,
  description text not null default '',
  image text not null default '',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.brands (
  id text primary key,
  slug text not null unique,
  name text not null,
  country text not null default '',
  description text not null default '',
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  slug text not null unique,
  reference text not null unique,
  name text not null,
  brand_id text references public.brands(id) on update cascade on delete restrict,
  category_id text references public.categories(id) on update cascade on delete restrict,
  gender text not null check (gender in ('femme', 'homme', 'enfant', 'mixte')),
  eyewear_type text not null check (eyewear_type in ('vue', 'soleil')),
  description text not null default '',
  price numeric(12,2) not null check (price >= 0),
  old_price numeric(12,2) check (old_price is null or old_price >= 0),
  in_promo boolean not null default false,
  discount_percentage integer check (discount_percentage is null or discount_percentage between 0 and 100),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  low_stock_threshold integer not null default 3 check (low_stock_threshold >= 0),
  images text[] not null default '{}',
  colors text[] not null default '{}',
  frame_type text not null default '',
  material text not null default '',
  lens_type text not null default '',
  is_new boolean not null default false,
  is_featured boolean not null default false,
  status text not null default 'draft' check (status in ('active', 'archived', 'draft')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id) on update cascade on delete cascade,
  product_name text not null,
  product_ref text not null,
  previous_quantity integer not null check (previous_quantity >= 0),
  new_quantity integer not null check (new_quantity >= 0),
  quantity_change integer not null,
  movement_type text not null check (movement_type in ('reassort', 'vente', 'ajustement', 'retour')),
  comment text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.promotions (
  id text primary key,
  title text not null,
  description text not null default '',
  code text,
  banner_url text not null default '',
  cta_text text not null default '',
  cta_link text not null default '',
  discount_percentage integer not null check (discount_percentage between 0 and 100),
  target_category_id text references public.categories(id) on update cascade on delete set null,
  target_product_ids text[] not null default '{}',
  start_date timestamptz not null,
  end_date timestamptz not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint promotions_dates_valid check (end_date >= start_date)
);

create table if not exists public.banners (
  id text primary key,
  title text not null,
  subtitle text not null default '',
  image text not null default '',
  button_text text not null default '',
  button_link text not null default '',
  position text not null check (position in ('hero', 'collection', 'promo', 'seasonal')),
  start_date timestamptz,
  end_date timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint banners_dates_valid check (end_date is null or start_date is null or end_date >= start_date)
);

create table if not exists public.customer_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null default '',
  subject text not null default '',
  message text not null,
  product_id text references public.products(id) on update cascade on delete set null,
  product_name text,
  status text not null default 'unread' check (status in ('unread', 'read', 'replied')),
  created_at timestamptz not null default now()
);

create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id) on update cascade on delete cascade,
  product_name text not null,
  product_ref text not null,
  author_name text not null,
  city text not null default '',
  rating smallint not null check (rating between 1 and 5),
  title text not null,
  comment text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  verified_purchase boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.store_settings (
  id boolean primary key default true check (id),
  store_name text not null,
  tagline text not null default '',
  subtitle text not null default '',
  phone text not null default '',
  whatsapp text not null default '',
  email text not null default '',
  address text not null default '',
  city text not null default '',
  country text not null default '',
  maps_url text not null default '',
  hours text not null default '',
  social_links jsonb not null default '{}'::jsonb,
  seo jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null default 'ROLE_ADMIN' check (role in ('ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_VENDEUR')),
  created_at timestamptz not null default now()
);

create index if not exists products_brand_id_idx on public.products(brand_id);
create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists products_status_idx on public.products(status);
create index if not exists products_featured_idx on public.products(is_featured) where status = 'active';
create index if not exists stock_movements_product_id_idx on public.stock_movements(product_id, created_at desc);
create index if not exists product_reviews_product_id_idx on public.product_reviews(product_id, status, created_at desc);
create index if not exists customer_messages_status_idx on public.customer_messages(status, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_profiles
    where user_id = auth.uid()
  );
$$;

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at before update on public.categories
for each row execute function public.set_updated_at();
drop trigger if exists brands_set_updated_at on public.brands;
create trigger brands_set_updated_at before update on public.brands
for each row execute function public.set_updated_at();
drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at before update on public.products
for each row execute function public.set_updated_at();
drop trigger if exists banners_set_updated_at on public.banners;
create trigger banners_set_updated_at before update on public.banners
for each row execute function public.set_updated_at();
drop trigger if exists store_settings_set_updated_at on public.store_settings;
create trigger store_settings_set_updated_at before update on public.store_settings
for each row execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.stock_movements enable row level security;
alter table public.promotions enable row level security;
alter table public.banners enable row level security;
alter table public.customer_messages enable row level security;
alter table public.product_reviews enable row level security;
alter table public.store_settings enable row level security;
alter table public.admin_profiles enable row level security;

create policy "Public reads active categories" on public.categories for select
using (is_active or public.is_admin());
create policy "Public reads brands" on public.brands for select using (true);
create policy "Public reads active products" on public.products for select
using (status = 'active' or public.is_admin());
create policy "Public reads active promotions" on public.promotions for select
using (is_active or public.is_admin());
create policy "Public reads active banners" on public.banners for select
using (is_active or public.is_admin());
create policy "Public reads store settings" on public.store_settings for select using (true);
create policy "Public reads approved reviews" on public.product_reviews for select
using (status = 'approved' or public.is_admin());

create policy "Visitors create messages" on public.customer_messages for insert
with check (status = 'unread');
create policy "Visitors create pending reviews" on public.product_reviews for insert
with check (status = 'pending' and verified_purchase = false);

create policy "Admins manage categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage brands" on public.brands for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage products" on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage stock" on public.stock_movements for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage promotions" on public.promotions for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage banners" on public.banners for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage messages" on public.customer_messages for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage reviews" on public.product_reviews for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage settings" on public.store_settings for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins read profiles" on public.admin_profiles for select using (user_id = auth.uid());

grant usage on schema public to anon, authenticated;
grant select on public.categories, public.brands, public.products, public.promotions, public.banners, public.store_settings to anon, authenticated;
grant select, insert on public.product_reviews to anon, authenticated;
grant insert on public.customer_messages to anon, authenticated;
grant all on public.categories, public.brands, public.products, public.stock_movements, public.promotions, public.banners, public.customer_messages, public.product_reviews, public.store_settings to authenticated;
grant select on public.admin_profiles to authenticated;

commit;
