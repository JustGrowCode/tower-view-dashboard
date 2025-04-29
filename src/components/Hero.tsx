
import { Tower } from "@/types/tower";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { DollarSign } from "lucide-react";

interface HeroProps {
  tower: Tower;
}

export const Hero = ({ tower }: HeroProps) => {
  return (
    <div className="bg-[#0b5229] w-full py-12 px-8 text-white">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col items-center text-center">
          <div className="space-y-4 max-w-4xl">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight">
                INVISTA R${formatCurrency(tower.investment.total / 1000)} MIL
              </h1>
              <DollarSign className="w-12 h-12 text-[#FFD700]" />
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-tight">
              TRANSFORME EM <span className="text-[#FFD700]">R${formatCurrency(tower.returns.totalContractValue / 1000000, 2)} MILHÃO</span> EM {tower.contract.duration} ANOS
            </h2>
            
            <div className="flex items-center justify-center mt-2">
              <div className="relative">
                <Card className="bg-[#0e7539] text-white font-bold text-3xl md:text-5xl p-4 px-6 rounded-lg shadow-lg">
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    {tower.returns.roi.toFixed(2)}%
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
