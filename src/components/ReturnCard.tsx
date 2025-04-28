
import { Tower } from "@/types/tower";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface ReturnCardProps {
  tower: Tower;
}

export const ReturnCard = ({ tower }: ReturnCardProps) => {
  // Data for the pie chart
  const data = [
    { name: "Operadora", value: tower.returns.operatorFee },
    { name: "Investidor", value: tower.returns.monthly * 12 * tower.contract.duration },
  ];

  const COLORS = ["#0088FE", "#00C49F"];

  return (
    <Card className="h-full">
      <CardHeader className="bg-slate-50 border-b">
        <CardTitle>RETORNO MENSAL</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-4xl font-bold mb-6 text-center">
          R${formatCurrency(tower.returns.monthly)}
        </div>

        <div className="text-info font-semibold text-center mb-4">
          +{formatCurrency(tower.returns.operatorFee)} raes da operadora
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
