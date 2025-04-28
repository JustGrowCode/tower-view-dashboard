
import { Tower } from "@/types/tower";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface HeroProps {
  tower: Tower;
}

export const Hero = ({ tower }: HeroProps) => {
  return (
    <div className="bg-primary w-full py-10 px-4 text-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
              INVISTA R${formatCurrency(tower.investment.total / 1000)} MIL
            </h1>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
              E RECEBA R${formatCurrency(tower.returns.totalContractValue / 1000000)} MILHÃO
            </h2>
            <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              EM {tower.contract.duration} ANOS
            </h3>
          </div>
          <div className="flex items-center justify-center md:justify-end">
            <Card className="bg-highlight text-white font-bold text-3xl md:text-5xl p-6 rounded-lg shadow-lg">
              +{tower.returns.roi.toFixed(2)}%
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
