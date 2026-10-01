import React from 'react';

// Logo officiel (déposé dans public/, servi à la racine)
const logoImage = '/logo-officiel.jpg';

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
  const sizeClass = size === 'sm' ? 'h-10' : size === 'lg' ? 'h-24' : 'h-14';

  return (
    <div className={`inline-flex flex-col items-start select-none ${className}`}>
      <img
        src={logoImage}
        alt="Votre Optique"
        className={`${sizeClass} w-auto max-w-[180px] rounded-xl bg-white object-contain p-1.5 ring-1 ring-[#EDB21B]/70 shadow-[0_10px_30px_rgba(237,178,27,0.2)]`}
      />
      {showSlogan && (
        <span className="mt-1 text-[10px] font-serif-luxury italic tracking-wider text-[#9F9A8E]">
          Votre optique, votre élégance entre nos mains
        </span>
      )}
    </div>
  );
};
