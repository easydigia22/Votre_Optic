import React from 'react';
import { StoreSettings } from '../types';
import { ShieldCheck, Award, Sparkles, Clock, MapPin, MessageCircle } from 'lucide-react';

interface AboutPageProps {
  settings: StoreSettings;
  onNavigate: (view: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings, onNavigate }) => {
  const cleanNumber = settings.whatsapp.replace(/[^0-9]/g, '') || '212770420663';

  return (
    <div className="min-h-screen bg-[#11110F] text-[#FFFDF7] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero About */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#C6A53A] font-semibold">
            Maison de Haute Optique · Maroc
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl text-white font-medium mt-2 mb-6">
            Votre Vision, Notre Passion
          </h1>
          <p className="text-sm sm:text-base text-[#D5D1C4] leading-relaxed font-light">
            « Votre optique, votre Élégance entre nos mains » n’est pas seulement notre devise, c’est
            l'engagement quotidien d’une équipe passionnée par l'art lunetier et la santé visuelle à
            Casablanca.
          </p>
        </div>

        {/* Narrative Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 border-b border-white/10 pb-16">
          <div className="relative aspect-[4/3] bg-[#1B1A15] overflow-hidden border border-[#C6A53A]/30">
            <img
              src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80"
              alt="Atelier Optique Casablanca"
              className="w-full h-full object-cover filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#11110F]/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#11110F]/90 border border-[#C6A53A]/30 backdrop-blur-sm">
              <span className="text-[11px] font-mono text-[#C6A53A] uppercase tracking-wider block">
                Atelier & Précision
              </span>
              <p className="text-xs text-white mt-1">
                Taillage numérique de verres et ajustement morphologique sur mesure.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="font-serif-luxury text-3xl text-white font-medium">
              L’alliance rare de l’expertise médicale et de l’élégance intemporelle
            </h2>
            <p className="text-xs sm:text-sm text-[#9F9A8E] leading-relaxed">
              Fondée avec la volonté d’élever l’expérience optique au Maroc, <strong>Votre Optique</strong>{' '}
              sélectionne méticuleusement chaque monture auprès des manufactures les plus réputées du monde :
              de l'acétate façonné à la main en Italie au titane pur forgé à Sabae au Japon.
            </p>
            <p className="text-xs sm:text-sm text-[#9F9A8E] leading-relaxed">
              Nos opticiens diplômés réalisent des examens de réfraction approfondis avec des équipements
              de dernière génération, vous garantissant un confort visuel optimal sans compromis sur votre style.
            </p>

            <div className="pt-4 grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#1B1A15] border border-white/5">
                <span className="font-mono text-2xl font-bold text-[#C6A53A] block mb-1">100%</span>
                <span className="text-white font-medium block">Origine Certifiée</span>
                <span className="text-[11px] text-[#9F9A8E]">Montures officielles avec certificats d'authenticité</span>
              </div>
              <div className="p-4 bg-[#1B1A15] border border-white/5">
                <span className="font-mono text-2xl font-bold text-[#C6A53A] block mb-1">+500</span>
                <span className="text-white font-medium block">Clients Fidèles</span>
                <span className="text-[11px] text-[#9F9A8E]">À travers tout le Royaume du Maroc</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-[#1B1A15] border border-white/5 p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#11110F] border border-[#C6A53A]/40 text-[#C6A53A] flex items-center justify-center mx-auto">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif-luxury text-xl text-white">Conseil Visagisme</h3>
            <p className="text-xs text-[#9F9A8E] leading-relaxed">
              Analyse de la morphologie de votre visage, des contrastes de teint et de vos habitudes
              visuelles pour trouver la monture qui vous magnifie.
            </p>
          </div>

          <div className="bg-[#1B1A15] border border-white/5 p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#11110F] border border-[#C6A53A]/40 text-[#C6A53A] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif-luxury text-xl text-white">Verres Haute Précision</h3>
            <p className="text-xs text-[#9F9A8E] leading-relaxed">
              Partenariat avec les meilleurs verriers mondiaux pour des traitements anti-reflets
              diamants, filtres anti-lumière bleue et verres progressifs individualisés.
            </p>
          </div>

          <div className="bg-[#1B1A15] border border-white/5 p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#11110F] border border-[#C6A53A]/40 text-[#C6A53A] flex items-center justify-center mx-auto">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-serif-luxury text-xl text-white">Garantie Adaptation</h3>
            <p className="text-xs text-[#9F9A8E] leading-relaxed">
              Votre confort est primordial. Nous garantissons l'adaptation à vos nouveaux verres et
              assurons le réglage gratuit à vie de votre monture.
            </p>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="bg-[#1B1A15] border border-[#C6A53A]/30 p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-6">
          <h3 className="font-serif-luxury text-3xl text-white">
            Venez essayer vos futures lunettes à Casablanca
          </h3>
          <p className="text-xs sm:text-sm text-[#9F9A8E] max-w-xl mx-auto">
            {settings.address}, {settings.city} · Du Lundi au Samedi de 09h30 à 20h00
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('catalogue')}
              className="px-6 py-3 bg-[#C6A53A] hover:bg-[#E3C866] text-[#11110F] font-bold text-xs uppercase tracking-wider"
            >
              Découvrir le catalogue
            </button>
            <a
              href={`https://wa.me/${cleanNumber}?text=${encodeURIComponent(
                'Bonjour Votre Optique, je souhaite convenir d’un créneau pour un essayage de lunettes.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#11110F] border border-[#C6A53A]/40 text-[#F5E6A6] font-semibold text-xs uppercase tracking-wider flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#C6A53A]" />
              <span>Prendre RDV sur WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
