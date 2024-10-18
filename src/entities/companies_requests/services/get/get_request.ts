import { StatusCodes } from "http-status-codes";
import axios, { AxiosError } from "axios";
import EnvironmentVariables from "../../../../helpers/environment/variables";
import CompaniesRequestsModel from "../../model";

class GetCompanyRequestService {

  private _status: StatusCodes | null;
  private _payload: CompaniesRequestsModel | null;
  private _errorMessage: string | null;
  private _request_id: number;

  constructor(data: {request_id: number}) {
    this._request_id = data.request_id;
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
      const response = await axios.get<CompaniesRequestsModel>(`${EnvironmentVariables.API_BASE_ROUTE}/api/${EnvironmentVariables.API_VERSION}/users_companies_requests/${this._request_id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      });

      this._status = response.status;
      this._payload = response.data || null;
      this._errorMessage = response.status === StatusCodes.OK ? null : response.status === StatusCodes.NOT_FOUND ? "Petición no encontrada" : "Error al buscar la peticion"
    } catch(error: any) {
      const axiosError = error as AxiosError;
      this._status = StatusCodes[axiosError.response?.status as unknown as keyof typeof StatusCodes] || StatusCodes.INTERNAL_SERVER_ERROR;
      this._errorMessage = error.response.data.errors
    }
  }
}

export default GetCompanyRequestService;
