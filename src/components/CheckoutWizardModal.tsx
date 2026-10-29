import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Truck,
  CreditCard,
  ShieldCheck,
  Printer,
  RotateCcw
} from 'lucide-react';
import { Product } from '../data/shopData';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CheckoutWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onCompleteOrder: (orderRef: string, totalPKR: number) => void;
  onTriggerErrorDialog: (title: string, msg: string) => void;
}

export const CheckoutWizardModal: React.FC<CheckoutWizardModalProps> = ({
  isOpen,
  onClose,
  cart,
  onCompleteOrder,
  onTriggerErrorDialog
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Customer Information
  const [fullName, setFullName] = useState('Muhammad Hassan');
  const [email, setEmail] = useState('hassan.hci@university.edu.pk');
  const [phone, setPhone] = useState('0300-4567890');

  // Step 2: Delivery Address
  const [address, setAddress] = useState('House 42, Street 11, Sector F-7/2');
  const [city, setCity] = useState('Islamabad');
  const [postalCode, setPostalCode] = useState('44000');
  const [country, setCountry] = useState('Pakistan');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Step 3: Delivery & Payment
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'democard'>('cod');
  const [demoCardHolder, setDemoCardHolder] = useState('M HASSAN (DEMO)');

  // Step 5: Completed Order Reference
  const [completedOrderRef, setCompletedOrderRef] = useState('');
  const [completedTotal, setCompletedTotal] = useState(0);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal === 0 ? 0 : deliveryMethod === 'express' ? 850 : subtotal >= 25000 ? 0 : 350;
  const finalTotal = subtotal + deliveryFee;

  const stepsMeta = [
    { num: 1, label: '1. Customer Info' },
    { num: 2, label: '2. Delivery Address' },
    { num: 3, label: '3. Delivery & Payment' },
    { num: 4, label: '4. Review Order' },
    { num: 5, label: '5. Confirmation' }
  ];

  const validateAndAdvance = () => {
    if (step === 1) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (fullName.trim().length < 3 || !emailRegex.test(email.trim()) || phone.trim().length < 10) {
        onTriggerErrorDialog(
          'Step 1 Validation Error',
          'Please provide your Full Name (min 3 chars), a valid Email Address, and a 10+ digit Phone Number before advancing to Step 2.'
        );
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (address.trim().length < 6 || city.trim().length < 2 || postalCode.trim().length < 4) {
        onTriggerErrorDialog(
          'Step 2 Address Validation Error',
          'Please complete your Street Delivery Address, City, and Postal Code before advancing to Step 3.'
        );
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (paymentMethod === 'democard' && demoCardHolder.trim().length < 3) {
        onTriggerErrorDialog(
          'Step 3 Payment Validation Error',
          'Please enter a Demo Cardholder Name for the simulated card checkout.'
        );
        return;
      }
      setStep(4);
    } else if (step === 4) {
      if (cart.length === 0) {
        onTriggerErrorDialog(
          'Empty Cart Error',
          'Your shopping cart is empty. Please add at least one product before confirming an order.'
        );
        return;
      }
      const ref = `TR30-${Math.floor(100000 + Math.random() * 900000)}`;
      setCompletedOrderRef(ref);
      setCompletedTotal(finalTotal);
      setStep(5);
      onCompleteOrder(ref, finalTotal);
    }
  };

  const resetWizardFields = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setCity('');
    setPostalCode('');
    setCountry('Pakistan');
    setDeliveryNotes('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wizard-modal-title"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-2xl overflow-hidden my-8"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-950">
          <div>
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
              HCI Navigation Element #3: 5-Step Wizard Navigation & Checkout Form
            </span>
            <h2 id="wizard-modal-title" className="text-lg font-bold text-stone-900 dark:text-zinc-100">
              TuRi 30 Shop Simulated Order Checkout Wizard
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout wizard"
            className="w-11 h-11 rounded-lg flex items-center justify-center text-stone-500 hover:bg-stone-200 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Progress Bar */}
        <div className="px-6 py-4 bg-stone-100/70 dark:bg-zinc-900 border-b border-stone-200 dark:border-zinc-800">
          <div className="grid grid-cols-5 gap-2">
            {stepsMeta.map((s) => {
              const isCurrent = step === s.num;
              const isCompleted = step > s.num;
              return (
                <div key={s.num} className="flex flex-col">
                  <div
                    className={`h-2 rounded-full transition-colors ${
                      isCompleted
                        ? 'bg-emerald-600'
                        : isCurrent
                        ? 'bg-amber-600'
                        : 'bg-stone-300 dark:bg-zinc-700'
                    }`}
                  />
                  <span
                    className={`mt-1.5 text-[11px] font-semibold truncate ${
                      isCurrent
                        ? 'text-amber-700 dark:text-amber-400'
                        : isCompleted
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-stone-400 dark:text-zinc-500'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wizard Step Body */}
        <div className="p-6 lg:p-8">
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-stone-900 dark:text-zinc-100">
                  Step 1 of 5: Customer Information
                </h3>
                <button
                  type="button"
                  onClick={resetWizardFields}
                  className="text-xs font-medium text-stone-500 hover:text-stone-900 dark:hover:text-white flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Form</span>
                </button>
              </div>
              <p className="text-xs text-stone-500 dark:text-zinc-400">
                Enter your contact details for order updates. Required fields are marked with <span className="text-rose-500 font-bold">*</span>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="wiz-fullname" className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1.5">
                    Recipient Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="wiz-fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Muhammad Hassan"
                    className="w-full h-11 px-3.5 rounded-lg border border-stone-300 dark:border-zinc-700 bg-transparent text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="wiz-email" className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="wiz-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@university.edu.pk"
                    className="w-full h-11 px-3.5 rounded-lg border border-stone-300 dark:border-zinc-700 bg-transparent text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="wiz-phone" className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1.5">
                    Mobile Phone Number (SMS Tracking) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="wiz-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300-4567890"
                    className="w-full h-11 px-3.5 rounded-lg border border-stone-300 dark:border-zinc-700 bg-transparent text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-stone-900 dark:text-zinc-100">
                Step 2 of 5: Delivery Address & Country Selection
              </h3>
              <p className="text-xs text-stone-500 dark:text-zinc-400">
                Entered details are preserved automatically when moving Back and Next between wizard steps.
              </p>

              <div className="space-y-4">
                <div>
                  <label htmlFor="wiz-address" className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1.5">
                    Street Address, House / Apartment No. <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="wiz-address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House 42, Street 11, Sector F-7/2"
                    className="w-full h-11 px-3.5 rounded-lg border border-stone-300 dark:border-zinc-700 bg-transparent text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="wiz-city" className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1.5">
                      City <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="wiz-city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Islamabad"
                      className="w-full h-11 px-3.5 rounded-lg border border-stone-300 dark:border-zinc-700 bg-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="wiz-postal" className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1.5">
                      Postal Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="wiz-postal"
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="44000"
                      className="w-full h-11 px-3.5 rounded-lg border border-stone-300 dark:border-zinc-700 bg-transparent text-sm font-mono-tabular"
                    />
                  </div>

                  <div>
                    <label htmlFor="wiz-country" className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1.5">
                      Country (Drop-Down Menu) <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="wiz-country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full h-11 px-3 rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm"
                    >
                      <option value="Pakistan">Pakistan (PKR)</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                      <option value="Saudi Arabia">Saudi Arabia</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="wiz-notes" className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1.5">
                    Courier Instructions / Landmark (Optional)
                  </label>
                  <input
                    id="wiz-notes"
                    type="text"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="e.g. Ring bell twice or leave at security gate"
                    className="w-full h-11 px-3.5 rounded-lg border border-stone-300 dark:border-zinc-700 bg-transparent text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-stone-900 dark:text-zinc-100">
                Step 3 of 5: Delivery Speed & Simulated Payment Method
              </h3>

              {/* Delivery Radio Buttons */}
              <fieldset className="space-y-2.5">
                <legend className="text-xs font-semibold text-stone-700 dark:text-zinc-300">
                  Select Delivery Option (Radio Buttons)
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`p-4 rounded-xl border cursor-pointer flex items-start gap-3 transition-colors ${
                      deliveryMethod === 'standard'
                        ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/30'
                        : 'border-stone-200 dark:border-zinc-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryMethod"
                      checked={deliveryMethod === 'standard'}
                      onChange={() => setDeliveryMethod('standard')}
                      className="mt-1 w-4 h-4 accent-amber-600"
                    />
                    <div>
                      <div className="flex items-center gap-2 font-semibold text-sm">
                        <Truck className="w-4 h-4 text-amber-600" />
                        <span>Standard Tracked Courier</span>
                      </div>
                      <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
                        2–3 business days · {subtotal >= 25000 ? 'FREE (Orders > PKR 25k)' : 'PKR 350'}
                      </p>
                    </div>
                  </label>

                  <label
                    className={`p-4 rounded-xl border cursor-pointer flex items-start gap-3 transition-colors ${
                      deliveryMethod === 'express'
                        ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/30'
                        : 'border-stone-200 dark:border-zinc-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryMethod"
                      checked={deliveryMethod === 'express'}
                      onChange={() => setDeliveryMethod('express')}
                      className="mt-1 w-4 h-4 accent-amber-600"
                    />
                    <div>
                      <div className="flex items-center gap-2 font-semibold text-sm">
                        <Truck className="w-4 h-4 text-amber-600" />
                        <span>Priority Air Express</span>
                      </div>
                      <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
                        Next-day priority dispatch · PKR 850 flat fee
                      </p>
                    </div>
                  </label>
                </div>
              </fieldset>

              {/* Payment Method Radio Buttons */}
              <fieldset className="space-y-2.5">
                <legend className="text-xs font-semibold text-stone-700 dark:text-zinc-300">
                  Select Simulated Payment Method (No Real Payment Processed)
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`p-4 rounded-xl border cursor-pointer flex items-start gap-3 transition-colors ${
                      paymentMethod === 'cod'
                        ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/30'
                        : 'border-stone-200 dark:border-zinc-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 w-4 h-4 accent-amber-600"
                    />
                    <div>
                      <div className="flex items-center gap-2 font-semibold text-sm">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Cash on Delivery (COD)</span>
                      </div>
                      <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
                        Pay in Pakistani Rupees (PKR) at your doorstep upon receiving your parcel.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`p-4 rounded-xl border cursor-pointer flex items-start gap-3 transition-colors ${
                      paymentMethod === 'democard'
                        ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/30'
                        : 'border-stone-200 dark:border-zinc-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'democard'}
                      onChange={() => setPaymentMethod('democard')}
                      className="mt-1 w-4 h-4 accent-amber-600"
                    />
                    <div>
                      <div className="flex items-center gap-2 font-semibold text-sm">
                        <CreditCard className="w-4 h-4 text-amber-600" />
                        <span>Demo Card Sandbox</span>
                      </div>
                      <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
                        Simulated university HCI demo payment. Do not enter real card numbers.
                      </p>
                    </div>
                  </label>
                </div>
              </fieldset>

              {paymentMethod === 'democard' && (
                <div className="p-4 rounded-xl bg-stone-100 dark:bg-zinc-800/80 border border-stone-200 dark:border-zinc-700 space-y-3">
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                    HCI Sandbox Card Token (Pre-filled Safe Simulation — No Real Card Collected)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="demo-card-holder" className="block text-xs font-medium mb-1">
                        Demo Cardholder Label
                      </label>
                      <input
                        id="demo-card-holder"
                        type="text"
                        value={demoCardHolder}
                        onChange={(e) => setDemoCardHolder(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Simulated Sandbox Token</label>
                      <input
                        type="text"
                        disabled
                        value="DEMO-XXXX-XXXX-4242 (SIMULATED)"
                        className="w-full h-10 px-3 rounded-lg border border-stone-200 dark:border-zinc-700 bg-stone-200/70 dark:bg-zinc-950 text-xs font-mono-tabular text-stone-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <h3 className="text-base font-bold text-stone-900 dark:text-zinc-100">
                Step 4 of 5: Review Order Summary Before Confirming
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 dark:text-zinc-100">Customer & Shipping</span>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-amber-600 hover:underline font-medium"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-stone-700 dark:text-zinc-300 font-medium">{fullName}</p>
                  <p className="text-stone-500 dark:text-zinc-400">{email} · {phone}</p>
                  <p className="text-stone-600 dark:text-zinc-300 pt-1">
                    {address}, {city} {postalCode}, {country}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 dark:text-zinc-100">Delivery & Payment</span>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="text-amber-600 hover:underline font-medium"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-stone-700 dark:text-zinc-300">
                    Method: <strong>{deliveryMethod === 'express' ? 'Priority Air Express' : 'Standard Tracked Courier'}</strong>
                  </p>
                  <p className="text-stone-700 dark:text-zinc-300">
                    Payment: <strong>{paymentMethod === 'cod' ? 'Cash on Delivery (PKR)' : `Simulated Demo Card (${demoCardHolder})`}</strong>
                  </p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium pt-1">
                    Simulated University HCI Order — No real charges will occur.
                  </p>
                </div>
              </div>

              {/* Itemized Order Lines */}
              <div className="rounded-xl border border-stone-200 dark:border-zinc-800 overflow-hidden">
                <div className="max-h-48 overflow-y-auto divide-y divide-stone-200 dark:divide-zinc-800">
                  {cart.map((item) => (
                    <div key={item.product.id} className="px-4 py-3 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-stone-900 dark:text-zinc-100">{item.product.name}</p>
                        <p className="text-stone-500 dark:text-zinc-400 font-mono-tabular">
                          PKR {item.product.price.toLocaleString()} × {item.quantity}
                        </p>
                      </div>
                      <span className="font-mono-tabular font-bold text-stone-900 dark:text-zinc-100">
                        PKR {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-stone-50 dark:bg-zinc-950 border-t border-stone-200 dark:border-zinc-800 space-y-1.5 text-xs">
                  <div className="flex justify-between text-stone-600 dark:text-zinc-400">
                    <span>Items Subtotal</span>
                    <span className="font-mono-tabular">PKR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-stone-600 dark:text-zinc-400">
                    <span>Demo Delivery Fee</span>
                    <span className="font-mono-tabular">
                      {deliveryFee === 0 ? 'FREE' : `PKR ${deliveryFee.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-stone-900 dark:text-zinc-100 pt-2 border-t border-stone-200 dark:border-zinc-800">
                    <span>Final Simulated Order Total</span>
                    <span className="font-mono-tabular text-amber-700 dark:text-amber-400">
                      PKR {finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <span className="text-xs font-mono-tabular uppercase text-emerald-700 dark:text-emerald-400 font-semibold">
                  Step 5 of 5 · Simulated Order Confirmed
                </span>
                <h3 className="text-2xl font-bold text-stone-900 dark:text-zinc-100 mt-1">
                  Thank You, {fullName}!
                </h3>
                <p className="text-sm text-stone-600 dark:text-zinc-300 mt-1">
                  Order Reference: <strong className="font-mono-tabular text-stone-900 dark:text-white">{completedOrderRef}</strong> · Total: <strong className="font-mono-tabular">PKR {completedTotal.toLocaleString()}</strong>
                </p>
              </div>

              <div className="max-w-md mx-auto p-4 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-xs text-stone-600 dark:text-zinc-400 text-left space-y-1">
                <p><strong>Recipient:</strong> {fullName} ({phone})</p>
                <p><strong>Destination:</strong> {address}, {city}, {country}</p>
                <p><strong>Payment Mode:</strong> {paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Simulated Demo Card'}</p>
                <p className="text-emerald-700 dark:text-emerald-400 pt-1">
                  Note: This is a simulated university HCI order confirmation. No real payment was charged.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="min-h-[44px] px-4 py-2 rounded-lg border border-stone-300 dark:border-zinc-700 text-xs font-semibold flex items-center gap-2 hover:bg-stone-100 dark:hover:bg-zinc-800"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Order Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    onClose();
                  }}
                  className="min-h-[44px] px-5 py-2 rounded-lg bg-stone-900 dark:bg-amber-600 text-white text-xs font-semibold hover:bg-stone-800"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Navigation Controls (Back & Next) */}
        {step < 5 && (
          <div className="px-6 py-4 bg-stone-50 dark:bg-zinc-950 border-t border-stone-200 dark:border-zinc-800 flex items-center justify-between">
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep((s) => Math.max(1, s - 1) as 1 | 2 | 3 | 4 | 5)}
              className="min-h-[44px] px-4 py-2 rounded-lg border border-stone-300 dark:border-zinc-700 text-xs font-semibold flex items-center gap-2 disabled:opacity-40 disabled:pointer-events-none hover:bg-stone-100 dark:hover:bg-zinc-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <div className="text-xs font-mono-tabular text-stone-500 dark:text-zinc-400">
              Wizard Step {step} of 5
            </div>

            <button
              type="button"
              onClick={validateAndAdvance}
              className="min-h-[44px] px-6 py-2.5 rounded-lg bg-stone-900 dark:bg-amber-600 text-white text-xs font-semibold flex items-center gap-2 hover:bg-stone-800 dark:hover:bg-amber-500 transition-colors"
            >
              <span>{step === 4 ? `Place Simulated Order (PKR ${finalTotal.toLocaleString()})` : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
