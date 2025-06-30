import React, { lazy, Suspense, useMemo } from "react";

import { useList, useNavigation } from "@refinedev/core";
import type { GetFieldsFromList } from "@refinedev/nestjs-query";

import { DollarOutlined, RightCircleOutlined } from "@ant-design/icons";
import type { AreaConfig } from "@ant-design/plots";
import { Button, Card } from "antd";
import dayjs from "dayjs";

import { Text } from "@/components";
import type { DashboardDealsChartQuery } from "@/graphql/types";

import { DASHBOARD_DEALS_CHART_QUERY } from "./queries";

const Area = lazy(() => import("@ant-design/plots/es/components/area"));

export const DashboardDealsChart: React.FC = () => {
  const { list } = useNavigation();
  const { data, isError, error } = useList<
    GetFieldsFromList<DashboardDealsChartQuery>
  >({
    resource: "dealStages",
    filters: [{ field: "title", operator: "in", value: ["WON", "LOST"] }],
    meta: {
      gqlQuery: DASHBOARD_DEALS_CHART_QUERY,
    },
  });

  const dealData = useMemo(() => {
    const wonNode = data?.data.find((node) => node.title === "WON");
    const lostNode = data?.data.find((node) => node.title === "LOST");

    const won = wonNode?.dealsAggregate?.[0]?.groupBy
      ? [{
          timeUnix: dayjs(`${wonNode.dealsAggregate[0].groupBy.closeDateYear}-${wonNode.dealsAggregate[0].groupBy.closeDateMonth}-01`).unix(),
          timeText: dayjs(`${wonNode.dealsAggregate[0].groupBy.closeDateYear}-${wonNode.dealsAggregate[0].groupBy.closeDateMonth}-01`).format("MMM YYYY"),
          value: wonNode.dealsAggregate[0].sum?.value,
          state: "Won",
        }]
      : [];

    const lost = lostNode?.dealsAggregate?.[0]?.groupBy
      ? [{
          timeUnix: dayjs(`${lostNode.dealsAggregate[0].groupBy.closeDateYear}-${lostNode.dealsAggregate[0].groupBy.closeDateMonth}-01`).unix(),
          timeText: dayjs(`${lostNode.dealsAggregate[0].groupBy.closeDateYear}-${lostNode.dealsAggregate[0].groupBy.closeDateMonth}-01`).format("MMM YYYY"),
          value: lostNode.dealsAggregate[0].sum?.value,
          state: "Lost",
        }]
      : [];

    return [...won, ...lost].sort((a, b) => a.timeUnix - b.timeUnix);
  }, [data]);

  const config: AreaConfig = {
    isStack: false,
    data: dealData,
    xField: "timeText",
    yField: "value",
    seriesField: "state",
    animation: true,
    startOnZero: false,
    smooth: true,
    legend: {
      offsetY: -6,
    },
    yAxis: {
      tickCount: 4,
      label: {
        formatter: (v) => {
          return `$${Number(v) / 1000}k`;
        },
      },
    },
    tooltip: {
      formatter: (data) => {
        return {
          name: data.state,
          value: `$${Number(data.value) / 1000}k`,
        };
      },
    },
    areaStyle: (datum) => {
      const won = "l(270) 0:#ffffff 0.5:#b7eb8f 1:#52c41a";
      const lost = "l(270) 0:#ffffff 0.5:#f3b7c2 1:#ff4d4f";
      return { fill: datum.state === "Won" ? won : lost };
    },
    color: (datum) => {
      return datum.state === "Won" ? "#52C41A" : "#F5222D";
    },
  };

  return (
    <Card
      style={{ height: "100%" }}
      headStyle={{ padding: "8px 16px" }}
      bodyStyle={{ padding: "24px 24px 0px 24px" }}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {/* @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66 */}
          <DollarOutlined />
          <Text size="sm" style={{ marginLeft: ".5rem" }}>
            Deals
          </Text>
        </div>
      }
      extra={
        // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
        <Button onClick={() => list("deals")} icon={<RightCircleOutlined />}>
          See sales pipeline
        </Button>
      }
    >
      <Suspense>
        <Area {...config} height={325} />
      </Suspense>
    </Card>
  );
};
