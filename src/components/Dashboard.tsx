
import { useState, useEffect } from "react";
import { Tower } from "@/types/tower";
import { TowerSelector } from "./TowerSelector";
import { Hero } from "./Hero";
import { InvestmentCard } from "./InvestmentCard";
import { ReturnCard } from "./ReturnCard";
import { ContractCard } from "./ContractCard";
import { MarketCard } from "./MarketCard";
import { LocationCard } from "./LocationCard";
import { Footer } from "./Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchTowers } from "@/services/sheetsService";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export const Dashboard = () => {
  const [selectedTower, setSelectedTower] = useState<Tower | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showApiInfo, setShowApiInfo] = useState(false);

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
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!selectedTower) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Carregando Dashboard de Torres</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Selecione uma torre para visualizar os detalhes do investimento:</p>
            <TowerSelector onSelect={setSelectedTower} />
            <div className="mt-6">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setShowApiInfo(!showApiInfo)}
              >
                <Settings size={16} className="mr-2" /> 
                Configurar Google Sheets
              </Button>
              
              {showApiInfo && (
                <div className="mt-4 p-4 bg-slate-50 rounded-md text-sm">
                  <h4 className="font-semibold mb-2">Como conectar sua planilha:</h4>
                  <ol className="list-decimal pl-4 space-y-2">
                    <li>Acesse o <a href="https://console.cloud.google.com/" className="text-primary underline" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
                    <li>Crie um projeto e habilite a API Google Sheets</li>
                    <li>Crie uma chave de API em Credenciais</li>
                    <li>Copie a chave para o arquivo sheetsService.ts</li>
                    <li>Certifique-se que sua planilha esteja pública para leitura</li>
                  </ol>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Hero tower={selectedTower} />

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold">RESUMO DA OPORTUNIDADE</h2>
          <div className="flex items-center gap-2">
            <TowerSelector onSelect={setSelectedTower} />
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setShowApiInfo(!showApiInfo)}
              title="Configurar Google Sheets"
            >
              <Settings size={16} />
            </Button>
          </div>
        </div>

        {showApiInfo && (
          <Card className="mb-6 border-primary">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Como conectar sua planilha do Google Sheets:</h3>
              <ol className="list-decimal pl-4 space-y-2">
                <li>Acesse o <a href="https://console.cloud.google.com/" className="text-primary underline" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
                <li>Crie um projeto e habilite a API Google Sheets</li>
                <li>Crie uma chave de API em Credenciais</li>
                <li>Copie a chave para o arquivo sheetsService.ts</li>
                <li>Certifique-se que sua planilha esteja pública para leitura</li>
                <li>Use os mesmos cabeçalhos da planilha de exemplo</li>
              </ol>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <InvestmentCard tower={selectedTower} />
          </div>
          <div>
            <ReturnCard tower={selectedTower} />
          </div>
          <div>
            <ContractCard tower={selectedTower} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <MarketCard tower={selectedTower} />
          </div>
          <div>
            <LocationCard tower={selectedTower} />
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};
