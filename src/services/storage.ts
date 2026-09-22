import {
  Category,
  Brand,
  Product,
  StockMovement,
  Promotion,
  Banner,
  CustomerMessage,
  StoreSettings,
  AdminUser,
  ProductReview,
  ReviewStatus,
} from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'vo_products_v1',
  CATEGORIES: 'vo_categories_v1',
  BRANDS: 'vo_brands_v1',
  STOCK_MOVEMENTS: 'vo_stock_movements_v1',
  PROMOTIONS: 'vo_promotions_v1',
  BANNERS: 'vo_banners_v1',
  MESSAGES: 'vo_messages_v1',
  SETTINGS: 'vo_settings_v1',
  ADMIN_SESSION: 'vo_admin_session_v1',
  WISHLIST: 'vo_wishlist_v1',
  REVIEWS: 'vo_reviews_v1',
  INITIALIZED: 'vo_initialized_v1',
};

// Initial Moroccan Luxury Optic Demo Data
export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'Votre Optique',
  tagline: 'Votre optique, votre Élégance entre nos mains',
  subtitle: 'Des montures sélectionnées pour sublimer votre regard.',
  phone: '+212 770 420 663',
  whatsapp: '+212770420663',
  email: 'contact@votreoptique.ma',
  address: "Angle Boulevard d'Anfa & Rue Jean Jaurès, Quartier Racine",
  city: 'Casablanca',
  country: 'Maroc',
  mapsUrl: 'https://maps.google.com/?q=Boulevard+d+Anfa+Casablanca',
  hours: 'Lundi au Samedi : 09h30 – 20h00 (Fermé le Dimanche)',
  socialLinks: {
    instagram: 'https://instagram.com/votreoptique_maroc',
    facebook: 'https://facebook.com/votreoptiquemaroc',
    tiktok: 'https://tiktok.com/@votreoptique.ma',
    whatsapp: 'https://wa.me/212770420663',
  },
  seo: {
    metaTitle: "Votre Optique Maroc | L'Élégance & la Précision du Regard",
    metaDescription:
      "Boutique d'optique haut de gamme à Casablanca, Maroc. Montures de créateurs, verres progressifs haute précision, et commande directe sur WhatsApp au +212 770 420 663.",
  },
};

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat-femme',
    slug: 'femme',
    name: 'Lunettes Femme',
    description: 'Lignes délicates, formes papillons et finitions or champagne pour sublimer la féminité.',
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80',
    order: 1,
    isActive: true,
  },
  {
    id: 'cat-homme',
    slug: 'homme',
    name: 'Lunettes Homme',
    description: 'Montures architecturales, titane brossé et acétate italien pour un style affirmé.',
    image: 'https://images.unsplash.com/photo-1509695503492-413ff1d0d6c4?auto=format&fit=crop&w=800&q=80',
    order: 2,
    isActive: true,
  },
  {
    id: 'cat-vue',
    slug: 'vue',
    name: 'Lunettes de Vue',
    description: 'Verres de haute précision optique, traitements anti-lumière bleue et confort quotidien.',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    order: 3,
    isActive: true,
  },
  {
    id: 'cat-soleil',
    slug: 'soleil',
    name: 'Lunettes de Soleil',
    description: 'Protection UV400 intégrale, verres polarisés haute définition et allure haute couture.',
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80',
    order: 4,
    isActive: true,
  },
  {
    id: 'cat-enfant',
    slug: 'enfant',
    name: 'Lunettes Enfant',
    description: 'Montures ultra-résistantes, ergonomiques et colorées spécialement adaptées aux plus jeunes.',
    image: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=800&q=80',
    order: 5,
    isActive: true,
  },
  {
    id: 'cat-nouveautes',
    slug: 'nouveautes',
    name: 'Nouveautés & Éditions Limitées',
    description: 'Les dernières créations des grands maîtres lunetiers mondiaux arrivées à Casablanca.',
    image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=800&q=80',
    order: 6,
    isActive: true,
  },
];

