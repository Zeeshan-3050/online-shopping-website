import heroDarkGoldHeadphonesImg from '../assets/images/hero_dark_gold_headphones_1793299750909.jpg';
import bentoEarbudsImg from '../assets/images/product_dark_gold_earbuds_1793299751816.jpg';
import bentoSpeakerImg from '../assets/images/product_dark_gold_speaker_1793299752526.jpg';
import studioHeadphonesImg from '../assets/images/product_electronics_anc_headphones_1793297505034.jpg';
import ultrabookImg from '../assets/images/product_electronics_ultrabook_1793297506608.jpg';
import smartphoneImg from '../assets/images/product_smartphone_flagship_1793298961319.jpg';
import overshirtImg from '../assets/images/product_clothing_overshirt_1793297507876.jpg';
import blazerImg from '../assets/images/product_clothing_blazer_1793302952729.jpg';
import aerostrideImg from '../assets/images/product_shoes_aerostride_1793298963102.jpg';
import chelseaBootsImg from '../assets/images/product_shoes_chelsea_boots_1793298965127.jpg';
import suedeLoafersImg from '../assets/images/product_shoes_suede_loafers_1793302953010.jpg';
import hardcoverBooksImg from '../assets/images/product_book_hci_hardcover_1793303080000.jpg';
import espressoMakerImg from '../assets/images/product_home_espresso_maker_1793297508653.jpg';
import loungeChairImg from '../assets/images/product_home_lounge_chair_1793303077106.jpg';
import brassLampImg from '../assets/images/product_home_brass_lamp_1793302950163.jpg';
import chronosWatchImg from '../assets/images/product_watch_chronos_1793298963281.jpg';
import leatherBriefcaseImg from '../assets/images/product_bag_leather_briefcase_1793298965742.jpg';
import sunglassesImg from '../assets/images/product_acc_sunglasses_1793302947950.jpg';

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number; // in PKR
  oldPrice?: number; // in PKR
  rating: number;
  reviewCount: number;
  category: 'Electronics' | 'Clothing' | 'Shoes' | 'Books' | 'Home & Kitchen' | 'Accessories';
  subcategory: string;
  description: string;
  stock: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isDiscounted?: boolean;
  imageUrl: string;
  accentColor: string;
  svgType: string;
  specs: Record<string, string>;
  deliveryInfo: string;
  reviews: ProductReview[];
}

export interface CategoryNode {
  name: Product['category'];
  description: string;
  subcategories: string[];
  featuredOffer: string;
}

export const HERO_BANNER_IMAGE = heroDarkGoldHeadphonesImg;
export const BENTO_EARBUDS_IMAGE = bentoEarbudsImg;
export const BENTO_SPEAKER_IMAGE = bentoSpeakerImg;
export const STUDIO_HEADPHONES_IMAGE = studioHeadphonesImg;


export const CATEGORY_TREE: CategoryNode[] = [
  {
    name: 'Electronics',
    description: 'Precision audio hardware, flagship laptops, and smart mobile devices.',
    subcategories: ['Headphones', 'Laptops', 'Mobile Phones'],
    featuredOffer: 'Up to 18% off Studio Audio & Ultrabooks'
  },
  {
    name: 'Clothing',
    description: 'Architectural organic cotton apparel, tailored menswear, and contemporary womenswear.',
    subcategories: ["Men's Clothing", "Women's Clothing", 'Shirts & Trousers'],
    featuredOffer: 'Autumn/Winter Heavyweight Cotton Collection'
  },
  {
    name: 'Shoes',
    description: 'Ergonomic running trainers, handcrafted leather chelsea boots, and everyday loafers.',
    subcategories: ['Athletic Footwear', 'Formal & Casual Shoes'],
    featuredOffer: 'Free Shoe Care Kit on orders above PKR 18,000'
  },
  {
    name: 'Books',
    description: 'Essential volumes on Human-Computer Interaction, interface architecture, and software craft.',
    subcategories: ['Design & HCI Books', 'Software Engineering'],
    featuredOffer: 'University Student Academic Bundle Available'
  },
  {
    name: 'Home & Kitchen',
    description: 'Barista-grade espresso equipment, minimalist oak furniture, and tactile tableware.',
    subcategories: ['Kitchen Appliances', 'Furniture'],
    featuredOffer: 'Complimentary White-Glove Delivery in Major Cities'
  },
  {
    name: 'Accessories',
    description: 'Mechanical sapphire timepieces, full-grain vegetable-tanned leather goods, and eyewear.',
    subcategories: ['Watches & Timepieces', 'Leather Goods & Bags'],
    featuredOffer: '2-Year International Warranty on All Timepieces'
  }
];

