import * as Yup from "yup";
import ValidationsConsts from "../../../consts/validations";

export function LocationSchema() {
  return Yup.object({
    address: Yup.string().required(ValidationsConsts.REQUIRED),
    location_id: Yup.number().required(ValidationsConsts.REQUIRED),
  });
}