export const DEFAULT_BRANDS: Brand[] = [
  {
    id: 'brand-rayban',
    slug: 'ray-ban',
    name: 'Ray-Ban',
    country: 'Italie',
    description: 'Icône intemporelle de style et de caractère depuis 1937.',
    isFeatured: true,
  },
  {
    id: 'brand-tomford',
    slug: 'tom-ford',
    name: 'Tom Ford',
    country: 'Italie / USA',
    description: 'Le luxe audacieux avec la célèbre signature métallique T sur les tempes.',
    isFeatured: true,
  },
  {
    id: 'brand-cartier',
    slug: 'cartier',
    name: 'Cartier Eyewear',
    country: 'France',
    description: "La haute joaillerie appliquée à l'art optique : finitions or et bois nobles.",
    isFeatured: true,
  },
  {
    id: 'brand-gucci',
    slug: 'gucci',
    name: 'Gucci',
    country: 'Italie',
    description: 'Design éclectique, glamour florentin et détails iconiques dorés.',
    isFeatured: true,
  },
  {
    id: 'brand-persol',
    slug: 'persol',
    name: 'Persol',
    country: 'Italie',
    description: 'Artisanat turinois d’excellence avec la flèche légendaire Supreme.',
    isFeatured: false,
  },
];

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    slug: 'ray-ban-wayfarer-classic-rb2140',
    reference: 'RB-2140-901',
    name: 'Original Wayfarer Classic',
    brandId: 'brand-rayban',
    categoryId: 'cat-soleil',
    gender: 'mixte',
    type: 'soleil',
    description: "Le modèle solaire le plus reconnaissable au monde. Monture en acétate noir poli, verres minéraux vert G-15 offrant une clarté optique exceptionnelle et une protection 100% UV.",
    price: 1850,
    oldPrice: 2200,
    inPromo: true,
    discountPercentage: 16,
    stockQuantity: 2, // Low stock demo alert!
    lowStockThreshold: 3,
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1000&q=80',
    ],
    colors: ['Noir Brillant', 'Écaille Havane', 'Noir Mat'],
    frameType: 'Trapézoïdale Iconique',
    material: 'Acétate Italien Premium',
    lensType: 'Verre Minéral G-15 Polarisé',
    isNew: false,
    isFeatured: true,
    status: 'active',
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-15T14:30:00.000Z',
  },
  {
    id: 'prod-2',
    slug: 'tom-ford-tf5295-or-champagne',
    reference: 'TF-5295-001',
    name: 'Tom Ford Prestige Optique',
    brandId: 'brand-tomford',
    categoryId: 'cat-vue',
    gender: 'femme',
    type: 'vue',
    description: "Une silhouette sophistiquée aux douces lignes papillon. Incrustation du monogramme T doré poli aux charnières, patins ajustables en silicone hypoallergénique et confort de port optimal.",
    price: 3400,
    oldPrice: 3900,
    inPromo: true,
    discountPercentage: 13,
    stockQuantity: 5,
    lowStockThreshold: 3,
    images: [
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=1000&q=80',
    ],
    colors: ['Noir & Or', 'Havane Miel', 'Bordeaux Nacre'],
    frameType: 'Papillon Doux',
    material: 'Acétate Mazzucchelli & Laiton Doré',
    lensType: 'Traitement Anti-Reflet Diamant & Filtre Bleu',
    isNew: true,
    isFeatured: true,
    status: 'active',
    createdAt: '2026-03-10T12:00:00.000Z',
    updatedAt: '2026-03-18T09:15:00.000Z',
  },
  {
    id: 'prod-3',
    slug: 'cartier-premiere-titane-dore',
    reference: 'CT-0089O-002',
    name: 'Cartier Première de Cartier',
    brandId: 'brand-cartier',
    categoryId: 'cat-vue',
    gender: 'homme',
    type: 'vue',
    description: "Chef-d'œuvre de la manufacture Cartier. Monture ultra-légère en titane pur forgé au Japon, plaquée or 18 carats avec motif godron emblématique sur les branches et l'arceau de nez.",
    price: 6800,
    oldPrice: undefined,
    inPromo: false,
    stockQuantity: 1, // Critical low stock alert
    lowStockThreshold: 3,
    images: [
      'https://images.unsplash.com/photo-1509695503492-413ff1d0d6c4?auto=format&fit=crop&w=1000&q=80',
    ],
    colors: ['Plaqué Or 18K', 'Platine Brossé'],
    frameType: 'Rectangulaire Invisible',
    material: 'Titane Japonais Plaqué Or 18 Carats',
    lensType: 'Verres Progressifs HD Personnalisés',
    isNew: true,
    isFeatured: true,
    status: 'active',
    createdAt: '2026-03-05T08:00:00.000Z',
    updatedAt: '2026-03-20T11:00:00.000Z',
  },
  {
    id: 'prod-4',
    slug: 'gucci-oversize-soleil-gg0061s',
    reference: 'GC-0061S-003',
    name: 'Gucci Aviateur Signature',
    brandId: 'brand-gucci',
    categoryId: 'cat-soleil',
    gender: 'femme',
    type: 'soleil',
    description: "L'allure glamour par excellence. Monture métallique oversize dorée rehaussée de liserés émaillés rouge et vert signature Gucci. Verres dégradés bronze pour une protection solaire absolue.",
    price: 3950,
    oldPrice: 4600,
    inPromo: true,
    discountPercentage: 14,
    stockQuantity: 7,
    lowStockThreshold: 3,
    images: [
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1000&q=80',
    ],
    colors: ['Or & Dégradé Bronze', 'Argent & Miroité Rose'],
    frameType: 'Aviateur Moderne',
    material: 'Métal Fin Plaqué & Émail Grand Feu',
    lensType: 'Verre Dégradé Brun Protection UV400',
    isNew: false,
    isFeatured: true,
    status: 'active',
    createdAt: '2026-02-28T14:20:00.000Z',
    updatedAt: '2026-03-12T16:45:00.000Z',
  },
  {
    id: 'prod-5',
    slug: 'persol-714-steve-mcqueen-ecaille',
    reference: 'PS-0714-SMQ',
    name: 'Persol 714 Pliable Steve McQueen',
    brandId: 'brand-persol',
    categoryId: 'cat-soleil',
    gender: 'homme',
    type: 'soleil',
    description: "Première paire de lunettes pliables de l'histoire, popularisée par Steve McQueen. Système Meflecto sur les branches assurant un confort sans pression sur les tempes.",
    price: 2900,
    oldPrice: undefined,
    inPromo: false,
    stockQuantity: 4,
    lowStockThreshold: 3,
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80',
    ],
    colors: ['Havane Caffe', 'Noir Ébène'],
    frameType: 'Pilote Pliable',
    material: 'Acétate de Coton & Charnières Mécaniques',
    lensType: 'Verre Minéral Bleu Polarisé',
    isNew: false,
    isFeatured: false,
    status: 'active',
    createdAt: '2026-03-02T09:10:00.000Z',
    updatedAt: '2026-03-16T18:00:00.000Z',
  },
  {
    id: 'prod-6',
    slug: 'ray-ban-clubmaster-classic-optique',
    reference: 'RB-5154-2000',
    name: 'Clubmaster Classic Vue',
    brandId: 'brand-rayban',
    categoryId: 'cat-vue',
    gender: 'mixte',
    type: 'vue',
    description: "Style rétro intellectuel inspiré des années 50. Demi-cerclage supérieur en acétate noir intense souligné par une structure inférieure en métal doré poli.",
    price: 1750,
    oldPrice: 1990,
    inPromo: true,
    discountPercentage: 12,
    stockQuantity: 8,
    lowStockThreshold: 3,
    images: [
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=1000&q=80',
    ],
    colors: ['Noir & Or', 'Écaille & Or', 'Bleu Marin & Argent'],
    frameType: 'Demi-Cerclée Browline',
    material: 'Acétate & Métal Inoxydable',
    lensType: 'Anti-Reflet Haute Résistance aux Rayures',
    isNew: false,
    isFeatured: false,
    status: 'active',
    createdAt: '2026-02-25T11:30:00.000Z',
    updatedAt: '2026-03-14T10:00:00.000Z',
  },
  {
    id: 'prod-7',
    slug: 'tom-ford-pantoscopique-havane',
    reference: 'TF-5532-052',
    name: 'Tom Ford Pantoscopique Vintage',
    brandId: 'brand-tomford',
    categoryId: 'cat-vue',
    gender: 'homme',
    type: 'vue',
    description: "Forme ronde vintage revisitée avec le raffinement contemporain de la maison Tom Ford. Pont en clé de serrure offrant un maintien naturel irréprochable sur l'arête nasale.",
    price: 3200,
    oldPrice: undefined,
    inPromo: false,
    stockQuantity: 6,
    lowStockThreshold: 3,
    images: [
      'https://images.unsplash.com/photo-1509695503492-413ff1d0d6c4?auto=format&fit=crop&w=1000&q=80',
    ],
    colors: ['Havane Foncé', 'Miel Ambré'],
    frameType: 'Panto / Ronde Rétro',
    material: 'Acétate Haute Densité',
    lensType: 'Verres Blue-Blocker Haute Performance',
    isNew: true,
    isFeatured: true,
    status: 'active',
    createdAt: '2026-03-12T15:00:00.000Z',
    updatedAt: '2026-03-19T13:20:00.000Z',
  },
  {
    id: 'prod-8',
    slug: 'gucci-hexagone-or-soleil',
    reference: 'GC-0396S-001',
    name: 'Gucci Géométrique Or Fin',
    brandId: 'brand-gucci',
    categoryId: 'cat-soleil',
    gender: 'femme',
    type: 'soleil',
    description: "Une silhouette hexagonale sculptée dans un fil d'or champagne ultra fin. L'équilibre parfait entre légèreté en apesanteur et présence audacieuse sur le visage.",
    price: 4200,
    oldPrice: 4800,
    inPromo: true,
    discountPercentage: 12,
    stockQuantity: 3, // Low stock limit
    lowStockThreshold: 3,
    images: [
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1000&q=80',
    ],
    colors: ['Or Champagne', 'Or Rose'],
    frameType: 'Hexagonale Aérienne',
    material: 'Alliage Hypoallergénique Haute Élasticité',
    lensType: 'Verre Dégradé Brun Poudré UV400',
    isNew: true,
    isFeatured: false,
    status: 'active',
    createdAt: '2026-03-08T16:40:00.000Z',
    updatedAt: '2026-03-17T11:15:00.000Z',
  },
  {
    id: 'prod-9',
    slug: 'cartier-santos-dumont-cuir',
    reference: 'CT-0145S-001',
    name: 'Cartier Santos-Dumont Solaire',
    brandId: 'brand-cartier',
    categoryId: 'cat-soleil',
    gender: 'homme',
    type: 'soleil',
    description: "Inspirée des vis emblématiques de la montre Santos. Double pont rehaussé d'une touche de veau véritable cousu main à Casablanca et verres solaires gris foncé traités anti-éblouissement.",
    price: 7900,
    oldPrice: undefined,
    inPromo: false,
    stockQuantity: 2, // Low stock alert
    lowStockThreshold: 3,
    images: [
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1000&q=80',
    ],
    colors: ['Platine & Cuir Noir', 'Or Jaune & Cuir Fauve'],
    frameType: 'Pilote Haute Joaillerie',
    material: 'Métal Finition Platine & Cuir Véritable',
    lensType: 'Verres Minéraux Polarisés AR Intérieur',
    isNew: true,
    isFeatured: true,
    status: 'active',
    createdAt: '2026-03-14T10:00:00.000Z',
    updatedAt: '2026-03-21T09:40:00.000Z',
  },
  {
    id: 'prod-10',
    slug: 'ray-ban-junior-aviator-enfant',
    reference: 'RJ-9506S-201',
    name: 'Ray-Ban Junior Aviator',
    brandId: 'brand-rayban',
    categoryId: 'cat-enfant',
    gender: 'enfant',
    type: 'soleil',
    description: "La réplique exacte de l'Aviator légendaire adaptée à la morphologie délicate des enfants de 6 à 12 ans. Matériaux non toxiques et verres en polycarbonate antichoc.",
    price: 950,
    oldPrice: 1150,
    inPromo: true,
    discountPercentage: 17,
    stockQuantity: 9,
    lowStockThreshold: 3,
    images: [
      'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=1000&q=80',
    ],
    colors: ['Argent & Verre Gris', 'Or & Verre Brun'],
    frameType: 'Aviateur Junior',
    material: 'Métal Souple Résistant aux Torsions',
    lensType: 'Polycarbonate Antichoc 100% Protection UV',
    isNew: false,
    isFeatured: false,
    status: 'active',
    createdAt: '2026-02-20T14:00:00.000Z',
    updatedAt: '2026-03-10T12:00:00.000Z',
  },
  {
    id: 'prod-11',
    slug: 'persol-galleria-900-vue',
    reference: 'PO-3007V-24',
    name: 'Persol Galleria 900 Écaille',
    brandId: 'brand-persol',
    categoryId: 'cat-vue',
    gender: 'femme',
    type: 'vue',
    description: "Élégance discrète et équilibre parfait des volumes. Teinte écaille de tortue lumineuse avec nuances miel et tabac qui réchauffent le teint et subliment le regard au bureau comme en soirée.",
    price: 2450,
    oldPrice: 2800,
    inPromo: true,
    discountPercentage: 12,
    stockQuantity: 5,
    lowStockThreshold: 3,
    images: [
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1000&q=80',
    ],
    colors: ['Écaille Havane Lumineux', 'Noir Intense'],
    frameType: 'Ovale Adoucie',
    material: 'Acétate Naturel Façonné à la Main',
    lensType: 'Verre Aminci Haute Clarté',
    isNew: false,
    isFeatured: false,
    status: 'active',
    createdAt: '2026-03-01T15:30:00.000Z',
    updatedAt: '2026-03-15T16:00:00.000Z',
  },
  {
    id: 'prod-12',
    slug: 'lunettes-junior-flex-optique',
    reference: 'VO-KID-402',
    name: 'Votre Optique Kids UltraFlex',
    brandId: 'brand-rayban',
    categoryId: 'cat-enfant',
    gender: 'enfant',
    type: 'vue',
    description: "Monture conçue pour les jeunes actifs. Branches sans vis charnière à mémoire de forme indéformable, patins de nez ergonomiques en silicone souple et cordon de maintien offert.",
    price: 850,
    oldPrice: undefined,
    inPromo: false,
    stockQuantity: 12,
    lowStockThreshold: 3,
    images: [
      'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=1000&q=80',
    ],
    colors: ['Bleu Nuit & Ciel', 'Prune & Rose Poudré'],
    frameType: 'Rectangulaire Souple',
    material: 'Silicone Médical & TR90 Garanti Sans Bisphénol',
    lensType: 'Traitement Durci Spécial Écolier',
    isNew: true,
    isFeatured: false,
    status: 'active',
    createdAt: '2026-03-05T13:00:00.000Z',
    updatedAt: '2026-03-18T17:20:00.000Z',
  },
];

