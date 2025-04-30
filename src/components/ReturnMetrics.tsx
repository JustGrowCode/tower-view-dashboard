
import { Tower } from "@/types/tower";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Badge } from "@/components/ui/badge";

interface ReturnMetricsProps {
  tower: Tower;
}

export const ReturnMetrics = ({ tower }: ReturnMetricsProps) => {
  // Calculate monthly and annual percentage returns
  const monthlyReturnPercentage = ((tower.returns.monthly * 12) / tower.investment.total) * 100;
  const annualReturnPercentage = (tower.returns.annual / tower.investment.total) * 100;
  
  // Data for the pie chart
  const data = [
    { name: "Operadora", value: tower.returns.operatorFee },
    { name: "Investidor", value: tower.returns.monthly * 12 * tower.contract.duration },
  ];

  const COLORS = ["#0EA5E9", "#9b87f5"];

  return (
    <Card className="bg-[#1a1f2c] border-[#2e3b52] text-white h-full">
      <CardHeader className="bg-[#222a3d] border-b border-[#2e3b52]">
        <CardTitle className="text-white">RETORNO FINANCEIRO</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="text-sm text-gray-400">Mensal</div>
            <div className="text-2xl font-bold text-[#9b87f5]">
              R${formatCurrency(tower.returns.monthly)}
            </div>
            <Badge variant="outline" className="mt-1 bg-[#222a3d] text-[#9b87f5] border-[#2e3b52]">
              {monthlyReturnPercentage.toFixed(2)}% a.m.
            </Badge>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-400">Anual</div>
            <div className="text-2xl font-bold text-[#9b87f5]">
              R${formatCurrency(tower.returns.annual)}
            </div>
            <Badge variant="outline" className="mt-1 bg-[#222a3d] text-[#9b87f5] border-[#2e3b52]">
              {annualReturnPercentage.toFixed(2)}% a.a.
            </Badge>
          </div>
        </div>

        <div className="text-center mb-4">
          <div className="text-sm text-gray-400">Total do Contrato</div>
          <div className="text-3xl font-bold text-[#9b87f5]">
            R${formatCurrency(tower.returns.totalContractValue)}
          </div>
          <Badge variant="outline" className="mt-1 bg-[#222a3d] text-[#9b87f5] border-[#2e3b52]">
            {tower.returns.roi.toFixed(2)}% total
          </Badge>
        </div>

        <div className="text-[#0EA5E9] font-semibold text-center my-4">
          +R${formatCurrency(tower.returns.operatorFee)} raes da operadora
        </div>

        <div className="h-[140px] my-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={55}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `R$ ${formatCurrency(Number(value))}`}
                contentStyle={{ backgroundColor: '#222a3d', borderColor: '#2e3b52', color: 'white' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col items-center bg-[#222a3d] p-3 rounded-lg border border-[#2e3b52]">
          <div className="text-sm text-gray-400 mb-1">Payback</div>
          <div className="text-xl text-white">
            {tower.contract.payback} meses
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
