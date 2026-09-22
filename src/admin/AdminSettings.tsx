import React, { useState } from 'react';
import { StoreSettings } from '../types';
import { storage } from '../services/storage';
import { Save, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';

interface AdminSettingsProps {
  settings: StoreSettings;
  onUpdateSettings: (newSettings: StoreSettings) => void;
  onResetAllData: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  settings,
  onUpdateSettings,
  onResetAllData,
}) => {
  const [form, setForm] = useState<StoreSettings>({ ...settings });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="border-b border-white/10 pb-4">
        <span className="text-xs font-mono uppercase tracking-widest text-[#D6AE62]">
          Configuration Générale
        </span>
        <h1 className="font-serif-luxury text-2xl sm:text-3xl text-white font-medium mt-1">
          Paramètres du Magasin & SEO
        </h1>
        <p className="text-xs text-[#A6A6A6]">
          Gérez l'identité de l'établissement, les coordonnées de contact à Casablanca et le référencement naturel
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-950/50 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Paramètres enregistrés avec succès !</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Identity & Slogan */}
        <div className="bg-[#151515] border border-white/5 p-6 space-y-4">
          <h2 className="font-serif-luxury text-lg text-[#F0D8A5]">
            Identité & Accroche de Référence
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#A6A6A6] uppercase mb-1 font-semibold">
                Nom de la boutique
              </label>
              <input
                type="text"
                required
                value={form.storeName}
                onChange={(e) => setForm((p) => ({ ...p, storeName: e.target.value }))}
                className="w-full bg-[#0B0B0B] border border-white/10 text-white p-2.5 outline-none focus:border-[#D6AE62]"
              />
            </div>

            <div>
              <label className="block text-[#A6A6A6] uppercase mb-1 font-semibold">
                Slogan Officiel
              </label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm((p) => ({ ...p, tagline: e.target.value }))}
                className="w-full bg-[#0B0B0B] border border-white/10 text-white p-2.5 outline-none focus:border-[#D6AE62]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#A6A6A6] uppercase mb-1 font-semibold">
              Sous-titre d'Élégance
            </label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
              className="w-full bg-[#0B0B0B] border border-white/10 text-white p-2.5 outline-none focus:border-[#D6AE62]"
            />
          </div>
        </div>

        {/* Contact & Location */}
        <div className="bg-[#151515] border border-white/5 p-6 space-y-4">
          <h2 className="font-serif-luxury text-lg text-[#F0D8A5]">
            Coordonnées Casablanca & WhatsApp
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#A6A6A6] uppercase mb-1 font-semibold">
                Téléphone Boutique
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                className="w-full bg-[#0B0B0B] border border-white/10 text-white p-2.5 font-mono"
              />
            </div>

            <div>
              <label className="block text-[#A6A6A6] uppercase mb-1 font-semibold">
                Numéro WhatsApp Officiel
              </label>
              <input
                type="text"
                value={form.whatsapp}
                onChange={(e) => setForm((p) => ({ ...p, whatsapp: e.target.value }))}
                className="w-full bg-[#0B0B0B] border border-white/10 text-white p-2.5 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#A6A6A6] uppercase mb-1 font-semibold">
                Email de contact
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full bg-[#0B0B0B] border border-white/10 text-white p-2.5"
              />
            </div>

            <div>
              <label className="block text-[#A6A6A6] uppercase mb-1 font-semibold">
                Lien Google Maps
              </label>
              <input
                type="url"
                value={form.mapsUrl}
                onChange={(e) => setForm((p) => ({ ...p, mapsUrl: e.target.value }))}
                className="w-full bg-[#0B0B0B] border border-white/10 text-white p-2.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#A6A6A6] uppercase mb-1 font-semibold">
                Adresse physique
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                className="w-full bg-[#0B0B0B] border border-white/10 text-white p-2.5"
              />
            </div>

            <div>
              <label className="block text-[#A6A6A6] uppercase mb-1 font-semibold">
                Ville & Pays
              </label>
              <input
                type="text"
                value={`${form.city}, ${form.country}`}
                disabled
                className="w-full bg-[#0B0B0B] border border-white/5 text-[#A6A6A6] p-2.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#A6A6A6] uppercase mb-1 font-semibold">
              Horaires d'ouverture
            </label>
            <input
              type="text"
              value={form.hours}
              onChange={(e) => setForm((p) => ({ ...p, hours: e.target.value }))}
              className="w-full bg-[#0B0B0B] border border-white/10 text-white p-2.5"
            />
          </div>
        </div>

        {/* SEO */}
        <div className="bg-[#151515] border border-white/5 p-6 space-y-4">
          <h2 className="font-serif-luxury text-lg text-[#F0D8A5]">
            Référencement SEO & Réseaux Sociaux
          </h2>

          <div>
            <label className="block text-[#A6A6A6] uppercase mb-1 font-semibold">
              Balise Meta Title
            </label>
            <input
              type="text"
              value={form.seo.metaTitle}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  seo: { ...p.seo, metaTitle: e.target.value },
                }))
              }
              className="w-full bg-[#0B0B0B] border border-white/10 text-white p-2.5"
            />
          </div>

          <div>
            <label className="block text-[#A6A6A6] uppercase mb-1 font-semibold">
              Balise Meta Description
            </label>
            <textarea
              rows={3}
              value={form.seo.metaDescription}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  seo: { ...p.seo, metaDescription: e.target.value },
                }))
              }
              className="w-full bg-[#0B0B0B] border border-white/10 text-white p-2.5"
            />
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-[#D6AE62] hover:bg-[#E8C987] text-[#0B0B0B] font-bold text-xs uppercase tracking-widest flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer tous les paramètres</span>
          </button>
        </div>
      </form>

      {/* Danger Zone: Reset to Factory Defaults */}
      <div className="mt-12 bg-red-950/20 border border-red-900/40 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-red-400 font-semibold mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>Zone de Réinitialisation</span>
          </div>
          <p className="text-xs text-[#A6A6A6]">
            Restaure l'ensemble des données initiales de démonstration (produits, stock faible d'alerte, promotions, bannières).
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (
              confirm(
                'Êtes-vous sûr de vouloir réinitialiser toutes les données aux valeurs de démonstration ?'
              )
            ) {
              onResetAllData();
            }
          }}
          className="px-4 py-2 bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 text-xs font-semibold flex items-center gap-2 shrink-0 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Réinitialiser les données démo</span>
        </button>
      </div>
    </div>
  );
};
