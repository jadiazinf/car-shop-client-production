import { StatusCodes } from "http-status-codes";
import axios, { AxiosError } from "axios";
import UserCompanyRequestModel from "../../../model";
import { PaginatedData } from "../../../../../helpers/application_response/types";
import { UserCompanyRequestStatus } from "../../../types";
import EnvironmentVariables from "../../../../../helpers/environment/variables";

class GetUserCompanyRequestsByCompanyService {

  private _status: StatusCodes | null;
  private _payload: PaginatedData<UserCompanyRequestModel> | null;
  private _errorMessage: string | null;
  private _company_id: number;
  private _token: string;

  constructor(data: {company_id: number; token: string;}) {
    this._status = null;
    this._errorMessage = null;
    this._payload = null;
    this._company_id = data.company_id;
    this._token = data.token;
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

  public async perform(data: {page_number: number; status: UserCompanyRequestStatus;}) {
    try {
      const response = await axios.get<PaginatedData<UserCompanyRequestModel>>(`${EnvironmentVariables.API_BASE_ROUTE}/api/${EnvironmentVariables.API_VERSION}/users_companies_requests/show_by_company_id?id=${this._company_id}page=${data.page_number}&status=${data.status}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this._token}`,
          Accept: 'application/json'
        }
      });

      this._status = response.status;
      this._payload = response.data || null;
      this._errorMessage = response.status === StatusCodes.OK ? null : response.status === StatusCodes.NOT_FOUND ? "Sin peticiones que mostrar" : "Error al buscar la peticiones"
    } catch(error: any) {
      const axiosError = error as AxiosError;
      this._status = StatusCodes[axiosError.response?.status as unknown as keyof typeof StatusCodes] || StatusCodes.INTERNAL_SERVER_ERROR;
      this._errorMessage = error.response.data.errors
    }
  }
}

export default GetUserCompanyRequestsByCompanyService;
