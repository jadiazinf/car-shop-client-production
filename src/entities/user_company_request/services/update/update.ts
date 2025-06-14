import { StatusCodes } from "http-status-codes";
import axios, { AxiosError } from "axios";
import EnvironmentVariables from "../../../../helpers/environment/variables";
import { UserCompanyRequestStatus } from "../../types";

export type UpdateRequestResponse = { message: string };

export type UpdateUserCompanyRequest = {
  status: UserCompanyRequestStatus;
  responder_user_id: number;
  message: string | null;
};

class UpdateUserCompanyRequestService {
  private _status: StatusCodes | null;
  private _payload: UpdateRequestResponse | string[] | null;
  private _errorMessage: string | null;
  private _request: UpdateUserCompanyRequest;
  private _user_company_request_id: number;
  private _company_id: number;
  private _token: string;

  constructor(data: {
    request: any;
    user_company_request_id: number;
    company_id: number;
    token: string;
  }) {
    this._request = data.request;
    this._user_company_request_id = data.user_company_request_id;
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
      const response = await axios.patch<UpdateRequestResponse | string[]>(
        `${EnvironmentVariables.API_BASE_ROUTE}/api/${EnvironmentVariables.API_VERSION}/users_companies_requests/${this._user_company_request_id}`,
        {
          user_company_request: {
            ...this._request,
            company_id: this._company_id,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Authorization": `Bearer ${this._token}`
          },
        }
      );

      this._status = response.status;
      this._payload = response.data || null;
      // this._errorMessage = (response.data as string[]) || null;
    } catch (error: any) {
      console.log("el error", error);
      const axiosError = error as AxiosError;
      this._status =
        StatusCodes[
          axiosError.response?.status as unknown as keyof typeof StatusCodes
        ] || StatusCodes.INTERNAL_SERVER_ERROR;
      this._errorMessage = error.response.data[0];
    }
  }
}

export default UpdateUserCompanyRequestService;
