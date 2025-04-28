
import { Tower } from "@/types/tower";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface HeroProps {
  tower: Tower;
}

export const Hero = ({ tower }: HeroProps) => {
  return (
    <div className="bg-gradient-to-r from-primary to-primary-700 w-full py-10 px-4 text-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              INVISTA R${formatCurrency(tower.investment.total / 1000)} MIL
            </h1>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              E RECEBA R${formatCurrency(tower.returns.totalContractValue / 1000000)} MILHÃO
            </h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              EM {tower.contract.duration} ANOS
            </h3>
          </div>
          <div className="flex items-center justify-center">
            <Card className="bg-green-500 text-white font-bold text-3xl md:text-5xl p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
              +{tower.returns.roi.toFixed(2)}%
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
