import React from 'react';
import { Eye, ShieldCheck, Sparkles, Award, Activity, HeartHandshake } from 'lucide-react';

interface OpticalExpertiseSectionProps {
  onContactClick: () => void;
  whatsappNumber: string;
}

export const OpticalExpertiseSection: React.FC<OpticalExpertiseSectionProps> = ({
  onContactClick,
  whatsappNumber,
}) => {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '') || '212770420663';

  return (
    <section className="py-20 bg-[#11110F] text-[#FFFDF7] border-b border-white/5 relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C6A53A]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#C6A53A] font-semibold">
            Haute Précision & Santé Visuelle
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl text-white font-medium mt-1 mb-4">
            L'Excellence Optométrique à Casablanca
          </h2>
          <p className="text-xs sm:text-sm text-[#9F9A8E] leading-relaxed">
            Plus qu'un accessoire d'élégance, vos lunettes sont le garant de votre santé oculaire.
            Notre espace à Casablanca combine technologies de mesure numérique et savoir-faire lunetier.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-[#1B1A15] border border-white/5 p-6 space-y-3 hover:border-[#C6A53A]/40 transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#11110F] border border-[#C6A53A]/40 flex items-center justify-center text-[#C6A53A]">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="font-serif-luxury text-xl text-white font-medium">
              Contrôle de la Vue
            </h3>
            <p className="text-xs text-[#9F9A8E] leading-relaxed">
              Bilan réfractif complet réalisé sur place avec du matériel optométrique de pointe.
            </p>
          </div>

          <div className="bg-[#1B1A15] border border-white/5 p-6 space-y-3 hover:border-[#C6A53A]/40 transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#11110F] border border-[#C6A53A]/40 flex items-center justify-center text-[#C6A53A]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif-luxury text-xl text-white font-medium">
              Verres Haute Définition
            </h3>
            <p className="text-xs text-[#9F9A8E] leading-relaxed">
              Verres amincis, progressifs individualisés et filtres anti-lumière bleue pour écrans.
            </p>
          </div>

          <div className="bg-[#1B1A15] border border-white/5 p-6 space-y-3 hover:border-[#C6A53A]/40 transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#11110F] border border-[#C6A53A]/40 flex items-center justify-center text-[#C6A53A]">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-serif-luxury text-xl text-white font-medium">
              Centrage Morphologique
            </h3>
            <p className="text-xs text-[#9F9A8E] leading-relaxed">
              Prise de mesures 3D précise au dixième de millimètre pour une adaptation immédiate.
            </p>
          </div>

          <div className="bg-[#1B1A15] border border-white/5 p-6 space-y-3 hover:border-[#C6A53A]/40 transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#11110F] border border-[#C6A53A]/40 flex items-center justify-center text-[#C6A53A]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-serif-luxury text-xl text-white font-medium">
              Service Après-Vente à Vie
            </h3>
            <p className="text-xs text-[#9F9A8E] leading-relaxed">
              Nettoyage aux ultrasons, ajustage des branches et changement des plaquettes offerts.
            </p>
          </div>
        </div>

        {/* Banner quote inspired by reference poster */}
        <div className="bg-gradient-to-r from-[#15140F] via-[#201F18] to-[#15140F] border border-[#C6A53A]/30 p-8 sm:p-12 text-center max-w-4xl mx-auto">
          <span className="font-mono text-xs text-[#C6A53A] tracking-widest uppercase block mb-2">
            Notre Signature
          </span>
          <blockquote className="font-serif-luxury text-2xl sm:text-3xl text-white font-medium italic mb-6">
            « Votre optique, votre Élégance entre nos mains »
          </blockquote>
          <p className="text-xs sm:text-sm text-[#D5D1C4] max-w-xl mx-auto mb-6">
            Prenez rendez-vous dans notre magasin au Quartier Racine à Casablanca pour un examen
            de vue personnalisé ou l'essayage de vos montures préférées.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onContactClick}
              className="px-6 py-3 bg-[#C6A53A] hover:bg-[#E3C866] text-[#11110F] font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Planifier une visite
            </button>
            <a
              href={`https://wa.me/${cleanNumber}?text=${encodeURIComponent(
                'Bonjour, je souhaite un rendez-vous pour un examen de la vue à Casablanca.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-[#C6A53A]/40 text-[#F5E6A6] hover:bg-[#1B1A15] font-semibold text-xs uppercase tracking-wider transition-colors"
            >
              Prendre RDV sur WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
