import React from "react";
import { Tag } from "antd";
import { CheckCircleOutlined, StopOutlined, ClockCircleOutlined } from "@ant-design/icons";

export type UserStatus = "ACTIVE" | "INACTIVE" | "PENDING" | "SUSPENDED";

interface UserStatusTagProps {
  status: UserStatus;
}

export const UserStatusTag: React.FC<UserStatusTagProps> = ({ status }) => {
  const getStatusConfig = (status: UserStatus) => {
    switch (status) {
      case "ACTIVE":
        return {
          color: "success",
          icon: <CheckCircleOutlined />,
          text: "Active",
        };
      case "INACTIVE":
        return {
          color: "default",
          icon: <StopOutlined />,
          text: "Inactive",
        };
      case "PENDING":
        return {
          color: "processing",
          icon: <ClockCircleOutlined />,
          text: "Pending",
        };
      case "SUSPENDED":
        return {
          color: "error",
          icon: <StopOutlined />,
          text: "Suspended",
        };
      default:
        return {
          color: "default",
          icon: null,
          text: "Unknown",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Tag color={config.color} icon={config.icon}>
      {config.text}
    </Tag>
  );
}; 