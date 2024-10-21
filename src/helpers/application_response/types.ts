import { StatusCodes } from "http-status-codes";

type ApplicationResponse<T> = {
  data: T;
  status: StatusCodes;
  ok: boolean;
  message: string | string[];
  errors: string | string[];
}

export type PaginatedData<T> = {
  current_page: number;
  next_page: boolean | null;
  prev_page: boolean | null;
  total_pages: number;
  total_count: number;
  data: T[];
}

export type ErrorsMessage = {errors: string[]};


export default ApplicationResponse;
