# Espace Clients & Facturation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter à l'espace admin deux onglets (Clients, Facturation) pour gérer les clients de la boutique, leurs ordonnances optiques (VL/VP) et leurs devis/factures (TVA 20%, impression PDF), le tout persisté dans Supabase avec fallback localStorage.

**Architecture:** On suit le pattern existant du projet — types (`src/types/index.ts`) → logique pure (`src/services/billing.ts`) → service Supabase (`src/services/supabase.ts`, mappers + `upsertAdminRow`) → fallback localStorage (`src/services/storage.ts`) → état & handlers dans `src/App.tsx` → composants admin (`src/admin/*`). 3 nouvelles tables admin-only (RLS `is_admin()`).

**Tech Stack:** React 19, TypeScript, Vite, Tailwind v4, Supabase JS, lucide-react. Aucune nouvelle dépendance.

**Spec:** `docs/superpowers/specs/2026-09-30-clients-facturation-design.md`

## Global Constraints

- **Aucune nouvelle dépendance npm** (impression via `window.print()`).
- **Devise** : MAD uniquement. **TVA** : 20 % par défaut.
- Tables Supabase **admin-only** : RLS `using (public.is_admin()) with check (public.is_admin())`, `grant all ... to authenticated`, aucun grant `anon`.
- Numérotation : `CLI-YYYY-NNNN`, `DEV-YYYY-NNNN`, `FAC-YYYY-NNNN` (NNNN sur 4 chiffres, année en cours).
- Style admin existant : palette `#11110F` / `#15140F` / `#C6A53A` / `#FFFDF7`, classes Tailwind, wrapper `brand-light`.
- **Pas de test runner dans le repo** : cycle de vérification par tâche = `npm run lint` (tsc --noEmit) + `npm run build` + smoke manuel. La logique pure est isolée dans `billing.ts` (testable si un runner est ajouté plus tard).
- Convention de commit du repo (français, `feat:`/`fix:`/`docs:`) + ligne `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.

## Review Focus

- **Champs de correction vides** : une ordonnance peut n'avoir qu'un œil ou pas d'addition ; l'affichage VP et l'impression ne doivent pas afficher `NaN`/`null` mais rester vides. → Task 1 (helpers `formatDiopter`, `computeNear`).
- **Facture sans lignes ou quantités à 0** : les totaux doivent valoir 0 sans planter, et la sauvegarde rester possible en brouillon. → Task 1 (`computeInvoiceTotals`).
- **Numérotation au passage d'année / trou dans la séquence** : `nextNumber` doit repartir de 0001 la nouvelle année et ignorer les numéros d'autres années/préfixes. → Task 1 (`nextSequentialNumber`).
- **Suppression d'un client ayant des factures** : doit être refusée avec message clair (intégrité comptable), pas une erreur Supabase brute. → Task 5 (`handleDeleteClient`).
- **Supabase non configuré / hors-ligne** : les 3 entités doivent fonctionner en localStorage comme les autres (aucun crash si `isSupabaseConfigured` est faux). → Task 4.

---

## File Structure

**Créés :**
- `src/services/billing.ts` — logique pure : numérotation, calcul TVA/totaux, formatage dioptries, calcul VP.
- `supabase/migrations/20260930120000_create_clients_billing.sql` — 3 tables + colonne `legal` sur store_settings.
- `src/admin/AdminClients.tsx` — onglet Clients (liste + fiche).
- `src/admin/ClientForm.tsx` — formulaire coordonnées client.
- `src/admin/PrescriptionForm.tsx` — formulaire ordonnance OD/OG.
- `src/admin/AdminInvoices.tsx` — onglet Facturation (registre global).
- `src/admin/InvoiceForm.tsx` — formulaire devis/facture.
- `src/admin/InvoiceDocument.tsx` — document imprimable + impression.

**Modifiés :**
- `src/types/index.ts` — nouveaux types.
- `src/services/supabase.ts` — mappers, load, save/delete, `legal` dans settings.
- `src/services/storage.ts` — fallback + démo + délégation aux helpers billing.
- `src/App.tsx` — état, handlers, câblage rendu.
- `src/admin/AdminLayout.tsx` — 2 entrées nav.
- `src/admin/AdminSettings.tsx` — champs mentions légales.
- `src/index.css` — règles `@media print`.
- `scripts/seed-supabase.ts` — seed démo.

---

## Task 1: Types + logique pure de facturation

**Files:**
- Modify: `src/types/index.ts` (ajout en fin de fichier)
- Create: `src/services/billing.ts`

**Interfaces:**
- Produces (types) : `Client`, `Prescription`, `EyePrescription`, `Invoice`, `InvoiceItem`, `InvoiceDocType`, `InvoiceStatus`, `LegalInfo`.
- Produces (fonctions) :
  - `nextSequentialNumber(prefix: string, existing: string[], year?: number): string`
  - `computeInvoiceTotals(items: InvoiceItem[], tvaRate: number): { totalHt: number; tvaAmount: number; totalTtc: number }`
  - `formatDiopter(v: number | null | undefined): string`
  - `computeNear(sphere: number | null | undefined, addition: number | null | undefined): number | null`
  - `formatMad(v: number): string`

- [ ] **Step 1: Ajouter les types dans `src/types/index.ts`**

```typescript
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
```

- [ ] **Step 2: Étendre `StoreSettings` avec `legal`**

Dans `src/types/index.ts`, repérer l'interface `StoreSettings` et ajouter la propriété optionnelle (juste après `seo`) :

```typescript
  legal?: LegalInfo;
```

- [ ] **Step 3: Créer `src/services/billing.ts`**

```typescript
import type { InvoiceItem } from '../types';

/** Renvoie le prochain numéro séquentiel PREFIX-YYYY-NNNN pour l'année donnée. */
export function nextSequentialNumber(
  prefix: string,
  existing: string[],
  year: number = new Date().getFullYear(),
): string {
  const head = `${prefix}-${year}-`;
  let max = 0;
  for (const code of existing) {
    if (!code || !code.startsWith(head)) continue;
    const n = parseInt(code.slice(head.length), 10);
    if (Number.isFinite(n) && n > max) max = n;
  }
  return `${head}${String(max + 1).padStart(4, '0')}`;
}

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export function computeInvoiceTotals(
  items: InvoiceItem[],
  tvaRate: number,
): { totalHt: number; tvaAmount: number; totalTtc: number } {
  const totalHt = round2(
    (items || []).reduce(
      (sum, it) => sum + (Number(it.qty) || 0) * (Number(it.unitPriceHt) || 0),
      0,
    ),
  );
  const tvaAmount = round2((totalHt * (Number(tvaRate) || 0)) / 100);
  const totalTtc = round2(totalHt + tvaAmount);
  return { totalHt, tvaAmount, totalTtc };
}

