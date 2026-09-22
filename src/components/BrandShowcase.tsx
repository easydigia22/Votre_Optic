import React from 'react';
import { Brand } from '../types';
import { ArrowRight } from 'lucide-react';

interface BrandShowcaseProps {
  brands: Brand[];
  onSelectBrand: (brandId: string) => void;
}

export const BrandShowcase: React.FC<BrandShowcaseProps> = ({ brands, onSelectBrand }) => {
  return (
    <section className="py-16 bg-[#0E0E0E] text-[#F8F5EF] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-[#D6AE62] font-semibold">
            Manufactures & Maisons de Renom
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-white font-medium mt-1">
            Nos Marques Partenaires
          </h2>
          <p className="text-xs text-[#A6A6A6] mt-2">
            Des signatures iconiques reconnues dans le monde entier pour leur précision mécanique et leur design d'exception.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {brands.map((b) => (
            <div
              key={b.id}
              onClick={() => onSelectBrand(b.id)}
              className="group bg-[#151515] border border-white/5 hover:border-[#D6AE62]/50 p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 hover:-translate-y-1"
            >
              <h3 className="font-serif-luxury text-xl font-medium tracking-wide text-white group-hover:text-[#F0D8A5] transition-colors">
                {b.name}
              </h3>
              <span className="text-[10px] font-mono text-[#D6AE62] tracking-wider uppercase mt-1">
                {b.country || 'International'}
              </span>
              <p className="text-[11px] text-[#A6A6A6] mt-2 line-clamp-2">
                {b.description}
              </p>
              <span className="mt-4 text-[11px] text-[#A6A6A6] group-hover:text-[#D6AE62] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Voir les modèles</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
