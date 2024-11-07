import { StatusCodes } from "http-status-codes";
import axios, { AxiosError, AxiosResponseHeaders } from "axios";
import UserModel from "../../../entities/user/model";
import ApplicationResponse from "../../../helpers/application_response/types";
import EnvironmentVariables from "../../../helpers/environment/variables";

class LoginService {

  private _status: StatusCodes | null;
  private _payload: UserModel | null;
  private _errorMessage: string | null;
  private _headers: AxiosResponseHeaders | null;
  private _token: string | null;
  private email: string;
  private password: string;

  constructor(data: { email: string; password: string; }) {
    this.email = data.email;
    this.password = data.password;
    this._status = null;
    this._errorMessage = null;
    this._headers = null;
    this._token = null;
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

  get headers(): any {
    return this._headers;
  }

  get token(): string | null {
    return this._token;
  }

  public async perform() {
    try {
      const response = await axios.post<ApplicationResponse<{user: UserModel }>>(`${EnvironmentVariables.API_BASE_ROUTE}/login`, {
        user: { email: this.email, password: this.password }
      }, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }
      });
      this._status = response.status;
      this._payload = response.data.data?.user || null;
      this._errorMessage = Array.isArray(response.data.errors) ? response.data.errors.join(" ") : response.data.errors;
      this._headers = response.headers as AxiosResponseHeaders;
      this._token = response.headers.authorization.split(' ')[1]
    } catch(error: any) {
      const axiosError = error as AxiosError;
      this._status = StatusCodes[axiosError.response?.status as unknown as keyof typeof StatusCodes] || StatusCodes.INTERNAL_SERVER_ERROR;
      this._errorMessage = error.response.data.error
    }
  }
}

export default LoginService;
