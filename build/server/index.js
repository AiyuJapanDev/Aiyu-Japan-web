import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, useLocation, Link, useNavigate, useSearchParams, UNSAFE_withComponentProps, Outlet, Meta, Links, ScrollRestoration, Scripts, useParams } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { MapPin, Calculator as Calculator$1, Package, Mail, Facebook, Instagram, ChevronRight, Check, Circle, ChevronDown, Crown, Bell, LogOut, X, Menu, Globe, Plus, MessageCircle, Send, Newspaper, MoveRight, Clock, ArrowLeft, ArrowRight, Search, Link as Link$1, BadgePercent, Tag, MessageSquareText, PlusCircle, ShoppingCart, Truck, Heart, CheckCircle, ChevronUp, EyeOff, Eye, ExternalLink, Loader2, Lock, Copy, User, Save, Edit, Filter, RefreshCw, AlertTriangle, AlertCircle, Home as Home$1, ChevronLeft, XCircle, PackageCheck, DollarSign, Scale, CreditCard, FileText, MoreHorizontal, ShoppingBag, Warehouse, Users, Settings as Settings$1, Flag, Trash2, Weight, Calendar } from "lucide-react";
import * as React from "react";
import React__default, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { useQuery, QueryClient, QueryClientProvider, useQueryClient, useMutation } from "@tanstack/react-query";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as LabelPrimitive from "@radix-ui/react-label";
import { useTheme } from "next-themes";
import { Toaster as Toaster$2, toast as toast$1 } from "sonner";
import * as ToastPrimitives from "@radix-ui/react-toast";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import useEmblaCarousel from "embla-carousel-react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as SliderPrimitive from "@radix-ui/react-slider";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { formatDistanceToNow, format } from "date-fns";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  if (request.method.toUpperCase() === "HEAD") {
    return new Response(null, {
      status: responseStatusCode,
      headers: responseHeaders
    });
  }
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    let timeoutId = setTimeout(
      () => abort(),
      streamTimeout + 1e3
    );
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = void 0;
              callback();
            }
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const FooterLogo = () => {
  return /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center", children: /* @__PURE__ */ jsx("img", { src: "aiyu_logo_small.png", alt: "Aiyu Logo", className: "w-60 h-auto" }) });
};
const translations = {
  en: {
    // Navigation
    newUser: "Are you new to Aiyu Japan?",
    home: "Home",
    services: "Services",
    calculator: "Cost Simulator",
    storeGuide: "Store Guide",
    simulator: "Simulator",
    dashboard: "Dashboard",
    login: "Login",
    register: "Register",
    contact: "Contact",
    information: "Information",
    headerParagraph: "Buy from any <span class='text-red-600'>japanese</span> store!",
    // Home Page
    heroSlide1Title: "From Japan to Your Home Anyday",
    heroSlide1TitleSubtitle: "Aiyu Japan is passionate about connecting different cultures and building great services.",
    heroSlide2Title: "Deliver excitement of j-shopping with utmost empathy and responsibility for our customers.",
    heroSlide2TitleSubtitle: "",
    // How It Works
    howItWorks: "How It Works",
    step1Title: "Browse & Request",
    step1Description: "Find products on Japanese websites and submit your request through our platform",
    step2Title: "We Purchase",
    step2Description: "Our team purchases the items for you and consolidates your orders",
    step3Title: "Ship to You",
    step3Description: "We ship your items safely to your doorstep worldwide",
    getStarted: "Get Started",
    learnMore: "Learn More",
    // Services Page
    servicesTitle: "Our Services",
    servicesSubtitle: "Professional Japanese Shopping Proxy Service",
    servicesDescription: "We make shopping from Japan simple, safe, and affordable. From anime collectibles to electronics, fashion, and everything in between - we've got you covered!",
    whyChooseMainTitle: "Why Choose Our Proxy Service?",
    whyChooseMainSubtitle: "More than just shopping - we're your trusted partner in Japan",
    personalShoppingTitle: "Personal Shopping Service",
    personalShoppingDescription: "Can't find what you're looking for? Our personal shoppers will hunt it down for you!",
    packageConsolidationTitle: "Package Consolidation",
    packageConsolidationDescription: "Save money by combining multiple orders into one shipment",
    fastShippingTitle: "Fast & Secure Shipping",
    fastShippingDescription: "Multiple shipping options to suit your needs and budget",
    expertKnowledge: "Expert knowledge of Japanese stores",
    accessExclusive: "Access to exclusive items",
    negotiation: "Negotiation for best prices",
    reducedCosts: "Reduced shipping costs",
    freeStorage: "Free storage up to 30 days",
    professionalPackaging: "Professional packaging",
    expressShipping: "Express shipping available",
    insuranceCoverage: "Full insurance coverage",
    realTimeTracking: "Real-time tracking",
    whatCanWeShop: "What Can We Shop For You?",
    whatCanWeShopSubtitle: "From everyday items to rare collectibles - we can find it all!",
    animeCategory: "Anime & Manga",
    fashionCategory: "Fashion & Beauty",
    electronicsCategory: "Electronics",
    traditionalCategory: "Traditional Items",
    figures: "Figures",
    collectibles: "Collectibles",
    limitedEditions: "Limited Editions",
    doujinshi: "Doujinshi",
    clothing: "Clothing",
    cosmetics: "Cosmetics",
    accessories: "Accessories",
    shoes: "Shoes",
    gaming: "Gaming",
    gadgets: "Gadgets",
    audio: "Audio",
    cameras: "Cameras",
    crafts: "Crafts",
    tea: "Tea",
    snacks: "Snacks",
    souvenirs: "Souvenirs",
    // Simulator
    quotationSimulator: "Quotation Simulator",
    productCost: "Product Cost (¥)",
    destination: "Destination Country",
    calculate: "Calculate",
    serviceFee: "Service Fee",
    handlingFee: "Handling Fee (10%)",
    viewBenefits: "View Benefits",
    handlingFeeBenefitConsolidation: "Package consolidation",
    handlingFeeBenefitStorage: "Free unlimited storage",
    handlingFeeBenefitPhotos: "Product photos (if requested)",
    handlingFeeBenefitPackaging: "Standard or double packaging",
    handlingFeeBenefitSupport: "Private support for your orders",
    noHiddenFees: "No hidden or extra fees after purchase",
    estimatedShipping: "Estimated Shipping",
    total: "Total Estimate",
    // Store Categories
    animeStores: "Anime & Manga",
    fashionStores: "Fashion",
    electronicsStores: "Electronics",
    // CTA Section
    ctaTitle: "Ready to start shopping?",
    ctaDescription: "Start by sending us your product URLs or a clear image through any of our social media channels.",
    makeOrder: "Make Order",
    // Detailed How It Works
    howItWorksDetailedTitle: "How Aiyu Japan Works",
    howItWorksDetailedDescription1: "Bring a piece of Japan to your home with Aiyu Japan. We help you shop at multiple stores and ship items together, saving on costs. Fast, secure, and simple—Aiyu Japan is your ultimate Japanese shopping companion.",
    howItWorksDetailedDescription2: "Want to know more? Read our new user guide to learn everything you need to know to start shopping at Aiyu Japan.",
    newUserLinkBtn: "New user guide",
    step1DetailedTitle: "Step 1 – Find your product",
    step1DetailedDescription: "Go to your favorite Japanese store (like Uniqlo, Pokémon Center, Animate, or Amazon Japan). When you find something you want, copy the link (URL) of the product page. Example: https://example.com/product123",
    step2DetailedTitle: "Step 2 – Paste the link in our form",
    step2DetailedDescription: "Go to our request page: 👉 https://alpha.aiyujapan.com. Youʼll see a form called “Send Product Request”. Paste your product link there — thatʼs how we know exactly what to buy for you!",
    step3DetailedTitle: "Step 3 – Add quantity",
    step3DetailedDescription: "In the next box, write how many units you want (for example: 1, 2, or 3).",
    step4DetailedTitle: "Step 4 – Add a name or label (optional)",
    step4DetailedDescription: "You can give your order a short name — for example: “Pikachu figure” or “One Piece T-shirt”. This helps you identify it later inside your dashboard.",
    step5DetailedTitle: "Step 5 – Write a note (optional)",
    step5DetailedDescription: "If you have special details, like a size, color, or comment, write it here. Example: “Size M, blue color, please choose from official store only.”",
    step6DetailedTitle: "Step 6 – Add more products",
    step6DetailedDescription: "Want more items? Just click “Add Another Product.” You can add as many links as you want — each one becomes part of your order.",
    step7DetailedTitle: "Step 7 – Submit your request",
    step7DetailedDescription: "When youʼre ready, click “Send Request.” Our team will check your products, confirm availability, and send you a payment link. Once payment is complete, weʼll buy everything for you!",
    // Why Choose Section
    whyChooseTitle: "Why choose Aiyu Japan?",
    whyChooseSubtitle: "This is what makes us the best choice for your Japanese purchases.",
    reason1Title: "BUY EVERYTHING YOU WANT FROM JAPAN",
    reason1Description: "You can not only buy whatever you want from Japan, but we also work with limited product reservations!",
    reason2Title: "THE BEST RATE IN THE MARKET",
    reason2Description: "Only 500 yen (3.5$) per item. Competitive rates that fit your budget!",
    reason3Title: "FREE CONSOLIDATIONS",
    reason3Description: "Did you buy from different stores? We consolidate all your orders at no additional cost!",
    reason4Title: "WORLDWIDE SHIPPING",
    reason4Description: "From Japan directly to your door. We reach Europe, North America and most of South America!",
    //Recommended stores section
    recommendedStoresTitle: "Recommended Sites",
    recommendedStoresDescription: "Get full access to the most popular Japanese online shops and individual sellers",
    // Hero Section Buttons
    makeOrderButton: "Make Order",
    whereToShop: "Where To Shop",
    seeJapaneseStores: "See Japanese Stores",
    calculateEstimatedCost: "Calculate Estimated Cost",
    // Additional Services Section
    additionalServicesTitle: "WE ALSO HAVE",
    additionalServicesSubtitle: "Additional services to further enhance your shopping experience.",
    customerServiceTitle: "Customer Service",
    customerServiceDescription: "We serve you at all hours personally through email, Instagram and Facebook.",
    securityTitle: "Security & Trust",
    securityDescription: "All our payments are through reliable platforms, our partners are nationally recognized companies.",
    webServiceTitle: "Web Service",
    webServiceDescription: "The website is designed to give you a 100% understanding of our services, and it's open 24/7 for inquiries.",
    // Footer
    footerMenu: "Menu",
    whereToShopMenu: "Where To Shop",
    calculatorBeta: "Calculator Beta",
    servicesFooter: "Services",
    contactFooter: "Contact",
    legal: "Legal",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    contactLabel: "CONTACT",
    taxIdFooter: "Tax Registration ID:",
    footerCopyright: "© 2025 ＳＥＲＲＵＤＯ合同会社  All rights reserved.",
    // Pricing Info Section
    transparentPricing: "Transparent Pricing",
    serviceFeePerItem: "Service Fee per Item",
    taxOnItemCost: "Tax on Item Cost",
    internationalShipping: "International Shipping",
    variable: "Variable",
    noHiddenFeesTransparent: "No hidden fees, no surprises. Get a detailed quote before making any purchase.",
    // Calculator Page
    calculatorBetaPage: "Cost Simulator",
    calculatorDisclaimer: "These prices are only approximations, the actual price could vary slightly.",
    // Purchase Calculator
    purchaseCalculator: "Purchase Calculator",
    enterPriceInYen: "Enter the product price in Japanese Yen",
    quotedPrice: "Quoted Price",
    serviceFeeLabel: "Service Fee",
    enterPriceToCalculate: "Enter a price to calculate it!",
    // Shipping Calculator
    shippingCalculator: "International Shipping Calculator",
    selectRegion: "Select a region",
    region: "Region",
    shippingMethods: "Shipping Methods",
    chooseShippingMethod: "Choose one of the shipping methods.",
    economicShipping: "Economic/Standard Shipping (15-21 days - Small Packet)",
    expressShippingMethod: "Express Shipping (4-10 business days - Express mail service)",
    dhlShipping: "DHL Express Shipping (2-5 business days)",
    selectWeight: "Select weight:",
    internationalShippingCost: "International Shipping Cost",
    enterDataToCalculate: "Enter the data to perform the calculation!",
    dimensionsLabel: "Package Dimensions (Optional)",
    lengthLabel: "Length (cm)",
    widthLabel: "Width (cm)",
    heightLabel: "Height (cm)",
    // Store Guide Page
    storeGuideTitle: "Recommended Japanese Stores",
    storeGuideDescription: "Remember to send us the links of your products to our Instagram - Facebook - or WhatsApp!",
    selectCategory: "Select a category",
    allCategories: "All Categories",
    generalMarketplace: "General Marketplace",
    animeMangaMerchandising: "Anime, Manga & Merchandising",
    fashionAccessories: "Fashion & Accessories",
    householdDecoration: "Household & Decoration Items",
    beautyCosmetics: "Beauty & Cosmetics",
    figuresCollectibles: "Figures & Collectibles",
    // Store names and descriptions
    amazonJapan: "Amazon Japan",
    amazonJapanDesc: "One of the most famous and reliable Japanese online stores.",
    rakuten: "Rakuten",
    rakutenDesc: "A nationally known store recognized for its variety and price.",
    yahooShopping: "Yahoo Shopping (PayPay Flea Market)",
    yahooShoppingDesc: "General sales store, similar to Amazon and Mercari.",
    mercariJapan: "Mercari Japan",
    mercariJapanDesc: "Largest second-hand store. Looking for a used but like-new figure? This is the place.",
    buyma: "Buyma",
    buymaDesc: "Japanese marketplace for clothing and exclusive brand items.",
    surugaya: "Surugaya",
    surugayaDesc: "One of the most varied stores with the cheapest prices for anime items.",
    mandarake: "Mandarake",
    mandarakeDesc: "The perfect store for collectors of manga, figures and retro items.",
    animate: "Animate",
    animateDesc: "One of the largest anime product sales companies of all.",
    jumpShop: "Jump Shop",
    jumpShopDesc: "One Piece, Haikyuu, Dragon Ball items... Do you already know this store?",
    chiikawaStore: "Chiikawa store",
    chiikawaStoreDesc: "Official Chiikawa store with exclusive and adorable merchandise.",
    cdJapan: "CD Japan",
    cdJapanDesc: "Japanese anime - J-pop groups - Kpop etc.",
    evangelionStore: "Evangelion Store",
    evangelionStoreDesc: "Official Evangelion store with exclusive items not available in other stores.",
    pokemonCenter: "Pokemon Center",
    pokemonCenterDesc: "Official store for all kinds of Pokémon products, including plushies, clothing and games.",
    sailorMoonStore: "Sailor Moon Store",
    sailorMoonStoreDesc: "Find exclusive Sailor Moon products, from figures to collectible items.",
    sanrioStore: "Sanrio Store",
    sanrioStoreDesc: "Official Sanrio store with adorable Hello Kitty and other character products.",
    studioGhibliStore: "Studio Ghibli Store (Donguri Sora)",
    studioGhibliStoreDesc: "Store where you will find exclusive products from Studio Ghibli movies.",
    usjStore: "Universal Studios Japan Store",
    usjStoreDesc: "Official Universal Studios Japan store with exclusive park products.",
    disneyStore: "Disney Store",
    disneyStoreDesc: "Official Disney Japan store with adorable and exclusive products.",
    mediaWorld: "Media World",
    mediaWorldDesc: "Specialized in figures and merchandise from your favorite animes in second hand.",
    banpresto: "BANPRESTO",
    banprestoDesc: "One of the best stores to buy your anime figures.",
    popMart: "POP MART",
    popMartDesc: "The store for Labubu, Crying Babies and more.",
    sylvanianFamilies: "Sylvanian Families",
    sylvanianFamiliesDesc: "Official store of the famous cuties, Sylvanian Family Store.",
    amiAmi: "AmiAmi",
    amiAmiDesc: "One of the most popular stores for anime figures and merchandise. Wide variety of new and pre-order products.",
    goodSmileOnline: "Good Smile Online",
    goodSmileOnlineDesc: "Official Good Smile Company store. Find Nendoroid, Figma figures and exclusive collectibles directly from the manufacturer.",
    uniqlo: "UNIQLO",
    uniqloDesc: "Comfortable and quality clothing for the whole family, with simple and modern designs.",
    gu: "GU",
    guDesc: "Affordable and trendy fashion, inspired by the latest trends from Japan.",
    zozotown: "ZOZOTOWN",
    zozotownDesc: "The largest online fashion store in Japan with the best brands.",
    graniph: "Graniph",
    graniphDesc: "Here you will find incredible collaborations with series and anime.",
    weverseShop: "Weverse Shop Japan",
    weverseShopDesc: "Official K-pop products store in Japan.",
    btsOfficialShop: "BTS Official Shop Japan",
    btsOfficialShopDesc: "The Japanese store of one of the most famous bands in the world.",
    newEra: "New Era",
    newEraDesc: "Caps and urban fashion accessories from the New Era brand.",
    onitsukaTiger: "Onitsuka Tiger",
    onitsukaTigerDesc: "Japanese fashion sneakers with retro and modern style.",
    crocsJapan: "Crocs Japan",
    crocsJapanDesc: "Official Japanese Crocs store with new models and colors.",
    humanMadeJapan: "Human Made Japan",
    humanMadeJapanDesc: "Designer clothing and accessories created by NIGO® and the Human Made brand.",
    adidasJapan: "Adidas Japan",
    adidasJapanDesc: "Official Adidas Japan store with exclusive releases.",
    nikeJapan: "Nike Japan",
    nikeJapanDesc: "The latest in sneakers, clothing and sports equipment from Nike in Japan.",
    stripeClub: "Stripe Club",
    stripeClubDesc: "Japanese women's fashion with brands like Earth, Music & Ecology.",
    daisoJapan: "Daiso Japan",
    daisoJapanDesc: "$1 store? We have that too.",
    nitori: "NITORI",
    nitoriDesc: "One of Japan's largest stores to buy things for the home.",
    loft: "LOFT",
    loftDesc: "Store for stationery, decoration and household items.",
    palCloset: "PAL CLOSET",
    palClosetDesc: "A store to find things for the house and clothes.",
    yodobashiCamera: "Yodobashi Camera",
    yodobashiCameraDesc: "Home appliances, gadgets and hobby items at the best price.",
    mujiJapan: "MUJI Japan",
    mujiJapanDesc: "Japanese minimalism at its finest. From furniture and household items to stationery, clothing and snacks.",
    oliveYoungGlobal: "Olive Young Global",
    oliveYoungGlobalDesc: "Leading Korean cosmetics store with global shipping. Popular skincare, makeup and personal care products.",
    cosmeCom: "Cosme.com",
    cosmeComDesc: "One of the most reliable platforms in Japan to buy makeup and cosmetics from award-winning Japanese brands.",
    // Shipping calculator regions
    asia: "Asia",
    europeCanadaMexico: "Europe, Canada & Mexico",
    usa: "USA",
    centralSouthAmerica: "Central & South America",
    // Contact Page
    contactDescription1: "If you need any help or would like to make an inquiry, don't hesitate to contact us!",
    contactDescription2: "The Aiyu staff is here to serve you 24 hours a day. Below we provide information on ways to contact us:",
    ourStaff: "Our Staff",
    staffRole1: "Content Creation Staff, English Market Manager",
    staffRole2: "Content Creation Leader",
    yourInquiryNotBother: "Your inquiry is not a bother!",
    getInTouch: "Get in Touch",
    contactFormName: "Name",
    contactFormEmail: "E-mail",
    contactFormSubject: "Subject",
    contactFormMessage: "Message",
    contactFormSend: "Send",
    subjectGeneral: "General Inquiry",
    subjectOrder: "Order Support",
    subjectShipping: "Shipping Question",
    subjectProduct: "Product Information",
    subjectOther: "Other",
    // Social Media Section
    customerReviews: "Customer Reviews",
    instagramFeed: "Instagram Feed",
    // FAQ
    faqTitle: "Frequently Asked Questions",
    faq1Question: "Service fee per item",
    faq1Answer: "The fee is ¥500 (approx. 3 USD) per item, plus 10% tax on the total product value. Includes: search, consolidation, packaging, and free storage.",
    faq2Question: "How are payments made?",
    faq2Answer: "We issue an electronic receipt via PayPal. You don't need a PayPal account: just a credit or debit card.",
    faq3Question: "What is the first payment and final payment?",
    faq3Answer: "• First payment: covers the cost of the products you choose.\n• If you add more items, we'll issue a new receipt.\n• Final payment: corresponds to international shipping after consolidating and weighing your purchases.",
    faq4Question: "How long does shipping take?",
    faq4Answer: "• Economy shipping to Latin America, USA, and Europe: 2–3 weeks.\n• Economy shipping to Asia: 1 week.\n• Express shipping (optional): 1–2 weeks.",
    faq5Question: "Do you have a physical store outside Japan?",
    faq5Answer: "Aiyu Japan is located in Osaka, Japan, and we don't have branches in other countries.",
    faq6Question: "Accepted payment methods",
    faq6Answer: "• Credit and debit cards\n• PayPal balance\n• Coming soon: bank transfer, Wise, etc.",
    faq7Question: "Shipping coverage",
    faq7Answer: "• Direct: Mexico, Chile, Peru, El Salvador, Costa Rica, Spain, and Argentina.\n• Courier (via USA): Paraguay, Ecuador, Bolivia, and Colombia.\n• Europe, Oceania, and rest of Asia: direct deliveries without intermediaries.",
    faq8Question: "What happens if my package is lost or doesn't arrive?",
    faq8Answer: "Aiyu Japan and Japan Post will investigate the case. If loss is confirmed, we'll refund 50% of the total product value.",
    faq9Question: "Do I have to pay customs duties when receiving the package?",
    // User Dashboard Navigation
    submitRequest: "Submit Request",
    orders: "Orders",
    storage: "Storage",
    shipping: "Shipping",
    profile: "Account",
    notifications: "Notifications",
    // Product Request Form
    productRequestTitle: "Submit Product Request",
    productRequestSubtitle: "Add the products you want us to purchase for you",
    productUrl: "Product URL",
    productUrlPlaceholder: "https://example.com/product",
    productName: "Product Name (Optional)",
    productNamePlaceholder: "Product Name (Optional)",
    quantity: "Quantity",
    productNotes: "Notes (Optional)",
    productNotesPlaceholder: "Size, color, special instructions... (Optional)",
    addProduct: "Add Another Product",
    removeProduct: "Remove",
    submitRequestButton: "Submit Request",
    submitting: "Submitting...",
    atLeastOneProduct: "Please add at least one product URL",
    requestSubmittedSuccess: "Product request submitted successfully",
    requestSubmittedError: "Failed to submit product request",
    // Orders Page
    currentOrders: "Current Orders",
    filterOrders: "Filter Orders",
    statusFilter: "Status:",
    showPerPage: "Show:",
    perPage: "per page",
    hideRejected: "Hide rejected",
    update: "Update",
    refreshing: "Refreshing...",
    showingOrders: "Showing",
    ofOrders: "of",
    ordersText: "orders",
    noActiveOrders: "No active orders found",
    noActiveOrdersDescription: "Submit a product request to get started!",
    allStatuses: "All Statuses",
    statusRequested: "Requested",
    statusAwaitingPayment: "Awaiting Payment",
    statusPaid: "Paid",
    statusSomePurchased: "Some Purchased",
    statusAllPurchased: "All Purchased",
    statusInTransit: "In Transit",
    statusAllAtWarehouse: "All at Warehouse",
    statusRejected: "Rejected",
    shippingQuoteSent: "Shipping Quote Sent",
    shippingPaid: "Shipping Paid",
    statusShipped: "Shipped",
    statusDelivered: "Delivered",
    orderNumber: "Order #",
    createdOn: "Created on",
    products: "Products",
    orderRejectionReason: "Order Rejection Reason",
    orderRejectReasons: "Review the reason and edit your order if needed",
    productIssues: "Product Issues",
    quoteInformation: "Quote Information",
    quotePrice: "Quote Price",
    payNow: "Pay Now",
    editOrder: "Edit Order",
    goToStorage: "Go to Storage",
    trackingInformation: "Tracking Information",
    trackingNumber: "Tracking Number:",
    shippedOn: "Shipped on:",
    viewProduct: "View Product",
    noQuoteYet: "No quote available yet",
    ordersUpdatedSuccess: "Orders updated successfully",
    ordersUpdateError: "Failed to refresh orders",
    noOrdersWithFilter: "No orders found with this filter",
    tryDifferentFilter: "Try selecting a different status filter.",
    orderRejected: "Order Rejected",
    loadingOrders: "Loading orders...",
    previous: "Previous",
    next: "Next",
    quoteIssued: "Quote has been issued for this order",
    normalDeliveryInfo: "Normal orders may take from 3–5 days to arrive to our warehouse",
    paymentReceivedInfo: "Payment received. We are going to proceed now to purchase/reserve your items",
    paymentConfirmationNotice1: "Payment confirmation may take from a few minutes to several hours (during business hours).",
    paymentConfirmationNotice2: "Please wait patiently after making your payment.",
    success: "Success",
    error: "Error",
    statusStepRequestSubmitted: "Request Submitted",
    statusStepPaymentConfirmed: "Payment Confirmed",
    statusStepItemsBeingPurchased: "Item(s) being purchased",
    statusStepItemsPurchased: "Items Purchased",
    statusStepItemsOnTheWay: "Item(s) on the way to warehouse",
    statusStepAllAtWarehouse: "All Items at Warehouse",
    // Storage Page
    warehouseStorage: "Warehouse Storage",
    selectItemsToShip: "Select items to request a shipping quote",
    availableItems: "Available Items",
    itemName: "Item Name",
    weight: "Weight",
    orderNumberShort: "Order #",
    arrived: "Arrived",
    awaitingWeighing: "Awaiting weighing",
    itemsSelected: "items selected",
    itemSelected: "item selected",
    itemLabel: "Item",
    itemsLabel: "Items",
    totalWeight: "Total weight",
    requestShippingQuote: "Request Shipping Quote",
    noItemsAtWarehouse: "No items at warehouse",
    noItemsDescription: "Items will appear here once they arrive at our warehouse.",
    shippingQuotesRequested: "Shipping Quotes Requested",
    shipmentNumber: "Shipment #",
    viewInShipping: "View in Shipping",
    storageAlertTitle: "Storage Information",
    storageAlert1: "Items are stored securely in our warehouse",
    storageAlert2: "You can consolidate multiple items into one shipment",
    storageAlert3: "There is no time limit to how long items can be stored",
    addressService: "Japanese Address Service – No Consolidation",
    // Storage Page
    // Shipping Page
    shippingTitle: "Shipping",
    filterShipments: "Filter Shipments",
    statusAwaitingQuote: "Awaiting Quote",
    statusQuoted: "Awaiting Payment",
    statusPaymentReceived: "Payment Received",
    shippingRequestsAwaitingQuote: "Shipping Requests Awaiting Quote",
    awaitingQuoteDescription: "These requests are being reviewed by our team. You'll receive a quote soon.",
    shippingQuotes: "Shipping Quotes",
    quotesDescription: "Review and pay for your shipping quotes below",
    shippedOrders: "Shipped Orders",
    shippedOrdersDescription: "Track your shipped packages",
    destinationLabel: "Destination:",
    shippingMethodLabel: "Shipping Method:",
    estimatedCost: "Estimated Cost:",
    actualCost: "Actual Cost:",
    shippingAddress: "Shipping Address:",
    trackShipment: "Track Shipment",
    payShippingQuote: "Pay Shipping Quote",
    rejectionReason: "Rejection Reason:",
    rejectedItems: "Rejected Items:",
    shipmentItems: "Shipment Items",
    noShipmentsYet: "No shipments yet",
    noShipmentsDescription: "Your shipping quotes and shipped orders will appear here.",
    noShipmentsWithFilter: "No shipments found with this filter",
    shippingDataUpdated: "Shipping data updated successfully",
    shippingDataUpdateError: "Failed to refresh shipping data",
    showingShipments: "Showing",
    ofShipments: "of",
    shipmentsText: "shipments",
    loadingShipments: "Loading shipments...",
    noShipments: "No shipments yet",
    noShipmentsFiltered: "No shipments found with this filter",
    awaitingQuoteTitle: "Shipping Requests Awaiting Quote",
    shipmentsTitle: "Shipments",
    shipmentsDescription: "Quotes that have been sent and are in various stages of processing.",
    shippedOrdersTitle: "Shipped Orders",
    statusAwaitingQuoteBadge: "Awaiting Quote",
    statusAwaitingPaymentBadge: "Awaiting Payment",
    statusPaymentReceivedBadge: "Payment Received",
    statusShippedBadge: "Shipped",
    statusRejectedBadge: "Rejected",
    rejectionReasonTitle: "Rejection Reason",
    paymentLinkAvailable: "Payment Link Available",
    clickToPay: "Click below to proceed with payment",
    paymentConfirmed: "Payment Confirmed",
    viewInvoice: "View Invoice",
    shipmentTracking: "Shipment Tracking",
    shipmentTrackingInfo: "Your package is on its way",
    trackPackage: "Track Package",
    finalQuote: "Final Quote",
    itemsInShipment: "Items in this shipment:",
    items: "Items:",
    unnamedProduct: "Unnamed Product",
    issuePrefix: "Issue:",
    addressName: "Name:",
    addressPhone: "Phone:",
    address: "Address:",
    addressNotes: "Notes:",
    cityState: "City / State:",
    postalCode: "Postal Code:",
    country: "Country:",
    processing: "Processing",
    inTransit: "In Transit",
    delivered: "Delivered",
    trackPackageButton: "Track Package",
    shippingDataLoadError: "Failed to load shipping data",
    selectStatus: "Select Status",
    requestedOn: "Requested on",
    shippingPaymentReceived: "Your shipping payment has been received.",
    // Profile Page
    editProfileInformation: "Edit Profile Information",
    profileInformation: "Profile Information",
    editProfile: "Edit Profile",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    fullNameLabel: "Full Name",
    emailLabel: "Email",
    phoneNumberLabel: "Phone Number",
    countryLabel: "Country",
    postalCodeLabel: "Postal Code",
    deliveryAddress: "Delivery Address",
    deliveryNotes: "Delivery Notes (Optional)",
    notProvided: "Not provided",
    selectCountryPlaceholder: "Select your country",
    statePlaceholder: "Select your state",
    cityPlaceholder: "Select your city",
    saving: "Saving...",
    savingChanges: "Saving...",
    savingError: "Failed to update profile",
    savingSuccess: "Your profile has been updated successfully",
    fillAllRequired: "Please fill in all required fields",
    mustBeLoggedIn: "You must be logged in to update your profile",
    errorLoadingProfile: "Failed to load profile data",
    editProfileButton: "Edit Profile",
    cancelButton: "Cancel",
    saveButton: "Save Changes",
    userIdLabel: "User ID",
    cityLabel: "City",
    stateLabel: "State",
    // Japanese Address
    japaneseAddresstitle: "Japanese Address",
    japaneseAddressuserCodeNote: "*This is your Aiyu Japan personal code",
    japaneseAddresstoggleJapanese: "Japanese",
    japaneseAddresstoggleRomaji: "Romaji",
    japaneseAddresslabelsname: "Name",
    japaneseAddresslabelsprefectureCity: "Prefecture, City",
    japaneseAddresslabelsstreet: "Street",
    japaneseAddresslabelsbuilding: "Building",
    japaneseAddresslabelspostalCode: "Postal Code",
    japaneseAddresslabelsphone: "Phone number",
    japaneseAddressexplanation: "This is your Japanese address! Every item received at our warehouse is charged 500 yen (~$3 USD), with up to 30 days of free storage.",
    japaneseAddresswarningsTitle: "⚠️ Warnings:",
    japaneseAddresswarnings0: "Please make sure to copy everything correctly — we are not responsible for packages that are incorrectly addressed or delivered.",
    japaneseAddresswarnings1: "This Japanese address service is different from the Aiyu Japan shopping-agent service. It does not include benefits such as product photos, consolidation, or repackaging.",
    japaneseAddresswarnings2: "Packages will be forwarded exactly as they are received.",
    japaneseAddresstoastCopied: "Copied!",
    japaneseAddressrulesTitle: "⚠️ Japanese Address Service — Quick Rules",
    japaneseAddressrulesIntro: "If any of the following is required by the store:",
    japaneseAddressrules0: "Phone number or SMS/call verification",
    japaneseAddressrules1: "Payment support or your card doesn’t work",
    japaneseAddressrules2: "Full address (with AJxxxx code) cannot be entered",
    japaneseAddressrules3: "Identity verification or account assistance",
    japaneseAddressrulesBottom: "👉 Please use Aiyu Japan’s Shopping Agent Service.",
    // Edit Order Page
    editRejectedOrder: "Edit Rejected Order",
    orderRejectionReasonTitle: "Order Rejection Reason",
    productsInOrder: "Products in Order",
    editOrderDescription: "Edit the products below to fix any issues. Products marked with issues should be reviewed carefully.",
    productIssue: "Product Issue",
    addNewProduct: "Add New Product",
    newProductBadge: "New Product",
    willBeRemoved: "Will be removed",
    restore: "Restore",
    remove: "Remove",
    resubmitOrder: "Resubmit Order",
    resubmitting: "Resubmitting...",
    orderNotFound: "Order not found",
    loadingOrderDetails: "Loading order details...",
    atLeastOneProductError: "You must have at least one product in the order.",
    allProductsUrlError: "All products must have a URL.",
    orderResubmittedSuccess: "Your order has been resubmitted for processing.",
    orderResubmitError: "Failed to resubmit order. Please try again.",
    requested: "Your product request has been submitted and is awaiting a quote.",
    quoted: "A quote has been issued. Please review and pay to proceed.",
    paid: "Payment received. We’ll now purchase your items.",
    purchased: "Items have been purchased and are on the way to the warehouse.",
    all_received: "All items in this order have arrived at our warehouse.",
    partial_received: "Some items have arrived. Others are still in transit.",
    rejected: "This order was rejected. Please review the reason.",
    // Shipping Quote Dialog
    requestShippingQuoteTitle: "Request Shipping Quote",
    shippingQuoteDescription: "Select your country and method to calculate estimated shipping cost.",
    selectedItems: "Selected Items",
    shippingCountry: "Shipping Country",
    zone: "Zone",
    shippingMethod: "Shipping Method",
    economicShippingLabel: "Economic/Standard Shipping (15-21 days - Small Packet)",
    expressShippingLabel: "Express Shipping (4-10 business days - Express mail service)",
    paraguayShippingLabel: "Paraguay Shipping",
    estimatedInternationalShipping: "Estimated International Shipping Cost",
    shippingAddressLabel: "Shipping Address",
    addressLabel: "Address",
    addressNotesLabel: "Address Notes (Optional)",
    requestQuote: "Request Quote",
    requestingQuote: "Submitting...",
    missingAddressInfo: "Please fill in all required address fields",
    shippingQuoteRequestedSuccess: "Your shipping quote has been submitted successfully. We'll contact you soon with the final quote.",
    shippingQuoteRequestError: "Failed to submit shipping quote. Please try again.",
    // Notifications Page
    notificationsTitle: "Notifications",
    markAllAsRead: "Mark all as read",
    filters: "Filters",
    statusLabel: "Status",
    categoryLabel: "Category",
    timeLabel: "Time",
    allNotifications: "All notifications",
    unreadOnly: "Unread only",
    readOnly: "Read only",
    allTypes: "All types",
    ordersCategory: "Orders",
    shippingCategory: "Shipping",
    warehouseCategory: "Warehouse",
    adminCategory: "Admin",
    allTime: "All time",
    last7Days: "Last 7 days",
    last30Days: "Last 30 days",
    last90Days: "Last 90 days",
    clearFilters: "Clear filters",
    showingNotifications: "Showing",
    noNotificationsYet: "No notifications yet",
    noNotificationsFound: "No notifications found",
    clearFiltersToSee: "Clear filters to see all notifications",
    unread: "Unread",
    clickToView: "Click here to view order",
    clickToReview: "Click here to review and resubmit",
    clickToViewWarehouse: "Click here to view warehouse",
    clickToViewShipment: "Click here to view shipment",
    clickToTrackShipment: "Click here to track shipment",
    clickToViewNewOrder: "Click here to view new order",
    clickToReviewResubmitted: "Click here to review resubmitted order",
    clickToProcessShipping: "Click here to process shipping request",
    allNotificationsRead: "All notifications marked as read",
    markAsReadError: "Failed to mark notification as read",
    //Auth Page
    signIn: "Sign In",
    signUp: "Sign Up",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    fullName: "Full Name",
    forgotPassword: "Forgot Password?",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",
    signInWithGoogle: "Sign in with Google",
    createYourAccount: "Create Your Account",
    step: "Step",
    back: "Back",
    completeSignUp: "Complete Sign Up",
    signingIn: "Signing in...",
    creatingAccount: "Creating Account...",
    checkYourEmail: "Check your email",
    verificationEmailSent: "We've sent a verification email to",
    checkSpam: "Didn't receive it? Check your spam folder.",
    backToSignUp: "Back to Sign Up",
    includeCountryCode: "Include country code for international numbers",
    forgotPasswordQuestion: "Forgot Password?",
    dontHaveAccountQuestion: "Don't have an account?",
    alreadyHaveAccountQuestion: "Already have an account?",
    passwordsDoNotMatch: "Passwords do not match",
    passwordTooShort: "Password must be at least 6 characters",
    fillRequiredFields: "Please fill in all required fields",
    enterPhoneNumber: "Please enter your phone number",
    invalidPhoneNumber: "Please enter a valid phone number",
    fillAddressFields: "Please fill in all required address fields",
    emailAlreadyRegistered: "Email already registered",
    emailAlreadyRegisteredDesc: "This email is already in use. Please sign in or use a different email.",
    phoneAlreadyRegistered: "Phone number already registered",
    phoneAlreadyRegisteredDesc: "This phone number is already in use. Please use a different phone number.",
    signUpFailed: "Sign up failed",
    signUpFailedDesc: "An error occurred during signup.",
    emailAlreadyExistsAlt: "This email is already registered. Please sign in instead.",
    deliveryAddressPlaceholder: "Street address, apartment, suite, etc.",
    deliveryNotesPlaceholder: "Special delivery instructions, building name, etc.",
    loginRequired: "Login Required",
    pleaseSignInToAccess: "Please sign in to access this page.",
    adminAccessRequired: "Admin Access Required",
    defaultFallbackMessage: "You don't have permission to access this page.",
    currentRole: "Current role",
    loading: "Loading...",
    backToDashboard: "Back to Dashboard",
    // Forgot Password Page
    forgotPasswordTitle: "Forgot Password",
    forgotPasswordSubtitle: "Enter your email address and we'll send you a link to reset your password.",
    emailPlaceholder: "Enter your email address",
    sending: "Sending...",
    sendResetLink: "Send Reset Link",
    emailSentTo: "We've sent a password reset link to",
    didntReceive: "Didn't receive the email? Check your spam folder or try again.",
    backToSignIn: "Back to Sign In",
    //FAB Dialogue
    requestProductsTitle: "Request Products",
    requestProductsDescription: "Add product URLs you want to purchase from Japan. Sign in to submit your request.",
    productDetails: "Product Details",
    signInToSubmit: "Sign in to submit the request",
    // Status flow steps
    requestSubmitted: "Request Submitted",
    itemsBeingPurchased: "Item(s) being purchased",
    itemsPurchased: "Items Purchased",
    itemsOnWay: "Item(s) on the way to warehouse",
    allItemsAtWarehouse: "All Items at Warehouse",
    requestSubmittedStatus: "Request Submitted",
    awaitingPaymentStatus: "Awaiting Payment",
    paymentReceivedStatus: "Payment Received",
    itemsShipped: "Items Shipped",
    faq9Answer: "You may have to pay customs duties if the value exceeds the allowed limit in your country. Aiyu Japan has no jurisdiction over this; it's the customer's responsibility. For more details, contact us by email or social media.",
    // Common
    language: "Language",
    currency: "Currency",
    logout: "Logout",
    welcome: "Welcome",
    // Blog
    blog1Title: "Air freight from Japan to Paraguay",
    blog2Title: "How to use the Aiyu Japan Calculator",
    blog3Title: "Aiyu Japan Staff Introduction",
    blog4Title: "Where to buy with Aiyu Japan?",
    //News Blog
    featNewsTitle: "News & Anouncements",
    featNewsAll: "View All",
    newsBlog1Title: "New 1",
    newsBlog2Title: "New 2",
    newsBlog3Title: "New 3",
    newsBlog4Title: "New 4"
  },
  es: {
    // Navigation
    newUser: "¿Eres Nuevo Usuario?",
    home: "Inicio",
    services: "Servicios",
    calculator: "Estimador de costos",
    storeGuide: "Donde Comprar",
    simulator: "Calculadora Beta",
    dashboard: "Panel principal",
    login: "Iniciar Sesión",
    register: "Registrarse",
    contact: "Contacto",
    information: "Información",
    headerParagraph: "¡Compra en cualquier tienda <span class='text-red-600'>japonesa</span>!",
    // Home Page
    heroSlide1Title: "Desde Japón a Tu Casa Cualquier Día",
    heroSlide1TitleSubtitle: "En Aiyu Japan somos apasionados por conectar diferentes culturas y creado excelentes servicios.",
    heroSlide2Title: "Ofrecemos la emoción del j-shopping con gran empatía y responsabilidad con nuestros usuarios.",
    heroSlide2TitleSubtitle: "",
    //How It works
    howItWorks: "Cómo Funciona",
    step1Title: "Navega y Solicita",
    step1Description: "Encuentra productos en sitios web japoneses y envía tu solicitud a través de nuestra plataforma",
    step2Title: "Compramos por Ti",
    step2Description: "Nuestro equipo compra los artículos por ti y consolida tus pedidos",
    step3Title: "Te los Enviamos",
    step3Description: "Enviamos tus artículos de forma segura hasta tu puerta en todo el mundo",
    getStarted: "Comenzar",
    learnMore: "Saber Más",
    // Services Page
    servicesTitle: "Nuestros Servicios",
    servicesSubtitle: "Servicio Profesional de Compras Proxy Japonés",
    servicesDescription: "Hacemos que comprar desde Japón sea simple, seguro y asequible. Desde coleccionables de anime hasta electrónicos, moda y todo lo que esté entre ellos: ¡te tenemos cubierto!",
    whyChooseMainTitle: "¿Por Qué Elegir Nuestro Servicio Proxy?",
    whyChooseMainSubtitle: "Más que solo compras - somos tu socio de confianza en Japón",
    personalShoppingTitle: "Servicio de Compras Personales",
    personalShoppingDescription: "¿No puedes encontrar lo que buscas? ¡Nuestros compradores personales lo encontrarán por ti!",
    packageConsolidationTitle: "Consolidación de Paquetes",
    packageConsolidationDescription: "Ahorra dinero combinando múltiples pedidos en un solo envío",
    fastShippingTitle: "Envío Rápido y Seguro",
    fastShippingDescription: "Múltiples opciones de envío para satisfacer tus necesidades y presupuesto",
    expertKnowledge: "Conocimiento experto de tiendas japonesas",
    accessExclusive: "Acceso a artículos exclusivos",
    negotiation: "Negociación por los mejores precios",
    reducedCosts: "Costos de envío reducidos",
    freeStorage: "Almacenamiento gratuito unlimited",
    professionalPackaging: "Empaquetado profesional",
    expressShipping: "Envío express disponible",
    insuranceCoverage: "Cobertura de seguro completa",
    realTimeTracking: "Seguimiento en tiempo real",
    whatCanWeShop: "¿Qué Podemos Comprar Para Ti?",
    whatCanWeShopSubtitle: "Desde artículos cotidianos hasta coleccionables raros: ¡podemos encontrarlo todo!",
    animeCategory: "Anime y Manga",
    fashionCategory: "Moda y Belleza",
    electronicsCategory: "Electrónicos",
    traditionalCategory: "Artículos Tradicionales",
    figures: "Figuras",
    collectibles: "Coleccionables",
    limitedEditions: "Ediciones Limitadas",
    doujinshi: "Doujinshi",
    clothing: "Ropa",
    cosmetics: "Cosméticos",
    accessories: "Accesorios",
    shoes: "Zapatos",
    gaming: "Gaming",
    gadgets: "Gadgets",
    audio: "Audio",
    cameras: "Cámaras",
    crafts: "Artesanías",
    tea: "Té",
    snacks: "Snacks",
    souvenirs: "Recuerdos",
    // Simulator
    quotationSimulator: "Simulador de Cotización",
    productCost: "Costo del Producto (¥)",
    destination: "País de Destino",
    calculate: "Calcular",
    serviceFee: "Tarifa de Servicio",
    handlingFee: "Tarifa de Manejo (10%)",
    viewBenefits: "Ver Beneficios",
    handlingFeeBenefitConsolidation: "Consolidación de paquetes",
    handlingFeeBenefitStorage: "Almacenamiento ilimitado gratis",
    handlingFeeBenefitPhotos: "Fotos del producto (si se solicita)",
    handlingFeeBenefitPackaging: "Empaque estándar o doble",
    handlingFeeBenefitSupport: "Soporte privado para tus pedidos",
    noHiddenFees: "Sin tarifas ocultas o adicionales después de la compra",
    estimatedShipping: "Envío Estimado",
    total: "Estimación Total",
    // Store Categories
    animeStores: "Anime y Manga",
    fashionStores: "Moda",
    electronicsStores: "Electrónicos",
    // CTA Section
    ctaTitle: "¿Listo para empezar a comprar?",
    ctaDescription: "Comienza por enviarnos tus enlaces URL de tus compras o una imagen clara a una de nuestras redes sociales.",
    makeOrder: "Realizar Pedido",
    // Detailed How It Works
    howItWorksDetailedTitle: "Así funciona Aiyu Japan",
    howItWorksDetailedDescription1: "Trae una parte de Japón 1 tu hogar con Aiyu japan. Te ayudamos a comprar en múltiples tiendas y enviar los artículos juntos, ahorrando en costos. Rápido, seguro y sencillo—Aiyu Japan es tu compañero de compras japonés definitivo.",
    howItWorksDetailedDescription2: "¿Quieres saber más? Lee nuestra guía para nuevos usuarios para aprender todo lo que necesitas saber para comenzar a comprar en Neokyo.",
    newUserLinkBtn: "Guía para nuevos usuarios",
    step1DetailedTitle: "Paso 1  Encuentra tu producto",
    step1DetailedDescription: "Ve a tu tienda japonesa favorita (como Uniqlo, Pokémon Center, Animate o Amazon Japan). Cuando encuentres algo que quieras, copia el enlace (URL) de la página del producto. Ejemplo: https://example.com/product123",
    step2DetailedTitle: "Paso 2 – Pega el enlace en nuestro formulario",
    step2DetailedDescription: "Ve a nuestra página de solicitud: 👉 https://alpha.aiyujapan.com. Verás un formulario llamado “Enviar Solicitud de Producto”. Pega el enlace de tu producto allí — ¡así sabremos exactamente qué comprar para ti!",
    step3DetailedTitle: "Paso 3 – Agrega la cantidad",
    step3DetailedDescription: "En la siguiente casilla, escribe cuántas unidades deseas (por ejemplo: 1, 2 o 3).",
    step4DetailedTitle: "Paso 4 – Agrega un nombre o etiqueta (opcional)",
    step4DetailedDescription: "Puedes darle a tu pedido un nombre corto — por ejemplo: “Figura de Pikachu” o “Camiseta de One Piece”. Esto te ayudará a identificarlo más tarde dentro de tu panel.",
    step5DetailedTitle: "Paso 5 – Escribe una nota (opcional)",
    step5DetailedDescription: "Si tienes detalles especiales, como una talla, color o comentario, escríbelo aquí. Ejemplo: “Talla M, color azul, por favor elegir solo de tienda oficial”.",
    step6DetailedTitle: "Paso 6 – Agrega más productos",
    step6DetailedDescription: "¿Quieres más artículos? Simplemente haz clic en “Agregar otro producto”. Puedes agregar tantos enlaces como desees — cada uno formará parte de tu pedido.",
    step7DetailedTitle: "Paso 7 – Envía tu solicitud",
    step7DetailedDescription: "Cuando estés listo, haz clic en “Enviar solicitud”. Nuestro equipo revisará tus productos, confirmará la disponibilidad y te enviará un enlace de pago. ¡Una vez completado el pago, compraremos todo para ti!",
    // Why Choose Section
    whyChooseTitle: "¿Por qué elegir a Aiyu Japan?",
    whyChooseSubtitle: "Esto es lo que nos convierte en la mejor opción para tus compras japonesas.",
    reason1Title: "COMPRA TODO TODO LO QUE QUIERAS DE JAPON",
    reason1Description: "No solo puedes comprar lo que quieras de Japon, sino tambien trabajamos con reservas de productos imitados!",
    reason2Title: "LA MEJOR TARIFA DEL MERCADO",
    reason2Description: "Solo 500 yenes (3.5$) por item. ¡Tarifas competitivas que se ajustan a tu bolsillo!",
    reason3Title: "CONSOLIDACIONES GRATIS",
    reason3Description: "¿Compraste en diferentes tiendas? ¡Nosotros consolidamos todos tus pedidos sin costo adicional!",
    reason4Title: "ENVIOS A TODO EL MUNDO",
    reason4Description: "Desde Japón directo a tu puerta. Llegamos a Europa, Norte America y la gran mayoria de Sur America!",
    //Recommended stores section
    recommendedStoresTitle: "Tiendas Recomendadas",
    recommendedStoresDescription: "Compra de las tiendas más populares de Japón y de vendedores individuales.",
    // Hero Section Buttons
    makeOrderButton: "Realizar Pedido",
    whereToShop: "Donde Comprar",
    seeJapaneseStores: "Ver Tiendas Japonesas",
    calculateEstimatedCost: "Calcular Costo Estimado",
    // Additional Services Section
    additionalServicesTitle: "ADEMAS CONTAMOS CON",
    additionalServicesSubtitle: "Servicios adicionales para mejorar aún más tu experiencia de compra.",
    customerServiceTitle: "Atencion Al Cliente",
    customerServiceDescription: "Te atendemos a todas horas personalmente a traves del correo electronico, Instagram y Facebook.",
    securityTitle: "Seguridad Y Confianza",
    securityDescription: "Todos nuestros pagos son atraves de plataformas confiables, nuestros socios son empresas reconocidas a nivel nacional.",
    webServiceTitle: "Servicio Web",
    webServiceDescription: "El sitio web está diseñado para darte un 100% de comprensión de nuestros servicios, y está abierto 24/7 para consultas.",
    // Footer
    footerMenu: "Menu",
    whereToShopMenu: "Donde Comprar",
    calculatorBeta: "Calculadoras",
    servicesFooter: "Servicios",
    contactFooter: "Contacto",
    legal: "Legal",
    termsOfService: "Términos de Servicio",
    privacyPolicy: "Política de Privacidad",
    contactLabel: "CONTACTO",
    taxIdFooter: "ID Registro Tributario:",
    footerCopyright: "© 2025 ＳＥＲＲＵＤＯ合同会社 Todos los derechos reservados.",
    // Pricing Info Section
    transparentPricing: "Precios Transparentes",
    serviceFeePerItem: "Tarifa de Servicio por Artículo",
    taxOnItemCost: "Impuesto sobre el Costo del Artículo",
    internationalShipping: "Envío Internacional",
    variable: "Variable",
    noHiddenFeesTransparent: "Sin tarifas ocultas, sin sorpresas. Recibe una cotización detallada antes de realizar cualquier compra.",
    // Calculator Page
    calculatorBetaPage: "Simulador de costos",
    calculatorDisclaimer: "Estos precios son solamente aproximaciones, el precio real podria variar un poco.",
    // Purchase Calculator
    purchaseCalculator: "Calculadora de cotizacion",
    enterPriceInYen: "Ingresa el costo individual del articulo en Yenes japoneses",
    quotedPrice: "Precio cotizado",
    serviceFeeLabel: "Tarifa de servicio",
    enterPriceToCalculate: "¡Recuerda que la cotización es por cada articulo de compra!",
    // Shipping Calculator
    shippingCalculator: "Calculadora de envio internacional",
    selectRegion: "Seleccionar una región",
    region: "Región",
    shippingMethods: "Metodos de Envios",
    chooseShippingMethod: "Escoge uno de los metodos de envios.",
    economicShipping: "Envio Economico/standard (15-21 dias - Small Packet)",
    expressShippingMethod: "Envio Express (4-10 dias habiles - Express mail service)",
    dhlShipping: "Envío DHL Express (2-5 días hábiles)",
    selectWeight: "Selecciona el peso:",
    internationalShippingCost: "Precio de Envio Internacional",
    enterDataToCalculate: "¡Introduzca los datos para realizar el cálculo!",
    dimensionsLabel: "Dimensiones del Paquete (Opcional)",
    lengthLabel: "Largo (cm)",
    widthLabel: "Ancho (cm)",
    heightLabel: "Alto (cm)",
    // Store Guide Page
    storeGuideTitle: "Tiendas Japonesas Recomendadas",
    storeGuideDescription: "Recuerda enviarnos los enlaces de tus productos a nuestro Instagram - Facebook - o Whatsapp!",
    selectCategory: "Selecciona una categoría",
    allCategories: "Todas las categorías",
    generalMarketplace: "Marketplace General",
    animeMangaMerchandising: "Anime, Manga y Merchandising",
    fashionAccessories: "Ropa y Accesorios",
    householdDecoration: "Artículos para el Hogar y Decoración",
    beautyCosmetics: "Belleza y Cosméticos",
    figuresCollectibles: "Figuras y Juguetes de Colección",
    // Store names and descriptions
    amazonJapan: "Amazon Japón",
    amazonJapanDesc: "Una de las tiendas online Japonesas más famosas y confiables de todos.",
    rakuten: "Rakuten",
    rakutenDesc: "Una tienda conocida nacionalmente que se conoce por su variedad y precio.",
    yahooShopping: "Yahoo Shopping (PayPay Flea Market)",
    yahooShoppingDesc: "Tienda de ventas en general, similar a Amazon y Mercari.",
    mercariJapan: "Mercari Japón",
    mercariJapanDesc: "Tienda más grande de segunda mano. ¿Buscas una figura usada pero como nueva? Es aquí.",
    buyma: "Buyma",
    buymaDesc: "Marketplace japonés para ropa y artículos de marca exclusivos.",
    surugaya: "Surugaya",
    surugayaDesc: "Una de las tiendas más variadas y con los precios más baratos de artículos de anime.",
    mandarake: "Mandarake",
    mandarakeDesc: "La tienda perfecta para coleccionistas de manga, figuras y artículos retro.",
    animate: "Animate",
    animateDesc: "Una de las empresas de ventas de productos de anime más grandes de todas.",
    jumpShop: "Jump Shop",
    jumpShopDesc: "Artículos de One Piece, Haikyuu, Dragon Ball... ¿Ya conoces esta tienda?",
    chiikawaStore: "Chiikawa store",
    chiikawaStoreDesc: "Tienda oficial de Chiikawa con mercancía exclusiva y adorable.",
    cdJapan: "CD Japan",
    cdJapanDesc: "Japanese anime - J-pop groups - Kpop etc.",
    evangelionStore: "Evangelion Store",
    evangelionStoreDesc: "Tienda oficial de Evangelion con artículos exclusivos no disponibles en otras tiendas.",
    pokemonCenter: "Pokemon Center",
    pokemonCenterDesc: "Tienda oficial para todo tipo de productos de Pokémon, incluyendo peluches, ropa y juegos.",
    sailorMoonStore: "Sailor Moon Store",
    sailorMoonStoreDesc: "Encuentra productos exclusivos de Sailor Moon, desde figuras hasta artículos de colección.",
    sanrioStore: "Sanrio Store",
    sanrioStoreDesc: "Tienda oficial de Sanrio con productos adorables de Hello Kitty y otros personajes.",
    studioGhibliStore: "Studio Ghibli Store (Donguri Sora)",
    studioGhibliStoreDesc: "Tienda donde encontrarás productos exclusivos de las películas de Studio Ghibli.",
    usjStore: "Universal Studios Japan Store",
    usjStoreDesc: "Tienda oficial de Universal Studios Japan con productos exclusivos del parque.",
    disneyStore: "Disney Store",
    disneyStoreDesc: "Tienda oficial de Disney Japón con productos adorables y exclusivos.",
    mediaWorld: "Media World",
    mediaWorldDesc: "Especializada en figuras y mercancía de tus animes favoritos en segunda mano.",
    banpresto: "BANPRESTO",
    banprestoDesc: "Una de las mejores tiendas donde comprar tus figuras de anime.",
    popMart: "POP MART",
    popMartDesc: "La tienda de los Labubu, Crying Babies y más.",
    sylvanianFamilies: "Sylvanian Families",
    sylvanianFamiliesDesc: "Tienda oficial de los famosos ternurines, Sylvanian Family Store.",
    amiAmi: "AmiAmi",
    amiAmiDesc: "Una de las tiendas más populares de figuras y mercancía de anime. Amplia variedad de productos nuevos y en preventa.",
    goodSmileOnline: "Good Smile Online",
    goodSmileOnlineDesc: "Tienda oficial de Good Smile Company. Encuentra figuras Nendoroid, Figma y coleccionables exclusivos directamente del fabricante.",
    uniqlo: "UNIQLO",
    uniqloDesc: "Ropa cómoda y de calidad para toda la familia, con diseños simples y modernos.",
    gu: "GU",
    guDesc: "Moda asequible y a la moda, inspirada en las últimas tendencias de Japón.",
    zozotown: "ZOZOTOWN",
    zozotownDesc: "La tienda de moda online más grande de Japón con las mejores marcas.",
    graniph: "Graniph",
    graniphDesc: "Aquí encontrarás increíbles colaboraciones con series y animes.",
    weverseShop: "Weverse Shop Japan",
    weverseShopDesc: "Tienda oficial de productos K-pop en Japón.",
    btsOfficialShop: "BTS Official Shop Japan",
    btsOfficialShopDesc: "La tienda japonesa de una de las bandas más famosas del mundo.",
    newEra: "New Era",
    newEraDesc: "Gorras y accesorios de moda urbana de la marca New Era.",
    onitsukaTiger: "Onitsuka Tiger",
    onitsukaTigerDesc: "Zapatillas japonesas de moda con estilo retro y moderno.",
    crocsJapan: "Crocs Japan",
    crocsJapanDesc: "Tienda oficial japonesa de Crocs con nuevos modelos y colores.",
    humanMadeJapan: "Human Made Japan",
    humanMadeJapanDesc: "Ropa y accesorios de diseño creados por NIGO® y la marca Human Made.",
    adidasJapan: "Adidas Japan",
    adidasJapanDesc: "Tienda oficial de Adidas Japón con lanzamientos exclusivos.",
    nikeJapan: "Nike Japan",
    nikeJapanDesc: "Lo último en zapatillas, ropa y equipo deportivo de Nike en Japón.",
    stripeClub: "Stripe Club",
    stripeClubDesc: "Moda japonesa femenina con marcas como Earth, Music & Ecology.",
    daisoJapan: "Daiso Japón",
    daisoJapanDesc: "¿Tienda de 1 dólar? También lo tenemos.",
    nitori: "NITORI",
    nitoriDesc: "Una de las tiendas más grandes de Japón para comprar cosas para el hogar.",
    loft: "LOFT",
    loftDesc: "Tienda de productos de papelería, decoración y artículos para el hogar.",
    palCloset: "PAL CLOSET",
    palClosetDesc: "Una tienda donde encontrar cosas para la casa y ropa.",
    yodobashiCamera: "Yodobashi Camera",
    yodobashiCameraDesc: "Electrodomésticos, gadgets y artículos de hobby al mejor precio.",
    mujiJapan: "MUJI Japón",
    mujiJapanDesc: "Minimalismo japonés en su máxima expresión. Desde muebles y artículos del hogar hasta papelería, ropa y snacks.",
    oliveYoungGlobal: "Olive Young Global",
    oliveYoungGlobalDesc: "Tienda líder de cosmética coreana con envío global. Productos populares de skincare, maquillaje y cuidado personal.",
    cosmeCom: "Cosme.com",
    cosmeComDesc: "Una de las plataformas más confiables en Japón para comprar maquillaje y cosméticos de marcas japonesas premiadas.",
    // Shipping calculator regions
    asia: "Asia",
    europeCanadaMexico: "Europa, México y Canadá",
    usa: "EEUU",
    centralSouthAmerica: "Centro y Sur América",
    // Contact Page
    contactDescription1: "Si necesita alguna ayuda o quisiera hacer una consulta no dude en contactarnos!",
    contactDescription2: "El staff de Aiyu esta para servirle las 24 horas. A continuacion dejamos informacion de las formas de contacto:",
    ourStaff: "Nuestro Personal",
    staffRole1: "Content Creation Staff, English Market Manager",
    staffRole2: "Content Creation Leader",
    yourInquiryNotBother: "Su consulta no es molestia!",
    getInTouch: "Get in Touch",
    contactFormName: "Name",
    contactFormEmail: "E-mail",
    contactFormSubject: "Subject",
    contactFormMessage: "Message",
    contactFormSend: "Send",
    subjectGeneral: "General Inquiry",
    subjectOrder: "Order Support",
    subjectShipping: "Shipping Question",
    subjectProduct: "Product Information",
    subjectOther: "Other",
    // Social Media Section
    customerReviews: "Opiniones de los clientes",
    instagramFeed: "Instagram Feed",
    // FAQ
    faqTitle: "Preguntas frecuentes",
    faq1Question: "Tarifa de servicio por artículo",
    faq1Answer: "La tarifa es de ¥500 (aprox. 3 USD) por artículo, más un 10 % de tax sobre el valor total del producto. Incluye: búsqueda, consolidación, empaquetado y almacenamiento gratuito.",
    faq2Question: "¿Cómo se realizan los pagos?",
    faq2Answer: "Emitimos un recibo electrónico vía PayPal. No necesitas cuenta de PayPal: solo tarjeta de crédito o débito.",
    faq3Question: "¿Cuál es el primer pago y el pago final?",
    faq3Answer: "• Primer pago: cubre el costo de los productos que elijas.\n• Si agregas más artículos, emitiremos un nuevo recibo.\n• Pago final: corresponde al envío internacional tras consolidar y pesar tus compras.",
    faq4Question: "¿Cuánto tarda el envío?",
    faq4Answer: "• Envío económico a Latinoamérica, EE. UU. y Europa: 2–3 semanas.\n• Envío económico a Asia: 1 semana.\n• Envío exprés (opcional): 1–2 semanas.",
    faq5Question: "¿Tienen tienda física fuera de Japón?",
    faq5Answer: "Aiyu Japan está en Osaka, Japón, y no contamos con sucursales en otros países.",
    faq6Question: "Métodos de pago aceptados",
    faq6Answer: "• Tarjetas de crédito y débito\n• Saldo de PayPal\n• Próximamente: transferencia bancaria, Wise, etc.",
    faq7Question: "Cobertura de envíos",
    faq7Answer: "• Directo: México, Chile, Perú, El Salvador, Costa Rica, España y Argentina.\n• Courier (vía EE. UU.): Paraguay, Ecuador, Bolivia y Colombia.\n• Europa, Oceanía y resto de Asia: entregas directas sin intermediarios.",
    faq8Question: "¿Qué pasa si mi paquete se pierde o no llega?",
    faq8Answer: "Aiyu Japan y Japan Post investigarán el caso. Si se confirma pérdida, reembolsaremos el 50 % del valor total del producto.",
    faq9Question: "¿Debo pagar aranceles al recibir el paquete?",
    faq9Answer: "Puede que debas abonar aranceles si el valor excede el límite permitido en tu país. Aiyu Japan no tiene jurisdicción sobre esto; es responsabilidad del cliente. Para más detalles, contáctanos por email o SNS.",
    // Common
    language: "Idioma",
    currency: "Moneda",
    logout: "Cerrar Sesión",
    welcome: "Bienvenido",
    // User Dashboard Navigation
    submitRequest: "Enviar Links",
    orders: "Pedidos",
    storage: "Almacenamiento",
    shipping: "Envíos",
    profile: "Cuenta",
    notifications: "Notificaciones",
    // Product Request Form
    productRequestTitle: "Enviar Solicitud de Producto",
    productRequestSubtitle: "Añade los productos que quieres que compremos para ti",
    productUrl: "URL del Producto",
    productUrlPlaceholder: "https://ejemplo.com/producto",
    productName: "Nombre del Producto (Opcional)",
    productNamePlaceholder: "Nombre del Producto (Opcional)",
    quantity: "Cantidad",
    productNotes: "Notas (Opcional)",
    productNotesPlaceholder: "Talla, color, instrucciones especiales... (Opcional)",
    addProduct: "Añadir Otro Producto",
    removeProduct: "Eliminar",
    submitRequestButton: "Enviar Solicitud",
    submitting: "Enviando...",
    atLeastOneProduct: "Por favor añade al menos una URL de producto",
    requestSubmittedSuccess: "Solicitud de producto enviada con éxito",
    requestSubmittedError: "Error al enviar solicitud de producto",
    // Orders Page
    currentOrders: "Pedidos Actuales",
    filterOrders: "Filtrar Pedidos",
    statusFilter: "Estado:",
    showPerPage: "Mostrar:",
    perPage: "por página",
    hideRejected: "Ocultar rechazados",
    update: "Actualizar",
    refreshing: "Actualizando...",
    showingOrders: "Mostrando",
    ofOrders: "de",
    ordersText: "pedidos",
    noActiveOrders: "No se encontraron pedidos activos",
    noActiveOrdersDescription: "¡Envía una solicitud de producto para empezar!",
    allStatuses: "Todos los Estados",
    statusRequested: "Solicitado",
    statusAwaitingPayment: "Esperando Pago",
    statusPaid: "Pagado",
    statusSomePurchased: "Algunos Comprados",
    statusAllPurchased: "Todos Comprados",
    statusInTransit: "En Tránsito",
    statusAllAtWarehouse: "Todos en Almacén",
    statusRejected: "Rechazado",
    shippingQuoteSent: "Cotización de envío enviada",
    shippingPaid: "Envío pagado",
    statusShipped: "Enviado",
    statusDelivered: "Entregado",
    orderNumber: "Pedido #",
    createdOn: "Creado el",
    products: "Productos",
    orderRejectionReason: "Motivo de Rechazo del Pedido",
    orderRejectReasons: "Revisa el motivo y edita tu pedido si es necesario",
    productIssues: "Problemas del Producto",
    quoteInformation: "Información de Cotización",
    quotePrice: "Precio de Cotización",
    payNow: "Pagar Ahora",
    editOrder: "Editar Pedido",
    goToStorage: "Ir al Almacén",
    trackingInformation: "Información de Seguimiento",
    trackingNumber: "Número de Seguimiento:",
    shippedOn: "Enviado el:",
    viewProduct: "Ver Producto",
    noQuoteYet: "Aún no hay cotización disponible",
    ordersUpdatedSuccess: "Pedidos actualizados con éxito",
    ordersUpdateError: "Error al actualizar pedidos",
    noOrdersWithFilter: "No se encontraron pedidos con este filtro",
    tryDifferentFilter: "Intenta seleccionar un filtro de estado diferente.",
    loadingOrders: "Cargando pedidos...",
    previous: "Anterior",
    next: "Siguiente",
    orderRejected: "Pedido Rechazado",
    quoteIssued: "Se ha emitido una cotización para este pedido",
    normalDeliveryInfo: "Los pedidos normales pueden tardar de 3 a 5 días en llegar a nuestro almacén",
    paymentReceivedInfo: "Pago recibido. Procederemos ahora a comprar o reservar tus artículos",
    paymentConfirmationNotice1: "La confirmación del pago puede tardar desde unos minutos hasta varias horas (durante el horario laboral).",
    paymentConfirmationNotice2: "Por favor, espera pacientemente después de realizar el pago.",
    success: "Éxito",
    error: "Error",
    statusStepRequestSubmitted: "Solicitud enviada",
    statusStepPaymentConfirmed: "Pago confirmado",
    statusStepItemsBeingPurchased: "Artículo(s) en proceso de compra",
    statusStepItemsPurchased: "Artículos comprados",
    statusStepItemsOnTheWay: "Artículo(s) en camino al almacén",
    statusStepAllAtWarehouse: "Todos los artículos en el almacén",
    // Storage Page
    warehouseStorage: "Almacenamiento en Bodega",
    selectItemsToShip: "Selecciona artículos para solicitar una cotización de envío",
    availableItems: "Artículos Disponibles",
    itemName: "Nombre del Artículo",
    weight: "Peso",
    orderNumberShort: "Pedido #",
    arrived: "Llegó",
    awaitingWeighing: "Esperando pesaje",
    itemsSelected: "artículos seleccionados",
    itemSelected: "artículo seleccionado",
    itemLabel: "artículo",
    itemsLabel: "artículos",
    totalWeight: "Peso total",
    requestShippingQuote: "Solicitar Cotización de Envío",
    noItemsAtWarehouse: "No hay artículos en el almacén",
    noItemsDescription: "Los artículos aparecerán aquí una vez que lleguen a nuestro almacén.",
    shippingQuotesRequested: "Cotizaciones de Envío Solicitadas",
    shipmentNumber: "Envío #",
    viewInShipping: "Ver en Envíos",
    storageAlertTitle: "Información de Almacenamiento",
    storageAlert1: "Los artículos se almacenan de forma segura en nuestro almacén",
    storageAlert2: "Puedes consolidar varios artículos en un solo envío",
    storageAlert3: "No hay límite de tiempo para almacenar los artículos",
    addressService: "Servicio de dirección japonesa – Sin consolidación",
    // Shipping Page
    shippingTitle: "Envíos",
    filterShipments: "Filtrar Envíos",
    statusAwaitingQuote: "Esperando Cotización",
    statusQuoted: "Esperando Pago",
    statusPaymentReceived: "Pago Recibido",
    shippingRequestsAwaitingQuote: "Solicitudes de Envío Esperando Cotización",
    awaitingQuoteDescription: "Estas solicitudes están siendo revisadas por nuestro equipo. Recibirás una cotización pronto.",
    shippingQuotes: "Cotizaciones de Envío",
    quotesDescription: "Revisa y paga tus cotizaciones de envío a continuación",
    shippedOrders: "Pedidos Enviados",
    shippedOrdersDescription: "Rastrea tus paquetes enviados",
    destinationLabel: "Destino:",
    shippingMethodLabel: "Método de Envío:",
    estimatedCost: "Costo Estimado:",
    actualCost: "Costo Real:",
    shippingAddress: "Dirección de Envío:",
    trackShipment: "Rastrear Envío",
    payShippingQuote: "Pagar Cotización de Envío",
    rejectionReason: "Motivo de Rechazo:",
    rejectedItems: "Artículos Rechazados:",
    shipmentItems: "Artículos del Envío",
    noShipmentsYet: "Aún no hay envíos",
    noShipmentsDescription: "Tus cotizaciones de envío y pedidos enviados aparecerán aquí.",
    noShipmentsWithFilter: "No se encontraron envíos con este filtro",
    shippingDataUpdated: "Datos de envío actualizados con éxito",
    shippingDataUpdateError: "Error al actualizar datos de envío",
    showingShipments: "Mostrando",
    ofShipments: "de",
    shipmentsText: "envíos",
    loadingShipments: "Cargando envíos...",
    noShipments: "Aún no hay envíos",
    noShipmentsFiltered: "No se encontraron envíos con este filtro",
    awaitingQuoteTitle: "Solicitudes de envío en espera de cotización",
    shipmentsTitle: "Envíos",
    shipmentsDescription: "Cotizaciones que han sido enviadas y están en diferentes etapas de procesamiento.",
    shippedOrdersTitle: "Pedidos enviados",
    statusAwaitingQuoteBadge: "Esperando cotización",
    statusAwaitingPaymentBadge: "Esperando pago",
    statusPaymentReceivedBadge: "Pago recibido",
    statusShippedBadge: "Enviado",
    statusRejectedBadge: "Rechazado",
    rejectionReasonTitle: "Motivo del rechazo",
    paymentLinkAvailable: "Enlace de pago disponible",
    clickToPay: "Haz clic abajo para proceder con el pago",
    paymentConfirmed: "Pago confirmado",
    viewInvoice: "Ver factura",
    shipmentTracking: "Seguimiento del envío",
    shipmentTrackingInfo: "Tu paquete está en camino",
    trackPackage: "Rastrear paquete",
    finalQuote: "Cotización final",
    itemsInShipment: "Artículos en este envío:",
    items: "Artículos:",
    unnamedProduct: "Producto sin nombre",
    issuePrefix: "Problema:",
    addressName: "Nombre:",
    addressPhone: "Teléfono:",
    address: "Dirección:",
    addressNotes: "Notas:",
    cityState: "Ciudad / Estado:",
    postalCode: "Código postal:",
    country: "País:",
    shippingDataLoadError: "Error al cargar datos de envío",
    selectStatus: "Selecciona un filtro de estado",
    processing: "Procesando",
    inTransit: "En tránsito",
    delivered: "Entregado",
    trackPackageButton: "Rastrear paquete",
    requestedOn: "Solicitado el",
    shippingPaymentReceived: "Tu pago de envío ha sido recibido.",
    // Profile Page
    editProfileInformation: "Editar Información del Perfil",
    profileInformation: "Información del Perfil",
    editProfile: "Editar Perfil",
    saveChanges: "Guardar Cambios",
    cancel: "Cancelar",
    fullNameLabel: "Nombre",
    emailLabel: "Correo Electrónico",
    phoneNumberLabel: "Número de Teléfono",
    countryLabel: "País",
    postalCodeLabel: "Código Postal",
    deliveryAddress: "Dirección de Entrega",
    deliveryNotes: "Notas de Entrega (Opcional)",
    notProvided: "No proporcionado",
    selectCountryPlaceholder: "Selecciona tu país",
    statePlaceholder: "Selecciona tu estado",
    cityPlaceholder: "Selecciona tu ciudad",
    saving: "Guardando...",
    savingChanges: "Guardando...",
    savingError: "Error al actualizar el perfil",
    savingSuccess: "Tu perfil ha sido actualizado con éxito",
    fillAllRequired: "Por favor completa todos los campos requeridos",
    mustBeLoggedIn: "Debes iniciar sesión para actualizar tu perfil",
    errorLoadingProfile: "Error al cargar datos del perfil",
    editProfileButton: "Editar Perfil",
    cancelButton: "Cancelar",
    saveButton: "Guardar Cambios",
    userIdLabel: "ID de Usuario",
    cityLabel: "Ciudad",
    stateLabel: "Estado / Provincia",
    // Japanese Address
    japaneseAddresstitle: "Dirección Japonesa",
    japaneseAddressuserCodeNote: "*Este es tu código personal de Aiyu Japan",
    japaneseAddresstoggleJapanese: "Japonés",
    japaneseAddresstoggleRomaji: "Rōmaji",
    japaneseAddresslabelsname: "Nombre",
    japaneseAddresslabelsprefectureCity: "Prefectura, Ciudad",
    japaneseAddresslabelsstreet: "Calle",
    japaneseAddresslabelsbuilding: "Edificio",
    japaneseAddresslabelspostalCode: "Código postal",
    japaneseAddresslabelsphone: "Número de teléfono",
    japaneseAddressexplanation: "¡Esta es tu dirección japonesa! Cada ítem recibido tiene un cargo de 500 yenes (~$3 USD) e incluye hasta 30 días de almacenamiento gratuito.",
    japaneseAddresswarningsTitle: "⚠️ Advertencias:",
    japaneseAddresswarnings0: "Por favor, asegúrate de copiar toda la dirección correctamente. No nos hacemos responsables por paquetes mal dirigidos o entregados de forma incorrecta.",
    japaneseAddresswarnings1: "Este servicio de dirección japonesa es diferente al servicio de compras de Aiyu Japan. No incluye beneficios como fotografías del producto, consolidación o reempaquetado.",
    japaneseAddresswarnings2: "Los paquetes serán reenviados exactamente en el estado en el que sean recibidos.",
    japaneseAddresstoastCopied: "¡Copiado!",
    japaneseAddressrulesTitle: "⚠️ Servicio de Dirección en Japón — Importante",
    japaneseAddressrulesIntro: "NO podemos:",
    japaneseAddressrules0: "Aceptar verificaciones por SMS o llamadas",
    japaneseAddressrules1: "Ayudar si tu tarjeta es rechazada o el pago no funciona",
    japaneseAddressrules2: "Ingresar la dirección por ti si la tienda no acepta tu código AJxxxx",
    japaneseAddressrules3: "Realizar verificación de identidad o contactar a la tienda por ti",
    japaneseAddressrulesBottom: "👉 Si necesitas cualquiera de esas cosas: Debes usar el servicio de Shopping Agent de Aiyu Japan.",
    // Edit Order Page
    editRejectedOrder: "Editar Pedido Rechazado",
    orderRejectionReasonTitle: "Motivo de Rechazo del Pedido",
    productsInOrder: "Productos en el Pedido",
    editOrderDescription: "Edita los productos a continuación para corregir cualquier problema. Los productos marcados con problemas deben revisarse cuidadosamente.",
    productIssue: "Problema del Producto",
    addNewProduct: "Añadir Nuevo Producto",
    newProductBadge: "Nuevo Producto",
    willBeRemoved: "Será eliminado",
    restore: "Restaurar",
    remove: "Eliminar",
    resubmitOrder: "Reenviar Pedido",
    resubmitting: "Reenviando...",
    orderNotFound: "Pedido no encontrado",
    loadingOrderDetails: "Cargando detalles del pedido...",
    atLeastOneProductError: "Debes tener al menos un producto en el pedido.",
    allProductsUrlError: "Todos los productos deben tener una URL.",
    orderResubmittedSuccess: "Tu pedido ha sido reenviado para procesamiento.",
    orderResubmitError: "Error al reenviar pedido. Por favor intenta de nuevo.",
    requested: "Tu solicitud de producto ha sido enviada y está a la espera de una cotización.",
    quoted: "Se ha emitido una cotización. Por favor, revísala y realiza el pago para continuar.",
    paid: "Pago recibido. Ahora procederemos a comprar tus artículos.",
    purchased: "Los artículos han sido comprados y están en camino al almacén.",
    all_received: "Todos los artículos de este pedido han llegado a nuestro almacén.",
    partial_received: "Algunos artículos han llegado. Otros aún están en tránsito.",
    rejected: "Este pedido fue rechazado. Por favor, revisa el motivo.",
    // Shipping Quote Dialog
    requestShippingQuoteTitle: "Solicitar Cotización de Envío",
    shippingQuoteDescription: "Selecciona tu país y método para calcular el costo estimado de envío.",
    selectedItems: "Artículos Seleccionados",
    shippingCountry: "País de Envío",
    zone: "Zona",
    shippingMethod: "Método de Envío",
    economicShippingLabel: "Envío Económico/Estándar (15-21 días - Small Packet)",
    expressShippingLabel: "Envío Exprés (4-10 días hábiles - Express mail service)",
    paraguayShippingLabel: "Envío a Paraguay",
    estimatedInternationalShipping: "Costo Estimado de Envío Internacional",
    shippingAddressLabel: "Dirección de Envío",
    addressLabel: "Dirección",
    addressNotesLabel: "Notas de Dirección (Opcional)",
    requestQuote: "Solicitar Cotización",
    requestingQuote: "Enviando...",
    missingAddressInfo: "Por favor completa todos los campos de dirección requeridos",
    shippingQuoteRequestedSuccess: "Tu solicitud de cotización de envío ha sido enviada con éxito. Te contactaremos pronto con la cotización final.",
    shippingQuoteRequestError: "Error al enviar solicitud de cotización de envío. Por favor intenta de nuevo.",
    // Notifications Page
    notificationsTitle: "Notificaciones",
    markAllAsRead: "Marcar todas como leídas",
    filters: "Filtros",
    statusLabel: "Estado",
    categoryLabel: "Categoría",
    timeLabel: "Tiempo",
    allNotifications: "Todas las notificaciones",
    unreadOnly: "Solo no leídas",
    readOnly: "Solo leídas",
    allTypes: "Todos los tipos",
    ordersCategory: "Pedidos",
    shippingCategory: "Envíos",
    warehouseCategory: "Almacén",
    adminCategory: "Administrador",
    allTime: "Todo el tiempo",
    last7Days: "Últimos 7 días",
    last30Days: "Últimos 30 días",
    last90Days: "Últimos 90 días",
    clearFilters: "Limpiar filtros",
    showingNotifications: "Mostrando",
    noNotificationsYet: "Aún no hay notificaciones",
    noNotificationsFound: "No se encontraron notificaciones",
    clearFiltersToSee: "Limpia los filtros para ver todas las notificaciones",
    unread: "No leídas",
    clickToView: "Haz clic aquí para ver el pedido",
    clickToReview: "Haz clic aquí para revisar y reenviar",
    clickToViewWarehouse: "Haz clic aquí para ver el almacén",
    clickToViewShipment: "Haz clic aquí para ver el envío",
    clickToTrackShipment: "Haz clic aquí para rastrear el envío",
    clickToViewNewOrder: "Haz clic aquí para ver el nuevo pedido",
    clickToReviewResubmitted: "Haz clic aquí para revisar el pedido reenviado",
    clickToProcessShipping: "Haz clic aquí para procesar la solicitud de envío",
    allNotificationsRead: "Todas las notificaciones marcadas como leídas",
    markAsReadError: "Error al marcar notificación como leída",
    //Auth Page
    signIn: "Iniciar Sesión",
    signUp: "Registrarse",
    email: "Correo Electrónico",
    password: "Contraseña",
    confirmPassword: "Confirmar Contraseña",
    fullName: "Nombre",
    forgotPassword: "¿Olvidaste tu contraseña?",
    alreadyHaveAccount: "¿Ya tienes una cuenta?",
    dontHaveAccount: "¿No tienes una cuenta?",
    signInWithGoogle: "Iniciar sesión con Google",
    createYourAccount: "Crea tu cuenta",
    step: "Paso",
    back: "Atrás",
    completeSignUp: "Completar registro",
    signingIn: "Iniciando sesión...",
    creatingAccount: "Creando cuenta...",
    checkYourEmail: "Revisa tu correo electrónico",
    verificationEmailSent: "Hemos enviado un correo de verificación a",
    checkSpam: "¿No lo recibiste? Revisa tu carpeta de spam.",
    backToSignUp: "Volver al registro",
    includeCountryCode: "Incluye el código de país para números internacionales",
    forgotPasswordQuestion: "¿Olvidaste tu contraseña?",
    dontHaveAccountQuestion: "¿No tienes una cuenta?",
    alreadyHaveAccountQuestion: "¿Ya tienes una cuenta?",
    passwordsDoNotMatch: "Las contraseñas no coinciden",
    passwordTooShort: "La contraseña debe tener al menos 6 caracteres",
    fillRequiredFields: "Por favor completa todos los campos requeridos",
    enterPhoneNumber: "Por favor ingresa tu número de teléfono",
    invalidPhoneNumber: "Por favor ingresa un número de teléfono válido",
    fillAddressFields: "Por favor completa todos los campos de dirección requeridos",
    emailAlreadyRegistered: "Correo electrónico ya registrado",
    emailAlreadyRegisteredDesc: "Este correo ya está en uso. Inicia sesión o usa otro correo.",
    phoneAlreadyRegistered: "Número de teléfono ya registrado",
    phoneAlreadyRegisteredDesc: "Este número ya está en uso. Usa otro número.",
    signUpFailed: "Error en el registro",
    signUpFailedDesc: "Ocurrió un error durante el registro.",
    emailAlreadyExistsAlt: "Este correo ya está registrado. Inicia sesión en su lugar.",
    deliveryAddressPlaceholder: "Calle, apartamento, piso, etc.",
    deliveryNotesPlaceholder: "Instrucciones especiales de entrega, nombre del edificio, etc.",
    loginRequired: "Inicio de sesión requerido",
    pleaseSignInToAccess: "Por favor, inicia sesión para acceder a esta página.",
    adminAccessRequired: "Acceso de administrador requerido",
    defaultFallbackMessage: "No tienes permiso para acceder a esta página.",
    currentRole: "Rol actual",
    loading: "Cargando...",
    backToDashboard: "Volver al panel",
    // Forgot Password Page
    forgotPasswordTitle: "Olvidé mi contraseña",
    forgotPasswordSubtitle: "Introduce tu dirección de correo electrónico y te enviaremos un enlace para restablecer tu contraseña.",
    emailPlaceholder: "Introduce tu correo electrónico",
    sending: "Enviando...",
    sendResetLink: "Enviar enlace de restablecimiento",
    emailSentTo: "Hemos enviado un enlace para restablecer la contraseña a",
    didntReceive: "¿No recibiste el correo? Revisa tu carpeta de spam o inténtalo de nuevo.",
    backToSignIn: "Volver a Iniciar Sesión",
    //FAB dialogue
    requestProductsTitle: "Solicitar productos",
    requestProductsDescription: "Agrega los enlaces de los productos que deseas comprar desde Japón. Inicia sesión para enviar tu solicitud.",
    productDetails: "Detalles del producto",
    signInToSubmit: "Inicia sesión para enviar la solicitud",
    // Status flow steps
    requestSubmitted: "Solicitud Enviada",
    itemsBeingPurchased: "Artículo(s) siendo comprado(s)",
    itemsPurchased: "Artículos Comprados",
    itemsOnWay: "Artículo(s) en camino al almacén",
    allItemsAtWarehouse: "Todos los Artículos en el Almacén",
    requestSubmittedStatus: "Solicitud Enviada",
    awaitingPaymentStatus: "Esperando Pago",
    paymentReceivedStatus: "Pago Recibido",
    itemsShipped: "Artículos Enviados",
    // Blog
    blog1Title: "Envío aéreo desde Japón a Paraguay",
    blog2Title: "Cómo usar la calculadora de Aiyu Japan",
    blog3Title: "Presentación del personal de Aiyu Japón",
    blog4Title: "¿Dónde comprar con Aiyu Japan?",
    //News Blog
    featNewsTitle: "Noticias y Anuncios",
    featNewsAll: "Ver Todo",
    newsBlog1Title: "New 1",
    newsBlog2Title: "New 2",
    newsBlog3Title: "New 3",
    newsBlog4Title: "New 4"
  }
};
const AppContext = createContext(void 0);
const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("JPY");
  const t = (key) => {
    return translations[language][key] || key;
  };
  return /* @__PURE__ */ jsx(AppContext.Provider, { value: { language, setLanguage, currency, setCurrency, t }, children });
};
const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};
const FooterMenu = () => {
  const { t } = useApp();
  const menuItems = [
    { icon: MapPin, name: t("whereToShopMenu"), href: "/store-guide" },
    { icon: Calculator$1, name: t("calculatorBeta"), href: "/calculator" },
    { icon: Package, name: t("servicesFooter"), href: "/services" },
    { icon: Mail, name: t("contactFooter"), href: "/contact" }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "lg:col-span-1", children: [
    /* @__PURE__ */ jsx("h4", { className: "font-bold text-lg mb-4", children: t("footerMenu") }),
    /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: menuItems.map((item, index) => {
      const IconComponent = item.icon;
      return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
        "a",
        {
          href: item.href,
          className: "flex items-center space-x-2 text-primary/80 hover:text-capybara-orange transition-colors text-sm",
          children: [
            /* @__PURE__ */ jsx(IconComponent, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("span", { children: item.name })
          ]
        }
      ) }, index);
    }) })
  ] });
};
const FooterLegal = () => {
  const { t } = useApp();
  const legalItems = [
    { name: t("termsOfService"), href: "/terms-of-service" },
    { name: t("privacyPolicy"), href: "/privacy-policy" }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "lg:col-span-1", children: [
    /* @__PURE__ */ jsx("h4", { className: "font-bold text-lg mb-4", children: t("legal") }),
    /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: legalItems.map((item, index) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
      "a",
      {
        href: item.href,
        className: "text-primary/80 hover:text-capybara-orange transition-colors text-sm",
        children: item.name
      }
    ) }, index)) })
  ] });
};
const FooterContact = () => {
  const { t } = useApp();
  return /* @__PURE__ */ jsxs("div", { className: "lg:col-span-1", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4 mb-6", children: [
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "https://facebook.com/aiyujapan",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-capybara-orange hover:text-primary-foreground transition-colors",
          children: /* @__PURE__ */ jsx(Facebook, { className: "w-5 h-5" })
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "https://instagram.com/aiyu.japan",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-capybara-orange hover:text-primary-foreground transition-colors",
          children: /* @__PURE__ */ jsx(Instagram, { className: "w-5 h-5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold mb-1", children: t("contactLabel") }),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "mailto:info@aiyujapan.com",
          className: "text-primary/80 hover:text-capybara-orange transition-colors text-sm",
          children: "info@aiyujapan.com"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold mb-1", children: t("taxIdFooter") }),
      /* @__PURE__ */ jsx("div", { className: "flex space-x-4 text-primary/80 text-sm", children: /* @__PURE__ */ jsx("span", { children: "1120003030849" }) })
    ] })
  ] });
};
const FooterCopyright = () => {
  const { t } = useApp();
  return /* @__PURE__ */ jsx("div", { className: "border-t border-primary/20 pt-8 mt-8", children: /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx("p", { className: "text-primary/60 text-sm", children: t("footerCopyright") }) }) });
};
const Footer = () => {
  return /* @__PURE__ */ jsx("footer", { className: "text-primary mt-16", style: { backgroundColor: "#ffffffff" }, children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-8 items-center mb-8", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-start", children: /* @__PURE__ */ jsx(FooterMenu, {}) }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(FooterLogo, {}) }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(FooterLegal, {}) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex justify-start", children: /* @__PURE__ */ jsx(FooterContact, {}) }),
    /* @__PURE__ */ jsx(FooterCopyright, {})
  ] }) });
};
const SUPABASE_URL = "https://puhrnhslcyxnhgcfjsqv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1aHJuaHNsY3l4bmhnY2Zqc3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5OTQyOTAsImV4cCI6MjA2NTU3MDI5MH0.EGEqwBHTHAN47r-PVHzqd8q7jSzptPB549OPWXNmtZE";
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1e3;
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}
const toastTimeouts = /* @__PURE__ */ new Map();
const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId
    });
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
      };
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === action.toast.id ? { ...t, ...action.toast } : t
        )
      };
    case "DISMISS_TOAST": {
      const { toastId } = action;
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast2) => {
          addToRemoveQueue(toast2.id);
        });
      }
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === toastId || toastId === void 0 ? {
            ...t,
            open: false
          } : t
        )
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === void 0) {
        return {
          ...state,
          toasts: []
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId)
      };
  }
};
const listeners = [];
let memoryState = { toasts: [] };
function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}
function toast({ ...props }) {
  const id = genId();
  const update = (props2) => dispatch({
    type: "UPDATE_TOAST",
    toast: { ...props2, id }
  });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
      onClick: () => dismiss()
    }
  });
  return {
    id,
    dismiss,
    update
  };
}
function useToast() {
  const [state, setState] = React.useState(memoryState);
  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);
  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId })
  };
}
const fetchUserMeta = async (userId, setProfile, setUserRole) => {
  try {
    console.log("fetchUserMeta - Starting fetch for user:", userId);
    const [{ data: profileData, error: profileError }, { data: roleData, error: roleError }] = await Promise.all([
      supabase.from("profiles").select("id, full_name, email, phone_number, address, address_notes, country, postal_code, user_personal_id, city, state").eq("id", userId).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", userId).maybeSingle()
    ]);
    console.log("fetchUserMeta - Profile data:", profileData, "Profile error:", profileError);
    console.log("fetchUserMeta - Role data:", roleData, "Role error:", roleError);
    if (profileError || !profileData) {
      console.log("fetchUserMeta - Setting profile to null");
      setProfile(null);
    } else {
      console.log("fetchUserMeta - Setting profile:", profileData);
      setProfile(profileData);
    }
    if (roleError) {
      console.log("fetchUserMeta - Role error, defaulting to user");
      setUserRole("user");
    } else if (!roleData) {
      console.log("fetchUserMeta - No role data, defaulting to user");
      setUserRole("user");
    } else {
      console.log("fetchUserMeta - Setting role:", roleData.role);
      setUserRole(roleData.role);
    }
  } catch (error) {
    console.error("[AuthUtils] Error fetching user meta:", error);
    setProfile(null);
    setUserRole("user");
  }
};
const AuthContext = createContext(void 0);
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [profile, setProfile] = useState(null);
  const { toast: toast2 } = useToast();
  const isAdmin = userRole === "admin";
  console.log("AuthProvider - user:", user?.id, "userRole:", userRole, "isAdmin:", isAdmin);
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session2) => {
        console.log("Auth state change:", event, "user:", session2?.user?.id);
        setSession(session2);
        setUser(session2?.user ?? null);
        setLoading(false);
      }
    );
    supabase.auth.getSession().then(({ data: { session: session2 } }) => {
      console.log("Initial session check:", session2?.user?.id);
      setSession(session2);
      setUser(session2?.user ?? null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (user) {
      console.log("Fetching user meta for:", user.id);
      fetchUserMeta(user.id, setProfile, setUserRole);
    } else {
      console.log("No user, clearing role and profile");
      setUserRole(null);
      setProfile(null);
    }
  }, [user?.id]);
  const signUp = async (email, password, fullName, additionalData) => {
    const redirectUrl = `${window.location.origin}/auth?verified=true`;
    const metadata = {
      full_name: fullName,
      ...additionalData || {}
    };
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: metadata
      }
    });
    if (error) {
      toast2({ title: "Sign up failed", description: error.message, variant: "destructive" });
    } else {
      toast2({ title: "Check your email", description: "We've sent you a verification link." });
    }
    return { error };
  };
  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast2({ title: "Sign in failed", description: error.message, variant: "destructive" });
    } else {
      toast2({ title: "Welcome back!", description: "You've been signed in successfully." });
    }
    return { error };
  };
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast2({ title: "Sign out failed", description: error.message, variant: "destructive" });
    } else {
      toast2({ title: "Signed out", description: "You've been signed out successfully." });
    }
  };
  const resetPassword = async (email) => {
    const redirectUrl = `${window.location.origin}/auth/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: redirectUrl });
    if (error) {
      toast2({ title: "Password reset failed", description: error.message, variant: "destructive" });
    } else {
      toast2({ title: "Check your email", description: "We've sent you a password reset link." });
    }
    return { error };
  };
  const assignRole = async (userId, role) => {
    if (!isAdmin) {
      const error2 = { message: "Only admins can assign roles" };
      toast2({ title: "Permission denied", description: error2.message, variant: "destructive" });
      return { error: error2 };
    }
    const { error } = await supabase.from("user_roles").upsert({ user_id: userId, role, assigned_by: user?.id });
    if (error) {
      toast2({ title: "Role assignment failed", description: error.message, variant: "destructive" });
    } else {
      toast2({ title: "Role assigned", description: `User role updated to ${role}` });
    }
    return { error };
  };
  const refreshProfile = async () => {
    if (!user?.id) return;
    await fetchUserMeta(user.id, setProfile, setUserRole);
  };
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value: {
    user,
    session,
    loading,
    userRole,
    isAdmin,
    profile,
    signUp,
    signIn,
    signOut,
    resetPassword,
    assignRole,
    refreshProfile
  }, children });
};
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.SubTrigger,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto h-4 w-4" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
const DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.SubContent,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
const DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.CheckboxItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
const DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.RadioItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Label,
  {
    ref,
    className: cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
const useNotifications = () => {
  const { user } = useAuth();
  const { data: unreadCount = 0, refetch: refetchUnreadCount } = useQuery({
    queryKey: ["notifications", "unread", user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { count: count2, error } = await supabase.from("notifications").select("*", { count: "exact", head: true }).eq("user_id", user.id).is("read_at", null);
      if (error) throw error;
      return count2 || 0;
    },
    enabled: !!user,
    refetchInterval: 3e4
    // Refetch every 30 seconds
  });
  return {
    unreadCount,
    refetchUnreadCount
  };
};
const Header = () => {
  const { language, setLanguage, t } = useApp();
  const { user, signOut, isAdmin, userRole, profile } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { unreadCount } = useNotifications();
  const mobileMenuRef = useRef(null);
  const displayName = profile?.full_name?.trim() ? profile?.full_name : user?.email ?? "";
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target) && !target.closest("#mobileMenuToggle")) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  const handleSignOut = async () => {
    await signOut();
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("header", { className: "bg-white/95 backdrop-blur-sm border-b-2 border-capybara-orange/20 sticky top-0 z-50 transition-all duration-300", children: [
      !user && /* @__PURE__ */ jsx("div", { className: "h-12 w-full bg-capybara-blue flex justify-center items-center ", children: /* @__PURE__ */ jsx("p", { className: "animate-bounce font-bold", children: t("newUser") }) }),
      /* @__PURE__ */ jsxs("nav", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center h-16", children: [
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/",
              className: "flex items-center space-x-3 hover-bounce transition-all duration-300 flex-shrink-0",
              children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: "/aiyu_logo_small.png",
                    alt: "Capybara Logo",
                    className: "h-16 sm:h-16"
                  }
                ),
                isMobileMenuOpen && /* @__PURE__ */ jsx("span", { className: "font-paytone text-3xl text-[#3b434d] ", children: "Aiyu Japan" })
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "hidden md:flex items-center justify-center flex-1", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                to: "/",
                className: `px-4 py-2 text-sm font-semibold transition-all duration-300 story-link ${location.pathname === "/" ? "text-capybara-orange" : "text-gray-700 hover:text-capybara-orange"}`,
                children: t("home")
              }
            ),
            /* @__PURE__ */ jsxs(DropdownMenu, { children: [
              /* @__PURE__ */ jsxs(DropdownMenuTrigger, { className: "px-4 py-2 text-sm font-semibold transition-all duration-300 text-gray-700 hover:text-capybara-orange flex items-center space-x-1", children: [
                /* @__PURE__ */ jsx("span", { children: t("information") }),
                /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4" })
              ] }),
              /* @__PURE__ */ jsxs(DropdownMenuContent, { className: "bg-white border border-capybara-orange/20 shadow-lg rounded-lg", children: [
                /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsx(
                  Link,
                  {
                    to: "/services",
                    className: `px-4 py-2 text-sm font-semibold transition-all duration-300 ${location.pathname === "/services" ? "text-capybara-orange" : "text-gray-700 hover:text-capybara-orange"}`,
                    children: t("services")
                  }
                ) }),
                /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsx(
                  Link,
                  {
                    to: "/store-guide",
                    className: `px-4 py-2 text-sm font-semibold transition-all duration-300 ${location.pathname === "/store-guide" ? "text-capybara-orange" : "text-gray-700 hover:text-capybara-orange"}`,
                    children: t("storeGuide")
                  }
                ) }),
                /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsx(
                  Link,
                  {
                    to: "/contact",
                    className: `px-4 py-2 text-sm font-semibold transition-all duration-300 ${location.pathname === "/contact" ? "text-capybara-orange" : "text-gray-700 hover:text-capybara-orange"}`,
                    children: t("contact")
                  }
                ) })
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              Link,
              {
                to: "/calculator",
                className: ` px-4 py-2 text-sm font-semibold transition-all duration-300 story-link ${location.pathname === "/calculator" ? "text-capybara-orange" : "text-gray-700 hover:text-capybara-orange"}`,
                children: t("calculator")
              }
            ),
            /* @__PURE__ */ jsx(
              Link,
              {
                to: "/dashboard",
                className: `px-4 py-2 text-sm font-semibold transition-all duration-300 story-link ${location.pathname === "/dashboard" ? "text-capybara-orange" : "text-gray-700 hover:text-capybara-orange"}`,
                children: t("dashboard")
              }
            )
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "hidden md:flex items-center space-x-2", children: user ? /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
              isAdmin && /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs", children: [
                /* @__PURE__ */ jsx(Crown, { className: "w-3 h-3" }),
                /* @__PURE__ */ jsx("span", { children: "Admin" })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-600", children: [
                t("welcome"),
                ", ",
                displayName
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-0", children: [
              /* @__PURE__ */ jsx(Link, { to: "/calculator", children: /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "h-9 w-9 rounded-full hover:bg-capybara-cream transition-all duration-300",
                  children: /* @__PURE__ */ jsx(Calculator$1, { className: "h-5 w-5 text-grey-600" })
                }
              ) }),
              /* @__PURE__ */ jsx(
                Link,
                {
                  to: isAdmin ? "/admin-dashboard?tab=notifications" : "/user-dashboard?tab=notifications",
                  children: /* @__PURE__ */ jsxs(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "h-9 w-9 rounded-full hover:bg-capybara-cream transition-all duration-300 relative",
                      children: [
                        /* @__PURE__ */ jsx(Bell, { className: "h-5 w-5 text-grey-600" }),
                        unreadCount > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-semibold", children: unreadCount > 9 ? "9+" : unreadCount })
                      ]
                    }
                  )
                }
              )
            ] }),
            /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: handleSignOut,
                className: "flex items-center space-x-1",
                children: [
                  /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsx("span", { children: t("logout") })
                ]
              }
            )
          ] }) : /* @__PURE__ */ jsx(Link, { to: "/auth", children: /* @__PURE__ */ jsx(Button, { className: "bubble-btn-primary hover-bounce", children: t("login") }) }) }),
          /* @__PURE__ */ jsxs("div", { className: "md:hidden flex items-center space-x-1", children: [
            /* @__PURE__ */ jsx(Link, { to: "/calculator", children: /* @__PURE__ */ jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-9 w-9 rounded-full hover:bg-capybara-cream transition-all duration-300",
                children: /* @__PURE__ */ jsx(Calculator$1, { className: "h-5 w-5 text-gray-600" })
              }
            ) }),
            user && /* @__PURE__ */ jsx(
              Link,
              {
                to: isAdmin ? "/admin-dashboard?tab=notifications" : "/user-dashboard?tab=notifications",
                children: /* @__PURE__ */ jsxs(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "h-9 w-9 rounded-full hover:bg-capybara-cream transition-all duration-300 relative",
                    children: [
                      /* @__PURE__ */ jsx(Bell, { className: "h-5 w-5 text-gray-600" }),
                      unreadCount > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-semibold", children: unreadCount > 9 ? "9+" : unreadCount })
                    ]
                  }
                )
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                id: "mobileMenuToggle",
                variant: "ghost",
                size: "icon",
                onClick: () => setIsMobileMenuOpen((prev) => !prev),
                className: "h-9 w-9 rounded-full hover:bg-capybara-cream transition-all duration-300",
                children: isMobileMenuOpen ? /* @__PURE__ */ jsx(X, { className: "w-5 h-5 text-gray-700" }) : /* @__PURE__ */ jsx(Menu, { className: "w-5 h-5 text-gray-700" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:hidden justify-center items-center space-y-2 pb-2", children: [
          /* @__PURE__ */ jsx("div", { className: "flex md:hidden justify-center items-center mx-auto", children: user ? /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
              isAdmin && /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs", children: [
                /* @__PURE__ */ jsx(Crown, { className: "w-3 h-3" }),
                /* @__PURE__ */ jsx("span", { children: "Admin" })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-600", children: [
                t("welcome"),
                ", ",
                displayName
              ] })
            ] }),
            /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: handleSignOut,
                className: "flex items-center space-x-1",
                children: [
                  /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsx("span", { children: t("logout") })
                ]
              }
            )
          ] }) : /* @__PURE__ */ jsxs("div", { className: "flex gap-2 justify-center items-center flex-wrap", children: [
            /* @__PURE__ */ jsx(Link, { to: "/auth", reloadDocument: true, children: /* @__PURE__ */ jsx(Button, { className: "bubble-btn-primary hover-bounce", children: t("login") }) }),
            /* @__PURE__ */ jsx(Link, { to: "/auth?mode=signup", reloadDocument: true, children: /* @__PURE__ */ jsx(Button, { className: "bubble-btn-secondary-blue hover-bounce", children: t("register") }) })
          ] }) }),
          /* @__PURE__ */ jsx(
            "p",
            {
              className: "font-bold text-center",
              dangerouslySetInnerHTML: { __html: t("headerParagraph") }
            }
          )
        ] }),
        isMobileMenuOpen && /* @__PURE__ */ jsx("div", { className: "md:hidden animate-fade-in", ref: mobileMenuRef, children: /* @__PURE__ */ jsxs("div", { className: "px-2 pt-2 pb-2 space-y-2 sm:px-3 bg-white/95 border-t-2 border-capybara-orange/20 rounded-b-3xl min-h-screen", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/",
              className: `block px-4 py-3 rounded-full text-base font-semibold transition-all duration-300 ${location.pathname === "/" ? "text-white bg-capybara-orange" : "text-gray-700 hover:text-capybara-orange hover:bg-capybara-cream"}`,
              onClick: () => setIsMobileMenuOpen(false),
              children: t("home")
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "px-4 py-2 text-base font-bold text-gray-500", children: t("information") }),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/services",
              className: `block px-4 py-3 rounded-full text-base transition-all duration-300 ml-4 ${location.pathname === "/services" ? "text-white bg-capybara-orange" : "text-gray-700 hover:text-capybara-orange hover:bg-capybara-cream"}`,
              onClick: () => setIsMobileMenuOpen(false),
              children: t("services")
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/store-guide",
              className: `block px-4 py-3 rounded-full text-base transition-all duration-300 ml-4 ${location.pathname === "/store-guide" ? "text-white bg-capybara-orange" : "text-gray-700 hover:text-capybara-orange hover:bg-capybara-cream"}`,
              onClick: () => setIsMobileMenuOpen(false),
              children: t("storeGuide")
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/contact",
              className: `block px-4 py-3 rounded-full text-base transition-all duration-300 ml-4 ${location.pathname === "/contact" ? "text-white bg-capybara-orange" : "text-gray-700 hover:text-capybara-orange hover:bg-capybara-cream"}`,
              onClick: () => setIsMobileMenuOpen(false),
              children: t("contact")
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/calculator",
              className: `block px-4 py-3 rounded-full text-base font-semibold transition-all duration-300 ${location.pathname === "/calculator" ? "text-white bg-capybara-orange" : "text-gray-700 hover:text-capybara-orange hover:bg-capybara-cream"}`,
              onClick: () => setIsMobileMenuOpen(false),
              children: t("calculator")
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/dashboard",
              className: `block px-4 py-3 rounded-full text-base font-semibold transition-all duration-300 ${location.pathname === "/user-dashboard" || location.pathname === "/admin-dashboard" ? "text-white bg-capybara-orange" : "text-gray-700 hover:text-capybara-orange hover:bg-capybara-cream"}`,
              onClick: () => setIsMobileMenuOpen(false),
              children: "Dashboard"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "relative w-full", children: [
            /* @__PURE__ */ jsx(Globe, { className: "w-4 h-4 text-capybara-orange absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: language,
                onChange: (e) => setLanguage(e.target.value),
                className: "appearance-none w-full bg-capybara-cream text-gray-700 border-none focus:outline-none font-body rounded-full px-4 py-2 pr-10 pl-10 text-sm cursor-pointer",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "en", children: "English" }),
                  /* @__PURE__ */ jsx("option", { value: "es", children: "Español" })
                ]
              }
            ),
            /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4 text-gray-500 absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between px-1 py-3 border-b-2 border-capybara-orange/20", children: user && /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex ml-auto", children: [
              isAdmin && /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs", children: /* @__PURE__ */ jsx(Crown, { className: "w-3 h-3" }) }),
              /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-600", children: [
                t("welcome"),
                ", ",
                displayName,
                userRole && userRole !== "user" && /* @__PURE__ */ jsxs("span", { className: "ml-1 text-xs text-gray-500", children: [
                  "(",
                  userRole,
                  ")"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: async () => {
                  setIsMobileMenuOpen(false);
                  await handleSignOut();
                },
                className: "flex items-center space-x-1 text-sm",
                children: [
                  /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsx("span", { children: t("logout") })
                ]
              }
            )
          ] }) })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "fixed bottom-4 left-3 z-50 hidden md:block mr-1", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 bg-white rounded-full px-4 py-3 shadow-lg border border-capybara-orange/20", children: [
      /* @__PURE__ */ jsx(Globe, { className: "w-5 h-5 text-capybara-orange" }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          value: language,
          onChange: (e) => setLanguage(e.target.value),
          className: "bg-transparent text-sm text-gray-700 border-none focus:outline-none cursor-pointer font-body",
          children: [
            /* @__PURE__ */ jsx("option", { value: "es", children: "ES" }),
            /* @__PURE__ */ jsx("option", { value: "en", children: "EN" })
          ]
        }
      )
    ] }) })
  ] });
};
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    ),
    ...props
  }
);
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    ),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  LabelPrimitive.Root,
  {
    ref,
    className: cn(labelVariants(), className),
    ...props
  }
));
Label.displayName = LabelPrimitive.Root.displayName;
const MOBILE_BREAKPOINT = 768;
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(void 0);
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return !!isMobile;
}
const ProductRequestButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();
  const { user, isAdmin } = useAuth();
  const { t } = useApp();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [items] = useState([{ url: "", name: "", quantity: 1, notes: "" }]);
  const isDashboardOnMobile = isMobile && (location.pathname === "/user-dashboard" || location.pathname === "/admin-dashboard");
  const fabBottomClass = isDashboardOnMobile ? "bottom-20" : "bottom-4";
  const shouldHide = isAdmin || location.pathname === "/auth" || location.pathname === "/user-dashboard" && (!searchParams.get("tab") || searchParams.get("tab") === "submit");
  const handleFABClick = () => {
    if (user) {
      navigate("/user-dashboard?tab=submit");
    } else {
      setIsDialogOpen(true);
    }
  };
  const handleSignIn = () => {
    setIsDialogOpen(false);
    navigate("/auth");
  };
  if (shouldHide) return null;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: handleFABClick,
        className: `fixed ${fabBottomClass} right-3 z-40 flex items-center justify-center gap-2 px-6 py-3 rounded-full 
          border border-capybara-orange/20 bg-white/95 shadow-md 
          transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95`,
        "aria-label": t("makeOrderButton"),
        children: [
          /* @__PURE__ */ jsx(Plus, { className: "text-capybara-orange h-5 w-5" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: t("makeOrderButton") })
        ]
      }
    ),
    /* @__PURE__ */ jsx(Dialog, { open: isDialogOpen, onOpenChange: setIsDialogOpen, children: /* @__PURE__ */ jsxs(
      DialogContent,
      {
        className: "max-w-2xl max-h-[80vh] overflow-y-auto bg-white rounded-2xl shadow-lg p-6",
        onOpenAutoFocus: (e) => e.preventDefault(),
        children: [
          /* @__PURE__ */ jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsx(DialogTitle, { children: t("requestProductsTitle") }),
            /* @__PURE__ */ jsx(DialogDescription, { children: t("requestProductsDescription") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4 mt-4", children: [
            items.map((item, index) => /* @__PURE__ */ jsxs("div", { className: "space-y-2 p-4 border rounded-lg", children: [
              /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center mb-2", children: /* @__PURE__ */ jsx(Label, { children: t("productDetails") }) }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: t("productUrlPlaceholder"),
                  value: item.url,
                  className: "md:col-span-2"
                }
              )
            ] }, index)),
            /* @__PURE__ */ jsx(
              Button,
              {
                onClick: handleSignIn,
                className: "w-full bg-[var(--capybara-orange)] transition-all duration-300 hover:bg-capybara-blue",
                children: t("signInToSubmit")
              }
            )
          ] })
        ]
      }
    ) })
  ] });
};
const Toaster$1 = ({ ...props }) => {
  const { theme = "system" } = useTheme();
  return /* @__PURE__ */ jsx(
    Toaster$2,
    {
      theme,
      className: "toaster group",
      duration: 1e3,
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const ToastProvider = ToastPrimitives.Provider;
const ToastViewport = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Viewport,
  {
    ref,
    className: cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    ),
    ...props
  }
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    ToastPrimitives.Root,
    {
      ref,
      className: cn(toastVariants({ variant }), className),
      ...props
    }
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;
const ToastAction = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Action,
  {
    ref,
    className: cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    ),
    ...props
  }
));
ToastAction.displayName = ToastPrimitives.Action.displayName;
const ToastClose = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Close,
  {
    ref,
    className: cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    ),
    "toast-close": "",
    ...props,
    children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
  }
));
ToastClose.displayName = ToastPrimitives.Close.displayName;
const ToastTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Title,
  {
    ref,
    className: cn("text-sm font-semibold", className),
    ...props
  }
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;
const ToastDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Description,
  {
    ref,
    className: cn("text-sm opacity-90", className),
    ...props
  }
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;
function Toaster() {
  const { toasts } = useToast();
  return /* @__PURE__ */ jsxs(ToastProvider, { children: [
    toasts.map(function({ id, title, description, action, ...props }) {
      return /* @__PURE__ */ jsxs(Toast, { ...props, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
          title && /* @__PURE__ */ jsx(ToastTitle, { children: title }),
          description && /* @__PURE__ */ jsx(ToastDescription, { children: description })
        ] }),
        action,
        /* @__PURE__ */ jsx(ToastClose, {})
      ] }, id);
    }),
    /* @__PURE__ */ jsx(ToastViewport, {})
  ] });
}
const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(
  TooltipPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
const queryClient = new QueryClient();
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsx("body", {
      children: /* @__PURE__ */ jsx(QueryClientProvider, {
        client: queryClient,
        children: /* @__PURE__ */ jsx(TooltipProvider, {
          children: /* @__PURE__ */ jsx(AppProvider, {
            children: /* @__PURE__ */ jsxs(AuthProvider, {
              children: [/* @__PURE__ */ jsx(Toaster, {}), /* @__PURE__ */ jsx(Toaster$1, {}), /* @__PURE__ */ jsxs("div", {
                className: "min-h-screen flex flex-col",
                children: [/* @__PURE__ */ jsx(Header, {}), /* @__PURE__ */ jsxs("main", {
                  className: "flex-grow",
                  children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
                }), /* @__PURE__ */ jsx(Footer, {}), /* @__PURE__ */ jsx(ProductRequestButton, {})]
              })]
            })
          })
        })
      })
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Layout,
  default: root
}, Symbol.toStringTag, { value: "Module" }));
const Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
const CardHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "h3",
  {
    ref,
    className: cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "p",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hello! I'm here to help with your Japanese shopping needs. How can I assist you today?",
      isUser: false,
      timestamp: /* @__PURE__ */ new Date()
    }
  ]);
  const sendMessage = () => {
    if (!message.trim()) return;
    const userMessage = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: /* @__PURE__ */ new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setTimeout(() => {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! Our team will get back to you soon. For immediate assistance, please contact us via WhatsApp or email. 🦫",
        isUser: false,
        timestamp: /* @__PURE__ */ new Date()
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1e3);
    setMessage("");
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };
  if (!isOpen) {
    return /* @__PURE__ */ jsx("div", { className: "fixed bottom-3 right-52 z-50", children: /* @__PURE__ */ jsx(
      Button,
      {
        onClick: () => setIsOpen(true),
        className: "hidden bg-blue-300 hover:bg-blue-400 text-white rounded-full w-10 h-10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105",
        children: /* @__PURE__ */ jsx(MessageCircle, { className: "w-6 h-6" })
      }
    ) });
  }
  return /* @__PURE__ */ jsx("div", { className: "fixed bottom-14 right-52 z-50 w-80 max-w-[calc(100vw-2rem)]", children: /* @__PURE__ */ jsxs(Card, { className: "bg-white/95 backdrop-blur-sm border-blue-200 shadow-xl", children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
      /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg flex items-center", children: [
        /* @__PURE__ */ jsx("span", { className: "mr-2", children: "🦫" }),
        "AJ Assistant"
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => setIsOpen(false),
          className: "h-8 w-8 p-0",
          children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("div", { className: "h-64 overflow-y-auto space-y-2 pr-2", children: messages.map((msg) => /* @__PURE__ */ jsx(
        "div",
        {
          className: `flex ${msg.isUser ? "justify-end" : "justify-start"}`,
          children: /* @__PURE__ */ jsx(
            "div",
            {
              className: `max-w-[80%] p-2 rounded-lg text-sm ${msg.isUser ? "bg-blue-300 text-white" : "bg-gray-100 text-gray-800"}`,
              children: msg.text
            }
          )
        },
        msg.id
      )) }),
      /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: "Type your message...",
            value: message,
            onChange: (e) => setMessage(e.target.value),
            onKeyPress: handleKeyPress,
            className: "flex-1"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: sendMessage,
            className: "bg-blue-300 hover:bg-blue-400 text-white",
            size: "sm",
            children: /* @__PURE__ */ jsx(Send, { className: "h-4 w-4" })
          }
        )
      ] })
    ] })
  ] }) });
};
const CTASection = () => {
  const { t } = useApp();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [items] = useState([{ url: "", name: "", quantity: 1, notes: "" }]);
  const handleClick = () => {
    if (user && !isAdmin) {
      navigate("/user-dashboard?tab=submit");
    } else {
      setIsDialogOpen(true);
    }
  };
  const handleSignIn = () => {
    setIsDialogOpen(false);
    navigate("/auth");
  };
  return /* @__PURE__ */ jsxs("section", { className: "pt-5 pb-20", children: [
    /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center", children: /* @__PURE__ */ jsx(Card, { className: "bg-white/90 backdrop-blur-sm border-capybara-orange/20 shadow-xl", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-12", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-6 flex justify-center", children: /* @__PURE__ */ jsx("img", { src: "KapyShoppingBags.png", alt: "Kapy", className: "w-24" }) }),
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-gray-900 mb-6 text-center", children: t("ctaTitle") }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-8 text-lg", children: t("ctaDescription") }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: handleClick,
          className: "flex items-center gap-2 px-6 py-3 rounded-full border border-capybara-orange/20 bg-white/95 shadow-md \r\n                           transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95",
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "text-capybara-orange h-5 w-5" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700", children: t("makeOrderButton") })
          ]
        }
      ) })
    ] }) }) }),
    /* @__PURE__ */ jsx(Dialog, { open: isDialogOpen, onOpenChange: setIsDialogOpen, children: /* @__PURE__ */ jsxs(
      DialogContent,
      {
        className: "max-w-2xl max-h-[80vh] overflow-y-auto bg-white rounded-2xl shadow-lg p-6",
        onOpenAutoFocus: (e) => e.preventDefault(),
        children: [
          /* @__PURE__ */ jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsx(DialogTitle, { children: t("requestProductsTitle") }),
            /* @__PURE__ */ jsx(DialogDescription, { children: t("requestProductsDescription") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4 mt-4", children: [
            items.map((item, index) => /* @__PURE__ */ jsxs("div", { className: "space-y-2 p-4 border rounded-lg", children: [
              /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center mb-2", children: /* @__PURE__ */ jsx(Label, { children: t("productDetails") }) }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: t("productUrlPlaceholder"),
                  value: item.url,
                  className: "md:col-span-2"
                }
              )
            ] }, index)),
            /* @__PURE__ */ jsx(
              Button,
              {
                onClick: handleSignIn,
                className: "w-full bg-[var(--capybara-orange)] transition-all duration-300 hover:bg-capybara-blue text-white",
                children: t("signInToSubmit")
              }
            )
          ] })
        ]
      }
    ) })
  ] });
};
const FeaturedBlog$1 = () => {
  const { t } = useApp();
  const ORIGINAL_DATA = [
    { id: 1, title: "Blog 1", image: "/paraguay_banner.png", link: "/blog/1" },
    { id: 2, title: "Blog 2", image: "/paraguay_banner.png", link: "/blog/2" },
    { id: 3, title: "Blog 3", image: "/paraguay_banner.png", link: "/blog/3" }
  ];
  const BANNER_DATA = [
    { ...ORIGINAL_DATA[ORIGINAL_DATA.length - 1], id: -1 },
    // Clone of Last
    ...ORIGINAL_DATA,
    { ...ORIGINAL_DATA[0], id: -2 }
    // Clone of First
  ];
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const nextSlide = useCallback(() => {
    if (currentIndex >= BANNER_DATA.length - 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [currentIndex, BANNER_DATA.length]);
  const prevSlide = useCallback(() => {
    if (currentIndex <= 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, [currentIndex]);
  const goToSlide = (originalIndex) => {
    setIsTransitioning(true);
    setCurrentIndex(originalIndex + 1);
  };
  const handleTransitionEnd = () => {
    if (currentIndex === BANNER_DATA.length - 1) {
      setIsTransitioning(false);
      setCurrentIndex(1);
    } else if (currentIndex === 0) {
      setIsTransitioning(false);
      setCurrentIndex(BANNER_DATA.length - 2);
    }
  };
  useEffect(() => {
    if (!isPaused && !isDragging) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 5e3);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, isDragging, nextSlide]);
  const handleDragStart = (e) => {
    setIsTransitioning(false);
    setIsDragging(true);
    setIsPaused(true);
    setHasMoved(false);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };
  const handleDragMove = (e) => {
    if (!isDragging) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const diff = clientX - startX;
    if (Math.abs(diff) > 5) {
      setHasMoved(true);
    }
    setCurrentTranslate(diff);
  };
  const handleDragEnd = () => {
    setIsDragging(false);
    setIsPaused(false);
    setIsTransitioning(true);
    const threshold = 100;
    if (currentTranslate < -threshold) {
      nextSlide();
    } else if (currentTranslate > threshold) {
      prevSlide();
    } else ;
    setCurrentTranslate(0);
  };
  const handleLinkClick = (e) => {
    if (hasMoved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "w-full max-w-6xl mx-auto", children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: "w-full overflow-hidden shadow-2xl group cursor-grab active:cursor-grabbing select-none relative",
      onMouseEnter: () => setIsPaused(true),
      onMouseLeave: () => {
        setIsPaused(false);
        if (isDragging) handleDragEnd();
      },
      onMouseDown: handleDragStart,
      onMouseMove: handleDragMove,
      onMouseUp: handleDragEnd,
      onTouchStart: handleDragStart,
      onTouchMove: handleDragMove,
      onTouchEnd: handleDragEnd,
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "w-full flex",
            onTransitionEnd: handleTransitionEnd,
            style: {
              // Toggle transition based on state
              transition: isTransitioning ? "transform 500ms ease-out" : "none",
              // Math: (Index * 100%) + (Drag Pixels)
              transform: `translateX(calc(-${currentIndex * 100}% + ${currentTranslate}px))`
            },
            children: BANNER_DATA.map((banner, index) => /* @__PURE__ */ jsx(
              "div",
              {
                className: "relative flex-shrink-0 w-full",
                children: /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: banner.link,
                    className: "relative block w-full h-full transition-transform hover:scale-105",
                    draggable: false,
                    onClick: handleLinkClick,
                    children: /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: banner.image,
                        alt: banner.title,
                        className: "w-full h-auto object-cover pointer-events-none select-none",
                        draggable: false
                      }
                    )
                  }
                )
              },
              `${banner.id}-${index}`
            ))
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10", children: ORIGINAL_DATA.map((_, index) => {
          let isActive = false;
          if (currentIndex === index + 1) isActive = true;
          if (currentIndex === 0 && index === ORIGINAL_DATA.length - 1)
            isActive = true;
          if (currentIndex === BANNER_DATA.length - 1 && index === 0)
            isActive = true;
          return /* @__PURE__ */ jsx(
            "button",
            {
              onMouseDown: (e) => e.stopPropagation(),
              onTouchStart: (e) => e.stopPropagation(),
              onClick: () => goToSlide(index),
              className: "group relative p-2",
              children: /* @__PURE__ */ jsx(
                "span",
                {
                  className: `block h-3 w-3 rounded-full transition-all duration-300 
                    ${isActive ? "w-8 bg-blue-500" : "bg-white/50 hover:bg-blue-500/50"}`
                }
              )
            },
            index
          );
        }) })
      ]
    }
  ) });
};
const BLOG_DATA = [
  { id: 1, image: "/staff-introduction.png", link: "/blog/1", alt: "Blog 1" },
  { id: 2, image: "/how-to-calculator.png", link: "/blog/2", alt: "Blog 2" },
  { id: 3, image: "/where-to-shop.png", link: "/blog/3", alt: "Blog 3" }
];
const FeaturedBlogSlider = () => {
  const DESIRED_BUFFER = 3;
  const ITEM_WIDTH_PERCENT = 75;
  const CENTER_OFFSET = (100 - ITEM_WIDTH_PERCENT) / 2;
  const prependItems = BLOG_DATA.slice(-DESIRED_BUFFER);
  const appendItems = BLOG_DATA.slice(0, DESIRED_BUFFER);
  const SLIDER_DATA = [...prependItems, ...BLOG_DATA, ...appendItems];
  const PREPEND_COUNT = prependItems.length;
  const [currentIndex, setCurrentIndex] = useState(PREPEND_COUNT);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const timerRef = useRef(null);
  const nextSlide = useCallback(() => {
    if (currentIndex >= SLIDER_DATA.length - PREPEND_COUNT) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [currentIndex, SLIDER_DATA.length, PREPEND_COUNT]);
  const prevSlide = useCallback(() => {
    if (currentIndex <= 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, [currentIndex]);
  const handleTransitionEnd = () => {
    const totalRealItems = BLOG_DATA.length;
    if (currentIndex >= SLIDER_DATA.length - PREPEND_COUNT) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - totalRealItems);
    } else if (currentIndex < PREPEND_COUNT) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + totalRealItems);
    }
  };
  useEffect(() => {
    if (!isDragging && BLOG_DATA.length > 1) {
      timerRef.current = setInterval(nextSlide, 4e3);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isDragging, nextSlide]);
  const handleDragStart = (e) => {
    if (BLOG_DATA.length <= 1) return;
    setIsTransitioning(false);
    setIsDragging(true);
    setHasMoved(false);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };
  const handleDragMove = (e) => {
    if (!isDragging) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const diff = clientX - startX;
    if (Math.abs(diff) > 5) setHasMoved(true);
    setCurrentTranslate(diff);
  };
  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setIsTransitioning(true);
    const threshold = 50;
    if (currentTranslate < -threshold) nextSlide();
    else if (currentTranslate > threshold) prevSlide();
    setCurrentTranslate(0);
  };
  const itemCount = BLOG_DATA.length;
  let gridColsClass = "md:grid-cols-5";
  if (itemCount === 1) gridColsClass = "md:grid-cols-1";
  else if (itemCount === 2) gridColsClass = "md:grid-cols-2";
  else if (itemCount === 3) gridColsClass = "md:grid-cols-3";
  else if (itemCount === 4) gridColsClass = "md:grid-cols-4";
  return /* @__PURE__ */ jsxs("section", { className: "max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsx("div", { className: "md:hidden w-full overflow-hidden relative cursor-grab active:cursor-grabbing touch-pan-y", children: /* @__PURE__ */ jsx(
      "div",
      {
        className: "flex w-full",
        onTransitionEnd: handleTransitionEnd,
        onMouseDown: handleDragStart,
        onMouseMove: handleDragMove,
        onMouseUp: handleDragEnd,
        onMouseLeave: () => isDragging && handleDragEnd(),
        onTouchStart: handleDragStart,
        onTouchMove: handleDragMove,
        onTouchEnd: handleDragEnd,
        style: {
          transition: isTransitioning ? "transform 400ms ease-out" : "none",
          transform: `translateX(calc(-${currentIndex * ITEM_WIDTH_PERCENT}% + ${CENTER_OFFSET}% + ${currentTranslate}px))`
        },
        children: SLIDER_DATA.map((blog, index) => /* @__PURE__ */ jsx(
          "div",
          {
            className: "flex-shrink-0 px-2",
            style: { width: `${ITEM_WIDTH_PERCENT}%` },
            children: /* @__PURE__ */ jsxs(
              "a",
              {
                href: blog.link,
                draggable: false,
                onClick: (e) => hasMoved && e.preventDefault(),
                className: "block w-full aspect-video overflow-hidden rounded-xl shadow-md relative group",
                children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: blog.image,
                      alt: blog.alt,
                      draggable: false,
                      className: "w-full h-full object-cover pointer-events-none"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/0 active:bg-black/10 transition-colors" })
                ]
              }
            )
          },
          `${blog.id}-${index}`
        ))
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "hidden md:block w-full max-w-7xl mx-auto overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: `grid ${gridColsClass} gap-4`, children: BLOG_DATA.map((blog) => /* @__PURE__ */ jsx(
      "a",
      {
        href: blog.link,
        className: "block w-full aspect-video overflow-hidden rounded-xl shadow-md transition-transform hover:scale-105 hover:shadow-lg",
        children: /* @__PURE__ */ jsx(
          "img",
          {
            src: blog.image,
            alt: blog.alt,
            className: "w-full h-full object-cover"
          }
        )
      },
      blog.id
    )) }) })
  ] });
};
const FeaturedBlog = () => {
  return /* @__PURE__ */ jsxs("section", { className: "w-full max-w-7xl mx-auto py-4 space-y-4", children: [
    /* @__PURE__ */ jsx(FeaturedBlog$1, {}),
    /* @__PURE__ */ jsx(FeaturedBlogSlider, {})
  ] });
};
const FeaturedNews = () => {
  const { t, language } = useApp();
  const newsEntries = [
    {
      id: 1,
      title: t("newsBlog1Title"),
      date: 1763739388,
      link: "/blog/1"
    },
    {
      id: 2,
      title: t("newsBlog2Title"),
      date: 1763739388,
      link: "/blog/2"
    },
    {
      id: 3,
      title: t("newsBlog3Title"),
      date: 1763739388,
      link: "/blog/3"
    },
    {
      id: 4,
      title: t("newsBlog4Title"),
      date: 1763739388,
      link: "/blog/3"
    }
    // Add more entries as needed
  ];
  return /* @__PURE__ */ jsx("section", { className: "py-10 px-4", children: /* @__PURE__ */ jsxs("div", { className: "p-4 w-full drop-shadow-md text-blue-800 bg-white rounded-lg max-w-3xl mx-auto space-y-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: " inline-flex gap-2 items-center ", children: [
        /* @__PURE__ */ jsx(Newspaper, { size: 16 }),
        /* @__PURE__ */ jsx("p", { children: t("featNewsTitle") })
      ] }),
      /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex gap-2 items-center", children: [
        t("featNewsAll"),
        /* @__PURE__ */ jsx(MoveRight, { size: 16 })
      ] }) })
    ] }),
    newsEntries.map((entry2) => /* @__PURE__ */ jsxs(
      "a",
      {
        href: entry2.link,
        className: "flex flex-col transition-transform transform hover:translate-x-1",
        children: [
          /* @__PURE__ */ jsxs("span", { className: "text-black inline-flex gap-2 items-center", children: [
            /* @__PURE__ */ jsx(Clock, { size: 16 }),
            new Intl.DateTimeFormat(language, {
              month: "short",
              day: "numeric",
              year: "numeric"
            }).format(new Date(entry2.date))
          ] }),
          /* @__PURE__ */ jsx("p", { children: entry2.title })
        ]
      },
      entry2.id
    ))
  ] }) });
};
const globeMap = "/global-delivery.png";
const HeroSection = () => {
  const { t } = useApp();
  const SLIDES = [
    {
      id: 1,
      bgClass: "bg-white",
      title: t("heroSlide1Title"),
      titleColor: "text-capybara-blue",
      subtitle: t("heroSlide1TitleSubtitle"),
      subtitleColor: "text-gray-500",
      image: globeMap
    },
    {
      id: 2,
      bgClass: "bg-capybara-blue",
      title: t("heroSlide2Title"),
      titleColor: "text-white",
      subtitle: "",
      subtitleColor: ""
    }
  ];
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [url, setUrl] = useState("");
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => prev === SLIDES.length - 1 ? 0 : prev + 1);
    }, 5e3);
    return () => clearInterval(timer);
  }, []);
  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };
  const handleSignIn = () => {
    setIsDialogOpen(false);
    navigate("/auth");
  };
  return /* @__PURE__ */ jsxs("section", { className: "relative w-full animate-fade-in ", children: [
    /* @__PURE__ */ jsx("div", { className: "w-full h-[500px] sm:h-[370px]", children: /* @__PURE__ */ jsxs("div", { className: "relative group w-full h-full bg-gray-100 overflow-hidden", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "flex w-full h-full transition-transform duration-700 ease-in-out",
          style: { transform: `translateX(-${currentSlide * 100}%)` },
          children: SLIDES.map((slide) => /* @__PURE__ */ jsx("div", { className: "min-w-full h-full relative", children: /* @__PURE__ */ jsx("div", { className: `${slide.bgClass} size-full`, children: /* @__PURE__ */ jsxs("div", { className: "relative h-full flex flex-col-reverse sm:flex-row items-center justify-center sm:justify-start py-6 px-8 gap-6 sm:py-0 overflow-hidden sm:mx-auto sm:px-[19px] max-w-[1140px]", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 sm:gap-12 items-center sm:items-start z-10", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-4 sm:w-[510px] break-words text-center sm:text-left", children: [
                /* @__PURE__ */ jsx(
                  "p",
                  {
                    className: `${slide.titleColor} font-bold text-[28px] sm:text-[36px] leading-10`,
                    children: slide.title
                  }
                ),
                slide.subtitle && /* @__PURE__ */ jsx("p", { className: `${slide.subtitleColor} text-[16px]`, children: slide.subtitle })
              ] }),
              /* @__PURE__ */ jsx("a", { href: "/login", children: /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: `flex items-center justify-center whitespace-nowrap rounded-3xl font-medium transition-all enabled:active:scale-95 opacity-50 enabled:opacity-100 text-[12px] px-8 h-[44px] border 
                          bubble-btn-primary`,
                  children: /* @__PURE__ */ jsx("span", { className: "font-bold", children: "Login to use the service" })
                }
              ) })
            ] }),
            slide.image ? /* @__PURE__ */ jsx(
              "img",
              {
                src: slide.image,
                alt: "Banner",
                className: "sm:absolute sm:top-6 sm:right-5 w-full sm:w-auto"
              }
            ) : slide.CustomVisual && /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(slide.CustomVisual, {}) })
          ] }) }) }, slide.id))
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center space-x-2 z-10", children: SLIDES.map((_, index) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => handleDotClick(index),
          "aria-label": `Go to Slide ${index + 1}`,
          className: `rounded-full transition-all duration-300 ${currentSlide === index ? "w-3 h-3 bg-capybara-blue" : "w-2 h-2 bg-capybara-blue/50"}`
        },
        index
      )) })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: isDialogOpen, onOpenChange: setIsDialogOpen, children: /* @__PURE__ */ jsxs(
      DialogContent,
      {
        className: "max-w-2xl max-h-[80vh] overflow-y-auto bg-white rounded-2xl shadow-lg p-6",
        onOpenAutoFocus: (e) => e.preventDefault(),
        children: [
          /* @__PURE__ */ jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsx(DialogTitle, { children: t("requestProductsTitle") }),
            /* @__PURE__ */ jsx(DialogDescription, { children: t("requestProductsDescription") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4 mt-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 p-4 border rounded-lg", children: [
              /* @__PURE__ */ jsx(Label, { children: t("productDetails") }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: t("productUrlPlaceholder"),
                  value: url,
                  onChange: (e) => setUrl(e.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              Button,
              {
                onClick: handleSignIn,
                className: "w-full bg-[var(--capybara-orange)] transition-all duration-300 hover:bg-capybara-blue text-white",
                children: t("signInToSubmit")
              }
            )
          ] })
        ]
      }
    ) })
  ] });
};
const CarouselContext = React.createContext(null);
function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}
const Carousel = React.forwardRef(
  ({
    orientation = "horizontal",
    opts,
    setApi,
    plugins,
    className,
    children,
    ...props
  }, ref) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y"
      },
      plugins
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);
    const onSelect = React.useCallback((api2) => {
      if (!api2) {
        return;
      }
      setCanScrollPrev(api2.canScrollPrev());
      setCanScrollNext(api2.canScrollNext());
    }, []);
    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);
    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);
    const handleKeyDown = React.useCallback(
      (event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext]
    );
    React.useEffect(() => {
      if (!api || !setApi) {
        return;
      }
      setApi(api);
    }, [api, setApi]);
    React.useEffect(() => {
      if (!api) {
        return;
      }
      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);
      return () => {
        api?.off("select", onSelect);
      };
    }, [api, onSelect]);
    return /* @__PURE__ */ jsx(
      CarouselContext.Provider,
      {
        value: {
          carouselRef,
          api,
          opts,
          orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext
        },
        children: /* @__PURE__ */ jsx(
          "div",
          {
            ref,
            onKeyDownCapture: handleKeyDown,
            className: cn("relative", className),
            role: "region",
            "aria-roledescription": "carousel",
            ...props,
            children
          }
        )
      }
    );
  }
);
Carousel.displayName = "Carousel";
const CarouselContent = React.forwardRef(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();
  return /* @__PURE__ */ jsx("div", { ref: carouselRef, className: "overflow-hidden", children: /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn(
        "flex",
        orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
        className
      ),
      ...props
    }
  ) });
});
CarouselContent.displayName = "CarouselContent";
const CarouselItem = React.forwardRef(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      role: "group",
      "aria-roledescription": "slide",
      className: cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      ),
      ...props
    }
  );
});
CarouselItem.displayName = "CarouselItem";
const CarouselPrevious = React.forwardRef(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  return /* @__PURE__ */ jsxs(
    Button,
    {
      ref,
      variant,
      size,
      className: cn(
        "absolute  h-8 w-8 rounded-full",
        orientation === "horizontal" ? "-left-12 top-1/2 -translate-y-1/2" : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      ),
      disabled: !canScrollPrev,
      onClick: scrollPrev,
      ...props,
      children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Previous slide" })
      ]
    }
  );
});
CarouselPrevious.displayName = "CarouselPrevious";
const CarouselNext = React.forwardRef(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  return /* @__PURE__ */ jsxs(
    Button,
    {
      ref,
      variant,
      size,
      className: cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal" ? "-right-12 top-1/2 -translate-y-1/2" : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      ),
      disabled: !canScrollNext,
      onClick: scrollNext,
      ...props,
      children: [
        /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Next slide" })
      ]
    }
  );
});
CarouselNext.displayName = "CarouselNext";
const HowItWorks = () => {
  const { t } = useApp();
  const [api, setApi] = React__default.useState();
  const [thumbsApi, setThumbsApi] = React__default.useState();
  const [current, setCurrent] = React__default.useState(0);
  const [count2, setCount] = React__default.useState(0);
  React__default.useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      const index = api.selectedScrollSnap();
      setCurrent(index + 1);
      thumbsApi?.scrollTo(index);
    });
  }, [api, thumbsApi]);
  React__default.useCallback(
    (index) => {
      api?.scrollTo(index);
    },
    [api]
  );
  const reasons = [
    {
      icon: Search,
      title: t("step1DetailedTitle"),
      description: t("step1DetailedDescription"),
      image: "KapyShopping.png"
    },
    {
      icon: Link$1,
      title: t("step2DetailedTitle"),
      description: t("step2DetailedDescription"),
      image: "KapyBed.png"
    },
    {
      icon: BadgePercent,
      title: t("step3DetailedTitle"),
      description: t("step3DetailedDescription"),
      image: "KapyWarehouse.png"
    },
    {
      icon: Tag,
      title: t("step4DetailedTitle"),
      description: t("step4DetailedDescription"),
      image: "KapyGlobal.png"
    },
    {
      icon: MessageSquareText,
      title: t("step5DetailedTitle"),
      description: t("step5DetailedDescription"),
      image: "KapyGlobal.png"
    },
    {
      icon: PlusCircle,
      title: t("step6DetailedTitle"),
      description: t("step6DetailedDescription"),
      image: "KapyShopping.png"
    },
    {
      icon: Send,
      title: t("step7DetailedTitle"),
      description: t("step7DetailedDescription"),
      image: "KapyBed.png"
    }
  ];
  const renderCard = (reason, index) => {
    const IconComponent = reason.icon;
    return /* @__PURE__ */ jsxs(Card, { className: "bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg overflow-hidden h-full flex flex-col", children: [
      /* @__PURE__ */ jsxs("div", { className: "aspect-video relative overflow-hidden", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: reason.image,
            alt: reason.title,
            className: "w-full h-full object-cover"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-blue-300/20" })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "p-6 text-center flex-grow flex flex-col", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 flex-shrink-0", children: /* @__PURE__ */ jsx(IconComponent, { className: "w-6 h-6 text-white" }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-900 mb-3", children: reason.title }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm leading-relaxed", children: reason.description })
      ] })
    ] });
  };
  return /* @__PURE__ */ jsx("section", { className: "py-20 bg-white/50", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-16 max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-gray-900 mb-4", children: t("howItWorksDetailedTitle") }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-600", children: t("howItWorksDetailedDescription1") })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto w-full relative space-y-8", children: /* @__PURE__ */ jsxs(
      Carousel,
      {
        setApi,
        className: "w-full max-w-xs md:max-w-4xl lg:max-w-6xl mx-auto",
        opts: {
          align: "start"
        },
        children: [
          /* @__PURE__ */ jsx(CarouselContent, { className: "-ml-4", children: reasons.map((reason, index) => /* @__PURE__ */ jsx(
            CarouselItem,
            {
              className: "pl-4 basis-full md:basis-1/2 lg:basis-1/3",
              children: /* @__PURE__ */ jsx("div", { className: "p-1 h-full", children: renderCard(reason) })
            },
            index
          )) }),
          /* @__PURE__ */ jsx(CarouselPrevious, { className: "h-12 w-12 -left-[1rem] border-blue-200 hover:bg-blue-50 text-blue-500" }),
          /* @__PURE__ */ jsx(CarouselNext, { className: "h-12 w-12 -right-[1rem] border-blue-200 hover:bg-blue-50 text-blue-500" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto space-y-8 mt-16", children: [
      /* @__PURE__ */ jsx("p", { className: "text-center text-lg text-gray-600", children: t("howItWorksDetailedDescription2") }),
      /* @__PURE__ */ jsx(
        "a",
        {
          type: "button",
          href: "/guide",
          className: `block mx-auto w-fit bubble-btn-secondary`,
          children: /* @__PURE__ */ jsx("span", { className: "font-bold", children: t("newUserLinkBtn") })
        }
      )
    ] })
  ] }) });
};
function RecommendedStoresSection() {
  const { t } = useApp();
  const shops = [
    {
      id: 1,
      image: "banpresto.png"
    },
    {
      id: 2,
      image: "banpresto.png"
    },
    {
      id: 3,
      image: "banpresto.png"
    },
    {
      id: 4,
      image: "banpresto.png"
    },
    {
      id: 5,
      image: "banpresto.png"
    },
    {
      id: 6,
      image: "banpresto.png"
    },
    {
      id: 6,
      image: "banpresto.png"
    },
    {
      id: 6,
      image: "banpresto.png"
    },
    {
      id: 6,
      image: "banpresto.png"
    },
    {
      id: 6,
      image: "banpresto.png"
    },
    {
      id: 6,
      image: "banpresto.png"
    },
    {
      id: 6,
      image: "banpresto.png"
    },
    {
      id: 6,
      image: "banpresto.png"
    },
    {
      id: 6,
      image: "banpresto.png"
    },
    {
      id: 6,
      image: "banpresto.png"
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "py-20 sm:mx-auto px-4 sm:px-[19px] max-w-6xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-16 max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-gray-900 mb-4", children: t("recommendedStoresTitle") }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-600", children: t("recommendedStoresDescription") })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 sm:grid-cols-8 gap-2 [&_div]:h-[50px] [&_div]:sm:h-[80px] [&_div]:bg-white [&_div]:border [&_div]:border-[#DFE0E2] [&_div]:rounded-xl [&_div]:flex [&_div]:items-center [&_div]:justify-center", children: shops.map((shop) => /* @__PURE__ */ jsx("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsx(
      "a",
      {
        href: "",
        target: "_blank",
        rel: "noopener noreferrer",
        "aria-label": "Weverse",
        children: /* @__PURE__ */ jsx("img", { className: "object-cover ", src: shop.image })
      }
    ) }, shop.id)) })
  ] });
}
const SocialMediaSection = () => {
  const { t } = useApp();
  return /* @__PURE__ */ jsx("section", { className: "py-20 bg-white/50", children: /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row justify-center items-start gap-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md flex flex-col items-center hidden", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-gray-900 mb-6 text-center", children: t("customerReviews") }),
      /* @__PURE__ */ jsx(Card, { className: "flex-grow bg-white/90 backdrop-blur-sm border-blue-200 shadow-md h-full w-full" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md flex flex-col items-center", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-gray-900 mb-6 text-center", children: t("instagramFeed") }),
      /* @__PURE__ */ jsx(Card, { className: "flex-grow bg-white/90 backdrop-blur-sm border-[#FFB115] border-2 shadow-lg h-full w-full", children: /* @__PURE__ */ jsx(CardContent, { className: "h-full", children: /* @__PURE__ */ jsx("div", { className: "p-5 pt-10 max-w-[600px] mx-auto", children: /* @__PURE__ */ jsx(
        "iframe",
        {
          src: "https://www.instagram.com/aiyu.japan/embed",
          width: "100%",
          height: "400",
          name: "Instagram Feed",
          scrolling: "no",
          className: "w-full h-[400px] border-none",
          allowFullScreen: true
        }
      ) }) }) })
    ] })
  ] }) }) });
};
const Accordion = AccordionPrimitive.Root;
const AccordionItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AccordionPrimitive.Item,
  {
    ref,
    className: cn("border-b", className),
    ...props
  }
));
AccordionItem.displayName = "AccordionItem";
const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Header, { className: "flex", children: /* @__PURE__ */ jsxs(
  AccordionPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 shrink-0 transition-transform duration-200" })
    ]
  }
) }));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(
  AccordionPrimitive.Content,
  {
    ref,
    className: "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
    ...props,
    children: /* @__PURE__ */ jsx("div", { className: cn("pb-4 pt-0", className), children })
  }
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
const useIntersectionObserver = (options) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry2]) => {
        setIsIntersecting(entry2.isIntersecting);
        if (entry2.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.01,
        rootMargin: "-50px 0px",
        ...options
      }
    );
    observer.observe(element);
    return () => {
      observer.unobserve(element);
    };
  }, [hasIntersected, options]);
  return { ref, isIntersecting, hasIntersected };
};
const AnimatedSection = ({
  children,
  delay = 0
}) => {
  const {
    ref,
    hasIntersected
  } = useIntersectionObserver();
  return /* @__PURE__ */ jsx("div", {
    ref,
    className: `transition-all duration-700 ease-out ${hasIntersected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`,
    style: {
      transitionDelay: hasIntersected ? `${delay}ms` : "0ms"
    },
    children
  });
};
const Home = () => {
  const {
    t
  } = useApp();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-[url(tile_background.png)] bg-repeat",
    children: [/* @__PURE__ */ jsx("div", {
      className: "animate-fade-in",
      children: /* @__PURE__ */ jsx(HeroSection, {})
    }), /* @__PURE__ */ jsx(AnimatedSection, {
      delay: 100,
      children: /* @__PURE__ */ jsx(FeaturedBlog, {})
    }), /* @__PURE__ */ jsx(AnimatedSection, {
      delay: 200,
      children: /* @__PURE__ */ jsx(FeaturedNews, {})
    }), /* @__PURE__ */ jsx(AnimatedSection, {
      delay: 300,
      children: /* @__PURE__ */ jsx(HowItWorks, {})
    }), /* @__PURE__ */ jsx(AnimatedSection, {
      delay: 400,
      children: /* @__PURE__ */ jsx(RecommendedStoresSection, {})
    }), /* @__PURE__ */ jsx(AnimatedSection, {
      delay: 500,
      children: /* @__PURE__ */ jsx(SocialMediaSection, {})
    }), /* @__PURE__ */ jsx(AnimatedSection, {
      delay: 600,
      children: /* @__PURE__ */ jsxs("div", {
        className: "mt-10",
        children: [/* @__PURE__ */ jsx("div", {
          className: "text-center mb-8",
          children: /* @__PURE__ */ jsx("h2", {
            className: "text-2xl md:text-3xl font-bold text-gray-900 mb-4",
            children: t("faqTitle")
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "mb-12",
          children: /* @__PURE__ */ jsx(Card, {
            className: "bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg max-w-4xl mx-auto",
            children: /* @__PURE__ */ jsx(CardContent, {
              className: "p-8 space-y-4",
              children: /* @__PURE__ */ jsx(Accordion, {
                type: "single",
                collapsible: true,
                children: [[t("faq1Question"), t("faq1Answer")], [t("faq2Question"), t("faq2Answer")], [t("faq3Question"), t("faq3Answer")], [t("faq4Question"), t("faq4Answer")], [t("faq5Question"), t("faq5Answer")], [t("faq6Question"), t("faq6Answer")], [t("faq7Question"), t("faq7Answer")], [t("faq8Question"), t("faq8Answer")], [t("faq9Question"), t("faq9Answer")]].map(([question, answer], index) => /* @__PURE__ */ jsxs(AccordionItem, {
                  value: `item-${index}`,
                  className: "border-b border-blue-200",
                  children: [/* @__PURE__ */ jsx(AccordionTrigger, {
                    className: "text-left hover:no-underline",
                    children: question
                  }), /* @__PURE__ */ jsx(AccordionContent, {
                    className: "text-gray-600 whitespace-pre-line",
                    children: answer
                  })]
                }, index))
              })
            })
          })
        })]
      })
    }), /* @__PURE__ */ jsx(AnimatedSection, {
      delay: 700,
      children: /* @__PURE__ */ jsx(CTASection, {})
    }), /* @__PURE__ */ jsx(AnimatedSection, {
      delay: 800,
      children: /* @__PURE__ */ jsx(ChatAssistant, {})
    })]
  });
};
const Home_default = UNSAFE_withComponentProps(Home);
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Home_default
}, Symbol.toStringTag, { value: "Module" }));
const SimpleHowItWorks = () => {
  const { t } = useApp();
  const steps = [
    {
      icon: Search,
      title: t("step1Title"),
      description: t("step1Description")
    },
    {
      icon: ShoppingCart,
      title: t("step2Title"),
      description: t("step2Description")
    },
    {
      icon: Truck,
      title: t("step3Title"),
      description: t("step3Description")
    }
  ];
  return /* @__PURE__ */ jsx("section", { className: "py-20 animate-fade-in", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsx("div", { className: "text-center mb-16", children: /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-gray-900 mb-4", children: t("howItWorks") }) }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-8", children: steps.map((step, index) => {
      const IconComponent = step.icon;
      return /* @__PURE__ */ jsx(Card, { className: "bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-8 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsx(IconComponent, { className: "w-8 h-8 text-white" }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-900 mb-4", children: step.title }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 leading-relaxed", children: step.description })
      ] }) }, index);
    }) })
  ] }) });
};
const ServiceFeatures = () => {
  const { t } = useApp();
  const serviceFeatures = [
    {
      title: t("personalShoppingTitle"),
      description: t("personalShoppingDescription"),
      icon: Heart,
      benefits: [t("expertKnowledge"), t("accessExclusive"), t("negotiation")]
    },
    {
      title: t("packageConsolidationTitle"),
      description: t("packageConsolidationDescription"),
      icon: Package,
      benefits: [t("reducedCosts"), t("freeStorage"), t("professionalPackaging")]
    },
    {
      title: t("fastShippingTitle"),
      description: t("fastShippingDescription"),
      icon: Truck,
      benefits: [t("expressShipping"), t("insuranceCoverage"), t("realTimeTracking")]
    }
  ];
  return /* @__PURE__ */ jsx("section", { className: "py-20 bg-white/50 animate-fade-in", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-gray-900 mb-4", children: t("whyChooseTitle") }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-600", children: t("whyChooseSubtitle") })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-8", children: serviceFeatures.map((feature, index) => {
      const IconComponent = feature.icon;
      return /* @__PURE__ */ jsx(Card, { className: "bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale animate-fade-in", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-8 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsx(IconComponent, { className: "w-8 h-8 text-white" }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-900 mb-4", children: feature.title }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 leading-relaxed mb-6", children: feature.description }),
        /* @__PURE__ */ jsx("ul", { className: "text-left space-y-2", children: feature.benefits.map((benefit, benefitIndex) => /* @__PURE__ */ jsxs("li", { className: "flex items-center text-gray-700", children: [
          /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4 text-blue-400 mr-2 flex-shrink-0" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm", children: benefit })
        ] }, benefitIndex)) })
      ] }) }, index);
    }) })
  ] }) });
};
const ShoppingCategories = () => {
  const { t } = useApp();
  const categories = [
    { category: t("animeCategory"), items: [t("figures"), t("collectibles"), t("limitedEditions"), t("doujinshi")], emoji: "🎌" },
    { category: t("fashionCategory"), items: [t("clothing"), t("cosmetics"), t("accessories"), t("shoes")], emoji: "👘" },
    { category: t("electronicsCategory"), items: [t("gaming"), t("gadgets"), t("audio"), t("cameras")], emoji: "🎮" },
    { category: t("traditionalCategory"), items: [t("crafts"), t("tea"), t("snacks"), t("souvenirs")], emoji: "🍵" }
  ];
  return /* @__PURE__ */ jsx("section", { className: "py-20 animate-fade-in", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-gray-900 mb-4", children: t("whatCanWeShop") }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-600", children: t("whatCanWeShopSubtitle") })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-6", children: categories.map((category, index) => /* @__PURE__ */ jsx(Card, { className: "bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale animate-fade-in", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-6 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "text-4xl mb-4", children: category.emoji }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-900 mb-4", children: category.category }),
      /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: category.items.map((item, itemIndex) => /* @__PURE__ */ jsx("li", { className: "text-gray-600 text-sm", children: item }, itemIndex)) })
    ] }) }, index)) })
  ] }) });
};
const PricingInfo = () => {
  const { t } = useApp();
  return /* @__PURE__ */ jsx("section", { className: "py-20 bg-white/50 animate-fade-in", children: /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center", children: /* @__PURE__ */ jsx(Card, { className: "bg-white/90 backdrop-blur-sm border-blue-200 shadow-xl", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-12", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-6" }),
    /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-gray-900 mb-6", children: t("transparentPricing") }),
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-6 mb-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-blue-400 mb-2", children: "¥500" }),
        /* @__PURE__ */ jsx("div", { className: "text-gray-600", children: t("serviceFeePerItem") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-blue-400 mb-2", children: "10%" }),
        /* @__PURE__ */ jsx("div", { className: "text-gray-600", children: t("taxOnItemCost") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-blue-400 mb-2", children: t("variable") }),
        /* @__PURE__ */ jsx("div", { className: "text-gray-600", children: t("internationalShipping") })
      ] })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-8 text-lg", children: t("noHiddenFeesTransparent") })
  ] }) }) }) });
};
const Services = () => {
  const {
    t
  } = useApp();
  const {
    ref: howItWorksRef,
    hasIntersected: howItWorksVisible
  } = useIntersectionObserver();
  const {
    ref: featuresRef,
    hasIntersected: featuresVisible
  } = useIntersectionObserver();
  const {
    ref: categoriesRef,
    hasIntersected: categoriesVisible
  } = useIntersectionObserver();
  const {
    ref: pricingRef,
    hasIntersected: pricingVisible
  } = useIntersectionObserver();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-[url(tile_background.png)] bg-repeat animate-fade-in",
    children: [/* @__PURE__ */ jsx(HeroSection, {
      title: t("servicesTitle"),
      subtitle: t("servicesSubtitle"),
      description: t("servicesDescription"),
      showButtons: false,
      showMascot: true,
      mascotImage: "MascotBox.png"
    }), /* @__PURE__ */ jsx("div", {
      ref: howItWorksRef,
      className: `transition-all duration-700 ${howItWorksVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`,
      children: /* @__PURE__ */ jsx(SimpleHowItWorks, {})
    }), /* @__PURE__ */ jsx("div", {
      ref: featuresRef,
      className: `transition-all duration-700 ${featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`,
      children: /* @__PURE__ */ jsx(ServiceFeatures, {})
    }), /* @__PURE__ */ jsx("div", {
      ref: categoriesRef,
      className: `transition-all duration-700 ${categoriesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`,
      children: /* @__PURE__ */ jsx(ShoppingCategories, {})
    }), /* @__PURE__ */ jsx("div", {
      ref: pricingRef,
      className: `transition-all duration-700 ${pricingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`,
      children: /* @__PURE__ */ jsx(PricingInfo, {})
    })]
  });
};
const Services_default = UNSAFE_withComponentProps(Services);
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Services_default
}, Symbol.toStringTag, { value: "Module" }));
const Textarea = React.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "textarea",
      {
        className: cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";
const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollUpButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollDownButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
  SelectPrimitive.Content,
  {
    ref,
    className: cn(
      "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsx(
        SelectPrimitive.Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
const SelectLabel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Label,
  {
    ref,
    className: cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
const shippingTables = {
  economic: [
    [300, 1738, 2013, 2431, 2233],
    [400, 1870, 2211, 2662, 2519],
    [500, 2002, 2409, 2893, 2805],
    [600, 2134, 2607, 3124, 3091],
    [700, 2266, 2805, 3355, 3377],
    [800, 2398, 3003, 3586, 3663],
    [900, 2530, 3201, 3817, 3949],
    [1e3, 2662, 3399, 4048, 4235],
    [1100, 2794, 3597, 4279, 4521],
    [1200, 2926, 3795, 4510, 4807],
    [1300, 3058, 3993, 4741, 5093],
    [1400, 3190, 4191, 4972, 5379],
    [1500, 3322, 4389, 5230, 5665],
    [1600, 3454, 4587, 5434, 5951],
    [1700, 3586, 4785, 5665, 6237],
    [1800, 3718, 4983, 5896, 6523],
    [1900, 3850, 5181, 6127, 6809],
    [2e3, 3982, 5379, 6358, 7095]
  ],
  express: [
    [500, 2640, 4015, 4840, 4510],
    [1e3, 4015, 5390, 6380, 6160],
    [1500, 4785, 6655, 7810, 7810],
    [2e3, 5555, 7920, 9240, 9460],
    [2500, 6215, 9075, 10560, 11100],
    [3e3, 6875, 8800, 11880, 12760],
    [3500, 7535, 11385, 13200, 14410],
    [4e3, 8195, 12540, 14520, 14410],
    [4500, 8855, 13695, 15840, 17710],
    [5e3, 9515, 14850, 17160, 19360],
    [6e3, 10835, 17160, 19800, 22660],
    [7e3, 11935, 19470, 22440, 25300],
    [8e3, 13035, 21780, 25080, 27940],
    [9e3, 14135, 24090, 27720, 30580],
    [1e4, 15235, 26400, 30360, 33220]
  ]
};
const ZONE1_ASIA = [
  "Bangladesh",
  "Bhutan",
  "Brunei",
  "Cambodia",
  "China",
  "Hong Kong",
  "India",
  "Indonesia",
  "Laos",
  "Macao",
  "Malaysia",
  "Maldives",
  "Mongolia",
  "Myanmar",
  "Nepal",
  "Pakistan",
  "Philippines",
  "Republic of Korea",
  "Singapore",
  "Sri Lanka",
  "Taiwan",
  "Thailand",
  "Vietnam"
];
const ZONE2_OCEANIA = [
  "Australia",
  "Cook Islands",
  "Fiji",
  "New Caledonia",
  "New Zealand",
  "Papua New Guinea",
  "Solomon"
];
const ZONE2_NA = ["Canada", "Mexico", "St. Pierre and Miquelon"];
const ZONE2_ME = [
  "Bahrain",
  "Iran",
  "Iraq",
  "Israel",
  "Jordan",
  "Kuwait",
  "Lebanon",
  "Oman",
  "Qatar",
  "Saudi Arabia",
  "Syria",
  "Turkey",
  "United Arab Emirates"
];
const ZONE2_EU = [
  "Andorra",
  "Austria",
  "Azerbaijan",
  "Belarus",
  "Belgium",
  "Bulgaria",
  "Croatia",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "United Kingdom",
  "Greece",
  "Guernsey",
  "Hungary",
  "Iceland",
  "Ireland",
  "Italy",
  "Jersey",
  "Latvia",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Malta",
  "Monaco",
  "Netherlands",
  "North Macedonia",
  "Norway",
  "Poland",
  "Portugal",
  "Romania",
  "Russian Federation",
  "San Marino",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Switzerland",
  "Sweden",
  "Ukraine"
];
const ZONE3_US = ["United States of America", "Guam", "Saipan"];
const ZONE4_LATAM = [
  "Argentina",
  "Barbados",
  "Brazil",
  "Chile",
  "Costa Rica",
  "Cuba",
  "El Salvador",
  "French Guiana",
  "Guadeloupe",
  "Honduras",
  "Jamaica",
  "Martinique",
  "Panama",
  "Peru",
  "Trinidad and Tobago",
  "Uruguay"
];
const ZONE4_AFRICA = [
  "Algeria",
  "Botswana",
  "Djibouti",
  "Egypt",
  "Ethiopia",
  "Gabon",
  "Ghana",
  "Ivory Coast",
  "Kenya",
  "Madagascar",
  "Mauritius",
  "Morocco",
  "Nigeria",
  "Reunion",
  "Rwanda",
  "Senegal",
  "Sierra Leone",
  "South Africa",
  "Sudan",
  "Tanzania (United Rep.)",
  "Togo",
  "Tunisia",
  "Uganda",
  "Zimbabwe"
];
const ZONE5_PARAGUAY = ["Paraguay"];
const COUNTRY_TO_ZONE = {};
[...ZONE1_ASIA].forEach((c) => COUNTRY_TO_ZONE[c] = 1);
[...ZONE2_OCEANIA, ...ZONE2_NA, ...ZONE2_ME, ...ZONE2_EU].forEach((c) => COUNTRY_TO_ZONE[c] = 2);
[...ZONE3_US].forEach((c) => COUNTRY_TO_ZONE[c] = 3);
[...ZONE4_LATAM, ...ZONE4_AFRICA].forEach((c) => COUNTRY_TO_ZONE[c] = 4);
[...ZONE5_PARAGUAY].forEach((c) => COUNTRY_TO_ZONE[c] = 5);
const ZONE_NAMES = {
  1: "Asia",
  2: "Oceanía + Canadá + México + Medio Oriente + Europa",
  3: "Estados Unidos (incluye territorios)",
  4: "Centro/Sur América (sin México) + África",
  5: "Paraguay (envío especial)"
};
const PARAGUAY_SHIPPING = {
  ratePerGram: 5.385,
  // yen per gram
  minWeight: 200,
  // grams (minimum for Paraguay shipping)
  maxWeight: 25e3,
  // grams
  step: 100
  // grams
};
const DHL_ZONE1 = ["Republic of Korea", "Taiwan"];
const DHL_ZONE2 = ["China", "Hong Kong", "Macao"];
const DHL_ZONE3 = [
  "Brunei",
  "Vietnam",
  "Singapore",
  "Indonesia",
  "Philippines",
  "Malaysia",
  "Thailand"
];
const DHL_ZONE4 = ["India", "Bangladesh", "Myanmar", "Bhutan", "Laos"];
const DHL_ZONE5 = ["United States of America", "Canada", "Mexico"];
const DHL_ZONE6 = [
  "Iceland",
  "Ireland",
  "Czech Republic",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "United Kingdom",
  "Greece",
  "Guernsey",
  "Hungary",
  "Italy",
  "Jersey",
  "Latvia",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Malta",
  "Monaco",
  "Netherlands",
  "North Macedonia",
  "Norway",
  "Poland",
  "Portugal",
  "Romania",
  "San Marino",
  "Serbia",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Switzerland",
  "Sweden",
  "Bosnia and Herzegovina",
  "Montenegro",
  "Cyprus",
  "Turkey",
  "Vatican City"
];
const DHL_ZONE7 = ["Israel", "United Arab Emirates"];
const DHL_ZONE8 = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "American Samoa",
  "Angola",
  "Anguilla",
  "Antigua and Barbuda",
  "Argentina",
  "Aruba",
  "Bahamas",
  "Bahrain",
  "Barbados",
  "Belarus",
  "Belize",
  "Benin",
  "Bermuda",
  "Bolivia",
  "Botswana",
  "Brazil",
  "British Virgin Islands",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Cape Verde",
  "Cayman Islands",
  "Central African Republic",
  "Chad",
  "Chile",
  "Colombia",
  "Comoros",
  "Republic of the Congo",
  "Democratic Republic of the Congo",
  "Cook Islands",
  "Costa Rica",
  "Cuba",
  "Curacao",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Eswatini",
  "Ethiopia",
  "Falkland Islands",
  "Faroe Islands",
  "French Guiana",
  "Gabon",
  "Gambia",
  "Georgia",
  "Ghana",
  "Greenland",
  "Grenada",
  "Guadeloupe",
  "Guam",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Iraq",
  "Iran",
  "Ivory Coast",
  "Jamaica",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Madagascar",
  "Malawi",
  "Maldives",
  "Mali",
  "Marshall Islands",
  "Martinique",
  "Mauritania",
  "Mauritius",
  "Mayotte",
  "Micronesia",
  "Moldova",
  "Mongolia",
  "Montserrat",
  "Morocco",
  "Mozambique",
  "Namibia",
  "Nauru",
  "Nepal",
  "New Caledonia",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "Niue",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Puerto Rico",
  "Qatar",
  "Reunion",
  "Rwanda",
  "Saint Barthelemy",
  "Saint Helena",
  "Saint Kitts",
  "Saint Lucia",
  "Saint Martin",
  "Saint Pierre and Miquelon",
  "Saint Vincent",
  "Samoa",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Seychelles",
  "Sierra Leone",
  "Sint Eustatius",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Syrian Arab Republic",
  "Tajikistan",
  "Tanzania",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkmenistan",
  "Turks and Caicos Islands",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela",
  "Virgin Islands",
  "Yemen",
  "Zambia",
  "Zimbabwe"
];
const ALL_DHL_COUNTRIES = [
  ...DHL_ZONE1,
  ...DHL_ZONE2,
  ...DHL_ZONE3,
  ...DHL_ZONE4,
  ...DHL_ZONE5,
  ...DHL_ZONE6,
  ...DHL_ZONE7,
  ...DHL_ZONE8
];
const ALL_COUNTRIES = [
  ...Object.keys(COUNTRY_TO_ZONE),
  ...ALL_DHL_COUNTRIES.filter((country) => !COUNTRY_TO_ZONE[country])
].sort((a, b) => a.localeCompare(b));
const DHL_COUNTRY_ALIASES = {
  "USA": "United States of America",
  "United States": "United States of America",
  "UK": "United Kingdom",
  "South Korea": "Republic of Korea",
  "Korea": "Republic of Korea",
  "Macau": "Macao",
  "UAE": "United Arab Emirates",
  "Hong Kong SAR": "Hong Kong"
};
const DHL_COUNTRY_TO_ZONE = {};
[
  { zone: 1, countries: DHL_ZONE1 },
  { zone: 2, countries: DHL_ZONE2 },
  { zone: 3, countries: DHL_ZONE3 },
  { zone: 4, countries: DHL_ZONE4 },
  { zone: 5, countries: DHL_ZONE5 },
  { zone: 6, countries: DHL_ZONE6 },
  { zone: 7, countries: DHL_ZONE7 },
  { zone: 8, countries: DHL_ZONE8 }
].forEach(({ zone, countries }) => {
  countries.forEach((c) => DHL_COUNTRY_TO_ZONE[c] = zone);
});
const DHL_ZONE1_RATES = {
  "0.5": 2414,
  "1.0": 2414,
  "1.5": 2414,
  "2.0": 2414,
  "2.5": 3766,
  "3.0": 3766,
  "3.5": 3766,
  "4.0": 3766,
  "4.5": 3766,
  "5.0": 3766,
  "5.5": 4776,
  "6.0": 5786,
  "6.5": 6796,
  "7.0": 7806,
  "7.5": 8816,
  "8.0": 9826,
  "8.5": 10836,
  "9.0": 11846,
  "9.5": 12856,
  "10.0": 13866
};
const DHL_ZONE2_RATES = {
  "0.5": 2566,
  "1.0": 2566,
  "1.5": 2566,
  "2.0": 2566,
  "2.5": 3926,
  "3.0": 3926,
  "3.5": 3926,
  "4.0": 3926,
  "4.5": 3926,
  "5.0": 3926,
  "5.5": 4930,
  "6.0": 5934,
  "6.5": 6938,
  "7.0": 7942,
  "7.5": 8946,
  "8.0": 9950,
  "8.5": 10954,
  "9.0": 11958,
  "9.5": 12962,
  "10.0": 13966
};
const DHL_ZONE3_RATES = {
  "0.5": 2717,
  "1.0": 2717,
  "1.5": 2717,
  "2.0": 2717,
  "2.5": 4675,
  "3.0": 4675,
  "3.5": 4675,
  "4.0": 4675,
  "4.5": 4675,
  "5.0": 4675,
  "5.5": 5872,
  "6.0": 7069,
  "6.5": 8266,
  "7.0": 9463,
  "7.5": 10660,
  "8.0": 11857,
  "8.5": 13054,
  "9.0": 14251,
  "9.5": 15448,
  "10.0": 16645
};
const DHL_ZONE4_RATES = {
  "0.5": 2867,
  "1.0": 2867,
  "1.5": 2867,
  "2.0": 2867,
  "2.5": 4973,
  "3.0": 4973,
  "3.5": 4973,
  "4.0": 4973,
  "4.5": 4973,
  "5.0": 4973,
  "5.5": 6730,
  "6.0": 8487,
  "6.5": 10244,
  "7.0": 12001,
  "7.5": 13758,
  "8.0": 15515,
  "8.5": 17272,
  "9.0": 19029,
  "9.5": 20786,
  "10.0": 22543
};
const DHL_ZONE5_RATES = {
  "0.5": 4882,
  "1.0": 4882,
  "1.5": 4882,
  "2.0": 5578,
  "2.5": 6372,
  "3.0": 7409,
  "3.5": 8446,
  "4.0": 9483,
  "4.5": 10520,
  "5.0": 11557,
  "5.5": 11828,
  "6.0": 12099,
  "6.5": 12370,
  "7.0": 12641,
  "7.5": 12912,
  "8.0": 13183,
  "8.5": 13454,
  "9.0": 13725,
  "9.5": 13996,
  "10.0": 14267
};
const DHL_ZONE6_RATES = {
  "0.5": 3471,
  "1.0": 3471,
  "1.5": 3471,
  "2.0": 3471,
  "2.5": 7549,
  "3.0": 7549,
  "3.5": 7549,
  "4.0": 7549,
  "4.5": 7549,
  "5.0": 7549,
  "5.5": 10326,
  "6.0": 13103,
  "6.5": 15880,
  "7.0": 18657,
  "7.5": 21434,
  "8.0": 24211,
  "8.5": 26988,
  "9.0": 29765,
  "9.5": 32542,
  "10.0": 35319
};
const DHL_ZONE7_RATES = {
  "0.5": 5583,
  "1.0": 5583,
  "1.5": 5583,
  "2.0": 5583,
  "2.5": 13282,
  "3.0": 13282,
  "3.5": 13282,
  "4.0": 13282,
  "4.5": 13282,
  "5.0": 13282,
  "5.5": 16540,
  "6.0": 19798,
  "6.5": 23056,
  "7.0": 26314,
  "7.5": 29572,
  "8.0": 32830,
  "8.5": 36088,
  "9.0": 39346,
  "9.5": 42604,
  "10.0": 45862
};
const DHL_ZONE8_RATES = {
  "0.5": 5887,
  "1.0": 5887,
  "1.5": 5887,
  "2.0": 5887,
  "2.5": 13589,
  "3.0": 13589,
  "3.5": 13589,
  "4.0": 13589,
  "4.5": 13589,
  "5.0": 13589,
  "5.5": 17257,
  "6.0": 20925,
  "6.5": 24593,
  "7.0": 28261,
  "7.5": 31929,
  "8.0": 35597,
  "8.5": 39265,
  "9.0": 42933,
  "9.5": 46601,
  "10.0": 50269
};
const DHL_RATE_TABLES = {
  1: DHL_ZONE1_RATES,
  2: DHL_ZONE2_RATES,
  3: DHL_ZONE3_RATES,
  4: DHL_ZONE4_RATES,
  5: DHL_ZONE5_RATES,
  6: DHL_ZONE6_RATES,
  7: DHL_ZONE7_RATES,
  8: DHL_ZONE8_RATES
};
const DHL_DEMAND_SURCHARGE = 375;
const DHL_DEFAULT_FUEL_PERCENTAGE = 32;
const DHL_VOLUMETRIC_DIVISOR = 5e3;
function ceilToHalfKg(kg) {
  return Math.ceil(kg * 2) / 2;
}
function calculateVolumetricWeight(L, W, H) {
  if (!L || !W || !H) return 0;
  return L * W * H / DHL_VOLUMETRIC_DIVISOR;
}
function getChargeableWeight(actualKg, L, W, H) {
  const volumetric = calculateVolumetricWeight(L || 0, W || 0, H || 0);
  const maxWeight = Math.max(actualKg, volumetric);
  const rounded = ceilToHalfKg(maxWeight);
  return Math.min(10, rounded);
}
function normalizeDHLCountry(name) {
  return DHL_COUNTRY_ALIASES[name] || name;
}
const isDHLOnlyCountry = (country) => {
  const normalizedCountry = normalizeDHLCountry(country);
  const hasDHL = ALL_DHL_COUNTRIES.includes(normalizedCountry);
  const hasRegularZone = COUNTRY_TO_ZONE[country] !== void 0;
  return hasDHL && !hasRegularZone;
};
function getDHLZone(country) {
  const normalized = normalizeDHLCountry(country);
  return DHL_COUNTRY_TO_ZONE[normalized] || 8;
}
function calculateDHLCost(country, weightGrams, L, W, H, fuelPercentage = DHL_DEFAULT_FUEL_PERCENTAGE) {
  const zone = getDHLZone(country);
  const actualKg = weightGrams / 1e3;
  const volumetricKg = calculateVolumetricWeight(L || 0, W || 0, H || 0);
  const chargeableKg = getChargeableWeight(actualKg, L, W, H);
  const rateTable = DHL_RATE_TABLES[zone];
  if (!rateTable) return null;
  const baseRate = rateTable[chargeableKg.toFixed(1)] || 0;
  if (baseRate === 0) return null;
  const demandSurcharge = DHL_DEMAND_SURCHARGE;
  const fuelSurcharge = Math.round(baseRate * (fuelPercentage / 100));
  const total = baseRate + demandSurcharge + fuelSurcharge;
  return {
    zone,
    actualKg,
    volumetricKg,
    chargeableKg,
    baseRate,
    demandSurcharge,
    fuelSurcharge,
    total
  };
}
const calculateShippingCostByCountry = (country, shippingMethod, weight, dimensions, fuelPercentage) => {
  const zone = COUNTRY_TO_ZONE[country];
  if (!zone && shippingMethod !== "dhl") return null;
  if (shippingMethod === "dhl") {
    return calculateDHLCost(
      country,
      weight,
      dimensions?.L,
      dimensions?.W,
      dimensions?.H,
      fuelPercentage
    );
  }
  if (zone === 5) {
    if (shippingMethod !== "paraguay") return null;
    const { ratePerGram, minWeight, maxWeight, step } = PARAGUAY_SHIPPING;
    let effectiveWeight = weight;
    if (dimensions?.L && dimensions?.W && dimensions?.H) {
      const volumetricKg = calculateVolumetricWeight(
        dimensions.L,
        dimensions.W,
        dimensions.H
      );
      const volumetricGrams = volumetricKg * 1e3;
      effectiveWeight = Math.max(weight, volumetricGrams);
    }
    const clamped = Math.max(minWeight, Math.min(maxWeight, effectiveWeight));
    const rounded = Math.ceil(clamped / step) * step;
    return rounded * ratePerGram;
  }
  const destIndex = zone - 1;
  const table = shippingTables[shippingMethod];
  if (!table) return null;
  for (let i = 0; i < table.length; i++) {
    if (weight <= table[i][0]) {
      return table[i][destIndex + 1];
    }
  }
  if (table.length > 0) {
    return table[table.length - 1][destIndex + 1];
  }
  return null;
};
const getZoneForCountry = (country) => {
  const zone = COUNTRY_TO_ZONE[country];
  if (!zone) return null;
  return { zone, name: ZONE_NAMES[zone] };
};
const useAnimatedNumber = (targetNumber, duration = 100) => {
  const [animatedValue, setAnimatedValue] = useState(targetNumber);
  useEffect(() => {
    let start = animatedValue;
    let startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.round(start + (targetNumber - start) * progress);
      setAnimatedValue(current);
      if (progress < 1) requestAnimationFrame(animate);
    };
    if (targetNumber !== animatedValue) {
      requestAnimationFrame(animate);
    }
  }, [targetNumber, duration]);
  return animatedValue;
};
const getWeightRange = (shippingMethod) => {
  if (shippingMethod === "express") return { min: 500, max: 1e4 };
  if (shippingMethod === "paraguay") return { min: 200, max: 25e3 };
  if (shippingMethod === "dhl") return { min: 500, max: 1e4 };
  return { min: 300, max: 2e3 };
};
const Auth = () => {
  const {
    user,
    signUp,
    signIn
  } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get("mode") === "signup" ? false : true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [signUpStep, setSignUpStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
    address: "",
    addressNotes: "",
    country: "",
    postalCode: "",
    city: "",
    state: ""
  });
  const {
    t
  } = useApp();
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  useEffect(() => {
    const verified = searchParams.get("verified");
    if (verified === "true") {
      navigate("/email-verification");
    }
  }, [searchParams, navigate]);
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const validateStep1 = () => {
    if (!formData.email || !formData.password || !formData.fullName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return false;
    }
    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };
  const validateStep2 = () => {
    if (!formData.phoneNumber) {
      toast({
        title: "Error",
        description: "Please enter your phone number",
        variant: "destructive"
      });
      return false;
    }
    const phoneRegex = /^[\d\s+()-]+$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };
  const validateStep3 = () => {
    if (!formData.address || !formData.country || !formData.postalCode || !formData.city || !formData.state) {
      toast({
        title: "Error",
        description: "Please fill in all required address fields",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };
  const handleNextStep = () => {
    if (signUpStep === 1 && validateStep1()) {
      setSignUpStep(2);
    } else if (signUpStep === 2 && validateStep2()) {
      setSignUpStep(3);
    }
  };
  const handlePrevStep = () => {
    setSignUpStep(signUpStep - 1);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (isLogin) {
      const {
        error
      } = await signIn(formData.email, formData.password);
      if (!error) {
        navigate("/dashboard");
      }
    } else {
      if (signUpStep === 3 && !validateStep3()) {
        setIsLoading(false);
        return;
      }
      const {
        data: existingProfiles
      } = await supabase.from("profiles").select("email, phone_number").or(`email.eq.${formData.email},phone_number.eq.${formData.phoneNumber}`);
      if (existingProfiles && existingProfiles.length > 0) {
        const existingEmail = existingProfiles.find((p) => p.email === formData.email);
        const existingPhone = existingProfiles.find((p) => p.phone_number === formData.phoneNumber);
        if (existingEmail) {
          toast({
            title: "Email already registered",
            description: "This email is already in use. Please sign in or use a different email.",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
        if (existingPhone) {
          toast({
            title: "Phone number already registered",
            description: "This phone number is already in use. Please use a different phone number.",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
      }
      const {
        error
      } = await signUp(formData.email, formData.password, formData.fullName, {
        phone_number: formData.phoneNumber,
        address: formData.address,
        address_notes: formData.addressNotes,
        country: formData.country,
        postal_code: formData.postalCode,
        city: formData.city,
        state: formData.state
      });
      if (error) {
        if (error.message?.includes("already registered") || error.message?.includes("User already registered")) {
          toast({
            title: "Email already registered",
            description: "This email is already registered. Please sign in instead.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Sign up failed",
            description: error.message || "An error occurred during signup.",
            variant: "destructive"
          });
        }
      } else {
        setEmailSent(true);
      }
    }
    setIsLoading(false);
  };
  if (emailSent) {
    return /* @__PURE__ */ jsx("div", {
      className: "min-h-screen bg-[url(tile_background.png)] bg-repeat flex items-center justify-center px-4",
      children: /* @__PURE__ */ jsx(Card, {
        className: "w-full max-w-md bg-white/90 backdrop-blur-sm border-primary/20 shadow-xl",
        children: /* @__PURE__ */ jsx(CardContent, {
          className: "p-12 text-center",
          children: /* @__PURE__ */ jsxs("div", {
            className: "mb-6",
            children: [/* @__PURE__ */ jsx(Mail, {
              className: "w-16 h-16 text-primary mx-auto mb-4"
            }), /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-bold text-foreground mb-4",
              children: "Check your email"
            }), /* @__PURE__ */ jsxs("p", {
              className: "text-muted-foreground mb-8",
              children: ["We've sent a verification email to", " ", /* @__PURE__ */ jsx("strong", {
                children: formData.email
              }), ". Please check your inbox and click the verification link to activate your account."]
            }), /* @__PURE__ */ jsx("p", {
              className: "text-sm text-muted-foreground mb-6",
              children: "Didn't receive the email? Check your spam folder."
            }), /* @__PURE__ */ jsx(Button, {
              variant: "outline",
              onClick: () => {
                setEmailSent(false);
                setSignUpStep(1);
              },
              className: "w-full",
              children: "Back to Sign Up"
            })]
          })
        })
      })
    });
  }
  return /* @__PURE__ */ jsx("div", {
    className: "min-h-screen bg-[url(tile_background.png)] bg-repeat animate-fade-in flex items-center justify-center px-4",
    children: /* @__PURE__ */ jsxs(Card, {
      className: "w-full max-w-md bg-white/90 backdrop-blur-sm border-primary/20 shadow-xl",
      children: [/* @__PURE__ */ jsxs(CardHeader, {
        className: "text-center",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex items-center justify-center space-x-2 mb-4",
          children: [/* @__PURE__ */ jsx("img", {
            src: "/aiyu_logo_small.png",
            alt: "Capybara Logo",
            className: "h-16 sm:h-16"
          }), /* @__PURE__ */ jsx("span", {
            className: "font-paytone text-5xl text-[#3b434d] ",
            children: "Aiyu Japan"
          })]
        }), /* @__PURE__ */ jsx(CardTitle, {
          className: "text-2xl font-bold text-foreground",
          children: isLogin ? t("signIn") : t("createYourAccount")
        }), !isLogin && /* @__PURE__ */ jsxs("div", {
          className: "flex items-center justify-center mt-4 space-x-2",
          children: [/* @__PURE__ */ jsx("div", {
            className: `w-8 h-8 rounded-full flex items-center justify-center ${signUpStep >= 1 ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`,
            children: signUpStep > 1 ? /* @__PURE__ */ jsx(Check, {
              className: "w-4 h-4"
            }) : "1"
          }), /* @__PURE__ */ jsx("div", {
            className: `w-12 h-1 ${signUpStep >= 2 ? "bg-primary" : "bg-muted"}`
          }), /* @__PURE__ */ jsx("div", {
            className: `w-8 h-8 rounded-full flex items-center justify-center ${signUpStep >= 2 ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`,
            children: signUpStep > 2 ? /* @__PURE__ */ jsx(Check, {
              className: "w-4 h-4"
            }) : "2"
          }), /* @__PURE__ */ jsx("div", {
            className: `w-12 h-1 ${signUpStep >= 3 ? "bg-primary" : "bg-muted"}`
          }), /* @__PURE__ */ jsx("div", {
            className: `w-8 h-8 rounded-full flex items-center justify-center ${signUpStep >= 3 ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`,
            children: "3"
          })]
        })]
      }), /* @__PURE__ */ jsxs(CardContent, {
        className: "space-y-6",
        children: [/* @__PURE__ */ jsx("form", {
          onSubmit: handleSubmit,
          className: "space-y-4",
          children: isLogin ? (
            // Login form
            /* @__PURE__ */ jsxs(Fragment, {
              children: [/* @__PURE__ */ jsxs("div", {
                className: "space-y-2",
                children: [/* @__PURE__ */ jsx(Label, {
                  htmlFor: "email",
                  children: t("email")
                }), /* @__PURE__ */ jsx(Input, {
                  id: "email",
                  name: "email",
                  type: "email",
                  value: formData.email,
                  onChange: handleInputChange,
                  className: "rounded-lg",
                  required: true
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-2",
                children: [/* @__PURE__ */ jsx(Label, {
                  htmlFor: "password",
                  children: t("password")
                }), /* @__PURE__ */ jsxs("div", {
                  className: "relative",
                  children: [/* @__PURE__ */ jsx(Input, {
                    id: "password",
                    name: "password",
                    type: showPassword ? "text" : "password",
                    value: formData.password,
                    onChange: handleInputChange,
                    className: "rounded-lg pr-10",
                    required: true
                  }), /* @__PURE__ */ jsx("button", {
                    type: "button",
                    onClick: () => setShowPassword(!showPassword),
                    className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground",
                    children: showPassword ? /* @__PURE__ */ jsx(EyeOff, {
                      className: "h-4 w-4"
                    }) : /* @__PURE__ */ jsx(Eye, {
                      className: "h-4 w-4"
                    })
                  })]
                })]
              }), /* @__PURE__ */ jsx(Button, {
                type: "submit",
                className: "w-full",
                disabled: isLoading,
                children: isLoading ? t("signingIn") : t("signIn")
              })]
            })
          ) : (
            // Multi-step signup form
            /* @__PURE__ */ jsxs(Fragment, {
              children: [signUpStep === 1 && /* @__PURE__ */ jsxs(Fragment, {
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "space-y-2",
                  children: [/* @__PURE__ */ jsxs(Label, {
                    htmlFor: "fullName",
                    children: [t("fullName"), " *"]
                  }), /* @__PURE__ */ jsx(Input, {
                    id: "fullName",
                    name: "fullName",
                    type: "text",
                    value: formData.fullName,
                    onChange: handleInputChange,
                    className: "rounded-lg",
                    required: true
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "space-y-2",
                  children: [/* @__PURE__ */ jsxs(Label, {
                    htmlFor: "email",
                    children: [t("email"), " *"]
                  }), /* @__PURE__ */ jsx(Input, {
                    id: "email",
                    name: "email",
                    type: "email",
                    value: formData.email,
                    onChange: handleInputChange,
                    className: "rounded-lg",
                    required: true
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "space-y-2",
                  children: [/* @__PURE__ */ jsxs(Label, {
                    htmlFor: "password",
                    children: [t("password"), " *"]
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "relative",
                    children: [/* @__PURE__ */ jsx(Input, {
                      id: "password",
                      name: "password",
                      type: showPassword ? "text" : "password",
                      value: formData.password,
                      onChange: handleInputChange,
                      className: "rounded-lg pr-10",
                      required: true
                    }), /* @__PURE__ */ jsx("button", {
                      type: "button",
                      onClick: () => setShowPassword(!showPassword),
                      className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground",
                      children: showPassword ? /* @__PURE__ */ jsx(EyeOff, {
                        className: "h-4 w-4"
                      }) : /* @__PURE__ */ jsx(Eye, {
                        className: "h-4 w-4"
                      })
                    })]
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "space-y-2",
                  children: [/* @__PURE__ */ jsxs(Label, {
                    htmlFor: "confirmPassword",
                    children: [t("confirmPassword"), " *"]
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "relative",
                    children: [/* @__PURE__ */ jsx(Input, {
                      id: "confirmPassword",
                      name: "confirmPassword",
                      type: showConfirmPassword ? "text" : "password",
                      value: formData.confirmPassword,
                      onChange: handleInputChange,
                      className: "rounded-lg pr-10",
                      required: true
                    }), /* @__PURE__ */ jsx("button", {
                      type: "button",
                      onClick: () => setShowConfirmPassword(!showConfirmPassword),
                      className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground",
                      children: showConfirmPassword ? /* @__PURE__ */ jsx(EyeOff, {
                        className: "h-4 w-4"
                      }) : /* @__PURE__ */ jsx(Eye, {
                        className: "h-4 w-4"
                      })
                    })]
                  })]
                }), /* @__PURE__ */ jsxs(Button, {
                  type: "button",
                  onClick: handleNextStep,
                  className: "w-full",
                  children: [t("next"), " ", /* @__PURE__ */ jsx(ArrowRight, {
                    className: "ml-2 h-4 w-4"
                  })]
                })]
              }), signUpStep === 2 && /* @__PURE__ */ jsxs(Fragment, {
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "space-y-2",
                  children: [/* @__PURE__ */ jsxs(Label, {
                    htmlFor: "phoneNumber",
                    children: [t("phoneNumberLabel"), " *"]
                  }), /* @__PURE__ */ jsx(Input, {
                    id: "phoneNumber",
                    name: "phoneNumber",
                    type: "tel",
                    value: formData.phoneNumber,
                    onChange: handleInputChange,
                    placeholder: "+81 90-1234-5678",
                    className: "rounded-lg",
                    required: true
                  }), /* @__PURE__ */ jsx("p", {
                    className: "text-xs text-muted-foreground",
                    children: t("includeCountryCode")
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "flex space-x-2",
                  children: [/* @__PURE__ */ jsxs(Button, {
                    type: "button",
                    variant: "outline",
                    onClick: handlePrevStep,
                    className: "flex-1",
                    children: [/* @__PURE__ */ jsx(ArrowLeft, {
                      className: "mr-2 h-4 w-4"
                    }), " ", t("back")]
                  }), /* @__PURE__ */ jsxs(Button, {
                    type: "button",
                    onClick: handleNextStep,
                    className: "flex-1",
                    children: [t("next"), " ", /* @__PURE__ */ jsx(ArrowRight, {
                      className: "ml-2 h-4 w-4"
                    })]
                  })]
                })]
              }), signUpStep === 3 && /* @__PURE__ */ jsxs(Fragment, {
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "space-y-2",
                  children: [/* @__PURE__ */ jsxs(Label, {
                    htmlFor: "country",
                    children: [t("country"), " *"]
                  }), /* @__PURE__ */ jsxs(Select, {
                    value: formData.country,
                    onValueChange: (value) => setFormData({
                      ...formData,
                      country: value
                    }),
                    children: [/* @__PURE__ */ jsx(SelectTrigger, {
                      className: "rounded-lg",
                      children: /* @__PURE__ */ jsx(SelectValue, {
                        placeholder: t("selectCountryPlaceholder")
                      })
                    }), /* @__PURE__ */ jsx(SelectContent, {
                      className: "max-h-[300px]",
                      children: ALL_COUNTRIES.map((country) => /* @__PURE__ */ jsx(SelectItem, {
                        value: country,
                        children: country
                      }, country))
                    })]
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "space-y-2",
                  children: [/* @__PURE__ */ jsxs(Label, {
                    htmlFor: "state",
                    children: [t("stateLabel"), " *"]
                  }), /* @__PURE__ */ jsx(Input, {
                    id: "state",
                    name: "state",
                    type: "text",
                    value: formData.state,
                    onChange: handleInputChange,
                    placeholder: t("statePlaceholder"),
                    className: "rounded-lg",
                    required: true
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "space-y-2",
                  children: [/* @__PURE__ */ jsxs(Label, {
                    htmlFor: "city",
                    children: [t("cityLabel"), " *"]
                  }), /* @__PURE__ */ jsx(Input, {
                    id: "city",
                    name: "city",
                    type: "text",
                    value: formData.city,
                    onChange: handleInputChange,
                    placeholder: t("cityPlaceholder"),
                    className: "rounded-lg",
                    required: true
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "space-y-2",
                  children: [/* @__PURE__ */ jsxs(Label, {
                    htmlFor: "postalCode",
                    children: [t("postalCodeLabel"), " *"]
                  }), /* @__PURE__ */ jsx(Input, {
                    id: "postalCode",
                    name: "postalCode",
                    type: "text",
                    value: formData.postalCode,
                    onChange: handleInputChange,
                    placeholder: "100-0001",
                    className: "rounded-lg",
                    required: true
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "space-y-2",
                  children: [/* @__PURE__ */ jsxs(Label, {
                    htmlFor: "address",
                    children: [t("deliveryAddress"), " *"]
                  }), /* @__PURE__ */ jsx(Textarea, {
                    id: "address",
                    name: "address",
                    value: formData.address,
                    onChange: handleInputChange,
                    placeholder: t("deliveryAddressPlaceholder"),
                    className: "rounded-lg min-h-[80px]",
                    required: true
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "space-y-2",
                  children: [/* @__PURE__ */ jsx(Label, {
                    htmlFor: "addressNotes",
                    children: t("deliveryNotes")
                  }), /* @__PURE__ */ jsx(Textarea, {
                    id: "addressNotes",
                    name: "addressNotes",
                    value: formData.addressNotes,
                    onChange: handleInputChange,
                    placeholder: t("deliveryNotesPlaceholder"),
                    className: "rounded-lg min-h-[60px]"
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "flex space-x-2",
                  children: [/* @__PURE__ */ jsxs(Button, {
                    type: "button",
                    variant: "outline",
                    onClick: handlePrevStep,
                    className: "flex-1",
                    children: [/* @__PURE__ */ jsx(ArrowLeft, {
                      className: "mr-2 h-4 w-4"
                    }), " ", t("back")]
                  }), /* @__PURE__ */ jsx(Button, {
                    type: "submit",
                    className: "flex-1",
                    disabled: isLoading,
                    children: isLoading ? t("creatingAccount") : t("completeSignUp")
                  })]
                })]
              })]
            })
          )
        }), /* @__PURE__ */ jsxs("div", {
          className: "text-center space-y-2",
          children: [isLogin && /* @__PURE__ */ jsx(Link, {
            to: "/forgot-password",
            children: /* @__PURE__ */ jsx("p", {
              className: "text-sm text-primary hover:text-primary-hover cursor-pointer",
              children: t("forgotPasswordQuestion")
            })
          }), /* @__PURE__ */ jsxs("p", {
            className: "text-sm text-muted-foreground",
            children: [isLogin ? t("dontHaveAccountQuestion") : t("alreadyHaveAccountQuestion"), " ", /* @__PURE__ */ jsx("button", {
              type: "button",
              onClick: () => {
                setIsLogin(!isLogin);
                setSignUpStep(1);
              },
              className: "text-primary hover:text-primary-hover font-medium",
              children: isLogin ? t("signUp") : t("signIn")
            })]
          })]
        })]
      })]
    })
  });
};
const Auth_default = UNSAFE_withComponentProps(Auth);
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Auth_default
}, Symbol.toStringTag, { value: "Module" }));
const ForgotPassword = () => {
  const {
    resetPassword
  } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const {
    t
  } = useApp();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const {
      error
    } = await resetPassword(email);
    if (!error) {
      setEmailSent(true);
    }
    setIsLoading(false);
  };
  if (emailSent) {
    return /* @__PURE__ */ jsx("div", {
      className: "min-h-screen bg-[url(tile_background.png)] bg-repeat flex items-center justify-center px-4",
      children: /* @__PURE__ */ jsx(Card, {
        className: "w-full max-w-md bg-white/90 backdrop-blur-sm border-blue-200 shadow-xl",
        children: /* @__PURE__ */ jsx(CardContent, {
          className: "p-12 text-center",
          children: /* @__PURE__ */ jsxs("div", {
            className: "mb-6",
            children: [/* @__PURE__ */ jsx(Mail, {
              className: "w-16 h-16 text-blue-300 mx-auto mb-4"
            }), /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-bold text-gray-900 mb-4",
              children: t("checkYourEmail")
            }), /* @__PURE__ */ jsxs("p", {
              className: "text-gray-600 mb-8",
              children: [t("emailSentTo"), " ", /* @__PURE__ */ jsx("strong", {
                children: email
              })]
            }), /* @__PURE__ */ jsx("p", {
              className: "text-sm text-gray-500 mb-6",
              children: t("didntReceive")
            }), /* @__PURE__ */ jsx(Link, {
              to: "/auth",
              children: /* @__PURE__ */ jsxs(Button, {
                variant: "outline",
                className: "w-full",
                children: [/* @__PURE__ */ jsx(ArrowLeft, {
                  className: "w-4 h-4 mr-2"
                }), t("backToSignIn")]
              })
            })]
          })
        })
      })
    });
  }
  return /* @__PURE__ */ jsx("div", {
    className: "min-h-screen bg-[url(tile_background.png)] bg-repeat flex items-center justify-center px-4",
    children: /* @__PURE__ */ jsxs(Card, {
      className: "w-full max-w-md bg-white/90 backdrop-blur-sm border-blue-200 shadow-xl",
      children: [/* @__PURE__ */ jsxs(CardHeader, {
        className: "text-center",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex items-center justify-center space-x-2 mb-4",
          children: [/* @__PURE__ */ jsx("img", {
            src: "/aiyu_logo_small.png",
            alt: "Capybara Logo",
            className: "h-16 sm:h-16"
          }), /* @__PURE__ */ jsx("span", {
            className: "font-paytone text-5xl text-[#3b434d] ",
            children: "Aiyu Japan"
          })]
        }), /* @__PURE__ */ jsx(CardTitle, {
          className: "text-2xl font-bold text-gray-900",
          children: t("forgotPasswordTitle")
        }), /* @__PURE__ */ jsx("p", {
          className: "text-gray-600 mt-2",
          children: t("forgotPasswordSubtitle")
        })]
      }), /* @__PURE__ */ jsxs(CardContent, {
        className: "space-y-6",
        children: [/* @__PURE__ */ jsxs("form", {
          onSubmit: handleSubmit,
          className: "space-y-4",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "space-y-2",
            children: [/* @__PURE__ */ jsx(Label, {
              htmlFor: "email",
              children: t("emailLabel")
            }), /* @__PURE__ */ jsx(Input, {
              id: "email",
              name: "email",
              type: "email",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              className: "rounded-lg border-blue-200 focus:border-blue-300",
              placeholder: t("emailPlaceholder"),
              required: true
            })]
          }), /* @__PURE__ */ jsx(Button, {
            type: "submit",
            className: "w-full bg-blue-300 hover:bg-blue-400 text-white rounded-lg py-2 font-medium",
            disabled: isLoading,
            children: isLoading ? t("sending") : t("sendResetLink")
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "text-center",
          children: /* @__PURE__ */ jsx(Link, {
            to: "/auth",
            children: /* @__PURE__ */ jsxs(Button, {
              variant: "ghost",
              className: "text-blue-600 hover:text-blue-700",
              children: [/* @__PURE__ */ jsx(ArrowLeft, {
                className: "w-4 h-4 mr-2"
              }), t("backToSignIn")]
            })
          })
        })]
      })]
    })
  });
};
const ForgotPassword_default = UNSAFE_withComponentProps(ForgotPassword);
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ForgotPassword_default
}, Symbol.toStringTag, { value: "Module" }));
const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    toast: toast2
  } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");
    if (!accessToken || !refreshToken) {
      toast2({
        title: "Invalid reset link",
        description: "This password reset link is invalid or has expired.",
        variant: "destructive"
      });
      navigate("/auth");
    }
  }, [searchParams, navigate, toast2]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast2({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive"
      });
      return;
    }
    if (password.length < 6) {
      toast2({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    const {
      error
    } = await supabase.auth.updateUser({
      password
    });
    if (error) {
      toast2({
        title: "Password update failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast2({
        title: "Password updated!",
        description: "Your password has been successfully updated."
      });
      navigate("/");
    }
    setIsLoading(false);
  };
  return /* @__PURE__ */ jsx("div", {
    className: "min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4",
    children: /* @__PURE__ */ jsxs(Card, {
      className: "w-full max-w-md bg-white/90 backdrop-blur-sm border-blue-200 shadow-xl",
      children: [/* @__PURE__ */ jsxs(CardHeader, {
        className: "text-center",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex items-center justify-center space-x-2 mb-4",
          children: [/* @__PURE__ */ jsx("div", {
            className: "w-10 h-10 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full flex items-center justify-center",
            children: /* @__PURE__ */ jsx("span", {
              className: "text-white font-bold text-lg",
              children: "AJ"
            })
          }), /* @__PURE__ */ jsx("span", {
            className: "font-bold text-xl text-gray-800",
            children: "AJ"
          })]
        }), /* @__PURE__ */ jsx(CardTitle, {
          className: "text-2xl font-bold text-gray-900",
          children: "Reset Password"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-gray-600 mt-2",
          children: "Enter your new password below."
        })]
      }), /* @__PURE__ */ jsx(CardContent, {
        className: "space-y-6",
        children: /* @__PURE__ */ jsxs("form", {
          onSubmit: handleSubmit,
          className: "space-y-4",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "space-y-2",
            children: [/* @__PURE__ */ jsx(Label, {
              htmlFor: "password",
              children: "New Password"
            }), /* @__PURE__ */ jsxs("div", {
              className: "relative",
              children: [/* @__PURE__ */ jsx(Input, {
                id: "password",
                name: "password",
                type: showPassword ? "text" : "password",
                value: password,
                onChange: (e) => setPassword(e.target.value),
                className: "rounded-lg border-blue-200 focus:border-blue-300 pr-10",
                placeholder: "Enter new password",
                required: true
              }), /* @__PURE__ */ jsx("button", {
                type: "button",
                onClick: () => setShowPassword(!showPassword),
                className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700",
                children: showPassword ? /* @__PURE__ */ jsx(EyeOff, {
                  className: "h-4 w-4"
                }) : /* @__PURE__ */ jsx(Eye, {
                  className: "h-4 w-4"
                })
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-2",
            children: [/* @__PURE__ */ jsx(Label, {
              htmlFor: "confirmPassword",
              children: "Confirm New Password"
            }), /* @__PURE__ */ jsxs("div", {
              className: "relative",
              children: [/* @__PURE__ */ jsx(Input, {
                id: "confirmPassword",
                name: "confirmPassword",
                type: showConfirmPassword ? "text" : "password",
                value: confirmPassword,
                onChange: (e) => setConfirmPassword(e.target.value),
                className: "rounded-lg border-blue-200 focus:border-blue-300 pr-10",
                placeholder: "Confirm new password",
                required: true
              }), /* @__PURE__ */ jsx("button", {
                type: "button",
                onClick: () => setShowConfirmPassword(!showConfirmPassword),
                className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700",
                children: showConfirmPassword ? /* @__PURE__ */ jsx(EyeOff, {
                  className: "h-4 w-4"
                }) : /* @__PURE__ */ jsx(Eye, {
                  className: "h-4 w-4"
                })
              })]
            })]
          }), /* @__PURE__ */ jsx(Button, {
            type: "submit",
            className: "w-full bg-blue-300 hover:bg-blue-400 text-white rounded-lg py-2 font-medium",
            disabled: isLoading,
            children: isLoading ? "Updating..." : "Update Password"
          })]
        })
      })]
    })
  });
};
const ResetPassword_default = UNSAFE_withComponentProps(ResetPassword);
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ResetPassword_default
}, Symbol.toStringTag, { value: "Module" }));
const EmailVerification = () => {
  return /* @__PURE__ */ jsx("div", {
    className: "min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4",
    children: /* @__PURE__ */ jsx(Card, {
      className: "w-full max-w-md bg-white/90 backdrop-blur-sm border-blue-200 shadow-xl",
      children: /* @__PURE__ */ jsx(CardContent, {
        className: "p-12 text-center",
        children: /* @__PURE__ */ jsxs("div", {
          className: "mb-6",
          children: [/* @__PURE__ */ jsx(CheckCircle, {
            className: "w-16 h-16 text-green-500 mx-auto mb-4"
          }), /* @__PURE__ */ jsx("h2", {
            className: "text-2xl font-bold text-gray-900 mb-4",
            children: "Email Verified!"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-gray-600 mb-8",
            children: "Your email has been successfully verified. You can now access all features of your account."
          }), /* @__PURE__ */ jsx(Link, {
            to: "/",
            children: /* @__PURE__ */ jsx(Button, {
              className: "bg-blue-300 hover:bg-blue-400 text-white rounded-lg px-8 py-3",
              children: "Continue to Dashboard"
            })
          })]
        })
      })
    })
  });
};
const EmailVerification_default = UNSAFE_withComponentProps(EmailVerification);
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: EmailVerification_default
}, Symbol.toStringTag, { value: "Module" }));
const Collapsible = CollapsiblePrimitive.Root;
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;
const useCurrencyRates = () => {
  const [rates, setRates] = useState({
    usd: 69e-4,
    mxn: 0.14,
    clp: 6.56
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchRates();
  }, []);
  const fetchRates = async () => {
    try {
      const { data, error } = await supabase.from("currency_rates").select("currency_code, rate_to_jpy");
      if (error) throw error;
      if (data) {
        const ratesMap = {
          usd: 69e-4,
          mxn: 0.14,
          clp: 6.56
        };
        data.forEach((rate) => {
          const code = rate.currency_code.toLowerCase();
          if (code in ratesMap) {
            ratesMap[code] = Number(rate.rate_to_jpy);
          }
        });
        setRates(ratesMap);
      }
    } catch (error) {
      console.error("Error fetching currency rates:", error);
    } finally {
      setLoading(false);
    }
  };
  const convertCurrency = (amountJpy, currency) => {
    const converted = amountJpy * rates[currency];
    return converted.toFixed(2);
  };
  return { rates, loading, convertCurrency };
};
const PurchaseCalculator = () => {
  const { t } = useApp();
  const { convertCurrency, loading: ratesLoading } = useCurrencyRates();
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [purchaseResults, setPurchaseResults] = useState(null);
  const [isBenefitsOpen, setIsBenefitsOpen] = useState(false);
  useEffect(() => {
    const amount = parseFloat(purchaseAmount);
    if (amount && !ratesLoading) {
      const serviceFee = 500;
      const tax = (serviceFee + amount) * 0.1;
      const total = amount + serviceFee + tax;
      setPurchaseResults({
        productCost: amount,
        serviceFee,
        tax,
        total,
        usd: convertCurrency(total, "usd"),
        mxn: convertCurrency(total, "mxn"),
        clp: convertCurrency(total, "clp")
      });
    } else {
      setPurchaseResults(null);
    }
  }, [purchaseAmount, ratesLoading, convertCurrency]);
  return /* @__PURE__ */ jsxs(Card, { className: "rounded-3xl p-8 bg-white/90 backdrop-blur-sm shadow-lg border-2 border-white/30", children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsx(CardTitle, { className: "flex items-center gap-3 font-heading text-xl text-gray-800", children: t("purchaseCalculator") }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "number",
            placeholder: "¥100",
            value: purchaseAmount,
            onChange: (e) => setPurchaseAmount(e.target.value),
            className: "w-full rounded-full px-4 py-3 border-2 border-capybara-orange/20 focus:border-capybara-orange transition-all duration-300 font-body"
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 font-body text-center", children: t("enterPriceInYen") })
      ] }),
      purchaseResults && /* @__PURE__ */ jsxs("div", { className: "space-y-3 mt-4 animate-fade-in animate-scale-in", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-2xl p-4 transition-all duration-500", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-center", children: [
            "¥",
            purchaseResults.total.toLocaleString()
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-300 text-sm text-center", children: t("quotedPrice") })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center py-2 px-3 bg-capybara-cream rounded-full text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "font-body text-gray-700", children: t("serviceFeeLabel") }),
            /* @__PURE__ */ jsxs("span", { className: "font-heading font-bold text-gray-800", children: [
              purchaseResults.serviceFee.toLocaleString(),
              " yen"
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Collapsible, { open: isBenefitsOpen, onOpenChange: setIsBenefitsOpen, children: [
            /* @__PURE__ */ jsx(CollapsibleTrigger, { className: "w-full", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center py-2 px-3 bg-capybara-yellow rounded-full text-sm hover:bg-capybara-yellow/80 transition-colors cursor-pointer group", children: [
              /* @__PURE__ */ jsxs("span", { className: "font-body text-gray-700 flex items-center gap-2", children: [
                "👉 ",
                t("handlingFee"),
                " — ",
                t("viewBenefits"),
                /* @__PURE__ */ jsx(ChevronDown, { className: `w-4 h-4 transition-transform ${isBenefitsOpen ? "rotate-180" : ""}` })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "font-heading font-bold text-gray-800", children: [
                Math.round(purchaseResults.tax).toLocaleString(),
                " yen"
              ] })
            ] }) }),
            /* @__PURE__ */ jsx(CollapsibleContent, { children: /* @__PURE__ */ jsxs("div", { className: "mt-2 p-3 bg-capybara-cream/50 rounded-xl text-sm space-y-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 text-capybara-orange mt-0.5 flex-shrink-0" }),
                /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: t("handlingFeeBenefitConsolidation") })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 text-capybara-orange mt-0.5 flex-shrink-0" }),
                /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: t("handlingFeeBenefitStorage") })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 text-capybara-orange mt-0.5 flex-shrink-0" }),
                /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: t("handlingFeeBenefitPhotos") })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 text-capybara-orange mt-0.5 flex-shrink-0" }),
                /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: t("handlingFeeBenefitPackaging") })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 text-capybara-orange mt-0.5 flex-shrink-0" }),
                /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: t("handlingFeeBenefitSupport") })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "pt-2 border-t border-capybara-orange/20 mt-3", children: /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-600 font-medium", children: [
                "🧾 ",
                t("noHiddenFees")
              ] }) })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "border-t-2 border-capybara-orange pt-2 space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center py-2 px-3 rounded-full text-sm", style: { backgroundColor: "#c8effaff" }, children: [
              /* @__PURE__ */ jsx("span", { className: "font-body text-gray-700", children: "USD" }),
              /* @__PURE__ */ jsxs("span", { className: "font-heading font-bold text-gray-800", children: [
                "$",
                purchaseResults.usd
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center py-2 px-3 rounded-full text-sm hidden", style: { backgroundColor: "#c8effaff" }, children: [
              /* @__PURE__ */ jsx("span", { className: "font-body text-gray-700", children: "CLP" }),
              /* @__PURE__ */ jsx("span", { className: "font-heading font-bold text-gray-800", children: purchaseResults.clp })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center py-2 px-3 rounded-full text-sm hidden", style: { backgroundColor: "#c8effaff" }, children: [
              /* @__PURE__ */ jsx("span", { className: "font-body text-gray-700", children: "MXN" }),
              /* @__PURE__ */ jsx("span", { className: "font-heading font-bold text-gray-800", children: purchaseResults.mxn })
            ] })
          ] })
        ] })
      ] }),
      !purchaseResults && /* @__PURE__ */ jsxs("div", { className: "text-center py-8", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx("img", { src: "KapyCalculator.png", alt: "Capybara Calculator", className: "w-28 h-36 mx-auto mb-2" }) }),
        /* @__PURE__ */ jsx("p", { className: "font-body text-gray-600 text-sm", children: t("enterPriceToCalculate") })
      ] })
    ] })
  ] });
};
const RadioGroup = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    RadioGroupPrimitive.Root,
    {
      className: cn("grid gap-2", className),
      ...props,
      ref
    }
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;
const RadioGroupItem = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    RadioGroupPrimitive.Item,
    {
      ref,
      className: cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(RadioGroupPrimitive.Indicator, { className: "flex items-center justify-center", children: /* @__PURE__ */ jsx(Circle, { className: "h-2.5 w-2.5 fill-current text-current" }) })
    }
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
const Slider = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs(
  SliderPrimitive.Root,
  {
    ref,
    className: cn(
      "relative flex w-full touch-none select-none items-center",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx(SliderPrimitive.Track, { className: "relative h-2 w-full grow overflow-hidden rounded-full bg-secondary", children: /* @__PURE__ */ jsx(SliderPrimitive.Range, { className: "absolute h-full bg-primary" }) }),
      /* @__PURE__ */ jsx(SliderPrimitive.Thumb, { className: "block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" })
    ]
  }
));
Slider.displayName = SliderPrimitive.Root.displayName;
const useSystemSettings = () => {
  const [settings, setSettings] = useState({
    dhlFuelPercentage: 32
    // Default fallback
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchSettings();
  }, []);
  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from("system_settings").select("setting_key, setting_value").eq("setting_key", "dhl_fuel_percentage").maybeSingle();
      if (error) throw error;
      if (data) {
        setSettings({
          dhlFuelPercentage: parseFloat(data.setting_value) || 32
        });
      }
    } catch (error) {
      console.error("Error fetching system settings:", error);
    } finally {
      setLoading(false);
    }
  };
  return { settings, loading };
};
const ShippingCalculator = () => {
  const { t } = useApp();
  const { convertCurrency, loading: ratesLoading } = useCurrencyRates();
  const { settings: systemSettings, loading: settingsLoading } = useSystemSettings();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [shippingMethod, setShippingMethod] = useState("economic");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState([500]);
  const [shippingResults, setShippingResults] = useState(null);
  const weightRange = getWeightRange(shippingMethod);
  const zoneInfo = selectedCountry ? getZoneForCountry(selectedCountry) : null;
  const isDHLOnly = selectedCountry ? isDHLOnlyCountry(selectedCountry) : false;
  useEffect(() => {
    if (selectedCountry === "Paraguay") {
      setShippingMethod("paraguay");
    } else if (shippingMethod === "paraguay") {
      setShippingMethod("economic");
    }
  }, [selectedCountry]);
  useEffect(() => {
    if (isDHLOnly && shippingMethod !== "dhl") {
      setShippingMethod("dhl");
    }
  }, [isDHLOnly, shippingMethod]);
  const availableMethods = selectedCountry === "Paraguay" ? [{ value: "paraguay", label: "Paraguay Shipping" }] : isDHLOnly ? [{ value: "dhl", label: t("dhlShipping") }] : [
    { value: "economic", label: t("economicShipping") },
    { value: "express", label: t("expressShippingMethod") },
    { value: "dhl", label: t("dhlShipping") }
  ];
  useEffect(() => {
    if (selectedCountry && !ratesLoading && !settingsLoading) {
      const dimensions = (shippingMethod === "dhl" || shippingMethod === "paraguay") && length && width && height ? { L: Number(length), W: Number(width), H: Number(height) } : void 0;
      const cost = calculateShippingCostByCountry(
        selectedCountry,
        shippingMethod,
        weight[0],
        dimensions,
        shippingMethod === "dhl" ? systemSettings.dhlFuelPercentage : void 0
      );
      if (cost) {
        let totalCost = typeof cost === "number" ? cost : cost.total;
        if (shippingMethod === "dhl") {
          const handlingFee = 500;
          const tax = (totalCost + handlingFee) * 0.1;
          totalCost = totalCost + handlingFee + tax;
        }
        setShippingResults({
          shippingCost: totalCost,
          usd: convertCurrency(totalCost, "usd"),
          mxn: convertCurrency(totalCost, "mxn"),
          clp: convertCurrency(totalCost, "clp")
        });
      } else {
        setShippingResults(null);
      }
    } else {
      setShippingResults(null);
    }
  }, [selectedCountry, shippingMethod, weight, length, width, height, systemSettings, ratesLoading, settingsLoading, convertCurrency]);
  useEffect(() => {
    setWeight([weightRange.min]);
  }, [shippingMethod, weightRange.min]);
  const animatedTotal = useAnimatedNumber(shippingResults?.shippingCost || 0, 1e3);
  return /* @__PURE__ */ jsxs(Card, { className: "rounded-3xl p-8 bg-white/90 backdrop-blur-sm shadow-lg border-2 border-white/30", children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsx(CardTitle, { className: "flex items-center gap-3 font-heading text-xl text-gray-800 leading-tight flex-wrap", children: /* @__PURE__ */ jsx("span", { className: "whitespace-normal break-words", children: t("shippingCalculator") }) }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxs(Select, { value: selectedCountry, onValueChange: setSelectedCountry, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full rounded-full px-3 py-2 text-sm border-2 border-capybara-orange/20 focus:border-capybara-orange transition-all duration-300 font-body", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select Country" }) }),
          /* @__PURE__ */ jsx(SelectContent, { className: "rounded-2xl border-2 border-capybara-orange/20 max-h-[300px]", children: ALL_COUNTRIES.map((country) => /* @__PURE__ */ jsx(SelectItem, { value: country, children: /* @__PURE__ */ jsx("div", { className: "text-left leading-tight", children: country }) }, country)) })
        ] }),
        zoneInfo && !isDHLOnly && /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-600 font-body text-center", children: [
          "Zone ",
          zoneInfo.zone,
          ": ",
          zoneInfo.name
        ] }),
        isDHLOnly && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600 font-body text-center", children: "DHL Shipping Only" }),
        !zoneInfo && !isDHLOnly && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600 font-body text-center", children: "Select a country" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { className: "font-body text-sm text-gray-700", children: t("shippingMethods") }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: t("chooseShippingMethod") }),
        /* @__PURE__ */ jsx(
          RadioGroup,
          {
            value: shippingMethod,
            onValueChange: (v) => setShippingMethod(v),
            className: "space-y-2 mt-2",
            children: availableMethods.map((method) => /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 p-2 rounded-full bg-capybara-cream transition-colors", children: [
              /* @__PURE__ */ jsx(RadioGroupItem, { value: method.value, id: method.value, className: "w-3 h-3" }),
              /* @__PURE__ */ jsx(Label, { htmlFor: method.value, className: "flex-1 font-body cursor-pointer text-xs", children: /* @__PURE__ */ jsx("span", { className: "font-semibold", children: method.label }) })
            ] }, method.value))
          }
        )
      ] }),
      (shippingMethod === "dhl" || shippingMethod === "paraguay") && /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { className: "font-body text-sm text-gray-700", children: t("dimensionsLabel") }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "length", className: "text-xs", children: t("lengthLabel") }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "length",
                type: "number",
                min: "1",
                value: length,
                onChange: (e) => setLength(e.target.value),
                placeholder: "L",
                className: "rounded-full border-2 border-capybara-orange/20 focus:border-capybara-orange"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "width", className: "text-xs", children: t("widthLabel") }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "width",
                type: "number",
                min: "1",
                value: width,
                onChange: (e) => setWidth(e.target.value),
                placeholder: "W",
                className: "rounded-full border-2 border-capybara-orange/20 focus:border-capybara-orange"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "height", className: "text-xs", children: t("heightLabel") }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "height",
                type: "number",
                min: "1",
                value: height,
                onChange: (e) => setHeight(e.target.value),
                placeholder: "H",
                className: "rounded-full border-2 border-capybara-orange/20 focus:border-capybara-orange"
              }
            )
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { className: "font-body text-sm text-gray-700", children: t("selectWeight") }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "number",
              min: weightRange.min,
              max: weightRange.max,
              step: shippingMethod === "paraguay" ? 200 : 50,
              defaultValue: weight[0],
              onBlur: (e) => {
                const value = e.target.value.trim();
                if (value === "" || isNaN(Number(value))) {
                  setWeight([weightRange.min]);
                  e.target.value = String(weightRange.min);
                } else {
                  const numValue = Number(value);
                  if (numValue < weightRange.min) {
                    setWeight([weightRange.min]);
                    e.target.value = String(weightRange.min);
                  } else if (numValue > weightRange.max) {
                    setWeight([weightRange.max]);
                    e.target.value = String(weightRange.max);
                  } else {
                    setWeight([numValue]);
                  }
                }
              },
              className: "w-32"
            },
            `weight-${weight[0]}`
          ),
          /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground whitespace-nowrap", children: "g" }),
          /* @__PURE__ */ jsx(
            Slider,
            {
              value: weight,
              onValueChange: setWeight,
              min: weightRange.min,
              max: weightRange.max,
              step: shippingMethod === "paraguay" ? 200 : 50,
              className: "flex-1"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-end text-xs text-gray-600 font-body", children: /* @__PURE__ */ jsxs("span", { children: [
          weightRange.max.toLocaleString(),
          "g"
        ] }) })
      ] }),
      shippingResults && /* @__PURE__ */ jsxs("div", { className: "space-y-3 mt-4 animate-fade-in animate-scale-in", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-2xl p-4 transition-all duration-500", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-center", children: [
            animatedTotal.toLocaleString(),
            " yen"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-300 text-sm text-center", children: t("internationalShippingCost") })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2", children: /* @__PURE__ */ jsxs("div", { className: "border-t-2 border-capybara-orange pt-2 space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center py-2 px-3 bg-capybara-yellow rounded-full text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "font-body text-gray-700", children: "USD" }),
            /* @__PURE__ */ jsxs("span", { className: "font-heading font-bold text-gray-800", children: [
              "$",
              shippingResults.usd
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center py-2 px-3 bg-capybara-yellow rounded-full text-sm hidden", children: [
            /* @__PURE__ */ jsx("span", { className: "font-body text-gray-700", children: "CLP" }),
            /* @__PURE__ */ jsx("span", { className: "font-heading font-bold text-gray-800", children: shippingResults.clp })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center py-2 px-3 bg-capybara-yellow rounded-full text-sm hidden", children: [
            /* @__PURE__ */ jsx("span", { className: "font-body text-gray-700", children: "MXN" }),
            /* @__PURE__ */ jsx("span", { className: "font-heading font-bold text-gray-800", children: shippingResults.mxn })
          ] })
        ] }) })
      ] }),
      !shippingResults && /* @__PURE__ */ jsxs("div", { className: "text-center py-8", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx("img", { src: "KapyPlane.png", alt: "Capybara Plane", className: "w-28 h-36 mx-auto mb-2" }) }),
        /* @__PURE__ */ jsx("p", { className: "font-body text-gray-600 text-sm", children: t("enterDataToCalculate") })
      ] })
    ] })
  ] });
};
const Calculator = () => {
  const {
    t
  } = useApp();
  const [isShippingMode, setIsShippingMode] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return /* @__PURE__ */ jsx("div", {
    className: "min-h-screen py-8 animate-fade-in bg-[url(tile_background.png)] bg-repeat",
    children: /* @__PURE__ */ jsxs("div", {
      className: "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8",
      children: [/* @__PURE__ */ jsx("div", {
        className: "text-center mb-8 animate-scale-in",
        children: /* @__PURE__ */ jsx("h1", {
          className: "text-4xl font-heading font-bold text-gray-800 mb-4",
          children: t("calculatorBetaPage")
        })
      }), /* @__PURE__ */ jsx("div", {
        className: "flex justify-center mb-6",
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex flex-row items-center justify-center gap-3 sm:gap-6 px-4 sm:px-6 py-3 \r\n               rounded-full shadow-md bg-white/90 border border-[var(--capybara-yellow)] \r\n               w-full max-w-[22rem] sm:max-w-md",
          children: [/* @__PURE__ */ jsx("span", {
            className: `text-sm sm:text-base font-medium transition-colors text-center sm:text-right 
                  ${!isShippingMode ? "text-[var(--capybara-orange)] font-semibold" : "text-gray-800"}`,
            children: t("purchaseCalculator")
          }), /* @__PURE__ */ jsxs("label", {
            className: "relative inline-flex items-center cursor-pointer select-none",
            children: [/* @__PURE__ */ jsx("input", {
              type: "checkbox",
              checked: isShippingMode,
              onChange: () => setIsShippingMode(!isShippingMode),
              className: "sr-only peer"
            }), /* @__PURE__ */ jsx("div", {
              className: "\r\n      w-20 h-10 sm:w-24 sm:h-12\r\n      rounded-full bg-capybara-blue/20\r\n      shadow-inner transition-all duration-500\r\n      peer-checked:bg-capybara-blue/20\r\n    "
            }), /* @__PURE__ */ jsx("div", {
              className: "\r\n      absolute top-1 left-1\r\n      sm:top-1.5 sm:left-1.5\r\n      h-8 w-8 sm:h-9 sm:w-9\r\n      bg-capybara-cream border-2 border-capybara-orange/20\r\n      rounded-full flex items-center justify-center\r\n      shadow-md transition-transform duration-500\r\n      peer-checked:translate-x-[40px] sm:peer-checked:translate-x-[48px]\r\n    ",
              children: isShippingMode ? /* @__PURE__ */ jsx(Truck, {
                className: "h-4 w-4 text-gray-600 transition-transform duration-500 peer-checked:rotate-12"
              }) : /* @__PURE__ */ jsx(ShoppingCart, {
                className: "h-4 w-4 text-gray-600 transition-transform duration-500 peer-checked:rotate-12"
              })
            })]
          }), /* @__PURE__ */ jsx("span", {
            className: `text-sm sm:text-base font-medium transition-colors text-center sm:text-left 
                  ${isShippingMode ? "text-[var(--capybara-orange)] font-semibold" : "text-gray-800"}`,
            children: t("shippingCalculator")
          })]
        })
      }), /* @__PURE__ */ jsx("div", {
        className: "mt-6",
        children: isShippingMode ? /* @__PURE__ */ jsx(ShippingCalculator, {}) : /* @__PURE__ */ jsx(PurchaseCalculator, {})
      }), /* @__PURE__ */ jsx("div", {
        className: "text-center mt-8",
        children: /* @__PURE__ */ jsx("div", {
          className: "p-3 bg-white/90 rounded-full inline-block",
          children: /* @__PURE__ */ jsx("p", {
            className: "font-body font-bold text-gray-600 text-sm",
            children: t("calculatorDisclaimer")
          })
        })
      })]
    })
  });
};
const Calculator_default = UNSAFE_withComponentProps(Calculator);
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Calculator_default
}, Symbol.toStringTag, { value: "Module" }));
const StoreGuide = () => {
  const {
    t
  } = useApp();
  const [selectedCategory, setSelectedCategory] = useState("all");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const storeCategories = {
    general_and_anime_goods: [
      /* Marketplace General */
      {
        name: t("amazonJapan"),
        url: "https://www.amazon.co.jp/",
        description: t("amazonJapanDesc"),
        logo: "amazon.png"
      },
      {
        name: t("rakuten"),
        url: "https://www.rakuten.co.jp/",
        description: t("rakutenDesc"),
        logo: "rakuten.png"
      },
      {
        name: t("yahooShopping"),
        url: "https://paypayfleamarket.yahoo.co.jp/",
        description: t("yahooShoppingDesc"),
        logo: "yahoo.png"
      },
      {
        name: t("mercariJapan"),
        url: "https://jp.mercari.com/",
        description: t("mercariJapanDesc"),
        logo: "mercari.png"
      },
      {
        name: t("buyma"),
        url: "https://www.buyma.com/",
        description: t("buymaDesc"),
        logo: "buyma.png"
      }
    ],
    official_anime_stores: [
      /* Anime, Manga y Merchandising */
      {
        name: t("surugaya"),
        url: "https://www.suruga-ya.jp/",
        description: t("surugayaDesc"),
        logo: "surugaya.png"
      },
      {
        name: t("mandarake"),
        url: "https://www.mandarake.co.jp/",
        description: t("mandarakeDesc"),
        logo: "mandarake.png"
      },
      {
        name: t("animate"),
        url: "https://www.animate-onlineshop.jp/",
        description: t("animateDesc"),
        logo: "animate.png"
      },
      {
        name: t("jumpShop"),
        url: "https://www.googleadservices.com/pagead/aclk?sa=L&ai=DChcSEwjcm66vh5-KAxUal7kFHUkQByQYABAAGgJ0bQ",
        description: t("jumpShopDesc"),
        logo: "jump.png"
      },
      {
        name: t("chiikawaStore"),
        url: "https://chiikawamarket.jp/",
        description: t("chiikawaStoreDesc"),
        logo: "chiikawa.png"
      },
      {
        name: t("cdJapan"),
        url: "https://www.cdjapan.co.jp/",
        description: t("cdJapanDesc"),
        logo: "CDJapan.png"
      },
      {
        name: t("evangelionStore"),
        url: "https://www.evastore.jp/shop/",
        description: t("evangelionStoreDesc"),
        logo: "eva.png"
      },
      {
        name: t("pokemonCenter"),
        url: "https://www.pokemoncenter-online.com/",
        description: t("pokemonCenterDesc"),
        logo: "pokemon.png"
      },
      {
        name: t("sailorMoonStore"),
        url: "https://sailormoon-store.com/shop/default.aspx",
        description: t("sailorMoonStoreDesc"),
        logo: "sailormoon.png"
      },
      {
        name: t("sanrioStore"),
        url: "https://shop.sanrio.co.jp/",
        description: t("sanrioStoreDesc"),
        logo: "sanrio.png"
      },
      {
        name: t("studioGhibliStore"),
        url: "https://www.donguri-sora.com/",
        description: t("studioGhibliStoreDesc"),
        logo: "ghibli.png"
      },
      {
        name: t("usjStore"),
        url: "https://www.onlinestore.usj.co.jp/",
        description: t("usjStoreDesc"),
        logo: "usj.png"
      },
      {
        name: t("disneyStore"),
        url: "https://store.disney.co.jp/",
        description: t("disneyStoreDesc"),
        logo: "disney.png"
      }
    ],
    figures_and_collectibles: [
      /* Figuras y Juguetes de Colección */
      {
        name: t("mediaWorld"),
        url: "https://mediaworld.co.jp/?srsltid=AfmBOorw5PlhviizHbBrw5PGUDZ4FADX9GImZWgxrTScP6BfAt30h7Oe",
        description: t("mediaWorldDesc"),
        logo: "mediaworld.png"
      },
      {
        name: t("banpresto"),
        url: "https://bsp-prize.jp/",
        description: t("banprestoDesc"),
        logo: "banpresto.png"
      },
      {
        name: t("popMart"),
        url: "https://www.popmart.co.jp/",
        description: t("popMartDesc"),
        logo: "popmart.png"
      },
      {
        name: t("sylvanianFamilies"),
        url: "https://www.sylvanianfamilies.com/ja-jp/",
        description: t("sylvanianFamiliesDesc"),
        logo: "sylvanian.png"
      },
      {
        name: t("amiAmi"),
        url: "https://www.amiami.jp/",
        description: t("amiAmiDesc"),
        logo: "amiami.png"
      },
      {
        name: t("goodSmileOnline"),
        url: "https://www.goodsmile.com/ja",
        description: t("goodSmileOnlineDesc"),
        logo: "goodsmile.png"
      }
    ],
    fashion_and_lifestyle: [
      /* Ropa y Accesorios */
      {
        name: t("uniqlo"),
        url: "https://www.uniqlo.com/jp/ja/",
        description: t("uniqloDesc"),
        logo: "uniqlo.png"
      },
      {
        name: t("gu"),
        url: "https://www.gu-global.com/jp/ja/",
        description: t("guDesc"),
        logo: "gu.png"
      },
      {
        name: t("zozotown"),
        url: "https://zozo.jp/",
        description: t("zozotownDesc"),
        logo: "zozo.png"
      },
      {
        name: t("graniph"),
        url: "https://www.graniph.com/",
        description: t("graniphDesc"),
        logo: "graniph.png"
      },
      {
        name: t("weverseShop"),
        url: "https://shop.weverse.io/ja/home",
        description: t("weverseShopDesc"),
        logo: "weverse.png"
      },
      {
        name: t("btsOfficialShop"),
        url: "https://bts-officialshop.jp/",
        description: t("btsOfficialShopDesc"),
        logo: "bts.png"
      },
      {
        name: t("newEra"),
        url: "https://www.neweracap.jp/",
        description: t("newEraDesc"),
        logo: "newera.png"
      },
      {
        name: t("onitsukaTiger"),
        url: "https://www.onitsukatiger.com/jp",
        description: t("onitsukaTigerDesc"),
        logo: "onitsuka.png"
      },
      {
        name: t("crocsJapan"),
        url: "https://www.crocs.co.jp/",
        description: t("crocsJapanDesc"),
        logo: "crocs.png"
      },
      {
        name: t("humanMadeJapan"),
        url: "https://humanmade.jp/",
        description: t("humanMadeJapanDesc"),
        logo: "humanmade.png"
      },
      {
        name: t("adidasJapan"),
        url: "https://www.adidas.jp/",
        description: t("adidasJapanDesc"),
        logo: "adidas.png"
      },
      {
        name: t("nikeJapan"),
        url: "https://nike.jp/",
        description: t("nikeJapanDesc"),
        logo: "nike.png"
      },
      {
        name: t("stripeClub"),
        url: "https://stripe-club.com/",
        description: t("stripeClubDesc"),
        logo: "stripe.png"
      }
    ],
    household_and_misc: [
      /* Artículos para el Hogar y Decoración */
      {
        name: t("daisoJapan"),
        url: "https://jp.daisonet.com",
        description: t("daisoJapanDesc"),
        logo: "daiso.png"
      },
      {
        name: t("nitori"),
        url: "https://www.nitori-net.jp/ec/",
        description: t("nitoriDesc"),
        logo: "nitori.png"
      },
      {
        name: t("loft"),
        url: "https://www.loft.co.jp/",
        description: t("loftDesc"),
        logo: "loft.png"
      },
      {
        name: t("palCloset"),
        url: "https://www.palcloset.jp/",
        description: t("palClosetDesc"),
        logo: "palcloset.png"
      },
      {
        name: t("yodobashiCamera"),
        url: "https://www.yodobashi.com/",
        description: t("yodobashiCameraDesc"),
        logo: "yodobashi.png"
      },
      {
        name: t("mujiJapan"),
        url: "https://www.muji.com/jp/ja/store",
        description: t("mujiJapanDesc"),
        logo: "muji.png"
      }
    ],
    beauty_and_cosmetics: [
      /* Belleza y Cosméticos */
      {
        name: t("oliveYoungGlobal"),
        url: "https://global.oliveyoung.com/",
        description: t("oliveYoungGlobalDesc"),
        logo: "oliveyoung.png"
      },
      {
        name: t("cosmeCom"),
        url: "https://www.cosme.com/",
        description: t("cosmeComDesc"),
        logo: "cosme.png"
      },
      {
        name: t("amazonJapan"),
        url: "https://www.amazon.co.jp/",
        description: t("amazonJapanDesc"),
        logo: "amazon.png"
      },
      {
        name: t("rakuten"),
        url: "https://www.rakuten.co.jp/",
        description: t("rakutenDesc"),
        logo: "rakuten.png"
      }
    ]
  };
  const categoryLabels = {
    all: t("allCategories"),
    general_and_anime_goods: t("generalMarketplace"),
    official_anime_stores: t("animeMangaMerchandising"),
    fashion_and_lifestyle: t("fashionAccessories"),
    household_and_misc: t("householdDecoration"),
    beauty_and_cosmetics: t("beautyCosmetics"),
    figures_and_collectibles: t("figuresCollectibles")
  };
  const getFilteredStores = () => {
    if (selectedCategory === "all") {
      return Object.entries(storeCategories).flatMap(([category, stores]) => stores.map((store) => ({
        ...store,
        category
      })));
    }
    return storeCategories[selectedCategory]?.map((store) => ({
      ...store,
      category: selectedCategory
    })) || [];
  };
  const renderStoreCard = (store, index) => /* @__PURE__ */ jsx(Card, {
    className: "bg-white/90 backdrop-blur-sm border-blue-200 shadow-md animate-fade-in",
    style: {
      animationDelay: `${index * 0.1}s`
    },
    children: /* @__PURE__ */ jsx(CardContent, {
      className: "p-4",
      children: /* @__PURE__ */ jsxs("div", {
        className: "flex items-start gap-3",
        children: [/* @__PURE__ */ jsx("div", {
          className: "w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 border overflow-hidden",
          children: store.logo ? /* @__PURE__ */ jsx("img", {
            src: store.logo,
            alt: `${store.name} logo`,
            className: "w-full h-full object-cover"
          }) : /* @__PURE__ */ jsx("div", {
            className: "text-xs text-gray-400 text-center",
            children: "LOGO"
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex-1",
          children: [/* @__PURE__ */ jsx("h4", {
            className: "font-bold text-gray-900 mb-2",
            children: store.name
          }), /* @__PURE__ */ jsx("p", {
            className: "text-gray-600 text-sm",
            children: store.description
          })]
        }), /* @__PURE__ */ jsx("a", {
          href: store.url,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "text-blue-400 hover:text-blue-600 transition-colors duration-300 flex-shrink-0",
          children: /* @__PURE__ */ jsx(ExternalLink, {
            className: "w-5 h-5"
          })
        })]
      })
    })
  }, `${selectedCategory}-${index}`);
  return /* @__PURE__ */ jsx("div", {
    className: "min-h-screen bg-[url(tile_background.png)] bg-repeat py-8 animate-fade-in",
    children: /* @__PURE__ */ jsxs("div", {
      className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "text-center mb-8 animate-scale-in",
        children: [/* @__PURE__ */ jsx("div", {
          className: "flex justify-center mb-4",
          children: /* @__PURE__ */ jsx("img", {
            src: "KapyShoppingBags.png",
            alt: "Capybara Logo",
            className: "w-32"
          })
        }), /* @__PURE__ */ jsx("h1", {
          className: "text-3xl font-bold text-gray-900 mb-4",
          children: t("storeGuideTitle")
        }), /* @__PURE__ */ jsx("p", {
          className: "text-gray-600",
          children: t("storeGuideDescription")
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "mb-6",
        children: /* @__PURE__ */ jsx("div", {
          className: "max-w-md mx-auto",
          children: /* @__PURE__ */ jsxs(Select, {
            value: selectedCategory,
            onValueChange: setSelectedCategory,
            children: [/* @__PURE__ */ jsx(SelectTrigger, {
              className: "w-full",
              children: /* @__PURE__ */ jsx(SelectValue, {
                placeholder: t("selectCategory")
              })
            }), /* @__PURE__ */ jsx(SelectContent, {
              children: Object.entries(categoryLabels).map(([key, label]) => /* @__PURE__ */ jsx(SelectItem, {
                value: key,
                children: label
              }, key))
            })]
          })
        })
      }), /* @__PURE__ */ jsx("div", {
        className: "space-y-8",
        children: /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("h3", {
            className: "text-2xl font-bold text-gray-900 mb-4",
            children: categoryLabels[selectedCategory]
          }), /* @__PURE__ */ jsx("div", {
            className: "grid md:grid-cols-2 gap-4",
            children: getFilteredStores().map((store, index) => renderStoreCard(store, index))
          })]
        })
      })]
    })
  });
};
const StoreGuide_default = UNSAFE_withComponentProps(StoreGuide);
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: StoreGuide_default
}, Symbol.toStringTag, { value: "Module" }));
function Skeleton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn("animate-pulse rounded-md bg-muted", className),
      ...props
    }
  );
}
const ProtectedRoute = ({
  children,
  requireAdmin = false,
  fallbackMessage
}) => {
  const { user, loading, isAdmin, userRole } = useAuth();
  const { t } = useApp();
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-[url(tile_background.png)] bg-repeat animate-fade-in flex items-center justify-center", children: /* @__PURE__ */ jsx(Loader2, { className: "w-8 h-8 animate-spin text-blue-300" }) });
  }
  if (!user) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-[url(tile_background.png)] bg-repeat animate-fade-in py-8", children: /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx(Card, { className: "bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-12 text-center", children: [
      /* @__PURE__ */ jsx(Lock, { className: "w-16 h-16 text-blue-300 mx-auto mb-6" }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4", children: t("loginRequired") }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-8", children: t("pleaseSignInToAccess") }),
      /* @__PURE__ */ jsx(Link, { to: "/auth", children: /* @__PURE__ */ jsx(Button, { className: "bg-blue-300 hover:bg-blue-400 text-white rounded-full px-8 py-3", children: t("signIn") }) })
    ] }) }) }) });
  }
  if (requireAdmin && !isAdmin) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8", children: /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx(Card, { className: "bg-white/90 backdrop-blur-sm border-red-200 shadow-lg", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-12 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsx("span", { className: "text-6xl", children: "🚫" }) }),
      /* @__PURE__ */ jsx(Lock, { className: "w-16 h-16 text-red-300 mx-auto mb-6" }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4", children: t("adminAccessRequired") }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4", children: fallbackMessage || t("defaultFallbackMessage") }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 mb-8", children: [
        t("currentRole"),
        ": ",
        userRole || t("loading")
      ] }),
      /* @__PURE__ */ jsx(Link, { to: "/dashboard", children: /* @__PURE__ */ jsx(Button, { className: "bg-blue-300 hover:bg-blue-400 text-white rounded-full px-8 py-3", children: t("backToDashboard") }) })
    ] }) }) }) });
  }
  return /* @__PURE__ */ jsx(Fragment, { children });
};
const DashboardContent = () => {
  const {
    user,
    loading,
    isAdmin,
    userRole
  } = useAuth();
  const navigate = useNavigate();
  console.log("Dashboard - user:", user?.id, "loading:", loading, "userRole:", userRole, "isAdmin:", isAdmin);
  useEffect(() => {
    if (user && userRole !== null) {
      console.log("Dashboard - redirecting based on role:", userRole);
      if (userRole === "admin") {
        navigate("/admin-dashboard", {
          replace: true
        });
      } else {
        navigate("/user-dashboard", {
          replace: true
        });
      }
    }
  }, [user, userRole, navigate]);
  if (loading) {
    return /* @__PURE__ */ jsx("div", {
      className: "min-h-screen bg-[url(tile_background.png)] bg-repeat animate-fade-in flex items-center justify-center",
      children: /* @__PURE__ */ jsxs("div", {
        className: "flex flex-col items-center space-y-3",
        children: [/* @__PURE__ */ jsx(Loader2, {
          className: "w-8 h-8 animate-spin text-blue-300"
        }), /* @__PURE__ */ jsx(Skeleton, {
          className: "h-8 w-52 mb-2"
        }), /* @__PURE__ */ jsx(Skeleton, {
          className: "h-5 w-32"
        })]
      })
    });
  }
  if (user && userRole === null) {
    return /* @__PURE__ */ jsx("div", {
      className: "min-h-screen bg-[url(tile_background.png)] bg-repeat animate-fade-in flex items-center justify-center",
      children: /* @__PURE__ */ jsxs("div", {
        className: "flex flex-col items-center space-y-3",
        children: [/* @__PURE__ */ jsx(Loader2, {
          className: "w-8 h-8 animate-spin text-blue-400"
        }), /* @__PURE__ */ jsx(Skeleton, {
          className: "h-8 w-48 mb-2"
        }), /* @__PURE__ */ jsx(Skeleton, {
          className: "h-5 w-44"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-sm text-gray-500",
          children: "Loading user role..."
        })]
      })
    });
  }
  if (user && userRole) {
    return /* @__PURE__ */ jsx("div", {
      className: "min-h-screen bg-[url(tile_background.png)] bg-repeat animate-fade-in flex items-center justify-center",
      children: /* @__PURE__ */ jsxs("div", {
        className: "flex flex-col items-center space-y-3",
        children: [/* @__PURE__ */ jsx(Loader2, {
          className: "w-8 h-8 animate-spin text-blue-400"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-sm text-gray-500",
          children: "Redirecting to dashboard..."
        })]
      })
    });
  }
  return null;
};
const Dashboard = () => {
  return /* @__PURE__ */ jsx(ProtectedRoute, {
    children: /* @__PURE__ */ jsx(DashboardContent, {})
  });
};
const Dashboard_default = UNSAFE_withComponentProps(Dashboard);
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Dashboard_default
}, Symbol.toStringTag, { value: "Module" }));
const Switch = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SwitchPrimitives.Root,
  {
    className: cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    ),
    ...props,
    ref,
    children: /* @__PURE__ */ jsx(
      SwitchPrimitives.Thumb,
      {
        className: cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        )
      }
    )
  }
));
Switch.displayName = SwitchPrimitives.Root.displayName;
const JapaneseAddressCard = ({ userId, username }) => {
  const [isRomaji, setIsRomaji] = useState(false);
  const [fadeKey, setFadeKey] = useState(0);
  const { t } = useApp();
  const handleCopy = (label, value) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    toast({
      title: t("japaneseAddresstoastCopied"),
      description: `${label}: ${value}`
    });
  };
  const handleToggle = (checked) => {
    setIsRomaji(checked);
    setFadeKey((prev) => prev + 1);
  };
  const japaneseData = {
    username: username || "",
    prefecture: "大阪府大阪市淀川区",
    street: "西中島 6丁目2-3",
    building: `チサン第7-903号室 (${userId})`,
    postal: "〒532-0011",
    phone: "090-7238-0062"
  };
  const romajiData = {
    username: username || "",
    prefecture: "Osaka, Osaka-shi Yodogawa-ku",
    street: "Nishinakajima 6-2-3",
    building: `Chisun 7th #903 (${userId})`,
    postal: "532-0011",
    phone: "090-7238-0062"
  };
  const data = isRomaji ? romajiData : japaneseData;
  return /* @__PURE__ */ jsxs(Card, { className: "max-w-4xl border border-gray-200 shadow-sm mt-5", children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-col items-start text-left space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx(MapPin, { className: "h-5 w-5 text-capybara-orange" }),
        /* @__PURE__ */ jsx(CardTitle, { children: t("japaneseAddresstitle") })
      ] }),
      userId && /* @__PURE__ */ jsx("div", { className: "flex justify-center w-full", children: /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => handleCopy("User ID", userId),
          className: "flex items-center gap-2 bg-capybara-orange text-black font-mono px-4 py-2 rounded-full text-sm hover:opacity-90 transition",
          children: [
            /* @__PURE__ */ jsx("span", { children: userId }),
            /* @__PURE__ */ jsx(Copy, { className: "h-3.5 w-3.5" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground text-center w-full", children: t("japaneseAddressuserCodeNote") })
    ] }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center gap-4", children: [
        /* @__PURE__ */ jsx(
          Label,
          {
            className: `text-sm transition-colors duration-300 ${!isRomaji ? "text-capybara-orange font-semibold" : "text-muted-foreground"}`,
            children: t("japaneseAddresstoggleJapanese")
          }
        ),
        /* @__PURE__ */ jsx(
          Switch,
          {
            checked: isRomaji,
            onCheckedChange: handleToggle,
            className: "transition-colors duration-300 data-[state=checked]:bg-capybara-orange"
          }
        ),
        /* @__PURE__ */ jsx(
          Label,
          {
            className: `text-sm transition-colors duration-300 ${isRomaji ? "text-capybara-orange font-semibold" : "text-muted-foreground"}`,
            children: t("japaneseAddresstoggleRomaji")
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "border rounded-lg divide-y text-sm transition-opacity duration-500 opacity-100 animate-fade-in",
          children: [
            { label: t("japaneseAddresslabelsname"), value: data.username },
            { label: t("japaneseAddresslabelsprefectureCity"), value: data.prefecture },
            { label: t("japaneseAddresslabelsstreet"), value: data.street },
            { label: t("japaneseAddresslabelsbuilding"), value: data.building },
            { label: t("japaneseAddresslabelspostalCode"), value: data.postal },
            { label: t("japaneseAddresslabelsphone"), value: data.phone }
          ].map((item) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex justify-between items-center p-3 hover:bg-muted/40 transition-colors cursor-pointer group",
              onClick: () => handleCopy(item.label, item.value),
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 font-medium text-gray-800", children: [
                  item.label,
                  /* @__PURE__ */ jsx(Copy, { className: "h-3.5 w-3.5 opacity-50 group-hover:opacity-100 transition-opacity" })
                ] }),
                /* @__PURE__ */ jsx("span", { children: item.value })
              ]
            },
            item.label
          ))
        },
        fadeKey
      ),
      /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground leading-relaxed", children: /* @__PURE__ */ jsx("p", { children: t("japaneseAddressexplanation") }) }),
      /* @__PURE__ */ jsxs("div", { className: "border-t pt-3 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold text-red-600 mb-1", children: t("japaneseAddresswarningsTitle") }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 space-y-1", children: [
          /* @__PURE__ */ jsx("li", { children: t("japaneseAddresswarnings0") }),
          /* @__PURE__ */ jsx("li", { children: t("japaneseAddresswarnings1") }),
          /* @__PURE__ */ jsx("li", { children: t("japaneseAddresswarnings2") })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border-t pt-3 text-sm text-muted-foreground leading-relaxed space-y-2", children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold text-red-600 mb-1", children: t("japaneseAddressrulesTitle") }),
        /* @__PURE__ */ jsx("p", { children: t("japaneseAddressrulesIntro") }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 space-y-1", children: [
          /* @__PURE__ */ jsx("li", { children: t("japaneseAddressrules0") }),
          /* @__PURE__ */ jsx("li", { children: t("japaneseAddressrules1") }),
          /* @__PURE__ */ jsx("li", { children: t("japaneseAddressrules2") }),
          /* @__PURE__ */ jsx("li", { children: t("japaneseAddressrules3") })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-3", children: t("japaneseAddressrulesBottom") })
      ] })
    ] })
  ] });
};
const ProfileView = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { t } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [displayData, setDisplayData] = useState({
    user_personal_id: "",
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
    address_notes: "",
    country: "",
    postal_code: "",
    city: "",
    state: ""
  });
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
    address_notes: "",
    country: "",
    postal_code: "",
    city: "",
    state: ""
  });
  useEffect(() => {
    loadProfile();
  }, [user]);
  useEffect(() => {
    if (profile) {
      const data = {
        user_personal_id: profile.user_personal_id || "",
        full_name: profile.full_name || "",
        email: profile.email || user?.email || "",
        phone_number: profile.phone_number || "",
        address: profile.address || "",
        address_notes: profile.address_notes || "",
        country: profile.country || "",
        postal_code: profile.postal_code || "",
        city: profile.city || "",
        state: profile.state || ""
      };
      setDisplayData(data);
      setFormData({
        full_name: data.full_name,
        email: data.email,
        phone_number: data.phone_number,
        address: data.address,
        address_notes: data.address_notes,
        country: data.country,
        postal_code: data.postal_code,
        city: data.city,
        state: data.state
      });
    }
  }, [profile, user]);
  const loadProfile = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (error) throw error;
      if (data) {
        const profileData = {
          user_personal_id: data.user_personal_id || "",
          full_name: data.full_name || "",
          email: data.email || user.email || "",
          phone_number: data.phone_number || "",
          address: data.address || "",
          address_notes: data.address_notes || "",
          country: data.country || "",
          postal_code: data.postal_code || "",
          city: data.city || "",
          state: data.state || ""
        };
        setDisplayData(profileData);
        setFormData({
          full_name: profileData.full_name,
          email: profileData.email,
          phone_number: profileData.phone_number,
          address: profileData.address,
          address_notes: profileData.address_notes,
          country: profileData.country,
          postal_code: profileData.postal_code,
          city: profileData.city,
          state: profileData.state
        });
      }
    } catch (error) {
      toast({ title: "Error", description: t("errorLoadingProfile"), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Error", description: t("mustBeLoggedIn"), variant: "destructive" });
      return;
    }
    if (!formData.full_name || !formData.phone_number || !formData.address || !formData.country || !formData.postal_code) {
      toast({ title: "Error", description: t("fillAllRequired"), variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      const { data: existingProfile } = await supabase.from("profiles").select("id").eq("id", user.id).maybeSingle();
      let error;
      if (existingProfile) {
        const { error: updateError } = await supabase.from("profiles").update({
          full_name: formData.full_name,
          email: formData.email,
          phone_number: formData.phone_number,
          address: formData.address,
          address_notes: formData.address_notes || null,
          country: formData.country,
          postal_code: formData.postal_code,
          city: formData.city,
          state: formData.state,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }).eq("id", user.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from("profiles").insert({
          id: user.id,
          full_name: formData.full_name,
          email: formData.email,
          phone_number: formData.phone_number,
          address: formData.address,
          address_notes: formData.address_notes || null,
          country: formData.country,
          postal_code: formData.postal_code,
          city: formData.city,
          state: formData.state
        });
        error = insertError;
      }
      if (error) throw error;
      setDisplayData({ ...displayData, ...formData });
      setIsEditing(false);
      toast({ title: "Success", description: t("savingSuccess") });
      await refreshProfile();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || t("savingError"),
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  const handleCancel = () => {
    setFormData({ ...displayData });
    setIsEditing(false);
  };
  const handleEdit = () => {
    setFormData({ ...displayData });
    setIsEditing(true);
    if (!open) setOpen(true);
  };
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-8", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" }) });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Card, { className: "max-w-4xl", children: /* @__PURE__ */ jsxs(Collapsible, { open, onOpenChange: setOpen, children: [
      /* @__PURE__ */ jsx(CollapsibleTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
        CardHeader,
        {
          className: "flex flex-row items-center justify-between cursor-pointer hover:bg-muted/40 transition-colors rounded-t-lg select-none",
          children: [
            /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center", children: [
              /* @__PURE__ */ jsx(User, { className: "mr-2 h-5 w-5 text-capybara-orange" }),
              t("profileInformation")
            ] }),
            /* @__PURE__ */ jsx(ChevronDown, { className: "h-5 w-5 transition-transform duration-200 data-[state=open]:rotate-180" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsx(CollapsibleContent, { className: "overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up", children: /* @__PURE__ */ jsx(CardContent, { children: isEditing ? /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        displayData.user_personal_id && /* @__PURE__ */ jsxs("div", { className: "space-y-2 bg-muted/50 p-4 rounded-lg border", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-muted-foreground text-sm", children: "User ID" }),
          /* @__PURE__ */ jsx("p", { className: "font-mono font-semibold text-lg", children: displayData.user_personal_id })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "full_name", children: [
              t("fullNameLabel"),
              " *"
            ] }),
            /* @__PURE__ */ jsx(Input, { id: "full_name", name: "full_name", value: formData.full_name, onChange: handleInputChange, required: true })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "email", children: [
              t("emailLabel"),
              " *"
            ] }),
            /* @__PURE__ */ jsx(Input, { id: "email", name: "email", type: "email", value: formData.email, onChange: handleInputChange, required: true })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "phone_number", children: [
              t("phoneNumberLabel"),
              " *"
            ] }),
            /* @__PURE__ */ jsx(Input, { id: "phone_number", name: "phone_number", type: "tel", value: formData.phone_number, onChange: handleInputChange, required: true })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "country", children: [
              t("countryLabel"),
              " *"
            ] }),
            /* @__PURE__ */ jsxs(Select, { value: formData.country, onValueChange: (value) => setFormData({ ...formData, country: value }), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: t("selectCountryPlaceholder") }) }),
              /* @__PURE__ */ jsx(SelectContent, { className: "max-h-[300px]", children: ALL_COUNTRIES.map((country) => /* @__PURE__ */ jsx(SelectItem, { value: country, children: country }, country)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "state", children: [
              t("stateLabel"),
              " *"
            ] }),
            /* @__PURE__ */ jsx(Input, { id: "state", name: "state", value: formData.state, onChange: handleInputChange, required: true })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "city", children: [
              t("cityLabel"),
              " *"
            ] }),
            /* @__PURE__ */ jsx(Input, { id: "city", name: "city", value: formData.city, onChange: handleInputChange, required: true })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "postal_code", children: [
              t("postalCodeLabel"),
              " *"
            ] }),
            /* @__PURE__ */ jsx(Input, { id: "postal_code", name: "postal_code", value: formData.postal_code, onChange: handleInputChange, required: true })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "address", children: [
            t("deliveryAddress"),
            " *"
          ] }),
          /* @__PURE__ */ jsx(Textarea, { id: "address", name: "address", value: formData.address, onChange: handleInputChange, required: true })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "address_notes", children: t("deliveryNotes") }),
          /* @__PURE__ */ jsx(Textarea, { id: "address_notes", name: "address_notes", value: formData.address_notes, onChange: handleInputChange })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 justify-end", children: [
          /* @__PURE__ */ jsxs(Button, { type: "button", variant: "outline", onClick: handleCancel, disabled: isSaving, children: [
            /* @__PURE__ */ jsx(X, { className: "mr-2 h-4 w-4" }),
            t("cancelButton")
          ] }),
          /* @__PURE__ */ jsx(Button, { type: "submit", disabled: isSaving, children: isSaving ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
            t("saving")
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Save, { className: "mr-2 h-4 w-4" }),
            t("saveButton")
          ] }) })
        ] })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        displayData.user_personal_id && /* @__PURE__ */ jsxs("div", { className: "space-y-2 bg-muted/50 p-4 rounded-lg border mb-6", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-muted-foreground text-sm", children: "User ID" }),
          /* @__PURE__ */ jsx("p", { className: "font-mono font-semibold text-lg", children: displayData.user_personal_id })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-muted-foreground text-sm", children: t("fullNameLabel") }),
            /* @__PURE__ */ jsx("p", { className: "font-medium mt-1", children: displayData.full_name || t("notProvided") })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-muted-foreground text-sm", children: t("emailLabel") }),
            /* @__PURE__ */ jsx("p", { className: "font-medium mt-1", children: displayData.email || t("notProvided") })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-muted-foreground text-sm", children: t("phoneNumberLabel") }),
            /* @__PURE__ */ jsx("p", { className: "font-medium mt-1", children: displayData.phone_number || t("notProvided") })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-muted-foreground text-sm", children: t("countryLabel") }),
            /* @__PURE__ */ jsx("p", { className: "font-medium mt-1", children: displayData.country || t("notProvided") })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-muted-foreground text-sm", children: t("stateLabel") }),
            /* @__PURE__ */ jsx("p", { className: "font-medium mt-1", children: displayData.state || t("notProvided") })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-muted-foreground text-sm", children: t("cityLabel") }),
            /* @__PURE__ */ jsx("p", { className: "font-medium mt-1", children: displayData.city || t("notProvided") })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-muted-foreground text-sm", children: t("postalCodeLabel") }),
            /* @__PURE__ */ jsx("p", { className: "font-medium mt-1", children: displayData.postal_code || t("notProvided") })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { className: "text-muted-foreground text-sm", children: t("deliveryAddress") }),
          /* @__PURE__ */ jsx("p", { className: "font-medium mt-1 whitespace-pre-wrap", children: displayData.address || t("notProvided") })
        ] }),
        displayData.address_notes && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { className: "text-muted-foreground text-sm", children: t("deliveryNotes") }),
          /* @__PURE__ */ jsx("p", { className: "font-medium mt-1 whitespace-pre-wrap", children: displayData.address_notes })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "pt-4 border-t", children: /* @__PURE__ */ jsxs(Button, { className: "w-full", onClick: handleEdit, children: [
          /* @__PURE__ */ jsx(Edit, { className: "mr-2 h-4 w-4" }),
          t("editProfileButton")
        ] }) })
      ] }) }) })
    ] }) }),
    /* @__PURE__ */ jsx(JapaneseAddressCard, { userId: displayData.user_personal_id, username: displayData.full_name })
  ] });
};
async function createNotification(userId, type, message, personalOrderId, personalShippingId, orderId) {
  try {
    const { data, error } = await supabase.from("notifications").insert({
      user_id: userId,
      type,
      message,
      personal_order_id: personalOrderId || null,
      personal_shipping_id: personalShippingId || null,
      order_group_id: orderId || null
    }).select("id").single();
    if (error) throw error;
    return data?.id || null;
  } catch (error) {
    console.error("Failed to create notification:", error);
    return null;
  }
}
async function notifyAllAdmins(type, message, orderId) {
  try {
    const { error } = await supabase.rpc("notify_admins_about_order", {
      p_type: type,
      p_message: message,
      p_order_id: orderId || null
    });
    if (error) throw error;
    console.log("✅ Admin notifications created successfully");
  } catch (error) {
    console.error("Failed to notify admins:", error);
  }
}
function ProductRequestForm() {
  const { t } = useApp();
  const [items, setItems] = useState([{ url: "", name: "", quantity: 1, notes: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast: toast2 } = useToast();
  const addItem = () => {
    setItems([...items, { url: "", name: "", quantity: 1, notes: "" }]);
  };
  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };
  const updateItem = (index, field, value) => {
    const newItems = [...items];
    if (field === "quantity") {
      newItems[index][field] = Number(value) || 1;
    } else {
      newItems[index][field] = value;
    }
    setItems(newItems);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const validItems = items.filter((item) => item.url.trim());
      if (validItems.length === 0) {
        toast2({
          title: "Error",
          description: t("atLeastOneProduct"),
          variant: "destructive"
        });
        return;
      }
      const { data, error } = await supabase.rpc("create_order_with_product_requests", {
        p_user_id: user.id,
        p_product_requests: validItems.map((item) => ({
          product_url: item.url.trim(),
          item_name: item.name.trim() || null,
          quantity: item.quantity,
          notes: item.notes.trim() || null
        }))
      });
      if (error) throw error;
      let orderPersonalId = "new";
      if (data?.[0]?.order_id) {
        const { data: orderData } = await supabase.from("orders").select("order_personal_id").eq("id", data[0].order_id).single();
        orderPersonalId = orderData?.order_personal_id || data[0].order_id.slice(0, 8);
      }
      let shortOrderId = orderPersonalId;
      if (data?.[0]?.order_id) {
        shortOrderId = typeof data[0].order_id === "string" ? data[0].order_id.slice(0, 8).toUpperCase() : "";
      }
      const { data: profile } = await supabase.from("profiles").select("full_name, user_personal_id").eq("id", user.id).single();
      const customerName = profile?.full_name || "Unknown User";
      const customerId = profile?.user_personal_id ? `#${profile.user_personal_id}` : "";
      if (data?.[0]) {
        await notifyAllAdmins(
          "new_product_request",
          `New product request from ${customerName} ${customerId}. Order #${shortOrderId} with ${validItems.length} item${validItems.length > 1 ? "s" : ""}.`,
          data[0].order_id
        );
      }
      toast2({
        title: "Success",
        description: t("requestSubmittedSuccess")
      });
      setItems([{ url: "", name: "", quantity: 1, notes: "" }]);
    } catch (error) {
      toast2({
        title: "Error",
        description: error.message || t("requestSubmittedError"),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row justify-between items-center gap-2 sm:gap-3 mb-2", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "default",
          asChild: true,
          className: "flex-1 min-w-0 text-center w-full border-2 border-black-800 text-black bg-white hover:bg-capybara-orange hover:text-white transition-colors px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium whitespace-normal",
          children: /* @__PURE__ */ jsx(Link, { to: "/store-guide", children: t("seeJapaneseStores") })
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "default",
          asChild: true,
          className: "flex-1 min-w-0 text-center w-full border-2 border-black-800 text-black bg-white hover:bg-capybara-orange hover:text-white transition-colors px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium whitespace-normal",
          children: /* @__PURE__ */ jsx(Link, { to: "/calculator", children: t("calculateEstimatedCost") })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: t("productRequestTitle") }),
        /* @__PURE__ */ jsx(CardDescription, { children: t("productRequestSubtitle") })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        items.map((item, index) => /* @__PURE__ */ jsxs("div", { className: "space-y-2 p-4 border rounded-lg", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-2", children: [
            /* @__PURE__ */ jsxs(Label, { children: [
              t("products"),
              " ",
              index + 1
            ] }),
            items.length > 1 && /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => removeItem(index), children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: t("productUrlPlaceholder"),
                value: item.url,
                onChange: (e) => updateItem(index, "url", e.target.value),
                required: true,
                className: "md:col-span-2"
              }
            ),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "number",
                placeholder: t("quantity"),
                value: item.quantity,
                onChange: (e) => updateItem(index, "quantity", e.target.value),
                min: "1",
                required: true
              }
            ),
            /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: t("productNamePlaceholder"),
                value: item.name,
                onChange: (e) => updateItem(index, "name", e.target.value)
              }
            ),
            /* @__PURE__ */ jsx(
              Textarea,
              {
                placeholder: t("productNotesPlaceholder"),
                value: item.notes,
                onChange: (e) => updateItem(index, "notes", e.target.value),
                className: "md:col-span-2",
                rows: 2
              }
            )
          ] })
        ] }, index)),
        /* @__PURE__ */ jsxs(Button, { type: "button", variant: "outline", onClick: addItem, className: "w-full", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
          t("addProduct")
        ] }),
        /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", disabled: isSubmitting, children: isSubmitting ? t("submitting") : t("submitRequestButton") })
      ] }) })
    ] })
  ] });
}
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
function StatusFlow({ steps, className }) {
  return /* @__PURE__ */ jsx("div", { className: cn("w-full overflow-x-auto mt-5", className), children: /* @__PURE__ */ jsx("div", { className: "flex items-center min-w-fit px-2 py-3", children: steps.map((step, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center min-h-[90px] sm:min-h-[100px]", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: cn(
            "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-xs font-semibold transition-all shrink-0",
            step.status === "completed" && "bg-primary text-primary-foreground",
            step.status === "current" && "bg-primary/20 text-primary border-2 border-primary",
            step.status === "upcoming" && "bg-muted text-muted-foreground border-2 border-border",
            step.status === "rejected" && "bg-destructive text-destructive-foreground"
          ),
          children: step.status === "completed" ? /* @__PURE__ */ jsx(Check, { className: "w-3 h-3 sm:w-4 sm:h-4" }) : step.status === "rejected" ? /* @__PURE__ */ jsx(X, { className: "w-3 h-3 sm:w-4 sm:h-4" }) : /* @__PURE__ */ jsx("div", { className: "w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center", children: step.icon })
        }
      ),
      /* @__PURE__ */ jsx(
        "span",
        {
          className: cn(
            "text-[10px] sm:text-xs mt-2 text-center max-w-[60px] sm:max-w-[80px] leading-tight min-h-[2.5em]",
            step.status === "completed" && "text-primary font-medium",
            step.status === "current" && "text-foreground font-medium",
            step.status === "upcoming" && "text-muted-foreground",
            step.status === "rejected" && "text-destructive font-medium"
          ),
          children: step.label
        }
      )
    ] }),
    index < steps.length - 1 && /* @__PURE__ */ jsx("div", { className: "flex items-center mx-1 sm:mx-2", children: /* @__PURE__ */ jsx(
      "div",
      {
        className: cn(
          "w-8 sm:w-12 h-[2px] relative top-[1px]",
          steps[index + 1].status === "completed" || steps[index + 1].status === "current" || steps[index + 1].status === "rejected" ? "bg-primary" : "bg-border"
        ),
        children: /* @__PURE__ */ jsx(
          ChevronRight,
          {
            className: cn(
              "absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4",
              steps[index + 1].status === "completed" || steps[index + 1].status === "current" || steps[index + 1].status === "rejected" ? "text-primary" : "text-border"
            )
          }
        )
      }
    ) })
  ] }, index)) }) });
}
const Checkbox = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  CheckboxPrimitive.Root,
  {
    ref,
    className: cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(
      CheckboxPrimitive.Indicator,
      {
        className: cn("flex items-center justify-center text-current"),
        children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" })
      }
    )
  }
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [openOrders, setOpenOrders] = useState(/* @__PURE__ */ new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState("all");
  const [hideRejected, setHideRejected] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useApp();
  useEffect(() => {
    fetchOrders();
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, itemsPerPage, hideRejected]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);
  useEffect(() => {
    const orderId = searchParams.get("orderId");
    if (orderId && orders.length > 0) {
      setOpenOrders(/* @__PURE__ */ new Set([orderId]));
      setTimeout(() => {
        const element = document.getElementById(`order-${orderId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, [searchParams, orders]);
  const fetchOrders = async () => {
    try {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase.from("orders").select(
        `
          *,
          quotes (*),
          order_items (
            product_request:product_requests (*)
          )
        `
      ).eq("user_id", user.id).order("created_at", { ascending: false });
      if (error) throw error;
      const filteredOrders2 = data?.filter((order) => {
        const hasShippingQuote = order.quotes?.some((q) => q.type === "shipping") ?? false;
        return !hasShippingQuote;
      }) || [];
      setOrders(filteredOrders2);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast$1.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };
  const toggleOrder = (orderId) => {
    const newOpenOrders = new Set(openOrders);
    if (newOpenOrders.has(orderId)) {
      newOpenOrders.delete(orderId);
    } else {
      newOpenOrders.add(orderId);
    }
    setOpenOrders(newOpenOrders);
  };
  const getPurchaseProgress = (order) => {
    const statuses = order.order_items?.map((item) => item.product_request.status) ?? [];
    const purchasedCount = statuses.filter((s) => s === "purchased").length;
    const receivedCount = statuses.filter((s) => s === "received").length;
    const totalCount = statuses.length;
    return {
      somePurchased: purchasedCount > 0 && purchasedCount < totalCount && receivedCount === 0,
      allPurchased: purchasedCount === totalCount && totalCount > 0 && receivedCount === 0,
      someReceived: receivedCount > 0 && receivedCount < totalCount,
      allReceived: receivedCount === totalCount && totalCount > 0,
      purchasedCount,
      receivedCount,
      totalCount
    };
  };
  const getOrderStatus = (order) => {
    if (order.is_rejected) return "rejected";
    order.order_items?.map((item) => item.product_request.status) ?? [];
    const progress = getPurchaseProgress(order);
    if (progress.allReceived) {
      return "all_received";
    }
    if (progress.allPurchased || progress.purchasedCount > 0 && progress.receivedCount > 0) {
      return "in_transit";
    }
    if (progress.somePurchased) return "some_purchased";
    const productQuote = order.quotes?.find((q) => q.type === "product");
    if (productQuote) {
      return productQuote.status === "paid" ? "paid" : "quoted";
    }
    return "requested";
  };
  const getStatusSteps = (status, order) => {
    const progress = getPurchaseProgress(order);
    const purchaseLabel = progress.allPurchased || status === "in_transit" || status === "all_received" ? t("statusStepItemsPurchased") : t("statusStepItemsBeingPurchased");
    const steps = [
      { label: t("statusStepRequestSubmitted"), status: "upcoming", icon: /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" }) },
      { label: t("statusStepPaymentConfirmed"), status: "upcoming", icon: /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4" }) },
      { label: purchaseLabel, status: "upcoming", icon: /* @__PURE__ */ jsx(ShoppingCart, { className: "h-4 w-4" }) },
      { label: t("statusStepItemsOnTheWay"), status: "upcoming", icon: /* @__PURE__ */ jsx(Truck, { className: "h-4 w-4" }) },
      { label: t("statusStepAllAtWarehouse"), status: "upcoming", icon: /* @__PURE__ */ jsx(Home$1, { className: "h-4 w-4" }) }
    ];
    if (status === "rejected") {
      return [
        { label: t("statusStepRequestSubmitted"), status: "completed", icon: /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" }) },
        { label: t("statusRejected"), status: "rejected", icon: /* @__PURE__ */ jsx(XCircle, { className: "h-4 w-4" }) }
      ];
    }
    return steps.map((step, index) => {
      if (index === 0) return { ...step, status: "completed" };
      if (index === 1) {
        if (["requested", "quoted"].includes(status)) {
          return { ...step, status: "current" };
        }
        if (["paid", "some_purchased", "all_purchased", "in_transit", "all_received"].includes(status)) {
          return { ...step, status: "completed" };
        }
      }
      if (index === 2) {
        if (status === "paid") {
          return { ...step, status: "current" };
        }
        if (["some_purchased", "all_purchased", "in_transit", "all_received"].includes(status)) {
          return { ...step, status: "completed" };
        }
      }
      if (index === 3) {
        if (["some_purchased", "in_transit"].includes(status)) {
          return { ...step, status: "current" };
        }
        if (["all_received"].includes(status)) {
          return { ...step, status: "completed" };
        }
      }
      if (index === 4 && ["all_received"].includes(status)) {
        return { ...step, status: "completed" };
      }
      return { ...step, status: "upcoming" };
    });
  };
  const getStatusColor = (status) => {
    const colors = {
      requested: "bg-capybara-yellow text-red-500",
      quoted: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      some_purchased: "bg-purple-100 text-purple-800",
      all_purchased: "bg-green-100 text-green-800",
      in_transit: "bg-blue-100 text-blue-800",
      all_received: "bg-indigo-100 text-indigo-800",
      purchased: "bg-purple-100 text-purple-800",
      rejected: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };
  const getStatusTooltip = (status) => {
    const tooltips = {
      requested: t("requested"),
      quoted: t("quoted"),
      paid: t("paid"),
      purchased: t("purchased"),
      all_received: t("all_received"),
      partial_received: t("partial_received"),
      rejected: t("rejected")
    };
    return tooltips[status] || "Status information unavailable.";
  };
  const getStatusIcon = (status) => {
    const icons = {
      requested: /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" }),
      quoted: /* @__PURE__ */ jsx(DollarSign, { className: "h-4 w-4" }),
      paid: /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4" }),
      some_purchased: /* @__PURE__ */ jsx(ShoppingCart, { className: "h-4 w-4" }),
      all_purchased: /* @__PURE__ */ jsx(PackageCheck, { className: "h-4 w-4" }),
      in_transit: /* @__PURE__ */ jsx(Truck, { className: "h-4 w-4" }),
      all_received: /* @__PURE__ */ jsx(Home$1, { className: "h-4 w-4" }),
      purchased: /* @__PURE__ */ jsx(PackageCheck, { className: "h-4 w-4" }),
      received: /* @__PURE__ */ jsx(Home$1, { className: "h-4 w-4" }),
      shipped: /* @__PURE__ */ jsx(Truck, { className: "h-4 w-4" }),
      rejected: /* @__PURE__ */ jsx(XCircle, { className: "h-4 w-4" })
    };
    return icons[status] || /* @__PURE__ */ jsx(Package, { className: "h-4 w-4" });
  };
  const getProductStatusBadge = (status) => {
    const statusDisplay = status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    let badgeClasses = "";
    let icon = null;
    switch (status) {
      case "requested":
        badgeClasses = "bg-gray-100 text-gray-800 border-gray-300";
        icon = /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3 mr-1" });
        break;
      case "quoted":
        badgeClasses = "bg-yellow-100 text-yellow-800 border-yellow-300";
        icon = /* @__PURE__ */ jsx(DollarSign, { className: "h-3 w-3 mr-1" });
        break;
      case "paid":
        badgeClasses = "bg-blue-100 text-blue-800 border-blue-300";
        icon = /* @__PURE__ */ jsx(CheckCircle, { className: "h-3 w-3 mr-1" });
        break;
      case "purchased":
        badgeClasses = "bg-green-100 text-green-800 border-green-300";
        icon = /* @__PURE__ */ jsx(PackageCheck, { className: "h-3 w-3 mr-1" });
        break;
      case "received":
        badgeClasses = "bg-indigo-100 text-indigo-800 border-indigo-300";
        icon = /* @__PURE__ */ jsx(Home$1, { className: "h-3 w-3 mr-1" });
        break;
      case "shipping_quoted":
        badgeClasses = "bg-purple-100 text-purple-800 border-purple-300";
        icon = /* @__PURE__ */ jsx(DollarSign, { className: "h-3 w-3 mr-1" });
        break;
      case "shipping_paid":
        badgeClasses = "bg-teal-100 text-teal-800 border-teal-300";
        icon = /* @__PURE__ */ jsx(CheckCircle, { className: "h-3 w-3 mr-1" });
        break;
      case "shipped":
        badgeClasses = "bg-emerald-100 text-emerald-800 border-emerald-300";
        icon = /* @__PURE__ */ jsx(Truck, { className: "h-3 w-3 mr-1" });
        break;
      case "rejected":
        badgeClasses = "bg-red-100 text-red-800 border-red-300";
        icon = /* @__PURE__ */ jsx(XCircle, { className: "h-3 w-3 mr-1" });
        break;
      default:
        badgeClasses = "bg-gray-100 text-gray-800 border-gray-300";
        icon = /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3 mr-1" });
    }
    return /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: `text-xs flex items-center gap-1 ${badgeClasses}`, children: [
      icon,
      statusDisplay
    ] });
  };
  const handlePayment = (quoteUrl) => {
    window.open(quoteUrl, "_blank");
  };
  const handleGoToStorage = () => {
    const dashboardPath = window.location.pathname.includes("admin") ? "/admin-dashboard" : "/user-dashboard";
    navigate(`${dashboardPath}?tab=storage`);
  };
  const handleEditOrder = (orderId) => {
    navigate(`/edit-order/${orderId}`);
  };
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchOrders();
      toast$1.success(t("ordersUpdatedSuccess"));
    } catch (error) {
      toast$1.error(t("ordersUpdateError"));
    } finally {
      setRefreshing(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex justify-center p-8", children: t("loadingOrders") });
  }
  let filteredOrders = statusFilter === "all" ? orders : orders.filter((order) => getOrderStatus(order) === statusFilter);
  if (hideRejected) {
    filteredOrders = filteredOrders.filter((order) => !order.is_rejected);
  }
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
  if (orders.length === 0) {
    return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-8 text-center", children: [
      /* @__PURE__ */ jsx(Package, { className: "h-12 w-12 text-muted-foreground mx-auto mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: t("noActiveOrders") }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-2", children: t("noActiveOrdersDescription") })
    ] }) });
  }
  return /* @__PURE__ */ jsx(TooltipProvider, { delayDuration: 0, children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: t("currentOrders") }) }),
    /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "outline",
        onClick: () => setIsFilterOpen(!isFilterOpen),
        className: "mb-4 gap-2",
        children: [
          /* @__PURE__ */ jsx(Filter, { className: "h-4 w-4" }),
          t("filterOrders"),
          isFilterOpen ? /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
        ]
      }
    ),
    /* @__PURE__ */ jsx(Collapsible, { open: isFilterOpen, onOpenChange: setIsFilterOpen, children: /* @__PURE__ */ jsx(CollapsibleContent, { className: "overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up", children: /* @__PURE__ */ jsx(Card, { className: "bg-muted/30 mb-4", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4", children: [
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: "\r\n        flex flex-wrap items-center justify-between gap-3\r\n        md:justify-start\r\n      ",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: t("statusFilter") }),
                /* @__PURE__ */ jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[190px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: t("allStatuses") }) }),
                  /* @__PURE__ */ jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsx(SelectItem, { value: "all", children: t("allStatuses") }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "requested", children: t("statusRequested") }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "quoted", children: t("statusAwaitingPayment") }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "paid", children: t("statusPaid") }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "some_purchased", children: t("statusSomePurchased") }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "all_purchased", children: t("statusAllPurchased") }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "in_transit", children: t("statusInTransit") }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "all_received", children: t("statusAllAtWarehouse") }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "rejected", children: t("statusRejected") })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: t("showPerPage") }),
                /* @__PURE__ */ jsxs(
                  Select,
                  {
                    value: itemsPerPage.toString(),
                    onValueChange: (val) => setItemsPerPage(Number(val)),
                    children: [
                      /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[90px]", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                      /* @__PURE__ */ jsxs(SelectContent, { children: [
                        /* @__PURE__ */ jsx(SelectItem, { value: "5", children: "5" }),
                        /* @__PURE__ */ jsx(SelectItem, { value: "10", children: "10" }),
                        /* @__PURE__ */ jsx(SelectItem, { value: "25", children: "25" }),
                        /* @__PURE__ */ jsx(SelectItem, { value: "50", children: "50" })
                      ] })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: t("perPage") })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  Checkbox,
                  {
                    id: "hide-rejected",
                    checked: hideRejected,
                    onCheckedChange: (checked) => setHideRejected(checked === true)
                  }
                ),
                /* @__PURE__ */ jsx(
                  "label",
                  {
                    htmlFor: "hide-rejected",
                    className: "text-sm font-medium cursor-pointer whitespace-nowrap",
                    children: t("hideRejected")
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: handleRefresh,
                  disabled: refreshing,
                  className: "gap-2",
                  children: [
                    /* @__PURE__ */ jsx(RefreshCw, { className: `h-4 w-4 ${refreshing ? "animate-spin" : ""}` }),
                    refreshing ? t("refreshing") : t("update")
                  ]
                }
              )
            ] })
          ]
        }
      ),
      filteredOrders.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-4 text-sm text-muted-foreground", children: [
        t("showingOrders"),
        " ",
        startIndex + 1,
        "-",
        Math.min(endIndex, filteredOrders.length),
        " ",
        t("ofOrders"),
        " ",
        filteredOrders.length,
        " ",
        t("ordersText")
      ] })
    ] }) }) }) }),
    paginatedOrders.map((order) => {
      const status = getOrderStatus(order);
      const statusSteps = getStatusSteps(status, order);
      const productQuote = order.quotes?.find((q) => q.type === "product");
      const isOpen = openOrders.has(order.id);
      const statusTextMap = {
        requested: t("statusRequested"),
        quoted: t("statusAwaitingPayment"),
        paid: t("statusPaid"),
        some_purchased: t("statusSomePurchased"),
        all_purchased: t("statusAllPurchased"),
        in_transit: t("statusInTransit"),
        all_received: t("statusAllAtWarehouse"),
        rejected: t("statusRejected")
      };
      const statusText = statusTextMap[status] || (status ? status.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase()) : "");
      return /* @__PURE__ */ jsx(Collapsible, { open: isOpen, children: /* @__PURE__ */ jsxs(Card, { id: `order-${order.id}`, children: [
        /* @__PURE__ */ jsxs(
          CardHeader,
          {
            onClick: () => toggleOrder(order.id),
            className: "cursor-pointer hover:bg-muted/50 transition-colors border-b border-gray-200",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                  /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg", children: [
                    t("orderNumber"),
                    order.order_personal_id || order.id.slice(0, 8)
                  ] }),
                  /* @__PURE__ */ jsx(Tooltip, { children: /* @__PURE__ */ jsxs("span", { className: "cursor-default", children: [
                    /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsxs(
                      "span",
                      {
                        className: `${getStatusColor(status)} px-2 py-1 text-xs rounded-md inline-flex items-center gap-1`,
                        children: [
                          getStatusIcon(status),
                          /* @__PURE__ */ jsx("span", { className: "ml-1", children: statusText })
                        ]
                      }
                    ) }) }),
                    /* @__PURE__ */ jsx(TooltipContent, { side: "right", alignOffset: 40, className: "right-80 z-60 text-grey-700 border border-capybara-orange shadow-lg", children: /* @__PURE__ */ jsx("p", { children: getStatusTooltip(status) }) })
                  ] }) })
                ] }),
                /* @__PURE__ */ jsx(CollapsibleTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => toggleOrder(order.id), children: isOpen ? /* @__PURE__ */ jsx(ChevronUp, {}) : /* @__PURE__ */ jsx(ChevronDown, {}) }) })
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
                t("createdOn"),
                " ",
                new Date(order.created_at).toLocaleDateString()
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsx(CollapsibleContent, { className: "overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up", children: /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsx(StatusFlow, { steps: statusSteps }),
          ["some_purchased", "all_purchased", "in_transit"].includes(status) && /* @__PURE__ */ jsx("div", { className: "mt-3 mb-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-blue-800 dark:text-blue-200", children: [
            "ℹ️ ",
            t("normalDeliveryInfo")
          ] }) }),
          ["paid"].includes(status) && /* @__PURE__ */ jsx("div", { className: "mt-3 mb-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-blue-800 dark:text-blue-200", children: [
            "ℹ️ ",
            t("paymentReceivedInfo")
          ] }) }),
          order.is_rejected && /* @__PURE__ */ jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsx(AlertTriangle, { className: "h-5 w-5 text-red-600 mt-0.5" }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium text-red-900", children: t("orderRejected") }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-red-700 mt-1", children: order.rejection_details?.rejection_reason || order.rejection_reason }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: "mt-3",
                  onClick: () => handleEditOrder(order.id),
                  children: [
                    /* @__PURE__ */ jsx(Edit, { className: "h-4 w-4 mr-2" }),
                    t("editOrder")
                  ]
                }
              )
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("h4", { className: "font-medium text-sm", children: [
              t("productsInOrder"),
              ":"
            ] }),
            order.rejection_details ? (
              // Rejected orders: render from rejection_details snapshot
              order.rejection_details.product_issues?.map((issue, index) => /* @__PURE__ */ jsx(
                "div",
                {
                  className: "flex items-start justify-between p-3 bg-secondary rounded-lg",
                  children: /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxs("p", { className: "font-medium text-sm", children: [
                      index + 1,
                      ") ",
                      issue.item_name || "Unnamed Product"
                    ] }) }),
                    /* @__PURE__ */ jsx(
                      "a",
                      {
                        href: issue.product_url,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "text-xs text-primary hover:underline truncate block max-w-md",
                        children: issue.product_url
                      }
                    ),
                    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4 mt-1", children: /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
                      "Qty: ",
                      issue.quantity || 1
                    ] }) }),
                    issue.has_issue && issue.issue_description && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 mt-2 bg-yellow-50 border border-yellow-200 rounded p-2", children: [
                      /* @__PURE__ */ jsx(AlertCircle, { className: "h-3 w-3 text-yellow-600 flex-shrink-0" }),
                      /* @__PURE__ */ jsxs("span", { className: "text-xs text-yellow-700", children: [
                        t("issuePrefix"),
                        " ",
                        issue.issue_description
                      ] })
                    ] })
                  ] })
                },
                issue.product_id
              ))
            ) : (
              // Active orders: render from order_items
              order.order_items?.map((item, index) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex flex-wrap items-start justify-between p-3 bg-secondary rounded-lg overflow-hidden",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                        /* @__PURE__ */ jsxs("p", { className: "font-medium text-sm truncate", children: [
                          index + 1,
                          ") ",
                          item.product_request.item_name || "Unnamed Product"
                        ] }),
                        item.product_request.status === "received" && /* @__PURE__ */ jsxs(
                          Badge,
                          {
                            variant: "secondary",
                            className: "text-xs bg-indigo-100 text-indigo-800 border-indigo-200",
                            children: [
                              /* @__PURE__ */ jsx(Home$1, { className: "h-3 w-3 mr-1" }),
                              "In Storage"
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsx("div", { className: "max-w-[280px] truncate", children: /* @__PURE__ */ jsxs(
                        "a",
                        {
                          href: item.product_request.product_url,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          className: "inline-flex items-center gap-1 text-blue-600 hover:underline text-xs",
                          title: item.product_request.product_url,
                          children: [
                            /* @__PURE__ */ jsx(Link$1, { className: "h-3 w-3 flex-shrink-0" }),
                            /* @__PURE__ */ jsx("span", { className: "truncate", children: item.product_request.product_url })
                          ]
                        }
                      ) }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mt-1 flex-wrap text-xs text-muted-foreground", children: [
                        /* @__PURE__ */ jsxs("span", { children: [
                          "Qty: ",
                          item.product_request.quantity || 1
                        ] }),
                        item.product_request.notes && /* @__PURE__ */ jsxs("span", { children: [
                          "Note: ",
                          item.product_request.notes
                        ] })
                      ] }),
                      item.product_request.has_purchase_issue && item.product_request.purchase_issue_description && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 mt-2 bg-yellow-50 border border-yellow-200 rounded p-2", children: [
                        /* @__PURE__ */ jsx(AlertCircle, { className: "h-3 w-3 text-yellow-600 flex-shrink-0" }),
                        /* @__PURE__ */ jsxs("span", { className: "text-xs text-yellow-700", children: [
                          "Issue: ",
                          item.product_request.purchase_issue_description
                        ] })
                      ] })
                    ] }),
                    !order.is_rejected && /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 ml-3 self-start", children: getProductStatusBadge(item.product_request.status) })
                  ]
                },
                item.product_request.id
              ))
            )
          ] }),
          (status === "all_received" || status === "in_transit" && order.order_items?.some((item) => item.product_request.status === "received")) && /* @__PURE__ */ jsx("div", { className: "bg-indigo-50 border border-indigo-200 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Home$1, { className: "h-5 w-5 text-indigo-600" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium text-indigo-900", children: status === "all_received" ? "All items at warehouse" : "Items on the way to warehouse" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-indigo-700", children: status === "all_received" ? "View and manage your items in storage" : order.order_items?.some((item) => item.product_request.status === "received") ? "Some items may already be available in storage" : "Items will be available in storage once received" })
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: handleGoToStorage,
                className: "border-indigo-300 text-indigo-700 hover:bg-indigo-100",
                children: t("goToStorage")
              }
            )
          ] }) }),
          productQuote && productQuote.status !== "paid" && /* @__PURE__ */ jsx("div", { className: "bg-primary/5 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium mb-2", children: t("quoteIssued") }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-start text-xs text-muted-foreground max-w-s text-left pt-1", children: [
                /* @__PURE__ */ jsx(AlertTriangle, { className: "h-3 w-3 mr-2 text-yellow-500 flex-shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  t("paymentConfirmationNotice1"),
                  /* @__PURE__ */ jsx("br", {}),
                  t("paymentConfirmationNotice2")
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex items-end gap-2", children: /* @__PURE__ */ jsx(
              Button,
              {
                onClick: () => handlePayment(productQuote.quote_url),
                className: "bg-primary hover:bg-primary/90",
                children: t("payNow")
              }
            ) })
          ] }) })
        ] }) })
      ] }) }, order.id);
    }),
    filteredOrders.length > 0 && totalPages > 1 && /* @__PURE__ */ jsx(Card, { className: "bg-muted/30", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => setCurrentPage((prev) => Math.max(1, prev - 1)),
          disabled: currentPage === 1,
          children: [
            /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4 mr-1" }),
            t("previous")
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => /* @__PURE__ */ jsx(
        Button,
        {
          variant: currentPage === page ? "default" : "outline",
          size: "sm",
          onClick: () => setCurrentPage(page),
          className: "min-w-[40px]",
          children: page
        },
        page
      )) }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => setCurrentPage((prev) => Math.min(totalPages, prev + 1)),
          disabled: currentPage === totalPages,
          children: [
            t("next"),
            /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4 ml-1" })
          ]
        }
      )
    ] }) }) })
  ] }) });
};
const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Alert = React.forwardRef(({ className, variant, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    role: "alert",
    className: cn(alertVariants({ variant }), className),
    ...props
  }
));
Alert.displayName = "Alert";
const AlertTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "h5",
  {
    ref,
    className: cn("mb-1 font-medium leading-none tracking-tight", className),
    ...props
  }
));
AlertTitle.displayName = "AlertTitle";
const AlertDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("text-sm [&_p]:leading-relaxed", className),
    ...props
  }
));
AlertDescription.displayName = "AlertDescription";
const Table = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { className: "relative w-full overflow-auto", children: /* @__PURE__ */ jsx(
  "table",
  {
    ref,
    className: cn("w-full caption-bottom text-sm", className),
    ...props
  }
) }));
Table.displayName = "Table";
const TableHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("thead", { ref, className: cn("[&_tr]:border-b", className), ...props }));
TableHeader.displayName = "TableHeader";
const TableBody = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tbody",
  {
    ref,
    className: cn("[&_tr:last-child]:border-0", className),
    ...props
  }
));
TableBody.displayName = "TableBody";
const TableFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tfoot",
  {
    ref,
    className: cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    ),
    ...props
  }
));
TableFooter.displayName = "TableFooter";
const TableRow = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tr",
  {
    ref,
    className: cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    ),
    ...props
  }
));
TableRow.displayName = "TableRow";
const TableHead = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "th",
  {
    ref,
    className: cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    ),
    ...props
  }
));
TableHead.displayName = "TableHead";
const TableCell = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "td",
  {
    ref,
    className: cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className),
    ...props
  }
));
TableCell.displayName = "TableCell";
const TableCaption = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "caption",
  {
    ref,
    className: cn("mt-4 text-sm text-muted-foreground", className),
    ...props
  }
));
TableCaption.displayName = "TableCaption";
const ShippingQuoteDialog = ({
  open,
  onOpenChange,
  selectedItems,
  totalWeight,
  onSuccess
}) => {
  const { profile } = useAuth();
  const { toast: toast2 } = useToast();
  const { convertCurrency } = useCurrencyRates();
  const { settings: systemSettings, loading: settingsLoading } = useSystemSettings();
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [shippingMethod, setShippingMethod] = useState("economic");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [addressNotes, setAddressNotes] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const { t } = useApp();
  const zoneInfo = selectedCountry ? getZoneForCountry(selectedCountry) : null;
  const isDHLOnly = selectedCountry ? isDHLOnlyCountry(selectedCountry) : false;
  useEffect(() => {
    if (selectedCountry === "Paraguay") {
      setShippingMethod("paraguay");
    } else if (shippingMethod === "paraguay") {
      setShippingMethod("economic");
    }
  }, [selectedCountry]);
  useEffect(() => {
    if (isDHLOnly && shippingMethod !== "dhl") {
      setShippingMethod("dhl");
    }
  }, [isDHLOnly, shippingMethod]);
  const numericWeight = Number(totalWeight) || 0;
  const availableMethods = selectedCountry === "Paraguay" ? [{ value: "paraguay", label: t("paraguayShippingLabel") }] : isDHLOnly ? [{ value: "dhl", label: t("dhlShipping") }] : numericWeight > 2e3 ? [
    { value: "express", label: t("expressShippingLabel") },
    { value: "dhl", label: t("dhlShipping") }
  ] : [
    { value: "economic", label: t("economicShippingLabel") },
    { value: "express", label: t("expressShippingLabel") },
    { value: "dhl", label: t("dhlShipping") }
  ];
  useEffect(() => {
    if (numericWeight > 2e3 && shippingMethod === "economic") {
      setShippingMethod("express");
    }
  }, [numericWeight, shippingMethod]);
  console.log("DEBUG totalWeight:", totalWeight, typeof totalWeight);
  console.log("DEBUG selectedCountry:", selectedCountry);
  console.log("DEBUG shippingMethod:", shippingMethod);
  const dimensions = (shippingMethod === "dhl" || shippingMethod === "paraguay") && length && width && height ? { L: Number(length), W: Number(width), H: Number(height) } : void 0;
  const shippingCostResult = selectedCountry && !settingsLoading ? calculateShippingCostByCountry(
    selectedCountry,
    shippingMethod,
    numericWeight,
    dimensions,
    shippingMethod === "dhl" ? systemSettings.dhlFuelPercentage : void 0
  ) : null;
  const shippingCost = shippingCostResult ? typeof shippingCostResult === "number" ? shippingCostResult : shippingCostResult.total : null;
  const animatedCost = useAnimatedNumber(shippingCost || 0, 1e3);
  useEffect(() => {
    if (open && profile) {
      setFullName(profile.full_name || "");
      setPhoneNumber(profile.phone_number || "");
      setAddress(profile.address || "");
      setAddressNotes(profile.address_notes || "");
      setSelectedCountry(profile.country || "");
      setPostalCode(profile.postal_code || "");
      setCity(profile.city || "");
      setState(profile.state || "");
    }
  }, [open, profile]);
  const handleSubmit = async () => {
    if (!fullName || !phoneNumber || !address || !selectedCountry || !postalCode || !city || !state) {
      toast2({
        title: "Missing Information",
        description: t("missingAddressInfo"),
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("shipping_quotes").insert({
        user_id: profile?.id,
        shipping_method: shippingMethod,
        destination: selectedCountry,
        total_weight: totalWeight,
        estimated_cost: shippingCost,
        shipping_address: {
          full_name: fullName,
          phone_number: phoneNumber,
          address,
          address_notes: addressNotes,
          country: selectedCountry,
          postal_code: postalCode,
          city,
          state,
          ...(shippingMethod === "dhl" || shippingMethod === "paraguay") && length && width && height ? {
            dimensions: {
              length: Number(length),
              width: Number(width),
              height: Number(height)
            },
            ...shippingMethod === "dhl" ? { fuel_percentage: systemSettings.dhlFuelPercentage } : {}
          } : {}
        },
        items: selectedItems.map((item) => ({
          order_item_id: item.id,
          order_id: item.order_id || "",
          // Handle optional order_id
          item_name: item.product_request.item_name,
          quantity: item.product_request.quantity,
          weight: item.weight || 0,
          product_url: item.product_request.product_url
        }))
      });
      if (error) throw error;
      const { data: quoteData } = await supabase.from("shipping_quotes").select("id").eq("user_id", profile?.id).order("created_at", { ascending: false }).limit(1).single();
      if (quoteData) {
        const { data: userProfile } = await supabase.from("profiles").select("full_name, user_personal_id").eq("id", profile?.id).single();
        const customerName = userProfile?.full_name || "Unknown User";
        const customerId = userProfile?.user_personal_id ? `#${userProfile.user_personal_id}` : "";
        await notifyAllAdmins(
          "new_shipping_request",
          `New shipping quote request from ${customerName} ${customerId} — ${selectedCountry} (${shippingMethod}). ${selectedItems.length} item${selectedItems.length > 1 ? "s" : ""}, ${totalWeight}g total.`,
          quoteData.id
        );
      }
      toast2({
        title: "Shipping Quote Requested",
        description: t("shippingQuoteRequestedSuccess")
      });
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting shipping quote:", error);
      toast2({
        title: "Error",
        description: t("shippingQuoteRequestError"),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white/95 backdrop-blur-sm border-2 border-capybara-yellow shadow-lg", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxs(DialogTitle, { className: "text-2xl font-heading flex items-center gap-2 text-gray-800", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-capybara-orange to-capybara-yellow rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(Truck, { className: "w-5 h-5 text-white" }) }),
        t("requestShippingQuoteTitle")
      ] }),
      /* @__PURE__ */ jsx(DialogDescription, { className: "text-gray-500 font-body text-sm", children: t("shippingQuoteDescription") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6 py-4", children: [
      /* @__PURE__ */ jsxs(Card, { className: "p-4 rounded-2xl bg-capybara-cream border border-capybara-yellow shadow-inner", children: [
        /* @__PURE__ */ jsxs("h3", { className: "font-semibold mb-3 flex items-center gap-2 text-gray-700", children: [
          /* @__PURE__ */ jsx(Package, { className: "w-4 h-4 text-capybara-orange" }),
          t("selectedItems"),
          " (",
          selectedItems.length,
          ")"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2 max-h-32 overflow-y-auto text-sm font-body text-gray-700", children: selectedItems.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            item.product_request.item_name,
            " ×",
            item.product_request.quantity
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-gray-500", children: [
            item.weight,
            "g"
          ] })
        ] }, item.id)) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 pt-3 border-t flex justify-between font-semibold text-gray-800", children: [
          /* @__PURE__ */ jsx("span", { children: t("totalWeight") }),
          /* @__PURE__ */ jsxs("span", { children: [
            totalWeight,
            "g"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs(Label, { className: "text-base font-semibold mb-2 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Globe, { className: "w-4 h-4 text-capybara-orange" }),
          t("shippingCountry")
        ] }),
        /* @__PURE__ */ jsxs(Select, { value: selectedCountry, onValueChange: setSelectedCountry, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "rounded-full border-2 border-capybara-orange/20 focus:border-capybara-orange text-sm px-3 py-2", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select Country" }) }),
          /* @__PURE__ */ jsx(SelectContent, { className: "rounded-2xl border-2 border-capybara-orange/20 max-h-[300px]", children: ALL_COUNTRIES.map((country) => /* @__PURE__ */ jsx(SelectItem, { value: country, children: country }, country)) })
        ] }),
        zoneInfo && !isDHLOnly && /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-600 text-center", children: [
          "Zone ",
          zoneInfo.zone,
          ": ",
          zoneInfo.name
        ] }),
        isDHLOnly && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600 text-center", children: "DHL Shipping Only" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { className: "font-body text-sm text-gray-700", children: "Shipping Method" }),
        /* @__PURE__ */ jsx(
          RadioGroup,
          {
            value: shippingMethod,
            onValueChange: (v) => setShippingMethod(v),
            className: "space-y-2 mt-2",
            children: availableMethods.map((method) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "flex items-center space-x-2 p-2 rounded-full bg-capybara-cream transition-colors",
                children: [
                  /* @__PURE__ */ jsx(RadioGroupItem, { value: method.value, id: method.value, className: "w-3 h-3" }),
                  /* @__PURE__ */ jsx(Label, { htmlFor: method.value, className: "flex-1 font-body cursor-pointer text-xs", children: /* @__PURE__ */ jsx("span", { className: "font-semibold", children: method.label }) })
                ]
              },
              method.value
            ))
          }
        )
      ] }),
      (shippingMethod === "dhl" || shippingMethod === "paraguay") && /* @__PURE__ */ jsx("div", { className: "space-y-3", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { className: "font-body text-sm text-gray-700", children: t("dimensionsLabel") }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "length", className: "text-xs", children: t("lengthLabel") }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "length",
                type: "number",
                min: "1",
                value: length,
                onChange: (e) => setLength(e.target.value),
                placeholder: "L",
                className: "rounded-full border-2 border-capybara-orange/20 focus:border-capybara-orange"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "width", className: "text-xs", children: t("widthLabel") }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "width",
                type: "number",
                min: "1",
                value: width,
                onChange: (e) => setWidth(e.target.value),
                placeholder: "W",
                className: "rounded-full border-2 border-capybara-orange/20 focus:border-capybara-orange"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "height", className: "text-xs", children: t("heightLabel") }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "height",
                type: "number",
                min: "1",
                value: height,
                onChange: (e) => setHeight(e.target.value),
                placeholder: "H",
                className: "rounded-full border-2 border-capybara-orange/20 focus:border-capybara-orange"
              }
            )
          ] })
        ] })
      ] }) }),
      shippingCost && /* @__PURE__ */ jsxs(Card, { className: "p-4 bg-gradient-to-br bg-gray-700 text-white rounded-2xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-center", children: [
          animatedCost.toLocaleString(),
          " yen"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-300 text-sm text-center", children: t("estimatedInternationalShipping") }),
        /* @__PURE__ */ jsx("div", { className: "border-t border-gray-200 mt-3 pt-3 space-y-1 text-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { children: "USD" }),
          /* @__PURE__ */ jsxs("span", { children: [
            "$",
            convertCurrency(shippingCost, "usd")
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("h3", { className: "font-semibold text-base flex items-center gap-2 text-gray-800", children: [
          /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 text-capybara-orange" }),
          t("shippingAddressLabel")
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "fullName", children: [
              t("fullName"),
              " *"
            ] }),
            /* @__PURE__ */ jsx(Input, { id: "fullName", value: fullName, onChange: (e) => setFullName(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "phone", children: [
              t("phoneNumberLabel"),
              " *"
            ] }),
            /* @__PURE__ */ jsx(Input, { id: "phone", value: phoneNumber, onChange: (e) => setPhoneNumber(e.target.value) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "state", children: [
              t("stateLabel"),
              " *"
            ] }),
            /* @__PURE__ */ jsx(Input, { id: "state", value: state, onChange: (e) => setState(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "city", children: [
              t("cityLabel"),
              " *"
            ] }),
            /* @__PURE__ */ jsx(Input, { id: "city", value: city, onChange: (e) => setCity(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "postalCode", children: [
              t("postalCode"),
              " *"
            ] }),
            /* @__PURE__ */ jsx(Input, { id: "postalCode", value: postalCode, onChange: (e) => setPostalCode(e.target.value) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs(Label, { htmlFor: "address", children: [
        t("deliveryAddress"),
        " *"
      ] }),
      /* @__PURE__ */ jsx(Textarea, { id: "address", value: address, onChange: (e) => setAddress(e.target.value), rows: 2 })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "addressNotes", children: t("deliveryNotes") }),
      /* @__PURE__ */ jsx(
        Textarea,
        {
          id: "addressNotes",
          value: addressNotes,
          onChange: (e) => setAddressNotes(e.target.value),
          rows: 2
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), children: t("cancel") }),
      /* @__PURE__ */ jsx(Button, { onClick: handleSubmit, disabled: loading || !shippingCost, children: loading ? t("requestingQuote") : t("requestQuote") })
    ] })
  ] }) });
};
const StoragePage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(/* @__PURE__ */ new Set());
  const [loading, setLoading] = useState(true);
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [shippingQuotes, setShippingQuotes] = useState([]);
  const { t } = useApp();
  const selectedItemsList = items.filter((item) => selectedItems.has(item.id));
  const totalWeight = selectedItemsList.reduce((sum, item) => sum + (item.weight || 0), 0);
  useEffect(() => {
    fetchStorageItems();
    fetchShippingQuotes();
  }, []);
  const fetchShippingQuotes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase.from("shipping_quotes").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      if (error) throw error;
      const groups = [];
      for (const quote of data || []) {
        const itemIds = quote.items.map((item) => item.order_item_id);
        const group = {
          id: quote.id,
          shipment_personal_id: quote.shipment_personal_id,
          created_at: quote.created_at,
          status: quote.status,
          items: [],
          total_weight: quote.total_weight,
          destination: quote.destination,
          shipping_method: quote.shipping_method
        };
        groups.push(group);
      }
      setShippingQuotes(groups);
    } catch (error) {
      console.error("Error fetching shipping quotes:", error);
    }
  };
  const fetchStorageItems = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase.from("product_requests").select(`
          id,
          product_url,
          item_name,
          quantity,
          status,
          weight,
          is_box,
          local_tracking_number,
          created_at,
          order_items!left (
            id,
            order:orders!left (
              id,
              order_personal_id,
              created_at
            )
          )
        `).eq("user_id", user.id).eq("status", "received").order("created_at", { ascending: false });
      if (error) throw error;
      const storageItems = data?.map((item) => {
        const orderItem = item.order_items?.[0];
        const order = orderItem?.order;
        return {
          id: orderItem?.id || item.id,
          // Use order_item id if available, else product_request id
          product_request_id: item.id,
          order_id: order?.id,
          order_personal_id: order?.order_personal_id,
          product_url: item.product_url,
          item_name: item.item_name,
          quantity: item.quantity || 1,
          weight: item.weight,
          status: item.status,
          created_at: item.created_at,
          order_created_at: order?.created_at || item.created_at,
          is_box: item.is_box,
          local_tracking_number: item.local_tracking_number,
          product_request: {
            item_name: item.item_name || "Unnamed Product",
            quantity: item.quantity || 1,
            product_url: item.product_url
          }
        };
      }) || [];
      console.log("Fetched storage items:", storageItems.length, "items");
      setItems(storageItems);
      const { data: quotesData } = await supabase.from("shipping_quotes").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      const groups = [];
      for (const quote of quotesData || []) {
        const quoteItems = [];
        for (const quoteItem of quote.items) {
          const item = storageItems.find((si) => si.id === (quoteItem.order_item_id || quoteItem.id));
          if (item) {
            quoteItems.push(item);
          }
        }
        if (quoteItems.length > 0) {
          groups.push({
            id: quote.id,
            shipment_personal_id: quote.shipment_personal_id,
            created_at: quote.created_at,
            status: quote.status,
            items: quoteItems,
            total_weight: quote.total_weight,
            destination: quote.destination,
            shipping_method: quote.shipping_method
          });
        }
      }
      setShippingQuotes(groups);
    } catch (error) {
      console.error("Error fetching storage items:", error);
      toast$1.error("Failed to load storage items");
    } finally {
      setLoading(false);
    }
  };
  const handleSelectAll = (checked) => {
    if (checked) {
      const available = items.filter(
        (item) => !shippingQuotes.some(
          (quote) => quote.status !== "rejected" && quote.items.some((quoteItem) => quoteItem.id === item.id)
        )
      );
      const selectableItems = available.filter(
        (item) => item.weight !== null && item.weight !== void 0 && !item.is_box
      );
      setSelectedItems(new Set(selectableItems.map((item) => item.id)));
    } else {
      setSelectedItems(/* @__PURE__ */ new Set());
    }
  };
  const handleSelectItem = (itemId, checked) => {
    const item = items.find((i) => i.id === itemId);
    if (item && (item.weight === null || item.weight === void 0)) {
      return;
    }
    const isInShippingQuote = shippingQuotes.some(
      (quote) => quote.status !== "rejected" && quote.items.some((quoteItem) => quoteItem.id === itemId)
    );
    if (isInShippingQuote) {
      return;
    }
    if (checked && item) {
      if (item.is_box && selectedItems.size > 0) {
        const hasRegularItems = items.some(
          (i) => selectedItems.has(i.id) && !i.is_box
        );
        if (hasRegularItems) {
          toast$1.error("Cannot mix address service items with regular items");
          return;
        }
      }
      if (!item.is_box && selectedItems.size > 0) {
        const hasBoxItems = items.some(
          (i) => selectedItems.has(i.id) && i.is_box
        );
        if (hasBoxItems) {
          toast$1.error("Cannot mix regular items with address service items");
          return;
        }
      }
    }
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    setSelectedItems(newSelected);
  };
  const handleRequestShipping = () => {
    if (selectedItems.size === 0) {
      toast$1.error("Please select at least one item to ship");
      return;
    }
    setQuoteDialogOpen(true);
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex justify-center p-8", children: "Loading storage items..." });
  }
  if (items.length === 0) {
    return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-8 text-center", children: [
      /* @__PURE__ */ jsx(Package, { className: "h-12 w-12 text-muted-foreground mx-auto mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: t("noItemsAtWarehouse") }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-2", children: t("noItemsDescription") })
    ] }) });
  }
  const availableItems = items.filter(
    (item) => !shippingQuotes.some(
      (quote) => quote.status !== "rejected" && quote.items.some((quoteItem) => quoteItem.id === item.id)
    )
  );
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: t("warehouseStorage") }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: t("selectItemsToShip") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: fetchStorageItems, children: [
          /* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4 mr-2" }),
          /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Refresh" }),
          /* @__PURE__ */ jsx("span", { className: "sm:hidden", children: "Refresh" })
        ] }),
        /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-xs sm:text-sm whitespace-nowrap", children: [
          /* @__PURE__ */ jsx(Package, { className: "h-3 w-3 mr-1" }),
          availableItems.length,
          " ",
          /* @__PURE__ */ jsx("span", { className: "hidden xs:inline", children: availableItems.length === 1 ? t("itemLabel") : t("itemsLabel") })
        ] })
      ] })
    ] }),
    availableItems.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: t("availableItems") }),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { className: "w-12", children: /* @__PURE__ */ jsx(
            Checkbox,
            {
              checked: availableItems.filter(
                (item) => item.weight !== null && item.weight !== void 0 && !item.is_box
              ).length > 0 && selectedItems.size === availableItems.filter(
                (item) => item.weight !== null && item.weight !== void 0 && !item.is_box
              ).length,
              onCheckedChange: handleSelectAll
            }
          ) }),
          /* @__PURE__ */ jsx(TableHead, { children: t("itemName") }),
          /* @__PURE__ */ jsx(TableHead, { children: t("quantity") }),
          /* @__PURE__ */ jsx(TableHead, { children: t("weight") }),
          /* @__PURE__ */ jsx(TableHead, { children: t("orderNumberShort") }),
          /* @__PURE__ */ jsx(TableHead, { children: t("arrived") })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: availableItems.map((item) => {
          const hasWeight = item.weight !== null && item.weight !== void 0;
          const isInShippingQuote = shippingQuotes.some(
            (quote) => quote.status !== "rejected" && quote.items.some((quoteItem) => quoteItem.id === item.id)
          );
          const hasSelectedBoxItems = selectedItems.size > 0 && items.some(
            (i) => selectedItems.has(i.id) && i.is_box
          );
          const hasSelectedRegularItems = selectedItems.size > 0 && items.some(
            (i) => selectedItems.has(i.id) && !i.is_box
          );
          const isDisabledBySelection = item.is_box && hasSelectedRegularItems || // Box item disabled if regular items selected
          !item.is_box && hasSelectedBoxItems;
          return /* @__PURE__ */ jsxs(TableRow, { className: !hasWeight || isInShippingQuote || isDisabledBySelection ? "opacity-60" : "", children: [
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
              Checkbox,
              {
                checked: selectedItems.has(item.id),
                onCheckedChange: (checked) => handleSelectItem(item.id, checked),
                disabled: !hasWeight || isInShippingQuote || isDisabledBySelection
              }
            ) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium", children: item.item_name || t("unnamedProduct") }),
                item.is_box && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs whitespace-nowrap", children: t("addressService") })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "max-w-[280px] truncate", children: item.is_box && item.local_tracking_number ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-sm text-muted-foreground mt-1", children: [
                /* @__PURE__ */ jsx(Package, { className: "h-3 w-3 flex-shrink-0" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Local Tracking #:" }),
                /* @__PURE__ */ jsx("span", { children: item.local_tracking_number })
              ] }) : /* @__PURE__ */ jsxs(
                "a",
                {
                  href: item.product_url,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "inline-flex items-center gap-1 text-blue-600 hover:underline text-xs",
                  title: item.product_url,
                  children: [
                    /* @__PURE__ */ jsx(Link$1, { className: "h-3 w-3 flex-shrink-0" }),
                    /* @__PURE__ */ jsx("span", { className: "truncate", children: item.product_url })
                  ]
                }
              ) })
            ] }) }),
            /* @__PURE__ */ jsx(TableCell, { children: item.quantity }),
            /* @__PURE__ */ jsx(TableCell, { children: hasWeight ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Scale, { className: "h-3 w-3 text-muted-foreground" }),
              /* @__PURE__ */ jsxs("span", { children: [
                item.weight,
                "g"
              ] })
            ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-amber-600", children: [
              /* @__PURE__ */ jsx(AlertCircle, { className: "h-3 w-3" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm", children: t("awaitingWeighing") })
            ] }) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("span", { className: "text-xs font-mono", children: [
              "#",
              item.order_personal_id || (item.order_id ? item.order_id.slice(0, 8) : "-")
            ] }) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: new Date(item.order_created_at).toLocaleDateString() }) })
          ] }, item.id);
        }) })
      ] }) }) }),
      selectedItems.size > 0 && /* @__PURE__ */ jsx(Card, { className: "bg-primary/5 border-primary/20", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("p", { className: "font-medium", children: [
            selectedItems.size,
            " ",
            selectedItems.size === 1 ? t("itemSelected") : t("itemsSelected")
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
            t("totalWeight"),
            " ",
            totalWeight,
            "g"
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: handleRequestShipping,
            className: "bg-primary hover:bg-primary/90",
            children: [
              /* @__PURE__ */ jsx(Truck, { className: "h-4 w-4 mr-2" }),
              t("requestShippingQuote")
            ]
          }
        )
      ] }) }) }),
      /* @__PURE__ */ jsxs(Alert, { children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsx(AlertDescription, { children: /* @__PURE__ */ jsxs("ul", { className: "text-sm space-y-1 mt-2", children: [
          /* @__PURE__ */ jsxs("li", { children: [
            "• ",
            t("storageAlert1")
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            "• ",
            t("storageAlert2")
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            "• ",
            t("storageAlert3")
          ] })
        ] }) })
      ] })
    ] }),
    shippingQuotes.filter((q) => q.status === "pending" || q.status === "quoted").length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: t("shippingQuotesRequested") }),
      shippingQuotes.filter((q) => q.status === "pending" || q.status === "quoted").map((quote) => /* @__PURE__ */ jsx(Collapsible, { children: /* @__PURE__ */ jsxs(Card, { className: "border-primary/20 bg-primary/5", children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CollapsibleTrigger, { className: "w-full", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
            /* @__PURE__ */ jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" }),
              t("shipmentNumber"),
              quote.shipment_personal_id || quote.id.slice(0, 8)
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
              quote.items.length,
              " items • ",
              quote.total_weight,
              "g • ",
              quote.destination,
              " • ",
              quote.shipping_method
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "capitalize", children: quote.status }),
            /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 transition-transform duration-200" })
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsx(CollapsibleContent, { className: "overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up", children: /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "space-y-2", children: quote.items.map((item) => /* @__PURE__ */ jsxs("div", { className: "text-sm p-2 bg-background rounded", children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: item.item_name || "Unnamed Product" }),
            /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground ml-2", children: [
              "x",
              item.quantity
            ] })
          ] }, item.id)) }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              className: "w-full mt-4",
              onClick: () => navigate("/user-dashboard?tab=shipping"),
              children: [
                /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4 mr-2" }),
                t("viewInShipping")
              ]
            }
          )
        ] }) })
      ] }) }, quote.id))
    ] }),
    /* @__PURE__ */ jsx(
      ShippingQuoteDialog,
      {
        open: quoteDialogOpen,
        onOpenChange: setQuoteDialogOpen,
        selectedItems: selectedItemsList,
        totalWeight,
        onSuccess: () => {
          fetchStorageItems();
          fetchShippingQuotes();
          setSelectedItems(/* @__PURE__ */ new Set());
        }
      }
    )
  ] });
};
const ShippingPage = () => {
  const [orders, setOrders] = useState([]);
  const [shippingQuotes, setShippingQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openItems, setOpenItems] = useState(/* @__PURE__ */ new Set());
  const [searchParams] = useSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState("all");
  const [hideRejected, setHideRejected] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { t } = useApp();
  const pendingQuotes = shippingQuotes.filter((quote) => quote.status === "pending");
  const processedQuotes = shippingQuotes.filter((quote) => quote.status !== "pending");
  const formatShortUrl2 = (url) => {
    try {
      const parsed = new URL(url);
      const domain = parsed.hostname.replace(/^www\./, "");
      const path = parsed.pathname + parsed.search + parsed.hash;
      const shortenedPath = path.length > 40 ? path.slice(0, 40) + "..." : path;
      return `${domain}${shortenedPath}`;
    } catch {
      return url;
    }
  };
  const ShortUrl = ({ url }) => /* @__PURE__ */ jsxs(
    "a",
    {
      href: url,
      target: "_blank",
      rel: "noopener noreferrer",
      title: url,
      className: "ml-1 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline break-all",
      children: [
        /* @__PURE__ */ jsx(Link$1, { className: "h-3 w-3 flex-shrink-0" }),
        formatShortUrl2(url)
      ]
    }
  );
  const ItemIdentifier = ({ item }) => {
    if (item.is_box && item.local_tracking_number) {
      return /* @__PURE__ */ jsxs("div", { className: "ml-1 inline-flex items-center gap-1 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Package, { className: "h-3 w-3 flex-shrink-0" }),
        /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Local Tracking #:" }),
        /* @__PURE__ */ jsx("span", { children: item.local_tracking_number })
      ] });
    }
    if (item.product_url) {
      return /* @__PURE__ */ jsx(ShortUrl, { url: item.product_url });
    }
    return null;
  };
  useEffect(() => {
    fetchData();
    const setupSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const channel = supabase.channel("shipping-updates").on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "shipping_quotes",
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchData();
        }
      ).subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
    };
    const cleanup = setupSubscription();
    return () => {
      cleanup.then((fn) => fn?.());
    };
  }, []);
  useEffect(() => {
    const shipmentId = searchParams.get("shipmentId");
    if (shipmentId && shippingQuotes.length > 0) {
      setOpenItems(/* @__PURE__ */ new Set([`quote-${shipmentId}`]));
      setTimeout(() => {
        const element = document.getElementById(`shipment-${shipmentId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, [searchParams, shippingQuotes]);
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, itemsPerPage, hideRejected]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);
  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: quotesData, error: quotesError } = await supabase.from("shipping_quotes").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      if (quotesError) throw quotesError;
      const enrichedQuotes = await Promise.all(
        (quotesData || []).map(async (quote) => {
          console.log("=== PROCESSING QUOTE ===", quote.shipment_personal_id);
          console.log("Quote items BEFORE enrichment:", JSON.stringify(quote.items, null, 2));
          const enrichedItems = await Promise.all(
            quote.items.map(async (item, index) => {
              console.log(`
--- Processing item ${index} ---`);
              console.log("Original item:", JSON.stringify(item, null, 2));
              if (item.order_item_id) {
                const { data: productRequestData, error: prError } = await supabase.from("product_requests").select("product_url, item_name, quantity, weight, has_shipping_issue, shipping_issue_description, is_box, local_tracking_number").eq("id", item.order_item_id).maybeSingle();
                console.log(`Query product_requests with id: ${item.order_item_id}`);
                console.log("Result:", productRequestData);
                console.log("Error:", prError);
                if (productRequestData) {
                  const enrichedItem = {
                    ...item,
                    ...productRequestData,
                    item_name: productRequestData.item_name || item.item_name
                  };
                  console.log("✅ Enriched item (direct):", JSON.stringify(enrichedItem, null, 2));
                  return enrichedItem;
                }
                const { data: orderItemData, error: oiError } = await supabase.from("order_items").select("product_request_id").eq("id", item.order_item_id).maybeSingle();
                console.log(`Query order_items with id: ${item.order_item_id}`);
                console.log("Result:", orderItemData);
                console.log("Error:", oiError);
                if (orderItemData?.product_request_id) {
                  const { data: productRequestData2 } = await supabase.from("product_requests").select("product_url, item_name, quantity, weight, has_shipping_issue, shipping_issue_description, is_box, local_tracking_number").eq("id", orderItemData.product_request_id).maybeSingle();
                  console.log("Product request via junction:", productRequestData2);
                  if (productRequestData2) {
                    const enrichedItem = {
                      ...item,
                      ...productRequestData2,
                      item_name: productRequestData2.item_name || item.item_name
                    };
                    console.log("✅ Enriched item (via junction):", JSON.stringify(enrichedItem, null, 2));
                    return enrichedItem;
                  }
                }
              }
              console.log("❌ No enrichment, returning original");
              return item;
            })
          );
          console.log("Quote items AFTER enrichment:", JSON.stringify(enrichedItems, null, 2));
          return {
            ...quote,
            items: enrichedItems,
            tracking_urls: quote.tracking_urls || void 0
          };
        })
      );
      setShippingQuotes(enrichedQuotes);
      const { data: ordersData, error: ordersError } = await supabase.from("orders").select(`
          *,
          order_items (
            product_request:product_requests (*)
          )
        `).eq("user_id", user.id).eq("status", "shipped").order("updated_at", { ascending: false });
      if (ordersError) throw ordersError;
      setOrders(ordersData || []);
    } catch (error) {
      console.error(t("shippingDataLoadError"), error);
      toast$1.error(t("shippingDataLoadError"));
    } finally {
      setLoading(false);
    }
  };
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchData();
      toast$1.success(t("shippingDataUpdated"));
    } catch (error) {
      toast$1.error(t("shippingDataUpdateError"));
    } finally {
      setRefreshing(false);
    }
  };
  const toggleItem = (itemId) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(itemId)) {
      newOpenItems.delete(itemId);
    } else {
      newOpenItems.add(itemId);
    }
    setOpenItems(newOpenItems);
  };
  const getShippingQuoteSteps = (status) => {
    if (status === "rejected") {
      return [
        { label: t("requestSubmittedStatus"), status: "completed", icon: /* @__PURE__ */ jsx(Package, { className: "h-4 w-4" }) },
        { label: t("statusRejectedBadge"), status: "rejected", icon: /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4" }) }
      ];
    }
    const steps = [
      { label: t("requestSubmittedStatus"), status: "upcoming", icon: /* @__PURE__ */ jsx(Package, { className: "h-4 w-4" }) },
      { label: t("awaitingPaymentStatus"), status: "upcoming", icon: /* @__PURE__ */ jsx(CreditCard, { className: "h-4 w-4" }) },
      { label: t("paymentReceivedStatus"), status: "upcoming", icon: /* @__PURE__ */ jsx(DollarSign, { className: "h-4 w-4" }) },
      { label: t("itemsShipped"), status: "upcoming", icon: /* @__PURE__ */ jsx(Truck, { className: "h-4 w-4" }) }
    ];
    if (status === "pending") {
      steps[0].status = "current";
    } else if (status === "quoted") {
      steps[0].status = "completed";
      steps[1].status = "current";
    } else if (status === "paid") {
      steps[0].status = "completed";
      steps[1].status = "completed";
      steps[2].status = "completed";
      steps[3].status = "current";
    } else if (status === "shipped" || status === "sent") {
      steps.forEach((step) => step.status = "completed");
    }
    return steps;
  };
  const getShippingSteps = () => {
    return [
      { label: "Processing", status: "completed", icon: /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" }) },
      { label: "Shipped", status: "current", icon: /* @__PURE__ */ jsx(Truck, { className: "h-4 w-4" }) },
      { label: "In Transit", status: "upcoming", icon: /* @__PURE__ */ jsx(Package, { className: "h-4 w-4" }) },
      { label: "Delivered", status: "upcoming", icon: /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4" }) }
    ];
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex justify-center p-8", children: t("loadingShipments") });
  }
  if (shippingQuotes.length === 0 && orders.length === 0) {
    return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-8 text-center", children: [
      /* @__PURE__ */ jsx(Truck, { className: "h-12 w-12 text-muted-foreground mx-auto mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: t("noShipmentsYet") }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-2", children: t("noShipmentsDescription") })
    ] }) });
  }
  const allShipments = [
    ...pendingQuotes.map((q) => ({ ...q, type: "pending_quote" })),
    ...processedQuotes.map((q) => ({ ...q, type: "processed_quote" })),
    ...orders.map((o) => ({ ...o, type: "shipped_order" }))
  ];
  let filteredShipments = allShipments;
  if (statusFilter === "awaiting_quote") {
    filteredShipments = allShipments.filter((s) => s.type === "pending_quote");
  } else if (statusFilter === "quoted") {
    filteredShipments = allShipments.filter(
      (s) => s.type === "processed_quote" && s.status === "quoted"
    );
  } else if (statusFilter === "paid") {
    filteredShipments = allShipments.filter(
      (s) => s.type === "processed_quote" && s.status === "paid"
    );
  } else if (statusFilter === "shipped") {
    filteredShipments = allShipments.filter(
      (s) => s.type === "processed_quote" && (s.status === "shipped" || s.status === "sent") || s.type === "shipped_order"
    );
  } else if (statusFilter === "rejected") {
    filteredShipments = allShipments.filter(
      (s) => s.type === "processed_quote" && s.status === "rejected"
    );
  }
  if (hideRejected) {
    filteredShipments = filteredShipments.filter(
      (s) => !(s.type === "processed_quote" && s.status === "rejected")
    );
  }
  const totalPages = Math.ceil(filteredShipments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedShipments = filteredShipments.slice(startIndex, endIndex);
  const paginatedPendingQuotes = paginatedShipments.filter((s) => s.type === "pending_quote");
  const paginatedProcessedQuotes = paginatedShipments.filter((s) => s.type === "processed_quote");
  const paginatedShippedOrders = paginatedShipments.filter((s) => s.type === "shipped_order");
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-4", children: t("shippingTitle") }),
    /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "outline",
        onClick: () => setIsFilterOpen(!isFilterOpen),
        className: "mb-4 gap-2",
        children: [
          /* @__PURE__ */ jsx(Filter, { className: "h-4 w-4" }),
          t("filterShipments"),
          isFilterOpen ? /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
        ]
      }
    ),
    /* @__PURE__ */ jsx(Collapsible, { open: isFilterOpen, onOpenChange: setIsFilterOpen, children: /* @__PURE__ */ jsx(CollapsibleContent, { className: "overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up", children: /* @__PURE__ */ jsx(Card, { className: "bg-muted/30 mb-4", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4", children: [
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: "\r\n        flex flex-wrap items-center justify-between gap-3\r\n        md:justify-start\r\n      ",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: t("statusFilter") }),
                /* @__PURE__ */ jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[190px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: t("selectStatus") }) }),
                  /* @__PURE__ */ jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsx(SelectItem, { value: "all", children: t("allStatuses") }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "awaiting_quote", children: t("statusAwaitingQuote") }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "quoted", children: t("statusQuoted") }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "paid", children: t("statusPaymentReceived") }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "shipped", children: t("statusShippedBadge") }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "rejected", children: t("statusRejectedBadge") })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: t("showPerPage") }),
                /* @__PURE__ */ jsxs(
                  Select,
                  {
                    value: itemsPerPage.toString(),
                    onValueChange: (val) => setItemsPerPage(Number(val)),
                    children: [
                      /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[90px]", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                      /* @__PURE__ */ jsxs(SelectContent, { children: [
                        /* @__PURE__ */ jsx(SelectItem, { value: "5", children: "5" }),
                        /* @__PURE__ */ jsx(SelectItem, { value: "10", children: "10" }),
                        /* @__PURE__ */ jsx(SelectItem, { value: "25", children: "25" }),
                        /* @__PURE__ */ jsx(SelectItem, { value: "50", children: "50" })
                      ] })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: t("perPage") })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  Checkbox,
                  {
                    id: "hide-rejected",
                    checked: hideRejected,
                    onCheckedChange: (checked) => setHideRejected(checked === true)
                  }
                ),
                /* @__PURE__ */ jsx(
                  "label",
                  {
                    htmlFor: "hide-rejected",
                    className: "text-sm font-medium cursor-pointer whitespace-nowrap",
                    children: t("hideRejected")
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: handleRefresh,
                  disabled: refreshing,
                  className: "gap-2",
                  children: [
                    /* @__PURE__ */ jsx(RefreshCw, { className: `h-4 w-4 ${refreshing ? "animate-spin" : ""}` }),
                    refreshing ? t("refreshing") : t("update")
                  ]
                }
              )
            ] })
          ]
        }
      ),
      filteredShipments.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-4 text-sm text-muted-foreground", children: [
        t("showingShipments"),
        " ",
        startIndex + 1,
        "-",
        Math.min(endIndex, filteredShipments.length),
        " ",
        t("ofShipments"),
        " ",
        filteredShipments.length,
        " ",
        t("shipmentsText")
      ] })
    ] }) }) }) }),
    filteredShipments.length === 0 && (shippingQuotes.length > 0 || orders.length > 0) && /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-8 text-center", children: [
      /* @__PURE__ */ jsx(Truck, { className: "h-12 w-12 text-muted-foreground mx-auto mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: t("noShipmentsWithFilter") }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-2", children: t("noShipmentsWithFilter") })
    ] }) }),
    paginatedPendingQuotes.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Clock, { className: "h-5 w-5 text-yellow-600" }),
        t("shippingRequestsAwaitingQuote"),
        /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "border-yellow-500 text-yellow-700", children: pendingQuotes.length })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: t("awaitingQuoteDescription") }),
      paginatedPendingQuotes.map((quote) => {
        const isOpen = openItems.has(`quote-${quote.id}`);
        const totalItems = quote.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        return /* @__PURE__ */ jsx(Collapsible, { open: isOpen, children: /* @__PURE__ */ jsxs(Card, { id: `shipment-${quote.id}`, className: "border-primary/20", children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "cursor-pointer", onClick: () => toggleItem(`quote-${quote.id}`), children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Package, { className: "h-4 w-4" }),
                  t("shipmentNumber"),
                  quote.shipment_personal_id || quote.id.slice(0, 8)
                ] }),
                /* @__PURE__ */ jsxs(
                  Badge,
                  {
                    className: quote.status === "pending" ? "bg-yellow-100 text-yellow-800 border-yellow-200" : quote.status === "quoted" ? "bg-blue-100 text-blue-800 border-blue-200" : quote.status === "paid" ? "bg-green-100 text-green-800 border-green-200" : quote.status === "rejected" ? "bg-red-100 text-red-800 border-red-200" : "bg-purple-100 text-purple-800 border-purple-200",
                    children: [
                      quote.status === "pending" && t("statusAwaitingQuoteBadge"),
                      quote.status === "quoted" && t("statusAwaitingPaymentBadge"),
                      quote.status === "paid" && t("statusPaymentReceivedBadge"),
                      (quote.status === "shipped" || quote.status === "sent") && t("statusShippedBadge"),
                      quote.status === "rejected" && t("statusRejectedBadge")
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(CollapsibleTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: () => toggleItem(`quote-${quote.id}`),
                  children: isOpen ? /* @__PURE__ */ jsx(ChevronUp, {}) : /* @__PURE__ */ jsx(ChevronDown, {})
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
              t("requestedOn"),
              " ",
              new Date(quote.created_at).toLocaleDateString(),
              " •",
              totalItems,
              " ",
              totalItems === 1 ? "item" : "items",
              " •",
              quote.total_weight,
              "g •",
              quote.destination,
              " •",
              quote.shipping_method
            ] })
          ] }),
          /* @__PURE__ */ jsx(CollapsibleContent, { className: "overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up", children: /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsx(StatusFlow, { steps: getShippingQuoteSteps(quote.status) }),
            quote.status === "rejected" && quote.rejection_reason && /* @__PURE__ */ jsxs(Alert, { variant: "destructive", children: [
              /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsx(AlertTitle, { children: t("rejectionReasonTitle") }),
              /* @__PURE__ */ jsx(AlertDescription, { children: quote.rejection_reason })
            ] }),
            quote.quote_url && quote.status === "quoted" && /* @__PURE__ */ jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-blue-900", children: t("paymentLinkAvailable") }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-blue-700 mt-1", children: t("clickToPay") })
              ] }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  className: "border-blue-500 text-blue-700 hover:bg-blue-50",
                  onClick: () => window.open(quote.quote_url, "_blank"),
                  children: [
                    /* @__PURE__ */ jsx(CreditCard, { className: "h-4 w-4 mr-1" }),
                    t("payNow")
                  ]
                }
              )
            ] }) }),
            quote.quote_url && (quote.status === "paid" || quote.status === "shipped" || quote.status === "sent") && /* @__PURE__ */ jsx("div", { className: "bg-green-50 border border-green-200 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-green-900", children: t("paymentConfirmed") }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-green-700 mt-1", children: t("shippingPaymentReceived") })
              ] }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  className: "border-green-500 text-green-700 hover:bg-green-50",
                  onClick: () => window.open(quote.quote_url, "_blank"),
                  children: [
                    /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 mr-1" }),
                    t("viewInvoice")
                  ]
                }
              )
            ] }) }),
            (quote.status === "shipped" || quote.status === "sent") && (() => {
              const boxItems = quote.items.filter((item) => item.is_box === true);
              console.log("Box Items:", boxItems);
              if (boxItems.length > 0) {
                return /* @__PURE__ */ jsxs("div", { className: "bg-purple-50 border border-purple-200 rounded-lg p-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-purple-900", children: "Track Your Boxes" }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-purple-700 mt-1", children: "Each box can be tracked individually" })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "space-y-3", children: boxItems.map((boxItem, index) => {
                    console.log("Individual Box Item:", boxItem);
                    const trackingEntry = quote.tracking_urls?.find(
                      (entry2) => entry2.item_id === boxItem.order_item_id
                    );
                    return /* @__PURE__ */ jsxs(
                      "div",
                      {
                        className: "flex items-center justify-between p-3 bg-white rounded border border-purple-200",
                        children: [
                          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                            /* @__PURE__ */ jsx(Package, { className: "h-4 w-4 text-purple-700" }),
                            /* @__PURE__ */ jsxs("div", { children: [
                              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-purple-900", children: boxItem.item_name || `Box ${index + 1}` }),
                              boxItem.local_tracking_number && /* @__PURE__ */ jsxs("p", { className: "text-xs text-purple-600", children: [
                                "Tracking: ",
                                boxItem.local_tracking_number
                              ] })
                            ] })
                          ] }),
                          trackingEntry?.tracking_url && /* @__PURE__ */ jsxs(
                            Button,
                            {
                              size: "sm",
                              variant: "outline",
                              className: "border-purple-500 text-purple-700 hover:bg-purple-50",
                              onClick: () => window.open(trackingEntry.tracking_url, "_blank"),
                              children: [
                                /* @__PURE__ */ jsx(Truck, { className: "h-4 w-4 mr-1" }),
                                t("trackPackage")
                              ]
                            }
                          )
                        ]
                      },
                      boxItem.order_item_id || index
                    );
                  }) })
                ] });
              } else if (quote.tracking_url) {
                return /* @__PURE__ */ jsx("div", { className: "bg-purple-50 border border-purple-200 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-purple-900", children: t("shipmentTracking") }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-purple-700 mt-1", children: t("shipmentTrackingInfo") })
                  ] }),
                  /* @__PURE__ */ jsxs(
                    Button,
                    {
                      size: "sm",
                      variant: "outline",
                      className: "border-purple-500 text-purple-700 hover:bg-purple-50",
                      onClick: () => window.open(quote.tracking_url, "_blank"),
                      children: [
                        /* @__PURE__ */ jsx(Truck, { className: "h-4 w-4 mr-1" }),
                        t("trackPackage")
                      ]
                    }
                  )
                ] }) });
              }
              return null;
            })(),
            (quote.estimated_cost || quote.actual_cost) && /* @__PURE__ */ jsx("div", { className: "bg-primary/5 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              quote.estimated_cost && /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: t("estimatedCost") }),
                /* @__PURE__ */ jsxs("p", { className: "text-lg font-semibold", children: [
                  "¥",
                  quote.estimated_cost.toLocaleString()
                ] })
              ] }),
              quote.actual_cost && /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: t("finalQuote") }),
                /* @__PURE__ */ jsxs("p", { className: "text-lg font-semibold text-primary", children: [
                  "¥",
                  quote.actual_cost.toLocaleString()
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-medium text-sm", children: t("itemsInShipment") }),
              quote.status === "rejected" && quote.rejection_details?.product_issues ? (
                // For rejected shipments, show historical snapshot from rejection_details
                quote.rejection_details.product_issues.map((issue, index) => {
                  const hasIssue = issue.has_issue;
                  return /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: `flex items-center justify-between p-2 rounded ${hasIssue ? "bg-destructive/10 border border-destructive/30" : "bg-secondary/30"}`,
                      children: [
                        /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
                          hasIssue && /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 text-destructive mt-0.5 flex-shrink-0" }),
                          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                            /* @__PURE__ */ jsx("p", { className: `text-sm font-medium ${hasIssue ? "text-destructive" : ""}`, children: issue.item_name || "Unnamed Product" }),
                            /* @__PURE__ */ jsx(ItemIdentifier, { item: issue }),
                            hasIssue && issue.issue_description && /* @__PURE__ */ jsxs("p", { className: "text-xs text-destructive/80 mt-1", children: [
                              t("issuePrefix"),
                              " ",
                              issue.issue_description
                            ] })
                          ] })
                        ] }) }),
                        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                          /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
                            "Qty: ",
                            issue.quantity || 1
                          ] }),
                          issue.weight && /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground block", children: [
                            issue.weight,
                            "g"
                          ] })
                        ] })
                      ]
                    },
                    index
                  );
                })
              ) : (
                // For non-rejected shipments, show current live data
                quote.items.map((item, index) => {
                  const hasIssue = item.has_shipping_issue && quote.status === "rejected";
                  return /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: `flex items-center justify-between p-2 rounded ${hasIssue ? "bg-destructive/10 border border-destructive/30" : "bg-secondary/30"}`,
                      children: [
                        /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
                          hasIssue && /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 text-destructive mt-0.5 flex-shrink-0" }),
                          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                            /* @__PURE__ */ jsx("p", { className: `text-sm font-medium ${hasIssue ? "text-destructive" : ""}`, children: item.item_name || "Unnamed Product" }),
                            /* @__PURE__ */ jsx(ItemIdentifier, { item }),
                            hasIssue && item.shipping_issue_description && /* @__PURE__ */ jsxs("p", { className: "text-xs text-destructive/80 mt-1", children: [
                              t("issuePrefix"),
                              " ",
                              item.shipping_issue_description
                            ] })
                          ] })
                        ] }) }),
                        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                          /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
                            "Qty: ",
                            item.quantity || 1
                          ] }),
                          item.weight && /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground block", children: [
                            item.weight,
                            "g"
                          ] })
                        ] })
                      ]
                    },
                    index
                  );
                })
              )
            ] }),
            quote.shipping_address && /* @__PURE__ */ jsxs("div", { className: "border-t pt-4", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-medium text-sm mb-2", children: t("shippingAddressLabel") }),
              /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-1", children: [
                /* @__PURE__ */ jsxs("p", { children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium", children: t("addressName") }),
                  " ",
                  quote.shipping_address.full_name
                ] }),
                /* @__PURE__ */ jsxs("p", { children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium", children: t("addressPhone") }),
                  " ",
                  quote.shipping_address.phone_number
                ] }),
                /* @__PURE__ */ jsxs("p", { children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium", children: t("address") }),
                  " ",
                  quote.shipping_address.address
                ] }),
                quote.shipping_address.address_notes && /* @__PURE__ */ jsxs("p", { children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium", children: t("addressNotes") }),
                  " ",
                  quote.shipping_address.address_notes
                ] }),
                /* @__PURE__ */ jsxs("p", { children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium", children: t("cityState") }),
                  " ",
                  quote.shipping_address.city || "-",
                  ", ",
                  quote.shipping_address.state || "-"
                ] }),
                /* @__PURE__ */ jsxs("p", { children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium", children: t("postalCode") }),
                  " ",
                  quote.shipping_address.postal_code
                ] }),
                /* @__PURE__ */ jsxs("p", { children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium", children: t("country") }),
                  " ",
                  quote.shipping_address.country
                ] })
              ] })
            ] })
          ] }) })
        ] }) }, quote.id);
      })
    ] }),
    paginatedProcessedQuotes.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5" }),
        t("shipmentsTitle"),
        /* @__PURE__ */ jsx(Badge, { variant: "outline", children: processedQuotes.length })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: t("shipmentsDescription") }),
      paginatedProcessedQuotes.map((quote) => {
        const isOpen = openItems.has(`quote-${quote.id}`);
        const totalItems = quote.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        return /* @__PURE__ */ jsx(Collapsible, { open: isOpen, children: /* @__PURE__ */ jsxs(Card, { className: "border-primary/20", children: [
          /* @__PURE__ */ jsxs(
            CardHeader,
            {
              onClick: () => toggleItem(`quote-${quote.id}`),
              className: "cursor-pointer hover:bg-muted/50 transition-colors border-b border-gray-200",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                    /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx(Package, { className: "h-4 w-4" }),
                      t("shipmentNumber"),
                      quote.shipment_personal_id || quote.id.slice(0, 8)
                    ] }),
                    /* @__PURE__ */ jsxs(
                      Badge,
                      {
                        className: quote.status === "quoted" ? "bg-blue-100 text-blue-800 border-blue-200" : quote.status === "paid" ? "bg-green-100 text-green-800 border-green-200" : quote.status === "rejected" ? "bg-red-100 text-red-800 border-red-200" : "bg-purple-100 text-purple-800 border-purple-200",
                        children: [
                          quote.status === "quoted" && t("statusAwaitingPaymentBadge"),
                          quote.status === "paid" && t("statusPaymentReceivedBadge"),
                          (quote.status === "shipped" || quote.status === "sent") && t("statusShippedBadge"),
                          quote.status === "rejected" && t("statusRejectedBadge")
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx(CollapsibleTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "sm",
                      onClick: () => toggleItem(`quote-${quote.id}`),
                      children: isOpen ? /* @__PURE__ */ jsx(ChevronUp, {}) : /* @__PURE__ */ jsx(ChevronDown, {})
                    }
                  ) })
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
                  t("requestedOn"),
                  " ",
                  new Date(quote.created_at).toLocaleDateString(),
                  " •",
                  totalItems,
                  " ",
                  totalItems === 1 ? "item" : "items",
                  " •",
                  quote.total_weight,
                  "g •",
                  quote.destination,
                  " •",
                  quote.shipping_method
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsx(CollapsibleContent, { className: "overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up", children: /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsx(StatusFlow, { steps: getShippingQuoteSteps(quote.status) }),
            quote.status === "rejected" && quote.rejection_reason && /* @__PURE__ */ jsxs(Alert, { variant: "destructive", children: [
              /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsx(AlertTitle, { children: t("rejectionReasonTitle") }),
              /* @__PURE__ */ jsx(AlertDescription, { children: quote.rejection_reason })
            ] }),
            quote.quote_url && quote.status === "quoted" && /* @__PURE__ */ jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-blue-900", children: t("paymentLinkAvailable") }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-blue-700 mt-1", children: t("clickToPay") })
              ] }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  className: "border-blue-500 text-blue-700 hover:bg-blue-50",
                  onClick: () => window.open(quote.quote_url, "_blank"),
                  children: [
                    /* @__PURE__ */ jsx(CreditCard, { className: "h-4 w-4 mr-1" }),
                    t("payNow")
                  ]
                }
              )
            ] }) }),
            quote.quote_url && (quote.status === "paid" || quote.status === "shipped" || quote.status === "sent") && /* @__PURE__ */ jsx("div", { className: "bg-green-50 border border-green-200 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-green-900", children: t("paymentConfirmed") }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-green-700 mt-1", children: t("shippingPaymentReceived") })
              ] }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  className: "border-green-500 text-green-700 hover:bg-green-50",
                  onClick: () => window.open(quote.quote_url, "_blank"),
                  children: [
                    /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 mr-1" }),
                    t("viewInvoice")
                  ]
                }
              )
            ] }) }),
            (quote.status === "shipped" || quote.status === "sent") && /* @__PURE__ */ jsx(Fragment, { children: quote.tracking_urls && quote.tracking_urls.length > 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-purple-900", children: t("shipmentTracking") }),
              quote.tracking_urls.map((entry2, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 py-2 border-t first:border-t-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 flex-1", children: [
                  /* @__PURE__ */ jsx(Package, { className: "h-4 w-4 text-purple-700 mt-0.5 flex-shrink-0" }),
                  /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { className: "text-sm text-purple-900", children: quote.items.find((item) => item.order_item_id === entry2.item_id)?.item_name || "Package" }) })
                ] }),
                /* @__PURE__ */ jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    className: "border-purple-500 text-purple-700 hover:bg-purple-50 flex-shrink-0",
                    onClick: () => window.open(entry2.tracking_url, "_blank"),
                    children: [
                      /* @__PURE__ */ jsx(Truck, { className: "h-4 w-4 mr-1" }),
                      t("trackPackage")
                    ]
                  }
                )
              ] }, entry2.item_id))
            ] }) : quote.tracking_url ? /* @__PURE__ */ jsx("div", { className: "bg-purple-50 border border-purple-200 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-purple-900", children: t("shipmentTracking") }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-purple-700 mt-1", children: t("shipmentTrackingInfo") })
              ] }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  className: "border-purple-500 text-purple-700 hover:bg-purple-50",
                  onClick: () => window.open(quote.tracking_url, "_blank"),
                  children: [
                    /* @__PURE__ */ jsx(Truck, { className: "h-4 w-4 mr-1" }),
                    t("trackPackage")
                  ]
                }
              )
            ] }) }) : null }),
            (quote.estimated_cost || quote.actual_cost) && /* @__PURE__ */ jsx("div", { className: "bg-primary/5 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              quote.estimated_cost && /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: t("estimatedCost") }),
                /* @__PURE__ */ jsxs("p", { className: "text-lg font-semibold", children: [
                  "¥",
                  quote.estimated_cost.toLocaleString()
                ] })
              ] }),
              quote.actual_cost && /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: t("finalQuote") }),
                /* @__PURE__ */ jsxs("p", { className: "text-lg font-semibold text-primary", children: [
                  "¥",
                  quote.actual_cost.toLocaleString()
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-medium text-sm", children: t("items") }),
              quote.status === "rejected" && quote.rejection_details?.product_issues ? (
                // For rejected shipments, show historical snapshot from rejection_details
                quote.rejection_details.product_issues.map((issue, index) => {
                  const hasIssue = issue.has_issue;
                  return /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: `flex items-start justify-between py-2 border-b last:border-0 ${hasIssue ? "bg-red-50 -mx-2 px-2 rounded" : ""}`,
                      children: [
                        /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
                          hasIssue && /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 text-destructive mt-0.5 flex-shrink-0" }),
                          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                            /* @__PURE__ */ jsx("p", { className: `text-sm font-medium ${hasIssue ? "text-destructive" : ""}`, children: issue.item_name || "Unnamed Product" }),
                            /* @__PURE__ */ jsx(ItemIdentifier, { item: issue }),
                            hasIssue && issue.issue_description && /* @__PURE__ */ jsxs("p", { className: "text-xs text-destructive/80 mt-1", children: [
                              t("issuePrefix"),
                              " ",
                              issue.issue_description
                            ] })
                          ] })
                        ] }) }),
                        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                          /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
                            "Qty: ",
                            issue.quantity || 1
                          ] }),
                          issue.weight && /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground block", children: [
                            issue.weight,
                            "g"
                          ] })
                        ] })
                      ]
                    },
                    index
                  );
                })
              ) : (
                // For non-rejected shipments, show current live data
                quote.items.map((item, index) => {
                  const hasIssue = item.has_shipping_issue;
                  return /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: `flex items-start justify-between py-2 border-b last:border-0 ${hasIssue ? "bg-red-50 -mx-2 px-2 rounded" : ""}`,
                      children: [
                        /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
                          hasIssue && /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 text-destructive mt-0.5 flex-shrink-0" }),
                          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                            /* @__PURE__ */ jsx("p", { className: `text-sm font-medium ${hasIssue ? "text-destructive" : ""}`, children: item.item_name || "Unnamed Product" }),
                            /* @__PURE__ */ jsx(ItemIdentifier, { item }),
                            hasIssue && item.shipping_issue_description && /* @__PURE__ */ jsxs("p", { className: "text-xs text-destructive/80 mt-1", children: [
                              t("issuePrefix"),
                              " ",
                              item.shipping_issue_description
                            ] })
                          ] })
                        ] }) }),
                        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                          /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
                            "Qty: ",
                            item.quantity || 1
                          ] }),
                          item.weight && /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground block", children: [
                            item.weight,
                            "g"
                          ] })
                        ] })
                      ]
                    },
                    index
                  );
                })
              )
            ] }),
            quote.shipping_address && /* @__PURE__ */ jsxs("div", { className: "border-t pt-4", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-medium text-sm mb-2", children: t("shippingAddressLabel") }),
              /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-1", children: [
                /* @__PURE__ */ jsxs("p", { children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium", children: t("addressName") }),
                  " ",
                  quote.shipping_address.full_name
                ] }),
                /* @__PURE__ */ jsxs("p", { children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium", children: t("addressPhone") }),
                  " ",
                  quote.shipping_address.phone_number
                ] }),
                /* @__PURE__ */ jsxs("p", { children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium", children: t("address") }),
                  " ",
                  quote.shipping_address.address
                ] }),
                quote.shipping_address.address_notes && /* @__PURE__ */ jsxs("p", { children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium", children: t("addressNotes") }),
                  " ",
                  quote.shipping_address.address_notes
                ] }),
                /* @__PURE__ */ jsxs("p", { children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium", children: t("cityState") }),
                  " ",
                  quote.shipping_address.city || "-",
                  ", ",
                  quote.shipping_address.state || "-"
                ] }),
                /* @__PURE__ */ jsxs("p", { children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium", children: t("postalCode") }),
                  " ",
                  quote.shipping_address.postal_code
                ] }),
                /* @__PURE__ */ jsxs("p", { children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium", children: t("country") }),
                  " ",
                  quote.shipping_address.country
                ] })
              ] })
            ] })
          ] }) })
        ] }) }, quote.id);
      })
    ] }),
    paginatedShippedOrders.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Truck, { className: "h-5 w-5" }),
        "Shipped Orders"
      ] }),
      paginatedShippedOrders.map((order) => {
        const isOpen = openItems.has(`order-${order.id}`);
        const totalItems = order.order_items?.reduce(
          (sum, item) => sum + (item.product_request.quantity || 1),
          0
        ) || 0;
        return /* @__PURE__ */ jsx(Collapsible, { open: isOpen, children: /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg", children: [
                  "Order #",
                  order.id.slice(0, 8)
                ] }),
                /* @__PURE__ */ jsxs(Badge, { className: "bg-blue-100 text-blue-800", children: [
                  /* @__PURE__ */ jsx(Truck, { className: "h-4 w-4 mr-1" }),
                  "Shipped"
                ] })
              ] }),
              /* @__PURE__ */ jsx(CollapsibleTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: () => toggleItem(`order-${order.id}`),
                  children: isOpen ? /* @__PURE__ */ jsx(ChevronUp, {}) : /* @__PURE__ */ jsx(ChevronDown, {})
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
              "Shipped on ",
              order.shipped_at ? new Date(order.shipped_at).toLocaleDateString() : "N/A",
              " • ",
              totalItems,
              " ",
              totalItems === 1 ? "item" : "items"
            ] })
          ] }),
          /* @__PURE__ */ jsx(CollapsibleContent, { className: "overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up", children: /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsx(StatusFlow, { steps: getShippingSteps() }),
            order.tracking_number && /* @__PURE__ */ jsx("div", { className: "bg-primary/5 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Tracking Number" }),
                /* @__PURE__ */ jsx("p", { className: "text-lg font-mono", children: order.tracking_number })
              ] }),
              /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", children: [
                /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4 mr-2" }),
                "Track Package"
              ] })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-medium text-sm", children: "Items in this shipment:" }),
              order.order_items?.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-2 bg-secondary/30 rounded", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm", children: item.product_request.item_name || "Unnamed Product" }),
                /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  "Qty: ",
                  item.product_request.quantity || 1
                ] })
              ] }, item.product_request.id))
            ] })
          ] }) })
        ] }) }, order.id);
      })
    ] }),
    filteredShipments.length > 0 && totalPages > 1 && /* @__PURE__ */ jsx(Card, { className: "bg-muted/30", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => setCurrentPage((prev) => Math.max(1, prev - 1)),
          disabled: currentPage === 1,
          children: [
            /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4 mr-1" }),
            "Previous"
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => /* @__PURE__ */ jsx(
        Button,
        {
          variant: currentPage === page ? "default" : "outline",
          size: "sm",
          onClick: () => setCurrentPage(page),
          className: "min-w-[40px]",
          children: page
        },
        page
      )) }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => setCurrentPage((prev) => Math.min(totalPages, prev + 1)),
          disabled: currentPage === totalPages,
          children: [
            "Next",
            /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4 ml-1" })
          ]
        }
      )
    ] }) }) })
  ] });
};
const Pagination = ({ className, ...props }) => /* @__PURE__ */ jsx(
  "nav",
  {
    role: "navigation",
    "aria-label": "pagination",
    className: cn("mx-auto flex w-full justify-center", className),
    ...props
  }
);
Pagination.displayName = "Pagination";
const PaginationContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "ul",
  {
    ref,
    className: cn("flex flex-row items-center gap-1", className),
    ...props
  }
));
PaginationContent.displayName = "PaginationContent";
const PaginationItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("li", { ref, className: cn("", className), ...props }));
PaginationItem.displayName = "PaginationItem";
const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}) => /* @__PURE__ */ jsx(
  "a",
  {
    "aria-current": isActive ? "page" : void 0,
    className: cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size
      }),
      className
    ),
    ...props
  }
);
PaginationLink.displayName = "PaginationLink";
const PaginationPrevious = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxs(
  PaginationLink,
  {
    "aria-label": "Go to previous page",
    size: "default",
    className: cn("gap-1 pl-2.5", className),
    ...props,
    children: [
      /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsx("span", { children: "Previous" })
    ]
  }
);
PaginationPrevious.displayName = "PaginationPrevious";
const PaginationNext = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxs(
  PaginationLink,
  {
    "aria-label": "Go to next page",
    size: "default",
    className: cn("gap-1 pr-2.5", className),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { children: "Next" }),
      /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
    ]
  }
);
PaginationNext.displayName = "PaginationNext";
const PaginationEllipsis = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxs(
  "span",
  {
    "aria-hidden": true,
    className: cn("flex h-9 w-9 items-center justify-center", className),
    ...props,
    children: [
      /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsx("span", { className: "sr-only", children: "More pages" })
    ]
  }
);
PaginationEllipsis.displayName = "PaginationEllipsis";
const NotificationsView = () => {
  const { user } = useAuth();
  const queryClient2 = useQueryClient();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [readStatusFilter, setReadStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const ITEMS_PER_PAGE = 15;
  const { data: userRole } = useQuery({
    queryKey: ["user-role", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).single();
      return data?.role || "user";
    },
    enabled: !!user
  });
  const isAdmin = userRole === "admin";
  const getCategoryForNotification = (type) => {
    const orderTypes = ["quote_received", "order_rejected", "payment_confirmed", "order_update", "quote_approved", "quote_rejected", "order_issue"];
    const shippingTypes = ["shipping_quote_received", "shipping_request_rejected", "shipping_payment_confirmed", "shipment_sent", "shipping_update"];
    const warehouseTypes = ["items_at_warehouse"];
    const adminTypes = ["new_product_request", "order_resubmitted", "new_shipping_request"];
    if (orderTypes.includes(type)) return "orders";
    if (shippingTypes.includes(type)) return "shipping";
    if (warehouseTypes.includes(type)) return "warehouse";
    if (adminTypes.includes(type)) return "admin";
    return "other";
  };
  const getDateThreshold = () => {
    const now = /* @__PURE__ */ new Date();
    switch (timeFilter) {
      case "7days":
        return new Date(now.setDate(now.getDate() - 7)).toISOString();
      case "30days":
        return new Date(now.setDate(now.getDate() - 30)).toISOString();
      case "90days":
        return new Date(now.setDate(now.getDate() - 90)).toISOString();
      case "all":
      default:
        return null;
    }
  };
  const { data: totalCount = 0 } = useQuery({
    queryKey: ["notifications", "count", user?.id, readStatusFilter, categoryFilter, timeFilter],
    queryFn: async () => {
      if (!user) return 0;
      let query = supabase.from("notifications").select("type, read_at, created_at").eq("user_id", user.id);
      if (readStatusFilter === "unread") {
        query = query.is("read_at", null);
      } else if (readStatusFilter === "read") {
        query = query.not("read_at", "is", null);
      }
      const dateThreshold = getDateThreshold();
      if (dateThreshold) {
        query = query.gte("created_at", dateThreshold);
      }
      const { data, error } = await query;
      if (error) throw error;
      if (categoryFilter !== "all" && data) {
        return data.filter((n) => getCategoryForNotification(n.type) === categoryFilter).length;
      }
      return data?.length || 0;
    },
    enabled: !!user
  });
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications", user?.id, currentPage, readStatusFilter, categoryFilter, timeFilter],
    queryFn: async () => {
      if (!user) return [];
      let query = supabase.from("notifications").select("*").eq("user_id", user.id);
      if (readStatusFilter === "unread") {
        query = query.is("read_at", null);
      } else if (readStatusFilter === "read") {
        query = query.not("read_at", "is", null);
      }
      const dateThreshold = getDateThreshold();
      if (dateThreshold) {
        query = query.gte("created_at", dateThreshold);
      }
      query = query.order("created_at", { ascending: false });
      const { data, error } = await query;
      if (error) throw error;
      let filteredData = data || [];
      if (categoryFilter !== "all") {
        filteredData = filteredData.filter((n) => getCategoryForNotification(n.type) === categoryFilter);
      }
      const startIndex2 = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex2 = startIndex2 + ITEMS_PER_PAGE;
      return filteredData.slice(startIndex2, endIndex2);
    },
    enabled: !!user
  });
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId) => {
      const { error } = await supabase.from("notifications").update({ read_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", notificationId).eq("user_id", user?.id || "");
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient2.invalidateQueries({ queryKey: ["notifications"] });
      queryClient2.invalidateQueries({ queryKey: ["notifications", "unread"] });
    },
    onError: () => {
      toast$1.error("Failed to mark notification as read");
    }
  });
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("notifications").update({ read_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("user_id", user?.id || "").is("read_at", null);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient2.invalidateQueries({ queryKey: ["notifications"] });
      queryClient2.invalidateQueries({ queryKey: ["notifications", "unread"] });
      toast$1.success("All notifications marked as read");
    },
    onError: () => {
      toast$1.error("Failed to mark all as read");
    }
  });
  const clearFilters = () => {
    setReadStatusFilter("all");
    setCategoryFilter("all");
    setTimeFilter("all");
    setCurrentPage(1);
  };
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE - 1, totalCount);
  const activeFiltersCount = [
    readStatusFilter !== "all",
    categoryFilter !== "all",
    timeFilter !== "all"
  ].filter(Boolean).length;
  const getNotificationIcon = (type) => {
    switch (type) {
      case "quote_received":
        return /* @__PURE__ */ jsx(DollarSign, { className: "h-5 w-5 text-blue-500" });
      case "order_rejected":
        return /* @__PURE__ */ jsx(XCircle, { className: "h-5 w-5 text-red-500" });
      case "payment_confirmed":
        return /* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5 text-green-500" });
      case "items_at_warehouse":
        return /* @__PURE__ */ jsx(Package, { className: "h-5 w-5 text-purple-500" });
      case "shipping_quote_received":
        return /* @__PURE__ */ jsx(DollarSign, { className: "h-5 w-5 text-cyan-500" });
      case "shipping_request_rejected":
        return /* @__PURE__ */ jsx(XCircle, { className: "h-5 w-5 text-orange-500" });
      case "shipping_payment_confirmed":
        return /* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5 text-emerald-500" });
      case "shipment_sent":
        return /* @__PURE__ */ jsx(Truck, { className: "h-5 w-5 text-indigo-500" });
      case "order_update":
        return /* @__PURE__ */ jsx(Package, { className: "h-5 w-5 text-primary" });
      case "shipping_update":
        return /* @__PURE__ */ jsx(Truck, { className: "h-5 w-5 text-primary" });
      case "quote_approved":
        return /* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5 text-green-500" });
      case "quote_rejected":
      case "order_issue":
        return /* @__PURE__ */ jsx(AlertCircle, { className: "h-5 w-5 text-destructive" });
      // Admin notification icons
      case "new_product_request":
        return /* @__PURE__ */ jsx(ShoppingBag, { className: "h-5 w-5 text-blue-500" });
      case "order_resubmitted":
        return /* @__PURE__ */ jsx(RefreshCw, { className: "h-5 w-5 text-purple-500" });
      case "new_shipping_request":
        return /* @__PURE__ */ jsx(Package, { className: "h-5 w-5 text-teal-500" });
      default:
        return /* @__PURE__ */ jsx(Bell, { className: "h-5 w-5 text-primary" });
    }
  };
  const getButtonText = (type) => {
    switch (type) {
      case "quote_received":
        return "Click here to view order";
      case "order_rejected":
        return "Click here to review and resubmit";
      case "payment_confirmed":
        return "Click here to view order";
      case "items_at_warehouse":
        return "Click here to view warehouse";
      case "shipping_quote_received":
        return "Click here to view shipment";
      case "shipping_request_rejected":
        return "Click here to review shipment";
      case "shipping_payment_confirmed":
        return "Click here to view shipment";
      case "shipment_sent":
        return "Click here to track shipment";
      // Admin notification button texts
      case "new_product_request":
        return "Click here to view new order";
      case "order_resubmitted":
        return "Click here to review resubmitted order";
      case "new_shipping_request":
        return "Click here to process shipping request";
      default:
        return "Click here to view details";
    }
  };
  const handleNotificationAction = async (notification) => {
    if (!notification.read_at) {
      await markAsReadMutation.mutateAsync(notification.id);
    }
    if (notification.order_group_id) {
      if (notification.type === "new_product_request" || notification.type === "order_resubmitted") {
        navigate(`/admin-dashboard?tab=requests&orderId=${notification.order_group_id}`);
      } else if (notification.type === "new_shipping_request") {
        navigate(`/admin-dashboard?tab=shipping-requests&shipmentId=${notification.order_group_id}`);
      } else if (notification.type === "shipping_quote_received" || notification.type === "shipping_request_rejected" || notification.type === "shipping_payment_confirmed" || notification.type === "shipment_sent") {
        navigate(`/user-dashboard?tab=shipping&shipmentId=${notification.order_group_id}`);
      } else if (notification.type === "items_at_warehouse") {
        navigate("/user-dashboard?tab=storage");
      } else {
        navigate(`/user-dashboard?tab=orders&orderId=${notification.order_group_id}`);
      }
    }
  };
  const unreadNotifications = notifications.filter((n) => !n.read_at);
  const readNotifications = notifications.filter((n) => n.read_at);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800", children: "Notifications" }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Filter, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Filters" }),
        activeFiltersCount > 0 && /* @__PURE__ */ jsx("span", { className: "text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full", children: activeFiltersCount })
      ] }) }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-[200px]", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium mb-2 block", children: "Status" }),
          /* @__PURE__ */ jsxs(Select, { value: readStatusFilter, onValueChange: (value) => {
            setReadStatusFilter(value);
            setCurrentPage(1);
          }, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All notifications" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "unread", children: "Unread only" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "read", children: "Read only" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-[200px]", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium mb-2 block", children: "Category" }),
          /* @__PURE__ */ jsxs(Select, { value: categoryFilter, onValueChange: (value) => {
            setCategoryFilter(value);
            setCurrentPage(1);
          }, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All types" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "orders", children: "Orders" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "shipping", children: "Shipping" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "warehouse", children: "Warehouse" }),
              isAdmin && /* @__PURE__ */ jsx(SelectItem, { value: "admin", children: "Admin" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-[200px]", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium mb-2 block", children: "Time" }),
          /* @__PURE__ */ jsxs(Select, { value: timeFilter, onValueChange: (value) => {
            setTimeFilter(value);
            setCurrentPage(1);
          }, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All time" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "7days", children: "Last 7 days" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "30days", children: "Last 30 days" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "90days", children: "Last 90 days" })
            ] })
          ] })
        ] }),
        activeFiltersCount > 0 && /* @__PURE__ */ jsx("div", { className: "flex items-end", children: /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: clearFilters,
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
              "Clear filters"
            ]
          }
        ) })
      ] }) })
    ] }),
    !isLoading && totalCount > 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Showing ",
        startIndex,
        "-",
        endIndex,
        " of ",
        totalCount,
        " notifications"
      ] }),
      notifications.some((n) => !n.read_at) && /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => markAllAsReadMutation.mutate(),
          disabled: markAllAsReadMutation.isPending,
          className: "self-start sm:self-auto",
          children: [
            markAllAsReadMutation.isPending && /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
            "Mark all as read"
          ]
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center h-64", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }) : totalCount === 0 ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-8 text-center text-muted-foreground", children: [
      /* @__PURE__ */ jsx(Bell, { className: "h-12 w-12 mx-auto mb-4 opacity-20" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg font-medium", children: activeFiltersCount > 0 ? "No notifications found" : "No notifications yet" }),
      activeFiltersCount > 0 && /* @__PURE__ */ jsx(Button, { variant: "link", onClick: clearFilters, className: "mt-2", children: "Clear filters to see all notifications" })
    ] }) }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      unreadNotifications.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-gray-600 px-2", children: "Unread" }),
        unreadNotifications.map((notification) => /* @__PURE__ */ jsx(
          Card,
          {
            className: "border-l-4 border-l-primary bg-primary/5",
            children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "mt-0.5 flex-shrink-0", children: getNotificationIcon(notification.type) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 mb-1", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-gray-800 font-semibold break-words flex-1", children: notification.message }),
                  /* @__PURE__ */ jsx("div", { className: "h-2 w-2 bg-primary rounded-full flex-shrink-0 mt-2" })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-3", children: formatDistanceToNow(new Date(notification.created_at), { addSuffix: true }) }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-2", children: [
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      size: "sm",
                      onClick: () => handleNotificationAction(notification),
                      className: "w-full sm:flex-1 text-xs sm:text-sm",
                      children: /* @__PURE__ */ jsx("span", { className: "truncate", children: getButtonText(notification.type) })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      onClick: () => markAsReadMutation.mutate(notification.id),
                      disabled: markAsReadMutation.isPending,
                      className: "sm:whitespace-nowrap",
                      children: "Mark as read"
                    }
                  )
                ] })
              ] })
            ] }) })
          },
          notification.id
        ))
      ] }),
      readNotifications.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-gray-600 px-2", children: "Read" }),
        readNotifications.map((notification) => /* @__PURE__ */ jsx(
          Card,
          {
            className: "opacity-70 hover:opacity-100 transition-opacity",
            children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "mt-0.5 flex-shrink-0", children: getNotificationIcon(notification.type) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: "text-gray-600 break-words", children: notification.message }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-3", children: formatDistanceToNow(new Date(notification.created_at), { addSuffix: true }) }),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    onClick: () => handleNotificationAction(notification),
                    className: "w-full text-xs sm:text-sm",
                    children: /* @__PURE__ */ jsx("span", { className: "truncate", children: getButtonText(notification.type) })
                  }
                )
              ] })
            ] }) })
          },
          notification.id
        ))
      ] }),
      totalPages > 1 && /* @__PURE__ */ jsx("div", { className: "flex justify-center mt-8", children: /* @__PURE__ */ jsx(Pagination, { children: /* @__PURE__ */ jsxs(PaginationContent, { children: [
        /* @__PURE__ */ jsx(PaginationItem, { children: /* @__PURE__ */ jsx(
          PaginationPrevious,
          {
            onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
            className: currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
          }
        ) }),
        Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          const showPage = page === 1 || page === totalPages || page >= currentPage - 1 && page <= currentPage + 1;
          const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
          const showEllipsisAfter = page === currentPage + 2 && currentPage < totalPages - 2;
          if (showEllipsisBefore || showEllipsisAfter) {
            return /* @__PURE__ */ jsx(PaginationItem, { children: /* @__PURE__ */ jsx(PaginationEllipsis, {}) }, page);
          }
          if (!showPage) return null;
          return /* @__PURE__ */ jsx(PaginationItem, { children: /* @__PURE__ */ jsx(
            PaginationLink,
            {
              onClick: () => setCurrentPage(page),
              isActive: currentPage === page,
              className: "cursor-pointer",
              children: page
            }
          ) }, page);
        }),
        /* @__PURE__ */ jsx(PaginationItem, { children: /* @__PURE__ */ jsx(
          PaginationNext,
          {
            onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
            className: currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
          }
        ) })
      ] }) }) })
    ] })
  ] });
};
const UserDashboardContent = () => {
  const {
    t
  } = useApp();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("submit");
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["submit", "orders", "storage", "shipping", "profile", "notifications"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams.toString()]);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [activeTab]);
  const bottomNavItems = [{
    id: "orders",
    label: t("orders"),
    icon: Package
  }, {
    id: "storage",
    label: t("storage"),
    icon: Home$1
  }, {
    id: "shipping",
    label: t("shipping"),
    icon: Truck
  }, {
    id: "profile",
    label: t("profile"),
    icon: User
  }];
  const submitItem = {
    id: "submit",
    label: t("submitRequest"),
    icon: Plus
  };
  const navigationItems = [submitItem, ...bottomNavItems];
  const Sidebar = () => /* @__PURE__ */ jsxs("div", {
    className: `${isMobile ? "hidden" : "w-64 bg-white/90 backdrop-blur-sm border-r border-blue-200 min-h-screen"} p-6`,
    children: [/* @__PURE__ */ jsx("div", {
      className: "flex items-center space-x-3 pl-4 mb-8",
      children: /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx("h2", {
          className: "font-bold text-gray-800",
          children: t("dashboard")
        }), /* @__PURE__ */ jsx("p", {
          className: "text-sm text-gray-600",
          children: "User Panel"
        })]
      })
    }), /* @__PURE__ */ jsx("nav", {
      className: "space-y-2",
      children: navigationItems.map((item) => {
        const IconComponent = item.icon;
        return /* @__PURE__ */ jsxs(Button, {
          variant: activeTab === item.id ? "default" : "ghost",
          className: "w-full justify-start",
          onClick: () => navigate(`/user-dashboard?tab=${item.id}`, {
            replace: true
          }),
          children: [/* @__PURE__ */ jsx(IconComponent, {
            className: "mr-2 h-4 w-4"
          }), item.label]
        }, item.id);
      })
    })]
  });
  const BottomNav = () => /* @__PURE__ */ jsx("div", {
    className: "fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-capybara-yellow shadow-lg md:hidden",
    children: /* @__PURE__ */ jsxs("nav", {
      className: "flex items-stretch justify-around h-16",
      children: [" ", bottomNavItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeTab === item.id;
        return /* @__PURE__ */ jsxs("button", {
          onClick: () => navigate(`/user-dashboard?tab=${item.id}`, {
            replace: true
          }),
          className: `bg-white/95 flex flex-1 flex-col justify-center items-center gap-1 transition-all ${isActive ? "text-capybara-orange" : "text-gray-700 hover:text-capybara-orange hover:capybara-cream"}`,
          children: [/* @__PURE__ */ jsx(IconComponent, {
            className: "h-5 w-5"
          }), /* @__PURE__ */ jsx("span", {
            className: "text-xs font-medium",
            children: item.label
          })]
        }, item.id);
      })]
    })
  });
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-gradient-to-br from-blue-50 to-blue-100",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "flex",
      children: [/* @__PURE__ */ jsx(Sidebar, {}), /* @__PURE__ */ jsxs("div", {
        className: `flex-1 p-4 md:p-8 min-w-0 overflow-x-auto ${isMobile ? "pb-24" : ""}`,
        children: [activeTab === "submit" && /* @__PURE__ */ jsx("div", {
          className: "max-w-2xl",
          children: /* @__PURE__ */ jsx(ProductRequestForm, {})
        }), activeTab === "shipping" && /* @__PURE__ */ jsx(ShippingPage, {}), activeTab === "storage" && /* @__PURE__ */ jsx(StoragePage, {}), activeTab === "orders" && /* @__PURE__ */ jsx(OrdersPage, {}), activeTab === "profile" && /* @__PURE__ */ jsx(ProfileView, {}), activeTab === "notifications" && /* @__PURE__ */ jsx(NotificationsView, {})]
      })]
    }), isMobile && /* @__PURE__ */ jsx(BottomNav, {})]
  });
};
const UserDashboard = () => {
  return /* @__PURE__ */ jsx(ProtectedRoute, {
    children: /* @__PURE__ */ jsx(UserDashboardContent, {})
  });
};
const UserDashboard_default = UNSAFE_withComponentProps(UserDashboard);
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: UserDashboard_default
}, Symbol.toStringTag, { value: "Module" }));
const AdminSidebar = ({
  activeTab,
  setActiveTab,
  isMobile,
  sidebarOpen,
  setSidebarOpen,
  refetchUsers
}) => {
  const navigate = useNavigate();
  const navigationItems = [
    { id: "requests", label: "Product Requests", icon: Package },
    { id: "storage", label: "Storage", icon: Warehouse },
    { id: "shipping-requests", label: "Shipping Requests", icon: Truck },
    { id: "users", label: "User Management", icon: Users },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "analytics", label: "Analytics", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings$1 }
  ];
  return /* @__PURE__ */ jsxs("div", { className: `${isMobile ? "fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-sm border-r border-blue-200 transform transition-transform duration-300" : "w-64 bg-white/90 backdrop-blur-sm border-r border-blue-200 min-h-screen"} ${isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"} p-6`, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(Crown, { className: "text-white w-6 h-6" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "font-bold text-gray-800", children: "Admin Panel" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Website Management" })
        ] })
      ] }),
      isMobile && /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => setSidebarOpen(false),
          children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("nav", { className: "space-y-2", children: navigationItems.map((item) => {
      const IconComponent = item.icon;
      return /* @__PURE__ */ jsxs(
        Button,
        {
          variant: activeTab === item.id ? "default" : "ghost",
          className: "w-full justify-start",
          onClick: () => {
            navigate(`/admin-dashboard?tab=${item.id}`, { replace: true });
            if (isMobile) setSidebarOpen(false);
            if (item.id === "users") refetchUsers();
          },
          children: [
            /* @__PURE__ */ jsx(IconComponent, { className: "mr-2 h-4 w-4" }),
            item.label
          ]
        },
        item.id
      );
    }) })
  ] });
};
const Tabs = TabsPrimitive.Root;
const TabsList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.List,
  {
    ref,
    className: cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = TabsPrimitive.List.displayName;
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
const TabsContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
function UserInfoDialog({ user, open, onOpenChange }) {
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (error) throw error;
      return data;
    },
    enabled: open && !!user?.id
  });
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["user-orders", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase.from("orders").select("*, order_items(id)").eq("user_id", user.id).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: open && !!user?.id
  });
  const { data: shipments, isLoading: shipmentsLoading } = useQuery({
    queryKey: ["user-shipments", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase.from("shipping_quotes").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: open && !!user?.id
  });
  if (!user) return null;
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-3xl max-h-[80vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { children: [
      "User Information - ",
      user.full_name
    ] }) }),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "profile", className: "w-full", children: [
      /* @__PURE__ */ jsxs(TabsList, { className: "grid w-full grid-cols-3", children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "profile", children: "Profile" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "orders", children: "Orders" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "shipping", children: "Shipping" })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "profile", className: "space-y-4", children: profileLoading ? /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-full" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-full" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-3/4" })
      ] }) : profile ? /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Full Name" }),
            /* @__PURE__ */ jsx("p", { children: profile.full_name || "N/A" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Email" }),
            /* @__PURE__ */ jsx("p", { children: profile.email || user.email })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Phone" }),
            /* @__PURE__ */ jsx("p", { children: profile.phone_number || "N/A" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "User ID" }),
            /* @__PURE__ */ jsx("p", { children: profile.user_personal_id || "N/A" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Country" }),
            /* @__PURE__ */ jsx("p", { children: profile.country || "N/A" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Postal Code" }),
            /* @__PURE__ */ jsx("p", { children: profile.postal_code || "N/A" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "City" }),
            /* @__PURE__ */ jsx("p", { children: profile.city || "N/A" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "State" }),
            /* @__PURE__ */ jsx("p", { children: profile.state || "N/A" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Join Date" }),
            /* @__PURE__ */ jsx("p", { children: format(new Date(user.created_at), "MMM dd, yyyy") })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Address" }),
          /* @__PURE__ */ jsx("p", { children: profile.address || "N/A" }),
          profile.address_notes && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: profile.address_notes })
        ] })
      ] }) : /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "No profile information found" }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "orders", className: "space-y-4", children: ordersLoading ? /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-20 w-full" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-20 w-full" })
      ] }) : orders && orders.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-3", children: orders.map((order) => /* @__PURE__ */ jsxs("div", { className: "border rounded-lg p-4 space-y-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("p", { className: "font-medium", children: [
              "Order #",
              order.order_personal_id
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: format(new Date(order.created_at), "MMM dd, yyyy") })
          ] }),
          /* @__PURE__ */ jsx(Badge, { children: order.status })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm", children: [
          order.order_items?.length || 0,
          " item(s)"
        ] })
      ] }, order.id)) }) : /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "No orders found" }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "shipping", className: "space-y-4", children: shipmentsLoading ? /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-20 w-full" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-20 w-full" })
      ] }) : shipments && shipments.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-3", children: shipments.map((shipment) => /* @__PURE__ */ jsxs("div", { className: "border rounded-lg p-4 space-y-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("p", { className: "font-medium", children: [
              "Shipment #",
              shipment.shipment_personal_id
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: format(new Date(shipment.created_at), "MMM dd, yyyy") })
          ] }),
          /* @__PURE__ */ jsx(Badge, { children: shipment.status })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-sm space-y-1", children: [
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Destination:" }),
            " ",
            shipment.destination
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Method:" }),
            " ",
            shipment.shipping_method
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Weight:" }),
            " ",
            shipment.total_weight,
            "g"
          ] }),
          shipment.estimated_cost && /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Est. Cost:" }),
            " ¥",
            shipment.estimated_cost
          ] }),
          shipment.actual_cost && /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Actual Cost:" }),
            " ¥",
            shipment.actual_cost
          ] })
        ] })
      ] }, shipment.id)) }) : /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "No shipping quotes found" }) })
    ] })
  ] }) });
}
const UserManagement = ({
  users,
  usersLoading,
  refetchUsers,
  handleRoleChange
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  const handleOpenUserInfo = (user) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) || user.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });
  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "moderator":
        return "bg-yellow-100 text-yellow-800";
      case "user":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:justify-between md:items-center gap-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800", children: "User Management" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              placeholder: "Search users...",
              className: "pl-10 w-full sm:w-80",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsx(Button, { onClick: () => refetchUsers(), disabled: usersLoading, className: "flex-shrink-0", children: usersLoading ? "Loading..." : "Refresh" })
      ] })
    ] }),
    isMobile ? /* @__PURE__ */ jsx("div", { className: "space-y-4", children: filteredUsers.map((user) => /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4 space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: user.full_name }),
          user.user_personal_id && /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "#",
            user.user_personal_id
          ] })
        ] }),
        /* @__PURE__ */ jsx(Badge, { className: getRoleColor(user.role), children: user.role.toUpperCase() })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1 text-sm", children: [
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground break-all", children: user.email }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Globe, { className: "h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsx("span", { children: user.country || "N/A" })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground", children: [
          "Joined: ",
          new Date(user.created_at).toLocaleDateString()
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          size: "sm",
          variant: "outline",
          className: "w-full mt-2",
          onClick: () => handleOpenUserInfo(user),
          children: [
            /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4 mr-2" }),
            "See User Info"
          ]
        }
      )
    ] }) }, user.id)) }) : /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { className: "min-w-[150px]", children: "User" }),
        /* @__PURE__ */ jsx(TableHead, { className: "min-w-[200px]", children: "Email" }),
        /* @__PURE__ */ jsx(TableHead, { className: "min-w-[100px]", children: "Country" }),
        /* @__PURE__ */ jsx(TableHead, { className: "min-w-[100px]", children: "Joined" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: filteredUsers.map((user) => /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxs(TableCell, { className: "font-medium", children: [
          user.full_name,
          user.user_personal_id && /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground ml-2", children: [
            "#",
            user.user_personal_id
          ] }),
          /* @__PURE__ */ jsx(Badge, { className: `${getRoleColor(user.role)} ml-2`, children: user.role.toUpperCase() })
        ] }),
        /* @__PURE__ */ jsx(TableCell, { className: "break-all", children: user.email }),
        /* @__PURE__ */ jsx(TableCell, { children: user.country || "N/A" }),
        /* @__PURE__ */ jsx(TableCell, { children: new Date(user.created_at).toLocaleDateString() }),
        /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: () => handleOpenUserInfo(user),
            children: [
              /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4 mr-2" }),
              "See User Info"
            ]
          }
        ) })
      ] }, user.id)) })
    ] }) }) }) }),
    /* @__PURE__ */ jsx(
      UserInfoDialog,
      {
        user: selectedUser,
        open: dialogOpen,
        onOpenChange: setDialogOpen
      }
    )
  ] });
};
function ProductRequestsManagement({ orderId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openOrders, setOpenOrders] = useState(/* @__PURE__ */ new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [hideRejected, setHideRejected] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [quotePrice, setQuotePrice] = useState("");
  const [quoteInvoiceUrl, setQuoteInvoiceUrl] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [productIssues, setProductIssues] = useState(
    /* @__PURE__ */ new Map()
  );
  const [showShippingDialog, setShowShippingDialog] = useState(false);
  const [shippingPrice, setShippingPrice] = useState("");
  const [shippingInvoiceUrl, setShippingInvoiceUrl] = useState("");
  const [showTrackingDialog, setShowTrackingDialog] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const { toast: toast2 } = useToast();
  useEffect(() => {
    fetchOrders();
  }, [hideRejected, itemsPerPage]);
  useEffect(() => {
    if (orderId && orders.length > 0) {
      setOpenOrders((prev) => new Set(prev).add(orderId));
      setTimeout(() => {
        const element = document.getElementById(`order-${orderId}`);
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, [orderId, orders.length]);
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, itemsPerPage, hideRejected, searchTerm]);
  const fetchOrders = async () => {
    try {
      setLoading(true);
      let ordersQuery = supabase.from("orders").select(
        `
          *,
          order_items (
            product_request_id
          ),
          quotes (*)
        `
      );
      if (hideRejected) {
        ordersQuery = ordersQuery.eq("is_rejected", false);
      }
      const { data: ordersData, error: ordersError } = await ordersQuery.order("created_at", { ascending: false });
      if (ordersError) throw ordersError;
      const allProductRequestIds = /* @__PURE__ */ new Set();
      (ordersData || []).forEach((order) => {
        order.order_items.forEach((item) => {
          allProductRequestIds.add(item.product_request_id);
        });
      });
      const { data: allRequests, error: requestsError } = await supabase.from("product_requests").select("*").in("id", Array.from(allProductRequestIds));
      if (requestsError) throw requestsError;
      const requestsMap = /* @__PURE__ */ new Map();
      (allRequests || []).forEach((request) => {
        requestsMap.set(request.id, request);
      });
      const userIds = [...new Set((ordersData || []).map((o) => o.user_id))];
      const { data: profiles, error: profilesError } = await supabase.from("profiles").select("id, full_name, email, user_personal_id").in("id", userIds);
      if (profilesError) throw profilesError;
      const profileMap = new Map((profiles || []).map((p) => [p.id, p]));
      const ordersWithDetails = (ordersData || []).map((order) => {
        let items;
        if (order.is_rejected && order.rejection_details && typeof order.rejection_details === "object") {
          const rejectionDetails = order.rejection_details;
          if (rejectionDetails.product_issues && Array.isArray(rejectionDetails.product_issues)) {
            items = rejectionDetails.product_issues.map((issue) => ({
              id: issue.product_id,
              user_id: order.user_id,
              product_url: issue.product_url,
              item_name: issue.item_name,
              quantity: issue.quantity || 1,
              status: "rejected",
              has_purchase_issue: issue.has_issue,
              purchase_issue_description: issue.issue_description,
              created_at: order.created_at,
              updated_at: order.updated_at
            }));
          } else {
            items = [];
          }
        } else {
          items = order.order_items.map((item) => requestsMap.get(item.product_request_id)).filter(Boolean);
        }
        return {
          ...order,
          profiles: profileMap.get(order.user_id) || null,
          items
        };
      });
      setOrders(ordersWithDetails.map((order) => ({
        ...order,
        rejection_details: order.rejection_details
      })));
      setOrders(ordersWithDetails.map((order) => ({
        ...order,
        rejection_details: order.rejection_details
      })));
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast2({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchOrders();
      toast$1.success("Orders updated successfully");
    } catch (error) {
      toast$1.error("Failed to refresh orders");
    } finally {
      setRefreshing(false);
    }
  };
  const toggleOrder = (orderId2) => {
    setOpenOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId2)) {
        newSet.delete(orderId2);
      } else {
        newSet.add(orderId2);
      }
      return newSet;
    });
  };
  const createOrderQuote = async () => {
    if (!selectedOrder || !quoteInvoiceUrl) return;
    try {
      const { error: quoteError } = await supabase.from("quotes").insert({
        type: "product",
        order_id: selectedOrder.id,
        price_jpy: null,
        // no price included
        status: "sent",
        quote_url: quoteInvoiceUrl
      });
      if (quoteError) throw quoteError;
      const productIds = selectedOrder.items.map((item) => item.id);
      const { error: updateError } = await supabase.from("product_requests").update({ status: "quoted" }).in("id", productIds);
      if (updateError) throw updateError;
      await createNotification(
        selectedOrder.user_id,
        "quote_received",
        `Your product quote for Order #${selectedOrder.order_personal_id} is ready. Please review and complete payment.`,
        selectedOrder.order_personal_id,
        null,
        selectedOrder.id
      );
      toast2({
        title: "Quote Created",
        description: "Order quote has been sent to the customer"
      });
      setSelectedOrder(null);
      setQuoteInvoiceUrl("");
      setProductIssues(/* @__PURE__ */ new Map());
      fetchOrders();
    } catch (error) {
      toast2({
        title: "Error",
        description: error.message || "Failed to create quote",
        variant: "destructive"
      });
    }
  };
  const rejectOrder = async () => {
    if (!selectedOrder || !rejectionReason.trim()) {
      toast2({
        title: "Error",
        description: "Please provide a reason for rejection",
        variant: "destructive"
      });
      return;
    }
    try {
      const productIssuesArray = selectedOrder.items.map((item) => ({
        product_id: item.id,
        product_url: item.product_url,
        item_name: item.item_name,
        quantity: item.quantity,
        has_issue: productIssues.get(item.id)?.hasIssue || false,
        issue_description: productIssues.get(item.id)?.description || null
      }));
      const rejectionDetails = {
        rejection_reason: rejectionReason.trim(),
        rejected_at: (/* @__PURE__ */ new Date()).toISOString(),
        product_issues: productIssuesArray
      };
      const { error: orderError } = await supabase.from("orders").update({
        is_rejected: true,
        rejection_reason: rejectionReason.trim(),
        rejection_details: rejectionDetails
      }).eq("id", selectedOrder.id);
      if (orderError) throw orderError;
      const productIds = selectedOrder.items.map((item) => item.id);
      const { error: productsError } = await supabase.from("product_requests").update({
        status: "rejected",
        rejection_reason: rejectionReason.trim()
      }).in("id", productIds);
      if (productsError) throw productsError;
      for (const [productId, issue] of productIssues.entries()) {
        if (issue.hasIssue) {
          await supabase.from("product_requests").update({
            has_purchase_issue: true,
            purchase_issue_description: issue.description
          }).eq("id", productId);
        }
      }
      await createNotification(
        selectedOrder.user_id,
        "order_rejected",
        `Your Order #${selectedOrder.order_personal_id} has been rejected. Reason: ${rejectionReason.substring(0, 100)}${rejectionReason.length > 100 ? "..." : ""}`,
        selectedOrder.order_personal_id,
        null,
        selectedOrder.id
      );
      toast2({
        title: "Order Rejected",
        description: "Order has been rejected and customer will be notified"
      });
      setSelectedOrder(null);
      setRejectionReason("");
      setProductIssues(/* @__PURE__ */ new Map());
      fetchOrders();
    } catch (error) {
      toast2({
        title: "Error",
        description: error.message || "Failed to reject order",
        variant: "destructive"
      });
    }
  };
  const updateProductIssue = (productId, hasIssue, description) => {
    setProductIssues((prev) => {
      const newMap = new Map(prev);
      newMap.set(productId, { hasIssue, description });
      return newMap;
    });
  };
  const confirmProductPayment = async (order) => {
    try {
      const sentQuote = order.quotes?.find((q) => q.status === "sent" && q.type === "product");
      if (!sentQuote) {
        toast2({
          title: "Error",
          description: "No pending quote found for this order",
          variant: "destructive"
        });
        return;
      }
      const { error: quoteError } = await supabase.from("quotes").update({ status: "paid" }).eq("id", sentQuote.id);
      if (quoteError) throw quoteError;
      const productIds = order.items.map((item) => item.id);
      const { error: productsError } = await supabase.from("product_requests").update({ status: "paid" }).in("id", productIds);
      if (productsError) throw productsError;
      await createNotification(
        order.user_id,
        "payment_confirmed",
        `Your payment for Order #${order.order_personal_id} has been confirmed! We will now purchase your items.`,
        order.order_personal_id,
        null,
        order.id
      );
      toast2({
        title: "Payment Confirmed",
        description: "Payment has been confirmed and products status updated"
      });
      fetchOrders();
    } catch (error) {
      toast2({
        title: "Error",
        description: error.message || "Failed to confirm payment",
        variant: "destructive"
      });
    }
  };
  const markProductsAsReceived = async (order, weights) => {
    try {
      const purchasedItems = order.items.filter((item) => item.status === "purchased");
      if (purchasedItems.length === 0) {
        toast2({
          title: "No Items Found",
          description: "There are no purchased items to mark as received."
        });
        return;
      }
      for (const item of purchasedItems) {
        const weight = weights.get(item.id);
        await supabase.from("product_requests").update({
          status: "received",
          updated_at: (/* @__PURE__ */ new Date()).toISOString(),
          ...weight !== void 0 ? { weight } : {}
        }).eq("id", item.id);
      }
      const { data: allOrderItems } = await supabase.from("order_items").select(`
          product_request_id,
          product_requests!inner(status)
        `).eq("order_id", order.id);
      const allReceived = allOrderItems?.every(
        (item) => item.product_requests.status === "received"
      );
      if (allReceived && allOrderItems && allOrderItems.length > 0) {
        await createNotification(
          order.user_id,
          "items_at_warehouse",
          `All your items for Order #${order.order_personal_id} have arrived at our warehouse!`,
          order.order_personal_id,
          null,
          order.id
        );
      }
      toast2({
        title: "Products Marked",
        description: `${purchasedItems.length} product(s) marked as received.`
      });
      fetchOrders();
    } catch (error) {
      toast2({
        title: "Error",
        description: error.message || "Failed to mark products as received.",
        variant: "destructive"
      });
    }
  };
  const markProductsAsPurchased = async (order) => {
    try {
      const paidProducts = order.items.filter((item) => item.status === "paid");
      if (paidProducts.length === 0) {
        toast2({
          title: "No Products to Mark",
          description: "No paid products found to mark as purchased"
        });
        return;
      }
      const updates = paidProducts.map((item) => {
        const invoiceInput = document.getElementById(`invoice-${item.id}`);
        const invoiceId = invoiceInput?.value?.trim() || null;
        return { id: item.id, invoice_id: invoiceId };
      });
      for (const { id, invoice_id } of updates) {
        await supabase.from("product_requests").update({
          status: "purchased",
          invoice_id,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }).eq("id", id);
      }
      toast2({
        title: "Products Marked",
        description: `${updates.length} product(s) marked as purchased with invoice IDs`
      });
      fetchOrders();
    } catch (error) {
      toast2({
        title: "Error",
        description: error.message || "Failed to mark products as purchased",
        variant: "destructive"
      });
    }
  };
  const markIndividualProductAsPurchased = async (productId) => {
    try {
      const invoiceInput = document.getElementById(`invoice-${productId}`);
      const invoiceId = invoiceInput?.value?.trim() || null;
      const { error } = await supabase.from("product_requests").update({
        status: "purchased",
        invoice_id: invoiceId,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", productId);
      if (error) throw error;
      toast2({
        title: "Product Marked",
        description: "Product marked as purchased"
      });
      fetchOrders();
    } catch (error) {
      toast2({
        title: "Error",
        description: error.message || "Failed to mark product as purchased",
        variant: "destructive"
      });
    }
  };
  const updateProductInvoiceId = async (productId, invoiceId) => {
    try {
      const { error } = await supabase.from("product_requests").update({
        invoice_id: invoiceId.trim() || null,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", productId);
      if (error) throw error;
      toast2({
        title: "Invoice ID Updated",
        description: "Product invoice ID has been updated"
      });
      fetchOrders();
    } catch (error) {
      toast2({
        title: "Error",
        description: error.message || "Failed to update invoice ID",
        variant: "destructive"
      });
    }
  };
  const markIndividualProductAsReceived = async (productRequestId, weight) => {
    try {
      const updateData = {
        status: "received",
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      if (weight !== void 0) {
        updateData.weight = weight;
      }
      const { error } = await supabase.from("product_requests").update(updateData).eq("id", productRequestId);
      if (error) throw error;
      const { data: orderItems } = await supabase.from("order_items").select("product_request_id, order_id").eq("product_request_id", productRequestId).single();
      if (orderItems) {
        const { data: allOrderItems } = await supabase.from("order_items").select(
          `
            product_request_id,
            product_requests!inner(status)
          `
        ).eq("order_id", orderItems.order_id);
        const allReceived = allOrderItems?.every((item) => item.product_requests.status === "received");
        if (allReceived && allOrderItems && allOrderItems.length > 0) {
          const { data: order } = await supabase.from("orders").select("user_id, order_personal_id").eq("id", orderItems.order_id).single();
          if (order) {
            await createNotification(
              order.user_id,
              "items_at_warehouse",
              `All your items for Order #${order.order_personal_id} have arrived at our warehouse!`,
              order.order_personal_id,
              null,
              orderItems.order_id
            );
          }
        }
      }
      toast2({
        title: "Product Marked",
        description: "Product marked as received"
      });
      fetchOrders();
    } catch (error) {
      toast2({
        title: "Error",
        description: error.message || "Failed to mark product as received",
        variant: "destructive"
      });
    }
  };
  const confirmShippingPayment = async (order) => {
    try {
      const shippingQuote = order.quotes?.find((q) => q.type === "shipping" && q.status === "sent");
      if (shippingQuote) {
        const { error: quoteError } = await supabase.from("quotes").update({ status: "paid" }).eq("id", shippingQuote.id);
        if (quoteError) throw quoteError;
      }
      const productIds = order.items.map((item) => item.id);
      const { error: productError } = await supabase.from("product_requests").update({ status: "shipping_paid" }).in("id", productIds);
      if (productError) throw productError;
      toast2({
        title: "Shipping Payment Confirmed",
        description: "Shipping payment has been confirmed"
      });
      fetchOrders();
    } catch (error) {
      toast2({
        title: "Error",
        description: error.message || "Failed to confirm shipping payment",
        variant: "destructive"
      });
    }
  };
  const shipOrder = async (order) => {
    if (!trackingNumber) return;
    try {
      const { error: orderError } = await supabase.from("orders").update({
        status: "shipped",
        tracking_number: trackingNumber,
        shipped_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", order.id);
      if (orderError) throw orderError;
      const productIds = order.items.map((item) => item.id);
      const { error: productError } = await supabase.from("product_requests").update({ status: "shipped" }).in("id", productIds);
      if (productError) throw productError;
      toast2({
        title: "Order Shipped",
        description: "Order has been marked as shipped"
      });
      setShowTrackingDialog(false);
      setTrackingNumber("");
      fetchOrders();
    } catch (error) {
      toast2({
        title: "Error",
        description: error.message || "Failed to ship order",
        variant: "destructive"
      });
    }
  };
  const getOrderStatus = (order) => {
    if (order.is_rejected) return "Rejected";
    if (order.status === "shipped") return "Shipped";
    const productStatuses = order.items.map((item) => item.status);
    const allSameStatus = productStatuses.every((status) => status === productStatuses[0]);
    if (allSameStatus && productStatuses[0]) {
      switch (productStatuses[0]) {
        case "shipping_paid":
          return "Ready to Ship";
        case "shipping_quoted":
          return "Awaiting Shipping Payment";
        case "received":
          return "Stored";
        case "purchased":
          return "Purchased";
        case "paid":
          return "Paid";
        case "quoted":
          return "Quoted";
        case "requested":
          return "New";
      }
    }
    const hasPurchased = productStatuses.includes("purchased");
    const hasPaid = productStatuses.includes("paid");
    const hasReceived = productStatuses.includes("received");
    if (hasPurchased && hasPaid) {
      return "Partially Purchased";
    }
    if (hasReceived && (hasPurchased || hasPaid)) {
      return "Partial Processing";
    }
    if (order.status === "awaiting_shipping_payment") return "Awaiting Shipping Payment";
    if (order.status === "weighing") return "Weighing";
    if (order.status === "preparing") return "Preparing";
    return "New";
  };
  const getOrderStatusColor = (status) => {
    switch (status) {
      case "New":
        return "bg-capybara-yellow text-red-500 border-slate-400/20";
      case "Quoted":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "Paid":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Partially Purchased":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "Purchased":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "Partial Processing":
        return "bg-indigo-500/10 text-indigo-600 border-indigo-500/20";
      case "Preparing":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "Stored":
        return "bg-sky-500/10 text-sky-600 border-sky-500/20";
      case "Awaiting Shipping":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "Shipped":
        return "bg-cyan-500/10 text-cyan-600 border-cyan-500/20";
      case "Rejected":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };
  const getStatusSteps = (order) => {
    const status = getOrderStatus(order);
    const allPurchased = order.items.every(
      (item) => ["purchased", "received", "shipping_quoted", "shipping_paid", "shipped"].includes(item.status)
    );
    order.items.some(
      (item) => ["purchased", "received", "shipping_quoted", "shipping_paid", "shipped"].includes(item.status)
    );
    order.items.some((item) => item.status === "received");
    const allReceived = order.items.every((item) => item.status === "received");
    const purchaseLabel = allPurchased || status === "Partial Processing" || status === "Weighing" || status === "Awaiting Shipping Payment" || allReceived ? "Items Purchased" : "Item(s) being purchased";
    const steps = [
      { label: "Request Submitted", status: "upcoming", icon: /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" }) },
      { label: "Payment Confirmed", status: "upcoming", icon: /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4" }) },
      { label: purchaseLabel, status: "upcoming", icon: /* @__PURE__ */ jsx(ShoppingCart, { className: "h-4 w-4" }) },
      {
        label: "Item(s) on the way to warehouse",
        status: "upcoming",
        icon: /* @__PURE__ */ jsx(Truck, { className: "h-4 w-4" })
      },
      { label: "All Items at Warehouse", status: "upcoming", icon: /* @__PURE__ */ jsx(Home$1, { className: "h-4 w-4" }) }
    ];
    const statusMap = {
      New: 0,
      Quoted: 0,
      Paid: 1,
      Purchased: 2,
      "Partially Purchased": 2,
      "Partial Processing": 3,
      Weighing: 4,
      "Awaiting Shipping Payment": 4,
      "Ready to Ship": 4,
      Shipped: 4
    };
    const currentIndex = statusMap[status] ?? -1;
    if (status === "Rejected") {
      return steps.map((step, index) => ({
        ...step,
        status: index === currentIndex ? "rejected" : "upcoming"
      }));
    }
    return steps.map((step, index) => {
      if (index === 0) return { ...step, status: "completed" };
      if (index === 1) {
        const normalizedStatus = status.toLowerCase();
        if (["new", "quoted"].includes(normalizedStatus)) {
          return { ...step, status: "current" };
        }
        if (["paid", "purchased", "weighing", "shipped"].includes(normalizedStatus)) {
          return { ...step, status: "completed" };
        }
      }
      if (index === 2) {
        const normalizedStatus = status.toLowerCase();
        if (normalizedStatus === "paid") {
          return { ...step, status: "current" };
        }
        if (["purchased", "weighing", "shipped"].includes(normalizedStatus)) {
          return { ...step, status: "completed" };
        }
      }
      if (status === "Stored" || status === "Awaiting Shipping Payment" || status === "Ready to Ship") {
        if (index <= 4) return { ...step, status: "completed" };
      }
      if (status === "Purchased" && allPurchased) {
        if (index < 2) return { ...step, status: "completed" };
        if (index === 2) return { ...step, status: "completed" };
        if (index === 3) return { ...step, status: "current" };
        return { ...step, status: "upcoming" };
      }
      if (index < currentIndex) return { ...step, status: "completed" };
      if (index === currentIndex) return { ...step, status: "current" };
      if (status === "Partial Processing" && index === 2) return { ...step, status: "completed" };
      return { ...step, status: "upcoming" };
    });
  };
  if (loading) {
    return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsx("div", { className: "text-center text-muted-foreground", children: "Loading orders..." }) }) });
  }
  let filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    return order.profiles?.full_name?.toLowerCase().includes(searchLower) || order.profiles?.email?.toLowerCase().includes(searchLower) || order.profiles?.user_personal_id?.toLowerCase().includes(searchLower) || order.order_personal_id?.toLowerCase().includes(searchLower) || order.id.toLowerCase().includes(searchLower);
  });
  if (statusFilter !== "all") {
    filteredOrders = filteredOrders.filter((order) => {
      const status = getOrderStatus(order);
      return status.toLowerCase() === statusFilter.toLowerCase();
    });
  }
  const totalFilteredPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
  const formatShortUrl2 = (url) => {
    try {
      const parsed = new URL(url);
      const domain = parsed.hostname.replace(/^www\./, "");
      const path = parsed.pathname + parsed.search + parsed.hash;
      const shortenedPath = path.length > 40 ? path.slice(0, 40) + "..." : path;
      return `${domain}${shortenedPath}`;
    } catch {
      return url.length > 50 ? url.slice(0, 50) + "..." : url;
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsx(CardTitle, { children: "Order Management" }),
      /* @__PURE__ */ jsx(CardDescription, { children: "Manage customer orders and product requests" })
    ] }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsx(Card, { className: "bg-muted/30", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative w-full sm:w-auto", children: [
              /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "Search by customer name, email, customer ID, or order ID...",
                  value: searchTerm,
                  onChange: (e) => setSearchTerm(e.target.value),
                  className: "pl-10 w-full sm:w-[350px]"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Status:" }),
              /* @__PURE__ */ jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [
                /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[180px]", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All Statuses" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "new", children: "New" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "quoted", children: "Quoted" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "paid", children: "Paid" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "purchased", children: "Purchased" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "partially purchased", children: "Partially Purchased" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "partial processing", children: "Partial Processing" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "weighing", children: "Weighing" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "rejected", children: "Rejected" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: handleRefresh, disabled: refreshing, className: "gap-2", children: [
                /* @__PURE__ */ jsx(RefreshCw, { className: `h-4 w-4 ${refreshing ? "animate-spin" : ""}` }),
                refreshing ? "Refreshing..." : "Update"
              ] }),
              /* @__PURE__ */ jsx(
                Checkbox,
                {
                  id: "hide-rejected-products",
                  checked: hideRejected,
                  onCheckedChange: (checked) => setHideRejected(checked === true)
                }
              ),
              /* @__PURE__ */ jsx("label", { htmlFor: "hide-rejected-products", className: "text-sm font-medium cursor-pointer", children: "Hide rejected" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Show:" }),
            /* @__PURE__ */ jsxs(Select, { value: itemsPerPage.toString(), onValueChange: (val) => setItemsPerPage(Number(val)), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[100px]", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "5", children: "5" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "10", children: "10" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "25", children: "25" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "50", children: "50" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "per page" })
          ] })
        ] }),
        filteredOrders.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-4 text-sm text-muted-foreground", children: [
          "Showing ",
          startIndex + 1,
          "-",
          Math.min(endIndex, filteredOrders.length),
          " of ",
          filteredOrders.length,
          " orders"
        ] })
      ] }) }),
      filteredOrders.length === 0 && orders.length > 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-8 text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Package, { className: "h-12 w-12 mx-auto mb-4 opacity-50" }),
        /* @__PURE__ */ jsx("p", { children: "No orders found with this filter" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm mt-2", children: "Try adjusting your search or filter criteria." })
      ] }) : filteredOrders.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-center py-8", children: "No orders found matching your criteria." }) : paginatedOrders.map((order) => {
        const isOpen = openOrders.has(order.id);
        const orderStatus = getOrderStatus(order);
        return /* @__PURE__ */ jsx(Collapsible, { open: isOpen, onOpenChange: () => toggleOrder(order.id), children: /* @__PURE__ */ jsxs(Card, { id: `order-${order.id}`, className: "border", children: [
          /* @__PURE__ */ jsx(CollapsibleTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              className: "w-full p-0 h-auto hover:bg-transparent",
              onClick: (e) => {
                if ((window.getSelection()?.toString().length ?? 0) > 0) {
                  e.stopPropagation();
                }
              },
              children: /* @__PURE__ */ jsx("div", { className: "w-full p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col text-left flex-1 min-w-0 space-y-1", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 min-w-0", children: [
                    /* @__PURE__ */ jsxs("p", { className: "font-medium text-base flex items-baseline gap-1 min-w-0", children: [
                      /* @__PURE__ */ jsx("span", { className: "flex-shrink-0 select-text", onMouseDown: (e) => e.stopPropagation(), onClick: (e) => e.stopPropagation(), children: "Order from" }),
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: "text-blue-500 font-semibold truncate select-text",
                          title: order.profiles?.full_name || order.profiles?.email || "Unknown",
                          onMouseDown: (e) => e.stopPropagation(),
                          onClick: (e) => e.stopPropagation(),
                          children: order.profiles?.full_name || order.profiles?.email || "Unknown"
                        }
                      )
                    ] }),
                    order.profiles?.full_name || order.profiles?.email ? /* @__PURE__ */ jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        className: "h-4 w-4 p-0",
                        onClick: (e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(order.profiles?.full_name || order.profiles?.email || "");
                          toast$1.success("Customer name copied to clipboard");
                        },
                        title: "Copy Customer Name",
                        children: /* @__PURE__ */ jsx(Copy, { className: "h-3 w-3" })
                      }
                    ) : null
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-sm text-muted-foreground min-w-0", children: [
                    /* @__PURE__ */ jsxs("span", { className: "flex items-baseline gap-1 min-w-0", children: [
                      /* @__PURE__ */ jsx("span", { className: "flex-shrink-0 select-text", onMouseDown: (e) => e.stopPropagation(), onClick: (e) => e.stopPropagation(), children: "Customer ID:" }),
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: "font-medium text-green-500 truncate select-text",
                          title: order.profiles?.user_personal_id ? `#${order.profiles.user_personal_id}` : "N/A",
                          onMouseDown: (e) => e.stopPropagation(),
                          onClick: (e) => e.stopPropagation(),
                          children: order.profiles?.user_personal_id ? `#${order.profiles.user_personal_id}` : "N/A"
                        }
                      )
                    ] }),
                    order.profiles?.user_personal_id && /* @__PURE__ */ jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        className: "h-4 w-4 p-0",
                        onClick: (e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(order.profiles?.user_personal_id || "");
                          toast$1.success("Customer ID copied to clipboard");
                        },
                        title: "Copy Customer ID",
                        children: /* @__PURE__ */ jsx(Copy, { className: "h-3 w-3" })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-sm text-muted-foreground min-w-0", children: [
                    /* @__PURE__ */ jsxs("span", { className: "flex items-baseline gap-1 min-w-0", children: [
                      /* @__PURE__ */ jsx("span", { className: "flex-shrink-0 select-text", onMouseDown: (e) => e.stopPropagation(), onClick: (e) => e.stopPropagation(), children: "Customer Order ID:" }),
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: "font-medium text-green-500 truncate select-text",
                          title: order.order_personal_id ? `#${order.order_personal_id}` : "N/A",
                          onMouseDown: (e) => e.stopPropagation(),
                          onClick: (e) => e.stopPropagation(),
                          children: order.order_personal_id ? `#${order.order_personal_id}` : "N/A"
                        }
                      )
                    ] }),
                    order.order_personal_id && /* @__PURE__ */ jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        className: "h-4 w-4 p-0",
                        onClick: (e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(order.order_personal_id || "");
                          toast$1.success("Customer Order ID copied to clipboard");
                        },
                        title: "Copy Customer Order ID",
                        children: /* @__PURE__ */ jsx(Copy, { className: "h-3 w-3" })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-sm text-muted-foreground min-w-0", children: [
                    /* @__PURE__ */ jsxs(
                      "span",
                      {
                        className: "font-medium truncate select-text",
                        title: `Order #${order.id.slice(0, 8).toUpperCase()}`,
                        onMouseDown: (e) => e.stopPropagation(),
                        onClick: (e) => e.stopPropagation(),
                        children: [
                          "Order #",
                          order.id.slice(0, 8).toUpperCase()
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        className: "h-4 w-4 p-0",
                        onClick: (e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(order.id);
                          toast$1.success("Order ID copied to clipboard");
                        },
                        title: "Copy Order ID",
                        children: /* @__PURE__ */ jsx(Copy, { className: "h-3 w-3" })
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-1 text-right flex-shrink-0 min-w-fit", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(Badge, { className: `${getOrderStatusColor(orderStatus)} text-xs`, children: orderStatus }),
                    /* @__PURE__ */ jsx(
                      ChevronDown,
                      {
                        className: `h-5 w-5 text-muted-foreground transform transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:items-end text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }),
                      new Date(order.created_at).toLocaleString(void 0, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })
                    ] }),
                    /* @__PURE__ */ jsxs("p", { children: [
                      order.items.length,
                      " product",
                      order.items.length !== 1 ? "s" : ""
                    ] })
                  ] })
                ] })
              ] }) })
            }
          ) }),
          /* @__PURE__ */ jsx(CollapsibleContent, { children: /* @__PURE__ */ jsxs("div", { className: "px-4 pb-4 border-t pt-3", children: [
            /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx(StatusFlow, { steps: getStatusSteps(order) }) }),
            order.is_rejected && order.rejection_details && /* @__PURE__ */ jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 mb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsx(AlertCircle, { className: "h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium text-red-900 mb-1", children: "Order Rejected" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-red-800", children: order.rejection_details.rejection_reason }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-red-600 mt-2", children: [
                  "Rejected on ",
                  new Date(order.rejection_details.rejected_at).toLocaleString()
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-medium text-sm", children: "Products in this order:" }),
              order.items.map((item, index) => /* @__PURE__ */ jsx("div", { className: "p-3 bg-secondary/30 rounded-lg", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-between", children: /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxs("p", { className: "font-medium", children: [
                    index + 1,
                    ") ",
                    item.item_name || "Unnamed Product"
                  ] }),
                  item.has_purchase_issue && /* @__PURE__ */ jsxs(Badge, { className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-xs", children: [
                    /* @__PURE__ */ jsx(Flag, { className: "h-3 w-3 mr-1" }),
                    "Issue Flagged"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-sm text-muted-foreground", children: [
                  /* @__PURE__ */ jsxs("span", { children: [
                    "Qty: ",
                    item.quantity
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "space-y-2", children: /* @__PURE__ */ jsxs(
                    "a",
                    {
                      href: item.product_url,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: "flex items-center gap-1 text-blue-600 hover:underline break-all",
                      title: item.product_url,
                      children: [
                        /* @__PURE__ */ jsx(Link$1, { className: "h-3 w-3 flex-shrink-0" }),
                        formatShortUrl2(item.product_url)
                      ]
                    }
                  ) })
                ] }),
                item.notes && /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
                  "Notes: ",
                  item.notes
                ] }),
                (() => {
                  if (order.rejection_details) {
                    const rejectionIssue = order.rejection_details.product_issues?.find(
                      (pi) => pi.product_id === item.id
                    );
                    return rejectionIssue?.has_issue && rejectionIssue?.issue_description ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 mt-2 bg-yellow-50 border border-yellow-200 rounded p-2", children: [
                      /* @__PURE__ */ jsx(AlertCircle, { className: "h-3 w-3 text-yellow-600 flex-shrink-0" }),
                      /* @__PURE__ */ jsxs("span", { className: "text-xs text-yellow-700", children: [
                        "Issue: ",
                        rejectionIssue.issue_description
                      ] })
                    ] }) : null;
                  } else {
                    return item.purchase_issue_description ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 mt-2 bg-yellow-50 border border-yellow-200 rounded p-2", children: [
                      /* @__PURE__ */ jsx(AlertCircle, { className: "h-3 w-3 text-yellow-600 flex-shrink-0" }),
                      /* @__PURE__ */ jsxs("span", { className: "text-xs text-yellow-700", children: [
                        "Issue: ",
                        item.purchase_issue_description
                      ] })
                    ] }) : null;
                  }
                })(),
                item.status === "paid" && /* @__PURE__ */ jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    onClick: () => markIndividualProductAsPurchased(item.id),
                    className: "mt-2",
                    children: [
                      /* @__PURE__ */ jsx(Package, { className: "h-3 w-3 mr-1" }),
                      "Mark as Purchased"
                    ]
                  }
                ),
                ["paid", "purchased", "received", "shipping_quoted", "shipping_paid", "shipped"].includes(item.status) && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      type: "text",
                      placeholder: "Invoice ID",
                      className: "w-40 h-8",
                      defaultValue: item.invoice_id || "",
                      id: `invoice-${item.id}`
                    }
                  ),
                  ["purchased", "received", "shipping_quoted", "shipping_paid", "shipped"].includes(item.status) && /* @__PURE__ */ jsx(
                    Button,
                    {
                      onClick: () => {
                        const invoiceInput = document.getElementById(`invoice-${item.id}`);
                        if (invoiceInput) {
                          updateProductInvoiceId(item.id, invoiceInput.value);
                        }
                      },
                      size: "sm",
                      variant: "outline",
                      children: "Save Invoice ID"
                    }
                  )
                ] }),
                item.status === "purchased" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      type: "number",
                      placeholder: "Weight (g)",
                      className: "w-28 h-8",
                      id: `weight-${item.id}`,
                      min: "0",
                      step: "1"
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    Button,
                    {
                      onClick: () => {
                        const weightInput = document.getElementById(
                          `weight-${item.id}`
                        );
                        const weight = weightInput ? parseFloat(weightInput.value) : void 0;
                        markIndividualProductAsReceived(item.id, weight);
                      },
                      size: "sm",
                      variant: "outline",
                      children: [
                        /* @__PURE__ */ jsx(Check, { className: "h-3 w-3 mr-1" }),
                        "Mark as Received"
                      ]
                    }
                  )
                ] }),
                item.status === "received" && item.weight && /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground mt-2", children: [
                  "Weight: ",
                  item.weight,
                  "g"
                ] })
              ] }) }) }, item.id))
            ] }),
            !order.is_rejected && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 mt-4", children: [
              !order.quotes?.length && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs(Dialog, { children: [
                  /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", onClick: () => setSelectedOrder(order), children: [
                    /* @__PURE__ */ jsx(DollarSign, { className: "h-4 w-4 mr-1" }),
                    "Create Quote"
                  ] }) }),
                  /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-2xl", children: [
                    /* @__PURE__ */ jsxs(DialogHeader, { children: [
                      /* @__PURE__ */ jsx(DialogTitle, { children: "Create Order Quote" }),
                      /* @__PURE__ */ jsx(DialogDescription, { children: "Enter the invoice URL for this order quote." })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx(Label, { htmlFor: "quote-url", children: "Invoice URL" }),
                      /* @__PURE__ */ jsx(
                        Input,
                        {
                          id: "quote-url",
                          type: "url",
                          value: quoteInvoiceUrl,
                          onChange: (e) => setQuoteInvoiceUrl(e.target.value),
                          placeholder: "Enter PayPal invoice URL",
                          className: "mt-2"
                        }
                      )
                    ] }) }),
                    /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsx(Button, { onClick: createOrderQuote, children: "Create Quote" }) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs(Dialog, { children: [
                  /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
                    Button,
                    {
                      size: "sm",
                      variant: "outline",
                      className: "text-red-600 hover:text-red-700",
                      onClick: () => setSelectedOrder(order),
                      children: [
                        /* @__PURE__ */ jsx(X, { className: "h-4 w-4 mr-1" }),
                        "Reject Order"
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-2xl", children: [
                    /* @__PURE__ */ jsxs(DialogHeader, { children: [
                      /* @__PURE__ */ jsx(DialogTitle, { children: "Reject Order" }),
                      /* @__PURE__ */ jsx(DialogDescription, { children: "Reject the entire order. The customer will be able to edit and resubmit." })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx(Label, { htmlFor: "rejection-reason", children: "Rejection Reason *" }),
                        /* @__PURE__ */ jsx(
                          Textarea,
                          {
                            id: "rejection-reason",
                            value: rejectionReason,
                            onChange: (e) => setRejectionReason(e.target.value),
                            placeholder: "Explain why the order is being rejected...",
                            className: "min-h-[100px]"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx(Label, { children: "Flag Specific Products with Issues (optional)" }),
                        /* @__PURE__ */ jsx("div", { className: "space-y-2 mt-2 max-h-60 overflow-y-auto", children: order.items.map((item) => {
                          const issue = productIssues.get(item.id) || {
                            hasIssue: false,
                            description: ""
                          };
                          return /* @__PURE__ */ jsx("div", { className: "p-3 border rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
                            /* @__PURE__ */ jsx(
                              Checkbox,
                              {
                                checked: issue.hasIssue,
                                onCheckedChange: (checked) => updateProductIssue(item.id, checked, issue.description)
                              }
                            ),
                            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: item.item_name || "Unnamed Product" }),
                              issue.hasIssue && /* @__PURE__ */ jsx(
                                Input,
                                {
                                  className: "mt-2",
                                  placeholder: "Describe the issue with this product...",
                                  value: issue.description,
                                  onChange: (e) => updateProductIssue(item.id, true, e.target.value)
                                }
                              )
                            ] })
                          ] }) }, item.id);
                        }) })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsx(Button, { variant: "destructive", onClick: rejectOrder, children: "Reject Order" }) })
                  ] })
                ] })
              ] }),
              order.quotes?.some((q) => q.status === "sent" && q.type === "product") && /* @__PURE__ */ jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  className: "text-green-600 hover:text-green-700",
                  onClick: () => confirmProductPayment(order),
                  children: [
                    /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 mr-1" }),
                    "Confirm Payment"
                  ]
                }
              ),
              order.items.some((item) => item.status === "paid") && /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", onClick: () => markProductsAsPurchased(order), children: [
                /* @__PURE__ */ jsx(Package, { className: "h-4 w-4 mr-1" }),
                "Mark All Paid as Purchased"
              ] }),
              order.items.some((item) => item.status === "purchased") && /* @__PURE__ */ jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: () => {
                    const weights = /* @__PURE__ */ new Map();
                    order.items.forEach((item) => {
                      if (item.status === "purchased") {
                        const weightInput = document.getElementById(
                          `weight-${item.id}`
                        );
                        if (weightInput?.value) {
                          const weight = parseFloat(weightInput.value);
                          if (!isNaN(weight)) {
                            weights.set(item.id, weight);
                          }
                        }
                      }
                    });
                    markProductsAsReceived(order, weights);
                  },
                  children: [
                    /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 mr-1" }),
                    "Mark All Purchased as Received"
                  ]
                }
              ),
              order.quotes?.some((q) => q.status === "sent" && q.type === "shipping") && /* @__PURE__ */ jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  className: "text-green-600 hover:text-green-700",
                  onClick: () => confirmShippingPayment(order),
                  children: [
                    /* @__PURE__ */ jsx(CreditCard, { className: "h-4 w-4 mr-1" }),
                    "Confirm Shipping Payment"
                  ]
                }
              ),
              order.items.every((item) => item.status === "shipping_paid") && /* @__PURE__ */ jsxs(Dialog, { open: showTrackingDialog, onOpenChange: setShowTrackingDialog, children: [
                /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", className: "text-blue-600 hover:text-blue-700", children: [
                  /* @__PURE__ */ jsx(Truck, { className: "h-4 w-4 mr-1" }),
                  "Mark as Shipped"
                ] }) }),
                /* @__PURE__ */ jsxs(DialogContent, { children: [
                  /* @__PURE__ */ jsxs(DialogHeader, { children: [
                    /* @__PURE__ */ jsx(DialogTitle, { children: "Ship Order" }),
                    /* @__PURE__ */ jsx(DialogDescription, { children: "Enter the tracking number for this shipment." })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx(Label, { htmlFor: "tracking", children: "Tracking Number" }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        id: "tracking",
                        value: trackingNumber,
                        onChange: (e) => setTrackingNumber(e.target.value),
                        placeholder: "Enter tracking number"
                      }
                    )
                  ] }) }),
                  /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsx(Button, { onClick: () => shipOrder(order), children: "Confirm Shipment" }) })
                ] })
              ] })
            ] }),
            order.quotes && order.quotes.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-4 p-4 border border-blue-200 bg-blue-50/50 rounded-xl", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-blue-900 mb-2", children: "Quote Information" }),
              /* @__PURE__ */ jsx("div", { className: "space-y-2", children: order.quotes.map((quote) => {
                const formattedStatus = quote.status.charAt(0).toUpperCase() + quote.status.slice(1);
                let shortUrl = quote.quote_url;
                try {
                  const parsed = new URL(quote.quote_url);
                  const domain = parsed.hostname.replace(/^www\./, "");
                  const path = parsed.pathname + parsed.search + parsed.hash;
                  shortUrl = `${domain}${path.length > 20 ? path.slice(0, 20) + "..." : path}`;
                } catch {
                  shortUrl = quote.quote_url.length > 25 ? quote.quote_url.slice(0, 25) + "..." : quote.quote_url;
                }
                return /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "flex items-center justify-between bg-white/60 rounded-lg p-3 border border-blue-100 ",
                    children: /* @__PURE__ */ jsxs("div", { className: " sm:flex-row sm:items-center sm:gap-3 text-sm", children: [
                      /* @__PURE__ */ jsxs("p", { className: "text-blue-900 font-medium", children: [
                        "Status: ",
                        formattedStatus
                      ] }),
                      /* @__PURE__ */ jsxs(
                        "a",
                        {
                          href: quote.quote_url,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          className: "flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline",
                          title: quote.quote_url,
                          children: [
                            /* @__PURE__ */ jsx(Link$1, { className: "h-3.5 w-3.5" }),
                            shortUrl
                          ]
                        }
                      )
                    ] })
                  },
                  quote.id
                );
              }) })
            ] })
          ] }) })
        ] }) }, order.id);
      }),
      totalFilteredPages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-2 mt-6", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setCurrentPage((prev) => Math.max(1, prev - 1)),
            disabled: currentPage === 1,
            children: "Previous"
          }
        ),
        /* @__PURE__ */ jsxs("span", { className: "flex items-center px-3 text-sm", children: [
          "Page ",
          currentPage,
          " of ",
          totalFilteredPages
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setCurrentPage((prev) => Math.min(totalFilteredPages, prev + 1)),
            disabled: currentPage === totalFilteredPages,
            children: "Next"
          }
        )
      ] })
    ] })
  ] }) });
}
const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogPortal = AlertDialogPrimitive.Portal;
const AlertDialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;
const AlertDialogContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsx(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsx(
    AlertDialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;
const AlertDialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    ),
    ...props
  }
);
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    ),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props
  }
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;
const AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;
const AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Action,
  {
    ref,
    className: cn(buttonVariants(), className),
    ...props
  }
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;
const AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Cancel,
  {
    ref,
    className: cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    ),
    ...props
  }
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;
const formatShortUrl = (url) => {
  try {
    const parsed = new URL(url);
    const domain = parsed.hostname.replace(/^www\./, "");
    const path = parsed.pathname + parsed.search + parsed.hash;
    const shortenedPath = path.length > 40 ? path.slice(0, 40) + "..." : path;
    return domain + shortenedPath;
  } catch {
    return url.length > 60 ? url.slice(0, 60) + "..." : url;
  }
};
const StorageManagement = React__default.memo(() => {
  const { toast: toast2 } = useToast();
  const queryClient2 = useQueryClient();
  const [openSections, setOpenSections] = useState({});
  const [weights, setWeights] = useState({});
  const [invoiceIds, setInvoiceIds] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [preSelectedUserId, setPreSelectedUserId] = useState(null);
  const [isBoxConfirmDialogOpen, setIsBoxConfirmDialogOpen] = useState(false);
  const [pendingBoxItemData, setPendingBoxItemData] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [itemName, setItemName] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [itemWeight, setItemWeight] = useState("");
  const [itemInvoiceId, setItemInvoiceId] = useState("");
  const [notes, setNotes] = useState("");
  const [isBox, setIsBox] = useState(false);
  const [localTrackingNumber, setLocalTrackingNumber] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { data: allUsers } = useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("id, full_name, email, user_personal_id").order("full_name", { ascending: true });
      if (error) throw error;
      return data;
    }
  });
  const { data: storageData, isLoading } = useQuery({
    queryKey: ["admin-storage"],
    queryFn: async () => {
      const { data: productRequests, error: requestsError } = await supabase.from("product_requests").select("*").eq("status", "received").order("created_at", { ascending: false });
      if (requestsError) throw requestsError;
      if (!productRequests || productRequests.length === 0) return [];
      const { data: shippedQuotes, error: shippedError } = await supabase.from("shipping_quotes").select("items").eq("status", "sent");
      if (shippedError) throw shippedError;
      const shippedOrderItemIds = /* @__PURE__ */ new Set();
      shippedQuotes?.forEach((quote) => {
        const items = quote.items;
        items?.forEach((item) => {
          if (item.order_item_id) {
            shippedOrderItemIds.add(item.order_item_id);
          }
        });
      });
      const productRequestIds = productRequests.map((pr) => pr.id);
      const { data: orderItems, error: orderItemsError } = await supabase.from("order_items").select("id, product_request_id").in("product_request_id", productRequestIds);
      if (orderItemsError) throw orderItemsError;
      const productToOrderItemMap = new Map(
        orderItems?.map((oi) => [oi.product_request_id, oi.id]) || []
      );
      const userIds = [...new Set(productRequests.map((pr) => pr.user_id))];
      const { data: profiles, error: profilesError } = await supabase.from("profiles").select("id, full_name, email, phone_number, user_personal_id").in("id", userIds);
      if (profilesError) throw profilesError;
      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);
      const grouped = {};
      productRequests.forEach((item) => {
        const userId = item.user_id;
        const profile = profileMap.get(userId);
        const orderItemId = productToOrderItemMap.get(item.id);
        const isShipped = orderItemId && shippedOrderItemIds.has(orderItemId) || shippedOrderItemIds.has(item.id);
        if (!grouped[userId]) {
          grouped[userId] = {
            user_id: userId,
            user: {
              full_name: profile?.full_name || "Unknown User",
              email: profile?.email || "No email",
              phone_number: profile?.phone_number || "No phone"
            },
            items: [],
            totalWeight: 0,
            totalItems: 0
          };
        }
        grouped[userId].items.push({
          id: item.id,
          item_name: item.item_name,
          product_url: item.product_url,
          quantity: item.quantity,
          weight: item.weight,
          invoice_id: item.invoice_id,
          created_at: item.created_at,
          status: item.status,
          isShipped,
          is_box: item.is_box,
          local_tracking_number: item.local_tracking_number
        });
        grouped[userId].totalWeight += item.weight || 0;
        grouped[userId].totalItems += item.quantity || 1;
      });
      return Object.values(grouped);
    },
    refetchInterval: 3e4
    // Refetch every 30 seconds
  });
  const updateWeightMutation = useMutation({
    mutationFn: async ({ itemId, weight }) => {
      const { error } = await supabase.from("product_requests").update({ weight }).eq("id", itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient2.invalidateQueries({ queryKey: ["admin-storage"] });
      toast2({
        title: "Weight updated",
        description: "Item weight has been updated successfully."
      });
    },
    onError: (error) => {
      toast2({
        title: "Error",
        description: "Failed to update weight. Please try again.",
        variant: "destructive"
      });
      console.error("Update weight error:", error);
    }
  });
  const updateInvoiceIdMutation = useMutation({
    mutationFn: async ({ itemId, invoiceId }) => {
      const { error } = await supabase.from("product_requests").update({ invoice_id: invoiceId }).eq("id", itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient2.invalidateQueries({ queryKey: ["admin-storage"] });
      toast2({
        title: "Invoice ID updated",
        description: "Item invoice ID has been updated successfully."
      });
    },
    onError: (error) => {
      toast2({
        title: "Error",
        description: "Failed to update invoice ID. Please try again.",
        variant: "destructive"
      });
      console.error("Update invoice ID error:", error);
    }
  });
  const addItemMutation = useMutation({
    mutationFn: async (itemData) => {
      const { error } = await supabase.from("product_requests").insert({
        ...itemData,
        status: "received"
      });
      if (error) throw error;
      return itemData;
    },
    onSuccess: (data) => {
      queryClient2.invalidateQueries({ queryKey: ["admin-storage"] });
      if (!data.is_box) {
        setIsAddDialogOpen(false);
        resetAddForm();
        toast2({
          title: "Item added",
          description: "Item has been added to storage successfully."
        });
      }
    },
    onError: (error) => {
      toast2({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive"
      });
      console.error("Add item error:", error);
    }
  });
  const deleteItemMutation = useMutation({
    mutationFn: async (itemId) => {
      const { error } = await supabase.from("product_requests").delete().eq("id", itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient2.invalidateQueries({ queryKey: ["admin-storage"] });
      setDeleteItemId(null);
      toast2({
        title: "Item deleted",
        description: "Item has been removed from storage successfully."
      });
    },
    onError: (error) => {
      toast2({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive"
      });
      console.error("Delete item error:", error);
    }
  });
  const handleWeightUpdate = (itemId) => {
    const weight = parseFloat(weights[itemId]);
    if (!isNaN(weight) && weight > 0) {
      updateWeightMutation.mutate({ itemId, weight });
    }
  };
  const handleInvoiceIdUpdate = (itemId) => {
    const invoiceId = invoiceIds[itemId]?.trim();
    if (invoiceId) {
      updateInvoiceIdMutation.mutate({ itemId, invoiceId });
    }
  };
  const resetAddForm = () => {
    setSelectedUserId("");
    setItemName("");
    setProductUrl("");
    setQuantity("1");
    setItemWeight("");
    setItemInvoiceId("");
    setNotes("");
    setIsBox(false);
    setLocalTrackingNumber("");
    setPreSelectedUserId(null);
    setFormErrors({});
  };
  const handleAddItemForUser = (userId) => {
    setPreSelectedUserId(userId);
    setSelectedUserId(userId);
    setIsAddDialogOpen(true);
  };
  const handleAddItem = () => {
    const errors = {
      userId: !selectedUserId,
      itemName: !itemName.trim(),
      productUrl: !productUrl.trim(),
      isBox: false
    };
    setFormErrors(errors);
    if (Object.values(errors).some((error) => error)) {
      toast2({
        title: "Missing required fields",
        description: "Please fill in all required fields (marked with *).",
        variant: "destructive"
      });
      return;
    }
    const itemData = {
      user_id: selectedUserId,
      item_name: itemName.trim(),
      product_url: productUrl.trim(),
      quantity: parseInt(quantity) || 1,
      is_box: isBox
    };
    if (itemWeight) {
      itemData.weight = parseFloat(itemWeight);
    }
    if (itemInvoiceId?.trim()) {
      itemData.invoice_id = itemInvoiceId.trim();
    }
    if (notes?.trim()) {
      itemData.notes = notes.trim();
    }
    if (isBox && localTrackingNumber.trim()) {
      itemData.local_tracking_number = localTrackingNumber.trim();
    }
    if (isBox) {
      setPendingBoxItemData(itemData);
      setIsBoxConfirmDialogOpen(true);
    } else {
      addItemMutation.mutate(itemData);
    }
  };
  const handleConfirmBoxItem = async () => {
    if (!pendingBoxItemData) return;
    try {
      await addItemMutation.mutateAsync(pendingBoxItemData);
      await createNotification(
        pendingBoxItemData.user_id,
        "box_item_added",
        `A box shipment (${pendingBoxItemData.item_name}) has arrived at our warehouse and has been added to your storage.`,
        null,
        null,
        null
      );
      setIsBoxConfirmDialogOpen(false);
      setPendingBoxItemData(null);
      setIsAddDialogOpen(false);
      resetAddForm();
      toast2({
        title: "Box item added",
        description: "Box item added successfully and user has been notified by email."
      });
    } catch (error) {
      console.error("Error adding box item:", error);
      setIsBoxConfirmDialogOpen(false);
    }
  };
  const handleDeleteItem = (itemId) => {
    deleteItemMutation.mutate(itemId);
  };
  const toggleSection = (userId) => {
    setOpenSections((prev) => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };
  const filteredData = storageData?.filter((customer) => {
    const searchLower = searchTerm.toLowerCase();
    return customer.user.full_name?.toLowerCase().includes(searchLower) || customer.user.email?.toLowerCase().includes(searchLower) || customer.items.some(
      (item) => item.item_name?.toLowerCase().includes(searchLower)
    );
  });
  const totalCustomers = filteredData?.length || 0;
  const totalPages = Math.ceil(totalCustomers / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData?.slice(startIndex, endIndex);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);
  if (isLoading) {
    return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-8", children: /* @__PURE__ */ jsx("div", { className: "text-center text-muted-foreground", children: "Loading storage data..." }) }) });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Storage Management" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "View and manage all products currently in storage, grouped by customer" })
        ] }),
        /* @__PURE__ */ jsxs(Dialog, { open: isAddDialogOpen, onOpenChange: (open) => {
          setIsAddDialogOpen(open);
          if (!open) {
            resetAddForm();
          }
        }, children: [
          /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { className: "w-full sm:w-auto", children: [
            /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
            "Add Item"
          ] }) }),
          /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto px-4 sm:px-6", children: [
            /* @__PURE__ */ jsxs(DialogHeader, { children: [
              /* @__PURE__ */ jsx(DialogTitle, { children: "Add Item to Storage" }),
              /* @__PURE__ */ jsx(DialogDescription, { children: "Add a new item directly to a customer's storage" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-4 py-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "user", children: "Customer *" }),
                /* @__PURE__ */ jsxs(
                  Select,
                  {
                    value: selectedUserId,
                    onValueChange: (value) => {
                      setSelectedUserId(value);
                      setFormErrors((prev) => ({ ...prev, userId: false }));
                    },
                    children: [
                      /* @__PURE__ */ jsx(SelectTrigger, { className: formErrors.userId ? "border-destructive" : "", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select a customer" }) }),
                      /* @__PURE__ */ jsx(SelectContent, { children: allUsers?.map((user) => /* @__PURE__ */ jsxs(SelectItem, { value: user.id, children: [
                        user.full_name,
                        " (",
                        user.user_personal_id || user.email,
                        ")"
                      ] }, user.id)) })
                    ]
                  }
                ),
                formErrors.userId && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: "Customer is required" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "item-name", children: "Item Name *" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "item-name",
                    value: itemName,
                    onChange: (e) => {
                      setItemName(e.target.value);
                      setFormErrors((prev) => ({ ...prev, itemName: false }));
                    },
                    placeholder: "Enter item name",
                    className: formErrors.itemName ? "border-destructive" : ""
                  }
                ),
                formErrors.itemName && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: "Item name is required" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "product-url", children: "Product URL *" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "product-url",
                    value: productUrl,
                    onChange: (e) => {
                      setProductUrl(e.target.value);
                      setFormErrors((prev) => ({ ...prev, productUrl: false }));
                    },
                    placeholder: "https://...",
                    className: formErrors.productUrl ? "border-destructive" : ""
                  }
                ),
                formErrors.productUrl && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: "Product URL is required" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "quantity", children: "Quantity" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      id: "quantity",
                      type: "number",
                      min: "1",
                      value: quantity,
                      onChange: (e) => setQuantity(e.target.value)
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "weight", children: "Weight (g)" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      id: "weight",
                      type: "number",
                      min: "0",
                      value: itemWeight,
                      onChange: (e) => setItemWeight(e.target.value),
                      placeholder: "Optional"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "invoice-id", children: "Invoice ID" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "invoice-id",
                    value: itemInvoiceId,
                    onChange: (e) => setItemInvoiceId(e.target.value),
                    placeholder: "Optional"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "is-box", className: "flex items-center gap-2", children: "Is this a box shipment? *" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                  /* @__PURE__ */ jsx(
                    Checkbox,
                    {
                      id: "is-box",
                      checked: isBox,
                      onCheckedChange: (checked) => {
                        setIsBox(checked === true);
                        setFormErrors((prev) => ({ ...prev, isBox: false }));
                        if (!checked) {
                          setLocalTrackingNumber("");
                        }
                      },
                      className: formErrors.isBox ? "border-destructive" : ""
                    }
                  ),
                  /* @__PURE__ */ jsx("label", { htmlFor: "is-box", className: "text-sm", children: "Check if this item is a box shipment" })
                ] }),
                formErrors.isBox && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: "Please specify if this is a box shipment" })
              ] }),
              isBox && /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "local-tracking", children: "Local Tracking Number" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "local-tracking",
                    value: localTrackingNumber,
                    onChange: (e) => setLocalTrackingNumber(e.target.value),
                    placeholder: "Optional - Enter local tracking number"
                  }
                ),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Only applicable for box shipments" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "notes", children: "Notes" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "notes",
                    value: notes,
                    onChange: (e) => setNotes(e.target.value),
                    placeholder: "Optional"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs(DialogFooter, { children: [
              /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setIsAddDialogOpen(false), children: "Cancel" }),
              /* @__PURE__ */ jsx(Button, { onClick: handleAddItem, disabled: addItemMutation.isPending, children: addItemMutation.isPending ? "Adding..." : "Add Item" })
            ] })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { children: [
        totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "mb-6 pb-6 border-b flex flex-col sm:flex-row items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Items per page:" }),
            /* @__PURE__ */ jsxs(
              Select,
              {
                value: itemsPerPage.toString(),
                onValueChange: (value) => setItemsPerPage(parseInt(value)),
                children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[70px]", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsx(SelectItem, { value: "5", children: "5" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "10", children: "10" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "20", children: "20" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "50", children: "50" })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
              "Showing ",
              startIndex + 1,
              "-",
              Math.min(endIndex, totalCustomers),
              " of ",
              totalCustomers
            ] })
          ] }),
          /* @__PURE__ */ jsx(Pagination, { children: /* @__PURE__ */ jsxs(PaginationContent, { children: [
            /* @__PURE__ */ jsx(PaginationItem, { children: /* @__PURE__ */ jsx(
              PaginationPrevious,
              {
                onClick: () => setCurrentPage((prev) => Math.max(1, prev - 1)),
                className: currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
              }
            ) }),
            currentPage > 2 && /* @__PURE__ */ jsx(PaginationItem, { children: /* @__PURE__ */ jsx(
              PaginationLink,
              {
                onClick: () => setCurrentPage(1),
                isActive: currentPage === 1,
                className: "cursor-pointer",
                children: "1"
              }
            ) }),
            currentPage > 3 && /* @__PURE__ */ jsx(PaginationItem, { children: /* @__PURE__ */ jsx(PaginationEllipsis, {}) }),
            currentPage > 1 && /* @__PURE__ */ jsx(PaginationItem, { children: /* @__PURE__ */ jsx(
              PaginationLink,
              {
                onClick: () => setCurrentPage(currentPage - 1),
                className: "cursor-pointer",
                children: currentPage - 1
              }
            ) }),
            /* @__PURE__ */ jsx(PaginationItem, { children: /* @__PURE__ */ jsx(PaginationLink, { isActive: true, className: "cursor-default", children: currentPage }) }),
            currentPage < totalPages && /* @__PURE__ */ jsx(PaginationItem, { children: /* @__PURE__ */ jsx(
              PaginationLink,
              {
                onClick: () => setCurrentPage(currentPage + 1),
                className: "cursor-pointer",
                children: currentPage + 1
              }
            ) }),
            currentPage < totalPages - 2 && /* @__PURE__ */ jsx(PaginationItem, { children: /* @__PURE__ */ jsx(PaginationEllipsis, {}) }),
            currentPage < totalPages - 1 && /* @__PURE__ */ jsx(PaginationItem, { children: /* @__PURE__ */ jsx(
              PaginationLink,
              {
                onClick: () => setCurrentPage(totalPages),
                isActive: currentPage === totalPages,
                className: "cursor-pointer",
                children: totalPages
              }
            ) }),
            /* @__PURE__ */ jsx(PaginationItem, { children: /* @__PURE__ */ jsx(
              PaginationNext,
              {
                onClick: () => setCurrentPage((prev) => Math.min(totalPages, prev + 1)),
                className: currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
              }
            ) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: "Search by customer name, email, or product...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "w-full sm:max-w-sm"
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: filteredData?.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-muted-foreground", children: "No items currently in storage" }) : paginatedData?.map((customer) => /* @__PURE__ */ jsxs(
          Collapsible,
          {
            open: openSections[customer.user_id],
            onOpenChange: () => toggleSection(customer.user_id),
            children: [
              /* @__PURE__ */ jsx(CollapsibleTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Card, { className: "cursor-pointer hover:bg-accent/50 transition-colors", children: /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                  /* @__PURE__ */ jsx(User, { className: "h-5 w-5 text-muted-foreground flex-shrink-0" }),
                  /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsxs("h3", { className: "font-medium truncate", children: [
                      customer.user.full_name,
                      customer.user.user_personal_id && /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground ml-2", children: [
                        "#",
                        customer.user.user_personal_id
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground truncate", children: customer.user.email })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between sm:justify-end gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "text-left sm:text-right", children: [
                    /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium", children: [
                      customer.totalItems,
                      " items"
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
                      customer.totalWeight,
                      "g total"
                    ] })
                  ] }),
                  openSections[customer.user_id] ? /* @__PURE__ */ jsx(ChevronUp, { className: "h-5 w-5 flex-shrink-0" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-5 w-5 flex-shrink-0" })
                ] })
              ] }) }) }) }),
              /* @__PURE__ */ jsx(CollapsibleContent, { children: /* @__PURE__ */ jsx(Card, { className: "mt-2 bg-accent/5", children: /* @__PURE__ */ jsxs(CardContent, { className: "pt-4", children: [
                /* @__PURE__ */ jsx("div", { className: "space-y-3", children: customer.items.map((item) => /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "p-3 rounded-lg space-y-2 border border-border",
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                            /* @__PURE__ */ jsx(Package, { className: "h-4 w-4 text-muted-foreground" }),
                            /* @__PURE__ */ jsx("span", { className: "font-medium break-words", children: item.item_name || "Unnamed Item" }),
                            /* @__PURE__ */ jsxs(Badge, { variant: "outline", children: [
                              "Qty: ",
                              item.quantity
                            ] }),
                            item.isShipped && /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", children: [
                              /* @__PURE__ */ jsx(PackageCheck, { className: "h-3 w-3 mr-1" }),
                              "Shipped"
                            ] })
                          ] }),
                          item.is_box && item.local_tracking_number ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-sm mt-1", children: [
                            /* @__PURE__ */ jsx(Package, { className: "h-3 w-3 flex-shrink-0 text-muted-foreground" }),
                            /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Tracking #:" }),
                            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: item.local_tracking_number })
                          ] }) : /* @__PURE__ */ jsxs(
                            "a",
                            {
                              href: item.product_url,
                              target: "_blank",
                              rel: "noopener noreferrer",
                              className: "flex items-center gap-1 text-sm text-blue-600 hover:underline break-all mt-1",
                              title: item.product_url,
                              children: [
                                /* @__PURE__ */ jsx(Link$1, { className: "h-3 w-3 flex-shrink-0" }),
                                formatShortUrl(item.product_url)
                              ]
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsx(
                          Button,
                          {
                            variant: "ghost",
                            size: "sm",
                            onClick: () => setDeleteItemId(item.id),
                            className: "text-destructive hover:text-destructive",
                            children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-2", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 w-full sm:w-auto", children: [
                          /* @__PURE__ */ jsx(Weight, { className: "h-4 w-4 flex-shrink-0 text-muted-foreground" }),
                          /* @__PURE__ */ jsx(
                            Input,
                            {
                              type: "number",
                              placeholder: "Weight (g)",
                              className: "flex-1 sm:w-24 min-w-0",
                              value: weights[item.id] !== void 0 ? weights[item.id] : item.weight || "",
                              onChange: (e) => setWeights((prev) => ({
                                ...prev,
                                [item.id]: e.target.value
                              }))
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            Button,
                            {
                              size: "sm",
                              variant: "outline",
                              onClick: () => handleWeightUpdate(item.id),
                              disabled: !weights[item.id] || updateWeightMutation.isPending,
                              children: "Update"
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 w-full sm:w-auto", children: [
                          /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground whitespace-nowrap", children: "Invoice:" }),
                          /* @__PURE__ */ jsx(
                            Input,
                            {
                              type: "text",
                              placeholder: "Invoice ID",
                              className: "flex-1 sm:w-32 min-w-0",
                              value: invoiceIds[item.id] !== void 0 ? invoiceIds[item.id] : item.invoice_id || "",
                              onChange: (e) => setInvoiceIds((prev) => ({
                                ...prev,
                                [item.id]: e.target.value
                              }))
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            Button,
                            {
                              size: "sm",
                              variant: "outline",
                              onClick: () => handleInvoiceIdUpdate(item.id),
                              disabled: invoiceIds[item.id] === void 0 || updateInvoiceIdMutation.isPending,
                              children: "Update"
                            }
                          )
                        ] })
                      ] })
                    ]
                  },
                  item.id
                )) }),
                /* @__PURE__ */ jsx("div", { className: "mt-4 pt-4 border-t", children: /* @__PURE__ */ jsxs(
                  Button,
                  {
                    variant: "outline",
                    className: "w-full sm:w-auto",
                    onClick: (e) => {
                      e.stopPropagation();
                      handleAddItemForUser(customer.user_id);
                    },
                    children: [
                      /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
                      "Add Item for ",
                      customer.user.full_name
                    ]
                  }
                ) })
              ] }) }) })
            ]
          },
          customer.user_id
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(AlertDialog, { open: deleteItemId !== null, onOpenChange: (open) => !open && setDeleteItemId(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Delete Item" }),
        /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Are you sure you want to delete this item from storage? This action cannot be undone." })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsx(
          AlertDialogAction,
          {
            onClick: () => deleteItemId && handleDeleteItem(deleteItemId),
            className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            children: "Delete"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: isBoxConfirmDialogOpen, onOpenChange: setIsBoxConfirmDialogOpen, children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Add Box Item to Storage" }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
          "Are you sure you want to add this box item to storage?",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("strong", { children: "This will notify the user by email" }),
          " that their package has arrived at the warehouse."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { onClick: () => {
          setIsBoxConfirmDialogOpen(false);
          setPendingBoxItemData(null);
        }, children: "Cancel" }),
        /* @__PURE__ */ jsx(
          AlertDialogAction,
          {
            onClick: handleConfirmBoxItem,
            disabled: addItemMutation.isPending,
            children: addItemMutation.isPending ? "Adding..." : "Confirm and Notify User"
          }
        )
      ] })
    ] }) })
  ] });
});
StorageManagement.displayName = "StorageManagement";
const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  ScrollAreaPrimitive.Root,
  {
    ref,
    className: cn("relative overflow-hidden", className),
    ...props,
    children: [
      /* @__PURE__ */ jsx(ScrollAreaPrimitive.Viewport, { className: "h-full w-full rounded-[inherit]", children }),
      /* @__PURE__ */ jsx(ScrollBar, {}),
      /* @__PURE__ */ jsx(ScrollAreaPrimitive.Corner, {})
    ]
  }
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;
const ScrollBar = React.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ jsx(
  ScrollAreaPrimitive.ScrollAreaScrollbar,
  {
    ref,
    orientation,
    className: cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ScrollAreaPrimitive.ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
  }
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;
const ShippingRequestsManagement = React__default.memo(({ shipmentId }) => {
  const { toast: toast2 } = useToast();
  const queryClient2 = useQueryClient();
  const [openSections, setOpenSections] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectingRequest, setRejectingRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [productIssues, setProductIssues] = useState([]);
  const [trackingUrl, setTrackingUrl] = useState("");
  const [trackingUrls, setTrackingUrls] = useState({});
  const [currentShipmentBoxItems, setCurrentShipmentBoxItems] = useState([]);
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);
  const [trackingRequestId, setTrackingRequestId] = useState(null);
  const [sendQuoteDialogOpen, setSendQuoteDialogOpen] = useState(false);
  const [sendQuoteRequestId, setSendQuoteRequestId] = useState(null);
  const [quotePrice, setQuotePrice] = useState("");
  const [quoteUrl, setQuoteUrl] = useState("");
  const [editTrackingDialogOpen, setEditTrackingDialogOpen] = useState(false);
  const [editTrackingUrl, setEditTrackingUrl] = useState("");
  const [editTrackingRequestId, setEditTrackingRequestId] = useState(null);
  const [editBoxTrackingDialogOpen, setEditBoxTrackingDialogOpen] = useState(false);
  const [editBoxTrackingUrl, setEditBoxTrackingUrl] = useState("");
  const [editBoxTrackingRequestId, setEditBoxTrackingRequestId] = useState(null);
  const [editBoxTrackingItemId, setEditBoxTrackingItemId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState("all");
  const [hideRejected, setHideRejected] = useState(false);
  const { data: shippingRequests, isLoading } = useQuery({
    queryKey: ["admin-shipping-requests"],
    queryFn: async () => {
      const { data: quotes, error: quotesError } = await supabase.from("shipping_quotes").select("*").order("created_at", { ascending: false });
      if (quotesError) throw quotesError;
      if (!quotes || quotes.length === 0) return [];
      const userIds = [...new Set(quotes.map((q) => q.user_id))];
      const { data: profiles, error: profilesError } = await supabase.from("profiles").select("id, full_name, email, phone_number, user_personal_id").in("id", userIds);
      if (profilesError) throw profilesError;
      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);
      const processedQuotes = await Promise.all(quotes.map(async (quote) => {
        const items = Array.isArray(quote.items) ? quote.items : [];
        const itemsWithDetails = await Promise.all(items.map(async (item) => {
          if (item.order_item_id) {
            const { data: productRequest } = await supabase.from("product_requests").select("id, product_url, item_name, quantity, weight, has_shipping_issue, shipping_issue_description, is_box, local_tracking_number").eq("id", item.order_item_id).maybeSingle();
            if (productRequest) {
              return {
                ...item,
                ...productRequest
              };
            }
          }
          return item;
        }));
        return {
          ...quote,
          items: itemsWithDetails,
          tracking_urls: quote.tracking_urls || void 0,
          user: profileMap.get(quote.user_id) || {
            full_name: "Unknown User",
            email: "No email",
            phone_number: "No phone"
          }
        };
      }));
      return processedQuotes;
    },
    refetchInterval: 3e4
  });
  React__default.useEffect(() => {
    if (shipmentId && shippingRequests && shippingRequests.length > 0) {
      setOpenSections((prev) => ({ ...prev, [shipmentId]: true }));
      setTimeout(() => {
        const element = document.getElementById(`shipment-${shipmentId}`);
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, [shipmentId, shippingRequests]);
  React__default.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, itemsPerPage, hideRejected]);
  React__default.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);
  const sendQuoteMutation = useMutation({
    mutationFn: async ({
      requestId,
      price,
      url
    }) => {
      const { error } = await supabase.from("shipping_quotes").update({
        actual_cost: price,
        quote_url: url,
        status: "quoted"
      }).eq("id", requestId);
      if (error) throw error;
    },
    onSuccess: async (_, variables) => {
      const request = shippingRequests?.find((r) => r.id === variables.requestId);
      if (request) {
        await createNotification(
          request.user_id,
          "shipping_quote_received",
          `Your shipping quote of ¥${variables.price.toLocaleString()} for Shipment #${request.shipment_personal_id}. Please review and complete payment.`,
          null,
          request.shipment_personal_id,
          variables.requestId
        );
      }
      queryClient2.invalidateQueries({ queryKey: ["admin-shipping-requests"] });
      toast2({
        title: "Quote sent",
        description: "Shipping quote has been sent to the customer."
      });
      setSendQuoteDialogOpen(false);
      setQuotePrice("");
      setQuoteUrl("");
      setSendQuoteRequestId(null);
    },
    onError: (error) => {
      toast2({
        title: "Error",
        description: "Failed to send quote. Please try again.",
        variant: "destructive"
      });
      console.error("Send quote error:", error);
    }
  });
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      requestId,
      status,
      tracking_url,
      tracking_urls
    }) => {
      const updates = { status };
      if (tracking_url !== void 0) updates.tracking_url = tracking_url;
      if (tracking_urls !== void 0) updates.tracking_urls = tracking_urls;
      const { error } = await supabase.from("shipping_quotes").update(updates).eq("id", requestId);
      if (error) throw error;
      const { data: request } = await supabase.from("shipping_quotes").select("user_id, destination, tracking_url, tracking_urls, shipment_personal_id").eq("id", requestId).single();
      if (request) {
        if (status === "paid") {
          await createNotification(
            request.user_id,
            "shipping_payment_confirmed",
            `Your payment for Shipment #${request.shipment_personal_id} has been confirmed! We will prepare your shipment to ${request.destination}.`,
            null,
            request.shipment_personal_id,
            requestId
          );
        } else if (status === "sent") {
          let trackingMsg = "";
          const trackingUrlsArray = request.tracking_urls;
          if (trackingUrlsArray && trackingUrlsArray.length > 0) {
            trackingMsg = ` Your shipment includes ${trackingUrlsArray.length} box(es) with tracking information.`;
          } else if (tracking_url) {
            trackingMsg = ` Track your package at: ${tracking_url}`;
          }
          await createNotification(
            request.user_id,
            "shipment_sent",
            `Your Shipment #${request.shipment_personal_id} to ${request.destination} has been sent!${trackingMsg}`,
            null,
            request.shipment_personal_id,
            requestId
          );
        }
      }
    },
    onSuccess: () => {
      queryClient2.invalidateQueries({ queryKey: ["admin-shipping-requests"] });
      toast2({
        title: "Status updated",
        description: "Shipping request status has been updated."
      });
      setTrackingDialogOpen(false);
      setTrackingUrl("");
      setTrackingRequestId(null);
    },
    onError: (error) => {
      toast2({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive"
      });
      console.error("Update status error:", error);
    }
  });
  const updateTrackingUrlMutation = useMutation({
    mutationFn: async ({
      requestId,
      tracking_url
    }) => {
      const { error } = await supabase.from("shipping_quotes").update({ tracking_url }).eq("id", requestId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient2.invalidateQueries({ queryKey: ["admin-shipping-requests"] });
      toast2({
        title: "Tracking URL updated",
        description: "The tracking URL has been updated successfully."
      });
      setEditTrackingDialogOpen(false);
      setEditTrackingUrl("");
      setEditTrackingRequestId(null);
    },
    onError: (error) => {
      toast2({
        title: "Error",
        description: "Failed to update tracking URL. Please try again.",
        variant: "destructive"
      });
      console.error("Update tracking URL error:", error);
    }
  });
  const updateBoxTrackingUrlMutation = useMutation({
    mutationFn: async ({
      requestId,
      itemId,
      tracking_url
    }) => {
      const { data: request, error: fetchError } = await supabase.from("shipping_quotes").select("tracking_urls").eq("id", requestId).single();
      if (fetchError) throw fetchError;
      const currentUrls = request.tracking_urls || [];
      const updatedUrls = currentUrls.map(
        (entry2) => entry2.item_id === itemId ? { ...entry2, tracking_url } : entry2
      );
      if (!currentUrls.some((entry2) => entry2.item_id === itemId)) {
        updatedUrls.push({ item_id: itemId, tracking_url, box_description: "" });
      }
      const { error } = await supabase.from("shipping_quotes").update({ tracking_urls: updatedUrls }).eq("id", requestId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient2.invalidateQueries({ queryKey: ["admin-shipping-requests"] });
      toast2({
        title: "Tracking URL updated",
        description: "The box tracking URL has been updated successfully."
      });
      setEditBoxTrackingDialogOpen(false);
      setEditBoxTrackingUrl("");
      setEditBoxTrackingRequestId(null);
      setEditBoxTrackingItemId(null);
    },
    onError: (error) => {
      toast2({
        title: "Error",
        description: "Failed to update tracking URL. Please try again.",
        variant: "destructive"
      });
      console.error("Update box tracking URL error:", error);
    }
  });
  const rejectRequestMutation = useMutation({
    mutationFn: async ({
      requestId,
      reason,
      productIssues: productIssues2,
      requestItems
    }) => {
      const productIssuesSnapshot = requestItems.map((item) => {
        const issue = productIssues2.find((pi) => pi.productId === item.id);
        return {
          product_id: item.id,
          product_url: item.product_url,
          item_name: item.item_name,
          quantity: item.quantity,
          weight: item.weight,
          has_issue: issue?.hasIssue || false,
          issue_description: issue?.issueDescription || null
        };
      });
      const rejectionDetails = {
        rejection_reason: reason,
        rejected_at: (/* @__PURE__ */ new Date()).toISOString(),
        product_issues: productIssuesSnapshot
      };
      const { error: quoteError } = await supabase.from("shipping_quotes").update({
        status: "rejected",
        rejection_reason: reason,
        rejection_details: rejectionDetails
      }).eq("id", requestId);
      if (quoteError) throw quoteError;
      const { data: request } = await supabase.from("shipping_quotes").select("user_id, shipment_personal_id").eq("id", requestId).single();
      if (request) {
        await createNotification(
          request.user_id,
          "shipping_request_rejected",
          `Your shipping request for Shipment #${request.shipment_personal_id} has been rejected. Reason: ${reason.substring(0, 100)}${reason.length > 100 ? "..." : ""}`,
          null,
          request.shipment_personal_id,
          requestId
        );
      }
    },
    onSuccess: () => {
      queryClient2.invalidateQueries({ queryKey: ["admin-shipping-requests"] });
      toast2({
        title: "Request rejected",
        description: "Shipping request has been rejected with issue details."
      });
      setRejectDialogOpen(false);
      setRejectionReason("");
      setProductIssues([]);
      setRejectingRequest(null);
    },
    onError: (error) => {
      toast2({
        title: "Error",
        description: "Failed to reject request. Please try again.",
        variant: "destructive"
      });
      console.error("Reject request error:", error);
    }
  });
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await queryClient2.invalidateQueries({ queryKey: ["admin-shipping-requests"] });
      toast2({
        title: "Updated",
        description: "Shipping requests refreshed successfully."
      });
    } catch (error) {
      toast2({
        title: "Error",
        description: "Failed to refresh data.",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
    }
  };
  const handleReject = (request) => {
    setRejectingRequest(request);
    const initialIssues = request.items.map((item) => ({
      productId: item.id,
      hasIssue: false,
      issueDescription: ""
    }));
    setProductIssues(initialIssues);
    setRejectDialogOpen(true);
  };
  const handleConfirmReject = () => {
    if (!rejectingRequest || !rejectionReason.trim()) return;
    rejectRequestMutation.mutate({
      requestId: rejectingRequest.id,
      reason: rejectionReason,
      productIssues,
      requestItems: rejectingRequest.items
    });
  };
  const updateProductIssue = (productId, field, value) => {
    setProductIssues((prev) => prev.map((issue) => {
      if (issue.productId === productId) {
        if (field === "hasIssue") {
          return { ...issue, hasIssue: value, issueDescription: value ? issue.issueDescription : "" };
        } else {
          return { ...issue, issueDescription: value };
        }
      }
      return issue;
    }));
  };
  const handleSendQuote = (requestId) => {
    setSendQuoteRequestId(requestId);
    setSendQuoteDialogOpen(true);
  };
  const handleConfirmSendQuote = () => {
    if (!sendQuoteRequestId || !quotePrice || !quoteUrl) return;
    sendQuoteMutation.mutate({
      requestId: sendQuoteRequestId,
      price: parseFloat(quotePrice),
      url: quoteUrl
    });
  };
  const handleMarkAsSent = (request) => {
    const boxItems = request.items.filter((item) => item.is_box);
    setCurrentShipmentBoxItems(boxItems);
    setTrackingRequestId(request.id);
    setTrackingDialogOpen(true);
    if (boxItems.length > 0 && request.tracking_urls) {
      const urlsMap = {};
      request.tracking_urls.forEach((entry2) => {
        urlsMap[entry2.item_id] = entry2.tracking_url;
      });
      setTrackingUrls(urlsMap);
    } else if (request.tracking_url) {
      setTrackingUrl(request.tracking_url);
    } else {
      setTrackingUrl("");
      setTrackingUrls({});
    }
  };
  const handleConfirmSent = () => {
    if (!trackingRequestId) return;
    const trackingUrlsArray = Object.entries(trackingUrls).filter(([_, url]) => url.trim() !== "").map(([itemId, url]) => ({
      item_id: itemId,
      tracking_url: url
    }));
    updateStatusMutation.mutate({
      requestId: trackingRequestId,
      status: "sent",
      tracking_url: trackingUrl || void 0,
      tracking_urls: trackingUrlsArray.length > 0 ? trackingUrlsArray : void 0
    });
  };
  const handleEditTrackingUrl = (requestId, currentUrl) => {
    setEditTrackingRequestId(requestId);
    setEditTrackingUrl(currentUrl || "");
    setEditTrackingDialogOpen(true);
  };
  const handleConfirmUpdateTrackingUrl = () => {
    if (editTrackingRequestId) {
      updateTrackingUrlMutation.mutate({
        requestId: editTrackingRequestId,
        tracking_url: editTrackingUrl
      });
    }
  };
  const handleEditBoxTrackingUrl = (requestId, itemId, currentUrl) => {
    setEditBoxTrackingRequestId(requestId);
    setEditBoxTrackingItemId(itemId);
    setEditBoxTrackingUrl(currentUrl || "");
    setEditBoxTrackingDialogOpen(true);
  };
  const handleConfirmUpdateBoxTrackingUrl = () => {
    if (editBoxTrackingRequestId && editBoxTrackingItemId) {
      updateBoxTrackingUrlMutation.mutate({
        requestId: editBoxTrackingRequestId,
        itemId: editBoxTrackingItemId,
        tracking_url: editBoxTrackingUrl
      });
    }
  };
  const toggleSection = (requestId) => {
    setOpenSections((prev) => ({
      ...prev,
      [requestId]: !prev[requestId]
    }));
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "quoted":
        return "bg-blue-100 text-blue-800";
      case "sent":
        return "bg-purple-100 text-purple-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const getStatusSteps = (currentStatus) => {
    const baseSteps = [
      { label: "Request Received", status: "completed", icon: /* @__PURE__ */ jsx(Package, { className: "h-4 w-4" }) },
      { label: "Quote Sent", status: "upcoming", icon: /* @__PURE__ */ jsx(Send, { className: "h-4 w-4" }) },
      { label: "Payment Confirmed", status: "upcoming", icon: /* @__PURE__ */ jsx(CreditCard, { className: "h-4 w-4" }) },
      { label: "Shipment Sent", status: "upcoming", icon: /* @__PURE__ */ jsx(Truck, { className: "h-4 w-4" }) }
    ];
    if (currentStatus === "rejected") {
      return [
        { label: "Request Received", status: "completed", icon: /* @__PURE__ */ jsx(Package, { className: "h-4 w-4" }) },
        { label: "Rejected", status: "rejected", icon: /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4" }) }
      ];
    }
    const statusIndex = {
      "pending": 0,
      "quoted": 1,
      "paid": 2,
      "sent": 3
    }[currentStatus] || 0;
    return baseSteps.map((step, index) => ({
      ...step,
      status: index <= statusIndex ? "completed" : "upcoming"
    }));
  };
  let filteredRequests = shippingRequests?.filter((request) => {
    const searchLower = searchTerm.toLowerCase();
    return request.user.full_name?.toLowerCase().includes(searchLower) || request.user.email?.toLowerCase().includes(searchLower) || request.user.user_personal_id?.toLowerCase().includes(searchLower) || request.destination?.toLowerCase().includes(searchLower) || request.shipment_personal_id?.toLowerCase().includes(searchLower) || request.id.toLowerCase().includes(searchLower);
  }) || [];
  if (statusFilter !== "all") {
    filteredRequests = filteredRequests.filter((request) => request.status === statusFilter);
  }
  if (hideRejected) {
    filteredRequests = filteredRequests.filter((request) => request.status !== "rejected");
  }
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, endIndex);
  if (isLoading) {
    return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-8", children: /* @__PURE__ */ jsx("div", { className: "text-center text-muted-foreground", children: "Loading shipping requests..." }) }) });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Shipping Requests" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Manage all shipping quote requests with complete shipping information" })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { children: [
        /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: "Search by customer name, email, customer ID, shipment ID, or destination...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "max-w-md"
          }
        ) }),
        /* @__PURE__ */ jsx(Card, { className: "bg-muted/30 mb-6", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Status:" }),
                /* @__PURE__ */ jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[180px]", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All Statuses" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "pending", children: "Pending Quote" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "quoted", children: "Awaiting Payment" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "paid", children: "Payment Received" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "sent", children: "Shipped" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "rejected", children: "Rejected" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: handleRefresh,
                    disabled: refreshing,
                    className: "gap-2",
                    children: [
                      /* @__PURE__ */ jsx(RefreshCw, { className: `h-4 w-4 ${refreshing ? "animate-spin" : ""}` }),
                      refreshing ? "Refreshing..." : "Update"
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  Checkbox,
                  {
                    id: "hide-rejected",
                    checked: hideRejected,
                    onCheckedChange: (checked) => setHideRejected(checked === true)
                  }
                ),
                /* @__PURE__ */ jsx("label", { htmlFor: "hide-rejected", className: "text-sm font-medium cursor-pointer", children: "Hide rejected" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Show:" }),
              /* @__PURE__ */ jsxs(
                Select,
                {
                  value: itemsPerPage.toString(),
                  onValueChange: (val) => setItemsPerPage(Number(val)),
                  children: [
                    /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[100px]", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsx(SelectItem, { value: "5", children: "5" }),
                      /* @__PURE__ */ jsx(SelectItem, { value: "10", children: "10" }),
                      /* @__PURE__ */ jsx(SelectItem, { value: "25", children: "25" }),
                      /* @__PURE__ */ jsx(SelectItem, { value: "50", children: "50" })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "per page" })
            ] })
          ] }),
          filteredRequests.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-4 text-sm text-muted-foreground", children: [
            "Showing ",
            startIndex + 1,
            "-",
            Math.min(endIndex, filteredRequests.length),
            " of ",
            filteredRequests.length,
            " shipping requests"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          filteredRequests.length === 0 && shippingRequests && shippingRequests.length > 0 && /* @__PURE__ */ jsxs("div", { className: "text-center py-8 text-muted-foreground", children: [
            /* @__PURE__ */ jsx(Truck, { className: "h-12 w-12 mx-auto mb-4 opacity-50" }),
            /* @__PURE__ */ jsx("p", { children: "No shipping requests found with this filter" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm mt-2", children: "Try adjusting your search or filter criteria." })
          ] }),
          filteredRequests.length === 0 && (!shippingRequests || shippingRequests.length === 0) && /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-muted-foreground", children: "No shipping requests found" }),
          paginatedRequests.length > 0 && paginatedRequests?.map((request) => /* @__PURE__ */ jsxs(
            Collapsible,
            {
              open: openSections[request.id],
              onOpenChange: () => toggleSection(request.id),
              children: [
                /* @__PURE__ */ jsx(CollapsibleTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
                  Card,
                  {
                    id: `shipment-${request.id}`,
                    className: "cursor-pointer hover:bg-accent/50 transition-colors",
                    onClick: (e) => {
                      if ((window.getSelection()?.toString().length ?? 0) > 0) {
                        e.stopPropagation();
                      }
                    },
                    children: /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex flex-col text-left flex-1 space-y-1", children: [
                        /* @__PURE__ */ jsxs("p", { className: "font-medium text-base", children: [
                          /* @__PURE__ */ jsx("span", { className: "select-text", onMouseDown: (e) => e.stopPropagation(), onClick: (e) => e.stopPropagation(), children: "Shipment for " }),
                          /* @__PURE__ */ jsx("span", { className: "text-blue-500 font-semibold select-text", onMouseDown: (e) => e.stopPropagation(), onClick: (e) => e.stopPropagation(), children: request.user.full_name || request.user.email || "Unknown" })
                        ] }),
                        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
                          /* @__PURE__ */ jsx("span", { className: "select-text", onMouseDown: (e) => e.stopPropagation(), onClick: (e) => e.stopPropagation(), children: "Customer ID: " }),
                          /* @__PURE__ */ jsx("span", { className: "font-medium text-emerald-500 select-text", onMouseDown: (e) => e.stopPropagation(), onClick: (e) => e.stopPropagation(), children: request.user.user_personal_id ? `#${request.user.user_personal_id}` : "N/A" })
                        ] }),
                        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
                          /* @__PURE__ */ jsx("span", { className: "select-text", onMouseDown: (e) => e.stopPropagation(), onClick: (e) => e.stopPropagation(), children: "Customer Shipment ID: " }),
                          /* @__PURE__ */ jsx("span", { className: "font-medium text-emerald-500 select-text", onMouseDown: (e) => e.stopPropagation(), onClick: (e) => e.stopPropagation(), children: request.shipment_personal_id ? `#${request.shipment_personal_id}` : "N/A" })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-sm text-muted-foreground", children: [
                          /* @__PURE__ */ jsxs("span", { className: "font-medium select-text", onMouseDown: (e) => e.stopPropagation(), onClick: (e) => e.stopPropagation(), children: [
                            "Shipment #",
                            request.id.substring(0, 8).toUpperCase()
                          ] }),
                          /* @__PURE__ */ jsx(
                            Button,
                            {
                              variant: "ghost",
                              size: "icon",
                              className: "h-4 w-4 p-0",
                              onClick: (e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(request.id);
                                toast2({ title: "Shipment ID copied to clipboard" });
                              },
                              title: "Copy Shipment ID",
                              children: /* @__PURE__ */ jsx(Copy, { className: "h-3 w-3" })
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:items-end gap-1 text-left sm:text-right", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
                          /* @__PURE__ */ jsx(Badge, { className: getStatusColor(request.status), children: request.status }),
                          /* @__PURE__ */ jsx(
                            ChevronDown,
                            {
                              className: `h-4 w-4 text-muted-foreground transform transition-transform duration-300 ${openSections[request.id] ? "rotate-180" : "rotate-0"}`
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground sm:justify-end", children: [
                          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                            /* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3" }),
                            request.destination
                          ] }),
                          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                            /* @__PURE__ */ jsx(Truck, { className: "h-3 w-3" }),
                            request.shipping_method
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
                          /* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3" }),
                          format(new Date(request.created_at), "PPpp")
                        ] }),
                        /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                          "¥",
                          request.actual_cost || request.estimated_cost || "-"
                        ] })
                      ] })
                    ] }) })
                  }
                ) }),
                /* @__PURE__ */ jsx(CollapsibleContent, { children: /* @__PURE__ */ jsx(Card, { className: "mt-2", children: /* @__PURE__ */ jsxs(CardContent, { className: "pt-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
                    /* @__PURE__ */ jsx("h4", { className: "font-medium mb-3", children: "Status Flow" }),
                    /* @__PURE__ */ jsx(StatusFlow, { steps: getStatusSteps(request.status) })
                  ] }),
                  (() => {
                    const boxItems = request.items.filter((item) => item.is_box);
                    if (boxItems.length > 0 && request.status === "sent") {
                      return /* @__PURE__ */ jsxs("div", { className: "mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg", children: [
                        /* @__PURE__ */ jsx("h4", { className: "font-medium text-blue-800 mb-3", children: "Box Items Tracking" }),
                        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: boxItems.map((item, index) => {
                          const trackingEntry = request.tracking_urls?.find((entry2) => entry2.item_id === item.id);
                          return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-2 border-b last:border-b-0", children: [
                            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                              /* @__PURE__ */ jsx(Package, { className: "h-4 w-4 text-blue-700" }),
                              /* @__PURE__ */ jsxs("div", { children: [
                                /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium text-blue-900", children: [
                                  "Box ",
                                  index + 1,
                                  ": ",
                                  item.item_name || "No tracking"
                                ] }),
                                item.item_name && /* @__PURE__ */ jsx("p", { className: "text-xs text-blue-700", children: item.local_tracking_number })
                              ] })
                            ] }),
                            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                              trackingEntry?.tracking_url && /* @__PURE__ */ jsxs(
                                "a",
                                {
                                  href: trackingEntry.tracking_url,
                                  target: "_blank",
                                  rel: "noopener noreferrer",
                                  className: "text-sm text-blue-700 hover:underline flex items-center gap-1",
                                  children: [
                                    /* @__PURE__ */ jsx(Link$1, { className: "h-3 w-3" }),
                                    "View"
                                  ]
                                }
                              ),
                              request.status === "sent" && /* @__PURE__ */ jsxs(
                                Button,
                                {
                                  size: "sm",
                                  variant: "ghost",
                                  onClick: () => handleEditBoxTrackingUrl(request.id, item.id, trackingEntry?.tracking_url || ""),
                                  className: "text-blue-700 hover:bg-blue-50 h-7 px-2",
                                  children: [
                                    /* @__PURE__ */ jsx(Edit, { className: "h-3 w-3 mr-1" }),
                                    "Edit"
                                  ]
                                }
                              )
                            ] })
                          ] }, item.id);
                        }) })
                      ] });
                    } else if (request.tracking_url) {
                      return /* @__PURE__ */ jsx("div", { className: "mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsx("h4", { className: "font-medium text-blue-800 mb-1", children: "Tracking Information" }),
                          /* @__PURE__ */ jsxs(
                            "a",
                            {
                              href: request.tracking_url,
                              target: "_blank",
                              rel: "noopener noreferrer",
                              className: "text-sm text-blue-700 hover:underline flex items-center gap-1",
                              children: [
                                /* @__PURE__ */ jsx(Link$1, { className: "h-3 w-3" }),
                                "View Tracking"
                              ]
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxs(
                          Button,
                          {
                            size: "sm",
                            variant: "outline",
                            onClick: () => handleEditTrackingUrl(request.id, request.tracking_url || ""),
                            className: "border-blue-500 text-blue-700 hover:bg-blue-50",
                            children: [
                              /* @__PURE__ */ jsx(Edit, { className: "h-3 w-3 mr-1" }),
                              "Edit URL"
                            ]
                          }
                        )
                      ] }) });
                    }
                    return null;
                  })(),
                  /* @__PURE__ */ jsxs("div", { className: "mb-4 p-3 bg-accent/20 rounded-lg", children: [
                    /* @__PURE__ */ jsx("h4", { className: "font-medium mb-2", children: "Customer Information" }),
                    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2 text-sm", children: [
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Email:" }),
                        " ",
                        request.user.email
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Phone:" }),
                        " ",
                        request.user.phone_number
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "mb-4 p-3 bg-accent/20 rounded-lg", children: [
                    /* @__PURE__ */ jsx("h4", { className: "font-medium mb-2", children: "Shipping Address" }),
                    /* @__PURE__ */ jsx("div", { className: "text-sm", children: request.shipping_address && /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx("p", { className: "font-medium", children: request.shipping_address.full_name }),
                      /* @__PURE__ */ jsx("p", { children: request.shipping_address.phone_number }),
                      /* @__PURE__ */ jsx("p", { className: "mt-2", children: request.shipping_address.address }),
                      (request.shipping_address.city || request.shipping_address.state) && /* @__PURE__ */ jsx("p", { children: [request.shipping_address.city, request.shipping_address.state].filter(Boolean).join(", ") }),
                      /* @__PURE__ */ jsx("p", { children: request.shipping_address.postal_code }),
                      /* @__PURE__ */ jsx("p", { children: request.shipping_address.country }),
                      request.shipping_address.address_notes && /* @__PURE__ */ jsxs("p", { className: "mt-2 text-muted-foreground", children: [
                        "Notes: ",
                        request.shipping_address.address_notes
                      ] })
                    ] }) })
                  ] }),
                  request.status === "rejected" && request.rejection_details && /* @__PURE__ */ jsxs("div", { className: "mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg", children: [
                    /* @__PURE__ */ jsx("h4", { className: "font-medium mb-2 text-destructive", children: "Rejection Details" }),
                    /* @__PURE__ */ jsxs("p", { className: "text-sm mb-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Reason:" }),
                      " ",
                      request.rejection_details.rejection_reason
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground mb-3", children: [
                      "Rejected on ",
                      new Date(request.rejection_details.rejected_at).toLocaleString()
                    ] }),
                    Array.isArray(request.rejection_details.product_issues) && request.rejection_details.product_issues.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                      request.rejection_details.product_issues.some((i) => i.has_issue) && /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 text-destructive mt-0.5 flex-shrink-0" }),
                        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-destructive mb-1", children: "Flagged Products" }),
                        request.rejection_details.product_issues.filter((issue) => issue.has_issue).map((issue, index) => /* @__PURE__ */ jsxs("div", { className: "pl-3 border-l-2 border-destructive/30", children: [
                          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: issue.item_name || "Item " + (index + 1) }),
                          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                            "Qty: ",
                            issue.quantity,
                            " | Weight: ",
                            issue.weight,
                            "g"
                          ] }),
                          issue.issue_description && /* @__PURE__ */ jsxs("p", { className: "text-xs text-destructive mt-1", children: [
                            "Issue: ",
                            issue.issue_description
                          ] }),
                          issue.product_url && /* @__PURE__ */ jsx(
                            "a",
                            {
                              href: issue.product_url,
                              target: "_blank",
                              rel: "noopener noreferrer",
                              className: "ml-5 text-xs text-blue-700 hover:underline break-all",
                              children: issue.product_url.length > 60 ? issue.product_url.substring(0, 60) + "..." : issue.product_url
                            }
                          )
                        ] }, index))
                      ] }),
                      request.rejection_details.product_issues.some((i) => !i.has_issue) && /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-green-700 mb-1", children: "Products" }),
                        request.rejection_details.product_issues.filter((issue) => !issue.has_issue).map((issue, index) => /* @__PURE__ */ jsxs("div", { className: "pl-3 border-l-2 border-green-300", children: [
                          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-green-800", children: issue.item_name || "Item " + (index + 1) }),
                          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                            "Qty: ",
                            issue.quantity,
                            " | Weight: ",
                            issue.weight,
                            "g"
                          ] }),
                          issue.product_url && /* @__PURE__ */ jsx(
                            "a",
                            {
                              href: issue.product_url,
                              target: "_blank",
                              rel: "noopener noreferrer",
                              className: "ml-5 text-xs text-blue-700 hover:underline break-all",
                              children: issue.product_url.length > 60 ? issue.product_url.substring(0, 60) + "..." : issue.product_url
                            }
                          )
                        ] }, index))
                      ] })
                    ] })
                  ] }),
                  !(request.status === "rejected" && request.rejection_details) && /* @__PURE__ */ jsxs("div", { className: "mb-4 p-3 bg-accent/20 rounded-lg", children: [
                    /* @__PURE__ */ jsxs("h4", { className: "font-medium mb-2", children: [
                      "Items (",
                      request.items?.length || 0,
                      ")"
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "space-y-2", children: request.items?.map((item, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsx(Package, { className: "h-3 w-3 text-muted-foreground" }),
                          /* @__PURE__ */ jsx("span", { children: item.item_name || "Item " + (index + 1) }),
                          /* @__PURE__ */ jsxs(Badge, { variant: "outline", children: [
                            "Qty: ",
                            item.quantity
                          ] })
                        ] }),
                        item.is_box ? item.local_tracking_number && /* @__PURE__ */ jsxs("div", { className: "ml-5 text-xs text-muted-foreground", children: [
                          "Local Tracking: ",
                          item.local_tracking_number
                        ] }) : item.product_url && /* @__PURE__ */ jsx(
                          "a",
                          {
                            href: item.product_url,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "ml-5 text-xs text-blue-700 hover:underline break-all",
                            children: item.product_url.length > 60 ? item.product_url.substring(0, 60) + "..." : item.product_url
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
                        item.weight,
                        "g"
                      ] })
                    ] }, index)) }),
                    /* @__PURE__ */ jsx("div", { className: "mt-2 pt-2 border-t", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm font-medium", children: [
                      /* @__PURE__ */ jsx("span", { children: "Total Weight:" }),
                      /* @__PURE__ */ jsxs("span", { children: [
                        request.total_weight,
                        "g"
                      ] })
                    ] }) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Estimated Cost" }),
                        /* @__PURE__ */ jsxs("p", { className: "font-medium", children: [
                          "¥",
                          request.estimated_cost || "-"
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Actual Cost" }),
                        /* @__PURE__ */ jsxs("p", { className: "font-medium", children: [
                          "¥",
                          request.actual_cost || "-"
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                      request.status === "pending" && /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsxs(
                          Button,
                          {
                            size: "sm",
                            variant: "outline",
                            onClick: () => handleSendQuote(request.id),
                            children: [
                              /* @__PURE__ */ jsx(Send, { className: "h-3 w-3 mr-1" }),
                              "Send Quote"
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxs(
                          Button,
                          {
                            size: "sm",
                            variant: "outline",
                            className: "text-red-600 hover:text-red-700",
                            onClick: () => handleReject(request),
                            children: [
                              /* @__PURE__ */ jsx(X, { className: "h-3 w-3 mr-1" }),
                              "Reject"
                            ]
                          }
                        )
                      ] }),
                      request.status === "quoted" && /* @__PURE__ */ jsxs(
                        Button,
                        {
                          size: "sm",
                          variant: "outline",
                          className: "text-green-600 hover:text-green-700",
                          onClick: () => updateStatusMutation.mutate({
                            requestId: request.id,
                            status: "paid"
                          }),
                          children: [
                            /* @__PURE__ */ jsx(DollarSign, { className: "h-3 w-3 mr-1" }),
                            "Confirm Payment"
                          ]
                        }
                      ),
                      request.status === "paid" && /* @__PURE__ */ jsxs(
                        Button,
                        {
                          size: "sm",
                          variant: "outline",
                          className: "text-purple-600 hover:text-purple-700",
                          onClick: () => handleMarkAsSent(request),
                          children: [
                            /* @__PURE__ */ jsx(Truck, { className: "h-3 w-3 mr-1" }),
                            "Mark as Sent"
                          ]
                        }
                      )
                    ] })
                  ] })
                ] }) }) })
              ]
            },
            request.id
          ))
        ] }),
        filteredRequests.length > 0 && totalPages > 1 && /* @__PURE__ */ jsx(Card, { className: "bg-muted/30 mt-6", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => setCurrentPage((prev) => Math.max(1, prev - 1)),
              disabled: currentPage === 1,
              children: [
                /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4 mr-1" }),
                "Previous"
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => /* @__PURE__ */ jsx(
            Button,
            {
              variant: currentPage === page ? "default" : "outline",
              size: "sm",
              onClick: () => setCurrentPage(page),
              className: "min-w-[40px]",
              children: page
            },
            page
          )) }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => setCurrentPage((prev) => Math.min(totalPages, prev + 1)),
              disabled: currentPage === totalPages,
              children: [
                "Next",
                /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4 ml-1" })
              ]
            }
          )
        ] }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(AlertDialog, { open: rejectDialogOpen, onOpenChange: setRejectDialogOpen, children: /* @__PURE__ */ jsxs(AlertDialogContent, { className: "max-w-2xl", children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Reject Shipping Request" }),
        /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Flag products with issues and provide rejection reasons." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "rejection-reason", children: "Overall Rejection Reason" }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              id: "rejection-reason",
              placeholder: "Enter the main reason for rejecting this shipping request...",
              value: rejectionReason,
              onChange: (e) => setRejectionReason(e.target.value),
              className: "min-h-[80px]"
            }
          )
        ] }),
        rejectingRequest && rejectingRequest.items.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Product Issues" }),
          /* @__PURE__ */ jsx(ScrollArea, { className: "h-[300px] w-full rounded-md border p-4", children: /* @__PURE__ */ jsx("div", { className: "space-y-4", children: rejectingRequest.items.map((item, index) => {
            const issue = productIssues.find((pi) => pi.productId === item.id);
            return /* @__PURE__ */ jsxs("div", { className: "space-y-2 p-3 border rounded-lg", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-2", children: [
                /* @__PURE__ */ jsx(
                  Checkbox,
                  {
                    id: `issue-${item.id}`,
                    checked: issue?.hasIssue || false,
                    onCheckedChange: (checked) => updateProductIssue(item.id, "hasIssue", checked)
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-1", children: [
                  /* @__PURE__ */ jsx(
                    Label,
                    {
                      htmlFor: `issue-${item.id}`,
                      className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                      children: item.item_name || "Item " + (index + 1)
                    }
                  ),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    "Qty: ",
                    item.quantity,
                    " | Weight: ",
                    item.weight,
                    "g"
                  ] }),
                  item.product_url && /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: item.product_url,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: "ml-5 text-xs text-blue hover:underline break-all",
                      children: item.product_url.length > 60 ? item.product_url.substring(0, 60) + "..." : item.product_url
                    }
                  )
                ] })
              ] }),
              issue?.hasIssue && /* @__PURE__ */ jsx(
                Textarea,
                {
                  placeholder: "Describe the issue with this product...",
                  value: issue.issueDescription,
                  onChange: (e) => updateProductIssue(item.id, "issueDescription", e.target.value),
                  className: "min-h-[60px] text-sm"
                }
              )
            ] }, item.id || index);
          }) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { onClick: () => {
          setRejectionReason("");
          setProductIssues([]);
          setRejectingRequest(null);
        }, children: "Cancel" }),
        /* @__PURE__ */ jsx(
          AlertDialogAction,
          {
            onClick: handleConfirmReject,
            disabled: !rejectionReason.trim(),
            className: "bg-red-600 hover:bg-red-700 text-white",
            children: "Reject Request"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: sendQuoteDialogOpen, onOpenChange: setSendQuoteDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Send Shipping Quote" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Enter the shipping cost and payment URL for the customer." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "quote-price", children: "Shipping Cost (¥)" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "quote-price",
              type: "number",
              value: quotePrice,
              onChange: (e) => setQuotePrice(e.target.value),
              placeholder: "Enter shipping cost",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "quote-url", children: "Payment URL" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "quote-url",
              type: "url",
              value: quoteUrl,
              onChange: (e) => setQuoteUrl(e.target.value),
              placeholder: "https://payment.example.com/...",
              required: true
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => {
          setSendQuoteDialogOpen(false);
          setQuotePrice("");
          setQuoteUrl("");
          setSendQuoteRequestId(null);
        }, children: "Cancel" }),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: handleConfirmSendQuote,
            disabled: !quotePrice || !quoteUrl,
            children: "Send Quote"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: trackingDialogOpen, onOpenChange: setTrackingDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-2xl max-h-[80vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Mark Shipment as Sent" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: currentShipmentBoxItems.length > 0 ? `This shipment contains ${currentShipmentBoxItems.length} box(es). Please enter a tracking URL for each box.` : "Enter the tracking URL for this shipment (optional)." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4", children: currentShipmentBoxItems.length > 0 ? (
        // Multiple tracking URLs for box items
        currentShipmentBoxItems.map((item, index) => /* @__PURE__ */ jsxs("div", { className: "space-y-2 p-4 border rounded-lg", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium", children: [
            /* @__PURE__ */ jsx(Package, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxs("span", { children: [
              "Box ",
              index + 1
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-sm text-muted-foreground", children: [
            item.local_tracking_number && /* @__PURE__ */ jsxs("p", { children: [
              "Local Tracking: ",
              item.local_tracking_number
            ] }),
            item.item_name && /* @__PURE__ */ jsxs("p", { children: [
              "Item: ",
              item.item_name
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: `tracking-url-${item.id}`, children: "Tracking URL (Optional)" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: `tracking-url-${item.id}`,
                type: "url",
                value: trackingUrls[item.id] || "",
                onChange: (e) => setTrackingUrls((prev) => ({
                  ...prev,
                  [item.id]: e.target.value
                })),
                placeholder: "https://tracking.example.com/..."
              }
            )
          ] })
        ] }, item.id))
      ) : (
        // Single tracking URL for regular items
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "tracking-url", children: "Tracking URL (Optional)" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "tracking-url",
              type: "url",
              value: trackingUrl,
              onChange: (e) => setTrackingUrl(e.target.value),
              placeholder: "https://tracking.example.com/..."
            }
          )
        ] })
      ) }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => {
          setTrackingDialogOpen(false);
          setTrackingUrl("");
          setTrackingUrls({});
          setCurrentShipmentBoxItems([]);
          setTrackingRequestId(null);
        }, children: "Cancel" }),
        /* @__PURE__ */ jsx(Button, { onClick: handleConfirmSent, children: "Mark as Sent" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: editTrackingDialogOpen, onOpenChange: setEditTrackingDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Edit Tracking URL" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Update the tracking URL for this shipment." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "edit-tracking-url", children: "Tracking URL" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "edit-tracking-url",
            type: "url",
            value: editTrackingUrl,
            onChange: (e) => setEditTrackingUrl(e.target.value),
            placeholder: "https://tracking.example.com/..."
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => {
          setEditTrackingDialogOpen(false);
          setEditTrackingUrl("");
          setEditTrackingRequestId(null);
        }, children: "Cancel" }),
        /* @__PURE__ */ jsx(Button, { onClick: handleConfirmUpdateTrackingUrl, children: "Update URL" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: editBoxTrackingDialogOpen, onOpenChange: setEditBoxTrackingDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Edit Box Tracking URL" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Update the tracking URL for this box item." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "edit-box-tracking-url", children: "Tracking URL" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "edit-box-tracking-url",
            type: "url",
            value: editBoxTrackingUrl,
            onChange: (e) => setEditBoxTrackingUrl(e.target.value),
            placeholder: "https://tracking.example.com/..."
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => {
          setEditBoxTrackingDialogOpen(false);
          setEditBoxTrackingUrl("");
          setEditBoxTrackingRequestId(null);
          setEditBoxTrackingItemId(null);
        }, children: "Cancel" }),
        /* @__PURE__ */ jsx(Button, { onClick: handleConfirmUpdateBoxTrackingUrl, children: "Update URL" })
      ] })
    ] }) })
  ] });
});
const Analytics = () => {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800", children: "Analytics & Reports" }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Total Requests" }) }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-blue-600", children: "127" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "This month" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Revenue" }) }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-green-600", children: "¥185,000" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "This month" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Active Clients" }) }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-purple-600", children: "42" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "This month" })
        ] })
      ] })
    ] })
  ] });
};
const Settings = () => {
  const [rates, setRates] = useState([]);
  const [dhlFuelPercentage, setDhlFuelPercentage] = useState("32");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast: toast2 } = useToast();
  useEffect(() => {
    fetchRates();
    fetchSystemSettings();
  }, []);
  const fetchRates = async () => {
    try {
      const { data, error } = await supabase.from("currency_rates").select("*").order("currency_code");
      if (error) throw error;
      setRates(data || []);
    } catch (error) {
      console.error("Error fetching currency rates:", error);
      toast2({
        title: "Error",
        description: "Failed to load currency rates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const fetchSystemSettings = async () => {
    try {
      const { data, error } = await supabase.from("system_settings").select("*").eq("setting_key", "dhl_fuel_percentage").maybeSingle();
      if (error) throw error;
      if (data) {
        setDhlFuelPercentage(data.setting_value);
      }
    } catch (error) {
      console.error("Error fetching system settings:", error);
      toast2({
        title: "Error",
        description: "Failed to load system settings",
        variant: "destructive"
      });
    }
  };
  const updateRate = (id, value) => {
    setRates(rates.map(
      (rate) => rate.id === id ? { ...rate, rate_to_jpy: parseFloat(value) || 0 } : rate
    ));
  };
  const handleSaveCurrencyRates = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      for (const rate of rates) {
        const { error } = await supabase.from("currency_rates").update({
          rate_to_jpy: rate.rate_to_jpy,
          updated_by: user?.id
        }).eq("id", rate.id);
        if (error) throw error;
      }
      toast2({
        title: "Success",
        description: "Currency rates updated successfully"
      });
    } catch (error) {
      console.error("Error updating currency rates:", error);
      toast2({
        title: "Error",
        description: "Failed to update currency rates",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  const handleSaveShippingSettings = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("system_settings").update({
        setting_value: dhlFuelPercentage,
        updated_by: user?.id
      }).eq("setting_key", "dhl_fuel_percentage");
      if (error) throw error;
      toast2({
        title: "Success",
        description: "Shipping settings updated successfully"
      });
    } catch (error) {
      console.error("Error updating shipping settings:", error);
      toast2({
        title: "Error",
        description: "Failed to update shipping settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsx(Loader2, { className: "w-8 h-8 animate-spin text-gray-400" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800", children: "System Settings" }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(DollarSign, { className: "w-5 h-5" }),
        "Currency Exchange Rates"
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Set the exchange rates from JPY to other currencies. These rates are used in the purchase and shipping calculators." }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: rates.map((rate) => /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium mb-2", children: [
            "1 JPY = ",
            rate.currency_code
          ] }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "number",
              step: "0.000001",
              value: rate.rate_to_jpy,
              onChange: (e) => updateRate(rate.id, e.target.value),
              placeholder: `Rate to ${rate.currency_code}`
            }
          )
        ] }, rate.id)) }),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: handleSaveCurrencyRates,
            disabled: saving,
            className: "bg-blue-300 hover:bg-blue-400 text-white",
            children: saving ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 mr-2 animate-spin" }),
              "Saving..."
            ] }) : "Save Currency Rates"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Truck, { className: "w-5 h-5" }),
        "Shipping Settings"
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Configure shipping-related settings such as DHL fuel surcharge percentage." }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-2", children: "DHL Fuel Surcharge (%)" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "number",
              step: "0.1",
              min: "0",
              value: dhlFuelPercentage,
              onChange: (e) => setDhlFuelPercentage(e.target.value),
              placeholder: "Enter fuel surcharge percentage"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-1", children: "This percentage will be applied to all DHL shipments in the calculator." })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: handleSaveShippingSettings,
            disabled: saving,
            className: "bg-blue-300 hover:bg-blue-400 text-white",
            children: saving ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 mr-2 animate-spin" }),
              "Saving..."
            ] }) : "Save Shipping Settings"
          }
        )
      ] })
    ] })
  ] });
};
const fetchUsers = async () => {
  const {
    data: profilesData,
    error: profilesError
  } = await supabase.from("profiles").select("id, full_name, email, created_at, user_personal_id, country").order("created_at", {
    ascending: false
  });
  if (profilesError) {
    console.error("Error fetching profiles:", profilesError);
    return [];
  }
  const {
    data: rolesData,
    error: rolesError
  } = await supabase.from("user_roles").select("*");
  if (rolesError) {
    console.error("Error fetching roles:", rolesError);
  }
  return (profilesData || []).map((profile) => {
    const userRole = rolesData?.find((role) => role.user_id === profile.id);
    return {
      id: profile.id,
      email: profile.email || "No email",
      full_name: profile.full_name || "Unknown",
      role: userRole?.role || "user",
      created_at: profile.created_at,
      user_personal_id: profile.user_personal_id,
      country: profile.country
    };
  });
};
const AdminDashboard = () => {
  const {
    t
  } = useApp();
  const {
    assignRole
  } = useAuth();
  const isMobile = useIsMobile();
  useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("requests");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const queryClient2 = useQueryClient();
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["requests", "storage", "shipping-requests", "users", "notifications", "analytics", "settings", "orders"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);
  const orderId = searchParams.get("orderId");
  const shipmentId = searchParams.get("shipmentId");
  const {
    data: users = [],
    refetch: refetchUsers,
    isLoading: usersLoading
  } = useQuery({
    queryKey: ["admin-users"],
    queryFn: fetchUsers,
    staleTime: 60 * 1e3
  });
  const [requests] = useState([{
    id: "AJ-001",
    clientId: "USER-123",
    clientName: "John Doe",
    productUrl: "https://example.com/anime-figure",
    quantity: 1,
    status: "pending",
    estimatedCost: "¥5,000",
    finalQuote: "",
    paypalLink: "",
    notes: "Limited edition figure",
    internalNotes: "",
    date: "2024-06-10"
  }, {
    id: "AJ-002",
    clientId: "USER-456",
    clientName: "Jane Smith",
    productUrl: "https://example.com/manga-set",
    quantity: 5,
    status: "approved",
    estimatedCost: "¥3,000",
    finalQuote: "¥3,500",
    paypalLink: "https://paypal.me/example",
    notes: "Complete manga series",
    internalNotes: "Customer is a regular",
    date: "2024-06-08"
  }]);
  const handleRoleChange = useCallback(async (userId, newRole) => {
    const {
      error
    } = await assignRole(userId, newRole);
    if (!error) {
      queryClient2.invalidateQueries({
        queryKey: ["admin-users"]
      });
    }
  }, [assignRole, queryClient2]);
  const renderActiveTab = () => {
    switch (activeTab) {
      case "users":
        return /* @__PURE__ */ jsx(UserManagement, {
          users,
          usersLoading,
          refetchUsers,
          handleRoleChange
        });
      case "requests":
        return /* @__PURE__ */ jsx(ProductRequestsManagement, {
          orderId
        });
      case "storage":
        return /* @__PURE__ */ jsx(StorageManagement, {});
      case "shipping-requests":
        return /* @__PURE__ */ jsx(ShippingRequestsManagement, {
          shipmentId
        });
      case "notifications":
        return /* @__PURE__ */ jsx(NotificationsView, {});
      case "analytics":
        return /* @__PURE__ */ jsx(Analytics, {});
      case "settings":
        return /* @__PURE__ */ jsx(Settings, {});
      default:
        return /* @__PURE__ */ jsx(ProductRequestsManagement, {
          orderId
        });
    }
  };
  return /* @__PURE__ */ jsx(ProtectedRoute, {
    requireAdmin: true,
    children: /* @__PURE__ */ jsxs("div", {
      className: "min-h-screen bg-gradient-to-br from-blue-50 to-blue-100",
      children: [isMobile && sidebarOpen && /* @__PURE__ */ jsx("div", {
        className: "fixed inset-0 bg-black/50 z-40",
        onClick: () => setSidebarOpen(false)
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex w-full",
        children: [/* @__PURE__ */ jsx(AdminSidebar, {
          activeTab,
          setActiveTab,
          isMobile,
          sidebarOpen,
          setSidebarOpen,
          refetchUsers
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex-1 p-4 md:p-8 min-w-0 overflow-x-auto",
          children: [isMobile && /* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between mb-6",
            children: [/* @__PURE__ */ jsxs(Button, {
              variant: "outline",
              size: "sm",
              onClick: () => setSidebarOpen(true),
              children: [/* @__PURE__ */ jsx(Menu, {
                className: "h-4 w-4 mr-2"
              }), "Menu"]
            }), /* @__PURE__ */ jsx("h1", {
              className: "text-xl font-bold text-gray-800",
              children: "Admin Panel"
            })]
          }), renderActiveTab()]
        })]
      })]
    })
  });
};
const AdminDashboard_default = UNSAFE_withComponentProps(React__default.memo(AdminDashboard));
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AdminDashboard_default
}, Symbol.toStringTag, { value: "Module" }));
function EditOrder$1() {
  const { t } = useApp();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId]);
  const fetchOrder = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      const { data: orderData, error: orderError } = await supabase.from("orders").select(`
          *,
          order_items (
            id,
            product_request:product_requests (*)
          )
        `).eq("id", orderId).eq("user_id", user.id).eq("is_rejected", true).single();
      if (orderError || !orderData) {
        toast({
          title: t("error"),
          description: t("orderNotFound"),
          variant: "destructive"
        });
        navigate("/user-dashboard");
        return;
      }
      setOrder(orderData);
      const editableProducts = orderData.order_items.map((item) => ({
        id: item.product_request.id,
        product_url: item.product_request.product_url,
        item_name: item.product_request.item_name,
        quantity: item.product_request.quantity || 1,
        notes: item.product_request.notes,
        has_purchase_issue: item.product_request.has_purchase_issue,
        purchase_issue_description: item.product_request.purchase_issue_description,
        isNew: false,
        toDelete: false
      }));
      setProducts(editableProducts);
    } catch (error) {
      console.error("Error fetching order:", error);
      toast({
        title: t("error"),
        description: t("loadingOrderDetails"),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    setProducts(updatedProducts);
  };
  const addNewProduct = () => {
    setProducts([
      ...products,
      { id: `new-${Date.now()}`, product_url: "", item_name: "", quantity: 1, notes: "", isNew: true, toDelete: false }
    ]);
  };
  const toggleDeleteProduct = (index) => {
    const updatedProducts = [...products];
    updatedProducts[index].toDelete = !updatedProducts[index].toDelete;
    setProducts(updatedProducts);
  };
  const handleResubmit = async () => {
    const activeProducts = products.filter((p) => !p.toDelete);
    if (activeProducts.length === 0) {
      toast({ title: t("error"), description: t("atLeastOneProductError"), variant: "destructive" });
      return;
    }
    for (const product of activeProducts) {
      if (!product.product_url) {
        toast({ title: t("error"), description: t("allProductsUrlError"), variant: "destructive" });
        return;
      }
    }
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase.from("profiles").select("full_name, user_personal_id").eq("id", user.id).single();
      const customerName = profile?.full_name || "Unknown User";
      const customerId = profile?.user_personal_id ? `#${profile.user_personal_id}` : "";
      const { data: newOrder, error: orderError } = await supabase.from("orders").insert({
        user_id: user.id,
        status: "preparing",
        is_resubmitted: true,
        parent_order_id: orderId
      }).select().single();
      if (orderError) throw orderError;
      await notifyAllAdmins(
        "order_resubmitted",
        `Order resubmitted by ${customerName} ${customerId}.`,
        newOrder.id
      );
      for (const product of activeProducts) {
        const { data: newProduct } = await supabase.from("product_requests").insert({
          user_id: user.id,
          product_url: product.product_url,
          item_name: product.item_name,
          quantity: product.quantity,
          notes: product.notes,
          status: "requested"
        }).select().single();
        await supabase.from("order_items").insert({
          order_id: newOrder.id,
          product_request_id: newProduct.id
        });
      }
      toast({ title: t("success"), description: t("orderResubmittedSuccess") });
      navigate("/user-dashboard");
    } catch (error) {
      console.error("Error resubmitting order:", error);
      toast({ title: t("error"), description: t("orderResubmitError"), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) return /* @__PURE__ */ jsx("div", { className: "text-center py-8", children: t("loadingOrderDetails") });
  if (!order) return /* @__PURE__ */ jsx("div", { className: "text-center py-8", children: t("orderNotFound") });
  return /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", onClick: () => navigate("/user-dashboard"), children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: t("editRejectedOrder") }),
        /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground", children: [
          t("orderNumber"),
          " ",
          order.order_personal_id
        ] })
      ] })
    ] }),
    order.rejection_reason && /* @__PURE__ */ jsxs(Card, { className: "border-destructive", children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-destructive", children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: "h-5 w-5" }),
        t("orderRejectionReasonTitle")
      ] }) }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("p", { children: order.rejection_reason }) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: t("productsInOrder") }),
        /* @__PURE__ */ jsx(CardDescription, { children: t("editOrderDescription") })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
        products.map((product, index) => /* @__PURE__ */ jsx(
          Card,
          {
            className: `p-4 ${product.toDelete ? "opacity-50" : ""} ${product.has_purchase_issue ? "border-yellow-500" : ""}`,
            children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              product.has_purchase_issue && product.purchase_issue_description && /* @__PURE__ */ jsxs("div", { className: "p-3 bg-yellow-50 rounded-lg flex items-start gap-2", children: [
                /* @__PURE__ */ jsx(Flag, { className: "h-4 w-4 text-yellow-600 mt-0.5" }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-yellow-900", children: t("productIssue") }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-yellow-700", children: product.purchase_issue_description })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: `url-${index}`, children: "Product URL *" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      id: `url-${index}`,
                      value: product.product_url,
                      onChange: (e) => handleProductChange(index, "product_url", e.target.value),
                      placeholder: "https://example.com/product",
                      disabled: product.toDelete
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx(Label, { htmlFor: `name-${index}`, children: t("productName") }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        id: `name-${index}`,
                        value: product.item_name || "",
                        onChange: (e) => handleProductChange(index, "item_name", e.target.value),
                        placeholder: t("productNamePlaceholder"),
                        disabled: product.toDelete
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx(Label, { htmlFor: `quantity-${index}`, children: t("quantity") }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        id: `quantity-${index}`,
                        type: "number",
                        min: "1",
                        value: product.quantity,
                        onChange: (e) => handleProductChange(index, "quantity", parseInt(e.target.value) || 1),
                        disabled: product.toDelete
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: `notes-${index}`, children: t("productNotes") }),
                  /* @__PURE__ */ jsx(
                    Textarea,
                    {
                      id: `notes-${index}`,
                      value: product.notes || "",
                      onChange: (e) => handleProductChange(index, "notes", e.target.value),
                      placeholder: t("productNotesPlaceholder"),
                      disabled: product.toDelete
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                  product.isNew && /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: t("newProductBadge") }),
                  product.toDelete && /* @__PURE__ */ jsx(Badge, { variant: "destructive", children: t("willBeRemoved") })
                ] }),
                /* @__PURE__ */ jsxs(
                  Button,
                  {
                    variant: product.toDelete ? "default" : "destructive",
                    size: "sm",
                    onClick: () => toggleDeleteProduct(index),
                    children: [
                      /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 mr-2" }),
                      product.toDelete ? t("restore") : t("remove")
                    ]
                  }
                )
              ] })
            ] })
          },
          product.id
        )),
        /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: addNewProduct, className: "w-full", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
          t("addNewProduct")
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-4 justify-end", children: [
      /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => navigate("/user-dashboard"), disabled: submitting, children: t("cancel") }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: handleResubmit,
          disabled: submitting || products.filter((p) => !p.toDelete).length === 0,
          children: [
            /* @__PURE__ */ jsx(Save, { className: "h-4 w-4 mr-2" }),
            submitting ? t("resubmitting") : t("resubmitOrder")
          ]
        }
      )
    ] })
  ] });
}
const EditOrder = UNSAFE_withComponentProps(function EditOrder2() {
  return /* @__PURE__ */ jsx(ProtectedRoute, {
    children: /* @__PURE__ */ jsx("div", {
      className: "container mx-auto py-8 px-4",
      children: /* @__PURE__ */ jsx(EditOrder$1, {})
    })
  });
});
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: EditOrder
}, Symbol.toStringTag, { value: "Module" }));
const Avatar = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Root,
  {
    ref,
    className: cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    ),
    ...props
  }
));
Avatar.displayName = AvatarPrimitive.Root.displayName;
const AvatarImage = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Image,
  {
    ref,
    className: cn("aspect-square h-full w-full", className),
    ...props
  }
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Fallback,
  {
    ref,
    className: cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    ),
    ...props
  }
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
const Contact = () => {
  const {
    t
  } = useApp();
  const contactMethods = [{
    icon: Mail,
    title: "Email",
    value: "info@aiyujapan.com"
  }, {
    icon: MessageCircle,
    title: "Facebook",
    value: "Aiyu-Japan",
    href: "https://www.facebook.com/profile.php?id=61566577742246"
  }, {
    icon: Instagram,
    title: "Instagram",
    value: "@aiyu.japan",
    href: "https://www.instagram.com/aiyu.japan/"
  }];
  const staffMembers = [{
    name: "Aimi",
    role: "Content Creation Staff, English Market Manager",
    image: "aimi.png",
    description: "Descripción"
  }, {
    name: "Sayuki",
    role: "Content Creation Leader",
    image: "sayuki.png",
    description: "Descripción"
  }];
  return /* @__PURE__ */ jsx("div", {
    className: "min-h-screen bg-[url(tile_background.png)] bg-repeat animate-fade-in py-8",
    children: /* @__PURE__ */ jsxs("div", {
      className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "text-center mb-8",
        children: [/* @__PURE__ */ jsx("h1", {
          className: "text-3xl md:text-4xl font-bold text-gray-900 mb-4",
          children: t("contact")
        }), /* @__PURE__ */ jsx("p", {
          className: "text-gray-600 text-lg",
          children: t("contactDescription1")
        }), /* @__PURE__ */ jsx("p", {
          className: "text-gray-600 text-lg",
          children: t("contactDescription2")
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "mb-12",
        children: [/* @__PURE__ */ jsx("div", {
          className: "text-center mb-8",
          children: /* @__PURE__ */ jsx("h2", {
            className: "text-2xl md:text-3xl font-bold text-gray-900 mb-4",
            children: t("ourStaff")
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "grid md:grid-cols-2 gap-8 max-w-4xl mx-auto",
          children: staffMembers.map((member, index) => /* @__PURE__ */ jsx(Card, {
            className: "bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300",
            children: /* @__PURE__ */ jsxs(CardContent, {
              className: "p-8 text-center",
              children: [/* @__PURE__ */ jsxs(Avatar, {
                className: "w-24 h-24 mx-auto mb-4",
                children: [/* @__PURE__ */ jsx(AvatarImage, {
                  src: member.image,
                  alt: member.name
                }), /* @__PURE__ */ jsx(AvatarFallback, {
                  className: "text-lg font-semibold bg-gradient-to-br from-blue-300 to-blue-400 text-white",
                  children: member.name.charAt(0)
                })]
              }), /* @__PURE__ */ jsx("h3", {
                className: "text-xl font-bold text-gray-900 mb-2",
                children: member.name
              }), /* @__PURE__ */ jsx("p", {
                className: "text-blue-600 font-semibold mb-2",
                children: member.name === "Aimi" ? t("staffRole1") : t("staffRole2")
              })]
            })
          }, index))
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "grid lg:grid-cols-3 gap-8 mb-12",
        children: [/* @__PURE__ */ jsx("div", {
          className: "lg:col-span-2",
          children: /* @__PURE__ */ jsx(Card, {
            className: "bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg h-full",
            children: /* @__PURE__ */ jsxs(CardContent, {
              className: "p-8",
              children: [/* @__PURE__ */ jsx("div", {
                className: "text-center mb-6",
                children: /* @__PURE__ */ jsx("h2", {
                  className: "text-2xl font-bold text-gray-900 mb-2",
                  children: t("yourInquiryNotBother")
                })
              }), /* @__PURE__ */ jsxs("form", {
                action: "https://api.web3forms.com/submit",
                method: "POST",
                className: "space-y-6",
                children: [/* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "access_key",
                  value: "e56d5ce5-47a1-4331-acb2-e9e935a66f5c"
                }), /* @__PURE__ */ jsx("input", {
                  type: "checkbox",
                  name: "botcheck",
                  className: "hidden",
                  style: {
                    display: "none"
                  }
                }), /* @__PURE__ */ jsx("div", {
                  className: "space-y-2",
                  children: /* @__PURE__ */ jsx(Input, {
                    type: "text",
                    name: "name",
                    placeholder: t("contactFormName"),
                    className: "w-full",
                    required: true
                  })
                }), /* @__PURE__ */ jsx("div", {
                  className: "space-y-2",
                  children: /* @__PURE__ */ jsx(Input, {
                    type: "email",
                    name: "email",
                    placeholder: t("contactFormEmail"),
                    className: "w-full",
                    required: true
                  })
                }), /* @__PURE__ */ jsx("div", {
                  className: "space-y-2",
                  children: /* @__PURE__ */ jsx(Textarea, {
                    name: "message",
                    placeholder: t("contactFormMessage"),
                    className: "w-full min-h-32",
                    required: true
                  })
                }), /* @__PURE__ */ jsx("button", {
                  type: "submit",
                  className: "w-auto px-12 py-3 bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-100 rounded-full font-semibold transition-colors",
                  children: t("contactFormSend")
                })]
              })]
            })
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "space-y-4",
          children: [/* @__PURE__ */ jsx("h3", {
            className: "text-xl font-bold text-gray-900 mb-4",
            children: t("getInTouch")
          }), contactMethods.map((method, index) => {
            const IconComponent = method.icon;
            return /* @__PURE__ */ jsx(Card, {
              className: "bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg hover:shadow-xl transition-shadow",
              children: /* @__PURE__ */ jsx(CardContent, {
                className: "p-4",
                children: /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center space-x-3",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "w-10 h-10 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full flex items-center justify-center",
                    children: /* @__PURE__ */ jsx(IconComponent, {
                      className: "w-5 h-5 text-white"
                    })
                  }), /* @__PURE__ */ jsxs("div", {
                    children: [/* @__PURE__ */ jsx("h4", {
                      className: "font-semibold text-gray-900 text-sm",
                      children: method.title
                    }), /* @__PURE__ */ jsx("a", {
                      href: method.href,
                      className: "text-blue-600 hover:text-blue-700 transition-colors text-sm",
                      children: method.value
                    })]
                  })]
                })
              })
            }, index);
          })]
        })]
      })]
    })
  });
};
const Contact_default = UNSAFE_withComponentProps(Contact);
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Contact_default
}, Symbol.toStringTag, { value: "Module" }));
const TermsOfService = () => {
  return /* @__PURE__ */ jsx("div", {
    className: "min-h-screen py-12 px-4",
    style: {
      backgroundImage: "url(/tile_background.png)",
      backgroundRepeat: "repeat",
      backgroundSize: "200px 200px"
    },
    children: /* @__PURE__ */ jsx("div", {
      className: "max-w-4xl mx-auto",
      children: /* @__PURE__ */ jsx(Card, {
        className: "bg-white/95 backdrop-blur-sm shadow-lg",
        children: /* @__PURE__ */ jsxs(CardContent, {
          className: "p-8 md:p-12",
          children: [/* @__PURE__ */ jsx("h1", {
            className: "text-4xl font-bold text-primary mb-4",
            children: "Terms of Service"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-muted-foreground mb-8",
            children: "Last updated: October 2025"
          }), /* @__PURE__ */ jsxs("section", {
            className: "mb-8",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-semibold text-primary mb-4",
              children: "Operator Information"
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-2 text-foreground",
              children: [/* @__PURE__ */ jsxs("p", {
                children: [/* @__PURE__ */ jsx("strong", {
                  children: "Legal Company Name:"
                }), /* @__PURE__ */ jsx("br", {}), "Serrudo 合同会社 (Serrudo Gōdō Gaisha)"]
              }), /* @__PURE__ */ jsxs("p", {
                children: [/* @__PURE__ */ jsx("strong", {
                  children: "Trade Name:"
                }), /* @__PURE__ */ jsx("br", {}), "Aiyu Japan"]
              }), /* @__PURE__ */ jsxs("p", {
                children: [/* @__PURE__ */ jsx("strong", {
                  children: "Registered Address:"
                }), /* @__PURE__ */ jsx("br", {}), "〒532-0011", /* @__PURE__ */ jsx("br", {}), "Osaka-fu, Osaka-shi, Yodogawa-ku, Nishinakajima 6-2-3", /* @__PURE__ */ jsx("br", {}), "Chisan Mansion No. 7 Shin-Osaka 903, Japan"]
              }), /* @__PURE__ */ jsxs("p", {
                children: [/* @__PURE__ */ jsx("strong", {
                  children: "Legal Representative:"
                }), /* @__PURE__ */ jsx("br", {}), "Alexander Serrudo"]
              }), /* @__PURE__ */ jsxs("p", {
                children: [/* @__PURE__ */ jsx("strong", {
                  children: "Email:"
                }), /* @__PURE__ */ jsx("br", {}), "support@aiyujapan.com"]
              }), /* @__PURE__ */ jsxs("p", {
                children: [/* @__PURE__ */ jsx("strong", {
                  children: "Official Website:"
                }), /* @__PURE__ */ jsx("br", {}), /* @__PURE__ */ jsx("a", {
                  href: "https://alpha.aiyujapan.com",
                  className: "text-capybara-orange hover:underline",
                  children: "https://alpha.aiyujapan.com"
                })]
              })]
            })]
          }), /* @__PURE__ */ jsxs("section", {
            className: "mb-8",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-semibold text-primary mb-4",
              children: "General Description of the Service"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-foreground leading-relaxed mb-4",
              children: "Aiyu Japan is an international purchasing and shipping service that connects customers from all continents of the world with stores and products in Japan. We act as a trusted intermediary, purchasing products on behalf of clients, storing them, and managing international shipping from Japan to their destination country."
            }), /* @__PURE__ */ jsx("p", {
              className: "text-foreground leading-relaxed",
              children: "The service is intended exclusively for international export use. Aiyu Japan may not be used for domestic deliveries within Japan or for local commercial resale without prior authorization."
            })]
          }), /* @__PURE__ */ jsxs("section", {
            className: "mb-8",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-semibold text-primary mb-4",
              children: "Definition of User"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-foreground leading-relaxed mb-2",
              children: 'The term "User" or "Client" refers to any individual or legal entity that:'
            }), /* @__PURE__ */ jsxs("ul", {
              className: "list-disc list-inside text-foreground space-y-2 ml-4",
              children: [/* @__PURE__ */ jsx("li", {
                children: "Has read and accepted these Terms of Service."
              }), /* @__PURE__ */ jsx("li", {
                children: "Requests to use the services offered by Aiyu Japan."
              }), /* @__PURE__ */ jsx("li", {
                children: "Has been approved by Aiyu Japan's team as a valid client."
              })]
            })]
          }), /* @__PURE__ */ jsxs("section", {
            className: "mb-8",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-semibold text-primary mb-4",
              children: "Purchase and Management Process"
            }), /* @__PURE__ */ jsxs("ol", {
              className: "list-decimal list-inside text-foreground space-y-2 ml-4",
              children: [/* @__PURE__ */ jsx("li", {
                children: "The client submits the product links they wish to purchase."
              }), /* @__PURE__ */ jsx("li", {
                children: "Aiyu Japan purchases the items on behalf of the client and provides a total cost including the product value, service fees, and shipping costs."
              }), /* @__PURE__ */ jsx("li", {
                children: "The purchased items are received, stored, and consolidated at our Osaka facility until the client requests international shipment."
              }), /* @__PURE__ */ jsx("li", {
                children: "Once payment is confirmed, the shipment is arranged through the selected carrier."
              })]
            })]
          }), /* @__PURE__ */ jsxs("section", {
            className: "mb-8",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-semibold text-primary mb-4",
              children: "Payments"
            }), /* @__PURE__ */ jsxs("ul", {
              className: "list-disc list-inside text-foreground space-y-2 ml-4",
              children: [/* @__PURE__ */ jsx("li", {
                children: "Payments must be made using the officially accepted methods: Stripe, PayPal, credit card, Wise, or bank transfer."
              }), /* @__PURE__ */ jsx("li", {
                children: "All prices and charges are expressed exclusively in Japanese yen (JPY)."
              }), /* @__PURE__ */ jsx("li", {
                children: "Orders will only be processed once full payment has been confirmed."
              }), /* @__PURE__ */ jsx("li", {
                children: "Transaction fees charged by payment platforms are non-refundable."
              })]
            })]
          }), /* @__PURE__ */ jsxs("section", {
            className: "mb-8",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-semibold text-primary mb-4",
              children: "Prohibited Products"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-foreground leading-relaxed mb-4",
              children: "For safety reasons and in compliance with Japanese and international laws, Aiyu Japan does not accept or handle the following items:"
            }), /* @__PURE__ */ jsxs("ul", {
              className: "list-disc list-inside text-foreground space-y-2 ml-4",
              children: [/* @__PURE__ */ jsx("li", {
                children: "Illegal substances, narcotics, drugs, or stimulants."
              }), /* @__PURE__ */ jsx("li", {
                children: "Weapons, knives, ammunition, explosives, or hazardous materials."
              }), /* @__PURE__ */ jsx("li", {
                children: "Perishable goods (food, beverages, etc.)."
              }), /* @__PURE__ */ jsx("li", {
                children: "Medical or pharmaceutical equipment and supplies."
              }), /* @__PURE__ */ jsx("li", {
                children: "Obscene or illegal materials."
              }), /* @__PURE__ */ jsx("li", {
                children: "Items containing compressed gas or powerful magnets."
              }), /* @__PURE__ */ jsx("li", {
                children: "Products containing lithium batteries (except via approved carriers)."
              }), /* @__PURE__ */ jsx("li", {
                children: "Any items that violate export or import regulations in Japan or in the destination country."
              })]
            }), /* @__PURE__ */ jsx("p", {
              className: "text-foreground leading-relaxed mt-4",
              children: "If a package contains restricted or prohibited goods, Aiyu Japan reserves the right to hold or return the shipment without refund and may report the case to the relevant authorities if necessary."
            })]
          }), /* @__PURE__ */ jsxs("section", {
            className: "mb-8",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-semibold text-primary mb-4",
              children: "Receipt, Storage, and Shipping"
            }), /* @__PURE__ */ jsxs("ul", {
              className: "list-disc list-inside text-foreground space-y-2 ml-4",
              children: [/* @__PURE__ */ jsx("li", {
                children: "Packages received at our facility are not opened or inspected unless required for safety or packaging reasons."
              }), /* @__PURE__ */ jsx("li", {
                children: "Aiyu Japan may adjust packaging or consolidate items to optimize shipping cost and security."
              }), /* @__PURE__ */ jsx("li", {
                children: "We do not perform internal inspections or modifications of the products."
              }), /* @__PURE__ */ jsx("li", {
                children: "Once a shipment leaves Japan, Aiyu Japan is not responsible for delays, damages, or customs retention, as control passes to the carrier and the destination country's authorities."
              }), /* @__PURE__ */ jsx("li", {
                children: "All import taxes, duties, and customs-related charges are the client's responsibility."
              })]
            })]
          }), /* @__PURE__ */ jsxs("section", {
            className: "mb-8",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-semibold text-primary mb-4",
              children: "Cancellations and Refunds"
            }), /* @__PURE__ */ jsxs("ul", {
              className: "list-disc list-inside text-foreground space-y-2 ml-4",
              children: [/* @__PURE__ */ jsx("li", {
                children: "Once a purchase is confirmed, cancellations and refunds are not accepted, except in exceptional cases reviewed and approved by our team."
              }), /* @__PURE__ */ jsx("li", {
                children: "If a refund is approved, operational costs, service fees, and payment platform commissions already incurred will be deducted."
              }), /* @__PURE__ */ jsx("li", {
                children: "Refunds may take several business days to process depending on the payment method used."
              })]
            })]
          }), /* @__PURE__ */ jsxs("section", {
            className: "mb-8",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-semibold text-primary mb-4",
              children: "Limitation of Liability"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-foreground leading-relaxed mb-4",
              children: "Aiyu Japan acts solely as an intermediary for purchases and international logistics, not as a seller, manufacturer, or official distributor of the purchased items. Therefore, Aiyu Japan is not liable for:"
            }), /* @__PURE__ */ jsxs("ul", {
              className: "list-disc list-inside text-foreground space-y-2 ml-4",
              children: [/* @__PURE__ */ jsx("li", {
                children: "Defects, discrepancies, or faults in the purchased products."
              }), /* @__PURE__ */ jsx("li", {
                children: "Delays, losses, or damages caused by carriers, customs, or third parties."
              }), /* @__PURE__ */ jsx("li", {
                children: "Additional costs resulting from taxes, duties, or customs regulations in the destination country."
              }), /* @__PURE__ */ jsx("li", {
                children: "Errors or incorrect information provided by the client (such as name, address, or postal code)."
              })]
            }), /* @__PURE__ */ jsx("p", {
              className: "text-foreground leading-relaxed mt-4",
              children: "The client is solely responsible for confirming that the product meets their expectations before requesting the purchase."
            })]
          }), /* @__PURE__ */ jsxs("section", {
            className: "mb-8",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-semibold text-primary mb-4",
              children: "Service Refusal or Suspension"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-foreground leading-relaxed mb-4",
              children: "Aiyu Japan may suspend, limit, or refuse service in the following cases:"
            }), /* @__PURE__ */ jsxs("ul", {
              className: "list-disc list-inside text-foreground space-y-2 ml-4",
              children: [/* @__PURE__ */ jsx("li", {
                children: "Improper, fraudulent, or suspicious use of the service."
              }), /* @__PURE__ */ jsx("li", {
                children: "Failure to complete payment or comply with deadlines."
              }), /* @__PURE__ */ jsx("li", {
                children: "Requests or shipments involving prohibited products."
              }), /* @__PURE__ */ jsx("li", {
                children: "Inappropriate communication or disrespectful behavior toward staff."
              }), /* @__PURE__ */ jsx("li", {
                children: "Any situation that threatens the integrity, operations, or reputation of Aiyu Japan."
              })]
            }), /* @__PURE__ */ jsx("p", {
              className: "text-foreground leading-relaxed mt-4",
              children: "In such cases, Aiyu Japan reserves the right to cancel active orders, deny new ones, and/or permanently close the client's account."
            })]
          }), /* @__PURE__ */ jsxs("section", {
            className: "mb-8",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-semibold text-primary mb-4",
              children: "Modifications to the Terms"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-foreground leading-relaxed",
              children: "Aiyu Japan reserves the right to update or modify these Terms of Service at any time without prior individual notice. Updated versions will be published on the official website. Continued use of the service implies acceptance of the latest version of these Terms."
            })]
          }), /* @__PURE__ */ jsxs("section", {
            className: "mb-8",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-semibold text-primary mb-4",
              children: "Governing Law and Jurisdiction"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-foreground leading-relaxed",
              children: "These Terms are governed by the laws of Japan. Any disputes arising from or relating to the use of Aiyu Japan's services shall be subject to the exclusive jurisdiction of the competent courts of Osaka, Japan."
            })]
          }), /* @__PURE__ */ jsxs("section", {
            className: "mb-8",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-semibold text-primary mb-4",
              children: "Contact"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-foreground leading-relaxed mb-2",
              children: "For any inquiries related to these Terms of Service or the use of our services, please contact:"
            }), /* @__PURE__ */ jsxs("div", {
              className: "text-foreground space-y-2 ml-4",
              children: [/* @__PURE__ */ jsxs("p", {
                children: [/* @__PURE__ */ jsx("strong", {
                  children: "Email:"
                }), " support@aiyujapan.com"]
              }), /* @__PURE__ */ jsxs("p", {
                children: [/* @__PURE__ */ jsx("strong", {
                  children: "Website:"
                }), " ", /* @__PURE__ */ jsx("a", {
                  href: "https://alpha.aiyujapan.com",
                  className: "text-capybara-orange hover:underline",
                  children: "https://alpha.aiyujapan.com"
                })]
              })]
            })]
          })]
        })
      })
    })
  });
};
const TermsOfService_default = UNSAFE_withComponentProps(TermsOfService);
const route14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: TermsOfService_default
}, Symbol.toStringTag, { value: "Module" }));
const PrivacyPolicy = () => {
  return /* @__PURE__ */ jsx("div", {
    className: "min-h-screen py-12 px-4",
    style: {
      backgroundImage: "url(/tile_background.png)",
      backgroundRepeat: "repeat",
      backgroundSize: "200px 200px"
    },
    children: /* @__PURE__ */ jsx("div", {
      className: "max-w-4xl mx-auto",
      children: /* @__PURE__ */ jsx(Card, {
        className: "bg-white/95 backdrop-blur-sm shadow-lg",
        children: /* @__PURE__ */ jsxs(CardContent, {
          className: "p-8 md:p-12",
          children: [/* @__PURE__ */ jsx("h1", {
            className: "text-4xl font-bold text-primary mb-4",
            children: "Privacy Policy"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-muted-foreground mb-8",
            children: "Last updated: October 2025"
          }), /* @__PURE__ */ jsxs("section", {
            className: "mb-8",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-semibold text-primary mb-4",
              children: "1. Introduction"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-foreground leading-relaxed",
              children: 'This Privacy Policy explains how Aiyu Japan, operated by Serrudo 合同会社 (Serrudo Gōdō Gaisha) ("we," "our," or "the Company"), collects, uses, and protects the personal information of users ("you," "your," or "the Client") who access our website or use our services.'
            }), /* @__PURE__ */ jsx("p", {
              className: "text-foreground leading-relaxed mt-4",
              children: "By using Aiyu Japan's website or services, you agree to the practices described in this Privacy Policy."
            })]
          }), /* @__PURE__ */ jsxs("section", {
            className: "mb-8",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-semibold text-primary mb-4",
              children: "2. Operator Information"
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-2 text-foreground",
              children: [/* @__PURE__ */ jsxs("p", {
                children: [/* @__PURE__ */ jsx("strong", {
                  children: "Legal Company Name:"
                }), /* @__PURE__ */ jsx("br", {}), "Serrudo 合同会社 (Serrudo Gōdō Gaisha)"]
              }), /* @__PURE__ */ jsxs("p", {
                children: [/* @__PURE__ */ jsx("strong", {
                  children: "Trade Name:"
                }), /* @__PURE__ */ jsx("br", {}), "Aiyu Japan"]
              }), /* @__PURE__ */ jsxs("p", {
                children: [/* @__PURE__ */ jsx("strong", {
                  children: "Registered Address:"
                }), /* @__PURE__ */ jsx("br", {}), "〒532-0011", /* @__PURE__ */ jsx("br", {}), "Osaka-fu, Osaka-shi, Yodogawa-ku, Nishinakajima 6-2-3", /* @__PURE__ */ jsx("br", {}), "Chisan Mansion No.7 Shin-Osaka 903, Japan"]
              }), /* @__PURE__ */ jsxs("p", {
                children: [/* @__PURE__ */ jsx("strong", {
                  children: "Email:"
                }), " support@aiyujapan.com"]
              }), /* @__PURE__ */ jsxs("p", {
                children: [/* @__PURE__ */ jsx("strong", {
                  children: "Website:"
                }), " ", /* @__PURE__ */ jsx("a", {
                  href: "https://alpha.aiyujapan.com",
                  className: "text-capybara-orange hover:underline",
                  children: "https://alpha.aiyujapan.com"
                })]
              })]
            })]
          }), /* @__PURE__ */ jsxs("section", {
            className: "mb-8",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-semibold text-primary mb-4",
              children: "3. Information We Collect"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-foreground leading-relaxed mb-4",
              children: "Aiyu Japan collects only the information necessary to operate our purchasing, storage, and shipping services effectively."
            }), /* @__PURE__ */ jsx("p", {
              className: "text-foreground leading-relaxed mb-2",
              children: "We may collect:"
            }), /* @__PURE__ */ jsxs("ul", {
              className: "list-disc list-inside text-foreground space-y-2 ml-4",
              children: [/* @__PURE__ */ jsxs("li", {
                children: [/* @__PURE__ */ jsx("strong", {
                  children: "Personal identification data:"
                }), " full name, address, phone number, email, and country of residence."]
              }), /* @__PURE__ */ jsxs("li", {
                children: [/* @__PURE__ */ jsx("strong", {
                  children: "Order information:"
                }), " product links, shipping preferences, and related purchase details."]
              }), /* @__PURE__ */ jsxs("li", {
                children: [/* @__PURE__ */ jsx("strong", {
                  children: "Payment information:"
                }), " transaction identifiers and billing details (handled securely via third-party processors)."]
              }), /* @__PURE__ */ jsxs("li", {
                children: [/* @__PURE__ */ jsx("strong", {
                  children: "Communication data:"
                }), " messages sent via our contact forms, email, or official support channels."]
              }), /* @__PURE__ */ jsxs("li", {
                children: [/* @__PURE__ */ jsx("strong", {
                  children: "Technical data:"
                }), " IP address, device type, browser, and cookies (for analytics and website functionality)."]
              })]
            }), /* @__PURE__ */ jsx("p", {
              className: "text-foreground leading-relaxed mt-4",
              children: "We do not collect sensitive data such as personal IDs, tax numbers, or credit card numbers directly."
            })]
          }), /* @__PURE__ */ jsxs("section", {
            className: "mb-8",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-semibold text-primary mb-4",
              children: "4. How We Use Your Information"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-foreground leading-relaxed mb-2",
              children: "Your personal data is used solely for the following purposes:"
            }), /* @__PURE__ */ jsxs("ul", {
              className: "list-disc list-inside text-foreground space-y-2 ml-4",
              children: [/* @__PURE__ */ jsx("li", {
                children: "To process and manage product purchases and shipments."
              }), /* @__PURE__ */ jsx("li", {
                children: "To communicate with you regarding your orders, inquiries, or account."
              }), /* @__PURE__ */ jsx("li", {
                children: "To issue invoices, receipts, and notifications related to payments."
              }), /* @__PURE__ */ jsx("li", {
                children: "To improve our website experience and customer service."
              }), /* @__PURE__ */ jsx("li", {
                children: "To comply with legal obligations under Japanese law."
              })]
            }), /* @__PURE__ */ jsx("p", {
              className: "text-foreground leading-relaxed mt-4",
              children: "Aiyu Japan does not sell, rent, or trade personal information to any third party."
            })]
          }), /* @__PURE__ */ jsxs("section", {
            className: "mb-8",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-semibold text-primary mb-4",
              children: "5. Payment Processing"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-foreground leading-relaxed mb-4",
              children: "All payments are handled through secure and verified third-party payment providers, including Stripe, PayPal, Wise, and Japanese domestic banks."
            }), /* @__PURE__ */ jsx("p", {
              className: "text-foreground leading-relaxed",
              children: "Aiyu Japan does not store or have access to your full credit card or bank account information. All payment data is encrypted and processed in accordance with the privacy policies of each payment provider."
            })]
          }), /* @__PURE__ */ jsxs("section", {
            className: "mb-8",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-semibold text-primary mb-4",
              children: "6. Data Storage and Retention"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-foreground leading-relaxed mb-4",
              children: "Personal information is stored securely on servers located in Japan. We retain customer information only for as long as necessary to fulfill the purposes described above or as required by law."
            }), /* @__PURE__ */ jsx("p", {
              className: "text-foreground leading-relaxed",
              children: "When data is no longer needed, it is deleted or anonymized in a secure manner."
            })]
          }), /* @__PURE__ */ jsxs("section", {
            className: "mb-8",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-semibold text-primary mb-4",
              children: "7. Data Sharing"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-foreground leading-relaxed mb-2",
              children: "Aiyu Japan may share minimal necessary information with:"
            }), /* @__PURE__ */ jsxs("ul", {
              className: "list-disc list-inside text-foreground space-y-2 ml-4",
              children: [/* @__PURE__ */ jsx("li", {
                children: "Shipping carriers (e.g., Japan Post, Yamato, DHL) to fulfill delivery."
              }), /* @__PURE__ */ jsx("li", {
                children: "Payment processors (e.g., Stripe, PayPal, Wise) for payment verification."
              }), /* @__PURE__ */ jsx("li", {
                children: "Legal authorities if required by law, regulation, or valid court order."
              })]
            }), /* @__PURE__ */ jsx("p", {
              className: "text-foreground leading-relaxed mt-4",
              children: "We do not share personal data for advertising or marketing purposes."
            })]
          }), /* @__PURE__ */ jsxs("section", {
            className: "mb-8",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-semibold text-primary mb-4",
              children: "8. International Data Transfers"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-foreground leading-relaxed",
              children: "As an international service, some information may be transferred to or processed in countries outside Japan (e.g., when shipping to a customer's country). In such cases, we ensure appropriate security measures to protect personal data according to Japanese privacy law (APPI) and international standards."
            })]
          }), /* @__PURE__ */ jsxs("section", {
            className: "mb-8",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-semibold text-primary mb-4",
              children: "9. Cookies and Analytics"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-foreground leading-relaxed mb-4",
              children: "Our website uses cookies to ensure proper functionality, security, and basic analytics. Cookies may collect anonymous data such as page visits, browser type, or session duration."
            }), /* @__PURE__ */ jsx("p", {
              className: "text-foreground leading-relaxed",
              children: "You may disable cookies in your browser settings; however, some features of the website may not function properly without them."
            })]
          }), /* @__PURE__ */ jsxs("section", {
            className: "mb-8",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-semibold text-primary mb-4",
              children: "10. User Rights"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-foreground leading-relaxed mb-2",
              children: "You have the right to:"
            }), /* @__PURE__ */ jsxs("ul", {
              className: "list-disc list-inside text-foreground space-y-2 ml-4",
              children: [/* @__PURE__ */ jsx("li", {
                children: "Request access to your personal data."
              }), /* @__PURE__ */ jsx("li", {
                children: "Request correction or deletion of inaccurate information."
              }), /* @__PURE__ */ jsx("li", {
                children: "Withdraw consent to the processing of your data."
              }), /* @__PURE__ */ jsx("li", {
                children: "Request a copy of the data we hold about you (where applicable)."
              })]
            }), /* @__PURE__ */ jsx("p", {
              className: "text-foreground leading-relaxed mt-4",
              children: "To exercise these rights, contact us at support@aiyujapan.com. We will respond to all valid requests in accordance with Japanese law and reasonable commercial practices."
            })]
          }), /* @__PURE__ */ jsxs("section", {
            className: "mb-8",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-semibold text-primary mb-4",
              children: "11. Data Security"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-foreground leading-relaxed",
              children: "Aiyu Japan employs physical, electronic, and administrative measures to safeguard personal data against unauthorized access, loss, or misuse. Despite our best efforts, no online system can guarantee absolute security, and users share information at their own discretion."
            })]
          }), /* @__PURE__ */ jsxs("section", {
            className: "mb-8",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-semibold text-primary mb-4",
              children: "12. Updates to This Policy"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-foreground leading-relaxed",
              children: "We may update this Privacy Policy periodically to reflect changes in our business, technology, or legal requirements. Any updates will be posted on this page with the revised date. Continued use of our services after such changes constitutes acceptance of the updated policy."
            })]
          }), /* @__PURE__ */ jsxs("section", {
            className: "mb-8",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-semibold text-primary mb-4",
              children: "13. Governing Law and Jurisdiction"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-foreground leading-relaxed",
              children: "This Privacy Policy is governed by the laws of Japan. Any disputes arising from or relating to this policy shall fall under the exclusive jurisdiction of the courts of Osaka, Japan."
            })]
          }), /* @__PURE__ */ jsxs("section", {
            className: "mb-8",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-semibold text-primary mb-4",
              children: "14. Contact"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-foreground leading-relaxed mb-2",
              children: "For any questions or requests related to your personal data, please contact:"
            }), /* @__PURE__ */ jsxs("div", {
              className: "text-foreground space-y-2 ml-4",
              children: [/* @__PURE__ */ jsx("p", {
                children: /* @__PURE__ */ jsx("strong", {
                  children: "Aiyu Japan (Serrudo Gōdō Gaisha)"
                })
              }), /* @__PURE__ */ jsxs("p", {
                children: [/* @__PURE__ */ jsx("strong", {
                  children: "Email:"
                }), " support@aiyujapan.com"]
              }), /* @__PURE__ */ jsxs("p", {
                children: [/* @__PURE__ */ jsx("strong", {
                  children: "Website:"
                }), " ", /* @__PURE__ */ jsx("a", {
                  href: "https://alpha.aiyujapan.com",
                  className: "text-capybara-orange hover:underline",
                  children: "https://alpha.aiyujapan.com"
                })]
              })]
            })]
          })]
        })
      })
    })
  });
};
const PrivacyPolicy_default = UNSAFE_withComponentProps(PrivacyPolicy);
const route15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: PrivacyPolicy_default
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-BqtgEibS.js", "imports": ["/assets/chunk-4WY6JWTD-CQ2BrMui.js", "/assets/index-DQ6zQjx3.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/root-CV8k_SNh.js", "imports": ["/assets/chunk-4WY6JWTD-CQ2BrMui.js", "/assets/index-DQ6zQjx3.js", "/assets/AppContext-ASKE5L8w.js", "/assets/index-Ce6NvDUG.js", "/assets/index-BNeLBswU.js", "/assets/package-CQEqUhWv.js", "/assets/mail-C_0T_cHr.js", "/assets/instagram-AGmeBF5J.js", "/assets/useAuth-DROiUoFu.js", "/assets/button-B0x8FPUr.js", "/assets/Combination-BRrAW_Vh.js", "/assets/index-Cc9y-45e.js", "/assets/index-CobyQ-6_.js", "/assets/index-B_pwq4tm.js", "/assets/index-B51jR1Lo.js", "/assets/index-Bc3lnN9I.js", "/assets/utils-CDN07tui.js", "/assets/circle-pKPOAmWE.js", "/assets/client-D-irrw7s.js", "/assets/menu-DTJiNrxO.js", "/assets/dialog-Sc23x6E5.js", "/assets/input-CM33OdNU.js", "/assets/label-DN8oXECS.js", "/assets/plus-DnVR-hSP.js", "/assets/use-toast-aoUui9pM.js", "/assets/index-B_jtOnfb.js", "/assets/tooltip-CE8HawYa.js", "/assets/index-CwuhT9dy.js", "/assets/tslib.es6-DcwbYiNs.js"], "css": ["/assets/root-D0kgUrpU.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/Home": { "id": "routes/Home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/Home-ydn5CbuZ.js", "imports": ["/assets/chunk-4WY6JWTD-CQ2BrMui.js", "/assets/button-B0x8FPUr.js", "/assets/input-CM33OdNU.js", "/assets/card-SCvgtUFv.js", "/assets/message-circle-CAWamjF_.js", "/assets/dialog-Sc23x6E5.js", "/assets/send--J3t3OJ8.js", "/assets/AppContext-ASKE5L8w.js", "/assets/useAuth-DROiUoFu.js", "/assets/label-DN8oXECS.js", "/assets/plus-DnVR-hSP.js", "/assets/index-BNeLBswU.js", "/assets/link-BJqyYBkU.js", "/assets/useIntersectionObserver-DOD6y564.js", "/assets/utils-CDN07tui.js", "/assets/arrow-left-Dj3pATct.js", "/assets/arrow-right-C0qI5OkS.js", "/assets/search-BPGFXk71.js", "/assets/Combination-BRrAW_Vh.js", "/assets/index-Cc9y-45e.js", "/assets/index-DnUP4w3H.js", "/assets/index-CwuhT9dy.js", "/assets/index-B_jtOnfb.js", "/assets/index-B_pwq4tm.js", "/assets/index-Bc3lnN9I.js", "/assets/client-D-irrw7s.js", "/assets/tslib.es6-DcwbYiNs.js", "/assets/use-toast-aoUui9pM.js", "/assets/index-DQ6zQjx3.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/Services": { "id": "routes/Services", "parentId": "root", "path": "services", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/Services-D98aaqhw.js", "imports": ["/assets/chunk-4WY6JWTD-CQ2BrMui.js", "/assets/AppContext-ASKE5L8w.js", "/assets/useIntersectionObserver-DOD6y564.js", "/assets/card-SCvgtUFv.js", "/assets/search-BPGFXk71.js", "/assets/truck-DVkQtnrb.js", "/assets/index-BNeLBswU.js", "/assets/package-CQEqUhWv.js", "/assets/circle-check-big-QBdueTg8.js", "/assets/button-B0x8FPUr.js", "/assets/index-CwuhT9dy.js", "/assets/index-B_jtOnfb.js", "/assets/utils-CDN07tui.js", "/assets/useAuth-DROiUoFu.js", "/assets/client-D-irrw7s.js", "/assets/tslib.es6-DcwbYiNs.js", "/assets/use-toast-aoUui9pM.js", "/assets/dialog-Sc23x6E5.js", "/assets/Combination-BRrAW_Vh.js", "/assets/index-Bc3lnN9I.js", "/assets/index-DQ6zQjx3.js", "/assets/index-B_pwq4tm.js", "/assets/input-CM33OdNU.js", "/assets/label-DN8oXECS.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/Auth": { "id": "routes/Auth", "parentId": "root", "path": "auth", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/Auth-ztD_TjEU.js", "imports": ["/assets/chunk-4WY6JWTD-CQ2BrMui.js", "/assets/useAuth-DROiUoFu.js", "/assets/button-B0x8FPUr.js", "/assets/card-SCvgtUFv.js", "/assets/input-CM33OdNU.js", "/assets/label-DN8oXECS.js", "/assets/textarea-DhCnVIFz.js", "/assets/select-D1jRWDQg.js", "/assets/use-toast-aoUui9pM.js", "/assets/client-D-irrw7s.js", "/assets/AppContext-ASKE5L8w.js", "/assets/shippingUtils-BkW84ZsF.js", "/assets/mail-C_0T_cHr.js", "/assets/index-CobyQ-6_.js", "/assets/eye-off-Ckx5ESn6.js", "/assets/eye-C2ugwyJB.js", "/assets/arrow-right-C0qI5OkS.js", "/assets/arrow-left-Dj3pATct.js", "/assets/index-CwuhT9dy.js", "/assets/index-BNeLBswU.js", "/assets/index-B_jtOnfb.js", "/assets/utils-CDN07tui.js", "/assets/index-DQ6zQjx3.js", "/assets/Combination-BRrAW_Vh.js", "/assets/index-Bc3lnN9I.js", "/assets/tslib.es6-DcwbYiNs.js", "/assets/index-Cc9y-45e.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/ForgotPassword": { "id": "routes/ForgotPassword", "parentId": "root", "path": "forgot-password", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/ForgotPassword-Byi1riAD.js", "imports": ["/assets/chunk-4WY6JWTD-CQ2BrMui.js", "/assets/useAuth-DROiUoFu.js", "/assets/button-B0x8FPUr.js", "/assets/card-SCvgtUFv.js", "/assets/input-CM33OdNU.js", "/assets/label-DN8oXECS.js", "/assets/AppContext-ASKE5L8w.js", "/assets/mail-C_0T_cHr.js", "/assets/arrow-left-Dj3pATct.js", "/assets/client-D-irrw7s.js", "/assets/tslib.es6-DcwbYiNs.js", "/assets/use-toast-aoUui9pM.js", "/assets/index-CwuhT9dy.js", "/assets/index-BNeLBswU.js", "/assets/index-B_jtOnfb.js", "/assets/utils-CDN07tui.js", "/assets/index-DQ6zQjx3.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/ResetPassword": { "id": "routes/ResetPassword", "parentId": "root", "path": "auth/reset-password", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/ResetPassword-TmmVel_5.js", "imports": ["/assets/chunk-4WY6JWTD-CQ2BrMui.js", "/assets/button-B0x8FPUr.js", "/assets/card-SCvgtUFv.js", "/assets/input-CM33OdNU.js", "/assets/label-DN8oXECS.js", "/assets/client-D-irrw7s.js", "/assets/use-toast-aoUui9pM.js", "/assets/eye-off-Ckx5ESn6.js", "/assets/eye-C2ugwyJB.js", "/assets/index-CwuhT9dy.js", "/assets/index-BNeLBswU.js", "/assets/index-B_jtOnfb.js", "/assets/utils-CDN07tui.js", "/assets/index-DQ6zQjx3.js", "/assets/tslib.es6-DcwbYiNs.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/EmailVerification": { "id": "routes/EmailVerification", "parentId": "root", "path": "email-verification", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/EmailVerification-DVKpTkVj.js", "imports": ["/assets/chunk-4WY6JWTD-CQ2BrMui.js", "/assets/card-SCvgtUFv.js", "/assets/button-B0x8FPUr.js", "/assets/circle-check-big-QBdueTg8.js", "/assets/utils-CDN07tui.js", "/assets/index-CwuhT9dy.js", "/assets/index-BNeLBswU.js", "/assets/index-B_jtOnfb.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/Calculator": { "id": "routes/Calculator", "parentId": "root", "path": "calculator", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/Calculator-HgzKc0G9.js", "imports": ["/assets/chunk-4WY6JWTD-CQ2BrMui.js", "/assets/AppContext-ASKE5L8w.js", "/assets/card-SCvgtUFv.js", "/assets/input-CM33OdNU.js", "/assets/collapsible-0hcxGzXU.js", "/assets/useSystemSettings-B0Ke3myG.js", "/assets/index-Cc9y-45e.js", "/assets/index-CobyQ-6_.js", "/assets/select-D1jRWDQg.js", "/assets/label-DN8oXECS.js", "/assets/Combination-BRrAW_Vh.js", "/assets/index-BNeLBswU.js", "/assets/utils-CDN07tui.js", "/assets/shippingUtils-BkW84ZsF.js", "/assets/truck-DVkQtnrb.js", "/assets/index-DnUP4w3H.js", "/assets/index-Bc3lnN9I.js", "/assets/index-B_pwq4tm.js", "/assets/client-D-irrw7s.js", "/assets/tslib.es6-DcwbYiNs.js", "/assets/index-B51jR1Lo.js", "/assets/circle-pKPOAmWE.js", "/assets/index-DQ6zQjx3.js", "/assets/index-CwuhT9dy.js", "/assets/index-B_jtOnfb.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/StoreGuide": { "id": "routes/StoreGuide", "parentId": "root", "path": "store-guide", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/StoreGuide-CWbrmbDr.js", "imports": ["/assets/chunk-4WY6JWTD-CQ2BrMui.js", "/assets/AppContext-ASKE5L8w.js", "/assets/card-SCvgtUFv.js", "/assets/select-D1jRWDQg.js", "/assets/index-BNeLBswU.js", "/assets/utils-CDN07tui.js", "/assets/index-DQ6zQjx3.js", "/assets/Combination-BRrAW_Vh.js", "/assets/index-Bc3lnN9I.js", "/assets/tslib.es6-DcwbYiNs.js", "/assets/index-Cc9y-45e.js", "/assets/index-CobyQ-6_.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/Dashboard": { "id": "routes/Dashboard", "parentId": "root", "path": "dashboard", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/Dashboard-DjGsvIcD.js", "imports": ["/assets/chunk-4WY6JWTD-CQ2BrMui.js", "/assets/useAuth-DROiUoFu.js", "/assets/skeleton-BFc3on2W.js", "/assets/ProtectedRoute-DFjb99Eu.js", "/assets/client-D-irrw7s.js", "/assets/tslib.es6-DcwbYiNs.js", "/assets/use-toast-aoUui9pM.js", "/assets/utils-CDN07tui.js", "/assets/card-SCvgtUFv.js", "/assets/button-B0x8FPUr.js", "/assets/index-CwuhT9dy.js", "/assets/index-BNeLBswU.js", "/assets/index-B_jtOnfb.js", "/assets/AppContext-ASKE5L8w.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/UserDashboard": { "id": "routes/UserDashboard", "parentId": "root", "path": "user-dashboard", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/UserDashboard-CQH5d1Am.js", "imports": ["/assets/chunk-4WY6JWTD-CQ2BrMui.js", "/assets/AppContext-ASKE5L8w.js", "/assets/button-B0x8FPUr.js", "/assets/index-Ce6NvDUG.js", "/assets/ProtectedRoute-DFjb99Eu.js", "/assets/input-CM33OdNU.js", "/assets/label-DN8oXECS.js", "/assets/textarea-DhCnVIFz.js", "/assets/card-SCvgtUFv.js", "/assets/select-D1jRWDQg.js", "/assets/collapsible-0hcxGzXU.js", "/assets/useAuth-DROiUoFu.js", "/assets/client-D-irrw7s.js", "/assets/use-toast-aoUui9pM.js", "/assets/Combination-BRrAW_Vh.js", "/assets/index-BNeLBswU.js", "/assets/index-CobyQ-6_.js", "/assets/utils-CDN07tui.js", "/assets/NotificationsView-CuIv8_ER.js", "/assets/shippingUtils-BkW84ZsF.js", "/assets/index-Cc9y-45e.js", "/assets/dialog-Sc23x6E5.js", "/assets/save-Cvtw8xcv.js", "/assets/badge-CCGCsnjh.js", "/assets/plus-DnVR-hSP.js", "/assets/tooltip-CE8HawYa.js", "/assets/package-CQEqUhWv.js", "/assets/link-BJqyYBkU.js", "/assets/circle-check-big-QBdueTg8.js", "/assets/truck-DVkQtnrb.js", "/assets/index-B_jtOnfb.js", "/assets/useSystemSettings-B0Ke3myG.js", "/assets/arrow-right-C0qI5OkS.js", "/assets/index-CwuhT9dy.js", "/assets/index-DQ6zQjx3.js", "/assets/index-Bc3lnN9I.js", "/assets/index-DnUP4w3H.js", "/assets/index-B_pwq4tm.js", "/assets/tslib.es6-DcwbYiNs.js", "/assets/index-B51jR1Lo.js", "/assets/circle-pKPOAmWE.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/AdminDashboard": { "id": "routes/AdminDashboard", "parentId": "root", "path": "admin-dashboard", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/AdminDashboard-DMHYXQ4o.js", "imports": ["/assets/chunk-4WY6JWTD-CQ2BrMui.js", "/assets/AppContext-ASKE5L8w.js", "/assets/useAuth-DROiUoFu.js", "/assets/button-B0x8FPUr.js", "/assets/index-Ce6NvDUG.js", "/assets/client-D-irrw7s.js", "/assets/ProtectedRoute-DFjb99Eu.js", "/assets/menu-DTJiNrxO.js", "/assets/dialog-Sc23x6E5.js", "/assets/package-CQEqUhWv.js", "/assets/index-BNeLBswU.js", "/assets/truck-DVkQtnrb.js", "/assets/NotificationsView-CuIv8_ER.js", "/assets/input-CM33OdNU.js", "/assets/badge-CCGCsnjh.js", "/assets/card-SCvgtUFv.js", "/assets/Combination-BRrAW_Vh.js", "/assets/index-B51jR1Lo.js", "/assets/index-B_pwq4tm.js", "/assets/index-Cc9y-45e.js", "/assets/utils-CDN07tui.js", "/assets/skeleton-BFc3on2W.js", "/assets/search-BPGFXk71.js", "/assets/eye-C2ugwyJB.js", "/assets/collapsible-0hcxGzXU.js", "/assets/label-DN8oXECS.js", "/assets/textarea-DhCnVIFz.js", "/assets/select-D1jRWDQg.js", "/assets/use-toast-aoUui9pM.js", "/assets/link-BJqyYBkU.js", "/assets/trash-2-BEv6Pjd1.js", "/assets/index-CobyQ-6_.js", "/assets/circle-check-big-QBdueTg8.js", "/assets/plus-DnVR-hSP.js", "/assets/index-Bc3lnN9I.js", "/assets/send--J3t3OJ8.js", "/assets/index-CwuhT9dy.js", "/assets/index-B_jtOnfb.js", "/assets/index-DQ6zQjx3.js", "/assets/tslib.es6-DcwbYiNs.js", "/assets/index-DnUP4w3H.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/EditOrder": { "id": "routes/EditOrder", "parentId": "root", "path": "edit-order/:orderId", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/EditOrder-0-gHClQC.js", "imports": ["/assets/chunk-4WY6JWTD-CQ2BrMui.js", "/assets/ProtectedRoute-DFjb99Eu.js", "/assets/card-SCvgtUFv.js", "/assets/button-B0x8FPUr.js", "/assets/input-CM33OdNU.js", "/assets/textarea-DhCnVIFz.js", "/assets/label-DN8oXECS.js", "/assets/badge-CCGCsnjh.js", "/assets/client-D-irrw7s.js", "/assets/use-toast-aoUui9pM.js", "/assets/AppContext-ASKE5L8w.js", "/assets/arrow-left-Dj3pATct.js", "/assets/trash-2-BEv6Pjd1.js", "/assets/plus-DnVR-hSP.js", "/assets/save-Cvtw8xcv.js", "/assets/useAuth-DROiUoFu.js", "/assets/index-BNeLBswU.js", "/assets/utils-CDN07tui.js", "/assets/index-CwuhT9dy.js", "/assets/index-B_jtOnfb.js", "/assets/index-DQ6zQjx3.js", "/assets/tslib.es6-DcwbYiNs.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/Contact": { "id": "routes/Contact", "parentId": "root", "path": "contact", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/Contact-Cu5dRedg.js", "imports": ["/assets/chunk-4WY6JWTD-CQ2BrMui.js", "/assets/AppContext-ASKE5L8w.js", "/assets/card-SCvgtUFv.js", "/assets/index-Bc3lnN9I.js", "/assets/index-DQ6zQjx3.js", "/assets/index-CwuhT9dy.js", "/assets/utils-CDN07tui.js", "/assets/input-CM33OdNU.js", "/assets/textarea-DhCnVIFz.js", "/assets/mail-C_0T_cHr.js", "/assets/message-circle-CAWamjF_.js", "/assets/instagram-AGmeBF5J.js", "/assets/index-BNeLBswU.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/TermsOfService": { "id": "routes/TermsOfService", "parentId": "root", "path": "terms-of-service", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/TermsOfService-5ta_oPUw.js", "imports": ["/assets/chunk-4WY6JWTD-CQ2BrMui.js", "/assets/card-SCvgtUFv.js", "/assets/utils-CDN07tui.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/PrivacyPolicy": { "id": "routes/PrivacyPolicy", "parentId": "root", "path": "privacy-policy", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/PrivacyPolicy-85U0k_mk.js", "imports": ["/assets/chunk-4WY6JWTD-CQ2BrMui.js", "/assets/card-SCvgtUFv.js", "/assets/utils-CDN07tui.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-6f095d69.js", "version": "6f095d69", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "v8_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = ["/", "/services", "/auth", "/forgot-password", "/auth/reset-password", "/email-verification", "/calculator", "/store-guide", "/dashboard", "/user-dashboard", "/admin-dashboard", "/contact", "/terms-of-service", "/privacy-policy", "/"];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/Home": {
    id: "routes/Home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/Services": {
    id: "routes/Services",
    parentId: "root",
    path: "services",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/Auth": {
    id: "routes/Auth",
    parentId: "root",
    path: "auth",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/ForgotPassword": {
    id: "routes/ForgotPassword",
    parentId: "root",
    path: "forgot-password",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/ResetPassword": {
    id: "routes/ResetPassword",
    parentId: "root",
    path: "auth/reset-password",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/EmailVerification": {
    id: "routes/EmailVerification",
    parentId: "root",
    path: "email-verification",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/Calculator": {
    id: "routes/Calculator",
    parentId: "root",
    path: "calculator",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/StoreGuide": {
    id: "routes/StoreGuide",
    parentId: "root",
    path: "store-guide",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/Dashboard": {
    id: "routes/Dashboard",
    parentId: "root",
    path: "dashboard",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/UserDashboard": {
    id: "routes/UserDashboard",
    parentId: "root",
    path: "user-dashboard",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/AdminDashboard": {
    id: "routes/AdminDashboard",
    parentId: "root",
    path: "admin-dashboard",
    index: void 0,
    caseSensitive: void 0,
    module: route11
  },
  "routes/EditOrder": {
    id: "routes/EditOrder",
    parentId: "root",
    path: "edit-order/:orderId",
    index: void 0,
    caseSensitive: void 0,
    module: route12
  },
  "routes/Contact": {
    id: "routes/Contact",
    parentId: "root",
    path: "contact",
    index: void 0,
    caseSensitive: void 0,
    module: route13
  },
  "routes/TermsOfService": {
    id: "routes/TermsOfService",
    parentId: "root",
    path: "terms-of-service",
    index: void 0,
    caseSensitive: void 0,
    module: route14
  },
  "routes/PrivacyPolicy": {
    id: "routes/PrivacyPolicy",
    parentId: "root",
    path: "privacy-policy",
    index: void 0,
    caseSensitive: void 0,
    module: route15
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
