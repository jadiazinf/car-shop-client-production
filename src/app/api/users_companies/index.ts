import { createUserCompany } from "./create";
import { getUserCompanyByUserAndCompany } from "./get_user_company_by_user_and_company";
import { isUserRegisteredOnCompany } from "./is_user_registered_on_company";
import { toggleActive } from "./toggle_active";
import { updateUserCompany } from "./update";

export const useUsersCompaniesApiServices = {
  isUserRegisteredOnCompany,
  createUserCompany,
  toggleActive,
  updateUserCompany,
  getUserCompanyByUserAndCompany,
};
