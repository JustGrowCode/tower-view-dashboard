
import { cn } from "@/lib/utils";

export const Footer = () => {
  return (
    <div className={cn(
      "bg-[#0b5229] w-full py-6 px-4 text-white text-center",
      "mt-12 shadow-lg"
    )}>
      <div className="container mx-auto">
        <h3 className="text-xl md:text-2xl font-bold mb-2">
          HORA DE INVESTIR EM INFRAESTRUTURA!
        </h3>
        <div className="mt-2 text-sm opacity-75">
          © {new Date().getFullYear()} Torres Telecom • Todos os direitos reservados
        </div>
      </div>
    </div>
  );
};
