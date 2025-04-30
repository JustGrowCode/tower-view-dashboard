
import { Tower } from "@/types/tower";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
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

interface MonthlyReturnChartProps {
  tower: Tower;
}

export const MonthlyReturnChart = ({ tower }: MonthlyReturnChartProps) => {
  // Generate monthly data for 12 months
  const generateMonthlyData = () => {
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    return months.map(month => ({
      name: month,
      retorno: tower.returns.monthly,
      meta: tower.returns.monthly * 0.9 // Example target
    }));
  };

  const data = generateMonthlyData();

  return (
    <Card className="bg-[#1a1f2c] border-[#2e3b52] text-white">
      <CardHeader className="bg-[#222a3d] border-b border-[#2e3b52]">
        <CardTitle className="text-white">RETORNO MENSAL</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2e3b52" />
              <XAxis dataKey="name" stroke="#C8C8C9" />
              <YAxis 
                stroke="#C8C8C9"
                tickFormatter={(value) => `R$${(value/1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value) => `R$ ${formatCurrency(Number(value))}`}
                contentStyle={{ backgroundColor: '#222a3d', borderColor: '#2e3b52', color: 'white' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="retorno" 
                name="Retorno Mensal" 
                stroke="#9b87f5" 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="meta" 
                name="Meta" 
                stroke="#0EA5E9" 
                strokeDasharray="5 5" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center text-gray-300">
          <p>Retorno mensal projetado: <span className="text-[#9b87f5] font-semibold">R$ {formatCurrency(tower.returns.monthly)}</span></p>
          <p className="text-xs mt-1">Rentabilidade mensal: {((tower.returns.monthly * 12) / tower.investment.total * 100).toFixed(2)}% a.a.</p>
        </div>
      </CardContent>
    </Card>
  );
};
