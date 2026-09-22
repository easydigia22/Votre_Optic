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
      <div className="relative w-full max-w-5xl bg-[#121212] border border-[#D6AE62]/30 shadow-2xl z-10 overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-4 right-4 z-20 p-2 bg-[#0B0B0B]/80 text-[#A6A6A6] hover:text-white border border-white/10 hover:border-[#D6AE62] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-0 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left: Photo Gallery (lg:col-span-7) */}
            <div className="lg:col-span-7 bg-[#0B0B0B] p-6 lg:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10">
              {/* Main Stage */}
              <div className="relative w-full aspect-[4/3] flex items-center justify-center bg-[#151515]/60 overflow-hidden border border-white/5">
                {product.inPromo && (
                  <div className="absolute top-4 left-4 z-10 bg-[#D6AE62] text-[#0B0B0B] text-xs font-bold px-3 py-1 uppercase tracking-widest">
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
                  <div className="text-[#D6AE62]/50 flex flex-col items-center">
                    <Eye className="w-16 h-16 stroke-1 mb-2" />
                    <span className="text-xs uppercase tracking-widest text-[#A6A6A6]">
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
                      className={`relative w-16 h-16 shrink-0 bg-[#151515] border p-1 transition-all ${
                        selectedImageIndex === idx
                          ? 'border-[#D6AE62] shadow-md shadow-[#D6AE62]/20'
                          : 'border-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Miniature" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust Badges */}
              <div className="pt-6 mt-6 border-t border-white/5 grid grid-cols-3 gap-2 text-[11px] text-[#A6A6A6]">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#D6AE62] shrink-0" />
                  <span>100% Authentique Certifié</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#D6AE62] shrink-0" />
                  <span>Livraison partout au Maroc</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-[#D6AE62] shrink-0" />
                  <span>Ajustement & centrage offerts</span>
                </div>
              </div>
            </div>

            {/* Right: Contiguous Purchase Module & Specifications (lg:col-span-5) */}
            <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-between bg-[#151515]">
              <div className="space-y-4">
                {/* Brand & Reference */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-widest text-[#D6AE62] uppercase">
                    {brand?.name || 'Maison Optique'}
                  </span>
                  <span className="text-xs font-mono text-[#A6A6A6]">
                    Réf: {product.reference}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h2 className="text-xl lg:text-2xl font-semibold text-[#F8F5EF] leading-snug">
                    {product.name}
                  </h2>
                  {/* Rating Stars under Title */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex items-center gap-0.5 text-[#D6AE62]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= Math.round(ratingSummary.average) ? 'fill-current' : 'opacity-20'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-mono font-bold text-[#F0D8A5]">
                      {ratingSummary.average.toFixed(1)} / 5
                    </span>
                    <span className="text-[11px] text-[#A6A6A6]">
                      ({ratingSummary.count} avis certifié{ratingSummary.count > 1 ? 's' : ''})
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 pt-1 pb-2 border-b border-white/10">
                  <span className="font-mono text-2xl font-bold text-[#F0D8A5] tabular-nums">
                    {product.price.toLocaleString('fr-FR')}{' '}
                    <span className="text-sm font-normal text-[#E8C987]">DH</span>
                  </span>
                  {product.oldPrice && product.oldPrice > product.price && (
                    <span className="font-mono text-sm text-[#A6A6A6] line-through tabular-nums">
                      {product.oldPrice.toLocaleString('fr-FR')} DH
                    </span>
                  )}
                  {product.discountPercentage && (
                    <span className="text-xs text-[#D6AE62] border border-[#D6AE62]/40 px-2 py-0.5">
                      Économisez {product.discountPercentage}%
                    </span>
                  )}
                </div>

                {/* Stock Availability */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#A6A6A6]">Disponibilité :</span>
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
                    <span className="block text-xs text-[#A6A6A6] mb-1.5">
                      Coloris disponibles : <strong className="text-white">{selectedColor}</strong>
                    </span>
                    <div className="flex items-center gap-2">
                      {product.colors.map((c) => (
                        <button
                          key={c}
                          onClick={() => setSelectedColor(c)}
                          className={`text-xs px-2.5 py-1 border transition-all ${
                            selectedColor === c
                              ? 'border-[#D6AE62] text-[#F0D8A5] bg-[#D6AE62]/10'
                              : 'border-white/10 text-[#A6A6A6] hover:text-white'
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
                  <span className="block text-xs uppercase tracking-wider text-[#A6A6A6] mb-1">
                    Description
                  </span>
                  <p className="text-xs text-[#E5E5E5] leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Characteristics Table */}
                <div className="border border-white/10 bg-[#0B0B0B]/50 p-3 text-xs space-y-2">
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-[#A6A6A6]">Forme de monture</span>
                    <span className="text-white font-medium">{product.frameType}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-[#A6A6A6]">Matériau</span>
                    <span className="text-white font-medium">{product.material}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-[#A6A6A6]">Type de verres</span>
                    <span className="text-white font-medium">{product.lensType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A6A6A6]">Genre & Catégorie</span>
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
                    className="sm:col-span-3 py-3.5 px-4 bg-[#D6AE62] hover:bg-[#E8C987] text-[#0B0B0B] font-bold text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-[#D6AE62]/20"
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
                        ? 'border-[#D6AE62] bg-[#D6AE62]/15 text-[#D6AE62]'
                        : 'border-white/15 text-white hover:border-[#D6AE62] hover:text-[#D6AE62]'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${wishlistState ? 'fill-current text-[#D6AE62]' : ''}`} />
                    <span className="sm:hidden">{wishlistState ? 'Enregistré' : 'Favori'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-[#A6A6A6] px-1">
                  <span>Numéro officiel : <strong>+212 770 420 663</strong></span>
                  <button
                    onClick={handleShare}
                    className="hover:text-[#D6AE62] flex items-center gap-1 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copiedLink ? 'Lien copié !' : 'Partager'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Full-width Product Reviews Section */}
          <div className="p-6 lg:p-8 bg-[#0E0E0E] border-t border-white/10">
            <ProductReviewsSection product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};
