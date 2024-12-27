import axios from "axios";
import { StatusCodes } from "http-status-codes";

export const API_BASE_ROUTE_EXTENSION = `/api/${
  import.meta.env.VITE_API_VERSION
}`;

export type ApiResponse<T> = {
  data: T | null;
  status: StatusCodes;
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_ROUTE,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
