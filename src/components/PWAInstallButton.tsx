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
        className={`flex items-center justify-center gap-2 border border-[#D6AE62]/50 bg-[#151515] hover:bg-[#D6AE62]/10 text-[#F0D8A5] text-xs uppercase tracking-wider font-medium transition-colors shadow-lg ${
          compact ? 'px-2.5 py-1.5' : 'px-3.5 py-2.5'
        }`}
      >
        <Download className="w-4 h-4 text-[#D6AE62]" />
        <span>{compact ? 'Installer' : "Installer l'application"}</span>
      </button>

      {showGuide && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-install-title"
        >
          <div className="w-full max-w-sm border border-[#D6AE62]/40 bg-[#151515] p-6 text-left shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowGuide(false)}
              aria-label="Fermer le guide d'installation"
              className="absolute top-4 right-4 text-[#A6A6A6] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5 pr-8">
              <div className="w-10 h-10 shrink-0 border border-[#D6AE62]/40 flex items-center justify-center text-[#D6AE62]">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 id="pwa-install-title" className="font-serif-luxury text-lg text-[#F8F5EF] font-semibold">
                  Installer Votre Optique
                </h3>
                <p className="text-xs text-[#A6A6A6]">Sur votre {deviceLabel}</p>
              </div>
            </div>

            {isInAppBrowser && (
              <div className="mb-5 border border-[#D6AE62]/30 bg-[#D6AE62]/10 p-3 text-xs text-[#F0D8A5]">
                <div className="flex items-start gap-2">
                  <ExternalLink className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>
                    Vous consultez le site dans WhatsApp ou une autre application. Ouvrez d'abord le menu
                    <strong> ⋮</strong>, puis choisissez <strong>Ouvrir dans le navigateur</strong>.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4 text-sm text-[#E5E5E5] border-t border-white/10 pt-5">
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
              className="mt-6 w-full py-2.5 bg-[#D6AE62] text-[#0B0B0B] font-semibold text-xs uppercase tracking-wider hover:bg-[#E8C987] transition-colors"
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
    <span className="w-6 h-6 shrink-0 bg-[#0B0B0B] border border-[#D6AE62]/40 text-[#D6AE62] flex items-center justify-center font-mono text-xs">
      {number}
    </span>
    <div className="flex gap-2 leading-relaxed">
      <span className="text-[#D6AE62] mt-0.5">{icon}</span>
      <p>{children}</p>
    </div>
  </div>
);
