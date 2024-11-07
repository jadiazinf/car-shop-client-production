import { StatusCodes } from "http-status-codes";
import axios, { AxiosError } from "axios";
import EnvironmentVariables from "../../../../helpers/environment/variables";
import ServiceModel from "../../model";
import { Decimal } from 'decimal.js';

class GetServiceService {

  private _status: StatusCodes | null;
  private _payload: ServiceModel | null;
  private _errorMessage: string | null;
  private _service_id: number;

  constructor(data: {service_id: number}) {
    this._service_id = data.service_id;
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
      const response = await axios.get<ServiceModel>(`${EnvironmentVariables.API_BASE_ROUTE}/api/${EnvironmentVariables.API_VERSION}/services/${this._service_id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }
      });

      this._status = response.status;
      this._payload = response.data ? {...response.data, price: new Decimal(response.data.price)} : null;
      this._errorMessage = response.status === StatusCodes.OK ? null : response.status === StatusCodes.NOT_FOUND ? "Servicio no encontrado" : "Error al buscar el servicio"
    } catch(error: any) {
      const axiosError = error as AxiosError;
      this._status = StatusCodes[axiosError.response?.status as unknown as keyof typeof StatusCodes] || StatusCodes.INTERNAL_SERVER_ERROR;
      this._errorMessage = error.response.data.errors
    }
  }
}

export default GetServiceService;
