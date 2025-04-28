
import { Tower } from "@/types/tower";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface InvestmentCardProps {
  tower: Tower;
}

export const InvestmentCard = ({ tower }: InvestmentCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="bg-slate-50 border-b">
        <CardTitle>INVESTIMENTO</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-4xl font-bold mb-6">
          R${formatCurrency(tower.investment.total)}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <span>Valor do terreno</span>
            <span className="font-semibold">R${formatCurrency(tower.investment.land)}</span>
          </div>

          <div className="flex justify-between items-center border-b pb-2">
            <span>Estrutura e taça</span>
            <span className="font-semibold">R${formatCurrency(tower.investment.structure)}</span>
          </div>

          <div className="flex justify-between items-center border-b pb-2">
            <span>Equipamentos</span>
            <span className="font-semibold">R${formatCurrency(tower.investment.equipment)}</span>
          </div>

          {tower.investment.other > 0 && (
            <div className="flex justify-between items-center border-b pb-2">
              <span>Outros</span>
              <span className="font-semibold">R${formatCurrency(tower.investment.other)}</span>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-slate-50 rounded">
          <p className="text-center">
            {tower.investment.locationDetails}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
