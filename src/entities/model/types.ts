import BrandModel from "../brand/model";
import ModelModel from "./model";

export type BrandAndModel = {
  brand: BrandModel | null;
  model: ModelModel | null;
}
