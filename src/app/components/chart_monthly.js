import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

let barColors = [
  "#FF3DD3",
  "#FAFF0B",
  "#3CFF0F",
  "rgba(191, 11, 255, 0.91)",
  "#FFA203",
];

function BarPlot(props) {
  const { filteredSharesInfo } = props;
  const rechartsData = filteredSharesInfo.map((item, index) => ({
    symbol: item.symbol.slice(0, -2),
    gainLoss: item.gainLoss,
  }));
  //   console.log(rechartsData);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        // width={340}
        // height={350}
        data={rechartsData}
        margin={{
          top: 10,
          right: 5,
          left: -5,
          bottom: 0,
        }}
      >
        <XAxis dataKey="symbol" stroke={"white"} />
        <YAxis type="number" stroke={"white"} />
        <Tooltip />
        <Bar dataKey="gainLoss" fill="#FF3DD3">
          {rechartsData.map((entry, index) => {
            const color = barColors[index % barColors.length];
            return <Cell fill={color} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
export default BarPlot;
