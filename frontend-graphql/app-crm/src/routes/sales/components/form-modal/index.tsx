import type { FC } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";

import { useModalForm } from "@refinedev/antd";
import {
  type HttpError,
  type RedirectAction,
  useNavigation,
} from "@refinedev/core";
import type { GetFields, GetVariables } from "@refinedev/nestjs-query";

import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, Spin } from "antd";

import type {
  QuotesCreateQuoteMutation,
  QuotesCreateQuoteMutationVariables,
} from "@/graphql/types";
import { useCompaniesSelect } from "@/hooks/useCompaniesSelect";
import { useContactsSelect } from "@/hooks/useContactsSelect";
import { useUsersSelect } from "@/hooks/useUsersSelect";

import {
  QUOTES_CREATE_QUOTE_MUTATION,
  QUOTES_UPDATE_QUOTE_MUTATION,
} from "../../quotes/queries";

type Props = {
  action: "create" | "edit";
  redirect?: RedirectAction;
  onMutationSuccess?: () => void;
  onCancel?: () => void;
};

export const QuotesFormModal: FC<Props> = ({
  action,
  redirect,
  onMutationSuccess,
  onCancel,
}) => {
  const { pathname } = useLocation();
  const params = useParams<{ id: string }>();
  const { list, replace } = useNavigation();
  const [searchParams] = useSearchParams();

  const {
    formProps,
    modalProps,
    close,
    error,
  } = useModalForm<
    GetFields<QuotesCreateQuoteMutation>,
    HttpError,
    GetVariables<QuotesCreateQuoteMutationVariables>
  >({
    resource: "quotes",
    action,
    id: params.id,
    defaultVisible: true,
    redirect,
    meta: {
      gqlMutation:
        action === "create"
          ? QUOTES_CREATE_QUOTE_MUTATION
          : QUOTES_UPDATE_QUOTE_MUTATION,
    },
    onMutationSuccess: () => {
      onMutationSuccess?.();
    },
  });

  const {
    selectProps: selectPropsCompanies,
    queryResult: { isLoading: isLoadingCompanies },
  } = useCompaniesSelect();

  const {
    selectProps: selectPropsContacts,
    queryResult: { isLoading: isLoadingContact },
  } = useContactsSelect();

  const {
    selectProps: selectPropsSalesOwners,
    queryResult: { isLoading: isLoadingSalesOwners },
  } = useUsersSelect();

  const loading = isLoadingCompanies || isLoadingContact || isLoadingSalesOwners;
  const isHaveOverModal = pathname.includes("company-create");

  return (
    <Modal
      {...modalProps}
      confirmLoading={loading || modalProps.confirmLoading}
      width={560}
      style={isHaveOverModal ? { display: "none" } : undefined}
      onCancel={() => {
        if (onCancel) {
          onCancel();
          return;
        }
        close();
        list("quotes", "replace");
      }}
    >
      <Spin spinning={loading}>
        {error && (
          <div style={{ color: "red", marginBottom: 12 }}>
            {error?.message ?? JSON.stringify(error)}
          </div>
        )}
        <Form {...formProps} layout="vertical">
          <Form.Item
            rules={[{ required: true }]}
            name="title"
            label="Quotes title"
          >
            <Input placeholder="Please enter quote title" />
          </Form.Item>
          <Form.Item
            rules={[{ required: false }]}
            name="salesOwnerId"
            initialValue={formProps?.initialValues?.salesOwner?.id ?? undefined}
            label="Sales owner"
          >
            <Select
              {...selectPropsSalesOwners}
              placeholder="Please select user"
            />
          </Form.Item>
          <Form.Item
            rules={[{ required: false }]}
            name="companyId"
            initialValue={
              searchParams.get("companyId") ??
              formProps?.initialValues?.company?.id ??
              undefined
            }
            label="Company"
            extra={
              <Button
                style={{ paddingLeft: 0 }}
                type="link"
                icon={<PlusCircleOutlined />}
                onClick={() => replace(`company-create?to=${pathname}`)}
              >
                Add new company
              </Button>
            }
          >
            <Select
              {...selectPropsCompanies}
              placeholder="Please select company"
            />
          </Form.Item>
          <Form.Item
            rules={[{ required: false }]}
            name="contactId"
            initialValue={formProps?.initialValues?.contact?.id ?? undefined}
            label="Quote Contact"
          >
            <Select
              {...selectPropsContacts}
              placeholder="Please select contact"
            />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
