import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Search,
  MessageCircle,
  Menu,
  X,
  Phone,
  ShieldCheck,
  ChevronRight,
  Heart,
} from 'lucide-react';
import { StoreSettings } from '../types';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, filterParam?: Record<string, string>) => void;
  settings: StoreSettings;
  isAdminLoggedIn?: boolean;
  wishlistCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  settings,
  isAdminLoggedIn = false,
  wishlistCount = 0,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickSearchQuery, setQuickSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearchQuery.trim()) {
      onNavigate('catalogue', { search: quickSearchQuery.trim() });
      setSearchOpen(false);
      setMobileMenuOpen(false);
      setQuickSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Accueil', view: 'home' },
    { label: 'Collections', view: 'catalogue' },
    { label: 'Nouveautés', view: 'catalogue', param: { newOnly: 'true' } },
    { label: 'Promotions', view: 'promotions' },
    { label: 'À propos', view: 'about' },
    { label: 'Contact', view: 'contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B0B0B]/95 backdrop-blur-md border-b border-[#D6AE62]/20 shadow-xl py-3'
          : 'bg-gradient-to-b from-[#0B0B0B] via-[#0B0B0B]/90 to-transparent py-4 border-b border-white/5'
      }`}
    >
      {/* Top micro bar on desktop */}
      <div className="hidden lg:block border-b border-white/5 pb-2 mb-2 text-[11px] text-[#A6A6A6]">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-[#E8C987] font-serif-luxury italic tracking-wide">
              {settings.tagline}
            </span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3 h-3 text-[#D6AE62]" />
              <a href={`tel:${settings.phone.replace(/\s+/g, '')}`}>{settings.phone}</a>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[#A6A6A6]">{settings.city}, Maroc</span>
            <span className="text-white/20">·</span>
            <PWAInstallButton compact />
            {isAdminLoggedIn ? (
              <button
                onClick={() => onNavigate('admin')}
                className="flex items-center gap-1 text-[#E8C987] hover:underline"
              >
                <ShieldCheck className="w-3 h-3 text-[#D6AE62]" />
                <span>Admin Connecté</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate('admin-login')}
                className="text-xs text-[#A6A6A6] hover:text-[#D6AE62] transition-colors"
              >
                Espace Pro
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={() => {
            onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-left focus:outline-none"
        >
          <Logo size={isScrolled ? 'sm' : 'md'} />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((item) => {
            const isActive =
              currentView === item.view &&
              (!item.param || item.param.newOnly === 'true');
            return (
              <button
                key={item.label}
                onClick={() => onNavigate(item.view, item.param)}
                className={`text-sm tracking-wide font-medium transition-colors relative py-1 ${
                  isActive
                    ? 'text-[#F0D8A5] font-semibold'
                    : 'text-[#E5E5E5] hover:text-[#D6AE62]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D6AE62]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Wishlist + Search + WhatsApp CTA */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Wishlist Link with Badge */}
          <button
            onClick={() => onNavigate('wishlist')}
            aria-label="Voir ma liste de souhaits"
            className="relative p-2 text-[#E5E5E5] hover:text-[#D6AE62] border border-transparent hover:border-[#D6AE62]/30 transition-colors"
            title="Ma Liste de Souhaits"
          >
            <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-current text-[#D6AE62]' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D6AE62] text-[#0B0B0B] font-mono text-[10px] font-bold flex items-center justify-center shadow-md">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Quick Search trigger */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Rechercher des lunettes"
            className="p-2 text-[#E5E5E5] hover:text-[#D6AE62] border border-transparent hover:border-[#D6AE62]/30 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Direct WhatsApp CTA Button */}
          <a
            href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
              'Bonjour Votre Optique, je souhaite des conseils ou me renseigner sur vos montures.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 border border-[#D6AE62]/40 bg-[#151515] hover:bg-[#D6AE62] hover:text-[#0B0B0B] text-[#F0D8A5] text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm"
          >
            <MessageCircle className="w-4 h-4 text-[#D6AE62] group-hover:text-[#0B0B0B]" />
            <span>WhatsApp</span>
          </a>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu principal"
            className="lg:hidden p-2 text-white hover:text-[#D6AE62] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Floating Quick Search Bar Dropdown */}
      {searchOpen && (
        <div className="border-t border-[#D6AE62]/20 bg-[#151515] py-4 px-6 animate-in slide-in-from-top duration-200">
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto relative flex items-center"
          >
            <Search className="w-5 h-5 text-[#D6AE62] absolute left-3 pointer-events-none" />
            <input
              type="text"
              autoFocus
              placeholder="Rechercher par modèle, marque (Ray-Ban, Cartier, Tom Ford), couleur ou référence..."
              value={quickSearchQuery}
              onChange={(e) => setQuickSearchQuery(e.target.value)}
              className="w-full bg-[#0B0B0B] border border-[#D6AE62]/30 text-white pl-11 pr-24 py-2.5 text-sm focus:outline-none focus:border-[#D6AE62] transition-colors placeholder:text-[#A6A6A6]"
            />
            <button
              type="submit"
              className="absolute right-2 px-3 py-1.5 bg-[#D6AE62] text-[#0B0B0B] text-xs font-semibold uppercase hover:bg-[#E8C987] transition-colors"
            >
              Trouver
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[60px] bottom-0 bg-[#0B0B0B]/98 backdrop-blur-xl border-t border-[#D6AE62]/20 overflow-y-auto p-6 z-50 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Quick search input */}
            <form onSubmit={handleSearchSubmit} className="relative mb-6">
              <input
                type="text"
                placeholder="Rechercher une monture..."
                value={quickSearchQuery}
                onChange={(e) => setQuickSearchQuery(e.target.value)}
                className="w-full bg-[#151515] border border-[#D6AE62]/30 text-white pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#D6AE62]"
              />
              <Search className="w-5 h-5 text-[#D6AE62] absolute left-3 top-3.5" />
            </form>

            <div className="space-y-1">
              <button
                onClick={() => {
                  onNavigate('wishlist');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between py-3.5 text-left border-b border-white/5 text-base font-medium text-[#E8C987] hover:text-[#D6AE62]"
              >
                <div className="flex items-center gap-2">
                  <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-current text-[#D6AE62]' : ''}`} />
                  <span>Ma Liste de Souhaits</span>
                </div>
                {wishlistCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-[#D6AE62] text-[#0B0B0B] font-mono text-xs font-bold">
                    {wishlistCount}
                  </span>
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#D6AE62]" />
                )}
              </button>

              {navLinks.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    onNavigate(item.view, item.param);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between py-3.5 text-left border-b border-white/5 text-base font-medium text-[#F8F5EF] hover:text-[#D6AE62]"
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-[#D6AE62]" />
                </button>
              ))}
            </div>

            <div className="pt-4">
              <PWAInstallButton />
            </div>
          </div>

          <div className="pt-8 border-t border-[#D6AE62]/20 space-y-4 text-xs text-[#A6A6A6]">
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                'Bonjour Votre Optique, je vous contacte depuis votre site web.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#D6AE62] text-[#0B0B0B] font-bold uppercase tracking-wider text-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contacter sur WhatsApp (+212 770 420 663)</span>
            </a>

            <div className="text-center space-y-1">
              <p className="text-[#F8F5EF]">{settings.address}</p>
              <p>{settings.city}, {settings.country} · {settings.hours}</p>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => {
                  onNavigate('admin');
                  setMobileMenuOpen(false);
                }}
                className="text-[#D6AE62] underline text-xs"
              >
                Accès Espace Administrateur
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
