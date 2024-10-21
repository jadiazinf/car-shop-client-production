import { StatusCodes } from "http-status-codes";
import EnvironmentVariables from "../../../../helpers/environment/variables";

class GetCompanyCharterService {

  private _status: StatusCodes | null;
  private _payload: string | null;
  private _errorMessage: string | null;
  private _company_id: number;

  constructor(data: { company_id: number }) {
    this._company_id = data.company_id;
    this._status = null;
    this._errorMessage = null;
    this._payload = null;
  }

  get status(): StatusCodes {
    return this._status as StatusCodes;
  }

  get payload(): string | null {
    return this._payload;
  }

  get errorMessage(): string | null {
    return this._errorMessage;
  }

  public async perform() {
    try {
      const response = await fetch(`${EnvironmentVariables.API_BASE_ROUTE}/api/${EnvironmentVariables.API_VERSION}/companies/${this._company_id}/company_charter`, {
        method: 'GET',
        headers: {
          'Accept': 'application/zip'
        }
      });

      if (!response.ok) {
        this._status = response.status;
        this._errorMessage = response.status === StatusCodes.NOT_FOUND
          ? "Imágenes no encontradas"
          : "Error al buscar las imágenes";
        return;
      }

      this._status = response.status;
      const urlObject = await response.json();
      this._payload = urlObject.company_charter_url;

    } catch (error: any) {
      this._status = StatusCodes.INTERNAL_SERVER_ERROR;
      this._errorMessage = error.message || 'Error desconocido';
    }
  }
}

export default GetCompanyCharterService;
