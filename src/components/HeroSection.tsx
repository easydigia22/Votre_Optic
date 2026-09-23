import React from 'react';
import { MessageCircle, ArrowRight, Eye, Diamond, ShieldCheck, Sparkles } from 'lucide-react';
import { Banner, StoreSettings } from '../types';
import { Logo } from './Logo';

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
    <section className="relative min-h-[92vh] flex flex-col justify-between bg-[#11110F] text-[#FFFDF7] pt-32 pb-12 overflow-hidden border-b border-[#C6A53A]/25">
      {/* Background Ambience & Lighting */}
      <div className="absolute inset-0 z-0 opacity-25">
        {banner?.image ? (
          <img
            src={banner.image}
            alt="Votre Optique Maroc"
            className="w-full h-full object-cover object-center filter brightness-60 contrast-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-[#FFFDF7] via-[#F5F0E4] to-[#FFFDF7]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFFDF7] via-[#FFFDF7]/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFFDF7] via-[#FFFDF7]/80 to-transparent" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow flex items-center">
        <div className="max-w-2xl">
          <div className="mb-7 inline-flex rounded-2xl bg-white p-2 shadow-[0_16px_45px_rgba(198,165,58,0.2)]">
            <Logo size="lg" />
          </div>

          {/* Eyebrow / Tagline badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1B1A15]/90 border border-[#C6A53A]/50 text-[#E3C866] text-xs font-serif-luxury italic tracking-widest uppercase mb-6 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#C6A53A]" />
            <span>Haute Optique & Créateurs au Maroc</span>
          </div>

          {/* Main Title inspired by reference poster */}
          <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#FFFDF7] leading-[1.15] mb-6">
            Votre optique, <br />
            <span className="italic text-[#E3C866]">votre Élégance</span> <br />
            entre nos mains
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#E8E5DD] font-light max-w-xl mb-8 leading-relaxed">
            {subtitle}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onExplore}
              className="px-6 py-3.5 bg-[#C6A53A] hover:bg-[#E3C866] text-[#11110F] font-bold text-xs uppercase tracking-widest transition-all duration-200 flex items-center gap-2 shadow-lg shadow-[#C6A53A]/20"
            >
              <span>Découvrir nos lunettes</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-[#1B1A15]/90 hover:bg-[#29271F] border border-[#C6A53A]/50 text-[#F5E6A6] font-semibold text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#C6A53A]" />
              <span>Nous contacter sur WhatsApp</span>
            </a>
          </div>

          {/* Value pillars from reference poster */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-12 pt-8 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#1B1A15] border border-[#C6A53A]/40 flex items-center justify-center shrink-0">
                <Diamond className="w-4 h-4 text-[#C6A53A]" />
              </div>
              <span className="text-[#E8E5DD] font-medium leading-tight">
                Des montures de qualité
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#1B1A15] border border-[#C6A53A]/40 flex items-center justify-center shrink-0">
                <Eye className="w-4 h-4 text-[#C6A53A]" />
              </div>
              <span className="text-[#E8E5DD] font-medium leading-tight">
                Un suivi personnalisé
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#1B1A15] border border-[#C6A53A]/40 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-[#C6A53A]" />
              </div>
              <span className="text-[#E8E5DD] font-medium leading-tight">
                Une vision en toute confiance
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Horizontal Bar inspired by reference poster */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-10">
        <div className="bg-[#1B1A15]/95 border border-[#C6A53A]/30 p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          {/* Quick Service Highlights */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[#9F9A8E]">
            <span className="text-[#E3C866] font-semibold tracking-wider uppercase text-[11px]">
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
            <span className="text-[#9F9A8E]">Service client :</span>
            <a
              href={`tel:${cleanNumber}`}
              className="font-mono font-bold text-sm text-[#F5E6A6] hover:text-white transition-colors"
            >
              +212 770 420 663
            </a>
            <span className="text-[#9F9A8E] text-[11px] uppercase tracking-wider">
              Casablanca, Maroc
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
