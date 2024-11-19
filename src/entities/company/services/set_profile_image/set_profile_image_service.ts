import { StatusCodes } from "http-status-codes";
import EnvironmentVariables from "../../../../helpers/environment/variables";
import { ErrorsMessage } from "../../../../helpers/application_response/types";

class SetCompanyProfileImageService {

  private _status: StatusCodes | null;
  private _payload: string | ErrorsMessage | null;
  private _errorMessage: string | null;
  private _image: File;
  private _company_id: number;
  private _token: string;

  constructor(data: {image: File, company_id: number, token: string}) {
    this._company_id = data.company_id;
    this._image = data.image;
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
      const response = await fetch(`${EnvironmentVariables.API_BASE_ROUTE}/api/${EnvironmentVariables.API_VERSION}/companies/${this._company_id}/set_profile_image?company_id=${this._company_id}`, {
        method: 'PATCH',
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
        throw new Error(this._errorMessage || 'Error al guardar la imagen de perfil');
      }

      const data = await response.json();
      this._status = response.status;
      this._payload = data.data || null;
    } catch(error: any) {
      this._status = error instanceof Error ? StatusCodes.INTERNAL_SERVER_ERROR : StatusCodes[error.response?.status as unknown as keyof typeof StatusCodes];
      this._errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    }
  }

  private getFormData() {
    const formData = new FormData();

    formData.append('profile_image', this._image);

    return formData;
  }

}

export default SetCompanyProfileImageService;
