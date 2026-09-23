import React, { useState } from 'react';
import { ProductReview, ReviewStatus } from '../types';
import {
  Star,
  ShieldCheck,
  Check,
  X,
  Trash2,
  AlertCircle,
  Filter,
  CheckCircle2,
  Glasses,
  Search,
} from 'lucide-react';

interface AdminReviewsProps {
  reviews: ProductReview[];
  onUpdateStatus: (id: string, status: ReviewStatus) => void;
  onDeleteReview: (id: string) => void;
}

export const AdminReviews: React.FC<AdminReviewsProps> = ({
  reviews,
  onUpdateStatus,
  onDeleteReview,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;
  const approvedCount = reviews.filter((r) => r.status === 'approved').length;
  const totalCount = reviews.length;

  // Global store average rating calculation
  const approvedReviews = reviews.filter((r) => r.status === 'approved');
  const globalAverage =
    approvedReviews.length > 0
      ? (
          approvedReviews.reduce((acc, r) => acc + r.rating, 0) / approvedReviews.length
        ).toFixed(1)
      : '5.0';

  const filteredReviews = reviews.filter((r) => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.authorName.toLowerCase().includes(q) ||
        r.productName.toLowerCase().includes(q) ||
        r.productRef.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#C6A53A]">
            E-Réputation & Confiance
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl text-white font-medium mt-1">
            Modération des Avis & Notations
          </h1>
          <p className="text-xs text-[#9F9A8E]">
            Validez, approuvez ou modérez les retours d'expérience déposés par les clients
          </p>
        </div>

        {pendingCount > 0 && (
          <div className="px-3.5 py-2 bg-amber-950/60 border border-amber-800 text-amber-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{pendingCount} avis en attente d'approbation</span>
          </div>
        )}
      </div>

      {/* KPI Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#1B1A15] border border-white/5 p-4">
          <span className="text-[11px] uppercase tracking-wider text-[#9F9A8E]">Total Avis</span>
          <p className="font-mono text-2xl font-bold text-white mt-1">{totalCount}</p>
        </div>

        <div className="bg-[#1B1A15] border border-amber-500/30 p-4">
          <span className="text-[11px] uppercase tracking-wider text-amber-300">En attente</span>
          <p className="font-mono text-2xl font-bold text-amber-300 mt-1">{pendingCount}</p>
        </div>

        <div className="bg-[#1B1A15] border border-emerald-500/30 p-4">
          <span className="text-[11px] uppercase tracking-wider text-emerald-300">Approuvés</span>
          <p className="font-mono text-2xl font-bold text-emerald-300 mt-1">{approvedCount}</p>
        </div>

        <div className="bg-[#1B1A15] border border-[#C6A53A]/30 p-4">
          <span className="text-[11px] uppercase tracking-wider text-[#E3C866]">Note Moyenne</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <p className="font-mono text-2xl font-bold text-[#E3C866]">{globalAverage}</p>
            <span className="text-xs text-[#9F9A8E]">/ 5.0</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#1B1A15] border border-white/5 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#C6A53A] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Rechercher par client, modèle ou mot-clé..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#11110F] border border-white/10 text-xs text-white pl-9 pr-3 py-2 outline-none focus:border-[#C6A53A]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#9F9A8E]">Statut :</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#11110F] border border-white/10 text-xs text-white px-3 py-2 outline-none focus:border-[#C6A53A]"
          >
            <option value="all">Tous les avis ({reviews.length})</option>
            <option value="pending">En attente ({pendingCount})</option>
            <option value="approved">Approuvés ({approvedCount})</option>
            <option value="rejected">Rejetés</option>
          </select>
        </div>
      </div>

      {/* Reviews Table / Card List */}
      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((rev) => {
            const isPending = rev.status === 'pending';
            const isApproved = rev.status === 'approved';

            return (
              <div
                key={rev.id}
                className={`p-6 border transition-colors ${
                  isPending
                    ? 'bg-[#181815] border-amber-500/50 shadow-md'
                    : 'bg-[#1B1A15] border-white/5'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                  {/* Left info */}
                  <div>
                    <div className="flex items-center gap-2.5">
                      <strong className="text-white text-sm font-medium">{rev.authorName}</strong>
                      {rev.city && (
                        <span className="text-xs text-[#9F9A8E]">({rev.city})</span>
                      )}
                      {rev.verifiedPurchase && (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800 px-1.5 py-0.2 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          Vérifié
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <Glasses className="w-3.5 h-3.5 text-[#C6A53A]" />
                      <span className="text-xs text-white font-semibold">{rev.productName}</span>
                      <span className="font-mono text-[11px] text-[#9F9A8E]">[{rev.productRef}]</span>
                    </div>
                  </div>

                  {/* Rating & Date & Status */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5 text-[#C6A53A]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= rev.rating ? 'fill-current' : 'opacity-20'
                          }`}
                        />
                      ))}
                    </div>

                    <span
                      className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 ${
                        isApproved
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : isPending
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-red-950 text-red-300 border border-red-800'
                      }`}
                    >
                      {isApproved ? 'Approuvé' : isPending ? 'En attente' : 'Rejeté'}
                    </span>

                    <span className="text-[10px] text-[#9F9A8E]">
                      {new Date(rev.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {/* Comment Content */}
                <div className="bg-[#11110F] border border-white/5 p-4 my-3 text-xs">
                  {rev.title && (
                    <h5 className="font-semibold text-white mb-1">{rev.title}</h5>
                  )}
                  <p className="text-[#D5D1C4] leading-relaxed">{rev.comment}</p>
                </div>

                {/* Moderation Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="text-[11px] text-[#9F9A8E]">
                    ID: <span className="font-mono">{rev.id}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isApproved && (
                      <button
                        onClick={() => onUpdateStatus(rev.id, 'approved')}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approuver & Publier</span>
                      </button>
                    )}

                    {rev.status !== 'rejected' && (
                      <button
                        onClick={() => onUpdateStatus(rev.id, 'rejected')}
                        className="px-3 py-1.5 bg-[#201F19] hover:bg-red-950/60 border border-white/10 hover:border-red-800 text-neutral-300 hover:text-red-300 text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Rejeter</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (confirm(`Supprimer définitivement l’avis de ${rev.authorName} ?`)) {
                          onDeleteReview(rev.id);
                        }
                      }}
                      title="Supprimer"
                      className="p-1.5 text-[#9F9A8E] hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-[#1B1A15] p-12 text-center text-[#9F9A8E] border border-white/5 text-xs">
            Aucun avis correspondant aux critères de recherche.
          </div>
        )}
      </div>
    </div>
  );
};
