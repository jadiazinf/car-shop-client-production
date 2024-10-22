import { StatusCodes } from "http-status-codes";
import axios, { AxiosError } from "axios";
import EnvironmentVariables from "../../../../helpers/environment/variables";
import UserCompanyRequestModel from '../../model';
import CompanyModel from "../../model";

class GetCompanyService {

  private _status: StatusCodes | null;
  private _payload: CompanyModel | null;
  private _errorMessage: string | null;
  private _company_id: number;
  private _token: string;

  constructor(data: {company_id: number, token: string}) {
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

  public async perform() {
    try {
      const response = await axios.get<UserCompanyRequestModel>(`${EnvironmentVariables.API_BASE_ROUTE}/api/${EnvironmentVariables.API_VERSION}/companies/${this._company_id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Authorization': `Bearer ${this._token}`
        }
      });

      this._status = response.status;
      this._payload = response.data || null;
      this._errorMessage = response.status === StatusCodes.OK ? null : response.status === StatusCodes.NOT_FOUND ? "Compañía no encontrada" : "Error al buscar la compañía"
    } catch(error: any) {
      const axiosError = error as AxiosError;
      this._status = StatusCodes[axiosError.response?.status as unknown as keyof typeof StatusCodes] || StatusCodes.INTERNAL_SERVER_ERROR;
      this._errorMessage = error.response.data.errors
    }
  }
}

export default GetCompanyService;
