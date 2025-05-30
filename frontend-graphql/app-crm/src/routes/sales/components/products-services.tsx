import { useParams } from "react-router-dom";

import { AutoSaveIndicator, useForm } from "@refinedev/antd";
import type { HttpError } from "@refinedev/core";
import type { GetFields, GetVariables } from "@refinedev/nestjs-query";

import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  type InputNumberProps,
  type InputProps,
  Row,
  Skeleton,
  Spin,
  Select,
} from "antd";

import { FullScreenLoading, Text } from "@/components";
import type { Quote, QuoteUpdateInput } from "@/graphql/schema.types";
import type {
  QuotesUpdateQuoteMutation,
  QuotesUpdateQuoteMutationVariables,
} from "@/graphql/types";
import { currencyNumber } from "@/utilities";
import { useWatch } from "antd/es/form/Form";

import { QUOTES_UPDATE_QUOTE_MUTATION } from "../quotes/queries";

const columns = [
  {
    title: "Title",
    dataIndex: "title",
    width: 150,
    Input: (props: InputProps) => <Input {...props} />,
  },
  {
    title: "Description",
    dataIndex: "description",
    width: 130,
    Input: (props: InputProps) => <Input {...props} />,
  },
  {
    title: "Unit Price",
    dataIndex: "unitPrice",
    width: 130,
    Input: (props: InputNumberProps) => (
      <InputNumber
        style={{ width: "100%" }}
        min={0}
        formatter={(value) =>
          currencyNumber(Number(value || 0)).replace("$", "")
        }
        addonBefore="$"
        {...props}
      />
    ),
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    width: 80,
    Input: (props: InputNumberProps) => (
      <InputNumber
        style={{ width: "100%" }}
        min={0}
        formatter={(value) => (value ?? 0).toString()}
        {...props}
      />
    ),
  },
  {
    title: "UoM",
    dataIndex: "uom",
    width: 110,
    Input: (props: any) => (
      <Select
        showSearch
        style={{ width: "100%" }}
        options={[
          { label: "Units", value: "Units" },
          { label: "Dozens", value: "Dozens" },
        ]}
        {...props}
      />
    ),
  },
  {
    title: "Taxes",
    dataIndex: "taxes",
    width: 100,
    Input: (props: InputNumberProps) => (
      <InputNumber
        style={{ width: "100%" }}
        addonAfter="%"
        min={0}
        formatter={(value) => (value ?? 0).toString()}
        {...props}
      />
    ),
  },
  {
    title: "Total Price",
    dataIndex: "totalPrice",
    width: 120,
    Input: (props: InputNumberProps) => (
      <InputNumber
        disabled
        value={props.value}
        formatter={(value) => currencyNumber(Number(value || 0))}
        style={{ width: "100%", color: "rgba(0, 0, 0, 0.85)" }}
        bordered={false}
        {...props}
      />
    ),
  },
];

// Add calculateTotalPrice function
const calculateTotalPrice = (unitPrice: number, quantity: number, taxes: number = 0) => {
  const subtotal = unitPrice * quantity;
  const taxAmount = (subtotal * taxes) / 100;
  return subtotal + taxAmount;
};

