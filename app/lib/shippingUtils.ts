import { useState, useEffect } from 'react';

export const shippingTables = {
  economic: [
    [300, 1738, 2013, 2431, 2233],
    [400, 1870, 2211, 2662, 2519],
    [500, 2002, 2409, 2893, 2805],
    [600, 2134, 2607, 3124, 3091],
    [700, 2266, 2805, 3355, 3377],
    [800, 2398, 3003, 3586, 3663],
    [900, 2530, 3201, 3817, 3949],
    [1000, 2662, 3399, 4048, 4235],
    [1100, 2794, 3597, 4279, 4521],
    [1200, 2926, 3795, 4510, 4807],
    [1300, 3058, 3993, 4741, 5093],
    [1400, 3190, 4191, 4972, 5379],
    [1500, 3322, 4389, 5230, 5665],
    [1600, 3454, 4587, 5434, 5951],
    [1700, 3586, 4785, 5665, 6237],
    [1800, 3718, 4983, 5896, 6523],
    [1900, 3850, 5181, 6127, 6809],
    [2000, 3982, 5379, 6358, 7095]
  ],
  express: [
    [500, 2640, 4015, 4840, 4510],
    [1000, 4015, 5390, 6380, 6160],
    [1500, 4785, 6655, 7810, 7810],
    [2000, 5555, 7920, 9240, 9460],
    [2500, 6215, 9075, 10560, 11100],
    [3000, 6875, 10230, 11880, 12760],
    [3500, 7535, 11385, 13200, 14410],
    [4000, 8195, 12540, 14520, 16060],
    [4500, 8855, 13695, 15840, 17710],
    [5000, 9515, 14850, 17160, 19360],
    [6000, 10835, 17160, 19800, 22660],
    [7000, 11935, 19470, 22440, 25300],
    [8000, 13035, 21780, 25080, 27940],
    [9000, 14135, 24090, 27720, 30580],
    [10000, 15235, 26400, 30360, 33220]
  ]
};

export const currencyRates = {
  usd: 0.0069,
  mxn: 0.14,
  clp: 6.56
};

// ---------------- ZONAS Y PAISES ----------------
// Países según lista oficial de ePacket Light (envío económico)

// ZONA 1 - China, Corea del Sur, Taiwán
const ECONOMIC_ZONE1 = ["China","Republic of Korea","Taiwan"];

// ZONA 2 - Asia (excluyendo Zona 1)
const ECONOMIC_ZONE2_ASIA = [
  "Bangladesh","Bhutan","Brunei","Cambodia","Hong Kong","India","Indonesia","Laos",
  "Macao","Malaysia","Maldives","Mongolia","Myanmar","Nepal","Pakistan","Philippines",
  "Singapore","Sri Lanka","Thailand","Vietnam"
];

// ZONA 2 - Oceanía
const ECONOMIC_ZONE2_OCEANIA = [
  "Australia","Cook Islands","Fiji","French Polynesia","Kiribati","New Caledonia",
  "New Zealand","Samoa","Tuvalu","Vanuatu"
];

// ZONA 2 - América del Norte (sin USA)
const ECONOMIC_ZONE2_NA = ["Canada","Mexico"];

// ZONA 2 - Oriente Medio
const ECONOMIC_ZONE2_ME = [
  "Bahrain","Iran","Iraq","Israel","Jordan","Kuwait","Lebanon","Oman","Qatar",
  "Saudi Arabia","Turkey","United Arab Emirates"
];

// ZONA 2 - Europa
const ECONOMIC_ZONE2_EU = [
  "Armenia","Austria","Azerbaijan","Belgium","Bosnia and Herzegovina","Bulgaria","Croatia",
  "Cyprus","Czech Republic","Denmark","Estonia","Finland","France","Germany","Gibraltar",
  "Greece","Hungary","Iceland","Ireland","Italy","Jersey","Kazakhstan","Kyrgyz","Latvia",
  "Lithuania","Luxembourg","Malta","Netherlands","North Macedonia","Norway","Poland",
  "Portugal","Romania","Serbia","Slovakia","Slovenia","Spain","Sweden","Switzerland",
  "Ukraine","United Kingdom","Uzbekistan"
];

