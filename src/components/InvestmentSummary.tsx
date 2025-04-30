
import { Tower } from "@/types/tower";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InvestmentSummaryProps {
  tower: Tower;
}

export const InvestmentSummary = ({ tower }: InvestmentSummaryProps) => {
  return (
    <Card className="bg-[#1a1f2c] border-[#2e3b52] text-white h-full">
      <CardHeader className="bg-[#222a3d] border-b border-[#2e3b52]">
        <CardTitle className="text-white">INVESTIMENTO</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-3xl font-bold mb-6 text-[#9b87f5]">
          R${formatCurrency(tower.investment.total)}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-[#2e3b52] pb-2">
            <span className="text-gray-300">Valor do terreno</span>
            <span className="font-semibold text-white">R${formatCurrency(tower.investment.land)}</span>
          </div>

          <div className="flex justify-between items-center border-b border-[#2e3b52] pb-2">
            <span className="text-gray-300">Estrutura e taça</span>
            <span className="font-semibold text-white">R${formatCurrency(tower.investment.structure)}</span>
          </div>

          <div className="flex justify-between items-center border-b border-[#2e3b52] pb-2">
            <span className="text-gray-300">Equipamentos</span>
            <span className="font-semibold text-white">R${formatCurrency(tower.investment.equipment)}</span>
          </div>

          {tower.investment.other > 0 && (
            <div className="flex justify-between items-center border-b border-[#2e3b52] pb-2">
              <span className="text-gray-300">Outros</span>
              <span className="font-semibold text-white">R${formatCurrency(tower.investment.other)}</span>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-[#222a3d] rounded border border-[#2e3b52]">
          <p className="text-center text-gray-300">
            {tower.investment.locationDetails}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
