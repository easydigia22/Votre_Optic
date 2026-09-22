import React from 'react';

interface LogoProps {
  className?: string;
  showSlogan?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  showSlogan = false,
  size = 'md',
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Visual Icon with Gold Circular Stroke & Glasses */}
      <div
        className={`relative shrink-0 flex items-center justify-center ${
          isSm ? 'w-9 h-9' : isLg ? 'w-14 h-14' : 'w-11 h-11'
        }`}
      >
        {/* Golden textured artistic ring */}
        <div className="absolute inset-0 rounded-full border-2 border-[#D6AE62] border-t-transparent border-r-[#F0D8A5] transform -rotate-12" />
        <div className="absolute inset-1 rounded-full border border-[#D6AE62]/40" />

        {/* Stylized Eyewear silhouette */}
        <div className="relative flex items-center gap-1 z-10">
          <div className="w-2.5 h-2.5 rounded-full bg-[#0B0B0B] border border-[#D6AE62]" />
          <div className="w-1.5 h-0.5 bg-[#D6AE62]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#0B0B0B] border border-[#D6AE62]" />
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-baseline gap-1">
          <span
            className={`font-serif-luxury italic text-[#D6AE62] tracking-wide ${
              isSm ? 'text-sm' : isLg ? 'text-2xl' : 'text-lg font-medium'
            }`}
          >
            Votre
          </span>
          <span
            className={`font-bold tracking-tight text-white uppercase ${
              isSm ? 'text-xs' : isLg ? 'text-xl' : 'text-base'
            }`}
          >
            Optique
          </span>
        </div>

        {showSlogan && (
          <span className="text-[10px] sm:text-xs text-[#A6A6A6] font-serif-luxury italic tracking-wider mt-0.5">
            Votre optique, votre Élégance entre nos mains
          </span>
        )}
      </div>
    </div>
  );
};
