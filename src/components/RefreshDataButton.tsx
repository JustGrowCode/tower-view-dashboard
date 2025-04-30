
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { refreshTowersData } from "@/services/sheetsService";
import { useState } from "react";

export const RefreshDataButton = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshTowersData();
    setTimeout(() => setIsRefreshing(false), 1000);
  };
  
  return (
    <Button 
      onClick={handleRefresh}
      variant="outline" 
      size="sm"
      disabled={isRefreshing}
      className="bg-[#222a3d] text-[#b097ff] border-[#2e3b52] hover:bg-[#2c374d] hover:text-white font-medium"
    >
      <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      {isRefreshing ? 'Atualizando...' : 'Atualizar dados'}
    </Button>
  );
};
