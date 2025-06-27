import React, { type PropsWithChildren } from "react";

import { useForm } from "@refinedev/antd";
import { type HttpError, useNavigation } from "@refinedev/core";

import { Form, Input, Modal, Select } from "antd";

import type { User, UpdateOneUserInput } from "@/graphql/schema.types";
import { UPDATE_USER_MUTATION } from "./queries";

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

export const UserEditPage: React.FC<PropsWithChildren> = ({ children }) => {
  const { list } = useNavigation();
  const { formProps, saveButtonProps, onFinish } = useForm<
    User,
    HttpError,
    UpdateOneUserInput
  >({
    redirect: "list",
    meta: {
      gqlMutation: UPDATE_USER_MUTATION,
    },
  });

  return (
    <>
      <Modal
        open
        title="Edit User"
        onCancel={() => {
          list("users", "replace");
        }}
        okText="Save"
        okButtonProps={{
          ...saveButtonProps,
        }}
        width={560}
      >
        <Form
          layout="vertical"
          {...formProps}
          onFinish={(values) => {
            onFinish({
              ...values,
            });
          }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Job Title"
            name="jobTitle"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              options={roleOptions}
              placeholder="Select role"
            />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              options={statusOptions}
              placeholder="Select status"
            />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
      {children}
    </>
  );
}; 