export const DEFAULT_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-1',
    title: 'Offre Solaire & Élégance Printanière',
    description: "Bénéficiez de 15% à 25% de remise immédiate sur toutes nos montures de soleil de créateurs. Verres correcteurs solaires disponibles sur devis personnalisé.",
    code: 'SOLAIRE2026',
    bannerUrl: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'Découvrir la sélection solaire',
    ctaLink: '/catalogue?type=soleil',
    discountPercentage: 20,
    targetCategoryId: 'cat-soleil',
    startDate: '2026-03-01T00:00:00.000Z',
    endDate: '2026-06-30T23:59:59.000Z',
    isActive: true,
    createdAt: '2026-03-01T08:00:00.000Z',
  },
  {
    id: 'promo-2',
    title: 'Examen de Vue & Bilan Personnalisé Offerts',
    description: "Pour tout achat d'une monture optique avec verres progressifs ou unifocaux, votre contrôle de la vue complet est réalisé gracieusement dans notre espace optométrique à Casablanca.",
    code: 'EXAMEN-OFFERT',
    bannerUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'Prendre rendez-vous sur WhatsApp',
    ctaLink: 'https://wa.me/212770420663?text=Bonjour,%20je%20souhaite%20profiter%20du%20bilan%20visuel%20offert%20avec%20ma%20nouvelle%20monture.',
    discountPercentage: 100,
    targetCategoryId: 'cat-vue',
    startDate: '2026-01-01T00:00:00.000Z',
    endDate: '2026-12-31T23:59:59.000Z',
    isActive: true,
    createdAt: '2026-01-01T08:00:00.000Z',
  },
  {
    id: 'promo-3',
    title: 'Pack Duo Famille & Deuxième Paire',
    description: "Équipez-vous pour toutes les situations : pour une monture achetée, profitez de -50% sur votre seconde paire (vue, solaire ou anti-lumière bleue écran).",
    code: 'DUO-50',
    bannerUrl: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'Nous consulter',
    ctaLink: 'https://wa.me/212770420663?text=Bonjour,%20je%20souhaite%20des%20informations%20sur%20l%27offre%20deuxi%C3%A8me%20paire%20%C3%A0%20-50%25.',
    discountPercentage: 50,
    startDate: '2026-02-01T00:00:00.000Z',
    endDate: '2026-12-31T23:59:59.000Z',
    isActive: true,
    createdAt: '2026-02-01T08:00:00.000Z',
  },
];

