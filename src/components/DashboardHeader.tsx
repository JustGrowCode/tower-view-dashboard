
import { Tower } from "@/types/tower";
import { TowerSelector } from "./TowerSelector";
import { formatCurrency } from "@/lib/utils";
import { RefreshDataButton } from "./RefreshDataButton";
import { Image } from "lucide-react";

interface DashboardHeaderProps {
  tower: Tower;
  onSelectTower: (tower: Tower) => void;
  towers: Tower[];
}

export const DashboardHeader = ({ tower, onSelectTower, towers }: DashboardHeaderProps) => {
  return (
    <div className="bg-[#1a1f2c] w-full py-6 px-8 border-b border-[#2e3b52]">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-[#222a3d] p-2 rounded-lg border border-[#2e3b52]">
              <Image className="h-8 w-8 text-[#b097ff]" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              <span className="text-[#b097ff]">Telecom</span> Towers Invest
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <TowerSelector onSelect={onSelectTower} availableTowers={towers} />
            <RefreshDataButton />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#222a3d] p-4 rounded-lg border border-[#2e3b52] text-center">
            <div className="text-sm text-gray-300 mb-1">Investimento</div>
            <div className="text-2xl font-bold text-white">R$ {formatCurrency(tower.investment.total)}</div>
            <div className="text-xs text-[#b097ff]">Terreno + Estrutura + Equipamentos</div>
          </div>
          
          <div className="bg-[#222a3d] p-4 rounded-lg border border-[#2e3b52] text-center">
            <div className="text-sm text-gray-300 mb-1">Retorno Mensal</div>
            <div className="text-2xl font-bold text-white">R$ {formatCurrency(tower.returns.monthly)}</div>
            <div className="text-xs text-[#b097ff]">
              {((tower.returns.monthly * 12) / tower.investment.total * 100).toFixed(2)}% a.a.
            </div>
          </div>
          
          <div className="bg-[#222a3d] p-4 rounded-lg border border-[#2e3b52] text-center">
            <div className="text-sm text-gray-300 mb-1">ROI Total ({tower.contract.duration} anos)</div>
            <div className="text-2xl font-bold text-[#b097ff]">{tower.returns.roi.toFixed(2)}%</div>
            <div className="text-xs text-white">Contrato: {tower.contract.periods}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
