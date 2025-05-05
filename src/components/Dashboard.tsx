
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
import { RefreshDataButton } from "./RefreshDataButton";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { ChatButton } from "./chat/ChatButton";

export const Dashboard = () => {
  const [selectedTower, setSelectedTower] = useState<Tower | null>(null);

  // Use React Query para buscar e armazenar os dados
  const { data: towers, isLoading, error, isFetching } = useQuery({
    queryKey: ['towers'],
    queryFn: fetchTowers,
    staleTime: Infinity, // Os dados nunca ficarão obsoletos automaticamente
    retry: 2,
    meta: {
      onError: (error: Error) => {
        toast.error(`Erro ao carregar dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    }
  });

  // Exibe toast de erro quando ocorrer um erro
  if (error) {
    toast.error(`Erro ao carregar dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }

  // Seleciona a primeira torre quando os dados carregarem
  useEffect(() => {
    if (towers && towers.length > 0 && !selectedTower) {
      setSelectedTower(towers[0]);
    }
  }, [towers, selectedTower]);

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0d1b30]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-[#9b87f5] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white">Carregando dados...</p>
        </div>
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

  const isMockData = towers && towers.length > 0 && towers[0].source === 'mock';
  const isCacheData = towers && towers.length > 0 && towers[0].source === 'cache';

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
        
        {isMockData && (
          <Alert variant="destructive" className="bg-amber-900/30 border border-amber-700/50 mb-6">
            <Info className="h-4 w-4 text-amber-400" />
            <AlertTitle className="text-amber-400">Atenção</AlertTitle>
            <AlertDescription className="text-amber-300">
              Exibindo dados de demonstração. Clique em "Atualizar dados" para buscar dados reais.
            </AlertDescription>
          </Alert>
        )}
        
        {isCacheData && (
          <Alert className="bg-blue-900/30 border border-blue-700/50 mb-6">
            <Info className="h-4 w-4 text-blue-400" />
            <AlertTitle className="text-blue-400">Dados em cache</AlertTitle>
            <AlertDescription className="text-blue-300">
              Exibindo dados em cache. Não foi possível obter novos dados da planilha.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Footer />
      
      {/* Add the ChatButton component */}
      <ChatButton />
    </div>
  );
};
