import CompanyModel from "../company/model";
import UserModel from "../user/model";
import { UserCompanyRole } from "./types";

export type UserCompanyModel = {
  id?: number;
  roles: UserCompanyRole[];
  user_id: number;
  user?: UserModel;
  company_id: number;
  company?: CompanyModel;
  is_active: boolean;
};
