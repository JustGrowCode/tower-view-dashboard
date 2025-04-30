
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { refreshTowersData } from "@/services/sheetsService";

export const RefreshDataButton = () => {
  return (
    <Button 
      onClick={refreshTowersData}
      variant="outline" 
      size="sm"
      className="bg-[#222a3d] text-[#9b87f5] border-[#2e3b52] hover:bg-[#2c374d] hover:text-white"
    >
      <RefreshCw className="mr-2 h-4 w-4" />
      Atualizar dados
    </Button>
  );
};
