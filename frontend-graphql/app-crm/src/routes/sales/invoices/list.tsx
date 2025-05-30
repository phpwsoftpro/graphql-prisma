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
import type { GetFieldsFromList } from "@refinedev/nestjs-query";

import { SearchOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Form, Grid, Input, Select, Space, Spin, Table } from "antd";
import dayjs from "dayjs";
import debounce from "lodash/debounce";

import {
  CustomAvatar,
  ListTitleButton,
  PaginationTotal,
  Participants,
  QuoteStatusTag,
  Text,
} from "@/components";
import type { QuoteStatus } from "@/graphql/schema.types";
import type { QuotesTableQuery } from "@/graphql/types";
import { useCompaniesSelect } from "@/hooks/useCompaniesSelect";
import { useUsersSelect } from "@/hooks/useUsersSelect";
import { currencyNumber } from "@/utilities";
import { INVOICES_TABLE_QUERY } from "./queries";



type Quote = GetFieldsFromList<QuotesTableQuery>;

const statusOptions: { label: string; value: QuoteStatus }[] = [
  {
    label: "Draft",
    value: "DRAFT",
  },
  {
    label: "Sent",
    value: "SENT",
  },
  {
    label: "Accepted",
    value: "ACCEPTED",
  },
];

export const InvoicesListPage: FC<PropsWithChildren> = ({ children }) => {
  const screens = Grid.useBreakpoint();

  const {
    tableProps,
    searchFormProps,
    filters,
    sorters,
    tableQuery: tableQueryResult,
  } = useTable<Quote, HttpError, { title: string }>({
    resource: "invoices",
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
        { field: "status", value: undefined, operator: "in" },
      ],
    },
    sorters: {
      initial: [{ field: "createdAt", order: "desc" }],
    },
    meta: {
      gqlQuery: INVOICES_TABLE_QUERY,
    },
  });

  const selectPropsCompanies = useCompaniesSelect();
  const selectPropsUsers = useUsersSelect();

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchFormProps?.onFinish?.({
      title: e.target.value ?? "",
    });
  };

  const debouncedOnChange = debounce(onSearch, 500);

  // Đảm bảo dataSource luôn là mảng, không undefined
  const dataSource = Array.isArray(tableProps.dataSource)
    ? tableProps.dataSource.map((invoice: any) => ({
        ...invoice,
        id: invoice._id ?? invoice.id,
        customer: invoice.customer
          ? { ...invoice.customer, id: invoice.customer._id ?? invoice.customer.id }
          : undefined,
      }))
    : [];

  return (
    <div className="page-container">
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
                    // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                    prefix={<SearchOutlined className="anticon tertiary" />}
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
        title={<ListTitleButton buttonText="Add quote" toPath="quotes" />}
      >
        <Table
          {...tableProps}
          dataSource={dataSource}
          pagination={{
            ...tableProps.pagination,
            showTotal: (total) => (
              <PaginationTotal total={total} entityName="invoices" />
            ),
          }}
          rowKey="id"
        >
          <Table.Column
            dataIndex="number"
            title="Number"
            render={(value) => <a href="#">{value}</a>}
          />
          <Table.Column
            dataIndex={["customer", "name"]}
            title="Customer"
            render={(value) => <a href="#">{value}</a>}
          />
          <Table.Column
            dataIndex="invoiceDate"
            title="Invoice Date"
            render={(value) => value ? dayjs(value).format("YYYY-MM-DD") : "-"}
          />
          <Table.Column
            dataIndex="dueDate"
            title="Due Date"
            render={(value) => value ? `In ${dayjs(value).diff(dayjs(), "day")} days` : "-"}
          />
          <Table.Column
            dataIndex="activities"
            title="Activities"
            render={() => (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }}>
                <ClockCircleOutlined style={{ fontSize: 18, color: "#8c8c8c" }} />
              </div>
            )}
          />
          <Table.Column
            dataIndex="taxExcluded"
            title="Tax Excluded"
            render={(value) => `${value.toFixed(2)} €`}
          />
          <Table.Column
            dataIndex="total"
            title="Total"
            render={(value) => <a href="#">{value.toFixed(2)} €</a>}
          />
          <Table.Column
            dataIndex="paymentStatus"
            title="Payment Status"
            render={(value) => (
              <span style={{ background: "#ff4d4f", color: "#fff", borderRadius: 8, padding: "2px 10px" }}>{value}</span>
            )}
          />
          <Table.Column
            dataIndex="status"
            title="Status"
            render={(value) => (
              <span style={{ background: "#13c2c2", color: "#fff", borderRadius: 8, padding: "2px 10px" }}>{value}</span>
            )}
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
  );
};
