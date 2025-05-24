import { Color } from "../../consts/colors";
import ModelModel from "../model/model";
import UserModel from "../user/model";
import { EngineType, VehicleTransmission, VehicleType } from "./types";

type VehicleModel = {
  id?: number;
  color: Color;
  license_plate: string;
  year: number;
  axles: number;
  tires: number;
  transmission: VehicleTransmission;
  vehicle_type: VehicleType;
  load_capacity?: string;
  engine_serial?: string;
  body_serial?: string;
  engine_type?: EngineType;
  is_active?: boolean;
  vehicle_images?: string[] | File[];
  model?: ModelModel;
  model_id?: number;
  user?: UserModel;
  user_id?: number;
};

export default VehicleModel;
