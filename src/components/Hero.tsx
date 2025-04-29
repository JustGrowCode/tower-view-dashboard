
import { Tower } from "@/types/tower";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { DollarSign } from "lucide-react";

interface HeroProps {
  tower: Tower;
}

export const Hero = ({ tower }: HeroProps) => {
  return (
    <div className="bg-[#0b5229] w-full py-16 px-8 text-white">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <div className="space-y-6 max-w-4xl">
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight mb-2">
                INVISTA
              </h1>
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight">
                  R${formatCurrency(tower.investment.total / 1000)} MIL
                </h1>
                <DollarSign className="w-12 h-12 text-[#FFD700]" />
              </div>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-tight">
              TRANSFORME EM
            </h2>
            
            <h3 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight text-[#FFD700]">
              R${formatCurrency(tower.returns.totalContractValue / 1000000, 2)} MILHÃO
            </h3>
            
            <div className="flex flex-col items-center">
              <h4 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-tight mb-2">
                EM {tower.contract.duration} ANOS
              </h4>
              
              <div className="flex items-center justify-center mt-6">
                <div className="relative">
                  <div className="absolute -left-12 -top-6">
                    <svg className="w-10 h-10 text-[#FFD700]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 3C16.418 3 20 6.582 20 11C20 15.418 16.418 19 12 19C7.582 19 4 15.418 4 11C4 6.582 7.582 3 12 3ZM12 7C9.791 7 8 8.791 8 11C8 13.209 9.791 15 12 15C14.209 15 16 13.209 16 11C16 8.791 14.209 7 12 7Z" />
                    </svg>
                  </div>
                  <Card className="bg-[#0e7539] text-white font-bold text-3xl md:text-5xl p-6 px-8 rounded-lg shadow-lg">
                    <div className="flex items-center gap-2">
                      <svg className="w-6 h-6 transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      {tower.returns.roi.toFixed(2)}%
                    </div>
                  </Card>
                  <div className="absolute -right-10 bottom-0">
                    <svg className="w-16 h-8 text-[#FFD700]" viewBox="0 0 24 24" fill="none">
                      <path d="M17 3C19.2091 3 21 4.79086 21 7C21 9.20914 19.2091 11 17 11C14.7909 11 13 9.20914 13 7C13 4.79086 14.7909 3 17 3ZM17 5C15.9046 5 15 5.90457 15 7C15 8.09543 15.9046 9 17 9C18.0954 9 19 8.09543 19 7C19 5.90457 18.0954 5 17 5Z" fill="currentColor" />
                      <path d="M7 13C9.20914 13 11 14.7909 11 17C11 19.2091 9.20914 21 7 21C4.79086 21 3 19.2091 3 17C3 14.7909 4.79086 13 7 13ZM7 15C5.90457 15 5 15.9046 5 17C5 18.0954 5.90457 19 7 19C8.09543 19 9 18.0954 9 17C9 15.9046 8.09543 15 7 15Z" fill="currentColor" />
                      <path d="M8.31412 5.68588C8.70464 5.29535 9.33781 5.29535 9.72833 5.68588L18.3137 14.2712C18.7042 14.6618 18.7042 15.2949 18.3137 15.6854C17.9232 16.076 17.29 16.076 16.8995 15.6854L8.31412 7.10009C7.9236 6.70957 7.9236 6.0764 8.31412 5.68588Z" fill="currentColor" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
