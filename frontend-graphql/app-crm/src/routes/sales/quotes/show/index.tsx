import { lazy, Suspense, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useModal, useOne } from "@refinedev/core";

import { EditOutlined, LeftOutlined, MailOutlined, CloseOutlined, FileTextOutlined, ProjectOutlined, UnorderedListOutlined, GlobalOutlined } from "@ant-design/icons";
import { Button, Space, Tabs, Descriptions, Tag } from "antd";

import { CustomAvatar, FullScreenLoading, Text } from "@/components";
import type { Quote } from "@/graphql/schema.types";

import {
  ProductsServices,
  QuotesFormModal,
  ShowDescription,
  StatusIndicator,
} from "../../components";
import { QUOTES_GET_QUOTE_QUERY } from "../queries";
import styles from "./index.module.css";
import { CreateInvoice } from "../../components/create-invoice";

const PdfExport = lazy(() => import("../../components/pdf-export"));

export const QuotesShowPage = () => {
  const { visible, show, close } = useModal();

  const params = useParams<{ id: string }>();

  const { data, isLoading } = useOne<Quote>({
    resource: "quotes",
    id: params.id,
    liveMode: "off",
    meta: {
      gqlQuery: QUOTES_GET_QUOTE_QUERY,
    },
  });

  const [activeTab, setActiveTab] = useState("order_lines");
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

  if (isLoading || !data?.data) {
    return <FullScreenLoading />;
  }

  const {
    title,
    id,
    status,
    company,
    contact,
    salesOwner,
    expiration,
    paymentTerm,
    fiscalPosition,
    analyticAccount,
    tracking,
    projects,
    tasks,
    activities,
    invoices,
  } = (data.data as any);

  // Helper to safely get name or fallback to '_'
  const safeName = (obj: any) => obj?.name ?? '_';
  const safeAvatar = (obj: any) => obj?.avatarUrl ?? undefined;
  const safeText = (val: any) => val ?? '_';

  // Mock data for Other Info
  const otherInfo = {
    salesperson: safeName(salesOwner),
    salesTeam: "Sales",
    onlineConfirmation: ["Signature"],
    customerReference: "",
    tags: ["VIP"],
    shippingPolicy: "As soon as possible",
    deliveryDate: "05/23/2025",
    fiscalPosition: "",
    analyticAccount: "",
    tracking: {
      sourceDocument: "",
      campaign: "",
      medium: "",
      source: "",
    },
  };

  const quickLinks = [
    {
      icon: <ProjectOutlined />,
      label: "Projects",
      count: projects?.totalCount || 0,
    },
    {
      icon: <UnorderedListOutlined />,
      label: "Tasks",
      count: tasks?.totalCount || 0,
    },
    {
      icon: <FileTextOutlined />,
      label: "Invoices",
      count: invoices?.totalCount || 0,
    },
    {
      icon: <GlobalOutlined />,
      label: "Customer Preview",
      count: null,
    },
  ];

  return (
    <>
      <div className={styles.container}>
        <Link to="/quotes">
          {/* @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66 */}
          <Button icon={<LeftOutlined />}>Quotes</Button>
        </Link>
        <div className={styles.divider} />
        <div className={styles.title}>
          <Text
            size="xl"
            style={{
              fontWeight: 500,
            }}
          >
            {safeText(title)}
          </Text>
          <Space>
            <Suspense>
              <PdfExport />
            </Suspense>
            {status === "ACCEPTED" && (
              <Button type="primary" icon={<FileTextOutlined />} onClick={() => setInvoiceModalOpen(true)}>
                Create Invoice
              </Button>
            )}
            <Button type="default" icon={<MailOutlined />}>
              Send mail
            </Button>
            <Button type="default" danger icon={<CloseOutlined />}>
              Cancel
            </Button>
            <Button icon={<EditOutlined />} onClick={() => show()}>
              Edit
            </Button>
          </Space>
        </div>
        <StatusIndicator
          style={{
            marginTop: "32px",
          }}
          id={id}
          status={status}
        />
        <div style={{ display: "flex", gap: 24, margin: "16px 0" }}>
          {quickLinks.map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 16px",
                border: "1px solid #eee",
                borderRadius: 8,
                background: "#fff",
                minWidth: 120,
                cursor: "pointer",
              }}
            >
              {item.icon}
              <span style={{ marginLeft: 8, fontWeight: 500 }}>
                {item.count !== null && <span style={{ color: "#1890ff" }}>{item.count} </span>}
                {item.label}
              </span>
            </div>
          ))}
        </div>
        <div className={styles.pdf}>
          <div className={styles.pdfQuoteInfo}>
            <CustomAvatar
              name={safeName(company)}
              src={safeAvatar(company)}
              shape="square"
              style={{
                width: "64px",
                height: "64px",
              }}
            />
            <div className={styles.companyInfo}>
              <div className={styles.company}>
                <Text strong>{safeName(company)}</Text>
                <Text>{safeText(company?.country)}</Text>
                <Text>{safeText(company?.website)}</Text>
              </div>
            </div>
            <div className={styles.userInfo}>
              <div className={styles.user}>
                <Text strong>Prepared by:</Text>
                <Text>{safeName(salesOwner)}</Text>
              </div>
              <div className={styles.user}>
                <Text strong>Prepared for:</Text>
                <Text>{safeName(contact)}</Text>
              </div>
              <div className={styles.user}>
                <Text strong>Expiration:</Text>
                <Text>{safeText(expiration)}</Text>
              </div>
              <div className={styles.user}>
                <Text strong>Payment Term:</Text>
                <Text>{safeText(paymentTerm)}</Text>
              </div>
            </div>
          </div>
          <div className={styles.divider} />
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            type="card"
            style={{ marginBottom: 24 }}
          >
            <Tabs.TabPane tab="Order Lines" key="order_lines">
              <ProductsServices />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Optional Products" key="optional_products">
              <ProductsServices hideSubtotal hideSummary />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Other Info" key="other_info">
              <Descriptions
                title={null}
                bordered
                column={2}
                size="small"
                style={{ background: '#fff' }}
              >
                <Descriptions.Item label="Salesperson">
                  {otherInfo.salesperson}
                </Descriptions.Item>
                <Descriptions.Item label="Sales Team">
                  {otherInfo.salesTeam}
                </Descriptions.Item>
                <Descriptions.Item label="Online confirmation">
                  {otherInfo.onlineConfirmation.map((v) => (
                    <Tag key={v}>{v}</Tag>
                  ))}
                </Descriptions.Item>
                <Descriptions.Item label="Customer Reference">
                  {otherInfo.customerReference || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Tags">
                  {otherInfo.tags.map((v) => (
                    <Tag key={v}>{v}</Tag>
                  ))}
                </Descriptions.Item>
                <Descriptions.Item label="Shipping Policy">
                  {otherInfo.shippingPolicy}
                </Descriptions.Item>
                <Descriptions.Item label="Delivery Date">
                  {otherInfo.deliveryDate}
                </Descriptions.Item>
                <Descriptions.Item label="Fiscal Position">
                  {otherInfo.fiscalPosition || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Analytic Account">
                  {otherInfo.analyticAccount || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Source Document">
                  {otherInfo.tracking.sourceDocument || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Campaign">
                  {otherInfo.tracking.campaign || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Medium">
                  {otherInfo.tracking.medium || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Source">
                  {otherInfo.tracking.source || '-'}
                </Descriptions.Item>
              </Descriptions>
            </Tabs.TabPane>
          </Tabs>
          <div className={styles.divider} />
          <ShowDescription />
        </div>
      </div>
      {visible && (
        <QuotesFormModal
          action={"edit"}
          redirect={false}
          onCancel={() => close()}
          onMutationSuccess={() => close()}
        />
      )}
      <CreateInvoice
        visible={invoiceModalOpen}
        onCancel={() => setInvoiceModalOpen(false)}
        onCreate={(data) => {
          // Xử lý tạo hóa đơn ở đây
          setInvoiceModalOpen(false);
          // Có thể gọi API hoặc chuyển trang
        }}
      />
    </>
  );
};
