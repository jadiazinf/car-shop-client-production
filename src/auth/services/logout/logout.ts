import { StatusCodes } from "http-status-codes";
import axios, { AxiosError } from "axios";
import EnvironmentVariables from "../../../helpers/environment/variables";

class LogoutService {

  private _status: StatusCodes | null;
  private _errorMessage: string | null;
  private _token: string | null;

  constructor(data: { token: string }) {
    this._status = null;
    this._errorMessage = null;
    this._token = data.token;
  }

  get status(): StatusCodes {
    return this._status as StatusCodes;
  }

  get errorMessage(): string | null {
    return this._errorMessage;
  }

  get token(): string | null {
    return this._token;
  }

  public async perform() {
    try {
      const response = await axios.delete(`${EnvironmentVariables.API_BASE_ROUTE}/logout`, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Authorization': `Bearer ${this._token}`
        }
      });
      this._status = response.status;
      this._errorMessage = Array.isArray(response.data.errors) ? response.data.errors.join(" ") : response.data.errors;
    } catch(error: any) {
      const axiosError = error as AxiosError;
      this._status = StatusCodes[axiosError.response?.status as unknown as keyof typeof StatusCodes] || StatusCodes.INTERNAL_SERVER_ERROR;
      this._errorMessage = error.response.data.errors
    }
  }
}

export default LogoutService;