/** Formate une dioptrie avec signe explicite (+1.25, -0.50) ; vide si null. */
export function formatDiopter(v: number | null | undefined): string {
  if (v === null || v === undefined || Number.isNaN(v)) return '';
  const sign = v > 0 ? '+' : '';
  return `${sign}${v.toFixed(2)}`;
}

/** Sphère de vision de près = sphère VL + addition ; null si sphère absente. */
export function computeNear(
  sphere: number | null | undefined,
  addition: number | null | undefined,
): number | null {
  if (sphere === null || sphere === undefined || Number.isNaN(sphere)) return null;
  return round2(sphere + (Number(addition) || 0));
}

export function formatMad(v: number): string {
  return `${(Number(v) || 0).toFixed(2)} MAD`;
}
```

- [ ] **Step 4: Vérifier compilation**

Run: `npm run lint`
Expected: PASS (aucune erreur TS).

- [ ] **Step 5: Commit**

```bash
git add src/types/index.ts src/services/billing.ts
git commit -m "feat: types Clients/Facturation + logique pure billing (numéros, TVA, dioptries)"
```

---

## Task 2: Migration Supabase (3 tables + colonne legal)

**Files:**
- Create: `supabase/migrations/20260930120000_create_clients_billing.sql`

**Interfaces:**
- Produces : tables `public.clients`, `public.prescriptions`, `public.invoices` ; colonne `public.store_settings.legal jsonb`.

- [ ] **Step 1: Créer le fichier de migration**

```sql
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
```

- [ ] **Step 2: Appliquer la migration**

Deux options (au choix de l'exécutant) :
- Supabase MCP : `apply_migration(project_id="tdyjghitibysmixghabc", name="create_clients_billing", query=<contenu du fichier>)`.
- Ou coller le SQL dans l'éditeur SQL du dashboard Supabase et exécuter.

Vérifier : `list_tables` doit lister `clients`, `prescriptions`, `invoices`.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/20260930120000_create_clients_billing.sql
git commit -m "feat: migration Supabase clients/prescriptions/invoices + colonne legal"
```

---

## Task 3: Service Supabase (mappers, load, save/delete, legal)

**Files:**
- Modify: `src/services/supabase.ts`

**Interfaces:**
- Consumes : types de Task 1 ; `upsertAdminRow`, `requireClient` (existants).
- Produces :
  - `clientFromRow/clientToRow`, `prescriptionFromRow/prescriptionToRow`, `invoiceFromRow/invoiceToRow`.
  - `saveAdminClient(c: Client)`, `saveAdminPrescription(p: Prescription)`, `saveAdminInvoice(i: Invoice)`.
  - `deleteAdminRow(table: string, id: string): Promise<void>`.
  - `loadAdminPrivateData()` retourne en plus `clients`, `prescriptions`, `invoices`.
  - `saveAdminSettings` inclut `legal`.

- [ ] **Step 1: Ajouter les imports de types**

Dans l'`import type { ... } from '../types'` en tête de `src/services/supabase.ts`, ajouter : `Client, Prescription, Invoice`.

- [ ] **Step 2: Ajouter les mappers (près des autres `xFromRow`)**

```typescript
const clientFromRow = (row: any): Client => ({
  id: row.id,
  clientCode: row.client_code,
  fullName: row.full_name,
  phone: row.phone,
  email: row.email,
  address: row.address,
  city: row.city,
  birthDate: row.birth_date,
  notes: row.notes,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const clientToRow = (c: Client) => ({
  id: c.id,
  client_code: c.clientCode,
  full_name: c.fullName,
  phone: c.phone,
  email: c.email,
  address: c.address,
  city: c.city,
  birth_date: c.birthDate,
  notes: c.notes,
});

const prescriptionFromRow = (row: any): Prescription => ({
  id: row.id,
  clientId: row.client_id,
  prescriptionDate: row.prescription_date,
  prescriber: row.prescriber,
  right: { sphere: row.od_sphere, cylinder: row.od_cylinder, axis: row.od_axis, addition: row.od_addition },
  left: { sphere: row.og_sphere, cylinder: row.og_cylinder, axis: row.og_axis, addition: row.og_addition },
  pd: row.pd, pdRight: row.pd_right, pdLeft: row.pd_left,
  notes: row.notes,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const prescriptionToRow = (p: Prescription) => ({
  id: p.id,
  client_id: p.clientId,
  prescription_date: p.prescriptionDate,
  prescriber: p.prescriber,
  od_sphere: p.right.sphere, od_cylinder: p.right.cylinder, od_axis: p.right.axis, od_addition: p.right.addition,
  og_sphere: p.left.sphere, og_cylinder: p.left.cylinder, og_axis: p.left.axis, og_addition: p.left.addition,
  pd: p.pd, pd_right: p.pdRight, pd_left: p.pdLeft,
  notes: p.notes,
});

const invoiceFromRow = (row: any): Invoice => ({
  id: row.id,
  clientId: row.client_id,
  docType: row.doc_type,
  number: row.number,
  docDate: row.doc_date,
  status: row.status,
  items: Array.isArray(row.items) ? row.items : [],
  totalHt: Number(row.total_ht),
  tvaRate: Number(row.tva_rate),
  tvaAmount: Number(row.tva_amount),
  totalTtc: Number(row.total_ttc),
  notes: row.notes,
  sourceDevisId: row.source_devis_id,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const invoiceToRow = (i: Invoice) => ({
  id: i.id,
  client_id: i.clientId,
  doc_type: i.docType,
  number: i.number,
  doc_date: i.docDate,
  status: i.status,
  items: i.items,
  total_ht: i.totalHt,
  tva_rate: i.tvaRate,
  tva_amount: i.tvaAmount,
  total_ttc: i.totalTtc,
  notes: i.notes,
  source_devis_id: i.sourceDevisId,
});
```

- [ ] **Step 3: Ajouter save/delete (près de `saveAdminStockMovement`)**

