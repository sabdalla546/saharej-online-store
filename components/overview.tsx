"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
interface overviewProps {
  data: any[];
}

const OverView: React.FC<overviewProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#fd6004"
          fontSize={14}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#fd6004"
          fontSize={14}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar dataKey="total" fill="#0c7da0" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default OverView;
