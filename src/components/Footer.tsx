import React from 'react';
import { Logo } from './Logo';
import { StoreSettings } from '../types';
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  ShieldCheck,
} from 'lucide-react';

interface FooterProps {
  settings: StoreSettings;
  onNavigate: (view: string, param?: Record<string, string>) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate }) => {
  const cleanNumber = settings.whatsapp.replace(/[^0-9]/g, '') || '212770420663';

  return (
    <footer className="bg-[#0A0A08] text-[#9F9A8E] border-t border-[#C6A53A]/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/5">
          {/* Col 1: Brand & Slogan (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <Logo size="md" showSlogan />
            <p className="text-xs text-[#9F9A8E] leading-relaxed max-w-sm pt-2">
              Boutique d'optique et de haute lunetterie au Maroc. Nous sélectionnons des
              montures d'exception pour sublimer votre regard avec des verres de précision optique.
            </p>

            <div className="pt-2 flex items-center gap-3">
              {settings.socialLinks.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-[#1B1A15] border border-white/10 text-white hover:text-[#C6A53A] hover:border-[#C6A53A] flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-[#1B1A15] border border-white/10 text-white hover:text-[#C6A53A] hover:border-[#C6A53A] flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks.whatsapp && (
                <a
                  href={`https://wa.me/${cleanNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-8 h-8 rounded-full bg-[#1B1A15] border border-[#C6A53A]/40 text-[#C6A53A] hover:bg-[#C6A53A] hover:text-[#11110F] flex items-center justify-center transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Navigation Links (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <span className="block font-semibold uppercase tracking-wider text-white text-[11px]">
              Navigation
            </span>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#C6A53A] transition-colors"
                >
                  Accueil
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalogue')}
                  className="hover:text-[#C6A53A] transition-colors"
                >
                  Toutes les Collections
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalogue', { newOnly: 'true' })}
                  className="hover:text-[#C6A53A] transition-colors"
                >
                  Nouveautés 2026
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('promotions')}
                  className="hover:text-[#C6A53A] transition-colors"
                >
                  Offres & Privilèges
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#C6A53A] transition-colors"
                >
                  L’Atelier & Expertise
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#C6A53A] transition-colors"
                >
                  Contact & Rendez-vous
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Collections / Categories (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <span className="block font-semibold uppercase tracking-wider text-white text-[11px]">
              Univers Lunetterie
            </span>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('catalogue', { gender: 'femme' })}
                  className="hover:text-[#C6A53A] transition-colors"
                >
                  Montures Femme
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalogue', { gender: 'homme' })}
                  className="hover:text-[#C6A53A] transition-colors"
                >
                  Montures Homme
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalogue', { type: 'vue' })}
                  className="hover:text-[#C6A53A] transition-colors"
                >
                  Lunettes de Vue
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalogue', { type: 'soleil' })}
                  className="hover:text-[#C6A53A] transition-colors"
                >
                  Lunettes de Soleil
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalogue', { gender: 'enfant' })}
                  className="hover:text-[#C6A53A] transition-colors"
                >
                  Collections Junior & Enfants
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalogue', { brandId: 'brand-cartier' })}
                  className="hover:text-[#C6A53A] transition-colors"
                >
                  Éditions Haute Joaillerie
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Store & Hours (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <span className="block font-semibold uppercase tracking-wider text-white text-[11px]">
              Boutique Casablanca
            </span>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C6A53A] shrink-0 mt-0.5" />
                <span className="text-white">
                  {settings.address}, {settings.city}, {settings.country}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#C6A53A] shrink-0 mt-0.5" />
                <span>{settings.hours}</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#C6A53A] shrink-0 mt-0.5" />
                <a href={`tel:${cleanNumber}`} className="font-mono text-white hover:text-[#C6A53A]">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MessageCircle className="w-4 h-4 text-[#C6A53A] shrink-0 mt-0.5" />
                <a
                  href={`https://wa.me/${cleanNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E3C866] hover:underline font-mono"
                >
                  WhatsApp: +212 770 420 663
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Admin Portal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#817D73]">
          <p>© {new Date().getFullYear()} Votre Optique Maroc. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <span>Casablanca · Rabat · Marrakech · Tanger</span>
            <button
              onClick={() => onNavigate('admin')}
              className="flex items-center gap-1.5 text-[#9F9A8E] hover:text-[#C6A53A] transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C6A53A]" />
              <span>Espace Administrateur</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
