import React from 'react';
import { MessageCircle } from 'lucide-react';

interface FloatingWhatsAppButtonProps {
  whatsappNumber: string;
}

export const FloatingWhatsAppButton: React.FC<FloatingWhatsAppButtonProps> = ({
  whatsappNumber,
}) => {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '') || '212770420663';
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    'Bonjour Votre Optique, je souhaite des conseils pour choisir une monture de lunettes.'
  )}`;

  return (
    <aside aria-label="Assistance WhatsApp" className="fixed bottom-6 right-6 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter sur WhatsApp"
        className="group relative flex items-center gap-2.5 bg-[#25D366] hover:bg-[#22bf5b] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-white/20"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="hidden sm:inline text-xs font-bold tracking-wide">
          WhatsApp Direct
        </span>

        {/* Pulse effect */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C6A53A]"></span>
        </span>
      </a>
    </aside>
  );
};
