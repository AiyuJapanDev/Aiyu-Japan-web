export interface FAQ {
  question: string;
  answer: string;
}

export interface HelpArticle {
  title: string;
  description: string;
  faqs: FAQ[];
}

export interface HelpData {
  howItWorks: HelpArticle;
  whereToBuy: HelpArticle;
  pricing: HelpArticle;
  steps: HelpArticle;
  services: HelpArticle;
  firstSteps: HelpArticle;
  orders: HelpArticle;
  warehouse: HelpArticle;
  credits: HelpArticle;
  customs: HelpArticle;
}

export const helpArticlesEN: HelpData = {
  howItWorks: {
    title: "How does Aiyu Japan work?",
    description: "Aiyu Japan is a Japanese Proxy service that helps you buy products from Japan and offers international shipping worldwide.",
    faqs: [
      {
        question: "What is Aiyu Japan?",
        answer: "Aiyu Japan is a Japanese Proxy service company that helps users buy products from Japan and offers international shipping worldwide. Unlike other proxy services that add hidden fees or extra charges after purchasing, Aiyu Japan offers one transparent fee that already includes unlimited storage, consolidation, and photo requests."
      },
      {
        question: "How does the basic process work?",
        answer: "1. Find your item on your favorite Japanese store (Uniqlo, Pokémon Center, Animate, Amazon Japan, etc.)\n2. Copy the product link (URL)\n3. Send us the link through our request form\n4. We check availability and send you a payment link\n5. After payment, we purchase the items for you\n6. Items arrive at our Osaka warehouse\n7. We weigh them and send you the international shipping quote\n8. Choose your shipping method and we send your package worldwide"
      },
      {
        question: "Do I need to know Japanese?",
        answer: "No, it's not necessary. Our service is completely available in Spanish and English. If you need us to buy for you, just send us the product link and we take care of everything. We also provide translations if needed."
      },
      {
        question: "Can I buy from any Japanese store?",
        answer: "We can buy from most Japanese online stores such as Amazon JP, Rakuten, Yahoo Auctions, Mercari, Suruga-ya, Mandarake, Animate, and many more. Some very specific stores may have restrictions. Contact us if you have questions about a particular store."
      },
      {
        question: "How long does the complete process take?",
        answer: "From purchase to delivery:\n- Purchase processing: 1-2 days\n- Delivery to Osaka warehouse: 3-7 days\n- Processing and consolidation: 1-3 days (optional)\n- International shipping: 15-21 days (Economy), 4-10 days (EMS), 2-5 days (DHL Express), or 3 business months (Sea Shipping for Paraguay/Peru)\n\nTotal: 2-3 weeks with express shipping, 1-2 months with economy shipping, or 3-4 months with sea shipping."
      }
    ]
  },
  whereToBuy: {
    title: "Where to buy?",
    description: "Access the best online stores and markets in Japan. We buy on your behalf from any of these platforms.",
    faqs: [
      {
        question: "Which online stores are compatible?",
        answer: "We work with:\n\n• <a href='https://www.amazon.co.jp/' target='_blank' rel='noopener noreferrer' style='color: #f97316; text-decoration: underline;'>Amazon Japan</a>\n• <a href='https://www.rakuten.co.jp/' target='_blank' rel='noopener noreferrer' style='color: #f97316; text-decoration: underline;'>Rakuten</a>\n• <a href='https://auctions.yahoo.co.jp/' target='_blank' rel='noopener noreferrer' style='color: #f97316; text-decoration: underline;'>Yahoo! Auctions Japan</a>\n• <a href='https://shopping.yahoo.co.jp/' target='_blank' rel='noopener noreferrer' style='color: #f97316; text-decoration: underline;'>Yahoo! Shopping Japan</a>\n• <a href='https://jp.mercari.com/' target='_blank' rel='noopener noreferrer' style='color: #f97316; text-decoration: underline;'>Mercari</a>\n• <a href='https://www.suruga-ya.com/' target='_blank' rel='noopener noreferrer' style='color: #f97316; text-decoration: underline;'>Suruga-ya</a>\n• <a href='https://order.mandarake.co.jp/' target='_blank' rel='noopener noreferrer' style='color: #f97316; text-decoration: underline;'>Mandarake</a>\n• <a href='https://www.animate-onlineshop.jp/' target='_blank' rel='noopener noreferrer' style='color: #f97316; text-decoration: underline;'>Animate Online Shop</a>\n• <a href='https://www.amiami.com/' target='_blank' rel='noopener noreferrer' style='color: #f97316; text-decoration: underline;'>AmiAmi</a>\n• <a href='https://goodsmileshop.com/' target='_blank' rel='noopener noreferrer' style='color: #f97316; text-decoration: underline;'>Good Smile Online</a>\n• <a href='https://www.pokemoncenter-online.com/' target='_blank' rel='noopener noreferrer' style='color: #f97316; text-decoration: underline;'>Pokémon Center</a>\n• <a href='https://www.cdjapan.co.jp/' target='_blank' rel='noopener noreferrer' style='color: #f97316; text-decoration: underline;'>CD Japan</a>\n• And many more!"
      },
      {
        question: "Can I buy at Yahoo Auctions?",
        answer: "Yes, we offer bidding service at Yahoo Auctions Japan. Just send us the item link, your maximum bid, and we'll bid for you. The Shopping Agent service fee of ¥500-¥1,000 per item applies."
      },
      {
        question: "Can you buy at physical stores?",
        answer: "Yes! We offer on-site shopping service in Osaka. Fee: ¥1,500 per visit (includes up to 1 hour in store). This is perfect for items only available in physical stores. Contact us through our social media to book a reservation."
      },
      {
        question: "Can I buy second-hand products?",
        answer: "Yes, you can buy used products from Mercari, Yahoo Auctions, Hard Off, Book Off, Mandarake, Suruga-ya, and other second-hand stores. We can request additional photos of the product if you need them."
      },
      {
        question: "Are there stores you don't work with?",
        answer: "Some stores have strict policies against proxy services:\n- Pokémon Center Online (strict policy, but we can try)\n- Nintendo Store Japan (limited)\n- Some exclusive pre-order stores\n\nAlways contact us first if you're not sure."
      }
    ]
  },
  pricing: {
    title: "Fees & Costs",
    description: "Total transparency in our pricing. No hidden fees, no surprises.",
    faqs: [
      {
        question: "How much does registration cost?",
        answer: "Registration is completely FREE. There are no membership costs or monthly fees. You only pay when you use the service."
      },
      {
        question: "What are the service fees?",
        answer: "Shopping Agent Service:\n- Items up to ¥10,000: ¥500 per item\n- Items over ¥10,000: ¥1,000 per item\n\nJapanese Address/Locker Service:\n- ¥1,000 per box received\n\nImportant: Shopping Agent orders can be consolidated and include all premium benefits. Locker service boxes can also be consolidated with Shopping Agent orders."
      },
      {
        question: "What's included in the Shopping Agent service?",
        answer: "The ¥500-¥1,000 service fee includes:\n✓ Product search and purchase processing\n✓ Unlimited free storage\n✓ Free consolidation with other packages\n✓ Free photo requests\n✓ Standard or double packaging\n✓ Private support for your orders\n\nThis is all included in one transparent fee!"
      },
      {
        question: "How is international shipping calculated?",
        answer: "Shipping cost is based on:\n- Real weight of the package\n- Volumetric weight (Length × Width × Height / 5000) for air shipping\n- Destination country\n- Shipping method (Economy, EMS, DHL Express)\n\nWe use whichever is HIGHER between real and volumetric weight. You can use our shipping calculator for estimates."
      },
      {
        question: "Are there any hidden or extra costs?",
        answer: "NO hidden costs. The only costs are:\n1. Product price\n2. Domestic shipping in Japan (from seller to our warehouse)\n3. Our service fee (¥500-¥1,000 per item)\n4. International shipping\n\nIMPORTANT: Import taxes from your country are NOT included and are your responsibility."
      },
      {
        question: "Do you accept store discounts or coupons?",
        answer: "Yes! If the store accepts coupons or discount codes, we can apply them to your purchase. Just provide us the code when requesting the purchase. The savings are completely yours."
      },
      {
        question: "What about limited purchase items?",
        answer: "For items with purchase limits (1-3 units per customer), an extra ¥1,000 per item will apply on top of the normal service fee. This is for rare or restricted items."
      }
    ]
  },
  steps: {
    title: "Service Steps",
    description: "Complete guide of the process from registration to receiving your products.",
    faqs: [
      {
        question: "Step 1: How do I register?",
        answer: "1. Click on 'Register' at https://aiyujapan.com\n2. Complete the form with your email and password\n3. Verify your email (check spam if you don't see it)\n4. Complete your profile with your full delivery address\n5. Done! You'll receive your unique customer code"
      },
      {
        question: "Step 2: How do I get my Japanese address?",
        answer: "After registering, go to 'My Account' > 'Japanese Address'. You'll see your complete address with your unique code (e.g., AJ00123). This address is ONLY for domestic shipments within Japan when using our Locker Service. Always use your code in the name field when buying directly."
      },
      {
        question: "Step 3: How do I request a purchase?",
        answer: "There are two ways:\n\nA) Shopping Agent Service (Recommended): Go to 'Submit Request' > paste the product link > specify quantity and variants > we add 5-10% commission and buy for you. Includes all premium benefits.\n\nB) Japanese Address/Locker: Buy yourself and ship to our Japanese address. Costs ¥1,000 per box received, can be consolidated with Shopping Agent orders."
      },
      {
        question: "Step 4: What happens when it arrives at the warehouse?",
        answer: "1. We receive your package within 24-48 hours of arrival\n2. We register it in your account\n3. We weigh it and take photos (free for Shopping Agent service)\n4. We send you a notification by email\n5. You can request consolidation with other packages\n6. The package is stored for free with unlimited time"
      },
      {
        question: "Step 5: How does consolidation work?",
        answer: "If you have multiple packages in the warehouse:\n1. Wait for all your packages to arrive (or the ones you want to consolidate)\n2. Go to 'Storage' > Select packages\n3. Click 'Request Shipping Quote'\n4. Choose options: remove packaging, extra reinforcement, etc.\n5. We process it and notify you with final weight\n6. Ready to ship!\n\nNote: All packages can be consolidated together for savings on international shipping."
      },
      {
        question: "Step 6: How do I request international shipping?",
        answer: "1. Go to 'Storage' or wait for our shipping quote\n2. Select the package(s) to ship\n3. Choose shipping method (Economy, EMS, or DHL Express)\n4. Declare the content value (be honest)\n5. Review total cost\n6. Pay and confirm\n7. We ship within 1-2 business days"
      }
    ]
  },
  services: {
    title: "Services Included",
    description: "All services available to facilitate your purchases from Japan.",
    faqs: [
      {
        question: "What does the warehouse service include?",
        answer: "Includes:\n✓ Unlimited package reception\n✓ Free photos for Shopping Agent orders\n✓ Basic visual inspection\n✓ Unlimited free storage\n✓ Email notifications\n✓ Package protection in secure warehouse\n✓ Basic insurance against warehouse damage"
      },
      {
        question: "What is consolidation and how does it help?",
        answer: "Consolidation combines multiple packages into one. Benefits:\n\n✓ Significant savings on international shipping\n✓ Less risk of loss\n✓ Single tracking number\n✓ Simpler customs processing\n✓ We can remove unnecessary packaging to reduce weight\n\nIdeal when you buy from multiple sellers. Available for all packages in your warehouse."
      },
      {
        question: "Do you offer product inspection?",
        answer: "Yes, we offer inspection:\n\n1) Basic inspection (FREE for Shopping Agent): We verify the package is sealed and not damaged externally\n\n2) You can request additional photos (free for Shopping Agent orders) to verify condition, details, and contents."
      },
      {
        question: "Can you remove packaging to reduce weight?",
        answer: "Yes, we offer packaging removal service FREE for Shopping Agent orders. We can:\n- Remove external boxes from products with inner box\n- Eliminate unnecessary filling\n- Discard excessive packaging\n\nThis reduces weight and shipping cost. We always maintain adequate product protection."
      },
      {
        question: "What shipping methods do you offer?",
        answer: "We offer multiple options:\n\n• Economy/Standard (Airmail): 15-21 days, basic tracking\n• EMS (Express Mail Service): 4-10 days, full tracking, reliable\n• DHL Express: 2-5 days, very fast, full tracking\n• Paraguay Special: Aiyu Japan Express, 12-14 days\n• Sea/Maritime Shipping: 3 business months, departs once a month (Paraguay and Peru only)\n\nAvailability depends on destination and weight."
      },
      {
        question: "Do you offer insurance for shipments?",
        answer: "Yes:\n- EMS and DHL include basic insurance automatically\n- You can purchase additional insurance when shipping\n- Coverage up to 200,000 JPY\n- Recommended for high-value items (figures, electronics, collectibles)\n\nNote: Insurance not currently available for Paraguay."
      }
    ]
  },
  firstSteps: {
    title: "First Steps",
    description: "Quick guide for new users. Start using Aiyu Japan today.",
    faqs: [
      {
        question: "I'm new, where do I start?",
        answer: "Follow these steps:\n1. Register on the website (5 minutes)\n2. Verify your email\n3. Complete your delivery address in 'Profile'\n4. Note your customer code\n5. Make your first purchase!\n\nTip: Start with something small and economical to familiarize yourself with the process."
      },
      {
        question: "What information do I need to provide?",
        answer: "For registration:\n- Valid email\n- Secure password\n- Full name\n- Complete delivery address (with postal code)\n- Phone number\n- Tax ID (RFC, CUIL, VAT or similar - important for delivery)\n\nFor purchases:\n- Product link or detailed description\n- Variant/size/color if applicable\n- Maximum budget"
      },
      {
        question: "How do I make my first purchase?",
        answer: "Recommended method for beginners:\n\n1. Find a product on Amazon Japan (easier)\n2. Copy the complete link\n3. Go to 'Submit Request' in your dashboard\n4. Paste the link\n5. Specify quantity\n6. We confirm price + commission (5-10%)\n7. You pay and we buy for you\n8. We notify you when it arrives at the warehouse"
      },
      {
        question: "What is the difference between Shopping Agent and Japanese Address?",
        answer: "Shopping Agent Service (¥500-¥1,000/item):\n• We buy for you\n• Includes unlimited storage, consolidation, photos\n• Can combine multiple orders\n• Full premium benefits\n\nJapanese Address/Locker (¥1,000/box):\n• You buy yourself\n• Ship to our address\n• Can be consolidated with Shopping Agent orders\n• Unlimited storage\n\nFor best value and flexibility, use Shopping Agent!"
      },
      {
        question: "How long does my first purchase take?",
        answer: "Typical timeline:\n- Request → Purchase: 1-2 days\n- Store → Warehouse: 3-7 days\n- Warehouse → Consolidation: 1-3 days (optional)\n- Japan → Your country (EMS): 4-10 days\n\nTotal: Approximately 2-3 weeks\n\nWe update you at each step of the process."
      },
      {
        question: "Tips for beginners",
        answer: "✓ Start with Amazon Japan (easier and reliable)\n✓ Don't buy prohibited items (check the list)\n✓ Take advantage of unlimited free storage to consolidate\n✓ Use Economy shipping for non-urgent items to save money\n✓ Always declare the real value in customs\n✓ Join our Discord community for tips\n✓ Read the FAQ before buying\n✓ Contact us if you have any doubts"
      }
    ]
  },
  orders: {
    title: "Order Management",
    description: "Everything about how to manage and track your orders at Aiyu Japan.",
    faqs: [
      {
        question: "How do I request you to buy for me?",
        answer: "1. Go to 'Submit Request'\n2. Paste the product link\n3. Specify quantity, color, size, etc.\n4. Add special notes if needed\n5. We send you a quote within 1-24 hours\n6. If you accept, we buy immediately\n7. You can track progress in 'Orders' section"
      },
      {
        question: "What do the order statuses mean?",
        answer: "• Requested: We're reviewing your request\n• Awaiting Payment: Quote issued, waiting for payment\n• Paid: Payment received, we'll purchase soon\n• Some Purchased: Some items bought, others pending\n• All Purchased: All items bought\n• In Transit: Seller shipped to our warehouse\n• All at Warehouse: All items received and ready\n• Shipped: On the way to you\n• Delivered: Package arrived!"
      },
      {
        question: "Can I cancel an order?",
        answer: "Depends on the status:\n\n✅ Requested/Awaiting Payment: Free cancellation\n✅ Paid (not yet purchased): Possible refund\n❌ Purchased: Depends on store's return policy\n❌ In Transit/Warehouse: Non-refundable\n\nContact support ASAP if you need to cancel. Some stores may charge restocking fees."
      },
      {
        question: "How does tracking work?",
        answer: "Tracking in two stages:\n\n1) Domestic (Japan): Tracking from store to our warehouse. Provided by the seller when available.\n\n2) International: Tracking from Japan to your country. We give you the tracking number when we ship.\n\nYou can see both in your dashboard in real-time."
      },
      {
        question: "What happens if the product is out of stock?",
        answer: "If the product is out of stock after your request:\n1. We notify you immediately\n2. Options: wait for restock, find alternative, or cancel\n3. Full refund if you cancel\n4. No service charges\n\nWe always verify availability before quoting when possible."
      },
      {
        question: "Can I modify an order after requesting it?",
        answer: "Before purchase: Yes, contact support\n\nAfter purchase: Generally NO. Some stores allow changes but it's rare. Possible options:\n- Cancel and repurchase (if store accepts returns)\n- Buy the correct item separately\n\nThat's why it's important to review carefully before approving."
      }
    ]
  },
  warehouse: {
    title: "Warehouse Management",
    description: "How your personal warehouse in Japan works and all available options.",
    faqs: [
      {
        question: "What is my warehouse address?",
        answer: "Shopping Agent Service: We handle everything. Items are automatically sent to our warehouse.\n\nJapanese Address/Locker Service: Your personal address in Japan includes:\n- Aiyu Japan warehouse name\n- Your unique code (e.g., AJ00123)\n- Complete address in Japanese format\n- Postal code\n- Warehouse phone number\n\nALWAYS use your code in the name field when buying directly."
      },
      {
        question: "How long can I store my packages?",
        answer: "Unlimited free storage for all services!\n\nNo time limits, no extra charges. You can consolidate multiple packages and ship when you're ready.\n\nNote: We recommend shipping within a reasonable time to avoid customs value depreciation."
      },
      {
        question: "How does consolidation work?",
        answer: "Step by step:\n1. Wait for your packages to arrive\n2. Go to 'Storage' > Select packages\n3. Click 'Request Shipping Quote'\n4. Choose options: remove packaging, extra reinforcement, etc.\n5. We process it in 1-2 business days\n6. We notify you with photos and final weight\n7. Ready to ship!\n\nConsolidation is FREE!"
      },
      {
        question: "What photos do I receive of my packages?",
        answer: "For Shopping Agent Service (FREE):\n- Photos of external package\n- Photos of opened package\n- Photos of contents\n- Additional photos upon request\n\nFor Locker Service:\n- Photos available upon request (may have additional cost)\n\nYou can request specific angles, close-ups, or measurements anytime."
      },
      {
        question: "Can I request detailed inspection?",
        answer: "Yes! For Shopping Agent orders:\n\n✓ We open packages\n✓ Verify product matches description\n✓ Check for defects, scratches, damage\n✓ Take detailed photos\n✓ Verify included accessories\n✓ Basic functionality test (for electronics)\n\nAll included in the service fee. Just request it!"
      },
      {
        question: "What happens if my package arrives damaged?",
        answer: "If the package arrives damaged to the warehouse:\n1. We take photos of the damage immediately\n2. We notify you before opening it\n3. Options:\n   a) Claim with the seller/carrier\n   b) Accept as is (if minor)\n   c) Return to seller (if they accept)\n\nResponsibility lies with the seller or domestic carrier, not Aiyu Japan."
      }
    ]
  },
  customs: {
    title: "Customs & Taxes",
    description: "Crucial information about customs, declarations, and import taxes.",
    faqs: [
      {
        question: "Will I have to pay taxes in my country?",
        answer: "Probably YES, if your package exceeds your country's minimum value:\n\n- USA: Over $800 USD\n- Spain: Over €150\n- Mexico: Over $50 USD\n- Colombia: Over $200 USD\n- Chile: All packages pay taxes\n- Argentina: Over $50 USD\n- Paraguay: Over $100 USD\n\nVerify your country's specific regulations. Taxes are NOT included in our service."
      },
      {
        question: "How much are import taxes?",
        answer: "Varies by country, but typically:\n\n- VAT/IVA: 10-21% of value\n- Tariffs: 0-20% depending on product type\n- Handling fee: $5-30 USD (courier)\n\nExample: $100 package in Spain\n- IVA 21%: €21\n- Handling: €10\n- Total: €31 additional\n\nUse online calculators from your country to estimate."
      },
      {
        question: "Can I declare a lower value to pay less taxes?",
        answer: "❌ WE DO NOT RECOMMEND THIS:\n\n- It's ILLEGAL in most countries\n- Risk of package confiscation\n- Possible fines or penalties\n- Insurance won't cover real value if lost\n- May result in import ban\n\nALWAYS DECLARE THE REAL VALUE. It's safer and legal."
      },
      {
        question: "What documents do I need for customs?",
        answer: "Typically you need:\n\n✓ Commercial invoice (we provide it)\n✓ Content declaration (we provide it)\n✓ Your personal ID\n✓ Proof of payment (optional)\n✓ Special certificates (regulated products)\n\nMost documents are generated automatically. We'll notify you if you need anything additional."
      },
      {
        question: "What happens if my package is held at customs?",
        answer: "If your package is inspected/held:\n\n1. The courier will notify you\n2. They may request:\n   - Additional documents\n   - Tax payment\n   - Content clarifications\n3. Respond QUICKLY (usually 10 days)\n4. Pay required taxes\n5. Package will be released\n\nContact our support if you need help with documents."
      },
      {
        question: "Do some products have special restrictions?",
        answer: "Yes, products that frequently require permits:\n\n⚠️ Lithium batteries: Air shipping restrictions (max 2 per shipment)\n⚠️ Food: Sanitary certificates\n⚠️ Medicines: Mandatory medical prescription\n⚠️ Cosmetics: Quantity limits\n⚠️ Electronics: Your country's certifications\n⚠️ Knives/swords: Special permits\n⚠️ Liquids/Aerosols: Cannot be shipped by air\n\nCheck the 'Prohibited Items' section before buying."
      }
    ]
  },
  credits: {
    title: "Credit System",
    description: "How to use and manage your credits from cancellations and refunds.",
    faqs: [
      {
        question: "What is the credit system?",
        answer: "When you cancel an order or shipping, or when we process a refund, instead of returning money to your payment method, we add credits to your Aiyu Japan account balance. These credits are in Japanese Yen (¥) and can be used for future purchases or shipments."
      },
      {
        question: "How do I earn credits?",
        answer: "You receive credits in these situations:\n\n• Order cancellation: If you cancel an order that was already paid, the amount is returned as credits\n• Shipping cancellation: If you cancel a shipping that was paid, the amount becomes credits\n• Refunds: If there's an issue with your order and we process a refund, you receive it as credits\n• Overcharges: If you were charged more than the final cost, the difference is returned as credits\n\nAll credit movements are logged and visible in your account."
      },
      {
        question: "How can I use my credits?",
        answer: "Credits can be used in two ways:\n\n1️⃣ For Shopping Agent Orders:\n   - When submitting a product request, check the 'Use my credits for this order' option\n   - Choose to use all your credits or a custom amount\n   - Credits will be deducted from the final quoted price\n\n2️⃣ For International Shipping:\n   - When requesting a shipping quote, check 'Use my credits for this shipping'\n   - Choose to use all your credits or specify an amount\n   - Credits reduce your shipping cost\n\nYou can see your available balance in the top menu of your dashboard."
      },
      {
        question: "Where can I see my credit balance?",
        answer: "Your credit balance is always visible:\n\n✅ Top menu: Next to your name, you'll see 'Credit: ¥X,XXX'\n✅ Hover tooltip: Shows 'You have ¥X,XXX in credit from order cancellations or refunds'\n✅ When submitting orders: The system shows your available balance\n✅ When requesting shipping: Your balance appears in the quote form\n\nThe balance updates automatically when you use credits or receive new ones."
      },
      {
        question: "Can I use partial credits?",
        answer: "Yes! You have full flexibility:\n\n• Use ALL credits: Select 'Use all credits' and your entire balance will be applied\n• Use CUSTOM amount: Enter any amount up to your available balance\n• Save credits: You don't have to use them - credits never expire\n\nExample: If you have ¥10,000 in credits and your order costs ¥15,000, you can:\n- Use all ¥10,000 and pay only ¥5,000, OR\n- Use ¥7,000 and pay ¥8,000, keeping ¥3,000 for later"
      },
      {
        question: "Do credits expire?",
        answer: "NO! Your credits NEVER expire. They remain in your account indefinitely until you choose to use them.\n\nBenefits:\n✓ No time pressure to use them\n✓ Accumulate credits from multiple cancellations\n✓ Save them for a large future purchase\n✓ Use them strategically when you need them most"
      },
      {
        question: "Can I withdraw credits as cash?",
        answer: "No, credits cannot be withdrawn or converted to cash. They exist exclusively as store credit within the Aiyu Japan platform.\n\nHowever, they offer significant value:\n• Reduce costs on future orders\n• Make shipping more affordable\n• No fees when using them\n• Instant application to your purchases\n• Never expire\n\nThey work like a prepaid balance for your Aiyu Japan purchases."
      },
      {
        question: "What happens if I request more credits than needed?",
        answer: "The system is smart and protects you:\n\n⚠️ If you request to use ¥10,000 in credits but your final quote is only ¥7,000:\n- We'll ONLY USE ¥7,000 of your credits\n- The remaining ¥3,000 stays in your balance\n- You won't be charged anything (order is fully covered)\n\n⚠️ If you request ¥5,000 but the final cost is ¥8,000:\n- We'll use all ¥5,000 of your credits\n- You'll only pay the remaining ¥3,000\n\nYou're always protected - we never use more credits than necessary!"
      },
      {
        question: "Can I combine credits with regular payment?",
        answer: "Absolutely! This is the most common use case:\n\n💳 Example 1: Order of ¥20,000\n   - You have ¥8,000 in credits\n   - Use all ¥8,000 credits\n   - Pay remaining ¥12,000 with card\n\n💳 Example 2: Shipping of ¥15,000\n   - You have ¥12,000 in credits\n   - Use ¥10,000 credits (save ¥2,000)\n   - Pay remaining ¥5,000 with card\n\nThe payment link you receive will already have the credit discount applied!"
      },
      {
        question: "Are there any restrictions on using credits?",
        answer: "Very few restrictions:\n\n✅ Can use on Shopping Agent orders\n✅ Can use on international shipping\n✅ No minimum amount required\n✅ No maximum usage limit\n✅ No expiration date\n✅ Can use partial amounts\n\n❌ Cannot use for:\n- Japanese Address/Locker service fees (¥1,000 per box) - these must be paid in advance\n- Cannot be transferred to another user\n- Cannot be withdrawn as cash\n\nEssentially, credits work for the two main cost areas: purchasing products and shipping them!"
      }
    ]
  }
};

