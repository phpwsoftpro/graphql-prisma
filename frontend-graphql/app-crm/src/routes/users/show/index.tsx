import React, { useState } from "react";

import { useDelete, useNavigation, useShow, useUpdate } from "@refinedev/core";
import type { GetFields } from "@refinedev/nestjs-query";

import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  GlobalOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Drawer,
  Form,
  Input,
  Popconfirm,
  Select,
  Space,
  Spin,
  Typography,
} from "antd";
import dayjs from "dayjs";

import {
  CustomAvatar,
  SingleElementForm,
  Text,
  TextIcon,
} from "../../../components";
import type { User } from "../../../graphql/schema.types";

import { RoleTag, UserStatusTag } from "../components";
import styles from "./index.module.css";
import { USER_SHOW_QUERY } from "./queries";
import { UPDATE_USER_MUTATION, DELETE_USER_MUTATION } from "../queries";

// Define the type for user show query
type UserShowQuery = {
  user: {
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
    companies: {
      nodes: Array<{
        id: string;
        name: string;
        country?: string;
        industry?: string;
      }>;
      totalCount: number;
    };
    contacts: {
      nodes: Array<{
        id: string;
        name: string;
        email?: string;
        phone?: string;
        stage?: string;
        status?: string;
      }>;
      totalCount: number;
    };
    deals: {
      nodes: Array<{
        id: string;
        title: string;
        value: number;
        stage?: {
          id: string;
          title: string;
        };
      }>;
      totalCount: number;
    };
  };
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

export const UserShowPage: React.FC = () => {
  const [activeForm, setActiveForm] = useState<
    "email" | "jobTitle" | "phone" | "role" | "status" | "address"
  >();
  const { list } = useNavigation();
  const { query: queryResult } = useShow<GetFields<UserShowQuery>>({
    meta: {
      gqlQuery: USER_SHOW_QUERY,
    },
  });
  const { data, isLoading, isError } = queryResult;

  const { mutate } = useUpdate<User>({
    resource: "users",
    successNotification: false,
    id: Number(data?.data?.id),
    meta: {
      gqlMutation: UPDATE_USER_MUTATION,
    },
  });
  const { mutate: deleteMutation } = useDelete<User>();

  const closeModal = () => {
    setActiveForm(undefined);
    list("users");
  };

  if (isError) {
    closeModal();
    return null;
  }

  if (isLoading) {
    return (
      <Drawer
        open
        width={756}
        bodyStyle={{
          background: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin />
      </Drawer>
    );
  }

  const {
    id,
    name,
    email,
    jobTitle,
    phone,
    role,
    avatarUrl,
    status,
    address,
    createdAt,
    companies,
    contacts,
    deals,
  } = data?.data ?? {};

  // Lấy role của user hiện tại từ localStorage
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = currentUser.role === "ADMIN";

  return (
    <Drawer
      open
      onClose={() => closeModal()}
      width={756}
      bodyStyle={{ background: "#f5f5f5", padding: 0 }}
      headerStyle={{ display: "none" }}
    >
      <div className={styles.header}>
        <Button
          type="text"
          // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
          icon={<CloseOutlined />}
          onClick={() => closeModal()}
        />
      </div>
      <div className={styles.container}>
        <div className={styles.name}>
          <CustomAvatar
            style={{
              marginRight: "1rem",
              flexShrink: 0,
              fontSize: "40px",
            }}
            size={96}
            src={avatarUrl}
            name={name}
          />
          <Typography.Title
            level={3}
            style={{ padding: 0, margin: 0, width: "100%" }}
            className={styles.title}
            editable={
              isAdmin
                ? {
                    onChange(value) {
                      mutate({
                        values: {
                          name: value,
                        },
                      });
                    },
                    triggerType: ["text", "icon"],
                    // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                    icon: <EditOutlined className={styles.titleEditIcon} />,
                  }
                : false
            }
          >
            {name}
          </Typography.Title>
        </div>

        <div className={styles.form}>
          <SingleElementForm
            // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
            icon={<MailOutlined className="tertiary" />}
            useFormProps={{
              id: Number(data?.data?.id),
              resource: "users",
              meta: { gqlMutation: UPDATE_USER_MUTATION },
            }}
            state={
              activeForm && activeForm === "email"
                ? "form"
                : email
                  ? "view"
                  : "empty"
            }
            itemProps={{
              name: "email",
              label: "Email",
            }}
            view={<Text>{email}</Text>}
            onClick={isAdmin ? () => setActiveForm("email") : undefined}
            onUpdate={() => setActiveForm(undefined)}
            onCancel={() => setActiveForm(undefined)}
            isEdit={isAdmin}
          >
            <Input defaultValue={email} />
          </SingleElementForm>

          <SingleElementForm
            // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
            icon={<IdcardOutlined className="tertiary" />}
            useFormProps={{
              id: Number(data?.data?.id),
              resource: "users",
              meta: { gqlMutation: UPDATE_USER_MUTATION },
            }}
            state={
              activeForm && activeForm === "jobTitle"
                ? "form"
                : jobTitle
                  ? "view"
                  : "empty"
            }
            itemProps={{
              name: "jobTitle",
              label: "Job Title",
            }}
            view={<Text>{jobTitle}</Text>}
            onClick={isAdmin ? () => setActiveForm("jobTitle") : undefined}
            onUpdate={() => setActiveForm(undefined)}
            onCancel={() => setActiveForm(undefined)}
            isEdit={isAdmin}
          >
            <Input defaultValue={jobTitle || ""} />
          </SingleElementForm>

          <SingleElementForm
            // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
            icon={<PhoneOutlined className="tertiary" />}
            useFormProps={{
              id: Number(data?.data?.id),
              resource: "users",
              meta: { gqlMutation: UPDATE_USER_MUTATION },
            }}
            state={
              activeForm && activeForm === "phone"
                ? "form"
                : phone
                  ? "view"
                  : "empty"
            }
            itemProps={{
              name: "phone",
              label: "Phone",
            }}
            view={<Text>{phone}</Text>}
            onClick={() => setActiveForm("phone")}
            onUpdate={() => setActiveForm(undefined)}
            onCancel={() => setActiveForm(undefined)}
            isEdit={isAdmin}
          >
            <Input defaultValue={phone || ""} />
          </SingleElementForm>

          <SingleElementForm
            // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
            icon={<UserOutlined className="tertiary" />}
            useFormProps={{
              id: Number(data?.data?.id),
              resource: "users",
              meta: { gqlMutation: UPDATE_USER_MUTATION },
            }}
            state={
              activeForm && activeForm === "role"
                ? "form"
                : role
                  ? "view"
                  : "empty"
            }
            itemProps={{
              name: "role",
              label: "Role",
            }}
            view={<RoleTag role={role} />}
            onClick={isAdmin ? () => setActiveForm("role") : undefined}
            onUpdate={() => setActiveForm(undefined)}
            onCancel={() => setActiveForm(undefined)}
            isEdit={isAdmin}
          >
            <Select
              style={{ width: "100%" }}
              options={roleOptions}
              defaultValue={role}
            />
          </SingleElementForm>

          <SingleElementForm
            // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
            icon={<GlobalOutlined className="tertiary" />}
            useFormProps={{
              id: Number(data?.data?.id),
              resource: "users",
              meta: { gqlMutation: UPDATE_USER_MUTATION },
            }}
            state={
              activeForm && activeForm === "status"
                ? "form"
                : status
                  ? "view"
                  : "empty"
            }
            itemProps={{
              name: "status",
              label: "Status",
            }}
            view={<UserStatusTag status={status as any} />}
            onClick={isAdmin ? () => setActiveForm("status") : undefined}
            onUpdate={() => setActiveForm(undefined)}
            onCancel={() => setActiveForm(undefined)}
            isEdit={isAdmin}
          >
            <Select
              style={{ width: "100%" }}
              options={statusOptions}
              defaultValue={status}
            />
          </SingleElementForm>

          <SingleElementForm
            style={{ borderBottom: "none" }}
            // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
            icon={<HomeOutlined className="tertiary" />}
            useFormProps={{
              id: Number(data?.data?.id),
              resource: "users",
              meta: { gqlMutation: UPDATE_USER_MUTATION },
            }}
            state={
              activeForm && activeForm === "address"
                ? "form"
                : address
                  ? "view"
                  : "empty"
            }
            itemProps={{
              name: "address",
              label: "Address",
            }}
            view={<Text>{address}</Text>}
            onClick={isAdmin ? () => setActiveForm("address") : undefined}
            onUpdate={() => setActiveForm(undefined)}
            onCancel={() => setActiveForm(undefined)}
            isEdit={isAdmin}
          >
            <Input.TextArea defaultValue={address || ""} rows={3} />
          </SingleElementForm>
        </div>

        <Card
          title={
            <>
              <TextIcon />
              <Text style={{ marginLeft: ".8rem" }}>Statistics</Text>
            </>
          }
          bodyStyle={{
            padding: "1rem",
          }}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text>Companies:</Text>
              <Text strong>{companies?.totalCount || 0}</Text>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text>Contacts:</Text>
              <Text strong>{contacts?.totalCount || 0}</Text>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text>Deals:</Text>
              <Text strong>{deals?.totalCount || 0}</Text>
            </div>
          </Space>
        </Card>

        <div className={styles.actions}>
          <Text className="ant-text tertiary">
            Created on: {dayjs(createdAt).format("MMMM DD, YYYY")}
          </Text>

          <Popconfirm
            title="Delete the user"
            description="Are you sure to delete this user?"
            onConfirm={() => {
              deleteMutation(
                {
                  id,
                  resource: "users",
                  meta: { gqlMutation: DELETE_USER_MUTATION },
                },
                {
                  onSuccess: () => closeModal(),
                },
              );
            }}
            okText="Yes"
            cancelText="No"
          >
            
            {isAdmin && (
              <Button type="link" danger icon={<DeleteOutlined />} meta={{ gqlMutation: DELETE_USER_MUTATION }}>
                Delete User
              </Button>
            )}
          </Popconfirm>
        </div>
      </div>
    </Drawer>
  );
}; 