// ZONA 4 - Estados Unidos y territorios
const ECONOMIC_ZONE3_US = [
  "United States of America","America Samoa","Guam","Midway","Northern Mariana Islands",
  "Puerto Rico","Saipan","Virgin Islands","Wake"
];

// ZONA 5 - América Central y del Sur (sin México)
const ECONOMIC_ZONE4_LATAM = [
  "Argentina","Brazil","Chile","Colombia","Costa Rica","Cuba","Dominican Republic",
  "Ecuador","El Salvador","Guadeloupe","Honduras","Jamaica","Martinique","Nicaragua",
  "Panama","Peru","Trinidad and Tobago","Venezuela"
];

// ZONA 5 - África
const ECONOMIC_ZONE4_AFRICA = [
  "Algeria","Angola","Benin","The Democratic Republic of the Congo","Djibouti","Egypt",
  "Ethiopia","Gabon","Gambia","Ghana","Guinea","Ivory Coast","Kenya","Liberia",
  "Madagascar","Mauritania","Mauritius","Morocco","Mozambique","Nigeria","Reunion",
  "Rwanda","Senegal","Sierra Leone","South Africa","Tanzania (United Rep.)","Togo",
  "Tunisia","Uganda","Zimbabwe"
];

// Países con acceso a EXPRESS (mantener compatibilidad con código anterior)
const EXPRESS_ZONE1_ASIA = [
  "Bangladesh","Bhutan","Brunei","Cambodia","China","Hong Kong","India","Indonesia",
  "Laos","Macao","Malaysia","Maldives","Mongolia","Myanmar","Nepal","Pakistan",
  "Philippines","Republic of Korea","Singapore","Sri Lanka","Taiwan","Thailand","Vietnam"
];
const EXPRESS_ZONE2_OCEANIA = [
  "Australia","Cook Islands","Fiji","New Caledonia","New Zealand","Papua New Guinea","Solomon"
];
const EXPRESS_ZONE2_NA = ["Canada","Mexico","St. Pierre and Miquelon"];
const EXPRESS_ZONE2_ME = [
  "Bahrain","Iran","Iraq","Israel","Jordan","Kuwait","Lebanon","Oman","Qatar",
  "Saudi Arabia","Syria","Turkey","United Arab Emirates"
];
const EXPRESS_ZONE2_EU = [
  "Andorra","Austria","Azerbaijan","Belarus","Belgium","Bulgaria","Croatia","Cyprus",
  "Czech Republic","Denmark","Estonia","Finland","France","Germany","United Kingdom",
  "Greece","Guernsey","Hungary","Iceland","Ireland","Italy","Jersey","Latvia",
  "Liechtenstein","Lithuania","Luxembourg","Malta","Monaco","Netherlands","North Macedonia",
  "Norway","Poland","Portugal","Romania","Russian Federation","San Marino","Slovakia",
  "Slovenia","Spain","Switzerland","Sweden","Ukraine"
];
const EXPRESS_ZONE3_US = ["United States of America","Guam","Saipan"];
const EXPRESS_ZONE4_LATAM = [
  "Argentina","Barbados","Brazil","Chile","Costa Rica","Cuba","El Salvador",
  "French Guiana","Guadeloupe","Honduras","Jamaica","Martinique","Panama",
  "Peru","Trinidad and Tobago","Uruguay"
];
const EXPRESS_ZONE4_AFRICA = [
  "Algeria","Botswana","Djibouti","Egypt","Ethiopia","Gabon","Ghana","Ivory Coast",
  "Kenya","Madagascar","Mauritius","Morocco","Nigeria","Reunion","Rwanda","Senegal",
  "Sierra Leone","South Africa","Sudan","Tanzania (United Rep.)","Togo","Tunisia","Uganda","Zimbabwe"
];

const ZONE5_PARAGUAY = ["Paraguay"];

