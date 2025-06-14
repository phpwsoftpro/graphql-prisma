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
import { SearchOutlined } from "@ant-design/icons";
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
import { QUOTES_DELETE_QUOTE_MUTATION, QUOTES_TABLE_QUERY } from "./queries";

type Quote = GetFieldsFromList<QuotesTableQuery>;

const statusOptions: { label: string; value: QuoteStatus }[] = [
  { label: "Draft", value: "DRAFT" },
  { label: "Sent", value: "SENT" },
  { label: "Accepted", value: "ACCEPTED" },
];

export const QuotesListPage: FC<PropsWithChildren> = ({ children }) => {
  const screens = Grid.useBreakpoint();

  const {
    tableProps,
    searchFormProps,
    filters,
    sorters,
    tableQuery: tableQueryResult,
  } = useTable<Quote, HttpError, { title: string }>({
    resource: "quotes",
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
      gqlQuery: QUOTES_TABLE_QUERY,
    },
  });

  // Lấy selectProps từ custom hook
  const selectPropsCompanies = useCompaniesSelect().selectProps;
  const selectPropsUsers = useUsersSelect().selectProps;

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchFormProps?.onFinish?.({
      title: e.target.value ?? "",
    });
  };
  const debouncedOnChange = debounce(onSearch, 500);

  // Đảm bảo dataSource luôn là mảng, không undefined
  const dataSource = Array.isArray(tableProps.dataSource)
    ? tableProps.dataSource.map((quote: any) => ({
        ...quote,
        id: quote._id ?? quote.id,
        company: quote.company
          ? { ...quote.company, id: quote.company._id ?? quote.company.id }
          : undefined,
        salesOwner: quote.salesOwner
          ? { ...quote.salesOwner, id: quote.salesOwner._id ?? quote.salesOwner.id }
          : undefined,
      }))
    : [];

  return (
    <div className="page-container">
      <List
        breadcrumb={false}
        headerButtons={() => (
          <Space style={{ marginTop: screens.xs ? "1.6rem" : undefined }}>
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
                  prefix={<SearchOutlined className="anticon tertiary" />}
                  suffix={
                    <Spin size="small" spinning={tableQueryResult.isFetching} />
                  }
                  placeholder="Search by name"
                  onChange={debouncedOnChange}
                />
              </Form.Item>
            </Form>
          </Space>
        )}
        contentProps={{ style: { marginTop: "28px" } }}
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
          <Table.Column<Quote>
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
            render={(value) => (
              <Text style={{ whiteSpace: "nowrap" }}>
                {currencyNumber(value)}
              </Text>
            )}
          />
          <Table.Column<Quote>
            dataIndex="status"
            title="Stage"
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
            render={(value) => <QuoteStatusTag status={value} />}
          />
          <Table.Column<Quote>
            dataIndex={["salesOwner", "id"]}
            title="Participants"
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Select
                  style={{ width: "200px" }}
                  placeholder="Select Sales Owner"
                  {...selectPropsUsers}
                />
              </FilterDropdown>
            )}
            render={(_, record) =>
              record.salesOwner ? (
                <Participants
                  userOne={record.salesOwner}
                  userTwo={record.contact}
                />
              ) : (
                "—"
              )
            }
          />
          <Table.Column<Quote>
            dataIndex={"createdAt"}
            title="Created at"
            sorter
            defaultSortOrder={getDefaultSortOrder("createdAt", sorters)}
            render={(value) => <Text>{dayjs(value).fromNow()}</Text>}
          />
          <Table.Column<Quote>
            fixed="right"
            title="Actions"
            dataIndex="actions"
            render={(_, record) => (
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
                  meta={{
                    gqlMutation: QUOTES_DELETE_QUOTE_MUTATION,
                  }}
                />
              </Space>
            )}
          />
        </Table>
      </List>
      {children}
    </div>
  );
};