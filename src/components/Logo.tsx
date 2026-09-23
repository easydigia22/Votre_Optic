import React from 'react';
import logoImage from '../../Lo.png';

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
        className={`${sizeClass} w-auto max-w-[180px] rounded-xl bg-white object-contain p-1.5 ring-1 ring-[#C6A53A]/70 shadow-[0_10px_30px_rgba(198,165,58,0.2)]`}
      />
      {showSlogan && (
        <span className="mt-1 text-[10px] font-serif-luxury italic tracking-wider text-[#9F9A8E]">
          Votre optique, votre élégance entre nos mains
        </span>
      )}
    </div>
  );
};
