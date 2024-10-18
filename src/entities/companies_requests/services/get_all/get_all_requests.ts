import { StatusCodes } from "http-status-codes";
import axios, { AxiosError } from "axios";
import EnvironmentVariables from "../../../../helpers/environment/variables";
import CompanyRequestModel from "../../model";

class GetAllCompaniesRequestsService {

  private _status: StatusCodes | null;
  private _payload: CompanyRequestModel[] | null;
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

  public async perform() {
    try {
      const response = await axios.get<CompanyRequestModel[]>(`${EnvironmentVariables.API_BASE_ROUTE}/api/${EnvironmentVariables.API_VERSION}/users_companies_requests`,
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
