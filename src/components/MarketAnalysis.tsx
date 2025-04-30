
import { Tower } from "@/types/tower";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LabelList 
} from "recharts";

interface MarketAnalysisProps {
  tower: Tower;
}

export const MarketAnalysis = ({ tower }: MarketAnalysisProps) => {
  // Data for the bar chart
  const data = [
    {
      name: tower.market.currentYear.toString(),
      value: tower.market.currentValue,
      fill: "#0EA5E9"
    },
    {
      name: tower.market.projectedYear.toString(),
      value: tower.market.projectedValue,
      fill: "#9b87f5"
    }
  ];

  return (
    <Card className="bg-[#1a1f2c] border-[#2e3b52] text-white">
      <CardHeader className="bg-[#222a3d] border-b border-[#2e3b52]">
        <CardTitle className="text-white">MERCADO DE TORRES</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[250px] mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2e3b52" />
              <XAxis dataKey="name" stroke="#C8C8C9" />
              <YAxis 
                stroke="#C8C8C9"
                label={{ 
                  value: 'US$ Bilhões', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fill: '#C8C8C9', textAnchor: 'middle' } 
                }} 
              />
              <Tooltip 
                formatter={(value) => `US$ ${value} bilhões`}
                contentStyle={{ backgroundColor: '#222a3d', borderColor: '#2e3b52', color: 'white' }}
              />
              <Bar dataKey="value" fill="#8884d8">
                <LabelList dataKey="value" position="top" fill="#C8C8C9" formatter={(value) => `$${value}bi`} />
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-[#222a3d] rounded border border-[#2e3b52]">
            <div className="text-sm text-gray-400 mb-1 text-center">Destaque</div>
            <div className="text-center text-[#0EA5E9] font-semibold">
              {tower.market.topMarket}
            </div>
          </div>
          <div className="p-4 bg-[#222a3d] rounded border border-[#2e3b52]">
            <div className="text-sm text-gray-400 mb-1 text-center">CAGR</div>
            <div className="text-center text-[#9b87f5] font-semibold">
              +{tower.market.cagr.toFixed(2)}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
