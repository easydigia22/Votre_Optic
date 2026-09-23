import React, { useState } from 'react';
import { Product, Brand, Category } from '../types';
import {
  Plus,
  Search,
  Edit2,
  Copy,
  Archive,
  Trash2,
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Glasses,
  Image as ImageIcon,
} from 'lucide-react';

interface AdminProductsProps {
  products: Product[];
  brands: Brand[];
  categories: Category[];
  onSaveProduct: (product: Product) => void;
  onDuplicateProduct: (id: string) => void;
  onArchiveProduct: (id: string) => void;
  onDeleteProduct: (id: string) => void;
  isOpenInitialModal?: boolean;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  brands,
  categories,
  onSaveProduct,
  onDuplicateProduct,
  onArchiveProduct,
  onDeleteProduct,
  isOpenInitialModal = false,
}) => {
  const [modalOpen, setModalOpen] = useState(isOpenInitialModal);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Form State for Ultra-Fast (<60s) Product Creation
  const [formState, setFormState] = useState<Partial<Product>>({
    name: '',
    reference: '',
    brandId: brands[0]?.id || '',
    categoryId: categories[0]?.id || '',
    gender: 'mixte',
    type: 'soleil',
    price: 1800,
    oldPrice: undefined,
    stockQuantity: 5,
    lowStockThreshold: 3,
    description: '',
    frameType: 'Rectangulaire Moderne',
    material: 'Acétate Italien Haut de Gamme',
    lensType: 'Protection 100% UV400 Polarisé',
    colors: ['Noir Brillant'],
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80'],
    isNew: true,
    isFeatured: false,
    inPromo: false,
    discountPercentage: 0,
    status: 'active',
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [colorInput, setColorInput] = useState('');

  const openNewProductModal = () => {
    const randomCode = 'VO-' + Math.floor(1000 + Math.random() * 9000);
    setEditingProduct(null);
    setFormState({
      name: '',
      reference: randomCode,
      brandId: brands[0]?.id || '',
      categoryId: categories[0]?.id || '',
      gender: 'mixte',
      type: 'soleil',
      price: 1900,
      oldPrice: undefined,
      stockQuantity: 6,
      lowStockThreshold: 3,
      description: 'Monture de haute manufacture alliant confort, légèreté et finitions artisanales.',
      frameType: 'Aviateur Moderne',
      material: 'Acétate & Métal Inoxydable',
      lensType: 'Verre Minéral Haute Précision',
      colors: ['Noir Ébène', 'Écaille Miel'],
      images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80'],
      isNew: true,
      isFeatured: true,
      inPromo: false,
      discountPercentage: 0,
      status: 'active',
    });
    setModalOpen(true);
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProduct(prod);
    setFormState({ ...prod });
    setModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.reference) return;

    const slug =
      editingProduct?.slug ||
      formState.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

    const productToSave: Product = {
      id: editingProduct ? editingProduct.id : 'prod-' + Date.now(),
      slug,
      reference: formState.reference || 'REF-' + Date.now(),
      name: formState.name || 'Nouvelle Monture',
      brandId: formState.brandId || brands[0]?.id || 'brand-rayban',
      categoryId: formState.categoryId || categories[0]?.id || 'cat-soleil',
      gender: formState.gender || 'mixte',
      type: formState.type || 'soleil',
      price: Number(formState.price) || 0,
      oldPrice: formState.oldPrice ? Number(formState.oldPrice) : undefined,
      inPromo: !!formState.inPromo,
      discountPercentage: formState.inPromo ? Number(formState.discountPercentage) || 0 : undefined,
      stockQuantity: Number(formState.stockQuantity) || 0,
      lowStockThreshold: Number(formState.lowStockThreshold) || 3,
      description: formState.description || '',
      images: formState.images && formState.images.length > 0 ? formState.images : ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80'],
      colors: formState.colors || ['Noir'],
      frameType: formState.frameType || 'Classique',
      material: formState.material || 'Acétate',
      lensType: formState.lensType || 'Standard',
      isNew: !!formState.isNew,
      isFeatured: !!formState.isFeatured,
      status: formState.status || 'active',
      createdAt: editingProduct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveProduct(productToSave);
    setModalOpen(false);
  };

  const handleAddImage = () => {
    if (imageUrlInput.trim()) {
      setFormState((prev) => ({
        ...prev,
        images: [...(prev.images || []), imageUrlInput.trim()],
      }));
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index),
    }));
  };

  const handleAddColor = () => {
    if (colorInput.trim()) {
      setFormState((prev) => ({
        ...prev,
        colors: [...(prev.colors || []), colorInput.trim()],
      }));
      setColorInput('');
    }
  };

  const handleRemoveColor = (col: string) => {
    setFormState((prev) => ({
      ...prev,
      colors: prev.colors?.filter((c) => c !== col),
    }));
  };

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    if (filterCategory !== 'all' && p.categoryId !== filterCategory) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchRef = p.reference.toLowerCase().includes(q);
      return matchName || matchRef;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#C6A53A]">
            Catalogue & Fiches Modèles
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl text-white font-medium mt-1">
            Gestion des Produits
          </h1>
          <p className="text-xs text-[#9F9A8E]">
            {products.length} montures enregistrées · Création ultra-rapide en moins de 60 secondes
          </p>
        </div>

        <button
          onClick={openNewProductModal}
          className="px-5 py-3 bg-[#C6A53A] hover:bg-[#E3C866] text-[#11110F] font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-colors shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>+ Ajouter un produit</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#1B1A15] border border-white/5 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#C6A53A] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Filtrer par nom ou référence..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#11110F] border border-white/10 text-xs text-white pl-9 pr-3 py-2 outline-none focus:border-[#C6A53A]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-[#11110F] border border-white/10 text-xs text-white px-3 py-2 outline-none focus:border-[#C6A53A]"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#11110F] border border-white/10 text-xs text-white px-3 py-2 outline-none focus:border-[#C6A53A]"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="draft">Brouillon</option>
            <option value="archived">Archivé</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#1B1A15] border border-white/5 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[#9F9A8E] uppercase tracking-wider text-[11px] bg-[#0E0E0C]">
              <th className="py-3 px-4">Photo</th>
              <th className="py-3 px-4">Produit & Marque</th>
              <th className="py-3 px-4">Référence</th>
              <th className="py-3 px-4">Catégorie</th>
              <th className="py-3 px-4">Prix (MAD)</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Statut</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredProducts.map((p) => {
              const brand = brands.find((b) => b.id === p.brandId);
              const category = categories.find((c) => c.id === p.categoryId);
              const isOut = p.stockQuantity <= 0;
              const isLow = p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold;

              return (
                <tr key={p.id} className="hover:bg-[#201F18] transition-colors">
                  {/* Photo */}
                  <td className="py-3 px-4">
                    <div className="w-12 h-10 bg-[#11110F] border border-white/10 flex items-center justify-center p-0.5 overflow-hidden">
                      {p.images && p.images[0] ? (
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Glasses className="w-4 h-4 text-[#9F9A8E]" />
                      )}
                    </div>
                  </td>

                  {/* Product & Brand */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{p.name}</div>
                    <div className="text-[11px] text-[#C6A53A]">{brand?.name || 'Maison'}</div>
                  </td>

                  {/* Reference */}
                  <td className="py-3 px-4 font-mono text-[11px] text-[#9F9A8E]">
                    {p.reference}
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 text-[#D5D1C4]">
                    {category?.name || p.type}
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 font-mono font-semibold tabular-nums text-white">
                    {p.price.toLocaleString('fr-FR')} DH
                    {p.inPromo && (
                      <span className="block text-[10px] text-[#C6A53A]">Promo</span>
                    )}
                  </td>

                  {/* Stock */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 font-mono text-xs font-bold px-2 py-0.5 ${
                        isOut
                          ? 'bg-red-950 text-red-400 border border-red-800/60'
                          : isLow
                          ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                      }`}
                    >
                      {p.stockQuantity} ex.
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 ${
                        p.status === 'active'
                          ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/40'
                          : p.status === 'archived'
                          ? 'text-neutral-400 bg-neutral-800/40 border border-neutral-700/40'
                          : 'text-amber-400 bg-amber-950/40 border border-amber-800/40'
                      }`}
                    >
                      {p.status === 'active'
                        ? 'Actif'
                        : p.status === 'archived'
                        ? 'Archivé'
                        : 'Brouillon'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => openEditProductModal(p)}
                        title="Modifier le produit"
                        className="p-1.5 text-[#9F9A8E] hover:text-[#C6A53A] transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDuplicateProduct(p.id)}
                        title="Dupliquer la monture"
                        className="p-1.5 text-[#9F9A8E] hover:text-white transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onArchiveProduct(p.id)}
                        title={p.status === 'archived' ? 'Désarchiver' : 'Archiver'}
                        className="p-1.5 text-[#9F9A8E] hover:text-amber-400 transition-colors"
                      >
                        <Archive className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Supprimer définitivement "${p.name}" ?`)) {
                            onDeleteProduct(p.id);
                          }
                        }}
                        title="Supprimer"
                        className="p-1.5 text-[#9F9A8E] hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ULTRA-FAST (<60s) PRODUCT FORM MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#1B1A15] border border-[#C6A53A]/40 shadow-2xl p-6 sm:p-8 my-6">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-[#9F9A8E] hover:text-white p-2"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-mono uppercase tracking-widest text-[#C6A53A]">
                {editingProduct ? 'Édition Rapide' : 'Formulaire Express (< 60s)'}
              </span>
              <h2 className="font-serif-luxury text-2xl text-white font-medium">
                {editingProduct ? `Modifier : ${editingProduct.name}` : 'Ajouter une Monture'}
              </h2>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              {/* Row 1: Name & Reference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9F9A8E] uppercase tracking-wider mb-1 font-semibold">
                    Nom du modèle *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Clubmaster Classic Or"
                    value={formState.name}
                    onChange={(e) => setFormState((p) => ({ ...p, name: e.target.value }))}
                    className="w-full bg-[#11110F] border border-white/10 text-white p-2.5 outline-none focus:border-[#C6A53A]"
                  />
                </div>

                <div>
                  <label className="block text-[#9F9A8E] uppercase tracking-wider mb-1 font-semibold">
                    Référence fabricant *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: RB-3016-W0365"
                    value={formState.reference}
                    onChange={(e) => setFormState((p) => ({ ...p, reference: e.target.value }))}
                    className="w-full bg-[#11110F] border border-white/10 font-mono text-white p-2.5 outline-none focus:border-[#C6A53A]"
                  />
                </div>
              </div>

              {/* Row 2: Brand, Category, Gender, Type */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[#9F9A8E] uppercase tracking-wider mb-1 font-semibold">
                    Marque
                  </label>
                  <select
                    value={formState.brandId}
                    onChange={(e) => setFormState((p) => ({ ...p, brandId: e.target.value }))}
                    className="w-full bg-[#11110F] border border-white/10 text-white p-2.5"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#9F9A8E] uppercase tracking-wider mb-1 font-semibold">
                    Catégorie
                  </label>
                  <select
                    value={formState.categoryId}
                    onChange={(e) => setFormState((p) => ({ ...p, categoryId: e.target.value }))}
                    className="w-full bg-[#11110F] border border-white/10 text-white p-2.5"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#9F9A8E] uppercase tracking-wider mb-1 font-semibold">
                    Genre
                  </label>
                  <select
                    value={formState.gender}
                    onChange={(e) =>
                      setFormState((p) => ({ ...p, gender: e.target.value as Product['gender'] }))
                    }
                    className="w-full bg-[#11110F] border border-white/10 text-white p-2.5"
                  >
                    <option value="femme">Femme</option>
                    <option value="homme">Homme</option>
                    <option value="mixte">Mixte</option>
                    <option value="enfant">Enfant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#9F9A8E] uppercase tracking-wider mb-1 font-semibold">
                    Type
                  </label>
                  <select
                    value={formState.type}
                    onChange={(e) =>
                      setFormState((p) => ({ ...p, type: e.target.value as Product['type'] }))
                    }
                    className="w-full bg-[#11110F] border border-white/10 text-white p-2.5"
                  >
                    <option value="vue">Vue</option>
                    <option value="soleil">Soleil</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Price, Promo, Stock Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#9F9A8E] uppercase tracking-wider mb-1 font-semibold">
                    Prix (DH / MAD) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formState.price}
                    onChange={(e) =>
                      setFormState((p) => ({ ...p, price: Number(e.target.value) }))
                    }
                    className="w-full bg-[#11110F] border border-white/10 font-mono text-white p-2.5 outline-none focus:border-[#C6A53A]"
                  />
                </div>

                <div>
                  <label className="block text-[#9F9A8E] uppercase tracking-wider mb-1 font-semibold">
                    Ancien Prix / Promo
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Optionnel"
                    value={formState.oldPrice || ''}
                    onChange={(e) =>
                      setFormState((p) => ({
                        ...p,
                        oldPrice: e.target.value ? Number(e.target.value) : undefined,
                        inPromo: !!e.target.value,
                      }))
                    }
                    className="w-full bg-[#11110F] border border-white/10 font-mono text-white p-2.5 outline-none focus:border-[#C6A53A]"
                  />
                </div>

                <div>
                  <label className="block text-[#9F9A8E] uppercase tracking-wider mb-1 font-semibold">
                    Quantité en Stock *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formState.stockQuantity}
                    onChange={(e) =>
                      setFormState((p) => ({ ...p, stockQuantity: Number(e.target.value) }))
                    }
                    className="w-full bg-[#11110F] border border-white/10 font-mono text-white p-2.5 outline-none focus:border-[#C6A53A]"
                  />
                </div>
              </div>

              {/* Row 4: Frame Type, Material, Lens Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#9F9A8E] uppercase tracking-wider mb-1 font-semibold">
                    Forme de monture
                  </label>
                  <input
                    type="text"
                    value={formState.frameType}
                    onChange={(e) => setFormState((p) => ({ ...p, frameType: e.target.value }))}
                    placeholder="Ex: Aviateur, Papillon, Ovale"
                    className="w-full bg-[#11110F] border border-white/10 text-white p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-[#9F9A8E] uppercase tracking-wider mb-1 font-semibold">
                    Matériau
                  </label>
                  <input
                    type="text"
                    value={formState.material}
                    onChange={(e) => setFormState((p) => ({ ...p, material: e.target.value }))}
                    placeholder="Ex: Titane Japonais, Acétate"
                    className="w-full bg-[#11110F] border border-white/10 text-white p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-[#9F9A8E] uppercase tracking-wider mb-1 font-semibold">
                    Type de verres
                  </label>
                  <input
                    type="text"
                    value={formState.lensType}
                    onChange={(e) => setFormState((p) => ({ ...p, lensType: e.target.value }))}
                    placeholder="Ex: Polarisé, Anti-reflet"
                    className="w-full bg-[#11110F] border border-white/10 text-white p-2.5"
                  />
                </div>
              </div>

              {/* Photos Gallery Management */}
              <div>
                <label className="block text-[#9F9A8E] uppercase tracking-wider mb-1 font-semibold">
                  Photos du modèle (URL ou visuels prédéfinis)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    placeholder="Coller l'URL d'une photo..."
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="flex-1 bg-[#11110F] border border-white/10 text-white p-2 outline-none focus:border-[#C6A53A]"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-4 py-2 bg-[#C6A53A] text-[#11110F] font-bold uppercase"
                  >
                    Ajouter
                  </button>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {formState.images?.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative w-16 h-14 bg-[#11110F] border border-white/10 shrink-0 p-1 group"
                    >
                      <img
                        src={url}
                        alt="Photo aperçu"
                        className="w-full h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px]"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-[#9F9A8E] uppercase tracking-wider mb-1 font-semibold">
                  Coloris
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Ex: Or Rose, Noir Brillant..."
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    className="flex-1 bg-[#11110F] border border-white/10 text-white p-2 outline-none focus:border-[#C6A53A]"
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-4 py-2 bg-[#29271F] text-white hover:text-[#C6A53A] font-semibold"
                  >
                    + Teinte
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formState.colors?.map((col) => (
                    <span
                      key={col}
                      className="px-2 py-0.5 bg-[#11110F] border border-white/10 text-white text-[11px] flex items-center gap-1.5"
                    >
                      {col}
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(col)}
                        className="text-red-400 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[#9F9A8E] uppercase tracking-wider mb-1 font-semibold">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formState.description}
                  onChange={(e) => setFormState((p) => ({ ...p, description: e.target.value }))}
                  className="w-full bg-[#11110F] border border-white/10 text-white p-2.5 outline-none focus:border-[#C6A53A]"
                />
              </div>

              {/* Flags & Status */}
              <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.isNew}
                      onChange={(e) => setFormState((p) => ({ ...p, isNew: e.target.checked }))}
                      className="accent-[#C6A53A]"
                    />
                    <span>Nouveauté</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.isFeatured}
                      onChange={(e) =>
                        setFormState((p) => ({ ...p, isFeatured: e.target.checked }))
                      }
                      className="accent-[#C6A53A]"
                    />
                    <span>En vedette</span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-[#9F9A8E]">Statut :</label>
                  <select
                    value={formState.status}
                    onChange={(e) =>
                      setFormState((p) => ({
                        ...p,
                        status: e.target.value as Product['status'],
                      }))
                    }
                    className="bg-[#11110F] border border-white/10 text-white p-1.5"
                  >
                    <option value="active">Actif</option>
                    <option value="draft">Brouillon</option>
                    <option value="archived">Archivé</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 border border-white/10 text-[#9F9A8E] hover:text-white"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#C6A53A] hover:bg-[#E3C866] text-[#11110F] font-bold uppercase tracking-wider transition-colors"
                >
                  {editingProduct ? 'Enregistrer les modifications' : 'Créer la monture (<60s)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
