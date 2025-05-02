
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { refreshTowersData } from "@/services/sheetsService";
import { useState, useEffect } from "react";

export const RefreshDataButton = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  
  // Get last update time from localStorage on component mount
  useEffect(() => {
    const lastFetchTime = localStorage.getItem('lastFetchTime');
    if (lastFetchTime) {
      setLastUpdate(lastFetchTime);
    }
  }, []);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshTowersData();
      
      // Update the last update time
      const newUpdateTime = localStorage.getItem('lastFetchTime');
      if (newUpdateTime) {
        setLastUpdate(newUpdateTime);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };
  
  // Format the last update time
  const formattedLastUpdate = lastUpdate ? 
    new Date(lastUpdate).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }) : 'Nunca';
  
  return (
    <div className="flex flex-col items-end">
      <Button 
        onClick={handleRefresh}
        variant="outline" 
        size="sm"
        disabled={isRefreshing}
        className="bg-[#222a3d] text-[#b097ff] border-[#2e3b52] hover:bg-[#2c374d] hover:text-white font-medium mb-1"
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        {isRefreshing ? 'Atualizando...' : 'Atualizar dados'}
      </Button>
      <span className="text-xs text-gray-400">Última atualização: {formattedLastUpdate}</span>
    </div>
  );
};
