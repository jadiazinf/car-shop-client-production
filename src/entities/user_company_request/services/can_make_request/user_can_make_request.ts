import { StatusCodes } from "http-status-codes";
import axios, { AxiosError } from "axios";
import EnvironmentVariables from "../../../../helpers/environment/variables";

export type CanUserMakeRequestResponse = {
  can_make_request: boolean;
}

class CanUserMakeRequestService {

  private _status: StatusCodes | null;
  private _payload: boolean | null;
  private _errorMessage: string | null;
  private _user_id: number;
  private _token: string;
  private _company_id: number;

  constructor(data: {company_id: number, user_id: number, token: string}) {
    this._user_id = data.user_id;
    this._company_id = data.company_id;
    this._status = null;
    this._errorMessage = null;
    this._payload = null;
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

  public async perform() {
    try {
      const response = await axios.get<CanUserMakeRequestResponse>(`${EnvironmentVariables.API_BASE_ROUTE}/api/${EnvironmentVariables.API_VERSION}/users_companies_requests/can_user_make_a_request?company_id=${this._company_id}&user_id=${this._user_id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Authorization': `Bearer ${this._token}`
        }
      });

      this._status = response.status;
      this._payload = response.data?.can_make_request || null;
      this._errorMessage = response.status === StatusCodes.OK ? null : response.status === StatusCodes.NOT_FOUND ? "Permiso no encontrado" : "Error al buscar el permiso"
    } catch(error: any) {
      const axiosError = error as AxiosError;
      this._status = StatusCodes[axiosError.response?.status as unknown as keyof typeof StatusCodes] || StatusCodes.INTERNAL_SERVER_ERROR;
      this._errorMessage = error.response.data.errors
    }
  }
}

export default CanUserMakeRequestService;
