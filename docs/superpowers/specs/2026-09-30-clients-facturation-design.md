# Espace Clients & Facturation — Design

- **Date** : 2026-09-30
- **Projet** : Votre Optique (app opticien, React + Vite + Supabase)
- **Statut** : Spec en attente de validation

## 1. Objectif & contexte

Ajouter à l'espace admin un module métier opticien pour gérer :

1. **Clients** de la boutique physique (fichier indépendant des avis/messages du site).
2. **Ordonnances** (correction visuelle VL/VP) rattachées à un client.
3. **Devis & Factures** (proforma convertible en facture, TVA 20% Maroc, impression/PDF).

Les trois entités sont **reliées** : une fiche client regroupe ses ordonnances et ses documents de facturation.

### Succès = 
- L'opticien crée une fiche client, y ajoute une ordonnance structurée, génère un devis puis une facture imprimable, le tout persisté dans Supabase et accessible hors-ligne (fallback localStorage comme le reste de l'app).

## 2. Décisions validées

| Sujet | Décision |
|---|---|
| Modules v1 | Les 3 (Clients + Ordonnances + Devis/Factures), reliés |
| Ordonnances | Standard opticien : OD/OG · Sphère/Cylindre/Axe/Addition · VL & VP · écart pupillaire · prescripteur |
| Facturation | Devis + Factures ; proforma convertible ; TVA 20% ; impression/PDF |
| Source clients | Nouveau fichier boutique, indépendant du site en ligne |
| Onglets sidebar | **Deux** : « Clients » (hub) + « Facturation » (registre global) |
| Code client | Automatique : `CLI-2026-0001` |

## 3. Périmètre

### Inclus (v1)
- CRUD clients avec code auto `CLI-YYYY-NNNN`.
- CRUD ordonnances liées au client, avec calcul VP auto (= Sphère + Addition).
- CRUD devis/factures liés au client, numérotation auto `DEV-YYYY-NNNN` / `FAC-YYYY-NNNN`.
- Conversion devis → facture.
- Document imprimable (aperçu + impression navigateur → PDF), sans nouvelle dépendance.
- Registre global Facturation : recherche, filtre par type/statut, totaux (CA facturé, impayés).
- Persistance Supabase (admin-only, RLS `is_admin()`) + fallback localStorage.

### Hors périmètre (v2+)
- Paiement en ligne ; envoi email automatique des documents.
- Décrément automatique du stock produit à la facturation.
- Multi-devise (MAD uniquement en v1).
- Import/export CSV du fichier clients.

## 4. Modèle de données (3 tables Supabase)

Toutes les tables : `id uuid pk default gen_random_uuid()`, `created_at`, `updated_at` (trigger `set_updated_at`), RLS activé, politiques **admin-only** via `public.is_admin()`, `grant all ... to authenticated`. Aucun accès `anon` (données personnelles).

### 4.1 `public.clients`
| Colonne | Type | Notes |
|---|---|---|
| id | uuid pk | |
| client_code | text unique not null | `CLI-YYYY-NNNN`, calculé au 1er enregistrement |
| full_name | text not null | |
| phone | text not null default '' | |
| email | text not null default '' | |
| address | text not null default '' | |
| city | text not null default '' | |
| birth_date | date null | |
| notes | text not null default '' | |
| created_at / updated_at | timestamptz | |

Index : `clients_code_idx (client_code)`, `clients_name_idx (full_name)`.

### 4.2 `public.prescriptions`
| Colonne | Type | Notes |
|---|---|---|
| id | uuid pk | |
| client_id | uuid not null → clients(id) on delete cascade | |
| prescription_date | date not null | |
| prescriber | text not null default '' | ophtalmologue / prescripteur |
| od_sphere / od_cylinder / od_axis / od_addition | numeric(5,2) null | œil droit (VL + addition) |
| og_sphere / og_cylinder / og_axis / og_addition | numeric(5,2) null | œil gauche |
| pd | numeric(4,1) null | écart pupillaire total (mm) |
| pd_right / pd_left | numeric(4,1) null | écarts monoculaires optionnels |
| notes | text not null default '' | |
| created_at / updated_at | timestamptz | |