function createStudioSvgDataUri(title: string, subtitle: string, bgHex: string, accentHex: string, iconType: string): string {
  const shapes: Record<string, string> = {
    earbuds: `
      <rect x="135" y="78" width="130" height="104" rx="32" fill="#18181b" stroke="#3f3f46" stroke-width="2.5"/>
      <rect x="142" y="84" width="116" height="44" rx="22" fill="#27272a"/>
      <line x1="136" y1="128" x2="264" y2="128" stroke="#52525b" stroke-width="2"/>
      <circle cx="200" cy="154" r="4.5" fill="#10b981"/>
      <path d="M168 78 C168 52, 194 52, 194 78" fill="none" stroke="${accentHex}" stroke-width="8" stroke-linecap="round"/>
      <path d="M206 78 C206 52, 232 52, 232 78" fill="none" stroke="${accentHex}" stroke-width="8" stroke-linecap="round"/>
    `,
    kurta: `
      <path d="M144 58 L176 46 L200 64 L224 46 L256 58 L276 112 L248 124 L236 90 L236 202 L164 202 L164 90 L152 124 L124 112 Z" fill="${accentHex}" stroke="#1c1917" stroke-width="2"/>
      <line x1="200" y1="64" x2="200" y2="132" stroke="#fafaf9" stroke-width="2.5"/>
      <rect x="184" y="64" width="32" height="58" rx="4" fill="none" stroke="#fafaf9" stroke-width="1.2" opacity="0.65"/>
    `,
    blazer: `
      <path d="M144 56 L178 46 L200 108 L222 46 L256 56 L270 196 L238 196 L232 102 L218 204 L182 204 L168 102 L162 196 L130 196 Z" fill="${accentHex}" stroke="#1c1917" stroke-width="2"/>
      <circle cx="192" cy="142" r="3.5" fill="#fafaf9"/>
      <circle cx="208" cy="142" r="3.5" fill="#fafaf9"/>
      <circle cx="192" cy="164" r="3.5" fill="#fafaf9"/>
      <circle cx="208" cy="164" r="3.5" fill="#fafaf9"/>
    `,
    loafer: `
      <path d="M108 152 C122 118 176 118 218 134 L286 152 C294 160 294 180 280 184 L108 184 Z" fill="${accentHex}" stroke="#1c1917" stroke-width="2"/>
      <rect x="106" y="178" width="182" height="12" rx="5" fill="#d6d3d1"/>
      <path d="M162 132 L228 142" stroke="#fafaf9" stroke-width="3.5" stroke-linecap="round"/>
    `,
    book: `
      <rect x="144" y="44" width="118" height="162" rx="6" fill="#e7e5e4" transform="translate(6, 6)"/>
      <rect x="140" y="44" width="118" height="162" rx="6" fill="${accentHex}" stroke="#18181b" stroke-width="2"/>
      <rect x="140" y="44" width="16" height="162" rx="3" fill="#09090b" opacity="0.28"/>
      <rect x="170" y="68" width="72" height="7" rx="2" fill="#fafaf9"/>
      <rect x="170" y="82" width="52" height="5" rx="2" fill="#fafaf9" opacity="0.75"/>
      <circle cx="205" cy="142" r="26" fill="none" stroke="#fafaf9" stroke-width="2" opacity="0.9"/>
      <circle cx="205" cy="142" r="10" fill="#fafaf9" opacity="0.85"/>
    `,
    chair: `
      <path d="M146 66 L254 66 L244 142 L156 142 Z" fill="#f5f5f4" stroke="#44403c" stroke-width="2.5"/>
      <rect x="136" y="136" width="128" height="18" rx="8" fill="${accentHex}"/>
      <line x1="156" y1="154" x2="142" y2="206" stroke="#78350f" stroke-width="7" stroke-linecap="round"/>
      <line x1="244" y1="154" x2="258" y2="206" stroke="#78350f" stroke-width="7" stroke-linecap="round"/>
    `,
    lamp: `
      <path d="M138 112 C138 56 262 56 262 112 Z" fill="${accentHex}" stroke="#1c1917" stroke-width="2"/>
      <ellipse cx="200" cy="112" rx="62" ry="8" fill="#fef3c7" opacity="0.7"/>
      <line x1="200" y1="112" x2="200" y2="194" stroke="#78350f" stroke-width="7"/>
      <rect x="162" y="192" width="76" height="14" rx="7" fill="#27272a"/>
    `,
    sunglasses: `
      <rect x="114" y="106" width="76" height="52" rx="14" fill="#18181b" stroke="${accentHex}" stroke-width="5"/>
      <rect x="210" y="106" width="76" height="52" rx="14" fill="#18181b" stroke="${accentHex}" stroke-width="5"/>
      <path d="M190 122 Q200 112 210 122" fill="none" stroke="${accentHex}" stroke-width="5"/>
      <line x1="126" y1="116" x2="148" y2="146" stroke="#ffffff" stroke-width="2.5" opacity="0.35" stroke-linecap="round"/>
      <line x1="222" y1="116" x2="244" y2="146" stroke="#ffffff" stroke-width="2.5" opacity="0.35" stroke-linecap="round"/>
    `
  };

  const shapeMarkup = shapes[iconType] || shapes.book;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="800" height="600">
    <defs>
      <radialGradient id="studioBg" cx="50%" cy="42%" r="68%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="70%" stop-color="${bgHex}"/>
        <stop offset="100%" stop-color="#e7e5e4"/>
      </radialGradient>
    </defs>
    <rect width="400" height="300" fill="url(#studioBg)"/>
    <!-- Architectural Travertine Plinth Base -->
    <path d="M65 215 L335 215 L355 245 L45 245 Z" fill="#d6d3d1" opacity="0.55"/>
    <rect x="45" y="245" width="310" height="55" fill="#e7e5e4" opacity="0.75"/>
    <ellipse cx="200" cy="216" rx="96" ry="11" fill="#000000" opacity="0.12"/>
    ${shapeMarkup}
    <text x="200" y="268" text-anchor="middle" font-family="sans-serif" font-size="12.5" font-weight="700" fill="#1c1917" letter-spacing="0.4">${title}</text>
    <text x="200" y="285" text-anchor="middle" font-family="monospace" font-size="9.5" fill="#57534e" letter-spacing="0.6">${subtitle.toUpperCase()}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const INITIAL_PRODUCTS: Product[] = [
  // 1. ELECTRONICS (4 items)
  {
    id: 'prod-elec-01',
    name: 'Aethel F1 Studio ANC Wireless Headphones',
    price: 42500,
    oldPrice: 49900,
    rating: 4.9,
    reviewCount: 128,
    category: 'Electronics',
    subcategory: 'Headphones',
    description: 'Precision CNC-machined titanium earcups with hybrid 48dB active noise cancellation, 40mm beryllium drivers, and 45-hour battery endurance.',
    stock: 14,
    isFeatured: true,
    isBestSeller: true,
    isDiscounted: true,
    imageUrl: studioHeadphonesImg,
    accentColor: '#71717a',
    svgType: 'earbuds',
    specs: {
      'Driver Unit': '40mm Custom Beryllium Dynamic',
      'Noise Cancellation': 'Hybrid 8-Mic Adaptive ANC (-48dB)',
      'Battery Life': '45 Hours (ANC On) / 60 Hours (ANC Off)',
      'Connectivity': 'Bluetooth 5.4 Multipoint, USB-C Lossless Audio',
      'Weight': '268g Brushed Titanium & Lambskin'
    },
    deliveryInfo: 'Dispatched within 24 hours from Lahore & Karachi hubs. Free insured courier delivery across Pakistan.',
    reviews: [
      {
        id: 'rev-101',
        author: 'Hamza Tariq',
        rating: 5,
        date: '2026-10-12',
        title: 'Unmatched build quality and acoustic clarity',
        comment: 'Used these during university lab sessions in Islamabad. The titanium frame feels indestructible and the ANC blocks out ambient noise completely.',
        verified: true
      },
      {
        id: 'rev-102',
        author: 'Ayesha Siddiqui',
        rating: 5,
        date: '2026-10-19',
        title: 'Best studio headphones in this PKR bracket',
        comment: 'Zero clamping fatigue even after 5 hours of UI design work.',
        verified: true
      }
    ]
  },
  {
    id: 'prod-elec-02',
    name: 'ZenithBook Pro 14 OLED Ultrabook (16GB / 1TB)',
    price: 265000,
    oldPrice: 289000,
    rating: 4.8,
    reviewCount: 84,
    category: 'Electronics',
    subcategory: 'Laptops',
    description: 'Anodized space-gray aluminum unibody workstation featuring a 2.8K 120Hz OLED display, all-day 18-hour battery, and whisper-quiet vapor chamber cooling.',
    stock: 5,
    isFeatured: true,
    isDiscounted: true,
    imageUrl: ultrabookImg,
    accentColor: '#52525b',
    svgType: 'phone',
    specs: {
      'Display': '14.2-inch 2880x1800 120Hz HDR OLED (100% DCI-P3)',
      'Memory & Storage': '16GB LPDDR5X RAM / 1TB PCIe 4.0 NVMe SSD',
      'Chassis': 'Recycled CNC Unibody Aluminum (1.28 kg)',
      'Ports': '2x Thunderbolt 4, HDMI 2.1, SD Express Card Reader',
      'Warranty': '2 Years Local TuRi 30 Shop Priority Warranty'
    },
    deliveryInfo: 'Delivered via insured express courier with signature verification. Includes protective sleeve.',
    reviews: [
      {
        id: 'rev-103',
        author: 'Bilal Mahmood',
        rating: 5,
        date: '2026-09-28',
        title: 'Screen calibration is factory-perfect',
        comment: 'Ideal machine for software engineering and HCI prototyping.',
        verified: true
      }
    ]
  },
  {
    id: 'prod-elec-03',
    name: 'NovaPhone X12 5G (256GB, Obsidian Titanium)',
    price: 148000,
    oldPrice: 162000,
    rating: 4.9,
    reviewCount: 96,
    category: 'Electronics',
    subcategory: 'Mobile Phones',
    description: 'PTA-approved flagship smartphone with periscope 5x optical telephoto lens, 120Hz LTPO AMOLED screen, and 65W rapid charging.',
    stock: 2, // Low stock to demonstrate Warning Dialog Box!
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    isDiscounted: true,
    imageUrl: smartphoneImg,
    accentColor: '#0284c7',
    svgType: 'phone',
    specs: {
      'PTA Status': 'Official PTA Approved (Dual Physical SIM + eSIM)',
      'Camera System': '50MP Main OIS + 50MP Ultrawide + 64MP 5x Periscope',
      'Battery': '5200mAh Silicon-Carbon with 65W GaN Charger Included',
      'Protection': 'IP68 Dust/Water Resistance & Gorilla Glass Victus 2'
    },
    deliveryInfo: 'Same-day dispatch in Lahore, Islamabad, and Karachi. Official 1-year brand warranty.',
    reviews: [
      {
        id: 'rev-104',
        author: 'Zainab Raza',
        rating: 5,
        date: '2026-10-04',
        title: 'Official PTA approved right out of the box',
        comment: 'Camera portrait mode and battery life are outstanding.',
        verified: true
      }
    ]
  },
  {
    id: 'prod-elec-04',
    name: 'PulsePods Pro Lossless True Wireless Earbuds',
    price: 18500,
    oldPrice: 22000,
    rating: 4.6,
    reviewCount: 210,
    category: 'Electronics',
    subcategory: 'Headphones',
    description: 'Compact pocketable ANC earbuds with spatial head-tracking, wireless Qi charging case, and IPX5 sweat resistance.',
    stock: 22,
    isBestSeller: true,
    isDiscounted: true,
    imageUrl: bentoEarbudsImg,
    accentColor: '#cba365',
    svgType: 'earbuds',
    specs: {
      'Bluetooth Codec': 'LDAC, AAC, SBC Low-Latency Mode',
      'Total Playtime': '8 Hours Buds + 28 Hours Charging Case',
      'Waterproof Rating': 'IPX5 Sweat & Rain Resistant'
    },
    deliveryInfo: 'Standard 2-3 business days delivery across all cities in Pakistan.',
    reviews: []
  },

  // 2. CLOTHING (4 items)
  {
    id: 'prod-cloth-01',
    name: 'Utility Cotton Twill Overshirt & Merino Knit Set',
    price: 11800,
    oldPrice: 14500,
    rating: 4.9,
    reviewCount: 74,
    category: 'Clothing',
    subcategory: "Men's Clothing",
    description: 'Tailored from 340gsm combed Pakistani organic cotton twill in olive slate, paired with a breathable fine-gauge oatmeal merino crew neck.',
    stock: 16,
    isFeatured: true,
    isBestSeller: true,
    isDiscounted: true,
    imageUrl: overshirtImg,
    accentColor: '#4d5d43',
    svgType: 'kurta',
    specs: {
      'Fabric Weight': '340 GSM 100% Organic Cotton Twill',
      'Buttons': 'Corozo Nut Natural Horn Buttons',
      'Fit Profile': 'Relaxed Architectural Boxy Fit',
      'Care': 'Cold gentle machine wash, line dry in shade'
    },
    deliveryInfo: 'Easy 14-day size exchange policy with doorstep pickup.',
    reviews: [
      {
        id: 'rev-105',
        author: 'Saad Khan',
        rating: 5,
        date: '2026-10-15',
        title: 'Export-grade stitching and heavy fabric',
        comment: 'Feels like a European boutique garment at a fraction of the price.',
        verified: true
      }
    ]
  },
  {
    id: 'prod-cloth-02',
    name: 'Artisanal Handloom Karandi Embroidered Kurta',
    price: 7900,
    rating: 4.8,
    reviewCount: 62,
    category: 'Clothing',
    subcategory: "Women's Clothing",
    description: 'Textured winter karandi two-piece ensemble featuring tonal geometric thread embroidery on the neckline and cuffs.',
    stock: 9,
    isNewArrival: true,
    imageUrl: overshirtImg,
    accentColor: '#9a3412',
    svgType: 'kurta',
    specs: {
      'Fabric': 'Pure Yarn-Dyed Winter Karandi',
      'Pieces Included': 'Stitched Embroidered Shirt + Straight Trousers',
      'Available Sizes': 'XS, S, M, L, XL'
    },
    deliveryInfo: 'Delivered in eco-friendly reusable muslin garment bag.',
    reviews: []
  },
  {
    id: 'prod-cloth-03',
    name: 'Structured Linen-Blend Double-Breasted Blazer',
    price: 16400,
    oldPrice: 19500,
    rating: 4.7,
    reviewCount: 41,
    category: 'Clothing',
    subcategory: "Women's Clothing",
    description: 'Unlined breathable flax-linen and viscose tailored blazer with peak lapels and horn buttons for year-round formal styling.',
    stock: 3, // Low stock
    isDiscounted: true,
    imageUrl: blazerImg,
    accentColor: '#44403c',
    svgType: 'blazer',
    specs: {
      'Composition': '55% European Flax Linen, 45% Eco-Viscose',
      'Lining': 'Half-Bemberg Breathable Shoulder Lining',
      'Origin': 'Crafted in Lahore Atelier'
    },
    deliveryInfo: 'Ships on a contoured wooden hanger inside a protective box.',
    reviews: []
  },
  {
    id: 'prod-cloth-04',
    name: 'Selvedge Chino Pleated Everyday Trousers',
    price: 6400,
    rating: 4.6,
    reviewCount: 89,
    category: 'Clothing',
    subcategory: 'Shirts & Trousers',
    description: 'High-twist 290gsm peached cotton chinos with single front pleats, bar-tacked stress points, and YKK brass zip fly.',
    stock: 25,
    isBestSeller: true,
    imageUrl: blazerImg,
    accentColor: '#78350f',
    svgType: 'kurta',
    specs: {
      'Waist Sizes': '30, 32, 34, 36, 38 (Inseam 31")',
      'Hardware': 'Solid Brass YKK Locking Zipper',
      'Stretch': '2% Elastane for All-Day Mobility'
    },
    deliveryInfo: 'Free alterations or size swap within 14 days.',
    reviews: []
  },

  // 3. SHOES (3 items)
  {
    id: 'prod-shoe-01',
    name: 'AeroStride Carbon-Plate Running Trainers',
    price: 19800,
    oldPrice: 23500,
    rating: 4.9,
    reviewCount: 115,
    category: 'Shoes',
    subcategory: 'Athletic Footwear',
    description: 'Dual-density supercritical nitrogen foam midsole paired with an engineered monofilament mesh upper for responsive road running.',
    stock: 11,
    isFeatured: true,
    isBestSeller: true,
    isDiscounted: true,
    imageUrl: aerostrideImg,
    accentColor: '#ea580c',
    svgType: 'loafer',
    specs: {
      'Heel-to-Toe Drop': '8mm (38mm Heel / 30mm Forefoot)',
      'Outsole': 'High-Abrasion Continental Wet-Grip Rubber',
      'EU Sizes': '40, 41, 42, 43, 44, 45'
    },
    deliveryInfo: 'Includes extra pair of reflective flat laces.',
    reviews: []
  },
  {
    id: 'prod-shoe-02',
    name: 'Goodyear-Welted Full-Grain Leather Chelsea Boots',
    price: 24500,
    oldPrice: 28000,
    rating: 4.9,
    reviewCount: 53,
    category: 'Shoes',
    subcategory: 'Formal & Casual Shoes',
    description: 'Hand-lasted in Sialkot using vegetable-tanned calfskin leather, cork footbed molding, and resoleable Vibram studded soles.',
    stock: 7,
    isFeatured: true,
    isNewArrival: true,
    isDiscounted: true,
    imageUrl: chelseaBootsImg,
    accentColor: '#7c2d12',
    svgType: 'loafer',
    specs: {
      'Construction': '360° Goodyear Storm Welt (Resoleable)',
      'Leather': '1.8mm Full-Grain Aniline Calfskin',
      'Insole': 'Vegetable-Tanned Leather + Cork Cavity Fill'
    },
    deliveryInfo: 'Includes cedar shoe trees and flannel travel dust bags.',
    reviews: []
  },
  {
    id: 'prod-shoe-03',
    name: 'Suede Penny Loafers with Cushioned Crepe Sole',
    price: 13200,
    oldPrice: 15000,
    rating: 4.7,
    reviewCount: 67,
    category: 'Shoes',
    subcategory: 'Formal & Casual Shoes',
    description: 'Water-repellent Italian split suede slip-on loafers engineered for zero break-in comfort during long campus or office days.',
    stock: 18,
    isDiscounted: true,
    imageUrl: suedeLoafersImg,
    accentColor: '#854d0e',
    svgType: 'loafer',
    specs: {
      'Upper': 'Hydro-Repellent Calf Suede',
      'Lining': 'Breathable Glove-Soft Kidskin',
      'Sole': 'Natural Plantation Crepe Rubber'
    },
    deliveryInfo: 'Standard 48-hour nationwide delivery.',
    reviews: []
  },

  // 4. BOOKS (3 items)
  {
    id: 'prod-book-01',
    name: 'Designing Human-Computer Interfaces (5th Edition Hardcover)',
    price: 4800,
    oldPrice: 5600,
    rating: 5.0,
    reviewCount: 194,
    category: 'Books',
    subcategory: 'Design & HCI Books',
    description: 'Comprehensive university textbook covering direct manipulation, menu taxonomies, dialog architecture, cognitive load, and usability heuristics.',
    stock: 30,
    isFeatured: true,
    isBestSeller: true,
    isDiscounted: true,
    imageUrl: hardcoverBooksImg,
    accentColor: '#1e3a8a',
    svgType: 'book',
    specs: {
      'Binding': 'Smyth-Sewn Linen Hardcover with Ribbon Marker',
      'Paper': '100 GSM Acid-Free Matte Art Paper (Full Color)',
      'ISBN': '978-969-8421-19-4',
      'Topics': 'Menus, Forms, Icons, Dialogs, Tree/Wizard Navigation'
    },
    deliveryInfo: 'Packed in reinforced corner-protector book mailers.',
    reviews: [
      {
        id: 'rev-106',
        author: 'Dr. Kamran Qureshi',
        rating: 5,
        date: '2026-10-01',
        title: 'Essential reference for our BSCS HCI course',
        comment: 'Clear diagrams on pull-down, cascading, pie, and ribbon menus. Every student should own a copy.',
        verified: true
      }
    ]
  },
  {
    id: 'prod-book-02',
    name: 'Cognitive Ergonomics & Everyday Interactive Systems',
    price: 3400,
    rating: 4.8,
    reviewCount: 78,
    category: 'Books',
    subcategory: 'Design & HCI Books',
    description: 'A practical deep-dive into mental models, affordances, Fitts’s Law target sizing (44x44px), and error-tolerant form design.',
    stock: 19,
    isNewArrival: true,
    imageUrl: hardcoverBooksImg,
    accentColor: '#b45309',
    svgType: 'book',
    specs: {
      'Format': 'Trade Paperback with French Flaps (384 Pages)',
      'Edition': '2026 Revised Academic Print',
      'Language': 'English'
    },
    deliveryInfo: 'Eligible for student flat-rate shipping across Pakistan.',
    reviews: []
  },
  {
    id: 'prod-book-03',
    name: 'Modern Full-Stack Systems & Clean Frontend Engineering',
    price: 4200,
    rating: 4.9,
    reviewCount: 112,
    category: 'Books',
    subcategory: 'Software Engineering',
    description: 'Master state management, semantic HTML5, accessible ARIA patterns, responsive CSS grid systems, and deterministic UI architecture.',
    stock: 14,
    imageUrl: hardcoverBooksImg,
    accentColor: '#065f46',
    svgType: 'book',
    specs: {
      'Pages': '512 Pages with Annotated Code Diagrams',
      'Level': 'Intermediate to Senior Undergraduate / Practitioner',
      'Supplement': 'Includes Companion Lab Exercises'
    },
    deliveryInfo: 'Ships within 24 hours.',
    reviews: []
  },

  // 5. HOME & KITCHEN (3 items)
  {
    id: 'prod-home-01',
    name: 'BaristaPro 9-Bar Dual Boiler Espresso Machine & Kettle Set',
    price: 89000,
    oldPrice: 102000,
    rating: 4.9,
    reviewCount: 64,
    category: 'Home & Kitchen',
    subcategory: 'Kitchen Appliances',
    description: 'Brushed 304 stainless steel espresso station with PID temperature control, pressure gauge, 58mm commercial portafilter, and gooseneck kettle.',
    stock: 6,
    isFeatured: true,
    isBestSeller: true,
    isDiscounted: true,
    imageUrl: espressoMakerImg,
    accentColor: '#57534e',
    svgType: 'lamp',
    specs: {
      'Pump Pressure': '9-Bar Italian Rotary Vane Pump + OPV Valve',
      'Temperature Control': 'Digital PID Controller (±0.5°C Stability)',
      'Portafilter': '58mm Solid Stainless Steel + Precision Basket',
      'Power': '220-240V 50Hz (PK Standard Plug)'
    },
    deliveryInfo: 'Double-boxed palletized courier delivery with 1-year home service warranty.',
    reviews: [
      {
        id: 'rev-107',
        author: 'Omer Farooq',
        rating: 5,
        date: '2026-10-18',
        title: 'Cafe-quality microfoam and shot consistency',
        comment: 'The PID readout and pressure gauge make dialing in Ethiopian beans effortless.',
        verified: true
      }
    ]
  },
  {
    id: 'prod-home-02',
    name: 'Nordic Solid Ashwood & Bouclé Lounge Chair',
    price: 54000,
    rating: 4.8,
    reviewCount: 39,
    category: 'Home & Kitchen',
    subcategory: 'Furniture',
    description: 'Kiln-dried solid ashwood frame with mortise-and-tenon joinery and high-resilience ivory bouclé upholstery.',
    stock: 2, // Low stock to trigger Warning Dialog!
    isNewArrival: true,
    imageUrl: loungeChairImg,
    accentColor: '#78350f',
    svgType: 'chair',
    specs: {
      'Dimensions': '74cm W × 78cm D × 76cm H (Seat Height 42cm)',
      'Timber': 'FSC-Certified Solid Kiln-Dried Ashwood',
      'Upholstery': '620 GSM Stain-Resistant Textured Bouclé'
    },
    deliveryInfo: 'Delivered fully assembled by our 2-person white-glove team.',
    reviews: []
  },
  {
    id: 'prod-home-03',
    name: 'Bauhaus Brushed Brass Rechargeable Desk Lamp',
    price: 14500,
    oldPrice: 17200,
    rating: 4.7,
    reviewCount: 81,
    category: 'Home & Kitchen',
    subcategory: 'Furniture',
    description: 'Cordless spun-brass architectural dome lamp with stepless warm-to-daylight touch dimming (2700K–4500K) and 30-hour battery.',
    stock: 15,
    isDiscounted: true,
    imageUrl: brassLampImg,
    accentColor: '#d97706',
    svgType: 'lamp',
    specs: {
      'CRI Rating': 'Ra > 95 Museum-Grade LED Array',
      'Color Temperature': '2700K Warm Candle to 4500K Neutral Study',
      'Battery': '6000mAh USB-C Rechargeable'
    },
    deliveryInfo: 'Ships in custom-molded recyclable pulp packaging.',
    reviews: []
  },

  // 6. ACCESSORIES (3 items)
  {
    id: 'prod-acc-01',
    name: 'Chronos Automatic Sapphire Dress Watch (40mm)',
    price: 38500,
    oldPrice: 44000,
    rating: 4.9,
    reviewCount: 103,
    category: 'Accessories',
    subcategory: 'Watches & Timepieces',
    description: '24-jewel automatic mechanical movement housed in a 316L surgical steel case with domed anti-reflective sapphire crystal and Italian calf strap.',
    stock: 8,
    isFeatured: true,
    isBestSeller: true,
    isDiscounted: true,
    imageUrl: chronosWatchImg,
    accentColor: '#b45309',
    svgType: 'sunglasses',
    specs: {
      'Movement': 'Caliber NH35 Automatic Self-Winding (41h Reserve)',
      'Crystal': 'Domed Scratch-Proof Sapphire with AR Coating',
      'Water Resistance': '10 ATM / 100 Meters',
      'Case Diameter': '40mm Diameter × 10.8mm Thickness'
    },
    deliveryInfo: 'Presented in a lacquered walnut collector box with warranty card.',
    reviews: []
  },
  {
    id: 'prod-acc-02',
    name: 'Saddlery Full-Grain Leather 15" Laptop Briefcase',
    price: 21500,
    oldPrice: 24900,
    rating: 4.9,
    reviewCount: 59,
    category: 'Accessories',
    subcategory: 'Leather Goods & Bags',
    description: 'Hand-stitched waxed pull-up cowhide messenger briefcase with padded laptop compartment, solid brass buckles, and trolley pass-through strap.',
    stock: 12,
    isFeatured: true,
    isNewArrival: true,
    isDiscounted: true,
    imageUrl: leatherBriefcaseImg,
    accentColor: '#92400e',
    svgType: 'sunglasses',
    specs: {
      'Leather': '2.0mm Vegetable-Tanned Pull-Up Hide',
      'Laptop Bay': 'Microfiber-Padded Sleeve for up to 15.6" Laptops',
      'Strap': 'Detachable Bridle Leather Shoulder Strap'
    },
    deliveryInfo: 'Includes complimentary tin of natural beeswax leather conditioner.',
    reviews: []
  },
  {
    id: 'prod-acc-03',
    name: 'Acetate Polarized UV400 Architectural Sunglasses',
    price: 8900,
    oldPrice: 11000,
    rating: 4.6,
    reviewCount: 47,
    category: 'Accessories',
    subcategory: 'Watches & Timepieces',
    description: 'Hand-polished Mazzucchelli cellulose acetate frames with Carl Zeiss CR-39 polarized lenses and 5-barrel German hinges.',
    stock: 20,
    isDiscounted: true,
    imageUrl: sunglassesImg,
    accentColor: '#3f3f46',
    svgType: 'sunglasses',
    specs: {
      'Lens Protection': '100% UVA/UVB Polarized Cat. 3 Anti-Glare',
      'Frame Material': '8mm Cured Plant-Based Cellulose Acetate',
      'Dimensions': '51mm Lens · 20mm Bridge · 145mm Temple'
    },
    deliveryInfo: 'Includes foldable hard leather case and microfiber cloth.',
    reviews: []
  }
];

export interface HCIGuideEntry {
  id: string;
  category: 'Menus' | 'Forms' | 'Icons' | 'Dialogs' | 'Navigation' | 'Usability Principles';
  name: string;
  definition: string;
  purpose: string;
  whereUsed: string;
  howItWorks: string;
  demoActionId: string;
  demoActionLabel: string;
}

export const HCI_GUIDE_ENTRIES: HCIGuideEntry[] = [
  // A. MENUS (10 Types)
  {
    id: 'menu-pulldown',
    category: 'Menus',
    name: '1. Pull-Down Menu',
    definition: 'A horizontal application menu bar (File, Edit, View, Help) whose command lists pull down vertically when clicked.',
    purpose: 'Groups global application commands (Save, Print, Export, Undo, View Mode, Help) into predictable top-level categories.',
    whereUsed: 'Top utility command bar at the very top of TuRi 30 Shop.',
    howItWorks: 'Clicking File, Edit, View, or Help opens a vertical command list with keyboard shortcut cues and immediate execution.',
    demoActionId: 'demo-pulldown',
    demoActionLabel: 'Open "File" Pull-Down Menu'
  },
  {
    id: 'menu-dropdown',
    category: 'Menus',
    name: '2. Drop-Down Menu',
    definition: 'A compact selection control that reveals a list of mutually exclusive options (e.g., Sort order, Category, Country, Quantity) when activated.',
    purpose: 'Conserves screen space while preventing invalid free-text input for predefined choices.',
    whereUsed: 'Header category selector, Shop toolbar Sort selector, Product card quantity selector, and Checkout Country selector.',
    howItWorks: 'User clicks the control to reveal options; selecting an option updates the state and closes the list.',
    demoActionId: 'demo-dropdown',
    demoActionLabel: 'Focus Shop Sort Drop-Down'
  },
  {
    id: 'menu-popup',
    category: 'Menus',
    name: '3. Pop-Up / Context Menu',
    definition: 'A contextual menu that appears at the pointer location upon right-clicking (or tapping the context icon on touch devices) on a target object.',
    purpose: 'Provides immediate object-specific shortcuts without moving the cursor to a distant toolbar.',
    whereUsed: 'Right-click (or click the ⋮ button) on any Product Card in TuRi 30 Shop.',
    howItWorks: 'Captures the contextmenu event (or button tap), prevents the browser default menu, and renders actions (Quick View, Wishlist, Copy Name, Add to Cart) for that specific product.',
    demoActionId: 'demo-contextmenu',
    demoActionLabel: 'Trigger Context Menu on First Product'
  },
  {
    id: 'menu-cascading',
    category: 'Menus',
    name: '4. Cascading Menu',
    definition: 'A hierarchical menu where selecting or hovering over a parent item opens a secondary flyout submenu of child items.',
    purpose: 'Organizes multi-level taxonomies (Categories → Subcategories) cleanly without cluttering the primary menu.',
    whereUsed: 'Ribbon command bar "Cascading Category Menu" button.',
    howItWorks: 'Hovering or clicking a parent category (e.g., Electronics) reveals its nested submenu (Headphones, Laptops, Mobile Phones) to the side.',
    demoActionId: 'demo-cascading',
    demoActionLabel: 'Open Cascading Category Menu'
  },
  {
    id: 'menu-toolbar',
    category: 'Menus',
    name: '5. Toolbar Menu',
    definition: 'A horizontal strip of recognizable icon buttons providing single-click access to frequent actions.',
    purpose: 'Accelerates expert and everyday workflows (Search, Filter, Grid/List View, Compare, Wishlist, Cart) with visual affordances.',
    whereUsed: 'Shop Workspace Toolbar right above the product catalog.',
    howItWorks: 'Each button pairs a clear SVG icon with a tooltip and active-state highlight to toggle views or drawers immediately.',
    demoActionId: 'demo-toolbar',
    demoActionLabel: 'Highlight & Scroll to Shop Toolbar'
  },
  {
    id: 'menu-hamburger',
    category: 'Menus',
    name: '6. Hamburger Menu',
    definition: 'A three-line icon button that toggles a slide-out navigation drawer, primarily designed for mobile and compact viewports.',
    purpose: 'Preserves viewport space on narrow screens while keeping full site navigation reachable.',
    whereUsed: 'Top header bar (always testable on both desktop and mobile viewports).',
    howItWorks: 'Clicking the 3-line icon opens an accessible slide-over navigation drawer with links, category filters, and account controls.',
    demoActionId: 'demo-hamburger',
    demoActionLabel: 'Open Hamburger Navigation Drawer'
  },
  {
    id: 'menu-pie',
    category: 'Menus',
    name: '7. Pie Menu (Radial Menu)',
    definition: 'A circular contextual menu where action slices are arranged radially at equal distances around the cursor or target item.',
    purpose: 'Reduces target seek time (Fitts’s Law) because every action is equidistant from the center and relies on directional muscle memory.',
    whereUsed: 'Each Product Card includes a radial "Pie Menu" trigger button (also accessible from the right-click context menu).',
    howItWorks: 'Renders 4 circular action nodes (View, Wishlist, Share, Cart) at 0°, 90°, 180°, and 270° around the selected product.',
    demoActionId: 'demo-piemenu',
    demoActionLabel: 'Launch Radial Pie Menu on Product'
  },
  {
    id: 'menu-ribbon',
    category: 'Menus',
    name: '8. Ribbon Menu',
    definition: 'A tabbed command strip (Home, Products, Insert, Settings) that combines tabs with grouped icon/button toolbars.',
    purpose: 'Surfaces rich sets of related tools in labeled command groups without hiding them inside deep nested menus.',
    whereUsed: 'Interactive Shopping Workspace Ribbon right below the header.',
    howItWorks: 'Switching between Home, Products, Insert, and Settings tabs reveals task-specific command groups (Layout, Quick Filters, Insert Review/Coupon, Theme/Accessibility).',
    demoActionId: 'demo-ribbon',
    demoActionLabel: 'Activate & Switch Ribbon Menu Tabs'
  },
  {
    id: 'menu-mega',
    category: 'Menus',
    name: '9. Mega Menu',
    definition: 'A wide, multi-column expandable panel that displays all product categories, subcategories, and promotional spotlights simultaneously.',
    purpose: 'Eliminates scrolling and sequential hover-drilling in large e-commerce catalogs by showing the entire store hierarchy at once.',
    whereUsed: 'Navigation bar "Categories" trigger.',
    howItWorks: 'Expands a full-width 6-column grid showing all categories, clickable subcategories, and featured seasonal offers.',
    demoActionId: 'demo-megamenu',
    demoActionLabel: 'Open Full-Width Mega Menu'
  },
  {
    id: 'menu-tab',
    category: 'Menus',
    name: '10. Tab Menu',
    definition: 'A segmented horizontal bar of tabs (Description, Specifications, Reviews, Delivery Info) that switches content panes in place.',
    purpose: 'Partitions detailed product information into scannable sections without forcing page reloads.',
    whereUsed: 'Product Detail / Quick-View Modal and Homepage Product Collections.',
    howItWorks: 'Clicking a tab updates the aria-selected state and swaps the visible content panel immediately.',
    demoActionId: 'demo-tabmenu',
    demoActionLabel: 'Open Product Modal Tab Menu'
  },

  // B. FORMS
  {
    id: 'forms-all',
    category: 'Forms',
    name: 'Shopping Forms & Controls (Registration, Login, Checkout, Review, Newsletter)',
    definition: 'Structured data-entry interfaces combining labels, text/email/password inputs, radio buttons, checkboxes, drop-downs, submit/reset buttons, and validation.',
    purpose: 'Collects accurate customer, authentication, delivery, and feedback data while preventing input errors.',
    whereUsed: 'Account Modal (Login & Registration), Multi-Step Checkout Wizard, Product Detail Review Tab, and Footer Newsletter.',
    howItWorks: 'Validates required fields, email syntax, password length/matching, and phone formats in real time and on submit.',
    demoActionId: 'demo-forms',
    demoActionLabel: 'Open Registration & Login Form Modal'
  },

  // C. ICONS
  {
    id: 'icons-system',
    category: 'Icons',
    name: 'Consistent 16-Icon Visual System',
    definition: 'A unified family of pictograms (Home, Search, User, Cart, Wishlist, Settings, Save, Delete, Edit, Filter, Sort, Menu, Close, Notifications, Help, Share).',
    purpose: 'Provides rapid visual recognition across languages and reduces textual clutter when paired with accessible tooltips.',
    whereUsed: 'Throughout the Header, Ribbon, Toolbar, Product Cards, and Dialogs.',
    howItWorks: 'Every icon button includes an explicit aria-label, title tooltip, >= 44x44px target area where practical, and a live event handler.',
    demoActionId: 'demo-icons',
    demoActionLabel: 'Inspect Interactive 16-Icon Matrix'
  },

  // D. DIALOG BOXES (6 Types)
  {
    id: 'dialog-modal',
    category: 'Dialogs',
    name: '1. Modal Dialog Box',
    definition: 'An overlay window that requires the user to complete an action or close the dialog before returning to the background interface.',
    purpose: 'Focuses user attention on a self-contained task such as inspecting product details or signing into an account.',
    whereUsed: 'Product Quick-View / Detail Modal and Account Login/Registration Modal.',
    howItWorks: 'Dims the background backdrop, traps focus, supports Escape key dismissal, and restores focus on close.',
    demoActionId: 'demo-dialog-modal',
    demoActionLabel: 'Open Modal Dialog (Product Quick-View)'
  },
  {
    id: 'dialog-modeless',
    category: 'Dialogs',
    name: '2. Modeless Dialog Box',
    definition: 'A floating utility panel that remains open on screen while allowing the user to freely scroll, click, and shop in the background.',
    purpose: 'Supports side-by-side multi-tasking such as comparing multiple products or consulting live shopping help while browsing.',
    whereUsed: 'Floating Product Comparison & Shopping Assistant Panel (bottom-left floating window).',
    howItWorks: 'Renders without a blocking backdrop so users can click product cards to add items to compare while the dialog stays open.',
    demoActionId: 'demo-dialog-modeless',
    demoActionLabel: 'Open Modeless Comparison & Help Dialog'
  },
  {
    id: 'dialog-message',
    category: 'Dialogs',
    name: '3. Message Dialog Box',
    definition: 'An informational dialog box that notifies the user of a completed system action (e.g., "Product added to cart successfully") with an OK button.',
    purpose: 'Provides explicit feedback confirming that an operation succeeded.',
    whereUsed: 'Triggered when saving cart snapshots, completing orders, or clicking "Show Message Dialog".',
    howItWorks: 'Displays a clear title, status icon, descriptive message, and an accessible OK button.',
    demoActionId: 'demo-dialog-message',
    demoActionLabel: 'Trigger Message Dialog Box'
  },
  {
    id: 'dialog-confirm',
    category: 'Dialogs',
    name: '4. Confirmation Dialog Box',
    definition: 'A decision dialog asking the user to explicitly Confirm or Cancel before executing a destructive or irreversible action.',
    purpose: 'Prevents accidental data loss such as deleting cart items, clearing the wishlist, or resetting demo state.',
    whereUsed: 'Removing an item from the Shopping Cart, clearing the Wishlist, or resetting store preferences.',
    howItWorks: 'Pauses the destructive action until the user clicks "Confirm Removal" or aborts via "Cancel" / Escape.',
    demoActionId: 'demo-dialog-confirm',
    demoActionLabel: 'Trigger Confirmation Dialog Box'
  },
  {
    id: 'dialog-warning',
    category: 'Dialogs',
    name: '5. Warning Dialog Box',
    definition: 'An alert dialog cautioning the user about potential risks such as low inventory (only 2 units left) or unsaved form changes.',
    purpose: 'Alerts users to important constraints before an issue occurs.',
    whereUsed: 'Automatically shown when inspecting/adding low-stock products (e.g., NovaPhone X12 or Nordic Lounge Chair) or leaving unsaved forms.',
    howItWorks: 'Highlights the warning condition with an amber alert icon and lets the user acknowledge or adjust their action.',
    demoActionId: 'demo-dialog-warning',
    demoActionLabel: 'Trigger Low-Stock Warning Dialog'
  },
  {
    id: 'dialog-error',
    category: 'Dialogs',
    name: '6. Error Dialog Box',
    definition: 'A high-priority dialog explaining why a requested operation could not be completed and how to fix the problem.',
    purpose: 'Helps users recover from invalid form submissions, out-of-stock quantities, or zero-match queries.',
    whereUsed: 'Triggered when attempting to exceed available product stock, submitting incomplete checkout steps, or running an invalid search.',
    howItWorks: 'States the exact cause of the error in plain language and provides a direct recovery button.',
    demoActionId: 'demo-dialog-error',
    demoActionLabel: 'Trigger Stock/Validation Error Dialog'
  },

  // E. NAVIGATION ELEMENTS (3 Types)
  {
    id: 'nav-tree',
    category: 'Navigation',
    name: '1. Tree Navigation',
    definition: 'A collapsible hierarchical list in the sidebar showing parent categories and indented child subcategories.',
    purpose: 'Lets users explore the store structure and filter by either broad categories or specific subcategories.',
    whereUsed: 'Left sidebar of the Shop Catalog section.',
    howItWorks: 'Clicking a parent category chevron expands/collapses its subcategories; clicking any node filters the product grid.',
    demoActionId: 'demo-nav-tree',
    demoActionLabel: 'Scroll to & Expand Sidebar Tree Navigation'
  },
  {
    id: 'nav-pagination',
    category: 'Navigation',
    name: '2. Pagination Navigation',
    definition: 'A numbered page bar with Previous, Next, and page number buttons that divides large product lists into discrete pages.',
    purpose: 'Prevents scroll fatigue and gives users a clear sense of position within the catalog.',
    whereUsed: 'Bottom of the Shop Catalog product grid.',
    howItWorks: 'Slices the filtered product array by page size, highlights the active page, and disables Previous/Next at boundaries.',
    demoActionId: 'demo-nav-pagination',
    demoActionLabel: 'Jump to Catalog Pagination Controls'
  },
  {
    id: 'nav-wizard',
    category: 'Navigation',
    name: '3. Wizard Navigation',
    definition: 'A step-by-step guided workflow (Steps 1 to 5) with progress indicator, Back/Next buttons, and per-step validation.',
    purpose: 'Breaks a complex multi-part task (e-commerce checkout) into manageable, sequential stages.',
    whereUsed: '5-Step Simulated Checkout Wizard (Customer Info → Address → Delivery/Payment → Review → Confirmation).',
    howItWorks: 'Validates inputs on each step before advancing, preserves entered state across Back/Next transitions, and generates an order receipt.',
    demoActionId: 'demo-nav-wizard',
    demoActionLabel: 'Launch 5-Step Checkout Wizard'
  },

  // F. FORM SIZE & USABILITY PRINCIPLES
  {
    id: 'usability-principles',
    category: 'Usability Principles',
    name: 'Form Size & Usability Principles (Consistency, Visibility, Accessibility 44×44px, Readability, Alignment, Error Prevention)',
    definition: 'Core human-factors guidelines governing control sizing, label alignment, visual contrast, target ergonomics, and error prevention.',
    purpose: 'Minimizes human error, reduces cognitive load, and ensures accessibility across desktop and touch devices.',
    whereUsed: 'Dedicated Interactive Usability Lab section on the storefront and applied across all TuRi 30 Shop forms.',
    howItWorks: 'Provides an interactive side-by-side comparison of Poor HCI Form Design vs. Best-Practice HCI Form Design with live target-size overlays.',
    demoActionId: 'demo-usability',
    demoActionLabel: 'Explore Form Size & Usability Lab'
  }
];
