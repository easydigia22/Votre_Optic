import React, { useState } from 'react';
import { Logo } from '../components/Logo';
import { AdminUser } from '../types';
import {
  LayoutDashboard,
  Glasses,
  Tags,
  Layers,
  Boxes,
  Sparkles,
  Image as ImageIcon,
  MessageSquare,
  Share2,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Star,
} from 'lucide-react';

interface AdminLayoutProps {
  user: AdminUser;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
  onBackToStore: () => void;
  badgeCounts?: {
    lowStock: number;
    unreadMessages: number;
    activePromos: number;
    pendingReviews?: number;
  };
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  user,
  activeTab,
  onSelectTab,
  onLogout,
  onBackToStore,
  badgeCounts,
  children,
}) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Produits', icon: Glasses },
    { id: 'categories', label: 'Catégories', icon: Tags },
    { id: 'brands', label: 'Marques', icon: Layers },
    {
      id: 'stock',
      label: 'Stocks & Alertes',
      icon: Boxes,
      badge: badgeCounts?.lowStock && badgeCounts.lowStock > 0 ? `${badgeCounts.lowStock}` : undefined,
      badgeColor: 'bg-red-500 text-white',
    },
    {
      id: 'promotions',
      label: 'Promotions',
      icon: Sparkles,
      badge: badgeCounts?.activePromos ? `${badgeCounts.activePromos}` : undefined,
    },
    { id: 'banners', label: 'Bannières', icon: ImageIcon },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      badge: badgeCounts?.unreadMessages && badgeCounts.unreadMessages > 0 ? `${badgeCounts.unreadMessages}` : undefined,
      badgeColor: 'bg-[#C6A53A] text-[#11110F]',
    },
    {
      id: 'reviews',
      label: 'Avis & Notations',
      icon: Star,
      badge: badgeCounts?.pendingReviews && badgeCounts.pendingReviews > 0 ? `${badgeCounts.pendingReviews}` : undefined,
      badgeColor: 'bg-amber-400 text-[#11110F] font-bold',
    },
    { id: 'social', label: 'Réseaux sociaux', icon: Share2 },
    { id: 'settings', label: 'Paramètres & SEO', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#11110F] text-[#FFFDF7] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col justify-between w-64 bg-[#15140F] border-r border-[#C6A53A]/20 shrink-0">
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-white/5">
            <Logo size="sm" />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#C6A53A] bg-[#11110F] px-2 py-0.5 border border-[#C6A53A]/30">
                {user.role}
              </span>
              <button
                onClick={onBackToStore}
                title="Voir le site public"
                className="text-[11px] text-[#9F9A8E] hover:text-[#C6A53A] flex items-center gap-1 transition-colors"
              >
                <span>Voir le site</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#C6A53A] text-[#11110F] font-bold shadow-sm'
                      : 'text-[#E8E5DD] hover:bg-[#201F18] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#11110F]' : 'text-[#C6A53A]'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-sm ${
                        item.badgeColor || (isActive ? 'bg-[#11110F] text-[#C6A53A]' : 'bg-[#29271F] text-[#C6A53A]')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="p-4 border-t border-white/5 bg-[#0E0E0C]">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-[#1B1A15] border border-[#C6A53A]/40 flex items-center justify-center text-[#C6A53A]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-[10px] font-mono text-[#9F9A8E] truncate">{user.email}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 border border-red-900/40 text-red-400 hover:bg-red-950/30 text-xs transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Header */}
        <header className="lg:hidden bg-[#15140F] border-b border-[#C6A53A]/20 p-4 flex items-center justify-between sticky top-0 z-30">
          <Logo size="sm" />

          <div className="flex items-center gap-2">
            <button
              onClick={onBackToStore}
              className="text-xs text-[#9F9A8E] hover:text-white p-2"
              title="Voir le site"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="p-2 text-[#C6A53A] border border-[#C6A53A]/30"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <div className="lg:hidden fixed inset-0 top-[61px] bg-[#11110F]/95 backdrop-blur-md z-40 p-4 overflow-y-auto">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      setMobileNavOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 text-xs font-medium ${
                      isActive ? 'bg-[#C6A53A] text-[#11110F] font-bold' : 'text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-[#11110F] text-[#C6A53A]">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="pt-6 mt-6 border-t border-white/10 space-y-3">
              <button
                onClick={onBackToStore}
                className="w-full py-2.5 text-center text-xs text-white border border-white/20"
              >
                Retour au site client
              </button>
              <button
                onClick={onLogout}
                className="w-full py-2.5 text-center text-xs text-red-400 bg-red-950/40 border border-red-800"
              >
                Déconnexion
              </button>
            </div>
          </div>
        )}

        {/* Main Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
