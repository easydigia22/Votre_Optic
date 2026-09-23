import React, { useState } from 'react';
import { Download, ExternalLink, MoreVertical, Share2, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, isInAppBrowser, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) return null;

  const handleClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (installed) return;
    }
    setShowGuide(true);
  };

  const deviceLabel = isIOS ? 'iPhone ou iPad' : isAndroid ? 'téléphone Android' : 'appareil';

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        title="Installer Votre Optique sur cet appareil"
        className={`flex items-center justify-center gap-2 border border-[#C6A53A]/50 bg-[#1B1A15] hover:bg-[#C6A53A]/10 text-[#F5E6A6] text-xs uppercase tracking-wider font-medium transition-colors shadow-lg ${
          compact ? 'px-2.5 py-1.5' : 'px-3.5 py-2.5'
        }`}
      >
        <Download className="w-4 h-4 text-[#C6A53A]" />
        <span>{compact ? 'Installer' : "Installer l'application"}</span>
      </button>

      {showGuide && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-install-title"
        >
          <div className="w-full max-w-sm border border-[#C6A53A]/40 bg-[#1B1A15] p-6 text-left shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowGuide(false)}
              aria-label="Fermer le guide d'installation"
              className="absolute top-4 right-4 text-[#9F9A8E] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5 pr-8">
              <div className="w-10 h-10 shrink-0 border border-[#C6A53A]/40 flex items-center justify-center text-[#C6A53A]">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 id="pwa-install-title" className="font-serif-luxury text-lg text-[#FFFDF7] font-semibold">
                  Installer Votre Optique
                </h3>
                <p className="text-xs text-[#9F9A8E]">Sur votre {deviceLabel}</p>
              </div>
            </div>

            {isInAppBrowser && (
              <div className="mb-5 border border-[#C6A53A]/30 bg-[#C6A53A]/10 p-3 text-xs text-[#F5E6A6]">
                <div className="flex items-start gap-2">
                  <ExternalLink className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>
                    Vous consultez le site dans WhatsApp ou une autre application. Ouvrez d'abord le menu
                    <strong> ⋮</strong>, puis choisissez <strong>Ouvrir dans le navigateur</strong>.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4 text-sm text-[#E8E5DD] border-t border-white/10 pt-5">
              {isIOS ? (
                <>
                  <GuideStep icon={<ExternalLink className="w-4 h-4" />} number="1">
                    Ouvrez cette page dans <strong>Safari</strong>.
                  </GuideStep>
                  <GuideStep icon={<Share2 className="w-4 h-4" />} number="2">
                    Touchez le bouton <strong>Partager</strong> dans Safari.
                  </GuideStep>
                  <GuideStep icon={<Smartphone className="w-4 h-4" />} number="3">
                    Choisissez <strong>Sur l'écran d'accueil</strong>, puis <strong>Ajouter</strong>.
                  </GuideStep>
                </>
              ) : (
                <>
                  <GuideStep icon={<ExternalLink className="w-4 h-4" />} number="1">
                    Ouvrez cette page dans <strong>Google Chrome</strong>.
                  </GuideStep>
                  <GuideStep icon={<MoreVertical className="w-4 h-4" />} number="2">
                    Touchez le menu <strong>⋮</strong> en haut à droite.
                  </GuideStep>
                  <GuideStep icon={<Download className="w-4 h-4" />} number="3">
                    Choisissez <strong>Installer l'application</strong> ou <strong>Ajouter à l'écran d'accueil</strong>.
                  </GuideStep>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="mt-6 w-full py-2.5 bg-[#C6A53A] text-[#11110F] font-semibold text-xs uppercase tracking-wider hover:bg-[#E3C866] transition-colors"
            >
              J'ai compris
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const GuideStep: React.FC<{
  number: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ number, icon, children }) => (
  <div className="flex items-start gap-3">
    <span className="w-6 h-6 shrink-0 bg-[#11110F] border border-[#C6A53A]/40 text-[#C6A53A] flex items-center justify-center font-mono text-xs">
      {number}
    </span>
    <div className="flex gap-2 leading-relaxed">
      <span className="text-[#C6A53A] mt-0.5">{icon}</span>
      <p>{children}</p>
    </div>
  </div>
);
