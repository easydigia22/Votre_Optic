import React from 'react';
import { Promotion, StoreSettings } from '../types';
import { Tag, Calendar, ArrowRight, MessageCircle, Sparkles } from 'lucide-react';

interface PromotionsPageProps {
  promotions: Promotion[];
  settings: StoreSettings;
  onNavigate: (view: string, param?: Record<string, string>) => void;
}

export const PromotionsPage: React.FC<PromotionsPageProps> = ({
  promotions,
  settings,
  onNavigate,
}) => {
  const activePromos = promotions.filter((p) => p.isActive);
  const cleanNumber = settings.whatsapp.replace(/[^0-9]/g, '') || '212770420663';

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F8F5EF] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#151515] border border-[#D6AE62]/30 text-[#E8C987] text-xs font-serif-luxury italic tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#D6AE62]" />
            <span>Privilèges & Offres Spéciales</span>
          </div>

          <h1 className="font-serif-luxury text-4xl sm:text-5xl text-white font-medium mb-4">
            Nos Offres Exclusives
          </h1>

          <p className="text-sm text-[#A6A6A6] leading-relaxed">
            Profitez d'avantages uniques sur nos collections de montures de marques, vos verres
            correcteurs de haute technologie et des bilans de santé visuelle offerts à Casablanca.
          </p>
        </div>

        {/* Promotions List */}
        {activePromos.length > 0 ? (
          <div className="space-y-8">
            {activePromos.map((promo) => {
              const isExternal = promo.ctaLink.startsWith('http');
              const endFormatted = new Date(promo.endDate).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              });

              return (
                <div
                  key={promo.id}
                  className="bg-[#151515] border border-white/10 hover:border-[#D6AE62]/40 transition-all duration-300 overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-xl"
                >
                  {/* Left: Banner Image (lg:col-span-5) */}
                  <div className="lg:col-span-5 relative min-h-[260px] bg-[#111111] overflow-hidden">
                    <img
                      src={promo.bannerUrl}
                      alt={promo.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-transparent lg:hidden" />
                    {promo.discountPercentage > 0 && (
                      <div className="absolute top-4 left-4 bg-[#D6AE62] text-[#0B0B0B] font-bold text-xs uppercase tracking-widest px-3 py-1">
                        Jusqu'à -{promo.discountPercentage}%
                      </div>
                    )}
                  </div>

                  {/* Right: Details & Call To Action (lg:col-span-7) */}
                  <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#A6A6A6] mb-3">
                        {promo.code && (
                          <span className="font-mono text-xs text-[#F0D8A5] bg-[#0B0B0B] border border-[#D6AE62]/40 px-2.5 py-0.5 flex items-center gap-1.5">
                            <Tag className="w-3 h-3 text-[#D6AE62]" />
                            Code : <strong>{promo.code}</strong>
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#D6AE62]" />
                          Valable jusqu'au {endFormatted}
                        </span>
                      </div>

                      <h2 className="font-serif-luxury text-2xl sm:text-3xl text-white font-medium mb-3">
                        {promo.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-[#CCCCCC] leading-relaxed mb-6">
                        {promo.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex flex-wrap items-center gap-4">
                      {isExternal ? (
                        <a
                          href={promo.ctaLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-[#D6AE62] hover:bg-[#E8C987] text-[#0B0B0B] font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>{promo.ctaText || 'Demander sur WhatsApp'}</span>
                        </a>
                      ) : (
                        <button
                          onClick={() => onNavigate('catalogue')}
                          className="px-6 py-3 bg-[#D6AE62] hover:bg-[#E8C987] text-[#0B0B0B] font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
                        >
                          <span>{promo.ctaText || 'Profiter de l’offre'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}

                      <a
                        href={`https://wa.me/${cleanNumber}?text=${encodeURIComponent(
                          `Bonjour Votre Optique, je souhaite des précisions sur l'offre : "${promo.title}".`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-3 border border-white/10 hover:border-[#D6AE62] text-xs text-[#A6A6A6] hover:text-white transition-colors flex items-center gap-2"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-[#D6AE62]" />
                        <span>Renseignements immédiats</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#151515] border border-white/5 p-8">
            <Tag className="w-12 h-12 text-[#D6AE62]/40 mx-auto mb-4" />
            <h3 className="font-serif-luxury text-2xl text-white mb-2">
              Toutes nos offres du moment ont été attribuées
            </h3>
            <p className="text-xs text-[#A6A6A6] max-w-md mx-auto mb-6">
              Contactez directement notre magasin à Casablanca sur WhatsApp pour connaître les
              offres d'accueil et privilèges clients du jour.
            </p>
            <a
              href={`https://wa.me/${cleanNumber}?text=${encodeURIComponent(
                'Bonjour Votre Optique, avez-vous des offres promotionnelles disponibles actuellement ?'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#D6AE62] text-[#0B0B0B] text-xs font-bold uppercase tracking-wider"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contacter l'équipe WhatsApp</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
