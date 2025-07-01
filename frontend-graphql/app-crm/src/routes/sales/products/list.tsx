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

import { ListTitleButton, PaginationTotal } from "@/components";
import { PRODUCTS_TABLE_QUERY } from "./queries";

// TODO: Thay thế bằng type thực tế của Product
// type Product = GetFieldsFromList<ProductsTableQuery>;
type Product = {
  id: string;
  title: string;
  description?: string;
  unitPrice: number;
  createdAt: string;
  status: string;
};


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
      initial: [
        { field: "title", value: "", operator: "contains" },
      ],
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

  const dataSource = Array.isArray(tableProps.dataSource?.nodes)
  ? tableProps.dataSource.nodes.map((product: any) => ({
      ...product,
      id: product._id ?? product.id,
  }))
  : [];


  return (
    <div className="page-container">
      <div style={{ padding: 24, background: '#fff', borderRadius: 8 }}>
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
              title="Title"
              width={200}
              sorter
            />
            <Table.Column
              dataIndex="unitPrice"
              title="Unit Price"
              width={120}
              sorter
              render={(value) => `${value.toFixed(2)} €`}
            />
            <Table.Column
              dataIndex="createdAt"
              title="Created At"
              width={180}
              sorter
              render={(value) => dayjs(value).format("YYYY-MM-DD HH:mm")}
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
