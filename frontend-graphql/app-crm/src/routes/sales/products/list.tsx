import type { FC, PropsWithChildren } from "react";

import {
  DeleteButton,
  EditButton,
  FilterDropdown,
  getDefaultSortOrder,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { getDefaultFilter, type HttpError } from "@refinedev/core";
import { SearchOutlined } from "@ant-design/icons";
import { Form, Grid, Input, Space, Spin, Table, Avatar } from "antd";
import dayjs from "dayjs";
import debounce from "lodash/debounce";

import {
  ListTitleButton,
  PaginationTotal,
  Text,
  CustomAvatar,
} from "@/components";
import { PRODUCTS_TABLE_QUERY, PRODUCTS_DELETE_MUTATION } from "./queries";

// TODO: Thay thế bằng type thực tế của Product
// type Product = GetFieldsFromList<ProductsTableQuery>;
type Product = {
  id: string;
  name: string;
  price: number;
  createdAt: string;
  image?: string;
};

// TẠM MOCKDATA CHO DEMO UI
const mockProducts = [
  {
    id: "1",
    name: "yyyyy",
    internalReference: "REF001",
    responsible: "Administrator",
    productTags: ["tag1", "tag2", "tag3"],
    salesPrice: 0.0,
    cost: 0.0,
    quantityOnHand: 10,
    forecastedQuantity: 12,
    unitOfMeasure: "Units",
  },
  {
    id: "2",
    name: "Service on Timesheet",
    internalReference: "REF002",
    responsible: "Administrator",
    productTags: [],
    salesPrice: 40.0,
    cost: 0.0,
    quantityOnHand: 0,
    forecastedQuantity: 0,
    unitOfMeasure: "Hours",
  },
  {
    id: "3",
    name: "Senior Developer (Timesheet)",
    internalReference: "REF003",
    responsible: "Administrator",
    productTags: [],
    salesPrice: 20.0,
    cost: 0.0,
    quantityOnHand: 0,
    forecastedQuantity: 0,
    unitOfMeasure: "Units",
  },
];

export const ProductsListPage: FC<PropsWithChildren> = ({ children }) => {
  const screens = Grid.useBreakpoint();

  const {
    tableProps,
    searchFormProps,
    filters,
    sorters,
    tableQuery: tableQueryResult,
  } = useTable<Product, HttpError, { name: string }>({
    resource: "products",
    onSearch: (values) => [
      {
        field: "name",
        operator: "contains",
        value: values.name,
      },
    ],
    filters: {
      initial: [{ field: "name", value: "", operator: "contains" }],
    },
    sorters: {
      initial: [{ field: "createdAt", order: "desc" }],
    },
    meta: {
      gqlQuery: PRODUCTS_TABLE_QUERY,
    },
  });

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchFormProps?.onFinish?.({
      name: e.target.value ?? "",
    });
  };

  const debouncedOnChange = debounce(onSearch, 500);
  // Đảm bảo dataSource luôn là mảng, không undefined
  const dataSource = Array.isArray(tableProps.dataSource)
    ? tableProps.dataSource.map((product: any) => ({
        ...product,
        id: product._id ?? product.id,
      }))
    : [];

  return (
    <div className="page-container">
      <div style={{ padding: 24, background: "#fff", borderRadius: 8 }}>
        <List
          breadcrumb={false}
          headerButtons={() => {
            return (
              <Space
                style={{
                  marginTop: screens.xs ? "1.6rem" : undefined,
                }}
              >
                <Form
                  {...searchFormProps}
                  initialValues={{
                    name: getDefaultFilter("name", filters, "contains"),
                  }}
                  layout="inline"
                >
                  <Form.Item name="name" noStyle>
                    <Input
                      size="large"
                      prefix={<SearchOutlined />}
                      suffix={
                        <Spin
                          size="small"
                          spinning={tableQueryResult.isFetching}
                        />
                      }
                      placeholder="Search by name"
                      onChange={debouncedOnChange}
                    />
                  </Form.Item>
                </Form>
              </Space>
            );
          }}
          contentProps={{
            style: {
              marginTop: "28px",
            },
          }}
          title={<ListTitleButton buttonText="Add product" toPath="products" />}
        >
          <Table
            {...tableProps}
            dataSource={dataSource}
            pagination={{
              ...tableProps.pagination,
              showTotal: (total) => (
                <PaginationTotal total={total} entityName="products" />
              ),
            }}
            rowKey="id"
          >
            <Table.Column
              dataIndex="name"
              title="Product Name"
              width={200}
              sorter
              render={(_, record) => (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CustomAvatar
                    name={record.name}
                    src={record.image}
                    shape="square"
                    size={28}
                    style={{ marginRight: 6 }}
                  />
                  {record.name}
                </span>
              )}
            />
            <Table.Column
              dataIndex="internalReference"
              title="Internal Reference"
              width={140}
              sorter
            />
            <Table.Column
              dataIndex="responsible"
              title="Responsible"
              width={140}
              sorter
              render={(value) => (
                <span>
                  <Avatar
                    style={{ backgroundColor: "#c44", marginRight: 6 }}
                    size={24}
                  >
                    A
                  </Avatar>
                  {value}
                </span>
              )}
            />
            <Table.Column
              dataIndex="productTags"
              title="Product Tags"
              width={180}
              sorter
              render={(tags) => (
                <span
                  style={{
                    display: "inline-block",
                    maxWidth: 120,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {tags?.join(", ")}
                </span>
              )}
            />
            <Table.Column
              dataIndex="salesPrice"
              title="Sales Price"
              width={100}
              sorter
              render={(value) => `${value.toFixed(2)} €`}
            />
            <Table.Column
              dataIndex="cost"
              title="Cost"
              width={100}
              sorter
              render={(value) => `${value.toFixed(2)} €`}
            />
            <Table.Column
              dataIndex="quantityOnHand"
              title="Quantity On Hand"
              width={120}
              sorter
            />
            <Table.Column
              dataIndex="forecastedQuantity"
              title="Forecasted Quantity"
              width={140}
              sorter
            />
            <Table.Column
              dataIndex="unitOfMeasure"
              title="Unit of Measure"
              width={120}
              sorter
            />
            <Table.Column dataIndex="status" title="Status" width={120} />
            <Table.Column
              fixed="right"
              title="Actions"
              dataIndex="actions"
              render={(_, record) => {
                return (
                  <Space>
                    <ShowButton
                      hideText
                      size="small"
                      recordItemId={record.id}
                      style={{ backgroundColor: "transparent" }}
                    />
                    <EditButton
                      hideText
                      size="small"
                      recordItemId={record.id}
                      style={{ backgroundColor: "transparent" }}
                    />
                    <DeleteButton
                      hideText
                      size="small"
                      recordItemId={record.id}
                      mutationMode="pessimistic"
                      meta={{ gqlMutation: PRODUCTS_DELETE_MUTATION }}
                      style={{ backgroundColor: "transparent" }}
                    />
                  </Space>
                );
              }}
            />
          </Table>
        </List>
        {children}
      </div>
    </div>
  );
};
