import React, { useState } from 'react';
import { Brand } from '../types';
import { Plus, Edit2, Trash2, X, Star } from 'lucide-react';

interface AdminBrandsProps {
  brands: Brand[];
  onSaveBrand: (brand: Brand) => void;
  onDeleteBrand: (id: string) => void;
}

export const AdminBrands: React.FC<AdminBrandsProps> = ({
  brands,
  onSaveBrand,
  onDeleteBrand,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    country: '',
    description: '',
    isFeatured: false,
  });

  const openNewModal = () => {
    setEditingBrand(null);
    setForm({
      name: '',
      slug: '',
      country: 'Italie',
      description: '',
      isFeatured: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (b: Brand) => {
    setEditingBrand(b);
    setForm({
      name: b.name,
      slug: b.slug,
      country: b.country || '',
      description: b.description || '',
      isFeatured: !!b.isFeatured,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;

    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    onSaveBrand({
      id: editingBrand ? editingBrand.id : 'brand-' + Date.now(),
      name: form.name,
      slug,
      country: form.country,
      description: form.description,
      isFeatured: form.isFeatured,
    });
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#C6A53A]">
            Partenaires & Maisons
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl text-white font-medium mt-1">
            Gestion des Marques
          </h1>
          <p className="text-xs text-[#9F9A8E]">
            Maisons de lunetterie distribuées (Ray-Ban, Tom Ford, Cartier, Gucci, Persol...)
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-4 py-2.5 bg-[#C6A53A] hover:bg-[#E3C866] text-[#11110F] font-bold text-xs uppercase tracking-wider flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>+ Ajouter une marque</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((b) => (
          <div
            key={b.id}
            className="bg-[#1B1A15] border border-white/5 p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-serif-luxury text-2xl text-white font-semibold">{b.name}</h3>
                {b.isFeatured && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C6A53A] border border-[#C6A53A]/40 px-2 py-0.5 flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    En vedette
                  </span>
                )}
              </div>

              <p className="text-xs font-mono text-[#C6A53A] mb-2">Origine : {b.country || 'International'}</p>
              <p className="text-xs text-[#9F9A8E] leading-relaxed mb-4">{b.description}</p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-2">
              <button
                onClick={() => openEditModal(b)}
                className="p-1.5 text-[#9F9A8E] hover:text-[#C6A53A]"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Supprimer la marque "${b.name}" ?`)) {
                    onDeleteBrand(b.id);
                  }
                }}
                className="p-1.5 text-[#9F9A8E] hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#1B1A15] border border-[#C6A53A]/40 p-6 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-[#9F9A8E] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif-luxury text-xl text-white mb-4">
              {editingBrand ? 'Modifier la marque' : 'Ajouter une marque'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#9F9A8E] uppercase mb-1 font-semibold">
                  Nom de la marque *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Ex: Prada Eyewear"
                  className="w-full bg-[#11110F] border border-white/10 text-white p-2.5 outline-none focus:border-[#C6A53A]"
                />
              </div>

              <div>
                <label className="block text-[#9F9A8E] uppercase mb-1 font-semibold">
                  Pays d'origine
                </label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
                  placeholder="Ex: Italie, France, Japon"
                  className="w-full bg-[#11110F] border border-white/10 text-white p-2.5"
                />
              </div>

              <div>
                <label className="block text-[#9F9A8E] uppercase mb-1 font-semibold">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full bg-[#11110F] border border-white/10 text-white p-2.5"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))}
                    className="accent-[#C6A53A]"
                  />
                  <span>Mettre en avant sur la page d'accueil</span>
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
