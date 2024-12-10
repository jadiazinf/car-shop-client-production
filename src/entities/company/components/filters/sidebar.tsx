import { IServicesFilterProps } from "./interfaces";
import CompaniesFiltersComponents from ".";

function CompaniesFilterSidebarComponent(props: IServicesFilterProps) {
  return (
    <div className="w-52">
      <CompaniesFiltersComponents
        filtersState={props.filtersState}
        setFiltersChange={props.setFiltersChange}
      />
    </div>
  );
}

export default CompaniesFilterSidebarComponent;