export const helpArticlesES: HelpData = {
  howItWorks: {
    title: "¿Cómo funciona Aiyu Japan?",
    description: "Aiyu Japan es un servicio Proxy japonés que te ayuda a comprar productos desde Japón y ofrece envío internacional a todo el mundo.",
    faqs: [
      {
        question: "¿Qué es Aiyu Japan?",
        answer: "Aiyu Japan es una empresa de servicio Proxy japonés que ayuda a los usuarios a comprar productos desde Japón y ofrece envío internacional a todo el mundo sin excepcion! A diferencia de otros servicios proxy que agregan tarifas ocultas o cargos extra después de la compra del producto, Aiyu Japan ofrece una única tarifa transparente que ya incluye serivicios extras como almacenamiento de tiempo ilimitado, consolidación de sus compras y solicitud de fotografias basica, ademas de una atencion personalizada si necesita el usuario!"
      },
      {
        question: "¿Cómo funciona el proceso básico?",
        answer: "1. Encuentra tu artículo en tu tienda japonesa favorita (Uniqlo, Pokémon Center, Animate, Amazon Japan, etc.)\n\n2. Copia el enlace del producto (URL)\n\n3. Subelo a tu cuenta a traves del formulario!\n\n4. Verificamos disponibilidad y te lo cotizamos\n\n5. Si esta de acuerdo, paga la factura que le llegara luego.\n\n6. Sus compras llegan a nuestro almacen en Osaka!\n\n7. Eliges el método de envío que mas te guste y espera por tu paquete!"
      },
      {
        question: "¿Necesito saber japonés?",
        answer: "No, no es necesario. Nuestro servicio está completamente disponible en español e inglés. Si necesitas que compremos por ti, solo envíanos el enlace del producto y nosotros nos encargamos de todo. También proporcionamos traducciones si es necesario. Ademas te recomendamos traducir la pagina Japonesa con el traductor de tu navegador."
      },
      {
        question: "¿Puedo comprar de cualquier tienda japonesa?",
        answer: "Podemos comprar de la mayoría de tiendas online japonesas como Amazon JP, Rakuten, Yahoo Auctions, Mercari, Suruga-ya, Mandarake, Animate, y muchas más. Algunas tiendas muy específicas pueden tener restricciones. Contáctanos si tienes dudas sobre una tienda en particular."
      },
      {
        question: "¿Cuánto tiempo tarda el proceso completo?",
        answer: "Desde la compra hasta la entrega:\n\n• Procesamiento de compra: algunas horas a 2 días\n• Entrega al almacén de Osaka: 3-5 días\n• Procesamiento y consolidación: 1-3 días (opcional)\n• Envío internacional: 15-25 días (Económico), 4-10 días (EMS), 2-5 días (DHL Express), o 3 meses hábiles (Envío Marítimo para Paraguay/Perú/USA)\n\nTotal desde el momento de la compra: 2-3 semanas con envío express, 1 mes con envío económico, o 3-4 meses con envío marítimo."
      }
    ]
  },
  whereToBuy: {
    title: "¿Dónde comprar?",
    description: "Accede a las mejores tiendas online y mercados de Japón. Compramos en tu nombre desde cualquiera de estas plataformas.",
    faqs: [
      {
        question: "¿Qué tiendas online son compatibles?",
        answer: "Trabajamos con:\n\n• <a href='https://www.amazon.co.jp/' target='_blank' rel='noopener noreferrer' style='color: #f97316; text-decoration: underline;'>Amazon Japan</a>\n• <a href='https://www.rakuten.co.jp/' target='_blank' rel='noopener noreferrer' style='color: #f97316; text-decoration: underline;'>Rakuten</a>\n• <a href='https://auctions.yahoo.co.jp/' target='_blank' rel='noopener noreferrer' style='color: #f97316; text-decoration: underline;'>Yahoo! Auctions Japan</a>\n• <a href='https://shopping.yahoo.co.jp/' target='_blank' rel='noopener noreferrer' style='color: #f97316; text-decoration: underline;'>Yahoo! Shopping Japan</a>\n• <a href='https://jp.mercari.com/' target='_blank' rel='noopener noreferrer' style='color: #f97316; text-decoration: underline;'>Mercari</a>\n• <a href='https://www.suruga-ya.com/' target='_blank' rel='noopener noreferrer' style='color: #f97316; text-decoration: underline;'>Suruga-ya</a>\n• <a href='https://order.mandarake.co.jp/' target='_blank' rel='noopener noreferrer' style='color: #f97316; text-decoration: underline;'>Mandarake</a>\n• <a href='https://www.animate-onlineshop.jp/' target='_blank' rel='noopener noreferrer' style='color: #f97316; text-decoration: underline;'>Animate Online Shop</a>\n• <a href='https://www.amiami.com/' target='_blank' rel='noopener noreferrer' style='color: #f97316; text-decoration: underline;'>AmiAmi</a>\n• <a href='https://goodsmileshop.com/' target='_blank' rel='noopener noreferrer' style='color: #f97316; text-decoration: underline;'>Good Smile Online</a>\n• <a href='https://www.pokemoncenter-online.com/' target='_blank' rel='noopener noreferrer' style='color: #f97316; text-decoration: underline;'>Pokémon Center</a>\n• <a href='https://www.cdjapan.co.jp/' target='_blank' rel='noopener noreferrer' style='color: #f97316; text-decoration: underline;'>CD Japan</a>\n• ¡Y muchas más!"
      },
      {
        question: "¿Puedo comprar en subastas de Yahoo Auctions?",
        answer: "No, lastimosamente nuestro sistema actual no soporta las ventas en subastas, solamente actuamos como intermediario de compras directas de productos, esperamos que en un futuro las subastas esten integradas!"
      },
      {
        question: "¿Pueden comprar en tiendas físicas?",
        answer: "¡Sí! Ofrecemos servicio de compra presencial en Osaka. Tarifa: ¥1,500 por visita (incluye hasta 1 hora en tienda). Esto es perfecto para artículos solo disponibles en tiendas físicas. Contáctanos a través de nuestras redes sociales o por correo electronico para coordinar."
      },
      {
        question: "¿Puedo comprar productos de segunda mano?",
        answer: "Sí, puedes comprar productos usados de Mercari, Yahoo shopping, Hard Off, Book Off, Mandarake, Suruga-ya y otras tiendas de segunda mano! A eso nos dedicamos!!"
      },
      {
        question: "¿Hay tiendas con las que no trabajen?",
        answer: "Algunas tiendas tienen políticas estrictas contra servicios proxy:\n\nExisten algunas tiendas donde comprar sus productos puede que no sea posible debido a que no trabajan con proxys, es decir por licencias no pueden enviar sus productos al exterior, ademas no participamos en eventos de productos donde solo 1 unidad puede ser conseguido por persona."
      }
    ]
  },
  pricing: {
    title: "Tarifas y Costos",
    description: "Transparencia total en nuestros precios. Sin tarifas ocultas, sin sorpresas.",
    faqs: [
      {
        question: "¿Cuánto cuesta el registro?",
        answer: "El registro es completamente GRATUITO. No hay costos de membresía ni tarifas mensuales. Solo pagas cuando usas el servicio."
      },
      {
        question: "¿Cuáles son las tarifas de servicio?",
        answer: "Servicio de Shopping Agent:\n\n• Artículos hasta ¥10,000 de valor: ¥500 por artículo\n• Artículos sobre ¥10,000 de valor: ¥1,000 por artículo\n\nServicio de Dirección Japonesa/Casillero:\n• ¥1,000 por caja recibida\n\nImportante: Los pedidos de Shopping Agent pueden consolidarse e incluyen todos los beneficios premium. Las cajas del servicio de casillero también pueden consolidarse junto a los de Shopping Agent."
      },
      {
        question: "¿Qué incluye el servicio de Shopping Agent y Casillero?",
        answer: "La tarifa de servicio de ¥500-¥1,000 incluye:\n\n✓ Búsqueda de producto y procesamiento de compra\n✓ Almacenamiento ilimitado gratis\n✓ Consolidación gratuita con otros paquetes\n✓ Solicitud de fotos gratis\n✓ Empaque estándar o doble\n✓ Soporte privado para tus pedidos\n\n¡Todo esto incluido en una tarifa transparente!"
      },
      {
        question: "¿Qué incluye el servicio de Casillero?",
        answer: "La tarifa de servicio de ¥1,000 por paquete incluye:\n\n✓ Almacenamiento ilimitado gratis\n✓ Consolidación gratuita con otros paquetes\n✓ Soporte privado para tus pedidos"
      },
      {
        question: "¿Cómo se calcula el envío internacional?",
        answer: "El costo de envío es variable por pais, se calcula en base a estos puntos:\n\n• Peso real del paquete\n• Peso volumétrico (Largo × Ancho × Alto / 5000) para envío aéreo de DHL o ciertos paises (Ej: Paraguay)\n• País de destino\n• Método de envío (Si es Económico, EMS, DHL, UPS, Maritimo)\n\nEn el caso de DHL y envios a Paraguay aereo usamos el que sea MAYOR entre peso real y volumen de su caja. Puedes usar nuestra calculadora de envío para estimaciones."
      },
      {
        question: "¿Hay costos ocultos o adicionales?",
        answer: "NO hay costos ocultos.\n\nLos únicos costos son en Shopping Agent:\n\n1. Precio del producto + Tarifa Aiyu Japan\n\n2. Envío doméstico en Japón (de la tienda a nuestro almacén si es que hay)\n\n3. Envío internacional a su pais\n\n\n\nLos únicos costos son en servicio Casillero:\n\n1. Tarifa Aiyu Japan\n\n2. Envío internacional a su pais\n\nIMPORTANTE: Los impuestos de importación de tu país NO están incluidos, esto es responsabilidad del usuario poder averiguar con antelacion si es que lo necesita."
      },
      {
        question: "¿Aceptan descuentos o cupones de tiendas?",
        answer: "No, al ser Aiyu Japan una entidad empresarial, las tiendas no aceptan cupones o descuentos especificos dados por un tercero."
      },
      {
        question: "¿Qué pasa con artículos de compra limitada?",
        answer: "Para artículos con límites de compra (1-3 unidades por cliente), se aplicará la ley \"First come first serve\" en caso de que el X item no haya sido reclamado por algun ususario antes, ademas se sumara un cargo extra de ¥1,000 por artículo además de la tarifa normal de servicio."
      }
    ]
  },
  steps: {
    title: "Pasos del Servicio",
    description: "Guía completa del proceso desde el registro hasta recibir tus productos.",
    faqs: [
      {
        question: "Paso 1: ¿Cómo me registro?",
        answer: "1. Haz clic en 'Registrarse' en https://aiyujapan.com\n2. Completa el formulario con tu email y contraseña\n3. Verifica tu email (revisa spam si no lo ves)\n4. Completa tu perfil con tu dirección de envío completa\n5. ¡Listo! Recibirás tu código de cliente único"
      },
      {
        question: "Paso 2: ¿Cómo obtengo mi dirección japonesa?",
        answer: "Después de registrarte, ve a 'Mi Cuenta' > 'Dirección Japonesa'. Verás tu dirección completa con tu código único (ej: AJ00123). Esta dirección es SOLO para envíos domésticos dentro de Japón cuando uses nuestro Servicio de Casillero. Siempre usa tu código en el campo de nombre cuando compres directamente."
      },
      {
        question: "Paso 3: ¿Cómo solicito una compra?",
        answer: "Hay dos formas:\n\nA) Servicio de Shopping Agent (Recomendado): Ve a 'Solicitar Compra' > pega el enlace del producto > especifica cantidad y variantes > y envialo! Nosotros te responderemos luego en breve con la factura de pago!\n\nB) Dirección Japonesa/Casillero: Compra tú mismo y envía a nuestra dirección japonesa. Cuesta ¥1,000 por caja recibida, pueden consolidarse junto a los de Shopping Agent."
      },
      {
        question: "Paso 4: ¿Qué pasa cuando llega al almacén?",
        answer: "1. Recibimos tu paquete en 12-48 horas como maximo desde su llegada\n\n2. Lo registramos en tu cuenta\n\n3. Lo pesamos y medimos!\n\n4. Recibes un email automatic solamente cuando todas tus compras de una orden hayan llegado!\n\n5. Tienes acceso a solicitar el envio internacional de tus pedidos!\n\nAclaracion: En caso no solicitar envio internacional, el paquete permanecera almacenado con nosotros."
      },
      {
        question: "Paso 5: Como funciona la consolidacion y envio internacional?",
        answer: "Si tienes múltiples paquetes en el almacén:\n\n1. Espera a que lleguen todos tus paquetes (o los que quieras consolidar)\n\n2. Ve a 'Almacén' > Selecciona los paquetes que quieras enviar\n\n3. Haz clic en 'Solicitar Cotización de Envío'\n\n4- Elige el metodo de envio que mas te convega\n\n5- Rellena tu informacion precisa de envio, como nombre, direccion, tax ID etc.\n\n5. Lo procesamos y te notificaremos con la factura de pago final\n\n6. ¡Listo para enviar!\n\nNota: En caso de que haya un problema con las medidas o el peso, su solicitud de envio sera rechazada, y se le pedira cambiar a un metodo de envio que se ajuste a sus necesidades."
      }
    ]
  },
  services: {
    title: "Servicios Incluidos",
    description: "Todos los servicios disponibles para facilitar tus compras desde Japón.",
    faqs: [
      {
        question: "¿Qué incluye el servicio de almacén?",
        answer: "Incluye:\n✓ Recepción ilimitada de paquetes\n✓ Fotos gratis para pedidos Shopping Agent\n✓ Inspección visual básica\n✓ Almacenamiento ilimitado gratis\n✓ Notificaciones por email\n✓ Protección de paquetes en almacén seguro\n✓ Seguro básico contra daños en almacén"
      },
      {
        question: "¿Qué es la consolidación y cómo ayuda?",
        answer: "La consolidación combina múltiples paquetes en uno solo. Beneficios:\n\n✓ Ahorro significativo en envío internacional\n✓ Menos riesgo de pérdida\n✓ Un solo número de tracking\n✓ Procesamiento aduanero más simple\n✓ Podemos remover empaques innecesarios para reducir peso\n\nIdeal cuando compras de múltiples vendedores. Disponible para todos los paquetes en tu almacén."
      },
      {
        question: "¿Ofrecen inspección de productos?",
        answer: "Sí, ofrecemos inspección:\n\n1) Inspección básica (GRATIS para Shopping Agent): Verificamos que el paquete esté sellado y no dañado externamente\n\n2) Puedes solicitar fotos adicionales (gratis para pedidos Shopping Agent) para verificar condición, detalles y contenidos."
      },
      {
        question: "¿Pueden remover empaques para reducir peso?",
        answer: "Sí, ofrecemos servicio de remoción de empaque GRATIS para pedidos Shopping Agent. Podemos:\n- Remover cajas externas de productos con caja interior\n- Eliminar rellenos innecesarios\n- Descartar embalaje excesivo\n\nEsto reduce peso y costo de envío. Siempre mantenemos protección adecuada del producto."
      },
      {
        question: "¿Qué métodos de envío ofrecen?",
        answer: "Ofrecemos múltiples opciones:\n\n• Económico/Estándar (Airmail): 15-21 días, tracking básico\n• EMS (Express Mail Service): 4-10 días, tracking completo, confiable\n• DHL Express: 2-5 días, muy rápido, tracking completo\n• Paraguay Especial: Aiyu Japan Express, 12-14 días\n• Envío Marítimo: 3 meses hábiles, sale una vez al mes (solo Paraguay y Perú)\n\nLa disponibilidad depende del destino y peso."
      },
      {
        question: "¿Ofrecen seguro para envíos?",
        answer: "Sí:\n- EMS y DHL incluyen seguro básico automático\n- Puedes comprar seguro adicional al enviar\n- Cobertura de hasta 200,000 JPY\n- Recomendado para artículos de alto valor (figuras, electrónicos, coleccionables)\n\nNota: El seguro no está disponible actualmente para Paraguay."
      }
    ]
  },
  firstSteps: {
    title: "Primeros Pasos",
    description: "Guía rápida para nuevos usuarios. Empieza a usar Aiyu Japan hoy.",
    faqs: [
      {
        question: "Soy nuevo, ¿por dónde empiezo?",
        answer: "Sigue estos pasos:\n1. Regístrate en la web (5 minutos)\n2. Verifica tu email\n3. Completa tu dirección de envío en 'Perfil'\n4. Anota tu código de cliente\n5. ¡Haz tu primera compra!\n\nTip: Empieza con algo pequeño y económico para familiarizarte con el proceso."
      },
      {
        question: "¿Qué información necesito proporcionar?",
        answer: "Para registrarte:\n- Email válido\n- Contraseña segura\n- Nombre completo\n- Dirección de envío completa (con código postal)\n- Número de teléfono\n- ID fiscal (RFC, CUIL, VAT o similar - importante para la entrega)\n\nPara compras:\n- Enlace del producto o descripción detallada\n- Variante/talla/color si aplica\n- Presupuesto máximo"
      },
      {
        question: "¿Cómo hago mi primera compra?",
        answer: "Método recomendado para principiantes:\n\n1. Encuentra un producto en Amazon Japan (más fácil)\n2. Copia el enlace completo\n3. Ve a 'Solicitar Compra' en tu panel\n4. Pega el enlace\n5. Especifica cantidad\n6. Confirmamos precio + comisión (5-10%)\n7. Pagas y compramos por ti\n8. Te notificamos cuando llegue al almacén"
      },
      {
        question: "¿Cuál es la diferencia entre Shopping Agent y Dirección Japonesa?",
        answer: "Servicio de Shopping Agent (¥500-¥1,000 o 5-10% del precio/artículo):\n• Compramos por ti\n• Incluye almacenamiento ilimitado, consolidación, fotos\n• Puedes combinar múltiples pedidos\n• Beneficios premium completos\n\nDirección Japonesa/Casillero (¥1,000/paquete recibido):\n• Compras tú mismo\n• Envías a nuestra dirección\n• Pueden consolidarse junto a los de Shopping Agent\n• Almacenamiento ilimitado\n\n¡Para mejor valor y flexibilidad, usa Shopping Agent!"
      },
      {
        question: "¿Cuánto tiempo toma mi primera compra?",
        answer: "Timeline típica:\n- Solicitud → Compra: 1-2 días\n- Tienda → Almacén: 3-7 días\n- Almacén → Consolidación: 1-3 días (opcional)\n- Japón → Tu país (EMS): 4-10 días\n\nTotal: Aproximadamente 2-3 semanas\n\nTe actualizamos en cada paso del proceso."
      },
      {
        question: "Consejos para principiantes",
        answer: "✓ Empieza con Amazon Japan (más fácil y confiable)\n✓ No compres artículos prohibidos (revisa la lista)\n✓ Aprovecha el almacenamiento ilimitado gratis para consolidar\n✓ Usa envío Económico para artículos no urgentes y ahorrar dinero\n✓ Siempre declara el valor real en aduanas\n✓ Únete a nuestra comunidad de Discord para consejos\n✓ Lee las FAQ antes de comprar\n✓ Contáctanos si tienes alguna duda"
      }
    ]
  },
  orders: {
    title: "Gestión de Pedidos",
    description: "Todo sobre cómo gestionar y rastrear tus pedidos en Aiyu Japan.",
    faqs: [
      {
        question: "¿Cómo solicito que compren por mí?",
        answer: "1. Ve a 'Solicitar Compra'\n2. Pega el enlace URL del producto\n3. Especifica cantidad, color, talla, etc.\n4. Añade notas especiales si necesitas\n5. Te enviamos una cotización en 1-24 horas\n6. Si aceptas, compramos inmediatamente\n7. Puedes seguir el progreso luego en la sección de 'Pedidos'"
      },
      {
        question: "¿Qué significan los estados de pedido?",
        answer: "• Solicitado: Estamos revisando disponibilidad y costos de tu pedido\n• Esperando Pago: Cotización emitida, esperando su aprobacion y pago.\n• Pagado: Pago recibido, compraremos pronto!\n• Algunos Comprados: Algunos artículos comprados, otros pendientes de comprar\n• Todos Comprados: Todos los artículos comprados\n• En Tránsito: Pedido comprado y enviado en camino al almacen\n• Todos en Almacén: Todos los artículos recibidos y listos\n• Enviado: En camino hacia ti!"
      },
      {
        question: "¿Puedo cancelar un pedido?",
        answer: "Generalmente un pedido NO puede ser cancelado, pero depende del estado:\n\n✅ Solicitado/Esperando Pago: Cancelación permitida\n✅  Pagado (aún no comprado): Posible reembolso pero con creditos a su favor para una futura compra.\n❌ Comprado: No se pueden procesar reembolsos ni cambios.\n❌ En Tránsito/Almacén: No se pueden procesar reembolsos ni cambios.\n\nContacta a soporte lo antes posible si necesitas cancelar."
      },
      {
        question: "¿Qué pasa si el producto está agotado?",
        answer: "Si el producto se agota después de tu solicitud y pago:\n\n1. Te notificamos inmediatamente traves del sistema de cancelacion.\n\n2. Sera acreditado a su cuenta el monto original + la tarifa de servicio por ese producto.\n\n4. Podra usar este credito a su favor para otras compras que tenga, solo debe seleccionar al subir los nuevos links URL cuanto de su credito desea utilizar.\n\nPara evitar cancelaciones o rechazos de pedidos, favor pagar la factura enviada a usted lo antes posible."
      },
      {
        question: "¿Puedo modificar un pedido después de solicitarlo?",
        answer: "Antes de comprar: Sí, en la orden que subio, si lo abre, tiene una opcion de editar pedido y volverlo a enviar.\n\nTambien, si su pedido es rechazado por el staff desde un principio, tendra la opcion de editarlo agregar o quitar productos que ya haya subido.\n\nPor eso es importante revisar cuidadosamente antes de aprobar."
      }
    ]
  },
  warehouse: {
    title: "Gestión de Almacén",
    description: "Cómo funciona tu almacén personal en Japón y todas las opciones disponibles.",
    faqs: [
      {
        question: "¿Qué es mi dirección Japonesa?",
        answer: "Es nuestro servicio de casillero: El usuario manda los paquetes que quiera a nuestra direccion en Japon, en donde nosotros nos hacemos cargo de la recepcion, consolidacion, cuidado,almacen y envoi a su pais!\n\nLa direccion de nuestro almacen se encuentra en el apartado de \"Account\" donde vera\n• Su Nombre al que debe ser etiquetado el paquete\n• Tu código único de usuario (ej: AJ00123)\n• Dirección completa en formato japonés y romanji\n• Número de teléfono del almacén\n\nObservacion: Siempre debes incluir tu codigo de usuario en la direccion postal, asi tu paquete sera recepcionado e identificado lo antes posible y evitas demoras."
      },
      {
        question: "¿Cuánto tiempo puedo almacenar mis paquetes?",
        answer: "¡Almacenamiento tiempo ilimitado gratis para todos los servicios!\n\nSin límites de tiempo, sin cargos extra. Puedes consolidar múltiples paquetes y enviar cuando estés listo.\n\nNota: Recomendamos enviar en un tiempo razonable para evitar depreciación del producto."
      },
      {
        question: "¿Cómo funciona la consolidación?",
        answer: "La consolidación consiste en reunir todos tus paquetes individuales en una sola caja antes del envío. Esto incluye eliminar embalajes innecesarios (cajas extra, cartones, relleno) sin comprometer la protección de tus productos.\n\nEjemplo práctico:\nEl usuario 0001 compró en Mercari, Amazon y Adidas → 3 cajas separadas, 2.500 g en total → envío estimado: $100 USD.\nCon consolidación, los 3 paquetes se unen en una sola caja → envío final: $40 USD.\nAhorro: hasta un 60% del costo original."
      },
      {
        question: "¿Qué fotos recibo de mis paquetes?",
        answer: "Solamente el servicio de Shopping agent cuenta con servicio de fotografia basica del paquete y su interior!\n\nEsto se puede adquriir por el momento solo consultando a un staff al privado, redes sociales, o correo electronico.\n\nEsto incluye si el cliente pide:\n• Fotos del paquete externo\n• Fotos del paquete abierto\n• Fotos del contenido\n\nPara Servicio de Casillero:\n\n• Fotos disponibles bajo solicitud (tiene costo adicional)\n\nPuedes solicitar ángulos específicos, primeros planos o medidas en cualquier momento."
      },
      {
        question: "¿Puedo solicitar inspección detallada?",
        answer: "No, por el momento Aiyu Japan no ofrece inspeccion detallada gratuita de sus paquetes, esto requiere una atencion muy personalizada que costaria un costo adicional.\n\nLa inspeccion detallada incluye:\n\n✓ Abrimos paquetes\n✓ Verificamos que el producto coincida con la descripción\n✓ Revisamos defectos, rasguños, daños\n✓ Tomamos fotos detalladas\n✓ Verificamos accesorios incluidos\n✓ Test básico de funcionamiento (para electrónicos)\n\nFavor consultar con un staff a cargo para cotizacion."
      }
    ]
  },
  customs: {
    title: "Aduanas e Impuestos",
    description: "Información crucial sobre aduanas, declaraciones e impuestos de importación.",
    faqs: [
      {
        question: "¿Tendré que pagar impuestos en mi país?",
        answer: "Probablemente SÍ, si tu paquete supera el valor mínimo de tu país, te recomendamos investigar el porcentaje de impuestos sobre tu compra internacional.\n\nHay paises donde pasan desapercibidos, pero siempre tienes que estar preparado.\n\n\n\nAqui te dejamos algunos ejemplos\n\n🌎 América del Norte\n\nPaís | Umbral | Notas\n🇺🇸 EE.UU. | Sin exención | Desde agosto 2025, todos los envíos pagan aranceles, sin importar el valor (antes era $800 USD)\n🇨🇦 Canadá | ~$20 CAD | Umbral muy bajo; casi todos los paquetes pagan aranceles + GST\n🇲🇽 México | ~$50 USD (USMCA) / ~$1 USD (otros) | Desde 2025, compras desde Japón tienen umbral casi nulo\n\n\n\n🌎 América del Sur\n\nPaís | Umbral | Notas\n🇦🇷 Argentina | $50 USD/mes | 50% de impuesto sobre el valor que exceda el límite; máx. $1.000 USD/año\n🇧🇷 Brasil | Sin exención real | Todas las compras pagan impuestos: ~40% en compras bajo $50 USD, ~90% en compras sobre $50 USD\n🇨🇱 Chile | Sin exención desde oct. 2025 | Compras hasta $500 USD pagan 19% IVA. Sobre $500 USD: 6% arancel + 19% IVA\n🇨🇴 Colombia | $200 USD | Envíos personales desde fuera de EE.UU. pueden tener umbral $0\n🇵🇪 Perú | ~$200 USD | Compras por encima pagan 19% IGV + aranceles variables\n🇺🇾 Uruguay | ~$200 USD | Sobre el umbral aplican IVA (22%) y aranceles\n🇵🇾 Paraguay | ~$100 USD | Impuestos aplicables sobre ese monto\n🇧🇴 Bolivia | Sin exención | Todos los paquetes internacionales pagan impuestos\n🇪🇨 Ecuador | Sin exención práctica | Aplica IVA (15%) + ISD (5%) sobre divisas + aranceles\n🇵🇦 Panamá | ~$100 USD | ITBMS (7%) + aranceles sobre el exceso\n🇩🇴 Rep. Dominicana | ~$200 USD | ITBIS (18%) + aranceles sobre el exceso\n\n\n\n🌍 Europa\n\nPaís/Región | Umbral | Notas\n🇪🇺 UE (España, Francia, Alemania, Italia, etc.) | €150 | IVA siempre aplica. Desde jul. 2026: €3 adicional por ítem bajo €150\n🇬🇧 Reino Unido | £135 | IVA siempre aplica; aranceles sobre el exceso\n\n\n\n⚠️ Importante: Los impuestos de importación no están incluidos en nuestro servicio. Las regulaciones cambian frecuentemente — te recomendamos verificar con la aduana de tu país antes de realizar tu pedido."
      },
      {
        question: "¿Qué documentos necesito para aduanas?",
        answer: "En el caso de que Aduana de tu pais te solicite documentos de tu producto, en cada orden que hayas subido a nuestra web, cuentas con un enlace que lleva a la factura de pago, en ella solo lo descargas como PDF y puedes utilizarlo para declarar tu compra."
      },
      {
        question: "¿Algunos productos tienen restricciones especiales?",
        answer: "Sí, productos que frecuentemente requieren permisos:\n\n⚠️ Baterías de litio: Restricciones de envío aéreo (máx 2 por envío) (algunos paises lo prohiben completamente su envio desde Japon, consulte su pais con las reglas especificas)\n\n⚠️ Alimentos: Certificados sanitarios\n⚠️ Medicamentos: Receta médica obligatoria\n⚠️ Cosméticos: Límites de cantidad\n⚠️ Electrónicos: Certificaciones de tu país\n⚠️ Cuchillos/espadas: Permisos especiales\n⚠️ Líquidos/Aerosoles: No pueden enviarse por aire\n\nRevisa la sección de 'Objetos Prohibidos' antes de comprar."
      }
    ]
  },
  credits: {
    title: "Sistema de Créditos",
    description: "Cómo usar y gestionar tus créditos provenientes de cancelaciones y devoluciones.",
    faqs: [
      {
        question: "¿Cómo obtengo créditos?",
        answer: "Recibes créditos en estas situaciones:\n\n• Cancelación de pedido: Si cancelas un pedido que ya estaba pagado, el monto se retorna como créditos\n• Cancelación de envío: Si cancelas un envío que estaba pago, el monto se convierte en créditos\n• Devoluciones: Si hay un problema con tu pedido y procesamos un reembolso, lo recibes como créditos (Obligatorio: para reclamar esto, debe haber una prueba de video del unboxing/apertura de su paquete)\n• Sobrecargos: Si te cobramos más que el costo final, la diferencia se retorna como créditos\n\nTodos los movimientos de crédito quedan registrados y visibles en tu cuenta."
      },
      {
        question: "¿Cómo puedo usar mis créditos?",
        answer: "Los créditos se pueden usar de dos formas:\n\n1️⃣ Para Pedidos de Shopping Agent:\n   - Al enviar una solicitud de producto, marca la opción 'Usar mis créditos para este pedido'\n   - Elige usar todos tus créditos o un monto personalizado\n   - Los créditos se descontarán del precio final cotizado\n\n2️⃣ Para Envíos Internacionales:\n   - Al solicitar cotización de envío, marca 'Usar mis créditos para este envío'\n   - Elige usar todos tus créditos o especifica un monto\n   - Los créditos reducen el costo de tu envío\n\nPuedes ver tu saldo disponible en el menú superior de tu panel."
      },
      {
        question: "¿Dónde puedo ver mi saldo de créditos?",
        answer: "Tu saldo de créditos siempre está visible:\n\n✅ Menú superior: Al lado de tu nombre, verás 'Crédito: ¥X,XXX'\n✅ Tooltip al pasar el cursor: Muestra 'Tienes ¥X,XXX de crédito a tu favor por cancelación o devolución de pedidos'\n✅ Al enviar pedidos: El sistema muestra tu saldo disponible\n✅ Al solicitar envío: Tu saldo aparece en el formulario de cotización\n\nEl saldo se actualiza automáticamente cuando usas créditos o recibes nuevos."
      },
      {
        question: "¿Puedo usar créditos parciales?",
        answer: "¡Sí! Tienes total flexibilidad:\n\n• Usar TODOS los créditos: Selecciona 'Usar todos los créditos' y se aplicará todo tu saldo\n• Usar monto PERSONALIZADO: Ingresa cualquier monto hasta tu saldo disponible\n• Guardar créditos: No tienes que usarlos - los créditos nunca expiran\n\nEjemplo: Si tienes ¥10,000 en créditos y tu pedido cuesta ¥15,000, puedes:\n- Usar todos los ¥10,000 y pagar solo ¥5,000, O\n- Usar ¥7,000 y pagar ¥8,000, guardando ¥3,000 para después"
      },
      {
        question: "¿Los créditos expiran?",
        answer: "¡NO! Tus créditos NUNCA expiran. Permanecen en tu cuenta indefinidamente hasta que decidas usarlos.\n\nBeneficios:\n✅ Sin presión de tiempo para usarlos\n✅ Acumula créditos de múltiples cancelaciones\n✅ Guárdalos para una compra grande futura\n✅ Úsalos estratégicamente cuando más los necesites"
      },
      {
        question: "¿Puedo retirar los créditos como efectivo?",
        answer: "No, los créditos no pueden retirarse ni convertirse en efectivo. Existen exclusivamente como saldo de tienda dentro de la plataforma Aiyu Japan.\n\nSin embargo, ofrecen un valor significativo:\n• Reducen costos en futuros pedidos\n• Hacen los envíos más accesibles\n• Sin comisiones al usarlos\n• Aplicación instantánea a tus compras\n• Nunca expiran\n\nFuncionan como un saldo prepago para tus compras en Aiyu Japan."
      },
      {
        question: "¿Qué pasa si solicito más créditos de los necesarios?",
        answer: "El sistema es inteligente y te protege:\n\n⚠️ Si solicitas usar ¥10,000 en créditos pero tu cotización final es solo ¥7,000:\n- SOLO USAREMOS ¥7,000 de tus créditos\n- Los ¥3,000 restantes quedan en tu saldo\n- No se te cobrará nada (el pedido está totalmente cubierto)\n\n⚠️ Si solicitas ¥5,000 pero el costo final es ¥8,000:\n- Usaremos todos tus ¥5,000 en créditos\n- Solo pagarás los ¥3,000 restantes\n\n¡Siempre estás protegido - nunca usamos más créditos de los necesarios!"
      },
      {
        question: "¿Puedo combinar créditos con pago regular?",
        answer: "¡Absolutamente! Este es el caso de uso más común:\n\n💳 Ejemplo 1: Pedido de ¥20,000\n   - Tienes ¥8,000 en créditos\n   - Usas todos los ¥8,000 en créditos\n   - Pagas los ¥12,000 restantes con tarjeta\n\n💳 Ejemplo 2: Envío de ¥15,000\n   - Tienes ¥12,000 en créditos\n   - Usas ¥10,000 en créditos (guardas ¥2,000)\n   - Pagas los ¥5,000 restantes con tarjeta\n\n¡El link de pago que recibas ya tendrá aplicado el descuento de los créditos!"
      },
      {
        question: "¿Hay alguna restricción al usar créditos?",
        answer: "Muy pocas restricciones:\n\n✅ Puedes usar en pedidos de Shopping Agent\n✅ Puedes usar en envíos internacionales\n✅ Sin monto mínimo requerido\n✅ Sin límite máximo de uso\n✅ Sin fecha de expiración\n✅ Puedes usar montos parciales\n\n❌ No puedes usar para:\n- Tarifas del servicio de Dirección Japonesa/Casillero (¥1,000 por caja) - estas deben pagarse por adelantado\n- No pueden transferirse a otro usuario\n- No pueden retirarse como efectivo\n\n¡Esencialmente, los créditos funcionan para las dos áreas de costo principales: comprar productos y enviarlos!"
      }
    ]
  }
};

