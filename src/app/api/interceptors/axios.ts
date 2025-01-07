import { StatusCodes } from "http-status-codes";
import { handleUnauthorized } from "./unauthorized";
import axios from "axios";

export default axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === StatusCodes.UNAUTHORIZED) {
      handleUnauthorized();
      return new Promise(() => {});
    }
    return Promise.reject(error);
  }
);
