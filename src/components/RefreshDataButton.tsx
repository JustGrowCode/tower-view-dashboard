
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { refreshTowersData } from "@/services/sheetsService";

export const RefreshDataButton = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshTowersData();
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleRefresh} 
      disabled={isRefreshing}
      className="bg-[#222a3d] border-[#2e3b52] hover:bg-[#2e3b52] text-white hover:text-white"
    >
      <RefreshCcw 
        className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} 
      />
      {isRefreshing ? 'Atualizando...' : 'Atualizar dados'}
    </Button>
  );
};