- **Axe** : entier 0–180 (validé côté UI ; stocké numeric).
- **VP (vision de près)** non stockée : calculée à l'affichage = `sphere + addition` par œil.

Index : `prescriptions_client_idx (client_id, prescription_date desc)`.

### 4.3 `public.invoices` (devis ET factures)
| Colonne | Type | Notes |
|---|---|---|
| id | uuid pk | |
| client_id | uuid not null → clients(id) on delete restrict | |
| doc_type | text not null check in ('devis','facture') | |
| number | text not null unique | `DEV-YYYY-NNNN` ou `FAC-YYYY-NNNN` |
| doc_date | date not null | |
| status | text not null | devis: `brouillon`/`accepte`/`refuse` ; facture: `impayee`/`payee`/`annulee` (validé UI selon type) |
| items | jsonb not null default '[]' | `[{ label, qty, unit_price_ht }]` |
| total_ht | numeric(12,2) not null default 0 | |
| tva_rate | numeric(5,2) not null default 20 | |
| tva_amount | numeric(12,2) not null default 0 | |
| total_ttc | numeric(12,2) not null default 0 | |
| notes | text not null default '' | |
| source_devis_id | uuid null → invoices(id) on delete set null | facture issue d'un devis |
| created_at / updated_at | timestamptz | |

Index : `invoices_client_idx (client_id, doc_date desc)`, `invoices_type_status_idx (doc_type, status)`.

**Totaux** : calculés côté application avant enregistrement (source de vérité = `items` + `tva_rate`). `total_ht = Σ(qty·unit_price_ht)`, `tva_amount = total_ht·tva_rate/100`, `total_ttc = total_ht + tva_amount`.

### 4.4 Numérotation automatique
Calcul applicatif au moment de la création (mono-utilisateur, risque de collision négligeable) :
- Préfixe + année en cours + compteur sur 4 chiffres.
- Compteur = `max(NNNN parmi les documents du même préfixe et de la même année) + 1`.
- Vaut pour `client_code` (CLI), devis (DEV), facture (FAC).

## 5. Architecture applicative

Respecte le pattern existant (aucune rupture) :

### Types — `src/types/index.ts`
`Client`, `Prescription`, `Invoice`, `InvoiceItem`, plus unions `InvoiceDocType`, `InvoiceStatus`, `DevisStatus`/`FactureStatus`.

