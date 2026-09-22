import React from 'react';
import { MessageCircle, ArrowRight, Eye, Diamond, ShieldCheck, Sparkles } from 'lucide-react';
import { Banner, StoreSettings } from '../types';

interface HeroSectionProps {
  banner?: Banner;
  settings: StoreSettings;
  onExplore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  banner,
  settings,
  onExplore,
}) => {
  const cleanNumber = settings.whatsapp.replace(/[^0-9]/g, '') || '212770420663';
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    'Bonjour Votre Optique, je souhaite des conseils pour choisir une monture ou prendre rendez-vous.'
  )}`;

  const title = banner?.title || 'Votre optique, votre Élégance entre nos mains';
  const subtitle = banner?.subtitle || 'Des montures sélectionnées pour sublimer votre regard.';

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between bg-[#0B0B0B] text-[#F8F5EF] pt-28 pb-12 overflow-hidden border-b border-[#D6AE62]/20">
      {/* Background Ambience & Lighting */}
      <div className="absolute inset-0 z-0 opacity-40">
        {banner?.image ? (
          <img
            src={banner.image}
            alt="Votre Optique Maroc"
            className="w-full h-full object-cover object-center filter brightness-60 contrast-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-[#0B0B0B] via-[#151515] to-[#0B0B0B]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B] via-[#0B0B0B]/70 to-transparent" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow flex items-center">
        <div className="max-w-2xl">
          {/* Eyebrow / Tagline badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#151515]/90 border border-[#D6AE62]/40 text-[#E8C987] text-xs font-serif-luxury italic tracking-widest uppercase mb-6 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#D6AE62]" />
            <span>Haute Optique & Créateurs au Maroc</span>
          </div>

          {/* Main Title inspired by reference poster */}
          <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.15] mb-6">
            Votre optique, <br />
            <span className="italic text-[#D6AE62]">votre Élégance</span> <br />
            entre nos mains
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#E5E5E5] font-light max-w-xl mb-8 leading-relaxed">
            {subtitle}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onExplore}
              className="px-6 py-3.5 bg-[#D6AE62] hover:bg-[#E8C987] text-[#0B0B0B] font-bold text-xs uppercase tracking-widest transition-all duration-200 flex items-center gap-2 shadow-lg shadow-[#D6AE62]/10"
            >
              <span>Découvrir nos lunettes</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-[#151515]/90 hover:bg-[#1E1E1E] border border-[#D6AE62]/40 text-[#F0D8A5] font-semibold text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#D6AE62]" />
              <span>Nous contacter sur WhatsApp</span>
            </a>
          </div>

          {/* Value pillars from reference poster */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-12 pt-8 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#151515] border border-[#D6AE62]/40 flex items-center justify-center shrink-0">
                <Diamond className="w-4 h-4 text-[#D6AE62]" />
              </div>
              <span className="text-[#E5E5E5] font-medium leading-tight">
                Des montures de qualité
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#151515] border border-[#D6AE62]/40 flex items-center justify-center shrink-0">
                <Eye className="w-4 h-4 text-[#D6AE62]" />
              </div>
              <span className="text-[#E5E5E5] font-medium leading-tight">
                Un suivi personnalisé
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#151515] border border-[#D6AE62]/40 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-[#D6AE62]" />
              </div>
              <span className="text-[#E5E5E5] font-medium leading-tight">
                Une vision en toute confiance
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Horizontal Bar inspired by reference poster */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-10">
        <div className="bg-[#151515]/95 border border-[#D6AE62]/30 p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          {/* Quick Service Highlights */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[#A6A6A6]">
            <span className="text-[#E8C987] font-semibold tracking-wider uppercase text-[11px]">
              VOIR MIEUX · VIVRE MIEUX
            </span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span>Lunettes de vue</span>
            <span className="text-white/20">·</span>
            <span>Lunettes de soleil</span>
            <span className="text-white/20">·</span>
            <span>Lentilles de contact</span>
            <span className="text-white/20">·</span>
            <span>Contrôle de la vue</span>
          </div>

          {/* Moroccan Direct Line */}
          <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-white/10 pt-2 md:pt-0 md:pl-6">
            <span className="text-[#A6A6A6]">Service client :</span>
            <a
              href={`tel:${cleanNumber}`}
              className="font-mono font-bold text-sm text-[#F0D8A5] hover:text-white transition-colors"
            >
              +212 770 420 663
            </a>
            <span className="text-[#A6A6A6] text-[11px] uppercase tracking-wider">
              Casablanca, Maroc
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
