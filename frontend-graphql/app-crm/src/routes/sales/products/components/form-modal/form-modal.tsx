import type { FC } from "react";
import { useState, useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select, Spin, Checkbox, Row, Col, Tabs,message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useInvalidate, useOne } from "@refinedev/core";
import { dataProvider, API_URL } from "@/providers/data";
import { PRODUCT_SHOW_QUERY } from "../../queries";
import styles from "./index.module.css";

const PRODUCT_TYPES = [
  { value: "consumable", label: "Consumable" },
  { value: "stockable", label: "Stockable" },
  { value: "service", label: "Service" },
];
const INVOICING_POLICIES = [
  { value: "ordered", label: "Ordered quantities" },
  { value: "delivered", label: "Delivered quantities" },
];
const REINVOICE_EXPENSES = [
  { value: "no", label: "No" },
  { value: "at_cost", label: "At cost" },
  { value: "sales_price", label: "Sales price" },
];
const UOM_OPTIONS = [
  { value: "Units", label: "Units" },
  { value: "Box", label: "Box" },
  { value: "Hours", label: "Hours" },
];
const CATEGORY_OPTIONS = [
  { value: "all", label: "All" },
  { value: "food", label: "Food" },
  { value: "drink", label: "Drink" },
];
const TAX_OPTIONS = [
  { value: "vat10", label: "VAT 10%" },
  { value: "vat0", label: "VAT 0%" },
];

// Inventory/accounting field options (placeholder)
const ACCOUNT_OPTIONS = [
  { value: "income", label: "Income Account" },
  { value: "expense", label: "Expense Account" },
];
const ASSET_TYPE_OPTIONS = [
  { value: "none", label: "None" },
  { value: "asset", label: "Asset" },
];

const CREATE_ON_ORDER_OPTIONS = [
  { value: "nothing", label: "Nothing" },
  { value: "task", label: "Task" },
  { value: "project_task", label: "Project & Task" },
  { value: "project", label: "Project" },
];

type Props = {
  action: "create" | "edit";
  onCancel?: () => void;
  onMutationSuccess?: () => void;
};