const commonProhibitedItems = [
  "Oro, plata, oro blanco, otros metales preciosos, piedras preciosas, incluidos diamantes y piedras semipreciosas, monedas de todos los países (billetes y monedas), diversos artículos de joyería, otros objetos de valor",
  "Valores negociables",
  "Correspondencia y medios de comunicación definidos como correspondencia en la legislación vigente",
  "Animales vivos",
  "Restos corporales, placas conmemorativas y cenizas",
  "Objetos que pueden transubstanciarse o descomponerse fácilmente",
  "Explosivos de armas de fuego pequeñas y armas de fuego",
  "Sustancias explosivas",
  "Gas comprimido",
  "Líquidos y sólidos inflamables, sólidos combustibles",
  "Lámpara de flash",
  "Sustancias magnéticas",
  "Mercurio",
  "Ácidos y otras sustancias putrefactas, bases y ácidos",
  "Oxidantes",
  "Veneno",
  "Materiales radioactivos",
  "Materiales vaporizadores",
  "Artículos definidos como peligros para la aviación (de acuerdo con las Instrucciones Técnicas de la OACI y las Regulaciones sobre Mercancías Peligrosas de la IATA)",
  "Estupefacientes y psicofármacos según la definición de la Junta Internacional de Fiscalización de Estupefacientes, así como otras drogas ilícitas cuya exportación e importación están prohibidas",
  "Artículos obscenos e ilegales",
  "Artículos falsificados y ediciones pirateadas",
  "Objetos nocivos para los usuarios o el público en general; artículos que puedan contaminar o dañar la carga, las instalaciones de carga y la propiedad de terceros",
  "Explosivos y otros artículos peligrosos, elementos sucios que pueden dañar los paquetes de otros",
  "Artículos cuyo transporte está prohibido por ley",
  "Carga cuyo transporte, exportación o importación está prohibido o limitado por ley del gobierno del país exportador/importador, estado, municipio local y federación, incluido el país de tránsito",
  "Alimento",
  "Armas letales",
  "Elementos que contienen múltiples datos personales",
  "Tarjetas de crédito y efectivo",
  "Pasaporte",
  "Boletos de admisión a exámenes",
  "Conocimientos de embarque",
  "Productos animales",
  "Plantas (incluidos productos a base de hierbas)",
  "Materiales farmacológicos, medicamentos, muestras médicas (es decir, muestras de diagnóstico, sangre, muestras de tejido)",
  "Armas, armas, espadas, municiones y sus partes",
  "Líquidos",
  "Antigüedades, objetos de arte y artefactos",
  "Coleccionables y rarezas",
  "Diamantes industriales"
];