export const DEFAULT_BANNERS: Banner[] = [
  {
    id: 'banner-hero-1',
    title: 'Votre optique, votre Élégance entre nos mains',
    subtitle: 'Des montures sélectionnées pour sublimer votre regard.',
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1600&q=85',
    buttonText: 'Découvrir nos lunettes',
    buttonLink: '/catalogue',
    position: 'hero',
    isActive: true,
  },
  {
    id: 'banner-collection-2',
    title: 'Nouvelle Collection Haute Joaillerie & Titane',
    subtitle: 'Cartier, Tom Ford & Ray-Ban : l’art de l’optique d’exception à Casablanca.',
    image: 'https://images.unsplash.com/photo-1509695503492-413ff1d0d6c4?auto=format&fit=crop&w=1600&q=85',
    buttonText: 'Explorer les créateurs',
    buttonLink: '/catalogue?brand=brand-cartier',
    position: 'collection',
    isActive: true,
  },
];

export const DEFAULT_MOVEMENTS: StockMovement[] = [
  {
    id: 'mov-1',
    productId: 'prod-1',
    productName: 'Original Wayfarer Classic',
    productRef: 'RB-2140-901',
    previousQuantity: 6,
    newQuantity: 2,
    change: -4,
    type: 'vente',
    comment: 'Commandes directes en boutique et réservations WhatsApp',
    createdAt: '2026-03-21T16:30:00.000Z',
  },
  {
    id: 'mov-2',
    productId: 'prod-3',
    productName: 'Cartier Première de Cartier',
    productRef: 'CT-0089O-002',
    previousQuantity: 2,
    newQuantity: 1,
    change: -1,
    type: 'vente',
    comment: 'Livraison client VIP Casablanca',
    createdAt: '2026-03-20T11:00:00.000Z',
  },
  {
    id: 'mov-3',
    productId: 'prod-2',
    productName: 'Tom Ford Prestige Optique',
    productRef: 'TF-5295-001',
    previousQuantity: 1,
    newQuantity: 5,
    change: +4,
    type: 'reassort',
    comment: 'Arrivage direct atelier Milan',
    createdAt: '2026-03-18T09:15:00.000Z',
  },
];

