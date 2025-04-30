
import { cn } from "@/lib/utils";

export const Footer = () => {
  return (
    <div className={cn(
      "bg-[#1a1f2c] w-full py-6 px-4 text-white text-center border-t border-[#2e3b52]",
      "mt-auto"
    )}>
      <div className="container mx-auto">
        <h3 className="text-xl md:text-2xl font-bold text-[#9b87f5]">
          INVISTA EM INFRAESTRUTURA DE TELECOMUNICAÇÕES
        </h3>
        <div className="mt-2 text-sm text-gray-400">
          © {new Date().getFullYear()} Torres Telecom • Todos os direitos reservados
        </div>
      </div>
    </div>
  );
};
