import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import VehicleModel from "../../model";
import RegisterVehicleService from "./register";

export type RegisterVehicleProps = {
  payload: VehicleModel;
  errorMessage: string | null;
  status: StatusCodes;
  token: string | null;
}

function useRegisterVehicle() {

  const [ payloadState, setPayloadState ] = useState<RegisterVehicleProps | "not loaded">("not loaded");

  const [ isRegisteringVehicleLoading, setIsRegisteringVehicleLoading ] = useState<boolean>(false);

  async function performRegisterVehicle(data: {vehicle: VehicleModel, token: string;}, callback?: (data: RegisterVehicleProps) => void) {
    setIsRegisteringVehicleLoading(true);
    const service = new RegisterVehicleService({ vehicle: data.vehicle, token: data.token });
    await service.perform();
    const response = {
      payload: service.payload,
      errorMessage: service.errorMessage,
      status: service.status,
      token: service.token,
    };
    setPayloadState(response)
    callback && callback(response);
    setIsRegisteringVehicleLoading(false);
  }

  return {
    isRegisteringVehicleLoading,
    performRegisterVehicle,
    payloadState
  };
}

export default useRegisterVehicle;
