-- Votre Optic - Clients, ordonnances et facturation
begin;

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  client_code text not null unique,
  full_name text not null,
  phone text not null default '',
  email text not null default '',
  address text not null default '',
  city text not null default '',
  birth_date date,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.prescriptions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  prescription_date date not null,
  prescriber text not null default '',
  od_sphere numeric(5,2), od_cylinder numeric(5,2), od_axis numeric(5,2), od_addition numeric(5,2),
  og_sphere numeric(5,2), og_cylinder numeric(5,2), og_axis numeric(5,2), og_addition numeric(5,2),
  pd numeric(4,1), pd_right numeric(4,1), pd_left numeric(4,1),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete restrict,
  doc_type text not null check (doc_type in ('devis','facture')),
  number text not null unique,
  doc_date date not null,
  status text not null default 'brouillon',
  items jsonb not null default '[]'::jsonb,
  total_ht numeric(12,2) not null default 0,
  tva_rate numeric(5,2) not null default 20,
  tva_amount numeric(12,2) not null default 0,
  total_ttc numeric(12,2) not null default 0,
  notes text not null default '',
  source_devis_id uuid references public.invoices(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.store_settings
  add column if not exists legal jsonb not null default '{}'::jsonb;

create index if not exists prescriptions_client_idx on public.prescriptions(client_id, prescription_date desc);
create index if not exists invoices_client_idx on public.invoices(client_id, doc_date desc);
create index if not exists invoices_type_status_idx on public.invoices(doc_type, status);
create index if not exists clients_name_idx on public.clients(full_name);

drop trigger if exists clients_set_updated_at on public.clients;
create trigger clients_set_updated_at before update on public.clients
for each row execute function public.set_updated_at();
drop trigger if exists prescriptions_set_updated_at on public.prescriptions;
create trigger prescriptions_set_updated_at before update on public.prescriptions
for each row execute function public.set_updated_at();
drop trigger if exists invoices_set_updated_at on public.invoices;
create trigger invoices_set_updated_at before update on public.invoices
for each row execute function public.set_updated_at();

alter table public.clients enable row level security;
alter table public.prescriptions enable row level security;
alter table public.invoices enable row level security;

create policy "Admins manage clients" on public.clients for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage prescriptions" on public.prescriptions for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage invoices" on public.invoices for all using (public.is_admin()) with check (public.is_admin());

grant all on public.clients, public.prescriptions, public.invoices to authenticated;

commit;
