
import { cn } from "@/lib/utils";

export const Footer = () => {
  return (
    <div className={cn(
      "bg-gradient-to-r from-primary to-primary-700 w-full py-8 px-4 text-white text-center",
      "mt-12 shadow-lg"
    )}>
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-6">
          RENTABILIDADE SUPERIOR À IMÓVEIS TRADICIONAIS
        </h2>
        <h3 className="text-xl md:text-3xl font-bold">
          HORA DE INVESTIR EM INFRAESTRUTURA!
        </h3>
        <div className="mt-8 text-sm opacity-75">
          © {new Date().getFullYear()} Torres Telecom • Todos os direitos reservados
        </div>
      </div>
    </div>
  );
};