// Mapeo para EXPRESS (mantiene estructura antigua)
export const EXPRESS_COUNTRY_TO_ZONE: Record<string, number> = {};
[...EXPRESS_ZONE1_ASIA].forEach(c => EXPRESS_COUNTRY_TO_ZONE[c] = 1);
[...EXPRESS_ZONE2_OCEANIA, ...EXPRESS_ZONE2_NA, ...EXPRESS_ZONE2_ME, ...EXPRESS_ZONE2_EU].forEach(c => EXPRESS_COUNTRY_TO_ZONE[c] = 2);
[...EXPRESS_ZONE3_US].forEach(c => EXPRESS_COUNTRY_TO_ZONE[c] = 3);
[...EXPRESS_ZONE4_LATAM, ...EXPRESS_ZONE4_AFRICA].forEach(c => EXPRESS_COUNTRY_TO_ZONE[c] = 4);
[...ZONE5_PARAGUAY].forEach(c => EXPRESS_COUNTRY_TO_ZONE[c] = 5);

// Mapeo para ECONÓMICO (según lista oficial de ePacket Light)
export const ECONOMIC_COUNTRY_TO_ZONE: Record<string, number> = {};
[...ECONOMIC_ZONE1].forEach(c => ECONOMIC_COUNTRY_TO_ZONE[c] = 1);
[...ECONOMIC_ZONE2_ASIA, ...ECONOMIC_ZONE2_OCEANIA, ...ECONOMIC_ZONE2_NA, ...ECONOMIC_ZONE2_ME, ...ECONOMIC_ZONE2_EU].forEach(c => ECONOMIC_COUNTRY_TO_ZONE[c] = 2);
[...ECONOMIC_ZONE3_US].forEach(c => ECONOMIC_COUNTRY_TO_ZONE[c] = 3);
[...ECONOMIC_ZONE4_LATAM, ...ECONOMIC_ZONE4_AFRICA].forEach(c => ECONOMIC_COUNTRY_TO_ZONE[c] = 4);
[...ZONE5_PARAGUAY].forEach(c => ECONOMIC_COUNTRY_TO_ZONE[c] = 5);

// Mantener COUNTRY_TO_ZONE para compatibilidad (usa el mapeo de económico)
export const COUNTRY_TO_ZONE: Record<string, number> = ECONOMIC_COUNTRY_TO_ZONE;

export const ZONE_NAMES: Record<number, string> = {
  1: "China, Corea del Sur, Taiwán",
  2: "Asia + Oceanía + Canadá + México + Medio Oriente + Europa",
  3: "Estados Unidos (incluye territorios)",
  4: "Centro/Sur América (sin México y Paraguay) + África",
  5: "Paraguay (envío especial)",
};

export const destinations = ['Asia', 'Europe/Canada/Mexico', 'USA', 'Central/South America','Paraguay'];

export const PARAGUAY_SHIPPING = {
  ratePerGram: 5.385,
  minWeight: 200,
  maxWeight: 25000,
  step: 100
};

export const PARAGUAY_MARITIME_SHIPPING = {
  ratePerKg: 12,
  minWeight: 1000,
  maxWeight: 30000,
  step: 200
};

