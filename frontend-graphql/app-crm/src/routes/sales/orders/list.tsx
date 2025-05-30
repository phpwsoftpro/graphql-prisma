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

import { QUOTES_TABLE_QUERY } from "./queries";

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

export const OrdersListPage: FC<PropsWithChildren> = ({ children }) => {
  const screens = Grid.useBreakpoint();

  const {
    tableProps,
    searchFormProps,
    filters,
    sorters,
    tableQuery: tableQueryResult,
  } = useTable<Quote, HttpError, { title: string }>({
    resource: "quotes",
    onSearch: (values) => {
      return [
        {
          field: "title",
          operator: "contains",
          value: values.title,
        },
      ];
    },
    filters: {
      initial: [
        {
          field: "title",
          value: "",
          operator: "contains",
        },
        {
          field: "status",
          value: undefined,
          operator: "in",
        },
      ],
    },
    sorters: {
      initial: [
        {
          field: "createdAt",
          order: "desc",
        },
      ],
    },
    meta: {
      gqlQuery: QUOTES_TABLE_QUERY,
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

  // Map lại id cho từng quote, company, salesOwner và xử lý dealStage là object hoặc undefined
  let dataSource = (tableProps.dataSource ?? []).map((quote: any) => ({
    ...quote,
    id: quote._id ?? quote.id,
    dealStage:
      typeof quote.dealStage === "object" && quote.dealStage !== null
        ? quote.dealStage
        : undefined,
    company: quote.company
      ? {
          ...quote.company,
          id: quote.company._id ?? quote.company.id,
        }
      : undefined,
    salesOwner: quote.salesOwner
      ? {
          ...quote.salesOwner,
          id: quote.salesOwner._id ?? quote.salesOwner.id,
        }
      : undefined,
  }));
  dataSource=[
    {
      id: "681f2aa9125cb9abc848eda1",
      title: "S00014",
      createdAt: "2025-05-23",
      company: { name: "New" },
      salesOwner: { name: "Administrator" },
      activities: [],
      total: 20,
      status: "Sales Order",
      dealStage: { title: "DRAFT" },
    },
    {
      id: "681f2aa9125cb9abc848eda",
      title: "S00013",
      createdAt: "2025-05-23",
      company: { name: "Bouwsoft, Groensoft & Archisoft" },
      salesOwner: { name: "Administrator" },
      activities: [],
      total: 20,
      status: "Sales Order",
      dealStage: { title: "ACCEPTED" },
    },
  ];
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
              <PaginationTotal total={total} entityName="quotes" />
            ),
          }}
          rowKey="id"
        >
          <Table.Column
            dataIndex="title"
            title="Title"
            defaultFilteredValue={getDefaultFilter("title", filters)}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder="Search Name" />
              </FilterDropdown>
            )}
          />
          <Table.Column
            dataIndex={["company", "id"]}
            title="Company"
            defaultFilteredValue={getDefaultFilter("company.id", filters, "in")}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Select
                  placeholder="Search Company"
                  style={{ width: 220 }}
                  {...selectPropsCompanies}
                />
              </FilterDropdown>
            )}
            render={(_, record) =>
              record.company ? (
                <Space>
                  <CustomAvatar
                    shape="square"
                    name={record.company.name}
                    src={record.company.avatarUrl}
                  />
                  <Text style={{ whiteSpace: "nowrap" }}>
                    {record.company.name}
                  </Text>
                </Space>
              ) : (
                "—"
              )
            }
          />
          <Table.Column
            dataIndex="total"
            title="Total Amount"
            sorter
            render={(value) => {
              return (
                <Text
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  {currencyNumber(value)}
                </Text>
              );
            }}
          />
          <Table.Column
            dataIndex="status"
            title="Invoice Status"
            defaultFilteredValue={getDefaultFilter("status", filters, "in")}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Select
                  style={{ width: "200px" }}
                  mode="multiple"
                  placeholder="Select Stage"
                  options={statusOptions}
                />
              </FilterDropdown>
            )}
            render={(_, record) =>
              record.dealStage && record.dealStage.title ? (
                <QuoteStatusTag status={record.dealStage.title} />
              ) : (
                "—"
              )
            }
          />
          <Table.Column
            dataIndex={["salesOwner", "id"]}
            title="Participants"
            filterDropdown={(props) => {
              return (
                <FilterDropdown {...props}>
                  <Select
                    style={{ width: "200px" }}
                    placeholder="Select Sales Owner"
                    {...selectPropsUsers}
                  />
                </FilterDropdown>
              );
            }}
            render={(_, record) =>
              record.salesOwner ? (
                <Participants userOne={record.salesOwner} userTwo={record.contact} />
              ) : (
                "—"
              )
            }
          />
          <Table.Column
            dataIndex={"activities"}
            title="Activities"
            render={() => (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center",cursor: "pointer" }}>
                <ClockCircleOutlined style={{ fontSize: 18, color: "#8c8c8c" }} />
              </div>
            )}
          />
          <Table.Column
            dataIndex={"createdAt"}
            title="Created at"
            sorter
            defaultSortOrder={getDefaultSortOrder("createdAt", sorters)}
            render={(value) => {
              return <Text>{dayjs(value).fromNow()}</Text>;
            }}
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
                    style={{
                      backgroundColor: "transparent",
                    }}
                  />
                  <EditButton
                    hideText
                    size="small"
                    recordItemId={record.id}
                    style={{
                      backgroundColor: "transparent",
                    }}
                  />
                  <DeleteButton
                    hideText
                    size="small"
                    recordItemId={record.id}
                    style={{
                      backgroundColor: "transparent",
                    }}
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
