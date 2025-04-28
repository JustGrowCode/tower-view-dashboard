
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
}

export const TowerSelector = ({ onSelect }: TowerSelectorProps) => {
  const [towers, setTowers] = useState<Tower[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

    loadTowers();
  }, [onSelect]);

  const handleChange = (value: string) => {
    const selected = towers.find((tower) => tower.id === value);
    if (selected) {
      onSelect(selected);
    }
  };

  return (
    <div className="w-full max-w-xs">
      <Select onValueChange={handleChange} disabled={isLoading}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione uma torre"} />
        </SelectTrigger>
        <SelectContent>
          {towers.map((tower) => (
            <SelectItem key={tower.id} value={tower.id}>
              {tower.name} - {tower.location}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
