import React, { useState } from 'react';
import { Promotion, Category } from '../types';
import { Plus, Edit2, Trash2, X, Tag, Calendar } from 'lucide-react';

interface AdminPromotionsProps {
  promotions: Promotion[];
  categories: Category[];
  onSavePromotion: (promo: Promotion) => void;
  onDeletePromotion: (id: string) => void;
}

export const AdminPromotions: React.FC<AdminPromotionsProps> = ({
  promotions,
  categories,
  onSavePromotion,
  onDeletePromotion,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    code: '',
    bannerUrl: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'Profiter de l’offre sur WhatsApp',
    ctaLink: 'https://wa.me/212770420663?text=Bonjour,%20je%20souhaite%20profiter%20de%20la%20promotion.',
    discountPercentage: 20,
    targetCategoryId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString().split('T')[0],
    isActive: true,
  });

  const openNewModal = () => {
    setEditingPromo(null);
    setForm({
      title: '',
      description: '',
      code: 'SOLAIRE-' + Math.floor(100 + Math.random() * 900),
      bannerUrl: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1200&q=80',
      ctaText: 'Commander sur WhatsApp',
      ctaLink: 'https://wa.me/212770420663',
      discountPercentage: 20,
      targetCategoryId: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString().split('T')[0],
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (p: Promotion) => {
    setEditingPromo(p);
    setForm({
      title: p.title,
      description: p.description,
      code: p.code || '',
      bannerUrl: p.bannerUrl,
      ctaText: p.ctaText,
      ctaLink: p.ctaLink,
      discountPercentage: p.discountPercentage,
      targetCategoryId: p.targetCategoryId || '',
      startDate: p.startDate.split('T')[0],
      endDate: p.endDate.split('T')[0],
      isActive: p.isActive,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;

    onSavePromotion({
      id: editingPromo ? editingPromo.id : 'promo-' + Date.now(),
      title: form.title,
      description: form.description,
      code: form.code,
      bannerUrl: form.bannerUrl,
      ctaText: form.ctaText,
      ctaLink: form.ctaLink,
      discountPercentage: Number(form.discountPercentage) || 0,
      targetCategoryId: form.targetCategoryId || undefined,
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate + 'T23:59:59').toISOString(),
      isActive: form.isActive,
      createdAt: editingPromo?.createdAt || new Date().toISOString(),
    });

    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#C6A53A]">
            Campagnes & Privilèges
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl text-white font-medium mt-1">
            Gestion des Promotions
          </h1>
          <p className="text-xs text-[#9F9A8E]">
            Créez des offres commerciales, réductions sur montures solaires ou packs 2ème paire
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-4 py-2.5 bg-[#C6A53A] hover:bg-[#E3C866] text-[#11110F] font-bold text-xs uppercase tracking-wider flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nouvelle Promotion</span>
        </button>
      </div>

      <div className="space-y-4">
        {promotions.map((p) => {
          const isExpired = new Date(p.endDate).getTime() < Date.now();
          return (
            <div
              key={p.id}
              className="bg-[#1B1A15] border border-white/5 p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-16 bg-[#11110F] border border-white/10 shrink-0 overflow-hidden">
                  <img
                    src={p.bannerUrl}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-serif-luxury text-lg text-white font-medium">{p.title}</h3>
                    {p.code && (
                      <span className="font-mono text-[10px] text-[#C6A53A] bg-[#11110F] px-1.5 py-0.2 border border-[#C6A53A]/30">
                        Code: {p.code}
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.2 ${
                        p.isActive && !isExpired
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {isExpired ? 'Expirée' : p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <p className="text-xs text-[#9F9A8E] line-clamp-1 max-w-xl">{p.description}</p>
                  <p className="text-[11px] text-[#C6A53A] mt-1">
                    Remise : -{p.discountPercentage}% · Validité jusqu'au{' '}
                    {new Date(p.endDate).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  onClick={() => openEditModal(p)}
                  className="p-2 text-[#9F9A8E] hover:text-[#C6A53A]"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Supprimer l'offre "${p.title}" ?`)) {
                      onDeletePromotion(p.id);
                    }
                  }}
                  className="p-2 text-[#9F9A8E] hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-[#1B1A15] border border-[#C6A53A]/40 p-6 shadow-2xl relative my-6">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-[#9F9A8E] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif-luxury text-xl text-white mb-4">
              {editingPromo ? 'Modifier la promotion' : 'Créer une offre commerciale'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#9F9A8E] uppercase mb-1 font-semibold">Titre *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Ex: -25% sur les Lunettes Solaires Créateurs"
                  className="w-full bg-[#11110F] border border-white/10 text-white p-2.5 outline-none focus:border-[#C6A53A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#9F9A8E] uppercase mb-1 font-semibold">
                    Code promo
                  </label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
                    placeholder="Ex: SOLAIRE2026"
                    className="w-full bg-[#11110F] border border-white/10 text-white p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#9F9A8E] uppercase mb-1 font-semibold">
                    Pourcentage remise (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.discountPercentage}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, discountPercentage: Number(e.target.value) }))
                    }
                    className="w-full bg-[#11110F] border border-white/10 text-white p-2.5 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#9F9A8E] uppercase mb-1 font-semibold">
                  Bannière visuelle (URL)
                </label>
                <input
                  type="url"
                  required
                  value={form.bannerUrl}
                  onChange={(e) => setForm((p) => ({ ...p, bannerUrl: e.target.value }))}
                  className="w-full bg-[#11110F] border border-white/10 text-white p-2.5"
                />
              </div>

              <div>
                <label className="block text-[#9F9A8E] uppercase mb-1 font-semibold">
                  Description de l'offre
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full bg-[#11110F] border border-white/10 text-white p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#9F9A8E] uppercase mb-1 font-semibold">
                    Date début
                  </label>
                  <input
                    type="date"
                    required
                    value={form.startDate}
                    onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                    className="w-full bg-[#11110F] border border-white/10 text-white p-2"
                  />
                </div>

                <div>
                  <label className="block text-[#9F9A8E] uppercase mb-1 font-semibold">
                    Date fin
                  </label>
                  <input
                    type="date"
                    required
                    value={form.endDate}
                    onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                    className="w-full bg-[#11110F] border border-white/10 text-white p-2"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                    className="accent-[#C6A53A]"
                  />
                  <span>Promotion active</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-white/10 text-[#9F9A8E]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#C6A53A] hover:bg-[#E3C866] text-[#11110F] font-bold uppercase"
                >
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
