import { StatusCodes } from "http-status-codes";
import axios, { AxiosError } from "axios";
import LocationModel from "../../model";
import EnvironmentVariables from "../../../../helpers/environment/variables";
import ApplicationResponse from '../../../../helpers/application_response/types';
import { LocationType } from "../../types";

class GetLocationsByTypeService {

  private _status: StatusCodes | null;
  private _payload: LocationModel[] | null;
  private _errorMessage: string | null;
  private _location_type: LocationType;

  constructor(data: { location_type: LocationType }) {
    this._location_type = data.location_type;
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
      const response = await axios.get<ApplicationResponse<LocationModel[]>>(`${EnvironmentVariables.API_BASE_ROUTE}/api/${EnvironmentVariables.API_VERSION}/locations/${this._location_type}/location_by_type`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      });

      this._status = response.status;
      this._payload = response.data.data || null;
      this._errorMessage = response.status === StatusCodes.OK ? null : response.status === StatusCodes.NOT_FOUND ? "No se encontraron hijos de la ubicación" : "Error al buscar ubicación"
    } catch(error: any) {
      const axiosError = error as AxiosError;
      this._status = StatusCodes[axiosError.response?.status as unknown as keyof typeof StatusCodes] || StatusCodes.INTERNAL_SERVER_ERROR;
      this._errorMessage = error.response.data.errors
    }
  }
}

export default GetLocationsByTypeService;
