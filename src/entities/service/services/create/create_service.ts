import { StatusCodes } from "http-status-codes";
import axios, { AxiosError } from "axios";
import EnvironmentVariables from "../../../../helpers/environment/variables";
import ServiceModel from "../../model";

class CreateServiceService {

  private _status: StatusCodes | null;
  private _payload: ServiceModel | {message: string} | null;
  private _errorMessage: string | null;
  private _service: ServiceModel;
  private _token: string;
  private _company_id: number;

  constructor(data: {service: ServiceModel, token: string, company_id: number}) {
    this._service = data.service;
    this._status = null;
    this._errorMessage = null;
    this._payload = null;
    this._token = data.token
    this._company_id = data.company_id
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
      const response = await axios.post<ServiceModel | { message: string }>(`${EnvironmentVariables.API_BASE_ROUTE}/api/${EnvironmentVariables.API_VERSION}/services?company_id=${this._company_id}`,
        {
          service: {
            ...this._service,
            company_id: this._company_id
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Authorization': `Bearer ${this._token}`
          }
        }
      );

      this._status = response.status;
      this._payload = response.data || null;
      this._errorMessage = response.status === StatusCodes.OK ? null : (response.data as {message: string}).message
    } catch(error: any) {
      const axiosError = error as AxiosError;
      this._status = StatusCodes[axiosError.response?.status as unknown as keyof typeof StatusCodes] || StatusCodes.INTERNAL_SERVER_ERROR;
      this._errorMessage = error.response.data.errors
    }
  }
}

export default CreateServiceService;
