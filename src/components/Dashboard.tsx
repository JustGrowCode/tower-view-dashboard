
import { useState, useEffect } from "react";
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

export const Dashboard = () => {
  const [selectedTower, setSelectedTower] = useState<Tower | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadInitialTower() {
      try {
        setIsLoading(true);
        const towers = await fetchTowers();
        if (towers.length > 0) {
          setSelectedTower(towers[0]);
        }
      } catch (error) {
        console.error("Error loading initial tower:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialTower();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0d1b30]">
        <div className="w-16 h-16 border-4 border-[#9b87f5] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!selectedTower) {
    return (
      <div className="container mx-auto p-8 flex flex-col items-center justify-center min-h-screen bg-[#0d1b30] text-white">
        <div className="w-full max-w-md p-6 rounded-lg border border-[#2e3b52] bg-[#1a1f2c]">
          <h2 className="text-2xl font-bold mb-4 text-center">Carregando Dashboard de Torres</h2>
          <p className="mb-4 text-gray-300">Selecione uma torre para visualizar os detalhes do investimento:</p>
          <TowerSelector onSelect={setSelectedTower} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0d1b30] text-white">
      <DashboardHeader tower={selectedTower} onSelectTower={setSelectedTower} />

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
