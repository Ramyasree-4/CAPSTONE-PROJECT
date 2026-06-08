from enum import StrEnum


class Role(StrEnum):
    SUPER_ADMIN = "Super Admin"
    ADMIN = "Admin"
    USER = "User"
    VIEWER = "Viewer"


class Permission(StrEnum):
    DOCUMENT_UPLOAD = "document:upload"
    DOCUMENT_DELETE = "document:delete"
    USER_MANAGEMENT = "user:manage"
    ANALYTICS_ACCESS = "analytics:access"
    EVALUATION_ACCESS = "evaluation:access"


ROLE_PERMISSIONS: dict[Role, set[Permission]] = {
    Role.SUPER_ADMIN: set(Permission),
    Role.ADMIN: {
        Permission.DOCUMENT_UPLOAD,
        Permission.DOCUMENT_DELETE,
        Permission.USER_MANAGEMENT,
        Permission.ANALYTICS_ACCESS,
        Permission.EVALUATION_ACCESS,
    },
    Role.USER: {Permission.DOCUMENT_UPLOAD},
    Role.VIEWER: set(),
}


def has_permission(role: str, permission: Permission) -> bool:
    try:
        return permission in ROLE_PERMISSIONS[Role(role)]
    except ValueError:
        return False

