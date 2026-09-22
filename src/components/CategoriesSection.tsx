import React from 'react';
import { Category } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface CategoriesSectionProps {
  categories: Category[];
  onSelectCategory: (category: Category) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  onSelectCategory,
}) => {
  const activeCategories = categories.filter((c) => c.isActive);

  return (
    <section className="py-20 bg-[#0B0B0B] text-[#F8F5EF] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#D6AE62] font-semibold">
              Collections d'exception
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-white font-medium mt-1">
              Explorez par Catégorie
            </h2>
          </div>
          <p className="text-xs text-[#A6A6A6] max-w-md">
            Des lignes pures sculptées dans les plus nobles acétates et titanes, pensées pour
            s'accorder à votre visage et votre personnalité.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat)}
              className="group relative h-80 overflow-hidden cursor-pointer bg-[#151515] border border-white/5 hover:border-[#D6AE62]/50 transition-all duration-300"
            >
              {/* Category Background Image */}
              <img
                src={cat.image}
                alt={cat.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center filter brightness-75 group-hover:brightness-90 group-hover:scale-105 transition-all duration-700 ease-out"
              />

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/40 to-transparent" />

              {/* Inner Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-mono text-[#D6AE62] uppercase tracking-widest">
                    {cat.itemCount !== undefined ? `${cat.itemCount} modèles` : 'Sélection'}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#0B0B0B]/80 border border-[#D6AE62]/30 flex items-center justify-center text-[#E8C987] group-hover:bg-[#D6AE62] group-hover:text-[#0B0B0B] transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="font-serif-luxury text-2xl text-white font-medium group-hover:text-[#F0D8A5] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#A6A6A6] mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
