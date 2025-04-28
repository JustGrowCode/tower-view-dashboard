
import { Tower } from "@/types/tower";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface ContractCardProps {
  tower: Tower;
}

export const ContractCard = ({ tower }: ContractCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="bg-slate-50 border-b">
        <CardTitle>CONTRATO</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-4xl font-bold mb-2 text-center">
          {tower.contract.duration} anos
        </div>
        <div className="text-lg text-center mb-6">
          ({tower.contract.periods})
        </div>

        <div className="flex flex-col items-center justify-center mb-8">
          <div className="text-primary">
            <TrendingUp size={48} />
          </div>
          <div className="text-2xl font-bold text-info mt-2">
            +{tower.market.cagr.toFixed(2)}%
          </div>
          <div className="text-md text-gray-600">CAGR</div>
        </div>

        <div className="mt-6 p-4 bg-slate-50 rounded flex flex-col items-center">
          <div className="text-lg font-semibold mb-2">
            Lucratividade ao<br/>término do contrato
          </div>
          <div className="text-xl font-bold text-info">
            {tower.contract.expiryLucrativePercentage.toFixed(2)}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
