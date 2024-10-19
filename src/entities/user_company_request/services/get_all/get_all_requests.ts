import { StatusCodes } from "http-status-codes";
import axios, { AxiosError } from "axios";
import EnvironmentVariables from "../../../../helpers/environment/variables";
import UserCompanyRequestModel from "../../model";
import { UserCompanyRequestStatus } from "../../types";
import { PaginatedData } from '../../../../helpers/application_response/types';

class GetAllCompaniesRequestsService {

  private _status: StatusCodes | null;
  private _payload: PaginatedData<UserCompanyRequestModel> | null;
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

  public async perform(data: {page_number: number; status: UserCompanyRequestStatus}) {
    try {
      const response = await axios.get<PaginatedData<UserCompanyRequestModel>>(`${EnvironmentVariables.API_BASE_ROUTE}/api/${EnvironmentVariables.API_VERSION}/users_companies_requests/?page=${data.page_number}&status=${data.status}`,
      {
        headers: {
          'Content-Type': 'application/json',
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

export default GetAllCompaniesRequestsService;
