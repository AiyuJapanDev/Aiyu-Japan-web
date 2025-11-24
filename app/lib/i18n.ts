import { intlFormat } from "date-fns";

export const translations = {
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
    headerParagraph:
      "Buy from any <span class='text-red-600'>japanese</span> store!",

    // Home Page
    heroSlide1Title: "From Japan to Your Home Anyday",
    heroSlide1TitleSubtitle:
      "Aiyu Japan is passionate about connecting different cultures and building great services.",
    heroSlide2Title:
      "Deliver excitement of j-shopping with utmost empathy and responsibility for our customers.",
    heroSlide2TitleSubtitle: "",

    // How It Works
    howItWorks: "How It Works",
    step1Title: "Browse & Request",
    step1Description:
      "Find products on Japanese websites and submit your request through our platform",
    step2Title: "We Purchase",
    step2Description:
      "Our team purchases the items for you and consolidates your orders",
    step3Title: "Ship to You",
    step3Description: "We ship your items safely to your doorstep worldwide",
    getStarted: "Get Started",
    learnMore: "Learn More",

    // Services Page
    servicesTitle: "Our Services",
    servicesSubtitle: "Professional Japanese Shopping Proxy Service",
    servicesDescription:
      "We make shopping from Japan simple, safe, and affordable. From anime collectibles to electronics, fashion, and everything in between - we've got you covered!",
    whyChooseMainTitle: "Why Choose Our Proxy Service?",
    whyChooseMainSubtitle:
      "More than just shopping - we're your trusted partner in Japan",
    personalShoppingTitle: "Personal Shopping Service",
    personalShoppingDescription:
      "Can't find what you're looking for? Our personal shoppers will hunt it down for you!",
    packageConsolidationTitle: "Package Consolidation",
    packageConsolidationDescription:
      "Save money by combining multiple orders into one shipment",
    fastShippingTitle: "Fast & Secure Shipping",
    fastShippingDescription:
      "Multiple shipping options to suit your needs and budget",
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
    whatCanWeShopSubtitle:
      "From everyday items to rare collectibles - we can find it all!",
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
    ctaDescription:
      "Start by sending us your product URLs or a clear image through any of our social media channels.",
    makeOrder: "Make Order",

    // Detailed How It Works
    howItWorksDetailedTitle: "How Aiyu Japan Works",
    howItWorksDetailedDescription1:
      "Bring a piece of Japan to your home with Aiyu Japan. We help you shop at multiple stores and ship items together, saving on costs. Fast, secure, and simple—Aiyu Japan is your ultimate Japanese shopping companion.",
    howItWorksDetailedDescription2:
      "Want to know more? Read our new user guide to learn everything you need to know to start shopping at Aiyu Japan.",
    newUserLinkBtn: "New user guide",

    step1DetailedTitle: "Step 1 – Find your product",
    step1DetailedDescription:
      "Go to your favorite Japanese store (like Uniqlo, Pokémon Center, Animate, or Amazon Japan). When you find something you want, copy the link (URL) of the product page. Example: https://example.com/product123",
    step2DetailedTitle: "Step 2 – Paste the link in our form",
    step2DetailedDescription:
      "Go to our request page: 👉 https://alpha.aiyujapan.com. Youʼll see a form called “Send Product Request”. Paste your product link there — thatʼs how we know exactly what to buy for you!",
    step3DetailedTitle: "Step 3 – Add quantity",
    step3DetailedDescription:
      "In the next box, write how many units you want (for example: 1, 2, or 3).",
    step4DetailedTitle: "Step 4 – Add a name or label (optional)",
    step4DetailedDescription:
      "You can give your order a short name — for example: “Pikachu figure” or “One Piece T-shirt”. This helps you identify it later inside your dashboard.",
    step5DetailedTitle: "Step 5 – Write a note (optional)",
    step5DetailedDescription:
      "If you have special details, like a size, color, or comment, write it here. Example: “Size M, blue color, please choose from official store only.”",
    step6DetailedTitle: "Step 6 – Add more products",
    step6DetailedDescription:
      "Want more items? Just click “Add Another Product.” You can add as many links as you want — each one becomes part of your order.",
    step7DetailedTitle: "Step 7 – Submit your request",
    step7DetailedDescription:
      "When youʼre ready, click “Send Request.” Our team will check your products, confirm availability, and send you a payment link. Once payment is complete, weʼll buy everything for you!",
    // Why Choose Section
    whyChooseTitle: "Why choose Aiyu Japan?",
    whyChooseSubtitle:
      "This is what makes us the best choice for your Japanese purchases.",
    reason1Title: "BUY EVERYTHING YOU WANT FROM JAPAN",
    reason1Description:
      "You can not only buy whatever you want from Japan, but we also work with limited product reservations!",
    reason2Title: "THE BEST RATE IN THE MARKET",
    reason2Description:
      "Only 500 yen (3.5$) per item. Competitive rates that fit your budget!",
    reason3Title: "FREE CONSOLIDATIONS",
    reason3Description:
      "Did you buy from different stores? We consolidate all your orders at no additional cost!",
    reason4Title: "WORLDWIDE SHIPPING",
    reason4Description:
      "From Japan directly to your door. We reach Europe, North America and most of South America!",

    //Recommended stores section
    recommendedStoresTitle: "Recommended Sites",
    recommendedStoresDescription:
      "Get full access to the most popular Japanese online shops and individual sellers",

    // Hero Section Buttons
    makeOrderButton: "Make Order",
    whereToShop: "Where To Shop",
    seeJapaneseStores: "See Japanese Stores",
    calculateEstimatedCost: "Calculate Estimated Cost",

    // Additional Services Section
    additionalServicesTitle: "WE ALSO HAVE",
    additionalServicesSubtitle:
      "Additional services to further enhance your shopping experience.",
    customerServiceTitle: "Customer Service",
    customerServiceDescription:
      "We serve you at all hours personally through email, Instagram and Facebook.",
    securityTitle: "Security & Trust",
    securityDescription:
      "All our payments are through reliable platforms, our partners are nationally recognized companies.",
    webServiceTitle: "Web Service",
    webServiceDescription:
      "The website is designed to give you a 100% understanding of our services, and it's open 24/7 for inquiries.",

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
    noHiddenFeesTransparent:
      "No hidden fees, no surprises. Get a detailed quote before making any purchase.",

    // Calculator Page
    calculatorBetaPage: "Cost Simulator",
    calculatorDisclaimer:
      "These prices are only approximations, the actual price could vary slightly.",

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
    expressShippingMethod:
      "Express Shipping (4-10 business days - Express mail service)",
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
    storeGuideDescription:
      "Remember to send us the links of your products to our Instagram - Facebook - or WhatsApp!",
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
    amazonJapanDesc:
      "One of the most famous and reliable Japanese online stores.",
    rakuten: "Rakuten",
    rakutenDesc:
      "A nationally known store recognized for its variety and price.",
    yahooShopping: "Yahoo Shopping (PayPay Flea Market)",
    yahooShoppingDesc: "General sales store, similar to Amazon and Mercari.",
    mercariJapan: "Mercari Japan",
    mercariJapanDesc:
      "Largest second-hand store. Looking for a used but like-new figure? This is the place.",
    buyma: "Buyma",
    buymaDesc: "Japanese marketplace for clothing and exclusive brand items.",
    surugaya: "Surugaya",
    surugayaDesc:
      "One of the most varied stores with the cheapest prices for anime items.",
    mandarake: "Mandarake",
    mandarakeDesc:
      "The perfect store for collectors of manga, figures and retro items.",
    animate: "Animate",
    animateDesc: "One of the largest anime product sales companies of all.",
    jumpShop: "Jump Shop",
    jumpShopDesc:
      "One Piece, Haikyuu, Dragon Ball items... Do you already know this store?",
    chiikawaStore: "Chiikawa store",
    chiikawaStoreDesc:
      "Official Chiikawa store with exclusive and adorable merchandise.",
    cdJapan: "CD Japan",
    cdJapanDesc: "Japanese anime - J-pop groups - Kpop etc.",
    evangelionStore: "Evangelion Store",
    evangelionStoreDesc:
      "Official Evangelion store with exclusive items not available in other stores.",
    pokemonCenter: "Pokemon Center",
    pokemonCenterDesc:
      "Official store for all kinds of Pokémon products, including plushies, clothing and games.",
    sailorMoonStore: "Sailor Moon Store",
    sailorMoonStoreDesc:
      "Find exclusive Sailor Moon products, from figures to collectible items.",
    sanrioStore: "Sanrio Store",
    sanrioStoreDesc:
      "Official Sanrio store with adorable Hello Kitty and other character products.",
    studioGhibliStore: "Studio Ghibli Store (Donguri Sora)",
    studioGhibliStoreDesc:
      "Store where you will find exclusive products from Studio Ghibli movies.",
    usjStore: "Universal Studios Japan Store",
    usjStoreDesc:
      "Official Universal Studios Japan store with exclusive park products.",
    disneyStore: "Disney Store",
    disneyStoreDesc:
      "Official Disney Japan store with adorable and exclusive products.",
    mediaWorld: "Media World",
    mediaWorldDesc:
      "Specialized in figures and merchandise from your favorite animes in second hand.",
    banpresto: "BANPRESTO",
    banprestoDesc: "One of the best stores to buy your anime figures.",
    popMart: "POP MART",
    popMartDesc: "The store for Labubu, Crying Babies and more.",
    sylvanianFamilies: "Sylvanian Families",
    sylvanianFamiliesDesc:
      "Official store of the famous cuties, Sylvanian Family Store.",
    amiAmi: "AmiAmi",
    amiAmiDesc:
      "One of the most popular stores for anime figures and merchandise. Wide variety of new and pre-order products.",
    goodSmileOnline: "Good Smile Online",
    goodSmileOnlineDesc:
      "Official Good Smile Company store. Find Nendoroid, Figma figures and exclusive collectibles directly from the manufacturer.",
    uniqlo: "UNIQLO",
    uniqloDesc:
      "Comfortable and quality clothing for the whole family, with simple and modern designs.",
    gu: "GU",
    guDesc:
      "Affordable and trendy fashion, inspired by the latest trends from Japan.",
    zozotown: "ZOZOTOWN",
    zozotownDesc:
      "The largest online fashion store in Japan with the best brands.",
    graniph: "Graniph",
    graniphDesc:
      "Here you will find incredible collaborations with series and anime.",
    weverseShop: "Weverse Shop Japan",
    weverseShopDesc: "Official K-pop products store in Japan.",
    btsOfficialShop: "BTS Official Shop Japan",
    btsOfficialShopDesc:
      "The Japanese store of one of the most famous bands in the world.",
    newEra: "New Era",
    newEraDesc: "Caps and urban fashion accessories from the New Era brand.",
    onitsukaTiger: "Onitsuka Tiger",
    onitsukaTigerDesc: "Japanese fashion sneakers with retro and modern style.",
    crocsJapan: "Crocs Japan",
    crocsJapanDesc: "Official Japanese Crocs store with new models and colors.",
    humanMadeJapan: "Human Made Japan",
    humanMadeJapanDesc:
      "Designer clothing and accessories created by NIGO® and the Human Made brand.",
    adidasJapan: "Adidas Japan",
    adidasJapanDesc: "Official Adidas Japan store with exclusive releases.",
    nikeJapan: "Nike Japan",
    nikeJapanDesc:
      "The latest in sneakers, clothing and sports equipment from Nike in Japan.",
    stripeClub: "Stripe Club",
    stripeClubDesc:
      "Japanese women's fashion with brands like Earth, Music & Ecology.",
    daisoJapan: "Daiso Japan",
    daisoJapanDesc: "$1 store? We have that too.",
    nitori: "NITORI",
    nitoriDesc: "One of Japan's largest stores to buy things for the home.",
    loft: "LOFT",
    loftDesc: "Store for stationery, decoration and household items.",
    palCloset: "PAL CLOSET",
    palClosetDesc: "A store to find things for the house and clothes.",
    yodobashiCamera: "Yodobashi Camera",
    yodobashiCameraDesc:
      "Home appliances, gadgets and hobby items at the best price.",
    mujiJapan: "MUJI Japan",
    mujiJapanDesc:
      "Japanese minimalism at its finest. From furniture and household items to stationery, clothing and snacks.",
    oliveYoungGlobal: "Olive Young Global",
    oliveYoungGlobalDesc:
      "Leading Korean cosmetics store with global shipping. Popular skincare, makeup and personal care products.",
    cosmeCom: "Cosme.com",
    cosmeComDesc:
      "One of the most reliable platforms in Japan to buy makeup and cosmetics from award-winning Japanese brands.",

    // Shipping calculator regions
    asia: "Asia",
    europeCanadaMexico: "Europe, Canada & Mexico",
    usa: "USA",
    centralSouthAmerica: "Central & South America",

    // Contact Page
    contactDescription1:
      "If you need any help or would like to make an inquiry, don't hesitate to contact us!",
    contactDescription2:
      "The Aiyu staff is here to serve you 24 hours a day. Below we provide information on ways to contact us:",
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
    faq1Answer:
      "The fee is ¥500 (approx. 3 USD) per item, plus 10% tax on the total product value. Includes: search, consolidation, packaging, and free storage.",
    faq2Question: "How are payments made?",
    faq2Answer:
      "We issue an electronic receipt via PayPal. You don't need a PayPal account: just a credit or debit card.",
    faq3Question: "What is the first payment and final payment?",
    faq3Answer:
      "• First payment: covers the cost of the products you choose.\n• If you add more items, we'll issue a new receipt.\n• Final payment: corresponds to international shipping after consolidating and weighing your purchases.",
    faq4Question: "How long does shipping take?",
    faq4Answer:
      "• Economy shipping to Latin America, USA, and Europe: 2–3 weeks.\n• Economy shipping to Asia: 1 week.\n• Express shipping (optional): 1–2 weeks.",
    faq5Question: "Do you have a physical store outside Japan?",
    faq5Answer:
      "Aiyu Japan is located in Osaka, Japan, and we don't have branches in other countries.",
    faq6Question: "Accepted payment methods",
    faq6Answer:
      "• Credit and debit cards\n• PayPal balance\n• Coming soon: bank transfer, Wise, etc.",
    faq7Question: "Shipping coverage",
    faq7Answer:
      "• Direct: Mexico, Chile, Peru, El Salvador, Costa Rica, Spain, and Argentina.\n• Courier (via USA): Paraguay, Ecuador, Bolivia, and Colombia.\n• Europe, Oceania, and rest of Asia: direct deliveries without intermediaries.",
    faq8Question: "What happens if my package is lost or doesn't arrive?",
    faq8Answer:
      "Aiyu Japan and Japan Post will investigate the case. If loss is confirmed, we'll refund 50% of the total product value.",
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
    normalDeliveryInfo:
      "Normal orders may take from 3–5 days to arrive to our warehouse",
    paymentReceivedInfo:
      "Payment received. We are going to proceed now to purchase/reserve your items",
    paymentConfirmationNotice1:
      "Payment confirmation may take from a few minutes to several hours (during business hours).",
    paymentConfirmationNotice2:
      "Please wait patiently after making your payment.",
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
    noItemsDescription:
      "Items will appear here once they arrive at our warehouse.",
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
    awaitingQuoteDescription:
      "These requests are being reviewed by our team. You'll receive a quote soon.",
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
    noShipmentsDescription:
      "Your shipping quotes and shipped orders will appear here.",
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
    shipmentsDescription:
      "Quotes that have been sent and are in various stages of processing.",
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

    japaneseAddressexplanation:
      "This is your Japanese address! Every item received at our warehouse is charged 500 yen (~$3 USD), with up to 30 days of free storage.",

    japaneseAddresswarningsTitle: "⚠️ Warnings:",
    japaneseAddresswarnings0:
      "Please make sure to copy everything correctly — we are not responsible for packages that are incorrectly addressed or delivered.",
    japaneseAddresswarnings1:
      "This Japanese address service is different from the Aiyu Japan shopping-agent service. It does not include benefits such as product photos, consolidation, or repackaging.",
    japaneseAddresswarnings2:
      "Packages will be forwarded exactly as they are received.",

    japaneseAddresstoastCopied: "Copied!",

    japaneseAddressrulesTitle: "⚠️ Japanese Address Service — Quick Rules",
    japaneseAddressrulesIntro:
      "If any of the following is required by the store:",
    japaneseAddressrules0: "Phone number or SMS/call verification",
    japaneseAddressrules1: "Payment support or your card doesn’t work",
    japaneseAddressrules2: "Full address (with AJxxxx code) cannot be entered",
    japaneseAddressrules3: "Identity verification or account assistance",
    japaneseAddressrulesBottom:
      "👉 Please use Aiyu Japan’s Shopping Agent Service.",

    // Edit Order Page
    editRejectedOrder: "Edit Rejected Order",
    orderRejectionReasonTitle: "Order Rejection Reason",
    productsInOrder: "Products in Order",
    editOrderDescription:
      "Edit the products below to fix any issues. Products marked with issues should be reviewed carefully.",
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
    requested:
      "Your product request has been submitted and is awaiting a quote.",
    quoted: "A quote has been issued. Please review and pay to proceed.",
    paid: "Payment received. We’ll now purchase your items.",
    purchased: "Items have been purchased and are on the way to the warehouse.",
    all_received: "All items in this order have arrived at our warehouse.",
    partial_received: "Some items have arrived. Others are still in transit.",
    rejected: "This order was rejected. Please review the reason.",

    // Shipping Quote Dialog
    requestShippingQuoteTitle: "Request Shipping Quote",
    shippingQuoteDescription:
      "Select your country and method to calculate estimated shipping cost.",
    selectedItems: "Selected Items",
    shippingCountry: "Shipping Country",
    zone: "Zone",
    shippingMethod: "Shipping Method",
    economicShippingLabel:
      "Economic/Standard Shipping (15-21 days - Small Packet)",
    expressShippingLabel:
      "Express Shipping (4-10 business days - Express mail service)",
    paraguayShippingLabel: "Paraguay Shipping",
    estimatedInternationalShipping: "Estimated International Shipping Cost",
    shippingAddressLabel: "Shipping Address",
    addressLabel: "Address",
    addressNotesLabel: "Address Notes (Optional)",
    requestQuote: "Request Quote",
    requestingQuote: "Submitting...",
    missingAddressInfo: "Please fill in all required address fields",
    shippingQuoteRequestedSuccess:
      "Your shipping quote has been submitted successfully. We'll contact you soon with the final quote.",
    shippingQuoteRequestError:
      "Failed to submit shipping quote. Please try again.",

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
    emailAlreadyRegisteredDesc:
      "This email is already in use. Please sign in or use a different email.",
    phoneAlreadyRegistered: "Phone number already registered",
    phoneAlreadyRegisteredDesc:
      "This phone number is already in use. Please use a different phone number.",
    signUpFailed: "Sign up failed",
    signUpFailedDesc: "An error occurred during signup.",
    emailAlreadyExistsAlt:
      "This email is already registered. Please sign in instead.",
    deliveryAddressPlaceholder: "Street address, apartment, suite, etc.",
    deliveryNotesPlaceholder:
      "Special delivery instructions, building name, etc.",
    loginRequired: "Login Required",
    pleaseSignInToAccess: "Please sign in to access this page.",
    adminAccessRequired: "Admin Access Required",
    defaultFallbackMessage: "You don't have permission to access this page.",
    currentRole: "Current role",
    loading: "Loading...",
    backToDashboard: "Back to Dashboard",
    // Forgot Password Page
    forgotPasswordTitle: "Forgot Password",
    forgotPasswordSubtitle:
      "Enter your email address and we'll send you a link to reset your password.",
    emailPlaceholder: "Enter your email address",
    sending: "Sending...",
    sendResetLink: "Send Reset Link",
    emailSentTo: "We've sent a password reset link to",
    didntReceive:
      "Didn't receive the email? Check your spam folder or try again.",
    backToSignIn: "Back to Sign In",

    //FAB Dialogue
    requestProductsTitle: "Request Products",
    requestProductsDescription:
      "Add product URLs you want to purchase from Japan. Sign in to submit your request.",
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
    faq9Answer:
      "You may have to pay customs duties if the value exceeds the allowed limit in your country. Aiyu Japan has no jurisdiction over this; it's the customer's responsibility. For more details, contact us by email or social media.",

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
    newsBlog4Title: "New 4",
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
    headerParagraph:
      "¡Compra en cualquier tienda <span class='text-red-600'>japonesa</span>!",

    // Home Page
    heroSlide1Title: "Desde Japón a Tu Casa Cualquier Día",
    heroSlide1TitleSubtitle:
      "En Aiyu Japan somos apasionados por conectar diferentes culturas y creado excelentes servicios.",
    heroSlide2Title:
      "Ofrecemos la emoción del j-shopping con gran empatía y responsabilidad con nuestros usuarios.",
    heroSlide2TitleSubtitle: "",

    //How It works
    howItWorks: "Cómo Funciona",
    step1Title: "Navega y Solicita",
    step1Description:
      "Encuentra productos en sitios web japoneses y envía tu solicitud a través de nuestra plataforma",
    step2Title: "Compramos por Ti",
    step2Description:
      "Nuestro equipo compra los artículos por ti y consolida tus pedidos",
    step3Title: "Te los Enviamos",
    step3Description:
      "Enviamos tus artículos de forma segura hasta tu puerta en todo el mundo",
    getStarted: "Comenzar",
    learnMore: "Saber Más",

    // Services Page
    servicesTitle: "Nuestros Servicios",
    servicesSubtitle: "Servicio Profesional de Compras Proxy Japonés",
    servicesDescription:
      "Hacemos que comprar desde Japón sea simple, seguro y asequible. Desde coleccionables de anime hasta electrónicos, moda y todo lo que esté entre ellos: ¡te tenemos cubierto!",
    whyChooseMainTitle: "¿Por Qué Elegir Nuestro Servicio Proxy?",
    whyChooseMainSubtitle:
      "Más que solo compras - somos tu socio de confianza en Japón",
    personalShoppingTitle: "Servicio de Compras Personales",
    personalShoppingDescription:
      "¿No puedes encontrar lo que buscas? ¡Nuestros compradores personales lo encontrarán por ti!",
    packageConsolidationTitle: "Consolidación de Paquetes",
    packageConsolidationDescription:
      "Ahorra dinero combinando múltiples pedidos en un solo envío",
    fastShippingTitle: "Envío Rápido y Seguro",
    fastShippingDescription:
      "Múltiples opciones de envío para satisfacer tus necesidades y presupuesto",
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
    whatCanWeShopSubtitle:
      "Desde artículos cotidianos hasta coleccionables raros: ¡podemos encontrarlo todo!",
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
    ctaDescription:
      "Comienza por enviarnos tus enlaces URL de tus compras o una imagen clara a una de nuestras redes sociales.",
    makeOrder: "Realizar Pedido",

    // Detailed How It Works
    howItWorksDetailedTitle: "Así funciona Aiyu Japan",
    howItWorksDetailedDescription1:
      "Trae una parte de Japón 1 tu hogar con Aiyu japan. Te ayudamos a comprar en múltiples tiendas y enviar los artículos juntos, ahorrando en costos. Rápido, seguro y sencillo—Aiyu Japan es tu compañero de compras japonés definitivo.",
    howItWorksDetailedDescription2:
      "¿Quieres saber más? Lee nuestra guía para nuevos usuarios para aprender todo lo que necesitas saber para comenzar a comprar en Neokyo.",
    newUserLinkBtn: "Guía para nuevos usuarios",

    step1DetailedTitle: "Paso 1  Encuentra tu producto",
    step1DetailedDescription:
      "Ve a tu tienda japonesa favorita (como Uniqlo, Pokémon Center, Animate o Amazon Japan). Cuando encuentres algo que quieras, copia el enlace (URL) de la página del producto. Ejemplo: https://example.com/product123",
    step2DetailedTitle: "Paso 2 – Pega el enlace en nuestro formulario",
    step2DetailedDescription:
      "Ve a nuestra página de solicitud: 👉 https://alpha.aiyujapan.com. Verás un formulario llamado “Enviar Solicitud de Producto”. Pega el enlace de tu producto allí — ¡así sabremos exactamente qué comprar para ti!",
    step3DetailedTitle: "Paso 3 – Agrega la cantidad",
    step3DetailedDescription:
      "En la siguiente casilla, escribe cuántas unidades deseas (por ejemplo: 1, 2 o 3).",
    step4DetailedTitle: "Paso 4 – Agrega un nombre o etiqueta (opcional)",
    step4DetailedDescription:
      "Puedes darle a tu pedido un nombre corto — por ejemplo: “Figura de Pikachu” o “Camiseta de One Piece”. Esto te ayudará a identificarlo más tarde dentro de tu panel.",
    step5DetailedTitle: "Paso 5 – Escribe una nota (opcional)",
    step5DetailedDescription:
      "Si tienes detalles especiales, como una talla, color o comentario, escríbelo aquí. Ejemplo: “Talla M, color azul, por favor elegir solo de tienda oficial”.",
    step6DetailedTitle: "Paso 6 – Agrega más productos",
    step6DetailedDescription:
      "¿Quieres más artículos? Simplemente haz clic en “Agregar otro producto”. Puedes agregar tantos enlaces como desees — cada uno formará parte de tu pedido.",
    step7DetailedTitle: "Paso 7 – Envía tu solicitud",
    step7DetailedDescription:
      "Cuando estés listo, haz clic en “Enviar solicitud”. Nuestro equipo revisará tus productos, confirmará la disponibilidad y te enviará un enlace de pago. ¡Una vez completado el pago, compraremos todo para ti!",
    // Why Choose Section
    whyChooseTitle: "¿Por qué elegir a Aiyu Japan?",
    whyChooseSubtitle:
      "Esto es lo que nos convierte en la mejor opción para tus compras japonesas.",
    reason1Title: "COMPRA TODO TODO LO QUE QUIERAS DE JAPON",
    reason1Description:
      "No solo puedes comprar lo que quieras de Japon, sino tambien trabajamos con reservas de productos imitados!",
    reason2Title: "LA MEJOR TARIFA DEL MERCADO",
    reason2Description:
      "Solo 500 yenes (3.5$) por item. ¡Tarifas competitivas que se ajustan a tu bolsillo!",
    reason3Title: "CONSOLIDACIONES GRATIS",
    reason3Description:
      "¿Compraste en diferentes tiendas? ¡Nosotros consolidamos todos tus pedidos sin costo adicional!",
    reason4Title: "ENVIOS A TODO EL MUNDO",
    reason4Description:
      "Desde Japón directo a tu puerta. Llegamos a Europa, Norte America y la gran mayoria de Sur America!",

    //Recommended stores section
    recommendedStoresTitle: "Tiendas Recomendadas",
    recommendedStoresDescription:
      "Compra de las tiendas más populares de Japón y de vendedores individuales.",

    // Hero Section Buttons
    makeOrderButton: "Realizar Pedido",
    whereToShop: "Donde Comprar",
    seeJapaneseStores: "Ver Tiendas Japonesas",
    calculateEstimatedCost: "Calcular Costo Estimado",

    // Additional Services Section
    additionalServicesTitle: "ADEMAS CONTAMOS CON",
    additionalServicesSubtitle:
      "Servicios adicionales para mejorar aún más tu experiencia de compra.",
    customerServiceTitle: "Atencion Al Cliente",
    customerServiceDescription:
      "Te atendemos a todas horas personalmente a traves del correo electronico, Instagram y Facebook.",
    securityTitle: "Seguridad Y Confianza",
    securityDescription:
      "Todos nuestros pagos son atraves de plataformas confiables, nuestros socios son empresas reconocidas a nivel nacional.",
    webServiceTitle: "Servicio Web",
    webServiceDescription:
      "El sitio web está diseñado para darte un 100% de comprensión de nuestros servicios, y está abierto 24/7 para consultas.",

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
    footerCopyright:
      "© 2025 ＳＥＲＲＵＤＯ合同会社 Todos los derechos reservados.",

    // Pricing Info Section
    transparentPricing: "Precios Transparentes",
    serviceFeePerItem: "Tarifa de Servicio por Artículo",
    taxOnItemCost: "Impuesto sobre el Costo del Artículo",
    internationalShipping: "Envío Internacional",
    variable: "Variable",
    noHiddenFeesTransparent:
      "Sin tarifas ocultas, sin sorpresas. Recibe una cotización detallada antes de realizar cualquier compra.",

    // Calculator Page
    calculatorBetaPage: "Simulador de costos",
    calculatorDisclaimer:
      "Estos precios son solamente aproximaciones, el precio real podria variar un poco.",

    // Purchase Calculator
    purchaseCalculator: "Calculadora de cotizacion",
    enterPriceInYen:
      "Ingresa el costo individual del articulo en Yenes japoneses",
    quotedPrice: "Precio cotizado",
    serviceFeeLabel: "Tarifa de servicio",
    enterPriceToCalculate:
      "¡Recuerda que la cotización es por cada articulo de compra!",

    // Shipping Calculator
    shippingCalculator: "Calculadora de envio internacional",
    selectRegion: "Seleccionar una región",
    region: "Región",
    shippingMethods: "Metodos de Envios",
    chooseShippingMethod: "Escoge uno de los metodos de envios.",
    economicShipping: "Envio Economico/standard (15-21 dias - Small Packet)",
    expressShippingMethod:
      "Envio Express (4-10 dias habiles - Express mail service)",
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
    storeGuideDescription:
      "Recuerda enviarnos los enlaces de tus productos a nuestro Instagram - Facebook - o Whatsapp!",
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
    amazonJapanDesc:
      "Una de las tiendas online Japonesas más famosas y confiables de todos.",
    rakuten: "Rakuten",
    rakutenDesc:
      "Una tienda conocida nacionalmente que se conoce por su variedad y precio.",
    yahooShopping: "Yahoo Shopping (PayPay Flea Market)",
    yahooShoppingDesc:
      "Tienda de ventas en general, similar a Amazon y Mercari.",
    mercariJapan: "Mercari Japón",
    mercariJapanDesc:
      "Tienda más grande de segunda mano. ¿Buscas una figura usada pero como nueva? Es aquí.",
    buyma: "Buyma",
    buymaDesc: "Marketplace japonés para ropa y artículos de marca exclusivos.",
    surugaya: "Surugaya",
    surugayaDesc:
      "Una de las tiendas más variadas y con los precios más baratos de artículos de anime.",
    mandarake: "Mandarake",
    mandarakeDesc:
      "La tienda perfecta para coleccionistas de manga, figuras y artículos retro.",
    animate: "Animate",
    animateDesc:
      "Una de las empresas de ventas de productos de anime más grandes de todas.",
    jumpShop: "Jump Shop",
    jumpShopDesc:
      "Artículos de One Piece, Haikyuu, Dragon Ball... ¿Ya conoces esta tienda?",
    chiikawaStore: "Chiikawa store",
    chiikawaStoreDesc:
      "Tienda oficial de Chiikawa con mercancía exclusiva y adorable.",
    cdJapan: "CD Japan",
    cdJapanDesc: "Japanese anime - J-pop groups - Kpop etc.",
    evangelionStore: "Evangelion Store",
    evangelionStoreDesc:
      "Tienda oficial de Evangelion con artículos exclusivos no disponibles en otras tiendas.",
    pokemonCenter: "Pokemon Center",
    pokemonCenterDesc:
      "Tienda oficial para todo tipo de productos de Pokémon, incluyendo peluches, ropa y juegos.",
    sailorMoonStore: "Sailor Moon Store",
    sailorMoonStoreDesc:
      "Encuentra productos exclusivos de Sailor Moon, desde figuras hasta artículos de colección.",
    sanrioStore: "Sanrio Store",
    sanrioStoreDesc:
      "Tienda oficial de Sanrio con productos adorables de Hello Kitty y otros personajes.",
    studioGhibliStore: "Studio Ghibli Store (Donguri Sora)",
    studioGhibliStoreDesc:
      "Tienda donde encontrarás productos exclusivos de las películas de Studio Ghibli.",
    usjStore: "Universal Studios Japan Store",
    usjStoreDesc:
      "Tienda oficial de Universal Studios Japan con productos exclusivos del parque.",
    disneyStore: "Disney Store",
    disneyStoreDesc:
      "Tienda oficial de Disney Japón con productos adorables y exclusivos.",
    mediaWorld: "Media World",
    mediaWorldDesc:
      "Especializada en figuras y mercancía de tus animes favoritos en segunda mano.",
    banpresto: "BANPRESTO",
    banprestoDesc:
      "Una de las mejores tiendas donde comprar tus figuras de anime.",
    popMart: "POP MART",
    popMartDesc: "La tienda de los Labubu, Crying Babies y más.",
    sylvanianFamilies: "Sylvanian Families",
    sylvanianFamiliesDesc:
      "Tienda oficial de los famosos ternurines, Sylvanian Family Store.",
    amiAmi: "AmiAmi",
    amiAmiDesc:
      "Una de las tiendas más populares de figuras y mercancía de anime. Amplia variedad de productos nuevos y en preventa.",
    goodSmileOnline: "Good Smile Online",
    goodSmileOnlineDesc:
      "Tienda oficial de Good Smile Company. Encuentra figuras Nendoroid, Figma y coleccionables exclusivos directamente del fabricante.",
    uniqlo: "UNIQLO",
    uniqloDesc:
      "Ropa cómoda y de calidad para toda la familia, con diseños simples y modernos.",
    gu: "GU",
    guDesc:
      "Moda asequible y a la moda, inspirada en las últimas tendencias de Japón.",
    zozotown: "ZOZOTOWN",
    zozotownDesc:
      "La tienda de moda online más grande de Japón con las mejores marcas.",
    graniph: "Graniph",
    graniphDesc:
      "Aquí encontrarás increíbles colaboraciones con series y animes.",
    weverseShop: "Weverse Shop Japan",
    weverseShopDesc: "Tienda oficial de productos K-pop en Japón.",
    btsOfficialShop: "BTS Official Shop Japan",
    btsOfficialShopDesc:
      "La tienda japonesa de una de las bandas más famosas del mundo.",
    newEra: "New Era",
    newEraDesc: "Gorras y accesorios de moda urbana de la marca New Era.",
    onitsukaTiger: "Onitsuka Tiger",
    onitsukaTigerDesc:
      "Zapatillas japonesas de moda con estilo retro y moderno.",
    crocsJapan: "Crocs Japan",
    crocsJapanDesc:
      "Tienda oficial japonesa de Crocs con nuevos modelos y colores.",
    humanMadeJapan: "Human Made Japan",
    humanMadeJapanDesc:
      "Ropa y accesorios de diseño creados por NIGO® y la marca Human Made.",
    adidasJapan: "Adidas Japan",
    adidasJapanDesc:
      "Tienda oficial de Adidas Japón con lanzamientos exclusivos.",
    nikeJapan: "Nike Japan",
    nikeJapanDesc:
      "Lo último en zapatillas, ropa y equipo deportivo de Nike en Japón.",
    stripeClub: "Stripe Club",
    stripeClubDesc:
      "Moda japonesa femenina con marcas como Earth, Music & Ecology.",
    daisoJapan: "Daiso Japón",
    daisoJapanDesc: "¿Tienda de 1 dólar? También lo tenemos.",
    nitori: "NITORI",
    nitoriDesc:
      "Una de las tiendas más grandes de Japón para comprar cosas para el hogar.",
    loft: "LOFT",
    loftDesc:
      "Tienda de productos de papelería, decoración y artículos para el hogar.",
    palCloset: "PAL CLOSET",
    palClosetDesc: "Una tienda donde encontrar cosas para la casa y ropa.",
    yodobashiCamera: "Yodobashi Camera",
    yodobashiCameraDesc:
      "Electrodomésticos, gadgets y artículos de hobby al mejor precio.",
    mujiJapan: "MUJI Japón",
    mujiJapanDesc:
      "Minimalismo japonés en su máxima expresión. Desde muebles y artículos del hogar hasta papelería, ropa y snacks.",
    oliveYoungGlobal: "Olive Young Global",
    oliveYoungGlobalDesc:
      "Tienda líder de cosmética coreana con envío global. Productos populares de skincare, maquillaje y cuidado personal.",
    cosmeCom: "Cosme.com",
    cosmeComDesc:
      "Una de las plataformas más confiables en Japón para comprar maquillaje y cosméticos de marcas japonesas premiadas.",

    // Shipping calculator regions
    asia: "Asia",
    europeCanadaMexico: "Europa, México y Canadá",
    usa: "EEUU",
    centralSouthAmerica: "Centro y Sur América",

    // Contact Page
    contactDescription1:
      "Si necesita alguna ayuda o quisiera hacer una consulta no dude en contactarnos!",
    contactDescription2:
      "El staff de Aiyu esta para servirle las 24 horas. A continuacion dejamos informacion de las formas de contacto:",
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
    faq1Answer:
      "La tarifa es de ¥500 (aprox. 3 USD) por artículo, más un 10 % de tax sobre el valor total del producto. Incluye: búsqueda, consolidación, empaquetado y almacenamiento gratuito.",
    faq2Question: "¿Cómo se realizan los pagos?",
    faq2Answer:
      "Emitimos un recibo electrónico vía PayPal. No necesitas cuenta de PayPal: solo tarjeta de crédito o débito.",
    faq3Question: "¿Cuál es el primer pago y el pago final?",
    faq3Answer:
      "• Primer pago: cubre el costo de los productos que elijas.\n• Si agregas más artículos, emitiremos un nuevo recibo.\n• Pago final: corresponde al envío internacional tras consolidar y pesar tus compras.",
    faq4Question: "¿Cuánto tarda el envío?",
    faq4Answer:
      "• Envío económico a Latinoamérica, EE. UU. y Europa: 2–3 semanas.\n• Envío económico a Asia: 1 semana.\n• Envío exprés (opcional): 1–2 semanas.",
    faq5Question: "¿Tienen tienda física fuera de Japón?",
    faq5Answer:
      "Aiyu Japan está en Osaka, Japón, y no contamos con sucursales en otros países.",
    faq6Question: "Métodos de pago aceptados",
    faq6Answer:
      "• Tarjetas de crédito y débito\n• Saldo de PayPal\n• Próximamente: transferencia bancaria, Wise, etc.",
    faq7Question: "Cobertura de envíos",
    faq7Answer:
      "• Directo: México, Chile, Perú, El Salvador, Costa Rica, España y Argentina.\n• Courier (vía EE. UU.): Paraguay, Ecuador, Bolivia y Colombia.\n• Europa, Oceanía y resto de Asia: entregas directas sin intermediarios.",
    faq8Question: "¿Qué pasa si mi paquete se pierde o no llega?",
    faq8Answer:
      "Aiyu Japan y Japan Post investigarán el caso. Si se confirma pérdida, reembolsaremos el 50 % del valor total del producto.",
    faq9Question: "¿Debo pagar aranceles al recibir el paquete?",
    faq9Answer:
      "Puede que debas abonar aranceles si el valor excede el límite permitido en tu país. Aiyu Japan no tiene jurisdicción sobre esto; es responsabilidad del cliente. Para más detalles, contáctanos por email o SNS.",

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
    productRequestSubtitle:
      "Añade los productos que quieres que compremos para ti",
    productUrl: "URL del Producto",
    productUrlPlaceholder: "https://ejemplo.com/producto",
    productName: "Nombre del Producto (Opcional)",
    productNamePlaceholder: "Nombre del Producto (Opcional)",
    quantity: "Cantidad",
    productNotes: "Notas (Opcional)",
    productNotesPlaceholder:
      "Talla, color, instrucciones especiales... (Opcional)",
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
    normalDeliveryInfo:
      "Los pedidos normales pueden tardar de 3 a 5 días en llegar a nuestro almacén",
    paymentReceivedInfo:
      "Pago recibido. Procederemos ahora a comprar o reservar tus artículos",
    paymentConfirmationNotice1:
      "La confirmación del pago puede tardar desde unos minutos hasta varias horas (durante el horario laboral).",
    paymentConfirmationNotice2:
      "Por favor, espera pacientemente después de realizar el pago.",
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
    selectItemsToShip:
      "Selecciona artículos para solicitar una cotización de envío",
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
    noItemsDescription:
      "Los artículos aparecerán aquí una vez que lleguen a nuestro almacén.",
    shippingQuotesRequested: "Cotizaciones de Envío Solicitadas",
    shipmentNumber: "Envío #",
    viewInShipping: "Ver en Envíos",
    storageAlertTitle: "Información de Almacenamiento",
    storageAlert1:
      "Los artículos se almacenan de forma segura en nuestro almacén",
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
    awaitingQuoteDescription:
      "Estas solicitudes están siendo revisadas por nuestro equipo. Recibirás una cotización pronto.",
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
    noShipmentsDescription:
      "Tus cotizaciones de envío y pedidos enviados aparecerán aquí.",
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
    shipmentsDescription:
      "Cotizaciones que han sido enviadas y están en diferentes etapas de procesamiento.",
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

    japaneseAddressexplanation:
      "¡Esta es tu dirección japonesa! Cada ítem recibido tiene un cargo de 500 yenes (~$3 USD) e incluye hasta 30 días de almacenamiento gratuito.",

    japaneseAddresswarningsTitle: "⚠️ Advertencias:",
    japaneseAddresswarnings0:
      "Por favor, asegúrate de copiar toda la dirección correctamente. No nos hacemos responsables por paquetes mal dirigidos o entregados de forma incorrecta.",
    japaneseAddresswarnings1:
      "Este servicio de dirección japonesa es diferente al servicio de compras de Aiyu Japan. No incluye beneficios como fotografías del producto, consolidación o reempaquetado.",
    japaneseAddresswarnings2:
      "Los paquetes serán reenviados exactamente en el estado en el que sean recibidos.",

    japaneseAddresstoastCopied: "¡Copiado!",

    japaneseAddressrulesTitle: "⚠️ Servicio de Dirección en Japón — Importante",
    japaneseAddressrulesIntro: "NO podemos:",
    japaneseAddressrules0: "Aceptar verificaciones por SMS o llamadas",
    japaneseAddressrules1:
      "Ayudar si tu tarjeta es rechazada o el pago no funciona",
    japaneseAddressrules2:
      "Ingresar la dirección por ti si la tienda no acepta tu código AJxxxx",
    japaneseAddressrules3:
      "Realizar verificación de identidad o contactar a la tienda por ti",
    japaneseAddressrulesBottom:
      "👉 Si necesitas cualquiera de esas cosas: Debes usar el servicio de Shopping Agent de Aiyu Japan.",

    // Edit Order Page
    editRejectedOrder: "Editar Pedido Rechazado",
    orderRejectionReasonTitle: "Motivo de Rechazo del Pedido",
    productsInOrder: "Productos en el Pedido",
    editOrderDescription:
      "Edita los productos a continuación para corregir cualquier problema. Los productos marcados con problemas deben revisarse cuidadosamente.",
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
    requested:
      "Tu solicitud de producto ha sido enviada y está a la espera de una cotización.",
    quoted:
      "Se ha emitido una cotización. Por favor, revísala y realiza el pago para continuar.",
    paid: "Pago recibido. Ahora procederemos a comprar tus artículos.",
    purchased: "Los artículos han sido comprados y están en camino al almacén.",
    all_received:
      "Todos los artículos de este pedido han llegado a nuestro almacén.",
    partial_received:
      "Algunos artículos han llegado. Otros aún están en tránsito.",
    rejected: "Este pedido fue rechazado. Por favor, revisa el motivo.",

    // Shipping Quote Dialog
    requestShippingQuoteTitle: "Solicitar Cotización de Envío",
    shippingQuoteDescription:
      "Selecciona tu país y método para calcular el costo estimado de envío.",
    selectedItems: "Artículos Seleccionados",
    shippingCountry: "País de Envío",
    zone: "Zona",
    shippingMethod: "Método de Envío",
    economicShippingLabel:
      "Envío Económico/Estándar (15-21 días - Small Packet)",
    expressShippingLabel:
      "Envío Exprés (4-10 días hábiles - Express mail service)",
    paraguayShippingLabel: "Envío a Paraguay",
    estimatedInternationalShipping: "Costo Estimado de Envío Internacional",
    shippingAddressLabel: "Dirección de Envío",
    addressLabel: "Dirección",
    addressNotesLabel: "Notas de Dirección (Opcional)",
    requestQuote: "Solicitar Cotización",
    requestingQuote: "Enviando...",
    missingAddressInfo:
      "Por favor completa todos los campos de dirección requeridos",
    shippingQuoteRequestedSuccess:
      "Tu solicitud de cotización de envío ha sido enviada con éxito. Te contactaremos pronto con la cotización final.",
    shippingQuoteRequestError:
      "Error al enviar solicitud de cotización de envío. Por favor intenta de nuevo.",

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
    includeCountryCode:
      "Incluye el código de país para números internacionales",
    forgotPasswordQuestion: "¿Olvidaste tu contraseña?",
    dontHaveAccountQuestion: "¿No tienes una cuenta?",
    alreadyHaveAccountQuestion: "¿Ya tienes una cuenta?",
    passwordsDoNotMatch: "Las contraseñas no coinciden",
    passwordTooShort: "La contraseña debe tener al menos 6 caracteres",
    fillRequiredFields: "Por favor completa todos los campos requeridos",
    enterPhoneNumber: "Por favor ingresa tu número de teléfono",
    invalidPhoneNumber: "Por favor ingresa un número de teléfono válido",
    fillAddressFields:
      "Por favor completa todos los campos de dirección requeridos",
    emailAlreadyRegistered: "Correo electrónico ya registrado",
    emailAlreadyRegisteredDesc:
      "Este correo ya está en uso. Inicia sesión o usa otro correo.",
    phoneAlreadyRegistered: "Número de teléfono ya registrado",
    phoneAlreadyRegisteredDesc: "Este número ya está en uso. Usa otro número.",
    signUpFailed: "Error en el registro",
    signUpFailedDesc: "Ocurrió un error durante el registro.",
    emailAlreadyExistsAlt:
      "Este correo ya está registrado. Inicia sesión en su lugar.",
    deliveryAddressPlaceholder: "Calle, apartamento, piso, etc.",
    deliveryNotesPlaceholder:
      "Instrucciones especiales de entrega, nombre del edificio, etc.",
    loginRequired: "Inicio de sesión requerido",
    pleaseSignInToAccess:
      "Por favor, inicia sesión para acceder a esta página.",
    adminAccessRequired: "Acceso de administrador requerido",
    defaultFallbackMessage: "No tienes permiso para acceder a esta página.",
    currentRole: "Rol actual",
    loading: "Cargando...",
    backToDashboard: "Volver al panel",
    // Forgot Password Page
    forgotPasswordTitle: "Olvidé mi contraseña",
    forgotPasswordSubtitle:
      "Introduce tu dirección de correo electrónico y te enviaremos un enlace para restablecer tu contraseña.",
    emailPlaceholder: "Introduce tu correo electrónico",
    sending: "Enviando...",
    sendResetLink: "Enviar enlace de restablecimiento",
    emailSentTo: "Hemos enviado un enlace para restablecer la contraseña a",
    didntReceive:
      "¿No recibiste el correo? Revisa tu carpeta de spam o inténtalo de nuevo.",
    backToSignIn: "Volver a Iniciar Sesión",

    //FAB dialogue
    requestProductsTitle: "Solicitar productos",
    requestProductsDescription:
      "Agrega los enlaces de los productos que deseas comprar desde Japón. Inicia sesión para enviar tu solicitud.",
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
    newsBlog4Title: "New 4",
  },
};

export type Language = "en" | "es";
export type TranslationKey = keyof typeof translations.en;
