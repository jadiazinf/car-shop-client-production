import { AuthStatus } from "../../auth/types";
import UserModel from "../../entities/user/model";
import { UserCompanyRole } from "../../entities/users_companies/types";

export type UserCompanySession = {
  user: UserModel;
  roles: UserCompanyRole[] | null;
  company_id: number | null;
  user_company_id: number | null;
};

export type AuthReducer = {
  status: AuthStatus;
  token: string | null;
  sessionType: UserCompanySession | null;
};
