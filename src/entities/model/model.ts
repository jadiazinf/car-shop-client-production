import BrandModel from "../brand/model";

type ModelModel = {
  id?: number;
  name: string;
  brand?: BrandModel;
  brand_id?: number;
}

export default ModelModel;
