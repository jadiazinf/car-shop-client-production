import LocationModel from "../location/model";
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
  company_charter?: File | string;
  company_images?: File[] | string[];
  profile_image_url?: string;
  users?: UserModel[];
  location?: LocationModel;
  location_id?: number;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
};

export default CompanyModel;