export const DEFAULT_MESSAGES: CustomerMessage[] = [
  {
    id: 'msg-1',
    name: 'Karim Benjelloun',
    phone: '+212 661 234 567',
    email: 'k.benjelloun@gmail.com',
    subject: 'Disponibilité Cartier Première Titane',
    message: "Bonjour, je souhaite savoir si la monture Cartier référence CT-0089O-002 est actuellement en stock au magasin pour un essayage demain vers 16h.",
    productId: 'prod-3',
    productName: 'Cartier Première de Cartier',
    status: 'read',
    createdAt: '2026-03-22T10:15:00.000Z',
  },
  {
    id: 'msg-2',
    name: 'Salma Tazi',
    phone: '+212 663 987 654',
    email: 'salma.tazi@outlook.com',
    subject: 'Devis verres progressifs anti-lumière bleue',
    message: "Bonjour Votre Optique, j'ai une ordonnance récente de mon ophtalmologiste. Pouvez-vous me donner une estimation pour la monture Tom Ford TF5295 avec verres progressifs amincis ?",
    productId: 'prod-2',
    productName: 'Tom Ford Prestige Optique',
    status: 'unread',
    createdAt: '2026-03-22T14:40:00.000Z',
  },
];

export const DEFAULT_REVIEWS: ProductReview[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    productName: 'Cartier Santos Classic Or',
    productRef: 'CT-0010S-001',
    authorName: 'Yassine El Amrani',
    city: 'Casablanca (Anfa)',
    rating: 5,
    title: 'Une pièce de haute horlogerie pour le regard',
    comment: 'Finition exceptionnelle, les vis Santos et la dorure 18K sont sublimes. Les verres polarisés offrent un confort visuel incomparable sous le soleil marocain. Service client remarquable.',
    status: 'approved',
    verifiedPurchase: true,
    createdAt: '2026-03-12T11:20:00.000Z',
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    productName: 'Cartier Santos Classic Or',
    productRef: 'CT-0010S-001',
    authorName: 'Dr. Tariq B.',
    city: 'Rabat',
    rating: 5,
    title: 'Authenticité et élégance pure',
    comment: 'Achetée directement après contact WhatsApp. Écrin officiel, certificat et ajustage sur-mesure des branches. Bravo à l’équipe de Votre Optique.',
    status: 'approved',
    verifiedPurchase: true,
    createdAt: '2026-03-18T16:45:00.000Z',
  },
  {
    id: 'rev-3',
    productId: 'prod-2',
    productName: 'Tom Ford Prestige Optique',
    productRef: 'TF-5295-001',
    authorName: 'Mehdi Bennani',
    city: 'Casablanca (Gauthier)',
    rating: 5,
    title: 'Le T emblématique et un confort absolu',
    comment: 'Port quotidien au bureau pour le travail sur écran. Les verres avec filtre anti-lumière bleue soulagent véritablement la fatigue oculaire.',
    status: 'approved',
    verifiedPurchase: true,
    createdAt: '2026-03-15T09:30:00.000Z',
  },
  {
    id: 'rev-4',
    productId: 'prod-4',
    productName: 'Ray-Ban Original Wayfarer',
    productRef: 'RB-2140-901',
    authorName: 'Salma Kettani',
    city: 'Marrakech',
    rating: 5,
    title: 'L’incontournable intemporel',
    comment: 'Reçue rapidement avec étui cuir et chiffonnette Ray-Ban d’origine. L’or et le noir profond sont parfaits.',
    status: 'approved',
    verifiedPurchase: true,
    createdAt: '2026-03-20T14:10:00.000Z',
  },
  {
    id: 'rev-5',
    productId: 'prod-5',
    productName: 'Gucci Oversize Vintage',
    productRef: 'GG-0061S-003',
    authorName: 'Kenza Mansouri',
    city: 'Casablanca (Racine)',
    rating: 5,
    title: 'Design haute couture somptueux',
    comment: 'Monture oversize magnifique qui attire tous les compliments. Merci pour les conseils visagisme personnalisés lors de mon passage en boutique.',
    status: 'approved',
    verifiedPurchase: true,
    createdAt: '2026-03-21T18:00:00.000Z',
  },
  {
    id: 'rev-6',
    productId: 'prod-6',
    productName: 'Persol 714 Steve McQueen',
    productRef: 'PO-0714-24-31',
    authorName: 'Omar Tazi',
    city: 'Tanger',
    rating: 5,
    title: 'Le génie mécanique pliant',
    comment: 'Pliable en 4 sans aucun jeu dans les charnières. Verre minéral d’une transparence absolue. Un chef-d’œuvre d’optique.',
    status: 'approved',
    verifiedPurchase: true,
    createdAt: '2026-03-22T08:15:00.000Z',
  },
  {
    id: 'rev-7',
    productId: 'prod-3',
    productName: 'Cartier Première de Cartier',
    productRef: 'CT-0089O-002',
    authorName: 'Karim Fassi-Fihri',
    city: 'Fès',
    rating: 5,
    title: 'Demande de réglage et confirmation',
    comment: 'J’ai testé ce modèle en showroom. La légèreté du titane japonais associé au poinçon Cartier est saisissante. Hâte de finaliser les verres correcteurs.',
    status: 'pending', // En attente de modération admin
    verifiedPurchase: false,
    createdAt: '2026-03-22T15:30:00.000Z',
  },
];

