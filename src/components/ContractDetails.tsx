
import { Tower } from "@/types/tower";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ContractDetailsProps {
  tower: Tower;
}

export const ContractDetails = ({ tower }: ContractDetailsProps) => {
  return (
    <Card className="bg-[#1a1f2c] border-[#2e3b52] text-white h-full">
      <CardHeader className="bg-[#222a3d] border-b border-[#2e3b52]">
        <CardTitle className="text-white">CONTRATO</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-3xl font-bold mb-2 text-center text-white">
          {tower.contract.duration} anos
        </div>
        <div className="text-base text-center mb-6 text-gray-300">
          ({tower.contract.periods})
        </div>

        <div className="flex flex-col items-center justify-center mb-8">
          <div className="text-[#9b87f5]">
            <TrendingUp size={42} />
          </div>
          <div className="text-2xl font-bold text-[#9b87f5] mt-2">
            +{tower.market.cagr.toFixed(2)}%
          </div>
          <div className="text-md text-gray-400">
            CAGR {tower.market.currentYear}-{tower.market.projectedYear}
          </div>
        </div>

        <div className="mt-2 p-4 bg-[#222a3d] rounded border border-[#2e3b52] flex flex-col items-center">
          <div className="text-sm text-gray-400 mb-2">
            Lucratividade ao<br/>término do contrato
          </div>
          <Badge className="text-lg bg-[#9b87f5] text-white hover:bg-[#8a78e0]">
            {tower.contract.expiryLucrativePercentage.toFixed(2)}%
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
