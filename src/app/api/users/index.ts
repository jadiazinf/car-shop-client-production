import { createGeneralUser } from "./create_general_user";
import getNewToken from "./get_new_token";
import getUsersByFilters from "./get_users_by_filters";
import { updateGeneralUser } from "./update";
import getUserVehicles from "./vehicles";

export const useUsersApiServices = {
  getUsersByFilters,
  getNewToken,
  createGeneralUser,
  getUserVehicles,
  updateGeneralUser,
};
