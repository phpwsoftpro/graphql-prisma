import { UserRole } from "../../enums/UserRole";

export interface UserPermissions {
  canRead: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
}

export class PermissionService {
  /**
   * Kiểm tra quyền của user theo role
   */
  static getUserPermissions(role: UserRole): UserPermissions {
    switch (role) {
      case UserRole.ADMIN:
        return {
          canRead: true,
          canCreate: true,
          canUpdate: true,
          canDelete: true,
          canManageUsers: true,
        };

      case UserRole.USER:
      default:
        return {
          canRead: true,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canManageUsers: false,
        };
    }
  }

  /**
   * Kiểm tra user có quyền đọc không
   */
  static canRead(role: UserRole): boolean {
    const permissions = this.getUserPermissions(role);
    return permissions.canRead;
  }

  /**
   * Kiểm tra user có quyền tạo mới không
   */
  static canCreate(role: UserRole): boolean {
    const permissions = this.getUserPermissions(role);
    return permissions.canCreate;
  }

  /**
   * Kiểm tra user có quyền cập nhật không
   */
  static canUpdate(role: UserRole): boolean {
    const permissions = this.getUserPermissions(role);
    return permissions.canUpdate;
  }

  /**
   * Kiểm tra user có quyền xóa không
   */
  static canDelete(role: UserRole): boolean {
    const permissions = this.getUserPermissions(role);
    return permissions.canDelete;
  }

  /**
   * Kiểm tra user có quyền quản lý user khác không
   */
  static canManageUsers(role: UserRole): boolean {
    const permissions = this.getUserPermissions(role);
    return permissions.canManageUsers;
  }

  /**
   * Kiểm tra user có quyền thực hiện action không
   */
  static canPerformAction(role: UserRole, action: 'read' | 'create' | 'update' | 'delete'): boolean {
    const permissions = this.getUserPermissions(role);
    switch (action) {
      case 'read':
        return permissions.canRead;
      case 'create':
        return permissions.canCreate;
      case 'update':
        return permissions.canUpdate;
      case 'delete':
        return permissions.canDelete;
      default:
        return false;
    }
  }
} 