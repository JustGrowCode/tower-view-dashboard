
import { useState } from "react";
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

export const Dashboard = () => {
  const [selectedTower, setSelectedTower] = useState<Tower | null>(null);

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
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Hero tower={selectedTower} />

      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">RESUMO DA OPORTUNIDADE</h2>
          <TowerSelector onSelect={setSelectedTower} />
        </div>

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
