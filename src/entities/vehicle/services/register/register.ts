import { StatusCodes } from "http-status-codes";
import axios, { AxiosError, AxiosResponseHeaders } from "axios";
import ApplicationResponse from "../../../../helpers/application_response/types";
import EnvironmentVariables from "../../../../helpers/environment/variables";
import VehicleModel from "../../model";

class RegisterVehicleService {

  private _status: StatusCodes | null;
  private _payload: VehicleModel | null;
  private _errorMessage: string | null;
  private _token: string | null;
  private _vehicle: VehicleModel;
  private _headers: AxiosResponseHeaders | null;

  constructor(data: { vehicle: VehicleModel, token: string }) {
    this._vehicle = data.vehicle;
    this._token = data.token;
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
      const response = await axios.post<ApplicationResponse<VehicleModel>>(`${EnvironmentVariables.API_BASE_ROUTE}/api/${EnvironmentVariables.API_VERSION}/vehicles`, {
        vehicle: this._vehicle
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
      this._errorMessage = Array.isArray(response.data.errors) ? response.data.errors.join(" ") : response.data.errors;
    } catch(error: any) {
      const axiosError = error as AxiosError;
      this._status = StatusCodes[axiosError.response?.status as unknown as keyof typeof StatusCodes] || StatusCodes.INTERNAL_SERVER_ERROR;
      this._errorMessage = error.response.data.errors
    }
  }
}

export default RegisterVehicleService;
