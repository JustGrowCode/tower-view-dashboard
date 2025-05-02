
import { useState, useEffect } from "react";
import { Tower } from "@/types/tower";
import { fetchTowers } from "@/services/sheetsService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface TowerSelectorProps {
  onSelect: (tower: Tower) => void;
  availableTowers?: Tower[]; // Optional pre-loaded towers
}

export const TowerSelector = ({ onSelect, availableTowers }: TowerSelectorProps) => {
  const [towers, setTowers] = useState<Tower[]>(availableTowers || []);
  const [isLoading, setIsLoading] = useState(!availableTowers);
  const [isMockData, setIsMockData] = useState(false);

  useEffect(() => {
    // If we already have towers provided, use those
    if (availableTowers && availableTowers.length > 0) {
      setTowers(availableTowers);
      setIsLoading(false);
      // Check if using mock data based on the source property
      setIsMockData(availableTowers[0]?.source === 'mock');
      return;
    }

    async function loadTowers() {
      try {
        setIsLoading(true);
        console.log("TowerSelector: Fetching towers data...");
        const data = await fetchTowers();
        console.log("TowerSelector: Received towers data:", data);
        
        setTowers(data);
        
        // Check if using mock data based on source property
        setIsMockData(data[0]?.source === 'mock');
        
        if (data.length > 0) {
          onSelect(data[0]);
        }
      } catch (error) {
        console.error("Failed to load towers:", error);
        setIsMockData(true);
      } finally {
        setIsLoading(false);
      }
    }

    if (isLoading) {
      loadTowers();
    }
  }, [onSelect, availableTowers, isLoading]);

  // Update local state when availableTowers change
  useEffect(() => {
    if (availableTowers && availableTowers.length > 0) {
      setTowers(availableTowers);
      // Check if using mock data based on source property
      setIsMockData(availableTowers[0]?.source === 'mock');
    }
  }, [availableTowers]);

  const handleChange = (value: string) => {
    const selected = towers.find((tower) => tower.id === value);
    if (selected) {
      onSelect(selected);
    }
  };

  return (
    <div className="w-full max-w-xs">
      <Select onValueChange={handleChange} disabled={isLoading}>
        <SelectTrigger className="w-full bg-[#222a3d] border-[#2e3b52] text-white">
          {isLoading ? (
            <div className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Carregando torres...</span>
            </div>
          ) : (
            <div className="flex items-center">
              <SelectValue placeholder="Selecione uma torre" />
              {isMockData && (
                <span className="ml-2 text-xs text-amber-400">(Demo)</span>
              )}
            </div>
          )}
        </SelectTrigger>
        <SelectContent className="bg-[#222a3d] border-[#2e3b52]">
          {isMockData && (
            <div className="px-2 py-1 text-xs text-amber-400 border-b border-[#2e3b52]">
              Usando dados de demonstração
            </div>
          )}
          
          {towers.map((tower) => (
            <SelectItem 
              key={tower.id} 
              value={tower.id} 
              className="text-white hover:bg-[#2e3b52] focus:bg-[#2e3b52] focus:text-white data-[highlighted]:text-white data-[highlighted]:bg-[#2e3b52]"
            >
              {tower.name} - {tower.location}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
