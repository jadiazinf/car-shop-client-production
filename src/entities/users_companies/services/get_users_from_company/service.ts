import { StatusCodes } from "http-status-codes";
import axios, { AxiosError } from "axios";
import { UserCompanyModel } from "../../model";
import EnvironmentVariables from "../../../../helpers/environment/variables";
import { PaginatedData } from "../../../../helpers/application_response/types";

class GetUsersFromCompany {
  private _status: StatusCodes | null;
  private _payload: PaginatedData<UserCompanyModel> | null;
  private _errorMessage: string | null;
  private _token: string;
  private _company_id: number;

  constructor(data: { company_id: number; token: string }) {
    this._company_id = data.company_id;
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

  public async perform(data: {
    page_number: number;
    name?: string;
  }): Promise<void> {
    try {
      const response = await axios.get<PaginatedData<UserCompanyModel>>(
        `${EnvironmentVariables.API_BASE_ROUTE}/api/${
          EnvironmentVariables.API_VERSION
        }/users_companies/company_users?company_id=${this._company_id}&page=${
          data.page_number
        }${data.name ? `&name=${data.name}` : ""}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${this._token}`,
          },
        }
      );

      this._status = response.status;
      this._payload = response.data || null;
      this._errorMessage =
        response.status !== StatusCodes.OK
          ? "Error al obtener los usuarios de la empresa"
          : null;
    } catch (error: any) {
      const axiosError = error as AxiosError;
      this._status =
        StatusCodes[
          axiosError.response?.status as unknown as keyof typeof StatusCodes
        ] || StatusCodes.INTERNAL_SERVER_ERROR;
      this._errorMessage = error.response.data.errors;
    }
  }
}

export default GetUsersFromCompany;
