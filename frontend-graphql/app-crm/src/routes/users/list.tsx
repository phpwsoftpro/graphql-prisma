import React, { useState } from "react";

import { List, useTable } from "@refinedev/antd";
import type { HttpError } from "@refinedev/core";
import type { GetFieldsFromList } from "@refinedev/nestjs-query";

import {
  AppstoreOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Form, Grid, Input, Radio, Space } from "antd";
import debounce from "lodash/debounce";

import { ListTitleButton } from "@/components";

import { TableView } from "./components";
import { USERS_LIST_QUERY } from "./queries";

type Props = React.PropsWithChildren;
type View = "card" | "table";

// Define the type for users list query
type UsersListQuery = {
  users: {
    nodes: Array<{
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
    }>;
    totalCount: number;
  };
};

export const UsersListPage: React.FC<Props> = ({ children }) => {
  const [view, setView] = useState<View>("table");
  const screens = Grid.useBreakpoint();

  const {
    tableProps,
    searchFormProps,
    filters,
    sorters,
    setFilters,
  } = useTable<
    GetFieldsFromList<UsersListQuery>,
    HttpError,
    { name: string }
  >({
    resource: "users",
    onSearch: (values) => {
      return [
        {
          field: "name",
          operator: "contains",
          value: values.name,
        },
        {
          field: "email",
          operator: "contains",
          value: values.name,
        },
      ];
    },
    sorters: {
      initial: [
        {
          field: "createdAt",
          order: "desc",
        },
      ],
    },
    filters: {
      initial: [
        {
          field: "name",
          value: undefined,
          operator: "contains",
        },
        {
          field: "email",
          value: undefined,
          operator: "contains",
        },
        {
          field: "role",
          value: undefined,
          operator: "in",
        },
      ],
    },
    pagination: {
      pageSize: 12,
    },
    meta: {
      gqlQuery: USERS_LIST_QUERY,
    },
  });

  const onViewChange = (value: View) => {
    setView(value);
    setFilters([], "replace");
    // TODO: useForm should handle this automatically. remove this when its fixed from antd useForm.
    searchFormProps.form?.resetFields();
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchFormProps?.onFinish?.({
      name: e.target.value ?? "",
    });
  };

  const debouncedOnChange = debounce(onSearch, 500);

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
              <Form layout="inline">
                <Form.Item name="name" noStyle>
                  <Input
                    size="large"
                    // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                    prefix={<SearchOutlined />}
                    placeholder="Search by name or email"
                    onChange={debouncedOnChange}
                  />
                </Form.Item>
              </Form>
              {!screens.xs ? (
                <Radio.Group
                  size="large"
                  value={view}
                  onChange={(e) => onViewChange(e.target.value)}
                >
                  <Radio.Button value="table">
                    {/* @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66 */}
                    <UnorderedListOutlined />
                  </Radio.Button>
                  <Radio.Button value="card">
                    {/* @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66 */}
                    <AppstoreOutlined />
                  </Radio.Button>
                </Radio.Group>
              ) : null}
            </Space>
          );
        }}
        contentProps={{
          style: {
            marginTop: "28px",
          },
        }}
        title={
          <ListTitleButton toPath="users" buttonText="Add new user" />
        }
      >
        {screens.xs || view === "table" ? (
          <TableView
            tableProps={tableProps}
            filters={filters}
            sorters={sorters}
          />
        ) : (
          <div>Card view will be implemented later</div>
        )}
        {children}
      </List>
    </div>
  );
}; 