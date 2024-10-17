import CompanyModel from "../company/model";
import LocationModel from "../location/model";
import { Gender } from "./types";

type UserModel = {
  id?: number;
  first_name: string;
  last_name: string;
  dni: string;
  gender: Gender;
  email: string;
  password?: string;
  password_confirmation?: string;
  birthdate: string | Date;
  address: string;
  phone_number: string;
  is_active?: boolean;
  companies?: CompanyModel[];
  location?: LocationModel;
  location_id?: number;
}

export default UserModel;
