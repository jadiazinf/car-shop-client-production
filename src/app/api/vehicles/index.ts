import { attachImages } from "./attach_images";
import { createVehicle } from "./create";
import { getVehicle } from "./get";
import { toggleActiveVehicle } from "./toggle_active";
import { updateVehicle } from "./update";

export const useVehicleApiServices = {
  createVehicle,
  attachImages,
  getVehicle,
  updateVehicle,
  toggleActiveVehicle,
};
