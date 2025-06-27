import { registerEnumType } from "type-graphql";

export enum UserRole {
  // Basic User - Chỉ có quyền xem
  USER = "USER",
  
  // Admin - Có đầy đủ quyền thêm, sửa, xóa
  ADMIN = "ADMIN"
}

registerEnumType(UserRole, {
  name: "UserRole",
  description: "User roles: USER (read-only), ADMIN (full access)",
}); 