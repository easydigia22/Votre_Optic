import React from 'react';
import { Product, Brand, StoreSettings } from '../types';
import { Heart, Trash2, MessageCircle, ArrowRight, Glasses, Eye, Sparkles } from 'lucide-react';

interface WishlistPageProps {
  wishlistIds: string[];
  products: Product[];
  brands: Brand[];
  settings: StoreSettings;
  onRemoveFromWishlist: (productId: string) => void;
  onClearWishlist: () => void;
  onSelectProduct: (product: Product) => void;
  onNavigate: (view: string) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  wishlistIds,
  products,
  brands,
  settings,
  onRemoveFromWishlist,
  onClearWishlist,
  onSelectProduct,
  onNavigate,
}) => {
  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));
  const cleanPhone = settings.whatsapp.replace(/[^0-9]/g, '') || '212770420663';

  // Build grouped WhatsApp message for the entire wishlist selection
  const handleGroupInquiry = () => {
    if (wishlistedProducts.length === 0) return;
    const itemsList = wishlistedProducts
      .map((p, idx) => `${idx + 1}. ${p.name} (Réf: ${p.reference}) - ${p.price} DH`)
      .join('\n');

    const message = `Bonjour Votre Optique, j'ai sélectionné ces montures dans ma liste de souhaits :\n\n${itemsList}\n\nSont-elles disponibles pour un essayage en magasin ou une commande à Casablanca ? Merci.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#11110F] text-[#FFFDF7] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#1B1A15] border border-[#C6A53A]/30 text-[#E3C866] text-[11px] font-mono uppercase tracking-widest mb-2">
              <Heart className="w-3.5 h-3.5 text-[#C6A53A] fill-current" />
              <span>Sélection Personnelle</span>
            </div>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl text-white font-medium">
              Ma Liste de Souhaits
            </h1>
            <p className="text-xs text-[#9F9A8E] mt-1">
              Retrouvez vos montures favorites sélectionnées pour votre prochain essayage
            </p>
          </div>

          {wishlistedProducts.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleGroupInquiry}
                className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20b858] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors shadow-lg"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Demander toute la sélection ({wishlistedProducts.length})</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('Voulez-vous vider l’ensemble de votre liste de souhaits ?')) {
                    onClearWishlist();
                  }
                }}
                className="px-3 py-2.5 border border-white/10 hover:border-red-500 text-xs text-[#9F9A8E] hover:text-red-400 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Vider la liste</span>
              </button>
            </div>
          )}
        </div>

        {/* Wishlist Items or Empty State */}
        {wishlistedProducts.length === 0 ? (
          <div className="bg-[#1B1A15] border border-white/5 p-12 sm:p-16 text-center max-w-xl mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-[#11110F] border border-white/10 mx-auto flex items-center justify-center text-[#9F9A8E] mb-4">
              <Heart className="w-8 h-8 text-[#C6A53A]/40" />
            </div>
            <h2 className="font-serif-luxury text-2xl text-white font-medium mb-2">
              Votre liste de souhaits est vide
            </h2>
            <p className="text-xs text-[#9F9A8E] leading-relaxed mb-6">
              Parcourez nos collections solaires et optiques, et cliquez sur le cœur pour sauvegarder vos modèles favoris.
            </p>
            <button
              onClick={() => onNavigate('catalogue')}
              className="px-6 py-3 bg-[#C6A53A] hover:bg-[#E3C866] text-[#11110F] font-bold text-xs uppercase tracking-widest inline-flex items-center gap-2 transition-colors shadow-md"
            >
              <Glasses className="w-4 h-4" />
              <span>Explorer le catalogue</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistedProducts.map((product) => {
                const brand = brands.find((b) => b.id === product.brandId);
                const isOutOfStock = product.stockQuantity <= 0;
                const whatsappItemUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  `Bonjour, je suis intéressé(e) par la monture ${product.name} (Réf: ${product.reference}) de ma liste de souhaits au prix de ${product.price} DH. Est-elle disponible ?`
                )}`;

                return (
                  <div
                    key={product.id}
                    className="bg-[#1B1A15] border border-white/5 hover:border-[#C6A53A]/40 flex flex-col justify-between transition-all duration-300 group"
                  >
                    {/* Visual */}
                    <div className="relative aspect-4/3 bg-[#11110F] p-4 flex items-center justify-center overflow-hidden">
                      {product.images && product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-contain filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <Glasses className="w-12 h-12 text-[#9F9A8E]" />
                      )}

                      {/* Remove from wishlist button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFromWishlist(product.id);
                        }}
                        title="Retirer de la liste"
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#11110F]/80 hover:bg-red-950 text-red-400 hover:text-red-300 border border-white/10 hover:border-red-600 flex items-center justify-center transition-colors shadow-md"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>

                      {/* Stock badge */}
                      <div className="absolute bottom-3 left-3">
                        {isOutOfStock ? (
                          <span className="text-[10px] font-mono uppercase bg-red-950/90 text-red-300 border border-red-800 px-2 py-0.5">
                            Rupture temporaire
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono uppercase bg-emerald-950/90 text-emerald-300 border border-emerald-800 px-2 py-0.5">
                            En stock ({product.stockQuantity})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content info */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-[#C6A53A] font-semibold tracking-wider uppercase">
                            {brand?.name || 'Maison de Haute Optique'}
                          </span>
                          <span className="font-mono text-[#9F9A8E]">{product.reference}</span>
                        </div>

                        <h3
                          onClick={() => onSelectProduct(product)}
                          className="font-serif-luxury text-lg text-white font-medium hover:text-[#C6A53A] cursor-pointer transition-colors"
                        >
                          {product.name}
                        </h3>

                        <p className="text-xs text-[#9F9A8E] mt-1 line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-white/5">
                        <div className="flex items-baseline justify-between mb-3">
                          <div className="flex items-baseline gap-2">
                            <span className="font-mono text-lg font-bold text-white">
                              {product.price.toLocaleString('fr-FR')} DH
                            </span>
                            {product.oldPrice && (
                              <span className="font-mono text-xs text-[#9F9A8E] line-through">
                                {product.oldPrice.toLocaleString('fr-FR')} DH
                              </span>
                            )}
                          </div>
                          {product.inPromo && (
                            <span className="text-[10px] font-mono font-bold text-[#C6A53A] bg-[#11110F] px-1.5 py-0.5 border border-[#C6A53A]/30">
                              -{product.discountPercentage}%
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => onSelectProduct(product)}
                            className="py-2 bg-[#11110F] hover:bg-[#201F18] border border-white/10 text-white hover:text-[#C6A53A] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Détails</span>
                          </button>

                          <a
                            href={whatsappItemUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2 bg-[#C6A53A] hover:bg-[#E3C866] text-[#11110F] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Commander</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom info banner */}
            <div className="mt-10 p-6 bg-[#15140F] border border-[#C6A53A]/20 text-xs text-[#9F9A8E] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#C6A53A] shrink-0" />
                <span>
                  Besoin d'un conseil personnalisé sur votre morphologie ou le choix des verres ? Nos opticiens diplômés vous répondent directement sur WhatsApp au <strong className="text-white">{settings.whatsapp}</strong>.
                </span>
              </div>
              <button
                onClick={() => onNavigate('contact')}
                className="text-xs uppercase font-semibold text-[#C6A53A] hover:underline shrink-0"
              >
                Prendre rendez-vous en boutique →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
