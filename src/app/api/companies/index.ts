import { createCompany } from "./create";
import { getCompany } from "./get";
import { getEmployees } from "./get_employees";
import { getEmployeesByRole } from "./get_employees_by_role";
import { getCompanyServices } from "./get_services";
import { getCompanyServicesByVehicleType } from "./get_services_by_vehicle_type";

export const useCompanyApiServices = {
  createCompany,
  getCompany,
  getCompanyServices,
  getCompanyServicesByVehicleType,
  getEmployeesByRole,
  getEmployees,
};
