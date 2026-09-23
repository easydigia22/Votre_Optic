import React, { useState, useEffect } from 'react';
import { storage } from './services/storage';
import {
  deleteAdminBanner,
  deleteAdminBrand,
  deleteAdminCategory,
  deleteAdminMessage,
  deleteAdminProduct,
  deleteAdminPromotion,
  deleteAdminReview,
  getCurrentAdmin,
  isSupabaseConfigured,
  loadAdminPrivateData,
  loadPublicStoreData,
  saveAdminBanner,
  saveAdminBrand,
  saveAdminCategory,
  saveAdminProduct,
  saveAdminPromotion,
  saveAdminSettings,
  saveAdminStockMovement,
  signOutAdmin,
  updateAdminMessageStatus,
  updateAdminReviewStatus,
} from './services/supabase';
import {
  Product,
  Category,
  Brand,
  Promotion,
  Banner,
  CustomerMessage,
  StockMovement,
  StoreSettings,
  AdminUser,
  ProductReview,
  ReviewStatus,
} from './types';

// Client Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { CategoriesSection } from './components/CategoriesSection';
import { ProductCard } from './components/ProductCard';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { PromotionsPage } from './components/PromotionsPage';
import { ContactPage } from './components/ContactPage';
import { AboutPage } from './components/AboutPage';
import { BrandShowcase } from './components/BrandShowcase';
import { OpticalExpertiseSection } from './components/OpticalExpertiseSection';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';
import { WishlistPage } from './components/WishlistPage';
import { ProfessionalPortal } from './components/ProfessionalPortal';
import { PWAInstallButton } from './components/PWAInstallButton';

// Admin Components
import { AdminLogin } from './admin/AdminLogin';
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminProducts } from './admin/AdminProducts';
import { AdminStock } from './admin/AdminStock';
import { AdminCategories } from './admin/AdminCategories';
import { AdminBrands } from './admin/AdminBrands';
import { AdminPromotions } from './admin/AdminPromotions';
import { AdminBanners } from './admin/AdminBanners';
import { AdminMessages } from './admin/AdminMessages';
import { AdminSocial } from './admin/AdminSocial';
import { AdminSettings } from './admin/AdminSettings';
import { AdminReviews } from './admin/AdminReviews';

import { Sparkles, ArrowRight } from 'lucide-react';

