import React, { useState } from 'react';
import { Product, Brand, Category } from '../types';
import { storage } from '../services/storage';
import { ProductReviewsSection } from './ProductReviewsSection';
import {
  X,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Shield,
  Eye,
  Truck,
  RotateCcw,
  Share2,
  Heart,
  Star,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  brand?: Brand;
  category?: Category;
  onClose: () => void;
  whatsappNumber: string;
  isInWishlist?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  brand,
  category,
  onClose,
  whatsappNumber,
  isInWishlist = false,
  onToggleWishlist,
}) => {
  if (!product) return null;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : ''
  );
  const [copiedLink, setCopiedLink] = useState(false);
  const inWishlist = onToggleWishlist ? isInWishlist : storage.isInWishlist(product.id);
  const [wishlistState, setWishlistState] = useState(inWishlist);
  const ratingSummary = storage.getProductRatingSummary(product.id);

  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '') || '212770420663';
  const whatsappMessage = `Bonjour, je suis intéressé(e) par la monture ${product.name}, référence ${product.reference}. Est-elle disponible ?`;
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= product.lowStockThreshold;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleWishlistToggle = () => {
    if (onToggleWishlist) {
      onToggleWishlist(product);
      setWishlistState(!wishlistState);
    } else {
      const nowIn = storage.toggleWishlist(product.id);
      setWishlistState(nowIn);
    }
  };

  const images = product.images && product.images.length > 0 ? product.images : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      {/* Background click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-[#15140F] border border-[#C6A53A]/30 shadow-2xl z-10 overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-4 right-4 z-20 p-2 bg-[#11110F]/80 text-[#9F9A8E] hover:text-white border border-white/10 hover:border-[#C6A53A] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-0 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left: Photo Gallery (lg:col-span-7) */}
            <div className="lg:col-span-7 bg-[#11110F] p-6 lg:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10">
              {/* Main Stage */}
              <div className="relative w-full aspect-[4/3] flex items-center justify-center bg-[#1B1A15]/60 overflow-hidden border border-white/5">
                {product.inPromo && (
                  <div className="absolute top-4 left-4 z-10 bg-[#C6A53A] text-[#11110F] text-xs font-bold px-3 py-1 uppercase tracking-widest">
                    Promotion {product.discountPercentage ? `-${product.discountPercentage}%` : ''}
                  </div>
                )}

                {images.length > 0 ? (
                  <img
                    src={images[selectedImageIndex] || images[0]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain p-4 transform hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="text-[#C6A53A]/50 flex flex-col items-center">
                    <Eye className="w-16 h-16 stroke-1 mb-2" />
                    <span className="text-xs uppercase tracking-widest text-[#9F9A8E]">
                      Haute Lunetterie
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails if multiple */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 mt-4 overflow-x-auto py-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-16 shrink-0 bg-[#1B1A15] border p-1 transition-all ${
                        selectedImageIndex === idx
                          ? 'border-[#C6A53A] shadow-md shadow-[#C6A53A]/20'
                          : 'border-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Miniature" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust Badges */}
              <div className="pt-6 mt-6 border-t border-white/5 grid grid-cols-3 gap-2 text-[11px] text-[#9F9A8E]">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#C6A53A] shrink-0" />
                  <span>100% Authentique Certifié</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#C6A53A] shrink-0" />
                  <span>Livraison partout au Maroc</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-[#C6A53A] shrink-0" />
                  <span>Ajustement & centrage offerts</span>
                </div>
              </div>
            </div>

            {/* Right: Contiguous Purchase Module & Specifications (lg:col-span-5) */}
            <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-between bg-[#1B1A15]">
              <div className="space-y-4">
                {/* Brand & Reference */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-widest text-[#C6A53A] uppercase">
                    {brand?.name || 'Maison Optique'}
                  </span>
                  <span className="text-xs font-mono text-[#9F9A8E]">
                    Réf: {product.reference}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h2 className="text-xl lg:text-2xl font-semibold text-[#FFFDF7] leading-snug">
                    {product.name}
                  </h2>
                  {/* Rating Stars under Title */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex items-center gap-0.5 text-[#C6A53A]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= Math.round(ratingSummary.average) ? 'fill-current' : 'opacity-20'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-mono font-bold text-[#F5E6A6]">
                      {ratingSummary.average.toFixed(1)} / 5
                    </span>
                    <span className="text-[11px] text-[#9F9A8E]">
                      ({ratingSummary.count} avis certifié{ratingSummary.count > 1 ? 's' : ''})
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 pt-1 pb-2 border-b border-white/10">
                  <span className="font-mono text-2xl font-bold text-[#F5E6A6] tabular-nums">
                    {product.price.toLocaleString('fr-FR')}{' '}
                    <span className="text-sm font-normal text-[#E3C866]">DH</span>
                  </span>
                  {product.oldPrice && product.oldPrice > product.price && (
                    <span className="font-mono text-sm text-[#9F9A8E] line-through tabular-nums">
                      {product.oldPrice.toLocaleString('fr-FR')} DH
                    </span>
                  )}
                  {product.discountPercentage && (
                    <span className="text-xs text-[#C6A53A] border border-[#C6A53A]/40 px-2 py-0.5">
                      Économisez {product.discountPercentage}%
                    </span>
                  )}
                </div>

                {/* Stock Availability */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#9F9A8E]">Disponibilité :</span>
                  {isOutOfStock ? (
                    <span className="text-red-400 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Rupture momentanée (sur commande)
                    </span>
                  ) : isLowStock ? (
                    <span className="text-amber-300 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Plus que {product.stockQuantity} exemplaires disponibles
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      En stock au magasin de Casablanca
                    </span>
                  )}
                </div>

                {/* Colors */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <span className="block text-xs text-[#9F9A8E] mb-1.5">
                      Coloris disponibles : <strong className="text-white">{selectedColor}</strong>
                    </span>
                    <div className="flex items-center gap-2">
                      {product.colors.map((c) => (
                        <button
                          key={c}
                          onClick={() => setSelectedColor(c)}
                          className={`text-xs px-2.5 py-1 border transition-all ${
                            selectedColor === c
                              ? 'border-[#C6A53A] text-[#F5E6A6] bg-[#C6A53A]/10'
                              : 'border-white/10 text-[#9F9A8E] hover:text-white'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <span className="block text-xs uppercase tracking-wider text-[#9F9A8E] mb-1">
                    Description
                  </span>
                  <p className="text-xs text-[#E8E5DD] leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Characteristics Table */}
                <div className="border border-white/10 bg-[#11110F]/50 p-3 text-xs space-y-2">
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-[#9F9A8E]">Forme de monture</span>
                    <span className="text-white font-medium">{product.frameType}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-[#9F9A8E]">Matériau</span>
                    <span className="text-white font-medium">{product.material}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-[#9F9A8E]">Type de verres</span>
                    <span className="text-white font-medium">{product.lensType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9F9A8E]">Genre & Catégorie</span>
                    <span className="text-white font-medium capitalize">
                      {product.gender} · {category?.name || product.type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions: WhatsApp CTA + Wishlist Button */}
              <div className="pt-6 border-t border-white/10 space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sm:col-span-3 py-3.5 px-4 bg-[#C6A53A] hover:bg-[#E3C866] text-[#11110F] font-bold text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-[#C6A53A]/20"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Commander sur WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleWishlistToggle}
                    title={wishlistState ? 'Retirer de la liste de souhaits' : 'Ajouter à la liste de souhaits'}
                    className={`py-3.5 px-3 border transition-colors flex items-center justify-center gap-1.5 text-xs font-semibold ${
                      wishlistState
                        ? 'border-[#C6A53A] bg-[#C6A53A]/15 text-[#C6A53A]'
                        : 'border-white/15 text-white hover:border-[#C6A53A] hover:text-[#C6A53A]'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${wishlistState ? 'fill-current text-[#C6A53A]' : ''}`} />
                    <span className="sm:hidden">{wishlistState ? 'Enregistré' : 'Favori'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-[#9F9A8E] px-1">
                  <span>Numéro officiel : <strong>+212 770 420 663</strong></span>
                  <button
                    onClick={handleShare}
                    className="hover:text-[#C6A53A] flex items-center gap-1 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copiedLink ? 'Lien copié !' : 'Partager'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Full-width Product Reviews Section */}
          <div className="p-6 lg:p-8 bg-[#11110F] border-t border-white/10">
            <ProductReviewsSection product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};
