import React, { useState, useEffect } from 'react';
import {
  X,
  Eye,
  Heart,
  Share2,
  ShoppingCart,
  Copy,
  Layers,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Star,
  Plus,
  Minus,
  EyeOff,
  RotateCcw,
  Trash2,
  Minimize2,
  Maximize2,
  CircleDot
} from 'lucide-react';
import { Product, ProductReview } from '../data/shopData';
import { ProductArtwork } from './ProductArtwork';

export type SystemDialogType = 'message' | 'confirm' | 'warning' | 'error';

export interface SystemDialogState {
  isOpen: boolean;
  type: SystemDialogType;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
}

// ============================================================================
// 1. POP-UP / CONTEXT MENU (HCI Menu Type #3)
// ============================================================================
interface ContextMenuProps {
  x: number;
  y: number;
  product: Product | null;
  onClose: () => void;
  onQuickView: (p: Product) => void;
  onToggleWishlist: (p: Product) => void;
  onAddToCart: (p: Product, qty: number) => void;
  onCopyName: (p: Product) => void;
  onAddToCompare: (p: Product) => void;
  onOpenPieMenu: (p: Product, x: number, y: number) => void;
  isWishlisted: boolean;
}

export const ProductContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  product,
  onClose,
  onQuickView,
  onToggleWishlist,
  onAddToCart,
  onCopyName,
  onAddToCompare,
  onOpenPieMenu,
  isWishlisted
}) => {
  if (!product) return null;

  const safeX = typeof window !== 'undefined' ? Math.min(x, window.innerWidth - 250) : x;
  const safeY = typeof window !== 'undefined' ? Math.min(y, window.innerHeight - 280) : y;

  return (
    <div
      className="fixed inset-0 z-50"
      onClick={onClose}
      onContextMenu={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <div
        role="menu"
        aria-label={`Context menu for ${product.name}`}
        style={{ top: `${Math.max(12, safeY)}px`, left: `${Math.max(12, safeX)}px` }}
        onClick={(e) => e.stopPropagation()}
        className="fixed w-60 rounded-xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 shadow-2xl py-2 text-sm text-stone-800 dark:text-zinc-100"
      >
        <div className="px-3.5 py-2 border-b border-stone-100 dark:border-zinc-800">
          <p className="text-[11px] font-medium text-amber-700 dark:text-amber-400">
            HCI Pop-Up / Context Menu
          </p>
          <p className="font-semibold truncate text-xs mt-0.5">{product.name}</p>
        </div>

        <button
          role="menuitem"
          onClick={() => {
            onQuickView(product);
            onClose();
          }}
          className="w-full px-3.5 py-2.5 text-left flex items-center gap-2.5 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <Eye className="w-4 h-4 text-stone-500" />
          <span>View Product Details</span>
        </button>

        <button
          role="menuitem"
          onClick={() => {
            onOpenPieMenu(product, safeX + 90, safeY + 90);
            onClose();
          }}
          className="w-full px-3.5 py-2.5 text-left flex items-center gap-2.5 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <CircleDot className="w-4 h-4 text-amber-600" />
          <span>Open Radial Pie Menu</span>
        </button>

        <button
          role="menuitem"
          onClick={() => {
            onToggleWishlist(product);
            onClose();
          }}
          className="w-full px-3.5 py-2.5 text-left flex items-center gap-2.5 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-stone-500'}`} />
          <span>{isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
        </button>

        <button
          role="menuitem"
          onClick={() => {
            onAddToCompare(product);
            onClose();
          }}
          className="w-full px-3.5 py-2.5 text-left flex items-center gap-2.5 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <Layers className="w-4 h-4 text-stone-500" />
          <span>Compare in Modeless Panel</span>
        </button>

        <button
          role="menuitem"
          onClick={() => {
            onCopyName(product);
            onClose();
          }}
          className="w-full px-3.5 py-2.5 text-left flex items-center gap-2.5 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <Copy className="w-4 h-4 text-stone-500" />
          <span>Copy Product Name</span>
        </button>

        <div className="my-1 border-t border-stone-100 dark:border-zinc-800" />

        <button
          role="menuitem"
          onClick={() => {
            onAddToCart(product, 1);
            onClose();
          }}
          className="w-full px-3.5 py-2.5 text-left flex items-center gap-2.5 font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Shopping Cart</span>
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// 2. PIE MENU / RADIAL CONTEXTUAL MENU (HCI Menu Type #7)
// ============================================================================
interface PieMenuProps {
  product: Product | null;
  x: number;
  y: number;
  onClose: () => void;
  onQuickView: (p: Product) => void;
  onToggleWishlist: (p: Product) => void;
  onShare: (p: Product) => void;
  onAddToCart: (p: Product, qty: number) => void;
  isWishlisted: boolean;
}

export const RadialPieMenu: React.FC<PieMenuProps> = ({
  product,
  x,
  y,
  onClose,
  onQuickView,
  onToggleWishlist,
  onShare,
  onAddToCart,
  isWishlisted
}) => {
  if (!product) return null;

  const centerX = typeof window !== 'undefined' ? Math.min(Math.max(130, x), window.innerWidth - 130) : x;
  const centerY = typeof window !== 'undefined' ? Math.min(Math.max(130, y), window.innerHeight - 130) : y;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/25 backdrop-blur-[1px]"
      onClick={onClose}
      role="dialog"
      aria-label={`Radial Pie Menu for ${product.name}`}
    >
      <div
        style={{ top: `${centerY}px`, left: `${centerX}px` }}
        onClick={(e) => e.stopPropagation()}
        className="fixed -translate-x-1/2 -translate-y-1/2 w-60 h-60 flex items-center justify-center select-none"
      >
        {/* Outer Ring Guide */}
        <div className="absolute inset-2 rounded-full border-2 border-dashed border-amber-500/50 bg-white/90 dark:bg-zinc-900/90 shadow-2xl backdrop-blur-md" />

        {/* North Slice: Quick View */}
        <button
          type="button"
          onClick={() => {
            onQuickView(product);
            onClose();
          }}
          title="View Product Details"
          aria-label="View Product Details"
          className="absolute top-3 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center w-16 h-16 rounded-full bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-amber-600 dark:hover:bg-amber-500 dark:hover:text-white shadow-lg transition-transform hover:scale-105"
        >
          <Eye className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">View</span>
        </button>

        {/* East Slice: Add to Cart */}
        <button
          type="button"
          onClick={() => {
            onAddToCart(product, 1);
            onClose();
          }}
          title="Add to Shopping Cart"
          aria-label="Add to Shopping Cart"
          className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-16 h-16 rounded-full bg-amber-600 text-white hover:bg-amber-700 shadow-lg transition-transform hover:scale-105"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Cart</span>
        </button>

        {/* South Slice: Share Product */}
        <button
          type="button"
          onClick={() => {
            onShare(product);
            onClose();
          }}
          title="Share Product Link"
          aria-label="Share Product Link"
          className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center w-16 h-16 rounded-full bg-stone-800 dark:bg-zinc-800 text-white hover:bg-amber-600 shadow-lg transition-transform hover:scale-105"
        >
          <Share2 className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Share</span>
        </button>

        {/* West Slice: Wishlist */}
        <button
          type="button"
          onClick={() => {
            onToggleWishlist(product);
            onClose();
          }}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          className={`absolute left-3 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-16 h-16 rounded-full shadow-lg transition-transform hover:scale-105 ${
            isWishlisted
              ? 'bg-rose-600 text-white'
              : 'bg-stone-800 dark:bg-zinc-800 text-white hover:bg-rose-600'
          }`}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
          <span className="text-[10px] font-semibold mt-0.5">Wishlist</span>
        </button>

        {/* Center Hub Close Button */}
        <button
          type="button"
          onClick={onClose}
          title="Close Radial Pie Menu"
          aria-label="Close Radial Pie Menu"
          className="relative z-10 w-14 h-14 rounded-full bg-stone-100 dark:bg-zinc-800 border border-stone-300 dark:border-zinc-600 flex flex-col items-center justify-center text-stone-700 dark:text-zinc-200 hover:bg-stone-200 dark:hover:bg-zinc-700 transition-colors"
        >
          <X className="w-4 h-4" />
          <span className="text-[9px] font-bold">PIE</span>
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// 3. SYSTEM DIALOG BOXES (Message, Confirmation, Warning, Error - HCI Dialogs #3-6)
// ============================================================================
interface SystemDialogModalProps {
  dialog: SystemDialogState;
  onClose: () => void;
}

export const SystemDialogModal: React.FC<SystemDialogModalProps> = ({ dialog, onClose }) => {
  if (!dialog.isOpen) return null;

  const badgeByType: Record<SystemDialogType, { label: string; colorClass: string; Icon: React.FC<{ className?: string }> }> = {
    message: {
      label: 'HCI Message Dialog Box',
      colorClass: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800',
      Icon: CheckCircle2
    },
    confirm: {
      label: 'HCI Confirmation Dialog Box',
      colorClass: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800',
      Icon: HelpCircle
    },
    warning: {
      label: 'HCI Warning Dialog Box',
      colorClass: 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800',
      Icon: AlertTriangle
    },
    error: {
      label: 'HCI Error Dialog Box',
      colorClass: 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800',
      Icon: XCircle
    }
  };

  const current = badgeByType[dialog.type];
  const IconComp = current.Icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="sys-dialog-title"
      aria-describedby="sys-dialog-desc"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-2xl p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${current.colorClass}`}>
              <IconComp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-medium text-stone-500 dark:text-zinc-400">{current.label}</span>
              <h3 id="sys-dialog-title" className="text-lg font-bold text-stone-900 dark:text-zinc-100">
                {dialog.title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            title="Close dialog (Esc)"
            className="w-11 h-11 rounded-lg flex items-center justify-center text-stone-500 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p id="sys-dialog-desc" className="mt-4 text-sm leading-relaxed text-stone-600 dark:text-zinc-300">
          {dialog.message}
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          {(dialog.type === 'confirm' || dialog.type === 'warning') && (
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 py-2 rounded-lg border border-stone-300 dark:border-zinc-700 text-sm font-medium text-stone-700 dark:text-zinc-200 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {dialog.cancelLabel || 'Cancel'}
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (dialog.onConfirm) {
                dialog.onConfirm();
              }
              onClose();
            }}
            className={`min-h-[44px] px-5 py-2 rounded-lg text-sm font-semibold text-white transition-colors ${
              dialog.type === 'error'
                ? 'bg-rose-600 hover:bg-rose-700'
                : dialog.type === 'warning'
                ? 'bg-amber-600 hover:bg-amber-700'
                : dialog.type === 'confirm'
                ? 'bg-stone-900 dark:bg-amber-600 hover:bg-stone-800 dark:hover:bg-amber-500'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {dialog.confirmLabel || (dialog.type === 'confirm' ? 'Confirm Action' : 'OK, Got It')}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 4. MODAL DIALOG BOX: PRODUCT QUICK-VIEW & TAB MENU (HCI Dialog #1 + Menu #10 + Review Form)
// ============================================================================
interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (p: Product, qty: number) => void;
  onToggleWishlist: (p: Product) => void;
  isWishlisted: boolean;
  onAddReview: (productId: string, review: Omit<ProductReview, 'id' | 'date'>) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onAddReview
}) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews' | 'delivery'>('description');

  // Product Review Form State
  const [reviewerName, setReviewerName] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [verifiedBuyer, setVerifiedBuyer] = useState(true);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setReviewError('');
      setReviewSuccess('');
    }
  }, [product]);

  if (!product) return null;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewTitle.trim() || reviewComment.trim().length < 10) {
      setReviewError('Please enter your name, a review headline, and at least 10 characters of feedback.');
      return;
    }
    setReviewError('');
    onAddReview(product.id, {
      author: reviewerName.trim(),
      title: reviewTitle.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
      verified: verifiedBuyer
    });
    setReviewerName('');
    setReviewTitle('');
    setReviewComment('');
    setReviewRating(5);
    setReviewSuccess('Thank you! Your review has been published to this product.');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-prod-title"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-2xl overflow-hidden my-8"
      >
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-950">
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-zinc-400">
            <span className="font-semibold text-amber-700 dark:text-amber-400">HCI Modal Dialog Box</span>
            <span aria-hidden="true">·</span>
            <span>{product.category}</span>
            <span aria-hidden="true">/</span>
            <span>{product.subcategory}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product modal"
            title="Close modal (Esc)"
            className="w-11 h-11 rounded-lg flex items-center justify-center text-stone-500 hover:bg-stone-200 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contiguous Purchase Module (2-Column Split) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 lg:p-8">
          <div className="aspect-4/3 rounded-xl overflow-hidden bg-stone-100 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-800">
            <ProductArtwork product={product} />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-zinc-400 mb-2">
                <span>SKU: {product.id.toUpperCase()}</span>
                <span className={product.stock <= 3 ? 'text-amber-600 dark:text-amber-400 font-semibold' : 'text-emerald-600 dark:text-emerald-400 font-medium'}>
                  {product.stock <= 3 ? `Low Stock (${product.stock} left)` : `In Stock (${product.stock} units)`}
                </span>
              </div>

              <h2 id="modal-prod-title" className="text-2xl font-bold text-stone-900 dark:text-zinc-100">
                {product.name}
              </h2>

              <div className="flex items-center gap-2 mt-2 text-sm">
                <div className="flex items-center text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-amber-500' : 'text-stone-300 dark:text-zinc-700'}`}
                    />
                  ))}
                </div>
                <span className="font-mono-tabular font-semibold">{product.rating.toFixed(1)}</span>
                <span aria-hidden="true" className="text-stone-400">·</span>
                <span className="text-stone-500 dark:text-zinc-400">{product.reviews.length + product.reviewCount} reviews</span>
              </div>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl font-bold font-mono-tabular text-stone-900 dark:text-zinc-100">
                  PKR {product.price.toLocaleString()}
                </span>
                {product.oldPrice && (
                  <span className="text-sm font-mono-tabular text-stone-400 line-through">
                    PKR {product.oldPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <p className="mt-4 text-sm leading-relaxed text-stone-600 dark:text-zinc-300">
                {product.description}
              </p>
            </div>

            {/* Quantity Drop-Down / Stepper & Primary Actions */}
            <div className="mt-6 pt-6 border-t border-stone-200 dark:border-zinc-800 space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <label htmlFor="modal-qty-select" className="block text-xs font-medium text-stone-600 dark:text-zinc-400 mb-1">
                    Quantity (Drop-Down / Stepper)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      title="Decrease quantity"
                      className="w-11 h-11 rounded-lg border border-stone-300 dark:border-zinc-700 flex items-center justify-center hover:bg-stone-100 dark:hover:bg-zinc-800"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <select
                      id="modal-qty-select"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="h-11 px-3 rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-mono-tabular text-sm font-semibold"
                    >
                      {Array.from({ length: product.stock }, (_, idx) => idx + 1).map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'unit' : 'units'}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      aria-label="Increase quantity"
                      title="Increase quantity"
                      className="w-11 h-11 rounded-lg border border-stone-300 dark:border-zinc-700 flex items-center justify-center hover:bg-stone-100 dark:hover:bg-zinc-800"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex items-end gap-3 pt-5">
                  <button
                    type="button"
                    onClick={() => onAddToCart(product, quantity)}
                    className="flex-1 min-h-[44px] px-5 py-2.5 rounded-lg bg-stone-900 dark:bg-amber-600 text-white font-semibold text-sm hover:bg-stone-800 dark:hover:bg-amber-500 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart · PKR {(product.price * quantity).toLocaleString()}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleWishlist(product)}
                    aria-label={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
                    title={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
                    className={`w-11 h-11 rounded-lg border flex items-center justify-center transition-colors ${
                      isWishlisted
                        ? 'border-rose-300 bg-rose-50 text-rose-600 dark:border-rose-800 dark:bg-rose-950/40'
                        : 'border-stone-300 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HCI MENU TYPE #10: TAB MENU (Description, Specifications, Reviews, Delivery Info) */}
        <div className="border-t border-stone-200 dark:border-zinc-800 px-6 lg:px-8 py-6 bg-stone-50/60 dark:bg-zinc-950/50">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <div role="tablist" aria-label="Product Information Tabs" className="flex items-center gap-1 p-1 rounded-xl bg-stone-200/80 dark:bg-zinc-800">
              {([
                { id: 'description', label: 'Description' },
                { id: 'specs', label: 'Specifications' },
                { id: 'reviews', label: `Customer Reviews (${product.reviews.length})` },
                { id: 'delivery', label: 'Delivery Information' }
              ] as const).map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`min-h-[40px] px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-zinc-900 text-stone-900 dark:text-zinc-100 shadow-xs'
                      : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <span className="text-xs text-stone-500 dark:text-zinc-400">HCI Element: Tab Menu (#10)</span>
          </div>

          {activeTab === 'description' && (
            <div className="text-sm leading-relaxed text-stone-700 dark:text-zinc-300 space-y-2">
              <p>{product.description}</p>
              <p className="text-xs text-stone-500 dark:text-zinc-400">
                Every item sold by TuRi 30 Shop goes through a 12-point quality inspection prior to dispatch and includes a 14-day hassle-free return or exchange guarantee.
              </p>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(product.specs).map(([key, val]) => (
                <div key={key} className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 flex flex-col">
                  <span className="text-xs text-stone-500 dark:text-zinc-400">{key}</span>
                  <span className="text-sm font-semibold text-stone-900 dark:text-zinc-100 mt-0.5">{val}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 text-sm text-stone-700 dark:text-zinc-300 space-y-2">
              <p className="font-semibold text-stone-900 dark:text-zinc-100">Nationwide Fulfilment & Cash on Delivery</p>
              <p>{product.deliveryInfo}</p>
              <p className="text-xs text-stone-500 dark:text-zinc-400">
                Standard Demo Delivery Fee: PKR 350 (Free on orders over PKR 25,000). Cash on Delivery (COD) and Simulated Card Checkout supported.
              </p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Existing Reviews */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-stone-900 dark:text-zinc-100">Verified Customer Feedback</h4>
                {product.reviews.length === 0 ? (
                  <p className="text-xs text-stone-500 dark:text-zinc-400 py-4">
                    No written reviews yet. Be the first to submit a product review using the HCI Review Form!
                  </p>
                ) : (
                  product.reviews.map((rev) => (
                    <div key={rev.id} className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800">
                      <div className="flex items-center justify-between text-xs text-stone-500 dark:text-zinc-400">
                        <span className="font-semibold text-stone-900 dark:text-zinc-100">{rev.author}</span>
                        <span>{rev.date} {rev.verified ? '· Verified Buyer' : ''}</span>
                      </div>
                      <div className="flex items-center gap-1 my-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star key={idx} className={`w-3.5 h-3.5 ${idx < rev.rating ? 'fill-amber-500' : 'text-stone-300'}`} />
                        ))}
                      </div>
                      <p className="text-xs font-bold text-stone-800 dark:text-zinc-200">{rev.title}</p>
                      <p className="text-xs text-stone-600 dark:text-zinc-300 mt-1">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* HCI Product Review Form */}
              <form onSubmit={handleReviewSubmit} className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-stone-900 dark:text-zinc-100">Submit a Product Review</h4>
                  <span className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">HCI Review Form</span>
                </div>

                {reviewError && (
                  <p role="alert" className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                    {reviewError}
                  </p>
                )}
                {reviewSuccess && (
                  <p role="status" className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    {reviewSuccess}
                  </p>
                )}

                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-zinc-300 mb-1">
                    Overall Star Rating <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        aria-label={`Rate ${star} out of 5 stars`}
                        className="w-10 h-10 rounded-lg border border-stone-200 dark:border-zinc-700 flex items-center justify-center hover:bg-amber-50 dark:hover:bg-zinc-800"
                      >
                        <Star className={`w-4 h-4 ${star <= reviewRating ? 'fill-amber-500 text-amber-500' : 'text-stone-400'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="rev-name" className="block text-xs font-medium text-stone-700 dark:text-zinc-300 mb-1">
                      Your Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="rev-name"
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="e.g. Usman Ali"
                      className="w-full h-11 px-3 rounded-lg border border-stone-300 dark:border-zinc-700 bg-transparent text-xs"
                    />
                  </div>
                  <div>
                    <label htmlFor="rev-title" className="block text-xs font-medium text-stone-700 dark:text-zinc-300 mb-1">
                      Review Headline <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="rev-title"
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="e.g. Excellent value"
                      className="w-full h-11 px-3 rounded-lg border border-stone-300 dark:border-zinc-700 bg-transparent text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="rev-comment" className="block text-xs font-medium text-stone-700 dark:text-zinc-300 mb-1">
                    Written Review (min 10 chars) <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="rev-comment"
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience with build quality, sizing, or performance..."
                    className="w-full p-3 rounded-lg border border-stone-300 dark:border-zinc-700 bg-transparent text-xs"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs text-stone-600 dark:text-zinc-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verifiedBuyer}
                    onChange={(e) => setVerifiedBuyer(e.target.checked)}
                    className="w-4 h-4 rounded accent-amber-600"
                  />
                  <span>I purchased or tested this item at TuRi 30 Shop (Optional)</span>
                </label>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    className="min-h-[44px] px-4 py-2 rounded-lg bg-stone-900 dark:bg-amber-600 text-white text-xs font-semibold hover:bg-stone-800 dark:hover:bg-amber-500 transition-colors"
                  >
                    Submit Review
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReviewerName('');
                      setReviewTitle('');
                      setReviewComment('');
                      setReviewRating(5);
                      setReviewError('');
                    }}
                    className="min-h-[44px] px-3 py-2 rounded-lg border border-stone-300 dark:border-zinc-700 text-xs font-medium hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 5. MODAL DIALOG BOX: LOGIN & REGISTRATION FORMS (HCI Forms B.1 & B.2)
// ============================================================================
interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
  onSuccessAuth: (user: { name: string; email: string }) => void;
  onWarnUnsaved: (discardCallback: () => void) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onSuccessAuth,
  onWarnUnsaved
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAccountType, setRegAccountType] = useState<'personal' | 'student'>('student');
  const [regPass, setRegPass] = useState('');
  const [regConfirmPass, setRegConfirmPass] = useState('');
  const [regTerms, setRegTerms] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setMode(initialMode);
    setErrorMsg('');
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const hasUnsavedInput =
    mode === 'register'
      ? Boolean(regName || regEmail || regPhone || regPass)
      : Boolean(loginEmail || loginPass);

  const handleSafeClose = () => {
    if (hasUnsavedInput) {
      onWarnUnsaved(() => {
        setRegName('');
        setRegEmail('');
        setRegPhone('');
        setRegPass('');
        setRegConfirmPass('');
        setLoginEmail('');
        setLoginPass('');
        onClose();
      });
    } else {
      onClose();
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail.trim())) {
      setErrorMsg('Please enter a valid email address (e.g. student@university.edu.pk).');
      return;
    }
    if (loginPass.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    setErrorMsg('');
    const displayName = loginEmail.split('@')[0].replace(/[._]/g, ' ');
    onSuccessAuth({ name: displayName, email: loginEmail.trim() });
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (regName.trim().length < 3) {
      setErrorMsg('Full Name is required (minimum 3 characters).');
      return;
    }
    if (!emailRegex.test(regEmail.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (regPhone.trim().length < 10) {
      setErrorMsg('Please enter a valid 11-digit phone number (e.g. 0300-1234567).');
      return;
    }
    if (regPass.length < 8) {
      setErrorMsg('Password must be at least 8 characters long for security.');
      return;
    }
    if (regPass !== regConfirmPass) {
      setErrorMsg('Passwords do not match. Please verify Confirm Password.');
      return;
    }
    if (!regTerms) {
      setErrorMsg('You must agree to the MH SHOP Terms & Privacy Policy to register.');
      return;
    }
    setErrorMsg('');
    onSuccessAuth({ name: regName.trim(), email: regEmail.trim() });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={handleSafeClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-2xl overflow-hidden my-8"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-950">
          <div>
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
              HCI Shopping Forms & Modal Dialog
            </span>
            <h2 id="auth-modal-title" className="text-lg font-bold text-stone-900 dark:text-zinc-100">
              {mode === 'login' ? 'Sign In to MH SHOP Account' : 'Create Customer Account'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleSafeClose}
            aria-label="Close account modal"
            className="w-11 h-11 rounded-lg flex items-center justify-center text-stone-500 hover:bg-stone-200 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switch Tabs */}
        <div className="grid grid-cols-2 border-b border-stone-200 dark:border-zinc-800 bg-stone-100/60 dark:bg-zinc-900">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`min-h-[44px] py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              mode === 'login'
                ? 'border-amber-600 text-stone-900 dark:text-white bg-white dark:bg-zinc-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Customer Login Form
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            className={`min-h-[44px] py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              mode === 'register'
                ? 'border-amber-600 text-stone-900 dark:text-white bg-white dark:bg-zinc-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Registration Form
          </button>
        </div>

        <div className="p-6">
          {errorMsg && (
            <div role="alert" className="mb-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs font-medium text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4" noValidate>
              <p className="text-xs text-stone-500 dark:text-zinc-400">
                Fields marked with <span className="text-rose-500 font-bold">*</span> are required.
              </p>

              <div>
                <label htmlFor="login-email" className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full h-11 px-3.5 rounded-lg border border-stone-300 dark:border-zinc-700 bg-transparent text-sm"
                />
              </div>

              <div>
                <label htmlFor="login-password" className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1.5">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="Enter at least 6 characters"
                    className="w-full h-11 pl-3.5 pr-12 rounded-lg border border-stone-300 dark:border-zinc-700 bg-transparent text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    title={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-1 w-10 h-10 rounded-lg flex items-center justify-center text-stone-500 hover:bg-stone-100 dark:hover:bg-zinc-800"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="block text-[11px] text-stone-400 mt-1">
                  Instruction: Password characters are masked by default for privacy.
                </span>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-stone-700 dark:text-zinc-300 cursor-pointer min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded accent-amber-600"
                  />
                  <span>Remember me on this browser (Optional)</span>
                </label>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 min-h-[44px] px-5 py-2.5 rounded-lg bg-stone-900 dark:bg-amber-600 text-white text-sm font-semibold hover:bg-stone-800 dark:hover:bg-amber-500 transition-colors"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('');
                    setLoginPass('');
                    setErrorMsg('');
                  }}
                  className="min-h-[44px] px-4 py-2.5 rounded-lg border border-stone-300 dark:border-zinc-700 text-sm font-medium hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4" noValidate>
              <p className="text-xs text-stone-500 dark:text-zinc-400">
                Complete the fields below. Required fields are marked with <span className="text-rose-500 font-bold">*</span>.
              </p>

              <div>
                <label htmlFor="reg-name" className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="reg-name"
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Muhammad Hassan"
                  className="w-full h-11 px-3.5 rounded-lg border border-stone-300 dark:border-zinc-700 bg-transparent text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="reg-email" className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="hassan@uni.edu.pk"
                    className="w-full h-11 px-3.5 rounded-lg border border-stone-300 dark:border-zinc-700 bg-transparent text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="reg-phone" className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1">
                    Phone Number (PK) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="reg-phone"
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full h-11 px-3.5 rounded-lg border border-stone-300 dark:border-zinc-700 bg-transparent text-sm"
                  />
                </div>
              </div>

              {/* Radio Buttons for Account Membership Tier */}
              <fieldset>
                <legend className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1.5">
                  Account Profile Type (Radio Buttons)
                </legend>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-stone-300 dark:border-zinc-700 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="accountType"
                      checked={regAccountType === 'student'}
                      onChange={() => setRegAccountType('student')}
                      className="w-4 h-4 accent-amber-600"
                    />
                    <span>University Student</span>
                  </label>
                  <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-stone-300 dark:border-zinc-700 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="accountType"
                      checked={regAccountType === 'personal'}
                      onChange={() => setRegAccountType('personal')}
                      className="w-4 h-4 accent-amber-600"
                    />
                    <span>Standard Shopper</span>
                  </label>
                </div>
              </fieldset>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="reg-pass" className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1">
                    Password (min 8 chars) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="reg-pass"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={regPass}
                    onChange={(e) => setRegPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 px-3.5 rounded-lg border border-stone-300 dark:border-zinc-700 bg-transparent text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="reg-confirm" className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1">
                    Confirm Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="reg-confirm"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={regConfirmPass}
                    onChange={(e) => setRegConfirmPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 px-3.5 rounded-lg border border-stone-300 dark:border-zinc-700 bg-transparent text-sm"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2.5 text-xs text-stone-700 dark:text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={regTerms}
                  onChange={(e) => setRegTerms(e.target.checked)}
                  className="w-4 h-4 rounded accent-amber-600"
                />
                <span>
                  I agree to the MH SHOP Terms of Service & Consumer Privacy Policy <span className="text-rose-500">*</span>
                </span>
              </label>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 min-h-[44px] px-5 py-2.5 rounded-lg bg-stone-900 dark:bg-amber-600 text-white text-sm font-semibold hover:bg-stone-800 dark:hover:bg-amber-500 transition-colors"
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRegName('');
                    setRegEmail('');
                    setRegPhone('');
                    setRegPass('');
                    setRegConfirmPass('');
                    setRegTerms(false);
                    setErrorMsg('');
                  }}
                  className="min-h-[44px] px-4 py-2.5 rounded-lg border border-stone-300 dark:border-zinc-700 text-sm font-medium hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 6. MODELESS DIALOG BOX: FLOATING COMPARISON & SHOPPING HELP (HCI Dialog #2)
// ============================================================================
interface ModelessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  compareList: Product[];
  onRemoveCompare: (id: string) => void;
  onClearCompare: () => void;
  onAddToCart: (p: Product, qty: number) => void;
  onOpenHCIGuide: () => void;
}

export const ModelessComparisonDialog: React.FC<ModelessDialogProps> = ({
  isOpen,
  onClose,
  compareList,
  onRemoveCompare,
  onClearCompare,
  onAddToCart,
  onOpenHCIGuide
}) => {
  const [minimized, setMinimized] = useState(false);
  const [tab, setTab] = useState<'compare' | 'help'>('compare');

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Modeless Product Comparison and Shopping Help Panel"
      className="fixed bottom-4 left-4 z-40 w-[92vw] sm:w-[430px] rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-2 border-amber-500/80 shadow-2xl overflow-hidden transition-all"
    >
      {/* Modeless Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-stone-900 dark:bg-zinc-950 text-white">
        <div>
          <span className="text-[10px] font-mono-tabular text-amber-400 block">
            HCI Modeless Dialog Box (Background Remains Interactive)
          </span>
          <h3 className="text-xs font-bold">
            Live Product Comparison ({compareList.length}/3) & Shopping Assistant
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMinimized((m) => !m)}
            aria-label={minimized ? 'Expand modeless panel' : 'Minimize modeless panel'}
            title={minimized ? 'Expand panel' : 'Minimize panel'}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10"
          >
            {minimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modeless dialog"
            title="Close modeless dialog"
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!minimized && (
        <div className="p-4 max-h-[380px] overflow-y-auto">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-stone-100 dark:bg-zinc-800 mb-3">
            <button
              type="button"
              onClick={() => setTab('compare')}
              className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                tab === 'compare'
                  ? 'bg-white dark:bg-zinc-900 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-600 dark:text-zinc-400'
              }`}
            >
              Compare Items ({compareList.length})
            </button>
            <button
              type="button"
              onClick={() => setTab('help')}
              className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                tab === 'help'
                  ? 'bg-white dark:bg-zinc-900 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-600 dark:text-zinc-400'
              }`}
            >
              Interactive HCI Help
            </button>
          </div>

          {tab === 'compare' ? (
            compareList.length === 0 ? (
              <div className="text-center py-6 space-y-2">
                <p className="text-xs text-stone-600 dark:text-zinc-300 font-medium">
                  Notice how you can still scroll and click products while this Modeless Dialog stays open!
                </p>
                <p className="text-xs text-stone-400">
                  Right-click any product card or click its Compare icon to add items here side-by-side.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {compareList.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl border border-stone-200 dark:border-zinc-800 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate text-stone-900 dark:text-zinc-100">{item.name}</p>
                      <p className="text-[11px] font-mono-tabular text-stone-500 dark:text-zinc-400">
                        PKR {item.price.toLocaleString()} · ★ {item.rating.toFixed(1)} · {item.stock} in stock
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onAddToCart(item, 1)}
                        title="Add to Cart"
                        aria-label={`Add ${item.name} to cart`}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-600 text-white text-[11px] font-semibold hover:bg-amber-700"
                      >
                        + Cart
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveCompare(item.id)}
                        title="Remove from comparison"
                        aria-label={`Remove ${item.name} from comparison`}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-stone-100 dark:hover:bg-zinc-800"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={onClearCompare}
                  className="w-full py-2 rounded-lg border border-stone-200 dark:border-zinc-700 text-xs font-medium text-stone-600 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800"
                >
                  Clear Comparison List
                </button>
              </div>
            )
          ) : (
            <div className="space-y-2.5 text-xs text-stone-600 dark:text-zinc-300">
              <p className="font-semibold text-stone-900 dark:text-zinc-100">Quick HCI Element Shortcuts:</p>
              <ul className="space-y-1.5 list-disc pl-4">
                <li><strong>Right-click</strong> any product card for the <strong>Pop-Up Context Menu</strong>.</li>
                <li>Click the <strong>Pie Icon</strong> on any card for the circular <strong>Radial Pie Menu</strong>.</li>
                <li>Use the top <strong>File / Edit / View / Help</strong> bar for <strong>Pull-Down Menus</strong>.</li>
                <li>Toggle the <strong>Ribbon Menu</strong> below the header for tabbed command groups.</li>
              </ul>
              <button
                type="button"
                onClick={onOpenHCIGuide}
                className="w-full mt-2 py-2 rounded-lg bg-stone-900 dark:bg-[#CBA365] text-white dark:text-[#11100E] font-semibold text-xs hover:opacity-90"
              >
                Browse Full Store Catalog
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
