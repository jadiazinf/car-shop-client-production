import { StatusCodes } from "http-status-codes";
import axios, { AxiosError } from "axios";
import EnvironmentVariables from "../../../../helpers/environment/variables";
import ApplicationResponse from '../../../../helpers/application_response/types';
import ModelModel from "../../model";

class GetModelsByBrandIdService {

  private _status: StatusCodes | null;
  private _payload: ModelModel[] | null;
  private _errorMessage: string | null;
  private _brand_id: number;

  constructor(data: { brand_id: number }) {
    this._brand_id = data.brand_id;
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
      const response = await axios.get<ApplicationResponse<ModelModel[]>>(`${EnvironmentVariables.API_BASE_ROUTE}/api/${EnvironmentVariables.API_VERSION}/super_admin/models/${this._brand_id}/show_models_by_brand`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      });

      this._status = response.status;
      this._payload = response.data.data || null;
      this._errorMessage = response.status === StatusCodes.OK ? null : response.status === StatusCodes.NOT_FOUND ? "Modelos no encontrados" : "Error al buscar los modelos"
    } catch(error: any) {
      const axiosError = error as AxiosError;
      this._status = StatusCodes[axiosError.response?.status as unknown as keyof typeof StatusCodes] || StatusCodes.INTERNAL_SERVER_ERROR;
      this._errorMessage = error.response.data.errors
    }
  }
}

export default GetModelsByBrandIdService;