export const PERU_MARITIME_SHIPPING = {
  priceTable: [
    { kg: 1, price: 3500, usd: 23 },
    { kg: 2, price: 4300, usd: 29 },
    { kg: 3, price: 5050, usd: 34 },
    { kg: 4, price: 5850, usd: 39 },
    { kg: 5, price: 6600, usd: 44 },
    { kg: 6, price: 7350, usd: 49 },
    { kg: 7, price: 8150, usd: 55 },
    { kg: 8, price: 8900, usd: 60 },
    { kg: 9, price: 9700, usd: 65 },
    { kg: 10, price: 10450, usd: 70 },
    { kg: 11, price: 11100, usd: 75 },
    { kg: 12, price: 11750, usd: 79 },
    { kg: 13, price: 12450, usd: 84 },
    { kg: 14, price: 13100, usd: 88 },
    { kg: 15, price: 13750, usd: 92 },
    { kg: 16, price: 14400, usd: 97 },
    { kg: 17, price: 15050, usd: 101 },
    { kg: 18, price: 15700, usd: 105 },
    { kg: 19, price: 16400, usd: 110 },
    { kg: 20, price: 17050, usd: 114 },
    { kg: 21, price: 17700, usd: 119 },
    { kg: 22, price: 18350, usd: 123 },
    { kg: 23, price: 19000, usd: 128 },
    { kg: 24, price: 19700, usd: 132 },
    { kg: 25, price: 20350, usd: 136 },
    { kg: 26, price: 21000, usd: 141 },
    { kg: 27, price: 21650, usd: 145 },
    { kg: 28, price: 22300, usd: 150 },
    { kg: 29, price: 22950, usd: 154 },
    { kg: 30, price: 23650, usd: 159 },
  ],
  minWeight: 1000,
  maxWeight: 30000,
  step: 1000
};

// ============= DHL SHIPPING CONFIGURATION =================

// DHL Zone Definitions (separate from regular zones)
const DHL_ZONE1 = ["Republic of Korea", "Taiwan"];
const DHL_ZONE2 = ["China", "Hong Kong", "Macao"];
const DHL_ZONE3 = [
  "Brunei", "Vietnam", "Singapore", "Indonesia",
  "Philippines", "Malaysia", "Thailand"
];
const DHL_ZONE4 = ["India", "Bangladesh", "Myanmar", "Bhutan", "Laos"];
const DHL_ZONE5 = ["United States of America", "Canada", "Mexico"];
const DHL_ZONE6 = [
  "Iceland","Ireland","Czech Republic","Denmark","Estonia","Finland",
  "France","Germany","United Kingdom","Greece","Guernsey","Hungary",
  "Italy","Jersey","Latvia","Liechtenstein","Lithuania","Luxembourg",
  "Malta","Monaco","Netherlands","North Macedonia","Norway","Poland",
  "Portugal","Romania","San Marino","Serbia","Slovakia","Slovenia",
  "Spain","Switzerland","Sweden","Bosnia and Herzegovina","Montenegro",
  "Cyprus","Turkey","Vatican City"
];
const DHL_ZONE7 = ["Israel", "United Arab Emirates"];
const DHL_ZONE8 = [
  "Afghanistan","Albania","Algeria","American Samoa","Angola","Anguilla",
  "Antigua and Barbuda","Argentina","Aruba","Bahamas","Bahrain","Barbados",
  "Belarus","Belize","Benin","Bermuda","Bolivia","Botswana","Brazil",
  "British Virgin Islands","Burkina Faso","Burundi","Cambodia","Cameroon",
  "Cape Verde","Cayman Islands","Central African Republic","Chad","Chile",
  "Colombia","Comoros","Republic of the Congo","Democratic Republic of the Congo",
  "Cook Islands","Costa Rica","Cuba","Curacao","Djibouti","Dominica",
  "Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea",
  "Eritrea","Eswatini","Ethiopia","Falkland Islands","Faroe Islands",
  "French Guiana","Gabon","Gambia","Georgia","Ghana","Greenland","Grenada",
  "Guadeloupe","Guam","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti",
  "Honduras","Iraq","Iran","Ivory Coast","Jamaica","Jordan","Kazakhstan",
  "Kenya","Kiribati","Kuwait","Kyrgyzstan","Lebanon","Lesotho","Liberia",
  "Libya","Madagascar","Malawi","Maldives","Mali","Marshall Islands",
  "Martinique","Mauritania","Mauritius","Mayotte","Micronesia","Moldova",
  "Mongolia","Montserrat","Morocco","Mozambique","Namibia","Nauru","Nepal",
  "New Caledonia","Nicaragua","Niger","Nigeria","Niue","Oman","Pakistan",
  "Palau","Panama","Papua New Guinea","Paraguay","Peru","Puerto Rico",
  "Qatar","Reunion","Rwanda","Saint Barthelemy","Saint Helena","Saint Kitts",
  "Saint Lucia","Saint Martin","Saint Pierre and Miquelon","Saint Vincent",
  "Samoa","Sao Tome and Principe","Saudi Arabia","Senegal","Seychelles",
  "Sierra Leone","Sint Eustatius","Solomon Islands","Somalia","South Africa",
  "South Sudan","Sri Lanka","Sudan","Suriname","Syrian Arab Republic",
  "Tajikistan","Tanzania","Timor-Leste","Togo","Tonga","Trinidad and Tobago",
  "Tunisia","Turkmenistan","Turks and Caicos Islands","Tuvalu","Uganda",
  "Ukraine","Uruguay","Uzbekistan","Vanuatu","Venezuela","Virgin Islands",
  "Yemen","Zambia","Zimbabwe"
];

