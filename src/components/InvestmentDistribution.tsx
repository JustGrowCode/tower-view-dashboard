
import { Tower } from "@/types/tower";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from "recharts";

interface InvestmentDistributionProps {
  tower: Tower;
}

export const InvestmentDistribution = ({ tower }: InvestmentDistributionProps) => {
  const investmentData = [
    { name: "Terreno", value: tower.investment.land },
    { name: "Estrutura", value: tower.investment.structure },
    { name: "Equipamentos", value: tower.investment.equipment }
  ];
  
  if (tower.investment.other > 0) {
    investmentData.push({ name: "Outros", value: tower.investment.other });
  }

  const COLORS = ["#9b87f5", "#0EA5E9", "#60A5FA", "#818CF8"];

  return (
    <Card className="bg-[#1a1f2c] border-[#2e3b52] text-white">
      <CardHeader className="bg-[#222a3d] border-b border-[#2e3b52]">
        <CardTitle className="text-white">DISTRIBUIÇÃO DO INVESTIMENTO</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={investmentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              >
                {investmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `R$ ${formatCurrency(Number(value))}`}
                contentStyle={{ backgroundColor: '#222a3d', borderColor: '#2e3b52', color: 'white' }}
              />
              <Legend formatter={(value) => <span style={{color: '#C8C8C9'}}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center text-gray-300">
          <p>Total do investimento: <span className="text-[#9b87f5] font-semibold">R$ {formatCurrency(tower.investment.total)}</span></p>
        </div>
      </CardContent>
    </Card>
  );
};