export const prohibitedItems = {
  "Argentina": {
    items: commonProhibitedItems
  },
  "Brasil": {
    items: commonProhibitedItems
  },
  "Chile": {
    items: [
      ...commonProhibitedItems,
      "⚡ RESTRICCIÓN ESPECÍFICA: Baterías de litio (prohibidas por vía aérea)"
    ]
  },
  "Colombia": {
    items: [
      ...commonProhibitedItems,
      "⚡ RESTRICCIÓN ESPECÍFICA: Baterías de litio (prohibidas)",
      "🍫 RESTRICCIÓN ESPECÍFICA: Cacao y productos derivados",
      "🥛 RESTRICCIÓN ESPECÍFICA: Productos lácteos",
      "🍬 RESTRICCIÓN ESPECÍFICA: Alimentos procesados y dulces"
    ]
  },
  "Costa Rica": {
    items: commonProhibitedItems
  },
  "Ecuador": {
    items: [
      ...commonProhibitedItems,
      "⚡ RESTRICCIÓN ESPECÍFICA: Baterías de litio - Máximo 2 unidades por paquete",
      "⚠️ RESTRICCIÓN ESPECÍFICA: Baterías de litio NO pueden enviarse por EMS (usar paquete pequeño certificado)"
    ]
  },
  "El Salvador": {
    items: [
      ...commonProhibitedItems,
      "⚡ RESTRICCIÓN ESPECÍFICA: Baterías de litio (prohibidas por vía aérea)",
      "🍯 RESTRICCIÓN ESPECÍFICA: Alimentos con azúcar o edulcorantes (confirmar con embajada: 03-6804-2177)"
    ]
  },
  "España": {
    items: commonProhibitedItems
  },
  "Francia": {
    items: [
      ...commonProhibitedItems,
      "🍿 RESTRICCIÓN ESPECÍFICA: Snacks y alimentos (prohibidos)"
    ]
  },
  "Alemania": {
    items: [
      ...commonProhibitedItems,
      "🍿 RESTRICCIÓN ESPECÍFICA: Alimentos solo permitidos si no tienen fines comerciales"
    ]
  },
  "Estados Unidos": {
    items: [
      ...commonProhibitedItems,
      "⚡ NOTA: Baterías de litio permitidas con documentación que declare que están integradas"
    ]
  },
  "Guatemala": {
    items: commonProhibitedItems
  },
  "Honduras": {
    items: commonProhibitedItems
  },
  "México": {
    items: [
      ...commonProhibitedItems,
      "🍿 RESTRICCIÓN ESPECÍFICA: Snacks y alimentos (prohibidos)",
      "💰 RESTRICCIÓN ESPECÍFICA: Artículos que superen 1,000 MXN de valor",
      "🎮 RESTRICCIÓN PRÁCTICA: Consolas de juegos (limitación de valor)",
      "📱 RESTRICCIÓN PRÁCTICA: Teléfonos celulares (limitación de valor)"
    ]
  },
  "Nicaragua": {
    items: commonProhibitedItems
  },
  "Panamá": {
    items: commonProhibitedItems
  },
  "Paraguay": {
    items: [
      ...commonProhibitedItems,
      "✈️ VÍA AÉREA: Baterías de litio (prohibidas - permitidas por vía marítima)",
      "✈️ VÍA AÉREA: Alimentos y snacks (prohibidos - permitidos por vía marítima)",
      "✈️ VÍA AÉREA: Productos químicos (prohibidos - permitidos por vía marítima)",
      "🚢 NOTA: Envío marítimo disponible - permite artículos restringidos en aéreo (excepto prohibidos legalmente)"
    ]
  },
  "Perú": {
    items: [
      ...commonProhibitedItems,
      "⚡ RESTRICCIÓN ESPECÍFICA: Baterías de litio (prohibidas por vía aérea)",
      "🍯 RESTRICCIÓN ESPECÍFICA: Alimentos con miel (confirmar con embajada: 03-3406-4243)"
    ]
  },
  "Puerto Rico": {
    items: [
      ...commonProhibitedItems,
      "⚡ NOTA: Baterías de litio permitidas con documentación que declare que están integradas"
    ]
  },
  "República Dominicana": {
    items: commonProhibitedItems
  },
  "Uruguay": {
    items: commonProhibitedItems
  },
  "Venezuela": {
    items: commonProhibitedItems
  },
  "Japón": {
    items: commonProhibitedItems
  },
  "China": {
    items: commonProhibitedItems
  },
  "Corea del Sur": {
    items: commonProhibitedItems
  }
};

