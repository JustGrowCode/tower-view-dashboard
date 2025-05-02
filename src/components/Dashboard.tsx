
import { useState } from "react";
import { Tower } from "@/types/tower";
import { TowerSelector } from "./TowerSelector";
import { Footer } from "./Footer";
import { fetchTowers } from "@/services/sheetsService";
import { DashboardHeader } from "./DashboardHeader";
import { InvestmentSummary } from "./InvestmentSummary";
import { ReturnMetrics } from "./ReturnMetrics";
import { ContractDetails } from "./ContractDetails";
import { MarketAnalysis } from "./MarketAnalysis";
import { LocationDetails } from "./LocationDetails";
import { MonthlyReturnChart } from "./MonthlyReturnChart";
import { InvestmentDistribution } from "./InvestmentDistribution";
import { MarketProjection } from "./MarketProjection";
import { RefreshDataButton } from "./RefreshDataButton";
import { useQuery } from "@tanstack/react-query";

export const Dashboard = () => {
  const [selectedTower, setSelectedTower] = useState<Tower | null>(null);

  // Use React Query to fetch and cache data
  // Will refetch every 5 minutes or when manually triggered
  const { data: towers, isLoading, error } = useQuery({
    queryKey: ['towers'],
    queryFn: fetchTowers,
    refetchInterval: 300000, // 5 minutes
    refetchOnWindowFocus: true,
    staleTime: 240000, // 4 minutes
  });

  // Set the first tower as selected when data loads
  if (towers && towers.length > 0 && !selectedTower) {
    setSelectedTower(towers[0]);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0d1b30]">
        <div className="w-16 h-16 border-4 border-[#9b87f5] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 flex flex-col items-center justify-center min-h-screen bg-[#0d1b30] text-white">
        <div className="w-full max-w-md p-6 rounded-lg border border-[#2e3b52] bg-[#1a1f2c]">
          <h2 className="text-2xl font-bold mb-4 text-center">Erro ao carregar dados</h2>
          <p className="mb-4 text-gray-300">Ocorreu um erro ao buscar os dados das torres:</p>
          <p className="p-4 bg-[#222a3d] rounded text-red-400 mb-4">{String(error)}</p>
          <div className="flex justify-center">
            <RefreshDataButton />
          </div>
        </div>
      </div>
    );
  }

  if (!selectedTower) {
    return (
      <div className="container mx-auto p-8 flex flex-col items-center justify-center min-h-screen bg-[#0d1b30] text-white">
        <div className="w-full max-w-md p-6 rounded-lg border border-[#2e3b52] bg-[#1a1f2c]">
          <h2 className="text-2xl font-bold mb-4 text-center">Carregando Dashboard de Torres</h2>
          <p className="mb-4 text-gray-300">Selecione uma torre para visualizar os detalhes do investimento:</p>
          <TowerSelector onSelect={setSelectedTower} availableTowers={towers || []} />
          <div className="mt-4 flex justify-center">
            <RefreshDataButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0d1b30] text-white">
      <DashboardHeader 
        tower={selectedTower} 
        onSelectTower={setSelectedTower} 
        towers={towers || []} 
      />

      <div className="container mx-auto px-6 py-8">
        {/* Adicionado mt-16 para criar espaçamento na parte superior */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 mt-16">
          <InvestmentSummary tower={selectedTower} />
          <ReturnMetrics tower={selectedTower} />
          <ContractDetails tower={selectedTower} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <MonthlyReturnChart tower={selectedTower} />
          <InvestmentDistribution tower={selectedTower} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <MarketAnalysis tower={selectedTower} />
          <MarketProjection tower={selectedTower} />
        </div>

        <div className="grid grid-cols-1 mb-6">
          <LocationDetails tower={selectedTower} />
        </div>
      </div>

      <Footer />
    </div>
  );
};
