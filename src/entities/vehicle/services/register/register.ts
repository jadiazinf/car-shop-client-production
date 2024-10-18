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
      const formData = this.transformToFormData();
      const response = await axios.post<ApplicationResponse<VehicleModel>>(`${EnvironmentVariables.API_BASE_ROUTE}/api/${EnvironmentVariables.API_VERSION}/vehicles`, {
        formData
      }, {
        headers: {
          Accept: 'application/json',
          'Authorization': `Bearer ${this._token}`
        }
      });

      this._status = response.status;
      this._payload = response.data.data || null;
      this._headers = response.headers as AxiosResponseHeaders;
      this._errorMessage = Array.isArray(response.data.errors) ? response.data.errors[0] : response.data.errors;
    } catch(error: any) {
      const axiosError = error as AxiosError;
      this._status = StatusCodes[axiosError.response?.status as unknown as keyof typeof StatusCodes] || StatusCodes.INTERNAL_SERVER_ERROR;
      this._errorMessage = Array.isArray(error.response.data.errors) ? error.response.data.errors[0] : error.response.data.errors;
    }
  }

  private transformToFormData() {
    const formData = new FormData();

    if (this._vehicle.vehicle_images)
      this._vehicle.vehicle_images.forEach((file) => {
        formData.append(`vehicle_images[]`, file);
      });

    if (this._vehicle.axles)
      formData.append('axles', this._vehicle.axles.toString());

    if (this._vehicle.model_id)
      formData.append('model_id', this._vehicle.model_id.toString());

    if (this._vehicle.color)
      formData.append('color', this._vehicle.color);

    if (this._vehicle.license_plate)
      formData.append('license_plate', this._vehicle.license_plate);

    if (this._vehicle.year)
      formData.append('email', this._vehicle.year.toString());

    if (this._vehicle.tires)
      formData.append('location_id', this._vehicle.tires.toString());

    if (this._vehicle.vehicle_type)
      formData.append('vehicle_type', this._vehicle.vehicle_type);

    if (this._vehicle.load_capacity)
      formData.append('load_capacity', this._vehicle.load_capacity.toString());

    if (this._vehicle.engine_serial)
      formData.append('engine_serial', this._vehicle.engine_serial);

    if (this._vehicle.body_serial)
      formData.append('body_serial', this._vehicle.body_serial);

    if (this._vehicle.engine_type)
      formData.append('engine_type', this._vehicle.engine_type);

    if (this._vehicle.transmission)
      formData.append('transmission', this._vehicle.transmission);

    return formData;
  }
}

export default RegisterVehicleService;