```typescript
export const saveAdminClient = (item: Client) => upsertAdminRow('clients', clientToRow(item));
export const saveAdminPrescription = (item: Prescription) => upsertAdminRow('prescriptions', prescriptionToRow(item));
export const saveAdminInvoice = (item: Invoice) => upsertAdminRow('invoices', invoiceToRow(item));

export async function deleteAdminRow(table: string, id: string): Promise<void> {
  const { error } = await requireClient().from(table).delete().eq('id', id);
  if (error) throw error;
}
```

- [ ] **Step 4: Charger les 3 entités dans `loadAdminPrivateData`**

Repérer le corps de `loadAdminPrivateData()` (autour de la ligne 295). Ajouter les requêtes et les inclure dans le retour. Exemple aligné sur le style existant (requêtes en parallèle) :

```typescript
  const [clientsRes, prescriptionsRes, invoicesRes] = await Promise.all([
    client.from('clients').select('*').order('created_at', { ascending: false }),
    client.from('prescriptions').select('*').order('prescription_date', { ascending: false }),
    client.from('invoices').select('*').order('doc_date', { ascending: false }),
  ]);
```

Puis, dans l'objet retourné, ajouter :

```typescript
    clients: (clientsRes.data ?? []).map(clientFromRow),
    prescriptions: (prescriptionsRes.data ?? []).map(prescriptionFromRow),
    invoices: (invoicesRes.data ?? []).map(invoiceFromRow),
```

Mettre à jour la signature de retour de `loadAdminPrivateData` (type inline) pour inclure `clients: Client[]; prescriptions: Prescription[]; invoices: Invoice[];`.

- [ ] **Step 5: Inclure `legal` dans settings**

Dans `saveAdminSettings` (~ligne 400), ajouter au row : `legal: item.legal ?? {},`. Dans le mapper de lecture des settings (`settingsFromRow` ou équivalent utilisé par `loadPublicStoreData`), ajouter `legal: row.legal ?? {},`.

- [ ] **Step 6: Vérifier**

