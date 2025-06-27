import { createParamDecorator } from "type-graphql";
import { PermissionService } from "../services/permission.service";
import { UserRole } from "../../enums/UserRole";

export interface PermissionContext {
  user: {
    id: number;
    role: UserRole;
  };
}

/**
 * Decorator để kiểm tra quyền đọc
 */
export function RequireReadPermission() {
  return createParamDecorator<PermissionContext>(({ context }) => {
    const userRole = context.user?.role;
    if (!userRole || !PermissionService.canRead(userRole)) {
      throw new Error("Access denied: Insufficient permissions to read data");
    }
    return context.user;
  });
}

/**
 * Decorator để kiểm tra quyền tạo mới
 */
export function RequireCreatePermission() {
  return createParamDecorator<PermissionContext>(({ context }) => {
    const userRole = context.user?.role;
    if (!userRole || !PermissionService.canCreate(userRole)) {
      throw new Error("Access denied: Insufficient permissions to create data");
    }
    return context.user;
  });
}

/**
 * Decorator để kiểm tra quyền cập nhật
 */
export function RequireUpdatePermission() {
  return createParamDecorator<PermissionContext>(({ context }) => {
    const userRole = context.user?.role;
    if (!userRole || !PermissionService.canUpdate(userRole)) {
      throw new Error("Access denied: Insufficient permissions to update data");
    }
    return context.user;
  });
}

/**
 * Decorator để kiểm tra quyền xóa
 */
export function RequireDeletePermission() {
  return createParamDecorator<PermissionContext>(({ context }) => {
    const userRole = context.user?.role;
    if (!userRole || !PermissionService.canDelete(userRole)) {
      throw new Error("Access denied: Insufficient permissions to delete data");
    }
    return context.user;
  });
}

/**
 * Decorator để kiểm tra quyền quản lý Users
 */
export function RequireUserManagementPermission() {
  return createParamDecorator<PermissionContext>(({ context }) => {
    const userRole = context.user?.role;
    if (!userRole || !PermissionService.canManageUsers(userRole)) {
      throw new Error("Access denied: Insufficient permissions for User management");
    }
    return context.user;
  });
}

/**
 * Decorator để kiểm tra quyền thực hiện action cụ thể
 */
export function RequirePermission(action: 'read' | 'create' | 'update' | 'delete') {
  return createParamDecorator<PermissionContext>(({ context }) => {
    const userRole = context.user?.role;
    if (!userRole || !PermissionService.canPerformAction(userRole, action)) {
      throw new Error(`Access denied: Insufficient permissions to ${action} data`);
    }
    return context.user;
  });
} 