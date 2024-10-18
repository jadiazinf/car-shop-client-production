import UserModel from "../user/model";
import { CompanyRequestStatus } from "./types";

type CompanyRequestModel = {
  id?: number;
  status: CompanyRequestStatus;
  message: string | null;
  responder_user_id?: number | null;
  responder_user?: UserModel;
  created_at?: string;
  updated_at?: string;
};

export default CompanyRequestModel;
