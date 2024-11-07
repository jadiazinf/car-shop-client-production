import { StatusCodes } from "http-status-codes";
import axios, { AxiosError } from "axios";
import EnvironmentVariables from "../../../../helpers/environment/variables";
import ServiceModel from "../../model";
import { PaginatedData } from '../../../../helpers/application_response/types';
import Decimal from "decimal.js";

class GetAllServicesService {

  private _status: StatusCodes | null;
  private _payload: PaginatedData<ServiceModel> | null;
  private _errorMessage: string | null;
  private _company_id: number;

  constructor(props: {company_id: number}) {
    this._status = null;
    this._errorMessage = null;
    this._payload = null;
    this._company_id = props.company_id;
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

  public async perform(data: {page: number}) {
    try {
      const response = await axios.get<PaginatedData<ServiceModel>>(`${EnvironmentVariables.API_BASE_ROUTE}/api/${EnvironmentVariables.API_VERSION}/services?page=${data.page}&company_id=${this._company_id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }
      });
      const serializedData = response.data.data.map( element => ({...element, price: new Decimal(element.price)}));
      this._status = response.status;
      this._payload = {...response.data, data: serializedData};
      this._errorMessage = response.status === StatusCodes.OK ? null : response.status === StatusCodes.NOT_FOUND ? "Servicios no encontrados" : "Error al buscar los servicios"
    } catch(error: any) {
      const axiosError = error as AxiosError;
      this._status = StatusCodes[axiosError.response?.status as unknown as keyof typeof StatusCodes] || StatusCodes.INTERNAL_SERVER_ERROR;
      this._errorMessage = error.response.data.errors
    }
  }
}

export default GetAllServicesService;
