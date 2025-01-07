import { StatusCodes } from "http-status-codes";
import { handleUnauthorized } from "./unauthorized";
import { api } from "..";

export default api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === StatusCodes.UNAUTHORIZED)
      handleUnauthorized();
    return Promise.reject(error);
  }
);
