import React from "react";
import { useForm } from "@refinedev/antd";
import { Form, Input, Select, Card, Button, Space, Row, Col, Upload, message } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, GlobalOutlined, UploadOutlined } from "@ant-design/icons";

import { CREATE_USER_MUTATION, UPDATE_USER_MUTATION } from "../queries";

const { Option } = Select;

interface UserFormProps {
  isEdit?: boolean;
  userId?: string;
}

export const UserForm: React.FC<UserFormProps> = ({ isEdit = false, userId }) => {
  const { formProps, saveButtonProps, formLoading } = useForm({
    action: isEdit ? "edit" : "create",
    resource: "users",
    id: userId,
    meta: {
      gqlMutation: isEdit ? UPDATE_USER_MUTATION : CREATE_USER_MUTATION,
    },
  });

  const roleOptions = [
    { label: "Admin", value: "ADMIN" },
    { label: "Staff", value: "STAFF" },
    { label: "Manager", value: "MANAGER" },
  ];

  const statusOptions = [
    { label: "Hoạt động", value: "ACTIVE" },
    { label: "Không hoạt động", value: "INACTIVE" },
    { label: "Chờ xác nhận", value: "PENDING" },
    { label: "Tạm khóa", value: "SUSPENDED" },
  ];

  const timezoneOptions = [
    { label: "Asia/Ho_Chi_Minh (GMT+7)", value: "Asia/Ho_Chi_Minh" },
    { label: "UTC (GMT+0)", value: "UTC" },
    { label: "America/New_York (GMT-5)", value: "America/New_York" },
    { label: "Europe/London (GMT+0)", value: "Europe/London" },
  ];

  const handleAvatarUpload = (info: any) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
      formProps.form?.setFieldsValue({ avatarUrl: info.file.response.url });
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <div className="page-container">
      <Card
        title={
          <Space>
            <UserOutlined />
            <span>{isEdit ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}</span>
          </Space>
        }
      >
        <Form
          {...formProps}
          layout="vertical"
          onFinish={async (values) => {
            try {
              await formProps.onFinish?.(values);
              message.success(
                isEdit ? "Cập nhật người dùng thành công!" : "Tạo người dùng thành công!"
              );
            } catch (error) {
              message.error("Có lỗi xảy ra!");
            }
          }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Họ và tên"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Nhập email" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Chức vụ"
                name="jobTitle"
                rules={[{ required: true, message: "Vui lòng nhập chức vụ!" }]}
              >
                <Input placeholder="Nhập chức vụ" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Vai trò"
                name="role"
                rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
              >
                <Select placeholder="Chọn vai trò">
                  {roleOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Trạng thái"
                name="status"
                rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
              >
                <Select placeholder="Chọn trạng thái">
                  {statusOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Múi giờ"
                name="timezone"
                rules={[{ required: true, message: "Vui lòng chọn múi giờ!" }]}
              >
                <Select placeholder="Chọn múi giờ">
                  {timezoneOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Ảnh đại diện" name="avatarUrl">
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="/api/upload" // Cần implement upload API
              onChange={handleAvatarUpload}
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Tải ảnh</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={formLoading} {...saveButtonProps}>
                {isEdit ? "Cập nhật" : "Tạo mới"}
              </Button>
              <Button onClick={() => window.history.back()}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}; 