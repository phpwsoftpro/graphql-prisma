import React, { type FC } from "react";
import { CrownOutlined, StarOutlined, UserOutlined } from "@ant-design/icons";
import { Tag, type TagProps } from "antd";

import type { User } from "@/graphql/schema.types";

type Props = {
  role: User["role"] | string;
};

export const RoleTag: FC<Props> = ({ role }) => {
  const variants: Record<string, { color: TagProps["color"]; icon: React.ReactNode }> = {
    ADMIN: {
      color: "red",
      icon: <CrownOutlined />,
    },
    SALES_INTERN: {
      color: "blue",
      icon: <UserOutlined />,
    },
    SALES_PERSON: {
      color: "geekblue",
      icon: <UserOutlined />,
    },
    SALES_MANAGER: {
      color: "cyan",
      icon: <StarOutlined />,
    },
    STAFF: {
      color: "purple",
      icon: <UserOutlined />,
    },
    MANAGER: {
      color: "gold",
      icon: <StarOutlined />,
    },
  };

  const text = String(role).replace(/_/g, " ").toLowerCase();
  const variant = variants[role] || { color: "default", icon: <UserOutlined /> };

  return (
    <Tag
      style={{ textTransform: "capitalize" }}
      color={variant.color}
      icon={variant.icon}
    >
      {text}
    </Tag>
  );
}; 