Run: `npm run lint`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/services/supabase.ts
git commit -m "feat: service Supabase clients/prescriptions/invoices + legal settings"
```

---

## Task 4: Fallback localStorage + données de démo

**Files:**
- Modify: `src/services/storage.ts`

**Interfaces:**
- Consumes : types Task 1, helpers `billing.ts`.
- Produces : `DEFAULT_CLIENTS`, `DEFAULT_PRESCRIPTIONS`, `DEFAULT_INVOICES` ; intégration des 3 entités dans le mécanisme localStorage existant (mêmes clés/patterns que `products`, etc.).

- [ ] **Step 1: Repérer le pattern de stockage existant**

Lire `src/services/storage.ts` pour identifier comment une entité (ex. `products` ou `reviews`) est : (a) définie en `DEFAULT_*`, (b) lue/écrite via une clé localStorage, (c) exposée par l'objet `storage`. Reproduire ce pattern pour `clients`, `prescriptions`, `invoices`.

- [ ] **Step 2: Ajouter les données de démo**

```typescript
export const DEFAULT_CLIENTS: Client[] = [
  {
    id: 'client-demo-1',
    clientCode: 'CLI-2026-0001',
    fullName: 'Sofia Bennani',
    phone: '+212 661 22 33 44',
    email: 'sofia.bennani@example.ma',
    address: 'Avenue Mohammed VI',
    city: 'Marrakech',
    birthDate: '1990-04-12',
    notes: 'Préfère les montures acétate.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const DEFAULT_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'presc-demo-1',
    clientId: 'client-demo-1',
    prescriptionDate: '2026-09-01',
    prescriber: 'Dr. Alami',
    right: { sphere: -1.25, cylinder: -0.5, axis: 90, addition: 1.0 },
    left: { sphere: -1.0, cylinder: -0.25, axis: 85, addition: 1.0 },
    pd: 62, pdRight: 31, pdLeft: 31,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const DEFAULT_INVOICES: Invoice[] = [
  {
    id: 'inv-demo-1',
    clientId: 'client-demo-1',
    docType: 'facture',
    number: 'FAC-2026-0001',
    docDate: '2026-09-02',
    status: 'payee',
    items: [
      { label: 'Monture acétate + verres unifocaux', qty: 1, unitPriceHt: 1500 },
    ],
    totalHt: 1500, tvaRate: 20, tvaAmount: 300, totalTtc: 1800,
    notes: '', sourceDevisId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
```

Ajouter l'import des types en tête du fichier (`Client, Prescription, Invoice`).

- [ ] **Step 3: Exposer les entités dans `storage`**

En suivant strictement le pattern relevé au Step 1, ajouter la lecture/écriture localStorage des 3 clés (`vo_clients`, `vo_prescriptions`, `vo_invoices` — respecter le préfixe utilisé par les autres clés) et les getters/setters correspondants sur l'objet `storage`.

- [ ] **Step 4: Vérifier**

Run: `npm run lint && npm run build`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/services/storage.ts
git commit -m "feat: fallback localStorage + données démo clients/ordonnances/factures"
```

---

## Task 5: État & handlers dans App.tsx

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes : `saveAdminClient/Prescription/Invoice`, `deleteAdminRow` (Task 3) ; `storage` (Task 4) ; helpers `billing.ts` (Task 1).
- Produces (passés aux composants) :
  - `handleSaveClient(c: Client): Promise<void>` (assigne `clientCode` si absent)
  - `handleDeleteClient(id: string): Promise<void>` (refuse si factures liées)
  - `handleSavePrescription(p: Prescription)`, `handleDeletePrescription(id)`
  - `handleSaveInvoice(i: Invoice)` (assigne `number` + recalcule totaux), `handleDeleteInvoice(id)`
  - `handleConvertDevisToFacture(devis: Invoice): Promise<Invoice>`

- [ ] **Step 1: Imports**

Ajouter dans les imports de `App.tsx` : les types `Client, Prescription, Invoice` ; depuis `services/supabase` : `saveAdminClient, saveAdminPrescription, saveAdminInvoice, deleteAdminRow` ; depuis `services/billing` : `nextSequentialNumber, computeInvoiceTotals` ; les `DEFAULT_CLIENTS/PRESCRIPTIONS/INVOICES` si besoin.

- [ ] **Step 2: State**

Près des autres `useState` admin (products, reviews…), ajouter :

```typescript
const [clients, setClients] = useState<Client[]>([]);
const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
const [invoices, setInvoices] = useState<Invoice[]>([]);
```

Les alimenter au chargement des données admin (là où `loadAdminPrivateData()`/storage remplit products, reviews, etc.), avec le même schéma (Supabase si configuré, sinon storage).

- [ ] **Step 3: Handlers clients**

```typescript
const persistClient = async (next: Client) => {
  setClients((prev) => {
    const exists = prev.some((c) => c.id === next.id);
    return exists ? prev.map((c) => (c.id === next.id ? next : c)) : [next, ...prev];
  });
  if (isSupabaseConfigured) await saveAdminClient(next); else storage.setClients(/* updated list */);
};

const handleSaveClient = async (draft: Client) => {
  const isNew = !clients.some((c) => c.id === draft.id);
  const clientCode = draft.clientCode
    || nextSequentialNumber('CLI', clients.map((c) => c.clientCode));
  const now = new Date().toISOString();
  await persistClient({ ...draft, clientCode, createdAt: draft.createdAt || now, updatedAt: now });
};

const handleDeleteClient = async (id: string) => {
  if (invoices.some((i) => i.clientId === id)) {
    alert('Impossible de supprimer : ce client possède des devis/factures. Archivez-les d’abord.');
    return;
  }
  setClients((prev) => prev.filter((c) => c.id !== id));
  setPrescriptions((prev) => prev.filter((p) => p.clientId !== id));
  if (isSupabaseConfigured) await deleteAdminRow('clients', id);
  else storage.setClients(/* filtered */);
};
```

> Note d'implémentation : adapter les appels `storage.setX` au pattern réel relevé en Task 4 (passer la liste à jour). Le `alert()` peut être remplacé par le mécanisme de toast existant s'il y en a un — sinon `alert` est acceptable et cohérent avec l'app.

- [ ] **Step 4: Handlers ordonnances**

```typescript
const handleSavePrescription = async (draft: Prescription) => {
  const now = new Date().toISOString();
  const next = { ...draft, createdAt: draft.createdAt || now, updatedAt: now };
  setPrescriptions((prev) =>
    prev.some((p) => p.id === next.id) ? prev.map((p) => (p.id === next.id ? next : p)) : [next, ...prev],
  );
  if (isSupabaseConfigured) await saveAdminPrescription(next); else storage.setPrescriptions(/* updated */);
};

const handleDeletePrescription = async (id: string) => {
  setPrescriptions((prev) => prev.filter((p) => p.id !== id));
  if (isSupabaseConfigured) await deleteAdminRow('prescriptions', id); else storage.setPrescriptions(/* filtered */);
};
```

- [ ] **Step 5: Handlers facturation**

```typescript
const handleSaveInvoice = async (draft: Invoice) => {
  const now = new Date().toISOString();
  const totals = computeInvoiceTotals(draft.items, draft.tvaRate);
  const number = draft.number
    || nextSequentialNumber(draft.docType === 'facture' ? 'FAC' : 'DEV', invoices.map((i) => i.number));
  const next: Invoice = { ...draft, ...totals, number, createdAt: draft.createdAt || now, updatedAt: now };
  setInvoices((prev) =>
    prev.some((i) => i.id === next.id) ? prev.map((i) => (i.id === next.id ? next : i)) : [next, ...prev],
  );
  if (isSupabaseConfigured) await saveAdminInvoice(next); else storage.setInvoices(/* updated */);
  return next;
};

const handleDeleteInvoice = async (id: string) => {
  setInvoices((prev) => prev.filter((i) => i.id !== id));
  if (isSupabaseConfigured) await deleteAdminRow('invoices', id); else storage.setInvoices(/* filtered */);
};

const handleConvertDevisToFacture = async (devis: Invoice) => {
  const facture: Invoice = {
    ...devis,
    id: crypto.randomUUID(),
    docType: 'facture',
    number: '', // (re)généré par handleSaveInvoice
    status: 'impayee',
    sourceDevisId: devis.id,
    docDate: new Date().toISOString().slice(0, 10),
    createdAt: '', updatedAt: '',
  };
  return handleSaveInvoice(facture);
};
```

- [ ] **Step 6: Vérifier**

Run: `npm run lint`
Expected: PASS. (Les composants n'existent pas encore ; on ne câble le rendu qu'en Task 7+.)

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx
git commit -m "feat: état et handlers clients/ordonnances/factures dans App"
```

---

## Task 6: Navigation sidebar (2 onglets) + slots de rendu

**Files:**
- Modify: `src/admin/AdminLayout.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes : `navItems` (existant), `adminActiveTab` (existant).
- Produces : onglets `clients` et `billing` cliquables ; badge impayés optionnel.

- [ ] **Step 1: Ajouter les icônes**

Dans l'import `lucide-react` de `AdminLayout.tsx`, ajouter `Users` et `Receipt`.

- [ ] **Step 2: Ajouter les entrées nav**

Insérer dans `navItems` (après `stock`, avant `promotions` par exemple) :

```typescript
    { id: 'clients', label: 'Clients', icon: Users },
    {
      id: 'billing',
      label: 'Facturation',
      icon: Receipt,
      badge: badgeCounts?.unpaidInvoices && badgeCounts.unpaidInvoices > 0
        ? `${badgeCounts.unpaidInvoices}` : undefined,
      badgeColor: 'bg-red-500 text-white',
    },
```

- [ ] **Step 3: Étendre le type `badgeCounts`**

Dans l'interface `AdminLayoutProps.badgeCounts`, ajouter `unpaidInvoices?: number;`.

- [ ] **Step 4: Calculer et passer le badge dans App.tsx**

Près des autres compteurs (`lowStockCount`…), ajouter :

```typescript
const unpaidInvoicesCount = invoices.filter((i) => i.docType === 'facture' && i.status === 'impayee').length;
```

Puis dans `badgeCounts={{ ... }}` du `<AdminLayout>`, ajouter `unpaidInvoices: unpaidInvoicesCount,`.

- [ ] **Step 5: Ajouter les slots de rendu (placeholder temporaire)**

Dans `App.tsx`, après le bloc `settings`, ajouter deux blocs conditionnels temporaires pour vérifier la navigation :

```tsx
{adminActiveTab === 'clients' && <div className="text-white">Clients (à venir)</div>}
{adminActiveTab === 'billing' && <div className="text-white">Facturation (à venir)</div>}
```

- [ ] **Step 6: Vérifier**

Run: `npm run lint && npm run build`
Expected: PASS. Smoke manuel : les 2 onglets apparaissent et s'activent.

- [ ] **Step 7: Commit**

```bash
git add src/admin/AdminLayout.tsx src/App.tsx
git commit -m "feat: onglets sidebar Clients et Facturation"
```

---

## Task 7: AdminClients + ClientForm

**Files:**
- Create: `src/admin/AdminClients.tsx`
- Create: `src/admin/ClientForm.tsx`
- Modify: `src/App.tsx` (remplacer le placeholder `clients`)

**Interfaces:**
- Consumes : `Client, Prescription, Invoice` ; handlers Task 5 ; `PrescriptionForm` (Task 8, importé mais la section ordonnances peut d'abord afficher une liste vide puis être complétée en Task 8) ; `formatMad` (billing).
- Produces (props) :
  ```typescript
  interface AdminClientsProps {
    clients: Client[];
    prescriptions: Prescription[];
    invoices: Invoice[];
    onSaveClient: (c: Client) => Promise<void>;
    onDeleteClient: (id: string) => Promise<void>;
    onSavePrescription: (p: Prescription) => Promise<void>;
    onDeletePrescription: (id: string) => Promise<void>;
    onNavigateToInvoice: (clientId: string) => void; // ouvre l'onglet billing filtré
  }
  ```

- [ ] **Step 1: Créer `ClientForm.tsx`**

Formulaire contrôlé pour créer/éditer un `Client` (champs : fullName, phone, email, address, city, birthDate, notes). Style admin (inputs `bg-[#11110F] border border-white/10 text-white p-2.5`, labels `text-[#9F9A8E] uppercase`). Bouton Enregistrer appelle `onSubmit(client)`. `id` généré via `crypto.randomUUID()` si nouveau. `clientCode/createdAt/updatedAt` laissés vides (assignés par `handleSaveClient`).

```tsx
import React, { useState } from 'react';
import { Client } from '../types';

interface Props { initial?: Client | null; onSubmit: (c: Client) => void; onCancel: () => void; }

const empty: Client = {
  id: '', clientCode: '', fullName: '', phone: '', email: '',
  address: '', city: 'Marrakech', birthDate: null, notes: '',
  createdAt: '', updatedAt: '',
};

export const ClientForm: React.FC<Props> = ({ initial, onSubmit, onCancel }) => {
  const [form, setForm] = useState<Client>(initial ?? { ...empty, id: crypto.randomUUID() });
  const set = (k: keyof Client, v: any) => setForm((p) => ({ ...p, [k]: v }));
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}
      className="space-y-4 text-xs"
    >
      {/* champs: fullName (required), phone, email, address, city, birthDate (type=date), notes (textarea) */}
      {/* ... inputs suivant le style admin ... */}
      <div className="flex gap-2">
        <button type="submit" className="bg-[#C6A53A] text-[#11110F] font-bold px-4 py-2">Enregistrer</button>
        <button type="button" onClick={onCancel} className="border border-white/20 text-white px-4 py-2">Annuler</button>
      </div>
    </form>
  );
};
```

> Compléter les inputs entre les commentaires en suivant exactement le style de `AdminSettings.tsx`. `fullName` a l'attribut `required`. `birthDate` : `value={form.birthDate ?? ''} onChange -> set('birthDate', e.target.value || null)`.

- [ ] **Step 2: Créer `AdminClients.tsx`**

Layout deux colonnes : à gauche recherche + liste des clients (nom, code, ville) ; à droite fiche du client sélectionné avec 3 sections (Coordonnées + bouton éditer → `ClientForm` ; Ordonnances : liste + bouton « Nouvelle ordonnance » → `PrescriptionForm` ; Devis & Factures : liste filtrée `invoices.filter(i => i.clientId === selected.id)` avec bouton « Voir dans Facturation » → `onNavigateToInvoice`). En-tête « Nouveau client » ouvre `ClientForm` vide. Recherche : filtre insensible à la casse sur `fullName`, `phone`, `clientCode`.

Structure minimale :

```tsx
import React, { useState } from 'react';
import { Client, Prescription, Invoice } from '../types';
import { ClientForm } from './ClientForm';
import { PrescriptionForm } from './PrescriptionForm';
import { formatMad } from '../services/billing';
import { UserPlus, Search, Trash2, Pencil } from 'lucide-react';

// ...interface AdminClientsProps (voir Interfaces)...

export const AdminClients: React.FC<AdminClientsProps> = (props) => {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [addingPrescription, setAddingPrescription] = useState(false);

  const filtered = props.clients.filter((c) =>
    [c.fullName, c.phone, c.clientCode].join(' ').toLowerCase().includes(query.toLowerCase()),
  );
  const selected = props.clients.find((c) => c.id === selectedId) ?? null;
  const clientPrescriptions = props.prescriptions.filter((p) => p.clientId === selectedId);
  const clientInvoices = props.invoices.filter((i) => i.clientId === selectedId);

  // rendu: header + grid 2 colonnes (liste | détail). Détail conditionnel selon `editing`/`addingPrescription`.
  return (/* ...JSX style admin... */);
};
```

> Le rendu détaillé suit le style admin. La section « Devis & Factures » affiche `number`, `docType`, `status`, `formatMad(totalTtc)`.

- [ ] **Step 3: Câbler dans App.tsx**

Remplacer le placeholder `clients` par :

```tsx
{adminActiveTab === 'clients' && (
  <AdminClients
    clients={clients}
    prescriptions={prescriptions}
    invoices={invoices}
    onSaveClient={handleSaveClient}
    onDeleteClient={handleDeleteClient}
    onSavePrescription={handleSavePrescription}
    onDeletePrescription={handleDeletePrescription}
    onNavigateToInvoice={(clientId) => { setBillingClientFilter(clientId); setAdminActiveTab('billing'); }}
  />
)}
```

Ajouter l'import `AdminClients` et un state `const [billingClientFilter, setBillingClientFilter] = useState<string | null>(null);`.

- [ ] **Step 4: Vérifier**

Run: `npm run lint && npm run build`
Expected: PASS. Smoke : créer un client → apparaît avec code `CLI-2026-000X`.

- [ ] **Step 5: Commit**

```bash
git add src/admin/AdminClients.tsx src/admin/ClientForm.tsx src/App.tsx
git commit -m "feat: onglet Clients (liste, fiche, création/édition)"
```

---

## Task 8: PrescriptionForm (ordonnance OD/OG, VP calculée)

**Files:**
- Create: `src/admin/PrescriptionForm.tsx`

**Interfaces:**
- Consumes : `Prescription, EyePrescription` ; `formatDiopter, computeNear` (billing).
- Produces : `PrescriptionForm` avec props `{ clientId: string; initial?: Prescription | null; onSubmit: (p: Prescription) => void; onCancel: () => void; }`.

- [ ] **Step 1: Créer le composant**

Tableau de saisie 2 lignes (OD, OG) × colonnes VL (Sphère, Cylindre, Axe) + Addition. Sous chaque œil, afficher la **VP calculée** en lecture seule via `formatDiopter(computeNear(sphere, addition))`. Champs date, prescripteur, PD (total + monoculaires optionnels), notes. Les nombres sont parsés avec un helper `num(e.target.value)` renvoyant `null` si vide.

```tsx
import React, { useState } from 'react';
import { Prescription, EyePrescription } from '../types';
import { formatDiopter, computeNear } from '../services/billing';

const num = (v: string): number | null => (v.trim() === '' ? null : Number(v));

const emptyEye: EyePrescription = { sphere: null, cylinder: null, axis: null, addition: null };

interface Props { clientId: string; initial?: Prescription | null; onSubmit: (p: Prescription) => void; onCancel: () => void; }

export const PrescriptionForm: React.FC<Props> = ({ clientId, initial, onSubmit, onCancel }) => {
  const [form, setForm] = useState<Prescription>(
    initial ?? {
      id: crypto.randomUUID(), clientId,
      prescriptionDate: new Date().toISOString().slice(0, 10),
      prescriber: '', right: { ...emptyEye }, left: { ...emptyEye },
      pd: null, pdRight: null, pdLeft: null, notes: '',
      createdAt: '', updatedAt: '',
    },
  );
  const setEye = (side: 'right' | 'left', k: keyof EyePrescription, v: number | null) =>
    setForm((p) => ({ ...p, [side]: { ...p[side], [k]: v } }));

  // rendu: tableau OD/OG, colonnes Sphère/Cylindre/Axe/Addition (inputs number),
  // ligne VP: formatDiopter(computeNear(form.right.sphere, form.right.addition)) etc.
  return (/* ...JSX... */);
};
```

- [ ] **Step 2: Intégrer dans AdminClients**

Dans `AdminClients.tsx`, quand `addingPrescription` (ou édition d'une ordonnance), rendre `<PrescriptionForm clientId={selected.id} initial={...} onSubmit={(p) => { props.onSavePrescription(p); setAddingPrescription(false); }} onCancel={() => setAddingPrescription(false)} />`.

- [ ] **Step 3: Vérifier**

Run: `npm run lint && npm run build`
Expected: PASS. Smoke : ajouter une ordonnance ; la VP s'affiche = Sphère + Addition ; champs vides restent vides (pas de `NaN`).

- [ ] **Step 4: Commit**

```bash
git add src/admin/PrescriptionForm.tsx src/admin/AdminClients.tsx
git commit -m "feat: formulaire ordonnance OD/OG avec VP calculée"
```

---

## Task 9: InvoiceForm (devis/facture)

**Files:**
- Create: `src/admin/InvoiceForm.tsx`

**Interfaces:**
- Consumes : `Invoice, InvoiceItem, InvoiceDocType, InvoiceStatus, Client` ; `computeInvoiceTotals, formatMad` (billing).
- Produces : `InvoiceForm` props `{ clients: Client[]; initial?: Invoice | null; defaultClientId?: string | null; onSubmit: (i: Invoice) => void; onCancel: () => void; }`.

- [ ] **Step 1: Créer le composant**

Sélecteur client (obligatoire), type (devis/facture), date, statut (options selon type), éditeur de lignes (ajout/suppression, label/qty/PU HT), champ TVA (défaut 20), notes. Récapitulatif live via `computeInvoiceTotals(items, tvaRate)` affiché (HT, TVA, TTC) avec `formatMad`.

```tsx
import React, { useMemo, useState } from 'react';
import { Invoice, InvoiceItem, InvoiceDocType, InvoiceStatus, Client } from '../types';
import { computeInvoiceTotals, formatMad } from '../services/billing';
import { Plus, Trash2 } from 'lucide-react';

const STATUS_BY_TYPE: Record<InvoiceDocType, InvoiceStatus[]> = {
  devis: ['brouillon', 'accepte', 'refuse'],
  facture: ['impayee', 'payee', 'annulee'],
};

interface Props { clients: Client[]; initial?: Invoice | null; defaultClientId?: string | null; onSubmit: (i: Invoice) => void; onCancel: () => void; }

export const InvoiceForm: React.FC<Props> = ({ clients, initial, defaultClientId, onSubmit, onCancel }) => {
  const [form, setForm] = useState<Invoice>(
    initial ?? {
      id: crypto.randomUUID(), clientId: defaultClientId ?? '',
      docType: 'devis', number: '', docDate: new Date().toISOString().slice(0, 10),
      status: 'brouillon', items: [{ label: '', qty: 1, unitPriceHt: 0 }],
      totalHt: 0, tvaRate: 20, tvaAmount: 0, totalTtc: 0, notes: '', sourceDevisId: null,
      createdAt: '', updatedAt: '',
    },
  );
  const totals = useMemo(() => computeInvoiceTotals(form.items, form.tvaRate), [form.items, form.tvaRate]);
  const setItem = (idx: number, k: keyof InvoiceItem, v: any) =>
    setForm((p) => ({ ...p, items: p.items.map((it, i) => (i === idx ? { ...it, [k]: v } : it)) }));
  const addItem = () => setForm((p) => ({ ...p, items: [...p.items, { label: '', qty: 1, unitPriceHt: 0 }] }));
  const removeItem = (idx: number) => setForm((p) => ({ ...p, items: p.items.filter((_, i) => i !== idx) }));

  // quand docType change, réinitialiser status au 1er de STATUS_BY_TYPE[type]
  // submit: onSubmit({ ...form, ...totals })
  return (/* ...JSX... */);
};
```

- [ ] **Step 2: Vérifier**

Run: `npm run lint && npm run build`
Expected: PASS. Smoke : lignes → totaux HT/TVA/TTC corrects ; 0 ligne → totaux 0 sans crash.

- [ ] **Step 3: Commit**

```bash
git add src/admin/InvoiceForm.tsx
git commit -m "feat: formulaire devis/facture avec lignes et TVA"
```

---

## Task 10: InvoiceDocument (impression PDF)

**Files:**
- Create: `src/admin/InvoiceDocument.tsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes : `Invoice, Client, StoreSettings` ; `formatMad` (billing).
- Produces : `InvoiceDocument` props `{ invoice: Invoice; client: Client; settings: StoreSettings; onClose: () => void; }`.

- [ ] **Step 1: Règles d'impression dans `src/index.css`**

```css
@media print {
  body * { visibility: hidden; }
  .print-document, .print-document * { visibility: visible; }
  .print-document { position: absolute; inset: 0; margin: 0; padding: 24px; background: #fff; color: #000; }
  .no-print { display: none !important; }
}
```

- [ ] **Step 2: Créer le composant**

Modal plein écran (fond sombre `no-print`) contenant `.print-document` blanc : en-tête (logo/nom boutique + adresse depuis `settings` + mentions légales `settings.legal` si présentes), bloc client, titre (`DEVIS` ou `FACTURE` + `invoice.number` + date), tableau des lignes (désignation, qté, PU HT, total ligne), récap HT/TVA/TTC via `formatMad`, notes, pied. Boutons `no-print` : « Imprimer / PDF » → `window.print()`, « Fermer » → `onClose`.

```tsx
import React from 'react';
import { Invoice, Client, StoreSettings } from '../types';
import { formatMad } from '../services/billing';

interface Props { invoice: Invoice; client: Client; settings: StoreSettings; onClose: () => void; }

export const InvoiceDocument: React.FC<Props> = ({ invoice, client, settings, onClose }) => {
  const title = invoice.docType === 'facture' ? 'FACTURE' : 'DEVIS';
  const legal = settings.legal ?? {};
  return (
    <div className="fixed inset-0 z-50 bg-black/70 overflow-auto p-4">
      <div className="mx-auto max-w-3xl bg-white text-black print-document">
        {/* en-tête, client, tableau, totaux, mentions légales (ICE/IF/RC/Patente si renseignés) */}
      </div>
      <div className="no-print mx-auto max-w-3xl flex gap-2 mt-4">
        <button onClick={() => window.print()} className="bg-[#C6A53A] text-[#11110F] font-bold px-4 py-2">Imprimer / PDF</button>
        <button onClick={onClose} className="bg-white/10 text-white px-4 py-2">Fermer</button>
      </div>
    </div>
  );
};
```

- [ ] **Step 3: Vérifier**

Run: `npm run lint && npm run build`
Expected: PASS. Smoke : ouverture du document, `window.print()` déclenche l'aperçu, seul le document est visible à l'impression.

- [ ] **Step 4: Commit**

```bash
git add src/admin/InvoiceDocument.tsx src/index.css
git commit -m "feat: document devis/facture imprimable (print to PDF)"
```

---

## Task 11: AdminInvoices (registre global) + câblage

**Files:**
- Create: `src/admin/AdminInvoices.tsx`
- Modify: `src/App.tsx` (remplacer le placeholder `billing`)

**Interfaces:**
- Consumes : `Invoice, Client, StoreSettings` ; `InvoiceForm`, `InvoiceDocument` ; handlers Task 5 ; `formatMad`.
- Produces (props) :
  ```typescript
  interface AdminInvoicesProps {
    invoices: Invoice[];
    clients: Client[];
    settings: StoreSettings;
    initialClientFilter?: string | null;
    onSaveInvoice: (i: Invoice) => Promise<Invoice> | void;
    onDeleteInvoice: (id: string) => Promise<void>;
    onConvertDevisToFacture: (devis: Invoice) => Promise<Invoice> | void;
  }
  ```

- [ ] **Step 1: Créer `AdminInvoices.tsx`**

Barre d'outils : recherche (numéro/nom client), filtres type (tous/devis/facture) et statut, bouton « Nouveau devis » / « Nouvelle facture ». Bandeau totaux : CA facturé TTC (factures non annulées), total impayé. Tableau : numéro, type, client (nom via `clients`), date, statut, TTC, actions (Éditer → `InvoiceForm`, Imprimer → `InvoiceDocument`, Convertir en facture si `docType==='devis'`, Supprimer). Applique `initialClientFilter` au montage s'il est fourni.

```tsx
import React, { useMemo, useState } from 'react';
import { Invoice, Client, StoreSettings } from '../types';
import { InvoiceForm } from './InvoiceForm';
import { InvoiceDocument } from './InvoiceDocument';
import { formatMad } from '../services/billing';
import { FilePlus, Printer, Trash2, Pencil, ArrowRightLeft } from 'lucide-react';

// ...interface (voir Interfaces)...

export const AdminInvoices: React.FC<AdminInvoicesProps> = (props) => {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'devis' | 'facture'>('all');
  const [editing, setEditing] = useState<Invoice | null>(null);
  const [creating, setCreating] = useState<null | 'devis' | 'facture'>(null);
  const [printing, setPrinting] = useState<Invoice | null>(null);
  const clientName = (id: string) => props.clients.find((c) => c.id === id)?.fullName ?? '—';

  const rows = useMemo(() => props.invoices.filter((i) => {
    if (typeFilter !== 'all' && i.docType !== typeFilter) return false;
    if (props.initialClientFilter && i.clientId !== props.initialClientFilter) return false;
    const hay = `${i.number} ${clientName(i.clientId)}`.toLowerCase();
    return hay.includes(query.toLowerCase());
  }), [props.invoices, typeFilter, query, props.initialClientFilter]);

  const caFacture = props.invoices.filter((i) => i.docType === 'facture' && i.status !== 'annulee')
    .reduce((s, i) => s + i.totalTtc, 0);
  const impaye = props.invoices.filter((i) => i.docType === 'facture' && i.status === 'impayee')
    .reduce((s, i) => s + i.totalTtc, 0);

  // rendu: toolbar, bandeau totaux (formatMad(caFacture), formatMad(impaye)), tableau, modales form/print
  return (/* ...JSX... */);
};
```

- [ ] **Step 2: Câbler dans App.tsx**

Remplacer le placeholder `billing` :

```tsx
{adminActiveTab === 'billing' && (
  <AdminInvoices
    invoices={invoices}
    clients={clients}
    settings={settings}
    initialClientFilter={billingClientFilter}
    onSaveInvoice={handleSaveInvoice}
    onDeleteInvoice={handleDeleteInvoice}
    onConvertDevisToFacture={handleConvertDevisToFacture}
  />
)}
```

Ajouter l'import `AdminInvoices`. Réinitialiser `billingClientFilter` à `null` quand on quitte l'onglet (dans `onSelectTab`, si `tab !== 'billing'`).

- [ ] **Step 3: Vérifier**

Run: `npm run lint && npm run build`
Expected: PASS. Smoke complet : créer devis → convertir en facture (`FAC-2026-000X`, statut impayée, `sourceDevisId` renseigné) → imprimer.

- [ ] **Step 4: Commit**

```bash
git add src/admin/AdminInvoices.tsx src/App.tsx
git commit -m "feat: onglet Facturation (registre, filtres, conversion, impression)"
```

---

## Task 12: Mentions légales dans AdminSettings

**Files:**
- Modify: `src/admin/AdminSettings.tsx`

**Interfaces:**
- Consumes : `StoreSettings.legal` (Task 1/3).
- Produces : édition de `form.legal.{ice,if,rc,patente,capital}`.

- [ ] **Step 1: Ajouter une section « Mentions légales (facture) »**

Dans le formulaire, après la section SEO, ajouter un bloc avec 5 inputs liés à `form.legal` :

```tsx
<div className="bg-[#1B1A15] border border-white/5 p-6 space-y-4">
  <h2 className="font-serif-luxury text-lg text-[#F5E6A6]">Mentions légales (facture)</h2>
  {(['ice','if','rc','patente','capital'] as const).map((k) => (
    <div key={k}>
      <label className="block text-[#9F9A8E] uppercase mb-1 font-semibold">{k.toUpperCase()}</label>
      <input
        type="text"
        value={form.legal?.[k] ?? ''}
        onChange={(e) => setForm((p) => ({ ...p, legal: { ...(p.legal ?? {}), [k]: e.target.value } }))}
        className="w-full bg-[#11110F] border border-white/10 text-white p-2.5"
      />
    </div>
  ))}
</div>
```

- [ ] **Step 2: Vérifier**

Run: `npm run lint && npm run build`
Expected: PASS. Smoke : saisir ICE/IF, enregistrer, rouvrir → valeurs persistées ; apparaissent sur le document facture.

- [ ] **Step 3: Commit**

```bash
git add src/admin/AdminSettings.tsx
git commit -m "feat: mentions légales (ICE/IF/RC/Patente) dans Paramètres"
```

---

## Task 13: Seed démo + build final + push

**Files:**
- Modify: `scripts/seed-supabase.ts`

**Interfaces:**
- Consumes : `DEFAULT_CLIENTS/PRESCRIPTIONS/INVOICES` (Task 4) ; `upsert` (existant dans le script).

- [ ] **Step 1: Ajouter les upserts de démo**

Dans `scripts/seed-supabase.ts`, après les seeds existants, ajouter (en mappant camelCase → snake_case comme les autres) :

```typescript
await upsert('clients', DEFAULT_CLIENTS.map((c) => ({
  id: c.id, client_code: c.clientCode, full_name: c.fullName, phone: c.phone, email: c.email,
  address: c.address, city: c.city, birth_date: c.birthDate, notes: c.notes,
})));
await upsert('prescriptions', DEFAULT_PRESCRIPTIONS.map((p) => ({
  id: p.id, client_id: p.clientId, prescription_date: p.prescriptionDate, prescriber: p.prescriber,
  od_sphere: p.right.sphere, od_cylinder: p.right.cylinder, od_axis: p.right.axis, od_addition: p.right.addition,
  og_sphere: p.left.sphere, og_cylinder: p.left.cylinder, og_axis: p.left.axis, og_addition: p.left.addition,
  pd: p.pd, pd_right: p.pdRight, pd_left: p.pdLeft, notes: p.notes,
})));
await upsert('invoices', DEFAULT_INVOICES.map((i) => ({
  id: i.id, client_id: i.clientId, doc_type: i.docType, number: i.number, doc_date: i.docDate,
  status: i.status, items: i.items, total_ht: i.totalHt, tva_rate: i.tvaRate,
  tva_amount: i.tvaAmount, total_ttc: i.totalTtc, notes: i.notes, source_devis_id: i.sourceDevisId,
})));
```

Ajouter les imports `DEFAULT_CLIENTS, DEFAULT_PRESCRIPTIONS, DEFAULT_INVOICES` depuis `../src/services/storage`.

- [ ] **Step 2: Build final complet**

Run: `npm run lint && npm run build`
Expected: PASS.

- [ ] **Step 3: Smoke Playwright (optionnel mais recommandé)**

Via Playwright MCP : lancer `npm run dev`, se connecter à l'admin, parcourir Clients (création + ordonnance) et Facturation (devis → facture → impression). Corriger tout écart.

- [ ] **Step 4: Commit + push**

```bash
git add scripts/seed-supabase.ts
git commit -m "feat: seed démo clients/ordonnances/factures"
git push origin main
```

---

## Self-Review (effectué)

- **Couverture spec** : clients (T7), code auto CLI (T1/T5), ordonnances VL/VP (T1/T8), devis+factures TVA20 (T1/T9), conversion (T5/T11), impression/PDF (T10), registre global (T11), 2 onglets (T6), RLS admin-only (T2), fallback localStorage (T4), mentions légales (T1/T2/T3/T12), seed (T13). ✔
- **Placeholders** : les blocs `/* ...JSX... */` sont des zones de rendu à remplir en suivant le style admin décrit ; toutes les interfaces, signatures, types et la logique métier sont fournis explicitement. Les commentaires `storage.setX(/* updated */)` renvoient au pattern exact relevé en Task 4.
- **Cohérence des types** : `handleSaveInvoice` renvoie `Invoice` ; `onConvertDevisToFacture` réutilise `handleSaveInvoice` ; noms de props alignés entre App.tsx et composants.
- **Review Focus** : champs vides (T1/T8), facture sans lignes (T1/T9), numérotation changement d'année (T1), suppression client avec factures (T5), hors-ligne (T4). ✔
