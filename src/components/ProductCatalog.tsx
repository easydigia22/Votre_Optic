import React, { useState, useMemo } from 'react';
import { Product, Brand, Category, FilterState } from '../types';
import { ProductCard } from './ProductCard';
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  Check,
} from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  brands: Brand[];
  categories: Category[];
  onSelectProduct: (product: Product) => void;
  whatsappNumber: string;
  initialFilters?: Partial<FilterState>;
  wishlistIds?: string[];
  onToggleWishlist?: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  brands,
  categories,
  onSelectProduct,
  whatsappNumber,
  initialFilters,
  wishlistIds = [],
  onToggleWishlist,
}) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    search: initialFilters?.search || '',
    gender: initialFilters?.gender || 'all',
    type: initialFilters?.type || 'all',
    categoryId: initialFilters?.categoryId || 'all',
    brandId: initialFilters?.brandId || 'all',
    inStockOnly: initialFilters?.inStockOnly || false,
    promoOnly: initialFilters?.promoOnly || false,
    newOnly: initialFilters?.newOnly || false,
    minPrice: 0,
    maxPrice: 10000,
    color: 'all',
    sortBy: 'featured',
  });

  // Extract all unique colors from products
  const availableColors = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      p.colors?.forEach((c) => set.add(c));
    });
    return Array.from(set);
  }, [products]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Must be active status
      if (p.status !== 'active') return false;

      // Search keyword (name, reference, frameType, material)
      if (filters.search) {
        const query = filters.search.toLowerCase().trim();
        const brand = brands.find((b) => b.id === p.brandId);
        const matchName = p.name.toLowerCase().includes(query);
        const matchRef = p.reference.toLowerCase().includes(query);
        const matchBrand = brand ? brand.name.toLowerCase().includes(query) : false;
        const matchDesc = p.description.toLowerCase().includes(query);
        const matchMaterial = p.material.toLowerCase().includes(query);

        if (!matchName && !matchRef && !matchBrand && !matchDesc && !matchMaterial) {
          return false;
        }
      }

      // Gender filter
      if (filters.gender !== 'all') {
        if (p.gender !== filters.gender && p.gender !== 'mixte') {
          return false;
        }
      }

      // Type filter (vue / soleil)
      if (filters.type !== 'all') {
        if (p.type !== filters.type) return false;
      }

      // Category filter
      if (filters.categoryId !== 'all') {
        if (p.categoryId !== filters.categoryId) return false;
      }

      // Brand filter
      if (filters.brandId !== 'all') {
        if (p.brandId !== filters.brandId) return false;
      }

      // Stock only
      if (filters.inStockOnly && p.stockQuantity <= 0) {
        return false;
      }

      // Promo only
      if (filters.promoOnly && !p.inPromo) {
        return false;
      }

      // New only
      if (filters.newOnly && !p.isNew) {
        return false;
      }

      // Price range
      if (p.price < filters.minPrice || p.price > filters.maxPrice) {
        return false;
      }

      // Color filter
      if (filters.color !== 'all') {
        if (!p.colors || !p.colors.includes(filters.color)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      // Featured first
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });
  }, [products, brands, filters]);

  const resetFilters = () => {
    setFilters({
      search: '',
      gender: 'all',
      type: 'all',
      categoryId: 'all',
      brandId: 'all',
      inStockOnly: false,
      promoOnly: false,
      newOnly: false,
      minPrice: 0,
      maxPrice: 10000,
      color: 'all',
      sortBy: 'featured',
    });
  };

  const hasActiveFilters =
    filters.search !== '' ||
    filters.gender !== 'all' ||
    filters.type !== 'all' ||
    filters.categoryId !== 'all' ||
    filters.brandId !== 'all' ||
    filters.inStockOnly ||
    filters.promoOnly ||
    filters.newOnly ||
    filters.color !== 'all' ||
    filters.maxPrice < 10000;

  return (
    <div className="min-h-screen bg-[#11110F] text-[#FFFDF7] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title & Intro */}
        <div className="border-b border-white/10 pb-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#C6A53A]">
                Haute Lunetterie · Casablanca
              </span>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl text-white font-medium mt-1">
                Catalogue de Lunettes
              </h1>
            </div>

            <p className="text-xs text-[#9F9A8E] max-w-md">
              Explorez notre sélection exclusive de montures de créateurs disponibles immédiatement
              en boutique avec accompagnement optique et commande directe WhatsApp.
            </p>
          </div>

          {/* Quick Gender & Type Tabs (Functional Segmented Controls) */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 p-1 bg-[#1B1A15] border border-white/5">
              {[
                { id: 'all', label: 'Toutes les montures' },
                { id: 'femme', label: 'Femme' },
                { id: 'homme', label: 'Homme' },
                { id: 'enfant', label: 'Enfant' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilters((prev) => ({ ...prev, gender: tab.id }))}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    filters.gender === tab.id
                      ? 'bg-[#C6A53A] text-[#11110F] font-semibold'
                      : 'text-[#E8E5DD] hover:text-[#C6A53A]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Type Quick Toggle: Vue vs Soleil */}
            <div className="flex items-center gap-1.5 p-1 bg-[#1B1A15] border border-white/5">
              {[
                { id: 'all', label: 'Tous les verres' },
                { id: 'vue', label: 'Lunettes de vue' },
                { id: 'soleil', label: 'Lunettes de soleil' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setFilters((prev) => ({ ...prev, type: t.id }))}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    filters.type === t.id
                      ? 'bg-[#E3C866] text-[#11110F] font-semibold'
                      : 'text-[#E8E5DD] hover:text-[#C6A53A]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search & Active Stats Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          {/* Search bar input */}
          <div className="relative flex-grow max-w-lg">
            <Search className="w-4 h-4 text-[#C6A53A] absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Rechercher par nom, marque, référence (RB, TF, Cartier)..."
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              className="w-full bg-[#1B1A15] border border-white/10 focus:border-[#C6A53A] text-sm text-white pl-9 pr-8 py-2.5 outline-none transition-colors placeholder:text-[#9F9A8E]"
            />
            {filters.search && (
              <button
                onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
                className="absolute right-2.5 top-3 text-[#9F9A8E] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sorting Dropdown */}
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sortBy: e.target.value as FilterState['sortBy'],
                }))
              }
              className="bg-[#1B1A15] border border-white/10 text-xs text-[#E8E5DD] px-3 py-2.5 outline-none focus:border-[#C6A53A]"
            >
              <option value="featured">Sélection Vedette</option>
              <option value="newest">Nouveautés récentes</option>
              <option value="price-asc">Prix : croissant (DH)</option>
              <option value="price-desc">Prix : décroissant (DH)</option>
            </select>

            {/* Mobile Filter Drawer Button */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden px-3 py-2.5 bg-[#1B1A15] border border-[#C6A53A]/40 text-xs font-semibold text-[#F5E6A6] flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filtres</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-[#C6A53A]" />
              )}
            </button>
          </div>
        </div>

        {/* Content Layout: Left Sidebar Filters + Right Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar (lg:col-span-1) */}
          <aside className="hidden lg:block space-y-6 bg-[#15140F] border border-white/5 p-6 h-fit sticky top-28">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C6A53A]">
                Filtres & Sélection
              </span>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-[#9F9A8E] hover:text-[#C6A53A] flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Réinitialiser</span>
                </button>
              )}
            </div>

            {/* Brand Filter */}
            <div>
              <span className="block text-xs uppercase tracking-wider text-[#9F9A8E] mb-2 font-semibold">
                Marques
              </span>
              <div className="space-y-1.5">
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, brandId: 'all' }))}
                  className={`w-full text-left text-xs py-1 px-2 flex justify-between items-center transition-colors ${
                    filters.brandId === 'all'
                      ? 'text-[#C6A53A] font-semibold bg-[#29271F]'
                      : 'text-[#9F9A8E] hover:text-white'
                  }`}
                >
                  <span>Toutes les marques</span>
                  {filters.brandId === 'all' && <Check className="w-3 h-3 text-[#C6A53A]" />}
                </button>
                {brands.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setFilters((prev) => ({ ...prev, brandId: b.id }))}
                    className={`w-full text-left text-xs py-1 px-2 flex justify-between items-center transition-colors ${
                      filters.brandId === b.id
                        ? 'text-[#C6A53A] font-semibold bg-[#29271F]'
                        : 'text-[#9F9A8E] hover:text-white'
                    }`}
                  >
                    <span>{b.name}</span>
                    {filters.brandId === b.id && <Check className="w-3 h-3 text-[#C6A53A]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <span className="block text-xs uppercase tracking-wider text-[#9F9A8E] mb-2 font-semibold">
                Catégorie
              </span>
              <div className="space-y-1.5">
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, categoryId: 'all' }))}
                  className={`w-full text-left text-xs py-1 px-2 flex justify-between items-center transition-colors ${
                    filters.categoryId === 'all'
                      ? 'text-[#C6A53A] font-semibold bg-[#29271F]'
                      : 'text-[#9F9A8E] hover:text-white'
                  }`}
                >
                  <span>Toutes catégories</span>
                  {filters.categoryId === 'all' && <Check className="w-3 h-3 text-[#C6A53A]" />}
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setFilters((prev) => ({ ...prev, categoryId: c.id }))}
                    className={`w-full text-left text-xs py-1 px-2 flex justify-between items-center transition-colors ${
                      filters.categoryId === c.id
                        ? 'text-[#C6A53A] font-semibold bg-[#29271F]'
                        : 'text-[#9F9A8E] hover:text-white'
                    }`}
                  >
                    <span>{c.name}</span>
                    {filters.categoryId === c.id && <Check className="w-3 h-3 text-[#C6A53A]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Status Toggles */}
            <div className="pt-2 border-t border-white/5 space-y-2">
              <label className="flex items-center gap-2 text-xs text-[#E8E5DD] cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inStockOnly}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))
                  }
                  className="rounded accent-[#C6A53A] bg-[#29271F] border-white/20"
                />
                <span>En stock uniquement</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[#E8E5DD] cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.promoOnly}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, promoOnly: e.target.checked }))
                  }
                  className="rounded accent-[#C6A53A] bg-[#29271F] border-white/20"
                />
                <span>Offres & Promotions</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[#E8E5DD] cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.newOnly}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, newOnly: e.target.checked }))
                  }
                  className="rounded accent-[#C6A53A] bg-[#29271F] border-white/20"
                />
                <span>Nouveautés</span>
              </label>
            </div>

            {/* Max Price Range Slider */}
            <div className="pt-2 border-t border-white/5">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-[#9F9A8E] uppercase tracking-wider font-semibold">
                  Budget max
                </span>
                <span className="font-mono text-[#F5E6A6] tabular-nums">
                  {filters.maxPrice.toLocaleString('fr-FR')} DH
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="250"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
                }
                className="w-full accent-[#C6A53A]"
              />
            </div>

            {/* Available Colors Filter */}
            {availableColors.length > 0 && (
              <div className="pt-2 border-t border-white/5">
                <span className="block text-xs uppercase tracking-wider text-[#9F9A8E] mb-2 font-semibold">
                  Nuances & Teintes
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, color: 'all' }))}
                    className={`text-[11px] px-2 py-0.5 border ${
                      filters.color === 'all'
                        ? 'border-[#C6A53A] text-[#F5E6A6] bg-[#C6A53A]/10'
                        : 'border-white/10 text-[#9F9A8E] hover:text-white'
                    }`}
                  >
                    Toutes
                  </button>
                  {availableColors.slice(0, 8).map((col) => (
                    <button
                      key={col}
                      onClick={() => setFilters((prev) => ({ ...prev, color: col }))}
                      className={`text-[11px] px-2 py-0.5 border ${
                        filters.color === col
                          ? 'border-[#C6A53A] text-[#F5E6A6] bg-[#C6A53A]/10'
                          : 'border-white/10 text-[#9F9A8E] hover:text-white'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Product Grid Area (lg:col-span-3) */}
          <main className="lg:col-span-3">
            {/* Meta Count */}
            <div className="flex items-center justify-between text-xs text-[#9F9A8E] mb-6">
              <span>
                Affichage de <strong className="text-white font-mono tabular-nums">{filteredProducts.length}</strong>{' '}
                modèles d'optique
              </span>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-[#C6A53A] hover:underline"
                >
                  Effacer les filtres
                </button>
              )}
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const brand = brands.find((b) => b.id === product.brandId);
                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      brand={brand}
                      onSelectProduct={onSelectProduct}
                      whatsappNumber={whatsappNumber}
                      isInWishlist={wishlistIds.includes(product.id)}
                      onToggleWishlist={onToggleWishlist}
                    />
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-[#1B1A15] border border-white/5 p-12 text-center flex flex-col items-center">
                <Search className="w-10 h-10 text-[#C6A53A]/40 mb-4" />
                <h3 className="font-serif-luxury text-xl text-white font-medium mb-2">
                  Aucun modèle ne correspond à vos critères
                </h3>
                <p className="text-xs text-[#9F9A8E] max-w-sm mb-6">
                  Modifiez votre recherche ou contactez notre opticien directement sur WhatsApp
                  pour vérifier les disponibilités en réserve à Casablanca.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-[#C6A53A] text-[#11110F] font-bold text-xs uppercase tracking-wider"
                >
                  Voir toutes les montures
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm lg:hidden">
          <div className="w-full max-w-xs bg-[#1B1A15] h-full p-6 overflow-y-auto flex flex-col justify-between border-l border-[#C6A53A]/30">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="font-serif-luxury text-lg text-white">Filtres</span>
                <button onClick={() => setMobileFiltersOpen(false)}>
                  <X className="w-5 h-5 text-[#9F9A8E]" />
                </button>
              </div>

              {/* Brands */}
              <div>
                <span className="block text-xs uppercase tracking-wider text-[#9F9A8E] mb-2 font-semibold">
                  Marques
                </span>
                <select
                  value={filters.brandId}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, brandId: e.target.value }))
                  }
                  className="w-full bg-[#11110F] border border-white/10 text-xs text-white p-2.5"
                >
                  <option value="all">Toutes les marques</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Categories */}
              <div>
                <span className="block text-xs uppercase tracking-wider text-[#9F9A8E] mb-2 font-semibold">
                  Catégorie
                </span>
                <select
                  value={filters.categoryId}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, categoryId: e.target.value }))
                  }
                  className="w-full bg-[#11110F] border border-white/10 text-xs text-white p-2.5"
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="flex items-center gap-2 text-xs text-white">
                  <input
                    type="checkbox"
                    checked={filters.inStockOnly}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))
                    }
                    className="accent-[#C6A53A]"
                  />
                  <span>En stock uniquement</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-white">
                  <input
                    type="checkbox"
                    checked={filters.promoOnly}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, promoOnly: e.target.checked }))
                    }
                    className="accent-[#C6A53A]"
                  />
                  <span>Promotions uniquement</span>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-2">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3 bg-[#C6A53A] text-[#11110F] font-bold text-xs uppercase"
              >
                Appliquer ({filteredProducts.length} résultats)
              </button>
              <button
                onClick={() => {
                  resetFilters();
                  setMobileFiltersOpen(false);
                }}
                className="w-full py-2.5 border border-white/10 text-xs text-[#9F9A8E]"
              >
                Effacer les filtres
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
