import React, { useState } from 'react';
import { Product, Brand } from '../types';
import { MessageCircle, Eye, Sparkles, Heart, Star } from 'lucide-react';
import { storage } from '../services/storage';

interface ProductCardProps {
  product: Product;
  brand?: Brand;
  onSelectProduct: (product: Product) => void;
  whatsappNumber: string;
  isInWishlist?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  brand,
  onSelectProduct,
  whatsappNumber,
  isInWishlist = false,
  onToggleWishlist,
}) => {
  const [imageError, setImageError] = useState(false);
  const brandName = brand?.name || 'Maison Optique';
  const ratingSummary = storage.getProductRatingSummary(product.id);

  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '') || '212770420663';
  const whatsappMessage = `Bonjour, je suis intéressé(e) par la monture ${product.name}, référence ${product.reference}. Est-elle disponible ?`;
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= product.lowStockThreshold;
  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <div className="group relative flex flex-col bg-[#151515] border border-white/5 hover:border-[#D6AE62]/40 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-0.5">
      {/* Visual Image Showcase */}
      <div
        onClick={() => onSelectProduct(product)}
        className="relative w-full aspect-[4/3] bg-[#111111] overflow-hidden cursor-pointer flex items-center justify-center p-4"
      >
        {/* Wishlist Button (Top Right) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleWishlist) {
              onToggleWishlist(product);
            } else {
              storage.toggleWishlist(product.id);
            }
          }}
          title={isInWishlist ? 'Retirer des favoris' : 'Ajouter à la liste de souhaits'}
          className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            isInWishlist
              ? 'bg-[#0B0B0B] text-[#D6AE62] border border-[#D6AE62]'
              : 'bg-[#0B0B0B]/70 hover:bg-[#0B0B0B] text-white/70 hover:text-[#D6AE62] border border-white/10'
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isInWishlist ? 'fill-current text-[#D6AE62]' : ''
            }`}
          />
        </button>

        {/* Badges / Indicators */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
          {product.inPromo && (
            <span className="bg-[#D6AE62] text-[#0B0B0B] text-[10px] font-bold tracking-widest uppercase px-2 py-0.5">
              PROMO {product.discountPercentage ? `-${product.discountPercentage}%` : ''}
            </span>
          )}
          {product.isNew && !product.inPromo && (
            <span className="bg-[#1E1E1E] border border-[#D6AE62]/50 text-[#F0D8A5] text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#D6AE62]" />
              NOUVEAU
            </span>
          )}
        </div>

        {/* Stock status indicator */}
        <div className="absolute bottom-3 left-3 z-10">
          {isOutOfStock ? (
            <span className="text-[10px] font-medium text-red-400 bg-red-950/70 border border-red-800/50 px-2 py-0.5">
              Rupture
            </span>
          ) : isLowStock ? (
            <span className="text-[10px] font-medium text-amber-300 bg-amber-950/70 border border-amber-700/50 px-2 py-0.5">
              Plus que {product.stockQuantity} ex.
            </span>
          ) : null}
        </div>

        {/* Image or fallback */}
        {!imageError && product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          /* Graceful Luxury SVG Optical Eyewear Fallback */
          <div className="w-full h-full flex flex-col items-center justify-center text-[#D6AE62]/60 p-4">
            <svg
              className="w-24 h-16 transform group-hover:scale-105 transition-transform duration-300"
              viewBox="0 0 120 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <ellipse cx="35" cy="30" rx="22" ry="18" />
              <ellipse cx="85" cy="30" rx="22" ry="18" />
              <path d="M57 30 Q 60 25 63 30" />
              <path d="M13 28 L 3 24" />
              <path d="M107 28 L 117 24" />
            </svg>
            <span className="text-[11px] font-serif-luxury italic text-[#A6A6A6] mt-2">
              {product.material || "Haute Lunetterie"}
            </span>
          </div>
        )}

        {/* Hover Quick Look Overlay */}
        <div className="absolute inset-0 bg-[#0B0B0B]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="px-3 py-1.5 bg-[#0B0B0B]/90 border border-[#D6AE62] text-[#F0D8A5] text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            Aperçu rapide
          </span>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-4 flex flex-col flex-grow justify-between border-t border-white/5">
        <div>
          {/* Brand & Reference */}
          <div className="flex items-center justify-between text-xs text-[#A6A6A6] mb-1">
            <span className="uppercase tracking-widest text-[#D6AE62] font-semibold text-[11px]">
              {brandName}
            </span>
            <div className="flex items-center gap-1.5">
              {ratingSummary.count > 0 && (
                <span className="flex items-center gap-0.5 text-[#E8C987] font-mono text-[10px]">
                  <Star className="w-3 h-3 fill-current text-[#D6AE62]" />
                  <span>{ratingSummary.average.toFixed(1)}</span>
                  <span className="text-[#A6A6A6]">({ratingSummary.count})</span>
                </span>
              )}
              <span className="font-mono text-[10px] text-[#A6A6A6]/80">{product.reference}</span>
            </div>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="text-sm font-semibold text-[#F8F5EF] hover:text-[#D6AE62] transition-colors line-clamp-1 cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Frame Type & Material quiet line */}
          <p className="text-[11px] text-[#A6A6A6] mt-1 line-clamp-1">
            {product.frameType} · {product.material}
          </p>

          {/* Price display with Dirhams (MAD / DH) */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono font-bold text-base text-[#F0D8A5] tabular-nums">
              {product.price.toLocaleString('fr-FR')} <span className="text-xs font-normal">DH</span>
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="font-mono text-xs text-[#A6A6A6] line-through tabular-nums">
                {product.oldPrice.toLocaleString('fr-FR')} DH
              </span>
            )}
          </div>
        </div>

        {/* Dual Actions: Voir le modèle & Demander sur WhatsApp */}
        <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-2 gap-2">
          <button
            onClick={() => onSelectProduct(product)}
            className="w-full py-2 px-2 text-center text-xs font-medium border border-white/10 hover:border-[#D6AE62] text-[#F8F5EF] hover:text-[#D6AE62] transition-colors"
          >
            Voir le modèle
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Discuter sur WhatsApp"
            className="w-full py-2 px-2 text-center text-xs font-semibold bg-[#D6AE62] hover:bg-[#E8C987] text-[#0B0B0B] transition-colors flex items-center justify-center gap-1.5"
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
