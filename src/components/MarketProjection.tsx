
import { Tower } from "@/types/tower";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from "recharts";

interface MarketProjectionProps {
  tower: Tower;
}

export const MarketProjection = ({ tower }: MarketProjectionProps) => {
  // Generate projection data between current year and projected year
  const generateProjectionData = () => {
    const startYear = tower.market.currentYear;
    const endYear = tower.market.projectedYear;
    const startValue = tower.market.currentValue;
    const endValue = tower.market.projectedValue;
    const yearsCount = endYear - startYear;
    
    const data = [];
    
    for (let i = 0; i <= yearsCount; i++) {
      // Calculate value with compound growth
      const year = startYear + i;
      const growthRate = Math.pow((endValue / startValue), 1 / yearsCount);
      const projectedValue = startValue * Math.pow(growthRate, i);
      
      data.push({
        year: year.toString(),
        mercado: Number(projectedValue.toFixed(1))
      });
    }
    
    return data;
  };

  const projectionData = generateProjectionData();

  return (
    <Card className="bg-[#1a1f2c] border-[#2e3b52] text-white">
      <CardHeader className="bg-[#222a3d] border-b border-[#2e3b52]">
        <CardTitle className="text-white">PROJEÇÃO DE MERCADO</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={projectionData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2e3b52" />
              <XAxis dataKey="year" stroke="#C8C8C9" />
              <YAxis 
                stroke="#C8C8C9" 
                domain={[
                  dataMin => Math.floor(dataMin * 0.9),
                  dataMax => Math.ceil(dataMax * 1.1)
                ]}
              />
              <Tooltip 
                formatter={(value) => `US$ ${value} bilhões`}
                contentStyle={{ backgroundColor: '#222a3d', borderColor: '#2e3b52', color: 'white' }}
              />
              <Legend formatter={(value) => <span style={{color: '#C8C8C9'}}>{value}</span>} />
              <Line 
                type="monotone" 
                dataKey="mercado" 
                name="Mercado Global de Torres (US$ bi)" 
                stroke="#9b87f5" 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="p-3 bg-[#222a3d] rounded border border-[#2e3b52] text-center">
            <div className="text-xs text-gray-400">Região de Crescimento Mais Rápido</div>
            <div className="text-[#0EA5E9] font-semibold mt-1">{tower.market.growthRegion}</div>
          </div>
          <div className="p-3 bg-[#222a3d] rounded border border-[#2e3b52] text-center">
            <div className="text-xs text-gray-400">Maior Mercado</div>
            <div className="text-[#9b87f5] font-semibold mt-1">{tower.market.topMarket}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