export const allCountries = Object.keys(prohibitedItems).sort();

// Default export based on user's language preference
export const helpArticles = helpArticlesES; // Default to Spanish, can be changed based on context

// Shipping constraints by country
export const SHIPPING_CONSTRAINTS = {
  "US": {
    batteries: { allowed: true, notes: "Adjuntar documentos que declaren claramente que las baterías están integradas." },
    snacks: { allowed: true, notes: null },
    valueLimit: null
  },
  "Estados Unidos": {
    batteries: { allowed: true, notes: "Adjuntar documentos que declaren claramente que las baterías están integradas." },
    snacks: { allowed: true, notes: null },
    valueLimit: null
  },
  "France": {
    batteries: { allowed: true, notes: null },
    snacks: { allowed: false, notes: null },
    valueLimit: null
  },
  "Francia": {
    batteries: { allowed: true, notes: null },
    snacks: { allowed: false, notes: null },
    valueLimit: null
  },
  "Germany": {
    batteries: { allowed: true, notes: null },
    snacks: { allowed: false, notes: "Los alimentos solo pueden enviarse si no tienen fines comerciales." },
    valueLimit: null
  },
  "Alemania": {
    batteries: { allowed: true, notes: null },
    snacks: { allowed: false, notes: "Los alimentos solo pueden enviarse si no tienen fines comerciales." },
    valueLimit: null
  },
  "Mexico": {
    batteries: { allowed: true, notes: null },
    snacks: { allowed: false, notes: null },
    valueLimit: { amount: 1000, currency: "MXN", extra: "En la práctica, no es posible enviar consolas de juegos o teléfonos." }
  },
  "México": {
    batteries: { allowed: true, notes: null },
    snacks: { allowed: false, notes: null },
    valueLimit: { amount: 1000, currency: "MXN", extra: "En la práctica, no es posible enviar consolas de juegos o teléfonos." }
  },
  "Peru": {
    batteries: { allowed: false, notes: null },
    snacks: { allowed: true, notes: "Si el alimento contiene miel, es necesario confirmar con la embajada de Perú (03-3406-4243)." },
    valueLimit: null
  },
  "Perú": {
    batteries: { allowed: false, notes: null },
    snacks: { allowed: true, notes: "Si el alimento contiene miel, es necesario confirmar con la embajada de Perú (03-3406-4243)." },
    valueLimit: null
  },
  "El Salvador": {
    batteries: { allowed: false, notes: null },
    snacks: { allowed: true, notes: "Si el alimento contiene azúcar o edulcorantes, es necesario confirmar con la embajada de El Salvador (03-6804-2177)." },
    valueLimit: null
  },
  "Ecuador": {
    batteries: { allowed: true, notes: "Artículos con baterías de litio no pueden enviarse por EMS. El límite es de dos baterías por paquete. Se debe enviar como paquete pequeño certificado.", maxQuantity: 2, forbiddenMethods: ["EMS"] },
    snacks: { allowed: true, notes: null },
    valueLimit: null
  },
  "Colombia": {
    batteries: { allowed: false, notes: null },
    snacks: { allowed: true, notes: "No se pueden enviar cacao, productos lácteos ni alimentos procesados. En la práctica, no es posible enviar dulces." },
    valueLimit: null
  },
  "Chile": {
    batteries: { allowed: false, notes: null },
    snacks: { allowed: true, notes: null },
    valueLimit: null
  },
  "Paraguay": {
    batteries: { allowed: false, notes: "Prohibido por vía aérea. Permitido por vía marítima.", maritimeAllowed: true },
    snacks: { allowed: false, notes: "Prohibido por vía aérea. Permitido por vía marítima.", maritimeAllowed: true },
    chemicalProducts: { allowed: false, notes: "Prohibido por vía aérea. Permitido por vía marítima.", maritimeAllowed: true },
    valueLimit: null
  }
} as const;

