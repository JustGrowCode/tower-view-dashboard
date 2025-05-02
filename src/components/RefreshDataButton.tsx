
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { refreshTowersData } from "@/services/sheetsService";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const RefreshDataButton = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'planilha' | 'demo' | 'cache' | 'desconhecido'>('desconhecido');
  
  // Get last update time from localStorage on component mount
  useEffect(() => {
    const lastFetchTime = localStorage.getItem('lastFetchTime');
    const lastSuccessfulFetch = localStorage.getItem('lastSuccessfulFetch');
    
    if (lastSuccessfulFetch) {
      setLastUpdate(lastSuccessfulFetch);
      setDataSource('planilha');
    } else if (lastFetchTime) {
      setLastUpdate(lastFetchTime);
      setDataSource('cache');
    }
  }, []);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshTowersData();
      
      // Update the last update time
      const lastSuccessfulFetch = localStorage.getItem('lastSuccessfulFetch');
      if (lastSuccessfulFetch) {
        setLastUpdate(lastSuccessfulFetch);
        setDataSource('planilha');
      } else {
        const lastFetchTime = localStorage.getItem('lastFetchTime');
        if (lastFetchTime) {
          setLastUpdate(lastFetchTime);
          setDataSource('cache');
        } else {
          setDataSource('demo');
        }
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Erro ao atualizar dados");
      setDataSource('demo');
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
      <span className="text-xs text-gray-400">
        Última atualização: {formattedLastUpdate}
        {dataSource === 'planilha' && <span className="text-green-400"> (Planilha)</span>}
        {dataSource === 'cache' && <span className="text-yellow-400"> (Cache)</span>}
        {dataSource === 'demo' && <span className="text-red-400"> (Demo)</span>}
      </span>
    </div>
  );
};
