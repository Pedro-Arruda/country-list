import { Chart } from "react-google-charts";

const generateRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

export function BarChart({ data }: any) {
  const colors = data.slice(1).map(() => generateRandomColor());

  console.log(colors);

  return (
    <Chart
      chartType="ColumnChart"
      width="100%"
      height="300px"
      data={data}
      options={{
        backgroundColor: "transparent",
        hAxis: {
          textStyle: { color: "#dddddd" },
          format: "0",
        },
        vAxis: {
          textStyle: { color: "#dddddd" },
          gridlines: {
            color: "#444444",
            count: 2,
          },
          minorGridlines: {
            color: "#333333",
          },
          format: "0",
        },
        legend: {
          position: "top",
          textStyle: { color: "#dddddd" },
        },

        colors: ["#f49595", "#f9eb97", "#e2bbfd", "#d4f1b7"],
      }}
    />
  );
}
