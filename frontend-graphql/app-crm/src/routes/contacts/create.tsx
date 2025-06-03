import React, { type PropsWithChildren, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

import { useForm } from "@refinedev/antd";
import { type HttpError, useGetIdentity, useNavigation } from "@refinedev/core";

import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select } from "antd";

import { SelectOptionWithAvatar } from "@/components";
import type { Contact, CreateContactInput, User } from "@/graphql/schema.types";
import { CONTACT_CREATE_MUTATION } from "./queries";
import { useCompaniesSelect } from "@/hooks/useCompaniesSelect";

export const ContactCreatePage: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { list, replace } = useNavigation();
  const { pathname } = useLocation();
  const { data: user } = useGetIdentity<User>();
  const [searchParams] = useSearchParams();
  const { formProps, saveButtonProps, onFinish } = useForm<
    Contact,
    HttpError,
    CreateContactInput
  >({
    redirect: "list",
    meta: {
      gqlMutation: CONTACT_CREATE_MUTATION,
    },
  });
  const { selectProps, queryResult } = useCompaniesSelect();

  useEffect(() => {
    const companyId = searchParams.get("companyId");

    if (companyId && companyId !== "null") {
      formProps.form?.setFieldsValue({
        companyId,
      });
    }
  }, [searchParams]);

  const isHaveOverModal = pathname === "/contacts/create/company-create";

  return (
    <>
      <Modal
        open
        title="Create Contact"
        style={{ display: isHaveOverModal ? "none" : "inherit" }}
        onCancel={() => {
          list("contacts", "replace");
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
              companyId: values.companyId
                ? Number(values.companyId)
                : undefined,
              salesOwnerId: user?.id ? Number(user.id) : undefined,
            });
          }}
        >
          <Form.Item
            label="Contact Name"
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
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Company"
            name="companyId"
            rules={[
              {
                required: true,
              },
            ]}
            help={
              <Button
                style={{ paddingLeft: 0 }}
                type="link"
                // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                icon={<PlusCircleOutlined />}
                onClick={() => {
                  replace("company-create?to=/contacts/create");
                }}
              >
                Add new company
              </Button>
            }
          >
            <Select
              {...selectProps}
              options={
                queryResult.data?.data?.map(({ id, name, avatarUrl }) => ({
                  value: id,
                  label: (
                    <SelectOptionWithAvatar
                      name={name}
                      avatarUrl={avatarUrl ?? undefined}
                    />
                  ),
                })) ?? []
              }
            />
          </Form.Item>
        </Form>
      </Modal>
      {children}
    </>
  );
};
