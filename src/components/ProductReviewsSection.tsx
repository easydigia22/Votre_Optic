import React, { useState } from 'react';
import { Product, ProductReview } from '../types';
import { storage } from '../services/storage';
import { isSupabaseConfigured, submitProductReview } from '../services/supabase';
import { Star, ShieldCheck, CheckCircle2, MessageSquare, Send, Award, Clock } from 'lucide-react';

interface ProductReviewsSectionProps {
  product: Product;
  onReviewSubmitted?: () => void;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  product,
  onReviewSubmitted,
}) => {
  const [reviews, setReviews] = useState<ProductReview[]>(() =>
    storage.getProductReviews(product.id, true)
  );
  const ratingSummary = storage.getProductRatingSummary(product.id);

  // Review Form State
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [authorName, setAuthorName] = useState('');
  const [city, setCity] = useState('Casablanca');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [verifiedPurchase, setVerifiedPurchase] = useState(true);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Calculate rating breakdown
  const starCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.max(1, Math.min(5, Math.round(r.rating)));
    starCounts[star] = (starCounts[star] || 0) + 1;
  });

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    const review = {
      productId: product.id,
      productName: product.name,
      productRef: product.reference,
      authorName: authorName.trim(),
      city: city.trim() || 'Casablanca',
      rating,
      title: title.trim() || 'Avis sur ' + product.name,
      comment: comment.trim(),
      verifiedPurchase,
    };
    storage.addReview(review);

    if (isSupabaseConfigured) {
      try {
        await submitProductReview(review);
      } catch (error) {
        console.error('Supabase review submission failed; saved locally.', error);
      }
    }

    setSubmittedSuccess(true);
    setAuthorName('');
    setTitle('');
    setComment('');
    setShowForm(false);
    onReviewSubmitted?.();
  };

  return (
    <div className="pt-8 mt-8 border-t border-white/10 space-y-8">
      {/* Header & Overall Rating Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#D6AE62]">
            Retours d'expérience
          </span>
          <h3 className="font-serif-luxury text-2xl text-white font-medium mt-0.5">
            Avis Clients & Évaluations
          </h3>
        </div>

        <button
          onClick={() => {
            setShowForm(!showForm);
            setSubmittedSuccess(false);
          }}
          className="px-4 py-2.5 bg-[#D6AE62] hover:bg-[#E8C987] text-[#0B0B0B] font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{showForm ? 'Masquer le formulaire' : 'Rédiger un avis'}</span>
        </button>
      </div>

      {/* Success alert message after submission */}
      {submittedSuccess && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-start gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-white font-semibold">Merci pour votre évaluation !</strong>
            <span>
              Votre avis a été enregistré avec succès et sera publié dès validation par notre responsable qualité.
            </span>
          </div>
        </div>
      )}

      {/* Rating Breakdown Card */}
      <div className="bg-[#101010] border border-white/5 p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left score (col-span-5) */}
        <div className="md:col-span-5 text-center md:text-left border-b md:border-b-0 md:border-r border-white/5 pb-4 md:pb-0 md:pr-6">
          <div className="flex items-baseline justify-center md:justify-start gap-2">
            <span className="font-mono text-5xl font-bold text-white tabular-nums">
              {ratingSummary.count > 0 ? ratingSummary.average.toFixed(1) : '5.0'}
            </span>
            <span className="text-sm font-mono text-[#A6A6A6]">/ 5</span>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-1 text-[#D6AE62] my-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${
                  s <= Math.round(ratingSummary.average) ? 'fill-current' : 'opacity-30'
                }`}
              />
            ))}
          </div>

          <p className="text-xs text-[#A6A6A6]">
            Basé sur {reviews.length} avis certifié{reviews.length > 1 ? 's' : ''} en boutique
          </p>
        </div>

        {/* Right breakdown bars (col-span-7) */}
        <div className="md:col-span-7 space-y-1.5 text-xs">
          {[5, 4, 3, 2, 1].map((s) => {
            const count = starCounts[s] || 0;
            const percentage = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : s === 5 ? 100 : 0;
            return (
              <div key={s} className="flex items-center gap-3">
                <span className="w-12 font-mono text-[#A6A6A6] text-right flex items-center justify-end gap-1">
                  <span>{s}</span>
                  <Star className="w-3 h-3 text-[#D6AE62] fill-current" />
                </span>
                <div className="flex-1 h-2 bg-[#1A1A1A] overflow-hidden">
                  <div
                    className="h-full bg-[#D6AE62] transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 font-mono text-[#A6A6A6] text-right text-[11px]">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Submission Form Drawer */}
      {showForm && (
        <form
          onSubmit={handleSubmitReview}
          className="bg-[#151515] border border-[#D6AE62]/40 p-6 sm:p-8 space-y-4 text-xs animate-in fade-in duration-300"
        >
          <h4 className="font-serif-luxury text-xl text-white font-medium mb-1">
            Partagez votre expérience sur {product.name}
          </h4>
          <p className="text-[#A6A6A6] text-[11px] mb-4">
            Votre évaluation aide les autres clients de Casablanca et du Maroc à choisir leur monture.
          </p>

          {/* Star selector */}
          <div>
            <label className="block text-[#A6A6A6] uppercase tracking-wider mb-1.5 font-semibold">
              Votre note globale *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((starValue) => {
                const active = (hoverRating || rating) >= starValue;
                return (
                  <button
                    key={starValue}
                    type="button"
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(starValue)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        active ? 'text-[#D6AE62] fill-current' : 'text-neutral-600'
                      }`}
                    />
                  </button>
                );
              })}
              <span className="font-mono text-[#E8C987] font-bold text-sm ml-2">
                {hoverRating || rating} / 5
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#A6A6A6] uppercase tracking-wider mb-1 font-semibold">
                Votre Nom ou Prénom *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Yassine E."
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full bg-[#0B0B0B] border border-white/10 text-white p-2.5 outline-none focus:border-[#D6AE62]"
              />
            </div>

            <div>
              <label className="block text-[#A6A6A6] uppercase tracking-wider mb-1 font-semibold">
                Ville au Maroc
              </label>
              <input
                type="text"
                placeholder="Ex: Casablanca, Rabat, Marrakech..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#0B0B0B] border border-white/10 text-white p-2.5 outline-none focus:border-[#D6AE62]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#A6A6A6] uppercase tracking-wider mb-1 font-semibold">
              Titre de l'avis
            </label>
            <input
              type="text"
              placeholder="Ex: Confort exceptionnel et design somptueux"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0B0B0B] border border-white/10 text-white p-2.5 outline-none focus:border-[#D6AE62]"
            />
          </div>

          <div>
            <label className="block text-[#A6A6A6] uppercase tracking-wider mb-1 font-semibold">
              Votre commentaire détaillé *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Décrivez le confort, la tenue sur le nez, la clarté des verres ou l'accueil en boutique..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-[#0B0B0B] border border-white/10 text-white p-2.5 outline-none focus:border-[#D6AE62]"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-[#CCCCCC]">
              <input
                type="checkbox"
                checked={verifiedPurchase}
                onChange={(e) => setVerifiedPurchase(e.target.checked)}
                className="accent-[#D6AE62]"
              />
              <span>J'ai essayé ou acheté cette monture chez Votre Optique</span>
            </label>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#D6AE62] hover:bg-[#E8C987] text-[#0B0B0B] font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publier mon avis</span>
            </button>
          </div>
        </form>
      )}

      {/* Approved Reviews List */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 bg-[#121212] border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-white">{rev.authorName}</span>
                  {rev.city && (
                    <span className="text-[11px] text-[#A6A6A6]">· {rev.city}</span>
                  )}
                  {rev.verifiedPurchase && (
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Avis Vérifié
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[#A6A6A6] text-[11px]">
                  <div className="flex items-center gap-0.5 text-[#D6AE62]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? 'fill-current' : 'opacity-20'
                        }`}
                      />
                    ))}
                  </div>
                  <span>
                    {new Date(rev.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {rev.title && (
                <h5 className="font-semibold text-xs text-[#F0D8A5] mb-1">
                  {rev.title}
                </h5>
              )}

              <p className="text-xs text-[#CCCCCC] leading-relaxed">
                {rev.comment}
              </p>
            </div>
          ))
        ) : (
          <div className="p-8 text-center bg-[#121212] border border-white/5 text-xs text-[#A6A6A6]">
            Soyez le premier à donner votre avis sur cette monture d'exception.
          </div>
        )}
      </div>
    </div>
  );
};
