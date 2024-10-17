import { StatusCodes } from "http-status-codes";
import axios, { AxiosError, AxiosResponseHeaders } from "axios";
import UserModel from "../../model";
import ApplicationResponse from "../../../../helpers/application_response/types";
import EnvironmentVariables from "../../../../helpers/environment/variables";

class RegisterUserService {

  private _status: StatusCodes | null;
  private _payload: UserModel | null;
  private _errorMessage: string | null;
  private _token: string | null;
  private _user: UserModel;
  private _headers: AxiosResponseHeaders | null;

  constructor(data: { user: UserModel }) {
    this._user = data.user;
    this._token = null;
    this._status = null;
    this._errorMessage = null;
    this._payload = null;
    this._headers = null;
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

  get token(): string | null {
    return this._token;
  }

  get headers(): AxiosResponseHeaders | null {
    return this._headers
  }

  public async perform() {
    try {
      const response = await axios.post<ApplicationResponse<UserModel>>(`${EnvironmentVariables.API_BASE_ROUTE}/signup`, {
        user: this._user
      }, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Authorization': `Bearer ${this._token}`
        }
      });

      this._status = response.status;
      this._payload = response.data.data || null;
      this._headers = response.headers as AxiosResponseHeaders;
      this._token = response.headers.authorization.split(' ')[1]
      this._errorMessage = Array.isArray(response.data.errors) ? response.data.errors.join(" ") : response.data.errors;
    } catch(error: any) {
      const axiosError = error as AxiosError;
      this._status = StatusCodes[axiosError.response?.status as unknown as keyof typeof StatusCodes] || StatusCodes.INTERNAL_SERVER_ERROR;
      this._errorMessage = error.response.data.errors
    }
  }
}

export default RegisterUserService;
