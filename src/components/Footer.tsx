
import { cn } from "@/lib/utils";

export const Footer = () => {
  return (
    <div className={cn(
      "bg-primary w-full py-6 px-4 text-white text-center",
      "mt-12"
    )}>
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">
          RENTABILIDADE SUPERIOR À IMÓVEIS TRADICIONAIS
        </h2>
        <h3 className="text-xl md:text-3xl font-bold">
          HORA DE INVESTIR EM INFRAESTRUTURA!
        </h3>
      </div>
    </div>
  );
};
