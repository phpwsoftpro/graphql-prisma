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
import { Form, Grid, Input, Space, Spin, Table } from "antd";
import debounce from "lodash/debounce";

import { ListTitleButton, PaginationTotal, CustomAvatar } from "@/components";
import { PRODUCTS_TABLE_QUERY } from "./queries";

// TODO: Thay thế bằng type thực tế của Product
// type Product = GetFieldsFromList<ProductsTableQuery>;
type Product = {
  id: string;
  title: string;
  unitPrice: number;
  createdAt: string;
  image?: string;
};

// TẠM MOCKDATA CHO DEMO UI
const mockProducts = [
  {
    id: "1",
    title: "yyyyy",
    internalReference: "REF001",
    responsible: "Administrator",
    productTags: ["tag1", "tag2", "tag3"],
    unitPrice: 0.0,
    cost: 0.0,
    quantityOnHand: 10,
    forecastedQuantity: 12,
    unitOfMeasure: "Units",
  },
  {
    id: "2",
    title: "Service on Timesheet",
    internalReference: "REF002",
    responsible: "Administrator",
    productTags: [],
    unitPrice: 40.0,
    cost: 0.0,
    quantityOnHand: 0,
    forecastedQuantity: 0,
    unitOfMeasure: "Hours",
  },
  {
    id: "3",
    title: "Senior Developer (Timesheet)",
    internalReference: "REF003",
    responsible: "Administrator",
    productTags: [],
    unitPrice: 20.0,
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
  } = useTable<Product, HttpError, { title: string }>({
    resource: "products",
    onSearch: (values) => [
      {
        field: "title",
        operator: "contains",
        value: values.title,
      },
    ],
    filters: {
      initial: [{ field: "title", value: "", operator: "contains" }],
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
      title: e.target.value ?? "",
    });
  };

  const debouncedOnChange = debounce(onSearch, 500);

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
                    title: getDefaultFilter("title", filters, "contains"),
                  }}
                  layout="inline"
                >
                  <Form.Item name="title" noStyle>
                    <Input
                      size="large"
                      prefix={<SearchOutlined />}
                      suffix={
                        <Spin
                          size="small"
                          spinning={tableQueryResult.isFetching}
                        />
                      }
                      placeholder="Search by title"
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
              dataIndex="title"
              title="Product Title"
              width={200}
              sorter
              render={(_, record) => (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CustomAvatar
                    name={record.title}
                    src={record.image}
                    shape="square"
                    size={28}
                    style={{ marginRight: 6 }}
                  />
                  {record.title}
                </span>
              )}
            />
            <Table.Column
              dataIndex="unitPrice"
              title="Unit Price"
              width={100}
              sorter
              render={(value) => `${value.toFixed(2)} €`}
            />
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
