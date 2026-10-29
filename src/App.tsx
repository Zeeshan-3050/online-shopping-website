/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Sun,
  Moon,
  Menu,
  X,
  LayoutGrid,
  List,
  ChevronDown,
  ChevronRight,
  Star,
  MoreVertical,
  CircleDot,
  Layers,
  Trash2,
  Plus,
  Minus,
  ArrowUp,
  HelpCircle,
  BookOpen,
  RotateCcw,
  Save,
  Printer,
  Download,
  CheckCircle2,
  ChevronLeft,
  Eye,
  Truck,
  ShieldCheck,
  Headphones,
  Shirt,
  Footprints,
  Coffee,
  Watch
} from 'lucide-react';
import {
  INITIAL_PRODUCTS,
  CATEGORY_TREE,
  HERO_BANNER_IMAGE,
  BENTO_EARBUDS_IMAGE,
  BENTO_SPEAKER_IMAGE,
  STUDIO_HEADPHONES_IMAGE,
  Product,
  ProductReview
} from './data/shopData';
import { ProductArtwork } from './components/ProductArtwork';
import {
  ProductContextMenu,
  RadialPieMenu,
  SystemDialogModal,
  SystemDialogState,
  ProductDetailModal,
  AuthModal,
  ModelessComparisonDialog
} from './components/DialogsAndMenus';
import { CheckoutWizardModal, CartItem } from './components/CheckoutWizardModal';
import { downloadStandaloneBundleFile } from './utils/exportStandaloneBundle';

const STORAGE_KEYS = {
  CART: 'mh_shop_cart_v1',
  WISHLIST: 'mh_shop_wishlist_v1',
  THEME: 'mh_shop_theme_v2_dark_default',
  RECENT: 'mh_shop_recent_v1',
  USER: 'mh_shop_user_v1'
};

