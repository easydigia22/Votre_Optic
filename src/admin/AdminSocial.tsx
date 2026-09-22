import React, { useState } from 'react';
import { StoreSettings } from '../types';
import { Instagram, Facebook, MessageCircle, Video, CheckCircle2, Save } from 'lucide-react';

interface AdminSocialProps {
  settings: StoreSettings;
  onUpdateSettings: (newSettings: StoreSettings) => void;
}

export const AdminSocial: React.FC<AdminSocialProps> = ({ settings, onUpdateSettings }) => {
  const [social, setSocial] = useState(settings.socialLinks);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      socialLinks: social,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="border-b border-white/10 pb-4">
        <span className="text-xs font-mono uppercase tracking-widest text-[#D6AE62]">
          Visibilité & Réseaux Sociaux
        </span>
        <h1 className="font-serif-luxury text-2xl sm:text-3xl text-white font-medium mt-1">
          Réseaux Sociaux & Communauté
        </h1>
        <p className="text-xs text-[#A6A6A6]">
          Configurez les liens directs vers vos profils officiels affichés dans l'en-tête, le pied de page et la page contact
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-950/50 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Liens de réseaux sociaux mis à jour avec succès !</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#151515] border border-white/5 p-6 sm:p-8 space-y-5 text-xs">
        {/* Instagram */}
        <div>
          <label className="flex items-center gap-2 text-[#A6A6A6] uppercase tracking-wider mb-1.5 font-semibold">
            <Instagram className="w-4 h-4 text-[#D6AE62]" />
            <span>Profil Instagram</span>
          </label>
          <input
            type="url"
            value={social.instagram || ''}
            onChange={(e) => setSocial((p) => ({ ...p, instagram: e.target.value }))}
            placeholder="https://instagram.com/votreoptique_maroc"
            className="w-full bg-[#0B0B0B] border border-white/10 text-white p-2.5 outline-none focus:border-[#D6AE62]"
          />
        </div>

        {/* Facebook */}
        <div>
          <label className="flex items-center gap-2 text-[#A6A6A6] uppercase tracking-wider mb-1.5 font-semibold">
            <Facebook className="w-4 h-4 text-[#D6AE62]" />
            <span>Page Facebook</span>
          </label>
          <input
            type="url"
            value={social.facebook || ''}
            onChange={(e) => setSocial((p) => ({ ...p, facebook: e.target.value }))}
            placeholder="https://facebook.com/votreoptiquemaroc"
            className="w-full bg-[#0B0B0B] border border-white/10 text-white p-2.5 outline-none focus:border-[#D6AE62]"
          />
        </div>

        {/* TikTok */}
        <div>
          <label className="flex items-center gap-2 text-[#A6A6A6] uppercase tracking-wider mb-1.5 font-semibold">
            <Video className="w-4 h-4 text-[#D6AE62]" />
            <span>Compte TikTok</span>
          </label>
          <input
            type="url"
            value={social.tiktok || ''}
            onChange={(e) => setSocial((p) => ({ ...p, tiktok: e.target.value }))}
            placeholder="https://tiktok.com/@votreoptique.ma"
            className="w-full bg-[#0B0B0B] border border-white/10 text-white p-2.5 outline-none focus:border-[#D6AE62]"
          />
        </div>

        {/* WhatsApp Link */}
        <div>
          <label className="flex items-center gap-2 text-[#A6A6A6] uppercase tracking-wider mb-1.5 font-semibold">
            <MessageCircle className="w-4 h-4 text-[#D6AE62]" />
            <span>Lien WhatsApp Direct</span>
          </label>
          <input
            type="url"
            value={social.whatsapp || ''}
            onChange={(e) => setSocial((p) => ({ ...p, whatsapp: e.target.value }))}
            placeholder="https://wa.me/212770420663"
            className="w-full bg-[#0B0B0B] border border-white/10 text-white p-2.5 outline-none focus:border-[#D6AE62]"
          />
        </div>

        <div className="pt-4 border-t border-white/5 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#D6AE62] hover:bg-[#E8C987] text-[#0B0B0B] font-bold text-xs uppercase tracking-wider flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer les liens</span>
          </button>
        </div>
      </form>
    </div>
  );
};
