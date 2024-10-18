import { StatusCodes } from "http-status-codes";
import EnvironmentVariables from "../../../../helpers/environment/variables";
import CompanyModel from "../../model";

class CreateCompanyService {

  private _status: StatusCodes | null;
  private _payload: CompanyModel | null;
  private _errorMessage: string | null;
  private _token: string | null;
  private _company: CompanyModel;
  private _headers: Headers | null;
  private _user_id: number;

  constructor(data: { company: CompanyModel, token: string, user_id: number }) {
    this._company = data.company;
    this._token = data.token;
    this._user_id = data.user_id;
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

  get headers(): Headers | null {
    return this._headers
  }

  public async perform() {
    try {
      const formData = this.getFormData();

      const response = await fetch(`${EnvironmentVariables.API_BASE_ROUTE}/api/${EnvironmentVariables.API_VERSION}/companies`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${this._token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        this._status = response.status;
        this._errorMessage = Array.isArray(errorData.errors) ? errorData.errors[0] : errorData.errors;
        throw new Error(this._errorMessage || 'Error al guardar la compañía');
      }

      const data = await response.json();
      this._status = response.status;
      this._payload = data.data || null;
      this._headers = response.headers; // Fetch no tiene una forma directa de obtener los headers como Axios
    } catch (error: any) {
      this._status = error instanceof Error ? StatusCodes.INTERNAL_SERVER_ERROR : StatusCodes[error.response?.status as unknown as keyof typeof StatusCodes];
      this._errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    }
  }

  private getFormData() {
    const formData = new FormData();

    this._company.company_images!.forEach((file) => {
      formData.append(`company_images[]`, file);
    });

    formData.append('company_charter', this._company.company_charter!);

    formData.append('address', this._company.address);

    formData.append('dni', this._company.dni);

    formData.append('name', this._company.name);

    formData.append('email', this._company.email);

    formData.append('location_id', this._company.location_id!.toString());

    formData.append('user_id', this._user_id.toString());

    return formData;
  }

}

export default CreateCompanyService;
