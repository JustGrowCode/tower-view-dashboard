
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash } from "lucide-react";
import { refreshTowersData, clearAllCache } from "@/services/sheetsService";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const RefreshDataButton = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'planilha' | 'demo' | 'cache' | 'desconhecido'>('desconhecido');
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  
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
      const result = await refreshTowersData();
      
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
      
      if (result && result.length > 0 && result[0].source === 'sheets') {
        toast.success("Dados atualizados com sucesso da planilha!");
      } else if (result && result.length > 0 && result[0].source === 'cache') {
        toast.warning("Usando dados em cache. Não foi possível obter novos dados da planilha.");
      } else {
        toast.error("Usando dados de demonstração. Não foi possível obter dados da planilha.");
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Erro ao atualizar dados");
      setDataSource('demo');
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };
  
  const handleClearCache = async () => {
    try {
      await clearAllCache();
      toast.success("Cache limpo com sucesso. Atualizando dados...");
      handleRefresh();
    } catch (error) {
      console.error("Error clearing cache:", error);
      toast.error("Erro ao limpar cache");
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
      <div className="flex gap-2 mb-1">
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
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-[#2a2430] text-[#ff9797] border-[#3e2e3b] hover:bg-[#3e2e3b] hover:text-white"
            >
              <Trash className="mr-2 h-4 w-4" />
              Limpar cache
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-[#1a1f2c] border-[#2e3b52] text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Limpar Cache</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-300">
                Esta ação removerá todos os dados em cache e forçará uma nova requisição à planilha. Continuar?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-[#222a3d] text-white border-[#2e3b52] hover:bg-[#2c374d]">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleClearCache} 
                className="bg-[#2a2430] text-[#ff9797] border-[#3e2e3b] hover:bg-[#3e2e3b]"
              >
                Limpar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">
          Última atualização: {formattedLastUpdate}
          {dataSource === 'planilha' && <span className="text-green-400"> (Planilha)</span>}
          {dataSource === 'cache' && <span className="text-yellow-400"> (Cache)</span>}
          {dataSource === 'demo' && <span className="text-red-400"> (Demo)</span>}
        </span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-5 px-1 py-0 text-xs text-gray-400 hover:text-white"
          onClick={() => setShowDiagnostics(!showDiagnostics)}
        >
          {showDiagnostics ? 'Ocultar diagnóstico' : 'Diagnóstico'}
        </Button>
      </div>
      
      {showDiagnostics && (
        <div className="mt-2 p-2 bg-[#0a121f] border border-[#2e3b52] rounded text-xs text-gray-400 w-full overflow-auto max-h-32">
          <p>API Key configurada: {window.localStorage.getItem('googleAPIConfigured') === 'true' ? 'Sim' : 'Não'}</p>
          <p>Última resposta HTTP: {localStorage.getItem('lastHttpStatus') || 'Nenhuma'}</p>
          <p>Cache disponível: {localStorage.getItem('cachedTowers') ? 'Sim' : 'Não'}</p>
          <p>Proxies tentados: {localStorage.getItem('proxiesAttempted') || 'Nenhum'}</p>
        </div>
      )}
    </div>
  );
};