// Global forbidden items (apply to all countries and methods)
export const GLOBAL_FORBIDDEN_ITEMS = commonProhibitedItems;

// Validation result type
export interface ShippingValidationResult {
  allowed: boolean;
  warnings: string[];
  errors: string[];
}

/**
 * Validates if a shipment is allowed based on country, item type, and shipping method
 * @param country - Destination country (e.g., 'Mexico', 'Paraguay', 'Ecuador')
 * @param itemType - Type of item: 'batteries', 'snacks', 'chemicals', or specific forbidden item
 * @param shippingMethod - Shipping method: 'EMS', 'DHL', 'Airmail', 'Maritime', etc.
 * @returns ShippingValidationResult with allowed status and any warnings/errors
 * 
 * @example
 * // Check if batteries can be sent to Ecuador via EMS
 * const result1 = validateShipping('Ecuador', 'batteries', 'EMS');
 * // result1.allowed = false, result1.errors = ['Baterías de litio no pueden enviarse a Ecuador por EMS.']
 * 
 * @example
 * // Check if snacks can be sent to Paraguay via Maritime
 * const result2 = validateShipping('Paraguay', 'snacks', 'Maritime');
 * // result2.allowed = true, result2.warnings = ['Permitido por vía marítima.']
 * 
 * @example
 * // Check if snacks can be sent to Colombia
 * const result3 = validateShipping('Colombia', 'snacks', 'Airmail');
 * // result3.allowed = true, result3.warnings = ['No se pueden enviar cacao, productos lácteos ni alimentos procesados...']
 */