export default function App() {
  // ==========================================================================
  // 1. PERSISTENT STATE (Defaults to Luxury Dark-Gold Theme like Reference Pin)
  // ==========================================================================
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'light') return false;
      return true;
    } catch {
      return true;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      { product: INITIAL_PRODUCTS[0], quantity: 1 },
      { product: INITIAL_PRODUCTS[3], quantity: 1 }
    ];
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['prod-elec-02', 'prod-acc-01'];
  });

  const [recentIds, setRecentIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECENT);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['prod-elec-01', 'prod-elec-03', 'prod-acc-01', 'prod-shoe-01'];
  });

  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, darkMode ? 'dark' : 'light');
    } catch {
      // ignore
    }
  }, [darkMode]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlistIds));
    } catch {
      // ignore
    }
  }, [wishlistIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(recentIds));
    } catch {
      // ignore
    }
  }, [recentIds]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  // ==========================================================================
  // 2. SHOPPING FILTER, SEARCH, SORT, VIEW MODE, & PAGINATION STATE
  // ==========================================================================
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');
  const [collectionFilter, setCollectionFilter] = useState<
    'all' | 'featured' | 'bestsellers' | 'new' | 'offers'
  >('all');
  const [maxPricePKR, setMaxPricePKR] = useState<number>(300000);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<
    'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'
  >('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Pagination State (HCI Navigation #2)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(9);

  // Tree Navigation Sidebar State (HCI Navigation #1)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    Electronics: true,
    Clothing: true,
    Shoes: true,
    Books: false,
    'Home & Kitchen': false,
    Accessories: true
  });
  const [categorySearchQuery, setCategorySearchQuery] = useState('');

  // ==========================================================================
  // 3. HCI MENUS & DIALOGS STATE
  // ==========================================================================
  const [openPullDown, setOpenPullDown] = useState<'file' | 'edit' | 'view' | 'help' | null>(null);
  const [isCascadingOpen, setIsCascadingOpen] = useState(false);
  const [cascadingActiveParent, setCascadingActiveParent] = useState<string>('Electronics');
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [showRibbon, setShowRibbon] = useState(true);
  const [activeRibbonTab, setActiveRibbonTab] = useState<'home' | 'products' | 'insert' | 'settings'>('home');
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  const [contextMenu, setContextMenu] = useState<{
    product: Product | null;
    x: number;
    y: number;
  }>({ product: null, x: 0, y: 0 });

  const [pieMenu, setPieMenu] = useState<{
    product: Product | null;
    x: number;
    y: number;
  }>({ product: null, x: 0, y: 0 });

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login'
  });

  const [isModelessOpen, setIsModelessOpen] = useState(false);
  const [compareList, setCompareList] = useState<Product[]>([
    INITIAL_PRODUCTS[0],
    INITIAL_PRODUCTS[2]
  ]);

  const [systemDialog, setSystemDialog] = useState<SystemDialogState>({
    isOpen: false,
    type: 'message',
    title: '',
    message: ''
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = useState(false);
  const [isCheckoutWizardOpen, setIsCheckoutWizardOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterPrefs, setNewsletterPrefs] = useState({ deals: true, hciUpdates: true });
  const [newsletterStatus, setNewsletterStatus] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const sortSelectRef = useRef<HTMLSelectElement>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 3500);
    return () => clearTimeout(t);
  }, [toastMessage]);

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 450);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenPullDown(null);
        setIsCascadingOpen(false);
        setIsMegaMenuOpen(false);
        setIsHamburgerOpen(false);
        setContextMenu({ product: null, x: 0, y: 0 });
        setPieMenu({ product: null, x: 0, y: 0 });
        if (systemDialog.isOpen) {
          setSystemDialog((prev) => ({ ...prev, isOpen: false }));
        } else if (quickViewProduct) {
          setQuickViewProduct(null);
        } else if (isCheckoutWizardOpen) {
          setIsCheckoutWizardOpen(false);
        } else if (isCartDrawerOpen) {
          setIsCartDrawerOpen(false);
        } else if (isWishlistDrawerOpen) {
          setIsWishlistDrawerOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    systemDialog.isOpen,
    quickViewProduct,
    isCheckoutWizardOpen,
    isCartDrawerOpen,
    isWishlistDrawerOpen
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedCategory,
    selectedSubcategory,
    collectionFilter,
    maxPricePKR,
    minRating,
    inStockOnly,
    sortBy
  ]);

  // ==========================================================================
  // 4. FILTERED & SORTED PRODUCTS COMPUTATION
  // ==========================================================================
  const filteredProducts = useMemo(() => {
    const list = products.filter((p) => {
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (selectedSubcategory !== 'All' && p.subcategory !== selectedSubcategory) return false;
      if (collectionFilter === 'featured' && !p.isFeatured) return false;
      if (collectionFilter === 'bestsellers' && !p.isBestSeller) return false;
      if (collectionFilter === 'new' && !p.isNewArrival) return false;
      if (collectionFilter === 'offers' && !p.isDiscounted) return false;
      if (p.price > maxPricePKR) return false;
      if (p.rating < minRating) return false;
      if (inStockOnly && p.stock <= 0) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
        const matchSub = p.subcategory.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        if (!matchName && !matchCat && !matchSub && !matchDesc) return false;
      }
      return true;
    });

    const sorted = [...list];
    if (sortBy === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      sorted.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    }
    return sorted;
  }, [
    products,
    selectedCategory,
    selectedSubcategory,
    collectionFilter,
    maxPricePKR,
    minRating,
    inStockOnly,
    searchQuery,
    sortBy
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const bestSellerShowcase = useMemo(
    () => [products[0], products[3], products[2], products[17]],
    [products]
  );

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartDeliveryFee = cartSubtotal === 0 ? 0 : cartSubtotal >= 25000 ? 0 : 350;
  const cartFinalTotal = cartSubtotal + cartDeliveryFee;

  const wishlistedProducts = useMemo(
    () => products.filter((p) => wishlistIds.includes(p.id)),
    [products, wishlistIds]
  );

  const recentProducts = useMemo(
    () =>
      recentIds
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p))
        .slice(0, 4),
    [products, recentIds]
  );

  // ==========================================================================
  // 5. CORE SHOPPING & DIALOG HANDLERS
  // ==========================================================================
  const handleInspectProduct = (product: Product) => {
    setQuickViewProduct(product);
    setRecentIds((prev) => [product.id, ...prev.filter((id) => id !== product.id)].slice(0, 6));
  };

  const handleAddToCart = (product: Product, requestedQty = 1) => {
    const existing = cart.find((c) => c.product.id === product.id);
    const currentQtyInCart = existing ? existing.quantity : 0;
    const newTotalQty = currentQtyInCart + requestedQty;

    if (newTotalQty > product.stock) {
      setSystemDialog({
        isOpen: true,
        type: 'error',
        title: 'Stock Limit Exceeded',
        message: `Cannot add ${requestedQty} more unit(s) of "${product.name}". Only ${product.stock} unit(s) are available in inventory and you already have ${currentQtyInCart} in your cart.`
      });
      return;
    }

    setCart((prev) => {
      const found = prev.find((c) => c.product.id === product.id);
      if (found) {
        return prev.map((c) =>
          c.product.id === product.id ? { ...c, quantity: c.quantity + requestedQty } : c
        );
      }
      return [...prev, { product, quantity: requestedQty }];
    });

    if (product.stock <= 3) {
      setSystemDialog({
        isOpen: true,
        type: 'warning',
        title: 'Low Inventory Warning',
        message: `"${product.name}" has been added to your cart, but only ${product.stock} units remain in stock. Complete checkout soon to reserve your item.`,
        confirmLabel: 'Proceed to Cart',
        cancelLabel: 'Continue Browsing',
        onConfirm: () => setIsCartDrawerOpen(true)
      });
    } else {
      triggerToast(`Added ${requestedQty} × "${product.name}" to bag`);
    }
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    const item = cart.find((c) => c.product.id === productId);
    if (!item) return;
    const nextQty = item.quantity + delta;

    if (nextQty <= 0) {
      handleAskRemoveFromCart(item.product);
      return;
    }

    if (nextQty > item.product.stock) {
      setSystemDialog({
        isOpen: true,
        type: 'error',
        title: 'Maximum Available Stock Reached',
        message: `Our warehouse currently holds ${item.product.stock} units of "${item.product.name}". You cannot exceed the available sample stock.`
      });
      return;
    }

    setCart((prev) =>
      prev.map((c) => (c.product.id === productId ? { ...c, quantity: nextQty } : c))
    );
    triggerToast(`Updated "${item.product.name}" quantity to ${nextQty}`);
  };

  const handleAskRemoveFromCart = (product: Product) => {
    setSystemDialog({
      isOpen: true,
      type: 'confirm',
      title: 'Remove Item from Shopping Cart?',
      message: `Are you sure you want to remove "${product.name}" from your shopping cart?`,
      confirmLabel: 'Remove Item',
      cancelLabel: 'Keep in Cart',
      onConfirm: () => {
        setCart((prev) => prev.filter((c) => c.product.id !== product.id));
        triggerToast(`Removed "${product.name}" from cart`);
      }
    });
  };

  const handleToggleWishlist = (product: Product) => {
    const exists = wishlistIds.includes(product.id);
    if (exists) {
      setWishlistIds((prev) => prev.filter((id) => id !== product.id));
      triggerToast(`Removed "${product.name}" from wishlist`);
    } else {
      setWishlistIds((prev) => [...prev, product.id]);
      triggerToast(`Saved "${product.name}" to wishlist`);
    }
  };

  const handleAddToCompare = (product: Product) => {
    setIsModelessOpen(true);
    setCompareList((prev) => {
      if (prev.some((p) => p.id === product.id)) {
        triggerToast(`"${product.name}" is already in the Modeless Comparison Panel`);
        return prev;
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), product];
      }
      return [...prev, product];
    });
    triggerToast(`Added "${product.name}" to Modeless Comparison Panel`);
  };

  const handleCopyProductName = (product: Product) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${product.name} — PKR ${product.price.toLocaleString()}`);
    }
    triggerToast(`Copied "${product.name}" to clipboard`);
  };

  const handleShareProduct = (product: Product) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    setSystemDialog({
      isOpen: true,
      type: 'message',
      title: 'Product Share Link Copied',
      message: `A shareable link for "${product.name}" (PKR ${product.price.toLocaleString()}) has been copied to your clipboard.`
    });
  };

  const handleAddReview = (
    productId: string,
    newReview: Omit<ProductReview, 'id' | 'date'>
  ) => {
    const created: ProductReview = {
      ...newReview,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const updatedReviews = [created, ...p.reviews];
        return { ...p, reviews: updatedReviews };
      })
    );
    setQuickViewProduct((prev) =>
      prev && prev.id === productId
        ? { ...prev, reviews: [created, ...prev.reviews] }
        : prev
    );
    triggerToast('Your product review was published!');
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedSubcategory('All');
    setCollectionFilter('all');
    setMaxPricePKR(300000);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy('featured');
    triggerToast('Cleared all search and catalog filters');
  };

  // ==========================================================================
  // 6. "TRY DEMO" ROUTER FOR THE HCI LEARNING GUIDE & ICON MATRIX
  // ==========================================================================
  const handleTriggerDemoAction = (actionId: string) => {
    const scrollToCatalog = () => {
      document.getElementById('section-shop-catalog')?.scrollIntoView({ behavior: 'smooth' });
    };

    switch (actionId) {
      case 'demo-pulldown':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setOpenPullDown('file');
        break;
      case 'demo-dropdown':
        scrollToCatalog();
        setTimeout(() => sortSelectRef.current?.focus(), 400);
        triggerToast('Focused the Catalog Sort Drop-Down Menu');
        break;
      case 'demo-contextmenu':
        scrollToCatalog();
        setContextMenu({
          product: products[0],
          x: Math.min(window.innerWidth / 2, 420),
          y: 260
        });
        break;
      case 'demo-cascading':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setShowRibbon(true);
        setIsCascadingOpen(true);
        break;
      case 'demo-toolbar':
        document.getElementById('shop-workspace-toolbar')?.scrollIntoView({ behavior: 'smooth' });
        triggerToast('Highlighted the Shop Workspace Toolbar Menu');
        break;
      case 'demo-hamburger':
        setIsHamburgerOpen(true);
        break;
      case 'demo-piemenu':
        scrollToCatalog();
        setPieMenu({
          product: products[0],
          x: window.innerWidth / 2,
          y: window.innerHeight / 2
        });
        break;
      case 'demo-ribbon':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setShowRibbon(true);
        setActiveRibbonTab('settings');
        triggerToast('Opened Ribbon Menu — Settings Tab');
        break;
      case 'demo-megamenu':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsMegaMenuOpen(true);
        break;
      case 'demo-tabmenu':
      case 'demo-dialog-modal':
        handleInspectProduct(products[0]);
        break;
      case 'demo-forms':
        setAuthModal({ isOpen: true, mode: 'register' });
        break;
      case 'demo-icons':
        document.getElementById('section-icon-system')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'demo-dialog-modeless':
        setIsModelessOpen(true);
        break;
      case 'demo-dialog-message':
        setSystemDialog({
          isOpen: true,
          type: 'message',
          title: 'Product Added & Preferences Saved',
          message:
            'Product added to cart successfully! Your shopping cart and theme settings are safely persisted in browser LocalStorage.'
        });
        break;
      case 'demo-dialog-confirm':
        setSystemDialog({
          isOpen: true,
          type: 'confirm',
          title: 'Confirm Destructive Action',
          message:
            'This is an HCI Confirmation Dialog Box. Do you want to clear your current filter selection and reset the catalog view?',
          confirmLabel: 'Confirm Reset',
          cancelLabel: 'Cancel',
          onConfirm: resetAllFilters
        });
        break;
      case 'demo-dialog-warning':
        setSystemDialog({
          isOpen: true,
          type: 'warning',
          title: 'Low Stock Alert (Only 2 Units Left)',
          message:
            'The NovaPhone X12 5G and Nordic Ashwood Lounge Chair currently have only 2 units remaining in inventory. Proceed to reserve yours?',
          confirmLabel: 'Inspect Low-Stock Item',
          cancelLabel: 'Dismiss',
          onConfirm: () => handleInspectProduct(products[2])
        });
        break;
      case 'demo-dialog-error':
        setSystemDialog({
          isOpen: true,
          type: 'error',
          title: 'Action Cannot Be Completed (Error Dialog)',
          message:
            'Requested quantity (15 units) exceeds available warehouse stock (5 units) for ZenithBook Pro 14 OLED Ultrabook. Please choose a quantity between 1 and 5.'
        });
        break;
      case 'demo-nav-tree':
        document.getElementById('sidebar-tree-nav')?.scrollIntoView({ behavior: 'smooth' });
        setExpandedCategories({
          Electronics: true,
          Clothing: true,
          Shoes: true,
          Books: true,
          'Home & Kitchen': true,
          Accessories: true
        });
        triggerToast('Expanded all nodes in the Sidebar Tree Navigation');
        break;
      case 'demo-nav-pagination':
        document.getElementById('catalog-pagination-bar')?.scrollIntoView({ behavior: 'smooth' });
        triggerToast('Scrolled to Pagination Navigation Controls');
        break;
      case 'demo-nav-wizard':
        setIsCheckoutWizardOpen(true);
        break;
      case 'demo-usability':
        document.getElementById('section-usability-lab')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'demo-scroll-top':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'demo-focus-search':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => searchInputRef.current?.focus(), 300);
        break;
      case 'demo-open-cart':
        setIsCartDrawerOpen(true);
        break;
      case 'demo-open-wishlist':
        setIsWishlistDrawerOpen(true);
        break;
      case 'demo-close-info':
        triggerToast('Close Icon: Dismisses any active dialog, drawer, or notification (Esc)');
        break;
      case 'demo-toast':
        triggerToast('Live Notification: All 20 PKR catalog items are synced in LocalStorage!');
        break;
      case 'demo-share':
        handleShareProduct(products[0]);
        break;
      default:
        scrollToCatalog();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F3EF] text-stone-900 dark:bg-[#09090B] dark:text-zinc-100">
      {/* ====================================================================
          HCI MENU TYPE #1: PULL-DOWN APPLICATION MENU BAR (File, Edit, View, Help)
         ==================================================================== */}
      <div
        role="menubar"
        aria-label="TuRi 30 Shop Application Pull-Down Menu Bar"
        className="bg-[#050507] text-stone-300 border-b border-zinc-800/80 px-4 lg:px-8 h-9 flex items-center justify-between text-xs select-none relative z-40"
      >
        <div className="flex items-center gap-1">
          <span className="font-mono-tabular text-[11px] text-[#CBA365] font-semibold mr-2 hidden sm:inline">
            HCI Pull-Down Menu:
          </span>

          {/* FILE MENU */}
          <div className="relative">
            <button
              type="button"
              role="menuitem"
              aria-expanded={openPullDown === 'file'}
              onClick={() => setOpenPullDown(openPullDown === 'file' ? null : 'file')}
              className={`px-2.5 py-1 rounded-md hover:bg-zinc-800 hover:text-white transition-colors ${
                openPullDown === 'file' ? 'bg-zinc-800 text-white font-semibold' : ''
              }`}
            >
              File
            </button>
            {openPullDown === 'file' && (
              <div
                role="menu"
                className="absolute left-0 top-full mt-1 w-64 rounded-xl bg-white dark:bg-[#141418] text-stone-800 dark:text-zinc-100 border border-stone-200 dark:border-zinc-700 shadow-2xl py-1.5 z-50"
              >
                <button
                  role="menuitem"
                  onClick={() => {
                    setOpenPullDown(null);
                    setSystemDialog({
                      isOpen: true,
                      type: 'message',
                      title: 'Shopping State Saved',
                      message:
                        'Your shopping cart, wishlist, and theme settings have been saved to LocalStorage.'
                    });
                  }}
                  className="w-full px-3.5 py-2 text-left flex items-center justify-between hover:bg-stone-100 dark:hover:bg-zinc-800"
                >
                  <span className="flex items-center gap-2">
                    <Save className="w-3.5 h-3.5 text-[#CBA365]" />
                    <span>Save Cart Snapshot</span>
                  </span>
                  <span className="text-[10px] font-mono-tabular text-stone-400">Ctrl+S</span>
                </button>
                <button
                  role="menuitem"
                  onClick={() => {
                    setOpenPullDown(null);
                    window.print();
                  }}
                  className="w-full px-3.5 py-2 text-left flex items-center justify-between hover:bg-stone-100 dark:hover:bg-zinc-800"
                >
                  <span className="flex items-center gap-2">
                    <Printer className="w-3.5 h-3.5 text-stone-500" />
                    <span>Print Catalog / Order Receipt</span>
                  </span>
                  <span className="text-[10px] font-mono-tabular text-stone-400">Ctrl+P</span>
                </button>
                <div className="my-1 border-t border-stone-100 dark:border-zinc-800" />
                <button
                  role="menuitem"
                  onClick={() => {
                    setOpenPullDown(null);
                    downloadStandaloneBundleFile('index.html');
                    downloadStandaloneBundleFile('style.css');
                    downloadStandaloneBundleFile('script.js');
                    triggerToast('Downloaded standalone index.html, style.css & script.js');
                  }}
                  className="w-full px-3.5 py-2 text-left flex items-center gap-2 hover:bg-stone-100 dark:hover:bg-zinc-800"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Export index.html, style.css, script.js</span>
                </button>
                <div className="my-1 border-t border-stone-100 dark:border-zinc-800" />
                <button
                  role="menuitem"
                  onClick={() => {
                    setOpenPullDown(null);
                    setSystemDialog({
                      isOpen: true,
                      type: 'confirm',
                      title: 'Reset All Demo Store Data?',
                      message:
                        'This will restore the default sample cart, wishlist, and catalog filters. Do you want to proceed?',
                      confirmLabel: 'Reset Store Data',
                      onConfirm: () => {
                        setCart([{ product: INITIAL_PRODUCTS[0], quantity: 1 }]);
                        setWishlistIds(['prod-elec-02']);
                        resetAllFilters();
                      }
                    });
                  }}
                  className="w-full px-3.5 py-2 text-left flex items-center gap-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo Store State...</span>
                </button>
              </div>
            )}
          </div>

          {/* EDIT MENU */}
          <div className="relative">
            <button
              type="button"
              role="menuitem"
              aria-expanded={openPullDown === 'edit'}
              onClick={() => setOpenPullDown(openPullDown === 'edit' ? null : 'edit')}
              className={`px-2.5 py-1 rounded-md hover:bg-zinc-800 hover:text-white transition-colors ${
                openPullDown === 'edit' ? 'bg-zinc-800 text-white font-semibold' : ''
              }`}
            >
              Edit
            </button>
            {openPullDown === 'edit' && (
              <div
                role="menu"
                className="absolute left-0 top-full mt-1 w-60 rounded-xl bg-white dark:bg-[#141418] text-stone-800 dark:text-zinc-100 border border-stone-200 dark:border-zinc-700 shadow-2xl py-1.5 z-50"
              >
                <button
                  role="menuitem"
                  onClick={() => {
                    setOpenPullDown(null);
                    resetAllFilters();
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-stone-100 dark:hover:bg-zinc-800"
                >
                  Clear All Search & Filters
                </button>
                <button
                  role="menuitem"
                  onClick={() => {
                    setOpenPullDown(null);
                    setAuthModal({ isOpen: true, mode: 'register' });
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-stone-100 dark:hover:bg-zinc-800"
                >
                  Edit Customer Profile / Register...
                </button>
                <button
                  role="menuitem"
                  onClick={() => {
                    setOpenPullDown(null);
                    setSystemDialog({
                      isOpen: true,
                      type: 'confirm',
                      title: 'Clear Entire Wishlist?',
                      message: 'Are you sure you want to remove all saved products from your wishlist?',
                      confirmLabel: 'Clear Wishlist',
                      onConfirm: () => {
                        setWishlistIds([]);
                        triggerToast('Wishlist cleared');
                      }
                    });
                  }}
                  className="w-full px-3.5 py-2 text-left text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  Clear Saved Wishlist...
                </button>
              </div>
            )}
          </div>

          {/* VIEW MENU */}
          <div className="relative">
            <button
              type="button"
              role="menuitem"
              aria-expanded={openPullDown === 'view'}
              onClick={() => setOpenPullDown(openPullDown === 'view' ? null : 'view')}
              className={`px-2.5 py-1 rounded-md hover:bg-zinc-800 hover:text-white transition-colors ${
                openPullDown === 'view' ? 'bg-zinc-800 text-white font-semibold' : ''
              }`}
            >
              View
            </button>
            {openPullDown === 'view' && (
              <div
                role="menu"
                className="absolute left-0 top-full mt-1 w-60 rounded-xl bg-white dark:bg-[#141418] text-stone-800 dark:text-zinc-100 border border-stone-200 dark:border-zinc-700 shadow-2xl py-1.5 z-50"
              >
                <button
                  role="menuitem"
                  onClick={() => {
                    setOpenPullDown(null);
                    setViewMode('grid');
                    triggerToast('Switched to Product Grid View');
                  }}
                  className="w-full px-3.5 py-2 text-left flex items-center justify-between hover:bg-stone-100 dark:hover:bg-zinc-800"
                >
                  <span>Catalog Grid View</span>
                  {viewMode === 'grid' && <CheckCircle2 className="w-3.5 h-3.5 text-[#CBA365]" />}
                </button>
                <button
                  role="menuitem"
                  onClick={() => {
                    setOpenPullDown(null);
                    setViewMode('list');
                    triggerToast('Switched to Product List View');
                  }}
                  className="w-full px-3.5 py-2 text-left flex items-center justify-between hover:bg-stone-100 dark:hover:bg-zinc-800"
                >
                  <span>Catalog Detailed List View</span>
                  {viewMode === 'list' && <CheckCircle2 className="w-3.5 h-3.5 text-[#CBA365]" />}
                </button>
                <div className="my-1 border-t border-stone-100 dark:border-zinc-800" />
                <button
                  role="menuitem"
                  onClick={() => {
                    setOpenPullDown(null);
                    setShowRibbon((r) => !r);
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-stone-100 dark:hover:bg-zinc-800"
                >
                  {showRibbon ? 'Hide Ribbon Command Bar' : 'Show Ribbon Command Bar'}
                </button>
                <button
                  role="menuitem"
                  onClick={() => {
                    setOpenPullDown(null);
                    setDarkMode((d) => !d);
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-stone-100 dark:hover:bg-zinc-800"
                >
                  Toggle {darkMode ? 'Light' : 'Dark'} Appearance
                </button>
              </div>
            )}
          </div>

          {/* HELP MENU */}
          <div className="relative">
            <button
              type="button"
              role="menuitem"
              aria-expanded={openPullDown === 'help'}
              onClick={() => setOpenPullDown(openPullDown === 'help' ? null : 'help')}
              className={`px-2.5 py-1 rounded-md hover:bg-zinc-800 hover:text-white transition-colors ${
                openPullDown === 'help' ? 'bg-zinc-800 text-white font-semibold' : ''
              }`}
            >
              Help
            </button>
            {openPullDown === 'help' && (
              <div
                role="menu"
                className="absolute left-0 top-full mt-1 w-64 rounded-xl bg-white dark:bg-[#141418] text-stone-800 dark:text-zinc-100 border border-stone-200 dark:border-zinc-700 shadow-2xl py-1.5 z-50"
              >
                <button
                  role="menuitem"
                  onClick={() => {
                    setOpenPullDown(null);
                    setIsModelessOpen(true);
                  }}
                  className="w-full px-3.5 py-2 text-left font-semibold text-[#CBA365] hover:bg-stone-100 dark:hover:bg-zinc-800"
                >
                  Open Modeless Shopping Assistant
                </button>
                <div className="my-1 border-t border-stone-100 dark:border-zinc-800" />
                <button
                  role="menuitem"
                  onClick={() => {
                    setOpenPullDown(null);
                    handleTriggerDemoAction('demo-dialog-warning');
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-stone-100 dark:hover:bg-zinc-800"
                >
                  Test Warning Dialog Box
                </button>
                <button
                  role="menuitem"
                  onClick={() => {
                    setOpenPullDown(null);
                    handleTriggerDemoAction('demo-dialog-error');
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-stone-100 dark:hover:bg-zinc-800"
                >
                  Test Error Dialog Box
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 text-[11px] text-zinc-400">
          <span>Complimentary Express Shipping over PKR 25,000</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#CBA365] font-medium">
            2-Year Warranty · 30-Day Hassle-Free Returns
          </span>
        </div>
      </div>

      {/* ====================================================================
          PRIMARY HEADER & NAVIGATION BAR (3-Zone Top Bar Contract)
         ==================================================================== */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#09090B]/95 backdrop-blur-xl border-b border-stone-200/80 dark:border-zinc-800/80">
        <div className="max-w-[1340px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              resetAllFilters();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xl font-bold tracking-tight text-stone-900 dark:text-white font-editorial whitespace-nowrap shrink-0"
          >
            TuRi 30 Shop
          </a>

          {/* Zone 2: 5 Concise Single-Line Navigation Links */}
          <nav
            aria-label="Primary Store Navigation"
            className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-600 dark:text-zinc-300"
          >
            <a
              href="#section-shop-catalog"
              onClick={() => setCollectionFilter('all')}
              className="hover:text-[#CBA365] transition-colors whitespace-nowrap shrink-0"
            >
              Shop Catalog
            </a>

            <button
              type="button"
              onClick={() => {
                setIsMegaMenuOpen((m) => !m);
                setIsCascadingOpen(false);
              }}
              aria-expanded={isMegaMenuOpen}
              className="flex items-center gap-1 hover:text-[#CBA365] transition-colors whitespace-nowrap shrink-0"
            >
              <span>Categories</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            <a
              href="#section-bestsellers"
              className="hover:text-[#CBA365] transition-colors whitespace-nowrap shrink-0"
            >
              Best Sellers
            </a>

            <a
              href="#section-shop-catalog"
              onClick={() => setCollectionFilter('offers')}
              className="hover:text-[#CBA365] transition-colors whitespace-nowrap shrink-0"
            >
              Special Offers
            </a>

            <a
              href="#section-shop-catalog"
              onClick={() => setCollectionFilter('new')}
              className="hover:text-[#CBA365] transition-colors whitespace-nowrap shrink-0"
            >
              New Arrivals
            </a>
          </nav>

          {/* Zone 3: Search & Primary Action Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                document.getElementById('section-shop-catalog')?.scrollIntoView({ behavior: 'smooth' });
                if (searchQuery.trim() && filteredProducts.length === 0) {
                  setSystemDialog({
                    isOpen: true,
                    type: 'error',
                    title: 'No Matching Products Found',
                    message: `Your search for "${searchQuery}" returned 0 products. Try searching for "Headphones", "Laptop", "Boots", "Book", or "Watch".`,
                    confirmLabel: 'Clear Search',
                    onConfirm: () => setSearchQuery('')
                  });
                }
              }}
              className="hidden sm:flex items-center relative"
            >
              <label htmlFor="header-search-input" className="sr-only">
                Search TuRi 30 Shop products
              </label>
              <input
                ref={searchInputRef}
                id="header-search-input"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audio, watches, gear..."
                className="w-48 xl:w-60 h-10 pl-3.5 pr-9 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-100/80 dark:bg-[#121216] text-xs focus:border-[#CBA365] transition-colors"
              />
              <button
                type="submit"
                aria-label="Submit product search"
                title="Search products"
                className="absolute right-1 w-8 h-8 rounded-lg flex items-center justify-center text-stone-500 hover:text-[#CBA365]"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            <button
              type="button"
              onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
              aria-label={currentUser ? `Signed in as ${currentUser.name}` : 'Open customer login and registration'}
              title={currentUser ? `Account: ${currentUser.name}` : 'Sign In / Register'}
              className="w-10 h-10 rounded-xl border border-stone-200 dark:border-zinc-800 flex items-center justify-center hover:border-[#CBA365] transition-colors"
            >
              <User className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsWishlistDrawerOpen(true)}
              aria-label={`Open Wishlist (${wishlistIds.length} items)`}
              title={`Wishlist (${wishlistIds.length} items)`}
              className="relative w-10 h-10 rounded-xl border border-stone-200 dark:border-zinc-800 flex items-center justify-center hover:border-[#CBA365] transition-colors"
            >
              <Heart className="w-4 h-4" />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#CBA365] text-black text-[10px] font-mono-tabular font-bold flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setDarkMode((d) => !d)}
              aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="w-10 h-10 rounded-xl border border-stone-200 dark:border-zinc-800 flex items-center justify-center hover:border-[#CBA365] transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4 text-[#CBA365]" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => setIsCartDrawerOpen(true)}
              aria-label={`Open Shopping Cart (${totalCartItems} items)`}
              title={`Shopping Bag (${totalCartItems} items)`}
              className="h-10 px-4 rounded-xl bg-[#CBA365] hover:bg-[#d8b274] text-[#11100E] text-xs font-bold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Bag ({totalCartItems})</span>
            </button>

            <button
              type="button"
              onClick={() => setIsHamburgerOpen((h) => !h)}
              aria-label="Open Hamburger Navigation Drawer"
              title="Hamburger Menu (Mobile & Drawer Navigation)"
              className="w-10 h-10 rounded-xl border border-stone-200 dark:border-zinc-800 flex items-center justify-center hover:border-[#CBA365] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ==================================================================
            HCI MENU TYPE #9: MEGA MENU (Multi-Column Products & Categories)
           ================================================================== */}
        {isMegaMenuOpen && (
          <div
            role="region"
            aria-label="Products Mega Menu"
            className="border-t border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#121216] shadow-2xl"
          >
            <div className="max-w-[1340px] mx-auto px-4 lg:px-8 py-6">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-stone-100 dark:border-zinc-800">
                <div>
                  <span className="text-xs font-semibold text-[#CBA365]">
                    HCI Menu Type #9 · Multi-Column Mega Menu
                  </span>
                  <h3 className="text-base font-bold text-stone-900 dark:text-zinc-100">
                    Explore All 6 Departments, Subcategories & Seasonal Offers
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMegaMenuOpen(false)}
                  className="min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-medium text-stone-500 hover:bg-stone-100 dark:hover:bg-zinc-800 flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  <span>Close</span>
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {CATEGORY_TREE.map((cat) => (
                  <div key={cat.name} className="space-y-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setSelectedSubcategory('All');
                        setIsMegaMenuOpen(false);
                        document.getElementById('section-shop-catalog')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-sm font-bold text-stone-900 dark:text-zinc-100 hover:text-[#CBA365] text-left block"
                    >
                      {cat.name}
                    </button>
                    <p className="text-[11px] text-stone-500 dark:text-zinc-400 leading-snug">
                      {cat.description}
                    </p>
                    <ul className="space-y-1.5 pt-1">
                      {cat.subcategories.map((sub) => (
                        <li key={sub}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCategory(cat.name);
                              setSelectedSubcategory(sub);
                              setIsMegaMenuOpen(false);
                              document.getElementById('section-shop-catalog')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="text-xs text-stone-600 dark:text-zinc-300 hover:text-[#CBA365] flex items-center gap-1"
                          >
                            <ChevronRight className="w-3 h-3" />
                            <span>{sub}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-2 border-t border-stone-100 dark:border-zinc-800">
                      <span className="text-[11px] font-medium text-[#CBA365]">
                        {cat.featuredOffer}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ====================================================================
          HCI MENU TYPE #8: RIBBON MENU (Home, Products, Insert, Settings Tabs)
         ==================================================================== */}
      {showRibbon && (
        <section
          aria-label="HCI Ribbon Menu"
          className="bg-stone-100 dark:bg-[#101014] border-b border-stone-200 dark:border-zinc-800/80"
        >
          <div className="max-w-[1340px] mx-auto px-4 lg:px-8 py-2">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center flex-wrap gap-3">
                <div className="flex items-center gap-1 bg-stone-200/80 dark:bg-zinc-900 p-1 rounded-lg" role="tablist" aria-label="Ribbon Menu Tabs">
                  <span className="text-[11px] font-mono-tabular font-semibold text-[#CBA365] px-2">
                    Ribbon (#8):
                  </span>
                  {(['home', 'products', 'insert', 'settings'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      role="tab"
                      aria-selected={activeRibbonTab === tab}
                      onClick={() => setActiveRibbonTab(tab)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-colors ${
                        activeRibbonTab === tab
                          ? 'bg-[#CBA365] text-[#11100E] shadow-xs'
                          : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="flex items-center flex-wrap gap-1.5 text-xs">
                  {activeRibbonTab === 'home' && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          document.getElementById('section-shop-catalog')?.scrollIntoView({ behavior: 'smooth' })
                        }
                        className="px-2.5 py-1 rounded-md bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 font-medium hover:border-[#CBA365]"
                      >
                        Catalog ({products.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCheckoutWizardOpen(true)}
                        className="px-2.5 py-1 rounded-md bg-[#CBA365] text-[#11100E] font-bold hover:bg-[#d8b274]"
                      >
                        5-Step Checkout Wizard
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsModelessOpen((m) => !m)}
                        className="px-2.5 py-1 rounded-md bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 font-medium hover:border-[#CBA365]"
                      >
                        Modeless Compare ({compareList.length})
                      </button>
                    </>
                  )}

                  {activeRibbonTab === 'products' && (
                    <>
                      {(['All', ...CATEGORY_TREE.map((c) => c.name)] as const).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(cat);
                            setSelectedSubcategory('All');
                            document.getElementById('section-shop-catalog')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className={`px-2.5 py-1 rounded-md font-medium ${
                            selectedCategory === cat
                              ? 'bg-[#CBA365] text-[#11100E] font-bold'
                              : 'bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </>
                  )}

                  {activeRibbonTab === 'insert' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleInspectProduct(products[0])}
                        className="px-2.5 py-1 rounded-md bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 font-medium hover:border-[#CBA365]"
                      >
                        + Product Review
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthModal({ isOpen: true, mode: 'register' })}
                        className="px-2.5 py-1 rounded-md bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 font-medium hover:border-[#CBA365]"
                      >
                        + Customer Account
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setPieMenu({
                            product: products[0],
                            x: window.innerWidth / 2,
                            y: window.innerHeight / 2
                          })
                        }
                        className="px-2.5 py-1 rounded-md bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 font-medium hover:border-[#CBA365]"
                      >
                        Launch Radial Pie Menu
                      </button>
                    </>
                  )}

                  {activeRibbonTab === 'settings' && (
                    <>
                      <button
                        type="button"
                        onClick={() => setDarkMode((d) => !d)}
                        className="px-2.5 py-1 rounded-md bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 font-medium"
                      >
                        Theme: {darkMode ? 'Obsidian Dark' : 'Warm Alabaster Light'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode((v) => (v === 'grid' ? 'list' : 'grid'))}
                        className="px-2.5 py-1 rounded-md bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 font-medium"
                      >
                        Layout: {viewMode === 'grid' ? 'Grid' : 'List'}
                      </button>
                      <button
                        type="button"
                        onClick={resetAllFilters}
                        className="px-2.5 py-1 rounded-md bg-[#CBA365] text-[#11100E] font-bold"
                      >
                        Reset Catalog Filters
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Right: Cascading Menu Trigger (#4) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCascadingOpen((c) => !c)}
                  aria-expanded={isCascadingOpen}
                  className="px-3 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-stone-300 dark:border-zinc-700 text-xs font-semibold flex items-center gap-1.5 hover:border-[#CBA365]"
                >
                  <span>Cascading Category Menu (#4)</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {isCascadingOpen && (
                  <div
                    role="menu"
                    aria-label="Cascading Category Menu"
                    className="absolute right-0 top-full mt-1 flex rounded-xl bg-white dark:bg-[#141418] border border-stone-200 dark:border-zinc-700 shadow-2xl z-40"
                  >
                    <div className="w-48 py-2 border-r border-stone-100 dark:border-zinc-800">
                      <div className="px-3 py-1 text-[10px] font-mono-tabular text-[#CBA365] font-semibold">
                        Parent Categories
                      </div>
                      {CATEGORY_TREE.map((cat) => (
                        <button
                          key={cat.name}
                          type="button"
                          onMouseEnter={() => setCascadingActiveParent(cat.name)}
                          onClick={() => setCascadingActiveParent(cat.name)}
                          className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between ${
                            cascadingActiveParent === cat.name
                              ? 'bg-amber-50 dark:bg-zinc-800 text-[#CBA365] font-semibold'
                              : 'hover:bg-stone-100 dark:hover:bg-zinc-800/60'
                          }`}
                        >
                          <span>{cat.name}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ))}
                    </div>

                    <div className="w-52 py-2 bg-stone-50/50 dark:bg-[#0D0D10] rounded-r-xl">
                      <div className="px-3 py-1 text-[10px] font-mono-tabular text-stone-400">
                        {cascadingActiveParent} Submenu
                      </div>
                      {CATEGORY_TREE.find((c) => c.name === cascadingActiveParent)?.subcategories.map(
                        (sub) => (
                          <button
                            key={sub}
                            type="button"
                            onClick={() => {
                              setSelectedCategory(cascadingActiveParent);
                              setSelectedSubcategory(sub);
                              setIsCascadingOpen(false);
                              document
                                .getElementById('section-shop-catalog')
                                ?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="w-full px-3.5 py-2 text-left text-xs hover:bg-[#CBA365] hover:text-black transition-colors"
                          >
                            {sub}
                          </button>
                        )
                      )}
                      <div className="mt-2 pt-2 px-3 border-t border-stone-200 dark:border-zinc-800">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategory(cascadingActiveParent);
                            setSelectedSubcategory('All');
                            setIsCascadingOpen(false);
                            document
                              .getElementById('section-shop-catalog')
                              ?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="text-[11px] font-semibold text-[#CBA365] hover:underline"
                        >
                          View All {cascadingActiveParent} →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ====================================================================
          SECTION 1: FULL-BLEED OBSIDIAN & GOLD HERO BANNER ("Be Closer to Every Note")
         ==================================================================== */}
      <section className="relative bg-[#070709] text-white overflow-hidden border-b border-zinc-800/80">
        <div className="max-w-[1340px] mx-auto px-4 lg:px-8 py-14 sm:py-20 lg:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <h1 className="font-editorial text-4xl sm:text-6xl font-medium tracking-tight text-white leading-[1.08]">
                Be Closer to <br />
                Every Note
              </h1>

              <p className="text-sm sm:text-base text-zinc-300 max-w-md leading-relaxed">
                Discover flagship audio gear, mechanical timepieces, and precision essentials crafted for true connoisseurs at TuRi 30 Shop.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById('section-shop-catalog')?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="min-h-[48px] px-8 py-3.5 rounded-lg bg-[#CBA365] hover:bg-[#d8b274] text-[#11100E] text-xs font-bold tracking-widest uppercase flex items-center gap-2.5 transition-all shadow-lg"
                >
                  <span>SHOP NOW</span>
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCollectionFilter('offers');
                    document.getElementById('section-shop-catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="min-h-[48px] px-5 py-3.5 rounded-lg border border-zinc-700 hover:border-[#CBA365] text-zinc-200 hover:text-[#CBA365] text-xs font-semibold tracking-wider uppercase transition-colors"
                >
                  EXPLORE OFFERS
                </button>
              </div>

              {/* 3-Item Horizontal Icon Trust Strip (Exact Match to Reference Pin) */}
              <div className="pt-8 flex flex-wrap items-center gap-6 sm:gap-8 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#CBA365]" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#CBA365]" />
                  <span>2-Year Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-[#CBA365]" />
                  <span>30-Day Returns</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden aspect-16/10 bg-[#070709]">
                <img
                  src={HERO_BANNER_IMAGE}
                  alt="Matte black and brushed champagne gold wireless over-ear headphones on dark black velvet"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#070709] via-transparent to-transparent opacity-65" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          MAIN CONTENT AREA
         ==================================================================== */}
      <main id="top" className="flex-1 max-w-[1340px] w-full mx-auto px-4 lg:px-8 py-12 space-y-16">
        {/* ==================================================================
            SECTION 2: 7-NODE CIRCULAR ICON CATEGORY ROW (Exact Reference Match)
           ================================================================== */}
        <section aria-label="Department Icon Navigation">
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { label: 'Electronics', cat: 'Electronics', Icon: Headphones },
              { label: 'Clothing', cat: 'Clothing', Icon: Shirt },
              { label: 'Shoes', cat: 'Shoes', Icon: Footprints },
              { label: 'Books & HCI', cat: 'Books', Icon: BookOpen },
              { label: 'Home & Kitchen', cat: 'Home & Kitchen', Icon: Coffee },
              { label: 'Accessories', cat: 'Accessories', Icon: Watch },
              { label: 'New Arrivals', cat: 'New', Icon: Star }
            ].map(({ label, cat, Icon }) => {
              const isActive =
                (cat === 'New' && collectionFilter === 'new') ||
                (cat !== 'New' && selectedCategory === cat);
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    if (cat === 'New') {
                      setSelectedCategory('All');
                      setCollectionFilter('new');
                    } else {
                      setSelectedCategory(cat);
                      setSelectedSubcategory('All');
                      setCollectionFilter('all');
                    }
                    document.getElementById('section-shop-catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group flex flex-col items-center justify-center gap-3 py-2 focus:outline-none"
                >
                  <div
                    className={`w-16 h-16 rounded-full border flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-[#CBA365]/15 border-[#CBA365] text-[#CBA365] shadow-md'
                        : 'bg-white dark:bg-[#121216] border-stone-300 dark:border-zinc-800 text-stone-700 dark:text-zinc-300 group-hover:border-[#CBA365] group-hover:text-[#CBA365]'
                    }`}
                  >
                    <Icon className="w-6 h-6 stroke-[1.6]" />
                  </div>
                  <span
                    className={`text-xs font-medium tracking-wide ${
                      isActive
                        ? 'text-[#CBA365] font-semibold'
                        : 'text-stone-700 dark:text-zinc-300 group-hover:text-stone-900 dark:group-hover:text-white'
                    }`}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ==================================================================
            SECTION 3: 3-CARD WARM-TONED SPOTLIGHT BENTO TRIO (Exact Reference Match)
           ================================================================== */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Warm Alabaster Stone (#D8D3CC) */}
          <div
            onClick={() => handleInspectProduct(products[0])}
            className="cursor-pointer group rounded-2xl bg-[#D8D3CC] text-stone-900 p-6 sm:p-7 flex items-center justify-between gap-4 overflow-hidden relative min-h-[230px] transition-transform hover:-translate-y-0.5"
          >
            <div className="space-y-3 z-10 max-w-[55%]">
              <span className="inline-block px-2.5 py-0.5 rounded bg-white/80 text-[10px] font-bold tracking-widest uppercase text-stone-800">
                NEW
              </span>
              <h2 className="text-xl sm:text-2xl font-bold leading-tight text-stone-950">
                Premium Headphones
              </h2>
              <p className="text-xs text-stone-700 leading-relaxed">
                Noise canceled. <br />
                Limitless focus.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-bold tracking-wider uppercase text-stone-950 pt-2 group-hover:translate-x-1 transition-transform">
                <span>EXPLORE</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-xl overflow-hidden shrink-0 shadow-md">
              <img
                src={STUDIO_HEADPHONES_IMAGE}
                alt="Aethel F1 Studio ANC Wireless Headphones"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Card 2: Warm Champagne Sand (#B8A287) */}
          <div
            onClick={() => handleInspectProduct(products[3])}
            className="cursor-pointer group rounded-2xl bg-[#B8A287] text-stone-950 p-6 sm:p-7 flex items-center justify-between gap-4 overflow-hidden relative min-h-[230px] transition-transform hover:-translate-y-0.5"
          >
            <div className="space-y-3 z-10 max-w-[55%]">
              <span className="inline-block px-2.5 py-0.5 rounded bg-white/75 text-[10px] font-bold tracking-widest uppercase text-stone-900">
                BEST SELLER
              </span>
              <h2 className="text-xl sm:text-2xl font-bold leading-tight text-stone-950">
                True Wireless Earbuds
              </h2>
              <p className="text-xs text-stone-800 leading-relaxed">
                Pure freedom. <br />
                Powerful sound.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-bold tracking-wider uppercase text-stone-950 pt-2 group-hover:translate-x-1 transition-transform">
                <span>DISCOVER</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-xl overflow-hidden shrink-0 shadow-md">
              <img
                src={BENTO_EARBUDS_IMAGE}
                alt="PulsePods Pro Lossless True Wireless Earbuds"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Card 3: Rich Espresso Bronze (#3E3027) */}
          <div
            onClick={() => handleInspectProduct(products[16])}
            className="cursor-pointer group rounded-2xl bg-[#3E3027] text-stone-100 p-6 sm:p-7 flex items-center justify-between gap-4 overflow-hidden relative min-h-[230px] transition-transform hover:-translate-y-0.5"
          >
            <div className="space-y-3 z-10 max-w-[55%]">
              <span className="inline-block px-2.5 py-0.5 rounded bg-[#CBA365]/30 text-[10px] font-bold tracking-widest uppercase text-[#ecc98e]">
                LIMITED OFFER
              </span>
              <h2 className="text-xl sm:text-2xl font-bold leading-tight text-white">
                Studio Audio & Timepieces
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed">
                Big presence. <br />
                Anywhere you go.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-bold tracking-wider uppercase text-[#CBA365] pt-2 group-hover:translate-x-1 transition-transform">
                <span>SHOP NOW</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-xl overflow-hidden shrink-0 shadow-md">
              <img
                src={BENTO_SPEAKER_IMAGE}
                alt="Portable Audiophile Speaker & Luxury Gear"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 4: BEST SELLERS 4-COLUMN ROW (Exact Card Design from Reference)
           ================================================================== */}
        <section id="section-bestsellers" className="space-y-5 scroll-mt-24">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold tracking-wider uppercase text-stone-900 dark:text-white">
              BEST SELLERS
            </h2>
            <button
              type="button"
              onClick={() => {
                setCollectionFilter('bestsellers');
                document.getElementById('section-shop-catalog')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs font-semibold tracking-wider uppercase text-stone-500 dark:text-zinc-400 hover:text-[#CBA365] flex items-center gap-1"
            >
              <span>VIEW ALL</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {bestSellerShowcase.map((item) => (
              <article
                key={item.id}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setContextMenu({ product: item, x: e.clientX, y: e.clientY });
                }}
                className="group rounded-2xl bg-white dark:bg-[#121216] border border-stone-200 dark:border-zinc-800/90 hover:border-[#CBA365]/60 p-4 flex flex-col justify-between transition-all hover:-translate-y-0.5"
              >
                <div>
                  <div
                    onClick={() => handleInspectProduct(item)}
                    className="cursor-pointer aspect-4/3 rounded-xl overflow-hidden bg-stone-100 dark:bg-[#19191E] mb-4 relative"
                  >
                    <ProductArtwork
                      product={item}
                      className="transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* 5 Champagne-Gold Stars + Rating Count */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <div className="flex items-center text-[#CBA365]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#CBA365]" />
                      ))}
                    </div>
                    <span className="font-mono-tabular text-stone-500 dark:text-zinc-400 text-[11px]">
                      {item.rating.toFixed(1)} ({item.reviewCount})
                    </span>
                  </div>

                  <h3 className="mt-2 text-sm font-bold text-stone-900 dark:text-white line-clamp-1">
                    <button
                      type="button"
                      onClick={() => handleInspectProduct(item)}
                      className="hover:text-[#CBA365] text-left"
                    >
                      {item.name}
                    </button>
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
                    {item.subcategory}
                  </p>
                </div>

                {/* Bottom Row: Bold Price Left + Square Bordered Cart Icon Button Right */}
                <div className="mt-4 pt-3 flex items-center justify-between">
                  <span className="text-base font-bold font-mono-tabular text-stone-900 dark:text-white">
                    PKR {item.price.toLocaleString()}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(item, 1)}
                    title={`Add ${item.name} to Bag`}
                    aria-label={`Add ${item.name} to Bag`}
                    className="w-10 h-10 rounded-lg border border-stone-300 dark:border-zinc-700 flex items-center justify-center text-stone-700 dark:text-zinc-300 hover:bg-[#CBA365] hover:border-[#CBA365] hover:text-black transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ==================================================================
            SECTION 5: MID-PAGE ACOUSTIC GOLD-WAVE PROMO BANNER (Exact Reference Match)
           ================================================================== */}
        <section className="rounded-2xl bg-[#0B0B0E] border border-zinc-800/90 overflow-hidden relative p-8 sm:p-12 text-white">
          {/* Decorative Gold Frequency Wave Bars */}
          <div
            aria-hidden="true"
            className="hidden lg:flex items-center justify-center gap-1.5 absolute inset-y-0 right-12 opacity-30 pointer-events-none"
          >
            {[18, 34, 52, 28, 68, 92, 48, 80, 36, 60, 24, 44, 72, 38, 20, 14].map((h, i) => (
              <div
                key={i}
                style={{ height: `${h}px` }}
                className="w-1 rounded-full bg-gradient-to-t from-transparent via-[#CBA365] to-transparent"
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-400">
                IMMERSIVE SOUND · UNMATCHED QUALITY
              </p>
              <h2 className="font-editorial text-3xl sm:text-4xl font-medium text-white leading-tight">
                Up to 20% Off on <br />
                Premium Picks
              </h2>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setCollectionFilter('offers');
                    document.getElementById('section-shop-catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="min-h-[44px] px-6 py-3 rounded-lg bg-[#CBA365] hover:bg-[#d8b274] text-[#11100E] text-xs font-bold tracking-widest uppercase inline-flex items-center gap-2 transition-colors"
                >
                  <span>SHOP THE SALE</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="w-64 sm:w-72 aspect-4/3 rounded-xl overflow-hidden">
                <img
                  src={HERO_BANNER_IMAGE}
                  alt="Flagship Aurum & Aethel F1 Headphones on sale"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 6: EDITOR'S PICKS 3-COLUMN HORIZONTAL CARDS (Exact Reference Match)
           ================================================================== */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold tracking-wider uppercase text-stone-900 dark:text-white">
              EDITOR’S PICKS
            </h2>
            <button
              type="button"
              onClick={() =>
                document.getElementById('section-hci-guide')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="text-xs font-semibold tracking-wider uppercase text-stone-500 dark:text-zinc-400 hover:text-[#CBA365] flex items-center gap-1"
            >
              <span>SEE ALL</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                tag: 'GUIDE',
                title: 'How to Choose the Right Studio Headphones',
                img: STUDIO_HEADPHONES_IMAGE,
                onClick: () => handleInspectProduct(products[0])
              },
              {
                tag: 'RECOMMENDED',
                title: 'Top 5 Wireless & Smart Essentials of 2026',
                img: BENTO_EARBUDS_IMAGE,
                onClick: () => handleInspectProduct(products[3])
              },
              {
                tag: 'INSIGHT',
                title: 'Interactive HCI Menus, Dialogs & Ergonomics',
                img: BENTO_SPEAKER_IMAGE,
                onClick: () =>
                  document.getElementById('section-hci-guide')?.scrollIntoView({ behavior: 'smooth' })
              }
            ].map((pick) => (
              <div
                key={pick.title}
                onClick={pick.onClick}
                className="cursor-pointer group rounded-2xl bg-white dark:bg-[#121216] border border-stone-200 dark:border-zinc-800/90 hover:border-[#CBA365]/60 p-5 flex items-center justify-between gap-4 transition-all"
              >
                <div className="space-y-2.5 max-w-[60%]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#CBA365]/20 text-[#CBA365] text-[10px] font-bold tracking-wider uppercase">
                    {pick.tag}
                  </span>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white leading-snug">
                    {pick.title}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-xs text-stone-500 dark:text-zinc-400 group-hover:text-[#CBA365] pt-1">
                    <span>Read More</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-100 dark:bg-zinc-900 shrink-0">
                  <img
                    src={pick.img}
                    alt={pick.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ====================================================================
            SECTION 7: COMPLETE INTERACTIVE SHOP CATALOG WITH TREE NAVIGATION (#1),
               TOOLBAR MENU (#5), DROP-DOWN MENUS (#2), CONTEXT MENU (#3),
               PIE MENU (#7), & PAGINATION (#2)
           ==================================================================== */}
        <section id="section-shop-catalog" className="scroll-mt-24 space-y-6 pt-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-zinc-800">
            <div>
              <span className="text-xs font-semibold text-[#CBA365]">
                Complete 20-Item Interactive Storefront
              </span>
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-stone-500 dark:text-zinc-400 mt-1">
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="hover:text-[#CBA365] font-medium"
                >
                  TuRi 30 Shop
                </button>
                <span aria-hidden="true">/</span>
                <button
                  type="button"
                  onClick={() => setSelectedSubcategory('All')}
                  className="font-semibold text-stone-900 dark:text-zinc-100"
                >
                  {selectedCategory === 'All' ? 'All Departments' : selectedCategory}
                </button>
                {selectedSubcategory !== 'All' && (
                  <>
                    <span aria-hidden="true">/</span>
                    <span className="text-[#CBA365] font-semibold">
                      {selectedSubcategory}
                    </span>
                  </>
                )}
              </nav>
            </div>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-stone-200/75 dark:bg-[#121216] border border-transparent dark:border-zinc-800 overflow-x-auto">
              {(
                [
                  { id: 'all', label: 'All Products' },
                  { id: 'featured', label: 'Featured' },
                  { id: 'bestsellers', label: 'Best Sellers' },
                  { id: 'new', label: 'New Arrivals' },
                  { id: 'offers', label: 'Special Offers' }
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCollectionFilter(tab.id)}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    collectionFilter === tab.id
                      ? 'bg-[#CBA365] text-[#11100E] font-bold shadow-xs'
                      : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* HCI MENU TYPE #5: WORKSPACE TOOLBAR MENU & DROP-DOWN MENUS (#2) */}
          <div
            id="shop-workspace-toolbar"
            role="toolbar"
            aria-label="Shop Workspace Toolbar Menu"
            className="p-3.5 rounded-2xl bg-white dark:bg-[#121216] border border-stone-200/90 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4"
          >
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-xs font-semibold text-[#CBA365] mr-1">
                HCI Toolbar (#5):
              </span>

              <button
                type="button"
                onClick={() => searchInputRef.current?.focus()}
                title="Focus Search Bar"
                aria-label="Focus Search Bar"
                className="w-10 h-10 rounded-xl border border-stone-200 dark:border-zinc-800 flex items-center justify-center hover:border-[#CBA365]"
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setViewMode('grid')}
                title="Grid View"
                aria-label="Switch to Grid View"
                className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                  viewMode === 'grid'
                    ? 'bg-[#CBA365] text-[#11100E] border-[#CBA365]'
                    : 'border-stone-200 dark:border-zinc-800 hover:border-[#CBA365]'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setViewMode('list')}
                title="List View"
                aria-label="Switch to List View"
                className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                  viewMode === 'list'
                    ? 'bg-[#CBA365] text-[#11100E] border-[#CBA365]'
                    : 'border-stone-200 dark:border-zinc-800 hover:border-[#CBA365]'
                }`}
              >
                <List className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsModelessOpen((m) => !m)}
                title="Toggle Modeless Comparison Panel"
                aria-label="Toggle Modeless Comparison Panel"
                className={`h-10 px-3.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 ${
                  isModelessOpen
                    ? 'border-[#CBA365] bg-[#CBA365]/15 text-[#CBA365]'
                    : 'border-stone-200 dark:border-zinc-800 hover:border-[#CBA365]'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Compare ({compareList.length})</span>
              </button>

              <button
                type="button"
                onClick={resetAllFilters}
                title="Reset All Filters & Search"
                aria-label="Reset All Filters & Search"
                className="h-10 px-3.5 rounded-xl border border-stone-200 dark:border-zinc-800 text-xs font-medium hover:border-[#CBA365] flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <div className="flex items-center flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <label htmlFor="toolbar-cat-select" className="text-xs font-medium text-stone-500 dark:text-zinc-400">
                  Department:
                </label>
                <select
                  id="toolbar-cat-select"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubcategory('All');
                  }}
                  className="h-10 px-3 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-900 text-xs font-semibold"
                >
                  <option value="All">All Departments (20)</option>
                  {CATEGORY_TREE.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="toolbar-sort-select" className="text-xs font-medium text-stone-500 dark:text-zinc-400">
                  Sort By:
                </label>
                <select
                  ref={sortSelectRef}
                  id="toolbar-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="h-10 px-3 rounded-xl border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-900 text-xs font-semibold"
                >
                  <option value="featured">Featured & Popularity</option>
                  <option value="price-asc">Price: Low to High (PKR)</option>
                  <option value="price-desc">Price: High to Low (PKR)</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2-Column Layout: Tree Navigation Sidebar (Left) + Product Grid/List (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT SIDEBAR: HCI NAVIGATION ELEMENT #1 (TREE NAVIGATION) & FILTERS */}
            <aside
              id="sidebar-tree-nav"
              aria-label="Category Tree Navigation and Product Filters"
              className="lg:col-span-3 p-5 rounded-2xl bg-white dark:bg-[#121216] border border-stone-200/90 dark:border-zinc-800 space-y-6"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-[#CBA365]">
                    HCI Tree Navigation (#1)
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedCategories({
                        Electronics: true,
                        Clothing: true,
                        Shoes: true,
                        Books: true,
                        'Home & Kitchen': true,
                        Accessories: true
                      })
                    }
                    className="text-[11px] text-stone-500 hover:text-[#CBA365]"
                  >
                    Expand All
                  </button>
                </div>
                <h3 className="text-base font-bold text-stone-900 dark:text-zinc-100">
                  Department Hierarchy
                </h3>

                <div className="mt-3 relative">
                  <label htmlFor="tree-cat-search" className="sr-only">
                    Filter categories in tree
                  </label>
                  <input
                    id="tree-cat-search"
                    type="text"
                    value={categorySearchQuery}
                    onChange={(e) => setCategorySearchQuery(e.target.value)}
                    placeholder="Filter category tree..."
                    className="w-full h-9 pl-3 pr-8 rounded-lg border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-900 text-xs"
                  />
                  {categorySearchQuery && (
                    <button
                      type="button"
                      onClick={() => setCategorySearchQuery('')}
                      aria-label="Clear category filter"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <ul role="tree" className="mt-3 space-y-1 text-xs">
                  <li role="treeitem" aria-selected={selectedCategory === 'All'}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory('All');
                        setSelectedSubcategory('All');
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-left font-semibold flex items-center justify-between ${
                        selectedCategory === 'All'
                          ? 'bg-[#CBA365] text-[#11100E] font-bold'
                          : 'hover:bg-stone-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <span>All Categories</span>
                      <span className="font-mono-tabular text-[11px] opacity-80">{products.length}</span>
                    </button>
                  </li>

                  {CATEGORY_TREE.filter(
                    (cat) =>
                      !categorySearchQuery.trim() ||
                      cat.name.toLowerCase().includes(categorySearchQuery.toLowerCase()) ||
                      cat.subcategories.some((s) =>
                        s.toLowerCase().includes(categorySearchQuery.toLowerCase())
                      )
                  ).map((cat) => {
                    const isExpanded = expandedCategories[cat.name];
                    const catCount = products.filter((p) => p.category === cat.name).length;

                    return (
                      <li key={cat.name} role="treeitem" aria-expanded={isExpanded} className="pt-1">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedCategories((prev) => ({
                                ...prev,
                                [cat.name]: !prev[cat.name]
                              }))
                            }
                            aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${cat.name}`}
                            className="w-8 h-8 rounded-md flex items-center justify-center text-stone-500 hover:bg-stone-100 dark:hover:bg-zinc-800"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCategory(cat.name);
                              setSelectedSubcategory('All');
                              setExpandedCategories((prev) => ({ ...prev, [cat.name]: true }));
                            }}
                            className={`flex-1 px-2.5 py-1.5 rounded-lg text-left font-semibold flex items-center justify-between ${
                              selectedCategory === cat.name && selectedSubcategory === 'All'
                                ? 'bg-[#CBA365]/20 text-[#CBA365]'
                                : 'hover:bg-stone-100 dark:hover:bg-zinc-800'
                            }`}
                          >
                            <span>{cat.name}</span>
                            <span className="font-mono-tabular text-[11px] text-stone-400">{catCount}</span>
                          </button>
                        </div>

                        {isExpanded && (
                          <ul role="group" className="pl-7 pr-1 py-1 space-y-1 border-l border-stone-200 dark:border-zinc-800 ml-4 mt-1">
                            {cat.subcategories.map((sub) => {
                              const subCount = products.filter((p) => p.subcategory === sub).length;
                              const isSubActive =
                                selectedCategory === cat.name && selectedSubcategory === sub;
                              return (
                                <li key={sub} role="treeitem" aria-selected={isSubActive}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedCategory(cat.name);
                                      setSelectedSubcategory(sub);
                                    }}
                                    className={`w-full px-2.5 py-1.5 rounded-md text-left flex items-center justify-between transition-colors ${
                                      isSubActive
                                        ? 'bg-[#CBA365] text-[#11100E] font-bold'
                                        : 'text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800'
                                    }`}
                                  >
                                    <span>{sub}</span>
                                    <span className="font-mono-tabular text-[10px] opacity-75">{subCount}</span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="pt-5 border-t border-stone-200 dark:border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="price-range-slider" className="font-bold text-stone-900 dark:text-zinc-100">
                    Max Price (PKR)
                  </label>
                  <span className="font-mono-tabular font-semibold text-[#CBA365]">
                    PKR {maxPricePKR.toLocaleString()}
                  </span>
                </div>
                <input
                  id="price-range-slider"
                  type="range"
                  min={5000}
                  max={300000}
                  step={5000}
                  value={maxPricePKR}
                  onChange={(e) => setMaxPricePKR(Number(e.target.value))}
                  className="w-full accent-[#CBA365] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono-tabular text-stone-400">
                  <span>PKR 5,000</span>
                  <span>PKR 300,000</span>
                </div>
              </div>

              <div className="pt-5 border-t border-stone-200 dark:border-zinc-800 space-y-2">
                <span className="block text-xs font-bold text-stone-900 dark:text-zinc-100">
                  Minimum Customer Rating
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[0, 4.5, 4.8].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setMinRating(r)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                        minRating === r
                          ? 'bg-[#CBA365] text-[#11100E] border-[#CBA365] font-bold'
                          : 'border-stone-200 dark:border-zinc-800 hover:border-[#CBA365]'
                      }`}
                    >
                      {r === 0 ? 'Any' : `${r}+ ★`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-5 border-t border-stone-200 dark:border-zinc-800">
                <label className="flex items-center gap-2.5 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#CBA365]"
                  />
                  <span>In-Stock Ready to Ship Only</span>
                </label>
              </div>
            </aside>

            {/* RIGHT CATALOG AREA: PRODUCT GRID / LIST + PAGINATION (#2) */}
            <div className="lg:col-span-9 space-y-6">
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-zinc-400">
                <p>
                  Showing <strong className="font-mono-tabular text-stone-900 dark:text-white">{paginatedProducts.length}</strong> of{' '}
                  <strong className="font-mono-tabular text-stone-900 dark:text-white">{filteredProducts.length}</strong> items
                  {searchQuery && (
                    <span>
                      {' '}
                      matching <strong>"{searchQuery}"</strong>
                    </span>
                  )}
                </p>
                <span className="hidden sm:inline text-[11px]">
                  Interactive HCI: <strong>Right-click</strong> any card for Context Menu (#3) · Click <strong>Radial Icon</strong> for Pie Menu (#7)
                </span>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="p-12 rounded-2xl bg-white dark:bg-[#121216] border border-stone-200 dark:border-zinc-800 text-center space-y-4">
                  <p className="text-lg font-bold text-stone-900 dark:text-zinc-100">
                    No Products Match Your Filter Criteria
                  </p>
                  <p className="text-xs text-stone-500 dark:text-zinc-400 max-w-md mx-auto">
                    We couldn’t find any items matching "{searchQuery || selectedSubcategory}". Clear your active search or broaden the PKR price slider.
                  </p>
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#CBA365] text-[#11100E] text-xs font-bold"
                  >
                    Clear Search & Reset Filters
                  </button>
                </div>
              ) : (
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }
                >
                  {paginatedProducts.map((product) => {
                    const isWishlisted = wishlistIds.includes(product.id);
                    return (
                      <article
                        key={product.id}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setContextMenu({
                            product,
                            x: e.clientX,
                            y: e.clientY
                          });
                        }}
                        className={`product-card group bg-white dark:bg-[#121216] border border-stone-200/90 dark:border-zinc-800/90 hover:border-[#CBA365]/60 rounded-2xl p-4 flex transition-all hover:-translate-y-0.5 ${
                          viewMode === 'list' ? 'flex-col sm:flex-row items-stretch gap-5' : 'flex-col justify-between'
                        }`}
                      >
                        {/* Product Studio Image Viewport */}
                        <div
                          className={`relative rounded-xl overflow-hidden bg-stone-100 dark:bg-[#19191E] ${
                            viewMode === 'list' ? 'sm:w-64 aspect-4/3 shrink-0' : 'aspect-4/3 w-full mb-4'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleInspectProduct(product)}
                            className="w-full h-full block text-left focus:outline-none"
                            aria-label={`Inspect details for ${product.name}`}
                          >
                            <ProductArtwork
                              product={product}
                              className="transition-transform duration-500 group-hover:scale-105"
                            />
                          </button>

                          {/* Top-Right Glassmorphic HCI Action Cluster */}
                          <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleInspectProduct(product)}
                              title="Quick View Modal (#1)"
                              aria-label={`Quick view ${product.name}`}
                              className="w-8 h-8 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-[#CBA365] hover:text-black transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setPieMenu({
                                  product,
                                  x: rect.left + rect.width / 2,
                                  y: rect.top + rect.height / 2
                                });
                              }}
                              title="Open Radial Pie Menu (#7)"
                              aria-label={`Open Radial Pie Menu for ${product.name}`}
                              className="w-8 h-8 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-center text-[#CBA365] hover:bg-[#CBA365] hover:text-black transition-colors"
                            >
                              <CircleDot className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setContextMenu({
                                  product,
                                  x: rect.left,
                                  y: rect.bottom + 6
                                });
                              }}
                              title="Open Pop-Up / Context Menu (#3)"
                              aria-label={`Open Context Menu for ${product.name}`}
                              className="w-8 h-8 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-[#CBA365] hover:text-black transition-colors"
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleWishlist(product)}
                              title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                              aria-label={isWishlisted ? `Remove ${product.name} from Wishlist` : `Add ${product.name} to Wishlist`}
                              className="w-8 h-8 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:text-rose-400 transition-colors"
                            >
                              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                            </button>
                          </div>
                        </div>

                        {/* Product Card Body (Exact Reference Pin Style: Gold Stars -> Title -> Subtitle -> Price + Square Cart Button) */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1.5">
                                <div className="flex items-center text-[#CBA365]">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3.5 h-3.5 ${
                                        i < Math.round(product.rating)
                                          ? 'fill-[#CBA365]'
                                          : 'text-stone-300 dark:text-zinc-700'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="font-mono-tabular text-[11px] text-stone-500 dark:text-zinc-400">
                                  {product.rating.toFixed(1)} ({product.reviewCount + product.reviews.length})
                                </span>
                              </div>

                              {product.stock <= 3 && (
                                <span className="text-[11px] text-[#CBA365] font-semibold">
                                  {product.stock} left
                                </span>
                              )}
                            </div>

                            <h3 className="mt-2 text-sm font-bold text-stone-900 dark:text-white line-clamp-1">
                              <button
                                type="button"
                                onClick={() => handleInspectProduct(product)}
                                className="hover:text-[#CBA365] text-left transition-colors"
                              >
                                {product.name}
                              </button>
                            </h3>

                            <p className="mt-0.5 text-xs text-stone-500 dark:text-zinc-400">
                              {product.category} · {product.subcategory}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 flex items-center justify-between gap-2">
                            <div>
                              <span className="text-base font-bold font-mono-tabular text-stone-900 dark:text-white block">
                                PKR {product.price.toLocaleString()}
                              </span>
                              {product.oldPrice && (
                                <span className="text-[11px] font-mono-tabular text-stone-400 line-through">
                                  PKR {product.oldPrice.toLocaleString()}
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAddToCart(product, 1)}
                              title={`Add ${product.name} to Bag`}
                              aria-label={`Add ${product.name} to Bag`}
                              className="w-10 h-10 rounded-lg border border-stone-300 dark:border-zinc-700 flex items-center justify-center text-stone-700 dark:text-zinc-200 hover:bg-[#CBA365] hover:border-[#CBA365] hover:text-black transition-colors shrink-0"
                            >
                              <ShoppingCart className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

              {/* HCI NAVIGATION ELEMENT #2: PAGINATION NAVIGATION */}
              <nav
                id="catalog-pagination-bar"
                aria-label="Catalog Pagination Navigation"
                className="p-4 rounded-2xl bg-white dark:bg-[#121216] border border-stone-200/90 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-zinc-400">
                  <span className="font-semibold text-[#CBA365]">
                    HCI Pagination (#2):
                  </span>
                  <span>
                    Page <strong className="font-mono-tabular text-stone-900 dark:text-white">{currentPage}</strong> of{' '}
                    <strong className="font-mono-tabular text-stone-900 dark:text-white">{totalPages}</strong>
                  </span>
                  <span aria-hidden="true">·</span>
                  <label htmlFor="page-size-select">Show:</label>
                  <select
                    id="page-size-select"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="h-9 px-2.5 rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono-tabular text-xs"
                  >
                    <option value={6}>6 / page</option>
                    <option value={9}>9 / page</option>
                    <option value={12}>12 / page</option>
                    <option value={20}>All 20</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="min-h-[40px] px-3.5 py-1.5 rounded-xl border border-stone-300 dark:border-zinc-700 text-xs font-semibold flex items-center gap-1 disabled:opacity-40 disabled:pointer-events-none hover:border-[#CBA365]"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      aria-current={currentPage === pageNum ? 'page' : undefined}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-xl font-mono-tabular text-xs font-bold transition-colors ${
                        currentPage === pageNum
                          ? 'bg-[#CBA365] text-[#11100E]'
                          : 'border border-stone-200 dark:border-zinc-800 hover:border-[#CBA365]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="min-h-[40px] px-3.5 py-1.5 rounded-xl border border-stone-300 dark:border-zinc-700 text-xs font-semibold flex items-center gap-1 disabled:opacity-40 disabled:pointer-events-none hover:border-[#CBA365]"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION 9: 4-COLUMN SHIELD TRUST BAR & "STAY IN TUNE" NEWSLETTER
               (Exact Bottom Layout from Reference Pin)
           ==================================================================== */}
        <section id="section-contact" className="space-y-8 pt-4">
          {/* 4-Column Trust Strip with Vertical Hairline Dividers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-stone-200 dark:divide-zinc-800/90 py-4 border-y border-stone-200 dark:border-zinc-800/90">
            {[
              { title: 'Premium Quality', sub: 'Crafted to perfection' },
              { title: 'Secure Payments', sub: '100% safe COD & Sandbox' },
              { title: 'Expert Support', sub: 'Here to help anytime' },
              { title: 'Trusted by Audiophiles', sub: 'Loved nationwide' }
            ].map((item) => (
              <div key={item.title} className="px-6 py-3 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full border border-[#CBA365]/40 flex items-center justify-center text-[#CBA365] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-stone-900 dark:text-white">{item.title}</h3>
                  <p className="text-[11px] text-stone-500 dark:text-zinc-400">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* STAY IN TUNE Horizontal Newsletter Box (Exact Match to Reference Pin) */}
          <div className="rounded-2xl bg-white dark:bg-[#121216] border border-stone-200 dark:border-zinc-800/90 p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 space-y-1.5">
                <h2 className="text-lg font-bold tracking-wider uppercase text-stone-900 dark:text-white">
                  STAY IN TUNE
                </h2>
                <p className="text-xs text-stone-500 dark:text-zinc-400 leading-relaxed">
                  Be the first to know about new arrivals, exclusive PKR offers, and HCI design tips.
                </p>
              </div>

              <div className="lg:col-span-7">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(newsletterEmail.trim())) {
                      setSystemDialog({
                        isOpen: true,
                        type: 'error',
                        title: 'Invalid Newsletter Email',
                        message:
                          'Please enter a valid email address (e.g. student@university.edu.pk) to subscribe.'
                      });
                      return;
                    }
                    setNewsletterStatus(`Confirmed! ${newsletterEmail.trim()} is now subscribed.`);
                    setNewsletterEmail('');
                    triggerToast('Subscribed to TuRi 30 Shop Newsletter!');
                  }}
                  className="space-y-3"
                  noValidate
                >
                  {newsletterStatus && (
                    <p role="status" className="text-xs font-semibold text-emerald-500">
                      {newsletterStatus}
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row rounded-xl overflow-hidden border border-stone-300 dark:border-zinc-700 bg-stone-50 dark:bg-[#0B0B0E]">
                    <label htmlFor="newsletter-email" className="sr-only">
                      Enter your email address
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="flex-1 h-12 px-4 bg-transparent text-xs text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="h-12 px-8 bg-[#CBA365] hover:bg-[#d8b274] text-[#11100E] text-xs font-bold tracking-widest uppercase transition-colors shrink-0"
                    >
                      SUBSCRIBE
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-stone-500 dark:text-zinc-400">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newsletterPrefs.deals}
                        onChange={(e) =>
                          setNewsletterPrefs((p) => ({ ...p, deals: e.target.checked }))
                        }
                        className="w-3.5 h-3.5 rounded accent-[#CBA365]"
                      />
                      <span>Exclusive PKR Discounts</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newsletterPrefs.hciUpdates}
                        onChange={(e) =>
                          setNewsletterPrefs((p) => ({ ...p, hciUpdates: e.target.checked }))
                        }
                        className="w-3.5 h-3.5 rounded accent-[#CBA365]"
                      />
                      <span>New Product Releases</span>
                    </label>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ====================================================================
          FOOTER
         ==================================================================== */}
      <footer className="bg-white dark:bg-[#070709] border-t border-stone-200 dark:border-zinc-800/80 py-10 mt-12">
        <div className="max-w-[1340px] mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 dark:text-zinc-400">
          <div>
            <strong className="text-stone-900 dark:text-white font-editorial">TuRi 30 Shop</strong> · Immersive Shopping Hub & Complete HCI Interface Showcase · Prices in PKR
          </div>
          <div className="flex items-center gap-6">
            <a href="#section-shop-catalog" className="hover:text-[#CBA365]">
              Shop Catalog
            </a>
            <a href="#section-bestsellers" className="hover:text-[#CBA365]">
              Best Sellers
            </a>
            <a href="#section-contact" className="hover:text-[#CBA365]">
              Stay in Tune
            </a>
            <button
              type="button"
              onClick={() => {
                downloadStandaloneBundleFile('index.html');
                downloadStandaloneBundleFile('style.css');
                downloadStandaloneBundleFile('script.js');
              }}
              className="text-[#CBA365] hover:underline font-medium"
            >
              Download HTML/CSS/JS Files
            </button>
          </div>
        </div>
      </footer>

      {/* ====================================================================
          SLIDE-OVER HAMBURGER NAVIGATION DRAWER (HCI Menu Type #6)
         ==================================================================== */}
      {isHamburgerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-start"
          role="dialog"
          aria-modal="true"
          aria-label="Hamburger Navigation Drawer"
          onClick={() => setIsHamburgerOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-80 max-w-[85vw] h-full bg-white dark:bg-[#121216] border-r border-stone-200 dark:border-zinc-800 p-6 flex flex-col justify-between overflow-y-auto"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-zinc-800">
                <div>
                  <span className="text-[11px] font-semibold text-[#CBA365] block">
                    HCI Menu Type #6 · Hamburger Drawer
                  </span>
                  <span className="text-lg font-bold font-editorial">TuRi 30 Shop</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsHamburgerOpen(false)}
                  aria-label="Close navigation drawer"
                  className="w-11 h-11 rounded-lg flex items-center justify-center hover:bg-stone-100 dark:hover:bg-zinc-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1 text-sm font-medium">
                {[
                  { label: 'Home', filter: 'all' as const, target: '#top' },
                  { label: 'Shop All Products', filter: 'all' as const, target: '#section-shop-catalog' },
                  { label: 'Featured Collection', filter: 'featured' as const, target: '#section-shop-catalog' },
                  { label: 'Best Sellers', filter: 'bestsellers' as const, target: '#section-bestsellers' },
                  { label: 'New Arrivals', filter: 'new' as const, target: '#section-shop-catalog' },
                  { label: 'Special Offers', filter: 'offers' as const, target: '#section-shop-catalog' },
                  { label: 'Stay in Tune & Contact', filter: 'all' as const, target: '#section-contact' }
                ].map((navItem) => (
                  <a
                    key={navItem.label}
                    href={navItem.target}
                    onClick={() => {
                      setCollectionFilter(navItem.filter);
                      setIsHamburgerOpen(false);
                    }}
                    className="block px-3.5 py-2.5 rounded-lg hover:bg-stone-100 dark:hover:bg-zinc-800"
                  >
                    {navItem.label}
                  </a>
                ))}
              </nav>

              <div className="pt-4 border-t border-stone-200 dark:border-zinc-800 space-y-2">
                <span className="text-xs font-bold text-stone-400 uppercase px-3">Departments</span>
                {CATEGORY_TREE.map((cat) => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setSelectedSubcategory('All');
                      setIsHamburgerOpen(false);
                      document.getElementById('section-shop-catalog')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs font-semibold rounded-lg hover:bg-stone-100 dark:hover:bg-zinc-800 flex items-center justify-between"
                  >
                    <span>{cat.name}</span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-stone-200 dark:border-zinc-800 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setIsHamburgerOpen(false);
                  setAuthModal({ isOpen: true, mode: 'login' });
                }}
                className="w-full min-h-[44px] px-4 py-2 rounded-lg bg-[#CBA365] text-[#11100E] text-xs font-bold"
              >
                {currentUser ? `Account: ${currentUser.name}` : 'Sign In / Create Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          SLIDE-OVER SHOPPING CART DRAWER
         ==================================================================== */}
      {isCartDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Shopping Cart Drawer"
          onClick={() => setIsCartDrawerOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md h-full bg-white dark:bg-[#121216] border-l border-stone-200 dark:border-zinc-800 flex flex-col justify-between"
          >
            <div className="px-6 py-4 border-b border-stone-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#CBA365]">
                  Persisted in LocalStorage
                </span>
                <h2 className="text-lg font-bold text-stone-900 dark:text-zinc-100">
                  Shopping Bag ({totalCartItems} {totalCartItems === 1 ? 'item' : 'items'})
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(false)}
                aria-label="Close shopping cart"
                className="w-11 h-11 rounded-lg flex items-center justify-center hover:bg-stone-100 dark:hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="p-8 text-center space-y-4">
                <ShoppingCart className="w-12 h-12 text-stone-300 dark:text-zinc-700 mx-auto" />
                <p className="text-base font-bold text-stone-900 dark:text-zinc-100">
                  Your Shopping Bag is Empty
                </p>
                <p className="text-xs text-stone-500 dark:text-zinc-400">
                  Browse our 6 product departments to add electronics, clothing, shoes, books, or espresso gear.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#CBA365] text-[#11100E] text-xs font-bold"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {cart.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="p-3.5 rounded-xl border border-stone-200 dark:border-zinc-800 flex gap-3.5"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-stone-100 dark:bg-zinc-800 shrink-0">
                        <ProductArtwork product={product} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-xs font-bold text-stone-900 dark:text-zinc-100 truncate">
                            {product.name}
                          </h3>
                          <button
                            type="button"
                            onClick={() => handleAskRemoveFromCart(product)}
                            title="Remove item (Confirmation Dialog)"
                            aria-label={`Remove ${product.name} from cart`}
                            className="text-stone-400 hover:text-rose-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-[11px] font-mono-tabular text-stone-500 dark:text-zinc-400 mt-0.5">
                          Unit Price: PKR {product.price.toLocaleString()} · Max Stock: {product.stock}
                        </p>

                        <div className="mt-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleUpdateCartQuantity(product.id, -1)}
                              aria-label="Decrease quantity"
                              className="w-8 h-8 rounded-md border border-stone-300 dark:border-zinc-700 flex items-center justify-center hover:bg-stone-100 dark:hover:bg-zinc-800"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-7 text-center font-mono-tabular text-xs font-bold">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateCartQuantity(product.id, 1)}
                              aria-label="Increase quantity"
                              className="w-8 h-8 rounded-md border border-stone-300 dark:border-zinc-700 flex items-center justify-center hover:bg-stone-100 dark:hover:bg-zinc-800"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <span className="text-xs font-mono-tabular font-bold text-stone-900 dark:text-zinc-100">
                            PKR {(product.price * quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-stone-50 dark:bg-[#0B0B0E] border-t border-stone-200 dark:border-zinc-800 space-y-3">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-stone-600 dark:text-zinc-400">
                      <span>Subtotal</span>
                      <span className="font-mono-tabular">PKR {cartSubtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-stone-600 dark:text-zinc-400">
                      <span>Demo Courier Delivery Fee</span>
                      <span className="font-mono-tabular">
                        {cartDeliveryFee === 0
                          ? 'FREE (Orders > PKR 25k)'
                          : `PKR ${cartDeliveryFee.toLocaleString()}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-stone-900 dark:text-zinc-100 pt-2 border-t border-stone-200 dark:border-zinc-800">
                      <span>Final Total</span>
                      <span className="font-mono-tabular text-[#CBA365]">
                        PKR {cartFinalTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCartDrawerOpen(false)}
                      className="min-h-[44px] px-3 py-2 rounded-xl border border-stone-300 dark:border-zinc-700 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-zinc-800"
                    >
                      Continue Shopping
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCartDrawerOpen(false);
                        setIsCheckoutWizardOpen(true);
                      }}
                      className="min-h-[44px] px-4 py-2 rounded-xl bg-[#CBA365] hover:bg-[#d8b274] text-[#11100E] text-xs font-bold"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          SLIDE-OVER WISHLIST DRAWER
         ==================================================================== */}
      {isWishlistDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Saved Wishlist Drawer"
          onClick={() => setIsWishlistDrawerOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md h-full bg-white dark:bg-[#121216] border-l border-stone-200 dark:border-zinc-800 flex flex-col justify-between"
          >
            <div className="px-6 py-4 border-b border-stone-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#CBA365]">
                  Saved Locally
                </span>
                <h2 className="text-lg font-bold text-stone-900 dark:text-zinc-100">
                  Your Wishlist ({wishlistedProducts.length})
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsWishlistDrawerOpen(false)}
                aria-label="Close wishlist"
                className="w-11 h-11 rounded-lg flex items-center justify-center hover:bg-stone-100 dark:hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {wishlistedProducts.length === 0 ? (
              <div className="p-8 text-center space-y-4">
                <Heart className="w-12 h-12 text-stone-300 dark:text-zinc-700 mx-auto" />
                <p className="text-base font-bold text-stone-900 dark:text-zinc-100">
                  Your Wishlist is Empty
                </p>
                <p className="text-xs text-stone-500 dark:text-zinc-400">
                  Click the Heart icon on any product card to save items for later comparison or purchase.
                </p>
                <button
                  type="button"
                  onClick={() => setIsWishlistDrawerOpen(false)}
                  className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#CBA365] text-[#11100E] text-xs font-bold"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-3.5">
                  {wishlistedProducts.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border border-stone-200 dark:border-zinc-800 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-100 dark:bg-zinc-800 shrink-0">
                          <ProductArtwork product={item} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-xs font-bold text-stone-900 dark:text-zinc-100 truncate">
                            {item.name}
                          </h3>
                          <p className="text-xs font-mono-tabular text-[#CBA365] font-semibold mt-0.5">
                            PKR {item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            handleAddToCart(item, 1);
                            setWishlistIds((prev) => prev.filter((id) => id !== item.id));
                          }}
                          className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#CBA365] text-[#11100E] text-xs font-bold"
                        >
                          Move to Bag
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleWishlist(item)}
                          aria-label={`Remove ${item.name} from wishlist`}
                          className="p-2 text-stone-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 border-t border-stone-200 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => {
                      setSystemDialog({
                        isOpen: true,
                        type: 'confirm',
                        title: 'Clear Entire Wishlist?',
                        message: 'Are you sure you want to remove all items from your saved wishlist?',
                        confirmLabel: 'Clear All',
                        onConfirm: () => {
                          setWishlistIds([]);
                          triggerToast('Cleared wishlist');
                        }
                      });
                    }}
                    className="w-full min-h-[44px] py-2 rounded-lg border border-stone-300 dark:border-zinc-700 text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  >
                    Clear Wishlist
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          ALL CONTEXTUAL MENUS & DIALOG BOXES
         ==================================================================== */}
      <ProductContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        product={contextMenu.product}
        onClose={() => setContextMenu({ product: null, x: 0, y: 0 })}
        onQuickView={handleInspectProduct}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onCopyName={handleCopyProductName}
        onAddToCompare={handleAddToCompare}
        onOpenPieMenu={(prod, px, py) => setPieMenu({ product: prod, x: px, y: py })}
        isWishlisted={Boolean(contextMenu.product && wishlistIds.includes(contextMenu.product.id))}
      />

      <RadialPieMenu
        product={pieMenu.product}
        x={pieMenu.x}
        y={pieMenu.y}
        onClose={() => setPieMenu({ product: null, x: 0, y: 0 })}
        onQuickView={handleInspectProduct}
        onToggleWishlist={handleToggleWishlist}
        onShare={handleShareProduct}
        onAddToCart={handleAddToCart}
        isWishlisted={Boolean(pieMenu.product && wishlistIds.includes(pieMenu.product.id))}
      />

      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={Boolean(quickViewProduct && wishlistIds.includes(quickViewProduct.id))}
        onAddReview={handleAddReview}
      />

      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal((prev) => ({ ...prev, isOpen: false }))}
        onSuccessAuth={(user) => {
          setCurrentUser(user);
          setSystemDialog({
            isOpen: true,
            type: 'message',
            title: `Welcome to TuRi 30 Shop, ${user.name}!`,
            message: `You are now signed in with ${user.email}. Your shopping preferences are active.`
          });
        }}
        onWarnUnsaved={(discardCb) => {
          setSystemDialog({
            isOpen: true,
            type: 'warning',
            title: 'Unsaved Form Changes Warning',
            message:
              'You have entered unsaved information in the customer form. Are you sure you want to close and discard your changes?',
            confirmLabel: 'Discard Changes',
            cancelLabel: 'Keep Editing',
            onConfirm: discardCb
          });
        }}
      />

      <ModelessComparisonDialog
        isOpen={isModelessOpen}
        onClose={() => setIsModelessOpen(false)}
        compareList={compareList}
        onRemoveCompare={(id) => setCompareList((prev) => prev.filter((p) => p.id !== id))}
        onClearCompare={() => setCompareList([])}
        onAddToCart={handleAddToCart}
        onOpenHCIGuide={() =>
          document.getElementById('section-shop-catalog')?.scrollIntoView({ behavior: 'smooth' })
        }
      />

      <CheckoutWizardModal
        isOpen={isCheckoutWizardOpen}
        onClose={() => setIsCheckoutWizardOpen(false)}
        cart={cart}
        onCompleteOrder={(orderRef, totalPKR) => {
          setCart([]);
          triggerToast(`Order ${orderRef} (PKR ${totalPKR.toLocaleString()}) completed!`);
        }}
        onTriggerErrorDialog={(title, message) =>
          setSystemDialog({
            isOpen: true,
            type: 'error',
            title,
            message
          })
        }
      />

      <SystemDialogModal
        dialog={systemDialog}
        onClose={() => setSystemDialog((prev) => ({ ...prev, isOpen: false }))}
      />

      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 max-w-sm px-4 py-3 rounded-xl bg-[#141418] text-white shadow-2xl border border-[#CBA365]/50 flex items-center gap-3 text-xs font-semibold"
        >
          <CheckCircle2 className="w-4 h-4 text-[#CBA365] shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            aria-label="Close notification"
            className="ml-2 opacity-70 hover:opacity-100"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="fixed bottom-5 right-5 z-30 flex flex-col gap-2">
        {!isModelessOpen && (
          <button
            type="button"
            onClick={() => setIsModelessOpen(true)}
            title="Open Floating Modeless Comparison & Help Dialog (#2)"
            aria-label="Open Floating Modeless Comparison and Help Dialog"
            className="w-11 h-11 rounded-full bg-[#CBA365] text-[#11100E] shadow-lg flex items-center justify-center hover:bg-[#d8b274] transition-transform hover:scale-105"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        )}

        {showBackToTop && (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            title="Back to Top"
            aria-label="Scroll back to top"
            className="w-11 h-11 rounded-full bg-[#141418] text-[#CBA365] shadow-lg border border-zinc-700 flex items-center justify-center hover:border-[#CBA365] transition-transform hover:scale-105"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
