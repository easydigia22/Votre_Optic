import React from 'react';
import { Product, Category, Promotion, CustomerMessage, Brand } from '../../src/types';
import {
  Glasses,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Tags,
  Sparkles,
  MessageSquare,
  Plus,
  ArrowRight,
  TrendingUp,
  Star,
} from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  promotions: Promotion[];
  messages: CustomerMessage[];
  pendingReviews?: number;
  totalReviews?: number;
  onNavigateTab: (tab: string) => void;
  onQuickAddStock: (productId: string, qty: number) => void;
  onOpenProductForm: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  categories,
  brands,
  promotions,
  messages,
  pendingReviews = 0,
  totalReviews = 0,
  onNavigateTab,
  onQuickAddStock,
  onOpenProductForm,
}) => {
  const totalProducts = products.length;
  const availableProducts = products.filter((p) => p.stockQuantity > 0).length;
  const lowStockProducts = products.filter(
    (p) => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold
  );
  const outOfStockProducts = products.filter((p) => p.stockQuantity <= 0);
  const activePromotions = promotions.filter((p) => p.isActive).length;
  const unreadMessages = messages.filter((m) => m.status === 'unread').length;

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#C6A53A]">
            Tableau de Bord Exécutif
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl text-white font-medium mt-1">
            Supervision du Magasin & Stock
          </h1>
          <p className="text-xs text-[#9F9A8E]">
            Votre Optique Casablanca · Suivi en direct du stock, des collections et des demandes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenProductForm}
            className="px-4 py-2.5 bg-[#C6A53A] hover:bg-[#E3C866] text-[#11110F] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Produit (&lt;60s)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
        {/* Total Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-[#1B1A15] border border-white/5 hover:border-[#C6A53A]/40 p-4 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-[#9F9A8E] mb-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Produits</span>
            <Glasses className="w-4 h-4 text-[#C6A53A]" />
          </div>
          <p className="font-mono text-2xl font-bold text-white tabular-nums">{totalProducts}</p>
          <span className="text-[10px] text-[#9F9A8E]">Au catalogue</span>
        </div>

        {/* In Stock */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-[#1B1A15] border border-white/5 hover:border-emerald-500/40 p-4 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-[#9F9A8E] mb-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Disponibles</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="font-mono text-2xl font-bold text-emerald-400 tabular-nums">
            {availableProducts}
          </p>
          <span className="text-[10px] text-[#9F9A8E]">En rayon</span>
        </div>

        {/* Low Stock Alert */}
        <div
          onClick={() => onNavigateTab('stock')}
          className={`bg-[#1B1A15] border p-4 cursor-pointer transition-all ${
            lowStockProducts.length > 0
              ? 'border-amber-500/50 bg-amber-950/10'
              : 'border-white/5'
          }`}
        >
          <div className="flex items-center justify-between text-[#9F9A8E] mb-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-300">
              Stock Faible
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="font-mono text-2xl font-bold text-amber-300 tabular-nums">
            {lowStockProducts.length}
          </p>
          <span className="text-[10px] text-amber-400/80">Seuil critique (≤ 3)</span>
        </div>

        {/* Out of Stock */}
        <div
          onClick={() => onNavigateTab('stock')}
          className={`bg-[#1B1A15] border p-4 cursor-pointer transition-all ${
            outOfStockProducts.length > 0
              ? 'border-red-500/50 bg-red-950/10'
              : 'border-white/5'
          }`}
        >
          <div className="flex items-center justify-between text-[#9F9A8E] mb-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-red-400">
              Ruptures
            </span>
            <XCircle className="w-4 h-4 text-red-400" />
          </div>
          <p className="font-mono text-2xl font-bold text-red-400 tabular-nums">
            {outOfStockProducts.length}
          </p>
          <span className="text-[10px] text-red-400/80">À recommander</span>
        </div>

        {/* Categories */}
        <div
          onClick={() => onNavigateTab('categories')}
          className="bg-[#1B1A15] border border-white/5 hover:border-white/20 p-4 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-[#9F9A8E] mb-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Catégories</span>
            <Tags className="w-4 h-4 text-[#C6A53A]" />
          </div>
          <p className="font-mono text-2xl font-bold text-white tabular-nums">
            {categories.length}
          </p>
          <span className="text-[10px] text-[#9F9A8E]">Rayons actifs</span>
        </div>

        {/* Active Promos */}
        <div
          onClick={() => onNavigateTab('promotions')}
          className="bg-[#1B1A15] border border-white/5 hover:border-white/20 p-4 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-[#9F9A8E] mb-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Promotions</span>
            <Sparkles className="w-4 h-4 text-[#E3C866]" />
          </div>
          <p className="font-mono text-2xl font-bold text-[#E3C866] tabular-nums">
            {activePromotions}
          </p>
          <span className="text-[10px] text-[#9F9A8E]">Campagnes en cours</span>
        </div>

        {/* Customer Inquiries */}
        <div
          onClick={() => onNavigateTab('messages')}
          className="bg-[#1B1A15] border border-white/5 hover:border-white/20 p-4 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-[#9F9A8E] mb-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Demandes</span>
            <MessageSquare className="w-4 h-4 text-[#C6A53A]" />
          </div>
          <p className="font-mono text-2xl font-bold text-[#F5E6A6] tabular-nums">
            {messages.length}
          </p>
          <span className="text-[10px] text-[#C6A53A]">
            {unreadMessages} non lue{unreadMessages > 1 ? 's' : ''}
          </span>
        </div>

        {/* Reviews KPI */}
        <div
          onClick={() => onNavigateTab('reviews')}
          className={`bg-[#1B1A15] border p-4 cursor-pointer transition-all ${
            pendingReviews > 0 ? 'border-amber-500/50 hover:border-amber-400' : 'border-white/5 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between text-[#9F9A8E] mb-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Avis Clients</span>
            <Star className={`w-4 h-4 ${pendingReviews > 0 ? 'text-amber-400 fill-current' : 'text-[#C6A53A]'}`} />
          </div>
          <p className="font-mono text-2xl font-bold text-white tabular-nums">
            {totalReviews}
          </p>
          <span className={`text-[10px] ${pendingReviews > 0 ? 'text-amber-300 font-bold' : 'text-[#9F9A8E]'}`}>
            {pendingReviews > 0 ? `${pendingReviews} à modérer` : 'Tous modérés'}
          </span>
        </div>
      </div>

      {/* Critical Stock Alerts Box (Prompt Requirement: "Ajouter: Alertes stock faible. Exemple: Ray-Ban RB2140, Stock: 2") */}
      <div className="bg-[#1B1A15] border border-amber-500/40 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-amber-300">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif-luxury text-lg text-white font-medium">
              Alertes Stock Faible & Réassort Urgent
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('stock')}
            className="text-xs text-[#C6A53A] hover:underline flex items-center gap-1"
          >
            <span>Gérer tous les stocks</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {lowStockProducts.length > 0 || outOfStockProducts.length > 0 ? (
          <div className="space-y-3">
            {[...outOfStockProducts, ...lowStockProducts].map((item) => {
              const brand = brands.find((b) => b.id === item.brandId);
              const isOut = item.stockQuantity <= 0;
              return (
                <div
                  key={item.id}
                  className="bg-[#11110F] border border-white/10 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-10 bg-[#1B1A15] border border-white/10 shrink-0 p-1">
                      {item.images && item.images[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Glasses className="w-full h-full text-[#9F9A8E]" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{item.name}</span>
                        <span className="text-[10px] font-mono text-[#C6A53A] bg-[#1B1A15] px-1.5 py-0.2">
                          Réf: {item.reference}
                        </span>
                        <span className="text-[10px] text-[#9F9A8E]">{brand?.name}</span>
                      </div>
                      <p className="text-[11px] text-[#9F9A8E] mt-0.5">
                        {item.price.toLocaleString('fr-FR')} DH · Seuil d'alerte : {item.lowStockThreshold} unités
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-end">
                    <span
                      className={`font-mono text-xs px-2.5 py-1 font-bold ${
                        isOut
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      Stock : {item.stockQuantity} ex.
                    </span>

                    <button
                      onClick={() => onQuickAddStock(item.id, 5)}
                      className="px-3 py-1 bg-[#C6A53A] hover:bg-[#E3C866] text-[#11110F] text-xs font-bold uppercase transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+5 Réassort</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-[#9F9A8E] py-3">
            Tous les niveaux de stocks sont actuellement optimaux au-dessus du seuil d'alerte.
          </p>
        )}
      </div>

      {/* Two Column Section: Recent Customer Inquiries & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Customer Messages (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-[#1B1A15] border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif-luxury text-lg text-white font-medium">
              Dernières Demandes Clients & WhatsApp
            </h3>
            <button
              onClick={() => onNavigateTab('messages')}
              className="text-xs text-[#C6A53A] hover:underline"
            >
              Voir tout ({messages.length})
            </button>
          </div>

          <div className="space-y-3">
            {messages.slice(0, 3).map((msg) => (
              <div
                key={msg.id}
                className="p-3.5 bg-[#11110F] border border-white/5 hover:border-[#C6A53A]/30 transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-white">{msg.name}</strong>
                    <span className="font-mono text-[11px] text-[#C6A53A]">{msg.phone}</span>
                  </div>
                  <span className="text-[10px] text-[#9F9A8E]">
                    {new Date(msg.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-xs text-[#D5D1C4] line-clamp-2">{msg.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Store Management Actions (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-[#1B1A15] border border-white/5 p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-serif-luxury text-lg text-white font-medium mb-3">
              Gestion Immédiate
            </h3>
            <p className="text-xs text-[#9F9A8E] mb-4">
              Raccourcis rapides pour administrer votre boutique en quelques clics :
            </p>

            <div className="space-y-2.5">
              <button
                onClick={onOpenProductForm}
                className="w-full p-3 bg-[#11110F] border border-white/10 hover:border-[#C6A53A] text-left text-xs text-white hover:text-[#C6A53A] flex items-center justify-between transition-colors"
              >
                <span>Ajouter une nouvelle monture (&lt; 60 sec)</span>
                <Plus className="w-4 h-4 text-[#C6A53A]" />
              </button>

              <button
                onClick={() => onNavigateTab('promotions')}
                className="w-full p-3 bg-[#11110F] border border-white/10 hover:border-[#C6A53A] text-left text-xs text-white hover:text-[#C6A53A] flex items-center justify-between transition-colors"
              >
                <span>Lancer une offre promotionnelle</span>
                <Sparkles className="w-4 h-4 text-[#C6A53A]" />
              </button>

              <button
                onClick={() => onNavigateTab('banners')}
                className="w-full p-3 bg-[#11110F] border border-white/10 hover:border-[#C6A53A] text-left text-xs text-white hover:text-[#C6A53A] flex items-center justify-between transition-colors"
              >
                <span>Modifier les bannières publicitaires</span>
                <TrendingUp className="w-4 h-4 text-[#C6A53A]" />
              </button>

              <button
                onClick={() => onNavigateTab('settings')}
                className="w-full p-3 bg-[#11110F] border border-white/10 hover:border-[#C6A53A] text-left text-xs text-white hover:text-[#C6A53A] flex items-center justify-between transition-colors"
              >
                <span>Coordonnées boutique & WhatsApp</span>
                <ArrowRight className="w-4 h-4 text-[#C6A53A]" />
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 text-[11px] text-[#9F9A8E]">
            Système opérationnel optimisé pour le commerce optique au Maroc.
          </div>
        </div>
      </div>
    </div>
  );
};
