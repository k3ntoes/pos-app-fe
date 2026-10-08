export function normalizePermission(permission: string): string {
  if (!permission) return "";
  return permission;
}

export function sanitizePermissions(permissions: string[], validPermissions?: string[]): string[] {
  const unique = Array.from(new Set(permissions.filter(Boolean)));

  if (!validPermissions || validPermissions.length === 0) {
    return unique;
  }

  const validSet = new Set(validPermissions);
  return unique.filter((p) => validSet.has(p));
}