export const ProductsServices = ({ hideSubtotal = false, hideSummary = false }: { hideSubtotal?: boolean; hideSummary?: boolean }) => {
  const params = useParams<{ id: string }>();

  const {
    formProps,
    autoSaveProps,
    query: queryResult,
  } = useForm<
    GetFields<QuotesUpdateQuoteMutation>,
    HttpError,
    GetVariables<QuotesUpdateQuoteMutationVariables>
  >({
    resource: "quotes",
    action: "edit",
    id: params.id,
    liveMode: "off",
    autoSave: {
      enabled: true,
      debounce: 300,
      onFinish: (values) => {
        const items = (values.items || []).filter((item) => !!item?.title);
        items?.forEach((item) => {
          if ("totalPrice" in item) {
            delete (item as any).totalPrice;
          }
        });
        return {
          ...values,
          items,
        };
      },
    },
    onMutationSuccess: () => {
      refetch?.();
    },
    meta: {
      gqlMutation: QUOTES_UPDATE_QUOTE_MUTATION,
    },
  });

  const { isLoading = false, isFetching = false, refetch } = queryResult ?? {};
  const data = queryResult?.data?.data as Quote | undefined;
  const total = data?.total ?? 0;
  const subTotal = data?.subTotal ?? 0;
  const items = data?.items ?? [];

  // Add function to handle field changes
  const handleFieldChange = (fieldName: string, value: number, index: number) => {
    const currentItems = formProps.form?.getFieldValue('items') || [];
    if (!currentItems || !currentItems[index]) return;

    const item = currentItems[index];
    const unitPrice = Number(item.unitPrice || 0);
    const quantity = Number(item.quantity || 0);
    const taxes = Number(item.taxes || 0);

    const totalPrice = calculateTotalPrice(unitPrice, quantity, taxes);
    
    // Update the totalPrice field
    const newItems = [...currentItems];
    newItems[index] = {
      ...newItems[index],
      totalPrice,
    };
    formProps.form?.setFieldValue('items', newItems);
  };

  // Calculate subtotal from form items
  const subtotal = (formProps.form?.getFieldValue('items') || [])
    .filter((item: any) => item && item.type !== 'section')
    .reduce((sum: number, item: any) => {
      const unitPrice = Number(item.unitPrice || 0);
      const quantity = Number(item.quantity || 0);
      const taxes = Number(item.taxes || 0);
      return sum + calculateTotalPrice(unitPrice, quantity, taxes);
    }, 0);

  // Use Form.useWatch to get real-time sales tax
  const salesTax = useWatch('tax', formProps.form) || 0;
  const totalValue = subtotal + (subtotal * salesTax / 100);

  return (
    <div
      style={{
        padding: "0px 32px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          size="xl"
          style={{
            fontWeight: 500,
          }}
        >
          Products / Services
        </Text>
        <AutoSaveIndicator {...autoSaveProps} />
      </div>

      <div
        style={{
          marginTop: "32px",
          border: "1px solid #d9d9d9",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <Row
          gutter={[16, 16]}
          style={{
            padding: "12px 16px",
            backgroundColor: "#fafafa",
            borderBottom: "1px solid #F0F0F0",
          }}
        >
          {columns.map((column) => {
            return (
              <Col
                key={column.title}
                style={{
                  width: column.width,
                  minWidth: column.width,
                  borderRight: "1px solid #F0F0F0",
                  ...(column.dataIndex === "title" || column.dataIndex === "description"
                    ? {
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                      }
                    : {
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                      }),
                }}
              >
                <Text
                  size="sm"
                  style={{
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                  }}
                >
                  {column.title}
                </Text>
              </Col>
            );
          })}
        </Row>
        <Form {...formProps}>
          {isLoading && <FullScreenLoading />}
          {!isLoading && (
            <Form.List name="items">
              {(fields, { add, remove }) => {
                return (
                  <>
                    {fields.map((field) => {
                      const item = (items?.[field.name] || {}) as any;
                      return (
                        <div
                          key={field.key}
                          style={{
                            padding: "8px 16px",
                            borderBottom: "1px solid #d9d9d9",
                          }}
                        >
                          <Row gutter={[16, 16]}>
                            {columns.map(({ Input, ...column }) => (
                              <Col
                                key={column.title}
                                style={{
                                  width: column.width,
                                  minWidth: column.width,
                                  ...(column.dataIndex === "title" || column.dataIndex === "description"
                                    ? {
                                        display: "-webkit-box",
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "normal",
                                        wordBreak: "break-word",
                                      }
                                    : {
                                        whiteSpace: "normal",
                                        wordBreak: "break-word",
                                      }),
                                }}
                              >
                                {column.dataIndex === "totalPrice" ? (
                                  <Form.Item
                                    noStyle
                                    dependencies={[["items", field.name, "unitPrice"], ["items", field.name, "quantity"], ["items", field.name, "taxes"]]}
                                  >
                                    {(form) => {
                                      const item = form.getFieldValue(["items", field.name]) || {};
                                      const unitPrice = Number(item.unitPrice || 0);
                                      const quantity = Number(item.quantity || 0);
                                      const taxes = Number(item.taxes || 0);
                                      const totalPrice = calculateTotalPrice(unitPrice, quantity, taxes);
                                      return (
                                        <InputNumber
                                          style={{ width: "100%" }}
                                          value={totalPrice}
                                          formatter={(value) => currencyNumber(Number(value || 0))}
                                          disabled
                                          bordered={false}
                                        />
                                      );
                                    }}
                                  </Form.Item>
                                ) : (
                                  <Form.Item
                                    {...field}
                                    noStyle
                                    name={[field.name, column.dataIndex]}
                                  >
                                    {column.dataIndex === "unitPrice" || column.dataIndex === "quantity" || column.dataIndex === "taxes" ? (
                                      <InputNumber style={{ width: "100%" }} />
                                    ) : (
                                      <Input />
                                    )}
                                  </Form.Item>
                                )}
                              </Col>
                            ))}
                            <Col span={1}>
                              <Button
                                size="small"
                                style={{
                                  marginTop: "4px",
                                }}
                                danger
                                icon={<DeleteOutlined onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} />}
                                onClick={() => remove(field.name)}
                              />
                            </Col>
                          </Row>
                        </div>
                      );
                    })}
                    <div style={{ display: "flex", gap: 8 }}>
                      <Button
                        type="link"
                        icon={<PlusCircleOutlined onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} />}
                        onClick={() =>
                          add({
                            title: "",
                            unitPrice: 0,
                            quantity: 0,
                            discount: 0,
                          })
                        }
                        style={{
                          marginTop: "8px",
                          marginBottom: "8px",
                        }}
                      >
                        Add new item
                      </Button>
                    </div>
                  </>
                );
              }}
            </Form.List>
          )}
        </Form>
      </div>

      {!hideSummary && (
        <TotalSection
          total={totalValue}
          subTotal={subtotal}
          isLoading={isLoading}
          isFetching={isFetching}
          taxFormOnMutationSuccess={() => refetch?.()}
          hideSubtotal={hideSubtotal}
          salesTax={salesTax}
          form={formProps.form}
        />
      )}
    </div>
  );
};

const TotalSection = (props: {
  total: number;
  subTotal: number;
  isLoading: boolean;
  isFetching: boolean;
  taxFormOnMutationSuccess: () => void;
  hideSubtotal?: boolean;
  salesTax?: number;
  form?: any;
}) => {
  const { total, subTotal, isLoading, isFetching, taxFormOnMutationSuccess, hideSubtotal, form } = props;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "max-content",
        gap: "16px",
        marginTop: "16px",
        marginLeft: "auto",
      }}
    >
      {isLoading && (
        <>
          <Skeleton.Input
            size="small"
            style={{ width: "96px", height: "22px" }}
            block
          />
          <Skeleton.Input
            size="small"
            style={{ width: "96px", height: "22px" }}
            block
          />
          {!hideSubtotal && (
            <Skeleton.Input
              size="small"
              style={{ width: "96px", height: "22px" }}
              block
            />
          )}
        </>
      )}
      {!isLoading && (
        <>
          {!hideSubtotal && (
            <div
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "space-between",
              }}
            >
              <div>
                <Text size="sm">Subtotal</Text>
              </div>
              <div>
                <Text size="sm">{currencyNumber(subTotal || 0)}</Text>
              </div>
            </div>
          )}
          <div
            style={{
              display: "flex",
              gap: "16px",
            }}
          >
            <div>
              <Text size="sm">Sales tax</Text>
            </div>
            <div
              style={{
                width: "96px",
                justifyContent: "space-between",
              }}
            >
              <Form.Item noStyle name="tax" form={form} initialValue={0}>
                <InputNumber
                  size="small"
                  min={0}
                  addonAfter={isFetching ? <Spin size="small" /> : "%"}
                  style={{ width: 96 }}
                />
              </Form.Item>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Text size="sm">Total value</Text>
            </div>
            <div>
              <Text size="sm">{currencyNumber(total || 0)}</Text>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
