
export interface Tower {
  id: string;
  name: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  investment: {
    total: number;
    land: number;
    structure: number;
    equipment: number;
    other: number;
    locationDetails: string;
  };
  returns: {
    monthly: number;
    annual: number;
    operatorFee: number;
    totalContractValue: number;
    roi: number;
  };
  contract: {
    duration: number;
    periods: string;
    payback: number;
    expiryLucrativePercentage: number;
  };
  market: {
    cagr: number;
    topMarket: string;
    growthRegion: string;
    currentYear: number;
    projectedYear: number;
    currentValue: number;
    projectedValue: number;
  };
  images: {
    location: string;
    tower: string;
  };
  // Updated to include 'cache' as a valid source type
  source?: 'sheets' | 'mock' | 'cache';
}
