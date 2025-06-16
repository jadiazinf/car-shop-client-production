import { StatusCodes } from "http-status-codes";
import axios, { AxiosError } from "axios";
import CategoryModel from "../../model";
import EnvironmentVariables from "../../../../helpers/environment/variables";

class CreateCategoryService {

  private _status: StatusCodes | null;
  private _payload: CategoryModel | null;
  private _errorMessage: string | null;
  private _category: CategoryModel;
  private _token: string;
  private _company_id: number;

  constructor(data: { category: CategoryModel, company_id: number, token: string }) {
    this._category = data.category;
    this._status = null;
    this._errorMessage = null;
    this._payload = null;
    this._token = data.token;
    this._company_id = data.company_id;
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
      const response = await axios.post<CategoryModel>(`${EnvironmentVariables.API_BASE_ROUTE}/api/${EnvironmentVariables.API_VERSION}/categories?company_id=${this._company_id}`,
        {
          category: this._category
        },
        {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Authorization': `Bearer ${this._token}`
        }
      });

      this._status = response.status;
      this._payload = response.data || null;
      this._errorMessage = response.status === StatusCodes.CREATED ? null : response.status === StatusCodes.NOT_FOUND ? "No se pudo crear la categoría" : "Error al crear la categoría"
    } catch(error: any) {
      const axiosError = error as AxiosError;
      this._status = StatusCodes[axiosError.response?.status as unknown as keyof typeof StatusCodes] || StatusCodes.INTERNAL_SERVER_ERROR;
      this._errorMessage = error.response.data.errors
    }
  }
}

export default CreateCategoryService;
