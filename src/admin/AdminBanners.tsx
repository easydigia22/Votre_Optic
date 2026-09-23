import React, { useState } from 'react';
import { Banner } from '../types';
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';

interface AdminBannersProps {
  banners: Banner[];
  onSaveBanner: (banner: Banner) => void;
  onDeleteBanner: (id: string) => void;
}

export const AdminBanners: React.FC<AdminBannersProps> = ({
  banners,
  onSaveBanner,
  onDeleteBanner,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    image: '',
    buttonText: 'Découvrir nos lunettes',
    buttonLink: '/catalogue',
    position: 'hero' as Banner['position'],
    isActive: true,
  });

  const openNewModal = () => {
    setEditingBanner(null);
    setForm({
      title: 'Votre optique, votre Élégance entre nos mains',
      subtitle: 'Des montures sélectionnées pour sublimer votre regard.',
      image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1600&q=85',
      buttonText: 'Découvrir nos lunettes',
      buttonLink: '/catalogue',
      position: 'hero',
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (b: Banner) => {
    setEditingBanner(b);
    setForm({
      title: b.title,
      subtitle: b.subtitle || '',
      image: b.image,
      buttonText: b.buttonText || '',
      buttonLink: b.buttonLink || '',
      position: b.position,
      isActive: b.isActive,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;

    onSaveBanner({
      id: editingBanner ? editingBanner.id : 'banner-' + Date.now(),
      title: form.title,
      subtitle: form.subtitle,
      image: form.image,
      buttonText: form.buttonText,
      buttonLink: form.buttonLink,
      position: form.position,
      isActive: form.isActive,
    });

    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#C6A53A]">
            Communication Visuelle
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl text-white font-medium mt-1">
            Gestion des Bannières & Publicités
          </h1>
          <p className="text-xs text-[#9F9A8E]">
            Configurez le grand bandeau d'accueil Hero, bannières collection et campagnes saisonnières
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-4 py-2.5 bg-[#C6A53A] hover:bg-[#E3C866] text-[#11110F] font-bold text-xs uppercase tracking-wider flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nouvelle Bannière</span>
        </button>
      </div>

      <div className="space-y-6">
        {banners.map((b) => (
          <div
            key={b.id}
            className="bg-[#1B1A15] border border-white/5 overflow-hidden flex flex-col md:flex-row justify-between"
          >
            <div className="relative w-full md:w-72 h-44 bg-[#11110F] shrink-0">
              <img src={b.image} alt={b.title} className="w-full h-full object-cover filter brightness-85" />
              <div className="absolute top-3 left-3 bg-[#11110F]/80 text-[#C6A53A] text-[10px] font-mono px-2 py-0.5 border border-[#C6A53A]/30 uppercase">
                {b.position}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-serif-luxury text-xl text-white font-medium">{b.title}</h3>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 ${
                      b.isActive
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {b.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-xs text-[#9F9A8E]">{b.subtitle}</p>
                <div className="mt-3 flex items-center gap-3 text-[11px] text-[#C6A53A]">
                  <span>Bouton : <strong>{b.buttonText}</strong></span>
                  <span>→ {b.buttonLink}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 mt-4 flex justify-end gap-2">
                <button onClick={() => openEditModal(b)} className="p-1.5 text-[#9F9A8E] hover:text-[#C6A53A]">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Supprimer cette bannière ?`)) {
                      onDeleteBanner(b.id);
                    }
                  }}
                  className="p-1.5 text-[#9F9A8E] hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-[#1B1A15] border border-[#C6A53A]/40 p-6 shadow-2xl relative my-6">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-[#9F9A8E] hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif-luxury text-xl text-white mb-4">
              {editingBanner ? 'Modifier la bannière' : 'Nouvelle bannière'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#9F9A8E] uppercase mb-1 font-semibold">Titre Principal *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full bg-[#11110F] border border-white/10 text-white p-2.5 outline-none focus:border-[#C6A53A]"
                />
              </div>

              <div>
                <label className="block text-[#9F9A8E] uppercase mb-1 font-semibold">Sous-titre</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
                  className="w-full bg-[#11110F] border border-white/10 text-white p-2.5"
                />
              </div>

              <div>
                <label className="block text-[#9F9A8E] uppercase mb-1 font-semibold">Image URL *</label>
                <input
                  type="url"
                  required
                  value={form.image}
                  onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                  className="w-full bg-[#11110F] border border-white/10 text-white p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#9F9A8E] uppercase mb-1 font-semibold">Texte Bouton</label>
                  <input
                    type="text"
                    value={form.buttonText}
                    onChange={(e) => setForm((p) => ({ ...p, buttonText: e.target.value }))}
                    className="w-full bg-[#11110F] border border-white/10 text-white p-2"
                  />
                </div>

                <div>
                  <label className="block text-[#9F9A8E] uppercase mb-1 font-semibold">Position</label>
                  <select
                    value={form.position}
                    onChange={(e) => setForm((p) => ({ ...p, position: e.target.value as Banner['position'] }))}
                    className="w-full bg-[#11110F] border border-white/10 text-white p-2"
                  >
                    <option value="hero">Hero (Accueil grand écran)</option>
                    <option value="collection">Nouvelle Collection</option>
                    <option value="promo">Bandeau Promotion</option>
                    <option value="saison">Offre Saisonnière</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                    className="accent-[#C6A53A]"
                  />
                  <span>Bannière active et visible</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border border-white/10 text-[#9F9A8E]">
                  Annuler
                </button>
                <button type="submit" className="px-6 py-2 bg-[#C6A53A] hover:bg-[#E3C866] text-[#11110F] font-bold uppercase">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
