import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { useEffect, useState } from "react";
import { statisticsApi } from "src/api";
import { Chart } from "../charts/style";
import { Skeleton, Stack } from "@mui/material";
import { NoRecordFound } from "src/components/shared";
import { ApexOptions } from "apexcharts";

export const TotalEmployees = () => {
  const [chartSeries, setChartSeries] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleGetTotalEmployees = async () => {
    const response = await statisticsApi.getTotalUsers();

    if (response.data.man > 0 || response.data.women > 0) {
      setChartSeries([response.data.man, response.data.women]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    handleGetTotalEmployees();
  }, []);

  const chartOptions: ApexOptions = {
    labels: ["Male", "Female"],
    colors: ["#06AED4", "#9C27B0"],
    legend: {
      position: "bottom",
      fontSize: "14px",
      fontWeight: 600,
      labels: {
        colors: ["#00A8AD", "#0089FA"],
      },
      formatter: function (val, opts) {
        return `${val} - ${chartSeries[opts.seriesIndex]}`;
      },
    },
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      theme: "dark",
    },
  };

  return (
    <Card style={{ minHeight: 490 }}>
      <CardHeader
        title="Total Employees"
        sx={{
          alignItems: "center",
        }}
        action={
          chartSeries.length ? (
            <Typography variant="h5">
              {chartSeries[0] + chartSeries[1]}
            </Typography>
          ) : (
            <Typography variant="subtitle1">{"No Employee Found"}</Typography>
          )
        }
      />

      <CardContent>
        {isLoading ? (
          <Stack height={300} justifyContent={"center"} alignItems={"center"}>
            <Skeleton variant="circular" width={250} height={250} />
          </Stack>
        ) : chartSeries.length === 0 ? (
          <NoRecordFound />
        ) : (
          <Chart
            height={320}
            options={chartOptions}
            series={chartSeries}
            type="donut"
          />
        )}
      </CardContent>
    </Card>
  );
};
