
import { Tower } from "@/types/tower";
import { toast } from "sonner";

/**
 * Generate mock tower data for demonstration purposes
 */
export function getMockTowers(): Tower[] {
  toast.warning('Utilizando dados de demonstração', { id: 'mock-data-warning' });
  
  return [
    {
      id: 'tower-1',
      name: 'Torre São Paulo',
      location: 'São Paulo, SP',
      coordinates: {
        lat: -23.5505,
        lng: -46.6333,
      },
      investment: {
        total: 231000,
        land: 150400,
        structure: 51000,
        equipment: 30000,
        other: 0,
        locationDetails: 'Local pronto para implantação',
      },
      returns: {
        monthly: 3000,
        annual: 36000,
        operatorFee: 80800,
        totalContractValue: 1080000,
        roi: 467.53,
      },
      contract: {
        duration: 30,
        periods: '10 + 10 + 10',
        payback: 77,
        expiryLucrativePercentage: 80.26,
      },
      market: {
        cagr: 7.84,
        topMarket: 'América do Norte e Ásia Pacífico',
        growthRegion: 'América do Norte e Ásia Pacífico',
        currentYear: 2020,
        projectedYear: 2028,
        currentValue: 7.1,
        projectedValue: 12.5,
      },
      images: {
        location: '/lovable-uploads/212f763a-68d2-4f3e-86a6-98e55844987b.png',
        tower: '/lovable-uploads/212f763a-68d2-4f3e-86a6-98e55844987b.png',
      },
      source: 'mock'
    },
    {
      id: 'tower-2',
      name: 'Torre Rio de Janeiro',
      location: 'Rio de Janeiro, RJ',
      coordinates: {
        lat: -22.9068,
        lng: -43.1729,
      },
      investment: {
        total: 250000,
        land: 160000,
        structure: 55000,
        equipment: 35000,
        other: 0,
        locationDetails: 'Local pronto para implantação',
      },
      returns: {
        monthly: 3500,
        annual: 42000,
        operatorFee: 85000,
        totalContractValue: 1260000,
        roi: 504,
      },
      contract: {
        duration: 30,
        periods: '10 + 10 + 10',
        payback: 72,
        expiryLucrativePercentage: 82.5,
      },
      market: {
        cagr: 7.84,
        topMarket: 'América do Norte e Ásia Pacífico',
        growthRegion: 'América do Norte e Ásia Pacífico',
        currentYear: 2020,
        projectedYear: 2028,
        currentValue: 7.1,
        projectedValue: 12.5,
      },
      images: {
        location: '/lovable-uploads/212f763a-68d2-4f3e-86a6-98e55844987b.png',
        tower: '/lovable-uploads/212f763a-68d2-4f3e-86a6-98e55844987b.png',
      },
      source: 'mock'
    },
  ];
}
