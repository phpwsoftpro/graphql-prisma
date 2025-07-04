import { Link, useParams } from "react-router-dom";
import { useOne } from "@refinedev/core";
import { Button, Descriptions, Space } from "antd";
import { LeftOutlined, EditOutlined } from "@ant-design/icons";

import { FullScreenLoading, Text } from "@/components";
import { PRODUCT_SHOW_QUERY } from "../queries";
import styles from "./index.module.css";

export const ProductsShowPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useOne({
    resource: "products",
    id: id ? Number(id) : undefined,


    id,

    meta: { gqlQuery: PRODUCT_SHOW_QUERY },
  });

  if (isLoading) {
    return <FullScreenLoading />;
  }

  const record = data?.data;

  if (!record) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <Link to="/products">
          {/* @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66 */}
          <Button icon={<LeftOutlined />}>Products</Button>
        </Link>
        <Space>
          <Link to={`/products/edit/${record.id}`}>
            {/* @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66 */}
            <Button icon={<EditOutlined />}>Edit</Button>
          </Link>
        </Space>
      </div>
      <Descriptions bordered column={1} title={<Text strong>{record.name}</Text>}>
        <Descriptions.Item label="Internal Reference">
          {record.internalReference || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Responsible">
          {record.responsible || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Sales Price">
          {record.salesPrice}
        </Descriptions.Item>
        <Descriptions.Item label="Cost">{record.cost}</Descriptions.Item>
        <Descriptions.Item label="Quantity On Hand">
          {record.quantityOnHand}
        </Descriptions.Item>
        <Descriptions.Item label="Forecasted Quantity">
          {record.forecastedQuantity}
        </Descriptions.Item>
        <Descriptions.Item label="Unit of Measure">
          {record.unitOfMeasure}
        </Descriptions.Item>
        <Descriptions.Item label="Status">{record.status}</Descriptions.Item>
      </Descriptions>
    </div>
  );
};