export const ProductsFormModal: FC<Props> = ({ action, onCancel, onMutationSuccess }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const invalidate = useInvalidate();
  const params = useParams<{ id: string }>();

  const { data: productData, isLoading: isLoadingProduct } = useOne({
    resource: "products",
    id: params.id ? Number(params.id) : undefined,
    queryOptions: { enabled: action === "edit" },
    meta: { gqlQuery: PRODUCT_SHOW_QUERY },
  });

  useEffect(() => {
    if (action === "edit" && productData?.data) {
      form.setFieldsValue({
        ...productData.data,
      });
    }
  }, [action, productData, form]);

  // Theo dõi giá trị checkbox
  const canBeSold = Form.useWatch("canBeSold", form);
  const canBePurchased = Form.useWatch("canBePurchased", form);
  const productType = Form.useWatch("productType", form);

  const handleClose = () => {
    setOpen(false);
    if (onCancel) onCancel();
    navigate("/products");
  };

  return (
    <Modal
      open={open}
      title={action === "create" ? "Create Product" : "Edit Product"}
      onCancel={handleClose}
      onOk={() => {
          form.validateFields().then(async (values) => {
            setLoading(true);
            const variables =
              action === "create"
                ? { data: { name: values.name, description: values.description, salesPrice: Number(values.salesPrice), status: values.status || "active" } }
                : { id: Number(params.id), data: { name: values.name, description: values.description, salesPrice: Number(values.salesPrice), status: values.status || "active" } };
            const rawQuery =
              action === "create"
                ? `
                    mutation CreateProduct($data: CreateProductInput!) {
                      createProduct(data: $data) {
                        id
                        name
                        status
                      }
                    }
                  `
                : `
                    mutation UpdateProduct($id: ID!, $data: UpdateProductInput!) {
                      updateProduct(id: $id, data: $data) {
                        id
                        name
                        status
                      }
                    }
                  `;
            try {
              await dataProvider.custom({
                url: API_URL,
                method: "post",
                meta: {
                  variables,
                  rawQuery,
                },
              });
              await invalidate({ resource: "products", invalidates: ["list"] });
              message.success(
                action === "create"
                  ? "Successfully created product"
                  : "Successfully updated product"
              );
              setLoading(false);
              onMutationSuccess?.();
              setOpen(false);
              navigate("/products");
            } catch (error) {
              console.error(
                action === "create" ? "Create product error:" : "Update product error:",
                error
              );
              setLoading(false);
            }
          });
        }}

      confirmLoading={loading}
      width={900}
      destroyOnClose
    >
      <Spin spinning={loading || isLoadingProduct}>
        <Form
          form={form}
          layout="vertical"
          initialValues={
            action === "create"
              ? {
                  productType: "consumable",
                  invoicingPolicy: "ordered",
                  reInvoiceExpenses: "no",
                  unitOfMeasure: "Units",
                  purchaseUoM: "Units",
                  canBeSold: false,
                  canBePurchased: false,
                }
              : undefined
          }
        >
          <Tabs defaultActiveKey="general">
            <Tabs.TabPane tab="General Information" key="general">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="name" label="Product Name" rules={[{ required: true }]}> 
                    <Input placeholder="e.g. Cheese Burger" />
                  </Form.Item>
                  <Form.Item label="Can be Sold / Purchased">
                    <Form.Item name="canBeSold" valuePropName="checked" initialValue={true} noStyle>
                      <Checkbox style={{ marginRight: 24 }}>Can be Sold</Checkbox>
                    </Form.Item>
                    <Form.Item name="canBePurchased" valuePropName="checked" initialValue={true} noStyle>
                      <Checkbox>Can be Purchased</Checkbox>
                    </Form.Item>
                  </Form.Item>
                  <Form.Item name="productType" label="Product Type" rules={[{ required: true }]}> 
                    <Select options={PRODUCT_TYPES} placeholder="Select type" />
                  </Form.Item>
                  <Form.Item name="invoicingPolicy" label="Invoicing Policy"> 
                    <Select options={INVOICING_POLICIES} placeholder="Select policy" />
                  </Form.Item>
                  {productType === "service" && (
                    <Form.Item name="createOnOrder" label="Create on Order">
                      <Select options={CREATE_ON_ORDER_OPTIONS} placeholder="Select option" />
                    </Form.Item>
                  )}
                  <Form.Item name="reInvoiceExpenses" label="Re-Invoice Expenses">
                    <Select options={REINVOICE_EXPENSES} />
                  </Form.Item>
                  <Form.Item name="unitOfMeasure" label="Unit of Measure"> 
                    <Select options={UOM_OPTIONS} placeholder="Select UoM" />
                  </Form.Item>
                  <Form.Item name="purchaseUoM" label="Purchase UoM"> 
                    <Select options={UOM_OPTIONS} placeholder="Select Purchase UoM" />
                  </Form.Item>
                  <Form.Item name="description" label={<b>Internal Notes</b>}>
                    <Input.TextArea rows={3} placeholder="This note is only for internal purposes." />
                  </Form.Item>
                  <Form.Item name="status" label="Status" rules={[{ required: false }]}>
                    <Input placeholder="e.g. active, inactive" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="salesPrice" label="Sales Price" rules={[{ required: true }]}>
                    <InputNumber min={0} style={{ width: "100%" }} placeholder="e.g. 1.00" addonAfter="$" />
                  </Form.Item>
                  <Form.Item name="customerTaxes" label="Customer Taxes">
                    <Select options={TAX_OPTIONS} placeholder="Select tax" />
                  </Form.Item>
                  <Form.Item name="cost" label="Cost"> 
                    <InputNumber min={0} style={{ width: "100%" }} placeholder="e.g. 0.00" addonAfter="$" />
                  </Form.Item>
                  <Form.Item name="category" label="Product Category"> 
                    <Select options={CATEGORY_OPTIONS} placeholder="Select category" />
                  </Form.Item>
                  <Form.Item name="internalReference" label="Internal Reference"> 
                    <Input placeholder="SKU/Code" />
                  </Form.Item>
                  <Form.Item name="barcode" label="Barcode"> 
                    <Input placeholder="Barcode" />
                  </Form.Item>
                  <Form.Item name="tags" label="Product Tags"> 
                    <Select mode="tags" style={{ width: "100%" }} placeholder="Add tags" />
                  </Form.Item>
                </Col>
              </Row>
            </Tabs.TabPane>
            {productType !== "service" && (
              <Tabs.TabPane tab="Inventory" key="inventory">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="routes" label="Routes">
                      <Input placeholder="e.g. View Diagram" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="responsible" label="Responsible">
                      <Input placeholder="e.g. Administrator" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="weight" label="Weight">
                      <InputNumber min={0} style={{ width: "100%" }} placeholder="0.00" addonAfter="kg" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="volume" label="Volume">
                      <InputNumber min={0} style={{ width: "100%" }} placeholder="0.00" addonAfter="m³" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item name="receiptNote" label="Description for Receipts">
                      <Input.TextArea rows={2} placeholder="This note is added to receipt orders..." />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item name="deliveryNote" label="Description for Delivery Orders">
                      <Input.TextArea rows={2} placeholder="This note is added to delivery orders..." />
                    </Form.Item>
                  </Col>
                </Row>
              </Tabs.TabPane>
            )}
            {canBeSold && (
              <Tabs.TabPane tab="Sales" key="sales">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="salesNote" label="Sales Note">
                      <Input.TextArea rows={2} placeholder="This note is added to sales orders..." />
                    </Form.Item>
                  </Col>
                </Row>
              </Tabs.TabPane>
            )}
            {canBePurchased && (
              <Tabs.TabPane tab="Purchase" key="purchase">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="vendorTaxes" label="Vendor Taxes">
                      <Select options={TAX_OPTIONS} placeholder="Select vendor tax" />
                    </Form.Item>
                  </Col>
                </Row>
              </Tabs.TabPane>
            )}
            <Tabs.TabPane tab="Accounting" key="accounting">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="incomeAccount" label="Income Account">
                    <Select options={ACCOUNT_OPTIONS} placeholder="Select income account" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="expenseAccount" label="Expense Account">
                    <Select options={ACCOUNT_OPTIONS} placeholder="Select expense account" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="assetType" label="Asset Type">
                    <Select options={ASSET_TYPE_OPTIONS} placeholder="Select asset type" />
                  </Form.Item>
                </Col>
              </Row>
            </Tabs.TabPane>
          </Tabs>
        </Form>
      </Spin>
    </Modal>
  );
};
