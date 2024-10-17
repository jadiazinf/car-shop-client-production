import { StatusCodes } from "http-status-codes";

type ApplicationResponse<T> = {
  data: T;
  status: StatusCodes;
  ok: boolean;
  message: string | string[];
  errors: string | string[];
}

export default ApplicationResponse;
