import { UserCompanyRole } from "./types";

function translateUserCompanyRole(role?: UserCompanyRole) {
  switch (role) {
    case UserCompanyRole.ADMIN:
      return "Administrador";
    case UserCompanyRole.GENERAL:
      return "General";
    case UserCompanyRole.SUPERADMIN:
      return "Superadministrador";
    case UserCompanyRole.TECHNICIAN:
      return "Técnico";
    case UserCompanyRole.SUPERVISOR:
      return "Supervisor";
    default:
      return "Sin rol";
  }
}

function getRoleWithGreaterHierarchy(role: UserCompanyRole[]): UserCompanyRole {
  if (role.includes(UserCompanyRole.SUPERADMIN))
    return UserCompanyRole.SUPERADMIN;
  if (role.includes(UserCompanyRole.ADMIN)) return UserCompanyRole.ADMIN;
  if (role.includes(UserCompanyRole.SUPERVISOR))
    return UserCompanyRole.SUPERVISOR;
  if (role.includes(UserCompanyRole.TECHNICIAN))
    return UserCompanyRole.TECHNICIAN;
  return UserCompanyRole.GENERAL;
}

function getRolesValues(): string[] {
  return Object.values(UserCompanyRole);
}

function getRolesKeysValuesForSelect(): { label: string; value: string }[] {
  return Object.values(UserCompanyRole).map((role) => ({
    label: translateUserCompanyRole(role),
    value: role,
  }));
}

function getCompanyRolesKeysValuesForSelect(): {
  label: string;
  value: string;
}[] {
  return [
    UserCompanyRole.ADMIN,
    UserCompanyRole.SUPERVISOR,
    UserCompanyRole.TECHNICIAN,
  ].map((role) => ({
    label: translateUserCompanyRole(role),
    value: role,
  }));
}

export const UserCompanyHelpers = {
  translateUserCompanyRole,
  getRoleWithGreaterHierarchy,
  getRolesValues,
  getRolesKeysValuesForSelect,
  getCompanyRolesKeysValuesForSelect,
};
