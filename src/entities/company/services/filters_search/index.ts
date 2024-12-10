import { StatusCodes } from "http-status-codes";
import axios, { AxiosError } from "axios";
import EnvironmentVariables from "../../../../helpers/environment/variables";
import CompanyModel from "../../model";
import { PaginatedData } from "../../../../helpers/application_response/types";
import { ServicesFilters } from "../../components/filters/types";

class CompaniesFilterSearchService {
  private _status: StatusCodes | null;
  private _payload: CompanyModel[] | PaginatedData<CompanyModel> | null;
  private _errorMessage: string | null;

  constructor() {
    this._status = null;
    this._errorMessage = null;
    this._payload = null;
  }

  get status(): StatusCodes {
    return this._status as StatusCodes;
  }

  get payload(): any {
    return this._payload;
  }

  get errorMessage(): string | null {
    return this._errorMessage;
  }

  public async perform(props: { filters: ServicesFilters; page: number }) {
    try {
      const response = await axios.get<PaginatedData<CompanyModel>>(
        `${EnvironmentVariables.API_BASE_ROUTE}/api/${
          EnvironmentVariables.API_VERSION
        }/companies/search_companies_with_filters?page=${props.page}${
          props.filters.category_ids
            ? `&category_ids=${props.filters.category_ids?.join(",")}`
            : ""
        }${
          props.filters.location_id
            ? `&location_id=${props.filters.location_id}`
            : ""
        }${
          props.filters.company_name
            ? `&company_name=${props.filters.company_name}`
            : ""
        }${
          props.filters.service_name
            ? `&service_name=${props.filters.service_name}`
            : ""
        }`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      this._status = response.status;
      this._payload = response.data || null;
      this._errorMessage =
        response.status === StatusCodes.OK
          ? null
          : response.status === StatusCodes.NOT_FOUND
          ? "Compañía no encontrada"
          : "Error al buscar la compañía";
    } catch (error: any) {
      const axiosError = error as AxiosError;
      this._status =
        StatusCodes[
          axiosError.response?.status as unknown as keyof typeof StatusCodes
        ] || StatusCodes.INTERNAL_SERVER_ERROR;
      this._errorMessage = error.response.data.errors;
    }
  }
}

export default CompaniesFilterSearchService;