export default function App() {
  // Navigation View State
  const [currentView, setCurrentView] = useState<string>(() => {
    const requestedView = new URLSearchParams(window.location.search).get('view');
    const publicViews = ['home', 'catalogue', 'promotions', 'about', 'contact', 'wishlist', 'professional'];
    return requestedView && publicViews.includes(requestedView) ? requestedView : 'home';
  });
  const [catalogFilters, setCatalogFilters] = useState<Record<string, string>>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // App Data Loaded from Storage
  const [settings, setSettings] = useState<StoreSettings>(() => storage.getSettings());
  const [products, setProducts] = useState<Product[]>(() => storage.getProducts());
  const [categories, setCategories] = useState<Category[]>(() => storage.getCategories());
  const [brands, setBrands] = useState<Brand[]>(() => storage.getBrands());
  const [promotions, setPromotions] = useState<Promotion[]>(() => storage.getPromotions());
  const [banners, setBanners] = useState<Banner[]>(() => storage.getBanners());
  const [messages, setMessages] = useState<CustomerMessage[]>(() => storage.getMessages());
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() =>
    storage.getStockMovements()
  );
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => storage.getWishlist());
  const [reviews, setReviews] = useState<ProductReview[]>(() => storage.getReviews());

  useEffect(() => {
    const handlePopState = () => {
      const requestedView = new URLSearchParams(window.location.search).get('view');
      const publicViews = ['home', 'catalogue', 'promotions', 'about', 'contact', 'wishlist', 'professional'];
      setCurrentView(requestedView && publicViews.includes(requestedView) ? requestedView : 'home');
      setSelectedProduct(null);
      window.scrollTo({ top: 0 });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Admin Auth State
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminActiveTab, setAdminActiveTab] = useState<string>('dashboard');
  const [adminOpenProductModal, setAdminOpenProductModal] = useState<boolean>(false);

  const applyPublicData = (data: Awaited<ReturnType<typeof loadPublicStoreData>>) => {
    storage.hydratePublicData(data);
    setSettings(data.settings ?? storage.getSettings());
    setProducts(data.products.length ? data.products : storage.getProducts());
    setCategories(storage.getCategories());
    setBrands(data.brands.length ? data.brands : storage.getBrands());
    setPromotions(data.promotions.length ? data.promotions : storage.getPromotions());
    setBanners(data.banners.length ? data.banners : storage.getBanners());
    setReviews(data.reviews.length ? data.reviews : storage.getReviews());
  };

  const refreshAdminData = async () => {
    const [publicData, privateData] = await Promise.all([
      loadPublicStoreData(),
      loadAdminPrivateData(),
    ]);
    applyPublicData(publicData);
    storage.hydrateAdminData(privateData);
    setMessages(privateData.messages);
    setStockMovements(privateData.stockMovements);
  };

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let cancelled = false;
    Promise.all([getCurrentAdmin(), loadPublicStoreData()])
      .then(async ([user, data]) => {
        if (cancelled) return;
        setAdminUser(user);
        applyPublicData(data);
        if (user) {
          const privateData = await loadAdminPrivateData();
          if (cancelled) return;
          storage.hydrateAdminData(privateData);
          setMessages(privateData.messages);
          setStockMovements(privateData.stockMovements);
        }
      })
      .catch((error) => {
        console.error('Supabase loading failed; using local cache.', error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Synchronize document title with store SEO settings
  useEffect(() => {
    if (settings.seo?.metaTitle) {
      document.title = settings.seo.metaTitle;
    }
  }, [settings]);

  // Refresh all storage data in memory
  const reloadData = () => {
    setSettings(storage.getSettings());
    setProducts(storage.getProducts());
    setCategories(storage.getCategories());
    setBrands(storage.getBrands());
    setPromotions(storage.getPromotions());
    setBanners(storage.getBanners());
    setMessages(storage.getMessages());
    setStockMovements(storage.getStockMovements());
    setWishlistIds(storage.getWishlist());
    setReviews(storage.getReviews());
  };

  const runAdminMutation = async (remoteAction: () => Promise<void>, localAction: () => void) => {
    try {
      await remoteAction();
      localAction();
      reloadData();
    } catch (error) {
      console.error('Supabase admin operation failed.', error);
      window.alert(error instanceof Error ? error.message : "L'opération Supabase a échoué.");
    }
  };

  // Wishlist actions
  const handleToggleWishlist = (prod: Product) => {
    storage.toggleWishlist(prod.id);
    setWishlistIds(storage.getWishlist());
  };

  const handleRemoveFromWishlist = (productId: string) => {
    storage.removeFromWishlist(productId);
    setWishlistIds(storage.getWishlist());
  };

  const handleClearWishlist = () => {
    storage.clearWishlist();
    setWishlistIds([]);
  };

  // Review moderation actions
  const handleUpdateReviewStatus = (id: string, status: ReviewStatus) => {
    void runAdminMutation(
      () => updateAdminReviewStatus(id, status),
      () => storage.updateReviewStatus(id, status),
    );
  };

  const handleDeleteReview = (id: string) => {
    void runAdminMutation(
      () => deleteAdminReview(id),
      () => storage.deleteReview(id),
    );
  };

  // Navigation Handler
  const handleNavigate = (view: string, param?: Record<string, string>) => {
    setCurrentView(view);
    const nextUrl = view === 'home' ? '/' : `/?view=${encodeURIComponent(view)}`;
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (currentUrl !== nextUrl) {
      window.history.pushState({ view }, '', nextUrl);
    }
    if (param) {
      setCatalogFilters(param);
    } else if (view === 'catalogue') {
      setCatalogFilters({});
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Product actions from Admin
  const handleSaveProduct = (prod: Product) => {
    void runAdminMutation(
      () => saveAdminProduct(prod),
      () => { storage.saveProduct(prod); },
    );
  };

  const handleDuplicateProduct = (id: string) => {
    const source = storage.getProductById(id);
    if (!source) return;
    const now = new Date().toISOString();
    const duplicate: Product = {
      ...source,
      id: 'prod-' + Date.now(),
      slug: `${source.slug}-copie-${Math.floor(Math.random() * 1000)}`,
      reference: `${source.reference}-CP`,
      name: `${source.name} (Copie)`,
      createdAt: now,
      updatedAt: now,
    };
    void runAdminMutation(
      () => saveAdminProduct(duplicate),
      () => { storage.saveProduct(duplicate); },
    );
  };

  const handleArchiveProduct = (id: string) => {
    const product = storage.getProductById(id);
    if (!product) return;
    const updated: Product = {
      ...product,
      status: product.status === 'archived' ? 'active' : 'archived',
      updatedAt: new Date().toISOString(),
    };
    void runAdminMutation(
      () => saveAdminProduct(updated),
      () => { storage.saveProduct(updated); },
    );
  };

  const handleDeleteProduct = (id: string) => {
    void runAdminMutation(
      () => deleteAdminProduct(id),
      () => storage.deleteProduct(id),
    );
  };

  // Stock adjustments
  const handleAdjustStock = (
    productId: string,
    deltaOrNewQty: number,
    isAbsolute = false,
    comment?: string,
    type?: 'reassort' | 'vente' | 'ajustement' | 'retour'
  ) => {
    const product = storage.getProductById(productId);
    if (!product) return;
    const previousQuantity = product.stockQuantity;
    const newQuantity = Math.max(0, isAbsolute ? deltaOrNewQty : previousQuantity + deltaOrNewQty);
    const updated = { ...product, stockQuantity: newQuantity, updatedAt: new Date().toISOString() };
    const movement: StockMovement = {
      id: crypto.randomUUID(),
      productId: product.id,
      productName: product.name,
      productRef: product.reference,
      previousQuantity,
      newQuantity,
      change: newQuantity - previousQuantity,
      type: type ?? 'ajustement',
      comment: comment ?? 'Ajustement manuel',
      createdAt: new Date().toISOString(),
    };
    void runAdminMutation(
      async () => {
        await saveAdminProduct(updated);
        await saveAdminStockMovement(movement);
      },
      () => { storage.adjustStock(productId, deltaOrNewQty, isAbsolute, comment, type); },
    );
  };

  const handleUpdateStockThreshold = (productId: string, threshold: number) => {
    const prod = storage.getProductById(productId);
    if (prod) {
      const updated = { ...prod, lowStockThreshold: threshold };
      void runAdminMutation(
        () => saveAdminProduct(updated),
        () => { storage.saveProduct(updated); },
      );
    }
  };

  // Category actions
  const handleSaveCategory = (cat: Category) => {
    void runAdminMutation(
      () => saveAdminCategory(cat),
      () => { storage.saveCategory(cat); },
    );
  };

  const handleDeleteCategory = (id: string) => {
    void runAdminMutation(
      () => deleteAdminCategory(id),
      () => storage.deleteCategory(id),
    );
  };

  // Brand actions
  const handleSaveBrand = (b: Brand) => {
    void runAdminMutation(
      () => saveAdminBrand(b),
      () => { storage.saveBrand(b); },
    );
  };

  const handleDeleteBrand = (id: string) => {
    void runAdminMutation(
      () => deleteAdminBrand(id),
      () => storage.deleteBrand(id),
    );
  };

  // Promotion actions
  const handleSavePromotion = (p: Promotion) => {
    void runAdminMutation(
      () => saveAdminPromotion(p),
      () => { storage.savePromotion(p); },
    );
  };

  const handleDeletePromotion = (id: string) => {
    void runAdminMutation(
      () => deleteAdminPromotion(id),
      () => storage.deletePromotion(id),
    );
  };

  // Banner actions
  const handleSaveBanner = (b: Banner) => {
    void runAdminMutation(
      () => saveAdminBanner(b),
      () => { storage.saveBanner(b); },
    );
  };

  const handleDeleteBanner = (id: string) => {
    void runAdminMutation(
      () => deleteAdminBanner(id),
      () => storage.deleteBanner(id),
    );
  };

  // Message actions
  const handleUpdateMessageStatus = (id: string, status: 'unread' | 'read' | 'replied') => {
    void runAdminMutation(
      () => updateAdminMessageStatus(id, status),
      () => storage.updateMessageStatus(id, status),
    );
  };

  const handleDeleteMessage = (id: string) => {
    void runAdminMutation(
      () => deleteAdminMessage(id),
      () => storage.deleteMessage(id),
    );
  };

  // Settings actions
  const handleUpdateSettings = (newSettings: StoreSettings) => {
    void runAdminMutation(
      () => saveAdminSettings(newSettings),
      () => { storage.updateSettings(newSettings); },
    );
  };

  const handleResetAllData = () => {
    storage.resetToDefaults();
    reloadData();
  };

  // Admin Logout
  const handleAdminLogout = () => {
    void signOutAdmin().finally(() => {
      storage.logoutAdmin();
      setAdminUser(null);
      setCurrentView('home');
    });
  };

  // Quick Home Category select
  const handleSelectHomeCategory = (cat: Category) => {
    if (cat.slug === 'promotions') {
      handleNavigate('promotions');
    } else if (cat.slug === 'nouveautes') {
      handleNavigate('catalogue', { newOnly: 'true' });
    } else if (cat.slug === 'soleil' || cat.slug === 'vue') {
      handleNavigate('catalogue', { type: cat.slug });
    } else if (cat.slug === 'femme' || cat.slug === 'homme' || cat.slug === 'enfant') {
      handleNavigate('catalogue', { gender: cat.slug });
    } else {
      handleNavigate('catalogue', { categoryId: cat.id });
    }
  };

  // Calculate Badge Counts for Admin
  const lowStockCount = products.filter(
    (p) => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold
  ).length;
  const unreadMessagesCount = messages.filter((m) => m.status === 'unread').length;
  const activePromosCount = promotions.filter((p) => p.isActive).length;
  const pendingReviewsCount = reviews.filter((r) => r.status === 'pending').length;

  // ----------------------------------------------------
  // RENDER ADMIN PORTAL IF VIEW IS ADMIN
  // ----------------------------------------------------
  if (currentView === 'admin' || currentView === 'admin-login') {
    if (!adminUser) {
      return (
        <div className="brand-light">
          <AdminLogin
            onLoginSuccess={(user) => {
              setAdminUser(user);
              setCurrentView('admin');
              setAdminActiveTab('dashboard');
              void refreshAdminData().catch((error) => {
                console.error('Unable to refresh admin data.', error);
              });
            }}
            onBackToStore={() => handleNavigate('home')}
          />
        </div>
      );
    }

    return (
      <div className="brand-light">
        <AdminLayout
          user={adminUser}
          activeTab={adminActiveTab}
          onSelectTab={(tab) => {
            setAdminActiveTab(tab);
            setAdminOpenProductModal(false);
          }}
          onLogout={handleAdminLogout}
          onBackToStore={() => handleNavigate('home')}
          badgeCounts={{
            lowStock: lowStockCount,
            unreadMessages: unreadMessagesCount,
            activePromos: activePromosCount,
            pendingReviews: pendingReviewsCount,
          }}
        >
        {adminActiveTab === 'dashboard' && (
          <AdminDashboard
            products={products}
            categories={categories}
            brands={brands}
            promotions={promotions}
            messages={messages}
            pendingReviews={pendingReviewsCount}
            totalReviews={reviews.length}
            onNavigateTab={(tab) => {
              setAdminActiveTab(tab);
              if (tab === 'products') setAdminOpenProductModal(false);
            }}
            onQuickAddStock={(prodId, qty) => handleAdjustStock(prodId, qty, false, 'Réassort rapide dashboard', 'reassort')}
            onOpenProductForm={() => {
              setAdminActiveTab('products');
              setAdminOpenProductModal(true);
            }}
          />
        )}

        {adminActiveTab === 'products' && (
          <AdminProducts
            products={products}
            brands={brands}
            categories={categories}
            onSaveProduct={handleSaveProduct}
            onDuplicateProduct={handleDuplicateProduct}
            onArchiveProduct={handleArchiveProduct}
            onDeleteProduct={handleDeleteProduct}
            isOpenInitialModal={adminOpenProductModal}
          />
        )}

        {adminActiveTab === 'stock' && (
          <AdminStock
            products={products}
            brands={brands}
            movements={stockMovements}
            onAdjustStock={handleAdjustStock}
            onUpdateThreshold={handleUpdateStockThreshold}
          />
        )}

        {adminActiveTab === 'categories' && (
          <AdminCategories
            categories={categories}
            onSaveCategory={handleSaveCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        )}

        {adminActiveTab === 'brands' && (
          <AdminBrands
            brands={brands}
            onSaveBrand={handleSaveBrand}
            onDeleteBrand={handleDeleteBrand}
          />
        )}

        {adminActiveTab === 'promotions' && (
          <AdminPromotions
            promotions={promotions}
            categories={categories}
            onSavePromotion={handleSavePromotion}
            onDeletePromotion={handleDeletePromotion}
          />
        )}

        {adminActiveTab === 'banners' && (
          <AdminBanners
            banners={banners}
            onSaveBanner={handleSaveBanner}
            onDeleteBanner={handleDeleteBanner}
          />
        )}

        {adminActiveTab === 'messages' && (
          <AdminMessages
            messages={messages}
            onUpdateStatus={handleUpdateMessageStatus}
            onDeleteMessage={handleDeleteMessage}
          />
        )}

        {adminActiveTab === 'reviews' && (
          <AdminReviews
            reviews={reviews}
            onUpdateStatus={handleUpdateReviewStatus}
            onDeleteReview={handleDeleteReview}
          />
        )}

        {adminActiveTab === 'social' && (
          <AdminSocial settings={settings} onUpdateSettings={handleUpdateSettings} />
        )}

        {adminActiveTab === 'settings' && (
          <AdminSettings
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onResetAllData={handleResetAllData}
          />
        )}
        </AdminLayout>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER PUBLIC LUXURY CLIENT STOREFRONT
  // ----------------------------------------------------
  const heroBanner = banners.find((b) => b.position === 'hero' && b.isActive) || banners[0];
  const featuredProducts = products.filter((p) => p.status === 'active' && p.isFeatured).slice(0, 6);

  return (
    <div className="brand-light min-h-screen bg-[#FFFDF7] text-[#171612] flex flex-col font-sans selection:bg-[#C6A53A] selection:text-[#171612]">
      {/* Header with Sticky Behavior & WhatsApp Button */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        settings={settings}
        isAdminLoggedIn={!!adminUser}
        wishlistCount={wishlistIds.length}
      />

      {/* Main Page Routing */}
      <main className="flex-grow">
        {currentView === 'home' && (
          <>
            {/* Hero Section */}
            <HeroSection
              banner={heroBanner}
              settings={settings}
              onExplore={() => handleNavigate('catalogue')}
            />

            {/* Visual Categories Grid */}
            <CategoriesSection
              categories={categories}
              onSelectCategory={handleSelectHomeCategory}
            />

            {/* Featured Selection / Montures Vedettes */}
            <section className="py-20 bg-[#11110F] border-b border-white/5">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#1B1A15] border border-[#C6A53A]/30 text-[#E3C866] text-[10px] font-mono uppercase tracking-widest mb-2">
                      <Sparkles className="w-3 h-3 text-[#C6A53A]" />
                      <span>Sélection Signature</span>
                    </div>
                    <h2 className="font-serif-luxury text-3xl sm:text-4xl text-white font-medium">
                      Modèles d'Exception
                    </h2>
                  </div>

                  <button
                    onClick={() => handleNavigate('catalogue')}
                    className="text-xs uppercase tracking-widest font-semibold text-[#C6A53A] hover:text-[#E3C866] flex items-center gap-1.5 transition-colors self-start md:self-auto"
                  >
                    <span>Voir l'ensemble du catalogue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredProducts.map((prod) => {
                    const brand = brands.find((b) => b.id === prod.brandId);
                    return (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        brand={brand}
                        onSelectProduct={(p) => setSelectedProduct(p)}
                        whatsappNumber={settings.whatsapp}
                        isInWishlist={wishlistIds.includes(prod.id)}
                        onToggleWishlist={handleToggleWishlist}
                      />
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Optical Expertise & Health Vision (from reference poster) */}
            <OpticalExpertiseSection
              onContactClick={() => handleNavigate('contact')}
              whatsappNumber={settings.whatsapp}
            />

            {/* Brand Partners Showcase (Cartier, Tom Ford, Ray-Ban, Gucci, Persol) */}
            <BrandShowcase
              brands={brands}
              onSelectBrand={(brandId) => handleNavigate('catalogue', { brandId })}
            />
          </>
        )}

        {currentView === 'catalogue' && (
          <ProductCatalog
            products={products}
            brands={brands}
            categories={categories}
            onSelectProduct={(p) => setSelectedProduct(p)}
            whatsappNumber={settings.whatsapp}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            initialFilters={{
              search: catalogFilters.search || '',
              gender: (catalogFilters.gender as any) || 'all',
              type: (catalogFilters.type as any) || 'all',
              categoryId: catalogFilters.categoryId || 'all',
              brandId: catalogFilters.brandId || 'all',
              newOnly: catalogFilters.newOnly === 'true',
            }}
          />
        )}

        {currentView === 'wishlist' && (
          <WishlistPage
            wishlistIds={wishlistIds}
            products={products}
            brands={brands}
            settings={settings}
            onRemoveFromWishlist={handleRemoveFromWishlist}
            onClearWishlist={handleClearWishlist}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'promotions' && (
          <PromotionsPage
            promotions={promotions}
            settings={settings}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'about' && (
          <AboutPage settings={settings} onNavigate={handleNavigate} />
        )}

        {currentView === 'contact' && <ContactPage settings={settings} />}

        {currentView === 'professional' && (
          <ProfessionalPortal settings={settings} onNavigate={handleNavigate} />
        )}
      </main>

      {/* Footer */}
      <Footer settings={settings} onNavigate={handleNavigate} />

      {/* Floating Direct WhatsApp Button */}
      <FloatingWhatsAppButton whatsappNumber={settings.whatsapp} />

      {/* Installation remains visible when the page is opened from WhatsApp's mobile browser. */}
      <div className="fixed bottom-5 left-4 z-30 lg:hidden">
        <PWAInstallButton compact />
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          brand={brands.find((b) => b.id === selectedProduct.brandId)}
          category={categories.find((c) => c.id === selectedProduct.categoryId)}
          onClose={() => setSelectedProduct(null)}
          whatsappNumber={settings.whatsapp}
          isInWishlist={wishlistIds.includes(selectedProduct.id)}
          onToggleWishlist={handleToggleWishlist}
        />
      )}
    </div>
  );
}
