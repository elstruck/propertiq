// User types
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt: Date;
}

// Buy Box types
export type InvestmentStrategy = 'Buy-&-Hold' | 'Flip' | 'BRRRR' | 'STR' | 'Land' | 'Other';

export interface BuyBoxCriteria {
  // Step 1: Strategy
  strategy: InvestmentStrategy;
  
  // Step 2: Geography
  locations: string[]; // ZIP codes or city names
  
  // Step 3: Property criteria
  priceMin?: number;
  priceMax?: number;
  bedsMin?: number;
  bedsMax?: number;
  bathsMin?: number;
  bathsMax?: number;
  sqftMin?: number;
  sqftMax?: number;
  yearBuiltMin?: number;
  yearBuiltMax?: number;
  lotSizeMin?: number;
  lotSizeMax?: number;
  hoaMax?: number;
  
  // Step 4: Financial criteria
  capRateMin?: number;
  cocReturnMin?: number; // Cash-on-cash return
  cashFlowMin?: number;
  
  // Step 5: Kill switches
  killSwitches: {
    floodZone: boolean;
    hoa: boolean;
    manufactured: boolean;
    fixerUpper: boolean;
  };
  toleranceBand: number; // Percentage tolerance (0-100)
}

export interface BuyBox {
  id: string;
  userId: string;
  name: string;
  criteria: BuyBoxCriteria;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Property/Listing types
export interface PropertyListing {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  yearBuilt: number;
  lotSize?: number;
  hoa?: number;
  latitude: number;
  longitude: number;
  photos: string[];
  description?: string;
  propertyType: string;
  isForeclosure?: boolean;
  daysOnMarket?: number;
  mlsNumber?: string;
  schoolRating?: number;
  source: 'zillow' | 'mock';
  zillowId?: string;
}

// Search and scoring types
export type DealBadge = 'Great Deal' | 'Good Deal' | 'Fair' | 'Over-Priced';

export interface ScoredListing extends PropertyListing {
  score: number;
  badge: DealBadge;
  badgeColor: 'green' | 'blue' | 'gray' | 'red';
  matchReasons: string[];
  dealBreakers: string[];
  matchDetails: {
    priceScore: number;
    locationScore: number;
    propertyScore: number;
    financialScore: number;
    killSwitchTriggered: boolean;
  };
}

export interface SearchResult {
  id: string;
  userId: string;
  buyBoxId: string;
  buyBoxName: string;
  query: string;
  totalFound: number;
  listings: ScoredListing[];
  createdAt: Date;
  searchParams: BuyBoxCriteria;
}

// Lead capture types
export interface Lead {
  id: string;
  userId: string;
  propertyId: string;
  userEmail: string;
  userName?: string;
  userPhone?: string;
  message?: string;
  propertyAddress: string;
  createdAt: Date;
  status: 'new' | 'contacted' | 'closed';
}

export interface ListingCache {
  id: string;
  searchId: string;
  listing: ScoredListing;
  expiresAt: Date;
  createdAt: Date;
}

// Form types for the buy-box wizard
export interface BuyBoxFormData {
  name: string;
  strategy: InvestmentStrategy;
  geography: {
    zipCodes: string;
    cities: string;
  };
  priceRange: {
    min: string;
    max: string;
  };
  propertySpecs: {
    bedsMin: string;
    bedsMax: string;
    bathsMin: string;
    bathsMax: string;
    sqftMin: string;
    sqftMax: string;
    yearBuiltMin: string;
    yearBuiltMax: string;
    lotSizeMin: string;
    lotSizeMax: string;
    hoaMax: string;
  };
  financialCriteria: {
    capRateMin: string;
    cocReturnMin: string;
    maxPricePerSqft: string;
  };
  killSwitches: {
    noHoa: boolean;
    noFlood: boolean;
    schoolRatingMin: string;
  };
  toleranceBand: number;
}

// API Response types
export interface ZillowSearchResponse {
  listings: {
    zpid: string;
    address: string;
    price: number;
    beds: number;
    baths: number;
    livingArea: number;
    yearBuilt: number;
    lotAreaValue?: number;
    latitude: number;
    longitude: number;
    photos: string[];
    homeStatus: string;
    daysOnZillow?: number;
    schools?: {
      rating?: number;
    }[];
  }[];
  totalResults: number;
} 