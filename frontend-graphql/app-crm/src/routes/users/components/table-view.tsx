import {
  DeleteButton,
  FilterDropdown,
  getDefaultSortOrder,
  ShowButton,
  EditButton,
} from "@refinedev/antd";
import {
  type CrudFilters,
  type CrudSorting,
  getDefaultFilter,
} from "@refinedev/core";

import { Button, Input, Select, Space, Table, type TableProps } from "antd";

import { CustomAvatar, Text, PaginationTotal } from "@/components";
import { RoleTag, UserStatusTag } from "./index";
import { DELETE_USER_MUTATION } from "../queries";
import { PhoneOutlined } from "@ant-design/icons";

// Định nghĩa type User cho Table
export type User = {
  id: string;
  name: string;
  email: string;
  jobTitle?: string;
  phone?: string;
  role: string;
  avatarUrl?: string;
  status?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  tableProps: TableProps<User>;
  filters: CrudFilters;
  sorters: CrudSorting;
};

const roleOptions = [
  { label: "Admin", value: "ADMIN" },
  { label: "Sales Manager", value: "SALES_MANAGER" },
  { label: "Sales Person", value: "SALES_PERSON" },
  { label: "Sales Intern", value: "SALES_INTERN" },
  { label: "Staff", value: "STAFF" },
];

const statusOptions = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Pending", value: "PENDING" },
  { label: "Suspended", value: "SUSPENDED" },
];

export const TableView: React.FC<Props> = ({
  tableProps,
  filters,
  sorters,
}) => {
  return (
    <Table
      {...tableProps}
      pagination={{
        ...tableProps.pagination,
        pageSizeOptions: ["12", "24", "48", "96"],
        showTotal: (total) => (
          <PaginationTotal total={total} entityName="users" />
        ),
      }}
      rowKey="id"
    >
      <Table.Column
        dataIndex="name"
        title="User"
        width={200}
        defaultFilteredValue={getDefaultFilter("name", filters)}
        defaultSortOrder={getDefaultSortOrder("name", sorters)}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder="Search name" />
          </FilterDropdown>
        )}
        render={(_, record: User) => (
          <Space>
            <CustomAvatar src={record.avatarUrl} name={record.name} />
            <Text>{record.name}</Text>
          </Space>
        )}
      />
      <Table.Column
        dataIndex="email"
        title="Email"
        defaultFilteredValue={getDefaultFilter("email", filters)}
        defaultSortOrder={getDefaultSortOrder("email", sorters)}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder="Search email" />
          </FilterDropdown>
        )}
      />
      <Table.Column
        dataIndex="role"
        title="Role"
        defaultFilteredValue={getDefaultFilter("role", filters)}
        defaultSortOrder={getDefaultSortOrder("role", sorters)}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Select
              style={{ width: 200 }}
              mode="multiple"
              placeholder="Select role"
              options={roleOptions}
            />
          </FilterDropdown>
        )}
        render={(role: string) => <RoleTag role={role} />}
      />
      <Table.Column
        dataIndex="status"
        title="Status"
        sorter
        defaultFilteredValue={getDefaultFilter("status", filters)}
        defaultSortOrder={getDefaultSortOrder("status", sorters)}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Select
              style={{ width: 200 }}
              mode="multiple"
              placeholder="Select status"
              options={statusOptions}
            />
          </FilterDropdown>
        )}
        render={(status: string) => <UserStatusTag status={status as any} />}
      />
      <Table.Column
        dataIndex="jobTitle"
        title="Job Title"
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder="Search job title" />
          </FilterDropdown>
        )}
      />
      <Table.Column
        dataIndex="phone"
        title="Phone"
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder="Search phone" />
          </FilterDropdown>
        )}
      />
      <Table.Column<User>
        fixed="right"
        title="Actions"
        dataIndex="actions"
        render={(_, record) => (
          <Space>
            <ShowButton hideText size="small" recordItemId={record.id} />
            <DeleteButton hideText size="small" recordItemId={record.id} meta={{ gqlMutation: DELETE_USER_MUTATION }} />
            <Button size="small" href="tel:1234567890"
              // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
              icon={<PhoneOutlined />}
            />
          </Space>
        )}
      />
    </Table>
  );
}; 