
import { Tower } from "@/types/tower";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Badge } from "@/components/ui/badge";

interface ReturnCardProps {
  tower: Tower;
}

export const ReturnCard = ({ tower }: ReturnCardProps) => {
  // Calculate monthly and annual percentage returns
  const monthlyReturnPercentage = ((tower.returns.monthly * 12) / tower.investment.total) * 100;
  const annualReturnPercentage = tower.returns.annual / tower.investment.total * 100;
  
  // Data for the pie chart
  const data = [
    { name: "Operadora", value: tower.returns.operatorFee },
    { name: "Investidor", value: tower.returns.monthly * 12 * tower.contract.duration },
  ];

  const COLORS = ["#0088FE", "#22c55e"];

  return (
    <Card className="h-full">
      <CardHeader className="bg-slate-50 border-b">
        <CardTitle>RETORNO FINANCEIRO</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="text-sm text-gray-600">Mensal</div>
            <div className="text-2xl font-bold text-green-600">
              R${formatCurrency(tower.returns.monthly)}
            </div>
            <Badge variant="outline" className="mt-1 bg-green-50 text-green-700">
              {monthlyReturnPercentage.toFixed(2)}% a.m.
            </Badge>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-600">Anual</div>
            <div className="text-2xl font-bold text-green-600">
              R${formatCurrency(tower.returns.annual)}
            </div>
            <Badge variant="outline" className="mt-1 bg-green-50 text-green-700">
              {annualReturnPercentage.toFixed(2)}% a.a.
            </Badge>
          </div>
        </div>

        <div className="text-center mb-4">
          <div className="text-sm text-gray-600">Total do Contrato</div>
          <div className="text-3xl font-bold text-green-600">
            R${formatCurrency(tower.returns.totalContractValue)}
          </div>
          <Badge variant="outline" className="mt-1 bg-green-50 text-green-700">
            {tower.returns.roi.toFixed(2)}% total
          </Badge>
        </div>

        <div className="text-info font-semibold text-center my-4">
          +R${formatCurrency(tower.returns.operatorFee)} raes da operadora
        </div>

        <div className="h-[180px] my-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
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
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-lg font-semibold mb-1">Payback</div>
          <div className="text-xl">
            {tower.contract.payback} meses
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
