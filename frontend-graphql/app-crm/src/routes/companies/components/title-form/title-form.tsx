import { useState } from "react";

import { useForm } from "@refinedev/antd";
import type { HttpError } from "@refinedev/core";
import type { GetFields, GetVariables } from "@refinedev/nestjs-query";

import { EditOutlined } from "@ant-design/icons";
import { Button, Form, Select, Skeleton, Space } from "antd";

import { CustomAvatar, SelectOptionWithAvatar, Text } from "@/components";
import type { User } from "@/graphql/schema.types";
import type {
  CompanyTitleFormMutation,
  CompanyTitleFormMutationVariables,
} from "@/graphql/types";
import { useUsersSelect } from "@/hooks/useUsersSelect";
import { getNameInitials } from "@/utilities";
import { capitalizeWords } from "@/utilities/format-string";

import { COMPANY_TITLE_FORM_MUTATION, COMPANY_TITLE_QUERY } from "./queries";
import styles from "./title-form.module.css";
import { useResource } from "@refinedev/core";
export const CompanyTitleForm = ({ isEdit = true }: { isEdit?: boolean } = {}) => {
  const { id } = useResource();
  const {
    formProps,
    query: queryResult,
    onFinish,
  } = useForm<
    GetFields<CompanyTitleFormMutation>,
    HttpError,
    GetVariables<CompanyTitleFormMutationVariables>
  >({
    id: Number(id),
    redirect: false,
    meta: {
      gqlMutation: COMPANY_TITLE_FORM_MUTATION,
      gqlQuery: COMPANY_TITLE_QUERY,
    },
  });
 
  const company = queryResult?.data?.data;
  const loading = queryResult?.isLoading;

  return (
    <Form {...formProps}>
      <Space size={16}>
        <CustomAvatar
          size="large"
          shape="square"
          src={company?.avatarUrl}
          name={getNameInitials(company?.name || "")}
          style={{
            width: 96,
            height: 96,
            fontSize: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
          }}
        />
        <Space direction="vertical" size={0}>
          <Form.Item name="name" required noStyle>
            <TitleInput
              loading={loading}
              onChange={isEdit ? (value) => {
                return onFinish?.({
                  name: value,
                });
              } : undefined}
              value={capitalizeWords(company?.name || "")}
              isEdit={isEdit}
            />
          </Form.Item>
          <SalesOwnerInput
            salesOwner={company?.salesOwner}
            loading={loading}
            onChange={isEdit ? (value) => {
              onFinish?.({
                salesOwnerId: Number(value),
              });
            } : undefined}
            isEdit={isEdit}
          />
        </Space>
      </Space>
    </Form>
  );
};

const TitleInput = ({
  value,
  onChange,
  loading,
  isEdit = true,
}: {
  value?: string;
  onChange?: (value: string) => void;
  loading?: boolean;
  isEdit?: boolean;
}) => {
  return (
    <Text
      className={styles.title}
      size="xl"
      strong
      editable={isEdit ? {
        onChange,
        triggerType: ["text", "icon"],
        // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
        icon: <EditOutlined className={styles.titleEditIcon} />,
      } : false}
    >
      {loading ? (
        <Skeleton.Input size="small" style={{ width: 200 }} active />
      ) : (
        value
      )}
    </Text>
  );
};

const SalesOwnerInput = ({
  salesOwner,
  onChange,
  loading,
  isEdit = true,
}: {
  onChange?: (value: string) => void;
  salesOwner?: Partial<User>;
  loading?: boolean;
  isEdit?: boolean;
}) => {
  const [isEditState, setIsEditState] = useState(false);

  const { selectProps, queryResult } = useUsersSelect();

  return (
    <div
      className={styles.salesOwnerInput}
      role="button"
      onClick={() => {
        if (isEdit) setIsEditState(true);
      }}
      style={{ cursor: isEdit ? "pointer" : "default" }}
    >
      <Text
        type="secondary"
        style={{
          marginRight: 12,
        }}
      >
        Sales Owner:
      </Text>
      {loading && <Skeleton.Input size="small" style={{ width: 120 }} active />}
      {!isEditState && !loading && (
        <>
          <CustomAvatar
            size="small"
            src={salesOwner?.avatarUrl}
            style={{
              marginRight: 4,
            }}
          />
          <Text>{salesOwner?.name}</Text>
          {isEdit && (
            <Button
              type="link"
              // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
              icon={<EditOutlined className={styles.salesOwnerInputEditIcon} />}
            />
          )}
        </>
      )}
      {isEditState && isEdit && !loading && (
        <Form.Item name={["salesOwner", "id"]} noStyle>
          <Select
            {...selectProps}
            defaultOpen={true}
            autoFocus
            onDropdownVisibleChange={(open) => {
              if (!open) {
                setIsEditState(false);
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
            onChange={(value, option) => {
              onChange?.(value as unknown as string);
              selectProps.onChange?.(value, option);
            }}
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
      )}
    </div>
  );
};
