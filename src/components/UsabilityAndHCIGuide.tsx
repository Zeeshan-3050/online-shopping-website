import React, { useState } from 'react';
import {
  Home,
  Search,
  User,
  ShoppingCart,
  Heart,
  Settings,
  Save,
  Trash2,
  Edit3,
  Filter,
  ArrowUpDown,
  Menu,
  X,
  Bell,
  HelpCircle,
  Share2,
  Eye,
  EyeOff,
  CheckCircle2,
  Play,
  Ruler,
  BookOpen
} from 'lucide-react';
import { HCI_GUIDE_ENTRIES, HCIGuideEntry } from '../data/shopData';

interface UsabilityAndHCIGuideProps {
  onTriggerDemoAction: (actionId: string) => void;
  onShowToast: (msg: string) => void;
  onAskConfirmReset: (onConfirm: () => void) => void;
}

export const UsabilityAndHCIGuide: React.FC<UsabilityAndHCIGuideProps> = ({
  onTriggerDemoAction,
  onShowToast,
  onAskConfirmReset
}) => {
  // Interactive Usability Lab State
  const [showOverlayGrid, setShowOverlayGrid] = useState(true);
  const [labFullName, setLabFullName] = useState('Ayesha Siddiqui');
  const [labEmail, setLabEmail] = useState('ayesha.hci@nust.edu.pk');
  const [labPassword, setLabPassword] = useState('HCI-Design-2026');
  const [showLabPass, setShowLabPass] = useState(false);
  const [labCity, setLabCity] = useState('Lahore');
  const [labSubmitted, setLabSubmitted] = useState(false);

  // HCI Guide Filter State
  const [selectedGuideCategory, setSelectedGuideCategory] = useState<'All' | HCIGuideEntry['category']>('All');
  const [guideSearch, setGuideSearch] = useState('');

  // Interactive mini-demo state inside HCI Guide cards
  const [miniDropdownVal, setMiniDropdownVal] = useState('Price: Low to High');
  const [miniTabVal, setMiniTabVal] = useState<'desc' | 'specs'>('desc');

  const filteredEntries = HCI_GUIDE_ENTRIES.filter((entry) => {
    const matchesCat = selectedGuideCategory === 'All' || entry.category === selectedGuideCategory;
    const matchesQuery =
      !guideSearch.trim() ||
      entry.name.toLowerCase().includes(guideSearch.toLowerCase()) ||
      entry.definition.toLowerCase().includes(guideSearch.toLowerCase()) ||
      entry.whereUsed.toLowerCase().includes(guideSearch.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // All 16 Required Icons from Section 4.C of the Prompt
  const iconSystemItems = [
    { name: 'Home', Icon: Home, action: 'demo-scroll-top', desc: 'Navigates to storefront top' },
    { name: 'Search', Icon: Search, action: 'demo-focus-search', desc: 'Focuses product search input' },
    { name: 'User / Profile', Icon: User, action: 'demo-forms', desc: 'Opens Login & Registration Modal' },
    { name: 'Shopping Cart', Icon: ShoppingCart, action: 'demo-open-cart', desc: 'Opens slide-over Shopping Cart' },
    { name: 'Wishlist', Icon: Heart, action: 'demo-open-wishlist', desc: 'Opens saved Wishlist drawer' },
    { name: 'Settings', Icon: Settings, action: 'demo-ribbon', desc: 'Opens Ribbon Settings tab' },
    { name: 'Save', Icon: Save, action: 'demo-dialog-message', desc: 'Saves cart snapshot to LocalStorage' },
    { name: 'Delete', Icon: Trash2, action: 'demo-dialog-confirm', desc: 'Triggers Confirmation Dialog before delete' },
    { name: 'Edit', Icon: Edit3, action: 'demo-tabmenu', desc: 'Opens Product Review & Edit form' },
    { name: 'Filter', Icon: Filter, action: 'demo-nav-tree', desc: 'Scrolls to category & price filters' },
    { name: 'Sort', Icon: ArrowUpDown, action: 'demo-dropdown', desc: 'Focuses catalog Sort drop-down' },
    { name: 'Menu (Hamburger)', Icon: Menu, action: 'demo-hamburger', desc: 'Opens mobile/drawer navigation' },
    { name: 'Close', Icon: X, action: 'demo-close-info', desc: 'Dismisses active panels or notifications' },
    { name: 'Notifications', Icon: Bell, action: 'demo-toast', desc: 'Triggers live store status notification' },
    { name: 'Help', Icon: HelpCircle, action: 'demo-dialog-modeless', desc: 'Opens Modeless Shopping Help panel' },
    { name: 'Share', Icon: Share2, action: 'demo-share', desc: 'Copies store catalog link to clipboard' }
  ];

  return (
    <div className="space-y-20">
      {/* ====================================================================
          SECTION 4.F: FORM SIZE & USABILITY PRINCIPLES INTERACTIVE LAB
         ==================================================================== */}
      <section id="section-usability-lab" className="scroll-mt-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200 dark:border-zinc-800">
          <div>
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
              PDF Section 4.F · Human-Factors & Ergonomics
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-zinc-100 mt-1">
              Form Size & Usability Principles Interactive Lab
            </h2>
            <p className="text-sm text-stone-600 dark:text-zinc-400 mt-1 max-w-2xl">
              Demonstrating the 6 core form-design principles from the HCI PDF: Consistency, Visibility, Accessibility (≥ 44 × 44 px targets), Readability, Alignment, and Error Prevention.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowOverlayGrid((v) => !v)}
            className={`min-h-[44px] px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-colors shrink-0 ${
              showOverlayGrid
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-white dark:bg-zinc-900 border-stone-300 dark:border-zinc-700 text-stone-800 dark:text-zinc-200'
            }`}
          >
            <Ruler className="w-4 h-4" />
            <span>{showOverlayGrid ? 'Hide 44×44px Ergonomic Ruler Overlay' : 'Show 44×44px Ergonomic Ruler Overlay'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
          {/* 6 Principles Breakdown Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
            {[
              {
                num: '01. Consistency',
                desc: 'All input heights (44px), border radii (8px), label weights, and primary button placements follow a uniform visual contract.'
              },
              {
                num: '02. Visibility',
                desc: 'High-contrast labels, clear required asterisks (*), visible focus rings, and explicit PKR order totals prevent guesswork.'
              },
              {
                num: '03. Accessibility (44 × 44 px)',
                desc: 'Interactive buttons, password reveal toggles, and checkboxes meet the ~44×44px touch/click ergonomics guideline (Fitts’s Law).'
              },
              {
                num: '04. Readability',
                desc: 'Set in Plus Jakarta Sans (15px body) with 1.5x line spacing and tabular monospace numerals for prices and quantities.'
              },
              {
                num: '05. Alignment',
                desc: 'Top-aligned vertical labels sit directly above inputs with a consistent 6px vertical gap for rapid eye-scanning.'
              },
              {
                num: '06. Error Prevention',
                desc: 'Full-width name fields prevent clipping, passwords mask by default, and destructive Reset actions ask for confirmation first.'
              }
            ].map((p) => (
              <div
                key={p.num}
                className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800"
              >
                <h3 className="text-sm font-bold text-stone-900 dark:text-zinc-100">{p.num}</h3>
                <p className="text-xs text-stone-600 dark:text-zinc-400 mt-1 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Interactive Annotated Form Specimen */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-100 dark:border-zinc-800">
              <div>
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                  Live Interactive Usability Specimen
                </span>
                <h3 className="text-lg font-bold text-stone-900 dark:text-zinc-100">
                  Express Delivery & Customer Verification Form
                </h3>
              </div>
              {showOverlayGrid && (
                <span className="text-[11px] font-mono-tabular text-amber-600 dark:text-amber-400">
                  [Ruler Overlay Active]
                </span>
              )}
            </div>

            {labSubmitted && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Verified! All usability constraints passed with zero input errors.</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setLabSubmitted(true);
                onShowToast('Usability Lab form validated and submitted!');
              }}
              className={`space-y-5 ${showOverlayGrid ? 'relative' : ''}`}
            >
              {/* Full-width Full Name Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="lab-fullname" className="text-xs font-semibold text-stone-800 dark:text-zinc-200">
                    Customer Full Name (Sufficiently Wide 100% Field) <span className="text-rose-500">*</span>
                  </label>
                  {showOverlayGrid && (
                    <span className="text-[10px] font-mono-tabular text-amber-600">width: 100% · height: 44px</span>
                  )}
                </div>
                <input
                  id="lab-fullname"
                  type="text"
                  required
                  value={labFullName}
                  onChange={(e) => {
                    setLabFullName(e.target.value);
                    setLabSubmitted(false);
                  }}
                  className={`w-full h-11 px-3.5 rounded-lg border text-sm bg-transparent ${
                    showOverlayGrid
                      ? 'border-amber-500 ring-2 ring-amber-500/20'
                      : 'border-stone-300 dark:border-zinc-700'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="lab-email" className="text-xs font-semibold text-stone-800 dark:text-zinc-200">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    {showOverlayGrid && (
                      <span className="text-[10px] font-mono-tabular text-amber-600">Alignment: Grid Col 1</span>
                    )}
                  </div>
                  <input
                    id="lab-email"
                    type="email"
                    required
                    value={labEmail}
                    onChange={(e) => setLabEmail(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-lg border border-stone-300 dark:border-zinc-700 text-sm bg-transparent"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="lab-city" className="text-xs font-semibold text-stone-800 dark:text-zinc-200">
                      Delivery Hub (Drop-Down) <span className="text-rose-500">*</span>
                    </label>
                    {showOverlayGrid && (
                      <span className="text-[10px] font-mono-tabular text-amber-600">Alignment: Grid Col 2</span>
                    )}
                  </div>
                  <select
                    id="lab-city"
                    value={labCity}
                    onChange={(e) => setLabCity(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm"
                  >
                    <option value="Lahore">Lahore Fulfilment Hub</option>
                    <option value="Islamabad">Islamabad / Rawalpindi Hub</option>
                    <option value="Karachi">Karachi Port Hub</option>
                    <option value="Peshawar">Peshawar Regional Hub</option>
                  </select>
                </div>
              </div>

              {/* Password Field Masked by Default with 44x44px Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="lab-pass" className="text-xs font-semibold text-stone-800 dark:text-zinc-200">
                    Account Verification PIN / Password (Masked by Default) <span className="text-rose-500">*</span>
                  </label>
                  {showOverlayGrid && (
                    <span className="text-[10px] font-mono-tabular text-amber-600">Toggle button: 44×44px target</span>
                  )}
                </div>
                <div className="relative flex items-center">
                  <input
                    id="lab-pass"
                    type={showLabPass ? 'text' : 'password'}
                    required
                    value={labPassword}
                    onChange={(e) => setLabPassword(e.target.value)}
                    className="w-full h-11 pl-3.5 pr-12 rounded-lg border border-stone-300 dark:border-zinc-700 text-sm bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLabPass((s) => !s)}
                    aria-label={showLabPass ? 'Hide password' : 'Show password'}
                    title="44x44px Accessible Password Visibility Control"
                    className={`absolute right-0 w-11 h-11 rounded-r-lg flex items-center justify-center text-stone-600 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800 ${
                      showOverlayGrid ? 'border-2 border-dashed border-amber-500 bg-amber-500/10' : ''
                    }`}
                  >
                    {showLabPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons with 44px Minimum Height & Error-Preventing Reset Confirmation */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className={`min-h-[44px] min-w-[44px] px-6 py-2.5 rounded-lg bg-stone-900 dark:bg-amber-600 text-white text-sm font-semibold hover:bg-stone-800 dark:hover:bg-amber-500 transition-colors ${
                      showOverlayGrid ? 'ring-2 ring-offset-2 ring-amber-500' : ''
                    }`}
                  >
                    Verify & Save Preferences
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onAskConfirmReset(() => {
                        setLabFullName('');
                        setLabEmail('');
                        setLabPassword('');
                        setLabSubmitted(false);
                        onShowToast('Usability Lab form fields cleared after confirmation.');
                      });
                    }}
                    className={`min-h-[44px] min-w-[44px] px-4 py-2.5 rounded-lg border border-stone-300 dark:border-zinc-700 text-sm font-medium text-stone-700 dark:text-zinc-200 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors ${
                      showOverlayGrid ? 'border-dashed border-amber-500' : ''
                    }`}
                  >
                    Reset Form (Asks Confirmation)
                  </button>
                </div>

                {showOverlayGrid && (
                  <span className="text-[11px] font-mono-tabular text-stone-500 dark:text-zinc-400">
                    All controls ≥ 44px height
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 4.C: CONSISTENT 16-ICON SYSTEM MATRIX
         ==================================================================== */}
      <section id="section-icon-system" className="scroll-mt-28">
        <div className="pb-6 border-b border-stone-200 dark:border-zinc-800">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
            PDF Section 4.C · Visual Affordances & Accessible Labels
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-zinc-100 mt-1">
            Consistent 16-Icon Interactive System
          </h2>
          <p className="text-sm text-stone-600 dark:text-zinc-400 mt-1">
            Every icon in TuRi 30 Shop pairs a recognizable vector symbol with an accessible name, tooltip, and working click handler. Click any icon below to test its live function in the store.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mt-6">
          {iconSystemItems.map(({ name, Icon, action, desc }) => (
            <button
              key={name}
              type="button"
              onClick={() => onTriggerDemoAction(action)}
              title={`${name}: ${desc}`}
              aria-label={`${name} — ${desc}`}
              className="group p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 hover:border-amber-500 dark:hover:border-amber-500 flex flex-col items-center text-center transition-all hover:-translate-y-0.5"
            >
              <div className="w-11 h-11 rounded-xl bg-stone-100 dark:bg-zinc-800 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center text-stone-800 dark:text-zinc-200 transition-colors">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-stone-900 dark:text-zinc-100 mt-2.5">{name}</span>
              <span className="text-[11px] text-stone-500 dark:text-zinc-400 mt-0.5 line-clamp-2">{desc}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ====================================================================
          SECTION 7: HCI LEARNING & DEMONSTRATION GUIDE
         ==================================================================== */}
      <section id="section-hci-guide" className="scroll-mt-28">
        <div className="p-6 sm:p-8 rounded-2xl bg-stone-900 dark:bg-zinc-900 text-white border border-stone-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-800">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
                <BookOpen className="w-4 h-4" />
                <span>University HCI Reference & Live Demonstration Mode</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mt-1">
                Complete HCI Interface Design Elements Guide
              </h2>
              <p className="text-sm text-stone-300 mt-1 max-w-2xl">
                Explore every menu type, form control, icon system, dialog box, navigation pattern, and usability principle from the PDF—complete with definitions, explanations, and 1-click "Try Demo in Shop" triggers.
              </p>
            </div>

            <div className="w-full lg:w-72">
              <label htmlFor="hci-guide-search" className="sr-only">
                Search HCI Elements
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="hci-guide-search"
                  type="text"
                  value={guideSearch}
                  onChange={(e) => setGuideSearch(e.target.value)}
                  placeholder="Filter HCI elements (e.g. Pie, Modal)..."
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-stone-800 border border-stone-700 text-xs text-white placeholder:text-stone-400"
                />
              </div>
            </div>
          </div>

          {/* Filter Tabs by PDF Category */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-4">
            {(['All', 'Menus', 'Forms', 'Icons', 'Dialogs', 'Navigation', 'Usability Principles'] as const).map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedGuideCategory(cat)}
                  className={`min-h-[40px] px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedGuideCategory === cat
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          {/* Guide Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
            {filteredEntries.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-xl bg-stone-950/90 border border-stone-800 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 text-xs text-amber-400 font-mono-tabular">
                    <span>Category: {item.category}</span>
                    <span>Integrated in TuRi 30 Shop</span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{item.name}</h3>

                  <div className="space-y-1.5 text-xs text-stone-300 leading-relaxed">
                    <p>
                      <strong className="text-white">1. Definition:</strong> {item.definition}
                    </p>
                    <p>
                      <strong className="text-white">2. Purpose:</strong> {item.purpose}
                    </p>
                    <p>
                      <strong className="text-white">3. Where Used in TuRi 30 Shop:</strong> {item.whereUsed}
                    </p>
                    <p>
                      <strong className="text-white">4. How It Works:</strong> {item.howItWorks}
                    </p>
                  </div>

                  {/* Interactive Mini-Preview inside Guide Card */}
                  <div className="p-3 rounded-lg bg-stone-900 border border-stone-800/90 text-xs">
                    <span className="text-[11px] font-semibold text-stone-400 block mb-1.5">
                      5. Interactive Mini-Preview:
                    </span>
                    {item.id === 'menu-dropdown' ? (
                      <div className="flex items-center gap-2">
                        <span className="text-stone-300">Sort Preview:</span>
                        <select
                          aria-label="Mini preview sort dropdown"
                          value={miniDropdownVal}
                          onChange={(e) => setMiniDropdownVal(e.target.value)}
                          className="h-8 px-2 rounded bg-stone-800 border border-stone-700 text-white text-xs"
                        >
                          <option>Price: Low to High</option>
                          <option>Highest Rated</option>
                          <option>Newest Arrivals</option>
                        </select>
                      </div>
                    ) : item.id === 'menu-tab' ? (
                      <div>
                        <div className="flex gap-1 mb-1.5">
                          <button
                            type="button"
                            onClick={() => setMiniTabVal('desc')}
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                              miniTabVal === 'desc' ? 'bg-amber-600 text-white' : 'bg-stone-800 text-stone-400'
                            }`}
                          >
                            Description Tab
                          </button>
                          <button
                            type="button"
                            onClick={() => setMiniTabVal('specs')}
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                              miniTabVal === 'specs' ? 'bg-amber-600 text-white' : 'bg-stone-800 text-stone-400'
                            }`}
                          >
                            Specs Tab
                          </button>
                        </div>
                        <p className="text-[11px] text-stone-300">
                          {miniTabVal === 'desc'
                            ? 'Showing Description pane without reloading the page.'
                            : 'Showing Technical Specifications pane in place.'}
                        </p>
                      </div>
                    ) : (
                      <p className="text-[11px] text-stone-300">
                        Click <strong>"{item.demoActionLabel}"</strong> below to interact with this element directly in the live shopping workflow.
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onTriggerDemoAction(item.demoActionId)}
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Try Demo: {item.demoActionLabel}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
