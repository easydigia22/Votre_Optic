import React, { useState } from 'react';
import { Category } from '../types';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Check, X } from 'lucide-react';

interface AdminCategoriesProps {
  categories: Category[];
  onSaveCategory: (cat: Category) => void;
  onDeleteCategory: (id: string) => void;
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({
  categories,
  onSaveCategory,
  onDeleteCategory,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    order: 1,
    isActive: true,
  });

  const openNewModal = () => {
    setEditingCategory(null);
    setForm({
      name: '',
      slug: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80',
      order: categories.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      order: cat.order,
      isActive: cat.isActive,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;

    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const catToSave: Category = {
      id: editingCategory ? editingCategory.id : 'cat-' + Date.now(),
      slug,
      name: form.name,
      description: form.description,
      image: form.image,
      order: Number(form.order) || 1,
      isActive: form.isActive,
    };

    onSaveCategory(catToSave);
    setModalOpen(false);
  };

  const handleToggleActive = (cat: Category) => {
    onSaveCategory({
      ...cat,
      isActive: !cat.isActive,
    });
  };

  const handleMoveOrder = (cat: Category, delta: number) => {
    onSaveCategory({
      ...cat,
      order: Math.max(1, cat.order + delta),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#D6AE62]">
            Structure & Rayons
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl text-white font-medium mt-1">
            Gestion des Catégories
          </h1>
          <p className="text-xs text-[#A6A6A6]">
            Personnalisez vos rayons de vente, photos de couverture et priorités d'affichage
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-4 py-2.5 bg-[#D6AE62] hover:bg-[#E8C987] text-[#0B0B0B] font-bold text-xs uppercase tracking-wider flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nouvelle Catégorie</span>
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-[#151515] border border-white/5 overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative h-40 bg-[#0B0B0B] overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover filter brightness-80"
                />
                <div className="absolute top-3 left-3 bg-[#0B0B0B]/80 text-[#D6AE62] text-[10px] font-mono px-2 py-0.5 border border-[#D6AE62]/30">
                  Ordre: #{cat.order}
                </div>
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => handleToggleActive(cat)}
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${
                      cat.isActive
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-red-950 text-red-300 border border-red-800'
                    }`}
                  >
                    {cat.isActive ? 'Active' : 'Désactivée'}
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-serif-luxury text-xl text-white font-semibold">{cat.name}</h3>
                <p className="text-xs font-mono text-[#D6AE62] mb-2">slug: /{cat.slug}</p>
                <p className="text-xs text-[#A6A6A6] line-clamp-2">{cat.description}</p>
              </div>
            </div>

            <div className="p-4 border-t border-white/5 bg-[#121212] flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleMoveOrder(cat, -1)}
                  title="Monter"
                  className="p-1 text-[#A6A6A6] hover:text-white border border-white/10"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleMoveOrder(cat, 1)}
                  title="Descendre"
                  className="p-1 text-[#A6A6A6] hover:text-white border border-white/10"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(cat)}
                  className="p-1.5 text-[#A6A6A6] hover:text-[#D6AE62]"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Supprimer la catégorie "${cat.name}" ?`)) {
                      onDeleteCategory(cat.id);
                    }
                  }}
                  className="p-1.5 text-[#A6A6A6] hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#151515] border border-[#D6AE62]/40 p-6 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-[#A6A6A6] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif-luxury text-xl text-white mb-4">
              {editingCategory ? 'Modifier la Catégorie' : 'Ajouter une Catégorie'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#A6A6A6] uppercase mb-1 font-semibold">
                  Nom de la catégorie *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Ex: Lunettes Haute Joaillerie"
                  className="w-full bg-[#0B0B0B] border border-white/10 text-white p-2.5 outline-none focus:border-[#D6AE62]"
                />
              </div>

              <div>
                <label className="block text-[#A6A6A6] uppercase mb-1 font-semibold">
                  Slug URL (optionnel)
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                  placeholder="Ex: joaillerie"
                  className="w-full bg-[#0B0B0B] border border-white/10 text-white p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="block text-[#A6A6A6] uppercase mb-1 font-semibold">
                  Image URL
                </label>
                <input
                  type="url"
                  required
                  value={form.image}
                  onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                  className="w-full bg-[#0B0B0B] border border-white/10 text-white p-2.5"
                />
              </div>

              <div>
                <label className="block text-[#A6A6A6] uppercase mb-1 font-semibold">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full bg-[#0B0B0B] border border-white/10 text-white p-2.5"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                    className="accent-[#D6AE62]"
                  />
                  <span>Catégorie active</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-[#A6A6A6]">Ordre :</span>
                  <input
                    type="number"
                    min="1"
                    value={form.order}
                    onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) }))}
                    className="w-16 bg-[#0B0B0B] border border-white/10 text-center text-white p-1"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-white/10 text-[#A6A6A6]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#D6AE62] hover:bg-[#E8C987] text-[#0B0B0B] font-bold uppercase"
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
