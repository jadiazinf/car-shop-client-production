import CategoryModel from "../category/model";
import CompanyModel from "../company/model";
import { Decimal } from 'decimal.js';

type ServiceModel = {
  id?: number;
  name: string;
  description: string;
  price: number | Decimal;
  company_id?: number;
  company?: CompanyModel;
  category_id?: number;
  category?: CategoryModel;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export default ServiceModel;
