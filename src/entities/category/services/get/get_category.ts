import { StatusCodes } from "http-status-codes";
import axios, { AxiosError } from "axios";
import CategoryModel from "../../model";
import EnvironmentVariables from "../../../../helpers/environment/variables";

class GetCategoryService {

  private _status: StatusCodes | null;
  private _payload: CategoryModel | null;
  private _errorMessage: string | null;
  private _category_id: number;

  constructor(data: { category_id: number }) {
    this._category_id = data.category_id;
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
      const response = await axios.get<CategoryModel>(`${EnvironmentVariables.API_BASE_ROUTE}/api/${EnvironmentVariables.API_VERSION}/categories/${this._category_id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      });

      this._status = response.status;
      this._payload = response.data || null;
      this._errorMessage = response.status === StatusCodes.OK ? null : response.status === StatusCodes.NOT_FOUND ? "Categoría no encontrada" : "Error al buscar la categoría"
    } catch(error: any) {
      const axiosError = error as AxiosError;
      this._status = StatusCodes[axiosError.response?.status as unknown as keyof typeof StatusCodes] || StatusCodes.INTERNAL_SERVER_ERROR;
      this._errorMessage = error.response.data.errors
    }
  }
}

export default GetCategoryService;
