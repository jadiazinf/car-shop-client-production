import { ServicesFilters } from "./types";

export interface IServicesFilterProps {
  filtersState: ServicesFilters;
  setFiltersChange: React.Dispatch<ServicesFilters>;
}
