import { UserCompanyRole } from "./types";

export const UserCompanyHelpers = {
  translateUserCompanyRole: (role?: UserCompanyRole) => {
    switch (role) {
      case UserCompanyRole.ADMIN:
        return "Administrador";
      case UserCompanyRole.GENERAL:
        return "General";
      case UserCompanyRole.SUPERADMIN:
        return "Superadministrador";
      case UserCompanyRole.TECHNICIAN:
        return "Técnico";
      default:
        return "Sin rol";
    }
  },
};
