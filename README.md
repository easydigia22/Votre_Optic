# Votre Optique

Site vitrine et catalogue digital de Votre Optique Maroc, avec administration Supabase, espace professionnel et installation en application web progressive (PWA).

## Fonctionnalités

- Catalogue de lunettes avec catégories, marques, promotions et favoris
- Fiches produits, avis clients et contact WhatsApp
- Espace professionnel avec inscription et connexion Supabase
- Administration sécurisée des produits, stocks, contenus et messages
- Installation sur mobile ou ordinateur grâce au manifeste PWA
- Données distantes Supabase avec cache local de secours

## Prérequis

- Node.js 20 ou version ultérieure
- Un projet Supabase configuré avec la migration du dossier `supabase/migrations`

## Installation locale

```bash
npm install
copy .env.example .env
npm run dev
```

L'application est ensuite disponible sur `http://localhost:3000`.

## Variables d'environnement

Renseigner dans `.env` :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anonyme
```

Ne jamais exposer la clé `service_role` dans cette application cliente.

## Base de données

1. Exécuter `supabase/migrations/202609220001_create_votre_optic_schema.sql` dans Supabase.
2. Créer le premier utilisateur administrateur dans Supabase Auth.
3. Ajouter son identifiant dans la table `admin_profiles`.
4. Importer les données initiales avec `npm run seed:supabase` si nécessaire.

Les visiteurs peuvent créer leur propre compte depuis `/?view=professional`. Les droits administrateur restent contrôlés séparément par `admin_profiles` et les politiques RLS.

## Commandes

```bash
npm run dev          # serveur de développement
npm run lint         # vérification TypeScript
npm run build        # build de production
npm run preview      # prévisualisation du build
npm run seed:supabase
```

## Déploiement

Déployer le contenu produit par `npm run build` et configurer l'hébergeur pour renvoyer les routes de l'application vers `index.html`. Le service worker est enregistré uniquement en production.
