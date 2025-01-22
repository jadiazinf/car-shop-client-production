import CategoryModel from "../category/model";
import CompanyModel from "../company/model";

type ServiceModel = {
  id?: number;
  name: string;
  description: string;
  price_for_motorbike: string | number | null;
  price_for_car: string | number | null;
  price_for_van: string | number | null;
  price_for_truck: string | number | null;
  company_id?: number;
  company?: CompanyModel;
  category_id?: number;
  category?: CategoryModel;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export default ServiceModel;
