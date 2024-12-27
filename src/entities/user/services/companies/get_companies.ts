import { StatusCodes } from "http-status-codes";
import axios, { AxiosError } from "axios";
import EnvironmentVariables from "../../../../helpers/environment/variables";
import { UserCompanyModel } from "../../../users_companies/model";

class GetUserCompanies {

  private _status: StatusCodes | null;
  private _payload: UserCompanyModel[] | null;
  private _errorMessage: string | null;
  private _token: string | null;
  private _user_id: number;

  constructor(data: { user_id: number, token: string; }) {
    this._user_id = data.user_id;
    this._token = data.token;
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

  get token(): string | null {
    return this._token;
  }

  public async perform() {
    try {
      const response = await axios.get<UserCompanyModel[]>(`${EnvironmentVariables.API_BASE_ROUTE}/api/${EnvironmentVariables.API_VERSION}/users/${this._user_id}/user_companies`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Authorization': `Bearer ${this._token}`
        }
      });

      this._status = response.status;
      this._payload = response.data || null;
      this._errorMessage = Array.isArray(response.data) ? response.data.join(" ") : response.data;
    } catch(error: any) {
      const axiosError = error as AxiosError;
      this._status = StatusCodes[axiosError.response?.status as unknown as keyof typeof StatusCodes] || StatusCodes.INTERNAL_SERVER_ERROR;
      this._errorMessage = error.response.data.errors
    }
  }
}

export default GetUserCompanies;
