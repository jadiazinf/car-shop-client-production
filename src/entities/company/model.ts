import UserModel from "../user/model";

type CompanyModel = {
  id?: number;
  name: string;
  dni: string;
  email: string;
  number_of_employees?: number;
  payment_methods?: string[];
  social_networks?: string[];
  phone_numbers?: string[];
  address: string;
  company_charter?: Blob | File;
  company_images?: Blob[] | File[];
  users?: UserModel[];
}

export default CompanyModel;
