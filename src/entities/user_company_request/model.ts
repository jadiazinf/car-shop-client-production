import UserModel from "../user/model";
import { UserCompanyRequestStatus } from "./types";
import { UserCompanyModel } from '../users_companies/model';
import CompanyModel from "../company/model";

type UserCompanyRequestModel = {
  id?: number;
  status: UserCompanyRequestStatus;
  message?: string | null;
  user_company_id?: number;
  user_company?: UserCompanyModel;
  user?: UserModel;
  company?: CompanyModel;
  company_id?: number;
  responder_user_id?: number;
  responder_user?: UserModel;
  created_at?: string;
  updated_at?: string;
};

export default UserCompanyRequestModel;