### Service Supabase — `src/services/supabase.ts`
- Mappers `clientFromRow/toRow`, `prescriptionFromRow/toRow`, `invoiceFromRow/toRow`.
- Ajout du chargement dans `loadAdminPrivateData()` (retourne clients, prescriptions, invoices).
- Écritures via `upsertAdminRow('clients'|'prescriptions'|'invoices', row)`.
- `deleteAdminRow(table, id)` (ajout d'un helper delete générique s'il n'existe pas déjà).

### Stockage local — `src/services/storage.ts`
- Clés localStorage + fallback (comme les autres entités) pour usage hors-ligne.
- `DEFAULT_CLIENTS` : 1–2 clients de démo + 1 ordonnance + 1 devis, pour un premier rendu non vide.
- Helpers de numérotation `nextClientCode`, `nextInvoiceNumber(type)`.

### Seed — `scripts/seed-supabase.ts`
- Upsert des données de démo clients/prescriptions/invoices (optionnel, aligné sur les autres seeds).

### État & câblage — `src/App.tsx`
- State : `clients`, `prescriptions`, `invoices` (chargés avec les données admin privées).
- Handlers : `handleSaveClient`, `handleDeleteClient`, `handleSavePrescription`, `handleDeletePrescription`, `handleSaveInvoice`, `handleDeleteInvoice`, `handleConvertDevisToFacture`.
- Rendu conditionnel des onglets `clients` et `billing`.
- Badge sidebar : nombre de factures impayées (optionnel).

### Navigation — `src/admin/AdminLayout.tsx`
- 2 entrées `navItems` : `{ id: 'clients', label: 'Clients', icon: Users }` et `{ id: 'billing', label: 'Facturation', icon: Receipt }` (icônes lucide-react).

## 6. Composants (nouveaux, sous `src/admin/`)

| Composant | Rôle |
|---|---|
| `AdminClients.tsx` | Onglet Clients : recherche + liste ; sélection → panneau fiche client |
| `ClientForm.tsx` | Création/édition coordonnées client |
| `PrescriptionForm.tsx` | Saisie ordonnance OD/OG (VL) + addition, PD, prescripteur ; affiche VP calculée |
| `AdminInvoices.tsx` | Onglet Facturation : registre global, filtres, totaux |
| `InvoiceForm.tsx` | Création/édition devis/facture (lignes, TVA, statut, conversion) |
| `InvoiceDocument.tsx` | Aperçu imprimable + bouton Imprimer/PDF (window.print + CSS `@media print`) |

Chaque composant suit le style admin existant (palette `#11110F`/`#C6A53A`, classes Tailwind, `brand-light`). Fiche client organisée en sous-sections : Coordonnées · Ordonnances · Devis & Factures.

## 7. Impression / PDF

- `InvoiceDocument` rend un document A4 : logo + nom boutique + adresse (depuis `settings`, donc Marrakech) + coordonnées client + tableau des lignes + récap HT/TVA/TTC + mentions.
- Bouton « Imprimer / Enregistrer PDF » → `window.print()`.
- CSS `@media print` : masque l'app (`.no-print`), n'affiche que `.print-document`. Aucune dépendance ajoutée.

## 8. Sécurité & conformité

- Tables admin-only (RLS `is_admin()`), aucun accès `anon` — cohérent avec la nature personnelle des données (santé visuelle = donnée sensible).
- Données hébergées Supabase (déjà en place). Note CNDP/RGPD : information minimale à conserver ; pas d'exposition publique.
- Suppression client en cascade sur ordonnances ; `restrict` sur factures (on ne supprime pas un client ayant des factures — on lève un message).

## 9. Migration SQL

Nouveau fichier `supabase/migrations/20260930XXXX_create_clients_billing.sql` :
- `create table` clients, prescriptions, invoices (section 4).
- Index (section 4).
- Triggers `set_updated_at` sur les 3 tables.
- `enable row level security` + politiques `Admins manage ...` (`using/with check is_admin()`).
- `grant all on ... to authenticated`.
- Enveloppé dans `begin; ... commit;`.
- Application : via Supabase MCP `apply_migration` ou collage manuel dans l'éditeur SQL Supabase.

## 10. Stratégie de test

- Pas de framework de test dans le repo → validation par :
  1. `npm run lint` (tsc --noEmit) sans erreur.
  2. `npm run build` OK.
  3. Test manuel / Playwright MCP : login admin → créer client → ordonnance → devis → conversion facture → impression.
- Option : introduire un test léger de la logique pure de numérotation et de calcul TVA (fonctions extraites, testables) si un runner est ajouté ultérieurement.

## 11. Risques / points d'attention

- **Numérotation concurrente** : acceptable en mono-utilisateur ; à durcir (séquence SQL) si multi-postes plus tard.
- **Application de la migration** : dépend de l'accès Supabase (le classifieur de sécurité a connu des coupures ; sinon collage SQL manuel).
- **Données déjà en base** : nouvelles tables uniquement, aucun impact sur l'existant.
- **Volume App.tsx** : déjà grand ; garder les nouveaux handlers groupés et déléguer la logique aux composants/services pour limiter la croissance.
