
import { Tower } from "@/types/tower";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

interface MarketCardProps {
  tower: Tower;
}

export const MarketCard = ({ tower }: MarketCardProps) => {
  // Data for the bar chart
  const data = [
    {
      name: tower.market.currentYear.toString(),
      value: tower.market.currentValue
    },
    {
      name: tower.market.projectedYear.toString(),
      value: tower.market.projectedValue
    }
  ];

  return (
    <Card className="h-full">
      <CardHeader className="bg-slate-50 border-b">
        <CardTitle>MERCADO DE TORRES</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[200px] mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis 
                label={{ 
                  value: 'US$ Bilhões', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }} 
              />
              <Tooltip formatter={(value) => `US$ ${value} bi`} />
              <Bar dataKey="value" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded">
            <div className="text-lg font-semibold mb-1 text-center">Destaque</div>
            <div className="text-center text-info">
              {tower.market.topMarket}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
