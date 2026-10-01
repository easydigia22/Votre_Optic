-- Votre Optic — Configuration du stockage des photos produit
-- À exécuter UNE FOIS dans Supabase : SQL Editor → coller → Run.
-- Crée un bucket public "product-images" et autorise l'admin connecté à y téléverser.

-- 1) Bucket public pour les photos de produits
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

-- 2) L'admin connecté (authenticated) peut téléverser / gérer les fichiers du bucket.
--    La lecture est publique automatiquement (bucket public).
drop policy if exists "Admin manage product images" on storage.objects;
create policy "Admin manage product images"
on storage.objects for all to authenticated
using (bucket_id = 'product-images')
with check (bucket_id = 'product-images');
