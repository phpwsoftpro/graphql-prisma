import { Modal, Radio, Input, Form, Button, Space } from "antd";
import { useState } from "react";

interface CreateInvoiceProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: (data: { type: string; amount?: string; onlyCreate?: boolean }) => void;
}

export const CreateInvoice = ({ visible, onCancel, onCreate }: CreateInvoiceProps) => {
  const [type, setType] = useState("regular");
  const [amount, setAmount] = useState("");

  return (
    <Modal
      open={visible}
      title="Create invoices"
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <div style={{ marginBottom: 16, color: "#888" }}>
        Invoices will be created in draft so that you can review them before validation.
      </div>
      <Form layout="vertical">
        <Form.Item label="Create Invoice">
          <Radio.Group
            value={type}
            onChange={e => setType(e.target.value)}
            style={{ display: "flex", flexDirection: "column", gap: 8 }}
          >
            <Radio value="regular">Regular invoice</Radio>
            <Radio value="down_percent">Down payment (percentage)</Radio>
            <Radio value="down_fixed">Down payment (fixed amount)</Radio>
          </Radio.Group>
        </Form.Item>
        {(type === "down_percent" || type === "down_fixed") && (
          <Form.Item
            label={
              type === "down_percent"
                ? "Down Payment Amount (%)"
                : "Down Payment Amount (Fixed)"
            }
            required
          >
            <Input
              type="number"
              min={0}
              addonAfter={type === "down_percent" ? "%" : "$"}
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </Form.Item>
        )}
        <Form.Item>
          <Space>
            <Button
              type="primary"
              onClick={() => onCreate({ type, amount })}
            >
              CREATE AND VIEW INVOICE
            </Button>
            <Button
              onClick={() => onCreate({ type, amount, onlyCreate: true })}
            >
              CREATE INVOICE
            </Button>
            <Button onClick={onCancel}>CANCEL</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};