// All DHL countries consolidated
const ALL_DHL_COUNTRIES = [
  ...DHL_ZONE1, ...DHL_ZONE2, ...DHL_ZONE3, ...DHL_ZONE4,
  ...DHL_ZONE5, ...DHL_ZONE6, ...DHL_ZONE7, ...DHL_ZONE8
];

// Include DHL-only countries in the complete country list
export const ALL_COUNTRIES = [
  ...Object.keys(COUNTRY_TO_ZONE),
  ...ALL_DHL_COUNTRIES.filter(country => !COUNTRY_TO_ZONE[country])
].sort((a,b)=>a.localeCompare(b));

// Country aliases for DHL
const DHL_COUNTRY_ALIASES: Record<string, string> = {
  "USA": "United States of America",
  "United States": "United States of America",
  "UK": "United Kingdom",
  "South Korea": "Republic of Korea",
  "Korea": "Republic of Korea",
  "Macau": "Macao",
  "UAE": "United Arab Emirates",
  "Hong Kong SAR": "Hong Kong"
};

// Build DHL country-to-zone map
export const DHL_COUNTRY_TO_ZONE: Record<string, number> = {};
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
  countries.forEach(c => DHL_COUNTRY_TO_ZONE[c] = zone);
});

// DHL Rate Tables (0.5 kg - 10 kg)
const DHL_ZONE1_RATES: Record<string, number> = {
  "0.5":2414,"1.0":2414,"1.5":2414,"2.0":2414,"2.5":3766,"3.0":3766,"3.5":3766,"4.0":3766,
  "4.5":3766,"5.0":3766,"5.5":4776,"6.0":5786,"6.5":6796,"7.0":7806,"7.5":8816,"8.0":9826,
  "8.5":10836,"9.0":11846,"9.5":12856,"10.0":13866
};

const DHL_ZONE2_RATES: Record<string, number> = {
  "0.5":2566,"1.0":2566,"1.5":2566,"2.0":2566,"2.5":3926,"3.0":3926,"3.5":3926,"4.0":3926,
  "4.5":3926,"5.0":3926,"5.5":4930,"6.0":5934,"6.5":6938,"7.0":7942,"7.5":8946,"8.0":9950,
  "8.5":10954,"9.0":11958,"9.5":12962,"10.0":13966
};

const DHL_ZONE3_RATES: Record<string, number> = {
  "0.5":2717,"1.0":2717,"1.5":2717,"2.0":2717,"2.5":4675,"3.0":4675,"3.5":4675,"4.0":4675,
  "4.5":4675,"5.0":4675,"5.5":5872,"6.0":7069,"6.5":8266,"7.0":9463,"7.5":10660,"8.0":11857,
  "8.5":13054,"9.0":14251,"9.5":15448,"10.0":16645
};

const DHL_ZONE4_RATES: Record<string, number> = {
  "0.5":2867,"1.0":2867,"1.5":2867,"2.0":2867,"2.5":4973,"3.0":4973,"3.5":4973,"4.0":4973,
  "4.5":4973,"5.0":4973,"5.5":6730,"6.0":8487,"6.5":10244,"7.0":12001,"7.5":13758,"8.0":15515,
  "8.5":17272,"9.0":19029,"9.5":20786,"10.0":22543
};

