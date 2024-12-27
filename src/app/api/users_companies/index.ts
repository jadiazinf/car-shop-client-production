import { createUserCompany } from "./create";
import { isUserRegisteredOnCompany } from "./is_user_registered_on_company";
import { toggleActive } from "./toggle_active";
import { updateUserCompany } from "./update";

export const useUsersCompaniesApiServices = {
  isUserRegisteredOnCompany,
  createUserCompany,
  toggleActive,
  updateUserCompany,
};
