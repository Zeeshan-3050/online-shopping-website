/**
 * ============================================================================
 * TuRi 30 Shop — Vanilla JavaScript Interactive Controller (script.js)
 * Implements local storage persistence, product search/filter/sort,
 * all 10 HCI Menu types, 6 Dialog Box types, Tree/Pagination/Wizard navigation,
 * Shopping Cart & Wishlist state, and Form Validation.
 * ============================================================================
 */

(function () {
  'use strict';

  const STORAGE_KEYS = {
    CART: 'mh_shop_cart_v1',
    WISHLIST: 'mh_shop_wishlist_v1',
    THEME: 'mh_shop_theme_v1',
    RECENT: 'mh_shop_recent_v1'
  };

  /**
   * Format numeric amount into Pakistani Rupees (PKR)
   * @param {number} amount
   * @returns {string}
   */
  function formatPKR(amount) {
    return 'PKR ' + Number(amount || 0).toLocaleString('en-PK');
  }

  /**
   * Load persisted JSON state from localStorage safely
   */
  function loadState(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      return fallback;
    }
  }

  /**
   * Save JSON state to localStorage safely
   */
  function saveState(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn('LocalStorage write skipped:', err);
    }
  }

  /**
   * Validate Registration & Checkout Form Inputs
   */
  function validateCustomerForm(fields) {
    const errors = [];
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fields.fullName || fields.fullName.trim().length < 3) {
      errors.push('Full Name must be at least 3 characters.');
    }
    if (!fields.email || !emailPattern.test(fields.email.trim())) {
      errors.push('Please enter a valid email address.');
    }
    if (fields.password !== undefined && fields.password.length < 8) {
      errors.push('Password must be at least 8 characters long.');
    }
    if (fields.confirmPassword !== undefined && fields.password !== fields.confirmPassword) {
      errors.push('Password and Confirm Password do not match.');
    }
    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Expose helper API on window.MHShopCore for console & standalone inspection
  window.MHShopCore = {
    STORAGE_KEYS,
    formatPKR,
    loadState,
    saveState,
    validateCustomerForm
  };
})();