const DHL_ZONE5_RATES: Record<string, number> = {
  "0.5":4882,"1.0":4882,"1.5":4882,"2.0":5578,"2.5":6372,"3.0":7409,"3.5":8446,"4.0":9483,
  "4.5":10520,"5.0":11557,"5.5":11828,"6.0":12099,"6.5":12370,"7.0":12641,"7.5":12912,"8.0":13183,
  "8.5":13454,"9.0":13725,"9.5":13996,"10.0":14267
};

const DHL_ZONE6_RATES: Record<string, number> = {
  "0.5":3471,"1.0":3471,"1.5":3471,"2.0":3471,"2.5":7549,"3.0":7549,"3.5":7549,"4.0":7549,
  "4.5":7549,"5.0":7549,"5.5":10326,"6.0":13103,"6.5":15880,"7.0":18657,"7.5":21434,"8.0":24211,
  "8.5":26988,"9.0":29765,"9.5":32542,"10.0":35319
};

const DHL_ZONE7_RATES: Record<string, number> = {
  "0.5":5583,"1.0":5583,"1.5":5583,"2.0":5583,"2.5":13282,"3.0":13282,"3.5":13282,"4.0":13282,
  "4.5":13282,"5.0":13282,"5.5":16540,"6.0":19798,"6.5":23056,"7.0":26314,"7.5":29572,"8.0":32830,
  "8.5":36088,"9.0":39346,"9.5":42604,"10.0":45862
};

const DHL_ZONE8_RATES: Record<string, number> = {
  "0.5":5887,"1.0":5887,"1.5":5887,"2.0":5887,"2.5":13589,"3.0":13589,"3.5":13589,"4.0":13589,
  "4.5":13589,"5.0":13589,"5.5":17257,"6.0":20925,"6.5":24593,"7.0":28261,"7.5":31929,"8.0":35597,
  "8.5":39265,"9.0":42933,"9.5":46601,"10.0":50269
};

const DHL_RATE_TABLES: Record<number, Record<string, number>> = {
  1: DHL_ZONE1_RATES,
  2: DHL_ZONE2_RATES,
  3: DHL_ZONE3_RATES,
  4: DHL_ZONE4_RATES,
  5: DHL_ZONE5_RATES,
  6: DHL_ZONE6_RATES,
  7: DHL_ZONE7_RATES,
  8: DHL_ZONE8_RATES
};

export const DHL_DEMAND_SURCHARGE = 375; // Fixed yen
export const DHL_DEFAULT_FUEL_PERCENTAGE = 32; // 32%
export const DHL_VOLUMETRIC_DIVISOR = 5000;

// Helper: Round up to nearest 0.5 kg
function ceilToHalfKg(kg: number): number {
  return Math.ceil(kg * 2) / 2;
}

// Helper: Calculate volumetric weight from dimensions (cm)
function calculateVolumetricWeight(L: number, W: number, H: number): number {
  if (!L || !W || !H) return 0;
  return (L * W * H) / DHL_VOLUMETRIC_DIVISOR;
}

// Helper: Get chargeable weight (max of actual or volumetric, rounded up, capped at 10kg)
function getChargeableWeight(actualKg: number, L?: number, W?: number, H?: number): number {
  const volumetric = calculateVolumetricWeight(L || 0, W || 0, H || 0);
  const maxWeight = Math.max(actualKg, volumetric);
  const rounded = ceilToHalfKg(maxWeight);
  return Math.min(10, rounded); // cap at 10kg
}

// Normalize country name using aliases
function normalizeDHLCountry(name: string): string {
  return DHL_COUNTRY_ALIASES[name] || name;
}

// Check if a country is only available via DHL shipping
export const isDHLOnlyCountry = (country: string): boolean => {
  const normalizedCountry = normalizeDHLCountry(country);
  const hasDHL = ALL_DHL_COUNTRIES.includes(normalizedCountry);
  const hasRegularZone = ECONOMIC_COUNTRY_TO_ZONE[country] !== undefined;
  return hasDHL && !hasRegularZone;
};

