import { StatusCodes } from "http-status-codes";
import EnvironmentVariables from "../../../../helpers/environment/variables";
import { ErrorsMessage } from "../../../../helpers/application_response/types";
import CompanyModel from "../../model";

class UpdateCompanyService {
  private _status: StatusCodes | null;
  private _payload: CompanyModel | ErrorsMessage | null;
  private _errorMessage: string | null;
  private _company: any;
  private _company_id: number;
  private _token: string;
  private _user_id: number;

  constructor(data: {
    company: any;
    user_id: number;
    company_id: number;
    token: string;
  }) {
    this._company_id = data.company_id;
    this._company = data.company;
    this._user_id = data.user_id;
    this._token = data.token;
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
      const formData = this.getFormData();
      const response = await fetch(
        `${EnvironmentVariables.API_BASE_ROUTE}/api/${EnvironmentVariables.API_VERSION}/companies/${this._company_id}`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this._token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        this._status = response.status;
        this._errorMessage = Array.isArray(errorData.errors)
          ? errorData.errors[0]
          : errorData.errors;
        throw new Error(this._errorMessage || "Error al guardar la compañía");
      }

      const data = await response.json();
      this._status = response.status;
      this._payload = data.data || null;
    } catch (error: any) {
      this._status =
        error instanceof Error
          ? StatusCodes.INTERNAL_SERVER_ERROR
          : StatusCodes[
              error.response?.status as unknown as keyof typeof StatusCodes
            ];
      this._errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
    }
  }

  private isFile(value: any): value is File {
    return value instanceof File;
  }

  private getFormData() {
    const formData = new FormData();

    formData.append("user_id", this._user_id.toString());

    formData.append("company_id", this._company_id.toString());

    if (this._company.company_images)
      this._company.company_images!.forEach((file: File) => {
        if (this.isFile(file)) formData.append(`company_images[]`, file);
      });

    if (this.isFile(this._company.company_charter))
      if (this._company.company_charter)
        formData.append("company_charter", this._company.company_charter!);

    if (this._company.address)
      formData.append("address", this._company.address);

    if (this._company.dni) formData.append("dni", this._company.dni);

    if (this._company.name) formData.append("name", this._company.name);

    if (this._company.email) formData.append("email", this._company.email);

    if (this._company.location_id)
      formData.append("location_id", this._company.location_id!.toString());

    return formData;
  }
}

export default UpdateCompanyService;
