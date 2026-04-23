import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'EN' | 'BN';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  EN: {
    // Navbar / Menu
    lighting: 'Lighting',
    decor: 'Decor',
    kitchen: 'Kitchen',
    essentials: 'Essentials',
    newArrivals: 'New Arrivals',
    contact: 'Contact',
    shipping: 'Shipping',
    returns: 'Returns',
    shop: 'Shop',
    bestsellers: 'Bestsellers',
    gallery: 'Gallery',
    about: 'About',
    
    // Hero
    heroTitlePart1: 'Eco-Friendly',
    heroTitlePart2: 'Kitchenware',
    heroTitlePart3: 'for a greener home',
    heroDesc: 'Experience the fusion of natural aesthetics and modern functionality. Sustainable choices for a consciously curated lifestyle.',
    shopNow: 'Shop Now',
    naturalSustainable: 'Natural. Sustainable.',
    ecoConscious: 'Eco-conscious.',
    
    // Auth
    login: 'Login',
    profile: 'Profile',
    
    // Cart
    dropHere: 'Drop Here',
    addToBag: 'Add To Bag',
    buyNow: 'Buy Now',

    // Footer
    help: 'Help',
    accountKey: 'Account',
    followUs: 'Follow Us',
    subscribe: 'Subscribe',
    subscribeDesc: 'Be the first to know about special offers and new drops',
    signUp: 'Sign Up',
    dhakaOffice: 'Corporate Office',
    phone: 'Phone',
    email: 'Email',
    
    // Shop
    allProducts: 'All Products',
    filterBy: 'Filters',
    sortBy: 'Sort By',
    backToHome: 'Back to Home',
    searchProducts: 'Search products...',
    noItemsFound: 'No items found matching your search.',
    clearFilters: 'Clear all filters',
    all: 'All',
    collection: 'Collection',
    loadingTreasures: 'Loading Treasures...',
    
    // Checkout
    checkout: 'Checkout',
    shippingInfo: 'Shipping Information',
    orderSummary: 'Order Summary',
    placeOrder: 'Place Order',

    // Checkout Extra
    finalizeArtifact: 'Finalize Your Order',
    returnToStore: 'Return to Store',
    shippingDetailsHeader: 'Fast Shipping Details',
    recipientName: 'Recipient Name',
    contactPhone: 'Contact Phone',
    residenceAddress: 'Full Residence Address',
    cityZone: 'City / Zone',
    districtCode: 'District Code',
    selectCity: 'Select City',
    paymentArchitect: 'Secured Payment Architect',
    holdToPlaceOrder: 'Hold to Place Order',
    validating: 'Validating...',
    artifactRegistry: 'Order Summary',
    vatTax: 'Vat / Tax',
    included: 'Included',
    logistics: 'Logistics',
    complimentary: 'Complimentary',
    totalText: 'Total',
    cashOnDelivery: 'Cash on Delivery',

    // Success
    thankYouPurchase: 'Thank you for your Purchase',
    orderReceived: "Your order has been received and is being processed for shipping. We've sent a confirmation email to your inbox.",
    continueShopping: 'Continue Shopping',
    trackMyOrder: 'Track My Order',

    // Cart Sidebar
    yourBag: 'Your Bag',
    bagEmpty: 'Your bag is empty',
    customVariant: 'Custom Variant',
    standardSelection: 'Standard Selection',
    removeText: 'Remove',
    subtotal: 'Subtotal',
    checkoutDisclaimer: 'Taxes and Standard Shipping calculated at checkout.',
    checkoutNow: 'Checkout Now',

    // Auth Extra
    protocolActivation: 'Protocol Activation',
    identitySynthesis: 'Identity Synthesis',
    identityDesignation: 'Identity Designation (Full Name)',
    digitalHub: 'Digital Hub (Email)',
    clearanceKey: 'Clearance Key (Password)',
    activateProtocol: 'Activate Protocol',
    synthesizeIdentity: 'Synthesize Identity',
    syncGoogle: 'Sync via Google Network',
    newResearcher: 'New Researcher? Initialize Identity Synthesis',
    existingIdentity: 'Existing Identity? Access Protocol Activation',

    // Product Page
    technicalSpecs: 'Technical Specifications',
    artisanNote: 'Artisan Note',
    personalizationStudio: 'Personalization Studio',
    information: 'Information',
    configurePiece: 'Configure Your Piece',
    stock: 'Stock',
    units: 'units',
    preOrder: 'Exclusive Pre-order',
    writeReview: 'Write Review',
    shareExperience: 'Share Your Experience',
    customerVoices: 'Customer Voices',
    nexaExperience: 'The Nexa Experience',
    verifiedCollector: 'Verified Collector',
    handselectedAdditions: 'Handselected Additions',
    frequentlyBoughtTogether: 'Frequently Bought Together',
    artisanNoteDesc: 'Every artifact is unique. Minor variations in texture and hue are a testament to the handcrafted nature of the product.',
  },
  BN: {
    // Navbar / Menu
    lighting: 'লাইটিং',
    decor: 'সাজসজ্জা',
    kitchen: 'রান্নাঘর',
    essentials: 'প্রয়োজনীয়',
    newArrivals: 'নতুন পণ্য',
    contact: 'যোগাযোগ',
    shipping: 'শিপিং',
    returns: 'রিটার্ন',
    shop: 'দোকান',
    bestsellers: 'সেরা পণ্য',
    gallery: 'গ্যালারি',
    about: 'আমাদের সম্পর্কে',
    
    // Hero
    heroTitlePart1: 'পরিবেশ বান্ধব',
    heroTitlePart2: 'রান্নাঘরের সরঞ্জাম',
    heroTitlePart3: 'সুস্থ আগামীর জন্য',
    heroDesc: 'প্রাকৃতিক সৌন্দর্য এবং আধুনিক কার্যকারিতার সংমিশ্রণ। একটি সচেতনভাবে সাজানো জীবনধারার জন্য টেকসই পছন্দ।',
    shopNow: 'কিনুন এখনই',
    naturalSustainable: 'প্রাকৃতিক। টেকসই।',
    ecoConscious: 'পরিবেশ সচেতন।',
    
    // Auth
    login: 'লগইন',
    profile: 'প্রোফাইল',
    
    // Cart
    dropHere: 'এখানে ছাড়ুন',
    addToBag: 'ব্যাগে যোগ করুন',
    buyNow: 'এখনই কিনুন',

    // Footer
    help: 'সহায়তা',
    accountKey: 'অ্যাকাউন্ট',
    followUs: 'আমাদের অনুসরণ করুন',
    subscribe: 'সাবস্ক্রাইব করুন',
    subscribeDesc: 'বিশেষ অফার এবং নতুন কালেকশন সম্পর্কে সবার আগে জানুন',
    signUp: 'নিবন্ধন করুন',
    dhakaOffice: 'কর্পোরেট অফিস',
    phone: 'ফোন',
    email: 'ইমেইল',
    
    // Shop
    allProducts: 'সব পণ্য',
    filterBy: 'ফিল্টার',
    sortBy: 'বাছাই করুন',
    backToHome: 'হোমে ফিরে যান',
    searchProducts: 'পণ্য খুঁজুন...',
    noItemsFound: 'আপনার অনুসন্ধানের সাথে মেলে এমন কোনো পণ্য পাওয়া যায়নি।',
    clearFilters: 'ফিল্টার মুছুন',
    all: 'সব',
    collection: 'কালেকশন',
    loadingTreasures: 'পণ্য লোড হচ্ছে...',
    
    // Checkout
    checkout: 'চেকআউট',
    shippingInfo: 'শিপিং তথ্য',
    orderSummary: 'অর্ডারের সারাংশ',
    placeOrder: 'অর্ডার করুন',

    // Product Page
    technicalSpecs: 'প্রযুক্তিগত বৈশিষ্ট্য',
    artisanNote: 'কারিগর নোট',
    personalizationStudio: 'পার্সোনালাইজেশন স্টুডিও',
    information: 'তথ্য',
    configurePiece: 'আপনার কাঙ্ক্ষিত ডিজাইন পছন্দ করুন',
    stock: 'স্টক',
    units: 'পিস',
    preOrder: 'এক্সক্লুসিভ প্রি-অর্ডার',
    writeReview: 'রিভিউ লিখুন',
    shareExperience: 'আপনার মতামত শেয়ার করুন',
    customerVoices: 'ক্রেতাদের কথা',
    nexaExperience: 'নেক্সা অভিজ্ঞতা',
    verifiedCollector: 'ভেরিফাইড ক্রেতা',
    handselectedAdditions: 'হ্যান্ড সিলেক্টেড অ্যাডিশন',
    frequentlyBoughtTogether: 'সাথে আরও যা কিনতে পারেন',
    artisanNoteDesc: 'প্রতিটি হস্তশিল্প অনন্য। টেকক্সচার এবং রঙে সামান্য ভিন্নতা প্রতিটি পণ্যের হাতে তৈরি হওয়ার প্রমাণ।',

    // Checkout Extra
    finalizeArtifact: 'অর্ডার সম্পন্ন করুন',
    returnToStore: 'দোকানে ফিরে যান',
    shippingDetailsHeader: 'শিপিং তথ্য দিন',
    recipientName: 'প্রাপকের নাম',
    contactPhone: 'যোগাযোগের মোবাইল',
    residenceAddress: 'পূর্ণ ঠিকানা',
    cityZone: 'শহর / জোন',
    districtCode: 'জেলা কোড',
    selectCity: 'শহর নির্বাচন করুন',
    paymentArchitect: 'পেমেন্ট গেটওয়ে',
    holdToPlaceOrder: 'অর্ডার করতে চেপে ধরুন',
    validating: 'যাচাই করা হচ্ছে...',
    artifactRegistry: 'অর্ডারের তালিকা',
    vatTax: 'ভ্যাট / ট্যাক্স',
    included: 'অন্তর্ভুক্ত',
    logistics: 'ডেলিভারি খরচ',
    complimentary: 'ফ্রি',
    totalText: 'সর্বমোট',
    cashOnDelivery: 'ক্যাশ অন ডেলিভারি',

    // Success
    thankYouPurchase: 'আপনার কেনাকাটার জন্য ধন্যবাদ',
    orderReceived: "আপনার অর্ডারটি গ্রহণ করা হয়েছে এবং শিপিংয়ের জন্য প্রসেস করা হচ্ছে। আমরা আপনার ইমেইলে একটি কনফার্মেশন পাঠিয়েছি।",
    continueShopping: 'কেনাকাটা চালিয়ে যান',
    trackMyOrder: 'অর্ডার ট্র্যাক করুন',

    // Cart Sidebar
    yourBag: 'আপনার ব্যাগ',
    bagEmpty: 'আপনার ব্যাগ খালি',
    customVariant: 'কাস্টম ভেরিয়েন্ট',
    standardSelection: 'স্ট্যান্ডার্ড সিলেকশন',
    removeText: 'সরিয়ে ফেলুন',
    subtotal: 'সাবটোটাল',
    checkoutDisclaimer: 'ভ্যাট এবং শিপিং চেকআউটের সময় গণনা করা হবে।',
    checkoutNow: 'চেকআউট করুন',

    // Auth Extra
    protocolActivation: 'লগইন করুন',
    identitySynthesis: 'নতুন অ্যাকাউন্ট',
    identityDesignation: 'আপনার নাম',
    digitalHub: 'ইমেইল এড্রেস',
    clearanceKey: 'পাসওয়ার্ড',
    activateProtocol: 'লগইন করুন',
    synthesizeIdentity: 'অ্যাকাউন্ট খুলুন',
    syncGoogle: 'গুগল দিয়ে লগইন করুন',
    newResearcher: 'নতুন অ্যাকাউন্ট খুলতে চান?',
    existingIdentity: 'ইতিমধ্যে অ্যাকাউন্ট আছে?',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('app_lang');
    if (saved === 'EN' || saved === 'BN') return saved;
    return 'EN';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  const t = (key: string): string => {
    const langDict = translations[lang];
    if (!langDict) return key;
    const translation = langDict[key as keyof typeof translations['EN']];
    return translation || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