// Check if a country has access to express shipping
export const hasExpressShipping = (country: string): boolean => {
  return EXPRESS_COUNTRY_TO_ZONE[country] !== undefined;
};

// Get DHL zone for a country
function getDHLZone(country: string): number {
  const normalized = normalizeDHLCountry(country);
  return DHL_COUNTRY_TO_ZONE[normalized] || 8; // Default to zone 8
}

export interface DHLCostBreakdown {
  zone: number;
  actualKg: number;
  volumetricKg: number;
  chargeableKg: number;
  baseRate: number;
  demandSurcharge: number;
  fuelSurcharge: number;
  total: number;
}

// Calculate DHL shipping cost with full breakdown
export function calculateDHLCost(
  country: string,
  weightGrams: number,
  L?: number,
  W?: number,
  H?: number,
  fuelPercentage: number = DHL_DEFAULT_FUEL_PERCENTAGE
): DHLCostBreakdown | null {
  const zone = getDHLZone(country);
  const actualKg = weightGrams / 1000; // Convert grams to kg
  
  // Calculate volumetric weight
  const volumetricKg = calculateVolumetricWeight(L || 0, W || 0, H || 0);
  
  // Calculate chargeable weight
  const chargeableKg = getChargeableWeight(actualKg, L, W, H);
  
  // Get base rate from table
  const rateTable = DHL_RATE_TABLES[zone];
  if (!rateTable) return null;
  
  const baseRate = rateTable[chargeableKg.toFixed(1)] || 0;
  if (baseRate === 0) return null;
  
  // Calculate surcharges
  const demandSurcharge = DHL_DEMAND_SURCHARGE;
  const fuelSurcharge = Math.round(baseRate * (fuelPercentage / 100));
  
  // Calculate total
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
export const calculateShippingCost = (
  destination: string,
  shippingMethod: 'economic' | 'express' | 'dhl',
  weight: number
): number | null => {
  const destIndex = destinations.indexOf(destination);
  if (destIndex === -1) return null;
  
  const table = shippingTables[shippingMethod];
  
  for (let i = 0; i < table.length; i++) {
    if (weight <= table[i][0]) {
      return table[i][destIndex + 1];
    }
  }
  
  // If weight exceeds the table, return the last row's cost
  if (table.length > 0) {
    return table[table.length - 1][destIndex + 1];
  }
  
  return null;
};

export const calculateShippingCostByCountry = (
  country: string,
  shippingMethod: 'economic' | 'express' | 'paraguay' | 'paraguay-maritime' | 'peru-maritime' | 'dhl',
  weight: number,
  dimensions?: { L?: number; W?: number; H?: number },
  fuelPercentage?: number
): number | DHLCostBreakdown | null => {
  // Usar el mapeo correcto según el método de envío
  const zoneMap = shippingMethod === 'express' ? EXPRESS_COUNTRY_TO_ZONE : ECONOMIC_COUNTRY_TO_ZONE;
  const zone = zoneMap[country];
  
  if (!zone && shippingMethod !== 'dhl') return null;

  // --- DHL special case ---
  if (shippingMethod === 'dhl') {
    return calculateDHLCost(
      country,
      weight,
      dimensions?.L,
      dimensions?.W,
      dimensions?.H,
      fuelPercentage
    );
  }

  if (country === "Peru" && shippingMethod === 'peru-maritime') {
    const { priceTable, minWeight, maxWeight, step } = PERU_MARITIME_SHIPPING;
    
    let effectiveWeight = weight;
    if (dimensions?.L && dimensions?.W && dimensions?.H) {
      const volumetricKg = calculateVolumetricWeight(
        dimensions.L, 
        dimensions.W, 
        dimensions.H
      );
      const volumetricGrams = volumetricKg * 1000;
      effectiveWeight = Math.max(weight, volumetricGrams);
    }

    const clamped = Math.max(minWeight, Math.min(maxWeight, effectiveWeight));
    const weightInKg = Math.ceil(clamped / step);

    const priceEntry = priceTable.find(entry => entry.kg === weightInKg);
    if (priceEntry) {
      return priceEntry.price;
    }
    
    return priceTable[priceTable.length - 1].price;
  }

  if (zone === 5) {
    if (shippingMethod !== 'paraguay' && shippingMethod !== 'paraguay-maritime') return null;
    
    if (shippingMethod === 'paraguay-maritime') {
      const { ratePerKg, minWeight, maxWeight, step } = PARAGUAY_MARITIME_SHIPPING;
      
      let effectiveWeight = weight;
      
      // 1. Cálculo Volumétrico (si hay dimensiones)
      if (dimensions?.L && dimensions?.W && dimensions?.H) {
        const volumetricKg = (dimensions.L * dimensions.W * dimensions.H) / 5000;
        const volumetricGrams = volumetricKg * 1000;
        effectiveWeight = Math.max(weight, volumetricGrams);
      }

      // 2. Aplicar límites (mínimo 1kg, máximo 30kg)
      const clamped = Math.max(minWeight, Math.min(maxWeight, effectiveWeight));

      // 3. Aplicar redondeo de la "barrita" (cada 200g)
      // Ejemplo: 1100g -> se redondea a 1200g
      const rounded = Math.ceil(clamped / step) * step;

      // 4. Calcular costo en USD y convertir a JPY para el sistema
      const weightInKg = rounded / 1000;
      const costInUSD = weightInKg * ratePerKg;
      
      // Usamos el tipo de cambio inverso para obtener los Yenes
      const costInJPY = costInUSD / currencyRates.usd; 
      
      return costInJPY;
    }
    
    const { ratePerGram, minWeight, maxWeight, step } = PARAGUAY_SHIPPING;

    let effectiveWeight = weight;
    if (dimensions?.L && dimensions?.W && dimensions?.H) {
      const volumetricKg = calculateVolumetricWeight(
        dimensions.L, 
        dimensions.W, 
        dimensions.H
      );
      const volumetricGrams = volumetricKg * 1000;
      effectiveWeight = Math.max(weight, volumetricGrams);
    }

    const clamped = Math.max(minWeight, Math.min(maxWeight, effectiveWeight));
    const rounded = Math.ceil(clamped / step) * step;

    return rounded * ratePerGram;
  }

  // --- Normal zones (economic / express) ---
  const destIndex = zone - 1;
  const table = shippingTables[shippingMethod];
  if (!table) return null;

  for (let i = 0; i < table.length; i++) {
    if (weight <= table[i][0]) {
      return table[i][destIndex + 1];
    }
  }

  // If weight exceeds the table, return the last row's cost
  if (table.length > 0) {
    return table[table.length - 1][destIndex + 1];
  }

  return null;
};


export const getZoneForCountry = (country: string): { zone: number; name: string } | null => {
  const zone = COUNTRY_TO_ZONE[country];
  if (!zone) return null;
  return { zone, name: ZONE_NAMES[zone] };
};

export const convertCurrency = (amountJpy: number, currency: 'usd' | 'mxn' | 'clp'): string => {
  const converted = amountJpy * currencyRates[currency];
  return converted.toFixed(2);
};

export const useAnimatedNumber = (targetNumber: number, duration = 100) => {
  const [animatedValue, setAnimatedValue] = useState(targetNumber);
  
  useEffect(() => {
    let start = animatedValue;
    let startTime = performance.now();
    
    const animate = (now: number) => {
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

export const getWeightRange = (shippingMethod: 'economic' | 'express' | 'paraguay' | 'paraguay-maritime' | 'peru-maritime' | 'dhl') => {
  if (shippingMethod === 'express') return { min: 500, max: 10000 };
  if (shippingMethod === 'paraguay') return { min: 200, max: 25000 };
  if (shippingMethod === 'paraguay-maritime') return { min: 1000, max: 30000 };
  if (shippingMethod === 'peru-maritime') return { min: 1000, max: 30000 };
  if (shippingMethod === 'dhl') return { min: 500, max: 10000 };
  return { min: 300, max: 2000 };
};
