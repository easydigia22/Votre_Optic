import React, { useState } from 'react';
import { Product, StockMovement, Brand } from '../types';
import {
  Plus,
  Minus,
  Sliders,
  AlertTriangle,
  History,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Search,
  CheckCircle2,
} from 'lucide-react';

interface AdminStockProps {
  products: Product[];
  brands: Brand[];
  movements: StockMovement[];
  onAdjustStock: (
    productId: string,
    deltaOrNewQty: number,
    isAbsolute?: boolean,
    comment?: string,
    type?: 'reassort' | 'vente' | 'ajustement' | 'retour'
  ) => void;
  onUpdateThreshold: (productId: string, threshold: number) => void;
}

export const AdminStock: React.FC<AdminStockProps> = ({
  products,
  brands,
  movements,
  onAdjustStock,
  onUpdateThreshold,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAlertsOnly, setFilterAlertsOnly] = useState(false);
  const [adjustModalProduct, setAdjustModalProduct] = useState<Product | null>(null);
  const [newQuantityValue, setNewQuantityValue] = useState<number>(0);
  const [adjustmentComment, setAdjustmentComment] = useState('');
  const [adjustmentType, setAdjustmentType] = useState<'reassort' | 'vente' | 'ajustement' | 'retour'>('reassort');

  const filteredProducts = products.filter((p) => {
    if (filterAlertsOnly && p.stockQuantity > p.lowStockThreshold) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.reference.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenAdjustModal = (product: Product) => {
    setAdjustModalProduct(product);
    setNewQuantityValue(product.stockQuantity);
    setAdjustmentComment('');
    setAdjustmentType('reassort');
  };

  const handleApplyAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustModalProduct) return;

    onAdjustStock(
      adjustModalProduct.id,
      newQuantityValue,
      true,
      adjustmentComment || 'Ajustement manuel inventaire',
      adjustmentType
    );
    setAdjustModalProduct(null);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#C6A53A]">
            Logistique & Inventaire Réel
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl text-white font-medium mt-1">
            Gestion des Stocks & Alertes
          </h1>
          <p className="text-xs text-[#9F9A8E]">
            Suivi des quantités en rayon, seuils d'alerte configurables et journal d'audit complet
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterAlertsOnly(!filterAlertsOnly)}
            className={`px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              filterAlertsOnly
                ? 'bg-amber-500 text-[#11110F]'
                : 'bg-[#1B1A15] border border-white/10 text-[#E8E5DD] hover:border-amber-400'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Filtrer Stocks Critiques</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-[#1B1A15] border border-white/5 p-4 flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-[#C6A53A] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Rechercher par modèle ou référence..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#11110F] border border-white/10 text-xs text-white pl-9 pr-3 py-2 outline-none focus:border-[#C6A53A]"
          />
        </div>
      </div>

      {/* Stock Management Table */}
      <div className="bg-[#1B1A15] border border-white/5 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[#9F9A8E] uppercase tracking-wider text-[11px] bg-[#0E0E0C]">
              <th className="py-3 px-4">Monture</th>
              <th className="py-3 px-4">Référence</th>
              <th className="py-3 px-4">Seuil d'alerte</th>
              <th className="py-3 px-4">Quantité actuelle</th>
              <th className="py-3 px-4">État Stock</th>
              <th className="py-3 px-4 text-center">Ajustement Rapide</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredProducts.map((p) => {
              const brand = brands.find((b) => b.id === p.brandId);
              const isOut = p.stockQuantity <= 0;
              const isLow = p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold;

              return (
                <tr key={p.id} className="hover:bg-[#201F18] transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{p.name}</div>
                    <div className="text-[11px] text-[#9F9A8E]">{brand?.name}</div>
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px] text-[#C6A53A]">
                    {p.reference}
                  </td>

                  {/* Configurable Low Stock Threshold */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={p.lowStockThreshold}
                        onChange={(e) =>
                          onUpdateThreshold(p.id, Math.max(1, Number(e.target.value)))
                        }
                        className="w-14 bg-[#11110F] border border-white/10 px-2 py-1 text-center font-mono text-xs text-white"
                      />
                      <span className="text-[10px] text-[#9F9A8E]">ex.</span>
                    </div>
                  </td>

                  {/* Stock Quantity */}
                  <td className="py-3 px-4 font-mono text-base font-bold tabular-nums">
                    <span
                      className={
                        isOut
                          ? 'text-red-400'
                          : isLow
                          ? 'text-amber-300'
                          : 'text-emerald-400'
                      }
                    >
                      {p.stockQuantity}
                    </span>
                  </td>

                  {/* Stock State Badge */}
                  <td className="py-3 px-4">
                    {isOut ? (
                      <span className="text-[10px] uppercase font-bold text-red-400 bg-red-950/60 border border-red-800 px-2 py-0.5 inline-flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Rupture
                      </span>
                    ) : isLow ? (
                      <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-950/60 border border-amber-800 px-2 py-0.5 inline-flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Critique (≤ {p.lowStockThreshold})
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Normal
                      </span>
                    )}
                  </td>

                  {/* Quick +1 / -1 Buttons */}
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex items-center gap-1 bg-[#11110F] border border-white/10 p-0.5">
                      <button
                        onClick={() => onAdjustStock(p.id, -1, false, 'Sortie unitaire en magasin', 'vente')}
                        disabled={p.stockQuantity <= 0}
                        title="Retirer 1 exemplaire"
                        className="w-7 h-7 flex items-center justify-center text-[#9F9A8E] hover:text-white hover:bg-white/10 disabled:opacity-30"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onAdjustStock(p.id, 1, false, 'Entrée unitaire réassort', 'reassort')}
                        title="Ajouter 1 exemplaire"
                        className="w-7 h-7 flex items-center justify-center text-[#C6A53A] hover:bg-[#C6A53A]/20"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* Full Adjustment Modal trigger */}
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleOpenAdjustModal(p)}
                      className="px-2.5 py-1.5 bg-[#11110F] hover:bg-[#29271F] border border-white/10 text-xs text-[#E8E5DD] hover:text-[#C6A53A] inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Ajuster</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Stock History Audit Log Table */}
      <div className="bg-[#1B1A15] border border-white/5 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#C6A53A]">
            <History className="w-4 h-4" />
            <h2 className="font-serif-luxury text-lg text-white font-medium">
              Journal d'Audit des Mouvements de Stock
            </h2>
          </div>
          <span className="text-[11px] text-[#9F9A8E]">Derniers événements enregistrés</span>
        </div>

        <div className="border border-white/5 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[#9F9A8E] bg-[#0E0E0C] text-[10px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Date & Heure</th>
                <th className="py-2.5 px-3">Produit</th>
                <th className="py-2.5 px-3">Mouvement</th>
                <th className="py-2.5 px-3">Évolution</th>
                <th className="py-2.5 px-3">Nouvelle Qté</th>
                <th className="py-2.5 px-3">Commentaire</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {movements.slice(0, 10).map((mov) => {
                const isPositive = mov.change > 0;
                return (
                  <tr key={mov.id} className="hover:bg-[#201F18]">
                    <td className="py-2.5 px-3 text-[#9F9A8E] text-[11px]">
                      {new Date(mov.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-2.5 px-3 font-sans text-white">
                      <strong>{mov.productName}</strong>
                      <span className="block text-[10px] text-[#9F9A8E]">{mov.productRef}</span>
                    </td>
                    <td className="py-2.5 px-3 uppercase text-[10px] font-sans">
                      <span
                        className={`px-1.5 py-0.5 rounded-xs ${
                          mov.type === 'reassort'
                            ? 'text-emerald-400 bg-emerald-950/40'
                            : mov.type === 'vente'
                            ? 'text-amber-300 bg-amber-950/40'
                            : 'text-cyan-300 bg-cyan-950/40'
                        }`}
                      >
                        {mov.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex items-center gap-0.5 ${
                          isPositive ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {isPositive ? `+${mov.change}` : mov.change}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-white">
                      {mov.newQuantity} ex.
                    </td>
                    <td className="py-2.5 px-3 font-sans text-xs text-[#9F9A8E]">
                      {mov.comment || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Stock Adjustment Modal */}
      {adjustModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#1B1A15] border border-[#C6A53A]/40 p-6 shadow-2xl">
            <h3 className="font-serif-luxury text-xl text-white mb-1">
              Ajuster le stock : {adjustModalProduct.name}
            </h3>
            <p className="text-xs text-[#C6A53A] font-mono mb-4">
              Réf : {adjustModalProduct.reference} · Quantité actuelle : {adjustModalProduct.stockQuantity} unités
            </p>

            <form onSubmit={handleApplyAdjustment} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#9F9A8E] uppercase tracking-wider mb-1 font-semibold">
                  Type d'opération
                </label>
                <select
                  value={adjustmentType}
                  onChange={(e) =>
                    setAdjustmentType(
                      e.target.value as 'reassort' | 'vente' | 'ajustement' | 'retour'
                    )
                  }
                  className="w-full bg-[#11110F] border border-white/10 text-white p-2"
                >
                  <option value="reassort">Réassort fournisseur / Arrivage</option>
                  <option value="vente">Vente boutique ou réservation WhatsApp</option>
                  <option value="ajustement">Ajustement inventaire physique</option>
                  <option value="retour">Retour client / Échange</option>
                </select>
              </div>

              <div>
                <label className="block text-[#9F9A8E] uppercase tracking-wider mb-1 font-semibold">
                  Nouvelle quantité absolue
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newQuantityValue}
                  onChange={(e) => setNewQuantityValue(Number(e.target.value))}
                  className="w-full bg-[#11110F] border border-white/10 font-mono text-base text-white p-2.5 outline-none focus:border-[#C6A53A]"
                />
              </div>

              <div>
                <label className="block text-[#9F9A8E] uppercase tracking-wider mb-1 font-semibold">
                  Motif ou Commentaire d'audit
                </label>
                <input
                  type="text"
                  placeholder="Ex: Facture BL #4920, inventaire mensuel..."
                  value={adjustmentComment}
                  onChange={(e) => setAdjustmentComment(e.target.value)}
                  className="w-full bg-[#11110F] border border-white/10 text-white p-2 outline-none focus:border-[#C6A53A]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAdjustModalProduct(null)}
                  className="px-4 py-2 border border-white/10 text-[#9F9A8E] hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C6A53A] hover:bg-[#E3C866] text-[#11110F] font-bold uppercase tracking-wider"
                >
                  Valider le mouvement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
