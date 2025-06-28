import type { FC } from "react";
import { Modal, Form, Input } from "antd";
import { useModalForm } from "@refinedev/antd";
import { type HttpError, type RedirectAction } from "@refinedev/core";
import { PRODUCT_CREATE_MUTATION } from "../queries";

type Props = {
  action: "create" | "edit";
  redirect?: RedirectAction;
  onCancel?: () => void;
  onMutationSuccess?: () => void;
};

export const ProductsFormModal: FC<Props> = ({
  action,
  redirect,
  onCancel,
  onMutationSuccess,
}) => {
  const { modalProps, formProps, close } = useModalForm<any, HttpError, any>({
    resource: "products",
    action,
    defaultVisible: true,
    redirect,
    meta: {
      gqlMutation: PRODUCT_CREATE_MUTATION,
    },
    onMutationSuccess: () => {
      onMutationSuccess?.();
    },
  });

  return (
    <Modal
      {...modalProps}
      onCancel={() => {
        if (onCancel) {
          onCancel();
          return;
        }
        close();
      }}
    >
      <Form {...formProps} layout="vertical">
        <Form.Item name="title" label="Product name" rules={[{ required: true }]}> 
          <Input />
        </Form.Item>
        <Form.Item name="unitPrice" label="Sales Price">
          <Input type="number" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
