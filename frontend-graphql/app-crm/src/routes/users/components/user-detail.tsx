import React from "react";
import { useShow } from "@refinedev/core";
import { Card, Descriptions, Avatar, Space, Tag, Row, Col, Statistic, List } from "antd";
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  GlobalOutlined,
  CalendarOutlined,
  TeamOutlined,
  ShopOutlined,
  DollarOutlined
} from "@ant-design/icons";

import { CustomAvatar, Text } from "@/components";
import { RoleTag } from "./role-tag";
import { UserStatusTag } from "./user-status-tag";
import { USER_SHOW_QUERY } from "../show/queries";

export const UserDetail: React.FC = () => {
  const { queryResult } = useShow({
    meta: {
      gqlQuery: USER_SHOW_QUERY,
    },
  });

  const { data, isLoading } = queryResult;
  const user = data?.data;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="page-container">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <CustomAvatar 
                src={user.avatarUrl} 
                name={user.name} 
                size={120}
                style={{ marginBottom: 16 }}
              />
              <Text strong style={{ fontSize: 18, display: "block" }}>
                {user.name}
              </Text>
              <Text type="secondary">{user.jobTitle}</Text>
            </div>

            <Descriptions column={1} size="small">
              <Descriptions.Item 
                label={
                  <Space>
                    <MailOutlined />
                    Email
                  </Space>
                }
              >
                {user.email}
              </Descriptions.Item>
              
              <Descriptions.Item 
                label={
                  <Space>
                    <PhoneOutlined />
                    Số điện thoại
                  </Space>
                }
              >
                {user.phone || "-"}
              </Descriptions.Item>

              <Descriptions.Item 
                label={
                  <Space>
                    <GlobalOutlined />
                    Múi giờ
                  </Space>
                }
              >
                {user.timezone || "-"}
              </Descriptions.Item>

              <Descriptions.Item 
                label={
                  <Space>
                    <UserOutlined />
                    Vai trò
                  </Space>
                }
              >
                <RoleTag role={user.role} />
              </Descriptions.Item>

              <Descriptions.Item 
                label={
                  <Space>
                    <CalendarOutlined />
                    Trạng thái
                  </Space>
                }
              >
                <UserStatusTag status={user.status || "ACTIVE"} />
              </Descriptions.Item>

              <Descriptions.Item 
                label={
                  <Space>
                    <CalendarOutlined />
                    Ngày tạo
                  </Space>
                }
              >
                {new Date(user.createdAt).toLocaleDateString("vi-VN")}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Card>
                <Statistic
                  title="Công ty"
                  value={user.companies?.totalCount || 0}
                  prefix={<ShopOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card>
                <Statistic
                  title="Khách hàng"
                  value={user.contacts?.totalCount || 0}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card>
                <Statistic
                  title="Deals"
                  value={user.deals?.totalCount || 0}
                  prefix={<DollarOutlined />}
                />
              </Card>
            </Col>
          </Row>

          <Card 
            title="Công ty quản lý" 
            style={{ marginTop: 16 }}
            extra={<Text type="secondary">Tổng: {user.companies?.totalCount || 0}</Text>}
          >
            <List
              dataSource={user.companies?.nodes || []}
              renderItem={(company: any) => (
                <List.Item>
                  <List.Item.Meta
                    title={company.name}
                    description={`${company.country || ""} - ${company.industry || ""}`}
                  />
                </List.Item>
              )}
              locale={{ emptyText: "Chưa có công ty nào" }}
            />
          </Card>

          <Card 
            title="Khách hàng" 
            style={{ marginTop: 16 }}
            extra={<Text type="secondary">Tổng: {user.contacts?.totalCount || 0}</Text>}
          >
            <List
              dataSource={user.contacts?.nodes || []}
              renderItem={(contact: any) => (
                <List.Item>
                  <List.Item.Meta
                    title={contact.name}
                    description={`${contact.email} - ${contact.phone || ""}`}
                  />
                  <Space>
                    <Tag color="blue">{contact.stage}</Tag>
                    <Tag color="green">{contact.status}</Tag>
                  </Space>
                </List.Item>
              )}
              locale={{ emptyText: "Chưa có khách hàng nào" }}
            />
          </Card>

          <Card 
            title="Deals" 
            style={{ marginTop: 16 }}
            extra={<Text type="secondary">Tổng: {user.deals?.totalCount || 0}</Text>}
          >
            <List
              dataSource={user.deals?.nodes || []}
              renderItem={(deal: any) => (
                <List.Item>
                  <List.Item.Meta
                    title={deal.title}
                    description={`$${deal.value?.toLocaleString() || 0}`}
                  />
                  <Tag color="purple">{deal.stage?.title}</Tag>
                </List.Item>
              )}
              locale={{ emptyText: "Chưa có deals nào" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}; 