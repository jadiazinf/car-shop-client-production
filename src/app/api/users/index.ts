import { createGeneralUser } from "./create_general_user";
import { getAllUserVehicles } from "./get_all_vehicles";
import getNewToken from "./get_new_token";
import { getUserCompanies } from "./get_user_companies";
import getUsersByFilters from "./get_users_by_filters";
import { updateGeneralUser } from "./update";
import { getUserVehicles } from "./vehicles";

export const useUsersApiServices = {
  getUsersByFilters,
  getNewToken,
  createGeneralUser,
  getUserVehicles,
  updateGeneralUser,
  getAllUserVehicles,
  getUserCompanies
};
