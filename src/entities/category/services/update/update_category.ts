import { StatusCodes } from "http-status-codes";
import axios, { AxiosError } from "axios";
import CategoryModel from "../../model";
import EnvironmentVariables from "../../../../helpers/environment/variables";

class UpdateCategoryService {

  private _status: StatusCodes | null;
  private _payload: CategoryModel | null;
  private _errorMessage: string | null;
  private _category: CategoryModel;
  private _company_id: number;
  private _token: string;

  constructor(data: { category: CategoryModel, company_id: number, token: string }) {
    this._category = data.category;
    this._status = null;
    this._errorMessage = null;
    this._payload = null;
    this._company_id = data.company_id;
    this._token = data.token;
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
      const response = await axios.patch<CategoryModel>(`${EnvironmentVariables.API_BASE_ROUTE}/api/${EnvironmentVariables.API_VERSION}/categories/${this._category.id}?company_id=${this._company_id}`,
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
      this._errorMessage = response.status === StatusCodes.CREATED ? null : response.status === StatusCodes.NOT_FOUND ? "No se pudo actualizar la categoria" : "Error al actualizar la categoria"
    } catch(error: any) {
      const axiosError = error as AxiosError;
      this._status = StatusCodes[axiosError.response?.status as unknown as keyof typeof StatusCodes] || StatusCodes.INTERNAL_SERVER_ERROR;
      this._errorMessage = error.response.data.errors
    }
  }
}

export default UpdateCategoryService;