// Helper to safely read and write to LocalStorage
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Storage write error for key ' + key, err);
  }
}

// Storage API Class
class StorageService {
  constructor() {
    this.ensureInitialized();
  }

  public ensureInitialized(): void {
    if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
      setToStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
      setToStorage(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
      setToStorage(STORAGE_KEYS.BRANDS, DEFAULT_BRANDS);
      setToStorage(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
      setToStorage(STORAGE_KEYS.PROMOTIONS, DEFAULT_PROMOTIONS);
      setToStorage(STORAGE_KEYS.BANNERS, DEFAULT_BANNERS);
      setToStorage(STORAGE_KEYS.STOCK_MOVEMENTS, DEFAULT_MOVEMENTS);
      setToStorage(STORAGE_KEYS.MESSAGES, DEFAULT_MESSAGES);
      setToStorage(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
      setToStorage(STORAGE_KEYS.WISHLIST, []);
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  }

  public resetToDefaults(): void {
    setToStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    setToStorage(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    setToStorage(STORAGE_KEYS.BRANDS, DEFAULT_BRANDS);
    setToStorage(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
    setToStorage(STORAGE_KEYS.PROMOTIONS, DEFAULT_PROMOTIONS);
    setToStorage(STORAGE_KEYS.BANNERS, DEFAULT_BANNERS);
    setToStorage(STORAGE_KEYS.STOCK_MOVEMENTS, DEFAULT_MOVEMENTS);
    setToStorage(STORAGE_KEYS.MESSAGES, DEFAULT_MESSAGES);
    setToStorage(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
    setToStorage(STORAGE_KEYS.WISHLIST, []);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }

  // --- SETTINGS & SOCIAL ---
  public getSettings(): StoreSettings {
    return getFromStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  public updateSettings(settings: StoreSettings): StoreSettings {
    setToStorage(STORAGE_KEYS.SETTINGS, settings);
    return settings;
  }

  // --- CATEGORIES ---
  public getCategories(): Category[] {
    const categories = getFromStorage<Category[]>(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    const products = this.getProducts();
    return categories
      .map((c) => ({
        ...c,
        itemCount: products.filter(
          (p) =>
            p.status === 'active' &&
            (p.categoryId === c.id ||
              (c.slug === 'femme' && (p.gender === 'femme' || p.gender === 'mixte')) ||
              (c.slug === 'homme' && (p.gender === 'homme' || p.gender === 'mixte')) ||
              (c.slug === 'enfant' && p.gender === 'enfant') ||
              (c.slug === 'vue' && p.type === 'vue') ||
              (c.slug === 'soleil' && p.type === 'soleil') ||
              (c.slug === 'nouveautes' && p.isNew)),
        ).length,
      }))
      .sort((a, b) => a.order - b.order);
  }

  public saveCategory(category: Category): Category {
    const list = this.getCategories();
    const index = list.findIndex((c) => c.id === category.id);
    if (index >= 0) {
      list[index] = category;
    } else {
      list.push(category);
    }
    setToStorage(STORAGE_KEYS.CATEGORIES, list);
    return category;
  }

  public deleteCategory(id: string): void {
    const list = this.getCategories().filter((c) => c.id !== id);
    setToStorage(STORAGE_KEYS.CATEGORIES, list);
  }

  // --- BRANDS ---
  public getBrands(): Brand[] {
    return getFromStorage<Brand[]>(STORAGE_KEYS.BRANDS, DEFAULT_BRANDS);
  }

  public saveBrand(brand: Brand): Brand {
    const list = this.getBrands();
    const index = list.findIndex((b) => b.id === brand.id);
    if (index >= 0) {
      list[index] = brand;
    } else {
      list.push(brand);
    }
    setToStorage(STORAGE_KEYS.BRANDS, list);
    return brand;
  }

  public deleteBrand(id: string): void {
    const list = this.getBrands().filter((b) => b.id !== id);
    setToStorage(STORAGE_KEYS.BRANDS, list);
  }

  // --- PRODUCTS ---
  public getProducts(): Product[] {
    return getFromStorage<Product[]>(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
  }

  public getProductById(id: string): Product | undefined {
    return this.getProducts().find((p) => p.id === id || p.slug === id);
  }

  public saveProduct(product: Product): Product {
    const list = this.getProducts();
    const index = list.findIndex((p) => p.id === product.id);
    const now = new Date().toISOString();

    if (index >= 0) {
      const old = list[index];
      // Check if stock changed to log movement
      if (old.stockQuantity !== product.stockQuantity) {
        const change = product.stockQuantity - old.stockQuantity;
        this.addStockMovement({
          productId: product.id,
          productName: product.name,
          productRef: product.reference,
          previousQuantity: old.stockQuantity,
          newQuantity: product.stockQuantity,
          change,
          type: change > 0 ? 'reassort' : 'vente',
          comment: 'Mise à jour directe fiche produit',
        });
      }
      list[index] = { ...product, updatedAt: now };
    } else {
      const newProduct = {
        ...product,
        createdAt: now,
        updatedAt: now,
      };
      list.unshift(newProduct);
      if (product.stockQuantity > 0) {
        this.addStockMovement({
          productId: product.id,
          productName: product.name,
          productRef: product.reference,
          previousQuantity: 0,
          newQuantity: product.stockQuantity,
          change: product.stockQuantity,
          type: 'reassort',
          comment: 'Création initiale du stock',
        });
      }
    }
    setToStorage(STORAGE_KEYS.PRODUCTS, list);
    return product;
  }

  public duplicateProduct(id: string): Product | undefined {
    const product = this.getProductById(id);
    if (!product) return undefined;

    const duplicated: Product = {
      ...product,
      id: 'prod-' + Date.now(),
      slug: `${product.slug}-copie-${Math.floor(Math.random() * 1000)}`,
      reference: `${product.reference}-CP`,
      name: `${product.name} (Copie)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return this.saveProduct(duplicated);
  }

  public archiveProduct(id: string): void {
    const list = this.getProducts();
    const item = list.find((p) => p.id === id);
    if (item) {
      item.status = item.status === 'archived' ? 'active' : 'archived';
      item.updatedAt = new Date().toISOString();
      setToStorage(STORAGE_KEYS.PRODUCTS, list);
    }
  }

  public deleteProduct(id: string): void {
    const list = this.getProducts().filter((p) => p.id !== id);
    setToStorage(STORAGE_KEYS.PRODUCTS, list);
  }

  // Quick stock adjustment (+/- count with reason)
  public adjustStock(
    productId: string,
    deltaOrNewQty: number,
    isAbsolute = false,
    comment = 'Ajustement manuel',
    type: 'reassort' | 'vente' | 'ajustement' | 'retour' = 'ajustement',
  ): Product | undefined {
    const list = this.getProducts();
    const index = list.findIndex((p) => p.id === productId);
    if (index === -1) return undefined;

    const product = list[index];
    const prevQty = product.stockQuantity;
    const nextQty = Math.max(0, isAbsolute ? deltaOrNewQty : prevQty + deltaOrNewQty);
    const change = nextQty - prevQty;

    product.stockQuantity = nextQty;
    product.updatedAt = new Date().toISOString();

    setToStorage(STORAGE_KEYS.PRODUCTS, list);

    this.addStockMovement({
      productId: product.id,
      productName: product.name,
      productRef: product.reference,
      previousQuantity: prevQty,
      newQuantity: nextQty,
      change,
      type,
      comment,
    });

    return product;
  }

  // --- STOCK MOVEMENTS ---
  public getStockMovements(): StockMovement[] {
    return getFromStorage<StockMovement[]>(STORAGE_KEYS.STOCK_MOVEMENTS, DEFAULT_MOVEMENTS);
  }

  public addStockMovement(
    movement: Omit<StockMovement, 'id' | 'createdAt'>,
  ): StockMovement {
    const list = this.getStockMovements();
    const newEntry: StockMovement = {
      ...movement,
      id: 'mov-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      createdAt: new Date().toISOString(),
    };
    list.unshift(newEntry);
    setToStorage(STORAGE_KEYS.STOCK_MOVEMENTS, list.slice(0, 150)); // keep last 150
    return newEntry;
  }

  // --- PROMOTIONS ---
  public getPromotions(): Promotion[] {
    const list = getFromStorage<Promotion[]>(STORAGE_KEYS.PROMOTIONS, DEFAULT_PROMOTIONS);
    const now = new Date().getTime();
    // Auto-disable expired promotions
    return list.map((p) => {
      const end = new Date(p.endDate).getTime();
      if (p.isActive && end < now) {
        return { ...p, isActive: false };
      }
      return p;
    });
  }

  public savePromotion(promo: Promotion): Promotion {
    const list = this.getPromotions();
    const index = list.findIndex((p) => p.id === promo.id);
    if (index >= 0) {
      list[index] = promo;
    } else {
      list.unshift(promo);
    }
    setToStorage(STORAGE_KEYS.PROMOTIONS, list);
    return promo;
  }

  public deletePromotion(id: string): void {
    const list = this.getPromotions().filter((p) => p.id !== id);
    setToStorage(STORAGE_KEYS.PROMOTIONS, list);
  }

  // --- BANNERS ---
  public getBanners(): Banner[] {
    return getFromStorage<Banner[]>(STORAGE_KEYS.BANNERS, DEFAULT_BANNERS);
  }

  public saveBanner(banner: Banner): Banner {
    const list = this.getBanners();
    const index = list.findIndex((b) => b.id === banner.id);
    if (index >= 0) {
      list[index] = banner;
    } else {
      list.unshift(banner);
    }
    setToStorage(STORAGE_KEYS.BANNERS, list);
    return banner;
  }

  public deleteBanner(id: string): void {
    const list = this.getBanners().filter((b) => b.id !== id);
    setToStorage(STORAGE_KEYS.BANNERS, list);
  }

  // --- MESSAGES ---
  public getMessages(): CustomerMessage[] {
    return getFromStorage<CustomerMessage[]>(STORAGE_KEYS.MESSAGES, DEFAULT_MESSAGES);
  }

  public addMessage(msg: Omit<CustomerMessage, 'id' | 'status' | 'createdAt'>): CustomerMessage {
    const list = this.getMessages();
    const newMsg: CustomerMessage = {
      ...msg,
      id: 'msg-' + Date.now(),
      status: 'unread',
      createdAt: new Date().toISOString(),
    };
    list.unshift(newMsg);
    setToStorage(STORAGE_KEYS.MESSAGES, list);
    return newMsg;
  }

  public updateMessageStatus(id: string, status: 'unread' | 'read' | 'replied'): void {
    const list = this.getMessages();
    const item = list.find((m) => m.id === id);
    if (item) {
      item.status = status;
      setToStorage(STORAGE_KEYS.MESSAGES, list);
    }
  }

  public deleteMessage(id: string): void {
    const list = this.getMessages().filter((m) => m.id !== id);
    setToStorage(STORAGE_KEYS.MESSAGES, list);
  }

  // --- WISHLIST ---
  public getWishlist(): string[] {
    return getFromStorage<string[]>(STORAGE_KEYS.WISHLIST, []);
  }

  public isInWishlist(productId: string): boolean {
    const list = this.getWishlist();
    return list.includes(productId);
  }

  public toggleWishlist(productId: string): boolean {
    const list = this.getWishlist();
    const index = list.indexOf(productId);
    let inList = false;
    if (index >= 0) {
      list.splice(index, 1);
      inList = false;
    } else {
      list.unshift(productId);
      inList = true;
    }
    setToStorage(STORAGE_KEYS.WISHLIST, list);
    return inList;
  }

  public addToWishlist(productId: string): void {
    const list = this.getWishlist();
    if (!list.includes(productId)) {
      list.unshift(productId);
      setToStorage(STORAGE_KEYS.WISHLIST, list);
    }
  }

  public removeFromWishlist(productId: string): void {
    const list = this.getWishlist().filter((id) => id !== productId);
    setToStorage(STORAGE_KEYS.WISHLIST, list);
  }

  public clearWishlist(): void {
    setToStorage(STORAGE_KEYS.WISHLIST, []);
  }

  // --- REVIEWS & RATINGS ---
  public getReviews(): ProductReview[] {
    return getFromStorage<ProductReview[]>(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
  }

  public getProductReviews(productId: string, approvedOnly = true): ProductReview[] {
    const all = this.getReviews();
    return all.filter((r) => r.productId === productId && (!approvedOnly || r.status === 'approved'));
  }

  public getProductRatingSummary(productId: string): { average: number; count: number } {
    const approved = this.getProductReviews(productId, true);
    if (approved.length === 0) {
      return { average: 5.0, count: 0 };
    }
    const sum = approved.reduce((acc, r) => acc + r.rating, 0);
    const average = Math.round((sum / approved.length) * 10) / 10;
    return { average, count: approved.length };
  }

  public addReview(review: Omit<ProductReview, 'id' | 'createdAt' | 'status'>): ProductReview {
    const list = this.getReviews();
    const newReview: ProductReview = {
      ...review,
      id: 'rev-' + Date.now(),
      status: 'pending', // Requires admin moderation
      createdAt: new Date().toISOString(),
    };
    list.unshift(newReview);
    setToStorage(STORAGE_KEYS.REVIEWS, list);
    return newReview;
  }

  public updateReviewStatus(id: string, status: ReviewStatus): void {
    const list = this.getReviews();
    const item = list.find((r) => r.id === id);
    if (item) {
      item.status = status;
      setToStorage(STORAGE_KEYS.REVIEWS, list);
    }
  }

  public deleteReview(id: string): void {
    const list = this.getReviews().filter((r) => r.id !== id);
    setToStorage(STORAGE_KEYS.REVIEWS, list);
  }

  // --- AUTHENTICATION & SESSIONS ---
  public getAdminSession(): AdminUser | null {
    return getFromStorage<AdminUser | null>(STORAGE_KEYS.ADMIN_SESSION, null);
  }

  public loginAdmin(email: string, password: string): { success: boolean; user?: AdminUser; error?: string } {
    // Standard secure back-office admin login for the Moroccan optical store
    // Demo credentials: admin@votreoptique.ma / admin123
    const cleanEmail = email.trim().toLowerCase();
    if (
      (cleanEmail === 'admin@votreoptique.ma' || cleanEmail === 'admin@optique.ma' || cleanEmail === 'admin') &&
      password === 'admin123'
    ) {
      const user: AdminUser = {
        id: 'usr-admin-1',
        email: cleanEmail === 'admin' ? 'admin@votreoptique.ma' : cleanEmail,
        name: 'Directeur Opticien - Casablanca',
        role: 'ROLE_ADMIN',
        token: 'token_vo_' + Date.now() + '_' + Math.random().toString(36).substring(2),
      };
      setToStorage(STORAGE_KEYS.ADMIN_SESSION, user);
      return { success: true, user };
    }
    return { success: false, error: 'Identifiants invalides. Utilisez admin@votreoptique.ma / admin123' };
  }

  public logoutAdmin(): void {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  }
}

export const storage = new StorageService();
