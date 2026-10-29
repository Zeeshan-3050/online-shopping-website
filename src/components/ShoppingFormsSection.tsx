import React, { useState } from 'react';
import {
  UserPlus,
  LogIn,
  Truck,
  MessageSquarePlus,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Star,
  ShieldCheck
} from 'lucide-react';
import { Product, ProductReview } from '../data/shopData';

interface ShoppingFormsSectionProps {
  products: Product[];
  currentUser: { name: string; email: string } | null;
  onSuccessAuth: (user: { name: string; email: string }) => void;
  onAddReview: (productId: string, review: Omit<ProductReview, 'id' | 'date'>) => void;
  onAskConfirmReset: (formTitle: string, onConfirm: () => void) => void;
  onTriggerMessageDialog: (title: string, message: string) => void;
}

export const ShoppingFormsSection: React.FC<ShoppingFormsSectionProps> = ({
  products,
  currentUser,
  onSuccessAuth,
  onAddReview,
  onAskConfirmReset,
  onTriggerMessageDialog
}) => {
  const [activeFormTab, setActiveFormTab] = useState<
    'register' | 'login' | 'delivery' | 'review'
  >('register');

  // ==========================================================================
  // 1. CUSTOMER REGISTRATION FORM STATE
  // ==========================================================================
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCountry, setRegCountry] = useState('Pakistan');
  const [regPass, setRegPass] = useState('');
  const [regConfirmPass, setRegConfirmPass] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);
  const [regAccountType, setRegAccountType] = useState<'personal' | 'student' | 'corporate'>('personal');
  const [regAgreeTerms, setRegAgreeTerms] = useState(false);
  const [regNewsletter, setRegNewsletter] = useState(true);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  // ==========================================================================
  // 2. CUSTOMER LOGIN FORM STATE
  // ==========================================================================
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);

  // ==========================================================================
  // 3. DELIVERY DETAILS & EXPRESS CHECKOUT FORM STATE
  // ==========================================================================
  const [delFullName, setDelFullName] = useState('');
  const [delEmail, setDelEmail] = useState('');
  const [delPhone, setDelPhone] = useState('');
  const [delAddress, setDelAddress] = useState('');
  const [delCity, setDelCity] = useState('Lahore');
  const [delPostalCode, setDelPostalCode] = useState('');
  const [delCountry, setDelCountry] = useState('Pakistan');
  const [delShippingSpeed, setDelShippingSpeed] = useState<'standard' | 'express'>('express');
  const [delPaymentMethod, setDelPaymentMethod] = useState<'cod' | 'card' | 'wallet'>('cod');
  const [delNotes, setDelNotes] = useState('');
  const [delSaveDefault, setDelSaveDefault] = useState(true);
  const [delError, setDelError] = useState<string | null>(null);
  const [delSuccess, setDelSuccess] = useState<string | null>(null);

  // ==========================================================================
  // 4. PRODUCT REVIEW FORM STATE
  // ==========================================================================
  const [revProductId, setRevProductId] = useState<string>(products[0]?.id || 'prod-elec-01');
  const [revAuthor, setRevAuthor] = useState('');
  const [revRating, setRevRating] = useState<number>(5);
  const [revTitle, setRevTitle] = useState('');
  const [revComment, setRevComment] = useState('');
  const [revRecommend, setRevRecommend] = useState<'yes' | 'no'>('yes');
  const [revVerified, setRevVerified] = useState(true);
  const [revError, setRevError] = useState<string | null>(null);
  const [revSuccess, setRevSuccess] = useState<string | null>(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Handlers
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccess(null);

    if (regName.trim().length < 3) {
      setRegError('Full Name is required and must be at least 3 characters.');
      return;
    }
    if (!emailRegex.test(regEmail.trim())) {
      setRegError('Please enter a valid email address (e.g., customer@turi30.pk).');
      return;
    }
    if (regPhone.trim().length < 10) {
      setRegError('Please enter a valid 10–11 digit mobile number (e.g., 0300-1234567).');
      return;
    }
    if (regPass.length < 8) {
      setRegError('Password must be at least 8 characters long.');
      return;
    }
    if (regPass !== regConfirmPass) {
      setRegError('Password and Confirm Password do not match.');
      return;
    }
    if (!regAgreeTerms) {
      setRegError('You must agree to the TuRi 30 Shop Terms & Privacy Policy.');
      return;
    }

    onSuccessAuth({ name: regName.trim(), email: regEmail.trim() });
    setRegSuccess(`Account registered for ${regName.trim()} (${regEmail.trim()})!`);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSuccess(null);

    if (!emailRegex.test(loginEmail.trim())) {
      setLoginError('Please enter a valid registered email address.');
      return;
    }
    if (loginPass.length < 6) {
      setLoginError('Password must be at least 6 characters long.');
      return;
    }

    const displayName = loginEmail.split('@')[0].replace(/[._-]/g, ' ');
    onSuccessAuth({
      name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
      email: loginEmail.trim()
    });
    setLoginSuccess(`Signed in as ${loginEmail.trim()}!`);
  };

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDelError(null);
    setDelSuccess(null);

    if (delFullName.trim().length < 3) {
      setDelError('Recipient Full Name is required (minimum 3 characters).');
      return;
    }
    if (!emailRegex.test(delEmail.trim())) {
      setDelError('Please enter a valid email address for order tracking.');
      return;
    }
    if (delPhone.trim().length < 10) {
      setDelError('Please enter a valid phone number for courier coordination.');
      return;
    }
    if (delAddress.trim().length < 8) {
      setDelError('Please provide a complete street address and house/apartment number.');
      return;
    }
    if (delPostalCode.trim().length < 4) {
      setDelError('Please enter a valid 5-digit postal code (e.g., 54000).');
      return;
    }

    const refCode = `TR30-${Math.floor(100000 + Math.random() * 900000)}`;
    setDelSuccess(
      `Delivery profile & express order request (${refCode}) saved for ${delFullName.trim()} in ${delCity}, ${delCountry}!`
    );
    onTriggerMessageDialog(
      'Delivery & Express Order Preferences Saved',
      `Your ${delShippingSpeed === 'express' ? 'Express 24h' : 'Standard'} delivery details for ${delCity}, ${delCountry} and ${delPaymentMethod.toUpperCase()} payment preference have been verified (Ref: ${refCode}).`
    );
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRevError(null);
    setRevSuccess(null);

    if (revAuthor.trim().length < 2) {
      setRevError('Please enter your name or display alias.');
      return;
    }
    if (revTitle.trim().length < 4) {
      setRevError('Please provide a brief headline for your review.');
      return;
    }
    if (revComment.trim().length < 12) {
      setRevError('Review comment must be at least 12 characters long.');
      return;
    }

    const targetProduct = products.find((p) => p.id === revProductId);
    onAddReview(revProductId, {
      author: revAuthor.trim(),
      rating: revRating,
      title: revTitle.trim(),
      comment: revComment.trim(),
      verified: revVerified
    });
    setRevSuccess(
      `Published your ${revRating}-star review for "${targetProduct?.name || 'Product'}"!`
    );
    setRevTitle('');
    setRevComment('');
  };

  return (
    <section
      id="section-shopping-forms"
      aria-label="Interactive Shopping Forms Hub"
      className="scroll-mt-24 space-y-8"
    >
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-stone-200 dark:border-zinc-800/90">
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-[#CBA365]">
            Customer Account · Delivery · Product Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-editorial text-stone-900 dark:text-white mt-1">
            Interactive Shopping Forms
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-zinc-400 mt-1 max-w-2xl">
            Complete customer registration, account sign-in, delivery & payment configuration, or submit a verified product review—built with accessible 44×44px controls, clear labels, validation, and error prevention.
          </p>
        </div>

        {/* Form Switcher Tabs */}
        <div
          role="tablist"
          aria-label="Shopping Form Types"
          className="flex items-center flex-wrap gap-1.5 bg-stone-200/80 dark:bg-[#121216] p-1.5 rounded-xl border border-stone-300/80 dark:border-zinc-800"
        >
          {[
            { id: 'register' as const, label: 'Registration Form', Icon: UserPlus },
            { id: 'login' as const, label: 'Login Form', Icon: LogIn },
            { id: 'delivery' as const, label: 'Delivery & Checkout Form', Icon: Truck },
            { id: 'review' as const, label: 'Product Review Form', Icon: MessageSquarePlus }
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeFormTab === id}
              onClick={() => setActiveFormTab(id)}
              className={`min-h-[42px] px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                activeFormTab === id
                  ? 'bg-[#CBA365] text-[#11100E] shadow-sm'
                  : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Card Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Columns: Active Interactive Form */}
        <div className="lg:col-span-8 rounded-2xl bg-white dark:bg-[#121216] border border-stone-200 dark:border-zinc-800/90 p-6 sm:p-8 shadow-sm">
          {/* ================================================================
              TAB 1: CUSTOMER REGISTRATION FORM
             ================================================================ */}
          {activeFormTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} noValidate className="space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-zinc-800">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#CBA365]">
                    New Customer Onboarding
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                    Create Your TuRi 30 Shop Account
                  </h3>
                </div>
                <span className="text-xs text-stone-500 dark:text-zinc-400">
                  Fields marked <span className="text-rose-500 font-bold">*</span> are required
                </span>
              </div>

              {regError && (
                <div
                  role="alert"
                  className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 text-xs font-medium text-rose-700 dark:text-rose-300 flex items-center gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{regError}</span>
                </div>
              )}

              {regSuccess && (
                <div
                  role="status"
                  className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-xs font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>{regSuccess}</span>
                </div>
              )}

              {/* Full Name (Full-Width Text Box) */}
              <div>
                <label
                  htmlFor="reg-fullname"
                  className="block text-xs font-semibold text-stone-800 dark:text-zinc-200 mb-1.5"
                >
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="reg-fullname"
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Enter your full legal name (e.g., Muhammad Haris)"
                  className="w-full h-11 px-4 rounded-xl border border-stone-300 dark:border-zinc-700 bg-stone-50 dark:bg-[#0B0B0E] text-sm text-stone-900 dark:text-white focus:border-[#CBA365] focus:outline-none"
                />
                <p className="text-[11px] text-stone-500 dark:text-zinc-400 mt-1">
                  Sufficiently wide full-width field to accommodate complete customer names without truncation.
                </p>
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="reg-email"
                    className="block text-xs font-semibold text-stone-800 dark:text-zinc-200 mb-1.5"
                  >
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full h-11 px-4 rounded-xl border border-stone-300 dark:border-zinc-700 bg-stone-50 dark:bg-[#0B0B0E] text-sm text-stone-900 dark:text-white focus:border-[#CBA365] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="reg-phone"
                    className="block text-xs font-semibold text-stone-800 dark:text-zinc-200 mb-1.5"
                  >
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="reg-phone"
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full h-11 px-4 rounded-xl border border-stone-300 dark:border-zinc-700 bg-stone-50 dark:bg-[#0B0B0E] text-sm font-mono-tabular text-stone-900 dark:text-white focus:border-[#CBA365] focus:outline-none"
                  />
                </div>
              </div>

              {/* Country Drop-Down & Account Tier Radio Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="reg-country"
                    className="block text-xs font-semibold text-stone-800 dark:text-zinc-200 mb-1.5"
                  >
                    Country / Region (Drop-Down List) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="reg-country"
                    value={regCountry}
                    onChange={(e) => setRegCountry(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-stone-300 dark:border-zinc-700 bg-stone-50 dark:bg-[#0B0B0E] text-sm text-stone-900 dark:text-white focus:border-[#CBA365] focus:outline-none"
                  >
                    <option value="Pakistan">Pakistan (PKR)</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="United States">United States</option>
                  </select>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-stone-800 dark:text-zinc-200 mb-1.5">
                    Membership Tier (Radio Buttons) <span className="text-rose-500">*</span>
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'personal' as const, label: 'Personal' },
                      { id: 'student' as const, label: 'Student' },
                      { id: 'corporate' as const, label: 'Business' }
                    ].map((tier) => (
                      <label
                        key={tier.id}
                        className={`h-11 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                          regAccountType === tier.id
                            ? 'border-[#CBA365] bg-[#CBA365]/15 text-[#CBA365]'
                            : 'border-stone-300 dark:border-zinc-700 text-stone-600 dark:text-zinc-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="regAccountType"
                          value={tier.id}
                          checked={regAccountType === tier.id}
                          onChange={() => setRegAccountType(tier.id)}
                          className="accent-[#CBA365]"
                        />
                        <span>{tier.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Password & Confirm Password with 44x44px Visibility Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="reg-pass"
                    className="block text-xs font-semibold text-stone-800 dark:text-zinc-200 mb-1.5"
                  >
                    Password (Masked by Default) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="reg-pass"
                      type={showRegPass ? 'text' : 'password'}
                      required
                      value={regPass}
                      onChange={(e) => setRegPass(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full h-11 pl-4 pr-11 rounded-xl border border-stone-300 dark:border-zinc-700 bg-stone-50 dark:bg-[#0B0B0E] text-sm text-stone-900 dark:text-white focus:border-[#CBA365] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPass((s) => !s)}
                      aria-label={showRegPass ? 'Hide password' : 'Show password'}
                      title={showRegPass ? 'Hide password' : 'Show password'}
                      className="absolute right-0 w-11 h-11 flex items-center justify-center text-stone-400 hover:text-[#CBA365]"
                    >
                      {showRegPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="reg-confirm-pass"
                    className="block text-xs font-semibold text-stone-800 dark:text-zinc-200 mb-1.5"
                  >
                    Confirm Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="reg-confirm-pass"
                      type={showRegConfirm ? 'text' : 'password'}
                      required
                      value={regConfirmPass}
                      onChange={(e) => setRegConfirmPass(e.target.value)}
                      placeholder="Re-enter your password"
                      className="w-full h-11 pl-4 pr-11 rounded-xl border border-stone-300 dark:border-zinc-700 bg-stone-50 dark:bg-[#0B0B0E] text-sm text-stone-900 dark:text-white focus:border-[#CBA365] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegConfirm((s) => !s)}
                      aria-label={showRegConfirm ? 'Hide confirm password' : 'Show confirm password'}
                      title={showRegConfirm ? 'Hide confirm password' : 'Show confirm password'}
                      className="absolute right-0 w-11 h-11 flex items-center justify-center text-stone-400 hover:text-[#CBA365]"
                    >
                      {showRegConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-2.5 pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-stone-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={regAgreeTerms}
                    onChange={(e) => setRegAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#CBA365]"
                  />
                  <span>
                    I agree to the TuRi 30 Shop Terms of Service, Return Policy & Privacy Guidelines{' '}
                    <span className="text-rose-500 font-bold">*</span>
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-stone-500 dark:text-zinc-400">
                  <input
                    type="checkbox"
                    checked={regNewsletter}
                    onChange={(e) => setRegNewsletter(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#CBA365]"
                  />
                  <span>
                    Send me member-only PKR discount alerts and new arrival notifications (Optional)
                  </span>
                </label>
              </div>

              {/* Submit & Reset Buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-3 border-t border-stone-200 dark:border-zinc-800">
                <button
                  type="submit"
                  className="min-h-[44px] px-7 py-2.5 rounded-xl bg-[#CBA365] hover:bg-[#d8b274] text-[#11100E] text-xs font-bold tracking-wider uppercase transition-colors"
                >
                  Create Account (Submit)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onAskConfirmReset('Customer Registration Form', () => {
                      setRegName('');
                      setRegEmail('');
                      setRegPhone('');
                      setRegPass('');
                      setRegConfirmPass('');
                      setRegAgreeTerms(false);
                      setRegError(null);
                      setRegSuccess(null);
                    })
                  }
                  className="min-h-[44px] px-5 py-2.5 rounded-xl border border-stone-300 dark:border-zinc-700 text-xs font-semibold text-stone-700 dark:text-zinc-300 hover:border-[#CBA365] flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Form</span>
                </button>
              </div>
            </form>
          )}

          {/* ================================================================
              TAB 2: CUSTOMER LOGIN FORM
             ================================================================ */}
          {activeFormTab === 'login' && (
            <form onSubmit={handleLoginSubmit} noValidate className="space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-zinc-800">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#CBA365]">
                    Returning Member Access
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                    Sign In to TuRi 30 Shop
                  </h3>
                </div>
                {currentUser && (
                  <span className="text-xs font-semibold text-emerald-500">
                    Signed in: {currentUser.name}
                  </span>
                )}
              </div>

              {loginError && (
                <div
                  role="alert"
                  className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 text-xs font-medium text-rose-700 dark:text-rose-300 flex items-center gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{loginError}</span>
                </div>
              )}

              {loginSuccess && (
                <div
                  role="status"
                  className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-xs font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>{loginSuccess}</span>
                </div>
              )}

              <div>
                <label
                  htmlFor="page-login-email"
                  className="block text-xs font-semibold text-stone-800 dark:text-zinc-200 mb-1.5"
                >
                  Registered Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  id="page-login-email"
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="customer@turi30.pk"
                  className="w-full h-11 px-4 rounded-xl border border-stone-300 dark:border-zinc-700 bg-stone-50 dark:bg-[#0B0B0E] text-sm text-stone-900 dark:text-white focus:border-[#CBA365] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="page-login-pass"
                  className="block text-xs font-semibold text-stone-800 dark:text-zinc-200 mb-1.5"
                >
                  Account Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    id="page-login-pass"
                    type={showLoginPass ? 'text' : 'password'}
                    required
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-11 pl-4 pr-11 rounded-xl border border-stone-300 dark:border-zinc-700 bg-stone-50 dark:bg-[#0B0B0E] text-sm text-stone-900 dark:text-white focus:border-[#CBA365] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPass((s) => !s)}
                    aria-label={showLoginPass ? 'Hide password' : 'Show password'}
                    className="absolute right-0 w-11 h-11 flex items-center justify-center text-stone-400 hover:text-[#CBA365]"
                  >
                    {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-stone-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#CBA365]"
                  />
                  <span>Keep me signed in on this browser (LocalStorage)</span>
                </label>
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-3 border-t border-stone-200 dark:border-zinc-800">
                <button
                  type="submit"
                  className="min-h-[44px] px-7 py-2.5 rounded-xl bg-[#CBA365] hover:bg-[#d8b274] text-[#11100E] text-xs font-bold tracking-wider uppercase transition-colors"
                >
                  Sign In (Submit)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onAskConfirmReset('Customer Login Form', () => {
                      setLoginEmail('');
                      setLoginPass('');
                      setLoginError(null);
                      setLoginSuccess(null);
                    })
                  }
                  className="min-h-[44px] px-5 py-2.5 rounded-xl border border-stone-300 dark:border-zinc-700 text-xs font-semibold text-stone-700 dark:text-zinc-300 hover:border-[#CBA365] flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </form>
          )}

          {/* ================================================================
              TAB 3: DELIVERY DETAILS & EXPRESS CHECKOUT FORM
             ================================================================ */}
          {activeFormTab === 'delivery' && (
            <form onSubmit={handleDeliverySubmit} noValidate className="space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-zinc-800">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#CBA365]">
                    Shipping & Payment Configuration
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                    Delivery Details & Express Checkout Form
                  </h3>
                </div>
                <span className="text-xs text-stone-500 dark:text-zinc-400">
                  All Pakistan Cities Supported
                </span>
              </div>

              {delError && (
                <div
                  role="alert"
                  className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 text-xs font-medium text-rose-700 dark:text-rose-300 flex items-center gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{delError}</span>
                </div>
              )}

              {delSuccess && (
                <div
                  role="status"
                  className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-xs font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>{delSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label
                    htmlFor="del-fullname"
                    className="block text-xs font-semibold text-stone-800 dark:text-zinc-200 mb-1.5"
                  >
                    Recipient Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="del-fullname"
                    type="text"
                    required
                    value={delFullName}
                    onChange={(e) => setDelFullName(e.target.value)}
                    placeholder="e.g., Ayesha Siddiqui"
                    className="w-full h-11 px-3.5 rounded-xl border border-stone-300 dark:border-zinc-700 bg-stone-50 dark:bg-[#0B0B0E] text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="del-email"
                    className="block text-xs font-semibold text-stone-800 dark:text-zinc-200 mb-1.5"
                  >
                    Tracking Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="del-email"
                    type="email"
                    required
                    value={delEmail}
                    onChange={(e) => setDelEmail(e.target.value)}
                    placeholder="ayesha@domain.pk"
                    className="w-full h-11 px-3.5 rounded-xl border border-stone-300 dark:border-zinc-700 bg-stone-50 dark:bg-[#0B0B0E] text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="del-phone"
                    className="block text-xs font-semibold text-stone-800 dark:text-zinc-200 mb-1.5"
                  >
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="del-phone"
                    type="tel"
                    required
                    value={delPhone}
                    onChange={(e) => setDelPhone(e.target.value)}
                    placeholder="0321-9876543"
                    className="w-full h-11 px-3.5 rounded-xl border border-stone-300 dark:border-zinc-700 bg-stone-50 dark:bg-[#0B0B0E] text-sm font-mono-tabular"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="del-address"
                  className="block text-xs font-semibold text-stone-800 dark:text-zinc-200 mb-1.5"
                >
                  Street Address & House / Apartment No. <span className="text-rose-500">*</span>
                </label>
                <input
                  id="del-address"
                  type="text"
                  required
                  value={delAddress}
                  onChange={(e) => setDelAddress(e.target.value)}
                  placeholder="House 14-B, Street 9, Sector F-7/3"
                  className="w-full h-11 px-4 rounded-xl border border-stone-300 dark:border-zinc-700 bg-stone-50 dark:bg-[#0B0B0E] text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="del-city"
                    className="block text-xs font-semibold text-stone-800 dark:text-zinc-200 mb-1.5"
                  >
                    City (Drop-Down) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="del-city"
                    value={delCity}
                    onChange={(e) => setDelCity(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-stone-300 dark:border-zinc-700 bg-stone-50 dark:bg-[#0B0B0E] text-sm"
                  >
                    <option value="Lahore">Lahore</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Multan">Multan</option>
                    <option value="Peshawar">Peshawar</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="del-postal"
                    className="block text-xs font-semibold text-stone-800 dark:text-zinc-200 mb-1.5"
                  >
                    Postal Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="del-postal"
                    type="text"
                    required
                    value={delPostalCode}
                    onChange={(e) => setDelPostalCode(e.target.value)}
                    placeholder="54000"
                    className="w-full h-11 px-3.5 rounded-xl border border-stone-300 dark:border-zinc-700 bg-stone-50 dark:bg-[#0B0B0E] text-sm font-mono-tabular"
                  />
                </div>

                <div>
                  <label
                    htmlFor="del-country"
                    className="block text-xs font-semibold text-stone-800 dark:text-zinc-200 mb-1.5"
                  >
                    Country <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="del-country"
                    value={delCountry}
                    onChange={(e) => setDelCountry(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-stone-300 dark:border-zinc-700 bg-stone-50 dark:bg-[#0B0B0E] text-sm"
                  >
                    <option value="Pakistan">Pakistan</option>
                    <option value="UAE">United Arab Emirates</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                </div>
              </div>

              {/* Delivery Speed & Payment Method Radio Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-semibold text-stone-800 dark:text-zinc-200 mb-1.5">
                    Delivery Speed (Radio Buttons) <span className="text-rose-500">*</span>
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { id: 'standard' as const, label: 'Standard (3–5 Days)', sub: 'Free > PKR 25k' },
                      { id: 'express' as const, label: 'Express (24 Hours)', sub: 'Priority Air' }
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                          delShippingSpeed === opt.id
                            ? 'border-[#CBA365] bg-[#CBA365]/15 text-stone-900 dark:text-white'
                            : 'border-stone-300 dark:border-zinc-700 text-stone-600 dark:text-zinc-400'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold">
                          <input
                            type="radio"
                            name="delShippingSpeed"
                            value={opt.id}
                            checked={delShippingSpeed === opt.id}
                            onChange={() => setDelShippingSpeed(opt.id)}
                            className="accent-[#CBA365]"
                          />
                          <span>{opt.label}</span>
                        </div>
                        <span className="block text-[11px] text-[#CBA365] mt-0.5 pl-5">{opt.sub}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-stone-800 dark:text-zinc-200 mb-1.5">
                    Payment Method (Radio Buttons) <span className="text-rose-500">*</span>
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'cod' as const, label: 'Cash on Delivery' },
                      { id: 'card' as const, label: 'Debit / Credit' },
                      { id: 'wallet' as const, label: 'JazzCash / EasyPaisa' }
                    ].map((pm) => (
                      <label
                        key={pm.id}
                        className={`h-14 px-2.5 rounded-xl border text-[11px] font-semibold flex items-center justify-center gap-1.5 text-center cursor-pointer transition-colors ${
                          delPaymentMethod === pm.id
                            ? 'border-[#CBA365] bg-[#CBA365]/15 text-[#CBA365]'
                            : 'border-stone-300 dark:border-zinc-700 text-stone-600 dark:text-zinc-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="delPaymentMethod"
                          value={pm.id}
                          checked={delPaymentMethod === pm.id}
                          onChange={() => setDelPaymentMethod(pm.id)}
                          className="accent-[#CBA365]"
                        />
                        <span>{pm.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Optional Delivery Notes */}
              <div>
                <label
                  htmlFor="del-notes"
                  className="block text-xs font-semibold text-stone-800 dark:text-zinc-200 mb-1.5"
                >
                  Courier Gate Code / Delivery Instructions{' '}
                  <span className="text-stone-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  id="del-notes"
                  rows={2}
                  value={delNotes}
                  onChange={(e) => setDelNotes(e.target.value)}
                  placeholder="Optional: Leave package at reception or call 10 minutes before arrival."
                  className="w-full p-3.5 rounded-xl border border-stone-300 dark:border-zinc-700 bg-stone-50 dark:bg-[#0B0B0E] text-xs"
                />
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-stone-700 dark:text-zinc-300">
                <input
                  type="checkbox"
                  checked={delSaveDefault}
                  onChange={(e) => setDelSaveDefault(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#CBA365]"
                />
                <span>Save as my default delivery address for 1-click checkout</span>
              </label>

              <div className="pt-3 flex flex-wrap items-center gap-3 border-t border-stone-200 dark:border-zinc-800">
                <button
                  type="submit"
                  className="min-h-[44px] px-7 py-2.5 rounded-xl bg-[#CBA365] hover:bg-[#d8b274] text-[#11100E] text-xs font-bold tracking-wider uppercase transition-colors"
                >
                  Save Delivery & Payment Details
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onAskConfirmReset('Delivery & Checkout Form', () => {
                      setDelFullName('');
                      setDelEmail('');
                      setDelPhone('');
                      setDelAddress('');
                      setDelPostalCode('');
                      setDelNotes('');
                      setDelError(null);
                      setDelSuccess(null);
                    })
                  }
                  className="min-h-[44px] px-5 py-2.5 rounded-xl border border-stone-300 dark:border-zinc-700 text-xs font-semibold text-stone-700 dark:text-zinc-300 hover:border-[#CBA365] flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Form</span>
                </button>
              </div>
            </form>
          )}

          {/* ================================================================
              TAB 4: PRODUCT REVIEW SUBMISSION FORM
             ================================================================ */}
          {activeFormTab === 'review' && (
            <form onSubmit={handleReviewSubmit} noValidate className="space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-zinc-800">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#CBA365]">
                    Verified Customer Feedback
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                    Submit a Product Review
                  </h3>
                </div>
                <span className="text-xs text-stone-500 dark:text-zinc-400">
                  Publishes Live to Product Card
                </span>
              </div>

              {revError && (
                <div
                  role="alert"
                  className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 text-xs font-medium text-rose-700 dark:text-rose-300 flex items-center gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{revError}</span>
                </div>
              )}

              {revSuccess && (
                <div
                  role="status"
                  className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-xs font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>{revSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="rev-product"
                    className="block text-xs font-semibold text-stone-800 dark:text-zinc-200 mb-1.5"
                  >
                    Select Product (Drop-Down) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="rev-product"
                    value={revProductId}
                    onChange={(e) => setRevProductId(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-stone-300 dark:border-zinc-700 bg-stone-50 dark:bg-[#0B0B0E] text-xs font-semibold"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (PKR {p.price.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="rev-author"
                    className="block text-xs font-semibold text-stone-800 dark:text-zinc-200 mb-1.5"
                  >
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="rev-author"
                    type="text"
                    required
                    value={revAuthor}
                    onChange={(e) => setRevAuthor(e.target.value)}
                    placeholder="e.g., Hamza Tariq"
                    className="w-full h-11 px-4 rounded-xl border border-stone-300 dark:border-zinc-700 bg-stone-50 dark:bg-[#0B0B0E] text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-semibold text-stone-800 dark:text-zinc-200 mb-1.5">
                    Star Rating <span className="text-rose-500">*</span>
                  </span>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRevRating(star)}
                        className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-colors ${
                          star <= revRating
                            ? 'border-[#CBA365] bg-[#CBA365]/15 text-[#CBA365]'
                            : 'border-stone-300 dark:border-zinc-700 text-stone-400'
                        }`}
                        aria-label={`Rate ${star} out of 5 stars`}
                      >
                        <Star className={`w-4 h-4 ${star <= revRating ? 'fill-[#CBA365]' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-stone-800 dark:text-zinc-200 mb-1.5">
                    Would You Recommend This Item? (Radio)
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { id: 'yes' as const, label: 'Yes, Recommend' },
                      { id: 'no' as const, label: 'No' }
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        className={`h-11 px-3 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer ${
                          revRecommend === opt.id
                            ? 'border-[#CBA365] bg-[#CBA365]/15 text-[#CBA365]'
                            : 'border-stone-300 dark:border-zinc-700 text-stone-600 dark:text-zinc-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="revRecommend"
                          value={opt.id}
                          checked={revRecommend === opt.id}
                          onChange={() => setRevRecommend(opt.id)}
                          className="accent-[#CBA365]"
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="rev-title"
                  className="block text-xs font-semibold text-stone-800 dark:text-zinc-200 mb-1.5"
                >
                  Review Headline <span className="text-rose-500">*</span>
                </label>
                <input
                  id="rev-title"
                  type="text"
                  required
                  value={revTitle}
                  onChange={(e) => setRevTitle(e.target.value)}
                  placeholder="Summarize your experience (e.g., Exceptional build quality & soundstage)"
                  className="w-full h-11 px-4 rounded-xl border border-stone-300 dark:border-zinc-700 bg-stone-50 dark:bg-[#0B0B0E] text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="rev-comment"
                  className="block text-xs font-semibold text-stone-800 dark:text-zinc-200 mb-1.5"
                >
                  Detailed Review <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="rev-comment"
                  rows={3}
                  required
                  value={revComment}
                  onChange={(e) => setRevComment(e.target.value)}
                  placeholder="Share details about the product quality, packaging, and performance..."
                  className="w-full p-3.5 rounded-xl border border-stone-300 dark:border-zinc-700 bg-stone-50 dark:bg-[#0B0B0E] text-xs"
                />
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-stone-700 dark:text-zinc-300">
                <input
                  type="checkbox"
                  checked={revVerified}
                  onChange={(e) => setRevVerified(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#CBA365]"
                />
                <span>I confirm this review is based on my genuine experience with this item</span>
              </label>

              <div className="pt-3 flex flex-wrap items-center gap-3 border-t border-stone-200 dark:border-zinc-800">
                <button
                  type="submit"
                  className="min-h-[44px] px-7 py-2.5 rounded-xl bg-[#CBA365] hover:bg-[#d8b274] text-[#11100E] text-xs font-bold tracking-wider uppercase transition-colors"
                >
                  Publish Review (Submit)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onAskConfirmReset('Product Review Form', () => {
                      setRevAuthor('');
                      setRevTitle('');
                      setRevComment('');
                      setRevRating(5);
                      setRevError(null);
                      setRevSuccess(null);
                    })
                  }
                  className="min-h-[44px] px-5 py-2.5 rounded-xl border border-stone-300 dark:border-zinc-700 text-xs font-semibold text-stone-700 dark:text-zinc-300 hover:border-[#CBA365] flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right 4 Columns: Form Controls & Usability Principles Checklist Card */}
        <aside className="lg:col-span-4 rounded-2xl bg-white dark:bg-[#121216] border border-stone-200 dark:border-zinc-800/90 p-6 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-200 dark:border-zinc-800">
            <div className="w-10 h-10 rounded-xl bg-[#CBA365]/15 border border-[#CBA365]/40 flex items-center justify-center text-[#CBA365] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#CBA365]">
                HCI Form Architecture
              </span>
              <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                Included Form Controls & Usability
              </h3>
            </div>
          </div>

          <ul className="space-y-3 text-xs text-stone-600 dark:text-zinc-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#CBA365] shrink-0 mt-0.5" />
              <span>
                <strong className="text-stone-900 dark:text-white">Text, Email & Tel Inputs:</strong> Full-width name & address fields prevent character clipping.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#CBA365] shrink-0 mt-0.5" />
              <span>
                <strong className="text-stone-900 dark:text-white">Password Masking & Toggle:</strong> Masked by default with 44×44px Show/Hide eye buttons.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#CBA365] shrink-0 mt-0.5" />
              <span>
                <strong className="text-stone-900 dark:text-white">Radio Buttons & Checkboxes:</strong> Used for Membership Tiers, Delivery Speed, Payment Methods, and Terms consent.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#CBA365] shrink-0 mt-0.5" />
              <span>
                <strong className="text-stone-900 dark:text-white">Drop-Down Lists:</strong> Country, City, and Product selectors with keyboard navigation.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#CBA365] shrink-0 mt-0.5" />
              <span>
                <strong className="text-stone-900 dark:text-white">Error Prevention & Reset Confirmation:</strong> Clear required (<span className="text-rose-500">*</span>) vs optional markers and confirmation dialog before clearing inputs.
              </span>
            </li>
          </ul>
        </aside>
      </div>
    </section>
  );
};
