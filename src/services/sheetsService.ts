
import { Tower } from "@/types/tower";

const SHEET_ID = '1o-X32tleEa1GTZ9UinmpJI7pwBRjcvs4vqqkyB3vQIQ';
const API_KEY = ''; // This should be configured by the user
const SHEET_NAME = 'torres';

export async function fetchTowers(): Promise<Tower[]> {
  try {
    // For demo purposes, we'll use a proxy or the direct API
    // In production, this should be done server-side to protect API keys
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch data from Google Sheets');
    }
    
    const data = await response.json();
    return parseTowersData(data.values);
    
  } catch (error) {
    console.error("Error fetching towers data:", error);
    return getMockTowers(); // Fallback to mock data
  }
}

function parseTowersData(rows: string[][]): Tower[] {
  if (!rows || rows.length < 2) {
    return getMockTowers();
  }
  
  const headers = rows[0];
  const towers: Tower[] = [];
  
  // Skip header row
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 3) continue; // Skip empty rows
    
    // Map your spreadsheet columns to the Tower interface
    // This mapping needs to be adjusted based on your actual spreadsheet structure
    const tower: Tower = {
      id: `tower-${i}`,
      name: row[0] || `Torre ${i}`,
      location: row[1] || 'Localização não especificada',
      coordinates: {
        lat: parseFloat(row[2]) || -23.5505,
        lng: parseFloat(row[3]) || -46.6333,
      },
      investment: {
        total: parseFloat(row[4]) || 231000,
        land: parseFloat(row[5]) || 150400,
        structure: parseFloat(row[6]) || 51000,
        equipment: parseFloat(row[7]) || 30000,
        other: parseFloat(row[8]) || 0,
        locationDetails: row[9] || 'Local pronto para implantação',
      },
      returns: {
        monthly: parseFloat(row[10]) || 3000,
        annual: (parseFloat(row[10]) || 3000) * 12,
        operatorFee: parseFloat(row[11]) || 80800,
        totalContractValue: parseFloat(row[12]) || 1080000,
        roi: parseFloat(row[13]) || 467.53,
      },
      contract: {
        duration: parseInt(row[14]) || 30,
        periods: row[15] || '10 + 10 + 10',
        payback: parseFloat(row[16]) || 77,
        expiryLucrativePercentage: parseFloat(row[17]) || 80.26,
      },
      market: {
        cagr: parseFloat(row[18]) || 7.84,
        topMarket: row[19] || 'América do Norte e Ásia Pacífico',
        growthRegion: row[20] || 'América do Norte e Ásia Pacífico',
        currentYear: parseInt(row[21]) || 2020,
        projectedYear: parseInt(row[22]) || 2028,
        currentValue: parseFloat(row[23]) || 7.1,
        projectedValue: parseFloat(row[24]) || 12.5,
      },
      images: {
        location: row[25] || 'https://via.placeholder.com/300x200?text=Local+da+Torre',
        tower: row[26] || 'https://via.placeholder.com/300x200?text=Torre',
      },
    };
    
    towers.push(tower);
  }
  
  return towers.length > 0 ? towers : getMockTowers();
}

// Mock data for demo purposes or when API is not available
function getMockTowers(): Tower[] {
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
    },
  ];
}

export async function fetchTowerById(id: string): Promise<Tower | undefined> {
  const towers = await fetchTowers();
  return towers.find(tower => tower.id === id);
}
