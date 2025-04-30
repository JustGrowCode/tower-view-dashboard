
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

interface TowerSelectorProps {
  onSelect: (tower: Tower) => void;
  availableTowers?: Tower[]; // Optional pre-loaded towers
}

export const TowerSelector = ({ onSelect, availableTowers }: TowerSelectorProps) => {
  const [towers, setTowers] = useState<Tower[]>(availableTowers || []);
  const [isLoading, setIsLoading] = useState(!availableTowers);

  useEffect(() => {
    // If we already have towers provided, use those
    if (availableTowers && availableTowers.length > 0) {
      setTowers(availableTowers);
      setIsLoading(false);
      return;
    }

    async function loadTowers() {
      try {
        const data = await fetchTowers();
        setTowers(data);
        if (data.length > 0) {
          onSelect(data[0]);
        }
      } catch (error) {
        console.error("Failed to load towers:", error);
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
          <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione uma torre"} />
        </SelectTrigger>
        <SelectContent className="bg-[#222a3d] border-[#2e3b52] text-white">
          {towers.map((tower) => (
            <SelectItem key={tower.id} value={tower.id} className="hover:bg-[#2e3b52]">
              {tower.name} - {tower.location}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