export function validateShipping(
  country: string,
  itemType: 'batteries' | 'snacks' | 'chemicals' | string,
  shippingMethod: string = 'Airmail'
): ShippingValidationResult {
  const result: ShippingValidationResult = {
    allowed: true,
    warnings: [],
    errors: []
  };

  const isMaritime = shippingMethod.toLowerCase().includes('maritim') || shippingMethod.toLowerCase().includes('mar');
  
  // Check global forbidden items first
  const lowerItemType = itemType.toLowerCase();
  const isForbiddenGlobally = GLOBAL_FORBIDDEN_ITEMS.some(item => 
    item.toLowerCase().includes(lowerItemType) || lowerItemType.includes(item.toLowerCase())
  );
  
  if (isForbiddenGlobally) {
    result.allowed = false;
    result.errors.push(`${itemType} está en la lista de artículos prohibidos globalmente y no puede ser enviado a ningún país.`);
    return result;
  }

  // Get country constraints
  const constraints = SHIPPING_CONSTRAINTS[country as keyof typeof SHIPPING_CONSTRAINTS];
  
  if (!constraints) {
    result.warnings.push(`No se encontraron restricciones específicas para ${country}. Verificar manualmente.`);
    return result;
  }

  // For maritime shipping in Paraguay, most restrictions are lifted except global forbidden
  if (country === "Paraguay" && isMaritime) {
    result.warnings.push("Envío marítimo a Paraguay: Se permiten la mayoría de artículos excepto los prohibidos legalmente.");
    return result;
  }

  // Check specific item type constraints
  if (itemType === 'batteries' && constraints.batteries) {
    const batteryConstraint = constraints.batteries;
    
    // Check if batteries are forbidden for the shipping method
    if ('forbiddenMethods' in batteryConstraint && Array.isArray(batteryConstraint.forbiddenMethods) && batteryConstraint.forbiddenMethods.includes(shippingMethod)) {
      result.allowed = false;
      result.errors.push(`Baterías de litio no pueden enviarse a ${country} por ${shippingMethod}.`);
    }
    
    if (!batteryConstraint.allowed && !isMaritime) {
      result.allowed = false;
      result.errors.push(`Baterías de litio no están permitidas para envío a ${country}.`);
    } else if (batteryConstraint.allowed) {
      if (batteryConstraint.notes) {
        result.warnings.push(batteryConstraint.notes);
      }
      if ('maxQuantity' in batteryConstraint && batteryConstraint.maxQuantity) {
        result.warnings.push(`Máximo ${batteryConstraint.maxQuantity} baterías por paquete.`);
      }
    }
    
    // Maritime exception for Paraguay
    if (!batteryConstraint.allowed && 'maritimeAllowed' in batteryConstraint && batteryConstraint.maritimeAllowed && isMaritime) {
      result.allowed = true;
      result.warnings.push("Permitido por vía marítima.");
    }
  }

  if (itemType === 'snacks' && constraints.snacks) {
    const snackConstraint = constraints.snacks;
    
    if (!snackConstraint.allowed && !isMaritime) {
      result.allowed = false;
      result.errors.push(`Alimentos/snacks no están permitidos para envío a ${country}.`);
    } else if (snackConstraint.allowed && snackConstraint.notes) {
      result.warnings.push(snackConstraint.notes);
    }
    
    // Maritime exception for Paraguay
    if (!snackConstraint.allowed && 'maritimeAllowed' in snackConstraint && snackConstraint.maritimeAllowed && isMaritime) {
      result.allowed = true;
      result.warnings.push("Permitido por vía marítima.");
    }
  }

  if (itemType === 'chemicals' && 'chemicalProducts' in constraints) {
    const chemicalConstraint = (constraints as typeof SHIPPING_CONSTRAINTS['Paraguay']).chemicalProducts;
    
    if (chemicalConstraint && !chemicalConstraint.allowed && !isMaritime) {
      result.allowed = false;
      result.errors.push(`Productos químicos no están permitidos para envío aéreo a ${country}.`);
    }
    
    // Maritime exception
    if (chemicalConstraint && !chemicalConstraint.allowed && chemicalConstraint.maritimeAllowed && isMaritime) {
      result.allowed = true;
      result.warnings.push("Permitido por vía marítima.");
    }
  }

  // Check value limits
  if (constraints.valueLimit) {
    const limit = constraints.valueLimit;
    result.warnings.push(
      `Este país tiene un límite de valor: ${limit.amount} ${limit.currency}. ${limit.extra || ''}`
    );
  }

  return result;
}
