import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed in standalone mode, hide
  if (isInstalled) {
    return null;
  }

  // Desktop or Android Chrome installable prompt
  if (isInstallable) {
    return (
      <button
        onClick={install}
        title="Installer l'application sur votre appareil"
        className={`flex items-center gap-2 border border-[#D6AE62]/40 bg-[#151515] hover:bg-[#D6AE62]/10 text-[#F0D8A5] text-xs uppercase tracking-wider font-medium transition-colors ${
          compact ? 'px-2.5 py-1.5' : 'px-3 py-1.5'
        }`}
      >
        <Download className="w-3.5 h-3.5 text-[#D6AE62]" />
        <span>Installer l'App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          title="Installer sur iPhone / iPad"
          className={`flex items-center gap-2 border border-[#D6AE62]/30 bg-[#151515] hover:bg-[#1E1E1E] text-[#E8C987] text-xs uppercase tracking-wider font-medium transition-colors ${
            compact ? 'px-2.5 py-1.5' : 'px-3 py-1.5'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5 text-[#D6AE62]" />
          <span>App iPhone</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-sm border border-[#D6AE62]/40 bg-[#151515] p-6 text-left shadow-2xl relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-[#A6A6A6] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 border border-[#D6AE62]/40 flex items-center justify-center text-[#D6AE62]">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-lg text-[#F8F5EF] font-semibold">
                    Installer Votre Optique
                  </h3>
                  <p className="text-xs text-[#A6A6A6]">Sur votre iPhone ou iPad</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-[#E5E5E5] border-t border-white/10 pt-4">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 shrink-0 bg-[#0B0B0B] border border-[#D6AE62]/40 text-[#D6AE62] flex items-center justify-center font-mono">1</span>
                  <p>Touchez le bouton de <strong>Partage</strong> (icône carrée avec flèche vers le haut) en bas de Safari.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 shrink-0 bg-[#0B0B0B] border border-[#D6AE62]/40 text-[#D6AE62] flex items-center justify-center font-mono">2</span>
                  <p>Faites défiler vers le bas et sélectionnez <strong>Sur l'écran d'accueil</strong>.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 shrink-0 bg-[#0B0B0B] border border-[#D6AE62]/40 text-[#D6AE62] flex items-center justify-center font-mono">3</span>
                  <p>Appuyez sur <strong>Ajouter</strong> en haut à droite pour profiter d'un accès direct et rapide.</p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full py-2.5 bg-[#D6AE62] text-[#0B0B0B] font-semibold text-xs uppercase tracking-wider hover:bg-[#E8C987] transition-colors"
              >
                Compris
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
